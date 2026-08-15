---
status: active
code_paths:
  - src/services/conversationKnowledge/**
dependencies:
  - expo-sqlite with FTS5
  - src/hooks/conversations/
validations:
  - npm test -- --runInBand --watchman=false __tests__/services/conversationKnowledge.test.ts
  - npm run typecheck:app
provenance:
  intent: owner-confirmed and history-backfilled
  validation: test-backed
last_validated_sha: 7db5c94
---

# Conversation Knowledge Specification

## Purpose

Past-conversation knowledge is an optional on-device retrieval layer over
canonical conversation records. It helps a new turn reuse relevant history
without uploading or replaying the complete conversation library.

The SQLite database is derived cache state. Conversations remain authoritative
and must survive index deletion, schema changes, or retrieval failure.

## Eligibility Contract

- The feature is globally opt-in.
- The current conversation is always excluded from retrieval.
- Locked conversations follow the same tombstone and removal rule even during
  an authenticated foreground visit. Unlocking for display never makes their
  content eligible for cross-session retrieval.
- Branch-family exclusions prevent shared copied history from appearing as
  multiple independent sources.
- Disabling the feature clears derived rows.
- The database and vectors are excluded from app-data backup.
- Index construction, FTS, vector scoring, and graph expansion stay on device.
- Only selected source-labelled excerpts are passed to the current response
  route; the user can inspect the source conversation metadata on the reply.

**Decision:** A session lock is both an app access boundary and a permanent
cross-session-knowledge exclusion while it remains set. The canonical
conversation remains intact, while its content cannot become a source for
another session.

## Index Shape

The database uses WAL and foreign keys and contains:

- one revision row per indexed conversation;
- message-history chunks capped at 1,600 characters;
- a contentless FTS5 index;
- a 128-dimensional deterministic lexical hash vector per chunk; and
- bidirectional weighted adjacency links between neighboring chunks.

The current embedding ID is `local-lexical-hash-v1`. It uses normalized word
and character-trigram features, is explicitly non-semantic, and processes at
most 320 tokens per input.

**Decision:** Vector generation is separated from storage/retrieval so a future
capability-gated multilingual neural adapter can replace it without changing
the user-facing privacy or source contract. Its model/version must participate
in the index revision.

## Synchronization

Conversation revision includes chunk format, embedding ID, title, update time,
message count, and last-message identity/length. Unchanged revisions skip
reindexing.

Writes are serialized globally and per conversation because mobile SQLite uses
one shared connection. A new conversation revision replaces its old chunks,
FTS rows, and links transactionally.

Index failures are sanitized and reported but do not block canonical
conversation persistence or a normal response without retrieved knowledge.

## Retrieval

Retrieval combines:

1. up to 24 FTS seed rows;
2. an exact scan over at most 1,500 recently updated vectors;
3. lexical and vector evidence thresholds;
4. near-duplicate suppression;
5. at most three distinct source conversations; and
6. adjacency expansion for surrounding context.

The final prompt context is capped at 4,800 characters. Every excerpt is
labelled with source title and update date, and reply metadata retains source
conversation ID, title, date, strength, and score information needed by the UI.

**Decision:** Repeated weak similarity is not enough. Vector-only results need
a stronger threshold than hybrid lexical/vector matches, and low-information
query tokens are discounted. This favors explainable relevant excerpts over
apparent semantic breadth that the current lexical embedding cannot provide.

## Trust Boundary

Retrieved text is historical user/model data, not trusted instructions or
verified evidence. Prompt construction must label it accordingly. It must not
be copied into the active conversation summary, because doing so would create
recursive contamination and erase source provenance.

## Evidence

- [`index.ts`](./index.ts)
- [`chunks.ts`](./chunks.ts)
- [`embedding.ts`](./embedding.ts)
- [`../../../__tests__/services/conversationKnowledge.test.ts`](../../../__tests__/services/conversationKnowledge.test.ts)
