import {
  getAiSharingHistory,
  getAiSharingSnapshot,
  recordAiSharingMessages,
  resolveAiSharing,
  setAiSharingPermission,
  shareAiSharingHistory,
  subscribeAiSharing,
  type AiSharingPending,
} from "../../src/services/aiSharing";
import { runVoicePipeline } from "../../src/services/voicePipeline";
import type { RunVoicePipelineParams } from "../../src/services/voicePipeline/types";
import type {
  Message,
  MessageImageAttachment,
  Provider,
} from "../../src/types";
import {
  streamChat,
  summarizeConversationContext,
} from "../../src/services/llm";
import { transcribeAudio } from "../../src/services/whisper";
import { synthesizeSpeech } from "../../src/services/tts";
import { searchWeb } from "../../src/services/webSearch";
import { retrieveConversationKnowledge } from "../../src/services/conversationKnowledge";
import { runUlraModeDeliberation } from "../../src/services/ulraMode";

jest.mock("expo-secure-store", () => {
  const store = new Map<string, string>();
  return {
    getItemAsync: async (key: string) => store.get(key) ?? null,
    setItemAsync: async (key: string, value: string) => {
      store.set(key, value);
    },
  };
});
jest.mock("expo-crypto", () => ({ randomUUID: () => "test-installation" }));
jest.mock("expo-file-system/legacy", () => ({ deleteAsync: jest.fn() }));
jest.mock("../../src/services/debugLogCapture", () => ({
  recordDebugLogEvent: jest.fn(),
  registerDebugTurnSignal: jest.fn(),
}));
jest.mock("../../src/services/llm", () => ({
  streamChat: jest.fn(),
  summarizeConversationContext: jest.fn(),
}));
jest.mock("../../src/services/whisper", () => ({ transcribeAudio: jest.fn() }));
jest.mock("../../src/services/webSearch", () => ({ searchWeb: jest.fn() }));
jest.mock("../../src/services/conversationKnowledge", () => ({
  retrieveConversationKnowledge: jest.fn(),
}));
jest.mock("../../src/services/ulraMode", () => ({
  runUlraModeDeliberation: jest.fn(),
  getUlraModeFailureParticipants: jest.fn(),
}));
jest.mock("../../src/services/tts", () => ({
  synthesizeSpeech: jest.fn(),
  splitTextForTts: (s: string) => [s],
  PROVIDER_TTS_MAX_INPUT_CHARS: 3500,
  getProviderTtsTargetChunkChars: () => 600,
}));

function row(
  id: string,
  content: string,
  role: Message["role"] = "user",
): Message {
  return { id, content, role, model: null, provider: null, timestamp: "" };
}
const photo: MessageImageAttachment = {
  id: "photo",
  kind: "image",
  uri: "file:///private-photo.jpg",
  mimeType: "image/jpeg",
  width: 100,
  height: 100,
  byteSize: 64,
  sharedWithProviders: ["openai"],
};
const council = {
  rounds: 1,
  routes: [
    {
      provider: "openai" as const,
      model: "gpt-test",
      modeId: "gpt",
      apiKey: "test",
    },
    {
      provider: "anthropic" as const,
      model: "claude-test",
      modeId: "claude",
      apiKey: "test",
    },
  ],
};

function turn(
  id: string,
  overrides: Partial<RunVoicePipelineParams> = {},
): RunVoicePipelineParams {
  return {
    turnId: id,
    currentConversationId: id,
    transcriptionOverride: "New question",
    messages: [],
    provider: "openai",
    model: "gpt-test",
    providerApiKey: "test",
    sttLanguage: "en",
    sttMode: "native",
    ttsMode: "native",
    ttsVoice: "",
    language: "en",
    replyPlayback: "wait",
    spokenRepliesEnabled: false,
    assistantInstructions: "",
    responseLength: "normal",
    responseTone: "professional",
    callbacks: {
      onTranscription: jest.fn((text) => ({
        conversationId: id,
        message: row("user-" + id, text),
      })),
      onResponseDone: jest.fn((text) => row("reply-" + id, text, "assistant")),
      onChunk: jest.fn(),
      onAudioReady: jest.fn(),
      onSpeechTextReady: jest.fn(),
      onError: jest.fn(),
    },
    ...overrides,
  };
}

