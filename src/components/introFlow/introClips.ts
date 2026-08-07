import type { AppLanguage } from "../../i18n/localeRegistry";

/**
 * Bundled audio examples for the intro sheet, one per interface language.
 *
 * Android splits bundled resources by language, but iOS ships every
 * localization to every device, so the clip count is the binding constraint on
 * app size rather than the number of locales. One clip per language stays
 * comfortably inside `config/release-size-budget.json`; adding more is a
 * size-budget decision, not a code change.
 *
 * A language with no recording yet falls back to the transcript alone. The
 * spoken script lives in the locale dictionaries (`introHearTranscript`
 * content), so wording stays reviewable by the translation tooling -- audio is
 * invisible to a diff, and a mistranslation baked into a recording cannot be
 * caught by reading one.
 */
export type IntroClip = {
  module: number;
};

// Populated per locale as recordings are produced. English ships first so a
// first run always has something to play, including offline and for languages
// outside the registered nineteen.
const INTRO_CLIPS: Partial<Record<AppLanguage, IntroClip>> = {};

export function getIntroClip(language: AppLanguage): IntroClip | null {
  return INTRO_CLIPS[language] ?? INTRO_CLIPS.en ?? null;
}
