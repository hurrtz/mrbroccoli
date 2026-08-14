# Mr Broccoli

Mr Broccoli is a voice-first mobile chat app built with Expo and React Native. It supports push-to-talk, toggle-to-talk, and an opt-in Drive Session that re-arms voice capture after each completed reply.

The app is intentionally user-key driven. No provider API keys are shipped in the app bundle. Each user adds their own keys in Settings, and providers stay disabled until configured.

See the [changelog](CHANGELOG.md) for user-facing release history and localized
store notes.

For product intent and architecture rationale, start with the living
[`SPEC.md`](SPEC.md), [`DESIGN.md`](DESIGN.md), and
[`DOCS_INDEX.md`](DOCS_INDEX.md). Follow the index to the closest subsystem
before changing code, and update the affected spec chain with the implementation.

## Highlights

- Voice-first interaction with live recording and playback states
- Adaptive iPhone and iPad interface: compact windows reuse the phone layout,
  while regular iPad adds persistent conversations, optional transcript
  docking, master-detail Settings, and a focused Intro card
- Guided on-device catalogue with device checks, verified downloads, benchmarks,
  and local Qwen, Whisper, Kokoro, and Piper routes
- User-managed API keys stored securely on device with `expo-secure-store`
- Multi-provider support with branded provider selection
- Optional OpenRouter gateway onboarding alongside direct provider keys
- Per-provider model selection in Settings
- Per-capability connection checks for thinking, listening, speaking, search, and voice discovery
- Expandable turn receipts showing the requested and actual routes, effort mapping, context handling, search, speech route, fallbacks, and timings
- Drive Session with audible state cues, explicit pause-safe turn endings, reply interruption, and large stop/repeat/continue controls
- Configurable assistant instructions, response length, and response tone
- Rolling conversation compaction for long sessions to reduce token cost
- Optional on-device retrieval from earlier non-private conversations, with
  visible source sessions and per-conversation privacy controls
- Premium, animated mobile UI tuned for spoken conversation

## Supported Providers

Eight LLM-capable provider routes:

- OpenAI
- OpenRouter
- Anthropic
- Google Gemini
- xAI
- Mistral
- DeepSeek
- Alibaba Qwen (DashScope)

ElevenLabs is available as a dedicated speech provider. OpenAI, Anthropic,
Google Gemini, xAI, Mistral, and Alibaba Qwen offer provider-native web search.
Kimi K3 remains available through OpenRouter.

Voice input and spoken replies are not tied to any single provider:

- Speech-to-text prefers the device's native system recognizer. Downloadable
  Whisper Tiny runs locally, while OpenAI, Gemini, Mistral, xAI, Qwen, and
  ElevenLabs remain available as capability-gated provider alternatives.
- Text-to-speech uses the device's native voices by default. Downloadable Kokoro
  and language-specific Piper voices run locally, while OpenAI, Gemini, xAI,
  Qwen, Mistral, and ElevenLabs remain available as provider alternatives.
- Downloadable Qwen3 0.6B and 1.7B models are normal response modes. Their turns
  do not use provider credentials, conversation summarization, or web search.
- Mistral, xAI, and ElevenLabs account voices are discovered automatically and can be refreshed from Speaking settings. ElevenLabs falls back to a built-in premade voice when a restricted key cannot read account voices.

Every interface locale is also an official speech language: English, German,
Ukrainian, Hindi, Spanish, French, Italian, European and Brazilian Portuguese,
Russian, Simplified Chinese, Arabic, Japanese, Hungarian, Czech, Polish,
Turkish, Swedish, and Urdu. Interface, recognition, and spoken-reply languages
are configured independently for system and provider routes. The on-device
catalogue uses one shared conversation-language choice and offers only models
that cover every selected language. Provider compatibility is checked before
each route is used; native availability depends on the voices and recognizers
installed by the operating system.

Local models are downloaded only after the user opts in and are never bundled
in the initial app download or app-data backups. The app probes each phone's
memory, storage, architecture, operating system, and current device state,
excludes impossible choices, verifies pinned artifacts, and requires an
on-device benchmark before a model can be selected. TTS fallbacks remain
explicit and ordered; system speech has no fallback route.

OpenRouter is an optional LLM gateway: one key exposes a curated cross-provider model set while direct provider connections remain available. Requests routed through it are labeled separately from direct routes.

Each provider stays disabled until its key is configured, and STT/TTS routes only appear when a provider that supports them is set up. Connection health is tracked independently for each capability, so a restricted key can work for speech even when it cannot list account voices.

## Stack

- Expo SDK 57
- React Native 0.86
- React 19
- Expo Router
- Expo Audio
- React Native Reanimated
- React Native SVG

## Getting Started

### Requirements

- Node.js and npm
- Xcode for iOS builds
- Android Studio for Android builds
- CocoaPods for iOS native dependencies

### Install

```bash
npm install
npx pod-install
```

### Run

```bash
npm run ios
```

For a standalone physical-iPhone build that coexists with the App Store app,
connect one iPhone and run:

```bash
npm run ios:standalone
```

