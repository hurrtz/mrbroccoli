# Mr Broccoli — introduction kit

The three-step first run: a welcome that demonstrates (the stored intro session under blur, play as proof), "Don't panic" setup (one green automatic action, manual catalogue behind a switch), and the ephemeral "Try it out!" test with gated Done. The spec lives in `guidelines/surfaces/intro.md`; the component is `components/intro/IntroFlow.jsx`.

| File | What it is |
| --- | --- |
| `index.html` | Three frames: welcome (light), setup (dark), test-after-a-turn (light) |

What's interactive: step navigation (arrows + stepper), play (reveals the voice note), the manual-setup switch, and the step-3 mic — pressing it shows the sample turn and unlocks Done. First-run gating is live: step 2's forward orb is disabled (`thinkingReady` unset), and there is no close control anywhere.
