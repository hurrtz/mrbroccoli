import { act, renderHook, waitFor } from "@testing-library/react-native";

import { useProviderVoiceDirectory } from "../../src/hooks/useProviderVoiceDirectory";
import { fetchProviderVoices } from "../../src/services/providerVoiceDirectory";

jest.mock("../../src/services/debugLogCapture", () => ({
  recordDebugLogEvent: jest.fn(),
}));

jest.mock("../../src/services/providerVoiceDirectory", () => ({
  ...jest.requireActual("../../src/services/providerVoiceDirectory"),
  fetchProviderVoices: jest.fn(),
}));

const VOICES = [
  {
    id: "voice-1",
    name: "Calm Guide",
    value: "voice-1",
    label: "Calm Guide",
    category: "premade",
    accent: null,
    gender: null,
    description: null,
    previewUrl: null,
  },
];

describe("useProviderVoiceDirectory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads voices automatically when a directory provider key is enabled", async () => {
    jest.mocked(fetchProviderVoices).mockResolvedValue(VOICES);

    const { result } = renderHook(() =>
      useProviderVoiceDirectory({
        provider: "elevenlabs",
        apiKey: "elevenlabs-key",
        enabled: true,
      }),
    );

    await waitFor(() => {
      expect(result.current.status).toBe("ready");
    });

    expect(fetchProviderVoices).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: "elevenlabs",
        apiKey: "elevenlabs-key",
        signal: expect.any(AbortSignal),
      }),
    );
    expect(result.current.voices).toEqual(VOICES);
  });

  it("does not call the directory without an enabled key", async () => {
    const { result } = renderHook(() =>
      useProviderVoiceDirectory({
        provider: "mistral",
        apiKey: "",
        enabled: false,
      }),
    );

    await waitFor(() => {
      expect(result.current.status).toBe("idle");
    });

    expect(fetchProviderVoices).not.toHaveBeenCalled();
    expect(result.current.voices).toEqual([]);
  });

  it("coalesces rapid credential edits into one directory request", async () => {
    jest.mocked(fetchProviderVoices).mockResolvedValue(VOICES);

    const { rerender } = renderHook(
      ({ apiKey }) =>
        useProviderVoiceDirectory({
          provider: "elevenlabs",
          apiKey,
          enabled: true,
        }),
      { initialProps: { apiKey: "first" } },
    );

    rerender({ apiKey: "second" });
    rerender({ apiKey: "final-key" });

    await act(
      async () =>
        new Promise((resolve) => {
          setTimeout(resolve, 450);
        }),
    );

    expect(fetchProviderVoices).toHaveBeenCalledTimes(1);
    expect(fetchProviderVoices).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: "elevenlabs",
        apiKey: "final-key",
      }),
    );
  });

  it("keeps existing voices visible while manually refreshing", async () => {
    let resolveRefresh: ((voices: typeof VOICES) => void) | undefined;
    jest
      .mocked(fetchProviderVoices)
      .mockResolvedValueOnce(VOICES)
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveRefresh = resolve;
          }),
      );

    const { result } = renderHook(() =>
      useProviderVoiceDirectory({
        provider: "elevenlabs",
        apiKey: "elevenlabs-key",
        enabled: true,
      }),
    );

    await waitFor(() => {
      expect(result.current.status).toBe("ready");
    });

    let refreshPromise: Promise<typeof VOICES> | undefined;
    act(() => {
      refreshPromise = result.current.refresh() as Promise<typeof VOICES>;
    });

    await waitFor(() => {
      expect(result.current.status).toBe("refreshing");
      expect(result.current.voices).toEqual(VOICES);
    });

    await act(async () => {
      resolveRefresh?.(VOICES);
      await refreshPromise;
    });

    expect(result.current.status).toBe("ready");
  });

  it("clears voices and reports an error after switching credentials", async () => {
    jest
      .mocked(fetchProviderVoices)
      .mockResolvedValueOnce(VOICES)
      .mockRejectedValueOnce(new Error("Unauthorized"));

    const { result, rerender } = renderHook(
      ({ apiKey }) =>
        useProviderVoiceDirectory({
          provider: "elevenlabs",
          apiKey,
          enabled: true,
        }),
      { initialProps: { apiKey: "first-key" } },
    );

    await waitFor(() => {
      expect(result.current.status).toBe("ready");
    });

    rerender({ apiKey: "second-key" });

    await waitFor(() => {
      expect(result.current.status).toBe("error");
    });

    expect(result.current.voices).toEqual([]);
    expect(result.current.error?.message).toBe("Unauthorized");
  });
});
