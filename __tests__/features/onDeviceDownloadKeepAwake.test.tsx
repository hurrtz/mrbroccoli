import React from "react";
import { fireEvent, waitFor } from "@testing-library/react-native";

/**
 * The wake lock used to live on the Free setup wizard. Removing the wizard
 * moved downloading into the stage pages and silently left the lock behind,
 * so a sleeping phone aborted multi-gigabyte downloads again. These tests pin
 * the lock to the shared lifecycle controller those pages mount.
 */

const mockBeginDownload = jest.fn(() => Promise.resolve(true));
const mockEndDownload = jest.fn(() => Promise.resolve(true));

const mockActivateKeepAwake = jest.fn(() => Promise.resolve());
const mockDeactivateKeepAwake = jest.fn(() => Promise.resolve());
const mockGetLocalCatalogInstallStatuses = jest.fn(
  (_options?: { phonemeLanguages?: string[] }) => Promise.resolve({}),
);
const mockGetLocalModelBenchmarkResults = jest.fn(() => Promise.resolve({}));
const mockSelectOfflineProfile = jest.fn((_params?: unknown) => ({
  status: "unavailable",
}));
const mockGetAppliedOfflineProfileSettingsUpdate = jest.fn(
  (_settings?: unknown, _profile?: unknown, _overrides?: unknown) => ({}),
);
const mockEvaluateOfflineProfileReadiness = jest.fn((_params?: unknown) => ({
  ready: false,
}));

jest.mock("expo-keep-awake", () => ({
  activateKeepAwakeAsync: (...args: unknown[]) =>
    mockActivateKeepAwake(...(args as [])),
  deactivateKeepAwake: (...args: unknown[]) =>
    mockDeactivateKeepAwake(...(args as [])),
}));

let mockResolveDownload: (() => void) | undefined;
let mockDownloadSignal: AbortSignal | undefined;
const mockDownloadLocalModel = jest.fn(
  (_modelId: string, options?: { abortSignal?: AbortSignal }) => {
    mockDownloadSignal = options?.abortSignal;
    return new Promise<string>((resolve, reject) => {
      mockResolveDownload = () => resolve("/models/local");
      options?.abortSignal?.addEventListener("abort", () => {
        const error = new Error("Download aborted");
        error.name = "AbortError";
        reject(error);
      });
    });
  },
);

jest.mock("../../src/services/localModelManager", () => ({
  downloadLocalModel: (...args: unknown[]) =>
    mockDownloadLocalModel(
      ...(args as [string, { abortSignal?: AbortSignal }?]),
    ),
  removeLocalModel: jest.fn(() => Promise.resolve()),
}));

jest.mock("../../src/services/localDeviceCapabilities", () => ({
  evaluateLocalModelEligibility: jest.fn(() => ({
    eligible: true,
    reason: null,
  })),
  getLocalModelBenchmarkResults: () => mockGetLocalModelBenchmarkResults(),
  probeLocalDeviceCapabilities: jest.fn(() =>
    Promise.resolve({
      platform: "android",
      architecture: "arm64",
      osVersion: "15",
      physicalMemoryBytes: 8 * 1024 ** 3,
      availableStorageBytes: 20 * 1024 ** 3,
      thermalState: "nominal",
      lowPowerMode: false,
    }),
  ),
}));

jest.mock("../../src/services/offlineProfileManager", () => ({
  evaluateOfflineProfileReadiness: (params: unknown) =>
    mockEvaluateOfflineProfileReadiness(params),
  getLocalCatalogInstallStatuses: (options?: { phonemeLanguages?: string[] }) =>
    mockGetLocalCatalogInstallStatuses(options),
}));

jest.mock("../../src/services/offlineProfile", () => ({
  getAppliedOfflineProfileSettingsUpdate: (
    settings: unknown,
    profile: unknown,
    overrides?: unknown,
  ) =>
    mockGetAppliedOfflineProfileSettingsUpdate(settings, profile, overrides),
  selectOfflineProfile: (params: unknown) => mockSelectOfflineProfile(params),
}));

jest.mock("../../src/services/nativeSpeechCapabilities", () => ({
  probeNativeSpeechCapabilities: jest.fn(() =>
    Promise.resolve({
      recognitionAvailable: true,
      onDeviceRecognitionAvailable: true,
      targetLocaleInstalled: true,
      nativeSttEligible: true,
    }),
  ),
}));

jest.mock("../../src/services/localLlm", () => ({
  benchmarkLocalLlm: jest.fn(() => Promise.resolve({ status: "viable" })),
}));

jest.mock("../../src/services/localSpeechModels", () => ({
  getLocalTtsBenchmarkText: jest.requireActual(
    "../../src/services/localSpeechModels",
  ).getLocalTtsBenchmarkText,
  benchmarkLocalStt: jest.fn(() => Promise.resolve({ status: "viable" })),
  benchmarkLocalTts: jest.fn(() => Promise.resolve({ status: "viable" })),
}));

jest.mock("../../src/services/kokoroTts", () => ({
  benchmarkKokoroModel: jest.fn(() => Promise.resolve({ status: "viable" })),
}));

