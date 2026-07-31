import {
  DEBUG_LOG_LIMITS,
  sanitizeConsoleArguments,
  sanitizeDebugPayload,
  sanitizeRecoveredLegacyLog,
} from "../../src/services/debugLogSanitizer";

describe("debugLogSanitizer", () => {
  it("redacts exact, compound, nested and string-embedded secrets", () => {
    const sanitized = sanitizeDebugPayload({
      apiKey: "direct-secret",
      nested: {
        openaiApiKey: "compound-secret",
        providerAccessToken: "access-secret",
        detail: "private response body",
        safeError: "request failed with token=embedded-secret",
      },
    });
    const serialized = JSON.stringify(sanitized);

    expect(serialized).not.toContain("direct-secret");
    expect(serialized).not.toContain("compound-secret");
    expect(serialized).not.toContain("access-secret");
    expect(serialized).not.toContain("private response body");
    expect(serialized).not.toContain("embedded-secret");
    expect(serialized).toContain("[REDACTED]");
    expect(serialized).toContain("[REDACTED_TEXT");
  });

  it("keeps structured error diagnostics without persisting raw messages", () => {
    const error = Object.assign(new Error("private prompt rejected"), {
      code: "provider_request_failed",
      failureKind: "configuration",
      status: 410,
    });
    error.stack =
      "Error: private prompt rejected\n    at request (/workspace/src/services/llm.ts:42:3)\n    at vendor (/workspace/node_modules/pkg/index.js:2:1)";

    const sanitized = sanitizeDebugPayload({ error }) as {
      error: Record<string, unknown>;
    };

    expect(JSON.stringify(sanitized)).not.toContain("private prompt rejected");
    expect(sanitized.error).toEqual(
      expect.objectContaining({
        code: "provider_request_failed",
        failureKind: "configuration",
        name: "Error",
        status: 410,
      }),
    );
    expect(sanitized.error.messageFingerprint).toMatch(/^[0-9a-f]{8}$/);
    expect(sanitized.error.stack).toEqual([
      "at request (/src/services/llm.ts:42:3)",
    ]);
  });

  it("bounds hostile payloads and handles cycles", () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    const sanitized = sanitizeDebugPayload({
      circular,
      oversizedArray: Array.from(
        { length: DEBUG_LOG_LIMITS.arrayLength + 2 },
        (_, index) => index,
      ),
      oversizedObject: Object.fromEntries(
        Array.from(
          { length: DEBUG_LOG_LIMITS.objectKeys + 2 },
          (_, index) => [`key${index}`, index],
        ),
      ),
      oversizedString: "x".repeat(DEBUG_LOG_LIMITS.stringLength + 20),
      model: "m".repeat(DEBUG_LOG_LIMITS.stringLength + 20),
    });
    const serialized = JSON.stringify(sanitized);

    expect(serialized).toContain("[CIRCULAR]");
    expect(serialized).toContain("[TRUNCATED 2 items]");
    expect(serialized).toContain('"_truncatedKeys":2');
    expect(serialized).toContain("[TRUNCATED 20 chars]");
    expect(serialized).toContain("[REDACTED_TEXT length=520");
  });

  it("treats every console string as private and re-sanitizes legacy logs", () => {
    expect(
      sanitizeConsoleArguments([
        "a private utterance",
        { arbitraryField: "private nested content", apiKey: "secret" },
        42,
      ]),
    ).toEqual([
      expect.stringContaining("[REDACTED_TEXT length=19"),
      {
        apiKey: "[REDACTED]",
        arbitraryField: expect.stringContaining("[REDACTED_TEXT length=22"),
      },
      42,
    ]);

    const recovered = sanitizeRecoveredLegacyLog(
      '{"anthropicApiKey":"legacy-secret","prompt":"legacy prompt"}',
    );
    expect(recovered).not.toContain("legacy-secret");
    expect(recovered).not.toContain("legacy prompt");
  });
});
