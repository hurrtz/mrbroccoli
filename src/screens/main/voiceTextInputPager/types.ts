import {
  InputMode,
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
  onDriveContinue?: () => void | Promise<void>;
  onDriveRepeat?: () => void | Promise<void>;
  onDriveStop?: () => void | Promise<void>;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
  onStopPlayback: () => void;
  onResolvePromptBlock?: () => void;
  onSubmitTextMessage: (text: string) => void;
  onTextMessageChange?: (text: string) => void;
  playbackPaused?: boolean;
  promptBlockedActionLabel?: string | null;
  promptBlockedMessage?: string | null;
  promptBlockedProgress?: number | null;
  recordingMaxMs: number;
  recordingStartedAtMs?: number | null;
  speechStartProgress?: VoiceTimingProgress | null;
  statusLabel: string;
  t: TranslateFn;
  visualPhase: VoiceVisualPhase;
}
