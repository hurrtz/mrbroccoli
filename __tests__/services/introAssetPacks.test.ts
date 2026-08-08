import { NativeModules, Platform } from "react-native";

import {
  ensureIntroClip,
  getDownloadedIntroClip,
  getIntroAssetPackName,
  getIntroClipFileName,
  isIntroAssetPackDeliverySupported,
  removeIntroClip,
  resetIntroAssetPackSupportForTests,
} from "../../src/services/introAssetPacks";

const native = {
  isSupported: jest.fn<Promise<boolean>, []>(),
  ensurePack: jest.fn<Promise<string | null>, [string, string]>(),
  getLocalPath: jest.fn<Promise<string | null>, [string, string]>(),
  removePack: jest.fn<Promise<void>, [string]>(),
};

describe("intro asset pack delivery", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetIntroAssetPackSupportForTests();
    (NativeModules as Record<string, unknown>).MrBroccoliIntroAssetPacks = native;
    native.isSupported.mockResolvedValue(true);
  });

  afterEach(() => {
    delete (NativeModules as Record<string, unknown>).MrBroccoliIntroAssetPacks;
  });

  describe("pack naming", () => {
    it("uses underscores on Android because Play rejects hyphens in pack names", () => {
      Platform.OS = "android";
      expect(getIntroAssetPackName("pt-BR")).toBe("intro_audio_pt_BR");
    });

    it("keeps hyphens on iOS", () => {
      Platform.OS = "ios";
      expect(getIntroAssetPackName("pt-BR")).toBe("intro-audio-pt-BR");
    });

    it("names the clip after its language", () => {
      expect(getIntroClipFileName("de")).toBe("intro-de.m4a");
    });
  });

  describe("availability", () => {
    it("reports unsupported when the native module is absent", async () => {
      delete (NativeModules as Record<string, unknown>).MrBroccoliIntroAssetPacks;
      resetIntroAssetPackSupportForTests();

      await expect(isIntroAssetPackDeliverySupported()).resolves.toBe(false);
    });

    it("caches the support probe rather than asking on every clip", async () => {
      await isIntroAssetPackDeliverySupported();
      await isIntroAssetPackDeliverySupported();

      expect(native.isSupported).toHaveBeenCalledTimes(1);
    });

    it("treats a failed probe as unsupported", async () => {
      native.isSupported.mockRejectedValue(new Error("no service"));

      await expect(isIntroAssetPackDeliverySupported()).resolves.toBe(false);
    });
  });

  describe("fetching", () => {
    it("returns a file URI for a delivered pack", async () => {
      native.ensurePack.mockResolvedValue("/data/packs/intro-de.m4a");

      await expect(ensureIntroClip("de")).resolves.toBe(
        "file:///data/packs/intro-de.m4a",
      );
    });

    it("does not double the scheme when the platform already returns one", async () => {
      native.ensurePack.mockResolvedValue("file:///data/packs/intro-de.m4a");

      await expect(ensureIntroClip("de")).resolves.toBe(
        "file:///data/packs/intro-de.m4a",
      );
    });

    it("resolves null for a language whose pack was never uploaded", async () => {
      // Expected during rollout, not an error: the sheet shows its transcript.
      native.ensurePack.mockResolvedValue(null);

      await expect(ensureIntroClip("hu")).resolves.toBeNull();
    });

    it("swallows a fetch failure rather than surfacing it", async () => {
      // The example is optional. A failed download must never break the sheet.
      native.ensurePack.mockRejectedValue(new Error("network lost"));

      await expect(ensureIntroClip("de")).resolves.toBeNull();
    });

    it("skips the native call entirely when delivery is unsupported", async () => {
      native.isSupported.mockResolvedValue(false);

      await expect(ensureIntroClip("de")).resolves.toBeNull();
      expect(native.ensurePack).not.toHaveBeenCalled();
    });
  });

  describe("already-downloaded lookup", () => {
    it("returns a URI without triggering a download", async () => {
      native.getLocalPath.mockResolvedValue("/data/packs/intro-en.m4a");

      await expect(getDownloadedIntroClip("en")).resolves.toBe(
        "file:///data/packs/intro-en.m4a",
      );
      expect(native.ensurePack).not.toHaveBeenCalled();
    });

    it("returns null when the pack is not on the device yet", async () => {
      native.getLocalPath.mockResolvedValue(null);

      await expect(getDownloadedIntroClip("en")).resolves.toBeNull();
    });
  });

  describe("removal", () => {
    it("frees a pack by name", async () => {
      native.removePack.mockResolvedValue(undefined);

      await removeIntroClip("de");

      expect(native.removePack).toHaveBeenCalledWith(
        getIntroAssetPackName("de"),
      );
    });

    it("does not throw when removal fails", async () => {
      native.removePack.mockRejectedValue(new Error("busy"));

      await expect(removeIntroClip("de")).resolves.toBeUndefined();
    });
  });
});
