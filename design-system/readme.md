# Mr Broccoli Design System

Mr Broccoli is a voice-first AI chat app for iOS and Android, for people who
care more about the quality of an answer than how quickly it arrives. Instead
of trading depth for instant replies, it lets you pick the provider, model and
reasoning effort per conversation, and speaks answers back paragraph by
paragraph.

You bring your own provider credentials. They stay in the device keychain and
conversations stay local. Speech recognition and text-to-speech can run on the
device or through a provider you choose. The app ships in 19 interface
languages, including right-to-left, and is currently at version 3.2.0.

## Products in this system

There is one product: the **Mr Broccoli mobile app** (Expo / React Native,
iOS and Android from one codebase). There is no marketing site, no web app and
no docs site in the sources provided, so this system contains one UI kit.

## Sources

- **Codebase** — `MrBroccoli/`, attached read-only. The authority for every
  value in this system: `src/theme/colors.ts`, `src/theme/typography.ts`,
  `src/design-system/**`, `src/features/settings/**`, `src/screens/main/**`,
  `src/components/**`, `src/i18n/locales/en.ts`, `DESIGN.md`.
- **GitHub** — <https://github.com/hurrtz/mrbroccoli>. Explore it for anything
  this system abbreviates: the voice pipeline, provider manifest, on-device
  model catalogue and the living `SPEC.md` / `DESIGN.md` files under each
  directory are far richer than any summary here.
- **Uploaded assets** — app icons, the 47 provider brand SVGs, and the 19
  localised intro recordings (`intro-<lang>.m4a`, not copied in; they are audio,
  not design assets).
- **Prior export** — `MrBroccoli/ds-bundle/`, an earlier react-native-web
  bundle of the same library. Used to confirm the component inventory and to
  recover the shipped webfont binaries.

## Index

