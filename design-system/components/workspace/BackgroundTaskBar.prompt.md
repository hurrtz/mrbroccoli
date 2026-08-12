The home-screen row for work that keeps running after the user has left the
screen that started it — today, an on-device model install.

```jsx
<BackgroundTaskBar title="Installing on-device AI"
  detail="Step 3 of 5 · about 2 min left" fraction={0.46}
  onPress={() => openSettingsPage("app")} />
```

It sits under the top bar, above the route byline, and it always leads to the
page that owns the job so the user can see the detail. There is no dismiss
control: the work continues either way, and removing the row would only take
away the route back.

Give it a tone change rather than a second component when the job ends —
`success` or `danger` — and only when the user cannot be shown a toast instead.
