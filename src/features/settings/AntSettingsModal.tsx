import React from "react";
import { Animated, Modal, Platform, useWindowDimensions } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { SettingsModalProps, SettingsPage } from "../settings-core/types";
import { useProviderValidationState } from "../settings-core/useProviderValidationState";
import { useSettingsController } from "../settings-core/useSettingsController";
import { useLocalization } from "../../i18n";
import { recordDebugLogEvent } from "../../services/debugLogCapture";
import {
  Provider,
  ProviderCapability,
  ProviderValidationResult,
} from "../../types";

import { AntSettingsPageContent } from "./AntSettingsPageContent";
import { AntSettingsFrame } from "./AntSettingsFrame";

type DrillInSettingsPage = Exclude<SettingsPage, "overview">;

function getInitialSettingsPage({
  focusPage,
  focusProvider,
  focusCatalogProviderId,
  focusTab,
}: Pick<
  SettingsModalProps,
  "focusPage" | "focusProvider" | "focusCatalogProviderId" | "focusTab"
>): SettingsPage {
  if (focusPage) {
    return focusPage;
  }
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
    suspended = false,
    settings,
    focusProvider,
    focusCatalogProviderId,
    focusTab,
    focusPage,
    onPreviewVoice,
    onStopPreviewVoice,
    onValidateProviderCapability,
    onUpdateProviderValidationResult,
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
      focusPage,
      focusProvider,
      focusCatalogProviderId,
      focusTab,
    }),
  );
  const [validationToastMessage, setValidationToastMessage] = React.useState<
    string | null
  >(null);
  const diagnosticProps = React.useMemo<SettingsModalProps>(
    () => ({
      ...props,
      onUpdate: (partial) => {
        recordDebugLogEvent({
          event: "settings-values-updated",
          payload: { fields: Object.keys(partial).sort() },
        });
        props.onUpdate(partial);
      },
      onUpdateApiKey: (provider, apiKey) => {
        recordDebugLogEvent({
          event: "settings-provider-credential-updated",
          payload: { configured: apiKey.trim().length > 0, provider },
        });
        props.onUpdateApiKey(provider, apiKey);
      },
      onUpdateProviderSttModel: (provider, model) => {
        recordDebugLogEvent({
          event: "settings-provider-model-updated",
          payload: { capability: "stt", model, provider },
        });
        props.onUpdateProviderSttModel(provider, model);
      },
      onUpdateProviderTtsModel: (provider, model) => {
        recordDebugLogEvent({
          event: "settings-provider-model-updated",
          payload: { capability: "tts", model, provider },
        });
        props.onUpdateProviderTtsModel(provider, model);
      },
      onUpdateProviderTtsVoice: (provider, voice) => {
        recordDebugLogEvent({
          event: "settings-provider-voice-updated",
          payload: { configured: voice.trim().length > 0, provider },
        });
        props.onUpdateProviderTtsVoice(provider, voice);
      },
    }),
    [props],
  );
  const controller = useSettingsController({
    visible,
    settings,
    onUpdate: diagnosticProps.onUpdate,
    onPreviewVoice,
    onStopPreviewVoice,
  });
  const handleProviderValidationResult = React.useCallback(
    (
      provider: Provider,
      capability: ProviderCapability,
      result: ProviderValidationResult,
    ) => {
      recordDebugLogEvent({
        event: "settings-provider-validation-persisted",
        payload: { capability, provider, status: result.status },
      });
      onUpdateProviderValidationResult(provider, capability, result);
    },
    [onUpdateProviderValidationResult],
  );
  const validation = useProviderValidationState({
    settings,
    onValidateProviderCapability,
    onValidationError: setValidationToastMessage,
    onValidationResult: handleProviderValidationResult,
  });
  React.useEffect(() => {
    if (!visible) {
      entrance.setValue(0);
      return;
    }

    setActivePage(
      getInitialSettingsPage({
        focusPage,
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
    focusPage,
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

  React.useEffect(() => {
    if (visible) {
      recordDebugLogEvent({
        event: "settings-page-presented",
        payload: { page: activePage },
      });
    }
  }, [activePage, visible]);

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
        case "data":
          return t("settingsDataPrivacy");
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
      onOpenPage={(page) => {
        recordDebugLogEvent({
          event: "settings-page-open-requested",
          payload: { from: activePage, to: page },
        });
        setActivePage(page);
      }}
      onValidationStart={() => setValidationToastMessage(null)}
      props={diagnosticProps}
      validation={validation}
    />
  );

  const title =
    activePage === "overview" ? t("settings") : getPageTitle(activePage);

  const handleBack = React.useCallback(() => {
    recordDebugLogEvent({
      event: "settings-back-requested",
      payload: { page: activePage },
    });
    if (activePage !== "overview") {
      setActivePage("overview");
      return;
    }
    onClose();
  }, [activePage, onClose]);

  if (!visible || suspended) {
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
      onDismiss={props.onDismiss}
      onRequestClose={handleBack}
      statusBarTranslucent
      transparent
      visible
    >
      {frame}
    </Modal>
  );
});
