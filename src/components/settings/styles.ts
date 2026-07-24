import { StyleSheet } from "react-native";

import { textStyles } from "../../theme/typography";

import {
  SETTINGS_HEADER_BOTTOM_PADDING,
  SETTINGS_HEADER_CONTROL_SIZE,
  SETTINGS_HEADER_TOP_PADDING,
} from "./constants";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 0,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modal: {
    width: "100%",
    maxWidth: 460,
    flex: 1,
    borderRadius: 0,
    borderWidth: 0,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  header: {
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    paddingHorizontal: 18,
    paddingTop: SETTINGS_HEADER_TOP_PADDING,
    paddingBottom: SETTINGS_HEADER_BOTTOM_PADDING,
    borderBottomWidth: 1,
  },
  headerLeading: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerBackButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  title: {
    ...textStyles.screenTitle,
  },
  closeButton: {
    width: SETTINGS_HEADER_CONTROL_SIZE,
    height: SETTINGS_HEADER_CONTROL_SIZE,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
  },
  tabButtonText: {
    ...textStyles.compactAction,
  },
  contentScroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 20,
    gap: 14,
  },
  contentLandscape: {
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  tabPane: {
    gap: 14,
  },
  tabIntroText: {
    ...textStyles.supporting,
    marginBottom: 2,
  },
  sectionCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  sectionLabel: {
    ...textStyles.subsectionTitle,
    marginBottom: 12,
  },
  sectionIntro: {
    ...textStyles.supporting,
    marginTop: -2,
    marginBottom: 14,
  },
  settingsSectionHeader: {
    gap: 6,
    marginBottom: 14,
  },
  settingsSectionTitle: {
    ...textStyles.sectionTitle,
  },
  settingsSectionDescription: {
    ...textStyles.body,
  },
  sectionHint: {
    ...textStyles.supporting,
    marginTop: 10,
  },
  responseModeList: {
    marginBottom: 14,
  },
  responseModesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  responseModesHeaderLabel: {
    marginBottom: 0,
  },
  responseModeHeaderButton: {
    minHeight: 32,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  responseModeHeaderButtonText: {
    ...textStyles.compactAction,
  },
  responseModeItem: {
    paddingBottom: 10,
    paddingTop: 14,
  },
  responseModeHeaderRow: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  responseModeTitle: {
    ...textStyles.subsectionTitle,
  },
  responseModeRemoveButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  responseModePicker: {
    marginBottom: 10,
  },
  responseModePickerLast: {
    marginBottom: 0,
  },
  filterChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  filterChip: {
    minHeight: 34,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  filterChipText: {
    ...textStyles.compactAction,
  },
  providerVaultList: {
    gap: 10,
  },
  providerVaultRow: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  providerVaultHeader: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  providerVaultHeaderCopy: {
    flex: 1,
  },
  providerVaultHeaderMain: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  providerVaultIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  providerVaultLabelBlock: {
    flex: 1,
    gap: 8,
  },
  providerVaultTitle: {
    ...textStyles.subsectionTitle,
  },
  providerCapabilityRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  providerCapabilityPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  providerCapabilityPillText: {
    ...textStyles.controlLabel,
    fontSize: 10,
    lineHeight: 14,
  },
  providerVaultHeaderMeta: {
    alignItems: "flex-end",
    gap: 10,
  },
  providerStatusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  providerStatusIconPill: {
    width: 30,
    height: 30,
    justifyContent: "center",
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  providerStatusText: {
    ...textStyles.controlLabel,
    fontSize: 10,
    lineHeight: 14,
  },
  providerVaultExpanded: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 10,
  },
  providerVaultActionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  providerVaultActionButton: {
    minHeight: 40,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  providerVaultActionButtonText: {
    ...textStyles.compactAction,
  },
  inlineAccordion: {
    gap: 8,
  },
  inlineAccordionButton: {
    minHeight: 44,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inlineAccordionTitle: {
    ...textStyles.subsectionTitle,
  },
  inlineAccordionBody: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 6,
  },
  inlineAccordionList: {
    gap: 4,
    marginTop: 4,
  },
  inlineSwitchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    marginBottom: 12,
  },
  inlineSwitchCopy: {
    flex: 1,
  },
  webSearchProviderPicker: {
    marginTop: 24,
  },
  settingsSubsectionIntro: {
    gap: 4,
    marginTop: 2,
    marginBottom: 12,
  },
  settingsSubsectionStack: {
    gap: 12,
    marginBottom: 18,
  },
  settingsSubsectionCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  setupChecklistCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
  },
  setupChecklistHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  setupChecklistStatusPill: {
    marginTop: 0,
  },
  setupChecklistHint: {
    marginTop: 0,
  },
  setupChecklistList: {
    marginTop: 12,
    gap: 10,
  },
  setupChecklistItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  setupChecklistIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  setupChecklistCopy: {
    flex: 1,
    gap: 2,
  },
  setupChecklistLabel: {
    ...textStyles.supporting,
  },
  setupChecklistState: {
    ...textStyles.controlLabel,
  },
  readinessCard: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  readinessGrid: {
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 6,
  },
  readinessPill: {
    flex: 1,
    minWidth: 0,
    minHeight: 32,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  readinessPillTitle: {
    ...textStyles.compactAction,
    flexShrink: 1,
    minWidth: 0,
    fontSize: 11,
    lineHeight: 14,
  },
  overviewRowList: {
    gap: 8,
  },
  setupGuideRow: {
    minHeight: 68,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  overviewRow: {
    minHeight: 66,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  overviewRowIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  overviewRowCopy: {
    flex: 1,
    gap: 3,
  },
  overviewRowTitle: {
    ...textStyles.subsectionTitle,
  },
  overviewRowSummary: {
    ...textStyles.supporting,
  },
  drillInHeader: {
    marginBottom: 2,
  },
  drillInBackButton: {
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  drillInSummary: {
    ...textStyles.supporting,
  },
  apiKeyInputRow: {
    position: "relative",
    justifyContent: "center",
  },
  apiKeyInput: {
    ...textStyles.body,
    minHeight: 48,
    width: "100%",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingRight: 54,
    paddingVertical: 12,
  },
  apiKeyVisibilityButton: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  validationCard: {
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  validationText: {
    ...textStyles.supporting,
  },
  promptCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
  },
  promptLabel: {
    ...textStyles.controlLabel,
    marginBottom: 10,
  },
  promptInput: {
    ...textStyles.body,
    minHeight: 132,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    textAlignVertical: "top",
  },
  previewCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginTop: 8,
  },
  previewLabel: {
    ...textStyles.controlLabel,
    marginBottom: 10,
  },
  previewInput: {
    ...textStyles.body,
    minHeight: 92,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    textAlignVertical: "top",
  },
  previewHint: {
    ...textStyles.supporting,
    marginTop: 10,
  },
  previewButton: {
    marginTop: 14,
    borderRadius: 12,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowOpacity: 0,
  },
  previewButtonDisabled: {
    opacity: 0.55,
  },
  previewButtonBusy: {
    opacity: 0.82,
  },
  previewButtonText: {
    ...textStyles.action,
    color: "#F4F8FF",
  },
  groupLabel: {
    ...textStyles.subsectionTitle,
    marginBottom: 8,
  },
  languageChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  languageChip: {
    minHeight: 38,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  languageChipText: {
    ...textStyles.compactAction,
  },
  localPackCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginTop: 10,
  },
  voicePreviewSection: {
    borderTopWidth: 1,
    paddingTop: 20,
    marginTop: 4,
  },
  voicePreviewHeader: {
    marginBottom: 18,
  },
  voicePreviewHeaderHint: {
    marginTop: 0,
  },
  voicePreviewProvider: {
    ...textStyles.sectionTitle,
    marginBottom: 16,
  },
  providerVoiceDirectoryHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  providerVoiceDirectoryCopy: {
    flex: 1,
    minWidth: 0,
  },
  providerVoiceRefreshButton: {
    minHeight: 34,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  providerVoiceRefreshLabel: {
    ...textStyles.compactAction,
  },
  previewLanguageBlock: {
    borderTopWidth: 1,
    marginTop: 4,
    paddingTop: 18,
    paddingBottom: 4,
  },
  localPackHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  localPackCopy: {
    flex: 1,
  },
  localPackVoicePicker: {
    marginTop: 14,
  },
  localPackPreview: {
    marginTop: 14,
  },
  localPackButton: {
    minHeight: 42,
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  localPackButtonText: {
    ...textStyles.compactAction,
    color: "#F4F8FF",
  },
  speechDiagnosticHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  speechDiagnosticClear: {
    ...textStyles.controlLabel,
  },
  radioRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  radioButtonWrap: {
    width: "50%",
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  radioButton: {
    minHeight: 46,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  radioButtonActive: {
    shadowOpacity: 0,
  },
  radioLabel: {
    ...textStyles.action,
    textAlign: "center",
  },
});
