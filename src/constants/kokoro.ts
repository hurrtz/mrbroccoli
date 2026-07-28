import type {
  AppLanguage,
  KokoroLanguage,
  KokoroVoiceSelections,
  TtsListenLanguage,
} from "../types";

export const KOKORO_MODEL_ID = "kokoro-int8-multi-lang-v1_1";
export const KOKORO_MODEL_DOWNLOAD_BYTES = 147_031_220;
export const KOKORO_MODEL_INSTALLED_BYTES = 221_000_000;
export const KOKORO_IDLE_RELEASE_MS = 12_000;
export const KOKORO_TTS_TARGET_CHUNK_CHARS = 240;

const KOKORO_SUPPORTED_LANGUAGES = [
  "en",
  "zh",
] as const satisfies readonly TtsListenLanguage[];

type KokoroVoiceOption = {
  id: string;
  sid: number;
  labels: Record<AppLanguage, string>;
};

const KOKORO_VOICE_OPTIONS: Record<
  KokoroLanguage,
  readonly KokoroVoiceOption[]
> = {
  en: [
    {
      id: "af_maple",
      sid: 0,
      labels: {
        en: "Maple · American female",
        de: "Maple · US-Englisch, weiblich",
        uk: "Maple · американська англійська, жіночий голос",
        hi: "Maple · अमेरिकी अंग्रेज़ी, महिला आवाज़",
        es: "Maple · inglés estadounidense, voz femenina",
        fr: "Maple · anglais américain, voix féminine",
        it: "Maple · inglese americano, voce femminile",
      },
    },
    {
      id: "af_sol",
      sid: 1,
      labels: {
        en: "Sol · American female",
        de: "Sol · US-Englisch, weiblich",
        uk: "Sol · американська англійська, жіночий голос",
        hi: "Sol · अमेरिकी अंग्रेज़ी, महिला आवाज़",
        es: "Sol · inglés estadounidense, voz femenina",
        fr: "Sol · anglais américain, voix féminine",
        it: "Sol · inglese americano, voce femminile",
      },
    },
    {
      id: "bf_vale",
      sid: 2,
      labels: {
        en: "Vale · British female",
        de: "Vale · britisches Englisch, weiblich",
        uk: "Vale · британська англійська, жіночий голос",
        hi: "Vale · ब्रिटिश अंग्रेज़ी, महिला आवाज़",
        es: "Vale · inglés británico, voz femenina",
        fr: "Vale · anglais britannique, voix féminine",
        it: "Vale · inglese britannico, voce femminile",
      },
    },
  ],
  zh: [
    {
      id: "zf_001",
      sid: 3,
      labels: {
        en: "Chinese female 1",
        de: "Chinesisch, weiblich 1",
        uk: "Китайська, жіночий голос 1",
        hi: "चीनी, महिला आवाज़ 1",
        es: "Chino, voz femenina 1",
        fr: "Chinois, voix féminine 1",
        it: "Cinese, voce femminile 1",
      },
    },
    {
      id: "zf_017",
      sid: 11,
      labels: {
        en: "Chinese female 2",
        de: "Chinesisch, weiblich 2",
        uk: "Китайська, жіночий голос 2",
        hi: "चीनी, महिला आवाज़ 2",
        es: "Chino, voz femenina 2",
        fr: "Chinois, voix féminine 2",
        it: "Cinese, voce femminile 2",
      },
    },
    {
      id: "zf_099",
      sid: 57,
      labels: {
        en: "Chinese female 3",
        de: "Chinesisch, weiblich 3",
        uk: "Китайська, жіночий голос 3",
        hi: "चीनी, महिला आवाज़ 3",
        es: "Chino, voz femenina 3",
        fr: "Chinois, voix féminine 3",
        it: "Cinese, voce femminile 3",
      },
    },
    {
      id: "zm_009",
      sid: 58,
      labels: {
        en: "Chinese male 1",
        de: "Chinesisch, männlich 1",
        uk: "Китайська, чоловічий голос 1",
        hi: "चीनी, पुरुष आवाज़ 1",
        es: "Chino, voz masculina 1",
        fr: "Chinois, voix masculine 1",
        it: "Cinese, voce maschile 1",
      },
    },
    {
      id: "zm_050",
      sid: 77,
      labels: {
        en: "Chinese male 2",
        de: "Chinesisch, männlich 2",
        uk: "Китайська, чоловічий голос 2",
        hi: "चीनी, पुरुष आवाज़ 2",
        es: "Chino, voz masculina 2",
        fr: "Chinois, voix masculine 2",
        it: "Cinese, voce maschile 2",
      },
    },
    {
      id: "zm_100",
      sid: 102,
      labels: {
        en: "Chinese male 3",
        de: "Chinesisch, männlich 3",
        uk: "Китайська, чоловічий голос 3",
        hi: "चीनी, पुरुष आवाज़ 3",
        es: "Chino, voz masculina 3",
        fr: "Chinois, voix masculine 3",
        it: "Cinese, voce maschile 3",
      },
    },
  ],
};

export const DEFAULT_KOKORO_VOICES: KokoroVoiceSelections = {
  en: "af_maple",
  zh: "zf_001",
};

export function isKokoroLanguage(
  language: TtsListenLanguage,
): language is KokoroLanguage {
  return KOKORO_SUPPORTED_LANGUAGES.includes(language as KokoroLanguage);
}

export function getKokoroVoiceOptions(
  language: KokoroLanguage,
  appLanguage: AppLanguage,
) {
  return KOKORO_VOICE_OPTIONS[language].map((voice) => ({
    value: voice.id,
    label: voice.labels[appLanguage],
  }));
}

export function getKokoroVoiceConfig(
  language: KokoroLanguage,
  voice: string,
) {
  return (
    KOKORO_VOICE_OPTIONS[language].find((candidate) => candidate.id === voice) ??
    KOKORO_VOICE_OPTIONS[language][0]
  );
}

export function normalizeKokoroVoiceSelections(
  value: unknown,
): KokoroVoiceSelections {
  if (!value || typeof value !== "object") {
    return { ...DEFAULT_KOKORO_VOICES };
  }

  const candidate = value as Partial<Record<KokoroLanguage, unknown>>;

  return {
    en:
      typeof candidate.en === "string" &&
      KOKORO_VOICE_OPTIONS.en.some((voice) => voice.id === candidate.en)
        ? candidate.en
        : DEFAULT_KOKORO_VOICES.en,
    zh:
      typeof candidate.zh === "string" &&
      KOKORO_VOICE_OPTIONS.zh.some((voice) => voice.id === candidate.zh)
        ? candidate.zh
        : DEFAULT_KOKORO_VOICES.zh,
  };
}

export function resolveKokoroLanguage(params: {
  text: string;
  listenLanguages?: TtsListenLanguage[];
}): KokoroLanguage | null {
  const listenLanguages: TtsListenLanguage[] = params.listenLanguages?.length
    ? params.listenLanguages
    : ["en"];
  const unsupportedLanguageSelected = listenLanguages.some(
    (language) => !isKokoroLanguage(language),
  );

  if (unsupportedLanguageSelected) {
    return null;
  }

  const containsHanCharacters = /[\u3400-\u4dbf\u4e00-\u9fff]/u.test(
    params.text,
  );

  if (containsHanCharacters && listenLanguages.includes("zh")) {
    return "zh";
  }

  if (listenLanguages.includes("en")) {
    return "en";
  }

  return listenLanguages.includes("zh") ? "zh" : null;
}
