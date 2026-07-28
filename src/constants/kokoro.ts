import type {
  AppLanguage,
  KokoroLanguage,
  KokoroVoiceSelections,
  TtsListenLanguage,
} from "../types";
import { translate, type TranslationKey } from "../i18n";
import type { TranslationParams } from "../i18n/types";

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
  labelKey: TranslationKey;
  labelParams: TranslationParams;
};

const KOKORO_VOICE_OPTIONS: Record<
  KokoroLanguage,
  readonly KokoroVoiceOption[]
> = {
  en: [
    {
      id: "af_maple",
      sid: 0,
      labelKey: "kokoroAmericanFemaleVoice",
      labelParams: { name: "Maple" },
    },
    {
      id: "af_sol",
      sid: 1,
      labelKey: "kokoroAmericanFemaleVoice",
      labelParams: { name: "Sol" },
    },
    {
      id: "bf_vale",
      sid: 2,
      labelKey: "kokoroBritishFemaleVoice",
      labelParams: { name: "Vale" },
    },
  ],
  zh: [
    {
      id: "zf_001",
      sid: 3,
      labelKey: "kokoroChineseFemaleVoice",
      labelParams: { index: 1 },
    },
    {
      id: "zf_017",
      sid: 11,
      labelKey: "kokoroChineseFemaleVoice",
      labelParams: { index: 2 },
    },
    {
      id: "zf_099",
      sid: 57,
      labelKey: "kokoroChineseFemaleVoice",
      labelParams: { index: 3 },
    },
    {
      id: "zm_009",
      sid: 58,
      labelKey: "kokoroChineseMaleVoice",
      labelParams: { index: 1 },
    },
    {
      id: "zm_050",
      sid: 77,
      labelKey: "kokoroChineseMaleVoice",
      labelParams: { index: 2 },
    },
    {
      id: "zm_100",
      sid: 102,
      labelKey: "kokoroChineseMaleVoice",
      labelParams: { index: 3 },
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
    label: translate(appLanguage, voice.labelKey, voice.labelParams),
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
