import React from "react";
import { fireEvent, waitFor } from "@testing-library/react-native";

/**
 * Speech-model downloads keep the phone awake and continue through the native
 * foreground service while their Settings pages are mounted.
 */

const mockBeginDownload = jest.fn(() => Promise.resolve(true));
const mockEndDownload = jest.fn(() => Promise.resolve(true));

const mockActivateKeepAwake = jest.fn(() => Promise.resolve());
const mockDeactivateKeepAwake = jest.fn(() => Promise.resolve());
const mockGetLocalCatalogInstallStatuses = jest.fn(
  (_options?: { phonemeLanguages?: string[] }) => Promise.resolve({}),
);
const mockGetLocalModelBenchmarkResults = jest.fn(() => Promise.resolve({}));

jest.mock("expo-keep-awake", () => ({
  activateKeepAwakeAsync: (...args: unknown[]) =>
    mockActivateKeepAwake(...(args as [])),
  deactivateKeepAwake: (...args: unknown[]) =>
    mockDeactivateKeepAwake(...(args as [])),
}));

let mockResolveDownload: (() => void) | undefined;
let mockRejectDownload: ((error: Error) => void) | undefined;
let mockDownloadSignal: AbortSignal | undefined;
const mockDownloadLocalModel = jest.fn(
  (_modelId: string, options?: { abortSignal?: AbortSignal }) => {
    mockDownloadSignal = options?.abortSignal;
    return new Promise<string>((resolve, reject) => {
      mockResolveDownload = () => resolve("/models/local");
      mockRejectDownload = reject;
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

jest.mock("../../src/services/localSpeechModelManager", () => ({
  getLocalCatalogInstallStatuses: (options?: { phonemeLanguages?: string[] }) =>
    mockGetLocalCatalogInstallStatuses(options),
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
import { NativeModules, Platform, Pressable, Text, View } from "react-native";
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
    (candidate) => candidate.id === (params?.modelId ?? "whisper-tiny"),
  );
  if (!model) {
    throw new Error("Missing local-model test fixture.");
  }
  function LifecycleHarness() {
    const localModels = useLocalModelSettings({
      active: true,
      kokoroModel,
      onPreviewVoice:
        params?.onPreviewVoice ?? jest.fn(() => Promise.resolve()),
      onUpdate: params?.onUpdate ?? jest.fn(),
      settings: params?.settings ?? DEFAULT_SETTINGS,
    });
    return (
      <View>
        <LocalModelAction localModels={localModels} model={model} />
        <Text testID="local-model-error">
          {localModels.errors[model.id]?.message ?? ""}
        </Text>
        <Pressable
          testID="select-local-model"
          onPress={() => localModels.selectModel(model)}
        />
      </View>
    );
  }
  return renderWithProviders(<LifecycleHarness />);
}

async function getDownloadButton(
  screen: ReturnType<typeof renderPage>,
  modelId: string,
) {
  return waitFor(() => screen.getByTestId(`local-model-download-${modelId}`));
}

beforeEach(() => {
  jest.clearAllMocks();
  mockResolveDownload = undefined;
  mockRejectDownload = undefined;
  mockDownloadSignal = undefined;
  mockGetLocalCatalogInstallStatuses.mockResolvedValue({});
  mockGetLocalModelBenchmarkResults.mockResolvedValue({});
});

describe("on-device model downloads", () => {
  it("offers acquisition through the stage-owned lifecycle action", async () => {
    const firstSpeechModel = LOCAL_MODEL_CATALOG.find(
      (model) => model.capability === "stt",
    );
    expect(firstSpeechModel).toBeTruthy();

    const screen = renderPage();
    const downloadButton = await getDownloadButton(
      screen,
      firstSpeechModel!.id,
    );
    expect(downloadButton).toBeTruthy();
  });

  it("holds the wake lock for as long as a download runs", async () => {
    const firstSpeechModel = LOCAL_MODEL_CATALOG.find(
      (model) => model.capability === "stt",
    );
    expect(firstSpeechModel).toBeTruthy();

    const screen = renderPage();
    const downloadButton = await getDownloadButton(
      screen,
      firstSpeechModel!.id,
    );

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
    const firstSpeechModel = LOCAL_MODEL_CATALOG.find(
      (model) => model.capability === "stt",
    );
    const screen = renderPage();
    const downloadButton = await getDownloadButton(
      screen,
      firstSpeechModel!.id,
    );

    fireEvent.press(downloadButton);

    await waitFor(() => expect(mockBeginDownload).toHaveBeenCalled());
    expect(mockEndDownload).not.toHaveBeenCalled();

    mockResolveDownload?.();

    await waitFor(() => expect(mockEndDownload).toHaveBeenCalled());
  });

  it("turns the running download into a way out of it", async () => {
    // A multi-gigabyte transfer with no way to stop it is its own trap, and
    // the service has accepted an abort signal all along.
    const firstSpeechModel = LOCAL_MODEL_CATALOG.find(
      (model) => model.capability === "stt",
    );
    const screen = renderPage();
    const downloadButton = await getDownloadButton(
      screen,
      firstSpeechModel!.id,
    );

    fireEvent.press(downloadButton);

    const cancelButton = await waitFor(() =>
      screen.getByTestId(`local-model-cancel-${firstSpeechModel?.id}`),
    );
    expect(mockDownloadSignal?.aborted).toBe(false);

    fireEvent.press(cancelButton);

    expect(mockDownloadSignal?.aborted).toBe(true);
    // Back to an offer to download, and no failure alert for a choice the
    // user made deliberately.
    await waitFor(() =>
      expect(
        screen.getByTestId(`local-model-download-${firstSpeechModel?.id}`),
      ).toBeTruthy(),
    );
    await waitFor(() =>
      expect(mockDeactivateKeepAwake).toHaveBeenCalledWith(
        "mrbroccoli-on-device-models",
      ),
    );
  });

  it("keeps a download failure on the model instead of opening an alert", async () => {
    const firstSpeechModel = LOCAL_MODEL_CATALOG.find(
      (model) => model.capability === "stt",
    )!;
    const screen = renderPage();
    fireEvent.press(await getDownloadButton(screen, firstSpeechModel.id));
    await waitFor(() => expect(mockRejectDownload).toBeDefined());

    mockRejectDownload?.(new Error("Archive verification failed"));

    await waitFor(() =>
      expect(screen.getByTestId("local-model-error").props.children).toBe(
        "Archive verification failed",
      ),
    );
    expect(
      screen.getByTestId(`local-model-download-${firstSpeechModel.id}`),
    ).toBeTruthy();
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

});