| Path | What it is |
| --- | --- |
| `styles.css` | The entry point consumers link. Imports only. |
| `tokens/` | `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `shape.css`, `motion.css`, `base.css` |
| `components/` | The React primitives, grouped by concern |
| `templates/` | Starting folders a consuming project copies: `voice-workspace/`, `settings-page/` |
| `ui_kits/mobile-app/` | Click-through recreation of the workspace, light and dark |
| `ui_kits/settings/` | The eight-page settings modal, premium and free editions |
| `explorations/` | Eight documents recording how the design arrived where it did |
| `guidelines/` | Foundation specimen cards |
| `assets/fonts/` | Unica One and Outfit (400/500/600/700) |
| `assets/providers/` | 47 official provider brand SVGs |
| `assets/appIcon/` | iOS and Android app icons |
| `SKILL.md` | Agent-skill entry point |
| `github.md` | Source-repository association |

### Components

**Core** — `Button`, `IconButton`, `Input`, `TextArea`, `Tag`, `PhosphorIcon`.

**List** — `List`, `ListItem` (with `ListItem.Brief`).

**Overlays** — `Modal`, `Toast`.

**Settings primitives** — `AntSettingsCard`, `AntDisclosureCard`,
`AntButtonLabel`, `AntSectionIntro`, `AntRadioSection`, `AntSwitchRow`,
`AntNumberInputRow`, `AntTextArea`, `AntPickerRow`, `AntPickerRows`,
`AntPickerSection`, `RuntimeReadiness`.

**Workspace** — `AppWordmark`, `RouteByline`, `Picker`, `ResponseModeToggle`,
`PhaseAwareVoiceAction`, `IntroBanner`, `PremiumUpgradeModal`, `VoiceOrb`,
`OrbSatellite`, `ConversationSettingsSummary`, `WorkspaceStatusLine`,
`TranscriptHandle`, `BackgroundTaskBar`.

**Chat** — `ChatBubble`, `ChatTranscript`, `ConversationDrawerItem`,
`MessageImageAttachments`.

**Brand** — `ProviderIcon`.

**Introduction** — `IntroFlow`, `IntroStepper`, `IntroPanel`, `IntroPoint`,
`IntroButton`, `IntroTitle`, `IntroBody`, `IntroDivider`, `IntroVoicePicker`.
`IntroBanner` sits in Workspace, since it lives on the home screen. Its dismiss
control is withheld until the user has opened the intro at least once: on a
first launch the banner is the only route into the walkthrough, so a close
button beside an unread offer invites the user to remove it unseen. In
landscape the banner collapses to a single 48pt row with the title centred.

**On-device** — `LocalModelPerformanceSummary`, `AutoSetupCard`,
`AutoSetupPlanRow`, `InstallProgress`.

Automatic setup is one card in two places. `AutoSetupCard` measures the phone,
proposes one model to think with, one to hear the user and one to speak back,
then installs them; it appears as step three of the introduction and at the top
of On-device AI settings, and it is the same card in both so a user who starts
it in one place recognises it in the other. It runs itself when no `state` is
passed, or takes state and progress from a host that has to keep the install
running after its screen is gone. `BackgroundTaskBar` is that install seen from
the home screen: one row under the top bar, no dismiss control, leading to the
page that owns the job. A finished or failed install is announced by `Toast`
only when the user is neither in the introduction nor on the On-device AI page —
in those two places the outcome is already stated in full.

The inventory comes from the codebase: `src/design-system/`,
`src/features/settings/settings-primitives/`, and the top level of
`src/components/`. Nothing was added that the app does not define.

**Intentional additions** — `RouteByline`. The app's own switcher
(`ResponseModeToggle`) renders four different layouts for one to four-plus
models; the byline is a single treatment that holds at every count and cannot
be mistaken for the voice stage beneath it. `ResponseModeToggle` is kept
unchanged alongside it. `PhaseAwareVoiceAction` lives in `src/screens/main/`
rather than `src/design-system/` upstream, but it is the app's signature
control and is included here unchanged in name and geometry.

Five further additions come from a design exploration run in this project and
approved by the product owner, not from the shipped app: `VoiceOrb`,
`OrbSatellite`, `ConversationSettingsSummary`, `WorkspaceStatusLine` and
`TranscriptHandle`. Together they replace the docked voice bar with a central
orb, move the per-question controls under it, state the conversation's settings
as a sentence instead of a strip of chips, and demote the transcript to a
drawer that peeks above the bottom edge. The mobile UI kit is built on them.
`PhaseAwareVoiceAction` remains in the system unchanged — it is still the right
control anywhere the voice action has to sit in a bar rather than own the
screen.

**Not built** — `ConversationMemoryModal` and the chat sub-cards
(`TurnReceiptCard`, `WebSearchReferences`, `UsageCard`, `UberModeAuditCard`,
`ReplyFailureCard`, `PipelineNotices`, `MessageBranchIndicator`) exist upstream
inside `ChatBubble`'s content tree. `ChatBubble` accepts them through
`children`; they are not separately packaged here.

### Templates

Two starting folders a consuming project can copy. Each is a Design Component
that loads this system through a sibling `ds-base.js`, so the whole thing is
one file and one line to repoint.

| Folder | What it opens on |
| --- | --- |
| `templates/voice-workspace/` | The home screen: route byline, settings sentence, orb, satellites, transcript handle |
| `templates/settings-page/` | A settings page: runtime readiness, then grouping cards of rows |

### Explorations

Eight documents under `explorations/`, tagged so they appear in the Design
System tab. They record the reasoning behind the design, not the design itself.

| File | What it settles |
| --- | --- |
| `calm-workspace.html` | Three whole-screen compositions; the central orb chosen |
| `calm-orb.html` | Settings as a sentence, the satellite row, the two pager pages |
| `orb-in-use.html` | A conversation in progress, the transcript handle, landscape |
| `orb-phases.html` | Which glyph and colour each phase of a turn carries |
| `phase-palettes.html` | Three ramps for the voice pipeline; bookends chosen |
| `runtime-readiness.html` | Six treatments for the four capabilities; inline dots chosen |
| `composer-dock.html` | Superseded — how text input reaches the home screen |
| `model-switcher.html` | Superseded — route cards versus the one-line byline |

---

## Content fundamentals

**Plain and declarative.** Sentence case, full stops, no exclamation marks, no
marketing language. The app states what a thing does and stops.

- "Provider keys, validation, and capabilities."
- "Input mode and speech-to-text routing."
- "Recognition runs on the device unless a provider is chosen."

**Settings summaries are noun phrases**, not sentences with verbs, and they end
in a full stop: "Home cards, models, effort, and system prompt." A summary that
starts "You can…" is wrong.

**Person.** The app addresses the user as *you* only where an action is being
described ("Choose a language to improve recognition"). It never says *we*, and
it never speaks as a character — despite the name, there is no broccoli persona
in the copy.

**Titles are two or three words.** "Guided setup". "Runtime readiness". "Model
Council". "Response style". Nouns, not questions.

**Numbers and units are exact.** "Up to 12 model calls per message with the
current setup." "Version 3.2.0." "14.2 tok/s". The app never rounds a measured
value into a vague adjective.

**Warnings state the cost, then let the user continue.** "More than 4 models or
3 rounds can take a long time, consume many tokens, and hit provider context or
rate limits. This is a warning only." No scare styling, no blocking.

**Evidence before verdict.** On-device summaries read "Measured · Viable", never
"Viable" alone — how the app knows comes first.

**Spoken replies are a separate register.** Text-to-speech output never uses
markdown, bullets or headings. It is written to be read aloud: full sentences,
paragraph breaks that make sense as pauses.

**No emoji.** Not in the UI, not in copy, not in release notes. Unicode is used
only as punctuation: the middle dot `·` as a separator ("09.08.26 · 14:12",
"Heart · American female") and the en dash in ranges ("0.42–0.58 RTF").

**Nineteen languages.** English strings are the shortest of the set. Never build
a layout that depends on an English string's length, and never truncate a label
to make a row fit; the rows grow instead.

---

## Visual foundations

### Two equal appearances

Light and dark are equal citizens, chosen by the user, defaulting to the OS.
Neither is "the" design. Read `--mb-color-*` and let the active theme resolve
it; the explicit `--mb-light-*` / `--mb-dark-*` ladders exist only for
specimens that must show both at once.

Light is a warm off-white canvas `#FCFBF8` — never pure white. Dark is a warm
near-black `#16181D` — never true black. In dark, surfaces step **up** in
lightness (`#1D2025` → `#262B33`) because a shadow on a near-black canvas is
invisible. In light, the white card is already a step up from the warm
background. Both appearances lean on hairline borders far more than on
elevation.

