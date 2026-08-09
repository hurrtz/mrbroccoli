# design-sync notes — Mr Broccoli

Repo-specific gotchas for syncing this app's design system to claude.ai/design.
Read this before re-running a sync. The converter's own docs assume a web
design system with a published build; almost everything below exists because
this repo is neither.

## The core problem this setup solves

Mr Broccoli is an **iOS/Android-only Expo app** (`app.json` `platforms:
["ios","android"]`), and claude.ai/design renders **React in a browser**. 85 of
91 `.tsx` files import from `react-native`, which has no browser
implementation. Nothing syncs at all without a React Native → web bridge.

The bridge is deliberately confined to design-sync: **the shipped app bundle,
Metro's module graph, and the release artifacts are untouched.** Only
`react-native-web` was added, as a **devDependency**, pinned to `~0.21.0`
because that is what `node_modules/expo/bundledNativeModules.json` names for
SDK 57 — a different version would fail Expo Doctor and the dependency
alignment step of the release gate.

Verified after the change: `npm run typecheck` and `npm run static:verify` both
exit 0. Knip does not flag `react-native-web` or anything under `.design-sync/`,
and `npm run lint` only covers `app src __tests__ __mocks__ data plugins
scripts`, so the sync files are outside it. **Re-check both after any change
here** — breaking `make pre-push` is the main risk this setup carries.

## Why `.design-sync/` has its own package.json

`PKG_DIR` is the nearest ancestor `package.json` with a name, so this file makes
`.design-sync/` the package root. That is what lets the generated `.d.ts` tree
live in `.design-sync/.cache/types/` instead of at the repository root:
`findTypesRoot` only probes `build/ts`, `dist/types`, `types`, `lib`, `dist`
relative to the package dir, and `projectFor` reads the entry from
`package.json#types`.

Consequence: **every `cfg` path is relative to `.design-sync/`, not the repo
root** — hence `"srcDir": "../src"` and `"../src/..."` throughout
`componentSrcMap`.

`gen-types.mjs` syncs that file's `version` from the app's `package.json` on
every run, because the generated README reports it to the design agent.

## Generated inputs — run these before the converter

```sh
node .design-sync/gen-types.mjs     # .d.ts tree for prop extraction
node .design-sync/gen-tokens.mjs    # tokens.css from src/theme/*
```

Both are cheap and deterministic. `gen-tokens.mjs` needs esbuild from
`.ds-sync/node_modules`, so stage the converter scripts and `npm i` there first.

`tokens.css` is **generated from `src/theme/colors.ts` and `typography.ts`** —
never hand-edit it. Re-run `gen-tokens.mjs` whenever the theme changes, or the
design agent gets a stale palette.

## The three lib forks (`cfg.libOverrides`)

The converter has no config knob for any of these, and the alternatives were
tried and rejected. Each fork is a copy of the bundled lib file with the marked
`FORK:` hunks — diff against `.ds-sync/lib/<name>.mjs` on re-sync and merge
upstream changes.

- **`bundle.mjs`** — two changes:
  - `resolveExtensions` with `.web.*` first. React Native ships one module per
    platform and lets Metro pick (`./findNodeHandle` → `findNodeHandle.web.js`);
    esbuild has no equivalent and loads the native file, which drags in
    react-native's Flow-typed source and fails to parse.
  - `define` for `__DEV__`, `process.env` (incl. `EXPO_OS: "web"`) and `global`.
    Without them the IIFE throws `ReferenceError` on load and assigns nothing to
    `window.MrBroccoli`, so validate reports all 31 components missing.
- **`previews.mjs`** — the same `resolveExtensions`, because the preview compile
  pass builds its own esbuild options rather than sharing `sharedBuildOptions`.
  A `bundle.mjs` fork alone does **not** cover preview compilation.
