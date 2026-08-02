import React from "react";
import { fireEvent } from "@testing-library/react-native";

import { FreeOfflineSetupModal } from "../../src/components/FreeOfflineSetupModal";
import type { FreeOfflineModeController } from "../../src/screens/main/useFreeOfflineMode";
import { selectOfflineProfile } from "../../src/services/offlineProfile";
import type { LocalDeviceSnapshot } from "../../src/services/localDeviceCapabilities";
import { DEFAULT_SETTINGS } from "../../src/types";
import { renderWithProviders } from "../test-utils/renderWithProviders";

const GIB = 1024 ** 3;

function bilingualController(): FreeOfflineModeController {
  const snapshot: LocalDeviceSnapshot = {
    version: 1,
    capturedAt: "2026-08-02T00:00:00.000Z",
    platform: "ios",
    physicalMemoryBytes: 8 * GIB,
    availableMemoryBytes: 5 * GIB,
    freeStorageBytes: 10 * GIB,
    totalStorageBytes: 128 * GIB,
    processorCount: 8,
    activeProcessorCount: 8,
    architecture: "arm64",
    osVersion: "26.5.2",
    lowPowerMode: false,
    memoryLow: false,
    thermalState: "nominal",
  };
  const selection = selectOfflineProfile({
    languages: ["en", "de"],
    snapshot,
  });
  if (selection.status !== "ready") {
    throw new Error("Expected a bilingual Free profile");
  }

  return {
    effectiveSettings: {
      ...DEFAULT_SETTINGS,
      localLanguages: ["en", "de"],
    },
    entitlement: {} as FreeOfflineModeController["entitlement"],
    freeRuntimeReady: true,
    modalVisible: true,
    setModalVisible: jest.fn(),
    checking: false,
    preparing: false,
    preparationProgress: null,
    snapshot,
    selection,
    readiness: { ready: true } as FreeOfflineModeController["readiness"],
    error: null,
    toggleLanguage: jest.fn(),
    prepare: jest.fn(async () => undefined),
    refresh: jest.fn(async () => null),
  };
}

describe("FreeOfflineSetupModal", () => {
  it("explains bilingual system speech and ends with one clear start action", () => {
    const controller = bilingualController();
    const screen = renderWithProviders(
      <FreeOfflineSetupModal
        controller={controller}
        onOpenPremium={jest.fn()}
      />,
    );

    expect(screen.getByText("1 · Choose conversation languages")).toBeTruthy();
    expect(screen.getByText("2 · Prepare private AI")).toBeTruthy();
    expect(screen.getByText("3 · Start talking")).toBeTruthy();
    expect(
      screen.getByText(
        "No single downloaded voice covers this language set, so replies use the phone’s language-aware system voice. Listening and thinking stay local.",
      ),
    ).toBeTruthy();

    fireEvent.press(screen.getByText("Start talking"));
    expect(controller.setModalVisible).toHaveBeenCalledWith(false);
  });
});
