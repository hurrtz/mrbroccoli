import React from "react";
import { Input } from "../core/Input";
import { Modal } from "../overlays/Modal";

/** Rename dialog for a conversation. Save is disabled while the title is empty. */
export function ConversationRenameModal({ visible, title, value, onChange, onSubmit, onClose, inline = false }) {
  return (
    <Modal visible={visible} onClose={onClose} title="Rename conversation" inline={inline}
      footer={[
        { text: "Cancel", onPress: onClose },
        { text: "Save", onPress: onSubmit, tone: "success", disabled: !value || !value.trim() },
      ]}>
      {title ? <p style={{ margin: 0, fontFamily: "var(--mb-text-supporting-family)", fontSize: 13, lineHeight: "19px", color: "var(--mb-color-text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</p> : null}
      <Input value={value} onChange={onChange} placeholder="Conversation title" ariaLabel="Conversation title" allowClear />
    </Modal>
  );
}
