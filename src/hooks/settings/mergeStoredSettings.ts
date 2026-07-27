import {
  PROVIDER_DEFAULT_STT_MODELS,
  PROVIDER_DEFAULT_TTS_MODELS,
  PROVIDER_LLM_SUPPORT,
  PROVIDER_ORDER,
  getProviderSttModelOptions,
  getProviderTtsModelOptions,
} from "../../constants/models";
import {
  createRuntimeProviderStringRecord,
  extractRuntimeProviderStringRecord,
  isRuntimeProviderId,
} from "../../constants/providers/runtimeState";
import {
  WEB_SEARCH_PROVIDER_IDS,
  createDefaultWebSearchProviderSettings,
  normalizeWebSearchProviderSettings,
} from "../../constants/webSearch";
import { normalizeKokoroVoiceSelections } from "../../constants/kokoro";
import { normalizeTtsFallbackPolicy } from "../../constants/ttsFallback";
import {
  type Provider,
  type ProviderApiKeys,
  type ProviderCapability,
  type ProviderValidationResult,
  type ProviderModelSelections,
  type ProviderSttModelSelections,
  type ProviderTtsModelSelections,
  type ProviderTtsVoiceSelections,
  type ProviderValidationResults,
  type ResponseModeConfig,
  type ResponseMode,
  type ResponseModeRoute,
  type ResponseModeSelections,
  type Settings,
  DEFAULT_SETTINGS,
} from "../../types";
import {
  getDefaultModelForProvider,
  isValidModelForProvider,
  LEGACY_RESPONSE_MODE_ORDER,
  migrateProviderModelAlias,
} from "../../utils/responseModes";
import {
  createResponseModeId,
  DEFAULT_RESPONSE_MODE_COUNT,
  MAX_RESPONSE_MODES,
} from "../../constants/providers/defaults";
import { normalizeResponseModeRouteEffort } from "../../utils/modelEffort";
import {
  LEGACY_MODEL_FIELD_KEYS,
  type LegacyStoredSettings,
  type StoredProviderModels,
} from "./types";
import { normalizeStoredScalarSettings } from "./normalizeStoredScalars";

function isProvider(value: unknown): value is Provider {
  return isRuntimeProviderId(value);
}

const LEGACY_PROVIDER_ALIASES: Record<string, Provider> = {
  grok: "xai",
};

const LEGACY_SETTINGS_FIELD_NAMES = [
  "webSearchEnabled",
  "ttsPlayback",
  "ttsVoice",
  "localTtsVoices",
  "openaiModel",
  "anthropicModel",
  "geminiModel",
  "cohereModel",
  "deepseekModel",
  "groqModel",
  "mistralModel",
  "nvidiaModel",
  "togetherModel",
  "xaiModel",
] as const satisfies readonly (keyof LegacyStoredSettings)[];

function stripLegacySettingsFields(
  storedSettings: LegacyStoredSettings,
): LegacyStoredSettings {
  const sanitizedSettings = { ...storedSettings };

  for (const fieldName of LEGACY_SETTINGS_FIELD_NAMES) {
    delete sanitizedSettings[fieldName];
  }

  return sanitizedSettings;
}

function migrateLegacyProviderId(value: unknown): unknown {
  return typeof value === "string" && value in LEGACY_PROVIDER_ALIASES
    ? LEGACY_PROVIDER_ALIASES[value]
    : value;
}

function migrateLegacyProviderRecord<T>(
  record: Partial<Record<string, T>> | undefined,
): Partial<Record<string, T>> | undefined {
  if (!record || typeof record !== "object") {
    return record;
  }

  let migrated: Partial<Record<string, T>> | undefined;

  for (const [legacyId, canonicalId] of Object.entries(LEGACY_PROVIDER_ALIASES)) {
    if (!(legacyId in record)) {
      continue;
    }

    migrated = migrated ?? { ...record };
    const legacyValue = migrated[legacyId];
    // Prefer an existing canonical value if both are present.
    if (migrated[canonicalId] === undefined && legacyValue !== undefined) {
      migrated[canonicalId] = legacyValue;
    }
    delete migrated[legacyId];
  }

  return migrated ?? record;
}

