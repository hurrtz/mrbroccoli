import React from "react";
import {
  Modal as RNModal,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { act, fireEvent, waitFor, within } from "@testing-library/react-native";

import { MainScreen } from "../../src/screens/MainScreen";
import * as autoSetupJobModule from "../../src/screens/main/useAutoSetupJob";
import { DEFAULT_SETTINGS, type Settings } from "../../src/types";
import { getDefaultModelForProvider } from "../../src/utils/responseModes";
import { renderWithProviders } from "../test-utils/renderWithProviders";
import { createAutoSetupJob } from "../test-utils/autoSetupJobFixture";
import { LocalizationProvider } from "../../src/i18n";
import { ThemeProvider } from "../../src/theme/ThemeContext";

jest.mock("../../src/context/PremiumEntitlementContext", () => ({
  usePremiumEntitlement: jest.fn(() => ({
    busy: false,
    clearError: jest.fn(),
    displayPrice: null,
    error: null,
    isPremium: true,
    purchasePremium: jest.fn(async () => undefined),
    refreshPremium: jest.fn(async () => undefined),
    restorePremium: jest.fn(async () => undefined),
    status: "premium",
    storeConnected: true,
    storeProduct: null,
    storeProductLoading: false,
  })),
}));

jest.mock("react-native", () => {
  const actual = jest.requireActual("react-native");
  const mockedUseWindowDimensions = jest.fn(() => ({
    fontScale: 1,
    height: 932,
    scale: 3,
    width: 430,
  }));

  return new Proxy(actual, {
    get(target, property, receiver) {
      return property === "useWindowDimensions"
        ? mockedUseWindowDimensions
        : Reflect.get(target, property, receiver);
    },
  });
});

const mockUseWindowDimensions = jest.mocked(useWindowDimensions);

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({
    children,
    edges,
  }: {
    children: React.ReactNode;
    edges?: string[];
  }) => {
    const React = require("react");
    const { View } = require("react-native");
    return React.createElement(
      View,
      { testID: "main-safe-area", edges },
      children,
    );
  },
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("expo-status-bar", () => ({
  StatusBar: () => null,
}));

jest.mock("expo-clipboard", () => ({
  setStringAsync: jest.fn(async () => undefined),
}));

jest.mock("expo-file-system/legacy", () => ({
  cacheDirectory: "file:///tmp/",
  documentDirectory: "file:///tmp/",
  deleteAsync: jest.fn(async () => undefined),
  getInfoAsync: jest.fn(async () => ({ exists: false })),
  makeDirectoryAsync: jest.fn(async () => undefined),
  readAsStringAsync: jest.fn(async () => ""),
  writeAsStringAsync: jest.fn(async () => undefined),
}));

jest.mock("../../src/hooks/useKokoroModel", () => ({
  useKokoroModel: jest.fn(() => ({
    installed: false,
    verified: false,
    busy: null,
    phase: null,
    progress: 0,
    error: null,
    download: jest.fn(async () => true),
    refresh: jest.fn(async () => undefined),
    remove: jest.fn(async () => true),
  })),
}));

jest.mock("../../src/hooks/useStorePromoPresentation", () => ({
  useStorePromoPresentation: () => ({ loaded: true, scene: null }),
}));

jest.mock("../../src/context/SettingsContext", () => ({
  useSharedSettings: jest.fn(() => ({
    settings: require("../../src/types").DEFAULT_SETTINGS,
    updateSettings: jest.fn(),
    updateActiveResponseMode: jest.fn(),
    updateResponseModeRoute: jest.fn(),
    updateProviderSttModel: jest.fn(),
    updateProviderTtsModel: jest.fn(),
    updateProviderTtsVoice: jest.fn(),
    updateLocalTtsVoice: jest.fn(),
    updateApiKey: jest.fn(),
    updateProviderValidationResult: jest.fn(),
    loaded: true,
  })),
}));

jest.mock("../../src/hooks/useConversations", () => ({
  useConversations: jest.fn(() => ({
    conversations: [],
    activeConversation: null,
    createConversation: jest.fn(),
    selectConversation: jest.fn(),
    getConversationById: jest.fn(),
    addMessage: jest.fn(),
    updateMessage: jest.fn(),
    updateConversationContextSummary: jest.fn(),
    renameConversation: jest.fn(),
    toggleConversationPinned: jest.fn(),
    searchConversations: jest.fn(async () => []),
    deleteConversation: jest.fn(),
    clearActiveConversation: jest.fn(),
    captureActiveConversationSnapshot: jest.fn(),
    restoreActiveConversationSnapshot: jest.fn(),
  })),
}));

jest.mock("../../src/hooks/useConversationArchive", () => ({
  useConversationArchive: jest.fn(() => ({
    chooseDirectory: jest.fn(async () => undefined),
    configured: false,
    directoryName: null,
    disconnect: jest.fn(async () => undefined),
    error: null,
    lastSyncedAt: null,
    loaded: true,
    syncNow: jest.fn(async () => undefined),
    syncing: false,
  })),
}));

jest.mock("../../src/hooks/useProviderVoiceDirectory", () => ({
  useProviderVoiceDirectory: jest.fn(() => ({
    voices: [],
    status: "idle",
    error: null,
    refresh: jest.fn(async () => []),
  })),
}));

jest.mock("../../src/hooks/useAudioRecorder", () => ({
  useAudioRecorder: jest.fn(() => ({
    isRecording: false,
    waveformVariant: "bars",
  })),
}));

jest.mock("../../src/hooks/useNativeSpeechRecognizer", () => ({
  useNativeSpeechRecognizer: jest.fn(() => ({
    isRecording: false,
    waveformVariant: "bars",
  })),
}));

jest.mock("../../src/hooks/useAudioPlayer", () => ({
  useAudioPlayer: jest.fn(() => ({
    isPlaybackPaused: false,
    isPlaying: false,
    pausePlayback: jest.fn(async () => true),
    resumePlayback: jest.fn(async () => true),
    stopPlayback: jest.fn(async () => undefined),
  })),
}));

jest.mock("../../src/hooks/useVoicePipeline", () => ({
  useVoicePipeline: jest.fn(() => ({
    pipelinePhase: "idle",
    setPipelinePhase: jest.fn(),
    streamingText: "",
    setStreamingText: jest.fn(),
    abortRef: { current: null },
    lastCompletedReplyRef: { current: "" },
    replayPhase: "idle",
    activeReplayMessageId: null,
    handleRepeatLastReply: jest.fn(async () => undefined),
    playReplyText: jest.fn(async () => undefined),
    stopReplay: jest.fn(async () => undefined),
    handleVoiceCaptureDone: jest.fn(async () => undefined),
  })),
}));

jest.mock("../../src/services/llm", () => ({
  generateConversationTitle: jest.fn(async () => "Generated title"),
  validateProviderConnection: jest.fn(async () => undefined),
}));

jest.mock("../../src/services/webSearch", () => ({
  validateWebSearchConnection: jest.fn(async () => undefined),
}));

jest.mock("../../src/screens/main/MainScreenTopBar", () => ({
  MainScreenTopBar: ({
    onToggleDebugLog,
    onOpenDrawer,
    onOpenSettings,
  }: {
    onToggleDebugLog?: () => void;
    onOpenDrawer: () => void;
    onOpenSettings: () => void;
  }) => {
    const React = require("react");
    const { Text, TouchableOpacity, View } = require("react-native");
    const children = [];

    if (onToggleDebugLog) {
      children.push(
        React.createElement(
          TouchableOpacity,
          { key: "debug-log", onPress: onToggleDebugLog },
          React.createElement(Text, null, "toggle-debug-log"),
        ),
      );
    }

    children.push(
      React.createElement(
        TouchableOpacity,
        { key: "drawer", onPress: onOpenDrawer },
        React.createElement(Text, null, "open-drawer"),
      ),
      React.createElement(
        TouchableOpacity,
        { key: "settings", onPress: onOpenSettings },
        React.createElement(Text, null, "open-settings"),
      ),
    );

    return React.createElement(View, null, children);
  },
}));

jest.mock("../../src/screens/main/MainScreenRouteCard", () => ({
  MainScreenRouteCard: () => {
    const React = require("react");
    const { Text } = require("react-native");
    return React.createElement(Text, null, "route-card");
  },
}));

jest.mock("../../src/screens/main/MainScreenVoiceStage", () => ({
  MainScreenStatusStrip: () => {
    const React = require("react");
    const { Text } = require("react-native");
    return React.createElement(Text, null, "status-strip");
  },
  MainScreenVoiceStage: ({
    disabled,
    initialInputSurface,
    onAddImage,
    onResolvePromptBlock,
    promptBlockedActionEnabled,
    promptBlockedActionLabel,
    promptBlockedMessage,
  }: {
    disabled?: boolean;
    initialInputSurface?: string;
    onAddImage?: () => void;
    onResolvePromptBlock?: () => void;
    promptBlockedActionEnabled?: boolean;
    promptBlockedActionLabel?: string | null;
    promptBlockedMessage?: string | null;
  }) => {
    const React = require("react");
    const { Text, TouchableOpacity, View } = require("react-native");
    return React.createElement(
      View,
      null,
      React.createElement(
        Text,
        null,
        disabled ? "voice-stage:disabled" : "voice-stage:enabled",
      ),
      React.createElement(
        Text,
        null,
        `surface:${initialInputSurface ?? "voice"}`,
      ),
      onAddImage ? React.createElement(Text, null, "image-action") : null,
      promptBlockedMessage
        ? React.createElement(
            TouchableOpacity,
            {
              disabled: !promptBlockedActionEnabled,
              onPress: promptBlockedActionEnabled
                ? onResolvePromptBlock
                : undefined,
            },
            React.createElement(Text, null, promptBlockedMessage),
            promptBlockedActionEnabled
              ? React.createElement(Text, null, "resolve-prompt-block")
              : null,
          )
        : null,
      promptBlockedActionLabel
        ? React.createElement(
            Text,
            null,
            `prompt-blocked-action:${promptBlockedActionLabel}`,
          )
        : null,
    );
  },
}));

jest.mock("../../src/screens/main/TranscriptPreviewCard", () => ({
  TranscriptPreviewCard: ({
    onOpenSpeakingSettings,
    showWhenEmpty,
  }: {
    onOpenSpeakingSettings?: () => void;
    showWhenEmpty?: boolean;
  }) => {
    const React = require("react");
    const { Text, TouchableOpacity, View } = require("react-native");
    return React.createElement(
      View,
      { testID: "transcript-preview" },
      React.createElement(
        Text,
        null,
        showWhenEmpty
          ? "transcript-preview:empty-visible"
          : "transcript-preview",
      ),
      onOpenSpeakingSettings
        ? React.createElement(
            TouchableOpacity,
            {
              testID: "transcript-open-speaking-settings",
              onPress: onOpenSpeakingSettings,
            },
            React.createElement(Text, null, "transcript-speaking-settings"),
          )
        : null,
    );
  },
}));

jest.mock("../../src/screens/main/StatusDetailsModal", () => ({
  StatusDetailsModal: ({ visible }: { visible: boolean }) => {
    const React = require("react");
    const { Text } = require("react-native");
    return React.createElement(
      Text,
      null,
      visible ? "status:open" : "status:closed",
    );
  },
}));

jest.mock("../../src/features/settings/AntSettingsModal", () => ({
  AntSettingsModal: ({
    visible,
    suspended,
    onOpenPremium,
  }: {
    visible: boolean;
    suspended?: boolean;
    onOpenPremium: () => void;
  }) => {
    const React = require("react");
    const { Text, TouchableOpacity, View } = require("react-native");
    return React.createElement(
      View,
      null,
      React.createElement(
        Text,
        null,
        visible && !suspended ? "settings:open" : "settings:closed",
      ),
      visible && !suspended
        ? React.createElement(
            TouchableOpacity,
            { onPress: onOpenPremium },
            React.createElement(Text, null, "settings-upgrade-premium"),
          )
        : null,
    );
  },
}));

jest.mock("../../src/components/introFlow/IntroFlowScreen", () => ({
  IntroFlowScreen: ({
    visible,
    onConnectProvider,
  }: {
    visible: boolean;
    onConnectProvider: () => void;
  }) => {
    const React = require("react");
    const { Pressable, Text } = require("react-native");
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Text, null, visible ? "intro:open" : "intro:closed"),
      React.createElement(
        Pressable,
        { testID: "stub-intro-connect-provider", onPress: onConnectProvider },
        React.createElement(Text, null, "connect"),
      ),
    );
  },
}));

