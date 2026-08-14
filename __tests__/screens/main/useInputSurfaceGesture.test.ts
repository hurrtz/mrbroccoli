import { resolveSwipeSurface } from "../../../src/screens/main/voiceTextInputPager/useInputSurfaceGesture";

const PAGE_STRIDE = 320;

function swipe(activeSurface: "voice" | "text", projectedTranslation: number) {
  return resolveSwipeSurface({
    activeSurface,
    pageStride: PAGE_STRIDE,
    projectedTranslation,
  });
}

describe("input surface swipe resolution", () => {
  it("leaves the current surface in either direction", () => {
    // The pager is a closed circle: with two pages every decisive swipe is a
    // toggle, so neither direction is ever a dead end.
    expect(swipe("voice", -PAGE_STRIDE)).toBe("text");
    expect(swipe("voice", PAGE_STRIDE)).toBe("text");
    expect(swipe("text", PAGE_STRIDE)).toBe("voice");
    expect(swipe("text", -PAGE_STRIDE)).toBe("voice");
  });

  it("stays put when the swipe never crosses the half-page threshold", () => {
    expect(swipe("voice", -PAGE_STRIDE / 2 + 1)).toBe("voice");
    expect(swipe("voice", PAGE_STRIDE / 2 - 1)).toBe("voice");
    expect(swipe("text", 0)).toBe("text");
  });

  it("commits exactly at the half-page threshold", () => {
    expect(swipe("voice", -PAGE_STRIDE / 2)).toBe("text");
    expect(swipe("text", PAGE_STRIDE / 2)).toBe("voice");
  });
});
