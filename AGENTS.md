# Mr Broccoli Agent Notes

These notes are specific to this repository and supplement any parent-level instructions.

## Read Order

Use `AGENTS.md` for workflow and collaboration rules. Use the living specs as
the source of truth for product intent, architecture, domain rules, and the
reasons behind the code.

Use `DOCS_INDEX.md` to find the relevant chain. The index is navigation, not a
source of truth; when it disagrees with a `SPEC.md` or `DESIGN.md`, follow the
spec or design.

Before changing code, read every `SPEC.md` and `DESIGN.md` from the repository
root down to the nearest documented boundary. For example, work under
`src/services/voicePipeline/` requires:

1. `SPEC.md`
2. `DESIGN.md`
3. `src/SPEC.md`
4. `src/services/SPEC.md`
5. `src/services/voicePipeline/SPEC.md`
6. `src/services/voicePipeline/DESIGN.md`

Also read the applicable `AGENTS.md` files at each level when present.

## Completion Checklist

Before presenting implementation work as complete or creating a PR:

1. Update every affected `SPEC.md` and `DESIGN.md` in the spec chain. Changes
   to behavior, architecture, patterns, directory structure, integration
   points, privacy boundaries, or failure handling must be reflected there.
2. Update `AGENTS.md`, `README.md`, or operational docs when workflow, tooling,
   setup, or collaboration guidance changes.
3. Run validation proportionate to the change. `make pre-push` remains the
   complete spend-free gate.

## Living Specifications

Permanent living documentation is co-located with stable code boundaries as
`SPEC.md` and, only where runtime complexity warrants it, `DESIGN.md`.

- `SPEC.md` explains what the boundary owns, why it exists, and what must stay
  true.
- `DESIGN.md` explains how a complex boundary works at runtime, including
  orchestration, dependencies, state flow, and fallback behavior.
- Higher-level files set broader constraints. Child files refine their parent
  and must not restate or contradict it.
- Keep specs sparse and high-signal. They describe stable intent and current
  architecture, not implementation history or a chronological changelog.
- Cross-cutting product terms, privacy rules, platform constraints, and
  architectural decisions belong in the root `SPEC.md` or `DESIGN.md`.
- Link critical claims to tests, schemas, or source contracts where practical.
- All diagrams in `DESIGN.md` use Mermaid syntax.

Use these markers when confidence or authority matters:

| Marker | Meaning |
| --- | --- |
| _(none)_ | Verified fact or established pattern |
| **Decision:** | Deliberate choice; include why and rejected alternatives |
| **Assumption:** | Believed true but not yet validated; include failure conditions |
| **Open question:** | Unresolved; include the owner or resolution gate |
| **Dependency:** | External system, team, store, credential, or decision |

When code contradicts a living spec, investigate before changing either. It may
be a code defect or stale documentation. Agents may update specs to match
observed reality, but changes to product intent or architectural constraints
require explicit human direction.

Detailed feature or bug work may use `docs/specs/<change-name>/` with
`requirements.md`, `design.md`, and `tasks.md`. Before completing the work,
promote durable knowledge into the nearest permanent spec. Keep a completed
work spec only when it remains a useful worked example; otherwise remove it.

## Living Spec Review On Push

The repository pre-push hook runs `scripts/pre-push-spec-review.sh` before
`make pre-push`. When pushed commits contain code, native, build, or script
changes, it requires an explicit review of four outcomes: **modify**,
**create**, **restructure**, and **drop**.

The review is scoped to the commits in that push. Acknowledge it with either:

- `SPEC_REVIEW_ACK="<justification of at least 10 characters>" git push` for a
  one-shot local acknowledgement; or
- a `Spec-Review: <justification>` trailer in a commit included in the push for
  a durable audit trail.

The gate skips documentation-only pushes. It forces a review decision but
cannot determine whether the specs are correct; the Completion Checklist still
applies.

## Project Shape

- Mr Broccoli is a voice-first mobile chat app built with Expo, React Native, and Expo Router.
- The real app entry is `app/index.tsx`, which renders `src/screens/MainScreen.tsx`.
- `app/_layout.tsx` is the root wrapper and provides `SettingsProvider`, localization, theme, and gesture handling.
- The Expo template stub (`App.tsx`) and the bare-workflow `index.ts` entry have been removed; the app resolves its entry through `expo-router/entry` (`package.json` `main`).

