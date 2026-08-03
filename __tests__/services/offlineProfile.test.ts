import { getLocalModel } from "../../src/constants/localModels";
import {
  applyOfflineProfileToSettings,
  applyUnavailableFreeSettings,
  selectOfflineProfile,
} from "../../src/services/offlineProfile";
import type {
  LocalDeviceSnapshot,
  LocalModelBenchmarkResult,
} from "../../src/services/localDeviceCapabilities";
import { DEFAULT_SETTINGS } from "../../src/types";

const GIB = 1024 ** 3;

function device(
  partial: Partial<LocalDeviceSnapshot> = {},
): LocalDeviceSnapshot {
  return {
    version: 1,
    capturedAt: "2026-08-02T00:00:00.000Z",
    platform: "android",
    physicalMemoryBytes: 8 * GIB,
    availableMemoryBytes: 5 * GIB,
    freeStorageBytes: 10 * GIB,
    totalStorageBytes: 128 * GIB,
    processorCount: 8,
    activeProcessorCount: 8,
    architecture: "arm64-v8a",
    osVersion: "16",
    lowPowerMode: false,
    memoryLow: false,
    thermalState: "nominal",
    ...partial,
  };
}

function readyProfile(language: "en" | "de" | "zh-CN") {
  const selection = selectOfflineProfile({
    languages: [language],
    snapshot: device(),
  });
  if (selection.status !== "ready") {
    throw new Error(`Expected a ready ${language} profile`);
  }
  return selection.profile;
}

function benchmark(
  modelId: LocalModelBenchmarkResult["modelId"],
  status: LocalModelBenchmarkResult["status"],
): LocalModelBenchmarkResult {
  const snapshot = device();
  return {
    modelId,
    catalogVersion: 2,
    testedAt: snapshot.capturedAt,
    status,
    loadMs: 10,
    durationMs: 10,
    device: snapshot,
  };
}

