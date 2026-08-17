const STREAM_BOUNDARY_CHARACTERS = 48;
const MARKER_BOUNDARY_CHARACTERS = 256;
const OBSERVED_TEXT_BATCH_CHARACTERS = 4_096;
const VERBATIM_SUSPICION_CHARACTERS = 48;
const VERBATIM_LEAK_CHARACTERS = 160;
const ROLLING_HASH_BASE = 257;

export type InternalContextLeakReason =
  "serialized-internal-context" | "verbatim-internal-context";

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
      /(?:Potentially relevant excerpts retrieved from eligible earlier conversations|Earlier conversation context for background memory only|Private orchestration instructions and evidence for this response)/i,
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

function getRollingHashMultiplier(windowLength: number) {
  let multiplier = 1;
  for (let index = 1; index < windowLength; index += 1) {
    multiplier = Math.imul(multiplier, ROLLING_HASH_BASE) >>> 0;
  }
  return multiplier;
}

function addProtectedWindowHashes(
  text: string,
  windowLength: number,
  hashes: Set<number>,
) {
  if (text.length < windowLength) {
    return;
  }

  let hash = 0;
  for (let index = 0; index < windowLength; index += 1) {
    hash = (Math.imul(hash, ROLLING_HASH_BASE) + text.charCodeAt(index)) >>> 0;
  }
  hashes.add(hash);

  const outgoingMultiplier = getRollingHashMultiplier(windowLength);
  for (let index = windowLength; index < text.length; index += 1) {
    const outgoing = text.charCodeAt(index - windowLength);
    hash =
      (Math.imul(
        (hash - Math.imul(outgoing, outgoingMultiplier)) >>> 0,
        ROLLING_HASH_BASE,
      ) +
        text.charCodeAt(index)) >>>
      0;
    hashes.add(hash);
  }
}

class ProtectedTextWindowMatcher {
  private readonly characters: Uint16Array;
  private readonly hashes = new Set<number>();
  private readonly outgoingMultiplier: number;
  private count = 0;
  private hash = 0;
  private nextIndex = 0;
  private totalCharacters = 0;

  constructor(
    private readonly protectedTexts: string[],
    private readonly windowLength: number,
  ) {
    this.characters = new Uint16Array(windowLength);
    this.outgoingMultiplier = getRollingHashMultiplier(windowLength);
    for (const text of protectedTexts) {
      addProtectedWindowHashes(text, windowLength, this.hashes);
    }
  }

  get matchStart() {
    return this.totalCharacters - this.windowLength;
  }

  private currentWindow() {
    const characters = new Array<number>(this.windowLength);
    for (let index = 0; index < this.windowLength; index += 1) {
      characters[index] =
        this.characters[(this.nextIndex + index) % this.windowLength];
    }
    return String.fromCharCode(...characters);
  }

  push(character: number) {
    if (this.count < this.windowLength) {
      this.characters[this.nextIndex] = character;
      this.nextIndex = (this.nextIndex + 1) % this.windowLength;
      this.count += 1;
      this.hash = (Math.imul(this.hash, ROLLING_HASH_BASE) + character) >>> 0;
    } else {
      const outgoing = this.characters[this.nextIndex];
      this.characters[this.nextIndex] = character;
      this.nextIndex = (this.nextIndex + 1) % this.windowLength;
      this.hash =
        (Math.imul(
          (this.hash - Math.imul(outgoing, this.outgoingMultiplier)) >>> 0,
          ROLLING_HASH_BASE,
        ) +
          character) >>>
        0;
    }
    this.totalCharacters += 1;

    if (this.count < this.windowLength || !this.hashes.has(this.hash)) {
      return false;
    }

    const candidate = this.currentWindow();
    return this.protectedTexts.some((text) => text.includes(candidate));
  }
}

