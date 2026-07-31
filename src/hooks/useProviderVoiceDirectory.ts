import { useCallback, useEffect, useRef, useState } from "react";

import {
  fetchProviderVoices,
  type ProviderVoice,
  type ProviderVoiceDirectoryStatus,
} from "../services/providerVoiceDirectory";
import { recordDebugLogEvent } from "../services/debugLogCapture";
import type { Provider } from "../types";

export function useProviderVoiceDirectory(params: {
  provider: Provider;
  apiKey: string;
  enabled: boolean;
}) {
  const { provider, apiKey, enabled } = params;
  const [voices, setVoices] = useState<ProviderVoice[]>([]);
  const [status, setStatus] =
    useState<ProviderVoiceDirectoryStatus>("idle");
  const [error, setError] = useState<Error | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const voicesRef = useRef<ProviderVoice[]>([]);
  const apiKeyRef = useRef("");

  const refresh = useCallback(async () => {
    const selectedApiKey = apiKey.trim();

    if (!enabled || !selectedApiKey) {
      abortRef.current?.abort();
      abortRef.current = null;
      requestIdRef.current += 1;
      voicesRef.current = [];
      apiKeyRef.current = "";
      setVoices([]);
      setStatus("idle");
      setError(null);
      return [];
    }

    abortRef.current?.abort();
    const apiKeyChanged = apiKeyRef.current !== selectedApiKey;

    if (apiKeyChanged) {
      apiKeyRef.current = selectedApiKey;
      voicesRef.current = [];
      setVoices([]);
    }

    const controller = new AbortController();
    const requestId = requestIdRef.current + 1;
    abortRef.current = controller;
    requestIdRef.current = requestId;
    setStatus(
      !apiKeyChanged && voicesRef.current.length > 0
        ? "refreshing"
        : "loading",
    );
    setError(null);

    try {
      const nextVoices = await fetchProviderVoices({
        provider,
        apiKey: selectedApiKey,
        signal: controller.signal,
      });

      if (requestIdRef.current !== requestId) {
        return nextVoices;
      }

      voicesRef.current = nextVoices;
      setVoices(nextVoices);
      setStatus("ready");
      return nextVoices;
    } catch (nextError) {
      if (
        controller.signal.aborted ||
        (nextError instanceof Error && nextError.name === "AbortError")
      ) {
        return [];
      }

      const normalizedError =
        nextError instanceof Error ? nextError : new Error(String(nextError));

      if (requestIdRef.current === requestId) {
        recordDebugLogEvent({
          event: "provider-voice-directory-load-failed",
          level: "error",
          payload: { error: normalizedError, provider },
        });
        setStatus("error");
        setError(normalizedError);
      }

      return [];
    } finally {
      if (requestIdRef.current === requestId) {
        abortRef.current = null;
      }
    }
  }, [apiKey, enabled, provider]);

  useEffect(() => {
    if (!enabled || !apiKey.trim()) {
      void refresh();
      return () => {
        abortRef.current?.abort();
      };
    }

    const refreshTimer = setTimeout(() => {
      void refresh();
    }, 400);

    return () => {
      clearTimeout(refreshTimer);
      abortRef.current?.abort();
    };
  }, [apiKey, enabled, refresh]);

  return {
    voices,
    status,
    error,
    refresh,
  };
}
