import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";

import {
  buildLiveProviderMatrix,
  getLiveProviderMatrixReservedUsd,
  LIVE_PROVIDER_ENV_KEYS,
  type LiveProviderMatrixStep,
} from "../../scripts/live-provider-matrix-plan";
import {
  buildLlmFallbackUsage,
  createLiveProviderCostTracker,
  DEFAULT_LIVE_PROVIDER_COST_REPORT_DIR,
  getWavDurationSeconds,
  type SanitizedProviderUsage,
} from "../../scripts/live-provider-cost-report";
import {
  DEFAULT_WEB_SEARCH_PROVIDER_SETTINGS,
  getWebSearchProviderModel,
} from "../../src/constants/webSearch";
import { RUNTIME_PROVIDER_MANIFEST } from "../../src/constants/providers/runtimeManifest";
import { STT_VALIDATION_AUDIO_BASE64 } from "../../src/services/sttValidationAudio";
import { generateInternalChat } from "../../src/services/llm";
import { fetchProviderVoices } from "../../src/services/providerVoiceDirectory";
import {
  resetProviderModelHealthForTests,
} from "../../src/services/providerResilience";
import {
  clearRuntimeCapabilityOverrides,
  resetRuntimeCapabilityOverridesForTests,
} from "../../src/services/runtimeCapabilityOverrides";
import { synthesizeProviderSpeech } from "../../src/services/tts/providerRoute";
import { searchWeb } from "../../src/services/webSearch";
import { transcribeAudio } from "../../src/services/whisper";
import type { Provider } from "../../src/types";
import { formatQwenApiCredential } from "../../src/utils/qwenRegion";

const mockFileContents = new Map<string, Uint8Array>();

jest.mock("expo/fetch", () => ({
  fetch: (...args: Parameters<typeof fetch>) => globalThis.fetch(...args),
}));

jest.mock("expo-file-system/legacy", () => ({
  cacheDirectory: "file:///cache/",
  documentDirectory: "file:///documents/",
  EncodingType: { Base64: "base64", UTF8: "utf8" },
  deleteAsync: jest.fn(async (uri: string) => {
    mockFileContents.delete(uri);
  }),
  getInfoAsync: jest.fn(async (uri: string) => {
    const bytes = mockFileContents.get(uri);
    return {
      exists: Boolean(bytes),
      isDirectory: false,
      size: bytes?.byteLength ?? 0,
    };
  }),
  makeDirectoryAsync: jest.fn(async () => undefined),
  readAsStringAsync: jest.fn(
    async (uri: string, options?: { encoding?: string }) => {
      const bytes = mockFileContents.get(uri) ?? new Uint8Array();
      return options?.encoding === "base64"
        ? Buffer.from(bytes).toString("base64")
        : Buffer.from(bytes).toString("utf8");
    },
  ),
  writeAsStringAsync: jest.fn(
    async (
      uri: string,
      value: string,
      options?: { encoding?: string },
    ) => {
      mockFileContents.set(
        uri,
        new Uint8Array(
          Buffer.from(value, options?.encoding === "base64" ? "base64" : "utf8"),
        ),
      );
    },
  ),
}));

jest.mock("expo-file-system", () => ({
  File: class MockLiveProviderFile extends Blob {
    readonly name: string;
    readonly uri: string;

    constructor(uri: string) {
      const type = uri.endsWith(".wav") ? "audio/wav" : "audio/m4a";
      super([mockFileContents.get(uri) ?? new Uint8Array()], { type });
      this.uri = uri;
      this.name = uri.split("/").pop() || "recording.m4a";
    }
  },
}));

const liveTest =
  process.env.MR_BROCCOLI_RUN_LIVE_PROVIDER_MATRIX === "1" ? it : it.skip;

const STEP_TIMEOUT_MS: Record<LiveProviderMatrixStep["kind"], number> = {
  llm: 120_000,
  stt: 90_000,
  tts: 150_000,
  "web-search": 120_000,
  "voice-directory": 60_000,
};

class NodeFileReader {
  result: string | ArrayBuffer | null = null;
  onerror: ((event: unknown) => void) | null = null;
  onloadend: ((event: unknown) => void) | null = null;

  readAsDataURL(blob: Blob) {
    void blob
      .arrayBuffer()
      .then((buffer) => {
        this.result = `data:${blob.type || "application/octet-stream"};base64,${Buffer.from(buffer).toString("base64")}`;
        this.onloadend?.({});
      })
      .catch((error) => {
        this.onerror?.(error);
      });
  }
}

function getCredential(provider: Provider) {
  const envKey = LIVE_PROVIDER_ENV_KEYS[provider];
  const apiKey = process.env[envKey]?.trim() ?? "";

  if (provider !== "alibaba-qwen-dashscope") {
    return apiKey;
  }

  const region = process.env.MR_BROCCOLI_QWEN_REGION;
  return formatQwenApiCredential(
    apiKey,
    region === "beijing" ? "beijing" : "singapore",
  );
}

