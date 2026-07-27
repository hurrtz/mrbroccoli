import type { AppLanguage, Provider } from "../../types";
import {
  getCatalogConstraintsForAppProvider,
  getCatalogModelForAppProvider,
} from "../../catalog/appProviders";
import {
  getStrictestCatalogMaxConstraint,
} from "../../catalog";
import {
  NATIVE_STT_LANGUAGE_NOTE,
  NATIVE_TTS_LANGUAGE_NOTE,
  PROVIDER_CONFIGS,
  PROVIDER_ORDER,
  WHISPER_WELL_SUPPORTED_LANGUAGES,
} from "./catalogData";

const NATIVE_STT_LANGUAGE_NOTES_BY_LANGUAGE: Record<AppLanguage, string> = {
  en: NATIVE_STT_LANGUAGE_NOTE,
  de:
    "Die Sprachunterstützung hängt vom Betriebssystem des Geräts, installierten Sprachpaketen und der Verfügbarkeit der Erkennung ab. Die genaue Liste variiert je nach Gerät.",
};

const NATIVE_TTS_LANGUAGE_NOTES_BY_LANGUAGE: Record<AppLanguage, string> = {
  en: NATIVE_TTS_LANGUAGE_NOTE,
  de:
    "Die Sprachunterstützung hängt von den auf dem Gerät installierten Systemstimmen ab. Die genaue Liste, Aussprachequalität und Offline-Verfügbarkeit variieren je nach Betriebssystem und Gerät.",
};

const GERMAN_PROVIDER_API_KEY_PLACEHOLDER_OVERRIDES: Partial<
  Record<Provider, string>
> = {
  openai: "sk-...",
  anthropic: "sk-ant-...",
  gemini: "Gemini API key|project-id|access-token|us",
  xai: "xai-...",
  deepseek: "sk-...",
  mistral: "API-Schlüssel eingeben",
};

const PROVIDER_API_KEY_PLACEHOLDERS_BY_LANGUAGE: Record<
  AppLanguage,
  Record<Provider, string>
> = {
  en: Object.fromEntries(
    PROVIDER_ORDER.map((provider) => [
      provider,
      PROVIDER_CONFIGS[provider].apiKeyPlaceholder,
    ]),
  ) as Record<Provider, string>,
  de: Object.fromEntries(
    PROVIDER_ORDER.map((provider) => [
      provider,
      GERMAN_PROVIDER_API_KEY_PLACEHOLDER_OVERRIDES[provider] ??
        PROVIDER_CONFIGS[provider].apiKeyPlaceholder,
    ]),
  ) as Record<Provider, string>,
};

const GENERIC_PROVIDER_API_KEY_HINTS: Record<AppLanguage, string> = {
  en:
    "Paste credentials for an external service you already use. Keys stay on this device and are used only for requests you start in the app.",
  de:
    "Füge Zugangsdaten für einen externen Dienst ein, den du bereits nutzt. Keys bleiben auf diesem Gerät und werden nur für Anfragen verwendet, die du in der App startest.",
};

const PROVIDER_API_KEY_HINT_OVERRIDES: Partial<
  Record<AppLanguage, Partial<Record<Provider, string>>>
> = {
  en: {
    openrouter: `${GENERIC_PROVIDER_API_KEY_HINTS.en} One OpenRouter key unlocks the curated gateway models below. Requests pass through OpenRouter to the selected upstream provider; direct provider keys remain separate.`,
    elevenlabs: `${GENERIC_PROVIDER_API_KEY_HINTS.en} Restricted ElevenLabs keys need Text to Speech permission for TTS and Speech to Text permission for STT. Voices read is optional and only unlocks the account voice library.`,
    "moonshot-ai-kimi": `${GENERIC_PROVIDER_API_KEY_HINTS.en} Kimi K3 requires at least one successful $1 account top-up before Moonshot unlocks access.`,
  },
  de: {
    openrouter: `${GENERIC_PROVIDER_API_KEY_HINTS.de} Ein OpenRouter-Key schaltet die kuratierten Gateway-Modelle frei. Anfragen laufen über OpenRouter zum ausgewählten Upstream-Anbieter; direkte Anbieter-Keys bleiben getrennt.`,
    elevenlabs: `${GENERIC_PROVIDER_API_KEY_HINTS.de} Eingeschränkte ElevenLabs-Keys benötigen für TTS die Berechtigung „Text to Speech“ und für STT „Speech to Text“. „Voices read“ ist optional und schaltet nur die persönliche Stimmenbibliothek frei.`,
    "moonshot-ai-kimi": `${GENERIC_PROVIDER_API_KEY_HINTS.de} Moonshot schaltet Kimi K3 erst nach einer erfolgreichen Kontoaufladung von mindestens 1 USD frei.`,
  },
};

const PROVIDER_STT_LANGUAGE_NOTES_BY_LANGUAGE: Partial<
  Record<AppLanguage, Partial<Record<Provider, string>>>
