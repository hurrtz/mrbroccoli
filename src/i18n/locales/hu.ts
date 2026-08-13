import type { TranslationDictionary } from "../types";
import { dataBackupTranslations } from "../dataBackupTranslations";
import { conversationKnowledgeTranslations } from "../conversationKnowledgeTranslations";
import { conversationIntegrityTranslations } from "../conversationIntegrityTranslations";
import { conversationArtifactTranslations } from "../conversationArtifactTranslations";
import { interruptionTranslations } from "../interruptionTranslations";
import { ulraAuditTranslations } from "../ulraAuditTranslations";
import { imagePromptTranslations } from "../imagePromptTranslations";
import { memoryEditTranslations } from "../memoryEditTranslations";
import { onDeviceTranslations } from "../onDeviceTranslations";
import { onboardingTranslations } from "../onboardingTranslations";
import { introTranslations } from "../introTranslations";
import { premiumTranslations } from "../premiumTranslations";
import { transcriptEditTranslations } from "../transcriptEditTranslations";
import { autoSetupTranslations } from "../autoSetupTranslations";
import { workspaceTranslations } from "../workspaceTranslations";

export const hu = {
  ...conversationArtifactTranslations.hu,
  ...interruptionTranslations.hu,
  ...ulraAuditTranslations.hu,
  ...dataBackupTranslations.hu,
  ...conversationKnowledgeTranslations.hu,
  ...conversationIntegrityTranslations.hu,
  ...imagePromptTranslations.hu,
  ...memoryEditTranslations.hu,
  ...onDeviceTranslations.hu,
  ...onboardingTranslations.hu,
  ...introTranslations.hu,
  ...premiumTranslations.hu,
  ...transcriptEditTranslations.hu,
  ...workspaceTranslations.hu,
  ...autoSetupTranslations.hu,
  appName: "Brokkoli úr",
  retry: "Próbálja újra",
  dismiss: "Bezárás",
  done: "Kész",
  aboutSetting: ({ setting }) => `A(z) ${setting} beállításról`,
  unavailable: "Nem elérhető",
  selection: "Kiválasztás",
  chooseCompatibleProviderFirst: "Először válasszon kompatibilis szolgáltatót",
  settings: "Beállítások",
  settingsReleaseVersion: ({ version }) => `Verzió ${version}`,
  all: "Összes",
  firstRun: "Első indítás",
  instructions: "Utasítások",
  providers: "Szolgáltatók",
  webSearch: "Webes keresés",
  stt: "STT",
  tts: "TTS",
  ui: "UI",
  settingsRuntimeReadiness: "Futásidejű készenlét",
  settingsReadinessThink: "Gondolkodás",
  settingsReadinessListen: "Hallgatás",
  settingsReadinessSpeak: "Beszéd",
  settingsReadinessSearch: "Keresés",
  settingsReadinessReady: "Kész",
  settingsReadinessNeedsAttention: "Figyelem",
  settingsReadinessBroken: "Hibás",
  settingsReadinessOff: "Kikapcsolva",
  settingsConnections: "Kapcsolatok",
  settingsThinking: "Gondolkodás",
  settingsListening: "Hallgatás",
  settingsSpeaking: "Beszéd",
  settingsSearch: "Keresés",
  settingsAppDiagnostics: "Alkalmazás és diagnosztika",
  settingsGuidedSetup: "Irányított beállítás",
  settingsGuidedSetupSummary:
    "Tekintse át a kapcsolatokat, és tesztelje a teljes hangútvonalat.",
  setupGuideShowInSettings:
    "Az irányított beállítás megjelenítése a Beállításokban",
  setupGuideShowInSettingsSummary:
    "Az irányított beállítási parancsikon megjelenítése vagy elrejtése a Beállítások áttekintésében.",
  settingsConnectionsSummary:
    "Szolgáltatói kulcsok, érvényesítés és képességek.",
  settingsThinkingSummary:
    "Kezdőképernyő-kártyák, modellek, gondolkodási szint és rendszerprompt.",
  settingsListeningSummary: "Beviteli mód és beszéd-szöveg irányítás.",
  settingsSpeakingSummary: "Szóbeli válaszok, lejátszás, hangok és előnézetek.",
  settingsSearchSummary:
    "Webes keresőszolgáltató és keresési minőség-ellenőrzés.",
  settingsAppDiagnosticsSummary:
    "Téma, nyelv, használat, hibakeresési naplók és legutóbbi tevékenység.",
  settingsBackToOverview: "Vissza az áttekintéshez",
  settingsOpenSection: ({ section }) => `${section} megnyitása`,
  theme: "Téma",
  language: "Nyelv",
  recognitionLanguage: "Felismerési nyelv",
  recognitionLanguageHint:
    "Válasszon nyelvet a felismerés javításához, vagy hagyja automatikusan az eszköz vagy szolgáltató észleléséhez.",
  automaticLanguage: "Automatikus",
  speechLanguageUnsupportedByProvider: ({ provider, language }) =>
    `${provider} hivatalosan nem támogatja a(z) ${language} nyelvet ezen a beszédútvonalon.`,
  usageStats: "Használati statisztikák",
  model: "Modell",
  effort: "Gondolkodási szint",
  effortValue: ({ effort }) => `Gondolkodási szint: ${effort}`,
  modelEffortNone: "Nincs",
  modelEffortMinimal: "Minimális",
  modelEffortLow: "Alacsony",
  modelEffortMedium: "Közepes",
  modelEffortHigh: "Magas",
  modelEffortExtraHigh: "Extra magas",
  modelEffortMax: "Max",
  modelEffortDynamic: "Dinamikus",
  modelEffortDisabled: "Letiltva",
  modelEffortEnabled: "Engedélyezve",
  fixed: "Rögzített",
  english: "angol",
  german: "német",
  ukrainian: "ukrán",
  hindi: "Hindi",
  spanish: "spanyol",
  french: "francia",
  italian: "olasz",
  portuguese: "portugál",
  portugueseBrazil: "portugál (Brazília)",
  russian: "orosz",
  simplifiedChinese: "Egyszerűsített kínai",
  arabic: "arab",
  japanese: "japán",
  hungarian: "magyar",
  czech: "cseh",
  polish: "lengyel",
  turkish: "török",
  swedish: "svéd",
  urdu: "urdu",
  kokoroAmericanFemaleVoice: ({ name }) => `${name} · amerikai angol, női hang`,
  kokoroBritishFemaleVoice: ({ name }) => `${name} · brit angol, női hang`,
  kokoroChineseFemaleVoice: ({ index }) => `Kínai női hang ${index}`,
  kokoroChineseMaleVoice: ({ index }) => `Kínai férfihang ${index}`,
  light: "Világos",
  dark: "Sötét",
  system: "Rendszer",
  languageCoverage: ({ note }) => `Nyelv lefedettsége: ${note}`,
  recordingLimits: ({ note }) => `Felvételi korlátok: ${note}`,
  catalogProviderPricingSummary: ({ summary }) => `Árképzés: ${summary}`,
  replyGenerationAction: "válasz generálása",
  speechTranscriptionAction: "beszéd átírása",
  speechSynthesisAction: "beszédszintézis",
  instructionsTabDescription:
    "Alakítsa ki a rejtett útmutatást, amely az asszisztenst irányítja, mielőtt bármely szolgáltató látná a kérést.",
  providersTabDescription:
    "Tárolja a külső szolgáltatás hitelesítő adatait az eszközön, és konfigurálja a használni kívánt válaszmódokat.",
  webSearchTabDescription:
    "Konfigurálja az opcionális élő webes környezetet a válaszok előtt.",
  responseModes: "Modell kiválasztása",
  aboutModelSelection: "A modellválasztásról",
  modelSelectionInfo:
    "Minden modellkártya választható lesz a kezdőképernyőn. Konfigurálja a szolgáltatót, a modellt és az opcionális gondolkodási szintet, majd kártyaváltással döntse el, melyik modell válaszoljon legközelebb.",
  responseModeItemTitle: ({ index }) => `${index}. modell`,
  addResponseMode: "Modell hozzáadása",
  removeResponseMode: "Modell eltávolítása",
  responseModesNoConfiguredProviders:
    "Először adja meg a hitelesítő adatokat. Az útvonalvezérlők mindaddig rejtve maradnak, amíg legalább egy kompatibilis szolgáltatást be nem állítanak.",
  useResponseMode: ({ mode }) => `${mode} használata`,
  chooseResponseModel: "Modell kiválasztása",
  responseModelCount: ({ count }) => `${count} modell érhető el`,
  ulraMode: "Szuper mód",
  ulraModeHomeLabel: "Szuper mód megjelenítése a kezdőképernyőn",
  ulraModeSettingsDescription:
    "Több modell közös mérlegelését engedélyezi, ha legalább két kezdőképernyős modell készen áll.",
  ulraModeInfo:
    "A Szuper mód először külön-külön megkérdezi a kezdőképernyő minden elérhető modelljét. Minden körben a modellek kritikusan vizsgálják az egyes résztvevők legutóbbi álláspontját; a fennmaradó körök egyértelmű egyhangú konvergencia után kimaradnak. A kiválasztott modell a sikeres körökből készíti el a végső választ úgy, hogy minden modell legutóbbi álláspontja mindig megmarad. A mérlegelés minden érintett szolgáltatóval megosztásra kerül.",
  ulraModeRounds: "Felülvizsgálati körök",
  ulraModeCallEstimate: ({ count }) =>
    `A jelenlegi beállítással üzenetenként legfeljebb ${count} modellhívás.`,
  ulraModeThresholdWarning:
    "4-nél több modell vagy 3-nál több kör sokáig tarthat, sok tokent használhat, és elérheti a szolgáltatók kontextus- vagy sebességkorlátait. Ez csak figyelmeztetés.",
  ulraModeFirstUseTitle: "Bekapcsolja a Szuper módot?",
  ulraModeFirstUseMessage: ({ calls, models, rounds }) =>
    `${models} modell és legfeljebb ${rounds} felülvizsgálati kör esetén egy üzenet legfeljebb ${calls} modellhívást indíthat. Ez jóval tovább tarthat, jelentősen többe kerülhet, és megosztja a mérlegelést minden érintett szolgáltatóval.`,
  ulraModeHighRiskTitle: "Nagyszabású Szuper mód-futtatás",
  ulraModeHighRiskMessage: ({ calls, models, rounds }) =>
    `${models} modell és ${rounds} felülvizsgálati kör legfeljebb ${calls} modellhívást indíthat. Ez nagyon sokáig tarthat, sok tokent használhat, és elérheti a szolgáltatói korlátokat. Mégis folytatja?`,
  ulraModeEnableAction: "Bekapcsolás",
  ulraModeNeedsTwoModels:
    "A Szuper módhoz legalább két használatra kész kezdőképernyős modell szükséges.",
  ulraModeAllModelsFailed:
    "A Szuper mód összes modellhívása sikertelen volt, mielőtt elkészülhetett volna az összegzett válasz.",
  ulraModePartialFailureNotice: ({ failed, succeeded }) =>
    `${failed} belső modellhívás meghiúsult; a végső válasz ${succeeded} sikeres hozzájárulást használt fel.`,
  sttTabDescription:
    "Szabályozhatja, hogyan rögzítse a beszédet, és melyik háttérprogram alakítja át a hangot szöveggé, mielőtt az elérné a modellt.",
  ttsTabDescription:
    "Szabályozhatja, hogy a válaszok mikor kezdjenek el beszélni, és hogy melyik háttérrendszer kezelje a hangkimenetet.",
  brief: "Rövid",
  briefDescription:
    "Tartsa szorosan a választ. Használjon minimális számú mondatot ahhoz, hogy teljes körű választ adjon a felhasználónak.",
  normal: "Normál",
  normalDescription:
    "Törekedjen kiegyensúlyozott válaszhosszra. Térjen ki a fontos pontokra, de ne nyújtsa el a választ.",
  thorough: "Alapos",
  thoroughDescription:
    "Menjen mélyre, és legyen átfogó. Tartalmazzon árnyalatokat, részleteket, kompromisszumokat és az érvelést, ami számít.",
  professional: "Professzionális",
  professionalDescription:
    "Beszéljen úgy, mint egy vezető tanácsadó, aki tájékoztatja az ügyfelet. Precíz nyelvezet, nincs szleng, kimért és mérvadó.",
  casual: "Közvetlen",
  casualDescription:
    "Beszéljen úgy, mint egy okos barát egy kávézóban: lazán, természetesen és közvetlenül. A rövidítések és a kisebb kitérők is beleférnek.",
  nerdy: "Kocka",
  nerdyDescription:
    "Úgy beszéljen, mint egy lelkes szakértő, aki szeret elmélyülni a témában. Használja szabadon a szakmai terminológiát, merüljön el lelkesen a részletekben, és feltételezze, hogy a felhasználó lépést tud tartani.",
  concise: "Tömör",
  conciseDescription:
    "Legyen a lehető legrövidebb, de attól még teljes. Se felvezetés, se töltelékszöveg, csak a válasz. Mintha táviratot írna.",
  socratic: "Szókratikus",
  socraticDescription:
    "Kérdőjelezze meg a felhasználó gondolkodását. Tegyen fel ellenkérdéseket, kínáljon alternatív nézőpontokat, ne csak erősítse meg, amit mondtak. Legyen vitapartner, ne bólogató gép.",
  eli5: "ELI5",
  eli5Description:
    "Magyarázzon el mindent a lehető legegyszerűbben. Használjon analógiákat és hétköznapi nyelvet, szakzsargon nélkül. Feltételezze, hogy a felhasználónak egyetlen témában sincs előzetes tudása.",
  useProvider: ({ provider }) => `${provider} használata`,
  createApiKey: "Hitelesítő adatok",
  apiKey: "API-kulcs",
  aboutThisProvider: "Erről a szolgáltatóról",
  openRouterOnboardingTitle: "Egy kulcs, több szolgáltató",
  openRouterOnboardingDescription:
    "Hozzon létre egy dedikált OpenRouter-kulcsot, illessze be alább, és használja több szolgáltató pillanatkép-alapú modelljeit anélkül, hogy bármelyik közvetlen kapcsolatát lecserélné.",
  openRouterOnboardingRoute:
    "Kérés elérési útja: ez az eszköz → OpenRouter → kiválasztott upstream szolgáltató",
  openRouterKeys: "OpenRouter kulcsok",
  providerStatusInvalid: "Érvénytelen",
  providerStatusTesting: "Tesztelés",
  providerStatusConfigured: "Beállítva",
  providerStatusWorking: "Működik",
  providerStatusNotTested: "Nincs tesztelve",
  providerStatusNotSetup: "Nincs beállítva",
  expandProvider: ({ provider }) => `${provider} kibontása`,
  collapseProvider: ({ provider }) => `${provider} összecsukása`,
  testProviderKey: "Kulcs tesztelése",
  testAllCapabilities: "Minden tesztelése",
  apiTest: "API-teszt",
  testProviderCapability: ({ capability }) => `${capability} tesztelése`,
  test: "Teszt",
  optional: "Opcionális",
  providerCapability_llm: "Válaszok",
  providerCapability_stt: "Beszédbevitel",
  providerCapability_tts: "Hangkimenet",
  providerCapability_search: "Webes keresés",
  providerCapability_voices: "Hangkönyvtár",
  providerValidationUnavailable:
    "Az élő érvényesítés még nincs bekötve ennél a szolgáltatónál. Mentse el a kulcsot itt, és ellenőrizze a tényleges használat során.",
  providerNeedsAttention: "figyelmet igényel",
  catalogProviderLimitsSummary: ({ summary }) => `Korlátok: ${summary}`,
  catalogProviderRegionSummary: ({ summary }) => `Régió: ${summary}`,
  validatingKey: "Érvényesítés...",
  showKey: "Kulcs megjelenítése",
  hideKey: "Kulcs elrejtése",
  assistantInstructions: "Asszisztensi utasítások",
  systemPrompt: "Rendszerprompt",
  aboutSystemPrompt: "A rendszerpromptról",
  assistantInstructionsIntro:
    "Alakítsa ki a rejtett útmutatást, amelyet a modell minden válasz előtt kap.",
  baseInstructions: "Alaputasítások",
  assistantInstructionsPlaceholder:
    "Határozza meg, hogyan viselkedjen az asszisztens.",
  assistantInstructionsHint:
    "Ez mindig a kiválasztott válaszhossz és hangszín elé kerül.",
  adaptiveLength: "Adaptív hossz",
  responseTone: "Válasz hangneme",
  homeStyleChipLabel: ({ tone, length }) => `Stílus — ${tone} · ${length}`,
  styleSheetTitle: "Beszélgetési beállítások",
  styleSheetSubtitle:
    "Csak ehhez a beszélgetéshez alakítsa ki a válaszokat és a beszédet.",
  openStyleSheet: "Nyissa meg a beszélgetési beállításokat",
  conversationThinkingInstructions: "Gondolkodási utasítások",
  conversationThinkingInstructionsDescription:
    "Adjon hozzá utasításokat ehhez a beszélgetéshez a globális rendszerparancs után.",
  conversationThinkingInstructionsPlaceholder:
    "Például: Kérdezze meg a feltevéseimet, és használjon konkrét példákat.",
  ttsInstructions: "Beszédstílusra vonatkozó utasítások",
  ttsInstructionsDescription:
    "A kompatibilis beszédmodellek által használt hangszín, tempó, akcentus vagy kifejezés irányítása.",
  conversationTtsInstructionsDescription:
    "Adja hozzá a kézbesítési utasításokat a beszélgetés globális beszédutasításai után.",
  ttsInstructionsPlaceholder:
    "Például: beszéljen melegen, világosan és nyugodt tempóban.",
  ttsInstructionsUnsupported:
    "A jelenlegi beszédútvonal nem támogatja a beszédstílusra vonatkozó utasításokat.",
  conversationVoiceDescription: ({ route }) =>
    `Válassza ki a ${route} által ebben a beszélgetésben használt hangot.`,
  scrollToLatest: "Görgessen a legutóbbi üzenethez",
  conversationTitleGenerate: "Cím automatikus generálása",
  conversationTitleGenerating: "Cím generálása…",
  conversationTitleGenerated: "A beszélgetés átnevezve.",
  conversationTitleNeedsContent:
    "Indítson beszélgetést a cím generálása előtt.",
  conversationTitleNeedsProvider:
    "A cím generálása előtt konfigurálja a kiválasztott modellt.",
  conversationTitleGenerationFailed:
    "Nem sikerült létrehozni a beszélgetés címét.",
  conversationTitleGenerationTimedOut:
    "A cím generálása túl sokáig tartott. Kérjük, próbálja újra.",
  inputMode: "Beviteli mód",
  voiceInput: "Hangbevitel",
  pushToTalk: "Nyomva tartásos beszéd",
  pushToTalkDescription:
    "Beszéd közben tartsa lenyomva a fő gombot, majd engedje el a küldéshez.",
  toggleToTalk: "Koppintásos beszéd",
  toggleToTalkDescription:
    "Koppintson egyszer a felvétel elindításához, majd koppintson újra, ha végzett.",
  driveSession: "Vezetési mód",
  driveSessionDescription:
    "Ha az automatikus folytatás be van kapcsolva, a felvétel minden szóbeli válasz után elindul. Koppintson a fő gombra, ha befejezte a beszédet.",
  stopDriveSession: "Automatikus folytatás leállítása",
  repeatDriveReply: "Utolsó válasz ismétlése",
  continueDriveSession: "Automatikus folytatás újraindítása",
  driveSendsIn: ({ seconds }) => `Küldés ${seconds} múlva…`,
  speechToText: "Beszéd szöveggé",
  appNative: "Rendszerfelismerés",
  nativeSttDescription:
    "Használja az operációs rendszer beszédfelismerőjét.",
  provider: "Szolgáltató",
  webSearchProvider: "Webes keresőszolgáltató",
  webSearchProviderMissingHint:
    "Konfiguráljon legalább egy keresésre alkalmas szolgáltatást a hitelesítő adatoknál, hogy itt bekapcsolhassa az élő webes kontextust.",
  webSearchModelHint: ({ model }) =>
    `A háttérben a(z) ${model} modellt használja az élő webes kontextushoz.`,
  webSearchHomeHint:
    "A kezdőképernyő kapcsolójával kapcsolhatja be vagy ki az élő webes kontextust ennél a szálnál.",
  settingsWebSearchCompactHint:
    "Opcionálisan illesszen be friss webkörnyezetet, mielőtt a fő modell válaszolna.",
  webSearchAdvanced: "Speciális keresési vezérlők",
  expandAdvancedSearch: "Bővítse ki a speciális keresési vezérlőket",
  collapseAdvancedSearch: "A speciális keresési vezérlők összecsukása",
  webSearchSetupNeeded:
    "Adjon hozzá hitelesítő adatokat az élő webes keresés használatához.",
  webSearchEnabledDescription:
    "Friss webes környezet kerül hozzáadásra, mielőtt a modell válaszolna.",
  webSearchDisabledDescription:
    "Használjon élő webes környezetet ehhez a szálhoz, ha az aktuális tények számítanak.",
  webSearchNobodyDescription:
    "Nincs webes kérés. Abból válaszol, amit a modell tud.",
  webSearchQualityControls: "Keresési minőség",
  webSearchSearchMode: "Keresési mód",
  webSearchSearchModeQuick: "Gyors",
  webSearchSearchModeBalanced: "Kiegyensúlyozott",
  webSearchSearchModeDeep: "Mély",
  webSearchDepth: "Keresési mélység",
  webSearchDepthStandard: "Normál",
  webSearchDepthDeep: "Mély",
  webSearchResultCount: "Eredmények száma",
  webSearchQualityHint: ({ provider }) =>
    `Ezek a vezérlők beállítják, hogy a(z) ${provider} hogyan gyűjt össze friss kontextust a válasz előtt.`,
  webSearchNoExtraControls: ({ provider }) =>
    `${provider} még nem tesz elérhetővé extra keresési minőség-szabályozást ebben az alkalmazásban.`,
  setWebSearchMode: ({ mode }) => `Webes keresési mód beállítása: ${mode}`,
  openWebSearchSettings: "Nyissa meg a webes keresési beállításokat",
  providerSttDescription:
    "Használjon konfigurált külső szolgáltatást hangjának átírására, mielőtt elküldené a válaszútvonalra.",
  sttProvider: "STT-szolgáltató",
  sttProviderEnabledHint:
    "Csak az átírást támogató engedélyezett szolgáltatók jelennek meg itt.",
  sttProviderMissingHint:
    "Adjon hozzá hitelesítő adatokat egy STT-támogatással rendelkező szolgáltatáshoz, hogy itt válassza ki azt.",
  nativeSttHint:
    "A rendszerfelismerés a szolgáltatói kulcsoktól függetlenül működik, és feldolgozható az eszközön vagy az operációs rendszer beszédszolgáltatása által.",
  replyPlayback: "Válasz lejátszása",
  sentencesArrive: "Bekezdésenként",
  sentencesArriveDescription:
    "A felolvasás akkor indul, amint elkészül egy teljes bekezdés.",
  fullReplyFirst: "Előbb a teljes válasz",
  fullReplyFirstDescription:
    "Először generálja a teljes választ, majd játssza le egy lépésben.",
  textToSpeech: "Szöveg beszéddé",
  spokenReplies: "Szóbeli válaszok",
  spokenRepliesEnabledDescription:
    "Az asszisztens válaszainak felolvasása, ha elérhető egy hangútvonal.",
  spokenRepliesDisabledDescription:
    "A válaszok egyelőre csak szövegesek maradjanak. Az előnyben részesített TTS-útvonal későbbre mentve marad.",
  nativeTtsDescription:
    "Használja az eszköz beszédmotorját a szóbeli válaszokhoz és a hangelőnézethez.",
  kokoroTtsDescription:
    "Használjon sokkal természetesebb neurális hangot, teljes egészében ezen az eszközön. A szóbeli válasz szövege helyben szintetizálódik, beszédszolgáltatói kulcs és használati díj nélkül.",
  kokoroVoices: "Kokoro hangok az eszközön",
  kokoroVoicesHint: ({ size, installedSize }) =>
    `A többnyelvű modell körülbelül ${size} MB-ot tölt le, és körülbelül ${installedSize} MB-ot foglal a telepítés után.`,
  kokoroModel: "Kokoro többnyelvű modell",
  kokoroChecking: "Az eszközön lévő modell ellenőrzése…",
  kokoroDownloading: ({ progress }) => `Letöltés… ${progress}%`,
  kokoroExtracting: ({ progress }) => `Telepítés… ${progress}%`,
  kokoroVerifying: "A hangmotor ellenőrzése…",
  kokoroInstalled: "Telepítve és készen áll erre az eszközre.",
  kokoroNotInstalled:
    "A Kokoro kiválasztása vagy használata előtt töltse le és ellenőrizze a modellt. Nincs szükség szolgáltatói kulcsra.",
  kokoroLanguageFallback:
    "Kokoro jelenleg angolul és egyszerűsített kínaiul beszél itt. Más kiválasztott válasznyelvek esetén adjon hozzá explicit tartalék útvonalat, különben a beszéd hibával leáll.",
  kokoroRemoveTitle: "Eltávolítja a Kokoro-modellt?",
  kokoroRemoveBody: ({ installedSize }) =>
    `Ez körülbelül ${installedSize} MB-ot szabadít fel. A modellt bármikor újra letöltheti.`,
  removeKokoroModel: "Távolítsa el a Kokoro modellt",
  downloadKokoroModel: "Töltse le a Kokoro modellt",
  kokoroFallbackNeeded: ({ languages }) =>
    `Kifejezett tartalék útvonal szükséges a következőkhöz: ${languages}.`,
  kokoroNoSelectedLanguages:
    "Kokoro-hang beállításához válassza az angol vagy az egyszerűsített kínai nyelvet a Felolvasási nyelvek alatt.",
  expandVoiceSettings: ({ language }) =>
    `Bontsa ki a ${language} hangbeállításokat`,
  collapseVoiceSettings: ({ language }) =>
    `A ${language} hangbeállítások összecsukása`,
  remove: "Eltávolítás",
  voiceOutputDescription:
    "Válassza ki a beszédmotort, a felolvasási nyelveket és a hangelőnézeteket a szóbeli válaszokhoz.",
  localTts: "Helyi",
  localTtsDescription:
    "Használjon megfelelő letöltött helyi hangot a szóbeli válaszokhoz.",
  providerTtsDescription:
    "A kiválasztott konfigurált szolgáltatást használja a szóbeli válaszokhoz.",
  ttsFallbackRoutes: "Tartalék útvonalak",
  ttsFallbackRoutesHint:
    "Opcionális. Csak a kívánt útvonalakat adja hozzá, a kipróbálás sorrendjében. Amint egy útvonal beszélni kezd, Mr Broccoli azt használja a válasz hátralévő részében.",
  ttsFallbackNone:
    "Nincs tartalék konfigurálva. Helyette hanghiba jelenik meg.",
  ttsFallbackPosition: ({ position, route }) => `${position}. ${route}`,
  addFallbackRoute: ({ route }) => `${route} tartalék hozzáadása`,
  removeFallbackRoute: ({ route }) => `A ${route} tartalék eltávolítása`,
  moveFallbackEarlier: ({ route }) => `A(z) ${route} mozgatása előrébb`,
  moveFallbackLater: ({ route }) => `A(z) ${route} mozgatása hátrébb`,
  ttsProvider: "TTS-szolgáltató",
  ttsProviderEnabledHint:
    "Csak a szóbeli választ támogató engedélyezett szolgáltatók jelennek meg itt.",
  ttsProviderMissingHint:
    "Adjon hozzá hitelesítő adatokat egy TTS-támogatással rendelkező szolgáltatáshoz, hogy itt válassza ki azt.",
  localTtsOrderHint:
    "Csak kifejezetten konfigurált tartalék útvonalakat kísérel meg a rendszer.",
  providerTtsOrderHint:
    "Csak kifejezetten konfigurált tartalék útvonalakat kísérel meg a rendszer.",
  nativeTtsHint:
    "A natív TTS a rendszer hangveremét használja, és nem igényel szolgáltatói kulcsot.",
  localTtsLanguageCoverageHint:
    "A helyi csomagok jelenleg az angol, német, egyszerűsített kínai, spanyol, portugál, hindi, francia és olasz nyelvet fedik le.",
  ttsVoice: "TTS-hang",
  refresh: "Frissítés",
  providerVoiceDirectory: ({ provider }) => `${provider} hangkönyvtár`,
  refreshProviderVoices: ({ provider }) =>
    `A(z) ${provider} hangjainak frissítése`,
  providerVoicesAvailable: ({ count, provider }) =>
    `${count} hang érhető el a(z) ${provider} szolgáltatótól.`,
  providerVoicesLoadFailed:
    "A hangokat nem sikerült frissíteni. Jelenlegi választása változatlan; továbbra is beírhat egy hangazonosítót manuálisan.",
  providerVoicesLoadFailedWithFallback:
    "A fiók hangjait nem sikerült betölteni. A beépített hang továbbra is elérhető.",
  providerVoicesErrorDetail: ({ detail }) => `Ok: ${detail}`,
  elevenLabsVoicesReadPermissionHint:
    "Az ElevenLabsban szerkessze ezt az API-kulcsot, engedélyezze a Voices → Read jogosultságot, majd frissítse itt.",
  providerVoicesLoadingHint: ({ provider }) =>
    `Mr Broccoli automatikusan betölti az elérhető hangokat a(z) ${provider} szolgáltatótól.`,
  providerVoiceId: "Hangazonosító",
  providerVoiceIdPlaceholder: "Adjon meg egy hangazonosítót",
  providerVoiceIdFallbackHint:
    "A kézi bejegyzés elérhető marad, ha a hangkönyvtár nem tölthető be.",
  providerVoiceIdRequired: ({ provider }) =>
    `Frissítse a(z) ${provider} hangkönyvtárát, vagy adjon meg egy hangazonosítót a beszédkimenet használata előtt.`,
  qwenSpeechUnavailableInUs:
    "Mr Broccoli jelenlegi Qwen beszédútvonalai nem érhetők el az Egyesült Államok régiójában. Válassza Szingapúrt vagy Pekinget a Qwen beszédhez.",
  qwenApiRegion: "Qwen API régió",
  qwenRegionSingapore: "Szingapúr",
  qwenRegionUs: "USA (Virginia)",
  qwenRegionBeijing: "Kína (Peking)",
  qwenRegionHint:
    "A kiválasztott régiónak meg kell egyeznie azzal a régióval, amelyben ez az API-kulcs létrejött.",
  qwenRegionUsSpeechHint:
    "Az amerikai régiókulcsok itt támogatják a csevegést és a webes keresést. Mr Broccoli jelenlegi Qwen STT- és TTS-útvonalaihoz szingapúri vagy pekingi kulcs szükséges.",
  providerDefaultVoiceHint:
    "Ez a szolgáltató jelenleg az alapértelmezett hangját használja az előnézethez és a szóbeli válaszokhoz.",
  listenLanguages: "Felolvasási nyelvek",
  listenLanguagesHint:
    "Válassza ki azokat a válasznyelveket, amelyeken jó minőségű felolvasást szeretne. Mr Broccoli ebben a sorrendben próbálja ki őket a hangkimenet irányításakor.",
  listenLanguagesSelected: ({ count }) =>
    count === 1 ? "1 nyelv kiválasztva" : `${count} nyelv kiválasztva`,
  localVoicePacks: "Helyi hangcsomagok",
  localVoicePacksHint:
    "Minden nyelv megtartja saját helyi hangját. Válassza ki az adott nyelvhez kívánt hangot, majd csak azokat a csomagokat töltse le, amelyek valóban fontosak.",
  localVoiceForLanguage: ({ languageLabel }) =>
    `Hang a(z) ${languageLabel} nyelvhez`,
  providerVoicePreviews: "Szolgáltatói hangelőnézetek",
  providerVoicePreviewsHint:
    "Tesztelje le az aktuálisan kiválasztott TTS-útvonalat itt, külön előnézeti szöveggel minden válasznyelvhez.",
  nativeVoicePreviewSection: "Natív hang előnézete",
  nativeVoicePreviewSectionHint:
    "Ez közvetlenül a telefon beépített beszédszintetizátorán keresztül beszél, így összehasonlíthatja a konfigurált szolgáltatói hangokkal.",
  nativeVoiceUnavailable:
    "Ez az eszköz nem jelentett egyetlen natív rendszerhangot sem az előnézethez.",
  runtimeCompatibilityOverrides: "Futásidejű kompatibilitás",
  runtimeCompatibilityOverridesDescription: ({ count }) =>
    `${count} szolgáltató által igazoltan nem elérhető modell- vagy beállításkonfiguráció csak ezen az eszközön van letiltva. Mr Broccoli automatikusan elkerüli ezeket.`,
  clearRuntimeCompatibilityOverrides: "Futásidejű kompatibilitás törlése",
  clearRuntimeCompatibilityOverridesConfirmationTitle:
    "Törli a futásidejű kompatibilitást?",
  clearRuntimeCompatibilityOverridesConfirmationMessage:
    "A korábban letiltott konfigurációk újra kipróbálhatók lesznek. A szolgáltató ismét elutasíthatja őket.",
  speechDiagnostics: "Legutóbbi beszédtevékenység",
  speechDiagnosticsHint:
    "Megjeleníti a legfrissebb beszédkéréseket, a kért útvonalat, a ténylegesen használt útvonalat és az esetleges tartalék okokat.",
  clearSpeechDiagnostics: "A legutóbbi beszédtevékenység törlése",
  speechDiagnosticsEmpty:
    "Még nincs újabb beszédkérelem. Tekintse meg a hang előnézetét vagy játsszon le egy választ, hogy itt megtekinthesse az útvonal részleteit.",
  clearSpeechDiagnosticsConfirmationTitle:
    "Törli a legutóbbi beszédtevékenységet?",
  clearSpeechDiagnosticsConfirmationMessage:
    "Ez eltávolítja az összes rögzített beszéd-útválasztási diagnosztikát. Ez a művelet nem vonható vissza.",
  speechDiagnosticSourceConversation: "Beszélgetési válasz",
  speechDiagnosticSourceRepeat: "Válasz megismétlése",
  speechDiagnosticSourcePreview: "Hangelőnézet",
  speechDiagnosticSourceUnknown: "Beszédkérés",
  speechDiagnosticRouteLine: ({ requested, actual }) =>
    `Kért: ${requested} -> Tényleges: ${actual}`,
  speechDiagnosticStageLine: ({ stage }) => `Utolsó szakasz: ${stage}`,
  speechDiagnosticLanguageLine: ({ languageLabel }) =>
    `Nyelv: ${languageLabel}`,
  speechDiagnosticProviderLine: ({ provider }) => `Szolgáltató: ${provider}`,
  speechDiagnosticVoiceLine: ({ voice }) => `Hang: ${voice}`,
  localTtsPackReady: "Telepítve erre az eszközre.",
  localTtsPackBroken:
    "Letöltve, de ennek a hangnak a helyi ellenőrzése nem sikerült ezen az eszközön. Töltse le újra, vagy válasszon másik hangot.",
  localTtsPackMissing:
    "Még nincs telepítve. A letöltésig a felhőalapú TTS vagy a rendszerhang lesz használatban.",
  localTtsUnsupportedLanguageFallback:
    "A helyi csomag még nem érhető el ehhez a nyelvhez. A felhőalapú TTS vagy a rendszerhang kezeli.",
  downloadingLocalTtsPack: ({ progress }) =>
    `Helyi csomag letöltése... ${progress}%`,
  download: "Letöltés",
  downloadingShort: "Betöltés...",
  voicePreviewText: "Hangelőnézeti szöveg",
  voicePreviewPlaceholder:
    "Gépeljen be egy kifejezést, hogy meghallja ezt a hangot.",
  voicePreviewHint:
    "Az aktuálisan kiválasztott válaszhang-backendet használja anélkül, hogy bármit is küldene a nyelvi modellnek.",
  previewVoice: "Hang előnézete",
  generatingPreview: "Előnézet generálása...",
  playingPreview: "Előnézet lejátszása...",
  systemVoice: "Rendszerhang",
  spokenRepliesOff: "Csak szöveg",
  noTtsProvider: "Nincs TTS-szolgáltató",
  nothingToCopyYet: "Még nincs mit másolni.",
  couldntCopyText: "A szöveget nem sikerült másolni.",
  nothingToShareYet: "Még nincs mit megosztani.",
  couldntShareText: "Nem sikerült megosztani a szöveget.",
  couldntReplayReply: "A válasz nem játszható le.",
  replyFailed: "A válaszadás sikertelen",
  retryReply: "Válasz újrapróbálása",
  replyFailedHint: "Válasszon másik modellt fent, mielőtt újra próbálkozna.",
  spokenReplyFailed: "A válasz el lett mentve, de nem lehetett kimondani.",
  retrySpeech: "Próbálja újra a beszédet",
  openSpeakingSettings: "Beszédbeállítások",
  messageCopied: "Üzenet másolva.",
  noConversationToCopyYet: "Még nincs másolandó beszélgetés.",
  noConversationToShareYet: "Még nincs megosztható beszélgetés.",
  noReplyToRepeatYet: "Még nincs válasz a visszajátszásra.",
  threadCopied: "Szál másolva.",
  threadRenamed: "A szál átnevezve.",
  threadPinned: "Szál rögzítve.",
  threadUnpinned: "Szál feloldva.",
  addProviderKeyToUseProvider: ({ provider }) =>
    `Adja hozzá a(z) ${provider} hitelesítő adatait a Beállításokban az útvonal használata előtt.`,
  configureCredentialsBeforeVoiceSession:
    "Adjon hozzá hitelesítő adatokat a Beállításokban, mielőtt hangos munkamenetet kezdene.",
  endpointCredentialFormatInvalid: ({ provider }) =>
    `A(z) ${provider} esetén adja meg a szolgáltatói alap URL-t és az API-kulcsot a következőképpen: https://your-endpoint.example.com|your-api-key.`,
  speechRecognitionUnavailableOnDevice:
    "A beszédfelismerés nem érhető el ezen az eszközön.",
  debugLogLabel: "NAPLÓ",
  debugLogCaptureStarted: "A hibakeresési naplózás elindult.",
  debugLogCaptureStopped: ({ entryCount, fileName }) =>
    `A hibakeresési napló ${fileName} néven mentve és a vágólapra másolva (${entryCount} bejegyzés).`,
  debugLogCaptureStoppedNoClipboard: ({ entryCount, fileName }) =>
    `A hibakeresési napló ${fileName} néven mentve (${entryCount} bejegyzés).`,
  debugLogCaptureRecovered: ({ entryCount, fileName }) =>
    `A korábbi ${fileName} hibakeresési napló helyreállítva és a vágólapra másolva (${entryCount} bejegyzés).`,
  debugLogCaptureRecoveredNoClipboard: ({ entryCount, fileName }) =>
    `A korábbi ${fileName} hibakeresési napló helyreállítva (${entryCount} bejegyzés).`,
  debugLogCaptureFailed: "Nem sikerült menteni a hibakeresési naplót.",
  chooseSttBeforeVoiceSession:
    "Válasszon egy konfigurált STT-útvonalat a Beállításokban a hangos munkamenet indítása előtt.",
  chooseTtsBeforeSpokenReplies:
    "Válasszon egy konfigurált TTS-útvonalat a Beállításokban a szóbeli válaszok használata előtt.",
  stopSessionBeforeReplay:
    "Az utolsó válasz lejátszása előtt állítsa le az aktív hangos munkamenetet.",
  couldntCatchThatTryAgain: "Ezt nem sikerült érteni, próbálja újra.",
  couldntStartVoiceInput: "Nem sikerült elindítani a hangbevitelt.",
  couldntProcessVoiceInput: "Nem sikerült feldolgozni a hangbevitelt.",
  maxRecordingLengthReached:
    "Elérte a maximális felvételi hosszt – elküldöm, amim van.",
  sttRecordingTooLarge: ({ provider, limit }) =>
    `A felvétel túl hosszú a(z) ${provider} beszédátírásához (max. ${limit}). Próbálkozzon rövidebb üzenettel, vagy állítsa át a Beszéd szöveggé beállítást Rendszerfelismerésre.`,
  addProviderKeyToEnableProvider: ({ provider }) =>
    `Adja hozzá a(z) ${provider} hitelesítő adatait a Beállításokban az útvonal használata előtt.`,
  stopSessionBeforePreview:
    "A hang előnézetének meghallgatása előtt állítsa le az aktív hangos munkamenetet.",
  chooseTtsToPreviewVoices:
    "Válasszon egy konfigurált TTS-útvonalat a Beállításokban a hangok előnézetének megtekintéséhez.",
  downloadSelectedLocalVoiceFirst: ({ languageLabel }) =>
    `Először töltse le a kiválasztott ${languageLabel} helyi hangot.`,
  couldntPreviewVoice: "A hang előnézete nem sikerült.",
  spokenRepliesDisabled:
    "A szóbeli válaszok ki vannak kapcsolva a Beállításokban.",
  providerVoiceFallback:
    "A konfigurált hangútvonal nem működött. Ez a válasz tartalék hangon szólal meg.",
  localVoiceFallback:
    "A helyi hang nem volt elérhető. Ez a válasz tartalék hangon szólal meg.",
  localTtsPackInstalled: ({ languageLabel }) =>
    `${languageLabel} helyi hangcsomag telepítve.`,
  localTtsPackInstallFailed: "Nem sikerült telepíteni a helyi hangcsomagot.",
  clear: "Törlés",
  voiceOutput: "Hangkimenet",
  speechReplayCache: "Beszéd-visszajátszási gyorsítótár",
  speechReplayCacheDescription:
    "A szolgáltató által létrehozott beszéd legfeljebb 14 napig ezen az eszközön marad, így egy válasz újbóli lejátszása nem használ újabb beszédkreditet.",
  clearSpeechReplayCache: "Beszéd gyorsítótárának törlése",
  speechReplayCacheCleared: "A gyorsítótárazott beszédfájlok törölve.",
  speechReplayCacheClearFailed:
    "A beszéd gyorsítótárát nem sikerült törölni.",
  currentSetup: "Jelenlegi beállítás",
  listeningToYourVoice: "Hallgatja a hangját",
  parsingYourVoiceInput: "A hangját szöveggé alakítja",
  preparingRequest: "Kérése előkészítése",
  searchingTheWeb: "Új kontextus keresése az interneten",
  waitingForProvider: ({ provider }) =>
    `Várakozás a(z) ${provider} szolgáltatóra`,
  preparingVoiceWithProvider: ({ provider }) =>
    `Hang előkészítése a(z) ${provider} segítségével`,
  deepThinkingReassurance: "A jó válaszokhoz eltart egy pillanat…",
  thinkingElapsed: ({ detail, seconds }) => `${detail} · ${seconds}s`,
  speakingBackToYou: "A válasz felolvasása",
  freshSession: "Új munkamenet",
  messageCount: ({ count }) =>
    Number(count) === 1 ? "1 üzenet" : `${count} üzenet`,
  speechInputRoute: ({ route }) => `Beszédbevitel: ${route}`,
  replyModelRoute: ({ route }) => `Válaszmodell: ${route}`,
  voiceOutputRoute: ({ route }) => `Hangkimenet: ${route}`,
  fallbackVoiceOutputRoute: ({ route }) => `Tartalék hangkimenet: ${route}`,
  conversation: "Beszélgetés",
  conversationActions: "Beszélgetési műveletek",
  statusDetails: "Állapot részletei",
  persistenceFailure:
    "Mr Broccoli nem tudott adatokat menteni ezen az eszközön. Tartsa nyitva az alkalmazást, és próbálja újra; a legutóbbi módosítások újraindítás után elveszhetnek.",
  show: "Megjelenítés",
  showTranscript: "Átirat megjelenítése",
  hide: "Elrejtés",
  copyThread: "Szál másolása",
  shareThread: "Szál megosztása",
  reportResponse: "Válasz jelentése",
  reportResponseIntro:
    "AI-válasz jelentése a Mr Broccoli alkalmazásból. Nézze át az alábbi tartalmat, írja le a problémát, és küldje el a jelentést a fejlesztőnek.",
  repeatReply: "Válasz megismétlése",
  renameThread: "Szál átnevezése",
  renameThreadHint:
    "Adjon ennek a beszélgetésnek olyan címet, amelyet később gyorsan megtalálhat.",
  threadTitle: "Szálcím",
  noTranscriptYet: "Még nincs átirat",
  previewTranscriptEmptyDescription:
    "A kezdéshez használjon hangot vagy szöveget. A beszélgetés itt fog megjelenni.",
  noConversationYet: "Még nincs beszélgetés",
  expandedTranscriptEmptyDescription:
    "A kezdéshez használjon hangot vagy szöveget. Zárja be ezt a képernyőt, ha vissza szeretne térni a fő színpadra.",
  transcriptSelectionHint:
    "Válassza ki közvetlenül az üzenet szövegét, vagy ossza meg és másolja az egyes üzeneteket alább.",
  textMessagePlaceholder: "Írjon be egy üzenetet",
  sendTextMessage: "Üzenet küldése",
  showVoiceInput: "Hangbevitel megjelenítése",
  showTextInput: "Szövegbevitel megjelenítése",
  usageStatsHiddenDescription:
    "A tokenbecslések elrejtése az átirat felületéről.",
  usageStatsVisibleDescription:
    "A válaszok és a beszélgetés összesített becsült tokenhasználatának megjelenítése.",
  debugLogButton: "Hibakeresési napló gomb",
  debugLogButtonHiddenDescription:
    "Tartsa rejtve a kezdőképernyő LOG gombját, hacsak nem fut már a rögzítés.",
  debugLogButtonVisibleDescription:
    "A kezdőképernyőn megjelenő LOG gomb megjelenítése a hibakeresési rögzítés elindításához és leállításához.",
  debugLogButtonUsageDescription:
    "A gomb használata: bekapcsolása megkezdi a naplók rögzítését. Ha kikapcsolja, leáll a naplók rögzítése, és a rögzítettek átkerülnek a vágólapra.",
  estimatedUsageTitle: "Becsült használat",
  estimatedUsageCounts: ({ replies, summaries }) =>
    `${replies} válasz · ${summaries} memóriafrissítés`,
  estimatedUsageConversationScope:
    "Az összegek tartalmazzák a beszélgetésben használt összes útvonalat és modellt.",
  estimatedPromptTokens: ({ count }) => `Prompt: ${count}`,
  estimatedReplyTokens: ({ count }) => `Válasz: ${count}`,
  estimatedTotalTokens: ({ count }) => `Összesen: ${count}`,
  estimatedUsageInline: ({ prompt, completion, total }) =>
    `Becs. ${prompt} be · ${completion} ki · ${total} összesen`,
  searchQuery: "Keresési lekérdezés",
  expandWebSearchDetails: "A webes keresés részleteinek megjelenítése",
  collapseWebSearchDetails: "A webes keresés részleteinek elrejtése",
  webSearchSourceCount: ({ count }) => `${count} forrás`,
  sources: "Források",
  openSourceLink: ({ source }) => `Forrás megnyitása: ${source}`,
  turnReceipt: "Forduló részletei",
  expandTurnReceipt: "Forduló részleteinek megjelenítése",
  collapseTurnReceipt: "Forduló részleteinek elrejtése",
  turnReceiptDirect: "Közvetlen",
  turnReceiptRequested: "Kért válaszútvonal",
  turnReceiptActual: "Tényleges válaszútvonal",
  turnReceiptEffort: "Gondolkodási szint",
  turnReceiptProviderNative: "szolgáltatói natív",
  turnReceiptInput: "Beviteli útvonal",
  turnReceiptSearch: "Webes keresés",
  turnReceiptVoice: "Hangkimenet",
  turnReceiptContext: "Kontextus",
  turnReceiptTiming: "Időzítés",
  turnReceiptFallback: "Tartalék ok",
  turnReceiptVoiceInput: "Hang",
  turnReceiptTypedInput: "Gépelt",
  turnReceiptSystemSpeech: "Rendszer beszédfelismerés",
  turnReceiptSystemVoice: "Rendszerhang",
  turnReceiptSystemVoiceFallback: "Rendszerhang · tartalék",
  turnReceiptOff: "Ki",
  turnReceiptNotConfigured: "Be · nincs konfigurálva",
  turnReceiptFallbackWithoutSearch: "Folytatás élő keresés nélkül",
  turnReceiptNotUsed: "Nem használt",
  turnReceiptSummaryReused: "mentett összefoglaló újrafelhasználva",
  turnReceiptSummaryUpdated: "összefoglaló frissítve",
  turnReceiptContextFallback: "tartalék a legutóbbi üzenetekből",
  turnReceiptGatewayCompression: ({ original, compressed }) =>
    `az átjáró ${original} üzenetet ${compressed} üzenetre tömörített`,
  turnReceiptContextValue: ({ sent, total, summarized, state }) =>
    `${sent}/${total} korábbi üzenet elküldve · ${summarized} újonnan összefoglalva${state}`,
  turnReceiptTimingStt: "STT",
  turnReceiptTimingContext: "kontextus",
  turnReceiptTimingSearch: "keresés",
  turnReceiptTimingModel: "modell",
  turnReceiptTimingFirstSpeech: "első beszéd",
  turnReceiptTimingTotal: "összesen",
  estimatedRouteUsageTokensOnly: ({ tokens }) => `${tokens} token`,
  unknownUsageRoute: "Ismeretlen útvonal",
  setupGuideConnectProviderTitle: "Hitelesítő adatok konfigurálása",
  setupGuideConnectProviderDescription:
    "Adjon hozzá hitelesítő adatokat a Beállításokban, majd válassza ki a használni kívánt útvonalakat.",
  idle: "Tétlen",
  yourConversationAppearsHere: "Az Ön beszélgetése itt jelenik meg",
  defaultTranscriptEmptyDescription:
    "A kezdéshez használjon hangot vagy szöveget. Mr Broccoli megőrzi a beszélgetést, és itt válaszol.",
  delete: "Törlés",
  deleteConversationConfirmationTitle: ({ title }) =>
    `Törli a „${title}” elemet?`,
  deleteConversationConfirmationMessage:
    "Ez véglegesen törli a beszélgetést és az összes üzenetét. Ez a művelet nem vonható vissza.",
  memory: "Memória",
  conversations: "Beszélgetések",
  drawerSubtitle: "Ugorjon az élő szálak közé, vagy nyisson új szobát.",
  newSession: "Új munkamenet",
  noSavedConversationsYet: "Még nincsenek mentett beszélgetések",
  drawerEmptyDescription:
    "Kezdjen el beszélni a főnézetben, és Mr Broccoli automatikusan létrehoz egy munkamenetet.",
  setupGuideTitle: "Konfigurálja az alkalmazást",
  setupGuideSubtitle:
    "Adjon hozzá hitelesítő adatokat, és válasszon útvonalakat a Beállításokban.",
  fastestStartPreset: "Minimális beállítás",
  fastestStartDescription:
    "Ahol elérhető, használja az eszköz saját beszédfunkcióit, és csak a szükséges válaszútvonalat konfigurálja.",
  fullVoicePreset: "Konfigurált hang",
  fullVoiceDescription:
    "Használja a konfigurált szolgáltatásokat a válaszokhoz, az átíráshoz és a szóbeli kimenethez, amikor kiválasztja őket.",
  setupGuideNote:
    "Ezután megnyitjuk a Beállításokat, hogy beilleszthesse és ellenőrizhesse a hitelesítő adatokat.",
  useThisSetup: "Használja ezt a beállítást",
  notNow: "Most nem",
  setupGuideIntroTitle: "Hogyan működik Mr Broccoli",
  setupGuideIntroBody:
    "Mr Broccoli üresen indul. Adjon hozzá hitelesítő adatokat a már használt külső szolgáltatásokhoz, majd válassza ki a válaszok, a beszédbevitel, a szóbeli kimenet és az opcionális webkontextus továbbításának módját.",
  setupGuideIntroNote:
    "A beállítás után használja a fő hangvezérlést a beszélgetés indításához és leállításához. Az aktuális átirat elérhető marad a kezdőképernyőn, és minden útvonal később módosítható a Beállításokban.",
  setupGuideProviderTitle: "Hitelesítő adatok hozzáadása",
  setupGuideProviderBody:
    "Válassza ki a konfigurálni kívánt külső szolgáltatást, majd illessze be a hitelesítő adatokat válaszhozzáféréssel.",
  setupGuideProviderPickerLabel: "Válaszszolgáltatás",
  setupGuideSelectProvider: "Válasszon szolgáltatót",
  setupGuideSelectProviderFirst: "Először válasszon szolgáltatót.",
  setupGuideApiKeyLabel: "API-kulcs",
  setupGuideApiKeyPlaceholder: "Hitelesítő adatok beillesztése",
  setupGuideContinue: "Folytatás",
  setupGuideOpenSettings: "Nyissa meg a Beállításokat",
  setupGuideBack: "Vissza",
  setupGuideValidateKey: "A kulcs érvényesítése",
  setupGuideApiKeyRequiredOrCancel:
    "Adjon hozzá egy API-kulcsot a folytatáshoz, vagy szakítsa meg a beállítási útmutatót.",
  setupGuideProviderAndApiKeyRequiredOrCancel:
    "Válasszon szolgáltatót, és adjon hozzá API-kulcsot a folytatáshoz, vagy szakítsa meg a beállítási útmutatót.",
  setupGuideProviderKeyNeedsLlmAccess: ({ provider }) =>
    `Ezek a ${provider} hitelesítő adatok nem teszik lehetővé a válaszkéréseket.`,
  setupGuideKokoroTitle: "Adjon hozzá egy természetes hangot az eszközön",
  setupGuideKokoroBody: ({ size }) =>
    `Opcionális: töltse le a Kokoro-t (körülbelül ${size} MB) a sokkal természetesebb szóbeli válaszokért, beszédszolgáltató és használati díjak nélkül.`,
  setupGuideKokoroLanguageNote:
    "Ez a modell jelenleg angolul és egyszerűsített kínaiul beszél. Konfigurálja a későbbiekben kívánt tartalék útvonalakat a Beszéd beállításaiban.",
  setupGuideKokoroDownload: "A Kokoro letöltése",
  setupGuideUseKokoro: "Használja a Kokoro-t a szóbeli válaszokhoz",
  setupGuideUseKokoroSummary:
    "Tartsa a szintézist a telefonon, amikor a válasznyelv támogatott.",
  setupGuideSkipKokoro: "Kihagyás most",
  setupGuideVoiceTestTitle: "Tesztelje le beállításait",
  setupGuideVoiceTestBody:
    "Mondjon egy rövid mondatot. Mr Broccoli teszteli a mikrofonhozzáférést, az átírást, a beállított válaszútvonalat és – ha elérhető megfelelő hangútvonal – a hangkimenetet.",
  setupGuideVoiceTestNoInputBody:
    "A hangbevitel nem érhető el ezzel a beállítással. Folytassa az észlelt útvonalak áttekintését, majd szükség esetén módosítsa a beszédbeállításokat később.",
  setupGuideVoiceTestTextOnlyNote:
    "Ez a teszt csak szöveges marad, mert még nem áll rendelkezésre elfogadható beszédútvonal.",
  setupGuideVoiceTestStart: "Indítsa el a tesztet",
  setupGuideVoiceTestStop: "Felvétel leállítása",
  setupGuideVoiceTestRetry: "Futtatás újra",
  setupGuideVoiceTestTranscribing: "Átírás…",
  setupGuideVoiceTestThinking: "Válasz tesztelése…",
  setupGuideVoiceTestSynthesizing: "Hang előkészítése…",
  setupGuideVoiceTestSpeaking: "Válasz lejátszása…",
  setupGuideVoiceTestTranscript: "Átirat",
  setupGuideVoiceTestReply: "Válasz",
  setupGuideVoiceTestReset: "Eredmény törlése",
  setupGuideVoiceInputUnavailable:
    "A hangbevitel ehhez a beállításhoz nem érhető el ezen az eszközön.",
  setupGuideSummaryTitle: "Beállítás kész",
  setupGuideSummaryBody:
    "Mr Broccoli ezt az útvonalat fogja használni a jelenlegi beállításokkal.",
  setupGuideSummaryLlm: "LLM",
  setupGuideSummaryStt: "Beszéd szöveggé",
  setupGuideSummaryTts: "Szöveg beszéddé",
  setupGuideSummaryWebSearch: "Webes keresés",
  setupGuideRouteProviderLlm: ({ provider }) => `Engedélyezve: ${provider}`,
  setupGuideRouteOnDeviceStt:
    "A rendszer beszédfelismerésén keresztül engedélyezve",
  setupGuideRouteProviderStt: ({ provider }) =>
    `Engedélyezve ${provider} beszédátírással`,
  setupGuideRouteProviderTts: ({ provider }) =>
    `Engedélyezve ${provider} hangon keresztül`,
  setupGuideRouteKokoroTts:
    "Engedélyezve az eszközön található Kokoro hangon keresztül",
  setupGuideRouteLocalTts: "Helyi hangcsomagon keresztül engedélyezve",
  setupGuideRouteUnavailable: "Nem elérhető",
  setupGuideRouteOff: "Ki",
  setupGuideWebSearchAvailableOff: ({ provider }) =>
    `Elérhető a(z) ${provider} szolgáltatón keresztül, jelenleg kikapcsolva`,
  setupGuideSummaryTextOnlyNote:
    "A szóbeli válaszok egyelőre ki vannak kapcsolva. A válaszok szövegben maradnak, amíg nem engedélyezi a szolgáltatót vagy a helyi hangot.",
  setupGuideFinish: "Kész",
  searchConversationsPlaceholder:
    "Keresés címekben, modellekben és üzenetszövegekben",
  noMatchingConversations: "Nincsenek megfelelő beszélgetések",
  noMatchingConversationsDescription:
    "Próbáljon más címet, útvonalat, modellt vagy kifejezést az átiratból.",
  memoryModalTitle: "Beszélgetési memória",
  memoryModalDescription:
    "Ez az a tömör összefoglaló, amelyet Mr Broccoli továbbvisz, amikor a beszélgetés már elég hosszú a régebbi fordulók tömörítéséhez.",
  memorySummary: "Mentett összefoglaló",
  memorySummaryEmpty:
    "Még nincs kompakt memória. Amint ez a szál hosszabb lesz, itt összefoglaljuk a régebbi fordulókat.",
  summarizedTurnsCount: ({ count }) => `${count} összefoglalt forduló`,
  copyMemory: "Memória másolása",
  forgetMemory: "Memória elfelejtése",
  memoryCopied: "Memória másolva.",
  memoryCleared: "A beszélgetési memória törölve.",
  noConversationToManageYet: "Még nem áll rendelkezésre beszélgetési memória.",
  noProviderYet: "Még nincs szolgáltató",
  noModelYet: "Még nincs modell",
  startedAt: "Kezdés",
  endedAt: "Befejezés",
  pinned: "Rögzítve",
  copy: "Másolás",
  share: "Megosztás",
  rename: "Átnevezés",
  pin: "Rögzítés",
  unpin: "Rögzítés feloldása",
  save: "Mentés",
  cancel: "Mégse",
  stop: "Leállítás",
  pause: "Szünet",
  resume: "Folytatás",
  paused: "Szüneteltetve",
  listening: "Hallgatás",
  parsing: "Átírás",
  searching: "Keresés",
  converting: "Átalakítás",
  webSearchAction: "webes keresés",
  thinking: "Gondolkodás",
  speaking: "Felolvasás",
  pleaseWait: "Kérjük, várjon",
  yourTurn: "Ön következik",
  keepPressing: "Tartsa nyomva",
  tapWhenDone: "Ha kész, koppintson rá",
  speechPaused: "A beszéd szünetel",
  pausePlaybackUnavailable:
    "Ezt a hangútvonalat nem lehet szüneteltetni. Állítsa le, vagy váltson szolgáltatói hangkimenetre.",
  holdToSpeak: "Tartsa nyomva beszéd közben",
  tapToSpeak: "Koppintson a beszédhez",
  tapAgainToSend: "Koppintson újra a küldéshez",
  waitingForReply: "Várakozás a válaszra",
  parsingYourVoice: "A hang elemzése",
  providerConfiguredInSettings: ({ provider }) =>
    `${provider} nincs konfigurálva a Beállításokban.`,
  providerNetworkError: ({ provider, action }) =>
    `Nem sikerült elérni a(z) ${provider} szolgáltatót ${action} esetén. Ellenőrizze a kapcsolatot, és próbálja újra.`,
  providerAuthError: ({ provider, action }) =>
    `${provider} elutasította a(z) ${action} művelet hitelesítő adatait. Ellenőrizze az API-kulcsot és az engedélyeket.`,
  providerRateLimitError: ({ provider, action }) =>
    `${provider} jelenleg korlátozza a(z) ${action} kéréseket. Próbálja újra egy pillanat múlva.`,
  providerCreditsRequired: ({ provider, action }) =>
    `${provider} elegendő API-egyenleget igényel a(z) ${action} művelethez. Ellenőrizze a fiók egyenlegét és a kulcs költési korlátját.`,
  providerTimeoutError: ({ provider, action }) =>
    `${provider} túl sokáig tartott a ${action} során. Próbálja újra.`,
  providerTemporaryError: ({ provider, action }) =>
    `${provider} átmeneti problémát tapasztalt a ${action} alatt. Próbálja újra rövidesen.`,
  providerEmptyReplyError: ({ provider }) =>
    `${provider} válasz nélkül fejeződött be. Próbálja újra.`,
  providerIncompleteReplyError: ({ provider }) =>
    `${provider} válasza megszakadt, mielőtt elkészült volna. Próbálja újra.`,
  providerContextTooLong: ({ provider }) =>
    `${provider} elutasította a választ, mert a beszélgetés túl hosszúra sikerült. Indítson új szálat, vagy rövidítse le a kérést.`,
  providerRequestRejected: ({ provider, action, detail }) =>
    detail
      ? `${provider} elutasította a ${action} kérést: ${detail}`
      : `${provider} elutasította a ${action} kérelmet.`,
  providerWebSearchNotRun: ({ provider }) =>
    `${provider} webes keresés futtatása nélkül adott választ.`,
  providerValidationSuccess: ({ provider }) => `${provider} használatra kész.`,
  providerCapabilityValidationSuccess: ({ provider, capability }) =>
    `${provider} ${capability} működik.`,
  providerValidationFailed: "A szolgáltató ellenőrzése sikertelen.",
  webSearchFallback:
    "A webes keresés nem volt elérhető, ezért a válasz élő webes kontextus nélkül folytatódott.",
  noBase64EncoderAvailable: "Nincs elérhető base64-kódoló.",
  noBase64DecoderAvailable: "Nincs elérhető base64-dekóder.",
  azureSpeechApiKeyFormat:
    "A Microsoft Azure TTS-hez <key>|<region> formátumú Azure Speech hitelesítő adatok szükségesek, például abc123|westeurope, vagy a kombinált Azure-formátum: <endpoint>|<api-key>|<key>|<region>.",
  nativeTtsDoesNotSynthesizeAudioFiles:
    "A natív TTS nem szintetizál hangfájlokat.",
  localTtsUnavailableForLanguage: ({ languageLabel }) =>
    `Nincs helyi vagy felhőalapú hangútvonal a ${languageLabel} számára.`,
  chooseTextToSpeechProviderInSettings:
    "Válasszon szövegfelolvasó szolgáltatót a Beállításokban.",
  ttsNotSupportedYet: ({ provider }) => `${provider} TTS még nem támogatott.`,
  ttsError: ({ provider, status, errorText }) =>
    `${provider} TTS hiba (${status}): ${errorText}`,
  ttsReplyTooLong: ({ provider }) =>
    `${provider} beszédkimenet elutasította a választ, mert túl hosszú volt.`,
  ttsTimeout: ({ provider }) => `${provider} beszédkimenet túl sokáig tartott.`,
  sttTimeout: ({ provider }) => `${provider} beszédátírás túl sokáig tartott.`,
  sttFileSizeLimitExceeded: ({ provider, model, limit }) =>
    `${provider} ${model} csak ${limit}-ig fogad felvételeket. Használjon rövidebb klipet, vagy váltson másik STT-modellre.`,
  voiceInputCaptureIncomplete:
    "A hangbevitelt nem sikerült tisztán rögzíteni. Kérjük, próbálja újra.",
  ttsDidNotReturnAudio: ({ provider }) =>
    `${provider} TTS nem adott vissza hangot.`,
  nativeSttHandledInApp:
    "A rendszer STT kezelése közvetlenül az alkalmazásban történik.",
  chooseSpeechToTextProviderInSettings:
    "Válasszon beszéd-szöveg szolgáltatót a Beállításokban.",
  sttNotSupportedYet: ({ provider }) => `${provider} STT még nem támogatott.`,
  providerNotWiredUpYet: ({ provider }) => `${provider} még nincs bekötve.`,
  you: "Te",
  assistant: "Asszisztens",
  untitledConversation: "Cím nélküli beszélgetés",
  conversationExportHeader: ({ title }) => `Beszélgetés: ${title}`,
  speechRecognitionPermissionNotGranted:
    "A beszédfelismerési engedély nincs megadva.",
  speechRecognitionUnavailableForDeviceLanguage:
    "A beszédfelismerés nem érhető el az eszköz jelenlegi nyelvén.",
  nativeSpeechRecognitionNeedsNetwork:
    "A rendszer beszédfelismeréséhez jelenleg hálózati kapcsolat szükséges.",
  noSpeechDetected: "Nem észleltünk beszédet.",
  nativeSpeechRecognitionFailed: "A rendszer beszédfelismerése sikertelen.",
  couldntStartNativeSpeechRecognition:
    "Nem sikerült elindítani a rendszer beszédfelismerését.",
  microphonePermissionNotGranted: "Mikrofonengedély nincs megadva",
} satisfies TranslationDictionary;
