"""
ManoAA Pygame Port — Audio Engine (pygame mixer, high-quality)
BGM uses mixer.music (streaming), SE/Voice use mixer.Sound (pre-cached).
"""
import pygame
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import config


class AudioEngine:
    def __init__(self):
        # High-quality init
        pygame.mixer.quit()
        pygame.mixer.init(frequency=48000, size=-16, channels=2, buffer=4096)
        self.bgm_volume = config.BGM_VOLUME_DEFAULT
        self._bgm_loop_url = None
        self._bgm_intro_url = None
        self._bgm_loop_path = None
        self._waiting_intro_end = False
        self._se_cache = {}

    def resolve_url(self, url: str) -> str:
        return config.resolve_path(url)

    # ===== BGM (mixer.music) =====

    def play_bgm(self, loop_url: str, intro_url: str = None, volume: float = None):
        if volume is not None:
            self.bgm_volume = volume
        self.stop_bgm()

        loop_path = self.resolve_url(loop_url)
        intro_path = self.resolve_url(intro_url) if intro_url else None
        if not loop_path:
            return

        self._bgm_loop_url = loop_url
        self._bgm_intro_url = intro_url

        try:
            if intro_path:
                pygame.mixer.music.load(intro_path)
                pygame.mixer.music.set_volume(self.bgm_volume)
                pygame.mixer.music.play()
                pygame.mixer.music.set_endevent(pygame.USEREVENT + 1)
                self._bgm_loop_path = loop_path
                self._waiting_intro_end = True
            else:
                pygame.mixer.music.load(loop_path)
                pygame.mixer.music.set_volume(self.bgm_volume)
                pygame.mixer.music.play(-1)
        except Exception as e:
            print(f"[Audio] BGM error: {e}")

    def check_intro_end(self):
        if self._waiting_intro_end:
            self._waiting_intro_end = False
            if self._bgm_loop_path:
                try:
                    pygame.mixer.music.load(self._bgm_loop_path)
                    pygame.mixer.music.set_volume(self.bgm_volume)
                    pygame.mixer.music.play(-1)
                except Exception as e:
                    print(f"[Audio] BGM loop error: {e}")
            return True
        return False

    def stop_bgm(self):
        pygame.mixer.music.stop()
        pygame.mixer.music.set_endevent()
        self._waiting_intro_end = False

    def fade_out_bgm(self, duration_ms: int = 2000):
        pygame.mixer.music.fadeout(duration_ms)

    def set_bgm_volume(self, volume: float):
        self.bgm_volume = volume
        pygame.mixer.music.set_volume(volume)

    # ===== BGS =====

    def play_bgs(self, url: str, volume: float = 0.5):
        path = self.resolve_url(url)
        if not path:
            return
        try:
            s = pygame.mixer.Sound(path)
            s.set_volume(volume)
            s.play(loops=-1)
        except Exception as e:
            print(f"[Audio] BGS error: {e}")

    def stop_bgs(self):
        pass

    def fade_out_bgs(self, duration_ms: int = 2000):
        pass

    # ===== SE / Voice =====

    def _get_sound(self, url: str):
        path = self.resolve_url(url)
        if not path:
            return None
        if path not in self._se_cache:
            try:
                self._se_cache[path] = pygame.mixer.Sound(path)
            except Exception as e:
                print(f"[Audio] Load error: {e}")
                return None
        return self._se_cache[path]

    def play_se(self, url: str):
        s = self._get_sound(url)
        if s:
            s.set_volume(config.SE_VOLUME_DEFAULT)
            s.play()

    def play_voice(self, url: str):
        s = self._get_sound(url)
        if s:
            s.set_volume(config.VOICE_VOLUME_DEFAULT)
            s.play()

    def stop_voice(self):
        pass
