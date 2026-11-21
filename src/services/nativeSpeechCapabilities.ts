import { Platform } from "react-native";
import type { SttLanguage } from "../constants/speechLanguages";
import { getSpeechRecognitionLocale } from "../utils/speechLanguage";
import { supportsNativeOnDeviceRecognition } from "./nativeWaveform";

export interface NativeSpeechCapabilities {
  recognitionAvailable: boolean;
  onDeviceRecognitionAvailable: boolean;
  targetLocaleInstalled: boolean;
  nativeSttEligible: boolean;
}

function getSpeechModule() {
  return (
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- Settings also runs without a speech module in pure tests
    require("expo-speech-recognition") as typeof import("expo-speech-recognition")
  ).ExpoSpeechRecognitionModule;
}

export function probeNativeSpeechCapabilities(language: SttLanguage) {
  return probeLocale(getSpeechRecognitionLocale(language));
}

async function probeLocale(locale: string): Promise<NativeSpeechCapabilities> {
  const speech = getSpeechModule();
  let recognitionAvailable = false;
  let onDeviceRecognitionAvailable = false;
  let targetLocaleInstalled = false;
  try {
    recognitionAvailable = speech.isRecognitionAvailable();
    if (recognitionAvailable && Platform.OS === "ios") {
      // Expo's iOS locale list includes network-only languages.
      targetLocaleInstalled = await supportsNativeOnDeviceRecognition(locale);
      onDeviceRecognitionAvailable = targetLocaleInstalled;
    } else if (
      recognitionAvailable &&
      Platform.OS === "android" &&
      Number(Platform.Version) >= 33
    ) {
      onDeviceRecognitionAvailable = speech.supportsOnDeviceRecognition();
      if (onDeviceRecognitionAvailable) {
        const { installedLocales } = await speech.getSupportedLocales({});
        const normalized = locale.replace(/_/g, "-").toLowerCase();
        targetLocaleInstalled = installedLocales.some(
          (entry) => entry.replace(/_/g, "-").toLowerCase() === normalized,
        );
      }
    }
  } catch {
    // A missing or failed locale probe cannot prove that audio stays local.
  }
  return {
    recognitionAvailable,
    onDeviceRecognitionAvailable,
    targetLocaleInstalled,
    nativeSttEligible:
      recognitionAvailable &&
      onDeviceRecognitionAvailable &&
      targetLocaleInstalled,
  };
}

export interface NativeRecognitionRoute {
  lang: string;
  requiresOnDeviceRecognition: boolean;
  androidRecognitionServicePackage?: string;
}

export async function getNativeRecognitionRoute(
  language: SttLanguage,
  localOnly: boolean,
): Promise<{
  options: NativeRecognitionRoute;
  recipient?: string;
} | null> {
  const lang = getSpeechRecognitionLocale(language);
  const { recognitionAvailable, nativeSttEligible } = await probeLocale(lang);
  if (!recognitionAvailable) return null;
  if (nativeSttEligible)
    return { options: { lang, requiresOnDeviceRecognition: true } };
  if (localOnly) return null;
  if (Platform.OS === "ios")
    return {
      options: { lang, requiresOnDeviceRecognition: false },
      recipient: "apple",
    };
  if (Platform.OS !== "android") return null;
  // Passing the actual package back to Expo binds the request to the named
  // service even if the default changes while the consent sheet is open.
  try {
    const pkg = getSpeechModule().getDefaultRecognitionService().packageName;
    if (!pkg || !/^[A-Za-z]\w*(?:\.[A-Za-z]\w*)+$/.test(pkg)) return null;
    return {
      options: {
        lang,
        requiresOnDeviceRecognition: false,
        androidRecognitionServicePackage: pkg,
      },
      recipient: "android." + pkg,
    };
  } catch {
    return null;
  }
}
