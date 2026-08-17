import React from "react";
import {
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import type { MessageImageAttachment } from "../types";
import { fonts } from "../theme/typography";
import { useTheme } from "../theme/ThemeContext";
import { PhosphorIcon } from "./PhosphorIcon";

const POPOVER_WIDTH = 252;
const THUMBNAIL_SIZE = 64;
const SCREEN_MARGIN = 12;

export interface AttachmentPopoverAnchor {
  height: number;
  width: number;
  x: number;
  y: number;
}

export function AttachmentPopover({
  addLabel,
  anchor,
  attachments,
  emptyLabel,
  imageLabel,
  onAdd,
  onClose,
  onRemove,
  removeLabel,
  visible,
}: {
  addLabel: string;
  anchor: AttachmentPopoverAnchor | null;
  attachments: MessageImageAttachment[];
  emptyLabel: string;
  imageLabel: (index: number, count: number) => string;
  onAdd: () => void;
  onClose: () => void;
  onRemove: (attachmentId: string) => void;
  removeLabel: (index: number, count: number) => string;
  visible: boolean;
}) {
  const { colors } = useTheme();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const [panelHeight, setPanelHeight] = React.useState(
    attachments.length > 0 ? 132 : 106,
  );
  const pendingAddRef = React.useRef(false);
  const fallbackTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const drainPendingAdd = React.useCallback(() => {
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    if (!pendingAddRef.current) {
      return;
    }
    pendingAddRef.current = false;
    onAdd();
  }, [onAdd]);
  const closeThenAdd = React.useCallback(() => {
    pendingAddRef.current = true;
    onClose();
    if (Platform.OS !== "ios") {
      fallbackTimerRef.current = setTimeout(drainPendingAdd, 250);
    }
  }, [drainPendingAdd, onClose]);

  React.useEffect(() => {
    setPanelHeight(attachments.length > 0 ? 132 : 106);
  }, [attachments.length]);

  React.useEffect(
    () => () => {
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
      }
      pendingAddRef.current = false;
    },
    [],
  );

  if (!anchor) {
    return null;
  }

  const left = Math.max(
    SCREEN_MARGIN,
    Math.min(anchor.x, windowWidth - POPOVER_WIDTH - SCREEN_MARGIN),
  );
  const preferredTop = anchor.y - panelHeight - 10;
  const top =
    preferredTop >= SCREEN_MARGIN
      ? preferredTop
      : Math.min(
          windowHeight - panelHeight - SCREEN_MARGIN,
          anchor.y + anchor.height + 10,
        );

  return (
    <Modal
      animationType="fade"
      onDismiss={drainPendingAdd}
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View style={styles.overlay} testID="attachment-popover-overlay">
        <Pressable
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
          testID="attachment-popover-dismiss"
        />
        <View
          accessibilityViewIsModal
          onLayout={(event) =>
            setPanelHeight(Math.round(event.nativeEvent.layout.height))
          }
          style={[
            styles.panel,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.surfaceRaisedBorder,
              left,
              shadowColor: colors.overlay,
              top,
            },
          ]}
          testID="attachment-popover"
        >
          {attachments.length > 0 ? (
            <ScrollView
              contentContainerStyle={styles.attachments}
              horizontal
              showsHorizontalScrollIndicator={false}
              testID="attachment-popover-list"
            >
              {attachments.map((attachment, index) => (
                <View key={attachment.id} style={styles.thumbnailWrap}>
                  <Image
                    accessibilityLabel={imageLabel(
                      index + 1,
                      attachments.length,
                    )}
                    source={{ uri: attachment.uri }}
                    style={[styles.thumbnail, { borderColor: colors.border }]}
                  />
                  <Pressable
                    accessibilityLabel={removeLabel(
                      index + 1,
                      attachments.length,
                    )}
                    accessibilityRole="button"
                    hitSlop={2}
                    onPress={() => onRemove(attachment.id)}
                    style={styles.removeTarget}
                    testID={`attachment-popover-remove-${attachment.id}`}
                  >
                    <View
                      style={[
                        styles.removeDisc,
                        { backgroundColor: colors.overlay },
                      ]}
                    >
                      <PhosphorIcon
                        color={colors.surface}
                        name="close"
                        size="inline"
                        visualSize={11}
                      />
                    </View>
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text
              style={[styles.empty, { color: colors.textSecondary }]}
              testID="attachment-popover-empty"
            >
              {emptyLabel}
            </Text>
          )}
          <View style={[styles.band, { backgroundColor: colors.border }]} />
          <Pressable
            accessibilityLabel={addLabel}
            accessibilityRole="button"
            onPress={closeThenAdd}
            style={({ pressed }) => [
              styles.add,
              pressed ? { backgroundColor: colors.accentSoft } : null,
            ]}
            testID="attachment-popover-add"
          >
            <PhosphorIcon color={colors.accent} name="plus" size="compact" />
            <Text style={[styles.addLabel, { color: colors.accent }]}>
              {addLabel}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  add: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    minHeight: 44,
    paddingHorizontal: 14,
  },
  addLabel: {
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 20,
  },
  attachments: {
    gap: 8,
    padding: 12,
  },
  band: {
    height: 6,
    opacity: 0.55,
  },
  empty: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 19,
    paddingBottom: 12,
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  overlay: {
    flex: 1,
  },
  panel: {
    borderRadius: 15,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    position: "absolute",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 34,
    width: POPOVER_WIDTH,
    elevation: 12,
  },
  removeDisc: {
    alignItems: "center",
    borderRadius: 11,
    height: 22,
    justifyContent: "center",
    width: 22,
  },
  removeTarget: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    position: "absolute",
    right: -10,
    top: -10,
    width: 44,
  },
  thumbnail: {
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    height: THUMBNAIL_SIZE,
    width: THUMBNAIL_SIZE,
  },
  thumbnailWrap: {
    height: THUMBNAIL_SIZE,
    position: "relative",
    width: THUMBNAIL_SIZE,
  },
});
