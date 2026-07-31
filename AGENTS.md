# Mr Broccoli Agent Notes

These notes are specific to this repository and supplement any parent-level instructions.

## Project Shape

- Mr Broccoli is a voice-first mobile chat app built with Expo, React Native, and Expo Router.
- The real app entry is `app/index.tsx`, which renders `src/screens/MainScreen.tsx`.
- `app/_layout.tsx` is the root wrapper and provides `SettingsProvider`, localization, theme, and gesture handling.
- The Expo template stub (`App.tsx`) and the bare-workflow `index.ts` entry have been removed; the app resolves its entry through `expo-router/entry` (`package.json` `main`).

## Main Architecture

- `src/screens/MainScreen.tsx` is the main composition root. It wires focused hooks and services into the workspace and secondary surfaces; recording, transcription, LLM, playback, setup, and persistence behavior live outside the screen component.
- `src/features/settings/AntSettingsModal.tsx` is the configuration entry point. Navigation/frame concerns live in `AntSettingsFrame.tsx`; page routing lives in `AntSettingsPageContent.tsx`; reusable non-visual settings logic lives in `src/features/settings-core/`.
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
- App-data backups contain portable public settings and complete conversation
  records. They must never contain provider API keys, validation diagnostics,
  debug logs, downloaded models, audio, or caches. Preserve both readable JSON
  and passphrase-encrypted AES-256-GCM export modes.
- Backup imports are non-destructive: retain existing API keys and data, skip
  identical conversations, and add conflicting conversation IDs as copies.
- Debug capture payloads must be sanitized before persistence or clipboard
  export so credentials and user-authored prompts, transcripts, queries,
  summaries, instructions, and message content never appear in a log.
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
  - `src/features/settings/pages/ThinkingSettingsPage.tsx`
  - `src/screens/MainScreen.tsx`

## Provider And Model Maintenance

- The app ships eight LLM-capable provider routes: `openai`, `openrouter`, `anthropic`, `gemini`, `xai`, `mistral`, `deepseek`, and `alibaba-qwen-dashscope`. `elevenlabs` is additionally available as an STT/TTS speech provider.
- The runtime provider set, transports, models, and STT/TTS capabilities are driven from `src/constants/providers/runtimeManifest.ts`. `src/constants/models.ts` re-exposes provider order, labels, and picker helpers on top of it.
- Pricing has been removed: there is no `src/constants/usagePricing.ts`, and usage is reported in tokens only.
- When adding or changing a provider, audit all of:
  - `src/constants/providers/runtimeManifest.ts`
  - `src/constants/models.ts`
  - `src/utils/providerCapabilities.ts`
  - `src/types.ts`
  - `src/hooks/useSettings.ts`
  - `src/features/settings/`
  - `src/features/settings-core/`
  - `src/screens/MainScreen.tsx`
  - `src/services/llm.ts`
  - `src/services/whisper.ts`
  - `src/services/tts.ts`
  - `src/components/ProviderIcon.tsx`
- Model lists in `src/constants/models.ts` are user-facing pickers, not raw dumps of every possible provider SKU. Only add models that are actually usable with the app's current integration path.
- `src/services/runtimeCapabilityOverrides.ts` stores provider-confirmed unavailable model or effort configurations under `@mrbroccoli/runtime-capability-overrides`. Only an explicit provider response tied to the precise model or effort may create a durable override. Authentication, credit, quota, rate-limit, network, timeout, capacity, generic 404, and server failures must never do so.
- Runtime compatibility overrides are device-local. They filter request candidates and Settings options, trigger route normalization, and remain inspectable/resettable under App & diagnostics; do not replace them with remote configuration or telemetry.
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
- Speech-to-text prefers the device's native system recognizer (`src/services/speech/`); provider STT is capability-gated. OpenAI, Gemini, Mistral, xAI, Alibaba Qwen, and ElevenLabs currently have provider STT routes in code. Gemini uses the same AI Studio API key as chat, search, and TTS.
- Text-to-speech uses the device's native voices by default. An optional downloaded Kokoro model provides on-device English and Simplified Chinese speech; provider TTS is capability-gated. OpenAI, Gemini, xAI, Alibaba Qwen, Mistral, and ElevenLabs currently have provider TTS routes in code.
- Mistral, ElevenLabs, and xAI load account-visible voices through provider voice-directory services. Keep those integrations, their fallback voice lists, and `src/services/providerVoiceDirectory.ts` in sync. ElevenLabs must retain a built-in premade fallback because restricted TTS/STT keys do not necessarily include `voices_read`.
- Optional Kokoro on-device TTS uses `react-native-sherpa-onnx` and downloads its model only after the user opts in; the model is not bundled with the app.
- TTS fallbacks are explicit and ordered. Provider and Kokoro primary routes default to no fallback; native speech never has a fallback policy.
- The capability source of truth for which provider supports STT/TTS is `src/constants/providers/runtimeManifest.ts`.
- Native speech changes often require `npx pod-install` and a fresh native rebuild, especially on iOS.

## UI And Copy

- User-visible strings must be translated across every registered dictionary
  under `src/i18n/locales/` and kept structurally in sync. Shared feature copy
  may live in a typed module under `src/i18n/` and be spread into every locale.
- Keep interactive controls at least 44 by 44 points. Decorative icons may be
  smaller, but must not define the touch target.
- Modal content must isolate screen-reader focus; backdrop-only dismissal
  layers stay out of the accessibility tree and every modal retains a labeled
  close action.
