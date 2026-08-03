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
    prepare: jest.fn(async () => undefined),
    refresh: jest.fn(async () => null),
  };
}

describe("FreeOfflineSetupModal", () => {
  it("offers seven single-choice languages and ends with one clear start action", () => {
    const controller = freeController();
    const screen = renderWithProviders(
      <FreeOfflineSetupModal
        controller={controller}
        onOpenPremium={jest.fn()}
      />,
    );

    expect(screen.getByText("1 · Choose your speaking language")).toBeTruthy();
    expect(screen.getByText("2 · Prepare private AI")).toBeTruthy();
    expect(screen.getByText("3 · Start talking")).toBeTruthy();
    expect(screen.getAllByRole("radio")).toHaveLength(7);
    expect(screen.queryByText("Simplified Chinese")).toBeNull();

    fireEvent.press(screen.getByTestId("free-language-it"));
    expect(controller.selectLanguage).toHaveBeenCalledWith("it");

    fireEvent.press(screen.getByText("Start talking"));
    expect(controller.setModalVisible).toHaveBeenCalledWith(false);
  });

  it("reveals device evidence and every compatible model choice on demand", () => {
    const controller = freeController();
    const screen = renderWithProviders(
      <FreeOfflineSetupModal
        controller={controller}
        onOpenPremium={jest.fn()}
      />,
    );

    fireEvent.press(screen.getByTestId("onboarding-advanced-toggle"));

    expect(screen.getByText("Phone details")).toBeTruthy();
    expect(screen.getByText("Quick responses")).toBeTruthy();
    expect(screen.getByText("Thorough reasoning")).toBeTruthy();
    expect(screen.getByText("Omnilingual ASR 300M")).toBeTruthy();
    expect(screen.getByText("Piper · Kristin")).toBeTruthy();
    expect(screen.getByText(/Larger models can respond/)).toBeTruthy();

    fireEvent.press(screen.getByTestId("onboarding-model-omnilingual-asr-300m"));
    expect(controller.selectStt).toHaveBeenCalledWith(
      "omnilingual-asr-300m",
    );
  });

  it("shows a readable matching stage while the recommendation is evaluated", () => {
    const controller = {
      ...freeController(),
      checking: true,
      evaluationStage: "models" as const,
    };
    const screen = renderWithProviders(
      <FreeOfflineSetupModal
        controller={controller}
        onOpenPremium={jest.fn()}
      />,
    );

    expect(screen.getByText("Matching the best local models…")).toBeTruthy();
  });

  it("shows cumulative download progress instead of restarting for each model", () => {
    const base = freeController();
    if (base.selection?.status !== "ready") {
      throw new Error("Expected a Free profile");
    }
    const models = getOfflineProfileModels(base.selection.profile);
    const current = models[1];
    const totalBytes = models.reduce(
      (total, model) => total + model.downloadBytes,
      0,
    );
    const expectedPercent = Math.round(
      ((models[0].downloadBytes + current.downloadBytes / 2) / totalBytes) *
        100,
    );
    const controller: FreeOfflineModeController = {
      ...base,
      freeRuntimeReady: false,
      preparing: true,
      preparationEtaSeconds: 90,
      preparationProgress: {
        modelId: current.id,
        modelIndex: 1,
        modelCount: models.length,
        action: "downloading",
        download: { phase: "downloading", progress: 0.5 },
      },
      readiness: { ready: false } as FreeOfflineModeController["readiness"],
    };
    const screen = renderWithProviders(
      <FreeOfflineSetupModal
        controller={controller}
        onOpenPremium={jest.fn()}
      />,
    );

    expect(
      screen.getByTestId("onboarding-download-progress").props
        .accessibilityValue,
    ).toEqual({ min: 0, max: 100, now: expectedPercent });
  });
});
