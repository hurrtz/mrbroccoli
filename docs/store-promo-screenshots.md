# Localized store screenshots

The store-promo suite captures ten ordered screenshots for every registered app
locale. It is separate from the broader Maestro release QA gallery.

## Safety boundary

The fixture route writes deterministic sample conversations only when the
installed application identifier ends in `.maestro`. Production, `.dev`, and
other application identities fail closed. The fixture contains no credentials,
provider requests, user data, or downloaded models.

Like `.dev`, the `.maestro` identity exposes the App Settings control that
simulates Free or Premium access without affecting store purchases. A clean
`.maestro` install defaults to Premium so release automation remains
deterministic; the store-promo flow also clears state before every locale.

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
validate the PNG dimensions and alpha-channel contract, and write SHA-256 values
to `screenshots.json`.

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

Android images use the same localized fixture and ten-scene source set. Select
the images required for each Google Play listing from the validated source set.

## Ten-image order

1. Clean Home
2. Empty conversation drawer
3. Active localized conversation
4. Expanded Uber Mode audit
5. Populated conversation drawer
6. Expanded conversation branches
7. Premium Settings overview
8. Thinking and Uber Mode Settings
9. Speaking and voice Settings
10. Data and privacy Settings

Review every image in `review-gallery.html` before upload. Automation verifies
structure and dimensions; it does not replace native-speaker review or a visual
verdict for clipping, bidirectional text, misleading states, or marketing
suitability.