- Dynamic errors, validation results, downloads, and voice-pipeline phase
  changes must be announced without flooding assistive technology with
  per-frame or per-second updates.
- Theme and color behavior live in `src/theme/`.
- Settings UI work usually belongs in `src/features/settings/`; shared settings behavior belongs in `src/features/settings-core/`.
- Home-screen interaction changes usually belong in `src/screens/MainScreen.tsx` and `src/components/ResponseModeToggle.tsx`.

## Commit Workflow

- Keep every commit as atomic as reasonably possible: one coherent intent that
  can be understood, reviewed, reverted, and validated independently.
- Commit an implementation together with its directly related tests,
  translations, and user-visible changelog entry. Do not split these merely to
  produce smaller commits.
- Separate unrelated behavior, refactors, repository-process documentation,
  dependency changes, and release metadata into their own commits.
- Before committing, inspect both the complete worktree and the staged diff so
  unrelated user changes are never included accidentally.
- During a version release, preserve the existing atomic feature and fix
  commits. The final consolidated release commit contains only the coordinated
  version/build metadata, dated changelog section, localized store notes, and
  other inseparable release-scoped files; it must not absorb unrelated work.

## Changelog And Release Workflow

- Accumulate completed user-visible changes under `## Unreleased` in
  `CHANGELOG.md`.
- Do not modify an already released version's changelog or localized release
  notes. Corrections and later work belong under `Unreleased`.
- Do not increment the user-facing version, Android `versionCode`, or iOS build
  number for each individual change. Increment them only when preparing a new
  distributable release.
- Repository metadata is the version source of truth. Keep EAS configured with
  `appVersionSource: local` and do not enable EAS `autoIncrement`; version and
  build-number changes must be made by the reviewed version-bump script and
  committed.
- Treat an explicit user announcement or request to create a new version as
  authorization to complete the entire release workflow below without stopping
  after the metadata changes:
  1. Move the accumulated `Unreleased` entries into a dated
     `## <version> - YYYY-MM-DD` section and reset `Unreleased`.
  2. Create `docs/google-play-release-notes-<version>.md` with the same complete
     locale-tag set as the preceding release-notes file. Summarize the complete
     release in every locale and keep every entry within Google Play's
     500-character limit.
  3. Run `npm run version:bump -- <version>` so the Expo/package versions,
     Android `versionCode`, and iOS build number remain synchronized.
  4. Validate the release with native configuration parity, TypeScript, the
     complete Jest suite, Expo Doctor, Expo dependency alignment,
     `git diff --check`, and locale-tag/character-limit checks.
  5. Confirm the worktree scope, then stage the coordinated release metadata
     and create one consolidated release commit for the version. Preserve the
     preceding atomic feature and fix commits, and do not include unrelated user
     files. Use a message such as
     `chore(release): prepare <version>`.
  6. Push the release commit and verify that local `HEAD` exactly matches the
     remote branch before building.
  7. Automatically build the Android release bundle from that exact pushed
     commit with `cd android && ./gradlew bundleRelease`.
  8. Verify the AAB archive, signature, package name, embedded version name and
     version code, record its SHA-256, and report the final
     `android/app/build/outputs/bundle/release/app-release.aab` path.
- A release is not complete when only metadata, documentation, or a local
  commit exists. The default endpoint is a pushed, verified commit plus a
  verified Android release AAB.

## Testing And Verification

- There is no lint script in `package.json`.
- Use the repository `Makefile` as the local CI entry point. Install the
  versioned hook with `make hooks-install`; `make pre-push` is the spend-free
  push gate, and `make pre-release-static` is the spend-free native/static
  portion of comprehensive release validation.
- Keep `.githooks/pre-push` repository-relative and non-interactive. Do not put
  live provider calls or Maestro device work in the pre-push hook.
- The comprehensive pre-release workflow must run
  `make prerelease-preflight` before every provider or other quota-consuming
  request. A missing credential, release keystore, or cost ceiling aborts the
  entire run; partial provider coverage is not a release pass.
- Run `make pre-release-live` only as an explicit release phase. It derives the
  complete live matrix from `runtimeManifest.ts`, tests every retained LLM
  model and offered effort, every STT/TTS model, one compatible voice per TTS
  model, provider voice directories, web-search providers, and exposed search
  modes. The runner must stop on the first failure, must not print credentials,
  and must reject its conservative request reservation before network access
  when it exceeds `MR_BROCCOLI_PRERELEASE_MAX_USD`.
- A provider key that exists but lacks quota, credit, product access, or model
  permission is a failed release prerequisite. Do not weaken the matrix,
  silently skip the provider, or spend quota on later providers after this
  failure.
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
- Android release builds must fail when production signing material is missing
  or incomplete. Never fall back to the debug key for a release artifact.

## Licensing And Provider Terms

- The original app code and assets are proprietary under `LICENSE`; this never
  overrides the separate licenses of third-party dependencies, fonts, models,
  or native components.
- Run `npm run license:verify` after dependency or native-runtime changes.
  Regenerate notices deliberately with `npm run license:notices:generate` only
  after reviewing every new or changed license.
- Keep Sherpa's unused FFmpeg runtime disabled on Android and iOS unless a
  future feature truly requires it and the LGPL distribution obligations have
  been reviewed and implemented first.
- Recheck `docs/licensing-and-provider-terms.md` before a release. Provider
  terms can change independently of this repository. Gemini API clients
  available in the EEA, Switzerland, or the UK must use paid services, and
  OpenRouter routes also inherit the selected model's terms.
