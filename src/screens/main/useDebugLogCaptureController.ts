import { useCallback, useEffect, useState } from "react";

import type { PipelinePhase } from "../../hooks/useVoicePipeline";
import {
  getDebugLogCaptureState,
  recoverPendingDebugLogCapture,
  recordDebugLogEvent,
  startDebugLogCapture,
  stopDebugLogCapture,
  subscribeToDebugLogCapture,
} from "../../services/debugLogCapture";
import { buildDebugRuntimeContext } from "../../services/debugRuntimeContext";
import type {
  InputMode,
  Provider,
  ReplyPlayback,
  SttBackendMode,
  TtsBackendMode,
} from "../../types";
import type { ShowToastFn, TranslateFn } from "./shared";

interface DebugLogCaptureControllerParams {
  activeConversationId: string | null;
  inputMode: InputMode;
  model: string;
  modelEffort?: string;
  appLanguage: string;
  isLandscape: boolean;
  kokoroState: {
    busy: string | null;
    installed: boolean;
    phase: string | null;
    progress: number;
    verified: boolean;
  };
  pipelinePhase: PipelinePhase;
  provider: Provider;
  replyPlayback: ReplyPlayback;
  selectedSttModel: string;
  selectedTtsModel: string;
  selectedTtsVoice: string;
  showToast: ShowToastFn;
  spokenRepliesEnabled: boolean;
  sttMode: SttBackendMode;
  sttProvider: Provider | null;
  t: TranslateFn;
  ttsMode: TtsBackendMode;
  ttsProvider: Provider | null;
  ttsFallbackRoutes: readonly string[];
  webSearchMode: string;
  webSearchProvider: string | null;
}

export function useDebugLogCaptureController({
  activeConversationId,
  inputMode,
  model,
  modelEffort,
  appLanguage,
  isLandscape,
  kokoroState,
  pipelinePhase,
  provider,
  replyPlayback,
  selectedSttModel,
  selectedTtsModel,
  selectedTtsVoice,
  showToast,
  spokenRepliesEnabled,
  sttMode,
  sttProvider,
  t,
  ttsMode,
  ttsProvider,
  ttsFallbackRoutes,
  webSearchMode,
  webSearchProvider,
}: DebugLogCaptureControllerParams) {
  const [captureActive, setCaptureActive] = useState(
    () => getDebugLogCaptureState().active,
  );

  useEffect(() => {
    const syncState = () => setCaptureActive(getDebugLogCaptureState().active);
    syncState();
    return subscribeToDebugLogCapture(syncState);
  }, []);

  const buildCaptureContext = useCallback(
    () => ({
      activeConversationId,
      inputMode,
      model,
      modelEffort: modelEffort ?? null,
      appLanguage,
      isLandscape,
      kokoro: kokoroState,
      pipelinePhase,
      provider,
      replyPlayback,
      spokenRepliesEnabled,
      sttMode,
      sttProvider,
      sttModel: selectedSttModel,
      ttsMode,
      ttsProvider,
      ttsModel: selectedTtsModel,
      ttsVoice: selectedTtsVoice || null,
      ttsFallbackRoutes,
      webSearchMode,
      webSearchProvider,
    }),
    [
      activeConversationId,
      inputMode,
      model,
      modelEffort,
      appLanguage,
      isLandscape,
      kokoroState,
      pipelinePhase,
      provider,
      replyPlayback,
      selectedSttModel,
      selectedTtsModel,
      selectedTtsVoice,
      spokenRepliesEnabled,
      sttMode,
      sttProvider,
      ttsMode,
      ttsProvider,
      ttsFallbackRoutes,
      webSearchMode,
      webSearchProvider,
    ],
  );

  const handleToggle = useCallback(async () => {
    if (!captureActive) {
      try {
        const context = await buildDebugRuntimeContext(buildCaptureContext());
        await startDebugLogCapture(context);
        showToast(t("debugLogCaptureStarted"));
      } catch (error) {
        recordDebugLogEvent({
          event: "debug-log-start-failed",
          level: "error",
          payload: { error },
        });
        showToast(t("debugLogCaptureFailed"), undefined, "danger");
      }
      return;
    }

    try {
      const result = await stopDebugLogCapture(buildCaptureContext());
      if (!result) {
        return;
      }

      const fileName =
        result.path.split("/").filter(Boolean).pop() ??
        result.sessionId ??
        "debug-log.log";
      showToast(
        result.copiedToClipboard
          ? t("debugLogCaptureStopped", {
              entryCount: result.entryCount,
              fileName,
            })
          : t("debugLogCaptureStoppedNoClipboard", {
              entryCount: result.entryCount,
              fileName,
            }),
        undefined,
        "success",
      );
    } catch (error) {
      recordDebugLogEvent({
        event: "debug-log-stop-failed",
        level: "error",
        payload: { error },
      });
      showToast(t("debugLogCaptureFailed"), undefined, "danger");
    }
  }, [buildCaptureContext, captureActive, showToast, t]);

  useEffect(() => {
    let cancelled = false;

    void recoverPendingDebugLogCapture()
      .then((result) => {
        if (cancelled || !result) {
          return;
        }

        const fileName =
          result.path.split("/").filter(Boolean).pop() ??
          result.sessionId ??
          "recovered-debug-log.log";
        showToast(
          result.copiedToClipboard
            ? t("debugLogCaptureRecovered", {
                entryCount: result.entryCount,
                fileName,
              })
            : t("debugLogCaptureRecoveredNoClipboard", {
                entryCount: result.entryCount,
                fileName,
              }),
          undefined,
          "success",
        );
      })
      .catch((error) => {
        recordDebugLogEvent({
          event: "debug-log-recovery-failed",
          level: "error",
          payload: { error },
        });
      });

    return () => {
      cancelled = true;
    };
  }, [showToast, t]);

  return {
    captureState: { active: captureActive },
    handleToggle,
  };
}
