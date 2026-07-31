import { useLocalization } from "../../i18n";
import { PROVIDER_LABELS } from "../../constants/models";
import {
  AssistantResponseLength,
  AssistantResponseTone,
  Provider,
  TtsListenLanguage,
} from "../../types";
import {
  PROVIDER_PREVIEW_SAMPLE_TEXT_BY_LANGUAGE,
  getNativePreviewSampleText,
} from "../../constants/voicePreviewSamples";

import { NativeSpeechVoice } from "./types";

export function getResponseLengthOptions(
  t: ReturnType<typeof useLocalization>["t"],
): {
  value: AssistantResponseLength;
  label: string;
  description: string;
}[] {
  return [
    {
      value: "brief",
      label: t("brief"),
      description: t("briefDescription"),
    },
    {
      value: "normal",
      label: t("normal"),
      description: t("normalDescription"),
    },
    {
      value: "thorough",
      label: t("thorough"),
      description: t("thoroughDescription"),
    },
  ];
}

export function getResponseToneOptions(
  t: ReturnType<typeof useLocalization>["t"],
): {
  value: AssistantResponseTone;
  label: string;
  description: string;
}[] {
  return [
    {
      value: "professional",
      label: t("professional"),
      description: t("professionalDescription"),
    },
    {
      value: "casual",
      label: t("casual"),
      description: t("casualDescription"),
    },
    {
      value: "nerdy",
      label: t("nerdy"),
      description: t("nerdyDescription"),
    },
    {
      value: "concise",
      label: t("concise"),
      description: t("conciseDescription"),
    },
    {
      value: "socratic",
      label: t("socratic"),
      description: t("socraticDescription"),
    },
    {
      value: "eli5",
      label: t("eli5"),
      description: t("eli5Description"),
    },
  ];
}

export function getProviderPreviewSampleText(language: TtsListenLanguage) {
  return PROVIDER_PREVIEW_SAMPLE_TEXT_BY_LANGUAGE[language];
}

export { getNativePreviewSampleText };

export function getNativeVoiceOptionLabel(voice: NativeSpeechVoice) {
  return `${voice.name} · ${voice.language} · ${voice.quality}`;
}

export function normalizeNativeVoices(value: unknown): NativeSpeechVoice[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry): entry is NativeSpeechVoice => {
    if (!entry || typeof entry !== "object") {
      return false;
    }

    const candidate = entry as Partial<NativeSpeechVoice>;

    return (
      typeof candidate.identifier === "string" &&
      typeof candidate.name === "string" &&
      typeof candidate.language === "string" &&
      typeof candidate.quality === "string"
    );
  });
}

export function renderProviderPickerOptions(providers: readonly Provider[]) {
  return providers.map((provider) => ({
    value: provider,
    label: PROVIDER_LABELS[provider],
  }));
}
