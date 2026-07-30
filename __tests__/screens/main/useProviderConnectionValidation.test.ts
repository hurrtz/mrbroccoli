import { act, renderHook } from "@testing-library/react-native";

import { useProviderConnectionValidation } from "../../../src/screens/main/useProviderConnectionValidation";
import { validateProviderConnection } from "../../../src/services/llm";
import {
  validateSttProviderConnection,
  validateTtsProviderConnection,
} from "../../../src/services/providerValidation";
import { fetchProviderVoices } from "../../../src/services/providerVoiceDirectory";
import { validateWebSearchConnection } from "../../../src/services/webSearch";
import { DEFAULT_SETTINGS } from "../../../src/types";
import {
  executeProviderModelRequest,
  getProviderCircuitState,
  resetProviderModelHealthForTests,
} from "../../../src/services/providerResilience";
import { ProviderRequestError } from "../../../src/services/providerErrors";

jest.mock("../../../src/services/debugLogCapture", () => ({
  recordDebugLogEvent: jest.fn(),
}));

jest.mock("../../../src/services/llm", () => ({
  validateProviderConnection: jest.fn(async () => undefined),
}));

jest.mock("../../../src/services/providerValidation", () => ({
  validateSttProviderConnection: jest.fn(async () => undefined),
  validateTtsProviderConnection: jest.fn(async () => undefined),
}));

jest.mock("../../../src/services/providerVoiceDirectory", () => ({
  fetchProviderVoices: jest.fn(async () => []),
  providerHasVoiceDirectory: (provider: string) =>
    ["xai", "mistral", "elevenlabs"].includes(provider),
}));

jest.mock("../../../src/services/webSearch", () => ({
  validateWebSearchConnection: jest.fn(async () => undefined),
}));

describe("useProviderConnectionValidation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetProviderModelHealthForTests();
  });

  it("dispatches independent live checks for every provider capability", async () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        openai: "openai-key",
        xai: "xai-key",
      },
    };
    const { result } = renderHook(() =>
      useProviderConnectionValidation({
        language: "en",
        settings,
      }),
    );

    await act(async () => {
      await result.current.validateProviderCapability("openai", "llm");
      await result.current.validateProviderCapability("openai", "stt");
      await result.current.validateProviderCapability("openai", "tts");
      await result.current.validateProviderCapability("openai", "search");
      await result.current.validateProviderCapability("xai", "voices");
    });

    expect(validateProviderConnection).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: "openai",
        apiKey: "openai-key",
      }),
    );
    expect(validateSttProviderConnection).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: "openai",
        apiKey: "openai-key",
        model: settings.providerSttModels.openai,
      }),
    );
    expect(validateTtsProviderConnection).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: "openai",
        apiKey: "openai-key",
        model: settings.providerTtsModels.openai,
      }),
    );
    expect(validateWebSearchConnection).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: "openai",
        apiKey: "openai-key",
      }),
    );
    expect(fetchProviderVoices).toHaveBeenCalledWith({
      provider: "xai",
      apiKey: "xai-key",
    });
  });

  it("resets a provider circuit before an explicit capability retry", async () => {
    await expect(
      executeProviderModelRequest({
        candidateModels: ["gpt-test"],
        capability: "llm",
        provider: "openai",
        request: jest.fn().mockRejectedValue(
          new ProviderRequestError({
            action: "reply",
            failureKind: "authentication",
            message: "Invalid key",
            provider: "openai",
            status: 401,
          }),
        ),
        retryDelayMs: 0,
      }),
    ).rejects.toThrow("Invalid key");
    expect(getProviderCircuitState("openai", "llm")).not.toBeNull();

    const settings = {
      ...DEFAULT_SETTINGS,
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        openai: "replacement-key",
      },
    };
    const { result } = renderHook(() =>
      useProviderConnectionValidation({
        language: "en",
        settings,
      }),
    );

    await act(async () => {
      await result.current.validateProviderCapability("openai", "llm");
    });

    expect(validateProviderConnection).toHaveBeenCalledTimes(1);
    expect(getProviderCircuitState("openai", "llm")).toBeNull();
  });
});
