# Mr Broccoli Agent Notes

These notes are specific to this repository and supplement any parent-level instructions.

## Project Shape

- Mr Broccoli is a voice-first mobile chat app built with Expo, React Native, and Expo Router.
- The real app entry is `app/index.tsx`, which renders `src/screens/MainScreen.tsx`.
- `app/_layout.tsx` is the root wrapper and provides `SettingsProvider`, localization, theme, and gesture handling.
- The Expo template stub (`App.tsx`) and the bare-workflow `index.ts` entry have been removed; the app resolves its entry through `expo-router/entry` (`package.json` `main`).

## Main Architecture

- `src/screens/MainScreen.tsx` is the main composition root. It wires focused hooks and services into the workspace and secondary surfaces; recording, transcription, LLM, playback, setup, and persistence behavior live outside the screen component.
- `src/features/settings-antd/AntSettingsModal.tsx` is the configuration entry point. Navigation/frame concerns live in `AntSettingsFrame.tsx`; page routing lives in `AntSettingsPageContent.tsx`; reusable non-visual settings logic lives in `src/features/settings-core/`.
- `src/components/ResponseModeToggle.tsx` is the home-screen response-route selector. Its one-, two-, three-, and overflow-route layouts live under `src/components/responseModeToggle/`.
- Direct provider switching has been removed from the home screen; the app routes through configurable response modes.
- `src/constants/providers/runtimeManifest.ts` is the runtime source of truth for provider order, transports, model routes, API key hints, STT/TTS capabilities, and provider voice defaults. `src/constants/models.ts` exposes user-facing helpers on top of it.
- `src/types.ts` is the source of truth for settings types and `DEFAULT_SETTINGS`.
- `src/utils/responseModes.ts` contains the response-mode routing helpers and provider model validation logic.
- `src/hooks/useSettings.ts` is the public settings hook. Persistence, migrations, normalization, and mutations live under `src/hooks/settings/`.
- `src/hooks/useConversations.ts` is the public conversation hook. Hydration, metadata, storage, search, and mutations live under `src/hooks/conversations/`.
- `src/services/llm.ts` contains provider request routing for text generation.
- `src/services/whisper.ts` contains provider speech-to-text integrations.
- `src/services/tts.ts` contains text-to-speech routing across native system voices, optional on-device Kokoro speech, and capability-gated provider TTS routes.
- `src/services/voicePipeline.ts` coordinates focused transcription, context, web-search, LLM-response, TTS-queue, and cleanup stages under `src/services/voicePipeline/`.
- `src/services/speech/` contains native speech recognition and diagnostics support.

## State And Persistence

- Public settings are stored under the AsyncStorage key `@mrbroccoli/settings`.
- Provider API keys are stored separately in `expo-secure-store` using the `mrbroccoli.provider_key.<provider>` prefix.
- Conversations are stored under the AsyncStorage key `@mrbroccoli/conversations` plus per-conversation keys `@mrbroccoli/conversation/<id>`.
- Do not move provider API keys into AsyncStorage or any plain-text project config.
- When changing settings shape, update `src/types.ts` and `src/hooks/useSettings.ts` together and preserve migration behavior for existing installs.

## Response Modes

- The app now routes the main experience through response modes, not direct provider selection.
- A response mode is a `(provider, model)` pair stored in `settings.responseModes`.
- `activeResponseMode` controls which route the home screen uses.
- If response-mode behavior changes, the following files usually need to stay in sync:
  - `src/types.ts`
  - `src/utils/responseModes.ts`
  - `src/hooks/useSettings.ts`
  - `src/components/ResponseModeToggle.tsx`
  - `src/features/settings-antd/pages/ThinkingSettingsPage.tsx`
  - `src/screens/MainScreen.tsx`

## Provider And Model Maintenance

- The app ships eleven LLM-capable provider routes: `openai`, `openrouter`, `anthropic`, `gemini`, `xai`, `mistral`, `bytedance-doubao-seed`, `deepseek`, `alibaba-qwen-dashscope`, `moonshot-ai-kimi`, and `perplexity`. `elevenlabs` is additionally available as an STT/TTS speech provider. Dedicated web-search routes (`perplexity`, `tavily`, `brave`, `exa`, `firecrawl`, `serpapi`) are wired separately.
- The runtime provider set, transports, models, and STT/TTS capabilities are driven from `src/constants/providers/runtimeManifest.ts`. `src/constants/models.ts` re-exposes provider order, labels, and picker helpers on top of it.
- Pricing has been removed: there is no `src/constants/usagePricing.ts`, and usage is reported in tokens only.
- When adding or changing a provider, audit all of:
  - `src/constants/providers/runtimeManifest.ts`
  - `src/constants/models.ts`
  - `src/utils/providerCapabilities.ts`
  - `src/types.ts`
  - `src/hooks/useSettings.ts`
  - `src/features/settings-antd/`
  - `src/features/settings-core/`
  - `src/screens/MainScreen.tsx`
  - `src/services/llm.ts`
  - `src/services/whisper.ts`
  - `src/services/tts.ts`
  - `src/components/ProviderIcon.tsx`
