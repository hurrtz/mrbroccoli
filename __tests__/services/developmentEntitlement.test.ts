import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeModules } from "react-native";

import {
  DEVELOPMENT_ENTITLEMENT_MODE_STORAGE_KEY,
  isDevelopmentAppVariant,
  loadDevelopmentEntitlementMode,
  saveDevelopmentEntitlementMode,
} from "../../src/services/developmentEntitlement";

const getApplicationId = jest.fn<Promise<string | null>, []>();

describe("development entitlement", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
    NativeModules.MrBroccoliDiagnostics = { getApplicationId };
  });

  it("defaults an actual .dev application identity to Free", async () => {
    getApplicationId.mockResolvedValue(
      "com.tobiaswinkler.app.mrbroccoli.dev",
    );

    await expect(isDevelopmentAppVariant()).resolves.toBe(true);
    await expect(loadDevelopmentEntitlementMode()).resolves.toBe("free");
  });

  it("persists Premium simulation only for the .dev identity", async () => {
    getApplicationId.mockResolvedValue(
      "com.tobiaswinkler.app.mrbroccoli.dev",
    );

    await expect(saveDevelopmentEntitlementMode("premium")).resolves.toBe(
      true,
    );
    await expect(loadDevelopmentEntitlementMode()).resolves.toBe("premium");
    await expect(
      AsyncStorage.getItem(DEVELOPMENT_ENTITLEMENT_MODE_STORAGE_KEY),
    ).resolves.toBe("premium");
  });

  it("defaults the isolated .maestro release-test identity to Premium", async () => {
    getApplicationId.mockResolvedValue(
      "com.tobiaswinkler.app.mrbroccoli.maestro",
    );

    await expect(isDevelopmentAppVariant()).resolves.toBe(false);
    await expect(loadDevelopmentEntitlementMode()).resolves.toBe("premium");
    await expect(saveDevelopmentEntitlementMode("free")).resolves.toBe(false);
    await expect(
      AsyncStorage.getItem(DEVELOPMENT_ENTITLEMENT_MODE_STORAGE_KEY),
    ).resolves.toBeNull();
  });

  it("does not expose or persist an override for the release identity", async () => {
    getApplicationId.mockResolvedValue("com.tobiaswinkler.app.mrbroccoli");

    await expect(isDevelopmentAppVariant()).resolves.toBe(false);
    await expect(loadDevelopmentEntitlementMode()).resolves.toBeNull();
    await expect(saveDevelopmentEntitlementMode("premium")).resolves.toBe(
      false,
    );
    await expect(
      AsyncStorage.getItem(DEVELOPMENT_ENTITLEMENT_MODE_STORAGE_KEY),
    ).resolves.toBeNull();
  });

  it("requires the complete suffix and fails closed without native identity", async () => {
    getApplicationId.mockResolvedValue(
      "com.tobiaswinkler.app.mrbroccoli.devtools",
    );
    await expect(isDevelopmentAppVariant()).resolves.toBe(false);

    getApplicationId.mockResolvedValue(
      "com.tobiaswinkler.app.mrbroccoli.maestrotools",
    );
    await expect(loadDevelopmentEntitlementMode()).resolves.toBeNull();

    getApplicationId.mockRejectedValue(new Error("native unavailable"));
    await expect(loadDevelopmentEntitlementMode()).resolves.toBeNull();
  });
});
