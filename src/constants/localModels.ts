import {
  SPEECH_LANGUAGE_OPTIONS,
  type SpeechLanguage,
} from "./speechLanguages";

// Increment only when existing artifact or benchmark contracts change. Adding a
// new model must not invalidate verified downloads and benchmarks for others.
// Increment when any pinned artifact changes so an older benchmark cannot be
// reused for its replacement bytes.
export const LOCAL_MODEL_CATALOG_VERSION = 3;

export type LocalModelCapability = "llm" | "stt" | "tts";
export type LocalModelRuntime = "llama-rn" | "sherpa-onnx";
export type LocalModelPlatform = "android" | "ios";
export type LocalModelId =
  | "qwen3-0.6b-q8"
  | "qwen3.5-0.8b-q8"
  | "granite-4.0-1b-q4"
  | "qwen3-1.7b-q8"
  | "ministral-3-3b-reasoning-q4"
  | "qwen3-4b-q4"
  | "whisper-tiny"
  | "whisper-base"
  | "whisper-small"
  | "omnilingual-asr-300m"
  | "parakeet-tdt-0.6b-v3-int8"
  | "qwen3-asr-0.6b-int8"
  | "kokoro-multilingual"
  | "piper-en-us-kristin"
  | "piper-en-us-norman"
  | "piper-de-de-thorsten"
  | "piper-de-de-kerstin"
  | "piper-es-es-sharvard"
  | "piper-es-es-davefx"
  | "piper-fr-fr-siwis"
  | "piper-fr-fr-gilles"
  | "piper-pt-br-faber"
  | "piper-pt-br-cadu"
  | "piper-pt-pt-tugao"
  | "piper-ru-ru-dmitri"
  | "piper-ru-ru-denis"
  | "piper-it-it-paola"
  | "piper-it-it-riccardo";
export type LocalLlmModelId = Extract<
  LocalModelId,
  | "qwen3-0.6b-q8"
  | "qwen3.5-0.8b-q8"
  | "granite-4.0-1b-q4"
  | "qwen3-1.7b-q8"
  | "ministral-3-3b-reasoning-q4"
  | "qwen3-4b-q4"
>;
export type LocalSttModelId = Extract<
  LocalModelId,
  | "whisper-tiny"
  | "whisper-base"
  | "whisper-small"
  | "omnilingual-asr-300m"
  | "parakeet-tdt-0.6b-v3-int8"
  | "qwen3-asr-0.6b-int8"
>;
export type LocalTtsModelId = Extract<
  LocalModelId,
  | "piper-en-us-kristin"
  | "piper-en-us-norman"
  | "piper-de-de-thorsten"
  | "piper-de-de-kerstin"
  | "piper-es-es-sharvard"
  | "piper-es-es-davefx"
  | "piper-fr-fr-siwis"
  | "piper-fr-fr-gilles"
  | "piper-pt-br-faber"
  | "piper-pt-br-cadu"
  | "piper-pt-pt-tugao"
  | "piper-ru-ru-dmitri"
  | "piper-ru-ru-denis"
  | "piper-it-it-paola"
  | "piper-it-it-riccardo"
>;
export type LocalTtsCatalogModelId = LocalTtsModelId | "kokoro-multilingual";

export interface LocalModelRequirements {
  minimumFreeStorageBytes: number;
  minimumPhysicalMemoryBytes: number;
  platforms: readonly LocalModelPlatform[];
}

export interface LocalModelBenchmarkTarget {
  maximumLoadMs: number;
  /** LLM only. */
  minimumTokensPerSecond?: number;
  /** Speech models only. Processing seconds divided by audio seconds. */
  maximumRealtimeFactor?: number;
}

interface LocalModelBase {
  id: LocalModelId;
  capability: LocalModelCapability;
  name: string;
  description: string;
  /** Controls the detail label shown in model pickers. */
  catalogTier: "recommended" | "advanced";
  /** Higher values win automatic setup after device and language filtering. */
  automaticPriority?: number;
  runtime: LocalModelRuntime;
  languages: readonly SpeechLanguage[];
  downloadBytes: number;
  installedBytes: number;
  sha256: string;
  license: string;
  sourceUrl: string;
  downloadUrl: string;
  requirements: LocalModelRequirements;
  benchmark: LocalModelBenchmarkTarget;
}

export interface LocalLlmModelDefinition extends LocalModelBase {
  id: LocalLlmModelId;
  capability: "llm";
  runtime: "llama-rn";
  fileName: string;
  contextTokens: number;
  responseProfile: "quick" | "thorough";
}