function migrateLegacyProviders(
  storedSettings?: LegacyStoredSettings,
  storedApiKeys?: Partial<ProviderApiKeys>,
): {
  storedSettings?: LegacyStoredSettings;
  storedApiKeys?: Partial<ProviderApiKeys>;
} {
  const migratedApiKeys = migrateLegacyProviderRecord(
    storedApiKeys as Partial<Record<string, string>> | undefined,
  ) as Partial<ProviderApiKeys> | undefined;

  if (!storedSettings) {
    return { storedSettings, storedApiKeys: migratedApiKeys };
  }

  return {
    storedSettings: {
      ...storedSettings,
      ttsProvider: migrateLegacyProviderId(storedSettings.ttsProvider) as
        | Provider
        | null
        | undefined,
      sttProvider: migrateLegacyProviderId(storedSettings.sttProvider) as
        | Provider
        | null
        | undefined,
      lastProvider: migrateLegacyProviderId(storedSettings.lastProvider) as
        | Provider
        | undefined,
      apiKeys: migrateLegacyProviderRecord(
        storedSettings.apiKeys as Partial<Record<string, string>> | undefined,
      ) as LegacyStoredSettings["apiKeys"],
      providerTtsVoices: migrateLegacyProviderRecord(
        storedSettings.providerTtsVoices as
          | Partial<Record<string, string>>
          | undefined,
      ) as LegacyStoredSettings["providerTtsVoices"],
      providerTtsModels: migrateLegacyProviderRecord(
        storedSettings.providerTtsModels as
          | Partial<Record<string, string>>
          | undefined,
      ) as LegacyStoredSettings["providerTtsModels"],
      providerSttModels: migrateLegacyProviderRecord(
        storedSettings.providerSttModels as
          | Partial<Record<string, string>>
          | undefined,
      ) as LegacyStoredSettings["providerSttModels"],
      providerModels: migrateLegacyProviderRecord(
        storedSettings.providerModels as
          | Partial<Record<string, string>>
          | undefined,
      ) as LegacyStoredSettings["providerModels"],
      providerValidationResults: migrateLegacyProviderRecord(
        storedSettings.providerValidationResults as
          | Partial<Record<string, unknown>>
          | undefined,
      ) as LegacyStoredSettings["providerValidationResults"],
    },
    storedApiKeys: migratedApiKeys,
  };
}

function isResponseMode(value: unknown): value is ResponseMode {
  return typeof value === "string" && value.trim().length > 0;
}

function extractStoredProviderModels(
  storedSettings?: LegacyStoredSettings,
): StoredProviderModels {
  if (!storedSettings) {
    return {};
  }

  const extractedModels = extractRuntimeProviderStringRecord(
    storedSettings.providerModels,
  );

  return PROVIDER_ORDER.reduce((accumulator, provider) => {
    const providerModels = storedSettings.providerModels?.[provider];
    const legacyFieldKey = LEGACY_MODEL_FIELD_KEYS[provider];
    const legacyValue = legacyFieldKey
      ? storedSettings[legacyFieldKey]
      : undefined;
    const value =
      extractedModels[provider] ??
      (typeof providerModels === "string" && providerModels
        ? providerModels
        : typeof legacyValue === "string" && legacyValue
          ? legacyValue
          : undefined);

    if (value) {
      accumulator[provider] = value;
    }

    return accumulator;
  }, {} as StoredProviderModels);
}

