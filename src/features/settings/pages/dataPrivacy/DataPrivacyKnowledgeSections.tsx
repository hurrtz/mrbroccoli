import React from "react";
import { Text } from "react-native";

import type { ConversationArchiveController } from "../../../../hooks/useConversationArchive";
import { useLocalization } from "../../../../i18n";
import { useTheme } from "../../../../theme/ThemeContext";
import type { Settings } from "../../../../types";
import { styles } from "../../styles";
import { SettingsGroup } from "../../settings-primitives/SettingsGroup";
import { SettingsRow } from "../../settings-primitives/SettingsRow";
import { SettingsSheet } from "../../settings-primitives/SettingsSheet";
import { Switch } from "../../../../design-system/Switch";

function getArchiveErrorKey(error: ConversationArchiveController["error"]) {
  if (error === "access-lost") {
    return "conversationArchiveAccessLost" as const;
  }
  if (error === "unavailable") {
    return "conversationArchiveUnavailable" as const;
  }
  return "conversationArchiveSyncFailed" as const;
}

export function ConversationKnowledgeGroup({
  isPremium,
  onOpenPremium,
  onUpdate,
  settings,
}: {
  isPremium: boolean;
  onOpenPremium: () => void;
  onUpdate: (partial: Partial<Settings>) => void;
  settings: Settings;
}) {
  const { t } = useLocalization();

  return (
    <SettingsGroup
      testID="conversation-knowledge-group"
      title={t("pastConversationKnowledge")}
      footer={t("pastConversationKnowledgeDisclosure")}
    >
      <SettingsRow
        icon="brain"
        label={t("usePastConversationKnowledge")}
        last
        value={isPremium ? undefined : t("premium")}
        onPress={isPremium ? undefined : onOpenPremium}
        control={
          isPremium ? (
            <Switch
              testID="past-conversation-knowledge-switch"
              label={t("usePastConversationKnowledge")}
              value={settings.pastConversationKnowledgeEnabled}
              onChange={(pastConversationKnowledgeEnabled) =>
                onUpdate({ pastConversationKnowledgeEnabled })
              }
            />
          ) : undefined
        }
      />
    </SettingsGroup>
  );
}

export function ArchiveSettingsSheet({
  archivedConversationCount,
  conversationArchive,
  isPremium,
  onClose,
  onOpenArchivedConversations,
  onOpenPremium,
  visible,
}: {
  archivedConversationCount: number;
  conversationArchive: ConversationArchiveController;
  isPremium: boolean;
  onClose: () => void;
  onOpenArchivedConversations: () => void;
  onOpenPremium: () => void;
  visible: boolean;
}) {
  const { t } = useLocalization();
  const { colors } = useTheme();
  const pendingActionRef = React.useRef<"archived" | "premium" | null>(null);
  const archiveBusy =
    !conversationArchive.loaded || conversationArchive.syncing;
  const archiveError = conversationArchive.error
    ? t(getArchiveErrorKey(conversationArchive.error))
    : null;
  const handleDismiss = React.useCallback(() => {
    const pendingAction = pendingActionRef.current;
    pendingActionRef.current = null;
    if (pendingAction === "archived") {
      onOpenArchivedConversations();
    } else if (pendingAction === "premium") {
      onOpenPremium();
    }
  }, [onOpenArchivedConversations, onOpenPremium]);

  React.useEffect(() => {
    if (visible || !pendingActionRef.current) {
      return;
    }
    const timer = setTimeout(handleDismiss, 350);
    return () => clearTimeout(timer);
  }, [handleDismiss, visible]);

  return (
    <SettingsSheet
      testID="archive-settings-sheet"
      onClose={onClose}
      onDismiss={handleDismiss}
      title={t("archiveSession")}
      visible={visible}
    >
      <SettingsGroup title={t("archivedConversations")}>
        <SettingsRow
          testID="open-archived-conversations"
          icon="inbox"
          label={t("archivedConversations")}
          last
          value={String(archivedConversationCount)}
          onPress={() => {
            pendingActionRef.current = "archived";
            onClose();
          }}
        />
      </SettingsGroup>

      <SettingsGroup
        testID="conversation-archive-group"
        title={t("conversationArchive")}
        footer={t("conversationArchiveWarning")}
      >
        {conversationArchive.configured ? (
          <>
            <SettingsRow
              icon="folder-open"
              label={t("conversationArchiveFolder", {
                folder: conversationArchive.directoryName ?? "",
              })}
              supporting={
                conversationArchive.lastSyncedAt
                  ? t("conversationArchiveLastSynced", {
                      date: new Date(
                        conversationArchive.lastSyncedAt,
                      ).toLocaleString(),
                    })
                  : t("conversationArchiveNeverSynced")
              }
              control={null}
            />
            {isPremium ? (
              <>
                <SettingsRow
                  testID="sync-conversation-archive"
                  disabled={archiveBusy}
                  icon="reload"
                  label={
                    conversationArchive.syncing
                      ? t("conversationArchiveSyncing")
                      : t("conversationArchiveSyncNow")
                  }
                  onPress={() => void conversationArchive.syncNow()}
                />
                <SettingsRow
                  testID="change-conversation-archive-folder"
                  disabled={archiveBusy}
                  icon="folder-open"
                  label={t("conversationArchiveChangeFolder")}
                  onPress={() => void conversationArchive.chooseDirectory()}
                />
              </>
            ) : null}
            <SettingsRow
              testID="disconnect-conversation-archive"
              danger
              disabled={archiveBusy}
              icon="close"
              label={t("conversationArchiveDisconnect")}
              last
              onPress={() => void conversationArchive.disconnect()}
            />
          </>
        ) : isPremium ? (
          <SettingsRow
            testID="choose-conversation-archive-folder"
            disabled={archiveBusy}
            icon="folder-open"
            label={t("conversationArchiveChooseFolder")}
            last
            onPress={() => void conversationArchive.chooseDirectory()}
          />
        ) : (
          <SettingsRow
            icon="lock"
            label={t("conversationArchive")}
            last
            testID="unlock-conversation-archive"
            value={t("premium")}
            onPress={() => {
              pendingActionRef.current = "premium";
              onClose();
            }}
          />
        )}
      </SettingsGroup>
      {archiveError ? (
        <Text
          accessibilityRole="alert"
          style={[styles.helperText, { color: colors.danger }]}
        >
          {archiveError}
        </Text>
      ) : null}
    </SettingsSheet>
  );
}
