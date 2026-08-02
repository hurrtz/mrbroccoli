import {
  LOCAL_MODEL_CATALOG,
  getLocalModelsForLanguages,
  localModelSupportsLanguages,
} from "../../src/constants/localModels";

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
    }
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
});
