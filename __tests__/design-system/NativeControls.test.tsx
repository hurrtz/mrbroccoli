import React from "react";
import {
  Animated,
  Modal as RNModal,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { act, fireEvent, render } from "@testing-library/react-native";

const mockIsReduceMotionEnabled = jest.fn().mockResolvedValue(false);

jest.mock(
  "react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo",
  () => ({
    __esModule: true,
    default: {
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
      isReduceMotionEnabled: () => mockIsReduceMotionEnabled(),
    },
  }),
);

jest.mock("react-native", () => {
  const actual = jest.requireActual("react-native");
  const mockedUseWindowDimensions = jest.fn(() => ({
    fontScale: 1,
    height: 844,
    scale: 3,
    width: 390,
  }));

  return new Proxy(actual, {
    get(target, property, receiver) {
      return property === "useWindowDimensions"
        ? mockedUseWindowDimensions
        : Reflect.get(target, property, receiver);
    },
  });
});

import {
  Button,
  Modal,
  Tag,
  shouldClaimSheetDrag,
  shouldDismissSheetDrag,
} from "../../src/design-system/NativeControls";
import { lightColors } from "../../src/theme/colors";
import { ThemeProvider } from "../../src/theme/ThemeContext";

const mockUseWindowDimensions = jest.mocked(useWindowDimensions);

function setViewport(width: number, height: number) {
  mockUseWindowDimensions.mockReturnValue({
    fontScale: 1,
    height,
    scale: 3,
    width,
  });
}

function renderControl(element: React.ReactElement) {
  return render(<ThemeProvider mode="light">{element}</ThemeProvider>);
}

describe("NativeControls", () => {
  afterEach(() => {
    // Reset safe area insets mock to default zero insets after each test
    const { useSafeAreaInsets } = require("react-native-safe-area-context");
    jest.mocked(useSafeAreaInsets).mockReturnValue({
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
    });
  });
  it("exposes a disabled loading button with a progress indicator", () => {
    const onPress = jest.fn();
    const screen = renderControl(
      <Button loading onPress={onPress}>
        Save
      </Button>,
    );

    const button = screen.getByRole("button");
    expect(StyleSheet.flatten(button.props.style)).toMatchObject({
      minHeight: 48,
    });
    expect(button.props.accessibilityState).toMatchObject({
      busy: true,
      disabled: true,
    });
    expect(screen.getByTestId("native-control-loading")).toBeTruthy();
    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it("keeps selectable tags on the 44pt target floor", () => {
    const screen = renderControl(
      <Tag selected={false} onChange={jest.fn()}>
        Filter
      </Tag>,
    );

    expect(
      StyleSheet.flatten(screen.getByRole("button").props.style),
    ).toMatchObject({ minHeight: 44 });
  });

  it("renders dialog actions and dispatches the selected action", () => {
    const onDone = jest.fn();
    const screen = renderControl(
      <Modal
        visible
        title="Details"
        footer={[{ text: "Done", onPress: onDone }]}
      >
        Content
      </Modal>,
    );

    expect(screen.getByRole("header").props.children).toBe("Details");
    fireEvent.press(screen.getByText("Done"));
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("lets a downward drag on the sheet's handle pull it closed", () => {
    // The grabber promises "pull down to close"; a decisive downward move on
    // it claims the gesture, and release far or fast enough dismisses.
    expect(shouldClaimSheetDrag({ dx: 2, dy: 20 })).toBe(true);
    expect(shouldClaimSheetDrag({ dx: 2, dy: -20 })).toBe(false);
    expect(shouldClaimSheetDrag({ dx: 40, dy: 20 })).toBe(false);
    expect(shouldClaimSheetDrag({ dx: 0, dy: 4 })).toBe(false);

    expect(shouldDismissSheetDrag({ dy: 140, vy: 0 })).toBe(true);
    expect(shouldDismissSheetDrag({ dy: 30, vy: 1.2 })).toBe(true);
    expect(shouldDismissSheetDrag({ dy: 30, vy: 0.2 })).toBe(false);
  });

  it("keeps the pull-to-close gesture off the card the content scrolls in", () => {
    // A downward drag inside a scrolling transcript is how the reader goes
    // back through it. The card must not answer that motion, or reading
    // upwards quickly throws the sheet closed.
    const sheet = renderControl(
      <Modal visible layout="sheet" onClose={jest.fn()} title="Transcript">
        Content
      </Modal>,
    );
    expect(
      sheet.getByTestId("native-dialog-card").props
        .onMoveShouldSetResponderCapture,
    ).toBeUndefined();
    expect(
      sheet.getByTestId("native-sheet-handle").props
        .onMoveShouldSetResponderCapture,
    ).toBeDefined();

    const dialog = renderControl(
      <Modal visible onClose={jest.fn()} title="Details">
        Content
      </Modal>,
    );
    expect(dialog.queryByTestId("native-sheet-handle")).toBeNull();
  });

  it("forwards native dismissal so sibling modal transitions can be sequenced", () => {
    const onDismiss = jest.fn();
    const screen = renderControl(
      <Modal visible layout="sheet" onDismiss={onDismiss} title="Transcript">
        Content
      </Modal>,
    );

    expect(screen.UNSAFE_getByType(RNModal).props.onDismiss).toBe(onDismiss);
  });

  it("renders an inviting success action without changing its semantics", () => {
    const screen = renderControl(
      <Modal
        visible
        footer={[{ text: "Start", tone: "success", onPress: jest.fn() }]}
      >
        Ready
      </Modal>,
    );

    const action = screen.getByRole("button", { name: "Start" });
    expect(action.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: "#059669" }),
      ]),
    );
  });

  it("keeps footer actions reachable when dialog content exceeds the card cap", () => {
    // Regression: on small windows (iPad compatibility mode) an oversized body
    // used to push the footer actions off-screen instead of shrinking.
    const screen = renderControl(
      <Modal
        visible
        title="Tall dialog"
        footer={[{ text: "Buy", onPress: jest.fn() }]}
      >
        Content
      </Modal>,
    );

    const card = screen.getByTestId("native-dialog-card");
    expect(StyleSheet.flatten(card.props.style)).toMatchObject({
      overflow: "hidden",
    });
    const body = screen.getByTestId("native-dialog-body");
    expect(StyleSheet.flatten(body.props.style)).toMatchObject({
      flexShrink: 1,
    });
  });

  it("disables a loading dialog action while showing progress", () => {
    const onExport = jest.fn();
    const screen = renderControl(
      <Modal
        visible
        footer={[{ text: "Export", loading: true, onPress: onExport }]}
      >
        Content
      </Modal>,
    );

    const action = screen
      .getAllByRole("button")
      .find((button) => button.props.accessibilityState?.busy);
    expect(action).toBeDefined();
    expect(action!.props.accessibilityState).toEqual({
      busy: true,
      disabled: true,
    });
    expect(screen.getByTestId("native-dialog-action-loading")).toBeTruthy();
    fireEvent.press(action!);
    expect(onExport).not.toHaveBeenCalled();
  });

  it("pins the sheet layout to the bottom and caps it at 85% of the window", () => {
    setViewport(390, 844);
    const screen = renderControl(
      <Modal visible layout="sheet" title="Premium">
        Content
      </Modal>,
    );

    const card = StyleSheet.flatten(
      screen.getByTestId("native-dialog-card").props.style,
    );
    expect(card.maxHeight).toBeCloseTo(844 * 0.85);
    expect(card.width).toBe("100%");
    expect(card.maxWidth).toBe("100%");
    expect(card.borderBottomLeftRadius).toBe(0);
    expect(card.borderBottomRightRadius).toBe(0);

    const overlay = StyleSheet.flatten(
      screen.getByTestId("native-dialog-overlay").props.style,
    );
    expect(overlay.justifyContent).toBe("flex-end");
    expect(overlay.padding).toBe(0);
  });

  it("keeps the centred dialog in landscape even when the sheet is requested", () => {
    setViewport(844, 390);
    const screen = renderControl(
      <Modal visible layout="sheet" title="Premium">
        Content
      </Modal>,
    );

    const card = StyleSheet.flatten(
      screen.getByTestId("native-dialog-card").props.style,
    );
    expect(card.maxWidth).toBe(560);
    expect(card.maxHeight).toBe("82%");

    const overlay = StyleSheet.flatten(
      screen.getByTestId("native-dialog-overlay").props.style,
    );
    expect(overlay.justifyContent).toBe("center");
  });

  it("leaves the default dialog layout untouched", () => {
    setViewport(390, 844);
    const screen = renderControl(
      <Modal visible title="Details">
        Content
      </Modal>,
    );

    const card = StyleSheet.flatten(
      screen.getByTestId("native-dialog-card").props.style,
    );
    expect(card.maxWidth).toBe(560);
    expect(card.maxHeight).toBe("82%");
  });

  it("keeps the sheet backdrop out of the accessibility tree", () => {
    setViewport(390, 844);
    const screen = renderControl(
      <Modal visible layout="sheet" title="Premium">
        Content
      </Modal>,
    );

    const overlay = screen.getByTestId("native-dialog-overlay");
    expect(overlay.props.accessibilityViewIsModal).toBe(true);

    const backdrop = screen.getByTestId("native-dialog-backdrop");
    expect(backdrop.props.accessible).toBe(false);
    expect(backdrop.props.importantForAccessibility).toBe("no");
  });

  it("binds the sheet card's transform to the sheet-progress animation and leaves the dialog card untransformed", () => {
    // A fully-open sheet (mounted already visible) settles sheetProgress at
    // 1, so a correctly wired translateY interpolates to 0 (card fully on
    // screen). Deleting the transform block entirely removes the `transform`
    // style key outright rather than merely changing this number, which is
    // what this test actually pins.
    setViewport(390, 844);
    const sheetScreen = renderControl(
      <Modal visible layout="sheet" title="Premium">
        Content
      </Modal>,
    );
    const sheetCard = StyleSheet.flatten(
      sheetScreen.getByTestId("native-dialog-card").props.style,
    );
    expect(sheetCard.transform).toEqual([{ translateY: 0 }]);
    expect(sheetCard.paddingTop).toBe(0);

    const dialogScreen = renderControl(
      <Modal visible title="Details">
        Content
      </Modal>,
    );
    const dialogCard = StyleSheet.flatten(
      dialogScreen.getByTestId("native-dialog-card").props.style,
    );
    expect(dialogCard.transform).toBeUndefined();
  });

  it("mounts the sheet backdrop fully formed while only the card animates", () => {
    setViewport(390, 844);
    const sheetScreen = renderControl(
      <Modal visible layout="sheet" title="Premium">
        Content
      </Modal>,
    );
    const sheetOverlay = StyleSheet.flatten(
      sheetScreen.getByTestId("native-dialog-overlay").props.style,
    );
    expect(sheetOverlay.opacity).toBeUndefined();
    expect(sheetOverlay.backgroundColor).toBe(lightColors.overlay);

    const dialogScreen = renderControl(
      <Modal visible title="Details">
        Content
      </Modal>,
    );
    const dialogOverlay = StyleSheet.flatten(
      dialogScreen.getByTestId("native-dialog-overlay").props.style,
    );
    expect(dialogOverlay.opacity).toBeUndefined();
  });

  it("disables the container's own animation for the sheet and keeps the dialog's fade", () => {
    setViewport(390, 844);
    const sheetScreen = renderControl(
      <Modal visible layout="sheet" title="Premium">
        Content
      </Modal>,
    );
    expect(sheetScreen.UNSAFE_getByType(RNModal).props.animationType).toBe(
      "none",
    );

    const dialogScreen = renderControl(
      <Modal visible title="Details">
        Content
      </Modal>,
    );
    expect(dialogScreen.UNSAFE_getByType(RNModal).props.animationType).toBe(
      "fade",
    );
  });

  it("caps the sheet at window height minus top inset when insets exceed 85% threshold", () => {
    // With insets.top = 200 and height = 844:
    // Math.min(844 * 0.85, 844 - 200) => Math.min(717.4, 644) => 644
    const { useSafeAreaInsets } = require("react-native-safe-area-context");
    jest.mocked(useSafeAreaInsets).mockReturnValue({
      bottom: 0,
      left: 0,
      right: 0,
      top: 200,
    });

    setViewport(390, 844);
    const screen = renderControl(
      <Modal visible layout="sheet" title="Premium">
        Content
      </Modal>,
    );

    const card = StyleSheet.flatten(
      screen.getByTestId("native-dialog-card").props.style,
    );
    expect(card.maxHeight).toBe(644);
  });

  it("pads the sheet card's bottom by the home-indicator inset so footer actions clear it", () => {
    // Regression: the sheet card inherited the dialog's flat padding: 20 and
    // pinned flush to the window's physical bottom edge, so on devices with a
    // bottom safe-area inset (the iOS home-indicator gesture band) the lower
    // part of the footer buttons sat inside that band.
    const { useSafeAreaInsets } = require("react-native-safe-area-context");
    jest.mocked(useSafeAreaInsets).mockReturnValue({
      bottom: 34,
      left: 0,
      right: 0,
      top: 0,
    });

    setViewport(390, 844);
    const screen = renderControl(
      <Modal visible layout="sheet" title="Premium">
        Content
      </Modal>,
    );

    const card = StyleSheet.flatten(
      screen.getByTestId("native-dialog-card").props.style,
    );
    expect(card.paddingBottom).toBe(54);
  });

  it("keeps the dialog layout's flat padding untouched by the bottom inset", () => {
    const { useSafeAreaInsets } = require("react-native-safe-area-context");
    jest.mocked(useSafeAreaInsets).mockReturnValue({
      bottom: 34,
      left: 0,
      right: 0,
      top: 0,
    });

    setViewport(390, 844);
    const screen = renderControl(
      <Modal visible title="Details">
        Content
      </Modal>,
    );

    const card = StyleSheet.flatten(
      screen.getByTestId("native-dialog-card").props.style,
    );
    expect(card.padding).toBe(20);
    expect(card.paddingBottom).toBeUndefined();
  });

  it("keeps the sheet mounted until the closing animation finishes", async () => {
    jest.useFakeTimers();
    setViewport(390, 844);
    mockIsReduceMotionEnabled.mockResolvedValue(false);

    const screen = renderControl(
      <Modal visible layout="sheet" title="Premium">
        Content
      </Modal>,
    );
    await act(async () => {});

    screen.rerender(
      <ThemeProvider mode="light">
        <Modal visible={false} layout="sheet" title="Premium">
          Content
        </Modal>
      </ThemeProvider>,
    );

    expect(screen.queryByTestId("native-dialog-card")).toBeTruthy();

    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    expect(screen.queryByTestId("native-dialog-card")).toBeNull();
    jest.useRealTimers();
  });

  it("keeps the sheet mounted when it is reopened mid-exit", async () => {
    jest.useFakeTimers();
    setViewport(390, 844);
    mockIsReduceMotionEnabled.mockResolvedValue(false);

    const screen = renderControl(
      <Modal visible layout="sheet" title="Premium">
        Content
      </Modal>,
    );
    await act(async () => {});

    screen.rerender(
      <ThemeProvider mode="light">
        <Modal visible={false} layout="sheet" title="Premium">
          Content
        </Modal>
      </ThemeProvider>,
    );
    await act(async () => {
      jest.advanceTimersByTime(100);
    });

    screen.rerender(
      <ThemeProvider mode="light">
        <Modal visible layout="sheet" title="Premium">
          Content
        </Modal>
      </ThemeProvider>,
    );
    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    expect(screen.queryByTestId("native-dialog-card")).toBeTruthy();
    jest.useRealTimers();
  });

  it("unmounts the sheet immediately when reduce motion is enabled", async () => {
    jest.useFakeTimers();
    setViewport(390, 844);
    mockIsReduceMotionEnabled.mockResolvedValue(true);

    const screen = renderControl(
      <Modal visible layout="sheet" title="Premium">
        Content
      </Modal>,
    );
    await act(async () => {});

    screen.rerender(
      <ThemeProvider mode="light">
        <Modal visible={false} layout="sheet" title="Premium">
          Content
        </Modal>
      </ThemeProvider>,
    );
    await act(async () => {});

    expect(screen.queryByTestId("native-dialog-card")).toBeNull();
    jest.useRealTimers();
  });

  it("keeps the sheet in sync when it rotates out of the sheet layout mid-exit and back", async () => {
    // Regression: a rotation to landscape mid-close takes the effect's
    // isSheet=false branch, which never touches sheetProgress again (no new
    // Animated.timing, no setValue). Only the effect's own cleanup can clear
    // the in-flight close's failsafe timer in that branch; without it, the
    // stale timer keeps counting down in the background and can still fire
    // on a later render, force-unmounting a sheet a subsequent reopen just
    // remounted. (The animation object itself is self-healing here: RN's
    // Animated.Value stops any previously attached animation the instant a
    // later render touches sheetProgress again via a fresh .start() or
    // .setValue(); the plain setTimeout backing the failsafe has no such
    // protection, which is exactly why it needs the explicit clearTimeout.)
    jest.useFakeTimers();
    setViewport(390, 844);
    mockIsReduceMotionEnabled.mockResolvedValue(false);

    const screen = renderControl(
      <Modal visible layout="sheet" title="Premium">
        Content
      </Modal>,
    );
    await act(async () => {});

    // Start closing while still a portrait sheet.
    screen.rerender(
      <ThemeProvider mode="light">
        <Modal visible={false} layout="sheet" title="Premium">
          Content
        </Modal>
      </ThemeProvider>,
    );
    await act(async () => {
      jest.advanceTimersByTime(50);
    });

    // Rotate to landscape mid-close: isSheet becomes false.
    setViewport(844, 390);
    screen.rerender(
      <ThemeProvider mode="light">
        <Modal visible={false} layout="sheet" title="Premium">
          Content
        </Modal>
      </ThemeProvider>,
    );
    await act(async () => {});

    // Rotate back to portrait and reopen in the same beat.
    setViewport(390, 844);
    screen.rerender(
      <ThemeProvider mode="light">
        <Modal visible layout="sheet" title="Premium">
          Content
        </Modal>
      </ThemeProvider>,
    );
    await act(async () => {});

    // Let enough time pass for the original close animation's 220ms window
    // to elapse, plus the failsafe margin, so a stale, uncancelled callback
    // has every opportunity to fire and mis-unmount the reopened sheet.
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(screen.queryByTestId("native-dialog-card")).toBeTruthy();
    jest.useRealTimers();
  });

  it("force-unmounts the sheet on a failsafe timer when the animation callback never arrives", async () => {
    // Regression: unmount used to be gated solely on the animation's
    // completion callback. If that callback is suppressed (app backgrounded
    // mid-animation, native driver interrupted), sheetRendered would stay
    // true forever, holding the native modal stack open indefinitely.
    jest.useFakeTimers();
    setViewport(390, 844);
    mockIsReduceMotionEnabled.mockResolvedValue(false);

    // Simulate a suppressed completion callback: the animation "starts" but
    // its callback is never invoked, and .stop() is a no-op spy so this
    // double stands in for an animation that never resolves on its own.
    const start = jest.fn();
    const stop = jest.fn();
    const timingSpy = jest
      .spyOn(Animated, "timing")
      .mockReturnValue({ start, stop } as unknown as ReturnType<
        typeof Animated.timing
      >);

    try {
      const screen = renderControl(
        <Modal visible layout="sheet" title="Premium">
          Content
        </Modal>,
      );
      await act(async () => {});

      screen.rerender(
        <ThemeProvider mode="light">
          <Modal visible={false} layout="sheet" title="Premium">
            Content
          </Modal>
        </ThemeProvider>,
      );
      await act(async () => {});

      expect(start).toHaveBeenCalled();
      expect(screen.queryByTestId("native-dialog-card")).toBeTruthy();

      // The animation's own completion callback never fires (the stub above
      // never invokes it). Only the failsafe timer can unmount the sheet.
      await act(async () => {
        jest.advanceTimersByTime(400);
      });

      expect(screen.queryByTestId("native-dialog-card")).toBeNull();
    } finally {
      timingSpy.mockRestore();
      jest.useRealTimers();
    }
  });
});