## Main Architecture

- `src/screens/MainScreen.tsx` is the main composition root. It wires focused hooks and services into the workspace and secondary surfaces; recording, transcription, LLM, playback, setup, and persistence behavior live outside the screen component.
- `src/components/IntroBanner.tsx` and `src/components/introFlow/` are the
  first-run introduction: a dark banner over the workspace opening a six-step
  full-screen flow. `introTheme.ts` holds its palette, deliberately independent
  of the light/dark app theme, and `useIntroPlayback.ts` activates the audio
  session the voice pipeline leaves off while idle. Its audio examples are bundled under
  `assets/intro-audio/intro-<lang>.m4a`, one per interface language. Adding a
  language means a recording normalized to -16 LUFS, an entry in
  `introClips.ts`, and a script in `introScripts.ts`;
  `docs/promo-audio-texts/<lang>.md` holds the source text and records which
  provider voiced it. The blocking setup wizards were removed; the app
  opens directly into the workspace and the intro sheet also opens at its final
  step when a turn is attempted with no usable route.
- `src/features/settings/AntSettingsModal.tsx` is the configuration entry point. Its historical `Ant` prefix remains for import stability, but the app no longer depends on Ant Design. Navigation/frame concerns live in `AntSettingsFrame.tsx`; page routing lives in `AntSettingsPageContent.tsx`; reusable non-visual settings logic lives in `src/features/settings-core/`.
- Shared buttons, inputs, lists, dialogs, and tags live in `src/design-system/NativeControls.tsx`; settings cards, fields, and pickers live under `src/features/settings/settings-primitives/`. Keep these React Native-owned controls dependency-light and accessible.
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
- Conversations are stored in SQLite (`mr-broccoli-conversations.db`) through
  `src/services/conversationStore/`, which also performs a one-time import from
  the former AsyncStorage keys. Those legacy keys are deliberately left in place
  for one release as a recovery path. The derived knowledge index keeps its own
  separate database so an indexing failure can never roll back a message write.
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
- Application glyphs must use the shared `src/design-system/PhosphorIcon.tsx`
  with Phosphor's regular weight and its semantic size scale; do not import
  another icon font or use raw numeric glyph sizes. The nine official
  provider-brand SVGs in `ProviderIcon.tsx` are the deliberate exception and
  use the same semantic visual-size tokens.
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
     500-character limit. Run `npm run release-notes:verify`; it checks the
     newest release-note file against the preceding tag order and limit.
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
     commit with `make release-aab`. This disables Expo dotenv loading while
     bundling, scans the resulting archive for configured local API-key and
     signing-password values, and fails unless the AAB contains both its R8
     deobfuscation mapping and native debug symbols. The target preserves the
     AAB, `mapping.txt`, native-symbol ZIP, checksums, and manifest under the
     ignored `artifacts/releases/android/<version>-<code>/<aab-sha>/` path.
  8. Verify the AAB archive, signature, package name, embedded version name and
     version code, record its SHA-256, and report the final
     `android/app/build/outputs/bundle/release/app-release.aab` path plus its
     versioned diagnostic-artifact archive.
- A release is not complete when only metadata, documentation, or a local
  commit exists. The default endpoint is a pushed, verified commit plus a
  verified Android release AAB.

## Testing And Verification

- Every bug fix must include an automated regression test at the closest
  reliable layer (unit, integration, native instrumentation, Maestro E2E, or
  another appropriate automated check) that fails for the reported behavior
  before the fix and passes afterward. A bug fix is not complete, committable,
  or releasable without that test; keep the fix and its regression test in the
  same atomic commit.
- `npm run static:verify` is the repository static-analysis gate. It runs
  ESLint with zero tolerated warnings plus Knip checks for unused files,
  dependencies, unresolved imports, and dependency cycles.
- `npm run typecheck` validates production app code, Jest tests, and Node-based
  release scripts through their dedicated TypeScript configurations.
- `npm run test:coverage -- --runInBand --watchman=false` measures the complete
  `src/` tree, including unimported files, and enforces the checked-in global
  floor. The local pre-push gate runs this coverage command.
