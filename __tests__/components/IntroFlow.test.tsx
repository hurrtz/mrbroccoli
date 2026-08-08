import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

const mockPlayer = {
  pause: jest.fn(),
  play: jest.fn(),
  seekTo: jest.fn(),
};
let mockPlaying = false;
let mockStatus: Record<string, unknown> = {};

jest.mock("expo-audio", () => ({
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
import {
  INTRO_STEPS,
  IntroFlowSheet,
  type IntroStep,
} from "../../src/components/introFlow/IntroFlowSheet";
import { lightColors } from "../../src/theme/colors";

const t = ((key: string) => key) as never;

beforeEach(() => {
  jest.clearAllMocks();
  mockPlaying = false;
  mockStatus = {};
});

function renderSheet(overrides: Partial<React.ComponentProps<typeof IntroFlowSheet>> = {}) {
  const props = {
    colors: lightColors,
    language: "en" as const,
    onClose: jest.fn(),
    onConnectProvider: jest.fn(),
    onInstallLocal: jest.fn(),
    onStepChange: jest.fn(),
    step: "what" as IntroStep,
    t,
    visible: true,
    ...overrides,
  };
  return { ...render(<IntroFlowSheet {...props} />), props };
}

describe("IntroBanner", () => {
  it("stays out of the tree once dismissed", () => {
    const { queryByTestId } = render(
      <IntroBanner
        colors={lightColors}
        onDismiss={jest.fn()}
        onOpen={jest.fn()}
        t={t}
        visible={false}
      />,
    );

    expect(queryByTestId("intro-banner")).toBeNull();
  });

  it("separates opening the introduction from dismissing it", () => {
    // The banner replaced a wizard that could not be skipped. Dismissing has to
    // be a distinct target from opening, or a user trying to get rid of it ends
    // up inside the flow instead.
    const onDismiss = jest.fn();
    const onOpen = jest.fn();
    const { getByTestId } = render(
      <IntroBanner
        colors={lightColors}
        onDismiss={onDismiss}
        onOpen={onOpen}
        t={t}
        visible
      />,
    );

    fireEvent.press(getByTestId("intro-banner-dismiss"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onOpen).not.toHaveBeenCalled();

    fireEvent.press(getByTestId("intro-banner-open"));
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});

describe("IntroFlowSheet", () => {
  it("renders four steps", () => {
    expect(INTRO_STEPS).toEqual(["what", "how", "hear", "start"]);
  });

  it("reports its position in the flow", () => {
    const { getByText } = renderSheet({ step: "hear" });

    expect(getByText("introStepOfTotal")).toBeTruthy();
  });

  it("labels the audio example as pre-recorded", () => {
    // The clip is generated with a frontier model and a paid voice, so it must
    // never read as what this user's own configuration will produce.
    const { getByText } = renderSheet({ step: "hear" });

    expect(getByText("introHearDisclaimer")).toBeTruthy();
  });

  it("shows the transcript for a language that has a script", () => {
    const { getByTestId } = renderSheet({ step: "hear" });

    expect(getByTestId("intro-hear-transcript")).toBeTruthy();
  });

  it("offers playback for every language without a download", async () => {
    // Clips ship inside the app, so there is no unavailable state and no
    // fetching -- the control is there the moment the step renders.
    for (const language of ["en", "de", "ja", "ur"] as const) {
      const { getByTestId, unmount } = renderSheet({ step: "hear", language });
      expect(getByTestId("intro-hear-play")).toBeTruthy();
      unmount();
    }
  });

  it("restarts rather than resumes once the clip has finished", () => {
    // Someone pressing play after it ended wants the example from the top.
    mockStatus = { playing: false, didJustFinish: true, currentTime: 180, duration: 180 };
    const { getByTestId } = renderSheet({ step: "hear" });

    fireEvent.press(getByTestId("intro-hear-play"));

    expect(mockPlayer.seekTo).toHaveBeenCalledWith(0);
    expect(mockPlayer.play).toHaveBeenCalled();
  });

  it("stops playback when the step goes away", () => {
    // The sheet can be dismissed mid-clip; the voice must not outlive it.
    const { unmount } = renderSheet({ step: "hear" });
    unmount();

    expect(mockPlayer.pause).toHaveBeenCalled();
  });

  it("offers both a provider and an on-device path on the final step", () => {
    // This step is also where a user lands after tapping the microphone with
    // nothing configured, so neither route may be missing.
    const { getByTestId, props } = renderSheet({ step: "start" });

    fireEvent.press(getByTestId("intro-start-provider"));
    expect(props.onConnectProvider).toHaveBeenCalledTimes(1);

    fireEvent.press(getByTestId("intro-start-local"));
    expect(props.onInstallLocal).toHaveBeenCalledTimes(1);
  });

  it("renders nothing while hidden", () => {
    const { queryByTestId } = renderSheet({ visible: false });

    expect(queryByTestId("intro-flow-content")).toBeNull();
  });
});
