Rename dialog for a conversation, opened from the actions sheet.

```jsx
<ConversationRenameModal visible title={c.title} value={draft} onChange={setDraft}
  onSubmit={save} onClose={cancel} />
```

A centred dialog: the current title muted on top, one text field, Cancel and Save. Save takes the success tone and stays disabled while the field is empty. Untitled conversations arrive with the first message text as their working title — the field starts with whatever the row shows.
