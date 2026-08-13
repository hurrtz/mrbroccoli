import React from "react";
import { Text, TextInput, View } from "react-native";

import { Button, Modal } from "../../../design-system/NativeControls";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

import { useLocalization } from "../../../i18n";
import type { ConversationArchiveController } from "../../../hooks/useConversationArchive";
import {
  LOCAL_MODEL_CATALOG,
  type LocalModelDefinition,
} from "../../../constants/localModels";
import {
  APP_DATA_BACKUP_MAX_BYTES,
  APP_DATA_BACKUP_MIN_PASSPHRASE_LENGTH,
  AppDataBackupError,
  decryptAppDataBackup,
  encryptAppDataBackup,
  isBackupPassphraseObviouslyWeak,
  isEncryptedAppDataBackup,
  parseAppDataBackup,
  serializeAppDataBackup,
  type AppDataBackup,
  type AppDataBackupCreation,
  type AppDataBackupRestoreResult,
} from "../../../services/appDataBackup";
import {
  cleanupExpiredBackupShareFiles,
  writeBackupShareFile,
} from "../../../services/appDataBackupFiles";
import { recordDebugLogEvent } from "../../../services/debugLogCapture";
import { useTheme } from "../../../theme/ThemeContext";
import { fonts } from "../../../theme/typography";
import { AntButtonLabel } from "../AntSettingsPrimitives";
import { styles } from "../styles";
import type { Settings } from "../../../types";
import {
  ArchiveSettingsSheet,
  ConversationKnowledgeGroup,
} from "./dataPrivacy/DataPrivacyKnowledgeSections";
import type { LocalModelSettingsController } from "../../settings-core/useLocalModelSettings";
import { formatBytes } from "../../../utils/formatBytes";
import { SettingsGroup } from "../settings-primitives/SettingsGroup";
import { SettingsPillAction } from "../settings-primitives/SettingsPillAction";
import { SettingsRow } from "../settings-primitives/SettingsRow";

type BusyState =
  | "export-encrypted"
  | "export-readable"
  | "import"
  | "restore"
  | null;

function getModelCapabilityLabel(
  model: LocalModelDefinition,
  t: ReturnType<typeof useLocalization>["t"],
) {
  switch (model.capability) {
    case "llm":
      return t("settingsThinking");
    case "stt":
      return t("settingsListening");
    case "tts":
      return t("settingsSpeaking");
  }
}

function ModelStorageGroup({
  localModels,
}: {
  localModels: LocalModelSettingsController;
}) {
  const { t } = useLocalization();
  const storedModels = LOCAL_MODEL_CATALOG.filter(
    (model) =>
      localModels.installs[model.id]?.verified === true ||
      (localModels.busy?.modelId === model.id &&
        localModels.busy.action === "download"),
  );
  const totalBytes = storedModels.reduce((total, model) => {
    if (localModels.installs[model.id]?.verified) {
      return total + model.installedBytes;
    }
    const progress =
      model.id === "kokoro-multilingual"
        ? localModels.kokoroModel.progress
        : (localModels.progress[model.id]?.progress ?? 0);
    return total + Math.round(model.downloadBytes * progress);
  }, 0);

  return (
    <SettingsGroup
      testID="model-storage-group"
      title={t("modelStorageTitle", { size: formatBytes(totalBytes) })}
      footer={t("modelStorageFooter")}
    >
      {storedModels.length === 0 ? (
        <SettingsRow
          icon="cpu"
          label={t("noDownloadedModels")}
          last
          control={null}
        />
      ) : (
        storedModels.map((model, index) => {
          const downloading =
            localModels.busy?.modelId === model.id &&
            localModels.busy.action === "download";
          const removing =
            localModels.busy?.modelId === model.id &&
            localModels.busy.action === "remove";
          const fraction =
            model.id === "kokoro-multilingual"
              ? localModels.kokoroModel.progress
              : (localModels.progress[model.id]?.progress ?? 0);
          const size = formatBytes(
            localModels.installs[model.id]?.verified
              ? model.installedBytes
              : model.downloadBytes,
          );
          const supporting = [
            localModels.errors?.[model.id]?.message,
            getModelCapabilityLabel(model, t),
            size,
            downloading ? `${Math.round(fraction * 100)}%` : null,
          ]
            .filter(Boolean)
            .join(" · ");

          return (
            <SettingsRow
              key={model.id}
              testID={`model-storage-${model.id}`}
              label={model.name}
              supporting={supporting}
              supportingTone={
                localModels.errors?.[model.id] ? "danger" : "default"
              }
              last={index === storedModels.length - 1}
              control={
                <SettingsPillAction
                  danger
                  disabled={removing}
                  label={t(downloading ? "cancel" : "remove")}
                  onPress={
                    downloading
                      ? localModels.cancelDownload
                      : () => void localModels.removeModel(model)
                  }
                  testID={`model-storage-action-${model.id}`}
                />
              }
            />
          );
        })
      )}
    </SettingsGroup>
  );
}

