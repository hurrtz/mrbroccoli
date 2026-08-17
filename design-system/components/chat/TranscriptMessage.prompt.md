One transcript row — spoken-script style, the transcript drawer's message presentation.

```jsx
<TranscriptMessage role="assistant" provider="anthropic" model="Claude Sonnet 4.5" time="14:12" last
  paragraphs={["High water is at 15:40.", "Aim for the slack window around it."]}
  expanded={open} onToggle={toggle}
  meta="3 sources · OpenRouter · 6.4 s" metrics={rows}
  metricsOpen={receiptOpen} onOpenMetrics={openReceipt} onCloseMetrics={closeReceipt}
  actions={[{icon:"edit",label:"Correct transcript"},{icon:"branch",label:"Branch here"},{icon:"copy",label:"Copy"},
            {icon:"share-alt",label:"Share"},{icon:"sound",label:"Speak again"},{icon:"warning",label:"Report"}]} />
```

No boxes: a 34pt margin column carries the speaker (YOU in accent, or the provider mark; council turns show "Council of" plus one mark per model, duplicates included) and a thread line connecting rows — the newest row draws none (`last`). Collapsed messages clamp to **three lines** with a plain ellipsis; the fold chevron sits right-aligned on the name line, and tapping the message toggles it. Session rule: in an ongoing session the latest message arrives expanded, everything else collapsed; a reopened past session is all collapsed. User asks render italic in the secondary colour; a corrected message reads "14:12 · edited".

The **action row is always present** — six bare 44pt targets, shipped order: edit (correct the transcript), branch, copy (a check for three seconds once the clipboard confirms), share, speak again (stop while that message is speaking, loading while it prepares), report. They are not a hover or long-press affordance and they do not wait for the fold to open.

The **meta line opens the turn receipt as a modal** — a 44pt row of mono text ending in an `info-circle` mark; the receipt is a titled dialogue with a Done action and label/value rows, never an inline panel under the message. It appears when usage stats are on and the row is either expanded or too short to fold; with usage stats off, pass no `meta` and the transcript is pure conversation.

Rows swipe to remove in the app (drops the turn from future context, saving tokens); `ReplyFailureCard`, `PipelineNotices`, `MessageBranchIndicator` and the knowledge references mount directly under the row — no bubble wraps them.
