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
  voiceSurface: {
    width: "100%",
    minHeight: 68,
    borderRadius: 17,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  voiceIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
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
    height: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
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
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  pageIndicator: {
    height: 4,
    borderRadius: 2,
  },
  pageIndicatorSelected: {
    width: 16,
  },
  pageIndicatorIdle: {
    width: 5,
  },
});
