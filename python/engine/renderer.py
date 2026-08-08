"""
ManoAA Pygame Port — Renderer
Draws backgrounds, characters, dialog box, choices, and UI elements.
Visual style follows the WeChat mini-program (pink accent theme).
"""
import pygame
import os
import math
import sys, os; sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); import config

# Font cache
_fonts = {}

def _get_font(size: int, bold: bool = False) -> pygame.font.Font:
    key = (size, bold)
    if key not in _fonts:
        # Try bundled simsun (新宋体) first, then simhei, then system default
        for fpath in [
            os.path.join(config.ASSETS_DIR, "simsun.ttc"),
            "C:/Windows/Fonts/simhei.ttf",
        ]:
            try:
                _fonts[key] = pygame.font.Font(fpath, size)
                break
            except:
                continue
        else:
            _fonts[key] = pygame.font.Font(None, size)
    return _fonts[key]


def _pill(surface, rect, color, radius=None, width=0):
    """Draw a rounded rectangle (pill) onto surface."""
    if radius is None:
        radius = rect.height // 2
    pygame.draw.rect(surface, color, rect, border_radius=radius, width=width)


class Renderer:
    def __init__(self):
        self._bg_cache = {}

    def render(self, game, screen: pygame.Surface):
        """Main render pass."""
        self._render_background(game, screen)
        self._render_characters(game, screen)
        self._render_table(game, screen)
        self._render_dark_fade(game, screen)
        self._render_dialog(game, screen)
        self._render_choices(game, screen)
        self._render_top_bar(game, screen)

    def _resolve_bg_path(self, url: str) -> str:
        if not url:
            return None
        if url in self._bg_cache:
            return self._bg_cache[url]

        import re
        if "BASE" in url or "+" in url:
            parts = re.findall(r'"([^"]*)"', url)
            rel = "".join(parts)
            if rel:
                path = os.path.join(config.GRESOURCE_DIR, rel.lstrip("/"))
                if os.path.exists(path):
                    self._bg_cache[url] = path
                    return path
        if os.path.exists(url):
            self._bg_cache[url] = url
            return url
        path = os.path.join(config.GRESOURCE_DIR, url.lstrip("/"))
        if os.path.exists(path):
            self._bg_cache[url] = path
            return path
        return None

    def _render_background(self, game, screen: pygame.Surface):
        """Render background image with proper aspect-ratio scaling."""
        bg_url = game.current_bg
        path = config.resolve_path(bg_url) if bg_url else None

        if path:
            try:
                cache_key = f"{path}_{game.court_mode}"
                if cache_key not in self._bg_cache:
                    # Load preserving alpha for images with transparency
                    raw = pygame.image.load(path)
                    has_alpha = raw.get_flags() & pygame.SRCALPHA
                    img = raw.convert_alpha() if has_alpha else raw.convert()
                    orig_w, orig_h = img.get_size()
                    win_w, win_h = config.WINDOW_WIDTH, config.WINDOW_HEIGHT

                    # Determine scale mode from node's bgMode
                    bg_mode = game.current_node.get("bgMode", "") if game.current_node else ""

                    if bg_mode == "aspectFit":
                        # Contain: fit entirely within window, letterbox
                        scale = min(win_w / orig_w, win_h / orig_h)
                        new_w, new_h = int(orig_w * scale), int(orig_h * scale)
                        scaled = pygame.transform.smoothscale(img, (new_w, new_h))
                        canvas = pygame.Surface((win_w, win_h))
                        canvas.fill(config.BG_COLOR)
                        canvas.blit(scaled, ((win_w - new_w) // 2, (win_h - new_h) // 2))
                        self._bg_cache[cache_key] = canvas
                    else:
                        # Cover (default): scale to fill, crop overflow
                        scale = max(win_w / orig_w, win_h / orig_h)
                        new_w, new_h = int(orig_w * scale), int(orig_h * scale)
                        scaled = pygame.transform.smoothscale(img, (new_w, new_h))
                        # Crop center
                        x = (new_w - win_w) // 2
                        y = (new_h - win_h) // 2
                        # Court mode alignment
                        if game.court_mode == "left":
                            x = 0
                        elif game.court_mode == "right":
                            x = new_w - win_w
                        cropped = scaled.subsurface((x, y, win_w, win_h))
                        self._bg_cache[cache_key] = cropped

                screen.blit(self._bg_cache[cache_key], (0, 0))
            except:
                pass
        else:
            screen.fill(config.BG_COLOR)

    def _render_characters(self, game, screen: pygame.Surface):
        """Render character sprites. Court left/right pins them to the edge
        (WeChat: .court-left .character { left:0 } / .court-right { left:100% })."""
        if game.court_mode in ("left", "right"):
            container_bottom = config.WINDOW_HEIGHT
        else:
            wrapper_bottom_offset = int(config.WINDOW_HEIGHT * abs(config.CHARACTER_WRAP_BOTTOM))
            container_bottom = config.WINDOW_HEIGHT + wrapper_bottom_offset

        for sprite in game.char_manager.sprites:
            sprite.update_anim()
            if game.court_mode == "left":
                # pin to left edge
                rect = sprite.get_rect(0, container_bottom)
                rect.x = 0
            elif game.court_mode == "right":
                rect = sprite.get_rect(0, container_bottom)
                rect.x = config.WINDOW_WIDTH - rect.width
            else:
                rect = sprite.get_rect(0, container_bottom)
            if rect.width > 0:
                sprite.render(screen, rect.x, rect.y)

    def _render_table(self, game, screen: pygame.Surface):
        """Render courtroom table overlay."""
        table_url = game.table_image
        if not table_url or not game.court_mode:
            return

        path = config.resolve_path(table_url)
        if path:
            try:
                if f"table_{path}" not in self._bg_cache:
                    img = pygame.image.load(path).convert_alpha()
                    h = config.WINDOW_HEIGHT
                    orig_w, orig_h = img.get_size()
                    w = int(h * orig_w / orig_h)
                    img = pygame.transform.scale(img, (w, h))
                    self._bg_cache[f"table_{path}"] = img

                table_img = self._bg_cache[f"table_{path}"]
                x = 0 if game.court_mode == "left" else config.WINDOW_WIDTH - table_img.get_width()
                screen.blit(table_img, (x, 0))
            except:
                pass

    def _render_dark_fade(self, game, screen: pygame.Surface):
        """Render dark fade overlay."""
        if game.dark_opacity > 0:
            dark = pygame.Surface((config.WINDOW_WIDTH, config.WINDOW_HEIGHT))
            dark.set_alpha(int(game.dark_opacity))
            dark.fill((0, 0, 0))
            screen.blit(dark, (0, 0))

    def _render_dialog(self, game, screen: pygame.Surface):
        """Render WeChat-style dialog: floating rounded box (92% width),
        speaker name bar above the box, judge text in green, pulsing hint.
        The box slides up and fades in when a new node appears; a blinking
        cursor marks the typing position."""
        # Skip if no text content at all
        if not game.current_text and not game.speaker:
            return

        W, H = config.WINDOW_WIDTH, config.WINDOW_HEIGHT
        is_judge = bool(game.current_node and game.current_node.get("judge"))

        # slide-in animation (0..220ms after node switch)
        age = pygame.time.get_ticks() - getattr(game, "node_anim_start", 0)
        ANIM_IN = 220
        p = min(max(age / ANIM_IN, 0.0), 1.0)
        p = 1 - (1 - p) ** 2  # ease-out
        slide = int((1 - p) * 36)

        # ---- name bar (above the dialog box) ----
        name_surf = None
        if game.speaker:
            name_font = _get_font(config.NAME_FONT_SIZE + 2, bold=True)
            name_surf = name_font.render(game.speaker, True, config.NAME_COLOR)
            # text shadow (WeChat text-shadow)
            sh = name_font.render(game.speaker, True, (0, 0, 0))
            nx = 30
            ny = H - 128 + slide
            screen.blit(sh, (nx + 1, ny + 2))
            screen.blit(name_surf, (nx, ny))

        # ---- dialog box: 92% width, rounded, semi-transparent ----
        box_w = int(W * 0.92)
        box_h = 110
        box_x = (W - box_w) // 2
        box_y = H - box_h - 14 + slide
        # soft shadow (WeChat box-shadow)
        shadow = pygame.Surface((box_w, box_h), pygame.SRCALPHA)
        shadow.fill((0, 0, 0, 90))
        screen.blit(shadow, (box_x + 3, box_y + 4))
        # body
        box_surf = pygame.Surface((box_w, box_h), pygame.SRCALPHA)
        box_surf.fill(config.DIALOG_BG)
        pygame.draw.rect(box_surf, config.DIALOG_BORDER, box_surf.get_rect(),
                         border_radius=14, width=1)
        screen.blit(box_surf, (box_x, box_y))

        # text
        text_font = _get_font(config.DIALOG_FONT_SIZE, bold=is_judge)
        text_color = config.JUDGE_TEXT_COLOR if is_judge else config.TEXT_COLOR
        text = game.display_text
        if text:
            max_w = box_w - 34
            lines = self._wrap_text(text, text_font, max_w)
            # WeChat: 17rpx line-height 1.4 -> ~26px per line
            line_h = 26
            total_h = len(lines) * line_h
            ty = box_y + max(10, (box_h - total_h) // 2)
            shown = lines[-4:]
            for i, line in enumerate(shown):
                text_surf = text_font.render(line, True, text_color)
                screen.blit(text_surf, (box_x + 17, ty + i * line_h))

            # typing cursor: blinking vertical bar after the last line
            if game.is_typing and (pygame.time.get_ticks() // 400) % 2 == 0:
                last_line = shown[-1]
                last_w = text_font.size(last_line)[0]
                cursor_x = box_x + 17 + last_w + 2
                cursor_y = ty + (len(shown) - 1) * line_h
                pygame.draw.rect(screen, text_color,
                                 (cursor_x, cursor_y + 2, 2, line_h - 6))

        # ---- hint triangle (pulsing, pink) ----
        if game.show_hint and not game.is_typing and not game.show_choices:
            hint_font = _get_font(20, bold=True)
            # pulse: opacity 0.4..1.0
            phase = (pygame.time.get_ticks() % 1200) / 1200
            alpha = int(255 * (0.4 + 0.6 * (0.5 - 0.5 * math.cos(2 * math.pi * phase))))
            hint_surf = hint_font.render("▷", True, config.HINT_COLOR)
            hint_surf.set_alpha(alpha)
            screen.blit(hint_surf, (box_x + box_w - 26, box_y + box_h - 26))

    def _render_choices(self, game, screen: pygame.Surface):
        """Render WeChat-style choice panel: centered column anchored above
        the dialog area, full-width pill buttons, staggered fade-up entrance."""
        if not game.show_choices or not game.current_choices:
            return

        choices = game.current_choices
        W, H = config.WINDOW_WIDTH, config.WINDOW_HEIGHT
        n = len(choices)
        btn_w = int(W * 0.6)
        btn_h = 44
        spacing = 10
        total_h = n * btn_h + (n - 1) * spacing
        # anchored above the dialog box (bottom: 120rpx ≈ 115px + box)
        start_y = H - 115 - 130 - total_h

        font = _get_font(20)

        # staggered entrance: each button fades/slides in 70ms after the last
        age = pygame.time.get_ticks() - getattr(game, "choices_anim_start", 0)

        for i, choice in enumerate(choices):
            y = start_y + i * (btn_h + spacing)
            rect = pygame.Rect((W - btn_w) // 2, y, btn_w, btn_h)

            # Store rect for hit testing FIRST — during the entrance
            # animation early buttons may not be drawn yet (alpha<=0), but
            # the click area must still exist for the driver/player.
            choice["_rect"] = rect

            # entrance progress for this button
            item_age = age - i * 70
            q = min(max(item_age / 200.0, 0.0), 1.0)
            q = 1 - (1 - q) ** 2  # ease-out
            alpha = int(255 * q)
            offset_y = int((1 - q) * 20)
            if alpha <= 0:
                continue

            # button body: dark + pink border pill
            btn_surf = pygame.Surface((rect.width, rect.height), pygame.SRCALPHA)
            btn_surf.fill(config.CHOICE_BG)
            pygame.draw.rect(btn_surf, (255, 133, 162, 128), btn_surf.get_rect(),
                             border_radius=rect.height // 2, width=1)
            btn_surf.set_alpha(alpha)
            screen.blit(btn_surf, (rect.x, rect.y + offset_y))

            # text
            text = choice.get("text", "")
            text_surf = font.render(text, True, config.PINK_BTN_TEXT)
            text_surf.set_alpha(alpha)
            tx = rect.x + (rect.width - text_surf.get_width()) // 2
            ty = rect.y + (rect.height - text_surf.get_height()) // 2 + offset_y
            screen.blit(text_surf, (tx, ty))

    def _render_top_bar(self, game, screen: pygame.Surface):
        """Render WeChat-style top bar: a rounded translucent container with
        small pill buttons (pink border/text)."""
        font = _get_font(14)
        buttons = [
            ("自动播放" if not game.auto_play else "关闭自动", "auto"),
            ("历史", "history"),
            ("存档点", "savepoints"),
        ]
        if game.current_node and not game.current_node.get("judge"):
            buttons.append(("图鉴", "encyclopedia"))
        if game.current_node and game.current_node.get("judge"):
            buttons.append(("出示", "present"))
            buttons.append(("追问", "ask"))

        btn_h = 26
        pad_x, pad_y = 6, 4
        gap = 5
        # measure pill widths
        widths = []
        for label, _ in buttons:
            w = font.size(label)[0] + 22
            widths.append(w)
        total_w = sum(widths) + gap * (len(buttons) - 1) + pad_x * 2
        x0, y0 = 8, 8

        # container: translucent black + pink border, rounded
        cont = pygame.Surface((total_w, btn_h + pad_y * 2), pygame.SRCALPHA)
        cont.fill(config.TOP_BAR_BG)
        pygame.draw.rect(cont, (255, 133, 162, 102), cont.get_rect(),
                         border_radius=12, width=1)
        screen.blit(cont, (x0, y0))

        game._top_buttons = []
        x = x0 + pad_x
        for (label, action), w in zip(buttons, widths):
            rect = pygame.Rect(x, y0 + pad_y, w, btn_h)
            # hover highlight
            hover = bool(game.mouse_pos and rect.collidepoint(game.mouse_pos))
            # pill button
            btn = pygame.Surface((w, btn_h), pygame.SRCALPHA)
            if hover:
                btn.fill((255, 133, 162, 77))
            else:
                btn.fill((0, 0, 0, 102))
            pygame.draw.rect(btn, (255, 133, 162, 204 if hover else 179),
                             btn.get_rect(), border_radius=btn_h // 2, width=1)
            screen.blit(btn, (rect.x, rect.y))
            ts = font.render(label, True,
                             (255, 255, 255) if hover else config.PINK_BTN_TEXT)
            screen.blit(ts, (rect.x + (w - ts.get_width()) // 2,
                             rect.y + (btn_h - ts.get_height()) // 2))
            game._top_buttons.append((rect, action))
            x += w + gap

    def _wrap_text(self, text: str, font: pygame.font.Font, max_width: int) -> list:
        """Word wrap text to fit max_width."""
        words = text
        lines = []
        current = ""
        for char in words:
            test = current + char
            if font.size(test)[0] <= max_width:
                current = test
            else:
                lines.append(current)
                current = char
        if current:
            lines.append(current)
        return lines if lines else [""]
