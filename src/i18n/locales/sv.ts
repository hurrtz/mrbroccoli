import type { TranslationDictionary } from "../types";
import { dataBackupTranslations } from "../dataBackupTranslations";
import { conversationKnowledgeTranslations } from "../conversationKnowledgeTranslations";
import { conversationIntegrityTranslations } from "../conversationIntegrityTranslations";
import { imagePromptTranslations } from "../imagePromptTranslations";
import { onDeviceTranslations } from "../onDeviceTranslations";
import { onboardingTranslations } from "../onboardingTranslations";
import { premiumTranslations } from "../premiumTranslations";

export const sv = {
  ...dataBackupTranslations.sv,
  ...conversationKnowledgeTranslations.sv,
  ...conversationIntegrityTranslations.sv,
  ...imagePromptTranslations.sv,
  ...onDeviceTranslations.sv,
  ...onboardingTranslations.sv,
  ...premiumTranslations.sv,
  appName: "Herr Broccoli",
  retry: "Försök igen",
  dismiss: "Stäng",
  done: "Klart",
  aboutSetting: ({ setting }) => `Om ${setting}`,
  unavailable: "Ej tillgänglig",
  selection: "Val",
  chooseCompatibleProviderFirst: "Välj först en kompatibel leverantör",
  settings: "Inställningar",
  settingsReleaseVersion: ({ version }) => `Version ${version}`,
  all: "Alla",
  firstRun: "Första körningen",
  instructions: "Instruktioner",
  providers: "Leverantörer",
  webSearch: "Webbsökning",
  stt: "STT",
  tts: "TTS",
  ui: "UI",
  settingsRuntimeReadiness: "Körtidsberedskap",
  settingsReadinessThink: "Tänk",
  settingsReadinessListen: "Lyssna",
  settingsReadinessSpeak: "Tala",
  settingsReadinessSearch: "Sök",
  settingsReadinessReady: "Klar",
  settingsReadinessNeedsAttention: "Uppmärksamhet",
  settingsReadinessBroken: "Problem",
  settingsReadinessOff: "Av",
  settingsConnections: "Anslutningar",
  settingsThinking: "Tänkande",
  settingsListening: "Lyssning",
  settingsSpeaking: "Tal",
  settingsSearch: "Sök",
  settingsAppDiagnostics: "App & diagnostik",
  settingsGuidedSetup: "Guidad konfiguration",
  settingsGuidedSetupSummary: "Granska anslutningar och testa hela röstrutten.",
  setupGuideShowInSettings: "Visa guidad konfiguration i Inställningar",
  setupGuideShowInSettingsSummary:
    "Visa eller dölj den guidade konfigurationsgenvägen i inställningsöversikten.",
  settingsConnectionsSummary: "Leverantörsnycklar, validering och funktioner.",
  settingsThinkingSummary:
    "Hemkort, modeller, ansträngning och systemuppmaning.",
  settingsListeningSummary: "Inmatningsläge och tal-till-text-dirigering.",
  settingsSpeakingSummary:
    "Talade svar, uppspelning, röster och förhandsvisningar.",
  settingsSearchSummary: "Webbsökleverantör och sökkvalitetskontroller.",
  settingsAppDiagnosticsSummary:
    "Tema, språk, användning, felsökningsloggar och senaste aktivitet.",
  settingsBackToOverview: "Tillbaka till översikten",
  settingsOpenSection: ({ section }) => `Öppna ${section}`,
  theme: "Tema",
  language: "Språk",
  recognitionLanguage: "Igenkänningsspråk",
  recognitionLanguageHint:
    "Välj ett språk för att förbättra igenkänningen, eller lämna det automatiskt för enhets- eller leverantörsidentifiering.",
  automaticLanguage: "Automatisk",
  speechLanguageUnsupportedByProvider: ({ provider, language }) =>
    `${provider} stöder inte officiellt ${language} för denna talrutt.`,
  usageStats: "Användningsstatistik",
  model: "Modell",
  effort: "Ansträngning",
  effortValue: ({ effort }) => `Ansträngning: ${effort}`,
  modelEffortNone: "Ingen",
  modelEffortMinimal: "Minimal",
  modelEffortLow: "Låg",
  modelEffortMedium: "Medium",
  modelEffortHigh: "Hög",
  modelEffortExtraHigh: "Extra hög",
  modelEffortMax: "Max",
  modelEffortDynamic: "Dynamisk",
  modelEffortDisabled: "Inaktiverad",
  modelEffortEnabled: "Aktiverad",
  fixed: "Fast",
  english: "engelska",
  german: "tyska",
  ukrainian: "ukrainska",
  hindi: "hindi",
  spanish: "spanska",
  french: "franska",
  italian: "italienska",
  portuguese: "portugisiska",
  portugueseBrazil: "portugisiska (Brasilien)",
  russian: "ryska",
  simplifiedChinese: "Förenklad kinesiska",
  arabic: "arabiska",
  japanese: "japanska",
  hungarian: "ungerska",
  czech: "tjeckiska",
  polish: "polska",
  turkish: "turkiska",
  swedish: "svenska",
  urdu: "urdu",
  kokoroAmericanFemaleVoice: ({ name }) => `${name} · Amerikansk kvinnlig röst`,
  kokoroBritishFemaleVoice: ({ name }) => `${name} · Brittisk kvinnlig röst`,
  kokoroChineseFemaleVoice: ({ index }) => `Kinesisk kvinnlig röst ${index}`,
  kokoroChineseMaleVoice: ({ index }) => `Kinesisk manlig röst ${index}`,
  light: "Ljus",
  dark: "Mörkt",
  system: "System",
  languageCoverage: ({ note }) => `Språktäckning: ${note}`,
  recordingLimits: ({ note }) => `Inspelningsgränser: ${note}`,
  catalogProviderPricingSummary: ({ summary }) => `Pris: ${summary}`,
  replyGenerationAction: "svarsgenerering",
  speechTranscriptionAction: "taltranskription",
  speechSynthesisAction: "talsyntes",
  instructionsTabDescription:
    "Forma den dolda vägledningen som styr assistenten innan någon leverantör ser förfrågan.",
  providersTabDescription:
    "Lagra autentiseringsuppgifter för extern tjänst på enheten och konfigurera de svarslägen du vill använda.",
  webSearchTabDescription: "Konfigurera valfritt live webbkontext före svar.",
  responseModes: "Modellval",
  aboutModelSelection: "Om modellval",
  modelSelectionInfo:
    "Varje modellkort blir ett val på startskärmen. Konfigurera dess leverantör, modell och valfria ansträngningsnivå och byt sedan kort för att välja vilken modell som svarar härnäst.",
  responseModeItemTitle: ({ index }) => `Modell ${index}`,
  addResponseMode: "Lägg till modell",
  removeResponseMode: "Ta bort modellen",
  responseModesNoConfiguredProviders:
    "Lägg till autentiseringsuppgifter först. Ruttkontroller förblir dolda tills minst en kompatibel tjänst har konfigurerats.",
  useResponseMode: ({ mode }) => `Använd ${mode}`,
  chooseResponseModel: "Välj en modell",
  responseModelCount: ({ count }) => `${count}-modeller tillgängliga`,
  ulraMode: "Superläge",
  ulraModeHomeLabel: "Visa Superläge på startskärmen",
  ulraModeSettingsDescription:
    "Tillåter överläggning mellan flera modeller när minst två modeller på startskärmen är redo.",
  ulraModeInfo:
    "Superläget frågar först varje redo modell på startskärmen var för sig. I varje omgång ifrågasätter modellerna varje deltagares senaste ståndpunkt; återstående omgångar hoppas över efter uttrycklig enhällig samsyn. Den valda modellen sammanställer slutsvaret från lyckade omgångar och behåller alltid varje modells senaste ståndpunkt. Överläggningen delas med alla berörda leverantörer.",
  ulraModeRounds: "Granskningsomgångar",
  ulraModeCallEstimate: ({ count }) =>
    `Upp till ${count} modellanrop per meddelande med den aktuella konfigurationen.`,
  ulraModeThresholdWarning:
    "Fler än 4 modeller eller 3 omgångar kan ta mycket lång tid, använda många token och nå leverantörernas kontext- eller hastighetsgränser. Detta är bara en varning.",
  ulraModeFirstUseTitle: "Aktivera Superläge?",
  ulraModeFirstUseMessage: ({ calls, models, rounds }) =>
    `Med ${models} modeller och upp till ${rounds} granskningsomgångar kan ett meddelande göra upp till ${calls} modellanrop. Det kan ta mycket längre tid, kosta betydligt mer och dela överläggningen med alla berörda leverantörer.`,
  ulraModeHighRiskTitle: "Stor körning i Superläge",
  ulraModeHighRiskMessage: ({ calls, models, rounds }) =>
    `${models} modeller och ${rounds} granskningsomgångar kan göra upp till ${calls} modellanrop. Det kan ta mycket lång tid, använda många token och nå leverantörsgränser. Fortsätta ändå?`,
  ulraModeEnableAction: "Aktivera",
  ulraModeNeedsTwoModels:
    "Superläget behöver minst två redo modeller på startskärmen.",
  ulraModeAllModelsFailed:
    "Alla modeller i Superläget misslyckades innan ett svar kunde sammanställas.",
  ulraModePartialFailureNotice: ({ failed, succeeded }) =>
    `${failed} interna modellanrop misslyckades; det slutliga svaret använde ${succeeded} lyckade bidrag.`,
  sttTabDescription:
    "Styr hur tal fångas och vilken backend som förvandlar ljud till text innan det når modellen.",
  ttsTabDescription:
    "Styr när svar börjar tala och vilken backend som hanterar talad utdata.",
  brief: "Kort",
  briefDescription:
    "Håll svaret noggrant. Använd det minsta antal meningar som behövs för att svara användaren fullt ut.",
  normal: "Normal",
  normalDescription:
    "Sträva efter en balanserad svarslängd. Täck de viktiga punkterna utan att dra ut svaret.",
  thorough: "Grundlig",
  thoroughDescription:
    "Gå djupt och var heltäckande. Inkludera nyanser, detaljer, avvägningar och de resonemang som är viktiga.",
  professional: "Professionell",
  professionalDescription:
    "Tala som en senior konsult som informerar en kund. Exakt språk, ingen slang, mätt och auktoritativ.",
  casual: "Casual",
  casualDescription:
    "Prata som en smart vän på ett kafé. Avslappnad, naturlig, konverserande. Sammandragningar är bra, tangenter är bra.",
  nerdy: "Nördigt",
  nerdyDescription:
    "Tala som en entusiastisk expert som älskar att gå på djupet. Använd teknisk terminologi fritt, nörd med detaljer, anta att användaren kan hänga med.",
  concise: "Kortfattad",
  conciseDescription:
    "Var så kort som möjligt samtidigt som du är komplett. Ingen ingress, ingen fyllnadstext, bara svaret. Tänk telegramstil.",
  socratic: "Sokratisk",
  socraticDescription:
    "Utmana användarens tänkande. Ställ motfrågor, ge alternativa perspektiv, bekräfta inte bara vad de sa. Var en sparringspartner, inte en ja-maskin.",
  eli5: "ELI5",
  eli5Description:
    "Förklara allt så enkelt som möjligt. Använd analogier, vardagsspråk, noll jargong. Antag inga förkunskaper om något ämne.",
  useProvider: ({ provider }) => `Använd ${provider}`,
  createApiKey: "Inloggningsuppgifter",
  apiKey: "API-nyckel",
  aboutThisProvider: "Om denna leverantör",
  openRouterOnboardingTitle: "En nyckel, flera leverantörer",
  openRouterOnboardingDescription:
    "Skapa en dedikerad OpenRouter-nyckel, klistra in den nedan och använd ögonblicksbildsbaserade modeller från flera leverantörer utan att ersätta någon direkt anslutning.",
  openRouterOnboardingRoute:
    "Sökväg för begäran: denna enhet → OpenRouter → vald uppströmsleverantör",
  openRouterKeys: "OpenRouter nycklar",
  providerStatusInvalid: "Ogiltig",
  providerStatusTesting: "Testning",
  providerStatusConfigured: "Konfigurerad",
  providerStatusWorking: "Arbetar",
  providerStatusNotTested: "Ej testad",
  providerStatusNotSetup: "Ej inställd",
  expandProvider: ({ provider }) => `Expandera ${provider}`,
  collapseProvider: ({ provider }) => `Komprimera ${provider}`,
  testProviderKey: "Testnyckel",
  testAllCapabilities: "Testa alla",
  apiTest: "API-test",
  testProviderCapability: ({ capability }) => `Testa ${capability}`,
  test: "Testa",
  optional: "Valfritt",
  providerCapability_llm: "Svar",
  providerCapability_stt: "Talinmatning",
  providerCapability_tts: "Röstutgång",
  providerCapability_search: "Webbsökning",
  providerCapability_voices: "Röstbibliotek",
  providerValidationUnavailable:
    "Livevalidering är inte kopplad för denna leverantör ännu. Spara nyckeln här och verifiera den under faktisk användning.",
  providerNeedsAttention: "behöver uppmärksamhet",
  catalogProviderLimitsSummary: ({ summary }) => `Begränsningar: ${summary}`,
  catalogProviderRegionSummary: ({ summary }) => `Region: ${summary}`,
  validatingKey: "Validerar...",
  showKey: "Visa nyckel",
  hideKey: "Dölj nyckel",
  assistantInstructions: "Assistent instruktioner",
  systemPrompt: "Systemprompt",
  aboutSystemPrompt: "Om systemuppmaningen",
  assistantInstructionsIntro:
    "Forma den dolda vägledningen som modellen får före varje svar.",
  baseInstructions: "Grundinstruktioner",
  assistantInstructionsPlaceholder: "Definiera hur assistenten ska bete sig.",
  assistantInstructionsHint:
    "Detta läggs alltid före den valda svarslängden och tonen.",
  adaptiveLength: "Adaptiv längd",
  responseTone: "Svarston",
  homeStyleChipLabel: ({ tone, length }) => `Stil — ${tone} · ${length}`,
  styleSheetTitle: "Konversationsinställningar",
  styleSheetSubtitle: "Forma svar och tal endast för denna konversation.",
  openStyleSheet: "Öppna konversationsinställningar",
  conversationThinkingInstructions: "Tänkande instruktioner",
  conversationThinkingInstructionsDescription:
    "Lägg till instruktioner efter den globala systemuppmaningen för den här konversationen.",
  conversationThinkingInstructionsPlaceholder:
    "Till exempel: Utmana mina antaganden och använd konkreta exempel.",
  ttsInstructions: "Instruktioner för talleverans",
  ttsInstructionsDescription:
    "Styr tonen, takten, accenten eller leveransen som används av kompatibla talmodeller.",
  conversationTtsInstructionsDescription:
    "Lägg till leveransinstruktioner efter de globala talinstruktionerna för den här konversationen.",
  ttsInstructionsPlaceholder:
    "Till exempel: Tala varmt, tydligt och i ett avslappnat tempo.",
  ttsInstructionsUnsupported:
    "Den aktuella talvägen stöder inte leveransinstruktioner.",
  conversationVoiceDescription: ({ route }) =>
    `Välj rösten som används av ${route} i den här konversationen.`,
  scrollToLatest: "Bläddra till senaste meddelandet",
  conversationTitleGenerate: "Automatiskt generera titel",
  conversationTitleGenerating: "Skapar titel...",
  conversationTitleGenerated: "Konversationen har bytt namn.",
  conversationTitleNeedsContent:
    "Starta en konversation innan du skapar en titel.",
  conversationTitleNeedsProvider:
    "Konfigurera den valda modellen innan du skapar en titel.",
  conversationTitleGenerationFailed:
    "Det gick inte att skapa en konversationstitel.",
  conversationTitleGenerationTimedOut:
    "Titelgenereringen tog för lång tid. Försök igen.",
  inputMode: "Inmatningsläge",
  voiceInput: "Röstinmatning",
  pushToTalk: "Tryck för att prata",
  pushToTalkDescription:
    "Håll ned huvudknappen medan du talar och släpp sedan för att skicka.",
  toggleToTalk: "Växla till Tala",
  toggleToTalkDescription:
    "Tryck en gång för att börja spela in och tryck igen när du är klar.",
  driveSession: "Körläge",
  driveSessionDescription:
    "När automatisk fortsättning är på startar inspelningen efter varje talat svar. Tryck på huvudknappen när du är klar med att prata.",
  stopDriveSession: "Pausa auto",
  repeatDriveReply: "Upprepa sist",
  continueDriveSession: "Återuppta auto",
  speechToText: "Tal till text",
  appNative: "Systemigenkänning",
  nativeSttDescription:
    "Använd operativsystemets taligenkännare. Beroende på enhetsinställningar kan igenkänning köras på enheten eller via systemtjänsten. Ingen leverantörsnyckel krävs.",
  provider: "Leverantör",
  webSearchProvider: "Webbsökleverantör",
  webSearchProviderMissingHint:
    "Konfigurera minst en sökkompatibel tjänst i inloggningsuppgifter för att aktivera webbjordning här.",
  webSearchModelHint: ({ model }) =>
    `Använder ${model} bakom kulisserna för live-web jordning.`,
  webSearchHomeHint:
    "Använd startskärmsknappen för att slå på eller av webbjordning för den här tråden.",
  settingsWebSearchCompactHint:
    "Alternativt kan du lägga till färsk webbkontext innan huvudmodellen svarar.",
  webSearchAdvanced: "Avancerade sökkontroller",
  expandAdvancedSearch: "Utöka avancerade sökkontroller",
  collapseAdvancedSearch: "Komprimera avancerade sökkontroller",
  webSearchSetupNeeded:
    "Lägg till autentiseringsuppgifter för att använda live webbsökning.",
  webSearchEnabledDescription:
    "Nytt webbkontext läggs till innan modellen svarar.",
  webSearchDisabledDescription:
    "Använd live webbkontext för den här tråden när aktuella fakta är viktiga.",
  webSearchQualityControls: "Sökkvalitet",
  webSearchSearchMode: "Sökläge",
  webSearchSearchModeQuick: "Snabbt",
  webSearchSearchModeBalanced: "Balanserad",
  webSearchSearchModeDeep: "Djupt",
  webSearchDepth: "Sökdjup",
  webSearchDepthStandard: "Standard",
  webSearchDepthDeep: "Djupt",
  webSearchResultCount: "Resultaträkning",
  webSearchQualityHint: ({ provider }) =>
    `Dessa kontroller ställer in hur ${provider} samlar nytt sammanhang innan svaret.`,
  webSearchNoExtraControls: ({ provider }) =>
    `${provider} exponerar inte extra sökkvalitetskontroller i den här appen ännu.`,
  setWebSearchMode: ({ mode }) => `Ställ in webbsökningsläget på ${mode}`,
  openWebSearchSettings: "Öppna webbsökningsinställningar",
  providerSttDescription:
    "Använd en konfigurerad extern tjänst för att transkribera din röst innan den skickas till svarsvägen.",
  sttProvider: "STT-leverantör",
  sttProviderEnabledHint:
    "Endast aktiverade leverantörer med stöd för transkription visas här.",
  sttProviderMissingHint:
    "Lägg till autentiseringsuppgifter för en tjänst med STT-stöd för att välja den här.",
  nativeSttHint:
    "Systemigenkänning fungerar oberoende av dina leverantörsnycklar och kan bearbetas på enheten eller av operativsystemets taltjänst.",
  replyPlayback: "Svara Uppspelning",
  sentencesArrive: "Stycken anländer",
  sentencesArriveDescription: "Börja tala så snart ett helt stycke är klart.",
  fullReplyFirst: "Fullständigt svar först",
  fullReplyFirstDescription:
    "Generera hela svaret först och spela det sedan i ett pass.",
  textToSpeech: "Text till tal",
  spokenReplies: "Talade svar",
  spokenRepliesEnabledDescription:
    "Läs assistentens svar högt när en röstrutt är tillgänglig.",
  spokenRepliesDisabledDescription:
    "Behåll svaren endast som text tills vidare. Din föredragna TTS-rutt sparas för senare.",
  nativeTtsDescription:
    "Använd enhetens talmotor för talade svar och röstförhandsgranskning.",
  kokoroTtsDescription:
    "Använd en mycket mer naturlig neural röst helt och hållet på den här enheten. Uppläst svarstext syntetiseras lokalt, utan någon nyckel för talleverantör eller användningsavgift.",
  kokoroVoices: "Kokoro Röster på enheten",
  kokoroVoicesHint: ({ size, installedSize }) =>
    `Den flerspråkiga modellen laddar ner cirka ${size} MB och upptar cirka ${installedSize} MB efter installationen.`,
  kokoroModel: "Kokoro flerspråkig modell",
  kokoroChecking: "Kontrollerar enhetens modell...",
  kokoroDownloading: ({ progress }) => `Laddar ned... ${progress}%`,
  kokoroExtracting: ({ progress }) => `Installerar... ${progress}%`,
  kokoroVerifying: "Verifierar röstmotorn...",
  kokoroInstalled: "Installerad och klar på den här enheten.",
  kokoroNotInstalled: "Valfri nedladdning. Ingen leverantörsnyckel krävs.",
  kokoroLanguageFallback:
    "Kokoro talar för närvarande engelska och förenklad kinesiska här. För andra valda svarsspråk, lägg till en explicit reservrutt annars stoppas talet med ett fel.",
  kokoroRemoveTitle: "Ta bort Kokoro-modellen?",
  kokoroRemoveBody: ({ installedSize }) =>
    `Detta frigör ungefär ${installedSize} MB. Du kan ladda ner modellen igen när som helst.`,
  removeKokoroModel: "Ta bort Kokoro-modellen",
  downloadKokoroModel: "Ladda ner Kokoro-modellen",
  kokoroFallbackNeeded: ({ languages }) =>
    `En explicit reservrutt krävs för: ${languages}.`,
  kokoroNoSelectedLanguages:
    "Välj engelska eller förenklad kinesiska under Lyssna på språk för att konfigurera en Kokoro-röst.",
  expandVoiceSettings: ({ language }) =>
    `Expandera ${language} röstinställningar`,
  collapseVoiceSettings: ({ language }) =>
    `Komprimera ${language} röstinställningar`,
  remove: "Ta bort",
  voiceOutputDescription:
    "Välj talmotor, lyssnande språk och röstförhandsvisningar för talade svar.",
  localTts: "Lokalt",
  localTtsDescription:
    "Använd en matchande nedladdad lokal röst för talade svar.",
  providerTtsDescription:
    "Använd den valda konfigurerade tjänsten för talade svar.",
  ttsFallbackRoutes: "Reservrutter",
  ttsFallbackRoutesHint:
    "Valfritt. Lägg bara till de rutter du vill ha, i den ordning de ska provas. När en rutt börjar tala, stannar Herr Broccoli på den under resten av svaret.",
  ttsFallbackNone: "Ingen reserv är konfigurerad. Ett röstfel visas istället.",
  ttsFallbackPosition: ({ position, route }) => `${position}. ${route}`,
  addFallbackRoute: ({ route }) => `Lägg till ${route} reserv`,
  removeFallbackRoute: ({ route }) => `Ta bort ${route} reserv`,
  moveFallbackEarlier: ({ route }) => `Flytta ${route} tidigare`,
  moveFallbackLater: ({ route }) => `Flytta ${route} senare`,
  ttsProvider: "TTS-leverantör",
  ttsProviderEnabledHint:
    "Endast aktiverade leverantörer med stöd för talat svar visas här.",
  ttsProviderMissingHint:
    "Lägg till autentiseringsuppgifter för en tjänst med TTS-support för att välja den här.",
  localTtsOrderHint: "Endast explicit konfigurerade reservrutter görs försök.",
  providerTtsOrderHint:
    "Endast explicit konfigurerade reservrutter görs försök.",
  nativeTtsHint:
    "Native TTS använder systemets röststack och kräver ingen leverantörsnyckel.",
  localTtsLanguageCoverageHint:
    "Lokala paket täcker för närvarande engelska, tyska, förenklad kinesiska, spanska, portugisiska, hindi, franska och italienska.",
  ttsVoice: "TTS röst",
  refresh: "Uppdatera",
  providerVoiceDirectory: ({ provider }) => `${provider} röstbibliotek`,
  refreshProviderVoices: ({ provider }) => `Uppdatera ${provider} röster`,
  providerVoicesAvailable: ({ count, provider }) =>
    `${count} röster tillgängliga från ${provider}`,
  providerVoicesLoadFailed:
    "Röster kunde inte uppdateras. Ditt nuvarande val är oförändrat; du kan fortfarande ange ett röst-ID manuellt.",
  providerVoicesLoadFailedWithFallback:
    "Kontoröster kunde inte laddas. Den inbyggda rösten förblir tillgänglig.",
  providerVoicesErrorDetail: ({ detail }) => `Anledning: ${detail}`,
  elevenLabsVoicesReadPermissionHint:
    "I ElevenLabs, redigera denna API-nyckel och aktivera Röster → Läs och uppdatera sedan här.",
  providerVoicesLoadingHint: ({ provider }) =>
    `Herr Broccoli laddar tillgängliga röster automatiskt från ${provider}.`,
  providerVoiceId: "Röst-ID",
  providerVoiceIdPlaceholder: "Ange ett röst-ID",
  providerVoiceIdFallbackHint:
    "Manuell inmatning förblir tillgänglig när röstbiblioteket inte kan laddas.",
  providerVoiceIdRequired: ({ provider }) =>
    `Uppdatera ${provider} röstbibliotek eller ange ett röst-ID innan du använder tal.`,
  qwenSpeechUnavailableInUs:
    "Herr Broccolis nuvarande Qwen-talrutter är inte tillgängliga i USA-regionen. Välj Singapore eller Peking för Qwen-tal.",
  qwenApiRegion: "Qwen API-region",
  qwenRegionSingapore: "Singapore",
  qwenRegionUs: "USA (Virginia)",
  qwenRegionBeijing: "Kina (Peking)",
  qwenRegionHint:
    "Den valda regionen måste matcha regionen där denna API-nyckel skapades.",
  qwenRegionUsSpeechHint:
    "USA-regionnycklar stöder chatt och webbsökning här. Herr Broccolis nuvarande Qwen STT- och TTS-rutter kräver en Singapore- eller Beijing-nyckel.",
  providerDefaultVoiceHint:
    "Denna leverantör använder för närvarande sin standardröst för förhandsgranskning och talade svar.",
  listenLanguages: "Lyssna på språk",
  listenLanguagesHint:
    "Välj de svarsspråk du vill ska låta bra. Herr Broccoli provar dem i denna ordning vid dirigering av talutgång.",
  listenLanguagesSelected: ({ count }) =>
    count === 1 ? "1 språk valt" : `${count} språk har valts`,
  localVoicePacks: "Lokala röstpaket",
  localVoicePacksHint:
    "Varje språk behåller sin egen lokala röst. Välj den röst du vill ha för det språket och ladda sedan bara ned de paket du verkligen bryr dig om.",
  localVoiceForLanguage: ({ languageLabel }) => `Röst för ${languageLabel}`,
  providerVoicePreviews: "Providers röstförhandsvisningar",
  providerVoicePreviewsHint:
    "Testa den för närvarande valda TTS-rutten här med en separat förhandsgranskningstext för varje svarsspråk.",
  nativeVoicePreviewSection: "Förhandsgranskning av systemröst",
  nativeVoicePreviewSectionHint:
    "Denna talar direkt genom telefonens inbyggda talsyntes så att du kan jämföra den med konfigurerade leverantörsröster.",
  nativeVoiceUnavailable:
    "Den här enheten har inte rapporterat några inbyggda systemröster för förhandsgranskning.",
  runtimeCompatibilityOverrides: "Körningskompatibilitet",
  runtimeCompatibilityOverridesDescription: ({ count }) =>
    `${count} modell- eller inställningskonfigurationer som leverantören bekräftat som otillgängliga är inaktiverade endast på den här enheten. Herr Broccoli kringgår dem automatiskt.`,
  clearRuntimeCompatibilityOverrides: "Rensa körningskompatibilitet",
  clearRuntimeCompatibilityOverridesConfirmationTitle:
    "Rensa körningskompatibiliteten?",
  clearRuntimeCompatibilityOverridesConfirmationMessage:
    "Tidigare inaktiverade konfigurationer kan provas igen. Leverantören kan avvisa dem på nytt.",
  speechDiagnostics: "Senaste talaktivitet",
  speechDiagnosticsHint:
    "Visar de senaste talförfrågningarna, rutten de bad om, rutten de faktiskt använde och eventuella reservorsaker.",
  clearSpeechDiagnostics: "Rensa senaste talaktivitet",
  speechDiagnosticsEmpty:
    "Inga nya talförfrågningar ännu. Förhandsgranska en röst eller spela upp ett svar för att se ruttdetaljer här.",
  clearSpeechDiagnosticsConfirmationTitle: "Rensa den senaste talaktiviteten?",
  clearSpeechDiagnosticsConfirmationMessage:
    "Detta tar bort all infångad diagnostik för taldirigering. Denna åtgärd kan inte ångras.",
  speechDiagnosticSourceConversation: "Konversationssvar",
  speechDiagnosticSourceRepeat: "Upprepa svar",
  speechDiagnosticSourcePreview: "Röstförhandsvisning",
  speechDiagnosticSourceUnknown: "Talförfrågan",
  speechDiagnosticRouteLine: ({ requested, actual }) =>
    `Begärt: ${requested} -> Faktiskt: ${actual}`,
  speechDiagnosticStageLine: ({ stage }) => `Senaste etapp: ${stage}`,
  speechDiagnosticLanguageLine: ({ languageLabel }) =>
    `Språk: ${languageLabel}`,
  speechDiagnosticProviderLine: ({ provider }) => `Leverantör: ${provider}`,
  speechDiagnosticVoiceLine: ({ voice }) => `Röst: ${voice}`,
  localTtsPackReady: "Installerad på den här enheten.",
  localTtsPackBroken:
    "Nedladdat, men den här rösten misslyckades med lokal verifiering på den här enheten. Ladda ner den igen eller välj en annan röst.",
  localTtsPackMissing:
    "Inte installerat ännu. Cloud TTS eller systemrösten kommer att användas tills du laddar ner den.",
  localTtsUnsupportedLanguageFallback:
    "Ett lokalt paket är ännu inte tillgängligt för detta språk. Cloud TTS eller systemrösten kommer att hantera det.",
  downloadingLocalTtsPack: ({ progress }) =>
    `Laddar ner lokalt paket... ${progress}%`,
  download: "Ladda ner",
  downloadingShort: "Laddar...",
  voicePreviewText: "Röstförhandsgranska text",
  voicePreviewPlaceholder: "Skriv en fras för att höra den här rösten.",
  voicePreviewHint:
    "Använder den för närvarande valda svarsröstbackend utan att skicka något till språkmodellen.",
  previewVoice: "Förhandsgranska röst",
  generatingPreview: "Genererar förhandsgranskning...",
  playingPreview: "Förhandsvisning spelas upp...",
  systemVoice: "Systemröst",
  spokenRepliesOff: "Endast text",
  noTtsProvider: "Ingen TTS-leverantör",
  nothingToCopyYet: "Inget att kopiera än.",
  couldntCopyText: "Det gick inte att kopiera den texten.",
  nothingToShareYet: "Inget att dela ännu.",
  couldntShareText: "Det gick inte att dela den texten.",
  couldntReplayReply: "Det gick inte att spela upp det svaret.",
  replyFailed: "Svar misslyckades",
  retryReply: "Försök svara igen",
  replyFailedHint: "Du kan välja en annan modell ovan innan du försöker igen.",
  spokenReplyFailed: "Svaret sparades, men det gick inte att uttala det.",
  retrySpeech: "Försök att tala igen",
  openSpeakingSettings: "Talinställningar",
  messageCopied: "Meddelandet har kopierats.",
  noConversationToCopyYet: "Ingen konversation att kopiera ännu.",
  noConversationToShareYet: "Ingen konversation att dela ännu.",
  noReplyToRepeatYet: "Inget svar på repris ännu.",
  threadCopied: "Tråden kopierad.",
  threadRenamed: "Tråden bytt namn.",
  threadPinned: "Tråd fastnålad.",
  threadUnpinned: "Tråd lossad.",
  addProviderKeyToUseProvider: ({ provider }) =>
    `Lägg till autentiseringsuppgifter för ${provider} i Inställningar innan du använder den här rutten.`,
  configureCredentialsBeforeVoiceSession:
    "Lägg till autentiseringsuppgifter i Inställningar innan du startar en röstsession.",
  endpointCredentialFormatInvalid: ({ provider }) =>
    `För ${provider} anger du leverantörens bas-URL och API-nyckel som https://ditt-slutpunkt.exempel.com|din-api-nyckel.`,
  speechRecognitionUnavailableOnDevice:
    "Taligenkänning är inte tillgängligt på den här enheten.",
  debugLogLabel: "LOGG",
  debugLogCaptureStarted: "Felsökningsloggning startade.",
  debugLogCaptureStopped: ({ entryCount, fileName }) =>
    `Felsökningslogg sparad som ${fileName} och kopierad till urklipp (${entryCount}-poster).`,
  debugLogCaptureStoppedNoClipboard: ({ entryCount, fileName }) =>
    `Felsökningslogg sparad som ${fileName} (${entryCount}-poster).`,
  debugLogCaptureRecovered: ({ entryCount, fileName }) =>
    `Återställde tidigare felsökningslogg ${fileName} och kopierade den till urklipp (${entryCount}-poster).`,
  debugLogCaptureRecoveredNoClipboard: ({ entryCount, fileName }) =>
    `Återställd tidigare felsökningslogg ${fileName} (${entryCount}-poster).`,
  debugLogCaptureFailed: "Det gick inte att spara felsökningsloggen.",
  chooseSttBeforeVoiceSession:
    "Välj en konfigurerad STT-rutt i Inställningar innan du startar en röstsession.",
  chooseTtsBeforeSpokenReplies:
    "Välj en konfigurerad TTS-rutt i Inställningar innan du använder talade svar.",
  stopSessionBeforeReplay:
    "Stoppa den aktiva röstsessionen innan du spelar upp det senaste svaret.",
  couldntCatchThatTryAgain: "Det gick inte att fånga det, försök igen.",
  couldntStartVoiceInput: "Det gick inte att starta röstinmatning.",
  couldntProcessVoiceInput: "Det gick inte att bearbeta röstinmatning.",
  maxRecordingLengthReached:
    "Maximal inspelningslängd uppnådd — skickar det jag har.",
  sttRecordingTooLarge: ({ provider, limit }) =>
    `Den inspelningen är för lång för ${provider} tal-till-text (max ${limit}). Försök med ett kortare meddelande eller byt Tal-till-text till Systemigenkänning.`,
  addProviderKeyToEnableProvider: ({ provider }) =>
    `Lägg till autentiseringsuppgifter för ${provider} i Inställningar innan du använder den här rutten.`,
  stopSessionBeforePreview:
    "Stoppa den aktiva röstsessionen innan du förhandsgranskar en röst.",
  chooseTtsToPreviewVoices:
    "Välj en konfigurerad TTS-rutt i Inställningar för att förhandsgranska röster.",
  downloadSelectedLocalVoiceFirst: ({ languageLabel }) =>
    `Ladda ner den valda ${languageLabel} lokala rösten först.`,
  couldntPreviewVoice: "Det gick inte att förhandsgranska rösten.",
  spokenRepliesDisabled: "Talade svar är avstängda i Inställningar.",
  providerVoiceFallback:
    "Konfigurerad röstrutt misslyckades. Ändrade det här svaret till en reservröst.",
  localVoiceFallback:
    "Lokal röst var inte tillgänglig. Ändrade det här svaret till en reservröst.",
  localTtsPackInstalled: ({ languageLabel }) =>
    `${languageLabel} lokalt röstpaket installerat.`,
  localTtsPackInstallFailed:
    "Det gick inte att installera det lokala röstpaketet.",
  clear: "Rensa",
  voiceOutput: "Röstutgång",
  speechReplayCache: "Cache för taluppspelning",
  speechReplayCacheDescription:
    "Leverantörsgenererat tal sparas på enheten i upp till 14 dagar, så att spela upp ett svar igen förbrukar inga nya talkrediter.",
  clearSpeechReplayCache: "Rensa talcache",
  speechReplayCacheCleared: "De cachade talfilerna har tagits bort.",
  speechReplayCacheClearFailed: "Det gick inte att rensa talcachen.",
  currentSetup: "Aktuell inställning",
  listeningToYourVoice: "Lyssnar på din röst",
  parsingYourVoiceInput: "Förvandla din röst till text",
  preparingRequest: "Förbereder din förfrågan",
  searchingTheWeb: "Söker på nätet efter nya sammanhang",
  waitingForProvider: ({ provider }) => `Väntar på ${provider}`,
  preparingVoiceWithProvider: ({ provider }) =>
    `Förbereder röst med ${provider}`,
  deepThinkingReassurance: "Bra svar tar en stund...",
  thinkingElapsed: ({ detail, seconds }) => `${detail} · ${seconds}s`,
  speakingBackToYou: "Talar tillbaka till dig",
  freshSession: "Fräsch session",
  messageCount: ({ count }) =>
    Number(count) === 1 ? "1 meddelande" : `${count} meddelanden`,
  speechInputRoute: ({ route }) => `Tal i: ${route}`,
  replyModelRoute: ({ route }) => `Svarsmodell: ${route}`,
  voiceOutputRoute: ({ route }) => `Röst ut: ${route}`,
  fallbackVoiceOutputRoute: ({ route }) => `Reservröst ut: ${route}`,
  conversation: "Konversation",
  conversationActions: "Konversationsåtgärder",
  statusDetails: "Statusinformation",
  persistenceFailure:
    "Herr Broccoli kunde inte spara data på den här enheten. Håll appen öppen och försök igen; de senaste ändringarna kan gå förlorade efter omstart.",
  show: "Visa",
  showTranscript: "Visa utskrift",
  hide: "Göm",
  copyThread: "Kopiera tråden",
  shareThread: "Dela tråd",
  repeatReply: "Upprepa svar",
  renameThread: "Byt namn på tråden",
  renameThreadHint:
    "Ge den här konversationen en titel som du snabbt kan hitta senare.",
  threadTitle: "Trådens titel",
  noTranscriptYet: "Ingen utskrift ännu",
  previewTranscriptEmptyDescription:
    "Använd röst eller text för att börja. Din konversation kommer att visas här.",
  noConversationYet: "Ingen konversation ännu",
  expandedTranscriptEmptyDescription:
    "Använd röst eller text för att börja. Stäng den här skärmen när du vill återgå till huvudscenen.",
  transcriptSelectionHint:
    "Välj valfri meddelandetext direkt, eller dela och kopiera enskilda meddelanden nedan.",
  textMessagePlaceholder: "Skriv ett meddelande",
  sendTextMessage: "Skicka meddelande",
  showVoiceInput: "Visa röstinmatning",
  showTextInput: "Visa textinmatning",
  usageStatsHiddenDescription:
    "Håll tokenuppskattningar borta från transkriptionsgränssnittet.",
  usageStatsVisibleDescription:
    "Visa uppskattad tokenanvändning för svar och konversationssummor.",
  debugLogButton: "Felsökningsloggknapp",
  debugLogButtonHiddenDescription:
    "Håll hemskärmens LOG-knapp dold om inte en inspelning redan körs.",
  debugLogButtonVisibleDescription:
    "Visa startskärmens LOG-knapp för att starta och stoppa felsökningsfångst.",
  debugLogButtonUsageDescription:
    "Så här använder du knappen: om du aktiverar den börjar loggar registreras. Om du stänger av den slutar du fånga loggar och flytta de fångade till urklippet.",
  estimatedUsageTitle: "Beräknad användning",
  estimatedUsageCounts: ({ replies, summaries }) =>
    `${replies} svarar · ${summaries} minnesuppdateringar`,
  estimatedUsageConversationScope:
    "Summorna inkluderar varje rutt och modell som används i den här konversationen.",
  estimatedPromptTokens: ({ count }) => `Uppmaning: ${count}`,
  estimatedReplyTokens: ({ count }) => `Svar: ${count}`,
  estimatedTotalTokens: ({ count }) => `Totalt: ${count}`,
  estimatedUsageInline: ({ prompt, completion, total }) =>
    `Uppskattad ${prompt} in · ${completion} ut · ${total} totalt`,
  searchQuery: "Sökfråga",
  expandWebSearchDetails: "Visa webbsökningsdetaljer",
  collapseWebSearchDetails: "Dölj webbsökningsdetaljer",
  webSearchSourceCount: ({ count }) => `${count} källor`,
  sources: "Källor",
  openSourceLink: ({ source }) => `Öppen källkod: ${source}`,
  turnReceipt: "Vänd detaljer",
  expandTurnReceipt: "Visa svängdetaljer",
  collapseTurnReceipt: "Dölj svängdetaljer",
  turnReceiptDirect: "Direkt",
  turnReceiptRequested: "Begärt svarsväg",
  turnReceiptActual: "Faktisk svarsväg",
  turnReceiptEffort: "Resonemang kontroll",
  turnReceiptProviderNative: "leverantör-infödd",
  turnReceiptInput: "Inmatningsrutt",
  turnReceiptSearch: "Webbsökning",
  turnReceiptVoice: "Röstutgång",
  turnReceiptContext: "Sammanhang",
  turnReceiptTiming: "Timing",
  turnReceiptFallback: "Reservorsak",
  turnReceiptVoiceInput: "Röst",
  turnReceiptTypedInput: "Skrivet",
  turnReceiptSystemSpeech: "System taligenkänning",
  turnReceiptSystemVoice: "Systemröst",
  turnReceiptSystemVoiceFallback: "Systemröst · reserv",
  turnReceiptOff: "Av",
  turnReceiptNotConfigured: "På · inte konfigurerad",
  turnReceiptFallbackWithoutSearch: "Fortsatte utan livesökning",
  turnReceiptNotUsed: "Ej använd",
  turnReceiptSummaryReused: "sparad sammanfattning återanvänds",
  turnReceiptSummaryUpdated: "sammanfattningen uppdaterad",
  turnReceiptContextFallback: "fallback av senaste meddelande",
  turnReceiptGatewayCompression: ({ original, compressed }) =>
    `gateway komprimerade ${original} till ${compressed} meddelanden`,
  turnReceiptContextValue: ({ sent, total, summarized, state }) =>
    `${sent}/${total} tidigare meddelanden skickade · ${summarized} nyligen sammanfattade${state}`,
  turnReceiptTimingStt: "STT",
  turnReceiptTimingContext: "sammanhang",
  turnReceiptTimingSearch: "sök",
  turnReceiptTimingModel: "modell",
  turnReceiptTimingFirstSpeech: "första talet",
  turnReceiptTimingTotal: "totalt",
  estimatedRouteUsageTokensOnly: ({ tokens }) => `${tokens} tokens`,
  unknownUsageRoute: "Okänd rutt",
  setupGuideConnectProviderTitle: "Konfigurera autentiseringsuppgifter",
  setupGuideConnectProviderDescription:
    "Lägg till autentiseringsuppgifter i Inställningar och välj sedan de rutter du vill använda.",
  idle: "Inaktiv",
  yourConversationAppearsHere: "Din konversation visas här",
  defaultTranscriptEmptyDescription:
    "Använd röst eller text för att börja. Herr Broccoli kommer att behålla tråden och svara här.",
  delete: "Ta bort",
  deleteConversationConfirmationTitle: ({ title }) => `Ta bort "${title}"?`,
  deleteConversationConfirmationMessage:
    "Detta tar permanent bort konversationen och alla dess meddelanden. Denna åtgärd kan inte ångras.",
  memory: "Minne",
  conversations: "Samtal",
  drawerSubtitle: "Hoppa mellan live-trådar eller starta ett nytt rum.",
  newSession: "Ny session",
  noSavedConversationsYet: "Inga sparade konversationer än",
  drawerEmptyDescription:
    "Börja tala från huvudvyn och Herr Broccoli bygger en session automatiskt.",
  setupGuideTitle: "Konfigurera appen",
  setupGuideSubtitle:
    "Lägg till autentiseringsuppgifter och välj rutter i Inställningar.",
  fastestStartPreset: "Minimal inställning",
  fastestStartDescription:
    "Använd enhetstal där det är tillgängligt och konfigurera endast den svarsrutt du behöver.",
  fullVoicePreset: "Konfigurerad röst",
  fullVoiceDescription:
    "Använd konfigurerade tjänster för svar, transkription och talad utdata när du väljer dem.",
  setupGuideNote:
    "Vi kommer att öppna Inställningar härnäst så att du kan klistra in och validera autentiseringsuppgifter.",
  useThisSetup: "Använd denna inställning",
  notNow: "Inte nu",
  setupGuideIntroTitle: "Hur Herr Broccoli fungerar",
  setupGuideIntroBody:
    "Herr Broccoli börjar tomt. Lägg till autentiseringsuppgifter för externa tjänster som du redan använder och välj sedan hur svar, talinmatning, talad utdata och valfri webbkontext dirigeras.",
  setupGuideIntroNote:
    "Efter installationen använder du huvudröstkontrollen för att starta och stoppa en konversation. Den aktuella utskriften förblir tillgänglig på startskärmen och varje rutt kan ändras senare i Inställningar.",
  setupGuideProviderTitle: "Lägg till autentiseringsuppgifter",
  setupGuideProviderBody:
    "Välj den externa tjänst du vill konfigurera och klistra sedan in autentiseringsuppgifter med svarsåtkomst.",
  setupGuideProviderPickerLabel: "Svarstjänst",
  setupGuideSelectProvider: "Välj en leverantör",
  setupGuideSelectProviderFirst: "Välj en leverantör först.",
  setupGuideApiKeyLabel: "API-nyckel",
  setupGuideApiKeyPlaceholder: "Klistra in autentiseringsuppgifter",
  setupGuideContinue: "Fortsätt",
  setupGuideOpenSettings: "Öppna Inställningar",
  setupGuideBack: "Tillbaka",
  setupGuideValidateKey: "Validera nyckel",
  setupGuideApiKeyRequiredOrCancel:
    "Lägg till en API-nyckel för att fortsätta eller avbryt installationsguiden.",
  setupGuideProviderAndApiKeyRequiredOrCancel:
    "Välj en leverantör och lägg till en API-nyckel för att fortsätta, eller avbryt installationsguiden.",
  setupGuideProviderKeyNeedsLlmAccess: ({ provider }) =>
    `Dessa ${provider}-uppgifter tillåter inte svarsförfrågningar.`,
  setupGuideKokoroTitle: "Lägg till en naturlig röst på enheten",
  setupGuideKokoroBody: ({ size }) =>
    `Valfritt: ladda ner Kokoro (cirka ${size} MB) för mycket mer naturliga talade svar utan en talleverantör eller användningsavgifter.`,
  setupGuideKokoroLanguageNote:
    "Denna modell talar för närvarande engelska och förenklad kinesiska. Konfigurera eventuella reservrutter du vill ha senare i Talinställningar.",
  setupGuideKokoroDownload: "Ladda ner Kokoro",
  setupGuideUseKokoro: "Använd Kokoro för talade svar",
  setupGuideUseKokoroSummary:
    "Håll syntes på telefonen när svarsspråket stöds.",
  setupGuideSkipKokoro: "Hoppa över nu",
  setupGuideVoiceTestTitle: "Testa din installation",
  setupGuideVoiceTestBody:
    "Säg en kort mening. Herr Broccoli kommer att testa mikrofonåtkomst, transkription, den konfigurerade svarsvägen och talad utdata när en acceptabel röstväg är tillgänglig.",
  setupGuideVoiceTestNoInputBody:
    "Röstinmatning är inte tillgänglig med denna inställning. Fortsätt att granska de upptäckta rutterna och justera sedan talinställningarna senare om det behövs.",
  setupGuideVoiceTestTextOnlyNote:
    "Detta test förblir endast text eftersom ingen acceptabel talad röstrutt är klar ännu.",
  setupGuideVoiceTestStart: "Starta testet",
  setupGuideVoiceTestStop: "Sluta spela in",
  setupGuideVoiceTestRetry: "Kör igen",
  setupGuideVoiceTestTranscribing: "Transkriberar...",
  setupGuideVoiceTestThinking: "Testar svar...",
  setupGuideVoiceTestSynthesizing: "Förbereder röst...",
  setupGuideVoiceTestSpeaking: "Spelar upp svar...",
  setupGuideVoiceTestTranscript: "Avskrift",
  setupGuideVoiceTestReply: "Svara",
  setupGuideVoiceTestReset: "Rensa detta resultat",
  setupGuideVoiceInputUnavailable:
    "Röstinmatning är inte tillgänglig för den här konfigurationen på den här enheten.",
  setupGuideSummaryTitle: "Installationen är klar",
  setupGuideSummaryBody:
    "Här är rutten Herr Broccoli kommer att använda med din nuvarande konfiguration.",
  setupGuideSummaryLlm: "LLM",
  setupGuideSummaryStt: "Tal till text",
  setupGuideSummaryTts: "Text till tal",
  setupGuideSummaryWebSearch: "Webbsökning",
  setupGuideRouteProviderLlm: ({ provider }) => `Aktiverad via ${provider}`,
  setupGuideRouteOnDeviceStt: "Aktiverad via systemets taligenkänning",
  setupGuideRouteProviderStt: ({ provider }) =>
    `Aktiverad via ${provider} taltranskription`,
  setupGuideRouteProviderTts: ({ provider }) =>
    `Aktiverad via ${provider} röst`,
  setupGuideRouteKokoroTts: "Aktiverad via Kokoro röst på enheten",
  setupGuideRouteLocalTts: "Aktiverad via lokalt röstpaket",
  setupGuideRouteUnavailable: "Ej tillgängligt",
  setupGuideRouteOff: "Av",
  setupGuideWebSearchAvailableOff: ({ provider }) =>
    `Tillgänglig via ${provider}, för närvarande avstängd`,
  setupGuideSummaryTextOnlyNote:
    "Talade svar är avstängda för tillfället. Svar förblir i text tills du aktiverar en leverantör eller lokal röst.",
  setupGuideFinish: "Klart",
  searchConversationsPlaceholder:
    "Sök efter titlar, modeller och meddelandetext",
  noMatchingConversations: "Inga matchande konversationer",
  noMatchingConversationsDescription:
    "Prova en annan titel, rutt, modell eller fras från avskriften.",
  memoryModalTitle: "Konversationsminne",
  memoryModalDescription:
    "Detta är den kompakta sammanfattningen Herr Broccoli förs vidare när en tråd blir tillräckligt lång för att komprimera äldre varv.",
  memorySummary: "Sparad sammanfattning",
  memorySummaryEmpty:
    "Inget kompakt minne ännu. När den här tråden blir längre kommer äldre svängar att sammanfattas här.",
  summarizedTurnsCount: ({ count }) =>
    Number(count) === 1 ? "1 sammanfattad tur" : `${count} sammanfattade turer`,
  copyMemory: "Kopiera minne",
  forgetMemory: "Glöm minnet",
  memoryCopied: "Minnet har kopierats.",
  memoryCleared: "Konversationsminnet har rensats.",
  noConversationToManageYet: "Inget konversationsminne tillgängligt ännu.",
  noProviderYet: "Ingen leverantör ännu",
  noModelYet: "Ingen modell än",
  startedAt: "Startade",
  endedAt: "Slutade",
  pinned: "Fäst",
  copy: "Kopiera",
  share: "Dela",
  rename: "Byt namn",
  pin: "Pin",
  unpin: "Lossa",
  save: "Spara",
  cancel: "Avbryt",
  stop: "Sluta",
  pause: "Pausa",
  resume: "Återuppta",
  paused: "Pausad",
  listening: "Lyssnar",
  parsing: "Transkribering",
  searching: "Söker",
  converting: "Konverterar",
  webSearchAction: "webbsökning",
  thinking: "Tänker",
  speaking: "Talar",
  pleaseWait: "Vänta",
  yourTurn: "Din tur",
  keepPressing: "Fortsätt att trycka",
  tapWhenDone: "Tryck på när du är klar",
  speechPaused: "Talet pausas",
  pausePlaybackUnavailable:
    "Den här röstrutten kan inte pausas. Stoppa det eller byt till leverantörens röstutgång.",
  holdToSpeak: "Håll för att tala",
  tapToSpeak: "Tryck för att tala",
  tapAgainToSend: "Tryck igen för att skicka",
  waitingForReply: "Väntar på svar",
  parsingYourVoice: "Analyserar din röst",
  providerConfiguredInSettings: ({ provider }) =>
    `${provider} är inte konfigurerad i Inställningar.`,
  providerNetworkError: ({ provider, action }) =>
    `Det gick inte att nå ${provider} för ${action}. Kontrollera anslutningen och försök igen.`,
  providerAuthError: ({ provider, action }) =>
    `${provider} avvisade autentiseringsuppgifterna för ${action}. Kontrollera API-nyckeln och behörigheterna.`,
  providerRateLimitError: ({ provider, action }) =>
    `${provider} är hastighetsbegränsande ${action} just nu. Försök igen om ett ögonblick.`,
  providerCreditsRequired: ({ provider, action }) =>
    `${provider} behöver tillräckligt med API-kredit för ${action}. Kontrollera kontosaldot och nyckelns utgiftsgräns.`,
  providerTimeoutError: ({ provider, action }) =>
    `${provider} tog för lång tid under ${action}. Försök igen.`,
  providerTemporaryError: ({ provider, action }) =>
    `${provider} hade ett tillfälligt problem under ${action}. Försök snart igen.`,
  providerEmptyReplyError: ({ provider }) =>
    `${provider} avslutade utan att svara. Försök igen.`,
  providerIncompleteReplyError: ({ provider }) =>
    `${provider}s svar avslutades innan det var komplett. Försök igen.`,
  providerContextTooLong: ({ provider }) =>
    `${provider} avvisade svaret eftersom konversationen blev för lång. Starta en ny tråd eller förkorta begäran.`,
  providerRequestRejected: ({ provider, action, detail }) =>
    detail
      ? `${provider} avvisade begäran om ${action}: ${detail}`
      : `${provider} avvisade begäran om ${action}.`,
  providerWebSearchNotRun: ({ provider }) =>
    `${provider} returnerade ett svar utan att köra webbsökning.`,
  providerValidationSuccess: ({ provider }) =>
    `${provider} är redo att användas.`,
  providerCapabilityValidationSuccess: ({ provider, capability }) =>
    `${provider} ${capability} fungerar.`,
  providerValidationFailed: "Providervalideringen misslyckades.",
  webSearchFallback:
    "Webbsökning var inte tillgänglig, så svaret fortsatte utan live webbkontext.",
  noBase64EncoderAvailable: "Ingen base64-kodare tillgänglig.",
  noBase64DecoderAvailable: "Ingen base64-avkodare tillgänglig.",
  azureSpeechApiKeyFormat:
    "Microsoft Azure TTS behöver Azure Speech-referenser i formatet <key>|<region>, till exempel abc123|westeurope, eller det kombinerade Azure-formatet <endpoint>|<api-key>|<key>|<region>.",
  nativeTtsDoesNotSynthesizeAudioFiles:
    "Native TTS syntetiserar inte ljudfiler.",
  localTtsUnavailableForLanguage: ({ languageLabel }) =>
    `Ingen lokal eller molnröstrutt är redo för ${languageLabel}.`,
  chooseTextToSpeechProviderInSettings:
    "Välj en text-till-tal-leverantör i Inställningar.",
  ttsNotSupportedYet: ({ provider }) => `${provider} TTS stöds inte ännu.`,
  ttsError: ({ provider, status, errorText }) =>
    `${provider} TTS-fel (${status}): ${errorText}`,
  ttsReplyTooLong: ({ provider }) =>
    `${provider} talutgång avvisade svaret eftersom det var för långt.`,
  ttsTimeout: ({ provider }) => `${provider} talutmatning tog för lång tid.`,
  sttTimeout: ({ provider }) =>
    `${provider} taltranskription tog för lång tid.`,
  sttFileSizeLimitExceeded: ({ provider, model, limit }) =>
    `${provider} ${model} accepterar endast inspelningar upp till ${limit}. Använd en kortare klämma eller byt STT-modell.`,
  voiceInputCaptureIncomplete:
    "Röstindata kunde inte fångas rent. Försök igen.",
  ttsDidNotReturnAudio: ({ provider }) =>
    `${provider} TTS returnerade inte ljud.`,
  nativeSttHandledInApp: "System STT hanteras direkt i appen.",
  chooseSpeechToTextProviderInSettings:
    "Välj en tal-till-text-leverantör i Inställningar.",
  sttNotSupportedYet: ({ provider }) => `${provider} STT stöds inte ännu.`,
  providerNotWiredUpYet: ({ provider }) => `${provider} är inte ansluten än.`,
  you: "Du",
  assistant: "Assistent",
  untitledConversation: "Namnlös konversation",
  conversationExportHeader: ({ title }) => `Konversation: ${title}`,
  speechRecognitionPermissionNotGranted:
    "Taligenkänningstillstånd har inte beviljats.",
  speechRecognitionUnavailableForDeviceLanguage:
    "Taligenkänning är inte tillgängligt för det aktuella enhetsspråket.",
  nativeSpeechRecognitionNeedsNetwork:
    "Inbyggt taligenkänning behöver nätverksåtkomst just nu.",
  noSpeechDetected: "Inget tal upptäcktes.",
  nativeSpeechRecognitionFailed: "Inbyggt taligenkänning misslyckades.",
  couldntStartNativeSpeechRecognition:
    "Det gick inte att starta inbyggd taligenkänning.",
  microphonePermissionNotGranted: "Mikrofontillstånd har inte beviljats",
} satisfies TranslationDictionary;