- Model lists in `src/constants/models.ts` are user-facing pickers, not raw dumps of every possible provider SKU. Only add models that are actually usable with the app's current integration path.
- For OpenAI, the app currently uses `v1/chat/completions` in `src/services/llm.ts`. Do not add specialized models that require a different API shape unless the service layer is updated too.
- For Anthropic, the app currently uses `v1/messages` in `src/services/llm.ts`. Keep the picker aligned with models that work on that path.
- When updating provider model lists, also check defaults and tests for hard-coded model IDs. Common follow-up files are:
  - `src/types.ts`
  - `src/screens/MainScreen.tsx`
  - `__tests__/utils/responseModes.test.ts`
  - `__tests__/hooks/useSettings.test.ts`
  - `__tests__/hooks/useConversations.test.ts`
  - `__tests__/services/llm.test.ts`

## Alias Model Rule

- Exclude alias model IDs from user-facing pickers when a provider also exposes a canonical stable snapshot for the same model.
- Prefer canonical stable model IDs over rolling aliases.
- If a provider documents both a snapshot model ID and an alias for the same model, keep only the snapshot in the picker.
- Only keep an alias if the provider does not expose a separate canonical model ID for that same model.

## Voice Pipeline Notes

- STT provider support is currently wired in `src/services/whisper.ts`.
- TTS provider support is currently wired in `src/services/tts.ts`.
- Speech-to-text prefers the device's native system recognizer (`src/services/speech/`); provider STT is capability-gated. OpenAI, Gemini (Google Cloud Speech), Mistral, xAI, Alibaba Qwen, and ElevenLabs currently have provider STT routes in code.
- Text-to-speech uses the device's native voices by default. An optional downloaded Kokoro model provides on-device English and Simplified Chinese speech; provider TTS is capability-gated. OpenAI, Gemini, xAI, Alibaba Qwen, Mistral, and ElevenLabs currently have provider TTS routes in code.
- Mistral, ElevenLabs, and xAI load account-visible voices through provider voice-directory services. Keep those integrations, their fallback voice lists, and `src/services/providerVoiceDirectory.ts` in sync. ElevenLabs must retain a built-in premade fallback because restricted TTS/STT keys do not necessarily include `voices_read`.
- Optional Kokoro on-device TTS uses `react-native-sherpa-onnx` and downloads its model only after the user opts in; the model is not bundled with the app.
- TTS fallbacks are explicit and ordered. Provider and Kokoro primary routes default to no fallback; native speech never has a fallback policy.
- The capability source of truth for which provider supports STT/TTS is `src/constants/providers/runtimeManifest.ts`.
- Native speech changes often require `npx pod-install` and a fresh native rebuild, especially on iOS.

## UI And Copy

- User-visible strings live in `src/i18n/locales/en.ts` and `src/i18n/locales/de.ts`. When changing visible copy, update both English and German entries and keep the two locales structurally in sync.
- Theme and color behavior live in `src/theme/`.
- Settings UI work usually belongs in `src/features/settings-antd/`; shared settings behavior belongs in `src/features/settings-core/`.
- Home-screen interaction changes usually belong in `src/screens/MainScreen.tsx` and `src/components/ResponseModeToggle.tsx`.

## Testing And Verification

- There is no lint script in `package.json`.
- Use `npx tsc --noEmit` as the baseline repo-wide verification step for UI and type changes.
- Use targeted Jest runs for affected areas instead of defaulting to the entire suite when only a small area changed.
- Common focused tests:
  - `__tests__/utils/responseModes.test.ts`
  - `__tests__/hooks/useSettings.test.ts`
  - `__tests__/hooks/useConversations.test.ts`
  - `__tests__/services/llm.test.ts`
  - `__tests__/services/tts.test.ts`
  - `__tests__/services/whisper.test.ts`
- Run `npm test` when changes are broad enough to justify the full suite.

## Native And Build Notes

- Install dependencies with `npm install`.
- Run iOS pods with `npx pod-install`.
- App scripts:
  - `npm run ios`
  - `npm run android`
  - `npm test`
- Home screen icons, launcher assets, and many native dependency changes require a native rebuild. OTA updates are not enough.
- Be careful around `ios/Podfile.lock` and native dependency versions. Do not churn native lockfiles unless the change actually requires it.
