import { createTurnReceipt } from "../../src/services/turnReceipt";

it.each([
  ["openrouter", "google/gemini-3.8-flash-20260902", "reasoning.effort"],
  ["alibaba-qwen-dashscope", "qwen3.8-flash", "reasoning_effort"],
] as const)(
  "records the serialized effort field for %s",
  (provider, model, transportParameter) => {
    const receipt = createTurnReceipt({
      startedAtMs: 0,
      inputSource: "text",
      sttMode: "provider",
      provider,
      model,
      modelEffort: "low",
      language: "en",
      spokenRepliesEnabled: false,
      ttsMode: "native",
      ttsVoice: "",
      webSearchMode: "off",
    });
    expect(receipt.effort).toMatchObject({
      transportParameter,
      transportValue: "low",
    });
  },
);
