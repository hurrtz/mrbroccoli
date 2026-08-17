import {
  resolveChevronTarget,
  resolveSwipeSurface,
  resolveSwipeTarget,
} from "../../../src/screens/main/voiceTextInputPager/useInputSurfaceGesture";

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

describe("input surface swipe landing", () => {
  function target(
    activeSurface: "voice" | "text",
    projectedTranslation: number,
  ) {
    return resolveSwipeTarget({
      activeSurface,
      nextSurface: resolveSwipeSurface({
        activeSurface,
        pageStride: PAGE_STRIDE,
        projectedTranslation,
      }),
      pageStride: PAGE_STRIDE,
      projectedTranslation,
    });
  }

  it("lands the other surface on the side the finger came from", () => {
    // Voice sits at 0 and text at -PAGE_STRIDE. Swiping the other way reaches
    // the same surface, so it has to arrive from the other side: a wrapping
    // landing is one stride on the far side of where it usually sits.
    expect(target("voice", -PAGE_STRIDE)).toBe(-PAGE_STRIDE);
    expect(target("voice", PAGE_STRIDE)).toBe(PAGE_STRIDE);
    expect(target("text", PAGE_STRIDE)).toBeCloseTo(0);
    expect(target("text", -PAGE_STRIDE)).toBe(-PAGE_STRIDE * 2);
  });

  it("returns an undecided swipe to where it started", () => {
    // Object.is separates -0 from 0; the sign of a resting offset is noise.
    expect(target("voice", 10)).toBeCloseTo(0);
    expect(target("voice", -10)).toBeCloseTo(0);
    expect(target("text", 10)).toBe(-PAGE_STRIDE);
    expect(target("text", -10)).toBe(-PAGE_STRIDE);
  });
});

describe("input surface chevron landing", () => {
  it("always lands from the side of the pressed chevron", () => {
    expect(
      resolveChevronTarget({
        activeSurface: "voice",
        direction: "right",
        pageStride: PAGE_STRIDE,
      }),
    ).toBe(-PAGE_STRIDE);
    expect(
      resolveChevronTarget({
        activeSurface: "text",
        direction: "right",
        pageStride: PAGE_STRIDE,
      }),
    ).toBe(-PAGE_STRIDE * 2);
    expect(
      resolveChevronTarget({
        activeSurface: "voice",
        direction: "left",
        pageStride: PAGE_STRIDE,
      }),
    ).toBe(PAGE_STRIDE);
    expect(
      resolveChevronTarget({
        activeSurface: "text",
        direction: "left",
        pageStride: PAGE_STRIDE,
      }),
    ).toBe(0);
  });
});