This builds the Release runtime with embedded JavaScript, installs it as
`Mr Broccoli Dev` under the `.dev` bundle identifier, and launches it without
Metro. The dev app uses the checked-in monochrome launcher artwork so it is
visually distinct from the production app. Use
`npm run ios:standalone -- --device <name-or-udid>` when more than one physical
iPhone is connected.

```bash
npm run android
```

```bash
npm test
```

### Local validation

The repository includes a Makefile-based local CI workflow:

```bash
make hooks-install
make pre-push
make pre-release-static
make pre-release-maestro
make pre-release-live
make pre-release
make release-aab
make ios-native-test
```

The repository's Git pre-push hook first requires a living-spec review for
code-bearing commits, then runs `pre-push`, the fast, spend-free validation
gate. The review can be recorded with a substantive `SPEC_REVIEW_ACK` or a
`Spec-Review:` commit trailer. `prerelease-preflight` checks the complete ignored
`.env.local` secret/signing contract before any provider request.
`pre-release-static` then adds Expo dependency checks plus Android and iOS
native validation, including Android instrumentation and iOS lifecycle tests
on connected or booted devices. `pre-release-live` derives every retained LLM
model and effort, speech model, representative TTS voice, voice directory,
web-search provider, and exposed search mode from the runtime manifest. It
aborts on the first failure and rejects a matrix whose conservative release-test
reservation exceeds `MR_BROCCOLI_PRERELEASE_MAX_USD`. Every attempted live run
also writes
private JSON and Markdown cost reports under `artifacts/provider-matrix/`, even
when a provider fails. Those reports contain only numeric usage metadata and
release-fixture units—never credentials, prompts, transcripts, or responses.
Provider-reported dollar charges are identified separately from pinned
list-price estimates, account-plan credits, and explicitly unknown costs.
`pre-release-maestro` builds bundled
Release apps, installs them on one Android emulator, one authorized physical
Android device, and one booted iOS simulator, runs every UI locale on both
simulator platforms plus physical-device smoke coverage, and creates a
screenshot review gallery. `pre-release` runs static, device, and live gates in
that quota-safe order. Live validation and device work remain explicit release
phases so neither can be triggered by a push. Release builds disable Expo's
dotenv loading and scan the resulting app archive for exact configured API-key
and signing-password values; `release-aab` applies both protections to the
signed Android bundle.

## How Credentials Work

- Provider API keys are entered in the Settings modal by the user.
- Keys are stored in `expo-secure-store`.
- General settings are stored in AsyncStorage.
- Providers without a configured key are hidden or disabled in the main experience.

The app runtime is centered around user-supplied keys in Settings rather than shipping any secrets with the app.

## Conversation Behavior

- The active conversation thread is sent back to the model. When Past
  conversation knowledge is enabled, a small number of relevant excerpts from
  other non-private conversations may also be included and are shown as source
  sessions on the reply.
- Long conversations are compacted automatically.
- Older turns are summarized into a rolling `contextSummary`.
- Only a bounded recent window is sent verbatim once the thread grows large.
- Assistant turns can expose a transparent receipt of the requested route, actual route, context transformation, web search decision, speech route, fallback, and latency.
- Cross-session indexing and retrieval stay on-device. Private conversations
  are never indexed; their compact memory still works inside that conversation.
- The derived search index is excluded from backups and deleted when the
  feature is disabled. Retrieved excerpts are sent to the selected model
  provider as part of that request.

This keeps cost and latency more stable during long voice sessions.

## Project Structure

```text
app/                    Expo Router entry points
assets/                App icon and provider icon assets
src/components/         UI components
src/context/            Shared React context
src/hooks/              Settings, conversations, audio hooks
src/screens/            Main screen
src/services/           LLM, transcription, TTS, and context logic
__tests__/              Focused hook and service tests
```

## Notes

- Home screen icons and launcher assets require a new native build. OTA updates alone will not change them.
- Sherpa/ONNX and llama.rn runtime changes require a native rebuild; adding only
  an OTA update is not sufficient.
- Release builds use `com.tobiaswinkler.app.mrbroccoli` as the iOS bundle
  identifier and Android application ID. Debug builds append `.dev` so local
  installs can coexist with the App Store or Play Store app.
- `npm run ios:standalone` combines the iOS Release runtime with the `.dev`
  identity for offline physical-device testing; normal Release and App Store
  builds retain the production identifier.
- The Android namespace remains `com.tobiaswinkler.app.mrbroccoli` in every
  build variant.
- The Expo slug and on-device persistence keys use the `mrbroccoli` namespace.

## License

Mr Broccoli's original code and assets are proprietary and all rights reserved.
See [LICENSE](LICENSE). Third-party dependencies retain their own licenses;
the generated notices are collected in
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md), and the reviewed provider
terms and distribution boundaries are documented in
[docs/licensing-and-provider-terms.md](docs/licensing-and-provider-terms.md).

Optional model licenses are displayed in the on-device catalogue; licenses and
sources are recorded in the provider-terms review. The llama.rn and Sherpa
wrappers are MIT licensed; their native dependencies retain their respective
third-party licenses. Sherpa's unused FFmpeg runtime is excluded from Android
and iOS builds.
