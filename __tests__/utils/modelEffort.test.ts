import {
  getDefaultModelEffort,
  getModelEffortOptionLabel,
  getModelEffortOptions,
  getModelEffortRequestBody,
  getModelEffortTransportValue,
  normalizeResponseModeRouteEffort,
} from "../../src/utils/modelEffort";
import { APP_LANGUAGES } from "../../src/i18n/localeRegistry";

describe("model effort metadata", () => {
  it("localizes effort labels for the Ukrainian interface", () => {
    expect(
      getModelEffortOptionLabel(
        getModelEffortOptions("gemini", "gemini-3.6-flash").find(
          (option) => option.id === "high",
        )!,
        "uk",
      ),
    ).toBe("Високий");
  });

  it.each(APP_LANGUAGES)(
    "provides localized effort labels for registered app language %s",
    (language) => {
      const options = getModelEffortOptions("gemini", "gemini-3.6-flash");

      options.forEach((option) => {
        expect(
          getModelEffortOptionLabel(option, language).trim().length,
        ).toBeGreaterThan(0);
      });
    },
  );

  it("uses provider-documented defaults before the generic medium fallback", () => {
    expect(getDefaultModelEffort("openai", "gpt-5.6-sol")).toBe("medium");
    expect(getDefaultModelEffort("openai", "gpt-5.5-2026-04-23")).toBe("medium");
    expect(getDefaultModelEffort("openai", "gpt-5.4-2026-03-05")).toBe("none");
    expect(getDefaultModelEffort("anthropic", "claude-sonnet-5")).toBe("high");
    expect(getDefaultModelEffort("xai", "grok-4.3")).toBe("low");
    expect(getDefaultModelEffort("xai", "grok-4.5")).toBe("high");
    expect(getDefaultModelEffort("gemini", "gemini-3.6-flash")).toBe("medium");
    expect(getDefaultModelEffort("gemini", "gemini-3.5-flash")).toBe("medium");
    expect(getDefaultModelEffort("gemini", "gemini-3.5-flash-lite")).toBe(
      "minimal",
    );
    expect(getDefaultModelEffort("gemini", "gemini-3.1-pro-preview")).toBe(
      "high",
    );
    expect(getDefaultModelEffort("gemini", "gemini-3.1-flash-lite")).toBe(
      "minimal",
    );
    expect(getDefaultModelEffort("gemini", "gemini-2.5-pro")).toBe(
      "dynamic",
    );
    expect(getDefaultModelEffort("gemini", "gemini-2.5-flash")).toBe(
      "dynamic",
    );
    expect(getDefaultModelEffort("gemini", "gemini-2.5-flash-lite")).toBe(
      "disabled",
    );
    expect(getDefaultModelEffort("deepseek", "deepseek-v4-pro")).toBe("high");
    expect(getDefaultModelEffort("alibaba-qwen-dashscope", "qwen3.7-plus-2026-05-26")).toBe(
      "enabled",
    );
  });

  it("exposes the documented Gemini thinking levels per model", () => {
    expect(
      getModelEffortOptions("gemini", "gemini-3.6-flash").map(
        (option) => option.id,
      ),
    ).toEqual(["minimal", "low", "medium", "high"]);

    expect(
      getModelEffortOptions("gemini", "gemini-3.5-flash").map(
        (option) => option.id,
      ),
    ).toEqual(["minimal", "low", "medium", "high"]);

    expect(
      getModelEffortOptions("gemini", "gemini-3.5-flash-lite").map(
        (option) => option.id,
      ),
    ).toEqual(["minimal", "low", "medium", "high"]);

    expect(
      getModelEffortOptions("gemini", "gemini-3.1-pro-preview").map(
        (option) => option.id,
      ),
    ).toEqual(["low", "medium", "high"]);

    expect(
      getModelEffortOptions("gemini", "gemini-2.5-pro").map(
        (option) => option.id,
      ),
    ).toEqual(["dynamic", "low", "medium", "high"]);
    expect(
      getModelEffortOptions("gemini", "gemini-2.5-flash").map(
        (option) => option.id,
      ),
    ).toEqual(["disabled", "dynamic", "low", "medium", "high"]);
  });

  it("exposes documented effort levels for non-Gemini providers", () => {
    expect(
      getModelEffortOptions("openai", "gpt-5.6-sol").map(
        (option) => option.id,
      ),
    ).toEqual(["none", "low", "medium", "high", "xhigh"]);
    expect(
      getModelEffortOptions("openai", "gpt-5.5-2026-04-23").map((option) => option.id),
    ).toEqual(["none", "low", "medium", "high", "xhigh"]);
    expect(
      getModelEffortOptions("anthropic", "claude-sonnet-5").map(
        (option) => option.id,
      ),
    ).toEqual(["low", "medium", "high", "xhigh", "max"]);
    expect(
      getModelEffortOptions("anthropic", "claude-sonnet-4-6").map(
        (option) => option.id,
      ),
    ).toEqual(["low", "medium", "high", "max"]);
    expect(
      getModelEffortOptions("anthropic", "claude-opus-4-6").map(
        (option) => option.id,
      ),
    ).toEqual(["low", "medium", "high", "max"]);
    expect(
      getModelEffortOptions("xai", "grok-4.3").map((option) => option.id),
    ).toEqual(["none", "low", "medium", "high"]);
    expect(
      getModelEffortOptions("xai", "grok-4.5").map((option) => option.id),
    ).toEqual(["low", "medium", "high"]);
    expect(
      getModelEffortOptions("deepseek", "deepseek-v4-pro").map(
        (option) => option.id,
      ),
    ).toEqual(["disabled", "high", "max"]);
    expect(
      getModelEffortOptions("mistral", "mistral-medium-3-5").map(
        (option) => option.id,
      ),
    ).toEqual(["none", "high"]);
    expect(
      getModelEffortOptions("mistral", "mistral-small-2603").map(
        (option) => option.id,
      ),
    ).toEqual(["none", "high"]);
  });

  it("normalizes response routes to supported effort values", () => {
    expect(
      normalizeResponseModeRouteEffort({
        provider: "gemini",
        model: "gemini-3.1-pro-preview",
      }),
    ).toEqual({
      provider: "gemini",
      model: "gemini-3.1-pro-preview",
      effort: "high",
    });

    expect(
      normalizeResponseModeRouteEffort({
        provider: "openai",
        model: "gpt-5.6-sol",
        effort: "max",
      }),
    ).toEqual({
      provider: "openai",
      model: "gpt-5.6-sol",
      effort: "xhigh",
    });

    expect(
      normalizeResponseModeRouteEffort({
        provider: "gemini",
        model: "gemini-3.5-flash",
        effort: "not-real",
      }),
    ).toEqual({
      provider: "gemini",
      model: "gemini-3.5-flash",
      effort: "medium",
    });

    expect(
      normalizeResponseModeRouteEffort({
        provider: "gemini",
        model: "gemini-2.5-flash",
        effort: "high",
      }),
    ).toEqual({
      provider: "gemini",
      model: "gemini-2.5-flash",
      effort: "high",
    });
  });

  it("maps stored effort ids to provider transport values", () => {
    expect(
      getModelEffortTransportValue("gemini", "gemini-3.6-flash", "high"),
    ).toBe("HIGH");
    expect(
      getModelEffortTransportValue("gemini", "gemini-3.5-flash", "high"),
    ).toBe("HIGH");
    expect(
      getModelEffortTransportValue("gemini", "gemini-2.5-flash", "high"),
    ).toBe("24576");
    expect(
      getModelEffortRequestBody(
        "gemini",
        "gemini-2.5-flash-lite",
        "disabled",
      ),
    ).toEqual({
      generationConfig: { thinkingConfig: { thinkingBudget: 0 } },
    });
    expect(getModelEffortTransportValue("xai", "grok-4.3", "none")).toBe(
      "none",
    );
    expect(
      getModelEffortTransportValue("deepseek", "deepseek-v4-pro", "disabled"),
    ).toBe("disabled");
    expect(
      getModelEffortTransportValue(
        "alibaba-qwen-dashscope",
        "qwen3.7-plus-2026-05-26",
        "enabled",
      ),
    ).toBe("enabled");
    expect(
      getModelEffortRequestBody("openai", "gpt-5.6-sol", "max"),
    ).toEqual({ reasoning_effort: "xhigh" });
  });

  it("enables adaptive thinking on Anthropic models that require it", () => {
    expect(
      getModelEffortRequestBody("anthropic", "claude-opus-4-7", "xhigh"),
    ).toEqual({
      output_config: { effort: "xhigh" },
      thinking: { type: "adaptive" },
    });
    expect(
      getModelEffortRequestBody("anthropic", "claude-sonnet-5", "high"),
    ).toEqual({ output_config: { effort: "high" } });
  });
});
