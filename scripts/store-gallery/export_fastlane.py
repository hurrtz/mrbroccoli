#!/usr/bin/env python3
"""Build the fastlane metadata and screenshot tree for both stores.

App Store Connect's bulk uploader drops images and randomises their order, and
every listing field is a separate paste. This turns the reviewed sources in the
repository into the layout `fastlane deliver` and `fastlane supply` upload over
the stores' APIs instead: deterministic order, nothing dropped, nothing to
reorder by hand.

Sources, all already reviewed and verified elsewhere:
  docs/app-store-listing-translations.md    Apple fields per locale
  docs/google-play-listing-translations.md  Play fields per locale
  docs/google-play-release-notes-<v>.md     changelogs per locale
  artifacts/store-gallery/<profile>/...     rendered gallery panels

`deliver` skips a field whose file is absent rather than clearing it, so a gap
is silent rather than destructive - which is worse for release notes, because
App Store Connect then blocks submission with "This field is required" per
locale. This refuses to write a partial tree at all: every managed field must be
present for every locale, or nothing is written.

Usage:
    python3 scripts/store-gallery/export_fastlane.py
    python3 scripts/store-gallery/export_fastlane.py --scheme dark --out fastlane
"""

from __future__ import annotations

import argparse
import re
import shutil
import sys
from dataclasses import dataclass, field as dc_field
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
GALLERY_ROOT = REPO_ROOT / "artifacts" / "store-gallery"
DOCS = REPO_ROOT / "docs"
APPLE_DOC = DOCS / "app-store-listing-translations.md"
PLAY_DOC = DOCS / "google-play-listing-translations.md"

APP_NAME = "Mr Broccoli"

# Apple derives every other iPhone size from 6.9", so only the sizes the stores
# genuinely need are exported. Extra device folders are not free: deliver will
# happily push whatever it finds.
APPLE_PROFILES = {"ios-6.9": "iphone69", "ios-ipad": "ipad130"}
PLAY_PROFILES = {"android-phone": "phoneScreenshots"}

# Field name in the markdown -> file name fastlane reads.
APPLE_FIELDS = {
    "Subtitle": "subtitle.txt",
    "Promotional text": "promotional_text.txt",
    "Keywords": "keywords.txt",
    "Description": "description.txt",
}
PLAY_FIELDS = {
    "Short description": "short_description.txt",
    "Full description": "full_description.txt",
}

# App Store Connect requires "What's New" for every localization on the listing,
# including ones this repository writes no description for. The release-notes
# file already covers them, so map its Play tags onto App Store codes.
RELEASE_NOTE_LOCALES = {
    "en-US": "en-US", "en-AU": "en-AU", "en-CA": "en-CA", "en-GB": "en-GB",
    "de-DE": "de-DE", "fr-FR": "fr-FR", "fr-CA": "fr-CA",
    "es-ES": "es-ES", "es-US": "es-MX",
    "it-IT": "it", "pt-PT": "pt-PT", "pt-BR": "pt-BR",
    "sv-SE": "sv", "pl-PL": "pl", "cs-CZ": "cs", "hu-HU": "hu", "tr-TR": "tr",
    "ru-RU": "ru", "uk": "uk", "hi-IN": "hi", "ja-JP": "ja",
    "zh-CN": "zh-Hans", "ar": "ar-SA", "ur": "ur-PK",
}
APPLE_RELEASE_NOTES_LIMIT = 4000

LOCALE_HEADING = re.compile(r"^## (.+?) \(`([^`]+)`\)$")
FIELD_HEADING = re.compile(r"^### (.+)$")
RELEASE_NOTE = re.compile(r"<([A-Za-z]{2,3}(?:-[A-Za-z]{2,4})?)>\s*\n([\s\S]*?)\n</\1>")
UNSUPPORTED = "not supported"


@dataclass
class Locale:
    name: str
    tag: str
    fields: dict[str, str] = dc_field(default_factory=dict)


