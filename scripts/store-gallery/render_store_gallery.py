#!/usr/bin/env python3
"""Render App Store and Play Store gallery images from the store-promo screenshot library.

The approved layout remains based on
`design-system/templates/app-store-gallery/AppStoreGallery.dc.html`. The
current seven-panel BYOK story and localized headlines live in this script and
`headlines.json`; they supersede the retired local-response panel in the
vendored design brief.

A panel is a flat `#44A055` rectangle at the profile's exact store dimensions
holding one headline and one device-framed screenshot. All geometry scales from
the 306x665 reference panel by `s = targetWidth / 306`. Screenshots keep their
native aspect ratio and are never stretched.

Usage:
    python3 scripts/store-gallery/render_store_gallery.py --profiles ios-6.9 --langs en --schemes light
    python3 scripts/store-gallery/render_store_gallery.py            # everything
"""

from __future__ import annotations

import argparse
import json
import math
import sys
from dataclasses import dataclass, field
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

REPO_ROOT = Path(__file__).resolve().parents[2]
LIBRARY_ROOT = REPO_ROOT / "artifacts" / "store-promos"
DEFAULT_OUT_ROOT = REPO_ROOT / "artifacts" / "store-gallery"
HEADLINES_PATH = Path(__file__).resolve().parent / "headlines.json"
FONT_PATH = REPO_ROOT / "design-system" / "assets" / "fonts" / "UnicaOne_400Regular.ttf"
FALLBACK_FONT_ROOT = DEFAULT_OUT_ROOT / ".fonts"  # populated by sync_fonts.py

# --- Literals from the brief -------------------------------------------------

BACKGROUND = (0x44, 0xA0, 0x55)
FRAME_COLOR = (0x0B, 0x0C, 0x0E)
HEADLINE_COLOR = (0xFF, 0xFF, 0xFF)

REFERENCE_WIDTH = 306
REF_TOP_MARGIN = 24
REF_BAND_HEIGHT = 78
REF_GAP = 16
REF_BOTTOM_MARGIN = 24
REF_SIDE_PADDING = 29  # 306 - 2*29 = 248, the content width
REF_CONTENT_WIDTH = 248
REF_FRAME_RADIUS = 26
REF_FRAME_PADDING = 7
REF_SHOT_RADIUS = 21
REF_FONT_SIZE = 19
REF_TRACKING = -0.1
REF_SHADOW_OFFSET_Y = 18
REF_SHADOW_BLUR = 36
SHADOW_ALPHA = 0.35
LINE_HEIGHT_FACTOR = 1.3
MAX_LINES = 3

# The seven approved BYOK panels, in story order.
PANELS = [
    "01-voice-first-conversation",
    "05-choose-exact-model",
    "04-byok-settings",
    "07-conversation-settings",
    "06-choose-your-voice",
    "02-complete-transcript",
    "03-conversation-branches",
]

# `panel` is the store's required export size; `capture` is the size the
# screenshots were shot at (see `acceptedPortraitDimensions` in
# scripts/store-promo-config.mjs). They match everywhere except Android phone.
# Keep both in sync when a store changes a spec.
PROFILES: dict[str, dict] = {
    "ios-4.7": {"library": ("ios", "4.7"), "panel": (750, 1334), "capture": (750, 1334)},
    "ios-6.1": {"library": ("ios", "6.1"), "panel": (1170, 2532), "capture": (1170, 2532)},
    "ios-6.3": {"library": ("ios", "6.3"), "panel": (1206, 2622), "capture": (1206, 2622)},
    "ios-6.5": {"library": ("ios", "6.5"), "panel": (1242, 2688), "capture": (1242, 2688)},
    "ios-6.9": {"library": ("ios", "6.9"), "panel": (1320, 2868), "capture": (1320, 2868)},
    "ios-ipad": {"library": ("ios", "ipad"), "panel": (2064, 2752), "capture": (2064, 2752)},
    # Play caps the long side at twice the short side, so the 1080x2400 capture
    # shape is not a legal panel; 1080x2160 is the tallest that passes. The
    # screenshot keeps its own ratio inside the frame, so only the frame shortens.
    "android-phone": {"library": ("android", "phone"), "panel": (1080, 2160), "capture": (1080, 2400)},
    "android-tablet": {"library": ("android", "tablet"), "panel": (1600, 2560), "capture": (1600, 2560)},
}

