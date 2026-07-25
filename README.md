# Mr Broccoli

Mr Broccoli is a voice-first mobile chat app built with Expo and React Native. It supports push-to-talk, toggle-to-talk, and an opt-in Drive Session that re-arms voice capture after each completed reply.

The app is intentionally user-key driven. No provider API keys are shipped in the app bundle. Each user adds their own keys in Settings, and providers stay disabled until configured.

## Highlights

- Voice-first interaction with live recording and playback states
- Optional Kokoro neural speech synthesis running entirely on-device
- User-managed API keys stored securely on device with `expo-secure-store`
- Multi-provider support with branded provider selection
- Optional OpenRouter gateway onboarding alongside direct provider keys
- Per-provider model selection in Settings
- Per-capability connection checks for thinking, listening, speaking, search, and voice discovery
- Expandable turn receipts showing the requested and actual routes, effort mapping, context handling, search, speech route, fallbacks, and timings
- Drive Session with audible state cues, explicit pause-safe turn endings, reply interruption, and large stop/repeat/continue controls
- Configurable assistant instructions, response length, and response tone
- Rolling conversation compaction for long sessions to reduce token cost
- Premium, animated mobile UI tuned for spoken conversation

## Supported Providers

Eleven LLM-capable provider routes:

- OpenAI
- OpenRouter
- Anthropic
- Google Gemini
- xAI
- Mistral
- ByteDance Doubao Seed
- DeepSeek
- Alibaba Qwen (DashScope)
- Moonshot AI Kimi
- Perplexity

ElevenLabs is available as a dedicated speech provider. Dedicated web-search
providers include Tavily, Brave, Exa, Firecrawl, and SerpApi.

Voice input and spoken replies are not tied to any single provider:

- Speech-to-text prefers the device's native system recognizer, with capability-gated provider STT from OpenAI, Gemini/Google Cloud Speech, Mistral, xAI, Qwen, and ElevenLabs as alternatives.
- Text-to-speech uses the device's native voices by default. An optional Kokoro model provides substantially more natural on-device English and Simplified Chinese speech, while capability-gated provider TTS from OpenAI, Gemini, xAI, Qwen, Mistral, and ElevenLabs remains available.
- Mistral, xAI, and ElevenLabs account voices are discovered automatically and can be refreshed from Speaking settings. ElevenLabs falls back to a built-in premade voice when a restricted key cannot read account voices.

The Kokoro model is downloaded only when the user opts in (about 140 MiB
downloaded and 211 MiB installed). It is not bundled in the initial app
download. TTS fallbacks are opt-in: provider speech can fall back to Kokoro,
the system voice, or both in the chosen order; Kokoro can likewise fall back
to a configured provider, the system voice, or both. System speech has no
fallback route.

OpenRouter is an optional LLM gateway: one key exposes a curated cross-provider model set while direct provider connections remain available. Requests routed through it are labeled separately from direct routes.

Each provider stays disabled until its key is configured, and STT/TTS routes only appear when a provider that supports them is set up. Connection health is tracked independently for each capability, so a restricted key can work for speech even when it cannot list account voices.

## Stack

- Expo SDK 55
- React Native 0.83
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

```bash
npm run android
```

```bash
npm test
```

## How Credentials Work

- Provider API keys are entered in the Settings modal by the user.
- Keys are stored in `expo-secure-store`.
- General settings are stored in AsyncStorage.
- Providers without a configured key are hidden or disabled in the main experience.

The app runtime is centered around user-supplied keys in Settings rather than shipping any secrets with the app.

## Conversation Behavior

- The active conversation thread is sent back to the model, not unrelated threads.
- Long conversations are compacted automatically.
- Older turns are summarized into a rolling `contextSummary`.
- Only a bounded recent window is sent verbatim once the thread grows large.
- Assistant turns can expose a transparent receipt of the requested route, actual route, context transformation, web search decision, speech route, fallback, and latency.

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
- Kokoro and its Sherpa/ONNX runtime require a native rebuild; adding only an OTA update is not sufficient.
- The iOS bundle identifier is `com.tobiaswinkler.app.mrbroccoli`.
- The Android application ID and namespace are `com.tobiaswinkler.app.mrbroccoli`.
- The Expo slug and on-device persistence keys use the `mrbroccoli` namespace.

## License

No license file is currently included in this repository.

The optional `kokoro-int8-multi-lang-v1_1` model is Apache-2.0 licensed and
includes its license in the downloaded archive. The React Native wrapper is
MIT licensed; its Sherpa/ONNX native dependencies retain their respective
third-party licenses.
