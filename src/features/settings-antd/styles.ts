import { StyleSheet } from "react-native";

import { fonts } from "../../theme/typography";

export const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modal: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
  },
  modalLandscape: {
    maxHeight: "100%",
  },
  header: {
    minHeight: 68,
    paddingHorizontal: 18,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  headerControl: {
    width: 44,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleWrap: {
    flex: 1,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: fonts.headline,
    fontSize: 20,
    fontWeight: "400",
    letterSpacing: -0.2,
    textAlign: "center",
  },
  scroll: {
    flex: 1,
  },
  content: {
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingTop: 18,
    gap: 16,
  },
  drillInPage: {
    gap: 18,
  },
  drillInSummary: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: 4,
  },
  overview: {
    gap: 16,
  },
  setupCard: {
    overflow: "hidden",
  },
  setupCardBody: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 4,
  },
  setupCopy: {
    flex: 1,
    gap: 3,
  },
  setupTitle: {
    fontFamily: fonts.display,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
  },
  setupSummary: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  readinessGrid: {
    flexDirection: "row",
    gap: 8,
  },
  readinessButton: {
    flex: 1,
    minWidth: 0,
    height: 36,
    paddingHorizontal: 2,
    borderRadius: 18,
  },
  sectionList: {
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
  },
  sectionIcon: {
    width: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  pageStack: {
    gap: 16,
  },
  card: {
    overflow: "hidden",
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  fullBleedCardContent: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    gap: 0,
  },
  sectionIntro: {
    paddingHorizontal: 4,
    gap: 4,
  },
  sectionTitle: {
    fontFamily: fonts.headline,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "400",
  },
  sectionDescription: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  fieldLabel: {
    fontFamily: fonts.display,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600",
  },
  helperText: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
  },
  pickerList: {
    overflow: "hidden",
  },
  pickerHelper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  pickerItem: {
    minHeight: 52,
  },
  radioList: {
    marginHorizontal: -16,
  },
  switchRow: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  switchCopy: {
    flex: 1,
    gap: 3,
  },
  switchLabel: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 21,
  },
  accordionHeader: {
    minHeight: 52,
  },
  accordionBody: {
    flex: 0,
    width: "100%",
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
    gap: 10,
  },
  accordionPickerBody: {
    paddingHorizontal: 0,
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  responseModeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  responseModeItem: {
    gap: 4,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  responseModeItemFirst: {
    borderTopWidth: 0,
  },
  responseModeTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  compactButton: {
    minHeight: 34,
    borderRadius: 9,
    paddingHorizontal: 10,
  },
  buttonLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  buttonLabelText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "500",
  },
  diagnosticHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  diagnosticCard: {
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 3,
  },
  diagnosticCardFirst: {
    borderTopWidth: 0,
  },
  diagnosticMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  languageList: {
    marginHorizontal: -16,
  },
  fallbackRow: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  fallbackLabel: {
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
  iconButton: {
    width: 36,
    height: 34,
    borderRadius: 9,
    paddingHorizontal: 0,
  },
  previewBlock: {
    gap: 9,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  previewBlockFirst: {
    paddingTop: 0,
    borderTopWidth: 0,
  },
  previewHeader: {
    gap: 3,
  },
  previewButton: {
    minHeight: 42,
    borderRadius: 10,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  statusCopy: {
    flex: 1,
    gap: 2,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  providerHeader: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  providerIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  providerHeaderCopy: {
    flex: 1,
    gap: 5,
  },
  providerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  providerName: {
    flexShrink: 1,
    fontFamily: fonts.display,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "600",
  },
  capabilityRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  connectionPanel: {
    gap: 14,
    paddingHorizontal: 14,
    paddingBottom: 16,
  },
  onboardingCard: {
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    gap: 5,
  },
  inputLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },
  inputSuffix: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  validationList: {
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
  },
});
