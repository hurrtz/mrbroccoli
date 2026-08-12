# Surface: settings

The normative description of the settings modal. The living demo is `ui_kits/settings/` — a straight recreation of `src/features/settings/` with one reinstatement (runtime readiness) and one replacement (the readiness treatment itself).

## Structure

Eight drill-in pages behind one overview: Connections, Thinking, Listening, Speaking, Search, On-device AI, Data & privacy, App & diagnostics.

## Geometry (from the source)

- Header 68pt minimum, 18pt sides, 14pt bottom padding, children bottom-aligned
- Back control only when drilled in; close control always present
- Content column capped at 760pt and centred, 16pt sides, 18pt top
- Page stacks 16pt apart, section-grouped pages 24pt apart, cards 10pt apart
- Section icon 34pt wide with a 15pt trailing margin
- Group titles: body-medium 12/16, 0.8pt tracking, uppercase, 4pt inset
- Capability and status chips: 25pt tall, 3pt radius, half-pixel border
- Status chip tones follow `getStatusMeta` in `ProviderConnectionPanel.tsx`: invalid, testing, working, not tested, not set up

## The two editions

`PREMIUM_SETTINGS_PAGES` gates five of the eight pages: connections, thinking, listening, speaking, search. The free edition sees three rows, and the whole "Conversation & tools" group disappears because every page in it is premium. On-device AI is the one row tinted with `accent-soft` and an accent glyph — on a free install it is the only route that works. Paid capability has one colour everywhere: the upgrade card, the premium card, `IntroButton tone="premium"` and `IntroPoint tone="premium"` all carry the gold `--mb-color-premium` family.

## Runtime readiness (`RuntimeReadiness`)

The four capabilities — think, listen, speak, search — on one line above the first card, each a dot plus its label, each a 44pt target opening the setting behind it.

- **It replaces the chain of circles connected by hairlines, deliberately.** The chain reads as a progress stepper, which promises a sequence, and these are four independent capabilities. Nothing is step 1 of 4.
- Six treatments were explored; inline dots won, then gained per-route tap behaviour: the dot and label sit unchanged inside the 44pt target, so the visual weight stays that of a plain line.
- It sits on the neutral settings background, **not** on the Premium card. The Premium card is dismissible; readiness is not — binding one to the other would take the diagnostic away with the congratulation.
- The four states are `ready`, `attention`, `broken`, `off` (all 19 translations exist upstream in `settings-core/readiness.ts`; reuse those keys). The source assigns no colours; this system maps ready → success, attention → premium gold, broken → danger, off → a hollow ring in `border-strong`. **Known weak point:** gold doing double duty as "paid" and "needs attention" — worth a dedicated warning token; owner decision.
- Upstream, no screen currently mounts the readiness grid; `styles.ts` and `readiness.ts` define it fully. This system reinstates it.

## On-device AI page

Carries `AutoSetupCard` at the top — see `guidelines/surfaces/on-device.md`.
