import {
  shouldClaimSettingsBackSwipe,
  shouldCompleteSettingsBackSwipe,
} from "../../src/features/settings/AntSettingsFrame";

describe("compact Settings back swipe", () => {
  it("claims only an inward, horizontal gesture from the LTR leading edge", () => {
    expect(
      shouldClaimSettingsBackSwipe({
        dx: 24,
        dy: 3,
        isRtl: false,
        left: 0,
        right: 390,
        moveX: 36,
      }),
    ).toBe(true);
    expect(
      shouldClaimSettingsBackSwipe({
        dx: 24,
        dy: 3,
        isRtl: false,
        left: 0,
        right: 390,
        moveX: 72,
      }),
    ).toBe(false);
    expect(
      shouldClaimSettingsBackSwipe({
        dx: 12,
        dy: 24,
        isRtl: false,
        left: 0,
        right: 390,
        moveX: 20,
      }),
    ).toBe(false);
  });

  it("mirrors the leading edge and direction for RTL", () => {
    expect(
      shouldClaimSettingsBackSwipe({
        dx: -24,
        dy: 2,
        isRtl: true,
        left: 0,
        right: 390,
        moveX: 356,
      }),
    ).toBe(true);
    expect(
      shouldClaimSettingsBackSwipe({
        dx: 24,
        dy: 2,
        isRtl: true,
        left: 0,
        right: 390,
        moveX: 404,
      }),
    ).toBe(false);
  });

  it.each([
    [false, 7, false], [false, 26, true], [false, 60, false],
    [true, 344, true], [true, 320, false], [true, 405, false],
  ] as const)(
    "uses the panel’s leading edge in window coordinates (RTL %s, x %s)",
    (isRtl, startX, claim) => {
      const dx = isRtl ? -24 : 24;
      expect(shouldClaimSettingsBackSwipe({
        left: 20,
        right: 366,
        dx,
        dy: 2,
        isRtl,
        moveX: startX + dx,
      })).toBe(claim);
    },
  );

  it("completes for either sufficient distance or an inward flick", () => {
    expect(
      shouldCompleteSettingsBackSwipe({ dx: 72, isRtl: false, vx: 0.1 }),
    ).toBe(true);
    expect(
      shouldCompleteSettingsBackSwipe({ dx: 30, isRtl: false, vx: 0.7 }),
    ).toBe(true);
    expect(
      shouldCompleteSettingsBackSwipe({ dx: -72, isRtl: true, vx: -0.1 }),
    ).toBe(true);
    expect(
      shouldCompleteSettingsBackSwipe({ dx: 30, isRtl: false, vx: 0.1 }),
    ).toBe(false);
  });
});
