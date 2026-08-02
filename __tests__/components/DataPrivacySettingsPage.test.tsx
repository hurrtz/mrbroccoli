import React from "react";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

import { DataPrivacySettingsPage } from "../../src/features/settings/pages/DataPrivacySettingsPage";
import { Modal as NativeDialog } from "../../src/design-system/NativeControls";
import { LocalizationProvider } from "../../src/i18n";
import * as AppDataBackupService from "../../src/services/appDataBackup";
import {
  APP_DATA_BACKUP_MAX_BYTES,
  serializeAppDataBackup,
  type AppDataBackup,
} from "../../src/services/appDataBackup";
import { ThemeProvider } from "../../src/theme/ThemeContext";
import { DEFAULT_SETTINGS } from "../../src/types";
import type { ConversationArchiveController } from "../../src/hooks/useConversationArchive";

const NativeDialogType = NativeDialog as unknown as React.ComponentType<any>;

function createBackup(): AppDataBackup {
  const {
    apiKeys: _apiKeys,
    providerValidationResults: _providerValidationResults,
    ...settings
  } = DEFAULT_SETTINGS;

  return {
    appVersion: "2.6.0",
    exportedAt: "2026-08-01T12:00:00.000Z",
    format: "mrbroccoli-app-data",
    version: 1,
    data: {
      activeConversationId: "conversation-1",
      conversations: [
        {
          pinned: false,
          conversation: {
            id: "conversation-1",
            title: "Imported conversation",
            createdAt: "2026-08-01T11:00:00.000Z",
            updatedAt: "2026-08-01T11:01:00.000Z",
            messages: [],
          },
        },
      ],
      settings,
    },
  };
}

function renderPage(overrides: {
  conversationArchive?: ConversationArchiveController;
  onCreateAppDataBackup?: () => Promise<AppDataBackup>;
  onRestoreAppDataBackup?: React.ComponentProps<
    typeof DataPrivacySettingsPage
  >["onRestoreAppDataBackup"];
  onUpdate?: React.ComponentProps<typeof DataPrivacySettingsPage>["onUpdate"];
} = {}) {
  return render(
    <ThemeProvider mode="light">
      <LocalizationProvider language="en">
        <DataPrivacySettingsPage
          settings={DEFAULT_SETTINGS}
          onUpdate={overrides.onUpdate ?? jest.fn()}
          conversationArchive={
            overrides.conversationArchive ?? {
              chooseDirectory: jest.fn(async () => undefined),
              configured: false,
              directoryName: null,
              disconnect: jest.fn(async () => undefined),
              error: null,
              lastSyncedAt: null,
              loaded: true,
              syncNow: jest.fn(async () => undefined),
              syncing: false,
            }
          }
          onCreateAppDataBackup={
            overrides.onCreateAppDataBackup ??
            jest.fn(async () => createBackup())
          }
          onRestoreAppDataBackup={
            overrides.onRestoreAppDataBackup ??
            jest.fn(async () => ({
              conversationsCopied: 0,
              conversationsRestored: 1,
              conversationsSkipped: 0,
              settingsRestored: true,
            }))
          }
        />
      </LocalizationProvider>
    </ThemeProvider>,
  );
}

function getVisibleModal(screen: ReturnType<typeof render>) {
  return screen
    .UNSAFE_getAllByType(NativeDialogType)
    .find((modal) => modal.props.visible);
}

