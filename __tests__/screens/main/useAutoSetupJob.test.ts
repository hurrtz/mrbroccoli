import { act, renderHook } from "@testing-library/react-native";

import { useAutoSetupJob } from "../../../src/screens/main/useAutoSetupJob";
import { DEFAULT_SETTINGS, type Settings } from "../../../src/types";
import type { TranslateFn } from "../../../src/screens/main/shared";

const snapshot = {
  version: 1,
  capturedAt: "2026-08-10T00:00:00.000Z",
  platform: "ios" as const,
  physicalMemoryBytes: 8 * 1024 ** 3,
  availableMemoryBytes: 3 * 1024 ** 3,
  freeStorageBytes: 40 * 1024 ** 3,
  totalStorageBytes: 128 * 1024 ** 3,
  processorCount: 6,
  activeProcessorCount: 6,
  architecture: "arm64",
  osVersion: "26.0",
  lowPowerMode: false,
  memoryLow: false,
  thermalState: "nominal" as const,
};

const llmModel = {
  id: "qwen3-0.6b-q8",
  name: "Qwen3 0.6B",
  capability: "llm",
  downloadBytes: 700 * 1024 ** 2,
};
const sttModel = {
  id: "whisper-tiny",
  name: "Whisper Tiny",
  capability: "stt",
  downloadBytes: 80 * 1024 ** 2,
};

const mockSelect = jest.fn();
const mockPrepare = jest.fn();
const mockGetBenchmarks = jest.fn();
const mockGetInstallStatuses = jest.fn();
const mockEvaluateReadiness = jest.fn();

jest.mock("../../../src/services/localDeviceCapabilities", () => ({
  probeLocalDeviceCapabilities: jest.fn(async () => snapshot),
  getLocalModelBenchmarkResults: (...args: unknown[]) =>
    mockGetBenchmarks(...args),
  localModelBenchmarkMatchesDevice: (
    benchmark: { device?: typeof snapshot } | undefined,
    device: typeof snapshot,
  ) =>
    Boolean(
      benchmark?.device?.platform === device.platform &&
      benchmark.device.architecture === device.architecture &&
      benchmark.device.osVersion === device.osVersion &&
      benchmark.device.physicalMemoryBytes === device.physicalMemoryBytes,
    ),
}));

jest.mock("../../../src/services/nativeSpeechCapabilities", () => ({
  probeNativeSpeechCapabilities: jest.fn(async () => ({
    nativeSttEligible: false,
  })),
}));

jest.mock("../../../src/services/offlineProfile", () => ({
  selectOfflineProfile: (...args: unknown[]) => mockSelect(...args),
  getOfflineProfileModels: (profile: {
    llm: unknown;
    stt?: unknown;
    tts?: unknown;
  }) =>
    [profile.llm, profile.stt, profile.tts].filter((model) => model != null),
  applyOfflineProfileToSettings: (settings: Settings) => ({
    ...settings,
    responseModes: [
      {
        id: "free-local",
        route: {
          runtime: "local",
          localModelId: "qwen3-0.6b-q8",
          provider: "openai",
          model: "Qwen3 0.6B",
        },
      },
    ],
  }),
}));

jest.mock("../../../src/services/offlineProfileManager", () => ({
  getLocalCatalogInstallStatuses: (...args: unknown[]) =>
    mockGetInstallStatuses(...args),
  getOfflineProfileValidationModels: (profile: {
    llm: unknown;
    stt?: unknown;
    tts?: unknown;
  }) =>
    [profile.llm, profile.stt, profile.tts].filter((model) => model != null),
  evaluateOfflineProfileReadiness: (...args: unknown[]) =>
    mockEvaluateReadiness(...args),
  prepareOfflineProfile: (...args: unknown[]) => mockPrepare(...args),
}));

jest.mock("../../../src/hooks/useKeepAwakeWhile", () => ({
  useKeepAwakeWhile: jest.fn(),
}));

// The estimate helper lives in the Free-mode hook, whose import graph pulls
// the store runtime; the job only needs the number.
jest.mock("../../../src/screens/main/useFreeOfflineMode", () => ({
  estimatePreparationSeconds: jest.fn(() => 120),
}));

const t = ((key: string, values?: Record<string, string | number>) =>
  values ? `${key}:${JSON.stringify(values)}` : key) as TranslateFn;

function renderJob(settings = DEFAULT_SETTINGS) {
  const onOutcome = jest.fn();
  const updateSettings = jest.fn();
  const rendered = renderHook(() =>
    useAutoSetupJob({
      onOutcome,
      settings,
      t,
      updateSettings,
    }),
  );
  return { onOutcome, rendered, updateSettings };
}

