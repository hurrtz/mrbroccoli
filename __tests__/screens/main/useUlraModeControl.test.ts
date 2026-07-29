import { act, renderHook } from "@testing-library/react-native";
import { Alert } from "react-native";

import {
  getUlraModeCallCount,
  useUlraModeControl,
} from "../../../src/screens/main/useUlraModeControl";
import { DEFAULT_SETTINGS } from "../../../src/types";

jest.mock("../../../src/services/debugLogCapture", () => ({
  recordDebugLogEvent: jest.fn(),
}));

describe("useUlraModeControl", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("calculates the initial answers, review rounds, and synthesis call", () => {
    expect(getUlraModeCallCount(3, 3)).toBe(13);
    expect(getUlraModeCallCount(10, 10)).toBe(111);
  });

  it("asks for informed consent the first time it is enabled", () => {
    const updateSettings = jest.fn();
    const alert = jest.spyOn(Alert, "alert").mockImplementation();
    const { result } = renderHook(() =>
      useUlraModeControl({
        availableModelCount: 3,
        settings: DEFAULT_SETTINGS,
        t: (key, params) =>
          `${key}:${params?.models ?? ""}:${params?.rounds ?? ""}:${params?.calls ?? ""}`,
        updateSettings,
      }),
    );

    act(() => result.current.handleToggle());

    expect(alert).toHaveBeenCalledTimes(1);
    const buttons = alert.mock.calls[0]?.[2];
    act(() => buttons?.[1]?.onPress?.());
    expect(updateSettings).toHaveBeenCalledWith({
      ulraModeActive: true,
      ulraModeWarningAcknowledged: true,
    });
  });

  it("warns again for a large configuration without blocking it", () => {
    const updateSettings = jest.fn();
    const alert = jest.spyOn(Alert, "alert").mockImplementation();
    const { result } = renderHook(() =>
      useUlraModeControl({
        availableModelCount: 10,
        settings: {
          ...DEFAULT_SETTINGS,
          ulraModeRounds: 10,
          ulraModeWarningAcknowledged: true,
        },
        t: (key) => key,
        updateSettings,
      }),
    );

    act(() => result.current.handleToggle());

    expect(alert.mock.calls[0]?.[0]).toBe("ulraModeHighRiskTitle");
    act(() => alert.mock.calls[0]?.[2]?.[1]?.onPress?.());
    expect(updateSettings).toHaveBeenCalledWith(
      expect.objectContaining({ ulraModeActive: true }),
    );
  });

  it("hides and deactivates the control when fewer than two models are ready", () => {
    const updateSettings = jest.fn();
    const { result } = renderHook(() =>
      useUlraModeControl({
        availableModelCount: 1,
        settings: {
          ...DEFAULT_SETTINGS,
          ulraModeActive: true,
        },
        t: (key) => key,
        updateSettings,
      }),
    );

    expect(result.current.available).toBe(false);
    expect(result.current.active).toBe(false);
    act(() => result.current.handleToggle());
    expect(updateSettings).not.toHaveBeenCalled();
  });
});
