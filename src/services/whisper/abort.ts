export function createAbortError(reason?: unknown) {
  const error =
    reason instanceof Error
      ? reason
      : new Error(typeof reason === "string" ? reason : "Aborted");
  error.name = "AbortError";
  return error;
}

export function throwIfAborted(signal?: AbortSignal) {
  if (!signal?.aborted) {
    return;
  }

  throw createAbortError(signal.reason);
}

export async function waitForDelayOrAbort(
  durationMs: number,
  signal?: AbortSignal,
) {
  if (!signal) {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, durationMs);
    });
    return;
  }

  throwIfAborted(signal);

  await new Promise<void>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      signal.removeEventListener("abort", handleAbort);
      resolve();
    }, durationMs);

    const handleAbort = () => {
      clearTimeout(timeoutId);
      signal.removeEventListener("abort", handleAbort);
      reject(createAbortError(signal.reason));
    };

    signal.addEventListener("abort", handleAbort, { once: true });
  });
}

export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit,
  timeoutMs: number,
  onTimeout: () => Error,
  abortSignal?: AbortSignal,
) {
  throwIfAborted(abortSignal);

  const controller = new AbortController();
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let timedOut = false;
  const handleAbort = () => {
    controller.abort(abortSignal?.reason);
  };
  abortSignal?.addEventListener("abort", handleAbort, { once: true });

  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        timedOut = true;
        controller.abort();
        reject(onTimeout());
      }, timeoutMs);
    });
    const fetchPromise = networkFetch(input, {
      ...init,
      signal: controller.signal,
    }).catch((error) => {
      if (
        error instanceof Error &&
        (error.name === "AbortError" ||
          error.message.toLowerCase().includes("aborted"))
      ) {
        if (timedOut) {
          throw onTimeout();
        }

        if (abortSignal?.aborted) {
          throw createAbortError(abortSignal.reason);
        }

        throw onTimeout();
      }

      throw error;
    });

    return await Promise.race([fetchPromise, timeoutPromise]);
  } finally {
    abortSignal?.removeEventListener("abort", handleAbort);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}
import { networkFetch } from "../networkFetch";
