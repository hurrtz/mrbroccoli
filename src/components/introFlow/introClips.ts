import type { AppLanguage } from "../../i18n/localeRegistry";

/**
 * Bundled audio examples for the intro sheet, one per interface language.
 *
 * All nineteen ship inside the app. The complete set is roughly twenty-one
 * megabytes of mono AAC, which is small enough that store-hosted on-demand
 * delivery would have cost an iOS app extension and a Play Core dependency to
 * save an amount nobody would notice.
 *
 * **Decision:** Bundled rather than delivered. On-demand packs were built and
 * removed once the content settled at one message per language instead of six;
 * the machinery only pays for itself at a scale this feature no longer has.
 *
 * Consequence: every install carries all nineteen. Metro's asset pipeline has
 * no concept of Android resource qualifiers, so Play cannot language-split
 * these, and iOS never could. That is the accepted trade for keeping the
 * feature pure TypeScript.
 *
 * The spoken text for each clip lives in `introScripts.ts`, and
 * `docs/promo-audio-texts/<lang>.md` records which provider voiced it.
 */
const INTRO_CLIPS: Record<AppLanguage, number> = {
  en: require("../../../assets/intro-audio/intro-en.m4a"),
  de: require("../../../assets/intro-audio/intro-de.m4a"),
  uk: require("../../../assets/intro-audio/intro-uk.m4a"),
  hi: require("../../../assets/intro-audio/intro-hi.m4a"),
  es: require("../../../assets/intro-audio/intro-es.m4a"),
  fr: require("../../../assets/intro-audio/intro-fr.m4a"),
  it: require("../../../assets/intro-audio/intro-it.m4a"),
  pt: require("../../../assets/intro-audio/intro-pt.m4a"),
  "pt-BR": require("../../../assets/intro-audio/intro-pt-BR.m4a"),
  ru: require("../../../assets/intro-audio/intro-ru.m4a"),
  "zh-CN": require("../../../assets/intro-audio/intro-zh-CN.m4a"),
  ar: require("../../../assets/intro-audio/intro-ar.m4a"),
  ja: require("../../../assets/intro-audio/intro-ja.m4a"),
  hu: require("../../../assets/intro-audio/intro-hu.m4a"),
  cs: require("../../../assets/intro-audio/intro-cs.m4a"),
  pl: require("../../../assets/intro-audio/intro-pl.m4a"),
  tr: require("../../../assets/intro-audio/intro-tr.m4a"),
  sv: require("../../../assets/intro-audio/intro-sv.m4a"),
  ur: require("../../../assets/intro-audio/intro-ur.m4a"),
};

/**
 * Returns the packaged clip for a language.
 *
 * Every interface language has one, so this cannot fail. A locale outside the
 * registered nineteen never reaches here -- the app resolves it to one of them
 * before the sheet renders.
 */
export function getIntroClip(language: AppLanguage) {
  return INTRO_CLIPS[language] ?? INTRO_CLIPS.en;
}