// Not under test here, and it needs a fuller device snapshot than this suite
// builds.
jest.mock("../../src/components/LocalModelPerformanceSummary", () => ({
  LocalModelPerformanceSummary: () => null,
}));

jest.mock("../../src/features/settings-core/useNativeVoiceOptions", () => ({
  useNativeVoiceOptions: () => ({
    nativeVoiceOptions: [],
    selectedNativeVoice: null,
    setSelectedNativeVoice: jest.fn(),
  }),
}));

import { LOCAL_MODEL_CATALOG } from "../../src/constants/localModels";
import { DEFAULT_SETTINGS } from "../../src/types";
import { renderWithProviders } from "../test-utils/renderWithProviders";
import { NativeModules, Platform, Pressable, View } from "react-native";
import { useLocalModelSettings } from "../../src/features/settings-core/useLocalModelSettings";
import { LocalModelAction } from "../../src/features/settings/settings-primitives/LocalModelRouteGroup";

// The hook reads the module and the platform at call time, so installing the
// stub here is enough and avoids mocking the bridge itself.
(NativeModules as unknown as Record<string, unknown>).MrBroccoliModelDownload =
  {
    beginDownload: (...args: unknown[]) => mockBeginDownload(...(args as [])),
    endDownload: (...args: unknown[]) => mockEndDownload(...(args as [])),
  };
Object.defineProperty(Platform, "OS", { configurable: true, value: "android" });

const kokoroModel = {
  installed: false,
  verified: false,
  busy: null,
  phase: null,
  progress: 0,
  error: null,
  download: jest.fn(() => Promise.resolve(true)),
  remove: jest.fn(() => Promise.resolve(true)),
  refresh: jest.fn(() => Promise.resolve()),
} as never;

function renderPage(params?: {
  modelId?: (typeof LOCAL_MODEL_CATALOG)[number]["id"];
  onPreviewVoice?: jest.Mock;
  onUpdate?: jest.Mock;
  settings?: typeof DEFAULT_SETTINGS;
}) {
  const model = LOCAL_MODEL_CATALOG.find(
    (candidate) => candidate.id === (params?.modelId ?? "qwen3-0.6b-q8"),
  );
  if (!model) {
    throw new Error("Missing local-model test fixture.");
  }
  function LifecycleHarness() {
    const localModels = useLocalModelSettings({
      active: true,
      isPremium: false,
      kokoroModel,
      onPreviewVoice:
        params?.onPreviewVoice ?? jest.fn(() => Promise.resolve()),
      onUpdate: params?.onUpdate ?? jest.fn(),
      settings: params?.settings ?? DEFAULT_SETTINGS,
    });
    return (
      <View>
        <LocalModelAction localModels={localModels} model={model} />
        <Pressable
          testID="select-local-model"
          onPress={() => localModels.selectModel(model)}
        />
      </View>
    );
  }
  return renderWithProviders(<LifecycleHarness />);
}

async function getLlmDownloadButton(
  screen: ReturnType<typeof renderPage>,
  modelId: string,
) {
  return waitFor(() => screen.getByTestId(`local-model-download-${modelId}`));
}

beforeEach(() => {
  jest.clearAllMocks();
  mockResolveDownload = undefined;
  mockDownloadSignal = undefined;
  mockGetLocalCatalogInstallStatuses.mockResolvedValue({});
  mockGetLocalModelBenchmarkResults.mockResolvedValue({});
  mockSelectOfflineProfile.mockReturnValue({ status: "unavailable" });
  mockEvaluateOfflineProfileReadiness.mockReturnValue({ ready: false });
  mockGetAppliedOfflineProfileSettingsUpdate.mockReturnValue({});
});

