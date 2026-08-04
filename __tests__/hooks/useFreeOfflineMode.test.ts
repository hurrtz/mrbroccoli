import { act, renderHook, waitFor } from "@testing-library/react-native";

import { useFreeOfflineMode } from "../../src/screens/main/useFreeOfflineMode";
import { DEFAULT_SETTINGS, type Settings } from "../../src/types";

jest.mock("../../src/context/PremiumEntitlementContext", () => ({
  usePremiumEntitlement: () => ({ status: "free" }),
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
      capturedAt: "2026-08-03T10:00:00.000Z",
      platform: "ios",
      physicalMemoryBytes: 8 * 1024 ** 3,
      availableMemoryBytes: 5 * 1024 ** 3,
      freeStorageBytes: 20 * 1024 ** 3,
      totalStorageBytes: 128 * 1024 ** 3,
      processorCount: 8,
      activeProcessorCount: 8,
      architecture: "arm64",
      osVersion: "26.5.2",
      lowPowerMode: false,
      memoryLow: false,
      thermalState: "nominal",
    })),
  };
});

jest.mock("../../src/services/offlineProfileManager", () => ({
  getLocalCatalogInstallStatuses: jest.fn(async () => ({})),
  getOfflineProfileReadiness: jest.fn(async () => ({ ready: false })),
  prepareOfflineProfile: jest.fn(async () => undefined),
}));

jest.mock("../../src/services/freeOnboardingLanguage", () => ({
  getFreeOnboardingLanguageFromStorefront: jest.fn(async () => "en"),
}));

jest.mock("../../src/services/nativeSpeechCapabilities", () => ({
  probeNativeSpeechCapabilities: jest.fn(async () => ({
    recognitionAvailable: true,
    onDeviceRecognitionAvailable: true,
    targetLocaleInstalled: true,
    nativeSttEligible: true,
  })),
}));

jest.mock("../../src/features/settings-core/useNativeVoiceOptions", () => ({
  useNativeVoiceOptions: () => ({
    nativeVoiceOptions: [],
    selectedNativeVoice: "",
    setSelectedNativeVoice: jest.fn(),
  }),
}));

describe("useFreeOfflineMode", () => {
  it("normalizes legacy multi-language Free settings to one supported language", async () => {
    const updateSettings = jest.fn();
    const settings: Settings = {
      ...DEFAULT_SETTINGS,
      localLanguages: ["de", "zh-CN"],
      ttsListenLanguages: ["de", "zh-CN"],
      sttLanguage: "auto",
      freeOnboardingLanguageInitialized: true,
      freeOfflineSetupCompleted: true,
    };
    const { result } = renderHook(() =>
      useFreeOfflineMode({
        settings,
        settingsLoaded: true,
        updateSettings,
      }),
    );

    expect(result.current.selectedLanguage).toBe("de");
    await waitFor(() => {
      expect(updateSettings).toHaveBeenCalledWith({
        language: "de",
        localLanguages: ["de"],
        ttsListenLanguages: ["de"],
        sttLanguage: "de",
      });
    });
    await waitFor(
      () => expect(result.current.selection?.status).toBe("ready"),
      {
        timeout: 2_500,
      },
    );
  });

  it("replaces the preferred language instead of accumulating selections", async () => {
    const updateSettings = jest.fn();
    const { result } = renderHook(() =>
      useFreeOfflineMode({
        settings: {
          ...DEFAULT_SETTINGS,
          localLanguages: ["en"],
          ttsListenLanguages: ["en"],
          sttLanguage: "en",
          freeOnboardingLanguageInitialized: true,
          freeOfflineSetupCompleted: true,
        },
        settingsLoaded: true,
        updateSettings,
      }),
    );

    await waitFor(
      () => expect(result.current.selection?.status).toBe("ready"),
      {
        timeout: 2_500,
      },
    );

    act(() => result.current.selectLanguage("it"));

    expect(updateSettings).toHaveBeenCalledWith({
      freeOnboardingLanguageInitialized: true,
      freeOfflineSetupCompleted: false,
      freeOfflineProfileOverrides: {},
      language: "it",
      localLanguages: ["it"],
      ttsListenLanguages: ["it"],
      sttLanguage: "it",
    });
  });

  it("persists an advanced model choice for the same phone", async () => {
    const updateSettings = jest.fn();
    const { result } = renderHook(() =>
      useFreeOfflineMode({
        settings: {
          ...DEFAULT_SETTINGS,
          localLanguages: ["en"],
          ttsListenLanguages: ["en"],
          sttLanguage: "en",
          freeOnboardingLanguageInitialized: true,
          freeOfflineSetupCompleted: true,
        },
        settingsLoaded: true,
        updateSettings,
      }),
    );

    await waitFor(
      () => expect(result.current.selection?.status).toBe("ready"),
      {
        timeout: 2_500,
      },
    );
    act(() => result.current.selectStt("omnilingual-asr-300m"));

    expect(updateSettings).toHaveBeenCalledWith({
      freeOfflineSetupCompleted: false,
      freeOfflineProfileOverrides: {
        sttModelId: "omnilingual-asr-300m",
      },
    });
  });

  it("initializes a fresh install from the storefront recommendation", async () => {
    const updateSettings = jest.fn();
    renderHook(() =>
      useFreeOfflineMode({
        settings: DEFAULT_SETTINGS,
        settingsLoaded: true,
        updateSettings,
      }),
    );

    await waitFor(
      () => {
        expect(updateSettings).toHaveBeenCalledWith({
          freeOnboardingLanguageInitialized: true,
          language: "en",
          localLanguages: ["en"],
          ttsListenLanguages: ["en"],
          sttLanguage: "en",
        });
      },
      { timeout: 4_500 },
    );
  });
});
