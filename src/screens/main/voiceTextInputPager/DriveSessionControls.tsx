import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../../theme/colors";
import { TranslateFn } from "../shared";
import { voiceTextInputPagerStyles as styles } from "./styles";

interface DriveSessionControlsProps {
  autoContinueEnabled: boolean;
  canRepeat: boolean;
  colors: Colors;
  disabled: boolean;
  onContinue?: () => void | Promise<void>;
  onRepeat?: () => void | Promise<void>;
  onStop?: () => void | Promise<void>;
  t: TranslateFn;
}

export function DriveSessionControls({
  autoContinueEnabled,
  canRepeat,
  colors,
  disabled,
  onContinue,
  onRepeat,
  onStop,
  t,
}: DriveSessionControlsProps) {
  const stopDisabled = disabled || !autoContinueEnabled;
  const continueDisabled = disabled || autoContinueEnabled;

  return (
    <View testID="drive-session-controls" style={styles.driveControls}>
      <TouchableOpacity
        testID="drive-session-stop"
        accessibilityLabel={t("stopDriveSession")}
        accessibilityRole="button"
        accessibilityState={{ disabled: stopDisabled }}
        activeOpacity={0.76}
        disabled={stopDisabled}
        onPress={() => {
          void onStop?.();
        }}
        style={[
          styles.driveControl,
          {
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.border,
            opacity: stopDisabled ? 0.45 : 1,
          },
        ]}
      >
        <Feather name="pause" size={17} color={colors.text} />
        <Text style={[styles.driveControlLabel, { color: colors.text }]}>
          {t("stopDriveSession")}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        testID="drive-session-repeat"
        accessibilityLabel={t("repeatDriveReply")}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || !canRepeat }}
        activeOpacity={0.76}
        disabled={disabled || !canRepeat}
        onPress={() => {
          void onRepeat?.();
        }}
        style={[
          styles.driveControl,
          {
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.border,
            opacity: disabled || !canRepeat ? 0.45 : 1,
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
