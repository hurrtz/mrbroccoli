jest.mock("../../src/services/debugLogCapture", () => ({
  recordDebugLogEvent: jest.fn(),
}));

import {
  endVoiceLiveActivity,
  scheduleVoiceLiveActivityEnd,
  setVoiceLiveActivityState,
  VOICE_LIVE_ACTIVITY_HEARTBEAT_MS,
} from "../../src/services/voiceLiveActivity";

function createNativeModule() {
  return {
    setState: jest.fn(async () => true),
    endActivity: jest.fn(async () => true),
  };
}

describe("voiceLiveActivity", () => {
  const labels = {
    phaseLabel: "Thinking",
    statusLabel: "Please wait",
  };

  beforeEach(() => {
    jest.useFakeTimers();
    endVoiceLiveActivity({ platform: "android" });
  });

  afterEach(() => {
    endVoiceLiveActivity({ platform: "android" });
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("sends only phase and local ETA to the iOS bridge", () => {
    const nativeModule = createNativeModule();

    expect(
      setVoiceLiveActivityState(
        {
          phase: "thinking",
          expectedSpeechAtMs: 123_456,
          ...labels,
        },
        { nativeModule, platform: "ios" },
      ),
    ).toBe(true);

    expect(nativeModule.setState).toHaveBeenCalledWith(
      "thinking",
      123_456,
      "Thinking",
      "Please wait",
    );
  });

  it("uses the same local bridge on Android and requests notification permission after capture", async () => {
    const nativeModule = createNativeModule();
    const requestNotificationPermission = jest.fn(async () => true);
    const dependencies = {
      nativeModule,
      platform: "android",
      platformVersion: 36,
      requestNotificationPermission,
    };

    setVoiceLiveActivityState(
      {
        phase: "listening",
        expectedSpeechAtMs: null,
        phaseLabel: "Listening",
        statusLabel: "Your turn",
      },
      dependencies,
    );
    expect(requestNotificationPermission).not.toHaveBeenCalled();

    setVoiceLiveActivityState(
      { phase: "thinking", expectedSpeechAtMs: 222_333, ...labels },
      dependencies,
    );
    await Promise.resolve();

    expect(requestNotificationPermission).toHaveBeenCalledTimes(1);
    expect(nativeModule.setState).toHaveBeenLastCalledWith(
      "thinking",
      222_333,
      "Thinking",
      "Please wait",
    );
  });

  it("deduplicates unchanged phases but refreshes the stale date by heartbeat", () => {
    const nativeModule = createNativeModule();
    const dependencies = { nativeModule, platform: "ios" };
    const state = {
      phase: "searching" as const,
      expectedSpeechAtMs: 234_567,
      phaseLabel: "Searching",
      statusLabel: "Please wait",
    };

    setVoiceLiveActivityState(state, dependencies);
    setVoiceLiveActivityState(state, dependencies);

    expect(nativeModule.setState).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(VOICE_LIVE_ACTIVITY_HEARTBEAT_MS);

    expect(nativeModule.setState).toHaveBeenCalledTimes(2);
  });

  it("cancels a hand-off end when the next processing phase arrives", () => {
    const nativeModule = createNativeModule();
    const dependencies = { nativeModule, platform: "ios" };

    setVoiceLiveActivityState(
      {
        phase: "listening",
        expectedSpeechAtMs: null,
        phaseLabel: "Listening",
        statusLabel: "Your turn",
      },
      dependencies,
    );
    scheduleVoiceLiveActivityEnd(750, dependencies);
    setVoiceLiveActivityState(
      {
        phase: "transcribing",
        expectedSpeechAtMs: 345_678,
        phaseLabel: "Transcribing",
        statusLabel: "Please wait",
      },
      dependencies,
    );
    jest.advanceTimersByTime(750);

    expect(nativeModule.endActivity).not.toHaveBeenCalled();
    expect(nativeModule.setState).toHaveBeenLastCalledWith(
      "transcribing",
      345_678,
      "Transcribing",
      "Please wait",
    );
  });

  it("ends after the hand-off grace expires and stops heartbeats", () => {
    const nativeModule = createNativeModule();
    const dependencies = { nativeModule, platform: "ios" };

    setVoiceLiveActivityState(
      { phase: "thinking", expectedSpeechAtMs: 456_789, ...labels },
      dependencies,
    );
    scheduleVoiceLiveActivityEnd(750, dependencies);
    jest.advanceTimersByTime(750);

    expect(nativeModule.endActivity).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(VOICE_LIVE_ACTIVITY_HEARTBEAT_MS);
    expect(nativeModule.setState).toHaveBeenCalledTimes(1);
  });

  it("is a no-op off iOS and Android", () => {
    const nativeModule = createNativeModule();

    expect(
      setVoiceLiveActivityState(
        { phase: "thinking", expectedSpeechAtMs: null, ...labels },
        { nativeModule, platform: "web" },
      ),
    ).toBe(false);
    expect(nativeModule.setState).not.toHaveBeenCalled();
  });
});