function getBackupFileName(encrypted: boolean) {
  const timestamp = new Date()
    .toISOString()
    .replace(/\.\d{3}Z$/, "Z")
    .replace(/:/g, "-");
  return `mr-broccoli-backup-${timestamp}.mrbroccoli.${
    encrypted ? "encrypted" : "json"
  }`;
}

export function DataPrivacySettingsPage({
  archivedConversationCount,
  conversationArchive,
  isPremium,
  localModels,
  onCreateAppDataBackup,
  onOpenArchivedConversations,
  onOpenPremium,
  onRestoreAppDataBackup,
  settings,
  onUpdate,
}: {
  archivedConversationCount: number;
  conversationArchive: ConversationArchiveController;
  isPremium: boolean;
  localModels: LocalModelSettingsController;
  onCreateAppDataBackup: () => Promise<AppDataBackupCreation>;
  onRestoreAppDataBackup: (
    backup: AppDataBackup,
  ) => Promise<AppDataBackupRestoreResult>;
  onOpenArchivedConversations: () => void;
  onOpenPremium: () => void;
  settings: Settings;
  onUpdate: (partial: Partial<Settings>) => void;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const [busy, setBusy] = React.useState<BusyState>(null);
  const [encryptedDocument, setEncryptedDocument] = React.useState<
    string | null
  >(null);
  const [exportPassphraseVisible, setExportPassphraseVisible] =
    React.useState(false);
  const [importPassphraseVisible, setImportPassphraseVisible] =
    React.useState(false);
  const [passphrase, setPassphrase] = React.useState("");
  const [passphraseConfirmation, setPassphraseConfirmation] =
    React.useState("");
  const [passphraseError, setPassphraseError] = React.useState<string | null>(
    null,
  );
  const [pendingBackup, setPendingBackup] =
    React.useState<AppDataBackup | null>(null);
  const [restoreResult, setRestoreResult] =
    React.useState<AppDataBackupRestoreResult | null>(null);
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);
  const [archiveSheetVisible, setArchiveSheetVisible] = React.useState(false);
  const busyRef = React.useRef<BusyState>(null);

  const beginOperation = React.useCallback(
    (operation: Exclude<BusyState, null>) => {
      if (busyRef.current !== null) {
        return false;
      }
      busyRef.current = operation;
      setBusy(operation);
      return true;
    },
    [],
  );

  const endOperation = React.useCallback(() => {
    busyRef.current = null;
    setBusy(null);
  }, []);

  React.useEffect(() => {
    void cleanupExpiredBackupShareFiles();
  }, []);

  React.useEffect(() => {
    const dialog = exportPassphraseVisible
      ? "backup-export-passphrase"
      : importPassphraseVisible
        ? "backup-import-passphrase"
        : pendingBackup
          ? "backup-restore-preview"
          : null;
    if (dialog) {
      recordDebugLogEvent({
        event: "settings-dialog-presented",
        payload: { dialog },
      });
    }
  }, [exportPassphraseVisible, importPassphraseVisible, pendingBackup]);

  const resetPassphrase = React.useCallback(() => {
    setPassphrase("");
    setPassphraseConfirmation("");
    setPassphraseError(null);
  }, []);

  const getErrorMessage = React.useCallback(
    (
      error: unknown,
      fallbackKey: "backupExportFailed" | "backupImportFailed",
    ) => {
      if (error instanceof AppDataBackupError) {
        switch (error.code) {
          case "decrypt-failed":
          case "passphrase-required":
            return t("backupDecryptFailed");
          case "passphrase-too-weak":
            return t("backupPassphraseWeak");
          case "too-large":
            return t("backupTooLarge");
          case "unsupported":
            return t("backupUnsupported");
          case "invalid":
            return t("backupInvalid");
        }
      }
      if (error instanceof Error && error.message === "share-unavailable") {
        return t("backupShareUnavailable");
      }
      return t(fallbackKey);
    },
    [t],
  );

  const shareBackup = React.useCallback(
    async (content: string, encrypted: boolean) => {
      if (!(await Sharing.isAvailableAsync())) {
        throw new Error("share-unavailable");
      }

      const file = await writeBackupShareFile(
        content,
        getBackupFileName(encrypted),
      );
      await Sharing.shareAsync(file.path, {
        dialogTitle: t("dataBackup"),
        mimeType: encrypted ? "application/octet-stream" : "application/json",
        UTI: encrypted ? "public.data" : "public.json",
      });
      return file;
    },
    [t],
  );

  const exportReadableBackup = React.useCallback(async () => {
    if (!beginOperation("export-readable")) {
      return;
    }
    const startedAtMs = Date.now();
    recordDebugLogEvent({
      event: "backup-export-started",
      payload: { encrypted: false },
    });
    setRestoreResult(null);
    setStatusMessage(null);
    try {
      const { backup, skippedConversationCount } =
        await onCreateAppDataBackup();
      const sharedFile = await shareBackup(
        serializeAppDataBackup(backup),
        false,
      );
      recordDebugLogEvent({
        event: "backup-export-completed",
        payload: {
          conversationCount: backup.data.conversations.length,
          durationMs: Date.now() - startedAtMs,
          encrypted: false,
          sharedFileSizeBytes: sharedFile.sizeBytes,
          skippedConversationCount,
        },
      });
      if (skippedConversationCount > 0) {
        setStatusMessage(
          t("backupExportSkipped", { count: skippedConversationCount }),
        );
      }
      setExportPassphraseVisible(false);
      resetPassphrase();
    } catch (error) {
      recordDebugLogEvent({
        event: "backup-export-failed",
        level: "warn",
        payload: {
          durationMs: Date.now() - startedAtMs,
          encrypted: false,
          error,
        },
      });
      setStatusMessage(getErrorMessage(error, "backupExportFailed"));
    } finally {
      endOperation();
    }
  }, [
    beginOperation,
    endOperation,
    getErrorMessage,
    onCreateAppDataBackup,
    resetPassphrase,
    shareBackup,
    t,
  ]);

  const exportEncryptedBackup = React.useCallback(async () => {
    if (passphrase.length < APP_DATA_BACKUP_MIN_PASSPHRASE_LENGTH) {
      setPassphraseError(
        t("backupPassphraseMinimum", {
          count: APP_DATA_BACKUP_MIN_PASSPHRASE_LENGTH,
        }),
      );
      return;
    }
    if (passphrase !== passphraseConfirmation) {
      setPassphraseError(t("backupPassphrasesDoNotMatch"));
      return;
    }
    if (isBackupPassphraseObviouslyWeak(passphrase)) {
      setPassphraseError(t("backupPassphraseWeak"));
      return;
    }
    if (!beginOperation("export-encrypted")) {
      return;
    }

    const startedAtMs = Date.now();
    recordDebugLogEvent({
      event: "backup-export-started",
      payload: { encrypted: true },
    });
    setPassphraseError(null);
    setStatusMessage(null);
    try {
      const { backup, skippedConversationCount } =
        await onCreateAppDataBackup();
      const encrypted = await encryptAppDataBackup(backup, passphrase);
      const sharedFile = await shareBackup(encrypted, true);
      recordDebugLogEvent({
        event: "backup-export-completed",
        payload: {
          conversationCount: backup.data.conversations.length,
          durationMs: Date.now() - startedAtMs,
          encrypted: true,
          sharedFileSizeBytes: sharedFile.sizeBytes,
          skippedConversationCount,
        },
      });
      if (skippedConversationCount > 0) {
        setStatusMessage(
          t("backupExportSkipped", { count: skippedConversationCount }),
        );
      }
      setExportPassphraseVisible(false);
      resetPassphrase();
    } catch (error) {
      recordDebugLogEvent({
        event: "backup-export-failed",
        level: "warn",
        payload: {
          durationMs: Date.now() - startedAtMs,
          encrypted: true,
          error,
        },
      });
      setPassphraseError(getErrorMessage(error, "backupExportFailed"));
    } finally {
      endOperation();
    }
  }, [
    beginOperation,
    endOperation,
    getErrorMessage,
    onCreateAppDataBackup,
    passphrase,
    passphraseConfirmation,
    resetPassphrase,
    shareBackup,
    t,
  ]);

  const importEncryptedBackup = React.useCallback(async () => {
    if (!encryptedDocument || !passphrase) {
      setPassphraseError(t("backupDecryptFailed"));
      return;
    }
    if (!beginOperation("import")) {
      return;
    }

    setPassphraseError(null);
    try {
      const backup = await decryptAppDataBackup(encryptedDocument, passphrase);
      setPendingBackup(backup);
      setEncryptedDocument(null);
      setImportPassphraseVisible(false);
      resetPassphrase();
    } catch (error) {
      setPassphraseError(getErrorMessage(error, "backupImportFailed"));
    } finally {
      endOperation();
    }
  }, [
    beginOperation,
    encryptedDocument,
    endOperation,
    getErrorMessage,
    passphrase,
    resetPassphrase,
    t,
  ]);

  const chooseBackup = React.useCallback(async () => {
    if (!beginOperation("import")) {
      return;
    }
    const startedAtMs = Date.now();
    recordDebugLogEvent({ event: "backup-import-picker-requested" });
    setRestoreResult(null);
    setStatusMessage(null);
    let pickedUri: string | null = null;
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: false,
        type: "*/*",
      });
      if (result.canceled) {
        recordDebugLogEvent({ event: "backup-import-picker-cancelled" });
        return;
      }

      const asset = result.assets[0];
      pickedUri = asset.uri;
      if (
        typeof asset.size === "number" &&
        asset.size > APP_DATA_BACKUP_MAX_BYTES
      ) {
        throw new AppDataBackupError("too-large");
      }

      const content = await FileSystem.readAsStringAsync(asset.uri);
      if (isEncryptedAppDataBackup(content)) {
        setEncryptedDocument(content);
        resetPassphrase();
        setImportPassphraseVisible(true);
      } else {
        setPendingBackup(parseAppDataBackup(content));
      }
      recordDebugLogEvent({
        event: "backup-import-parsed",
        payload: {
          durationMs: Date.now() - startedAtMs,
          encrypted: isEncryptedAppDataBackup(content),
          sizeBytes: asset.size ?? null,
        },
      });
    } catch (error) {
      recordDebugLogEvent({
        event: "backup-import-failed",
        level: "warn",
        payload: { durationMs: Date.now() - startedAtMs, error },
      });
      setStatusMessage(getErrorMessage(error, "backupImportFailed"));
    } finally {
      if (pickedUri) {
        await FileSystem.deleteAsync(pickedUri, { idempotent: true }).catch(
          () => undefined,
        );
      }
      endOperation();
    }
  }, [beginOperation, endOperation, getErrorMessage, resetPassphrase]);

  const restoreBackup = React.useCallback(async () => {
    if (!pendingBackup) {
      return;
    }
    if (!beginOperation("restore")) {
      return;
    }

    const startedAtMs = Date.now();
    recordDebugLogEvent({
      event: "backup-restore-started",
      payload: { conversationCount: pendingBackup.data.conversations.length },
    });
    setStatusMessage(null);
    try {
      const result = await onRestoreAppDataBackup(pendingBackup);
      setRestoreResult(result);
      setPendingBackup(null);
      recordDebugLogEvent({
        event: "backup-restore-completed",
        payload: { ...result, durationMs: Date.now() - startedAtMs },
      });
    } catch (error) {
      recordDebugLogEvent({
        event: "backup-restore-failed",
        level: "warn",
        payload: { durationMs: Date.now() - startedAtMs, error },
      });
      setStatusMessage(getErrorMessage(error, "backupImportFailed"));
    } finally {
      endOperation();
    }
  }, [
    beginOperation,
    endOperation,
    getErrorMessage,
    onRestoreAppDataBackup,
    pendingBackup,
  ]);

  return (
    <View testID="data-privacy-settings-page" style={styles.sectionPageStack}>
      <ConversationKnowledgeGroup
        isPremium={isPremium}
        onOpenPremium={onOpenPremium}
        onUpdate={onUpdate}
        settings={settings}
      />

      <SettingsGroup title={t("archiveSession")}>
        <SettingsRow
          testID="archived-conversations-row"
          icon="inbox"
          label={t("archivedConversations")}
          last
          value={String(archivedConversationCount)}
          onPress={() => setArchiveSheetVisible(true)}
        />
      </SettingsGroup>

      <SettingsGroup
        testID="backup-settings-group"
        title={t("dataBackup")}
        footer={`${t("encryptedBackupHint")} ${t("dataBackupKeysExcluded")}`}
      >
        <SettingsRow
          testID="export-encrypted-backup"
          disabled={busy !== null}
          icon="export"
          label={t("exportEncryptedBackup")}
          onPress={() => {
            resetPassphrase();
            setExportPassphraseVisible(true);
          }}
        />
        <SettingsRow
          testID="import-app-data-backup"
          disabled={busy !== null}
          icon="download"
          label={t("importBackup")}
          last
          onPress={() => void chooseBackup()}
        />
      </SettingsGroup>

      {restoreResult ? (
        <Text
          testID="backup-restore-result"
          accessibilityLiveRegion="polite"
          style={[styles.helperText, { color: colors.success }]}
        >
          {t("backupRestoreComplete", {
            restored: restoreResult.conversationsRestored,
            copied: restoreResult.conversationsCopied,
            skipped: restoreResult.conversationsSkipped,
          })}
        </Text>
      ) : null}
      {statusMessage ? (
        <Text
          accessibilityRole="alert"
          style={[styles.helperText, { color: colors.danger }]}
        >
          {statusMessage}
        </Text>
      ) : null}

      <ModelStorageGroup localModels={localModels} />

      <ArchiveSettingsSheet
        archivedConversationCount={archivedConversationCount}
        conversationArchive={conversationArchive}
        isPremium={isPremium}
        onClose={() => setArchiveSheetVisible(false)}
        onOpenArchivedConversations={onOpenArchivedConversations}
        onOpenPremium={onOpenPremium}
        visible={archiveSheetVisible}
      />

      <Modal
        visible={exportPassphraseVisible}
        transparent
        maskClosable={false}
        title={t("backupPassphraseTitle")}
        onClose={() => {
          setExportPassphraseVisible(false);
          resetPassphrase();
        }}
        footer={[
          {
            disabled: busy !== null,
            text: t("cancel"),
            onPress: () => {
              setExportPassphraseVisible(false);
              resetPassphrase();
            },
          },
          {
            disabled: busy !== null,
            loading: busy === "export-encrypted",
            text: t("exportEncryptedBackup"),
            onPress: () => void exportEncryptedBackup(),
          },
        ]}
      >
        <View style={styles.dataBackupModalContent}>
          <Text style={[styles.helperText, { color: colors.textSecondary }]}>
            {t("backupPassphraseMinimum", {
              count: APP_DATA_BACKUP_MIN_PASSPHRASE_LENGTH,
            })}
          </Text>
          <TextInput
            testID="backup-passphrase"
            accessibilityLabel={t("backupPassphrase")}
            autoCapitalize="none"
            autoCorrect={false}
            editable={busy === null}
            onChangeText={setPassphrase}
            placeholder={t("backupPassphrase")}
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            style={[
              styles.dataBackupTextInput,
              {
                borderColor: colors.borderStrong,
                color: colors.text,
              },
            ]}
            value={passphrase}
          />
          <TextInput
            testID="backup-passphrase-confirmation"
            accessibilityLabel={t("backupPassphraseConfirm")}
            autoCapitalize="none"
            autoCorrect={false}
            editable={busy === null}
            onChangeText={setPassphraseConfirmation}
            placeholder={t("backupPassphraseConfirm")}
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            style={[
              styles.dataBackupTextInput,
              {
                borderColor: colors.borderStrong,
                color: colors.text,
              },
            ]}
            value={passphraseConfirmation}
          />
          {passphraseError ? (
            <Text
              accessibilityRole="alert"
              style={[styles.helperText, { color: colors.danger }]}
            >
              {passphraseError}
            </Text>
          ) : null}
          <Text style={[styles.warningText, { color: colors.danger }]}>
            {t("readableBackupWarning")}
          </Text>
          <Button
            testID="export-readable-backup"
            disabled={busy !== null}
            loading={busy === "export-readable"}
            onPress={() => void exportReadableBackup()}
            style={styles.dataBackupButton}
          >
            <AntButtonLabel
              color={colors.text}
              icon="export"
              label={t("exportReadableBackup")}
            />
          </Button>
        </View>
      </Modal>

      <Modal
        visible={importPassphraseVisible}
        transparent
        maskClosable={false}
        title={t("encryptedBackupPassphraseTitle")}
        onClose={() => {
          setEncryptedDocument(null);
          setImportPassphraseVisible(false);
          resetPassphrase();
        }}
        footer={[
          {
            disabled: busy !== null,
            text: t("cancel"),
            onPress: () => {
              setEncryptedDocument(null);
              setImportPassphraseVisible(false);
              resetPassphrase();
            },
          },
          {
            disabled: busy !== null,
            loading: busy === "import",
            text: t("continue"),
            onPress: () => void importEncryptedBackup(),
          },
        ]}
      >
        <View style={styles.dataBackupModalContent}>
          <TextInput
            testID="import-backup-passphrase"
            accessibilityLabel={t("backupPassphrase")}
            autoCapitalize="none"
            autoCorrect={false}
            editable={busy === null}
            onChangeText={setPassphrase}
            placeholder={t("backupPassphrase")}
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            style={[
              styles.dataBackupTextInput,
              {
                borderColor: colors.borderStrong,
                color: colors.text,
              },
            ]}
            value={passphrase}
          />
          {passphraseError ? (
            <Text
              accessibilityRole="alert"
              style={[styles.helperText, { color: colors.danger }]}
            >
              {passphraseError}
            </Text>
          ) : null}
        </View>
      </Modal>

      <Modal
        visible={pendingBackup !== null}
        transparent
        maskClosable={false}
        title={t("backupRestorePreviewTitle")}
        onClose={() => setPendingBackup(null)}
        footer={[
          {
            disabled: busy !== null,
            text: t("cancel"),
            onPress: () => setPendingBackup(null),
          },
          {
            disabled: busy !== null,
            loading: busy === "restore",
            text: t("restoreBackup"),
            style: {
              color: colors.accent,
              fontFamily: fonts.bodyMedium,
            },
            onPress: () => void restoreBackup(),
          },
        ]}
      >
        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          {pendingBackup
            ? t("backupRestorePreviewMessage", {
                conversationCount: pendingBackup.data.conversations.length,
                appVersion: pendingBackup.appVersion,
              })
            : ""}
        </Text>
      </Modal>
    </View>
  );
}
