# Localized store screenshots

The store-promo suite captures ten ordered iOS screenshots and eight ordered
Android screenshots for every registered app locale. It is separate from the
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
capturing images.

Like `.dev`, the `.maestro` identity exposes the App Settings control that
simulates Free or Premium access without affecting store purchases. A clean
`.maestro` install defaults to Premium so release automation remains
deterministic. The runner clears state once before a locale, then uses guarded
scene reseeding to preserve that locale across its Premium, Free, and onboarding
captures. It stops the app before every subsequent scene deep link so an open
native Intro modal cannot survive into the next capture.

## Capture one locale

```sh
make store-promos-verify
make store-promos-ios LOCALE=de DISPLAY=6.8
make store-promos-android LOCALE=de DISPLAY=phone
```

The requested `6.8` campaign folder maps to an accepted 6.9-inch iPhone 17 Pro
Max capture. Final German PNGs, their manifest, and the review gallery are
written directly to:

```text
artifacts/store-promos/ios/6.8/de/
artifacts/store-promos/android/phone/de/
```

Use `LOCALE=all` to iterate through every registered locale after its promotional
copy has been reviewed. The iOS runner creates or reuses a dedicated simulator;
the Android runner requires exactly one connected emulator unless `UDID` is
provided. Both build the isolated Release app with Expo dotenv loading disabled,
scan it for configured local secrets, normalize the display, execute the flow,
fully decode every PNG, validate its dimensions and no-alpha contract, and write
SHA-256 values to `screenshots.json`. The schema-2 manifest also records the
hashed app artifact and embedded version, actual device/runtime, source commit,
dirty-source fingerprint, and whether that artifact was freshly built or
reused. A `--skip-build` capture deliberately leaves its artifact/source
association unknown rather than attributing a stale binary to the current
checkout.

## Supported native capture labels

### iOS

- `6.8`: iPhone 17 Pro Max, uploaded to Apple's 6.9-inch class
- `6.5`: iPhone 11 Pro Max
- `6.3`: iPhone 17 Pro
- `6.1`: iPhone 13 Pro
- `5.5`: iPhone 8 Plus; requires a compatible iOS 16 simulator runtime
- `4.7`: iPhone SE (3rd generation)

The app requires iOS 16.4, so 4-inch and 3.5-inch devices cannot produce genuine
native screenshots. Let App Store Connect derive those legacy sizes.

### Android

- `phone`: Pixel 7 profile at 1080 × 2400

Android images use the same localized Premium and Free fixture stories, while
omitting the Uber audit and Speaking screens that are reserved for iOS.

## iOS ten-image order

1. Premium conversation with a stable Thinking CTA
2. Expanded Model Council audit
3. Free conversation at rest with two completed exchanges
4. Free on-device onboarding recommendation
5. Conversation drawer with expanded branches
6. Premium Settings overview
7. Premium Thinking Settings
8. Premium Speaking Settings
9. On-device AI Settings
10. Premium per-conversation Settings drawer

## Android eight-image order

1. Premium conversation with a stable Thinking CTA
2. Free conversation at rest with two completed exchanges
3. Free on-device onboarding recommendation
4. Conversation drawer with expanded branches
5. Premium Settings overview
6. Premium Thinking Settings
7. On-device AI Settings
8. Premium per-conversation Settings drawer

Review every image in `review-gallery.html` before upload. Automation verifies
that each file decodes and has the approved structure, dimensions, and opacity;
it does not replace native-speaker review or a visual verdict for clipping,
bidirectional text, misleading states, or marketing suitability.
