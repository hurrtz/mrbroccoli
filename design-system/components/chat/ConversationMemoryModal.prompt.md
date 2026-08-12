The conversation's rolling memory — the summary older turns were compressed into — shown in full and editable in place.

```jsx
<ConversationMemoryModal visible={open} onClose={close} conversationTitle="Weekend plans"
  countLabel="14 turns summarized" summary={summary}
  description="Older turns are folded into this summary and sent with every request."
  onCopy={copy} onSave={save} onClear={forget} />
```

Built on the system `Modal` dialog. The summary sits in one `surface-alt` well with a mono label carrying the turn count — evidence of what the memory covers before the memory itself. While empty, the well states "Nothing summarized yet." and the editor does not render.

Three equal actions in one row: Copy, Save, Forget. Save takes accent ink and enables only when the draft actually differs; Forget takes danger ink but no danger fill — it is destructive to the summary, not to the conversation. None of the three ever leaves the screen; the summary well shrinks first.
