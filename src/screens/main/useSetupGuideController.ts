import { useCallback, useEffect, useMemo, useState } from "react";

import type { SettingsTab } from "../../components/settings/types";
import { PROVIDER_LABELS } from "../../constants/models";
import type { useAudioPlayer } from "../../hooks/useAudioPlayer";
import type { useAudioRecorder } from "../../hooks/useAudioRecorder";
import type { useNativeSpeechRecognizer } from "../../hooks/useNativeSpeechRecognizer";
import { useLocalization } from "../../i18n";
import { validateProviderConnection } from "../../services/llm";
import type {
  Provider,
  ProviderValidationResult,
  Settings,
} from "../../types";
import { hasProviderCredentialForCapability } from "../../utils/providerCredentials";

import {
  buildSetupGuideResponseModes,
  getCurrentSetupGuideValidationState,
  getSetupGuideInitialProvider,
  getSetupGuideProviderOptions,
  getSetupGuideValidationModel,
  resolveSetupGuideRoutes,
  type SetupGuideStep,
  type SetupGuideValidationState,
} from "./setupGuideSupport";
import { useSetupGuideVoiceTest } from "./useSetupGuideVoiceTest";

interface UseSetupGuideControllerParams {
  loaded: boolean;
  openSettings: (focusProvider?: Provider, focusTab?: SettingsTab) => void;
  setSetupGuideVisible: (visible: boolean) => void;
  setupGuideVisible: boolean;
  setupGuideDismissed: boolean;
  settings: Settings;
  updateSettings: (partial: Partial<Settings>) => void;
  updateApiKey: (provider: Provider, apiKey: string) => void;
  player: ReturnType<typeof useAudioPlayer>;
  recorder: ReturnType<typeof useAudioRecorder>;
  nativeStt: ReturnType<typeof useNativeSpeechRecognizer>;
}

