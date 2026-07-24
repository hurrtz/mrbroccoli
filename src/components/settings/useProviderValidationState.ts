import { useCallback, useEffect, useMemo, useState } from "react";

import { PROVIDER_LABELS } from "../../constants/models";
import type { WebSearchProvider } from "../../constants/webSearch";
import { useLocalization } from "../../i18n";
import type {
  Provider,
  ProviderValidationResult,
  Settings,
} from "../../types";
import { hasProviderCredentialForCapability } from "../../utils/providerCredentials";

import {
  getConfiguredProvidersForCapability,
  getProviderHealthState,
  getProviderValidationTarget,
  isWebSearchCapableProvider,
  providerSupportsCapability,
  type ProviderCapability,
} from "./providerSupport";
import type { ProviderHealthState, ProviderValidationState } from "./types";

export function useProviderValidationState(params: {
  settings: Settings;
  onValidateProvider: (provider: Provider) => Promise<void>;
  onValidateWebSearchProvider: (provider: WebSearchProvider) => Promise<void>;
  onValidationError?: (message: string) => void;
  onValidationResult: (
    provider: Provider,
    result: ProviderValidationResult,
  ) => void;
}) {
  const {
    settings,
    onValidateProvider,
    onValidateWebSearchProvider,
    onValidationError,
    onValidationResult,
  } = params;
  const { t } = useLocalization();
  const [validationStateByProvider, setValidationStateByProvider] = useState<
    Partial<Record<Provider, ProviderValidationState>>
  >({});
  const effectiveValidationStateByProvider = useMemo<
    Partial<Record<Provider, ProviderValidationState>>
  >(
    () => ({
      ...settings.providerValidationResults,
      ...validationStateByProvider,
    }),
    [settings.providerValidationResults, validationStateByProvider],
  );

  useEffect(() => {
    setValidationStateByProvider((previous) => {
      const next = { ...previous };
      let changed = false;

      for (const provider of Object.keys(previous) as Provider[]) {
        if (!settings.apiKeys[provider].trim()) {
          delete next[provider];
          changed = true;
        }
      }

      return changed ? next : previous;
    });
  }, [settings.apiKeys]);

  const getHealthState = useCallback(
    (provider: Provider): ProviderHealthState =>
      getProviderHealthState({
        provider,
        settings,
        validationStateByProvider: effectiveValidationStateByProvider,
      }),
    [effectiveValidationStateByProvider, settings],
  );

  const canValidateProvider = useCallback(
    (provider: Provider) => {
      const target = getProviderValidationTarget(settings, provider);

      return (
        target.kind !== null &&
        hasProviderCredentialForCapability(
          provider,
          settings.apiKeys[provider],
          target.kind,
        )
      );
    },
    [settings],
  );

  const getValidationState = useCallback(
    (provider: Provider): ProviderValidationState => {
      const target = getProviderValidationTarget(settings, provider);
      const candidate = effectiveValidationStateByProvider[provider];

      if (!settings.apiKeys[provider].trim() || !candidate) {
        return { status: "idle" };
      }

      const currentApiKey = settings.apiKeys[provider].trim();
      const stateMatchesCurrentConfig =
        (!candidate.apiKey || candidate.apiKey === currentApiKey) &&
        candidate.model === target.model &&
        candidate.configKey === target.configKey;

      return stateMatchesCurrentConfig ? candidate : { status: "idle" };
    },
    [effectiveValidationStateByProvider, settings],
  );

  const validateProviderForSettings = useCallback(
    async (provider: Provider) => {
      const target = getProviderValidationTarget(settings, provider);
      const trimmedApiKey = settings.apiKeys[provider].trim();

      if (
        !trimmedApiKey ||
        !target.kind ||
        !hasProviderCredentialForCapability(provider, trimmedApiKey, target.kind)
      ) {
        return;
      }

      setValidationStateByProvider((previous) => ({
        ...previous,
        [provider]: {
          status: "validating",
          apiKey: trimmedApiKey,
          model: target.model,
          configKey: target.configKey,
        },
      }));

      try {
        if (target.kind === "llm") {
          await onValidateProvider(provider);
        } else if (target.kind === "tts") {
          await onValidateProvider(provider);
        } else if (
          target.kind === "search" &&
          isWebSearchCapableProvider(provider)
        ) {
          await onValidateWebSearchProvider(provider);
        }

        const message = t("providerValidationSuccess", {
          provider: PROVIDER_LABELS[provider],
        });
        const result: ProviderValidationResult = {
          status: "success",
          message,
          model: target.model,
          configKey: target.configKey,
        };

        setValidationStateByProvider((previous) => ({
          ...previous,
          [provider]: {
            ...result,
            apiKey: trimmedApiKey,
          },
        }));
        onValidationResult(provider, result);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : t("providerValidationFailed");
        const result: ProviderValidationResult = {
          status: "error",
          message,
          model: target.model,
          configKey: target.configKey,
        };

        setValidationStateByProvider((previous) => ({
          ...previous,
          [provider]: {
            ...result,
            apiKey: trimmedApiKey,
          },
        }));
        onValidationResult(provider, result);
        onValidationError?.(message);
      }
    },
    [
      onValidateProvider,
      onValidateWebSearchProvider,
      onValidationError,
      onValidationResult,
      settings,
      t,
    ],
  );

  const getConfiguredProviders = useCallback(
    (capability: ProviderCapability) =>
      getConfiguredProvidersForCapability({
        capability,
        settings,
        validationStateByProvider: effectiveValidationStateByProvider,
      }),
    [effectiveValidationStateByProvider, settings],
  );

  const selectableLlmProviders = useMemo(
    () => getConfiguredProviders("llm"),
    [getConfiguredProviders],
  );
  const selectableSttProviders = useMemo(
    () => getConfiguredProviders("stt"),
    [getConfiguredProviders],
  );
  const selectableTtsProviders = useMemo(
    () => getConfiguredProviders("tts"),
    [getConfiguredProviders],
  );
  const selectableSearchProviders = useMemo(
    () => getConfiguredProviders("search").filter(isWebSearchCapableProvider),
    [getConfiguredProviders],
  );

  return {
    validationStateByProvider: effectiveValidationStateByProvider,
    getHealthState,
    getValidationState,
    canValidateProvider,
    validateProviderForSettings,
    selectableLlmProviders,
    selectableSttProviders,
    selectableTtsProviders,
    selectableSearchProviders,
    providerSupportsCapability,
  };
}
