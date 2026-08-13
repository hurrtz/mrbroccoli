The drive-session controls, shown above the composer while the input mode is Drive Session (premium).

```jsx
<DriveSessionControls running canRepeat countdownSeconds={4}
  onToggle={pauseOrResume} onRepeat={replayLastReply} />
```

Two 48pt buttons: **Repeat last** (quiet), and one fixed-position **Pause/Resume toggle** — accent-filled with a pause glyph while the hands-free loop is live, quiet with a play glyph when paused. The fill is the status: readable at arm's length, no dimmed twin. While the silence window runs, the "Sends in N…" chip appears over the toggle's corner (`role="status"`; the countdown is also spoken by cue upstream).

Rules: positions never swap — drivers aim by muscle memory; `disabled` (pipeline busy) dims but never removes; headset/car remote buttons map to the same two actions. This intentionally replaces the upstream three-button row (pause + repeat + resume with one always disabled) — recorded in `guidelines/surfaces/workspace.md`.
