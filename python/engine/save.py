"""
ManoAA Pygame Port — Save/Load System
"""
import json
import os
import sys, os; sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); import config


class SaveManager:
    def __init__(self):
        os.makedirs(config.SAVE_DIR, exist_ok=True)
        self.save_path = os.path.join(config.SAVE_DIR, "save.json")

    def save(self, data: dict):
        """Save game state to file."""
        with open(self.save_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    def load(self) -> dict:
        """Load game state. Returns None if no save."""
        if not os.path.exists(self.save_path):
            return None
        with open(self.save_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def has_save(self) -> bool:
        return os.path.exists(self.save_path)

    def delete(self):
        if os.path.exists(self.save_path):
            os.remove(self.save_path)
