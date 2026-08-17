import AsyncStorage from "@react-native-async-storage/async-storage";

import type { PipelinePhase } from "../hooks/useVoicePipeline";
import type { VoiceVisualPhase } from "../types";
import { getApplicationId } from "./debugRuntimeContext";

const STORE_PROMO_APPLICATION_IDS = new Set([
  "com.tobiaswinkler.app.android.mrbroccoli.maestro",
  "com.tobiaswinkler.app.mrbroccoli.maestro",
]);

export const STORE_PROMO_SCENE_STORAGE_KEY = "@mrbroccoli/store-promo-scene";
export const STORE_PROMO_ORB_STORAGE_KEY = "@mrbroccoli/store-promo-orb";

export const STORE_PROMO_SCENES = ["conversation"] as const;
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
  return applicationId !== null && STORE_PROMO_APPLICATION_IDS.has(applicationId);
}

export function isStorePromoScene(value: unknown): value is StorePromoScene {
  return value === "conversation";
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
  if (!isStorePromoApplicationId(await getApplicationId())) {
    return null;
  }

  const stored = await AsyncStorage.getItem(STORE_PROMO_SCENE_STORAGE_KEY);
  return isStorePromoScene(stored) ? stored : null;
}

export async function loadStorePromoOrbPresentation(): Promise<StorePromoOrbPresentation | null> {
  if (!isStorePromoApplicationId(await getApplicationId())) {
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
  return scene === "conversation" ? "thinking" : pipelinePhase;
}
