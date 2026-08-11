import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import type { SpeechLanguage } from "../constants/speechLanguages";

import {
  downloadKokoroModel,
  getKokoroInstallReadiness,
  installKokoroLifecycleGuard,
  removeKokoroModel,
  verifyKokoroModel,
  type KokoroDownloadProgress,
} from "../services/kokoroTts";
import { recordDebugLogEvent } from "../services/debugLogCapture";

export type KokoroModelState = {
  installed: boolean;
  verified: boolean;
  busy: "checking" | "downloading" | "removing" | "verifying" | null;
  phase: KokoroDownloadProgress["phase"] | null;
  progress: number;
  error: string | null;
};

export type KokoroModelController = KokoroModelState & {
  download: (options?: {
    signal?: AbortSignal;
    phonemeLanguages?: SpeechLanguage[];
  }) => Promise<boolean>;
  refresh: () => Promise<void>;
  remove: () => Promise<boolean>;
};

const INITIAL_STATE: KokoroModelState = {
  installed: false,
  verified: false,
  busy: "checking",
  phase: null,
  progress: 0,
  error: null,
};

function normalizeError(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Kokoro could not be prepared on this device.";
}

export function useKokoroModel(): KokoroModelController {
  const [state, setState] = useState<KokoroModelState>(INITIAL_STATE);
  const operationRef = useRef(0);
  const blockingOperationRef = useRef(false);
  const mountedRef = useRef(true);
  const lastProgressBucketRef = useRef(-1);

  const refresh = useCallback(async () => {
    if (blockingOperationRef.current) {
      return;
    }

    const operation = operationRef.current + 1;
    operationRef.current = operation;
    setState((current) => ({
      ...current,
      busy: "checking",
      error: null,
    }));
    recordDebugLogEvent({
      event: "kokoro-install-status-check-started",
      payload: { operation },
    });

    try {
      const status = await getKokoroInstallReadiness();

      if (!mountedRef.current || operationRef.current !== operation) {
        return;
      }

      setState({
        installed: status.installed,
        verified: status.verified,
        busy: null,
        phase: null,
        progress: status.installed ? 1 : 0,
        error: null,
      });
      recordDebugLogEvent({
        event: "kokoro-install-status-check-completed",
        payload: {
          installed: status.installed,
          verified: status.verified,
          operation,
        },
      });
    } catch (error) {
      if (!mountedRef.current || operationRef.current !== operation) {
        return;
      }

      setState((current) => ({
        ...current,
        busy: null,
        error: normalizeError(error),
      }));
      recordDebugLogEvent({
        event: "kokoro-install-status-check-failed",
        level: "warn",
        payload: { error, operation },
      });
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    const uninstallLifecycleGuard = installKokoroLifecycleGuard();
    void refresh();
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        void refresh();
      }
    });

    return () => {
      mountedRef.current = false;
      subscription.remove();
      uninstallLifecycleGuard();
    };
  }, [refresh]);

  const download = useCallback(async (options?: {
    signal?: AbortSignal;
    phonemeLanguages?: SpeechLanguage[];
  }) => {
    if (blockingOperationRef.current) {
      return false;
    }

    blockingOperationRef.current = true;
    const operation = operationRef.current + 1;
    operationRef.current = operation;
    setState({
      installed: false,
      verified: false,
      busy: "downloading",
      phase: "downloading",
      progress: 0,
      error: null,
    });
    lastProgressBucketRef.current = -1;
    recordDebugLogEvent({
      event: "kokoro-download-started",
      payload: { operation },
    });

    try {
      await downloadKokoroModel({
        abortSignal: options?.signal,
        phonemeLanguages: options?.phonemeLanguages,
        onProgress: ({ phase, progress }) => {
          if (!mountedRef.current || operationRef.current !== operation) {
            return;
          }

          setState((current) => ({
            ...current,
            busy: "downloading",
            phase,
            progress,
          }));
          const bucket = Math.floor(progress * 10);
          if (bucket !== lastProgressBucketRef.current) {
            lastProgressBucketRef.current = bucket;
            recordDebugLogEvent({
              event: "kokoro-download-progress",
              payload: { operation, phase, progressPercent: bucket * 10 },
            });
          }
        },
      });

      if (!mountedRef.current || operationRef.current !== operation) {
        return false;
      }

      setState((current) => ({
        ...current,
        installed: true,
        busy: "verifying",
        phase: null,
        progress: 1,
      }));
      recordDebugLogEvent({
        event: "kokoro-verification-started",
        payload: { operation },
      });
      await verifyKokoroModel({
        language:
          options?.phonemeLanguages?.includes("en") === false &&
          options?.phonemeLanguages?.includes("zh-CN")
            ? "zh"
            : "en",
      });

      if (!mountedRef.current || operationRef.current !== operation) {
        return false;
      }

      setState({
        installed: true,
        verified: true,
        busy: null,
        phase: null,
        progress: 1,
        error: null,
      });
      recordDebugLogEvent({
        event: "kokoro-download-completed",
        payload: { operation, verified: true },
      });
      return true;
    } catch (error) {
      recordDebugLogEvent({
        event: "kokoro-download-failed",
        level: "warn",
        payload: { error, operation },
      });
      if (mountedRef.current && operationRef.current === operation) {
        const status = await getKokoroInstallReadiness().catch(() => ({
          installed: false,
          verified: false,
        }));

        if (!mountedRef.current || operationRef.current !== operation) {
          return false;
        }

        setState({
          installed: status.installed,
          verified: status.verified,
          busy: null,
          phase: null,
          progress: status.installed ? 1 : 0,
          error: normalizeError(error),
        });
      }
      return false;
    } finally {
      blockingOperationRef.current = false;
    }
  }, []);

  const remove = useCallback(async () => {
    if (blockingOperationRef.current) {
      return false;
    }

    blockingOperationRef.current = true;
    const operation = operationRef.current + 1;
    operationRef.current = operation;
    setState((current) => ({
      ...current,
      busy: "removing",
      error: null,
    }));
    recordDebugLogEvent({
      event: "kokoro-removal-started",
      payload: { operation },
    });

    try {
      await removeKokoroModel();

      if (!mountedRef.current || operationRef.current !== operation) {
        return false;
      }

      setState({
        installed: false,
        verified: false,
        busy: null,
        phase: null,
        progress: 0,
        error: null,
      });
      recordDebugLogEvent({
        event: "kokoro-removal-completed",
        payload: { operation },
      });
      return true;
    } catch (error) {
      recordDebugLogEvent({
        event: "kokoro-removal-failed",
        level: "warn",
        payload: { error, operation },
      });
      if (mountedRef.current && operationRef.current === operation) {
        setState((current) => ({
          ...current,
          busy: null,
          error: normalizeError(error),
        }));
      }
      return false;
    } finally {
      blockingOperationRef.current = false;
    }
  }, []);

  return {
    ...state,
    download,
    refresh,
    remove,
  };
}
