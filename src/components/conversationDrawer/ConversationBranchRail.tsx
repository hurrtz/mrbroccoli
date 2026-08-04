import React from "react";
import { View } from "react-native";

import { useTheme } from "../../theme/ThemeContext";
import type { ConversationBranchRow } from "../../utils/conversationBranches";
import { styles } from "./styles";

const MAX_VISIBLE_BRANCH_DEPTH = 4;

export function ConversationBranchRail({
  row,
  active,
}: {
  row: ConversationBranchRow;
  active: boolean;
}) {
  const { colors } = useTheme();
  const depth = Math.min(row.depth, MAX_VISIBLE_BRANCH_DEPTH);
  const currentLeft = 8 + depth * 14;
  const lineColor = active ? colors.accent : colors.borderStrong;
  const displayedAncestors = row.ancestorHasNextSibling.slice(
    Math.max(0, row.depth - depth),
    row.depth,
  );

  return (
    <View
      testID={`conversation-branch-rail-${row.conversation.id}`}
      style={[styles.branchRail, { width: currentLeft + 12 }]}
      pointerEvents="none"
      accessible={false}
    >
      {displayedAncestors.map((hasNext, index) =>
        hasNext ? (
          <View
            key={`ancestor-${index}`}
            style={[
              styles.branchRailVertical,
              { left: 8 + index * 14, backgroundColor: colors.border },
            ]}
          />
        ) : null,
      )}
      {depth > 0 ? (
        <>
          <View
            style={[
              styles.branchRailUpper,
              { left: currentLeft - 14, backgroundColor: lineColor },
            ]}
          />
          <View
            style={[
              styles.branchRailHorizontal,
              {
                left: currentLeft - 14,
                width: 14,
                backgroundColor: lineColor,
              },
            ]}
          />
        </>
      ) : null}
      {row.hasChildren ? (
        <View
          style={[
            styles.branchRailLower,
            { left: currentLeft, backgroundColor: lineColor },
          ]}
        />
      ) : null}
      <View
        style={[
          styles.branchRailNode,
          {
            left: currentLeft - 4,
            backgroundColor: active ? colors.accent : colors.surface,
            borderColor: lineColor,
          },
        ]}
      />
    </View>
  );
}
