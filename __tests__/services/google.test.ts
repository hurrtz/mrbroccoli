import {
  parseGoogleAiStudioCredentials,
} from "../../src/services/google";

describe("Google credential helpers", () => {
  it("parses AI Studio-only credentials without local prefix validation", () => {
    expect(parseGoogleAiStudioCredentials("opaque-test-key")).toEqual({
      apiKey: "opaque-test-key",
    });
  });

  it("rejects retired Cloud Speech and combined credential formats", () => {
    expect(
      parseGoogleAiStudioCredentials("my-project|ya29.test-token|EU"),
    ).toBeNull();
    expect(
      parseGoogleAiStudioCredentials(
        "opaque-test-key|my-project|ya29.test-token|us",
      ),
    ).toBeNull();
  });
});
