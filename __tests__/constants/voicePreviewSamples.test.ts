import {
  PROVIDER_PREVIEW_SAMPLE_TEXT_BY_LANGUAGE,
  getNativePreviewSampleText,
} from "../../src/constants/voicePreviewSamples";

describe("voice preview samples", () => {
  it("uses fresh, language-specific provider samples", () => {
    expect(PROVIDER_PREVIEW_SAMPLE_TEXT_BY_LANGUAGE.en).toContain(
      "At 7:45, Mr Broccoli",
    );
    expect(PROVIDER_PREVIEW_SAMPLE_TEXT_BY_LANGUAGE.de).toContain(
      "zwölf frische Brötchen",
    );
  });

  it("uses proper German umlauts and eszett in every German preview", () => {
    const germanSamples = [
      PROVIDER_PREVIEW_SAMPLE_TEXT_BY_LANGUAGE.de,
      getNativePreviewSampleText("de"),
    ];

    germanSamples.forEach((sample) => {
      expect(sample).toMatch(/[äöüÄÖÜ]/);
      expect(sample).toContain("ß");
      expect(sample).not.toMatch(
        /\b(?:laengere|fuer|Geraet|hoeren|natuerlich|ueber|Saetze)\b/i,
      );
    });
  });
});
