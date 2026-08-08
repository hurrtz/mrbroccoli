import {
  InputMode,
  MessageImageAttachment,
  VoiceTimingProgress,
  VoiceVisualPhase,
} from "../../../types";
import { Colors } from "../../../theme/colors";
import { TranslateFn } from "../shared";

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
  playbackPaused?: boolean;
  promptBlockedActionEnabled?: boolean;
  promptBlockedActionLabel?: string | null;
  promptBlockedMessage?: string | null;
  promptBlockedProgress?: number | null;
  recordingMaxMs: number;
  recordingStartedAtMs?: number | null;
  speechStartProgress?: VoiceTimingProgress | null;
  statusLabel: string;
  t: TranslateFn;
  visualPhase: VoiceVisualPhase;
  /**
   * Retires the voice control when no route can hear the user, without
   * blocking the composer the message points them to.
   */
  voiceInputUnavailableMessage?: string | null;
  /**
   * Moves the pager to the composer when the voice control turns out to be
   * unpressable. Distinct from the initial surface, which is decided before
   * routes have settled.
   */
  voiceSurfaceUnusable?: boolean;
}
