# Provider Runtime Reference

Last updated: 2026-07-31

This document tracks the providers that are present in Mr Broccoli's runtime
manifest. The source of truth is `src/constants/providers/runtimeManifest.ts`;
this file is a human-readable reference for product and maintenance decisions.

## Runtime Policy

- Runtime providers must be useful for the voice-first conversation loop.
- Dedicated web-search and web-data vendors are no longer runtime providers.
- Model pickers are curated. They intentionally exclude deprecated,
  alias-only, wrong-endpoint, coding-only, image/video-only, Chinese-only, and
  Mandarin-only rows.
- Provider-native web search is exposed only when `src/services/webSearch.ts`
  has an app-wired integration path.
- Speech providers are exposed only when the app has a straightforward BYOK
  route useful to non-Chinese users.

## Removed Runtime Providers

The following providers are intentionally absent from runtime settings,
validation, API-key storage, setup-guide routing, and web-search dispatch:

- `brave`
- `bytedance-doubao-seed`
- `exa`
- `firecrawl`
- `moonshot-ai-kimi`
- `perplexity`
- `serpapi`
- `tavily`

## Summary Matrix

| Provider | Web search | LLM | STT | TTS | Notes |
| --- | --- | --- | --- | --- | --- |
| `openai` | enabled | enabled | enabled | enabled | Uses Responses web search and OpenAI speech routes. |
| `openrouter` | none | enabled | none | none | Optional multi-provider gateway with route metadata and privacy-constrained routing. |
| `anthropic` | enabled | enabled | none | none | Claude Messages plus Anthropic web search. |
| `alibaba-qwen-dashscope` | enabled | enabled | enabled | enabled | OpenAI-compatible chat plus Qwen Responses search and simple DashScope ASR/TTS routes. |
| `gemini` | enabled | enabled | enabled | enabled | One AI Studio key covers Gemini GenerateContent/Live, Interactions search, recorded-audio transcription, and Gemini TTS. |
| `xai` | enabled | enabled | enabled | enabled | Grok chat/Responses search plus standalone xAI STT/TTS routes. |
| `deepseek` | none | enabled | none | none | DeepSeek chat completions only. |
| `mistral` | enabled | enabled | enabled | enabled | Chat completions, Conversations web search, Voxtral Mini Transcribe 2, and Voxtral TTS. |
| `elevenlabs` | none | none | enabled | enabled | Scribe STT plus TTS; account voice discovery is optional. |

## Provider Details

### OpenAI (`openai`)

- LLM transport: OpenAI-compatible chat completions.
- Web search: `gpt-5.6-sol` via the Responses web-search tool.
- LLM picker: GPT-5.6 Sol/Terra/Luna, canonical snapshots for GPT-5.5,
  GPT-5.4, GPT-5.4 mini/nano, GPT-4.1/mini, and GPT-Realtime 2.1/mini.
- Effort: `reasoning_effort` on the supported GPT-5.x rows.
- STT picker: catalog-backed OpenAI transcription models.
- TTS picker: `gpt-4o-mini-tts`, `tts-1`, `tts-1-hd`.

### OpenRouter (`openrouter`)

- Runtime role: optional LLM gateway. Direct provider connections remain
  available and are never replaced automatically.
- Onboarding: users create a dedicated OpenRouter key in the system browser and
  paste it into the device-local credential vault. OAuth is not used because
  OpenRouter's documented PKCE flow covers site and localhost callbacks but
  does not document a verified mobile deep-link callback, and the app has no
  hosted callback bridge.
- Transport: OpenAI-compatible streaming chat completions at
  `https://openrouter.ai/api/v1/chat/completions`.
- LLM picker: a curated canonical-snapshot selection spanning OpenAI,
  Anthropic, Google, xAI, DeepSeek, Moonshot, Mistral, and Qwen.
- Routing: requests deny data-collection routes and require upstream parameter
  support whenever reasoning effort is selected.
- Transparency: final-stream router metadata records the selected upstream,
  routed model, attempts, strategy, and any OpenRouter context compression in
  the turn receipt.
- STT/TTS/web search: not runtime-exposed through this gateway.

### Anthropic (`anthropic`)

- LLM transport: Anthropic Messages.
- Web search: Claude Messages with `web_search_20260318`.
- LLM picker: Claude 5 and current Claude 4.x rows supported by the Messages
  integration.
