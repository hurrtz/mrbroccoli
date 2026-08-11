import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  LocalModelDefinition,
  LocalModelId,
} from "../../constants/localModels";
import { isSpeechLanguage } from "../../constants/speechLanguages";
import { useKeepAwakeWhile } from "../../hooks/useKeepAwakeWhile";
import {
  probeLocalDeviceCapabilities,
  getLocalModelBenchmarkResults,
  localModelBenchmarkMatchesDevice,
  type LocalDeviceSnapshot,
  type LocalModelBenchmarkResult,
} from "../../services/localDeviceCapabilities";
import { probeNativeSpeechCapabilities } from "../../services/nativeSpeechCapabilities";
import {
  getOfflineProfileModels,
  selectOfflineProfile,
  applyOfflineProfileToSettings,
  type OfflineProfile,
} from "../../services/offlineProfile";
import {
  getLocalCatalogInstallStatuses,
  getOfflineProfileValidationModels,
  prepareOfflineProfile,
  type OfflinePreparationProgress,
} from "../../services/offlineProfileManager";
import type { Settings } from "../../types";
import { formatBytes } from "../../utils/formatBytes";
import type {
  AutoSetupJobPlanItem,
  AutoSetupJobState,
  AutoSetupPhase,
  AutoSetupStepReading,
} from "../../components/autoSetup/types";
import { estimatePreparationSeconds } from "./useFreeOfflineMode";
import type { TranslateFn } from "./shared";

export type {
  AutoSetupJobPlanItem,
  AutoSetupJobState,
  AutoSetupPhase,
  AutoSetupStepReading,
};

/** The staged reveal: the verdict must not land before the offer is read. */
const FACT_REVEAL_MS = [400, 950, 1500, 2050];
const SCAN_SETTLE_MS = 2500;

function formatRemaining(t: TranslateFn, seconds: number): string {
  if (seconds <= 5) {
    return t("autoSetupAlmostDone");
  }
  if (seconds >= 90) {
    return t("autoSetupMinutesLeft", {
      minutes: Math.round(seconds / 60),
    });
  }
  return t("autoSetupSecondsLeft", {
    seconds: Math.max(5, Math.round(seconds / 5) * 5),
  });
}

/**
 * The automatic on-device setup job. It lives above every screen that shows
 * it — the introduction's auto step, the top of On-device AI settings, and
 * the home-screen task bar are three views of this one state — so leaving a
 * screen never stops the install.
 *
 * Six states in order: offer → scanning → proposal → installing → done or
 * failed. Nothing is downloaded before the proposal has been seen; the
 * install queue skips models that are already verified, so a retry resumes
 * rather than starting over; and every fact shown during the scan is a real
 * device reading.
 */
