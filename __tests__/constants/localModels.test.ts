import {
  LOCAL_MODEL_CATALOG,
  getLocalModelsForLanguages,
  localModelSupportsLanguages,
} from "../../src/constants/localModels";
import { FREE_SPEECH_LANGUAGE_OPTIONS } from "../../src/constants/speechLanguages";

describe("local model catalogue", () => {
  it("contains only version-pinned artifacts with integrity metadata", () => {
    expect(new Set(LOCAL_MODEL_CATALOG.map(({ id }) => id)).size).toBe(
      LOCAL_MODEL_CATALOG.length,
    );

    for (const model of LOCAL_MODEL_CATALOG) {
      expect(model.downloadUrl).toMatch(/^https:\/\//);
      expect(model.downloadBytes).toBeGreaterThan(0);
      expect(model.installedBytes).toBeGreaterThanOrEqual(model.downloadBytes);
      expect(model.sha256).toMatch(/^[a-f0-9]{64}$/);
      expect(model.requirements.platforms).toEqual(["android", "ios"]);
      expect(["recommended", "advanced"]).toContain(model.catalogTier);
    }
  });

  it("pins the reviewed upstream Faber artifact", () => {
    // The upstream release replaced this asset without changing its filename
    // or byte length. Keeping its reviewed digest explicit makes that drift a
    // deliberate catalogue update rather than an unchecked download.
    expect(
      LOCAL_MODEL_CATALOG.find(({ id }) => id === "piper-pt-br-faber"),
    ).toMatchObject({
      downloadBytes: 21_336_772,
      sha256:
        "dbc8b1d7d729fd417ea78a350ed35696c928770ac93513d3f507bd4e88eee3fd",
    });
  });

  it("requires one selected model to support every chosen language", () => {
    expect(
      getLocalModelsForLanguages("tts", ["en", "de"]).map(({ id }) => id),
    ).toEqual([]);
    expect(
      getLocalModelsForLanguages("tts", ["en", "zh-CN"]).map(({ id }) => id),
    ).toEqual(["kokoro-multilingual"]);
    expect(
      localModelSupportsLanguages(LOCAL_MODEL_CATALOG[0], ["de", "uk"]),
    ).toBe(true);
  });

  it("covers every Free language with a compact local voice", () => {
    expect(
      getLocalModelsForLanguages("tts", ["it"]).map(({ id }) => id),
    ).toContain("piper-it-it-paola");
    expect(
      getLocalModelsForLanguages("tts", ["ru"]).map(({ id }) => id),
    ).toContain("piper-ru-ru-dmitri");
    expect(
      getLocalModelsForLanguages("tts", ["pt"]).map(({ id }) => id),
    ).toContain("piper-pt-pt-tugao");
    expect(
      getLocalModelsForLanguages("tts", ["pt-BR"]).map(({ id }) => id),
    ).toContain("piper-pt-br-faber");
  });

  it("offers a curated multilingual recognition range", () => {
    const modelIds = getLocalModelsForLanguages("stt", [
      "en",
      "it",
      "pt",
      "ru",
    ]).map(({ id }) => id);

    expect(modelIds).toEqual([
      "whisper-tiny",
      "whisper-base",
      "whisper-small",
      "omnilingual-asr-300m",
      "parakeet-tdt-0.6b-v3-int8",
      "qwen3-asr-0.6b-int8",
    ]);
  });

  it("keeps strong reasoning choices for Russian without offering unsupported models", () => {
    const modelIds = getLocalModelsForLanguages("llm", ["ru"]).map(
      ({ id }) => id,
    );

    expect(modelIds).toEqual([
      "qwen3-0.6b-q8",
      "qwen3.5-0.8b-q8",
      "qwen3-1.7b-q8",
      "qwen3-4b-q4",
    ]);
    expect(modelIds).not.toContain("granite-4.0-1b-q4");
    expect(modelIds).not.toContain("ministral-3-3b-reasoning-q4");
  });

  it.each(["en", "de", "es", "fr", "it", "pt-BR", "ru"] as const)(
    "offers at least two downloadable voices for %s",
    (language) => {
      expect(
        getLocalModelsForLanguages("tts", [language]).length,
      ).toBeGreaterThanOrEqual(2);
    },
  );

  it("keeps the only permissively licensed European Portuguese Piper voice", () => {
    expect(
      getLocalModelsForLanguages("tts", ["pt"]).map(({ id }) => id),
    ).toEqual(["piper-pt-pt-tugao"]);
  });

  it.each([...FREE_SPEECH_LANGUAGE_OPTIONS, "pt-BR"] as const)(
    "provides a recommended route and advanced range for %s",
    (language) => {
      const llms = getLocalModelsForLanguages("llm", [language]);
      const stt = getLocalModelsForLanguages("stt", [language]);
      const tts = getLocalModelsForLanguages("tts", [language]);

      expect(
        llms.some(({ catalogTier }) => catalogTier === "recommended"),
      ).toBe(true);
      expect(llms.some(({ catalogTier }) => catalogTier === "advanced")).toBe(
        true,
      );
      expect(stt.some(({ catalogTier }) => catalogTier === "recommended")).toBe(
        true,
      );
      expect(stt.some(({ catalogTier }) => catalogTier === "advanced")).toBe(
        true,
      );
      expect(tts.some(({ catalogTier }) => catalogTier === "recommended")).toBe(
        true,
      );
      if (language !== "pt") {
        expect(tts.some(({ catalogTier }) => catalogTier === "advanced")).toBe(
          true,
        );
      }
    },
  );
});
