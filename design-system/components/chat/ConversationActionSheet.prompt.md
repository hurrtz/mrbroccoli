The per-conversation actions sheet, opened by the ellipsis button on a drawer row.

```jsx
<ConversationActionSheet conversation={selected} onClose={close}
  onTogglePinned={togglePin} onToggleArchived={toggleArchive} onDelete={confirmDelete} />
```

A bottom sheet titled with the conversation and its message count, then one 48pt bordered row per action: pin, private, rename, name automatically, archive, integrity, memory, share, copy, delete (the one danger-inked row, always last). **Archive and auto-naming are system additions** — the flat drawer keeps sessions out of the everyday list via archive, and auto-naming (generate a title from the conversation) moved here from the conversation settings sheet, where per-session it earned too little for permanent screen space. Pin/private/archive/auto-name rows fire and close; rename and integrity open their modal over the sheet. Delete confirms via the platform alert before destroying anything.
