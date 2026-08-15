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
  applyStorePromoAutoSetupJob,
  applyStorePromoFreeOfflineController,
  getStorePromoPipelinePhase,
  isStorePromoApplicationId,
  isStorePromoOrbPresentation,
  isStorePromoScene,
  loadStorePromoOrbPresentation,
  loadStorePromoScene,
  STORE_PROMO_ORB_STORAGE_KEY,
  STORE_PROMO_SCENE_STORAGE_KEY,
} from "../../src/services/storePromoPresentation";
import type { FreeOfflineModeController } from "../../src/screens/main/useFreeOfflineMode";
import { DEFAULT_SETTINGS } from "../../src/types";
import { DEVELOPMENT_ENTITLEMENT_MODE_STORAGE_KEY } from "../../src/services/developmentEntitlement";
import type { TranslateFn } from "../../src/screens/main/shared";
import {
  readActiveConversationId,
  readConversation,
  readStoredConversationMetas,
  resetConversationStorageForTests,
} from "../../src/hooks/conversations/storage";

import { STORAGE_KEY } from "../../src/hooks/settings/types";
import { createAutoSetupJob } from "../test-utils/autoSetupJobFixture";

// Imported like application code; `jest.requireMock` would hand back a second
// copy of the mock with its own database.
const sqliteMock = SQLite as unknown as { __reset: () => void };

jest.mock("expo-secure-store", () => ({
  deleteItemAsync: jest.fn(() => Promise.resolve()),
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
}));

