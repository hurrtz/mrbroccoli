# Localized store screenshots

The store-promo suite can capture seven ordered screenshots in light or dark
schemes on iOS and Android for every registered app locale. It is separate from
the broader Maestro release QA gallery. The 4.1.0 campaign is deliberately
light-only; dark output remains available for a later campaign without being
exported or uploaded now.

## Safety boundary

The fixture route writes deterministic sample conversations and presentation
state only when the installed application identifier is exactly
`com.tobiaswinkler.app.mrbroccoli.maestro` on iOS or
`com.tobiaswinkler.app.android.mrbroccoli.maestro` on Android. Production,
`.dev`, and every other application identity fail closed. The fixture contains
no real credentials, provider requests, user data, or downloaded models.
All assistant replies and the idle voice phase are fixed. The single
`conversation` scene seeds the requested locale, provider routes, fourteen
conversations, and presentation state without a provider call. Ten sessions
appear across Pinned and Earlier, including two forks and one locked row; four
more remain in the collapsed Archived group. Three nonsecret placeholder
values in the isolated Maestro SecureStore plus matching successful
fixture-only capability results make the pictured OpenAI, Anthropic, and Gemini
connections visibly working and their Council members available; all other
fixture keys are cleared. It never reads user credentials, downloads a model,
benchmarks hardware, invokes a store, or contacts a provider.

## Capture one locale

```sh
make store-promos-verify
make store-promos-ios LOCALE=de DISPLAY=6.9
make store-promos-android LOCALE=de DISPLAY=phone
```

The requested `6.9` campaign folder maps to the 6.9-inch iPhone 17 Pro Max.
Final German PNGs, their manifest, and the review gallery are
written directly to:

```text
artifacts/store-promos/ios/6.9/light/de/
artifacts/store-promos/ios/6.9/dark/de/
artifacts/store-promos/android/phone/light/de/
artifacts/store-promos/android/phone/dark/de/
```

Use `LOCALE=all` to iterate through every registered locale after its promotional
copy has been reviewed. The iOS runner creates or reuses a dedicated simulator;
the Android runner requires exactly one connected emulator unless `UDID` is
provided. Both build the isolated Release app with Expo dotenv loading disabled,
scan it for configured local secrets, normalize the display, execute the flow,
fully decode every PNG, validate its dimensions and no-alpha contract, and write
SHA-256 values to `screenshots.json`. The schema-3 manifest also records the
explicit color scheme, hashed app artifact and embedded version, actual
device/runtime, source commit, dirty-source fingerprint, and whether that
artifact was freshly built or reused. A `--skip-build` capture deliberately leaves its artifact/source
association unknown rather than attributing a stale binary to the current
checkout.

## Supported native capture labels

### iOS

- `6.9`: iPhone 17 Pro Max
- `6.5`: iPhone 11 Pro Max
- `6.3`: iPhone 17 Pro
- `6.1`: iPhone 13 Pro
- `5.5`: iPhone 8 Plus; requires a compatible iOS 16 simulator runtime
- `4.7`: iPhone SE (3rd generation)
- `ipad`: iPad Pro 13-inch (M5), regular-width adaptive layout

The app requires iOS 16.4, so 4-inch and 3.5-inch devices cannot produce genuine
native screenshots. Let App Store Connect derive those legacy sizes.

Both commands capture `light` and `dark` by default. Pass
`--color-scheme light` or `--color-scheme dark` directly to the npm runner when
only one review set is needed.

### Android

- `phone`: Pixel 7 profile at 1080 × 2400
- `tablet`: 10-inch profile at 1600 × 2560 and 320 dpi

Android images use the same localized BYOK fixture story and the same
conversation, transcript, branch, and Settings coverage as iOS.
On regular-width iPad, the final frame opens per-conversation Settings through
the persistent workspace's compact sliders control rather than the phone-only
header row. Its conversations frame selects the visible fixture fork so the
persistent sidebar tells the same organization story without duplicating the
idle-home image.

## Seven-image order on both stores

1. Home workspace in its idle voice phase
2. Transcript overview with the latest response collapsed
3. Conversations with two pinned, eight earlier, two forks, one locked, and four archived
4. Settings / Connections
5. Settings / Thinking
6. Council builder open on the home workspace
7. Per-conversation Settings drawer

Review every image in `review-gallery.html` before upload. Automation verifies
that each file decodes and has the approved structure, dimensions, and opacity,
and rejects exact duplicate frames within a locale set; it does not replace
native-speaker review or a visual verdict for clipping, bidirectional text,
misleading states, or marketing suitability.

## Finished gallery panels

