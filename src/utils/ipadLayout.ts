export const IPAD_REGULAR_WIDTH_MIN = 680;
export const IPAD_TRANSCRIPT_DOCK_MIN_WIDTH = 1024;

export interface IpadLayoutInput {
  height: number;
  isPad: boolean;
  platform: string;
  width: number;
}

export interface IpadLayout {
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
 * View, Slide Over, and Stage Manager updates.
 */
export function resolveIpadLayout({
  height,
  isPad,
  platform,
  width,
}: IpadLayoutInput): IpadLayout {
  const ipad = platform === "ios" && isPad;
  const isLandscape = width > height;
  const isRegularWidth = ipad && width >= IPAD_REGULAR_WIDTH_MIN;
  // A 296pt sidebar plus a roughly 400pt transcript already exceeds the
  // regular-width boundary. Keep the phone transcript handle until the window
  // can also preserve a useful centre workspace.
  const transcriptDocked =
    isRegularWidth && isLandscape && width >= IPAD_TRANSCRIPT_DOCK_MIN_WIDTH;

  return {
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
