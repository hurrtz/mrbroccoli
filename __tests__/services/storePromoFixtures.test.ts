import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";
import { NativeModules } from "react-native";

import { APP_LANGUAGES } from "../../src/i18n/localeRegistry";
import {
  buildStorePromoConversations,
  isStorePromoColorScheme,
  seedStorePromoFixture,
  STORE_PROMO_FIXTURE_MARKER_KEY,
} from "../../src/services/storePromoFixtures";
import {
  getStorePromoPipelinePhase,
  isStorePromoApplicationId,
  isStorePromoOrbPresentation,
  isStorePromoScene,
  loadStorePromoOrbPresentation,
  loadStorePromoScene,
  STORE_PROMO_ORB_STORAGE_KEY,
  STORE_PROMO_SCENE_STORAGE_KEY,
} from "../../src/services/storePromoPresentation";
import {
  readActiveConversationId,
  readConversation,
  readStoredConversationMetas,
  resetConversationStorageForTests,
} from "../../src/hooks/conversations/storage";
import { STORAGE_KEY } from "../../src/hooks/settings/types";

const sqliteMock = SQLite as unknown as { __reset: () => void };
const getApplicationId = jest.fn<Promise<string | null>, []>();

jest.mock("expo-secure-store", () => ({
  deleteItemAsync: jest.fn(() => Promise.resolve()),
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
}));

describe("store promo fixtures", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
    sqliteMock.__reset();
    resetConversationStorageForTests();
    NativeModules.MrBroccoliDiagnostics = { getApplicationId };
  });

  it("provides a populated BYOK branch fixture for every registered locale", () => {
    for (const language of APP_LANGUAGES) {
      const conversations = buildStorePromoConversations(language);
      expect(conversations).toHaveLength(3);
      expect(conversations[0].messages).toHaveLength(4);
      expect(
        conversations[0].messages.at(-1)?.metadata?.ulraMode,
      ).toBeDefined();
      expect(conversations[1].branch).toMatchObject({
        rootConversationId: "promo-root",
        parentConversationId: "promo-root",
        branchMessageId: "promo-branch-user",
      });
    }
  });

  it("fails closed for the production identity", async () => {
    getApplicationId.mockResolvedValue("com.tobiaswinkler.app.mrbroccoli");

    await expect(seedStorePromoFixture("de")).resolves.toBe(false);
    getApplicationId.mockResolvedValue(
      "com.tobiaswinkler.app.android.mrbroccoli",
    );
    await expect(seedStorePromoFixture("de")).resolves.toBe(false);
    await expect(AsyncStorage.getAllKeys()).resolves.toEqual([]);
  });

  it("seeds only the isolated identity without provider keys", async () => {
    getApplicationId.mockResolvedValue(
      "com.tobiaswinkler.app.android.mrbroccoli.maestro",
    );

    await expect(seedStorePromoFixture("de")).resolves.toBe(true);
    const storedSettings = JSON.parse(
      (await AsyncStorage.getItem(STORAGE_KEY)) ?? "{}",
    ) as Record<string, unknown>;

    expect(storedSettings.language).toBe("de");
    expect(storedSettings).not.toHaveProperty("apiKeys");
    expect(storedSettings).not.toHaveProperty("introCompleted");
    expect(await readStoredConversationMetas()).toHaveLength(3);
    await expect(readActiveConversationId()).resolves.toBe("promo-root");
    await expect(readConversation("promo-root")).resolves.not.toBeNull();
    await expect(
      AsyncStorage.getItem(STORE_PROMO_FIXTURE_MARKER_KEY),
    ).resolves.toBe("de");
    await expect(
      AsyncStorage.getItem(STORE_PROMO_SCENE_STORAGE_KEY),
    ).resolves.toBe("conversation");
    await expect(loadStorePromoScene()).resolves.toBe("conversation");
  });

  it("seeds the requested screenshot color scheme", async () => {
    getApplicationId.mockResolvedValue(
      "com.tobiaswinkler.app.mrbroccoli.maestro",
    );
    expect(isStorePromoColorScheme("light")).toBe(true);
    expect(isStorePromoColorScheme("dark")).toBe(true);
    expect(isStorePromoColorScheme("system")).toBe(false);

    await seedStorePromoFixture("de", "conversation", null, "dark");
    const storedSettings = JSON.parse(
      (await AsyncStorage.getItem(STORAGE_KEY)) ?? "{}",
    ) as Record<string, unknown>;
    expect(storedSettings.theme).toBe("dark");
  });

  it("accepts only the provider-backed conversation scene", () => {
    expect(isStorePromoScene("conversation")).toBe(true);
    expect(isStorePromoScene("free")).toBe(false);
    expect(isStorePromoScene("premium")).toBe(false);
    expect(isStorePromoScene("onboarding")).toBe(false);
    expect(getStorePromoPipelinePhase("conversation", "idle")).toBe(
      "thinking",
    );
    expect(getStorePromoPipelinePhase(null, "searching")).toBe("searching");
  });

  it("seeds and loads deterministic orb progress", async () => {
    getApplicationId.mockResolvedValue(
      "com.tobiaswinkler.app.android.mrbroccoli.maestro",
    );
    const orb = {
      phase: "thinking" as const,
      phaseProgress: 0.25,
      turnProgress: 0.5,
      overtime: 0.75,
    };

    await seedStorePromoFixture("en", "conversation", orb);
    await expect(loadStorePromoOrbPresentation()).resolves.toEqual(orb);
    await seedStorePromoFixture("en");
    await expect(
      AsyncStorage.getItem(STORE_PROMO_ORB_STORAGE_KEY),
    ).resolves.toBe("null");
  });

  it("rejects malformed orb values", () => {
    expect(
      isStorePromoOrbPresentation({
        phase: "recording",
        phaseProgress: 0,
        turnProgress: 1,
        overtime: 0.5,
      }),
    ).toBe(true);
    expect(
      isStorePromoOrbPresentation({
        phase: "thinking",
        phaseProgress: 1.01,
        turnProgress: 0,
        overtime: 0,
      }),
    ).toBe(false);
  });

  it("requires either exact platform-specific isolated application identity", () => {
    expect(
      isStorePromoApplicationId(
        "com.tobiaswinkler.app.android.mrbroccoli.maestro",
      ),
    ).toBe(true);
    expect(
      isStorePromoApplicationId("com.tobiaswinkler.app.mrbroccoli.maestro"),
    ).toBe(true);
    expect(
      isStorePromoApplicationId(
        "com.tobiaswinkler.app.android.mrbroccoli.maestrotools",
      ),
    ).toBe(false);
    expect(
      isStorePromoApplicationId(
        "com.tobiaswinkler.app.mrbroccoli.maestrotools",
      ),
    ).toBe(false);
    expect(
      isStorePromoApplicationId("com.tobiaswinkler.app.android.mrbroccoli"),
    ).toBe(false);
    expect(isStorePromoApplicationId(null)).toBe(false);
  });
});
