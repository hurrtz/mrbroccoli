import { act, renderHook, waitFor } from "@testing-library/react-native";

import { useConversationArchive } from "../../src/hooks/useConversationArchive";
import {
  loadConversationArchiveConfig,
  syncConversationArchive,
} from "../../src/services/conversationArchive";
import type { ConversationMeta } from "../../src/types";

jest.mock("../../src/services/conversationArchive", () => {
  const actual = jest.requireActual("../../src/services/conversationArchive");
  return {
    ...actual,
    clearConversationArchiveConfig: jest.fn(async () => undefined),
    isConversationArchivePickerCancellation: jest.fn(() => false),
    loadConversationArchiveConfig: jest.fn(),
    pickConversationArchiveDirectory: jest.fn(),
    saveConversationArchiveConfig: jest.fn(async () => undefined),
    syncConversationArchive: jest.fn(),
  };
});

const config = {
  version: 1 as const,
  directoryName: "Archive",
  directoryUri: "content://archive",
};

function createMeta(updatedAt: string): ConversationMeta {
  return {
    id: "conversation-1",
    title: "Travel",
    createdAt: "2026-08-02T08:00:00.000Z",
    updatedAt,
    messageCount: 1,
    providers: [],
    providerModels: {},
    lastModel: null,
    lastProvider: null,
    pinned: false,
  };
}

describe("useConversationArchive", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.mocked(loadConversationArchiveConfig).mockResolvedValue(config);
    jest.mocked(syncConversationArchive).mockResolvedValue({
      config: {
        ...config,
        lastSyncedAt: "2026-08-02T10:00:00.000Z",
      },
      conversationCount: 1,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("automatically syncs after hydration and after conversation changes", async () => {
    const getConversationById = jest.fn();
    const hook = renderHook(
      ({ updatedAt }) =>
        useConversationArchive({
          enabled: true,
          activeConversationId: "conversation-1",
          conversationMetas: [createMeta(updatedAt)],
          conversationsLoaded: true,
          getConversationById,
        }),
      { initialProps: { updatedAt: "2026-08-02T08:01:00.000Z" } },
    );

    await waitFor(() => expect(hook.result.current.loaded).toBe(true));
    await act(async () => {
      jest.advanceTimersByTime(1_500);
      await Promise.resolve();
    });
    await waitFor(() =>
      expect(syncConversationArchive).toHaveBeenCalledTimes(1),
    );
    expect(syncConversationArchive).toHaveBeenLastCalledWith(
      expect.objectContaining({
        activeConversationId: "conversation-1",
        conversationMetas: [
          expect.objectContaining({
            updatedAt: "2026-08-02T08:01:00.000Z",
          }),
        ],
        getConversationById,
      }),
    );

    hook.rerender({ updatedAt: "2026-08-02T08:02:00.000Z" });
    await act(async () => {
      jest.advanceTimersByTime(1_500);
      await Promise.resolve();
    });
    await waitFor(() =>
      expect(syncConversationArchive).toHaveBeenCalledTimes(2),
    );
  });

  it("does not sync a configured archive while the feature is disabled", async () => {
    const hook = renderHook(() =>
      useConversationArchive({
        enabled: false,
        activeConversationId: "conversation-1",
        conversationMetas: [createMeta("2026-08-02T08:01:00.000Z")],
        conversationsLoaded: true,
        getConversationById: jest.fn(),
      }),
    );

    await waitFor(() => expect(hook.result.current.loaded).toBe(true));
    await act(async () => {
      jest.advanceTimersByTime(1_500);
      await hook.result.current.syncNow();
    });

    expect(syncConversationArchive).not.toHaveBeenCalled();
  });
});
