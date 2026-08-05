---
status: active
code_paths:
  - src/services/voicePipeline.ts
  - src/services/voicePipeline/**
dependencies:
  - src/services/llm/
  - src/services/conversationKnowledge/
  - src/services/webSearch/
  - src/services/tts/
  - src/services/whisper/
validations:
  - npm test -- --runInBand --watchman=false __tests__/services/voicePipeline.test.ts __tests__/services/tts.test.ts __tests__/services/whisper.test.ts
  - npm run typecheck:app
provenance:
  intent: history-backfilled
  validation: test-backed
last_validated_sha: 7db5c94
---

# Voice Pipeline Specification

## Purpose

The voice pipeline executes one user turn from captured audio or submitted text
through context preparation, optional grounding/deliberation, response
generation, optional spoken playback, persistence callbacks, and cleanup.

It is the shared execution path for normal conversation, text submission, and
Drive Session. UI state remains in screen/hooks; provider and native operations
remain in services.

## Input Contract

A pipeline run receives an immutable snapshot of:

- turn and conversation identity;
- audio URI or a text transcription override;
- current messages and optional image attachments;
- response route, model effort, and provider key;
- STT and TTS modes, models, language, voice, and explicit fallback order;
- summary and cross-session-knowledge policy;
- response style and conversation overrides;
- web-search and Uber Mode configuration;
- playback policy; and
- callbacks plus one abort signal.

**Decision:** Route and policy are snapshotted at turn start. Settings changes
during a long request affect the next turn, not the request already executing.

## Ordered Stages

1. Transcribe recorded audio or normalize the supplied text override.
2. Persist the user turn through `onTranscription` and resolve the effective
   conversation ID.
3. Build a bounded active-conversation context and refresh its summary when
   required and allowed.
4. Optionally retrieve source-labelled past-conversation excerpts.
5. Decide and optionally perform web search.
6. Optionally run Uber Mode private contributions and review rounds.
7. Stream the final local or hosted response through the context-leak guard.
8. Queue complete paragraphs or the completed answer for optional speech.
9. Persist the final assistant response, route metadata, usage, and turn
   receipt through callbacks.
10. Record terminal state and clean temporary captured audio.

The detailed orchestration and callback flow live in [`DESIGN.md`](./DESIGN.md).

## Cancellation and Terminal State

The abort signal is checked after every asynchronous stage and propagated to
network, local inference, deliberation, and speech preparation. Once aborted,
no later stage may publish a response or mutate conversation state.

Exactly one terminal run event is recorded: complete, failed, or aborted.
Cleanup always runs.

**Decision:** Audio is retained after a non-aborted transcription failure or
empty transcription so recovery remains possible. Otherwise temporary capture
is deleted.

## Context Rules

Active-conversation compaction starts when estimated content exceeds 2,400
tokens or an existing summary is active. The recent window targets 1,400 tokens
while retaining at least six and at most ten messages when available.

Local LLM turns skip summary generation because it would require another hosted
request and break the offline contract. They may use an existing summary and
local past-conversation retrieval.

Historical knowledge excludes the current conversation, explicit family IDs,
and private conversations. It is kept separate from the current-session
summary.

## Optional Web Search

Search is a decision stage, not an automatic property of a response-mode label.
The heuristic receives mode, readiness, language, current query, and recent
messages. When search is requested but the provider fails, the response may
continue without search and records the fallback in the receipt.

## Uber Mode

Uber Mode runs independent initial contributions, then immutable shared review
snapshots. A review round converges only when every active participant returns
the explicit converged marker; a challenge, missing marker, or failed call keeps
the configured review depth.

Each private participant has a ten-minute absolute deadline. Terminally failed
participants are retired from later rounds; successful participants continue.
The final synthesis retains every participant's latest successful position and
as much earlier reasoning as fits the 24,000-token estimate.

**Decision:** The round barrier is deliberate. Every reviewer sees the same
snapshot, preventing completion order from changing the deliberation.

## Response and Speech

The final response uses either `streamLocalChat` or hosted `streamChat`. Stream
chunks update the transcript only after the context-leak guard accepts them.

When playback is streaming, complete paragraphs enter the TTS queue as they
arrive. Provider/local synthesis prefetches with bounded concurrency while an
output chain preserves paragraph order. “Wait” playback emits synthesized
results only after response completion. Visual Markdown is deterministically
rendered into listenable speech before sentence chunking.

Fallback routes are normalized from the user's explicit policy. A failed
primary route may move only through that order, and diagnostics retain every
attempt.

## Turn Receipt

Every completed assistant turn records:

- input source and actual STT model;
- requested and actual response route, effort, gateway, upstream, and attempts;
- summary reuse/update/fallback and message counts;
- past-knowledge request/use/source count;
- web-search decision, provider, model, use, and fallback;
- requested and actual TTS route plus fallback attempts; and
- phase and total timings.

This receipt is the user-facing audit boundary and the basis for runtime
diagnosis without logging conversation content.

## Evidence

- [`../voicePipeline.ts`](../voicePipeline.ts)
- [`types.ts`](./types.ts)
- [`context.ts`](./context.ts)
- [`response.ts`](./response.ts)
- [`ttsQueue.ts`](./ttsQueue.ts)
- [`../../../__tests__/services/voicePipeline.test.ts`](../../../__tests__/services/voicePipeline.test.ts)
