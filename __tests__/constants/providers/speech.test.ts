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
    expect(getSttModelLabel("openai", "gpt-4o-mini-transcribe-2025-12-15")).toBe(
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
      { id: "gemini-3.5-transcribe", name: "Gemini 3.5 Transcribe" },
      { id: "gemini-3.8-flash", name: "Gemini 3.8 Flash" },
      { id: "gemini-3.7-flash", name: "Gemini 3.7 Flash" },
      { id: "gemini-3.6-flash", name: "Gemini 3.6 Flash" },
      { id: "gemini-3.5-flash", name: "Gemini 3.5 Flash" },
      { id: "gemini-3.5-flash-lite", name: "Gemini 3.5 Flash Lite" },
    ]);
    expect(PROVIDER_DEFAULT_STT_MODELS.gemini).toBe("gemini-3.6-flash");
    expect(getProviderSttModelOptions("mistral")).toEqual(
      [{ id: "voxtral-mini-2602", name: "Voxtral Mini Transcribe 2" }],
    );
    expect(getProviderSttModelOptions("elevenlabs")).toEqual([
      { id: "scribe_v2", name: "Scribe v2" },
    ]);
    expect(PROVIDER_DEFAULT_STT_MODELS.elevenlabs).toBe("scribe_v2");
  });

  it("offers no Qwen speech routes after the DashScope speech retirement", () => {
    expect(getProviderSttModelOptions("alibaba-qwen-dashscope")).toEqual([]);
    expect(getProviderTtsModelOptions("alibaba-qwen-dashscope")).toEqual([]);
    expect(
      getProviderTtsVoiceOptions("alibaba-qwen-dashscope", "en"),
    ).toEqual([]);
  });

  it("surfaces newly wired catalog-backed STT providers through the runtime manifest", () => {
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
        (option) => option.id === "gpt-4o-mini-tts-2025-12-15",
      )?.name,
    ).toBe("GPT-4o mini TTS");
    expect(getProviderTtsModelOptions("gemini")).toEqual([
      { id: "gemini-3.8-flash-lite-tts", name: "Gemini 3.8 Flash-Lite TTS" },
      { id: "gemini-3.8-flash-tts", name: "Gemini 3.8 Flash TTS" },
      { id: "gemini-3.1-flash-tts-preview", name: "Gemini 3.1 Flash TTS Preview" },
    ]);
    expect(PROVIDER_DEFAULT_TTS_MODELS.gemini).toBe("gemini-3.8-flash-lite-tts");
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
    ).toBe("Janet (built-in)");
    expect(
      getTtsVoiceLabel("elevenlabs", "21m00Tcm4TlvDq8ikWAM", "de"),
    ).toBe("Janet (integriert)");
    expect(
      getTtsVoiceLabel("elevenlabs", "21m00Tcm4TlvDq8ikWAM", "uk"),
    ).toBe("Janet (built-in)");
  });

});

it.each(["tts-1", "tts-1-hd"])("excludes mini-TTS-only voices from %s", (model) => {
  const voices = getProviderTtsVoiceOptions("openai", "en", model).map(({ id }) => id);
  for (const voice of ["ballad", "cedar", "marin", "verse"]) expect(voices).not.toContain(voice);
  expect(voices).toEqual(["alloy", "ash", "coral", "echo", "fable", "onyx", "nova", "sage", "shimmer"]);
});