LANGUAGES = [
    "en", "de", "fr", "es", "it", "pt", "pt-BR", "sv", "pl", "cs",
    "hu", "tr", "ru", "uk", "hi", "ja", "zh-CN", "ar", "ur",
]
SCHEMES = ["light", "dark"]
RTL_LANGUAGES = {"ar", "ur"}

# Unica One is Latin + Latin-ext only. Languages outside that fall back to the
# platform UI font for their script, which differs per store. Faces are vendored
# from this machine's iOS runtime and a connected Android device by sync_fonts.py.
LANG_SCRIPT = {
    "ru": "cyrillic", "uk": "cyrillic",
    "zh-CN": "han-sc", "ja": "kana",
    "ar": "arabic", "ur": "nastaliq", "hi": "devanagari",
}
SCRIPT_FONTS = {
    "ios": {
        "cyrillic": ("SFUI.ttf", 0),                    # SF Pro
        "han-sc": ("HiraginoSansGB.ttc", 1),            # PingFang stand-in, see sync_fonts.py
        "kana": ("HiraginoKakuGothic.ttc", 5),          # .Hiragino Kaku Gothic Interface W3
        "arabic": ("SFArabic.ttf", 0),
        "nastaliq": ("DecoTypeNastaleeqUrdu.ttc", 0),
        "devanagari": ("Kohinoor.ttc", 0),              # Kohinoor Devanagari Regular
    },
    "android": {
        "cyrillic": ("Roboto-Regular.ttf", 0),
        "han-sc": ("NotoSansCJK-Regular.ttc", 2),       # Noto Sans CJK SC
        "kana": ("NotoSansCJK-Regular.ttc", 0),         # Noto Sans CJK JP
        "arabic": ("NotoNaskhArabic-Regular.ttf", 0),
        "nastaliq": ("NotoNaskhArabic-Regular.ttf", 0),
        "devanagari": ("NotoSansDevanagari-VF.ttf", 0),
    },
}
# Nastaliq fits much smaller letterforms in the same em than the other faces, so
# at a shared size Urdu reads lighter than every other language. Setting it
# larger is what keeps the set even - the intent behind the brief's one-size rule.
SCRIPT_SIZE_SCALE = {"nastaliq": 1.35}

# Line-height 1.3 is tuned for Latin. Nastaliq, Devanagari and Naskh ink taller
# than that box, so leading opens up per language to clear the tallest line the
# set actually uses. Only the space between lines changes, never the size.
LEADING_GAP_FACTOR = 0.08

# Scripts whose glyphs are positioned by the shaper; per-character tracking would
# break joining and reordering, so those lines are drawn as one shaped run.
COMPLEX_RANGES = (
    (0x0590, 0x05FF),  # Hebrew
    (0x0600, 0x06FF),  # Arabic
    (0x0700, 0x074F),  # Syriac
    (0x0750, 0x077F),  # Arabic Supplement
    (0x0900, 0x097F),  # Devanagari
    (0x0980, 0x0DFF),  # Bengali .. Sinhala
    (0x0E00, 0x0E7F),  # Thai
    (0xFB50, 0xFDFF),  # Arabic Presentation Forms-A
    (0xFE70, 0xFEFF),  # Arabic Presentation Forms-B
)

# Kinsoku shori: CJK text has no spaces, so it breaks between characters - but
# a line may not begin with closing punctuation or end with opening punctuation.
# Trailing punctuation is allowed to hang past the measured width, which is the
# conventional fix and keeps it off a line of its own.
NO_LINE_START = set("。、，．！？：；）」』】〉》〕｝］”’〞»…ー々ぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮ")
NO_LINE_END = set("（「『【〈《〔｛［“‘〝«")

