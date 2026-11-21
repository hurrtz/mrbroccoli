import { act, renderHook } from "@testing-library/react-native";
import { hasAiSharingPermission } from "../../../src/services/aiSharing";
jest.mock("../../../src/services/aiSharing", () => require("../../test-utils/aiSharingAllowed").createAllowedAiSharingMock());
jest.mock("../../../src/services/aiSharing/titles", () => ({
  authorizeConversationTitle: jest.fn(async (chat) => ({
    authorization: { allows: () => true }, messages: chat.messages, usesHistory: true,
  })),
}));

import { generateConversationTitle } from "../../../src/services/llm";
import { useConversationTitleGenerator } from "../../../src/screens/main/useConversationTitleGenerator";
import type { Conversation } from "../../../src/types";

jest.mock("../../../src/services/llm", () => ({
  generateConversationTitle: jest.fn(),
}));

jest.mock("../../../src/services/debugLogCapture", () => ({
  recordDebugLogEvent: jest.fn(),
}));

const mockGenerateConversationTitle = jest.mocked(generateConversationTitle);

const conversation: Conversation = {
  id: "conversation-1",
  title: "Old title",
  createdAt: "2026-07-22T10:00:00.000Z",
  updatedAt: "2026-07-22T10:01:00.000Z",
  messages: [
    {
      id: "message-1",
      role: "user",
      content: "Investigate the provider integrations.",
      model: null,
      provider: null,
      timestamp: "2026-07-22T10:00:00.000Z",
    },
  ],
};

function createParams(activeConversation: Conversation | null = conversation) {
  return {
    activeConversation,
    apiKey: "sk-test-key",
    language: "en" as const,
    model: "gpt-5.4-2026-03-05",
    modelEffort: "low",
    provider: "openai" as const,
    providerReady: true,
    getConversationById: jest.fn(async (id: string) =>
      id === activeConversation?.id ? activeConversation : null,
    ),
    renameConversation: jest.fn(async () => undefined),
    showToast: jest.fn(),
    t: (key: string) => key,
  };
}

