---
status: active
code_paths:
  - ios/**
dependencies:
  - Expo and React Native iOS runtime
  - StoreKit
  - ActivityKit
validations:
  - npm run config:verify
  - make ios-native-test
provenance:
  intent: source-and-release-history-backfilled
  validation: native-test-backed
last_validated_sha: 7db5c94
---

# iOS Native Specification

## Purpose

The iOS project implements Apple-platform lifecycle, audio, ActivityKit,
archive, cryptography, entitlement, and distribution behavior. Shared
TypeScript owns product policy; native modules expose focused capabilities.

## Identity and Configuration

- Production bundle identifier is `com.tobiaswinkler.app.mrbroccoli`.
- Local standalone builds append `.dev`; Maestro Release builds append
  `.maestro`. Their Live Activity extensions and test bundles retain matching
  isolated identities.
- The normal Release scheme remains production. Local suffix overrides are
  supplied only by the checked-in standalone and Maestro scripts.
- Entitlements, privacy manifest, URL types, background modes, deployment
  target, build number, and Expo config are verified for parity.
- `MrBroccoli-StoreKit` uses the checked-in StoreKit configuration for local
  purchase testing; it is not evidence of App Store product availability.

## Native Responsibilities

- `MrBroccoliNativeAudioQueue` and its coordinator/session own ordered playback,
  audio-session transitions, interruptions, and route changes.
- `MrBroccoliNativeWaveform` and the `Waveform/` subsystem own recording/file
  analysis, bounded level delivery, rendering, and interruption policy.
- `MrBroccoliBackgroundVoiceTurn` keeps an authorized active turn alive across
  supported background transitions.
- `MrBroccoliVoiceLiveActivity` bridges ActivityKit state and remote voice
  actions to the Live Activity extension.
- `MrBroccoliBackupCrypto` supplies native cryptographic operations for
  passphrase-encrypted portable backups.
- `MrBroccoliArchiveDirectory` exposes the user-visible archive destination
  while preserving app-owned file lifecycle.

**Decision:** Native code owns Apple lifecycle mechanics, not independent
conversation, edition, provider, or fallback policy.

## Audio and Lifecycle Invariants

- Audio-session activation and restoration are balanced across recording,
  synthesis playback, native/system speech, interruption, cancellation, and
  route changes.
- Queue callbacks are generation-safe: completion from an obsolete item cannot
  advance or resurrect a cleared queue.
- Background continuation exists only for an active user-authorized voice turn
  and ends on completion, cancellation, terminal failure, or expiry.
- Live Activity actions are idempotent and converge on the same controller
  commands used by the visible app.
- Waveform analysis emits bounded levels and never turns audio samples into
  debug-log payloads.

## Premium and Distribution

StoreKit is the authority for production Premium entitlement. The app may cache
a locally verified entitlement for resilient startup, but production cannot
activate Premium through a bundle flag or hidden settings control. Restoration
is same-platform and does not imply an Mr Broccoli account service.

App Store distribution is performed from a reviewed Xcode Archive built from
the intended pushed commit. Native dependency, icon, entitlement, privacy, and
extension changes require a new archive; an OTA JavaScript update cannot prove
or deliver them.

## Verification

- `MrBroccoliNativeLifecycleTests` exercises playback, audio-session
  interruption, background-turn, waveform, and queue race behavior on exactly
  one booted simulator selected by the release tooling.
- Maestro Release validation covers every registered interface locale, known
  landscape layout, accessibility display modes, and VoiceOver hierarchy.
- Store-promo automation builds the `.maestro` identity and captures
  deterministic localized states without provider calls.
- Xcode signing and App Store processing remain external distribution evidence;
  a simulator build is not a substitute.

See [`../scripts/SPEC.md`](../scripts/SPEC.md) for orchestration and
[`../src/services/SPEC.md`](../src/services/SPEC.md) for the TypeScript bridge
contracts.
