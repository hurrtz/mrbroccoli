import React from "react";
import {
  Animated,
  Modal,
  Platform,
  useWindowDimensions,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getSettingsReadiness } from "../settings-core/readiness";
import type {
  SettingsModalProps,
  SettingsPage,
} from "../settings-core/types";
import { useProviderValidationState } from "../settings-core/useProviderValidationState";
import { useSettingsController } from "../settings-core/useSettingsController";
import { useLocalization } from "../../i18n";
import {
  Provider,
  ProviderCapability,
  ProviderValidationResult,
} from "../../types";

import { AntSettingsPageContent } from "./AntSettingsPageContent";
import { AntSettingsFrame } from "./AntSettingsFrame";

type DrillInSettingsPage = Exclude<SettingsPage, "overview">;

function getInitialSettingsPage({
  focusProvider,
  focusCatalogProviderId,
  focusTab,
}: Pick<
  SettingsModalProps,
  "focusProvider" | "focusCatalogProviderId" | "focusTab"
>): SettingsPage {
  if (focusProvider || focusCatalogProviderId || focusTab === "providers") {
    return "connections";
  }
  if (focusTab === "instructions") {
    return "thinking";
  }
  if (focusTab === "stt") {
    return "listening";
  }
  if (focusTab === "tts") {
    return "speaking";
  }
  if (focusTab === "web") {
    return "search";
  }
  if (focusTab === "ui") {
    return "app";
  }
  return "overview";
}

export const AntSettingsModal = React.memo(function AntSettingsModal(
  props: SettingsModalProps,
) {
  const {
    visible,
    settings,
    kokoroModel,
    focusProvider,
    focusCatalogProviderId,
    focusTab,
    onUpdate,
    onPreviewVoice,
    onStopPreviewVoice,
    onValidateProviderCapability,
    onClose,
  } = props;
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const isLandscape = width > height;
  const modalMaxWidth = isLandscape ? Math.min(width - 24, 980) : width;
  const entrance = React.useRef(new Animated.Value(0)).current;
  const [activePage, setActivePage] = React.useState<SettingsPage>(() =>
    getInitialSettingsPage({
      focusProvider,
      focusCatalogProviderId,
      focusTab,
    }),
  );
  const [validationToastMessage, setValidationToastMessage] = React.useState<
    string | null
  >(null);
  const controller = useSettingsController({
    visible,
    settings,
    onUpdate,
    onPreviewVoice,
    onStopPreviewVoice,
  });
  const handleProviderValidationResult = React.useCallback(
    (
      provider: Provider,
      capability: ProviderCapability,
      result: ProviderValidationResult,
    ) => {
      onUpdate({
        providerValidationResults: {
          ...settings.providerValidationResults,
          [provider]: {
            ...settings.providerValidationResults[provider],
            [capability]: result,
          },
        },
      });
    },
    [onUpdate, settings.providerValidationResults],
  );
  const validation = useProviderValidationState({
    settings,
    onValidateProviderCapability,
    onValidationError: setValidationToastMessage,
    onValidationResult: handleProviderValidationResult,
  });
  const readiness = React.useMemo(
    () =>
      getSettingsReadiness(settings, {
        llmProviders: validation.selectableLlmProviders,
        sttProviders: validation.selectableSttProviders,
        ttsProviders: validation.selectableTtsProviders,
        searchProviders: validation.selectableSearchProviders,
        kokoroInstalled: kokoroModel.installed,
      }),
    [
      kokoroModel.installed,
      validation.selectableLlmProviders,
      validation.selectableSearchProviders,
      validation.selectableSttProviders,
      validation.selectableTtsProviders,
      settings,
    ],
  );

  React.useEffect(() => {
    if (!visible) {
      entrance.setValue(0);
      return;
    }

    setActivePage(
      getInitialSettingsPage({
        focusProvider,
        focusCatalogProviderId,
        focusTab,
      }),
    );
    Animated.timing(entrance, {
      toValue: 1,
      duration: 190,
      useNativeDriver: true,
    }).start();
  }, [
    entrance,
    focusCatalogProviderId,
    focusProvider,
    focusTab,
    visible,
  ]);

  React.useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => {
        controller.contentScrollRef.current?.scrollTo({
          y: 0,
          animated: false,
        });
      });
    }
  }, [activePage, controller.contentScrollRef, visible]);

  const getPageTitle = React.useCallback(
    (page: DrillInSettingsPage) => {
      switch (page) {
        case "connections":
          return t("settingsConnections");
        case "thinking":
          return t("settingsThinking");
        case "listening":
          return t("settingsListening");
        case "speaking":
          return t("settingsSpeaking");
        case "search":
          return t("settingsSearch");
        case "app":
          return t("settingsAppDiagnostics");
      }
    },
    [t],
  );

  const activeContent = (
    <AntSettingsPageContent
      activePage={activePage}
      controller={controller}
      onOpenPage={setActivePage}
      onValidationStart={() => setValidationToastMessage(null)}
      props={props}
      readiness={readiness}
      validation={validation}
    />
  );

  const title =
    activePage === "overview" ? t("settings") : getPageTitle(activePage);

  const handleBack = React.useCallback(() => {
    if (activePage !== "overview") {
      setActivePage("overview");
      return;
    }
    onClose();
  }, [activePage, onClose]);

  if (!visible) {
    return null;
  }

  const frame = (
    <AntSettingsFrame
      activePage={activePage}
      contentScrollRef={controller.contentScrollRef}
      entrance={entrance}
      insets={insets}
      isLandscape={isLandscape}
      keyboardInset={controller.keyboardInset}
      modalMaxWidth={modalMaxWidth}
      onBack={handleBack}
      onClose={onClose}
      onDismissValidationToast={() => setValidationToastMessage(null)}
      title={title}
      validationToastMessage={validationToastMessage}
    >
      {activeContent}
    </AntSettingsFrame>
  );

  if (Platform.OS !== "android") {
    return frame;
  }

  return (
    <Modal
      animationType="none"
      hardwareAccelerated
      navigationBarTranslucent
      onRequestClose={handleBack}
      statusBarTranslucent
      transparent
      visible
    >
      {frame}
    </Modal>
  );
});
