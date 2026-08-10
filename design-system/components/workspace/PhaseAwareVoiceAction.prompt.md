The microphone bar — the one loud element on the screen, and the only place the palette leaves the single-accent rule.

```jsx
<PhaseAwareVoiceAction visualPhase="searching" prompt="Please wait." title="Searching" onPress={cancel} />
```

Each pipeline phase owns a colour (recording, transcribing, thinking briefly, searching, thinking, synthesizing, speaking) so progress is legible without reading. The bar takes that colour whole; the icon well takes the measured accessible foreground (`getAccessibleForeground`) so the glyph stays readable on every phase in both appearances. While recording, `recordingProgress` fills the bar left to right against the recording cap. Copy on the bar is always one line and shrinks before it truncates, matching `adjustsFontSizeToFit` / `numberOfLines={1}` upstream, so it never wraps in a narrow landscape column.
