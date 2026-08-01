import { ar } from "./locales/ar";
import { cs } from "./locales/cs";
import { de } from "./locales/de";
import { en } from "./locales/en";
import { es } from "./locales/es";
import { fr } from "./locales/fr";
import { hi } from "./locales/hi";
import { hu } from "./locales/hu";
import { it } from "./locales/it";
import { ja } from "./locales/ja";
import { pl } from "./locales/pl";
import { pt } from "./locales/pt";
import { ptBR } from "./locales/ptBR";
import { ru } from "./locales/ru";
import { sv } from "./locales/sv";
import { tr } from "./locales/tr";
import { uk } from "./locales/uk";
import { ur } from "./locales/ur";
import { zhCN } from "./locales/zhCN";
import type { TranslationDictionary } from "./types";
import type { SpeechLanguage } from "../constants/speechLanguages";

export type AppTextDirection = "ltr" | "rtl";

export interface AppLocaleDefinition {
  nativeName: string;
  intlLocale: string;
  direction: AppTextDirection;
  messages: TranslationDictionary;
  defaultContentLanguage: "en" | "de";
  defaultAssistantInstructions: string;
  defaultTtsListenLanguage: SpeechLanguage;
}

const DEFAULT_ASSISTANT_INSTRUCTIONS = {
  en: "You are a voice assistant. The user is speaking to you and will hear your response read aloud. Respond naturally and conversationally as if talking. Never use markdown, bullet points, numbered lists, headers, or any formatting. Keep responses concise and spoken-friendly.",
  de: "Du bist ein Sprachassistent. Die Nutzerin oder der Nutzer spricht mit dir und wird deine Antwort vorgelesen bekommen. Antworte natürlich und gesprächsnah, als wärest du in einem echten Gespräch. Verwende niemals Markdown, Aufzählungen, nummerierte Listen, Überschriften oder sonstige Formatierung. Halte Antworten knapp und gut vorlesbar.",
  uk: "Ти голосовий асистент. Користувач говорить з тобою та почує твою відповідь, озвучену вголос. Відповідай природно й невимушено, ніби під час розмови. Ніколи не використовуй Markdown, марковані чи нумеровані списки, заголовки або інше форматування. Відповідай стисло й так, щоб текст добре звучав уголос.",
  hi: "आप एक वॉइस असिस्टेंट हैं। उपयोगकर्ता आपसे बोल रहा है और आपका उत्तर पढ़कर सुनाया जाएगा। स्वाभाविक और बातचीत के अंदाज़ में जवाब दें। Markdown, बुलेट पॉइंट, क्रमांकित सूचियाँ, शीर्षक या किसी भी तरह की फ़ॉर्मेटिंग का कभी उपयोग न करें। उत्तर संक्षिप्त और बोलकर सुनाने के अनुकूल रखें।",
  es: "Eres un asistente de voz. La persona usuaria te está hablando y escuchará tu respuesta leída en voz alta. Responde de forma natural y conversacional, como si estuvierais hablando. No uses nunca Markdown, viñetas, listas numeradas, encabezados ni ningún otro formato. Mantén las respuestas breves y adecuadas para escucharlas.",
  fr: "Tu es un assistant vocal. La personne te parle et entendra ta réponse lue à voix haute. Réponds de façon naturelle et conversationnelle, comme dans une discussion. N’utilise jamais de Markdown, de listes à puces ou numérotées, de titres ni aucune autre mise en forme. Garde des réponses concises et agréables à écouter.",
  it: "Sei un assistente vocale. La persona ti sta parlando e ascolterà la tua risposta letta ad alta voce. Rispondi in modo naturale e colloquiale, come in una conversazione. Non usare mai Markdown, elenchi puntati o numerati, titoli o altra formattazione. Mantieni le risposte concise e adatte all’ascolto.",
  pt: "És um assistente de voz. A pessoa está a falar contigo e ouvirá a tua resposta lida em voz alta. Responde de forma natural e conversacional, como numa conversa. Nunca uses Markdown, listas com marcadores ou numeradas, títulos nem qualquer outra formatação. Mantém as respostas concisas e adequadas para serem ouvidas.",
  "pt-BR":
    "Você é um assistente de voz. A pessoa está falando com você e ouvirá sua resposta lida em voz alta. Responda de forma natural e conversacional, como em uma conversa. Nunca use Markdown, listas com marcadores ou numeradas, títulos nem qualquer outra formatação. Mantenha as respostas concisas e adequadas para serem ouvidas.",
  ru: "Ты голосовой помощник. Пользователь говорит с тобой и услышит твой ответ вслух. Отвечай естественно и непринуждённо, как в обычном разговоре. Никогда не используй Markdown, маркированные или нумерованные списки, заголовки и другое форматирование. Отвечай кратко и так, чтобы текст хорошо звучал вслух.",
  "zh-CN":
    "你是一名语音助手。用户正在与你交谈，并会听到你的回答被朗读出来。请像自然对话一样回应。不要使用 Markdown、项目符号、编号列表、标题或任何其他格式。回答应简洁，并适合朗读。",
  ar: "أنت مساعد صوتي. يتحدث إليك المستخدم وسيستمع إلى ردك مقروءًا بصوت عالٍ. أجب بصورة طبيعية وحوارية كما لو كنت تتحدث معه. لا تستخدم Markdown أو القوائم النقطية أو المرقمة أو العناوين أو أي تنسيق آخر. اجعل الردود موجزة ومناسبة للاستماع.",
  ja: "あなたは音声アシスタントです。ユーザーはあなたに話しかけ、回答は音声で読み上げられます。会話しているように自然な口調で答えてください。Markdown、箇条書き、番号付きリスト、見出し、その他の書式は使用しないでください。回答は簡潔で、読み上げに適したものにしてください。",
  hu: "Hangasszisztens vagy. A felhasználó beszél hozzád, és hangosan felolvasva hallja majd a válaszodat. Válaszolj természetesen és társalgási stílusban, mintha beszélgetnétek. Soha ne használj Markdownt, felsorolást, számozott listát, címsort vagy más formázást. A válaszok legyenek tömörek és jól felolvashatók.",
  cs: "Jsi hlasový asistent. Uživatel s tebou mluví a tvoji odpověď uslyší přečtenou nahlas. Odpovídej přirozeně a konverzačně, jako při běžném rozhovoru. Nikdy nepoužívej Markdown, odrážky, číslované seznamy, nadpisy ani jiné formátování. Odpovědi udržuj stručné a vhodné k předčítání.",
  pl: "Jesteś asystentem głosowym. Użytkownik mówi do ciebie i usłyszy twoją odpowiedź odczytaną na głos. Odpowiadaj naturalnie i swobodnie, jak podczas rozmowy. Nigdy nie używaj Markdown, wypunktowań, list numerowanych, nagłówków ani innego formatowania. Odpowiedzi powinny być zwięzłe i dobrze brzmieć po odczytaniu.",
  tr: "Bir sesli asistansın. Kullanıcı seninle konuşuyor ve yanıtını sesli olarak dinleyecek. Sohbet ediyormuş gibi doğal ve konuşma diline uygun yanıt ver. Markdown, madde işaretleri, numaralı listeler, başlıklar veya başka biçimlendirmeler kullanma. Yanıtları kısa ve dinlemeye uygun tut.",
  sv: "Du är en röstassistent. Användaren talar med dig och kommer att höra ditt svar läsas upp. Svara naturligt och samtalsmässigt, som i ett vanligt samtal. Använd aldrig Markdown, punktlistor, numrerade listor, rubriker eller annan formatering. Håll svaren kortfattade och lämpade för uppläsning.",
  ur: "آپ ایک صوتی معاون ہیں۔ صارف آپ سے بات کر رہا ہے اور آپ کا جواب بلند آواز میں سنایا جائے گا۔ فطری اور گفتگو کے انداز میں جواب دیں۔ Markdown، بلٹ پوائنٹس، نمبر والی فہرستیں، سرخیاں یا کوئی دوسری فارمیٹنگ کبھی استعمال نہ کریں۔ جوابات مختصر اور سننے کے لیے موزوں رکھیں۔",
} as const;

