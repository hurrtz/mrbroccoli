# Local AI options review

Reviewed on 2026-08-03. This is an engineering and product assessment, not
legal advice. Model availability, licenses, artifacts, and runtime support must
be rechecked before each release.

## Decision

Mr Broccoli should keep a curated catalogue rather than exposing every model a
runtime can discover. A downloadable model is offered only when all of these
are known:

- an exact versioned artifact, byte size, and SHA-256 digest;
- a reviewed model and dataset license suitable for distribution by download;
- support for the selected speaking language;
- compatibility with the app's existing `llama.rn` or Sherpa ONNX bridge; and
- a successful benchmark on the user's own device before the route can be
  selected.

The first expansion is deliberately conservative:

- add CC0 Piper voices for Italian, Russian, and European Portuguese;
- add the Apache-2.0 Omnilingual ASR 300M v2 int8 model as an optional,
  broad-language alternative to Whisper Tiny;
- retain Qwen3 0.6B as the default quick-response model and make Qwen3 1.7B's
  existing thinking mode the thorough option on phones that pass its benchmark;
- keep Qwen3-ASR 0.6B available as a researched advanced candidate until its
  approximately 879 MB download and sustained memory use have passed the
  physical-device matrix; and
- do not offer Supertonic 3 or LFM2.5 Thinking yet because their current mobile
  bridge or licensing conditions need product work described below.

## Current runtime boundary

The app already ships two inference runtimes:

