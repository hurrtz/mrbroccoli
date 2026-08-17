import React from "react";
import type { SettingsModalProps, SettingsPage } from "../settings-core/types";
import { useProviderValidationState } from "../settings-core/useProviderValidationState";
import { useSettingsController } from "../settings-core/useSettingsController";
import { useLocalModelSettings } from "../settings-core/useLocalModelSettings";
import { getSettingsReadiness } from "../settings-core/readiness";
import {
  PROVIDER_LLM_SUPPORT,
  PROVIDER_ORDER,
  PROVIDER_STT_SUPPORT,
  PROVIDER_TTS_SUPPORT,
} from "../../constants/models";
import { WEB_SEARCH_PROVIDER_IDS } from "../../constants/webSearch";
import { AntSettingsOverview } from "./AntSettingsOverview";
import { AppSettingsPage } from "./pages/AppSettingsPage";
import { ConnectionsSettingsPage } from "./pages/ConnectionsSettingsPage";
import { DataPrivacySettingsPage } from "./pages/DataPrivacySettingsPage";
import { ListeningSettingsPage } from "./pages/ListeningSettingsPage";
import { SearchSettingsPage } from "./pages/SearchSettingsPage";
import { SpeakingSettingsPage } from "./pages/SpeakingSettingsPage";
import { ThinkingSettingsPage } from "./pages/ThinkingSettingsPage";
import { styles } from "./styles";
import { View } from "react-native";

interface AntSettingsPageContentProps {
  activePage: SettingsPage;
  controller: ReturnType<typeof useSettingsController>;
  onOpenPage: (page: SettingsPage) => void;
  onValidationStart: () => void;
  props: SettingsModalProps;
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
  validation,
}: AntSettingsPageContentProps) {
  const {
    focusCatalogProviderId,
    focusProvider,
    kokoroModel,
    onAddResponseMode,
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
  const localModels = useLocalModelSettings({
    active:
      props.visible &&
      (activePage === "listening" ||
        activePage === "speaking" ||
        activePage === "data"),
    kokoroModel,
    onPreviewVoice: props.onPreviewVoice,
    onUpdate,
    settings,
  });

  switch (activePage) {
    case "overview":
      return (
        <AntSettingsOverview
          getProviderHealthState={validation.getHealthState}
          onOpenPage={onOpenPage}
          readiness={getSettingsReadiness(settings, {
            llmProviders: PROVIDER_ORDER.filter(
              (provider) => PROVIDER_LLM_SUPPORT[provider] === "provider",
            ),
            sttProviders: PROVIDER_ORDER.filter(
              (provider) => PROVIDER_STT_SUPPORT[provider] === "provider",
            ),
            ttsProviders: PROVIDER_ORDER.filter(
              (provider) => PROVIDER_TTS_SUPPORT[provider] === "provider",
            ),
            searchProviders: [...WEB_SEARCH_PROVIDER_IDS],
            kokoroInstalled: kokoroModel.installed,
          })}
          settings={settings}
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
            onTextInputFocus={controller.handleTextInputFocus}
          />
        </DrillInPage>
      );
    case "listening":
      return (
        <DrillInPage page="listening">
          <ListeningSettingsPage
            localModels={localModels}
            settings={settings}
            selectableSttProviders={validation.selectableSttProviders}
            selectedSttProviderModelOptions={
              controller.selectedSttProviderModelOptions
            }
            onUpdate={onUpdate}
            onUpdateProviderSttModel={onUpdateProviderSttModel}
          />
        </DrillInPage>
      );
    case "speaking":
      return (
        <DrillInPage page="speaking">
          <SpeakingSettingsPage
            activePreview={controller.activePreview}
            localModels={localModels}
            settings={settings}
            selectableTtsProviders={validation.selectableTtsProviders}
            onUpdate={onUpdate}
            onUpdateProviderTtsModel={onUpdateProviderTtsModel}
            onUpdateProviderTtsVoice={onUpdateProviderTtsVoice}
            providerVoiceDirectories={providerVoiceDirectories}
            onPreviewProviderVoice={controller.handlePreviewProviderVoice}
            onPreviewNativeVoice={controller.handlePreviewNativeVoice}
            onPreviewKokoroVoice={controller.handlePreviewKokoroVoice}
            onTextInputFocus={controller.handleTextInputFocus}
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
            archivedConversationCount={props.archivedConversationCount}
            localModels={localModels}
            settings={settings}
            onUpdate={onUpdate}
            onOpenArchivedConversations={props.onOpenArchivedConversations}
            conversationArchive={props.conversationArchive}
            onCreateAppDataBackup={props.onCreateAppDataBackup}
            onRestoreAppDataBackup={props.onRestoreAppDataBackup}
          />
        </DrillInPage>
      );
  }
}