The captures above are raw screens. `scripts/store-gallery/` turns all seven
into the panels that are actually uploaded: a flat `#44A055` rectangle
at the profile's store dimensions, a headline, and the screenshot inside a dark
device frame. The layout, the seven-panel story order, and the six deliberate
exclusions are specified in
`design-system/templates/app-store-gallery/COWORK-BRIEF.md`; the approved visual
reference is `AppStoreGallery.dc.html` beside it. All geometry scales from the
306 × 665 reference panel by `s = targetWidth / 306`, and screenshots keep their
native aspect ratio.

```sh
python3 scripts/store-gallery/sync_fonts.py
python3 scripts/store-gallery/render_store_gallery.py --profiles ios-6.9 --langs en --schemes light
python3 scripts/store-gallery/render_store_gallery.py    # every profile, language and scheme
```

Output is one folder per store listing, so uploads are drag-and-drop, plus a
`render-report.json` recording geometry and every finding:

```text
artifacts/store-gallery/<profile>/<lang>/<scheme>/01..07-<slug>.png
```

Rendering replaces existing PNGs in each selected output folder before it
writes the current seven-panel story, preventing obsolete campaign filenames
from entering the generated Fastlane tree.

**Decision:** Python and Pillow rather than a Node renderer. Nothing in
`node_modules` can composite images, and adding `sharp` or `playwright` would
churn the Knip and license gates for a tool that never ships. Pillow is built
with RAQM, so Arabic, Urdu and Devanagari shape correctly.

**Fonts.** Unica One covers Latin and Latin-ext only. Headlines in Russian,
Ukrainian, Simplified Chinese, Japanese, Arabic, Urdu and Hindi are set in the
platform UI font for that script - a different face per script, and a different
one per store. `sync_fonts.py` copies them from the installed iOS simulator
runtime and pulls the Android faces off a connected device with `adb`, into an
ignored `artifacts/store-gallery/.fonts/`; no font binary is committed.

**Dependency:** an installed iOS simulator runtime and a connected Android
device or emulator. Without them `sync_fonts.py` reports what is missing and the
renderer refuses the affected languages rather than drawing empty boxes.

**Assumption:** PingFang SC cannot be read outside CoreText, so Simplified
Chinese on iOS uses Hiragino Sans GB - Apple's own Simplified Chinese UI face,
and the iOS system Chinese font before PingFang. Revisit if a readable PingFang
becomes available.

**Decision:** line-height 1.3 is tuned for Latin, so leading opens per language
to clear the tallest line that language actually sets; type size is unchanged.
Urdu is the single exception on size: Nastaliq fits much smaller letterforms in
the same em, so it is set larger by a factor that steps down until the whole
language still fits its band.

## Uploading a listing

Both stores are driven over their APIs rather than through the web consoles.
This is not only faster: App Store Connect's bulk uploader drops roughly one
image in five and returns each batch in a random order, so a hand upload of
nineteen localizations means re-finding dropped files and reordering seven
screenshots per locale, per device.

```sh
npm run listing:verify     # character limits and forbidden claims
npm run listing:export     # build the fastlane tree from docs/ and the gallery
bundle exec fastlane android metadata validate:true   # Google checks, discards
bundle exec fastlane android metadata
bundle exec fastlane ios metadata                     # targets app.json version, previews, asks
```

There is no dry run for the App Store side. `deliver`'s `verify_only` validates
a _binary_, not a listing, and fails in `verify_binary` when no IPA is present.
The real check is deliver's own HTML preview, which it writes and asks about
unless `force:true` is passed. Only Play has a true server-side validation.
The iOS lane creates or updates the version declared in `app.json`; pass
`version:x.y.z` only for an intentional override. It does not attach a build or
submit the version for review.

Snapshotting a live listing before overwriting it is a command rather than a
lane, because `download_metadata` is a deliver subcommand and `supply` has no
download at all — neither fits the lane DSL:

```sh
bundle exec fastlane deliver download_metadata --metadata_path fastlane/.backup/apple
bundle exec fastlane supply init --json_key "$SUPPLY_JSON_KEY" \
  --package_name com.tobiaswinkler.app.android.mrbroccoli --metadata_path fastlane/.backup/play
```

Point both at `.backup/`, never at the default path: downloading over the
exported tree replaces the copy you are about to publish with the copy you are
about to replace.

`scripts/store-gallery/export_fastlane.py` assembles `fastlane/` from sources
that are already reviewed: the two listing translation documents, the newest
`google-play-release-notes-<version>.md`, and the rendered gallery. Nothing is
authored in `fastlane/`; it is generated output and gitignored apart from
`Fastfile`, `Appfile` and `Gemfile`.

