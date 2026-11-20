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
