import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  FlatList,
  Keyboard,
  Modal as NativeModal,
  Platform,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import {
  act,
  fireEvent,
  render,
  waitFor,
  within,
} from "@testing-library/react-native";
import { AntSettingsModal as SettingsModal } from "../../src/features/settings/AntSettingsModal";
import { PROVIDER_ORDER } from "../../src/constants/models";
import {
  List,
  Modal as NativeDialog,
} from "../../src/design-system/NativeControls";
import { LocalizationProvider, translate } from "../../src/i18n";
import { ThemeProvider } from "../../src/theme/ThemeContext";
import { lightColors } from "../../src/theme/colors";
import {
  type AppLanguage,
  DEFAULT_SETTINGS,
  type Settings,
} from "../../src/types";
import { useSpeechDiagnostics } from "../../src/hooks/useSpeechDiagnostics";
import { clearSpeechDiagnostics } from "../../src/services/speech/diagnostics";
import { getProviderValidationTarget } from "../../src/features/settings-core/providerSupport";
import { APP_LANGUAGE_OPTIONS } from "../../src/i18n/localeRegistry";
import {
  RUNTIME_CAPABILITY_OVERRIDES_STORAGE_KEY,
  disableRuntimeCapabilityConfiguration,
  resetRuntimeCapabilityOverridesForTests,
} from "../../src/services/runtimeCapabilityOverrides";
import { createAutoSetupJob } from "../test-utils/autoSetupJobFixture";
import { getLocalCatalogInstallStatuses } from "../../src/services/offlineProfileManager";
import { getLocalModelBenchmarkResults } from "../../src/services/localDeviceCapabilities";

const NativeDialogType = NativeDialog as unknown as React.ComponentType<any>;
const hiddenIconQuery = { includeHiddenElements: true } as const;

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
  initialWindowMetrics: null,
  // Screens presented in a full-screen modal carry their own provider, because
  // the app-level one does not reach into that view controller on iOS.
  SafeAreaProvider: ({ children }: React.PropsWithChildren) => children,
  SafeAreaView: ({ children, ...props }: React.PropsWithChildren) => {
    const React = require("react");
    const { View } = require("react-native");
    return React.createElement(View, props, children);
  },
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("react-native-reanimated", () => {
  const { View } = require("react-native");

  return {
    __esModule: true,
    default: {
      View,
      createAnimatedComponent: (component: unknown) => component,
    },
    createAnimatedComponent: (component: unknown) => component,
    useSharedValue: (value: number) => ({ value }),
    useDerivedValue: (factory: () => unknown) => ({
      value: factory(),
    }),
    useAnimatedStyle: (factory: () => unknown) => factory(),
    withDelay: (_delay: number, value: unknown) => value,
    withTiming: (value: number) => value,
    withSpring: (value: number) => value,
    Easing: {
      out: (value: unknown) => value,
      ease: "ease",
    },
  };
});

jest.mock("expo-speech", () => ({
  getAvailableVoicesAsync: jest.fn(() => Promise.resolve([])),
}));

jest.mock("../../src/hooks/useSpeechDiagnostics", () => ({
  useSpeechDiagnostics: jest.fn(() => []),
}));

jest.mock("../../src/services/speech/diagnostics", () => ({
  clearSpeechDiagnostics: jest.fn(),
}));

jest.mock("../../src/services/offlineProfileManager", () => ({
  getLocalCatalogInstallStatuses: jest.fn(async () => ({})),
}));

jest.mock("../../src/services/localDeviceCapabilities", () => {
  const actual = jest.requireActual(
    "../../src/services/localDeviceCapabilities",
  );
  return {
    ...actual,
    getLocalModelBenchmarkResults: jest.fn(async () => ({})),
    probeLocalDeviceCapabilities: jest.fn(async () => ({
      version: 1,
      capturedAt: "2026-08-13T08:00:00.000Z",
      platform: "ios",
      physicalMemoryBytes: 8 * 1024 ** 3,
      availableMemoryBytes: 6 * 1024 ** 3,
      freeStorageBytes: 48 * 1024 ** 3,
      totalStorageBytes: 128 * 1024 ** 3,
      processorCount: 8,
      activeProcessorCount: 8,
      architecture: "arm64",
      osVersion: "26.6",
      lowPowerMode: false,
      memoryLow: false,
      thermalState: "nominal",
    })),
  };
});

jest.mock("../../src/components/ProviderIcon", () => ({
  ProviderIcon: ({ label, provider }: { label?: string; provider: string }) => {
    const React = require("react");
    const { Text } = require("react-native");
    return React.createElement(Text, null, label ?? provider);
  },
}));

function setViewport(width: number, height: number) {
  mockUseWindowDimensions.mockReturnValue({
    fontScale: 1,
    height,
    scale: 2,
    width,
  });
}

