import {
  InputMode,
  MessageImageAttachment,
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
  driveAutoContinueEnabled?: boolean;
  driveSilenceCountdownSeconds?: number | null;
  driveSessionCanRepeat?: boolean;
  driveVoiceActive?: boolean;
  /** Portrait controls that stay attached to the measured orb/composer slot. */
  footer?: ReactNode;
  initialSurface?: InputSurface;
  initialTextMessage?: string;
  inputMode: InputMode;
  isActive: boolean;
  layout: "portrait" | "landscape";
  onInputSurfaceChange?: (surface: InputSurface) => void;
  attachments?: MessageImageAttachment[];
  onRemoveImage?: (attachmentId: string) => void;
  onDriveContinue?: () => void | Promise<void>;
  onDriveRepeat?: () => void | Promise<void>;
  onDriveStop?: () => void | Promise<void>;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
  onInterruptPlayback?: () => void;
  onStopPlayback: () => void;
  onResolvePromptBlock?: () => void;
  onSubmitTextMessage: (text: string) => void;
  onTextMessageChange?: (text: string) => void;
  /** Deterministic isolated-fixture values; production derives these live. */
  orbProgressOverride?: OrbTurnProgress | null;
  playbackPaused?: boolean;
  promptBlockedActionEnabled?: boolean;
  promptBlockedActionLabel?: string | null;
  promptBlockedMessage?: string | null;
  /** 0–1 of the reply already read; drives the speaking arc. */
  readingProgress?: number | null;
  recordingMaxMs: number;
  recordingStartedAtMs?: number | null;
  phaseTimingProgress?: VoiceTimingProgress | null;
  speechStartProgress?: VoiceTimingProgress | null;
  /**
   * The orb slot — 196 in portrait, 150 in landscape. Portrait follows the
   * approved fixed-size exploration; landscape measures its tighter pane.
   */
  maxOrbSize: number;
  statusLabel: string;
  t: TranslateFn;
  visualPhase: VoiceVisualPhase;
  /**
   * Retires the voice control when no route can hear the user, without
   * blocking the composer the message points them to.
   */
  voiceInputUnavailableMessage?: string | null;
}
