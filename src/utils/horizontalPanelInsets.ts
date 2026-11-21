import type { EdgeInsets } from "react-native-safe-area-context";

/** Keep content clear of window hardware only where it overlaps this panel. */
export function resolveHorizontalPanelInsets({
  insets,
  isRtl,
  panelLeft,
  panelWidth,
  windowWidth,
}: {
  insets: Pick<EdgeInsets, "left" | "right">;
  isRtl: boolean;
  panelLeft: number;
  panelWidth: number;
  windowWidth: number;
}) {
  const panelRight = panelLeft + panelWidth;
  const left = Math.min(panelRight, Math.max(panelLeft, insets.left));
  const right = Math.max(left, Math.min(panelRight, windowWidth - insets.right));
  const leftPadding = left - panelLeft;
  const rightPadding = panelRight - right;

  return {
    left,
    right,
    padding: {
      paddingStart: isRtl ? rightPadding : leftPadding,
      paddingEnd: isRtl ? leftPadding : rightPadding,
    },
  };
}