jest.mock("../../src/components/ConversationDrawer", () => ({
  ConversationDrawer: ({ visible }: { visible: boolean }) => {
    const React = require("react");
    const { Text } = require("react-native");
    return React.createElement(
      Text,
      null,
      visible ? "drawer:open" : "drawer:closed",
    );
  },
}));

jest.mock("../../src/components/Toast", () => ({
  Toast: () => null,
}));

jest.mock("../../src/screens/main/useProviderAvailabilityGuards", () => ({
  useProviderAvailabilityGuards: jest.fn(),
}));

jest.mock("../../src/screens/main/useVoiceSessionController", () => ({
  useVoiceSessionController: jest.fn(() => ({
    handlePressIn: jest.fn(),
    handlePressOut: jest.fn(),
    handleTogglePress: jest.fn(),
    resetVoiceSessionState: jest.fn(),
  })),
}));

jest.mock("../../src/screens/main/useConversationActions", () => ({
  useConversationActions: jest.fn(() => ({
    handleCopyMessage: jest.fn(),
    handleCopyThread: jest.fn(),
    handleShareThread: jest.fn(),
    handleShareMessage: jest.fn(),
    handleRenameThread: jest.fn(),
    handleTogglePinned: jest.fn(),
    handleSelectConversation: jest.fn(),
    handleStartNewSession: jest.fn(),
  })),
}));

