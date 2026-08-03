import { renderTextForSpeech } from "../../src/services/speechTextRenderer";

describe("renderTextForSpeech", () => {
  it("removes Markdown syntax while preserving the response meaning", () => {
    expect(
      renderTextForSpeech(
        [
          "## Recommendation",
          "- Use **Quick** for routine turns.",
          "- Read the [model notes](https://example.com/models). [1]",
          "`Qwen3` stays visible in the transcript.",
        ].join("\n"),
      ),
    ).toBe(
      "Recommendation. Use Quick for routine turns. Read the model notes. Qwen3 stays visible in the transcript.",
    );
  });

  it("turns a Markdown table into labelled spoken statements", () => {
    expect(
      renderTextForSpeech(
        [
          "| Route | Status |",
          "| --- | --- |",
          "| Quick | Ready |",
          "| Thorough | Downloading |",
        ].join("\n"),
      ),
    ).toBe(
      "Route: Quick. Status: Ready. Route: Thorough. Status: Downloading.",
    );
  });

  it("keeps code content but does not pronounce fence markers", () => {
    expect(renderTextForSpeech("```ts\nconst answer = 42;\n```")).toBe(
      "const answer = 42;",
    );
  });
});
