import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

import {
  downloadKokoroModel,
  getKokoroInstallStatus,
  installKokoroLifecycleGuard,
  removeKokoroModel,
  verifyKokoroModel,
  type KokoroDownloadProgress,
} from "../services/kokoroTts";

export type KokoroModelState = {
  installed: boolean;
  verified: boolean;
  busy: "checking" | "downloading" | "removing" | "verifying" | null;
  phase: KokoroDownloadProgress["phase"] | null;
  progress: number;
  error: string | null;
};

export type KokoroModelController = KokoroModelState & {
  download: () => Promise<boolean>;
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

    try {
      const status = await getKokoroInstallStatus();

      if (!mountedRef.current || operationRef.current !== operation) {
        return;
      }

      setState((current) => ({
        installed: status.installed,
        verified: status.installed ? current.verified : false,
        busy: null,
        phase: null,
        progress: status.installed ? 1 : 0,
        error: null,
      }));
    } catch (error) {
      if (!mountedRef.current || operationRef.current !== operation) {
        return;
      }

      setState((current) => ({
        ...current,
        busy: null,
        error: normalizeError(error),
      }));
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

  const download = useCallback(async () => {
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

    try {
      await downloadKokoroModel({
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
      await verifyKokoroModel();

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
      return true;
    } catch (error) {
      if (mountedRef.current && operationRef.current === operation) {
        const status = await getKokoroInstallStatus().catch(() => ({
          installed: false,
        }));

        if (!mountedRef.current || operationRef.current !== operation) {
          return false;
        }

        setState({
          installed: status.installed,
          verified: false,
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
      return true;
    } catch (error) {
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
