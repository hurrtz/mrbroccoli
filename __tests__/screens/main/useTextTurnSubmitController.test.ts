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

  it("forks an edited message before submitting it in the new conversation", async () => {
    const handleVoiceCaptureDone = jest.fn(async () => undefined);
    const contextMessage: Message = {
      id: "fork-context-1",
      role: "assistant",
      content: "Earlier context",
      model: "gpt-5.4",
      provider: "openai",
      timestamp: "2026-08-04T08:00:00.000Z",
    };
    const promptMessage: Message = {
      id: "fork-prompt-1",
      role: "user",
      content: "Corrected request",
      editedAt: "2026-08-04T08:02:00.000Z",
      model: null,
      provider: null,
      timestamp: "2026-08-04T08:01:00.000Z",
    };
    const conversation = {
      id: "fork-1",
      title: "Corrected request",
      createdAt: "2026-08-04T08:02:00.000Z",
      updatedAt: "2026-08-04T08:02:00.000Z",
      messages: [contextMessage, promptMessage],
    };
    const branchConversationAtMessage = jest.fn(async () => ({
      conversation,
      contextMessages: [contextMessage],
      checkpointMessage: promptMessage,
    }));
    const sourceMessage = { ...promptMessage, id: "source-prompt-1" };
    const { result } = renderHook(() =>
      useTextTurnSubmitController({
        branchConversationAtMessage,
        handleVoiceCaptureDone,
        isBusy: false,
      }),
    );

    let created = false;
    await act(async () => {
      created = await result.current.handleBranchMessage(sourceMessage);
    });

    expect(created).toBe(true);
    expect(branchConversationAtMessage).toHaveBeenCalledWith("source-prompt-1");
    expect(handleVoiceCaptureDone).toHaveBeenCalledWith({
      conversationOverride: conversation,
      existingUserMessageId: "fork-prompt-1",
      messagesOverride: [contextMessage],
      transcriptionOverride: "Corrected request",
      turnId: expect.stringMatching(/^turn-/),
    });
  });

  it("opens an assistant checkpoint as a ready branch without generating a reply", async () => {
    const handleVoiceCaptureDone = jest.fn(async () => undefined);
    const showToast = jest.fn();
    const checkpointMessage: Message = {
      id: "branch-assistant-copy",
      role: "assistant",
      content: "Continue after this answer",
      model: "gpt-5.4",
      provider: "openai",
      timestamp: "2026-08-04T08:03:00.000Z",
    };
    const conversation = {
      id: "assistant-branch",
      title: "Parent conversation",
      createdAt: "2026-08-04T08:04:00.000Z",
      updatedAt: "2026-08-04T08:04:00.000Z",
      messages: [checkpointMessage],
    };
    const branchConversationAtMessage = jest.fn(async () => ({
      conversation,
      contextMessages: [],
      checkpointMessage,
    }));
    const sourceMessage = {
      ...checkpointMessage,
      id: "source-assistant",
    };
    const { result } = renderHook(() =>
      useTextTurnSubmitController({
        branchConversationAtMessage,
        branchCreatedMessage: "Branch ready",
        handleVoiceCaptureDone,
        isBusy: false,
        showToast,
      }),
    );

    let created = false;
    await act(async () => {
      created = await result.current.handleBranchMessage(sourceMessage);
    });

    expect(created).toBe(true);
    expect(branchConversationAtMessage).toHaveBeenCalledWith(
      "source-assistant",
    );
    expect(handleVoiceCaptureDone).not.toHaveBeenCalled();
    expect(showToast).toHaveBeenCalledWith(
      "Branch ready",
      undefined,
      "success",
    );
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
