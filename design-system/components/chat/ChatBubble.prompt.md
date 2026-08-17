One message. Full-width rows with a 3pt rail on the outer edge — accent on the user's right, strong border on the assistant's left — not chat bubbles.

```jsx
<ChatBubble role="assistant" provider="anthropic" model="Claude Sonnet 4.5" timestamp="09.08.26 · 14:12"
  text="The tide turns roughly every six hours." actions={[{ icon: "copy", label: "Copy" }]} />
```

The user row is accent-soft; the assistant row is the plain surface. The meta line is mono at 10px.

**Not a chat surface.** No shipped screen mounts this — a conversation is a script (`TranscriptMessage`), and upstream `ChatBubble.tsx` has no importer either. It survives for the introduction's stored session, where messenger anatomy is the point: that dialogue should read as a remembered exchange, not as the live transcript. `children` still accepts a notice; the four receipt-style sub-cards it used to host are retired.
