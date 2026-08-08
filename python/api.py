"""
ManoAA Pygame Port — HTTP API server.

Runs the real Game in a background thread (SDL dummy driver by default) and
exposes it over a zero-dependency stdlib HTTP JSON API. All input is injected
through the real pygame event pipeline, so API clicks behave exactly like
mouse clicks.

Endpoints (all coordinates are in logical 1280x720 canvas space):
  GET  /                     HTML control panel
  GET  /api/health           {ok, node}
  GET  /api/state            full snapshot incl. every clickable element + rect
  GET  /api/nodes            node id -> {next, speaker, text...} map
  POST /api/advance          tap the dialog (complete typing / go next)
  POST /api/click            {"x": .., "y": ..}  real mouse click
  POST /api/choose           {"index": 0}        click a choice button
  POST /api/button           {"action": "auto|history|savepoints|encyclopedia|present|ask"}
  POST /api/jump             {"node_id": "3.13"}
  POST /api/restart          restart from 1.1
  POST /api/load             load autosave
  POST /api/save             manual save of current position
  POST /api/quit             stop the game thread + server
  GET  /api/screenshot.png   current rendered frame as PNG

Usage:
  python api.py [--port 8765] [--host 127.0.0.1] [--visible]
  (--visible: show a real window + audio; default is fully headless)

The API doubles as a test harness: GET /api/state returns rects for choices,
top-bar buttons, character sprites, encyclopedia tabs/items/present button,
save points and ending buttons, so a driver can read positions and click them.

Library use (e.g. the verify script):
  os.environ.setdefault("SDL_VIDEODRIVER", "dummy")
  os.environ.setdefault("SDL_AUDIODRIVER", "dummy")
  from api import _load_pygame, ApiGame
  _load_pygame()
  game = ApiGame()          # then call game.post_action(...) / get_state()
"""
import argparse
import json
import os
import sys
import tempfile
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer


def _setup_env(headless: bool):
    if headless:
        os.environ.setdefault("SDL_VIDEODRIVER", "dummy")
        os.environ.setdefault("SDL_AUDIODRIVER", "dummy")


def _setup_paths():
    HERE = os.path.dirname(os.path.abspath(__file__))
    if HERE not in sys.path:
        sys.path.insert(0, HERE)


# pygame / config / Game are imported lazily AFTER the SDL env vars are set.
pygame = None
config = None
Game = None
ApiGame = None


def _load_pygame():
    """Import pygame + main.Game + config into module scope and build ApiGame.
    Must be called after SDL_VIDEODRIVER/SDL_AUDIODRIVER env setup."""
    global pygame, config, Game, ApiGame
    if pygame is not None:
        return pygame
    _setup_paths()
    import pygame as _pg
    from main import Game as _Game
    import config as _config
    pygame, Game, config = _pg, _Game, _config
    ApiGame = _make_api_game_class()
    return pygame


