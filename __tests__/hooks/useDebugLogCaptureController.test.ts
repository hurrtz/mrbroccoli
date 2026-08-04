import { act, renderHook } from "@testing-library/react-native";

import { useDebugLogCaptureController } from "../../src/screens/main/useDebugLogCaptureController";
import { archiveDebugLogInConversationArchive } from "../../src/services/conversationArchive";
import { stopDebugLogCapture } from "../../src/services/debugLogCapture";

jest.mock("../../src/services/conversationArchive", () => ({
  archiveDebugLogInConversationArchive: jest.fn(async () => ({
    archived: true,
    fileName: "debug-log-100-safe.log",
  })),
}));

jest.mock("../../src/services/debugRuntimeContext", () => ({
  buildDebugRuntimeContext: jest.fn(async (context) => context),
}));

jest.mock("../../src/services/debugLogCapture", () => ({
  getDebugLogCaptureState: jest.fn(() => ({ active: true })),
  recoverPendingDebugLogCapture: jest.fn(async () => null),
  recordDebugLogEvent: jest.fn(),
  startDebugLogCapture: jest.fn(),
  stopDebugLogCapture: jest.fn(async () => ({
    content: "# Sanitized debug log",
    copiedToClipboard: false,
    entryCount: 3,
    path: "file:///documents/debug-logs/debug-log-100-safe.log",
    sessionId: "debug-log-100-safe",
    validationIssueCount: 0,
  })),
  subscribeToDebugLogCapture: jest.fn(() => () => undefined),
}));

describe("useDebugLogCaptureController", () => {
  it("mirrors a completed capture into the configured conversation archive", async () => {
    const showToast = jest.fn();
    const { result } = renderHook(() =>
      useDebugLogCaptureController({
        activeConversationId: null,
        appLanguage: "en",
        inputMode: "toggle-to-talk",
        isLandscape: false,
        kokoroState: {
          busy: null,
          installed: false,
          phase: null,
          progress: 0,
          verified: false,
        },
        model: "Qwen",
        pipelinePhase: "idle",
        provider: "openai",
        replyPlayback: "stream",
        selectedSttModel: "",
        selectedTtsModel: "",
        selectedTtsVoice: "",
        showToast,
        spokenRepliesEnabled: true,
        sttMode: "local",
        sttProvider: null,
        t: ((key: string) => key) as never,
        ttsFallbackRoutes: [],
        ttsMode: "native",
        ttsProvider: null,
        webSearchMode: "off",
        webSearchProvider: null,
      }),
    );

    await act(async () => {
      await result.current.handleToggle();
    });

    expect(stopDebugLogCapture).toHaveBeenCalledTimes(1);
    expect(archiveDebugLogInConversationArchive).toHaveBeenCalledWith({
      content: "# Sanitized debug log",
      fileName: "debug-log-100-safe.log",
    });
    expect(showToast).toHaveBeenCalledWith(
      "debugLogCaptureStoppedNoClipboard",
      undefined,
      "success",
    );
  });
});
