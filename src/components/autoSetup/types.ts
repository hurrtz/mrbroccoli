import type {
  LocalModelDefinition,
  LocalModelId,
} from "../../constants/localModels";
import type {
  LocalDeviceSnapshot,
  LocalModelBenchmarkResult,
} from "../../services/localDeviceCapabilities";

export type AutoSetupPhase =
  "offer" | "scanning" | "proposal" | "installing" | "done" | "failed";

export interface AutoSetupJobPlanItem {
  role: "think" | "listen" | "speak";
  roleLabel: string;
  model?: LocalModelDefinition;
  /** Display name for a job routed to the device's own recognizer or voice. */
  name?: string;
  active: boolean;
  installed: boolean;
  failed: boolean;
}

export interface AutoSetupStepReading {
  label: string;
  stepLabel?: string;
  remaining?: string;
}

/**
 * The automatic setup job as its three surfaces see it: the introduction's
 * auto step, the App & diagnostics setup section, and the home-screen task bar
 * are all views of this one state, which lives above every screen that shows
 * it.
 */
export interface AutoSetupJobState {
  state: AutoSetupPhase;
  /** Bytes still needed for the proposed profile; zero means testing only. */
  downloadBytes: number;
  /** 0–1 across the whole install queue. */
  fraction: number;
  /** How many device facts have been revealed so far. */
  scanned: number;
  facts: { label: string; value: string }[];
  plan: AutoSetupJobPlanItem[];
  benchmarks: Partial<Record<LocalModelId, LocalModelBenchmarkResult>>;
  snapshot: LocalDeviceSnapshot | null;
  totalSizeLabel: string;
  reading: AutoSetupStepReading | null;
  /**
   * What failed: the scan (nothing fits or the measurement broke — no plan
   * exists) or the install (a seen plan stopped part-way). The two need
   * different words and different retries.
   */
  errorKind: "scan" | "install" | null;
  errorDetail: string | null;
  running: boolean;
  start: () => void;
  install: () => void;
  retry: () => void;
}
