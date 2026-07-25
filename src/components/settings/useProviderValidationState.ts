import { useCallback, useEffect, useMemo, useState } from "react";

import { PROVIDER_LABELS } from "../../constants/models";
import { useLocalization } from "../../i18n";
import type {
  Provider,
  ProviderCapability,
  ProviderValidationResult,
  Settings,
} from "../../types";

import {
  getConfiguredProvidersForCapability,
  getProviderCapabilities,
  getProviderCapabilityHealthState,
  getProviderHealthState,
  getProviderValidationTarget,
  isWebSearchCapableProvider,
  providerSupportsCapability,
} from "./providerSupport";
import type {
  ProviderHealthState,
  ProviderValidationState,
  ProviderValidationStates,
} from "./types";

function mergeValidationStates(
  persisted: Settings["providerValidationResults"],
  transient: ProviderValidationStates,
): ProviderValidationStates {
  const providers = new Set<Provider>([
    ...(Object.keys(persisted) as Provider[]),
    ...(Object.keys(transient) as Provider[]),
  ]);

  return [...providers].reduce<ProviderValidationStates>(
    (result, provider) => {
      result[provider] = {
        ...persisted[provider],
        ...transient[provider],
      };
      return result;
    },
    {},
  );
}

export function useProviderValidationState(params: {
  settings: Settings;
  onValidateProviderCapability: (
    provider: Provider,
    capability: ProviderCapability,
  ) => Promise<void>;
  onValidationError?: (message: string) => void;
  onValidationResult: (
    provider: Provider,
    capability: ProviderCapability,
    result: ProviderValidationResult,
  ) => void;
}) {
  const {
    settings,
    onValidateProviderCapability,
    onValidationError,
    onValidationResult,
  } = params;
  const { t } = useLocalization();
  const [validationStateByProvider, setValidationStateByProvider] =
    useState<ProviderValidationStates>({});
  const effectiveValidationStateByProvider = useMemo(
    () =>
      mergeValidationStates(
        settings.providerValidationResults,
        validationStateByProvider,
      ),
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

  const getCapabilityHealthState = useCallback(
    (
      provider: Provider,
      capability: ProviderCapability,
    ): ProviderHealthState =>
      getProviderCapabilityHealthState({
        provider,
        capability,
        settings,
        validationStateByProvider: effectiveValidationStateByProvider,
      }),
    [effectiveValidationStateByProvider, settings],
  );

  const canValidateCapability = useCallback(
    (provider: Provider, capability: ProviderCapability) =>
      getProviderValidationTarget(settings, provider, capability).kind !== null,
    [settings],
  );

  const getValidationState = useCallback(
    (
      provider: Provider,
      capability: ProviderCapability,
    ): ProviderValidationState => {
      const target = getProviderValidationTarget(
        settings,
        provider,
        capability,
      );
      const candidate =
        effectiveValidationStateByProvider[provider]?.[capability];

      if (!settings.apiKeys[provider].trim() || !target.kind || !candidate) {
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

  const validateProviderCapabilityForSettings = useCallback(
    async (provider: Provider, capability: ProviderCapability) => {
      const target = getProviderValidationTarget(
        settings,
        provider,
        capability,
      );
      const trimmedApiKey = settings.apiKeys[provider].trim();

      if (!trimmedApiKey || !target.kind) {
        return;
      }

      const validatingState: ProviderValidationState = {
        status: "validating",
        apiKey: trimmedApiKey,
        model: target.model,
        configKey: target.configKey,
      };
      setValidationStateByProvider((previous) => ({
        ...previous,
        [provider]: {
          ...previous[provider],
          [capability]: validatingState,
        },
      }));

      try {
        await onValidateProviderCapability(provider, capability);

        const message = t("providerCapabilityValidationSuccess", {
          capability: t(`providerCapability_${capability}`),
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
            ...previous[provider],
            [capability]: {
              ...result,
              apiKey: trimmedApiKey,
            },
          },
        }));
        onValidationResult(provider, capability, result);
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
            ...previous[provider],
            [capability]: {
              ...result,
              apiKey: trimmedApiKey,
            },
          },
        }));
        onValidationResult(provider, capability, result);
        onValidationError?.(message);
      }
    },
    [
      onValidateProviderCapability,
      onValidationError,
      onValidationResult,
      settings,
      t,
    ],
  );

  const validateAllProviderCapabilities = useCallback(
    async (provider: Provider) => {
      for (const capability of getProviderCapabilities(provider)) {
        if (canValidateCapability(provider, capability)) {
          await validateProviderCapabilityForSettings(provider, capability);
        }
      }
    },
    [canValidateCapability, validateProviderCapabilityForSettings],
  );

  const getConfiguredProviders = useCallback(
    (capability: "llm" | "stt" | "tts" | "search") =>
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
    getCapabilityHealthState,
    getValidationState,
    canValidateCapability,
    validateProviderCapabilityForSettings,
    validateAllProviderCapabilities,
    selectableLlmProviders,
    selectableSttProviders,
    selectableTtsProviders,
    selectableSearchProviders,
    providerSupportsCapability,
  };
}
