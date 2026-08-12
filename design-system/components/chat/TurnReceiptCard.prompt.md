What the turn actually did — requested versus actual route, effort, input, search, voice, context, timings — as a disclosure under the assistant reply.

```jsx
<ChatBubble {...message}>
  <TurnReceiptCard summary="OpenRouter · 6.4 s"
    rows={[{ label: "Requested", value: "Anthropic · Claude Sonnet 4.5" },
           { label: "Actual", value: "OpenRouter → Anthropic · ×2" },
           { label: "Timing", value: "stt 0.8 s · model 4.1 s · total 6.4 s", mono: true }]} />
</ChatBubble>
```

Collapsed, it is a 44pt line: glyph, title, the gateway-and-duration summary in mono, a chevron. That line is the whole affordance — most turns are never expanded.

Rail style: the receipt is a hairline-topped section of the message row itself, full width, transparent — never a filled box inside the message (the upstream card-in-card treatment does not carry over).

Values arrive pre-formatted from the app (locale keys, middle-dot separators, `formatDuration`); this component lays them out and nothing else. Rows the turn does not have are simply not passed — no dashes.
