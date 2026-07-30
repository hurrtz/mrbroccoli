jest.mock("../../src/services/debugLogCapture", () => ({
  recordDebugLogEvent: jest.fn(),
}));

import { Linking } from "react-native";

import {
  clearVoiceRemoteControls,
  getVoiceRemoteActionFromUrl,
  resetVoiceRemoteControlsForTests,
  setVoiceRemoteControlState,
  subscribeToVoiceRemoteActions,
} from "../../src/services/voiceRemoteControls";

function createNativeModule() {
  return {
    addListener: jest.fn(),
    clearControls: jest.fn(async () => true),
    consumePendingAction: jest.fn(async () => null as string | null),
    removeListeners: jest.fn(),
    setControls: jest.fn(async () => true),
  };
}

describe("voiceRemoteControls", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetVoiceRemoteControlsForTests();
  });

  it("maps action URLs without accepting unrelated links", () => {
    expect(
      getVoiceRemoteActionFromUrl(
        "mrbroccoli://voice-action/continue?source=lockscreen",
      ),
    ).toBe("continue");
    expect(
      getVoiceRemoteActionFromUrl("mrbroccoli://voice-action/repeat"),
    ).toBe("repeat");
    expect(
      getVoiceRemoteActionFromUrl("mrbroccoli://voice-action/unknown"),
    ).toBeNull();
    expect(getVoiceRemoteActionFromUrl("https://example.com/pause")).toBeNull();
  });

  it("publishes localized native controls and deduplicates unchanged state", () => {
    const nativeModule = createNativeModule();
    const state = {
      canRepeat: true,
      continueLabel: "Continue",
      mode: "recording" as const,
      pauseLabel: "Pause",
      phaseLabel: "Listening",
      repeatLabel: "Repeat",
      stopLabel: "Stop",
    };

    expect(
      setVoiceRemoteControlState(state, {
        nativeModule,
        platform: "ios",
      }),
    ).toBe(true);
    setVoiceRemoteControlState(state, {
      nativeModule,
      platform: "ios",
    });

    expect(nativeModule.setControls).toHaveBeenCalledTimes(1);
    expect(nativeModule.setControls).toHaveBeenCalledWith(
      "recording",
      true,
      "Listening",
      "Pause",
      "Continue",
      "Stop",
      "Repeat",
    );
  });

  it("clears controls when inactive or explicitly torn down", () => {
    const nativeModule = createNativeModule();

    setVoiceRemoteControlState(
      {
        canRepeat: false,
        continueLabel: "Continue",
        mode: "inactive",
        pauseLabel: "Pause",
        phaseLabel: "Voice session",
        repeatLabel: "Repeat",
        stopLabel: "Stop",
      },
      { nativeModule, platform: "android" },
    );
    clearVoiceRemoteControls({ nativeModule, platform: "android" });

    expect(nativeModule.clearControls).toHaveBeenCalledTimes(2);
  });

  it("delivers a native action that arrived before JS subscribed", async () => {
    const nativeModule = createNativeModule();
    nativeModule.consumePendingAction.mockResolvedValueOnce("stop");
    const listener = jest.fn();
    const removeLinkListener = jest.fn();
    jest
      .spyOn(Linking, "addEventListener")
      .mockReturnValueOnce({ remove: removeLinkListener } as any);
    jest.spyOn(Linking, "getInitialURL").mockResolvedValueOnce(null);

    const unsubscribe = subscribeToVoiceRemoteActions(listener, {
      nativeModule,
      platform: "android",
    });
    await Promise.resolve();

    expect(listener).toHaveBeenCalledWith("stop");

    unsubscribe();
    expect(removeLinkListener).toHaveBeenCalledTimes(1);
  });
});
