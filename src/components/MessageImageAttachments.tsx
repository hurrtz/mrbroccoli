import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import type { MessageImageAttachment } from "../types";
import type { Colors } from "../theme/colors";
import { PhosphorIcon } from "../design-system/PhosphorIcon";
import type { TranslateFn } from "../screens/main/shared";

export function MessageImageAttachments({
  attachments,
  onRemove,
  compact = false,
  colors,
  t,
}: {
  attachments: MessageImageAttachment[];
  onRemove?: (attachmentId: string) => void;
  compact?: boolean;
  colors: Colors;
  t: TranslateFn;
}) {
  if (attachments.length === 0) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      accessibilityRole="list"
    >
      {attachments.map((attachment, index) => (
        <View
          key={attachment.id}
          style={styles.item}
        >
          <Image
            accessibilityLabel={t("attachedImageLabel", {
              index: index + 1,
              count: attachments.length,
            })}
            source={{ uri: attachment.uri }}
            style={[
              styles.image,
              compact ? styles.imageCompact : null,
              { borderColor: colors.border },
            ]}
          />
          {onRemove ? (
            <TouchableOpacity
              accessibilityLabel={t("removeAttachedImage", {
                index: index + 1,
              })}
              accessibilityRole="button"
              onPress={() => onRemove(attachment.id)}
              style={styles.removeTarget}
            >
              <View
                style={[
                  styles.removeIcon,
                  { backgroundColor: colors.overlay },
                ]}
                testID={`message-image-remove-well-${attachment.id}`}
              >
                <PhosphorIcon
                  color={colors.surface}
                  name="close"
                  size="compact"
                />
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 8,
    paddingVertical: 4,
  },
  item: {
    position: "relative",
  },
  image: {
    width: 128,
    height: 96,
    borderRadius: 12,
    borderWidth: 1,
  },
  imageCompact: {
    width: 88,
    height: 66,
  },
  removeTarget: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 44,
    height: 44,
    alignItems: "flex-end",
    justifyContent: "flex-start",
  },
  removeIcon: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
