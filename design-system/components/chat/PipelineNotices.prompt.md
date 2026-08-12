Warnings the pipeline raised while producing this turn — the reply arrived, but something along the way degraded or failed.

```jsx
<PipelineNotices notices={[{ stageLabel: "Text to speech", level: "error",
  message: "ElevenLabs rejected the request.", detail: "Voice quota exhausted",
  actions: [{ icon: "sound", label: "Retry speech", onPress: retry },
            { icon: "setting", label: "Speaking settings", onPress: open, tone: "quiet" }] }]} />
```

One flat row per notice: glyph, the stage's name as a small display-face label, the message in secondary, detail in muted. An `error` row takes danger ink on its hairline, glyph and label only — the message text never turns red.

Warnings state the cost and let the user continue; there is no dismiss and no blocking. Actions appear only where in-place recovery exists (speech output errors: retry, or open the setting behind the failure) — a 44pt accent-soft button for the fix, a quiet bordered one for the detour.
