import { useKeepAwakeWhile } from "../../../hooks/useKeepAwakeWhile";

const VOICE_SESSION_KEEP_AWAKE_TAG = "mrbroccoli-voice-session";

export function useVoiceSessionKeepAwake(active: boolean) {
  useKeepAwakeWhile(active, VOICE_SESSION_KEEP_AWAKE_TAG);
}
