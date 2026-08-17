import { act, renderHook } from "@testing-library/react-native";

import {
  COUNCIL_MAX_TOTAL_ROUNDS,
  useCouncilControl,
} from "../../../src/screens/main/useCouncilControl";
import { DEFAULT_SETTINGS } from "../../../src/types";

jest.mock("../../../src/services/debugLogCapture", () => ({
  recordDebugLogEvent: jest.fn(),
}));

const availableModeIds = ["mode-1", "mode-2", "mode-3"];

describe("useCouncilControl", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("starts as one selected model rather than silently enabling Council", () => {
    const updateSettings = jest.fn();
    const { result } = renderHook(() =>
      useCouncilControl({
        activeResponseMode: "mode-2",
        availableModeIds,
        settings: DEFAULT_SETTINGS,
        updateSettings,
      }),
    );

    expect(result.current.selectedModeIds).toEqual(["mode-2"]);
    expect(result.current.active).toBe(false);
    expect(updateSettings).not.toHaveBeenCalled();
  });

  it("enables at two members and disables below two without a warning dialog", () => {
    const updateSettings = jest.fn();
    const { result } = renderHook(() =>
      useCouncilControl({
        activeResponseMode: "mode-1",
        availableModeIds,
        settings: DEFAULT_SETTINGS,
        updateSettings,
      }),
    );

    act(() => result.current.toggleMode("mode-2"));
    expect(result.current.selectedModeIds).toEqual(["mode-1", "mode-2"]);
    expect(result.current.active).toBe(true);
    expect(updateSettings).toHaveBeenLastCalledWith({
      ulraModeActive: true,
      ulraModeWarningAcknowledged: true,
    });

    act(() => result.current.toggleMode("mode-1"));
    expect(result.current.selectedModeIds).toEqual(["mode-2"]);
    expect(result.current.active).toBe(false);
    expect(updateSettings).toHaveBeenLastCalledWith({
      ulraModeActive: false,
      ulraModeWarningAcknowledged: true,
    });
  });

  it("restores all ready members for an already-active Council", () => {
    const { result } = renderHook(() =>
      useCouncilControl({
        activeResponseMode: "mode-1",
        availableModeIds,
        settings: { ...DEFAULT_SETTINGS, ulraModeActive: true },
        updateSettings: jest.fn(),
      }),
    );

    expect(result.current.selectedModeIds).toEqual(availableModeIds);
    expect(result.current.active).toBe(true);
  });

  it("presents total rounds while preserving the review-round storage format", () => {
    const updateSettings = jest.fn();
    const { result } = renderHook(() =>
      useCouncilControl({
        activeResponseMode: "mode-1",
        availableModeIds,
        settings: DEFAULT_SETTINGS,
        updateSettings,
      }),
    );

    expect(result.current.totalRounds).toBe(DEFAULT_SETTINGS.ulraModeRounds + 1);
    act(() => result.current.setTotalRounds(COUNCIL_MAX_TOTAL_ROUNDS));
    expect(updateSettings).toHaveBeenCalledWith({
      ulraModeRounds: COUNCIL_MAX_TOTAL_ROUNDS - 1,
    });
  });

  it("is unavailable with fewer than two ready models", () => {
    const { result } = renderHook(() =>
      useCouncilControl({
        activeResponseMode: "mode-1",
        availableModeIds: ["mode-1"],
        settings: DEFAULT_SETTINGS,
        updateSettings: jest.fn(),
      }),
    );

    expect(result.current.available).toBe(false);
    expect(result.current.active).toBe(false);
  });
});