- **`dts.mjs`** — filters props declared under `node_modules/react-native*` the
  way the bundled copy filters `@types/react`. `interface ButtonProps extends
  PressableProps` is idiomatic RN, but it buries the 6 real props under ~60
  inherited ones (Apple TV parallax, Android ripple), and their types
  (`ViewStyle`, `Insets`, `AccessibilityState`) are not importable in the
  emitted `.d.ts`. `KEEP_PROP` is widened to retain the props that stay
  meaningful: children, style, disabled, onPress, onLongPress, numberOfLines,
  placeholder, value, onChangeText, and the accessibility props.

### Rejected alternatives (do not retry these)

- **tsconfig `paths` aliases for the `.web.js` variants** — the converter's
  paths plugin matches on the specifier alone, and the reached set collides:
  `./findNodeHandle` means one file in react-native-gesture-handler and a
  different one in react-native-reanimated. Importer-relative resolution is
  required.
- **A symlinked `node_modules` overlay** where `X.js` points at `X.web.js` —
  esbuild resolves symlinks to their real path, so only the first hop lands in
  the overlay and every relative import inside a package escapes back to the
  real tree.

## tsconfig.designsync.json

Converter-only; never read by Metro, Expo, or `npm run typecheck`. Contains:

- `react-native` → `.design-sync/shims/react-native.js`, which re-exports
  react-native-web and adds the only two APIs it lacks in this graph:
  `TurboModuleRegistry` and `requireNativeComponent`. Both are reached because
  `LocalModelPerformanceSummary` pulls in the on-device model stack
  (`@dr.pogodin/react-native-fs`, `react-native-sherpa-onnx`). The stubs must
  never throw at import time — those calls run at module scope.
- Stubs for `react-native/Libraries/Utilities/codegenNativeComponent` and
  `react-native/assets-registry`, which react-native-svg and
  react-native-safe-area-context declare but never render on web.

## SVG assets

`src/components/ProviderIcon.tsx` imports the nine brand marks as components
(Metro uses react-native-svg-transformer). esbuild's `.svg` loaders can only
produce a string, so the import arrived as a data URI and React tried to use it
as a tag name (`InvalidCharacterError`). `.design-sync/shims/svg-loader.mjs`
renders them through react-native-svg's `SvgXml` instead, and is imported by
**both** fork files because they build their esbuild options separately.

## Preview authoring conventions

- **Every preview wraps its cells in the app canvas**
  (`backgroundColor: darkColors.background`). Cards render on a white page while
  the provider chain is `mode="dark"`; `Button`'s ghost variant is transparent
  with a subtle border and is effectively invisible without it. Components that
  bring their own surface (ChatBubble, AntSettingsCard) look fine either way —
  which is exactly why a button-only calibration set would have missed this.
- Wrappers are **inlined per preview file**, not shared, because a preview's
  grade hash covers only its own file. A shared helper would let an edit change
  many cards without invalidating their grades.
- `Button` never styles its children — compose `<AntButtonLabel>` or a bare
  `<PhosphorIcon>` inside it.
- `Tag` ships no text styling at all; the caller supplies
  `styles.activeWrap/activeText/normalWrap/normalText`.
- Container components (`AntPickerRows`, `List`) render blank alone — their
  honest preview is the composition.
- PhosphorIcon names are a closed set and do **not** include `gear` or `trash`
  (they are `setting` and `delete`). Check `PHOSPHOR_ICONS` in
  `src/design-system/PhosphorIcon.tsx` before using a name.

## Provider chain

`ThemeProvider mode="dark"` › `LocalizationProvider language="en"` ›
`SafeAreaProvider`. Not optional: `useLocalization()` **throws** outside its
provider (`src/i18n.tsx`), and `Modal` calls `useSafeAreaInsets()`, which throws
too. All three are exported from `entry.tsx` and excluded from the component
index via `componentSrcMap: null`.

## Two bridge defects found by rendering, and their fixes

Both were found only because previews were actually looked at, and both are
**react-native-web translation gaps, not app bugs** — which is why both are
fixed in this directory and not in `src/`.

### 1. `flex: 0` collapses to zero width