jest.mock("../../src/screens/main/usePreviewVoiceController", () => ({
  usePreviewVoiceController: jest.fn(() => ({
    handlePreviewVoice: jest.fn(async () => undefined),
    stopPreviewVoice: jest.fn(async () => undefined),
  })),
}));

const { useSharedSettings } = jest.requireMock(
  "../../src/context/SettingsContext",
) as {
  useSharedSettings: jest.Mock;
};
const { useProviderVoiceDirectory } = jest.requireMock(
  "../../src/hooks/useProviderVoiceDirectory",
) as {
  useProviderVoiceDirectory: jest.Mock;
};
const { useKokoroModel } = jest.requireMock(
  "../../src/hooks/useKokoroModel",
) as {
  useKokoroModel: jest.Mock;
};
const { useVoicePipeline } = jest.requireMock(
  "../../src/hooks/useVoicePipeline",
) as {
  useVoicePipeline: jest.Mock;
};
const { usePremiumEntitlement } = jest.requireMock(
  "../../src/context/PremiumEntitlementContext",
) as {
  usePremiumEntitlement: jest.Mock;
};
const { useNativeSpeechRecognizer } = jest.requireMock(
  "../../src/hooks/useNativeSpeechRecognizer",
) as {
  useNativeSpeechRecognizer: jest.Mock;
};

