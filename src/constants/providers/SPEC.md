---
status: active
code_paths:
  - src/constants/providers/**
  - src/constants/models.ts
  - src/utils/providerCapabilities.ts
  - src/utils/responseModes.ts
dependencies:
  - data/providers/
  - src/services/runtimeCapabilityOverrides.ts
validations:
  - npm test -- --runInBand --watchman=false __tests__/constants/providers/runtimeManifest.test.ts __tests__/utils/responseModes.test.ts __tests__/utils/modelEffort.test.ts
  - npm run typecheck:app
provenance:
  intent: owner-confirmed and history-backfilled
  validation: test-backed
last_validated_sha: b33648e
---

# Runtime Provider Manifest Specification

## Ownership

`runtimeManifest.ts` is the runtime authority for hosted provider identity,
order, transports, curated model routes, reasoning-effort mapping, key guidance,
STT/TTS capability, speech languages, voice defaults, and voice directories.

`src/constants/models.ts`, picker helpers, route normalization, request
services, and release validation derive from this manifest. `data/providers/`
contains attributed model cards for every curated answering route, along with
broader vendor research. OpenRouter cards identify both the public alias and
canonical snapshot and carry the gateway's own published limits and base rates.
Public vendor speech capability and the app's wired transports are recorded
independently.

## Runtime Provider Set

The runtime contains nine provider IDs:

- LLM-capable: `openai`, `openrouter`, `anthropic`, `gemini`, `xai`,
  `mistral`, `deepseek`, and `alibaba-qwen-dashscope`;
- speech-only: `elevenlabs`.

The ordering is user-visible and stable unless intentionally migrated.
Per-provider maps use the complete runtime provider union so TypeScript catches
an incomplete addition or removal.

## Curated Model Rule

Model lists are an executable product contract, not provider inventory dumps.
A listed route must:

- work through an implemented transport and endpoint shape;
- have a usable, user-facing identity;
- expose only supported reasoning-effort options;
- correctly describe image, STT, TTS, language, and instruction capability;
- participate in defaults, fallback candidates, Settings normalization, and
  release testing; and
- satisfy current provider terms and distribution constraints.

**Decision:** Prefer a canonical stable snapshot over a rolling alias when a
provider offers both for the same model. Keep an alias only when no distinct
stable ID exists. This makes saved routes, diagnostics, and release evidence
reproducible.

OpenAI models currently use the implemented Chat Completions shape; Anthropic
uses Messages; Gemini uses Generate Content. A model requiring a different API
is excluded until its service path exists. OpenAI Realtime model IDs remain
mapped to the incomplete WebSocket adapter for leftover stored routes and
tests, but they are withheld from the user-facing picker until the Realtime
GA session protocol (including `session.update`) is implemented. The retired
`OpenAI-Beta: realtime=v1` protocol must not be restored.

Gemini offers `gemini-3.5-transcribe` through its manifest-owned Interactions
endpoint. Other recorded-audio models retain GenerateContent and the existing
3.6 default.

### Current model and effort contracts

The November catalogue includes GPT-6.2 Astra and Sol, GPT-6.1 Terra and Sol,
Claude Fable 5.2, Sonnet 5.5 and Haiku 5.5, Qwen4-Max, Gemini 4 Neon,
Hydrogen, Carbon and Argon, and Mistral Large 4. Each direct route and its
gateway counterpart has its own documented effort range and default. Grok 4.7
and DeepSeek V4.1 Flash remain their providers' current answering models.
Existing usable direct and gateway routes retain their IDs. OpenRouter accepts
its public model aliases on settings import and stores their canonical snapshots.
xAI recorded transcription stores and sends `grok-voice-transcribe-2.0`. The
previous app identifier and the retired 1.0 model resolve to the same model.

Gemini 4 Neon and Hydrogen support low, medium, high and extra-high thinking,
with a high default. Carbon and Argon support low, medium and high, with a medium
default. Google's unconditional redirects from Gemini 3.7 Flash to 3.8 Flash,
and from 3.5 Flash to 3.6 Flash, are normalized on settings load. The original
effort survives when supported by the serving model.

The two GPT-6.2 models and GPT-6.1 Sol accept low through max. GPT-6.1 Terra
also accepts none. The existing GPT-5.6 downgrade applies only to the older
Chat Completions contract. Claude Fable 5.2 and Sonnet 5.5 default to high,
and Haiku 5.5 defaults to medium. Their Messages API effort field is
`output_config.effort`. Restricted Mythos models and premium execution SKUs
remain outside the curated picker.

Qwen4-Max offers its four distinct settings (none, low, high, extra high) and
defaults to high. Qwen 3.8 offers none, low, medium and extra high. Both use
`reasoning_effort` and disable historical reasoning replay. Older routes use
the previous thinking toggle. Direct Mistral Large 4 always reasons and uses
low, medium or high (default high). OpenRouter uses unified `reasoning.effort`
and requires supporting endpoints whenever an effort is selected.

Voxtral 3 is the Mistral default for recorded transcription and synthesis.
The provider's legacy IDs retain their narrower per-model language lists.
Scribe v3 and v2 both use the recorded-file endpoint. Eleven v4 and v4 Turbo
use the existing single-voice speech endpoint. Speech model metadata supplies
the language and upload bounds shown in Settings and used by the service.

The [November provider audit](../../../docs/provider-audit-2026-11-20.md)
records sources, dates, route coverage and deprecations for all nine providers.

**Decision:** Qwen offers chat and search only. Alibaba retires every DashScope
speech snapshot the app used (Qwen3-ASR-Flash and both Qwen3-TTS-Flash
families) on 2026-10-10. Its recommended successors, Fun-ASR and CosyVoice,
use different APIs and voices and are not region-complete, so they are not
drop-in replacements. Saved Qwen speech selections fall back to native speech.
Rejected alternative: pinning the rolling aliases, which have no published
successor snapshot and no US-region parity. Re-adding Qwen speech requires a
new adapter.

OpenAI defaults new recorded-transcription selections to `gpt-transcribe`.
Older transcription routes remain selectable until their announced February
2027 retirement; mini-transcribe uses its December 2025 canonical snapshot.
Existing saved choices are pinned, not silently switched to a different model.

OpenAI mini-TTS is pinned to December 2025. Ballad, Cedar, Marin, and Verse
are mini-TTS-only voices; legacy TTS exposes only its nine supported voices.
Saved mini-TTS aliases migrate without changing voice identity.

ElevenLabs keeps the legacy fallback voice ID because the provider redirects
it to Janet. The displayed identity is Janet; no unverified replacement ID or
new voice-directory permission requirement is introduced.

**Decision:** A model the provider serves only to accounts that already used
it is marked `existingAccessOnly`. It stays valid for saved routes, fallback
normalization, and release testing, but pickers, new-mode suggestions, and
derived defaults do not offer it unless it is the current selection. Google
limited Gemini 2.5 Pro, Flash, and Flash-Lite this way on 2026-09-18.
Google schedules automatic redirects of 2.5 Pro and Flash for December 1, 2026. Rejected alternatives: removing the models, which would break
accounts that still have access, and keeping them as ordinary choices, which
would fail for most new keys.

Gemini TTS defaults new selections to GA `gemini-3.8-flash-lite-tts`, Google's
named replacement for the 3.1 preview; saved 3.1 selections are kept. The
deprecated 2.5 Flash and Pro TTS previews migrate to 3.8 Flash-Lite and Flash
with the same prebuilt voice.

## Capability Boundaries

LLM, STT, TTS, search, and voice discovery are independent capabilities. A
provider can support any subset, and a key can have permission for one while
failing another.

- `support: none` means the route is not offered.
- A transport value selects the concrete request adapter.
- Default and fallback model IDs must be members of the corresponding curated
  model list.
- Speech language lists describe the provider route, not guaranteed system
  speech availability.
- Voice-directory providers retain a safe fallback list for restricted keys or
  temporarily unavailable directories.

## Runtime Overrides

Device-local overrides remove a precise model or effort only after an explicit
provider response confirms it is unsupported. They filter candidate routes and
Settings options and may trigger normalization.

**Decision:** Overrides are evidence, not remote feature flags. They stay local,
inspectable, and resettable. Authentication, credit, quota, rate-limit,
capacity, network, timeout, generic 404, and server failures are not durable
compatibility evidence.

## Provider Change Checklist

Adding, removing, or changing a provider requires reviewing:

- this manifest, runtime order/state, defaults, and retired-provider migration;
- `src/constants/models.ts` and provider capability helpers;
- response-mode and reasoning-effort normalization;
- Settings connection, picker, readiness, and voice-directory behavior;
- LLM, STT, TTS, and web-search request services;
- provider branding assets;
- API-key SecureStore migration and backup exclusions;
- live matrix derivation, cost reservation, and provider terms; and
- focused manifest, route, settings, and service tests.

## Evidence

- [`runtimeManifest.ts`](./runtimeManifest.ts)
- [`runtimeState.ts`](./runtimeState.ts)
- [`defaults.ts`](./defaults.ts)
- [`retiredProviders.ts`](./retiredProviders.ts)
- [`../../../__tests__/constants/providers/runtimeManifest.test.ts`](../../../__tests__/constants/providers/runtimeManifest.test.ts)
