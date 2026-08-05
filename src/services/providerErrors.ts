import { PROVIDER_LABELS } from "../constants/models";
import { translate } from "../i18n";
import { AppLanguage, Provider } from "../types";

export type ProviderAction = "reply" | "transcription" | "web-search";
export type ProviderFailureKind =
  | "authentication"
  | "capacity"
  | "configuration-unsupported"
  | "context"
  | "credits"
  | "model-unavailable"
  | "network"
  | "quota"
  | "rate-limit"
  | "rejected"
  | "server"
  | "timeout";

export class ProviderRequestError extends Error {
  readonly action: ProviderAction;
  readonly detail: string;
  readonly failureKind: ProviderFailureKind;
  readonly provider: Provider;
  readonly status?: number;

  constructor(params: {
    action: ProviderAction;
    detail?: string;
    failureKind: ProviderFailureKind;
    message: string;
    provider: Provider;
    status?: number;
  }) {
    super(params.message);
    this.name = "ProviderRequestError";
    this.action = params.action;
    this.detail = params.detail ?? "";
    this.failureKind = params.failureKind;
    this.provider = params.provider;
    this.status = params.status;
  }
}

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function extractProviderErrorMessage(errorText: string) {
  const parsed = safeJsonParse(errorText);

  if (!parsed) {
    return errorText.replace(/\s+/g, " ").trim();
  }

  if (typeof parsed === "string") {
    return parsed.trim();
  }

  if (typeof parsed?.error?.message === "string") {
    return parsed.error.message.trim();
  }

  if (typeof parsed?.message === "string") {
    return parsed.message.trim();
  }

  if (typeof parsed?.detail?.message === "string") {
    return parsed.detail.message.trim();
  }

  if (typeof parsed?.detail === "string") {
    return parsed.detail.trim();
  }

  if (Array.isArray(parsed?.errors)) {
    const firstMessage = parsed.errors.find(
      (entry: any) => typeof entry?.message === "string",
    )?.message;

    if (typeof firstMessage === "string") {
      return firstMessage.trim();
    }
  }

  return errorText.replace(/\s+/g, " ").trim();
}

