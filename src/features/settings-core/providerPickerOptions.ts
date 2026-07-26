import { PROVIDER_LABELS } from "../../constants/models";
import type { Provider } from "../../types";

export function buildProviderPickerOptions(
  providers: Provider[],
  selectedProvider: Provider | null | undefined,
  missingLabel: string,
) {
  const options = [...providers];

  if (selectedProvider && !options.includes(selectedProvider)) {
    options.push(selectedProvider);
  }

  return options.map((provider) => ({
    value: provider,
    label: providers.includes(provider)
      ? PROVIDER_LABELS[provider]
      : `${PROVIDER_LABELS[provider]} · ${missingLabel}`,
  }));
}
