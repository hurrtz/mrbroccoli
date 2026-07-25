import { readSafeProviderErrorMessage } from "./providerErrors";

const ELEVENLABS_VOICES_ENDPOINT = "https://api.elevenlabs.io/v2/voices";
const ELEVENLABS_VOICES_PAGE_SIZE = 100;
const ELEVENLABS_VOICES_MAX_PAGES = 20;
const ELEVENLABS_VOICES_TIMEOUT_MS = 15000;

export interface ElevenLabsVoice {
  id: string;
  name: string;
  value: string;
  label: string;
  category: string | null;
  accent: string | null;
  gender: string | null;
  description: string | null;
  previewUrl: string | null;
}

export class ElevenLabsVoiceDirectoryError extends Error {
  readonly status: number | null;

  constructor(message: string, status: number | null = null) {
    super(message);
    this.name = "ElevenLabsVoiceDirectoryError";
    this.status = status;
  }
}

function toTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseLabels(value: unknown) {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function parseElevenLabsVoice(value: unknown): ElevenLabsVoice | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const entry = value as Record<string, unknown>;
  const id = toTrimmedString(entry.voice_id);

  if (!id) {
    return null;
  }

  const name = toTrimmedString(entry.name) || id;
  const labels = parseLabels(entry.labels);
  const accent = toTrimmedString(labels.accent) || null;
  const gender = toTrimmedString(labels.gender) || null;
  const labelDetails = [accent, gender].filter(Boolean).join(" · ");

  return {
    id,
    name,
    value: id,
    label: labelDetails ? `${name} · ${labelDetails}` : name,
    category: toTrimmedString(entry.category) || null,
    accent,
    gender,
    description: toTrimmedString(entry.description) || null,
    previewUrl: toTrimmedString(entry.preview_url) || null,
  };
}

async function fetchElevenLabsVoicePage(params: {
  apiKey: string;
  nextPageToken?: string;
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
  }, ELEVENLABS_VOICES_TIMEOUT_MS);

  try {
    const query = new URLSearchParams({
      page_size: String(ELEVENLABS_VOICES_PAGE_SIZE),
      sort: "name",
      sort_direction: "asc",
      include_total_count: "false",
    });

    if (params.nextPageToken) {
      query.set("next_page_token", params.nextPageToken);
    }

    const response = await fetch(`${ELEVENLABS_VOICES_ENDPOINT}?${query}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "xi-api-key": params.apiKey,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      const detail = await readSafeProviderErrorMessage(response);

      throw new ElevenLabsVoiceDirectoryError(
        detail ||
          `ElevenLabs voice directory request failed with status ${response.status}.`,
        response.status,
      );
    }

    const responsePayload: unknown = await response.json();
    const payload =
      responsePayload && typeof responsePayload === "object"
        ? (responsePayload as Record<string, unknown>)
        : {};
    const rawVoices = Array.isArray(payload.voices) ? payload.voices : [];

    return {
      voices: rawVoices
        .map(parseElevenLabsVoice)
        .filter((voice): voice is ElevenLabsVoice => voice !== null),
      hasMore: payload.has_more === true,
      nextPageToken: toTrimmedString(payload.next_page_token) || null,
    };
  } catch (error) {
    if (didTimeout) {
      throw new ElevenLabsVoiceDirectoryError(
        "ElevenLabs voice directory request timed out.",
      );
    }

    if (params.signal?.aborted) {
      const abortError = new Error(
        "ElevenLabs voice directory request aborted.",
      );
      abortError.name = "AbortError";
      throw abortError;
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
    params.signal?.removeEventListener("abort", handleAbort);
  }
}

export async function fetchElevenLabsVoices(params: {
  apiKey: string;
  signal?: AbortSignal;
}) {
  const apiKey = params.apiKey.trim();

  if (!apiKey) {
    throw new ElevenLabsVoiceDirectoryError(
      "An ElevenLabs API key is required to load voices.",
    );
  }

  const voices = new Map<string, ElevenLabsVoice>();
  const seenPageTokens = new Set<string>();
  let nextPageToken: string | undefined;

  for (let page = 0; page < ELEVENLABS_VOICES_MAX_PAGES; page += 1) {
    const result = await fetchElevenLabsVoicePage({
      apiKey,
      nextPageToken,
      signal: params.signal,
    });

    for (const voice of result.voices) {
      voices.set(voice.value, voice);
    }

    if (!result.hasMore || !result.nextPageToken) {
      break;
    }

    if (seenPageTokens.has(result.nextPageToken)) {
      throw new ElevenLabsVoiceDirectoryError(
        "ElevenLabs voice directory returned a repeated page token.",
      );
    }

    seenPageTokens.add(result.nextPageToken);
    nextPageToken = result.nextPageToken;
  }

  return [...voices.values()].sort((left, right) =>
    left.name.localeCompare(right.name, undefined, { sensitivity: "base" }),
  );
}
