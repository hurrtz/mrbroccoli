import {
  RUNTIME_PROVIDER_ORDER,
  type RuntimeAppProviderId,
} from "./runtimeManifest";

export const RUNTIME_PROVIDER_IDS = [...RUNTIME_PROVIDER_ORDER];
export const DEFAULT_RUNTIME_PROVIDER_ID = RUNTIME_PROVIDER_IDS[0];

export function isRuntimeProviderId(
  value: unknown,
): value is RuntimeAppProviderId {
  return (
    typeof value === "string" &&
    RUNTIME_PROVIDER_IDS.includes(value as RuntimeAppProviderId)
  );
}

function createRuntimeProviderRecord<T>(
  factory: (provider: RuntimeAppProviderId) => T,
): Record<RuntimeAppProviderId, T> {
  return Object.fromEntries(
    RUNTIME_PROVIDER_IDS.map((provider) => [provider, factory(provider)]),
  ) as Record<RuntimeAppProviderId, T>;
}

export function createRuntimeProviderStringRecord(
  defaultValue = "",
  overrides?: Partial<Record<RuntimeAppProviderId, string>>,
): Record<RuntimeAppProviderId, string> {
  return createRuntimeProviderRecord(
    (provider) => overrides?.[provider] ?? defaultValue,
  );
}

export function extractRuntimeProviderStringRecord(
  value: unknown,
): Partial<Record<RuntimeAppProviderId, string>> {
  if (!value || typeof value !== "object") {
    return {};
  }

  return Object.entries(value).reduce(
    (accumulator, [provider, entryValue]) => {
      if (isRuntimeProviderId(provider) && typeof entryValue === "string" && entryValue.trim()) {
        accumulator[provider] = entryValue.trim();
      }

      return accumulator;
    },
    {} as Partial<Record<RuntimeAppProviderId, string>>,
  );
}
