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
  const handleOpenPremium = React.useCallback(
    () => props.onOpenPremium(activePage),
    [activePage, props],
  );
  const localModels = useLocalModelSettings({
    active:
      props.visible &&
      (activePage === "thinking" ||
        activePage === "listening" ||
        activePage === "speaking" ||
        activePage === "data"),
    isPremium: props.isPremium,
    kokoroModel,
    onPreviewVoice: props.onPreviewVoice,
    onUpdate,
    settings,
    storePromoPreview: props.storePromoLocalDevicePreview,
  });

  switch (activePage) {
    case "overview":
      return (
        <AntSettingsOverview
          getProviderHealthState={validation.getHealthState}
          isPremium={props.isPremium}
          onOpenPage={onOpenPage}
          onOpenPremium={handleOpenPremium}
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
            isPremium={props.isPremium}
            onOpenPremium={handleOpenPremium}
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
            allLlmProviders={PROVIDER_ORDER.filter(
              (provider) => PROVIDER_LLM_SUPPORT[provider] === "provider",
            )}
            isPremium={props.isPremium}
            localModels={localModels}
            settings={settings}
            llmProviders={
              props.storePromoLocalDevicePreview
                ? ["openai", "anthropic", "gemini"]
                : validation.selectableLlmProviders
            }
            onUpdate={onUpdate}
            onUpdateResponseModeRoute={onUpdateResponseModeRoute}
            onAddResponseMode={onAddResponseMode}
            onOpenPremium={handleOpenPremium}
            onRemoveResponseMode={onRemoveResponseMode}
            onTextInputFocus={controller.handleTextInputFocus}
          />
        </DrillInPage>
      );
    case "listening":
      return (
        <DrillInPage page="listening">
          <ListeningSettingsPage
            allSttProviders={PROVIDER_ORDER.filter(
              (provider) => PROVIDER_STT_SUPPORT[provider] === "provider",
            )}
            isPremium={props.isPremium}
            localModels={localModels}
            onOpenPremium={handleOpenPremium}
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
            allTtsProviders={PROVIDER_ORDER.filter(
              (provider) => PROVIDER_TTS_SUPPORT[provider] === "provider",
            )}
            isPremium={props.isPremium}
            localModels={localModels}
            onOpenPremium={handleOpenPremium}
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
            allSearchProviders={WEB_SEARCH_PROVIDER_IDS}
            isPremium={props.isPremium}
            onOpenPremium={handleOpenPremium}
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
            autoSetup={props.autoSetup}
            developmentEntitlementMode={props.developmentEntitlementMode}
            settings={settings}
            speechDiagnostics={controller.speechDiagnostics}
            onSetDevelopmentEntitlementMode={
              props.onSetDevelopmentEntitlementMode
            }
            onUpdate={onUpdate}
          />
        </DrillInPage>
      );
    case "data":
      return (
        <DrillInPage page="data">
          <DataPrivacySettingsPage
            archivedConversationCount={props.archivedConversationCount}
            isPremium={props.isPremium}
            localModels={localModels}
            settings={settings}
            onUpdate={onUpdate}
            onOpenPremium={handleOpenPremium}
            onOpenArchivedConversations={props.onOpenArchivedConversations}
            conversationArchive={props.conversationArchive}
            onCreateAppDataBackup={props.onCreateAppDataBackup}
            onRestoreAppDataBackup={props.onRestoreAppDataBackup}
          />
        </DrillInPage>
      );
  }
}
