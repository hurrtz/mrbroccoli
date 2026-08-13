import {
  LOCAL_MODEL_CATALOG_VERSION,
  getLocalModel,
  getLocalModelsForLanguages,
} from "../../src/constants/localModels";
import {
  applyOfflineProfileToSettings,
  applyUnavailableFreeSettings,
  getAppliedOfflineProfileSettingsUpdate,
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
  extra: Partial<LocalModelBenchmarkResult> = {},
): LocalModelBenchmarkResult {
  const snapshot = device();
  return {
    modelId,
    catalogVersion: LOCAL_MODEL_CATALOG_VERSION,
    testedAt: snapshot.capturedAt,
    status,
    loadMs: 10,
    durationMs: 10,
    device: snapshot,
    ...extra,
  };
}

describe("free offline profile selection", () => {
  it("selects a compact English voice for automatic Android setup", () => {
    const result = selectOfflineProfile({
      languages: ["en"],
      snapshot: device(),
    });

    expect(result.status).toBe("ready");
    if (result.status === "ready") {
      expect(result.profile.llm.id).toBe("granite-4.0-1b-q4");
      expect(result.profile.thoroughLlm?.id).toBe(
        "ministral-3-3b-reasoning-q4",
      );
      expect(result.profile.stt.id).toBe("parakeet-tdt-0.6b-v3-int8");
      expect(result.profile.tts?.id).toBe("piper-en-us-kristin");
    }
  });

  it("keeps Kokoro as the quality-first automatic English voice on iOS", () => {
    const result = selectOfflineProfile({
      languages: ["en"],
      snapshot: device({ platform: "ios", architecture: "arm64" }),
    });

    expect(result.status).toBe("ready");
    if (result.status === "ready") {
      expect(result.profile.tts?.id).toBe("kokoro-multilingual");
    }
  });

  it("uses the system voice instead of automatically running Kokoro on Android", () => {
    const result = selectOfflineProfile({
      languages: ["zh-CN"],
      snapshot: device(),
    });

    expect(result.status).toBe("ready");
    if (result.status === "ready") {
      expect(result.profile.tts).toBeNull();
    }
  });

  it("honors an explicit Kokoro selection on Android", () => {
    const result = selectOfflineProfile({
      languages: ["en"],
      snapshot: device(),
      overrides: { ttsModelId: "kokoro-multilingual" },
    });

    expect(result.status).toBe("ready");
    if (result.status === "ready") {
      expect(result.profile.tts?.id).toBe("kokoro-multilingual");
    }
  });

  it("selects the language-specific German voice", () => {
    expect(readyProfile("de").tts?.id).toBe("piper-de-de-thorsten");
  });

  it("selects stronger German models for a high-end iPhone", () => {
    const result = selectOfflineProfile({
      languages: ["de"],
      snapshot: device({
        platform: "ios",
        physicalMemoryBytes: 11.4 * GIB,
        availableMemoryBytes: 8 * GIB,
        freeStorageBytes: 345.8 * GIB,
        totalStorageBytes: 512 * GIB,
        processorCount: 6,
        activeProcessorCount: 6,
        architecture: "arm64",
        osVersion: "26.5.2",
      }),
    });

    expect(result.status).toBe("ready");
    if (result.status === "ready") {
      expect(result.profile.llm.id).toBe("granite-4.0-1b-q4");
      expect(result.profile.thoroughLlm?.id).toBe(
        "ministral-3-3b-reasoning-q4",
      );
      expect(result.profile.stt?.id).toBe("parakeet-tdt-0.6b-v3-int8");
      expect(result.profile.tts?.id).toBe("piper-de-de-thorsten");
    }
  });

  it("uses phone-native offline recognition only when the device reports it", () => {
    const result = selectOfflineProfile({
      languages: ["de"],
      snapshot: device(),
      nativeSttEligible: true,
      overrides: { sttModelId: null },
    });

    expect(result.status).toBe("ready");
    if (result.status === "ready") {
      expect(result.profile.stt).toBeNull();
      const effective = applyOfflineProfileToSettings(
        DEFAULT_SETTINGS,
        result.profile,
      );
      expect(effective.sttMode).toBe("native");
      expect(effective.nativeSttRequiresOnDevice).toBe(true);
      expect(effective.localSttModelId).toBeNull();
    }
  });

  it("falls back to local recognition when phone-native offline recognition is unavailable", () => {
    const result = selectOfflineProfile({
      languages: ["de"],
      snapshot: device(),
      nativeSttEligible: false,
      overrides: { sttModelId: null },
    });

    expect(result.status).toBe("ready");
    if (result.status === "ready") {
      expect(result.profile.stt?.id).toBe("parakeet-tdt-0.6b-v3-int8");
    }
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
        getLocalModel("granite-4.0-1b-q4").downloadBytes +
          getLocalModel("ministral-3-3b-reasoning-q4").downloadBytes +
          getLocalModel("parakeet-tdt-0.6b-v3-int8").downloadBytes,
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
    const llm = getLocalModel("granite-4.0-1b-q4");
    const stt = getLocalModel("parakeet-tdt-0.6b-v3-int8");
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
        "granite-4.0-1b-q4",
        "parakeet-tdt-0.6b-v3-int8",
        "piper-de-de-thorsten",
      ]),
    });

    expect(result.status).toBe("ready");
    if (result.status === "ready") {
      expect(result.profile.downloadBytes).toBe(0);
      expect(result.profile.installedBytes).toBe(0);
    }
  });

  it("does not let smaller installed fallbacks displace stronger models", () => {
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
      expect(result.profile.llm.id).toBe("granite-4.0-1b-q4");
      expect(result.profile.thoroughLlm?.id).toBe(
        "ministral-3-3b-reasoning-q4",
      );
      expect(result.profile.stt?.id).toBe("parakeet-tdt-0.6b-v3-int8");
      expect(result.profile.tts?.id).toBe("piper-en-us-kristin");
    }
  });

  it("does not let lower-ranked installed models replace automatic recommendations", () => {
    const result = selectOfflineProfile({
      languages: ["en"],
      snapshot: device(),
      installedModelIds: new Set([
        "qwen3.5-0.8b-q8",
        "whisper-base",
        "piper-en-us-norman",
      ]),
    });

    expect(result.status).toBe("ready");
    if (result.status === "ready") {
      expect(result.profile.llm.id).toBe("granite-4.0-1b-q4");
      expect(result.profile.stt?.id).toBe("parakeet-tdt-0.6b-v3-int8");
      expect(result.profile.tts?.id).toBe("piper-en-us-kristin");
    }
  });

  it("avoids a model with a current failed device benchmark", () => {
    const result = selectOfflineProfile({
      languages: ["en"],
      snapshot: device(),
      installedModelIds: new Set(["ministral-3-3b-reasoning-q4"]),
      benchmarks: {
        "ministral-3-3b-reasoning-q4": benchmark(
          "ministral-3-3b-reasoning-q4",
          "below-target",
        ),
      },
    });

    expect(result.status).toBe("ready");
    if (result.status === "ready") {
      expect(result.profile.llm.id).toBe("granite-4.0-1b-q4");
      expect(result.profile.thoroughLlm?.id).toBe("qwen3-4b-q4");
    }
  });

  it("does not hold a throttled run against the phone", () => {
    // A result recorded in battery saver describes the moment, not the device.
    // Counting it as evidence disqualified the model permanently, and once
    // every candidate had one the app declared the phone unable to run a local
    // setup at all -- across restarts, because benchmarks are persisted.
    // Every candidate for the language, so the selector has nothing left to
    // fall back to if throttled results are counted against the phone.
    const underPressure = Object.fromEntries(
      (["llm", "stt", "tts"] as const)
        .flatMap((capability) => getLocalModelsForLanguages(capability, ["en"]))
        .map((model) => [
          model.id,
          benchmark(model.id, "failed", { measuredUnderPressure: true }),
        ]),
    );

    const result = selectOfflineProfile({
      languages: ["en"],
      snapshot: device(),
      benchmarks: underPressure,
    });

    expect(result.status).toBe("ready");
  });

  it("still rules out a model that failed while the phone was idle", () => {
    const result = selectOfflineProfile({
      languages: ["en"],
      snapshot: device(),
      installedModelIds: new Set(["ministral-3-3b-reasoning-q4"]),
      benchmarks: {
        "ministral-3-3b-reasoning-q4": benchmark(
          "ministral-3-3b-reasoning-q4",
          "failed",
        ),
      },
    });

    expect(result.status).toBe("ready");
    if (result.status === "ready") {
      expect(result.profile.llm.id).not.toBe("ministral-3-3b-reasoning-q4");
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

    expect(effective.responseModes).toHaveLength(2);
    expect(effective.language).toBe("de");
    expect(effective.assistantInstructions).toContain(
      "Antworte natürlich und gesprächsnah",
    );
    expect(effective.responseModes[0]?.route.runtime).toBe("local");
    expect(effective.responseModes[1]?.route.localModelId).toBe(
      "ministral-3-3b-reasoning-q4",
    );
    expect(effective.sttMode).toBe("local");
    expect(effective.ttsMode).toBe("local");
    expect(effective.webSearchMode).toBe("off");
    expect(effective.ulraModeActive).toBe(false);
    expect(effective.pastConversationKnowledgeEnabled).toBe(false);
    expect(effective.showDebugLogButton).toBe(true);
    expect(effective.apiKeys.openai).toBe("");
    expect(settings.apiKeys.openai).toBe("kept-secret");
  });

  it("preserves the Thorough card after the user selects it", () => {
    const profile = readyProfile("de");
    const effective = applyOfflineProfileToSettings(
      { ...DEFAULT_SETTINGS, activeResponseMode: "free-offline-thorough" },
      profile,
    );

    expect(effective.activeResponseMode).toBe("free-offline-thorough");
  });

  it("persists one ready Free profile while preserving hosted slots within the four-slot limit", () => {
    const providerModes = Array.from({ length: 4 }, (_, index) => ({
      id: `hosted-${index + 1}`,
      route: {
        provider: "openai" as const,
        model: "gpt-5.5-2026-04-23",
      },
    }));

    const update = getAppliedOfflineProfileSettingsUpdate(
      { ...DEFAULT_SETTINGS, responseModes: providerModes },
      readyProfile("de"),
      { thoroughLlmModelId: "ministral-3-3b-reasoning-q4" },
    );

    expect(update.freeOfflineSetupCompleted).toBe(true);
    expect(update.responseModes).toHaveLength(4);
    expect(
      update.responseModes?.filter(({ route }) => route.runtime === "local"),
    ).toHaveLength(2);
    expect(
      update.responseModes?.filter(({ route }) => route.runtime !== "local"),
    ).toHaveLength(2);
    expect(update.freeOfflineProfileOverrides).toEqual({
      thoroughLlmModelId: "ministral-3-3b-reasoning-q4",
    });
  });

  it("keeps one Quick route when memory or storage cannot support Thorough", () => {
    const selection = selectOfflineProfile({
      languages: ["de"],
      snapshot: device({
        physicalMemoryBytes: 4 * GIB,
        availableMemoryBytes: 2 * GIB,
      }),
    });
    if (selection.status !== "ready") {
      throw new Error("Expected a Quick-only profile");
    }

    expect(selection.profile.thoroughLlm).toBeNull();
    expect(selection.profile.llm.id).toBe("granite-4.0-1b-q4");
    expect(
      applyOfflineProfileToSettings(DEFAULT_SETTINGS, selection.profile)
        .responseModes,
    ).toHaveLength(1);
  });

  it("keeps the completed Quick and Thorough routes during cold-start evaluation", () => {
    const completedSettings = {
      ...applyOfflineProfileToSettings(DEFAULT_SETTINGS, readyProfile("de")),
      freeOfflineSetupCompleted: true,
    };

    const effective = applyUnavailableFreeSettings(completedSettings);

    expect(effective.responseModes.map(({ id }) => id)).toEqual([
      "free-offline",
      "free-offline-thorough",
    ]);
    expect(
      effective.responseModes.map(({ route }) => route.localModelId),
    ).toEqual(["granite-4.0-1b-q4", "ministral-3-3b-reasoning-q4"]);
  });

  it("keeps Qwen3 0.6B as a constrained-device fallback", () => {
    const selection = selectOfflineProfile({
      languages: ["de"],
      snapshot: device({
        physicalMemoryBytes: 3 * GIB,
        availableMemoryBytes: 1.5 * GIB,
      }),
    });
    if (selection.status !== "ready") {
      throw new Error("Expected a constrained fallback profile");
    }

    expect(selection.profile.llm.id).toBe("qwen3-0.6b-q8");
    expect(selection.profile.thoroughLlm).toBeNull();
  });

  it("applies compatible advanced speech and reasoning choices", () => {
    const selection = selectOfflineProfile({
      languages: ["en"],
      snapshot: device(),
      overrides: {
        thoroughLlmModelId: null,
        sttModelId: "omnilingual-asr-300m",
        ttsModelId: "piper-en-us-kristin",
      },
    });
    if (selection.status !== "ready") {
      throw new Error("Expected an advanced profile");
    }

    expect(selection.profile.thoroughLlm).toBeNull();
    expect(selection.profile.stt.id).toBe("omnilingual-asr-300m");
    expect(selection.profile.tts?.id).toBe("piper-en-us-kristin");
  });

  it("applies opt-in catalogue alternatives after device filtering", () => {
    const selection = selectOfflineProfile({
      languages: ["ru"],
      snapshot: device(),
      overrides: {
        quickLlmModelId: "qwen3.5-0.8b-q8",
        thoroughLlmModelId: "qwen3-4b-q4",
        sttModelId: "parakeet-tdt-0.6b-v3-int8",
        ttsModelId: "piper-ru-ru-denis",
      },
    });
    if (selection.status !== "ready") {
      throw new Error("Expected an advanced Russian profile");
    }

    expect(selection.profile.llm.id).toBe("qwen3.5-0.8b-q8");
    expect(selection.profile.thoroughLlm?.id).toBe("qwen3-4b-q4");
    expect(selection.profile.stt?.id).toBe("parakeet-tdt-0.6b-v3-int8");
    expect(selection.profile.tts?.id).toBe("piper-ru-ru-denis");
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
