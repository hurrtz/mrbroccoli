The message list. It renders what you put in it plus the empty state.

```jsx
<ChatTranscript isEmpty={!messages.length} emptyTitle="No messages yet" emptyDescription="Your conversation appears here as you talk.">
  {messages.map((message) => <TranscriptMessage key={message.id} {...message} />)}
</ChatTranscript>
```

The empty state is centred, quiet, and never illustrated.