def parse_listing(path: Path) -> list[Locale]:
    """Read the fenced values out of a listing translations document."""
    locales: list[Locale] = []
    current: Locale | None = None
    field_name: str | None = None
    in_fence = False
    buffer: list[str] = []

    for line in path.read_text(encoding="utf-8").split("\n"):
        if line.startswith("```"):
            if in_fence:
                in_fence = False
                if current and field_name:
                    current.fields[field_name] = "\n".join(buffer).strip()
                field_name, buffer = None, []
            elif field_name:
                in_fence, buffer = True, []
            continue
        if in_fence:
            buffer.append(line)
            continue
        heading = LOCALE_HEADING.match(line)
        if heading:
            current = Locale(name=heading.group(1), tag=heading.group(2))
            locales.append(current)
            field_name = None
            continue
        field = FIELD_HEADING.match(line)
        if field and current:
            field_name = field.group(1)
    return locales


def parse_release_notes(path: Path) -> dict[str, str]:
    text = path.read_text(encoding="utf-8")
    return {m.group(1): m.group(2).strip() for m in RELEASE_NOTE.finditer(text)}


def newest_release_notes() -> Path | None:
    candidates = sorted(
        DOCS.glob("google-play-release-notes-*.md"),
        key=lambda p: [
            int(part) for part in re.search(r"(\d+\.\d+\.\d+)", p.name).group(1).split(".")
        ],
    )
    return candidates[-1] if candidates else None


def panel_files(profile: str, lang_dir: str, scheme: str) -> list[Path]:
    source = GALLERY_ROOT / profile / lang_dir / scheme
    return sorted(source.glob("0*.png")) if source.is_dir() else []


