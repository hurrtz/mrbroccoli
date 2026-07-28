import type { AppLanguage, Provider } from "../../types";
import {
  getCatalogConstraintsForAppProvider,
  getCatalogModelForAppProvider,
} from "../../catalog/appProviders";
import {
  getStrictestCatalogMaxConstraint,
} from "../../catalog";
import {
  NATIVE_STT_LANGUAGE_NOTE,
  NATIVE_TTS_LANGUAGE_NOTE,
  PROVIDER_CONFIGS,
  PROVIDER_ORDER,
  WHISPER_WELL_SUPPORTED_LANGUAGES,
} from "./catalogData";

const NATIVE_STT_LANGUAGE_NOTES_BY_LANGUAGE: Record<AppLanguage, string> = {
  en: NATIVE_STT_LANGUAGE_NOTE,
  de:
    "Die Sprachunterstützung hängt vom Betriebssystem des Geräts, installierten Sprachpaketen und der Verfügbarkeit der Erkennung ab. Die genaue Liste variiert je nach Gerät.",
  uk:
    "Підтримка мов залежить від операційної системи пристрою, встановлених мовних пакетів і доступності розпізнавання. Точний перелік відрізняється залежно від пристрою.",
  hi:
    "भाषा समर्थन डिवाइस के ऑपरेटिंग सिस्टम, इंस्टॉल किए गए भाषा पैक और पहचान की उपलब्धता पर निर्भर करता है। सटीक सूची हर डिवाइस पर अलग हो सकती है।",
  es:
    "La compatibilidad con idiomas depende del sistema operativo del dispositivo, los paquetes de idioma instalados y la disponibilidad del reconocimiento. La lista exacta varía según el dispositivo.",
  fr:
    "La prise en charge des langues dépend du système d’exploitation de l’appareil, des packs linguistiques installés et de la disponibilité de la reconnaissance. La liste exacte varie selon l’appareil.",
  it:
    "Il supporto linguistico dipende dal sistema operativo del dispositivo, dai pacchetti di lingua installati e dalla disponibilità del riconoscimento. L’elenco esatto varia in base al dispositivo.",
  pt:
    "O suporte de idiomas depende do sistema operativo do dispositivo, dos pacotes de idiomas instalados e da disponibilidade do reconhecimento. A lista exata varia consoante o dispositivo.",
};

const NATIVE_TTS_LANGUAGE_NOTES_BY_LANGUAGE: Record<AppLanguage, string> = {
  en: NATIVE_TTS_LANGUAGE_NOTE,
  de:
    "Die Sprachunterstützung hängt von den auf dem Gerät installierten Systemstimmen ab. Die genaue Liste, Aussprachequalität und Offline-Verfügbarkeit variieren je nach Betriebssystem und Gerät.",
  uk:
    "Підтримка мов залежить від системних голосів, установлених на пристрої. Точний перелік, якість вимови та доступність офлайн відрізняються залежно від операційної системи й пристрою.",
  hi:
    "भाषा समर्थन डिवाइस पर इंस्टॉल सिस्टम आवाज़ों पर निर्भर करता है। सटीक सूची, उच्चारण की गुणवत्ता और ऑफलाइन उपलब्धता ऑपरेटिंग सिस्टम और डिवाइस के अनुसार अलग होती है।",
  es:
    "La compatibilidad con idiomas depende de las voces del sistema instaladas en el dispositivo. La lista exacta, la calidad de pronunciación y la disponibilidad sin conexión varían según el sistema operativo y el dispositivo.",
  fr:
    "La prise en charge des langues dépend des voix système installées sur l’appareil. La liste exacte, la qualité de prononciation et la disponibilité hors ligne varient selon le système d’exploitation et l’appareil.",
  it:
    "Il supporto linguistico dipende dalle voci di sistema installate sul dispositivo. L’elenco esatto, la qualità della pronuncia e la disponibilità offline variano in base al sistema operativo e al dispositivo.",
  pt:
    "O suporte de idiomas depende das vozes do sistema instaladas no dispositivo. A lista exata, a qualidade da pronúncia e a disponibilidade offline variam consoante o sistema operativo e o dispositivo.",
};

const GERMAN_PROVIDER_API_KEY_PLACEHOLDER_OVERRIDES: Partial<
  Record<Provider, string>
> = {
  openai: "sk-...",
  anthropic: "sk-ant-...",
  gemini: "Gemini API key|project-id|access-token|us",
  xai: "xai-...",
  deepseek: "sk-...",
  mistral: "API-Schlüssel eingeben",
};

const UKRAINIAN_PROVIDER_API_KEY_PLACEHOLDER_OVERRIDES: Partial<
  Record<Provider, string>
> = {
  mistral: "Введіть ключ API",
};

const HINDI_PROVIDER_API_KEY_PLACEHOLDER_OVERRIDES: Partial<
  Record<Provider, string>
> = {
  mistral: "API कुंजी दर्ज करें",
};

const SPANISH_PROVIDER_API_KEY_PLACEHOLDER_OVERRIDES: Partial<
  Record<Provider, string>
> = {
  mistral: "Introduce la clave de API",
};

const FRENCH_PROVIDER_API_KEY_PLACEHOLDER_OVERRIDES: Partial<
  Record<Provider, string>
> = {
  mistral: "Saisissez la clé API",
};

const ITALIAN_PROVIDER_API_KEY_PLACEHOLDER_OVERRIDES: Partial<
  Record<Provider, string>
> = {
  mistral: "Inserisci la chiave API",
};

