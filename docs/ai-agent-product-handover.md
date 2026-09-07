# Mr Broccoli — Product Handover for an AI Agent

- Snapshot: 2026-09-07
- Repository version: 4.1.0, including product intent represented by the
  current living specifications and the Unreleased work in progress

## Why This Document Exists

This is a self-contained product handover for an AI agent that cannot inspect
the Mr Broccoli repository. It explains what the product is, why it exists,
what it currently does, what it deliberately does not do, and which principles
should guide future product, design, copy, or engineering decisions.

This is a product and intent brief, not a substitute for source-level evidence.
If a later task depends on an exact model ID, provider contract, store rule,
runtime behavior, or release state, verify that time-sensitive detail before
making a claim or decision.

## The Short Version

Mr Broccoli is a paid-upfront, voice-first mobile workspace for deliberate AI
conversations on iPhone, iPad, and Android. People bring their own API keys,
choose exactly which hosted model answers, and can speak to the app and listen
to the response.

The central product thesis is **depth over artificial immediacy**. Mr Broccoli
exists because mainstream voice assistants often optimize for an instant,
fluid reply at the expense of reasoning depth. This product accepts that a
stronger answer may take longer, then makes that wait understandable and
controllable through clear phases, progress, streaming, interruption, and
diagnostics.

The product is voice-first, not voice-only. Text, images, transcripts, web
grounding, conversation history, branching, and multi-model deliberation all
support the same goal: thoughtful answers that work well when heard aloud.

## Product Promise

> Speak naturally to a deliberately chosen model, let it think as deeply as
> the question deserves, and receive a clear, listenable answer without giving
> up control over providers, credentials, data, cost, or memory.

The desired feeling is calm and intentional. The main workspace should feel
simple enough to start a conversation immediately, while advanced controls
remain available when the person wants them.

## Who It Is For

The primary audience is someone who already has, or is comfortable obtaining,
accounts and API keys from AI providers. They value some combination of:

- stronger answers over the fastest possible response;
- natural spoken interaction, especially while their hands or eyes are busy;
- precise provider, model, and reasoning-effort control;
- local ownership of conversations and credentials;
- transparency about which service received data and which route answered;
- advanced capabilities without a required Mr Broccoli account or cloud.

This is not positioned as a bundled, all-inclusive AI subscription for people
who expect credits or hosted inference to come with the app purchase.

## The Problem It Solves

Most voice assistants hide the machinery and optimize the interaction around
speed. That creates several problems for deliberate work:

- the answer may be shallow because the system prioritizes conversational
  immediacy;
- the user may not know which model answered or whether a fallback occurred;
- model, voice, search, and context choices are often bundled together;
- conversation history may be trapped in a provider account;
- privacy claims can obscure which hosted service actually received a request;
- long waits, failures, and partial degradation are poorly explained.

Mr Broccoli addresses those problems by separating the response model, speech
input, speech output, web search, and memory layers; keeping their choices
visible; and retaining a durable local transcript and audit trail.

## Business and Distribution Model

Mr Broccoli is one paid app sold up front through the platform stores.

- The purchase grants access to the complete app.
- There is no subscription, free edition, premium edition, in-app purchase,
  entitlement check, trial, or upgrade surface.
- The app includes no hosted AI usage or credits.
- Users supply their own provider API keys and providers bill them directly.
- There is no Mr Broccoli account, application backend, provider proxy, or
  server-side conversation store.
- A purchase on one store does not unlock the other platform because there is
  no cross-store account system.

First launch opens the real workspace immediately. If the selected answering
route has no usable credential, the attempted action directs the person to
Connections. There is no onboarding funnel or completion gate in front of the
product.

## The Core Experience

1. The person opens the conversation workspace.
2. They configure one or more provider keys in Connections.
3. They create answering routes that pair a provider with an exact model and,
   where supported, a reasoning effort.
4. They speak, type, or attach images. They may also enable web grounding,
   Model Council, or Hands free for the next interaction.
