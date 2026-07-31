import { useCallback } from "react";

import appConfig from "../../../app.json";
import {
  AppDataBackup,
  AppDataBackupConversation,
  AppDataBackupRestoreResult,
  createAppDataBackup,
  PortableSettings,
} from "../../services/appDataBackup";
import { Conversation, ConversationMeta, Settings } from "../../types";

interface UseMainScreenDataBackupParams {
  activeConversationId: string | null;
  conversationMetas: ConversationMeta[];
  getConversationById: (id: string) => Promise<Conversation | null>;
  restoreConversationBackup: (
    records: AppDataBackupConversation[],
    activeConversationId: string | null,
  ) => Promise<Omit<AppDataBackupRestoreResult, "settingsRestored">>;
  restorePortableSettings: (settings: PortableSettings) => void;
  settings: Settings;
}

export function useMainScreenDataBackup({
  activeConversationId,
  conversationMetas,
  getConversationById,
  restoreConversationBackup,
  restorePortableSettings,
  settings,
}: UseMainScreenDataBackupParams) {
  const createBackup = useCallback(
    () =>
      createAppDataBackup({
        activeConversationId,
        appVersion: appConfig.expo.version,
        conversationMetas,
        getConversationById,
        settings,
      }),
    [activeConversationId, conversationMetas, getConversationById, settings],
  );
  const restoreBackup = useCallback(
    async (backup: AppDataBackup): Promise<AppDataBackupRestoreResult> => {
      const conversationResult = await restoreConversationBackup(
        backup.data.conversations,
        backup.data.activeConversationId,
      );
      restorePortableSettings(backup.data.settings);
      return {
        ...conversationResult,
        settingsRestored: true,
      };
    },
    [restoreConversationBackup, restorePortableSettings],
  );

  return { createBackup, restoreBackup };
}