const PORTUGUESE_PROVIDER_API_KEY_PLACEHOLDER_OVERRIDES: Partial<
  Record<Provider, string>
> = {
  mistral: "Introduza a chave API",
};

const PROVIDER_API_KEY_PLACEHOLDERS_BY_LANGUAGE: Record<
  AppLanguage,
  Record<Provider, string>
> = {
  en: Object.fromEntries(
    PROVIDER_ORDER.map((provider) => [
      provider,
      PROVIDER_CONFIGS[provider].apiKeyPlaceholder,
    ]),
  ) as Record<Provider, string>,
  de: Object.fromEntries(
    PROVIDER_ORDER.map((provider) => [
      provider,
      GERMAN_PROVIDER_API_KEY_PLACEHOLDER_OVERRIDES[provider] ??
        PROVIDER_CONFIGS[provider].apiKeyPlaceholder,
    ]),
  ) as Record<Provider, string>,
  uk: Object.fromEntries(
    PROVIDER_ORDER.map((provider) => [
      provider,
      UKRAINIAN_PROVIDER_API_KEY_PLACEHOLDER_OVERRIDES[provider] ??
        PROVIDER_CONFIGS[provider].apiKeyPlaceholder,
    ]),
  ) as Record<Provider, string>,
  hi: Object.fromEntries(
    PROVIDER_ORDER.map((provider) => [
      provider,
      HINDI_PROVIDER_API_KEY_PLACEHOLDER_OVERRIDES[provider] ??
        PROVIDER_CONFIGS[provider].apiKeyPlaceholder,
    ]),
  ) as Record<Provider, string>,
  es: Object.fromEntries(
    PROVIDER_ORDER.map((provider) => [
      provider,
      SPANISH_PROVIDER_API_KEY_PLACEHOLDER_OVERRIDES[provider] ??
        PROVIDER_CONFIGS[provider].apiKeyPlaceholder,
    ]),
  ) as Record<Provider, string>,
  fr: Object.fromEntries(
    PROVIDER_ORDER.map((provider) => [
      provider,
      FRENCH_PROVIDER_API_KEY_PLACEHOLDER_OVERRIDES[provider] ??
        PROVIDER_CONFIGS[provider].apiKeyPlaceholder,
    ]),
  ) as Record<Provider, string>,
  it: Object.fromEntries(
    PROVIDER_ORDER.map((provider) => [
      provider,
      ITALIAN_PROVIDER_API_KEY_PLACEHOLDER_OVERRIDES[provider] ??
        PROVIDER_CONFIGS[provider].apiKeyPlaceholder,
    ]),
  ) as Record<Provider, string>,
  pt: Object.fromEntries(
    PROVIDER_ORDER.map((provider) => [
      provider,
      PORTUGUESE_PROVIDER_API_KEY_PLACEHOLDER_OVERRIDES[provider] ??
        PROVIDER_CONFIGS[provider].apiKeyPlaceholder,
    ]),
  ) as Record<Provider, string>,
};

const GENERIC_PROVIDER_API_KEY_HINTS: Record<AppLanguage, string> = {
  en:
    "Paste credentials for an external service you already use. Keys stay on this device and are used only for requests you start in the app.",
  de:
    "Füge Zugangsdaten für einen externen Dienst ein, den du bereits nutzt. Keys bleiben auf diesem Gerät und werden nur für Anfragen verwendet, die du in der App startest.",
  uk:
    "Вставте облікові дані зовнішнього сервісу, яким уже користуєтеся. Ключі зберігаються на цьому пристрої та використовуються лише для запитів, які ви запускаєте в застосунку.",
  hi:
    "जिस बाहरी सेवा का आप पहले से उपयोग करते हैं, उसके क्रेडेंशियल यहाँ पेस्ट करें। कुंजियाँ इसी डिवाइस पर रहती हैं और केवल ऐप में आपके शुरू किए गए अनुरोधों के लिए उपयोग होती हैं।",
  es:
    "Pega las credenciales de un servicio externo que ya utilices. Las claves permanecen en este dispositivo y solo se usan para las solicitudes que inicies en la app.",
  fr:
    "Collez les identifiants d’un service externe que vous utilisez déjà. Les clés restent sur cet appareil et ne servent qu’aux requêtes que vous lancez dans l’app.",
  it:
    "Incolla le credenziali di un servizio esterno che utilizzi già. Le chiavi restano su questo dispositivo e vengono usate solo per le richieste che avvii nell’app.",
  pt:
    "Cole as credenciais de um serviço externo que já utiliza. As chaves permanecem neste dispositivo e são usadas apenas nos pedidos que inicia na aplicação.",
};

const PROVIDER_API_KEY_HINT_OVERRIDES: Partial<
  Record<AppLanguage, Partial<Record<Provider, string>>>
