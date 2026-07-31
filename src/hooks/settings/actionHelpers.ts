import type {
  Provider,
  ProviderCapability,
  ProviderValidationResult,
  ResponseMode,
  Settings,
} from "../../types";
import { PROVIDER_LLM_SUPPORT } from "../../constants/models";
import { resetProviderCircuit } from "../../services/providerResilience";
import {
  deriveResponseModesForProvider,
  getNextResponseModeId,
  getSuggestedResponseModeRoute,
} from "../../utils/responseModes";
import {
  MAX_RESPONSE_MODES,
  MIN_RESPONSE_MODES,
} from "../../constants/providers/defaults";
import {
  WEB_SEARCH_PROVIDER_IDS,
  type WebSearchProvider,
} from "../../constants/webSearch";
import { normalizeResponseModeRouteEffort } from "../../utils/modelEffort";
import { hasProviderCredentialForCapability } from "../../utils/providerCredentials";
import { persistApiKey, persistPublicSettings } from "./storage";

type SetSettings = React.Dispatch<React.SetStateAction<Settings>>;

function persistAndReturn(next: Settings) {
  void persistPublicSettings(next);
  return next;
}

function updateNestedSettingsRecord<K extends keyof Settings>(
  setSettings: SetSettings,
  key: K,
  entry: keyof Settings[K] & (string | number | symbol),
  value: string,
) {
  setSettings((prev) =>
    persistAndReturn({
      ...prev,
      [key]: {
        ...(prev[key] as Record<string, string>),
        [entry]: value,
      },
    }),
  );
}

export function updateTopLevelSettingsValue<K extends keyof Settings>(
  setSettings: SetSettings,
  key: K,
  value: Settings[K],
) {
  setSettings((prev) =>
    persistAndReturn({
      ...prev,
      [key]: value,
    }),
  );
}

export function createProviderModelUpdater(
  setSettings: SetSettings,
  key: "providerModels" | "providerSttModels" | "providerTtsModels" | "providerTtsVoices",
) {
  return (provider: Provider, value: string) => {
    updateNestedSettingsRecord(setSettings, key, provider, value);
  };
}

export function createProviderValidationResultUpdater(
  setSettings: SetSettings,
) {
  return (
    provider: Provider,
    capability: ProviderCapability,
    result: ProviderValidationResult,
  ) => {
    setSettings((prev) =>
      persistAndReturn({
        ...prev,
        providerValidationResults: {
          ...prev.providerValidationResults,
          [provider]: {
            ...prev.providerValidationResults[provider],
            [capability]: result,
          },
        },
      }),
    );
  };
}

export function createResponseModeUpdater(setSettings: SetSettings) {
  return (mode: ResponseMode, value: Settings["responseModes"][number]["route"]) => {
    const normalizedValue = normalizeResponseModeRouteEffort(value);

    setSettings((prev) =>
      persistAndReturn({
        ...prev,
        responseModes: prev.responseModes.map((entry) =>
          entry.id === mode ? { ...entry, route: normalizedValue } : entry,
        ),
      }),
    );
  };
}

export function createResponseModeAdder(setSettings: SetSettings) {
  return () => {
    setSettings((prev) => {
      if (prev.responseModes.length >= MAX_RESPONSE_MODES) {
        return prev;
      }

      const sourceRoute =
        getSuggestedResponseModeRoute(prev) ??
        prev.responseModes[prev.responseModes.length - 1]?.route ??
        prev.responseModes[0]?.route;

      if (!sourceRoute) {
        return prev;
      }

      const nextMode = {
        id: getNextResponseModeId(prev.responseModes),
        route: normalizeResponseModeRouteEffort(sourceRoute),
      };
      const next = {
        ...prev,
        activeResponseMode: nextMode.id,
        responseModes: [...prev.responseModes, nextMode],
      };

      return persistAndReturn(next);
    });
  };
}

export function createResponseModeRemover(setSettings: SetSettings) {
  return (mode: ResponseMode) => {
    setSettings((prev) => {
      if (prev.responseModes.length <= MIN_RESPONSE_MODES) {
        return prev;
      }

      const nextResponseModes = prev.responseModes.filter(
        (entry) => entry.id !== mode,
      );

      if (nextResponseModes.length === prev.responseModes.length) {
        return prev;
      }

      const nextActiveResponseMode =
        prev.activeResponseMode === mode
          ? nextResponseModes[0]?.id ?? prev.activeResponseMode
          : prev.activeResponseMode;

      return persistAndReturn({
        ...prev,
        activeResponseMode: nextActiveResponseMode,
        responseModes: nextResponseModes,
      });
    });
  };
}

function hasUsableResponseMode(settings: Settings): boolean {
  return settings.responseModes.some(
    ({ route }) =>
      route.model.trim().length > 0 &&
      hasProviderCredentialForCapability(
        route.provider,
        settings.apiKeys[route.provider],
        "llm",
      ),
  );
}

export function createApiKeyUpdater(setSettings: SetSettings) {
  return (provider: Provider, value: string) => {
    const nextValue = value.trim();
    resetProviderCircuit(provider);

    setSettings((prev) => {
      const previousValue = prev.apiKeys[provider].trim();
      const nextApiKeys = {
        ...prev.apiKeys,
        [provider]: nextValue,
      };
      const nextProviderValidationResults = {
        ...prev.providerValidationResults,
      };
      if (!nextValue || previousValue !== nextValue) {
        delete nextProviderValidationResults[provider];
      }

      const withKey: Settings = {
        ...prev,
        apiKeys: nextApiKeys,
        providerValidationResults: nextProviderValidationResults,
        webSearchProvider:
          !prev.webSearchProvider &&
          nextValue &&
          WEB_SEARCH_PROVIDER_IDS.includes(provider as WebSearchProvider)
            ? (provider as WebSearchProvider)
            : prev.webSearchProvider,
      };

      // If the user had no usable route before this key was entered, derive
      // distinct routes from the provider's curated models. Check `prev`, not
      // `withKey`: adding a key can make stale routes appear usable before we
      // have had a chance to replace old duplicated defaults.
      const shouldDerive =
        PROVIDER_LLM_SUPPORT[provider] === "provider" &&
        hasProviderCredentialForCapability(provider, nextValue, "llm") &&
        !hasUsableResponseMode(prev);

      const next: Settings = shouldDerive
        ? {
            ...withKey,
            responseModes: deriveResponseModesForProvider(provider),
          }
        : withKey;

      void persistPublicSettings(next);
      return next;
    });

    void persistApiKey(provider, nextValue);
  };
}
