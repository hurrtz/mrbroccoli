import { KokoroModelState } from "../../hooks/useKokoroModel";
import { Settings } from "../../types";
import { TranslateFn } from "./shared";

interface GetKokoroPromptBlockStateParams {
  kokoroModel: KokoroModelState;
  verifiedByOfflineProfile?: boolean;
  spokenRepliesEnabled: boolean;
  t: TranslateFn;
  ttsMode: Settings["ttsMode"];
}

export function getKokoroPromptBlockState({
  kokoroModel,
  verifiedByOfflineProfile = false,
  spokenRepliesEnabled,
  t,
  ttsMode,
}: GetKokoroPromptBlockStateParams) {
  const blocked =
    spokenRepliesEnabled &&
    ttsMode === "kokoro" &&
    !verifiedByOfflineProfile &&
    !(kokoroModel.installed && kokoroModel.verified);

  if (!blocked) {
    return {
      actionLabel: null,
      message: null,
      progress: null,
    };
  }

  const message = kokoroModel.error
    ? kokoroModel.error
    : kokoroModel.busy === "downloading"
      ? t(
          kokoroModel.phase === "extracting"
            ? "kokoroExtracting"
            : "kokoroDownloading",
          { progress: Math.round(kokoroModel.progress * 100) },
        )
      : kokoroModel.busy === "verifying"
        ? t("kokoroVerifying")
        : kokoroModel.busy === "checking"
          ? t("kokoroChecking")
          : t("kokoroNotInstalled");
  const busy =
    kokoroModel.busy === "checking" ||
    kokoroModel.busy === "downloading" ||
    kokoroModel.busy === "verifying";

  return {
    actionLabel: busy ? message : null,
    message,
    progress:
      kokoroModel.busy === "downloading"
        ? Math.min(1, Math.max(0, kokoroModel.progress))
        : null,
  };
}
