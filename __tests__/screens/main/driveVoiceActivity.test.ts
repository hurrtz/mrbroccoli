import {
  createDriveVoiceActivityState,
  DRIVE_SILENCE_WINDOW_MS,
  getDriveCountdownSeconds,
  getDriveSilenceRemainingMs,
  updateDriveVoiceActivity,
} from "../../../src/screens/main/voiceSession/driveVoiceActivity";

describe("driveVoiceActivity", () => {
  it("counts down a full ten seconds when no speech is detected", () => {
    const state = createDriveVoiceActivityState(1_000);

    expect(getDriveCountdownSeconds(state, 1_000)).toBe(10);
    expect(getDriveCountdownSeconds(state, 5_001)).toBe(6);
    expect(
      getDriveSilenceRemainingMs(
        state,
        1_000 + DRIVE_SILENCE_WINDOW_MS,
      ),
    ).toBe(0);
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

    state = updateDriveVoiceActivity(state, -20, 0);
    state = updateDriveVoiceActivity(state, -18, 150);

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