describe("useConversationTitleGenerator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(hasAiSharingPermission).mockReturnValue(true);
  });

  it("consumes the first naming opportunity without sending text when titles were declined", async () => {
    jest.mocked(hasAiSharingPermission).mockImplementation((_provider, purpose) => purpose !== "titles");
    const claimFirstPrompt = jest.fn(async () => "Initial title");
    const { result } = renderHook(() => useConversationTitleGenerator({ ...createParams(), claimFirstPrompt }));
    await act(() => result.current.handlePromptSubmitted(conversation.id, conversation.messages[0]));
    expect(claimFirstPrompt).toHaveBeenCalledWith(conversation.id);
    expect(mockGenerateConversationTitle).not.toHaveBeenCalled();
  });

  it("names a new session only once using its initial prompt and original title", async () => {
    const params = createParams();
    const claimFirstPrompt = jest.fn<Promise<string | null>, [string]>()
      .mockResolvedValueOnce("First title").mockResolvedValue(null);
    mockGenerateConversationTitle.mockResolvedValueOnce("Generated title");
    const { result } = renderHook(() => useConversationTitleGenerator({ ...params, claimFirstPrompt }));
    const prompt = conversation.messages[0];
    await act(async () => {
      await Promise.all([result.current.handlePromptSubmitted(conversation.id, prompt),
        result.current.handlePromptSubmitted(conversation.id, prompt)]);
      await result.current.handlePromptSubmitted(conversation.id, prompt);
    });
    expect(mockGenerateConversationTitle).toHaveBeenCalledTimes(1);
    expect(mockGenerateConversationTitle).toHaveBeenCalledWith(expect.objectContaining({
      messages: [{ ...prompt, attachments: undefined }],
    }));
    expect(params.renameConversation).toHaveBeenCalledWith(conversation.id, "Generated title", "First title");
    expect(params.showToast).not.toHaveBeenCalled();
  });

  it("consumes the initial prompt while opted out and keeps naming available manually", async () => {
    const params = createParams();
    const claimFirstPrompt = jest.fn(async () => conversation.title);
    const { result } = renderHook(() => useConversationTitleGenerator({
      ...params, claimFirstPrompt, autoNameConversations: false,
    }));
    await act(async () => { await result.current.handlePromptSubmitted(conversation.id, conversation.messages[0]); });
    expect(claimFirstPrompt).toHaveBeenCalledWith(conversation.id);
    expect(mockGenerateConversationTitle).not.toHaveBeenCalled();
    expect(result.current.canGenerateTitle).toBe(true);
  });

  it("renames the active conversation with the selected route", async () => {
    const params = createParams();
    mockGenerateConversationTitle.mockResolvedValueOnce(
      "Provider integration audit",
    );
    const { result } = renderHook(() => useConversationTitleGenerator(params));

    expect(result.current.canGenerateTitle).toBe(true);

    await act(async () => {
      await result.current.handleGenerateTitle();
    });

    expect(mockGenerateConversationTitle).toHaveBeenCalledWith(
      expect.objectContaining({
        apiKey: "sk-test-key",
        messages: conversation.messages,
        model: "gpt-5.4-2026-03-05",
        modelEffort: "low",
        provider: "openai",
        abortSignal: expect.any(Object),
      }),
    );
    expect(params.renameConversation).toHaveBeenCalledWith(
      "conversation-1",
      "Provider integration audit",
    );
    expect(params.showToast).toHaveBeenCalledWith(
      "conversationTitleGenerated",
      undefined,
      "success",
    );
  });

  it("does not rename a different conversation when a request finishes late", async () => {
    let resolveTitle: (title: string) => void = () => undefined;
    mockGenerateConversationTitle.mockImplementationOnce(
      () =>
        new Promise<string>((resolve) => {
          resolveTitle = resolve;
        }),
    );
    const params = createParams();
    const { result, rerender } = renderHook(
      ({ activeConversation }) =>
        useConversationTitleGenerator({ ...params, activeConversation }),
      {
        initialProps: {
          activeConversation: conversation as Conversation | null,
        },
      },
    );

    await act(async () => {
      void result.current.handleGenerateTitle();
      await Promise.resolve();
    });
    rerender({
      activeConversation: {
        ...conversation,
        id: "conversation-2",
      },
    });

    await act(async () => {
      resolveTitle("Late title");
      await Promise.resolve();
    });

    expect(params.renameConversation).not.toHaveBeenCalled();
  });

  it("reports provider failures without changing the saved title", async () => {
    const params = createParams();
    mockGenerateConversationTitle.mockRejectedValueOnce(
      new Error("Provider unavailable"),
    );
    const { result } = renderHook(() => useConversationTitleGenerator(params));

    await act(async () => {
      await result.current.handleGenerateTitle();
    });

    expect(params.renameConversation).not.toHaveBeenCalled();
    expect(params.showToast).toHaveBeenCalledWith(
      "conversationTitleGenerationFailed",
      undefined,
      "danger",
    );
  });

  it("can name a non-active conversation from the sessions drawer", async () => {
    const drawerConversation = {
      ...conversation,
      id: "conversation-2",
      title: "Another title",
    };
    const params = createParams();
    params.getConversationById.mockResolvedValueOnce(drawerConversation);
    mockGenerateConversationTitle.mockResolvedValueOnce("Drawer title");
    const { result } = renderHook(() => useConversationTitleGenerator(params));

    await act(async () => {
      await result.current.handleGenerateTitleForConversation(
        drawerConversation.id,
      );
    });

    expect(params.getConversationById).toHaveBeenCalledWith(
      drawerConversation.id,
    );
    expect(params.renameConversation).toHaveBeenCalledWith(
      drawerConversation.id,
      "Drawer title",
    );
  });
});
