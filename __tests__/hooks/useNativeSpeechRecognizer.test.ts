import React from "react";
import { Platform } from "react-native";
import { getAiSharingSnapshot, resolveAiSharing, setSystemSpeechPermission } from "../../src/services/aiSharing";
import { getNativeRecognitionRoute } from "../../src/services/nativeSpeechCapabilities";
import { cleanupCapturedAudio } from "../../src/services/voicePipeline/cleanup";

jest.mock("../../src/services/voicePipeline/cleanup", () => ({ cleanupCapturedAudio: jest.fn() }));
import { act, renderHook } from "@testing-library/react-native";

import { LocalizationProvider } from "../../src/i18n";
import { useNativeSpeechRecognizer } from "../../src/hooks/useNativeSpeechRecognizer";
import { transcribeRecordedFile } from "../../src/hooks/nativeSpeechRecognizer/transcribeRecordedFile";
import {
  cancelNativeWaveformRecording,
  supportsNativeOnDeviceRecognition,
  isNativeWaveformAvailable,
  startNativeWaveformRecording,
  stopNativeWaveformRecording,
  subscribeToNativeWaveform,
} from "../../src/services/nativeWaveform";
import { ExpoSpeechRecognitionModule } from "expo-speech-recognition";

const speechListeners = new Map<string, Set<(event: any) => void>>();
const nativeWaveformListeners = new Set<(event: any) => void>();

function emitSpeechEvent(event: string, payload: any) {
  speechListeners.get(event)?.forEach((listener) => listener(payload));
}

function emitNativeWaveformEvent(event: any) {
  nativeWaveformListeners.forEach((listener) => listener(event));
}

jest.mock("expo-speech-recognition", () => ({
  ExpoSpeechRecognitionModule: {
    addListener: jest.fn(),
    getMicrophonePermissionsAsync: jest.fn(),
    getSpeechRecognizerPermissionsAsync: jest.fn(),
    requestSpeechRecognizerPermissionsAsync: jest.fn(),
    getDefaultRecognitionService: jest.fn(),
    supportsOnDeviceRecognition: jest.fn(),
    getSupportedLocales: jest.fn(),
    isRecognitionAvailable: jest.fn(),
    requestMicrophonePermissionsAsync: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
    abort: jest.fn(),
  },
}));

jest.mock("../../src/services/nativeWaveform", () => ({
  cancelNativeWaveformRecording: jest.fn(),
  supportsNativeOnDeviceRecognition: jest.fn(),
  isNativeWaveformAvailable: jest.fn(),
  startNativeWaveformRecording: jest.fn(),
  stopNativeWaveformRecording: jest.fn(),
  subscribeToNativeWaveform: jest.fn(),
}));

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(
    LocalizationProvider as React.ComponentType<any>,
    { language: "en" },
    children,
  );

