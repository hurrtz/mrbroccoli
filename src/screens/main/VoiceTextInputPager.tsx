import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import React from "react";
import { AccessibilityInfo, Text, TouchableOpacity, View } from "react-native";
import { VoiceOrb } from "../../design-system/VoiceOrb";
import { MessageImageAttachments } from "../../components/MessageImageAttachments";
import { useOrbTurnProgress } from "./useOrbTurnProgress";
import { InputSurfacePages } from "./voiceTextInputPager/InputSurfacePages";
import { voiceTextInputPagerStyles as styles } from "./voiceTextInputPager/styles";
import { VoiceTextInputPagerProps } from "./voiceTextInputPager/types";
import { useInputSurfacePager } from "./voiceTextInputPager/useInputSurfacePager";

export type { InputSurface } from "./voiceTextInputPager/types";

export function VoiceTextInputPager({
  attachments = [],
  colors,
  compactPromptNotice = false,
  disabled,
  footer,
  initialSurface = "voice",
  initialTextInputFocused = false,
  initialTextMessage = "",
  inputMode,
  isActive,
  layout,
  onInputSurfaceChange,
  onRemoveImage,
  onPress,
  onPressIn,
  onPressOut,
  onResolvePromptBlock,
  onSubmitTextMessage,
  onTextInputFocusChange,
  onTextMessageChange,
  orbProgressOverride = null,
  playbackPaused,
  promptBlockedActionEnabled = false,
  promptBlockedActionLabel = null,
  promptBlockedMessage = null,
  readingProgress = null,
  readingProgressTiming = null,
  recordingMaxMs,
  recordingStartedAtMs,
  phaseTimingProgress,
  speechStartProgress,
  maxOrbSize,
  statusLabel,
  t,
  visualPhase,
  voiceInputUnavailableMessage = null,
}: VoiceTextInputPagerProps) {
  const [viewportHeight, setViewportHeight] = React.useState(0);
  const pager = useInputSurfacePager({
    disabled,
    initialSurface,
    initialTextInputFocused,
    initialTextMessage,
    isActive,
    onInputSurfaceChange,
    onSubmitTextMessage,
    onTextInputFocusChange,
    onTextMessageChange,
    submissionDisabled: Boolean(promptBlockedMessage),
  });
  // The orb is the largest circle that fits between the two 44pt surface
  // controls and inside the measured stage. The clamp preserves a useful tap
  // target on constrained windows without hard-coding one portrait size.
  const stageSize = Math.max(
    96,
    Math.min(
      maxOrbSize,
      viewportHeight || maxOrbSize,
      Math.max(96, pager.pageWidth - 92),
    ),
  );
  const derivedProgress = useOrbTurnProgress({
    phaseTimingProgress: phaseTimingProgress ?? null,
    readingProgress,
    readingProgressTiming,
    recordingMaxMs,
    recordingStartedAtMs: recordingStartedAtMs ?? null,
    speechStartProgress: speechStartProgress ?? null,
    visualPhase,
  });
  const progress = orbProgressOverride ?? derivedProgress;
  const showCompactPromptAction =
    compactPromptNotice &&
    Boolean(onResolvePromptBlock) &&
    promptBlockedActionEnabled;
  // Announce phase boundaries, not animation frames — the orb replaces the
  // bar that used to own this announcement.
  const previousVisualPhase = React.useRef(visualPhase);
  React.useEffect(() => {
    if (previousVisualPhase.current === visualPhase) {
      return;
    }
    previousVisualPhase.current = visualPhase;
    AccessibilityInfo.announceForAccessibility(statusLabel);
  }, [statusLabel, visualPhase]);

  const handleViewportLayout = (
    event: Parameters<typeof pager.handleLayout>[0],
  ) => {
    pager.handleLayout(event);
    const nextHeight = Math.round(event.nativeEvent.layout.height);
    if (!Number.isFinite(nextHeight) || nextHeight <= 0) {
      return;
    }
    setViewportHeight((currentHeight) =>
      Math.abs(currentHeight - nextHeight) >= 1 ? nextHeight : currentHeight,
    );
  };

  return (
    <View
      style={[styles.root, footer ? styles.rootWithFooter : null]}
      testID="voice-text-input-stage"
    >
      <MessageImageAttachments
        attachments={attachments}
        colors={colors}
        compact
        onRemove={disabled || isActive ? undefined : onRemoveImage}
        t={t}
      />
      <View
        testID="voice-text-input-viewport"
        onLayout={handleViewportLayout}
        style={[
          styles.viewportFlexible,
          footer
            ? [
                styles.viewportWithFooter,
                { flexBasis: maxOrbSize, maxHeight: maxOrbSize },
              ]
            : null,
        ]}
      >
        <InputSurfacePages
          activeSurface={pager.activeSurface}
          colors={colors}
          disabled={disabled}
          inputMode={inputMode}
          isActive={isActive}
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onSelectSurface={pager.selectSurface}
          onSubmitTextMessage={pager.handleSubmitTextMessage}
          onTextFocusChange={pager.handleTextFocusChange}
          onTextMessageChange={pager.handleTextMessageChange}
          pageWidth={pager.pageWidth}
          panGesture={pager.panGesture}
          promptBlockedMessage={promptBlockedMessage}
          stageSize={stageSize}
          statusLabel={statusLabel}
          submissionDisabled={Boolean(promptBlockedMessage)}
          t={t}
          textFocused={pager.textFocused}
          textInputGesture={pager.textInputGesture}
          textInputRef={pager.textInputRef}
          textMessage={pager.textMessage}
          textPageStyle={pager.textPageStyle}
          textSubmitDisabled={pager.textSubmitDisabled}
          trackAnimatedStyle={pager.trackAnimatedStyle}
          voiceInputUnavailableMessage={voiceInputUnavailableMessage}
          voicePageStyle={pager.voicePageStyle}
        />
        {isActive ? (
          <View
            style={[styles.activeActionOverlay, styles.activeOrbOverlay]}
            testID={`voice-stage-${visualPhase}-orb`}
          >
            <VoiceOrb
              label={statusLabel}
              onPress={inputMode === "push-to-talk" ? undefined : onPress}
              onPressIn={inputMode === "push-to-talk" ? onPressIn : undefined}
              onPressOut={inputMode === "push-to-talk" ? onPressOut : undefined}
              overtime={progress.overtime}
              overtimeTiming={progress.overtimeTiming}
              phase={visualPhase}
              // Pausing stops a clock, but where the reply has been read to is
              // a position — it stays put until playback moves again.
              phaseProgress={progress.phaseProgress}
              phaseProgressTiming={
                visualPhase === "speaking" && playbackPaused
                  ? undefined
                  : progress.phaseProgressTiming
              }
              size={stageSize}
              testID="voice-orb-active"
              turnProgress={progress.turnProgress}
              turnProgressTiming={progress.turnProgressTiming}
            />
          </View>
        ) : null}
      </View>

      {promptBlockedMessage ? (
        <TouchableOpacity
          testID="prompt-blocked-notice"
          accessibilityLabel={
            onResolvePromptBlock && promptBlockedActionEnabled
              ? `${promptBlockedMessage} ${
                  promptBlockedActionLabel ?? t("openSpeakingSettings")
                }`
              : promptBlockedMessage
          }
          accessibilityRole={
            onResolvePromptBlock && promptBlockedActionEnabled
              ? "button"
              : "text"
          }
          activeOpacity={
            onResolvePromptBlock && promptBlockedActionEnabled ? 0.76 : 1
          }
          disabled={!onResolvePromptBlock || !promptBlockedActionEnabled}
          onPress={
            onResolvePromptBlock && promptBlockedActionEnabled
              ? onResolvePromptBlock
              : undefined
          }
          style={[
            styles.promptBlockedNotice,
            {
              backgroundColor: colors.surfaceAlt,
              borderColor: colors.border,
            },
          ]}
        >
          <PhosphorIcon
            name="exclamation-circle"
            size="compact"
            color={colors.danger}
          />
          <View style={styles.promptBlockedCopy}>
            <Text
              accessibilityLiveRegion="assertive"
              accessibilityRole="alert"
              style={[
                showCompactPromptAction
                  ? styles.promptBlockedAction
                  : styles.promptBlockedText,
                {
                  color: showCompactPromptAction
                    ? colors.accent
                    : colors.textSecondary,
                },
              ]}
            >
              {showCompactPromptAction
                ? (promptBlockedActionLabel ?? t("openSpeakingSettings"))
                : promptBlockedMessage}
            </Text>
            {!showCompactPromptAction &&
            onResolvePromptBlock &&
            promptBlockedActionEnabled ? (
              <Text
                style={[styles.promptBlockedAction, { color: colors.accent }]}
              >
                {promptBlockedActionLabel ?? t("openSpeakingSettings")}
              </Text>
            ) : null}
          </View>
          {onResolvePromptBlock && promptBlockedActionEnabled ? (
            <PhosphorIcon
              name="right"
              size="compact"
              color={colors.textSecondary}
            />
          ) : null}
        </TouchableOpacity>
      ) : null}

      {footer ? (
        <View style={styles.footer} testID="voice-text-input-footer">
          {footer}
        </View>
      ) : null}
    </View>
  );
}