export interface LocalSttModelDefinition extends LocalModelBase {
  id: LocalSttModelId;
  capability: "stt";
  runtime: "sherpa-onnx";
  runtimeModelId: string;
  sherpaModelType: "whisper" | "omnilingual" | "nemo_transducer" | "qwen3_asr";
}

export interface LocalTtsModelDefinition extends LocalModelBase {
  id: LocalTtsCatalogModelId;
  capability: "tts";
  runtime: "sherpa-onnx";
  runtimeModelId: string;
  sherpaModelType: "kokoro" | "vits";
  speakerId: number;
}

export type LocalModelDefinition =
  LocalLlmModelDefinition | LocalSttModelDefinition | LocalTtsModelDefinition;

const ALL_SPEECH_LANGUAGES = [...SPEECH_LANGUAGE_OPTIONS];
const MOBILE_PLATFORMS = ["android", "ios"] as const;
const MIB = 1024 * 1024;
const GIB = 1024 * MIB;

const qwenRequirements = (
  minimumMemoryGiB: number,
  installedBytes: number,
) => ({
  minimumPhysicalMemoryBytes: minimumMemoryGiB * GIB,
  minimumFreeStorageBytes: installedBytes + 768 * MIB,
  platforms: MOBILE_PLATFORMS,
});

const speechRequirements = (
  minimumMemoryGiB: number,
  installedBytes: number,
) => ({
  minimumPhysicalMemoryBytes: minimumMemoryGiB * GIB,
  minimumFreeStorageBytes: installedBytes + 384 * MIB,
  platforms: MOBILE_PLATFORMS,
});

