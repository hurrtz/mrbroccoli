import { act, renderHook, waitFor } from "@testing-library/react-native";

import { useFreeOfflineMode } from "../../src/screens/main/useFreeOfflineMode";
import { probeLocalDeviceCapabilities } from "../../src/services/localDeviceCapabilities";
import {
  getOfflineProfileReadiness,
  prepareOfflineProfile,
} from "../../src/services/offlineProfileManager";
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

jest.mock("../../src/services/offlineProfileManager", () => {
  const actual = jest.requireActual(
    "../../src/services/offlineProfileManager",
  );
  return {
    ...actual,
    getLocalCatalogInstallStatuses: jest.fn(async () => ({})),
    getOfflineProfileReadiness: jest.fn(async () => ({ ready: false })),
    prepareOfflineProfile: jest.fn(async () => undefined),
  };
});

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

const mockUseKeepAwakeWhile = jest.fn();

jest.mock("../../src/hooks/useKeepAwakeWhile", () => ({
  useKeepAwakeWhile: (...args: unknown[]) => mockUseKeepAwakeWhile(...args),
}));

jest.mock("../../src/features/settings-core/useNativeVoiceOptions", () => ({
  useNativeVoiceOptions: () => ({
    nativeVoiceOptions: [],
    selectedNativeVoice: "",
    setSelectedNativeVoice: jest.fn(),
  }),
}));

