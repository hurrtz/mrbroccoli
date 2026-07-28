import * as FileSystem from "expo-file-system/legacy";

import {
  validateSttProviderConnection,
  validateTtsProviderConnection,
} from "../../src/services/providerValidation";
import { synthesizeProviderSpeech } from "../../src/services/tts/providerRoute";
import { transcribeAudio } from "../../src/services/whisper";

jest.mock("../../src/services/tts/providerRoute", () => ({
  synthesizeProviderSpeech: jest.fn(),
}));

jest.mock("../../src/services/whisper", () => ({
  transcribeAudio: jest.fn(),
}));

jest.mock("expo-file-system/legacy", () => ({
  cacheDirectory: "file:///cache/",
  EncodingType: { Base64: "base64" },
  deleteAsync: jest.fn(() => Promise.resolve()),
  writeAsStringAsync: jest.fn(() => Promise.resolve()),
}));

describe("validateTtsProviderConnection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("synthesizes a short validation sample and deletes the temp audio file", async () => {
    (synthesizeProviderSpeech as jest.Mock).mockResolvedValue("/tmp/tts-ok.mp3");

    await validateTtsProviderConnection({
      provider: "microsoft-azure",
      apiKey: "azure-speech-key|westeurope",
      language: "en",
      model: "azure-ai-speech-neural",
      voice: "en-US-JennyNeural",
    });

    expect(synthesizeProviderSpeech).toHaveBeenCalledWith({
      text: "OK",
      voice: "en-US-JennyNeural",
      provider: "microsoft-azure",
      providerModel: "azure-ai-speech-neural",
      apiKey: "azure-speech-key|westeurope",
      language: "en",
      speechLanguage: "en",
      abortSignal: undefined,
    });
    expect(FileSystem.deleteAsync).toHaveBeenCalledWith("/tmp/tts-ok.mp3", {
      idempotent: true,
    });
  });
});

describe("validateSttProviderConnection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("transcribes the bundled validation sample and always removes it", async () => {
    (transcribeAudio as jest.Mock).mockResolvedValue("OK");

    await validateSttProviderConnection({
      provider: "elevenlabs",
      apiKey: "restricted-key",
      language: "en",
      model: "scribe_v2",
    });

    const audioPath = expect.stringMatching(
      /^file:\/\/\/cache\/provider-stt-validation-\d+\.wav$/,
    );
    expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
      audioPath,
      expect.any(String),
      { encoding: "base64" },
    );
    expect(transcribeAudio).toHaveBeenCalledWith({
      fileUri: audioPath,
      mode: "provider",
      provider: "elevenlabs",
      providerModel: "scribe_v2",
      apiKey: "restricted-key",
      language: "en",
      speechLanguage: "en",
      abortSignal: undefined,
    });
    expect(FileSystem.deleteAsync).toHaveBeenCalledWith(audioPath, {
      idempotent: true,
    });
  });

  it("removes the validation sample after a provider failure", async () => {
    (transcribeAudio as jest.Mock).mockRejectedValue(new Error("Forbidden"));

    await expect(
      validateSttProviderConnection({
        provider: "elevenlabs",
        apiKey: "restricted-key",
        language: "en",
        model: "scribe_v2",
      }),
    ).rejects.toThrow("Forbidden");

    expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
      expect.stringMatching(/provider-stt-validation-\d+\.wav$/),
      { idempotent: true },
    );
  });
});
