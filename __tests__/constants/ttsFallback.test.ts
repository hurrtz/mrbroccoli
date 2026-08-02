import {
  getTtsFallbackRoutes,
  normalizeTtsFallbackPolicy,
} from "../../src/constants/ttsFallback";

describe("TTS fallback policy", () => {
  it("defaults to no fallback routes", () => {
    expect(normalizeTtsFallbackPolicy(undefined)).toEqual({
      provider: [],
      kokoro: [],
      local: [],
    });
  });

  it("preserves valid route order and removes duplicates", () => {
    expect(
      normalizeTtsFallbackPolicy({
        provider: ["native", "kokoro", "native", "provider"],
        kokoro: ["provider", "native", "provider", "kokoro"],
        local: ["native", "provider", "native", "kokoro"],
      }),
    ).toEqual({
      provider: ["native", "kokoro"],
      kokoro: ["provider", "native"],
      local: ["native", "provider"],
    });
  });

  it("never returns fallbacks for native primary speech", () => {
    expect(
      getTtsFallbackRoutes(
        {
          provider: ["kokoro", "native"],
          kokoro: ["provider", "native"],
          local: ["provider", "native"],
        },
        "native",
      ),
    ).toEqual([]);
  });
});