- `__mocks__/expoSQLite.js` runs real SQLite through Node's built-in
  `node:sqlite`, so suites exercise actual statements, transactions, and
  foreign keys instead of canned return values. This sets the repository's
  Node floor at 22.5; `package.json` `engines` records it. A suite that
  prefers hand-built fixtures can still override any single method with
  `mockImplementation`. Keep `__tests__/mocks/expoSQLiteMock.test.ts` passing:
  it is what proves the mock still executes SQL rather than quietly answering
  every read with an empty result.
- Use the repository `Makefile` as the local CI entry point. Install the
  versioned hook with `make hooks-install`; `make pre-push` is the spend-free
  push gate, and `make pre-release-static` is the spend-free native/static
  portion of comprehensive release validation.
- `make fresh-checkout` refuses a dirty worktree, creates a detached worktree
  at the exact current `HEAD`, installs only from the lockfile, and reruns the
  complete pre-push gate without dotenv loading. `make pre-release-static`
  starts with this isolated validation before native build and device gates.
- Keep `.githooks/pre-push` repository-relative and non-interactive. Do not put
  live provider calls or Maestro device work in the pre-push hook.
- The paid provider/model matrix is authorized only when the user explicitly
  asks to wrap the accumulated batch of commits into a new version. Do not run
  `make pre-release-live` or the combined `make pre-release` target during
  investigation, feature or bug implementation, individual commits, pushes,
  ordinary build verification, or merely because work is accumulating under
  `Unreleased`. Normal development and push validation must remain spend-free.
- The comprehensive pre-release workflow must run
  `make prerelease-preflight` before every provider or other quota-consuming
  request. A missing credential, release keystore, or cost ceiling aborts the
  entire run; partial provider coverage is not a release pass.
- Once that explicit new-version request has been given, the
  `make pre-release-live` target derives the complete live matrix from
  `runtimeManifest.ts`,
  tests every retained LLM model and offered effort, every STT/TTS model, one
  compatible voice per TTS model, provider voice directories, web-search
  providers, and exposed search modes. The runner must stop on the first
  failure, must not print credentials, and must reject its conservative request
  reservation before network access when it exceeds
  `MR_BROCCOLI_PRERELEASE_MAX_USD`.
- Every attempted live matrix must leave private JSON and Markdown cost reports
  in `artifacts/provider-matrix/`, including on failure. Retain only sanitized
  numeric provider usage and deterministic fixture units; never persist keys,
  prompts, transcripts, provider response content, or request payloads. Label
  provider-reported USD separately from pinned list-price estimates, provider
  credits, and costs that cannot be converted to USD without account-specific
  billing details. The pre-request reservation remains the quota guard, not a
  claim about the final invoice.
- A provider key that exists but lacks quota, credit, product access, or model
  permission is a failed release prerequisite. Do not weaken the matrix,
  silently skip the provider, or spend quota on later providers after this
  failure.
- `make pre-release-maestro` requires exactly one connected Android emulator,
  one connected physical Android device, and one booted iOS simulator. Override
  ambiguous discovery with `MR_BROCCOLI_ANDROID_EMULATOR_UDID`,
  `MR_BROCCOLI_ANDROID_PHYSICAL_UDID`, or
  `MR_BROCCOLI_IOS_SIMULATOR_UDID`. It builds and installs bundled Release apps,
  exercises every registered UI language on Android and iOS, runs the known
  Drive/three-route landscape regression, temporarily applies dark mode,
  increased contrast, and accessibility-large text on both simulators, and
  runs VoiceOver and TalkBack hierarchy checks against labelled home controls,
  and runs physical Android smoke coverage. Simulator display and screen-reader
  settings are restored even when a flow fails. The Android emulator image must
  include Google TalkBack.
- A Maestro command pass is not the visual verdict. Review every image in
  `artifacts/maestro/release/review-gallery.html` for clipping, overlap,
  untranslated copy, RTL direction, missing content, and inconsistent states
  before declaring the release ready.