5. Mr Broccoli captures an immutable snapshot of that turn's route and policy,
   prepares bounded conversation context, optionally recalls earlier sessions
   or searches the web, and asks the chosen hosted model to answer.
6. The reply streams into the transcript and can be spoken as it becomes
   ready. The person can pause, resume, restart, skip by paragraph, or stop.
7. The completed answer remains in the local conversation with provenance,
   source information, route details, usage, and timing.

Changing a setting during a long-running turn changes the next turn, not the
one already in progress. This prevents the UI from silently changing the
meaning of an active request.

## Current Feature Set

### 1. Voice-first conversation workspace

- One primary workspace centers a large voice orb rather than a conventional
  message composer.
- The orb communicates idle, recording, transcription, searching, thinking,
  synthesis, and speaking states.
- Its progress ring represents the recording window, then the complete wait
  from submission to first speech, then the read position through the reply.
- Long work remains interruptible. Stop is available throughout the turn;
  playback can be paused, resumed, restarted, or moved by paragraph.
- A voice/text pager keeps typing immediately available without making text the
  dominant interface.
- Image, Council, Web, and Hands free controls stay in stable positions so the
  workspace does not rearrange itself between phases.
- The transcript is the durable record. Temporary streamed text is not treated
  as saved history until the response completes.

### 2. Voice input

- Push-to-talk: hold while speaking and release to submit.
- Toggle-to-talk: tap once to start and again to finish.
- Hands free: a session-scoped loop layered over either manual input mode. It
  detects speech, waits through silence with visible and audible countdown
  cues, submits, plays the answer, and re-arms listening.
- Hands free starts disabled for every app session and is never silently
  persisted as the user's input mode.
- Speech recognition can use the operating system recognizer, a verified
  downloaded local model, or a configured provider route.
- Long dictation preserves multiple finalized recognition segments in order
  instead of keeping only the final sentence.
- Provider transcription failures retain non-aborted captured audio when that
  can help recovery; successful and intentionally aborted turns clean it up.

### 3. Spoken replies

- Every conversation has an active speech route; the readable transcript is
  always available independently.
- Speech can use a system voice, an optional downloaded local voice, or a
  configured provider route.
- Optional local voices include curated Kokoro and language-specific Piper
  artifacts. They are downloaded only after opt-in, checksum-verified, and
  benchmarked on the actual device before selection.
- Provider voices may be loaded from the user's account when the provider
  exposes a voice directory.
- Visual Markdown is converted into listenable speech before chunking.
- Streaming playback can begin when complete paragraphs are ready. A separate
  wait policy can hold non-system synthesis until the full answer is complete.
- Playback preserves paragraph boundaries so Back and Forward are meaningful,
  and the progress ring is weighted by the amount of spoken content.
- Voice identity must not change silently. There is no hidden fallback from a
  chosen voice route. Older explicitly saved fallback policies may still be
  honored and are recorded in the turn receipt.

### 4. Answering routes and providers

An answering route is a user-configured slot containing a hosted provider,
exact model, and supported reasoning effort. The list is ordered and open-ended
rather than capped at a small fixed number.

The current runtime supports eight LLM-capable provider routes:

- OpenAI
- OpenRouter
- Anthropic
- Google Gemini
- xAI
- Mistral
- DeepSeek
- Alibaba Qwen through DashScope

ElevenLabs is an additional speech-only provider.

Provider keys, model access, search, speech, and voice-directory permission are
validated as independent capabilities. A key can legitimately work for one
capability and fail another.

User-facing model lists are curated executable routes, not raw provider
catalogues. A model should appear only if the app supports its actual endpoint
and request shape. Stable model snapshots are preferred over rolling aliases
when both identify the same model.

Temporary authentication, quota, credit, rate-limit, capacity, network,
timeout, generic 404, or server failures do not permanently remove a route.
Only explicit provider evidence that a precise model or effort is unsupported
may create a device-local compatibility override.

### 5. Conversation controls

Global defaults cover:

- answer length;
- response tone;
- model instructions;
- speech-delivery instructions; and
- voice.

