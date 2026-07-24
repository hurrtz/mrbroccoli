import {
  DEFAULT_PROVIDER_STT_MODELS,
  DEFAULT_PROVIDER_TTS_MODELS,
  PROVIDER_DEFAULT_MODELS,
  PROVIDER_MODELS,
  PROVIDER_ORDER,
  PROVIDER_STT_MODEL_OPTIONS,
  PROVIDER_TTS_MODEL_OPTIONS,
} from "../../../src/constants/models";
import { WEB_SEARCH_PROVIDER_IDS } from "../../../src/constants/webSearch";
import { deriveResponseModesForProvider } from "../../../src/utils/responseModes";
import type { Provider } from "../../../src/types";

function providerModelIds(provider: Provider) {
  return PROVIDER_MODELS[provider].map((model) => model.id);
}

describe("provider model accuracy", () => {
  it("does not expose dedicated web-search providers as runtime providers", () => {
    expect(PROVIDER_ORDER).toEqual([
      "openai",
      "anthropic",
      "alibaba-qwen-dashscope",
      "bytedance-doubao-seed",
      "gemini",
      "xai",
      "deepseek",
      "mistral",
      "elevenlabs",
      "moonshot-ai-kimi",
      "perplexity",
    ]);
    expect(WEB_SEARCH_PROVIDER_IDS).toEqual([
      "openai",
      "anthropic",
      "alibaba-qwen-dashscope",
      "bytedance-doubao-seed",
      "gemini",
      "xai",
      "mistral",
      "moonshot-ai-kimi",
      "perplexity",
    ]);
    expect(PROVIDER_ORDER).toEqual(
      expect.not.arrayContaining([
        "brave",
        "exa",
        "firecrawl",
        "serpapi",
        "tavily",
      ]),
    );
  });

  it("keeps curated defaults valid for the visible runtime picker", () => {
    for (const [provider, modelId] of Object.entries(PROVIDER_DEFAULT_MODELS) as [
      Provider,
      string,
    ][]) {
      if (!modelId) {
        continue;
      }

      expect(providerModelIds(provider)).toContain(modelId);
    }
  });

  it("uses the curated runtime picker, not broad catalog rows, for new response modes", () => {
    const modes = deriveResponseModesForProvider("perplexity");
    const runtimeIds = providerModelIds("perplexity");
    const modeModelIds = modes.map((mode) => mode.route.model);

    expect(modeModelIds).toEqual(runtimeIds.slice(0, 3));
    expect(modeModelIds).not.toContain("perplexity/sonar");
  });

  it("exposes current Anthropic Claude 5 models and hides retired Claude 4.0 rows", () => {
    expect(providerModelIds("anthropic")).toEqual(
      expect.arrayContaining(["claude-fable-5", "claude-sonnet-5"]),
    );
    expect(providerModelIds("anthropic")).not.toEqual(
      expect.arrayContaining([
        "claude-opus-4-20250514",
        "claude-sonnet-4-20250514",
        "claude-3-haiku-20240307",
      ]),
    );
    expect(PROVIDER_DEFAULT_MODELS.anthropic).toBe("claude-sonnet-5");
  });

  it("uses current DeepSeek V4 model IDs instead of deprecated aliases", () => {
    expect(providerModelIds("deepseek")).toEqual([
      "deepseek-v4-flash",
      "deepseek-v4-pro",
    ]);
    expect(PROVIDER_DEFAULT_MODELS.deepseek).toBe("deepseek-v4-flash");
  });

  it("uses current Mistral models and avoids deprecated model rows", () => {
    expect(providerModelIds("mistral")).toEqual(
      expect.arrayContaining([
        "mistral-medium-3-5",
        "mistral-small-2603",
        "mistral-large-2512",
      ]),
    );
    expect(providerModelIds("mistral")).not.toEqual(
      expect.arrayContaining([
        "mistral-medium-2508",
        "mistral-small-2506",
        "devstral-2512",
        "magistral-medium-2509",
        "magistral-small-2509",
      ]),
    );
    expect(PROVIDER_DEFAULT_MODELS.mistral).toBe("mistral-medium-3-5");
    expect(DEFAULT_PROVIDER_STT_MODELS.mistral).toBe("voxtral-mini-2602");
    expect(PROVIDER_STT_MODEL_OPTIONS.mistral?.map((model) => model.id)).toEqual([
      "voxtral-mini-2602",
    ]);
  });

  it("surfaces current Qwen and Doubao picker models", () => {
    expect(providerModelIds("alibaba-qwen-dashscope")).toEqual(
      expect.arrayContaining([
        "qwen3.7-max-2026-05-20",
        "qwen3.7-plus-2026-05-26",
        "qwen3.6-plus-2026-04-02",
        "qwen3.6-flash-2026-04-16",
      ]),
    );
    expect(PROVIDER_DEFAULT_MODELS["alibaba-qwen-dashscope"]).toBe(
      "qwen3.6-flash-2026-04-16",
    );
    expect(providerModelIds("alibaba-qwen-dashscope")).toEqual(
      expect.not.arrayContaining([
        "qwen3.7-max",
        "qwen3.7-plus",
        "qwen3.6-plus",
        "qwen3.6-flash",
        "qwen3.5-plus",
        "qwen3.5-flash",
        "qwen-plus",
        "qwen-flash",
      ]),
    );

    expect(providerModelIds("bytedance-doubao-seed")).toEqual(
      expect.arrayContaining([
        "doubao-seed-2-1-pro-260628",
        "doubao-seed-2-1-turbo-260628",
        "doubao-seed-2-0-lite-260428",
        "doubao-seed-2-0-mini-260428",
      ]),
    );
    expect(PROVIDER_DEFAULT_MODELS["bytedance-doubao-seed"]).toBe(
      "doubao-seed-2-1-turbo-260628",
    );
    expect(DEFAULT_PROVIDER_STT_MODELS["bytedance-doubao-seed"]).toBe("");
    expect(PROVIDER_STT_MODEL_OPTIONS["bytedance-doubao-seed"]).toBeUndefined();
  });

  it("surfaces current Kimi models and hides discontinued K2 rows", () => {
    expect(providerModelIds("moonshot-ai-kimi")).toEqual(
      expect.arrayContaining([
        "kimi-k3",
        "kimi-k2.7-code",
        "kimi-k2.7-code-highspeed",
        "kimi-k2.6",
      ]),
    );
    expect(providerModelIds("moonshot-ai-kimi")).not.toEqual(
      expect.arrayContaining([
        "kimi-k2-0905-preview",
        "kimi-k2-thinking",
        "kimi-k2-thinking-turbo",
        "kimi-latest",
        "kimi-thinking-preview",
        "kimi-k2.5",
        "moonshot-v1-128k",
        "moonshot-v1-32k",
        "moonshot-v1-8k",
      ]),
    );
    expect(PROVIDER_DEFAULT_MODELS["moonshot-ai-kimi"]).toBe("kimi-k3");
  });

  it("exposes Mistral's current Voxtral speech model", () => {
    expect(DEFAULT_PROVIDER_TTS_MODELS.mistral).toBe(
      "voxtral-mini-tts-2603",
    );
    expect(PROVIDER_TTS_MODEL_OPTIONS.mistral?.map((model) => model.id)).toEqual([
      "voxtral-mini-tts-2603",
    ]);
  });

  it("exposes current ElevenLabs conversational TTS models", () => {
    expect(PROVIDER_DEFAULT_MODELS.elevenlabs).toBe("");
    expect(DEFAULT_PROVIDER_TTS_MODELS.elevenlabs).toBe(
      "eleven_flash_v2_5",
    );
    expect(
      PROVIDER_TTS_MODEL_OPTIONS.elevenlabs?.map((model) => model.id),
    ).toEqual([
      "eleven_flash_v2_5",
      "eleven_multilingual_v2",
      "eleven_v3",
    ]);
  });

  it("keeps OpenAI and Perplexity pickers aligned with their current callable endpoints", () => {
    expect(providerModelIds("openai")).toEqual(
      expect.arrayContaining([
        "gpt-5.6-sol",
        "gpt-5.6-terra",
        "gpt-5.6-luna",
        "gpt-realtime-2.1",
        "gpt-realtime-2.1-mini",
      ]),
    );
    expect(PROVIDER_DEFAULT_MODELS.openai).toBe("gpt-5.6-sol");
    expect(providerModelIds("openai")).not.toContain("gpt-4.1-nano");
    expect(providerModelIds("openai")).not.toContain("gpt-5.5-pro");
    expect(providerModelIds("openai")).not.toContain("gpt-5.5");
    expect(providerModelIds("openai")).toEqual(
      expect.arrayContaining([
        "gpt-5.5-2026-04-23",
        "gpt-5.4-2026-03-05",
      ]),
    );
    expect(providerModelIds("openai")).not.toContain("gpt-realtime-1.5");
    expect(providerModelIds("perplexity")).toEqual([
      "sonar",
      "sonar-pro",
      "sonar-reasoning-pro",
      "sonar-deep-research",
    ]);
  });

  it("keeps code-specific xAI models out of the voice-chat picker", () => {
    expect(providerModelIds("xai")).toEqual(["grok-4.5", "grok-4.3"]);
    expect(PROVIDER_DEFAULT_MODELS.xai).toBe("grok-4.5");
    expect(providerModelIds("xai")).not.toContain("grok-build-0.1");
  });
});
