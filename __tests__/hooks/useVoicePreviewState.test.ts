import { act, renderHook } from "@testing-library/react-native";

import { TTS_LISTEN_LANGUAGE_OPTIONS } from "../../src/constants/localTts";
import { useVoicePreviewState } from "../../src/features/settings-core/useVoicePreviewState";
import { DEFAULT_SETTINGS, Provider, TtsListenLanguage } from "../../src/types";

function buildProviderPreviewTexts() {
  return Object.fromEntries(
    (Object.keys(DEFAULT_SETTINGS.apiKeys) as Provider[]).map((provider) => [
      provider,
      Object.fromEntries(
        TTS_LISTEN_LANGUAGE_OPTIONS.map((entry) => [entry, `${provider}-${entry}`]),
      ),
    ]),
  ) as Record<Provider, Record<TtsListenLanguage, string>>;
}

describe("useVoicePreviewState", () => {
  it("stops the active preview when the same preview is requested again", async () => {
    let resolvePreview: (() => void) | null = null;
    const onPreviewVoice = jest.fn(
      async (
        _request,
        callbacks?: {
          onPlaybackStarted?: () => void;
        },
      ) => {
        callbacks?.onPlaybackStarted?.();
        await new Promise<void>((resolve) => {
          resolvePreview = resolve;
        });
      },
    );
    const onStopPreviewVoice = jest.fn(async () => undefined);
    const hook = renderHook(() =>
      useVoicePreviewState({
        visible: true,
        settings: DEFAULT_SETTINGS,
        language: "en",
        providerPreviewTexts: buildProviderPreviewTexts(),
        kokoroPreviewTexts: { en: "Kokoro English", zh: "Kokoro Chinese" },
        nativePreviewText: "Native preview",
        selectedNativeVoice: "Samantha",
        onPreviewVoice,
        onStopPreviewVoice,
      }),
    );

    await act(async () => {
      void hook.result.current.handlePreviewNativeVoice();
      await Promise.resolve();
    });

    expect(hook.result.current.activePreview).toEqual({
      id: "native:Samantha",
      phase: "playing",
    });

    await act(async () => {
      await hook.result.current.handlePreviewNativeVoice();
    });

    expect(onStopPreviewVoice).toHaveBeenCalledTimes(1);
    expect(hook.result.current.activePreview).toBeNull();

    await act(async () => {
      resolvePreview?.();
      await Promise.resolve();
    });
  });

  it("ignores other preview requests while one preview is already active", async () => {
    let resolvePreview: (() => void) | null = null;
    const onPreviewVoice = jest.fn(
      async (
        _request,
        callbacks?: {
          onPlaybackStarted?: () => void;
        },
      ) => {
        callbacks?.onPlaybackStarted?.();
        await new Promise<void>((resolve) => {
          resolvePreview = resolve;
        });
      },
    );
    const onStopPreviewVoice = jest.fn(async () => undefined);
    const hook = renderHook(() =>
      useVoicePreviewState({
        visible: true,
        settings: DEFAULT_SETTINGS,
        language: "en",
        providerPreviewTexts: buildProviderPreviewTexts(),
        kokoroPreviewTexts: { en: "Kokoro English", zh: "Kokoro Chinese" },
        nativePreviewText: "Native preview",
        selectedNativeVoice: "Samantha",
        onPreviewVoice,
        onStopPreviewVoice,
      }),
    );

    await act(async () => {
      void hook.result.current.handlePreviewNativeVoice();
      await Promise.resolve();
    });

    await act(async () => {
      await hook.result.current.handlePreviewProviderVoice("openai", "en");
    });

    expect(onPreviewVoice).toHaveBeenCalledTimes(1);
    expect(onStopPreviewVoice).not.toHaveBeenCalled();

    await act(async () => {
      resolvePreview?.();
      await Promise.resolve();
    });
  });

  it("clears a generating preview immediately when the visible Stop action is used", async () => {
    let finishPreview: (() => void) | null = null;
    let finishStop: (() => void) | null = null;
    let reportPlaybackStarted: (() => void) | undefined;
    const onPreviewVoice = jest.fn(
      async (
        _request,
        callbacks?: {
          onPlaybackStarted?: () => void;
        },
      ) => {
        reportPlaybackStarted = callbacks?.onPlaybackStarted;
        await new Promise<void>((resolve) => {
          finishPreview = resolve;
        });
      },
    );
    const onStopPreviewVoice = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          finishStop = resolve;
        }),
    );
    const hook = renderHook(() =>
      useVoicePreviewState({
        visible: true,
        settings: DEFAULT_SETTINGS,
        language: "en",
        providerPreviewTexts: buildProviderPreviewTexts(),
        kokoroPreviewTexts: { en: "Kokoro English", zh: "Kokoro Chinese" },
        nativePreviewText: "Native preview",
        selectedNativeVoice: "Samantha",
        onPreviewVoice,
        onStopPreviewVoice,
      }),
    );

    let previewPromise: Promise<void> = Promise.resolve();
    await act(async () => {
      previewPromise = hook.result.current.handlePreviewKokoroVoice("en");
      await Promise.resolve();
    });

    expect(hook.result.current.activePreview).toEqual({
      id: "kokoro:en:af_maple",
      phase: "generating",
    });

    let stopPromise: Promise<void> = Promise.resolve();
    act(() => {
      stopPromise = hook.result.current.stopActivePreview();
    });

    expect(hook.result.current.activePreview).toBeNull();
    expect(onStopPreviewVoice).toHaveBeenCalledTimes(1);

    act(() => {
      reportPlaybackStarted?.();
    });
    expect(hook.result.current.activePreview).toBeNull();

    await act(async () => {
      finishStop?.();
      await stopPromise;
      finishPreview?.();
      await previewPromise;
    });

    expect(hook.result.current.activePreview).toBeNull();
  });
});
