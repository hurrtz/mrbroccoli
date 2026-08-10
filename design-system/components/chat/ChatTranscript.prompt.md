The message list. It renders what you put in it plus the empty state.

```jsx
<ChatTranscript isEmpty={!messages.length} emptyTitle="No messages yet" emptyDescription="Hold the microphone and ask something.">
  {messages.map((message) => <ChatBubble key={message.id} {...message} />)}
</ChatTranscript>
```

The empty state is centred, quiet, and never illustrated.
