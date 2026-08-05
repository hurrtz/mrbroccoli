---
status: active
code_paths:
  - src/hooks/useConversations.ts
  - src/hooks/conversations/**
dependencies:
  - src/services/conversationKnowledge/
  - src/services/imageAttachmentFiles.ts
  - AsyncStorage
validations:
  - npm test -- --runInBand --watchman=false __tests__/hooks/useConversations.test.ts __tests__/utils/conversationBranches.test.ts __tests__/services/appDataBackup.test.ts
  - npm run typecheck:app
provenance:
  intent: history-backfilled
  validation: test-backed
last_validated_sha: 7db5c94
---

# Conversation State Specification

## Ownership

`useConversations` is the public owner of conversation hydration, selection,
search, mutations, branches, privacy, integrity repair, and backup restore.
This directory owns canonical AsyncStorage access and metadata derivation.

## Storage Shape

- `@mrbroccoli/conversations` stores the sorted lightweight metadata list.
- `@mrbroccoli/conversation/<id>` stores each complete conversation.
- `@mrbroccoli/active_conversation` stores the selected conversation ID.
- Image attachment URIs are persisted relative to the app-owned document
  location and resolved against the current container when loaded.

Metadata provides fast drawer rendering and search orientation. Full records
hydrate only when needed. Derived metadata must be rebuildable from a complete
conversation record.

Writes are serialized per key. A missing or unreadable conversation does not
crash hydration; it is reported through the persistence alert path and handled
as unavailable state.

## Conversation Mutations

- Messages receive new UUIDs and timestamps at insertion.
- Assistant message metadata records provider/model provenance and turn
  receipts; conversation metadata tracks providers and models observed.
- Editing a user message is allowed only for non-empty changed text. It marks
  `editedAt` and removes the compact summary because that summary may describe
  superseded content.
- Per-conversation length, tone, LLM instructions, TTS instructions, and voice
  override global defaults without mutating them.
- Deleting a conversation also deletes its derived knowledge rows, integrity
  repair snapshot, and app-owned image files.
- Private state is canonical conversation data and immediately controls derived
  knowledge indexing.

## Branching

Continuing from an earlier message creates a new conversation instead of
truncating the original.

- Messages through the checkpoint are cloned with new IDs.
- Image files and attachment IDs are cloned so deleting one branch cannot break
  another.
- The branch records root conversation, parent conversation, source checkpoint,
  cloned checkpoint, branch kind, and creation time.
- Existing per-conversation settings and privacy are copied.
- Summary state is not copied because the new path may diverge.
- Every member of a branch family excludes its siblings from
  past-conversation retrieval, avoiding duplicated shared history as apparently
  independent evidence.

Branch kinds distinguish an edited prompt, an alternative answer requested
from an unedited user prompt, and continuation after an assistant checkpoint.
The drawer renders the recursive parent/child graph with cycle protection and
explicit expansion state.

## Search and Knowledge Synchronization

Conversation search scans metadata and, when needed, full records. When
past-conversation knowledge is enabled, eligible non-private conversations are
synchronized to the derived SQLite index after meaningful changes. Disabling
the feature clears that index. The active conversation and all explicit family,
private, and caller exclusions remain ineligible at query time.

**Decision:** Canonical data never depends on the derived index. Indexing may
fail or be rebuilt without losing conversations.

## Integrity Repair

Integrity inspection detects recoverable conversation anomalies. Repair keeps
a reversible snapshot, applies the bounded correction, and exposes undo. Repair
state is operational and is removed when the conversation is deleted.

## Restore Contract

Backup restore is non-destructive:

- identical records with matching pin state are skipped;
- a conflicting conversation ID is restored under a new UUID;
- attachment IDs and files are materialized safely;
- branch root/parent references and knowledge exclusions are remapped across
  copied IDs; and
- existing conversations, provider keys, and unrelated settings remain.

## Evidence

- [`../useConversations.ts`](../useConversations.ts)
- [`storage.ts`](./storage.ts)
- [`useConversationMutations.ts`](./useConversationMutations.ts)
- [`../../utils/conversationBranches.ts`](../../utils/conversationBranches.ts)
- [`../../../__tests__/hooks/useConversations.test.ts`](../../../__tests__/hooks/useConversations.test.ts)
- [`../../../__tests__/utils/conversationBranches.test.ts`](../../../__tests__/utils/conversationBranches.test.ts)