A conversation can save its own overrides without changing the global
defaults. Clearing those overrides returns it to the current defaults, so later
global changes continue to flow into that conversation.

The route can change inside a conversation without losing its context. Each
assistant message records the route that actually answered, not merely the
route selected before the request.

### 6. Web grounding and images

- Web Search is a separate, explicit choice rather than an automatic property
  of a model or a route name.
- Search-capable provider routes can add current web context and sources before
  the main response.
- If search fails, the answer may continue without it, but the degraded result
  is recorded on that reply.
- Images can be added from the camera or photo library and sent only to models
  that support them.
- A new provider recipient requires disclosure before an attachment is shared;
  consent to one provider is not consent to another.
- Web results and image content are treated as untrusted data, never as
  instructions to the application.

### 7. Model Council

Model Council is the deeper multi-model deliberation feature. The compact home
control is labelled **Council**, while the full feature name is **Model
Council**.

- At least two ready answering routes are required.
- Models first produce independent positions.
- Optional review rounds let each active model challenge the same immutable
  snapshot of the other positions.
- Participants run sequentially in configured order, making the displayed
  active model and provider-call arithmetic truthful.
- Explicit unanimous convergence may end unused review rounds early.
- Terminally failed participants are retired from later rounds; successful
  participants can continue.
- A final route synthesizes an evidence-led answer while retaining each
  participant's latest successful position.
- Calls are bounded and the visible final synthesis has an independent safety
  ceiling so an unusually long provider response cannot overwhelm the mobile
  UI or speech queue.
- The interface shows current round, active model, settled calls, successes,
  failures, and final synthesis state.

Council deliberately costs more and takes longer because each configured round
can call every active participant. Early convergence and participant retirement
can reduce that work. The UI exposes the planned call count before activation. Deliberation content is shared with every participating
provider, so it is not a private local computation.

### 8. Conversation history and continuity

Conversations are stored in a local SQLite database and support:

- fast metadata loading with lazy full-record hydration;
- search, pinning, archiving, renaming, automatic naming, sharing, and deletion;
- a continuous transcript whose messages can fold and expand;
- editing user prompts;
- removing individual messages and their app-owned attachments;
- automatic rolling summaries for long threads;
- branching from an earlier checkpoint without destroying the original path;
- route and model provenance; and
- per-turn usage and timing receipts.

Long conversations use a compact summary plus a bounded recent-message window
instead of sending the full transcript forever. The canonical transcript
remains the source of truth; summaries and indexes are derived aids.

Conversation branching clones history only through the chosen checkpoint and
gives copied messages and attachments new identities. Branches keep lineage
back to their root while remaining a flat, understandable list in the
conversation browser.

### 9. Session locks

An individual conversation can be locked with a password and, on supported
devices, Face ID or fingerprint.

- Locked content can be opened only after the person authorizes the current
  foreground visit. Locked sessions remain excluded from full-text search and
  past-conversation knowledge even during an authorized visit.
- Launching the app or moving it to the background clears that authorization.
- The password verifier and biometric marker stay in secure device storage.
- This is local application access control, not encryption of the conversation
  database. Product copy must not imply otherwise.
- Lock credentials are not portable. An authorized locked conversation can be
  exported, but it is restored unlocked on another installation.

### 10. Past-conversation knowledge

Past-conversation knowledge is an optional cross-session recall feature.

- Indexing and retrieval happen on the device in a separate derived database.
- Only a few relevant, source-linked excerpts from eligible earlier sessions
  are selected for a request.
- The active conversation, locked sessions, and related branches that would
  duplicate the same shared history are excluded.
- The response can show which earlier sessions supplied context.
- Retrieved excerpts are labelled as untrusted historical data, not
  instructions or verified facts.
- Turning the feature off deletes the derived index.
- When used, the selected excerpts are sent to the chosen hosted model as part
  of that request. Local retrieval does not make the final response local or
  offline.

### 11. Data ownership, backup, and AI handoff

Mr Broccoli keeps full-fidelity recovery separate from readable AI handoff.

