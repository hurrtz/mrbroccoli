import { AppLanguage, TtsListenLanguage } from "../types";

function detectScriptLanguage(text: string): TtsListenLanguage | null {
  if (/[\u3040-\u30ff]/.test(text)) {
    return "ja";
  }

  if (/[\u0900-\u097f]/.test(text)) {
    return "hi";
  }

  if (/[\u4e00-\u9fff]/.test(text)) {
    return "zh";
  }

  return null;
}

interface LanguageHeuristic {
  marker?: RegExp;
  markerScore?: number;
  tokens: string[];
}

const LANGUAGE_HEURISTICS: Record<
  TtsListenLanguage,
  LanguageHeuristic
> = {
  de: {
    marker: /[äöüß]/i,
    markerScore: 3,
    tokens: [" der ", " die ", " das ", " und ", " ich ", " nicht "],
  },
  en: {
    tokens: [" the ", " and ", " you ", " is ", " are ", " this "],
  },
  zh: {
    marker: /[\u4e00-\u9fff]/,
    markerScore: 2,
    tokens: ["的", "了", "是", "我", "你", "不"],
  },
  ja: {
    marker: /[\u3040-\u30ff]/,
    markerScore: 3,
    tokens: ["です", "ます", "ない", "して", "この", "その"],
  },
  hi: {
    marker: /[\u0900-\u097f]/,
    markerScore: 2,
    tokens: [" है ", " और ", " नहीं ", " मैं ", " क्या ", " यह "],
  },
  es: {
    marker: /[áéíóúñ¡¿]/i,
    markerScore: 2,
    tokens: [" el ", " la ", " que ", " de ", " y ", " no "],
  },
  pt: {
    marker: /[ãõçáéíóú]/i,
    markerScore: 2,
    tokens: [
      " não ",
      " nao ",
      " você ",
      " voce ",
      " que ",
      " de ",
      " uma ",
      " para ",
    ],
  },
  fr: {
    marker: /[àâçéèêëîïôùûüÿœæ]/i,
    markerScore: 2,
    tokens: [" le ", " la ", " de ", " je ", " pas ", " est "],
  },
  it: {
    marker: /[àèéìíîòóù]/i,
    markerScore: 1,
    tokens: [" il ", " che ", " non ", " una ", " per ", " con "],
  },
};

function scoreLanguage(text: string, language: TtsListenLanguage) {
  const normalized = ` ${text.toLowerCase()} `;
  const heuristic = LANGUAGE_HEURISTICS[language];
  const tokenSource =
    language === "zh" || language === "ja" ? text : normalized;
  const markerScore =
    heuristic.marker?.test(text) ? (heuristic.markerScore ?? 0) : 0;
  return heuristic.tokens.reduce(
    (score, token) => score + (tokenSource.includes(token) ? 1 : 0),
    markerScore,
  );
}

export function resolveTtsListenLanguage(params: {
  text: string;
  preferredLanguages?: TtsListenLanguage[];
  appLanguage: AppLanguage;
}) {
  const preferredLanguages =
    params.preferredLanguages && params.preferredLanguages.length > 0
      ? params.preferredLanguages
      : [params.appLanguage];

  if (preferredLanguages.length === 1) {
    return preferredLanguages[0];
  }

  const scriptLanguage = detectScriptLanguage(params.text);
  if (scriptLanguage && preferredLanguages.includes(scriptLanguage)) {
    return scriptLanguage;
  }

  const scoredLanguage = preferredLanguages
    .map((language) => ({
      language,
      score: scoreLanguage(params.text, language),
    }))
    .sort((left, right) => right.score - left.score)[0];

  if (scoredLanguage && scoredLanguage.score > 0) {
    return scoredLanguage.language;
  }

  return preferredLanguages[0];
}
