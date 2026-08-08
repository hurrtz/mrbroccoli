import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";

import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import type { Colors } from "../../theme/colors";
import type { TranslateFn } from "../../screens/main/shared";
import type { AppLanguage } from "../../i18n/localeRegistry";
import {
  fetchIntroClip,
  getIntroClipAvailability,
  type IntroClipAvailability,
} from "./introClips";
import { getIntroScript } from "./introScripts";

interface IntroHearStepProps {
  colors: Colors;
  language: AppLanguage;
  t: TranslateFn;
}

/**
 * The intro sheet's audio example.
 *
 * The clip is delivered by the store rather than bundled, so it may need
 * downloading. That happens only when the user presses play -- an example is
 * not worth spending someone's data on unasked. The transcript is always
 * present, so this step is useful even when no audio exists at all.
 */
export function IntroHearStep({ colors, language, t }: IntroHearStepProps) {
  const [availability, setAvailability] = React.useState<IntroClipAvailability>({
    kind: "unavailable",
  });
  const [uri, setUri] = React.useState<string | null>(null);
  const [fetching, setFetching] = React.useState(false);

  const player = useAudioPlayer(uri ? { uri } : null);
  const status = useAudioPlayerStatus(player);
  const playing = status.playing;

  React.useEffect(() => {
    let cancelled = false;

    void (async () => {
      const next = await getIntroClipAvailability(language);
      if (cancelled) {
        return;
      }
      setAvailability(next);
      setUri(next.kind === "ready" ? next.uri : null);
    })();

    return () => {
      cancelled = true;
    };
  }, [language]);

  const handlePress = React.useCallback(() => {
    if (playing) {
      player.pause();
      return;
    }

    if (uri) {
      player.seekTo(0);
      player.play();
      return;
    }

    setFetching(true);
    void (async () => {
      const fetched = await fetchIntroClip(language);
      setFetching(false);
      if (!fetched) {
        // The pack could not be delivered. Fall back to the transcript rather
        // than reporting a failure over an optional example.
        setAvailability({ kind: "unavailable" });
        return;
      }
      setUri(fetched);
      setAvailability({ kind: "ready", uri: fetched });
    })();
  }, [language, player, playing, uri]);

  const canPlay = availability.kind !== "unavailable";
  const script = getIntroScript(language);

  return (
    <View style={styles.container}>
      <Text style={[styles.body, { color: colors.textSecondary }]}>
        {t("introHearBody")}
      </Text>

      {canPlay ? (
        <Pressable
          accessibilityLabel={playing ? t("introHearStop") : t("introHearPlay")}
          accessibilityRole="button"
          accessibilityState={{ busy: fetching, disabled: fetching }}
          disabled={fetching}
          onPress={handlePress}
          style={[
            styles.play,
            { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
          ]}
          testID="intro-hear-play"
        >
          {fetching ? (
            <ActivityIndicator color={colors.accent} />
          ) : (
            <PhosphorIcon
              color={colors.accent}
              name={playing ? "pause" : "audio"}
              size="navigation"
            />
          )}
          <Text style={[styles.playLabel, { color: colors.text }]}>
            {playing ? t("introHearStop") : t("introHearPlay")}
          </Text>
        </Pressable>
      ) : (
        <Text
          style={[styles.disclaimer, { color: colors.textMuted }]}
          testID="intro-hear-unavailable"
        >
          {t("introHearUnavailable")}
        </Text>
      )}

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