> = {
  en: {
    openrouter: `${GENERIC_PROVIDER_API_KEY_HINTS.en} One OpenRouter key unlocks the curated gateway models below. Requests pass through OpenRouter to the selected upstream provider; direct provider keys remain separate.`,
    elevenlabs: `${GENERIC_PROVIDER_API_KEY_HINTS.en} Restricted ElevenLabs keys need Text to Speech permission for TTS and Speech to Text permission for STT. Voices read is optional and only unlocks the account voice library.`,
    "moonshot-ai-kimi": `${GENERIC_PROVIDER_API_KEY_HINTS.en} Kimi K3 requires at least one successful $1 account top-up before Moonshot unlocks access.`,
  },
  de: {
    openrouter: `${GENERIC_PROVIDER_API_KEY_HINTS.de} Ein OpenRouter-Key schaltet die kuratierten Gateway-Modelle frei. Anfragen laufen über OpenRouter zum ausgewählten Upstream-Anbieter; direkte Anbieter-Keys bleiben getrennt.`,
    elevenlabs: `${GENERIC_PROVIDER_API_KEY_HINTS.de} Eingeschränkte ElevenLabs-Keys benötigen für TTS die Berechtigung „Text to Speech“ und für STT „Speech to Text“. „Voices read“ ist optional und schaltet nur die persönliche Stimmenbibliothek frei.`,
    "moonshot-ai-kimi": `${GENERIC_PROVIDER_API_KEY_HINTS.de} Moonshot schaltet Kimi K3 erst nach einer erfolgreichen Kontoaufladung von mindestens 1 USD frei.`,
  },
  uk: {
    openrouter: `${GENERIC_PROVIDER_API_KEY_HINTS.uk} Один ключ OpenRouter відкриває доступ до наведених нижче моделей шлюзу. Запити проходять через OpenRouter до вибраного кінцевого провайдера; прямі ключі провайдерів залишаються окремими.`,
    elevenlabs: `${GENERIC_PROVIDER_API_KEY_HINTS.uk} Обмеженим ключам ElevenLabs потрібен дозвіл Text to Speech для TTS і Speech to Text для STT. Дозвіл Voices read необов’язковий і лише відкриває бібліотеку голосів облікового запису.`,
    "moonshot-ai-kimi": `${GENERIC_PROVIDER_API_KEY_HINTS.uk} Moonshot відкриває доступ до Kimi K3 після щонайменше одного успішного поповнення рахунку на 1 долар США.`,
  },
  hi: {
    openrouter: `${GENERIC_PROVIDER_API_KEY_HINTS.hi} एक OpenRouter कुंजी नीचे दिए गए चुने हुए गेटवे मॉडल खोलती है। अनुरोध OpenRouter से चुने गए मूल प्रदाता तक जाते हैं; सीधे प्रदाता की कुंजियाँ अलग रहती हैं।`,
    elevenlabs: `${GENERIC_PROVIDER_API_KEY_HINTS.hi} सीमित ElevenLabs कुंजियों को TTS के लिए Text to Speech और STT के लिए Speech to Text अनुमति चाहिए। Voices read वैकल्पिक है और केवल खाते की आवाज़ लाइब्रेरी खोलता है।`,
    "moonshot-ai-kimi": `${GENERIC_PROVIDER_API_KEY_HINTS.hi} Moonshot, Kimi K3 की पहुँच कम से कम 1 अमेरिकी डॉलर के एक सफल खाते के टॉप-अप के बाद खोलता है।`,
  },
  es: {
    openrouter: `${GENERIC_PROVIDER_API_KEY_HINTS.es} Una clave de OpenRouter desbloquea los modelos de pasarela seleccionados que aparecen abajo. Las solicitudes pasan por OpenRouter hasta el proveedor de origen elegido; las claves directas de los proveedores siguen separadas.`,
    elevenlabs: `${GENERIC_PROVIDER_API_KEY_HINTS.es} Las claves restringidas de ElevenLabs necesitan el permiso Text to Speech para TTS y Speech to Text para STT. Voices read es opcional y solo desbloquea la biblioteca de voces de la cuenta.`,
    "moonshot-ai-kimi": `${GENERIC_PROVIDER_API_KEY_HINTS.es} Moonshot desbloquea el acceso a Kimi K3 después de una recarga correcta de al menos 1 USD.`,
  },
  fr: {
    openrouter: `${GENERIC_PROVIDER_API_KEY_HINTS.fr} Une clé OpenRouter déverrouille les modèles de passerelle sélectionnés ci-dessous. Les requêtes passent par OpenRouter vers le fournisseur en amont choisi ; les clés directes des fournisseurs restent séparées.`,
    elevenlabs: `${GENERIC_PROVIDER_API_KEY_HINTS.fr} Les clés ElevenLabs restreintes nécessitent l’autorisation Text to Speech pour le TTS et Speech to Text pour le STT. Voices read est facultatif et déverrouille uniquement la bibliothèque de voix du compte.`,
    "moonshot-ai-kimi": `${GENERIC_PROVIDER_API_KEY_HINTS.fr} Moonshot déverrouille l’accès à Kimi K3 après au moins un rechargement réussi de 1 USD.`,
  },
  it: {
    openrouter: `${GENERIC_PROVIDER_API_KEY_HINTS.it} Una chiave OpenRouter sblocca i modelli gateway selezionati qui sotto. Le richieste passano tramite OpenRouter al provider a monte scelto; le chiavi dirette dei provider restano separate.`,
    elevenlabs: `${GENERIC_PROVIDER_API_KEY_HINTS.it} Le chiavi ElevenLabs con restrizioni richiedono l’autorizzazione Text to Speech per il TTS e Speech to Text per lo STT. Voices read è facoltativo e sblocca solo la libreria vocale dell’account.`,
    "moonshot-ai-kimi": `${GENERIC_PROVIDER_API_KEY_HINTS.it} Moonshot sblocca l’accesso a Kimi K3 dopo almeno una ricarica riuscita di 1 USD.`,
  },
  pt: {
    openrouter: `${GENERIC_PROVIDER_API_KEY_HINTS.pt} Uma chave OpenRouter desbloqueia os modelos de gateway selecionados abaixo. Os pedidos passam pelo OpenRouter para o fornecedor de origem escolhido; as chaves diretas dos fornecedores permanecem separadas.`,
    elevenlabs: `${GENERIC_PROVIDER_API_KEY_HINTS.pt} As chaves ElevenLabs restritas precisam da permissão Text to Speech para TTS e Speech to Text para STT. Voices read é opcional e apenas desbloqueia a biblioteca de vozes da conta.`,
    "moonshot-ai-kimi": `${GENERIC_PROVIDER_API_KEY_HINTS.pt} A Moonshot desbloqueia o acesso ao Kimi K3 depois de pelo menos um carregamento bem-sucedido de 1 USD.`,
  },
};

