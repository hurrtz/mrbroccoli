The orb and the verbs that act on it, as one object. Mount it wherever the workspace shows the orb — at every phase, both orientations.

```jsx
<OrbTransport phase={turn.phase} orbSize={orbSize}
  phaseProgress={turn.phaseProgress} turnProgress={turn.turnProgress}
  onOrbPress={turn.toggle} onStop={turn.stop}
  onRestart={turn.restart} onBack={turn.back} onForward={turn.forward} />
```

**Why the verbs orbit rather than sit in a row.** They act on the response, and the orb *is* the response while it plays — it holds the reading arc and its own tap is pause/resume. Putting them around it leaves the row beneath permanently to composing, so one location never means two things, and pausing a turn no longer rewrites the bottom of the screen.

**The footprint is permanent; the keys are not.** The cluster reserves its box at idle too, drawing nothing in it, so the orb never moves when a turn starts — keys appear in already-reserved space. Do not mount a bare `VoiceOrb` at idle and swap: that is the 15pt orb-jump bug this rule exists to prevent. Presence stays informative: keys up means a turn is running.

Back and Forward take the flanks so left and right mean what they look like; Restart and Stop take the lower diagonals, nearest the thumb. The three seek verbs are `disabled` until the speaking phase; **Stop is live in every turn phase** and abandons the turn. The hands-free loop is not this component's business — starting and ending it belongs to the **Hands free switch** in the composing row (`workspace.md` → Hands free).

The cluster sizes itself from `orbSize`; give it a centred flex slot and nothing else. It never steps the orb down — measure the stage and pass a diameter that fits (196 portrait, 150 landscape, 156 while the introduction banner is up). `labels={false}` for landscape.
