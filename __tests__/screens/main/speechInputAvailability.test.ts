import { isSpeechInputUnavailable } from "../../../src/screens/main/speechInputAvailability";

const base = {
  hasProviderCredential: false,
  nativeRecognizerAvailable: false,
  selectedLocalSttModel: false,
  sttMode: "native" as const,
  sttProvider: null,
};

describe("isSpeechInputUnavailable", () => {
  it("reports native recognition as unavailable only when the device has no recognizer", () => {
    expect(
      isSpeechInputUnavailable({ ...base, nativeRecognizerAvailable: true }),
    ).toBe(false);
    expect(
      isSpeechInputUnavailable({ ...base, nativeRecognizerAvailable: false }),
    ).toBe(true);
  });

  it("reports on-device recognition as unavailable until a model is selected", () => {
    expect(
      isSpeechInputUnavailable({
        ...base,
        selectedLocalSttModel: false,
        sttMode: "local",
      }),
    ).toBe(true);
    expect(
      isSpeechInputUnavailable({
        ...base,
        selectedLocalSttModel: true,
        sttMode: "local",
      }),
    ).toBe(false);
  });

  it("requires both a provider and its credential on the provider route", () => {
    expect(
      isSpeechInputUnavailable({
        ...base,
        hasProviderCredential: true,
        sttMode: "provider",
        sttProvider: null,
      }),
    ).toBe(true);
    expect(
      isSpeechInputUnavailable({
        ...base,
        hasProviderCredential: false,
        sttMode: "provider",
        sttProvider: "openai",
      }),
    ).toBe(true);
    expect(
      isSpeechInputUnavailable({
        ...base,
        hasProviderCredential: true,
        sttMode: "provider",
        sttProvider: "openai",
      }),
    ).toBe(false);
  });

  it("answers only for the selected route, ignoring capability on the others", () => {
    // A provider key does not make on-device recognition work, and a downloaded
    // model does not make the provider route work.
    expect(
      isSpeechInputUnavailable({
        ...base,
        hasProviderCredential: true,
        sttMode: "local",
        sttProvider: "openai",
      }),
    ).toBe(true);
    expect(
      isSpeechInputUnavailable({
        ...base,
        selectedLocalSttModel: true,
        sttMode: "provider",
        sttProvider: "openai",
      }),
    ).toBe(true);
  });
});
