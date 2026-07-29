import {
  executeProviderModelRequest,
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

  it.each(["authentication", "credits", "quota", "rejected"] as const)(
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

  it("moves past model-scoped quota without retrying the exhausted model", async () => {
    const request = jest
      .fn()
      .mockRejectedValueOnce(
        providerError(
          "quota",
          "Quota exceeded for metric generate_content_requests, model: model-a",
        ),
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
