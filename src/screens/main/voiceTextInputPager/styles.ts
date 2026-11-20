import { StyleSheet } from "react-native";
import { textStyles } from "../../../theme/typography";

export const PAGE_GAP = 32;
// A 46pt send button, two 8pt insets and the composer border fit within 68pt.
export const MIN_TYPING_VIEWPORT_HEIGHT = 68;
// The stage's 2pt row gap completes the 18pt separation on either side.
const CONTROL_ROW_MARGIN = 16;

export const voiceTextInputPagerStyles = StyleSheet.create({
  fill: {
    flex: 1,
    minHeight: 0,
  },
  root: {
    flex: 1,
    minHeight: 0,
    width: "100%",
    gap: 2,
  },
  activity: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    columnGap: 6,
    marginBottom: CONTROL_ROW_MARGIN,
    paddingVertical: 12,
  },
  activityTyping: {
    marginBottom: 4,
    paddingVertical: 2,
  },
  activityText: {
    ...textStyles.orbCaption,
    fontSize: textStyles.orbCaption.fontSize * 2,
    lineHeight: textStyles.orbCaption.lineHeight * 2,
    flexShrink: 1,
    textAlign: "center",
  },
  rootWithFooter: {
    justifyContent: "center",
  },
  typingStage: {
    flex: 0,
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  pendingAttachments: {
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 2,
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
  viewportWithFooter: {
    flexGrow: 0,
    flexShrink: 1,
  },
  viewportContent: {
    ...StyleSheet.absoluteFill,
  },
  track: {
    flexDirection: "row",
    gap: PAGE_GAP,
    height: "100%",
  },
  trackCovered: {
    opacity: 0,
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
    height: "100%",
    paddingHorizontal: 46,
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
  chevronLayer: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    flexDirection: "row",
  },
  chevronLayerCovered: {
    opacity: 0,
  },
  chevronSpacer: {
    flex: 1,
  },
  orbSlot: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  textSurface: {
    width: "100%",
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
    borderRadius: 12,
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
  footer: {
    flexShrink: 0,
    marginTop: CONTROL_ROW_MARGIN,
    width: "100%",
  },
});
