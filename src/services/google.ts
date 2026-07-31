import { PROVIDER_LABELS } from "../constants/models";
import { translate } from "../i18n";
import type { AppLanguage } from "../types";

export interface GoogleAiStudioCredentials {
  apiKey: string;
}

export function parseGoogleAiStudioCredentials(apiKey?: string | null) {
  const normalized = apiKey?.trim();
  return normalized && !normalized.includes("|")
    ? ({ apiKey: normalized } satisfies GoogleAiStudioCredentials)
    : null;
}

export function requireGoogleAiStudioCredentials(
  apiKey: string | undefined,
  language: AppLanguage,
) {
  const credentials = parseGoogleAiStudioCredentials(apiKey);

  if (credentials) {
    return credentials;
  }

  throw new Error(
    translate(language, "providerConfiguredInSettings", {
      provider: PROVIDER_LABELS.gemini,
    }),
  );
}
