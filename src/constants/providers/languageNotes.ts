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
    "Die Sprachunterstuetzung haengt vom Betriebssystem des Geraets, installierten Sprachpaketen und der Verfuegbarkeit der Erkennung ab. Die genaue Liste variiert je nach Geraet.",
};

const NATIVE_TTS_LANGUAGE_NOTES_BY_LANGUAGE: Record<AppLanguage, string> = {
  en: NATIVE_TTS_LANGUAGE_NOTE,
  de:
    "Die Sprachunterstuetzung haengt von den auf dem Geraet installierten Systemstimmen ab. Die genaue Liste, Aussprachequalitaet und Offline-Verfuegbarkeit variieren je nach Betriebssystem und Geraet.",
};

const GERMAN_PROVIDER_API_KEY_PLACEHOLDER_OVERRIDES: Partial<
  Record<Provider, string>
> = {
  openai: "sk-...",
  anthropic: "sk-ant-...",
  gemini: "Gemini API key|project-id|access-token|us",
  xai: "xai-...",
  deepseek: "sk-...",
  mistral: "API-Schluessel eingeben",
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
    "Füge Zugangsdaten fuer einen externen Dienst ein, den du bereits nutzt. Keys bleiben auf diesem Geraet und werden nur fuer Anfragen verwendet, die du in der App startest.",
};

const PROVIDER_API_KEY_HINT_OVERRIDES: Partial<
  Record<AppLanguage, Partial<Record<Provider, string>>>
> = {
  en: {
    elevenlabs: `${GENERIC_PROVIDER_API_KEY_HINTS.en} Restricted ElevenLabs keys need Text to Speech and Voices read access.`,
    "moonshot-ai-kimi": `${GENERIC_PROVIDER_API_KEY_HINTS.en} Kimi K3 requires at least one successful $1 account top-up before Moonshot unlocks access.`,
  },
  de: {
    elevenlabs: `${GENERIC_PROVIDER_API_KEY_HINTS.de} Eingeschraenkte ElevenLabs-Keys benoetigen Zugriff auf Text to Speech und das Lesen von Stimmen.`,
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
      `OpenAI bietet aktuell gpt-4o-transcribe, gpt-4o-mini-transcribe und whisper-1 fuer Speech-to-Text an. Der von OpenAI veroeffentlichte Satz gut unterstuetzter Sprachen lautet: ${WHISPER_WELL_SUPPORTED_LANGUAGES}`,
    mistral:
      "Die aktuelle Voxtral-Transkriptionsroute ist fuer Englisch, Spanisch, Franzoesisch, Portugiesisch, Hindi, Deutsch, Niederlaendisch und Italienisch dokumentiert.",
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
      "OpenAI bietet aktuell gpt-4o-mini-tts, tts-1 und tts-1-hd fuer Text-to-Speech an. OpenAI veroeffentlicht fuer TTS keine so kompakte Liste gut unterstuetzter Sprachen wie fuer STT und weist darauf hin, dass die Stimmen fuer Englisch optimiert sind.",
    gemini:
      "Gemini TTS unterstuetzt aktuell Arabisch, Bengalisch, Niederlaendisch, Englisch, Franzoesisch, Deutsch, Hindi, Indonesisch, Italienisch, Japanisch, Koreanisch, Mandarin, Polnisch, Portugiesisch, Rumaenisch, Russisch, Spanisch, Tamil, Telugu, Thai, Tuerkisch, Ukrainisch, Urdu und Vietnamesisch.",
    xai:
      "xAI TTS unterstuetzt aktuell Arabisch, Niederlaendisch, Englisch, Franzoesisch, Deutsch, Hindi, Indonesisch, Italienisch, Japanisch, Koreanisch, Polnisch, Portugiesisch, Russisch, Spanisch, Thai, Tuerkisch, Vietnamesisch und Chinesisch.",
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

export function getProviderSttLanguageNote(
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
        ? `Unterstuetzt ${languageCount} Sprachen`
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
        ? "Stimmen sind fuer Englisch optimiert"
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
        ? `Ungefaehrer Datei-Upload bis ${formatByteLimit(
            approximateFileSizeLimits[0].value,
          )}`
        : `Approximate file upload limit ${formatByteLimit(
            approximateFileSizeLimits[0].value,
          )}`,
    );
  } else if (approximateFileSizeLimits.length > 1) {
    parts.push(
      language === "de"
        ? `Ungefaehrer Datei-Upload zwischen ${formatByteLimit(
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

export function getProviderTtsLanguageNote(
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
