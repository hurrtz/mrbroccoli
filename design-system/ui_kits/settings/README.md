# Mr Broccoli — settings UI kit

The settings modal, recreated from `src/features/settings/`. Eight drill-in pages behind one overview, all reachable in `index.html`. The screen is specified in `guidelines/surfaces/settings.md` — geometry, editions, and the runtime-readiness reinstatement all live there. This README covers only what is specific to the recreation.

A straight recreation: every label, group, icon and geometry comes from the source, except the readiness treatment, which follows the surface doc.

## Files

| File | What it is |
| --- | --- |
| `index.html` | Two frames: premium in light, free edition in dark |
| `data.js` | Section table, providers, models, activity log |
| `SettingsFrame.jsx` | Modal chrome, header, scroll body, shared page parts |
| `SettingsOverview.jsx` | Grouped section list, edition cards, version line |
| `PagesConversation.jsx` | Connections, Thinking, Search |
| `PagesVoice.jsx` | Listening, Speaking, On-device AI |
| `PagesPrivacy.jsx` | Data & privacy, App & diagnostics |

Both editions are on screen in `index.html` so the difference is visible rather than described.

## What is abbreviated

Real pages carry more rows than a recreation needs. Where the source repeats a pattern, the kit shows enough to establish it:

- Four providers stand in for the full connected set
- Three local models stand in for the catalogue
- The picker modals, info modals, backup passphrase dialogs and the guided-setup flow are not built; their entry points are
- `AntListenLanguageSelector` and the Kokoro voice sections are a single picker row rather than the full per-language matrix
