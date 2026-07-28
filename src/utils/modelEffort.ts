import { PROVIDER_MODELS } from "../constants/models";
import type { ModelEffortConfig, ModelEffortOption } from "../constants/models";
import type { AppLanguage, Provider, ResponseModeRoute } from "../types";

const GENERIC_DEFAULT_EFFORT_IDS = ["medium", "normal"];
const ANTHROPIC_ADAPTIVE_THINKING_MODELS = new Set([
  "claude-opus-4-8",
  "claude-opus-4-7",
  "claude-opus-4-6",
  "claude-sonnet-4-6",
]);
const UKRAINIAN_EFFORT_LABELS: Record<string, string> = {
  none: "Немає",
  minimal: "Мінімальний",
  low: "Низький",
  medium: "Середній",
  high: "Високий",
  xhigh: "Дуже високий",
  max: "Максимальний",
  dynamic: "Динамічний",
  disabled: "Вимкнено",
  enabled: "Увімкнено",
};
const HINDI_EFFORT_LABELS: Record<string, string> = {
  none: "कोई नहीं",
  minimal: "न्यूनतम",
  low: "कम",
  medium: "मध्यम",
  high: "उच्च",
  xhigh: "बहुत उच्च",
  max: "अधिकतम",
  dynamic: "गतिशील",
  disabled: "बंद",
  enabled: "चालू",
};
const SPANISH_EFFORT_LABELS: Record<string, string> = {
  none: "Ninguno",
  minimal: "Mínimo",
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
  xhigh: "Muy alto",
  max: "Máximo",
  dynamic: "Dinámico",
  disabled: "Desactivado",
  enabled: "Activado",
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
  return getModelEffortConfig(provider, model)?.options ?? [];
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
  const exactOption = options.find(
    (option) => option.id === effort,
  );

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
  const options = config?.options ?? [];

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
  if (language === "de") {
    return option.localizedLabels?.de ?? option.label;
  }
  if (language === "uk") {
    return UKRAINIAN_EFFORT_LABELS[option.id] ?? option.label;
  }
  if (language === "hi") {
    return HINDI_EFFORT_LABELS[option.id] ?? option.label;
  }
  if (language === "es") {
    return SPANISH_EFFORT_LABELS[option.id] ?? option.label;
  }
  return option.label;
}

export function getResponseModeRouteEffortLabel(
  route: ResponseModeRoute,
  language: AppLanguage,
): string | undefined {
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
    case "kimi-thinking":
      return {
        thinking: {
          type: value,
        },
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
