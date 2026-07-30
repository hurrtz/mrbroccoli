import {
  executeProviderModelRequest,
  getProviderCircuitState,
  resetProviderCircuit,
  resetProviderModelHealthForTests,
} from "../../src/services/providerResilience";
import { ProviderRequestError } from "../../src/services/providerErrors";

function providerError(
  failureKind: ConstructorParameters<
    typeof ProviderRequestError
  >[0]["failureKind"],
  detail?: string,
) {
  return new ProviderRequestError({
    action: "reply",
    detail,
    failureKind,
    message: failureKind,
    provider: "gemini",
    status:
      failureKind === "model-unavailable"
        ? 404
        : failureKind === "quota" || failureKind === "rate-limit"
          ? 429
          : 503,
  });
}

describe("executeProviderModelRequest", () => {
  beforeEach(() => {
    resetProviderModelHealthForTests();
  });

  it("retries a transient model once before failing over", async () => {
    const request = jest
      .fn()
      .mockRejectedValueOnce(providerError("capacity"))
      .mockRejectedValueOnce(providerError("capacity"))
      .mockResolvedValueOnce("OK");

    const result = await executeProviderModelRequest({
      candidateModels: ["model-a", "model-b"],
      capability: "llm",
      provider: "gemini",
      request,
      retryDelayMs: 0,
    });

    expect(request.mock.calls.map(([model]) => model)).toEqual([
      "model-a",
      "model-a",
      "model-b",
    ]);
    expect(result).toEqual({
      actualModel: "model-b",
      attempts: 3,
      requestedModel: "model-a",
      usedFallback: true,
      value: "OK",
    });
  });

  it("moves directly past a missing model", async () => {
    const request = jest
      .fn()
      .mockRejectedValueOnce(providerError("model-unavailable"))
      .mockResolvedValueOnce("OK");

    const result = await executeProviderModelRequest({
      candidateModels: ["retired-model", "stable-model"],
      capability: "stt",
      provider: "gemini",
      request,
      retryDelayMs: 0,
    });

    expect(request.mock.calls.map(([model]) => model)).toEqual([
      "retired-model",
      "stable-model",
    ]);
    expect(result.actualModel).toBe("stable-model");
  });

  it.each(["authentication", "credits", "rejected"] as const)(
    "does not retry or hide a terminal %s failure",
    async (failureKind) => {
      const error = providerError(failureKind);
      const request = jest.fn().mockRejectedValue(error);

      await expect(
        executeProviderModelRequest({
          candidateModels: ["model-a", "model-b"],
          capability: "web-search",
          provider: "gemini",
          request,
          retryDelayMs: 0,
        }),
      ).rejects.toBe(error);

      expect(request).toHaveBeenCalledTimes(1);
    },
  );

  it.each(["authentication", "credits"] as const)(
    "opens a provider circuit after a terminal %s failure",
    async (failureKind) => {
      const error = providerError(failureKind);
      const firstRequest = jest.fn().mockRejectedValue(error);

      await expect(
        executeProviderModelRequest({
          candidateModels: ["model-a"],
          capability: "llm",
          provider: "gemini",
          request: firstRequest,
          retryDelayMs: 0,
        }),
      ).rejects.toBe(error);

      const secondRequest = jest.fn().mockResolvedValue("unexpected");
      await expect(
        executeProviderModelRequest({
          candidateModels: ["model-a"],
          capability: "llm",
          provider: "gemini",
          request: secondRequest,
          retryDelayMs: 0,
        }),
      ).rejects.toMatchObject({
        failureKind,
        message: failureKind,
      });

      expect(secondRequest).not.toHaveBeenCalled();
      expect(getProviderCircuitState("gemini", "llm")).toMatchObject({
        failureKind,
        provider: "gemini",
      });
    },
  );

  it("allows an explicit retry after resetting a provider circuit", async () => {
    await expect(
      executeProviderModelRequest({
        candidateModels: ["model-a"],
        capability: "stt",
        provider: "gemini",
        request: jest.fn().mockRejectedValue(providerError("authentication")),
        retryDelayMs: 0,
      }),
    ).rejects.toThrow("authentication");

    resetProviderCircuit("gemini", "stt");
    const request = jest.fn().mockResolvedValue("OK");
    const result = await executeProviderModelRequest({
      candidateModels: ["model-a"],
      capability: "stt",
      provider: "gemini",
      request,
      retryDelayMs: 0,
    });

    expect(request).toHaveBeenCalledTimes(1);
    expect(result.value).toBe("OK");
    expect(getProviderCircuitState("gemini", "stt")).toBeNull();
  });

  it("retries rate limiting once before rotating models", async () => {
    const request = jest
      .fn()
      .mockRejectedValueOnce(providerError("rate-limit"))
      .mockRejectedValueOnce(providerError("rate-limit"))
      .mockResolvedValueOnce("OK");

    const result = await executeProviderModelRequest({
      candidateModels: ["model-a", "model-b"],
      capability: "tts",
      provider: "gemini",
      request,
      retryDelayMs: 0,
    });

    expect(request.mock.calls.map(([model]) => model)).toEqual([
      "model-a",
      "model-a",
      "model-b",
    ]);
    expect(result.actualModel).toBe("model-b");
  });

  it("moves past generic quota without retrying the exhausted model", async () => {
    const request = jest
      .fn()
      .mockRejectedValueOnce(
        providerError("quota", "Quota exceeded for generate content requests."),
      )
      .mockResolvedValueOnce("OK");

    const result = await executeProviderModelRequest({
      candidateModels: ["model-a", "model-b"],
      capability: "llm",
      provider: "gemini",
      request,
      retryDelayMs: 0,
    });

    expect(request.mock.calls.map(([model]) => model)).toEqual([
      "model-a",
      "model-b",
    ]);
    expect(result.actualModel).toBe("model-b");
  });

  it("opens a provider circuit only after generic quota exhausts the fallback chain", async () => {
    const request = jest
      .fn()
      .mockRejectedValue(
        providerError("quota", "Quota exceeded for generate content requests."),
      );

    await expect(
      executeProviderModelRequest({
        candidateModels: ["model-a", "model-b"],
        capability: "llm",
        provider: "gemini",
        request,
        retryDelayMs: 0,
      }),
    ).rejects.toThrow("quota");

    expect(request.mock.calls.map(([model]) => model)).toEqual([
      "model-a",
      "model-b",
    ]);
    expect(getProviderCircuitState("gemini", "llm")).toMatchObject({
      failureKind: "quota",
    });
  });

  it("does not open a provider circuit for model-scoped quota", async () => {
    await expect(
      executeProviderModelRequest({
        candidateModels: ["model-a"],
        capability: "llm",
        provider: "gemini",
        request: jest
          .fn()
          .mockRejectedValue(
            providerError("quota", "Model quota exceeded for model-a."),
          ),
        retryDelayMs: 0,
      }),
    ).rejects.toThrow("quota");

    expect(getProviderCircuitState("gemini", "llm")).toBeNull();
  });

  it("does not retry a streaming request after response data arrived", async () => {
    const error = providerError("server");
    const request = jest.fn().mockRejectedValue(error);

    await expect(
      executeProviderModelRequest({
        canRetry: () => false,
        candidateModels: ["model-a", "model-b"],
        capability: "llm",
        provider: "gemini",
        request,
        retryDelayMs: 0,
      }),
    ).rejects.toBe(error);

    expect(request).toHaveBeenCalledTimes(1);
  });

  it("temporarily skips a model that just failed over", async () => {
    const firstRequest = jest
      .fn()
      .mockRejectedValueOnce(providerError("model-unavailable"))
      .mockResolvedValueOnce("first");

    await executeProviderModelRequest({
      candidateModels: ["model-a", "model-b"],
      capability: "llm",
      provider: "gemini",
      request: firstRequest,
      retryDelayMs: 0,
    });

    const secondRequest = jest.fn().mockResolvedValue("second");
    const result = await executeProviderModelRequest({
      candidateModels: ["model-a", "model-b"],
      capability: "llm",
      provider: "gemini",
      request: secondRequest,
      retryDelayMs: 0,
    });

    expect(secondRequest).toHaveBeenCalledWith("model-b");
    expect(result.actualModel).toBe("model-b");
  });
});
