import {
  normalizeFreeSpeechLanguage,
  normalizeSpeechLanguage,
  resolveFreeSpeechLanguage,
  type FreeSpeechLanguage,
} from "../constants/speechLanguages";

const STOREFRONT_LOOKUP_TIMEOUT_MS = 1_500;

const STOREFRONT_LANGUAGE_BY_COUNTRY: Readonly<
  Record<string, FreeSpeechLanguage>
> = {
  AD: "es",
  AR: "es",
  AT: "de",
  BO: "es",
  BR: "pt",
  CL: "es",
  CO: "es",
  CR: "es",
  CU: "es",
  DE: "de",
  DO: "es",
  EC: "es",
  ES: "es",
  FR: "fr",
  GQ: "es",
  GT: "es",
  HN: "es",
  IT: "it",
  LI: "de",
  MC: "fr",
  MX: "es",
  NI: "es",
  PA: "es",
  PE: "es",
  PR: "es",
  PT: "pt",
  PY: "es",
  RU: "ru",
  SM: "it",
  SV: "es",
  UY: "es",
  VA: "it",
  VE: "es",
};

const MULTILINGUAL_STOREFRONTS: Readonly<
  Record<string, readonly FreeSpeechLanguage[]>
> = {
  BE: ["fr", "de"],
  CA: ["en", "fr"],
  CH: ["de", "fr", "it"],
};

export function resolveFreeLanguageFromStorefront(
  storefrontCountryCode: string | null | undefined,
  deviceLocale: string,
) {
  const countryCode = storefrontCountryCode?.trim().toUpperCase();
  if (!countryCode) {
    return "en" as const;
  }

  const multilingualOptions = MULTILINGUAL_STOREFRONTS[countryCode];
  if (multilingualOptions) {
    const normalizedLocale = normalizeSpeechLanguage(
      deviceLocale.split(/[-_]/u)[0],
    );
    const localeLanguage = normalizedLocale
      ? normalizeFreeSpeechLanguage(normalizedLocale)
      : null;
    const selected =
      localeLanguage && multilingualOptions.includes(localeLanguage)
        ? localeLanguage
        : multilingualOptions[0];
    return resolveFreeSpeechLanguage(selected, deviceLocale);
  }

  const selected = STOREFRONT_LANGUAGE_BY_COUNTRY[countryCode];
  return selected
    ? resolveFreeSpeechLanguage(
        selected,
        countryCode === "BR" ? "pt-BR" : deviceLocale,
      )
    : ("en" as const);
}

export async function getFreeOnboardingLanguageFromStorefront(
  deviceLocale: string,
) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- lazy loading keeps pure language mapping import-safe in Jest and non-store runtimes
    const { getStorefront } = require("expo-iap") as typeof import("expo-iap");
    const storefront = await Promise.race([
      getStorefront(),
      new Promise<never>((_, reject) => {
        timeoutId = setTimeout(
          () => reject(new Error("Storefront lookup timed out.")),
          STOREFRONT_LOOKUP_TIMEOUT_MS,
        );
      }),
    ]);
    return resolveFreeLanguageFromStorefront(storefront, deviceLocale);
  } catch {
    return "en" as const;
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}
