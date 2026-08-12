import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";

function BranchChip({ label, onPress, accessibilityLabel }) {
  const tappable = !!onPress;
  return (
    <span role={tappable ? "button" : undefined} tabIndex={tappable ? 0 : undefined} aria-label={accessibilityLabel || label}
      onClick={onPress}
      style={{ display: "inline-flex", padding: "7px 0", margin: "-7px 0", cursor: tappable ? "pointer" : "default" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, minHeight: 30, maxWidth: "100%", padding: "0 10px", boxSizing: "border-box",
        borderRadius: "var(--mb-radius-tag)",
        border: "1px solid " + (tappable ? "var(--mb-color-border-strong)" : "var(--mb-color-border)"),
        background: tappable ? "var(--mb-color-accent-soft)" : "var(--mb-color-surface-alt)" }}>
        <PhosphorIcon name="branch" size="inline" color="var(--mb-color-accent)" />
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "var(--mb-text-body-family)", fontSize: 12,
          color: tappable ? "var(--mb-color-accent)" : "var(--mb-color-text-secondary)" }}>{label}</span>
      </span>
    </span>
  );
}

/**
 * Where a conversation branched: the origin this one kept its context from,
 * and/or the branches that grew from this message. Chips, because a branch
 * point is metadata about the message, not part of what was said.
 */
export function MessageBranchIndicator({ originLabel, onOpenSource, branchesLabel, onOpenBranches, style }) {
  if (!originLabel && !branchesLabel) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10, ...style }}>
      {originLabel ? <BranchChip label={originLabel} onPress={onOpenSource} /> : null}
      {branchesLabel ? <BranchChip label={branchesLabel} onPress={onOpenBranches} /> : null}
    </div>
  );
}
