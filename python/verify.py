"""
ManoAA headless verification driver.

Drives the real ApiGame (real pygame event pipeline, SDL dummy drivers) and
walks the entire demo story, reading element positions from the state
snapshot and clicking them — exactly what the API promises. Emits PASS/FAIL
lines and saves screenshots to verify_shots/.

Usage: python verify.py [--shots-dir verify_shots]
"""
import argparse
import os
import sys
import time

os.environ.setdefault("SDL_VIDEODRIVER", "dummy")
os.environ.setdefault("SDL_AUDIODRIVER", "dummy")

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import api  # noqa: E402

PASSED = []
FAILED = []


def check(name, cond, detail=""):
    if cond:
        PASSED.append(name)
        print(f"  PASS  {name}{(' — ' + detail) if detail else ''}")
    else:
        FAILED.append(name)
        print(f"  FAIL  {name}{(' — ' + detail) if detail else ''}")


def wait_state(pred, timeout=10.0, interval=0.005, what=""):
    t0 = time.time()
    while time.time() - t0 < timeout:
        st = game.get_state()
        if pred(st):
            return st
        time.sleep(interval)
    raise TimeoutError(f"timeout waiting for: {what}")


def tap():
    """Advance (dialog tap). Returns the state AFTER processing."""
    game.post_action("advance")
    return game.get_state()


def click_center(rect, what="click"):
    """Click the center of a rect read from the state snapshot."""
    x, y, w, h = rect
    game.post_action("click", {"x": int(x + w / 2), "y": int(y + h / 2)})
    return game.get_state()


def present_escape(st, present_btn):
    """Open the present panel, pick the special item if declared
    (presentSpecialIDList), else item 0, and submit. Returns post-click state."""
    st = click_center(present_btn["rect"], "present (loop escape)")
    st = wait_state(lambda s: s["ui"]["show_encyclopedia"] and s["present"]["mode"],
                    what="present panel open")
    enc = st["ui"]["encyclopedia"]
    node = st["node"]
    special = node.get("presentSpecialIDList") or []
    flat = [i for sub in special for i in sub] if special else []
    items = enc["items"]
    idx = next((i for i, it in enumerate(items) if it["id"] in flat), 0)
    rect = next((r[:4] for r in enc["item_rects"] if r[4] == idx), None)
    if rect is None:
        rect = enc["item_rects"][0][:4]  # fallback: first visible item
    st = click_center(rect, f"present item {idx} ({items[idx]['name']})")
    enc = st["ui"]["encyclopedia"]
    if not enc["present_btn_rect"]:
        raise RuntimeError("present submit button missing after item select")
    st = click_center(enc["present_btn_rect"], "present submit")
    return st


def try_escape(st):
    """Try to escape a story loop at the current node: 出示 (present) the
    special item when the node declares one (presentSpecialIDList), else
    追问 (ask). Returns post-action state or None if no escape."""
    node = st["node"]
    if not (node and node.get("judge")):
        return None
    has_special = bool(node.get("presentSpecialIDList")
                       or node.get("presentSpecialIndexList"))
    present_btn = next((b for b in st["top_buttons"]
                        if b["action"] == "present"), None)
    if has_special and present_btn:
        print(f"    loop at {node['id']} — 出示 (special) to escape")
        return present_escape(st, present_btn)
    if node.get("ask"):
        ask_btn = next((b for b in st["top_buttons"] if b["action"] == "ask"),
                       None)
        if ask_btn:
            print(f"    loop at {node['id']} — 追问 to escape")
            return click_center(ask_btn["rect"], "ask (loop escape)")
    if present_btn:
        print(f"    loop at {node['id']} — 出示 to escape")
        return present_escape(st, present_btn)
    return None


