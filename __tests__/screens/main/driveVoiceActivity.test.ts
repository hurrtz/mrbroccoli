import {
  createDriveVoiceActivityState,
  DRIVE_SILENCE_WINDOW_MS,
  getDriveCountdownSeconds,
  getDriveSilenceRemainingMs,
  updateDriveVoiceActivity,
} from "../../../src/screens/main/voiceSession/driveVoiceActivity";

describe("driveVoiceActivity", () => {
  it("waits for the first detected utterance before starting a countdown", () => {
    const state = createDriveVoiceActivityState(1_000);

    expect(getDriveCountdownSeconds(state, 1_000)).toBeNull();
    expect(getDriveCountdownSeconds(state, 5_001)).toBeNull();
    expect(
      getDriveCountdownSeconds(
        state,
        1_000 + DRIVE_SILENCE_WINDOW_MS,
      ),
    ).toBeNull();
  });

  it("pauses the visible countdown while speech is active", () => {
    let state = createDriveVoiceActivityState(0);

    state = updateDriveVoiceActivity(state, -22, 1_000);
    state = updateDriveVoiceActivity(state, -20, 1_150);

    expect(state.hasDetectedSpeech).toBe(true);
    expect(state.voiceActive).toBe(true);
    expect(getDriveCountdownSeconds(state, 1_150)).toBeNull();
  });

  it("detects someone who starts speaking immediately", () => {
    let state = createDriveVoiceActivityState(0);

    for (const [index, levelDb] of [
      -44,
      -41,
      -45,
      -39,
      -43,
    ].entries()) {
      state = updateDriveVoiceActivity(
        state,
        levelDb,
        index * 150,
      );
    }

    expect(state.hasDetectedSpeech).toBe(true);
    expect(state.voiceActive).toBe(true);
  });

  it("confirms sustained speech with the narrow range measured on a physical iPhone", () => {
    let state = createDriveVoiceActivityState(0);

    for (const [levelDb, nowMs] of [
      [-46.88, 0],
      [-45.9, 201],
      [-44.7, 402],
      [-43.8, 603],
      [-43.18, 1_004],
    ] as const) {
      state = updateDriveVoiceActivity(state, levelDb, nowMs);
    }

    expect(state.hasDetectedSpeech).toBe(true);
    expect(state.voiceActive).toBe(true);
    expect(state.lastSpeechAtMs).toBe(1_004);
  });

  it("uses learned session levels to detect quieter speech on the next turn", () => {
    let state = createDriveVoiceActivityState(0, {
      noiseFloorDb: -65,
      speechLevelDb: -44,
    });

    for (const [index, levelDb] of [
      -52,
      -50,
      -49,
      -48,
      -48.5,
    ].entries()) {
      state = updateDriveVoiceActivity(
        state,
        levelDb,
        index * 150,
      );
    }

    expect(state.hasDetectedSpeech).toBe(true);
    expect(state.voiceActive).toBe(true);
  });

  it("starts a fresh ten-second silence window after speech ends", () => {
    let state = createDriveVoiceActivityState(0);

    state = updateDriveVoiceActivity(state, -20, 1_000);
    state = updateDriveVoiceActivity(state, -18, 1_150);
    state = updateDriveVoiceActivity(state, -70, 1_300);
    state = updateDriveVoiceActivity(state, -70, 1_450);
    state = updateDriveVoiceActivity(state, -70, 1_600);

    expect(state.voiceActive).toBe(false);
    expect(getDriveCountdownSeconds(state, 1_600)).toBe(10);
    expect(getDriveCountdownSeconds(state, 11_150)).toBe(0);
  });

  it("releases loud speech into a loud new environment", () => {
    let state = createDriveVoiceActivityState(0);

    state = updateDriveVoiceActivity(state, -20, 1_000);
    state = updateDriveVoiceActivity(state, -18, 1_150);
    expect(state.voiceActive).toBe(true);

    state = updateDriveVoiceActivity(state, -38, 1_300);
    state = updateDriveVoiceActivity(state, -39, 1_450);
    state = updateDriveVoiceActivity(state, -40, 1_600);

    expect(state.voiceActive).toBe(false);
    expect(getDriveCountdownSeconds(state, 1_600)).toBe(10);
  });

  it("confirms moderate speech without letting the learned threshold chase it", () => {
    let state = createDriveVoiceActivityState(0);

    state = updateDriveVoiceActivity(state, -20, 1_000);
    state = updateDriveVoiceActivity(state, -18, 1_150);
    state = updateDriveVoiceActivity(state, -70, 1_300);
    state = updateDriveVoiceActivity(state, -70, 1_450);
    state = updateDriveVoiceActivity(state, -70, 1_600);

    expect(getDriveCountdownSeconds(state, 10_000)).toBe(2);

    for (const [index, levelDb] of [
      -44,
      -41,
      -45,
      -39,
      -43,
    ].entries()) {
      state = updateDriveVoiceActivity(
        state,
        levelDb,
        10_000 + index * 150,
      );
    }

    expect(state.hasDetectedSpeech).toBe(true);
    expect(state.voiceActive).toBe(true);
    expect(state.lastSpeechAtMs).toBe(10_600);
    expect(getDriveCountdownSeconds(state, 10_600)).toBeNull();
  });

  it("learns steady background noise without treating it as speech", () => {
    let state = createDriveVoiceActivityState(0);

    for (let index = 0; index < 30; index += 1) {
      state = updateDriveVoiceActivity(state, -42, index * 150);
    }

    expect(state.hasDetectedSpeech).toBe(false);
    expect(state.voiceActive).toBe(false);
  });

  it("ignores a single loud transient", () => {
    let state = createDriveVoiceActivityState(0);

    state = updateDriveVoiceActivity(state, -15, 1_000);
    state = updateDriveVoiceActivity(state, -70, 1_150);

    expect(state.hasDetectedSpeech).toBe(false);
    expect(state.voiceActive).toBe(false);
  });

  it("does not confirm a brief five-sample background burst", () => {
    let state = createDriveVoiceActivityState(0);

    for (const [index, levelDb] of [
      -46.8,
      -45.8,
      -44.7,
      -43.8,
      -43.2,
    ].entries()) {
      state = updateDriveVoiceActivity(
        state,
        levelDb,
        1_000 + index * 75,
      );
    }

    expect(state.hasDetectedSpeech).toBe(false);
    expect(state.voiceActive).toBe(false);
  });

  it("does not let intermittent background chatter reset the silence window", () => {
    let state = createDriveVoiceActivityState(0);

    state = updateDriveVoiceActivity(state, -20, 1_000);
    state = updateDriveVoiceActivity(state, -18, 1_150);
    state = updateDriveVoiceActivity(state, -70, 1_300);
    state = updateDriveVoiceActivity(state, -70, 1_450);
    state = updateDriveVoiceActivity(state, -70, 1_600);
    const lastSpeechAtMs = state.lastSpeechAtMs;
    let pausedForCandidate = false;

    for (const burstStartedAtMs of [3_000, 6_000, 9_000]) {
      state = updateDriveVoiceActivity(
        state,
        -36,
        burstStartedAtMs,
      );
      pausedForCandidate ||= getDriveCountdownSeconds(
        state,
        burstStartedAtMs,
      ) === null;

      state = updateDriveVoiceActivity(
        state,
        -35,
        burstStartedAtMs + 150,
      );
      state = updateDriveVoiceActivity(
        state,
        -52,
        burstStartedAtMs + 300,
      );

      expect(state.voiceActive).toBe(false);
      expect(state.lastSpeechAtMs).toBe(lastSpeechAtMs);
    }

    expect(pausedForCandidate).toBe(true);
    expect(getDriveSilenceRemainingMs(state, 11_150)).toBe(0);
  });

  it("adapts to steady chatter that begins after real speech", () => {
    let state = createDriveVoiceActivityState(0);

    state = updateDriveVoiceActivity(state, -20, 1_000);
    state = updateDriveVoiceActivity(state, -18, 1_150);
    state = updateDriveVoiceActivity(state, -70, 1_300);
    state = updateDriveVoiceActivity(state, -70, 1_450);
    state = updateDriveVoiceActivity(state, -70, 1_600);
    const lastSpeechAtMs = state.lastSpeechAtMs;

    for (let index = 0; index < 30; index += 1) {
      state = updateDriveVoiceActivity(
        state,
        -42,
        2_000 + index * 150,
      );
    }

    expect(state.voiceActive).toBe(false);
    expect(state.lastSpeechAtMs).toBe(lastSpeechAtMs);
    expect(getDriveSilenceRemainingMs(state, 11_150)).toBe(0);
  });

  it("still confirms a real near-field utterance after ambient adaptation", () => {
    let state = createDriveVoiceActivityState(0);

    for (let index = 0; index < 20; index += 1) {
      state = updateDriveVoiceActivity(state, -44, index * 150);
    }

    for (const [index, levelDb] of [-24, -22].entries()) {
      state = updateDriveVoiceActivity(
        state,
        levelDb,
        3_000 + index * 150,
      );
    }

    expect(state.hasDetectedSpeech).toBe(true);
    expect(state.voiceActive).toBe(true);
    expect(state.lastSpeechAtMs).toBe(3_150);
  });
});
