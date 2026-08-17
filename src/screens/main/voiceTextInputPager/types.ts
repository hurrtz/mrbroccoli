import {
  InputMode,
  VoiceTimingProgress,
  VoiceVisualPhase,
} from "../../../types";
import type { ReactNode } from "react";
import { Colors } from "../../../theme/colors";
import { TranslateFn } from "../shared";
import type { OrbTurnProgress } from "../useOrbTurnProgress";

export type InputSurface = "voice" | "text";

export interface VoiceTextInputPagerProps {
  /** Show only the actionable blocked-route label in constrained layouts. */
  compactPromptNotice?: boolean;
  colors: Colors;
  disabled: boolean;
  /** Controls that stay attached to the measured orb/composer slot. */
  footer?: ReactNode;
  initialSurface?: InputSurface;
  initialTextInputFocused?: boolean;
  initialTextMessage?: string;
  inputMode: InputMode;
  isActive: boolean;
  /** Seconds until Hands free submits the current recording after speech. */
  handsFreeSilenceCountdownSeconds?: number | null;
  /** True while the adaptive detector still hears speech. */
  handsFreeVoiceActive?: boolean;
  onInputSurfaceChange?: (surface: InputSurface) => void;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
  onInterruptPlayback?: () => void;
  onRestartReply?: () => void;
  onSeekBack?: () => void;
  onSeekForward?: () => void;
  onStopPlayback: () => void;
  onResolvePromptBlock?: () => void;
  onSubmitTextMessage: (text: string) => void;
  onTextInputFocusChange?: (focused: boolean) => void;
  onTextMessageChange?: (text: string) => void;
  /** Deterministic isolated-fixture values; production derives these live. */
  orbProgressOverride?: OrbTurnProgress | null;
  playbackPaused?: boolean;
  promptBlockedActionEnabled?: boolean;
  promptBlockedActionLabel?: string | null;
  promptBlockedMessage?: string | null;
  /** 0–1 of the reply already read; drives the speaking arc. */
  readingProgress?: number | null;
  /** Smooth visual estimate to the measured boundary of the active clip. */
  readingProgressTiming?: OrbTurnProgress["phaseProgressTiming"] | null;
  recordingMaxMs: number;
  recordingStartedAtMs?: number | null;
  rtl?: boolean;
  showTransportLabels?: boolean;
  phaseTimingProgress?: VoiceTimingProgress | null;
  speechStartProgress?: VoiceTimingProgress | null;
  /**
   * The orb slot — 196 in portrait, 150 in landscape. Portrait follows the
   * approved fixed-size exploration; landscape measures its tighter pane.
   */
  maxOrbSize: number;
  statusLabel: string;
  t: TranslateFn;
  transportLabels: {
    back: string;
    forward: string;
    restart: string;
    stop: string;
  };
  visualPhase: VoiceVisualPhase;
  /**
   * Retires the voice control when no route can hear the user, without
   * blocking the composer the message points them to.
   */
  voiceInputUnavailableMessage?: string | null;
}
