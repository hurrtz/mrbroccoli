import type { Provider, SpeechLanguage, SttLanguage } from "../types";
import { RUNTIME_PROVIDER_MANIFEST } from "./providers/runtimeManifest";

export function getProviderSttLanguages(
  provider: Provider,
  model?: string,
): readonly SpeechLanguage[] {
  const stt = RUNTIME_PROVIDER_MANIFEST[provider].stt;
  return (
    stt.models.find(({ id }) => id === model)?.speechLanguages ??
    stt.languages ??
    []
  );
}

export function providerSupportsSttLanguage(
  provider: Provider,
  language: SttLanguage,
  model?: string,
) {
  return (
    language === "auto" ||
    getProviderSttLanguages(provider, model).includes(language)
  );
}

export function getProviderTtsLanguages(
  provider: Provider,
  model?: string,
): readonly SpeechLanguage[] {
  const tts = RUNTIME_PROVIDER_MANIFEST[provider].tts;
  return (
    tts.models.find(({ id }) => id === model)?.speechLanguages ??
    tts.languages ??
    []
  );
}

export function providerSupportsTtsLanguage(
  provider: Provider,
  language: SpeechLanguage,
  model?: string,
) {
  return getProviderTtsLanguages(provider, model).includes(language);
}