const PROVIDER_STT_LANGUAGE_NOTES_BY_LANGUAGE: Partial<
  Record<AppLanguage, Partial<Record<Provider, string>>>
> = {
  en: Object.fromEntries(
    PROVIDER_ORDER.flatMap((provider) =>
      PROVIDER_CONFIGS[provider].sttLanguageNote
        ? [[provider, PROVIDER_CONFIGS[provider].sttLanguageNote]]
        : [],
    ),
  ) as Partial<Record<Provider, string>>,
  de: {
    openai:
      `OpenAI bietet aktuell gpt-4o-transcribe, gpt-4o-mini-transcribe und whisper-1 für Speech-to-Text an. Der von OpenAI veröffentlichte Satz gut unterstützter Sprachen lautet: ${WHISPER_WELL_SUPPORTED_LANGUAGES}`,
    mistral:
      "Die aktuelle Voxtral-Transkriptionsroute ist für Englisch, Spanisch, Französisch, Portugiesisch, Hindi, Deutsch, Niederländisch und Italienisch dokumentiert.",
  },
  uk: {
    openai:
      `OpenAI зараз пропонує gpt-4o-transcribe, gpt-4o-mini-transcribe і whisper-1 для розпізнавання мовлення. Оприлюднений OpenAI перелік мов із належною підтримкою: ${WHISPER_WELL_SUPPORTED_LANGUAGES}`,
    mistral:
      "Поточний маршрут розпізнавання Voxtral документовано для англійської, іспанської, французької, португальської, гінді, німецької, нідерландської та італійської мов.",
  },
  hi: {
    openai:
      `OpenAI अभी स्पीच-टू-टेक्स्ट के लिए gpt-4o-transcribe, gpt-4o-mini-transcribe और whisper-1 देता है। OpenAI की प्रकाशित अच्छी तरह समर्थित भाषाओं की सूची: ${WHISPER_WELL_SUPPORTED_LANGUAGES}`,
    mistral:
      "मौजूदा Voxtral ट्रांसक्रिप्शन मार्ग अंग्रेज़ी, स्पेनिश, फ़्रेंच, पुर्तगाली, हिन्दी, जर्मन, डच और इतालवी के लिए प्रलेखित है।",
  },
  es: {
    openai:
      `OpenAI ofrece actualmente gpt-4o-transcribe, gpt-4o-mini-transcribe y whisper-1 para convertir voz en texto. La lista publicada por OpenAI de idiomas con buena compatibilidad es: ${WHISPER_WELL_SUPPORTED_LANGUAGES}`,
    mistral:
      "La ruta de transcripción actual de Voxtral está documentada para inglés, español, francés, portugués, hindi, alemán, neerlandés e italiano.",
  },
  fr: {
    openai:
      `OpenAI propose actuellement gpt-4o-transcribe, gpt-4o-mini-transcribe et whisper-1 pour la transcription vocale. La liste des langues bien prises en charge publiée par OpenAI est : ${WHISPER_WELL_SUPPORTED_LANGUAGES}`,
    mistral:
      "La route de transcription Voxtral actuelle est documentée pour l’anglais, l’espagnol, le français, le portugais, l’hindi, l’allemand, le néerlandais et l’italien.",
  },
  it: {
    openai:
      `OpenAI offre attualmente gpt-4o-transcribe, gpt-4o-mini-transcribe e whisper-1 per la trascrizione vocale. L’elenco delle lingue ben supportate pubblicato da OpenAI è: ${WHISPER_WELL_SUPPORTED_LANGUAGES}`,
    mistral:
      "L’attuale percorso di trascrizione Voxtral è documentato per inglese, spagnolo, francese, portoghese, hindi, tedesco, olandese e italiano.",
  },
  pt: {
    openai:
      `A OpenAI disponibiliza atualmente gpt-4o-transcribe, gpt-4o-mini-transcribe e whisper-1 para conversão de voz em texto. A lista de idiomas bem suportados publicada pela OpenAI é: ${WHISPER_WELL_SUPPORTED_LANGUAGES}`,
    mistral:
      "A rota de transcrição Voxtral atual está documentada para inglês, espanhol, francês, português, hindi, alemão, neerlandês e italiano.",
  },
};

const PROVIDER_TTS_LANGUAGE_NOTES_BY_LANGUAGE: Partial<
  Record<AppLanguage, Partial<Record<Provider, string>>>