function createProtectedTextWindowMatcher(
  protectedTexts: string[],
  windowLength: number,
) {
  return protectedTexts.some((text) => text.length >= windowLength)
    ? new ProtectedTextWindowMatcher(protectedTexts, windowLength)
    : null;
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
  const matcher = createProtectedTextWindowMatcher(
    protectedTexts,
    minimumCharacters,
  );
  if (!matcher) {
    return false;
  }

  for (let index = 0; index < text.length; index += 1) {
    if (matcher.push(text.charCodeAt(index))) {
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
  const suspiciousTextMatcher = createProtectedTextWindowMatcher(
    inspectionParams.protectedTexts,
    VERBATIM_SUSPICION_CHARACTERS,
  );
  const leakedTextMatcher = createProtectedTextWindowMatcher(
    inspectionParams.protectedTexts,
    VERBATIM_LEAK_CHARACTERS,
  );
  const markerIds = new Set<string>();
  const observedChunks: string[] = [];
  let observedBuffer = "";
  let observedLength = 0;
  let markerTail = "";
  let pendingText = "";
  let pendingStart = 0;
  let quarantined = false;

  const inspectMarkers = (text: string, textStart: number) => {
    const markerWindowStart = textStart - markerTail.length;
    const prefix = markerWindowStart > 0 ? "x" : "";
    const markerWindow = `${prefix}${markerTail}${text}`;
    let earliest = -1;

    for (const { id, pattern } of getEnabledMarkers(
      inspectionParams.hasHistoricalContext,
    )) {
      if (markerIds.has(id)) {
        continue;
      }
      const match = pattern.exec(markerWindow);
      if (!match) {
        continue;
      }

      markerIds.add(id);
      const absoluteStart = markerWindowStart + match.index - prefix.length;
      earliest =
        earliest < 0 ? absoluteStart : Math.min(earliest, absoluteStart);
    }

    markerTail = markerWindow
      .slice(prefix.length)
      .slice(-MARKER_BOUNDARY_CHARACTERS);
    return earliest;
  };

  const inspectStreamText = (text: string, textStart: number) => {
    let suspiciousStart = inspectMarkers(text, textStart);
    if (markerIds.size >= 2) {
      throw params.onLeak("serialized-internal-context");
    }

    for (let index = 0; index < text.length; index += 1) {
      const character = text.charCodeAt(index);
      if (suspiciousTextMatcher?.push(character)) {
        const start = suspiciousTextMatcher.matchStart;
        suspiciousStart =
          suspiciousStart < 0 ? start : Math.min(suspiciousStart, start);
      }
      if (leakedTextMatcher?.push(character)) {
        throw params.onLeak("verbatim-internal-context");
      }
    }

    return suspiciousStart;
  };

  const push = (text: string) => {
    if (!text) {
      return;
    }
    if (!enabled) {
      params.onChunk(text);
      return;
    }

    const textStart = observedLength;
    observedBuffer += text;
    if (observedBuffer.length >= OBSERVED_TEXT_BATCH_CHARACTERS) {
      observedChunks.push(observedBuffer);
      observedBuffer = "";
    }
    observedLength += text.length;
    pendingText += text;
    const suspiciousStart = inspectStreamText(text, textStart);

    if (quarantined) {
      return;
    }

    if (suspiciousStart >= 0) {
      const quarantineStart = Math.max(suspiciousStart, pendingStart);
      const safeLength = quarantineStart - pendingStart;
      const safePrefix = pendingText.slice(0, safeLength);
      if (safePrefix) {
        params.onChunk(safePrefix);
      }
      pendingText = pendingText.slice(safeLength);
      pendingStart = quarantineStart;
      quarantined = true;
      return;
    }

    const emitLength = pendingText.length - STREAM_BOUNDARY_CHARACTERS;
    if (emitLength > 0) {
      params.onChunk(pendingText.slice(0, emitLength));
      pendingText = pendingText.slice(emitLength);
      pendingStart += emitLength;
    }
  };

  const flush = (fullText: string) => {
    if (!enabled) {
      return;
    }
    const observedText = `${observedChunks.join("")}${observedBuffer}`;
    if (observedText !== fullText) {
      const reason = inspectInternalContextLeak(fullText, inspectionParams);
      if (reason) {
        throw params.onLeak(reason);
      }
    }
    if (pendingText) {
      params.onChunk(pendingText);
      pendingText = "";
    }
  };

  return { flush, push };
}