**Decision:** only the sizes a store cannot derive are exported — iPhone 6.9"
and 13" iPad for Apple, phone for Play. Apple generates every other iPhone size
from the 6.9" set, so exporting 6.1", 6.3", 6.5" or 4.7" would upload hundreds
of files to reproduce what App Store Connect produces for free, and each one
would then need regenerating whenever copy changes. Change `APPLE_PROFILES` or
`PLAY_PROFILES` in the exporter if a store's behaviour changes.

**A missing metadata file is skipped, not cleared.** `deliver` does
`next unless File.exist?(path)`, so a gap leaves the live value alone — which
makes an omission silent rather than destructive, and therefore easy to ship.
Release notes are where that bites: App Store Connect requires "What's New" for
every localization on the listing and blocks submission per locale without it.
The exporter validates every managed field for every locale first and writes
nothing at all if anything is missing.

The App Store listing carries localizations this repository writes no
description for — `en-AU`, `en-CA`, `en-GB`, `es-MX`, `fr-CA`. They still need
release notes, so the exporter maps the Play tags in
`google-play-release-notes-<version>.md` onto App Store codes and writes
`release_notes.txt` for all 24. Those five folders contain only that file, which
is safe precisely because deliver skips what is absent.

**Dependency:** credentials, in `fastlane/.env`. Copy `fastlane/.env.example`,
fill it in, and confirm with `bundle exec fastlane doctor`, which resolves both
credentials and counts the exported tree without contacting either store. The
file is gitignored; both secrets it points at live outside the repository.

**Decision:** these do not go in the repository-root `.env`. That file is the
pre-release provider contract, and `scripts/verify-prerelease-env.mjs` requires
every key in it to hold a value in `.env.local` — so putting store credentials
there would make `make prerelease-preflight` demand an App Store key before a
provider matrix run. The two credential sets are unrelated and stay apart.

Apple and Google use different locale codes for the same language, so each
listing document carries its own store's tag in the heading. A tag is a
folder name for the exporter, not a code path: correcting one is an edit to the
markdown. Marking a heading tag `not supported` excludes that language from the
Apple export and reports it, for a language one store carries and the other
does not.

The Android `release` lane uploads a binary and is deliberately separate from
the metadata lanes, so correcting a typo in listing copy can never submit a
build. It takes the artifact `make release-aab` already produced and verified;
it does not build anything itself, and rolls out at 10% by default.

**Decision: no Play lane has a default track.** `supply`'s own default is
`production`, which is wrong for an app in closed testing and wrong by omission
rather than by choice. Both Play lanes therefore require `track:<name>`
explicitly for anything track-scoped, and refuse `production` unless
`allow_production:true` is also passed.

Listing text and images belong to the app rather than to a track, so
`android metadata` needs no track and cannot write to one. Changelogs are the
exception — they are per-track, so they upload only when a track is named:

```sh
bundle exec fastlane android metadata                    # listing only
bundle exec fastlane android metadata track:alpha        # listing + changelogs
bundle exec fastlane android release aab:<path> track:alpha
```

Uploading changelogs without a binary needs a version code, because there is no
AAB for `supply` to infer one from. The lane reads `versionCode` from
`android/app/build.gradle` — the same number `export_fastlane.py` names the
changelog files after, so the two cannot drift — and `version_code:<n>`
overrides it. A changelog updates the release notes of a release that already
exists on that track; it does not create one. If the upload reports an unknown
version code, check which build is actually live on the track rather than
changing the number here:

```sh
bundle exec fastlane android tracks              # every track, its releases and codes
```

`tracks` enumerates rather than probing known names, because a closed track
created in the console is identified by its display name rather than by
`alpha`. This app's is `Mr Broccoli - Test #1`; `alpha` is a separate, stale
track holding an old build. The name contains a `#`, which starts a comment in
an unquoted shell command, so `track:closed` is an alias for it.

Add `validate:true` to have Google check an upload and discard it.

Listing text and screenshots do not depend on any of this. Uploading them
without a track always works, and release notes can wait for the build they
describe.

Still done by hand in the consoles: Apple's App Privacy questionnaire, Play's
Data Safety form, content rating, pricing, and the first release of the app on
either store.

## Reference

Panel dimensions in `PROFILES` are the store-required export sizes and must stay
aligned with `acceptedPortraitDimensions` in `scripts/store-promo-config.mjs`.
Android phone panels are `1080 × 2160`, not the `1080 × 2400` capture shape:
Google Play caps the long side at twice the short side, and 2.22:1 would be
rejected. Confirm both stores' current specifications before a batch; they
change.
