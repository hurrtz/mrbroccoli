import {
  PROVIDER_DEFAULT_STT_MODELS,
  PROVIDER_DEFAULT_TTS_MODELS,
  getProviderSttModelOptions,
  getProviderTtsModelOptions,
  getProviderTtsVoiceOptions,
  getSttModelLabel,
  getTtsModelLabel,
  getTtsVoiceLabel,
  providerUsesTtsVoiceDirectory,
} from "../../../src/constants/providers/speech";

describe("speech provider constants", () => {
  it("uses catalog labels for exact STT model matches", () => {
    expect(getSttModelLabel("openai", "gpt-4o-mini-transcribe")).toBe(
      "GPT-4o mini Transcribe",
    );
  });

  it("uses catalog labels for the canonical Mistral STT model id", () => {
    expect(getSttModelLabel("mistral", "voxtral-mini-2602")).toBe(
      "Voxtral Mini Transcribe 2",
    );
  });

  it("keeps the manual fallback label when the STT model is not in the workbook catalog", () => {
    expect(
      getProviderTtsModelOptions("gemini").find(
        (option) => option.id === "gemini-2.5-flash",
      )?.name,
    ).toBeUndefined();
  });

  it("surfaces Gemini audio transcription and the Mistral STT model", () => {
    expect(getProviderSttModelOptions("gemini")).toEqual([
      { id: "gemini-3.5-flash", name: "Gemini 3.5 Flash" },
    ]);
    expect(PROVIDER_DEFAULT_STT_MODELS.gemini).toBe("gemini-3.5-flash");
    expect(getProviderSttModelOptions("mistral")).toEqual(
      [{ id: "voxtral-mini-2602", name: "Voxtral Mini Transcribe 2" }],
    );
    expect(getProviderSttModelOptions("elevenlabs")).toEqual([
      { id: "scribe_v2", name: "Scribe v2" },
    ]);
    expect(PROVIDER_DEFAULT_STT_MODELS.elevenlabs).toBe("scribe_v2");
  });

  it("surfaces newly wired catalog-backed STT providers through the runtime manifest", () => {
    expect(getProviderSttModelOptions("bytedance-doubao-seed")).toEqual([]);
    expect(getProviderSttModelOptions("alibaba-qwen-dashscope")).toEqual([
      { id: "qwen3-asr-flash", name: "Qwen3-ASR-Flash" },
    ]);
    expect(getProviderSttModelOptions("xai")).toEqual([
      {
        id: "grok-stt",
        name: "Grok Speech-to-Text",
      },
    ]);
    expect(PROVIDER_DEFAULT_STT_MODELS.xai).toBe("grok-stt");
  });

  it("uses catalog labels for exact TTS model matches", () => {
    expect(
      getProviderTtsModelOptions("openai").find(
        (option) => option.id === "gpt-4o-mini-tts",
      )?.name,
    ).toBe("GPT-4o mini TTS");
    expect(getProviderTtsModelOptions("alibaba-qwen-dashscope")).toEqual([
      { id: "qwen3-tts-flash", name: "Qwen3-TTS-Flash" },
      { id: "qwen3-tts-instruct-flash", name: "Qwen3-TTS-Instruct-Flash" },
    ]);
    expect(
      getProviderTtsModelOptions("gemini").find(
        (option) => option.id === "gemini-2.5-flash-preview-tts",
      )?.name,
    ).toBe("Gemini 2.5 Flash Preview TTS");
    expect(
      getProviderTtsModelOptions("gemini").find(
        (option) => option.id === "gemini-3.1-flash-tts-preview",
      )?.name,
    ).toBe("Gemini 3.1 Flash TTS Preview");
    expect(PROVIDER_DEFAULT_TTS_MODELS.gemini).toBe(
      "gemini-3.1-flash-tts-preview",
    );
    expect(getProviderTtsModelOptions("bytedance-doubao-seed")).toEqual([]);
  });

  it("keeps xAI TTS aligned to the merged catalog service ids", () => {
    expect(getProviderTtsModelOptions("xai")).toEqual([
      { id: "text-to-speech", name: "Text to Speech API" },
    ]);
    expect(PROVIDER_DEFAULT_TTS_MODELS.xai).toBe("text-to-speech");
    expect(getTtsModelLabel("xai", "text-to-speech")).toBe("Text to Speech API");
    expect(providerUsesTtsVoiceDirectory("xai")).toBe(true);
  });

  it("surfaces catalog-backed TTS voice labels", () => {
    expect(getTtsVoiceLabel("openai", "alloy", "en")).toBe("Alloy");
    expect(
      getTtsVoiceLabel("elevenlabs", "21m00Tcm4TlvDq8ikWAM", "en"),
    ).toBe("Rachel (built-in)");
    expect(
      getTtsVoiceLabel("elevenlabs", "21m00Tcm4TlvDq8ikWAM", "de"),
    ).toBe("Rachel (integriert)");
    expect(
      getTtsVoiceLabel("elevenlabs", "21m00Tcm4TlvDq8ikWAM", "uk"),
    ).toBe("Rachel (built-in)");
  });

  it("filters the official Qwen system voices to the selected TTS model", () => {
    const flashVoices = getProviderTtsVoiceOptions(
      "alibaba-qwen-dashscope",
      "en",
      "qwen3-tts-flash",
    );
    const instructVoices = getProviderTtsVoiceOptions(
      "alibaba-qwen-dashscope",
      "en",
      "qwen3-tts-instruct-flash",
    );

    expect(flashVoices).toHaveLength(48);
    expect(flashVoices.map((voice) => voice.id)).toEqual(
      expect.arrayContaining(["Cherry", "Jennifer", "Kiki"]),
    );
    expect(instructVoices).toHaveLength(24);
    expect(instructVoices.map((voice) => voice.id)).toEqual(
      expect.arrayContaining(["Cherry", "Eldric Sage", "Stella"]),
    );
    expect(instructVoices.map((voice) => voice.id)).not.toContain("Jennifer");
  });
});
