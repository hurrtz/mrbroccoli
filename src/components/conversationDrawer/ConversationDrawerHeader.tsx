import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

import { AntIcon } from "../../design-system/AntIcon";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";

import { styles } from "./styles";

interface ConversationDrawerHeaderProps {
  searchQuery: string;
  onChangeSearchQuery: (value: string) => void;
  onClearSearch: () => void;
  onClose: () => void;
  onNewSession: () => void;
}

export function ConversationDrawerHeader({
  searchQuery,
  onChangeSearchQuery,
  onClearSearch,
  onClose,
  onNewSession,
}: ConversationDrawerHeaderProps) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();

  return (
    <>
      <View
        style={[
          styles.header,
          {
            borderBottomColor: colors.border,
            paddingTop: Math.max(insets.top, 12) + 8,
          },
        ]}
      >
        <View style={styles.headerCopy}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t("conversations")}
          </Text>
        </View>
        <TouchableOpacity
          testID="conversation-drawer-close"
          style={[
            styles.closeButton,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
            },
          ]}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={t("dismiss")}
        >
          <AntIcon name="close" size="control" color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        testID="conversation-drawer-new-session"
        activeOpacity={0.92}
        onPress={onNewSession}
        accessibilityRole="button"
        accessibilityLabel={t("newSession")}
        style={[styles.newSession, { backgroundColor: colors.bubbleUser }]}
      >
        <AntIcon name="plus" size="compact" color={colors.onPrimary} />
        <Text style={[styles.newSessionText, { color: colors.onPrimary }]}>
          {t("newSession")}
        </Text>
      </TouchableOpacity>

      <View
        style={[
          styles.searchShell,
          {
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.border,
          },
        ]}
      >
        <AntIcon
          name="search"
          size="compact"
          color={colors.textMuted}
        />
        <TextInput
          testID="conversation-drawer-search-input"
          value={searchQuery}
          onChangeText={onChangeSearchQuery}
          placeholder={t("searchConversationsPlaceholder")}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.accent}
          style={[styles.searchInput, { color: colors.text }]}
        />
        {searchQuery.trim() ? (
          <TouchableOpacity
            testID="conversation-drawer-clear-search"
            onPress={onClearSearch}
            style={styles.searchClearButton}
            activeOpacity={0.82}
            accessibilityRole="button"
            accessibilityLabel={t("clear")}
          >
            <AntIcon
              name="close"
              size="compact"
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </>
  );
}