function extractStoredProviderTtsVoices(
  storedSettings?: LegacyStoredSettings,
): Partial<ProviderTtsVoiceSelections> {
  if (!storedSettings) {
    return {};
  }

  const storedProviderVoices =
    extractRuntimeProviderStringRecord(
      storedSettings.providerTtsVoices,
    ) as Partial<ProviderTtsVoiceSelections>;
  const legacyTtsVoice =
    typeof storedSettings.ttsVoice === "string" && storedSettings.ttsVoice
      ? storedSettings.ttsVoice
      : undefined;

  return PROVIDER_ORDER.reduce((accumulator, provider) => {
    const providerVoice = storedProviderVoices[provider];
    const value =
      typeof providerVoice === "string" && providerVoice
        ? providerVoice
        : provider === "openai" && legacyTtsVoice
          ? legacyTtsVoice
          : undefined;

    if (value) {
      accumulator[provider] = value;
    }

    return accumulator;
  }, {} as Partial<ProviderTtsVoiceSelections>);
}

function extractStoredProviderTtsModels(
  storedSettings?: LegacyStoredSettings,
): Partial<ProviderTtsModelSelections> {
  return extractRuntimeProviderStringRecord(
    storedSettings?.providerTtsModels,
  ) as Partial<ProviderTtsModelSelections>;
}

function extractStoredProviderSttModels(
  storedSettings?: LegacyStoredSettings,
): Partial<ProviderSttModelSelections> {
  return extractRuntimeProviderStringRecord(
    storedSettings?.providerSttModels,
  ) as Partial<ProviderSttModelSelections>;
}

function extractStoredProviderValidationResults(
  storedSettings?: LegacyStoredSettings,
): ProviderValidationResults {
  const storedResults = storedSettings?.providerValidationResults;

  if (!storedResults || typeof storedResults !== "object") {
    return {};
  }

  const capabilities: ProviderCapability[] = [
    "llm",
    "stt",
    "tts",
    "search",
    "voices",
  ];
  const parseResult = (candidate: unknown): ProviderValidationResult | null => {
    if (!candidate || typeof candidate !== "object") {
      return null;
    }

    const value = candidate as Record<string, unknown>;

    if (
      (value.status !== "success" && value.status !== "error") ||
      typeof value.model !== "string"
    ) {
      return null;
    }

    return {
      status: value.status,
      model: value.model,
      ...(typeof value.message === "string"
        ? { message: value.message }
        : {}),
      ...(typeof value.configKey === "string"
        ? { configKey: value.configKey }
        : {}),
    };
  };

  return PROVIDER_ORDER.reduce((results, provider) => {
    const candidate = storedResults[provider] as unknown;

    if (!candidate || typeof candidate !== "object") {
      return results;
    }

    const legacyResult = parseResult(candidate);

    if (legacyResult) {
      const legacyCapability: ProviderCapability =
        PROVIDER_LLM_SUPPORT[provider] === "provider" ? "llm" : "tts";
      results[provider] = {
        [legacyCapability]: legacyResult,
      };
      return results;
    }

    const value = candidate as Record<string, unknown>;
    const capabilityResults = capabilities.reduce<
      NonNullable<ProviderValidationResults[Provider]>
    >((providerResults, capability) => {
      const parsed = parseResult(value[capability]);
      if (parsed) {
        providerResults[capability] = parsed;
      }
      return providerResults;
    }, {});

    if (Object.keys(capabilityResults).length > 0) {
      results[provider] = capabilityResults;
    }

    return results;
  }, {} as ProviderValidationResults);
}

function getLegacyResponseModeRoute(
  storedSettings: LegacyStoredSettings | undefined,
  providerModels: ProviderModelSelections,
): ResponseModeRoute {
  const provider = isProvider(storedSettings?.lastProvider)
    ? storedSettings.lastProvider
    : DEFAULT_SETTINGS.lastProvider;
  const providerModel = migrateProviderModelAlias(
    provider,
    providerModels[provider],
  );

  return normalizeResponseModeRouteEffort({
    provider,
    model: isValidModelForProvider(provider, providerModel)
      ? providerModel
      : getDefaultModelForProvider(provider),
  });
}

