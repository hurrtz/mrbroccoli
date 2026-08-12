A turn that produced no reply, shown on the **user's** message — the failure belongs to the question that has no answer, not to a phantom assistant row.

```jsx
<ChatBubble role="user" text="…">
  <ReplyFailureCard message="Anthropic returned 529: overloaded."
    hint="Your message was kept. Retrying sends it again unchanged." onRetry={retry} />
</ChatBubble>
```

The hairline above it is the one danger-coloured line in the transcript; title and glyph are danger, the body stays in secondary ink — the error is stated, not shouted. The hint reassures about the one thing users actually fear here: losing what they said.

Retry is a real 44pt button in `accent-soft` — retrying is a confirming action, so it takes accent, not danger. Omit `onRetry` while a retry is in flight rather than disabling.
