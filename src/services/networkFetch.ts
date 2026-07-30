type FetchFunction = typeof globalThis.fetch;

let expoFetch: FetchFunction | null = null;

try {
  expoFetch = require("expo/fetch").fetch as FetchFunction;
} catch {
  expoFetch = null;
}

export function networkFetch(
  input: Parameters<FetchFunction>[0] | URL,
  init?: Parameters<FetchFunction>[1]
) {
  const normalizedInput = input instanceof URL ? input.toString() : input;
  return (expoFetch ?? globalThis.fetch)(normalizedInput, init);
}
