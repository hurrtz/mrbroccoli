import React from "react";
import { fireEvent, waitFor } from "@testing-library/react-native";

/**
 * The wake lock used to live on the Free setup wizard. Removing the wizard
 * moved downloading to this page and silently left the lock behind, so a
 * sleeping phone aborted multi-gigabyte downloads again. These tests pin the
 * lock to the surface that actually downloads.
 */

const mockBeginDownload = jest.fn(() => Promise.resolve(true));
const mockEndDownload = jest.fn(() => Promise.resolve(true));

const mockActivateKeepAwake = jest.fn(() => Promise.resolve());
const mockDeactivateKeepAwake = jest.fn(() => Promise.resolve());

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
  getLocalModelBenchmarkResults: jest.fn(() => Promise.resolve({})),
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
  getLocalCatalogInstallStatuses: jest.fn(() => Promise.resolve({})),
}));

jest.mock("../../src/services/offlineProfile", () => ({
  selectOfflineProfile: jest.fn(() => ({ status: "unavailable" })),
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

import { OnDeviceSettingsPage } from "../../src/features/settings/pages/OnDeviceSettingsPage";
import { LOCAL_MODEL_CATALOG } from "../../src/constants/localModels";
import { DEFAULT_SETTINGS } from "../../src/types";
import { renderWithProviders } from "../test-utils/renderWithProviders";
import { NativeModules, Platform } from "react-native";
import { createAutoSetupJob } from "../test-utils/autoSetupJobFixture";

// The hook reads the module and the platform at call time, so installing the
// stub here is enough and avoids mocking the bridge itself.
(
  NativeModules as unknown as Record<string, unknown>
).MrBroccoliModelDownload = {
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

function renderPage() {
  return renderWithProviders(
    <OnDeviceSettingsPage
      isPremium={false}
      autoSetup={createAutoSetupJob()}
      kokoroModel={kokoroModel}
      onPreviewVoice={jest.fn(() => Promise.resolve())}
      onUpdate={jest.fn()}
      settings={DEFAULT_SETTINGS}
    />,
  );
}

async function getLlmDownloadButton(
  screen: ReturnType<typeof renderPage>,
  modelId: string,
) {
  const disclosure = await waitFor(() =>
    screen.getByTestId("on-device-llm-disclosure-header-control"),
  );
  fireEvent.press(disclosure);
  return waitFor(() =>
    screen.getAllByTestId(`on-device-download-${modelId}`)[0],
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  mockResolveDownload = undefined;
  mockDownloadSignal = undefined;
});

describe("on-device model downloads", () => {
  it("keeps local model catalogues collapsed until the user opens one", async () => {
    const firstLlm = LOCAL_MODEL_CATALOG.find(
      (model) => model.capability === "llm",
    );
    expect(firstLlm).toBeTruthy();

    const screen = renderPage();
    await waitFor(() =>
      screen.getByTestId("on-device-llm-disclosure-header-control"),
    );
    expect(screen.queryByTestId(`on-device-download-${firstLlm!.id}`)).toBeNull();

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
      screen.getAllByTestId(`on-device-cancel-${firstLlm?.id}`)[0],
    );
    expect(mockDownloadSignal?.aborted).toBe(false);

    fireEvent.press(cancelButton);

    expect(mockDownloadSignal?.aborted).toBe(true);
    // Back to an offer to download, and no failure alert for a choice the
    // user made deliberately.
    await waitFor(() =>
      expect(
        screen.getAllByTestId(`on-device-download-${firstLlm?.id}`)[0],
      ).toBeTruthy(),
    );
    await waitFor(() =>
      expect(mockDeactivateKeepAwake).toHaveBeenCalledWith(
        "mrbroccoli-on-device-models",
      ),
    );
  });
});
