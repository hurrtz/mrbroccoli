import { useCallback, useEffect, useRef, useState } from "react";

import {
  fetchMistralVoices,
  type MistralVoice,
  type MistralVoiceDirectoryStatus,
} from "../services/mistralVoices";

export function useMistralVoices(params: {
  apiKey: string;
  enabled: boolean;
}) {
  const { apiKey, enabled } = params;
  const [voices, setVoices] = useState<MistralVoice[]>([]);
  const [status, setStatus] =
    useState<MistralVoiceDirectoryStatus>("idle");
  const [error, setError] = useState<Error | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const voicesRef = useRef<MistralVoice[]>([]);
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
      const nextVoices = await fetchMistralVoices({
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
        console.error(
          "[mistral-voices] failed to load voice directory",
          normalizedError,
        );
        setStatus("error");
        setError(normalizedError);
      }

      return [];
    } finally {
      if (requestIdRef.current === requestId) {
        abortRef.current = null;
      }
    }
  }, [apiKey, enabled]);

  useEffect(() => {
    void refresh();

    return () => {
      abortRef.current?.abort();
    };
  }, [refresh]);

  return {
    voices,
    status,
    error,
    refresh,
  };
}