def clear_generated_tree(out: Path) -> None:
    """Remove only the generated Fastlane trees before replacing the export."""
    for name in ("metadata", "screenshots"):
        target = out / name
        if target.is_symlink() or target.is_file():
            target.unlink()
        elif target.is_dir():
            shutil.rmtree(target)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, default=REPO_ROOT / "fastlane")
    parser.add_argument("--scheme", default="light", choices=["light", "dark"])
    parser.add_argument("--release-notes", type=Path, default=None)
    parser.add_argument("--version-code", default=None,
                        help="Play changelog file name; read from build.gradle when omitted")
    args = parser.parse_args()

    apple_locales = parse_listing(APPLE_DOC)
    play_locales = parse_listing(PLAY_DOC)
    if not apple_locales or not play_locales:
        sys.exit("Could not parse the listing documents; run npm run listing:verify first.")

    # The gallery is keyed by the app's language directories, in the order both
    # documents list them, so position maps a store tag back to a folder.
    lang_dirs = sorted(
        p.name for p in (GALLERY_ROOT / "ios-6.9").iterdir() if p.is_dir()
    ) if (GALLERY_ROOT / "ios-6.9").is_dir() else []
    if len(lang_dirs) != len(play_locales):
        sys.exit(
            f"Gallery has {len(lang_dirs)} language folders but the listings have "
            f"{len(play_locales)}; render the gallery before exporting."
        )
    by_name = {loc.name: loc for loc in play_locales}
    order = [loc.name for loc in play_locales]
    apple_by_name = {loc.name: loc for loc in apple_locales}
    if order != [loc.name for loc in apple_locales]:
        sys.exit("The two listing documents disagree on language order.")

    # Language folder for each listing entry, matched through the app's own codes.
    NAME_TO_DIR = {
        "English": "en", "German": "de", "Ukrainian": "uk", "Hindi": "hi",
        "Spanish": "es", "French": "fr", "Italian": "it", "Portuguese": "pt",
        "Brazilian Portuguese": "pt-BR", "Russian": "ru",
        "Simplified Chinese": "zh-CN", "Arabic": "ar", "Japanese": "ja",
        "Hungarian": "hu", "Czech": "cs", "Polish": "pl", "Turkish": "tr",
        "Swedish": "sv", "Urdu": "ur",
    }
    missing_dirs = [n for n in order if NAME_TO_DIR.get(n) not in lang_dirs]
    if missing_dirs:
        sys.exit(f"No gallery folder for: {', '.join(missing_dirs)}")

    problems: list[str] = []
    planned: list[tuple[Path, str | Path]] = []  # (destination, text or source file)

    # --- App Store ----------------------------------------------------------
    apple_skipped: list[str] = []
    for name in order:
        loc = apple_by_name[name]
        if loc.tag == UNSUPPORTED:
            apple_skipped.append(name)
            continue
        base = args.out / "metadata" / loc.tag
        for heading, filename in APPLE_FIELDS.items():
            value = loc.fields.get(heading, "").strip()
            if not value:
                problems.append(f"App Store {loc.tag} is missing {heading!r}")
                continue
            planned.append((base / filename, value))
        planned.append((base / "name.txt", APP_NAME))

        shots = args.out / "screenshots" / loc.tag
        for profile, device in APPLE_PROFILES.items():
            files = panel_files(profile, NAME_TO_DIR[name], args.scheme)
            if len(files) != 7:
                problems.append(
                    f"App Store {loc.tag} {profile}: found {len(files)} panels, expected 7"
                )
                continue
            for index, source in enumerate(files, start=1):
                planned.append((shots / f"{device}_{index:02d}_{source.stem}.png", source))

    # --- App Store release notes -------------------------------------------
    notes_path = args.release_notes or newest_release_notes()
    notes = parse_release_notes(notes_path) if notes_path else {}
    if not notes:
        problems.append("no release notes found; App Store submission needs What's New per locale")
    for play_tag, apple_tag in RELEASE_NOTE_LOCALES.items():
        text = notes.get(play_tag, "").strip()
        if not text:
            problems.append(f"App Store {apple_tag} has no release note ({play_tag} in {notes_path.name})")
            continue
        if len(text) > APPLE_RELEASE_NOTES_LIMIT:
            problems.append(f"App Store {apple_tag} release note is {len(text)} characters")
            continue
        planned.append((args.out / "metadata" / apple_tag / "release_notes.txt", text))

    # --- Google Play --------------------------------------------------------
    version_code = args.version_code
    if version_code is None:
        gradle = (REPO_ROOT / "android/app/build.gradle").read_text(encoding="utf-8")
        found = re.search(r"versionCode\s+(\d+)", gradle)
        version_code = found.group(1) if found else None

    for name in order:
        loc = by_name[name]
        base = args.out / "metadata" / "android" / loc.tag
        for heading, filename in PLAY_FIELDS.items():
            value = loc.fields.get(heading, "").strip()
            if not value:
                problems.append(f"Play {loc.tag} is missing {heading!r}")
                continue
            planned.append((base / filename, value))
        planned.append((base / "title.txt", APP_NAME))

        if version_code and loc.tag in notes:
            planned.append((base / "changelogs" / f"{version_code}.txt", notes[loc.tag]))

        for profile, slot in PLAY_PROFILES.items():
            files = panel_files(profile, NAME_TO_DIR[name], args.scheme)
            if len(files) != 7:
                problems.append(
                    f"Play {loc.tag} {profile}: found {len(files)} panels, expected 7"
                )
                continue
            for index, source in enumerate(files, start=1):
                planned.append((base / "images" / slot / f"{index:02d}_{source.stem}.png", source))

    if problems:
        print("Refusing to write a partial tree — deliver can clear a live field "
              "whose file is missing:", file=sys.stderr)
        for problem in problems:
            print(f"  - {problem}", file=sys.stderr)
        return 1

    # Everything below these two roots is generated. Replace it only after the
    # complete export has validated so retired campaign screenshots, locales,
    # and version-code changelogs cannot survive beside the current listing.
    clear_generated_tree(args.out)

    for destination, payload in planned:
        destination.parent.mkdir(parents=True, exist_ok=True)
        if isinstance(payload, Path):
            shutil.copyfile(payload, destination)
        else:
            destination.write_text(payload + "\n", encoding="utf-8")

    images = sum(1 for _, payload in planned if isinstance(payload, Path))
    texts = len(planned) - images
    print(f"Wrote {texts} metadata files and {images} screenshots to {args.out}")
    print(f"  App Store: {len(order) - len(apple_skipped)} locales, "
          f"{', '.join(APPLE_PROFILES.values())}")
    print(f"  Play:      {len(order)} locales, {', '.join(PLAY_PROFILES.values())}"
          f"{f', changelogs for versionCode {version_code}' if version_code else ''}")
    if apple_skipped:
        print(f"  Skipped for App Store (no Apple localization): {', '.join(apple_skipped)}")
    missing_notes = [by_name[n].tag for n in order if by_name[n].tag not in notes]
    if missing_notes and version_code:
        print(f"  No release note for: {', '.join(missing_notes)} — those locales keep "
              "their previous changelog")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
