import React from "react";

/**
 * The top edge of the transcript drawer, peeking above the bottom of the
 * workspace. It reads as the drawer it opens rather than as a button: a grip
 * and the single word "Transcript" — nothing about the conversation itself,
 * which the byline above it already names.
 */
export function TranscriptHandle({ messageCount = 0, onPress, style }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onPress}
      aria-label={messageCount ? "Show transcript. " + messageCount + " messages" : "Show transcript. No messages yet."}
      style={{
        cursor: "pointer", padding: "10px 16px 14px",
        borderRadius: "var(--mb-radius-sheet-top) var(--mb-radius-sheet-top) 0 0",
        border: "1px solid var(--mb-color-surface-raised-border)", borderBottom: "none",
        background: "var(--mb-color-surface-raised)", ...style,
      }}
    >
      <span style={{ display: "block", width: 38, height: 4, borderRadius: 2, margin: "0 auto 10px", background: "var(--mb-color-border-strong)" }} />
      <span style={{
        display: "block", fontFamily: "var(--mb-font-mono)", fontSize: 11, letterSpacing: "0.75px",
        textTransform: "uppercase", color: "var(--mb-color-text-muted)", textAlign: "center",
      }}>Transcript</span>
    </div>
  );
}