- Effort: output effort metadata is exposed only on supported Claude rows.
- STT/TTS: not runtime-exposed.

### Alibaba / Qwen (`alibaba-qwen-dashscope`)

- LLM transport: DashScope OpenAI-compatible chat completions.
- LLM picker: canonical snapshots for curated Qwen 3.7, 3.6, 3.5, and
  Qwen Plus/Flash rows; rolling aliases are intentionally hidden.
- Web search: `qwen3.7-plus-2026-05-26` through the OpenAI-compatible Responses API with
  one required `web_search` tool call. Ungrounded responses are rejected.
- Effort: `enable_thinking` toggle.
- STT picker: `qwen3-asr-flash`.
- TTS picker: `qwen3-tts-flash`, `qwen3-tts-instruct-flash`.

### Google / Gemini (`gemini`)

- LLM transport: Gemini `models.generateContent`.
- LLM picker: `gemini-3.6-flash`, `gemini-3.5-flash`,
  `gemini-3.5-flash-lite`, `gemini-3.1-pro-preview`,
  `gemini-3.1-flash-lite`, `gemini-2.5-pro`, `gemini-2.5-flash`,
  `gemini-2.5-flash-lite`.
- Effort: `generationConfig.thinkingConfig.thinkingLevel` for Gemini 3.x rows
  that expose thinking levels.
- Web search: Gemini Interactions API with `google_search` grounding.
- STT picker: Gemini 3.6/3.5 Flash models transcribe recorded audio through
  `generateContent` with the same AI Studio API key used by the other Google
  capabilities.
- TTS picker: Gemini TTS preview rows.

### xAI (`xai`)

- LLM transport: OpenAI-compatible chat completions.
- LLM picker: `grok-4.5`, `grok-4.3`.
- Effort: model-specific `reasoning_effort` options.
- Web search: xAI Responses API with `web_search`; search mode maps to
  `max_turns`.
- STT picker: standalone xAI `grok-stt` route.
- TTS picker: standalone xAI `text-to-speech` route, backed by the Grok TTS
  service catalog entry.

### DeepSeek (`deepseek`)

- LLM transport: OpenAI-compatible chat completions.
- LLM picker: `deepseek-v4-flash`, `deepseek-v4-pro`.
- Effort: `thinking.type` plus `reasoning_effort` for supported rows.
- STT/TTS/web search: not runtime-exposed.

### Mistral (`mistral`)

- LLM transport: OpenAI-compatible chat completions.
- LLM picker: `mistral-medium-3-5`, `mistral-small-2603`,
  `mistral-large-2512`, `ministral-14b-2512`, `ministral-8b-2512`,
  `ministral-3b-2512`.
- Effort: `reasoning_effort` with the model-supported `none` and `high`
  values for Mistral Medium 3.5 and Mistral Small 4; `high` is the default.
- Web search: Mistral Conversations API with the built-in `web_search` tool.
- STT picker: `voxtral-mini-2602` (Voxtral Mini Transcribe 2).
- TTS picker: `voxtral-mini-tts-2603`.
- Voice directory: preset and custom account voices are loaded from
  `/v1/audio/voices`; the voice slug is sent as `voice_id`. A manual voice ID
  remains available if discovery is unavailable.

### ElevenLabs (`elevenlabs`)

- Runtime role: STT/TTS speech provider. It does not appear as an LLM response
  card and is not offered for web search.
- STT picker: `scribe_v2`, sent to `POST /v1/speech-to-text` as multipart
  recorded audio with `xi-api-key` authentication.
- TTS picker: `eleven_flash_v2_5`, `eleven_multilingual_v2`, and `eleven_v3`.
- Voice directory: all account-visible voices are loaded from paginated
  `GET /v2/voices`, deduplicated, sorted, and selectable globally or per
  conversation. Rachel remains available as a built-in premade fallback when a
  restricted key does not include voice-read access.
- Speech transport: `POST /v1/text-to-speech/{voice_id}` with `xi-api-key`
  authentication and MP3 output.
- Runtime behavior: voice discovery and speech requests are abortable and
  timeout-bounded. Provider speech uses the shared retry, diagnostics,
  sentence-chunk prefetch, playback, and recovery pipeline.
- Restricted keys need Text to Speech permission for TTS and Speech to Text
  permission for STT. Voices read is optional and only enables account voice
  discovery.
