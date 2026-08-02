import React from "react";
import type { SettingsReadiness } from "../settings-core/readiness";
import type { SettingsModalProps, SettingsPage } from "../settings-core/types";
import { useProviderValidationState } from "../settings-core/useProviderValidationState";
import { useSettingsController } from "../settings-core/useSettingsController";
import { Provider, TtsListenLanguage } from "../../types";
import { AntSettingsOverview } from "./AntSettingsOverview";
import { AppSettingsPage } from "./pages/AppSettingsPage";
import { ConnectionsSettingsPage } from "./pages/ConnectionsSettingsPage";
import { DataPrivacySettingsPage } from "./pages/DataPrivacySettingsPage";
import { ListeningSettingsPage } from "./pages/ListeningSettingsPage";
import { SearchSettingsPage } from "./pages/SearchSettingsPage";
import { SpeakingSettingsPage } from "./pages/SpeakingSettingsPage";
import { ThinkingSettingsPage } from "./pages/ThinkingSettingsPage";
import { OnDeviceSettingsPage } from "./pages/OnDeviceSettingsPage";
import { styles } from "./styles";
import { View } from "react-native";

interface AntSettingsPageContentProps {
  activePage: SettingsPage;
  controller: ReturnType<typeof useSettingsController>;
  onOpenPage: (page: SettingsPage) => void;
  onValidationStart: () => void;
  props: SettingsModalProps;
  readiness: SettingsReadiness;
  validation: ReturnType<typeof useProviderValidationState>;
}

function DrillInPage({
  children,
  page,
}: {
  children: React.ReactNode;
  page: Exclude<SettingsPage, "overview">;
}) {
  return (
    <View testID={`settings-page-${page}`} style={styles.drillInPage}>
      {children}
    </View>
  );
}

