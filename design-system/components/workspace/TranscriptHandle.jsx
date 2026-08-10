import React from "react";

/**
 * The top edge of the transcript drawer, peeking above the bottom of the
 * workspace. It reads as the drawer it opens rather than as a button: a grip,
 * the last reply's provenance, and one line of the reply itself.
 */
export function TranscriptHandle({ messageCount = 0, meta, preview, onPress, style }) {
  const empty = !messageCount;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onPress}
      aria-label={empty ? "Show transcript. No messages yet." : "Show transcript. " + messageCount + " messages"}
      style={{
        cursor: "pointer", padding: "10px 16px 14px",
        borderRadius: "var(--mb-radius-sheet-top) var(--mb-radius-sheet-top) 0 0",
        border: "1px solid var(--mb-color-surface-raised-border)", borderBottom: "none",
        background: "var(--mb-color-surface-raised)", ...style,
      }}
    >
      <span style={{ display: "block", width: 38, height: 4, borderRadius: 2, margin: "0 auto 10px", background: "var(--mb-color-border-strong)" }} />
      {empty ? (
        <span style={{
          display: "block", fontFamily: "var(--mb-font-mono)", fontSize: 11, letterSpacing: "0.75px",
          textTransform: "uppercase", color: "var(--mb-color-text-muted)", textAlign: "center",
        }}>No messages yet</span>
      ) : (
        <React.Fragment>
          {meta ? (
            <span style={{
              display: "block", fontFamily: "var(--mb-font-mono)", fontSize: 10, letterSpacing: "0.6px",
              textTransform: "uppercase", color: "var(--mb-color-text-muted)", marginBottom: 3,
            }}>{meta}</span>
          ) : null}
          <span style={{
            display: "block", fontFamily: "var(--mb-font-body)", fontSize: 13, lineHeight: "19px",
            color: "var(--mb-color-text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{preview}</span>
        </React.Fragment>
      )}
    </div>
  );
}