def _make_api_game_class():
    """Build the ApiGame class (needs pygame imported first)."""
    API_EVENT = pygame.USEREVENT + 2

    class ApiGame(Game):
        """Game subclass that dispatches API action events on the game thread."""

        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            # Fresh snapshot built AFTER every rendered frame (game thread),
            # so element rects always match what is actually on screen.
            self._seq = 0
            self._frame_snapshot = self._build_state()
            self._pending_done = []
            # Headless: no one is watching, halve the frame rate to save CPU
            if os.environ.get("SDL_VIDEODRIVER") == "dummy":
                self.fps = 30
            # Autoplay state (driven by a background thread, see autoplay())
            self._autoplay_on = False
            self._autoplay_thread = None

        def _post_frame(self):
            self._seq += 1
            self._frame_snapshot = self._build_state()
            if self._pending_done:
                for ev in self._pending_done:
                    ev.set()
                self._pending_done.clear()

        def _handle_custom_event(self, event):
            if event.type != API_EVENT:
                return
            action = getattr(event, "action", None)
            data = getattr(event, "data", None) or {}

            if action == "advance":
                self._on_click(None)
            elif action == "click":
                self._on_click((int(data["x"]), int(data["y"])))
            elif action == "choose":
                idx = int(data["index"])
                if 0 <= idx < len(self.current_choices):
                    self._on_choose(self.current_choices[idx])
            elif action == "button":
                self._handle_button(data["action"])
            elif action == "jump":
                self.story.jump_to(data["node_id"])
            elif action == "restart":
                self._restart()
            elif action == "load":
                self._load_game()
            elif action == "save":
                self._manual_save()
            elif action == "__done__":
                # Signals the API thread that this action has been consumed;
                # the actual event is set in _post_frame AFTER the frame
                # snapshot was rebuilt, so readers see the post-action state.
                holder = data["holder"]
                holder["seen"] = True
                self._pending_done.append(holder["event"])
            elif action == "screenshot":
                holder = data["holder"]
                # pygame.image.save() can't infer format from a BytesIO and
                # falls back to TGA — save to a real .png path, then read back.
                tmp = None
                try:
                    fd, tmp = tempfile.mkstemp(suffix=".png", prefix="manoaa_")
                    os.close(fd)
                    pygame.image.save(self.screen, tmp)
                    with open(tmp, "rb") as f:
                        holder["png"] = f.read()
                finally:
                    if tmp:
                        try:
                            os.remove(tmp)
                        except OSError:
                            pass
                holder["event"].set()
            elif action == "quit":
                self.running = False

        def _manual_save(self):
            save_data = {
                "currentId": self.current_node["id"] if self.current_node else "1.1",
                "state": self.story.state.copy(),
                "history": self.story.history.copy(),
                "bgm_url": getattr(self.audio, "_bgm_loop_url", None),
                "bgm_intro_url": getattr(self.audio, "_bgm_intro_url", None),
                "bgmVolume": self.audio.bgm_volume,
            }
            self.save_manager.save(save_data)

        # ---------- helpers callable from the API thread ----------

        def post_action(self, action: str, data: dict = None):
            """Post an action event, then BLOCK until the game thread has
            consumed it AND rebuilt the frame snapshot (FIFO order)."""
            holder = {"seen": False, "event": threading.Event()}
            pygame.event.post(pygame.event.Event(
                API_EVENT, action=action, data=data or {}))
            pygame.event.post(pygame.event.Event(
                API_EVENT, action="__done__", data={"holder": holder}))
            if not holder["event"].wait(10):
                raise TimeoutError(f"game thread stalled on action: {action}")
            return self._frame_snapshot

        def post_actions(self, actions):
            """Apply a batch of actions in order; each waits for the game
            thread. Returns the final state."""
            for a in actions:
                if not isinstance(a, dict):
                    continue
                act = a.get("action")
                if not act:
                    continue
                data = a.get("data") or {}
                self.post_action(act, data)
            return self._frame_snapshot

        def wait_seq(self, since: int, timeout: float = 5.0):
            """Block until the frame seq advances past `since` (i.e. the
            game did something visible). Returns the new state, or None on
            timeout."""
            t0 = time.monotonic()
            while time.monotonic() - t0 < timeout:
                if self._seq > since:
                    return self._frame_snapshot
                time.sleep(0.02)
            return None

        # ---------- autoplay (game plays itself) ----------

        def autoplay(self, on: bool, strategy: str = "first",
                     interval: float = 0.35, max_same_node: int = 10):
            """Start/stop a background driver that plays the game itself:
            completes typing, picks choices (strategy: first|random), and
            escapes testimony loops via 追问/出示. Returns True if started."""
            if on and not self._autoplay_on:
                self._autoplay_on = True
                self._autoplay_thread = threading.Thread(
                    target=self._autoplay_loop, kwargs={
                        "strategy": strategy, "interval": interval,
                        "max_same_node": max_same_node},
                    daemon=True, name="autoplay")
                self._autoplay_thread.start()
                return True
            if not on:
                self._autoplay_on = False
                return False
            return False

        def _autoplay_loop(self, strategy="first", interval=0.35,
                           max_same_node=10):
            import random as _random
            last_node = None
            same_count = 0
            choice_counts = {}  # choice node id -> times seen (rotate options)
            recent = []         # last node ids, for loop detection
            MAX_RECENT = 20
            while self._autoplay_on:
                try:
                    st = self.get_state()
                except Exception:
                    break
                if st.get("ui", {}).get("show_ending"):
                    self._autoplay_on = False
                    print("[autoplay] reached ending panel — stopping")
                    break
                nid = (st["node"] or {}).get("id")
                switched = nid != last_node
                if switched:
                    same_count = 0
                    last_node = nid
                else:
                    same_count += 1
                # Testimony cycles span several nodes (3.28->..->3.35->3.28):
                # detect a node seen 3x within the recent window. Record only
                # node SWITCHES (typing frames would inflate the window).
                if nid and switched:
                    recent.append(nid)
                    if len(recent) > MAX_RECENT:
                        recent.pop(0)
                in_loop = (nid and recent.count(nid) >= 3
                           and not st["choices"] and not st["effect"]["active"])
                if (same_count >= max_same_node or in_loop) and st["node"]:
                    node = st["node"]
                    ask_btn = next((b for b in st["top_buttons"]
                                    if b["action"] == "ask"), None)
                    present_btn = next((b for b in st["top_buttons"]
                                        if b["action"] == "present"), None)
                    has_special = bool(node.get("presentSpecialIDList")
                                       or node.get("presentSpecialIndexList"))
                    # special item declared -> present it (4.39 照片 -> 4.42);
                    # otherwise 追问 the testimony
                    if has_special and present_btn:
                        self.post_action("button", {"action": "present"})
                        try:
                            s2 = self.get_state()
                            enc = s2["ui"]["encyclopedia"]
                            special = node.get("presentSpecialIDList") or []
                            flat = [i for sub in special for i in sub]
                            items = enc["items"]
                            idx = next((i for i, it in enumerate(items)
                                        if it["id"] in flat), 0)
                            r = next((r5[:4] for r5 in enc["item_rects"]
                                      if r5[4] == idx), None)
                            if r:
                                self.post_action("click", {"x": r[0] + r[2] // 2,
                                                           "y": r[1] + r[3] // 2})
                                s3 = self.get_state()
                                pbtn = s3["ui"]["encyclopedia"]["present_btn_rect"]
                                if pbtn:
                                    self.post_action("click", {
                                        "x": pbtn[0] + pbtn[2] // 2,
                                        "y": pbtn[1] + pbtn[3] // 2})
                        except Exception:
                            pass
                    elif ask_btn:
                        self.post_action("button", {"action": "ask"})
                    elif present_btn:
                        self.post_action("button", {"action": "present"})
                        # fallback: present the first visible item
                        try:
                            s2 = self.get_state()
                            enc = s2["ui"]["encyclopedia"]
                            if enc["item_rects"]:
                                r = enc["item_rects"][0][:4]
                                self.post_action("click", {"x": r[0] + r[2] // 2,
                                                           "y": r[1] + r[3] // 2})
                                s3 = self.get_state()
                                pbtn = s3["ui"]["encyclopedia"]["present_btn_rect"]
                                if pbtn:
                                    self.post_action("click", {
                                        "x": pbtn[0] + pbtn[2] // 2,
                                        "y": pbtn[1] + pbtn[3] // 2})
                        except Exception:
                            pass
                    same_count = 0
                    continue
                # normal driving
                if st["effect"]["active"]:
                    pass  # wait it out
                elif st["choices"]:
                    n = len(st["choices"])
                    seen = choice_counts.get(nid, 0)
                    choice_counts[nid] = seen + 1
                    if strategy == "random":
                        idx = _random.randrange(n)
                    else:
                        # rotate options on revisit: wrong-answer reroutes
                        # (e.g. 2.31) return to the same choice node, so the
                        # next option gets tried instead of looping forever
                        idx = seen % n
                    self.post_action("choose", {"index": idx})
                elif st["typing"]["is_typing"]:
                    self.post_action("advance")  # complete typing
                elif st["typing"]["show_hint"]:
                    self.post_action("advance")  # advance to next node
                else:
                    # no text / no hint (skip nodes, judge nodes)
                    self.post_action("advance")
                time.sleep(interval)

        def get_state(self) -> dict:
            # Read the snapshot built on the game thread after the last
            # rendered frame; no cross-thread mutation.
            return self._frame_snapshot

        def get_screenshot(self) -> bytes:
            holder = {"png": None, "event": threading.Event()}
            self.post_action("screenshot", {"holder": holder})
            if not holder["event"].wait(10):
                return None
            return holder["png"]

        # ---------- state snapshot (runs on game thread) ----------

        def _build_state(self) -> dict:
            g = self
            node = g.current_node
            node_info = None
            if node:
                node_info = {
                    "id": node.get("id"),
                    "speaker": node.get("speaker", ""),
                    "text": node.get("text", ""),
                    "next": node.get("next"),
                    "judge": bool(node.get("judge")),
                    "ask": node.get("ask"),
                    "isEnding": bool(node.get("isEnding")),
                    "presentSpecialIDList": node.get("presentSpecialIDList"),
                    "presentSpecialIndexList": node.get("presentSpecialIndexList"),
                    "presentDefaultIndex": node.get("presentDefaultIndex"),
                }

            choices = []
            if g.show_choices:
                for i, c in enumerate(g.current_choices):
                    r = c.get("_rect")
                    choices.append({
                        "index": i,
                        "text": c.get("text", ""),
                        "next": c.get("next"),
                        "rect": [r.x, r.y, r.w, r.h] if r else None,
                    })

            top_buttons = []
            for rect, action in g._top_buttons:
                label = None
                for l, a in [("自动播放" if not g.auto_play else "关闭自动", "auto"),
                             ("历史", "history"), ("存档点", "savepoints"),
                             ("图鉴", "encyclopedia"), ("出示", "present"),
                             ("追问", "ask")]:
                    if a == action:
                        label = l
                        break
                top_buttons.append({
                    "label": label, "action": action,
                    "rect": [rect.x, rect.y, rect.w, rect.h],
                })

            # Character sprite rects (same container math as Renderer)
            if g.court_mode in ("left", "right"):
                container_bottom = config.WINDOW_HEIGHT
            else:
                container_bottom = config.WINDOW_HEIGHT + int(
                    config.WINDOW_HEIGHT * abs(config.CHARACTER_WRAP_BOTTOM))
            characters = []
            for s in g.char_manager.sprites:
                r = s.get_rect(0, container_bottom)
                characters.append({
                    "src": s.src,
                    "id": s.id,
                    "rect": [r.x, r.y, r.w, r.h] if r.width > 0 else None,
                    "opacity": s.opacity,
                    "anim": s.anim_class,
                })

            enc = None
            if g.ui.show_encyclopedia:
                enc = {
                    "items": [
                        {"id": it.get("id"), "name": it.get("name", "???"),
                         "type": it.get("type", "evidence")}
                        for it in g.ui.enc_items
                    ],
                    "active_tab": g.ui.enc_active_tab,
                    "selected": g.ui.enc_selected,
                    "scroll": g.ui.enc_scroll,
                    "tab_rects": [[r.x, r.y, r.w, r.h] for r in
                                  getattr(g.ui, "_tab_rects", [])],
                    "item_rects": [[r.x, r.y, r.w, r.h, idx] for r, idx in
                                   getattr(g.ui, "_enc_item_rects", [])],
                    "close_rect": _rect4(getattr(g.ui, "_enc_close_rect", None)),
                    "present_btn_rect": _rect4(getattr(g.ui, "_present_btn_rect", None)),
                }

            save_points = None
            if g.ui.show_save_points:
                save_points = []
                for n in g.save_nodes:
                    r = n.get("_save_rect")
                    save_points.append({
                        "id": n.get("id"),
                        "title": n.get("saveTitle", n.get("id", "")),
                        "desc": n.get("saveDesc", ""),
                        "rect": [r.x, r.y, r.w, r.h] if r else None,
                    })

            ending = None
            if g.ui.show_ending:
                ending = {
                    "title": g.ui.ending_title,
                    "text": g.ui.ending_text,
                    "load_btn_rect": _rect4(getattr(g.ui, "_ending_load_btn", None)),
                    "restart_btn_rect": _rect4(getattr(g.ui, "_ending_restart_btn", None)),
                }

            return {
                "seq": self._seq,
                "canvas": [config.WINDOW_WIDTH, config.WINDOW_HEIGHT],
                "node": node_info,
                "typing": {
                    "is_typing": g.is_typing,
                    "progress": g.typing_index,
                    "display_text": g.display_text,
                    "show_hint": g.show_hint,
                },
                "choices": choices,
                "top_buttons": top_buttons,
                "characters": characters,
                "bg": g.current_bg,
                "court_mode": g.court_mode,
                "table": g.table_image,
                "effect": {
                    "active": g.effects.active,
                    "type": g.effects.effect_type,
                    "phase": g.effects.phase,
                },
                "dark": {"mode": g.dark_mode, "opacity": g.dark_opacity},
                "auto_play": g.auto_play,
                "present": {
                    "mode": g.present_mode,
                    "forced": g.present_forced,
                },
                "ui": {
                    "show_encyclopedia": g.ui.show_encyclopedia,
                    "show_history": g.ui.show_history,
                    "show_save_points": g.ui.show_save_points,
                    "show_save_warning": g.ui.show_save_warning,
                    "show_ending": g.ui.show_ending,
                    "history": {
                        "close_rect": _rect4(getattr(g.ui, "_hist_close_rect", None)),
                    },
                    "save_warning": {
                        "confirm_rect": _rect4(getattr(g.ui, "_sp_warn_confirm_rect", None)),
                        "cancel_rect": _rect4(getattr(g.ui, "_sp_warn_cancel_rect", None)),
                    },
                    "encyclopedia": enc,
                    "save_points": save_points,
                    "ending": ending,
                    "history_count": len(g.story.history),
                },
                "state": dict(g.story.state),
                "has_save": g.save_manager.has_save(),
            }

    return ApiGame


def _rect4(r):
    if r is None:
        return None
    return [r.x, r.y, r.w, r.h]


# ============================ HTTP layer ============================

def make_handler(game):
    class Handler(BaseHTTPRequestHandler):
        def log_message(self, fmt, *args):
            sys.stderr.write("[api] %s\n" % (fmt % args))

        def _send_json(self, obj, status=200):
            body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def _send_png(self, png: bytes):
            self.send_response(200)
            self.send_header("Content-Type", "image/png")
            self.send_header("Content-Length", str(len(png)))
            self.end_headers()
            self.wfile.write(png)

        def _read_json(self):
            try:
                length = int(self.headers.get("Content-Length", 0))
            except ValueError:
                length = 0
            if length <= 0:
                return {}
            raw = self.rfile.read(length)
            try:
                return json.loads(raw.decode("utf-8"))
            except Exception:
                return {}

        def do_GET(self):
            path_only = self.path.split("?", 1)[0]
            if path_only in ("/", "/index.html"):
                panel = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                     "api_panel.html")
                try:
                    with open(panel, encoding="utf-8") as f:
                        body = f.read().encode("utf-8")
                    self.send_response(200)
                    self.send_header("Content-Type", "text/html; charset=utf-8")
                    self.send_header("Content-Length", str(len(body)))
                    self.end_headers()
                    self.wfile.write(body)
                    return
                except OSError:
                    self._send_json({"error": "panel missing"}, 500)
                    return
            elif self.path == "/api/health":
                self._send_json({"ok": True, "node": game.current_node["id"]
                                 if game.current_node else None})
            elif self.path.startswith("/api/poll"):
                import urllib.parse
                qs = urllib.parse.parse_qs(self.path.split("?", 1)[1]
                                           if "?" in self.path else "")
                since = int(qs.get("since", ["0"])[0] or 0)
                try:
                    timeout = float(qs.get("timeout", ["5"])[0])
                except ValueError:
                    timeout = 5.0
                st = game.wait_seq(since, timeout)
                if st is None:
                    # no change within window — return current state anyway
                    st = game.get_state()
                self._send_json({"ok": True, "seq": st.get("seq", 0),
                                 "state": st})
            elif self.path == "/api/state":
                self._send_json(game.get_state())
            elif self.path == "/api/nodes":
                nodes = {}
                for nid, n in game.story_data.items():
                    if isinstance(n, dict):
                        nodes[nid] = {
                            "next": n.get("next"),
                            "speaker": n.get("speaker", ""),
                            "text": (n.get("text") or "")[:60],
                            "judge": bool(n.get("judge")),
                            "save": bool(n.get("save")),
                            "isEnding": bool(n.get("isEnding")),
                        }
                self._send_json(nodes)
            elif self.path.split("?", 1)[0] == "/api/screenshot.png":
                png = game.get_screenshot()
                if png:
                    self._send_png(png)
                else:
                    self._send_json({"error": "screenshot timeout"}, 500)
            elif self.path == "/favicon.ico":
                self.send_response(204)
                self.end_headers()
            else:
                self._send_json({"error": "not found"}, 404)

        def do_POST(self):
            data = self._read_json()
            if self.path == "/api/advance":
                game.post_action("advance")
            elif self.path == "/api/click":
                game.post_action("click", {"x": data.get("x", 0),
                                           "y": data.get("y", 0)})
            elif self.path == "/api/choose":
                game.post_action("choose", {"index": data.get("index", 0)})
            elif self.path == "/api/button":
                game.post_action("button", {"action": data.get("action", "")})
            elif self.path == "/api/jump":
                game.post_action("jump", {"node_id": data.get("node_id", "")})
            elif self.path == "/api/restart":
                game.post_action("restart")
            elif self.path == "/api/load":
                game.post_action("load")
            elif self.path == "/api/save":
                game.post_action("save")
            elif self.path == "/api/run":
                game.post_actions(data.get("actions", []))
            elif self.path == "/api/autoplay":
                started = game.autoplay(
                    bool(data.get("on")),
                    strategy=data.get("strategy", "first"),
                    interval=float(data.get("interval", 0.35)))
                self._send_json({"ok": True, "autoplay": game._autoplay_on,
                                 "started": started})
                return
            elif self.path == "/api/quit":
                game.post_action("quit")
                threading.Thread(target=lambda: os._exit(0),
                                 daemon=True).start()
            else:
                self._send_json({"error": "not found"}, 404)
                return
            self._send_json({"ok": True})

    return Handler


def start_server(game, host="127.0.0.1", port=8765):
    server = ThreadingHTTPServer((host, port), make_handler(game))
    t = threading.Thread(target=server.serve_forever, daemon=True,
                         name="api-http")
    t.start()
    return server


def main():
    parser = argparse.ArgumentParser(description="ManoAA headless game API")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--visible", action="store_true",
                        help="show a real window with audio (default: headless)")
    args = parser.parse_args()

    _setup_paths()
    _setup_env(headless=not args.visible)  # MUST precede pygame import
    _load_pygame()

    game = ApiGame()
    threading.Thread(target=game.run, daemon=True, name="game-loop").start()

    server = start_server(game, args.host, args.port)
    print(f"[api] ManoAA API listening on http://{args.host}:{args.port} "
          f"(headless={not args.visible})")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
        game.running = False


if __name__ == "__main__":
    main()
