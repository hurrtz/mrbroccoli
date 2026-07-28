import {
  SPEECH_LANGUAGE_OPTIONS,
  SPEECH_LANGUAGE_REGISTRY,
  isSpeechLanguage,
  normalizeSpeechLanguage,
  normalizeSttLanguage,
} from "../../src/constants/speechLanguages";
import {
  LOCAL_PREVIEW_SAMPLE_TEXT_BY_LANGUAGE,
  PROVIDER_PREVIEW_SAMPLE_TEXT_BY_LANGUAGE,
} from "../../src/constants/voicePreviewSamples";
import {
  APP_LANGUAGES,
  getAppLocale,
} from "../../src/i18n/localeRegistry";

describe("speech language registry", () => {
  it("officially represents every app-interface locale", () => {
    APP_LANGUAGES.forEach((language) => {
      expect(isSpeechLanguage(language)).toBe(true);
      expect(getAppLocale(language).defaultTtsListenLanguage).toBe(language);
    });
  });

  it("keeps Japanese as an additional speech-only language", () => {
    expect(SPEECH_LANGUAGE_OPTIONS).toContain("ja");
    expect(APP_LANGUAGES).not.toContain("ja");
  });

  it("provides routing metadata and previews for every language", () => {
    SPEECH_LANGUAGE_OPTIONS.forEach((language) => {
      const definition = SPEECH_LANGUAGE_REGISTRY[language];

      expect(definition.nativeLocale).toMatch(/^[a-z]{2,3}(?:-[A-Za-z0-9]+)+$/);
      expect(definition.providerCode.length).toBeGreaterThan(0);
      expect(definition.googleCloudLocale.length).toBeGreaterThan(0);
      expect(PROVIDER_PREVIEW_SAMPLE_TEXT_BY_LANGUAGE[language].trim()).not.toBe(
        "",
      );
      expect(LOCAL_PREVIEW_SAMPLE_TEXT_BY_LANGUAGE[language].trim()).not.toBe(
        "",
      );
    });
  });

  it("migrates legacy Chinese language IDs without guessing unknown values", () => {
    expect(normalizeSpeechLanguage("zh")).toBe("zh-CN");
    expect(normalizeSttLanguage("zh")).toBe("zh-CN");
    expect(normalizeSttLanguage("not-a-language")).toBe("auto");
    expect(normalizeSpeechLanguage("not-a-language")).toBeNull();
  });
});
