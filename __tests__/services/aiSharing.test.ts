import type { Message } from "../../src/types";
import type { AiSharingNeed } from "../../src/services/aiSharing/model";

const mockLocal = new Map<string, string>();
const mockDevice = new Map<string, string>();
const mockInstallationFiles = new Map<string, string>();
let mockSequence = 0;
let mockWriteFails = false;
let mockRemovalFails = false;
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: async (key: string) => mockLocal.get(key) ?? null,
  setItem: async (key: string, value: string) => {
    if (mockWriteFails) throw new Error("storage full");
    mockLocal.set(key, value);
  },
  removeItem: async (key: string) => {
    if (mockRemovalFails) throw new Error("privacy storage unavailable");
    mockLocal.delete(key);
  },
}));
jest.mock("expo-secure-store", () => ({
  deleteItemAsync: async (key: string) => {
    mockDevice.delete(key);
  },
  getItemAsync: async (key: string) => mockDevice.get(key) ?? null,
  setItemAsync: async (key: string, value: string) => {
    mockDevice.set(key, value);
  },
}));
jest.mock("expo-crypto", () => ({
  randomUUID: () => "installation-" + ++mockSequence,
}));
jest.mock("@dr.pogodin/react-native-fs", () => ({
  LibraryDirectoryPath: "/test/Library",
  exists: async (path: string) => mockInstallationFiles.has(path),
  mkdir: async () => {},
  readFile: async (path: string) => mockInstallationFiles.get(path),
  writeFile: async (path: string, data: string) => {
    mockInstallationFiles.set(path, data);
  },
}));

let sharing: typeof import("../../src/services/aiSharing");
const prompt: AiSharingNeed = { provider: "openai", purpose: "prompt" };
const history: AiSharingNeed = { provider: "openai", purpose: "history" };
const photo: AiSharingNeed = { provider: "openai", purpose: "images" };
const msg: Message = {
  id: "one",
  role: "user",
  content: "Private prompt",
  provider: null,
  model: null,
  timestamp: "",
};
const next = () => new Promise<void>((resolve) => setImmediate(resolve));
async function restart() {
  jest.resetModules();
  sharing = require("../../src/services/aiSharing");
  await sharing.hydrateAiSharing();
}
async function respond(
  optional: AiSharingNeed[] = [],
  rememberImages: ("openai" | "anthropic")[] = [],
) {
  await next();
  const sheet = sharing.getAiSharingSnapshot().pending;
  expect(sheet).toBeTruthy();
  await sharing.resolveAiSharing(sheet!.id, { optional, rememberImages });
}
beforeEach(async () => {
  mockLocal.clear();
  mockDevice.clear();
  mockInstallationFiles.clear();
  mockWriteFails = false;
  mockRemovalFails = false;
  await restart();
});

it("remembers affirmative uses and suppresses repeat optional prompts without blocking a later explicit import", async () => {
  const request = { required: [prompt], optional: [history] };
  const first = sharing.requestAiSharing(request);
  await respond();
  expect((await first)?.allows("openai", "history")).toBe(false);
  await restart();
  expect(
    (await sharing.requestAiSharing(request))?.allows("openai", "prompt"),
  ).toBe(true);
  const importHistory = sharing.shareAiSharingHistory("chat", [msg], "openai");
  await respond();
  expect(await importHistory).toBe(true);
  expect(sharing.getAiSharingHistory("chat", [msg], ["openai"])).toEqual([msg]);
});

it("keeps Send once inside its dispatch and each recipient's remembered photo choice independent", async () => {
  const required: AiSharingNeed[] = [
    photo,
    { provider: "anthropic", purpose: "images" },
  ];
  const request = { required, imageCount: 1 };
  const first = sharing.requestAiSharing(request);
  await respond([], ["anthropic"]);
  expect((await first)?.allows("openai", "images")).toBe(true);
  const second = sharing.requestAiSharing(request);
  await next();
  const sheet = sharing.getAiSharingSnapshot().pending!;
  expect(sheet.missingRequired).toEqual([photo]);
  await sharing.resolveAiSharing(sheet.id, null);
  expect(await second).toBeNull();
  expect(sharing.hasAiSharingPermission("anthropic", "images")).toBe(true);
});

