import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

const mockPlayer = { pause: jest.fn(), play: jest.fn(), seekTo: jest.fn() };
let mockPlaying = false;
let mockStatus: Record<string, unknown> = {};

jest.mock("expo-status-bar", () => ({
  StatusBar: () => null,
}));

jest.mock("expo-audio", () => ({
  setAudioModeAsync: jest.fn(() => Promise.resolve()),
  setIsAudioActiveAsync: jest.fn(() => Promise.resolve()),
  useAudioPlayer: jest.fn(() => mockPlayer),
  useAudioPlayerStatus: jest.fn(() => ({
    playing: mockPlaying,
    didJustFinish: false,
    currentTime: 0,
    duration: 180,
    ...mockStatus,
  })),
}));

import { IntroBanner } from "../../src/components/IntroBanner";
import { IntroFlowScreen } from "../../src/components/introFlow/IntroFlowScreen";
import { INTRO_STEPS } from "../../src/components/introFlow/introSteps";
import { createAutoSetupJob } from "../test-utils/autoSetupJobFixture";

const t = ((key: string) => key) as never;

beforeEach(() => {
  jest.clearAllMocks();
  mockPlaying = false;
  mockStatus = {};
});

function renderScreen(
  overrides: Partial<React.ComponentProps<typeof IntroFlowScreen>> = {},
) {
  const props = {
    autoSetup: createAutoSetupJob(),
    firstRun: true,
    language: "en" as const,
    onClose: jest.fn(),
    onComplete: jest.fn(),
    onConnectProvider: jest.fn(),
    onInstallLocal: jest.fn(),
    onOpenStt: jest.fn(),
    onOpenTts: jest.fn(),
    t,
    testTurn: {
      onPressIn: jest.fn(),
      onPressOut: jest.fn(),
      onReplay: jest.fn(),
      phase: "idle" as const,
      replaying: false,
      turn: null,
    },
    thinkingReady: true,
    visible: true,
    ...overrides,
  };
  return { ...render(<IntroFlowScreen {...props} />), props };
}