App-data backups:

- contain portable public settings and complete conversation records;
- embed app-owned image attachments;
- are available as readable JSON or passphrase-encrypted AES-256-GCM JSON;
- import non-destructively, skipping identical conversations and copying ID
  conflicts rather than overwriting existing data; and
- preserve existing provider keys and unrelated local state.

Backups never contain provider keys, validation diagnostics, debug logs,
downloaded models, captured audio, derived indexes, session-lock credentials,
or caches.

Conversation archives are separate, readable Markdown artifacts intended for
people or another AI agent. They are not lossless restore files and do not
include hidden context, keys, or internal prompts.

### 12. Transparency and diagnostics

Every completed assistant turn can retain a receipt covering:

- input source and actual speech-recognition model;
- requested and actual answering route and effort;
- retries or bounded provider fallbacks;
- conversation-summary and past-knowledge work;
- web-search decision and provider;
- requested and actual speech route and fallback attempts; and
- phase and total timings.

Usage is shown in tokens. Mr Broccoli does not estimate a user's bill from
model price tables that may become stale.

Debug capture is deliberately content-free. It records control flow, safe
identifiers, states, durations, and failure categories while excluding
credentials, prompts, transcripts, titles, searches, summaries, instructions,
message content, and provider response bodies.

Each assistant response includes a report action. Reporting uses the operating
system share sheet so the person chooses the destination and sees what leaves
the device.

### 13. Settings

Settings uses progressive disclosure and has seven primary areas:

1. Connections
2. Thinking
3. Search
4. Listening
5. Speaking
6. Data & privacy
7. App & diagnostics

Connections owns credentials and capability tests. Thinking owns answering
routes and conversation defaults. Search owns web grounding. Listening owns
input mode, languages, and speech recognition. Speaking owns voice playback.
Data & privacy owns knowledge, archives, backups, and storage cleanup. App &
diagnostics owns appearance, usage visibility, diagnostics, and runtime
compatibility overrides.

There is no purchase page, entitlement-dependent setting, standalone device
page, or local response-model setting.

### 14. Languages, accessibility, and adaptive layout

The interface supports 19 locales:

- English, German, Ukrainian, Hindi, Spanish, French, Italian;
- European Portuguese and Brazilian Portuguese;
- Russian, Simplified Chinese, Arabic, Japanese, Hungarian, Czech, Polish,
  Turkish, Swedish, and Urdu.

Arabic and Urdu are right-to-left. Interface language, recognition language,
and spoken-reply language are independent settings.

All interactive controls must have at least a 44-by-44-point target. Modals
isolate screen-reader focus, dynamic announcements are limited to meaningful
state changes, and the release bar includes large text, contrast, reduced
motion, VoiceOver, and TalkBack behavior.

The iOS app is universal. Compact iPad windows reuse the phone experience;
regular layouts add persistent conversation navigation, wider workspace
geometry, optional transcript docking, and master-detail Settings while
preserving the same active conversation and controllers through rotation,
Split View, and Stage Manager resizing.

## Privacy and Trust Model

The most important privacy statement is precise rather than absolute:

- Mr Broccoli has no application server and stores conversations locally.
- Provider API keys stay in operating-system secure storage.
- Hosted requests go directly from the device to the selected provider.
- That provider still receives the prompt, selected context, approved images,
  and any locally retrieved excerpts needed for the request.
- Web grounding is network activity and must never be described as offline.
- Local speech recognition or synthesis does not make hosted response
  generation local.

The product should always explain where data goes at the moment the distinction
matters. It must never trade accuracy for a vague “private AI” claim.

## Product and Design Principles

### Depth over artificial immediacy

Do not add a faster but weaker route merely to make the product feel instant.
Improve the waiting experience with honest progress, streaming, predictable
phases, interruption, and diagnostics.

### Calm surface, expert control

The conversation workspace should remain focused on speaking and listening.
Provider and model machinery belongs in secondary surfaces, but expert control
must remain available rather than being hidden or removed.

### Explicit choices, visible outcomes

