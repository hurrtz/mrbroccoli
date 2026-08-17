import {
  LOCAL_MODEL_CATALOG,
  type LocalModelId,
} from "../constants/localModels";
import type { SpeechLanguage } from "../constants/speechLanguages";
import { getKokoroInstallReadiness } from "./kokoroTts";
import {
  getLocalModelInstallStatus,
  type LocalModelInstallStatus,
} from "./localModelManager";

async function getInstallStatus(
  modelId: LocalModelId,
  phonemeLanguages?: SpeechLanguage[],
) {
  if (modelId === "kokoro-multilingual") {
    const status = await getKokoroInstallReadiness({ phonemeLanguages });
    return {
      installed: status.installed,
      path: status.rootPath,
      verified: status.verified,
    } satisfies LocalModelInstallStatus;
  }
  return getLocalModelInstallStatus(modelId);
}

export async function getLocalCatalogInstallStatuses(options?: {
  phonemeLanguages?: SpeechLanguage[];
}) {
  return Object.fromEntries(
    await Promise.all(
      LOCAL_MODEL_CATALOG.map(
        async (model) =>
          [
            model.id,
            await getInstallStatus(model.id, options?.phonemeLanguages),
          ] as const,
      ),
    ),
  ) as Partial<Record<LocalModelId, LocalModelInstallStatus>>;
}