describe("useFreeOfflineMode", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("holds the screen awake for the whole preparation, not by default", () => {
    // Downloading and benchmarking a profile outlasts any default screen
    // timeout, and a sleeping phone aborted the download mid-setup.
    renderHook(() =>
      useFreeOfflineMode({
        settings: {
          ...DEFAULT_SETTINGS,
          freeOnboardingLanguageInitialized: true,
          freeOfflineSetupCompleted: false,
          localLanguages: ["en"],
        },
        settingsLoaded: true,
        suspended: true,
        updateSettings: jest.fn(),
      }),
    );

    expect(mockUseKeepAwakeWhile).toHaveBeenCalledWith(
      false,
      "mrbroccoli-offline-setup",
    );
  });

  it("suspends device and locale side effects for deterministic presentation fixtures", async () => {
    const updateSettings = jest.fn();
    renderHook(() =>
      useFreeOfflineMode({
        settings: {
          ...DEFAULT_SETTINGS,
          language: "ar",
          localLanguages: ["en"],
          freeOnboardingLanguageInitialized: true,
          freeOfflineSetupCompleted: false,
        },
        settingsLoaded: true,
        suspended: true,
        updateSettings,
      }),
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(probeLocalDeviceCapabilities).not.toHaveBeenCalled();
    expect(updateSettings).not.toHaveBeenCalled();
  });

  it("keeps required onboarding visible until model readiness is verified", () => {
    const updateSettings = jest.fn();
    const { result } = renderHook(() =>
      useFreeOfflineMode({
        settings: {
          ...DEFAULT_SETTINGS,
          localLanguages: ["en"],
          ttsListenLanguages: ["en"],
          sttLanguage: "en",
          freeOnboardingLanguageInitialized: true,
          freeOfflineSetupCompleted: false,
        },
        settingsLoaded: true,
        updateSettings,
      }),
    );

    // Preparation is no longer gated behind a takeover screen, but the Free
    // runtime still must not report itself ready until readiness is verified.
    expect(result.current.freeRuntimeReady).toBe(false);
    updateSettings.mockClear();

    act(() => result.current.start());

    expect(updateSettings).not.toHaveBeenCalledWith({
      freeOfflineSetupCompleted: true,
    });
    expect(result.current.freeRuntimeReady).toBe(false);
  });

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

  it("persists the completed local routes for the next app launch", async () => {
    jest.mocked(getOfflineProfileReadiness).mockResolvedValueOnce({
      ready: true,
      installed: true,
      failedModelId: null,
      installs: {},
      benchmarks: {},
    });
    const updateSettings = jest.fn();
    const { result } = renderHook(() =>
      useFreeOfflineMode({
        settings: {
          ...DEFAULT_SETTINGS,
          localLanguages: ["de"],
          ttsListenLanguages: ["de"],
          sttLanguage: "de",
          freeOnboardingLanguageInitialized: true,
          freeOfflineSetupCompleted: true,
        },
        settingsLoaded: true,
        updateSettings,
      }),
    );

    await waitFor(
      () => {
        expect(result.current.selection?.status).toBe("ready");
        expect(result.current.readiness?.ready).toBe(true);
      },
      { timeout: 2_500 },
    );

    act(() => result.current.start());

    const completion = updateSettings.mock.calls.find(
      ([partial]) => partial.freeOfflineSetupCompleted === true,
    )?.[0];
    expect(completion).toEqual(
      expect.objectContaining({
        activeResponseMode: "free-offline",
        freeOfflineSetupCompleted: true,
        responseModes: [
          expect.objectContaining({ id: "free-offline" }),
          expect.objectContaining({ id: "free-offline-thorough" }),
        ],
      }),
    );
  });

  it("preserves persisted provider response modes through Free setup completion", async () => {
    jest.mocked(getOfflineProfileReadiness).mockResolvedValueOnce({
      ready: true,
      installed: true,
      failedModelId: null,
      installs: {},
      benchmarks: {},
    });
    const providerMode = {
      id: "premium-openai",
      route: {
        provider: "openai" as const,
        model: "gpt-5.6-sol",
        runtime: "provider" as const,
      },
    };
    const updateSettings = jest.fn();
    const { result } = renderHook(() =>
      useFreeOfflineMode({
        settings: {
          ...DEFAULT_SETTINGS,
          responseModes: [providerMode],
          localLanguages: ["de"],
          ttsListenLanguages: ["de"],
          sttLanguage: "de",
          freeOnboardingLanguageInitialized: true,
          freeOfflineSetupCompleted: true,
        },
        settingsLoaded: true,
        updateSettings,
      }),
    );

    await waitFor(
      () => {
        expect(result.current.selection?.status).toBe("ready");
        expect(result.current.readiness?.ready).toBe(true);
      },
      { timeout: 2_500 },
    );

    act(() => result.current.start());

    const completion = updateSettings.mock.calls.find(
      ([partial]) => partial.freeOfflineSetupCompleted === true,
    )?.[0];
    expect(completion?.responseModes).toEqual([
      expect.objectContaining({ id: "free-offline" }),
      expect.objectContaining({ id: "free-offline-thorough" }),
      providerMode,
    ]);
  });

  it("keeps the recommendation immutable while preserving a hidden custom draft", async () => {
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
          freeOfflineProfileOverrides: {
            quickLlmModelId: "qwen3-0.6b-q8",
          },
        },
        settingsLoaded: true,
        updateSettings,
      }),
    );

    await waitFor(
      () => {
        expect(result.current.recommendedSelection?.status).toBe("ready");
        expect(result.current.customSelection?.status).toBe("ready");
      },
      { timeout: 2_500 },
    );
    if (
      result.current.recommendedSelection?.status !== "ready" ||
      result.current.customSelection?.status !== "ready"
    ) {
      throw new Error("Expected both Free setup profiles");
    }

    expect(result.current.recommendedSelection.profile.llm.id).toBe(
      "granite-4.0-1b-q4",
    );
    expect(result.current.customSelection.profile.llm.id).toBe(
      "qwen3-0.6b-q8",
    );
    expect(result.current.selection?.status).toBe("ready");
    expect(
      result.current.selection?.status === "ready"
        ? result.current.selection.profile.llm.id
        : null,
    ).toBe("qwen3-0.6b-q8");

    // The blocking wizard used to show the recommendation until the user opted
    // into advanced options. Without it there is only runtime, where a stored
    // override has always applied -- but the recommendation must still be
    // computed and left untouched, because it is what a reset falls back to.
    act(() => result.current.selectKokoroVoice("af_bella"));
    expect(result.current.selectedKokoroVoice).toBe("af_bella");
    expect(result.current.recommendedSelection?.status === "ready"
      ? result.current.recommendedSelection.profile.llm.id
      : null,
    ).toBe("granite-4.0-1b-q4");
    expect(
      result.current.customSelection?.status === "ready"
        ? result.current.customSelection.profile.llm.id
        : null,
    ).toBe("qwen3-0.6b-q8");

    await act(async () => {
      await result.current.prepare();
    });
    expect(jest.mocked(prepareOfflineProfile)).toHaveBeenLastCalledWith(
      expect.objectContaining({
        llm: expect.objectContaining({ id: "qwen3-0.6b-q8" }),
      }),
      expect.any(Object),
    );


    act(() => result.current.setAdvancedOptionsEnabled(true));
    expect(
      result.current.customSelection?.status === "ready"
        ? result.current.customSelection.profile.llm.id
        : null,
    ).toBe("qwen3-0.6b-q8");
  });

  it("waits about two seconds after an explicit language choice before revealing a recommendation", async () => {
    jest.useFakeTimers();
    const updateSettings = jest.fn();
    const { result, unmount } = renderHook(() =>
      useFreeOfflineMode({
        settings: {
          ...DEFAULT_SETTINGS,
          freeOnboardingLanguageInitialized: true,
          freeOfflineSetupCompleted: false,
        },
        settingsLoaded: true,
        updateSettings,
      }),
    );

    try {
      expect(result.current.selectedLanguage).toBeNull();
      expect(result.current.selection).toBeNull();

      act(() => result.current.selectLanguage("en"));
      await act(async () => {
        await Promise.resolve();
      });

      expect(result.current.checking).toBe(true);
      await act(async () => {
        await jest.advanceTimersByTimeAsync(1_999);
      });
      expect(result.current.selection).toBeNull();

      await act(async () => {
        await jest.advanceTimersByTimeAsync(1);
      });
      expect(result.current.checking).toBe(false);
      expect(result.current.selection?.status).toBe("ready");
    } finally {
      unmount();
      jest.useRealTimers();
    }
  });

  it("uses the storefront only for a fresh install's interface language", async () => {
    const updateSettings = jest.fn();
    const { result } = renderHook(() =>
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
        });
      },
      { timeout: 1_000 },
    );
    expect(result.current.selectedLanguage).toBeNull();
    expect(result.current.selection).toBeNull();
  });
});
