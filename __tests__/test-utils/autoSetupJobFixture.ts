import type { AutoSetupJobState } from "../../src/components/autoSetup/types";

/** A resting automatic-setup job for suites that only mount its surfaces. */
export function createAutoSetupJob(
  overrides: Partial<AutoSetupJobState> = {},
): AutoSetupJobState {
  return {
    state: "offer",
    fraction: 0,
    scanned: 0,
    facts: [],
    plan: [],
    benchmarks: {},
    snapshot: null,
    totalSizeLabel: "0 MB",
    reading: null,
    errorKind: null,
    errorDetail: null,
    running: false,
    start: jest.fn(),
    install: jest.fn(),
    retry: jest.fn(),
    finish: jest.fn(),
    ...overrides,
  };
}
