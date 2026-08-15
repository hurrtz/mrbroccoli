---
status: active
code_paths:
  - src/services/conversationStore/**
dependencies:
  - expo-sqlite
  - "@react-native-async-storage/async-storage (migration source only)"
  - src/hooks/conversations/
validations:
  - npm test -- --runInBand --watchman=false __tests__/services/conversationStore.test.ts __tests__/hooks/useConversations.test.ts
  - npm run typecheck:app
provenance:
  intent: owner-confirmed
  validation: test-backed
---

# Conversation Store Specification

## Purpose

The authoritative store for conversation records. Conversations previously
lived in AsyncStorage across three key families, so any operation spanning more
than one key could be interrupted halfway. Branching, backup restore, deletion,
and active-selection changes are multi-record operations, and a crash between
two writes left metadata describing records that no longer matched.

SQLite makes those operations atomic. This boundary owns the schema, the
transaction discipline, and the one-time import from AsyncStorage.

## Separate From The Knowledge Index

Conversations use `mr-broccoli-conversations.db`. The derived retrieval index
keeps its own `mr-broccoli-conversation-knowledge.db`.

**Decision:** The two databases stay separate. `conversationKnowledge/SPEC.md`
requires that the index be disposable and that indexing failure never block
canonical persistence. Sharing one file would put both in the same transaction,
so a failure while indexing would roll back the message write that triggered
it — inverting the contract rather than strengthening it.

## Shape

One row per conversation:

- `document` — the complete `Conversation` as JSON, with image attachment URIs
  stored relative to the app container.
- `meta` — the `ConversationMeta` as JSON.
- `updated_at` and `pinned` — mirrored out of metadata so the drawer ordering is
  an indexed query rather than a full scan.

`app_state` is a key/value table holding the active conversation ID and the
migration marker.

The conversation document and metadata may carry `isLocked`, but this database
is not encrypted by that flag. Password verifiers and device-authentication
markers live separately in SecureStore under the session-lock service. Callers
must enforce authentication before reading a locked document into app state.

**Decision:** Messages are not a separate table. They are always read and
written as part of a whole conversation, nothing queries an individual message,
and full-text retrieval is already served by the knowledge index. Normalizing
would mean decomposing and recomposing every optional message field at the
storage boundary for no query benefit.

## Write Discipline

Every write runs through `runInConversationTransaction`, which queues behind any
write already in flight. Mobile SQLite shares one connection and transactions
cannot nest, so a second `BEGIN` while one is open throws. Reads call
`settleConversationWrites` first so they never observe a stale row.

Metadata absent from an update is left alone rather than deleted. Callers pass
filtered in-memory lists, so treating omission as deletion would let a drawer
filter destroy conversations. Deleting a conversation removes its row, which
removes its metadata in the same statement.

Saving a conversation does not overwrite stored metadata for a row that already
exists. Pinned state lives only in metadata, so refreshing it on every save
would unpin a conversation as a side effect of appending a message.

## Migration From AsyncStorage

Runs once, before the first read, inside a single transaction covering both the
rows and the marker that records completion. A failure rolls back the marker
too, so the next launch retries against an untouched store.

- Documents move as raw strings and are never parsed. A record that fails to
  parse behaves exactly as it did before; re-serializing would silently rewrite
  or reject data the previous store accepted.
- Only conversations named by the legacy metadata list are imported. Scanning
  for orphaned `@mrbroccoli/conversation/<id>` keys would resurrect
  conversations whose deletion removed the metadata entry but failed before
  removing the record — the exact non-atomic failure this store exists to end.
- Metadata whose record is missing is skipped and counted. The content is
  already unrecoverable, and a ghost row would be a permanently broken entry.
- The legacy keys are left in place as a recovery path for one release.

A failed migration is reported through `reportPersistenceAlert` and swallowed.
The transaction has rolled back, so SQLite is merely empty while AsyncStorage
stays intact; propagating the error would break hydration outright.

**Decision:** Legacy key removal is deferred to a later version rather than
bundled with the migration, so a beta install can be recovered by hand if the
import proves wrong.

## Evidence

- [`index.ts`](./index.ts)
- [`migration.ts`](./migration.ts)
- [`../../hooks/conversations/storage.ts`](../../hooks/conversations/storage.ts)
- [`../../../__tests__/services/conversationStore.test.ts`](../../../__tests__/services/conversationStore.test.ts)
