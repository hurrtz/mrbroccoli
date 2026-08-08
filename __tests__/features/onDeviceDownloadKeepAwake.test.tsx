import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";

/**
 * The wake lock used to live on the Free setup wizard. Removing the wizard
 * moved downloading to this page and silently left the lock behind, so a
 * sleeping phone aborted multi-gigabyte downloads again. These tests pin the
 * lock to the surface that actually downloads.
 */

const mockActivateKeepAwake = jest.fn(() => Promise.resolve());
const mockDeactivateKeepAwake = jest.fn(() => Promise.resolve());

jest.mock("expo-keep-awake", () => ({
  activateKeepAwakeAsync: (...args: unknown[]) =>
    mockActivateKeepAwake(...(args as [])),
  deactivateKeepAwake: (...args: unknown[]) =>
    mockDeactivateKeepAwake(...(args as [])),
}));

let mockResolveDownload: (() => void) | undefined;
const mockDownloadLocalModel = jest.fn(
  () =>
    new Promise<string>((resolve) => {
      mockResolveDownload = () => resolve("/models/local");
    }),
);

jest.mock("../../src/services/localModelManager", () => ({
  downloadLocalModel: (...args: unknown[]) =>
    mockDownloadLocalModel(...(args as [])),
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
      kokoroModel={kokoroModel}
      onPreviewVoice={jest.fn(() => Promise.resolve())}
      onUpdate={jest.fn()}
      settings={DEFAULT_SETTINGS}
    />,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  mockResolveDownload = undefined;
});

describe("on-device model downloads", () => {
  it("holds the wake lock for as long as a download runs", async () => {
    const firstLlm = LOCAL_MODEL_CATALOG.find(
      (model) => model.capability === "llm" && model.id !== "kokoro-multilingual",
    );
    expect(firstLlm).toBeTruthy();

    const screen = renderPage();
    const downloadButton = await waitFor(() =>
      screen.getAllByTestId(`on-device-download-${firstLlm?.id}`)[0],
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
});
