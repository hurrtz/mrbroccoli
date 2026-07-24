import { useCallback, useEffect, useRef } from "react";

import { cleanupCapturedAudio } from "../../services/voicePipeline/cleanup";

export function useRetryableVoiceCapture() {
  const retainedCaptureRef = useRef<string | null>(null);

  const discardRetainedCapture = useCallback((audioUri?: string) => {
    const retainedCapture = retainedCaptureRef.current;

    if (!retainedCapture || (audioUri && retainedCapture !== audioUri)) {
      return;
    }

    retainedCaptureRef.current = null;
    void cleanupCapturedAudio(retainedCapture);
  }, []);

  const prepareCaptureForTurn = useCallback((audioUri?: string) => {
    const retainedCapture = retainedCaptureRef.current;
    retainedCaptureRef.current = null;

    if (retainedCapture && retainedCapture !== audioUri) {
      void cleanupCapturedAudio(retainedCapture);
    }
  }, []);

  const retainCaptureForRetry = useCallback((audioUri?: string) => {
    if (!audioUri || retainedCaptureRef.current === audioUri) {
      return;
    }

    const previousCapture = retainedCaptureRef.current;
    retainedCaptureRef.current = audioUri;

    if (previousCapture) {
      void cleanupCapturedAudio(previousCapture);
    }
  }, []);

  useEffect(
    () => () => {
      const retainedCapture = retainedCaptureRef.current;
      retainedCaptureRef.current = null;

      if (retainedCapture) {
        void cleanupCapturedAudio(retainedCapture);
      }
    },
    [],
  );

  return {
    discardRetainedCapture,
    prepareCaptureForTurn,
    retainCaptureForRetry,
  };
}
