import { act, renderHook } from "@testing-library/react-native";

import { useImagePromptSubmission } from "../../../src/screens/main/useImagePromptSubmission";
import type { TranslateFn } from "../../../src/screens/main/shared";
import type { MessageImageAttachment } from "../../../src/types";

const photo: MessageImageAttachment = {
  id: "photo",
  kind: "image",
  uri: "file:///message-images/photo.jpg",
  mimeType: "image/jpeg",
  width: 1200,
  height: 800,
  byteSize: 1000,
  sharedWithProviders: [],
};
const t: TranslateFn = (key) => key;
function setup(
  overrides: Partial<Parameters<typeof useImagePromptSubmission>[0]> = {},
) {
  const props = {
    imageRoutes: [{ provider: "openai" as const, model: "gpt-5.5-2026-04-23" }],
    onAddImage: jest.fn(),
    pendingAttachments: [photo],
    runVoiceCapture: jest.fn(async () => undefined),
    showToast: jest.fn(),
    t,
    ...overrides,
  };
  return { props, ...renderHook(() => useImagePromptSubmission(props)) };
}

it("passes active photos unstamped into the consent-gated pipeline for every Council recipient", async () => {
  const { props, result } = setup({
    imageRoutes: [
      { provider: "openai", model: "gpt-5.5-2026-04-23" },
      { provider: "anthropic", model: "claude-sonnet-5" },
    ],
  });
  await act(async () => {
    await result.current.handleRecordedVoiceCaptureDone({
      audioUri: "file:///capture.wav",
    });
  });
  expect(props.runVoiceCapture).toHaveBeenCalledWith({
    attachments: [photo],
    audioUri: "file:///capture.wav",
  });
  expect(photo.sharedWithProviders).toEqual([]);
});

it("keeps a text-only route available for a conversation with old photos", async () => {
  const { props, result } = setup({
    imageRoutes: [{ provider: "deepseek", model: "deepseek-v4-pro" }],
    pendingAttachments: [],
  });
  expect(result.current.imageInputBlockMessage).toBeNull();
  const request = {
    transcriptionOverride: "Continue with text",
    messagesOverride: [
      {
        id: "older",
        role: "user" as const,
        content: "Earlier",
        model: null,
        provider: null,
        timestamp: "2026-08-02T08:00:00Z",
        attachments: [photo],
      },
    ],
  };
  await act(async () => result.current.handleVoiceCaptureDone(request));
  expect(props.runVoiceCapture).toHaveBeenCalledWith(request);
});

it("blocks picking and explicit retries with photos for a text-only model", async () => {
  const { props, result } = setup({
    imageRoutes: [{ provider: "deepseek", model: "deepseek-v4-pro" }],
  });
  expect(result.current.imageInputBlockMessage).toBe("imageInputUnsupported");
  act(() => result.current.handleAddImage());
  await act(async () =>
    result.current.handleVoiceCaptureDone({
      existingUserMessageId: "older",
      transcriptionOverride: "Retry",
      attachments: [photo],
    }),
  );
  expect(props.showToast).toHaveBeenCalledWith(
    "imageInputUnsupported",
    undefined,
    "danger",
  );
  expect(props.onAddImage).not.toHaveBeenCalled();
  expect(props.runVoiceCapture).not.toHaveBeenCalled();
});

it("keeps photo selection local while enforcing a blocked recipient on the attempted send", async () => {
  const { props, result } = setup({
    imageSharingBlockedMessage: "Open AI sharing",
  });
  act(() => result.current.handleAddImage());
  expect(props.onAddImage).toHaveBeenCalledTimes(1);
  await act(async () =>
    result.current.handleVoiceCaptureDone({
      attachments: [photo],
      transcriptionOverride: "Retry",
    }),
  );
  expect(props.showToast).toHaveBeenCalledWith(
    "Open AI sharing",
    undefined,
    "danger",
  );
  expect(props.runVoiceCapture).not.toHaveBeenCalled();
});
