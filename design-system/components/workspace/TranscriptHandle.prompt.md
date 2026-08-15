The peeking top edge of the transcript drawer, above the bottom of the workspace.

```jsx
<TranscriptHandle messageCount={conversation.messages.length} onPress={openTranscript} />
```

States "Transcript" and nothing else — a grip plus the one word, mono and muted. It does not repeat the conversation name, the model, or a preview of the last reply: the byline above the orb already names the conversation, and duplicating it here reads as noise rather than information. `messageCount` only feeds the accessible name.
