import { TranslationKey } from "../../i18n";
import type { ToastTone } from "../../types";

export type TranslateFn = (
  key: TranslationKey,
  params?: Record<string, string | number | undefined>,
) => string;

export type ShowToastFn = (
  message: string,
  onRetry?: () => void,
  tone?: ToastTone,
  onDismiss?: () => void,
) => void;
