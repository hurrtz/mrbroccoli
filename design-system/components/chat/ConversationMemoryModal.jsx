import React from "react";
import { Modal } from "../overlays/Modal";
import { TextArea } from "../core/TextArea";

/**
 * What the conversation remembers: the rolling summary older turns were
 * compressed into, editable in place. Copy / Save / Forget in one row.
 */
export function ConversationMemoryModal({ visible, onClose, title = "What this conversation remembers", conversationTitle, description, countLabel, emptyText = "Nothing summarized yet.", summary = "", onCopy, onSave, onClear, copyLabel = "Copy", saveLabel = "Save", clearLabel = "Forget", inline }) {
  const trimmed = (summary || "").trim();
  const hasSummary = trimmed.length > 0;
  const [draft, setDraft] = React.useState(trimmed);
  React.useEffect(() => { if (visible) setDraft(trimmed); }, [visible, trimmed]);
  const canSave = hasSummary && draft.trim().length > 0 && draft.trim() !== trimmed;
  const action = (label, onPress, enabled, ink) => (
    <button type="button" aria-label={label} aria-disabled={!enabled} onClick={enabled ? onPress : undefined}
      style={{ flex: 1, flexBasis: 112, minHeight: 46, padding: "0 12px", cursor: enabled ? "pointer" : "default", opacity: enabled ? 1 : 0.45,
        borderRadius: "var(--mb-radius-control)", border: "1px solid var(--mb-color-border)", background: "var(--mb-color-surface-alt)",
        fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 13, color: ink }}>{label}</button>
  );
  return (
    <Modal inline={inline} visible={visible} onClose={onClose} title={title}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {conversationTitle ? <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 14, lineHeight: "20px", color: "var(--mb-color-text-secondary)" }}>{conversationTitle}</span> : null}
        {description ? <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 13, lineHeight: "20px", color: "var(--mb-color-text-secondary)" }}>{description}</span> : null}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 16, borderRadius: "var(--mb-radius-card)", border: "1px solid var(--mb-color-border)", background: "var(--mb-color-surface-alt)" }}>
          <span style={{ fontFamily: "var(--mb-font-mono)", fontSize: 11, letterSpacing: "1px", textTransform: "uppercase", color: "var(--mb-color-text-muted)" }}>{hasSummary && countLabel ? countLabel : "Memory"}</span>
          {hasSummary
            ? <TextArea value={draft} onChange={setDraft} rows={7} ariaLabel="Conversation memory" />
            : <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 15, lineHeight: "22px", color: "var(--mb-color-text)" }}>{emptyText}</span>}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {action(copyLabel, onCopy, hasSummary, "var(--mb-color-text)")}
          {action(saveLabel, () => onSave && onSave(draft.trim()), canSave, "var(--mb-color-accent)")}
          {action(clearLabel, onClear, hasSummary, "var(--mb-color-danger)")}
        </div>
      </div>
    </Modal>
  );
}
