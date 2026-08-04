import React from "react";
import { StyleSheet } from "react-native";
import { fireEvent, within } from "@testing-library/react-native";

import { FreeOfflineSetupScreen } from "../../src/components/FreeOfflineSetupScreen";
import type { FreeOfflineModeController } from "../../src/screens/main/useFreeOfflineMode";
import {
  getOfflineProfileModels,
  selectOfflineProfile,
} from "../../src/services/offlineProfile";
import type { LocalDeviceSnapshot } from "../../src/services/localDeviceCapabilities";
import { DEFAULT_SETTINGS } from "../../src/types";
import { renderWithProviders } from "../test-utils/renderWithProviders";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ bottom: 24, left: 0, right: 0, top: 0 }),
}));

const GIB = 1024 ** 3;

function freeController(): FreeOfflineModeController {
  const snapshot: LocalDeviceSnapshot = {
    version: 1,
    capturedAt: "2026-08-02T00:00:00.000Z",
    platform: "ios",
    physicalMemoryBytes: 8 * GIB,
    availableMemoryBytes: 5 * GIB,
    freeStorageBytes: 10 * GIB,
    totalStorageBytes: 128 * GIB,
    processorCount: 8,
    activeProcessorCount: 8,
    architecture: "arm64",
    osVersion: "26.5.2",
    lowPowerMode: false,
    memoryLow: false,
    thermalState: "nominal",
  };
  const selection = selectOfflineProfile({
    languages: ["en"],
    snapshot,
  });
  if (selection.status !== "ready") {
    throw new Error("Expected a Free profile");
  }

  return {
    effectiveSettings: {
      ...DEFAULT_SETTINGS,
      localLanguages: ["en"],
    },
    entitlement: {} as FreeOfflineModeController["entitlement"],
    freeRuntimeReady: true,
    setupVisible: true,
    openSetup: jest.fn(),
    checking: false,
    evaluationStage: null,
    preparing: false,
    preparationProgress: null,
    estimatedSetupSeconds: 120,
    preparationEtaSeconds: null,
    snapshot,
    nativeSpeechCapabilities: {
      recognitionAvailable: true,
      onDeviceRecognitionAvailable: true,
      targetLocaleInstalled: true,
      nativeSttEligible: true,
    },
    recommendedSelection: selection,
    customSelection: selection,
    selection,
    recommendedReadiness: {
      ready: true,
    } as FreeOfflineModeController["recommendedReadiness"],
    customReadiness: {
      ready: true,
    } as FreeOfflineModeController["customReadiness"],
    readiness: { ready: true } as FreeOfflineModeController["readiness"],
    installs: {},
    benchmarks: {},
    overrides: {},
    error: null,
    selectedLanguage: "en",
    selectLanguage: jest.fn(),
    advancedOptionsEnabled: false,
    setAdvancedOptionsEnabled: jest.fn(),
    hasCustomSelections: false,
    selectQuickLlm: jest.fn(),
    selectThoroughLlm: jest.fn(),
    selectStt: jest.fn(),
    selectTts: jest.fn(),
    nativeVoiceOptions: [
      { value: "com.apple.voice", label: "Samantha · en-US" },
    ],
    selectedNativeVoice: "com.apple.voice",
    selectNativeVoice: jest.fn(),
    selectedKokoroVoice: DEFAULT_SETTINGS.kokoroVoices.en,
    selectKokoroVoice: jest.fn(),
    recommendedEstimatedSetupSeconds: 120,
    customEstimatedSetupSeconds: 120,
    start: jest.fn(),
    prepare: jest.fn(async () => undefined),
    refresh: jest.fn(async () => null),
  };
}

