import { getCatalogModelForAppProvider } from "../../catalog/appProviders";
import type { Provider } from "../../types";
import {
  RUNTIME_PROVIDER_MANIFEST,
  RUNTIME_PROVIDER_ORDER,
} from "./runtimeManifest";
import type { ModelInfo, ProviderConfig } from "./types";

export const NATIVE_STT_LANGUAGE_NOTE =
  "Language support depends on the device OS, installed speech packs, and recognizer availability. The exact language list varies by device.";

export const NATIVE_TTS_LANGUAGE_NOTE =
  "Language support depends on the system voices installed on the device. The exact language list, pronunciation quality, and offline availability vary by OS and device.";

export const WHISPER_WELL_SUPPORTED_LANGUAGES =
  "Afrikaans, Arabic, Armenian, Azerbaijani, Belarusian, Bosnian, Bulgarian, Catalan, Chinese, Croatian, Czech, Danish, Dutch, English, Estonian, Finnish, French, Galician, German, Greek, Hebrew, Hindi, Hungarian, Icelandic, Indonesian, Italian, Japanese, Kannada, Kazakh, Korean, Latvian, Lithuanian, Macedonian, Malay, Marathi, Maori, Nepali, Norwegian, Persian, Polish, Portuguese, Romanian, Russian, Serbian, Slovak, Slovenian, Spanish, Swahili, Swedish, Tagalog, Tamil, Thai, Turkish, Ukrainian, Urdu, Vietnamese, and Welsh.";

export const PROVIDER_ORDER: Provider[] = [...RUNTIME_PROVIDER_ORDER];

function buildRuntimeLlmModels(provider: Provider): ModelInfo[] {
  return RUNTIME_PROVIDER_MANIFEST[provider].llm.models.map(
    ({ id, fallbackName, releaseDate, effort, existingAccessOnly }) => ({
      id,
      name:
        getCatalogModelForAppProvider(provider, id, "llm")?.publicName ??
        fallbackName ??
        id,
      ...(releaseDate ? { releaseDate } : {}),
      ...(effort ? { effort } : {}),
      ...(existingAccessOnly ? { existingAccessOnly } : {}),
    }),
  );
}

export const PROVIDER_CONFIGS: Record<Provider, ProviderConfig> = Object.fromEntries(
  PROVIDER_ORDER.map((provider) => {
    const manifest = RUNTIME_PROVIDER_MANIFEST[provider];

    return [
      provider,
      {
        label: manifest.label,
        shortLabel: manifest.shortLabel,
        apiKeyPlaceholder: manifest.apiKeyPlaceholder,
        apiKeyHint: manifest.apiKeyHint,
        apiKeyUrl: manifest.apiKeyUrl,
        sttSupport: manifest.stt.support,
        ttsSupport: manifest.tts.support,
        ...(manifest.stt.languageNote
          ? { sttLanguageNote: manifest.stt.languageNote }
          : {}),
        ...(manifest.tts.languageNote
          ? { ttsLanguageNote: manifest.tts.languageNote }
          : {}),
        models: buildRuntimeLlmModels(provider),
      } satisfies ProviderConfig,
    ];
  }),
) as Record<Provider, ProviderConfig>;
