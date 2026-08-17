#!/usr/bin/env python3
"""Collect the platform UI fonts the gallery renderer falls back to.

Unica One covers Latin and Latin-ext only. Seven of the nineteen store languages
(ru, uk, zh-CN, ja, ar, ur, hi) have no glyphs in it, so their headlines are set
in the platform UI font for that script - a different face per script, and a
different one per store.

Sources are the machine's own iOS simulator runtime and a connected Android
device or emulator, so the faces are the real platform fonts rather than
lookalikes. Copies land in an ignored artifacts directory; nothing is committed.

Usage:
    python3 scripts/store-gallery/sync_fonts.py
    python3 scripts/store-gallery/sync_fonts.py --android-serial emulator-5554
"""

from __future__ import annotations

import argparse
import re
import shutil
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
FONT_ROOT = REPO_ROOT / "artifacts" / "store-gallery" / ".fonts"
SIMULATOR_VOLUMES = Path("/Library/Developer/CoreSimulator/Volumes")

# (destination name, path relative to the runtime root, human label)
IOS_FROM_RUNTIME = [
    ("SFUI.ttf", "System/Library/Fonts/Core/SFUI.ttf", "SF Pro (Cyrillic)"),
    ("HiraginoKakuGothic.ttc", "System/Library/Fonts/Core/HiraginoKakuGothic.ttc", "Hiragino Kaku Gothic (Japanese)"),
    ("SFArabic.ttf", "System/Library/Fonts/Core/SFArabic.ttf", "SF Arabic (Arabic)"),
    ("DecoTypeNastaleeqUrdu.ttc", "System/Library/Fonts/Core/DecoTypeNastaleeqUrdu.ttc", "DecoType Nastaleeq (Urdu)"),
    ("Kohinoor.ttc", "System/Library/Fonts/LanguageSupport/Kohinoor.ttc", "Kohinoor Devanagari (Hindi)"),
]

# PingFang ships as an Apple private collection that FreeType cannot open, so
# Simplified Chinese on iOS uses Hiragino Sans GB - Apple's own Simplified
# Chinese UI face, and the iOS system Chinese font before PingFang.
IOS_FROM_MACOS = [
    ("HiraginoSansGB.ttc", "/System/Library/Fonts/Hiragino Sans GB.ttc", "Hiragino Sans GB (Simplified Chinese)"),
]

ANDROID_FONTS = [
    ("Roboto-Regular.ttf", "Roboto (Cyrillic)"),
    ("NotoSansCJK-Regular.ttc", "Noto Sans CJK (Chinese, Japanese)"),
    ("NotoNaskhArabic-Regular.ttf", "Noto Naskh Arabic (Arabic, Urdu)"),
    ("NotoSansDevanagari-VF.ttf", "Noto Sans Devanagari (Hindi)"),
]


def newest_ios_runtime_root() -> Path | None:
    """Highest-versioned installed iOS simulator runtime root."""
    candidates: list[tuple[tuple[int, ...], Path]] = []
    if not SIMULATOR_VOLUMES.is_dir():
        return None
    for volume in SIMULATOR_VOLUMES.iterdir():
        runtimes = volume / "Library/Developer/CoreSimulator/Profiles/Runtimes"
        if not runtimes.is_dir():
            continue
        for runtime in runtimes.glob("iOS *.simruntime"):
            match = re.search(r"iOS (\d+(?:\.\d+)*)", runtime.name)
            if not match:
                continue
            version = tuple(int(part) for part in match.group(1).split("."))
            root = runtime / "Contents/Resources/RuntimeRoot"
            if root.is_dir():
                candidates.append((version, root))
    if not candidates:
        return None
    return max(candidates)[1]


def android_serial(explicit: str | None) -> str | None:
    if explicit:
        return explicit
    try:
        output = subprocess.run(
            ["adb", "devices"], capture_output=True, text=True, check=True, timeout=20
        ).stdout
    except (FileNotFoundError, subprocess.SubprocessError):
        return None
    serials = [
        line.split()[0]
        for line in output.splitlines()[1:]
        if line.strip() and line.split()[-1] == "device"
    ]
    if len(serials) != 1:
        return serials[0] if serials else None
    return serials[0]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--android-serial", default=None)
    args = parser.parse_args()

    missing: list[str] = []

    ios_dir = FONT_ROOT / "ios"
    ios_dir.mkdir(parents=True, exist_ok=True)
    runtime_root = newest_ios_runtime_root()
    if runtime_root is None:
        missing.append("no iOS simulator runtime found; install one via Xcode")
    else:
        print(f"iOS runtime: {runtime_root.parents[2].name}")
        for name, relative, label in IOS_FROM_RUNTIME:
            source = runtime_root / relative
            if source.exists():
                shutil.copyfile(source, ios_dir / name)
                print(f"  ok   {name:28} {label}")
            else:
                missing.append(f"iOS {name} ({label}) not at {source}")
                print(f"  MISS {name:28} {label}")

    for name, source_path, label in IOS_FROM_MACOS:
        source = Path(source_path)
        if source.exists():
            shutil.copyfile(source, ios_dir / name)
            print(f"  ok   {name:28} {label}")
        else:
            missing.append(f"iOS {name} ({label}) not at {source}")
            print(f"  MISS {name:28} {label}")

    android_dir = FONT_ROOT / "android"
    android_dir.mkdir(parents=True, exist_ok=True)
    serial = android_serial(args.android_serial)
    if serial is None:
        missing.append("no Android device or emulator connected; start one and re-run")
        print("Android: no device connected")
    else:
        print(f"Android device: {serial}")
        for name, label in ANDROID_FONTS:
            result = subprocess.run(
                ["adb", "-s", serial, "pull", f"/system/fonts/{name}", str(android_dir / name)],
                capture_output=True, text=True, timeout=120,
            )
            if result.returncode == 0 and (android_dir / name).exists():
                print(f"  ok   {name:28} {label}")
            else:
                missing.append(f"Android {name} ({label}): {result.stderr.strip()}")
                print(f"  MISS {name:28} {label}")

    print(f"\nFonts in {FONT_ROOT}")
    if missing:
        print("\nUnresolved:")
        for item in missing:
            print(f"  - {item}")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
