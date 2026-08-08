import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import type { AppLanguage } from "../../i18n/localeRegistry";
import type { TranslateFn } from "../../screens/main/shared";
import { fonts } from "../../theme/typography";
import { getIntroClip } from "./introClips";
import {
  IntroBadge,
  IntroBody,
  IntroButton,
  IntroPanel,
  IntroPoint,
  IntroTitle,
} from "./IntroPrimitives";
import { introRadius, introTheme } from "./introTheme";
import { IntroVoicePicker } from "./IntroVoicePicker";
import { useIntroPlayback } from "./useIntroPlayback";

export const INTRO_STEPS = [
  "welcome",
  "requirements",
  "llm",
  "stt",
  "tts",
  "premium",
] as const;
export type IntroStep = (typeof INTRO_STEPS)[number];

export interface IntroStepProps {
  language: AppLanguage;
  onConnectProvider: () => void;
  onInstallLocal: () => void;
  onOpenPremium: () => void;
  onOpenSpeaking: () => void;
  t: TranslateFn;
}

/**
 * Step one: the greeting.
 *
 * A single large play button carries the whole screen. Someone who has just
 * installed a voice app should be able to hear it before reading anything, and
 * a control this size needs no explanation. It never autoplays -- a voice
 * starting by itself is startling.
 */
function WelcomeStep({ language, t }: IntroStepProps) {
  const { playing, toggle } = useIntroPlayback(getIntroClip(language));

  return (
    <View style={styles.welcome}>
      <Pressable
        accessibilityLabel={playing ? t("introHearStop") : t("introWelcomePlay")}
        accessibilityRole="button"
        onPress={toggle}
        style={({ pressed }) => [
          styles.hero,
          {
            backgroundColor: playing ? introTheme.panelActive : introTheme.accent,
            borderColor: playing ? introTheme.accent : "transparent",
            transform: [{ scale: pressed ? 0.97 : 1 }],
          },
        ]}
        testID="intro-welcome-play"
      >
        <PhosphorIcon
          color={playing ? introTheme.accent : introTheme.onAccent}
          name={playing ? "pause" : "audio"}
          size="hero"
        />
      </Pressable>

      <Text style={styles.heroCaption}>
        {playing ? t("introWelcomePlaying") : t("introWelcomePlay")}
      </Text>

      <View style={styles.welcomeText}>
        <IntroTitle align="center">{t("introWelcomeTitle")}</IntroTitle>
        <IntroBody align="center">{t("introWelcomeBody")}</IntroBody>
      </View>
    </View>
  );
}

/**
 * Step two: the honest shape of setup.
 *
 * The single most useful thing a new user can learn is how little is actually
 * required. One model download and the app works; everything else is an
 * improvement they can make later or never.
 */
function RequirementsStep({ t }: IntroStepProps) {
  return (
    <View style={styles.stack}>
      <IntroTitle>{t("introNeedsTitle")}</IntroTitle>
      <IntroBody>{t("introNeedsBody")}</IntroBody>

      <IntroPanel>
        <IntroPoint
          body={t("introNeedsLlmBody")}
          icon="cpu"
          title={t("introNeedsLlmTitle")}
        />
        <View style={styles.divider} />
        <IntroPoint
          body={t("introNeedsSttBody")}
          icon="mic"
          title={t("introNeedsSttTitle")}
          tone="neutral"
        />
        <IntroPoint
          body={t("introNeedsTtsBody")}
          icon="sound"
          title={t("introNeedsTtsTitle")}
          tone="neutral"
        />
      </IntroPanel>
    </View>
  );
}

/** Step three: the one requirement, and the two ways to satisfy it. */
function LlmStep({ onConnectProvider, onInstallLocal, t }: IntroStepProps) {
  return (
    <View style={styles.stack}>
      <IntroBadge tone="accent">{t("introRequired")}</IntroBadge>
      <IntroTitle>{t("introLlmTitle")}</IntroTitle>
      <IntroBody>{t("introLlmBody")}</IntroBody>

      <IntroPanel>
        <IntroPoint
          body={t("introLlmLocalBody")}
          icon="download"
          title={t("introLlmLocalTitle")}
        />
        <IntroButton
          icon="download"
          label={t("introStartLocal")}
          onPress={onInstallLocal}
          testID="intro-install-local"
        />
        <View style={styles.divider} />
        <IntroPoint
          body={t("introLlmProviderBody")}
          icon="key"
          title={t("introLlmProviderTitle")}
        />
        <IntroButton
          label={t("introStartProvider")}
          onPress={onConnectProvider}
          testID="intro-connect-provider"
          tone="secondary"
        />
      </IntroPanel>
    </View>
  );
}