# Fraction of the band a headline may fill before it is reported as tight.
TIGHT_WIDTH_RATIO = 0.95
TIGHT_HEIGHT_RATIO = 0.90
# Integer rounding drifts the frame's inner box off the screenshot's native
# ratio by at most half a pixel; anything beyond this is a real mismatch.
RATIO_EPSILON = 0.001


def is_complex_script(text: str) -> bool:
    return any(
        any(lo <= ord(ch) <= hi for lo, hi in COMPLEX_RANGES) for ch in text
    )


# --- Geometry ----------------------------------------------------------------


@dataclass
class Geometry:
    profile: str
    panel_w: int
    panel_h: int
    scale: float
    top_margin: int
    band_height: int
    gap: int
    bottom_margin: int
    side_padding: int
    band_width: int
    band_x: int
    band_y: int
    available_height: int
    frame_padding: int
    frame_radius: int
    shot_radius: int
    frame_x: int
    frame_y: int
    frame_w: int
    frame_h: int
    inner_x: int
    inner_y: int
    inner_w: int
    inner_h: int
    font_size: int
    tracking: float
    line_height: float
    shadow_offset_y: int
    shadow_sigma: float
    constraint: str
    notes: list[str] = field(default_factory=list)


def compute_geometry(profile: str, panel: tuple[int, int], shot: tuple[int, int]) -> Geometry:
    """Scale the 306x665 reference to `panel`, fitting `shot` at its native ratio."""
    panel_w, panel_h = panel
    shot_w, shot_h = shot
    s = panel_w / REFERENCE_WIDTH

    top_margin = round(REF_TOP_MARGIN * s)
    band_height = round(REF_BAND_HEIGHT * s)
    gap = round(REF_GAP * s)
    bottom_margin = round(REF_BOTTOM_MARGIN * s)
    side_padding = round(REF_SIDE_PADDING * s)
    band_width = panel_w - 2 * side_padding

    available_height = panel_h - top_margin - band_height - gap - bottom_margin
    frame_padding = round(REF_FRAME_PADDING * s)

    ratio = shot_w / shot_h
    notes: list[str] = []

    # Height-constrained candidate: the frame fills the remaining height and the
    # screenshot's ratio derives its width.
    cand_inner_h = available_height - 2 * frame_padding
    cand_frame_w = cand_inner_h * ratio + 2 * frame_padding
    max_frame_w = panel_w - 2 * REF_SIDE_PADDING * s  # == 248 * s

    if cand_frame_w > max_frame_w:
        constraint = "width"
    else:
        constraint = "height"

    if constraint == "width":
        # Fix the frame width at 248*s; the frame ends up shorter than the
        # remaining height and is centred in that space.
        frame_w = round(REF_CONTENT_WIDTH * s)
        inner_w = frame_w - 2 * frame_padding
        inner_h = round(inner_w / ratio)
        frame_h = inner_h + 2 * frame_padding
        if frame_h > available_height:
            # A width-constrained frame that does not fit cannot be honoured
            # without either cropping or stretching the screenshot. Fall back to
            # the height-constrained branch, which always fits.
            notes.append(
                f"width-constrained frame would be {frame_h}px in {available_height}px "
                "of space; fell back to height-constrained"
            )
            constraint = "height"

    if constraint == "height":
        frame_h = available_height
        inner_h = frame_h - 2 * frame_padding
        inner_w = round(inner_h * ratio)
        frame_w = inner_w + 2 * frame_padding

    frame_x = round((panel_w - frame_w) / 2)
    frame_y = top_margin + band_height + gap + round((available_height - frame_h) / 2)

    return Geometry(
        profile=profile,
        panel_w=panel_w,
        panel_h=panel_h,
        scale=s,
        top_margin=top_margin,
        band_height=band_height,
        gap=gap,
        bottom_margin=bottom_margin,
        side_padding=side_padding,
        band_width=band_width,
        band_x=side_padding,
        band_y=top_margin,
        available_height=available_height,
        frame_padding=frame_padding,
        frame_radius=round(REF_FRAME_RADIUS * s),
        shot_radius=round(REF_SHOT_RADIUS * s),
        frame_x=frame_x,
        frame_y=frame_y,
        frame_w=frame_w,
        frame_h=frame_h,
        inner_x=frame_x + frame_padding,
        inner_y=frame_y + frame_padding,
        inner_w=inner_w,
        inner_h=inner_h,
        font_size=round(REF_FONT_SIZE * s),
        tracking=REF_TRACKING * s,
        line_height=LINE_HEIGHT_FACTOR * round(REF_FONT_SIZE * s),
        shadow_offset_y=round(REF_SHADOW_OFFSET_Y * s),
        shadow_sigma=REF_SHADOW_BLUR * s / 2,  # CSS blur radius ~= 2 sigma
        constraint=constraint,
        notes=notes,
    )


