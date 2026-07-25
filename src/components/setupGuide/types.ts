import type { Provider } from "../../types";
import type {
  SetupGuideProviderOption,
  SetupGuideResolvedRoutes,
  SetupGuideStep,
  SetupGuideValidationState,
} from "../../screens/main/setupGuideSupport";
import type { SetupGuideVoiceTestPhase } from "../../screens/main/useSetupGuideVoiceTest";
import type { KokoroModelController } from "../../hooks/useKokoroModel";

export interface SetupGuideVoiceTestState {
  phase: SetupGuideVoiceTestPhase;
  transcript: string;
  reply: string;
  errorMessage: string | null;
  isRecording: boolean;
  isBusy: boolean;
  hasCompleted: boolean;
}

export interface SetupGuideModalProps {
  visible: boolean;
  step: SetupGuideStep;
  providerOptions: SetupGuideProviderOption[];
  selectedProvider: Provider | null;
  selectedProviderApiKey: string;
  currentValidationState: SetupGuideValidationState;
  resolvedRoutes: SetupGuideResolvedRoutes;
  voiceTest: SetupGuideVoiceTestState;
  kokoroModel: KokoroModelController;
  useKokoro: boolean;
  onSelectProvider: (provider: Provider | null) => void;
  onChangeProviderApiKey: (value: string) => void;
  onDismiss: () => void;
  onBack: () => void;
  onContinueFromIntro: () => void;
  onValidateProviderKey: () => void;
  onContinueFromProvider: () => void;
  onToggleKokoro: (enabled: boolean) => void;
  onDownloadKokoro: () => void;
  onContinueFromKokoro: () => void;
  onVoiceTestAction: () => void;
  onResetVoiceTest: () => void;
  onContinueFromVoiceTest: () => void;
  onFinish: () => void;
  onOpenSettings: () => void;
  showSettingsShortcutOption?: boolean;
  settingsShortcutVisible?: boolean;
  onChangeSettingsShortcutVisible?: (visible: boolean) => void;
}
