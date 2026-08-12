import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";
import { Modal } from "../overlays/Modal";

function ActionRow({ icon, label, danger = false, onPress }) {
  const color = danger ? "var(--mb-color-danger)" : "var(--mb-color-text-secondary)";
  return (
    <button type="button" onClick={onPress} style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 48, padding: "0 14px", borderRadius: "var(--mb-radius-card)", border: "1px solid var(--mb-color-border)", background: "var(--mb-color-surface-elevated)", cursor: "pointer", textAlign: "left" }}>
      <PhosphorIcon name={icon} size="compact" color={color} />
      <span style={{ fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 15, color: danger ? "var(--mb-color-danger)" : "var(--mb-color-text)" }}>{label}</span>
    </button>
  );
}

/** The per-conversation actions sheet. Archive is a system addition over upstream. */
export function ConversationActionSheet({ conversation, onClose, onTogglePinned, onTogglePrivate, onRename, onAutoName, onToggleArchived, onReviewIntegrity, onManageMemory, onShare, onCopy, onDelete, inline = false }) {
  if (!conversation) return null;
  const c = conversation;
  const fire = (fn) => () => { if (fn) fn(c.id); onClose(); };
  return (
    <Modal visible layout="sheet" onClose={onClose} inline={inline}
      title={<div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 18, lineHeight: "24px", color: "var(--mb-color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</span>
        <span style={{ fontFamily: "var(--mb-font-mono)", fontSize: 11, lineHeight: "16px", color: "var(--mb-color-text-muted)" }}>{c.messageCount ?? 0} messages</span>
      </div>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <ActionRow icon="pushpin" label={c.pinned ? "Unpin" : "Pin"} onPress={fire(onTogglePinned)} />
        <ActionRow icon={c.isPrivate ? "global" : "lock"} label={c.isPrivate ? "Include in knowledge" : "Mark private"} onPress={fire(onTogglePrivate)} />
        <ActionRow icon="edit" label="Rename" onPress={() => { if (onRename) onRename(c); }} />
        <ActionRow icon="thunderbolt" label="Name automatically" onPress={fire(onAutoName)} />
        <ActionRow icon="inbox" label={c.archived ? "Unarchive" : "Archive"} onPress={fire(onToggleArchived)} />
        <ActionRow icon="safety-certificate" label="Review integrity" onPress={() => { if (onReviewIntegrity) onReviewIntegrity(c); }} />
        <ActionRow icon="brain" label="Memory" onPress={fire(onManageMemory)} />
        <ActionRow icon="share-alt" label="Share" onPress={fire(onShare)} />
        <ActionRow icon="copy" label="Copy" onPress={fire(onCopy)} />
        <ActionRow icon="delete" label="Delete" danger onPress={fire(onDelete)} />
      </div>
    </Modal>
  );
}
