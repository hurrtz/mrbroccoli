---
status: active
code_paths:
  - app/**
  - src/**
  - android/**
  - ios/**
dependencies:
  - Apple App Store and StoreKit
  - Google Play and Play Billing
  - user-selected AI providers
validations:
  - make pre-push
  - make pre-release-static
provenance:
  intent: owner-confirmed and history-backfilled
  validation: source-and-test-backed
last_validated_sha: 7db5c94
---

# Mr Broccoli Specification

## Purpose

Mr Broccoli is a voice-first mobile workspace for deliberate AI conversations.
It lets a person speak naturally, route each turn to suitable local or hosted
intelligence, and receive a clear, listenable answer while retaining control
over models, credentials, data, cost, and memory.

**Decision:** Depth is preferred over artificial immediacy. The product may wait
for a stronger answer, but it must make long work understandable through stable
phases, progress, streaming, interruption, and useful diagnostics. Adding a
faster but weaker provider merely to reduce perceived latency is not a product
goal.

## Product Boundary

The app owns:

- voice and text turn capture;
- configurable response routes and reasoning effort;
- optional web grounding;
- local, system, and provider speech routes;
- conversation history, branches, summaries, provenance, and optional
  cross-session retrieval;
- deterministic on-device model selection, download, verification, and
  benchmarking;
- readable and encrypted backup, non-destructive restore, and portable AI
  conversation archives;
- a permanent Free/Premium edition boundary; and
- release-grade accessibility, localization, diagnostics, and native lifecycle
  behavior on Android and universal iOS across iPhone and iPad.

The core product has no Mr Broccoli application backend, account system,
provider proxy, or server-side conversation store. Provider calls go from the
device to the selected provider using credentials supplied by the user.

## Editions

### Free

Free mode provides a complete local conversation chain without a provider
account. Setup selects a single conversation language, evaluates the current
device, downloads only the required curated artifacts after consent, verifies
their hashes, benchmarks them, and applies a compatible local LLM/STT/TTS
profile. A system speech route may replace a downloaded speech model when the
device proves it suitable.

**Decision:** Free is an operational profile, not a collection of UI flags. Its
effective settings are derived as a coherent route set so a stale Premium
setting cannot leak a network capability into Free execution.

### Premium

Premium is a permanent, non-consumable, same-platform store entitlement with
product ID `com.tobiaswinkler.app.mrbroccoli.premium.lifetime`. It unlocks user
provider connections, provider response modes, web search, image prompts,
Drive Session, Model Council, past-conversation knowledge, portable conversation
archives, and advanced response controls.

**Decision:** The entitlement remains serverless. Apple or Google is the
ownership authority; a locally cached verified entitlement makes startup and
offline use practical, then store reconciliation corrects it when available.
Cross-platform ownership would require a backend and is outside the current
boundary.

## Main Capabilities

### Conversation

- Voice, text, and image-assisted turns share one conversation model.
- A response mode is a stable user-facing slot whose route selects a provider
  model or a local model and, where supported, a reasoning-effort option.
- Thinking exposes at most four coexisting response-mode slots so their order
  remains a legible home-screen choice across native layouts.
- Changing response modes inside a conversation preserves the conversation
  context; each assistant message records the route that actually answered.
- Length, tone, model instructions, speech instructions, and voice are global
  defaults. A session may persist its own overrides without changing those
  defaults, and clearing the overrides makes it inherit them again.
- Long threads use a rolling summary plus a bounded recent window instead of
  sending the complete transcript indefinitely.
- Editing a user prompt changes that conversation and clears its stale compact
  summary. Continuing from an earlier checkpoint creates a branch rather than
  destroying the later original history.

### Voice

- Input supports push-to-talk, toggle-to-talk, and Drive Session.
- Speech recognition may use the system recognizer, a downloaded local model,
  or a capability-gated provider route.
- Spoken replies may use system speech, downloaded Kokoro/Piper speech, or a
  capability-gated provider route.
- Speaking Settings always keeps one speech route selected. Stored installs
  from the retired text-only toggle migrate back to enabled spoken replies;
  the transcript remains available independently of that voice route.
- On iOS, native local-speech extraction accepts only empty, `.` or `./`
  archive-root records. Every data-bearing entry must be a relative regular
  file or directory with no traversal or links; direct validation runs before
  the helper rewrites accepted entries beneath its absolute destination, and
  libarchive's symlink protection applies while writing. Archive data writes
  use libarchive status semantics: `ARCHIVE_OK` (zero) is success and must not
  be compared with the requested payload size. The already-created destination
  is resolved before entry paths are composed so iOS's `/var` container alias
  is not mistaken for an archive-controlled symlink.
- The licence-safe local-speech runtime uses libphonemize language packs in
  the models' historical `espeak-ng-data` directory; it does not ship eSpeak
  NG data. Its iOS wrapper must treat a failed native TTS-engine creation as a
  recoverable JavaScript error, including when the wrapper object exists but
  its underlying engine handle is null.
- TTS fallback routes are explicit, ordered, and opt-in. The runtime may honor
  a previously persisted policy, but current Settings does not expose a
  fallback editor, and System speech has no hidden fallback.
- Drive Session re-arms capture only through its explicit session state and is
  designed for hands-free use, interruption, background continuation, and
  native remote controls.

### Intelligence

- Eight hosted LLM-capable routes are supported: OpenAI, OpenRouter,
  Anthropic, Google Gemini, xAI, Mistral, DeepSeek, and Alibaba Qwen. ElevenLabs
  is an additional speech-only provider.
- Curated local Qwen models are normal response routes, not disguised hosted
  providers.
- Model Council runs independent model contributions, adversarial review
  rounds, and final synthesis. Its internal `ulra` identifiers are retained
  for data and import stability.

  **Decision:** The English feature name is “Model Council.” The previous
  “Uber Mode” name collided with a well-known third-party trademark and was
  retired from all user-facing copy before store submission; other locales
  keep their established localized names (for example “Übermodus,”
  “Superrežim”).

- Optional past-conversation knowledge retrieves small, source-linked excerpts
  from other eligible conversations on device.

## Stable Product Invariants

### Privacy and ownership

- Provider API keys are secrets and must remain in platform secure storage.
  They must never enter AsyncStorage, backups, diagnostics, fixture data, or a
  distributable bundle.
- Canonical conversations and public settings stay on the device.
- A locked session requires its password or enrolled device authentication
  before its full record can enter the active workspace. Authorization lasts
  only for the current foreground visit; launch and app backgrounding clear it.
  Locked sessions are also excluded from full-text search and cross-session
  knowledge. The lock is local access control, not conversation-database
  encryption, and the UI must say so.
- Retrieved historical text, web results, image content, and other external
  context are untrusted data, never instructions.
- Debug output must exclude credentials and user-authored prompts,
  transcripts, titles, searches, summaries, instructions, and message content.
- Backups may contain portable public settings and complete conversations, but
  never API keys, validation diagnostics, debug logs, downloaded models, audio,
  derived indexes, lock credentials, or caches. A locked conversation requires
  foreground authorization before export and is restored without its
  device-local lock.

### Transparency and control

- The app records requested and actual model routes, fallbacks, context work,
  web-search decisions, speech routes, and timings in per-turn receipts.
- Runtime provider failure may cause bounded retry or fallback, but durable
  capability removal requires an explicit provider response tied to that exact
  model or effort. Authentication, credit, quota, rate limit, capacity,
  network, timeout, generic 404, and server failures do not prove permanent
  incompatibility.
- Image attachments are sent only after route capability checks and explicit
  per-provider disclosure; each attachment records which providers received it.
- Usage is reported in tokens. The app does not present stale model-price
  estimates as user spend.
- Every assistant response offers an in-app report action (a Google Play
  generative-AI policy requirement). The report travels through the system
  share sheet so the user chooses the channel and sees exactly what leaves
  the device.

### Local models

- Model artifacts are curated and pinned by version, source, checksum, size,
  languages, runtime requirements, and license. Arbitrary model URLs are not a
  supported installation path.
- Models download only after opt-in and are never bundled in the initial app or
  portable backups.
- Hard incompatibility and measured performance are separate. Definite
  platform, architecture, language, storage, load, memory-pressure, or output
  failures block use; below-target but functional performance may be exposed as
  an informed override.
- Benchmark and install health are device-local operational state and are
  invalidated when the artifact, runtime, OS, app, or relevant device snapshot
  changes.

### Product and interface

- The exact product spelling is “Mr Broccoli,” never “Mr. Broccoli”; the period
  creates an unwanted pause in spoken output.
- All registered interface languages are first-class. User-visible strings
  must exist in every locale dictionary, including correct RTL behavior for
  Arabic and Urdu.
- Mr Broccoli refers to himself in the first person. Every interface locale
  addresses the reader in its natural informal singular register and uses its
  own idiom and sentence punctuation rather than preserving English structure.
- Interactive controls have at least a 44-by-44-point target, modals isolate
  screen-reader focus, and dynamic announcements are rate-limited to meaningful
  state changes.
- The three-step introduction uses one full-width 48-point bottom action on
  every page. Welcome is a fixed, non-scrolling canvas; Setup and Try scroll
  within the pager while the action remains fixed. Its close action is always
  available, including before setup, and closing without completion leaves the
  invitation available. The welcome preview is five
  prompt-and-response exchanges whose final localized prompt matches the
  bundled spoken answer; earlier exchanges recede beneath an eased
  canvas-coloured veil sized as a share of the page, and the final response
  explains the play hand-off. The veil must reach the canvas completely at the
  heading, so the oldest exchange dissolves rather than lingering as a ghost,
  and must behave identically without native view dependencies on Android,
  iPhone, and iPad in both colour schemes. **Decision:** the veil is the only
  mechanism that fades those exchanges. Blur is additive softness applied only
  where the platform resolves it, so the effect degrades to the veil alone
  rather than to a visibly different screen.
- **Decision:** iPad is an adaptive form factor of the same iOS product, not a
  separate app. Compact iPad windows reuse the phone interface exactly; regular
  windows expose persistent navigation and wider information layouts while
  preserving the active conversation and configured routes through rotation,
  Split View, and Stage Manager resizing.
- The same production identifiers remain
  `com.tobiaswinkler.app.mrbroccoli`; `.dev` and `.maestro` identities are
  isolated test installations and must not weaken production entitlement or
  fixture boundaries.

## Core Terms

- **Response mode** — a named slot in `settings.responseModes` containing one
  local or provider response route. `activeResponseMode` selects the home route.
- **Voice turn** — the abortable pipeline from captured audio or text through
  context, optional search/deliberation, response generation, and optional
  speech playback.
- **Drive Session** — an opt-in stateful voice mode that automatically re-arms
  listening after a completed reply when it remains engaged.
- **Model Council** — a Premium multi-model deliberation protocol with independent
  positions, shared immutable review snapshots, explicit convergence, bounded
  participant calls, and evidence-led synthesis.
- **Conversation summary** — a compact, editable representation of older turns
  used only inside its conversation.
- **Past-conversation knowledge** — an optional derived on-device index used to
  retrieve source-linked excerpts from other eligible conversations. Locked
  sessions and the active branch family remain ineligible.
- **Conversation branch** — a copied checkpoint with new message IDs and an
  explicit root/parent origin, allowing alternative continuations without
  mutating the original path.
- **App-data backup** — complete portable state for migration or recovery,
  available as readable JSON or passphrase-encrypted AES-256-GCM.
- **Conversation archive** — a readable AI handoff representation maintained
  separately from the full-fidelity app-data backup.

## External Dependencies

- **Dependency:** Apple App Store / StoreKit and Google Play / Play Billing own
  Premium product availability, purchase, and same-platform restoration.
- **Dependency:** Hosted provider behavior, model availability, account voices,
  quota, and terms can change independently of this repository. Runtime
  manifests and release validation must be rechecked before distribution.
- **Dependency:** Native system speech support depends on installed operating
  system languages, voices, recognizers, and device policy.
- **Dependency:** On-device artifacts remain usable only while their source,
  checksum, runtime compatibility, and distribution license remain valid.

## Deliberate Non-Goals

- Shipping provider credentials or managed shared credentials.
- Uploading conversations to a Mr Broccoli cloud service.
- Silent cross-provider or speech fallback.
- Treating model catalogues as uncurated dumps of provider inventory.
- Claiming that network web retrieval is offline merely because local models
  plan or summarize it.
- Automatically executing external tools, messages, purchases, or mutations.

## Permanent Subtree Specs

- [`app/SPEC.md`](./app/SPEC.md) — Expo Router entry and isolated promo route.
- [`src/SPEC.md`](./src/SPEC.md) — source-tree ownership map.
- [`src/context/SPEC.md`](./src/context/SPEC.md) — settings and Premium contexts.
- [`src/hooks/settings/SPEC.md`](./src/hooks/settings/SPEC.md) — settings storage,
  migration, and mutation rules.
- [`src/hooks/conversations/SPEC.md`](./src/hooks/conversations/SPEC.md) —
  conversation persistence, branching, and restore rules.
- [`src/screens/main/SPEC.md`](./src/screens/main/SPEC.md) — conversation workspace
  behavior.
- [`src/features/settings/SPEC.md`](./src/features/settings/SPEC.md) — settings
  information architecture and edition gating.
- [`src/constants/providers/SPEC.md`](./src/constants/providers/SPEC.md) — hosted
  provider and model manifest policy.
- [`src/services/SPEC.md`](./src/services/SPEC.md) — service boundaries, local
  models, backups, diagnostics, and integrations.
- [`src/services/voicePipeline/SPEC.md`](./src/services/voicePipeline/SPEC.md) —
  voice-turn contract.
- [`src/services/llm/SPEC.md`](./src/services/llm/SPEC.md) — LLM routing and prompt
  safety.
- [`src/services/conversationKnowledge/SPEC.md`](./src/services/conversationKnowledge/SPEC.md)
  — local cross-session retrieval and source eligibility.
- [`src/i18n/SPEC.md`](./src/i18n/SPEC.md) — locale and translation contract.
- [`src/design-system/SPEC.md`](./src/design-system/SPEC.md) — native control and
  icon rules.
- [`scripts/SPEC.md`](./scripts/SPEC.md) — validation, release, and promotion
  automation.
- [`android/SPEC.md`](./android/SPEC.md) and [`ios/SPEC.md`](./ios/SPEC.md) —
  platform-specific native responsibilities.

Operational setup remains in [`README.md`](./README.md); release history remains
in [`CHANGELOG.md`](./CHANGELOG.md). Neither replaces this specification.