describe("useAutoSetupJob", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockSelect.mockReset().mockReturnValue({
      status: "ready",
      profile: { llm: llmModel, stt: sttModel, languages: ["en"] },
    });
    mockPrepare.mockReset().mockResolvedValue(undefined);
    mockGetBenchmarks.mockReset().mockResolvedValue({});
    mockGetInstallStatuses.mockReset().mockResolvedValue({});
    mockEvaluateReadiness.mockReset().mockReturnValue({ ready: false });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("rests on the offer and installs nothing by itself", () => {
    const { rendered } = renderJob();

    expect(rendered.result.current.state).toBe("offer");
    act(() => rendered.result.current.install());
    expect(rendered.result.current.state).toBe("offer");
    expect(mockPrepare).not.toHaveBeenCalled();
  });

  it("restores a persisted complete setup as ready after revalidating it", async () => {
    mockGetInstallStatuses.mockResolvedValue({
      [llmModel.id]: { installed: true, path: "/models/qwen", verified: true },
      [sttModel.id]: {
        installed: true,
        path: "/models/whisper",
        verified: true,
      },
    });
    mockEvaluateReadiness.mockReturnValue({ ready: true });
    const { rendered } = renderJob({
      ...DEFAULT_SETTINGS,
      freeOfflineSetupCompleted: true,
    });

    expect(rendered.result.current.state).toBe("scanning");
    await act(async () => {
      jest.advanceTimersByTime(1_000);
    });
    await act(async () => {
      jest.advanceTimersByTime(4_000);
    });

    expect(mockEvaluateReadiness).toHaveBeenCalledTimes(1);
    expect(rendered.result.current.state).toBe("done");
    expect(rendered.result.current.downloadBytes).toBe(0);
  });

  it("repairs a legacy local route that was saved before its completion marker", async () => {
    mockGetInstallStatuses.mockResolvedValue({
      [llmModel.id]: { installed: true, path: "/models/qwen", verified: true },
      [sttModel.id]: {
        installed: true,
        path: "/models/whisper",
        verified: true,
      },
    });
    mockEvaluateReadiness.mockReturnValue({ ready: true });
    const { rendered } = renderJob({
      ...DEFAULT_SETTINGS,
      activeResponseMode: "free-local",
      responseModes: [
        {
          id: "free-local",
          route: {
            runtime: "local",
            localModelId: "qwen3-0.6b-q8",
            provider: "openai",
            model: "Qwen3 0.6B",
          },
        },
      ],
    });

    await act(async () => {
      jest.advanceTimersByTime(1_000);
    });
    await act(async () => {
      jest.advanceTimersByTime(4_000);
    });

    expect(mockEvaluateReadiness).toHaveBeenCalledTimes(1);
    expect(rendered.result.current.state).toBe("done");
  });

  it("reveals the device facts one at a time and settles on the proposal", async () => {
    const { rendered } = renderJob();

    act(() => rendered.result.current.start());
    expect(rendered.result.current.state).toBe("scanning");
    expect(rendered.result.current.scanned).toBe(0);

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(rendered.result.current.scanned).toBeGreaterThanOrEqual(1);
    expect(rendered.result.current.scanned).toBeLessThan(4);
    // The readings must exist while the reveal runs — the snapshot lands
    // before the settle, not with the verdict.
    expect(rendered.result.current.facts.length).toBeGreaterThan(0);

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    // The verdict never lands before the reveal has finished, and nothing has
    // been downloaded yet.
    expect(rendered.result.current.state).toBe("proposal");
    expect(rendered.result.current.plan.map((item) => item.role)).toEqual([
      "think",
      "listen",
      "speak",
    ]);
    expect(mockPrepare).not.toHaveBeenCalled();
  });

  it("routes a jobless capability to the device's own voice", async () => {
    mockSelect.mockReturnValue({
      status: "ready",
      profile: { llm: llmModel, stt: sttModel, languages: ["en"] },
    });
    const { rendered } = renderJob();

    act(() => rendered.result.current.start());
    // Two stages: the settle timer only registers once the probes resolve.
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    await act(async () => {
      jest.advanceTimersByTime(4000);
    });

    const speak = rendered.result.current.plan.find(
      (item) => item.role === "speak",
    );
    expect(speak?.model).toBeUndefined();
    expect(speak?.name).toBe("systemVoice");
  });

  it("installs after the proposal, applies the profile, and reports done once", async () => {
    const { onOutcome, rendered, updateSettings } = renderJob();

    act(() => rendered.result.current.start());
    // Two stages: the settle timer only registers once the probes resolve.
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    await act(async () => {
      jest.advanceTimersByTime(4000);
    });
    expect(rendered.result.current.state).toBe("proposal");

    await act(async () => {
      rendered.result.current.install();
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(mockPrepare).toHaveBeenCalledTimes(1);
    expect(rendered.result.current.state).toBe("done");
    expect(onOutcome).toHaveBeenCalledTimes(1);
    expect(onOutcome).toHaveBeenCalledWith("done");
    // Applied while preserving configured provider modes — reversible, like
    // Free setup.
    const applied = updateSettings.mock.calls[0][0];
    expect(applied.freeOfflineSetupCompleted).toBe(true);
    expect(
      applied.responseModes.some(
        (mode: { route: { runtime?: string } }) =>
          mode.route.runtime === "local",
      ),
    ).toBe(true);
    expect(
      applied.responseModes.filter(
        (mode: { route: { runtime?: string } }) =>
          mode.route.runtime !== "local",
      ).length,
    ).toBe(DEFAULT_SETTINGS.responseModes.length);
  });

  it("keeps what finished on a failure and resumes on retry", async () => {
    mockPrepare.mockRejectedValueOnce(new Error("network dropped"));
    const { onOutcome, rendered } = renderJob();

    act(() => rendered.result.current.start());
    // Two stages: the settle timer only registers once the probes resolve.
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    await act(async () => {
      jest.advanceTimersByTime(4000);
    });
    await act(async () => {
      rendered.result.current.install();
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(rendered.result.current.state).toBe("failed");
    expect(onOutcome).toHaveBeenCalledWith("failed");

    // Retry resumes the queue: prepareOfflineProfile itself skips verified
    // models, so the job simply runs it again with the same profile.
    await act(async () => {
      rendered.result.current.retry();
    });
    await act(async () => {
      await Promise.resolve();
    });
    expect(mockPrepare).toHaveBeenCalledTimes(2);
    expect(mockPrepare.mock.calls[1][0]).toBe(mockPrepare.mock.calls[0][0]);
    expect(rendered.result.current.state).toBe("done");
  });

  it("rescans for a fallback after this phone rejects the proposed model", async () => {
    const fallbackModel = {
      ...llmModel,
      id: "qwen3.5-0.8b-q8",
      name: "Qwen 3.5 0.8B",
    };
    mockSelect
      .mockReturnValueOnce({
        status: "ready",
        profile: { llm: llmModel, stt: sttModel, languages: ["en"] },
      })
      .mockReturnValueOnce({
        status: "ready",
        profile: { llm: fallbackModel, stt: sttModel, languages: ["en"] },
      });
    const failedBenchmark = {
      modelId: llmModel.id,
      catalogVersion: 2,
      testedAt: "2026-08-10T00:01:00.000Z",
      status: "failed",
      loadMs: 0,
      durationMs: 25,
      measuredUnderPressure: false,
      device: snapshot,
    };
    mockPrepare.mockImplementationOnce(
      async (
        _profile: unknown,
        options?: {
          onProgress?: (progress: {
            modelId: string;
            stepIndex: number;
            stepCount: number;
            stepsRemaining: number;
            action: "benchmarking";
            stepProgress: null;
          }) => void;
        },
      ) => {
        options?.onProgress?.({
          modelId: llmModel.id,
          stepIndex: 2,
          stepCount: 4,
          stepsRemaining: 2,
          action: "benchmarking",
          stepProgress: null,
        });
        mockGetBenchmarks.mockResolvedValue({
          [llmModel.id]: failedBenchmark,
        });
        throw new Error("Failed to load model");
      },
    );
    mockGetInstallStatuses.mockResolvedValue({
      [llmModel.id]: { installed: true, path: "/models/llm", verified: true },
      [sttModel.id]: { installed: true, path: "/models/stt", verified: true },
    });
    const { rendered } = renderJob();

    act(() => rendered.result.current.start());
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    await act(async () => {
      jest.advanceTimersByTime(4000);
    });
    await act(async () => {
      rendered.result.current.install();
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(rendered.result.current.state).toBe("failed");
    expect(rendered.result.current.errorDetail).toBe("onDeviceTestFailed");
    expect(rendered.result.current.plan[0]).toMatchObject({
      failed: true,
      installed: true,
    });

    act(() => rendered.result.current.retry());
    expect(rendered.result.current.state).toBe("scanning");
    expect(mockPrepare).toHaveBeenCalledTimes(1);
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    await act(async () => {
      jest.advanceTimersByTime(4000);
    });

    expect(rendered.result.current.state).toBe("proposal");
    expect(rendered.result.current.plan[0].model?.id).toBe(fallbackModel.id);
    expect(mockSelect).toHaveBeenCalledTimes(2);
  });

  it("fails the scan honestly when nothing can run on this phone", async () => {
    mockSelect.mockReturnValue({ status: "unavailable", reason: "memory" });
    const { rendered } = renderJob();

    act(() => rendered.result.current.start());
    // Two stages: the settle timer only registers once the probes resolve.
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    await act(async () => {
      jest.advanceTimersByTime(4000);
    });

    expect(rendered.result.current.state).toBe("failed");
    // A failed scan is not a failed install: no plan was ever shown, so the
    // card must not say a download stopped.
    expect(rendered.result.current.errorKind).toBe("scan");
    expect(mockPrepare).not.toHaveBeenCalled();
  });
});
