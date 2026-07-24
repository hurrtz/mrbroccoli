import { act, renderHook, waitFor } from "@testing-library/react-native";

import { useMistralVoices } from "../../src/hooks/useMistralVoices";
import { fetchMistralVoices } from "../../src/services/mistralVoices";

jest.mock("../../src/services/mistralVoices", () => ({
  ...jest.requireActual("../../src/services/mistralVoices"),
  fetchMistralVoices: jest.fn(),
}));

const VOICES = [
  {
    id: "voice-1",
    name: "Calm Guide",
    slug: "calm-guide",
    value: "calm-guide",
    label: "Calm Guide · calm-guide",
    languages: ["en"],
    gender: null,
    isCustom: false,
  },
];

describe("useMistralVoices", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads voices automatically when a Mistral key is enabled", async () => {
    jest.mocked(fetchMistralVoices).mockResolvedValue(VOICES);

    const { result } = renderHook(() =>
      useMistralVoices({ apiKey: "mistral-key", enabled: true }),
    );

    await waitFor(() => {
      expect(result.current.status).toBe("ready");
    });

    expect(fetchMistralVoices).toHaveBeenCalledWith(
      expect.objectContaining({
        apiKey: "mistral-key",
        signal: expect.any(AbortSignal),
      }),
    );
    expect(result.current.voices).toEqual(VOICES);
  });

  it("does not call Mistral without an enabled key", async () => {
    const { result } = renderHook(() =>
      useMistralVoices({ apiKey: "", enabled: false }),
    );

    await waitFor(() => {
      expect(result.current.status).toBe("idle");
    });

    expect(fetchMistralVoices).not.toHaveBeenCalled();
    expect(result.current.voices).toEqual([]);
  });

  it("keeps existing voices visible while manually refreshing", async () => {
    let resolveRefresh: ((voices: typeof VOICES) => void) | undefined;
    jest
      .mocked(fetchMistralVoices)
      .mockResolvedValueOnce(VOICES)
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveRefresh = resolve;
          }),
      );

    const { result } = renderHook(() =>
      useMistralVoices({ apiKey: "mistral-key", enabled: true }),
    );

    await waitFor(() => {
      expect(result.current.status).toBe("ready");
    });

    let refreshPromise: Promise<typeof VOICES> | undefined;
    act(() => {
      refreshPromise = result.current.refresh();
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
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    jest
      .mocked(fetchMistralVoices)
      .mockResolvedValueOnce(VOICES)
      .mockRejectedValueOnce(new Error("Unauthorized"));

    const { result, rerender } = renderHook(
      ({ apiKey }) => useMistralVoices({ apiKey, enabled: true }),
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
    expect(consoleError).toHaveBeenCalledWith(
      "[mistral-voices] failed to load voice directory",
      expect.any(Error),
    );
    consoleError.mockRestore();
  });
});