it("never restores decisions from a different installation, even when either half was restored", async () => {
  await sharing.setAiSharingPermission("openai", "history", true);
  await sharing.recordAiSharingMessages("chat", [msg], ["openai"]);
  mockDevice.clear();
  await restart();
  await sharing.loadAiSharingHistory("chat");
  expect(sharing.hasAiSharingPermission("openai", "history")).toBe(false);
  expect(sharing.hasUnsharedAiHistory("chat", [msg], "openai")).toBe(true);
  await sharing.setAiSharingPermission("openai", "prompt", true);
  mockLocal.clear();
  await restart();
  expect(sharing.hasAiSharingPermission("openai", "prompt")).toBe(false);
});

it("asks again after an iOS restore onto the same device with retained Keychain and backed-up app preferences", async () => {
  await sharing.setAiSharingPermission("openai", "prompt", true);
  expect(mockInstallationFiles.size).toBe(1);
  mockInstallationFiles.clear();
  await restart();
  expect(sharing.hasAiSharingPermission("openai", "prompt")).toBe(false);
});

it("removes images, remote continuation data, and edited text from shared history", async () => {
  const full = {
    ...msg,
    attachments: [],
    metadata: { citations: ["private"] },
  } as Message;
  await sharing.setAiSharingPermission("openai", "history", true);
  await sharing.recordAiSharingMessages("chat", [full], ["openai"]);
  expect([...mockLocal.values()].join("")).not.toContain(msg.content);
  expect(sharing.getAiSharingHistory("chat", [full], ["openai"])).toEqual([
    msg,
  ]);
  expect(
    sharing.getAiSharingHistory(
      "chat",
      [{ ...full, content: "Changed" }],
      ["openai"],
    ),
  ).toEqual([]);
  expect(sharing.getAiSharingHistory("other", [full], ["openai"])).toEqual([]);
  await sharing.forgetAiSharingHistory("chat");
  await restart();
  await sharing.loadAiSharingHistory("chat");
  expect(sharing.hasUnsharedAiHistory("chat", [full], "openai")).toBe(true);
});

it("fails closed on storage failure, abort, explicit denial and live revocation", async () => {
  const required = [prompt];
  const failed = sharing.requestAiSharing({ required });
  await next();
  mockWriteFails = true;
  await respond();
  expect(await failed).toBeNull();
  mockWriteFails = false;
  const controller = new AbortController();
  const cancelled = sharing.requestAiSharing({ required }, controller.signal);
  await next();
  controller.abort();
  expect(await cancelled).toBeNull();
  expect(sharing.getAiSharingSnapshot().pending).toBeNull();
  await sharing.setAiSharingPermission("openai", "prompt", true);
  const accepted = await sharing.requestAiSharing({ required });
  await sharing.setAiSharingPermission("openai", "prompt", false);
  expect(await sharing.requestAiSharing({ required })).toBeNull();
  await sharing.setAiSharingPermission("openai", "prompt", true);
  expect(accepted?.allows("openai", "prompt")).toBe(false);
});

it("blocks new sends immediately when persisting a withdrawal fails and asks again after restart", async () => {
  await sharing.setAiSharingPermission("openai", "prompt", true);
  mockWriteFails = true;
  const withdrawal = sharing.setAiSharingPermission("openai", "prompt", false);
  expect(sharing.hasAiSharingPermission("openai", "prompt")).toBe(false);
  await expect(withdrawal).rejects.toThrow("storage full");
  expect(await sharing.requestAiSharing({ required: [prompt] })).toBeNull();
  mockWriteFails = false;
  await restart();
  expect(sharing.hasAiSharingPermission("openai", "prompt")).toBe(false);
});

