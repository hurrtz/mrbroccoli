import {
  getAppProviderForCatalogProviderId,
  getCatalogConstraintsForAppProvider,
  getCatalogModelForAppProvider,
  getCatalogModelsForAppProvider,
  getCatalogProviderForAppProvider,
  getCatalogProviderIdForAppProvider,
  getCatalogRealtimeModelsForAppProvider,
  getCatalogVerifiedServiceStateForAppProvider,
  isCatalogServiceSupportedForAppProvider,
} from "../../src/catalog/appProviders";
import {
  isCatalogProviderId,
  listCatalogProviderIds,
} from "../../src/catalog";
import {
  PROVIDER_CATALOG_IDS,
  PROVIDER_CATALOG_VERIFIED_SUPPORT,
  PROVIDER_NEEDS_LIVE_MODEL_DISCOVERY,
} from "../../src/constants/models";

describe("app provider catalog bridge", () => {
  it("maps every runtime provider to a catalog provider", () => {
    expect(PROVIDER_CATALOG_IDS).toEqual({
      openai: "openai",
      openrouter: "openrouter",
      anthropic: "anthropic",
      "alibaba-qwen-dashscope": "alibaba-qwen-dashscope",
      gemini: "google-vertex-ai-studio",
      deepseek: "deepseek",
      elevenlabs: "elevenlabs",
      mistral: "mistral-ai",
      xai: "xai",
    });

    expect(getCatalogProviderIdForAppProvider("openai")).toBe("openai");
    expect(getCatalogProviderIdForAppProvider("gemini")).toBe(
      "google-vertex-ai-studio",
    );
    expect(getAppProviderForCatalogProviderId("openai")).toBe("openai");
    expect(getAppProviderForCatalogProviderId("anthropic")).toBe("anthropic");
    expect(getAppProviderForCatalogProviderId("google-vertex-ai-studio")).toBe(
      "gemini",
    );
    expect(getAppProviderForCatalogProviderId("mistral-ai")).toBe("mistral");
    expect(getAppProviderForCatalogProviderId("elevenlabs")).toBe(
      "elevenlabs",
    );
    expect(getAppProviderForCatalogProviderId("deepseek")).toBe("deepseek");
    expect(getAppProviderForCatalogProviderId("xai")).toBe("xai");
    expect(isCatalogProviderId("google-vertex-ai-studio")).toBe(true);
    expect(isCatalogProviderId("not-a-provider")).toBe(false);
    expect(listCatalogProviderIds()).toContain("openai");
    expect(listCatalogProviderIds()).toContain("anthropic");
    expect(listCatalogProviderIds()).toContain("mistral-ai");
    expect(listCatalogProviderIds()).toContain("elevenlabs");
  });

  it("reads verified support states from the catalog without changing runtime support flags", () => {
    expect(getCatalogVerifiedServiceStateForAppProvider("openai", "tts")).toBe(
      "native",
    );
    expect(getCatalogVerifiedServiceStateForAppProvider("xai", "stt")).toBe(
      "native",
    );
    expect(getCatalogVerifiedServiceStateForAppProvider("mistral", "stt")).toBe(
      "native",
    );

    expect(PROVIDER_CATALOG_VERIFIED_SUPPORT.openai.tts).toBe("native");
    expect(PROVIDER_CATALOG_VERIFIED_SUPPORT.xai.stt).toBe("native");
  });

  it("exposes provider-level discovery hints and model accessors", () => {
    expect(PROVIDER_NEEDS_LIVE_MODEL_DISCOVERY.deepseek).toBe(true);
    expect(PROVIDER_NEEDS_LIVE_MODEL_DISCOVERY.openai).toBe(true);

    expect(getCatalogProviderForAppProvider("openai")?.providerName).toBe(
      "OpenAI",
    );
    expect(
      getCatalogModelsForAppProvider("openai", "llm").some(
        (model) => model.modelId === "gpt-5.6-sol",
      ),
    ).toBe(true);
  });

  it("returns model-level safeguards and realtime hints for mapped providers", () => {
    const openAiModel = getCatalogModelForAppProvider(
      "openai",
      "gpt-4o-mini-transcribe",
      "stt",
    );

    expect(openAiModel?.publicName).toBe("GPT-4o mini Transcribe");
    expect(openAiModel?.supportsRealtime).toBe(true);

    expect(
      getCatalogConstraintsForAppProvider(
        "openai",
        "gpt-4o-mini-transcribe",
        "stt",
      ),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          metric: "file_size_bytes",
          value: 25_000_000,
        }),
      ]),
    );

    expect(
      getCatalogRealtimeModelsForAppProvider("gemini", "llm").some(
        (model) => model.modelId === "gemini-3.1-flash-live-preview",
      ),
    ).toBe(true);
  });

  it("supports broad capability checks for future picker and safeguard work", () => {
    expect(isCatalogServiceSupportedForAppProvider("anthropic", "tts")).toBe(false);
    expect(isCatalogServiceSupportedForAppProvider("openai", "tts")).toBe(true);
    expect(isCatalogServiceSupportedForAppProvider("mistral", "stt")).toBe(true);
  });
});