function getSafeErrorMessage(error: unknown) {
  let message = error instanceof Error ? error.message : String(error);

  for (const envKey of Object.values(LIVE_PROVIDER_ENV_KEYS)) {
    const value = process.env[envKey]?.trim();

    if (value) {
      message = message.split(value).join("[redacted]");
    }
  }

  return message;
}

async function runStepWithTimeout(
  step: LiveProviderMatrixStep,
  operation: (abortSignal: AbortSignal) => Promise<void>,
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort(new Error(`${step.id} exceeded its release-test timeout`));
  }, STEP_TIMEOUT_MS[step.kind]);

  try {
    await operation(controller.signal);
  } catch (error) {
    throw new Error(`${step.id} failed: ${getSafeErrorMessage(error)}`);
  } finally {
    clearTimeout(timeoutId);
  }
}

liveTest(
  "validates every retained provider, model, effort, speech route, and search route",
  async () => {
    const steps = buildLiveProviderMatrix();
    const reservedUsd = getLiveProviderMatrixReservedUsd(steps);
    const maxUsd = Number(
      process.env.MR_BROCCOLI_PRERELEASE_MAX_USD,
    );

    if (!Number.isFinite(maxUsd) || maxUsd <= 0) {
      throw new Error(
        "MR_BROCCOLI_PRERELEASE_MAX_USD must be a positive number",
      );
    }

    if (reservedUsd > maxUsd) {
      throw new Error(
        `The live provider matrix reserves USD ${reservedUsd.toFixed(4)}, exceeding the configured USD ${maxUsd.toFixed(2)} ceiling`,
      );
    }

    await AsyncStorage.clear();
    resetProviderModelHealthForTests();
    resetRuntimeCapabilityOverridesForTests();
    await clearRuntimeCapabilityOverrides();
    mockFileContents.clear();

    const costTracker = createLiveProviderCostTracker(steps);
    const sttFixtureSeconds = getWavDurationSeconds(
      STT_VALIDATION_AUDIO_BASE64,
    );
    let activeStep: LiveProviderMatrixStep | null = null;
    const originalFileReader = (globalThis as typeof globalThis & {
      FileReader?: unknown;
    }).FileReader;
    const originalFetch = globalThis.fetch;
    const originalWebSocket = globalThis.WebSocket;
    const Ws = require("ws");
    const captureResponse = async (response: Response) => {
      if (!activeStep) {
        return;
      }

      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      let payload: unknown = null;

      try {
        payload = await response.clone().json();
      } catch {
        // Binary speech responses still contribute sanitized billing headers
        // and deterministic release-fixture units.
      }

      costTracker.recordProviderResponse(activeStep, payload, headers);
    };
    const meteredFetch: typeof globalThis.fetch = async (...args) => {
      const response = await originalFetch(...args);
      await captureResponse(response);
      return response;
    };
    class MeteredWebSocket extends Ws {
      constructor(url: string, protocols?: unknown, options?: unknown) {
        super(url, protocols, options);
        this.on("message", (data: unknown) => {
          if (!activeStep) {
            return;
          }

          try {
            const text =
              typeof data === "string"
                ? data
                : Buffer.isBuffer(data)
                  ? data.toString("utf8")
                  : "";
            if (text) {
              costTracker.recordProviderResponse(
                activeStep,
                JSON.parse(text),
              );
            }
          } catch {
            // Realtime content and transport events are never written to the
            // report; only recognized numeric usage metadata is retained.
          }
        });
      }
    }
    Object.defineProperty(globalThis, "FileReader", {
      configurable: true,
      value: NodeFileReader,
    });
    Object.defineProperty(globalThis, "fetch", {
      configurable: true,
      value: meteredFetch,
    });
    Object.defineProperty(globalThis, "WebSocket", {
      configurable: true,
      value: MeteredWebSocket,
    });

    const directoryVoices = new Map<Provider, string>();
    process.stdout.write(
      `[live-provider] ${steps.length} checks reserve USD ${reservedUsd.toFixed(4)} of USD ${maxUsd.toFixed(2)}.\n`,
    );

    try {
      for (const [index, step] of steps.entries()) {
        process.stdout.write(
          `[live-provider] ${index + 1}/${steps.length} ${step.id}\n`,
        );
        let fallbackUsage: SanitizedProviderUsage = {};
        activeStep = step;
        costTracker.startStep(step);

        try {
          await runStepWithTimeout(step, async (abortSignal) => {
            const apiKey = getCredential(step.provider as Provider);

            switch (step.kind) {
              case "llm": {
                const result = await generateInternalChat({
                  abortSignal,
                  apiKey,
                  language: "en",
                  messages: [{ role: "user", content: "Reply only: OK" }],
                  model: step.model,
                  ...(step.effort ? { modelEffort: step.effort } : {}),
                  provider: step.provider,
                  systemPrompt: "Return exactly the two letters OK.",
                });

                if (result.model !== step.model) {
                  throw new Error(
                    `requested ${step.model} but resolved ${result.model}`,
                  );
                }

                if (step.effort && result.modelEffort !== step.effort) {
                  throw new Error(
                    `requested effort ${step.effort} but resolved ${result.modelEffort ?? "none"}`,
                  );
                }
                fallbackUsage = buildLlmFallbackUsage(result.usage);
                return;
              }
              case "stt": {
                const audioPath = `file:///cache/live-provider-${encodeURIComponent(step.id)}.wav`;
                await FileSystem.writeAsStringAsync(
                  audioPath,
                  STT_VALIDATION_AUDIO_BASE64,
                  { encoding: FileSystem.EncodingType.Base64 },
                );
                let actualModel = "";

                try {
                  await transcribeAudio({
                    abortSignal,
                    apiKey,
                    fileUri: audioPath,
                    language: "en",
                    mode: "provider",
                    onModelResolved: (model) => {
                      actualModel = model;
                    },
                    provider: step.provider,
                    providerModel: step.model,
                    speechLanguage: "en",
                  });
                } finally {
                  await FileSystem.deleteAsync(audioPath, { idempotent: true });
                }

                if (actualModel !== step.model) {
                  throw new Error(
                    `requested ${step.model} but resolved ${actualModel || "none"}`,
                  );
                }
                fallbackUsage = {
                  audioInputSeconds: sttFixtureSeconds,
                  unitSource: "release-fixture",
                };
                return;
              }
              case "voice-directory": {
                const voices = await fetchProviderVoices({
                  apiKey,
                  provider: step.provider,
                  signal: abortSignal,
                });
                const firstVoice = voices[0]?.value;

                if (!firstVoice) {
                  throw new Error("provider returned no usable voices");
                }

                directoryVoices.set(step.provider, firstVoice);
                return;
              }
              case "tts": {
                const voice =
                  step.voice ?? directoryVoices.get(step.provider) ?? "";
                const requiresVoice =
                  RUNTIME_PROVIDER_MANIFEST[step.provider].tts.requiresVoice;

                if (requiresVoice && !voice) {
                  throw new Error("no compatible validation voice is available");
                }

                let actualModel = "";
                const audioPath = await synthesizeProviderSpeech({
                  abortSignal,
                  apiKey,
                  language: "en",
                  onModelResolved: (model) => {
                    actualModel = model;
                  },
                  provider: step.provider,
                  providerModel: step.model,
                  speechLanguage: "en",
                  text: "OK",
                  voice,
                });
                await FileSystem.deleteAsync(audioPath, { idempotent: true });

                if (actualModel !== step.model) {
                  throw new Error(
                    `requested ${step.model} but resolved ${actualModel || "none"}`,
                  );
                }
                fallbackUsage = {
                  inputCharacters: 2,
                  inputTokens: 1,
                  tokenSource: "local-estimate",
                  unitSource: "release-fixture",
                };
                return;
              }
              case "web-search": {
                const model = getWebSearchProviderModel(step.provider);
                const result = await searchWeb({
                  abortSignal,
                  apiKey,
                  language: "en",
                  maxOutputTokens: 120,
                  model,
                  options: {
                    ...DEFAULT_WEB_SEARCH_PROVIDER_SETTINGS[step.provider],
                    searchMode: step.searchMode,
                  },
                  provider: step.provider,
                  query:
                    "What is the current UTC time? Reply in one short sentence.",
                });

                if (!result || result.model !== model) {
                  throw new Error(
                    `requested ${model} but resolved ${result?.model ?? "none"}`,
                  );
                }
                fallbackUsage = {
                  searchRequests: 1,
                  unitSource: "release-fixture",
                };
              }
            }
          });
          costTracker.finishStep(step, {
            passed: true,
            fallbackUsage,
          });
        } catch (error) {
          costTracker.finishStep(step, {
            passed: false,
            fallbackUsage,
          });
          throw error;
        } finally {
          activeStep = null;
        }
      }
    } finally {
      Object.defineProperty(globalThis, "FileReader", {
        configurable: true,
        value: originalFileReader,
      });
      Object.defineProperty(globalThis, "fetch", {
        configurable: true,
        value: originalFetch,
      });
      Object.defineProperty(globalThis, "WebSocket", {
        configurable: true,
        value: originalWebSocket,
      });
      const outputDirectory =
        process.env.MR_BROCCOLI_LIVE_COST_REPORT_DIR ??
        DEFAULT_LIVE_PROVIDER_COST_REPORT_DIR;
      const { report, jsonPath, markdownPath } =
        costTracker.writeReports(outputDirectory);
      process.stdout.write(
        `[live-provider] cost report accounts for USD ${report.summary.accountedUsd.toFixed(6)} with an attempted-step upper bound of USD ${report.summary.upperBoundUsd.toFixed(6)} (${report.summary.fullyAccountedSteps}/${report.summary.attemptedSteps} steps fully accounted).\n`,
      );
      process.stdout.write(
        `[live-provider] cost artifacts: ${jsonPath} and ${markdownPath}\n`,
      );
    }

    process.stdout.write(
      `[live-provider] completed all ${steps.length} checks.\n`,
    );
  },
  90 * 60_000,
);
