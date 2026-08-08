"""
ManoAA Pygame Port — Configuration
"""
import os
import re

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = os.path.join(BASE_DIR, "assets")
GRESOURCE_DIR = ASSETS_DIR  # Use local assets exclusively
SAVE_DIR = os.path.join(BASE_DIR, "saves")

# Window
WINDOW_WIDTH = 1280
WINDOW_HEIGHT = 720
FPS = 60

# Character sizing (matches WeChat mini-program v25)
CHARACTER_HEIGHT_RATIO = 1.8   # 180% of window height
CHARACTER_WRAP_BOTTOM = -0.90  # -90vh equivalent

# Court mode sizing
COURT_CHAR_HEIGHT_RATIO = 1.0  # Full height in court left/right

# Dialog
DIALOG_HEIGHT_RATIO = 0.28  # Bottom 28% of screen
DIALOG_FONT_SIZE = 22
NAME_FONT_SIZE = 18
TYPING_SPEED = 20  # chars per second

# Colors — follow WeChat mini-program theme (pink accent on dark)
BG_COLOR = (0, 0, 0)
DIALOG_BG = (20, 20, 30, 128)          # rgba(20,20,30,0.5)
DIALOG_BORDER = (255, 133, 162, 90)    # pink border accent
NAME_COLOR = (255, 224, 236)           # #FFE0EC
TEXT_COLOR = (245, 245, 245)           # #F5F5F5
JUDGE_TEXT_COLOR = (0, 255, 0)         # judge testimony text (WeChat)
HINT_COLOR = (255, 200, 210)           # #FFC8D6
PINK = (255, 133, 162)                 # #FF85A2 accent
PINK_LIGHT = (255, 200, 214)           # #FFC8D6
PINK_BTN_TEXT = (255, 240, 245)        # #FFF0F5
PINK_TEXT = (255, 179, 198)            # #FFB3C6
DARK_PANEL = (25, 25, 35, 245)         # rgba(25,25,35,0.96)
TOP_BAR_BG = (0, 0, 0, 153)            # rgba(0,0,0,0.6)
CHOICE_BG = (0, 0, 0, 191)             # rgba(0,0,0,0.75)

# Audio
BGM_VOLUME_DEFAULT = 0.7
SE_VOLUME_DEFAULT = 0.8
VOICE_VOLUME_DEFAULT = 0.9


def resolve_path(url: str) -> str:
    """Universal resource path resolver.
    
    Handles all URL formats found in story data:
    1. JS concatenation: BASE + "/images/" + "ema/" + "file.webp"
    2. Baked-in prefix: gresource/images/bg/court00.webp
    3. Direct relative path: images/bg/court00.webp
    4. Absolute path
    """
    if not url:
        return None
    
    # Case 1: JS-style concatenation with BASE and +
    if "BASE" in url or ("+" in url and '"' in url):
        parts = re.findall(r'"([^"]*)"', url)
        rel = "".join(parts)
        if rel:
            # Strip leading gresource/ if present (from baked-in BASE)
            rel = re.sub(r'^gresource/', '', rel.lstrip('/'))
            path = os.path.join(GRESOURCE_DIR, rel.lstrip('/'))
            if os.path.exists(path):
                return path
    
    # Case 2: Baked-in gresource/ prefix from converted story data
    if url.startswith('gresource/'):
        rel = url[len('gresource/'):]
        path = os.path.join(GRESOURCE_DIR, rel)
        if os.path.exists(path):
            return path
    
    # Case 3: Direct path exists
    if os.path.exists(url):
        return url
    
    # Case 4: Try joining with assets dir
    path = os.path.join(GRESOURCE_DIR, url.lstrip('/'))
    if os.path.exists(path):
        return path
    
    return None