describe("free offline profile selection", () => {
  it("selects a complete quality-first English profile", () => {
    const result = selectOfflineProfile({
      languages: ["en"],
      snapshot: device(),
    });

    expect(result.status).toBe("ready");
    if (result.status === "ready") {
      expect(result.profile.llm.id).toBe("qwen3-0.6b-q8");
      expect(result.profile.stt.id).toBe("whisper-tiny");
      expect(result.profile.tts?.id).toBe("kokoro-multilingual");
    }
  });

  it("selects the language-specific German voice", () => {
    expect(readyProfile("de").tts?.id).toBe("piper-de-de-thorsten");
  });

  it.each([
    ["it", "piper-it-it-paola"],
    ["ru", "piper-ru-ru-dmitri"],
    ["pt", "piper-pt-pt-tugao"],
  ] as const)("selects a compact %s voice", (language, modelId) => {
    const result = selectOfflineProfile({
      languages: [language],
      snapshot: device(),
    });

    expect(result.status).toBe("ready");
    if (result.status === "ready") {
      expect(result.profile.tts?.id).toBe(modelId);
    }
  });

  it("uses the system voice when two languages have no shared local TTS model", () => {
    const result = selectOfflineProfile({
      languages: ["en", "de"],
      snapshot: device(),
    });

    expect(result.status).toBe("ready");
    if (result.status === "ready") {
      expect(result.profile.languages).toEqual(["en", "de"]);
      expect(result.profile.tts).toBeNull();
      expect(result.profile.downloadBytes).toBe(
        getLocalModel("qwen3-0.6b-q8").downloadBytes +
          getLocalModel("whisper-tiny").downloadBytes,
      );
    }
  });

  it("keeps Free available in a language without a downloadable voice pack", () => {
    const result = selectOfflineProfile({
      languages: ["ja"],
      snapshot: device(),
    });

    expect(result.status).toBe("ready");
    if (result.status === "ready") {
      expect(result.profile.tts).toBeNull();
    }
  });

  it("checks aggregate installation storage instead of each model alone", () => {
    const llm = getLocalModel("qwen3-0.6b-q8");
    const stt = getLocalModel("whisper-tiny");
    const tts = getLocalModel("piper-de-de-thorsten");
    const combinedRequired =
      llm.installedBytes +
      stt.installedBytes +
      tts.installedBytes +
      (llm.requirements.minimumFreeStorageBytes - llm.installedBytes);

    expect(
      selectOfflineProfile({
        languages: ["de"],
        snapshot: device({ freeStorageBytes: combinedRequired - 1 }),
      }),
    ).toEqual({ status: "unavailable", reason: "storage" });
  });

  it("does not reserve installation bytes for already installed models", () => {
    const result = selectOfflineProfile({
      languages: ["de"],
      snapshot: device({ freeStorageBytes: 900 * 1024 ** 2 }),
      installedModelIds: new Set([
        "qwen3-0.6b-q8",
        "whisper-tiny",
        "piper-de-de-thorsten",
      ]),
    });

    expect(result.status).toBe("ready");
    if (result.status === "ready") {
      expect(result.profile.downloadBytes).toBe(0);
      expect(result.profile.installedBytes).toBe(0);
    }
  });

  it("reuses an already installed complete profile before downloading defaults", () => {
    const result = selectOfflineProfile({
      languages: ["en"],
      snapshot: device(),
      installedModelIds: new Set([
        "qwen3-1.7b-q8",
        "whisper-tiny",
        "piper-en-us-kristin",
      ]),
    });

    expect(result.status).toBe("ready");
    if (result.status === "ready") {
      expect(result.profile.llm.id).toBe("qwen3-1.7b-q8");
      expect(result.profile.tts?.id).toBe("piper-en-us-kristin");
      expect(result.profile.downloadBytes).toBe(0);
    }
  });

  it("avoids a model with a current failed device benchmark", () => {
    const result = selectOfflineProfile({
      languages: ["en"],
      snapshot: device(),
      installedModelIds: new Set(["qwen3-1.7b-q8"]),
      benchmarks: {
        "qwen3-1.7b-q8": benchmark("qwen3-1.7b-q8", "below-target"),
      },
    });

    expect(result.status).toBe("ready");
    if (result.status === "ready") {
      expect(result.profile.llm.id).toBe("qwen3-0.6b-q8");
    }
  });

  it("derives a provider-free runtime without mutating stored credentials", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      apiKeys: { ...DEFAULT_SETTINGS.apiKeys, openai: "kept-secret" },
      pastConversationKnowledgeEnabled: true,
      showDebugLogButton: true,
      ulraModeActive: true,
      webSearchMode: "on" as const,
      webSearchProvider: "openai" as const,
    };
    const effective = applyOfflineProfileToSettings(
      settings,
      readyProfile("de"),
    );

    expect(effective.responseModes).toHaveLength(1);
    expect(effective.responseModes[0]?.route.runtime).toBe("local");
    expect(effective.sttMode).toBe("local");
    expect(effective.ttsMode).toBe("local");
    expect(effective.webSearchMode).toBe("off");
    expect(effective.ulraModeActive).toBe(false);
    expect(effective.pastConversationKnowledgeEnabled).toBe(false);
    expect(effective.showDebugLogButton).toBe(true);
    expect(effective.apiKeys.openai).toBe("");
    expect(settings.apiKeys.openai).toBe("kept-secret");
  });

  it("routes a bilingual Free profile through language-aware system speech", () => {
    const selection = selectOfflineProfile({
      languages: ["en", "de"],
      snapshot: device(),
    });
    if (selection.status !== "ready") {
      throw new Error("Expected a bilingual offline profile");
    }

    const effective = applyOfflineProfileToSettings(
      DEFAULT_SETTINGS,
      selection.profile,
    );

    expect(effective.sttMode).toBe("local");
    expect(effective.sttLanguage).toBe("auto");
    expect(effective.ttsMode).toBe("native");
    expect(effective.localTtsModelId).toBeNull();
    expect(effective.ttsListenLanguages).toEqual(["en", "de"]);
  });

  it("keeps Free inert while no complete profile is ready", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      apiKeys: { ...DEFAULT_SETTINGS.apiKeys, openai: "kept-secret" },
      webSearchMode: "on" as const,
      webSearchProvider: "openai" as const,
    };

    const effective = applyUnavailableFreeSettings(settings);

    expect(effective.responseModes[0]?.route.runtime).toBe("local");
    expect(effective.localSttModelId).toBeNull();
    expect(effective.ttsMode).toBe("native");
    expect(effective.webSearchMode).toBe("off");
    expect(effective.apiKeys.openai).toBe("");
    expect(settings.apiKeys.openai).toBe("kept-secret");
  });
});