describe("FreeOfflineSetupScreen", () => {
  it("uses the full screen, matches the app wordmark, and offers no close action", () => {
    const controller = freeController();
    const screen = renderWithProviders(
      <FreeOfflineSetupScreen controller={controller} />,
    );

    expect(screen.getByTestId("free-offline-setup-screen")).toBeTruthy();
    expect(
      StyleSheet.flatten(
        screen.getByTestId("free-offline-setup-screen").props.style,
      ).flex,
    ).toBe(1);
    expect(screen.getByTestId("free-offline-wordmark").props.children).toBe(
      "Mr Broccoli",
    );
    expect(
      StyleSheet.flatten(screen.getByTestId("free-offline-header").props.style),
    ).toEqual(
      expect.objectContaining({
        minHeight: 62,
        paddingTop: 8,
        paddingBottom: 10,
      }),
    );
    expect(screen.queryByText("Private on-device mode")).toBeNull();
    expect(
      screen.getByText(
        "Choose your language while Mr Broccoli checks this phone and recommends the best private listening, reasoning, and voice setup it can run reliably. Tap Start to download, install, and test everything before your first conversation.",
      ),
    ).toBeTruthy();
    expect(screen.queryByText("Done")).toBeNull();
    expect(
      StyleSheet.flatten(
        screen.getByTestId("free-offline-content").props.contentContainerStyle,
      ).gap,
    ).toBe(20);
    expect(
      StyleSheet.flatten(
        screen.getByTestId("free-offline-footer").props.style,
      ).paddingBottom,
    ).toBe(24);
  });

  it("offers seven languages in a dropdown and ends with one clear start action", () => {
    const controller = freeController();
    const screen = renderWithProviders(
      <FreeOfflineSetupScreen controller={controller} />,
    );

    expect(screen.queryByText("Choose your language")).toBeNull();
    expect(screen.getByText("Your best setup")).toBeTruthy();
    expect(screen.queryByText("Language")).toBeNull();
    expect(screen.queryAllByRole("radio")).toHaveLength(0);

    fireEvent.press(screen.getByTestId("free-language-picker"));
    expect(screen.getByRole("header").props.children).toBe(
      "Choose your language",
    );
    expect(screen.getAllByRole("radio")).toHaveLength(7);
    expect(screen.queryByText("Simplified Chinese")).toBeNull();

    fireEvent.press(screen.getByText("Italian"));
    expect(controller.selectLanguage).toHaveBeenCalledWith("it");

    fireEvent.press(screen.getByText("Start"));
    expect(controller.start).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Unlock Premium")).toBeNull();
  });

  it("starts with no language choice or recommendation and a disabled start action", () => {
    const controller: FreeOfflineModeController = {
      ...freeController(),
      freeRuntimeReady: false,
      selectedLanguage: null,
      recommendedSelection: null,
      customSelection: null,
      selection: null,
      recommendedReadiness: null,
      customReadiness: null,
      readiness: null,
    };
    const screen = renderWithProviders(
      <FreeOfflineSetupScreen controller={controller} />,
    );

    expect(screen.getByText("Choose your language")).toBeTruthy();
    expect(screen.queryByText("English")).toBeNull();
    expect(screen.queryByText("Your best setup")).toBeNull();
    expect(
      screen.queryByTestId("onboarding-recommendation-card"),
    ).toBeNull();
    const start = screen.getByTestId("free-offline-primary-action");
    expect(start.props.accessibilityState).toEqual({
      busy: false,
      disabled: true,
    });
    expect(screen.getByText("Start")).toBeTruthy();

    fireEvent.press(start);
    expect(controller.start).not.toHaveBeenCalled();
    expect(controller.prepare).not.toHaveBeenCalled();
    expect(controller.refresh).not.toHaveBeenCalled();

    fireEvent.press(screen.getByTestId("free-language-picker"));
    expect(screen.getAllByRole("radio")).toHaveLength(7);
  });

  it("presents the recommendation as a personalized highlight with a compact advanced checkbox", () => {
    const controller = freeController();
    const screen = renderWithProviders(
      <FreeOfflineSetupScreen controller={controller} />,
    );

    expect(
      StyleSheet.flatten(
        screen.getByTestId("onboarding-recommendation-card").props.style,
      ).borderRadius,
    ).toBe(12);
    expect(
      StyleSheet.flatten(
        screen.getByTestId("onboarding-recommendation-section").props.style,
      ).marginTop,
    ).toBe(8);
    expect(screen.getAllByText("Your best setup")).toHaveLength(1);
    expect(screen.queryByText("Best match for you and this phone")).toBeNull();
    expect(screen.getByText("Quick responses")).toBeTruthy();
    expect(screen.getByText("Speech to Text")).toBeTruthy();
    expect(screen.getByText("Text to Speech")).toBeTruthy();
    expect(
      React.Children.count(
        screen.getByTestId("onboarding-recommendation-header").props.children,
      ),
    ).toBe(2);

    const advanced = screen.getByTestId("onboarding-advanced-toggle");
    expect(advanced.props.accessibilityRole).toBe("checkbox");
    expect(advanced.props.accessibilityState).toEqual({
      checked: false,
      disabled: false,
    });
    expect(StyleSheet.flatten(advanced.props.style)).toEqual(
      expect.objectContaining({ alignSelf: "flex-end" }),
    );

    fireEvent.press(advanced);
    expect(controller.setAdvancedOptionsEnabled).toHaveBeenCalledWith(true);
  });

  it("reveals device evidence and every compatible model choice on demand", () => {
    const base = freeController();
    const controller: FreeOfflineModeController = {
      ...base,
      advancedOptionsEnabled: true,
      benchmarks: {
        "qwen3-0.6b-q8": {
          modelId: "qwen3-0.6b-q8",
          catalogVersion: 2,
          testedAt: "2026-08-04T00:00:00.000Z",
          status: "viable",
          loadMs: 420,
          durationMs: 2_000,
          tokensPerSecond: 12.4,
          device: base.snapshot!,
        },
      },
    };
    const screen = renderWithProviders(
      <FreeOfflineSetupScreen controller={controller} />,
    );

    expect(screen.getByText("Phone details")).toBeTruthy();
    expect(screen.getByText("Your selected setup")).toBeTruthy();
    expect(screen.getAllByText("Quick responses")).toHaveLength(3);
    expect(screen.getAllByText("Thorough reasoning")).toHaveLength(3);
    expect(screen.getByText("Omnilingual ASR 300M")).toBeTruthy();
    expect(screen.getByText("Piper · Kristin")).toBeTruthy();
    expect(screen.getByTestId("onboarding-native-stt")).toBeTruthy();
    expect(
      within(
        screen.getByTestId("onboarding-model-kokoro-multilingual-card"),
      ).getByTestId("onboarding-kokoro-voice"),
    ).toBeTruthy();
    const phoneHeading = StyleSheet.flatten(
      screen.getByTestId("onboarding-heading-phone").props.style,
    );
    for (const testID of [
      "onboarding-heading-quick",
      "onboarding-heading-thorough",
      "onboarding-heading-listening",
      "onboarding-heading-speaking",
    ]) {
      expect(StyleSheet.flatten(screen.getByTestId(testID).props.style)).toEqual(
        phoneHeading,
      );
    }
    expect(screen.getByText(/Larger models can respond/)).toBeTruthy();
    expect(
      screen.getByText("Measured on this phone · Test passed"),
    ).toBeTruthy();
    expect(screen.getByText(/12.4 tok\/s · 420 ms load/)).toBeTruthy();
    expect(screen.getByText(/Predictions are estimates/)).toBeTruthy();

    fireEvent.press(
      screen.getByTestId("onboarding-model-omnilingual-asr-300m"),
    );
    expect(controller.selectStt).toHaveBeenCalledWith("omnilingual-asr-300m");
    fireEvent.press(screen.getByTestId("onboarding-native-stt"));
    expect(controller.selectStt).toHaveBeenCalledWith(null);
  });

  it("keeps the best setup fixed while the advanced summary reflects custom choices", () => {
    const base = freeController();
    const customSelection = selectOfflineProfile({
      languages: ["en"],
      snapshot: base.snapshot!,
      overrides: { quickLlmModelId: "qwen3-0.6b-q8" },
    });
    if (
      base.recommendedSelection?.status !== "ready" ||
      customSelection.status !== "ready"
    ) {
      throw new Error("Expected recommended and custom Free profiles");
    }
    const controller: FreeOfflineModeController = {
      ...base,
      advancedOptionsEnabled: true,
      customSelection,
      selection: customSelection,
      hasCustomSelections: true,
    };
    const screen = renderWithProviders(
      <FreeOfflineSetupScreen controller={controller} />,
    );

    expect(
      within(screen.getByTestId("onboarding-recommendation-card")).getByText(
        base.recommendedSelection.profile.llm.name,
      ),
    ).toBeTruthy();
    expect(
      within(screen.getByTestId("onboarding-custom-setup-card")).getByText(
        customSelection.profile.llm.name,
      ),
    ).toBeTruthy();
    expect(
      within(
        screen.getByTestId("onboarding-recommendation-card"),
      ).queryByText(customSelection.profile.llm.name),
    ).toBeNull();
  });

  it("keeps the selected system voice inside its TTS option", () => {
    const base = freeController();
    const customSelection = selectOfflineProfile({
      languages: ["en"],
      snapshot: base.snapshot!,
      overrides: { ttsModelId: null },
    });
    if (customSelection.status !== "ready") {
      throw new Error("Expected a native-voice Free profile");
    }
    const controller: FreeOfflineModeController = {
      ...base,
      advancedOptionsEnabled: true,
      customSelection,
      selection: customSelection,
      hasCustomSelections: true,
    };
    const screen = renderWithProviders(
      <FreeOfflineSetupScreen controller={controller} />,
    );

    expect(
      within(screen.getByTestId("onboarding-native-tts-card")).getByTestId(
        "onboarding-native-voice",
      ),
    ).toBeTruthy();
  });

  it("shows a readable matching stage while the recommendation is evaluated", () => {
    const controller = {
      ...freeController(),
      checking: true,
      evaluationStage: "models" as const,
      recommendedSelection: null,
      customSelection: null,
      selection: null,
      recommendedReadiness: null,
      customReadiness: null,
      readiness: null,
    };
    const screen = renderWithProviders(
      <FreeOfflineSetupScreen controller={controller} />,
    );

    expect(
      screen.getByTestId("onboarding-recommendation-spinner"),
    ).toBeTruthy();
    expect(screen.getByText("Matching the best local models…")).toBeTruthy();
    expect(screen.queryByText("Your best setup")).toBeNull();
    expect(
      screen.queryByTestId("onboarding-recommendation-card"),
    ).toBeNull();
    expect(
      screen.getByTestId("free-offline-primary-action").props
        .accessibilityState,
    ).toEqual({ busy: false, disabled: true });
  });

  it("shows per-step progress, remaining steps, and ETA", () => {
    const base = freeController();
    if (base.selection?.status !== "ready") {
      throw new Error("Expected a Free profile");
    }
    const models = getOfflineProfileModels(base.selection.profile);
    const current = models[1];
    const controller: FreeOfflineModeController = {
      ...base,
      freeRuntimeReady: false,
      preparing: true,
      preparationEtaSeconds: 90,
      preparationProgress: {
        modelId: current.id,
        stepIndex: 1,
        stepCount: models.length * 2,
        stepsRemaining: models.length * 2 - 1,
        action: "downloading",
        stepProgress: 0.5,
        download: { phase: "downloading", progress: 0.5 },
      },
      readiness: { ready: false } as FreeOfflineModeController["readiness"],
    };
    const screen = renderWithProviders(
      <FreeOfflineSetupScreen controller={controller} />,
    );

    expect(
      screen.getByTestId("onboarding-download-progress").props
        .accessibilityValue,
    ).toEqual({ min: 0, max: 100, now: 50 });
    expect(
      screen.getByText(
        `${models.length * 2 - 1} of ${models.length * 2} steps remaining`,
      ),
    ).toBeTruthy();
  });

  it("explains an automatic thermal pause without failing setup", () => {
    const base = freeController();
    if (base.selection?.status !== "ready") {
      throw new Error("Expected a Free profile");
    }
    const controller: FreeOfflineModeController = {
      ...base,
      preparing: true,
      preparationProgress: {
        modelId: base.selection.profile.llm.id,
        stepIndex: 0,
        stepCount: 3,
        stepsRemaining: 3,
        action: "cooling",
        stepProgress: null,
      },
      readiness: { ready: false } as FreeOfflineModeController["readiness"],
    };

    const screen = renderWithProviders(
      <FreeOfflineSetupScreen controller={controller} />,
    );

    expect(
      screen.getByText("Letting the phone cool down before continuing…"),
    ).toBeTruthy();
    expect(screen.queryByTestId("onboarding-download-progress")).toBeNull();
  });
});
