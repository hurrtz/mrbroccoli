import { act, renderHook } from "@testing-library/react-native";
import {
  getRecordingPermissionsAsync,
  requestRecordingPermissionsAsync,
} from "expo-audio";
import * as FileSystem from "expo-file-system/legacy";

import { useAudioRecorder } from "../../src/hooks/useAudioRecorder";
import {
  cancelNativeWaveformRecording,
  startNativeAmbientMonitoring,
  startNativeWaveformRecording,
  stopNativeAmbientMonitoring,
  stopNativeWaveformRecording,
} from "../../src/services/nativeWaveform";

let nativeWaveformListener: ((event: any) => void) | null = null;

jest.mock("../../src/i18n", () => ({
  useLocalization: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("../../src/services/debugLogCapture", () => ({
  recordDebugLogEvent: jest.fn(),
}));

jest.mock("../../src/services/nativeWaveform", () => ({
  cancelNativeWaveformRecording: jest.fn(async () => undefined),
  isNativeAmbientMonitoringAvailable: jest.fn(() => true),
  isNativeWaveformAvailable: jest.fn(() => true),
  startNativeAmbientMonitoring: jest.fn(async () => ({
    audioRoute: "built-in",
  })),
  startNativeWaveformRecording: jest.fn(async () => ({
    uri: "file:///recording.wav",
  })),
  stopNativeAmbientMonitoring: jest.fn(async () => true),
  stopNativeWaveformRecording: jest.fn(async () => ({
    uri: "file:///recording.wav",
  })),
  subscribeToNativeWaveform: jest.fn((listener) => {
    nativeWaveformListener = listener;
    return jest.fn();
  }),
}));

jest.mock("expo-audio", () => ({
  getRecordingPermissionsAsync: jest.fn(),
  RecordingPresets: {
    HIGH_QUALITY: {},
  },
  requestRecordingPermissionsAsync: jest.fn(),
  useAudioRecorder: jest.fn(() => ({
    getStatus: jest.fn(() => ({
      canRecord: false,
      isRecording: false,
      url: null,
    })),
    prepareToRecordAsync: jest.fn(async () => undefined),
    record: jest.fn(),
    stop: jest.fn(async () => undefined),
    uri: null,
  })),
  useAudioRecorderState: jest.fn(() => ({
    canRecord: false,
    isRecording: false,
    url: null,
  })),
}));

describe("useAudioRecorder permissions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    nativeWaveformListener = null;
    (getRecordingPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: true,
    });
    (requestRecordingPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: true,
    });
    (startNativeAmbientMonitoring as jest.Mock).mockResolvedValue({
      audioRoute: "built-in",
    });
    (startNativeWaveformRecording as jest.Mock).mockResolvedValue({
      uri: "file:///recording.wav",
    });
    (stopNativeAmbientMonitoring as jest.Mock).mockResolvedValue(true);
    (stopNativeWaveformRecording as jest.Mock).mockResolvedValue({
      uri: "file:///recording.wav",
    });
    (cancelNativeWaveformRecording as jest.Mock).mockResolvedValue(undefined);
  });

  it("does not reopen the permission request when recording access is granted", async () => {
    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.startRecording();
    });

    expect(getRecordingPermissionsAsync).toHaveBeenCalledTimes(1);
    expect(requestRecordingPermissionsAsync).not.toHaveBeenCalled();
    expect(startNativeWaveformRecording).toHaveBeenCalledTimes(1);
  });

  it("requests recording access only when it is not already granted", async () => {
    (getRecordingPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: false,
    });
    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.startRecording();
    });

    expect(requestRecordingPermissionsAsync).toHaveBeenCalledTimes(1);
    expect(startNativeWaveformRecording).toHaveBeenCalledTimes(1);
  });

  it("does not start the recorder when recording access is denied", async () => {
    (getRecordingPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: false,
    });
    (requestRecordingPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: false,
    });
    const { result } = renderHook(() => useAudioRecorder());

    await expect(result.current.startRecording()).rejects.toThrow(
      "microphonePermissionNotGranted",
    );

    expect(startNativeWaveformRecording).not.toHaveBeenCalled();
  });

  it("exposes native recording levels for voice activity detection", async () => {
    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.startRecording();
    });

    const sessionId = (startNativeWaveformRecording as jest.Mock).mock
      .calls[0][0].sessionId;

    act(() => {
      nativeWaveformListener?.({
        type: "levels",
        sessionId,
        metering: -24,
      });
      nativeWaveformListener?.({
        type: "levels",
        sessionId,
        metering: -24,
      });
    });

    expect(result.current.inputMetering).toBe(-24);
    expect(result.current.inputMeteringSampleId).toBe(2);
  });

  it("exposes ambient levels and stops monitoring before recording", async () => {
    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.startAmbientMonitoring();
    });

    const sessionId = (startNativeAmbientMonitoring as jest.Mock).mock
      .calls[0][0];
    act(() => {
      nativeWaveformListener?.({
        type: "levels",
        sessionId,
        metering: -52,
      });
      nativeWaveformListener?.({
        type: "levels",
        sessionId,
        metering: -52,
      });
    });

    expect(result.current.ambientMonitoring).toBe(true);
    expect(result.current.ambientInputMetering).toBe(-52);
    expect(result.current.ambientInputMeteringSampleId).toBe(2);
    expect(result.current.audioRoute).toBe("built-in");

    await act(async () => {
      await result.current.startRecording();
    });

    expect(stopNativeAmbientMonitoring).toHaveBeenCalledWith(sessionId);
    expect(startNativeWaveformRecording).toHaveBeenCalledTimes(1);
    expect(result.current.ambientMonitoring).toBe(false);
    expect(result.current.ambientInputMetering).toBeNull();
  });

  it("stops a completed native recording and returns its URI", async () => {
    const dateNowSpy = jest.spyOn(Date, "now").mockReturnValue(1_000);
    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.startRecording();
    });
    dateNowSpy.mockReturnValue(1_500);

    let uri: string | null = null;
    await act(async () => {
      uri = await result.current.stopRecording();
    });

    expect(stopNativeWaveformRecording).toHaveBeenCalledWith(
      (startNativeWaveformRecording as jest.Mock).mock.calls[0][0].sessionId,
    );
    expect(uri).toBe("file:///recording.wav");
    expect(result.current.isRecording).toBe(false);
    dateNowSpy.mockRestore();
  });

  it("discards a native recording that is too short for transcription", async () => {
    const dateNowSpy = jest.spyOn(Date, "now").mockReturnValue(1_000);
    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.startRecording();
    });
    dateNowSpy.mockReturnValue(1_100);

    let uri: string | null = "not-cleared";
    await act(async () => {
      uri = await result.current.stopRecording();
    });

    expect(cancelNativeWaveformRecording).toHaveBeenCalledTimes(1);
    expect(stopNativeWaveformRecording).not.toHaveBeenCalled();
    expect(uri).toBeNull();
    dateNowSpy.mockRestore();
  });

  it("discards a silent native recording before provider transcription", async () => {
    const dateNowSpy = jest.spyOn(Date, "now").mockReturnValue(1_000);
    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.startRecording();
    });
    const sessionId = (startNativeWaveformRecording as jest.Mock).mock
      .calls[0][0].sessionId;
    act(() => {
      [-160, -160, -160, -160].forEach((metering) => {
        nativeWaveformListener?.({
          type: "levels",
          sessionId,
          metering,
        });
      });
    });
    dateNowSpy.mockReturnValue(2_000);

    let uri: string | null = "not-cleared";
    await act(async () => {
      uri = await result.current.stopRecording();
    });

    expect(stopNativeWaveformRecording).toHaveBeenCalledWith(sessionId);
    expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
      "file:///recording.wav",
      { idempotent: true },
    );
    expect(uri).toBeNull();
    dateNowSpy.mockRestore();
  });

  it("surfaces matching native recorder errors and ignores stale sessions", async () => {
    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.startRecording();
    });
    const sessionId = (startNativeWaveformRecording as jest.Mock).mock
      .calls[0][0].sessionId;

    act(() => {
      nativeWaveformListener?.({
        type: "error",
        sessionId: "stale-session",
        message: "Ignore me",
      });
    });
    expect(result.current.lastError).toBeNull();

    act(() => {
      nativeWaveformListener?.({
        type: "error",
        sessionId,
        message: "Recorder disconnected",
      });
    });

    expect(result.current.lastError).toBe("Recorder disconnected");
    expect(result.current.isRecording).toBe(false);
    expect(cancelNativeWaveformRecording).toHaveBeenCalledWith(sessionId);

    act(() => result.current.clearLastError());
    expect(result.current.lastError).toBeNull();
  });

  it("updates the active audio route from native subscription events", async () => {
    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.startRecording();
    });
    const sessionId = (startNativeWaveformRecording as jest.Mock).mock
      .calls[0][0].sessionId;

    act(() => {
      nativeWaveformListener?.({
        type: "routeChanged",
        sessionId,
        audioRoute: "bluetooth",
        reason: "new-device",
      });
    });

    expect(result.current.audioRoute).toBe("bluetooth");
  });

  it("recovers when ambient monitoring cannot be started or stopped", async () => {
    (startNativeAmbientMonitoring as jest.Mock).mockRejectedValueOnce(
      new Error("ambient unavailable"),
    );
    const { result } = renderHook(() => useAudioRecorder());

    await expect(result.current.startAmbientMonitoring()).resolves.toBe(false);
    expect(result.current.ambientMonitoring).toBe(false);

    (startNativeAmbientMonitoring as jest.Mock).mockResolvedValueOnce({
      audioRoute: "built-in",
    });
    await act(async () => {
      await result.current.startAmbientMonitoring();
    });
    (stopNativeAmbientMonitoring as jest.Mock).mockRejectedValueOnce(
      new Error("already stopped"),
    );

    let stopped = true;
    await act(async () => {
      stopped = await result.current.stopAmbientMonitoring();
    });
    expect(stopped).toBe(false);
    expect(result.current.ambientMonitoring).toBe(false);
  });
});