# --- Text --------------------------------------------------------------------


class Headline:
    """Wraps and draws one headline, honouring CSS letter-spacing where it is safe."""

    def __init__(self, font: ImageFont.FreeTypeFont, tracking: float, rtl: bool):
        self.font = font
        self.tracking = tracking
        self.rtl = rtl
        self.direction = "rtl" if rtl else "ltr"

    def measure(self, text: str, shaped: bool) -> float:
        base = self.font.getlength(text, direction=self.direction)
        if shaped or len(text) < 2:
            return base
        return base + self.tracking * (len(text) - 1)

    def wrap(self, text: str, max_width: float, shaped: bool) -> list[str]:
        lines: list[str] = []
        current = ""
        for token in text.split():
            trial = f"{current} {token}" if current else token
            if self.measure(trial, shaped) <= max_width:
                current = trial
                continue
            if current:
                lines.append(current)
                current = ""
            if self.measure(token, shaped) <= max_width:
                current = token
                continue
            # No break opportunity fits — break inside the token, which is also
            # how CJK text without spaces wraps.
            piece = ""
            for ch in token:
                fits = not piece or self.measure(piece + ch, shaped) <= max_width
                if fits or ch in NO_LINE_START:
                    piece += ch
                    continue
                while len(piece) > 1 and piece[-1] in NO_LINE_END:
                    ch = piece[-1] + ch
                    piece = piece[:-1]
                lines.append(piece)
                piece = ch
            current = piece
        if current:
            lines.append(current)
        return lines or [""]

    def draw_line(self, draw: ImageDraw.ImageDraw, x: float, baseline: float, line: str, shaped: bool) -> None:
        if shaped:
            draw.text(
                (x, baseline), line, font=self.font, fill=HEADLINE_COLOR,
                anchor="ls", direction=self.direction,
            )
            return
        # Per-character placement at kerned cumulative advances plus tracking.
        # CSS letter-spacing suppresses ligatures the same way.
        for index, ch in enumerate(line):
            if ch == " ":
                continue
            offset = self.font.getlength(line[:index], direction=self.direction)
            draw.text(
                (x + offset + self.tracking * index, baseline),
                ch, font=self.font, fill=HEADLINE_COLOR, anchor="ls",
            )

    def ink_height(self, line: str) -> int:
        if not line.strip():
            return 0
        box = self.font.getbbox(line, anchor="ls", direction=self.direction)
        return box[3] - box[1]


def resolve_font(
    platform: str, lang: str, size: int, scale: float = 1.0
) -> tuple[ImageFont.FreeTypeFont, str]:
    """Unica One, or the platform UI font for a script Unica One does not cover."""
    script = LANG_SCRIPT.get(lang)
    if script is None:
        return ImageFont.truetype(str(FONT_PATH), size), "Unica One"
    name, index = SCRIPT_FONTS[platform][script]
    path = FALLBACK_FONT_ROOT / platform / name
    if not path.exists():
        raise FileNotFoundError(
            f"{lang} needs {path.name} for {script}; run scripts/store-gallery/sync_fonts.py"
        )
    return ImageFont.truetype(str(path), round(size * scale), index=index), path.name


