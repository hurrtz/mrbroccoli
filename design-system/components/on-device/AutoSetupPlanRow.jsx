import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";
import { LocalModelPerformanceSummary } from "./LocalModelPerformanceSummary";

const ROLE_ICON = { think: "brain", listen: "mic", speak: "sound" };

const TINT = {
  planned: "var(--mb-color-text-muted)",
  active: "var(--mb-color-accent)",
  done: "var(--mb-color-success)",
  failed: "var(--mb-color-danger)",
  skipped: "var(--mb-color-text-muted)",
};

/**
 * One model the device check picked, with the job it was picked for.
 *
 * The role comes first and the model name second: a user choosing to trust an
 * automatic selection cares that something will do the thinking, not that the
 * something is called Qwen. The performance summary keeps the house rule —
 * evidence, then verdict, then numbers.
 */
export function AutoSetupPlanRow({ role = "think", roleLabel, name, size, evidence, fit, details = [], state = "planned", note, style }) {
  const tint = TINT[state] || TINT.planned;
  const glyph = state === "done" ? "check" : state === "failed" ? "warning" : ROLE_ICON[role] || "cpu";
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, ...style }}>
      <span style={{
        width: 30, height: 30, flexShrink: 0, borderRadius: 999, marginTop: 1,
        display: "flex", alignItems: "center", justifyContent: "center",
        border: "1px solid color-mix(in srgb, " + tint + " 30%, transparent)",
        background: state === "done" || state === "failed" ? "color-mix(in srgb, " + tint + " 10%, transparent)" : "transparent",
      }}>
        <PhosphorIcon name={glyph} size="compact" color={tint} />
      </span>
      <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ flex: 1, minWidth: 0, fontFamily: "var(--mb-font-mono)", fontSize: 11, lineHeight: "15px", letterSpacing: "0.75px", textTransform: "uppercase", color: "var(--mb-color-text-muted)" }}>{roleLabel}</span>
          {size ? <span style={{ fontFamily: "var(--mb-font-mono)", fontSize: 11, lineHeight: "15px", color: "var(--mb-color-text-muted)", whiteSpace: "nowrap" }}>{size}</span> : null}
        </span>
        <span style={{ fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 15, lineHeight: "20px", color: "var(--mb-color-text)" }}>{name}</span>
        {note ? (
          <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 12, lineHeight: "17px", color: state === "failed" ? "var(--mb-color-danger)" : "var(--mb-color-text-secondary)" }}>{note}</span>
        ) : (
          <LocalModelPerformanceSummary evidence={evidence} fit={fit} details={details} />
        )}
      </span>
    </div>
  );
}