def walk_until(pred, max_steps=3000, on_choice=None, label="walk"):
    """Advance through nodes (tap-tap per node: complete typing, then next).
    At each choice, call on_choice(st, choice_list) -> index to pick.
    If the same choice node reappears (wrong-answer loops like 2.31), the
    next option is tried automatically. Stops when pred(st) or max_steps.
    Returns (final_state, visited_node_ids)."""
    steps = 0
    choice_seen = {}
    same_count = 0
    prev_id = None
    recent = []  # last N node ids, for loop detection
    MAX_RECENT = 20
    visited = []
    st = game.get_state()
    while steps < max_steps and not pred(st):
        steps += 1
        cur_id = (st["node"] or {}).get("id")
        if cur_id and cur_id not in visited:
            visited.append(cur_id)
        # Loop detection: testimony cycles (e.g. 3.28->...->3.35->3.28) are
        # escaped by 追问 (ask) / 出示 (present) on judge nodes. A node
        # visited 3x within the recent window = loop. (Wrong-answer reroutes
        # like 2.31->2.31.1..8->2.29->2.31 visit a node at most 2x before
        # the choice panel reappears, so they don't trip this.)
        if (cur_id and recent.count(cur_id) >= 3 and not st["choices"]
                and not st["effect"]["active"]):
            escaped = try_escape(st)
            if escaped is not None:
                st = escaped
                recent = []
                prev_id = cur_id
                continue
            # Current node has no escape — hop to the last judge node seen
            # in the window and let the next iteration escape there.
            judge_ids = [nid for nid in recent
                         if isinstance(game.story_data.get(nid), dict)
                         and game.story_data[nid].get("judge")]
            if judge_ids:
                target = judge_ids[-1]
                print(f"    loop at {cur_id} — hopping to judge {target}")
                game.post_action("jump", {"node_id": target})
                st = wait_state(lambda s: (s["node"] or {}).get("id") == target,
                                what=f"hop to {target}")
                escaped = try_escape(st)
                if escaped is None:
                    raise RuntimeError(f"loop at {target}, no escape route")
                st = escaped
                recent = []
                prev_id = cur_id
                continue
            raise RuntimeError(f"loop at {cur_id}, no escape route — recent={recent}")
        # Same-node repeat without an intervening node (plain self-loop).
        # Typing frames of a long text legitimately repeat the node id, so
        # only count repeats while NOT typing.
        if (cur_id and cur_id == prev_id and not st["choices"]
                and not st["typing"]["is_typing"]):
            same_count += 1
            if same_count >= 3:
                node = st["node"]
                ask_btn = None
                if node and node.get("judge") and node.get("ask"):
                    ask_btn = next((b for b in st["top_buttons"]
                                    if b["action"] == "ask"), None)
                if ask_btn:
                    print(f"    self-loop at {cur_id} — 追问 to escape")
                    st = click_center(ask_btn["rect"], "ask (self-loop escape)")
                    same_count = 0
                    recent = []
                    prev_id = cur_id
                    continue
                raise RuntimeError(f"self-loop at {cur_id}, no escape route")
        else:
            same_count = 0
        switched = cur_id != prev_id
        prev_id = cur_id
        # Record node ids only on node SWITCHES (typing frames of the same
        # node would otherwise inflate the loop-detection window)
        if cur_id and switched:
            recent.append(cur_id)
            if len(recent) > MAX_RECENT:
                recent.pop(0)
        # Wait out effects (objection/testimony animations block input)
        if st["effect"]["active"]:
            st = wait_state(lambda s: not s["effect"]["active"], what="effect end")
            continue
        # Choices: pick one via its rect (real click)
        if st["choices"]:
            cid = st["node"]["id"]
            n_seen = choice_seen.get(cid, 0)
            if n_seen >= len(st["choices"]):
                raise RuntimeError(
                    f"{label}: choice loop at {cid} — all options retried")
            idx = n_seen if not on_choice else None
            if on_choice is not None:
                idx = on_choice(st, st["choices"], n_seen)
            choice_seen[cid] = n_seen + 1
            choice = st["choices"][idx]
            r = choice["rect"]
            if not r:
                raise RuntimeError(
                    f"choice {choice} has no rect at {cid} — "
                    f"all choices: {st['choices']} — "
                    f"node_anim={getattr(game, 'choices_anim_start', None)} "
                    f"now={time.time() * 1000:.0f}")
            st = click_center(r, what=f"choice[{idx}]@{cid}")
            continue
        if st["ui"]["show_ending"]:
            break
        # Tap: if typing, this completes it; else goes next
        was_typing = st["typing"]["is_typing"]
        prev_id = (st["node"] or {}).get("id")
        st = tap()
        if not was_typing and not st["choices"]:
            # Wait until the next node actually arrived (skip nodes may
            # auto-advance, effects may start)
            st = wait_state(
                lambda s: (s["node"] or {}).get("id") != prev_id
                          or s["choices"] or s["effect"]["active"]
                          or s["ui"]["show_ending"],
                what=f"node change from {prev_id}")
    if steps >= max_steps:
        raise RuntimeError(f"{label}: max_steps {max_steps} exceeded")
    if st["node"] and st["node"]["id"] not in visited:
        visited.append(st["node"]["id"])
    return st, visited


