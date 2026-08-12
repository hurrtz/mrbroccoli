# Surface: the introduction

The normative description of the first-launch walkthrough. Living demo: `ui_kits/intro/`. Components: `components/intro/`.

## Steps

Seven, in order: welcome, what setup actually requires, **automatic on-device setup (`auto`)**, the one requirement (`llm`), speech in, speech out, Premium — `INTRO_STEPS = ["welcome", "requirements", "auto", "llm", "stt", "tts", "premium"]`. `auto` sits after `requirements` and before `llm` because the manual routes are the fallback now — someone who takes the tap never needs the three screens that follow, and someone who declines has lost a swipe. `IntroStepper` takes any count without changes.

On the `auto` step the `AutoSetupCard`'s own header is hidden: the step title and body already say what it is. See `guidelines/surfaces/on-device.md` for the card itself. The `auto` step also carries the **device probe** ("Test this device", with the memory · storage readout) — moved here from settings when the On-device page was retired (`guidelines/surfaces/settings.md`): capability is a first-launch question, so the walkthrough answers it.

## Navigation

Every step is reachable from the header stepper as well as the arrows; the last step's forward action becomes a finish action. Upstream, `IntroFlowScreen.tsx` puts the steps in a horizontally paged `ScrollView`, so they can also be swiped; the web kit renders only the current step, so arrows and stepper are the whole navigation there — the gesture is what is missing, not a direction.

## Header targets

The app's `headerButton` style is 40×40, below the 44pt minimum. The circle stays drawn at 40 so the header looks identical, but the button around it is 44×44 with a −2 margin. This is the system's precedent for visual-smaller-than-target controls; follow it rather than inventing a second approach.

## The banner (`IntroBanner`)

The route into the walkthrough from the home screen. Violet `#5B21B6`, fixed in both appearances — on a first launch it must not read as part of the furniture; it is the only surface in the product that does not follow the theme. Its dismiss control is withheld until the user has opened the intro at least once: on first launch the banner is the only route in, and a close button beside an unread offer invites removing it unseen. In landscape it collapses to a single 48pt row with the title centred. While it is up, the orb steps down from 196 to 156 so the column still fits.

**Open decision (owner):** Premium reads two ways — the introduction banner is violet, the Premium button is gold. One of them is wrong; the decision is parked.

## Audio examples

The speech steps carry play controls and a language picker for the 19 localised intro recordings (`intro-<lang>.m4a`). In the web kit the controls toggle state only; no clip plays.