> = {
  en: Object.fromEntries(
    PROVIDER_ORDER.flatMap((provider) =>
      PROVIDER_CONFIGS[provider].ttsLanguageNote
        ? [[provider, PROVIDER_CONFIGS[provider].ttsLanguageNote]]
        : [],
    ),
  ) as Partial<Record<Provider, string>>,
  de: {
    openai:
      "OpenAI bietet aktuell gpt-4o-mini-tts, tts-1 und tts-1-hd für Text-to-Speech an. OpenAI veröffentlicht für TTS keine so kompakte Liste gut unterstützter Sprachen wie für STT und weist darauf hin, dass die Stimmen für Englisch optimiert sind.",
    gemini:
      "Gemini TTS unterstützt aktuell Arabisch, Bengalisch, Niederländisch, Englisch, Französisch, Deutsch, Hindi, Indonesisch, Italienisch, Japanisch, Koreanisch, Mandarin, Polnisch, Portugiesisch, Rumänisch, Russisch, Spanisch, Tamil, Telugu, Thai, Türkisch, Ukrainisch, Urdu und Vietnamesisch.",
    xai:
      "xAI TTS unterstützt aktuell Arabisch, Niederländisch, Englisch, Französisch, Deutsch, Hindi, Indonesisch, Italienisch, Japanisch, Koreanisch, Polnisch, Portugiesisch, Russisch, Spanisch, Thai, Türkisch, Vietnamesisch und Chinesisch.",
  },
  uk: {
    openai:
      "OpenAI зараз пропонує gpt-4o-mini-tts, tts-1 і tts-1-hd для синтезу мовлення. OpenAI не публікує такого ж стислого переліку мов із належною підтримкою, як для STT, і зазначає, що голоси оптимізовано для англійської.",
    gemini:
      "Gemini TTS зараз підтримує арабську, бенгальську, нідерландську, англійську, французьку, німецьку, гінді, індонезійську, італійську, японську, корейську, мандаринську китайську, польську, португальську, румунську, російську, іспанську, тамільську, телугу, тайську, турецьку, українську, урду та в’єтнамську.",
    xai:
      "xAI TTS зараз підтримує арабську, нідерландську, англійську, французьку, німецьку, гінді, індонезійську, італійську, японську, корейську, польську, португальську, російську, іспанську, тайську, турецьку, в’єтнамську та китайську.",
  },
  hi: {
    openai:
      "OpenAI अभी टेक्स्ट-टू-स्पीच के लिए gpt-4o-mini-tts, tts-1 और tts-1-hd देता है। OpenAI, STT जैसी छोटी समर्थित भाषा सूची TTS के लिए प्रकाशित नहीं करता और बताता है कि आवाज़ें अंग्रेज़ी के लिए अनुकूलित हैं।",
    gemini:
      "Gemini TTS अभी अरबी, बंगाली, डच, अंग्रेज़ी, फ़्रेंच, जर्मन, हिन्दी, इंडोनेशियाई, इतालवी, जापानी, कोरियाई, मंदारिन चीनी, पोलिश, पुर्तगाली, रोमानियाई, रूसी, स्पेनिश, तमिल, तेलुगु, थाई, तुर्की, यूक्रेनी, उर्दू और वियतनामी का समर्थन करता है।",
    xai:
      "xAI TTS अभी अरबी, डच, अंग्रेज़ी, फ़्रेंच, जर्मन, हिन्दी, इंडोनेशियाई, इतालवी, जापानी, कोरियाई, पोलिश, पुर्तगाली, रूसी, स्पेनिश, थाई, तुर्की, वियतनामी और चीनी का समर्थन करता है।",
  },
  es: {
    openai:
      "OpenAI ofrece actualmente gpt-4o-mini-tts, tts-1 y tts-1-hd para texto a voz. OpenAI no publica para TTS una lista compacta de idiomas con buena compatibilidad como la de STT e indica que las voces están optimizadas para el inglés.",
    gemini:
      "Gemini TTS admite actualmente árabe, bengalí, neerlandés, inglés, francés, alemán, hindi, indonesio, italiano, japonés, coreano, chino mandarín, polaco, portugués, rumano, ruso, español, tamil, telugu, tailandés, turco, ucraniano, urdu y vietnamita.",
    xai:
      "xAI TTS admite actualmente árabe, neerlandés, inglés, francés, alemán, hindi, indonesio, italiano, japonés, coreano, polaco, portugués, ruso, español, tailandés, turco, vietnamita y chino.",
  },
  fr: {
    openai:
      "OpenAI propose actuellement gpt-4o-mini-tts, tts-1 et tts-1-hd pour la synthèse vocale. OpenAI ne publie pas pour le TTS de liste compacte des langues bien prises en charge comme pour le STT et précise que les voix sont optimisées pour l’anglais.",
    gemini:
      "Gemini TTS prend actuellement en charge l’arabe, le bengali, le néerlandais, l’anglais, le français, l’allemand, l’hindi, l’indonésien, l’italien, le japonais, le coréen, le mandarin, le polonais, le portugais, le roumain, le russe, l’espagnol, le tamoul, le télougou, le thaï, le turc, l’ukrainien, l’ourdou et le vietnamien.",
    xai:
      "xAI TTS prend actuellement en charge l’arabe, le néerlandais, l’anglais, le français, l’allemand, l’hindi, l’indonésien, l’italien, le japonais, le coréen, le polonais, le portugais, le russe, l’espagnol, le thaï, le turc, le vietnamien et le chinois.",
  },
  it: {
    openai:
      "OpenAI offre attualmente gpt-4o-mini-tts, tts-1 e tts-1-hd per la sintesi vocale. OpenAI non pubblica per il TTS un elenco compatto delle lingue ben supportate come per lo STT e segnala che le voci sono ottimizzate per l’inglese.",
    gemini:
      "Gemini TTS supporta attualmente arabo, bengalese, olandese, inglese, francese, tedesco, hindi, indonesiano, italiano, giapponese, coreano, cinese mandarino, polacco, portoghese, rumeno, russo, spagnolo, tamil, telugu, thailandese, turco, ucraino, urdu e vietnamita.",
    xai:
      "xAI TTS supporta attualmente arabo, olandese, inglese, francese, tedesco, hindi, indonesiano, italiano, giapponese, coreano, polacco, portoghese, russo, spagnolo, thailandese, turco, vietnamita e cinese.",
  },
  pt: {
    openai:
      "A OpenAI disponibiliza atualmente gpt-4o-mini-tts, tts-1 e tts-1-hd para síntese de voz. A OpenAI não publica para TTS uma lista compacta de idiomas bem suportados como para STT e indica que as vozes estão otimizadas para inglês.",
    gemini:
      "O Gemini TTS suporta atualmente árabe, bengali, neerlandês, inglês, francês, alemão, hindi, indonésio, italiano, japonês, coreano, chinês mandarim, polaco, português, romeno, russo, espanhol, tâmil, telugu, tailandês, turco, ucraniano, urdu e vietnamita.",
    xai:
      "O xAI TTS suporta atualmente árabe, neerlandês, inglês, francês, alemão, hindi, indonésio, italiano, japonês, coreano, polaco, português, russo, espanhol, tailandês, turco, vietnamita e chinês.",
  },
};

