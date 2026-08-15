import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import { Modal } from "../../design-system/NativeControls";
import { SheetHeader } from "../../design-system/SheetHeader";
import { useTheme } from "../../theme/ThemeContext";
import { fonts } from "../../theme/typography";
import type { TranslateFn } from "./shared";

export function ImageSourceSheet({
  onChooseFromPhotos,
  onClose,
  onTakePhoto,
  t,
  visible,
}: {
  onChooseFromPhotos: () => void;
  onClose: () => void;
  onTakePhoto: () => void;
  t: TranslateFn;
  visible: boolean;
}) {
  const { colors } = useTheme();
  const pendingActionRef = React.useRef<(() => void) | null>(null);
  const fallbackTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const drainPendingAction = React.useCallback(() => {
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    const action = pendingActionRef.current;
    pendingActionRef.current = null;
    action?.();
  }, []);
  const closeThen = React.useCallback(
    (action: () => void) => {
      pendingActionRef.current = action;
      onClose();
      if (Platform.OS !== "ios") {
        fallbackTimerRef.current = setTimeout(drainPendingAction, 250);
      }
    },
    [drainPendingAction, onClose],
  );
  React.useEffect(
    () => () => {
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
      }
      pendingActionRef.current = null;
    },
    [],
  );
  const actions = [
    {
      icon: "image" as const,
      label: t("takePhoto"),
      onPress: () => closeThen(onTakePhoto),
      testID: "image-source-camera",
    },
    {
      icon: "image" as const,
      label: t("chooseFromPhotos"),
      onPress: () => closeThen(onChooseFromPhotos),
      testID: "image-source-library",
    },
  ];

  return (
    <Modal
      layout="sheet"
      onClose={onClose}
      onDismiss={drainPendingAction}
      title={
        <SheetHeader
          closeAccessibilityLabel={t("dismiss")}
          onClose={onClose}
          testID="image-source-header"
          title={t("chooseImageSource")}
        />
      }
      visible={visible}
    >
      <View
        style={[styles.list, { borderColor: colors.border }]}
        testID="image-source-sheet"
      >
        {actions.map((action, index) => (
          <Pressable
            key={action.testID}
            accessibilityLabel={action.label}
            accessibilityRole="button"
            onPress={action.onPress}
            style={({ pressed }) => [
              styles.row,
              index < actions.length - 1
                ? {
                    borderBottomColor: colors.border,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                  }
                : null,
              pressed ? { backgroundColor: colors.surfaceAlt } : null,
            ]}
            testID={action.testID}
          >
            <PhosphorIcon
              color={colors.accent}
              name={action.icon}
              size="control"
            />
            <Text style={[styles.label, { color: colors.text }]}>
              {action.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  label: {
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 20,
  },
  list: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
});
