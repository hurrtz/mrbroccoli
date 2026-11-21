import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  getAiSharingSnapshot,
  requestAiSharing,
  subscribeAiSharing,
} from "../../services/aiSharing";
import {
  getNativeRecognitionRoute,
  type NativeRecognitionRoute,
} from "../../services/nativeSpeechCapabilities";
import type { SttLanguage } from "../../types";

export interface RecognitionGrant {
  options: NativeRecognitionRoute;
  allowed: () => boolean;
}

export function useRecognitionPrivacy(
  language: SttLanguage,
  localOnly: boolean,
) {
  const pending = useRef<AbortController | null>(null);
  const active = useRef<
    (RecognitionGrant & { unsubscribe: () => void }) | null
  >(null);
  const [recipient, setRecipient] = useState<string | null>(null);
  const { systemSpeech } = useSyncExternalStore(
    subscribeAiSharing,
    getAiSharingSnapshot,
  );

  // Restore the composer notice for an already blocked system service. With
  // no saved denial the local capability probe can wait until recording starts.
  useEffect(() => {
    let current = true;
    if (localOnly || !Object.values(systemSpeech ?? {}).includes("denied")) {
      setRecipient(null);
      return;
    }
    void getNativeRecognitionRoute(language, localOnly)
      .then((route) => {
        if (current) setRecipient(route?.recipient ?? null);
      })
      .catch(() => {
        if (current) setRecipient(null);
      });
    return () => {
      current = false;
    };
  }, [language, localOnly, systemSpeech]);

  const release = useCallback((grant?: RecognitionGrant | null) => {
    if (!grant || grant === active.current) {
      active.current?.unsubscribe();
      active.current = null;
    }
  }, []);
  const cancelPending = useCallback(() => pending.current?.abort(), []);
  useEffect(
    () => () => {
      cancelPending();
      release();
    },
    [cancelPending, release],
  );

  const prepare = useCallback(
    async (
      ensurePermissions: (recipient?: string) => Promise<void>,
      onRevoked: () => void,
      unavailableMessage: string,
      signal?: AbortSignal,
    ): Promise<RecognitionGrant | null> => {
      if (pending.current || signal?.aborted) return null;
      release();
      const controller = new AbortController();
      pending.current = controller;
      const abort = () => controller.abort();
      signal?.addEventListener("abort", abort);
      try {
        const route = await getNativeRecognitionRoute(language, localOnly);
        if (controller.signal.aborted) return null;
        if (!route) throw new Error(unavailableMessage);
        const id = route.recipient;
        setRecipient(id ?? null);
        const authorization = id
          ? await requestAiSharing(
              { required: [], systemSpeech: id },
              controller.signal,
            )
          : null;
        const allowed = () =>
          !controller.signal.aborted &&
          (!id || authorization?.allowsSystemSpeech?.(id) === true);
        if (!allowed()) return null;
        await ensurePermissions(id);
        if (!allowed()) return null;

        const grant = {
          options: route.options,
          allowed,
          unsubscribe: () => {
            unsubscribe();
            controller.abort();
          },
        };
        const unsubscribe = id
          ? subscribeAiSharing(() => {
              if (active.current === grant && !allowed()) {
                release(grant);
                onRevoked();
              }
            })
          : () => {};
        active.current = grant;
        return grant;
      } finally {
        signal?.removeEventListener("abort", abort);
        if (pending.current === controller) pending.current = null;
      }
    },
    [language, localOnly, release],
  );

  return {
    active,
    blockedSystemSpeech:
      recipient && systemSpeech?.[recipient] === "denied" ? recipient : null,
    cancelPending,
    prepare,
    release,
  };
}
