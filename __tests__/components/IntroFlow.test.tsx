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
    language: "en" as const,
    onClose: jest.fn(),
    onConnectProvider: jest.fn(),
    onInstallLocal: jest.fn(),
    onOpenPremium: jest.fn(),
    onOpenStt: jest.fn(),
    onOpenTts: jest.fn(),
    t,
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
  it("covers the seven setup steps in order", () => {
    // The auto step sits after requirements and before the manual routes,
    // because the manual routes are the fallback now.
    expect(INTRO_STEPS).toEqual([
      "welcome",
      "requirements",
      "auto",
      "llm",
      "stt",
      "tts",
      "premium",
    ]);
  });

  it("renders nothing while hidden", () => {
    const { queryByTestId } = renderScreen({ visible: false });

    expect(queryByTestId("intro-flow-content")).toBeNull();
  });

  it("opens on the greeting with its play control", () => {
    const { getByTestId } = renderScreen();

    expect(getByTestId("intro-welcome-play")).toBeTruthy();
  });

  it("keeps 44 point header targets around the approved 40 point faces", () => {
    const { getByTestId } = renderScreen();

    expect(StyleSheet.flatten(getByTestId("intro-back").props.style)).toEqual(
      expect.objectContaining({ height: 44, margin: -2, width: 44 }),
    );
    expect(
      StyleSheet.flatten(getByTestId("intro-back-face").props.style),
    ).toEqual(expect.objectContaining({ height: 40, width: 40 }));
    expect(StyleSheet.flatten(getByTestId("intro-close").props.style)).toEqual(
      expect.objectContaining({ height: 44, margin: -2, width: 44 }),
    );
    expect(
      StyleSheet.flatten(getByTestId("intro-close-face").props.style),
    ).toEqual(expect.objectContaining({ height: 40, width: 40 }));
  });

  it("walks forward and back through the steps", () => {
    // A one-way flow made the last step a dead end: someone could neither
    // check what they had skipped nor revisit a decision.
    const { getByTestId } = renderScreen();

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

  it("turns the forward action into a visible completion action", () => {
    // The approved flow keeps the action in its established footer position:
    // an empty gap looked like a missing control rather than a finished flow.
    const { getByTestId, queryByTestId } = renderScreen();

    fireEvent.press(getByTestId("intro-stepper-dot-6"));

    expect(queryByTestId("intro-next")).toBeNull();
    expect(getByTestId("intro-done").props.accessibilityLabel).toBe("done");
    expect(getByTestId("intro-close")).toBeTruthy();
  });

  it("closes from the completion action on the last step", () => {
    const { getByTestId, props } = renderScreen();
    fireEvent.press(getByTestId("intro-stepper-dot-6"));
    fireEvent.press(getByTestId("intro-done"));

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it("jumps to any step from the stepper", () => {
    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId("intro-stepper-dot-6"));

    expect(getByTestId("intro-open-premium")).toBeTruthy();
  });

  it("uses the available height to centre the requirements step on large screens", () => {
    const { getByTestId } = renderScreen();
    fireEvent.press(getByTestId("intro-stepper-dot-1"));

    expect(
      StyleSheet.flatten(getByTestId("intro-requirements-step").props.style),
    ).toEqual(expect.objectContaining({ flex: 1, justifyContent: "center" }));
  });

  it("cannot go back from the first step", () => {
    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId("intro-back"));

    expect(getByTestId("intro-welcome-play")).toBeTruthy();
  });

  it("offers both routes to the one requirement", () => {
    const { getByTestId, props } = renderScreen();
    fireEvent.press(getByTestId("intro-stepper-dot-2"));

    fireEvent.press(getByTestId("intro-install-local"));
    expect(props.onInstallLocal).toHaveBeenCalledTimes(1);

    fireEvent.press(getByTestId("intro-connect-provider"));
    expect(props.onConnectProvider).toHaveBeenCalledTimes(1);
  });

  it("marks the automatic setup route as recommended", () => {
    const { getByTestId, getByText } = renderScreen();
    fireEvent.press(getByTestId("intro-stepper-dot-2"));

    expect(getByText("introRecommended")).toBeTruthy();
  });

  it("lets a listener switch the example language", () => {
    // Claiming the app sounds good is worth less than letting someone hear it,
    // in whichever language they actually speak.
    const { getByTestId } = renderScreen();
    fireEvent.press(getByTestId("intro-stepper-dot-4"));

    fireEvent.press(getByTestId("intro-voice-select"));

    expect(getByTestId("intro-voice-option-ja")).toBeTruthy();
    expect(
      getByTestId("intro-voice-options").props.accessibilityViewIsModal,
    ).toBe(true);
    expect(
      StyleSheet.flatten(getByTestId("intro-voice-close").props.style),
    ).toEqual(expect.objectContaining({ height: 44, width: 44 }));
  });

  it("defaults the example to the interface language", () => {
    const { getByTestId } = renderScreen({ language: "de" });
    fireEvent.press(getByTestId("intro-stepper-dot-4"));
    fireEvent.press(getByTestId("intro-voice-select"));

    expect(
      getByTestId("intro-voice-option-de").props.accessibilityState.selected,
    ).toBe(true);
  });

  it("closes from the close control", () => {
    const { getByTestId, props } = renderScreen();

    fireEvent.press(getByTestId("intro-close"));

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it("routes speech settings separately for listening and speaking", () => {
    const { getByTestId, props } = renderScreen();

    fireEvent.press(getByTestId("intro-stepper-dot-3"));
    fireEvent.press(getByTestId("intro-open-stt"));
    expect(props.onOpenStt).toHaveBeenCalledTimes(1);

    fireEvent.press(getByTestId("intro-stepper-dot-4"));
    fireEvent.press(getByTestId("intro-open-tts"));
    expect(props.onOpenTts).toHaveBeenCalledTimes(1);
  });
});
