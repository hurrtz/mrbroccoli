# Mr Broccoli — settings UI kit

The settings modal in the restructured design: seven pages, same structure in both editions, stage pages deciding and resource pages managing. The spec lives in `guidelines/surfaces/settings.md`; this kit demonstrates it.

| File | What it is |
| --- | --- |
| `index.html` | Click-through modal: overview → pages, premium and free frames |
| `all-pages.card.html` | Every page laid out statically, both overviews and both editions of Speaking/Connections |
| `SettingsFrame.jsx` | Modal chrome (68pt header, back/close) + `SectionPage`/`HelperText` legacy helpers |
| `SettingsOverview.jsx` | Live-state rows, readiness dots, premium band |
| `PagesConversation.jsx` | Connections, Thinking (+ slot sheet), Search |
| `PagesVoice.jsx` | Listening, Speaking (+ voice sheet), the shared `modelAction` map, `KitSwitch` |
| `PagesPrivacy.jsx` | Data & privacy (incl. model storage), App & diagnostics (incl. automatic setup) |
| `data.js` | Fixture: live-state rows, connected providers, slots, model catalogue with every lifecycle state |

What's interactive: page navigation, the Thinking slot sheet, the Speaking voice sheet, switches. Swipe-to-remove and downloads are shown as states, not simulated.
