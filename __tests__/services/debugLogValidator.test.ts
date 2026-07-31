import { validateDebugLogEntries } from "../../src/services/debugLogValidator";

describe("validateDebugLogEntries", () => {
  it("reports sequence gaps and unfinished correlated operations", () => {
    const issues = validateDebugLogEntries([
      {
        sequence: 1,
        event: "network-request-started",
        payload: { requestId: "network-1" },
      },
      {
        sequence: 3,
        event: "settings-picker-open-requested",
        payload: { controlId: "model-picker" },
      },
      {
        sequence: 4,
        event: "voice-pipeline-run-start",
        payload: { turnId: "turn-1" },
      },
    ]);

    expect(issues).toEqual(
      expect.arrayContaining([
        { code: "sequence-gap", reference: "3" },
        { code: "missing-network-terminal", reference: "network-1" },
        { code: "missing-picker-presentation", reference: "model-picker" },
        { code: "missing-pipeline-terminal", reference: "turn-1" },
      ]),
    );
  });

  it("accepts complete request and picker lifecycles", () => {
    expect(
      validateDebugLogEntries([
        {
          sequence: 1,
          event: "network-request-started",
          payload: { requestId: "network-1" },
        },
        {
          sequence: 2,
          event: "network-request-completed",
          payload: { requestId: "network-1" },
        },
        {
          sequence: 3,
          event: "settings-picker-open-requested",
          payload: { controlId: "model-picker" },
        },
        {
          sequence: 4,
          event: "settings-picker-presented",
          payload: { controlId: "model-picker" },
        },
      ]),
    ).toEqual([]);
  });

  it("tracks overlapping turns independently", () => {
    expect(
      validateDebugLogEntries([
        {
          sequence: 1,
          event: "voice-pipeline-run-start",
          payload: { turnId: "turn-1" },
        },
        {
          sequence: 2,
          event: "voice-pipeline-run-start",
          payload: { turnId: "turn-2" },
        },
        {
          sequence: 3,
          event: "voice-pipeline-aborted",
          payload: { turnId: "turn-1" },
        },
        {
          sequence: 4,
          event: "voice-pipeline-run-complete",
          payload: { turnId: "turn-2" },
        },
      ]),
    ).toEqual([]);
  });
});
