import { act, renderHook } from "@testing-library/react-native";

import { useImagePromptSubmission } from "../../../src/screens/main/useImagePromptSubmission";
import type { TranslateFn } from "../../../src/screens/main/shared";
import type { MessageImageAttachment } from "../../../src/types";
import { markConversationSummaryProvenance } from "../../../src/services/conversationContext";

const attachment: MessageImageAttachment = {
  id: "image-1",
  kind: "image",
  uri: "file:///message-images/image-1.jpg",
  mimeType: "image/jpeg",
  width: 1200,
  height: 800,
  byteSize: 1000,
  sharedWithProviders: [],
};

const t = ((
  key: string,
  params?: Record<string, string | number | undefined>,
) => (params ? `${key}:${JSON.stringify(params)}` : key)) as TranslateFn;

describe("useImagePromptSubmission", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("requires consent before sending a new image to multiple providers", async () => {
    const runVoiceCapture = jest.fn(async () => undefined);
    const { result } = renderHook(() =>
      useImagePromptSubmission({
        activeConversation: null,
        imagesEnabled: true,
        imageRoutes: [
          { provider: "openai", model: "gpt-5.5-2026-04-23" },
          { provider: "anthropic", model: "claude-sonnet-5" },
        ],
        onAddImage: jest.fn(),
        pendingAttachments: [attachment],
        runVoiceCapture,
        showToast: jest.fn(),
        t,
        updateMessage: jest.fn(() => null),
      }),
    );

    let submission!: Promise<void>;
    act(() => {
      submission = result.current.handleVoiceCaptureDone({
        attachments: [attachment],
        transcriptionOverride: "What is this?",
      });
    });
    expect(result.current.consent?.title).toBe("imageProviderConsentTitle");
    await act(async () => {
      result.current.confirmConsent();
      await submission;
    });

    expect(runVoiceCapture).toHaveBeenCalledWith(
      expect.objectContaining({
        attachments: [
          expect.objectContaining({
            sharedWithProviders: ["openai", "anthropic"],
          }),
        ],
      }),
    );
  });

  it("adds pending images to a recorded voice prompt", async () => {
    const runVoiceCapture = jest.fn(async () => undefined);
    const { result } = renderHook(() =>
      useImagePromptSubmission({
        activeConversation: null,
        imagesEnabled: true,
        imageRoutes: [{ provider: "openai", model: "gpt-5.5-2026-04-23" }],
        onAddImage: jest.fn(),
        pendingAttachments: [attachment],
        runVoiceCapture,
        showToast: jest.fn(),
        t,
        updateMessage: jest.fn(() => null),
      }),
    );

    await act(async () => {
      await result.current.handleRecordedVoiceCaptureDone({
        audioUri: "file:///capture.wav",
      });
    });

    expect(runVoiceCapture).toHaveBeenCalledWith(
      expect.objectContaining({
        attachments: [
          expect.objectContaining({
            id: attachment.id,
            sharedWithProviders: ["openai"],
          }),
        ],
        audioUri: "file:///capture.wav",
      }),
    );
  });

  it("authorizes images from an explicit fork instead of stale active history", async () => {
    const runVoiceCapture = jest.fn(async () => undefined);
    const updateMessage = jest.fn(() => null);
    const forkContextMessage = {
      id: "fork-context",
      role: "user" as const,
      content: "Earlier image",
      attachments: [attachment],
      model: null,
      provider: null,
      timestamp: "2026-08-04T08:00:00.000Z",
    };
    const forkPromptMessage = {
      id: "fork-prompt",
      role: "user" as const,
      content: "Corrected question",
      editedAt: "2026-08-04T08:02:00.000Z",
      model: null,
      provider: null,
      timestamp: "2026-08-04T08:01:00.000Z",
    };
    const forkConversation = {
      id: "fork-conversation",
      title: "Corrected question",
      createdAt: "2026-08-04T08:02:00.000Z",
      updatedAt: "2026-08-04T08:02:00.000Z",
      messages: [forkContextMessage, forkPromptMessage],
    };
    const { result } = renderHook(() =>
      useImagePromptSubmission({
        activeConversation: {
          id: "stale-conversation",
          title: "Stale",
          createdAt: "2026-08-04T07:00:00.000Z",
          updatedAt: "2026-08-04T07:00:00.000Z",
          messages: [],
        },
        imagesEnabled: true,
        imageRoutes: [{ provider: "openai", model: "gpt-5.5-2026-04-23" }],
        onAddImage: jest.fn(),
        pendingAttachments: [],
        runVoiceCapture,
        showToast: jest.fn(),
        t,
        updateMessage,
      }),
    );

    let submission!: Promise<void>;
    act(() => {
      submission = result.current.handleVoiceCaptureDone({
        conversationOverride: forkConversation,
        existingUserMessageId: forkPromptMessage.id,
        messagesOverride: [forkContextMessage],
        transcriptionOverride: forkPromptMessage.content,
      });
    });
    expect(result.current.consent).not.toBeNull();
    await act(async () => {
      result.current.confirmConsent();
      await submission;
    });

    expect(updateMessage).toHaveBeenCalledWith(
      "fork-context",
      expect.any(Function),
    );
    expect(runVoiceCapture).toHaveBeenCalledWith(
      expect.objectContaining({
        conversationOverride: forkConversation,
        messagesOverride: [
          expect.objectContaining({
            id: "fork-context",
            attachments: [
              expect.objectContaining({ sharedWithProviders: ["openai"] }),
            ],
          }),
        ],
      }),
    );
  });

  it("blocks image submission for a text-only route", () => {
    const showToast = jest.fn();
    const onAddImage = jest.fn();
    const { result } = renderHook(() =>
      useImagePromptSubmission({
        activeConversation: null,
        imagesEnabled: true,
        imageRoutes: [{ provider: "deepseek", model: "deepseek-v4-flash" }],
        onAddImage,
        pendingAttachments: [attachment],
        runVoiceCapture: jest.fn(async () => undefined),
        showToast,
        t,
        updateMessage: jest.fn(() => null),
      }),
    );

    act(() => result.current.handleAddImage());

    expect(result.current.imageInputBlockMessage).toContain(
      "imageInputUnsupported",
    );
    expect(showToast).toHaveBeenCalledWith(
      expect.stringContaining("imageInputUnsupported"),
      undefined,
      "danger",
    );
    expect(onAddImage).not.toHaveBeenCalled();
  });

  it("does not block a text-only route for images outside the active context window", () => {
    const { result } = renderHook(() =>
      useImagePromptSubmission({
        activeConversation: {
          id: "conversation-1",
          title: "Old image",
          createdAt: "2026-08-02T08:00:00.000Z",
          updatedAt: "2026-08-02T08:01:00.000Z",
          contextSummary: markConversationSummaryProvenance(
            "The user previously shared a photo.",
          ),
          summarizedMessageCount: 1,
          messages: [
            {
              id: "old-image-message",
              role: "user",
              content: "Remember this",
              attachments: [attachment],
              model: null,
              provider: null,
              timestamp: "2026-08-02T08:00:00.000Z",
            },
          ],
        },
        imagesEnabled: true,
        imageRoutes: [{ provider: "deepseek", model: "deepseek-v4-flash" }],
        onAddImage: jest.fn(),
        pendingAttachments: [],
        runVoiceCapture: jest.fn(async () => undefined),
        showToast: jest.fn(),
        t,
        updateMessage: jest.fn(() => null),
      }),
    );

    expect(result.current.imageInputBlockMessage).toBeNull();
  });

  it("does not resend history images after Premium image access is disabled", async () => {
    const runVoiceCapture = jest.fn(async () => undefined);
    const updateMessage = jest.fn(() => null);
    const { result } = renderHook(() =>
      useImagePromptSubmission({
        activeConversation: {
          id: "conversation-1",
          title: "Premium image",
          createdAt: "2026-08-02T08:00:00.000Z",
          updatedAt: "2026-08-02T08:01:00.000Z",
          contextSummary: null,
          summarizedMessageCount: 0,
          messages: [
            {
              id: "image-message",
              role: "user",
              content: "Remember this",
              attachments: [attachment],
              model: null,
              provider: null,
              timestamp: "2026-08-02T08:00:00.000Z",
            },
          ],
        },
        imagesEnabled: false,
        imageRoutes: [{ provider: "deepseek", model: "deepseek-v4-flash" }],
        onAddImage: jest.fn(),
        pendingAttachments: [],
        runVoiceCapture,
        showToast: jest.fn(),
        t,
        updateMessage,
      }),
    );

    await act(async () => {
      await result.current.handleVoiceCaptureDone({
        transcriptionOverride: "Continue without the image",
      });
    });

    expect(result.current.imageInputBlockMessage).toBeNull();
    expect(runVoiceCapture).toHaveBeenCalledWith({
      transcriptionOverride: "Continue without the image",
    });
    expect(updateMessage).not.toHaveBeenCalled();
  });
});
