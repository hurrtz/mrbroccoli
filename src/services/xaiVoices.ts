const XAI_BUILT_IN_VOICES_ENDPOINT = "https://api.x.ai/v1/tts/voices";
const XAI_CUSTOM_VOICES_ENDPOINT = "https://api.x.ai/v1/custom-voices";
const XAI_CUSTOM_VOICES_PAGE_SIZE = 1000;
const XAI_CUSTOM_VOICES_MAX_PAGES = 20;
const XAI_VOICES_TIMEOUT_MS = 15000;

export interface XaiVoice {
  id: string;
  name: string;
  value: string;
  label: string;
  language: string | null;
  accent: string | null;
  gender: string | null;
  tone: string | null;
  description: string | null;
  isCustom: boolean;
}

export class XaiVoiceDirectoryError extends Error {
  readonly status: number | null;

  constructor(message: string, status: number | null = null) {
    super(message);
    this.name = "XaiVoiceDirectoryError";
    this.status = status;
  }
}

function toTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseXaiVoice(value: unknown, isCustom: boolean): XaiVoice | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const entry = value as Record<string, unknown>;
  const id = toTrimmedString(entry.voice_id);

  if (!id) {
    return null;
  }

  const name = toTrimmedString(entry.name) || id;
  const language = toTrimmedString(entry.language) || null;
  const accent = toTrimmedString(entry.accent) || null;
  const gender = toTrimmedString(entry.gender) || null;
  const tone = toTrimmedString(entry.tone) || null;
  const labelDetails = isCustom
    ? ["Custom", accent, tone].filter(Boolean)
    : [];

  return {
    id,
    name,
    value: id,
    label:
      labelDetails.length > 0
        ? `${name} · ${labelDetails.join(" · ")}`
        : name,
    language,
    accent,
    gender,
    tone,
    description: toTrimmedString(entry.description) || null,
    isCustom,
  };
}

async function fetchXaiVoicePayload(params: {
  apiKey: string;
  endpoint: string;
  signal?: AbortSignal;
}) {
  const controller = new AbortController();
  let didTimeout = false;
  const handleAbort = () => controller.abort();

  if (params.signal?.aborted) {
    controller.abort();
  } else {
    params.signal?.addEventListener("abort", handleAbort);
  }

  const timeoutId = setTimeout(() => {
    didTimeout = true;
    controller.abort();
  }, XAI_VOICES_TIMEOUT_MS);

  try {
    const response = await fetch(params.endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${params.apiKey}`,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new XaiVoiceDirectoryError(
        `xAI voice directory request failed with status ${response.status}.`,
        response.status,
      );
    }

    const responsePayload: unknown = await response.json();
    return responsePayload && typeof responsePayload === "object"
      ? (responsePayload as Record<string, unknown>)
      : {};
  } catch (error) {
    if (didTimeout) {
      throw new XaiVoiceDirectoryError(
        "xAI voice directory request timed out.",
      );
    }

    if (params.signal?.aborted) {
      const abortError = new Error("xAI voice directory request aborted.");
      abortError.name = "AbortError";
      throw abortError;
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
    params.signal?.removeEventListener("abort", handleAbort);
  }
}

async function fetchXaiBuiltInVoices(params: {
  apiKey: string;
  signal?: AbortSignal;
}) {
  const payload = await fetchXaiVoicePayload({
    apiKey: params.apiKey,
    endpoint: XAI_BUILT_IN_VOICES_ENDPOINT,
    signal: params.signal,
  });
  const rawVoices = Array.isArray(payload.voices) ? payload.voices : [];

  return rawVoices
    .map((voice) => parseXaiVoice(voice, false))
    .filter((voice): voice is XaiVoice => voice !== null);
}

async function fetchXaiCustomVoices(params: {
  apiKey: string;
  signal?: AbortSignal;
}) {
  const voices: XaiVoice[] = [];
  const seenPageTokens = new Set<string>();
  let paginationToken = "";

  for (let page = 0; page < XAI_CUSTOM_VOICES_MAX_PAGES; page += 1) {
    const query = new URLSearchParams({
      limit: String(XAI_CUSTOM_VOICES_PAGE_SIZE),
    });

    if (paginationToken) {
      query.set("pagination_token", paginationToken);
    }

    const payload = await fetchXaiVoicePayload({
      apiKey: params.apiKey,
      endpoint: `${XAI_CUSTOM_VOICES_ENDPOINT}?${query}`,
      signal: params.signal,
    });
    const rawVoices = Array.isArray(payload.voices) ? payload.voices : [];

    voices.push(
      ...rawVoices
        .map((voice) => parseXaiVoice(voice, true))
        .filter((voice): voice is XaiVoice => voice !== null),
    );

    const nextPageToken = toTrimmedString(payload.pagination_token);

    if (!nextPageToken) {
      break;
    }

    if (seenPageTokens.has(nextPageToken)) {
      throw new XaiVoiceDirectoryError(
        "xAI custom voice directory returned a repeated page token.",
      );
    }

    seenPageTokens.add(nextPageToken);
    paginationToken = nextPageToken;
  }

  return voices;
}

export async function fetchXaiVoices(params: {
  apiKey: string;
  signal?: AbortSignal;
}) {
  const apiKey = params.apiKey.trim();

  if (!apiKey) {
    throw new XaiVoiceDirectoryError(
      "An xAI API key is required to load voices.",
    );
  }

  const builtInVoicesPromise = fetchXaiBuiltInVoices({
    apiKey,
    signal: params.signal,
  });
  const customVoicesPromise = fetchXaiCustomVoices({
    apiKey,
    signal: params.signal,
  }).catch((error) => {
    if (
      params.signal?.aborted ||
      (error instanceof Error && error.name === "AbortError")
    ) {
      throw error;
    }

    // Custom voices can be unavailable for the current plan or region. The
    // standard directory still remains useful and validates the TTS key.
    return [];
  });
  const [builtInVoices, customVoices] = await Promise.all([
    builtInVoicesPromise,
    customVoicesPromise,
  ]);
  const voices = new Map<string, XaiVoice>();

  for (const voice of [...builtInVoices, ...customVoices]) {
    voices.set(voice.value, voice);
  }

  return [...voices.values()].sort((left, right) =>
    left.name.localeCompare(right.name, undefined, { sensitivity: "base" }),
  );
}