type SpeechNoteFormatter = {
  voicesAcross: (voices: string, languages: string) => string;
  supportsLanguages: (languages: string) => string;
  multilingual: string;
  englishOptimized: string;
  duration: (value: number, unit: "hour" | "minute" | "second") => string;
  fileUploadUpTo: (limit: string) => string;
  approximateFileUpload: (limit: string) => string;
  approximateFileUploadRange: (minimum: string, maximum: string) => string;
  audioUpTo: (limit: string) => string;
};

const SPEECH_NOTE_FORMATTERS: Record<AppLanguage, SpeechNoteFormatter> = {
  en: {
    voicesAcross: (voices, languages) =>
      `${voices} voices across ${languages} languages`,
    supportsLanguages: (languages) => `Supports ${languages} languages`,
    multilingual: "Multilingual",
    englishOptimized: "Voices are optimized for English",
    duration: (value, unit) =>
      `${value} ${unit}${value === 1 ? "" : "s"}`,
    fileUploadUpTo: (limit) => `File upload up to ${limit}`,
    approximateFileUpload: (limit) =>
      `Approximate file upload limit ${limit}`,
    approximateFileUploadRange: (minimum, maximum) =>
      `Approximate file upload limit ${minimum} to ${maximum} depending on tier`,
    audioUpTo: (limit) => `Audio up to ${limit}`,
  },
  de: {
    voicesAcross: (voices, languages) =>
      `${voices} Stimmen in ${languages} Sprachen`,
    supportsLanguages: (languages) => `Unterstützt ${languages} Sprachen`,
    multilingual: "Mehrsprachig",
    englishOptimized: "Stimmen sind für Englisch optimiert",
    duration: (value, unit) => {
      const units = {
        hour: value === 1 ? "Stunde" : "Stunden",
        minute: value === 1 ? "Minute" : "Minuten",
        second: value === 1 ? "Sekunde" : "Sekunden",
      };
      return `${value} ${units[unit]}`;
    },
    fileUploadUpTo: (limit) => `Datei-Upload bis ${limit}`,
    approximateFileUpload: (limit) =>
      `Ungefährer Datei-Upload bis ${limit}`,
    approximateFileUploadRange: (minimum, maximum) =>
      `Ungefährer Datei-Upload zwischen ${minimum} und ${maximum} je nach Tarif`,
    audioUpTo: (limit) => `Audio bis ${limit}`,
  },
  uk: {
    voicesAcross: (voices, languages) =>
      `${voices} голосів для ${languages} мов`,
    supportsLanguages: (languages) => `Підтримує мов: ${languages}`,
    multilingual: "Багатомовний",
    englishOptimized: "Голоси оптимізовано для англійської",
    duration: (value, unit) =>
      `${value} ${{ hour: "год", minute: "хв", second: "с" }[unit]}`,
    fileUploadUpTo: (limit) => `Завантаження файлів до ${limit}`,
    approximateFileUpload: (limit) => `Орієнтовний ліміт файлу: ${limit}`,
    approximateFileUploadRange: (minimum, maximum) =>
      `Орієнтовний ліміт файлу від ${minimum} до ${maximum} залежно від тарифу`,
    audioUpTo: (limit) => `Аудіо до ${limit}`,
  },
  hi: {
    voicesAcross: (voices, languages) =>
      `${languages} भाषाओं में ${voices} आवाज़ें`,
    supportsLanguages: (languages) => `${languages} भाषाओं का समर्थन`,
    multilingual: "बहुभाषी",
    englishOptimized: "आवाज़ें अंग्रेज़ी के लिए अनुकूलित हैं",
    duration: (value, unit) =>
      `${value} ${{ hour: "घंटे", minute: "मिनट", second: "सेकंड" }[unit]}`,
    fileUploadUpTo: (limit) => `${limit} तक फ़ाइल अपलोड`,
    approximateFileUpload: (limit) =>
      `फ़ाइल अपलोड की अनुमानित सीमा ${limit}`,
    approximateFileUploadRange: (minimum, maximum) =>
      `प्लान के अनुसार फ़ाइल अपलोड की अनुमानित सीमा ${minimum} से ${maximum}`,
    audioUpTo: (limit) => `${limit} तक ऑडियो`,
  },
  es: {
    voicesAcross: (voices, languages) =>
      `${voices} voces en ${languages} idiomas`,
    supportsLanguages: (languages) => `Admite ${languages} idiomas`,
    multilingual: "Multilingüe",
    englishOptimized: "Las voces están optimizadas para el inglés",
    duration: (value, unit) => {
      const units = {
        hour: value === 1 ? "hora" : "horas",
        minute: value === 1 ? "minuto" : "minutos",
        second: value === 1 ? "segundo" : "segundos",
      };
      return `${value} ${units[unit]}`;
    },
    fileUploadUpTo: (limit) => `Carga de archivos de hasta ${limit}`,
    approximateFileUpload: (limit) =>
      `Límite aproximado de carga de archivos: ${limit}`,
    approximateFileUploadRange: (minimum, maximum) =>
      `Límite aproximado de carga de archivos de ${minimum} a ${maximum}, según el plan`,
    audioUpTo: (limit) => `Audio de hasta ${limit}`,
  },
  fr: {
    voicesAcross: (voices, languages) =>
      `${voices} voix dans ${languages} langues`,
    supportsLanguages: (languages) => `Prend en charge ${languages} langues`,
    multilingual: "Multilingue",
    englishOptimized: "Les voix sont optimisées pour l’anglais",
    duration: (value, unit) => {
      const units = {
        hour: value === 1 ? "heure" : "heures",
        minute: value === 1 ? "minute" : "minutes",
        second: value === 1 ? "seconde" : "secondes",
      };
      return `${value} ${units[unit]}`;
    },
    fileUploadUpTo: (limit) => `Import de fichiers jusqu’à ${limit}`,
    approximateFileUpload: (limit) =>
      `Limite approximative d’import de fichiers : ${limit}`,
    approximateFileUploadRange: (minimum, maximum) =>
      `Limite approximative d’import de fichiers de ${minimum} à ${maximum} selon l’offre`,
    audioUpTo: (limit) => `Audio jusqu’à ${limit}`,
  },
  it: {
    voicesAcross: (voices, languages) =>
      `${voices} voci in ${languages} lingue`,
    supportsLanguages: (languages) => `Supporta ${languages} lingue`,
    multilingual: "Multilingue",
    englishOptimized: "Le voci sono ottimizzate per l’inglese",
    duration: (value, unit) => {
      const units = {
        hour: value === 1 ? "ora" : "ore",
        minute: value === 1 ? "minuto" : "minuti",
        second: value === 1 ? "secondo" : "secondi",
      };
      return `${value} ${units[unit]}`;
    },
    fileUploadUpTo: (limit) => `Caricamento file fino a ${limit}`,
    approximateFileUpload: (limit) =>
      `Limite approssimativo di caricamento: ${limit}`,
    approximateFileUploadRange: (minimum, maximum) =>
      `Limite approssimativo di caricamento da ${minimum} a ${maximum}, in base al piano`,
    audioUpTo: (limit) => `Audio fino a ${limit}`,
  },
  pt: {
    voicesAcross: (voices, languages) =>
      `${voices} vozes em ${languages} idiomas`,
    supportsLanguages: (languages) => `Suporta ${languages} idiomas`,
    multilingual: "Multilingue",
    englishOptimized: "As vozes estão otimizadas para inglês",
    duration: (value, unit) => {
      const units = {
        hour: value === 1 ? "hora" : "horas",
        minute: value === 1 ? "minuto" : "minutos",
        second: value === 1 ? "segundo" : "segundos",
      };
      return `${value} ${units[unit]}`;
    },
    fileUploadUpTo: (limit) => `Carregamento de ficheiros até ${limit}`,
    approximateFileUpload: (limit) =>
      `Limite aproximado de carregamento de ficheiros: ${limit}`,
    approximateFileUploadRange: (minimum, maximum) =>
      `Limite aproximado de carregamento de ficheiros de ${minimum} a ${maximum}, consoante o plano`,
    audioUpTo: (limit) => `Áudio até ${limit}`,
  },
};