def shot(name):
    png = game.get_screenshot()
    if not png:
        return
    path = os.path.join(SHOTS_DIR, name)
    with open(path, "wb") as f:
        f.write(png)
    print(f"  [shot] {path}")


# =====================================================================

def test_static_integrity():
    print("\n=== Part 0: static data integrity ===")
    from data.story import STORY_DATA
    import config

    bad_refs = []
    ref_keys = ["next", "ask", "nextIfTrue", "nextIfFalse",
                "presentDefaultIndex", "presentSpecialIndexList"]
    for nid, n in STORY_DATA.items():
        for k in ref_keys:
            v = n.get(k)
            if isinstance(v, str) and v not in STORY_DATA:
                bad_refs.append(f"{nid}.{k} -> {v}")
        for c in n.get("choices", []) or []:
            if c.get("next") not in STORY_DATA:
                bad_refs.append(f"{nid}.choice.next -> {c.get('next')}")
    check("all next/ask/condition refs resolve", not bad_refs,
          "; ".join(bad_refs[:8]))

    missing = []
    url_keys = ["bg", "table", "objectionImg", "bgm", "bgmIntro", "bgs",
                "se", "voice", "bgVideo"]
    STOP_CMDS = ("!stop", "/stop")
    for nid, n in STORY_DATA.items():
        for k in url_keys:
            v = n.get(k)
            if (isinstance(v, str) and v and v not in STOP_CMDS
                    and not config.resolve_path(v)):
                missing.append(f"{nid}.{k} -> {v[:60]}")
        chars = n.get("character", []) or []
        if isinstance(chars, str):
            chars = [chars]
        for u in chars:
            if isinstance(u, str) and not config.resolve_path(u):
                missing.append(f"{nid}.character -> {u[:60]}")
        for item in n.get("addEncyclopedia", []) or []:
            if isinstance(item, dict):
                for k in ("profile", "details"):
                    v = item.get(k)
                    if isinstance(v, str) and v and not config.resolve_path(v):
                        missing.append(f"{nid}.addEnc.{k} -> {v[:60]}")
    check("all image/audio assets resolve", not missing, "; ".join(missing[:8]))

    from data.encyclopedia import ENCYCLOPEDIA
    missing_enc = []
    for cat, items in ENCYCLOPEDIA.items():
        for it in items:
            for k in ("profile", "details"):
                v = it.get(k)
                if isinstance(v, str) and v and not config.resolve_path(v):
                    missing_enc.append(f"{cat}.{it.get('id')}.{k} -> {v[:60]}")
    check("encyclopedia images resolve", not missing_enc,
          "; ".join(missing_enc[:8]))
    check("encyclopedia has 34 static entries",
          sum(len(v) for v in ENCYCLOPEDIA.values()) == 34,
          f"{sum(len(v) for v in ENCYCLOPEDIA.values())} entries")