function createSharedSettingsValue(settingsOverrides: Partial<Settings> = {}) {
  return {
    settings: {
      ...DEFAULT_SETTINGS,
      ...settingsOverrides,
    },
    updateSettings: jest.fn(),
    updateActiveResponseMode: jest.fn(),
    updateResponseModeRoute: jest.fn(),
    updateProviderSttModel: jest.fn(),
    updateProviderTtsModel: jest.fn(),
    updateProviderTtsVoice: jest.fn(),
    updateLocalTtsVoice: jest.fn(),
    updateApiKey: jest.fn(),
    updateProviderValidationResult: jest.fn(),
    loaded: true,
  };
}

describe("MainScreen", () => {
  beforeEach(() => {
    mockUseWindowDimensions.mockReturnValue({
      fontScale: 1,
      height: 932,
      scale: 3,
      width: 430,
    });
    useSharedSettings.mockReturnValue(createSharedSettingsValue());
    usePremiumEntitlement.mockReturnValue({
      busy: false,
      clearError: jest.fn(),
      displayPrice: null,
      error: null,
      isPremium: true,
      purchasePremium: jest.fn(async () => undefined),
      refreshPremium: jest.fn(async () => undefined),
      restorePremium: jest.fn(async () => undefined),
      status: "premium",
      storeConnected: true,
      storeProduct: null,
      storeProductLoading: false,
    });
    useProviderVoiceDirectory.mockReturnValue({
      voices: [],
      status: "idle",
      error: null,
      refresh: jest.fn(async () => []),
    });
    useKokoroModel.mockReturnValue({
      installed: false,
      verified: false,
      busy: null,
      phase: null,
      progress: 0,
      error: null,
      download: jest.fn(async () => true),
      refresh: jest.fn(async () => undefined),
      remove: jest.fn(async () => true),
    });
  });

  it("renders the shell with the route card", () => {
    const screen = renderWithProviders(<MainScreen />);
    const inputSection = within(screen.getByTestId("portrait-input-section"));

    expect(screen.getByText("route-card")).toBeTruthy();
    expect(screen.queryByTestId("route-web-search-container")).toBeNull();
    expect(inputSection.getByText("voice-stage:disabled")).toBeTruthy();
    expect(
      StyleSheet.flatten(
        screen.getByTestId("portrait-conversation-stack").props.style,
      ).marginTop,
    ).toBe(6);
    // The transcript demotes to a peeking handle; the full transcript opens
    // as a sheet over the workspace rather than living inline.
    expect(screen.getByTestId("transcript-handle")).toBeTruthy();
    expect(screen.queryByTestId("transcript-preview")).toBeNull();
    expect(screen.getByTestId("workspace-status-line")).toBeTruthy();
    expect(screen.getByText("settings:closed")).toBeTruthy();
    expect(screen.getByText("drawer:closed")).toBeTruthy();
    expect(screen.getByText("open-drawer")).toBeTruthy();
  });

  it("reports off-screen automatic setup completion in the task row", () => {
    let reportOutcome: ((outcome: "done" | "failed") => void) | undefined;
    const autoSetupSpy = jest
      .spyOn(autoSetupJobModule, "useAutoSetupJob")
      .mockImplementation((params) => {
        reportOutcome = params.onOutcome;
        return createAutoSetupJob({ fraction: 1, state: "done" });
      });

    try {
      const screen = renderWithProviders(<MainScreen />);
      expect(screen.queryByTestId("background-task-bar")).toBeNull();

      act(() => reportOutcome?.("done"));

      expect(screen.getByTestId("background-task-bar")).toBeTruthy();
      expect(screen.getByText("Ready")).toBeTruthy();
    } finally {
      autoSetupSpy.mockRestore();
    }
  });

  it("uses the effective profile language for local response generation", () => {
    useVoicePipeline.mockClear();
    useSharedSettings.mockReturnValue(
      createSharedSettingsValue({
        language: "de",
        localLanguages: ["de"],
        sttLanguage: "de",
        ttsListenLanguages: ["de"],
      }),
    );

    renderWithProviders(<MainScreen />, { language: "en" });

    expect(useVoicePipeline).toHaveBeenCalledWith(
      expect.objectContaining({ language: "de" }),
    );
  });

  it("hides the image action from Free users", () => {
    usePremiumEntitlement.mockReturnValue({
      busy: false,
      clearError: jest.fn(),
      displayPrice: null,
      error: null,
      isPremium: false,
      purchasePremium: jest.fn(async () => undefined),
      refreshPremium: jest.fn(async () => undefined),
      restorePremium: jest.fn(async () => undefined),
      status: "free",
      storeConnected: true,
      storeProduct: null,
      storeProductLoading: false,
    });
    useSharedSettings.mockReturnValue({
      ...createSharedSettingsValue(),
      loaded: false,
    });
    const screen = renderWithProviders(<MainScreen />);

    expect(screen.queryByText("image-action")).toBeNull();
  });

  it("leaves Web Search out entirely when its provider has no key", () => {
    // Shown greyed out it reads as a broken switch; the reason it cannot move
    // is in Settings, not on the workspace.
    useSharedSettings.mockReturnValue(
      createSharedSettingsValue({
        webSearchProvider: "openai",
      }),
    );

    const screen = renderWithProviders(<MainScreen />);

    expect(screen.queryByTestId("route-web-search-container")).toBeNull();
  });

  it("turns an active automatic web-search route off from the main switch", () => {
    const sharedSettings = createSharedSettingsValue({
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        openai: "provider-key",
      },
      webSearchMode: "on",
      webSearchProvider: "openai",
    });
    useSharedSettings.mockReturnValue(sharedSettings);
    const screen = renderWithProviders(<MainScreen />);
    const searchControl = screen.getByTestId("satellite-web");

    expect(searchControl.props.accessibilityState.checked).toBe(true);
    fireEvent.press(searchControl);

    expect(sharedSettings.updateSettings).toHaveBeenCalledWith({
      webSearchMode: "off",
    });
  });

  it("enables the voice stage when the active reply provider is configured", () => {
    useSharedSettings.mockReturnValue(
      createSharedSettingsValue({
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          [DEFAULT_SETTINGS.responseModes[0].route.provider]: "provider-key",
        },
      }),
    );

    const screen = renderWithProviders(<MainScreen />);

    expect(screen.getByText("voice-stage:enabled")).toBeTruthy();
  });

  it("blocks new prompts and links to Speaking settings when Kokoro is missing", () => {
    useSharedSettings.mockReturnValue(
      createSharedSettingsValue({
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          [DEFAULT_SETTINGS.responseModes[0].route.provider]: "provider-key",
        },
        spokenRepliesEnabled: true,
        ttsMode: "kokoro",
      }),
    );

    const screen = renderWithProviders(<MainScreen />);

    expect(screen.getByText("voice-stage:enabled")).toBeTruthy();
    expect(
      screen.getByText(
        "Download and verify the model before selecting or using Kokoro. No provider key is required.",
      ),
    ).toBeTruthy();

    fireEvent.press(screen.getByText("resolve-prompt-block"));
    expect(screen.getByText("settings:open")).toBeTruthy();
  });

  it("shows Kokoro installation progress while prompt submission stays blocked", () => {
    useKokoroModel.mockReturnValue({
      installed: false,
      verified: false,
      busy: "downloading",
      phase: "extracting",
      progress: 0.42,
      error: null,
      download: jest.fn(async () => true),
      refresh: jest.fn(async () => undefined),
      remove: jest.fn(async () => true),
    });
    useSharedSettings.mockReturnValue(
      createSharedSettingsValue({
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          [DEFAULT_SETTINGS.responseModes[0].route.provider]: "provider-key",
        },
        spokenRepliesEnabled: true,
        ttsMode: "kokoro",
      }),
    );

    const screen = renderWithProviders(<MainScreen />);

    expect(
      screen.getByText("prompt-blocked-action:Installing… 42%"),
    ).toBeTruthy();
  });

  it("loads Mistral voices from its configured key and selects a default slug", async () => {
    const sharedSettings = createSharedSettingsValue({
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        mistral: "mistral-key",
      },
      providerTtsVoices: {
        ...DEFAULT_SETTINGS.providerTtsVoices,
        mistral: "",
      },
    });
    useSharedSettings.mockReturnValue(sharedSettings);
    useProviderVoiceDirectory.mockImplementation(
      ({ provider }: { provider: string }) =>
        provider === "mistral"
          ? {
              voices: [
                {
                  id: "voice-1",
                  name: "Calm Guide",
                  slug: "calm-guide",
                  value: "calm-guide",
                  label: "Calm Guide · calm-guide",
                  languages: ["en"],
                  gender: null,
                  isCustom: false,
                },
              ],
              status: "ready",
              error: null,
              refresh: jest.fn(async () => []),
            }
          : {
              voices: [],
              status: "idle",
              error: null,
              refresh: jest.fn(async () => []),
            },
    );

    renderWithProviders(<MainScreen />);

    expect(useProviderVoiceDirectory).toHaveBeenCalledWith({
      provider: "mistral",
      apiKey: "mistral-key",
      enabled: true,
    });
    await waitFor(() => {
      expect(sharedSettings.updateProviderTtsVoice).toHaveBeenCalledWith(
        "mistral",
        "calm-guide",
      );
    });
  });

  it("opens settings and the session drawer from the top bar", () => {
    const screen = renderWithProviders(<MainScreen />);

    fireEvent.press(screen.getByText("open-settings"));
    fireEvent.press(screen.getByText("open-drawer"));

    expect(screen.getByText("settings:open")).toBeTruthy();
    expect(screen.queryByText("guided-setup-shortcut")).toBeNull();
    expect(screen.getByText("drawer:open")).toBeTruthy();
  });

  it("does not duplicate conversation settings inside the transcript sheet", () => {
    const screen = renderWithProviders(<MainScreen />);

    fireEvent.press(screen.getByTestId("transcript-handle"));
    expect(screen.queryByTestId("transcript-open-style")).toBeNull();
    expect(screen.queryByTestId("conversation-settings-header")).toBeNull();
  });

  it("dismisses the transcript sheet before opening Speaking settings", () => {
    const screen = renderWithProviders(<MainScreen />);

    fireEvent.press(screen.getByTestId("transcript-handle"));
    const transcriptModal = screen
      .UNSAFE_getAllByType(RNModal)
      .find((modal) => typeof modal.props.onDismiss === "function");
    expect(transcriptModal).toBeDefined();

    fireEvent.press(screen.getByTestId("transcript-open-speaking-settings"));
    expect(screen.getByText("settings:closed")).toBeTruthy();

    act(() => {
      transcriptModal?.props.onDismiss();
    });

    expect(screen.getByText("settings:open")).toBeTruthy();
  });

  it("returns to Settings after presenting the Premium purchase", () => {
    const screen = renderWithProviders(<MainScreen />);

    fireEvent.press(screen.getByText("open-settings"));
    fireEvent.press(screen.getByText("settings-upgrade-premium"));

    expect(screen.getByText("settings:closed")).toBeTruthy();
    expect(screen.getByText("Unlock Premium")).toBeTruthy();

    fireEvent.press(screen.getByText("Done"));
    expect(screen.getByText("settings:open")).toBeTruthy();
  });

  it("opens the purchase sheet over the introduction without closing it", () => {
    // Provider keys are Premium, so the provider route leads to the purchase.
    // Backing out of that purchase has to leave the reader where they were,
    // rather than costing them the introduction they were part-way through.
    usePremiumEntitlement.mockReturnValue({
      busy: false,
      clearError: jest.fn(),
      displayPrice: null,
      error: null,
      isPremium: false,
      purchasePremium: jest.fn(async () => undefined),
      refreshPremium: jest.fn(async () => undefined),
      restorePremium: jest.fn(async () => undefined),
      status: "free",
      storeConnected: true,
      storeProduct: null,
      storeProductLoading: false,
    });
    const screen = renderWithProviders(<MainScreen />);

    fireEvent.press(screen.getByTestId("intro-banner"));
    expect(screen.getByText("intro:open")).toBeTruthy();

    fireEvent.press(screen.getByTestId("stub-intro-connect-provider"));

    expect(screen.getByText("Unlock Premium")).toBeTruthy();
    expect(screen.getByText("intro:open")).toBeTruthy();

    fireEvent.press(screen.getByText("Done"));
    expect(screen.getByText("intro:open")).toBeTruthy();
  });

  it("does not treat entitlement resolving at launch as a purchase", () => {
    // Entitlement arrives asynchronously, so an owner's launch goes free ->
    // premium with no sheet in sight. Reading that as a purchase dismissed the
    // banner on every launch and wrote settings mid-mount.
    const updateSettings = jest.fn();
    usePremiumEntitlement.mockReturnValue({
      busy: false,
      clearError: jest.fn(),
      displayPrice: null,
      error: null,
      isPremium: false,
      purchasePremium: jest.fn(async () => undefined),
      refreshPremium: jest.fn(async () => undefined),
      restorePremium: jest.fn(async () => undefined),
      status: "free",
      storeConnected: true,
      storeProduct: null,
      storeProductLoading: false,
    });
    useSharedSettings.mockReturnValue({
      ...createSharedSettingsValue(),
      updateSettings,
    });
    const screen = renderWithProviders(<MainScreen />);

    usePremiumEntitlement.mockReturnValue({
      busy: false,
      clearError: jest.fn(),
      displayPrice: null,
      error: null,
      isPremium: true,
      purchasePremium: jest.fn(async () => undefined),
      refreshPremium: jest.fn(async () => undefined),
      restorePremium: jest.fn(async () => undefined),
      status: "premium",
      storeConnected: true,
      storeProduct: null,
      storeProductLoading: false,
    });
    screen.rerender(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <MainScreen />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    expect(updateSettings).not.toHaveBeenCalledWith(
      expect.objectContaining({ introDismissed: true }),
    );
  });

  it("keeps the orb visible when no route is usable", () => {
    // The explicit setup notice explains the state; the stable primary
    // affordance must not turn into a legacy composer at startup.
    useNativeSpeechRecognizer.mockReturnValue({
      isAvailable: true,
      isRecording: false,
      waveformVariant: "bars",
    });
    const screen = renderWithProviders(<MainScreen />);

    expect(screen.getByText("voice-stage:disabled")).toBeTruthy();
    expect(screen.getByText("surface:voice")).toBeTruthy();
    expect(
      screen.getByText(
        "Add credentials in Settings before starting a voice session.",
      ),
    ).toBeTruthy();
    expect(
      screen.getByText("prompt-blocked-action:Configure credentials"),
    ).toBeTruthy();
  });

  it("hides the debug log action by default", () => {
    const screen = renderWithProviders(<MainScreen />);

    expect(screen.queryByText("toggle-debug-log")).toBeNull();
  });

  it("renders the debug log action when enabled in app settings", () => {
    useSharedSettings.mockReturnValue(
      createSharedSettingsValue({ showDebugLogButton: true }),
    );

    const screen = renderWithProviders(<MainScreen />);

    expect(screen.getByText("toggle-debug-log")).toBeTruthy();
  });

  it("hides the conversation style control when no provider is configured", () => {
    const screen = renderWithProviders(<MainScreen />);

    expect(screen.queryByText("transcript-style-control")).toBeNull();
    expect(screen.getByText("route-card")).toBeTruthy();
  });

  it("states the conversation's quick settings as one line with its control", () => {
    const provider = DEFAULT_SETTINGS.responseModes[0].route.provider;
    const route = {
      provider,
      model: getDefaultModelForProvider(provider),
    };

    useSharedSettings.mockReturnValue(
      createSharedSettingsValue({
        responseModes: [{ id: "mode-1", route }],
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          [provider]: "provider-key",
        },
      }),
    );

    const screen = renderWithProviders(<MainScreen />);

    expect(screen.getByText("route-card")).toBeTruthy();
    expect(screen.getByTestId("conversation-settings-summary")).toBeTruthy();
    expect(
      screen.getByText("Professional · Normal · System voice"),
    ).toBeTruthy();
    expect(
      screen.getByTestId("conversation-settings-summary-control").props
        .accessibilityLabel,
    ).toBe("Open conversation settings");
  });

  it("uses the balanced two-pane landscape hierarchy", () => {
    const provider = DEFAULT_SETTINGS.responseModes[0].route.provider;
    const route = {
      provider,
      model: getDefaultModelForProvider(provider),
    };
    mockUseWindowDimensions.mockReturnValue({
      fontScale: 1,
      height: 430,
      scale: 3,
      width: 932,
    });
    useSharedSettings.mockReturnValue(
      createSharedSettingsValue({
        responseModes: [{ id: "mode-1", route }],
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          [provider]: "provider-key",
        },
        showDebugLogButton: true,
        webSearchProvider: "openai",
      }),
    );

    const screen = renderWithProviders(<MainScreen />);
    const leftPane = within(screen.getByTestId("landscape-left-pane"));
    const rightPane = within(screen.getByTestId("landscape-right-pane"));

    expect(screen.getByTestId("main-safe-area").props.edges).toEqual(["top"]);
    expect(
      StyleSheet.flatten(screen.getByTestId("landscape-left-pane").props.style)
        .flex,
    ).toBe(0.9);
    expect(screen.getByTestId("landscape-pane-divider")).toBeTruthy();
    expect(
      leftPane.getByTestId("satellite-web").props.accessibilityState,
    ).toEqual({ checked: false, disabled: false });
    expect(leftPane.queryByTestId("route-style-control")).toBeNull();
    expect(leftPane.queryByText("status-strip")).toBeNull();
    expect(leftPane.queryByText("toggle-debug-log")).toBeNull();
    expect(screen.queryByTestId("landscape-status-area")).toBeNull();
    expect(leftPane.queryByTestId("conversation-settings-summary")).toBeNull();
    expect(leftPane.queryByTestId("satellite-image")).toBeNull();
    expect(
      StyleSheet.flatten(
        rightPane.getByTestId("intro-banner-surface").props.style,
      ),
    ).toEqual(expect.objectContaining({ minHeight: 48 }));
    expect(rightPane.getByTestId("transcript-preview")).toBeTruthy();
    expect(rightPane.queryByText("transcript-style-control")).toBeNull();
  });
});