function createSettingsModalElement(
  overrideProps: Partial<React.ComponentProps<typeof SettingsModal>> = {},
  language: AppLanguage = "en",
) {
  const kokoroModel = {
    installed: false,
    verified: false,
    busy: null,
    phase: null,
    progress: 0,
    error: null,
    download: jest.fn(async () => true),
    refresh: jest.fn(async () => undefined),
    remove: jest.fn(async () => true),
  } as const;

  return (
    <ThemeProvider mode="light">
      <LocalizationProvider language={language}>
        <SettingsModal
          visible
          isPremium
          archivedConversationCount={0}
          developmentEntitlementMode={null}
          settings={DEFAULT_SETTINGS}
          autoSetup={createAutoSetupJob()}
          kokoroModel={kokoroModel}
          providerVoiceDirectories={{}}
          onUpdate={jest.fn()}
          onAddResponseMode={jest.fn()}
          onRemoveResponseMode={jest.fn()}
          onUpdateResponseModeRoute={jest.fn()}
          onUpdateProviderSttModel={jest.fn()}
          onUpdateProviderTtsModel={jest.fn()}
          onUpdateProviderTtsVoice={jest.fn()}
          onUpdateApiKey={jest.fn()}
          onUpdateProviderValidationResult={jest.fn()}
          onPreviewVoice={jest.fn(async () => undefined)}
          onStopPreviewVoice={jest.fn(async () => undefined)}
          onValidateProviderCapability={jest.fn(async () => undefined)}
          onOpenPremium={jest.fn()}
          onOpenArchivedConversations={jest.fn()}
          onSetDevelopmentEntitlementMode={jest.fn(async () => undefined)}
          conversationArchive={{
            chooseDirectory: jest.fn(async () => undefined),
            configured: false,
            directoryName: null,
            disconnect: jest.fn(async () => undefined),
            error: null,
            lastSyncedAt: null,
            loaded: true,
            syncNow: jest.fn(async () => undefined),
            syncing: false,
          }}
          onCreateAppDataBackup={async () => {
            throw new Error("Not used in this test.");
          }}
          onRestoreAppDataBackup={async () => {
            throw new Error("Not used in this test.");
          }}
          onClose={jest.fn()}
          {...overrideProps}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
}

function renderSettingsModal(
  overrideProps: Partial<React.ComponentProps<typeof SettingsModal>> = {},
  language: AppLanguage = "en",
) {
  return render(createSettingsModalElement(overrideProps, language));
}

describe("SettingsModal", () => {
  beforeEach(() => {
    Object.defineProperty(Platform, "isPad", {
      configurable: true,
      value: false,
      writable: true,
    });
    setViewport(430, 932);
  });

  afterEach(async () => {
    await AsyncStorage.removeItem(RUNTIME_CAPABILITY_OVERRIDES_STORAGE_KEY);
    resetRuntimeCapabilityOverridesForTests();
    jest.mocked(useSpeechDiagnostics).mockReturnValue([]);
    jest.mocked(getLocalCatalogInstallStatuses).mockResolvedValue({});
    jest.mocked(getLocalModelBenchmarkResults).mockResolvedValue({});
    jest.restoreAllMocks();
  });

  it("uses full-window master-detail Settings on a regular-width iPad", async () => {
    Object.defineProperty(Platform, "isPad", {
      configurable: true,
      value: true,
      writable: true,
    });
    setViewport(1180, 820);

    const screen = renderSettingsModal();

    await waitFor(() => {
      expect(screen.getByTestId("connections-settings-page")).toBeTruthy();
    });

    const expectedCategories = [
      { icon: "key", page: "connections" },
      { icon: "robot", page: "thinking" },
      { icon: "search", page: "search" },
      { icon: "audio", page: "listening" },
      { icon: "sound", page: "speaking" },
      { icon: "safety-certificate", page: "data" },
      { icon: "sliders", page: "app" },
    ];
    const nav = screen.getByTestId("settings-ipad-category-nav");
    const categoryRows = within(nav).getAllByTestId(
      /^settings-ipad-category-row-/,
    );

    expect(categoryRows.map((row) => row.props.testID)).toEqual(
      expectedCategories.map(
        ({ page }) => `settings-ipad-category-row-${page}`,
      ),
    );
    expect(StyleSheet.flatten(nav.props.style)).toEqual(
      expect.objectContaining({ width: 300 }),
    );
    for (const [index, row] of categoryRows.entries()) {
      expect(StyleSheet.flatten(row.props.style)).toEqual(
        expect.objectContaining({ minHeight: 48 }),
      );
      expect(
        within(row).getByTestId(
          `phosphor-icon-${expectedCategories[index].icon}`,
          hiddenIconQuery,
        ),
      ).toBeTruthy();
      expect(within(row).queryByTestId("phosphor-icon-right")).toBeNull();
      expect(within(row).queryByTestId("phosphor-icon-left")).toBeNull();
    }
    expect(
      screen.getByTestId("settings-ipad-category-row-connections").props
        .accessibilityState,
    ).toEqual({ selected: true });
    expect(
      StyleSheet.flatten(
        screen.getByTestId("settings-ipad-category-row-connections").props
          .style,
      ),
    ).toEqual(
      expect.objectContaining({ backgroundColor: lightColors.accentSoft }),
    );
    expect(screen.getByTestId("settings-modal-title").props.children).toBe(
      "Connections",
    );
    expect(screen.getByTestId("settings-close-button")).toBeTruthy();
    expect(screen.getByTestId("settings-ipad-detail-pane")).toBeTruthy();
    expect(screen.queryByTestId("settings-page-overview")).toBeNull();
    expect(screen.queryByTestId("settings-back-button")).toBeNull();
    expect(screen.queryByTestId("settings-modal-backdrop")).toBeNull();
    expect(
      StyleSheet.flatten(
        screen.getByTestId("settings-modal-panel").props.style,
      ),
    ).toEqual(
      expect.objectContaining({
        borderRadius: 0,
        borderWidth: 0,
        maxWidth: "100%",
        shadowOpacity: 0,
      }),
    );
    expect(
      StyleSheet.flatten(
        screen.getByTestId("settings-scroll-view").props.contentContainerStyle,
      ),
    ).toEqual(expect.objectContaining({ maxWidth: 760 }));
  });

  it("preserves a regular-iPad deep link and switches only the active detail", async () => {
    Object.defineProperty(Platform, "isPad", {
      configurable: true,
      value: true,
      writable: true,
    });
    setViewport(1180, 820);

    const screen = renderSettingsModal({ focusPage: "speaking" });

    await waitFor(() => {
      expect(screen.getByTestId("speaking-settings-page")).toBeTruthy();
    });
    expect(
      screen.getByTestId("settings-ipad-category-row-speaking").props
        .accessibilityState,
    ).toEqual({ selected: true });
    expect(screen.queryByTestId("settings-page-overview")).toBeNull();
    expect(screen.queryByTestId("settings-back-button")).toBeNull();

    fireEvent.press(screen.getByTestId("settings-ipad-category-row-data"));

    await waitFor(() => {
      expect(screen.getByTestId("settings-page-data")).toBeTruthy();
      expect(screen.queryByTestId("speaking-settings-page")).toBeNull();
    });
    expect(
      screen.getByTestId("settings-ipad-category-row-speaking").props
        .accessibilityState,
    ).toEqual({ selected: false });
    expect(
      screen.getByTestId("settings-ipad-category-row-data").props
        .accessibilityState,
    ).toEqual({ selected: true });
    expect(screen.getByTestId("settings-modal-title").props.children).toBe(
      "Data & privacy",
    );
  });

  it("uses Yoga direction and logical borders for regular-width RTL iPad", async () => {
    Object.defineProperty(Platform, "isPad", {
      configurable: true,
      value: true,
      writable: true,
    });
    setViewport(1180, 820);

    const screen = renderSettingsModal(
      {
        focusPage: "thinking",
        settings: { ...DEFAULT_SETTINGS, language: "ar" },
      },
      "ar",
    );

    await waitFor(() => {
      expect(screen.getByTestId("thinking-settings-page")).toBeTruthy();
    });
    const panelStyle = StyleSheet.flatten(
      screen.getByTestId("settings-modal-panel").props.style,
    );
    const navStyle = StyleSheet.flatten(
      screen.getByTestId("settings-ipad-category-nav").props.style,
    );
    const rowStyle = StyleSheet.flatten(
      screen.getByTestId("settings-ipad-category-row-thinking").props.style,
    );

    expect(panelStyle).toEqual(
      expect.objectContaining({ flexDirection: "row" }),
    );
    expect(navStyle).toEqual(
      expect.objectContaining({
        borderEndColor: lightColors.border,
        borderEndWidth: 1,
      }),
    );
    expect(navStyle.borderLeftWidth).toBeUndefined();
    expect(navStyle.borderRightWidth).toBeUndefined();
    expect(rowStyle).toEqual(expect.objectContaining({ flexDirection: "row" }));
  });

  it("preserves the selected detail across compact and regular iPad resizing", async () => {
    Object.defineProperty(Platform, "isPad", {
      configurable: true,
      value: true,
      writable: true,
    });
    const overrideProps = { focusPage: "speaking" as const };
    setViewport(600, 820);

    const screen = renderSettingsModal(overrideProps);

    await waitFor(() => {
      expect(screen.getByTestId("speaking-settings-page")).toBeTruthy();
      expect(screen.getByTestId("settings-back-button")).toBeTruthy();
    });
    expect(screen.queryByTestId("settings-ipad-category-nav")).toBeNull();

    setViewport(1180, 820);
    screen.rerender(createSettingsModalElement(overrideProps));

    await waitFor(() => {
      expect(screen.getByTestId("speaking-settings-page")).toBeTruthy();
      expect(
        screen.getByTestId("settings-ipad-category-row-speaking").props
          .accessibilityState,
      ).toEqual({ selected: true });
    });
    expect(screen.queryByTestId("settings-back-button")).toBeNull();

    fireEvent.press(screen.getByTestId("settings-ipad-category-row-data"));

    await waitFor(() => {
      expect(screen.getByTestId("settings-page-data")).toBeTruthy();
    });

    setViewport(600, 820);
    screen.rerender(createSettingsModalElement(overrideProps));

    await waitFor(() => {
      expect(screen.getByTestId("settings-page-data")).toBeTruthy();
      expect(screen.getByTestId("settings-back-button")).toBeTruthy();
    });
    expect(screen.queryByTestId("settings-ipad-category-nav")).toBeNull();

    fireEvent.press(screen.getByTestId("settings-back-button"));

    await waitFor(() => {
      expect(screen.getByTestId("settings-page-overview")).toBeTruthy();
    });
  });

  it("keeps compact iPad Settings on the overview-to-push flow", async () => {
    Object.defineProperty(Platform, "isPad", {
      configurable: true,
      value: true,
      writable: true,
    });
    setViewport(600, 820);

    const screen = renderSettingsModal();

    await waitFor(() => {
      expect(screen.getByTestId("settings-page-overview")).toBeTruthy();
    });
    expect(screen.getByTestId("settings-modal-title").props.children).toBe(
      "Settings",
    );
    expect(screen.queryByTestId("settings-ipad-category-nav")).toBeNull();
    expect(screen.getByTestId("settings-modal-backdrop")).toBeTruthy();

    fireEvent.press(screen.getByTestId("settings-overview-row-connections"));

    await waitFor(() => {
      expect(screen.getByTestId("connections-settings-page")).toBeTruthy();
      expect(screen.getByTestId("settings-back-button")).toBeTruthy();
    });
  });

  it("renders readiness overview and drills into Connections", async () => {
    const screen = renderSettingsModal();

    await waitFor(() => {
      expect(screen.getByText("Settings")).toBeTruthy();
      expect(screen.getByTestId("settings-modal-title").props.children).toBe(
        "Settings",
      );
      expect(
        StyleSheet.flatten(
          screen.getByTestId("settings-modal-title").props.style,
        ),
      ).toEqual(
        expect.objectContaining({
          fontFamily: "UnicaOne_400Regular",
          fontSize: 20,
          textAlign: "center",
        }),
      );
      expect(screen.queryByTestId("settings-header-gradient")).toBeNull();
      expect(screen.queryByTestId("settings-modal-gradient")).toBeNull();
      expect(
        screen.getAllByTestId("phosphor-icon-close", hiddenIconQuery).length,
      ).toBeTruthy();
      expect(
        screen.getAllByTestId("phosphor-icon-right", hiddenIconQuery).length,
      ).toBeGreaterThan(0);
      expect(screen.queryByText("Runtime Readiness")).toBeNull();
      expect(screen.getByText("Connections")).toBeTruthy();
      expect(screen.getByText("Thinking")).toBeTruthy();
      expect(screen.getByText("Listening")).toBeTruthy();
      expect(screen.getByText("Speaking")).toBeTruthy();
      expect(screen.getAllByText("Search").length).toBeGreaterThan(0);
      expect(screen.getByText("App & diagnostics")).toBeTruthy();
      expect(screen.queryByPlaceholderText("Search services")).toBeNull();
      expect(screen.queryByText("System Prompt")).toBeNull();
      expect(screen.queryByText("Voice Input")).toBeNull();
      expect(screen.queryByText("Theme")).toBeNull();
    });

    fireEvent.press(screen.getByText("Connections"));

    await waitFor(() => {
      expect(screen.getByLabelText("Back to overview")).toBeTruthy();
      expect(
        screen.getByTestId("phosphor-icon-arrow-left", hiddenIconQuery),
      ).toBeTruthy();
      expect(screen.getByTestId("settings-modal-title").props.children).toBe(
        "Connections",
      );
      expect(screen.getAllByText("Connections")).toHaveLength(1);
      expect(
        screen.getByText(
          "Keys stay in the device keychain and are sent only to their own provider.",
        ),
      ).toBeTruthy();
      expect(screen.getByTestId("connections-settings-page")).toBeTruthy();
      expect(screen.getByText("Providers")).toBeTruthy();
      expect(screen.queryByPlaceholderText("Search services")).toBeNull();
      expect(screen.queryByText("System Prompt")).toBeNull();
    });

    fireEvent.press(screen.getByLabelText("Back to overview"));

    await waitFor(() => {
      expect(screen.getByTestId("settings-modal-title").props.children).toBe(
        "Settings",
      );
      expect(screen.queryByText("Runtime Readiness")).toBeNull();
      expect(screen.queryByPlaceholderText("Search services")).toBeNull();
    });
  });

  it("opens local listening choices in place for Free users", async () => {
    const onOpenPremium = jest.fn();
    const screen = renderSettingsModal({ isPremium: false, onOpenPremium });

    fireEvent.press(screen.getByTestId("settings-overview-row-listening"));

    await waitFor(() => {
      expect(screen.getByTestId("listening-settings-page")).toBeTruthy();
    });
    expect(onOpenPremium).not.toHaveBeenCalled();
    expect(screen.getByText("Who listens")).toBeTruthy();
    expect(
      screen.getByText(
        "One choice across every runtime. A radio unlocks only after a viable test — testing is the egg, and it cracks when a model fails. Removing an installed model is a swipe. Provider routes appear once connected under Connections.",
      ),
    ).toBeTruthy();
    expect(screen.getByTestId("settings-stt-route-native")).toBeTruthy();
    expect(
      screen.getByTestId("settings-stt-route-provider-openai"),
    ).toBeTruthy();
    expect(screen.getByLabelText("OpenAI").props.accessibilityState).toEqual({
      checked: false,
      disabled: true,
    });
  });

  it("keeps Thinking's local model lifecycle usable and locks hosted routes in place for Free", async () => {
    const onOpenPremium = jest.fn();
    const screen = renderSettingsModal({ isPremium: false, onOpenPremium });

    fireEvent.press(screen.getByTestId("settings-overview-row-thinking"));

    await waitFor(() => {
      expect(screen.getByTestId("thinking-settings-page")).toBeTruthy();
    });
    expect(onOpenPremium).not.toHaveBeenCalled();

    fireEvent.press(screen.getByTestId("thinking-add-model"));

    await waitFor(() => {
      expect(screen.getByTestId("thinking-local-models")).toBeTruthy();
      expect(screen.getByTestId("thinking-provider-openai")).toBeTruthy();
    });
    expect(screen.getByLabelText("OpenAI").props.accessibilityState).toEqual({
      checked: false,
      disabled: true,
    });
    expect(
      screen.getAllByTestId(/^local-model-download-/).length,
    ).toBeGreaterThan(0);

    const addSheetModal = screen
      .UNSAFE_getAllByType(NativeModal)
      .find(
        (modal) =>
          modal.findAllByProps({ testID: "thinking-add-sheet" }).length > 0,
      );
    const addSheet = screen.getByTestId("thinking-add-sheet");
    fireEvent.press(within(addSheet).getAllByLabelText("Unlock Premium")[0]);
    expect(onOpenPremium).not.toHaveBeenCalled();
    act(() => {
      addSheetModal?.props.onDismiss();
    });
    expect(onOpenPremium).toHaveBeenCalledTimes(1);
  });

  it("keeps provider routes visible but locked in Free Connections", async () => {
    const onOpenPremium = jest.fn();
    const screen = renderSettingsModal({ isPremium: false, onOpenPremium });

    fireEvent.press(screen.getByTestId("settings-overview-row-connections"));

    await waitFor(() => {
      expect(screen.getByTestId("connections-settings-page")).toBeTruthy();
    });
    expect(screen.getByLabelText("OpenAI").props.accessibilityState).toEqual({
      checked: false,
      disabled: true,
    });
    expect(screen.queryByTestId("provider-connection-sheet-openai")).toBeNull();

    fireEvent.press(screen.getByLabelText("Unlock Premium"));
    expect(onOpenPremium).toHaveBeenCalledTimes(1);
  });

  it("keeps Nobody usable and provider routes locked in Free Search", async () => {
    const onOpenPremium = jest.fn();
    const onUpdate = jest.fn();
    const screen = renderSettingsModal({
      isPremium: false,
      onOpenPremium,
      onUpdate,
    });

    fireEvent.press(screen.getByTestId("settings-overview-row-search"));

    await waitFor(() => {
      expect(screen.getByTestId("search-settings-page")).toBeTruthy();
    });
    expect(screen.getByLabelText("Nobody").props.accessibilityState).toEqual({
      checked: true,
      disabled: false,
    });
    expect(screen.getByLabelText("OpenAI").props.accessibilityState).toEqual({
      checked: false,
      disabled: true,
    });

    fireEvent.press(screen.getByLabelText("Nobody"));
    expect(onUpdate).toHaveBeenCalledWith({ webSearchMode: "off" });
    fireEvent.press(screen.getByLabelText("Unlock Premium"));
    expect(onOpenPremium).toHaveBeenCalledTimes(1);
  });

  it("shows the same seven sections on the Free overview", async () => {
    const screen = renderSettingsModal({ isPremium: false });

    await waitFor(() => {
      expect(
        screen.getByTestId("settings-overview-row-connections"),
      ).toBeTruthy();
    });
    expect(screen.getByTestId("settings-premium-upgrade")).toBeTruthy();

    for (const page of [
      "connections",
      "thinking",
      "search",
      "listening",
      "speaking",
      "data",
      "app",
    ]) {
      expect(screen.getByTestId(`settings-overview-row-${page}`)).toBeTruthy();
    }
    expect(screen.queryByTestId("settings-overview-row-local")).toBeNull();
  });

  it("keeps the complete Data and App structure visible in Free", async () => {
    const onUpdate = jest.fn();
    const screen = renderSettingsModal({ isPremium: false, onUpdate });

    fireEvent.press(screen.getByTestId("settings-overview-row-data"));

    await waitFor(() => {
      expect(screen.getByText("App data backup")).toBeTruthy();
    });
    expect(screen.getByText("Past conversation knowledge")).toBeTruthy();
    expect(screen.getByText("Archived conversations")).toBeTruthy();
    expect(screen.getByText("Storage · 0 MB in models")).toBeTruthy();
    expect(screen.getByText("Premium")).toBeTruthy();

    fireEvent.press(screen.getByLabelText("Back to overview"));
    fireEvent.press(screen.getByTestId("settings-overview-row-app"));

    await waitFor(() => {
      expect(screen.getByTestId("app-language-picker")).toBeTruthy();
    });
    expect(screen.getByText("Theme")).toBeTruthy();
    expect(screen.getByText("Recent Speech Activity")).toBeTruthy();
    expect(screen.getByText("Usage stats in transcripts")).toBeTruthy();
    expect(screen.getByText("Automatic setup")).toBeTruthy();
    fireEvent.press(screen.getByTestId("settings-debug-log-button"));
    expect(onUpdate).toHaveBeenCalledWith({ showDebugLogButton: true });
    expect(
      screen.getByTestId("runtime-compatibility-overrides-section"),
    ).toBeTruthy();
  });

  it("lets Free users disconnect an archive configured before downgrade", async () => {
    const disconnect = jest.fn(async () => undefined);
    const screen = renderSettingsModal({
      isPremium: false,
      conversationArchive: {
        chooseDirectory: jest.fn(async () => undefined),
        configured: true,
        directoryName: "Mr Broccoli",
        disconnect,
        error: null,
        lastSyncedAt: null,
        loaded: true,
        syncNow: jest.fn(async () => undefined),
        syncing: false,
      },
    });

    fireEvent.press(screen.getByTestId("settings-overview-row-data"));

    await waitFor(() => {
      expect(screen.getByTestId("archived-conversations-row")).toBeTruthy();
    });
    fireEvent.press(screen.getByTestId("archived-conversations-row"));
    expect(screen.getByTestId("disconnect-conversation-archive")).toBeTruthy();

    fireEvent.press(screen.getByTestId("disconnect-conversation-archive"));
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it("dismisses the archive sheet before opening Premium", async () => {
    const onOpenPremium = jest.fn();
    const screen = renderSettingsModal({ isPremium: false, onOpenPremium });

    fireEvent.press(screen.getByTestId("settings-overview-row-data"));
    await waitFor(() => {
      expect(screen.getByTestId("archived-conversations-row")).toBeTruthy();
    });
    fireEvent.press(screen.getByTestId("archived-conversations-row"));
    const archiveSheetModal = screen
      .UNSAFE_getAllByType(NativeModal)
      .find(
        (modal) =>
          modal.findAllByProps({ testID: "archive-settings-sheet" }).length > 0,
      );

    fireEvent.press(screen.getByTestId("unlock-conversation-archive"));
    expect(onOpenPremium).not.toHaveBeenCalled();
    act(() => {
      archiveSheetModal?.props.onDismiss();
    });
    expect(onOpenPremium).toHaveBeenCalledTimes(1);
  });

  it("opens localized data backup controls and explains the API-key exclusion", async () => {
    const screen = renderSettingsModal();

    fireEvent.press(screen.getByText("Data & privacy"));

    await waitFor(() => {
      expect(screen.getByText("App data backup")).toBeTruthy();
      expect(screen.getByTestId("export-encrypted-backup")).toBeTruthy();
      expect(screen.getByTestId("import-app-data-backup")).toBeTruthy();
      expect(
        screen.getByText(/Provider API keys are never included/),
      ).toBeTruthy();
    });
    fireEvent.press(screen.getByTestId("export-encrypted-backup"));
    expect(screen.getByTestId("export-readable-backup")).toBeTruthy();
  });

  it("routes Android system back through settings navigation before closing", async () => {
    jest.replaceProperty(Platform, "OS", "android");
    const onClose = jest.fn();
    const screen = renderSettingsModal({ onClose });

    fireEvent.press(screen.getByText("Connections"));

    await waitFor(() => {
      expect(screen.getByTestId("settings-modal-title").props.children).toBe(
        "Connections",
      );
    });

    act(() => screen.UNSAFE_getByType(NativeModal).props.onRequestClose());

    await waitFor(() => {
      expect(screen.getByTestId("settings-modal-title").props.children).toBe(
        "Settings",
      );
    });
    expect(onClose).not.toHaveBeenCalled();

    act(() => screen.UNSAFE_getByType(NativeModal).props.onRequestClose());

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders App settings in Ukrainian", async () => {
    const screen = renderSettingsModal(
      {
        focusTab: "ui",
        settings: {
          ...DEFAULT_SETTINGS,
          language: "uk",
        },
      },
      "uk",
    );

    await waitFor(() => {
      expect(screen.getByTestId("settings-modal-title").props.children).toBe(
        "Застосунок і діагностика",
      );
      expect(screen.getByText("Тема")).toBeTruthy();
      expect(screen.getByText("Українська")).toBeTruthy();
      expect(screen.queryByText("Theme")).toBeNull();
    });
  });

  it("mirrors settings navigation icons for Arabic", async () => {
    const screen = renderSettingsModal(
      {
        settings: {
          ...DEFAULT_SETTINGS,
          language: "ar",
        },
      },
      "ar",
    );

    await waitFor(() => {
      expect(
        screen.getAllByTestId("phosphor-icon-left", hiddenIconQuery).length,
      ).toBeGreaterThan(0);
      expect(
        screen.queryByTestId("phosphor-icon-right", hiddenIconQuery),
      ).toBeNull();
    });

    fireEvent.press(screen.getByText(translate("ar", "settingsConnections")));

    await waitFor(() => {
      expect(
        screen.getByTestId("phosphor-icon-arrow-right", hiddenIconQuery),
      ).toBeTruthy();
      expect(
        screen.queryByTestId("phosphor-icon-arrow-left", hiddenIconQuery),
      ).toBeNull();
    });
  });

  it("downloads optional local voices from the unified Speaking route list", async () => {
    const download = jest.fn(async () => true);
    const screen = renderSettingsModal({
      focusTab: "tts",
      kokoroModel: {
        installed: false,
        verified: false,
        busy: null,
        phase: null,
        progress: 0,
        error: null,
        download,
        refresh: jest.fn(async () => undefined),
        remove: jest.fn(async () => true),
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Playback")).toBeTruthy();
      expect(screen.getByText("Who speaks")).toBeTruthy();
      expect(
        screen.getByTestId("settings-tts-route-kokoro-multilingual"),
      ).toBeTruthy();
      expect(
        screen.getByTestId("settings-tts-route-piper-en-us-kristin"),
      ).toBeTruthy();
      expect(screen.queryByText("Spoken Replies")).toBeNull();
      expect(screen.queryByText("Fallback routes")).toBeNull();
    });

    fireEvent.press(
      screen.getByTestId("local-model-download-kokoro-multilingual"),
    );
    await waitFor(() => expect(download).toHaveBeenCalledTimes(1));
  });

  it("opens a searchable Kokoro voice sheet and previews the tapped voice", async () => {
    jest.mocked(getLocalCatalogInstallStatuses).mockResolvedValue({
      "kokoro-multilingual": {
        installed: true,
        path: "/models/kokoro",
        verified: true,
      },
    });
    jest.mocked(getLocalModelBenchmarkResults).mockResolvedValue({
      "kokoro-multilingual": {
        status: "viable",
      },
    } as never);
    const onPreviewVoice = jest.fn(async () => undefined);
    const screen = renderSettingsModal({
      focusTab: "tts",
      settings: {
        ...DEFAULT_SETTINGS,
        ttsMode: "kokoro",
      },
      kokoroModel: {
        installed: true,
        verified: true,
        busy: null,
        phase: null,
        progress: 1,
        error: null,
        download: jest.fn(async () => true),
        refresh: jest.fn(async () => undefined),
        remove: jest.fn(async () => true),
      },
      onPreviewVoice,
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("local-model-viable-kokoro-multilingual"),
      ).toBeTruthy();
    });

    await waitFor(() => {
      expect(screen.getByTestId("settings-tts-kokoro-voice")).toBeTruthy();
    });
    fireEvent.press(screen.getByTestId("settings-tts-kokoro-voice"));
    expect(screen.getByTestId("speaking-voice-picker-search")).toBeTruthy();
    expect(
      screen.getAllByText("Maple · American female").length,
    ).toBeGreaterThan(0);

    fireEvent.press(screen.getByTestId("speaking-voice-picker-preview-af_sol"));
    await waitFor(() =>
      expect(onPreviewVoice).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: "kokoro",
          voice: "af_sol",
        }),
        expect.any(Object),
      ),
    );
  });

  it("edits delivery instructions in a focused sheet only for a supporting route", async () => {
    const onUpdate = jest.fn();
    const screen = renderSettingsModal({
      focusTab: "tts",
      settings: {
        ...DEFAULT_SETTINGS,
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          openai: "configured-openai-key",
        },
        ttsMode: "provider",
        ttsProvider: "openai",
        providerTtsModels: {
          ...DEFAULT_SETTINGS.providerTtsModels,
          openai: "gpt-4o-mini-tts",
        },
      },
      onUpdate,
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("speaking-instructions-row").props
          .accessibilityState,
      ).toMatchObject({ disabled: false });
    });
    expect(screen.queryByTestId("speaking-instructions-input")).toBeNull();
    fireEvent.press(screen.getByTestId("speaking-instructions-row"));
    fireEvent.changeText(
      screen.getByTestId("speaking-instructions-input"),
      "Speak warmly.",
    );
    expect(onUpdate).toHaveBeenCalledWith({
      ttsInstructions: "Speak warmly.",
    });
  });

  it("keeps the Speaking structure visible to Free users with provider routes locked", async () => {
    const screen = renderSettingsModal({
      focusTab: "tts",
      isPremium: false,
    });

    await waitFor(() => {
      expect(screen.getByText("Playback")).toBeTruthy();
      expect(screen.getByText("Who speaks")).toBeTruthy();
      expect(
        screen.getByTestId("settings-tts-route-provider-openai"),
      ).toBeTruthy();
      expect(screen.getByText("Unlock Premium")).toBeTruthy();
    });
    expect(
      screen.getByLabelText("OpenAI").props.accessibilityState,
    ).toMatchObject({ disabled: true });
    expect(
      screen.getByLabelText("System voice").props.accessibilityState,
    ).toMatchObject({ checked: true });
    expect(
      screen.getByLabelText("Kokoro").props.accessibilityState,
    ).toMatchObject({ checked: false });
  });

  it("keeps provider connections in runtime-manifest order", async () => {
    const screen = renderSettingsModal();

    fireEvent.press(screen.getByText("Connections"));

    await waitFor(() => {
      expect(screen.getByText("OpenAI")).toBeTruthy();
    });

    const renderedProviders = screen
      .getAllByTestId(/^provider-vault-row-/)
      .map((row) =>
        String(row.props.testID).replace("provider-vault-row-", ""),
      );
    const expectedProviders = PROVIDER_ORDER.filter((provider) =>
      Object.hasOwn(DEFAULT_SETTINGS.apiKeys, provider),
    );

    expect(renderedProviders).toEqual(expectedProviders);
  });

  it("omits the retired guided setup shortcut from Connections", async () => {
    const screen = renderSettingsModal();

    fireEvent.press(screen.getByText("Connections"));

    await waitFor(() => {
      expect(screen.getByText("OpenAI")).toBeTruthy();
    });

    expect(screen.queryByTestId("setup-guide-shortcut-setting")).toBeNull();
    expect(screen.queryByLabelText("Show guided setup in Settings")).toBeNull();
  });

  it("opens Connections when a focus provider is supplied", async () => {
    const dismissKeyboard = jest
      .spyOn(Keyboard, "dismiss")
      .mockImplementation(() => undefined);
    const screen = renderSettingsModal({ focusProvider: "openai" });

    await waitFor(() => {
      expect(screen.getByLabelText("Back to overview")).toBeTruthy();
      expect(screen.getByTestId("settings-modal-title").props.children).toBe(
        "Connections",
      );
      expect(screen.getAllByText("OpenAI").length).toBeGreaterThan(1);
      expect(
        screen.getByTestId("provider-connection-sheet-openai"),
      ).toBeTruthy();
      expect(
        screen.getByTestId("provider-connection-sheet-openai-header-handle"),
      ).toBeTruthy();
      expect(screen.getByText("Test all")).toBeTruthy();
      expect(screen.getByLabelText("Test LLM")).toBeTruthy();
      expect(
        screen.queryByText(
          "Live validation is not wired for this provider yet. Save the key here and verify it during actual use.",
        ),
      ).toBeNull();
      expect(screen.queryByText("System Prompt")).toBeNull();
    });

    fireEvent.press(
      screen.getByTestId("provider-connection-sheet-openai-header-handle"),
    );

    await waitFor(() => {
      expect(dismissKeyboard).toHaveBeenCalledTimes(1);
      expect(
        screen.queryByTestId("provider-connection-sheet-openai"),
      ).toBeNull();
      expect(screen.getByTestId("settings-back-button")).toBeTruthy();
    });

    dismissKeyboard.mockRestore();
  });

  it("waits for the iOS keyboard to hide before dismissing a provider sheet", async () => {
    jest.replaceProperty(Platform, "OS", "ios");
    jest.spyOn(Keyboard, "isVisible").mockReturnValue(true);
    const dismissKeyboard = jest
      .spyOn(Keyboard, "dismiss")
      .mockImplementation(() => undefined);
    const addKeyboardListener = Keyboard.addListener.bind(Keyboard);
    const removeKeyboardListener = jest.fn();
    let keyboardDidHide: (() => void) | null = null;
    jest
      .spyOn(Keyboard, "addListener")
      .mockImplementation((event, listener) => {
        const subscription = addKeyboardListener(event, listener);
        if (event === "keyboardDidHide") {
          keyboardDidHide = listener as () => void;
          const removeSubscription = subscription.remove.bind(subscription);
          subscription.remove = () => {
            removeKeyboardListener();
            removeSubscription();
          };
        }
        return subscription;
      });
    const screen = renderSettingsModal({ focusProvider: "openai" });

    await waitFor(() => {
      expect(
        screen.getByTestId("provider-connection-sheet-openai"),
      ).toBeTruthy();
    });

    fireEvent.press(
      screen.getByTestId("provider-connection-sheet-openai-header-handle"),
    );

    expect(dismissKeyboard).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("provider-connection-sheet-openai")).toBeTruthy();
    expect(keyboardDidHide).not.toBeNull();

    act(() => keyboardDidHide?.());

    await waitFor(() => {
      expect(
        screen.queryByTestId("provider-connection-sheet-openai"),
      ).toBeNull();
    });
    expect(removeKeyboardListener).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("settings-back-button")).toBeTruthy();
  });

  it("shows capabilities and health in each provider row", async () => {
    const screen = renderSettingsModal({ focusProvider: "openai" });

    await waitFor(() => {
      expect(screen.getByTestId("provider-vault-row-openai")).toBeTruthy();
    });

    const card = screen.getByTestId("provider-card-openai");
    const headerControl = screen.getByTestId(
      "provider-card-openai-header-control",
    );

    fireEvent(headerControl, "pressIn");
    expect(
      StyleSheet.flatten(headerControl.props.style).transform,
    ).toBeUndefined();
    fireEvent(headerControl, "pressOut");

    expect(within(card).getByText("LLM · STT · TTS · Web Search")).toBeTruthy();
    expect(within(card).getByTestId("provider-health-openai")).toBeTruthy();
    expect(headerControl.props.accessibilityLabel).toContain(
      "LLM · STT · TTS · Web Search",
    );
    expect(headerControl.props.accessibilityLabel).toContain("Not set up");
  });

  it("opens provider details from the card header info action", async () => {
    const screen = renderSettingsModal({ focusProvider: "openai" });

    await waitFor(() => {
      expect(screen.getByLabelText("About this provider: OpenAI")).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText("About this provider: OpenAI"));

    await waitFor(() => {
      expect(screen.getByText("OpenAI · About this provider")).toBeTruthy();
      const modal = screen.getByTestId("provider-about-modal");
      expect(modal).toBeTruthy();
      expect(within(modal).getByTestId("provider-about-scroll")).toBeTruthy();
      expect(within(modal).getByLabelText("Dismiss")).toBeTruthy();
    });
  });

  it("orders provider actions and sections in the provider sheet", async () => {
    const provider = "alibaba-qwen-dashscope";
    const screen = renderSettingsModal({ focusProvider: provider });

    await waitFor(() => {
      expect(screen.getByText("API key")).toBeTruthy();
      expect(screen.getByText("API test")).toBeTruthy();
    });
    expect(screen.queryByText("API region")).toBeNull();
    expect(screen.queryByText("Region")).toBeNull();
    expect(screen.getByText("Singapore")).toBeTruthy();

    const apiKeySection = screen.getByTestId(
      `provider-api-key-section-${provider}`,
    );
    expect(within(apiKeySection).getByText("Singapore")).toBeTruthy();
    const regionHint = within(apiKeySection).getByText(
      "The selected region must match the region in which this API key was created.",
    );
    expect(StyleSheet.flatten(regionHint.props.style).fontSize).toBe(12);

    const sheet = screen.getByTestId("native-dialog-card");
    const expectedActionLabels = [
      "Dismiss",
      "Credentials: Alibaba / Qwen",
      "About this provider: Alibaba / Qwen",
    ];
    const actionLabels = [
      ...new Set(
        sheet
          .findAll(
            (node) =>
              typeof node.props.accessibilityLabel === "string" &&
              expectedActionLabels.includes(node.props.accessibilityLabel),
          )
          .map((node) => node.props.accessibilityLabel),
      ),
    ];

    expect(actionLabels).toEqual(expectedActionLabels);

    const apiTestHeader = screen.getByTestId(
      `provider-api-test-header-${provider}`,
    );
    expect(within(apiTestHeader).getByText("API test")).toBeTruthy();
    expect(
      within(apiTestHeader).getByTestId(`provider-test-all-${provider}`),
    ).toBeTruthy();
    expect(StyleSheet.flatten(apiTestHeader.props.style).justifyContent).toBe(
      "space-between",
    );

    const apiTestSection = screen.getByTestId(
      `provider-api-test-section-${provider}`,
    );
    const orderedTestControls = [
      ...new Set(
        apiTestSection
          .findAll(
            (node) =>
              node.props.testID === `provider-capability-list-${provider}` ||
              node.props.testID === `provider-test-all-${provider}`,
          )
          .map((node) => node.props.testID),
      ),
    ];

    expect(orderedTestControls).toEqual([
      `provider-test-all-${provider}`,
      `provider-capability-list-${provider}`,
    ]);

    const capabilityRows = screen
      .UNSAFE_getAllByType(List.Item)
      .filter(
        (item) =>
          typeof item.props.testID === "string" &&
          item.props.testID.startsWith(`provider-capability-row-${provider}-`),
      );
    expect(capabilityRows).not.toHaveLength(0);
    for (const row of capabilityRows) {
      expect(row.props.styles.Line.borderBottomWidth).toBe(0);
    }
    for (const statusText of within(apiTestSection).getAllByText(
      "Not set up",
    )) {
      expect(StyleSheet.flatten(statusText.props.style).fontSize).toBe(12);
    }
  });

  it("keeps a fully validated Google card healthy across model switches", async () => {
    const activeMode = DEFAULT_SETTINGS.responseModes[0];
    const baseSettings: Settings = {
      ...DEFAULT_SETTINGS,
      activeResponseMode: activeMode.id,
      responseModes: [
        {
          ...activeMode,
          route: {
            provider: "gemini",
            model: "gemini-2.5-flash-lite",
            effort: "disabled",
          },
        },
      ],
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        gemini: "working-google-key",
      },
      providerTtsModels: {
        ...DEFAULT_SETTINGS.providerTtsModels,
        gemini: "gemini-2.5-pro-preview-tts",
      },
    };
    const llmTarget = getProviderValidationTarget(
      baseSettings,
      "gemini",
      "llm",
    );
    const sttTarget = getProviderValidationTarget(
      baseSettings,
      "gemini",
      "stt",
    );
    const ttsTarget = getProviderValidationTarget(
      baseSettings,
      "gemini",
      "tts",
    );
    const searchTarget = getProviderValidationTarget(
      baseSettings,
      "gemini",
      "search",
    );
    expect(llmTarget.model).toBe("gemini-3.6-flash");
    expect(ttsTarget.model).toBe("gemini-3.1-flash-tts-preview");
    expect(searchTarget.model).toBe("gemini-3.6-flash");
    const settings: Settings = {
      ...baseSettings,
      providerValidationResults: {
        gemini: {
          llm: {
            status: "success",
            model: "gemini-2.5-flash",
          },
          stt: {
            status: "success",
            model: sttTarget.model,
            configKey: sttTarget.configKey,
          },
          tts: {
            status: "success",
            model: ttsTarget.model,
            configKey: ttsTarget.configKey,
          },
          search: {
            status: "success",
            model: searchTarget.model,
            configKey: searchTarget.configKey,
          },
        },
      },
    };
    const screen = renderSettingsModal({
      focusProvider: "gemini",
      settings,
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("provider-card-gemini-header-control").props
          .accessibilityLabel,
      ).toContain("Working");
      expect(
        within(screen.getByTestId("provider-card-gemini")).getByTestId(
          "provider-health-gemini",
        ).props.accessibilityLabel,
      ).toBe("Working");
    });
  });

  it("explains the optional OpenRouter one-key route without hiding direct providers", async () => {
    const screen = renderSettingsModal({ focusProvider: "openrouter" });

    await waitFor(() => {
      expect(screen.getByText("One key, multiple providers")).toBeTruthy();
      expect(
        screen.getByText(
          "Request path: this device → OpenRouter → selected upstream provider",
        ),
      ).toBeTruthy();
      expect(screen.getByLabelText("OpenRouter keys: OpenRouter")).toBeTruthy();
      expect(screen.getByTestId("provider-vault-row-openai")).toBeTruthy();
      expect(screen.getByTestId("provider-vault-row-anthropic")).toBeTruthy();
    });
  });

  it("shows provider validation failures in a toast inside the modal", async () => {
    const errorMessage =
      "OpenAI rejected the credentials for reply generation. Check the API key and permissions.";
    const onValidateProviderCapability = jest.fn(async () => {
      throw new Error(errorMessage);
    });
    const onUpdateProviderValidationResult = jest.fn();
    const screen = renderSettingsModal({
      focusProvider: "openai",
      settings: {
        ...DEFAULT_SETTINGS,
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          openai: "invalid-key",
        },
      },
      onUpdateProviderValidationResult,
      onValidateProviderCapability,
    });

    await waitFor(() => {
      expect(screen.getByLabelText("Test LLM")).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText("Test LLM"));

    await waitFor(() => {
      expect(onValidateProviderCapability).toHaveBeenCalledWith(
        "openai",
        "llm",
      );
      expect(
        within(screen.getByTestId("toast")).getByText(errorMessage),
      ).toBeTruthy();
      expect(onUpdateProviderValidationResult).toHaveBeenCalledWith(
        "openai",
        "llm",
        expect.objectContaining({
          status: "error",
          message: errorMessage,
          model: expect.any(String),
        }),
      );
    });

    fireEvent.press(
      within(screen.getByTestId("toast")).getByLabelText("Dismiss"),
    );

    await waitFor(() => {
      expect(screen.queryByTestId("toast")).toBeNull();
    });
  });

  it("keeps an untested stored provider neutral", async () => {
    const screen = renderSettingsModal({
      settings: {
        ...DEFAULT_SETTINGS,
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          openai: "test-key",
        },
        webSearchProvider: "openai",
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Settings")).toBeTruthy();
    });

    fireEvent.press(screen.getByText("Connections"));

    await waitFor(() => {
      expect(screen.getByText("OpenAI")).toBeTruthy();
      const openAiRow = screen.getByTestId(
        "provider-card-openai-header-control",
      );
      expect(openAiRow.props.accessibilityLabel).toContain("Not tested");
      expect(
        within(screen.getByTestId("provider-card-openai")).getByText(
          "Not tested",
        ),
      ).toBeTruthy();
    });
  });

  it("shows a persisted validation success in green", async () => {
    const screen = renderSettingsModal({
      focusProvider: "openai",
      settings: {
        ...DEFAULT_SETTINGS,
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          openai: "working-key",
        },
        providerValidationResults: {
          openai: {
            llm: {
              status: "success",
              model: DEFAULT_SETTINGS.providerModels.openai,
            },
          },
        },
      },
    });

    await waitFor(() => {
      expect(
        within(
          screen.getByTestId("provider-capability-row-openai-llm"),
        ).getByText(/^Working/),
      ).toBeTruthy();
    });
  });

  it("restores a persisted validation failure after reload", async () => {
    const errorMessage = "OpenAI rejected the stored credentials.";
    const screen = renderSettingsModal({
      focusProvider: "openai",
      settings: {
        ...DEFAULT_SETTINGS,
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          openai: "invalid-key",
        },
        providerValidationResults: {
          openai: {
            llm: {
              status: "error",
              message: errorMessage,
              model: DEFAULT_SETTINGS.providerModels.openai,
            },
          },
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText(new RegExp(errorMessage))).toBeTruthy();
      expect(
        within(
          screen.getByTestId("provider-capability-row-openai-llm"),
        ).getByText(new RegExp(`^Invalid · ${errorMessage}`)),
      ).toBeTruthy();
    });
  });

  it("replaces a persisted failure after a successful retest", async () => {
    const onUpdateProviderValidationResult = jest.fn();
    const screen = renderSettingsModal({
      focusProvider: "openai",
      settings: {
        ...DEFAULT_SETTINGS,
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          openai: "replacement-key",
        },
        providerValidationResults: {
          openai: {
            llm: {
              status: "error",
              message: "Rejected credentials",
              model: DEFAULT_SETTINGS.providerModels.openai,
            },
          },
        },
      },
      onUpdateProviderValidationResult,
    });

    await waitFor(() => {
      expect(screen.getByLabelText("Test LLM")).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText("Test LLM"));

    await waitFor(() => {
      expect(onUpdateProviderValidationResult).toHaveBeenCalledWith(
        "openai",
        "llm",
        expect.objectContaining({
          status: "success",
          model: expect.any(String),
        }),
      );
      expect(
        within(
          screen.getByTestId("provider-capability-row-openai-llm"),
        ).getByText(/^Working/),
      ).toBeTruthy();
      expect(
        within(
          screen.getByTestId("provider-capability-row-openai-llm"),
        ).queryByText("Invalid"),
      ).toBeNull();
    });
  });

  it("opens Connections even when a catalog-only provider id is supplied", async () => {
    const screen = renderSettingsModal({
      focusCatalogProviderId: "ibm-watsonx",
    });

    await waitFor(() => {
      expect(screen.queryByText("Back to overview")).toBeNull();
      expect(screen.getByLabelText("Back to overview")).toBeTruthy();
      expect(screen.queryByPlaceholderText("Search services")).toBeNull();
      expect(screen.queryByText("System Prompt")).toBeNull();
    });
  });

  it("places Thinking, Search, and diagnostics controls in their drill-in pages", async () => {
    const screen = renderSettingsModal({
      settings: {
        ...DEFAULT_SETTINGS,
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          openai: "test-key",
        },
        webSearchMode: "on",
        webSearchProvider: "openai",
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Settings")).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText("Open Thinking"));

    await waitFor(() => {
      expect(screen.getByTestId("settings-modal-title").props.children).toBe(
        "Thinking",
      );
      expect(screen.getByText("Answering models")).toBeTruthy();
      expect(
        screen.getByText(
          "Up to four; the home screen switches who answers the next turn. A model you don't have yet is downloaded or connected right here.",
        ),
      ).toBeTruthy();
      expect(screen.getAllByText("System Prompt")).toHaveLength(2);
      expect(screen.queryByText("Provider")).toBeNull();
      expect(screen.getByTestId("thinking-slot-mode-1")).toBeTruthy();
      expect(screen.getByTestId("thinking-add-model")).toBeTruthy();
      expect(screen.getByText("Conversation defaults")).toBeTruthy();
      expect(
        screen.getByTestId("thinking-default-response-length"),
      ).toBeTruthy();
      expect(screen.getByTestId("thinking-default-response-tone")).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId("thinking-slot-mode-1"));
    expect(screen.getByTestId("thinking-slot-sheet")).toBeTruthy();
    expect(
      screen.getByText("Switchable from the home screen byline."),
    ).toBeTruthy();
    expect(screen.getByTestId("thinking-slot-provider")).toBeTruthy();
    expect(screen.getByTestId("thinking-slot-model")).toBeTruthy();
    expect(screen.getByTestId("thinking-remove-model")).toBeTruthy();
    fireEvent.press(screen.getAllByLabelText("Dismiss").at(-1)!);

    expect(
      screen.queryByText(
        "Shape the hidden guidance the model receives before every reply.",
      ),
    ).toBeNull();

    fireEvent.press(screen.getByTestId("thinking-system-prompt-row"));
    expect(screen.getByTestId("thinking-system-prompt-sheet")).toBeTruthy();
    expect(
      screen.getByText(
        "Shape the hidden guidance the model receives before every reply.",
      ),
    ).toBeTruthy();
    expect(screen.getByTestId("system-prompt-editor")).toBeTruthy();
    fireEvent.press(screen.getAllByLabelText("Dismiss").at(-1)!);

    fireEvent.press(screen.getByLabelText("Back to overview"));
    fireEvent.press(screen.getByLabelText("Open Search"));

    await waitFor(() => {
      expect(screen.getByTestId("settings-modal-title").props.children).toBe(
        "Search",
      );
      expect(screen.getByTestId("search-settings-page")).toBeTruthy();
      expect(screen.getByText("Who searches")).toBeTruthy();
      expect(
        screen.getByText(
          "Search runs inside an answer when the model decides it needs the web. Providers appear once connected under Connections.",
        ),
      ).toBeTruthy();
      expect(screen.getByTestId("settings-search-route-nobody")).toBeTruthy();
      expect(screen.getByLabelText("OpenAI").props.accessibilityState).toEqual({
        checked: true,
        disabled: false,
      });
      expect(screen.getByText("Search Quality")).toBeTruthy();
      expect(screen.getByTestId("web-search-result-limit")).toBeTruthy();
      expect(screen.getByTestId("web-search-search-mode")).toBeTruthy();
      expect(screen.queryByLabelText("About Web Search Provider")).toBeNull();
      expect(screen.queryByText("Answering models")).toBeNull();
    });

    fireEvent.press(screen.getByLabelText("Back to overview"));
    fireEvent.press(screen.getByLabelText("Open App & diagnostics"));

    await waitFor(() => {
      expect(screen.getByTestId("settings-modal-title").props.children).toBe(
        "App & diagnostics",
      );
      expect(screen.getByText("Theme")).toBeTruthy();
      expect(screen.getByTestId("app-settings-page-en")).toBeTruthy();
      expect(screen.getByTestId("app-language-picker")).toBeTruthy();
      expect(screen.getByText("Usage stats in transcripts")).toBeTruthy();
      expect(screen.getByText("Debug Log Button")).toBeTruthy();
      expect(
        screen.queryByText(
          "How to use the button: toggling it on will start capturing logs. Toggling it off will stop capturing logs and move the captured ones into the clipboard.",
        ),
      ).toBeNull();
      expect(screen.getByText("Recent Speech Activity")).toBeTruthy();
      expect(screen.queryByText("Web Search Provider")).toBeNull();
    });

    const languagePicker = screen.getByTestId("app-language-picker");
    fireEvent.press(languagePicker);
    expect(screen.UNSAFE_getByType(FlatList).props.data).toEqual(
      APP_LANGUAGE_OPTIONS,
    );
    expect(
      screen.getByTestId("app-language-picker-sheet-header-handle"),
    ).toBeTruthy();
    expect(screen.getByTestId("app-language-picker-option-uk")).toBeTruthy();
    fireEvent.press(
      screen.getByTestId("app-language-picker-sheet-header-handle"),
    );
    await waitFor(() => {
      expect(screen.queryByTestId("app-language-picker-sheet")).toBeNull();
    });

    fireEvent.press(languagePicker);
    fireEvent.press(screen.getByTestId("app-language-picker-option-en"));
    await waitFor(() => {
      expect(screen.queryByTestId("app-language-picker-sheet")).toBeNull();
    });
  });

  it("shows the entitlement simulator only for a .dev app variant", async () => {
    const releaseScreen = renderSettingsModal();

    fireEvent.press(releaseScreen.getByLabelText("Open App & diagnostics"));
    await waitFor(() => {
      expect(
        releaseScreen.getByTestId("settings-modal-title").props.children,
      ).toBe("App & diagnostics");
    });
    expect(
      releaseScreen.queryByTestId("development-entitlement-mode"),
    ).toBeNull();
    releaseScreen.unmount();

    const onSetDevelopmentEntitlementMode = jest.fn(async () => undefined);
    const developmentScreen = renderSettingsModal({
      developmentEntitlementMode: "free",
      onSetDevelopmentEntitlementMode,
    });

    fireEvent.press(developmentScreen.getByLabelText("Open App & diagnostics"));
    await waitFor(() => {
      expect(
        developmentScreen.getByTestId("development-entitlement-mode"),
      ).toBeTruthy();
    });
    expect(
      developmentScreen.getAllByText("Development entitlement").length,
    ).toBeGreaterThan(0);

    fireEvent.press(
      developmentScreen.getByTestId("development-entitlement-mode"),
    );
    fireEvent.press(
      developmentScreen.getByTestId(
        "development-entitlement-mode-option-premium",
      ),
    );
    expect(onSetDevelopmentEntitlementMode).toHaveBeenCalledWith("premium");
  });

  it("uses compact Input rows and the unified listening route picker", async () => {
    const onUpdate = jest.fn();
    const screen = renderSettingsModal({
      focusTab: "stt",
      onUpdate,
      settings: {
        ...DEFAULT_SETTINGS,
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          gemini: "configured-google-key",
        },
        sttMode: "provider",
        sttProvider: "gemini",
      },
    });

    await waitFor(() => {
      expect(screen.getByTestId("settings-modal-title").props.children).toBe(
        "Listening",
      );
      expect(screen.getByText("Voice Input")).toBeTruthy();
      expect(screen.queryByLabelText("About Voice Input")).toBeNull();
      expect(
        screen.getByTestId("input-mode-picker").props.accessibilityLabel,
      ).toBe("Input Mode. Toggle to Talk");
      expect(screen.getByTestId("conversation-languages-picker")).toBeTruthy();
      expect(screen.getByLabelText("Google").props.accessibilityState).toEqual({
        checked: true,
        disabled: false,
      });
      expect(
        screen.getByTestId("settings-stt-provider-gemini-model"),
      ).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId("input-mode-picker"));
    await waitFor(() => {
      expect(screen.getByTestId("input-mode-picker-sheet")).toBeTruthy();
    });
    fireEvent.press(
      screen.getByTestId("input-mode-picker-option-push-to-talk"),
    );
    expect(onUpdate).toHaveBeenCalledWith({ inputMode: "push-to-talk" });

    fireEvent.press(screen.getByTestId("conversation-languages-picker"));
    await waitFor(() => {
      expect(
        screen.getByTestId("conversation-languages-picker-sheet"),
      ).toBeTruthy();
    });
    fireEvent.press(
      screen.getByTestId("conversation-languages-picker-option-de"),
    );
    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        localLanguages: ["en", "de"],
        sttLanguage: "auto",
        ttsListenLanguages: ["en", "de"],
      }),
    );
  });

  it("offers discovered Mistral voice slugs and refreshes the directory", async () => {
    const onRefreshMistralVoices = jest.fn(async () => []);
    const onUpdateProviderTtsVoice = jest.fn();
    const screen = renderSettingsModal({
      focusTab: "tts",
      settings: {
        ...DEFAULT_SETTINGS,
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          mistral: "configured-mistral-key",
        },
        ttsMode: "provider",
        ttsProvider: "mistral",
        providerTtsVoices: {
          ...DEFAULT_SETTINGS.providerTtsVoices,
          mistral: "calm-guide",
        },
      },
      providerVoiceDirectories: {
        mistral: {
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
            {
              id: "voice-2",
              name: "Studio Voice",
              slug: "studio-voice",
              value: "studio-voice",
              label: "Studio Voice · studio-voice",
              languages: ["en", "de"],
              gender: null,
              isCustom: true,
            },
          ],
          status: "ready",
          error: null,
          refresh: onRefreshMistralVoices,
        },
      },
      onUpdateProviderTtsVoice,
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("settings-tts-provider-mistral-voice"),
      ).toBeTruthy();
      expect(screen.getByText("Calm Guide")).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId("settings-tts-provider-mistral-voice"));
    expect(screen.getByText("2 voices available from Mistral.")).toBeTruthy();
    expect(screen.getByText("Studio Voice")).toBeTruthy();

    fireEvent.press(screen.getByTestId("speaking-voice-picker-refresh"));
    expect(onRefreshMistralVoices).toHaveBeenCalledTimes(1);

    fireEvent.press(
      screen.getByTestId("speaking-voice-picker-option-studio-voice"),
    );

    expect(onUpdateProviderTtsVoice).toHaveBeenCalledWith(
      "mistral",
      "studio-voice",
    );
  });

  it("keeps the current Mistral voice available after directory errors", async () => {
    const onUpdateProviderTtsVoice = jest.fn();
    const screen = renderSettingsModal({
      focusTab: "tts",
      settings: {
        ...DEFAULT_SETTINGS,
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          mistral: "configured-mistral-key",
        },
        ttsMode: "provider",
        ttsProvider: "mistral",
        providerTtsVoices: {
          ...DEFAULT_SETTINGS.providerTtsVoices,
          mistral: "custom-voice",
        },
      },
      providerVoiceDirectories: {
        mistral: {
          voices: [],
          status: "error",
          error: new Error("Network unavailable"),
          refresh: jest.fn(async () => []),
        },
      },
      onUpdateProviderTtsVoice,
    });

    await waitFor(() =>
      expect(
        screen.getByTestId("settings-tts-provider-mistral-voice"),
      ).toBeTruthy(),
    );
    fireEvent.press(screen.getByTestId("settings-tts-provider-mistral-voice"));
    expect(screen.getAllByText("custom-voice").length).toBeGreaterThan(0);
    expect(screen.getByText(/Voices could not be refreshed/)).toBeTruthy();
    expect(screen.getByText(/Reason: Network unavailable/)).toBeTruthy();
    expect(onUpdateProviderTtsVoice).not.toHaveBeenCalled();
  });

  it("offers discovered ElevenLabs account voices and refreshes them", async () => {
    const refresh = jest.fn(async () => []);
    const onUpdateProviderTtsVoice = jest.fn();
    const screen = renderSettingsModal({
      focusTab: "tts",
      settings: {
        ...DEFAULT_SETTINGS,
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          elevenlabs: "configured-elevenlabs-key",
        },
        ttsMode: "provider",
        ttsProvider: "elevenlabs",
        providerTtsVoices: {
          ...DEFAULT_SETTINGS.providerTtsVoices,
          elevenlabs: "voice-1",
        },
      },
      providerVoiceDirectories: {
        elevenlabs: {
          voices: [
            {
              id: "voice-1",
              name: "Alex",
              value: "voice-1",
              label: "Alex · British · male",
              category: "premade",
              accent: "British",
              gender: "male",
              description: null,
              previewUrl: null,
            },
            {
              id: "voice-2",
              name: "Sam",
              value: "voice-2",
              label: "Sam · American",
              category: "cloned",
              accent: "American",
              gender: null,
              description: null,
              previewUrl: null,
            },
          ],
          status: "ready",
          error: null,
          refresh,
        },
      },
      onUpdateProviderTtsVoice,
    });

    await waitFor(() =>
      expect(
        screen.getByTestId("settings-tts-provider-elevenlabs-voice"),
      ).toBeTruthy(),
    );
    fireEvent.press(
      screen.getByTestId("settings-tts-provider-elevenlabs-voice"),
    );
    expect(
      screen.getByText("2 voices available from ElevenLabs."),
    ).toBeTruthy();
    expect(screen.getAllByText("Alex").length).toBeGreaterThan(0);
    expect(screen.getByText("British · male · premade")).toBeTruthy();

    fireEvent.press(screen.getByTestId("speaking-voice-picker-refresh"));
    expect(refresh).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByTestId("speaking-voice-picker-option-voice-2"));

    expect(onUpdateProviderTtsVoice).toHaveBeenCalledWith(
      "elevenlabs",
      "voice-2",
    );
  });

  it("keeps ElevenLabs TTS usable when a restricted key cannot list voices", async () => {
    const screen = renderSettingsModal({
      focusTab: "tts",
      settings: {
        ...DEFAULT_SETTINGS,
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          elevenlabs: "restricted-elevenlabs-key",
        },
        ttsMode: "provider",
        ttsProvider: "elevenlabs",
        providerTtsVoices: {
          ...DEFAULT_SETTINGS.providerTtsVoices,
          elevenlabs: "",
        },
      },
      providerVoiceDirectories: {
        elevenlabs: {
          voices: [],
          status: "error",
          error: new Error("Missing voices_read permission"),
          refresh: jest.fn(async () => []),
        },
      },
    });

    await waitFor(() =>
      expect(
        screen.getByTestId("settings-tts-provider-elevenlabs-voice"),
      ).toBeTruthy(),
    );
    fireEvent.press(
      screen.getByTestId("settings-tts-provider-elevenlabs-voice"),
    );
    expect(screen.getAllByText("Rachel (built-in)").length).toBeGreaterThan(0);
    expect(screen.getByText(/Account voices could not be loaded/)).toBeTruthy();
    expect(
      screen.getByText(/Reason: Missing voices_read permission/),
    ).toBeTruthy();
    expect(screen.getByText(/enable Voices → Read/)).toBeTruthy();
  });

  it("shows partial ElevenLabs permissions per capability without failing usable speech", async () => {
    const screen = renderSettingsModal({
      focusProvider: "elevenlabs",
      settings: {
        ...DEFAULT_SETTINGS,
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          elevenlabs: "restricted-elevenlabs-key",
        },
        providerValidationResults: {
          elevenlabs: {
            stt: {
              status: "success",
              model: DEFAULT_SETTINGS.providerSttModels.elevenlabs,
            },
            tts: {
              status: "success",
              model: DEFAULT_SETTINGS.providerTtsModels.elevenlabs,
              configKey: JSON.stringify({
                voice: DEFAULT_SETTINGS.providerTtsVoices.elevenlabs,
              }),
            },
            voices: {
              status: "error",
              message: "Missing voices_read permission",
              model: "",
            },
          },
        },
      },
    });

    await waitFor(() => {
      expect(
        within(
          screen.getByTestId("provider-capability-row-elevenlabs-stt"),
        ).getByText("Working"),
      ).toBeTruthy();
      expect(
        within(
          screen.getByTestId("provider-capability-row-elevenlabs-tts"),
        ).getByText("Working"),
      ).toBeTruthy();
      expect(
        within(
          screen.getByTestId("provider-capability-row-elevenlabs-voices"),
        ).getByText(/Invalid · Missing voices_read permission/),
      ).toBeTruthy();
      expect(screen.getByText(/Missing voices_read permission/)).toBeTruthy();
      expect(screen.getAllByText("Working").length).toBeGreaterThanOrEqual(2);
      expect(
        screen.getByText(/Invalid · Missing voices_read permission/),
      ).toBeTruthy();
    });
  });

  it("styles speech diagnostics clearing as destructive and requires confirmation", async () => {
    const clearSpeechDiagnosticsMock = jest.mocked(clearSpeechDiagnostics);
    jest.mocked(useSpeechDiagnostics).mockReturnValue([
      {
        id: "preview-1",
        requestId: "preview-1",
        createdAt: "2026-07-27T10:00:00.000Z",
        source: "preview",
        latestStage: "tts-succeeded",
        requestedRoute: "native",
        actualRoute: "native",
        language: "en",
        provider: null,
        providerModel: null,
        voice: null,
        fallbackReason: null,
        message: null,
        textLength: 12,
      },
    ]);
    const screen = renderSettingsModal();

    fireEvent.press(screen.getByLabelText("Open App & diagnostics"));

    await waitFor(() => {
      expect(screen.getByText("Recent Speech Activity")).toBeTruthy();
    });
    fireEvent.press(screen.getByTestId("speech-diagnostics-row"));

    const clearAction = screen.getByLabelText("Clear recent speech activity");
    expect(
      StyleSheet.flatten(
        screen.getByTestId("phosphor-icon-delete", hiddenIconQuery).props.style,
      ).color,
    ).toBe("#DC2626");

    fireEvent.press(clearAction);

    expect(clearSpeechDiagnosticsMock).not.toHaveBeenCalled();
    const getConfirmation = () =>
      screen
        .UNSAFE_getAllByType(NativeDialogType)
        .find(
          (modal) => modal.props.title === "Clear recent speech activity?",
        )!;
    let confirmation = getConfirmation();
    expect(confirmation.props.visible).toBe(true);
    expect(confirmation.props.title).toBe("Clear recent speech activity?");
    expect(confirmation.props.children.props.children).toBe(
      "This removes all captured speech-routing diagnostics. This action cannot be undone.",
    );

    const cancelAction = confirmation.props.footer.find(
      (action: { text: string }) => action.text === "Cancel",
    );
    act(() => {
      cancelAction.onPress();
    });
    confirmation = getConfirmation();
    expect(confirmation.props.visible).toBe(false);
    expect(clearSpeechDiagnosticsMock).not.toHaveBeenCalled();

    fireEvent.press(clearAction);
    confirmation = getConfirmation();
    const destructiveAction = confirmation.props.footer.find(
      (action: { text: string }) => action.text === "Clear",
    );
    expect(StyleSheet.flatten(destructiveAction.style).color).toBe(
      lightColors.danger,
    );
    act(() => {
      destructiveAction.onPress();
    });
    expect(clearSpeechDiagnosticsMock).toHaveBeenCalledTimes(1);
  });

  it("shows and clears provider-confirmed runtime compatibility overrides", async () => {
    await disableRuntimeCapabilityConfiguration({
      capability: "llm",
      disabledAt: 1,
      effort: "high",
      model: "gpt-5.6-sol",
      provider: "openai",
      reason: "configuration-unsupported",
    });
    const screen = renderSettingsModal();

    fireEvent.press(screen.getByLabelText("Open App & diagnostics"));

    await waitFor(() => {
      expect(screen.getByText("Runtime compatibility")).toBeTruthy();
    });
    fireEvent.press(
      screen.getByTestId("runtime-compatibility-overrides-section"),
    );
    await waitFor(() => {
      expect(screen.getByText("LLM · gpt-5.6-sol · high")).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText("Clear runtime compatibility"));
    const confirmation = screen
      .UNSAFE_getAllByType(NativeDialogType)
      .find((modal) => modal.props.title === "Clear runtime compatibility?")!;
    const clearAction = confirmation.props.footer.find(
      (action: { text: string }) => action.text === "Clear",
    );

    await act(async () => {
      await clearAction.onPress();
    });
    await waitFor(() => {
      expect(screen.queryByText("LLM · gpt-5.6-sol · high")).toBeNull();
    });
  });
});
