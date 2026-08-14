The product's only switch — use it for every on/off state, never a hand-rolled track.

```jsx
<SettingsRow icon="line-chart" label="Usage stats in transcripts"
  control={<Switch value={stats} onChange={setStats} accessibilityLabel="Usage stats in transcripts" />} />
```

The track keeps its native 46×28 drawing; the pressable around it is a full 44pt target (the `IconAction` trick — the visual size stays, the tap does not). Knobs stay circular: they are geometry, not controls, and so are exempt from the squircle rule in `guidelines/foundations.md`.

Use it for immediate state — the switch takes effect on tap, no confirmation. For a choice among routes use `RouteOptionRow`; for a reveal that needs a label, pair it with a body-weight line as in the introduction's "Show manual setup".