function nextSheet(): Promise<AiSharingPending> {
  const current = getAiSharingSnapshot().pending;
  if (current) return Promise.resolve(current);
  return new Promise((resolve) => {
    const stop = subscribeAiSharing(() => {
      const pending = getAiSharingSnapshot().pending;
      if (pending) {
        stop();
        resolve(pending);
      }
    });
  });
}
function chatMessages() {
  return jest.mocked(streamChat).mock.lastCall?.[0].messages;
}
async function grantChat(provider: Provider) {
  await setAiSharingPermission(provider, "prompt", true);
  await setAiSharingPermission(provider, "history", true);
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(streamChat).mockImplementation(async ({ onDone }) => {
    await onDone("Public reply.");
  });
});

it("cancels a grouped Council, image and voice action before any transfer or draft acceptance", async () => {
  const request = turn("declined", {
    transcriptionOverride: undefined,
    audioUri: "file:///capture.wav",
    sttMode: "provider",
    sttProvider: "mistral",
    sttApiKey: "test",
    attachments: [photo],
    ulraMode: council,
    webSearchMode: "on",
    webSearchProvider: "gemini",
    webSearchApiKey: "test",
    ttsMode: "provider",
    ttsProvider: "elevenlabs",
    spokenRepliesEnabled: true,
    pastConversationKnowledgeEnabled: true,
  });
  const running = runVoicePipeline(request);
  const sheet = await nextSheet();
  expect(sheet.request.council).toMatchObject({
    providers: ["openai", "anthropic"],
    synthesisProvider: "openai",
  });
  expect(sheet.request.required).toEqual(
    expect.arrayContaining([
      { provider: "mistral", purpose: "transcription" },
      { provider: "openai", purpose: "images" },
      { provider: "anthropic", purpose: "images" },
      { provider: "anthropic", purpose: "council" },
    ]),
  );
  expect(sheet.request.optional).toEqual(
    expect.arrayContaining([
      { provider: "gemini", purpose: "search" },
      { provider: "elevenlabs", purpose: "speech" },
      { provider: "anthropic", purpose: "knowledge" },
    ]),
  );
  await resolveAiSharing(sheet.id, null);
  await expect(running).resolves.toBeNull();
  for (const fn of [
    transcribeAudio,
    searchWeb,
    summarizeConversationContext,
    runUlraModeDeliberation,
    streamChat,
    synthesizeSpeech,
    retrieveConversationKnowledge,
    request.callbacks.onTranscription,
  ]) {
    expect(fn).not.toHaveBeenCalled();
  }
});

it("starts a switched provider with the new prompt, then imports only explicitly authorized visible text", async () => {
  await grantChat("openai");
  await grantChat("anthropic");
  const id = "switched";
  const earlier = {
    ...row("older", "Original provider private text", "assistant"),
    provider: "openai" as const,
    attachments: [photo],
    metadata: { providerState: { kimiReasoningContent: "Hidden reasoning" } },
  };
  await recordAiSharingMessages(id, [earlier], ["openai"]);
  const input = turn(id, {
    provider: "anthropic",
    model: "claude-test",
    messages: [earlier],
    summarizedMessageCount: 1,
    contextSummary:
      "[Conversation response provenance v1]\nSecret edited summary",
  });
  await runVoicePipeline(input);
  expect(chatMessages()?.map((message) => message.content)).toEqual([
    "New question",
  ]);
  expect(
    jest.mocked(streamChat).mock.lastCall?.[0].conversationSummary,
  ).toBeUndefined();
  expect(
    getAiSharingHistory(
      id,
      [
        row("user-" + id, "New question"),
        row("reply-" + id, "Public reply.", "assistant"),
      ],
      ["anthropic"],
    ),
  ).toHaveLength(2);
  const sharing = shareAiSharingHistory(id, [earlier], "anthropic");
  const sheet = await nextSheet();
  expect(sheet.request.shareEarlier).toBe(true);
  await resolveAiSharing(sheet.id, { optional: [] });
  await sharing;
  await runVoicePipeline(input);
  expect(chatMessages()).toEqual([
    expect.objectContaining({ content: earlier.content }),
    expect.objectContaining({ content: "New question" }),
  ]);
  expect(JSON.stringify(jest.mocked(streamChat).mock.lastCall)).not.toMatch(
    /private-photo|Hidden reasoning|Secret edited summary/,
  );
});