export function useSetupGuideController({
  loaded,
  nativeStt,
  openSettings,
  player,
  recorder,
  setSetupGuideVisible,
  setupGuideVisible,
  setupGuideDismissed,
  settings,
  updateApiKey,
  updateSettings,
}: UseSetupGuideControllerParams) {
  const { t } = useLocalization();
  const providerOptions = useMemo(() => getSetupGuideProviderOptions(), []);
  const [step, setStep] = useState<SetupGuideStep>("intro");
  const [openedFromSettings, setOpenedFromSettings] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null,
  );
  const [validationState, setValidationState] = useState<SetupGuideValidationState>(
    {
      status: "idle",
    },
  );

  useEffect(() => {
    if (!loaded || setupGuideDismissed) {
      return;
    }

    setSelectedProvider(null);
    setStep("intro");
    setOpenedFromSettings(false);
    setSetupGuideVisible(true);
  }, [loaded, setSetupGuideVisible, setupGuideDismissed]);

  const routeProvider = selectedProvider ?? getSetupGuideInitialProvider(settings);
  const selectedProviderApiKey = selectedProvider
    ? settings.apiKeys[selectedProvider].trim()
    : "";
  const selectedProviderModel = selectedProvider
    ? getSetupGuideValidationModel(selectedProvider)
    : "";
  const currentValidationState = useMemo(
    () => {
      if (!selectedProvider) {
        if (validationState.status === "error" && !validationState.provider) {
          return validationState;
        }

        return { status: "idle" } satisfies SetupGuideValidationState;
      }

      return getCurrentSetupGuideValidationState({
        provider: selectedProvider,
        apiKey: selectedProviderApiKey,
        model: selectedProviderModel,
        validationState,
      });
    },
    [selectedProvider, selectedProviderApiKey, selectedProviderModel, validationState],
  );
  const resolvedRoutes = useMemo(
    () =>
      resolveSetupGuideRoutes({
        provider: routeProvider,
        settings,
        systemSttAvailable: nativeStt.isAvailable,
      }),
    [nativeStt.isAvailable, routeProvider, settings],
  );

  const voiceTest = useSetupGuideVoiceTest({
    visible: setupGuideVisible,
    settings,
    routes: resolvedRoutes,
    provider: routeProvider,
    player,
    recorder,
    nativeStt,
    t,
  });

  const closeGuide = useCallback(
    async (markDismissed: boolean) => {
      await voiceTest.reset(true);
      setSetupGuideVisible(false);
      setStep("intro");
      setSelectedProvider(null);
      setOpenedFromSettings(false);

      if (markDismissed) {
        updateSettings({ setupGuideDismissed: true });
      }
    },
    [setSetupGuideVisible, updateSettings, voiceTest],
  );

  const handleOpenSetupGuide = useCallback(
    (
      nextStep: SetupGuideStep = "provider",
      source: "settings" | "app" = "app",
    ) => {
      setValidationState({ status: "idle" });
      setSelectedProvider(null);
      setStep(nextStep);
      setOpenedFromSettings(source === "settings");
      setSetupGuideVisible(true);
      void voiceTest.reset(true);
    },
    [setSetupGuideVisible, voiceTest],
  );

  const handleDismissSetupGuide = useCallback(() => {
    void closeGuide(true);
  }, [closeGuide]);

  const handleBack = useCallback(() => {
    if (step === "provider") {
      setStep("intro");
      return;
    }

    if (step === "voice-test") {
      void voiceTest.reset(false);
      setStep("provider");
      return;
    }

    if (step === "summary") {
      setStep("voice-test");
    }
  }, [step, voiceTest]);

  const handleContinueFromIntro = useCallback(() => {
    setStep("provider");
  }, []);

  const handleSelectProvider = useCallback(
    (provider: Provider | null) => {
      setSelectedProvider(provider);
    },
    [],
  );

  const handleProviderApiKeyChange = useCallback(
    (value: string) => {
      if (!selectedProvider) {
        return;
      }

      updateApiKey(selectedProvider, value);
    },
    [selectedProvider, updateApiKey],
  );

  const handleValidateProviderKey = useCallback(async () => {
    if (!selectedProvider) {
      setValidationState({
        status: "error",
        message: t("setupGuideProviderAndApiKeyRequiredOrCancel"),
      });
      return false;
    }

    if (!selectedProviderApiKey) {
      setValidationState({
        status: "error",
        provider: selectedProvider,
        apiKey: selectedProviderApiKey,
        model: selectedProviderModel,
        message: t("setupGuideApiKeyRequiredOrCancel"),
      });
      return false;
    }

    if (
      !hasProviderCredentialForCapability(
        selectedProvider,
        selectedProviderApiKey,
        "llm",
      )
    ) {
      setValidationState({
        status: "error",
        provider: selectedProvider,
        apiKey: selectedProviderApiKey,
        model: selectedProviderModel,
        message: t("setupGuideProviderKeyNeedsLlmAccess", {
          provider: PROVIDER_LABELS[selectedProvider],
        }),
      });
      return false;
    }

    setValidationState({
      status: "validating",
      provider: selectedProvider,
      apiKey: selectedProviderApiKey,
      model: selectedProviderModel,
    });

    try {
      await validateProviderConnection({
        provider: selectedProvider,
        model: selectedProviderModel,
        apiKey: selectedProviderApiKey,
        language: settings.language,
      });

      const message = t("providerValidationSuccess", {
        provider: PROVIDER_LABELS[selectedProvider],
      });
      const result: ProviderValidationResult = {
        status: "success",
        message,
        model: selectedProviderModel,
      };

      setValidationState({
        status: "success",
        provider: selectedProvider,
        apiKey: selectedProviderApiKey,
        model: selectedProviderModel,
        message,
      });
      updateSettings({
        providerValidationResults: {
          ...settings.providerValidationResults,
          [selectedProvider]: {
            ...settings.providerValidationResults[selectedProvider],
            llm: result,
          },
        },
      });
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t("providerValidationFailed");
      const result: ProviderValidationResult = {
        status: "error",
        message,
        model: selectedProviderModel,
      };

      setValidationState({
        status: "error",
        provider: selectedProvider,
        apiKey: selectedProviderApiKey,
        model: selectedProviderModel,
        message,
      });
      updateSettings({
        providerValidationResults: {
          ...settings.providerValidationResults,
          [selectedProvider]: {
            ...settings.providerValidationResults[selectedProvider],
            llm: result,
          },
        },
      });
      return false;
    }
  }, [
    selectedProvider,
    selectedProviderApiKey,
    selectedProviderModel,
    settings.language,
    settings.providerValidationResults,
    t,
    updateSettings,
  ]);

  const handleContinueFromProvider = useCallback(() => {
    if (currentValidationState.status !== "success") {
      return;
    }

    setStep("voice-test");
  }, [currentValidationState.status]);

  const handleContinueFromVoiceTest = useCallback(() => {
    setStep("summary");
  }, []);

  const handleFinishSetupGuide = useCallback(async () => {
    if (!selectedProvider) {
      return;
    }

    const responseModes = buildSetupGuideResponseModes(selectedProvider);

    updateSettings({
      activeResponseMode: responseModes[0].id,
      responseModes,
      setupGuideDismissed: true,
      lastProvider: selectedProvider,
      spokenRepliesEnabled: resolvedRoutes.tts.enabled,
      sttMode: resolvedRoutes.stt.kind === "provider" ? "provider" : "native",
      sttProvider:
        resolvedRoutes.stt.kind === "provider" ? selectedProvider : null,
      ...(resolvedRoutes.tts.kind === "provider"
        ? {
            ttsMode: "provider" as const,
            ttsProvider: selectedProvider,
          }
        : {}),
      webSearchMode: "off",
      webSearchProvider: resolvedRoutes.webSearch.provider,
    });

    await closeGuide(false);
  }, [closeGuide, resolvedRoutes, selectedProvider, updateSettings]);

  const handleOpenSettingsFromSummary = useCallback(async () => {
    if (!selectedProvider) {
      return;
    }

    const focusTab: SettingsTab =
      !resolvedRoutes.stt.enabled
        ? "stt"
        : !resolvedRoutes.tts.enabled
          ? "tts"
          : "providers";

    await closeGuide(true);
    openSettings(selectedProvider, focusTab);
  }, [closeGuide, openSettings, resolvedRoutes.stt.enabled, resolvedRoutes.tts.enabled, selectedProvider]);

  return {
    step,
    openedFromSettings,
    providerOptions,
    selectedProvider,
    selectedProviderApiKey,
    currentValidationState,
    resolvedRoutes,
    voiceTest,
    handleOpenSetupGuide,
    handleDismissSetupGuide,
    handleBack,
    handleContinueFromIntro,
    handleSelectProvider,
    handleProviderApiKeyChange,
    handleValidateProviderKey,
    handleContinueFromProvider,
    handleContinueFromVoiceTest,
    handleFinishSetupGuide,
    handleOpenSettingsFromSummary,
  };
}
