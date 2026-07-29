import { useCallback } from "react";

import {
  getProviderValidationTarget,
  isWebSearchCapableProvider,
} from "../../features/settings-core/providerSupport";
import { recordDebugLogEvent } from "../../services/debugLogCapture";
import { validateProviderConnection } from "../../services/llm";
import {
  validateSttProviderConnection,
  validateTtsProviderConnection,
} from "../../services/providerValidation";
import { fetchProviderVoices } from "../../services/providerVoiceDirectory";
import { validateWebSearchConnection } from "../../services/webSearch";
import type {
  AppLanguage,
  Provider,
  ProviderCapability,
  Settings,
} from "../../types";

export function useProviderConnectionValidation(params: {
  language: AppLanguage;
  settings: Settings;
}) {
  const { language, settings } = params;

  const validateProviderCapability = useCallback(
    async (provider: Provider, capability: ProviderCapability) => {
      const apiKey = settings.apiKeys[provider].trim();
      const target = getProviderValidationTarget(
        settings,
        provider,
        capability,
      );

      recordDebugLogEvent({
        event: "provider-capability-validation-requested",
        payload: { capability, provider, target: target.kind },
      });

      try {
        if (target.kind === "llm") {
          await validateProviderConnection({
            provider,
            model: target.model,
            apiKey,
            language,
          });
        } else if (target.kind === "stt") {
          await validateSttProviderConnection({
            provider,
            model: target.model,
            apiKey,
            language,
          });
        } else if (target.kind === "tts") {
          let voice = "";
          try {
            const parsed = target.configKey ? JSON.parse(target.configKey) : null;
            voice = typeof parsed?.voice === "string" ? parsed.voice : "";
          } catch {
            voice = "";
          }

          await validateTtsProviderConnection({
            provider,
            model: target.model,
            voice,
            apiKey,
            language,
          });
        } else if (
          target.kind === "search" &&
          isWebSearchCapableProvider(provider)
        ) {
          await validateWebSearchConnection({
            provider,
            apiKey,
            language,
            options: settings.webSearchProviderSettings[provider],
          });
        } else if (target.kind === "voices") {
          await fetchProviderVoices({
            provider,
            apiKey,
          });
        } else {
          throw new Error("This provider capability cannot be tested.");
        }

        recordDebugLogEvent({
          event: "provider-capability-validation-succeeded",
          payload: { capability, provider, target: target.kind },
        });
      } catch (error) {
        recordDebugLogEvent({
          event: "provider-capability-validation-failed",
          level: "error",
          payload: {
            capability,
            message: error instanceof Error ? error.message : String(error),
            provider,
            target: target.kind,
          },
        });
        throw error;
      }
    },
    [language, settings],
  );

  // The guided setup validates only the reply-generation route.
  const validateProvider = useCallback(
    (provider: Provider) => validateProviderCapability(provider, "llm"),
    [validateProviderCapability],
  );

  const validateWebSearchProvider = useCallback(
    (provider: Provider) => validateProviderCapability(provider, "search"),
    [validateProviderCapability],
  );

  return {
    validateProvider,
    validateProviderCapability,
    validateWebSearchProvider,
  };
}