@dataclass
class Typography:
    headline: Headline
    font_name: str
    line_height: float
    wrapped: dict[str, list[str]]
    scale: float


def fit_typography(
    platform: str, lang: str, geo: Geometry, strings: list[str], rtl: bool
) -> Typography:
    """Settle font, size, wrapping and leading once for a whole language.

    The per-script size boost is a target, not a promise: it steps back down
    until every headline in the set still fits the band, so no language can
    push type out of its box.
    """
    target = SCRIPT_SIZE_SCALE.get(LANG_SCRIPT.get(lang), 1.0)
    scale = target
    while True:
        font, font_name = resolve_font(platform, lang, geo.font_size, scale)
        headline = Headline(font, geo.tracking, rtl)
        wrapped = {s: headline.wrap(s, geo.band_width, is_complex_script(s)) for s in strings}
        line_height = language_line_height(headline, list(wrapped.values()), geo)
        block = max(len(lines) for lines in wrapped.values()) * line_height
        if block <= geo.band_height or scale <= 1.0:
            return Typography(headline, font_name, line_height, wrapped, scale)
        scale = round(scale - 0.05, 2)


def language_line_height(headline: Headline, wrapped: list[list[str]], geo: Geometry) -> float:
    """Leading for one language: the CSS 1.3, opened up if the script inks taller."""
    required = max(
        (headline.ink_height(line) for lines in wrapped for line in lines), default=0
    )
    return max(geo.line_height, required + LEADING_GAP_FACTOR * headline.font.size)


# --- Drawing helpers ---------------------------------------------------------


def rounded_mask(size: tuple[int, int], radius: int, supersample: int = 4) -> Image.Image:
    """Anti-aliased rounded-rectangle alpha mask (PIL's own draw is aliased)."""
    w, h = size
    big = Image.new("L", (w * supersample, h * supersample), 0)
    ImageDraw.Draw(big).rounded_rectangle(
        (0, 0, w * supersample - 1, h * supersample - 1),
        radius=radius * supersample,
        fill=255,
    )
    return big.resize((w, h), Image.LANCZOS)


def build_panel_base(geo: Geometry, frame_mask: Image.Image) -> Image.Image:
    """Green background + drop shadow + dark device frame. Identical for every
    panel of a profile, so it is built once and copied."""
    base = Image.new("RGB", (geo.panel_w, geo.panel_h), BACKGROUND)

    pad = int(math.ceil(3 * geo.shadow_sigma)) + 1
    shadow = Image.new("L", (geo.panel_w + 2 * pad, geo.panel_h + 2 * pad), 0)
    shadow.paste(
        frame_mask.point(lambda v: int(v * SHADOW_ALPHA)),
        (geo.frame_x + pad, geo.frame_y + geo.shadow_offset_y + pad),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(geo.shadow_sigma))
    shadow = shadow.crop((pad, pad, pad + geo.panel_w, pad + geo.panel_h))
    base.paste(Image.new("RGB", base.size, (0, 0, 0)), (0, 0), shadow)

    frame = Image.new("RGB", (geo.frame_w, geo.frame_h), FRAME_COLOR)
    base.paste(frame, (geo.frame_x, geo.frame_y), frame_mask)
    return base


# --- Rendering ---------------------------------------------------------------


@dataclass
class Finding:
    kind: str
    profile: str
    lang: str
    scheme: str
    panel: str
    detail: str


