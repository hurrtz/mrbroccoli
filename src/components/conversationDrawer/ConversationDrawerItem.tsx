import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import type { ConversationMeta, Provider } from "../../types";
import { ProviderIcon } from "../ProviderIcon";

import { styles } from "./styles";

interface ConversationDrawerItemProps {
  conversation: ConversationMeta;
  rootTitle?: string;
  active: boolean;
  formatDate: (iso: string) => string;
  onDelete: (conversationId: string) => void;
  onOpenActionConversation: (conversationId: string, anchorY: number) => void;
  onOpenRoot?: (conversationId: string) => void;
  onSelectConversation: (conversationId: string) => void;
}

function getProviderMarks(conversation: ConversationMeta) {
  const marks: Provider[] = [];

  for (const provider of conversation.providers) {
    const models = conversation.providerModels?.[provider] ?? [];
    if (models.length === 0) {
      marks.push(provider);
      continue;
    }
    for (const _model of models) {
      marks.push(provider);
    }
  }

  if (marks.length === 0 && conversation.lastProvider) {
    marks.push(conversation.lastProvider);
  }

  return marks;
}

export function ConversationDrawerItem({
  conversation,
  rootTitle,
  active,
  formatDate,
  onDelete,
  onOpenActionConversation,
  onOpenRoot,
  onSelectConversation,
}: ConversationDrawerItemProps) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const menuButtonRef = React.useRef<View>(null);
  const providerMarks = getProviderMarks(conversation);

  const renderRightActions = () => (
    <TouchableOpacity
      testID={`conversation-drawer-delete-${conversation.id}`}
      style={[styles.deleteAction, { backgroundColor: colors.dangerFill }]}
      onPress={() => onDelete(conversation.id)}
      accessibilityRole="button"
      accessibilityLabel={t("delete")}
    >
      <PhosphorIcon name="delete" size="compact" color={colors.onDanger} />
      <Text style={[styles.deleteText, { color: colors.onDanger }]}>
        {t("delete")}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View
        style={[
          styles.itemFrame,
          {
            backgroundColor: active ? colors.surfaceAlt : colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity
          testID={`conversation-drawer-item-${conversation.id}`}
          style={styles.itemPressArea}
          onPress={() => onSelectConversation(conversation.id)}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel={[
            conversation.title,
            conversation.isPrivate ? t("privateConversation") : null,
            rootTitle ? t("branchOfConversation", { title: rootTitle }) : null,
          ]
            .filter(Boolean)
            .join(". ")}
          accessibilityState={{ selected: active }}
        >
          <View style={styles.itemCopy}>
            <View style={styles.itemTitleRow}>
              {conversation.pinned ? (
                <PhosphorIcon
                  name="pushpin"
                  size="inline"
                  color={colors.accent}
                />
              ) : null}
              {conversation.isPrivate ? (
                <PhosphorIcon
                  name="lock"
                  size="inline"
                  color={colors.textSecondary}
                />
              ) : null}
              <Text
                style={[styles.itemTitle, { color: colors.text }]}
                numberOfLines={1}
              >
                {conversation.title}
              </Text>
            </View>
            <View style={styles.itemMetaRow}>
              <Text
                style={[styles.itemMetaText, { color: colors.textMuted }]}
                numberOfLines={1}
              >
                {`${formatDate(conversation.updatedAt)} · ${t("messageCount", {
                  count: conversation.messageCount ?? 0,
                })}${providerMarks.length ? " ·" : ""}`}
              </Text>
              {providerMarks.length > 0 ? (
                <View style={styles.itemProviderMarks}>
                  {providerMarks.map((provider, index) => (
                    <ProviderIcon
                      key={`${conversation.id}-${provider}-${index}`}
                      provider={provider}
                      color={colors.textSecondary}
                      size="inline"
                    />
                  ))}
                </View>
              ) : null}
            </View>
            {rootTitle && conversation.branch && onOpenRoot ? (
              <TouchableOpacity
                testID={`conversation-drawer-root-${conversation.id}`}
                style={styles.rootTagTarget}
                activeOpacity={0.82}
                onPress={() =>
                  onOpenRoot(conversation.branch!.rootConversationId)
                }
                accessibilityRole="button"
                accessibilityLabel={t("goToRootSession", {
                  title: rootTitle,
                })}
              >
                <View
                  style={[
                    styles.rootTag,
                    {
                      backgroundColor: colors.surfaceRaised,
                      borderColor: colors.borderStrong,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.rootTagText,
                      { color: colors.textSecondary },
                    ]}
                    numberOfLines={1}
                  >
                    {rootTitle}
                  </Text>
                  <PhosphorIcon
                    name="right"
                    size="inline"
                    color={colors.textSecondary}
                  />
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
          <TouchableOpacity
            ref={menuButtonRef}
            testID={`conversation-drawer-menu-${conversation.id}`}
            style={styles.itemMenuButton}
            onPress={() => {
              // Open first, then refine: the menu anchors under the control
              // that opened it, and a measurement that never arrives must not
              // swallow the tap.
              onOpenActionConversation(conversation.id, 0);
              menuButtonRef.current?.measureInWindow((_x, y, _width, height) => {
                onOpenActionConversation(conversation.id, y + height + 4);
              });
            }}
            activeOpacity={0.88}
            accessibilityRole="button"
            accessibilityLabel={t("conversationActions")}
          >
            <PhosphorIcon
              name="ellipsis-vertical"
              size="compact"
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
}
