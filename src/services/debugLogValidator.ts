export interface ValidatableDebugLogEntry {
  event: string;
  payload?: Record<string, unknown>;
  sequence: number;
}

export interface DebugLogValidationIssue {
  code:
    | "capture-truncated"
    | "missing-network-terminal"
    | "missing-picker-presentation"
    | "missing-pipeline-terminal"
    | "sequence-gap";
  reference?: string;
}

function stringPayload(entry: ValidatableDebugLogEntry, key: string) {
  const value = entry.payload?.[key];
  return typeof value === "string" ? value : null;
}

export function validateDebugLogEntries(
  entries: readonly ValidatableDebugLogEntry[],
): DebugLogValidationIssue[] {
  const issues: DebugLogValidationIssue[] = [];
  const pendingNetworkRequests = new Set<string>();
  const pendingPickers = new Set<string>();
  const openPipelineTurnIds = new Set<string>();

  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    if (index > 0 && entry.sequence !== entries[index - 1].sequence + 1) {
      issues.push({ code: "sequence-gap", reference: String(entry.sequence) });
    }
    if (entry.event === "capture-limit-reached") {
      issues.push({ code: "capture-truncated" });
    }

    const requestId = stringPayload(entry, "requestId");
    if (entry.event === "network-request-started" && requestId) {
      pendingNetworkRequests.add(requestId);
    }
    if (
      (entry.event === "network-request-completed" ||
        entry.event === "network-request-failed") &&
      requestId
    ) {
      pendingNetworkRequests.delete(requestId);
    }

    const controlId = stringPayload(entry, "controlId");
    if (entry.event === "settings-picker-open-requested" && controlId) {
      pendingPickers.add(controlId);
    }
    if (entry.event === "settings-picker-presented" && controlId) {
      pendingPickers.delete(controlId);
    }

    if (entry.event === "voice-pipeline-run-start") {
      openPipelineTurnIds.add(stringPayload(entry, "turnId") ?? "unknown");
    }
    if (
      entry.event === "voice-pipeline-run-complete" ||
      entry.event === "voice-pipeline-run-failed" ||
      entry.event === "voice-pipeline-aborted"
    ) {
      openPipelineTurnIds.delete(stringPayload(entry, "turnId") ?? "unknown");
    }
  }

  pendingNetworkRequests.forEach((requestId) =>
    issues.push({ code: "missing-network-terminal", reference: requestId }),
  );
  pendingPickers.forEach((controlId) =>
    issues.push({ code: "missing-picker-presentation", reference: controlId }),
  );
  openPipelineTurnIds.forEach((turnId) => {
    issues.push({
      code: "missing-pipeline-terminal",
      reference: turnId,
    });
  });
  return issues;
}
