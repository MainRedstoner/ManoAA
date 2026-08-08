"""
ManoAA Pygame Port — Story Engine
Processes story nodes, handles state transitions, effects, and choices.
"""
import time
import pygame
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import config


class StoryEngine:
    def __init__(self, game):
        self.game = game  # Reference to main Game instance
        self.state = {}   # Game state (favorability, q-keys, etc.)
        self.history = []  # Dialog history

    def jump_to(self, node_id: str):
        """Navigate to a story node by ID."""
        node = self.game.story_data.get(node_id)
        if not node:
            print(f"[Story] Node not found: {node_id}")
            return

        self.game.current_node = node
        self._process_node(node)

    def go_next(self):
        """Advance to the next node."""
        if not self.game.current_node:
            return
        next_id = self.game.current_node.get("next")
        if next_id:
            self.jump_to(next_id)

    def _process_node(self, node: dict):
        """Process all aspects of a story node."""
        game = self.game

        # Mark when this node started displaying (renderer animations)
        game.node_anim_start = pygame.time.get_ticks()

        # --- State effects ---
        effect = node.get("effect", {})
        self.apply_effect(effect)

        effect_once = node.get("effectOnce", {})
        self.apply_effect_once(effect_once)

        # --- Ending check ---
        if node.get("endingCheck"):
            self.handle_ending_check()
            return

        # --- Condition keys ---
        cond_keys = node.get("conditionKeys", [])
        if cond_keys:
            all_met = all(self.state.get(k, 0) >= 1 for k in cond_keys)
            target = node.get("nextIfTrue") if all_met else node.get("nextIfFalse")
            if target:
                self.jump_to(target)
                return

        # --- Court mode ---
        court = node.get("court", "")
        if court == "mid":
            game.court_mode = "mid"
            game.char_height = int(config.WINDOW_HEIGHT * config.CHARACTER_HEIGHT_RATIO)
        elif court in ("left", "right"):
            game.court_mode = court
            game.char_height = int(config.WINDOW_HEIGHT * config.COURT_CHAR_HEIGHT_RATIO)
        else:
            game.court_mode = ""
            game.char_height = int(config.WINDOW_HEIGHT * config.CHARACTER_HEIGHT_RATIO)

        # --- Dark fade ---
        dark = node.get("dark")
        if dark:
            duration = node.get("darkDuration", 1000)
            game.start_dark_fade(dark, duration)

        # --- Character sprites ---
        character_urls = node.get("character")
        if character_urls is not None:
            if isinstance(character_urls, str):
                character_urls = [character_urls]
            game.char_manager.set_characters(character_urls, game.char_height)
        else:
            game.char_manager.clear()  # No character in this node — clear sprites
        game.char_manager.recalc_all(game.char_height)

        # --- Table ---
        table = node.get("table", "")
        game.table_image = table if table else ""

        # --- Background ---
        bg = node.get("bg", "")
        bg_video = node.get("bgVideo", "")
        if bg_video:
            game.current_bg = bg_video
        elif bg:
            game.current_bg = bg
        else:
            game.current_bg = ""  # Clear bg when node doesn't set one

        # --- Choices ---
        game.show_choices = bool(node.get("choices"))
        game.current_choices = node.get("choices", [])
        if game.show_choices:
            game.choices_anim_start = pygame.time.get_ticks()

        # --- Audio ---
        audio = game.audio
        bgm = node.get("bgm")
        if bgm == "!stop":
            audio.stop_bgm()
        elif bgm == "/stop":
            audio.fade_out_bgm()
        elif bgm:
            intro = node.get("bgmIntro")
            vol = node.get("bgmVolume", config.BGM_VOLUME_DEFAULT)
            audio.play_bgm(bgm, intro, vol)
        elif "bgmVolume" in node:
            audio.set_bgm_volume(node["bgmVolume"])

        bgs = node.get("bgs")
        if bgs == "!stop":
            audio.stop_bgs()
        elif bgs == "/stop":
            audio.fade_out_bgs()
        elif bgs:
            vol = node.get("bgsVolume", 0.5)
            audio.play_bgs(bgs, vol)

        se = node.get("se", "")
        if se:
            audio.play_se(se)

        voice = node.get("voice", "")
        if voice:
            audio.play_voice(voice)

        # --- Objection / Testimony Effects ---
        objection_img = node.get("objectionImg", "")
        if objection_img:
            is_testimony = any(kw in str(objection_img) for kw in
                ["testimony_start", "testimony_end", "cross_examination_start"])
            # Play SE for testimony effects later in the effect itself
            if not is_testimony:
                game.effects.start(objection_img)
            else:
                game.effects.start(objection_img, se)
                # Don't play se twice — effects engine handles it for testimony
                se = ""  # mark as handled
        else:
            # New scene with no effect: cancel any leftover one so it can't
            # linger over the new node or block input
            game.effects.cancel()

        # --- Present system ---
        if node.get("judge"):
            game.present_mode = False
            game.present_forced = bool(node.get("presentForced"))
            game._present_special_ids = node.get("presentSpecialIDList", []) or []
            game._present_special_targets = node.get("presentSpecialIndexList", []) or []
            game._present_default_target = node.get("presentDefaultIndex", "")
            if game.present_forced:
                game.show_choices = False
                game.current_choices = []

        # --- Text ---
        game.speaker = node.get("speaker", "")
        game.current_text = node.get("text", "")

        # --- addEncyclopedia ---
        add_enc = node.get("addEncyclopedia")
        if add_enc:
            items = add_enc if isinstance(add_enc, list) else [add_enc]
            for item in items:
                cat = item.get("type", "evidence")
                if cat in game.encyclopedia:
                    # Don't add duplicates by id
                    eid = item.get("id")
                    if not any(e.get("id") == eid for e in game.encyclopedia[cat]):
                        game.encyclopedia[cat].append(item)
        game.is_typing = True
        game.typing_index = 0
        game.typing_timer = 0
        game.display_text = ""

        # --- Skip ---
        game.skip_delay = node.get("skip", 0)
        game.skip_timer = 0  # Don't start counting until typing completes
        # If node has skip but no text, start timer immediately
        if not game.current_text and isinstance(game.skip_delay, (int, float)) and game.skip_delay > 0:
            game.is_typing = False
            game.show_hint = False
            delay = max(game.skip_delay, 0.5)
            game.skip_timer = pygame.time.get_ticks() + int(delay * 1000)

        # --- Hints ---
        game.show_hint = False  # Will be set after typing completes

        # --- Save ---
        if node.get("save"):
            save_data = {
                "currentId": node.get("id"),
                "state": self.state.copy(),
                "history": self.history.copy(),
                "bgm_url": getattr(game.audio, '_bgm_loop_url', None),
                "bgm_intro_url": getattr(game.audio, '_bgm_intro_url', None),
                "bgmVolume": game.audio.bgm_volume,
            }
            game.save_manager.save(save_data)
            print(f"[存档] 已保存: {node.get('id')}")

        # --- Ending ---
        if node.get("isEnding"):
            game.ui.show_ending = True
            game.ui.ending_title = node.get("endingTitle", "")
            game.ui.ending_text = node.get("endingText", "")

        # --- Choices ---
        game.show_choices = bool(game.current_choices)

    def apply_effect(self, effect: dict):
        """Apply cumulative state changes."""
        for k, v in effect.items():
            if k not in self.state:
                self.state[k] = 0
            self.state[k] += v

    def apply_effect_once(self, effect: dict):
        """Apply state changes only if key hasn't been set."""
        for k, v in effect.items():
            if k not in self.state:
                self.state[k] = v

    def handle_ending_check(self):
        """Check favorability and route to appropriate ending.
        Matches WeChat index.js handleEndingCheck: >=5 -> 102, >=3 -> 101, else 100."""
        fav = self.state.get("favorability", 0)
        if fav >= 5:
            self.jump_to("102")
        elif fav >= 3:
            self.jump_to("101")
        else:
            self.jump_to("100")

    def record_history(self, speaker: str, text: str):
        self.history.append({"speaker": speaker, "text": text})
