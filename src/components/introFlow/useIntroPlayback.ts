import React from "react";
import {
  setAudioModeAsync,
  setIsAudioActiveAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";

/**
 * Playback for the intro examples.
 *
 * The app deactivates its audio session while idle, so the voice pipeline owns
 * the device rather than holding it open. A player created here is muted by
 * that policy until the session is switched back on -- the native side reports
 * "Audio has been disabled. Re-enable to start playing" and simply does
 * nothing. Activating on demand keeps the introduction working without leaving
 * the session open for a screen that is usually silent.
 */
export function useIntroPlayback(source: number) {
  const player = useAudioPlayer(source);
  const status = useAudioPlayerStatus(player);
  const playing = status.playing;

  const stop = React.useCallback(() => {
    try {
      player.pause();
      player.seekTo(0);
    } catch {
      // Released players have nothing left to stop.
    }
  }, [player]);

  // expo-audio releases the player on unmount, which stops playback by itself.
  // Pausing first stops it promptly while the player is still alive.
  React.useEffect(
    () => () => {
      try {
        player.pause();
      } catch {
        // Already released.
      }
    },
    [player],
  );

  const toggle = React.useCallback(() => {
    if (playing) {
      player.pause();
      return;
    }

    void (async () => {
      try {
        await setIsAudioActiveAsync(true);
        await setAudioModeAsync({
          allowsRecording: false,
          interruptionMode: "doNotMix",
          playsInSilentMode: true,
          shouldPlayInBackground: false,
        });
      } catch {
        // Try to play anyway: on some devices the session is already usable and
        // a failed mode change should not silence an example.
      }

      // Restart rather than resume once finished -- pressing play after a clip
      // ends means "from the top", not "the last half second".
      if (status.didJustFinish || status.currentTime >= status.duration) {
        player.seekTo(0);
      }
      player.play();
    })();
  }, [player, playing, status]);

  return { playing, stop, toggle };
}
