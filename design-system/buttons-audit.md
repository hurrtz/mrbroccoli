# Button audit — Mr Broccoli Design System

Reviewed every interactive control in `components/`, `ui_kits/` and the intro flow: size, shape, radius, placement, touch target. Grouped by severity. **Status: items 1–4 fixed (2026-08); items 5–6 open.** The rules that came out of this are recorded in `guidelines/foundations.md` → Control shape and size.

## 1. Real defects

**Small buttons break the touch minimum.** `Button` with `size="small"` is `minHeight: 40` — the system's own rule is 44 (`--mb-touch-target`), enforced everywhere else. It is used on the settings route pages (Test / Use / Remove), so the most-tapped controls in settings are the smallest. Fix: 44 with tighter padding, or keep the 40 visual inside a 44 target the way `IconAction` does.

**Two pill heights below 44.** `PremiumBand`'s CTA (36), the settings chips and the Data & privacy Remove pill (34), the intro's language switch (32), the fork tag (32, but correctly wrapped in a 44 target). Only the fork tag handles it properly. Everything else is a sub-target tap.

## 2. Shape vocabulary is not decided

Icon controls currently come in three shapes with no rule separating them:

| Control | Size | Shape |
| --- | --- | --- |
| `IconButton` (headers) | 44 | squircle, radius 12 |
| `OrbSatellite` action | 44 | squircle, radius 12 |
| `OrbSatellite` toggle | 44 | full circle |
| `IconAction` (model lifecycle) | 36 in 44 | squircle, radius 11 |
| Toast dismiss | 44 | full circle + border |
| Drawer "New conversation" | 44 | full circle, no border, drop shadow |
| Composer send | 46 | full circle |
| `ChatTranscript` empty glyph | 46 | full circle (decorative) |

The satellite action/toggle split is deliberate and documented. The rest is drift: the drawer plus is a one-off `<button>` with a shadow nothing else uses, the toast dismiss is a circle where every other dismiss is a squircle `IconButton`, and `IconAction`'s radius 11 is an off-scale value that exists nowhere in the token file.

**Needed:** one written rule — e.g. *circles are voice/primary-action controls (orb, send, plus), squircles are everything else* — and then conform. As it stands, "round" carries no meaning.

## 3. Primary block buttons: four heights, two radii

| Where | Height | Radius |
| --- | --- | --- |
| `Button` (default) | 44 | control (10) |
| Intro "Set up automatically" | 48 | card (12) |
| Intro "Done" | 50 | card (12) |
| `AutoSetupCard` action | 52 | control (10) |

All four are the same species: the full-width commit button. They should be one height and one radius. 48 is the most defensible (comfortable, still not shouty); the radius should be `control`.

## 4. Radii bypass the token scale

`tokens/shape.css` defines ten radii, but components hardcode `99`, `999`, `22`, `23`, `14`, `12`, `11`, `2`. Two consequences: pill shapes have no token at all (`99` appears in 12+ places), and circles are written three ways (`999`, `22`, `23`).

**Needed:** add `--mb-radius-pill: 999px` and use it everywhere a pill or circle is intended; replace remaining literals with the scale.

Also worth revisiting: `--mb-radius-chip` (6px) is used for whole `ChatBubble`s, and `--mb-radius-tag` (8px) is used only by `Modal`'s action row. Two tokens, both misnamed for what they actually do.

## 5. Placement is inconsistent for the same job

Confirm/commit actions sit in three different places: full-width at the bottom (intro Done, AutoSetupCard, conversation settings), right-aligned text buttons in a header-style row (`Modal`'s actions, the only user of `--mb-radius-tag`), and inline in content (`Button` on settings cards). The first is the app's real pattern; `Modal`'s action row is the outlier and reads like a different product.

Icon-button placement is otherwise consistent and good: leading slot = close/back, trailing slot = the screen's one action.

## 6. Two switch implementations, no component

`IntroFlow` has a local `FlowSwitch` (46×28), the settings kit has its own `KitSwitch`, and the system has no `Switch` component at all — so every consumer invents one. It should be promoted to `components/core/Switch.jsx`.

## 7. What is already consistent (keep as anchors)

- 44pt icon-button geometry, and `IconAction`'s pattern of a small visual inside a 44 target.
- Danger ink usage: delete/remove verbs, never a filled red button except `Button type="warning"`.
- Accent-fill = the one primary action per view; ghost/bordered for everything secondary.
- Disabled treatment: 0.38 opacity + `aria-disabled`, now shared by `OrbSatellite`, `LandscapeControl` and `RouteOptionRow`.
- The transport ring's four verbs are one size, one shape, one spacing.

## Work order — status

1. ✓ Sub-44 targets fixed: `Button size="small"`, the PremiumBand CTA, the settings chips, the `Tag` primitive, the Data & privacy Remove pill and the intro language switch are all 44 now.
2. ✓ Rule decided — squircles for every control except the workspace orb and the intro's step-1 play CTA. Conformed: composer send, drawer plus, toast dismiss, satellite toggles, banner play affordance, empty-state glyphs, the intro's step-3 mic and forward action, the image-attachment remove badge and `PhaseAwareVoiceAction`'s disc. The superseded `IntroVoicePicker` (a 52pt round play button) was removed rather than conformed. Decorative circles that are not controls — icon medallions, switch knobs, radio dots, spinners, progress tracks — deliberately stay round.
3. ✓ Commit button unified at 48 × `--mb-radius-control` (`Button`, intro auto-setup, intro Done, `AutoSetupCard`); `Modal`'s footer actions stack full-width instead of right-aligned.
4. ✓ `--mb-radius-pill` added; every hardcoded radius replaced across components and kits — including `IconAction`'s off-scale 11, `AppWordmark` and `IntroStepper`'s 999, and `AnchoredMenu`'s 14. Large controls (the intro's 76pt mic, 58pt forward) take `--mb-radius-icon-button`, not a panel token.
5. ✓ `Switch` promoted to `components/core/Switch.jsx` — a 46×28 track inside a 44 target; the intro’s `FlowSwitch` and the settings kit’s `KitSwitch` now defer to it, and `AntSwitchRow`’s track gained the same target. The transcript drawer’s grab handle went from a 22pt to a 44pt target in the same pass.
6. Open: `--mb-radius-chip` / `--mb-radius-tag` naming.

Follow-up (same session): the sweep initially put three compact buttons — PremiumBand’s Upgrade, the storage Remove/Cancel action and the intro language switch — on `--mb-radius-pill`, contradicting the rule. All now use `--mb-radius-control`; pills are reserved for non-buttons (tags, chips, the fork tag, stepper dots, the wordmark).
