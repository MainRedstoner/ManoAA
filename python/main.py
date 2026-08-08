"""
ManoAA Pygame Port — Main Entry Point & Game Class
Full visual novel engine: story, characters, court, effects, present, encyclopedia.
"""
import pygame
import sys
import time
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from engine.story import StoryEngine
from engine.character import CharacterManager
from engine.renderer import Renderer
from engine.audio import AudioEngine
from engine.save import SaveManager
from engine.effects import EffectsEngine
from engine.ui import UIManager
import config


class Game:
    def __init__(self):
        pygame.init()
        self.screen = pygame.display.set_mode((config.WINDOW_WIDTH, config.WINDOW_HEIGHT))
        pygame.display.set_caption("魔法少女的逆转裁判")
        self.clock = pygame.time.Clock()
        self.running = True
        self.fps = config.FPS  # ApiGame lowers this in headless mode

        # Subsystems
        self.audio = AudioEngine()
        self.char_manager = CharacterManager()
        self.renderer = Renderer()
        self.save_manager = SaveManager()
        self.effects = EffectsEngine()
        self.ui = UIManager()
        self.story = StoryEngine(self)

        # Load story data
        from data.story import STORY_DATA
        self.story_data = STORY_DATA

        # --- Core State ---
        self.current_node = None
        self.current_bg = ""
        self.court_mode = ""
        self.table_image = ""
        self.char_height = int(config.WINDOW_HEIGHT * config.CHARACTER_HEIGHT_RATIO)
        self.speaker = ""
        self.current_text = ""
        self.display_text = ""
        self.is_typing = False
        self.typing_index = 0
        self.typing_timer = 0
        self.show_hint = False
        self.show_choices = False
        self.current_choices = []
        self._top_buttons = []

        # --- Dark Fade ---
        self.dark_opacity = 0
        self.dark_mode = ""
        self.dark_start = 0
        self.dark_duration = 1000

        # --- Skip / Auto ---
        self.skip_timer = 0
        self.auto_play = False
        self.auto_play_timer = 0

        # --- Animation timestamps (renderer reads these) ---
        self.node_anim_start = 0          # when current node began showing
        self.choices_anim_start = 0       # when the choice panel appeared
        self.mouse_pos = None             # for hover effects

        # --- Present Mode ---
        self.present_mode = False
        self.present_forced = False
        self._present_special_ids = []
        self._present_special_targets = []
        self._present_default_target = ""

        # --- Encyclopedia items (built from story data + dynamic adds) ---
        self.encyclopedia = {"evidence": [], "witness": [], "map": [], "rule": [], "record": []}
        self._load_encyclopedia()

        # --- History ---
        self.history_list = []

        # --- Save point nodes ---
        self.save_nodes = [n for n in self.story_data.values()
                          if isinstance(n, dict) and n.get("save")]

        # Start
        self._show_splash()
        self.story.jump_to("1.1")

    def _show_splash(self):
        """Show a brief splash screen so the user knows the game loaded."""
        self.screen.fill((20, 15, 40))
        title_font = None
        for fpath in [
            os.path.join(config.ASSETS_DIR, "simsun.ttc"),
            "C:/Windows/Fonts/simhei.ttf",
        ]:
            try:
                title_font = pygame.font.Font(fpath, 32)
                break
            except:
                continue
        if not title_font:
            title_font = pygame.font.Font(None, 32)
        title = title_font.render("魔法少女的逆转裁判", True, (220, 200, 255))
        sub = pygame.font.Font(None, 20).render("ManosabaAA — Pygame Port", True, (180, 160, 210))
        self.screen.blit(title, ((config.WINDOW_WIDTH - title.get_width()) // 2, config.WINDOW_HEIGHT // 2 - 40))
        self.screen.blit(sub, ((config.WINDOW_WIDTH - sub.get_width()) // 2, config.WINDOW_HEIGHT // 2 + 10))
        pygame.display.flip()
        pygame.time.wait(800)

    def _load_encyclopedia(self):
        """Load static encyclopedia entries (ported from wechat/data/encyclopedia.js).
        Dynamic entries (addEncyclopedia fields) are merged in by StoryEngine."""
        from data.encyclopedia import ENCYCLOPEDIA
        for cat, items in ENCYCLOPEDIA.items():
            for item in items:
                eid = item.get("id")
                if not any(e.get("id") == eid for e in self.encyclopedia.get(cat, [])):
                    self.encyclopedia.setdefault(cat, []).append(item)

    def run(self):
        while self.running:
            # clock.tick() returns MILLISECONDS — convert to seconds for dt
            dt = self.clock.tick(self.fps) / 1000.0

            self._handle_events()
            self._update(dt)
            self._render()
            pygame.display.flip()
            self._post_frame()

        pygame.quit()

    def _post_frame(self):
        """Hook called after each rendered frame. API/test drivers override."""
        pass

    # ========== Events ==========

    def _handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False

            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    if self.ui.show_encyclopedia:
                        self.ui.close_encyclopedia()
                    elif self.ui.show_history:
                        self.ui.show_history = False
                    elif self.ui.show_save_points:
                        self.ui.show_save_points = False
                    else:
                        self.running = False
                elif event.key in (pygame.K_SPACE, pygame.K_RETURN):
                    self._on_click(None)

            elif event.type == pygame.MOUSEBUTTONDOWN:
                if event.button == 1:
                    self._on_click(event.pos)
                elif event.button == 4:  # Scroll up
                    if self.ui.show_history:
                        self.ui.history_scroll = max(0, self.ui.history_scroll - 1)
                    elif self.ui.show_encyclopedia:
                        self.ui.enc_scroll = max(0, self.ui.enc_scroll - 1)
                elif event.button == 5:  # Scroll down
                    if self.ui.show_history:
                        self.ui.history_scroll += 1
                    elif self.ui.show_encyclopedia:
                        self.ui.enc_scroll += 1

            elif event.type == pygame.MOUSEMOTION:
                self.mouse_pos = event.pos

            elif event.type == pygame.USEREVENT + 1:
                self.audio.check_intro_end()

            elif event.type >= pygame.USEREVENT + 2:
                self._handle_custom_event(event)

    def _handle_custom_event(self, event):
        """Extension hook for API/test drivers to inject actions.
        api.ApiGame overrides this to dispatch API commands."""
        pass

    def _on_click(self, pos):
        # --- UI overlays take priority ---
        if self.ui.show_ending:
            self._handle_ending_click(pos)
            return

        if self.ui.show_save_warning:
            self._handle_save_warning_click(pos)
            return

        if self.ui.show_save_points:
            self._handle_save_point_click(pos)
            return

        if self.ui.show_encyclopedia:
            self._handle_encyclopedia_click(pos)
            return

        if self.ui.show_history:
            self._handle_history_click(pos)
            return

        # --- Effect playing ---
        if self.effects.active:
            return  # Block input during effects

        # --- Top bar buttons ---
        if pos:
            for rect, action in self._top_buttons:
                if rect.collidepoint(pos):
                    self._handle_button(action)
                    return

        # --- Choices ---
        if self.show_choices and pos:
            for choice in self.current_choices:
                rect = choice.get("_rect")
                if rect and rect.collidepoint(pos):
                    self._on_choose(choice)
                    return
            return

        # --- Dialog tap ---
        self._on_dialog_tap()

    def _handle_button(self, action: str):
        if action == "auto":
            self.auto_play = not self.auto_play
        elif action == "history":
            self.ui.show_history = True
            self.ui.history_scroll = 0
        elif action == "savepoints":
            self.ui.show_save_warning = True  # WeChat: warn before list
        elif action == "encyclopedia":
            self._open_encyclopedia()
        elif action == "ask":
            if self.current_node and self.current_node.get("ask"):
                self.story.jump_to(self.current_node["ask"])
        elif action == "present":
            self._open_encyclopedia(present_mode=True)

    def _on_dialog_tap(self):
        if self.show_choices or self.effects.active:
            return
        if self.present_forced:
            return
        if self.is_typing:
            self.display_text = self.current_text
            self.is_typing = False
            self.show_hint = self._compute_show_hint()
            self.story.record_history(self.speaker, self.current_text)
            self._start_skip_timer()
            return
        if self.current_node and self.current_node.get("isEnding"):
            return
        self.story.go_next()

    def _on_choose(self, choice: dict):
        effect = choice.get("effect", {})
        self.story.apply_effect(effect)
        self.story.record_history("选项", choice.get("text", ""))
        self.show_choices = False
        self.current_choices = []
        next_id = choice.get("next")
        if next_id:
            self.story.jump_to(next_id)

    # ========== Encyclopedia ==========

    def _open_encyclopedia(self, present_mode: bool = False):
        if present_mode:
            self.present_mode = True
        all_items = []
        for cat in self.ui.enc_tabs:
            for it in self.encyclopedia.get(cat, []):
                # Tag each item with its category so the UI can filter by tab
                item = dict(it)
                item["type"] = item.get("type", cat)
                all_items.append(item)
        self.ui.open_encyclopedia(all_items)

    def _handle_encyclopedia_click(self, pos):
        if not pos:
            return

        # Close button
        if hasattr(self.ui, '_enc_close_rect') and self.ui._enc_close_rect.collidepoint(pos):
            self.ui.close_encyclopedia()
            self.present_mode = False
            return

        # Tab buttons
        if hasattr(self.ui, '_tab_rects'):
            for i, rect in enumerate(self.ui._tab_rects):
                if rect.collidepoint(pos):
                    self.ui.enc_active_tab = i
                    self.ui.enc_selected = -1
                    self.ui.enc_scroll = 0
                    return

        # Item selection
        if hasattr(self.ui, '_enc_item_rects'):
            for rect, idx in self.ui._enc_item_rects:
                if rect.collidepoint(pos):
                    self.ui.enc_selected = idx
                    return

        # Present button
        if (self.present_mode and hasattr(self.ui, '_present_btn_rect') and
                self.ui._present_btn_rect.collidepoint(pos)):
            self._do_present(self.ui.enc_selected)

    def _do_present(self, item_idx: int):
        """Execute present logic when player presents evidence."""
        self.ui.close_encyclopedia()
        self.present_mode = False

        if item_idx < 0:
            return

        # Get the actual encyclopedia item
        all_items = []
        for cat in self.ui.enc_tabs:
            all_items.extend(self.encyclopedia.get(cat, []))

        if item_idx >= len(all_items):
            # Default fallback
            if self._present_default_target:
                self.story.jump_to(self._present_default_target)
            return

        item = all_items[item_idx]
        item_id = item.get("id")

        # Check if this item is a special present target
        if self._present_special_ids and self._present_special_targets:
            for i, id_list in enumerate(self._present_special_ids):
                if item_id in id_list:
                    target = self._present_special_targets[i]
                    if target:
                        self.story.jump_to(target)
                        return

        # Default present target
        if self._present_default_target:
            self.story.jump_to(self._present_default_target)

    # ========== Save Points ==========

    def _handle_save_warning_click(self, pos):
        if not pos:
            return
        if (hasattr(self.ui, '_sp_warn_confirm_rect')
                and self.ui._sp_warn_confirm_rect.collidepoint(pos)):
            self.ui.show_save_warning = False
            self.ui.show_save_points = True
            return
        if (hasattr(self.ui, '_sp_warn_cancel_rect')
                and self.ui._sp_warn_cancel_rect.collidepoint(pos)):
            self.ui.show_save_warning = False

    def _handle_save_point_click(self, pos):
        if not pos:
            return
        if hasattr(self.ui, '_sp_close_rect') and self.ui._sp_close_rect.collidepoint(pos):
            self.ui.show_save_points = False
            return
        for node in self.save_nodes:
            rect = node.get("_save_rect")
            if rect and rect.collidepoint(pos):
                self.ui.show_save_points = False
                self.story.state = {}
                self.story.jump_to(node["id"])
                return

    # ========== History ==========

    def _handle_history_click(self, pos):
        if not pos:
            return
        if hasattr(self.ui, '_hist_close_rect') and self.ui._hist_close_rect.collidepoint(pos):
            self.ui.show_history = False

    # ========== Ending ==========

    def _handle_ending_click(self, pos):
        if not pos:
            return
        if hasattr(self.ui, '_ending_load_btn') and self.ui._ending_load_btn.collidepoint(pos):
            self._load_game()
            return
        if hasattr(self.ui, '_ending_restart_btn') and self.ui._ending_restart_btn.collidepoint(pos):
            self._restart()
            return

    def _load_game(self):
        data = self.save_manager.load()
        if data:
            self.story.state = data.get("state", {})
            self.story.history = data.get("history", [])
            self.ui.show_ending = False
            self.story.jump_to(data.get("currentId", "1.1"))

    def _restart(self):
        self.story.state = {}
        self.story.history = []
        self.ui.show_ending = False
        self.story.jump_to("1.1")

    # ========== Update ==========

    def _update(self, dt: float):
        dt_ms = dt * 1000

        # Effects animation
        if self.effects.active:
            self.effects.update(dt_ms)

        # Typing effect
        if self.is_typing and self.current_text:
            self.typing_timer += dt
            chars_per_sec = config.TYPING_SPEED
            target_index = int(self.typing_timer * chars_per_sec)
            if target_index > self.typing_index:
                self.typing_index = min(target_index, len(self.current_text))
                self.display_text = self.current_text[:self.typing_index]
            if self.typing_index >= len(self.current_text):
                self.is_typing = False
                self.show_hint = self._compute_show_hint()
                self.story.record_history(self.speaker, self.current_text)
                self._start_skip_timer()

        # Skip auto-advance (using pygame ticks)
        if self.skip_timer and not self.is_typing and not self.show_choices:
            if pygame.time.get_ticks() >= self.skip_timer:
                self.skip_timer = 0
                self.story.go_next()

        # Auto play
        if self.auto_play and not self.is_typing and not self.show_choices and not self.effects.active:
            self.auto_play_timer += dt
            if self.auto_play_timer >= 1.8:
                self.auto_play_timer = 0
                self.story.go_next()

        # Dark fade
        if self.dark_mode:
            elapsed = (pygame.time.get_ticks() - self.dark_start) / self.dark_duration
            if self.dark_mode == "01":
                self.dark_opacity = max(0, 255 * (1 - elapsed))
            elif self.dark_mode == "10":
                self.dark_opacity = min(255, 255 * elapsed)
            if elapsed >= 1:
                self.dark_mode = ""
                self.dark_opacity = 0

        # Character animations
        self.char_manager.update()

    def _compute_show_hint(self) -> bool:
        if not self.current_node:
            return False
        if self.effects.active:
            return False
        if self.show_choices or self.current_node.get("isEnding"):
            return False
        if self.current_node.get("presentForced"):
            return False
        skip = self.current_node.get("skip")
        if isinstance(skip, (int, float)) and skip > 0:
            return False
        return True

    def start_dark_fade(self, mode: str, duration: int):
        self.dark_mode = mode
        self.dark_duration = duration
        self.dark_start = pygame.time.get_ticks()
        self.dark_opacity = 255 if mode == "01" else 0

    def _start_skip_timer(self):
        """Start the auto-advance timer after typing completes."""
        if isinstance(self.skip_delay, (int, float)) and self.skip_delay > 0:
            # Ensure minimum 0.5s delay so player can read
            delay = max(self.skip_delay, 0.5)
            self.skip_timer = pygame.time.get_ticks() + int(delay * 1000)

    # ========== Render ==========

    def _render(self):
        self.renderer.render(self, self.screen)

        # Effect overlay
        if self.effects.active:
            self.effects.render(self.screen)

        # UI overlays
        if self.ui.show_encyclopedia:
            self.ui.render_encyclopedia(self.screen, self.present_mode)
        if self.ui.show_history:
            self.ui.render_history(self.screen, self.story.history)
        if self.ui.show_save_warning:
            self.ui.render_save_warning(self.screen)
        if self.ui.show_save_points:
            self.ui.render_save_points(
                self.screen, self.save_nodes,
                current_id=self.current_node.get("id") if self.current_node else None)
        if self.ui.show_ending:
            self.ui.render_ending(self.screen)


def main():
    game = Game()
    game.run()


if __name__ == "__main__":
    main()