export function getNativeSttLanguageNote(language: AppLanguage) {
  return NATIVE_STT_LANGUAGE_NOTES_BY_LANGUAGE[language];
}

export function getNativeTtsLanguageNote(language: AppLanguage) {
  return NATIVE_TTS_LANGUAGE_NOTES_BY_LANGUAGE[language];
}

export function getProviderApiKeyHint(provider: Provider, language: AppLanguage) {
  return (
    PROVIDER_API_KEY_HINT_OVERRIDES[language]?.[provider] ??
    GENERIC_PROVIDER_API_KEY_HINTS[language]
  );
}

export function getProviderApiKeyPlaceholder(
  provider: Provider,
  language: AppLanguage,
) {
  return PROVIDER_API_KEY_PLACEHOLDERS_BY_LANGUAGE[language][provider];
}

function getProviderSttLanguageNote(
  provider: Provider,
  language: AppLanguage,
) {
  return PROVIDER_STT_LANGUAGE_NOTES_BY_LANGUAGE[language]?.[provider] ?? null;
}

function formatApproximateCount(
  value: number,
  rawText: string | null,
) {
  return rawText?.includes(`${value}+`) ? `${value}+` : `${value}`;
}

function buildCatalogSpeechLanguageNote(params: {
  provider: Provider;
  modelId: string;
  service: "stt" | "tts";
  language: AppLanguage;
}) {
  const model = getCatalogModelForAppProvider(
    params.provider,
    params.modelId,
    params.service,
  );

  if (!model) {
    return null;
  }

  const languageSupport = model.languageSupport;

  if (!languageSupport) {
    return null;
  }

  const parts: string[] = [];

  if (languageSupport.voiceCount && languageSupport.languageCount) {
    const voiceCount = formatApproximateCount(
      languageSupport.voiceCount,
      languageSupport.rawText,
    );
    const languageCount = formatApproximateCount(
      languageSupport.languageCount,
      languageSupport.rawText,
    );

    parts.push(
      SPEECH_NOTE_FORMATTERS[params.language].voicesAcross(
        voiceCount,
        languageCount,
      ),
    );
  } else if (languageSupport.languageCount) {
    const languageCount = formatApproximateCount(
      languageSupport.languageCount,
      languageSupport.rawText,
    );

    parts.push(
      SPEECH_NOTE_FORMATTERS[params.language].supportsLanguages(languageCount),
    );
  } else if (
    languageSupport.isMultilingual &&
    languageSupport.notes.includes("english-optimized")
  ) {
    parts.push(SPEECH_NOTE_FORMATTERS[params.language].multilingual);
  }

  if (languageSupport.notes.includes("english-optimized")) {
    parts.push(SPEECH_NOTE_FORMATTERS[params.language].englishOptimized);
  }

  if (!parts.length) {
    return null;
  }

  return `${parts.join(". ")}.`;
}

