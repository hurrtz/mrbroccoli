import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";

const mockPlayer = {
  pause: jest.fn(),
  play: jest.fn(),
  seekTo: jest.fn(),
};
let mockPlaying = false;

jest.mock("expo-audio", () => ({
  useAudioPlayer: jest.fn(() => mockPlayer),
  useAudioPlayerStatus: jest.fn(() => ({ playing: mockPlaying })),
}));

const assetPacks = {
  isSupported: jest.fn(() => Promise.resolve(false)),
  ensurePack: jest.fn(() => Promise.resolve(null)),
  getLocalPath: jest.fn(() => Promise.resolve(null)),
  removePack: jest.fn(() => Promise.resolve()),
};

import { IntroBanner } from "../../src/components/IntroBanner";
import {
  INTRO_STEPS,
  IntroFlowSheet,
  type IntroStep,
} from "../../src/components/introFlow/IntroFlowSheet";
import { lightColors } from "../../src/theme/colors";

import { NativeModules } from "react-native";
import { resetIntroAssetPackSupportForTests } from "../../src/services/introAssetPacks";

const t = ((key: string) => key) as never;

beforeEach(() => {
  jest.clearAllMocks();
  mockPlaying = false;
  resetIntroAssetPackSupportForTests();
  (NativeModules as Record<string, unknown>).MrBroccoliIntroAssetPacks =
    assetPacks;
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

  it("says so when the platform cannot deliver a clip", async () => {
    // Covers an unsupported platform, a device below iOS 26, a sideloaded
    // build, and a language whose pack was never uploaded.
    assetPacks.isSupported.mockResolvedValue(false);
    const { getByTestId } = renderSheet({ step: "hear" });

    await waitFor(() => {
      expect(getByTestId("intro-hear-unavailable")).toBeTruthy();
    });
  });

  it("offers playback without downloading when the clip is already present", async () => {
    assetPacks.isSupported.mockResolvedValue(true);
    assetPacks.getLocalPath.mockResolvedValue("/packs/intro-en.m4a");
    const { getByTestId } = renderSheet({ step: "hear" });

    await waitFor(() => {
      expect(getByTestId("intro-hear-play")).toBeTruthy();
    });
    expect(assetPacks.ensurePack).not.toHaveBeenCalled();
  });

  it("downloads only when the user asks to hear it", async () => {
    // An optional example must never spend someone's data unprompted.
    assetPacks.isSupported.mockResolvedValue(true);
    assetPacks.getLocalPath.mockResolvedValue(null);
    assetPacks.ensurePack.mockResolvedValue("/packs/intro-en.m4a");
    const { getByTestId } = renderSheet({ step: "hear" });

    await waitFor(() => {
      expect(getByTestId("intro-hear-play")).toBeTruthy();
    });
    expect(assetPacks.ensurePack).not.toHaveBeenCalled();

    fireEvent.press(getByTestId("intro-hear-play"));

    await waitFor(() => {
      expect(assetPacks.ensurePack).toHaveBeenCalledTimes(1);
    });
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
