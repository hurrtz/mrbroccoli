import { isKokoroModelReady } from "../../src/utils/kokoroModelReadiness";

describe("isKokoroModelReady", () => {
  it("requires an installed model", () => {
    expect(
      isKokoroModelReady({
        installed: false,
        verified: false,
        busy: null,
        error: null,
      }),
    ).toBe(false);
  });

  it("accepts an installed model discovered during startup", () => {
    expect(
      isKokoroModelReady({
        installed: true,
        verified: false,
        busy: null,
        error: null,
      }),
    ).toBe(true);
  });

  it("blocks use while model verification is still running", () => {
    expect(
      isKokoroModelReady({
        installed: true,
        verified: false,
        busy: "verifying",
        error: null,
      }),
    ).toBe(false);
  });

  it("blocks use while the installed model is being checked", () => {
    expect(
      isKokoroModelReady({
        installed: true,
        verified: true,
        busy: "checking",
        error: null,
      }),
    ).toBe(false);
  });

  it("rejects an unverified model with a preparation error", () => {
    expect(
      isKokoroModelReady({
        installed: true,
        verified: false,
        busy: null,
        error: "Verification failed",
      }),
    ).toBe(false);
  });
});
