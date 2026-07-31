import { act, renderHook } from "@testing-library/react-native";

import { useTextTurnSubmitController } from "../../../src/screens/main/useTextTurnSubmitController";
import type { Message } from "../../../src/types";

jest.mock("expo-clipboard", () => ({
  setStringAsync: jest.fn(async () => undefined),
}));

jest.mock("expo-file-system/legacy", () => ({
  cacheDirectory: "file:///tmp/",
  documentDirectory: "file:///tmp/",
  deleteAsync: jest.fn(async () => undefined),
  getInfoAsync: jest.fn(async () => ({ exists: false })),
  makeDirectoryAsync: jest.fn(async () => undefined),
  readAsStringAsync: jest.fn(async () => ""),
  writeAsStringAsync: jest.fn(async () => undefined),
}));

describe("useTextTurnSubmitController", () => {
  it("coalesces duplicate submit events until the active turn finishes", async () => {
    let finishTurn: () => void = () => undefined;
    const handleVoiceCaptureDone = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          finishTurn = resolve;
        }),
    );
    const { result } = renderHook(() =>
      useTextTurnSubmitController({
        handleVoiceCaptureDone,
        isBusy: false,
      }),
    );

    act(() => {
      result.current.handleSubmitTextMessage("One turn");
      result.current.handleSubmitTextMessage("One turn");
    });

    expect(handleVoiceCaptureDone).toHaveBeenCalledTimes(1);
    expect(handleVoiceCaptureDone).toHaveBeenCalledWith({
      existingUserMessageId: undefined,
      transcriptionOverride: "One turn",
      turnId: expect.stringMatching(/^turn-/),
    });

    await act(async () => {
      finishTurn();
      await Promise.resolve();
    });

    act(() => {
      result.current.handleSubmitTextMessage("Next turn");
    });
    expect(handleVoiceCaptureDone).toHaveBeenCalledTimes(2);
  });

  it("shares the same lock between new turns and inline retries", () => {
    const handleVoiceCaptureDone = jest.fn(() => new Promise<void>(() => {}));
    const message: Message = {
      id: "message-1",
      role: "user",
      content: "Retry me",
      model: null,
      provider: null,
      timestamp: "2026-07-22T09:00:00.000Z",
    };
    const { result } = renderHook(() =>
      useTextTurnSubmitController({
        handleVoiceCaptureDone,
        isBusy: false,
      }),
    );

    act(() => {
      result.current.handleRetryMessage(message);
      result.current.handleSubmitTextMessage("A competing turn");
    });

    expect(handleVoiceCaptureDone).toHaveBeenCalledTimes(1);
    expect(handleVoiceCaptureDone).toHaveBeenCalledWith({
      existingUserMessageId: "message-1",
      transcriptionOverride: "Retry me",
      turnId: expect.stringMatching(/^turn-/),
    });
  });

  it("ignores empty or busy submissions", () => {
    const handleVoiceCaptureDone = jest.fn(async () => undefined);
    const { result } = renderHook(() =>
      useTextTurnSubmitController({
        handleVoiceCaptureDone,
        isBusy: true,
      }),
    );

    act(() => {
      result.current.handleSubmitTextMessage("   ");
      result.current.handleSubmitTextMessage("Busy turn");
    });

    expect(handleVoiceCaptureDone).not.toHaveBeenCalled();
  });

  it("blocks submissions when the selected voice route is unavailable", () => {
    const handleVoiceCaptureDone = jest.fn(async () => undefined);
    const showToast = jest.fn();
    const { result } = renderHook(() =>
      useTextTurnSubmitController({
        handleVoiceCaptureDone,
        isBusy: false,
        promptSubmissionBlockMessage: "Install Kokoro first.",
        showToast,
      }),
    );

    act(() => {
      result.current.handleSubmitTextMessage("Blocked turn");
    });

    expect(handleVoiceCaptureDone).not.toHaveBeenCalled();
    expect(showToast).toHaveBeenCalledWith(
      "Install Kokoro first.",
      undefined,
      "danger",
    );
  });
});