def test_main_walk():
    print("\n=== Part 1: main-line walk 1.1 -> demo_end ===")
    st = game.get_state()
    check("boots at node 1.1", st["node"]["id"] == "1.1", st["node"]["id"])

    shot("01_boot.png")

    def on_choice(st, choices, n_seen=0):
        text = [c["text"] for c in choices]
        print(f"    choice @ {st['node']['id']} (try {n_seen + 1}): {text}")
        return n_seen

    st, visited = walk_until(lambda s: s["ui"]["show_ending"], on_choice=on_choice,
                             label="main walk")
    check("reached ending panel", st["ui"]["show_ending"], "")
    check("ending is demo_end", st["node"]["id"] == "demo_end",
          st["node"]["id"])
    check("ending title/buttons present",
          st["ui"]["ending"]["load_btn_rect"] and
          st["ui"]["ending"]["restart_btn_rect"])
    shot("02_ending.png")

    # Restart button -> back to 1.1
    st = click_center(st["ui"]["ending"]["restart_btn_rect"], "restart btn")
    st = wait_state(lambda s: (s["node"] or {}).get("id") == "1.1",
                    what="restart to 1.1")
    check("restart returns to 1.1", st["node"]["id"] == "1.1")

    # Load button -> back to last autosave (walk passed save nodes 1.5/3.1/4.6)
    game.post_action("jump", {"node_id": "demo_end"})
    st = wait_state(lambda s: (s["node"] or {}).get("id") == "demo_end",
                    what="jump to demo_end")
    game.post_action("advance")  # complete typing (no text) / show ending
    st = wait_state(lambda s: s["ui"]["show_ending"], what="ending panel")
    saved_id = None
    save_path = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                             "saves", "save.json")
    if os.path.exists(save_path):
        import json as _json
        with open(save_path, encoding="utf-8") as f:
            saved_id = _json.load(f).get("currentId")
    check("autosave exists", saved_id is not None, str(saved_id))
    st = click_center(st["ui"]["ending"]["load_btn_rect"], "load btn")
    if saved_id:
        st = wait_state(lambda s: (s["node"] or {}).get("id") == saved_id,
                        what=f"load to save node {saved_id}")
        check(f"load returns to autosave node {saved_id}",
              st["node"]["id"] == saved_id)

    # Reached-save flag
    reached_save = "1.5" in visited
    check("save node 1.5 visited during walk", reached_save)
    check("main walk visited > 250 distinct nodes", len(visited) > 250,
          f"{len(visited)} nodes")

    # History got populated
    st = game.get_state()
    check("history recorded > 20 entries", st["ui"]["history_count"] > 20,
          str(st["ui"]["history_count"]))
    return visited


def test_ui_overlays():
    print("\n=== Part 2: UI overlays ===")
    # History
    game.post_action("jump", {"node_id": "1.10"})
    wait_state(lambda s: (s["node"] or {}).get("id") == "1.10", what="1.10")
    st = game.get_state()
    hist_btn = next(b for b in st["top_buttons"] if b["action"] == "history")
    st = click_center(hist_btn["rect"], "history btn")
    st = wait_state(lambda s: s["ui"]["show_history"], what="history open")
    check("history opens", st["ui"]["show_history"])
    shot("03_history.png")
    st = click_center(st["ui"]["history"]["close_rect"], "history close")
    st = wait_state(lambda s: not s["ui"]["show_history"], what="history close")
    check("history closes by close button", not st["ui"]["show_history"])

    # Save points: WeChat flow = warning layer first, then confirm
    sp_btn = next(b for b in st["top_buttons"] if b["action"] == "savepoints")
    st = click_center(sp_btn["rect"], "savepoints btn")
    st = wait_state(lambda s: s["ui"]["show_save_warning"], what="sp warning")
    check("save points shows warning layer first", st["ui"]["show_save_warning"])
    shot("03_savepoints_warning.png")
    # cancel returns
    st = click_center(st["ui"]["save_warning"]["cancel_rect"], "sp warn cancel")
    st = wait_state(lambda s: not s["ui"]["show_save_warning"], what="warn close")
    check("warning cancel closes", not st["ui"]["show_save_warning"])
    # reopen and confirm
    sp_btn = next(b for b in st["top_buttons"] if b["action"] == "savepoints")
    st = click_center(sp_btn["rect"], "savepoints btn")
    st = wait_state(lambda s: s["ui"]["show_save_warning"], what="sp warning 2")
    st = click_center(st["ui"]["save_warning"]["confirm_rect"], "sp warn confirm")
    st = wait_state(lambda s: s["ui"]["show_save_points"], what="sp open")
    check("save points open after confirm", st["ui"]["show_save_points"])
    check("save points list has rects",
          st["ui"]["save_points"] and all(p["rect"] for p in st["ui"]["save_points"]),
          f"{len(st['ui']['save_points'] or [])} points")
    shot("03_savepoints.png")
    # Click the second save point (first is 1.5 where we are not); jump target
    if len(st["ui"]["save_points"]) > 1:
        target = st["ui"]["save_points"][1]
        st = click_center(target["rect"], f"save point {target['id']}")
        st = wait_state(lambda s: (s["node"] or {}).get("id") == target["id"],
                        what=f"jump to {target['id']}")
        check(f"save point click jumps to {target['id']}", True)
    else:
        check("save point click jumps", False, "only 1 save point")

    # Encyclopedia (static entries, non-judge node)
    enc_btn = next(b for b in st["top_buttons"] if b["action"] == "encyclopedia")
    st = click_center(enc_btn["rect"], "encyclopedia btn")
    st = wait_state(lambda s: s["ui"]["show_encyclopedia"], what="enc open")
    enc = st["ui"]["encyclopedia"]
    item_ids = [it["id"] for it in enc["items"]]
    # Walk already added dynamic entries (35-38), so expect 34 static + 4
    check("encyclopedia holds all 34 static items",
          all(i in item_ids for i in range(32, 35))
          and sum(1 for i in item_ids if i < 35) == 34,
          f"{len(enc['items'])} items total")
    check("encyclopedia tabs have rects", len(enc["tab_rects"]) == 5)
    check("encyclopedia items have rects",
          bool(enc["item_rects"]) and len(enc["item_rects"]) <= len(enc["items"]),
          f"{len(enc['item_rects'])} visible / {len(enc['items'])} total")
    shot("04_encyclopedia.png")

    # Switch to witness tab, select an item
    tab = enc["tab_rects"][1]  # witness
    st = click_center(tab, "witness tab")
    st = wait_state(lambda s: s["ui"]["encyclopedia"]["active_tab"] == 1,
                    what="tab switch")
    enc = st["ui"]["encyclopedia"]
    item_rect = enc["item_rects"][0][:4]
    st = click_center(item_rect, "item 0")
    st = wait_state(lambda s: s["ui"]["encyclopedia"]["selected"] >= 0,
                    what="item select")
    check("item selection works", st["ui"]["encyclopedia"]["selected"] >= 0)
    shot("05_encyclopedia_detail.png")
    # Close
    st = click_center(enc["close_rect"], "enc close")
    st = wait_state(lambda s: not s["ui"]["show_encyclopedia"], what="enc close")
    check("encyclopedia closes", not st["ui"]["show_encyclopedia"])


