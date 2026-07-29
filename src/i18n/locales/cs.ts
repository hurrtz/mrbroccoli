import type { TranslationDictionary } from "../types";

export const cs = {
  appName: "Pan Brokolice",
  retry: "Zkuste to znovu",
  dismiss: "Zavřít",
  done: "Hotovo",
  aboutSetting: ({ setting }) => `O ${setting}`,
  unavailable: "Není k dispozici",
  selection: "Výběr",
  chooseCompatibleProviderFirst: "Nejprve vyberte kompatibilního poskytovatele",
  settings: "Nastavení",
  all: "Vše",
  firstRun: "První spuštění",
  instructions: "Instrukce",
  providers: "Poskytovatelé",
  webSearch: "Vyhledávání na webu",
  stt: "STT",
  tts: "TTS",
  ui: "UI",
  settingsRuntimeReadiness: "Připravenost za běhu",
  settingsReadinessThink: "Přemýšlejte",
  settingsReadinessListen: "Poslouchejte",
  settingsReadinessSpeak: "Mluvte",
  settingsReadinessSearch: "Hledat",
  settingsReadinessReady: "Připraveno",
  settingsReadinessNeedsAttention: "Pozor",
  settingsReadinessBroken: "Nefunkční",
  settingsReadinessOff: "Vypnuto",
  settingsConnections: "Spojení",
  settingsThinking: "Přemýšlení",
  settingsListening: "Poslouchání",
  settingsSpeaking: "Mluvení",
  settingsSearch: "Hledat",
  settingsAppDiagnostics: "Aplikace a diagnostika",
  settingsGuidedSetup: "Řízené nastavení",
  settingsGuidedSetupSummary:
    "Zkontrolujte připojení a otestujte kompletní hlasovou trasu.",
  setupGuideShowInSettings: "Zobrazit řízené nastavení v Nastavení",
  setupGuideShowInSettingsSummary:
    "Zobrazit nebo skrýt zástupce řízeného nastavení v přehledu Nastavení.",
  settingsConnectionsSummary: "Klíče poskytovatele, ověření a možnosti.",
  settingsThinkingSummary: "Domovské karty, modely, úsilí a systémová výzva.",
  settingsListeningSummary: "Režim zadávání a směrování řeči na text.",
  settingsSpeakingSummary: "Mluvené odpovědi, přehrávání, hlasy a náhledy.",
  settingsSearchSummary:
    "Poskytovatel webového vyhledávání a kontroly kvality vyhledávání.",
  settingsAppDiagnosticsSummary:
    "Téma, jazyk, použití, protokoly ladění a nedávná aktivita.",
  settingsBackToOverview: "Zpět na přehled",
  settingsOpenSection: ({ section }) => `Otevřete ${section}`,
  theme: "Motiv",
  language: "Jazyk",
  recognitionLanguage: "Jazyk rozpoznávání",
  recognitionLanguageHint:
    "Vyberte jazyk pro zlepšení rozpoznávání, nebo jej ponechte automaticky pro detekci zařízení nebo poskytovatele.",
  automaticLanguage: "Automaticky",
  speechLanguageUnsupportedByProvider: ({ provider, language }) =>
    `${provider} oficiálně nepodporuje ${language} pro tuto řečovou cestu.`,
  usageStats: "Statistiky použití",
  model: "Model",
  effort: "Náročnost",
  effortValue: ({ effort }) => `Náročnost: ${effort}`,
  modelEffortNone: "žádný",
  modelEffortMinimal: "Minimální",
  modelEffortLow: "Nízká",
  modelEffortMedium: "Střední",
  modelEffortHigh: "Vysoká",
  modelEffortExtraHigh: "Extra vysoká",
  modelEffortMax: "Max",
  modelEffortDynamic: "Dynamický",
  modelEffortDisabled: "Zakázáno",
  modelEffortEnabled: "Povoleno",
  fixed: "Pevné",
  english: "Angličtina",
  german: "Němčina",
  ukrainian: "Ukrajinština",
  hindi: "Hindština",
  spanish: "Španělština",
  french: "Francouzština",
  italian: "Italština",
  portuguese: "portugalština",
  portugueseBrazil: "portugalština (Brazílie)",
  russian: "Ruština",
  simplifiedChinese: "Zjednodušená čínština",
  arabic: "Arabština",
  japanese: "Japonština",
  hungarian: "Maďarština",
  czech: "Čeština",
  polish: "Polština",
  turkish: "Turečtina",
  swedish: "Švédština",
  kokoroAmericanFemaleVoice: ({ name }) => `${name} · Americký ženský hlas`,
  kokoroBritishFemaleVoice: ({ name }) => `${name} · Britský ženský hlas`,
  kokoroChineseFemaleVoice: ({ index }) => `Čínský ženský hlas ${index}`,
  kokoroChineseMaleVoice: ({ index }) => `Čínský mužský hlas ${index}`,
  light: "Světlý",
  dark: "Tmavý",
  system: "Systém",
  languageCoverage: ({ note }) => `Jazykové pokrytí: ${note}`,
  recordingLimits: ({ note }) => `Limity nahrávání: ${note}`,
  catalogProviderPricingSummary: ({ summary }) => `Cena: ${summary}`,
  replyGenerationAction: "generování odpovědi",
  speechTranscriptionAction: "přepis řeči",
  instructionsTabDescription:
    "Vytvářejte skryté pokyny, které řídí asistenta dříve, než jakýkoli poskytovatel uvidí požadavek.",
  providersTabDescription:
    "Uložte přihlašovací údaje externí služby na zařízení a nakonfigurujte režimy odezvy, které chcete použít.",
  webSearchTabDescription:
    "Před odpověďmi nakonfigurujte volitelný živý webový kontext.",
  responseModes: "Výběr modelu",
  aboutModelSelection: "O výběru modelu",
  modelSelectionInfo:
    "Každý model karty se stane volbou na domovské obrazovce. Nakonfigurujte jeho poskytovatele, model a volitelnou úroveň úsilí a poté přepněte karty a vyberte, který model odpoví jako další.",
  responseModeItemTitle: ({ index }) => `Model ${index}`,
  addResponseMode: "Přidat model",
  removeResponseMode: "Odebrat model",
  responseModesNoConfiguredProviders:
    "Nejprve přidejte přihlašovací údaje. Ovládací prvky trasy zůstanou skryté, dokud nebude nakonfigurována alespoň jedna kompatibilní služba.",
  useResponseMode: ({ mode }) => `Použijte ${mode}`,
  chooseResponseModel: "Vyberte si model",
  responseModelCount: ({ count }) => `K dispozici: ${count} modelů`,
  sttTabDescription:
    "Kontrolujte, jak je řeč zachycována a který backend převádí zvuk na text, než se dostane do modelu.",
  ttsTabDescription:
    "Určete, kdy začnou mluvit odpovědi a který backend zpracovává mluvený výstup.",
  brief: "Stručný",
  briefDescription:
    "Udržujte odpověď pevně. Použijte minimální počet vět potřebný k úplné odpovědi uživatele.",
  normal: "Normální",
  normalDescription:
    "Zaměřte se na vyváženou délku odezvy. Zakryjte důležité body, aniž byste odpověď přetahovali.",
  thorough: "Důkladně",
  thoroughDescription:
    "Jděte do hloubky a buďte komplexní. Zahrňte nuance, detaily, kompromisy a zdůvodnění, na kterém záleží.",
  professional: "Profesionální",
  professionalDescription:
    "Mluvte jako senior konzultant informující klienta. Precizní jazyk, žádný slang, odměřený a směrodatný.",
  casual: "Neformální",
  casualDescription:
    "Mluvte jako chytrý přítel v kavárně. Uvolněné, přirozené, konverzační. Kontrakce jsou v pořádku, tečny v pořádku.",
  nerdy: "Nerdy",
  nerdyDescription:
    "Mluvte jako nadšený odborník, který miluje jít do hloubky. Používejte odbornou terminologii volně, hledejte detaily, předpokládejte, že uživatel může držet krok.",
  concise: "Stručné",
  conciseDescription:
    "Buďte co nejstručnější a přitom úplní. Žádná preambule, žádná výplň, jen odpověď. Myslete ve stylu telegramu.",
  socratic: "sokratovský",
  socraticDescription:
    "Vyzvěte myšlení uživatele. Ptejte se protiotázky, nabízejte alternativní pohledy, nejen potvrzujte, co řekli. Buďte sparing partnerem, ne strojem na ano.",
  eli5: "ELI5",
  eli5Description:
    "Vysvětlete vše co nejjednodušeji. Používejte analogie, každodenní jazyk, nulový žargon. Nepředpokládejte žádné předchozí znalosti o žádném tématu.",
  useProvider: ({ provider }) => `Použijte ${provider}`,
  createApiKey: "Pověření",
  apiKey: "API klíč",
  aboutThisProvider: "O tomto poskytovateli",
  openRouterOnboardingTitle: "Jeden klíč, více poskytovatelů",
  openRouterOnboardingDescription:
    "Vytvořte vyhrazený klíč OpenRouter, vložte jej níže a používejte modely se zálohou snímků od několika poskytovatelů, aniž byste nahradili jakékoli přímé připojení.",
  openRouterOnboardingRoute:
    "Cesta požadavku: toto zařízení → OpenRouter → vybraný upstream poskytovatel",
  openRouterKeys: "Klávesy OpenRouter",
  providerStatusInvalid: "Neplatné",
  providerStatusTesting: "Testování",
  providerStatusConfigured: "Nakonfigurováno",
  providerStatusWorking: "Práce",
  providerStatusNotTested: "Netestováno",
  providerStatusNotSetup: "Není nastaveno",
  expandProvider: ({ provider }) => `Rozbalte ${provider}`,
  collapseProvider: ({ provider }) => `Sbalit ${provider}`,
  testProviderKey: "Testovací klíč",
  testAllCapabilities: "Otestujte všechny",
  apiTest: "Test API",
  testProviderCapability: ({ capability }) => `Test ${capability}`,
  test: "Test",
  optional: "Volitelné",
  providerCapability_llm: "Odpovědi",
  providerCapability_stt: "Hlasový vstup",
  providerCapability_tts: "Hlasový výstup",
  providerCapability_search: "vyhledávání na webu",
  providerCapability_voices: "Hlasová knihovna",
  providerValidationUnavailable:
    "Ověření v reálném čase pro tohoto poskytovatele zatím není k dispozici. Uložte klíč zde a ověřte jej při skutečném používání.",
  providerNeedsAttention: "potřebuje pozornost",
  catalogProviderLimitsSummary: ({ summary }) => `Limity: ${summary}`,
  catalogProviderRegionSummary: ({ summary }) => `Oblast: ${summary}`,
  validatingKey: "Ověřování...",
  showKey: "Zobrazit klíč",
  hideKey: "Skrýt klíč",
  assistantInstructions: "Pokyny pro asistenta",
  systemPrompt: "Systémová výzva",
  aboutSystemPrompt: "O systémové výzvě",
  assistantInstructionsIntro:
    "Vytvarujte skryté navádění, které model obdrží před každou odpovědí.",
  baseInstructions: "Základní pokyny",
  assistantInstructionsPlaceholder: "Definujte, jak se má asistent chovat.",
  assistantInstructionsHint:
    "Toto je vždy předřazeno před zvolenou délkou odezvy a tónem.",
  adaptiveLength: "Adaptivní délka",
  responseTone: "Tón odezvy",
  homeStyleChipLabel: ({ tone, length }) => `Styl — ${tone} · ${length}`,
  styleSheetTitle: "Nastavení konverzace",
  styleSheetSubtitle: "Odpovědi a řeč ve tvaru pouze pro tuto konverzaci.",
  openStyleSheet: "Otevřete nastavení konverzace",
  conversationThinkingInstructions: "Návod k zamyšlení",
  conversationThinkingInstructionsDescription:
    "Po výzvě globálního systému pro tuto konverzaci přidejte pokyny.",
  conversationThinkingInstructionsPlaceholder:
    "Například: Vyzvěte mé domněnky a použijte konkrétní příklady.",
  ttsInstructions: "Pokyny pro doručení řeči",
  ttsInstructionsDescription:
    "Řídit tón, tempo, přízvuk nebo přednes používané kompatibilními modely řeči.",
  conversationTtsInstructionsDescription:
    "Po globálních hlasových pokynech pro tuto konverzaci přidejte pokyny pro doručení.",
  ttsInstructionsPlaceholder:
    "Například: Mluvte vřele, jasně a uvolněným tempem.",
  ttsInstructionsUnsupported:
    "Aktuální trasa řeči nepodporuje pokyny k doručení.",
  conversationVoiceDescription: ({ route }) =>
    `Vyberte hlas používaný ${route} v této konverzaci.`,
  scrollToLatest: "Přejděte na nejnovější zprávu",
  conversationTitleGenerate: "Automaticky vygenerovat název",
  conversationTitleGenerating: "Generování názvu…",
  conversationTitleGenerated: "Konverzace přejmenována.",
  conversationTitleNeedsContent: "Před vygenerováním názvu zahajte konverzaci.",
  conversationTitleNeedsProvider:
    "Před vygenerováním názvu nakonfigurujte vybraný model.",
  conversationTitleGenerationFailed:
    "Název konverzace se nepodařilo vygenerovat.",
  conversationTitleGenerationTimedOut:
    "Generování názvu trvalo příliš dlouho. Zkuste to prosím znovu.",
  inputMode: "Režim vstupu",
  voiceInput: "Hlasový vstup",
  pushToTalk: "Push to Talk",
  pushToTalkDescription:
    "Při mluvení podržte hlavní tlačítko a poté jej uvolněte pro odeslání.",
  toggleToTalk: "Přepnout na Talk",
  toggleToTalkDescription:
    "Jedním klepnutím spustíte nahrávání a po dokončení klepněte znovu.",
  driveSession: "Řídit relaci",
  driveSessionDescription:
    "Když je zapnuté automatické pokračování, nahrávání se spustí po každé vyslovené odpovědi. Až budete mluvit, klepněte na hlavní tlačítko.",
  stopDriveSession: "Pozastavit auto",
  repeatDriveReply: "Opakujte jako poslední",
  continueDriveSession: "Obnovit auto",
  speechToText: "Řeč na text",
  appNative: "Rozpoznávání systému",
  nativeSttDescription:
    "Použijte rozpoznávač řeči operačního systému. V závislosti na nastavení zařízení může rozpoznávání běžet na zařízení nebo prostřednictvím systémové služby. Není vyžadován žádný klíč poskytovatele.",
  provider: "Poskytovatel",
  webSearchProvider: "Poskytovatel vyhledávání na webu",
  webSearchProviderMissingHint:
    "Nakonfigurujte alespoň jednu službu s možností vyhledávání v přihlašovacích údajích, abyste zde povolili uzemnění webu.",
  webSearchModelHint: ({ model }) =>
    `Používá ${model} v zákulisí pro živé uzemnění webu.`,
  webSearchHomeHint:
    "Pomocí přepínače na domovské obrazovce zapněte nebo vypněte uzemnění webu pro toto vlákno.",
  settingsWebSearchCompactHint:
    "Volitelně před odpovědí hlavního modelu přidejte čerstvý webový kontext.",
  webSearchAdvanced: "Pokročilé ovládací prvky vyhledávání",
  expandAdvancedSearch: "Rozbalte pokročilé ovládací prvky vyhledávání",
  collapseAdvancedSearch: "Sbalit pokročilé ovládací prvky vyhledávání",
  webSearchSetupNeeded:
    "Chcete-li používat živé vyhledávání na webu, přidejte přihlašovací údaje.",
  webSearchEnabledDescription:
    "Před odpovědí modelu je přidán nový webový kontext.",
  webSearchDisabledDescription:
    "Pokud jsou aktuální fakta důležitá, použijte pro toto vlákno živý webový kontext.",
  webSearchQualityControls: "Kvalita vyhledávání",
  webSearchSearchMode: "Režim vyhledávání",
  webSearchSearchModeQuick: "Rychle",
  webSearchSearchModeBalanced: "Vyvážený",
  webSearchSearchModeDeep: "Hluboké",
  webSearchDepth: "Hloubka vyhledávání",
  webSearchDepthStandard: "Standardní",
  webSearchDepthDeep: "Hluboké",
  webSearchResultCount: "Počet výsledků",
  webSearchQualityHint: ({ provider }) =>
    `Tyto ovládací prvky ladí, jak ${provider} shromažďuje čerstvý kontext před odpovědí.`,
  webSearchNoExtraControls: ({ provider }) =>
    `${provider} zatím v této aplikaci nevystavuje další ovládací prvky kvality vyhledávání.`,
  setWebSearchMode: ({ mode }) =>
    `Nastavte režim vyhledávání na webu na ${mode}`,
  openWebSearchSettings: "Otevřete nastavení vyhledávání na webu",
  providerSttDescription:
    "Použijte nakonfigurovanou externí službu k přepisu vašeho hlasu před jeho odesláním do odpovědi.",
  sttProvider: "Poskytovatel STT",
  sttProviderEnabledHint:
    "Zde se zobrazují pouze povolení poskytovatelé s podporou přepisu.",
  sttProviderMissingHint:
    "Zde přidejte přihlašovací údaje pro službu s podporou STT.",
  nativeSttHint:
    "Rozpoznávání systému funguje nezávisle na klíčích vašeho poskytovatele a může být zpracováno v zařízení nebo hlasovou službou operačního systému.",
  replyPlayback: "Odpovědět Přehrávání",
  sentencesArrive: "Přicházejí odstavce",
  sentencesArriveDescription:
    "Začněte mluvit, jakmile je připraven celý odstavec.",
  fullReplyFirst: "Nejprve úplná odpověď",
  fullReplyFirstDescription:
    "Nejprve vygenerujte celou odpověď a poté ji přehrajte v jednom průchodu.",
  textToSpeech: "Převod textu na řeč",
  spokenReplies: "Mluvené odpovědi",
  spokenRepliesEnabledDescription:
    "Asistent čtení nahlas odpoví, když je k dispozici hlasová trasa.",
  spokenRepliesDisabledDescription:
    "Ponechat odpovědi zatím pouze textové. Vaše preferovaná trasa TTS zůstane uložena na později.",
  nativeTtsDescription:
    "Pro mluvené odpovědi a hlasový náhled použijte modul řeči zařízení.",
  kokoroTtsDescription:
    "Použijte mnohem přirozenější nervový hlas zcela na tomto zařízení. Text mluvené odpovědi je syntetizován lokálně, bez klíče poskytovatele řeči nebo poplatku za použití.",
  kokoroVoices: "Kokoro Hlasy na zařízení",
  kokoroVoicesHint: ({ size, installedSize }) =>
    `Vícejazyčný model stáhne přibližně ${size} MB a po instalaci zabere přibližně ${installedSize} MB.`,
  kokoroModel: "Kokoro vícejazyčný model",
  kokoroChecking: "Kontrola modelu v zařízení…",
  kokoroDownloading: ({ progress }) => `Stahování… ${progress}%`,
  kokoroExtracting: ({ progress }) => `Instalace… ${progress}%`,
  kokoroVerifying: "Ověřování hlasového modulu…",
  kokoroInstalled: "Nainstalované a připravené na tomto zařízení.",
  kokoroNotInstalled:
    "Volitelné stažení. Není vyžadován žádný klíč poskytovatele.",
  kokoroLanguageFallback:
    "Kokoro zde aktuálně mluví anglicky a zjednodušenou čínštinou. U ostatních vybraných jazyků odpovědí přidejte explicitní záložní trasu nebo se řeč zastaví s chybou.",
  kokoroRemoveTitle: "Odebrat model Kokoro?",
  kokoroRemoveBody: ({ installedSize }) =>
    `Tím se uvolní přibližně ${installedSize} MB. Model si můžete kdykoli znovu stáhnout.`,
  removeKokoroModel: "Odstraňte model Kokoro",
  downloadKokoroModel: "Stáhněte si model Kokoro",
  kokoroFallbackNeeded: ({ languages }) =>
    `Pro: ${languages} je vyžadována explicitní záložní trasa.`,
  kokoroNoSelectedLanguages:
    "Chcete-li nakonfigurovat hlas Kokoro, vyberte v části Jazyky poslechu angličtinu nebo zjednodušenou čínštinu.",
  expandVoiceSettings: ({ language }) => `Rozbalte nastavení hlasu ${language}`,
  collapseVoiceSettings: ({ language }) => `Sbalit nastavení hlasu ${language}`,
  remove: "Odebrat",
  voiceOutputDescription:
    "Vyberte modul řeči, jazyky poslechu a hlasové náhledy pro mluvené odpovědi.",
  localTts: "Místní",
  localTtsDescription:
    "Pro mluvené odpovědi použijte odpovídající stažený místní hlas.",
  providerTtsDescription:
    "Použít vybranou nakonfigurovanou službu pro mluvené odpovědi.",
  ttsFallbackRoutes: "Záložní trasy",
  ttsFallbackRoutesHint:
    "Volitelné. Přidejte pouze trasy, které chcete, v pořadí, v jakém se mají vyzkoušet. Jakmile trasa začne mluvit, Pan Brokolice na ní zůstane po zbytek odpovědi.",
  ttsFallbackNone:
    "Není nakonfigurována žádná záloha. Místo toho se zobrazí porucha hlasu.",
  ttsFallbackPosition: ({ position, route }) => `${position}. ${route}`,
  addFallbackRoute: ({ route }) => `Přidejte záložní verzi ${route}`,
  removeFallbackRoute: ({ route }) => `Odstraňte záložní verzi ${route}`,
  moveFallbackEarlier: ({ route }) => `Přesuňte ${route} dříve`,
  moveFallbackLater: ({ route }) => `Přesuňte ${route} později`,
  ttsProvider: "Poskytovatel TTS",
  ttsProviderEnabledHint:
    "Zde se zobrazují pouze povolení poskytovatelé s podporou mluvené odpovědi.",
  ttsProviderMissingHint:
    "Zde přidejte přihlašovací údaje pro službu s podporou TTS.",
  localTtsOrderHint:
    "Pokusí se provést pouze explicitně nakonfigurované záložní trasy.",
  providerTtsOrderHint:
    "Pokusí se provést pouze explicitně nakonfigurované záložní trasy.",
  nativeTtsHint:
    "Nativní TTS používá systémový hlasový zásobník a nevyžaduje klíč poskytovatele.",
  localTtsLanguageCoverageHint:
    "Místní balíčky aktuálně pokrývají angličtinu, němčinu, zjednodušenou čínštinu, španělštinu, portugalštinu, hindštinu, francouzštinu a italštinu.",
  ttsVoice: "Hlas TTS",
  refresh: "Obnovit",
  providerVoiceDirectory: ({ provider }) => `Hlasová knihovna ${provider}`,
  refreshProviderVoices: ({ provider }) => `Obnovte hlasy ${provider}`,
  providerVoicesAvailable: ({ count, provider }) =>
    `${provider}: ${count} hlasů k dispozici`,
  providerVoicesLoadFailed:
    "Hlasy se nepodařilo obnovit. Váš aktuální výběr se nezměnil; stále můžete zadat hlasové ID ručně.",
  providerVoicesLoadFailedWithFallback:
    "Hlasy účtu nelze načíst. Vestavěný hlas zůstává k dispozici.",
  providerVoicesErrorDetail: ({ detail }) => `Důvod: ${detail}`,
  elevenLabsVoicesReadPermissionHint:
    "V ElevenLabs upravte tento klíč API a povolte Hlasy → Číst a poté zde obnovte.",
  providerVoicesLoadingHint: ({ provider }) =>
    `Pan Brokolice automaticky načte dostupné hlasy ze ${provider}.`,
  providerVoiceId: "Hlasové ID",
  providerVoiceIdPlaceholder: "Zadejte hlasové ID",
  providerVoiceIdFallbackHint:
    "Pokud nelze načíst hlasovou knihovnu, zůstává k dispozici ruční zadávání.",
  providerVoiceIdRequired: ({ provider }) =>
    `Před použitím hlasového výstupu aktualizujte hlasovou knihovnu ${provider} nebo zadejte hlasové ID.`,
  qwenSpeechUnavailableInUs:
    "Aktuální hlasové cesty Qwen Pan Brokolice nejsou v regionu USA dostupné. Vyberte Singapur nebo Peking pro řeč Qwen.",
  qwenApiRegion: "Oblast API Qwen",
  qwenRegionSingapore: "Singapur",
  qwenRegionUs: "USA (Virginie)",
  qwenRegionBeijing: "Čína (Peking)",
  qwenRegionHint:
    "Vybraná oblast se musí shodovat s oblastí, ve které byl tento klíč API vytvořen.",
  qwenRegionUsSpeechHint:
    "Klíče pro oblast USA zde podporují chat a vyhledávání na webu. Aktuální trasy Qwen STT a TTS Pan Brokolice vyžadují singapurský nebo pekingský klíč.",
  providerDefaultVoiceHint:
    "Tento poskytovatel aktuálně používá svůj výchozí hlas pro náhled a mluvené odpovědi.",
  listenLanguages: "Poslouchejte jazyky",
  listenLanguagesHint:
    "Vyberte jazyky odpovědí, které chcete, aby zněly dobře. Pan Brokolice je zkouší v tomto pořadí při směrování hlasového výstupu.",
  listenLanguagesSelected: ({ count }) =>
    count === 1 ? "Vybrán 1 jazyk" : `Vybrány jazyky ${count}`,
  localVoicePacks: "Místní hlasové balíčky",
  localVoicePacksHint:
    "Každý jazyk si zachovává svůj vlastní místní hlas. Vyberte si hlas, který chcete pro daný jazyk, a poté si stáhněte pouze balíčky, na kterých vám skutečně záleží.",
  localVoiceForLanguage: ({ languageLabel }) => `Hlas pro ${languageLabel}`,
  providerVoicePreviews: "Hlasové náhledy poskytovatele",
  providerVoicePreviewsHint:
    "Zde otestujte aktuálně vybranou trasu TTS se samostatným textem náhledu pro každý jazyk odpovědi.",
  nativeVoicePreviewSection: "Náhled nativního hlasu",
  nativeVoicePreviewSectionHint:
    "Hovoří přímo prostřednictvím vestavěného syntezátoru řeči v telefonu, takže jej můžete porovnat s hlasy nakonfigurovaných poskytovatelů.",
  nativeVoiceUnavailable:
    "Toto zařízení nenahlásilo žádné nativní systémové hlasy pro náhled.",
  speechDiagnostics: "Nedávná řečová aktivita",
  speechDiagnosticsHint:
    "Zobrazuje nejnovější požadavky na řeč, trasu, o kterou požádali, trasu, kterou skutečně použili, a jakýkoli záložní důvod.",
  clearSpeechDiagnostics: "Vymazat nedávnou řečovou aktivitu",
  speechDiagnosticsEmpty:
    "Zatím žádné nedávné žádosti o řeč. Zde si můžete prohlédnout náhled hlasu nebo přehrát odpověď a zobrazit podrobnosti o směrování.",
  clearSpeechDiagnosticsConfirmationTitle: "Vymazat nedávnou řečovou aktivitu?",
  clearSpeechDiagnosticsConfirmationMessage:
    "To odstraní veškerou zachycenou diagnostiku směrování řeči. Tuto akci nelze vrátit zpět.",
  speechDiagnosticSourceConversation: "Odpověď na konverzaci",
  speechDiagnosticSourceRepeat: "Opakujte odpověď",
  speechDiagnosticSourcePreview: "Hlasový náhled",
  speechDiagnosticSourceUnknown: "Žádost o řeč",
  speechDiagnosticRouteLine: ({ requested, actual }) =>
    `Požadováno: ${requested} -> Aktuální: ${actual}`,
  speechDiagnosticStageLine: ({ stage }) => `Nejnovější fáze: ${stage}`,
  speechDiagnosticLanguageLine: ({ languageLabel }) =>
    `Jazyk: ${languageLabel}`,
  speechDiagnosticProviderLine: ({ provider }) => `Poskytovatel: ${provider}`,
  speechDiagnosticVoiceLine: ({ voice }) => `Hlas: ${voice}`,
  localTtsPackReady: "Instalováno na tomto zařízení.",
  localTtsPackBroken:
    "Staženo, ale místní ověření tohoto hlasu na tomto zařízení se nezdařilo. Znovu si jej stáhněte nebo vyberte jiný hlas.",
  localTtsPackMissing:
    "Zatím není nainstalováno. Cloud TTS nebo systémový hlas bude používán, dokud si jej nestáhnete.",
  localTtsUnsupportedLanguageFallback:
    "Pro tento jazyk zatím není k dispozici místní balíček. Cloud TTS nebo systémový hlas to zvládne.",
  downloadingLocalTtsPack: ({ progress }) =>
    `Stahování místního balíčku... ${progress}%`,
  download: "Stáhnout",
  downloadingShort: "Načítání...",
  voicePreviewText: "Hlasový náhled textu",
  voicePreviewPlaceholder: "Chcete-li tento hlas slyšet, zadejte frázi.",
  voicePreviewHint:
    "Použije aktuálně vybraný hlasový backend odpovědi bez odeslání čehokoli do jazykového modelu.",
  previewVoice: "Náhled hlasu",
  generatingPreview: "Generování náhledu...",
  playingPreview: "Přehrávání náhledu...",
  systemVoice: "Systémový hlas",
  spokenRepliesOff: "Pouze text",
  noTtsProvider: "Žádný poskytovatel TTS",
  nothingToCopyYet: "Zatím není co kopírovat.",
  couldntCopyText: "Tento text se nepodařilo zkopírovat.",
  nothingToShareYet: "Zatím není co sdílet.",
  couldntShareText: "Tento text se nepodařilo sdílet.",
  couldntReplayReply: "Tuto odpověď se nepodařilo přehrát.",
  replyFailed: "Odpověď se nezdařila",
  retryReply: "Zkuste odpovědět znovu",
  replyFailedHint: "Než to zkusíte znovu, můžete si výše vybrat jiný model.",
  spokenReplyFailed: "Odpověď byla uložena, ale nebylo možné ji vyslovit.",
  retrySpeech: "Zkuste řeč znovu",
  openSpeakingSettings: "Nastavení mluvení",
  messageCopied: "Zpráva zkopírována.",
  noConversationToCopyYet: "Zatím žádná konverzace ke kopírování.",
  noConversationToShareYet: "Zatím žádná konverzace ke sdílení.",
  noReplyToRepeatYet: "Zatím žádná odpověď na přehrání.",
  threadCopied: "Vlákno zkopírováno.",
  threadRenamed: "Vlákno přejmenováno.",
  threadPinned: "Nit připnutá.",
  threadUnpinned: "Vlákno odepnuto.",
  addProviderKeyToUseProvider: ({ provider }) =>
    `Před použitím této trasy přidejte přihlašovací údaje pro ${provider} v Nastavení.`,
  configureCredentialsBeforeVoiceSession:
    "Před zahájením hlasové relace přidejte přihlašovací údaje v Nastavení.",
  endpointCredentialFormatInvalid: ({ provider }) =>
    `Pro ${provider} zadejte základní adresu URL poskytovatele a klíč API jako https://your-endpoint.example.com|your-api-key.`,
  speechRecognitionUnavailableOnDevice:
    "Na tomto zařízení není rozpoznávání řeči k dispozici.",
  debugLogLabel: "LOG",
  debugLogCaptureStarted: "Bylo spuštěno protokolování ladění.",
  debugLogCaptureStopped: ({ entryCount, fileName }) =>
    `Protokol ladění uložen jako ${fileName} a zkopírován do schránky (záznamy ${entryCount}).`,
  debugLogCaptureStoppedNoClipboard: ({ entryCount, fileName }) =>
    `Protokol ladění uložen jako ${fileName} (záznamy ${entryCount}).`,
  debugLogCaptureRecovered: ({ entryCount, fileName }) =>
    `Obnoven předchozí protokol ladění ${fileName} a zkopírován do schránky (položky ${entryCount}).`,
  debugLogCaptureRecoveredNoClipboard: ({ entryCount, fileName }) =>
    `Obnovený předchozí protokol ladění ${fileName} (položky ${entryCount}).`,
  debugLogCaptureFailed: "Protokol ladění se nepodařilo uložit.",
  chooseSttBeforeVoiceSession:
    "Před zahájením hlasové relace vyberte v Nastavení nakonfigurovanou trasu STT.",
  chooseTtsBeforeSpokenReplies:
    "Před použitím mluvených odpovědí vyberte nakonfigurovanou trasu TTS v Nastavení.",
  stopSessionBeforeReplay:
    "Před přehráním poslední odpovědi zastavte aktivní hlasovou relaci.",
  couldntCatchThatTryAgain: "Nepodařilo se mi to zachytit, zkuste to znovu.",
  couldntStartVoiceInput: "Hlasový vstup nelze spustit.",
  couldntProcessVoiceInput: "Hlasový vstup se nepodařilo zpracovat.",
  maxRecordingLengthReached:
    "Dosažena maximální délka záznamu – odesílám, co mám.",
  sttRecordingTooLarge: ({ provider, limit }) =>
    `Tento záznam je příliš dlouhý pro převod řeči na text ${provider} (max. ${limit}). Zkuste kratší zprávu nebo přepněte převod řeči na text na Rozpoznávání systému.`,
  addProviderKeyToEnableProvider: ({ provider }) =>
    `Před použitím této trasy přidejte přihlašovací údaje pro ${provider} v Nastavení.`,
  stopSessionBeforePreview:
    "Před zobrazením náhledu hlasu zastavte aktivní hlasovou relaci.",
  chooseTtsToPreviewVoices:
    "Chcete-li zobrazit náhled hlasů, vyberte v Nastavení nakonfigurovanou trasu TTS.",
  downloadSelectedLocalVoiceFirst: ({ languageLabel }) =>
    `Nejprve si stáhněte vybraný místní hlas ${languageLabel}.`,
  couldntPreviewVoice: "Náhled hlasu se nepodařilo zobrazit.",
  spokenRepliesDisabled: "Mluvené odpovědi jsou vypnuty v Nastavení.",
  providerVoiceFallback:
    "Konfigurovaná hlasová trasa selhala. Tuto odpověď přepnuli na záložní hlas.",
  localVoiceFallback:
    "Místní hlas byl nedostupný. Tuto odpověď přepnuli na záložní hlas.",
  localTtsPackInstalled: ({ languageLabel }) =>
    `Nainstalován místní hlasový balíček ${languageLabel}.`,
  localTtsPackInstallFailed: "Nelze nainstalovat místní hlasový balíček.",
  clear: "Jasný",
  voiceOutput: "Hlasový výstup",
  currentSetup: "Aktuální nastavení",
  listeningToYourVoice: "Naslouchat svému hlasu",
  parsingYourVoiceInput: "Přeměna vašeho hlasu na text",
  preparingRequest: "Příprava vaší žádosti",
  searchingTheWeb: "Hledání nového kontextu na webu",
  waitingForProvider: ({ provider }) => `Čekání na ${provider}`,
  preparingVoiceWithProvider: ({ provider }) =>
    `Příprava hlasu pomocí ${provider}`,
  deepThinkingReassurance: "Dobré odpovědi zaberou chvilku…",
  thinkingElapsed: ({ detail, seconds }) => `${detail} · ${seconds}s`,
  speakingBackToYou: "Mluvím zpět k vám",
  freshSession: "Čerstvá relace",
  messageCount: ({ count }) =>
    Number(count) === 1 ? "1 zpráva" : `${count} zpráv`,
  speechInputRoute: ({ route }) => `Řeč v: ${route}`,
  replyModelRoute: ({ route }) => `Model odpovědi: ${route}`,
  voiceOutputRoute: ({ route }) => `Hlasový výstup: ${route}`,
  fallbackVoiceOutputRoute: ({ route }) => `Záložní hlasový výstup: ${route}`,
  conversation: "Konverzace",
  conversationActions: "Konverzační akce",
  statusDetails: "Podrobnosti o stavu",
  persistenceFailure:
    "Pan Brokolice nemohl uložit data do tohoto zařízení. Nechte aplikaci otevřenou a zkuste to znovu; nedávné změny mohou být po restartu ztraceny.",
  show: "Zobrazit",
  showTranscript: "Zobrazit přepis",
  hide: "Skrýt",
  copyThread: "Kopírovat vlákno",
  shareThread: "Sdílet vlákno",
  repeatReply: "Opakovat odpověď",
  renameThread: "Přejmenovat vlákno",
  renameThreadHint:
    "Dejte této konverzaci název, který později rychle najdete.",
  threadTitle: "Název vlákna",
  noTranscriptYet: "Zatím bez přepisu",
  previewTranscriptEmptyDescription:
    "Začněte pomocí hlasu nebo textu. Zde se zobrazí vaše konverzace.",
  noConversationYet: "Zatím žádná konverzace",
  expandedTranscriptEmptyDescription:
    "Začněte pomocí hlasu nebo textu. Pokud se chcete vrátit na hlavní scénu, zavřete tuto obrazovku.",
  transcriptSelectionHint:
    "Vyberte libovolný text zprávy přímo nebo sdílejte a zkopírujte jednotlivé zprávy níže.",
  textMessagePlaceholder: "Napište zprávu",
  sendTextMessage: "Odeslat zprávu",
  showVoiceInput: "Zobrazit hlasový vstup",
  showTextInput: "Zobrazit textový vstup",
  usageStatsHiddenDescription:
    "Udržujte odhady tokenů mimo uživatelské rozhraní přepisu.",
  usageStatsVisibleDescription:
    "Zobrazit odhadované využití tokenu pro odpovědi a celkové počty konverzací.",
  debugLogButton: "Tlačítko protokolu ladění",
  debugLogButtonHiddenDescription:
    "Ponechejte tlačítko LOG na domovské obrazovce skryté, pokud již není spuštěno nahrávání.",
  debugLogButtonVisibleDescription:
    "Zobrazit tlačítko LOG na domovské obrazovce pro spouštění a zastavování zachycování ladění.",
  debugLogButtonUsageDescription:
    "Jak používat tlačítko: jeho zapnutím se začnou zaznamenávat protokoly. Vypnutím přestanete zaznamenávat protokoly a ty zachycené přesunete do schránky.",
  estimatedUsageTitle: "Odhadované využití",
  estimatedUsageCounts: ({ replies, summaries }) =>
    `Odpovědi ${replies} · Aktualizace paměti ${summaries}`,
  estimatedUsageConversationScope:
    "Součty zahrnují všechny trasy a modely použité v této konverzaci.",
  estimatedPromptTokens: ({ count }) => `Výzva: ${count}`,
  estimatedReplyTokens: ({ count }) => `Odpověď: ${count}`,
  estimatedTotalTokens: ({ count }) => `Celkem: ${count}`,
  estimatedUsageInline: ({ prompt, completion, total }) =>
    `Odhad. Vstup ${prompt} · Výstup ${completion} · Celkem ${total}`,
  searchQuery: "Vyhledávací dotaz",
  expandWebSearchDetails: "Zobrazit podrobnosti o vyhledávání na webu",
  collapseWebSearchDetails: "Skrýt podrobnosti vyhledávání na webu",
  webSearchSourceCount: ({ count }) => `${count} zdrojů`,
  sources: "Zdroje",
  openSourceLink: ({ source }) => `Otevřený zdroj: ${source}`,
  turnReceipt: "Detaily odbočení",
  expandTurnReceipt: "Zobrazit podrobnosti odbočení",
  collapseTurnReceipt: "Skrýt podrobnosti odbočení",
  turnReceiptDirect: "Přímý",
  turnReceiptRequested: "Požadovaná trasa odpovědi",
  turnReceiptActual: "Aktuální trasa odpovědi",
  turnReceiptEffort: "Kontrola rozumu",
  turnReceiptProviderNative: "poskytovatel-nativní",
  turnReceiptInput: "Vstupní trasa",
  turnReceiptSearch: "vyhledávání na webu",
  turnReceiptVoice: "Hlasový výstup",
  turnReceiptContext: "Kontext",
  turnReceiptTiming: "Načasování",
  turnReceiptFallback: "Záložní důvod",
  turnReceiptVoiceInput: "Hlas",
  turnReceiptTypedInput: "Napsáno",
  turnReceiptSystemSpeech: "Systémové rozpoznávání řeči",
  turnReceiptSystemVoice: "Systémový hlas",
  turnReceiptSystemVoiceFallback: "Systémový hlas · záložní",
  turnReceiptOff: "Vypnuto",
  turnReceiptNotConfigured: "Zapnuto · není nakonfigurováno",
  turnReceiptFallbackWithoutSearch: "Pokračování bez živého vyhledávání",
  turnReceiptNotUsed: "Nepoužito",
  turnReceiptSummaryReused: "uložený souhrn znovu použit",
  turnReceiptSummaryUpdated: "shrnutí aktualizováno",
  turnReceiptContextFallback: "nouzová poslední zpráva",
  turnReceiptGatewayCompression: ({ original, compressed }) =>
    `brány komprimované zprávy ${original} na ${compressed}`,
  turnReceiptContextValue: ({ sent, total, summarized, state }) =>
    `${sent}/${total} předchozí odeslané zprávy · ${summarized} nově shrnuté${state}`,
  turnReceiptTimingStt: "STT",
  turnReceiptTimingContext: "kontextu",
  turnReceiptTimingSearch: "hledat",
  turnReceiptTimingModel: "model",
  turnReceiptTimingFirstSpeech: "první řeč",
  turnReceiptTimingTotal: "celkem",
  estimatedRouteUsageTokensOnly: ({ tokens }) => `Tokeny ${tokens}`,
  unknownUsageRoute: "Neznámá trasa",
  setupGuideConnectProviderTitle: "Nakonfigurujte přihlašovací údaje",
  setupGuideConnectProviderDescription:
    "Přidejte přihlašovací údaje v Nastavení a poté vyberte trasy, které chcete použít.",
  idle: "Nečinný",
  yourConversationAppearsHere: "Zde se zobrazí vaše konverzace",
  defaultTranscriptEmptyDescription:
    "Začněte pomocí hlasu nebo textu. Pan Brokolice ponechá vlákno a odpoví zde.",
  delete: "Smazat",
  deleteConversationConfirmationTitle: ({ title }) => `Smazat „${title}“?`,
  deleteConversationConfirmationMessage:
    "Tím trvale smažete konverzaci a všechny její zprávy. Tuto akci nelze vrátit zpět.",
  memory: "Paměť",
  conversations: "Konverzace",
  drawerSubtitle: "Přeskakujte mezi živými vlákny nebo začněte novou místnost.",
  newSession: "Nová relace",
  noSavedConversationsYet: "Zatím žádné uložené konverzace",
  drawerEmptyDescription:
    "Začněte mluvit z hlavního zobrazení a Pan Brokolice automaticky vytvoří relaci.",
  setupGuideTitle: "Nakonfigurujte aplikaci",
  setupGuideSubtitle:
    "Přidejte přihlašovací údaje a vyberte trasy v Nastavení.",
  fastestStartPreset: "Minimální nastavení",
  fastestStartDescription:
    "Pokud je to možné, použijte řeč zařízení a nakonfigurujte pouze trasu odpovědi, kterou potřebujete.",
  fullVoicePreset: "Nakonfigurovaný hlas",
  fullVoiceDescription:
    "Když si je vyberete, použijte nakonfigurované služby pro odpovědi, přepis a mluvený výstup.",
  setupGuideNote:
    "Jako další otevřeme Nastavení, abyste mohli vložit a ověřit přihlašovací údaje.",
  useThisSetup: "Použijte toto nastavení",
  notNow: "Teď ne",
  setupGuideIntroTitle: "Jak funguje Pan Brokolice",
  setupGuideIntroBody:
    "Pan Brokolice začíná prázdné. Přidejte přihlašovací údaje pro externí služby, které již používáte, a poté vyberte, jak budou směrovány odpovědi, hlasový vstup, mluvený výstup a volitelný webový kontext.",
  setupGuideIntroNote:
    "Po nastavení zahajte a zastavte konverzaci pomocí hlavního hlasového ovládání. Aktuální přepis zůstává k dispozici na domovské obrazovce a každou trasu lze později změnit v Nastavení.",
  setupGuideProviderTitle: "Přidat přihlašovací údaje",
  setupGuideProviderBody:
    "Vyberte externí službu, kterou chcete nakonfigurovat, a poté vložte přihlašovací údaje s přístupem k odpovědi.",
  setupGuideProviderPickerLabel: "Služba odpovědí",
  setupGuideSelectProvider: "Vyberte poskytovatele",
  setupGuideSelectProviderFirst: "Nejprve vyberte poskytovatele.",
  setupGuideApiKeyLabel: "API klíč",
  setupGuideApiKeyPlaceholder: "Vložte přihlašovací údaje",
  setupGuideContinue: "Pokračovat",
  setupGuideOpenSettings: "Otevřete Nastavení",
  setupGuideBack: "Zpět",
  setupGuideValidateKey: "Ověřte klíč",
  setupGuideApiKeyRequiredOrCancel:
    "Chcete-li pokračovat, přidejte klíč API nebo zrušte průvodce nastavením.",
  setupGuideProviderAndApiKeyRequiredOrCancel:
    "Chcete-li pokračovat, vyberte poskytovatele a přidejte klíč API, nebo zrušte průvodce nastavením.",
  setupGuideProviderKeyNeedsLlmAccess: ({ provider }) =>
    `Tyto přihlašovací údaje ${provider} neumožňují žádosti o odpověď.`,
  setupGuideKokoroTitle: "Přidejte přirozený hlas na zařízení",
  setupGuideKokoroBody: ({ size }) =>
    `Volitelné: stáhněte si Kokoro (asi ${size} MB) pro mnohem přirozenější mluvené odpovědi bez poskytovatele řeči nebo poplatků za používání.`,
  setupGuideKokoroLanguageNote:
    "Tento model aktuálně mluví anglicky a zjednodušenou čínštinou. Nakonfigurujte libovolné záložní trasy, které chcete později, v nastavení Speaking.",
  setupGuideKokoroDownload: "Stáhnout Kokoro",
  setupGuideUseKokoro: "Pro mluvené odpovědi použijte Kokoro",
  setupGuideUseKokoroSummary:
    "Udržujte syntézu v telefonu, kdykoli je podporován jazyk odpovědi.",
  setupGuideSkipKokoro: "Zatím přeskočte",
  setupGuideVoiceTestTitle: "Otestujte své nastavení",
  setupGuideVoiceTestBody:
    "Řekněte krátkou větu. Pan Brokolice otestuje přístup k mikrofonu, přepis, nakonfigurovanou trasu odpovědi a mluvený výstup, když je k dispozici přijatelná hlasová trasa.",
  setupGuideVoiceTestNoInputBody:
    "Hlasový vstup není u tohoto nastavení dostupný. Pokračujte v kontrole zjištěných tras a v případě potřeby později upravte nastavení řeči.",
  setupGuideVoiceTestTextOnlyNote:
    "Tento test zůstává pouze textový, protože ještě není připravena žádná přijatelná hlasová trasa.",
  setupGuideVoiceTestStart: "Spustit test",
  setupGuideVoiceTestStop: "Zastavit nahrávání",
  setupGuideVoiceTestRetry: "Spusťte znovu",
  setupGuideVoiceTestTranscribing: "Přepis…",
  setupGuideVoiceTestThinking: "Testování odpovědi…",
  setupGuideVoiceTestSynthesizing: "Příprava hlasu…",
  setupGuideVoiceTestSpeaking: "Přehrávání odpovědi…",
  setupGuideVoiceTestTranscript: "Přepis",
  setupGuideVoiceTestReply: "Odpovědět",
  setupGuideVoiceTestReset: "Vymažte tento výsledek",
  setupGuideVoiceInputUnavailable:
    "Hlasový vstup není pro toto nastavení na tomto zařízení dostupný.",
  setupGuideSummaryTitle: "Nastavení dokončeno",
  setupGuideSummaryBody:
    "Zde je trasa, kterou Pan Brokolice použije s vaší aktuální konfigurací.",
  setupGuideSummaryLlm: "LLM",
  setupGuideSummaryStt: "Řeč na text",
  setupGuideSummaryTts: "Převod textu na řeč",
  setupGuideSummaryWebSearch: "vyhledávání na webu",
  setupGuideRouteProviderLlm: ({ provider }) => `Povoleno přes ${provider}`,
  setupGuideRouteOnDeviceStt:
    "Povoleno prostřednictvím systémového rozpoznávání řeči",
  setupGuideRouteProviderStt: ({ provider }) =>
    `Povoleno prostřednictvím přepisu řeči ${provider}`,
  setupGuideRouteProviderTts: ({ provider }) =>
    `Povoleno prostřednictvím hlasu ${provider}`,
  setupGuideRouteKokoroTts: "Povoleno prostřednictvím hlasu na zařízení Kokoro",
  setupGuideRouteLocalTts:
    "Povoleno prostřednictvím místního hlasového balíčku",
  setupGuideRouteUnavailable: "Není k dispozici",
  setupGuideRouteOff: "Vypnuto",
  setupGuideWebSearchAvailableOff: ({ provider }) =>
    `Dostupné přes ${provider}, aktuálně vypnuto`,
  setupGuideSummaryTextOnlyNote:
    "Mluvené odpovědi jsou prozatím vypnuty. Odpovědi zůstávají v textu, dokud nepovolíte poskytovatele nebo místní hlas.",
  setupGuideFinish: "Hotovo",
  searchConversationsPlaceholder: "Vyhledávejte názvy, modely a text zprávy",
  noMatchingConversations: "Žádné odpovídající konverzace",
  noMatchingConversationsDescription:
    "Zkuste jiný název, trasu, model nebo frázi z přepisu.",
  memoryModalTitle: "Paměť na konverzaci",
  memoryModalDescription:
    "Toto je kompaktní shrnutí, které Pan Brokolice přenáší vpřed, jakmile je vlákno dostatečně dlouhé, aby stlačilo starší závity.",
  memorySummary: "Uložené shrnutí",
  memorySummaryEmpty:
    "Zatím žádná kompaktní paměť. Jakmile bude toto vlákno delší, budou zde shrnuty starší odbočky.",
  summarizedTurnsCount: ({ count }) =>
    Number(count) === 1 ? "1 shrnutý tah" : `${count} shrnutých tahů`,
  copyMemory: "Kopírovat paměť",
  forgetMemory: "Zapomeňte na paměť",
  memoryCopied: "Paměť zkopírována.",
  memoryCleared: "Paměť konverzace byla vymazána.",
  noConversationToManageYet: "Zatím není k dispozici žádná paměť konverzace.",
  noProviderYet: "Zatím žádný poskytovatel",
  noModelYet: "Zatím žádný model",
  startedAt: "Zahájeno",
  endedAt: "Skončilo",
  pinned: "Připnuto",
  copy: "Kopírovat",
  share: "Sdílejte",
  rename: "Přejmenovat",
  pin: "Pin",
  unpin: "Odepnout",
  save: "Uložit",
  cancel: "Zrušit",
  stop: "Přestaň",
  pause: "Pauza",
  resume: "Pokračovat",
  paused: "Pozastaveno",
  listening: "Poslouchání",
  parsing: "Přepisování",
  searching: "Hledání",
  converting: "Konverze",
  webSearchAction: "vyhledávání na webu",
  thinking: "myšlení",
  speaking: "Mluvit",
  pleaseWait: "Čekejte prosím",
  yourTurn: "Jste na řadě",
  keepPressing: "Tiskněte dál",
  tapWhenDone: "Po dokončení klepněte",
  speechPaused: "Řeč je pozastavena",
  pausePlaybackUnavailable:
    "Tuto hlasovou trasu nelze pozastavit. Zastavte to nebo přepněte na hlasový výstup poskytovatele.",
  holdToSpeak: "Vydržte, abyste mohli mluvit",
  tapToSpeak: "Klepnutím mluvte",
  tapAgainToSend: "Opětovným klepnutím odešlete",
  waitingForReply: "Čekání na odpověď",
  parsingYourVoice: "Analýza vašeho hlasu",
  providerConfiguredInSettings: ({ provider }) =>
    `${provider} není nakonfigurováno v Nastavení.`,
  providerNetworkError: ({ provider, action }) =>
    `Nelze dosáhnout ${provider} pro ${action}. Zkontrolujte připojení a zkuste to znovu.`,
  providerAuthError: ({ provider, action }) =>
    `${provider} odmítl přihlašovací údaje pro ${action}. Zkontrolujte klíč API a oprávnění.`,
  providerRateLimitError: ({ provider, action }) =>
    `${provider} právě teď omezuje rychlost ${action}. Zkuste to znovu za chvíli.`,
  providerCreditsRequired: ({ provider, action }) =>
    `${provider} potřebuje dostatečný kredit API pro ${action}. Zkontrolujte zůstatek na účtu a limit útraty klíče.`,
  providerTimeoutError: ({ provider, action }) =>
    `${provider} trvalo příliš dlouho během ${action}. Zkuste to znovu.`,
  providerTemporaryError: ({ provider, action }) =>
    `${provider} měl dočasný problém během ${action}. Zkuste to za chvíli znovu.`,
  providerEmptyReplyError: ({ provider }) =>
    `${provider} skončil bez vrácení odpovědi. Zkuste to znovu.`,
  providerIncompleteReplyError: ({ provider }) =>
    `Odpověď ${provider} skončila dříve, než byla dokončena. Zkuste to znovu.`,
  providerContextTooLong: ({ provider }) =>
    `${provider} odmítl odpověď, protože konverzace byla příliš dlouhá. Založte nové vlákno nebo zkraťte požadavek.`,
  providerRequestRejected: ({ provider, action, detail }) =>
    detail
      ? `${provider} odmítl požadavek ${action}: ${detail}`
      : `${provider} odmítl požadavek ${action}.`,
  providerWebSearchNotRun: ({ provider }) =>
    `${provider} vrátil odpověď bez spuštění vyhledávání na webu.`,
  providerValidationSuccess: ({ provider }) =>
    `${provider} je připraven k použití.`,
  providerCapabilityValidationSuccess: ({ provider, capability }) =>
    `${provider} ${capability} funguje.`,
  providerValidationFailed: "Ověření poskytovatele se nezdařilo.",
  webSearchFallback:
    "Vyhledávání na webu bylo nedostupné, takže odpověď pokračovala bez živého webového kontextu.",
  noBase64EncoderAvailable: "Není k dispozici žádný kodér base64.",
  noBase64DecoderAvailable: "Není k dispozici žádný dekodér base64.",
  azureSpeechApiKeyFormat:
    "Microsoft Azure TTS potřebuje přihlašovací údaje Azure Speech ve formátu <key>|<region>, například abc123|westeurope, nebo kombinovaný formát Azure <endpoint>|<api-key>|<key>|<region>.",
  googleCloudSpeechCredentialFormat: ({ provider }) =>
    `${provider} STT potřebuje přihlašovací údaje Google Cloud Speech ve formátu <project-id>|<access-token>|<location> nebo v kombinovaném formátu Gemini <Gemini API key>|<project-id>|ZXQPH8QXQXZ|ZXQPH9`,
  bytedanceSpeechCredentialFormat: ({ provider }) =>
    `${provider} STT potřebuje Doubao pověření řeči ve formátu <app-key>|<access-key>, volitelně <app-key>|<access-key>|<resource-id>, nebo kombinovaný formát <ark-api-key>|ZXQPH08QPHXQZZ|`,
  nativeTtsDoesNotSynthesizeAudioFiles:
    "Nativní TTS nesyntetizuje zvukové soubory.",
  localTtsUnavailableForLanguage: ({ languageLabel }) =>
    `Pro ${languageLabel} není připravena žádná místní nebo cloudová hlasová trasa.`,
  chooseTextToSpeechProviderInSettings:
    "V Nastavení vyberte poskytovatele převodu textu na řeč.",
  ttsNotSupportedYet: ({ provider }) =>
    `${provider} TTS zatím není podporováno.`,
  ttsError: ({ provider, status, errorText }) =>
    `${provider} Chyba TTS (${status}): ${errorText}`,
  ttsReplyTooLong: ({ provider }) =>
    `Hlasový výstup ${provider} odmítl odpověď, protože byla příliš dlouhá.`,
  ttsTimeout: ({ provider }) =>
    `Hlasový výstup ${provider} trval příliš dlouho.`,
  sttTimeout: ({ provider }) => `Přepis řeči ${provider} trval příliš dlouho.`,
  sttFileSizeLimitExceeded: ({ provider, model, limit }) =>
    `${provider} ${model} přijímá pouze nahrávky do ${limit}. Použijte kratší modely klipů nebo spínačů STT.`,
  voiceInputCaptureIncomplete:
    "Hlasový vstup se nepodařilo zachytit čistě. Zkuste to prosím znovu.",
  ttsDidNotReturnAudio: ({ provider }) => `${provider} TTS nevrátil zvuk.`,
  nativeSttHandledInApp: "Systém STT se ovládá přímo v aplikaci.",
  chooseSpeechToTextProviderInSettings:
    "V Nastavení vyberte poskytovatele převodu řeči na text.",
  sttNotSupportedYet: ({ provider }) =>
    `${provider} STT zatím není podporováno.`,
  providerNotWiredUpYet: ({ provider }) => `${provider} ještě není zapojeno.`,
  you: "vy",
  assistant: "asistent",
  untitledConversation: "Konverzace bez názvu",
  conversationExportHeader: ({ title }) => `Konverzace: ${title}`,
  speechRecognitionPermissionNotGranted:
    "Nebylo uděleno oprávnění k rozpoznávání řeči.",
  speechRecognitionUnavailableForDeviceLanguage:
    "Rozpoznávání řeči není pro aktuální jazyk zařízení k dispozici.",
  nativeSpeechRecognitionNeedsNetwork:
    "Nativní rozpoznávání řeči právě teď potřebuje přístup k síti.",
  noSpeechDetected: "Nebyla zjištěna žádná řeč.",
  nativeSpeechRecognitionFailed: "Nativní rozpoznávání řeči selhalo.",
  couldntStartNativeSpeechRecognition:
    "Nelze spustit rozpoznávání nativní řeči.",
  microphonePermissionNotGranted: "Povolení k mikrofonu nebylo uděleno",
} satisfies TranslationDictionary;
