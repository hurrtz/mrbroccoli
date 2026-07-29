import { AppLanguage, TtsListenLanguage } from "../types";
import { getDefaultTtsListenLanguageForLocale } from "../i18n/localeRegistry";

function detectScriptLanguage(text: string): TtsListenLanguage | null {
  if (/[\u3040-\u30ff]/.test(text)) {
    return "ja";
  }

  if (/[\u0900-\u097f]/.test(text)) {
    return "hi";
  }

  if (/[\u4e00-\u9fff]/.test(text)) {
    return "zh-CN";
  }

  if (/[\u0679\u067e\u0686\u0688\u0691\u06af\u06ba\u06be\u06c1\u06cc\u06d2]/u.test(text)) {
    return "ur";
  }

  if (/[\u0600-\u06ff]/.test(text)) {
    return "ar";
  }

  if (/[іїєґ]/iu.test(text)) {
    return "uk";
  }

  if (/[ыэъё]/iu.test(text)) {
    return "ru";
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
  "zh-CN": {
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
  "pt-BR": {
    marker: /[ãõçáéíóú]/i,
    markerScore: 2,
    tokens: [
      " você ",
      " vocês ",
      " ônibus ",
      " legal ",
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
  uk: {
    marker: /[іїєґ]/iu,
    markerScore: 4,
    tokens: [" і ", " та ", " що ", " це ", " не ", " для "],
  },
  ru: {
    marker: /[ыэъё]/iu,
    markerScore: 4,
    tokens: [" и ", " что ", " это ", " не ", " для ", " как "],
  },
  ar: {
    marker: /[\u0600-\u06ff]/u,
    markerScore: 3,
    tokens: [" في ", " من ", " على ", " هذا ", " التي ", " لا "],
  },
  hu: {
    marker: /[őű]/i,
    markerScore: 4,
    tokens: [" az ", " és ", " hogy ", " nem ", " egy ", " van "],
  },
  cs: {
    marker: /[čďěňřšťůž]/i,
    markerScore: 4,
    tokens: [" a ", " že ", " se ", " je ", " není ", " pro "],
  },
  pl: {
    marker: /[ąćęłńśźż]/i,
    markerScore: 4,
    tokens: [" i ", " że ", " nie ", " jest ", " się ", " dla "],
  },
  tr: {
    marker: /[çğıöşüİı]/i,
    markerScore: 4,
    tokens: [" ve ", " bir ", " bu ", " için ", " değil ", " ile "],
  },
  sv: {
    marker: /å/i,
    markerScore: 4,
    tokens: [" och ", " att ", " det ", " inte ", " som ", " för "],
  },
  ur: {
    marker: /[\u0679\u067e\u0686\u0688\u0691\u06af\u06ba\u06be\u06c1\u06cc\u06d2]/u,
    markerScore: 4,
    tokens: [" اور ", " ہے ", " نہیں ", " یہ ", " کے ", " میں "],
  },
};

function scoreLanguage(text: string, language: TtsListenLanguage) {
  const normalized = ` ${text.toLowerCase()} `;
  const heuristic = LANGUAGE_HEURISTICS[language];
  const tokenSource =
    language === "zh-CN" || language === "ja" ? text : normalized;
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
  const appVoiceLanguage: TtsListenLanguage =
    getDefaultTtsListenLanguageForLocale(params.appLanguage);
  const preferredLanguages =
    params.preferredLanguages && params.preferredLanguages.length > 0
      ? params.preferredLanguages
      : [appVoiceLanguage];

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
