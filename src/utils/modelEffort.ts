import { PROVIDER_MODELS } from "../constants/models";
import type { ModelEffortConfig, ModelEffortOption } from "../constants/models";
import { translate, type TranslationKey } from "../i18n";
import type { AppLanguage, Provider, ResponseModeRoute } from "../types";
import { isRuntimeCapabilityConfigurationDisabled } from "../services/runtimeCapabilityOverrides";
import { getLocalModel } from "../constants/localModels";

const GENERIC_DEFAULT_EFFORT_IDS = ["medium", "normal"];
const ANTHROPIC_ADAPTIVE_THINKING_MODELS = new Set([
  "claude-opus-4-8",
  "claude-opus-4-7",
  "claude-opus-4-6",
  "claude-sonnet-4-6",
]);
const MODEL_EFFORT_TRANSLATION_KEYS: Record<string, TranslationKey> = {
  none: "modelEffortNone",
  minimal: "modelEffortMinimal",
  low: "modelEffortLow",
  medium: "modelEffortMedium",
  high: "modelEffortHigh",
  xhigh: "modelEffortExtraHigh",
  max: "modelEffortMax",
  dynamic: "modelEffortDynamic",
  disabled: "modelEffortDisabled",
  enabled: "modelEffortEnabled",
};

export function getModelEffortConfig(
  provider: Provider,
  model: string,
): ModelEffortConfig | undefined {
  return PROVIDER_MODELS[provider]?.find((entry) => entry.id === model)?.effort;
}

export function getModelEffortOptions(
  provider: Provider,
  model: string,
): ModelEffortOption[] {
  return (getModelEffortConfig(provider, model)?.options ?? []).filter(
    (option) =>
      !isRuntimeCapabilityConfigurationDisabled({
        capability: "llm",
        effort: option.id,
        model,
        provider,
      }),
  );
}

function getModelEffortOption(
  provider: Provider,
  model: string,
  effort: string | undefined,
) {
  if (!effort) {
    return undefined;
  }

  const options = getModelEffortOptions(provider, model);
  const exactOption = options.find((option) => option.id === effort);

  if (exactOption) {
    return exactOption;
  }

  // The live Chat Completions endpoint currently rejects `max` for GPT-5.6
  // even though the public model guide lists it. Preserve existing users'
  // quality-first choice at the nearest accepted level.
  if (
    provider === "openai" &&
    (model === "gpt-5.6" || model.startsWith("gpt-5.6-")) &&
    effort === "max"
  ) {
    return options.find((option) => option.id === "xhigh");
  }

  return undefined;
}

export function getDefaultModelEffort(
  provider: Provider,
  model: string,
): string | undefined {
  const config = getModelEffortConfig(provider, model);
  const options = getModelEffortOptions(provider, model);

  if (options.length === 0) {
    return undefined;
  }

  if (
    config?.defaultOptionId &&
    options.some((option) => option.id === config.defaultOptionId)
  ) {
    return config.defaultOptionId;
  }

  return (
    GENERIC_DEFAULT_EFFORT_IDS.find((fallbackId) =>
      options.some((option) => option.id === fallbackId),
    ) ?? options[0]?.id
  );
}

export function normalizeResponseModeRouteEffort(
  route: ResponseModeRoute,
): ResponseModeRoute {
  if (route.runtime === "local" && route.localModelId) {
    return {
      provider: route.provider,
      model: route.model,
      runtime: "local",
      localModelId: route.localModelId,
    };
  }

  const defaultEffort = getDefaultModelEffort(route.provider, route.model);

  if (!defaultEffort) {
    return {
      provider: route.provider,
      model: route.model,
    };
  }

  const selectedEffort = getModelEffortOption(
    route.provider,
    route.model,
    route.effort,
  );

  return {
    provider: route.provider,
    model: route.model,
    effort: selectedEffort?.id ?? defaultEffort,
  };
}

export function getModelEffortOptionLabel(
  option: ModelEffortOption,
  language: AppLanguage,
) {
  const translationKey = MODEL_EFFORT_TRANSLATION_KEYS[option.id];
  return translationKey ? translate(language, translationKey) : option.label;
}

export function getResponseModeRouteEffortLabel(
  route: ResponseModeRoute,
  language: AppLanguage,
): string | undefined {
  if (route.runtime === "local") {
    if (!route.localModelId) {
      return undefined;
    }
    const model = getLocalModel(route.localModelId);
    return model.capability === "llm"
      ? translate(
          language,
          model.responseProfile === "thorough" ? "thorough" : "brief",
        )
      : undefined;
  }
  const normalizedRoute = normalizeResponseModeRouteEffort(route);
  const option = getModelEffortOption(
    normalizedRoute.provider,
    normalizedRoute.model,
    normalizedRoute.effort,
  );

  return option ? getModelEffortOptionLabel(option, language) : undefined;
}

export function getModelEffortTransportParam(
  provider: Provider,
  model: string,
) {
  return getModelEffortConfig(provider, model)?.transportParam;
}

export function getModelEffortTransportValue(
  provider: Provider,
  model: string,
  effort: string | undefined,
): string | undefined {
  const option = getModelEffortOption(provider, model, effort);

  return option?.transportValue ?? option?.id;
}

export function getModelEffortRequestBody(
  provider: Provider,
  model: string,
  effort: string | undefined,
): Record<string, unknown> {
  const transportParam = getModelEffortTransportParam(provider, model);
  const value = getModelEffortTransportValue(provider, model, effort);

  if (!transportParam) {
    return {};
  }

  if (transportParam === "anthropic-output-effort") {
    return {
      ...(value
        ? {
            output_config: {
              effort: value,
            },
          }
        : {}),
      ...(ANTHROPIC_ADAPTIVE_THINKING_MODELS.has(model)
        ? {
            thinking: {
              type: "adaptive",
            },
          }
        : {}),
    };
  }

  if (!value) {
    return {};
  }

  switch (transportParam) {
    case "deepseek-thinking-effort":
      if (value === "disabled") {
        return {
          thinking: {
            type: "disabled",
          },
        };
      }

      return {
        thinking: {
          type: "enabled",
        },
        reasoning_effort: value,
      };
    case "qwen-enable-thinking":
      return {
        enable_thinking: value === "enabled",
      };
    case "reasoning-effort":
      return {
        reasoning_effort: value,
      };
    case "gemini-thinking-level":
      return {
        generationConfig: {
          thinkingConfig: {
            thinkingLevel: value,
          },
        },
      };
    case "gemini-thinking-budget":
      return {
        generationConfig: {
          thinkingConfig: {
            thinkingBudget: Number(value),
          },
        },
      };
  }
}
