# Provider currency audit — 2026-09-07

Compared every supported provider against current official documentation and public catalog metadata. The audited checkout is `main` at `741c7b6cb640d16899f786d46be5d8334e5c7cbf`. Runtime model and request configuration is the comparison baseline; the broader research catalog alone does not establish app support.

This is a findings report. No runtime changes, authenticated provider requests, paid inference, account-voice queries, releases, or pushes were performed. Public availability is not proof of access for an individual key or region. A missing retirement notice is reported as “not found”, not a guarantee of continued service. Newly released models are candidates; defaults should change only after deliberate compatibility validation.

## Recommended maintenance order

1. Correct request configuration: explicit `store: false` on Gemini and xAI one-shot search, remove deprecated Gemini STT sampling configuration, and update Qwen reasoning handling before admitting its new model families, and restrict OpenAI legacy TTS to its supported voices.
2. Add compatible missing model choices: Claude Opus 5 and Gemini 3.8/3.7 Flash, with their exact effort capabilities; refresh the corresponding curated OpenRouter routes and canonical snapshots.
3. Migrate OpenAI recorded transcription before the announced February 26, 2027 shutdown. The replacement needs request-field changes, not just a model-name substitution. Assess dedicated Gemini Transcribe as separate adapter work.
4. Review Qwen 3.8 regional support, DeepSeek's new low effort, and the ElevenLabs legacy voice fallback. Keep experimental or transport-incompatible models separate from ordinary catalog additions.
5. Track xAI Chat Completions migration. “Deprecated but supported” does not mean the app currently fails or that an unannounced cutoff can be assumed.

Detailed evidence and qualifications follow. Historical findings are not promoted into the living specs until implementation decisions are made.

