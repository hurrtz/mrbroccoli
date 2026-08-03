import { Platform } from "react-native";
import { ExpoSpeechRecognitionModule } from "expo-speech-recognition";
import { useLocalization } from "../i18n";
import { isNativeWaveformAvailable } from "../services/nativeWaveform";
import { useRecognitionControls } from "./nativeSpeechRecognizer/useRecognitionControls";
import { useRecognitionSession } from "./nativeSpeechRecognizer/useRecognitionSession";
import { useRecognitionSubscriptions } from "./nativeSpeechRecognizer/useRecognitionSubscriptions";
import type { SttLanguage } from "../types";

function canUseNativeWaveformRecorderForRecognition() {
  if (!isNativeWaveformAvailable()) {
    return false;
  }

  if (Platform.OS !== "android") {
    return true;
  }

  return typeof Platform.Version === "number" && Platform.Version >= 33;
}

export function useNativeSpeechRecognizer(
  sttLanguage: SttLanguage = "auto",
  requiresOnDeviceRecognition = false,
) {
  const { t } = useLocalization();
  const usingNativeRecorder = canUseNativeWaveformRecorderForRecognition();
  const session = useRecognitionSession({ t });

  useRecognitionSubscriptions({
    session,
    usingNativeRecorder,
  });

  const {
    ensurePermissions,
    startRecognition,
    stopRecognition,
    abortRecognition,
  } = useRecognitionControls({
    session,
    t,
    sttLanguage,
    usingNativeRecorder,
    requiresOnDeviceRecognition,
  });

  return {
    isAvailable: ExpoSpeechRecognitionModule.isRecognitionAvailable(),
    isRecording: session.isRecording,
    inputMetering: session.inputMetering,
    lastError: session.lastError,
    ensurePermissions,
    startRecognition,
    stopRecognition,
    abortRecognition,
    clearLastError: session.clearLastError,
  };
}
