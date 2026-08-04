# Local AI options review

Reviewed on 2026-08-04. This is an engineering and product assessment, not
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

Free setup matches one selected speaking language, not a simultaneous
seven-language profile. This materially expands the safe candidate pool while
keeping the automatic path conservative:

- Qwen3 0.6B remains the automatic Quick model and Qwen3 1.7B remains the
  automatic Thorough model on phones that fit both;
- Qwen3.5 0.8B and Granite 4.0 1B are opt-in Quick alternatives, while
  Ministral 3 3B Reasoning and Qwen3 4B are opt-in Thorough alternatives;
- Whisper Base and Small, NVIDIA Parakeet TDT 0.6B v3, and Qwen3-ASR 0.6B join
  Whisper Tiny and Omnilingual as language-compatible recognition choices;
- a second permissively licensed Piper voice is offered for every Free locale
  except European Portuguese, where the remaining reviewed archives are
  non-commercial; and
- Supertonic 3 and platform-native reasoning remain separate integration gates
  because their current mobile APIs cannot yet enforce the selected language.

Advanced entries never replace an automatic recommendation merely because
they were downloaded. A user must choose one explicitly, download its exact
pinned bytes, and pass the benchmark on that device before use.

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

| Candidate                                                                                       | What it offers                                                      | Language fit                                                                                            | Mobile and license assessment                                                                                                                  | Decision                                                         |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Qwen3 0.6B Q8                                                                                   | Small general chat model with switchable thinking                   | Covers every Free language                                                                              | Apache-2.0; about 639 MB                                                                                                                       | Automatic Quick route                                            |
| Qwen3 1.7B Q8                                                                                   | Better-capacity sibling with switchable thinking                    | Covers every Free language                                                                              | Apache-2.0; about 1.83 GB; needs at least a strong 6 GB-class phone and a passing device benchmark                                             | Automatic Thorough route when viable                             |
| [Qwen3.5 0.8B](https://huggingface.co/Qwen/Qwen3.5-0.8B)                                        | Newer hybrid reasoning architecture and broad multilingual coverage | 201 languages                                                                                           | Apache-2.0; the pinned ggml-org Q8 conversion is about 834 MB and the shipped `llama.cpp` recognizes Qwen3.5                                   | Integrated as an advanced Quick option                           |
| [LFM2.5 1.2B Thinking](https://huggingface.co/LiquidAI/LFM2.5-1.2B-Thinking)                    | Purpose-built compact reasoning model; official Q4 is about 731 MB  | English, Arabic, Chinese, French, German, Japanese, Korean, Spanish; no Italian, Portuguese, or Russian | Runtime-compatible, but the LFM Open License v1.0 excludes commercial use by entities with annual revenue of USD 10M or more                   | License-gated research option, not a default distributable model |
| [IBM Granite 4.0 1B](https://huggingface.co/ibm-granite/granite-4.0-1b)                         | Apache-licensed instruction model and official GGUF                 | English, German, Spanish, French, Italian, and Portuguese; not Russian                                  | About 1.02 GB at Q4; model card calls out precision-specific hardware behavior                                                                 | Integrated as an advanced Quick option for compatible languages  |
| [Ministral 3 3B Reasoning](https://huggingface.co/mistralai/Ministral-3-3B-Reasoning-2512-GGUF) | Purpose-built edge reasoning model                                  | English, German, Spanish, French, Italian, and Portuguese; not Russian                                  | Official Apache-2.0 GGUF, approximately 2.15 GB at Q4                                                                                          | Integrated as a high-end Thorough option                         |
| [Qwen3 4B](https://huggingface.co/Qwen/Qwen3-4B-GGUF)                                           | Larger switchable-thinking model                                    | Covers every Free language, including Russian                                                           | Official Apache-2.0 GGUF, approximately 2.50 GB at Q4                                                                                          | Integrated as a high-end Thorough option                         |
| [SmolLM3 3B](https://huggingface.co/HuggingFaceTB/SmolLM3-3B)                                   | Explicit dual thinking/non-thinking behavior                        | Covers six target languages, not Russian                                                                | Apache-2.0; materially larger than the current default                                                                                         | Advanced future candidate                                        |
| [Phi-4 Mini Instruct](https://huggingface.co/microsoft/Phi-4-mini-instruct)                     | Strong small-model reasoning and all seven target languages         | Complete fit                                                                                            | MIT model, but Microsoft does not publish the GGUF artifact the app would need; community conversions are larger and add a provenance boundary | Wait for an official compatible artifact                         |
| [EuroLLM 1.7B Instruct](https://huggingface.co/utter-project/EuroLLM-1.7B-Instruct)             | Broad European-language coverage including all seven                | Complete fit                                                                                            | Apache-2.0, but no official GGUF; its own card warns that it is not preference-aligned and may produce problematic or hallucinated content     | Research/translation candidate, not the assistant default        |
| Gemma 3 1B / Llama 3.2 1B                                                                       | Popular compact alternatives                                        | Gemma is broad; Llama omits Russian                                                                     | Gated or model-specific terms, plus incomplete target fit for Llama                                                                            | Not suitable for frictionless one-tap setup                      |

The existing Qwen pair remains the most defensible automatic combination. The
new entries provide real choice per selected language without claiming that a
parameter count or newer release is universally better. Quick disables
thinking and limits response work; Thorough enables thinking and uses a larger
model only when it is installed and benchmarked as viable.

## Speech-to-text

| Candidate                                                                                        | Coverage and size                                                                               | Runtime and license assessment                                                                     | Decision                                                                   |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| [Whisper Tiny](https://github.com/openai/whisper)                                                | Multilingual; roughly 116 MB compressed                                                         | MIT; already working through Sherpa                                                                | Keep as the fastest/default download                                       |
| Whisper Base                                                                                     | Same multilingual family with more capacity; roughly 208 MB compressed                          | MIT and Sherpa-compatible; pinned against Sherpa's published checksum                              | Integrated balanced option                                                 |
| Whisper Small                                                                                    | Higher-capacity multilingual Whisper; roughly 639 MB compressed                                 | MIT and Sherpa-compatible; pinned against Sherpa's published checksum                              | Integrated higher-accuracy option for stronger phones                      |
| [Omnilingual ASR 300M v2 int8](https://k2-fsa.github.io/sherpa/onnx/omnilingual-asr/models.html) | More than 1,600 languages; roughly 292 MB compressed                                            | Apache-2.0; supported by the exact React Native/Sherpa bridge                                      | Add as optional broad-language recognition and benchmark on device         |
| [NVIDIA Parakeet TDT 0.6B v3 int8](https://huggingface.co/nvidia/parakeet-tdt-0.6b-v3)           | Covers every Free language; roughly 487 MB compressed                                           | CC-BY-4.0 and supported by the bridge's NeMo transducer route                                      | Integrated advanced option                                                 |
| [Qwen3-ASR 0.6B int8](https://huggingface.co/Qwen/Qwen3-ASR-0.6B)                                | 30 languages plus 22 Chinese dialects, including every Free language; roughly 879 MB compressed | Apache-2.0 and supported by the exact bridge                                                       | Integrated high-memory advanced option                                     |
| [Moonshine](https://github.com/usefulsensors/moonshine)                                          | Designed for fast edge transcription                                                            | Available artifacts are language-specific, so seven-language coverage multiplies downloads         | Revisit if a compact multilingual mobile artifact becomes available        |
| SenseVoice                                                                                       | Fast compact recognition                                                                        | Chinese, English, Japanese, Korean, and Cantonese only                                             | Reject for the Free language set                                           |
| Platform speech recognizers                                                                      | No model download and often hardware optimized                                                  | Availability, offline behavior, and privacy depend on operating-system language packs and settings | Keep as the default system option; never describe it as guaranteed offline |

Accuracy cannot be inferred from parameter count alone. The setup evaluation
must compare a real bundled utterance for load time and real-time factor, and
advanced settings must label untested models rather than claiming they will
work.

## Text-to-speech

| Candidate                                                           | Coverage and size                                                                                                  | Runtime and license assessment                                                                                                                                                                   | Decision                                                                                                            |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| Platform voices                                                     | Broadest installed-language coverage and no app download                                                           | Quality and offline behavior vary by installed operating-system voice                                                                                                                            | Default when a verified local pack is absent                                                                        |
| Piper int8 voices                                                   | One or two compact voices per Free language, generally 13–24 MB compressed                                         | Existing VITS path works. Every exposed archive has an independently reviewed permissive or attribution license                                                                                  | Integrated; European Portuguese keeps one downloadable voice because the other reviewed archives are non-commercial |
| Kokoro multilingual                                                 | More natural multi-speaker output for English and Simplified Chinese                                               | Apache-2.0; current optional integration is about 147 MB compressed                                                                                                                              | Keep as an optional supported route, not a claim of seven-language coverage                                         |
| [Supertonic 3](https://huggingface.co/Supertone/supertonic-3)       | 99M parameters, fixed speakers, and 31 languages including every Free language; roughly 129 MB int8 Sherpa archive | OpenRAIL-M has use restrictions and downstream notice obligations. The current React Native package embeds Sherpa 1.12.34 and exposes no generation-language selector for the multilingual model | High-priority future option after native-core upgrade, language bridge, terms UX, and regression tests              |
| [MeloTTS](https://github.com/myshell-ai/MeloTTS)                    | Multilingual voices and controllable accents                                                                       | MIT code, but no compatible artifact/bridge in the shipped runtime and language coverage does not cleanly match all targets                                                                      | Research only                                                                                                       |
| [Piper project successors](https://github.com/OHF-Voice/piper1-gpl) | Active Piper-compatible ecosystem                                                                                  | The maintained engine is GPL-3.0; voice licenses still vary                                                                                                                                      | Do not add the GPL runtime to the proprietary app; existing Sherpa VITS inference remains acceptable                |

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
