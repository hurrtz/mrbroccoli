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
    catalogVersion: 1,
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
      expect(result.profile.tts.id).toBe("kokoro-multilingual");
    }
  });

  it("selects the language-specific German voice", () => {
    expect(readyProfile("de").tts.id).toBe("piper-de-de-thorsten");
  });

  it("rejects a language set without one complete local TTS route", () => {
    expect(
      selectOfflineProfile({
        languages: ["en", "de"],
        snapshot: device(),
      }),
    ).toEqual({ status: "unavailable", reason: "language" });
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
      expect(result.profile.tts.id).toBe("piper-en-us-kristin");
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
    expect(effective.apiKeys.openai).toBe("");
    expect(settings.apiKeys.openai).toBe("kept-secret");
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