> = {
  en: Object.fromEntries(
    PROVIDER_ORDER.flatMap((provider) =>
      PROVIDER_CONFIGS[provider].sttLanguageNote
        ? [[provider, PROVIDER_CONFIGS[provider].sttLanguageNote]]
        : [],
    ),
  ) as Partial<Record<Provider, string>>,
  de: {
    openai:
      `OpenAI bietet aktuell gpt-4o-transcribe, gpt-4o-mini-transcribe und whisper-1 für Speech-to-Text an. Der von OpenAI veröffentlichte Satz gut unterstützter Sprachen lautet: ${WHISPER_WELL_SUPPORTED_LANGUAGES}`,
    mistral:
      "Die aktuelle Voxtral-Transkriptionsroute ist für Englisch, Spanisch, Französisch, Portugiesisch, Hindi, Deutsch, Niederländisch und Italienisch dokumentiert.",
  },
};

const PROVIDER_TTS_LANGUAGE_NOTES_BY_LANGUAGE: Partial<
  Record<AppLanguage, Partial<Record<Provider, string>>>
> = {
  en: Object.fromEntries(
    PROVIDER_ORDER.flatMap((provider) =>
      PROVIDER_CONFIGS[provider].ttsLanguageNote
        ? [[provider, PROVIDER_CONFIGS[provider].ttsLanguageNote]]
        : [],
    ),
  ) as Partial<Record<Provider, string>>,
  de: {
    openai:
      "OpenAI bietet aktuell gpt-4o-mini-tts, tts-1 und tts-1-hd für Text-to-Speech an. OpenAI veröffentlicht für TTS keine so kompakte Liste gut unterstützter Sprachen wie für STT und weist darauf hin, dass die Stimmen für Englisch optimiert sind.",
    gemini:
      "Gemini TTS unterstützt aktuell Arabisch, Bengalisch, Niederländisch, Englisch, Französisch, Deutsch, Hindi, Indonesisch, Italienisch, Japanisch, Koreanisch, Mandarin, Polnisch, Portugiesisch, Rumänisch, Russisch, Spanisch, Tamil, Telugu, Thai, Türkisch, Ukrainisch, Urdu und Vietnamesisch.",
    xai:
      "xAI TTS unterstützt aktuell Arabisch, Niederländisch, Englisch, Französisch, Deutsch, Hindi, Indonesisch, Italienisch, Japanisch, Koreanisch, Polnisch, Portugiesisch, Russisch, Spanisch, Thai, Türkisch, Vietnamesisch und Chinesisch.",
  },
};

export function getNativeSttLanguageNote(language: AppLanguage) {
  return NATIVE_STT_LANGUAGE_NOTES_BY_LANGUAGE[language];
}

export function getNativeTtsLanguageNote(language: AppLanguage) {
  return NATIVE_TTS_LANGUAGE_NOTES_BY_LANGUAGE[language];
}

export function getProviderApiKeyHint(provider: Provider, language: AppLanguage) {
  return (
    PROVIDER_API_KEY_HINT_OVERRIDES[language]?.[provider] ??
    GENERIC_PROVIDER_API_KEY_HINTS[language]
  );
}

export function getProviderApiKeyPlaceholder(
  provider: Provider,
  language: AppLanguage,
) {
  return PROVIDER_API_KEY_PLACEHOLDERS_BY_LANGUAGE[language][provider];
}

function getProviderSttLanguageNote(
  provider: Provider,
  language: AppLanguage,
) {
  return PROVIDER_STT_LANGUAGE_NOTES_BY_LANGUAGE[language]?.[provider] ?? null;
}

function formatApproximateCount(
  value: number,
  rawText: string | null,
) {
  return rawText?.includes(`${value}+`) ? `${value}+` : `${value}`;
}

function buildCatalogSpeechLanguageNote(params: {
  provider: Provider;
  modelId: string;
  service: "stt" | "tts";
  language: AppLanguage;
}) {
  const model = getCatalogModelForAppProvider(
    params.provider,
    params.modelId,
    params.service,
  );

  if (!model) {
    return null;
  }

  const languageSupport = model.languageSupport;

  if (!languageSupport) {
    return null;
  }

  const parts: string[] = [];

  if (languageSupport.voiceCount && languageSupport.languageCount) {
    const voiceCount = formatApproximateCount(
      languageSupport.voiceCount,
      languageSupport.rawText,
    );
    const languageCount = formatApproximateCount(
      languageSupport.languageCount,
      languageSupport.rawText,
    );

    parts.push(
      params.language === "de"
        ? `${voiceCount} Stimmen in ${languageCount} Sprachen`
        : `${voiceCount} voices across ${languageCount} languages`,
    );
  } else if (languageSupport.languageCount) {
    const languageCount = formatApproximateCount(
      languageSupport.languageCount,
      languageSupport.rawText,
    );

    parts.push(
      params.language === "de"
        ? `Unterstützt ${languageCount} Sprachen`
        : `Supports ${languageCount} languages`,
    );
  } else if (
    languageSupport.isMultilingual &&
    languageSupport.notes.includes("english-optimized")
  ) {
    parts.push(params.language === "de" ? "Mehrsprachig" : "Multilingual");
  }

  if (languageSupport.notes.includes("english-optimized")) {
    parts.push(
      params.language === "de"
        ? "Stimmen sind für Englisch optimiert"
        : "Voices are optimized for English",
    );
  }

  if (!parts.length) {
    return null;
  }

  return `${parts.join(". ")}.`;
}

