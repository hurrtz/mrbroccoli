import { act, renderHook } from "@testing-library/react-native";

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

    expect(result.current.confirmation).toMatchObject({
      calls: 10,
      models: 3,
      rounds: 2,
      title: expect.stringContaining("ulraModeFirstUseTitle"),
    });
    act(() => result.current.confirmEnable());
    expect(updateSettings).toHaveBeenCalledWith({
      ulraModeActive: true,
      ulraModeWarningAcknowledged: true,
    });
  });

  it("warns again for a large configuration without blocking it", () => {
    const updateSettings = jest.fn();
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

    expect(result.current.confirmation?.title).toBe("ulraModeHighRiskTitle");
    act(() => result.current.confirmEnable());
    expect(updateSettings).toHaveBeenCalledWith(
      expect.objectContaining({ ulraModeActive: true }),
    );
  });

  it("leaves Model Council off when disclosure is cancelled", () => {
    const updateSettings = jest.fn();
    const { result } = renderHook(() =>
      useUlraModeControl({
        availableModelCount: 3,
        settings: DEFAULT_SETTINGS,
        t: (key) => key,
        updateSettings,
      }),
    );

    act(() => result.current.handleToggle());
    act(() => result.current.cancelConfirmation());

    expect(result.current.confirmation).toBeNull();
    expect(updateSettings).not.toHaveBeenCalled();
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
