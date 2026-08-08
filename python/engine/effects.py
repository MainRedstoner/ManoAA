"""
ManoAA Pygame Port — Effects Engine
Objection animations, testimony start/end effects, screen shake.
"""
import pygame
import math
import os
import sys, os; sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); import config


class EffectsEngine:
    def __init__(self):
        self.active = False
        self.img_path = ""
        self.img_surface = None
        self.effect_type = ""  # "objection", "testimony_start", "testimony_end", "cross_examination"
        self.phase = ""  # "show", "hold", "hide"
        self.timer = 0
        self.opacity = 0
        self.se_played = False

        # Timing constants (ms)
        self.SHOW_DURATION = 300   # Fade in
        self.HOLD_DURATION = 900   # Hold
        self.HIDE_DURATION = 150   # Fade out
        self.TESTIMONY_HOLD = 2000 # Longer hold for testimony
        self.TESTIMONY_HIDE = 500  # Slide up duration

    def _resolve(self, url: str) -> str:
        if not url:
            return None
        import re
        if "BASE" in url or "+" in url:
            parts = re.findall(r'"([^"]*)"', url)
            rel = "".join(parts)
            if rel:
                path = os.path.join(config.GRESOURCE_DIR, rel.lstrip("/"))
                if os.path.exists(path):
                    return path
        if os.path.exists(url):
            return url
        path = os.path.join(config.GRESOURCE_DIR, url.lstrip("/"))
        if os.path.exists(path):
            return path
        return None

    def start(self, img_url: str, se_url: str = None):
        """Start an objection/effect animation."""
        path = config.resolve_path(img_url)
        if not path:
            return

        try:
            orig = pygame.image.load(path).convert_alpha()
            ow, oh = orig.get_size()
            scale = min(config.WINDOW_WIDTH / ow, config.WINDOW_HEIGHT / oh)
            w, h = int(ow * scale), int(oh * scale)
            self.img_surface = pygame.transform.smoothscale(orig, (w, h))
        except:
            self.img_surface = None
            return

        self.active = True
        self.opacity = 0
        self.se_played = False
        self.se_url = se_url  # Store for later playback

        # Determine effect type from filename
        fname = os.path.basename(path).lower()
        if "testimony_start" in fname:
            self.effect_type = "testimony"
            self.phase = "show"
            self.timer = 0
        elif "testimony_end" in fname:
            self.effect_type = "testimony"
            self.phase = "show"
            self.timer = 0
        elif "cross_examination" in fname:
            self.effect_type = "testimony"
            self.phase = "show"
            self.timer = 0
        else:
            self.effect_type = "objection"
            self.phase = "show"
            self.timer = 0

    def update(self, dt_ms: float):
        """Update effect animation. Returns True if still active."""
        if not self.active:
            return False

        # Play SE at start of show phase
        if not self.se_played and self.se_url and self.phase == "show":
            # (pygame imported at module level — do NOT import again here,
            # a local import would shadow the module global for this method)
            try:
                sound_path = config.resolve_path(self.se_url)
                if sound_path:
                    s = pygame.mixer.Sound(sound_path)
                    s.set_volume(0.8)
                    s.play()
            except:
                pass
            self.se_played = True

        self.timer += dt_ms

        if self.effect_type == "testimony":
            if self.phase == "show":
                progress = min(self.timer / self.SHOW_DURATION, 1.0)
                self.opacity = int(255 * progress)
                if self.timer >= self.SHOW_DURATION:
                    self.phase = "hold"
                    self.timer = 0
            elif self.phase == "hold":
                self.opacity = 255
                if self.timer >= self.TESTIMONY_HOLD:
                    self.phase = "hide"
                    self.timer = 0
            elif self.phase == "hide":
                progress = min(self.timer / self.TESTIMONY_HIDE, 1.0)
                self.opacity = int(255 * (1 - progress))
                if self.timer >= self.TESTIMONY_HIDE:
                    self._end()
        else:  # objection
            if self.phase == "show":
                # Quick shake-like fade in (WeChat shakeFadeIn)
                progress = min(self.timer / self.SHOW_DURATION, 1.0)
                # decaying sine wobble + slight rotation
                damp = (1 - progress)
                wobble = int(22 * damp * math.sin(self.timer * 0.06))
                rot = 3.0 * damp * math.sin(self.timer * 0.05)
                self.opacity = int(255 * progress)
                self._wobble = wobble
                self._rot = rot
                if self.timer >= self.SHOW_DURATION:
                    self.phase = "hold"
                    self.timer = 0
                    self._wobble = 0
                    self._rot = 0
            elif self.phase == "hold":
                self.opacity = 255
                self._wobble = 0
                self._rot = 0
                if self.timer >= self.HOLD_DURATION:
                    self.phase = "hide"
                    self.timer = 0
            elif self.phase == "hide":
                progress = min(self.timer / self.HIDE_DURATION, 1.0)
                self.opacity = int(255 * (1 - progress))
                if self.timer >= self.HIDE_DURATION:
                    self._end()

        return True

    def _end(self):
        self.active = False
        self.img_surface = None
        self.phase = ""
        self.opacity = 0

    def cancel(self):
        """Immediately stop any playing effect (used when jumping to a node
        that has no effect of its own — a leftover effect must not linger
        over the new scene or block input)."""
        self.active = False
        self.img_surface = None
        self.phase = ""
        self.opacity = 0
        self.timer = 0

    def render(self, screen: pygame.Surface):
        """Render the effect overlay."""
        if not self.active or not self.img_surface:
            return

        surf = self.img_surface.copy()
        surf.set_alpha(self.opacity)

        x = (config.WINDOW_WIDTH - surf.get_width()) // 2
        y = (config.WINDOW_HEIGHT - surf.get_height()) // 2

        if getattr(self, '_wobble', 0):
            x += self._wobble
        if getattr(self, '_rot', 0):
            surf = pygame.transform.rotate(surf, self._rot)
            x = (config.WINDOW_WIDTH - surf.get_width()) // 2
            y = (config.WINDOW_HEIGHT - surf.get_height()) // 2

        # For testimony effects, slide up during hide phase
        if self.effect_type == "testimony" and self.phase == "hide":
            progress = self.timer / self.TESTIMONY_HIDE
            y -= int(progress * config.WINDOW_HEIGHT * 0.3)

        screen.blit(surf, (x, y))
