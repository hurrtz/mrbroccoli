import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../../theme/colors";
import { TranslateFn } from "../shared";
import { voiceTextInputPagerStyles as styles } from "./styles";

interface DriveSessionControlsProps {
  active: boolean;
  canContinue: boolean;
  canRepeat: boolean;
  colors: Colors;
  disabled: boolean;
  onContinue?: () => void | Promise<void>;
  onRepeat?: () => void | Promise<void>;
  onStop?: () => void | Promise<void>;
  t: TranslateFn;
}

export function DriveSessionControls({
  active,
  canContinue,
  canRepeat,
  colors,
  disabled,
  onContinue,
  onRepeat,
  onStop,
  t,
}: DriveSessionControlsProps) {
  const continueDisabled = disabled || !canContinue;

  return (
    <View testID="drive-session-controls" style={styles.driveControls}>
      <TouchableOpacity
        testID="drive-session-stop"
        accessibilityLabel={t("stopDriveSession")}
        accessibilityRole="button"
        accessibilityState={{ disabled: !active }}
        activeOpacity={0.76}
        disabled={!active}
        onPress={() => {
          void onStop?.();
        }}
        style={[
          styles.driveControl,
          {
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.border,
            opacity: active ? 1 : 0.45,
          },
        ]}
      >
        <Feather name="square" size={16} color={colors.text} />
        <Text style={[styles.driveControlLabel, { color: colors.text }]}>
          {t("stopDriveSession")}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        testID="drive-session-repeat"
        accessibilityLabel={t("repeatDriveReply")}
        accessibilityRole="button"
        accessibilityState={{ disabled: !canRepeat }}
        activeOpacity={0.76}
        disabled={!canRepeat}
        onPress={() => {
          void onRepeat?.();
        }}
        style={[
          styles.driveControl,
          {
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.border,
            opacity: canRepeat ? 1 : 0.45,
          },
        ]}
      >
        <Feather name="repeat" size={17} color={colors.text} />
        <Text style={[styles.driveControlLabel, { color: colors.text }]}>
          {t("repeatDriveReply")}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        testID="drive-session-continue"
        accessibilityLabel={t("continueDriveSession")}
        accessibilityRole="button"
        accessibilityState={{ disabled: continueDisabled }}
        activeOpacity={0.76}
        disabled={continueDisabled}
        onPress={() => {
          void onContinue?.();
        }}
        style={[
          styles.driveControl,
          {
            backgroundColor: colors.bubbleUser,
            borderColor: colors.bubbleUser,
            opacity: continueDisabled ? 0.45 : 1,
          },
        ]}
      >
        <Feather name="play" size={17} color={colors.onPrimary} />
        <Text
          style={[styles.driveControlLabel, { color: colors.onPrimary }]}
        >
          {t("continueDriveSession")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
