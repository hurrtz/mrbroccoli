import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";
import { Modal } from "../overlays/Modal";

/** Integrity review dialog: inspection states for one conversation's stored messages. */
export function ConversationIntegrityModal({ conversation, state = "clean", findingsCount = 0, repairableCount = 0, canUndo = false, busy = false, onRepair, onUndo, onExportOriginals, onClose, inline = false }) {
  if (!conversation) return null;
  const footer = [];
  if (state === "findings" && repairableCount > 0) footer.push({ text: busy ? "Repairing…" : "Repair " + repairableCount, onPress: onRepair, tone: "success", loading: busy });
  if (canUndo) footer.push({ text: "Undo repair", onPress: onUndo, disabled: busy });
  if (state === "findings" && onExportOriginals) footer.push({ text: "Export originals", onPress: onExportOriginals, disabled: busy });
  footer.push({ text: "Close", onPress: onClose, disabled: busy });
  const body = {
    loading: { icon: "loading", color: "var(--mb-color-text-secondary)", text: "Checking stored messages…" },
    clean: { icon: "check-circle", color: "var(--mb-color-success)", text: "Every stored message matches its recorded hash. Nothing to repair." },
    findings: { icon: "warning", color: "var(--mb-color-warning)", text: findingsCount + (findingsCount === 1 ? " message differs" : " messages differ") + " from the recorded state; " + repairableCount + " can be repaired automatically. Repairing keeps a snapshot, so it can be undone." },
    failed: { icon: "exclamation-circle", color: "var(--mb-color-danger)", text: "The inspection could not finish. Close and try again." },
  }[state];
  return (
    <Modal visible onClose={busy ? undefined : onClose} inline={inline} maskClosable={!busy} footer={footer}
      title={<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ width: 40, height: 40, borderRadius: 20, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--mb-color-accent-soft)", border: "1px solid var(--mb-color-border-strong)" }}>
          <PhosphorIcon name="safety-certificate" size="control" color="var(--mb-color-accent)" />
        </span>
        <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 18, lineHeight: "24px", color: "var(--mb-color-text)" }}>Conversation integrity</span>
          <span style={{ fontFamily: "var(--mb-text-supporting-family)", fontSize: 13, lineHeight: "18px", color: "var(--mb-color-text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{conversation.title}</span>
        </div>
      </div>}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <PhosphorIcon name={body.icon} size="control" color={body.color} style={state === "loading" ? { animation: "mb-spin 1s linear infinite" } : undefined} />
        <style>{"@keyframes mb-spin{to{transform:rotate(360deg)}}"}</style>
        <p style={{ margin: 0, fontFamily: "var(--mb-text-body-family)", fontSize: 15, lineHeight: "22px", color: "var(--mb-color-text)" }}>{body.text}</p>
      </div>
    </Modal>
  );
}
