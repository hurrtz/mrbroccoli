import {
  InputMode,
  VoicePhaseProgress,
  VoiceVisualPhase,
} from "../../../types";
import { Colors } from "../../../theme/colors";
import { TranslateFn } from "../shared";

export type InputSurface = "voice" | "text";

export interface VoiceTextInputPagerProps {
  colors: Colors;
  disabled: boolean;
  driveSessionActive?: boolean;
  driveSessionCanContinue?: boolean;
  driveSessionCanRepeat?: boolean;
  initialSurface?: InputSurface;
  initialTextMessage?: string;
  inputMode: InputMode;
  isActive: boolean;
  onInputSurfaceChange?: (surface: InputSurface) => void;
  onDriveContinue?: () => void | Promise<void>;
  onDriveRepeat?: () => void | Promise<void>;
  onDriveStop?: () => void | Promise<void>;
  onOpenStatusDetails: () => void;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
  onStopPlayback?: () => void | Promise<void>;
  onSubmitTextMessage: (text: string) => void;
  onTextMessageChange?: (text: string) => void;
  phaseLabel: string;
  phaseProgress?: VoicePhaseProgress | null;
  playbackActive?: boolean;
  playbackPaused?: boolean;
  recordingMaxMs: number;
  statusLabel: string;
  stopPlaybackLabel: string;
  t: TranslateFn;
  visualPhase: VoiceVisualPhase;
}
