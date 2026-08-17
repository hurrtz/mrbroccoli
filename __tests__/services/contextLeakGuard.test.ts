import {
  createInternalContextLeakStreamGuard,
  inspectInternalContextLeak,
  locateSerializedInternalContextLeak,
} from "../../src/services/llm/contextLeakGuard";

describe("internal context leak guard", () => {
  it("locates the first marker of a serialized internal-context suffix", () => {
    const safePrefix = "Keep this answer.";
    const text = `${safePrefix}\n\nSOURCE 3 — Earlier thread\nUser: hidden context`;

    expect(locateSerializedInternalContextLeak(text)).toEqual({
      markerIds: ["source-header", "serialized-speaker"],
      start: text.indexOf("\nSOURCE"),
    });
  });

  it("allows an isolated marker mention without treating it as a context dump", () => {
    const chunks: string[] = [];
    const guard = createInternalContextLeakStreamGuard({
      hasHistoricalContext: true,
      onChunk: (text) => chunks.push(text),
      onLeak: () => new Error("blocked"),
      protectedTexts: [],
    });
    const response =
      "The diagnostic label shown below is worth renaming.\n" +
      "SOURCE 1 — is the label in question.";

    guard.push(response);
    guard.flush(response);

    expect(chunks.join("")).toBe(response);
  });

  it("recognizes serialized source headers followed by transcript labels", () => {
    expect(
      inspectInternalContextLeak(
        "SOURCE 2 — Earlier session (2026-08-01)\nUser: hidden text",
        { hasHistoricalContext: true, protectedTexts: [] },
      ),
    ).toBe("serialized-internal-context");
  });

  it("recognizes long verbatim copies of protected summaries", () => {
    const protectedSummary =
      "The user selected the private offline profile and asked that provider " +
      "credentials never appear in diagnostics, exported archives, generated " +
      "titles, or any model-visible cross-session context without consent.";

    expect(
      inspectInternalContextLeak(protectedSummary, {
        hasHistoricalContext: false,
        protectedTexts: [protectedSummary],
      }),
    ).toBe("verbatim-internal-context");
  });

  it("blocks protected text split across one-character stream chunks", () => {
    const safePrefix = "This introduction is safe. ";
    const protectedContext =
      "Private council evidence must remain hidden from the visible answer, " +
      "including participant positions, review notes, and internal synthesis " +
      "instructions that are supplied only as untrusted model context.";
    const chunks: string[] = [];
    const guard = createInternalContextLeakStreamGuard({
      hasHistoricalContext: false,
      onChunk: (text) => chunks.push(text),
      onLeak: () => new Error("blocked"),
      protectedTexts: [protectedContext],
    });

    expect(() => {
      for (const character of `${safePrefix}${protectedContext}`) {
        guard.push(character);
      }
    }).toThrow("blocked");
    expect(chunks.join("")).toBe(safePrefix);
  });

  it("does not search the complete protected context for every streamed prefix", () => {
    const protectedContext = "PRIVATE-COUNCIL-CONTEXT-".repeat(400);
    const chunks: string[] = [];
    const outputChunks = Array.from(
      { length: 100 },
      (_, index) =>
        `Public answer paragraph ${index} stays independent of hidden deliberation. `,
    );
    const fullText = outputChunks.join("");
    const originalIncludes = String.prototype.includes;
    let protectedContextSearches = 0;
    const includesSpy = jest
      .spyOn(String.prototype, "includes")
      .mockImplementation(function (searchString, position) {
        const value = String(this);
        if (
          value === protectedContext &&
          typeof searchString === "string" &&
          (searchString.length === 48 || searchString.length === 160)
        ) {
          protectedContextSearches += 1;
        }
        return originalIncludes.call(value, searchString, position);
      });

    try {
      const guard = createInternalContextLeakStreamGuard({
        hasHistoricalContext: false,
        onChunk: (text) => chunks.push(text),
        onLeak: () => new Error("blocked"),
        protectedTexts: [protectedContext],
      });

      outputChunks.forEach(guard.push);
      guard.flush(fullText);
    } finally {
      includesSpy.mockRestore();
    }

    expect(chunks.join("")).toBe(fullText);
    expect(protectedContextSearches).toBeLessThan(1_000);
  });
});