describe("DataPrivacySettingsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(Sharing.isAvailableAsync).mockResolvedValue(true);
    jest.mocked(DocumentPicker.getDocumentAsync).mockResolvedValue({
      assets: null,
      canceled: true,
    });
    jest.mocked(FileSystem.readDirectoryAsync).mockResolvedValue([]);
    jest.mocked(FileSystem.getInfoAsync).mockResolvedValue({
      exists: true,
      isDirectory: false,
      modificationTime: Date.now() / 1_000,
      size: 512,
      uri: "file:///cache/backups/test-backup",
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("keeps past conversation knowledge opt-in and discloses provider sharing", () => {
    const onUpdate = jest.fn();
    const screen = renderPage({ onUpdate });
    const toggle = screen.getByLabelText("Use past conversation knowledge");

    expect(toggle.props.value).toBe(false);
    expect(
      screen.getByText(/Retrieved excerpts are sent to the model provider/),
    ).toBeTruthy();
    expect(
      screen.getByText(/Private conversations are never indexed/),
    ).toBeTruthy();

    fireEvent(toggle, "valueChange", true);

    expect(onUpdate).toHaveBeenCalledWith({
      pastConversationKnowledgeEnabled: true,
    });
  });

  it("chooses, updates, and disconnects the plaintext conversation archive", () => {
    const conversationArchive: ConversationArchiveController = {
      chooseDirectory: jest.fn(async () => undefined),
      configured: true,
      directoryName: "Mr Broccoli Archive",
      disconnect: jest.fn(async () => undefined),
      error: null,
      lastSyncedAt: "2026-08-02T10:00:00.000Z",
      loaded: true,
      syncNow: jest.fn(async () => undefined),
      syncing: false,
    };
    const screen = renderPage({ conversationArchive });

    expect(screen.getByText("AI conversation archive")).toBeTruthy();
    expect(screen.getByText("Folder: Mr Broccoli Archive")).toBeTruthy();
    expect(screen.getByText(/Archive files are plain text/)).toBeTruthy();

    fireEvent.press(screen.getByTestId("sync-conversation-archive"));
    fireEvent.press(screen.getByTestId("change-conversation-archive-folder"));
    fireEvent.press(screen.getByTestId("disconnect-conversation-archive"));

    expect(conversationArchive.syncNow).toHaveBeenCalledTimes(1);
    expect(conversationArchive.chooseDirectory).toHaveBeenCalledTimes(1);
    expect(conversationArchive.disconnect).toHaveBeenCalledTimes(1);
  });

  it("surfaces lost archive access and lets the user choose a folder", () => {
    const chooseDirectory = jest.fn(async () => undefined);
    const screen = renderPage({
      conversationArchive: {
        chooseDirectory,
        configured: false,
        directoryName: null,
        disconnect: jest.fn(async () => undefined),
        error: "access-lost",
        lastSyncedAt: null,
        loaded: true,
        syncNow: jest.fn(async () => undefined),
        syncing: false,
      },
    });

    expect(screen.getByRole("alert").props.children).toBe(
      "Folder access was lost. Choose the archive folder again.",
    );
    fireEvent.press(screen.getByTestId("choose-conversation-archive-folder"));
    expect(chooseDirectory).toHaveBeenCalledTimes(1);
  });

  it("retains a shared readable backup so deferred mail attachments remain readable", async () => {
    const backup = createBackup();
    const screen = renderPage({
      onCreateAppDataBackup: jest.fn(async () => backup),
    });

    fireEvent.press(screen.getByTestId("export-readable-backup"));

    await waitFor(() => expect(Sharing.shareAsync).toHaveBeenCalledTimes(1));
    const sharedPath = jest.mocked(Sharing.shareAsync).mock.calls[0][0];
    expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
      sharedPath,
      serializeAppDataBackup(backup),
    );
    expect(FileSystem.deleteAsync).not.toHaveBeenCalledWith(sharedPath, {
      idempotent: true,
    });
  });

  it("previews and restores a readable import before mutating app data", async () => {
    const backup = createBackup();
    const onRestoreAppDataBackup = jest.fn(async () => ({
      conversationsCopied: 1,
      conversationsRestored: 1,
      conversationsSkipped: 0,
      settingsRestored: true,
    }));
    jest.mocked(DocumentPicker.getDocumentAsync).mockResolvedValue({
      canceled: false,
      assets: [
        {
          name: "backup.json",
          size: 512,
          uri: "file:///cache/backup.json",
          mimeType: "application/json",
          lastModified: 1_000,
        },
      ],
    });
    jest
      .mocked(FileSystem.readAsStringAsync)
      .mockResolvedValue(serializeAppDataBackup(backup));
    const screen = renderPage({ onRestoreAppDataBackup });

    fireEvent.press(screen.getByTestId("import-app-data-backup"));

    await waitFor(() => {
      expect(getVisibleModal(screen)?.props.title).toBe("Restore this backup?");
    });
    expect(onRestoreAppDataBackup).not.toHaveBeenCalled();

    await act(async () => {
      getVisibleModal(screen)?.props.footer[1].onPress();
    });

    await waitFor(() => {
      expect(onRestoreAppDataBackup).toHaveBeenCalledWith(backup);
      expect(screen.getByTestId("backup-restore-result")).toBeTruthy();
    });
    expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
      "file:///cache/backup.json",
      { idempotent: true },
    );
  });

  it("validates and exports an encrypted backup through the passphrase dialog", async () => {
    const backup = createBackup();
    const encryptedDocument = JSON.stringify({
      cipher: {
        combined: "encrypted-payload",
        ivBytes: 12,
        name: "aes-256-gcm",
        tagBytes: 16,
      },
      format: "mrbroccoli-app-data-encrypted",
      kdf: {
        iterations: 310_000,
        name: "pbkdf2-hmac-sha256",
        salt: "test-salt",
      },
      version: 1,
    });
    const encryptBackup = jest
      .spyOn(AppDataBackupService, "encryptAppDataBackup")
      .mockResolvedValue(encryptedDocument);
    const onCreateAppDataBackup = jest.fn(async () => backup);
    const screen = renderPage({ onCreateAppDataBackup });

    fireEvent.press(screen.getByTestId("export-encrypted-backup"));
    expect(getVisibleModal(screen)?.props.title).toBe(
      "Protect this backup",
    );

    fireEvent.changeText(screen.getByTestId("backup-passphrase"), "short");
    fireEvent.changeText(
      screen.getByTestId("backup-passphrase-confirmation"),
      "short",
    );
    await act(async () => {
      getVisibleModal(screen)?.props.footer[1].onPress();
    });
    expect(screen.getByRole("alert").props.children).toBe(
      "Use at least 12 characters. Store this passphrase safely; it cannot be recovered.",
    );
    expect(onCreateAppDataBackup).not.toHaveBeenCalled();

    fireEvent.changeText(
      screen.getByTestId("backup-passphrase"),
      "aaaaaaaaaaaa",
    );
    fireEvent.changeText(
      screen.getByTestId("backup-passphrase-confirmation"),
      "aaaaaaaaaaaa",
    );
    await act(async () => {
      getVisibleModal(screen)?.props.footer[1].onPress();
    });
    expect(screen.getByRole("alert").props.children).toBe(
      "Choose a less predictable passphrase. Repeated characters and common sequences are not secure.",
    );
    expect(onCreateAppDataBackup).not.toHaveBeenCalled();

    fireEvent.changeText(
      screen.getByTestId("backup-passphrase"),
      "a long test passphrase",
    );
    fireEvent.changeText(
      screen.getByTestId("backup-passphrase-confirmation"),
      "a long test passphrase",
    );
    await act(async () => {
      getVisibleModal(screen)?.props.footer[1].onPress();
    });

    await waitFor(() => expect(Sharing.shareAsync).toHaveBeenCalledTimes(1));
    expect(encryptBackup).toHaveBeenCalledWith(
      backup,
      "a long test passphrase",
    );
    const sharedPath = jest.mocked(Sharing.shareAsync).mock.calls[0][0];
    expect(sharedPath).toMatch(/\.mrbroccoli\.encrypted$/);
    expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
      sharedPath,
      encryptedDocument,
    );
    expect(Sharing.shareAsync).toHaveBeenCalledWith(
      sharedPath,
      expect.objectContaining({ mimeType: "application/octet-stream" }),
    );
    expect(getVisibleModal(screen)).toBeUndefined();
  });

  it("runs only one encrypted export when the action is pressed repeatedly", async () => {
    const backup = createBackup();
    let finishEncryption: ((content: string) => void) | undefined;
    jest
      .spyOn(AppDataBackupService, "encryptAppDataBackup")
      .mockImplementation(
        () =>
          new Promise<string>((resolve) => {
            finishEncryption = resolve;
          }),
      );
    const onCreateAppDataBackup = jest.fn(async () => backup);
    const screen = renderPage({ onCreateAppDataBackup });

    fireEvent.press(screen.getByTestId("export-encrypted-backup"));
    fireEvent.changeText(
      screen.getByTestId("backup-passphrase"),
      "a long test passphrase",
    );
    fireEvent.changeText(
      screen.getByTestId("backup-passphrase-confirmation"),
      "a long test passphrase",
    );
    const exportAction = getVisibleModal(screen)?.props.footer[1].onPress;
    await act(async () => {
      exportAction();
      exportAction();
    });

    await waitFor(() => expect(onCreateAppDataBackup).toHaveBeenCalledTimes(1));
    expect(AppDataBackupService.encryptAppDataBackup).toHaveBeenCalledTimes(1);
    expect(getVisibleModal(screen)?.props.footer[1]).toMatchObject({
      disabled: true,
      loading: true,
    });

    await act(async () => {
      finishEncryption?.("encrypted-document");
    });
    await waitFor(() => expect(Sharing.shareAsync).toHaveBeenCalledTimes(1));
  });

  it("unlocks an encrypted import before showing the restore preview", async () => {
    const backup = createBackup();
    const encryptedDocument = JSON.stringify({
      format: "mrbroccoli-app-data-encrypted",
      version: 1,
    });
    const decryptBackup = jest
      .spyOn(AppDataBackupService, "decryptAppDataBackup")
      .mockResolvedValue(backup);
    const onRestoreAppDataBackup = jest.fn(async () => ({
      conversationsCopied: 0,
      conversationsRestored: 1,
      conversationsSkipped: 0,
      settingsRestored: true,
    }));
    jest.mocked(DocumentPicker.getDocumentAsync).mockResolvedValue({
      canceled: false,
      assets: [
        {
          name: "backup.encrypted",
          size: 512,
          uri: "file:///cache/backup.encrypted",
          mimeType: "application/octet-stream",
          lastModified: 1_000,
        },
      ],
    });
    jest.mocked(FileSystem.readAsStringAsync).mockResolvedValue(
      encryptedDocument,
    );
    const screen = renderPage({ onRestoreAppDataBackup });

    fireEvent.press(screen.getByTestId("import-app-data-backup"));
    await waitFor(() => {
      expect(getVisibleModal(screen)?.props.title).toBe(
        "Unlock encrypted backup",
      );
    });
    expect(onRestoreAppDataBackup).not.toHaveBeenCalled();

    fireEvent.changeText(
      screen.getByTestId("import-backup-passphrase"),
      "a long test passphrase",
    );
    await act(async () => {
      getVisibleModal(screen)?.props.footer[1].onPress();
    });

    await waitFor(() => {
      expect(getVisibleModal(screen)?.props.title).toBe(
        "Restore this backup?",
      );
    });
    expect(decryptBackup).toHaveBeenCalledWith(
      encryptedDocument,
      "a long test passphrase",
    );
    expect(onRestoreAppDataBackup).not.toHaveBeenCalled();

    await act(async () => {
      getVisibleModal(screen)?.props.footer[1].onPress();
    });
    await waitFor(() => {
      expect(onRestoreAppDataBackup).toHaveBeenCalledWith(backup);
      expect(screen.getByTestId("backup-restore-result")).toBeTruthy();
    });
  });

  it("surfaces share and restore failures without reporting success", async () => {
    jest.mocked(Sharing.isAvailableAsync).mockResolvedValue(false);
    const screen = renderPage({
      onRestoreAppDataBackup: jest.fn(async () => {
        throw new Error("restore failed");
      }),
    });

    fireEvent.press(screen.getByTestId("export-readable-backup"));
    await waitFor(() => {
      expect(screen.getByRole("alert").props.children).toBe(
        "File sharing is not available on this device.",
      );
    });
    expect(Sharing.shareAsync).not.toHaveBeenCalled();

    const backup = createBackup();
    jest.mocked(DocumentPicker.getDocumentAsync).mockResolvedValue({
      canceled: false,
      assets: [
        {
          name: "backup.json",
          size: 512,
          uri: "file:///cache/backup.json",
          mimeType: "application/json",
          lastModified: 1_000,
        },
      ],
    });
    jest
      .mocked(FileSystem.readAsStringAsync)
      .mockResolvedValue(serializeAppDataBackup(backup));

    fireEvent.press(screen.getByTestId("import-app-data-backup"));
    await waitFor(() => {
      expect(getVisibleModal(screen)?.props.title).toBe("Restore this backup?");
    });
    await act(async () => {
      getVisibleModal(screen)?.props.footer[1].onPress();
    });
    await waitFor(() => {
      expect(screen.getByRole("alert").props.children).toBe(
        "The backup could not be imported.",
      );
    });
    expect(screen.queryByTestId("backup-restore-result")).toBeNull();
  });

  it("rejects an oversized import before reading or restoring it", async () => {
    jest.mocked(DocumentPicker.getDocumentAsync).mockResolvedValue({
      canceled: false,
      assets: [
        {
          name: "huge.json",
          size: APP_DATA_BACKUP_MAX_BYTES + 1,
          uri: "file:///cache/huge.json",
          mimeType: "application/json",
          lastModified: 1_000,
        },
      ],
    });
    const onRestoreAppDataBackup = jest.fn();
    const screen = renderPage({ onRestoreAppDataBackup });

    fireEvent.press(screen.getByTestId("import-app-data-backup"));

    await waitFor(() => expect(screen.getByRole("alert")).toBeTruthy());
    expect(screen.getByRole("alert").props.children).toBe(
      "This backup is too large to import.",
    );
    expect(FileSystem.readAsStringAsync).not.toHaveBeenCalled();
    expect(onRestoreAppDataBackup).not.toHaveBeenCalled();
  });
});