export function getProviderSttLanguageNoteForModel(
  provider: Provider,
  modelId: string,
  language: AppLanguage,
) {
  return (
    buildCatalogSpeechLanguageNote({
      provider,
      modelId,
      service: "stt",
      language,
    }) ?? getProviderSttLanguageNote(provider, language)
  );
}

function formatByteLimit(bytes: number) {
  if (bytes % (1024 * 1024 * 1024) === 0) {
    return `${bytes / (1024 * 1024 * 1024)} GiB`;
  }

  if (bytes % (1024 * 1024) === 0) {
    return `${bytes / (1024 * 1024)} MiB`;
  }

  if (bytes >= 1_000_000_000) {
    return `${(bytes / 1_000_000_000).toFixed(1).replace(/\.0$/, "")} GB`;
  }

  if (bytes >= 1_000_000) {
    return `${(bytes / 1_000_000).toFixed(1).replace(/\.0$/, "")} MB`;
  }

  if (bytes >= 1_000) {
    return `${(bytes / 1_000).toFixed(1).replace(/\.0$/, "")} KB`;
  }

  return `${bytes} B`;
}

function formatDurationLimit(seconds: number, language: AppLanguage) {
  if (seconds % 3600 === 0) {
    const hours = seconds / 3600;
    return language === "de"
      ? `${hours} ${hours === 1 ? "Stunde" : "Stunden"}`
      : `${hours} ${hours === 1 ? "hour" : "hours"}`;
  }

  if (seconds % 60 === 0) {
    const minutes = seconds / 60;
    return language === "de"
      ? `${minutes} ${minutes === 1 ? "Minute" : "Minuten"}`
      : `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  }

  return language === "de"
    ? `${seconds} ${seconds === 1 ? "Sekunde" : "Sekunden"}`
    : `${seconds} ${seconds === 1 ? "second" : "seconds"}`;
}

export function getProviderSttLimitNote(
  provider: Provider,
  modelId: string,
  language: AppLanguage,
) {
  const constraints = getCatalogConstraintsForAppProvider(
    provider,
    modelId,
    "stt",
  );
  const parts: string[] = [];

  const exactFileSizeLimit = getStrictestCatalogMaxConstraint(
    constraints,
    "file_size_bytes",
  );
  const approximateFileSizeLimits = constraints
    .filter(
      (constraint) =>
        constraint.metric === "file_size_bytes" && constraint.comparator === "~",
    )
    .sort((left, right) => left.value - right.value);

  if (exactFileSizeLimit) {
    parts.push(
      language === "de"
        ? `Datei-Upload bis ${formatByteLimit(exactFileSizeLimit.value)}`
        : `File upload up to ${formatByteLimit(exactFileSizeLimit.value)}`,
    );
  } else if (approximateFileSizeLimits.length === 1) {
    parts.push(
      language === "de"
        ? `Ungefährer Datei-Upload bis ${formatByteLimit(
            approximateFileSizeLimits[0].value,
          )}`
        : `Approximate file upload limit ${formatByteLimit(
            approximateFileSizeLimits[0].value,
          )}`,
    );
  } else if (approximateFileSizeLimits.length > 1) {
    parts.push(
      language === "de"
        ? `Ungefährer Datei-Upload zwischen ${formatByteLimit(
            approximateFileSizeLimits[0].value,
          )} und ${formatByteLimit(
            approximateFileSizeLimits[approximateFileSizeLimits.length - 1].value,
          )} je nach Tarif`
        : `Approximate file upload limit ${formatByteLimit(
            approximateFileSizeLimits[0].value,
          )} to ${formatByteLimit(
            approximateFileSizeLimits[approximateFileSizeLimits.length - 1].value,
          )} depending on tier`,
    );
  }

  const durationLimit = [
    getStrictestCatalogMaxConstraint(constraints, "duration_seconds"),
    getStrictestCatalogMaxConstraint(constraints, "session_duration_seconds"),
  ]
    .filter((constraint): constraint is NonNullable<typeof constraint> => !!constraint)
    .sort((left, right) => left.value - right.value)[0];

  if (durationLimit) {
    parts.push(
      language === "de"
        ? `Audio bis ${formatDurationLimit(durationLimit.value, language)}`
        : `Audio up to ${formatDurationLimit(durationLimit.value, language)}`,
    );
  }

  if (!parts.length) {
    return null;
  }

  return `${parts.join(". ")}.`;
}

function getProviderTtsLanguageNote(
  provider: Provider,
  language: AppLanguage,
) {
  return PROVIDER_TTS_LANGUAGE_NOTES_BY_LANGUAGE[language]?.[provider] ?? null;
}

export function getProviderTtsLanguageNoteForModel(
  provider: Provider,
  modelId: string,
  language: AppLanguage,
) {
  return (
    buildCatalogSpeechLanguageNote({
      provider,
      modelId,
      service: "tts",
      language,
    }) ?? getProviderTtsLanguageNote(provider, language)
  );
}
