import * as debugLogCapture from "./debugLogCapture";

type FetchFunction = typeof globalThis.fetch;

let expoFetch: FetchFunction | null = null;

try {
  expoFetch = require("expo/fetch").fetch as FetchFunction;
} catch {
  expoFetch = null;
}

function nextNetworkRequestId() {
  return `network-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getSafeEndpoint(input: Parameters<FetchFunction>[0] | URL) {
  const raw =
    input instanceof URL
      ? input.toString()
      : typeof input === "string"
        ? input
        : input.url;
  try {
    const url = new URL(raw);
    const route = url.pathname
      .split("/")
      .filter(Boolean)
      .slice(0, 3)
      .map((segment) =>
        segment.length > 32 || /\d{4,}/.test(segment) ? ":id" : segment,
      )
      .join("/");
    return { host: url.hostname, route: `/${route}` };
  } catch {
    return { host: "invalid-url", route: "/" };
  }
}

export async function networkFetch(
  input: Parameters<FetchFunction>[0] | URL,
  init?: Parameters<FetchFunction>[1],
) {
  const normalizedInput = input instanceof URL ? input.toString() : input;
  const endpoint = getSafeEndpoint(input);
  const method = (init?.method ?? "GET").toUpperCase();
  const requestId = nextNetworkRequestId();
  const startedAtMs = Date.now();
  const turnId =
    debugLogCapture.getDebugTurnIdForSignal?.(init?.signal) ?? null;
  debugLogCapture.recordDebugLogEvent({
    event: "network-request-started",
    payload: { ...endpoint, method, requestId, turnId },
  });

  try {
    const response = await (expoFetch ?? globalThis.fetch)(
      normalizedInput,
      init,
    );
    debugLogCapture.recordDebugLogEvent({
      event: "network-request-completed",
      level: response.ok ? "info" : "warn",
      payload: {
        ...endpoint,
        durationMs: Date.now() - startedAtMs,
        method,
        ok: response.ok,
        requestId,
        status: response.status,
        turnId,
      },
    });
    return response;
  } catch (error) {
    debugLogCapture.recordDebugLogEvent({
      event: "network-request-failed",
      level: "warn",
      payload: {
        ...endpoint,
        aborted: Boolean(init?.signal?.aborted),
        durationMs: Date.now() - startedAtMs,
        error,
        method,
        requestId,
        turnId,
      },
    });
    throw error;
  }
}

/** Keep cancellation and the deadline active until the provider body has been consumed. */
export async function fetchWithDeadline<T>(
  input: RequestInfo | URL,
  init: RequestInit,
  timeoutMs: number,
  onTimeout: () => Error,
  consume: (response: Response) => Promise<T>,
  signal?: AbortSignal,
): Promise<T> {
  const abortError = () => {
    if (signal?.reason instanceof Error) return signal.reason;
    const error = new Error(
      typeof signal?.reason === "string" ? signal.reason : "Aborted",
    );
    error.name = "AbortError";
    return error;
  };
  if (signal?.aborted) throw abortError();

  const controller = new AbortController();
  let rejectInterrupted!: (error: Error) => void;
  const interrupted = new Promise<never>((_, reject) => {
    rejectInterrupted = reject;
  });
  const interrupt = (error: Error) => {
    rejectInterrupted(error);
    controller.abort();
  };
  const handleAbort = () => interrupt(abortError());
  signal?.addEventListener("abort", handleAbort, { once: true });
  const timer = setTimeout(() => interrupt(onTimeout()), timeoutMs);

  try {
    return await Promise.race([
      interrupted,
      networkFetch(input, { ...init, signal: controller.signal }).then(consume),
    ]);
  } catch (error) {
    // Native fetch can abort its own transport before our timer fires.
    if (
      !controller.signal.aborted &&
      error instanceof Error &&
      (error.name === "AbortError" ||
        error.message.toLowerCase().includes("aborted"))
    ) {
      throw onTimeout();
    }
    throw error;
  } finally {
    signal?.removeEventListener("abort", handleAbort);
    clearTimeout(timer);
  }
}