### One accent

Green — `#44A055` in light, `#5DC17D` in dark — marks the active route, the
primary action and confirmation. It is an accent, not a fill. **If a screen
looks green, something is wrong.** Secondary text is a muted blue-grey
(`#5D6B7A` / `#8B97A8`). Red appears only for destruction and errors.

Two deliberate exceptions:

1. **The voice pipeline.** Each phase owns a colour — recording, transcribing,
   thinking briefly, searching, thinking, synthesizing, speaking — so progress
   is legible without reading anything. The phase colour fills the voice bar
   whole; the icon well takes whichever of near-black or white measures higher
   contrast against it. The ramp is a palindrome: green at both ends, because
   green means *you* — you are talking, then you are being talked to. Between
   them the machine travels one way through teal, blue and indigo to violet at
   the deepest thinking, then returns through teal as speech is prepared. The
   sequence is authored twice rather than brightened for dark: denser and
   darker on the warm off-white, lighter and more luminous on the warm
   near-black.
2. **The intro banner.** Violet `#5B21B6`, fixed in both appearances, because
   on a first launch it must not read as part of the furniture. It is the only
   surface in the product that does not follow the theme.

### Type

Unica One carries headlines: `screenTitle` 26/32 at −0.25 tracking (the
wordmark), `sectionTitle` 18/24 at −0.1. Outfit carries everything else at
400/500/600/700. Monospace is reserved for control labels and metadata —
uppercase, letter-spaced 0.75, 11px — and for timestamps and token counts.

Choose a role by meaning first, then add layout. The roles are `screenTitle`,
`sectionTitle`, `subsectionTitle`, `body`, `supporting`, `caption`,
`controlLabel`, `controlValue`, `action`, `compactAction`, `metadata`, and each
already carries family, size, line-height, weight and tracking.

Two special faces never stack. Where the wordmark sits directly above a card
title, that title drops to Outfit.

### Shape

Modest, never pill-shaped and never sharp. Messages 6, tags 8, controls and
rows 10, cards and icon buttons 12, panels 14, dialogs 16, the voice stage 17,
picker modals 18, sheets 20 on the top corners only, the style sheet 24. The
few genuinely round shapes are round because the shape *is* the control: the
42pt phase-icon well, the 34pt caret well in `Picker`, the 22pt readiness
circles.

Pills (999) appear only on three small badges — the compact wordmark, the live
pill and the "free edition" badge. They are not a general control shape.

### Borders, elevation and shadow

Hairline borders do the separating. `--mb-color-border` is the default;
`--mb-color-border-strong` marks a selected or emphasised edge. Shadows are a
whisper and never the thing that separates a surface: dialogs `0 8 24` at 8–24%
of a near-transparent glow, sheets the same cast upward, toasts `0 18 18`.
Cards on a page carry **no** shadow at all.

