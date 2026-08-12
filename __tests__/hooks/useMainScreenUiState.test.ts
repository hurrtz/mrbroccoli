import { act, renderHook } from "@testing-library/react-native";

import { useMainScreenUiState } from "../../src/screens/main/useMainScreenUiState";

describe("useMainScreenUiState", () => {
  it("opens and closes settings with an optional runtime-provider focus mapped to the catalog", () => {
    const { result } = renderHook(() => useMainScreenUiState());

    act(() => {
      result.current.openSettings("openai");
    });

    expect(result.current.settingsVisible).toBe(true);
    expect(result.current.settingsFocusCatalogProviderId).toBe("openai");

    act(() => {
      result.current.closeSettings();
    });

    expect(result.current.settingsVisible).toBe(false);
    expect(result.current.settingsFocusCatalogProviderId).toBeUndefined();
  });

  it("opens settings directly with a catalog provider focus", () => {
    const { result } = renderHook(() => useMainScreenUiState());

    act(() => {
      result.current.openCatalogSettings("z-ai-zhipu-ai");
    });

    expect(result.current.settingsVisible).toBe(true);
    expect(result.current.settingsFocusCatalogProviderId).toBe("z-ai-zhipu-ai");

    act(() => {
      result.current.closeSettings();
    });

    expect(result.current.settingsVisible).toBe(false);
    expect(result.current.settingsFocusCatalogProviderId).toBeUndefined();
  });

  it("clears a deep-linked settings page so the next plain open lands on the overview", () => {
    const { result } = renderHook(() => useMainScreenUiState());

    act(() => {
      result.current.openSettings(undefined, undefined, "local");
    });

    expect(result.current.settingsFocusPage).toBe("local");

    act(() => {
      result.current.closeSettings();
    });

    expect(result.current.settingsFocusPage).toBeUndefined();

    act(() => {
      result.current.openCatalogSettings("openai");
    });

    expect(result.current.settingsFocusPage).toBeUndefined();
  });

  it("defers settings actions until the native modal has dismissed", () => {
    const { result } = renderHook(() => useMainScreenUiState());
    const action = jest.fn();

    act(() => result.current.openSettings());
    act(() => result.current.runAfterSettingsDismiss(action));

    expect(result.current.settingsVisible).toBe(false);
    expect(action).not.toHaveBeenCalled();

    act(() => result.current.handleSettingsDismiss());
    expect(action).toHaveBeenCalledTimes(1);
  });

  it("runs deferred settings actions without a native onDismiss event", () => {
    jest.useFakeTimers();
    try {
      const { result } = renderHook(() => useMainScreenUiState());
      const action = jest.fn();

      act(() => result.current.openSettings());
      act(() => result.current.runAfterSettingsDismiss(action));
      act(() => jest.advanceTimersByTime(400));

      expect(action).toHaveBeenCalledTimes(1);
    } finally {
      jest.useRealTimers();
    }
  });

  it("does not run a settings action twice when iOS dismissal beats the fallback", () => {
    jest.useFakeTimers();
    try {
      const { result } = renderHook(() => useMainScreenUiState());
      const action = jest.fn();

      act(() => result.current.openSettings());
      act(() => result.current.runAfterSettingsDismiss(action));
      act(() => {
        result.current.handleSettingsDismiss();
        jest.advanceTimersByTime(400);
      });

      expect(action).toHaveBeenCalledTimes(1);
    } finally {
      jest.useRealTimers();
    }
  });

  it("defers drawer actions until dismissal when the drawer is open", () => {
    const { result } = renderHook(() => useMainScreenUiState());
    const action = jest.fn();

    act(() => {
      result.current.setDrawerVisible(true);
    });

    act(() => {
      result.current.runAfterDrawerDismiss(action);
    });

    expect(action).not.toHaveBeenCalled();
    expect(result.current.drawerVisible).toBe(false);

    act(() => {
      result.current.handleDrawerDismiss();
    });

    expect(action).toHaveBeenCalledTimes(1);
  });

  it("runs deferred drawer actions without a native onDismiss event (Android)", () => {
    jest.useFakeTimers();
    try {
      const { result } = renderHook(() => useMainScreenUiState());
      const action = jest.fn();

      act(() => {
        result.current.setDrawerVisible(true);
      });
      act(() => {
        result.current.runAfterDrawerDismiss(action);
      });

      expect(action).not.toHaveBeenCalled();

      // No handleDrawerDismiss call: Android never delivers Modal onDismiss.
      act(() => {
        jest.advanceTimersByTime(400);
      });

      expect(action).toHaveBeenCalledTimes(1);
    } finally {
      jest.useRealTimers();
    }
  });

  it("does not run a deferred drawer action twice when onDismiss also fires (iOS)", () => {
    jest.useFakeTimers();
    try {
      const { result } = renderHook(() => useMainScreenUiState());
      const action = jest.fn();

      act(() => {
        result.current.setDrawerVisible(true);
      });
      act(() => {
        result.current.runAfterDrawerDismiss(action);
      });
      act(() => {
        result.current.handleDrawerDismiss();
      });
      act(() => {
        jest.advanceTimersByTime(400);
      });

      expect(action).toHaveBeenCalledTimes(1);
    } finally {
      jest.useRealTimers();
    }
  });

  it("defers transcript actions until the native sheet has dismissed", () => {
    const { result } = renderHook(() => useMainScreenUiState());
    const action = jest.fn();

    act(() => {
      result.current.openTranscriptSheet();
    });
    act(() => {
      result.current.runAfterTranscriptDismiss(action);
    });

    expect(action).not.toHaveBeenCalled();
    expect(result.current.transcriptSheetVisible).toBe(false);

    act(() => {
      result.current.handleTranscriptDismiss();
    });

    expect(action).toHaveBeenCalledTimes(1);
  });

  it("runs deferred transcript actions without a native onDismiss event (Android)", () => {
    jest.useFakeTimers();
    try {
      const { result } = renderHook(() => useMainScreenUiState());
      const action = jest.fn();

      act(() => {
        result.current.openTranscriptSheet();
      });
      act(() => {
        result.current.runAfterTranscriptDismiss(action);
      });
      act(() => {
        jest.advanceTimersByTime(400);
      });

      expect(action).toHaveBeenCalledTimes(1);
    } finally {
      jest.useRealTimers();
    }
  });

  it("does not run a transcript action twice when iOS dismissal beats the fallback", () => {
    jest.useFakeTimers();
    try {
      const { result } = renderHook(() => useMainScreenUiState());
      const action = jest.fn();

      act(() => {
        result.current.openTranscriptSheet();
      });
      act(() => {
        result.current.runAfterTranscriptDismiss(action);
      });
      act(() => {
        result.current.handleTranscriptDismiss();
        jest.advanceTimersByTime(400);
      });

      expect(action).toHaveBeenCalledTimes(1);
    } finally {
      jest.useRealTimers();
    }
  });

  it("opens and clears the memory modal state", () => {
    const { result } = renderHook(() => useMainScreenUiState());
    const conversation = {
      id: "conversation-1",
      title: "Test conversation",
      createdAt: "2026-03-22T10:00:00.000Z",
      updatedAt: "2026-03-22T10:00:00.000Z",
      messages: [],
    };

    act(() => {
      result.current.openMemoryConversation(conversation);
    });

    expect(result.current.memoryVisible).toBe(true);
    expect(result.current.memoryConversation).toEqual(conversation);

    act(() => {
      result.current.closeMemory();
    });

    expect(result.current.memoryVisible).toBe(false);
    expect(result.current.memoryConversation).toBeNull();
  });
});
