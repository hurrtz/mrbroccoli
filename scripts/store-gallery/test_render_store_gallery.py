#!/usr/bin/env python3
"""Geometry and line-breaking checks for the store gallery renderer.

Run with: python3 -m unittest discover -s scripts/store-gallery -p 'test_*.py'
Stdlib unittest so the repository gains no test dependency.
"""

from __future__ import annotations

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from PIL import ImageFont

from render_store_gallery import (  # noqa: E402
    FONT_PATH,
    NO_LINE_START,
    PANELS,
    PROFILES,
    Headline,
    compute_geometry,
    is_complex_script,
)


class GeometryTests(unittest.TestCase):
    def profiles(self):
        for name, spec in PROFILES.items():
            panel = spec["panel"]
            # Screenshots are captured at the profile's own store size.
            yield name, panel, compute_geometry(name, panel, panel)

    def test_reference_profile_matches_the_brief(self):
        """The brief publishes the 6.9" numbers; they are the contract."""
        geo = compute_geometry("ios-6.9", (1320, 2868), (1320, 2868))
        self.assertEqual(geo.top_margin, 104)
        self.assertEqual(geo.band_height, 336)
        self.assertEqual(geo.gap, 69)
        self.assertEqual(geo.bottom_margin, 104)
        self.assertEqual(geo.font_size, 82)
        self.assertEqual(geo.frame_w, 1070)
        self.assertEqual(geo.frame_padding, 30)
        self.assertEqual(geo.frame_radius, 112)
        self.assertEqual(geo.shot_radius, 91)

    def test_bands_and_frame_tile_the_panel_exactly(self):
        for name, panel, geo in self.profiles():
            with self.subTest(profile=name):
                total = (
                    geo.top_margin + geo.band_height + geo.gap
                    + geo.available_height + geo.bottom_margin
                )
                self.assertEqual(total, geo.panel_h)
                self.assertEqual((geo.panel_w, geo.panel_h), panel)

    def test_frame_stays_inside_its_margins(self):
        for name, _, geo in self.profiles():
            with self.subTest(profile=name):
                self.assertGreaterEqual(
                    geo.frame_y, geo.top_margin + geo.band_height + geo.gap
                )
                self.assertLessEqual(
                    geo.frame_y + geo.frame_h, geo.panel_h - geo.bottom_margin
                )
                self.assertGreaterEqual(geo.frame_x, 0)
                self.assertLessEqual(geo.frame_x + geo.frame_w, geo.panel_w)

    def test_screenshot_is_never_stretched(self):
        """The frame's inner box holds the native ratio to within a pixel."""
        for name, panel, geo in self.profiles():
            with self.subTest(profile=name):
                native = panel[0] / panel[1]
                self.assertAlmostEqual(geo.inner_w / geo.inner_h, native, places=3)

    def test_inner_box_is_the_frame_less_its_padding(self):
        for name, _, geo in self.profiles():
            with self.subTest(profile=name):
                self.assertEqual(geo.inner_w, geo.frame_w - 2 * geo.frame_padding)
                self.assertEqual(geo.inner_h, geo.frame_h - 2 * geo.frame_padding)

    def test_wide_screenshot_is_width_constrained(self):
        """Too wide to fill the height: pin the frame to 248*s and centre it."""
        geo = compute_geometry("ios-6.9", (1320, 2868), (1320, 2000))
        self.assertEqual(geo.constraint, "width")
        self.assertLess(geo.frame_h, geo.available_height)

    def test_narrow_screenshot_is_height_constrained(self):
        geo = compute_geometry("ios-6.9", (1320, 2868), (900, 2868))
        self.assertEqual(geo.constraint, "height")
        self.assertEqual(geo.frame_h, geo.available_height)

    def test_tablets_resolve_to_height_constrained(self):
        """The brief's prose predicts width-constrained tablets; its own formula
        does not, because tablet panels are wide too. Forcing width overflows."""
        for name in ("ios-ipad", "android-tablet"):
            with self.subTest(profile=name):
                panel = PROFILES[name]["panel"]
                geo = compute_geometry(name, panel, panel)
                self.assertEqual(geo.constraint, "height")
                self.assertEqual(geo.frame_h, geo.available_height)

    def test_seven_panels_and_no_excluded_screenshot(self):
        self.assertEqual(len(PANELS), 7)
        excluded = {"03", "04", "05", "07", "09", "12"}
        self.assertFalse({slug[:2] for slug in PANELS} & excluded)


class WrappingTests(unittest.TestCase):
    def headline(self, size=82, rtl=False):
        font = ImageFont.truetype(str(FONT_PATH), size)
        return Headline(font, -0.43, rtl)

    def test_lines_stay_within_the_band(self):
        head = self.headline()
        text = "Explore another direction without losing the thread."
        for line in head.wrap(text, 1070, False):
            self.assertLessEqual(head.measure(line, False), 1070)

    def test_wrapping_preserves_every_word(self):
        head = self.headline()
        text = "Ask out loud. Hear an answer worth listening to."
        self.assertEqual(" ".join(head.wrap(text, 1070, False)).split(), text.split())

    def test_closing_punctuation_never_starts_a_line(self):
        """Regression: the CJK full-width period was orphaning onto its own line."""
        head = self.headline()
        for text in ("开口就问，听到值得一听的回答。", "话の筋を保ったまま、別の道へ。"):
            for width in range(200, 1200, 60):
                lines = head.wrap(text, width, is_complex_script(text))
                for line in lines:
                    self.assertNotIn(
                        line[0], NO_LINE_START,
                        f"{line!r} starts with closing punctuation at width {width}",
                    )

    def test_unbreakable_text_still_yields_lines(self):
        head = self.headline()
        lines = head.wrap("x" * 400, 300, False)
        self.assertGreater(len(lines), 1)
        self.assertTrue(all(line for line in lines))


if __name__ == "__main__":
    unittest.main()