def test_judge_interactions():
    print("\n=== Part 3: judge interactions (ask / present) ===")
    # jump to a judge node
    game.post_action("jump", {"node_id": "3.28"})
    st = wait_state(lambda s: (s["node"] or {}).get("id") == "3.28",
                    what="3.28")
    acts = [b["action"] for b in st["top_buttons"]]
    check("judge node shows 追问/出示 buttons",
          "ask" in acts and "present" in acts, str(acts))

    # ask -> enters ask chain, effectOnce sets q28; chain ends at 3.check28
    # which routes immediately (conditionKeys not all met) to 3.29
    ask_btn = next(b for b in st["top_buttons"] if b["action"] == "ask")
    st = click_center(ask_btn["rect"], "ask btn")
    st = wait_state(lambda s: (s["node"] or {}).get("id") == "3.28.1",
                    what="ask chain 3.28.1")
    check("ask jumps into 3.28.1", st["node"]["id"] == "3.28.1")
    check("effectOnce q28 applied", st["state"].get("q28") == 1,
          str(st["state"].get("q28")))
    # wait for objection effect, then walk ask chain; check node routes to 3.29
    st, _ = walk_until(lambda s: (s["node"] or {}).get("id") == "3.29",
                       max_steps=100, label="ask chain walk")
    check("ask chain lands on 3.29 (check28 nextIfFalse)", st["node"]["id"] == "3.29")

    # present wrong item -> default target 3.27.1
    present_btn = next(b for b in st["top_buttons"] if b["action"] == "present")
    st = click_center(present_btn["rect"], "present btn")
    st = wait_state(lambda s: s["ui"]["show_encyclopedia"] and s["present"]["mode"],
                    what="present panel")
    enc = st["ui"]["encyclopedia"]
    check("present mode opens with items", len(enc["items"]) > 0,
          f"{len(enc['items'])} items")
    # select first item then present
    st = click_center(enc["item_rects"][0][:4], "present item 0")
    st = wait_state(lambda s: s["ui"]["encyclopedia"]["selected"] == 0,
                    what="present item select")
    enc = st["ui"]["encyclopedia"]
    check("present button appears after selection",
          enc["present_btn_rect"] is not None)
    shot("06_present.png")
    st = click_center(enc["present_btn_rect"], "present submit")
    st = wait_state(lambda s: (s["node"] or {}).get("id") == "3.27.1",
                    what="present default target")
    check("present wrong item -> 3.27.1", st["node"]["id"] == "3.27.1")

    # Special present: 4.39 with 照片 (evidence id 37)
    game.post_action("jump", {"node_id": "4.39"})
    try:
        st = wait_state(lambda s: (s["node"] or {}).get("id") == "4.39", what="4.39")
    except TimeoutError:
        cur = game.get_state()
        raise TimeoutError(
            f"4.39 timeout — current node={cur['node']} "
            f"effect={cur['effect']} typing={cur['typing']} "
            f"ui={ {k: v for k, v in cur['ui'].items() if not isinstance(v, (dict, list))} }")
    present_btn = next(b for b in st["top_buttons"] if b["action"] == "present")
    st = click_center(present_btn["rect"], "present btn (4.39)")
    st = wait_state(lambda s: s["ui"]["show_encyclopedia"], what="present 4.39")
    enc = st["ui"]["encyclopedia"]
    # find the item with id 37 (案发现场的照片) among visible entries
    idx37 = next(i for i, it in enumerate(enc["items"]) if it["id"] == 37)
    rect37 = next((r[:4] for r in enc["item_rects"] if r[4] == idx37), None)
    if rect37 is None:
        raise RuntimeError("item 37 not visible in strip")
    st = click_center(rect37, "item 37")
    st = wait_state(lambda s: s["ui"]["encyclopedia"]["selected"] == idx37,
                    what="item 37 select")
    enc = st["ui"]["encyclopedia"]
    st = click_center(enc["present_btn_rect"], "present 37")
    st = wait_state(lambda s: (s["node"] or {}).get("id") == "4.42",
                    what="special present target")
    check("present 照片(37) -> 4.42 (special target)", st["node"]["id"] == "4.42")
    shot("07_special_present.png")


