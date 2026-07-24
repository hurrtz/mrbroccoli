import fs from "fs";
import path from "path";

import {
  getCatalogModel,
  getCatalogProvider,
  getCatalogRecordingConstraints,
  getCatalogStats,
  isCatalogProviderOpenAiCompatible,
  PROVIDER_CATALOG,
} from "../../src/catalog";

describe("provider catalog", () => {
  it("matches the normalized provider and model counts in the flattened catalog", () => {
    expect(getCatalogStats()).toEqual({
      providerCount: 11,
      modelCount: 127,
      serviceCounts: {
        llm: 95,
        stt: 15,
        tts: 17,
      },
    });
  });

  it("exposes one typed provider document per provider with grouped model arrays", () => {
    expect(PROVIDER_CATALOG.providerDocuments).toHaveLength(11);
    expect(
      PROVIDER_CATALOG.providerDocuments.every(
        (document) =>
          Array.isArray(document.llms) &&
          Array.isArray(document.stt) &&
          Array.isArray(document.tts),
      ),
    ).toBe(true);
  });

  it("keeps the catalog flattened to typed ts sources and removes legacy artifacts", () => {
    const providersDir = path.join(
      process.cwd(),
      "data",
      "providers",
    );
    const providerEntries = fs.readdirSync(providersDir).filter((entry) => {
      if (entry === "index.ts" || entry === "definitions.ts") {
        return false;
      }

      const fullPath = path.join(providersDir, entry);
      const stats = fs.statSync(fullPath);

      return (
        (stats.isFile() && entry.endsWith(".ts")) ||
        (stats.isDirectory() && fs.existsSync(path.join(fullPath, "index.ts")))
      );
    });

    expect(providerEntries).toHaveLength(11);
    expect(
      fs.existsSync(
        path.join(process.cwd(), "data", "providers", "definitions.ts"),
      ),
    ).toBe(true);
    expect(
      fs.existsSync(
        path.join(
          process.cwd(),
          "scripts",
          "provider_catalog",
          "generate_provider_index.py",
        ),
      ),
    ).toBe(true);
    expect(
      fs.existsSync(
        path.join(
          process.cwd(),
          "data",
          "providers",
          "openai",
          "index.ts",
        ),
      ),
    ).toBe(true);
    expect(
      fs.existsSync(
        path.join(process.cwd(), "data", "providers", "catalog.snapshot.json"),
      ),
    ).toBe(false);
    expect(
      fs.existsSync(
        path.join(
          process.cwd(),
          "data",
          "providers",
          "reports",
          "compass-research-report.json",
        ),
      ),
    ).toBe(false);
  });

  it("preserves workbook support states in the flattened provider document", () => {
    const mistral = getCatalogProvider("mistral-ai");
    expect(mistral?.verifiedSupport.stt).toBe("native");
    expect(mistral?.verifiedSupport.tts).toBe("native");
    expect(mistral?.summaries.activeModels.stt).toContain(
      "Voxtral Mini Transcribe 2 [voxtral-mini-2602]",
    );
    expect(mistral?.summaries.activeModels.tts).toContain(
      "Voxtral Mini TTS 26.03 [voxtral-mini-tts-2603]",
    );
  });

  it("captures derived recording safeguards for OpenAI transcription models", () => {
    const constraints = getCatalogRecordingConstraints(
      "openai",
      "gpt-4o-mini-transcribe",
      "stt",
    );

    expect(constraints).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          metric: "file_size_bytes",
          comparator: "<=",
          value: 25_000_000,
        }),
      ]),
    );
  });

  it("stores compatibility and dynamic-catalog hints from the supplemental report", () => {
    const openai = getCatalogProvider("openai");

    expect(openai?.integration.hasDynamicCatalog).toBe(true);
    expect(openai?.integration.needsLiveDiscovery).toBe(true);
    expect(isCatalogProviderOpenAiCompatible("openai")).toBe(true);
  });

  it("normalizes price and language metadata on representative models", () => {
    const xaiTts = getCatalogModel("xai", "text-to-speech", "tts");
    const openaiStt = getCatalogModel(
      "openai",
      "gpt-4o-mini-transcribe",
      "stt",
    );

    expect(xaiTts?.priceMeasurements).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          amountUsd: 15,
          unit: "million_characters",
        }),
      ]),
    );
    expect(openaiStt?.languageSupport?.languageCount).toBe(57);
  });

  it("stores provider-level source attribution on imported research-backed providers", () => {
    const openai = getCatalogProvider("openai");

    expect(openai?.sources?.length).toBeGreaterThan(0);
    expect(openai?.sources?.[0]).toEqual(
      expect.objectContaining({
        type: "official",
        url: expect.stringContaining("openai.com"),
      }),
    );
  });
});
