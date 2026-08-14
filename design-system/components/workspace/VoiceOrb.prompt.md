The large circular voice control at the centre of the workspace — use it as the screen's single loud element, never more than one per view.

```jsx
<VoiceOrb phase="searching" phaseProgress={0.66} turnProgress={0.52} onPress={start} />
```

The glyph says what tapping does, not what the machine is doing: `stop` while recording, `pause` while speaking, `mic` at rest. The disc takes the phase colour and the icon takes whichever of near-black or white measures higher contrast against it.

Anatomy inside out: the disc; a small gap that is only ever a gap — the screen reads through it, in every phase; the inner ring; the outer ring flush against it (no separation between the two rings).

What the rings mean per phase: **idle** — both faded green, no clocks. **Recording** — both combine into one indicator: how much of the recording window is used before what was said auto-submits. **Transcribing → synthesizing** — two clocks: the outer ring is the whole turn against its estimate, in a neutral so it reads as time; the inner ring is the current phase against itself, in the phase's own colour. **Speaking** — both combine again: how much of the response has been read; back/forward paragraph jumps move the arc (back returns to the start of the current paragraph, or the one before it inside the first two seconds), and at the last word the app returns the orb to idle. Set `overtime` above 0 once the turn passes its estimate and the rings fill with red as it runs — a full lap late is a fully red orb.

`size` is 196 in portrait and 150 in landscape (156 while the introduction banner is up). Below about 120 the rings stop being legible — there is no smaller variant, so give the orb its room.
