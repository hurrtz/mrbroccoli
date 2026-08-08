import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";

import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import type { Colors } from "../../theme/colors";
import type { TranslateFn } from "../../screens/main/shared";
import type { AppLanguage } from "../../i18n/localeRegistry";
import { getIntroClip } from "./introClips";
import { getIntroScript } from "./introScripts";

interface IntroHearStepProps {
  colors: Colors;
  language: AppLanguage;
  t: TranslateFn;
}

/**
 * The intro sheet's audio example.
 *
 * The clip ships inside the app, so it plays immediately and works offline --
 * there is no download, and no state in which it is unavailable. It never
 * autoplays: a voice starting unprompted is startling, and this sheet can open
 * anywhere.
 *
 * The transcript sits alongside it, which keeps the step useful with the sound
 * off and gives screen readers the same content.
 */
export function IntroHearStep({ colors, language, t }: IntroHearStepProps) {
  const player = useAudioPlayer(getIntroClip(language));
  const status = useAudioPlayerStatus(player);
  const playing = status.playing;
  const script = getIntroScript(language);

  const handlePress = React.useCallback(() => {
    if (playing) {
      player.pause();
      return;
    }
    // Restart rather than resume: someone pressing play after it finished
    // expects the example from the top, not the last half second.
    if (status.didJustFinish || status.currentTime >= status.duration) {
      player.seekTo(0);
    }
    player.play();
  }, [player, playing, status]);

  // Leaving the step must stop playback; the sheet can be dismissed mid-clip.
  React.useEffect(() => () => player.pause(), [player]);

  return (
    <View style={styles.container}>
      <Text style={[styles.body, { color: colors.textSecondary }]}>
        {t("introHearBody")}
      </Text>

      <Pressable
        accessibilityLabel={playing ? t("introHearStop") : t("introHearPlay")}
        accessibilityRole="button"
        onPress={handlePress}
        style={[
          styles.play,
          { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
        ]}
        testID="intro-hear-play"
      >
        <PhosphorIcon
          color={colors.accent}
          name={playing ? "pause" : "audio"}
          size="navigation"
        />
        <Text style={[styles.playLabel, { color: colors.text }]}>
          {playing ? t("introHearStop") : t("introHearPlay")}
        </Text>
      </Pressable>

      {script ? (
        <>
          <Text style={[styles.transcriptLabel, { color: colors.text }]}>
            {t("introHearTranscript")}
          </Text>
          <Text
            style={[styles.body, { color: colors.textSecondary }]}
            testID="intro-hear-transcript"
          >
            {script}
          </Text>
        </>
      ) : null}

      <Text style={[styles.disclaimer, { color: colors.textMuted }]}>
        {t("introHearDisclaimer")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    fontSize: 15,
    lineHeight: 22,
  },
  container: {
    gap: 12,
  },
  disclaimer: {
    fontSize: 12,
    lineHeight: 17,
  },
  play: {
    alignItems: "center",
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 12,
    minHeight: 52,
    paddingHorizontal: 16,
  },
  playLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  transcriptLabel: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },
});
