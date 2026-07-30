import { StyleSheet } from "react-native";

import { fonts } from "../../theme/typography";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  keyboardAvoider: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: 460,
    padding: 22,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 8,
  },
  cardPortrait: {
    flex: 1,
    maxWidth: undefined,
    shadowOpacity: 0,
    elevation: 0,
  },
  header: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  headerCopy: {
    flex: 1,
    gap: 6,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontFamily: fonts.mono,
  },
  title: {
    fontSize: 30,
    lineHeight: 34,
    fontFamily: fonts.display,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  progressRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
  },
  progressDot: {
    flex: 1,
    height: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  content: {},
  contentLandscape: {
    flexShrink: 1,
    maxHeight: 430,
  },
  contentPortrait: {
    flex: 1,
  },
  contentContainer: {
    gap: 14,
    paddingBottom: 12,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: fonts.body,
  },
  note: {
    fontSize: 13,
    lineHeight: 19,
    fontFamily: fonts.body,
  },
  settingsShortcutRow: {
    minHeight: 72,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingsShortcutCopy: {
    flex: 1,
    gap: 3,
  },
  settingsShortcutTitle: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.display,
  },
  settingsShortcutSummary: {
    fontSize: 12,
    lineHeight: 17,
    fontFamily: fonts.body,
  },
  providerPicker: {
    marginBottom: 0,
  },
  inputSection: {
    gap: 10,
  },
  inputLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1.1,
    fontFamily: fonts.mono,
  },
  input: {
    minHeight: 54,
    width: "100%",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingRight: 58,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: fonts.body,
  },
  apiKeyInputRow: {
    position: "relative",
    justifyContent: "center",
  },
  apiKeyVisibilityButton: {
    position: "absolute",
    top: 9,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  helperText: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.body,
  },
  statusCard: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  statusText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.body,
  },
  summaryStack: {
    gap: 10,
  },
  routeRow: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 4,
  },
  routeLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1.1,
    fontFamily: fonts.mono,
  },
  routeValue: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fonts.display,
  },
  resultCard: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  resultLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1.1,
    fontFamily: fonts.mono,
  },
  resultText: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: fonts.body,
  },
  inlineLink: {
    alignSelf: "flex-start",
  },
  inlineLinkText: {
    fontSize: 14,
    fontFamily: fonts.body,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    alignItems: "flex-end",
  },
  providerFooterStack: {
    flex: 1,
    gap: 10,
  },
  footerButtonRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-end",
  },
  footerErrorBanner: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  footerErrorText: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.body,
  },
  primaryButtonWrapper: {
    flex: 1,
  },
  primaryButton: {
    width: "100%",
    minWidth: 148,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonDisabled: {
    opacity: 0.55,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: fonts.display,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontFamily: fonts.display,
  },
});