function defineAppLocale(
  definition: Omit<
    AppLocaleDefinition,
    "direction" | "defaultContentLanguage" | "defaultTtsListenLanguage"
  > &
    Partial<
      Pick<
        AppLocaleDefinition,
        "direction" | "defaultContentLanguage" | "defaultTtsListenLanguage"
      >
    >,
): AppLocaleDefinition {
  return {
    direction: "ltr",
    defaultContentLanguage: "en",
    defaultTtsListenLanguage: "en",
    ...definition,
  };
}

/**
 * The single registration point for app-interface locales.
 *
 * Adding a locale requires one dictionary and one entry here. Language
 * persistence, formatting, direction, and picker options are all derived from
 * this registry.
 */
export const APP_LOCALES = {
  en: defineAppLocale({
    nativeName: "English",
    intlLocale: "en-US",
    messages: en,
    defaultAssistantInstructions: DEFAULT_ASSISTANT_INSTRUCTIONS.en,
  }),
  de: defineAppLocale({
    nativeName: "Deutsch",
    intlLocale: "de-DE",
    messages: de,
    defaultContentLanguage: "de",
    defaultAssistantInstructions: DEFAULT_ASSISTANT_INSTRUCTIONS.de,
    defaultTtsListenLanguage: "de",
  }),
  uk: defineAppLocale({
    nativeName: "Українська",
    intlLocale: "uk-UA",
    messages: uk,
    defaultAssistantInstructions: DEFAULT_ASSISTANT_INSTRUCTIONS.uk,
    defaultTtsListenLanguage: "uk",
  }),
  hi: defineAppLocale({
    nativeName: "हिन्दी",
    intlLocale: "hi-IN",
    messages: hi,
    defaultAssistantInstructions: DEFAULT_ASSISTANT_INSTRUCTIONS.hi,
    defaultTtsListenLanguage: "hi",
  }),
  es: defineAppLocale({
    nativeName: "Español",
    intlLocale: "es-ES",
    messages: es,
    defaultAssistantInstructions: DEFAULT_ASSISTANT_INSTRUCTIONS.es,
    defaultTtsListenLanguage: "es",
  }),
  fr: defineAppLocale({
    nativeName: "Français",
    intlLocale: "fr-FR",
    messages: fr,
    defaultAssistantInstructions: DEFAULT_ASSISTANT_INSTRUCTIONS.fr,
    defaultTtsListenLanguage: "fr",
  }),
  it: defineAppLocale({
    nativeName: "Italiano",
    intlLocale: "it-IT",
    messages: it,
    defaultAssistantInstructions: DEFAULT_ASSISTANT_INSTRUCTIONS.it,
    defaultTtsListenLanguage: "it",
  }),
  pt: defineAppLocale({
    nativeName: "Português",
    intlLocale: "pt-PT",
    messages: pt,
    defaultAssistantInstructions: DEFAULT_ASSISTANT_INSTRUCTIONS.pt,
    defaultTtsListenLanguage: "pt",
  }),
  "pt-BR": defineAppLocale({
    nativeName: "Português (Brasil)",
    intlLocale: "pt-BR",
    messages: ptBR,
    defaultAssistantInstructions: DEFAULT_ASSISTANT_INSTRUCTIONS["pt-BR"],
    defaultTtsListenLanguage: "pt-BR",
  }),
  ru: defineAppLocale({
    nativeName: "Русский",
    intlLocale: "ru-RU",
    messages: ru,
    defaultAssistantInstructions: DEFAULT_ASSISTANT_INSTRUCTIONS.ru,
    defaultTtsListenLanguage: "ru",
  }),
  "zh-CN": defineAppLocale({
    nativeName: "简体中文",
    intlLocale: "zh-CN",
    messages: zhCN,
    defaultAssistantInstructions: DEFAULT_ASSISTANT_INSTRUCTIONS["zh-CN"],
    defaultTtsListenLanguage: "zh-CN",
  }),
  ar: defineAppLocale({
    nativeName: "العربية",
    intlLocale: "ar",
    direction: "rtl",
    messages: ar,
    defaultAssistantInstructions: DEFAULT_ASSISTANT_INSTRUCTIONS.ar,
    defaultTtsListenLanguage: "ar",
  }),
  ja: defineAppLocale({
    nativeName: "日本語",
    intlLocale: "ja-JP",
    messages: ja,
    defaultAssistantInstructions: DEFAULT_ASSISTANT_INSTRUCTIONS.ja,
    defaultTtsListenLanguage: "ja",
  }),
  hu: defineAppLocale({
    nativeName: "Magyar",
    intlLocale: "hu-HU",
    messages: hu,
    defaultAssistantInstructions: DEFAULT_ASSISTANT_INSTRUCTIONS.hu,
    defaultTtsListenLanguage: "hu",
  }),
  cs: defineAppLocale({
    nativeName: "Čeština",
    intlLocale: "cs-CZ",
    messages: cs,
    defaultAssistantInstructions: DEFAULT_ASSISTANT_INSTRUCTIONS.cs,
    defaultTtsListenLanguage: "cs",
  }),
  pl: defineAppLocale({
    nativeName: "Polski",
    intlLocale: "pl-PL",
    messages: pl,
    defaultAssistantInstructions: DEFAULT_ASSISTANT_INSTRUCTIONS.pl,
    defaultTtsListenLanguage: "pl",
  }),
  tr: defineAppLocale({
    nativeName: "Türkçe",
    intlLocale: "tr-TR",
    messages: tr,
    defaultAssistantInstructions: DEFAULT_ASSISTANT_INSTRUCTIONS.tr,
    defaultTtsListenLanguage: "tr",
  }),
  sv: defineAppLocale({
    nativeName: "Svenska",
    intlLocale: "sv-SE",
    messages: sv,
    defaultAssistantInstructions: DEFAULT_ASSISTANT_INSTRUCTIONS.sv,
    defaultTtsListenLanguage: "sv",
  }),
  ur: defineAppLocale({
    nativeName: "اردو",
    intlLocale: "ur-PK",
    direction: "rtl",
    messages: ur,
    defaultAssistantInstructions: DEFAULT_ASSISTANT_INSTRUCTIONS.ur,
    defaultTtsListenLanguage: "ur",
  }),
} as const;

