import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { renderHook, act, waitFor } from "@testing-library/react-native";
import { useSettings } from "../../src/hooks/useSettings";
import {
  DEFAULT_SETTINGS,
  DEFAULT_ASSISTANT_INSTRUCTIONS_BY_LANGUAGE,
} from "../../src/types";
import { APP_LANGUAGES, getAppLocale } from "../../src/i18n/localeRegistry";
import {
  deriveResponseModesForProvider,
  getAvailableResponseModes,
} from "../../src/utils/responseModes";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));

async function flushSettingsLoad() {
  await act(async () => {});
}

describe("useSettings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockImplementation(() =>
      Promise.resolve(null),
    );
    (AsyncStorage.setItem as jest.Mock).mockImplementation(() =>
      Promise.resolve(),
    );
    (SecureStore.getItemAsync as jest.Mock).mockImplementation(() =>
      Promise.resolve(null),
    );
    (SecureStore.setItemAsync as jest.Mock).mockImplementation(() =>
      Promise.resolve(),
    );
    (SecureStore.deleteItemAsync as jest.Mock).mockImplementation(() =>
      Promise.resolve(),
    );
  });

  it("returns default settings when nothing is stored", async () => {
    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();
    expect(result.current.settings).toEqual(DEFAULT_SETTINGS);
    expect(result.current.settings.showUsageStats).toBe(false);
    expect(result.current.settings.showDebugLogButton).toBe(false);
    expect(result.current.settings).not.toHaveProperty("introDismissed");
    expect(result.current.settings.ulraModeEnabled).toBe(true);
    expect(result.current.settings.ulraModeActive).toBe(false);
    expect(result.current.settings.ulraModeRounds).toBe(2);
  });

  it("restores portable settings without replacing API keys", async () => {
    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    await act(async () => {
      result.current.updateApiKey("openai", "keep-this-key");
    });
    const {
      apiKeys: _apiKeys,
      providerValidationResults: _providerValidationResults,
      ...portableSettings
    } = {
      ...DEFAULT_SETTINGS,
      language: "de" as const,
      theme: "dark" as const,
      ulraModeActive: true,
    };

    await act(async () => {
      result.current.restorePortableSettings(portableSettings);
    });

    expect(result.current.settings.language).toBe("de");
    expect(result.current.settings.theme).toBe("dark");
    expect(result.current.settings.ulraModeActive).toBe(false);
    expect(result.current.settings.apiKeys.openai).toBe("keep-this-key");
    expect(result.current.settings.providerValidationResults).toEqual({});
  });

  it("migrates legacy Drive Session and rejects unknown input modes", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify({
        ...DEFAULT_SETTINGS,
        inputMode: "drive-session",
      }),
    );
    const driveSettings = renderHook(() => useSettings());
    await flushSettingsLoad();
    expect(driveSettings.result.current.settings.inputMode).toBe(
      "toggle-to-talk",
    );
    driveSettings.unmount();

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify({
        ...DEFAULT_SETTINGS,
        inputMode: "unknown-mode",
      }),
    );
    const invalidSettings = renderHook(() => useSettings());
    await flushSettingsLoad();
    expect(invalidSettings.result.current.settings.inputMode).toBe(
      DEFAULT_SETTINGS.inputMode,
    );
  });

  it("sanitizes invalid persisted scalar settings and listen languages", async () => {
    const invalidStored: Record<string, unknown> = {
      ...DEFAULT_SETTINGS,
      inputMode: "unknown-input",
      replyPlayback: "unknown-playback",
      language: "unknown-language",
      theme: "unknown-theme",
      sttMode: "unknown-stt",
      sttLanguage: "unknown-speech-language",
      lastProvider: "unknown-provider",
      responseLength: "unknown-length",
      responseTone: "unknown-tone",
      spokenRepliesEnabled: "yes",
      showUsageStats: 1,
      showDebugLogButton: "true",
      ulraModeEnabled: "yes",
      ulraModeActive: "yes",
      ulraModeRounds: -1,
      ulraModeWarningAcknowledged: "yes",
      ttsListenLanguages: ["fr", "unknown-language", "fr"],
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(invalidStored),
    );

    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    expect(result.current.settings).toMatchObject({
      inputMode: DEFAULT_SETTINGS.inputMode,
      replyPlayback: DEFAULT_SETTINGS.replyPlayback,
      language: DEFAULT_SETTINGS.language,
      theme: DEFAULT_SETTINGS.theme,
      sttMode: DEFAULT_SETTINGS.sttMode,
      sttLanguage: DEFAULT_SETTINGS.sttLanguage,
      lastProvider: DEFAULT_SETTINGS.lastProvider,
      responseLength: DEFAULT_SETTINGS.responseLength,
      responseTone: DEFAULT_SETTINGS.responseTone,
      spokenRepliesEnabled: DEFAULT_SETTINGS.spokenRepliesEnabled,
      showUsageStats: DEFAULT_SETTINGS.showUsageStats,
      showDebugLogButton: DEFAULT_SETTINGS.showDebugLogButton,
      ulraModeEnabled: DEFAULT_SETTINGS.ulraModeEnabled,
      ulraModeActive: DEFAULT_SETTINGS.ulraModeActive,
      ulraModeRounds: DEFAULT_SETTINGS.ulraModeRounds,
      ulraModeWarningAcknowledged: DEFAULT_SETTINGS.ulraModeWarningAcknowledged,
      ttsListenLanguages: ["fr"],
    });
  });

  it("migrates the retired text-only toggle to an active speaking route", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify({
        ...DEFAULT_SETTINGS,
        spokenRepliesEnabled: false,
      }),
    );

    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    expect(result.current.settings.spokenRepliesEnabled).toBe(true);
  });

  it("caps legacy Council settings at five total rounds", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify({
        ...DEFAULT_SETTINGS,
        ulraModeActive: true,
        ulraModeEnabled: true,
        ulraModeRounds: 10,
        ulraModeWarningAcknowledged: true,
      }),
    );

    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    expect(result.current.settings.ulraModeActive).toBe(true);
    expect(result.current.settings.ulraModeRounds).toBe(4);
    expect(result.current.settings.ulraModeWarningAcknowledged).toBe(true);
  });

  it("preserves zero review rounds for a one-round Council", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify({
        ...DEFAULT_SETTINGS,
        ulraModeRounds: 0,
      }),
    );

    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    expect(result.current.settings.ulraModeRounds).toBe(0);
  });

  it("deactivates Model Council when the feature is disabled", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify({
        ...DEFAULT_SETTINGS,
        ulraModeActive: true,
        ulraModeEnabled: false,
      }),
    );

    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    expect(result.current.settings.ulraModeEnabled).toBe(false);
    expect(result.current.settings.ulraModeActive).toBe(false);
  });

  it("loads saved settings from AsyncStorage", async () => {
    const saved = { ...DEFAULT_SETTINGS, lastProvider: "anthropic" as const };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(saved),
    );
    (SecureStore.getItemAsync as jest.Mock).mockImplementation(
      (key: string) => {
        const values: Record<string, string | null> = {
          "mrbroccoli.provider_key.openai": "sk-openai",
          "mrbroccoli.provider_key.anthropic": "sk-anthropic",
          "mrbroccoli.provider_key.gemini": "gemini-test-key",
          "mrbroccoli.provider_key.xai": "xai-test",
        };

        return Promise.resolve(values[key] ?? null);
      },
    );
    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();
    expect(result.current.settings.lastProvider).toBe("anthropic");
    expect(result.current.settings.apiKeys).toEqual({
      ...DEFAULT_SETTINGS.apiKeys,
      openai: "sk-openai",
      anthropic: "sk-anthropic",
      gemini: "gemini-test-key",
      xai: "xai-test",
    });
    expect(result.current.settings).not.toHaveProperty("introDismissed");
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(
      "mrbroccoli.provider_key.bytedance-doubao-seed",
    );
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(
      "mrbroccoli.provider_key.moonshot-ai-kimi",
    );
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(
      "mrbroccoli.provider_key.perplexity",
    );
  });

  it("migrates active aliases and drops removed provider routes", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify({
        ...DEFAULT_SETTINGS,
        providerModels: {
          ...DEFAULT_SETTINGS.providerModels,
          openai: "gpt-5.4",
          "alibaba-qwen-dashscope": "qwen3.7-plus",
          gemini: "gemini-3.1-flash-live-preview",
          "moonshot-ai-kimi": "kimi-k2.5",
        },
        responseModes: [
          {
            id: "mode-1",
            route: {
              provider: "openai",
              model: "gpt-5.4",
              effort: "none",
            },
          },
          {
            id: "mode-2",
            route: {
              provider: "alibaba-qwen-dashscope",
              model: "qwen3.7-plus",
              effort: "enabled",
            },
          },
          {
            id: "mode-3",
            route: {
              provider: "gemini",
              model: "gemini-3.1-flash-live-preview",
            },
          },
          {
            id: "mode-4",
            route: {
              provider: "moonshot-ai-kimi",
              model: "kimi-k2.5",
              effort: "enabled",
            },
          },
        ],
      }),
    );

    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    expect(result.current.settings.providerModels.openai).toBe(
      "gpt-5.4-2026-03-05",
    );
    expect(
      result.current.settings.providerModels["alibaba-qwen-dashscope"],
    ).toBe("qwen3.7-plus-2026-05-26");
    expect(result.current.settings.providerModels.gemini).toBe(
      "gemini-2.5-flash",
    );
    expect(
      Object.prototype.hasOwnProperty.call(
        result.current.settings.providerModels,
        "moonshot-ai-kimi",
      ),
    ).toBe(false);
    expect(result.current.settings.responseModes[0]?.route.model).toBe(
      "gpt-5.4-2026-03-05",
    );
    expect(result.current.settings.responseModes[1]?.route.model).toBe(
      "qwen3.7-plus-2026-05-26",
    );
    expect(result.current.settings.responseModes[2]?.route).toEqual({
      provider: "gemini",
      model: "gemini-2.5-flash",
      effort: "dynamic",
    });
    expect(result.current.settings.responseModes).toHaveLength(3);
  });

  it("restores persisted provider validation failures", async () => {
    const errorMessage = "OpenAI rejected the stored credentials.";
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify({
        ...DEFAULT_SETTINGS,
        providerValidationResults: {
          openai: {
            status: "error",
            message: errorMessage,
            model: DEFAULT_SETTINGS.providerModels.openai,
          },
        },
      }),
    );
    (SecureStore.getItemAsync as jest.Mock).mockImplementation((key: string) =>
      Promise.resolve(
        key === "mrbroccoli.provider_key.openai" ? "invalid-key" : null,
      ),
    );

    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    expect(result.current.settings.providerValidationResults.openai).toEqual({
      llm: {
        status: "error",
        message: errorMessage,
        model: DEFAULT_SETTINGS.providerModels.openai,
      },
    });
  });

  it("migrates legacy ttsPlayback into replyPlayback", async () => {
    const legacyStored: Record<string, unknown> = { ...DEFAULT_SETTINGS };
    delete legacyStored.replyPlayback;
    legacyStored.ttsPlayback = "wait";
    delete legacyStored.providerTtsVoices;
    legacyStored.ttsVoice = "shimmer";

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(legacyStored),
    );

    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    expect(result.current.settings.replyPlayback).toBe("wait");
    expect(result.current.settings.providerTtsVoices.openai).toBe("shimmer");
    expect(result.current.settings.providerTtsVoices.gemini).toBe(
      DEFAULT_SETTINGS.providerTtsVoices.gemini,
    );
  });

  it("migrates legacy active provider state into all response modes", async () => {
    const legacyStored = {
      ...DEFAULT_SETTINGS,
      lastProvider: "anthropic" as const,
      providerModels: {
        ...DEFAULT_SETTINGS.providerModels,
        anthropic: "claude-opus-4-6",
      },
    };

    delete (legacyStored as Partial<typeof legacyStored>).responseModes;
    delete (legacyStored as Partial<typeof legacyStored>).activeResponseMode;

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(legacyStored),
    );

    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    expect(result.current.settings.responseModes).toEqual([
      {
        id: "mode-1",
        route: {
          provider: "anthropic",
          model: "claude-opus-4-6",
          effort: "high",
        },
      },
      {
        id: "mode-2",
        route: {
          provider: "anthropic",
          model: "claude-opus-4-6",
          effort: "high",
        },
      },
      {
        id: "mode-3",
        route: {
          provider: "anthropic",
          model: "claude-opus-4-6",
          effort: "high",
        },
      },
    ]);
    expect(result.current.settings.activeResponseMode).toBe("mode-1");
  });

  it("persists settings on update", async () => {
    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();
    await act(async () => {
      result.current.updateSettings({ lastProvider: "anthropic" });
    });
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "@mrbroccoli/settings",
      expect.stringContaining('"lastProvider":"anthropic"'),
    );
  });

  it("serializes rapid settings writes so the newest update wins", async () => {
    let releaseFirstWrite!: () => void;
    const firstWrite = new Promise<void>((resolve) => {
      releaseFirstWrite = resolve;
    });
    (AsyncStorage.setItem as jest.Mock)
      .mockReturnValueOnce(firstWrite)
      .mockResolvedValue(undefined);
    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    act(() => {
      result.current.updateSettings({ responseTone: "casual" });
      result.current.updateSettings({ responseTone: "concise" });
    });

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    releaseFirstWrite();
    await act(async () => {
      await firstWrite;
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(2);
    expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(
      "@mrbroccoli/settings",
      expect.stringContaining('"responseTone":"concise"'),
    );
  });

  it("persists the usage stats visibility toggle", async () => {
    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    await act(async () => {
      result.current.updateSettings({ showUsageStats: true });
    });

    expect(result.current.settings.showUsageStats).toBe(true);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "@mrbroccoli/settings",
      expect.stringContaining('"showUsageStats":true'),
    );
  });

  it("persists the debug log button visibility toggle", async () => {
    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    await act(async () => {
      result.current.updateSettings({ showDebugLogButton: true });
    });

    expect(result.current.settings.showDebugLogButton).toBe(true);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "@mrbroccoli/settings",
      expect.stringContaining('"showDebugLogButton":true'),
    );
  });

  it("persists web search mode and provider settings", async () => {
    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    await act(async () => {
      result.current.updateSettings({
        webSearchMode: "on",
        webSearchProvider: "openai",
        webSearchProviderSettings: {
          ...result.current.settings.webSearchProviderSettings,
          openai: {
            ...result.current.settings.webSearchProviderSettings.openai,
            searchMode: "deep",
          },
        },
      });
    });

    expect(result.current.settings.webSearchMode).toBe("on");
    expect(result.current.settings.webSearchProvider).toBe("openai");
    expect(
      result.current.settings.webSearchProviderSettings.openai.searchMode,
    ).toBe("deep");
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "@mrbroccoli/settings",
      expect.stringContaining('"webSearchMode":"on"'),
    );
  });

  it("migrates a stored web search mode of auto to on", async () => {
    const legacyStored: Record<string, unknown> = {
      ...DEFAULT_SETTINGS,
      webSearchMode: "auto",
    };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(legacyStored),
    );

    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    expect(result.current.settings.webSearchMode).toBe("on");
  });

  it("writes migrated settings back once without legacy fields", async () => {
    const legacyStored: Record<string, unknown> = {
      ...DEFAULT_SETTINGS,
      webSearchMode: "auto",
      webSearchEnabled: true,
      ttsPlayback: "wait",
      ttsVoice: "shimmer",
      openaiModel: "gpt-5.4",
    };
    delete legacyStored.replyPlayback;

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(legacyStored),
    );

    const firstRender = renderHook(() => useSettings());
    await flushSettingsLoad();

    expect(firstRender.result.current.settings.webSearchMode).toBe("on");
    expect(firstRender.result.current.settings.replyPlayback).toBe("wait");
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);

    const serializedSettings = (AsyncStorage.setItem as jest.Mock).mock
      .calls[0][1];
    const persistedSettings = JSON.parse(serializedSettings) as Record<
      string,
      unknown
    >;

    expect(persistedSettings.webSearchMode).toBe("on");
    expect(persistedSettings.replyPlayback).toBe("wait");
    expect(persistedSettings).not.toHaveProperty("webSearchEnabled");
    expect(persistedSettings).not.toHaveProperty("ttsPlayback");
    expect(persistedSettings).not.toHaveProperty("ttsVoice");
    expect(persistedSettings).not.toHaveProperty("openaiModel");

    firstRender.unmount();
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      serializedSettings,
    );
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

    renderHook(() => useSettings());
    await flushSettingsLoad();

    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it("migrates a stored grok voice provider id onto xai", async () => {
    const legacyStored: Record<string, unknown> = {
      ...DEFAULT_SETTINGS,
      ttsProvider: "grok",
      sttProvider: "grok",
      providerTtsVoices: {
        ...DEFAULT_SETTINGS.providerTtsVoices,
        grok: "ara",
      },
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(legacyStored),
    );
    (SecureStore.getItemAsync as jest.Mock).mockImplementation(
      (key: string) => {
        const values: Record<string, string | null> = {
          "mrbroccoli.provider_key.grok": "xai-legacy-key",
        };

        return Promise.resolve(values[key] ?? null);
      },
    );

    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    expect(result.current.settings.ttsProvider).toBe("xai");
    expect(result.current.settings.sttProvider).toBe("xai");
    expect(result.current.settings.providerTtsVoices.xai).toBe("ara");
    expect(
      (result.current.settings.providerTtsVoices as Record<string, unknown>)
        .grok,
    ).toBeUndefined();
    expect(result.current.settings.apiKeys.xai).toBe("xai-legacy-key");
  });

  it("resets stored stt/tts providers that are no longer supported and keeps key access safe", async () => {
    const stored = {
      ...DEFAULT_SETTINGS,
      ttsProvider: "playht",
      sttProvider: "azure",
      sttMode: "provider",
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(stored),
    );

    const { result } = renderHook(() => useSettings());

    await expect(flushSettingsLoad()).resolves.not.toThrow();

    const { settings } = result.current;
    expect(settings.ttsProvider).toBeNull();
    expect(settings.sttProvider).toBeNull();

    // Accessing apiKeys with the (now null) providers must be safe, mirroring
    // the render-time access in MainScreen that previously crashed.
    const ttsApiKey = settings.ttsProvider
      ? settings.apiKeys[settings.ttsProvider].trim()
      : "";
    const sttApiKey = settings.sttProvider
      ? settings.apiKeys[settings.sttProvider].trim()
      : "";
    expect(ttsApiKey).toBe("");
    expect(sttApiKey).toBe("");
  });

  it("ignores stored keys for removed search-only providers", async () => {
    const legacyStored: Record<string, unknown> = {
      ...DEFAULT_SETTINGS,
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        brave: "brave-search-key",
      },
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(legacyStored),
    );

    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    expect(result.current.settings.responseModes).not.toContainEqual(
      expect.objectContaining({
        route: expect.objectContaining({ provider: "brave" }),
      }),
    );
    expect(getAvailableResponseModes(result.current.settings)).toEqual([]);
    expect(
      (result.current.settings.apiKeys as Record<string, unknown>).brave,
    ).toBeUndefined();
  });

  it("migrates legacy webSearchEnabled into webSearchMode", async () => {
    const legacyStored: Record<string, unknown> = { ...DEFAULT_SETTINGS };
    delete legacyStored.webSearchMode;
    legacyStored.webSearchEnabled = true;
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(legacyStored),
    );

    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    expect(result.current.settings.webSearchMode).toBe("on");
  });

  it("keeps web search unselected when stored provider data is unsupported", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify({
        ...DEFAULT_SETTINGS,
        webSearchProvider: "tavily",
        webSearchProviderSettings: {
          ...DEFAULT_SETTINGS.webSearchProviderSettings,
          tavily: {
            resultLimit: 8,
            depth: "deep",
            searchMode: "balanced",
          },
        },
      }),
    );

    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    expect(result.current.settings.webSearchProvider).toBeNull();
    expect(
      Object.keys(result.current.settings.webSearchProviderSettings),
    ).toEqual([
      "openai",
      "anthropic",
      "alibaba-qwen-dashscope",
      "gemini",
      "xai",
      "mistral",
    ]);
  });

  it.each(APP_LANGUAGES)(
    "persists registered app language %s with its registry defaults",
    async (language) => {
      const { result } = renderHook(() => useSettings());
      await flushSettingsLoad();

      await act(async () => {
        result.current.updateSettings({ language });
      });

      const locale = getAppLocale(language);
      expect(result.current.settings.language).toBe(language);
      expect(result.current.settings.assistantInstructions).toBe(
        locale.defaultAssistantInstructions,
      );
      expect(result.current.settings.ttsListenLanguages).toEqual([
        locale.defaultTtsListenLanguage,
      ]);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@mrbroccoli/settings",
        expect.stringContaining(`"language":"${language}"`),
      );
    },
  );

  it("keeps recognition automatic while adopting the Arabic speech default", async () => {
    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    await act(async () => {
      result.current.updateSettings({ language: "ar" });
    });

    expect(result.current.settings.language).toBe("ar");
    expect(result.current.settings.assistantInstructions).toBe(
      DEFAULT_ASSISTANT_INSTRUCTIONS_BY_LANGUAGE.ar,
    );
    expect(result.current.settings.sttLanguage).toBe("auto");
    expect(result.current.settings.ttsListenLanguages).toEqual(["ar"]);
  });

  it("migrates the legacy Chinese speech language ID", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify({
        ...DEFAULT_SETTINGS,
        sttLanguage: "zh",
        ttsListenLanguages: ["zh"],
      }),
    );

    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    expect(result.current.settings.sttLanguage).toBe("zh-CN");
    expect(result.current.settings.ttsListenLanguages).toEqual(["zh-CN"]);
  });

  it("does not overwrite custom assistant instructions on language change", async () => {
    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    await act(async () => {
      result.current.updateSettings({
        assistantInstructions: "Always answer with one short sentence.",
      });
    });

    await act(async () => {
      result.current.updateSettings({ language: "de" });
    });

    expect(result.current.settings.language).toBe("de");
    expect(result.current.settings.assistantInstructions).toBe(
      "Always answer with one short sentence.",
    );
  });

  it("persists global TTS delivery instructions", async () => {
    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    await act(async () => {
      result.current.updateSettings({
        ttsInstructions: "Use a calm pace and pronounce numbers carefully.",
      });
    });

    expect(result.current.settings.ttsInstructions).toBe(
      "Use a calm pace and pronounce numbers carefully.",
    );
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "@mrbroccoli/settings",
      expect.stringContaining(
        '"ttsInstructions":"Use a calm pace and pronounce numbers carefully."',
      ),
    );
  });

  it("persists provider model selections", async () => {
    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    await act(async () => {
      result.current.updateProviderModel("deepseek", "deepseek-chat");
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "@mrbroccoli/settings",
      expect.stringContaining('"deepseek":"deepseek-chat"'),
    );
    expect(result.current.settings.providerModels.deepseek).toBe(
      "deepseek-chat",
    );
  });

  it("persists response mode route selections", async () => {
    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    await act(async () => {
      result.current.updateResponseModeRoute("mode-3", {
        provider: "gemini",
        model: "gemini-2.5-pro",
      });
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "@mrbroccoli/settings",
      expect.stringContaining(
        '"id":"mode-3","route":{"provider":"gemini","model":"gemini-2.5-pro","effort":"dynamic"}',
      ),
    );
    expect(result.current.settings.responseModes[2].route).toEqual({
      provider: "gemini",
      model: "gemini-2.5-pro",
      effort: "dynamic",
    });
  });

  it("persists the active response mode", async () => {
    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    await act(async () => {
      result.current.updateActiveResponseMode("mode-3");
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "@mrbroccoli/settings",
      expect.stringContaining('"activeResponseMode":"mode-3"'),
    );
    expect(result.current.settings.activeResponseMode).toBe("mode-3");
  });

  it("persists provider TTS voice selections", async () => {
    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    await act(async () => {
      result.current.updateProviderTtsVoice("gemini", "Aoede");
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "@mrbroccoli/settings",
      expect.stringContaining('"gemini":"Aoede"'),
    );
    expect(result.current.settings.providerTtsVoices.gemini).toBe("Aoede");
  });

  it("migrates a stored local TTS mode to Kokoro and drops old voice packs", async () => {
    const stored = {
      ...DEFAULT_SETTINGS,
      ttsMode: "local",
      localTtsVoices: {
        en: "af_bella",
        de: "thorsten-medium",
      },
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(stored),
    );

    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    expect(result.current.settings.ttsMode).toBe("kokoro");
    expect(
      (result.current.settings as unknown as Record<string, unknown>)
        .localTtsVoices,
    ).toBeUndefined();
  });

  it("migrates legacy settings to no implicit TTS fallbacks", async () => {
    const stored = { ...DEFAULT_SETTINGS };
    delete (stored as Partial<typeof DEFAULT_SETTINGS>).ttsFallbackPolicy;

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(stored),
    );

    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    expect(result.current.settings.ttsFallbackPolicy).toEqual({
      provider: [],
      kokoro: [],
      local: [],
    });
  });

  it("preserves explicit TTS fallback order while dropping invalid routes", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify({
        ...DEFAULT_SETTINGS,
        ttsFallbackPolicy: {
          provider: ["native", "kokoro", "native", "provider"],
          kokoro: ["provider", "native", "kokoro"],
        },
      }),
    );

    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    expect(result.current.settings.ttsFallbackPolicy).toEqual({
      provider: ["native", "kokoro"],
      kokoro: ["provider", "native"],
      local: [],
    });
  });

  it("migrates retired local response routes while preserving local speech selections", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify({
        ...DEFAULT_SETTINGS,
        activeResponseMode: "mode-1",
        responseModes: [
          {
            id: "mode-1",
            route: {
              runtime: "local",
              localModelId: "qwen3-0.6b-q8",
              provider: "openai",
              model: "stale display name",
            },
          },
        ],
        localLanguages: ["de"],
        sttMode: "local",
        localSttModelId: "whisper-tiny",
        ttsMode: "local",
        localTtsModelId: "piper-de-de-thorsten",
      }),
    );

    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    expect(result.current.settings.responseModes[0].route).toMatchObject({
      provider: "openai",
    });
    expect(result.current.settings.responseModes[0].route).not.toHaveProperty(
      "runtime",
    );
    expect(result.current.settings.responseModes[0].route).not.toHaveProperty(
      "localModelId",
    );
    expect(result.current.settings.localLanguages).toEqual(["de"]);
    expect(result.current.settings.sttMode).toBe("local");
    expect(result.current.settings.localSttModelId).toBe("whisper-tiny");
    expect(result.current.settings.ttsMode).toBe("local");
    expect(result.current.settings.localTtsModelId).toBe(
      "piper-de-de-thorsten",
    );
  });

  it("drops retired onboarding fields while preserving local speech preferences", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify({
        ...DEFAULT_SETTINGS,
        freeOnboardingLanguageInitialized: true,
        freeOfflineSetupCompleted: true,
        nativeSttRequiresOnDevice: true,
        nativeTtsVoiceId: "com.apple.voice.samantha",
        freeOfflineProfileOverrides: {
          quickLlmModelId: "qwen3-0.6b-q8",
          thoroughLlmModelId: null,
          sttModelId: null,
          ttsModelId: "piper-de-de-thorsten",
        },
      }),
    );

    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    expect(result.current.settings.nativeSttRequiresOnDevice).toBe(true);
    expect(result.current.settings.nativeTtsVoiceId).toBe(
      "com.apple.voice.samantha",
    );
    expect(result.current.settings).not.toHaveProperty(
      "freeOnboardingLanguageInitialized",
    );
    expect(result.current.settings).not.toHaveProperty(
      "freeOfflineSetupCompleted",
    );
    expect(result.current.settings).not.toHaveProperty(
      "freeOfflineProfileOverrides",
    );
  });

  it("does not retain local STT mode without a valid downloaded-model selection", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify({
        ...DEFAULT_SETTINGS,
        sttMode: "local",
        localSttModelId: "piper-de-de-thorsten",
      }),
    );

    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    expect(result.current.settings.sttMode).toBe("native");
    expect(result.current.settings.localSttModelId).toBeNull();
  });

  it("persists provider api keys in SecureStore", async () => {
    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    await act(async () => {
      result.current.updateApiKey("gemini", "gemini-live-key");
    });

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      "mrbroccoli.provider_key.gemini",
      "gemini-live-key",
    );
    expect(result.current.settings.apiKeys.gemini).toBe("gemini-live-key");
  });

  it("persists non-secret provider validation results in public settings", async () => {
    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    await act(async () => {
      result.current.updateSettings({
        providerValidationResults: {
          openai: {
            llm: {
              status: "error",
              message: "Rejected credentials",
              model: DEFAULT_SETTINGS.providerModels.openai,
            },
          },
        },
      });
    });

    expect(
      result.current.settings.providerValidationResults.openai?.llm?.status,
    ).toBe("error");
    const setItemCalls = (AsyncStorage.setItem as jest.Mock).mock.calls;
    const persisted = JSON.parse(
      setItemCalls[setItemCalls.length - 1][1],
    ) as Record<string, unknown>;
    expect(persisted.providerValidationResults).toEqual({
      openai: {
        llm: expect.objectContaining({ status: "error" }),
      },
    });
    expect(persisted.apiKeys).toBeUndefined();
  });

  it("atomically persists every provider capability result across restart", async () => {
    const firstRun = renderHook(() => useSettings());
    await flushSettingsLoad();

    act(() => {
      firstRun.result.current.updateProviderValidationResult("mistral", "llm", {
        status: "success",
        model: "mistral-large-latest",
      });
      firstRun.result.current.updateProviderValidationResult("mistral", "stt", {
        status: "success",
        model: "voxtral-mini-latest",
      });
      firstRun.result.current.updateProviderValidationResult("mistral", "tts", {
        status: "success",
        model: "voxtral-tts-latest",
      });
      firstRun.result.current.updateProviderValidationResult(
        "mistral",
        "search",
        {
          status: "success",
          model: "mistral-large-latest",
        },
      );
      firstRun.result.current.updateProviderValidationResult(
        "mistral",
        "voices",
        {
          status: "success",
          model: "voice-directory",
        },
      );
    });

    expect(
      Object.keys(
        firstRun.result.current.settings.providerValidationResults.mistral ??
          {},
      ),
    ).toEqual(["llm", "stt", "tts", "search", "voices"]);

    await waitFor(() => {
      const calls = (AsyncStorage.setItem as jest.Mock).mock.calls;
      expect(calls.length).toBeGreaterThanOrEqual(5);
      const latest = JSON.parse(
        calls[calls.length - 1][1],
      ) as typeof DEFAULT_SETTINGS;
      expect(
        Object.keys(latest.providerValidationResults.mistral ?? {}),
      ).toHaveLength(5);
    });
    const setItemCalls = (AsyncStorage.setItem as jest.Mock).mock.calls;
    const persistedJson = setItemCalls[setItemCalls.length - 1][1] as string;
    const persisted = JSON.parse(persistedJson) as typeof DEFAULT_SETTINGS;
    expect(persisted.providerValidationResults.mistral).toEqual({
      llm: expect.objectContaining({ status: "success" }),
      stt: expect.objectContaining({ status: "success" }),
      tts: expect.objectContaining({ status: "success" }),
      search: expect.objectContaining({ status: "success" }),
      voices: expect.objectContaining({ status: "success" }),
    });

    firstRun.unmount();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(persistedJson);
    (SecureStore.getItemAsync as jest.Mock).mockImplementation((key: string) =>
      Promise.resolve(
        key === "mrbroccoli.provider_key.mistral" ? "mistral-key" : null,
      ),
    );

    const restarted = renderHook(() => useSettings());
    await flushSettingsLoad();

    expect(
      restarted.result.current.settings.providerValidationResults.mistral,
    ).toEqual(persisted.providerValidationResults.mistral);
  });

  it("invalidates a failed validation when its key changes", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify({
        ...DEFAULT_SETTINGS,
        providerValidationResults: {
          openai: {
            status: "error",
            message: "Rejected credentials",
            model: DEFAULT_SETTINGS.providerModels.openai,
          },
        },
      }),
    );
    (SecureStore.getItemAsync as jest.Mock).mockImplementation((key: string) =>
      Promise.resolve(
        key === "mrbroccoli.provider_key.openai" ? "invalid-key" : null,
      ),
    );
    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    act(() => {
      result.current.updateApiKey("openai", "replacement-key");
    });

    expect(
      result.current.settings.providerValidationResults.openai,
    ).toBeUndefined();
  });

  it("invalidates a successful validation when its key changes", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify({
        ...DEFAULT_SETTINGS,
        providerValidationResults: {
          openai: {
            status: "success",
            model: DEFAULT_SETTINGS.providerModels.openai,
          },
        },
      }),
    );
    (SecureStore.getItemAsync as jest.Mock).mockImplementation((key: string) =>
      Promise.resolve(
        key === "mrbroccoli.provider_key.openai" ? "working-key" : null,
      ),
    );
    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    act(() => {
      result.current.updateApiKey("openai", "different-key");
    });

    expect(
      result.current.settings.providerValidationResults.openai,
    ).toBeUndefined();
  });

  it("exposes no usable response mode on a fresh install without keys", async () => {
    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    expect(getAvailableResponseModes(result.current.settings)).toEqual([]);
  });

  it("derives all three response modes from the first configured provider", async () => {
    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    await act(async () => {
      result.current.updateApiKey("openai", "sk-first-provider");
    });

    expect(result.current.settings.responseModes).toEqual(
      deriveResponseModesForProvider("openai"),
    );
    expect(getAvailableResponseModes(result.current.settings)).toEqual([
      "mode-1",
      "mode-2",
      "mode-3",
    ]);
  });

  it("makes the first configured search-capable provider available without enabling search", async () => {
    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    await act(async () => {
      result.current.updateApiKey("xai", "xai-search-key");
    });

    expect(result.current.settings.webSearchProvider).toBe("xai");
    expect(result.current.settings.webSearchMode).toBe("off");
  });

  it("keeps adding response modes beyond the former four-route limit", async () => {
    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();
    const initialCount = result.current.settings.responseModes.length;

    for (let index = 0; index < 6; index += 1) {
      await act(async () => {
        result.current.addResponseMode();
      });
    }

    expect(result.current.settings.responseModes).toHaveLength(
      initialCount + 6,
    );
    const finalMode = result.current.settings.responseModes.at(-1);
    expect(finalMode?.id).toBe(`mode-${initialCount + 6}`);
    expect(result.current.settings.activeResponseMode).toBe(finalMode?.id);
  });

  it("suggests a distinct configured provider when adding a response mode", async () => {
    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    await act(async () => {
      result.current.updateApiKey("deepseek", "deepseek-test-key");
    });
    await act(async () => {
      result.current.updateApiKey("openai", "openai-test-key");
    });
    await act(async () => {
      result.current.addResponseMode();
    });

    expect(result.current.settings.responseModes).toHaveLength(3);
    expect(result.current.settings.responseModes[0]?.route.provider).toBe(
      "deepseek",
    );
    expect(result.current.settings.responseModes[2]?.route.provider).toBe(
      "openai",
    );
  });

  it("removes response modes but keeps at least one", async () => {
    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    await act(async () => {
      result.current.removeResponseMode("mode-1");
    });
    await act(async () => {
      result.current.removeResponseMode("mode-2");
    });
    await act(async () => {
      result.current.removeResponseMode("mode-3");
    });

    expect(result.current.settings.responseModes).toHaveLength(1);
    expect(result.current.settings.responseModes[0].id).toBe("mode-3");
  });

  it("does not overwrite derived modes when a second provider key is added", async () => {
    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    await act(async () => {
      result.current.updateApiKey("openai", "sk-first-provider");
    });

    const derived = result.current.settings.responseModes;

    await act(async () => {
      result.current.updateApiKey("anthropic", "sk-second-provider");
    });

    expect(result.current.settings.responseModes).toEqual(derived);
    for (const mode of result.current.settings.responseModes) {
      expect(mode.route.provider).toBe("openai");
    }
  });

  it("re-derives distinct routes when a provider key is removed and restored", async () => {
    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    await act(async () => {
      result.current.updateApiKey("xai", "first-xai-key");
    });
    await act(async () => {
      result.current.updateApiKey("xai", "");
    });
    await act(async () => {
      result.current.updateApiKey("xai", "restored-xai-key");
    });

    expect(result.current.settings.responseModes).toEqual(
      deriveResponseModesForProvider("xai"),
    );
    // What matters is that restoring the key rebuilds several genuinely
    // distinct routes, not how many models xAI happens to offer today. The
    // deep equality above already pins the exact derivation.
    const models = result.current.settings.responseModes.map(
      (mode) => mode.route.model,
    );
    expect(models.length).toBeGreaterThan(1);
    expect(new Set(models).size).toBe(models.length);
  });

  it("removes provider api keys when cleared", async () => {
    const { result } = renderHook(() => useSettings());
    await flushSettingsLoad();

    await act(async () => {
      result.current.updateApiKey("deepseek", "");
    });

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(
      "mrbroccoli.provider_key.deepseek",
    );
  });
});
