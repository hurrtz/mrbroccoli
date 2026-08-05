import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  normalizeFreeSpeechLanguage,
  type SpeechLanguage,
} from "../constants/speechLanguages";
import type { PipelinePhase } from "../hooks/useVoicePipeline";
import type { FreeOfflineModeController } from "../screens/main/useFreeOfflineMode";
import type { Settings } from "../types";
import { getApplicationId } from "./developmentEntitlement";
import type { LocalDeviceSnapshot } from "./localDeviceCapabilities";
import {
  applyOfflineProfileToSettings,
  selectOfflineProfile,
} from "./offlineProfile";
import type { OfflineProfileReadiness } from "./offlineProfileManager";

const GIB = 1024 ** 3;
const MAESTRO_APPLICATION_ID_SUFFIX = ".maestro";

export const STORE_PROMO_SCENE_STORAGE_KEY =
  "@mrbroccoli/store-promo-scene";

export const STORE_PROMO_SCENES = ["premium", "free"] as const;
export type StorePromoScene = (typeof STORE_PROMO_SCENES)[number];

export function isStorePromoApplicationId(applicationId: string | null) {
  return applicationId?.endsWith(MAESTRO_APPLICATION_ID_SUFFIX) === true;
}

export function isStorePromoScene(value: unknown): value is StorePromoScene {
  return (
    typeof value === "string" &&
    STORE_PROMO_SCENES.includes(value as StorePromoScene)
  );
}

export async function loadStorePromoScene(): Promise<StorePromoScene | null> {
  const applicationId = await getApplicationId();
  if (!isStorePromoApplicationId(applicationId)) {
    return null;
  }

  const stored = await AsyncStorage.getItem(STORE_PROMO_SCENE_STORAGE_KEY);
  return isStorePromoScene(stored) ? stored : null;
}

export function getStorePromoPipelinePhase(
  scene: StorePromoScene | null,
  pipelinePhase: PipelinePhase,
): PipelinePhase {
  return scene === "premium" ? "thinking" : pipelinePhase;
}

export function buildStorePromoLocalDeviceSnapshot(
  platform: LocalDeviceSnapshot["platform"],
): LocalDeviceSnapshot {
  return {
    version: 1,
    capturedAt: "2026-08-05T06:00:00.000Z",
    platform,
    physicalMemoryBytes: 8 * GIB,
    availableMemoryBytes: 6 * GIB,
    freeStorageBytes: 48 * GIB,
    totalStorageBytes: 128 * GIB,
    processorCount: 8,
    activeProcessorCount: 8,
    architecture: platform === "ios" ? "arm64" : "aarch64",
    osVersion: platform === "ios" ? "26.5" : "16",
    lowPowerMode: false,
    memoryLow: false,
    thermalState: "nominal",
  };
}

function getFreeSpeechLanguage(language: Settings["language"]): SpeechLanguage {
  if (language === "pt-BR") {
    return "pt-BR";
  }
  return normalizeFreeSpeechLanguage(language) ?? "en";
}

export function applyStorePromoFreeOfflineController(
  controller: FreeOfflineModeController,
  settings: Settings,
  scene: StorePromoScene | null,
  platform: LocalDeviceSnapshot["platform"],
): FreeOfflineModeController {
  if (scene !== "free") {
    return controller;
  }

  const speechLanguage = getFreeSpeechLanguage(settings.language);
  const snapshot = buildStorePromoLocalDeviceSnapshot(platform);
  const selection = selectOfflineProfile({
    languages: [speechLanguage],
    snapshot,
  });
  if (selection.status !== "ready") {
    return controller;
  }

  const effectiveSettings = applyOfflineProfileToSettings(
    {
      ...settings,
      localLanguages: [speechLanguage],
      sttLanguage: speechLanguage,
      ttsListenLanguages: [speechLanguage],
    },
    selection.profile,
  );
  const readiness: OfflineProfileReadiness = {
    ready: !controller.setupVisible,
    installed: !controller.setupVisible,
    failedModelId: controller.setupVisible ? selection.profile.llm.id : null,
    installs: {},
    benchmarks: {},
  };
  const selectedLanguage =
    normalizeFreeSpeechLanguage(speechLanguage) ?? "en";

  return {
    ...controller,
    effectiveSettings,
    freeRuntimeReady: true,
    checking: false,
    evaluationStage: null,
    preparing: false,
    preparationProgress: null,
    preparationEtaSeconds: null,
    estimatedSetupSeconds: 120,
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
    recommendedReadiness: readiness,
    customReadiness: readiness,
    readiness,
    installs: {},
    benchmarks: {},
    error: null,
    selectedLanguage,
    advancedOptionsEnabled: false,
    hasCustomSelections: false,
    recommendedEstimatedSetupSeconds: 120,
    customEstimatedSetupSeconds: 120,
  };
}