**Retirement coverage limitation:** Alibaba announces an October 10, 2026 retirement batch, but its linked notices do not expose the affected-model tables through the available retrieval. Both English and Chinese official notices were checked. Current retained IDs remain listed; this is not enough to rule out a future sunset. Resolve that batch before release. [Official policy](https://www.alibabacloud.com/help/en/model-studio/model-depreciation), [Chinese notices index](https://help.aliyun.com/zh/model-studio/model-depreciation).

## OpenAI

### Current app inventory

LLM: `gpt-6-astra`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`. Default `gpt-5.6-sol`; Chat Completions transport.

STT: `gpt-4o-mini-transcribe`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`, `whisper-1`. TTS: `gpt-4o-mini-tts`, `tts-1`, `tts-1-hd`. STT models derive from `data/providers/openai/stt.ts`; TTS is explicitly curated in `runtimeManifest.ts`.

### New and retiring speech models

OpenAI announced deprecation of all four shipped STT families on August 26, 2026, with shutdown February 26, 2027. They are **deprecated but not yet discontinued**. The official deprecation page contains no shutdown notice for the currently offered LLM snapshots or these three TTS model IDs. The separate legacy Realtime beta protocol was already removed May 12, 2026; the spec must not propose implementing `OpenAI-Beta: realtime=v1` when eventually completing the currently hidden Realtime path. [Official OpenAI deprecations](https://developers.openai.com/api/docs/deprecations).

`gpt-transcribe` is the new compatible file-transcription candidate: same `/v1/audio/transcriptions` endpoint, JSON still includes `text`, with optional detected `languages`. Crucially the app currently sends singular `language`. This model instead requires `languages[]` multipart entries, e.g. `languages[]=en`, with no simultaneous singular field. Auto-detection can omit hints. Optional `prompt` and `keywords[]` are additional capabilities, not prerequisites. The documented upload limit remains 25 MB. [File transcription contract](https://developers.openai.com/api/docs/guides/speech-to-text).

`gpt-live-transcribe` is the new live-audio option, requiring the Realtime transcription workflow; it is not a drop-in for the recorded-file adapter. New file and live transcription have different intended workflows. The older diarization model remains the documented specialist for speaker labels; replacement should not claim feature parity for diarization without additional work. The app ultimately extracts plain text, so its actual need for a separate diarization picker should be reconsidered. [Transcription workflow guidance](https://developers.openai.com/api/docs/guides/transcription), [live model](https://developers.openai.com/api/docs/models/gpt-live-transcribe).

### TTS and canonical IDs

The official speech guide still identifies `gpt-4o-mini-tts` as its newest dedicated TTS model, with `tts-1` and `tts-1-hd` as alternatives. No `gpt-tts` entry was found; its official model URL returned 404. This is absence of published evidence, not an assertion about unreleased offerings. The guide limits legacy models to nine voices: alloy, ash, coral, echo, fable, onyx, nova, sage, shimmer. The app offers thirteen without model restrictions, so ballad, cedar, marin, verse can currently be selected for an incompatible legacy model. Existing `ttsVoiceSupportsModel` is ready to enforce manifest `modelIds`. [Official speech generation guide](https://developers.openai.com/api/docs/guides/text-to-speech).

Pin `gpt-4o-mini-tts-2025-12-15` instead of its rolling alias; likewise `gpt-4o-mini-transcribe-2025-12-15` if retaining mini-transcribe during migration. Both are documented default snapshots and already recorded in the repository research catalog. [Mini TTS snapshots](https://developers.openai.com/api/docs/models/gpt-4o-mini-tts), [mini transcription snapshots](https://developers.openai.com/api/docs/models/gpt-4o-mini-transcribe). Do not revive older snapshot retirement claims from community discussions: the current official retirement list is the controlling evidence.

### LLM and search configuration

Astra is already present with its documented direct ID and all five supported efforts. Chat Completions remains supported for text/images, but Astra function calling requires Responses. This app's main answer request does not expose function tools; its separate OpenAI search stage already uses Responses with `web_search`, so no forced whole-app transport migration follows from this restriction. Direct Astra has no distinct dated snapshot published. [Astra model](https://developers.openai.com/api/docs/models/gpt-6-astra), [latest-model migration guidance](https://developers.openai.com/api/docs/guides/latest-model).

GPT-5.6 Sol/Terra/Luna already cover the current ordinary model family. Their model pages now document `max`, and the Chat Completions schema includes it. The app offers only none/low/medium/high/xhigh; its specs refer to a previous max-to-xhigh restriction. This is actionable documentation drift to investigate, not proof that every account/endpoint accepts the additional effort without validation. Pro execution is a separate `reasoning.mode` feature documented for Responses, so it should not be added as another direct Chat Completions model ID. [Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol), [Terra](https://developers.openai.com/api/docs/models/gpt-5.6-terra), [Luna](https://developers.openai.com/api/docs/models/gpt-5.6-luna), [Chat request schema](https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create), [reasoning modes](https://developers.openai.com/api/docs/guides/reasoning).

## Anthropic

Current models: `claude-fable-5-1`, `claude-sonnet-5`, `claude-fable-5`, `claude-opus-4-8`, `claude-haiku-4-5-20251001`, `claude-sonnet-4-6`, `claude-opus-4-7`, `claude-opus-4-6`. Default Sonnet 5. All eight remain **Active** on the current lifecycle table. Dates such as Haiku 4.5's “not sooner than October 15, 2026” are minimum-support commitments, not announced retirement deadlines. Retired Opus 4.1, Sonnet 4, and Opus 4 are already absent. Sampling parameters temperature/top_p/top_k are deprecated for newer Claude models; the app's direct Messages request already omits them. [Claude lifecycle and parameter deprecations](https://platform.claude.com/docs/en/about-claude/model-deprecations).

**Missing addition:** `claude-opus-5`, released July 24, 2026; text/image input, text output, adaptive thinking on by default. Existing Messages transport is appropriate. No separate dated direct API ID is listed. [Opus 5 overview](https://platform.claude.com/docs/en/models/opus-5/overview).

It supports low/medium/high/xhigh/max with high default. At xhigh/max thinking cannot be disabled; the existing request's normal omission/adaptive behavior is compatible. The existing 65,536-token budget for these efforts matches the documentation's 64k starting guidance. Fable 5.1 and Sonnet 5 effort configurations already match the official guide. [Claude effort configuration](https://platform.claude.com/docs/en/build-with-claude/effort).

The app already uses `web_search_20260318`, `allowed_callers: ["direct"]`, and a five-search cap. Current official documentation confirms that version and that explicit direct callers avoid the newer default code-execution filtering path. No tool-version update is indicated by this audit. Organization admins can disable web search independently of Messages access; account readiness therefore cannot be inferred from a working chat key. [Web search contract](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool).

## OpenRouter

Fetched the complete public Models API and individually fetched `/api/v1/models/{current-id}/endpoints` for **all thirteen** shipped routes. All thirteen resolve and have provider endpoints; none has a model-level `expiration_date`. Matching must use both `id` and `canonical_slug`: most app entries are the latter and would falsely appear missing in an ID-only comparison. [Models API](https://openrouter.ai/api/v1/models), [schema and lookup documentation](https://openrouter.ai/docs/guides/overview/models).

| Current route | Provider endpoints returned |
| --- | ---: |
| `openai/gpt-6-astra-20260903` | 5 |
| `anthropic/claude-fable-5.1-20260831` | 4 |
| `openai/gpt-5.6-sol-20260709` | 7 |
| `anthropic/claude-sonnet-5-20260630` | 9 |
| `anthropic/claude-5-fable-20260609` | 6 |
| `google/gemini-3.6-flash-20260721` | 7 |
| `google/gemini-3.5-flash-lite-20260721` | 8 |
| `x-ai/grok-4.6` | 5 |
| `x-ai/grok-4.5-20260708` | 4 |
| `deepseek/deepseek-v4-pro-20260423` | 16 |
| `moonshotai/kimi-k3-20260715` | 18 |
| `mistralai/mistral-medium-3.5-20260430` | 3 |
| `qwen/qwen3.7-max-20260520` | 1 |

Focused compatible additions/refresh candidates, independently resolved through the public endpoint API:

| Canonical candidate | Endpoints | Why consider |
| --- | ---: | --- |
| `anthropic/claude-opus-5-20260723` | 10 | Missing current Claude tier. |
| `google/gemini-3.8-flash-20260902` | 6 | Newer Flash generation. |
| `qwen/qwen3.8-max-20260902` | 1 | Newer Qwen Max generation. |
| `deepseek/deepseek-v4-pro-20260813` | 19 | Updated V4 Pro snapshot; old April route still works in metadata. |

These advertise reasoning support; exact per-model effort values still require the upstream contract and curated mapping, not just the generic supported-parameter list. OpenRouter model IDs and canonical dates may differ from direct-provider release dates. [Opus endpoint evidence](https://openrouter.ai/api/v1/models/anthropic/claude-opus-5-20260723/endpoints), [Gemini endpoint evidence](https://openrouter.ai/api/v1/models/google/gemini-3.8-flash-20260902/endpoints), [Qwen endpoint evidence](https://openrouter.ai/api/v1/models/qwen/qwen3.8-max-20260902/endpoints), [DeepSeek endpoint evidence](https://openrouter.ai/api/v1/models/deepseek/deepseek-v4-pro-20260813/endpoints).

Pin existing `x-ai/grok-4.6` to documented canonical `x-ai/grok-4.6-20260810`; that canonical route independently resolved to five endpoints. [Grok endpoint evidence](https://openrouter.ai/api/v1/models/x-ai/grok-4.6-20260810/endpoints).

Additional newly listed families include Qwen3.8 Flash/open weights, Gemini3.7 Flash, experimental DeepSeek V4 Flash Vision, and OpenAI Pro variants. They are optional product curation choices, not missing mandatory replacements. Keep experimental models and Pro variants out until their distinct capabilities, request semantics, and mobile latency/cost tradeoffs are deliberately supported.

## Gemini

Current chat picker: `gemini-3.6-flash`, `gemini-3.5-flash`,
`gemini-3.5-flash-lite`, `gemini-3.1-pro-preview`, `gemini-3.1-flash-lite`,
`gemini-2.5-pro`, `gemini-2.5-flash`, `gemini-2.5-flash-lite`.
Chat defaults to 3.6 Flash through `v1beta/models/{model}:generateContent` and
its streaming counterpart. Recorded STT also uses GenerateContent, currently
with the three 3.5/3.6 Flash variants. Search uses Interactions with 3.6 Flash;
TTS uses Gemini audio generation.

| Finding | Evidence and recommendation |
| --- | --- |
| Missing new GA chat models | `gemini-3.7-flash` launched August 13 and `gemini-3.8-flash` September 2. Add canonical IDs, preferring 3.8 as the current Flash option. Both support audio input and search grounding, so they are candidates for the existing general-audio STT and search routes too. Both accept only low/medium/high thinking: **minimal returns an error**. Do not copy the 3.6 effort array unchanged. [3.8 model](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash), [3.7 model](https://ai.google.dev/gemini-api/docs/models/gemini-3.7-flash), [release notes](https://ai.google.dev/gemini-api/docs/changelog). |
| New dedicated STT integration opportunity | `gemini-3.5-transcribe` and `gemini-3.5-transcribe-live` launched August 26. The documented recorded-audio route is Interactions with audio input and transcription configuration; the live version uses WebSockets. They are **not a manifest-only replacement** for the current GenerateContent prompt-based adapter. Prioritize a dedicated recorded-STT adapter separately; preserve verbatim transcription rather than silently enabling Smart mode that removes repetitions. [Transcription guide](https://ai.google.dev/gemini-api/docs/transcribe), [model card](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-transcribe). |
| Deprecated sampling parameter still sent by STT | `src/services/whisper/providers.ts` sends `generationConfig.temperature: 0`. July 21 release notes deprecated sampling parameters; the latest migration guide says remove temperature/top-p/top-k. Remove this obsolete STT field. Chat already omits it. This is documented config drift, not a reproduced provider rejection. [Migration guidance](https://ai.google.dev/gemini-api/docs/latest-model). |
| Search silently uses server-side interaction storage | `searchWithGemini` omits `store`. Interactions defaults to true, with default retention of 55 days paid / 1 day free. Set `store: false` for this one-shot search request; the app does not need continuation IDs. This opts out of stored Interaction resources, not every form of provider retention under its terms. [Interactions storage](https://ai.google.dev/gemini-api/docs/interactions-overview#data-storage-and-retention). |
| No removal currently required for retained chat IDs | Today's official table announces no shutdown for the retained 2.5 Pro/Flash/Flash-Lite, 3.5/3.6 Flash, or 3.1 Pro Preview. `gemini-3.1-flash-lite` has an earliest shutdown of May 7, 2027, with 3.5 Flash-Lite recommended. Earlier 2.0 and retired preview variants are already absent from the picker. Do not infer retirement from model age or forum reports. [Deprecations](https://ai.google.dev/gemini-api/docs/deprecations). |
| TTS catalog already current | `gemini-3.1-flash-tts-preview`, `gemini-2.5-flash-preview-tts`, and `gemini-2.5-pro-preview-tts` remain listed. The 3.1 streaming capability is an optional adapter improvement, not a reason to drop existing non-streaming synthesis. [Model catalog](https://ai.google.dev/gemini-api/docs/models), [release notes](https://ai.google.dev/gemini-api/docs/changelog). |

Interactions became GA in June 2026 and is recommended for new work;
GenerateContent is called legacy but remains fully supported. This does not
require a wholesale chat transport migration to add the compatible Flash models.
The app's search normalizer already reads the new `steps` format, so the earlier
Interactions `outputs` → `steps` change is accounted for.
[API overview](https://ai.google.dev/gemini-api/docs/interactions-overview).
Google catalog and overview pages report last updated September 4, 2026.

## xAI

Current chat picker/default: `grok-4.6`, `grok-4.5`, `grok-4.3` (4.6 default).
The manifest correctly offers 4.6 low/medium/high/xhigh, 4.5 low/medium/high,
and 4.3 none/low/medium/high. Chat uses `/v1/chat/completions`; search uses
`/v1/responses` with default `grok-4.3` and alternative `grok-4.5`.
Recorded STT uses `/v1/stt`; TTS uses `/v1/tts`. STT `grok-stt` and TTS
`text-to-speech` are local route identifiers: neither speech request sends a
model parameter. Their catalog naming is not evidence of a retired endpoint.

| Finding | Evidence and recommendation |
| --- | --- |
| Chat catalog current | Grok 4.6 launched August 12 and remains the documented flagship. No newer compatible general chat model found. Its model page explicitly lists Chat Completions and Responses and the existing effort set. No separate dated canonical 4.6 snapshot was found in the inspected official pages; do not invent one from the general alias naming convention. [4.6 documentation](https://docs.x.ai/developers/grok-4-6), [release notes](https://docs.x.ai/developers/release-notes). |
| Chat endpoint deprecated, not shown as shut down | The comparison page labels Chat Completions deprecated, while the 4.6 page explicitly supports it. Track a Responses migration as planned compatibility work; no removal deadline was found. Existing search already uses Responses. [API comparison](https://docs.x.ai/developers/model-capabilities/text/comparison). |
| Search storage should be explicitly disabled | `searchWithXai` omits `store`; Responses stores by default for 30 days. Add `store: false` for one-shot web grounding. This does not promise zero provider operational/abuse retention. [Text generation](https://docs.x.ai/developers/model-capabilities/text/generate-text). |
| Search could offer 4.6 | The provider documents 4.6 web search support, but the app's search picker stops at 4.5. Add as an option after a bounded-output reasoning review; do not automatically replace the deliberately cheaper 4.3 default. [4.6 tools](https://docs.x.ai/developers/grok-4-6), [web search](https://docs.x.ai/developers/tools/web-search). |
| Earlier retirements already accounted for | May 15 retirements cover old 4/4.1 fast, Grok 3, and coding variants, not retained 4.3/4.5/4.6. The app already excludes those old choices. [Retirement notice](https://docs.x.ai/developers/migration/may-15-retirement). |
| Speech contracts remain compatible; optional controls added | Recorded STT supports a `vad_threshold` multipart field (default 0.5), added July 23. The app relies on the default. TTS still accepts text/voice_id/language without model; omitted output format remains MP3. Optional speed, timestamps, and pronunciation replacement exist; timestamps change the response into JSON and must not simply be enabled on the binary adapter. Built-in/custom voice discovery endpoints match the app. [STT](https://docs.x.ai/developers/model-capabilities/audio/speech-to-text), [TTS](https://docs.x.ai/developers/model-capabilities/audio/text-to-speech). |
| Speech-to-speech is a separate feature | `grok-voice-think-fast-2.0` arrived July 29, with the rolling voice alias changing August 5. The app has separate recorded-STT, text generation, and TTS stages; do not add this model to any of their existing pickers. [Release notes](https://docs.x.ai/developers/release-notes). |

An optional cache-affinity improvement is the documented `x-grok-conv-id`
header for Chat Completions (Responses uses `prompt_cache_key`); the app does
not currently send it. This is a cost/performance opportunity, not required
request validity. The 4.6/model docs report last updated August 21, while the
retirement page includes a September 2 update.

## DeepSeek

**Retained models remain current:** `deepseek-v4-flash` and `deepseek-v4-pro`. The official updates page says Flash changed July 31 and Pro reached GA August 13 without changing those API IDs. Historical training labels such as V4-Flash-0731 do not by themselves establish an addressable snapshot on the direct DeepSeek API. Do not substitute Alibaba-hosted snapshot IDs into the direct provider. The old `deepseek-chat` and `deepseek-reasoner` names were scheduled for discontinuation July 24; neither is retained by this manifest. [Official updates](https://api-docs.deepseek.com/updates/)

**Actionable configuration gap:** both retained models now support `low`, `high`, and `max` thinking effort; app offers only disabled/high/max. Add low at the existing DeepSeek effort boundary. Thinking remains enabled/high by default. Temperature/top-p penalties are ignored during thinking; there is no need to invent a new transport. Direct Chat Completions remains supported. [Thinking contract](https://api-docs.deepseek.com/guides/thinking_mode/)

**New optional model:** `deepseek-v4-flash-vision-exp`, released August 21, is experimental. It uses image-bearing Chat Completions but requires capability and image-message changes because the app currently marks all DeepSeek routes text-only. Treat it as an explicit preview addition, not an automatic replacement of stable Flash. [Vision guide](https://api-docs.deepseek.com/guides/vision/), [release announcement](https://api-docs.deepseek.com/updates/)

No direct DeepSeek STT, TTS, or web-search route was established by the reviewed docs. Responses support is an additional option, not a requirement to migrate the current chat transport.

## Mistral

The six retained chat IDs match the current first-party generalist catalogue: `mistral-medium-3-5`, `mistral-small-2603`, `mistral-large-2512`, and `ministral-{14b,8b,3b}-2512`. None appears in the current deprecated/retired table. Medium 3.5's new naming convention is already respected. Retired older Medium/Small/Magistral/Devstral entries do not require removing any current app entry. [Model catalogue](https://docs.mistral.ai/models), [lifecycle policy](https://docs.mistral.ai/inference/model-lifecycle)

**Optional new hosted route:** `zai-glm-5-2`, public preview, is a third-party text model hosted by Mistral, introduced August 6. It is absent from the app. It should not inherit Mistral's provider-wide image support or first-party reasoning assumptions. The provider model card establishes its identifier and Chat Completions support; additional exact reasoning-message tests are required before adding it. [Model card](https://docs.mistral.ai/models/zai-glm-5-2)

Speech IDs remain aligned: STT `voxtral-mini-2602`, TTS `voxtral-mini-tts-2603`. The TTS model card explicitly lists the latter even though the release changelog uses the shorter `voxtral-tts-2603` spelling. Do not replace the working card's canonical ID solely because the changelog differs. No newer compatible first-party STT/TTS model was found. Realtime transcription needs a different integration. [Audio catalogue](https://docs.mistral.ai/models), [TTS card](https://docs.mistral.ai/models/voxtral-tts-26-03), [changelog](https://docs.mistral.ai/resources/changelogs)

The existing voice-directory path is current. The current search endpoint is also correct: `web_search` and `web_search_premium` belong on `/v1/conversations` or Agents, not Chat Completions. The app uses Conversations with `store:false`; no required search endpoint change was found. [Voice API](https://docs.mistral.ai/api/endpoint/audio/voices), [built-in tool contract](https://docs.mistral.ai/studio/agents/agent-tools)

## ElevenLabs

All retained speech models are current: `scribe_v2`, `eleven_flash_v2_5`, `eleven_multilingual_v2`, and `eleven_v3`. The catalogue recommends Flash over the deprecated Turbo generations and v2 Scribe over v1. Removed v1 TTS models are not retained. Realtime Scribe, dialogue, voice design, music, and sound effects are separate APIs/features, not missing drop-in choices for the existing file STT/single-voice TTS adapter. [Model catalogue](https://elevenlabs.io/docs/overview/models), [v1 removal notice](https://elevenlabs.io/docs/changelog/2026/6/8)

**Confirmed voice drift:** the app's fallback `21m00Tcm4TlvDq8ikWAM`, labelled Rachel, is a legacy voice. ElevenLabs explicitly maps Rachel to Janet and says legacy API IDs automatically route to their replacements. This is a changed voice identity/timbre, not documented request failure. Update the displayed fallback identity or deliberately migrate to a verified current default ID. [Voice migration](https://elevenlabs.io/docs/help-center/product/voices/voice-library/how-are-voices-updated-changed), [legacy voice policy](https://elevenlabs.io/docs/help-center/product/voices/my-voices/what-are-legacy-voices)

**Unverified:** the reviewed primary pages do not publish Janet's replacement ID or expressly guarantee this redirect for every restricted key lacking `voices_read`. Do not invent an ID or claim that account-specific fallback was live-tested. Preserve the fallback architecture; a future authorized speech test should exercise a TTS-only key. The existing `/v2/voices` directory is current and independently permissioned. [Directory API](https://elevenlabs.io/docs/api-reference/voices/search)

## Alibaba Qwen / DashScope

### New compatible candidates

| Candidate | Documentation status | App implications |
| --- | --- | --- |
| `qwen3.8-max-0902` | September 2 snapshot; documented alternative alias `qwen3.8-max-2026-09-02` | Prefer the documented snapshot ID `qwen3.8-max-0902` over rolling `qwen3.8-max`; test new reasoning configuration. |
| `qwen3.8-flash` | August 26 model | No separate dated snapshot was found. Keep this exact documented ID if selected; do not fabricate one. |
| `qwen3.7-flash-2026-07-15` | Missing dated Flash generation | Compatible curated option, though 3.8 Flash is newer. |
| `qwen3.7-max-2026-06-08` | Newer retained-family snapshot | Existing app uses May 20. June snapshot adds documented visual support. |
| `qwen3.5-plus-2026-04-20` | Newer retained-family snapshot | Existing app uses February 15. Optional refresh; not evidence that February is retired. |

Release dates and exact identifiers come from [release history](https://www.alibabacloud.com/help/en/model-studio/newly-released-models); current supported families and older snapshots remain listed in the [text model contract](https://www.alibabacloud.com/help/en/model-studio/text-generation-model). New open-weight `qwen3.8-2.4t-a95b` and `qwen3.8-27b` are also hosted candidates, but need separate capability curation rather than indiscriminate catalogue expansion.

### Retained IDs and retirement confidence

| Retained chat ID | Current evidence | Retirement verdict |
| --- | --- | --- |
| `qwen3.7-plus-2026-05-26` | Current text/Responses supported list | No retirement established. |
| `qwen3.7-max-2026-05-20` | Current legacy family snapshot list | Superseded snapshot; no retirement established. |
| `qwen3.6-flash-2026-04-16` | Current legacy family snapshot list | Legacy recommendation; no retirement established. |
| `qwen3.6-plus-2026-04-02` | Current Responses supported list | Legacy recommendation; no retirement established. |
| `qwen3.5-plus-2026-02-15` | Current Responses supported list | Older snapshot; no retirement established. |
| `qwen3.5-flash-2026-02-23` | Current Responses supported list | Legacy recommendation; no retirement established. |
| `qwen-plus-2025-12-01` | Current pricing catalogue, Singapore and other regions | No retirement established. |
| `qwen-flash-2025-07-28` | Current pricing catalogue | No retirement established. |

Evidence: [text catalogue](https://www.alibabacloud.com/help/en/model-studio/text-generation-model), [Responses supported models](https://www.alibabacloud.com/help/en/model-studio/qwen-api-via-openai-responses), [pricing catalogue](https://www.alibabacloud.com/help/en/model-studio/model-pricing).

**Limit:** Alibaba's current decommissioning page announces a batch for October 10, 2026, but its English extraction omits the per-model tables and linked notice pages returned empty bodies or bot checks. Therefore this audit does not certify that all eight retained IDs are free of announced future retirement. Current listing is positive availability evidence, not proof against a future sunset. The exact October batch remains a follow-up before release. [Decommissioning policy](https://www.alibabacloud.com/help/en/model-studio/model-depreciation)

### Configuration changes

**Qwen3.8 is more than a picker addition.** Chat Completions now documents reasoning levels `low`, `medium`, `xhigh` (plus mapped values); `none` disables thinking. `reasoning_effort` and `thinking_budget` cannot be supplied together. `preserve_thinking` defaults true for 3.8, unlike older Qwen. The app currently sends only an enable/disable toggle and does not preserve Qwen reasoning history. Choose explicitly whether to disable preservation or implement its structured round-trip. Missing history is documented not to error, but can reduce the intended behavior. [Chat request contract](https://www.alibabacloud.com/help/en/model-studio/qwen-api-via-openai-chat-completions)

**Search deprecation warning:** `/compatible-mode/v1/responses` is the correct current path, and the app's retained search models are supported. However, `enable_thinking` is slated for deprecation in Responses; use `reasoning: { effort: "none" }` for the search brief after a targeted contract test. No removal date is given. Current use is deprecated-direction debt, not proof of today's search failure. [Responses request contract](https://www.alibabacloud.com/help/en/model-studio/qwen-api-via-openai-responses)

**Regions:** official scope lists include both 3.8 candidates in Singapore/International, Beijing/Chinese mainland, and Virginia/Global. Current DashScope regional hosts remain supported; workspace-specific domains are recommended, not a mandatory immediate migration. The app lacks Frankfurt/Tokyo/Hong Kong/workspace support. Region and inference scope are distinct: unsuffixed models through the Virginia endpoint use Global scope, not necessarily US-only processing. Do not label the existing `us` selector a US-residency guarantee. [Regional domains and scope](https://www.alibabacloud.com/help/en/model-studio/regions/), [regional model lists](https://www.alibabacloud.com/help/en/model-studio/context-cache)

Do not add `qwen3.8-max-preview` to ordinary BYOK: it is Token Plan-exclusive and requires its plan key/base URL. [Provider error contract](https://www.alibabacloud.com/help/en/model-studio/error-code)

### Speech pinning

The app retains aliases where documented snapshots exist:

- STT `qwen3-asr-flash` currently resolves to `qwen3-asr-flash-2025-09-08`; a newer compatible `qwen3-asr-flash-2026-02-10` is documented for Singapore and Beijing. Pinning February is an upgrade, not merely alias substitution. [STT guide](https://www.alibabacloud.com/help/en/model-studio/non-realtime-speech-recognition-user-guide)
- TTS `qwen3-tts-flash` resolves to `qwen3-tts-flash-2025-11-27`; `qwen3-tts-instruct-flash` resolves to `qwen3-tts-instruct-flash-2026-01-26`. These HTTP snapshots fit the current native multimodal route and the repository's canonical-ID rule. Update defaults, fallbacks, voice model filters, and instruction support together. No retirement of these speech routes was established. [TTS guide](https://www.alibabacloud.com/help/en/model-studio/non-realtime-tts-user-guide), [speech model capabilities](https://www.alibabacloud.com/help/en/model-studio/tts-model/)

## Audited runtime inventory

Source: `src/constants/providers/runtimeManifest.ts` and `src/constants/webSearch.ts` at `741c7b6cb640d16899f786d46be5d8334e5c7cbf`. Nine providers, 58 chat routes, 11 transcription routes, 13 speech-synthesis routes, and six search integrations. Counts are provider/model entries, not distinct model families.

### openai

- LLM: `gpt-6-astra`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5-2026-04-23`, `gpt-5.4-2026-03-05`, `gpt-5.4-mini-2026-03-17`, `gpt-5.4-nano-2026-03-17`, `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`.
- STT: `gpt-4o-mini-transcribe`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`, `whisper-1`.
- TTS: `gpt-4o-mini-tts`, `tts-1`, `tts-1-hd`.
- Search candidates: `gpt-5.6-sol`, `gpt-5.5-2026-04-23`, `gpt-4.1-mini-2025-04-14`.

### openrouter

- LLM: `openai/gpt-6-astra-20260903`, `anthropic/claude-fable-5.1-20260831`, `openai/gpt-5.6-sol-20260709`, `anthropic/claude-sonnet-5-20260630`, `anthropic/claude-5-fable-20260609`, `google/gemini-3.6-flash-20260721`, `google/gemini-3.5-flash-lite-20260721`, `x-ai/grok-4.6`, `x-ai/grok-4.5-20260708`, `deepseek/deepseek-v4-pro-20260423`, `moonshotai/kimi-k3-20260715`, `mistralai/mistral-medium-3.5-20260430`, `qwen/qwen3.7-max-20260520`.

### anthropic

- LLM: `claude-fable-5-1`, `claude-sonnet-5`, `claude-fable-5`, `claude-opus-4-8`, `claude-haiku-4-5-20251001`, `claude-sonnet-4-6`, `claude-opus-4-7`, `claude-opus-4-6`.
- Search candidates: `claude-sonnet-5`, `claude-haiku-4-5-20251001`, `claude-sonnet-4-6`.

### alibaba-qwen-dashscope

- LLM: `qwen3.7-plus-2026-05-26`, `qwen3.7-max-2026-05-20`, `qwen3.6-flash-2026-04-16`, `qwen3.6-plus-2026-04-02`, `qwen3.5-plus-2026-02-15`, `qwen3.5-flash-2026-02-23`, `qwen-plus-2025-12-01`, `qwen-flash-2025-07-28`.
- STT: `qwen3-asr-flash`.
- TTS: `qwen3-tts-flash`, `qwen3-tts-instruct-flash`.
- Search candidates: `qwen3.7-plus-2026-05-26`, `qwen3.6-flash-2026-04-16`, `qwen3.5-flash-2026-02-23`.

### gemini

- LLM: `gemini-3.6-flash`, `gemini-3.5-flash`, `gemini-3.5-flash-lite`, `gemini-3.1-pro-preview`, `gemini-3.1-flash-lite`, `gemini-2.5-pro`, `gemini-2.5-flash`, `gemini-2.5-flash-lite`.
- STT: `gemini-3.6-flash`, `gemini-3.5-flash`, `gemini-3.5-flash-lite`.
- TTS: `gemini-3.1-flash-tts-preview`, `gemini-2.5-flash-preview-tts`, `gemini-2.5-pro-preview-tts`.
- Search candidates: `gemini-3.6-flash`, `gemini-3.5-flash`, `gemini-3.5-flash-lite`.

### xai

- LLM: `grok-4.6`, `grok-4.5`, `grok-4.3`.
- STT: `grok-stt`.
- TTS: `text-to-speech`.
- Search candidates: `grok-4.3`, `grok-4.5`.

### deepseek

- LLM: `deepseek-v4-flash`, `deepseek-v4-pro`.

### mistral

- LLM: `mistral-medium-3-5`, `mistral-small-2603`, `mistral-large-2512`, `ministral-14b-2512`, `ministral-8b-2512`, `ministral-3b-2512`.
- STT: `voxtral-mini-2602`.
- TTS: `voxtral-mini-tts-2603`.
- Search candidates: `mistral-medium-3-5`, `mistral-small-2603`, `mistral-large-2512`.

### elevenlabs

- STT: `scribe_v2`.
- TTS: `eleven_flash_v2_5`, `eleven_multilingual_v2`, `eleven_v3`.


## Implementation follow-through

The user subsequently authorized implementation, individual commits, and a push.
The inventory above is the pre-change audit baseline; the runtime manifest and
[provider reference](provider-runtime-reference.md) describe the updated app.

Implemented in focused commits:

- Added direct Opus 5, Gemini 3.7/3.8 Flash, Qwen 3.8 Max/Flash and 3.7 Flash,
  plus the new curated OpenRouter snapshots and canonical Grok 4.6 route.
- Added DeepSeek low effort and the Qwen 3.8 reasoning/preserve-thinking contract.
- Disabled optional Gemini/xAI search resource storage, updated Qwen search
  reasoning controls, and removed deprecated Gemini transcription sampling.
- Added Grok 4.6 search fallback with low effort and 4,096-token headroom,
  including a larger spend reservation in the release-test plan.
- Added OpenAI GPT Transcribe with its multipart language-array contract and
  Gemini 3.5 Transcribe with inline Interactions audio, verbatim mode,
  completed-output parsing, `store: false`, and a conservative 14 MB raw-file
  ceiling. Gemini's inline audio schema and total 20 MB request limit are
  documented in the [Interactions reference](https://ai.google.dev/api/interactions-api)
  and [audio guide](https://ai.google.dev/gemini-api/docs/audio).
- Pinned OpenAI mini speech and Qwen speech snapshots, retained saved speech
  family and voice selections, restricted legacy OpenAI TTS voices, and corrected
  ElevenLabs' built-in voice name to Janet.
- Corrected the hidden Realtime adapter's documented prerequisite to GA; the
  retired beta protocol is not a valid implementation target.

Deliberately deferred: experimental DeepSeek vision and Mistral third-party
preview routes, live transcription adapters, wholesale replacement of supported
chat transports, and GPT-5.6 `max` until its previous endpoint rejection can be
rechecked in an explicitly authorized live release matrix. The Alibaba October
retirement batch still needs an accessible authoritative affected-model table.
No model was removed based on that unresolved notice. Existing deprecated
OpenAI transcription selections remain usable during their announced migration
window, with GPT Transcribe as the new default.

Validation uses request-contract, migration, picker, and spend-reservation tests
plus the complete spend-free pre-push gate. No provider quota is spent by this
maintenance batch; account access and live acceptance remain release checks.
