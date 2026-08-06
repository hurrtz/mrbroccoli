import React from "react";
import { StyleSheet } from "react-native";
import { act, fireEvent, waitFor, within } from "@testing-library/react-native";

import { FreeOfflineSetupScreen } from "../../src/components/FreeOfflineSetupScreen";
import { LOCAL_PREVIEW_SAMPLE_TEXT_BY_LANGUAGE } from "../../src/constants/voicePreviewSamples";
import type { FreeOfflineModeController } from "../../src/screens/main/useFreeOfflineMode";
import {
  getOfflineProfileModels,
  selectOfflineProfile,
} from "../../src/services/offlineProfile";
import type { LocalDeviceSnapshot } from "../../src/services/localDeviceCapabilities";
import { lightColors } from "../../src/theme/colors";
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

function renderSetup(
  controller: FreeOfflineModeController,
  callbacks: {
    onOpenPremium?: () => void;
    onPreviewVoice?: React.ComponentProps<
      typeof FreeOfflineSetupScreen
    >["onPreviewVoice"];
    onStopPreviewVoice?: React.ComponentProps<
      typeof FreeOfflineSetupScreen
    >["onStopPreviewVoice"];
  } = {},
) {
  return renderWithProviders(
    <FreeOfflineSetupScreen
      controller={controller}
      onOpenPremium={callbacks.onOpenPremium}
      onPreviewVoice={
        callbacks.onPreviewVoice ?? jest.fn(async () => undefined)
      }
      onStopPreviewVoice={
        callbacks.onStopPreviewVoice ?? jest.fn(async () => undefined)
      }
    />,
  );
}

function childTestIDs(children: React.ReactNode) {
  return React.Children.toArray(children).map((child) =>
    React.isValidElement<{ testID?: string }>(child)
      ? child.props.testID
      : null,
  );
}

