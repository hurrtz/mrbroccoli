Transient status above the workspace — a failed provider call, a finished export.

```jsx
<Toast tone="danger" message="OpenAI rejected the key." onRetry={retry} onDismiss={hide} />
```

Three tones: `info` (neutral border, accent stripe), `success`, `danger`. A toast with `onRetry` waits for the user; without it, it auto-dismisses after four seconds. The stripe and the icon carry the tone — the message text stays in the normal text colour.