describe("on-device model downloads", () => {
  it("offers acquisition through the stage-owned lifecycle action", async () => {
    const firstLlm = LOCAL_MODEL_CATALOG.find(
      (model) => model.capability === "llm",
    );
    expect(firstLlm).toBeTruthy();

    const screen = renderPage();
    const downloadButton = await getLlmDownloadButton(screen, firstLlm!.id);
    expect(downloadButton).toBeTruthy();
  });

  it("holds the wake lock for as long as a download runs", async () => {
    const firstLlm = LOCAL_MODEL_CATALOG.find(
      (model) => model.capability === "llm",
    );
    expect(firstLlm).toBeTruthy();

    const screen = renderPage();
    const downloadButton = await getLlmDownloadButton(screen, firstLlm!.id);

    expect(mockActivateKeepAwake).not.toHaveBeenCalled();

    fireEvent.press(downloadButton);

    await waitFor(() => expect(mockDownloadLocalModel).toHaveBeenCalled());
    await waitFor(() =>
      expect(mockActivateKeepAwake).toHaveBeenCalledWith(
        "mrbroccoli-on-device-models",
      ),
    );
    // Still held while the transfer is in flight.
    expect(mockDeactivateKeepAwake).not.toHaveBeenCalled();

    mockResolveDownload?.();

    await waitFor(() =>
      expect(mockDeactivateKeepAwake).toHaveBeenCalledWith(
        "mrbroccoli-on-device-models",
      ),
    );
  });

  it("runs the transfer under a foreground service so leaving the app cannot kill it", async () => {
    // A wake lock only answers a sleeping screen while the app is in front.
    // Switching away killed the transfer instantly.
    const firstLlm = LOCAL_MODEL_CATALOG.find(
      (model) => model.capability === "llm",
    );
    const screen = renderPage();
    const downloadButton = await getLlmDownloadButton(screen, firstLlm!.id);

    fireEvent.press(downloadButton);

    await waitFor(() => expect(mockBeginDownload).toHaveBeenCalled());
    expect(mockEndDownload).not.toHaveBeenCalled();

    mockResolveDownload?.();

    await waitFor(() => expect(mockEndDownload).toHaveBeenCalled());
  });

  it("turns the running download into a way out of it", async () => {
    // A multi-gigabyte transfer with no way to stop it is its own trap, and
    // the service has accepted an abort signal all along.
    const firstLlm = LOCAL_MODEL_CATALOG.find(
      (model) => model.capability === "llm",
    );
    const screen = renderPage();
    const downloadButton = await getLlmDownloadButton(screen, firstLlm!.id);

    fireEvent.press(downloadButton);

    const cancelButton = await waitFor(() =>
      screen.getByTestId(`local-model-cancel-${firstLlm?.id}`),
    );
    expect(mockDownloadSignal?.aborted).toBe(false);

    fireEvent.press(cancelButton);

    expect(mockDownloadSignal?.aborted).toBe(true);
    // Back to an offer to download, and no failure alert for a choice the
    // user made deliberately.
    await waitFor(() =>
      expect(
        screen.getByTestId(`local-model-download-${firstLlm?.id}`),
      ).toBeTruthy(),
    );
    await waitFor(() =>
      expect(mockDeactivateKeepAwake).toHaveBeenCalledWith(
        "mrbroccoli-on-device-models",
      ),
    );
  });

  it("replays a tested Piper voice in its selected language", async () => {
    // Piper's Russian voices accept Russian phonemes only. A former English
    // post-benchmark preview made an otherwise successful test report a
    // native TTS failure.
    const onPreviewVoice = jest.fn(() => Promise.resolve());
    mockGetLocalCatalogInstallStatuses.mockResolvedValue({
      "piper-ru-ru-dmitri": {
        installed: true,
        path: "/models/piper-ru-ru-dmitri",
        verified: true,
      },
    });
    const screen = renderPage({
      modelId: "piper-ru-ru-dmitri",
      onPreviewVoice,
      settings: { ...DEFAULT_SETTINGS, localLanguages: ["ru"] },
    });

    const testButton = await waitFor(() =>
      screen.getByTestId("local-model-test-piper-ru-ru-dmitri"),
    );

    fireEvent.press(testButton);

    await waitFor(() =>
      expect(onPreviewVoice).toHaveBeenCalledWith({
        mode: "local",
        modelId: "piper-ru-ru-dmitri",
        previewLanguage: "ru",
        text: "Привет от Mr Broccoli.",
      }),
    );
  });

  it("persists a Free local selection only through a complete ready profile", async () => {
    const onUpdate = jest.fn();
    const llm = LOCAL_MODEL_CATALOG.find(
      (model) => model.id === "qwen3-0.6b-q8",
    )!;
    const stt = LOCAL_MODEL_CATALOG.find(
      (model) => model.id === "whisper-tiny",
    )!;
    const profile = {
      languages: ["en"],
      llm,
      thoroughLlm: null,
      stt,
      tts: null,
    };
    mockGetLocalCatalogInstallStatuses.mockResolvedValue({
      [llm.id]: { installed: true, path: "/models/llm", verified: true },
      [stt.id]: { installed: true, path: "/models/stt", verified: true },
    });
    mockGetLocalModelBenchmarkResults.mockResolvedValue({
      [llm.id]: { status: "viable" },
      [stt.id]: { status: "viable" },
    });
    (mockSelectOfflineProfile as jest.Mock).mockReturnValue({
      status: "ready",
      profile,
    });
    mockEvaluateOfflineProfileReadiness.mockReturnValue({ ready: true });
    (mockGetAppliedOfflineProfileSettingsUpdate as jest.Mock).mockReturnValue({
      activeResponseMode: "free-offline",
      freeOfflineSetupCompleted: true,
      responseModes: [
        {
          id: "free-offline",
          route: {
            runtime: "local",
            localModelId: llm.id,
            provider: "openai",
            model: llm.name,
          },
        },
      ],
    });

    const screen = renderPage({ modelId: llm.id, onUpdate });
    await waitFor(() =>
      expect(mockGetLocalCatalogInstallStatuses).toHaveBeenCalled(),
    );
    fireEvent.press(screen.getByTestId("select-local-model"));

    expect(mockGetAppliedOfflineProfileSettingsUpdate).toHaveBeenCalledWith(
      DEFAULT_SETTINGS,
      profile,
      { quickLlmModelId: llm.id },
    );
    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        activeResponseMode: "free-offline",
        freeOfflineSetupCompleted: true,
      }),
    );
  });
});