def render_panel(
    base: Image.Image,
    geo: Geometry,
    shot_path: Path,
    shot_mask: Image.Image,
    headline_text: str,
    headline: Headline,
    lines: list[str],
    line_height: float,
) -> tuple[Image.Image, dict]:
    image = base.copy()

    with Image.open(shot_path) as raw:
        shot = raw.convert("RGB").resize((geo.inner_w, geo.inner_h), Image.LANCZOS)
    image.paste(shot, (geo.inner_x, geo.inner_y), shot_mask)

    shaped = is_complex_script(headline_text)
    widths = [headline.measure(line, shaped) for line in lines]

    ascent, descent = headline.font.getmetrics()
    block_height = len(lines) * line_height

    if ascent + descent <= line_height:
        # The reference is CSS flex centring, which centres the line boxes.
        block_top = geo.band_y + (geo.band_height - block_height) / 2
        first_baseline = block_top + (line_height - (ascent + descent)) / 2 + ascent
    else:
        # Nastaliq and friends ink past their own line box; centre what is
        # actually visible so nothing rides out of the band.
        spans = []
        for index, line in enumerate(lines):
            box = headline.font.getbbox(line, anchor="ls", direction=headline.direction)
            spans.append((index * line_height + box[1], index * line_height + box[3]))
        ink_top = min(top for top, _ in spans)
        ink_bottom = max(bottom for _, bottom in spans)
        first_baseline = (
            geo.band_y + (geo.band_height - (ink_bottom - ink_top)) / 2 - ink_top
        )

    draw = ImageDraw.Draw(image)
    ink_top_abs, ink_bottom_abs = None, None
    for index, line in enumerate(lines):
        baseline = first_baseline + index * line_height
        x = geo.band_x + (geo.band_width - widths[index]) / 2
        headline.draw_line(draw, x, baseline, line, shaped)
        if line.strip():
            box = headline.font.getbbox(line, anchor="ls", direction=headline.direction)
            top, bottom = baseline + box[1], baseline + box[3]
            ink_top_abs = top if ink_top_abs is None else min(ink_top_abs, top)
            ink_bottom_abs = bottom if ink_bottom_abs is None else max(ink_bottom_abs, bottom)

    return image, {
        "lines": len(lines),
        "widest": max(widths) if widths else 0.0,
        "width_ratio": (max(widths) / geo.band_width) if widths else 0.0,
        "height_ratio": block_height / geo.band_height,
        "line_height": line_height,
        "ink_top": ink_top_abs,
        "ink_bottom": ink_bottom_abs,
        "ink_escapes_band": bool(
            ink_top_abs is not None
            and (ink_top_abs < geo.band_y or ink_bottom_abs > geo.band_y + geo.band_height)
        ),
        "shaped_run": shaped,
    }


