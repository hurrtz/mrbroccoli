import {
  InputMode,
  MessageImageAttachment,
  VoiceTimingProgress,
  VoiceVisualPhase,
} from "../../../types";
import { Colors } from "../../../theme/colors";
import { TranslateFn } from "../shared";
import type { OrbTurnProgress } from "../useOrbTurnProgress";

export type InputSurface = "voice" | "text";

export interface VoiceTextInputPagerProps {
  colors: Colors;
  disabled: boolean;
  driveAutoContinueEnabled?: boolean;
  driveSilenceCountdownSeconds?: number | null;
  driveSessionCanRepeat?: boolean;
  driveVoiceActive?: boolean;
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
  recordingMaxMs: number;
  recordingStartedAtMs?: number | null;
  speechStartProgress?: VoiceTimingProgress | null;
  /**
   * The orb's ceiling — 196 in portrait, 150 in landscape. The pager measures
   * the space the column actually leaves its viewport and fits the orb to it,
   * so anything that shortens the column simply makes the orb smaller instead
   * of pushing it over its neighbours.
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
