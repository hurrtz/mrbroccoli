# Surface: settings

The normative description of the settings modal. Living demo: `ui_kits/settings/`; primitives: `components/settings-primitives/` (`SettingsGroup`, `SettingsRow`, `RouteOptionRow`, `IconAction`, `RuntimeReadiness`).

## The charter

Two page species, one mental model:

- **Stage pages decide.** Thinking, Listening, Speaking and Search each answer one question — *who does this job?* — with a **unified route picker** spanning all three runtimes in one radio group: System (device-native, where it exists), on this device (local models), via provider (BYOK). No stage page has a sibling elsewhere that can disagree with it.
- **Resource pages manage.** Connections manages provider keys (health chips: Working / Not tested / Failing / No key; keys stay in the keychain). Model storage is freed under Data & privacy. **There is no Device page** — the upstream On-device AI page is retired; its parts moved into the stage pages (model rows), the introduction walkthrough (the "Test this device" probe), Listening (conversation languages), and Data & privacy (storage).
- **Editions change contents, never structure.** Both editions see the same seven pages in the same order. Free renders provider routes as `locked` ghost rows — quietly, with no upsell band or sheet: a locked row and the editions row in App & diagnostics are the whole story; system and on-device routes work fully. Premium unlocks sections in place — the map the user learned stays valid.

## The model lifecycle

On-device models live where they are used, with one **state-driven action** (`IconAction`) at the row edge: Download → Cancel (while downloading) → **Test, drawn as the egg** — it cracks when a model fails — → Update when one exists. Acquisition is a step inside the decision: picking an uninstalled model downloads it first; provider routes appear only for providers already connected under Connections. **A route's radio unlocks only after the model has tested viable on this phone**; below-target models stay visible but unselectable. **Removal is a swipe**, the same gesture as sessions and transcript messages — never a button. Testing states: not installed · downloading (% + cancel) · installed-untested · testing (spinner) · viable · below target · update ready.

## Page inventory

Three groups: Conversation (Connections, Thinking, Search), Voice (Listening, Speaking), Privacy & app (Data & privacy, App & diagnostics).

- **Overview** — the equal-height rows report **live state** ("Kokoro · Heart · as it arrives"), not page descriptions; readiness dots (`RuntimeReadiness`) above; the editions row; version footer.
- **Thinking** — answering models are **numbered coexisting slots** (not radios; the home byline switches between them), each opening a slot sheet: provider ›, model ›, the model's own effort ladder as chips, remove. "Add a model" as an accent row (max four). Model Council and system prompt as quiet groups.
- **Listening** — Input group (input mode, **two entries**: push-to-talk and tap-to-talk — the hands-free loop is not a mode but the **Hands free switch** on the workspace's composing row, which wraps whichever mode is chosen (see `workspace.md` → Hands free); **Languages** — the app's `localLanguages`, which recognition follows and which gate on-device offerings, downloading matching packs on add) + the "Who listens" picker.
- **Speaking** — Playback group (start speaking; speaking instructions) + "Who speaks" picker; a selected voice-capable route carries a "Voice › " value row opening the **searchable voice sheet** (dozens of voices; radio + accent/gender + play-to-test per row). "Spoken replies" has no off switch — speech always has a working route (deliberate cut of the upstream toggle). Replay-cache clearing under Storage.
- **Search** — "Who searches" picker including the honest "Nobody" route + quality rows.
- **Data & privacy** — conversation knowledge (private conversations always excluded), archive, encrypted backup, and **Storage** (the janitor list: name · capability · size, Remove/Cancel only — choice lives in the stage pages).
- **App & diagnostics** — **Introduction** (the way back into the walkthrough), appearance, the usage-stats toggle, the editions row, and diagnostics (speech diagnostics, debug log button, runtime overrides). No setup job lives here: models are downloaded in the stage page that uses them.

## Form rules

Inset-rows language: `SettingsGroup` (uppercase caption, bordered card, helper prose **only** in footers) of 52pt `SettingsRow`s — icon, label, current value, then chevron, control, or nothing. Options with more than three choices open a sheet. One card depth — never a card inside a card. The premium gold treatment (gradient badge and button, sweeping sheen) is the product's one deliberately fancy surface; every instance opens the same upgrade sheet and never disparages the free tier.

## Deliberate cuts

Everything settings-shaped is built from `SettingsGroup` / `SettingsRow` / `RouteOptionRow` / `IconAction` / `Switch`. The upstream `OnDeviceSettingsPage`, `ConversationBranchRail`-style disclosure catalogues, and the "Spoken replies" switch are not packaged, on purpose. What this layout replaced is recorded in `guidelines/past-decisions.md`.
