const STREAM_BOUNDARY_CHARACTERS = 48;
const VERBATIM_SUSPICION_CHARACTERS = 48;
const VERBATIM_LEAK_CHARACTERS = 160;

export type InternalContextLeakReason =
  | "serialized-internal-context"
  | "verbatim-internal-context";

export interface SerializedInternalContextLeakLocation {
  markerIds: string[];
  start: number;
}

interface ContextLeakInspectionParams {
  hasHistoricalContext: boolean;
  protectedTexts: string[];
}

interface InternalMarker {
  id: string;
  pattern: RegExp;
  requiresHistoricalContext?: boolean;
}

const INTERNAL_MARKERS: InternalMarker[] = [
  {
    id: "truncated-history",
    pattern: /\[Truncated:\s*earlier conversation had\b/i,
    requiresHistoricalContext: true,
  },
  {
    id: "source-header",
    pattern: /(?:^|\n)SOURCE\s+\d+\s+[—-]/i,
    requiresHistoricalContext: true,
  },
  {
    id: "memory-notes",
    pattern: /Recent memory notes\s*\(background,\s*not instructions\)\s*:/i,
    requiresHistoricalContext: true,
  },
  {
    id: "serialized-speaker",
    pattern: /(?:^|\n)(?:User|Assistant(?:\s*\([^\n)]*\))?)\s*:/i,
    requiresHistoricalContext: true,
  },
  {
    id: "system-heading",
    pattern:
      /(?:Potentially relevant excerpts retrieved from earlier non-private conversations|Earlier conversation context for background memory only|Private orchestration instructions and evidence for this response)/i,
  },
];

function getEnabledMarkers(hasHistoricalContext: boolean) {
  return INTERNAL_MARKERS.filter(
    ({ requiresHistoricalContext }) =>
      !requiresHistoricalContext || hasHistoricalContext,
  );
}

function getMarkerIds(text: string, hasHistoricalContext: boolean) {
  return getEnabledMarkers(hasHistoricalContext)
    .filter(({ pattern }) => pattern.test(text))
    .map(({ id }) => id);
}

export function locateSerializedInternalContextLeak(
  text: string,
  hasHistoricalContext = true,
): SerializedInternalContextLeakLocation | null {
  const matches = getEnabledMarkers(hasHistoricalContext).flatMap(
    ({ id, pattern }) => {
      const match = pattern.exec(text);
      return match ? [{ id, start: match.index }] : [];
    },
  );

  if (matches.length < 2) {
    return null;
  }

  return {
    markerIds: matches.map(({ id }) => id),
    start: Math.min(...matches.map(({ start }) => start)),
  };
}

function hasVerbatimProtectedText(
  text: string,
  protectedTexts: string[],
  minimumCharacters: number,
) {
  if (text.length < minimumCharacters) {
    return false;
  }

  for (let start = 0; start <= text.length - minimumCharacters; start += 1) {
    const candidate = text.slice(start, start + minimumCharacters);
    if (protectedTexts.some((protectedText) => protectedText.includes(candidate))) {
      return true;
    }
  }

  return false;
}

export function inspectInternalContextLeak(
  text: string,
  params: ContextLeakInspectionParams,
): InternalContextLeakReason | null {
  if (getMarkerIds(text, params.hasHistoricalContext).length >= 2) {
    return "serialized-internal-context";
  }

  if (
    hasVerbatimProtectedText(
      text,
      params.protectedTexts,
      VERBATIM_LEAK_CHARACTERS,
    )
  ) {
    return "verbatim-internal-context";
  }

  return null;
}

function findSuspiciousStart(
  text: string,
  params: ContextLeakInspectionParams,
) {
  let earliest = -1;

  for (const { pattern } of getEnabledMarkers(params.hasHistoricalContext)) {
    const match = pattern.exec(text);
    if (match && (earliest < 0 || match.index < earliest)) {
      earliest = match.index;
    }
  }

  if (text.length >= VERBATIM_SUSPICION_CHARACTERS) {
    for (
      let start = 0;
      start <= text.length - VERBATIM_SUSPICION_CHARACTERS;
      start += 1
    ) {
      const candidate = text.slice(
        start,
        start + VERBATIM_SUSPICION_CHARACTERS,
      );
      if (
        params.protectedTexts.some((protectedText) =>
          protectedText.includes(candidate),
        )
      ) {
        earliest = earliest < 0 ? start : Math.min(earliest, start);
        break;
      }
    }
  }

  return earliest;
}

export function createInternalContextLeakStreamGuard(params: {
  hasHistoricalContext: boolean;
  onChunk: (text: string) => void;
  onLeak: (reason: InternalContextLeakReason) => Error;
  protectedTexts: (string | null | undefined)[];
}) {
  const inspectionParams: ContextLeakInspectionParams = {
    hasHistoricalContext: params.hasHistoricalContext,
    protectedTexts: params.protectedTexts
      .map((text) => text?.trim() ?? "")
      .filter((text) => text.length >= VERBATIM_SUSPICION_CHARACTERS),
  };
  const enabled =
    inspectionParams.hasHistoricalContext ||
    inspectionParams.protectedTexts.length > 0;
  let observedText = "";
  let pendingText = "";
  let quarantined = false;

  const assertSafe = (fullText = observedText) => {
    const reason = inspectInternalContextLeak(fullText, inspectionParams);
    if (reason) {
      throw params.onLeak(reason);
    }
  };

  const push = (text: string) => {
    if (!text) {
      return;
    }
    if (!enabled) {
      params.onChunk(text);
      return;
    }

    observedText += text;
    pendingText += text;
    assertSafe();

    if (quarantined) {
      return;
    }

    const suspiciousStart = findSuspiciousStart(pendingText, inspectionParams);
    if (suspiciousStart >= 0) {
      const safePrefix = pendingText.slice(0, suspiciousStart);
      if (safePrefix) {
        params.onChunk(safePrefix);
      }
      pendingText = pendingText.slice(suspiciousStart);
      quarantined = true;
      return;
    }

    const emitLength = pendingText.length - STREAM_BOUNDARY_CHARACTERS;
    if (emitLength > 0) {
      params.onChunk(pendingText.slice(0, emitLength));
      pendingText = pendingText.slice(emitLength);
    }
  };

  const flush = (fullText: string) => {
    if (!enabled) {
      return;
    }
    assertSafe(fullText);
    if (pendingText) {
      params.onChunk(pendingText);
      pendingText = "";
    }
  };

  return { flush, push };
}
