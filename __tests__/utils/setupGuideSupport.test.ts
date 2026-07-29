import { DEFAULT_SETTINGS } from "../../src/types";
import {
  buildSetupGuideResponseModes,
  getCurrentSetupGuideValidationState,
  getSetupGuideValidationModel,
  resolveSetupGuideRoutes,
} from "../../src/screens/main/setupGuideSupport";

function createSettings() {
  return {
    ...DEFAULT_SETTINGS,
    apiKeys: {
      ...DEFAULT_SETTINGS.apiKeys,
    },
  };
}

describe("setupGuideSupport", () => {
  it("creates distinct home routes from a one-provider setup", () => {
    const modes = buildSetupGuideResponseModes("xai");

    expect(modes.map((mode) => mode.route.model)).toEqual([
      "grok-4.5",
      "grok-4.3",
    ]);
  });

  it("validates Gemini onboarding with the stable REST default", () => {
    expect(getSetupGuideValidationModel("gemini")).toBe("gemini-3.6-flash");
  });

  it("prefers selected-provider STT over system recognition", () => {
    const settings = createSettings();
    settings.apiKeys.gemini = "test-gemini-key";

    const routes = resolveSetupGuideRoutes({
      provider: "gemini",
      settings,
      systemSttAvailable: true,
    });

    expect(routes.llm.enabled).toBe(true);
    expect(routes.stt).toEqual({
      enabled: true,
      kind: "provider",
      provider: "gemini",
      model: "gemini-3.6-flash",
    });
    expect(routes.tts).toEqual(
      expect.objectContaining({
        enabled: true,
        kind: "provider",
        provider: "gemini",
      }),
    );
  });

  it("falls back to system STT when the selected provider has no speech route", () => {
    const settings = createSettings();
    settings.apiKeys.anthropic = "test-anthropic-key";

    const routes = resolveSetupGuideRoutes({
      provider: "anthropic",
      settings,
      systemSttAvailable: true,
    });

    expect(routes.stt).toEqual({
      enabled: true,
      kind: "system",
    });
  });

  it("disables TTS when the provider key does not unlock provider speech", () => {
    const settings = createSettings();
    settings.apiKeys.deepseek = "sk-deepseek-test";

    const routes = resolveSetupGuideRoutes({
      provider: "deepseek",
      settings,
      systemSttAvailable: false,
    });

    expect(routes.llm.enabled).toBe(true);
    expect(routes.tts).toEqual(
      expect.objectContaining({
        enabled: false,
        kind: "disabled",
      }),
    );
  });

  it("prefers an opted-in Kokoro route over provider speech", () => {
    const settings = createSettings();
    settings.apiKeys.gemini = "test-gemini-key";
    settings.kokoroVoices.en = "af_sol";

    const routes = resolveSetupGuideRoutes({
      provider: "gemini",
      settings,
      systemSttAvailable: true,
      useKokoro: true,
    });

    expect(routes.tts).toEqual({
      enabled: true,
      kind: "kokoro",
      voice: "af_sol",
    });
  });

  it("resets validation state when the current provider config no longer matches", () => {
    const currentValidationState = getCurrentSetupGuideValidationState({
      provider: "openai",
      apiKey: "new-key",
      model: "gpt-5.4",
      validationState: {
        status: "success",
        provider: "openai",
        apiKey: "old-key",
        model: "gpt-5.4",
      },
    });

    expect(currentValidationState).toEqual({ status: "idle" });
  });
});
