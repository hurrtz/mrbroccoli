import React from "react";
import {
  isPremiumSettingsPage,
  type SettingsModalProps,
  type SettingsPage,
} from "../settings-core/types";
import { useProviderValidationState } from "../settings-core/useProviderValidationState";
import { useSettingsController } from "../settings-core/useSettingsController";
import { getSettingsReadiness } from "../settings-core/readiness";
import { Provider, TtsListenLanguage } from "../../types";
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
import { OnDeviceSettingsPage } from "./pages/OnDeviceSettingsPage";
import { styles } from "./styles";
import { Text, View } from "react-native";
import { Button } from "../../design-system/NativeControls";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import { fonts } from "../../theme/typography";
import { AntSettingsCard } from "./AntSettingsPrimitives";

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

function LockedSettingsPage({
  onOpenPremium,
  page,
}: {
  onOpenPremium: () => void;
  page: Exclude<SettingsPage, "overview">;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  return (
    <DrillInPage page={page}>
      <AntSettingsCard>
        <Text
          style={{
            color: colors.textSecondary,
            fontFamily: fonts.body,
            fontSize: 15,
            lineHeight: 22,
          }}
        >
          {t("premiumDescription")}
        </Text>
        <Button type="primary" onPress={onOpenPremium}>
          <Text
            style={{
              color: colors.onActiveControl,
              fontFamily: fonts.bodyMedium,
            }}
          >
            {t("upgradeToPremium")}
          </Text>
        </Button>
      </AntSettingsCard>
    </DrillInPage>
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

  if (
    !props.isPremium &&
    activePage !== "overview" &&
    isPremiumSettingsPage(activePage)
  ) {
    return (
      <LockedSettingsPage
        onOpenPremium={props.onOpenPremium}
        page={activePage}
      />
    );
  }

  switch (activePage) {
    case "overview":
      return (
        <AntSettingsOverview
          isPremium={props.isPremium}
          onOpenPage={onOpenPage}
          onOpenPremium={props.onOpenPremium}
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
            llmProviders={
              props.storePromoLocalDevicePreview
                ? ["openai", "anthropic", "gemini"]
                : validation.selectableLlmProviders
            }
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
            autoSetup={props.autoSetup}
            settings={settings}
            isPremium={props.isPremium}
            kokoroModel={kokoroModel}
            storePromoPreview={props.storePromoLocalDevicePreview === true}
            onUpdate={onUpdate}
            onPreviewVoice={props.onPreviewVoice}
          />
        </DrillInPage>
      );
    case "app":
      return (
        <DrillInPage page="app">
          <AppSettingsPage
            isPremium={props.isPremium}
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
            isPremium={props.isPremium}
            settings={settings}
            onUpdate={onUpdate}
            onOpenPremium={props.onOpenPremium}
            conversationArchive={props.conversationArchive}
            onCreateAppDataBackup={props.onCreateAppDataBackup}
            onRestoreAppDataBackup={props.onRestoreAppDataBackup}
          />
        </DrillInPage>
      );
  }
}
