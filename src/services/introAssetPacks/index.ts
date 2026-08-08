import { NativeModules, Platform } from "react-native";

import { recordDebugLogEvent } from "../debugLogCapture";
import type { AppLanguage } from "../../i18n/localeRegistry";

/**
 * Store-hosted delivery for the intro audio examples.
 *
 * Every interface language has an example clip, but any one user needs one or
 * two of them. Bundling all nineteen would put roughly eighty megabytes on
 * every install for content almost none of it plays. Both stores host packs
 * for free and fetch them on request, so the app ships without the audio and
 * pulls the language a user actually opens.
 *
 * iOS uses Background Assets with Apple-hosted asset packs, which requires
 * iOS 26. Android uses Play Asset Delivery, which has no comparable floor.
 * Where neither is available the resolver returns null and the intro sheet
 * shows its transcript instead -- the same branch that covers a language whose
 * clip has not been recorded yet.
 */

export const INTRO_ASSET_PACK_PREFIX = "intro-audio-";

/** Play Asset Delivery rejects hyphens in pack names; Apple accepts both. */
export function getIntroAssetPackName(language: AppLanguage) {
  return Platform.OS === "android"
    ? `${INTRO_ASSET_PACK_PREFIX}${language}`.replace(/-/g, "_")
    : `${INTRO_ASSET_PACK_PREFIX}${language}`;
}

export function getIntroClipFileName(language: AppLanguage) {
  return `intro-${language}.m4a`;
}

interface IntroAssetPacksNativeModule {
  /** Resolves true when the platform can deliver packs at all. */
  isSupported(): Promise<boolean>;
  /** Resolves a local file path once the pack is present, or null. */
  ensurePack(packName: string, fileName: string): Promise<string | null>;
  /** Resolves a local path only if the pack is already downloaded. */
  getLocalPath(packName: string, fileName: string): Promise<string | null>;
  /** Frees a downloaded pack. */
  removePack(packName: string): Promise<void>;
}

/**
 * Resolved on each call rather than captured at import.
 *
 * Native modules register during startup, so a module-level binding can be
 * taken before registration completes and then stay undefined for the life of
 * the process.
 */
function getNativeModule() {
  return NativeModules.MrBroccoliIntroAssetPacks as
    | IntroAssetPacksNativeModule
    | undefined;
}

let supportedPromise: Promise<boolean> | null = null;

export function isIntroAssetPackDeliverySupported() {
  const native = getNativeModule();
  if (!native) {
    return Promise.resolve(false);
  }

  supportedPromise ??= native.isSupported().catch((error: unknown) => {
    recordDebugLogEvent({
      event: "intro-asset-pack-support-check-failed",
      level: "warn",
      payload: { error },
    });
    return false;
  });

  return supportedPromise;
}

/**
 * Returns a playable file URI for a language's clip, downloading the pack if
 * it is not present yet.
 *
 * Never rejects. Every failure -- unsupported platform, no network, a pack
 * that was never uploaded -- resolves to null so the caller falls back to the
 * transcript rather than surfacing an error over an optional example.
 */
export async function ensureIntroClip(
  language: AppLanguage,
): Promise<string | null> {
  const native = getNativeModule();
  if (!native || !(await isIntroAssetPackDeliverySupported())) {
    return null;
  }

  const packName = getIntroAssetPackName(language);
  const fileName = getIntroClipFileName(language);

  try {
    const path = await native.ensurePack(packName, fileName);

    recordDebugLogEvent({
      event: path ? "intro-asset-pack-ready" : "intro-asset-pack-unavailable",
      payload: { language, packName },
    });

    return path ? toFileUri(path) : null;
  } catch (error) {
    recordDebugLogEvent({
      event: "intro-asset-pack-fetch-failed",
      level: "warn",
      payload: { error, language, packName },
    });
    return null;
  }
}

/**
 * Returns a clip only when it is already on the device.
 *
 * The intro sheet calls this while rendering so it can show a play control
 * without starting a download the user never asked for.
 */
export async function getDownloadedIntroClip(
  language: AppLanguage,
): Promise<string | null> {
  const native = getNativeModule();
  if (!native || !(await isIntroAssetPackDeliverySupported())) {
    return null;
  }

  try {
    const path = await native.getLocalPath(
      getIntroAssetPackName(language),
      getIntroClipFileName(language),
    );
    return path ? toFileUri(path) : null;
  } catch {
    return null;
  }
}

export async function removeIntroClip(language: AppLanguage) {
  const native = getNativeModule();
  if (!native) {
    return;
  }

  try {
    await native.removePack(getIntroAssetPackName(language));
  } catch (error) {
    recordDebugLogEvent({
      event: "intro-asset-pack-remove-failed",
      level: "warn",
      payload: { error, language },
    });
  }
}

function toFileUri(path: string) {
  return path.startsWith("file://") ? path : `file://${path}`;
}

/** Test seam: clears the cached support probe. */
export function resetIntroAssetPackSupportForTests() {
  supportedPromise = null;
}