The message rail is the one structural border: a 3pt edge on the outer side of
each message row — accent on the user's right, strong border on the
assistant's left. There are no chat bubbles.

### Backgrounds

Flat colour. No gradients, no imagery, no patterns, no textures, no blur, no
translucency except the modal overlay (`rgba(13,15,18,0.46)` light,
`rgba(0,0,0,0.72)` dark) and the recording fill. The only image in the whole
product is the app icon, and it never appears inside the app.

### Motion

Short, functional, cancellable, and skipped entirely under reduce motion.
Sheets rise and fall symmetrically over 220ms on a cubic ease. Toasts fade and
drop 20px over 200ms. The voice bar cross-fades its phase colour over 280ms.
Progress arcs and recording fills run linear against a real deadline, never
decoratively. Nothing bounces, nothing springs, nothing loops.

### Press, hover and disabled

There is no hover — this is a touch product. Press dims: 0.72 on buttons and
rows, 0.68 with a 0.985 scale on settings controls, 0.58 with 0.94 on small
icon actions. Icon buttons swap to `surface-alt` while pressed. Disabled is
0.5, or 0.45 for icon-only controls. Selected state is never colour alone: a
fill *and* a border, or a glyph change.

### Layout

16pt gutters in portrait, 12pt in landscape. Content caps at 760pt and centres.
The drawer caps at 520pt, dialogs at 560pt. The top bar is 62pt with the
wordmark absolutely centred and the two icon buttons pinned to the edges, so a
long localised title never pushes them around.

The workspace is one column: top bar, model cards, transcript (which takes all
remaining height), then the voice bar pinned above the safe area. In landscape
it becomes two panes with a hairline divider.

### Accessibility

Every interactive target is at least 44×44pt, including icon-only buttons; a
smaller glyph sits inside that target. Icons never define the touch target.
Every state must be distinguishable without colour. Modals isolate screen-reader
focus, keep backdrop dismiss layers out of the accessibility tree, and keep a
labelled close action. Footer actions never leave the screen — the dialog body
shrinks and scrolls first.

---

## Iconography

**Phosphor, regular weight, semantic names, semantic sizes.** The app imports
`phosphor-react-native` behind a single boundary
(`src/design-system/PhosphorIcon.tsx`) that maps ~60 semantic names —
`mic`, `sound`, `robot`, `global`, `key`, `branch`, `radio-selected` — onto
Phosphor glyphs. Raw numeric sizes and direct imports from another icon family
are not supported. Sizes are `inline` 14, `compact` 16, `control` 20,
`navigation` 24, `prominent` 28, `feature` 32, `hero` 40.

On the web this system loads the same family from the official CDN:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/regular/style.css">
```

Same icons, same weight — not a substitution.

**For implementers: vendor this stylesheet before shipping.** Every card, kit and
specimen in this system loads Phosphor from `cdn.jsdelivr.net`, which is fine for
mocks but wrong for a product that claims to work offline and keeps everything
on the device. Install `@phosphor-icons/web`, copy `src/regular/style.css` and
the font binaries it references into `assets/phosphor/`, and change the one
`<link>` above. The app itself is unaffected — it uses
`phosphor-react-native`, which is already bundled.

**Provider brand marks are the one exception.** 47 official SVGs ship in
`assets/providers/`, and `ProviderIcon` masks them to the surface foreground so
they inherit the theme. Eleven ids are routed today (OpenAI, Anthropic, Gemini /
Vertex, Mistral, DeepSeek, xAI, OpenRouter, ElevenLabs, Alibaba Qwen); the rest
are shipped for future routes. A provider with no mark falls back to two
letters — never a drawn substitute.

**No emoji, ever.** Unicode is used only as punctuation (`·`, `–`, `×`).
Illustration does not exist in the product apart from the app icon.

---

## Fonts

Unica One 400 and Outfit 400/500/600/700 are the real shipping binaries,
recovered from `MrBroccoli/ds-bundle/fonts/` and copied to `assets/fonts/`.
Nothing was substituted. Monospace resolves to Menlo on iOS and the platform
monospace elsewhere; on the web it falls back through the system mono stack.

## Using this system

Link `styles.css`, load the Phosphor stylesheet, load `_ds_bundle.js`, then read
components off the window namespace. Set `data-theme="dark"` on any ancestor to
flip that subtree to the dark appearance; leave it off for light. Components
read `--mb-color-*` only, so a theme switch needs no re-render and no provider.

```html
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/regular/style.css">
<script src="_ds_bundle.js"></script>
```
