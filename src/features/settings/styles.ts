import { StyleSheet } from "react-native";

import { fonts, textStyles } from "../../theme/typography";

export const styles = StyleSheet.create({
  pressedControl: {
    opacity: 0.68,
    transform: [{ scale: 0.985 }],
  },
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
  overview: {
    gap: 16,
  },
  setupCard: {
    overflow: "hidden",
  },
  setupCardBody: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
  },
  readinessStepLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  readinessStep: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  readinessStepTrack: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  readinessStepLine: {
    flex: 1,
    height: 2,
  },
  readinessStepCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionCards: {
    gap: 10,
  },
  sectionIcon: {
    width: 34,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  pageStack: {
    gap: 16,
  },
  sectionPageStack: {
    gap: 24,
  },
  sectionGroup: {
    gap: 10,
  },
  card: {
    overflow: "hidden",
    paddingBottom: 0,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  cardHeader: {
    minHeight: 50,
    marginLeft: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cardHeaderContent: {
    flex: 1,
  },
  cardHeaderExtra: {
    flex: 0,
  },
  cardTitle: {
    fontFamily: fonts.display,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600",
  },
  cardFooter: {
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  cardFooterWrap: {
    paddingHorizontal: 16,
  },
  cardFooterActions: {
    alignItems: "flex-end",
  },
  disclosureHeader: {
    flex: 1,
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  disclosureHeaderContent: {
    flex: 1,
  },
  disclosureHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  disclosureToggle: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
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
  sectionIntroHeader: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  sectionIntroTitle: {
    flex: 1,
  },
  sectionIntroActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "600",
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
    paddingTop: 2,
    paddingBottom: 12,
    gap: 4,
  },
  pickerItem: {
    minHeight: 46,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  pickerItemStandalone: {
    marginHorizontal: 0,
  },
  pickerStaticItem: {
    minHeight: 52,
  },
  pickerValueRow: {
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
  },
  pickerValue: {
    flexShrink: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 21,
    textAlign: "right",
  },
  radioList: {
    overflow: "hidden",
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
  numberInputRow: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  numberInput: {
    width: 82,
    minHeight: 42,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 21,
    textAlign: "right",
  },
  warningText: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  compactButton: {
    minHeight: 34,
    borderRadius: 9,
    paddingHorizontal: 10,
  },
  addModelButton: {
    alignSelf: "flex-start",
    marginTop: 2,
  },
  fullWidthField: {
    width: "100%",
  },
  infoModalScroll: {
    maxHeight: 360,
  },
  infoModalContent: {
    paddingBottom: 2,
    gap: 12,
  },
  infoModalOption: {
    gap: 3,
  },
  infoModalOptionLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
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
  diagnosticCard: {
    gap: 3,
  },
  diagnosticMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  fallbackRow: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
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
  previewButton: {
    minHeight: 42,
    borderRadius: 10,
  },
  previewFieldHeader: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
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
  kokoroDownloadButton: {
    alignSelf: "flex-start",
    minHeight: 40,
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  kokoroFallbackNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
  },
  kokoroFallbackCopy: {
    flex: 1,
  },
  kokoroVoiceCards: {
    gap: 10,
  },
  voiceDisclosureHeader: {
    flex: 1,
    gap: 2,
  },
  disclosurePreview: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 16,
  },
  providerHeader: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  providerIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  providerName: {
    flex: 1,
    flexShrink: 1,
    fontFamily: fonts.display,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "600",
  },
  capabilityRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },
  capabilityTag: {
    position: "relative",
    flexDirection: "row",
    overflow: "visible",
  },
  capabilityTagBody: {
    height: 25,
    justifyContent: "center",
    borderRadius: 3,
    borderWidth: 0.5,
    paddingHorizontal: 15,
  },
  capabilityTagText: {
    fontFamily: fonts.body,
    fontSize: 12,
    textAlign: "center",
  },
  providerCards: {
    gap: 12,
  },
  providerHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  providerHeaderAction: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  connectionPanel: {
    gap: 20,
  },
  connectionSection: {
    gap: 8,
  },
  connectionSectionHeader: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  connectionSectionTitle: {
    fontFamily: fonts.display,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
  },
  connectionBodyText: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "400",
  },
  connectionImprintText: {
    ...textStyles.caption,
  },
  connectionFullBleed: {
    marginHorizontal: -16,
  },
  inputSuffix: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  validationList: {
    overflow: "hidden",
  },
  validationAction: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  providerAboutModal: {
    flex: 1,
  },
  providerAboutHeader: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  providerAboutTitle: {
    flex: 1,
    fontFamily: fonts.display,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600",
  },
  providerAboutScroll: {
    flex: 1,
  },
  providerAboutContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
    gap: 14,
  },
  providerAboutText: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
  },
});