describe("IntroBanner", () => {
  it("stays out of the tree once dismissed", () => {
    const { queryByTestId } = render(
      <IntroBanner
        onDismiss={jest.fn()}
        onOpen={jest.fn()}
        showDismiss
        t={t}
        visible={false}
      />,
    );

    expect(queryByTestId("intro-banner")).toBeNull();
  });

  it("offers no way out until the invitation has been taken up once", () => {
    // An exit available before the card has ever been read makes getting rid
    // of it the easiest thing to do on a first launch.
    const { queryByTestId, getByTestId } = render(
      <IntroBanner
        onDismiss={jest.fn()}
        onOpen={jest.fn()}
        showDismiss={false}
        t={t}
        visible
      />,
    );

    expect(queryByTestId("intro-banner-dismiss")).toBeNull();
    expect(getByTestId("intro-banner")).toBeTruthy();
  });

  it("draws the spoken-walkthrough affordance instead of an action pill", () => {
    // The walkthrough is spoken, so a play glyph in a hairline circle carries
    // the invitation; the row ends in a quiet chevron, never a second CTA.
    const { getByTestId, queryByText } = render(
      <IntroBanner
        onDismiss={jest.fn()}
        onOpen={jest.fn()}
        showDismiss={false}
        t={t}
        visible
      />,
    );

    expect(queryByText("introBannerAction")).toBeNull();
    expect(
      StyleSheet.flatten(getByTestId("intro-banner-play-ring").props.style),
    ).toEqual(
      expect.objectContaining({
        width: 40,
        height: 40,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.5)",
      }),
    );
  });

  it("separates opening the introduction from dismissing it", () => {
    // The banner replaced a wizard that could not be skipped. Dismissing has to
    // be a distinct target, or someone trying to get rid of it ends up inside.
    const onDismiss = jest.fn();
    const onOpen = jest.fn();
    const { getByTestId } = render(
      <IntroBanner
        onDismiss={onDismiss}
        onOpen={onOpen}
        showDismiss
        t={t}
        visible
      />,
    );

    fireEvent.press(getByTestId("intro-banner-dismiss"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onOpen).not.toHaveBeenCalled();

    fireEvent.press(getByTestId("intro-banner"));
    expect(onOpen).toHaveBeenCalledTimes(1);

    expect(
      StyleSheet.flatten(getByTestId("intro-banner-dismiss").props.style),
    ).toEqual(expect.objectContaining({ height: 44, width: 44 }));
  });

  it("collapses to the approved title-only row in landscape", () => {
    const onDismiss = jest.fn();
    const onOpen = jest.fn();
    const { getByTestId, queryByText } = render(
      <IntroBanner
        compact
        onDismiss={onDismiss}
        onOpen={onOpen}
        showDismiss
        t={t}
        visible
      />,
    );

    expect(queryByText("introBannerBody")).toBeNull();
    expect(
      StyleSheet.flatten(getByTestId("intro-banner-surface").props.style),
    ).toEqual(expect.objectContaining({ minHeight: 48 }));
    expect(
      StyleSheet.flatten(getByTestId("intro-banner-dismiss").props.style),
    ).toEqual(expect.objectContaining({ height: 44, width: 44 }));

    fireEvent.press(getByTestId("intro-banner-dismiss"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onOpen).not.toHaveBeenCalled();
  });
});
describe("IntroFlowScreen", () => {
  function createTestTurn(
    overrides: Partial<
      React.ComponentProps<typeof IntroFlowScreen>["testTurn"]
    > = {},
  ) {
    return {
      onPressIn: jest.fn(),
      onPressOut: jest.fn(),
      onReplay: jest.fn(),
      phase: "idle" as const,
      replaying: false,
      turn: null,
      ...overrides,
    };
  }

  it("covers the three walkthrough steps in order", () => {
    // A walkthrough that demonstrates instead of describing: welcome, one
    // setup screen with a single green path, then the live test.
    expect(INTRO_STEPS).toEqual(["welcome", "setup", "try"]);
  });

  it("renders nothing while hidden", () => {
    const { queryByTestId } = renderScreen({ visible: false });

    expect(queryByTestId("intro-flow-content")).toBeNull();
  });

  it("opens on the stored dialogue with its play control", () => {
    const { getByTestId } = renderScreen();

    expect(getByTestId("intro-welcome-step")).toBeTruthy();
    expect(getByTestId("intro-welcome-play")).toBeTruthy();
    expect(getByTestId("intro-welcome-language")).toBeTruthy();
  });

  it("blurs the earlier turns while announcing only the crisp query", () => {
    // The three faded turns are decoration: hidden from assistive tech and
    // stepped through the blur/opacity ladder. The crisp query is the
    // question the play button answers, so it stays announced.
    const { getByTestId } = renderScreen();
    const hidden = { includeHiddenElements: true } as const;

    const far = StyleSheet.flatten(
      getByTestId("intro-dialogue-far", hidden).props.style,
    );
    const mid = StyleSheet.flatten(
      getByTestId("intro-dialogue-mid", hidden).props.style,
    );
    const near = StyleSheet.flatten(
      getByTestId("intro-dialogue-near", hidden).props.style,
    );
    expect(far).toEqual(
      expect.objectContaining({ filter: [{ blur: 4 }], opacity: 0.5 }),
    );
    expect(mid).toEqual(
      expect.objectContaining({ filter: [{ blur: 2.4 }], opacity: 0.65 }),
    );
    expect(near).toEqual(
      expect.objectContaining({ filter: [{ blur: 1.1 }], opacity: 0.85 }),
    );

    // The decorative far turn is unreachable without opting into hidden
    // elements; the crisp query is announced normally.
    const { queryByText, getByText } = renderScreen();
    expect(queryByText("Broccoli comes from the Italian broccolo", { exact: false })).toBeNull();
    expect(getByText("How does this application work?")).toBeTruthy();
  });

  it("keeps bare borderless nav glyphs on 44 point targets", () => {
    // The intro's nav controls are naked glyphs — no filled circles — and
    // back is a full arrow, not a chevron.
    const screen = renderScreen({ firstRun: false });
    const { getByTestId, queryByTestId } = screen;

    expect(StyleSheet.flatten(getByTestId("intro-back").props.style)).toEqual(
      expect.objectContaining({ height: 44, margin: -2, width: 44 }),
    );
    expect(StyleSheet.flatten(getByTestId("intro-close").props.style)).toEqual(
      expect.objectContaining({ height: 44, margin: -2, width: 44 }),
    );
    expect(queryByTestId("intro-back-face")).toBeNull();
    expect(queryByTestId("intro-close-face")).toBeNull();
    expect(
      screen.UNSAFE_getByProps({ testID: "phosphor-icon-arrow-left" }),
    ).toBeTruthy();
  });

  it("withholds every close control on a first run", () => {
    // On a first run the three steps are the way in; Done is the only exit,
    // and it stays disabled until a test turn has completed.
    const { queryByTestId, getByTestId } = renderScreen({ firstRun: true });

    expect(queryByTestId("intro-close")).toBeNull();
    fireEvent.press(getByTestId("intro-next"));
    expect(queryByTestId("intro-close")).toBeNull();
  });

  it("gates the setup step's forward action on a running reasoning model", () => {
    const { getByTestId, props } = renderScreen({
      firstRun: true,
      thinkingReady: false,
    });

    // Step one forward is free; step two's is the hard requirement.
    fireEvent.press(getByTestId("intro-next"));
    expect(
      getByTestId("intro-next").props.accessibilityState,
    ).toEqual({ disabled: true });
    fireEvent.press(getByTestId("intro-next"));
    expect(props.onClose).not.toHaveBeenCalled();
  });

  it("unlocks Done only after one completed test turn on a first run", () => {
    const withoutTurn = renderScreen({ firstRun: true });
    fireEvent.press(withoutTurn.getByTestId("intro-next"));
    fireEvent.press(withoutTurn.getByTestId("intro-next"));
    expect(
      withoutTurn.getByTestId("intro-done").props.accessibilityState,
    ).toEqual({ disabled: true });
    fireEvent.press(withoutTurn.getByTestId("intro-done"));
    expect(withoutTurn.props.onComplete).not.toHaveBeenCalled();

    const withTurn = renderScreen({
      firstRun: true,
      testTurn: createTestTurn({
        turn: {
          answer: "About 23 days.",
          latencyLabel: "2.4 s",
          question: "How long to a million?",
        },
      }),
    });
    fireEvent.press(withTurn.getByTestId("intro-next"));
    fireEvent.press(withTurn.getByTestId("intro-next"));
    fireEvent.press(withTurn.getByTestId("intro-done"));
    expect(withTurn.props.onComplete).toHaveBeenCalledTimes(1);
  });

  it("restores close on a re-entry, but never on the final step", () => {
    const { getByTestId, queryByTestId, props } = renderScreen({
      firstRun: false,
    });

    expect(getByTestId("intro-close")).toBeTruthy();
    fireEvent.press(getByTestId("intro-next"));
    expect(getByTestId("intro-close")).toBeTruthy();
    fireEvent.press(getByTestId("intro-next"));
    expect(queryByTestId("intro-close")).toBeNull();
    // Done is the exit, and a re-entry has no gate on it.
    fireEvent.press(getByTestId("intro-done"));
    expect(props.onComplete).toHaveBeenCalledTimes(1);
  });

  it("walks forward and back through the steps", () => {
    const { getByTestId } = renderScreen({ firstRun: false });

    fireEvent.press(getByTestId("intro-next"));
    fireEvent.press(getByTestId("intro-next"));
    expect(
      getByTestId("intro-stepper-dot-2").props.accessibilityState.selected,
    ).toBe(true);

    fireEvent.press(getByTestId("intro-back"));
    fireEvent.press(getByTestId("intro-back"));
    expect(
      getByTestId("intro-stepper-dot-0").props.accessibilityState.selected,
    ).toBe(true);
  });

  it("cannot go back from the first step", () => {
    const { getByTestId } = renderScreen();

    expect(getByTestId("intro-back").props.accessibilityState).toEqual({
      disabled: true,
    });
  });

  it("jumps to any step from the stepper", () => {
    const { getByTestId } = renderScreen({ firstRun: false });

    fireEvent.press(getByTestId("intro-stepper-dot-2"));
    expect(
      getByTestId("intro-stepper-dot-2").props.accessibilityState.selected,
    ).toBe(true);
  });

  it("offers the single green path and hides the manual catalogue", () => {
    const { getByTestId, queryByTestId, props } = renderScreen();

    expect(getByTestId("intro-auto-start")).toBeTruthy();
    expect(queryByTestId("intro-manual-catalogue")).toBeNull();

    fireEvent.press(getByTestId("intro-auto-start"));
    expect(props.autoSetup.start).toHaveBeenCalledTimes(1);
  });

  it("reveals the pipeline-ordered manual catalogue behind its switch", () => {
    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId("intro-manual-switch"));
    expect(getByTestId("intro-manual-catalogue")).toBeTruthy();
    expect(getByTestId("intro-manual-stt")).toBeTruthy();
    expect(getByTestId("intro-manual-llm")).toBeTruthy();
    expect(getByTestId("intro-manual-provider")).toBeTruthy();
    expect(getByTestId("intro-manual-tts")).toBeTruthy();
  });

  it("inlines the recommended models with their install state at a glance", () => {
    // The catalogue shows concrete routes on this screen — no second layer
    // of drawers to even see what exists. "More models" is the only
    // hand-off per group.
    const { getByTestId, getByText, getAllByText } = renderScreen();

    fireEvent.press(getByTestId("intro-manual-switch"));
    expect(getByTestId("intro-manual-model-whisper-tiny")).toBeTruthy();
    expect(getByTestId("intro-manual-model-qwen3-0.6b-q8")).toBeTruthy();
    expect(getByText("Whisper Tiny")).toBeTruthy();
    // Nothing is installed in the test environment, so every model row
    // carries the not-installed line with its download size.
    expect(getAllByText(/introNotInstalled · /).length).toBeGreaterThanOrEqual(
      4,
    );
  });

  it("routes manual acquisition to the owning settings pages", () => {
    const { getByTestId, props } = renderScreen();

    fireEvent.press(getByTestId("intro-manual-switch"));
    fireEvent.press(getByTestId("intro-manual-llm"));
    fireEvent.press(getByTestId("intro-manual-stt"));
    fireEvent.press(getByTestId("intro-manual-tts"));
    fireEvent.press(getByTestId("intro-manual-provider"));

    expect(props.onInstallLocal).toHaveBeenCalledTimes(1);
    expect(props.onOpenStt).toHaveBeenCalledTimes(1);
    expect(props.onOpenTts).toHaveBeenCalledTimes(1);
    expect(props.onConnectProvider).toHaveBeenCalledTimes(1);
  });

  it("drives the hold-to-talk test through press in and out", () => {
    const testTurn = createTestTurn();
    const { getByTestId } = renderScreen({ testTurn });

    const mic = getByTestId("intro-try-mic");
    fireEvent(mic, "pressIn");
    fireEvent(mic, "pressOut");

    expect(testTurn.onPressIn).toHaveBeenCalledTimes(1);
    expect(testTurn.onPressOut).toHaveBeenCalledTimes(1);
  });

  it("shows the completed test turn with its latency and replay", () => {
    const testTurn = createTestTurn({
      turn: {
        answer: "About 23 days without sleeping.",
        latencyLabel: "2.4 s",
        question: "How long would it take me to count to a million?",
      },
    });
    const { getByTestId, getByText } = renderScreen({ testTurn });

    expect(
      getByText("How long would it take me to count to a million?"),
    ).toBeTruthy();
    expect(getByText("About 23 days without sleeping.")).toBeTruthy();
    expect(getByText(/2.4 s/)).toBeTruthy();

    fireEvent.press(getByTestId("intro-try-replay"));
    expect(testTurn.onReplay).toHaveBeenCalledTimes(1);
  });
});
