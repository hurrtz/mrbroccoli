import {
  deriveResponseModesForProvider,
  getAvailableResponseModes,
  getDefaultModelForProvider,
  getProviderValidationModel,
  isResponseModeReady,
} from "../../src/utils/responseModes";
import { PROVIDER_MODELS } from "../../src/constants/models";
import { DEFAULT_SETTINGS } from "../../src/types";

describe("response mode selectors", () => {
  it("exposes no usable response mode on a fresh install without keys", () => {
    expect(getAvailableResponseModes(DEFAULT_SETTINGS)).toEqual([]);
  });

  it("returns only response modes backed by configured provider keys", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      responseModes: [
        {
          id: "mode-1",
          route: { provider: "gemini" as const, model: "gemini-2.5-flash" },
        },
        {
          id: "mode-2",
          route: {
            provider: "anthropic" as const,
            model: "claude-sonnet-4-6",
          },
        },
        {
          id: "mode-3",
          route: { provider: "openai" as const, model: "gpt-5.4" },
        },
      ],
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        gemini: "gemini-test-key",
        openai: "sk-test",
      },
    };

    expect(getAvailableResponseModes(settings)).toEqual(["mode-1", "mode-3"]);
  });

  it("prefers the active response mode model when validating a provider", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      activeResponseMode: "mode-1",
      responseModes: [
        {
          id: "mode-1",
          route: {
            provider: "openai" as const,
            model: "gpt-5-mini",
          },
        },
        {
          id: "mode-2",
          route: {
            provider: "openai" as const,
            model: "gpt-5.4",
          },
        },
      ],
      providerModels: {
        ...DEFAULT_SETTINGS.providerModels,
        openai: "gpt-4.1",
      },
    };

    expect(getProviderValidationModel(settings, "openai")).toBe(
      "gpt-5-mini",
    );
  });

  it("uses the curated provider default instead of the first picker entry", () => {
    expect(getDefaultModelForProvider("anthropic")).toBe("claude-sonnet-5");
    expect(getDefaultModelForProvider("xai")).toBe("grok-4.5");
  });

  it("does not treat a model-less route as a usable response mode", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      responseModes: [
        { id: "mode-1", route: { provider: "openai" as const, model: "" } },
        { id: "mode-2", route: { provider: "openai" as const, model: "" } },
      ],
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        openai: "sk-test",
      },
    };

    expect(isResponseModeReady(settings, "mode-1")).toBe(false);
    expect(getAvailableResponseModes(settings)).toEqual([]);
  });

  it("allows any non-empty Gemini key for response modes and defers validity to server validation", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      responseModes: [
        {
          id: "mode-1",
          route: {
            provider: "gemini" as const,
            model: "gemini-2.5-flash",
          },
        },
      ],
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        gemini: "not-a-google-key",
      },
    };

    expect(isResponseModeReady(settings, "mode-1")).toBe(true);
  });

  it("derives effort defaults for effort-capable Gemini response routes", () => {
    const modes = deriveResponseModesForProvider("gemini");

    expect(modes[0].route).toEqual({
      provider: "gemini",
      model: "gemini-3.5-flash",
      effort: "medium",
    });
    expect(modes[1].route).toEqual({
      provider: "gemini",
      model: "gemini-3.1-pro-preview",
      effort: "high",
    });
  });
});

describe("deriveResponseModesForProvider", () => {
  it("maps the first three dynamic modes to curated runtime models of the provider", () => {
    const expected = PROVIDER_MODELS.openai
      .slice(0, 3)
      .map((model) => model.id);

    expect(expected.length).toBe(3);

    const modes = deriveResponseModesForProvider("openai");

    expect(modes).toHaveLength(3);
    expect(modes.map((mode) => mode.id)).toEqual([
      "mode-1",
      "mode-2",
      "mode-3",
    ]);
    expect(modes[0].route).toEqual({
      provider: "openai",
      model: expected[0],
      effort: "medium",
    });
    expect(modes[1].route).toEqual({
      provider: "openai",
      model: expected[1],
      effort: "medium",
    });
    expect(modes[2].route).toEqual({
      provider: "openai",
      model: expected[2],
      effort: "medium",
    });

    const distinct = new Set(modes.map((mode) => mode.route.model));
    expect(distinct.size).toBe(3);
  });

  it("assigns every mode a route belonging to the requested provider", () => {
    const modes = deriveResponseModesForProvider("anthropic");

    for (const mode of modes) {
      expect(mode.route.provider).toBe("anthropic");
      expect(mode.route.model).not.toBe("");
    }
  });

  it("shows only distinct choices when fewer than three models are available", () => {
    const runtimeModels = PROVIDER_MODELS.deepseek;

    const modes = deriveResponseModesForProvider("deepseek");
    const orderedIds = runtimeModels.map((model) => model.id);

    expect(modes.map((mode) => mode.route.model)).toEqual(
      orderedIds.slice(0, 3),
    );
    expect(new Set(modes.map((mode) => mode.route.model)).size).toBe(
      modes.length,
    );
  });

  it("derives two genuinely different xAI routes", () => {
    const modes = deriveResponseModesForProvider("xai");

    expect(modes.map((mode) => mode.route.model)).toEqual([
      "grok-4.5",
      "grok-4.3",
    ]);
  });
});
