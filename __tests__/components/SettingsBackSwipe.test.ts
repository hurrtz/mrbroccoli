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
        width: 390,
        x0: 12,
      }),
    ).toBe(true);
    expect(
      shouldClaimSettingsBackSwipe({
        dx: 24,
        dy: 3,
        isRtl: false,
        width: 390,
        x0: 48,
      }),
    ).toBe(false);
    expect(
      shouldClaimSettingsBackSwipe({
        dx: 12,
        dy: 24,
        isRtl: false,
        width: 390,
        x0: 8,
      }),
    ).toBe(false);
  });

  it("mirrors the leading edge and direction for RTL", () => {
    expect(
      shouldClaimSettingsBackSwipe({
        dx: -24,
        dy: 2,
        isRtl: true,
        width: 390,
        x0: 380,
      }),
    ).toBe(true);
    expect(
      shouldClaimSettingsBackSwipe({
        dx: 24,
        dy: 2,
        isRtl: true,
        width: 390,
        x0: 380,
      }),
    ).toBe(false);
  });

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
