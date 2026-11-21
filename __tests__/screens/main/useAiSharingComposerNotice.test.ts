import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useAiSharingSnapshot } from "../../../src/features/settings/aiSharingPresentation";
import { translate } from "../../../src/i18n";
import { useAiSharingComposerNotice } from "../../../src/screens/main/useAiSharingComposerNotice";
import {
  getAiSharingSnapshot,
  recordAiSharingMessages,
  resolveAiSharing,
  setAiSharingPermission,
  setSystemSpeechPermission,
} from "../../../src/services/aiSharing";
import type { Conversation, Provider } from "../../../src/types";

const conversation: Conversation = {
  id: "local-demo",
  title: "Earlier chat",
  createdAt: "",
  updatedAt: "",
  messages: [
    {
      id: "earlier",
      role: "user",
      content: "Private note",
      provider: null,
      model: null,
      timestamp: "",
    },
  ],
};
const open = jest.fn();
function useNotice(provider: Provider) {
  return useAiSharingComposerNotice({
    conversation,
    council: false,
    hasImages: false,
    model: "model",
    onOpenSettings: open,
    provider,
    recipients: [{ provider }],
    sharing: useAiSharingSnapshot(),
    showToast: jest.fn(),
    sttProvider: "openai",
    t: (key, params) => translate("en", key, params),
  });
}

it("offers a new recipient only this conversation’s earlier text and waits for an explicit decision", async () => {
  await recordAiSharingMessages(conversation.id, conversation.messages, [
    "openai",
  ]);
  const { result, rerender } = renderHook(
    (provider: Provider) => useNotice(provider),
    { initialProps: "openai" as Provider },
  );
  expect(result.current.historyNotice).toBeNull();
  rerender("anthropic");
  await waitFor(() =>
    expect(result.current.historyNotice?.action).toBe(
      "Share earlier messages with Anthropic",
    ),
  );
  await act(async () => {
    result.current.historyNotice?.onPress();
  });
  const pending = getAiSharingSnapshot().pending;
  expect(pending?.request).toMatchObject({
    required: [{ provider: "anthropic", purpose: "history" }],
    shareEarlier: true,
  });
  await act(async () => {
    await resolveAiSharing(pending!.id, null);
  });
  expect(result.current.historyNotice).toBeTruthy();
  await act(async () => {
    result.current.historyNotice?.onPress();
  });
  await act(async () => {
    await resolveAiSharing(getAiSharingSnapshot().pending!.id, {
      optional: [],
    });
  });
  await waitFor(() => expect(result.current.historyNotice).toBeNull());
  rerender("gemini");
  expect(result.current.historyNotice?.action).toBe(
    "Share earlier messages with Google",
  );
});

it("keeps typed prompts usable when transcription is blocked, and links core refusal to its settings page", async () => {
  await setAiSharingPermission("openai", "transcription", false);
  const { result } = renderHook(() => useNotice("mistral"));
  expect(result.current.blockedPrompt).toBeNull();
  expect(result.current.blockedAudio?.message).toMatch(
    /OpenAI.*Voice recordings/,
  );
  await act(async () => {
    await setAiSharingPermission("mistral", "prompt", false);
  });
  expect(result.current.blockedPrompt?.message).toMatch(/Mistral/);
  result.current.blockedPrompt?.onPress();
  expect(open).toHaveBeenCalled();
  await act(async () => {
    await setAiSharingPermission("mistral", "prompt", null);
  });
  expect(result.current.blockedPrompt).toBeNull();
});

it("keeps the OS speech recovery link in sync with the decision on this installation", async () => {
  await setSystemSpeechPermission("apple", false);
  const { result } = renderHook(() =>
    useAiSharingComposerNotice({
      conversation: null,
      council: false,
      hasImages: false,
      model: "model",
      onOpenSettings: open,
      provider: "gemini",
      recipients: [{ provider: "gemini" }],
      sharing: useAiSharingSnapshot(),
      showToast: jest.fn(),
      blockedSystemSpeech: "apple",
      t: (key, params) => translate("en", key, params),
    }),
  );
  expect(result.current.blockedAudio?.message).toMatch(/Apple Speech/);
  expect(result.current.blockedPrompt).toBeNull();
  await act(async () => {
    await setSystemSpeechPermission("apple", true);
  });
  expect(result.current.blockedAudio).toBeNull();
});