export async function readSafeProviderErrorMessage(response: Response) {
  if (typeof response.text !== "function") {
    return "";
  }

  try {
    const detail = extractProviderErrorMessage(await response.text())
      .replace(/[\u0000-\u001f\u007f]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (
      !detail ||
      detail.startsWith("<") ||
      detail.startsWith("{") ||
      detail.startsWith("[")
    ) {
      return "";
    }

    return detail.length > 280 ? `${detail.slice(0, 279)}…` : detail;
  } catch {
    return "";
  }
}

function getActionLabel(language: AppLanguage, action: ProviderAction) {
  if (action === "reply") {
    return translate(language, "replyGenerationAction");
  }

  if (action === "transcription") {
    return translate(language, "speechTranscriptionAction");
  }

  return translate(language, "webSearchAction");
}

export function isProviderNetworkFailure(error: Error) {
  const normalized = error.message.toLowerCase();

  return (
    normalized.includes("network request failed") ||
    normalized.includes("failed to fetch") ||
    normalized.includes("load failed") ||
    normalized.includes("networkerror")
  );
}

function isAuthenticationFailure(status: number, detail: string) {
  const normalized = detail.toLowerCase();

  return (
    status === 401 ||
    status === 403 ||
    normalized.includes("invalid api key") ||
    normalized.includes("incorrect api key") ||
    normalized.includes("authentication") ||
    normalized.includes("unauthorized") ||
    normalized.includes("forbidden")
  );
}

function isCreditsFailure(status: number, detail: string) {
  const normalized = detail.toLowerCase();

  return (
    status === 402 ||
    normalized.includes("credits remaining") ||
    normalized.includes("credits are required") ||
    normalized.includes("insufficient credits") ||
    normalized.includes("not enough credits") ||
    normalized.includes("credit balance")
  );
}

function isRateLimitFailure(status: number, detail: string) {
  const normalized = detail.toLowerCase();

  return (
    status === 429 ||
    normalized.includes("rate limit") ||
    normalized.includes("too many requests") ||
    normalized.includes("quota")
  );
}

function isQuotaFailure(status: number, detail: string) {
  const normalized = detail.toLowerCase();

  // Per-minute wording marks a self-recovering rate limit, not exhausted
  // account quota, even when providers phrase it with quota vocabulary
  // (e.g. Gemini "resource_exhausted ... requests per minute").
  if (normalized.includes("per minute") || normalized.includes("per min")) {
    return false;
  }

  const explicitQuotaFailure =
    normalized.includes("current quota") ||
    normalized.includes("insufficient_quota") ||
    normalized.includes("quota exhausted") ||
    normalized.includes("quota exceeded") ||
    normalized.includes("exceeded your quota") ||
    normalized.includes("exceeds your quota") ||
    normalized.includes("resource_exhausted") ||
    normalized.includes("spending limit");

  return (
    explicitQuotaFailure ||
    (status === 429 &&
      (normalized.includes("billing") ||
        normalized.includes("check your plan")))
  );
}

function isCapacityFailure(detail: string) {
  const normalized = detail.toLowerCase();

  return (
    normalized.includes("at capacity") ||
    normalized.includes("high demand") ||
    normalized.includes("temporarily overloaded") ||
    normalized.includes("server is overloaded")
  );
}

function isContextTooLongFailure(detail: string) {
  const normalized = detail.toLowerCase();

  return (
    normalized.includes("context length") ||
    normalized.includes("maximum context length") ||
    normalized.includes("too many tokens") ||
    normalized.includes("prompt is too long") ||
    normalized.includes("request too large")
  );
}

function isModelUnavailableFailure(status: number, detail: string) {
  const normalized = detail.toLowerCase();
  const mentionsModel =
    normalized.includes("model") ||
    normalized.includes("deployment") ||
    normalized.includes("engine");
  const unavailable =
    normalized.includes("not found") ||
    normalized.includes("not available") ||
    normalized.includes("unavailable") ||
    normalized.includes("does not exist") ||
    normalized.includes("does not support") ||
    normalized.includes("no longer") ||
    normalized.includes("not supported") ||
    normalized.includes("retired") ||
    normalized.includes("deprecated") ||
    normalized.includes("unsupported");

  return mentionsModel && unavailable && (status === 400 || status === 404);
}

function isConfigurationUnsupportedFailure(status: number, detail: string) {
  if (status !== 400) {
    return false;
  }

  const normalized = detail.toLowerCase();
  const mentionsConfiguration =
    normalized.includes("reasoning_effort") ||
    normalized.includes("reasoning effort") ||
    normalized.includes("thinking level") ||
    normalized.includes("thinking_level") ||
    normalized.includes("effort setting");
  const explicitlyUnsupported =
    normalized.includes("does not support") ||
    normalized.includes("not supported") ||
    normalized.includes("unsupported") ||
    normalized.includes("no longer available");

  return mentionsConfiguration && explicitlyUnsupported;
}

function makeProviderRequestError(params: {
  provider: Provider;
  action: ProviderAction;
  detail: string;
  failureKind: ProviderFailureKind;
  message: string;
  status?: number;
}) {
  return new ProviderRequestError(params);
}

export function classifyProviderHttpFailure(params: {
  action?: ProviderAction;
  errorText: string;
  status: number;
}): ProviderFailureKind {
  return classifyProviderFailure({
    action: params.action ?? "reply",
    detail: extractProviderErrorMessage(params.errorText),
    status: params.status,
  });
}

function classifyProviderFailure(params: {
  action: ProviderAction;
  detail: string;
  status: number;
}): ProviderFailureKind {
  const { action, detail, status } = params;

  if (isCreditsFailure(status, detail)) {
    return "credits";
  }

  if (isQuotaFailure(status, detail)) {
    return "quota";
  }

  if (isAuthenticationFailure(status, detail)) {
    return "authentication";
  }

  if (isModelUnavailableFailure(status, detail)) {
    return "model-unavailable";
  }

  if (isConfigurationUnsupportedFailure(status, detail)) {
    return "configuration-unsupported";
  }

  if (isRateLimitFailure(status, detail)) {
    return "rate-limit";
  }

  if (action === "reply" && isContextTooLongFailure(detail)) {
    return "context";
  }

  if (isCapacityFailure(detail)) {
    return "capacity";
  }

  if (status >= 500) {
    return "server";
  }

  return "rejected";
}

export function buildProviderHttpError(params: {
  provider: Provider;
  language: AppLanguage;
  status: number;
  errorText: string;
  action: ProviderAction;
}) {
  const providerLabel = PROVIDER_LABELS[params.provider];
  const actionLabel = getActionLabel(params.language, params.action);
  const detail = extractProviderErrorMessage(params.errorText);
  const failureKind = classifyProviderFailure({
    action: params.action,
    detail,
    status: params.status,
  });
  let message: string;

  switch (failureKind) {
    case "authentication":
      message = translate(params.language, "providerAuthError", {
        provider: providerLabel,
        action: actionLabel,
      });
      break;
    case "credits":
    case "quota":
      message = translate(params.language, "providerCreditsRequired", {
        provider: providerLabel,
        action: actionLabel,
      });
      break;
    case "rate-limit":
      message = translate(params.language, "providerRateLimitError", {
        provider: providerLabel,
        action: actionLabel,
      });
      break;
    case "context":
      message = translate(params.language, "providerContextTooLong", {
        provider: providerLabel,
      });
      break;
    case "capacity":
    case "configuration-unsupported":
    case "model-unavailable":
    case "server":
      message = translate(params.language, "providerTemporaryError", {
        provider: providerLabel,
        action: actionLabel,
      });
      break;
    case "rejected":
      message = translate(params.language, "providerRequestRejected", {
        provider: providerLabel,
        action: actionLabel,
        detail,
      });
      break;
    default:
      message = translate(params.language, "providerTemporaryError", {
        provider: providerLabel,
        action: actionLabel,
      });
  }

  return makeProviderRequestError({
    provider: params.provider,
    action: params.action,
    detail,
    failureKind,
    status: params.status,
    message,
  });
}

export type PersistableRuntimeOverrideTarget =
  | { kind: "configuration"; effort: string }
  | { kind: "model" };

export function getPersistableRuntimeOverrideTarget(params: {
  effort?: string;
  error: unknown;
  model: string;
}): PersistableRuntimeOverrideTarget | null {
  const providerFailure =
    params.error &&
    typeof params.error === "object" &&
    "failureKind" in params.error &&
    "status" in params.error &&
    "detail" in params.error
      ? (params.error as {
          detail?: unknown;
          failureKind?: unknown;
          status?: unknown;
        })
      : null;

  if (
    !providerFailure ||
    (providerFailure.failureKind !== "model-unavailable" &&
      providerFailure.failureKind !== "configuration-unsupported") ||
    (providerFailure.status !== 400 && providerFailure.status !== 404) ||
    typeof providerFailure.detail !== "string"
  ) {
    return null;
  }

  const detail = providerFailure.detail.toLowerCase();
  const model = params.model.trim().toLowerCase();
  const effort = params.effort?.trim().toLowerCase();
  const explicitlyUnsupported =
    detail.includes("does not exist") ||
    detail.includes("does not support") ||
    detail.includes("not found") ||
    detail.includes("not supported") ||
    detail.includes("unsupported") ||
    detail.includes("no longer available") ||
    detail.includes("retired") ||
    detail.includes("deprecated");
  const referencesModel =
    (model.length > 0 && detail.includes(model)) ||
    detail.includes("this model") ||
    detail.includes("the model");
  const referencesEffort =
    Boolean(effort && detail.includes(effort)) &&
    (detail.includes("reasoning_effort") ||
      detail.includes("reasoning effort") ||
      detail.includes("thinking level") ||
      detail.includes("thinking_level") ||
      detail.includes("effort setting"));

  if (!explicitlyUnsupported) {
    return null;
  }

  if (effort && referencesEffort) {
    return { kind: "configuration", effort };
  }

  return referencesModel ? { kind: "model" } : null;
}

export function normalizeProviderTransportError(params: {
  provider: Provider;
  language: AppLanguage;
  error: unknown;
  action: ProviderAction;
}) {
  if (params.error instanceof Error) {
    if (params.error instanceof ProviderRequestError) {
      return params.error;
    }

    if (isProviderNetworkFailure(params.error)) {
      return new ProviderRequestError({
        provider: params.provider,
        action: params.action,
        detail: params.error.message,
        failureKind: "network",
        message: translate(params.language, "providerNetworkError", {
          provider: PROVIDER_LABELS[params.provider],
          action: getActionLabel(params.language, params.action),
        }),
      });
    }

    return params.error;
  }

  return new Error(String(params.error));
}
