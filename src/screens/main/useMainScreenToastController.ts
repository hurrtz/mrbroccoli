import { useCallback, useEffect, useRef, useState } from "react";

import { recordDebugLogEvent } from "../../services/debugLogCapture";
import type { ToastTone } from "../../types";
import type { ShowToastFn } from "./shared";

interface MainScreenToast {
  message: string;
  onRetry?: () => void;
  tone?: ToastTone;
}

export function useMainScreenToastController() {
  const [toast, setToast] = useState<MainScreenToast | null>(null);
  const dismissActionRef = useRef<(() => void) | null>(null);

  const showToast: ShowToastFn = useCallback(
    (message, onRetry, tone = "info", onDismiss) => {
      recordDebugLogEvent({
        event: "toast-shown",
        payload: {
          hasRetry: Boolean(onRetry),
          message,
          tone,
        },
      });
      dismissActionRef.current?.();
      dismissActionRef.current = onDismiss ?? null;
      setToast({ message, onRetry, tone });
    },
    [],
  );

  const dismissToast = useCallback(() => {
    const onDismiss = dismissActionRef.current;
    dismissActionRef.current = null;
    onDismiss?.();
    setToast(null);
  }, []);

  useEffect(
    () => () => {
      dismissActionRef.current?.();
      dismissActionRef.current = null;
    },
    [],
  );

  return {
    dismissToast,
    showToast,
    toast,
  };
}
