# Mr Broccoli — introduction UI kit

The seven-step first-launch walkthrough, standalone. The surface is specified in `guidelines/surfaces/intro.md`; the components are `components/intro/`. This kit exists so the walkthrough can be reviewed without clicking through the workspace kit — the workspace kit still opens the same `IntroFlow` from its banner.

## Files

| File | What it is |
| --- | --- |
| `index.html` | Two frames: the welcome step in light, the automatic-setup step (`auto`, step 3 of 7) in dark |

## What is interactive

Every step is reachable from the header stepper and the arrows; the last step's forward action becomes a finish action. The automatic-setup card runs itself here (no host `state` passed — specimen mode), so tapping "Set up automatically" plays the whole measure → propose → install flow inside the step.

## Web adaptations

Same as the workspace kit: no swipe gesture (the app's paged `ScrollView` is what is missing), audio examples toggle state without playing a clip, and the manual routes' actions close the flow rather than opening real settings.
