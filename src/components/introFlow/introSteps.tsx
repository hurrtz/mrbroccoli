import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import { SettingsSwitch } from "../../features/settings/settings-primitives/SettingsSwitch";
import { AutoSetupCard } from "../autoSetup/AutoSetupCard";
import type { AutoSetupJobState } from "../autoSetup/types";
import type { AppLanguage } from "../../i18n/localeRegistry";
import { APP_LANGUAGE_OPTIONS, translations } from "../../i18n/localeRegistry";
import type { TranslateFn } from "../../screens/main/shared";
import { fonts } from "../../theme/typography";
import { getIntroClip } from "./introClips";
import { IntroBody, IntroTitle } from "./IntroPrimitives";
import { introRadius, useIntroTheme, type IntroTheme } from "./introTheme";
import { useIntroPlayback } from "./useIntroPlayback";

// Three steps, replacing the seven-page wizard: a welcome that demonstrates
// instead of describing, one setup screen with a single green path, and a live
// test where the user judges the result.
export const INTRO_STEPS = ["welcome", "setup", "try"] as const;
export type IntroStep = (typeof INTRO_STEPS)[number];

/** The ephemeral test turn on the final step, owned by the screen above. */
export interface IntroTestTurnState {
  phase: "idle" | "recording" | "running";
  turn: {
    question: string;
    answer: string;
    latencyLabel: string | null;
  } | null;
  replaying: boolean;
  onPressIn: () => void;
  onPressOut: () => void;
  onReplay: () => void;
}

export interface IntroStepProps {
  /** The automatic setup job shared with settings and the home screen. */
  autoSetup: AutoSetupJobState;
  language: AppLanguage;
  onConnectProvider: () => void;
  onInstallLocal: () => void;
  onOpenStt: () => void;
  onOpenTts: () => void;
  t: TranslateFn;
  testTurn: IntroTestTurnState;
}

/** A stored-dialogue bubble in the app's messenger anatomy. */
function Bubble({
  children,
  mine,
  theme,
}: {
  children: React.ReactNode;
  mine?: boolean;
  theme: IntroTheme;
}) {
  return (
    <View
      style={[
        styles.bubble,
        mine
          ? [styles.bubbleMine, { backgroundColor: theme.accentSoft }]
          : [
              styles.bubbleTheirs,
              {
                backgroundColor: theme.panelActive,
                borderColor: theme.border,
              },
            ],
      ]}
    >
      <Text style={[styles.bubbleText, { color: theme.text }]}>{children}</Text>
    </View>
  );
}

/**
 * Step one: the stored session the recording answers.
 *
 * Three earlier turns emerge from a fade above the crisp question the play
 * button answers with the localized recording. Switching the language swaps
 * the on-screen dialogue with the audio so the pairing holds. It never
 * autoplays -- a voice starting by itself is startling.
 */
