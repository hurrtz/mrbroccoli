import { act, renderHook } from "@testing-library/react-native";

import {
  appendNoticeMetadata,
  formatNoticeToast,
  getUnexpectedIssueDetail,
  useVoiceTurnMessageState,
} from "../../src/hooks/voicePipeline/useVoiceTurnMessageState";
import type {
  Message,
  MessageMetadata,
  MessagePipelineNotice,
} from "../../src/types";

const webSearchNotice: MessagePipelineNotice = {
  stage: "web-search",
  level: "warning",
  message: "Search was unavailable.",
  detail: "The provider timed out.",
};

function createMessageStore(initialMessages: Message[]) {
  const messages = new Map(
    initialMessages.map((message) => [message.id, message]),
  );
  const updateMessage = jest.fn(
    (messageId: string, updater: (message: Message) => Message) => {
      const current = messages.get(messageId);
      if (!current) {
        return null;
      }

      const updated = updater(current);
      messages.set(messageId, updated);
      return updated;
    },
  );

  return { messages, updateMessage };
}

describe("useVoiceTurnMessageState", () => {
  it("clears a retry failure while preserving unrelated metadata", () => {
    const store = createMessageStore([
      {
        id: "user-1",
        role: "user",
        content: "Try this again",
        model: null,
        provider: null,
        timestamp: "2026-07-24T12:00:00.000Z",
        metadata: {
          notices: [webSearchNotice],
          replyFailure: { message: "Previous failure" },
        },
      },
    ]);
    const { result } = renderHook(() =>
      useVoiceTurnMessageState(store.updateMessage),
    );

    act(() => {
      result.current.resetTurnMessageState("user-1");
    });

    expect(result.current.lastUserMessageIdRef.current).toBe("user-1");
    expect(result.current.lastAssistantMessageIdRef.current).toBeNull();
    expect(store.messages.get("user-1")?.metadata).toEqual({
      notices: [webSearchNotice],
    });
  });

  it("moves pending notices onto the assistant response once without duplicates", () => {
    const store = createMessageStore([]);
    const { result } = renderHook(() =>
      useVoiceTurnMessageState(store.updateMessage),
    );

    let metadata: MessageMetadata | undefined;
    act(() => {
      result.current.queueAssistantNotice(webSearchNotice);
      result.current.queueAssistantNotice(webSearchNotice);
      metadata = result.current.consumeAssistantMetadata();
    });

    expect(metadata).toEqual({ notices: [webSearchNotice] });
    expect(result.current.consumeAssistantMetadata()).toBeUndefined();
  });

  it("records only the first TTS fallback and attaches it to the saved assistant", () => {
    const store = createMessageStore([
      {
        id: "assistant-1",
        role: "assistant",
        content: "Here is the reply.",
        model: "gpt-5.2",
        provider: "openai",
        timestamp: "2026-07-24T12:00:01.000Z",
      },
    ]);
    const { result } = renderHook(() =>
      useVoiceTurnMessageState(store.updateMessage),
    );
    const notice: MessagePipelineNotice = {
      stage: "tts",
      level: "warning",
      message: "Provider voice failed.",
    };
    let firstResult = false;
    let secondResult = true;

    act(() => {
      result.current.lastAssistantMessageIdRef.current = "assistant-1";
      firstResult = result.current.recordTtsFallbackNotice(notice);
      secondResult = result.current.recordTtsFallbackNotice(notice);
    });

    expect(firstResult).toBe(true);
    expect(secondResult).toBe(false);
    expect(store.updateMessage).toHaveBeenCalledTimes(1);
    expect(store.messages.get("assistant-1")?.metadata).toEqual({
      notices: [notice],
    });
  });

  it("persists queued notices on the user message when reply generation fails", () => {
    const store = createMessageStore([
      {
        id: "user-1",
        role: "user",
        content: "Search for this",
        model: null,
        provider: null,
        timestamp: "2026-07-24T12:00:00.000Z",
      },
    ]);
    const { result } = renderHook(() =>
      useVoiceTurnMessageState(store.updateMessage),
    );

    act(() => {
      result.current.resetTurnMessageState("user-1");
      result.current.queueAssistantNotice(webSearchNotice);
      result.current.persistPendingNoticesForUser();
    });

    expect(store.messages.get("user-1")?.metadata).toEqual({
      notices: [webSearchNotice],
    });
    expect(result.current.consumeAssistantMetadata()).toBeUndefined();
  });
});

describe("voice turn notice helpers", () => {
  it("deduplicates notices and formats only useful provider details", () => {
    const once = appendNoticeMetadata(undefined, webSearchNotice);
    const twice = appendNoticeMetadata(once, webSearchNotice);

    expect(twice.notices).toEqual([webSearchNotice]);
    expect(formatNoticeToast(webSearchNotice)).toBe(
      "Search was unavailable. The provider timed out.",
    );
    expect(
      getUnexpectedIssueDetail(
        new Error("Search was unavailable."),
        "Search was unavailable.",
      ),
    ).toBeUndefined();
    expect(
      getUnexpectedIssueDetail(
        new Error("The provider timed out."),
        "Search was unavailable.",
      ),
    ).toBe("The provider timed out.");
  });
});
