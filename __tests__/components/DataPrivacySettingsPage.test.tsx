import React from "react";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import { Modal as AntModal, Provider as AntProvider } from "@ant-design/react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

import { DataPrivacySettingsPage } from "../../src/features/settings/pages/DataPrivacySettingsPage";
import { LocalizationProvider } from "../../src/i18n";
import {
  APP_DATA_BACKUP_MAX_BYTES,
  serializeAppDataBackup,
  type AppDataBackup,
} from "../../src/services/appDataBackup";
import { ThemeProvider } from "../../src/theme/ThemeContext";
import { DEFAULT_SETTINGS } from "../../src/types";

const AntModalType = AntModal as unknown as React.ComponentType<any>;

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
  onCreateAppDataBackup?: () => Promise<AppDataBackup>;
  onRestoreAppDataBackup?: React.ComponentProps<
    typeof DataPrivacySettingsPage
  >["onRestoreAppDataBackup"];
} = {}) {
  return render(
    <ThemeProvider mode="light">
      <LocalizationProvider language="en">
        <AntProvider>
          <DataPrivacySettingsPage
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
        </AntProvider>
      </LocalizationProvider>
    </ThemeProvider>,
  );
}

function getVisibleModal(screen: ReturnType<typeof render>) {
  return screen
    .UNSAFE_getAllByType(AntModalType)
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
  });

  it("exports a readable backup through a temporary file and removes it", async () => {
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
    expect(FileSystem.deleteAsync).toHaveBeenCalledWith(sharedPath, {
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
