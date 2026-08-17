import React from "react";
import {
  Modal as RNModal,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { act, fireEvent, waitFor, within } from "@testing-library/react-native";

import { MainScreen } from "../../src/screens/MainScreen";
import { DEFAULT_SETTINGS, type Settings } from "../../src/types";
import { getDefaultModelForProvider } from "../../src/utils/responseModes";
import { renderWithProviders } from "../test-utils/renderWithProviders";
import { LocalizationProvider } from "../../src/i18n";
import { ThemeProvider } from "../../src/theme/ThemeContext";

let mockDrawerArchivedRevealRequests: number[] = [];
let mockIsPad = false;
let mockPipelinePhase: "idle" | "thinking" = "idle";
const mockVerifySessionPassword = jest.fn(
  async (_conversationId: string, _password: string) => false,
);

jest.mock("../../src/services/sessionLock", () => ({
  canUnlockSessionWithDeviceAuth: jest.fn(async () => false),
  clearSessionLock: jest.fn(async () => undefined),
  createSessionLock: jest.fn(async () => ({ deviceAuthEnabled: false })),
  unlockSessionWithDeviceAuth: jest.fn(async () => false),
  verifySessionPassword: (conversationId: string, password: string) =>
    mockVerifySessionPassword(conversationId, password),
}));

jest.mock("react-native", () => {
  const actual = jest.requireActual("react-native");
  const mockedUseWindowDimensions = jest.fn(() => ({
    fontScale: 1,
    height: 932,
    scale: 3,
    width: 430,
  }));
  const mockedPlatform = new Proxy(actual.Platform, {
    get(target, property, receiver) {
      return property === "isPad"
        ? mockIsPad
        : Reflect.get(target, property, receiver);
    },
  });

  return new Proxy(actual, {
    get(target, property, receiver) {
      if (property === "useWindowDimensions") {
        return mockedUseWindowDimensions;
      }
      if (property === "Platform") {
        return mockedPlatform;
      }
      return Reflect.get(target, property, receiver);
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

jest.mock("expo-speech-recognition", () => ({
  ExpoSpeechRecognitionModule: {},
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
  useStorePromoPresentation: jest.fn(() => ({ loaded: true, scene: null })),
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
    grantConversationAccess: jest.fn(),
    updateConversationLocked: jest.fn(async () => true),
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
    canSeekParagraph: false,
    isPlaybackPaused: false,
    isPlaying: false,
    pausePlayback: jest.fn(async () => true),
    readingProgress: null,
    readingProgressTiming: null,
    resumePlayback: jest.fn(async () => true),
    seekParagraph: jest.fn(async () => undefined),
    stopPlayback: jest.fn(async () => undefined),
  })),
}));

jest.mock("../../src/hooks/useVoicePipeline", () => ({
  useVoicePipeline: jest.fn(() => ({
    pipelinePhase: mockPipelinePhase,
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
  MainScreenRouteCard: ({
    presentation,
    settingsSummary,
  }: {
    presentation?: string;
    settingsSummary?: {
      accessibilityLabel: string;
      onPress: () => void;
      summary: string;
    };
  }) => {
    const React = require("react");
    const { Text, TouchableOpacity, View } = require("react-native");
    return React.createElement(
      View,
      null,
      React.createElement(Text, null, "route-card"),
      presentation === "workspace-header" && settingsSummary
        ? React.createElement(
            View,
            { testID: "conversation-settings-summary" },
            React.createElement(Text, null, settingsSummary.summary),
            React.createElement(TouchableOpacity, {
              accessibilityLabel: settingsSummary.accessibilityLabel,
              onPress: settingsSummary.onPress,
              testID: "conversation-settings-summary-control",
            }),
          )
        : null,
    );
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
    footer,
    initialInputSurface,
    isActive,
    onAddImage,
    onResolvePromptBlock,
    promptBlockedActionEnabled,
    promptBlockedActionLabel,
    promptBlockedMessage,
  }: {
    disabled?: boolean;
    footer?: React.ReactNode;
    initialInputSurface?: string;
    isActive?: boolean;
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
        isActive ? "voice-stage:active" : "voice-stage:inactive",
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
      footer,
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

jest.mock("../../src/features/settings/AntSettingsModal", () => ({
  AntSettingsModal: ({
    visible,
    suspended,
    onClose,
    onDismiss,
    onOpenArchivedConversations,
  }: {
    visible: boolean;
    suspended?: boolean;
    onClose: () => void;
    onDismiss: () => void;
    onOpenArchivedConversations: () => void;
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
            React.Fragment,
            null,
            React.createElement(
              TouchableOpacity,
              {
                onPress: onOpenArchivedConversations,
                testID: "stub-settings-open-archived",
              },
              React.createElement(Text, null, "settings-open-archived"),
            ),
            React.createElement(
              TouchableOpacity,
              { onPress: onClose, testID: "stub-settings-close" },
              React.createElement(Text, null, "settings-close"),
            ),
          )
        : null,
      React.createElement(
        TouchableOpacity,
        { onPress: onDismiss, testID: "stub-settings-dismiss" },
        React.createElement(Text, null, "settings-dismiss"),
      ),
    );
  },
}));

jest.mock("../../src/components/ConversationDrawer", () => ({
  ConversationDrawer: ({
    archivedRevealRequestId,
    onArchivedRevealHandled,
    onOpenSettings,
    onUnlockSession,
    presentation = "modal",
    toast,
    visible,
  }: {
    archivedRevealRequestId?: number | null;
    onArchivedRevealHandled?: (requestId: number) => void;
    onOpenSettings?: () => void;
    onUnlockSession?: (
      id: string,
      method: "password",
      password: string,
    ) => Promise<boolean>;
    presentation?: "modal" | "sidebar";
    toast?: { message: string } | null;
    visible: boolean;
  }) => {
    const React = require("react");
    const { Text, TouchableOpacity } = require("react-native");
    React.useEffect(() => {
      if (archivedRevealRequestId == null) {
        return;
      }
      mockDrawerArchivedRevealRequests.push(archivedRevealRequestId);
      onArchivedRevealHandled?.(archivedRevealRequestId);
    }, [archivedRevealRequestId, onArchivedRevealHandled]);
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        Text,
        { testID: `drawer-${presentation}` },
        presentation === "sidebar"
          ? "drawer:sidebar"
          : visible
            ? "drawer:open"
            : "drawer:closed",
      ),
      presentation === "sidebar" && onOpenSettings
        ? React.createElement(
            TouchableOpacity,
            { onPress: onOpenSettings, testID: "stub-sidebar-open-settings" },
            React.createElement(Text, null, "sidebar-open-settings"),
          )
        : null,
      onUnlockSession
        ? React.createElement(
            TouchableOpacity,
            {
              onPress: () =>
                void onUnlockSession("locked", "password", "wrong"),
              testID: "stub-unlock-locked-session",
            },
            React.createElement(Text, null, "unlock-locked-session"),
          )
        : null,
      toast?.message
        ? React.createElement(Text, { testID: "drawer-toast" }, toast.message)
        : null,
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
const { useNativeSpeechRecognizer } = jest.requireMock(
  "../../src/hooks/useNativeSpeechRecognizer",
) as {
  useNativeSpeechRecognizer: jest.Mock;
};
const { useStorePromoPresentation } = jest.requireMock(
  "../../src/hooks/useStorePromoPresentation",
) as {
  useStorePromoPresentation: jest.Mock;
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
    mockDrawerArchivedRevealRequests = [];
    mockIsPad = false;
    mockPipelinePhase = "idle";
    mockVerifySessionPassword.mockReset();
    mockVerifySessionPassword.mockResolvedValue(false);
    mockUseWindowDimensions.mockReturnValue({
      fontScale: 1,
      height: 932,
      scale: 3,
      width: 430,
    });
    useSharedSettings.mockReturnValue(createSharedSettingsValue());
    useStorePromoPresentation.mockReturnValue({ loaded: true, scene: null });
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
    expect(screen.queryByTestId("workspace-status-line")).toBeNull();
    expect(screen.getByText("settings:closed")).toBeTruthy();
    expect(screen.getByText("drawer:closed")).toBeTruthy();
    expect(screen.getByText("open-drawer")).toBeTruthy();
  });

  it("uses the configured app language for response generation", () => {
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

  it("reports that failed session authentication did not load the session", async () => {
    const screen = renderWithProviders(<MainScreen />);

    fireEvent.press(screen.getByTestId("stub-unlock-locked-session"));

    await waitFor(() => {
      expect(mockVerifySessionPassword).toHaveBeenCalledWith("locked", "wrong");
      expect(screen.getByTestId("drawer-toast").props.children).toBe(
        "The session was not unlocked, so it was not loaded.",
      );
    });
  });

  it("exposes the exact hydrated locale marker used by store captures", () => {
    const screen = renderWithProviders(<MainScreen />, { language: "en" });

    expect(screen.getByTestId("app-locale-en")).toBeTruthy();
    screen.rerender(
      <ThemeProvider mode="light">
        <LocalizationProvider language="ar">
          <MainScreen />
        </LocalizationProvider>
      </ThemeProvider>,
    );
    expect(screen.getByTestId("app-locale-ar")).toBeTruthy();
    expect(screen.queryByTestId("app-locale-en")).toBeNull();
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
      screen.getByText("Normal · Professional · System voice"),
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
    // Landscape keeps the settings control, floated over the stage as an icon.
    expect(leftPane.getByTestId("conversation-settings-summary")).toBeTruthy();
    expect(leftPane.queryByTestId("satellite-image")).toBeNull();
    expect(rightPane.getByTestId("transcript-preview")).toBeTruthy();
    expect(rightPane.queryByText("transcript-style-control")).toBeNull();
  });

  it("composes a persistent sidebar and docked transcript on a wide iPad", () => {
    const provider = DEFAULT_SETTINGS.responseModes[0].route.provider;
    const route = {
      provider,
      model: getDefaultModelForProvider(provider),
    };
    mockIsPad = true;
    mockUseWindowDimensions.mockReturnValue({
      fontScale: 1,
      height: 820,
      scale: 2,
      width: 1180,
    });
    useSharedSettings.mockReturnValue(
      createSharedSettingsValue({
        responseModes: [{ id: "mode-1", route }],
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          [provider]: "provider-key",
        },
      }),
    );

    const screen = renderWithProviders(<MainScreen />, { language: "ar" });

    expect(screen.getByTestId("ipad-regular-shell")).toBeTruthy();
    expect(
      StyleSheet.flatten(screen.getByTestId("ipad-regular-shell").props.style),
    ).toEqual(expect.objectContaining({ flexDirection: "row" }));
    expect(screen.getByText("drawer:sidebar")).toBeTruthy();
    expect(screen.queryByTestId("drawer-modal")).toBeNull();
    expect(screen.queryByText("open-drawer")).toBeNull();
    expect(screen.getByTestId("ipad-transcript-pane")).toBeTruthy();
    expect(screen.queryByTestId("transcript-handle")).toBeNull();
    expect(screen.getByTestId("main-safe-area").props.edges).toEqual([
      "top",
      "bottom",
      "left",
      "right",
    ]);
  });

  it("sends a fresh archived reveal request for every regular-iPad Settings route", async () => {
    mockIsPad = true;
    mockUseWindowDimensions.mockReturnValue({
      fontScale: 1,
      height: 900,
      scale: 2,
      width: 820,
    });
    const screen = renderWithProviders(<MainScreen />);

    fireEvent.press(screen.getByTestId("stub-sidebar-open-settings"));
    fireEvent.press(screen.getByTestId("stub-settings-open-archived"));
    fireEvent.press(screen.getByTestId("stub-settings-dismiss"));

    await waitFor(() => {
      expect(mockDrawerArchivedRevealRequests).toEqual([1]);
    });

    fireEvent.press(screen.getByTestId("stub-sidebar-open-settings"));
    fireEvent.press(screen.getByTestId("stub-settings-open-archived"));
    fireEvent.press(screen.getByTestId("stub-settings-dismiss"));

    await waitFor(() => {
      expect(mockDrawerArchivedRevealRequests).toEqual([1, 2]);
    });
    expect(screen.getByText("drawer:sidebar")).toBeTruthy();
  });

  it("retires an open compact drawer when resizing into and back out of regular iPad", async () => {
    mockIsPad = true;
    mockPipelinePhase = "thinking";
    mockUseWindowDimensions.mockReturnValue({
      fontScale: 1,
      height: 900,
      scale: 2,
      width: 600,
    });
    const screen = renderWithProviders(<MainScreen />);

    fireEvent.press(screen.getByText("open-drawer"));
    expect(screen.getByText("drawer:open")).toBeTruthy();

    mockUseWindowDimensions.mockReturnValue({
      fontScale: 1,
      height: 900,
      scale: 2,
      width: 820,
    });
    screen.rerender(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <MainScreen />
        </LocalizationProvider>
      </ThemeProvider>,
    );
    await waitFor(() => {
      expect(screen.getByText("drawer:sidebar")).toBeTruthy();
      expect(screen.getByText("voice-stage:active")).toBeTruthy();
    });

    mockUseWindowDimensions.mockReturnValue({
      fontScale: 1,
      height: 900,
      scale: 2,
      width: 600,
    });
    screen.rerender(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <MainScreen />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("drawer:closed")).toBeTruthy();
      expect(screen.getByText("voice-stage:active")).toBeTruthy();
    });
  });

  it("retires an open transcript sheet after docking so it does not reopen on shrink", async () => {
    mockIsPad = true;
    mockPipelinePhase = "thinking";
    mockUseWindowDimensions.mockReturnValue({
      fontScale: 1,
      height: 1180,
      scale: 2,
      width: 820,
    });
    const screen = renderWithProviders(<MainScreen />);
    const getTranscriptModal = () =>
      screen
        .UNSAFE_getAllByType(RNModal)
        .find(
          (modal) =>
            modal.findAllByProps({ testID: "transcript-sheet-header" }).length >
            0,
        );

    fireEvent.press(screen.getByTestId("transcript-handle"));
    await waitFor(() => {
      expect(getTranscriptModal()?.props.visible).toBe(true);
    });

    mockUseWindowDimensions.mockReturnValue({
      fontScale: 1,
      height: 820,
      scale: 2,
      width: 1180,
    });
    screen.rerender(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <MainScreen />
        </LocalizationProvider>
      </ThemeProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("ipad-transcript-pane")).toBeTruthy();
      expect(screen.getByText("voice-stage:active")).toBeTruthy();
    });

    mockUseWindowDimensions.mockReturnValue({
      fontScale: 1,
      height: 1180,
      scale: 2,
      width: 820,
    });
    screen.rerender(
      <ThemeProvider mode="light">
        <LocalizationProvider language="en">
          <MainScreen />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(getTranscriptModal()).toBeUndefined();
      expect(screen.getByText("voice-stage:active")).toBeTruthy();
    });
  });
});
