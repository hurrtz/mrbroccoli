import { StyleSheet } from "react-native";
import { textStyles } from "../../../theme/typography";

export const PAGE_GAP = 32;

export const voiceTextInputPagerStyles = StyleSheet.create({
  root: {
    width: "100%",
    gap: 2,
  },
  viewport: {
    width: "100%",
    minHeight: 68,
    overflow: "hidden",
    position: "relative",
  },
  track: {
    flexDirection: "row",
    gap: PAGE_GAP,
  },
  trackCovered: {
    opacity: 0,
  },
  activeActionOverlay: {
    ...StyleSheet.absoluteFill,
  },
  page: {
    justifyContent: "center",
  },
  // The orb is the whole surface now, so the bar's fill, border and radius are
  // gone: the control is its own shape. The page keeps a minimum so the pager
  // does not collapse before the orb has measured itself.
  voiceSurface: {
    width: "100%",
    minHeight: 68,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  blockedActionLabel: {
    ...textStyles.compactAction,
    textAlign: "center",
  },
  textSurface: {
    width: "100%",
    minHeight: 68,
    maxHeight: 116,
    borderRadius: 15,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 16,
    paddingRight: 9,
    paddingVertical: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  textInput: {
    ...textStyles.body,
    flex: 1,
    minHeight: 24,
    maxHeight: 96,
    paddingVertical: 0,
    textAlignVertical: "center",
  },
  textInputWrap: {
    flex: 1,
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonBlockedStatus: {
    width: "auto",
    minWidth: 116,
    maxWidth: "65%",
    borderRadius: 15,
    flexShrink: 1,
    paddingHorizontal: 12,
  },
  promptBlockedNotice: {
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  promptBlockedCopy: {
    flex: 1,
    gap: 2,
  },
  promptBlockedText: {
    ...textStyles.supporting,
  },
  promptBlockedAction: {
    ...textStyles.compactAction,
  },
  pageIndicators: {
    flex: 1,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
  },
  composerToolbar: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
  },
  driveControls: {
    flexDirection: "row",
    gap: 8,
    paddingTop: 6,
  },
  driveControl: {
    flex: 1,
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  driveControlLabel: {
    fontFamily: textStyles.body.fontFamily,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  pageIndicatorTarget: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  pageIndicator: {
    height: 4,
    borderRadius: 2,
  },
  pageIndicatorLeading: {
    transform: [{ translateX: 12 }],
  },
  pageIndicatorTrailing: {
    transform: [{ translateX: -12 }],
  },
  pageIndicatorSelected: {
    width: 16,
  },
  pageIndicatorIdle: {
    width: 5,
  },
});
