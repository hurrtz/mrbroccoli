import {
  createProviderContext,
  defineProviderDocument,
  defineProviderDefinition,
  defineProviderDocuments,
} from "../../data/providers/definitions";
import type {
  CatalogProvider,
  CatalogProviderDocument,
} from "../../src/catalog";

function createDocument(
  overrides: Partial<CatalogProviderDocument> = {},
): CatalogProviderDocument {
  const provider: CatalogProvider = {
    providerId: "provider-a",
    providerName: "Provider A",
    categoryName: "Test",
    hq: "US",
    verifiedSupport: {
      llm: "native",
      stt: "unsupported",
      tts: "unsupported",
    },
    officialSources: ["https://example.com"],
    integration: {
      catalogType: "Fixed",
      coverage: "Mostly exhaustive",
      hasDynamicCatalog: false,
      needsLiveDiscovery: false,
      supportsSpeech: false,
      lowConfidence: false,
      openAiCompatible: null,
      protocols: [],
      regionSplitRecommended: false,
    },
    summaries: {
      activeModels: {
        llm: "Model A [model-a]",
        stt: null,
        tts: null,
      },
      pricing: null,
      limits: null,
      region: null,
      sttLanguages: null,
      ttsLanguages: null,
      freeTier: null,
      integrationNotes: null,
    },
  };
  const llms = [
    {
      providerId: "provider-a",
      providerName: "Provider A",
      service: "llm" as const,
      modelId: "model-a",
      aliases: ["model-a-latest"],
      publicName: "Model A",
      status: "active",
      catalogScope: "fixed",
      pricingSummary: null,
      limitsSummary: null,
      regionSummary: null,
      languagesSummary: null,
      notes: null,
      officialSources: ["https://example.com"],
      openAiCompatible: null,
      supportsRealtime: true,
      supportsBatch: true,
      priceMeasurements: [],
      constraints: [],
      languageSupport: null,
    },
  ];

  return {
    provider,
    llms,
    stt: [],
    tts: [],
    ...overrides,
  };
}

describe("catalog definitions", () => {
  it("builds provider-scoped models and derives active model summaries", () => {
    const providerDefinition = defineProviderDefinition({
      ...createDocument().provider,
      summaries: {
        ...createDocument().provider.summaries,
        activeModels: undefined,
        pricing: "Provider pricing",
        region: "Provider region",
      },
    });
    const providerContext = createProviderContext(providerDefinition);
    const llms = providerContext.defineLlms([
      providerContext.llm({
        modelId: "model-a",
        publicName: "Model A",
        status: "active",
        limitsSummary: null,
        languagesSummary: null,
        notes: "Realtime text+audio",
        supportsRealtime: true,
        supportsBatch: true,
        priceMeasurements: [],
        constraints: [],
        languageSupport: null,
      }),
    ]);
    const document = providerContext.document({
      llms,
      stt: [],
      tts: [],
    });

    expect(document.llms[0]).toMatchObject({
      providerId: "provider-a",
      providerName: "Provider A",
      pricingSummary: "Provider pricing",
      regionSummary: "Provider region",
      officialSources: ["https://example.com"],
    });
    expect(document.provider.summaries.activeModels).toEqual({
      llm: "Model A [model-a] — Realtime text+audio",
      stt: null,
      tts: null,
    });
  });

  it("rejects provider documents with mismatched model services", () => {
    expect(() =>
      defineProviderDocument({
        ...createDocument(),
        llms: [
          {
            ...createDocument().llms[0],
            service: "stt" as never,
          },
        ],
      }),
    ).toThrow("Catalog service mismatch");
  });

  it("rejects duplicate provider IDs across documents", () => {
    expect(() =>
      defineProviderDocuments([createDocument(), createDocument()]),
    ).toThrow("Duplicate catalog provider ID");
  });

  it("rejects alias collisions with canonical model IDs", () => {
    expect(() =>
      defineProviderDocument({
        ...createDocument(),
        llms: [
          createDocument().llms[0],
          {
            ...createDocument().llms[0],
            modelId: "model-b",
            publicName: "Model B",
            aliases: ["model-a"],
          },
        ],
      }),
    ).toThrow("Catalog alias collides with canonical model ID");
  });

  it("allows alias reuse across services when lookups stay service-aware", () => {
    expect(() =>
      defineProviderDocument({
        ...createDocument(),
        stt: [
          {
            ...createDocument().llms[0],
            service: "stt",
            modelId: "speech-model",
            publicName: "Speech Model",
            aliases: ["model-a-latest"],
          },
        ],
      }),
    ).not.toThrow();
  });
});