function extractStoredResponseModeRoute(
  entry: unknown,
  providerModels: ProviderModelSelections,
): ResponseModeRoute | null {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const candidate = entry as Partial<ResponseModeRoute>;
  const provider = isProvider(candidate.provider) ? candidate.provider : undefined;

  if (!provider) {
    return null;
  }

  const fallbackModel = migrateProviderModelAlias(
    provider,
    providerModels[provider] || getDefaultModelForProvider(provider),
  );
  const candidateModel =
    typeof candidate.model === "string"
      ? migrateProviderModelAlias(provider, candidate.model)
      : "";
  const model =
    candidateModel && isValidModelForProvider(provider, candidateModel)
      ? candidateModel
      : isValidModelForProvider(provider, fallbackModel)
        ? fallbackModel
        : getDefaultModelForProvider(provider);
  const effort =
    typeof candidate.effort === "string" && candidate.effort.trim()
      ? candidate.effort
      : undefined;

  return normalizeResponseModeRouteEffort({
    provider,
    model,
    ...(effort ? { effort } : {}),
  });
}

function extractStoredResponseModes(
  storedSettings: LegacyStoredSettings | undefined,
  providerModels: ProviderModelSelections,
): ResponseModeSelections {
  const storedResponseModes = storedSettings?.responseModes as unknown;

  if (!storedResponseModes || typeof storedResponseModes !== "object") {
    return [];
  }

  if (Array.isArray(storedResponseModes)) {
    return storedResponseModes
      .slice(0, MAX_RESPONSE_MODES)
      .reduce((accumulator, entry, index) => {
        const candidate = entry as Partial<ResponseModeConfig> | undefined;
        const route = extractStoredResponseModeRoute(
          candidate?.route,
          providerModels,
        );

        if (!route) {
          return accumulator;
        }

        const id =
          typeof candidate?.id === "string" && candidate.id.trim()
            ? candidate.id
            : createResponseModeId(index);

        accumulator.push({ id, route });
        return accumulator;
      }, [] as ResponseModeSelections);
  }

  return LEGACY_RESPONSE_MODE_ORDER.reduce((accumulator, legacyMode, index) => {
    const legacyRecord = storedResponseModes as Record<string, unknown>;
    const route = extractStoredResponseModeRoute(
      legacyRecord[legacyMode],
      providerModels,
    );

    if (route) {
      accumulator.push({
        id: createResponseModeId(index),
        route,
      });
    }

    return accumulator;
  }, [] as ResponseModeSelections);
}

function extractStoredWebSearchProviderSettings(
  storedSettings?: LegacyStoredSettings,
) {
  const defaults = createDefaultWebSearchProviderSettings();

  if (!storedSettings?.webSearchProviderSettings) {
    return defaults;
  }

  return Object.fromEntries(
    WEB_SEARCH_PROVIDER_IDS.map((provider) => [
      provider,
      normalizeWebSearchProviderSettings(
        provider,
        storedSettings.webSearchProviderSettings?.[provider],
      ),
    ]),
  ) as typeof defaults;
}

