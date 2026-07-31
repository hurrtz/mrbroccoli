import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  RUNTIME_CAPABILITY_OVERRIDES_STORAGE_KEY,
  clearRuntimeCapabilityOverrides,
  disableRuntimeCapabilityConfiguration,
  ensureRuntimeCapabilityOverridesLoaded,
  getRuntimeCapabilityOverrides,
  isRuntimeCapabilityConfigurationDisabled,
  resetRuntimeCapabilityOverridesForTests,
} from "../../src/services/runtimeCapabilityOverrides";

describe("runtime capability overrides", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    resetRuntimeCapabilityOverridesForTests();
  });

  it("loads only valid current-provider overrides", async () => {
    await AsyncStorage.setItem(
      RUNTIME_CAPABILITY_OVERRIDES_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        overrides: [
          {
            capability: "llm",
            disabledAt: 1,
            model: "gpt-retired",
            provider: "openai",
            reason: "model-unavailable",
          },
          {
            capability: "llm",
            disabledAt: 1,
            model: "kimi-retired",
            provider: "moonshot-ai-kimi",
            reason: "model-unavailable",
          },
          {
            capability: "unknown",
            disabledAt: 1,
            model: "invalid",
            provider: "openai",
            reason: "model-unavailable",
          },
        ],
      }),
    );

    await ensureRuntimeCapabilityOverridesLoaded();

    expect(getRuntimeCapabilityOverrides()).toEqual([
      {
        capability: "llm",
        disabledAt: 1,
        model: "gpt-retired",
        provider: "openai",
        reason: "model-unavailable",
      },
    ]);
  });

  it("scopes effort overrides more narrowly than model overrides", async () => {
    await disableRuntimeCapabilityConfiguration({
      capability: "llm",
      disabledAt: 1,
      effort: "high",
      model: "gpt-5.6-sol",
      provider: "openai",
      reason: "configuration-unsupported",
    });

    expect(
      isRuntimeCapabilityConfigurationDisabled({
        capability: "llm",
        effort: "high",
        model: "gpt-5.6-sol",
        provider: "openai",
      }),
    ).toBe(true);
    expect(
      isRuntimeCapabilityConfigurationDisabled({
        capability: "llm",
        effort: "medium",
        model: "gpt-5.6-sol",
        provider: "openai",
      }),
    ).toBe(false);
    expect(
      isRuntimeCapabilityConfigurationDisabled({
        capability: "web-search",
        effort: "high",
        model: "gpt-5.6-sol",
        provider: "openai",
      }),
    ).toBe(false);

    await disableRuntimeCapabilityConfiguration({
      capability: "llm",
      disabledAt: 2,
      model: "gpt-5.6-sol",
      provider: "openai",
      reason: "model-unavailable",
    });

    expect(
      isRuntimeCapabilityConfigurationDisabled({
        capability: "llm",
        effort: "medium",
        model: "gpt-5.6-sol",
        provider: "openai",
      }),
    ).toBe(true);
  });

  it("clears persisted overrides so configurations can be tried again", async () => {
    await disableRuntimeCapabilityConfiguration({
      capability: "tts",
      disabledAt: 1,
      model: "tts-retired",
      provider: "openai",
      reason: "model-unavailable",
    });

    await clearRuntimeCapabilityOverrides();

    expect(getRuntimeCapabilityOverrides()).toEqual([]);
    await expect(
      AsyncStorage.getItem(RUNTIME_CAPABILITY_OVERRIDES_STORAGE_KEY),
    ).resolves.toBeNull();
  });
});
