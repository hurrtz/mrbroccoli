# Localized store screenshots

The store-promo suite captures thirteen ordered screenshots in both light and
dark schemes on iOS and Android for every registered app locale. It is separate from the
broader Maestro release QA gallery.

## Safety boundary

The fixture route writes deterministic sample conversations and presentation
state only when the installed application identifier is exactly
`com.tobiaswinkler.app.mrbroccoli.maestro`. Production, `.dev`, and every other
application identity fail closed. The fixture contains no credentials,
provider requests, user data, or downloaded models.
All assistant replies, the non-idle CTA phase, and the Free/on-device device
recommendation are fixed. The onboarding scene seeds a first-run Free state in
the requested locale and selects its proposal from a checked-in device snapshot
through the production profile selector. Its actions are no-ops; automatic
setup, provider voice directories, and Intro's live catalogue readers are
suspended before scene hydration and throughout capture, so no hardware or
filesystem scan, download, benchmark, model, or provider call runs while
capturing images. A separate offline-ready onboarding scene uses the same fixed
profile to unlock the final live-test screen without recording or making a
request.

Like `.dev`, the `.maestro` identity exposes the App Settings control that
simulates Free or Premium access without affecting store purchases. A clean
`.maestro` install defaults to Premium so release automation remains
deterministic. Its simulated Free purchase sheet uses the documented EUR 14.99
baseline price and never contacts either platform store. The runner clears
state once before a locale, then uses guarded
scene reseeding to preserve that locale across its Premium, Free, and onboarding
captures. It stops the app before every subsequent scene deep link so an open
native Intro modal cannot survive into the next capture.

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

Android images use the same localized Premium and Free fixture stories and the
same transcript-drawer and Speaking coverage as iOS.

## iOS thirteen-image order

1. Premium conversation with a stable Thinking CTA
2. Latest transcript drawer with the complete localized exchange
3. Free conversation at rest with two completed exchanges
4. Premium purchase sheet with the deterministic baseline price
5. First-run welcome
6. Free on-device onboarding recommendation
7. First-run live-test screen with the offline route ready
8. Conversation drawer with its branch hierarchy
9. Premium Settings overview or iPad master-detail start page
10. Premium Thinking Settings
11. Premium Speaking Settings
12. On-device AI Settings
13. Premium per-conversation Settings drawer

## Android thirteen-image order

1. Premium conversation with a stable Thinking CTA
2. Latest transcript drawer with the complete localized exchange
3. Free conversation at rest with two completed exchanges
4. Premium purchase sheet with the deterministic baseline price
5. First-run welcome
6. Free on-device onboarding recommendation
7. First-run live-test screen with the offline route ready
8. Conversation drawer with its branch hierarchy
9. Premium Settings overview
10. Premium Thinking Settings
11. Premium Speaking Settings
12. On-device AI Settings
13. Premium per-conversation Settings drawer

Review every image in `review-gallery.html` before upload. Automation verifies
that each file decodes and has the approved structure, dimensions, and opacity,
and rejects exact duplicate frames within a locale set; it does not replace
native-speaker review or a visual verdict for clipping, bidirectional text,
misleading states, or marketing suitability.
