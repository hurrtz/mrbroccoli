# Mr Broccoli — settings UI kit

The settings modal, recreated from `src/features/settings/`. Eight drill-in
pages behind one overview, all reachable in `index.html`.

Unlike the workspace kit, this one is a **straight recreation** — every label,
group, icon and geometry comes from the source. There are no departures.

## Files

| File | What it is |
| --- | --- |
| `index.html` | Two frames: premium in light, free edition in dark |
| `data.js` | Section table, providers, models, activity log |
| `SettingsFrame.jsx` | Modal chrome, header, scroll body, and shared page parts |
| `SettingsOverview.jsx` | Grouped section list, edition cards, version line |
| `PagesConversation.jsx` | Connections, Thinking, Search |
| `PagesVoice.jsx` | Listening, Speaking, On-device AI |
| `PagesPrivacy.jsx` | Data & privacy, App & diagnostics |

## The two editions

`PREMIUM_SETTINGS_PAGES` in `settings-core/types.ts` gates five of the eight
pages: connections, thinking, listening, speaking and search. The free edition
therefore sees three rows, not eight, and the whole "Conversation & tools" group
disappears because every page in it is premium. On-device AI is the one row that
gets tinted with `accentSoft` and an accent glyph, because on a free install it
is the only route that works.

Both states are on screen in `index.html` so the difference is visible rather
than described. The free edition's upgrade card and the premium card both carry
the gold `--mb-color-premium` family, the same colour `IntroButton tone="premium"`
and `IntroPoint tone="premium"` use — paid capability has one colour everywhere.

## The readiness chain

The four-step readiness grid — **Think, Listen, Speak, Search** — lives in its
own card, not on the Premium card. The Premium card is dismissible; readiness is
not, so binding one to the other would have taken the diagnostic away with the
congratulation. Geometry is the `readinessGrid` block in
`features/settings/styles.ts` — 22pt circle, 2pt border, 2pt line, 6pt gap,
bodyMedium 12/16 centred. The four states are `settings-core/readiness.ts`:
`ready`, `attention`, `broken`, `off`.

Two notes for the implementer:

- **No screen in the source currently mounts this.** `styles.ts` defines the grid
  and `readiness.ts` defines the model and all 19 translations, but no `.tsx`
  references either. The kit reinstates it on the premium card.
- **The source assigns no colours to the four states.** These map onto existing
  semantics: ready → success, attention → premium gold, broken → danger, off →
  a hollow ring in `borderStrong`. Gold doing double duty as both "paid" and
  "needs attention" is the weak point — worth a dedicated warning token.

## Geometry taken from the source

- Header 68pt minimum, 18pt sides, 14pt bottom padding, children bottom-aligned
- Back control only when drilled in; close control always present
- Content column capped at 760pt and centred, 16pt sides, 18pt top
- Page stacks 16pt apart, section-grouped pages 24pt apart, cards 10pt apart
- Section icon 34pt wide with a 15pt trailing margin
- Group titles: body-medium 12/16, 0.8pt tracking, uppercase, 4pt inset
- Capability and status chips: 25pt tall, 3pt radius, half-pixel border

Status chip tones are `getStatusMeta` in `ProviderConnectionPanel.tsx` — invalid,
testing, working, not tested, not set up.

## What is abbreviated

Real pages carry more rows than are useful in a recreation. Where the source
repeats a pattern, this kit shows enough of it to establish the pattern:

- Four providers stand in for the full connected set
- Three local models stand in for the catalogue
- The picker modals, info modals, backup passphrase dialogs and the guided-setup
  flow are not built; their entry points are
- `AntListenLanguageSelector` and the Kokoro voice sections are represented by a
  single picker row rather than the full per-language matrix
