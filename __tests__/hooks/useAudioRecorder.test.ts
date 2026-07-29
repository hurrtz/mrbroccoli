import { act, renderHook } from "@testing-library/react-native";
import {
  getRecordingPermissionsAsync,
  requestRecordingPermissionsAsync,
} from "expo-audio";

import { useAudioRecorder } from "../../src/hooks/useAudioRecorder";
import { startNativeWaveformRecording } from "../../src/services/nativeWaveform";

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
  isNativeWaveformAvailable: jest.fn(() => true),
  startNativeWaveformRecording: jest.fn(async () => ({
    uri: "file:///recording.wav",
  })),
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

    const sessionId =
      (startNativeWaveformRecording as jest.Mock).mock.calls[0][0].sessionId;

    act(() => {
      nativeWaveformListener?.({
        type: "levels",
        sessionId,
        metering: -24,
      });
    });

    expect(result.current.inputMetering).toBe(-24);
  });
});
