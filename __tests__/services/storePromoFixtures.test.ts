import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeModules } from "react-native";

import { APP_LANGUAGES } from "../../src/i18n/localeRegistry";
import {
  buildStorePromoConversations,
  isStorePromoApplicationId,
  seedStorePromoFixture,
  STORE_PROMO_FIXTURE_MARKER_KEY,
} from "../../src/services/storePromoFixtures";
import {
  ACTIVE_CONVERSATION_KEY,
  META_KEY,
  conversationKey,
} from "../../src/hooks/conversations/storage";
import { STORAGE_KEY } from "../../src/hooks/settings/types";

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
    const storedMetas = JSON.parse(
      (await AsyncStorage.getItem(META_KEY)) ?? "[]",
    ) as unknown[];

    expect(storedSettings.language).toBe("de");
    expect(storedSettings.theme).toBe("light");
    expect(storedSettings).not.toHaveProperty("apiKeys");
    expect(storedMetas).toHaveLength(3);
    await expect(AsyncStorage.getItem(ACTIVE_CONVERSATION_KEY)).resolves.toBe(
      "promo-root",
    );
    await expect(
      AsyncStorage.getItem(conversationKey("promo-root")),
    ).resolves.not.toBeNull();
    await expect(
      AsyncStorage.getItem(STORE_PROMO_FIXTURE_MARKER_KEY),
    ).resolves.toBe("de");
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