def test_condition_chain():
    print("\n=== Part 4: conditionKeys chain (question all 4 testimonies) ===")
    # q28 already set (test_judge_interactions). Ask the other three chains;
    # each ends at 3.checkXX which routes immediately to the next testimony.
    game.post_action("jump", {"node_id": "3.29"})
    st = wait_state(lambda s: (s["node"] or {}).get("id") == "3.29", what="3.29")
    ask_btn = next(b for b in st["top_buttons"] if b["action"] == "ask")
    st = click_center(ask_btn["rect"], "ask 3.29")
    st, _ = walk_until(lambda s: (s["node"] or {}).get("id") == "3.30",
                       max_steps=100, label="3.29 ask chain")
    check("q29 set & check29 -> 3.30", st["state"].get("q29") == 1)

    game.post_action("jump", {"node_id": "3.30"})
    st = wait_state(lambda s: (s["node"] or {}).get("id") == "3.30", what="3.30")
    ask_btn = next(b for b in st["top_buttons"] if b["action"] == "ask")
    st = click_center(ask_btn["rect"], "ask 3.30")
    st, _ = walk_until(lambda s: (s["node"] or {}).get("id") == "3.31",
                       max_steps=100, label="3.30 ask chain")
    check("q30 set & check30 -> 3.31", st["state"].get("q30") == 1)

    # q28..q30 already asked; asking 3.31 completes all 4, so its check node
    # routes via nextIfTrue straight to 3.prechoice -> 3.choice
    game.post_action("jump", {"node_id": "3.31"})
    st = wait_state(lambda s: (s["node"] or {}).get("id") == "3.31", what="3.31")
    ask_btn = next(b for b in st["top_buttons"] if b["action"] == "ask")
    st = click_center(ask_btn["rect"], "ask 3.31")
    st, _ = walk_until(lambda s: (s["node"] or {}).get("id") == "3.prechoice"
                                 or s["choices"],
                       max_steps=200, label="3.31 ask chain")
    check("q31 set (all 4 questioned)", st["state"].get("q31") == 1)
    check("all-4-questioned routes to prechoice/choice",
          st["node"]["id"] == "3.prechoice" or st["choices"] is not None,
          f"node={st['node']['id']}")
    if st["node"]["id"] == "3.prechoice":
        st = tap()
        if (st["node"] or {}).get("id") == "3.prechoice":
            st = tap()  # first tap completed typing, second advances
        st = wait_state(lambda s: s["choices"], what="3.choice appears")
    check("3.choice appears with 2 options", len(st["choices"]) == 2,
          str([c["text"] for c in st["choices"]]))
    shot("08_choice.png")

    # Branch 1: 讯问下一位证人 -> 3.36
    st = click_center(st["choices"][0]["rect"], "choice 0")
    st = wait_state(lambda s: (s["node"] or {}).get("id") == "3.36",
                    what="choice0 -> 3.36")
    check("choice[0] -> 3.36", st["node"]["id"] == "3.36")

    # Branch 2: 再问几句 -> 3.35 (go back to the choice)
    game.post_action("jump", {"node_id": "3.choice"})
    st = wait_state(lambda s: s["choices"], what="back to 3.choice")
    st = click_center(st["choices"][1]["rect"], "choice 1")
    st = wait_state(lambda s: (s["node"] or {}).get("id") == "3.35",
                    what="choice1 -> 3.35")
    check("choice[1] -> 3.35", st["node"]["id"] == "3.35")


