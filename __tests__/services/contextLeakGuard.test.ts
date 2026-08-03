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
});