it("reevaluates queued work and never applies an old sheet to the next request", async () => {
  const first = sharing.requestAiSharing({ required: [prompt] });
  const second = sharing.requestAiSharing({ required: [photo], imageCount: 1 });
  await next();
  const seen = sharing.getAiSharingSnapshot().pending!.id;
  await sharing.resolveAiSharing(seen, { optional: [] });
  await first;
  const image = sharing.getAiSharingSnapshot().pending!;
  expect(image.id).not.toBe(seen);
  await sharing.resolveAiSharing(seen, { optional: [] });
  expect(sharing.getAiSharingSnapshot().pending).toBe(image);
  await sharing.resolveAiSharing(image.id, null);
  expect(await second).toBeNull();
});

it("checks the Council group and final provider again when the roles change", async () => {
  const required: AiSharingNeed[] = [
    { provider: "openai", purpose: "council" },
    { provider: "anthropic", purpose: "council" },
  ];
  const council = {
    providers: ["openai", "anthropic"] as const,
    synthesisProvider: "openai" as const,
  };
  const first = sharing.requestAiSharing({ required, council });
  await respond();
  expect(await first).toBeTruthy();
  expect(await sharing.requestAiSharing({ required, council })).toBeTruthy();
  const changed = sharing.requestAiSharing({
    required,
    council: { ...council, synthesisProvider: "anthropic" },
  });
  await next();
  expect(sharing.getAiSharingSnapshot().pending?.missingRequired).toEqual([]);
  await respond();
  expect(await changed).toBeTruthy();
  await sharing.setAiSharingPermission("anthropic", "council", false);
  expect(await sharing.requestAiSharing({ required, council })).toBeNull();
});

it("binds OpenRouter decisions and exact-text receipts to the actual inference host", async () => {
  const required: AiSharingNeed[] = [
    { provider: "openrouter", purpose: "prompt" },
    { provider: "openrouter", purpose: "history" },
  ];
  const model = "openai/gpt-6",
    secondModel = "anthropic/claude";
  const first = sharing.requestAiSharing({
    required,
    openRouterModels: [model],
  });
  await respond();
  await first;
  await sharing.recordAiSharingMessages("chat", [msg], ["openrouter"], model);
  expect(
    sharing.getAiSharingHistory("chat", [msg], ["openrouter"], model),
  ).toEqual([msg]);
  expect(
    sharing.getAiSharingHistory("chat", [msg], ["openrouter"], secondModel),
  ).toEqual([]);
  const nextHost = sharing.requestAiSharing({
    required,
    openRouterModels: [secondModel],
  });
  await respond();
  await nextHost;
  expect(
    sharing.getAiSharingHistory(
      "chat",
      [msg],
      ["openrouter"],
      [model, secondModel],
    ),
  ).toEqual([]);
  expect(
    await sharing.requestAiSharing({
      required,
      openRouterModels: ["unrecognized/custom"],
    }),
  ).toBeNull();
});

it("asks for a changed OS recognition service and immediately invalidates its prior recording permission", async () => {
  const service = "android.com.google.android.tts";
  const first = sharing.requestAiSharing({
    required: [],
    systemSpeech: service,
  });
  await respond();
  const permission = await first;
  expect(permission?.allowsSystemSpeech?.(service)).toBe(true);
  expect(permission?.allowsSystemSpeech?.("apple")).toBe(false);
  await sharing.setSystemSpeechPermission(service, false);
  expect(permission?.allowsSystemSpeech?.(service)).toBe(false);
  await sharing.setSystemSpeechPermission(service, null);
  const other = sharing.requestAiSharing({
    required: [],
    systemSpeech: "apple",
  });
  await next();
  expect(sharing.getAiSharingSnapshot().pending?.request.systemSpeech).toBe(
    "apple",
  );
  await respond();
  await other;
});

