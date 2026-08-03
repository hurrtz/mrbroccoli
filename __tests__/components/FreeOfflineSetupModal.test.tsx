import React from "react";
import { fireEvent } from "@testing-library/react-native";

import { FreeOfflineSetupModal } from "../../src/components/FreeOfflineSetupModal";
import type { FreeOfflineModeController } from "../../src/screens/main/useFreeOfflineMode";
import {
  getOfflineProfileModels,
  selectOfflineProfile,
} from "../../src/services/offlineProfile";
import type { LocalDeviceSnapshot } from "../../src/services/localDeviceCapabilities";
import { DEFAULT_SETTINGS } from "../../src/types";
import { renderWithProviders } from "../test-utils/renderWithProviders";

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
    modalVisible: true,
    setModalVisible: jest.fn(),
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
    selection,
    readiness: { ready: true } as FreeOfflineModeController["readiness"],
    installs: {},
    benchmarks: {},
    overrides: {},
    error: null,
    selectedLanguage: "en",
    selectLanguage: jest.fn(),
    selectQuickLlm: jest.fn(),
    selectThoroughLlm: jest.fn(),
    selectStt: jest.fn(),
    selectTts: jest.fn(),
    nativeVoiceOptions: [
      { value: "com.apple.voice", label: "Samantha · en-US" },
    ],
    selectedNativeVoice: "com.apple.voice",
    selectNativeVoice: jest.fn(),
    selectKokoroVoice: jest.fn(),
    start: jest.fn(),
    prepare: jest.fn(async () => undefined),
    refresh: jest.fn(async () => null),
  };
}

describe("FreeOfflineSetupModal", () => {
  it("offers seven single-choice languages and ends with one clear start action", () => {
    const controller = freeController();
    const screen = renderWithProviders(
      <FreeOfflineSetupModal controller={controller} />,
    );

    expect(screen.getByText("1 · Choose your speaking language")).toBeTruthy();
    expect(screen.getByText("2 · Prepare private AI")).toBeTruthy();
    expect(screen.getByText("3 · Start talking")).toBeTruthy();
    expect(screen.getAllByRole("radio")).toHaveLength(7);
    expect(screen.queryByText("Simplified Chinese")).toBeNull();

    fireEvent.press(screen.getByTestId("free-language-it"));
    expect(controller.selectLanguage).toHaveBeenCalledWith("it");

    fireEvent.press(screen.getByText("Start talking"));
    expect(controller.start).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Unlock Premium")).toBeNull();
  });

  it("reveals device evidence and every compatible model choice on demand", () => {
    const controller = freeController();
    const screen = renderWithProviders(
      <FreeOfflineSetupModal controller={controller} />,
    );

    fireEvent.press(screen.getByTestId("onboarding-advanced-toggle"));

    expect(screen.getByText("Phone details")).toBeTruthy();
    expect(screen.getByText("Quick responses")).toBeTruthy();
    expect(screen.getByText("Thorough reasoning")).toBeTruthy();
    expect(screen.getByText("Omnilingual ASR 300M")).toBeTruthy();
    expect(screen.getByText("Piper · Kristin")).toBeTruthy();
    expect(screen.getByTestId("onboarding-native-stt")).toBeTruthy();
    expect(screen.getByTestId("onboarding-kokoro-voice")).toBeTruthy();
    expect(screen.getByText(/Larger models can respond/)).toBeTruthy();

    fireEvent.press(
      screen.getByTestId("onboarding-model-omnilingual-asr-300m"),
    );
    expect(controller.selectStt).toHaveBeenCalledWith("omnilingual-asr-300m");
    fireEvent.press(screen.getByTestId("onboarding-native-stt"));
    expect(controller.selectStt).toHaveBeenCalledWith(null);
  });

  it("shows a readable matching stage while the recommendation is evaluated", () => {
    const controller = {
      ...freeController(),
      checking: true,
      evaluationStage: "models" as const,
    };
    const screen = renderWithProviders(
      <FreeOfflineSetupModal controller={controller} />,
    );

    expect(screen.getByText("Matching the best local models…")).toBeTruthy();
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
      <FreeOfflineSetupModal controller={controller} />,
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
});
