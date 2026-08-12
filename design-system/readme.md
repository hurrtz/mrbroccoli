# Mr Broccoli Design System

Mr Broccoli is a voice-first AI chat app for iOS and Android, for people who care more about the quality of an answer than how quickly it arrives. You pick the provider, model and reasoning effort per conversation; answers are spoken back paragraph by paragraph. Provider credentials stay in the device keychain, conversations stay local, speech in and out can run on the device. Nineteen interface languages including right-to-left; version 3.2.0.

One product: the **Mr Broccoli mobile app** (Expo / React Native, iOS and Android from one codebase).

## Where things live

| Path | What it is |
| --- | --- |
| `guidelines/foundations.md` | Color, type, shape, motion, layout, accessibility, iconography |
| `guidelines/content.md` | Voice and copy rules |
| `guidelines/surfaces/` | **The normative spec, one document per screen**: `workspace.md`, `settings.md`, `intro.md`, `on-device.md`, `chat.md` |
| `guidelines/*.card.html` | Foundation specimen cards |
| `styles.css` | The entry point consumers link. Imports only. |
| `tokens/` | `fonts`, `colors`, `typography`, `spacing`, `shape`, `motion`, `base` |
| `components/` | The React primitives, grouped by concern — each with `.jsx`, `.d.ts` (normative props contract) and `.prompt.md` (usage) |
| `templates/` | Starting folders a consuming project copies |
| `ui_kits/mobile-app/` | Click-through recreation of the workspace |
| `ui_kits/settings/` | The eight-page settings modal, premium and free |
| `ui_kits/intro/` | The seven-step introduction walkthrough |
| `assets/` | Fonts (Unica One, Outfit), 47 provider SVGs, app icons |
| `SKILL.md` | Agent-skill entry point |
| `github.md` | Source-repository association |

**Rule: each fact has one home.** Surface docs hold the decisions and screen-level rules; `.d.ts` holds the contract; `.prompt.md` holds per-component usage; kits demonstrate; anything stated twice is a bug.

## Sources

- **Codebase** — `MrBroccoli/`, attached read-only; the authority for every value not explicitly marked as a departure in a surface doc. Also <https://github.com/hurrtz/mrbroccoli> for the voice pipeline, provider manifest, model catalogue and living `SPEC.md`/`DESIGN.md` files.
- **Uploaded assets** — app icons, 47 provider brand SVGs, 19 localised intro recordings.

## Component index

**Core** — `Button`, `IconButton`, `Input`, `TextArea`, `Tag`, `PhosphorIcon`.
**List** — `List`, `ListItem` (with `ListItem.Brief`).
**Overlays** — `Modal`, `Toast`.
**Settings primitives** — `AntSettingsCard`, `AntDisclosureCard`, `AntButtonLabel`, `AntSectionIntro`, `AntRadioSection`, `AntSwitchRow`, `AntNumberInputRow`, `AntTextArea`, `AntPickerRow`, `AntPickerRows`, `AntPickerSection`, `RuntimeReadiness`.
**Workspace** — `AppWordmark`, `RouteByline`, `RoutePicker`, `Composer`, `Picker`, `ResponseModeToggle`, `PhaseAwareVoiceAction`, `IntroBanner`, `PremiumUpgradeModal`, `VoiceOrb`, `OrbSatellite`, `ConversationSettingsSummary`, `WorkspaceStatusLine`, `TranscriptHandle`, `BackgroundTaskBar`.
**Chat** — `ChatBubble`, `ChatTranscript`, `ConversationDrawerItem`, `MessageImageAttachments`, `TurnReceiptCard`, `WebSearchReferences`, `UsageCard`, `UberModeAuditCard`, `ReplyFailureCard`, `PipelineNotices`, `MessageBranchIndicator`, `ConversationMemoryModal`.
**Brand** — `ProviderIcon`.
**Introduction** — `IntroFlow`, `IntroStepper`, `IntroPanel`, `IntroPoint`, `IntroButton`, `IntroTitle`, `IntroBody`, `IntroDivider`, `IntroVoicePicker`.
**On-device** — `LocalModelPerformanceSummary`, `AutoSetupCard`, `AutoSetupPlanRow`, `InstallProgress`.

The inventory comes from the codebase plus the approved additions recorded in the surface docs (`RouteByline`, the orb composition, auto-setup). Which components are additions, which are replacements-on-one-screen, and which upstream pieces are deliberately not packaged is stated per surface in `guidelines/surfaces/`.

## Using this system

Link `styles.css`, load the Phosphor stylesheet (see `guidelines/foundations.md` § Iconography), load `_ds_bundle.js`, then read components off the window namespace. Set `data-theme="dark"` on any ancestor to flip that subtree; components read `--mb-color-*` only, so a theme switch needs no re-render.

```html
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/regular/style.css">
<script src="_ds_bundle.js"></script>
```

## For implementers (React Native)

This system is a web artifact; nothing in it is copied into the app — it is translated (custom properties → `src/theme/`, inline styles → `StyleSheet.create`, div/span → View/Text). The order to read: this file, `guidelines/foundations.md`, `guidelines/content.md`, then the surface doc for the screen at hand, then each component's `.prompt.md` and `.d.ts`. Where the system and the app disagree on a value, the system wins only for the screens its surface docs mark as departures; everywhere else the app wins and the disagreement is a question for the owner. Open decisions are listed in each surface doc under "Open decisions".
