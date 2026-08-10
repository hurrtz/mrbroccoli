The strip of images approved as prompt context, in the composer or under a user message.

```jsx
<MessageImageAttachments attachments={images} onRemove={remove} />
```

128×96 thumbnails, 88×66 when `compact`. The remove control is a 44pt target with a 28pt disc inside it. Omit `onRemove` for committed messages.
