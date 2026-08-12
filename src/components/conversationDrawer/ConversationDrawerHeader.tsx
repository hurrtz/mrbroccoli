import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";

import { styles } from "./styles";

interface ConversationDrawerHeaderProps {
  onClose: () => void;
  onNewSession: () => void;
}

export function ConversationDrawerHeader({
  onClose,
  onNewSession,
}: ConversationDrawerHeaderProps) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.header,
        {
          borderBottomColor: colors.border,
          paddingTop: Math.max(insets.top, 8) + 8,
        },
      ]}
    >
      <TouchableOpacity
        testID="conversation-drawer-close"
        style={styles.headerIconButton}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel={t("dismiss")}
      >
        <PhosphorIcon
          name="close"
          size="control"
          color={colors.textSecondary}
        />
      </TouchableOpacity>
      <View style={styles.headerCopy}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          maxFontSizeMultiplier={1.4}
          accessibilityRole="header"
          style={[styles.title, { color: colors.text }]}
        >
          {t("conversations")}
        </Text>
      </View>
      <TouchableOpacity
        testID="conversation-drawer-new-session"
        activeOpacity={0.88}
        onPress={onNewSession}
        accessibilityRole="button"
        accessibilityLabel={t("newSession")}
        style={[
          styles.newSessionButton,
          {
            backgroundColor: colors.accent,
            shadowColor: colors.glow,
          },
        ]}
      >
        <PhosphorIcon
          name="plus"
          size="control"
          color={colors.onActiveControl}
        />
      </TouchableOpacity>
    </View>
  );
}

interface ConversationDrawerSearchProps {
  searchQuery: string;
  onChangeSearchQuery: (value: string) => void;
  onClearSearch: () => void;
}

export function ConversationDrawerSearch({
  searchQuery,
  onChangeSearchQuery,
  onClearSearch,
}: ConversationDrawerSearchProps) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();

  return (
    <View
      testID="conversation-drawer-search-dock"
      style={[
        styles.searchDock,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          paddingBottom: Math.max(insets.bottom, 16),
        },
      ]}
    >
      <View
        style={[
          styles.searchShell,
          {
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.border,
          },
        ]}
      >
        <TextInput
          testID="conversation-drawer-search-input"
          value={searchQuery}
          onChangeText={onChangeSearchQuery}
          placeholder={t("searchConversationsPlaceholder")}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.accent}
          style={[styles.searchInput, { color: colors.text }]}
          returnKeyType="search"
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
            <PhosphorIcon
              name="close"
              size="compact"
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.searchIcon} pointerEvents="none">
            <PhosphorIcon
              name="search"
              size="compact"
              color={colors.textMuted}
            />
          </View>
        )}
      </View>
    </View>
  );
}