it("gives Council and synthesis only their common history and gives search just its approved query", async () => {
  const id = "intersection";
  const shared = { ...row("shared", "Common text"), attachments: [photo] };
  const privateRow = row("private", "OpenAI-only secret ".repeat(250));
  await recordAiSharingMessages(id, [shared], ["openai", "anthropic"]);
  await recordAiSharingMessages(id, [privateRow], ["openai"]);
  await setAiSharingPermission("openai", "knowledge", true);
  await setAiSharingPermission("anthropic", "knowledge", false);
  await setAiSharingPermission("gemini", "search", true);
  await setAiSharingPermission("gemini", "history", false);
  jest.mocked(searchWeb).mockResolvedValue(null);
  jest.mocked(runUlraModeDeliberation).mockResolvedValue({
    entries: [],
    failures: [],
    estimatedUsage: {
      kind: "reply",
      source: "estimated",
      totalTokens: 0,
      promptTokens: 0,
      completionTokens: 0,
    },
    convergenceReached: false,
    retiredParticipants: 0,
    roundsCompleted: 1,
    synthesisContract: "evidence-ledger-v1",
    synthesisContributions: 0,
    synthesisEstimatedTokens: 0,
    synthesisOmittedContributions: 0,
    synthesisPrompt: "A public draft.",
  });
  const running = runVoicePipeline(
    turn(id, {
      ulraMode: council,
      messages: [shared, privateRow],
      pastConversationKnowledgeEnabled: true,
      contextSummary:
        "[Conversation response provenance v1]\nPrivate rolling summary",
      summarizedMessageCount: 2,
      webSearchMode: "on",
      webSearchProvider: "gemini",
      webSearchApiKey: "test",
    }),
  );
  const sheet = await nextSheet();
  await resolveAiSharing(sheet.id, { optional: sheet.optional });
  await running;
  const deliberation = jest.mocked(runUlraModeDeliberation).mock.lastCall?.[0];
  expect(deliberation?.messages.map((message) => message.content)).toEqual([
    "Common text",
    "New question",
  ]);
  expect(deliberation?.messages).toEqual(chatMessages());
  expect(jest.mocked(searchWeb).mock.lastCall?.[0]).toMatchObject({
    query: "New question",
    conversationSummary: undefined,
  });
  expect(JSON.stringify([deliberation, chatMessages()])).not.toMatch(
    /OpenAI-only secret|Private rolling summary|private-photo/,
  );
  expect(retrieveConversationKnowledge).not.toHaveBeenCalled();
});

it("stops the downstream model if a chat grant is revoked during search", async () => {
  await grantChat("openai");
  await setAiSharingPermission("gemini", "search", true);
  let releaseSearch!: () => void;
  const started = new Promise<void>((ready) => {
    jest.mocked(searchWeb).mockImplementationOnce(async () => {
      ready();
      await new Promise<void>((resolve) => {
        releaseSearch = resolve;
      });
      return null;
    });
  });
  const running = runVoicePipeline(
    turn("revoke", {
      webSearchMode: "on",
      webSearchProvider: "gemini",
      webSearchApiKey: "test",
    }),
  );
  await started;
  await setAiSharingPermission("openai", "prompt", false);
  expect(jest.mocked(searchWeb).mock.lastCall?.[0].abortSignal?.aborted).toBe(
    true,
  );
  releaseSearch();
  await running;
  expect(streamChat).not.toHaveBeenCalled();
});

