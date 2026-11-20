import fs from "fs";
import path from "path";

import { migrateProviderModelAlias } from "../../src/utils/responseModes";
import { RUNTIME_PROVIDER_MANIFEST } from "../../src/constants/providers/runtimeManifest";

import {
  getCatalogModel,
  getCatalogProvider,
  getCatalogRecordingConstraints,
  getCatalogStats,
  isCatalogProviderOpenAiCompatible,
  PROVIDER_CATALOG,
} from "../../src/catalog";

describe("provider catalog", () => {
  it("resolves an attributed research record for each curated direct or routed answering model", () => {
    const missing: string[] = [];
    for (const provider of Object.values(RUNTIME_PROVIDER_MANIFEST)) {
      for (const { id } of provider.llm.models) {
        const model = getCatalogModel(provider.catalogProviderId, id, "llm");
        if (!model?.officialSources.length) missing.push(id);
      }
    }
    expect(missing).toEqual([]);
  });

  it("migrates each published gateway alias to its curated snapshot", () => {
    for (const { id } of RUNTIME_PROVIDER_MANIFEST.openrouter.llm.models) {
      const card = getCatalogModel("openrouter", id, "llm");
      const aliases = card?.aliases ?? [];
      expect(aliases.length).toBeGreaterThan(0);
      for (const alias of aliases) {
        expect(migrateProviderModelAlias("openrouter", alias)).toBe(id);
      }
    }
  });

  it("reports public routed speech without exposing an unwired gateway picker", () => {
    const publicSupport = getCatalogProvider("openrouter")?.verifiedSupport;
    expect(publicSupport?.stt).toBe("routed");
    expect(publicSupport?.tts).toBe("routed");
    expect(RUNTIME_PROVIDER_MANIFEST.openrouter.stt.models).toEqual([]);
    expect(RUNTIME_PROVIDER_MANIFEST.openrouter.tts.models).toEqual([]);
  });

  it("looks up a routed snapshot and its public alias with gateway pricing and limits", () => {
    const snapshot = getCatalogModel("openrouter", "openai/gpt-6.2-astra-20261117", "llm");
    expect(getCatalogModel("openrouter", "openai/gpt-6.2-astra", "llm")).toBe(snapshot);
    expect(snapshot).toMatchObject({
      publicName: "OpenAI · GPT-6.2 Astra",
      priceMeasurements: expect.arrayContaining([
        expect.objectContaining({ unit: "million_input_tokens", amountUsd: 8 }),
        expect.objectContaining({ unit: "million_output_tokens", amountUsd: 40 }),
      ]),
      constraints: expect.arrayContaining([
        expect.objectContaining({ metric: "context_tokens", value: 1_050_000 }),
      ]),
      officialSources: expect.arrayContaining([
        "https://openrouter.ai/api/v1/models/openai/gpt-6.2-astra-20261117/endpoints",
      ]),
    });
  });

  it("matches the normalized provider and model counts in the flattened catalog", () => {
    expect(getCatalogStats()).toEqual({
      providerCount: 9,
      modelCount: 188,
      serviceCounts: {
        llm: 140,
        stt: 28,
        tts: 20,
      },
    });
  });

  it("exposes one typed provider document per provider with grouped model arrays", () => {
    expect(PROVIDER_CATALOG.providerDocuments).toHaveLength(9);
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

    expect(providerEntries).toHaveLength(9);
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
