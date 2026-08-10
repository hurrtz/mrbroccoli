import React from "react";
import { IconButton } from "../core/IconButton";

/**
 * The conversation's settings stated as a sentence, with one control beside it.
 * A line of muted text is quieter than any number of chips, and it says
 * everything at once. Noun phrases, separated by middots, no trailing stop.
 */
export function ConversationSettingsSummary({ summary, onPress, accessibilityLabel = "Conversation settings", style }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 44, ...style }}>
      <span style={{
        flex: 1, minWidth: 0, fontFamily: "var(--mb-font-body)", fontSize: 13, lineHeight: "19px",
        color: "var(--mb-color-text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>{summary}</span>
      <IconButton icon="control" accessibilityLabel={accessibilityLabel} onPress={onPress} />
    </div>
  );
}