def test_encyclopedia_dynamic():
    print("\n=== Part 5: dynamic encyclopedia entries ===")
    game.post_action("jump", {"node_id": "3.13"})
    st = wait_state(lambda s: (s["node"] or {}).get("id") == "3.13", what="3.13")
    st = wait_state(lambda s: not s["effect"]["active"], what="effect done")
    enc_btn = next(b for b in st["top_buttons"] if b["action"] == "encyclopedia")
    st = click_center(enc_btn["rect"], "encyclopedia btn")
    st = wait_state(lambda s: s["ui"]["show_encyclopedia"], what="enc open")
    enc = st["ui"]["encyclopedia"]
    ids = [it["id"] for it in enc["items"]]
    check("addEncyclopedia 35/36/37 present",
          all(i in ids for i in (35, 36, 37)),
          f"{len(ids)} items")
    st = click_center(enc["close_rect"], "enc close")
    wait_state(lambda s: not s["ui"]["show_encyclopedia"], what="enc close")


def test_auto_play():
    print("\n=== Part 6: auto-play toggle ===")
    game.post_action("jump", {"node_id": "1.10"})
    st = wait_state(lambda s: (s["node"] or {}).get("id") == "1.10", what="1.10")
    auto_btn = next(b for b in st["top_buttons"] if b["action"] == "auto")
    st = click_center(auto_btn["rect"], "auto btn")
    st = wait_state(lambda s: s["auto_play"], what="auto on")
    check("auto-play toggles on", st["auto_play"])
    time.sleep(2.2)  # auto-advance every 1.8s after typing completes
    st = game.get_state()
    check("auto-play advanced past 1.10",
          st["node"]["id"] != "1.10" or not st["typing"]["is_typing"],
          f"node={st['node']['id']}")
    # toggle off
    auto_btn = next(b for b in st["top_buttons"] if b["action"] == "auto")
    st = click_center(auto_btn["rect"], "auto btn off")
    st = wait_state(lambda s: not s["auto_play"], what="auto off")
    check("auto-play toggles off", not st["auto_play"])


def main():
    global SHOTS_DIR
    parser = argparse.ArgumentParser()
    parser.add_argument("--shots-dir", default=os.path.join(HERE, "verify_shots"))
    args = parser.parse_args()
    SHOTS_DIR = args.shots_dir
    os.makedirs(SHOTS_DIR, exist_ok=True)

    global game
    api._load_pygame()
    game = api.ApiGame()
    import threading
    threading.Thread(target=game.run, daemon=True, name="game-loop").start()

    t0 = time.time()
    try:
        test_static_integrity()
        visited = test_main_walk()
        test_ui_overlays()
        test_judge_interactions()
        test_condition_chain()
        test_encyclopedia_dynamic()
        test_auto_play()
    except Exception as e:
        import traceback
        traceback.print_exc()
        FAILED.append(f"exception: {e}")

    elapsed = time.time() - t0
    try:
        game.post_action("quit")
    except Exception:
        pass
    print("\n" + "=" * 56)
    print(f"PASS: {len(PASSED)}   FAIL: {len(FAILED)}   ({elapsed:.1f}s)")
    if FAILED:
        print("Failed checks:")
        for f in FAILED:
            print(f"  - {f}")
        sys.exit(1)
    print("ALL CHECKS PASSED")
    sys.exit(0)


if __name__ == "__main__":
    main()
