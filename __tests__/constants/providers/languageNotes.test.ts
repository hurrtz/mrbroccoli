import {
  getProviderApiKeyHint,
  getProviderSttLanguageNoteForModel,
  getProviderSttLimitNote,
  getProviderTtsLanguageNoteForModel,
} from "../../../src/constants/providers/languageNotes";

describe("provider language notes", () => {
  it("explains the permissions needed by restricted ElevenLabs keys", () => {
    expect(getProviderApiKeyHint("elevenlabs", "en")).toContain(
      "Text to Speech permission for TTS",
    );
    expect(getProviderApiKeyHint("elevenlabs", "en")).toContain(
      "Voices read is optional",
    );
    expect(getProviderApiKeyHint("elevenlabs", "de")).toContain(
      "für TTS die Berechtigung „Text to Speech“",
    );
    expect(getProviderApiKeyHint("elevenlabs", "de")).toContain(
      "„Voices read“ ist optional",
    );
  });

  it("derives an STT language note from exact catalog model metadata", () => {
    expect(
      getProviderSttLanguageNoteForModel(
        "openai",
        "gpt-4o-mini-transcribe",
        "en",
      ),
    ).toBe("Supports 57 languages.");
  });

  it("builds STT language notes for the canonical Mistral runtime model", () => {
    expect(
      getProviderSttLanguageNoteForModel("mistral", "voxtral-mini-2602", "en"),
    ).toBe("Supports 13 languages.");
  });

  it("falls back to the curated provider STT note when catalog language data is too generic", () => {
    expect(
      getProviderSttLanguageNoteForModel(
        "alibaba-qwen-dashscope",
        "qwen3-asr-flash",
        "en",
      ),
    ).toContain("DashScope STT is limited");
  });

  it("derives a TTS language note from exact catalog model metadata", () => {
    expect(
      getProviderTtsLanguageNoteForModel("openai", "gpt-4o-mini-tts", "en"),
    ).toBe("13 voices across 57 languages. Voices are optimized for English.");
  });

  it("derives a TTS language note from the canonical xAI catalog model", () => {
    expect(
      getProviderTtsLanguageNoteForModel(
        "xai",
        "text-to-speech",
        "en",
      ),
    ).toBe("5 voices across 20 languages.");
  });

  it("builds an exact STT upload limit note from catalog constraints", () => {
    expect(
      getProviderSttLimitNote("openai", "gpt-4o-mini-transcribe", "en"),
    ).toBe("File upload up to 25 MB.");
  });

  it("builds a tier-aware STT upload limit note from catalog constraints", () => {
    expect(
      getProviderSttLimitNote("mistral", "voxtral-mini-2602", "en"),
    ).toBe("File upload up to 512 MiB. Audio up to 3 hours.");
  });
});
