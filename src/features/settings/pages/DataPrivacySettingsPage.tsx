import React from "react";
import { Text, TextInput, View } from "react-native";

import { Button, Modal } from "../../../design-system/NativeControls";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

import { useLocalization } from "../../../i18n";
import {
  APP_DATA_BACKUP_MAX_BYTES,
  APP_DATA_BACKUP_MIN_PASSPHRASE_LENGTH,
  AppDataBackupError,
  decryptAppDataBackup,
  encryptAppDataBackup,
  isEncryptedAppDataBackup,
  parseAppDataBackup,
  serializeAppDataBackup,
  type AppDataBackup,
  type AppDataBackupRestoreResult,
} from "../../../services/appDataBackup";
import { recordDebugLogEvent } from "../../../services/debugLogCapture";
import { useTheme } from "../../../theme/ThemeContext";
import { fonts } from "../../../theme/typography";
import {
  AntButtonLabel,
  AntSectionIntro,
  AntSettingsCard,
} from "../AntSettingsPrimitives";
import { styles } from "../styles";

type BusyState =
  | "export-encrypted"
  | "export-readable"
  | "import"
  | "restore"
  | null;

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
  onCreateAppDataBackup,
  onRestoreAppDataBackup,
}: {
  onCreateAppDataBackup: () => Promise<AppDataBackup>;
  onRestoreAppDataBackup: (
    backup: AppDataBackup,
  ) => Promise<AppDataBackupRestoreResult>;
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
    (error: unknown, fallbackKey: "backupExportFailed" | "backupImportFailed") => {
      if (error instanceof AppDataBackupError) {
        switch (error.code) {
          case "decrypt-failed":
          case "passphrase-required":
            return t("backupDecryptFailed");
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

      const baseDirectory = FileSystem.cacheDirectory;
      if (!baseDirectory) {
        throw new Error("cache-unavailable");
      }

      const directory = `${baseDirectory}backups/`;
      const path = `${directory}${getBackupFileName(encrypted)}`;
      await FileSystem.makeDirectoryAsync(directory, { intermediates: true });

      try {
        await FileSystem.writeAsStringAsync(path, content);
        await Sharing.shareAsync(path, {
          dialogTitle: t("dataBackup"),
          mimeType: encrypted ? "application/octet-stream" : "application/json",
          UTI: encrypted ? "public.data" : "public.json",
        });
      } finally {
        await FileSystem.deleteAsync(path, { idempotent: true }).catch(
          () => undefined,
        );
      }
    },
    [t],
  );

  const exportReadableBackup = React.useCallback(async () => {
    const startedAtMs = Date.now();
    recordDebugLogEvent({
      event: "backup-export-started",
      payload: { encrypted: false },
    });
    setBusy("export-readable");
    setRestoreResult(null);
    setStatusMessage(null);
    try {
      const backup = await onCreateAppDataBackup();
      await shareBackup(serializeAppDataBackup(backup), false);
      recordDebugLogEvent({
        event: "backup-export-completed",
        payload: {
          conversationCount: backup.data.conversations.length,
          durationMs: Date.now() - startedAtMs,
          encrypted: false,
        },
      });
    } catch (error) {
      recordDebugLogEvent({
        event: "backup-export-failed",
        level: "warn",
        payload: { durationMs: Date.now() - startedAtMs, encrypted: false, error },
      });
      setStatusMessage(getErrorMessage(error, "backupExportFailed"));
    } finally {
      setBusy(null);
    }
  }, [getErrorMessage, onCreateAppDataBackup, shareBackup]);

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

    setBusy("export-encrypted");
    const startedAtMs = Date.now();
    recordDebugLogEvent({
      event: "backup-export-started",
      payload: { encrypted: true },
    });
    setPassphraseError(null);
    setStatusMessage(null);
    try {
      const backup = await onCreateAppDataBackup();
      const encrypted = await encryptAppDataBackup(backup, passphrase);
      await shareBackup(encrypted, true);
      recordDebugLogEvent({
        event: "backup-export-completed",
        payload: {
          conversationCount: backup.data.conversations.length,
          durationMs: Date.now() - startedAtMs,
          encrypted: true,
        },
      });
      setExportPassphraseVisible(false);
      resetPassphrase();
    } catch (error) {
      recordDebugLogEvent({
        event: "backup-export-failed",
        level: "warn",
        payload: { durationMs: Date.now() - startedAtMs, encrypted: true, error },
      });
      setPassphraseError(getErrorMessage(error, "backupExportFailed"));
    } finally {
      setBusy(null);
    }
  }, [
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

    setBusy("import");
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
      setBusy(null);
    }
  }, [
    encryptedDocument,
    getErrorMessage,
    passphrase,
    resetPassphrase,
    t,
  ]);

  const chooseBackup = React.useCallback(async () => {
    const startedAtMs = Date.now();
    recordDebugLogEvent({ event: "backup-import-picker-requested" });
    setBusy("import");
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
      setBusy(null);
    }
  }, [getErrorMessage, resetPassphrase]);

  const restoreBackup = React.useCallback(async () => {
    if (!pendingBackup) {
      return;
    }

    setBusy("restore");
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
      setBusy(null);
    }
  }, [getErrorMessage, onRestoreAppDataBackup, pendingBackup]);

  return (
    <View style={styles.sectionPageStack}>
      <View style={styles.sectionGroup}>
        <AntSectionIntro
          title={t("dataBackup")}
          description={t("dataBackupDescription")}
        />
        <AntSettingsCard>
          <Text style={[styles.helperText, { color: colors.textSecondary }]}>
            {t("dataBackupKeysExcluded")}
          </Text>
          <View style={styles.dataBackupActions}>
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
            <Text style={[styles.warningText, { color: colors.danger }]}>
              {t("readableBackupWarning")}
            </Text>
            <Button
              testID="export-encrypted-backup"
              disabled={busy !== null}
              loading={busy === "export-encrypted"}
              onPress={() => {
                resetPassphrase();
                setExportPassphraseVisible(true);
              }}
              style={styles.dataBackupButton}
            >
              <AntButtonLabel
                color={colors.text}
                icon="lock"
                label={t("exportEncryptedBackup")}
              />
            </Button>
            <Text style={[styles.helperText, { color: colors.textMuted }]}>
              {t("encryptedBackupHint")}
            </Text>
          </View>
        </AntSettingsCard>
      </View>

      <View style={styles.sectionGroup}>
        <AntSectionIntro title={t("importBackup")} />
        <AntSettingsCard>
          <Button
            testID="import-app-data-backup"
            disabled={busy !== null}
            loading={busy === "import"}
            onPress={() => void chooseBackup()}
            style={styles.dataBackupButton}
          >
            <AntButtonLabel
              color={colors.text}
              icon="folder-open"
              label={t("importBackup")}
            />
          </Button>
          {restoreResult ? (
            <Text
              testID="backup-restore-result"
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
        </AntSettingsCard>
      </View>

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
            text: t("cancel"),
            onPress: () => {
              setExportPassphraseVisible(false);
              resetPassphrase();
            },
          },
          {
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
            text: t("cancel"),
            onPress: () => {
              setEncryptedDocument(null);
              setImportPassphraseVisible(false);
              resetPassphrase();
            },
          },
          {
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
            text: t("cancel"),
            onPress: () => setPendingBackup(null),
          },
          {
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
                conversationCount:
                  pendingBackup.data.conversations.length,
                appVersion: pendingBackup.appVersion,
              })
            : ""}
        </Text>
      </Modal>
    </View>
  );
}
