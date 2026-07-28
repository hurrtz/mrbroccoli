import { useCallback, useEffect, useState } from "react";

import { TTS_LISTEN_LANGUAGE_OPTIONS } from "../../constants/localTts";
import {
  AppLanguage,
  KokoroLanguage,
  Provider,
  Settings,
  TtsListenLanguage,
} from "../../types";

import {
  getNativePreviewSampleText,
  getProviderPreviewSampleText,
} from "./helpers";
import { ProviderPreviewTexts } from "./types";

function buildProviderPreviewTexts(settings: Settings): ProviderPreviewTexts {
  return Object.fromEntries(
    (Object.keys(settings.apiKeys) as Provider[]).map((provider) => [
      provider,
      Object.fromEntries(
        TTS_LISTEN_LANGUAGE_OPTIONS.map((entry) => [
          entry,
          getProviderPreviewSampleText(entry),
        ]),
      ),
    ]),
  ) as ProviderPreviewTexts;
}

export function usePreviewTextState(params: {
  settings: Settings;
  language: AppLanguage;
}) {
  const { settings, language } = params;
  const [providerPreviewTexts, setProviderPreviewTexts] =
    useState<ProviderPreviewTexts>(() => buildProviderPreviewTexts(settings));
  const [nativePreviewText, setNativePreviewText] = useState(() =>
    getNativePreviewSampleText(settings.ttsListenLanguages[0] ?? "en"),
  );
  const [kokoroPreviewTexts, setKokoroPreviewTexts] = useState<
    Record<KokoroLanguage, string>
  >(() => ({
    en: getProviderPreviewSampleText("en"),
    zh: getProviderPreviewSampleText("zh-CN"),
  }));

  useEffect(() => {
    const previewLanguage = settings.ttsListenLanguages[0] ?? "en";
    const localizedSample = getNativePreviewSampleText(previewLanguage);

    setNativePreviewText((previous) =>
      TTS_LISTEN_LANGUAGE_OPTIONS.some(
        (candidate) => previous === getNativePreviewSampleText(candidate),
      )
        ? localizedSample
        : previous,
    );
  }, [settings.ttsListenLanguages]);

  const setProviderPreviewText = useCallback(
    (provider: Provider, previewLanguage: TtsListenLanguage, text: string) => {
      setProviderPreviewTexts((previous) => ({
        ...previous,
        [provider]: {
          ...previous[provider],
          [previewLanguage]: text,
        },
      }));
    },
    [],
  );

  const setKokoroPreviewText = useCallback(
    (previewLanguage: KokoroLanguage, text: string) => {
      setKokoroPreviewTexts((previous) => ({
        ...previous,
        [previewLanguage]: text,
      }));
    },
    [],
  );

  return {
    providerPreviewTexts,
    kokoroPreviewTexts,
    nativePreviewText,
    setProviderPreviewText,
    setKokoroPreviewText,
    setNativePreviewText,
  };
}
