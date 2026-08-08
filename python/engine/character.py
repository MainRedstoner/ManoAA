"""
ManoAA Pygame Port — Character Sprite Manager
Handles loading, sizing, positioning, and transitions of character sprites.
"""
import pygame
import os
import sys, os; sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); import config


class CharacterSprite:
    def __init__(self, src: str, char_id: str):
        self.src = src
        self.id = char_id
        self.original_surface = None
        self.scaled_surface = None
        self.original_width = 0
        self.original_height = 0
        self.target_width = 0
        self.target_height = 0
        self.left_percent = 50
        self.anim_class = ""
        self.anim_timer = 0
        self.anim_duration = 0
        self.opacity = 255
        self.rotate_angle = 0
        self._load()

    def _load(self):
        """Load image and get original dimensions."""
        path = config.resolve_path(self.src)
        if path and os.path.exists(path):
            try:
                self.original_surface = pygame.image.load(path).convert_alpha()
                self.original_width = self.original_surface.get_width()
                self.original_height = self.original_surface.get_height()
            except Exception as e:
                print(f"[Character] Load error: {e}")

    def recalc_size(self, target_height: int):
        """Calculate scaled dimensions based on target height and aspect ratio."""
        if not self.original_surface or self.original_height == 0:
            return
        self.target_height = target_height
        ratio = self.original_width / self.original_height
        self.target_width = int(ratio * target_height)
        if self.target_width > 0 and self.target_height > 0:
            self.scaled_surface = pygame.transform.smoothscale(
                self.original_surface, (self.target_width, self.target_height)
            )

    def get_rect(self, container_left: int, container_bottom: int) -> pygame.Rect:
        """Get the render rect positioned at container_bottom, horizontally centered by left_percent."""
        if not self.scaled_surface:
            return pygame.Rect(0, 0, 0, 0)
        x = container_left + int(self.left_percent / 100 * config.WINDOW_WIDTH) - self.target_width // 2
        y = container_bottom - self.target_height
        return pygame.Rect(x, y, self.target_width, self.target_height)

    def render(self, screen: pygame.Surface, x: int, y: int):
        """Render the sprite at the given position.
        During rotate animation the bottom-center stays anchored."""
        if not self.scaled_surface:
            return
        surf = self.scaled_surface.copy()
        surf.set_alpha(self.opacity)
        if self.rotate_angle:
            rot = pygame.transform.rotate(surf, self.rotate_angle)
            rx = x + self.target_width // 2 - rot.get_width() // 2
            ry = y + self.target_height - rot.get_height()
            screen.blit(rot, (rx, ry))
        else:
            screen.blit(surf, (x, y))

    def start_anim(self, anim_type: int):
        """Start entrance animation. 1=rotate (4 full spins, WeChat style),
        2=fade."""
        if anim_type == 1:
            self.anim_class = "enter-rotate"
            self.anim_duration = 60  # frames
        elif anim_type == 2:
            self.anim_class = "enter-fade"
            self.anim_duration = 30
        self.anim_timer = 0
        self.opacity = 0

    def update_anim(self):
        """Update animation frame."""
        if self.anim_class == "enter-fade":
            self.anim_timer += 1
            progress = min(self.anim_timer / self.anim_duration, 1.0)
            self.opacity = int(255 * progress)
            if progress >= 1.0:
                self.anim_class = ""
                self.opacity = 255
        elif self.anim_class == "enter-rotate":
            self.anim_timer += 1
            progress = min(self.anim_timer / self.anim_duration, 1.0)
            self.opacity = int(255 * progress)
            # real rotation: 4 full spins (1440deg), easing out
            ease = 1 - (1 - progress) ** 2
            self.rotate_angle = int(1440 * ease) % 360
            if progress >= 1.0:
                self.anim_class = ""
                self.rotate_angle = 0
                self.opacity = 255


class CharacterManager:
    def __init__(self):
        self.sprites: list[CharacterSprite] = []
        self.size_cache = {}  # url -> (w, h)

    def clear(self):
        self.sprites.clear()

    def set_characters(self, urls: list, char_height: int):
        """Set active characters from a list of URLs."""
        self.sprites.clear()
        if not urls:
            return

        for i, url in enumerate(urls):
            # Handle concatenated paths like: BASE + "/images/character/" + "ema/" + "EMA5.webp"
            if isinstance(url, str) and "+" in url:
                import re
                parts = re.findall(r'"([^"]+)"', url)
                url = "".join(parts)

            sprite = CharacterSprite(url, f"char_{i}")
            sprite.recalc_size(char_height)
            sprite.left_percent = ((i + 0.5) / len(urls)) * 100
            self.sprites.append(sprite)

    def recalc_all(self, char_height: int):
        for sprite in self.sprites:
            sprite.recalc_size(char_height)

    def update(self):
        for sprite in self.sprites:
            sprite.update_anim()

    def render(self, screen: pygame.Surface, container_left: int, container_bottom: int):
        for sprite in self.sprites:
            sprite.update_anim()
            rect = sprite.get_rect(container_left, container_bottom)
            if rect.width > 0:
                sprite.render(screen, rect.x, rect.y)
