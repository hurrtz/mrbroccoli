One transcript row — spoken-script style, the transcript drawer's message presentation.

```jsx
<TranscriptMessage role="assistant" provider="anthropic" model="Claude Sonnet 4.5" time="14:12"
  paragraphs={["High water is at 15:40.", "Aim for the slack window around it."]}
  expanded={open} onToggle={toggle}
  meta="3 sources · OpenRouter · 6.4 s" metrics={rows} metricsOpen={statsOpen} onToggleMetrics={toggleStats}
  actions={[{icon:"branch",label:"Branch here"},{icon:"copy",label:"Copy"},{icon:"share-alt",label:"Share"},{icon:"sound",label:"Speak again"}]} />
```

No boxes: a 34pt margin column carries the speaker (YOU in accent, or the provider mark; council turns show "Council of" plus one mark per model, duplicates included) and a thread line connecting rows. Collapsed messages clamp to **three lines** with a plain ellipsis; the fold chevron sits right-aligned on the name line, and tapping the message toggles it. Session rule: in an ongoing session the latest message arrives expanded, everything else collapsed; a reopened past session is all collapsed. User asks render italic in the secondary colour. Actions appear only while expanded. The meta line is always present when usage stats are on and is its own disclosure over the full metrics panel; with usage stats off, pass no `meta` — the transcript is pure conversation. Rows swipe to remove in the app (drops the turn from future context, saving tokens); `ReplyFailureCard` and `PipelineNotices` still mount under a failed or noisy turn.