function WelcomeStep({ language, t }: IntroStepProps) {
  const theme = useIntroTheme();
  const [previewLanguage, setPreviewLanguage] =
    React.useState<AppLanguage>(language);
  const [played, setPlayed] = React.useState(false);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const { playing, toggle } = useIntroPlayback(getIntroClip(previewLanguage));

  const preview = translations[previewLanguage];
  const activeLanguage = APP_LANGUAGE_OPTIONS.find(
    (option) => option.value === previewLanguage,
  );

  return (
    <View style={styles.welcome} testID="intro-welcome-step">
      <IntroTitle>{t("introWelcomeTitle")}</IntroTitle>

      {/* The dialogue hugs the bottom of its zone so it ends just above the
          play button. The blurred earlier turns are decoration and stay out
          of the accessibility tree; the crisp query is the question the play
          button answers, so it is announced. */}
      <View style={styles.dialogueZone}>
        <View
          accessible={false}
          importantForAccessibility="no-hide-descendants"
          style={styles.dialogueStack}
        >
          <View style={styles.dialogueFar} testID="intro-dialogue-far">
            <Bubble theme={theme}>{preview.introDialogueFar}</Bubble>
          </View>
          <View style={styles.dialogueMid} testID="intro-dialogue-mid">
            <Bubble mine theme={theme}>
              {preview.introDialogueQuestion}
            </Bubble>
          </View>
          <View style={styles.dialogueNear} testID="intro-dialogue-near">
            <Bubble theme={theme}>{preview.introDialogueNear}</Bubble>
          </View>
        </View>
        <View style={styles.dialogueQuery}>
          <Bubble mine theme={theme}>
            {preview.introWelcomeQuery}
          </Bubble>
        </View>
      </View>

      <View style={styles.welcomeCentre}>
        <Pressable
          accessibilityLabel={
            playing ? t("introHearStop") : t("introPlayAnswer")
          }
          accessibilityRole="button"
          onPress={() => {
            setPlayed(true);
            toggle();
          }}
          style={({ pressed }) => [
            styles.playHero,
            {
              backgroundColor: playing ? theme.panelActive : theme.accent,
              borderColor: playing ? theme.accent : "transparent",
              shadowColor: theme.accent,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            },
          ]}
          testID="intro-welcome-play"
        >
          <PhosphorIcon
            color={playing ? theme.accent : theme.onAccent}
            name={playing ? "pause" : "play"}
            size="hero"
          />
        </Pressable>

        <Pressable
          accessibilityLabel={t("introVoicePickerHint")}
          accessibilityRole="button"
          onPress={() => setPickerOpen(true)}
          style={styles.languageChip}
          testID="intro-welcome-language"
        >
          <Text style={[styles.languageChipLabel, { color: theme.textMuted }]}>
            {activeLanguage?.label ?? previewLanguage}
          </Text>
          <PhosphorIcon color={theme.textMuted} name="down" size="inline" />
        </Pressable>

        {played ? (
          <>
            <Text
              accessible={false}
              style={[styles.ellipsisRule, { color: theme.textMuted }]}
            >
              {"···"}
            </Text>
            <Text style={[styles.voiceNote, { color: theme.textMuted }]}>
              {t("introVoiceNote")}
            </Text>
          </>
        ) : null}
      </View>

      {pickerOpen ? (
        <View style={StyleSheet.absoluteFill} testID="intro-language-sheet">
          <Pressable
            accessible={false}
            importantForAccessibility="no-hide-descendants"
            onPress={() => setPickerOpen(false)}
            style={[styles.sheetScrim, { backgroundColor: theme.mutedSoft }]}
          />
          <View
            accessibilityViewIsModal
            style={[
              styles.sheetPanel,
              { backgroundColor: theme.panel, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.sheetHeading, { color: theme.text }]}>
              {t("introVoicePickerTitle")}
            </Text>
            {APP_LANGUAGE_OPTIONS.map((option) => {
              const selected = option.value === previewLanguage;
              return (
                <Pressable
                  accessibilityLabel={option.label}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  key={option.value}
                  onPress={() => {
                    setPreviewLanguage(option.value);
                    setPickerOpen(false);
                  }}
                  style={[
                    styles.sheetOption,
                    selected
                      ? {
                          backgroundColor: theme.sandSoft,
                          borderColor: theme.sandBorder,
                        }
                      : { borderColor: "transparent" },
                  ]}
                >
                  <Text
                    style={[
                      styles.sheetOptionLabel,
                      {
                        color: selected ? theme.sand : theme.textSecondary,
                        fontFamily: selected ? fonts.bodyMedium : fonts.body,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                  {selected ? (
                    <PhosphorIcon
                      color={theme.sand}
                      name="check"
                      size="compact"
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}
    </View>
  );
}

/** One row of the manual catalogue: radio, label, meta, trailing affordance. */
function ManualRow({
  label,
  last,
  locked,
  meta,
  onPress,
  selected,
  testID,
  theme,
}: {
  label: string;
  last?: boolean;
  locked?: boolean;
  meta?: string;
  onPress?: () => void;
  selected?: boolean;
  testID?: string;
  theme: IntroTheme;
}) {
  return (
    <Pressable
      accessibilityLabel={meta ? `${label}. ${meta}` : label}
      accessibilityRole={onPress ? "button" : "radio"}
      accessibilityState={onPress ? undefined : { checked: Boolean(selected) }}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.manualRow,
        { borderBottomColor: theme.border },
        last ? styles.manualRowLast : null,
        locked ? styles.manualRowLocked : null,
        pressed ? styles.manualRowPressed : null,
      ]}
      testID={testID}
    >
      <View
        style={[
          styles.manualRadio,
          {
            borderColor: selected ? theme.accent : theme.borderStrong,
          },
        ]}
      >
        {selected ? (
          <View
            style={[styles.manualRadioDot, { backgroundColor: theme.accent }]}
          />
        ) : null}
      </View>
      <View style={styles.manualRowCopy}>
        <Text
          numberOfLines={1}
          style={[styles.manualRowLabel, { color: theme.text }]}
        >
          {label}
        </Text>
        {meta ? (
          <Text
            numberOfLines={1}
            style={[styles.manualRowMeta, { color: theme.textMuted }]}
          >
            {meta}
          </Text>
        ) : null}
      </View>
      {locked ? (
        <PhosphorIcon color={theme.textMuted} name="lock" size="compact" />
      ) : onPress ? (
        <PhosphorIcon color={theme.textMuted} name="right" size="inline" />
      ) : null}
    </Pressable>
  );
}

/** A manual group: uppercase caption, Required/Optional tag, bordered card. */
function ManualGroup({
  children,
  label,
  required,
  t,
  theme,
}: {
  children: React.ReactNode;
  label: string;
  required?: boolean;
  t: TranslateFn;
  theme: IntroTheme;
}) {
  return (
    <View>
      <View style={styles.manualGroupHeader}>
        <Text style={[styles.manualGroupLabel, { color: theme.text }]}>
          {label}
        </Text>
        <View
          style={[
            styles.manualTag,
            required
              ? {
                  backgroundColor: theme.accentSoft,
                  borderColor: theme.accent,
                }
              : {
                  backgroundColor: theme.panelActive,
                  borderColor: theme.border,
                },
          ]}
        >
          <Text
            style={[
              styles.manualTagLabel,
              { color: required ? theme.text : theme.textMuted },
            ]}
          >
            {required ? t("introTagRequired") : t("introOptional")}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.manualGroupCard,
          { backgroundColor: theme.panel, borderColor: theme.border },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

/**
 * Step two: one setup screen with a single green path.
 *
 * The hero hands off to the shared automatic setup job; a right-aligned
 * switch, off on every open, reveals the pipeline-ordered manual catalogue.
 * Model acquisition itself lives on the owning settings pages.
 */
function SetupStep({
  autoSetup,
  onConnectProvider,
  onInstallLocal,
  onOpenStt,
  onOpenTts,
  t,
}: IntroStepProps) {
  const theme = useIntroTheme();
  const [manualOpen, setManualOpen] = React.useState(false);

  return (
    <View style={styles.stack} testID="intro-setup-step">
      <IntroTitle>{t("introSetupTitle")}</IntroTitle>
      <IntroBody>{t("introSetupBody")}</IntroBody>
      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.heroBlock}>
        <Text style={[styles.heroTitle, { color: theme.text }]}>
          {t("introHeroTitle")}
        </Text>
        <Text style={[styles.heroBody, { color: theme.textSecondary }]}>
          {t("introHeroBody")}
        </Text>

        <View style={styles.glyphRow}>
          {(
            [
              ["mic", t("introGlyphListen")],
              ["cpu", t("introGlyphThink")],
              ["sound", t("introGlyphAnswer")],
            ] as const
          ).map(([glyph, label]) => (
            <View key={glyph} style={styles.glyphColumn}>
              <PhosphorIcon
                color={theme.textSecondary}
                name={glyph}
                size="control"
              />
              <Text style={[styles.glyphLabel, { color: theme.textMuted }]}>
                {label}
              </Text>
            </View>
          ))}
        </View>

        {autoSetup.state === "offer" ? (
          <Pressable
            accessibilityLabel={t("introAutoAction")}
            accessibilityRole="button"
            onPress={autoSetup.start}
            style={({ pressed }) => [
              styles.heroAction,
              {
                backgroundColor: theme.accent,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            testID="intro-auto-start"
          >
            <Text style={[styles.heroActionLabel, { color: theme.onAccent }]}>
              {t("introAutoAction")}
            </Text>
          </Pressable>
        ) : (
          <AutoSetupCard job={autoSetup} showHeader={false} t={t} />
        )}
      </View>

      <View style={styles.manualSwitchRow}>
        <Text style={[styles.manualSwitchLabel, { color: theme.text }]}>
          {t("introManualSwitch")}
        </Text>
        <SettingsSwitch
          label={t("introManualSwitch")}
          onChange={setManualOpen}
          testID="intro-manual-switch"
          value={manualOpen}
        />
      </View>

      {manualOpen ? (
        <View style={styles.manualStack} testID="intro-manual-catalogue">
          <Text style={[styles.manualTitle, { color: theme.text }]}>
            {t("introManualTitle")}
          </Text>

          <ManualGroup label={t("introGlyphListen")} t={t} theme={theme}>
            <ManualRow
              label={t("introManualPhoneRoute")}
              selected
              theme={theme}
            />
            <ManualRow
              label={t("introChooseModel")}
              last
              onPress={onOpenStt}
              testID="intro-manual-stt"
              theme={theme}
            />
          </ManualGroup>

          <ManualGroup
            label={t("introGlyphThink")}
            required
            t={t}
            theme={theme}
          >
            <ManualRow
              label={t("introChooseModel")}
              onPress={onInstallLocal}
              testID="intro-manual-llm"
              theme={theme}
            />
            <ManualRow
              label={t("introProviderLocked")}
              last
              locked
              onPress={onConnectProvider}
              testID="intro-manual-provider"
              theme={theme}
            />
          </ManualGroup>

          <ManualGroup label={t("introGlyphAnswer")} t={t} theme={theme}>
            <ManualRow
              label={t("introManualPhoneRoute")}
              selected
              theme={theme}
            />
            <ManualRow
              label={t("introChooseModel")}
              last
              onPress={onOpenTts}
              testID="intro-manual-tts"
              theme={theme}
            />
          </ManualGroup>
        </View>
      ) : null}
    </View>
  );
}

/**
 * Step three: the ephemeral test.
 *
 * A hold-to-talk turn runs on whatever the user just set up; the reply is
 * spoken and transcribed, with release-to-speech latency as the number that
 * improves when routes change. Nothing is saved.
 */
function TryStep({ t, testTurn }: IntroStepProps) {
  const theme = useIntroTheme();
  const recording = testTurn.phase === "recording";
  const running = testTurn.phase === "running";

  return (
    <View style={[styles.stack, styles.tryStack]} testID="intro-try-step">
      <IntroTitle>{t("introTryTitle")}</IntroTitle>
      <IntroBody>{t("introTryBody")}</IntroBody>
      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.tryBody}>
        {testTurn.turn ? (
          <View style={styles.tryTurn}>
            <View style={styles.tryTurnMine}>
              <Bubble mine theme={theme}>
                {testTurn.turn.question}
              </Bubble>
            </View>
            <View style={styles.tryTurnTheirs}>
              <Bubble theme={theme}>{testTurn.turn.answer}</Bubble>
            </View>
            <View style={styles.tryMetaRow}>
              {testTurn.turn.latencyLabel ? (
                <>
                  <Text style={[styles.tryMeta, { color: theme.textMuted }]}>
                    {testTurn.turn.latencyLabel} {t("introToFirstWord")}
                  </Text>
                  <Text style={[styles.tryMeta, { color: theme.textMuted }]}>
                    {"·"}
                  </Text>
                </>
              ) : null}
              <Pressable
                accessibilityLabel={t("introReplay")}
                accessibilityRole="button"
                disabled={testTurn.replaying}
                onPress={testTurn.onReplay}
                style={styles.tryReplay}
                testID="intro-try-replay"
              >
                <PhosphorIcon
                  color={theme.accent}
                  name="sound"
                  size="inline"
                />
                <Text style={[styles.tryMeta, { color: theme.accent }]}>
                  {t("introReplay")}
                </Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        <View style={styles.tryMicColumn}>
          <Pressable
            accessibilityLabel={t("introHoldToTalk")}
            accessibilityRole="button"
            accessibilityState={{ disabled: running }}
            disabled={running}
            onPressIn={testTurn.onPressIn}
            onPressOut={testTurn.onPressOut}
            style={[
              styles.tryMic,
              {
                backgroundColor: recording ? theme.panelActive : theme.accent,
                borderColor: recording ? theme.accent : "transparent",
                opacity: running ? 0.45 : 1,
                shadowColor: theme.accent,
              },
            ]}
            testID="intro-try-mic"
          >
            <PhosphorIcon
              color={recording ? theme.accent : theme.onAccent}
              name="mic"
              size="feature"
            />
          </Pressable>
          <Text style={[styles.tryMeta, { color: theme.textMuted }]}>
            {running ? t("pleaseWait") : t("introHoldToTalk")}
          </Text>
        </View>
      </View>
    </View>
  );
}

export const INTRO_STEP_CONTENT: Record<
  IntroStep,
  (props: IntroStepProps) => React.ReactElement
> = {
  welcome: WelcomeStep,
  setup: SetupStep,
  try: TryStep,
};

const styles = StyleSheet.create({
  bubble: {
    maxWidth: "84%",
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  bubbleMine: {
    alignSelf: "flex-end",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 5,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  bubbleText: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTheirs: {
    alignSelf: "flex-start",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 18,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 1,
  },
  // Earlier turns emerge from blur toward the crisp query. RN's filter blur
  // renders where the platform supports it; the opacity ladder carries the
  // same depth cue everywhere else.
  dialogueFar: {
    filter: [{ blur: 4 }],
    opacity: 0.5,
  },
  dialogueMid: {
    filter: [{ blur: 2.4 }],
    opacity: 0.65,
  },
  dialogueNear: {
    filter: [{ blur: 1.1 }],
    opacity: 0.85,
  },
  dialogueQuery: {
    marginTop: 9,
  },
  dialogueStack: {
    gap: 9,
  },
  dialogueZone: {
    flex: 1,
    justifyContent: "flex-end",
  },
  divider: {
    height: 1,
    marginTop: 6,
  },
  ellipsisRule: {
    fontFamily: fonts.mono,
    fontSize: 13,
    letterSpacing: 9,
    marginBottom: 4,
    marginTop: 12,
    paddingLeft: 9,
  },
  glyphColumn: {
    alignItems: "center",
    gap: 8,
  },
  glyphLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 0.4,
  },
  glyphRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 10,
    paddingHorizontal: 4,
    paddingTop: 14,
  },
  heroAction: {
    alignItems: "center",
    borderRadius: introRadius.control,
    justifyContent: "center",
    minHeight: 48,
  },
  heroActionLabel: {
    fontFamily: fonts.display,
    fontSize: 15,
  },
  heroBlock: {
    gap: 12,
    paddingHorizontal: 2,
    paddingTop: 10,
  },
  heroBody: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
  },
  heroTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    letterSpacing: -0.1,
  },
  languageChip: {
    alignItems: "center",
    borderRadius: 99,
    flexDirection: "row",
    gap: 5,
    minHeight: 32,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  languageChipLabel: {
    fontFamily: fonts.mono,
    fontSize: 11,
    lineHeight: 15,
  },
  manualGroupCard: {
    borderRadius: introRadius.panel - 2,
    borderWidth: 1,
    overflow: "hidden",
  },
  manualGroupHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    marginLeft: 2,
  },
  manualGroupLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  manualRadio: {
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 2,
    height: 20,
    justifyContent: "center",
    width: 20,
  },
  manualRadioDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  manualRow: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 12,
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  manualRowCopy: {
    flex: 1,
    minWidth: 0,
  },
  manualRowLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
  },
  manualRowLast: {
    borderBottomWidth: 0,
  },
  manualRowLocked: {
    opacity: 0.5,
  },
  manualRowMeta: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 0.4,
    marginTop: 2,
  },
  manualRowPressed: {
    opacity: 0.72,
  },
  manualStack: {
    gap: 16,
    paddingTop: 6,
  },
  manualSwitchRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 11,
    justifyContent: "flex-end",
    minHeight: 44,
    paddingHorizontal: 2,
  },
  manualSwitchLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  manualTag: {
    borderRadius: 99,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 2,
  },
  manualTagLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  manualTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    letterSpacing: -0.1,
  },
  playHero: {
    alignItems: "center",
    borderRadius: introRadius.pill,
    borderWidth: 2,
    elevation: 12,
    height: 128,
    justifyContent: "center",
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    width: 128,
  },
  sheetHeading: {
    fontFamily: fonts.display,
    fontSize: 15,
    marginBottom: 8,
    paddingHorizontal: 18,
  },
  sheetOption: {
    alignItems: "center",
    borderRadius: introRadius.control,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    marginHorizontal: 8,
    minHeight: 48,
    paddingHorizontal: 16,
  },
  sheetOptionLabel: {
    fontSize: 16,
  },
  sheetPanel: {
    alignSelf: "center",
    borderRadius: introRadius.panel,
    borderWidth: 1,
    left: 24,
    maxHeight: "70%",
    paddingBottom: 10,
    paddingTop: 18,
    position: "absolute",
    right: 24,
    top: "50%",
    transform: [{ translateY: -220 }],
  },
  sheetScrim: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  stack: {
    gap: 14,
  },
  tryBody: {
    flex: 1,
    gap: 10,
    paddingTop: 8,
  },
  tryMeta: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 0.4,
  },
  tryMetaRow: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: 7,
    minHeight: 32,
    paddingHorizontal: 2,
    paddingVertical: 4,
  },
  tryMic: {
    alignItems: "center",
    borderRadius: introRadius.pill,
    borderWidth: 2,
    elevation: 10,
    height: 76,
    justifyContent: "center",
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.24,
    shadowRadius: 24,
    width: 76,
  },
  tryMicColumn: {
    alignItems: "center",
    gap: 8,
    marginTop: "auto",
    paddingBottom: 8,
    paddingTop: 6,
  },
  tryReplay: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    minHeight: 32,
    paddingHorizontal: 4,
  },
  tryStack: {
    flex: 1,
  },
  tryTurn: {
    gap: 10,
  },
  tryTurnMine: {
    alignItems: "flex-end",
  },
  tryTurnTheirs: {
    alignItems: "flex-start",
  },
  welcome: {
    flex: 1,
    gap: 14,
  },
  welcomeCentre: {
    alignItems: "center",
    gap: 14,
    justifyContent: "center",
    paddingBottom: 10,
    paddingTop: 18,
  },
  voiceNote: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    maxWidth: 288,
    textAlign: "center",
  },
});
