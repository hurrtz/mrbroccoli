#!/usr/bin/env python3
"""Output replacement checks for the Fastlane listing exporter."""

from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from export_fastlane import clear_generated_tree  # noqa: E402


class OutputTests(unittest.TestCase):
    def test_generated_listing_is_replaced_without_touching_fastlane_config(self):
        with tempfile.TemporaryDirectory() as temporary:
            out = Path(temporary)
            stale_shot = out / "screenshots" / "en-US" / "old-campaign.png"
            stale_note = out / "metadata" / "en-US" / "old-release.txt"
            fastfile = out / "Fastfile"
            stale_shot.parent.mkdir(parents=True)
            stale_note.parent.mkdir(parents=True)
            stale_shot.write_bytes(b"old")
            stale_note.write_text("old", encoding="utf-8")
            fastfile.write_text("keep", encoding="utf-8")

            clear_generated_tree(out)

            self.assertFalse((out / "screenshots").exists())
            self.assertFalse((out / "metadata").exists())
            self.assertEqual(fastfile.read_text(encoding="utf-8"), "keep")


if __name__ == "__main__":
    unittest.main()