const getApplicationId = jest.fn<Promise<string | null>, []>();
const t = ((key: string) => key) as TranslateFn;

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
      expect(
        conversations[0].messages.at(-1)?.metadata?.ulraMode,
      ).toBeDefined();
      expect(conversations[1].branch).toMatchObject({
        rootConversationId: "promo-root",
        parentConversationId: "promo-root",
        branchMessageId: "promo-branch-user",
      });
      expect(conversations[2].title).toBeTruthy();
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
    expect(
      buildStorePromoConversations("de")[0].messages.at(-1)?.timestamp,
    ).toBe("2026-08-05T06:05:00.000Z");
  });

  it("fails closed for the production identity", async () => {
    getApplicationId.mockResolvedValue("com.tobiaswinkler.app.mrbroccoli");

    await expect(seedStorePromoFixture("de", "onboarding")).resolves.toBe(
      false,
    );
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

  it("seeds the requested screenshot color scheme", async () => {
    getApplicationId.mockResolvedValue(
      "com.tobiaswinkler.app.mrbroccoli.maestro",
    );

    expect(isStorePromoColorScheme("light")).toBe(true);
    expect(isStorePromoColorScheme("dark")).toBe(true);
    expect(isStorePromoColorScheme("system")).toBe(false);
    await expect(
      seedStorePromoFixture("de", "premium", null, "dark"),
    ).resolves.toBe(true);

    const storedSettings = JSON.parse(
      (await AsyncStorage.getItem(STORAGE_KEY)) ?? "{}",
    ) as Record<string, unknown>;
    expect(storedSettings.theme).toBe("dark");
  });

  it("seeds a localized first-run onboarding scene for Maestro only", async () => {
    getApplicationId.mockResolvedValue(
      "com.tobiaswinkler.app.mrbroccoli.maestro",
    );

    await expect(seedStorePromoFixture("ar", "onboarding")).resolves.toBe(true);
    const storedSettings = JSON.parse(
      (await AsyncStorage.getItem(STORAGE_KEY)) ?? "{}",
    ) as Record<string, unknown>;

    expect(storedSettings).toEqual(
      expect.objectContaining({
        freeOfflineSetupCompleted: false,
        introCompleted: false,
        introDismissed: false,
        introOpened: false,
        language: "ar",
      }),
    );
    expect(isStorePromoScene("onboarding")).toBe(true);
    expect(isStorePromoScene("onboarding-ready")).toBe(true);
    await expect(loadStorePromoScene()).resolves.toBe("onboarding");
    await expect(
      AsyncStorage.getItem(DEVELOPMENT_ENTITLEMENT_MODE_STORAGE_KEY),
    ).resolves.toBe("free");
  });

  it.each(["ios", "android"] as const)(
    "builds a fixed %s onboarding proposal for every locale without live actions",
    (platform) => {
      for (const language of APP_LANGUAGES) {
        const liveJob = createAutoSetupJob();
        const proposal = applyStorePromoAutoSetupJob(
          liveJob,
          language,
          "onboarding",
          platform,
          t,
        );

        expect(proposal.state).toBe("proposal");
        expect(proposal.snapshot?.platform).toBe(platform);
        expect(proposal.downloadBytes).toBeGreaterThan(0);
        expect(proposal.plan.map(({ role }) => role)).toEqual([
          "think",
          "listen",
          "speak",
        ]);
        expect(proposal.totalSizeLabel).not.toBe("0 MB");
        proposal.start();
        proposal.install();
        proposal.cancel();
        proposal.retry();
        expect(liveJob.start).not.toHaveBeenCalled();
        expect(liveJob.install).not.toHaveBeenCalled();
        expect(liveJob.cancel).not.toHaveBeenCalled();
        expect(liveJob.retry).not.toHaveBeenCalled();
      }
    },
  );

  it("leaves live setup untouched outside the onboarding scene", () => {
    const liveJob = createAutoSetupJob();

    expect(applyStorePromoAutoSetupJob(liveJob, "de", "free", "ios", t)).toBe(
      liveJob,
    );
    expect(applyStorePromoAutoSetupJob(liveJob, "de", null, "ios", t)).toBe(
      liveJob,
    );
  });

  it("keeps the fixed onboarding recommendation setup-incomplete", () => {
    const controller = {
      effectiveSettings: DEFAULT_SETTINGS,
      freeRuntimeReady: false,
      setupVisible: true,
    } as unknown as FreeOfflineModeController;

    const projected = applyStorePromoFreeOfflineController(
      controller,
      DEFAULT_SETTINGS,
      "onboarding",
      "ios",
    );

    expect(projected).not.toBe(controller);
    expect(projected.snapshot).not.toBeNull();
    expect(projected.recommendedSelection?.status).toBe("ready");
    expect(projected.effectiveSettings).toBe(controller.effectiveSettings);
    expect(projected.freeRuntimeReady).toBe(false);
    expect(projected.readiness).toMatchObject({
      ready: false,
      installed: false,
      failedModelId: null,
    });
  });

  it("projects an offline-ready final onboarding step without live setup", () => {
    const controller = {
      effectiveSettings: DEFAULT_SETTINGS,
      freeRuntimeReady: false,
      setupVisible: true,
    } as unknown as FreeOfflineModeController;

    const projected = applyStorePromoFreeOfflineController(
      controller,
      DEFAULT_SETTINGS,
      "onboarding-ready",
      "ios",
    );

    expect(projected.freeRuntimeReady).toBe(true);
    expect(projected.effectiveSettings).not.toBe(controller.effectiveSettings);
    expect(projected.readiness).toMatchObject({
      ready: true,
      installed: true,
      failedModelId: null,
    });
  });

  it("holds only the Premium fixture in a stable non-idle CTA phase", () => {
    expect(getStorePromoPipelinePhase("premium", "idle")).toBe("thinking");
    expect(getStorePromoPipelinePhase("free", "idle")).toBe("idle");
    expect(getStorePromoPipelinePhase("onboarding-ready", "idle")).toBe("idle");
    expect(getStorePromoPipelinePhase(null, "searching")).toBe("searching");
  });

  it("seeds and loads deterministic orb progress only for the isolated identity", async () => {
    getApplicationId.mockResolvedValue(
      "com.tobiaswinkler.app.mrbroccoli.maestro",
    );
    const orb = {
      phase: "thinking" as const,
      phaseProgress: 0.25,
      turnProgress: 0.5,
      overtime: 0.75,
    };

    await expect(seedStorePromoFixture("en", "premium", orb)).resolves.toBe(
      true,
    );
    await expect(loadStorePromoOrbPresentation()).resolves.toEqual(orb);

    await expect(seedStorePromoFixture("en", "premium")).resolves.toBe(true);
    await expect(
      AsyncStorage.getItem(STORE_PROMO_ORB_STORAGE_KEY),
    ).resolves.toBe("null");
    await expect(loadStorePromoOrbPresentation()).resolves.toBeNull();
  });

  it("rejects malformed or out-of-range orb fixture values", () => {
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
        phase: "preparing",
        phaseProgress: 0,
        turnProgress: 0,
        overtime: 0,
      }),
    ).toBe(false);
    expect(
      isStorePromoOrbPresentation({
        phase: "thinking",
        phaseProgress: 1.01,
        turnProgress: 0,
        overtime: 0,
      }),
    ).toBe(false);
  });

  it("does not load an orb fixture for the production identity", async () => {
    getApplicationId.mockResolvedValue("com.tobiaswinkler.app.mrbroccoli");
    await AsyncStorage.setItem(
      STORE_PROMO_ORB_STORAGE_KEY,
      JSON.stringify({
        phase: "thinking",
        phaseProgress: 1,
        turnProgress: 1,
        overtime: 1,
      }),
    );

    await expect(loadStorePromoOrbPresentation()).resolves.toBeNull();
  });

  it("requires the exact isolated store-promo application identity", () => {
    expect(
      isStorePromoApplicationId("com.tobiaswinkler.app.mrbroccoli.maestro"),
    ).toBe(true);
    expect(
      isStorePromoApplicationId(
        "com.tobiaswinkler.app.mrbroccoli.maestrotools",
      ),
    ).toBe(false);
    expect(isStorePromoApplicationId("com.example.maestro")).toBe(false);
    expect(isStorePromoApplicationId(null)).toBe(false);
  });
});
