import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

import {
  getDebugLogCaptureState,
  recordDebugLogEvent,
  subscribeToDebugLogCapture,
} from "../services/debugLogCapture";
import type { PipelinePhase } from "./useVoicePipeline";

/**
 * Battery-drain diagnostics.
 *
 * Emits a periodic state heartbeat plus transition events into the existing
 * debug-log capture (the home-screen LOG button). All output is gated on an
 * active capture session — when capture is off, `recordDebugLogEvent` is a
 * no-op, so this adds no measurable cost beyond one low-frequency timer.
 *
 * The signal we care about for battery drain is whether the app sits in a
 * non-idle / animating state (`isActive` true → the voice circle animates at
 * the display refresh rate) when nothing should be happening, and how often
 * the top-level screen re-renders.
 *
 * This module is intentionally self-contained so it can be removed once the
 * drain is diagnosed.
 */

const HEARTBEAT_INTERVAL_MS = 4000;
// Flag a continuously-active stretch this long with no recording/playback as
// suspicious (the circle would be animating the whole time for no reason).
const SUSPICIOUS_ACTIVE_MS = 20000;
const EXPECTED_LONG_RUNNING_PHASES = new Set<PipelinePhase>([
  "transcribing",
  "thinking-briefly",
  "searching",
  "thinking",
  "synthesizing",
]);

export interface BatteryDiagnosticsSnapshot {
  isActive: boolean;
  isRecording: boolean;
  pipelinePhase: PipelinePhase;
  playerIsPlaying: boolean;
  playerPaused: boolean;
  spokenRepliesEnabled: boolean;
}

export function useBatteryDiagnostics(snapshot: BatteryDiagnosticsSnapshot) {
  const [captureActive, setCaptureActive] = useState(
    () => getDebugLogCaptureState().active,
  );

  useEffect(() => {
    const syncCaptureState = () => {
      setCaptureActive(getDebugLogCaptureState().active);
    };

    syncCaptureState();
    return subscribeToDebugLogCapture(syncCaptureState);
  }, []);

  // Counts every render of the consuming screen. NOTE: while a capture is
  // active, recorded events re-render the screen, so this over-counts during
  // active use; it is most meaningful across idle periods.
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  const latestRef = useRef(snapshot);
  latestRef.current = snapshot;

  const lastHeartbeatRenderCountRef = useRef(0);
  const activeSinceRef = useRef<number | null>(
    snapshot.isActive ? Date.now() : null,
  );
  const prevPhaseRef = useRef<{ phase: PipelinePhase; since: number }>({
    phase: snapshot.pipelinePhase,
    since: Date.now(),
  });

  // Transition logging: isActive flips (the animation on/off boundary).
  useEffect(() => {
    const now = Date.now();
    if (snapshot.isActive && activeSinceRef.current === null) {
      activeSinceRef.current = now;
      recordDebugLogEvent({
        event: "diag-active-start",
        payload: { phase: snapshot.pipelinePhase },
      });
    } else if (!snapshot.isActive && activeSinceRef.current !== null) {
      const heldMs = now - activeSinceRef.current;
      activeSinceRef.current = null;
      recordDebugLogEvent({
        event: "diag-active-end",
        payload: { heldMs, phase: snapshot.pipelinePhase },
      });
    }
  }, [snapshot.isActive, snapshot.pipelinePhase]);

  // Transition logging: pipeline phase changes, with time spent in the prior
  // phase. A "speaking"/"thinking" phase that never ends is the smoking gun.
  useEffect(() => {
    const prev = prevPhaseRef.current;
    if (prev.phase !== snapshot.pipelinePhase) {
      const now = Date.now();
      recordDebugLogEvent({
        event: "diag-phase-change",
        payload: {
          from: prev.phase,
          to: snapshot.pipelinePhase,
          prevHeldMs: now - prev.since,
          playing: snapshot.playerIsPlaying,
          rec: snapshot.isRecording,
        },
      });
      prevPhaseRef.current = { phase: snapshot.pipelinePhase, since: now };
    }
  }, [snapshot.pipelinePhase, snapshot.playerIsPlaying, snapshot.isRecording]);

  // Periodic heartbeat (only emits while a capture session is active).
  useEffect(() => {
    if (!captureActive) {
      return;
    }

    const interval = setInterval(() => {
      const s = latestRef.current;
      const now = Date.now();
      const renders =
        renderCountRef.current - lastHeartbeatRenderCountRef.current;
      lastHeartbeatRenderCountRef.current = renderCountRef.current;
      const activeMs = activeSinceRef.current
        ? now - activeSinceRef.current
        : 0;

      const suspiciousActive =
        s.isActive &&
        !s.isRecording &&
        !s.playerIsPlaying &&
        !EXPECTED_LONG_RUNNING_PHASES.has(s.pipelinePhase) &&
        activeMs >= SUSPICIOUS_ACTIVE_MS;
      const expectedLongRunning =
        s.isActive &&
        !s.isRecording &&
        !s.playerIsPlaying &&
        EXPECTED_LONG_RUNNING_PHASES.has(s.pipelinePhase) &&
        activeMs >= SUSPICIOUS_ACTIVE_MS;

      recordDebugLogEvent({
        event: suspiciousActive
          ? "diag-heartbeat-STUCK"
          : expectedLongRunning
            ? "diag-heartbeat-LONG"
            : "diag-heartbeat",
        level: suspiciousActive ? "warn" : "info",
        payload: {
          phase: s.pipelinePhase,
          active: s.isActive,
          rec: s.isRecording,
          playing: s.playerIsPlaying,
          paused: s.playerPaused,
          tts: s.spokenRepliesEnabled,
          app: AppState.currentState,
          // renders since the previous heartbeat (~4s window); high values at
          // idle indicate an unnecessary re-render loop.
          renders,
          // how long the screen has been continuously animating, ms.
          activeMs,
        },
      });
    }, HEARTBEAT_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [captureActive]);
}
