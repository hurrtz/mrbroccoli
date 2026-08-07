import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";
import { NativeModules } from "react-native";

import { APP_LANGUAGES } from "../../src/i18n/localeRegistry";
import {
  buildStorePromoConversations,
  seedStorePromoFixture,
  STORE_PROMO_FIXTURE_MARKER_KEY,
} from "../../src/services/storePromoFixtures";
import {
  getStorePromoPipelinePhase,
  isStorePromoApplicationId,
  loadStorePromoScene,
  STORE_PROMO_SCENE_STORAGE_KEY,
} from "../../src/services/storePromoPresentation";
import { DEVELOPMENT_ENTITLEMENT_MODE_STORAGE_KEY } from "../../src/services/developmentEntitlement";
import {
  readActiveConversationId,
  readConversation,
  readStoredConversationMetas,
  resetConversationStorageForTests,
} from "../../src/hooks/conversations/storage";

import { STORAGE_KEY } from "../../src/hooks/settings/types";

// Imported like application code; `jest.requireMock` would hand back a second
// copy of the mock with its own database.
const sqliteMock = SQLite as unknown as { __reset: () => void };

jest.mock("expo-secure-store", () => ({
  deleteItemAsync: jest.fn(() => Promise.resolve()),
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
}));

const getApplicationId = jest.fn<Promise<string | null>, []>();

describe("store promo fixtures", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
    sqliteMock.__reset();
    resetConversationStorageForTests();
    NativeModules.MrBroccoliDiagnostics = { getApplicationId };
  });

  it("provides a populated branch fixture for every registered locale", () => {
    for (const language of APP_LANGUAGES) {
      const conversations = buildStorePromoConversations(
        language,
        Date.parse("2026-08-05T12:00:00.000Z"),
      );

      expect(conversations).toHaveLength(3);
      expect(conversations[0].messages).toHaveLength(4);
      expect(conversations[0].messages.at(-1)?.metadata?.ulraMode).toBeDefined();
      expect(conversations[1].branch).toMatchObject({
        rootConversationId: "promo-root",
        parentConversationId: "promo-root",
        branchMessageId: "promo-branch-user",
      });
      expect(conversations[2].isPrivate).toBe(true);
    }
  });

  it("keeps the German promotional conversation localized", () => {
    const [conversation] = buildStorePromoConversations("de", 0);

    expect(conversation.title).toBe("Ein entspannter Tag in Berlin");
    expect(conversation.messages[0]?.content).toContain("Plane einen");
    expect(conversation.messages[3]?.content).toContain("Museumsinsel");
  });

  it("uses stable timestamps for reproducible captures", () => {
    expect(buildStorePromoConversations("de")).toEqual(
      buildStorePromoConversations("de"),
    );
    expect(buildStorePromoConversations("de")[0].messages.at(-1)?.timestamp).toBe(
      "2026-08-05T06:05:00.000Z",
    );
  });

  it("fails closed for the production identity", async () => {
    getApplicationId.mockResolvedValue("com.tobiaswinkler.app.mrbroccoli");

    await expect(seedStorePromoFixture("de")).resolves.toBe(false);
    await expect(AsyncStorage.getAllKeys()).resolves.toEqual([]);
  });

  it("seeds only the isolated Maestro identity without provider keys", async () => {
    getApplicationId.mockResolvedValue(
      "com.tobiaswinkler.app.mrbroccoli.maestro",
    );

    await expect(seedStorePromoFixture("de")).resolves.toBe(true);
    const storedSettings = JSON.parse(
      (await AsyncStorage.getItem(STORAGE_KEY)) ?? "{}",
    ) as Record<string, unknown>;
    const storedMetas = await readStoredConversationMetas();

    expect(storedSettings.language).toBe("de");
    expect(storedSettings.theme).toBe("light");
    expect(storedSettings.responseModes).toEqual([
      expect.objectContaining({
        id: "mode-1",
        route: expect.objectContaining({ provider: "openai" }),
      }),
      expect.objectContaining({
        id: "mode-2",
        route: expect.objectContaining({ provider: "anthropic" }),
      }),
      expect.objectContaining({
        id: "mode-3",
        route: expect.objectContaining({ provider: "gemini" }),
      }),
    ]);
    expect(storedSettings).not.toHaveProperty("apiKeys");
    expect(storedMetas).toHaveLength(3);
    await expect(readActiveConversationId()).resolves.toBe("promo-root");
    await expect(readConversation("promo-root")).resolves.not.toBeNull();
    await expect(
      AsyncStorage.getItem(STORE_PROMO_FIXTURE_MARKER_KEY),
    ).resolves.toBe("de");
    await expect(
      AsyncStorage.getItem(STORE_PROMO_SCENE_STORAGE_KEY),
    ).resolves.toBe("premium");
    await expect(
      AsyncStorage.getItem(DEVELOPMENT_ENTITLEMENT_MODE_STORAGE_KEY),
    ).resolves.toBe("premium");
  });

  it("seeds a Free scene with two completed exchanges and no Uber audit", async () => {
    getApplicationId.mockResolvedValue(
      "com.tobiaswinkler.app.mrbroccoli.maestro",
    );

    await expect(seedStorePromoFixture("de", "free")).resolves.toBe(true);
    const conversation = await readConversation("promo-root");

    expect(conversation.messages).toHaveLength(4);
    expect(
      conversation.messages?.some((message) => message.metadata?.ulraMode),
    ).toBe(false);
    await expect(
      AsyncStorage.getItem(DEVELOPMENT_ENTITLEMENT_MODE_STORAGE_KEY),
    ).resolves.toBe("free");
    await expect(loadStorePromoScene()).resolves.toBe("free");
  });

  it("holds only the Premium fixture in a stable non-idle CTA phase", () => {
    expect(getStorePromoPipelinePhase("premium", "idle")).toBe("thinking");
    expect(getStorePromoPipelinePhase("free", "idle")).toBe("idle");
    expect(getStorePromoPipelinePhase(null, "searching")).toBe("searching");
  });

  it("requires the complete Maestro suffix", () => {
    expect(
      isStorePromoApplicationId(
        "com.tobiaswinkler.app.mrbroccoli.maestro",
      ),
    ).toBe(true);
    expect(
      isStorePromoApplicationId(
        "com.tobiaswinkler.app.mrbroccoli.maestrotools",
      ),
    ).toBe(false);
    expect(isStorePromoApplicationId(null)).toBe(false);
  });
});
