The transcript's top edge, showing above the bottom of the workspace so a running conversation is visible without opening anything.

```jsx
<TranscriptHandle messageCount={12} meta="GPT-5 · 2 min ago" preview={lastReply} onPress={openTranscript} />
```

Pin it flush to the bottom edge with no side padding, so it reads as a drawer you can pull rather than a card floating above one. It rounds only its top corners for the same reason.

With `messageCount={0}` it collapses to "No messages yet" and drops the preview — a fresh session should not look like it is hiding something. The accessible name always states the real count.
