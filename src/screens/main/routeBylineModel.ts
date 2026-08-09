import { PROVIDER_LABELS, getProviderModelName } from "../../constants/models";
import { getLocalModel } from "../../constants/localModels";
import type { AppLanguage, ResponseModeConfig } from "../../types";
import {
  getModelEffortOptionLabel,
  getModelEffortOptions,
  getResponseModeRouteEffortLabel,
  normalizeResponseModeRouteEffort,
} from "../../utils/modelEffort";
import type { TranslateFn } from "./shared";

export interface RouteBylineModel {
  effort?: string;
  effortLevels: string[];
  local: boolean;
  modelName: string;
  provider?: ResponseModeConfig["route"]["provider"];
  providerLabel?: string;
}

/**
 * What the route byline shows for a configured route.
 *
 * Kept out of the component so the label and the effort scale can be checked
 * without rendering, and so the byline stays a presentation concern.
 */
export function getRouteBylineModel(
  mode: ResponseModeConfig,
  language: AppLanguage,
  t: TranslateFn,
): RouteBylineModel {
  const { route } = mode;
  const local = route.runtime === "local" && Boolean(route.localModelId);

  if (local && route.localModelId) {
    const localModel = getLocalModel(route.localModelId);
    const name =
      localModel.capability === "llm" &&
      localModel.responseProfile === "thorough"
        ? t("onboardingBestSetupThoroughModel")
        : t("onboardingBestSetupQuickModel");

    return {
      // An on-device route says so before it says which model, because that is
      // the part that changes what the user can expect of it.
      effort: getResponseModeRouteEffortLabel(route, language),
      effortLevels: [],
      local: true,
      modelName: `${t("settingsOnDevice")} · ${name}`,
    };
  }

  const normalized = normalizeResponseModeRouteEffort(route);

  return {
    effort: getResponseModeRouteEffortLabel(route, language),
    // The model's own scale, low to high. Fewer than two values hides the dots,
    // because a one-step scale says nothing about where this route sits.
    effortLevels: getModelEffortOptions(normalized.provider, normalized.model)
      .map((option) => getModelEffortOptionLabel(option, language)),
    local: false,
    modelName: getProviderModelName(route.provider, route.model),
    provider: route.provider,
    providerLabel: PROVIDER_LABELS[route.provider],
  };
}
