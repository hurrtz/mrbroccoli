import {
  FREE_SPEECH_LANGUAGE_OPTIONS,
  SPEECH_LANGUAGE_OPTIONS,
  SPEECH_LANGUAGE_REGISTRY,
  isSpeechLanguage,
  normalizeSpeechLanguage,
  normalizeSttLanguage,
  normalizeFreeSpeechLanguage,
  resolveFreeSpeechLanguage,
} from "../../src/constants/speechLanguages";
import {
  LOCAL_PREVIEW_SAMPLE_TEXT_BY_LANGUAGE,
  PROVIDER_PREVIEW_SAMPLE_TEXT_BY_LANGUAGE,
} from "../../src/constants/voicePreviewSamples";
import { APP_LANGUAGES, getAppLocale } from "../../src/i18n/localeRegistry";
import {
  RUNTIME_PROVIDER_MANIFEST,
  RUNTIME_PROVIDER_ORDER,
} from "../../src/constants/providers/runtimeManifest";

describe("speech language registry", () => {
  it("officially represents every app-interface locale", () => {
    APP_LANGUAGES.forEach((language) => {
      expect(isSpeechLanguage(language)).toBe(true);
      expect(getAppLocale(language).defaultTtsListenLanguage).toBe(language);
    });
  });

  it("registers Japanese as an interface and speech language", () => {
    expect(SPEECH_LANGUAGE_OPTIONS).toContain("ja");
    expect(APP_LANGUAGES).toContain("ja");
  });

  it("registers Hungarian as an interface and speech language", () => {
    expect(SPEECH_LANGUAGE_OPTIONS).toContain("hu");
    expect(APP_LANGUAGES).toContain("hu");
    expect(SPEECH_LANGUAGE_REGISTRY.hu.nativeLocale).toBe("hu-HU");
  });

  it("registers Czech as an interface and speech language", () => {
    expect(SPEECH_LANGUAGE_OPTIONS).toContain("cs");
    expect(APP_LANGUAGES).toContain("cs");
    expect(SPEECH_LANGUAGE_REGISTRY.cs.nativeLocale).toBe("cs-CZ");
  });

  it("registers Polish as an interface and speech language", () => {
    expect(SPEECH_LANGUAGE_OPTIONS).toContain("pl");
    expect(APP_LANGUAGES).toContain("pl");
    expect(SPEECH_LANGUAGE_REGISTRY.pl.nativeLocale).toBe("pl-PL");
  });

  it("registers Turkish as an interface and speech language", () => {
    expect(SPEECH_LANGUAGE_OPTIONS).toContain("tr");
    expect(APP_LANGUAGES).toContain("tr");
    expect(SPEECH_LANGUAGE_REGISTRY.tr.nativeLocale).toBe("tr-TR");
  });

  it("registers Swedish as an interface and speech language", () => {
    expect(SPEECH_LANGUAGE_OPTIONS).toContain("sv");
    expect(APP_LANGUAGES).toContain("sv");
    expect(SPEECH_LANGUAGE_REGISTRY.sv.nativeLocale).toBe("sv-SE");
  });

  it("registers Urdu as an interface and speech language", () => {
    expect(SPEECH_LANGUAGE_OPTIONS).toContain("ur");
    expect(APP_LANGUAGES).toContain("ur");
    expect(SPEECH_LANGUAGE_REGISTRY.ur.nativeLocale).toBe("ur-PK");
  });

  it("offers exactly seven single-choice Free speaking languages", () => {
    expect(FREE_SPEECH_LANGUAGE_OPTIONS).toEqual([
      "en",
      "es",
      "fr",
      "de",
      "pt",
      "ru",
      "it",
    ]);
    expect(normalizeFreeSpeechLanguage("pt-BR")).toBe("pt");
    expect(normalizeFreeSpeechLanguage("zh-CN")).toBeNull();
    expect(resolveFreeSpeechLanguage("pt", "pt-BR")).toBe("pt-BR");
    expect(resolveFreeSpeechLanguage("pt", "pt-PT")).toBe("pt");
  });

  it("provides routing metadata and previews for every language", () => {
    SPEECH_LANGUAGE_OPTIONS.forEach((language) => {
      const definition = SPEECH_LANGUAGE_REGISTRY[language];

      expect(definition.nativeLocale).toMatch(/^[a-z]{2,3}(?:-[A-Za-z0-9]+)+$/);
      expect(definition.providerCode.length).toBeGreaterThan(0);
      expect(definition.googleCloudLocale.length).toBeGreaterThan(0);
      expect(
        PROVIDER_PREVIEW_SAMPLE_TEXT_BY_LANGUAGE[language].trim(),
      ).not.toBe("");
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

  it("covers every app-interface locale with at least one provider STT route", () => {
    APP_LANGUAGES.forEach((language) => {
      expect(
        RUNTIME_PROVIDER_ORDER.some((provider) => {
          const stt = RUNTIME_PROVIDER_MANIFEST[provider].stt;
          return (
            stt.support === "provider" && stt.languages?.includes(language)
          );
        }),
      ).toBe(true);
    });
  });

  it("covers every app-interface locale with at least one provider TTS route", () => {
    APP_LANGUAGES.forEach((language) => {
      expect(
        RUNTIME_PROVIDER_ORDER.some((provider) => {
          const tts = RUNTIME_PROVIDER_MANIFEST[provider].tts;
          return (
            tts.support === "provider" && tts.languages?.includes(language)
          );
        }),
      ).toBe(true);
    });
  });
});
