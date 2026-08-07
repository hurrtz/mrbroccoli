import AsyncStorage from "@react-native-async-storage/async-storage";

import type { ConversationMeta } from "../../types";
import { recordDebugLogEvent } from "../debugLogCapture";
import {
  ACTIVE_CONVERSATION_STATE_KEY,
  readAppStateValue,
  runInConversationTransaction,
} from "./index";

export const LEGACY_META_KEY = "@mrbroccoli/conversations";
export const LEGACY_ACTIVE_CONVERSATION_KEY = "@mrbroccoli/active_conversation";
export const MIGRATION_STATE_KEY = "migrated_from_async_storage";

export function legacyConversationKey(id: string) {
  return `@mrbroccoli/conversation/${id}`;
}

function parseLegacyMetas(raw: string | null): ConversationMeta[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as ConversationMeta[]) : [];
  } catch {
    return [];
  }
}

/**
 * Copies conversations out of AsyncStorage into SQLite exactly once.
 *
 * Documents move as raw strings and are never parsed. A record that fails to
 * parse today behaves identically afterwards; re-serializing would silently
 * rewrite -- or reject -- data the previous store accepted.
 *
 * Only conversations named by the legacy metadata list are migrated. Scanning
 * for orphaned `@mrbroccoli/conversation/<id>` keys would also resurrect
 * conversations whose delete removed the metadata entry but failed before
 * removing the record -- precisely the non-atomic failure this migration
 * exists to end.
 *
 * The legacy keys are left in place. They stay readable for one release as a
 * recovery path and are removed in a later version.
 */
export async function migrateConversationsFromAsyncStorage() {
  const alreadyMigrated = await readAppStateValue(MIGRATION_STATE_KEY);

  if (alreadyMigrated) {
    return { migrated: 0, skipped: 0, alreadyMigrated: true } as const;
  }

  const [legacyMetaRaw, legacyActiveId] = await Promise.all([
    AsyncStorage.getItem(LEGACY_META_KEY),
    AsyncStorage.getItem(LEGACY_ACTIVE_CONVERSATION_KEY),
  ]);
  const legacyMetas = parseLegacyMetas(legacyMetaRaw);

  const documents = await Promise.all(
    legacyMetas.map(async (meta) => ({
      document: await AsyncStorage.getItem(legacyConversationKey(meta.id)),
      meta,
    })),
  );

  const migratable = documents.filter(
    (entry): entry is { document: string; meta: ConversationMeta } =>
      typeof entry.document === "string",
  );
  const skipped = documents.length - migratable.length;

  await runInConversationTransaction(async (database) => {
    for (const { document, meta } of migratable) {
      await database.runAsync(
        `INSERT INTO conversations (id, document, meta, updated_at, pinned)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(id) DO NOTHING`,
        meta.id,
        document,
        JSON.stringify(meta),
        meta.updatedAt ?? new Date(0).toISOString(),
        meta.pinned ? 1 : 0,
      );
    }

    if (legacyActiveId?.trim()) {
      await database.runAsync(
        `INSERT INTO app_state (key, value) VALUES (?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
        ACTIVE_CONVERSATION_STATE_KEY,
        legacyActiveId.trim(),
      );
    }

    // Written inside the same transaction as the rows it describes, so a
    // failure rolls the marker back too and the next launch retries cleanly.
    await database.runAsync(
      `INSERT INTO app_state (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      MIGRATION_STATE_KEY,
      new Date().toISOString(),
    );
  });

  recordDebugLogEvent({
    event: "conversation-store-migrated",
    payload: { migrated: migratable.length, skipped },
  });

  return {
    migrated: migratable.length,
    skipped,
    alreadyMigrated: false,
  } as const;
}