- [`llama.rn`](https://github.com/mybigday/llama.rn), which embeds
  `llama.cpp` and loads GGUF language models; and
- [`react-native-sherpa-onnx`](https://github.com/techpotatoes/react-native-sherpa-onnx),
  which embeds Sherpa ONNX and loads downloaded speech archives.

Adding a model supported by these exact native builds is relatively small.
Adding ExecuTorch, MLX, MLC, MediaPipe, ONNX Runtime directly, or another native
engine would increase binary size, build surface, licensing work, memory
coordination, and device validation. No additional runtime is justified by the
current candidates.

## Reasoning and response models

| Candidate | What it offers | Language fit | Mobile and license assessment | Decision |
| --- | --- | --- | --- | --- |
| Qwen3 0.6B Q8 | Small general chat model with switchable thinking | Covers the seven Free languages | Apache-2.0; already integrated and about 639 MB | Default Quick route |
| Qwen3 1.7B Q8 | Better-capacity sibling with switchable thinking | Covers the seven Free languages | Apache-2.0; already integrated and about 1.83 GB; needs at least a strong 6 GB-class phone and a passing device benchmark | Thorough route when viable |
| [Qwen3.5 0.8B](https://huggingface.co/Qwen/Qwen3.5-0.8B) | Newer hybrid reasoning architecture and broad multilingual coverage | 201 languages | Apache-2.0; an official Q8 GGUF is about 834 MB and the shipped `llama.cpp` recognizes Qwen3.5 | Benchmark candidate; do not displace a known-working default without device evidence |
| [LFM2.5 1.2B Thinking](https://huggingface.co/LiquidAI/LFM2.5-1.2B-Thinking) | Purpose-built compact reasoning model; official Q4 is about 731 MB | English, Arabic, Chinese, French, German, Japanese, Korean, Spanish; no Italian, Portuguese, or Russian | Runtime-compatible, but the LFM Open License v1.0 excludes commercial use by entities with annual revenue of USD 10M or more | License-gated research option, not a default distributable model |
| [IBM Granite 4.0 1B](https://huggingface.co/ibm-granite/granite-4.0-1b) | Apache-licensed instruction model and official GGUF | Includes Italian and Portuguese but not Russian | About 1.02 GB at Q4; model card calls out precision-specific hardware behavior | Secondary benchmark candidate |
| [Ministral 3 3B](https://huggingface.co/mistralai/Ministral-3-3B-Instruct-2512) | Stronger edge-oriented general model and long context | Eleven languages; incomplete seven-language fit | Apache-2.0 but approximately 2.15 GB at Q4, so suitable only for high-end phones | Advanced future candidate |
| [SmolLM3 3B](https://huggingface.co/HuggingFaceTB/SmolLM3-3B) | Explicit dual thinking/non-thinking behavior | Covers six target languages, not Russian | Apache-2.0; materially larger than the current default | Advanced future candidate |
| [Phi-4 Mini Instruct](https://huggingface.co/microsoft/Phi-4-mini-instruct) | Strong small-model reasoning and all seven target languages | Complete fit | MIT model, but Microsoft does not publish the GGUF artifact the app would need; community conversions are larger and add a provenance boundary | Wait for an official compatible artifact |
| [EuroLLM 1.7B Instruct](https://huggingface.co/utter-project/EuroLLM-1.7B-Instruct) | Broad European-language coverage including all seven | Complete fit | Apache-2.0, but no official GGUF; its own card warns that it is not preference-aligned and may produce problematic or hallucinated content | Research/translation candidate, not the assistant default |
| Gemma 3 1B / Llama 3.2 1B | Popular compact alternatives | Gemma is broad; Llama omits Russian | Gated or model-specific terms, plus incomplete target fit for Llama | Not suitable for frictionless one-tap setup |

The existing Qwen pair is therefore still the most defensible all-language
combination today. The product distinction should be behavioral and honest:
Quick disables thinking and limits response work; Thorough enables thinking and
uses the larger model only when it is installed and benchmarked as viable.

## Speech-to-text

| Candidate | Coverage and size | Runtime and license assessment | Decision |
| --- | --- | --- | --- |
| [Whisper Tiny](https://github.com/openai/whisper) | Multilingual; roughly 116 MB compressed | MIT; already working through Sherpa | Keep as the fastest/default download |
| Whisper Base | Same multilingual family with more capacity; roughly 208 MB compressed | MIT and Sherpa-compatible, but the old release asset does not publish a digest alongside it | Possible quality step after independently pinning and testing the artifact |
| [Omnilingual ASR 300M v2 int8](https://k2-fsa.github.io/sherpa/onnx/omnilingual-asr/models.html) | More than 1,600 languages; roughly 292 MB compressed | Apache-2.0; supported by the exact React Native/Sherpa bridge | Add as optional broad-language recognition and benchmark on device |
| [Qwen3-ASR 0.6B int8](https://huggingface.co/Qwen/Qwen3-ASR-0.6B) | 30 languages plus 22 Chinese dialects, including all seven target languages; roughly 879 MB compressed | Apache-2.0 and supported by the exact bridge | Advanced candidate pending physical-device memory, heat, and latency evidence |
| [Moonshine](https://github.com/usefulsensors/moonshine) | Designed for fast edge transcription | Available artifacts are language-specific, so seven-language coverage multiplies downloads | Revisit if a compact multilingual mobile artifact becomes available |
| SenseVoice | Fast compact recognition | Chinese, English, Japanese, Korean, and Cantonese only | Reject for the Free language set |
| Platform speech recognizers | No model download and often hardware optimized | Availability, offline behavior, and privacy depend on operating-system language packs and settings | Keep as the default system option; never describe it as guaranteed offline |

Accuracy cannot be inferred from parameter count alone. The setup evaluation
must compare a real bundled utterance for load time and real-time factor, and
advanced settings must label untested models rather than claiming they will
work.

## Text-to-speech

| Candidate | Coverage and size | Runtime and license assessment | Decision |
| --- | --- | --- | --- |
| Platform voices | Broadest installed-language coverage and no app download | Quality and offline behavior vary by installed operating-system voice | Default when a verified local pack is absent |
| Piper int8 voices | One compact voice per language, generally 21–24 MB compressed | Existing VITS path works. Licenses vary per voice, so every archive must be reviewed separately | Keep current packs; add CC0 Italian Paola, Russian Dmitri, and European Portuguese Tugão |
| Kokoro multilingual | More natural multi-speaker output for English and Simplified Chinese | Apache-2.0; current optional integration is about 147 MB compressed | Keep as an optional supported route, not a claim of seven-language coverage |
| [Supertonic 3](https://huggingface.co/Supertone/supertonic-3) | 99M parameters, fixed speakers, and 31 languages including all seven targets; roughly 129 MB int8 Sherpa archive | OpenRAIL-M has use restrictions and downstream notice obligations. Sherpa 1.13.2 supports it, but the latest React Native package embeds 1.12.35 and exposes no language selector for the new multilingual model | High-priority future option after native-core upgrade, language bridge, terms UX, and regression tests |
| [MeloTTS](https://github.com/myshell-ai/MeloTTS) | Multilingual voices and controllable accents | MIT code, but no compatible artifact/bridge in the shipped runtime and language coverage does not cleanly match all targets | Research only |
| [Piper project successors](https://github.com/OHF-Voice/piper1-gpl) | Active Piper-compatible ecosystem | The maintained engine is GPL-3.0; voice licenses still vary | Do not add the GPL runtime to the proprietary app; existing Sherpa VITS inference remains acceptable |

## Artifact and device gates

Catalogue metadata is not a compatibility promise. Every installed model must
pass the device-local test for the same platform, OS version, architecture, and
physical-memory size before automatic setup can select it. A failed or slow
test remains visible and prevents automatic use; users may retry after a device
or operating-system change.

The release matrix for new model families is:

1. verify the source archive, byte count, digest, and included license;
2. verify extraction and model detection on iOS and Android;
3. measure cold load, inference rate, memory pressure, cancellation, and cleanup
   on simulator/emulator where meaningful;
4. repeat inference, interruption, backgrounding, heat, and low-storage checks
   on physical iOS and Android devices; and
5. only then adjust the automatic recommendation thresholds.

Simulator and emulator results are useful for lifecycle and UI correctness, not
for thermal or representative inference-performance claims.
