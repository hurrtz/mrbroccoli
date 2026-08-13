import { StyleSheet } from "react-native";
import { fonts, textStyles } from "../../../theme/typography";

export const PAGE_GAP = 32;

export const voiceTextInputPagerStyles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: 0,
    width: "100%",
    gap: 2,
  },
  viewport: {
    width: "100%",
    minHeight: 68,
    overflow: "hidden",
    position: "relative",
  },
  viewportFlexible: {
    flex: 1,
    minHeight: 96,
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },
  track: {
    flexDirection: "row",
    gap: PAGE_GAP,
    height: "100%",
  },
  trackCovered: {
    opacity: 0,
  },
  activeActionOverlay: {
    ...StyleSheet.absoluteFill,
  },
  activeOrbOverlay: {
    alignItems: "center",
    justifyContent: "center",
  },
  page: {
    height: "100%",
    justifyContent: "center",
  },
  inputSwitchRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 2,
    height: "100%",
    width: "100%",
  },
  inputSwitchSurface: {
    alignItems: "center",
    flex: 1,
    height: "100%",
    justifyContent: "center",
    minWidth: 0,
  },
  surfaceChevron: {
    alignItems: "center",
    flexShrink: 0,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  surfaceChevronDisabled: {
    opacity: 0.22,
  },
  orbSlot: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  textSurface: {
    width: "100%",
    height: "100%",
    minHeight: 96,
    borderRadius: 15,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "flex-end",
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
    maxHeight: 116,
    paddingVertical: 0,
    textAlignVertical: "top",
  },
  textInputWrap: {
    alignSelf: "stretch",
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
  driveControls: {
    flexDirection: "column",
    gap: 6,
    paddingTop: 6,
  },
  driveControlRow: {
    flexDirection: "row",
    gap: 8,
  },
  driveControl: {
    flex: 1,
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  driveControlLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18,
    textAlign: "center",
  },
  driveCountdownChip: {
    alignSelf: "flex-end",
    borderRadius: 99,
    minHeight: 24,
    justifyContent: "center",
    paddingHorizontal: 11,
    paddingVertical: 4,
  },
  driveCountdownLabel: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 0.4,
    lineHeight: 15,
  },
});