export function useAutoSetupJob({
  onOutcome,
  settings,
  t,
  updateSettings,
}: {
  /** Fired once per finished install; the host decides whether to toast. */
  onOutcome: (outcome: "done" | "failed") => void;
  settings: Settings;
  t: TranslateFn;
  updateSettings: (settings: Partial<Settings>) => void;
}): AutoSetupJobState {
  const [phase, setPhase] = useState<AutoSetupPhase>("offer");
  const [scanned, setScanned] = useState(0);
  const [snapshot, setSnapshot] = useState<LocalDeviceSnapshot | null>(null);
  const [benchmarks, setBenchmarks] = useState<
    Partial<Record<LocalModelId, LocalModelBenchmarkResult>>
  >({});
  const [profile, setProfile] = useState<OfflineProfile | null>(null);
  const [progress, setProgress] =
    useState<OfflinePreparationProgress | null>(null);
  const [etaSeconds, setEtaSeconds] = useState<number | null>(null);
  const [failedModelId, setFailedModelId] = useState<LocalModelId | null>(
    null,
  );
  const [errorKind, setErrorKind] = useState<"scan" | "install" | null>(null);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [doneModelIds, setDoneModelIds] = useState<Set<LocalModelId>>(
    () => new Set(),
  );
  const abortRef = useRef<AbortController | null>(null);
  const progressRef = useRef<OfflinePreparationProgress | null>(null);
  const revealTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      // The job survives screen changes, not the workspace unmounting: an
      // unfinished download is aborted cleanly rather than orphaned.
      abortRef.current?.abort();
      revealTimersRef.current.forEach(clearTimeout);
    };
  }, []);

  useKeepAwakeWhile(phase === "installing", "mrbroccoli-auto-setup");

  const start = useCallback(() => {
    setPhase("scanning");
    setScanned(0);
    setFailedModelId(null);
    setErrorKind(null);
    setErrorDetail(null);
    setDoneModelIds(new Set());
    progressRef.current = null;
    revealTimersRef.current.forEach(clearTimeout);
    revealTimersRef.current = FACT_REVEAL_MS.map((ms, index) =>
      setTimeout(() => {
        if (mountedRef.current) {
          setScanned(index + 1);
        }
      }, ms),
    );

    void (async () => {
      try {
        const language = isSpeechLanguage(settings.language)
          ? settings.language
          : ("en" as const);
        // The snapshot lands first, so the readings the reveal shows are on
        // screen while the rest of the check still runs.
        const nextSnapshot = await probeLocalDeviceCapabilities();
        if (!mountedRef.current) {
          return;
        }
        setSnapshot(nextSnapshot);
        const [installs, nextBenchmarks] = await Promise.all([
          getLocalCatalogInstallStatuses(),
          getLocalModelBenchmarkResults(),
        ]);
        const [nativeSpeech] = await Promise.all([
          probeNativeSpeechCapabilities(language),
          // The verdict must not land before the user has finished reading.
          new Promise((resolve) => setTimeout(resolve, SCAN_SETTLE_MS)),
        ]);
        if (!mountedRef.current) {
          return;
        }
        const installedModelIds = new Set(
          Object.entries(installs)
            .filter(([, status]) => status?.verified)
            .map(([modelId]) => modelId as LocalModelId),
        );
        const selection = selectOfflineProfile({
          languages: [language],
          snapshot: nextSnapshot,
          installedModelIds,
          benchmarks: nextBenchmarks,
          nativeSttEligible: nativeSpeech.nativeSttEligible,
        });
        setBenchmarks(nextBenchmarks);
        setScanned(FACT_REVEAL_MS.length);
        if (selection.status === "ready") {
          setProfile(selection.profile);
          setPhase("proposal");
        } else {
          setProfile(null);
          setErrorKind("scan");
          setPhase("failed");
        }
      } catch {
        if (mountedRef.current) {
          setErrorKind("scan");
          setPhase("failed");
        }
      }
    })();
  }, [settings.language]);

  const runInstall = useCallback(() => {
    if (!profile) {
      return;
    }
    // Never install without the proposal step: this transition is the only
    // way into installing, and it starts from a seen proposal or a failure
    // of one.
    setPhase("installing");
    setFailedModelId(null);
    setProgress(null);
    setErrorDetail(null);
    progressRef.current = null;
    const abortController = new AbortController();
    abortRef.current = abortController;

    void (async () => {
      try {
        const installs = await getLocalCatalogInstallStatuses();
        const estimated = estimatePreparationSeconds(
          profile,
          installs,
          benchmarks,
          snapshot,
        );
        if (mountedRef.current) {
          setEtaSeconds(estimated);
        }
        await prepareOfflineProfile(profile, {
          abortSignal: abortController.signal,
          onProgress: (nextProgress) => {
            progressRef.current = nextProgress;
            if (!mountedRef.current) {
              return;
            }
            setProgress(nextProgress);
            setDoneModelIds((current) => {
              const next = new Set(current);
              for (const model of getOfflineProfileModels(profile)) {
                if (
                  model.id !== nextProgress.modelId &&
                  nextProgress.stepIndex > 0 &&
                  getOfflineProfileModels(profile).indexOf(model) <
                    getOfflineProfileModels(profile).findIndex(
                      (candidate) => candidate.id === nextProgress.modelId,
                    )
                ) {
                  next.add(model.id);
                }
              }
              return next;
            });
            const completedSteps =
              nextProgress.stepIndex + (nextProgress.stepProgress ?? 0);
            const remainingFraction = Math.max(
              0,
              1 - completedSteps / Math.max(1, nextProgress.stepCount),
            );
            setEtaSeconds(
              remainingFraction === 0
                ? 0
                : Math.max(1, Math.ceil(estimated * remainingFraction)),
            );
          },
        });
        if (!mountedRef.current) {
          return;
        }
        // "Installed and selected": apply the profile while preserving the
        // configured provider modes, exactly as Free setup does — automatic
        // setup must stay reversible.
        const applied = applyOfflineProfileToSettings(settings, profile);
        const preservedProviderModes = settings.responseModes.filter(
          (mode) => mode.route.runtime !== "local",
        );
        updateSettings({
          ...applied,
          responseModes: [
            ...applied.responseModes,
            ...preservedProviderModes.filter(
              (mode) =>
                !applied.responseModes.some(
                  (appliedMode) => appliedMode.id === mode.id,
                ),
            ),
          ],
        });
        setDoneModelIds(
          new Set(getOfflineProfileModels(profile).map((model) => model.id)),
        );
        setPhase("done");
        onOutcome("done");
      } catch (error) {
        if (!mountedRef.current) {
          return;
        }
        if ((error as Error | null)?.name === "AbortError") {
          return;
        }
        const [latestInstalls, latestBenchmarks] = await Promise.all([
          getLocalCatalogInstallStatuses().catch(() => null),
          getLocalModelBenchmarkResults().catch(() => benchmarks),
        ]);
        if (!mountedRef.current) {
          return;
        }
        const failedId = progressModelId(progressRef.current);
        if (latestInstalls) {
          setDoneModelIds(
            new Set(
              getOfflineProfileModels(profile)
                .filter((model) => latestInstalls[model.id]?.verified)
                .map((model) => model.id),
            ),
          );
        }
        setBenchmarks(latestBenchmarks);
        setFailedModelId(failedId);
        setErrorDetail(
          failedId &&
            snapshot &&
            isDurableBenchmarkFailure(
              latestBenchmarks[failedId],
              snapshot,
            )
            ? t("onDeviceTestFailed")
            : null,
        );
        setErrorKind("install");
        setPhase("failed");
        onOutcome("failed");
      }
    })();
  }, [benchmarks, onOutcome, profile, settings, snapshot, t, updateSettings]);

  const install = useCallback(() => {
    if (phase !== "proposal") {
      return;
    }
    runInstall();
  }, [phase, runInstall]);

  const retry = useCallback(() => {
    if (phase !== "failed") {
      return;
    }
    if (!profile) {
      start();
      return;
    }
    if (
      snapshot &&
      getOfflineProfileValidationModels(profile).some((model) =>
        isDurableBenchmarkFailure(benchmarks[model.id], snapshot),
      )
    ) {
      // A retry cannot make a model that this phone already proved unusable
      // fit the same profile. Re-run selection so the persisted benchmark can
      // propose the next viable model, while keeping verified downloads.
      start();
      return;
    }
    runInstall();
  }, [benchmarks, phase, profile, runInstall, snapshot, start]);

  const finish = useCallback(() => {
    setPhase("offer");
    setProgress(null);
    setEtaSeconds(null);
  }, []);

  const facts = useMemo(() => {
    if (!snapshot) {
      return [];
    }
    const entries = [
      {
        label: t("autoSetupFactMemory"),
        value: snapshot.availableMemoryBytes
          ? `${formatBytes(snapshot.physicalMemoryBytes)} · ${formatBytes(snapshot.availableMemoryBytes)}`
          : formatBytes(snapshot.physicalMemoryBytes),
      },
      {
        label: t("autoSetupFactStorage"),
        value: formatBytes(snapshot.freeStorageBytes),
      },
      {
        label: t("autoSetupFactProcessors"),
        value: String(snapshot.processorCount),
      },
      {
        label: t("autoSetupFactSystem"),
        value: `${snapshot.platform === "ios" ? "iOS" : "Android"} ${snapshot.osVersion} · ${snapshot.architecture}`,
      },
    ];
    // Every fact shown must be a real reading — a missing one is dropped
    // rather than replaced with a plausible number.
    return entries.filter((entry) => entry.value.trim().length > 0);
  }, [snapshot, t]);

  const plan = useMemo<AutoSetupJobPlanItem[]>(() => {
    if (!profile) {
      return [];
    }
    const activeModelId =
      phase === "installing" ? (progress?.modelId ?? null) : null;
    const item = (
      role: AutoSetupJobPlanItem["role"],
      roleLabel: string,
      model?: LocalModelDefinition,
      name?: string,
    ): AutoSetupJobPlanItem => ({
      role,
      roleLabel,
      model,
      name,
      active: Boolean(model && model.id === activeModelId),
      installed: Boolean(model && doneModelIds.has(model.id)),
      failed: Boolean(model && model.id === failedModelId),
    });

    return [
      item("think", t("thinking"), profile.llm),
      profile.stt
        ? item("listen", t("listening"), profile.stt)
        : item("listen", t("listening"), undefined, t("appNative")),
      profile.tts
        ? item("speak", t("speaking"), profile.tts)
        : item("speak", t("speaking"), undefined, t("systemVoice")),
    ];
  }, [doneModelIds, failedModelId, phase, profile, progress?.modelId, t]);

  const fraction = useMemo(() => {
    if (phase === "done") {
      return 1;
    }
    if (!progress) {
      return 0;
    }
    return Math.max(
      0,
      Math.min(
        1,
        (progress.stepIndex + (progress.stepProgress ?? 0)) /
          Math.max(1, progress.stepCount),
      ),
    );
  }, [phase, progress]);

  const reading = useMemo<AutoSetupStepReading | null>(() => {
    if (phase !== "installing") {
      return null;
    }
    if (!progress) {
      return { label: t("autoSetupPreparing") };
    }
    const model = profile
      ? getOfflineProfileModels(profile).find(
          (candidate) => candidate.id === progress.modelId,
        )
      : undefined;
    const modelName = model?.name ?? progress.modelId;
    return {
      label:
        progress.action === "downloading"
          ? t("autoSetupDownloadingModel", { model: modelName })
          : t("autoSetupTestingModel", { model: modelName }),
      stepLabel: t("autoSetupStepOf", {
        count: progress.stepCount,
        step: progress.stepIndex + 1,
      }),
      remaining:
        etaSeconds === null ? undefined : formatRemaining(t, etaSeconds),
    };
  }, [etaSeconds, phase, profile, progress, t]);

  const totalSizeLabel = useMemo(() => {
    if (!profile) {
      return formatBytes(0);
    }
    return formatBytes(
      getOfflineProfileModels(profile).reduce(
        (total, model) => total + model.downloadBytes,
        0,
      ),
    );
  }, [profile]);

  return {
    state: phase,
    fraction,
    scanned,
    facts,
    plan,
    benchmarks,
    snapshot,
    totalSizeLabel,
    reading,
    errorKind,
    errorDetail,
    running: phase === "installing",
    start,
    install,
    retry,
    finish,
  };
}

function isDurableBenchmarkFailure(
  benchmark: LocalModelBenchmarkResult | undefined,
  snapshot: LocalDeviceSnapshot,
) {
  return (
    localModelBenchmarkMatchesDevice(benchmark, snapshot) &&
    benchmark?.measuredUnderPressure !== true &&
    (benchmark?.status === "below-target" || benchmark?.status === "failed")
  );
}

function progressModelId(
  progress: OfflinePreparationProgress | null,
): LocalModelId | null {
  return progress?.modelId ?? null;
}
