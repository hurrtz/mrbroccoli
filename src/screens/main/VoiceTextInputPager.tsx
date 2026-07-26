import Feather from "@expo/vector-icons/Feather";
import React from "react";
import {
  Keyboard,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  TouchableOpacity as GestureTouchableOpacity,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { useReducedMotion } from "../../hooks/useReducedMotion";
import { Colors } from "../../theme/colors";
import { textStyles } from "../../theme/typography";
import {
  InputMode,
  VoicePhaseProgress,
  VoiceVisualPhase,
} from "../../types";

import { PhaseAwareVoiceAction } from "./PhaseAwareVoiceAction";
import { TranslateFn } from "./shared";

export type InputSurface = "voice" | "text";

interface VoiceTextInputPagerProps {
  colors: Colors;
  disabled: boolean;
  driveSessionActive?: boolean;
  driveSessionCanContinue?: boolean;
  driveSessionCanRepeat?: boolean;
  initialSurface?: InputSurface;
  initialTextMessage?: string;
  inputMode: InputMode;
  isActive: boolean;
  onInputSurfaceChange?: (surface: InputSurface) => void;
  onDriveContinue?: () => void | Promise<void>;
  onDriveRepeat?: () => void | Promise<void>;
  onDriveStop?: () => void | Promise<void>;
  onOpenStatusDetails: () => void;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
  onStopPlayback?: () => void | Promise<void>;
  onSubmitTextMessage: (text: string) => void;
  onTextMessageChange?: (text: string) => void;
  phaseLabel: string;
  phaseProgress?: VoicePhaseProgress | null;
  playbackActive?: boolean;
  playbackPaused?: boolean;
  recordingMaxMs: number;
  statusLabel: string;
  stopPlaybackLabel: string;
  t: TranslateFn;
  visualPhase: VoiceVisualPhase;
}

const SURFACE_INDEX: Record<InputSurface, number> = {
  voice: 0,
  text: 1,
};
// Preserve the same 16pt breathing room on both sides while one surface
// leaves and the other enters the viewport.
const PAGE_GAP = 32;

export function VoiceTextInputPager({
  colors,
  disabled,
  driveSessionActive = false,
  driveSessionCanContinue = false,
  driveSessionCanRepeat = false,
  initialSurface = "voice",
  initialTextMessage = "",
  inputMode,
  isActive,
  onInputSurfaceChange,
  onDriveContinue,
  onDriveRepeat,
  onDriveStop,
  onOpenStatusDetails,
  onPress,
  onPressIn,
  onPressOut,
  onStopPlayback,
  onSubmitTextMessage,
  onTextMessageChange,
  phaseLabel,
  phaseProgress,
  playbackActive,
  playbackPaused,
  recordingMaxMs,
  statusLabel,
  stopPlaybackLabel,
  t,
  visualPhase,
}: VoiceTextInputPagerProps) {
  const { width: windowWidth } = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const textInputRef = React.useRef<TextInput>(null);
  const [viewportWidth, setViewportWidth] = React.useState(0);
  const [activeSurface, setActiveSurface] =
    React.useState<InputSurface>(initialSurface);
  const [textFocused, setTextFocused] = React.useState(false);
  const [textMessage, setTextMessage] = React.useState(initialTextMessage);
  const pageWidth = viewportWidth || Math.max(1, windowWidth - 32);
  const pageStride = pageWidth + PAGE_GAP;
  const pageStrideShared = useSharedValue(pageStride);
  const trackTranslateX = useSharedValue(0);
  const gestureStartX = useSharedValue(0);
  const activeSurfaceIndex = useSharedValue(0);
  const trimmedTextMessage = textMessage.trim();
  const hasTextMessage = trimmedTextMessage.length > 0;
  const textSubmitDisabled = disabled || isActive || !hasTextMessage;

  const focusTextInput = React.useCallback(() => {
    requestAnimationFrame(() => textInputRef.current?.focus());
  }, []);

  const applySurface = React.useCallback(
    (surface: InputSurface, focusText: boolean) => {
      setActiveSurface(surface);
      onInputSurfaceChange?.(surface);
      if (surface === "text" && focusText && !disabled && !isActive) {
        focusTextInput();
      } else if (surface === "voice") {
        Keyboard.dismiss();
      }
    },
    [disabled, focusTextInput, isActive, onInputSurfaceChange],
  );

  const handleTextMessageChange = React.useCallback(
    (text: string) => {
      setTextMessage(text);
      onTextMessageChange?.(text);
    },
    [onTextMessageChange],
  );

  const selectSurface = React.useCallback(
    (surface: InputSurface) => {
      const targetX = -SURFACE_INDEX[surface] * pageStride;
      if (reducedMotion) {
        trackTranslateX.value = targetX;
        applySurface(surface, surface === "text");
        return;
      }

      trackTranslateX.value = withTiming(
        targetX,
        { duration: 220 },
        (finished) => {
          if (finished) {
            runOnJS(applySurface)(surface, surface === "text");
          }
        },
      );
    },
    [applySurface, pageStride, reducedMotion, trackTranslateX],
  );

  React.useEffect(() => {
    pageStrideShared.value = pageStride;
    activeSurfaceIndex.value = SURFACE_INDEX[activeSurface];
    trackTranslateX.value = -SURFACE_INDEX[activeSurface] * pageStride;
  }, [
    activeSurface,
    activeSurfaceIndex,
    pageStride,
    pageStrideShared,
    trackTranslateX,
  ]);

  React.useEffect(() => {
    if (isActive) {
      Keyboard.dismiss();
    }
  }, [isActive]);

  const handleLayout = React.useCallback((event: LayoutChangeEvent) => {
    const nextWidth = Math.round(event.nativeEvent.layout.width);
    setViewportWidth((currentWidth) =>
      Math.abs(currentWidth - nextWidth) >= 1 ? nextWidth : currentWidth,
    );
  }, []);

  const textInputGesture = React.useMemo(
    () => Gesture.Native().disallowInterruption(false),
    [],
  );

  const panGesture = React.useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-12, 12])
        .failOffsetY([-14, 14])
        .simultaneousWithExternalGesture(textInputGesture)
        .onStart(() => {
          gestureStartX.value = trackTranslateX.value;
        })
        .onUpdate((event) => {
          const nextX = gestureStartX.value + event.translationX;
          trackTranslateX.value = Math.max(
            -pageStrideShared.value,
            Math.min(0, nextX),
          );
        })
        .onEnd((event) => {
          const projectedX = trackTranslateX.value + event.velocityX * 0.12;
          const nextSurface: InputSurface =
            projectedX <= -pageStrideShared.value / 2 ? "text" : "voice";
          const targetX = -SURFACE_INDEX[nextSurface] * pageStrideShared.value;

          if (reducedMotion) {
            trackTranslateX.value = targetX;
            runOnJS(applySurface)(nextSurface, nextSurface === "text");
            return;
          }

          trackTranslateX.value = withSpring(
            targetX,
            {
              damping: 22,
              mass: 0.72,
              stiffness: 230,
            },
            (finished) => {
              if (finished) {
                runOnJS(applySurface)(nextSurface, nextSurface === "text");
              }
            },
          );
        })
        .onFinalize((_event, success) => {
          if (success) {
            return;
          }

          const targetX =
            -activeSurfaceIndex.value * pageStrideShared.value;
          trackTranslateX.value = reducedMotion
            ? targetX
            : withSpring(targetX, {
                damping: 22,
                mass: 0.72,
                stiffness: 230,
              });
        }),
    [
      activeSurfaceIndex,
      applySurface,
      gestureStartX,
      pageStrideShared,
      reducedMotion,
      textInputGesture,
      trackTranslateX,
    ],
  );

  const trackAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: trackTranslateX.value }],
  }));

  const handleSubmitTextMessage = React.useCallback(() => {
    if (textSubmitDisabled) {
      return;
    }

    onSubmitTextMessage(trimmedTextMessage);
    setTextMessage("");
    onTextMessageChange?.("");
    Keyboard.dismiss();
  }, [
    onSubmitTextMessage,
    onTextMessageChange,
    textSubmitDisabled,
    trimmedTextMessage,
  ]);

  return (
    <View style={localStyles.root}>
      <View
        testID="voice-text-input-viewport"
        onLayout={handleLayout}
        style={localStyles.viewport}
      >
        <GestureDetector gesture={panGesture}>
          <Animated.View
            testID="voice-text-input-pager"
            accessibilityElementsHidden={isActive}
            importantForAccessibility={
              isActive ? "no-hide-descendants" : "auto"
            }
            pointerEvents={isActive ? "none" : "auto"}
            style={[
              localStyles.track,
              { width: pageWidth * 2 + PAGE_GAP },
              trackAnimatedStyle,
              isActive ? localStyles.trackCovered : null,
            ]}
          >
            <View
              accessibilityElementsHidden={activeSurface !== "voice"}
              importantForAccessibility={
                activeSurface === "voice" ? "yes" : "no-hide-descendants"
              }
              style={[localStyles.page, { width: pageWidth }]}
            >
              <GestureTouchableOpacity
                testID="voice-input-surface"
                accessibilityLabel={statusLabel}
                accessibilityRole="button"
                accessibilityState={{ disabled }}
                activeOpacity={0.84}
                disabled={disabled}
                onPress={
                  inputMode === "push-to-talk" ? undefined : onPress
                }
                onPressIn={
                  inputMode === "push-to-talk" ? onPressIn : undefined
                }
                onPressOut={
                  inputMode === "push-to-talk" ? onPressOut : undefined
                }
                style={[
                  localStyles.voiceSurface,
                  {
                    backgroundColor: disabled
                      ? colors.surfaceAlt
                      : colors.activeControl,
                    borderColor: disabled ? colors.border : colors.activeControl,
                  },
                ]}
              >
                <View
                  testID="voice-input-icon"
                  style={[
                    localStyles.voiceIcon,
                    {
                      backgroundColor: disabled
                        ? colors.surfaceElevated
                        : colors.activeControlIconBackground,
                    },
                  ]}
                >
                  <Feather
                    name="mic"
                    size={22}
                    color={
                      disabled ? colors.textMuted : colors.activeControlIcon
                    }
                  />
                </View>
              </GestureTouchableOpacity>
            </View>

            <View
              accessibilityElementsHidden={activeSurface !== "text"}
              importantForAccessibility={
                activeSurface === "text" ? "yes" : "no-hide-descendants"
              }
              style={[localStyles.page, { width: pageWidth }]}
            >
              <View
                testID="text-input-surface"
                style={[
                  localStyles.textSurface,
                  {
                    backgroundColor: colors.surfaceElevated,
                    borderColor: textFocused
                      ? colors.accent
                      : colors.borderStrong,
                    shadowColor: textFocused ? colors.glowStrong : colors.glow,
                  },
                ]}
              >
                <View style={localStyles.textInputWrap}>
                  <GestureDetector gesture={textInputGesture}>
                    <TextInput
                      ref={textInputRef}
                      testID="voice-text-input"
                      value={textMessage}
                      onBlur={() => setTextFocused(false)}
                      onChangeText={handleTextMessageChange}
                      onFocus={() => setTextFocused(true)}
                      placeholder={t("textMessagePlaceholder")}
                      placeholderTextColor={colors.textMuted}
                      editable={!disabled}
                      multiline
                      returnKeyType="send"
                      submitBehavior="submit"
                      onSubmitEditing={handleSubmitTextMessage}
                      style={[localStyles.textInput, { color: colors.text }]}
                    />
                  </GestureDetector>
                </View>
                <TouchableOpacity
                  testID="voice-text-primary-action"
                  accessibilityLabel={t("sendTextMessage")}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: textSubmitDisabled }}
                  disabled={textSubmitDisabled}
                  onPress={handleSubmitTextMessage}
                  activeOpacity={0.8}
                  style={[
                    localStyles.sendButton,
                    {
                      backgroundColor: textSubmitDisabled
                        ? colors.surfaceAlt
                        : colors.bubbleUser,
                    },
                  ]}
                >
                  <Feather
                    name="arrow-up"
                    size={19}
                    color={
                      textSubmitDisabled ? colors.textMuted : colors.onPrimary
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </GestureDetector>
        {isActive ? (
          <View style={localStyles.activeActionOverlay}>
            <PhaseAwareVoiceAction
              colors={colors}
              inputMode={inputMode}
              onOpenStatusDetails={onOpenStatusDetails}
              onPress={onPress}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onStopPlayback={onStopPlayback}
              phaseLabel={phaseLabel}
              phaseProgress={phaseProgress}
              playbackActive={playbackActive}
              playbackPaused={playbackPaused}
              recordingMaxMs={recordingMaxMs}
              statusLabel={statusLabel}
              stopPlaybackLabel={stopPlaybackLabel}
              t={t}
              visualPhase={visualPhase}
            />
          </View>
        ) : null}
      </View>

      {inputMode === "drive-session" ? (
        <View testID="drive-session-controls" style={localStyles.driveControls}>
          <TouchableOpacity
            testID="drive-session-stop"
            accessibilityLabel={t("stopDriveSession")}
            accessibilityRole="button"
            accessibilityState={{ disabled: !driveSessionActive }}
            activeOpacity={0.76}
            disabled={!driveSessionActive}
            onPress={() => {
              void onDriveStop?.();
            }}
            style={[
              localStyles.driveControl,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.border,
                opacity: driveSessionActive ? 1 : 0.45,
              },
            ]}
          >
            <Feather name="square" size={16} color={colors.text} />
            <Text style={[localStyles.driveControlLabel, { color: colors.text }]}>
              {t("stopDriveSession")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="drive-session-repeat"
            accessibilityLabel={t("repeatDriveReply")}
            accessibilityRole="button"
            accessibilityState={{ disabled: !driveSessionCanRepeat }}
            activeOpacity={0.76}
            disabled={!driveSessionCanRepeat}
            onPress={() => {
              void onDriveRepeat?.();
            }}
            style={[
              localStyles.driveControl,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.border,
                opacity: driveSessionCanRepeat ? 1 : 0.45,
              },
            ]}
          >
            <Feather name="repeat" size={17} color={colors.text} />
            <Text style={[localStyles.driveControlLabel, { color: colors.text }]}>
              {t("repeatDriveReply")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="drive-session-continue"
            accessibilityLabel={t("continueDriveSession")}
            accessibilityRole="button"
            accessibilityState={{
              disabled: disabled || !driveSessionCanContinue,
            }}
            activeOpacity={0.76}
            disabled={disabled || !driveSessionCanContinue}
            onPress={() => {
              void onDriveContinue?.();
            }}
            style={[
              localStyles.driveControl,
              {
                backgroundColor: colors.bubbleUser,
                borderColor: colors.bubbleUser,
                opacity:
                  disabled || !driveSessionCanContinue ? 0.45 : 1,
              },
            ]}
          >
            <Feather name="play" size={17} color={colors.onPrimary} />
            <Text
              style={[
                localStyles.driveControlLabel,
                { color: colors.onPrimary },
              ]}
            >
              {t("continueDriveSession")}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={localStyles.pageIndicators}>
        {(["voice", "text"] as const).map((surface) => {
          const selected = activeSurface === surface;
          return (
            <TouchableOpacity
              key={surface}
              testID={`show-${surface}-input`}
              accessibilityLabel={
                surface === "voice"
                  ? t("showVoiceInput")
                  : t("showTextInput")
              }
              accessibilityRole="button"
              accessibilityState={{ disabled: isActive, selected }}
              activeOpacity={0.7}
              disabled={isActive}
              onPress={() => selectSurface(surface)}
              style={localStyles.pageIndicatorTarget}
            >
              <View
                style={[
                  localStyles.pageIndicator,
                  selected
                    ? localStyles.pageIndicatorSelected
                    : localStyles.pageIndicatorIdle,
                  {
                    backgroundColor: selected
                      ? colors.accent
                      : colors.borderStrong,
                  },
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  root: {
    width: "100%",
    gap: 2,
  },
  viewport: {
    width: "100%",
    minHeight: 68,
    overflow: "hidden",
    position: "relative",
  },
  track: {
    flexDirection: "row",
    gap: PAGE_GAP,
  },
  trackCovered: {
    opacity: 0,
  },
  activeActionOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  page: {
    justifyContent: "center",
  },
  voiceSurface: {
    width: "100%",
    minHeight: 68,
    borderRadius: 17,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  voiceIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  textSurface: {
    width: "100%",
    minHeight: 68,
    maxHeight: 116,
    borderRadius: 15,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 16,
    paddingRight: 9,
    paddingVertical: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  textInput: {
    ...textStyles.body,
    flex: 1,
    minHeight: 24,
    maxHeight: 96,
    paddingVertical: 0,
    textAlignVertical: "center",
  },
  textInputWrap: {
    flex: 1,
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  pageIndicators: {
    height: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
  },
  driveControls: {
    flexDirection: "row",
    gap: 8,
    paddingTop: 6,
  },
  driveControl: {
    flex: 1,
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  driveControlLabel: {
    fontFamily: textStyles.body.fontFamily,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  pageIndicatorTarget: {
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  pageIndicator: {
    height: 4,
    borderRadius: 2,
  },
  pageIndicatorSelected: {
    width: 16,
  },
  pageIndicatorIdle: {
    width: 5,
  },
});
