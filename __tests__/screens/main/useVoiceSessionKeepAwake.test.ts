import { act, renderHook } from "@testing-library/react-native";
import {
  activateKeepAwakeAsync,
  deactivateKeepAwake,
} from "expo-keep-awake";

import { useVoiceSessionKeepAwake } from "../../../src/screens/main/voiceSession/useVoiceSessionKeepAwake";

jest.mock("expo-keep-awake", () => ({
  activateKeepAwakeAsync: jest.fn(async () => undefined),
  deactivateKeepAwake: jest.fn(async () => undefined),
}));

jest.mock("../../../src/services/debugLogCapture", () => ({
  recordDebugLogEvent: jest.fn(),
}));

describe("useVoiceSessionKeepAwake", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("holds and releases the screen wake lock with the voice session", async () => {
    const { rerender, unmount } = renderHook(
      ({ active }) => useVoiceSessionKeepAwake(active),
      { initialProps: { active: false } },
    );

    expect(activateKeepAwakeAsync).not.toHaveBeenCalled();

    await act(async () => {
      rerender({ active: true });
      await Promise.resolve();
    });

    expect(activateKeepAwakeAsync).toHaveBeenCalledWith(
      "mrbroccoli-voice-session",
    );

    await act(async () => {
      rerender({ active: false });
      await Promise.resolve();
    });

    expect(deactivateKeepAwake).toHaveBeenCalledWith(
      "mrbroccoli-voice-session",
    );

    unmount();
    expect(deactivateKeepAwake).toHaveBeenCalledTimes(1);
  });
});