/** Step four: speech in. Optional, but the app is built around it. */
function SttStep({ onOpenSpeaking, t }: IntroStepProps) {
  return (
    <View style={styles.stack}>
      <IntroBadge>{t("introOptional")}</IntroBadge>
      <IntroTitle>{t("introSttTitle")}</IntroTitle>
      <IntroBody>{t("introSttBody")}</IntroBody>

      <IntroPanel>
        <IntroPoint
          body={t("introSttWhyBody")}
          icon="mic"
          title={t("introSttWhyTitle")}
        />
        <View style={styles.divider} />
        <IntroPoint
          body={t("introSttSkipBody")}
          icon="edit"
          title={t("introSttSkipTitle")}
          tone="neutral"
        />
        <IntroButton
          label={t("introOpenSpeaking")}
          onPress={onOpenSpeaking}
          testID="intro-open-stt"
          tone="secondary"
        />
      </IntroPanel>
    </View>
  );
}

/**
 * Step five: speech out, with the evidence attached.
 *
 * Claiming the app sounds good is worth less than letting someone hear it, so
 * the picker sits directly under the claim.
 */
function TtsStep({ language, onOpenSpeaking, t }: IntroStepProps) {
  return (
    <View style={styles.stack}>
      <IntroBadge>{t("introOptional")}</IntroBadge>
      <IntroTitle>{t("introTtsTitle")}</IntroTitle>
      <IntroBody>{t("introTtsBody")}</IntroBody>

      <IntroPanel>
        <Text style={styles.panelLabel}>{t("introTtsListenLabel")}</Text>
        <IntroVoicePicker language={language} t={t} />
        <Text style={styles.panelHint}>{t("introHearDisclaimer")}</Text>
        <View style={styles.divider} />
        <IntroPoint
          body={t("introTtsSkipBody")}
          icon="sound"
          title={t("introTtsSkipTitle")}
          tone="neutral"
        />
        <IntroButton
          label={t("introOpenSpeaking")}
          onPress={onOpenSpeaking}
          testID="intro-open-tts"
          tone="secondary"
        />
      </IntroPanel>
    </View>
  );
}

/** Step six: what paying buys, stated as capability rather than as a plea. */
function PremiumStep({ onOpenPremium, t }: IntroStepProps) {
  return (
    <View style={styles.stack}>
      <IntroBadge tone="premium">{t("premium")}</IntroBadge>
      <IntroTitle>{t("introWrapTitle")}</IntroTitle>
      <IntroBody>{t("introWrapBody")}</IntroBody>

      <IntroPanel>
        <IntroPoint
          body={t("introPremiumProvidersBody")}
          icon="key"
          title={t("introPremiumProvidersTitle")}
          tone="premium"
        />
        <IntroPoint
          body={t("introPremiumToolsBody")}
          icon="global"
          title={t("introPremiumToolsTitle")}
          tone="premium"
        />
        <IntroPoint
          body={t("introPremiumCouncilBody")}
          icon="branch"
          title={t("introPremiumCouncilTitle")}
          tone="premium"
        />
        <IntroPoint
          body={t("introPremiumOnceBody")}
          icon="lock"
          title={t("introPremiumOnceTitle")}
          tone="premium"
        />
      </IntroPanel>

      <IntroButton
        label={t("upgradeToPremium")}
        onPress={onOpenPremium}
        testID="intro-open-premium"
        tone="premium"
      />
    </View>
  );
}

export const INTRO_STEP_CONTENT: Record<
  IntroStep,
  (props: IntroStepProps) => React.ReactElement
> = {
  welcome: WelcomeStep,
  requirements: RequirementsStep,
  llm: LlmStep,
  stt: SttStep,
  tts: TtsStep,
  premium: PremiumStep,
};

const styles = StyleSheet.create({
  divider: {
    backgroundColor: introTheme.border,
    height: StyleSheet.hairlineWidth,
  },
  hero: {
    alignItems: "center",
    borderRadius: introRadius.pill,
    borderWidth: 2,
    elevation: 12,
    height: 148,
    justifyContent: "center",
    shadowColor: introTheme.accent,
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    width: 148,
  },
  heroCaption: {
    color: introTheme.accent,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    letterSpacing: 0.3,
  },
  panelHint: {
    color: introTheme.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
  },
  panelLabel: {
    color: introTheme.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
  },
  stack: {
    gap: 14,
  },
  welcome: {
    alignItems: "center",
    // Fills the scroll viewport so the greeting sits optically centred instead
    // of stacking at the top with the screen empty beneath it.
    flex: 1,
    gap: 18,
    justifyContent: "center",
    paddingVertical: 24,
  },
  welcomeText: {
    gap: 12,
    paddingTop: 6,
  },
});