export function mergeSettings(
  rawStoredSettings?: LegacyStoredSettings,
  rawStoredApiKeys?: Partial<ProviderApiKeys>,
): Settings {
  const { storedSettings, storedApiKeys } = migrateLegacyProviders(
    rawStoredSettings,
    rawStoredApiKeys,
  );
  const mergedApiKeys = {
    ...createRuntimeProviderStringRecord(
      "",
      extractRuntimeProviderStringRecord(storedSettings?.apiKeys),
    ),
    ...extractRuntimeProviderStringRecord(storedApiKeys),
  };
  const mergedProviderModels = {
    ...DEFAULT_SETTINGS.providerModels,
    ...extractStoredProviderModels(storedSettings),
  };
  const mergedProviderSttModels = {
    ...DEFAULT_SETTINGS.providerSttModels,
    ...extractStoredProviderSttModels(storedSettings),
  };
  const mergedProviderTtsModels = {
    ...DEFAULT_SETTINGS.providerTtsModels,
    ...extractStoredProviderTtsModels(storedSettings),
  };

  for (const provider of PROVIDER_ORDER) {
    mergedProviderModels[provider] = migrateProviderModelAlias(
      provider,
      mergedProviderModels[provider],
    );
    const supportedSttModels = getProviderSttModelOptions(provider);

    if (supportedSttModels.length > 0) {
      const fallbackSttModel =
        PROVIDER_DEFAULT_STT_MODELS[provider] ?? supportedSttModels[0]?.id ?? "";

      if (
        mergedProviderSttModels[provider] &&
        !supportedSttModels.some((model) => model.id === mergedProviderSttModels[provider])
      ) {
        mergedProviderSttModels[provider] = fallbackSttModel;
      }
    }

    const supportedTtsModels = getProviderTtsModelOptions(provider);

    if (supportedTtsModels.length > 0) {
      const fallbackTtsModel =
        PROVIDER_DEFAULT_TTS_MODELS[provider] ?? supportedTtsModels[0]?.id ?? "";

      if (
        mergedProviderTtsModels[provider] &&
        !supportedTtsModels.some((model) => model.id === mergedProviderTtsModels[provider])
      ) {
        mergedProviderTtsModels[provider] = fallbackTtsModel;
      }
    }
  }

  const legacyResponseModeRoute = getLegacyResponseModeRoute(
    storedSettings,
    mergedProviderModels,
  );
  const extractedResponseModes = extractStoredResponseModes(
    storedSettings,
    mergedProviderModels,
  );
  const webSearchProviderSettings =
    extractStoredWebSearchProviderSettings(storedSettings);
  const hasStoredResponseModes = extractedResponseModes.length > 0;
  const legacyActiveResponseModeIndex = LEGACY_RESPONSE_MODE_ORDER.indexOf(
    storedSettings?.activeResponseMode as typeof LEGACY_RESPONSE_MODE_ORDER[number],
  );
  const activeResponseMode = (() => {
    const storedActiveResponseMode = storedSettings?.activeResponseMode;

    if (
      isResponseMode(storedActiveResponseMode) &&
      extractedResponseModes.some((mode) => mode.id === storedActiveResponseMode)
    ) {
      return storedActiveResponseMode;
    }

    if (legacyActiveResponseModeIndex >= 0) {
      return (
        extractedResponseModes[legacyActiveResponseModeIndex]?.id ??
        createResponseModeId(legacyActiveResponseModeIndex)
      );
    }

    return (
      extractedResponseModes[0]?.id ??
      DEFAULT_SETTINGS.activeResponseMode
    );
  })();
  const hasConfiguredKeys = Object.values(mergedApiKeys).some(
    (apiKey) => apiKey.trim().length > 0,
  );
  const scalarSettings = normalizeStoredScalarSettings(
    storedSettings,
    hasConfiguredKeys,
  );
  const sanitizedStoredSettings = storedSettings
    ? stripLegacySettingsFields(storedSettings)
    : storedSettings;

  return {
    ...DEFAULT_SETTINGS,
    ...sanitizedStoredSettings,
    ...scalarSettings,
    webSearchProviderSettings,
    activeResponseMode,
    responseModes:
      !storedSettings
        ? DEFAULT_SETTINGS.responseModes
        : hasStoredResponseModes
          ? extractedResponseModes
          : Array.from(
              { length: DEFAULT_RESPONSE_MODE_COUNT },
              (_, index) => ({
                id: createResponseModeId(index),
                route: legacyResponseModeRoute,
              }),
            ),
    providerModels: mergedProviderModels,
    providerSttModels: mergedProviderSttModels,
    providerTtsModels: mergedProviderTtsModels,
    providerTtsVoices: {
      ...DEFAULT_SETTINGS.providerTtsVoices,
      ...extractStoredProviderTtsVoices(storedSettings),
    },
    kokoroVoices: normalizeKokoroVoiceSelections(
      storedSettings?.kokoroVoices,
    ),
    ttsFallbackPolicy: normalizeTtsFallbackPolicy(
      storedSettings?.ttsFallbackPolicy,
    ),
    providerValidationResults:
      extractStoredProviderValidationResults(storedSettings),
    apiKeys: mergedApiKeys,
  };
}
