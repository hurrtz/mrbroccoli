import { readSafeProviderErrorMessage } from "./providerErrors";

const MISTRAL_VOICES_ENDPOINT = "https://api.mistral.ai/v1/audio/voices";
const MISTRAL_VOICES_PAGE_SIZE = 10;
const MISTRAL_VOICES_MAX_PAGES = 10;
const MISTRAL_VOICES_TIMEOUT_MS = 15000;

export interface MistralVoice {
  id: string;
  name: string;
  slug: string | null;
  value: string;
  label: string;
  languages: string[];
  gender: string | null;
  isCustom: boolean;
}

export type MistralVoiceDirectoryStatus =
  | "idle"
  | "loading"
  | "refreshing"
  | "ready"
  | "error";

export class MistralVoiceDirectoryError extends Error {
  readonly status: number | null;

  constructor(message: string, status: number | null = null) {
    super(message);
    this.name = "MistralVoiceDirectoryError";
    this.status = status;
  }
}

function toTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseLanguages(value: unknown) {
  return Array.isArray(value)
    ? value
        .map(toTrimmedString)
        .filter((language): language is string => Boolean(language))
    : [];
}

function parseMistralVoice(value: unknown): MistralVoice | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const entry = value as Record<string, unknown>;
  const id = toTrimmedString(entry.id);
  const slug = toTrimmedString(entry.slug) || null;
  const voiceValue = slug || id;

  if (!voiceValue) {
    return null;
  }

  const name = toTrimmedString(entry.name) || voiceValue;

  return {
    id: id || voiceValue,
    name,
    slug,
    value: voiceValue,
    label: name === voiceValue ? name : `${name} · ${voiceValue}`,
    languages: parseLanguages(entry.languages),
    gender: toTrimmedString(entry.gender) || null,
    isCustom: Boolean(toTrimmedString(entry.user_id)),
  };
}

function parsePositiveNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

async function fetchMistralVoicePage(params: {
  apiKey: string;
  offset: number;
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
  }, MISTRAL_VOICES_TIMEOUT_MS);

  try {
    const query = new URLSearchParams({
      limit: String(MISTRAL_VOICES_PAGE_SIZE),
      offset: String(params.offset),
      type: "all",
    });
    const response = await fetch(`${MISTRAL_VOICES_ENDPOINT}?${query}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${params.apiKey}`,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      const detail = await readSafeProviderErrorMessage(response);

      throw new MistralVoiceDirectoryError(
        detail ||
          `Mistral voice directory request failed with status ${response.status}.`,
        response.status,
      );
    }

    const responsePayload: unknown = await response.json();
    const payload =
      responsePayload && typeof responsePayload === "object"
        ? (responsePayload as Record<string, unknown>)
        : {};
    const rawItems = Array.isArray(payload.items) ? payload.items : [];

    return {
      items: rawItems
        .map(parseMistralVoice)
        .filter((voice): voice is MistralVoice => voice !== null),
      rawItemCount: rawItems.length,
      total: parsePositiveNumber(payload.total),
    };
  } catch (error) {
    if (didTimeout) {
      throw new MistralVoiceDirectoryError(
        "Mistral voice directory request timed out.",
      );
    }

    if (params.signal?.aborted) {
      const abortError = new Error("Mistral voice directory request aborted.");
      abortError.name = "AbortError";
      throw abortError;
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
    params.signal?.removeEventListener("abort", handleAbort);
  }
}

export async function fetchMistralVoices(params: {
  apiKey: string;
  signal?: AbortSignal;
}) {
  const apiKey = params.apiKey.trim();

  if (!apiKey) {
    throw new MistralVoiceDirectoryError(
      "A Mistral API key is required to load voices.",
    );
  }

  const voices = new Map<string, MistralVoice>();
  let offset = 0;

  for (let page = 0; page < MISTRAL_VOICES_MAX_PAGES; page += 1) {
    const result = await fetchMistralVoicePage({
      apiKey,
      offset,
      signal: params.signal,
    });

    for (const voice of result.items) {
      voices.set(voice.value, voice);
    }

    offset += result.rawItemCount;

    if (
      result.rawItemCount === 0 ||
      (result.total !== null
        ? offset >= result.total
        : result.rawItemCount < MISTRAL_VOICES_PAGE_SIZE)
    ) {
      break;
    }
  }

  return [...voices.values()].sort((left, right) =>
    left.name.localeCompare(right.name, undefined, { sensitivity: "base" }),
  );
}
