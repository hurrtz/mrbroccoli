# Surface: automatic on-device setup

The normative description of the auto-setup flow. Components: `components/on-device/`. It appears in two places — step `auto` of the introduction and the top of App & diagnostics settings — and it is the same card in both, so a user who starts it in one place recognises it in the other.

## The pieces

| Component | What it is |
| --- | --- |
| `AutoSetupCard` | The whole flow in one card: offer, measuring, proposal, installing, done, failed |
| `AutoSetupPlanRow` | One chosen model, with the job it was chosen for reading before its name |
| `InstallProgress` | Step *n* of *m*, time left, percentage, linear bar |
| `BackgroundTaskBar` | The install seen from the home screen: one row under the top bar |

## The state machine

Six states, in this order: `offer` → `scanning` → `proposal` → `installing` → `done` | `failed`.

- **Never install without the proposal step.** The app has just told the user it can decide for them; spending 1.7 GB of their storage before they have seen the list is the one thing that would make that untrustworthy. The proposal names one model to think with, one to hear the user and one to speak back, each with its evidence-first verdict, plus the total size and a time estimate.
- **The measuring pause is deliberate.** The real check is near-instant. Hold `scanning` at roughly 2.5 seconds and reveal the device readings one at a time — a verdict that lands before the user has finished reading the offer reads as a canned answer, not a measurement. Every fact shown must be a real reading; if one cannot be measured, drop the line rather than writing a plausible number.
- **A failure leaves what finished in place.** `failed` marks the model that stopped, shows the ones before it as installed and the ones after as waiting. Retry resumes the queue; it must never re-download a model that already completed.

## The job lives above every screen that shows it

The card appears in two places and the home-screen row is a third view of the same job, so the state cannot live in any of them. It belongs wherever the host keeps work that outlives a screen; the host exposes `state`, `fraction` and `scanned` and passes them down. The card runs itself when no `state` is passed — that mode is for specimens, not for the app.

## Announcing the outcome

Where the outcome is announced depends on where the user is. In the introduction or on the App & diagnostics page, the card states it in full and there is **no toast**. Anywhere else, a `Toast` — success, or danger with a retry action. **Never both**: two announcements of one event read as two events.

## `BackgroundTaskBar`

No dismiss control, on purpose — the work continues either way; removing the row would only cost the user the route back to it. It always leads to the page that owns the job. Portrait: directly under the top bar. Landscape: the left pane, above the route byline.

## Strings

Every string is a locale key in all nineteen files, including the step labels (`Preparing`, `Downloading <model>`, `Verifying`) and the two time formats (`about 3 min left`, `about 40 s left`). Time readings are formatted, not concatenated — an RTL locale must be able to reorder them.

## Evidence before verdict

On-device summaries read "Measured · Viable", never "Viable" alone — how the app knows comes first. `LocalModelPerformanceSummary` is the pattern; the proposal rows follow it.

## Open decisions (owner)

- What the recommendation does on a phone that can only run one or two of the three jobs: a proposal with a gap, a refusal, or a proposal that routes the third job to the system voice or recogniser.
- Whether an install that fails on a metered connection retries automatically when Wi-Fi returns, or waits for the user.