- `make pre-release` is the comprehensive local release gate. Its order is
  static checks, cross-platform device/UI validation, then live provider calls,
  so avoidable failures happen before quota is spent.
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
- Run `make android-instrumentation` with at least one connected Android
  emulator or device for native playback, waveform, foreground-service, and
  lifecycle race coverage. The comprehensive local pre-release gate runs this
  target automatically and fails if the native runtime checks cannot execute.
- Run `make ios-native-test` with exactly one booted iOS simulator for native
  playback, audio-session interruption, background-turn, and queue lifecycle
  race coverage. Set `MR_BROCCOLI_IOS_SIMULATOR_UDID` when more than one
  simulator is booted. The comprehensive local pre-release gate runs this
  target automatically.

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
- Native Release bundling must set `EXPO_NO_DOTENV=1`; local pre-release
  credentials belong only to the live-test runner and must never influence app
  bundles. Verify every distributable with the artifact secret scanner.
- Android release builds must keep R8 minification, resource shrinking, the
  optimized Android rules baseline, and `SYMBOL_TABLE` native diagnostics
  enabled. Treat a missing R8 mapping or native-symbol archive as a failed
  release rather than bypassing the artifact verifier.
- Android release verification enforces `config/release-size-budget.json` for
  the AAB upload, the arm64 native payload, and bundled ONNX assets. Kokoro
  remains download-only and must never appear in an application bundle. Raise
  a budget only after documenting and reviewing the concrete size increase.

## Design System Sync

`.design-sync/` holds the inputs that publish this app's design system to
claude.ai/design, so the design agent composes screens from the real
components instead of generic ones. It is build tooling only.

- **Nothing here may affect the shipped app.** Mr Broccoli is iOS/Android only,
  and claude.ai/design renders in a browser, so the sync bundles `src/` through
  `react-native-web`. That bridge lives entirely in `.design-sync/`: a
  converter-only `tsconfig.designsync.json`, shims, and three declared forks of
  the sync tool's own lib scripts. Metro's graph, the release artifacts, and
  `app.json` `platforms` are untouched.
- `react-native-web` is a **devDependency**, pinned to the version
  `expo/bundledNativeModules.json` names for the current SDK so Expo Doctor and
  dependency alignment stay green. It is an optional peer of `expo` and
  `expo-router`, so it appears in `THIRD_PARTY_NOTICES.md` production output
  even though no file under `app/` or `src/` imports it.
- When a browser render disagrees with the device, **fix it in `.design-sync/`,
  never in `src/`**. Several react-native-web translation gaps have already been
  worked around this way; changing app code to compensate for a browser-only
  artifact would alter what ships to users for no native benefit.
- Read `.design-sync/NOTES.md` before re-running a sync. It records the forks
  and why each exists, the approaches that were tried and rejected, the render
  warnings that are benign, and what can silently go stale.
- Re-run with `/design-sync`. Regenerate its derived inputs first
  (`node .design-sync/gen-types.mjs`, `node .design-sync/gen-tokens.mjs`);
  `tokens.css` is generated from `src/theme/` and must never be hand-edited.
- After changing anything here, re-run `npm run typecheck` and
  `npm run static:verify` — keeping `make pre-push` green is this directory's
  main risk to the repository.

## Vendored Design System

`design-system/` is a byte-faithful copy of the approved claude.ai/design
project. It is the source of truth for product design intent; `src/` is the
implementation of that intent, and the two are reconciled deliberately.

- **It is a mirror, not app code.** Nothing under `app/` or `src/` imports it,
  and it ships in no bundle. Its React is browser React, not React Native.
- **Do not hand-edit it.** Design changes are made in the claude.ai/design
  project and re-imported. A local edit is silently lost on the next import and
  makes the copy stop being evidence of what was approved.
- It sits outside every gate on purpose: `tsconfig.json` `include` names only
  `app/**` and `src/**`, and no Knip `project` glob covers it. That is what lets
  it hold browser JSX without breaking `make pre-push`.
- `_adherence.oxlintrc.json` is the machine-readable half of the contract: every
  component's declared props, its enum-valued props, and the complete token list
  with kinds. Check drift against that file rather than against prose.
- `.design-sync/` and this directory point in opposite directions.
  `.design-sync/` publishes `src/` outward so the design agent composes from
  real components; `design-system/` is what came back.

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
