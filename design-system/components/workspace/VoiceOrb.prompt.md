The large circular voice control at the centre of the workspace — use it as the screen's single loud element, never more than one per view.

```jsx
<VoiceOrb phase="searching" phaseProgress={0.66} turnProgress={0.52} onPress={start} />
```

The glyph says what tapping does, not what the machine is doing: `stop` while recording, `pause` while speaking, `mic` at rest. The disc takes the phase colour and the icon takes whichever of near-black or white measures higher contrast against it.

Two rings, two clocks. The outer ring is the whole turn against its estimate, drawn in a neutral so it reads as time rather than as another phase. The inner ring is the current phase against itself, in that phase's own colour. Set `overtime` above 0 once the turn passes its estimate and both rings fill with red as it runs — a full lap late is a fully red orb.

`size` is 196 in portrait and 150 in landscape. Below about 120 the rings stop being legible; use `PhaseAwareVoiceAction` instead.
