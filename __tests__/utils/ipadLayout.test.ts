import {
  IPAD_REGULAR_WIDTH_MIN,
  IPAD_TRANSCRIPT_DOCK_MIN_WIDTH,
  resolveIpadLayout,
} from "../../src/utils/ipadLayout";

describe("resolveIpadLayout", () => {
  it("keeps iPhone and Android windows on their existing phone layouts", () => {
    expect(
      resolveIpadLayout({
        height: 440,
        isPad: false,
        platform: "ios",
        width: 956,
      }),
    ).toMatchObject({
      isIpad: false,
      isLandscape: true,
      isRegularWidth: false,
      sidebarWidth: null,
      transcriptDocked: false,
    });
    expect(
      resolveIpadLayout({
        height: 800,
        isPad: true,
        platform: "android",
        width: 1280,
      }).isRegularWidth,
    ).toBe(false);
  });

  it("collapses a compact iPad window to the phone layout", () => {
    expect(
      resolveIpadLayout({
        height: 980,
        isPad: true,
        platform: "ios",
        width: IPAD_REGULAR_WIDTH_MIN - 1,
      }),
    ).toMatchObject({
      isIpad: true,
      isRegularWidth: false,
      sidebarWidth: null,
      transcriptDocked: false,
    });
  });

  it("uses the 300pt persistent sidebar and transcript handle in portrait", () => {
    expect(
      resolveIpadLayout({
        height: 1180,
        isPad: true,
        platform: "ios",
        width: 820,
      }),
    ).toMatchObject({
      isLandscape: false,
      isRegularWidth: true,
      sidebarWidth: 300,
      transcriptDocked: false,
    });
  });

  it("keeps a narrow regular landscape usable before docking the transcript", () => {
    expect(
      resolveIpadLayout({
        height: 700,
        isPad: true,
        platform: "ios",
        width: IPAD_TRANSCRIPT_DOCK_MIN_WIDTH - 1,
      }),
    ).toMatchObject({
      isLandscape: true,
      isRegularWidth: true,
      sidebarWidth: 336,
      transcriptDocked: false,
    });
  });

  it("uses the 296pt tri-pane sidebar and a bounded transcript at wide landscape", () => {
    expect(
      resolveIpadLayout({
        height: 820,
        isPad: true,
        platform: "ios",
        width: 1180,
      }),
    ).toEqual({
      isIpad: true,
      isLandscape: true,
      isRegularWidth: true,
      sidebarWidth: 296,
      transcriptDocked: true,
      transcriptWidth: 400,
    });
  });
});