export function getProviderSttLanguageNoteForModel(
  provider: Provider,
  modelId: string,
  language: AppLanguage,
) {
  return (
    buildCatalogSpeechLanguageNote({
      provider,
      modelId,
      service: "stt",
      language,
    }) ?? getProviderSttLanguageNote(provider, language)
  );
}

function formatByteLimit(bytes: number) {
  if (bytes % (1024 * 1024 * 1024) === 0) {
    return `${bytes / (1024 * 1024 * 1024)} GiB`;
  }

  if (bytes % (1024 * 1024) === 0) {
    return `${bytes / (1024 * 1024)} MiB`;
  }

  if (bytes >= 1_000_000_000) {
    return `${(bytes / 1_000_000_000).toFixed(1).replace(/\.0$/, "")} GB`;
  }

  if (bytes >= 1_000_000) {
    return `${(bytes / 1_000_000).toFixed(1).replace(/\.0$/, "")} MB`;
  }

  if (bytes >= 1_000) {
    return `${(bytes / 1_000).toFixed(1).replace(/\.0$/, "")} KB`;
  }

  return `${bytes} B`;
}

function formatDurationLimit(seconds: number, language: AppLanguage) {
  const formatter = SPEECH_NOTE_FORMATTERS[language];
  if (seconds % 3600 === 0) {
    const hours = seconds / 3600;
    return formatter.duration(hours, "hour");
  }

  if (seconds % 60 === 0) {
    const minutes = seconds / 60;
    return formatter.duration(minutes, "minute");
  }

  return formatter.duration(seconds, "second");
}

export function getProviderSttLimitNote(
  provider: Provider,
  modelId: string,
  language: AppLanguage,
) {
  const constraints = getCatalogConstraintsForAppProvider(
    provider,
    modelId,
    "stt",
  );
  const parts: string[] = [];

  const exactFileSizeLimit = getStrictestCatalogMaxConstraint(
    constraints,
    "file_size_bytes",
  );
  const approximateFileSizeLimits = constraints
    .filter(
      (constraint) =>
        constraint.metric === "file_size_bytes" && constraint.comparator === "~",
    )
    .sort((left, right) => left.value - right.value);

  if (exactFileSizeLimit) {
    parts.push(
      SPEECH_NOTE_FORMATTERS[language].fileUploadUpTo(
        formatByteLimit(exactFileSizeLimit.value),
      ),
    );
  } else if (approximateFileSizeLimits.length === 1) {
    parts.push(
      SPEECH_NOTE_FORMATTERS[language].approximateFileUpload(
        formatByteLimit(approximateFileSizeLimits[0].value),
      ),
    );
  } else if (approximateFileSizeLimits.length > 1) {
    parts.push(
      SPEECH_NOTE_FORMATTERS[language].approximateFileUploadRange(
        formatByteLimit(approximateFileSizeLimits[0].value),
        formatByteLimit(
          approximateFileSizeLimits[approximateFileSizeLimits.length - 1].value,
        ),
      ),
    );
  }

  const durationLimit = [
    getStrictestCatalogMaxConstraint(constraints, "duration_seconds"),
    getStrictestCatalogMaxConstraint(constraints, "session_duration_seconds"),
  ]
    .filter((constraint): constraint is NonNullable<typeof constraint> => !!constraint)
    .sort((left, right) => left.value - right.value)[0];

  if (durationLimit) {
    parts.push(
      SPEECH_NOTE_FORMATTERS[language].audioUpTo(
        formatDurationLimit(durationLimit.value, language),
      ),
    );
  }

  if (!parts.length) {
    return null;
  }

  return `${parts.join(". ")}.`;
}

function getProviderTtsLanguageNote(
  provider: Provider,
  language: AppLanguage,
) {
  return PROVIDER_TTS_LANGUAGE_NOTES_BY_LANGUAGE[language]?.[provider] ?? null;
}

export function getProviderTtsLanguageNoteForModel(
  provider: Provider,
  modelId: string,
  language: AppLanguage,
) {
  return (
    buildCatalogSpeechLanguageNote({
      provider,
      modelId,
      service: "tts",
      language,
    }) ?? getProviderTtsLanguageNote(provider, language)
  );
}