The user chooses the response model, speech routes, search, memory, and Council
participation. The transcript and receipt show what actually happened.

### No silent identity changes

A fallback must never quietly change who answered or which voice spoke. Any
bounded fallback that occurs must follow policy and remain visible in retained
metadata.

### Local ownership without misleading claims

Canonical settings and conversations belong to the device. Derived caches can
be deleted and rebuilt. Hosted providers still receive the requests sent to
them, and the UI must say so.

### Graceful degradation

Summary, knowledge, search, or speech failures may allow a readable answer to
continue when safe. Degradation must be attached to the affected reply and
must not fabricate success or hide the actual route.

### Accessibility and localization are product behavior

All registered languages and assistive-technology paths are first-class. They
are not optional polish to add after a feature is otherwise considered done.

## Deliberate Non-goals

Mr Broccoli does not aim to provide:

- bundled or shared provider credentials;
- a Mr Broccoli cloud account or server-side transcript store;
- hosted inference, included credits, or a managed subscription;
- a local response-generation model or “offline conversation mode”;
- silent cross-provider, cross-model, or voice fallback;
- raw, uncurated dumps of every provider model;
- automatic execution of messages, purchases, tools, or external mutations;
- a claim that network retrieval becomes offline because some preparation is
  local.

## Important Terminology and Historical Traps

- The product is always spelled **Mr Broccoli**, never **Mr. Broccoli**. The
  period creates an unwanted pause when spoken.
- **Response mode** means a saved answering slot: provider, model, and optional
  effort. It is not a speed preset and not a direct home-screen provider
  switch.
- **Council** is the compact UI label; **Model Council** is the full feature
  name.
- Historical internal identifiers containing `ulra` may exist for migration
  compatibility. Never expose that as a current product name.
- **Hands free** is the current session-scoped automatic voice loop. Older
  material may call the feature **Drive Session** or model it as a third input
  mode; that is no longer the current product contract.
- Optional local models are for speech recognition and speech synthesis only.
  Older material may describe local response generation, Free/Premium
  editions, entitlement, purchases, an introduction flow, or automatic local
  setup. Those surfaces have been retired.
- A conversation lock is app access control, not database encryption.
- A readable conversation archive is an AI handoff, not a restorable backup.

## Mental Model of the Runtime

Think of each turn as this ordered, abortable pipeline:

1. capture speech or accept text;
2. persist the user turn;
3. prepare bounded current-conversation context;
4. optionally retrieve past-conversation excerpts;
5. optionally perform web search;
6. optionally run Model Council;
7. stream the selected hosted model's final response;
8. optionally synthesize and play speech;
9. persist the answer, provenance, usage, and receipt; and
10. clean temporary resources.

The user interface owns presentation and interaction state. The pipeline owns
turn ordering. Persistence owns canonical settings and conversations. Native
code owns only the operating-system and lifecycle work that cannot be handled
reliably in shared React Native code.

## What Success Looks Like

Mr Broccoli succeeds when:

- a person can ask a serious question naturally and receive an answer worth
  listening to;
- a long wait feels deliberate and understandable rather than frozen;
- speech capture and playback remain reliable, interruptible, and recoverable;
- the person always knows who answered, what context was used, and where data
  went;
- switching models or continuing from an earlier point never destroys the
  conversation;
- conversation history remains portable and locally owned;
- optional complexity appears when useful without crowding the core voice
  experience; and
- privacy, accessibility, localization, and failure handling remain true under
  real device and provider conditions, not only in the happy path.

## Guidance for the Receiving AI Agent

When proposing product work, preserve the business boundary, privacy boundary,
and depth-over-speed thesis unless the owner explicitly changes them. Clearly
separate current behavior, a proposal, an assumption, and an open question.

Do not infer a feature from its presence in old copy, a migration field, or a
historical name. Do not claim exact provider support, pricing, policy, model
availability, or store requirements without current verification. For any
implementation task, the receiving agent will still need repository access or
a focused source package to trace the full data flow and verify the current
state.
