Integrity review for a conversation's stored messages, opened from the actions sheet.

```jsx
<ConversationIntegrityModal conversation={c} state="findings"
  findingsCount={3} repairableCount={2} onRepair={repair} onExportOriginals={exportAll} onClose={close} />
```

Four states drive the body line and footer: `loading` (spinner, close only), `clean` (success glyph, close), `findings` (warning glyph; Repair N in success tone, Export originals, Close), `failed` (danger glyph, close). `canUndo` adds Undo repair after a repair ran. While `busy`, everything disables and the mask won't close. Counts and copy arrive pre-formatted — the component never inspects messages itself.
