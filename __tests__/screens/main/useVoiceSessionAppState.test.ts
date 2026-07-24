import { act, renderHook } from "@testing-library/react-native";
import { AppState } from "react-native";

import { useVoiceSessionAppState } from "../../../src/screens/main/voiceSession/useVoiceSessionAppState";

jest.mock("../../../src/services/debugLogCapture", () => ({
  recordDebugLogEvent: jest.fn(),
}));

describe("useVoiceSessionAppState", () => {
  let appStateListener: ((state: string) => void) | null = null;

  beforeEach(() => {
    appStateListener = null;
    jest
      .spyOn(AppState, "addEventListener")
      .mockImplementation((_event, listener) => {
        appStateListener = listener as (state: string) => void;
        return { remove: jest.fn() } as never;
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("reads the live capture state when the app backgrounds", async () => {
    const stopVoiceCapture = jest.fn(async () => undefined);
    const onBackgroundSubmitError = jest.fn();
    let captureActive = false;
    renderHook(() =>
      useVoiceSessionAppState({
        hasActiveVoiceCaptureNow: () => captureActive,
        onBackgroundSubmitError,
        stopVoiceCapture,
      }),
    );

    await act(async () => {
      // Capture can start between React renders while the iOS audio route is
      // settling. The AppState callback must read lifecycle refs at event time.
      captureActive = true;
      appStateListener?.("background");
      await Promise.resolve();
    });

    expect(stopVoiceCapture).toHaveBeenCalledTimes(1);
    expect(onBackgroundSubmitError).not.toHaveBeenCalled();
  });

  it("leaves an already submitted turn running when the app backgrounds", async () => {
    const stopVoiceCapture = jest.fn(async () => undefined);
    renderHook(() =>
      useVoiceSessionAppState({
        hasActiveVoiceCaptureNow: () => false,
        onBackgroundSubmitError: jest.fn(),
        stopVoiceCapture,
      }),
    );

    await act(async () => {
      appStateListener?.("background");
      await Promise.resolve();
    });

    expect(stopVoiceCapture).not.toHaveBeenCalled();
  });

  it("reports a background capture stop failure", async () => {
    const failure = new Error("Recorder stop failed");
    const stopVoiceCapture = jest.fn(async () => {
      throw failure;
    });
    const onBackgroundSubmitError = jest.fn();
    renderHook(() =>
      useVoiceSessionAppState({
        hasActiveVoiceCaptureNow: () => true,
        onBackgroundSubmitError,
        stopVoiceCapture,
      }),
    );

    await act(async () => {
      appStateListener?.("background");
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(onBackgroundSubmitError).toHaveBeenCalledWith(failure);
  });
});
