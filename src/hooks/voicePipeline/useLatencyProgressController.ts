import {
  useCallback,
  useEffect,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";

import { recordDebugLogEvent } from "../../services/debugLogCapture";
import {
  createLatencyRouteKey,
  createLatencyRouteKeys,
  getDefaultLatencyEstimateMs,
  getLatencyProgress,
  loadLatencyEstimate,
  recordLatencySamples,
  type LatencyRouteDescriptor,
  type UlraLatencyOutcome,
} from "../../services/latencyStats";
import type {
  VoicePhaseProgress,
  VoicePhaseProgressPhase,
  VoiceTimingProgress,
} from "../../types";

interface ActiveLatencyProgress {
  descriptor: LatencyRouteDescriptor;
  phase: VoicePhaseProgressPhase;
  key: string;
  keys: string[];
  startedAt: number;
  estimatedMs: number;
  sampleCount: number;
  learned: boolean;
  progress: number;
  runId: number;
}

function snapshotProgress(active: ActiveLatencyProgress): VoiceTimingProgress {
  const elapsedMs = Date.now() - active.startedAt;
  const progress = getLatencyProgress(elapsedMs, active.estimatedMs);
  active.progress = Math.max(active.progress, progress.progress);

  return {
    progress: active.progress,
    elapsedMs,
    startedAt: active.startedAt,
    estimatedMs: active.estimatedMs,
    sampleCount: active.sampleCount,
    learned: active.learned,
    overEstimate: progress.overEstimate,
  };
}

export function useLatencyProgressController({
  setPhaseProgress,
}: {
  setPhaseProgress: Dispatch<SetStateAction<VoicePhaseProgress | null>>;
}) {
  const activeTurnProgressRef = useRef<ActiveLatencyProgress | null>(null);
  const activeSpeechStartProgressRef =
    useRef<ActiveLatencyProgress | null>(null);
  const activePhaseProgressRef = useRef<ActiveLatencyProgress | null>(null);
  const latencyRunIdRef = useRef(0);

  const publishLatencyProgress = useCallback(() => {
    const activePhase = activePhaseProgressRef.current;
    const activeTurn = activeTurnProgressRef.current;
    const activeSpeechStart = activeSpeechStartProgressRef.current;
    const active = activePhase ?? activeTurn ?? activeSpeechStart;

    if (!active) {
      setPhaseProgress(null);
      return;
    }

    setPhaseProgress({
      phase: active.phase,
      ...snapshotProgress(active),
      overall:
        activePhase && activeTurn ? snapshotProgress(activeTurn) : undefined,
      speechStart: activeSpeechStart
        ? snapshotProgress(activeSpeechStart)
        : undefined,
    });
  }, [setPhaseProgress]);

  const clearLatencyProgress = useCallback(() => {
    activeTurnProgressRef.current = null;
    activeSpeechStartProgressRef.current = null;
    activePhaseProgressRef.current = null;
    setPhaseProgress(null);
  }, [setPhaseProgress]);

  const startLatencyProgress = useCallback(
    (
      phase: VoicePhaseProgressPhase,
      descriptor: LatencyRouteDescriptor,
    ) => {
      const runId = latencyRunIdRef.current + 1;
      latencyRunIdRef.current = runId;
      const startedAt = Date.now();
      const fallbackEstimateMs = getDefaultLatencyEstimateMs(descriptor);
      const key = createLatencyRouteKey(descriptor);
      const keys = createLatencyRouteKeys(descriptor);
      const active: ActiveLatencyProgress = {
        descriptor,
        phase,
        key,
        keys,
        startedAt,
        estimatedMs: fallbackEstimateMs,
        sampleCount: 0,
        learned: false,
        progress: 0,
        runId,
      };
      const isSpeechStartProgress =
        phase === "turn" && descriptor.phase === "turn-to-first-speech";

      if (isSpeechStartProgress) {
        activeSpeechStartProgressRef.current = active;
        activePhaseProgressRef.current = null;
      } else if (phase === "turn") {
        activeTurnProgressRef.current = active;
        activePhaseProgressRef.current = null;
      } else {
        activePhaseProgressRef.current = active;
      }
      publishLatencyProgress();

      void loadLatencyEstimate(descriptor)
        .then((estimate) => {
          const current =
            isSpeechStartProgress
              ? activeSpeechStartProgressRef.current
              : phase === "turn"
                ? activeTurnProgressRef.current
                : activePhaseProgressRef.current;

          if (current?.runId !== runId) {
            return;
          }

          current.estimatedMs = estimate.estimatedMs;
          current.sampleCount = estimate.sampleCount;
          current.learned = estimate.learned;
          current.keys = estimate.keys;
          recordDebugLogEvent({
            event: "adaptive-latency-estimate-loaded",
            payload: {
              estimatedMs: estimate.estimatedMs,
              key: estimate.key,
              phase,
              sampleCount: estimate.sampleCount,
              source: estimate.source,
            },
          });
          publishLatencyProgress();
        })
        .catch((error) => {
          recordDebugLogEvent({
            event: "adaptive-latency-estimate-load-failed",
            level: "warn",
            payload: {
              key,
              message: error instanceof Error ? error.message : String(error),
              phase,
            },
          });
        });
    },
    [publishLatencyProgress],
  );

  const updateUlraLatencyOutcome = useCallback(
    (outcome: UlraLatencyOutcome) => {
      const candidates = [
        activeTurnProgressRef.current,
        activeSpeechStartProgressRef.current,
        activePhaseProgressRef.current,
      ].filter(
        (active): active is ActiveLatencyProgress =>
          Boolean(active?.descriptor.ulraRoutes?.length),
      );

      candidates.forEach((active) => {
        const descriptor = {
          ...active.descriptor,
          ulraOutcome: outcome,
        };
        const runId = latencyRunIdRef.current + 1;
        latencyRunIdRef.current = runId;
        active.descriptor = descriptor;
        active.key = createLatencyRouteKey(descriptor);
        active.keys = createLatencyRouteKeys(descriptor);
        active.estimatedMs = getDefaultLatencyEstimateMs(descriptor);
        active.sampleCount = 0;
        active.learned = false;
        active.runId = runId;

        void loadLatencyEstimate(descriptor)
          .then((estimate) => {
            const isStillActive =
              activeTurnProgressRef.current === active ||
              activeSpeechStartProgressRef.current === active ||
              activePhaseProgressRef.current === active;
            if (!isStillActive || active.runId !== runId) {
              return;
            }

            active.estimatedMs = estimate.estimatedMs;
            active.sampleCount = estimate.sampleCount;
            active.learned = estimate.learned;
            active.keys = estimate.keys;
            recordDebugLogEvent({
              event: "adaptive-latency-ulra-outcome-applied",
              payload: {
                estimatedMs: estimate.estimatedMs,
                key: estimate.key,
                outcome,
                phase: active.phase,
                sampleCount: estimate.sampleCount,
                source: estimate.source,
              },
            });
            publishLatencyProgress();
          })
          .catch((error) => {
            recordDebugLogEvent({
              event: "adaptive-latency-estimate-load-failed",
              level: "warn",
              payload: {
                key: active.key,
                message:
                  error instanceof Error ? error.message : String(error),
                phase: active.phase,
              },
            });
          });
      });

      if (candidates.length > 0) {
        publishLatencyProgress();
      }
    },
    [publishLatencyProgress],
  );

  const recordLatencyProgressSample = useCallback(
    (active: ActiveLatencyProgress) => {
      const durationMs = Date.now() - active.startedAt;
      const { key, keys, phase } = active;

      void recordLatencySamples(keys, durationMs)
        .then(() => {
          recordDebugLogEvent({
            event: "adaptive-latency-sample-recorded",
            payload: {
              durationMs,
              key,
              routeCount: keys.length,
              phase,
            },
          });
        })
        .catch((error) => {
          recordDebugLogEvent({
            event: "adaptive-latency-sample-record-failed",
            level: "warn",
            payload: {
              durationMs,
              key,
              message: error instanceof Error ? error.message : String(error),
              phase,
            },
          });
        });
    },
    [],
  );

  const finishLatencyProgress = useCallback(
    (phase: VoicePhaseProgressPhase) => {
      const active =
        phase === "turn"
          ? activeTurnProgressRef.current
          : activePhaseProgressRef.current;

      if (!active || active.phase !== phase) {
        return;
      }

      recordLatencyProgressSample(active);
      if (phase === "turn") {
        activeTurnProgressRef.current = null;
      } else {
        activePhaseProgressRef.current = null;
      }
      publishLatencyProgress();
    },
    [publishLatencyProgress, recordLatencyProgressSample],
  );

  const finishSpeechStartProgress = useCallback(() => {
    const active = activeSpeechStartProgressRef.current;

    if (!active) {
      return;
    }

    recordLatencyProgressSample(active);
    activeSpeechStartProgressRef.current = null;
    publishLatencyProgress();
  }, [publishLatencyProgress, recordLatencyProgressSample]);

  useEffect(
    () => () => {
      activeTurnProgressRef.current = null;
      activeSpeechStartProgressRef.current = null;
      activePhaseProgressRef.current = null;
    },
    [],
  );

  return {
    clearLatencyProgress,
    finishLatencyProgress,
    finishSpeechStartProgress,
    startLatencyProgress,
    updateUlraLatencyOutcome,
  };
}
