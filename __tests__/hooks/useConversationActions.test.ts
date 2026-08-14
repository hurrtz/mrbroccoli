import { act, renderHook } from "@testing-library/react-native";

import * as Clipboard from "expo-clipboard";
import { Share } from "react-native";

import { useConversationActions } from "../../src/screens/main/useConversationActions";

jest.mock("expo-clipboard", () => ({
  setStringAsync: jest.fn(() => Promise.resolve()),
}));

describe("useConversationActions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Share, "share").mockResolvedValue({
      action: "sharedAction",
    } as never);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("resets the voice session before starting a fresh conversation", async () => {
    const callOrder: string[] = [];
    const resetVoiceSessionState = jest.fn(async () => {
      callOrder.push("reset");
    });
    const clearActiveConversation = jest.fn(() => {
      callOrder.push("clear");
    });

    const { result } = renderHook(() =>
      useConversationActions({
        activeConversation: null,
        getConversationById: jest.fn(),
        renameConversation: jest.fn(),
        toggleConversationPinned: jest.fn(),
        toggleConversationPrivate: jest.fn(),
        toggleConversationArchived: jest.fn(),
        deleteConversation: jest.fn(),
        selectConversation: jest.fn(),
        clearActiveConversation,
        resetVoiceSessionState,
        showToast: jest.fn(),
        language: "en",
        t: (key) => key,
      }),
    );

    await act(async () => {
      await result.current.handleStartNewSession();
    });

    expect(resetVoiceSessionState).toHaveBeenCalledTimes(1);
    expect(clearActiveConversation).toHaveBeenCalledTimes(1);
    expect(callOrder).toEqual(["reset", "clear"]);
  });

  it("resets the voice session before selecting a saved conversation", async () => {
    const callOrder: string[] = [];
    const resetVoiceSessionState = jest.fn(async () => {
      callOrder.push("reset");
    });
    const selectConversation = jest.fn(async () => {
      callOrder.push("select");
    });

    const { result } = renderHook(() =>
      useConversationActions({
        activeConversation: null,
        getConversationById: jest.fn(),
        renameConversation: jest.fn(),
        toggleConversationPinned: jest.fn(),
        toggleConversationPrivate: jest.fn(),
        toggleConversationArchived: jest.fn(),
        deleteConversation: jest.fn(),
        selectConversation,
        clearActiveConversation: jest.fn(),
        resetVoiceSessionState,
        showToast: jest.fn(),
        language: "en",
        t: (key) => key,
      }),
    );

    await act(async () => {
      await result.current.handleSelectConversation("conversation-1");
    });

    expect(selectConversation).toHaveBeenCalledWith("conversation-1");
    expect(callOrder).toEqual(["reset", "select"]);
  });

  it("cancels only the active conversation's voice session before deletion", async () => {
    const callOrder: string[] = [];
    const resetVoiceSessionState = jest.fn(async () => {
      callOrder.push("reset");
    });
    const deleteConversation = jest.fn((conversationId: string) => {
      callOrder.push(`delete:${conversationId}`);
    });
    const activeConversation = {
      id: "conversation-1",
      title: "Active conversation",
      createdAt: "2026-03-22T10:00:00.000Z",
      updatedAt: "2026-03-22T10:00:00.000Z",
      messages: [],
    };
    const { result } = renderHook(() =>
      useConversationActions({
        activeConversation,
        getConversationById: jest.fn(),
        renameConversation: jest.fn(),
        toggleConversationPinned: jest.fn(),
        toggleConversationPrivate: jest.fn(),
        toggleConversationArchived: jest.fn(),
        deleteConversation,
        selectConversation: jest.fn(),
        clearActiveConversation: jest.fn(),
        resetVoiceSessionState,
        showToast: jest.fn(),
        language: "en",
        t: (key) => key,
      }),
    );

    await act(async () => {
      await result.current.handleDeleteConversation("conversation-1");
      await result.current.handleDeleteConversation("conversation-2");
    });

    expect(resetVoiceSessionState).toHaveBeenCalledTimes(1);
    expect(deleteConversation).toHaveBeenNthCalledWith(1, "conversation-1");
    expect(deleteConversation).toHaveBeenNthCalledWith(2, "conversation-2");
    expect(callOrder).toEqual([
      "reset",
      "delete:conversation-1",
      "delete:conversation-2",
    ]);
  });

  it("copies the active conversation transcript to the clipboard", async () => {
    const showToast = jest.fn();
    const activeConversation = {
      id: "conversation-1",
      title: "Trip planning",
      createdAt: "2026-03-22T10:00:00.000Z",
      updatedAt: "2026-03-22T10:00:00.000Z",
      messages: [
        {
          id: "m1",
          role: "user" as const,
          content: "Hello there",
          model: null,
          provider: null,
          timestamp: "2026-03-22T10:00:00.000Z",
        },
      ],
    };

    const { result } = renderHook(() =>
      useConversationActions({
        activeConversation,
        getConversationById: jest.fn(),
        renameConversation: jest.fn(),
        toggleConversationPinned: jest.fn(),
        toggleConversationPrivate: jest.fn(),
        toggleConversationArchived: jest.fn(),
        deleteConversation: jest.fn(),
        selectConversation: jest.fn(),
        clearActiveConversation: jest.fn(),
        resetVoiceSessionState: jest.fn(),
        showToast,
        language: "en",
        t: (key) =>
          ({
            threadCopied: "thread copied",
            nothingToCopyYet: "nothing to copy",
            couldntCopyText: "copy failed",
          })[key] ?? key,
      }),
    );

    await act(async () => {
      await result.current.handleCopyThread();
    });

    expect(Clipboard.setStringAsync).toHaveBeenCalledWith(
      expect.stringContaining("Hello there"),
    );
    expect(showToast).toHaveBeenCalledWith(
      "thread copied",
      undefined,
      "success",
    );
  });

  it("shares the active conversation as a structured AI handoff", async () => {
    const activeConversation = {
      id: "conversation-1",
      title: "Trip planning",
      createdAt: "2026-03-22T10:00:00.000Z",
      updatedAt: "2026-03-22T10:00:00.000Z",
      messages: [
        {
          id: "m1",
          role: "user" as const,
          content: "Hello there",
          model: null,
          provider: null,
          timestamp: "2026-03-22T10:00:00.000Z",
        },
      ],
    };
    const { result } = renderHook(() =>
      useConversationActions({
        activeConversation,
        getConversationById: jest.fn(),
        renameConversation: jest.fn(),
        toggleConversationPinned: jest.fn(),
        toggleConversationPrivate: jest.fn(),
        toggleConversationArchived: jest.fn(),
        deleteConversation: jest.fn(),
        selectConversation: jest.fn(),
        clearActiveConversation: jest.fn(),
        resetVoiceSessionState: jest.fn(),
        showToast: jest.fn(),
        language: "en",
        t: (key) => key,
      }),
    );

    await act(async () => {
      await result.current.handleShareThread();
    });

    expect(Share.share).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining(
          "Use this transcript as context and continue from its final turn.",
        ),
      }),
      { dialogTitle: "Trip planning" },
    );
  });

});