export const LOCAL_MODEL_CATALOG = [
  {
    id: "qwen3-0.6b-q8",
    capability: "llm",
    name: "Qwen3 0.6B",
    description: "Small multilingual response model; fastest local option.",
    catalogTier: "recommended",
    automaticPriority: 10,
    runtime: "llama-rn",
    languages: ALL_SPEECH_LANGUAGES,
    fileName: "Qwen3-0.6B-Q8_0.gguf",
    downloadBytes: 639_446_688,
    installedBytes: 639_446_688,
    sha256: "9465e63a22add5354d9bb4b99e90117043c7124007664907259bd16d043bb031",
    license: "Apache-2.0",
    sourceUrl: "https://huggingface.co/Qwen/Qwen3-0.6B-GGUF",
    downloadUrl:
      "https://huggingface.co/Qwen/Qwen3-0.6B-GGUF/resolve/main/Qwen3-0.6B-Q8_0.gguf?download=true",
    requirements: qwenRequirements(3, 639_446_688),
    benchmark: {
      maximumLoadMs: 35_000,
      minimumTokensPerSecond: 3,
    },
    contextTokens: 4_096,
    responseProfile: "quick",
  },
  {
    id: "qwen3.5-0.8b-q8",
    capability: "llm",
    name: "Qwen3.5 0.8B",
    description:
      "Newer compact multilingual model for users who want another quick-response option.",
    catalogTier: "advanced",
    automaticPriority: 20,
    runtime: "llama-rn",
    languages: ALL_SPEECH_LANGUAGES,
    fileName: "Qwen3.5-0.8B-Q8_0.gguf",
    downloadBytes: 833_592_096,
    installedBytes: 833_592_096,
    sha256: "37ae482d336108d23516fa35e8e0c4126688d81018b87178a18d752a1357814f",
    license: "Apache-2.0",
    sourceUrl: "https://huggingface.co/ggml-org/Qwen3.5-0.8B-GGUF",
    downloadUrl:
      "https://huggingface.co/ggml-org/Qwen3.5-0.8B-GGUF/resolve/main/Qwen3.5-0.8B-Q8_0.gguf?download=true",
    requirements: qwenRequirements(4, 833_592_096),
    benchmark: {
      maximumLoadMs: 45_000,
      minimumTokensPerSecond: 3,
    },
    contextTokens: 4_096,
    responseProfile: "quick",
  },
  {
    id: "granite-4.0-1b-q4",
    capability: "llm",
    name: "Granite 4.0 1B",
    description:
      "Compact alternative for English and the supported Western European languages.",
    catalogTier: "advanced",
    automaticPriority: 30,
    runtime: "llama-rn",
    languages: ["en", "de", "es", "fr", "it", "pt", "pt-BR"],
    fileName: "granite-4.0-1b-Q4_K_M.gguf",
    downloadBytes: 1_023_645_440,
    installedBytes: 1_023_645_440,
    sha256: "22ec0f9cc99a90185312de3c882c84e7bd6789bdd050389844380a01a831d7f1",
    license: "Apache-2.0",
    sourceUrl: "https://huggingface.co/ibm-granite/granite-4.0-1b-GGUF",
    downloadUrl:
      "https://huggingface.co/ibm-granite/granite-4.0-1b-GGUF/resolve/main/granite-4.0-1b-Q4_K_M.gguf?download=true",
    requirements: qwenRequirements(4, 1_023_645_440),
    benchmark: {
      maximumLoadMs: 45_000,
      minimumTokensPerSecond: 3,
    },
    contextTokens: 4_096,
    responseProfile: "quick",
  },
  {
    id: "qwen3-1.7b-q8",
    capability: "llm",
    name: "Qwen3 1.7B",
    description: "Higher-quality multilingual responses on stronger phones.",
    catalogTier: "recommended",
    automaticPriority: 10,
    runtime: "llama-rn",
    languages: ALL_SPEECH_LANGUAGES,
    fileName: "Qwen3-1.7B-Q8_0.gguf",
    downloadBytes: 1_834_426_016,
    installedBytes: 1_834_426_016,
    sha256: "061b54daade076b5d3362dac252678d17da8c68f07560be70818cace6590cb1a",
    license: "Apache-2.0",
    sourceUrl: "https://huggingface.co/Qwen/Qwen3-1.7B-GGUF",
    downloadUrl:
      "https://huggingface.co/Qwen/Qwen3-1.7B-GGUF/resolve/main/Qwen3-1.7B-Q8_0.gguf?download=true",
    requirements: qwenRequirements(6, 1_834_426_016),
    benchmark: {
      maximumLoadMs: 55_000,
      minimumTokensPerSecond: 3,
    },
    contextTokens: 4_096,
    responseProfile: "thorough",
  },
  {
    id: "ministral-3-3b-reasoning-q4",
    capability: "llm",
    name: "Ministral 3 3B Reasoning",
    description:
      "Purpose-built reasoning alternative for high-end phones and supported European languages.",
    catalogTier: "advanced",
    automaticPriority: 30,
    runtime: "llama-rn",
    languages: ["en", "de", "es", "fr", "it", "pt", "pt-BR"],
    fileName: "Ministral-3-3B-Reasoning-2512-Q4_K_M.gguf",
    downloadBytes: 2_147_021_472,
    installedBytes: 2_147_021_472,
    sha256: "7e9516cc01a039bb3e2d41227cdf388849bc1c942c4624c84567b1684cd9c0fc",
    license: "Apache-2.0",
    sourceUrl:
      "https://huggingface.co/mistralai/Ministral-3-3B-Reasoning-2512-GGUF",
    downloadUrl:
      "https://huggingface.co/mistralai/Ministral-3-3B-Reasoning-2512-GGUF/resolve/main/Ministral-3-3B-Reasoning-2512-Q4_K_M.gguf?download=true",
    requirements: qwenRequirements(8, 2_147_021_472),
    benchmark: {
      maximumLoadMs: 70_000,
      minimumTokensPerSecond: 3,
    },
    contextTokens: 4_096,
    responseProfile: "thorough",
  },
  {
    id: "qwen3-4b-q4",
    capability: "llm",
    name: "Qwen3 4B",
    description:
      "Larger multilingual reasoning option, including Russian, for high-end phones.",
    catalogTier: "advanced",
    automaticPriority: 30,
    runtime: "llama-rn",
    languages: ALL_SPEECH_LANGUAGES,
    fileName: "Qwen3-4B-Q4_K_M.gguf",
    downloadBytes: 2_497_280_256,
    installedBytes: 2_497_280_256,
    sha256: "7485fe6f11af29433bc51cab58009521f205840f5b4ae3a32fa7f92e8534fdf5",
    license: "Apache-2.0",
    sourceUrl: "https://huggingface.co/Qwen/Qwen3-4B-GGUF",
    downloadUrl:
      "https://huggingface.co/Qwen/Qwen3-4B-GGUF/resolve/main/Qwen3-4B-Q4_K_M.gguf?download=true",
    requirements: qwenRequirements(8, 2_497_280_256),
    benchmark: {
      maximumLoadMs: 75_000,
      minimumTokensPerSecond: 3,
    },
    contextTokens: 4_096,
    responseProfile: "thorough",
  },
  {
    id: "whisper-tiny",
    capability: "stt",
    name: "Whisper Tiny",
    description: "Multilingual on-device speech recognition.",
    catalogTier: "recommended",
    automaticPriority: 10,
    runtime: "sherpa-onnx",
    runtimeModelId: "sherpa-onnx-whisper-tiny",
    sherpaModelType: "whisper",
    languages: ALL_SPEECH_LANGUAGES,
    downloadBytes: 116_204_861,
    installedBytes: 175_000_000,
    sha256: "c46116994e539aa165266d96b325252728429c12535eb9d8b6a2b10f129e66b1",
    license: "MIT",
    sourceUrl: "https://github.com/k2-fsa/sherpa-onnx",
    downloadUrl:
      "https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-tiny.tar.bz2",
    requirements: speechRequirements(2, 175_000_000),
    benchmark: {
      maximumLoadMs: 20_000,
      maximumRealtimeFactor: 1.5,
    },
  },
  {
    id: "whisper-base",
    capability: "stt",
    name: "Whisper Base",
    description:
      "Balanced multilingual recognition with more capacity than Whisper Tiny.",
    catalogTier: "advanced",
    automaticPriority: 20,
    runtime: "sherpa-onnx",
    runtimeModelId: "sherpa-onnx-whisper-base",
    sherpaModelType: "whisper",
    languages: ALL_SPEECH_LANGUAGES,
    downloadBytes: 207_557_382,
    installedBytes: 315_000_000,
    sha256: "911b2083efd7c0dca2ac3b358b75222660dc09fb716d64fbfc417ba6c99ff3de",
    license: "MIT",
    sourceUrl: "https://github.com/openai/whisper",
    downloadUrl:
      "https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-base.tar.bz2",
    requirements: speechRequirements(3, 315_000_000),
    benchmark: {
      maximumLoadMs: 25_000,
      maximumRealtimeFactor: 1.5,
    },
  },
  {
    id: "whisper-small",
    capability: "stt",
    name: "Whisper Small",
    description:
      "Higher-accuracy Whisper option for stronger phones and difficult audio.",
    catalogTier: "advanced",
    automaticPriority: 30,
    runtime: "sherpa-onnx",
    runtimeModelId: "sherpa-onnx-whisper-small",
    sherpaModelType: "whisper",
    languages: ALL_SPEECH_LANGUAGES,
    downloadBytes: 639_387_718,
    installedBytes: 970_000_000,
    sha256: "486a46afbb7ba798507190ffe02fea2dd726049af212e774537efac6afb210a6",
    license: "MIT",
    sourceUrl: "https://github.com/openai/whisper",
    downloadUrl:
      "https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-small.tar.bz2",
    requirements: speechRequirements(5, 970_000_000),
    benchmark: {
      maximumLoadMs: 40_000,
      maximumRealtimeFactor: 1.5,
    },
  },
  {
    id: "omnilingual-asr-300m",
    capability: "stt",
    name: "Omnilingual ASR 300M",
    description:
      "Broader multilingual on-device recognition for stronger phones.",
    catalogTier: "recommended",
    automaticPriority: 25,
    runtime: "sherpa-onnx",
    runtimeModelId:
      "sherpa-onnx-omnilingual-asr-1600-languages-300M-ctc-v2-int8-2026-02-05",
    sherpaModelType: "omnilingual",
    languages: ALL_SPEECH_LANGUAGES,
    downloadBytes: 292_313_120,
    installedBytes: 430_000_000,
    sha256: "951b32409aade32bd525310bb39e9666773ba3fc611a39e817f620936d76c631",
    license: "Apache-2.0",
    sourceUrl:
      "https://k2-fsa.github.io/sherpa/onnx/omnilingual-asr/models.html",
    downloadUrl:
      "https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-omnilingual-asr-1600-languages-300M-ctc-v2-int8-2026-02-05.tar.bz2",
    requirements: speechRequirements(4, 430_000_000),
    benchmark: {
      maximumLoadMs: 30_000,
      maximumRealtimeFactor: 1.5,
    },
  },
  {
    id: "parakeet-tdt-0.6b-v3-int8",
    capability: "stt",
    name: "Parakeet TDT 0.6B v3",
    description:
      "Modern multilingual recognition with punctuation for stronger phones.",
    catalogTier: "advanced",
    automaticPriority: 40,
    runtime: "sherpa-onnx",
    runtimeModelId: "sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8",
    sherpaModelType: "nemo_transducer",
    languages: ["en", "de", "es", "fr", "it", "pt", "pt-BR", "ru"],
    downloadBytes: 487_170_055,
    installedBytes: 750_000_000,
    sha256: "5793d0fd397c5778d2cf2126994d58e9d56b1be7c04d13c7a15bb1b4eafb16bf",
    license: "CC-BY-4.0",
    sourceUrl: "https://huggingface.co/nvidia/parakeet-tdt-0.6b-v3",
    downloadUrl:
      "https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8.tar.bz2",
    requirements: speechRequirements(6, 750_000_000),
    benchmark: {
      maximumLoadMs: 45_000,
      maximumRealtimeFactor: 1.5,
    },
  },
  {
    id: "qwen3-asr-0.6b-int8",
    capability: "stt",
    name: "Qwen3-ASR 0.6B",
    description:
      "Large multilingual recognizer for users prioritizing recognition quality.",
    catalogTier: "advanced",
    automaticPriority: 35,
    runtime: "sherpa-onnx",
    runtimeModelId: "sherpa-onnx-qwen3-asr-0.6B-int8-2026-03-25",
    sherpaModelType: "qwen3_asr",
    languages: ["en", "de", "es", "fr", "it", "pt", "pt-BR", "ru"],
    downloadBytes: 878_702_423,
    installedBytes: 1_350_000_000,
    sha256: "393f8a14e2f5fb96746aaab342997a40641001fbd5bf9592a080a8329178ee96",
    license: "Apache-2.0",
    sourceUrl: "https://huggingface.co/Qwen/Qwen3-ASR-0.6B",
    downloadUrl:
      "https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-qwen3-asr-0.6B-int8-2026-03-25.tar.bz2",
    requirements: speechRequirements(8, 1_350_000_000),
    benchmark: {
      maximumLoadMs: 70_000,
      maximumRealtimeFactor: 1.5,
    },
  },
  {
    id: "kokoro-multilingual",
    capability: "tts",
    name: "Kokoro",
    description: "Natural English and Simplified Chinese on-device speech.",
    catalogTier: "recommended",
    automaticPriority: 20,
    runtime: "sherpa-onnx",
    runtimeModelId: "kokoro-int8-multi-lang-v1_1",
    sherpaModelType: "kokoro",
    speakerId: 0,
    languages: ["en", "zh-CN"],
    downloadBytes: 147_031_220,
    installedBytes: 221_000_000,
    sha256: "a1e94694776049035c4f2c6529f003aaece993c76aae9a78995831c3c4dcafc6",
    license: "Apache-2.0",
    sourceUrl: "https://github.com/k2-fsa/sherpa-onnx",
    downloadUrl:
      "https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/kokoro-int8-multi-lang-v1_1.tar.bz2",
    requirements: speechRequirements(3, 221_000_000),
    benchmark: {
      maximumLoadMs: 25_000,
      maximumRealtimeFactor: 1.5,
    },
  },
  {
    id: "piper-en-us-kristin",
    capability: "tts",
    name: "Piper · Kristin",
    description: "Compact US English voice.",
    catalogTier: "recommended",
    automaticPriority: 10,
    runtime: "sherpa-onnx",
    runtimeModelId: "vits-piper-en_US-kristin-medium-int8",
    sherpaModelType: "vits",
    speakerId: 0,
    languages: ["en"],
    downloadBytes: 20_882_061,
    installedBytes: 31_000_000,
    sha256: "16289d7ee8e6b2311a0a0af6531a55f498f82499644a1bb6fddb991fe6fa950c",
    license: "Public Domain",
    sourceUrl: "https://huggingface.co/rhasspy/piper-voices",
    downloadUrl:
      "https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-en_US-kristin-medium-int8.tar.bz2",
    requirements: speechRequirements(2, 31_000_000),
    benchmark: { maximumLoadMs: 15_000, maximumRealtimeFactor: 1.5 },
  },
  {
    id: "piper-en-us-norman",
    capability: "tts",
    name: "Piper · Norman",
    description: "Alternative compact US English voice.",
    catalogTier: "advanced",
    runtime: "sherpa-onnx",
    runtimeModelId: "vits-piper-en_US-norman-medium-int8",
    sherpaModelType: "vits",
    speakerId: 0,
    languages: ["en"],
    downloadBytes: 20_987_233,
    installedBytes: 31_000_000,
    sha256: "cb481a514bc213ccf3899391c0f27fdcc4e4b814ec30496f28089a027b5aa01b",
    license: "Public Domain",
    sourceUrl:
      "https://huggingface.co/csukuangfj/vits-piper-en_US-norman-medium",
    downloadUrl:
      "https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-en_US-norman-medium-int8.tar.bz2",
    requirements: speechRequirements(2, 31_000_000),
    benchmark: { maximumLoadMs: 15_000, maximumRealtimeFactor: 1.5 },
  },
  {
    id: "piper-de-de-thorsten",
    capability: "tts",
    name: "Piper · Thorsten",
    description: "Compact German voice.",
    catalogTier: "recommended",
    automaticPriority: 10,
    runtime: "sherpa-onnx",
    runtimeModelId: "vits-piper-de_DE-thorsten-medium-int8",
    sherpaModelType: "vits",
    speakerId: 0,
    languages: ["de"],
    downloadBytes: 20_949_833,
    installedBytes: 31_000_000,
    sha256: "07e240b7b9c1fc9211d5a69512f8cbe11b3286c2ed79c15c076ac6ed427fdf13",
    license: "CC0-1.0",
    sourceUrl: "https://huggingface.co/rhasspy/piper-voices",
    downloadUrl:
      "https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-de_DE-thorsten-medium-int8.tar.bz2",
    requirements: speechRequirements(2, 31_000_000),
    benchmark: { maximumLoadMs: 15_000, maximumRealtimeFactor: 1.5 },
  },
  {
    id: "piper-de-de-kerstin",
    capability: "tts",
    name: "Piper · Kerstin",
    description: "Alternative compact German voice.",
    catalogTier: "advanced",
    runtime: "sherpa-onnx",
    runtimeModelId: "vits-piper-de_DE-kerstin-low-int8",
    sherpaModelType: "vits",
    speakerId: 0,
    languages: ["de"],
    downloadBytes: 21_174_728,
    installedBytes: 32_000_000,
    sha256: "bcd8039667940cf2efc939b844f4b33d0823096572fcc1a8caaa2faa77f3379c",
    license: "CC0-1.0",
    sourceUrl: "https://huggingface.co/rhasspy/piper-voices",
    downloadUrl:
      "https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-de_DE-kerstin-low-int8.tar.bz2",
    requirements: speechRequirements(2, 32_000_000),
    benchmark: { maximumLoadMs: 15_000, maximumRealtimeFactor: 1.5 },
  },
  {
    id: "piper-es-es-sharvard",
    capability: "tts",
    name: "Piper · Sharvard",
    description: "Compact Spanish voice.",
    catalogTier: "recommended",
    automaticPriority: 10,
    runtime: "sherpa-onnx",
    runtimeModelId: "vits-piper-es_ES-sharvard-medium-int8",
    sherpaModelType: "vits",
    speakerId: 0,
    languages: ["es"],
    downloadBytes: 23_477_120,
    installedBytes: 35_000_000,
    sha256: "bf5507cbdedea650365bd6175b3164a8ecca5847533ddf97afcba9d76ea599d1",
    license: "CC-BY-3.0",
    sourceUrl: "https://huggingface.co/rhasspy/piper-voices",
    downloadUrl:
      "https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-es_ES-sharvard-medium-int8.tar.bz2",
    requirements: speechRequirements(2, 35_000_000),
    benchmark: { maximumLoadMs: 15_000, maximumRealtimeFactor: 1.5 },
  },
  {
    id: "piper-es-es-davefx",
    capability: "tts",
    name: "Piper · DaveFX",
    description: "Alternative compact Spanish voice.",
    catalogTier: "advanced",
    runtime: "sherpa-onnx",
    runtimeModelId: "vits-piper-es_ES-davefx-medium-int8",
    sherpaModelType: "vits",
    speakerId: 0,
    languages: ["es"],
    downloadBytes: 21_171_632,
    installedBytes: 32_000_000,
    sha256: "8bb8ac1cefb727caec9bd9c6c3185c673c8b42c53bd29bb25d5a7715dac37125",
    license: "CC0-1.0",
    sourceUrl: "https://huggingface.co/rhasspy/piper-voices",
    downloadUrl:
      "https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-es_ES-davefx-medium-int8.tar.bz2",
    requirements: speechRequirements(2, 32_000_000),
    benchmark: { maximumLoadMs: 15_000, maximumRealtimeFactor: 1.5 },
  },
  {
    id: "piper-fr-fr-siwis",
    capability: "tts",
    name: "Piper · Siwis",
    description: "Compact French voice.",
    catalogTier: "recommended",
    automaticPriority: 10,
    runtime: "sherpa-onnx",
    runtimeModelId: "vits-piper-fr_FR-siwis-medium-int8",
    sherpaModelType: "vits",
    speakerId: 0,
    languages: ["fr"],
    downloadBytes: 20_914_888,
    installedBytes: 31_000_000,
    sha256: "3909cff9b3cfd4820c66aa13bf554315c82e34899c161f0b446ece372bc4b5ec",
    license: "CC-BY-4.0",
    sourceUrl: "https://huggingface.co/rhasspy/piper-voices",
    downloadUrl:
      "https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-fr_FR-siwis-medium-int8.tar.bz2",
    requirements: speechRequirements(2, 31_000_000),
    benchmark: { maximumLoadMs: 15_000, maximumRealtimeFactor: 1.5 },
  },
  {
    id: "piper-fr-fr-gilles",
    capability: "tts",
    name: "Piper · Gilles",
    description: "Alternative compact French voice.",
    catalogTier: "advanced",
    runtime: "sherpa-onnx",
    runtimeModelId: "vits-piper-fr_FR-gilles-low-int8",
    sherpaModelType: "vits",
    speakerId: 0,
    languages: ["fr"],
    downloadBytes: 21_248_965,
    installedBytes: 32_000_000,
    sha256: "92d2bfd9b6b32b9787557c466b15620e453aecc10ec521762660e034941b3c43",
    license: "CC0-1.0",
    sourceUrl: "https://huggingface.co/rhasspy/piper-voices",
    downloadUrl:
      "https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-fr_FR-gilles-low-int8.tar.bz2",
    requirements: speechRequirements(2, 32_000_000),
    benchmark: { maximumLoadMs: 15_000, maximumRealtimeFactor: 1.5 },
  },
  {
    id: "piper-pt-br-faber",
    capability: "tts",
    name: "Piper · Faber",
    description: "Compact Brazilian Portuguese voice.",
    catalogTier: "recommended",
    automaticPriority: 10,
    runtime: "sherpa-onnx",
    runtimeModelId: "vits-piper-pt_BR-faber-medium-int8",
    sherpaModelType: "vits",
    speakerId: 0,
    languages: ["pt-BR"],
    downloadBytes: 21_336_772,
    installedBytes: 32_000_000,
    sha256: "dbc8b1d7d729fd417ea78a350ed35696c928770ac93513d3f507bd4e88eee3fd",
    license: "CC0-1.0",
    sourceUrl: "https://huggingface.co/rhasspy/piper-voices",
    downloadUrl:
      "https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-pt_BR-faber-medium-int8.tar.bz2",
    requirements: speechRequirements(2, 32_000_000),
    benchmark: { maximumLoadMs: 15_000, maximumRealtimeFactor: 1.5 },
  },
  {
    id: "piper-pt-br-cadu",
    capability: "tts",
    name: "Piper · Cadu",
    description: "Alternative compact Brazilian Portuguese voice.",
    catalogTier: "advanced",
    runtime: "sherpa-onnx",
    runtimeModelId: "vits-piper-pt_BR-cadu-medium-int8",
    sherpaModelType: "vits",
    speakerId: 0,
    languages: ["pt-BR"],
    downloadBytes: 21_135_464,
    installedBytes: 32_000_000,
    sha256: "78f1caf0a74cc6cb8dedaff87affd232ee653d5b0394d4cf4d2e97ecbfa5ff3d",
    license: "CC0-1.0",
    sourceUrl: "https://huggingface.co/rhasspy/piper-voices",
    downloadUrl:
      "https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-pt_BR-cadu-medium-int8.tar.bz2",
    requirements: speechRequirements(2, 32_000_000),
    benchmark: { maximumLoadMs: 15_000, maximumRealtimeFactor: 1.5 },
  },
  {
    id: "piper-pt-pt-tugao",
    capability: "tts",
    name: "Piper · Tugão",
    description: "Compact European Portuguese voice.",
    catalogTier: "recommended",
    automaticPriority: 10,
    runtime: "sherpa-onnx",
    runtimeModelId: "vits-piper-pt_PT-tugao-medium-int8",
    sherpaModelType: "vits",
    speakerId: 0,
    languages: ["pt"],
    downloadBytes: 21_253_211,
    installedBytes: 32_000_000,
    sha256: "8f4c5e4a5994d0d1a2c10fb3035631add0460ea5c776f5ea40d3d6051140dbc3",
    license: "CC0-1.0",
    sourceUrl: "https://huggingface.co/rhasspy/piper-voices",
    downloadUrl:
      "https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-pt_PT-tugao-medium-int8.tar.bz2",
    requirements: speechRequirements(2, 32_000_000),
    benchmark: { maximumLoadMs: 15_000, maximumRealtimeFactor: 1.5 },
  },
  {
    id: "piper-ru-ru-dmitri",
    capability: "tts",
    name: "Piper · Dmitri",
    description: "Compact Russian voice.",
    catalogTier: "recommended",
    automaticPriority: 10,
    runtime: "sherpa-onnx",
    runtimeModelId: "vits-piper-ru_RU-dmitri-medium-int8",
    sherpaModelType: "vits",
    speakerId: 0,
    languages: ["ru"],
    downloadBytes: 21_129_441,
    installedBytes: 32_000_000,
    sha256: "7636793307f634ce54c6e65528a91a61683114f1a6635a08caf64ba6c54e6a63",
    license: "CC0-1.0",
    sourceUrl: "https://huggingface.co/rhasspy/piper-voices",
    downloadUrl:
      "https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-ru_RU-dmitri-medium-int8.tar.bz2",
    requirements: speechRequirements(2, 32_000_000),
    benchmark: { maximumLoadMs: 15_000, maximumRealtimeFactor: 1.5 },
  },
  {
    id: "piper-ru-ru-denis",
    capability: "tts",
    name: "Piper · Denis",
    description: "Alternative compact Russian voice.",
    catalogTier: "advanced",
    runtime: "sherpa-onnx",
    runtimeModelId: "vits-piper-ru_RU-denis-medium-int8",
    sherpaModelType: "vits",
    speakerId: 0,
    languages: ["ru"],
    downloadBytes: 21_058_905,
    installedBytes: 32_000_000,
    sha256: "d710e29eb7854c42461d16d65d3cef753cc559639ca75806edc75ba71f23af66",
    license: "CC0-1.0",
    sourceUrl: "https://huggingface.co/rhasspy/piper-voices",
    downloadUrl:
      "https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-ru_RU-denis-medium-int8.tar.bz2",
    requirements: speechRequirements(2, 32_000_000),
    benchmark: { maximumLoadMs: 15_000, maximumRealtimeFactor: 1.5 },
  },
  {
    id: "piper-it-it-paola",
    capability: "tts",
    name: "Piper · Paola",
    description: "Compact Italian voice.",
    catalogTier: "recommended",
    automaticPriority: 10,
    runtime: "sherpa-onnx",
    runtimeModelId: "vits-piper-it_IT-paola-medium-int8",
    sherpaModelType: "vits",
    speakerId: 0,
    languages: ["it"],
    downloadBytes: 21_143_212,
    installedBytes: 32_000_000,
    sha256: "2b975ed305391c056944a4dde67ee754dd824099503a860295bb4c1d724662d8",
    license: "CC0-1.0",
    sourceUrl: "https://huggingface.co/rhasspy/piper-voices",
    downloadUrl:
      "https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-it_IT-paola-medium-int8.tar.bz2",
    requirements: speechRequirements(2, 32_000_000),
    benchmark: { maximumLoadMs: 15_000, maximumRealtimeFactor: 1.5 },
  },
  {
    id: "piper-it-it-riccardo",
    capability: "tts",
    name: "Piper · Riccardo",
    description: "Alternative lightweight Italian voice.",
    catalogTier: "advanced",
    runtime: "sherpa-onnx",
    runtimeModelId: "vits-piper-it_IT-riccardo-x_low-int8",
    sherpaModelType: "vits",
    speakerId: 0,
    languages: ["it"],
    downloadBytes: 13_329_285,
    installedBytes: 21_000_000,
    sha256: "afc2ea457fd45420dbdd87db4b3927b4fc97b00511964d474bb43e03092d37c1",
    license: "BSD-3-Clause",
    sourceUrl: "https://huggingface.co/rhasspy/piper-voices",
    downloadUrl:
      "https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-it_IT-riccardo-x_low-int8.tar.bz2",
    requirements: speechRequirements(2, 21_000_000),
    benchmark: { maximumLoadMs: 15_000, maximumRealtimeFactor: 1.5 },
  },
] as const satisfies readonly LocalModelDefinition[];

export function isLocalModelId(value: unknown): value is LocalModelId {
  return (
    typeof value === "string" &&
    LOCAL_MODEL_CATALOG.some((model) => model.id === value)
  );
}

export function getLocalModel(modelId: LocalModelId): LocalModelDefinition {
  const model = LOCAL_MODEL_CATALOG.find(
    (candidate) => candidate.id === modelId,
  );

  if (!model) {
    throw new Error(`Unknown local model: ${modelId}`);
  }

  return model;
}

export function getLocalModelsForCapability<T extends LocalModelCapability>(
  capability: T,
): Extract<LocalModelDefinition, { capability: T }>[] {
  return LOCAL_MODEL_CATALOG.filter(
    (model) => model.capability === capability,
  ) as unknown as Extract<LocalModelDefinition, { capability: T }>[];
}

export function localModelSupportsLanguages(
  model: LocalModelDefinition,
  languages: readonly SpeechLanguage[],
) {
  return languages.every((language) => model.languages.includes(language));
}

export function getLocalModelsForLanguages<T extends LocalModelCapability>(
  capability: T,
  languages: readonly SpeechLanguage[],
) {
  return getLocalModelsForCapability(capability).filter((model) =>
    localModelSupportsLanguages(model, languages),
  );
}
