import {
  buildProviderHttpError,
  extractProviderErrorMessage,
  ProviderRequestError,
  readSafeProviderErrorMessage,
} from "../../src/services/providerErrors";

describe("extractProviderErrorMessage", () => {
  it("returns trimmed input for a plain text error", () => {
    expect(extractProviderErrorMessage("something went wrong")).toBe(
      "something went wrong",
    );
  });

  it("collapses whitespace in plain text errors", () => {
    expect(extractProviderErrorMessage("  too   many   spaces  ")).toBe(
      "too many spaces",
    );
  });

  it("extracts error.message from a JSON response", () => {
    const json = JSON.stringify({
      error: { message: "Invalid API key provided" },
    });
    expect(extractProviderErrorMessage(json)).toBe("Invalid API key provided");
  });

  it("extracts a top-level message field from JSON", () => {
    const json = JSON.stringify({ message: "Rate limit exceeded" });
    expect(extractProviderErrorMessage(json)).toBe("Rate limit exceeded");
  });

  it("extracts the first message from an errors array", () => {
    const json = JSON.stringify({
      errors: [
        { message: "Field 'model' is required" },
        { message: "Field 'input' is required" },
      ],
    });
    expect(extractProviderErrorMessage(json)).toBe("Field 'model' is required");
  });

  it("extracts a string detail field used by speech providers", () => {
    const json = JSON.stringify({ code: 400, detail: "bad request" });
    expect(extractProviderErrorMessage(json)).toBe("bad request");
  });

  it("extracts a nested detail message used by ElevenLabs", () => {
    const json = JSON.stringify({
      detail: {
        status: "voice_not_found",
        message: "The selected voice was not found.",
      },
    });
    expect(extractProviderErrorMessage(json)).toBe(
      "The selected voice was not found.",
    );
  });

  it("returns trimmed input for invalid JSON", () => {
    expect(extractProviderErrorMessage("{not valid json")).toBe(
      "{not valid json",
    );
  });

  it("handles an empty string", () => {
    expect(extractProviderErrorMessage("")).toBe("");
  });

  it("handles a JSON string value", () => {
    expect(extractProviderErrorMessage('"just a string"')).toBe(
      "just a string",
    );
  });

  it("skips errors array entries without a message field", () => {
    const json = JSON.stringify({
      errors: [{ code: "ERR" }, { message: "actual error" }],
    });
    expect(extractProviderErrorMessage(json)).toBe("actual error");
  });

  it("falls back to raw input when errors array has no message fields", () => {
    const json = JSON.stringify({ errors: [{ code: "ERR" }] });
    expect(extractProviderErrorMessage(json)).toBe(
      '{"errors":[{"code":"ERR"}]}',
    );
  });
});

describe("readSafeProviderErrorMessage", () => {
  it("extracts a concise nested provider error", async () => {
    await expect(
      readSafeProviderErrorMessage({
        text: async () =>
          JSON.stringify({
            detail: {
              status: "insufficient_permissions",
              message: "Missing voices_read permission",
            },
          }),
      } as Response),
    ).resolves.toBe("Missing voices_read permission");
  });

  it("suppresses unstructured response bodies", async () => {
    await expect(
      readSafeProviderErrorMessage({
        text: async () => "<html>Service unavailable</html>",
      } as Response),
    ).resolves.toBe("");
  });
});

describe("buildProviderHttpError", () => {
  it("treats provider capacity responses as temporary failures", () => {
    const error = buildProviderHttpError({
      provider: "xai",
      language: "en",
      status: 400,
      errorText: JSON.stringify({
        error: {
          message:
            "The model is currently at capacity due to high demand. Please try again.",
        },
      }),
      action: "reply",
    });

    expect(error.message).toBe(
      "xAI had a temporary problem during reply generation. Try again shortly.",
    );
    expect(error).toEqual(
      expect.objectContaining<Partial<ProviderRequestError>>({
        failureKind: "capacity",
        status: 400,
      }),
    );
  });

  it("distinguishes exhausted plan quota from transient rate limiting", () => {
    const error = buildProviderHttpError({
      provider: "gemini",
      language: "en",
      status: 429,
      errorText: JSON.stringify({
        error: {
          message:
            "You exceeded your current quota. Please check your plan and billing details.",
        },
      }),
      action: "web-search",
    });

    expect(error).toEqual(
      expect.objectContaining<Partial<ProviderRequestError>>({
        failureKind: "quota",
        status: 429,
      }),
    );
    expect(error.message).toContain("sufficient API credit");
  });

  it("marks retired model responses as safe for model failover", () => {
    const error = buildProviderHttpError({
      provider: "gemini",
      language: "en",
      status: 404,
      errorText: JSON.stringify({
        error: {
          message: "Model gemini-old is not found or is no longer available.",
        },
      }),
      action: "transcription",
    });

    expect(error).toEqual(
      expect.objectContaining<Partial<ProviderRequestError>>({
        failureKind: "model-unavailable",
        status: 404,
      }),
    );
  });

  it("marks capability-incompatible models as safe for model failover", () => {
    const error = buildProviderHttpError({
      provider: "gemini",
      language: "en",
      status: 400,
      errorText: JSON.stringify({
        error: {
          message:
            "Model gemini-example does not support the requested tool.",
        },
      }),
      action: "web-search",
    });

    expect(error).toEqual(
      expect.objectContaining<Partial<ProviderRequestError>>({
        failureKind: "model-unavailable",
        status: 400,
      }),
    );
  });
});