describe("FreeOfflineSetupScreen", () => {
  it("uses the full screen, matches the app wordmark, and offers no close action", () => {
    const controller = freeController();
    const screen = renderSetup(controller);

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
      StyleSheet.flatten(screen.getByTestId("free-offline-footer").props.style)
        .paddingBottom,
    ).toBe(24);
  });

  it("keeps a Premium escape hatch reachable, including from unavailable states", () => {
    const onOpenPremium = jest.fn();
    const controller = freeController();
    const screen = renderSetup(controller, { onOpenPremium });

    fireEvent.press(screen.getByTestId("free-offline-premium-link"));
    expect(onOpenPremium).toHaveBeenCalledTimes(1);

    // Unsupported hardware / failed evaluation must not trap the user with
    // only a Retry action.
    const unavailableController: FreeOfflineModeController = {
      ...freeController(),
      selection: { status: "unavailable", reason: "device" },
      checking: false,
    };
    const unavailableScreen = renderSetup(unavailableController, {
      onOpenPremium,
    });
    fireEvent.press(
      unavailableScreen.getByTestId("free-offline-premium-link"),
    );
    expect(onOpenPremium).toHaveBeenCalledTimes(2);
  });

  it("offers seven languages in a dropdown and ends with one clear start action", () => {
    const controller = freeController();
    const screen = renderSetup(controller);

    expect(screen.queryByText("Choose your language")).toBeNull();
    expect(screen.getByText("Your best setup")).toBeTruthy();
    expect(screen.queryByText("Language")).toBeNull();
    expect(screen.queryAllByRole("radio")).toHaveLength(0);
    expect(
      StyleSheet.flatten(
        screen.getByTestId("free-offline-primary-action").props.style,
      ),
    ).toEqual(
      expect.objectContaining({
        minHeight: 56,
        paddingHorizontal: 20,
        paddingVertical: 14,
      }),
    );
    expect(StyleSheet.flatten(screen.getByText("Start").props.style)).toEqual(
      expect.objectContaining({ fontSize: 16, lineHeight: 22 }),
    );

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
    const screen = renderSetup(controller);

    expect(screen.getByText("Choose your language")).toBeTruthy();
    expect(screen.queryByText("English")).toBeNull();
    expect(screen.queryByText("Your best setup")).toBeNull();
    expect(screen.queryByTestId("onboarding-recommendation-card")).toBeNull();
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
    if (controller.recommendedSelection?.status !== "ready") {
      throw new Error("Expected a recommended Free profile");
    }
    const screen = renderSetup(controller);

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
    expect(screen.getByText("Model for quick responses")).toBeTruthy();
    expect(screen.getByText("Model for thorough reasoning")).toBeTruthy();
    expect(screen.getByText("Model for recording")).toBeTruthy();
    expect(screen.getByText("Model for speaking")).toBeTruthy();
    expect(
      childTestIDs(
        screen.getByTestId("onboarding-recommendation-card-models").props
          .children,
      ),
    ).toEqual([
      "onboarding-recommendation-card-reasoning-row",
      "onboarding-recommendation-card-speech-row",
    ]);
    expect(
      childTestIDs(
        screen.getByTestId("onboarding-recommendation-card-reasoning-row").props
          .children,
      ),
    ).toEqual([
      "onboarding-recommendation-card-quick",
      "onboarding-recommendation-card-thorough",
    ]);
    expect(
      childTestIDs(
        screen.getByTestId("onboarding-recommendation-card-speech-row").props
          .children,
      ),
    ).toEqual([
      "onboarding-recommendation-card-tts",
      "onboarding-recommendation-card-stt",
    ]);
    expect(
      React.Children.count(
        screen.getByTestId("onboarding-recommendation-header").props.children,
      ),
    ).toBe(2);
    for (const capability of ["quick", "thorough", "tts", "stt"]) {
      const tick = screen.UNSAFE_getByProps({
        testID: `onboarding-recommendation-card-${capability}-ready`,
      });
      expect(tick.props.name).toBe("check");
      expect(tick.props.size).toBe("hero");
    }
    for (const technicalName of [
      controller.recommendedSelection.profile.llm.name,
      controller.recommendedSelection.profile.thoroughLlm?.name,
      controller.recommendedSelection.profile.tts?.name,
      controller.recommendedSelection.profile.stt?.name,
    ].filter(Boolean)) {
      expect(
        within(
          screen.getByTestId("onboarding-recommendation-card"),
        ).queryByText(technicalName!),
      ).toBeNull();
    }
    expect(
      StyleSheet.flatten(
        screen.getByTestId("onboarding-recommendation-card-meta").props.style,
      ),
    ).toEqual(
      expect.objectContaining({
        flexWrap: "nowrap",
        justifyContent: "space-between",
      }),
    );
    const downloadStyle = StyleSheet.flatten(
      screen.getByTestId("onboarding-recommendation-card-download").props.style,
    );
    expect(downloadStyle.textAlign).toBe("left");
    expect(downloadStyle.backgroundColor).toBeUndefined();
    const etaStyle = StyleSheet.flatten(
      screen.getByTestId("onboarding-recommendation-card-eta").props.style,
    );
    expect(etaStyle.textAlign).toBe("right");
    expect(etaStyle.backgroundColor).toBeUndefined();

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
    const screen = renderSetup(controller);

    expect(screen.getByText("Phone details")).toBeTruthy();
    expect(screen.getByText("Your selected setup")).toBeTruthy();
    expect(screen.getAllByText("Quick responses")).toHaveLength(2);
    expect(screen.getAllByText("Thorough reasoning")).toHaveLength(2);
    expect(screen.getByText("Omnilingual ASR 300M")).toBeTruthy();
    expect(screen.getByText("Piper · Kristin")).toBeTruthy();
    expect(screen.getByTestId("onboarding-native-stt")).toBeTruthy();
    expect(
      within(
        screen.getByTestId("onboarding-model-kokoro-multilingual-card"),
      ).getByTestId("onboarding-kokoro-voice"),
    ).toBeTruthy();
    expect(
      within(
        screen.getByTestId("onboarding-model-kokoro-multilingual-card"),
      ).getByTestId("onboarding-kokoro-voice-preview"),
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
      expect(
        StyleSheet.flatten(screen.getByTestId(testID).props.style),
      ).toEqual(phoneHeading);
    }
    expect(screen.getByText(/Larger models can respond/)).toBeTruthy();
    expect(
      screen.getByText("Measured on this phone · Test passed"),
    ).toBeTruthy();
    expect(screen.getByText(/12.4 tok\/s · 420 ms load/)).toBeTruthy();
    expect(screen.getByText(/Predictions are estimates/)).toBeTruthy();

    const advancedPanel = screen.getByTestId("onboarding-advanced-panel");
    const advancedChildren = React.Children.toArray(
      advancedPanel.props.children,
    );
    expect(advancedChildren.at(-1)).toEqual(
      expect.objectContaining({
        props: expect.objectContaining({
          testID: "onboarding-custom-setup-card",
        }),
      }),
    );
    expect(
      StyleSheet.flatten(
        screen.getByTestId("onboarding-custom-setup-card").props.style,
      ),
    ).toEqual(
      expect.objectContaining({
        backgroundColor: `${lightColors.phaseSearching}1A`,
        borderColor: lightColors.phaseSearching,
      }),
    );
    expect(
      StyleSheet.flatten(
        screen.getByTestId("onboarding-recommendation-card").props.style,
      ),
    ).toEqual(expect.objectContaining({ opacity: 0.42, elevation: 0 }));
    expect(
      childTestIDs(
        screen.getByTestId("onboarding-custom-setup-card-models").props
          .children,
      ),
    ).toEqual([
      "onboarding-custom-setup-card-reasoning-row",
      "onboarding-custom-setup-card-speech-row",
    ]);
    expect(
      childTestIDs(
        screen.getByTestId("onboarding-custom-setup-card-reasoning-row").props
          .children,
      ),
    ).toEqual([
      "onboarding-custom-setup-card-quick",
      "onboarding-custom-setup-card-thorough",
    ]);
    expect(
      childTestIDs(
        screen.getByTestId("onboarding-custom-setup-card-speech-row").props
          .children,
      ),
    ).toEqual([
      "onboarding-custom-setup-card-tts",
      "onboarding-custom-setup-card-stt",
    ]);

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
    const screen = renderSetup(controller);

    expect(
      within(screen.getByTestId("onboarding-recommendation-card")).queryByText(
        base.recommendedSelection.profile.llm.name,
      ),
    ).toBeNull();
    expect(
      within(screen.getByTestId("onboarding-recommendation-card")).getByText(
        "Model for quick responses",
      ),
    ).toBeTruthy();
    expect(
      within(screen.getByTestId("onboarding-custom-setup-card")).getByText(
        customSelection.profile.llm.name,
      ),
    ).toBeTruthy();
    expect(
      within(screen.getByTestId("onboarding-recommendation-card")).queryByText(
        customSelection.profile.llm.name,
      ),
    ).toBeNull();
  });

  it("keeps the selected system voice and preview control inside its TTS option", async () => {
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
    let resolvePreview: (() => void) | undefined;
    const onPreviewVoice = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolvePreview = resolve;
        }),
    );
    const onStopPreviewVoice = jest.fn(async () => {
      resolvePreview?.();
    });
    const screen = renderSetup(controller, {
      onPreviewVoice,
      onStopPreviewVoice,
    });

    const nativeTtsCard = within(
      screen.getByTestId("onboarding-native-tts-card"),
    );
    expect(nativeTtsCard.getByTestId("onboarding-native-voice")).toBeTruthy();
    const preview = nativeTtsCard.getByTestId(
      "onboarding-native-voice-preview",
    );
    expect(preview.props.accessibilityLabel).toBe("Preview Voice");

    fireEvent.press(preview);
    expect(onPreviewVoice).toHaveBeenCalledWith({
      text: LOCAL_PREVIEW_SAMPLE_TEXT_BY_LANGUAGE.en,
      mode: "native",
      nativeVoice: "com.apple.voice",
      previewLanguage: "en",
    });
    await waitFor(() =>
      expect(
        nativeTtsCard.getByTestId("onboarding-native-voice-preview").props
          .accessibilityLabel,
      ).toBe("Stop"),
    );

    act(() => resolvePreview?.());
    await waitFor(() =>
      expect(
        nativeTtsCard.getByTestId("onboarding-native-voice-preview").props
          .accessibilityLabel,
      ).toBe("Preview Voice"),
    );

    fireEvent.press(
      nativeTtsCard.getByTestId("onboarding-native-voice-preview"),
    );
    await waitFor(() =>
      expect(
        nativeTtsCard.getByTestId("onboarding-native-voice-preview").props
          .accessibilityLabel,
      ).toBe("Stop"),
    );
    fireEvent.press(
      nativeTtsCard.getByTestId("onboarding-native-voice-preview"),
    );
    await waitFor(() => expect(onStopPreviewVoice).toHaveBeenCalledTimes(1));
    expect(
      nativeTtsCard.getByTestId("onboarding-native-voice-preview").props
        .accessibilityLabel,
    ).toBe("Preview Voice");
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
    const screen = renderSetup(controller);

    expect(
      screen.getByTestId("onboarding-recommendation-spinner"),
    ).toBeTruthy();
    expect(screen.getByText("Matching the best local models…")).toBeTruthy();
    expect(screen.queryByText("Your best setup")).toBeNull();
    expect(screen.queryByTestId("onboarding-recommendation-card")).toBeNull();
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
    const screen = renderSetup(controller);

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
