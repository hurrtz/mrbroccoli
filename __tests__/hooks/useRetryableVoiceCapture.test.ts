import { act, renderHook } from "@testing-library/react-native";

import { useRetryableVoiceCapture } from "../../src/hooks/voicePipeline/useRetryableVoiceCapture";
import { cleanupCapturedAudio } from "../../src/services/voicePipeline/cleanup";

jest.mock("../../src/services/voicePipeline/cleanup", () => ({
  cleanupCapturedAudio: jest.fn(async () => undefined),
}));

describe("useRetryableVoiceCapture", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("reuses the retained capture without deleting it", () => {
    const { result } = renderHook(() => useRetryableVoiceCapture());

    act(() => {
      result.current.retainCaptureForRetry("file:///tmp/retry.wav");
      result.current.prepareCaptureForTurn("file:///tmp/retry.wav");
    });

    expect(cleanupCapturedAudio).not.toHaveBeenCalled();
  });

  it("deletes a retained capture when another turn supersedes it", () => {
    const { result } = renderHook(() => useRetryableVoiceCapture());

    act(() => {
      result.current.retainCaptureForRetry("file:///tmp/old.wav");
      result.current.prepareCaptureForTurn("file:///tmp/new.wav");
    });

    expect(cleanupCapturedAudio).toHaveBeenCalledWith("file:///tmp/old.wav");
  });

  it("deletes the retained capture when its retry UI is dismissed", () => {
    const { result } = renderHook(() => useRetryableVoiceCapture());

    act(() => {
      result.current.retainCaptureForRetry("file:///tmp/dismissed.wav");
      result.current.discardRetainedCapture("file:///tmp/dismissed.wav");
    });

    expect(cleanupCapturedAudio).toHaveBeenCalledWith(
      "file:///tmp/dismissed.wav",
    );
  });

  it("keeps at most one retained capture and cleans it on unmount", () => {
    const { result, unmount } = renderHook(() => useRetryableVoiceCapture());

    act(() => {
      result.current.retainCaptureForRetry("file:///tmp/first.wav");
      result.current.retainCaptureForRetry("file:///tmp/second.wav");
    });

    expect(cleanupCapturedAudio).toHaveBeenCalledWith("file:///tmp/first.wav");

    unmount();

    expect(cleanupCapturedAudio).toHaveBeenCalledWith("file:///tmp/second.wav");
  });
});
