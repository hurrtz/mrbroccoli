One message. Full-width rows with a 3pt rail on the outer edge — accent on the user's right, strong border on the assistant's left — not chat bubbles.

```jsx
<ChatBubble role="assistant" provider="anthropic" model="Claude Sonnet 4.5" timestamp="09.08.26 · 14:12"
  text="The tide turns roughly every six hours." actions={[{ icon: "copy", label: "Copy" }]} />
```

The user row is accent-soft; the assistant row is the plain surface. The meta line is mono at 10px. Turn receipts, web-search references and usage cards go in `children`, below the text.
