import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { APP_MODAL_ORIENTATIONS } from "../../constants/layout";
import { AntIconButton } from "../../design-system/AntIconButton";
import { Colors } from "../../theme/colors";

import { TranslateFn } from "./shared";
import { styles } from "./styles";

interface StatusDetailsModalProps {
  colors: Colors;
  fallbackTtsStatusLabel: string | null;
  isActive: boolean;
  messageCountLabel: string | null;
  onClose: () => void;
  routeModelLabel: string;
  statusDetail: string;
  statusTitle: string;
  sttStatusLabel: string;
  t: TranslateFn;
  ttsStatusLabel: string;
  visible: boolean;
}

export const StatusDetailsModal = React.memo(function StatusDetailsModal({
  colors,
  fallbackTtsStatusLabel,
  isActive,
  messageCountLabel,
  onClose,
  routeModelLabel,
  statusDetail,
  statusTitle,
  sttStatusLabel,
  t,
  ttsStatusLabel,
  visible,
}: StatusDetailsModalProps) {
  const { height, width } = useWindowDimensions();
  const isLandscape = width > height;
  const cardMaxWidth = isLandscape ? Math.min(width - 40, 760) : 520;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      supportedOrientations={APP_MODAL_ORIENTATIONS}
    >
      <SafeAreaView style={styles.statusDetailsOverlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          activeOpacity={1}
        />
        <View
          style={[
            styles.statusDetailsCard,
            { maxWidth: cardMaxWidth },
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              shadowColor: colors.glow,
            },
          ]}
        >
          <View style={styles.statusDetailsHeader}>
            <View style={styles.statusDetailsHeaderCopy}>
              <Text style={[styles.statusDetailsTitle, { color: colors.text }]}>
                {t("currentSetup")}
              </Text>
              <Text
                style={[
                  styles.statusDetailsSubtitle,
                  { color: colors.textSecondary },
                ]}
              >
                {statusDetail}
              </Text>
            </View>
            <AntIconButton
              icon="close"
              iconSize={18}
              style={[
                styles.menuIconButton,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.border,
                },
              ]}
              onPress={onClose}
              accessibilityLabel={t("dismiss")}
            />
          </View>

          <View style={styles.statusDetailsBadges}>
            <View
              style={[
                styles.livePill,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.liveDot,
                  {
                    backgroundColor: isActive
                      ? colors.accent
                      : colors.textMuted,
                  },
                ]}
              />
              <Text
                style={[styles.livePillText, { color: colors.textSecondary }]}
              >
                {statusTitle}
              </Text>
            </View>
            {messageCountLabel ? (
              <View
                style={[
                  styles.statusDetailsBadge,
                  {
                    backgroundColor: colors.surfaceElevated,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusDetailsBadgeText,
                    { color: colors.textSecondary },
                  ]}
                >
                  {messageCountLabel}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.statusDetailsList}>
            <View
              style={[
                styles.statusDetailsItem,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusDetailsItemLabel,
                  { color: colors.textMuted },
                ]}
              >
                {t("speechInputRoute", { route: sttStatusLabel })}
              </Text>
            </View>
            <View
              style={[
                styles.statusDetailsItem,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusDetailsItemLabel,
                  { color: colors.textMuted },
                ]}
              >
                {t("replyModelRoute", { route: routeModelLabel })}
              </Text>
            </View>
            <View
              style={[
                styles.statusDetailsItem,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusDetailsItemLabel,
                  { color: colors.textMuted },
                ]}
              >
                {t("voiceOutputRoute", { route: ttsStatusLabel })}
              </Text>
            </View>
            {fallbackTtsStatusLabel ? (
              <View
                style={[
                  styles.statusDetailsItem,
                  {
                    backgroundColor: colors.surfaceElevated,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusDetailsItemLabel,
                    { color: colors.textMuted },
                  ]}
                >
                  {t("fallbackVoiceOutputRoute", {
                    route: fallbackTtsStatusLabel,
                  })}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
});