it("preserves only entitled source text and exact inference hosts in a committed branch", async () => {
  const host = "openai/gpt-6";
  const otherHost = "anthropic/claude";
  const request = sharing.requestAiSharing({
    required: [
      { provider: "openrouter", purpose: "history" },
      { provider: "openai", purpose: "history" },
      { provider: "anthropic", purpose: "history" },
    ],
    openRouterModels: [host, otherHost],
  });
  await respond();
  await request;
  const attachment = {
    id: "photo",
    kind: "image" as const,
    uri: "file:///local.jpg",
    mimeType: "image/jpeg" as const,
    byteSize: 1,
    width: 1,
    height: 1,
    sharedWithProviders: [],
  };
  const sourceRows = [
    msg,
    { ...msg, id: "two" },
    { ...msg, id: "three" },
    { ...msg, id: "unknown" },
  ];
  await sharing.recordAiSharingMessages(
    "parent",
    sourceRows.slice(0, 3),
    ["openai", "openrouter"],
    host,
  );
  const source = { id: "parent", messages: sourceRows };
  const cloned = {
    id: "branch",
    messages: [
      { ...msg, id: "clone-one", attachments: [attachment] },
      { ...msg, id: "clone-two", content: "Edited" },
      { ...msg, id: "clone-three", role: "assistant" as const },
      { ...msg, id: "clone-unknown" },
    ],
    branch: {
      parentConversationId: "parent",
      rootConversationId: "parent",
      parentMessageId: "unknown",
      branchMessageId: "clone-unknown",
      kind: "alternative-response" as const,
      createdAt: "",
    },
  };
  await sharing.inheritAiSharingHistory(source, cloned);
  const permitted = [{ ...msg, id: "clone-one" }];
  expect(
    sharing.getAiSharingHistory("branch", cloned.messages, ["openai"]),
  ).toEqual(permitted);
  expect(
    sharing.getAiSharingHistory(
      "branch",
      cloned.messages,
      ["openrouter"],
      host,
    ),
  ).toEqual(permitted);
  expect(
    sharing.getAiSharingHistory("branch", cloned.messages, ["anthropic"]),
  ).toEqual([]);
  expect(
    sharing.getAiSharingHistory(
      "branch",
      cloned.messages,
      ["openrouter"],
      otherHost,
    ),
  ).toEqual([]);
  await sharing.setAiSharingPermission("openai", "history", false);
  await sharing.inheritAiSharingHistory(source, {
    ...cloned,
    id: "next-branch",
  });
  await sharing.setAiSharingPermission("openai", "history", true);
  expect(
    sharing.getAiSharingHistory("next-branch", cloned.messages, ["openai"]),
  ).toEqual([]);
});

it("does not send a restored or edited message attribution under an earlier text receipt", async () => {
  await sharing.setAiSharingPermission("openai", "history", true);
  const reply = {
    ...msg,
    role: "assistant" as const,
    model: "original",
    provider: "openai" as const,
  };
  await sharing.recordAiSharingMessages("id", [reply], ["openai"]);
  const restored = { ...reply, provider: "anthropic" as const };
  const edited = { ...reply, model: "changed" };
  expect(
    sharing.getAiSharingHistory("id", [restored, edited, reply], ["openai"]),
  ).toEqual([reply]);
});

it("limits a Council title grant to the synthesis host, including when multiple OpenRouter hosts participate", async () => {
  const synthesisModel = "openai/gpt-6";
  const otherModel = "anthropic/claude";
  const title: AiSharingNeed = { provider: "openrouter", purpose: "titles" };
  const accepted = sharing.requestAiSharing({
    required: [
      { provider: "openrouter", purpose: "prompt" },
      { provider: "openrouter", purpose: "council" },
    ],
    optional: [title],
    council: {
      providers: ["openrouter"],
      synthesisProvider: "openrouter",
      synthesisModel,
    },
    openRouterModels: [synthesisModel, otherModel],
  });
  await respond([title]);
  await accepted;
  expect(
    sharing.hasAiSharingPermission("openrouter", "titles", synthesisModel),
  ).toBe(true);
  expect(
    sharing.hasAiSharingPermission("openrouter", "titles", otherModel),
  ).toBe(false);
});

it("forgets cached text immediately when deleting its durable privacy receipts fails", async () => {
  await sharing.setAiSharingPermission("openai", "history", true);
  await sharing.recordAiSharingMessages("removed", [msg], ["openai"]);
  mockRemovalFails = true;
  await expect(sharing.forgetAiSharingHistory("removed")).rejects.toThrow(
    "privacy storage unavailable",
  );
  expect(sharing.getAiSharingHistory("removed", [msg], ["openai"])).toEqual([]);
});
