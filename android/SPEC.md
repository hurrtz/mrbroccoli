---
status: active
code_paths:
  - android/**
dependencies:
  - Expo and React Native Android runtime
  - Android Gradle Plugin
  - Play Billing and Google Play signing
validations:
  - npm run config:verify
  - make android-unit-test
  - make android-instrumentation
provenance:
  intent: source-and-release-history-backfilled
  validation: native-test-backed
last_validated_sha: 7db5c94
---

# Android Native Specification

## Purpose

The Android project implements operating-system and lifecycle behavior that
cannot be represented reliably in TypeScript alone. Product policy remains in
the shared layer; Kotlin modules expose narrow native capabilities.

## Identity and Configuration

- Production application ID and namespace are
  `com.tobiaswinkler.app.mrbroccoli`.
- Debug builds append `.dev`; Maestro Release builds append `.maestro` through
  an explicit build property. Both can coexist with production.
- Entitlement simulation is permitted only for identities ending in `.dev` or
  `.maestro`; store-promo fixture injection remains `.maestro`-only.
- Expo configuration, manifest values, permissions, deep links, version, and
  native project settings are checked for parity by
  `scripts/verify-native-config-sync.mjs`.

## Native Responsibilities

- `MrBroccoliNativeAudioQueueModule` and its coordinator/player provide ordered,
  race-safe audio playback and lifecycle control.
- `MrBroccoliNativeWaveformModule`, view manager, analyzer, and coordinators
  provide microphone/file signal levels and native rendering behavior.
- `MrBroccoliVoiceTurnService` owns the foreground-service lifetime required
  for background voice-turn continuation and notification controls.
- `MrBroccoliModelDownloadService` and its module keep the process running
  while an on-device model downloads. It is a separate `dataSync` service
  rather than a mode of the voice-turn service: the two have unrelated
  lifetimes, and a download must not inherit media or microphone types it does
  not use. Notification copy is passed in from JavaScript, which is where the
  user's language lives.
- `MrBroccoliVoiceLiveActivityModule` bridges native notification state and
  remote voice actions.
- `MrBroccoliDiagnosticsModule` exposes device facts needed for local-model
  compatibility without placing device policy in Kotlin.
- `MrBroccoliBackupCryptoModule` supplies native cryptographic operations for
  portable encrypted backups.

**Decision:** Native modules report facts and execute OS-bound operations. They
must not independently choose providers, editions, models, fallbacks, or
conversation policy.

## Audio and Lifecycle Invariants

- Queue mutations are serialized; stop, clear, skip, interruption, and
  completion cannot resurrect an obsolete item.
- Foreground-service state follows a real active voice turn and is torn down on
  cancellation, terminal failure, app-driven stop, or completion.
- Notification actions are idempotent and use the same semantic commands as
  the React Native controller.
- Audio focus, routing changes, permission loss, and app lifecycle transitions
  produce explicit state rather than silently continuing with a different
  route.
- Waveform sampling is bounded and must not retain user audio as diagnostics.

## Release Artifact Contract

Android Release builds:

- fail when production signing material is missing or incomplete;
- never fall back to the debug signing key;
- enable R8 minification and resource shrinking;
- retain the reviewed optimized rules baseline;
- emit `SYMBOL_TABLE` native symbols and the R8 mapping;
- exclude downloadable Kokoro, Whisper, Piper, and Qwen model payloads;
- run without Expo dotenv loading; and
- satisfy the checked-in AAB, arm64, and ONNX size budgets.

The verified AAB and diagnostic evidence are archived under
`artifacts/releases/android/<version>-<code>/<aab-sha>/`.

## Verification

- JVM tests cover pure queue, backup, service-state, and waveform logic.
- Instrumentation tests exercise the native runtime, including playback and
  lifecycle races, on an attached emulator or device.
- Maestro Release coverage uses exactly one selected Android emulator and one
  physical Android device for the comprehensive release gate.
- A signed artifact is not accepted until archive, signature, package, embedded
  version, symbols, mapping, secret scan, size, and SHA-256 checks pass.

See [`../scripts/SPEC.md`](../scripts/SPEC.md) for orchestration and
[`../src/services/SPEC.md`](../src/services/SPEC.md) for the TypeScript bridge
contracts.