export type AppLanguage = keyof typeof APP_LOCALES;
export type LocalizedResource<T> = Readonly<
  { en: T } & Partial<Record<AppLanguage, T>>
>;

export const APP_LANGUAGES = Object.freeze(
  Object.keys(APP_LOCALES) as AppLanguage[],
);

export const APP_LANGUAGE_OPTIONS = Object.freeze(
  APP_LANGUAGES.map((value) => ({
    value,
    label: APP_LOCALES[value].nativeName,
  })),
);

export const translations = Object.freeze(
  Object.fromEntries(
    APP_LANGUAGES.map((language) => [
      language,
      APP_LOCALES[language].messages,
    ]),
  ) as Record<AppLanguage, TranslationDictionary>,
);

export function isAppLanguage(value: unknown): value is AppLanguage {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(APP_LOCALES, value)
  );
}

export function getAppLocale(language: AppLanguage): AppLocaleDefinition {
  return APP_LOCALES[language];
}

export function getLocalizedResource<T>(
  resource: LocalizedResource<T>,
  language: AppLanguage,
): T {
  return resource[language] ?? resource.en;
}

export function getDefaultAssistantInstructionsForLocale(
  language: AppLanguage,
) {
  return getAppLocale(language).defaultAssistantInstructions;
}

export function getDefaultContentLanguageForLocale(language: AppLanguage) {
  return getAppLocale(language).defaultContentLanguage;
}

export function getDefaultTtsListenLanguageForLocale(language: AppLanguage) {
  return getAppLocale(language).defaultTtsListenLanguage;
}
