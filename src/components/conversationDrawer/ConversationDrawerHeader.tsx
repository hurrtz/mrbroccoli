import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppWordmark } from "../AppWordmark";
import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";

import { styles } from "./styles";
import type { ConversationDrawerPresentation } from "./types";

interface ConversationDrawerHeaderProps {
  onClose: () => void;
  onNewSession: () => void;
  onOpenSettings?: () => void;
  presentation?: ConversationDrawerPresentation;
}

export function ConversationDrawerHeader({
  onClose,
  onNewSession,
  onOpenSettings,
  presentation = "modal",
}: ConversationDrawerHeaderProps) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();
  const isSidebar = presentation === "sidebar";

  return (
    <View
      testID="conversation-drawer-header"
      style={[
        styles.header,
        isSidebar ? styles.sidebarHeader : null,
        {
          borderBottomColor: colors.border,
          paddingTop: isSidebar ? 16 : Math.max(insets.top, 8) + 8,
        },
      ]}
    >
      {isSidebar ? (
        <>
          <View style={styles.sidebarWordmark}>
            <AppWordmark
              color={colors.text}
              name={t("appName")}
              testID="conversation-sidebar-wordmark"
            />
          </View>
          <View style={styles.sidebarHeaderActions}>
            {onOpenSettings ? (
              <TouchableOpacity
                accessibilityLabel={t("settings")}
                accessibilityRole="button"
                onPress={onOpenSettings}
                style={styles.headerIconButton}
                testID="conversation-drawer-settings"
              >
                <PhosphorIcon
                  name="setting"
                  size="control"
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            ) : null}
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
        </>
      ) : (
        <>
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
        </>
      )}
    </View>
  );
}

interface ConversationDrawerSearchProps {
  inline?: boolean;
  searchQuery: string;
  onChangeSearchQuery: (value: string) => void;
  onClearSearch: () => void;
}

export function ConversationDrawerSearch({
  inline = false,
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
        inline ? styles.searchDockInline : null,
        {
          backgroundColor: inline ? colors.surface : colors.background,
          borderTopColor: colors.border,
          // The persistent sidebar is composed inside the app's SafeAreaView;
          // applying the device inset again would double its bottom clearance.
          paddingBottom: inline ? 14 : Math.max(insets.bottom, 26),
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
