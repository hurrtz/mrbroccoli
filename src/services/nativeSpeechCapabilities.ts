import { Platform } from "react-native";

import {
  getSpeechLanguageDefinition,
  type SpeechLanguage,
} from "../constants/speechLanguages";

export interface NativeSpeechCapabilities {
  recognitionAvailable: boolean;
  onDeviceRecognitionAvailable: boolean;
  targetLocaleInstalled: boolean;
  nativeSttEligible: boolean;
}

function localeMatches(candidate: string, target: string) {
  const normalizedCandidate = candidate.replace("_", "-").toLowerCase();
  const normalizedTarget = target.replace("_", "-").toLowerCase();
  return (
    normalizedCandidate === normalizedTarget ||
    normalizedCandidate.split("-")[0] === normalizedTarget.split("-")[0]
  );
}

export async function probeNativeSpeechCapabilities(
  language: SpeechLanguage,
): Promise<NativeSpeechCapabilities> {
  const speechRecognition =
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- lazy native loading keeps Settings and pure Jest imports safe
    require("expo-speech-recognition") as typeof import("expo-speech-recognition");
  const { ExpoSpeechRecognitionModule } = speechRecognition;
  let recognitionAvailable = false;
  let onDeviceRecognitionAvailable = false;
  try {
    recognitionAvailable = ExpoSpeechRecognitionModule.isRecognitionAvailable();
    onDeviceRecognitionAvailable =
      ExpoSpeechRecognitionModule.supportsOnDeviceRecognition();
  } catch {
    return {
      recognitionAvailable: false,
      onDeviceRecognitionAvailable: false,
      targetLocaleInstalled: false,
      nativeSttEligible: false,
    };
  }

  if (!recognitionAvailable || !onDeviceRecognitionAvailable) {
    return {
      recognitionAvailable,
      onDeviceRecognitionAvailable,
      targetLocaleInstalled: false,
      nativeSttEligible: false,
    };
  }

  if (Platform.OS !== "android") {
    return {
      recognitionAvailable,
      onDeviceRecognitionAvailable,
      targetLocaleInstalled: true,
      nativeSttEligible: true,
    };
  }

  try {
    const targetLocale = getSpeechLanguageDefinition(language).nativeLocale;
    const supported = await ExpoSpeechRecognitionModule.getSupportedLocales({});
    const targetLocaleInstalled = supported.installedLocales.some((locale) =>
      localeMatches(locale, targetLocale),
    );
    return {
      recognitionAvailable,
      onDeviceRecognitionAvailable,
      targetLocaleInstalled,
      nativeSttEligible: targetLocaleInstalled,
    };
  } catch {
    return {
      recognitionAvailable,
      onDeviceRecognitionAvailable,
      targetLocaleInstalled: false,
      nativeSttEligible: false,
    };
  }
}
