export const IPAD_REGULAR_WIDTH_MIN = 680;
export const IPAD_TRANSCRIPT_DOCK_MIN_WIDTH = 1024;
// A 300pt conversation list leaves at least 320pt for the input workspace.
const EXPANDED_PHONE_MIN_SHORT_EDGE = 620;

export interface IpadLayoutInput {
  height: number;
  isPad: boolean;
  platform: string;
  width: number;
}

export interface IpadLayout {
  isExpandedPhone: boolean;
  isIpad: boolean;
  isLandscape: boolean;
  isRegularWidth: boolean;
  sidebarWidth: number | null;
  transcriptDocked: boolean;
  transcriptWidth: number | null;
}

/**
 * React Native does not expose UIKit's live horizontal size class. Window
 * width is the closest resize-aware signal available to the shared tree, so
 * the approved regular boundary is mapped here once for full screen, Split
 * View, Stage Manager, and switching between the displays on iPhone Duo.
 */
export function resolveIpadLayout({
  height,
  isPad,
  platform,
  width,
}: IpadLayoutInput): IpadLayout {
  const ipad = platform === "ios" && isPad;
  const isLandscape = width > height;
  const isExpandedPhone =
    platform === "ios" &&
    !isPad &&
    Math.min(width, height) >= EXPANDED_PHONE_MIN_SHORT_EDGE;
  const isRegularWidth =
    (ipad && width >= IPAD_REGULAR_WIDTH_MIN) ||
    (isExpandedPhone && !isLandscape);
  // A 296pt sidebar plus a roughly 400pt transcript already exceeds the
  // regular-width boundary. Keep the phone transcript handle until the window
  // can also preserve a useful centre workspace.
  const transcriptDocked =
    ipad && isLandscape && width >= IPAD_TRANSCRIPT_DOCK_MIN_WIDTH;

  return {
    isExpandedPhone,
    isIpad: ipad,
    isLandscape,
    isRegularWidth,
    sidebarWidth: isRegularWidth
      ? transcriptDocked
        ? 296
        : isLandscape
          ? 336
          : 300
      : null,
    transcriptDocked,
    transcriptWidth: transcriptDocked
      ? Math.min(400, Math.max(320, Math.round(width * 0.34)))
      : null,
  };
}
