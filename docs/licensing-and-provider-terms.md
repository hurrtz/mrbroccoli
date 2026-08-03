# Licensing and provider-terms review

Reviewed on 2026-08-02. This is an engineering compliance record, not legal
advice.

## Conclusion

Mr Broccoli's original code and assets may be distributed as proprietary,
all-rights-reserved material. Calling third-party APIs with user-supplied keys
does not require the client application's source code to be published.

That conclusion has two boundaries:

1. Third-party software, fonts, native inference runtimes, and optional
   downloaded models retain their own licenses. Their notices and attribution
   requirements must be preserved.
2. API and model use remains subject to the provider's current terms, usage
   policies, regional restrictions, and any model-specific terms.

The repository therefore uses a proprietary `LICENSE` with an explicit
third-party carve-out, generates `THIRD_PARTY_NOTICES.md`, and rejects
unreviewed dependency licenses during validation.

## Bundled components

- JavaScript and React Native dependencies currently resolve only to reviewed
  permissive, notice, font, attribution, or file-level copyleft licenses.
- MPL-2.0 build dependencies do not change the license of the larger work.
- `node-forge` is used under its BSD-3-Clause option.
- The app disables Sherpa's unused FFmpeg and shine libraries on Android and
  iOS. This removes the LGPL-2.1/LGPL-2.0 components from distributable builds.
- `react-native-sherpa-onnx` is MIT licensed; Sherpa ONNX is Apache-2.0;
  ONNX Runtime is MIT; libarchive and zstd use permissive licenses.
- `llama.rn` and its included `llama.cpp` runtime are MIT licensed.
- `expo-iap` and its OpenIAP Apple and Google bindings are MIT licensed. Store
  purchases remain subject to the current Apple Developer and Google Play
  distribution agreements and billing policies.
- Optional on-device models are never bundled. The catalogue pins their source,
  artifact size, SHA-256 digest, and license before download:
  - Qwen3 0.6B and 1.7B GGUF files: Apache-2.0.
  - Whisper Tiny: MIT; Omnilingual ASR 300M v2 int8: Apache-2.0.
  - Kokoro multilingual: Apache-2.0; the archive includes its license file.
  - Piper Kristin: public domain; Thorsten and Faber: CC0-1.0; Sharvard:
    CC-BY-3.0; Siwis: CC-BY-4.0; European Portuguese Tugão, Russian
    Dmitri, and Italian Paola: CC0-1.0.
- Downloaded models, their benchmark results, and generated audio are
  device-local and excluded from app-data backups. Attribution-bearing model
  archives and their source links must remain intact.

Run `npm run license:verify` after dependency or native-runtime changes. A new
or changed license must be reviewed and deliberately added to the allowlist;
the check must never be bypassed for a release.

## Hosted providers

The links below are the authoritative terms reviewed for the retained direct
providers. They can change independently of an app release.

- [OpenAI Services Agreement](https://cdn.openai.com/osa/openai-services-agreement.pdf)
  defines customer applications integrating the API.
- [Anthropic Commercial Terms](https://www.anthropic.com/legal/commercial-terms)
  permit customers to power products for their users and assign output rights
  to the customer.
- [Gemini API Additional Terms](https://ai.google.dev/gemini-api/terms)
  permit API clients but require paid services when an API client is available
  in the EEA, Switzerland, or the United Kingdom. Release validation and
  production use in those regions must use a billing-enabled Gemini project.
- [xAI Enterprise Terms](https://x.ai/legal/terms-of-service-enterprise)
  permit integrations and bundled services for end users.
- [Mistral Commercial Terms](https://legal.mistral.ai/terms/commercial-terms-of-service)
  govern hosted API use and assign output rights to the customer.
- [DeepSeek Open Platform Terms](https://cdn.deepseek.com/policies/en-US/deepseek-open-platform-terms-of-service.html)
  expressly cover APIs used to build applications for end users.
- [Alibaba Cloud Product Terms](https://www.alibabacloud.com/help/en/legal/latest/alibaba-cloud-international-website-product-terms-of-service-v-3-8-0)
  include Model Studio and do not claim ownership of output.
- [ElevenLabs EEA Terms](https://elevenlabs.io/terms-of-use-eu) and its
  [Prohibited Use Policy](https://elevenlabs.io/use-policy) govern API speech
  use. Commercial and downstream use must use an eligible paid plan and comply
  with the applicable restrictions.
- [OpenRouter Terms](https://openrouter.ai/terms) allow models to be
  incorporated into customer products, but every selected model also carries
  its provider's model-specific terms.

## Operational rules

- API keys remain device-local secure credentials. They are never committed,
  exported, logged, or transferred between users.
- Mr Broccoli must not imply provider endorsement or partnership.
- Provider and model terms must be rechecked before each release, especially
  regional, age, paid-plan, attribution, downstream-use, and data-handling
  requirements.
- Users remain responsible for the content they submit and for independently
  reviewing model output. Product copy and store disclosures must not present
  generated output as authoritative professional advice.
- When a provider or model's terms are incompatible with the product, disable
  that route instead of weakening this compliance baseline.
