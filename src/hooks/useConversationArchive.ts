import * as React from "react";

import type { useConversations } from "./useConversations";
import {
  clearConversationArchiveConfig,
  ConversationArchiveError,
  type ConversationArchiveConfig,
  type ConversationArchiveErrorCode,
  isConversationArchivePickerCancellation,
  loadConversationArchiveConfig,
  pickConversationArchiveDirectory,
  saveConversationArchiveConfig,
  syncConversationArchive,
} from "../services/conversationArchive";
import { recordDebugLogEvent } from "../services/debugLogCapture";

type ConversationsApi = ReturnType<typeof useConversations>;

export interface ConversationArchiveController {
  chooseDirectory: () => Promise<void>;
  configured: boolean;
  directoryName: string | null;
  disconnect: () => Promise<void>;
  error: ConversationArchiveErrorCode | null;
  lastSyncedAt: string | null;
  loaded: boolean;
  syncNow: () => Promise<void>;
  syncing: boolean;
}

export function useConversationArchive(params: {
  activeConversationId: string | null;
  conversationMetas: ConversationsApi["conversations"];
  conversationsLoaded: boolean;
  getConversationById: ConversationsApi["getConversationById"];
}): ConversationArchiveController {
  const [config, setConfigState] =
    React.useState<ConversationArchiveConfig | null>(null);
  const [loaded, setLoaded] = React.useState(false);
  const [syncing, setSyncing] = React.useState(false);
  const [error, setError] = React.useState<ConversationArchiveErrorCode | null>(
    null,
  );
  const configRef = React.useRef<ConversationArchiveConfig | null>(null);
  const paramsRef = React.useRef(params);
  const syncingRef = React.useRef(false);
  const choosingRef = React.useRef(false);
  const rerunRef = React.useRef(false);
  paramsRef.current = params;

  const setConfig = React.useCallback(
    (nextConfig: ConversationArchiveConfig | null) => {
      configRef.current = nextConfig;
      setConfigState(nextConfig);
    },
    [],
  );

  React.useEffect(() => {
    let active = true;
    void loadConversationArchiveConfig()
      .then((storedConfig) => {
        if (active) {
          setConfig(storedConfig);
        }
      })
      .catch(() => {
        if (active) {
          setError("access-lost");
        }
      })
      .finally(() => {
        if (active) {
          setLoaded(true);
        }
      });
    return () => {
      active = false;
    };
  }, [setConfig]);

  const syncNow = React.useCallback(async () => {
    if (!configRef.current || !paramsRef.current.conversationsLoaded) {
      return;
    }
    if (syncingRef.current) {
      rerunRef.current = true;
      return;
    }

    syncingRef.current = true;
    setSyncing(true);
    const startedAtMs = Date.now();
    recordDebugLogEvent({ event: "conversation-archive-sync-started" });
    try {
      do {
        rerunRef.current = false;
        const currentConfig = configRef.current;
        if (!currentConfig) {
          break;
        }
        const currentParams = paramsRef.current;
        const result = await syncConversationArchive({
          activeConversationId: currentParams.activeConversationId,
          config: currentConfig,
          conversationMetas: currentParams.conversationMetas,
          getConversationById: currentParams.getConversationById,
        });
        setConfig(result.config);
        setError(null);
        recordDebugLogEvent({
          event: "conversation-archive-sync-completed",
          payload: {
            conversationCount: result.conversationCount,
            durationMs: Date.now() - startedAtMs,
          },
        });
      } while (rerunRef.current);
    } catch (syncError) {
      const code =
        syncError instanceof ConversationArchiveError
          ? syncError.code
          : "sync-failed";
      setError(code);
      recordDebugLogEvent({
        event: "conversation-archive-sync-failed",
        level: "warn",
        payload: { code, durationMs: Date.now() - startedAtMs },
      });
    } finally {
      syncingRef.current = false;
      setSyncing(false);
    }
  }, [setConfig]);

  const chooseDirectory = React.useCallback(async () => {
    if (syncingRef.current || choosingRef.current) {
      return;
    }
    choosingRef.current = true;
    setSyncing(true);
    let shouldSync = false;
    try {
      const nextConfig = await pickConversationArchiveDirectory(
        configRef.current,
      );
      await saveConversationArchiveConfig(nextConfig);
      setConfig(nextConfig);
      setError(null);
      shouldSync = true;
    } catch (pickerError) {
      if (isConversationArchivePickerCancellation(pickerError)) {
        return;
      }
      setError(
        pickerError instanceof ConversationArchiveError
          ? pickerError.code
          : "sync-failed",
      );
    } finally {
      choosingRef.current = false;
      setSyncing(false);
    }
    if (shouldSync) {
      await syncNow();
    }
  }, [setConfig, syncNow]);

  const disconnect = React.useCallback(async () => {
    if (syncingRef.current) {
      return;
    }
    try {
      await clearConversationArchiveConfig();
      setConfig(null);
      setError(null);
    } catch {
      setError("sync-failed");
    }
  }, [setConfig]);

  const fingerprint = React.useMemo(
    () =>
      JSON.stringify({
        activeConversationId: params.activeConversationId,
        conversations: params.conversationMetas.map((meta) => [
          meta.id,
          meta.title,
          meta.updatedAt,
          meta.messageCount,
          meta.pinned,
        ]),
      }),
    [params.activeConversationId, params.conversationMetas],
  );
  const configuredDirectoryUri = config?.directoryUri;

  React.useEffect(() => {
    if (!loaded || !configuredDirectoryUri || !params.conversationsLoaded) {
      return;
    }
    const timeout = setTimeout(() => {
      void syncNow();
    }, 1_500);
    return () => clearTimeout(timeout);
  }, [
    configuredDirectoryUri,
    fingerprint,
    loaded,
    params.conversationsLoaded,
    syncNow,
  ]);

  return {
    chooseDirectory,
    configured: config !== null,
    directoryName: config?.directoryName ?? null,
    disconnect,
    error,
    lastSyncedAt: config?.lastSyncedAt ?? null,
    loaded,
    syncNow,
    syncing,
  };
}