def render(
    profiles: list[str],
    langs: list[str],
    schemes: list[str],
    out_root: Path,
    headlines: dict,
    dry_run: bool,
) -> dict:
    if not FONT_PATH.exists():
        sys.exit(f"Unica One not found at {FONT_PATH}")

    findings: list[Finding] = []
    written = 0
    geometries: dict[str, Geometry] = {}

    for profile in profiles:
        spec = PROFILES[profile]
        platform, folder = spec["library"]
        panel = spec["panel"]
        capture = spec["capture"]
        profile_dir = LIBRARY_ROOT / platform / folder

        if panel != capture:
            findings.append(Finding(
                "panel-differs-from-capture", profile, "-", "-", "-",
                f"panel {panel[0]}x{panel[1]} is not the capture size "
                f"{capture[0]}x{capture[1]}; the frame absorbs the difference",
            ))

        cache: dict[tuple[int, int], tuple[Geometry, Image.Image, Image.Image]] = {}
        typography: dict[str, Typography] = {}

        for scheme in schemes:
            for lang in langs:
                source = profile_dir / scheme / lang
                if not source.is_dir():
                    findings.append(Finding(
                        "missing-source", profile, lang, scheme, "-",
                        f"no screenshot directory at {source.relative_to(REPO_ROOT)}",
                    ))
                    continue

                strings = headlines.get(lang)
                if not strings:
                    findings.append(Finding(
                        "missing-headlines", profile, lang, scheme, "-",
                        f"no headlines for language '{lang}'",
                    ))
                    continue

                target_dir = out_root / profile / lang / scheme
                if not dry_run:
                    target_dir.mkdir(parents=True, exist_ok=True)

                for index, slug in enumerate(PANELS):
                    shot_path = source / f"{slug}.png"
                    if not shot_path.exists():
                        findings.append(Finding(
                            "missing-screenshot", profile, lang, scheme, slug,
                            f"expected {shot_path.relative_to(REPO_ROOT)}",
                        ))
                        continue

                    with Image.open(shot_path) as probe:
                        shot_size = probe.size

                    # A screenshot is measured against the capture spec it was
                    # shot to, not against the panel - those differ by design
                    # wherever a store's export size is not the device size.
                    if shot_size != capture:
                        expected_ratio = capture[0] / capture[1]
                        actual_ratio = shot_size[0] / shot_size[1]
                        kind = (
                            "aspect-mismatch"
                            if abs(expected_ratio - actual_ratio) > RATIO_EPSILON
                            else "size-mismatch"
                        )
                        findings.append(Finding(
                            kind, profile, lang, scheme, slug,
                            f"screenshot {shot_size[0]}x{shot_size[1]} "
                            f"(ratio {actual_ratio:.5f}) vs expected capture "
                            f"{capture[0]}x{capture[1]} (ratio {expected_ratio:.5f})",
                        ))

                    if shot_size not in cache:
                        geo = compute_geometry(profile, panel, shot_size)
                        frame_mask = rounded_mask((geo.frame_w, geo.frame_h), geo.frame_radius)
                        shot_mask = rounded_mask((geo.inner_w, geo.inner_h), geo.shot_radius)
                        cache[shot_size] = (geo, build_panel_base(geo, frame_mask), shot_mask)
                        geometries.setdefault(profile, geo)
                        for note in geo.notes:
                            findings.append(Finding(
                                "geometry-note", profile, "-", "-", "-", note,
                            ))
                        drift = abs((geo.inner_w / geo.inner_h) - (shot_size[0] / shot_size[1]))
                        if drift > RATIO_EPSILON:
                            findings.append(Finding(
                                "aspect-drift", profile, "-", "-", "-",
                                f"frame inner box {geo.inner_w}x{geo.inner_h} drifts "
                                f"{drift:.5f} from the native ratio",
                            ))

                    geo, base, shot_mask = cache[shot_size]

                    if lang not in typography:
                        # Font, size, wrapping and leading are settled once per
                        # language so every panel in a listing shares them.
                        typography[lang] = fit_typography(
                            platform, lang, geo, strings, lang in RTL_LANGUAGES
                        )
                        type_set = typography[lang]
                        if type_set.line_height > geo.line_height:
                            findings.append(Finding(
                                "leading-opened", profile, lang, "-", "-",
                                f"{type_set.font_name}: line-height {geo.line_height:.0f}px -> "
                                f"{type_set.line_height:.0f}px so lines clear each other",
                            ))
                        if type_set.font_name != "Unica One":
                            findings.append(Finding(
                                "fallback-font", profile, lang, "-", "-",
                                f"headlines set in {type_set.font_name} at "
                                f"{type_set.headline.font.size}px "
                                f"(Unica One has no glyphs for this script)",
                            ))
                        target = SCRIPT_SIZE_SCALE.get(LANG_SCRIPT.get(lang), 1.0)
                        if type_set.scale < target:
                            findings.append(Finding(
                                "size-boost-reduced", profile, lang, "-", "-",
                                f"{target:.2f}x did not fit the band; using "
                                f"{type_set.scale:.2f}x ({type_set.headline.font.size}px)",
                            ))

                    type_set = typography[lang]
                    text = strings[index]
                    image, metrics = render_panel(
                        base, geo, shot_path, shot_mask, text, type_set.headline,
                        type_set.wrapped[text], type_set.line_height,
                    )

                    if metrics["lines"] > MAX_LINES:
                        findings.append(Finding(
                            "headline-overflow", profile, lang, scheme, slug,
                            f"needs {metrics['lines']} lines (max {MAX_LINES}): {text!r}",
                        ))
                    elif metrics["lines"] == MAX_LINES:
                        findings.append(Finding(
                            "headline-three-lines", profile, lang, scheme, slug,
                            f"3 lines, block fills {metrics['height_ratio']:.0%} of the band: {text!r}",
                        ))
                    if metrics["width_ratio"] > TIGHT_WIDTH_RATIO:
                        findings.append(Finding(
                            "headline-tight-width", profile, lang, scheme, slug,
                            f"longest line fills {metrics['width_ratio']:.0%} of the band width: {text!r}",
                        ))
                    if metrics["ink_escapes_band"]:
                        findings.append(Finding(
                            "headline-ink-outside-band", profile, lang, scheme, slug,
                            f"glyphs run from {metrics['ink_top']:.0f} to {metrics['ink_bottom']:.0f} "
                            f"outside band {geo.band_y}..{geo.band_y + geo.band_height}: {text!r}",
                        ))
                    if metrics["height_ratio"] > TIGHT_HEIGHT_RATIO:
                        findings.append(Finding(
                            "headline-tight-height", profile, lang, scheme, slug,
                            f"text block fills {metrics['height_ratio']:.0%} of the band height: {text!r}",
                        ))
                    if metrics["shaped_run"]:
                        findings.append(Finding(
                            "tracking-skipped", profile, lang, scheme, slug,
                            "complex script drawn as one shaped run; letter-spacing not applied",
                        ))

                    if not dry_run:
                        # Panel order, then the screenshot name without its
                        # library number: store listings display in filename order.
                        out_path = target_dir / f"{index + 1:02d}-{slug.split('-', 1)[1]}.png"
                        image.save(out_path, "PNG", optimize=True)
                    written += 1

                print(f"  {profile}/{lang}/{scheme}: {len(PANELS)} panels", flush=True)

    return {
        "written": written,
        "findings": [f.__dict__ for f in findings],
        "geometry": {
            name: {
                k: v for k, v in geo.__dict__.items() if k != "notes"
            } for name, geo in geometries.items()
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--profiles", nargs="+", default=list(PROFILES), choices=list(PROFILES))
    parser.add_argument("--langs", nargs="+", default=LANGUAGES)
    parser.add_argument("--schemes", nargs="+", default=SCHEMES, choices=SCHEMES)
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT_ROOT)
    parser.add_argument("--report", type=Path, default=None)
    parser.add_argument("--dry-run", action="store_true", help="compute and report without writing PNGs")
    args = parser.parse_args()

    headlines = json.loads(HEADLINES_PATH.read_text(encoding="utf-8"))
    headlines.pop("_comment", None)

    print(
        f"Rendering {len(args.profiles)} profile(s) x {len(args.langs)} language(s) "
        f"x {len(args.schemes)} scheme(s) x {len(PANELS)} panels -> {args.out}"
    )
    result = render(
        args.profiles, args.langs, args.schemes, args.out, headlines, args.dry_run
    )

    report_path = args.report or (args.out / "render-report.json")
    if not args.dry_run:
        report_path.parent.mkdir(parents=True, exist_ok=True)
        report_path.write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"\nFiles {'planned' if args.dry_run else 'written'}: {result['written']}")
    by_kind: dict[str, int] = {}
    for finding in result["findings"]:
        by_kind[finding["kind"]] = by_kind.get(finding["kind"], 0) + 1
    if by_kind:
        print("Findings:")
        for kind, count in sorted(by_kind.items()):
            print(f"  {kind}: {count}")
    else:
        print("Findings: none")
    if not args.dry_run:
        print(f"Report: {report_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