React Native's `flex: 0` means *inflexible, sized by content* (Yoga's
`0 0 auto`). react-native-web forwards the raw number as CSS `flex: 0`, which
browsers expand to `0 1 0%` — shrinkable, zero basis. Only `flex: -1` gets
special handling (`createReactDOMStyle.js`).

`cardHeaderExtra: { flex: 0 }` (`src/features/settings/styles.ts`) therefore
collapsed the wrapper around `AntSettingsCard`'s 44×44 header info button to
0px; the button overflowed and was clipped to a sliver by the card's
`overflow: hidden`. It silently damaged eight cells across `AntSettingsCard`,
`AntDisclosureCard`, `AntRadioSection` and `AntPickerSection` — any card with a
`headerExtra`. Two independent agents diagnosed it from different components.

Fixed by a targeted rule emitted from `gen-tokens.mjs` against
react-native-web's own deterministic atomic class for that declaration.
Verified live: wrapper 0px → 44px.

### 2. Animations never progress under the capture clock

`package-capture.mjs` calls Playwright's `page.clock.setFixedTime()`, which
pins `Date.now()` but leaves `requestAnimationFrame` running.
react-native-web's JS `Animated` driver measures progress from `Date.now()`
deltas, so every animation stalls at frame zero permanently. `Toast` mounts at
`opacity: 0` and stayed there — four byte-identical blank PNGs regardless of
props. A plain Playwright probe *without* the frozen clock showed it animating
correctly, which is what isolated the cause.

Note this is NOT the `useNativeDriver: true` red herring: react-native-web does
fall back to the JS driver and logs that it is doing so.

