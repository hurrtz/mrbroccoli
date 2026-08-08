import type { AppLanguage } from "../../i18n/localeRegistry";
import {
  ensureIntroClip,
  getDownloadedIntroClip,
  isIntroAssetPackDeliverySupported,
} from "../../services/introAssetPacks";

/**
 * Resolves the intro sheet's audio example for a language.
 *
 * Clips are not bundled. Every interface language has one and any user opens
 * one or two, so they are delivered as store-hosted asset packs -- Background
 * Assets on iOS, Play Asset Delivery on Android -- and fetched on request.
 *
 * Three states matter to the sheet:
 *
 * - a clip already on the device, playable immediately;
 * - a clip that can be fetched, offered behind an explicit action so nobody
 *   downloads audio they did not ask for;
 * - no clip at all, where the transcript stands in. That covers unsupported
 *   platforms, a device below iOS 26, a sideloaded build, and every language
 *   whose recording does not exist yet.
 */
export type IntroClipAvailability =
  | { kind: "ready"; uri: string }
  | { kind: "fetchable" }
  | { kind: "unavailable" };

export async function getIntroClipAvailability(
  language: AppLanguage,
): Promise<IntroClipAvailability> {
  if (!(await isIntroAssetPackDeliverySupported())) {
    return { kind: "unavailable" };
  }

  const downloaded = await getDownloadedIntroClip(language);
  return downloaded ? { kind: "ready", uri: downloaded } : { kind: "fetchable" };
}

/**
 * Downloads the language's pack when needed and returns a playable URI.
 *
 * Resolves null rather than throwing on any failure. The example is optional,
 * so a missing pack or an interrupted download degrades to the transcript
 * instead of surfacing an error.
 */
export function fetchIntroClip(language: AppLanguage) {
  return ensureIntroClip(language);
}
