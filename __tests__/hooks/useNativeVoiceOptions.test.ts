import { renderHook, waitFor } from "@testing-library/react-native";
import * as Speech from "expo-speech";

import { useNativeVoiceOptions } from "../../src/features/settings-core/useNativeVoiceOptions";

jest.mock("expo-speech", () => ({
  getAvailableVoicesAsync: jest.fn(),
}));

const mockGetAvailableVoicesAsync = jest.mocked(
  Speech.getAvailableVoicesAsync,
);

describe("useNativeVoiceOptions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAvailableVoicesAsync.mockResolvedValue([
      {
        identifier: "de-DE-test",
        language: "de-DE",
        name: "Test voice",
        quality: "Enhanced" as Speech.VoiceQuality,
      },
    ]);
  });

  it("does not reload voices when an equivalent language array is recreated", async () => {
    const { rerender, result } = renderHook(
      ({ listenLanguages }: { listenLanguages: ["de"] }) =>
        useNativeVoiceOptions({
          listenLanguages,
          shouldLoad: true,
          visible: true,
        }),
      { initialProps: { listenLanguages: ["de"] } },
    );

    await waitFor(() => {
      expect(result.current.nativeVoiceOptions).toHaveLength(1);
    });
    expect(mockGetAvailableVoicesAsync).toHaveBeenCalledTimes(1);

    rerender({ listenLanguages: ["de"] });

    await waitFor(() => {
      expect(mockGetAvailableVoicesAsync).toHaveBeenCalledTimes(1);
    });
  });
});