it("requests cloud fallback only after local speech fails and honors cancellation for all chunks", async () => {
  await grantChat("openai");
  jest
    .mocked(synthesizeSpeech)
    .mockRejectedValue(new Error("Local voice unavailable"));
  const running = runVoicePipeline(
    turn("speech-fallback", {
      spokenRepliesEnabled: true,
      ttsMode: "kokoro",
      ttsProvider: "elevenlabs",
      ttsFallbackRoutes: ["provider"],
    }),
  );
  const sheet = await nextSheet();
  expect(sheet.request.required).toEqual([
    { provider: "elevenlabs", purpose: "speech" },
  ]);
  expect(
    jest.mocked(synthesizeSpeech).mock.calls.map(([params]) => params.mode),
  ).toEqual(["kokoro"]);
  await resolveAiSharing(sheet.id, null);
  await running;
  expect(
    jest.mocked(synthesizeSpeech).mock.calls.map(([params]) => params.mode),
  ).toEqual(["kokoro"]);
});

it("limits one-time photo consent to that send and never resends an old photo with its text", async () => {
  await grantChat("mistral");
  const id = "single-photo";
  const photoRow = {
    ...row("source-photo", "My garden"),
    attachments: [photo],
  };
  const input = turn(id, {
    provider: "mistral",
    model: "mistral-test",
    attachments: [photo],
  });
  const first = runVoicePipeline(input);
  const sheet = await nextSheet();
  expect(sheet.request.imageCount).toBe(1);
  await resolveAiSharing(sheet.id, { optional: [] });
  await first;
  expect(chatMessages()?.at(-1)?.attachments).toEqual([photo]);

  await recordAiSharingMessages(id, [photoRow], ["mistral"]);
  await runVoicePipeline({
    ...input,
    attachments: undefined,
    messages: [photoRow],
  });
  expect(chatMessages()?.[0]).toEqual(
    expect.objectContaining({ content: "My garden" }),
  );
  expect(JSON.stringify(chatMessages())).not.toContain("private-photo");

  const repeat = runVoicePipeline(input);
  const next = await nextSheet();
  expect(next.missingRequired).toContainEqual({
    provider: "mistral",
    purpose: "images",
  });
  await resolveAiSharing(next.id, null);
  await repeat;
  expect(streamChat).toHaveBeenCalledTimes(2);
});

it("reuses a rolling summary only for the exact approved installation, text and recipients", async () => {
  await grantChat("openai");
  const id = "bounded-summary";
  const messages = Array.from({ length: 12 }, (_, index) =>
    row("row-" + index, (index + " visible text ").repeat(160)),
  );
  await recordAiSharingMessages(id, messages, ["openai"]);
  jest.mocked(summarizeConversationContext).mockResolvedValue({
    summary: "Summary from permitted turns.",
    usage: undefined,
  });
  const request = turn(id, { messages });
  let saved:
    | { contextSummary: string; summarizedMessageCount: number }
    | undefined;
  request.callbacks.onContextSummary = (
    contextSummary,
    summarizedMessageCount,
  ) => {
    saved = { contextSummary, summarizedMessageCount };
  };
  await runVoicePipeline(request);
  expect(saved?.contextSummary).toContain("Summary from permitted turns.");
  jest.mocked(summarizeConversationContext).mockClear();

  await runVoicePipeline({ ...request, ...saved });
  expect(summarizeConversationContext).not.toHaveBeenCalled();
  expect(jest.mocked(streamChat).mock.lastCall?.[0].conversationSummary).toBe(
    saved?.contextSummary,
  );

  const tampered = {
    ...saved,
    contextSummary:
      "[Conversation response provenance v1]\nA secret from a restored backup",
  };
  await runVoicePipeline({ ...request, ...tampered });
  expect(summarizeConversationContext).toHaveBeenCalledWith(
    expect.objectContaining({ existingSummary: "" }),
  );
  expect(JSON.stringify(jest.mocked(streamChat).mock.lastCall)).not.toContain(
    "secret from a restored backup",
  );
});

it("offers a title only to the selected final provider on its first eligible Council turn", async () => {
  const options = {
    provider: "mistral" as const,
    model: "mistral-test",
    ulraMode: council,
  };
  for (const eligible of [true, false]) {
    const running = runVoicePipeline(
      turn("title-offer", { ...options, autoTitleEligible: eligible }),
    );
    const sheet = await nextSheet();
    expect(
      sheet.request.optional?.filter((need) => need.purpose === "titles"),
    ).toEqual(eligible ? [{ provider: "mistral", purpose: "titles" }] : []);
    await resolveAiSharing(sheet.id, null);
    await running;
  }
});
