import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  normalizeFreeSpeechLanguage,
  type SpeechLanguage,
} from "../constants/speechLanguages";
import type {
  AutoSetupJobPlanItem,
  AutoSetupJobState,
} from "../components/autoSetup/types";
import type { PipelinePhase } from "../hooks/useVoicePipeline";
import type { TranslateFn } from "../screens/main/shared";
import type { FreeOfflineModeController } from "../screens/main/useFreeOfflineMode";
import type { Settings, VoiceVisualPhase } from "../types";
import { formatBytes } from "../utils/formatBytes";
import { getApplicationId } from "./developmentEntitlement";
import type { LocalDeviceSnapshot } from "./localDeviceCapabilities";
import {
  applyOfflineProfileToSettings,
  getOfflineProfileModels,
  selectOfflineProfile,
} from "./offlineProfile";
import type { OfflineProfileReadiness } from "./offlineProfileManager";

const GIB = 1024 ** 3;
const STORE_PROMO_APPLICATION_ID = "com.tobiaswinkler.app.mrbroccoli.maestro";

export const STORE_PROMO_SCENE_STORAGE_KEY = "@mrbroccoli/store-promo-scene";
export const STORE_PROMO_ORB_STORAGE_KEY = "@mrbroccoli/store-promo-orb";

export const STORE_PROMO_SCENES = [
  "premium",
  "free",
  "onboarding",
  "onboarding-ready",
] as const;
export type StorePromoScene = (typeof STORE_PROMO_SCENES)[number];

export interface StorePromoOrbPresentation {
  phase: VoiceVisualPhase;
  phaseProgress: number;
  turnProgress: number;
  overtime: number;
}

const STORE_PROMO_ORB_PHASES: readonly VoiceVisualPhase[] = [
  "idle",
  "recording",
  "transcribing",
  "thinking-briefly",
  "searching",
  "thinking",
  "synthesizing",
  "speaking",
];

export function isStorePromoApplicationId(applicationId: string | null) {
  return applicationId === STORE_PROMO_APPLICATION_ID;
}

export function isStorePromoScene(value: unknown): value is StorePromoScene {
  return (
    typeof value === "string" &&
    STORE_PROMO_SCENES.includes(value as StorePromoScene)
  );
}

function isProgressFraction(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 1
  );
}

export function isStorePromoOrbPresentation(
  value: unknown,
): value is StorePromoOrbPresentation {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<StorePromoOrbPresentation>;
  return (
    typeof candidate.phase === "string" &&
    STORE_PROMO_ORB_PHASES.includes(candidate.phase as VoiceVisualPhase) &&
    isProgressFraction(candidate.phaseProgress) &&
    isProgressFraction(candidate.turnProgress) &&
    isProgressFraction(candidate.overtime)
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

export async function loadStorePromoOrbPresentation(): Promise<StorePromoOrbPresentation | null> {
  const applicationId = await getApplicationId();
  if (!isStorePromoApplicationId(applicationId)) {
    return null;
  }

  const stored = await AsyncStorage.getItem(STORE_PROMO_ORB_STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(stored);
    return isStorePromoOrbPresentation(parsed) ? parsed : null;
  } catch {
    return null;
  }
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

const ignoreStorePromoAutoSetupAction = () => undefined;

/**
 * The fixed recommendation shown only by the identity-guarded onboarding
 * store scene. It uses the same catalogue selector as real setup, but feeds it
 * the checked-in device snapshot and exposes no action that can start a probe,
 * download, benchmark, model, or provider request.
 */
export function applyStorePromoAutoSetupJob(
  job: AutoSetupJobState,
  language: Settings["language"],
  scene: StorePromoScene | null,
  platform: LocalDeviceSnapshot["platform"],
  t: TranslateFn,
): AutoSetupJobState {
  if (scene !== "onboarding") {
    return job;
  }

  const snapshot = buildStorePromoLocalDeviceSnapshot(platform);
  const selection = selectOfflineProfile({
    languages: [getFreeSpeechLanguage(language)],
    snapshot,
  });
  if (selection.status !== "ready") {
    return job;
  }

  const { profile } = selection;
  const item = (
    role: AutoSetupJobPlanItem["role"],
    roleLabel: string,
    model?: AutoSetupJobPlanItem["model"],
    name?: string,
  ): AutoSetupJobPlanItem => ({
    role,
    roleLabel,
    model,
    name,
    active: false,
    installed: false,
    failed: false,
  });

  return {
    state: "proposal",
    downloadBytes: profile.downloadBytes,
    fraction: 0,
    scanned: 4,
    facts: [],
    plan: [
      item("think", t("thinking"), profile.llm),
      profile.stt
        ? item("listen", t("listening"), profile.stt)
        : item("listen", t("listening"), undefined, t("appNative")),
      profile.tts
        ? item("speak", t("speaking"), profile.tts)
        : item("speak", t("speaking"), undefined, t("systemVoice")),
    ],
    benchmarks: {},
    snapshot,
    totalSizeLabel: formatBytes(
      getOfflineProfileModels(profile).reduce(
        (total, model) => total + model.downloadBytes,
        0,
      ),
    ),
    reading: null,
    errorKind: null,
    errorDetail: null,
    running: false,
    start: ignoreStorePromoAutoSetupAction,
    install: ignoreStorePromoAutoSetupAction,
    cancel: ignoreStorePromoAutoSetupAction,
    retry: ignoreStorePromoAutoSetupAction,
  };
}

export function applyStorePromoFreeOfflineController(
  controller: FreeOfflineModeController,
  settings: Settings,
  scene: StorePromoScene | null,
  platform: LocalDeviceSnapshot["platform"],
): FreeOfflineModeController {
  if (
    scene !== "free" &&
    scene !== "onboarding" &&
    scene !== "onboarding-ready"
  ) {
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
  const ready =
    (scene === "free" && !controller.setupVisible) ||
    scene === "onboarding-ready";
  const readiness: OfflineProfileReadiness = {
    ready,
    installed: ready,
    failedModelId: scene === "free" && !ready ? selection.profile.llm.id : null,
    installs: {},
    benchmarks: {},
  };
  const selectedLanguage = normalizeFreeSpeechLanguage(speechLanguage) ?? "en";

  return {
    ...controller,
    // The onboarding scene owns only a recommendation. It must not project
    // the selected route as already applied or unlock the live-test step.
    effectiveSettings:
      scene === "onboarding" ? controller.effectiveSettings : effectiveSettings,
    freeRuntimeReady: ready,
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
