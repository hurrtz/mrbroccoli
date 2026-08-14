---
status: active
code_paths:
  - src/services/**
dependencies:
  - src/constants/
  - src/hooks/
  - android/
  - ios/
validations:
  - npm run typecheck:app
  - npm test -- --runInBand --watchman=false __tests__/services
provenance:
  intent: history-backfilled
  validation: source-and-test-backed
last_validated_sha: 7db5c94
---

# Service Layer Specification

## Ownership

`src/services/` owns runtime work that is independent of a particular React
render: provider requests, local inference, voice-turn orchestration, speech,
web search, persistence formats, backups, diagnostics, native bridges, runtime
resilience, and on-device capability management.

Services may emit typed results, events, or errors. They must not own screen
navigation or render UI.

## Service Families

### Intelligence and provider integration

- `llm.ts` and `llm/` route hosted text generation and internal model tasks.
- `localLlm.ts` runs downloaded local response models.
- `webSearch.ts` and `webSearch/` decide provider requests and normalize cited
  search context.
- `providerResilience.ts`, `providerModelCandidates.ts`, and
  `providerErrors.ts` classify failures and execute bounded retry/fallback.
- `runtimeCapabilityOverrides.ts` persists only provider-confirmed exact
  incompatibilities.
- `ulraMode.ts` implements private Model Council deliberation before final
  synthesis.

### Speech and voice turns

- `voicePipeline.ts` and `voicePipeline/` coordinate the complete turn.
- `whisper.ts` and `whisper/` route provider STT; native and downloaded STT
  adapters are separate.
- `tts.ts` and `tts/` route provider TTS and speech chunking; Kokoro, local
  Piper, and native speech use their own adapters.
- `providerVoiceDirectory.ts` plus provider-specific directory services load
  account-visible voices without making directory permission a prerequisite
  for TTS.
- audio queue, waveform, Live Activity/notification, background-turn, and
  remote-control services isolate native modules from React components.

Android microphone capture crosses that bridge as mono 16 kHz PCM WAV. The
downloaded Sherpa file recognizer requires a wave-readable input, so the native
recorder must not return AAC data under either an M4A or WAV name. Provider STT
receives the same valid capture through the shared pipeline.

### Local capability catalogue

`localDeviceCapabilities.ts`, `localModelManager.ts`,
`localModelPerformance.ts`, `offlineProfile.ts`, and
`offlineProfileManager.ts` jointly own local model eligibility and Free setup.

**Decision:** Selection is evidence-first:

1. hard-filter definite platform, architecture, OS, language, memory, storage,
   and runtime incompatibilities;
2. download the exact pinned artifact and verify its SHA-256;
3. load and benchmark that artifact on the current device; and
4. assemble a coherent complete profile.

Preparation never blocks on transient device pressure; the OS owns thermal and
power management. **Decision:** pressure (low power mode, low memory, serious
thermal state) is captured with each benchmark, and a non-viable verdict
measured under pressure is reported to the user but never persisted, so a
throttled or battery-saver run cannot durably label this device too slow. The
earlier design paused preparation in a cooling loop instead, which left setup
permanently stuck whenever battery saver was enabled. A below-target benchmark
is distinct from a failed model and may remain available as an advanced
override.

Local LLM contexts use Metal Flash Attention with quantized KV caches on iOS.
The Android route is CPU-only and uses F16 KV caches: llama.cpp requires Flash
Attention for a quantized V cache and otherwise rejects the context before the
first token can be generated.

Local prompts omit the hosted-route provenance-marker instruction because the
local history path carries plain visible message content. Echoed marker-shaped
output is stripped from both the stream and completed reply as a defensive
boundary; it must never become the visible assistant answer.

Kokoro's Android TTS callback crosses a JNI signature boundary that expects a
boxed `Integer`. The Release R8 rules retain the wrapper's anonymous callback
classes so optimization cannot rewrite the `invoke(FloatArray)` method and
abort ART during local speech generation.

**Decision:** One-tap Android setup does not select Kokoro automatically. A
compact Piper voice is used when the language has one, otherwise setup keeps
the phone's language-aware system voice. Kokoro remains an explicit advanced
choice on Android and the quality-first automatic choice on iOS. This is a
platform selection policy, not a runtime prohibition: explicit Kokoro remains
supported on Android.

Kokoro and Piper/VITS synthesis use Sherpa's streaming engine even though the
service still returns one completed WAV. Sherpa's one-shot entry point runs
neural generation on the calling thread; the streaming entry point dispatches
the same work on both native platforms, keeps React responsive, and provides a
real cancellation boundary. Abort signals cancel an active TTS stream and no
cancelled benchmark may persist a verdict. Sherpa file STT has no matching
native cancel API, so its abort contract is cooperative before and after the
single file-transcription call; orchestration discards the result and stops
before any later model step.

Installed models and benchmark state are device-local, excluded from backup,
and invalidated by catalogue, artifact, runtime, OS, app, or relevant device
changes. Updating any checked-in artifact pin increments the catalogue version,
so a previous artifact can never retain a benchmark verdict after replacement.

### Conversation context and knowledge

- `conversationContext.ts` owns rolling-summary thresholds and the bounded
  recent-message window.
- `conversationKnowledge/` owns optional derived cross-session retrieval.
- `turnReceipt.ts` records route, context, search, speech, and timing decisions.
- `messageProvenance.ts` makes actual response origin part of retained context.

The active conversation is canonical. Summary and knowledge layers are bounded
context aids and must never silently replace or mutate the source transcript.

### Images

Image attachments are copied into app-owned document storage, resized to a
bounded edge, limited by count and byte size, and persisted by stable ID.
Provider request preparation resolves the current container path and loads
bytes only after route capability and consent checks.

Each attachment records `sharedWithProviders`. A new provider recipient requires
fresh disclosure; prior consent to one provider is not consent to another.

### Backup and archives

`appDataBackup.ts` is the full-fidelity portability format. Version 2 embeds
image bytes and replaces device paths with
`mrbroccoli-backup://image/<attachment-id>` references. It supports readable
JSON and passphrase-encrypted AES-256-GCM with bounded input size and a minimum
passphrase length.

Portable settings exclude `apiKeys` and provider-validation diagnostics.
Backups exclude downloaded models, audio, derived knowledge/index data, debug
logs, and caches. Restore validates the complete shape before mutation and
delegates non-destructive conversation merging to the conversation hook.

### Phonemization runtime

The shipped sherpa-onnx runtime is built without eSpeak NG (GPL-3.0);
Kokoro and Piper text-to-phoneme conversion resolves through libphonemize
(Apache-2.0). `scripts/install-espeak-free-runtime.mjs` installs the
verified prebuilts into the wrapper and re-checks every binary for eSpeak
markers before writing.

**Decision:** The espeak-free runtime is a build-time prerequisite, not an
optional local convenience. `node_modules` is untracked, so a plain install
restores the upstream espeak-linked prebuilts; a postinstall hook reinstalls
the espeak-free libraries whenever the fork checkout is present, and
`make espeak-free-verify` fails the release gate when the libraries a build
would ship still carry eSpeak markers.

**Decision:** Language packs are curated artifacts with the same integrity
contract as the local model catalogue — pinned source, exact size, SHA-256
verified before extraction, installed beside the speech model's data
directory. A missing pack yields no phonemes and the turn falls back to
system speech; the runtime never guesses pronunciations.

Kokoro and every Piper VITS download install and verify the required language
pack in their own `espeak-ng-data` directory before the model is reported
verified. A model archive alone is not a usable Piper installation; this check
prevents an iPhone from selecting a voice that cannot phonemize.

The runtime registry is used to discover a matching model and archive shape,
but the checked-in URL, size, and digest remain the installation authority. If
the registry's release-wide checksum lags a reviewed asset, iOS downloads that
exact artifact in the foreground, hashes it before extraction, and writes the
same pinned manifest locally only after native extraction reports success. Any
asset that does not match the checked-in hash or cannot extract still fails
closed.

Pack archives download beside the live data directory and extract into a
temporary sibling directory. The sherpa extractor may replace its target, so
only the verified pack entry is moved into the live directory after extraction.
This preserves already-installed companion packs and prevents an extractor
from deleting its own source archive. On iOS, small language packs use the
foreground download session so an interrupted background session cannot leave a
speech model apparently installed without its pronunciation data.

On iOS, standard tar archives can contain no-op root records with an empty
path, `.`, or `./`; the native extractor skips only those forms. Every
data-bearing entry must be a relative regular file or directory without parent
traversal, symbolic links, or hard links. The helper rejects unsafe
archive-relative paths before rewriting accepted entries under its absolute
target, while libarchive's symlink protection applies while writing. Unsafe
paths therefore fail closed without rejecting valid language-pack archives
through string-prefix path handling or incompatible archive-writer flags.
The native data-write result uses libarchive status semantics: `ARCHIVE_OK`
(zero) means a successful block and must not be compared with the requested
payload size. This keeps a verified non-empty Kokoro or Piper file from being
rejected at its first payload block.
The native helper resolves the already-created output directory before
composing entry paths. This canonicalizes iOS's system `/var` container alias
for libarchive's secure symlink checks while preserving the rejection of links
and traversal supplied by an archive.

Kokoro's data directory keeps its historical `espeak-ng-data` name because
both the model archive and sherpa's detector rely on it, but this runtime
fills it with libphonemize packs. The espeak-free native configuration accepts
that pack-only layout; upstream eSpeak configurations retain their upstream
table checks. A directory holding no pack is still invalid: installation fails
before the model is marked ready, and synthesis names the missing packs rather
than offering an eSpeak requirement this runtime can never satisfy.

**Decision:** Export never claims silent completeness. Conversations whose
stored body cannot be read are counted and surfaced to the user instead of
being dropped from the backup without a trace.

`conversationArchive.ts` is a separate readable AI handoff. It writes an index,
per-conversation Markdown, and a latest pointer in an app-owned archive
directory. It is not a lossless restore format and does not include hidden
context, keys, or internal prompts.

**Decision:** Recovery and AI handoff have separate formats because a
human-readable archive should not be mistaken for a complete restorable backup.

### Diagnostics

Debug capture is bounded by time, entries, bytes, and retained file count.
Payloads are sanitized before in-memory retention and again before persistence
or clipboard export. Sensitive key names, credential-like strings, user text,
and non-app stack frames are removed or fingerprinted.

**Decision:** A useful diagnostic describes control flow and state transition,
not payload content. Adding a new debug field requires an adversarial redaction
test when it could contain user or provider data.

### Premium and test fixtures

`premiumEntitlement.ts` caches only an exact verified non-consumable ownership
record. `developmentEntitlement.ts` permits simulation only under `.dev` and
`.maestro` runtime identities. Store-promo fixtures are deterministic,
localized, network-free, and independently restricted to `.maestro`. Their
optional voice-orb presentation state is validated and stored separately from
runtime voice state; production phase and progress remain pipeline-derived.

## Failure Rules

- Aborted work must stop downstream stages and avoid late state mutation.
- Timeouts are bounded and classified at the service that owns the external or
  native operation.
- A fallback must be explicit in policy and visible in diagnostics/receipts.
- Persistence and backup failures must not delete the source data.
- Temporary provider failure must not become a durable capability override.
- Network-bound features must never be presented as fully local.

## Deep Specs

- [`voicePipeline/SPEC.md`](./voicePipeline/SPEC.md)
- [`voicePipeline/DESIGN.md`](./voicePipeline/DESIGN.md)
- [`llm/SPEC.md`](./llm/SPEC.md)
- [`conversationKnowledge/SPEC.md`](./conversationKnowledge/SPEC.md)

Speech details remain in focused operational references and tests until their
directories warrant separate living designs:

- [`../../docs/provider-runtime-reference.md`](../../docs/provider-runtime-reference.md)
- [`../../docs/local-ai-options.md`](../../docs/local-ai-options.md)
- [`../../docs/debug-logging.md`](../../docs/debug-logging.md)
