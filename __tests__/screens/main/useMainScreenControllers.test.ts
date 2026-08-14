import { act, renderHook } from "@testing-library/react-native";

import { translate } from "../../../src/i18n";
import { useMainScreenComposerDraft } from "../../../src/screens/main/useMainScreenComposerDraft";
import { useMainScreenReplyReplay } from "../../../src/screens/main/useMainScreenReplyReplay";
import { useMainScreenResponseModeSelection } from "../../../src/screens/main/useMainScreenResponseModeSelection";
import { useMainScreenToastController } from "../../../src/screens/main/useMainScreenToastController";
import { DEFAULT_SETTINGS } from "../../../src/types";

jest.mock("expo-clipboard", () => ({
  setStringAsync: jest.fn(async () => undefined),
}));

jest.mock("expo-file-system/legacy", () => ({
  cacheDirectory: "file:///tmp/",
  documentDirectory: "file:///tmp/",
  writeAsStringAsync: jest.fn(async () => undefined),
}));

describe("main screen focused controllers", () => {
  it("preserves composer draft state without rerendering the screen", () => {
    const { result } = renderHook(() => useMainScreenComposerDraft());

    act(() => {
      result.current.handleInputSurfaceChange("text");
      result.current.handleTextInputFocusChange(true);
      result.current.handleTextMessageChange("A retained draft");
    });

    expect(result.current.inputSurfaceRef.current).toBe("text");
    expect(result.current.textInputFocusedRef.current).toBe(true);
    expect(result.current.textMessageDraftRef.current).toBe("A retained draft");

    act(() => {
      result.current.handleTextInputFocusChange(false);
    });
    expect(result.current.textInputFocusedRef.current).toBe(false);
  });

  it("runs toast cleanup on replacement, dismissal, and unmount", () => {
    const firstCleanup = jest.fn();
    const secondCleanup = jest.fn();
    const unmountCleanup = jest.fn();
    const { result, unmount } = renderHook(() =>
      useMainScreenToastController(),
    );

    act(() => {
      result.current.showToast("First", undefined, "info", firstCleanup);
      result.current.showToast("Second", undefined, "danger", secondCleanup);
    });
    expect(firstCleanup).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.dismissToast();
    });
    expect(secondCleanup).toHaveBeenCalledTimes(1);
    expect(result.current.toast).toBeNull();

    act(() => {
      result.current.showToast(
        "Unmounting",
        undefined,
        "info",
        unmountCleanup,
      );
    });
    unmount();
    expect(unmountCleanup).toHaveBeenCalledTimes(1);
  });

  it("guards response-mode changes by provider credential", () => {
    const updateActiveResponseMode = jest.fn();
    const showToast = jest.fn();
    const settings = {
      ...DEFAULT_SETTINGS,
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        openai: "",
      },
      responseModes: [
        {
          id: "mode-1",
          route: { provider: "openai" as const, model: "gpt-5.6-sol" },
        },
        {
          id: "mode-2",
          route: { provider: "openai" as const, model: "gpt-5.6-terra" },
        },
      ],
    };
    const { result, rerender } = renderHook(
      ({ currentSettings }) =>
        useMainScreenResponseModeSelection({
          activeResponseMode: "mode-1",
          settings: currentSettings,
          showToast,
          t: (key, params) => translate("en", key, params),
          updateActiveResponseMode,
        }),
      { initialProps: { currentSettings: settings } },
    );

    act(() => {
      result.current("mode-2");
    });
    expect(updateActiveResponseMode).not.toHaveBeenCalled();
    expect(showToast).toHaveBeenCalledWith(
      "Add credentials for OpenAI in Settings before using this route.",
    );

    rerender({
      currentSettings: {
        ...settings,
        apiKeys: { ...settings.apiKeys, openai: "sk-test" },
      },
    });
    act(() => {
      result.current("mode-2");
    });
    expect(updateActiveResponseMode).toHaveBeenCalledWith("mode-2");
  });

  it("stops the active replay or starts the selected message replay", async () => {
    const handleRepeatLastReply = jest.fn(async () => undefined);
    const stopReplay = jest.fn(async () => undefined);
    const { result, rerender } = renderHook(
      ({ activeReplayMessageId }) =>
        useMainScreenReplyReplay({
          activeReplayMessageId,
          handleRepeatLastReply,
          stopReplay,
        }),
      { initialProps: { activeReplayMessageId: "message-1" as string | null } },
    );

    await act(async () => {
      await result.current({ id: "message-1", content: "Stop me" });
    });
    expect(stopReplay).toHaveBeenCalledTimes(1);
    expect(handleRepeatLastReply).not.toHaveBeenCalled();

    rerender({ activeReplayMessageId: null });
    await act(async () => {
      await result.current({ id: "message-2", content: "Replay me" });
    });
    expect(handleRepeatLastReply).toHaveBeenCalledWith(
      "Replay me",
      "message-2",
    );
  });
});
