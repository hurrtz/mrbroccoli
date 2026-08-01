import { RUNTIME_PROVIDER_MANIFEST } from "../constants/providers/runtimeManifest";
import type { Provider } from "../types";

export function modelSupportsImageInput(provider: Provider, model: string) {
  const llm = RUNTIME_PROVIDER_MANIFEST[provider]?.llm;

  if (!llm || llm.support !== "provider") {
    return false;
  }

  const modelSpec = llm.models.find((candidate) => candidate.id === model);

  return modelSpec?.supportsImageInput ?? llm.supportsImageInput ?? false;
}
