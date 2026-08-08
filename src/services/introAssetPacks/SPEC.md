---
status: active
code_paths:
  - src/services/introAssetPacks/**
  - src/components/introFlow/introClips.ts
  - ios/MrBroccoli/MrBroccoliIntroAssetPacks.swift
  - android/app/src/main/java/com/tobiaswinkler/app/mrbroccoli/MrBroccoliIntroAssetPacksModule.kt
  - android/intro_audio_*/
dependencies:
  - BackgroundAssets (iOS 26+, Apple-hosted asset packs)
  - "com.google.android.play:asset-delivery"
  - App Store Connect and Play Console asset pack uploads
validations:
  - npm test -- --runInBand --watchman=false __tests__/services/introAssetPacks.test.ts __tests__/components/IntroFlow.test.tsx
  - npm run typecheck:app
provenance:
  intent: owner-confirmed
  validation: test-backed
---

# Intro Asset Pack Specification

## Purpose

Store-hosted delivery for the intro audio examples.

Every interface language has an example clip and a user opens one, occasionally
two. At full-length answers the complete set is roughly eighty megabytes, and
audio does not benefit from the ABI splitting that makes the rest of the app
shrink on delivery — it would land on every install almost whole. Both stores
host packs at no cost and serve them on request, so the app ships without the
audio and fetches the language someone actually opens.

**Decision:** Apple-hosted Background Assets over On-Demand Resources. ODR is
Apple-hosted at a lower floor, but Apple is steering adoption toward Background
Assets, and building on the API being moved away from means doing the work
twice.

## Platform Floors

`AssetPackManager` is `API_AVAILABLE(ios(26))`. That is a feature floor, not an
app floor: the deployment target stays 16.4, calls are gated behind
`@available(iOS 26.0, *)`, and an older system reports unsupported.

Only the iOS 26.0 surface is used. The 26.4 additions
(`assetPackIsAvailableLocally`, `status(relativeTo:)`) are conveniences over
calls that already exist at 26.0, so depending on them would raise the feature
floor by a point release for no capability.

Play Asset Delivery has no comparable floor and is available wherever the app
was installed through Play.

## Failure Is Silence

No path here rejects into the UI. Unsupported platform, a device below iOS 26,
a sideloaded build, no network, a pack that was never uploaded — all resolve to
null, and the intro sheet shows its transcript.

**Decision:** An optional example must never produce an error state. The
transcript carries the same content, so a failed download costs presentation,
not meaning.

Downloading happens only when the user presses play. Availability is probed
first through a local-only lookup so the sheet can offer a play control without
spending someone's data unasked.

## Pack Shape

One pack per language, `intro-audio-<language>` on iOS and
`intro_audio_<language>` on Android — Play rejects hyphens in pack names. Each
holds one file, `intro-<language>.m4a`. Android packs are Gradle modules under
`android/intro_audio_*/` with `deliveryType = "on-demand"`, registered in
`settings.gradle` and attached through the app module's `assetPacks`.

## Scripts Stay In The Repository

The spoken text lives in `src/components/introFlow/introScripts.ts`, not in the
locale dictionaries.

**Decision:** Scripts are content, not interface copy. The dictionaries enforce
structural parity across all nineteen locales, which would demand nineteen
translations of a five-hundred-word text before the first recording exists. A
language gets a script when its clip is recorded.

Keeping them checked in is the point: audio is invisible to a diff, so a
mistranslation inside a recording cannot be caught by reading one. Recordings
are generated from the approved text here.

## Evidence

- [`index.ts`](./index.ts)
- [`../../components/introFlow/introClips.ts`](../../components/introFlow/introClips.ts)
- [`../../../__tests__/services/introAssetPacks.test.ts`](../../../__tests__/services/introAssetPacks.test.ts)
