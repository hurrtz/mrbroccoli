import {
  getProviderLabel,
  getProviderModelName,
  PROVIDER_MODELS,
} from "../../../src/constants/models";

describe("provider metadata constants", () => {
  it("uses catalog-backed labels for runtime model pickers when the catalog knows the model", () => {
    expect(getProviderModelName("anthropic", "claude-opus-4-8")).toBe(
      "Claude Opus 4.8",
    );
    expect(getProviderModelName("anthropic", "claude-sonnet-4-6")).toBe(
      "Claude Sonnet 4.6",
    );
  });

  it("keeps the configured label when the catalog does not expose that exact runtime model id", () => {
    expect(getProviderModelName("deepseek", "deepseek-coder")).toBe(
      "DeepSeek Coder (legacy alias)",
    );
    expect(
      getProviderModelName("xai", "grok-4.20-non-reasoning"),
    ).toBe("Grok 4.20 Non-Reasoning");
  });

  it("uses direct catalog labels for known models even outside the curated picker list", () => {
    expect(getProviderModelName("xai", "grok-4")).toBe("Grok 4.3");
    expect(getProviderModelName("xai", "grok-latest")).toBe("Grok 4.3");
  });

  it("keeps historical provider metadata readable after a route is removed", () => {
    expect(getProviderLabel("moonshot-ai-kimi")).toBe("Moonshot");
    expect(getProviderModelName("retired-provider", "retired-model")).toBe(
      "retired-model",
    );
  });

  it("surfaces newly added Anthropic picker models from the catalog", () => {
    expect(
      PROVIDER_MODELS.anthropic.find((model) => model.id === "claude-opus-4-8")
        ?.name,
    ).toBe("Claude Opus 4.8");
  });

  it("surfaces newly added xAI picker models from the catalog", () => {
    expect(
      PROVIDER_MODELS.xai.find((model) => model.id === "grok-4.3")?.name,
    ).toBe("Grok 4.3");
    expect(PROVIDER_MODELS.xai.map((model) => model.id)).not.toContain(
      "grok-build-0.1",
    );
  });

  it("does not expose retired xAI model slugs in the picker", () => {
    expect(PROVIDER_MODELS.xai.map((model) => model.id)).not.toEqual(
      expect.arrayContaining([
        "grok-4-1-fast-reasoning",
        "grok-4-1-fast-non-reasoning",
        "grok-4-0709",
        "grok-4-fast-reasoning",
        "grok-code-fast-1",
        "grok-3",
      ]),
    );
  });

  it("surfaces stable Gemini 3 picker models from the runtime manifest", () => {
    expect(
      PROVIDER_MODELS.gemini.find((model) => model.id === "gemini-3.6-flash")
        ?.name,
    ).toBe("Gemini 3.6 Flash");
    expect(
      PROVIDER_MODELS.gemini.find((model) => model.id === "gemini-3.5-flash")
        ?.name,
    ).toBe("Gemini 3.5 Flash");
    expect(
      PROVIDER_MODELS.gemini.find(
        (model) => model.id === "gemini-3.5-flash-lite",
      )?.name,
    ).toBe("Gemini 3.5 Flash-Lite");
    expect(
      PROVIDER_MODELS.gemini.find((model) => model.id === "gemini-3.1-flash-lite")
        ?.name,
    ).toBe("Gemini 3.1 Flash-Lite");
  });
});