describe("useNativeSpeechRecognizer", () => {
  let dateNowSpy: jest.SpyInstance<number, []>;

  beforeEach(() => {
    jest.clearAllMocks();
    speechListeners.clear();
    nativeWaveformListeners.clear();
    dateNowSpy = jest.spyOn(Date, "now").mockReturnValue(1_000);
    (ExpoSpeechRecognitionModule.addListener as jest.Mock).mockImplementation(
      (event: string, listener: (payload: any) => void) => {
        const listeners = speechListeners.get(event) ?? new Set();
        listeners.add(listener);
        speechListeners.set(event, listeners);
        return {
          remove: () => {
            listeners.delete(listener);
          },
        };
      },
    );
    (
      ExpoSpeechRecognitionModule.isRecognitionAvailable as jest.Mock
    ).mockReturnValue(true);
    (
      ExpoSpeechRecognitionModule.getMicrophonePermissionsAsync as jest.Mock
    ).mockResolvedValue({ granted: true });
    (
      ExpoSpeechRecognitionModule.requestMicrophonePermissionsAsync as jest.Mock
    ).mockResolvedValue({ granted: true });
    (ExpoSpeechRecognitionModule.start as jest.Mock).mockImplementation(
      () => undefined,
    );
    (ExpoSpeechRecognitionModule.stop as jest.Mock).mockImplementation(
      () => undefined,
    );
    (ExpoSpeechRecognitionModule.abort as jest.Mock).mockImplementation(
      () => undefined,
    );
    (isNativeWaveformAvailable as jest.Mock).mockReturnValue(true);
    jest.mocked(supportsNativeOnDeviceRecognition).mockResolvedValue(true);
    (ExpoSpeechRecognitionModule.getSpeechRecognizerPermissionsAsync as jest.Mock).mockResolvedValue({ granted: true });
    (startNativeWaveformRecording as jest.Mock).mockResolvedValue({
      uri: "file://capture.wav",
    });
    (stopNativeWaveformRecording as jest.Mock).mockResolvedValue({
      uri: "file://capture.wav",
    });
    (cancelNativeWaveformRecording as jest.Mock).mockResolvedValue(true);
    (subscribeToNativeWaveform as jest.Mock).mockImplementation(
      (listener: (event: any) => void) => {
        nativeWaveformListeners.add(listener);
        return () => {
          nativeWaveformListeners.delete(listener);
        };
      },
    );
  });

  afterEach(() => {
    dateNowSpy.mockRestore();
  });

  describe("system speech privacy", () => {
    const pkg = "org.example.speech";

    beforeEach(async () => {
      await act(async () => {
        await setSystemSpeechPermission("apple", null);
        await setSystemSpeechPermission("android." + pkg, null);
      });
      jest.mocked(supportsNativeOnDeviceRecognition).mockResolvedValue(false);
    });

    it("blocks the iOS live recognizer and leaves the composer idle after a refusal", async () => {
      jest.mocked(isNativeWaveformAvailable).mockReturnValue(false);
      const { result } = renderHook(() => useNativeSpeechRecognizer("uk"), { wrapper });
      let started!: Promise<boolean>;
      await act(async () => {
        started = result.current.startRecognition();
        await new Promise<void>((resolve) => setImmediate(resolve));
      });
      const pending = getAiSharingSnapshot().pending!;
      expect(pending.request.systemSpeech).toBe("apple");
      expect(supportsNativeOnDeviceRecognition).toHaveBeenCalledWith("uk-UA");
      expect(ExpoSpeechRecognitionModule.start).not.toHaveBeenCalled();
      expect(result.current.isRecording).toBe(false);
      await act(async () => {
        await resolveAiSharing(pending.id, null);
        await expect(started).resolves.toBe(false);
      });
      expect(result.current.blockedSystemSpeech).toBe("apple");
      expect(ExpoSpeechRecognitionModule.getSpeechRecognizerPermissionsAsync).not.toHaveBeenCalled();
      await act(async () => { await setSystemSpeechPermission("apple", true); });
      expect(result.current.blockedSystemSpeech).toBeNull();
    });

    it.each(["cancel", "stop", "unmount"])("withdraws a pending request on %s", async (action) => {
      const { result, unmount } = renderHook(() => useNativeSpeechRecognizer("en"), { wrapper });
      let started!: Promise<boolean>;
      await act(async () => {
        started = result.current.startRecognition();
        await new Promise<void>((resolve) => setImmediate(resolve));
      });
      expect(getAiSharingSnapshot().pending?.request.systemSpeech).toBe("apple");
      if (action === "unmount") unmount();
      await act(async () => {
        if (action === "cancel") await result.current.abortRecognition();
        else if (action === "stop") await result.current.stopRecognition();
        await expect(started).resolves.toBe(false);
      });
      expect(getAiSharingSnapshot().pending).toBeNull();
      expect(startNativeWaveformRecording).not.toHaveBeenCalled();
    });

    it("fails locally when a required on-device locale is unavailable", async () => {
      const { result } = renderHook(() => useNativeSpeechRecognizer("de", true), { wrapper });
      await act(async () => { await expect(result.current.startRecognition()).rejects.toThrow(); });
      expect(getAiSharingSnapshot().pending).toBeNull();
      expect(startNativeWaveformRecording).not.toHaveBeenCalled();
    });

    it("cancels recording when the approved system recipient is revoked", async () => {
      await setSystemSpeechPermission("apple", true);
      const { result } = renderHook(() => useNativeSpeechRecognizer("en"), { wrapper });
      await act(async () => { await expect(result.current.startRecognition()).resolves.toBe(true); });
      expect(result.current.isRecording).toBe(true);
      await act(async () => { await setSystemSpeechPermission("apple", false); });
      expect(result.current.isRecording).toBe(false);
      expect(cancelNativeWaveformRecording).toHaveBeenCalledTimes(1);
      expect(ExpoSpeechRecognitionModule.start).not.toHaveBeenCalled();
    });

    it("settles a live stop without submitting a partial result when permission is revoked", async () => {
      jest.mocked(isNativeWaveformAvailable).mockReturnValue(false);
      await setSystemSpeechPermission("apple", true);
      const { result } = renderHook(() => useNativeSpeechRecognizer("en"), { wrapper });
      await act(async () => { await result.current.startRecognition(); });
      expect(ExpoSpeechRecognitionModule.start).toHaveBeenCalledWith(expect.objectContaining({
        lang: "en-US", requiresOnDeviceRecognition: false,
      }));
      dateNowSpy.mockReturnValue(2_000);
      await act(async () => {
        emitSpeechEvent("result", {results: [{ transcript: "unfinished" }], isFinal: false});
        const transcription = result.current.stopRecognition();
        await setSystemSpeechPermission("apple", false);
        await expect(transcription).resolves.toBeNull();
      });
      expect(ExpoSpeechRecognitionModule.abort).toHaveBeenCalledTimes(1);
      expect(result.current.isRecording).toBe(false);
    });

    it("uses the exact Android offline locale and pins a remote file to the approved package", async () => {
      const os = Object.getOwnPropertyDescriptor(Platform, "OS")!;
      const version = Object.getOwnPropertyDescriptor(Platform, "Version")!;
      try {
        Object.defineProperty(Platform, "OS", { configurable: true, value: "android" });
        Object.defineProperty(Platform, "Version", { configurable: true, value: 33 });
        const speech = ExpoSpeechRecognitionModule;
        jest.mocked(speech.supportsOnDeviceRecognition).mockReturnValue(true);
        jest.mocked(speech.getDefaultRecognitionService).mockReturnValue({ packageName: pkg });
        jest.mocked(speech.getSupportedLocales).mockResolvedValue({ locales: ["en-US"], installedLocales: ["en_US"] });
        await expect(getNativeRecognitionRoute("en", true)).resolves.toEqual({
          options: { lang: "en-US", requiresOnDeviceRecognition: true },
        });
        jest.mocked(speech.getSupportedLocales).mockResolvedValue({ locales: ["en-US"], installedLocales: ["en-GB"] });
        await expect(getNativeRecognitionRoute("en", true)).resolves.toBeNull();
        await setSystemSpeechPermission("android." + pkg, true);
        const { result } = renderHook(() => useNativeSpeechRecognizer("en"), { wrapper });
        await act(async () => { await result.current.startRecognition(); });
        jest.mocked(speech.getDefaultRecognitionService).mockReturnValue({ packageName: "org.changed.speech" });
        dateNowSpy.mockReturnValue(2_000);
        await act(async () => {
          const stop = result.current.stopRecognition();
          await new Promise<void>((resolve) => setImmediate(resolve));
          expect(speech.start).toHaveBeenCalledWith(expect.objectContaining({
            audioSource: { uri: "file://capture.wav" }, requiresOnDeviceRecognition: false, androidRecognitionServicePackage: pkg,
          }));
          await setSystemSpeechPermission("android." + pkg, false);
          await expect(stop).resolves.toBeNull();
        });
        expect(cleanupCapturedAudio).toHaveBeenCalledWith("file://capture.wav");
        expect(speech.abort).toHaveBeenCalledTimes(1);
      } finally {
        Object.defineProperty(Platform, "OS", os);
        Object.defineProperty(Platform, "Version", version);
      }
    });
  });

  it("starts native waveform recording on iOS", async () => {
    const { result } = renderHook(() => useNativeSpeechRecognizer(), {
      wrapper,
    });

    await act(async () => {
      await result.current.startRecognition();
    });

    expect(ExpoSpeechRecognitionModule.getMicrophonePermissionsAsync).toHaveBeenCalled();
    expect(
      ExpoSpeechRecognitionModule.requestMicrophonePermissionsAsync,
    ).not.toHaveBeenCalled();
    expect(startNativeWaveformRecording).toHaveBeenCalledWith(
      expect.objectContaining({
        sessionId: expect.stringMatching(/^native-stt-/),
      }),
    );
    expect(result.current.isRecording).toBe(true);
  });

  it("requests microphone permission only when it is not already granted", async () => {
    (
      ExpoSpeechRecognitionModule.getMicrophonePermissionsAsync as jest.Mock
    ).mockResolvedValue({ granted: false });

    const { result } = renderHook(() => useNativeSpeechRecognizer(), {
      wrapper,
    });

    await act(async () => {
      await result.current.startRecognition();
    });

    expect(
      ExpoSpeechRecognitionModule.requestMicrophonePermissionsAsync,
    ).toHaveBeenCalledTimes(1);
    expect(startNativeWaveformRecording).toHaveBeenCalledTimes(1);
    expect(result.current.isRecording).toBe(true);
  });

  it("aborts an active native recording session", async () => {
    const { result } = renderHook(() => useNativeSpeechRecognizer(), {
      wrapper,
    });

    await act(async () => {
      await result.current.startRecognition();
    });

    const sessionId = (startNativeWaveformRecording as jest.Mock).mock
      .calls[0][0].sessionId;

    await act(async () => {
      await result.current.abortRecognition();
    });

    expect(cancelNativeWaveformRecording).toHaveBeenCalledWith(sessionId);
    expect(result.current.isRecording).toBe(false);
  });

  it("stops native recording and returns the recorded transcript", async () => {
    const { result } = renderHook(() => useNativeSpeechRecognizer("uk", true), {
      wrapper,
    });

    await act(async () => {
      await result.current.startRecognition();
    });

    dateNowSpy.mockReturnValue(2_000);

    let transcriptPromise: Promise<string | null>;
    await act(async () => {
      transcriptPromise = result.current.stopRecognition();
      await Promise.resolve();
      await Promise.resolve();
      emitSpeechEvent("result", {
        results: [{ transcript: "Hello native world" }],
        isFinal: true,
      });
      emitSpeechEvent("end", {});
    });

    await expect(transcriptPromise!).resolves.toBe("Hello native world");
    expect(cleanupCapturedAudio).toHaveBeenCalledWith("file://capture.wav");
    expect(stopNativeWaveformRecording).toHaveBeenCalledWith(
      (startNativeWaveformRecording as jest.Mock).mock.calls[0][0].sessionId,
    );
    expect(ExpoSpeechRecognitionModule.start).toHaveBeenCalledWith(
      expect.objectContaining({
        lang: "uk-UA",
        requiresOnDeviceRecognition: true,
        audioSource: {
          uri: "file://capture.wav",
        },
      }),
    );
    expect(result.current.isRecording).toBe(false);
  });

  it("preserves every final segment from a long recorded-file transcription", async () => {
    const { result } = renderHook(() => useNativeSpeechRecognizer("en", true), {
      wrapper,
    });

    await act(async () => {
      await result.current.startRecognition();
    });

    dateNowSpy.mockReturnValue(62_000);

    let transcriptPromise: Promise<string | null>;
    await act(async () => {
      transcriptPromise = result.current.stopRecognition();
      await Promise.resolve();
      await Promise.resolve();
      emitSpeechEvent("result", {
        results: [{ transcript: "The first part stays." }],
        isFinal: true,
      });
      emitSpeechEvent("result", {
        results: [{ transcript: " The middle is still being recognized" }],
        isFinal: false,
      });
      emitSpeechEvent("result", {
        results: [{ transcript: " The middle is complete." }],
        isFinal: true,
      });
      emitSpeechEvent("result", {
        results: [{ transcript: " The last sentence is here." }],
        isFinal: true,
      });
      emitSpeechEvent("end", {});
    });

    await expect(transcriptPromise!).resolves.toBe(
      "The first part stays. The middle is complete. The last sentence is here.",
    );
  });

  describe.each([true, false])(
    "usingNativeRecorder=%s",
    (usingNativeRecorder) => {
      it.each([
        {
          label: "preserves repeated words in explicitly segmented results",
          events: [
            { transcript: "Yes", isFinal: true },
            { transcript: " Yes", isFinal: true },
            { transcript: " Yes maybe", isFinal: false },
            { transcript: " Yes absolutely", isFinal: true },
          ],
          expected: "Yes Yes Yes absolutely",
        },
        {
          label: "does not duplicate cumulative recognition results",
          events: [
            { transcript: "Yes", isFinal: true },
            { transcript: "Yes maybe", isFinal: false },
            { transcript: "Yes absolutely", isFinal: true },
          ],
          expected: "Yes absolutely",
        },
      ])("$label", async ({ events, expected }) => {
        (isNativeWaveformAvailable as jest.Mock).mockReturnValue(
          usingNativeRecorder,
        );
        const { result } = renderHook(() => useNativeSpeechRecognizer("en"), {
          wrapper,
        });
        await act(async () => {
          await result.current.startRecognition();
        });
        dateNowSpy.mockReturnValue(62_000);
        let transcriptPromise: Promise<string | null>;
        await act(async () => {
          transcriptPromise = result.current.stopRecognition();
          await Promise.resolve();
          await Promise.resolve();
          for (const { transcript, isFinal } of events) {
            emitSpeechEvent("result", { results: [{ transcript }], isFinal });
          }
          emitSpeechEvent("end", {});
        });
        await expect(transcriptPromise!).resolves.toBe(expected);
      });
    },
  );

  it("keeps an automatically completed live result until the user submits or discards it", async () => {
    jest.mocked(isNativeWaveformAvailable).mockReturnValue(false);
    const { result } = renderHook(() => useNativeSpeechRecognizer(), { wrapper });
    for (const discard of [false, true]) {
      await act(async () => { await result.current.startRecognition(); });
      dateNowSpy.mockReturnValue(Date.now() + 2_000);
      act(() => {
        emitSpeechEvent("result", { results: [{ transcript: "Book the train" }], isFinal: true });
        emitSpeechEvent("end", {});
      });
      expect(result.current.isRecording).toBe(true);
      if (discard) await act(async () => { await result.current.abortRecognition(); });
      let transcript: string | null = null;
      await act(async () => { transcript = await result.current.stopRecognition(); });
      expect(transcript).toBe(discard ? null : "Book the train");
      expect(result.current.isRecording).toBe(false);
      await expect(result.current.stopRecognition()).resolves.toBeNull();
    }
  });

  it("cancels recognition while the recorder is still finalizing its file", async () => {
    let releaseFile!: (recording: { uri: string }) => void;
    jest.mocked(stopNativeWaveformRecording).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          releaseFile = resolve;
        }),
    );
    const { result } = renderHook(() => useNativeSpeechRecognizer(), {
      wrapper,
    });
    await act(async () => {
      await result.current.startRecognition();
    });
    dateNowSpy.mockReturnValue(5_000);
    let stop!: Promise<string | null>;
    act(() => {
      stop = result.current.stopRecognition();
    });
    await act(async () => {
      await result.current.abortRecognition();
    });
    await act(async () => {
      releaseFile({ uri: "file://discarded.wav" });
      await Promise.resolve();
      expect(ExpoSpeechRecognitionModule.start).not.toHaveBeenCalled();
      await expect(stop).resolves.toBeNull();
    });
    expect(cleanupCapturedAudio).toHaveBeenCalledWith("file://discarded.wav");
  });

  it("allows a long System recording to finish and rejects incomplete file recognition", async () => {
    jest.useFakeTimers({ doNotFake: ["Date"] });
    try {
      const { result } = renderHook(() => useNativeSpeechRecognizer(), { wrapper });
      for (const complete of [true, false]) {
        await act(async () => { await result.current.startRecognition(); });
        dateNowSpy.mockReturnValue(Date.now() + 900_000);
        let pending!: Promise<string | null>;
        await act(async () => {
          pending = result.current.stopRecognition();
          await Promise.resolve();
          await Promise.resolve();
          emitSpeechEvent("result", { results: [{ transcript: "Partial speech" }], isFinal: false });
        });
        const outcome = pending.then(value => value, () => "rejected");
        jest.advanceTimersByTime(120_000);
        expect(ExpoSpeechRecognitionModule.abort).not.toHaveBeenCalled();
        if (complete) {
          emitSpeechEvent("result", { results: [{ transcript: "Complete speech" }], isFinal: true });
          emitSpeechEvent("end", {});
        } else {
          jest.runOnlyPendingTimers();
        }
        expect(await outcome).toBe(complete ? "Complete speech" : "rejected");
        expect(cleanupCapturedAudio).toHaveBeenCalledWith("file://capture.wav");
      }
    } finally {
      jest.useRealTimers();
    }
  });

  it("aborts recorded-file recognition and removes its listeners and watchdog", async () => {
    jest.useFakeTimers({ doNotFake: ["Date"] });
    try {
      const controller = new AbortController();
      const transcription = transcribeRecordedFile({
        abortSignal: controller.signal,
        fileUri: "file://intro-recording.m4a",
        finalTranscriptRef: { current: "" },
        latestTranscriptRef: { current: "" },
        grant: { options: { requiresOnDeviceRecognition: true, lang: "en-US" }, allowed: () => true },
        t: ((key: string) => key) as any,
      });

      expect(ExpoSpeechRecognitionModule.start).toHaveBeenCalledTimes(1);
      expect([
        speechListeners.get("result")?.size,
        speechListeners.get("error")?.size,
        speechListeners.get("end")?.size,
      ]).toEqual([1, 1, 1]);

      controller.abort();

      await expect(transcription).resolves.toBeNull();
      expect(ExpoSpeechRecognitionModule.abort).toHaveBeenCalledTimes(1);
      expect([
        speechListeners.get("result")?.size,
        speechListeners.get("error")?.size,
        speechListeners.get("end")?.size,
      ]).toEqual([0, 0, 0]);

      jest.advanceTimersByTime(120_000);
      expect(ExpoSpeechRecognitionModule.abort).toHaveBeenCalledTimes(1);
    } finally {
      jest.useRealTimers();
    }
  });

  it("surfaces native waveform recorder errors and resets recording state", async () => {
    const { result } = renderHook(() => useNativeSpeechRecognizer(), {
      wrapper,
    });

    await act(async () => {
      await result.current.startRecognition();
    });

    const sessionId = (startNativeWaveformRecording as jest.Mock).mock
      .calls[0][0].sessionId;

    await act(async () => {
      emitNativeWaveformEvent({
        type: "error",
        sessionId,
        message: "Recorder write failed",
      });
    });

    expect(cancelNativeWaveformRecording).toHaveBeenCalledWith(sessionId);
    expect(result.current.lastError).toBe("Recorder write failed");
    expect(result.current.isRecording).toBe(false);
  });

  it("exposes native microphone levels while recognizing speech", async () => {
    const { result } = renderHook(() => useNativeSpeechRecognizer(), {
      wrapper,
    });

    await act(async () => {
      await result.current.startRecognition();
    });

    const sessionId = (startNativeWaveformRecording as jest.Mock).mock
      .calls[0][0].sessionId;

    act(() => {
      emitNativeWaveformEvent({
        type: "levels",
        sessionId,
        metering: -21,
      });
      emitNativeWaveformEvent({
        type: "levels",
        sessionId,
        metering: -21,
      });
    });

    expect(result.current.inputMetering).toBe(-21);
    expect(result.current.inputMeteringSampleId).toBe(2);
  });

  it("subscribes to system recognition events and resolves the final transcript", async () => {
    (isNativeWaveformAvailable as jest.Mock).mockReturnValue(false);
    const { result } = renderHook(() => useNativeSpeechRecognizer("de"), {
      wrapper,
    });

    expect(ExpoSpeechRecognitionModule.addListener).toHaveBeenCalledTimes(5);
    expect(
      (ExpoSpeechRecognitionModule.addListener as jest.Mock).mock.calls.map(
        ([event]) => event,
      ),
    ).toEqual(["start", "result", "volumechange", "error", "end"]);

    await act(async () => {
      await result.current.startRecognition();
      emitSpeechEvent("start", {});
      emitSpeechEvent("volumechange", { value: 5 });
      emitSpeechEvent("volumechange", { value: 5 });
    });

    expect(ExpoSpeechRecognitionModule.start).toHaveBeenCalledWith(
      expect.objectContaining({
        lang: "de-DE",
        interimResults: true,
        requiresOnDeviceRecognition: true,
        volumeChangeEventOptions: {
          enabled: true,
          intervalMillis: 150,
        },
      }),
    );
    expect(result.current.isRecording).toBe(true);
    expect(result.current.inputMetering).toBe(-28);
    expect(result.current.inputMeteringSampleId).toBe(2);

    dateNowSpy.mockReturnValue(2_000);
    let transcriptPromise: Promise<string | null>;
    act(() => {
      transcriptPromise = result.current.stopRecognition();
      emitSpeechEvent("result", {
        results: [{ transcript: "Hallo System" }],
        isFinal: true,
      });
      emitSpeechEvent("end", {});
    });

    await expect(transcriptPromise!).resolves.toBe("Hallo System");
    expect(ExpoSpeechRecognitionModule.stop).toHaveBeenCalledTimes(1);
    expect(result.current.isRecording).toBe(false);
    expect(result.current.inputMetering).toBeNull();
  });

  it("settles a stop whose end event never arrives and releases the session", async () => {
    jest.useFakeTimers({ doNotFake: ["Date"] });
    try {
      (isNativeWaveformAvailable as jest.Mock).mockReturnValue(false);
      const { result } = renderHook(() => useNativeSpeechRecognizer("de"), {
        wrapper,
      });

      await act(async () => {
        await result.current.startRecognition();
        emitSpeechEvent("start", {});
      });

      dateNowSpy.mockReturnValue(2_000);
      let transcriptPromise: Promise<string | null>;
      act(() => {
        transcriptPromise = result.current.stopRecognition();
        emitSpeechEvent("result", {
          results: [{ transcript: "Hallo Watchdog" }],
          isFinal: true,
        });
        // No end/error event: the platform recognizer dropped its callback.
      });

      act(() => {
        jest.advanceTimersByTime(8_000);
      });

      await expect(transcriptPromise!).resolves.toBe("Hallo Watchdog");
      expect(ExpoSpeechRecognitionModule.abort).toHaveBeenCalledTimes(1);
      expect(result.current.isRecording).toBe(false);
    } finally {
      jest.useRealTimers();
    }
  });

  it("settles an abort whose terminal event never arrives", async () => {
    jest.useFakeTimers({ doNotFake: ["Date"] });
    try {
      (isNativeWaveformAvailable as jest.Mock).mockReturnValue(false);
      const { result } = renderHook(() => useNativeSpeechRecognizer(), {
        wrapper,
      });

      await act(async () => {
        await result.current.startRecognition();
      });

      let abortPromise: Promise<void>;
      act(() => {
        abortPromise = result.current.abortRecognition();
        // No end/error event arrives.
      });

      act(() => {
        jest.advanceTimersByTime(8_000);
      });

      await expect(abortPromise!).resolves.toBeUndefined();
      expect(result.current.isRecording).toBe(false);
    } finally {
      jest.useRealTimers();
    }
  });

  it("resolves an aborted system recognition session without surfacing an error", async () => {
    (isNativeWaveformAvailable as jest.Mock).mockReturnValue(false);
    const { result } = renderHook(() => useNativeSpeechRecognizer(), {
      wrapper,
    });

    await act(async () => {
      await result.current.startRecognition();
    });

    let abortPromise: Promise<void>;
    act(() => {
      abortPromise = result.current.abortRecognition();
      emitSpeechEvent("error", { error: "aborted", message: "Aborted" });
    });

    await expect(abortPromise!).resolves.toBeUndefined();
    expect(ExpoSpeechRecognitionModule.abort).toHaveBeenCalledTimes(1);
    expect(result.current.isRecording).toBe(false);
    expect(result.current.lastError).toBeNull();
  });

  it("removes system subscriptions and aborts recognition on unmount", async () => {
    (isNativeWaveformAvailable as jest.Mock).mockReturnValue(false);
    const { result, unmount } = renderHook(() => useNativeSpeechRecognizer(), {
      wrapper,
    });

    await act(async () => {
      await result.current.startRecognition();
    });

    act(() => {
      unmount();
    });

    expect(ExpoSpeechRecognitionModule.abort).toHaveBeenCalledTimes(1);
    expect(
      [...speechListeners.values()].every((listeners) => listeners.size === 0),
    ).toBe(true);
  });
});
