import {
  createDriveAcousticProfile,
  updateDriveAcousticProfileFromAmbient,
  updateDriveAcousticProfileFromRecording,
  updateDriveAcousticProfileRoute,
} from "../../../src/screens/main/voiceSession/driveAcousticProfile";

describe("driveAcousticProfile", () => {
  it("uses the quiet portion of the ambient window instead of speech spikes", () => {
    let profile = createDriveAcousticProfile("built-in");

    for (const [index, levelDb] of [
      -52,
      -51,
      -50,
      -18,
      -16,
      -52,
      -51,
      -17,
      -50,
      -52,
      -51,
      -50,
    ].entries()) {
      profile = updateDriveAcousticProfileFromAmbient(
        profile,
        levelDb,
        index * 150,
      );
    }

    expect(profile.noiseFloorDb).toBeLessThan(-48);
    expect(profile.ambientSampleCount).toBe(12);
  });

  it("adapts rapidly after a sustained loud environment change", () => {
    let profile = createDriveAcousticProfile("built-in");

    for (let index = 0; index < 16; index += 1) {
      profile = updateDriveAcousticProfileFromAmbient(
        profile,
        -62 + (index % 2),
        index * 150,
      );
    }
    const quietNoiseFloorDb = profile.noiseFloorDb;

    for (let index = 0; index < 16; index += 1) {
      profile = updateDriveAcousticProfileFromAmbient(
        profile,
        -31 + (index % 3),
        3_000 + index * 150,
      );
    }

    expect(quietNoiseFloorDb).toBeLessThan(-58);
    expect(profile.noiseFloorDb).toBeGreaterThan(-39);
  });

  it("learns confirmed user speech separately from ambient noise", () => {
    let profile = createDriveAcousticProfile("built-in");

    profile = updateDriveAcousticProfileFromRecording(profile, {
      meteringDb: -18,
      noiseFloorDb: -55,
      nowMs: 1_000,
      voiceActive: true,
    });
    profile = updateDriveAcousticProfileFromRecording(profile, {
      meteringDb: -22,
      noiseFloorDb: -55,
      nowMs: 1_150,
      voiceActive: true,
    });

    expect(profile.noiseFloorDb).toBe(-55);
    expect(profile.speechLevelDb).toBeCloseTo(-18.72);
    expect(profile.speechSampleCount).toBe(2);
  });

  it("resets learned levels when the microphone route changes", () => {
    let profile = createDriveAcousticProfile("built-in");
    profile = updateDriveAcousticProfileFromRecording(profile, {
      meteringDb: -18,
      noiseFloorDb: -55,
      nowMs: 1_000,
      voiceActive: true,
    });

    const updated = updateDriveAcousticProfileRoute(
      profile,
      "bluetooth-hfp",
    );

    expect(updated.reset).toBe(true);
    expect(updated.profile.audioRoute).toBe("bluetooth-hfp");
    expect(updated.profile.noiseFloorDb).toBe(-60);
    expect(updated.profile.speechLevelDb).toBeNull();
  });
});
