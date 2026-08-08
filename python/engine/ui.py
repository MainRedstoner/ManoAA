"""
ManoAA Pygame Port — Encyclopedia & UI Systems
Evidence browser, history log, save points, ending panel.
Visual style follows the WeChat mini-program (pink accent, full-screen panels).
"""
import pygame
import os
import sys, os; sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); import config

# Font cache
_fonts = {}

def _font(size: int, bold: bool = False):
    key = (size, bold)
    if key not in _fonts:
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
    if radius is None:
        radius = rect.height // 2
    pygame.draw.rect(surface, color, rect, border_radius=radius, width=width)


class UIManager:
    """Manages all overlay UI: encyclopedia, history, save points, ending."""

    def __init__(self):
        self.show_encyclopedia = False
        self.show_history = False
        self.show_save_points = False
        self.show_save_warning = False
        self.show_ending = False

        # Encyclopedia state
        self.enc_tabs = ["evidence", "witness", "map", "rule", "record"]
        self.enc_tab_labels = ["证物", "证人", "地图", "规定", "记录"]
        self.enc_active_tab = 0
        self.enc_items = []
        self.enc_selected = -1
        self.enc_scroll = 0

        # History state
        self.history_scroll = 0

        # Ending state
        self.ending_title = ""
        self.ending_text = ""

        # Image cache for encyclopedia detail thumbnails
        self._img_cache = {}

    def _load_image(self, url):
        """Load an encyclopedia detail image (cached). Returns Surface or None."""
        if not url:
            return None
        if url in self._img_cache:
            return self._img_cache[url]
        path = config.resolve_path(url)
        if not path or not os.path.exists(path):
            return None
        try:
            img = pygame.image.load(path).convert_alpha()
            self._img_cache[url] = img
            return img
        except Exception:
            return None

    # ========== Encyclopedia ==========

    def open_encyclopedia(self, items: list):
        self.show_encyclopedia = True
        self.enc_items = items
        self.enc_active_tab = 0
        self.enc_selected = -1
        self.enc_scroll = 0

    def close_encyclopedia(self):
        self.show_encyclopedia = False

    def render_encyclopedia(self, screen: pygame.Surface, in_present_mode: bool = False):
        """WeChat-style full-screen encyclopedia:
        back button top-left, vertical tab bar on the right, detail area on
        the left/top, horizontal item strip along the bottom."""
        if not self.show_encyclopedia:
            return

        W, H = config.WINDOW_WIDTH, config.WINDOW_HEIGHT

        # Background overlay + full-screen dark panel
        overlay = pygame.Surface((W, H), pygame.SRCALPHA)
        overlay.fill((0, 0, 0, 217))
        screen.blit(overlay, (0, 0))
        panel = pygame.Surface((W, H), pygame.SRCALPHA)
        panel.fill(config.DARK_PANEL)
        screen.blit(panel, (0, 0))

        # ---- back button (top-left) ----
        back_rect = pygame.Rect(10, 10, 30, 30)
        back_surf = pygame.Surface((30, 30), pygame.SRCALPHA)
        back_surf.fill((0, 0, 0, 153))
        pygame.draw.rect(back_surf, (255, 133, 162, 128), back_surf.get_rect(),
                         border_radius=6, width=1)
        screen.blit(back_surf, (10, 10))
        back_txt = _font(18, bold=True).render("←", True, config.PINK_LIGHT)
        screen.blit(back_txt, (16, 13))
        self._enc_close_rect = back_rect  # keep name for compatibility

        # ---- right vertical tab bar ----
        tab_w = 96
        tab_x = W - tab_w
        tabs_y0 = (H - 5 * 52) // 2
        self._tab_rects = []
        for i, label in enumerate(self.enc_tab_labels):
            rect = pygame.Rect(tab_x, tabs_y0 + i * 52, tab_w, 50)
            if i == self.enc_active_tab:
                tab_surf = pygame.Surface((tab_w, 50), pygame.SRCALPHA)
                tab_surf.fill((255, 133, 162, 77))
                screen.blit(tab_surf, (tab_x, rect.y))
                pygame.draw.line(screen, config.PINK, (tab_x + 2, rect.y),
                                 (tab_x + 2, rect.y + 50), 2)
                txt = _font(16, bold=True).render(label, True, config.PINK_LIGHT)
            else:
                txt = _font(16).render(label, True, (230, 230, 230))
            screen.blit(txt, (tab_x + (tab_w - txt.get_width()) // 2,
                              rect.y + (50 - txt.get_height()) // 2))
            if i < 4:
                pygame.draw.line(screen, (255, 255, 255, 26),
                                 (tab_x, rect.bottom), (tab_x + tab_w, rect.bottom), 1)
            self._tab_rects.append(rect)

        # ---- main area (left of tab bar) ----
        main_w = tab_x
        list_h = 76
        detail_h = H - list_h

        # -------- detail area --------
        # Filter items by the active tab (WeChat: encyData[encyActiveTab]);
        # enc_selected stays a FULL-LIST index so present logic stays simple.
        active_tab_key = self.enc_tabs[self.enc_active_tab]
        active_items = [it for it in self.enc_items
                        if it.get("type") == active_tab_key]
        item = (self.enc_items[self.enc_selected]
                if 0 <= self.enc_selected < len(self.enc_items) else None)

        if self.enc_active_tab == 2:  # map tab: full-bleed map image
            map_img = self._load_image(item.get("details")) if item else None
            if map_img:
                iw, ih = map_img.get_size()
                scale = min(main_w / iw, detail_h / ih)
                w, h = int(iw * scale), int(ih * scale)
                thumb = pygame.transform.smoothscale(map_img, (w, h))
                screen.blit(thumb, ((main_w - w) // 2, (detail_h - h) // 2))
            else:
                ph = _font(22).render("暂无地图图片", True, (170, 170, 170))
                screen.blit(ph, ((main_w - ph.get_width()) // 2, detail_h // 2))
        else:
            # left column: profile + name + present button (35%)
            left_w = int(main_w * 0.35)
            left_bg = pygame.Surface((left_w, detail_h), pygame.SRCALPHA)
            left_bg.fill((0, 0, 0, 102))
            screen.blit(left_bg, (0, 0))
            pygame.draw.line(screen, (255, 133, 162, 77), (left_w - 1, 0),
                             (left_w - 1, detail_h), 1)

            if item:
                img = self._load_image(item.get("profile"))
                if img:
                    max_w, max_h = 140, 170
                    iw, ih = img.get_size()
                    scale = min(max_w / iw, max_h / ih, 1.0)
                    w, h = int(iw * scale), int(ih * scale)
                    thumb = pygame.transform.smoothscale(img, (w, h))
                    px = (left_w - w) // 2
                    py = 20
                    pygame.draw.rect(screen, (0, 0, 0, 77),
                                     (px - 3, py - 3, w + 6, h + 6), border_radius=6)
                    pygame.draw.rect(screen, (255, 133, 162, 204),
                                     (px - 3, py - 3, w + 6, h + 6),
                                     border_radius=6, width=1)
                    screen.blit(thumb, (px, py))
                    name_y = py + h + 12
                else:
                    name_y = 30
                name_txt = _font(20, bold=True).render(
                    item.get("name", "请选择一项"), True, config.PINK_TEXT)
                screen.blit(name_txt, ((left_w - name_txt.get_width()) // 2, name_y))
            else:
                ph = _font(16).render("请选择一项", True, (170, 170, 170))
                screen.blit(ph, ((left_w - ph.get_width()) // 2, 30))

            # present button (bottom of left column, present mode only)
            if in_present_mode and item:
                btn = pygame.Rect((left_w - 96) // 2, detail_h - 56, 96, 34)
                btn_surf = pygame.Surface((96, 34), pygame.SRCALPHA)
                btn_surf.fill(config.PINK_LIGHT)
                screen.blit(btn_surf, (btn.x, btn.y))
                btn_txt = _font(16, bold=True).render("出示", True, (44, 44, 56))
                screen.blit(btn_txt, (btn.x + (96 - btn_txt.get_width()) // 2,
                                      btn.y + 7))
                self._present_btn_rect = btn

            # right column: description (65%)
            right_x = left_w
            right_w = main_w - left_w
            if item:
                desc = item.get("desc", "")
                details = item.get("details", "")
                if isinstance(details, list):
                    desc = desc + "\n\n" + "\n\n".join(str(d) for d in details)
                desc_font = _font(14)
                dy = 24
                for line in self._wrap(desc, desc_font, right_w - 40):
                    if dy > detail_h - 24:
                        break
                    ts = desc_font.render(line, True, (224, 224, 224))
                    screen.blit(ts, (right_x + 20, dy))
                    dy += 24

        # -------- bottom horizontal item strip --------
        strip_bg = pygame.Surface((main_w, list_h), pygame.SRCALPHA)
        strip_bg.fill((0, 0, 0, 128))
        screen.blit(strip_bg, (0, detail_h))
        pygame.draw.line(screen, (255, 133, 162, 102), (0, detail_h),
                         (main_w, detail_h), 1)

        self._enc_item_rects = []
        x = 12
        icon_mode = self.enc_active_tab in (0, 1)  # evidence/witness icons
        for it in active_items:
            i = self.enc_items.index(it)  # full-list index (for present logic)
            if icon_mode:
                w = 52
                rect = pygame.Rect(x, detail_h + (list_h - 52) // 2, w, w)
                img = self._load_image(it.get("profile"))
                if img:
                    thumb = pygame.transform.smoothscale(img, (46, 46))
                    screen.blit(thumb, (rect.x + 3, rect.y + 3))
                pygame.draw.rect(screen, (255, 255, 255, 20),
                                 rect, border_radius=8, width=1)
                if i == self.enc_selected:
                    pygame.draw.rect(screen, config.PINK, rect,
                                     border_radius=8, width=2)
                x += w + 8
            else:
                label = str(it.get("name", "???"))[:6]
                w = _font(14).size(label)[0] + 24
                rect = pygame.Rect(x, detail_h + 16, w, 44)
                if i == self.enc_selected:
                    bg = config.PINK
                    txt_color = (44, 44, 56)
                else:
                    bg = (255, 255, 255, 26)
                    txt_color = (245, 245, 245)
                pill = pygame.Surface((w, 44), pygame.SRCALPHA)
                pill.fill(bg)
                screen.blit(pill, (rect.x, rect.y))
                ts = _font(14, bold=(i == self.enc_selected)).render(
                    label, True, txt_color)
                screen.blit(ts, (rect.x + (w - ts.get_width()) // 2,
                                 rect.y + (44 - ts.get_height()) // 2))
                x += w + 12
            self._enc_item_rects.append((rect, i))
            if x > main_w - 20:
                break  # strip overflow — rest not visible

    # ========== History ==========

    def render_history(self, screen: pygame.Surface, history: list):
        """Full-screen history log (WeChat style): header bar with close
        button on the left, scrolling list with pink speaker names."""
        if not self.show_history:
            return

        W, H = config.WINDOW_WIDTH, config.WINDOW_HEIGHT
        overlay = pygame.Surface((W, H), pygame.SRCALPHA)
        overlay.fill((0, 0, 0, 217))
        screen.blit(overlay, (0, 0))
        panel = pygame.Surface((W, H), pygame.SRCALPHA)
        panel.fill(config.DARK_PANEL)
        screen.blit(panel, (0, 0))

        # header
        header_h = 42
        title = _font(18, bold=True).render("对话历史", True, config.PINK_LIGHT)
        screen.blit(title, ((W - title.get_width()) // 2, 8))
        pygame.draw.line(screen, (255, 255, 255, 51), (0, header_h), (W, header_h), 1)

        # close button (left, WeChat layout)
        close_rect = pygame.Rect(10, 6, 30, 30)
        close_surf = pygame.Surface((30, 30), pygame.SRCALPHA)
        close_surf.fill((0, 0, 0, 128))
        pygame.draw.rect(close_surf, (255, 133, 162, 128), close_surf.get_rect(),
                         border_radius=6, width=1)
        screen.blit(close_surf, (10, 6))
        close_txt = _font(14).render("✕", True, config.PINK_LIGHT)
        screen.blit(close_txt, (22, 13))
        self._hist_close_rect = close_rect

        # list
        font_s = _font(14, bold=True)
        font_t = _font(14)
        y = header_h + 12
        max_items = (H - header_h - 24) // 34
        start = max(0, len(history) - max_items - self.history_scroll)
        end = min(len(history), start + max_items)
        for i in range(start, end):
            if y > H - 16:
                break
            h = history[i]
            speaker = h.get("speaker", "")
            text = h.get("text", "")
            if speaker:
                s = font_s.render(speaker + ":", True, config.PINK)
                screen.blit(s, (24, y))
                tw = s.get_width() + 8
            else:
                tw = 0
            t = font_t.render(text[:60], True, (240, 240, 240))
            screen.blit(t, (24 + tw, y))
            y += 32
            pygame.draw.line(screen, (255, 255, 255, 26), (24, y - 4),
                             (W - 24, y - 4), 1)

        if not history:
            empty = _font(16).render("暂无历史记录", True, (170, 170, 170))
            screen.blit(empty, ((W - empty.get_width()) // 2, H // 2))

    # ========== Save Points ==========

    def render_save_warning(self, screen: pygame.Surface):
        """WeChat save-point warning layer (must confirm before the list)."""
        if not self.show_save_warning:
            return

        W, H = config.WINDOW_WIDTH, config.WINDOW_HEIGHT
        overlay = pygame.Surface((W, H), pygame.SRCALPHA)
        overlay.fill((0, 0, 0, 230))
        screen.blit(overlay, (0, 0))

        panel_w, panel_h = 560, 220
        panel_x = (W - panel_w) // 2
        panel_y = (H - panel_h) // 2
        panel = pygame.Surface((panel_w, panel_h), pygame.SRCALPHA)
        panel.fill((25, 25, 35, 245))
        pygame.draw.rect(panel, (255, 133, 162, 128), panel.get_rect(),
                         border_radius=16, width=1)
        screen.blit(panel, (panel_x, panel_y))

        icon = _font(28).render("⚠️", True, (255, 200, 120))
        screen.blit(icon, (panel_x + (panel_w - icon.get_width()) // 2, panel_y + 18))
        warn = "存档点功能并非为正常流程设计，除非你由于退出等原因丢失进度，"
        warn += "否则不建议使用存档点功能！"
        font = _font(16)
        lines = self._wrap(warn, font, panel_w - 60)
        ty = panel_y + 66
        for line in lines:
            ts = font.render(line, True, (230, 220, 210))
            screen.blit(ts, (panel_x + 30, ty))
            ty += 26

        # buttons
        btn_w, btn_h = 150, 40
        by = panel_y + panel_h - 58
        cancel = pygame.Rect(panel_x + 60, by, btn_w, btn_h)
        confirm = pygame.Rect(panel_x + panel_w - 60 - btn_w, by, btn_w, btn_h)
        # cancel: translucent
        c = pygame.Surface((btn_w, btn_h), pygame.SRCALPHA)
        c.fill((255, 255, 255, 26))
        pygame.draw.rect(c, (255, 133, 162, 128), c.get_rect(),
                         border_radius=btn_h // 2, width=1)
        screen.blit(c, (cancel.x, cancel.y))
        ct = _font(16).render("返回", True, config.PINK_LIGHT)
        screen.blit(ct, (cancel.x + (btn_w - ct.get_width()) // 2,
                         cancel.y + (btn_h - ct.get_height()) // 2))
        # confirm: pink gradient-ish solid
        cf = pygame.Surface((btn_w, btn_h), pygame.SRCALPHA)
        cf.fill(config.PINK_LIGHT)
        screen.blit(cf, (confirm.x, confirm.y))
        cft = _font(15, bold=True).render("我知道我在干什么", True, (44, 44, 56))
        screen.blit(cft, (confirm.x + (btn_w - cft.get_width()) // 2,
                          confirm.y + (btn_h - cft.get_height()) // 2))
        self._sp_warn_cancel_rect = cancel
        self._sp_warn_confirm_rect = confirm

    def render_save_points(self, screen: pygame.Surface, save_nodes: list,
                           on_select=None, current_id=None):
        """Full-screen save point list (WeChat style)."""
        if not self.show_save_points:
            return

        W, H = config.WINDOW_WIDTH, config.WINDOW_HEIGHT
        overlay = pygame.Surface((W, H), pygame.SRCALPHA)
        overlay.fill((0, 0, 0, 217))
        screen.blit(overlay, (0, 0))
        panel = pygame.Surface((W, H), pygame.SRCALPHA)
        panel.fill(config.DARK_PANEL)
        screen.blit(panel, (0, 0))

        header_h = 42
        title = _font(18, bold=True).render("存档点", True, config.PINK_LIGHT)
        screen.blit(title, ((W - title.get_width()) // 2, 8))
        pygame.draw.line(screen, (255, 255, 255, 51), (0, header_h), (W, header_h), 1)

        close_rect = pygame.Rect(10, 6, 30, 30)
        close_surf = pygame.Surface((30, 30), pygame.SRCALPHA)
        close_surf.fill((0, 0, 0, 128))
        pygame.draw.rect(close_surf, (255, 133, 162, 128), close_surf.get_rect(),
                         border_radius=6, width=1)
        screen.blit(close_surf, (10, 6))
        close_txt = _font(14).render("✕", True, config.PINK_LIGHT)
        screen.blit(close_txt, (22, 13))
        self._sp_close_rect = close_rect

        font = _font(15)
        y = header_h + 10
        for i, node in enumerate(save_nodes):
            if y > H - 70:
                break
            title_text = node.get("saveTitle", node.get("id", ""))
            desc_text = node.get("saveDesc", "")
            rect = pygame.Rect(40, y, W - 80, 54)
            is_current = current_id == node.get("id")
            item = pygame.Surface((W - 80, 54), pygame.SRCALPHA)
            item.fill((255, 133, 162, 64) if is_current else (255, 255, 255, 26))
            pygame.draw.rect(item, config.PINK if is_current else (255, 133, 162, 77),
                             item.get_rect(), border_radius=10, width=1)
            screen.blit(item, (40, y))
            t1 = font.render(title_text, True, config.PINK_LIGHT if is_current
                             else (245, 245, 245))
            screen.blit(t1, (52, y + 8))
            t2 = _font(13).render(desc_text, True, (180, 180, 180))
            screen.blit(t2, (52, y + 30))
            node["_save_rect"] = rect
            y += 62

        if not save_nodes:
            empty = _font(16).render("暂无可跳转节点", True, (170, 170, 170))
            screen.blit(empty, ((W - empty.get_width()) // 2, H // 2))

    # ========== Ending Panel ==========

    def render_ending(self, screen: pygame.Surface):
        """Full-screen ending panel: dark gradient, centered title/text,
        pink pill buttons (WeChat style)."""
        if not self.show_ending:
            return

        W, H = config.WINDOW_WIDTH, config.WINDOW_HEIGHT
        # 135deg gradient from rgba(10,10,30,0.95) to rgba(30,20,40,0.95)
        top = (10, 10, 30)
        bottom = (30, 20, 40)
        for y in range(H):
            t = y / H
            col = (int(top[0] + (bottom[0] - top[0]) * t),
                   int(top[1] + (bottom[1] - top[1]) * t),
                   int(top[2] + (bottom[2] - top[2]) * t))
            pygame.draw.line(screen, col, (0, y), (W, y))

        # title
        title = _font(32, bold=True).render(self.ending_title or "结局",
                                            True, config.PINK_TEXT)
        screen.blit(title, ((W - title.get_width()) // 2, H // 2 - 120))

        # text
        font = _font(16)
        ty = H // 2 - 60
        for line in self._wrap(self.ending_text, font, W - 120):
            t = font.render(line, True, (245, 240, 232))
            screen.blit(t, ((W - t.get_width()) // 2, ty))
            ty += 28

        # divider
        pygame.draw.line(screen, (255, 133, 162, 128), (W // 2 - 60, ty + 14),
                         (W // 2 + 60, ty + 14), 1)

        # buttons
        btn_w, btn_h = 200, 44
        by = ty + 48
        load_btn = pygame.Rect(W // 2 - btn_w - 20, by, btn_w, btn_h)
        restart_btn = pygame.Rect(W // 2 + 20, by, btn_w, btn_h)

        # load: pink solid
        lb = pygame.Surface((btn_w, btn_h), pygame.SRCALPHA)
        lb.fill(config.PINK_LIGHT)
        screen.blit(lb, (load_btn.x, load_btn.y))
        lt = _font(16, bold=True).render("读档", True, (44, 44, 56))
        screen.blit(lt, (load_btn.x + (btn_w - lt.get_width()) // 2,
                         load_btn.y + (btn_h - lt.get_height()) // 2))
        # restart: translucent + pink border
        rb = pygame.Surface((btn_w, btn_h), pygame.SRCALPHA)
        rb.fill((255, 255, 255, 15))
        pygame.draw.rect(rb, (255, 200, 214, 77), rb.get_rect(),
                         border_radius=btn_h // 2, width=1)
        screen.blit(rb, (restart_btn.x, restart_btn.y))
        rt = _font(16, bold=True).render("重新开始", True, config.PINK_LIGHT)
        screen.blit(rt, (restart_btn.x + (btn_w - rt.get_width()) // 2,
                         restart_btn.y + (btn_h - rt.get_height()) // 2))

        self._ending_load_btn = load_btn
        self._ending_restart_btn = restart_btn
        self._ending_close_rect = pygame.Rect(W - 40, 6, 32, 32)

    def _wrap(self, text: str, font: pygame.font.Font, max_w: int) -> list:
        if not text:
            return []
        lines = []
        current = ""
        for char in text:
            if char == '\n':
                lines.append(current)
                current = ""
            elif font.size(current + char)[0] <= max_w:
                current += char
            else:
                lines.append(current)
                current = char
        if current:
            lines.append(current)
        return lines
