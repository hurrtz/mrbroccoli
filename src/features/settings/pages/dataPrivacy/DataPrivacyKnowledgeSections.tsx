import React from "react";
import { Text, View } from "react-native";

import { Button } from "../../../../design-system/NativeControls";
import type { ConversationArchiveController } from "../../../../hooks/useConversationArchive";
import { useLocalization } from "../../../../i18n";
import { useTheme } from "../../../../theme/ThemeContext";
import type { Settings } from "../../../../types";
import {
  AntButtonLabel,
  AntSectionIntro,
  AntSettingsCard,
  AntSwitchRow,
} from "../../AntSettingsPrimitives";
import { styles } from "../../styles";

function PremiumGate({ onOpenPremium }: { onOpenPremium: () => void }) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  return (
    <Button type="primary" onPress={onOpenPremium}>
      <AntButtonLabel
        color={colors.onActiveControl}
        icon="lock"
        label={t("upgradeToPremium")}
      />
    </Button>
  );
}

export function PastConversationKnowledgeSection({
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
  const { colors } = useTheme();
  const { t } = useLocalization();

  return (
    <View style={styles.sectionGroup}>
      <AntSectionIntro
        title={t("pastConversationKnowledge")}
        description={t("pastConversationKnowledgeDescription")}
      />
      <AntSettingsCard>
        {isPremium ? (
          <>
            <AntSwitchRow
              label={t("usePastConversationKnowledge")}
              description={t("usePastConversationKnowledgeDescription")}
              value={settings.pastConversationKnowledgeEnabled}
              onChange={(pastConversationKnowledgeEnabled) =>
                onUpdate({ pastConversationKnowledgeEnabled })
              }
            />
            <Text style={[styles.helperText, { color: colors.textMuted }]}>
              {t("pastConversationKnowledgeDisclosure")}
            </Text>
          </>
        ) : (
          <PremiumGate onOpenPremium={onOpenPremium} />
        )}
      </AntSettingsCard>
    </View>
  );
}

export function ConversationArchiveSection({
  conversationArchive,
  isPremium,
  onOpenPremium,
}: {
  conversationArchive: ConversationArchiveController;
  isPremium: boolean;
  onOpenPremium: () => void;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const archiveBusy =
    !conversationArchive.loaded || conversationArchive.syncing;

  return (
    <View style={styles.sectionGroup}>
      <AntSectionIntro
        title={t("conversationArchive")}
        description={t("conversationArchiveDescription")}
      />
      <AntSettingsCard>
        {isPremium ? (
          <>
            <Text style={[styles.warningText, { color: colors.danger }]}>
              {t("conversationArchiveWarning")}
            </Text>
            {conversationArchive.configured ? (
              <View style={styles.dataBackupActions}>
                <Text
                  style={[styles.helperText, { color: colors.textSecondary }]}
                >
                  {t("conversationArchiveFolder", {
                    folder: conversationArchive.directoryName ?? "",
                  })}
                </Text>
                <Text style={[styles.helperText, { color: colors.textMuted }]}>
                  {conversationArchive.lastSyncedAt
                    ? t("conversationArchiveLastSynced", {
                        date: new Date(
                          conversationArchive.lastSyncedAt,
                        ).toLocaleString(),
                      })
                    : t("conversationArchiveNeverSynced")}
                </Text>
                <Button
                  testID="sync-conversation-archive"
                  disabled={archiveBusy}
                  loading={conversationArchive.syncing}
                  onPress={() => void conversationArchive.syncNow()}
                  style={styles.dataBackupButton}
                >
                  <AntButtonLabel
                    color={colors.text}
                    icon="reload"
                    label={t("conversationArchiveSyncNow")}
                  />
                </Button>
                <Button
                  testID="change-conversation-archive-folder"
                  disabled={archiveBusy}
                  onPress={() => void conversationArchive.chooseDirectory()}
                  style={styles.dataBackupButton}
                >
                  <AntButtonLabel
                    color={colors.text}
                    icon="folder-open"
                    label={t("conversationArchiveChangeFolder")}
                  />
                </Button>
                <Button
                  testID="disconnect-conversation-archive"
                  disabled={archiveBusy}
                  onPress={() => void conversationArchive.disconnect()}
                  style={styles.dataBackupButton}
                >
                  <AntButtonLabel
                    color={colors.text}
                    icon="close"
                    label={t("conversationArchiveDisconnect")}
                  />
                </Button>
              </View>
            ) : (
              <Button
                testID="choose-conversation-archive-folder"
                disabled={archiveBusy}
                loading={conversationArchive.syncing}
                onPress={() => void conversationArchive.chooseDirectory()}
                style={styles.dataBackupButton}
              >
                <AntButtonLabel
                  color={colors.text}
                  icon="folder-open"
                  label={t("conversationArchiveChooseFolder")}
                />
              </Button>
            )}
            {conversationArchive.syncing ? (
              <Text
                accessibilityLiveRegion="polite"
                style={[styles.helperText, { color: colors.textMuted }]}
              >
                {t("conversationArchiveSyncing")}
              </Text>
            ) : null}
            {conversationArchive.error ? (
              <Text
                accessibilityRole="alert"
                style={[styles.helperText, { color: colors.danger }]}
              >
                {t(
                  conversationArchive.error === "access-lost"
                    ? "conversationArchiveAccessLost"
                    : conversationArchive.error === "unavailable"
                      ? "conversationArchiveUnavailable"
                      : "conversationArchiveSyncFailed",
                )}
              </Text>
            ) : null}
          </>
        ) : (
          <View style={styles.dataBackupActions}>
            <PremiumGate onOpenPremium={onOpenPremium} />
            {conversationArchive.configured ? (
              <Button
                testID="disconnect-conversation-archive"
                disabled={archiveBusy}
                onPress={() => void conversationArchive.disconnect()}
                style={styles.dataBackupButton}
              >
                <AntButtonLabel
                  color={colors.text}
                  icon="close"
                  label={t("conversationArchiveDisconnect")}
                />
              </Button>
            ) : null}
          </View>
        )}
      </AntSettingsCard>
    </View>
  );
}
