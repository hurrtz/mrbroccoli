import type { Provider, SpeechLanguage, SttLanguage } from "../types";
import { RUNTIME_PROVIDER_MANIFEST } from "./providers/runtimeManifest";

export function getProviderSttLanguages(
  provider: Provider,
): readonly SpeechLanguage[] {
  const stt = RUNTIME_PROVIDER_MANIFEST[provider].stt;
  return stt.support === "provider" ? (stt.languages ?? []) : [];
}

export function providerSupportsSttLanguage(
  provider: Provider,
  language: SttLanguage,
) {
  return (
    language === "auto" ||
    getProviderSttLanguages(provider).includes(language)
  );
}
