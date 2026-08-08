import { Settings } from "../../types";

interface IsSpeechInputUnavailableParams {
  hasProviderCredential: boolean;
  nativeRecognizerAvailable: boolean;
  selectedLocalSttModel: boolean;
  sttMode: Settings["sttMode"];
  sttProvider: string | null | undefined;
}

/**
 * Whether nothing on the device can currently hear the user.
 *
 * Speech input is optional, so the workspace has to stay usable without it.
 * This is deliberately per-route rather than an aggregate: a user who has
 * chosen on-device recognition is not helped by a provider key they picked for
 * something else, so each mode answers only for the route it owns.
 *
 * The workspace uses this to open on the text composer instead of a control
 * that cannot work, and to explain why the voice action is unavailable rather
 * than leaving it silently inert.
 */
export function isSpeechInputUnavailable({
  hasProviderCredential,
  nativeRecognizerAvailable,
  selectedLocalSttModel,
  sttMode,
  sttProvider,
}: IsSpeechInputUnavailableParams): boolean {
  if (sttMode === "native") {
    return !nativeRecognizerAvailable;
  }

  if (sttMode === "local") {
    return !selectedLocalSttModel;
  }

  return !sttProvider || !hasProviderCredential;
}
