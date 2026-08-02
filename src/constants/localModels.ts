import {
  SPEECH_LANGUAGE_OPTIONS,
  type SpeechLanguage,
} from "./speechLanguages";

export const LOCAL_MODEL_CATALOG_VERSION = 1;

export type LocalModelCapability = "llm" | "stt" | "tts";
export type LocalModelRuntime = "llama-rn" | "sherpa-onnx";
export type LocalModelPlatform = "android" | "ios";
export type LocalModelId =
  | "qwen3-0.6b-q8"
  | "qwen3-1.7b-q8"
  | "whisper-tiny"
  | "kokoro-multilingual"
  | "piper-en-us-kristin"
  | "piper-de-de-thorsten"
  | "piper-es-es-sharvard"
  | "piper-fr-fr-siwis"
  | "piper-pt-br-faber";
export type LocalLlmModelId = Extract<
  LocalModelId,
  "qwen3-0.6b-q8" | "qwen3-1.7b-q8"
>;
export type LocalSttModelId = Extract<LocalModelId, "whisper-tiny">;
export type LocalTtsModelId = Extract<
  LocalModelId,
  | "piper-en-us-kristin"
  | "piper-de-de-thorsten"
  | "piper-es-es-sharvard"
  | "piper-fr-fr-siwis"
  | "piper-pt-br-faber"
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
}

export interface LocalSttModelDefinition extends LocalModelBase {
  id: LocalSttModelId;
  capability: "stt";
  runtime: "sherpa-onnx";
  runtimeModelId: string;
  sherpaModelType: "whisper";
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
  },
  {
    id: "qwen3-1.7b-q8",
    capability: "llm",
    name: "Qwen3 1.7B",
    description: "Higher-quality multilingual responses on stronger phones.",
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
  },
  {
    id: "whisper-tiny",
    capability: "stt",
    name: "Whisper Tiny",
    description: "Multilingual on-device speech recognition.",
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
    id: "kokoro-multilingual",
    capability: "tts",
    name: "Kokoro",
    description: "Natural English and Simplified Chinese on-device speech.",
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
    id: "piper-de-de-thorsten",
    capability: "tts",
    name: "Piper · Thorsten",
    description: "Compact German voice.",
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
    id: "piper-es-es-sharvard",
    capability: "tts",
    name: "Piper · Sharvard",
    description: "Compact Spanish voice.",
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
    id: "piper-fr-fr-siwis",
    capability: "tts",
    name: "Piper · Siwis",
    description: "Compact French voice.",
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
    id: "piper-pt-br-faber",
    capability: "tts",
    name: "Piper · Faber",
    description: "Compact Brazilian Portuguese voice.",
    runtime: "sherpa-onnx",
    runtimeModelId: "vits-piper-pt_BR-faber-medium-int8",
    sherpaModelType: "vits",
    speakerId: 0,
    languages: ["pt-BR"],
    downloadBytes: 21_336_772,
    installedBytes: 32_000_000,
    sha256: "05386120a50ee0c46e246bd0b9ad1c7b3116606b3f0c037db8ee4dd5dda712c5",
    license: "CC0-1.0",
    sourceUrl: "https://huggingface.co/rhasspy/piper-voices",
    downloadUrl:
      "https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-pt_BR-faber-medium-int8.tar.bz2",
    requirements: speechRequirements(2, 32_000_000),
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