export function AntSettingsPageContent({
  activePage,
  controller,
  onOpenPage,
  onValidationStart,
  props,
  readiness,
  validation,
}: AntSettingsPageContentProps) {
  const {
    focusCatalogProviderId,
    focusProvider,
    kokoroModel,
    onAddResponseMode,
    onOpenSetupGuide,
    onRemoveResponseMode,
    onUpdate,
    onUpdateApiKey,
    onUpdateProviderSttModel,
    onUpdateProviderTtsModel,
    onUpdateProviderTtsVoice,
    onUpdateResponseModeRoute,
    providerVoiceDirectories,
    settings,
  } = props;

  switch (activePage) {
    case "overview":
      return (
        <AntSettingsOverview
          readiness={readiness}
          onOpenPage={onOpenPage}
          onOpenSetupGuide={onOpenSetupGuide}
        />
      );
    case "connections":
      return (
        <DrillInPage page="connections">
          <ConnectionsSettingsPage
            settings={settings}
            focusProvider={focusProvider}
            focusCatalogProviderId={focusCatalogProviderId}
            getProviderHealthState={validation.getHealthState}
            getProviderCapabilityHealthState={
              validation.getCapabilityHealthState
            }
            getProviderCircuitState={validation.getCircuitState}
            getProviderValidationState={validation.getValidationState}
            canValidateCapability={validation.canValidateCapability}
            onValidateCapability={async (provider, capability) => {
              onValidationStart();
              await validation.validateProviderCapabilityForSettings(
                provider,
                capability,
              );
            }}
            onValidateAll={async (provider) => {
              onValidationStart();
              await validation.validateAllProviderCapabilities(provider);
            }}
            onUpdateApiKey={onUpdateApiKey}
            onChangeSetupGuideShortcut={(visible) =>
              onUpdate({ showSetupGuideShortcut: visible })
            }
            onTextInputFocus={controller.handleTextInputFocus}
          />
        </DrillInPage>
      );
    case "thinking":
      return (
        <DrillInPage page="thinking">
          <ThinkingSettingsPage
            settings={settings}
            llmProviders={validation.selectableLlmProviders}
            onUpdate={onUpdate}
            onUpdateResponseModeRoute={onUpdateResponseModeRoute}
            onAddResponseMode={onAddResponseMode}
            onRemoveResponseMode={onRemoveResponseMode}
          />
        </DrillInPage>
      );
    case "listening":
      return (
        <DrillInPage page="listening">
          <ListeningSettingsPage
            settings={settings}
            selectableSttProviders={validation.selectableSttProviders}
            selectedSttProviderModelOptions={
              controller.selectedSttProviderModelOptions
            }
            selectedSttProviderModel={controller.selectedSttProviderModel}
            sttLanguageNote={controller.sttLanguageNote}
            sttLimitNote={controller.sttLimitNote}
            onUpdate={onUpdate}
            onUpdateProviderSttModel={onUpdateProviderSttModel}
          />
        </DrillInPage>
      );
    case "speaking":
      return (
        <DrillInPage page="speaking">
          <SpeakingSettingsPage
            settings={settings}
            kokoroModel={kokoroModel}
            selectableTtsProviders={validation.selectableTtsProviders}
            ttsLanguageNote={controller.ttsLanguageNote}
            selectedPreviewProvider={controller.selectedPreviewProvider}
            selectedPreviewProviderModelOptions={
              controller.selectedPreviewProviderModelOptions
            }
            selectedPreviewProviderModel={
              controller.selectedPreviewProviderModel
            }
            providerPreviewTexts={controller.providerPreviewTexts}
            activePreview={controller.activePreview}
            nativeVoiceOptions={controller.nativeVoiceOptions}
            selectedNativeVoice={controller.selectedNativeVoice}
            nativePreviewText={controller.nativePreviewText}
            kokoroPreviewTexts={controller.kokoroPreviewTexts}
            onUpdate={onUpdate}
            onUpdateProviderTtsModel={onUpdateProviderTtsModel}
            onUpdateProviderTtsVoice={onUpdateProviderTtsVoice}
            providerVoiceDirectories={providerVoiceDirectories}
            onStopPreviewVoice={controller.stopActivePreview}
            onSetProviderPreviewText={(
              provider: Provider,
              language: TtsListenLanguage,
              text: string,
            ) => controller.setProviderPreviewText(provider, language, text)}
            onSetNativePreviewText={controller.setNativePreviewText}
            onSetKokoroPreviewText={controller.setKokoroPreviewText}
            onPreviewProviderVoice={controller.handlePreviewProviderVoice}
            onPreviewNativeVoice={controller.handlePreviewNativeVoice}
            onPreviewKokoroVoice={controller.handlePreviewKokoroVoice}
            onSelectNativeVoice={controller.setSelectedNativeVoice}
            onTextInputFocus={controller.handleTextInputFocus}
            onToggleListenLanguage={controller.toggleListenLanguage}
          />
        </DrillInPage>
      );
    case "search":
      return (
        <DrillInPage page="search">
          <SearchSettingsPage
            settings={settings}
            searchProviders={validation.selectableSearchProviders}
            onUpdate={onUpdate}
          />
        </DrillInPage>
      );
    case "local":
      return (
        <DrillInPage page="local">
          <OnDeviceSettingsPage
            settings={settings}
            kokoroModel={kokoroModel}
            onUpdate={onUpdate}
            onPreviewVoice={props.onPreviewVoice}
          />
        </DrillInPage>
      );
    case "app":
      return (
        <DrillInPage page="app">
          <AppSettingsPage
            settings={settings}
            speechDiagnostics={controller.speechDiagnostics}
            onUpdate={onUpdate}
          />
        </DrillInPage>
      );
    case "data":
      return (
        <DrillInPage page="data">
          <DataPrivacySettingsPage
            onCreateAppDataBackup={props.onCreateAppDataBackup}
            onRestoreAppDataBackup={props.onRestoreAppDataBackup}
          />
        </DrillInPage>
      );
  }
}