Fixed in `shims/react-native.js` by making `Animated.timing/spring/decay` jump
to their target and fire the completion callback immediately. A static preview
card should show the settled state anyway, and components that gate logic on
the completion callback (the DS `Modal`'s sheet unmount) become deterministic
instead of depending on a frozen clock.

## Known render warns

These are recorded as benign — a warn NOT in this list is new and should be
investigated:

- `[RENDER_THIN] ... rendered height is 0px` on `Modal`, `ConversationDrawer`,
  `ConversationMemoryModal`, `PremiumUpgradeModal`. All four render through a
  react-native `Modal`, which portals to a fixed overlay, so the measured
  height of the mount point collapses. The check cannot see portal content;
  the screenshots are correct. Judge these from the screenshot, never the warn.

`[RENDER_THIN]`/`[RENDER_BLANK]` on any OTHER component means its preview
regressed — those only appeared here while previews were unauthored.

## Component-specific facts worth keeping

- **`Tag` has exactly one real call site** in the whole app
  (`ConnectionsSettingsPage.tsx`). If it is refactored away, `Tag`'s preview
  loses its only ground truth.
- **`Alert.alert`, not `Modal`, is how the app confirms destructive actions.**
  `DialogAction.tone` is only ever `"default"` or `"success"` in real usage —
  there is deliberately no destructive-Modal pattern to preview.
- **`ActivityIndicator` is not exported from the bundle.** Components that need
  it import it internally (so `Button loading` works), but a preview cannot
  render a bare loading affordance; use `PhosphorIcon name="loading"`.
- **`AntSettingsCard.footer` and `Button type="warning"` + `AntButtonLabel`
  have no real call sites.** Those preview cells are deliberate inventions,
  flagged so nobody mistakes them for ported compositions.
- **Overlay text inputs pick up the browser's blue focus ring**, because
  react-native-web's `Modal` focus trap auto-focuses the first focusable child.
  Fix per-preview with `inputStyle={{ outlineStyle: "none" }}`.
- **`PremiumUpgradeModal` renders its store-unavailable state** — the
  `expo-iap` shim resolves `fetchProducts()` to `[]`, so `storeProduct` is null
  and "Buy Premium" is disabled. That is a real reachable device state, not a
  preview defect. Every other visual state of this component is context-driven
  with no prop seam, so one cell is honest coverage.
- **`LocalModelPerformanceSummary` takes all data as props** and only calls
  pure assessment functions — it does NOT need the native on-device stack, so
  its cells compute real output.
- **Some preview copy paraphrases the real i18n strings** (e.g. "Save and send"
  vs `saveAndSend: "Save + send"`; "Upgrade to premium" vs `upgradeToPremium:
  "Unlock Premium"`). Same feature, same voice — not a rubric failure, but
  worth tightening if these files are touched again.
- **Interaction-gated states are a hard ceiling.** `ResponseModeToggle`'s
  overflow sheet and `Picker`'s dropdown open from internal `useState` with no
  prop seam, so only their closed presentation is previewable.

## Re-sync risks

- **Dependency upgrades are the main hazard.** Upgrading react-native,
  react-native-svg, react-native-safe-area-context, react-native-reanimated or
  react-native-gesture-handler can add new platform-variant files or new
  native-only imports. Symptom: esbuild fails parsing a Flow-typed file under
  `node_modules/react-native/`. Fix: find the importer and either rely on
  `resolveExtensions` or add a stub to `tsconfig.designsync.json`.
- **Expo SDK upgrades** change the `react-native-web` version that
  `bundledNativeModules.json` pins. Re-pin the devDependency to match or Expo
  Doctor fails.
- **The three forks drift.** Diff each against its `.ds-sync/lib/` original on
  every re-sync.
- **`.design-sync/node_modules` is a gitignored symlink** to
  `../.ds-sync/node_modules`, needed because the forks import `esbuild` and
  `ts-morph` by bare name. Recreate it on a fresh clone:
  `ln -sfn ../.ds-sync/node_modules .design-sync/node_modules`.
- **`guidelinesGlob` flattens to basenames.** Two files named `SPEC.md` collide
  and one is silently skipped (`! guidelines: SPEC.md would overwrite an earlier
  file with the same dest`). Only one SPEC can ship until they are given
  distinct names.
- **Component groups come from `docsMap` stubs** in `.design-sync/docs/`, not
  from the source tree — `src/components/` is a generic directory name the
  converter refuses to group by. A new component added to `entry.tsx` lands in
  `general` until it gets a stub.
- The `.d.ts` bodies reference RN type names (`ViewStyle`, `StyleProp`) that are
  not imported into the emitted files. Validate accepts this (it parses rather
  than typechecks), but a stricter future check might not.
- **The `flex: 0` fix is pinned to a hashed class name** (`r-flex-1d9yedq`).
  react-native-web derives it from the declaration, so it is stable per version
  but WILL change if react-native-web is upgraded. Symptom: header actions
  clip again. Re-derive by rendering a `flex: 0` wrapper and reading its class.
- **The `Animated` instant-settle patch masks real animation bugs.** Anything
  that only misbehaves mid-animation is invisible to these previews by
  construction. It also means preview cards can never show an in-flight
  transition — that is deliberate, but do not "fix" a missing animation by
  removing the patch without re-reading the frozen-clock note above.
- **The `expo-iap` stub pins the preview to one entitlement state.** If premium
  UI gains more statically-meaningful states, the stub must grow a way to
  select them — there is no prop seam on the components themselves.
- **`readmeHeader` resolves from the config HOME, not the package dir.** Every
  other `cfg` path here is relative to `.design-sync/`, but `readmeHeader` is
  relative to the directory containing it — hence the `.design-sync/` prefix in
  the config value. A bare `conventions.md` silently logs
  `! readmeHeader: ... not found at the config home — skipped` and ships a
  README with no conventions.
- **Changing `cfg.provider` clears every grade**, because the provider chain is
  hashed into each component's grade key. Budget a full re-grade for any
  provider edit; ordinary preview edits only re-key their own component.
- Preview cards are graded against a **dark** canvas because `cfg.provider`
  pins `mode="dark"`. If the app's default ever changes, the previews' inlined
  canvas wrappers all need revisiting.
