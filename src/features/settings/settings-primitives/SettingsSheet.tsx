import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { Modal } from "../../../design-system/NativeControls";
import { SheetHeader } from "../../../design-system/SheetHeader";
import { useLocalization } from "../../../i18n";
import { useTheme } from "../../../theme/ThemeContext";

export function SettingsSheet({
  cardStyle,
  children,
  contentStyle,
  keyboardAvoiding = false,
  maxHeight = "84%",
  onClose,
  onDismiss,
  scrollable = true,
  subtitle,
  testID,
  title,
  visible,
}: {
  cardStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  keyboardAvoiding?: boolean;
  maxHeight?: ViewStyle["maxHeight"];
  onClose: () => void;
  onDismiss?: () => void;
  scrollable?: boolean;
  subtitle?: string | null;
  testID?: string;
  title: string;
  visible: boolean;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const content = scrollable ? (
    <ScrollView
      contentContainerStyle={[styles.content, contentStyle]}
      keyboardShouldPersistTaps="handled"
      testID={testID}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, contentStyle]} testID={testID}>
      {children}
    </View>
  );

  return (
    <Modal
      cardStyle={[
        styles.card,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
          maxHeight,
        },
        cardStyle,
      ]}
      keyboardAvoiding={keyboardAvoiding}
      layout="sheet"
      onClose={onClose}
      onDismiss={onDismiss}
      title={
        <SheetHeader
          closeAccessibilityLabel={t("dismiss")}
          onClose={onClose}
          subtitle={subtitle}
          testID={testID ? `${testID}-header` : undefined}
          title={title}
        />
      }
      visible={visible}
    >
      {content}
    </Modal>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 0,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  content: {
    flexShrink: 1,
    paddingBottom: 18,
    paddingHorizontal: 18,
  },
});
