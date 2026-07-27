import type { TranslationDictionary } from "../types";

export const de: TranslationDictionary = {
  appName: "Mr. Brokkoli",
  retry: "Noch mal",
  dismiss: "Schließen",
  done: "Fertig",
  aboutSetting: ({ setting }) => `Mehr über ${setting}`,
  unavailable: "Gibt's nich",
  selection: "Auswahl",
  chooseCompatibleProviderFirst: "Wähle zuerst nen geeigneten Anbieter",
  settings: "Einstellungen",
  all: "Alle",
  firstRun: "Erster Start",
  instructions: "Anweisungen",
  providers: "Anbieter",
  webSearch: "Websuche",
  stt: "STT",
  tts: "TTS",
  ui: "UI",
  settingsRuntimeReadiness: "Laufzeitstatus",
  settingsReadinessThink: "Denken",
  settingsReadinessListen: "Hören",
  settingsReadinessSpeak: "Sprechen",
  settingsReadinessSearch: "Suchen",
  settingsReadinessReady: "Bereit",
  settingsReadinessNeedsAttention: "Achtung",
  settingsReadinessBroken: "Defekt",
  settingsReadinessOff: "Aus",
  settingsConnections: "Verbindungen",
  settingsThinking: "Denken",
  settingsListening: "Hören",
  settingsSpeaking: "Sprechen",
  settingsSearch: "Suche",
  settingsAppDiagnostics: "App & Diagnose",
  settingsGuidedSetup: "Geführte Einrichtung",
  settingsGuidedSetupSummary:
    "Verbindungen prüfen und die komplette Sprachroute testen.",
  setupGuideShowInSettings: "Geführte Einrichtung anzeigen",
  setupGuideShowInSettingsSummary:
    "Schalte dies aus, um den Eintrag nach dem Schließen auszublenden.",
  settingsConnectionsSummary: "Provider-Keys, Prüfung und Fähigkeiten.",
  settingsThinkingSummary:
    "Homescreen-Karten, Modelle, Aufwand und Systemprompt.",
  settingsListeningSummary: "Eingabemodus und Sprache-zu-Text-Routing.",
  settingsSpeakingSummary:
    "Gesprochene Antworten, Wiedergabe, Stimmen und Vorschau.",
  settingsSearchSummary: "Websuche-Anbieter und Regler für die Suchqualität.",
  settingsAppDiagnosticsSummary:
    "Design, Sprache, Nutzung, Debug-Logs und letzte Aktivität.",
  settingsBackToOverview: "Zurück zur Übersicht",
  settingsOpenSection: ({ section }) => `${section} öffnen`,
  theme: "Design",
  language: "Sprache",
  usageStats: "Nutzungsdaten",
  model: "Modell",
  effort: "Aufwand",
  effortValue: ({ effort }) => `Aufwand: ${effort}`,
  fixed: "Fest",
  english: "Englisch",
  german: "Deutsch",
  light: "Hell",
  dark: "Dunkel",
  system: "System",
  languageCoverage: ({ note }) => `Sprachabdeckung: ${note}`,
  recordingLimits: ({ note }) => `Aufnahmelimits: ${note}`,
  replyGenerationAction: "Antworterstellung",
  speechTranscriptionAction: "Sprachtranskription",
  instructionsTabDescription:
    "Definiere die versteckte Anleitung, die den Assistenten steuert, bevor ein Anbieter die Anfrage sieht.",
  providersTabDescription:
    "Speichere Zugangsdaten für externe Dienste auf dem Gerät und konfiguriere die Antwortmodi, die du verwenden möchtest.",
  webSearchTabDescription:
    "Konfiguriere optionalen frischen Web-Kontext vor Antworten.",
  responseModes: "Modellauswahl",
  aboutModelSelection: "Über die Modellauswahl",
  modelSelectionInfo:
    "Jede Modellkarte wird zu einer Auswahl auf dem Startbildschirm. Lege Anbieter, Modell und optional den Denkaufwand fest und wechsle zwischen den Karten, um das Modell für die nächste Antwort zu wählen.",
  responseModeItemTitle: ({ index }) => `Modell ${index}`,
  addResponseMode: "Modell hinzufügen",
  removeResponseMode: "Modell entfernen",
  responseModesNoConfiguredProviders:
    "Füge zuerst Zugangsdaten hinzu. Routen bleiben ausgeblendet, bis mindestens ein kompatibler Dienst konfiguriert ist.",
  useResponseMode: ({ mode }) => `${mode} verwenden`,
  chooseResponseModel: "Modell auswählen",
  responseModelCount: ({ count }) => `${count} Modelle verfügbar`,
  sttTabDescription:
    "Steuere, wie Sprache aufgenommen wird und welches Backend Audio in Text umwandelt, bevor es das Modell erreicht.",
  ttsTabDescription:
    "Steuere, wann Antworten vorgelesen werden und welches Backend die Sprachausgabe übernimmt.",
  brief: "Kurz",
  briefDescription:
    "Halte die Antwort knapp. Nutze nur so viele Sätze wie nötig, um die Frage vollständig zu beantworten.",
  normal: "Normal",
  normalDescription:
    "Strebe eine ausgewogene Antwortlänge an. Decke die wichtigsten Punkte ab, ohne die Antwort unnötig in die Länge zu ziehen.",
  thorough: "Ausführlich",
  thoroughDescription:
    "Geh in die Tiefe und sei umfassend. Berücksichtige Nuancen, Details, Abwägungen und die relevante Begründung.",
  professional: "Professionell",
  professionalDescription:
    "Sprich wie ein erfahrener Berater im Kundengespräch. Präzise Wortwahl, kein Slang, souverän und bestimmt.",
  casual: "Locker",
  casualDescription:
    "Sprich wie ein kluger Freund im Café. Entspannt, natürlich, gesprächig. Abkürzungen und kleine Abschweifungen sind völlig okay.",
  nerdy: "Nerdig",
  nerdyDescription:
    "Sprich wie ein begeisterter Experte, der gerne in die Tiefe geht. Nutze Fachbegriffe frei, geh entspannt ins Detail und setze voraus, dass dein Gegenüber mitkommt.",
  concise: "Prägnant",
  conciseDescription:
    "Sei so kurz wie möglich und trotzdem vollständig. Keine Einleitung, kein Fülltext, nur die Antwort. Telegramm-Stil.",
  socratic: "Sokratisch",
  socraticDescription:
    "Fordere das Denken heraus. Stelle Gegenfragen, biete alternative Perspektiven an und bestätige nicht einfach, was gesagt wurde.",
  eli5: "Einfach erklärt",
  eli5Description:
    "Erkläre alles so einfach wie möglich. Nutze Analogien, Alltagssprache und verzichte auf Fachjargon. Setze bei keinem Thema Vorwissen voraus.",
  useProvider: ({ provider }) => `${provider} verwenden`,
  createApiKey: "Zugangsdaten",
  apiKey: "API-Schlüssel",
  aboutThisProvider: "Über diesen Anbieter",
  openRouterOnboardingTitle: "Ein Key, mehrere Anbieter",
  openRouterOnboardingDescription:
    "Erstelle einen eigenen OpenRouter-Key, füge ihn unten ein und nutze Snapshot-Modelle mehrerer Anbieter, ohne direkte Verbindungen zu ersetzen.",
  openRouterOnboardingRoute:
    "Anfrageweg: dieses Gerät → OpenRouter → ausgewählter Upstream-Anbieter",
  openRouterKeys: "OpenRouter-Keys",
  providerStatusInvalid: "Ungültig",
  providerStatusTesting: "Prüfe",
  providerStatusConfigured: "Konfiguriert",
  providerStatusWorking: "Funktioniert",
  providerStatusNotTested: "Nicht geprüft",
  providerStatusNotSetup: "Nicht eingerichtet",
  expandProvider: ({ provider }) => `${provider} ausklappen`,
  collapseProvider: ({ provider }) => `${provider} einklappen`,
  testProviderKey: "Key testen",
  testAllCapabilities: "Alle prüfen",
  apiTest: "API-Test",
  testProviderCapability: ({ capability }) => `${capability} prüfen`,
  test: "Prüfen",
  optional: "Optional",
  providerCapability_llm: "Antworten",
  providerCapability_stt: "Spracheingabe",
  providerCapability_tts: "Sprachausgabe",
  providerCapability_search: "Websuche",
  providerCapability_voices: "Stimmbibliothek",
  providerValidationUnavailable:
    "Für diesen Anbieter ist noch kein Live-Test verdrahtet. Speichere den Key hier und prüfe ihn bei der echten Nutzung.",
  providerNeedsAttention: "braucht Aufmerksamkeit",
  catalogProviderLimitsSummary: ({ summary }) => `Limits: ${summary}`,
  catalogProviderRegionSummary: ({ summary }) => `Regionen: ${summary}`,
  validatingKey: "Prüfe …",
  showKey: "API-Key anzeigen",
  hideKey: "API-Key ausblenden",
  assistantInstructions: "Assistent-Anweisungen",
  systemPrompt: "Systemprompt",
  aboutSystemPrompt: "Über den Systemprompt",
  assistantInstructionsIntro:
    "Forme die versteckte Anleitung, die das Modell vor jeder Antwort erhält.",
  baseInstructions: "Grundanweisungen",
  assistantInstructionsPlaceholder:
    "Definiere, wie sich der Assistent verhalten soll.",
  assistantInstructionsHint:
    "Dieser Text wird immer vor der gewählten Antwortlänge und dem Stil vorangestellt.",
  adaptiveLength: "Antwortlänge",
  responseTone: "Antwortstil",
  homeStyleChipLabel: ({ tone, length }) => `Stil — ${tone} · ${length}`,
  styleSheetTitle: "Gesprächseinstellungen",
  styleSheetSubtitle:
    "Passe Antworten und Sprachausgabe nur für dieses Gespräch an.",
  openStyleSheet: "Gesprächseinstellungen öffnen",
  conversationThinkingInstructions: "Anweisungen zum Nachdenken",
  conversationThinkingInstructionsDescription:
    "Ergänze den globalen Systemprompt um Anweisungen für dieses Gespräch.",
  conversationThinkingInstructionsPlaceholder:
    "Zum Beispiel: Hinterfrage meine Annahmen und nutze konkrete Beispiele.",
  ttsInstructions: "Anweisungen zur Sprachausgabe",
  ttsInstructionsDescription:
    "Steuere Ton, Tempo, Akzent oder Ausdruck kompatibler Sprachmodelle.",
  conversationTtsInstructionsDescription:
    "Ergänze die globalen Sprachanweisungen für dieses Gespräch.",
  ttsInstructionsPlaceholder:
    "Zum Beispiel: Sprich freundlich, klar und in ruhigem Tempo.",
  ttsInstructionsUnsupported:
    "Die aktuelle Sprachausgabe unterstützt keine Ausführungsanweisungen.",
  conversationVoiceDescription: ({ route }) =>
    `Wähle die Stimme von ${route} für dieses Gespräch.`,
  scrollToLatest: "Zur neuesten Nachricht scrollen",
  conversationTitleGenerate: "Titel automatisch erzeugen",
  conversationTitleGenerating: "Titel wird erzeugt …",
  conversationTitleGenerated: "Gespräch umbenannt.",
  conversationTitleNeedsContent:
    "Beginne ein Gespräch, bevor du einen Titel erzeugst.",
  conversationTitleNeedsProvider:
    "Richte das ausgewählte Modell ein, bevor du einen Titel erzeugst.",
  conversationTitleGenerationFailed:
    "Der Gesprächstitel konnte nicht erzeugt werden.",
  conversationTitleGenerationTimedOut:
    "Das Erzeugen des Titels hat zu lange gedauert. Bitte versuche es erneut.",
  inputMode: "Eingabemodus",
  voiceInput: "Spracheingabe",
  voiceInputDescription:
    "Steuere, wie deine Sprache aufgenommen wird, bevor sie das Modell erreicht.",
  pushToTalk: "Push to talk",
  pushToTalkDescription:
    "Lass den Button während des Sprechens gedrückt und lass ihn los, wenn du fertig bist.",
  toggleToTalk: "Toggle to talk",
  toggleToTalkDescription:
    "Button einmal drücken, um loszusprechen, und dann noch einmal, wenn du fertig bist.",
  driveSession: "Fahrmodus",
  driveSessionDescription:
    "Aktiviert das Mikrofon nach jeder Antwort erneut. Du entscheidest, wann ein Gedanke vollständig ist, damit Sprechpausen nicht abgeschnitten werden.",
  startDriveSession: "Fahrmodus starten",
  stopDriveSession: "Beenden",
  repeatDriveReply: "Wiederholen",
  continueDriveSession: "Weiter",
  driveSessionListeningCue: "Ich höre zu.",
  driveSessionStoppedCue: "Fahrmodus beendet.",
  driveSessionReady: "Fahrmodus",
  driveSessionReadyDescription:
    "Der Fahrmodus ist bereit. Tippe auf Weiter, um erneut zuzuhören.",
  tapToSendDriveTurn: "Zum Senden tippen",
  tapToInterruptDriveReply: "Zum Unterbrechen tippen",
  speechToText: "Sprache zu Text",
  appNative: "Systemerkennung",
  nativeSttDescription:
    "Verwende die Spracherkennung des Betriebssystems. Je nach Geräteeinstellung läuft sie lokal oder über den Systemdienst. Kein API-Key nötig.",
  provider: "Anbieter",
  webSearchProvider: "Websuche-Anbieter",
  webSearchProviderHint:
    "Wähle den konfigurierten Dienst für Live-Websuchen. Die Zugangsdaten werden lokal auf dem Gerät gespeichert.",
  webSearchProviderMissingHint:
    "Richte unter Zugangsdaten mindestens einen suchfähigen Dienst ein, damit Web-Grundierung hier verfügbar ist.",
  webSearchModelHint: ({ model }) =>
    `Verwendet im Hintergrund ${model} für die Live-Webrecherche.`,
  webSearchHomeHint:
    "Nutze den Homescreen-Schalter, um Web-Grundierung für dieses Gespräch ein- oder auszuschalten.",
  settingsWebSearchCompactHint:
    "Optional wird vor der eigentlichen Antwort frischer Web-Kontext eingefügt.",
  webSearchAdvanced: "Erweiterte Suchregler",
  webSearchSetupNeeded:
    "Hinterlege Zugangsdaten, um die Live-Websuche zu nutzen.",
  webSearchEnabledDescription:
    "Vor der Modellantwort wird frischer Web-Kontext ergänzt.",
  webSearchDisabledDescription:
    "Nutze Live-Web-Kontext, wenn aktuelle Fakten wichtig sind.",
  webSearchQualityControls: "Suchqualität",
  webSearchSearchMode: "Suchmodus",
  webSearchSearchModeQuick: "Schnell",
  webSearchSearchModeBalanced: "Ausgewogen",
  webSearchSearchModeDeep: "Tief",
  webSearchDepth: "Suchtiefe",
  webSearchDepthStandard: "Standard",
  webSearchDepthDeep: "Tief",
  webSearchResultCount: "Trefferanzahl",
  webSearchQualityHint: ({ provider }) =>
    `Diese Regler steuern, wie ${provider} frischen Kontext vor der Antwort einsammelt.`,
  webSearchNoExtraControls: ({ provider }) =>
    `${provider} bietet in dieser App derzeit keine zusätzlichen Suchregler an.`,
  setWebSearchMode: ({ mode }) => `Websuche auf ${mode} setzen`,
  openWebSearchSettings: "Websuche-Einstellungen öffnen",
  providerSttDescription:
    "Nutze einen konfigurierten externen Dienst, um Sprache vor der Antwortroute in Text umzuwandeln.",
  sttProvider: "STT-Anbieter",
  sttProviderEnabledHint:
    "Hier erscheinen nur aktivierte Anbieter mit Transkriptionsunterstützung.",
  sttProviderMissingHint:
    "Füge Zugangsdaten für einen Dienst mit STT-Unterstützung hinzu, um ihn hier auszuwählen.",
  nativeSttHint:
    "Die Systemerkennung funktioniert unabhängig von deinen API-Keys und kann lokal oder über den Spracherkennungsdienst des Betriebssystems laufen.",
  replyPlayback: "Wiedergabe",
  sentencesArrive: "Satzweise",
  sentencesArriveDescription:
    "Fange an Vorzulesen, sobald die ersten Daten angekommen sind.",
  fullReplyFirst: "Komplette Antwort zuerst",
  fullReplyFirstDescription:
    "Warte erst ab, bis die Antwort komplett eingegangen ist, und lies sie dann am Stück vor.",
  textToSpeech: "Text zu Sprache",
  spokenReplies: "Gesprochene Antworten",
  spokenRepliesEnabledDescription:
    "Lies Antworten laut vor, sobald eine brauchbare Sprachroute verfügbar ist.",
  spokenRepliesDisabledDescription:
    "Halte Antworten vorerst textbasiert. Deine bevorzugte TTS-Route bleibt für später gespeichert.",
  nativeTtsDescription:
    "Verwende die Sprachausgabe des Geräts für die Sprachausgabe.",
  kokoroTtsDescription:
    "Nutze eine deutlich natürlichere neuronale Stimme vollständig auf diesem Gerät. Der Antworttext wird lokal vertont – ohne API-Key oder Nutzungskosten für einen Sprachanbieter.",
  kokoroVoices: "Kokoro-Stimmen auf dem Gerät",
  kokoroVoicesHint: ({ size, installedSize }) =>
    `Das mehrsprachige Modell lädt etwa ${size} MB herunter und belegt nach der Installation ungefähr ${installedSize} MB.`,
  kokoroModel: "Mehrsprachiges Kokoro-Modell",
  kokoroChecking: "Prüfe das lokale Modell…",
  kokoroDownloading: ({ progress }) => `Download läuft… ${progress} %`,
  kokoroExtracting: ({ progress }) => `Installation läuft… ${progress} %`,
  kokoroVerifying: "Prüfe die Sprachengine…",
  kokoroInstalled: "Auf diesem Gerät installiert und einsatzbereit.",
  kokoroNotInstalled: "Optionaler Download. Kein API-Key erforderlich.",
  kokoroLanguageFallback:
    "Kokoro spricht hier derzeit Englisch und vereinfachtes Chinesisch. Füge für andere ausgewählte Antwortsprachen ausdrücklich eine Ausweichroute hinzu, sonst endet die Sprachausgabe mit einem Fehler.",
  kokoroRemoveTitle: "Kokoro-Modell entfernen?",
  kokoroRemoveBody: ({ installedSize }) =>
    `Dadurch werden etwa ${installedSize} MB freigegeben. Du kannst das Modell jederzeit erneut herunterladen.`,
  removeKokoroModel: "Kokoro-Modell entfernen",
  downloadKokoroModel: "Kokoro-Modell herunterladen",
  kokoroFallbackNeeded: ({ languages }) =>
    `Für folgende Sprachen ist eine ausdrückliche Ausweichroute erforderlich: ${languages}.`,
  kokoroNoSelectedLanguages:
    "Wähle unter Sprachen Englisch oder vereinfachtes Chinesisch aus, um eine Kokoro-Stimme zu konfigurieren.",
  expandVoiceSettings: ({ language }) =>
    `${language}-Stimmeneinstellungen ausklappen`,
  collapseVoiceSettings: ({ language }) =>
    `${language}-Stimmeneinstellungen einklappen`,
  remove: "Entfernen",
  voiceOutputDescription:
    "Wähle Sprachengine, Zielsprachen und Stimmvorschauen für die Sprachausgabe.",
  localTts: "Lokal",
  localTtsDescription:
    "Nutze eine passende heruntergeladene lokale Stimme für die Sprachausgabe.",
  providerTtsDescription:
    "Nutze den ausgewählten konfigurierten Dienst für die Sprachausgabe.",
  ttsFallbackRoutes: "Ausweichrouten",
  ttsFallbackRoutesHint:
    "Optional. Füge nur gewünschte Routen hinzu und ordne sie in der gewünschten Reihenfolge. Sobald eine Route spricht, bleibt Mr. Brokkoli für den Rest der Antwort bei ihr.",
  ttsFallbackNone:
    "Keine Ausweichroute konfiguriert. Ein Stimmfehler wird stattdessen angezeigt.",
  ttsFallbackPosition: ({ position, route }) => `${position}. ${route}`,
  addFallbackRoute: ({ route }) => `${route} als Ausweichroute hinzufügen`,
  removeFallbackRoute: ({ route }) => `${route}-Ausweichroute entfernen`,
  moveFallbackEarlier: ({ route }) => `${route} nach vorne verschieben`,
  moveFallbackLater: ({ route }) => `${route} nach hinten verschieben`,
  ttsProvider: "TTS-Anbieter",
  ttsProviderEnabledHint:
    "Hier erscheinen nur aktivierte Anbieter mit Sprachausgabe-Unterstützung.",
  ttsProviderMissingHint:
    "Füge Zugangsdaten für einen Dienst mit TTS-Unterstützung hinzu, um ihn hier auszuwählen.",
  localTtsOrderHint:
    "Nur ausdrücklich konfigurierte Ausweichrouten werden versucht.",
  providerTtsOrderHint:
    "Nur ausdrücklich konfigurierte Ausweichrouten werden versucht.",
  nativeTtsHint:
    "Native TTS nutzt die Systemstimmen des Geräts und benötigt keinen API-Key.",
  localTtsLanguageCoverageHint:
    "Lokale Sprachpakete decken derzeit Englisch, Deutsch, vereinfachtes Chinesisch, Spanisch, Portugiesisch, Hindi, Französisch und Italienisch ab.",
  ttsVoice: "TTS-Stimme",
  refresh: "Aktualisieren",
  providerVoiceDirectory: ({ provider }) => `${provider}-Stimmenbibliothek`,
  refreshProviderVoices: ({ provider }) => `${provider}-Stimmen aktualisieren`,
  providerVoicesAvailable: ({ count, provider }) =>
    `${count} ${Number(count) === 1 ? "Stimme" : "Stimmen"} von ${provider} verfügbar.`,
  providerVoicesLoadFailed:
    "Die Stimmen konnten nicht aktualisiert werden. Die aktuelle Auswahl bleibt erhalten; alternativ kannst du eine Stimmen-ID manuell eingeben.",
  providerVoicesLoadFailedWithFallback:
    "Die persönlichen Stimmen konnten nicht geladen werden. Die integrierte Stimme bleibt verfügbar.",
  providerVoicesErrorDetail: ({ detail }) => `Grund: ${detail}`,
  elevenLabsVoicesReadPermissionHint:
    "Aktiviere für diesen API-Key in ElevenLabs „Voices → Read“ und aktualisiere die Stimmen anschließend hier.",
  providerVoicesLoadingHint: ({ provider }) =>
    `Mr. Brokkoli lädt verfügbare Stimmen automatisch von ${provider}.`,
  providerVoiceId: "Stimmen-ID",
  providerVoiceIdPlaceholder: "Stimmen-ID eingeben",
  providerVoiceIdFallbackHint:
    "Die manuelle Eingabe bleibt verfügbar, wenn die Stimmenbibliothek nicht geladen werden kann.",
  providerVoiceIdRequired: ({ provider }) =>
    `Aktualisiere die ${provider}-Stimmenbibliothek oder gib vor der Sprachausgabe eine Stimmen-ID ein.`,
  qwenSpeechUnavailableInUs:
    "Mr. Brokkolis aktuelle Qwen-Sprachrouten sind in der US-Region nicht verfügbar. Wähle für Qwen-Spracherkennung und -ausgabe Singapur oder Peking.",
  qwenApiRegion: "Qwen-API-Region",
  qwenRegionSingapore: "Singapur",
  qwenRegionUs: "USA (Virginia)",
  qwenRegionBeijing: "China (Peking)",
  qwenRegionHint:
    "Die ausgewählte Region muss der Region entsprechen, in der dieser API-Key erstellt wurde.",
  qwenRegionUsSpeechHint:
    "Keys aus der US-Region unterstützen hier Chat und Websuche. Mr. Brokkolis aktuelle Qwen-Routen für Spracherkennung und -ausgabe benötigen einen Key aus Singapur oder Peking.",
  providerDefaultVoiceHint:
    "Dieser Anbieter nutzt aktuell seine Standardstimme für Vorschau und Sprachausgabe.",
  listenLanguages: "Sprachen",
  listenLanguagesHint:
    "Wähle die Sprachen aus, die gut klingen sollen. Mr. Brokkoli probiert sie in dieser Reihenfolge für die Sprachausgabe.",
  listenLanguagesSelected: ({ count }) =>
    count === 1 ? "1 Sprache ausgewählt" : `${count} Sprachen ausgewählt`,
  localVoicePacks: "Lokale Sprachpakete",
  localVoicePacksHint:
    "Jede Sprache bringt eigene Stimmen mit. Wähle zuerst eine Stimme pro Sprache aus und lade dann die Pakete herunter, die du brauchst.",
  localVoiceForLanguage: ({ languageLabel }) => `Stimme für ${languageLabel}`,
  providerVoicePreviews: "Anbieter-Stimmvorschau",
  providerVoicePreviewsHint:
    "Teste hier die aktuell ausgewählte TTS-Route mit einem separaten Vorschautext pro Antwortsprache.",
  nativeVoicePreviewSection: "Native Stimmvorschau",
  nativeVoicePreviewSectionHint:
    "Nutzt direkt die eingebaute Sprachsynthese des Geräts, damit du sie mit konfigurierten Anbieter-Stimmen vergleichen kannst.",
  nativeVoiceUnavailable:
    "Dieses Gerät hat keine nativen Systemstimmen für die Vorschau.",
  speechDiagnostics: "Letzte Aktivität",
  speechDiagnosticsHint:
    "Zeigt die letzten Sprachanfragen, die angefragte Route, die tatsächlich genutzte Route und den Grund für einen Fallback.",
  speechDiagnosticsEmpty:
    "Noch keine aktuellen Aktivitäten. Teste eine Stimme oder spiele eine Antwort ab, um hier Routing-Details zu sehen.",
  clearSpeechDiagnosticsConfirmationTitle: "Letzte Aktivität leeren?",
  clearSpeechDiagnosticsConfirmationMessage:
    "Dadurch werden alle erfassten Diagnoseinformationen zum Sprach-Routing gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.",
  speechDiagnosticSourceConversation: "Antwort aus dem Gespräch",
  speechDiagnosticSourceRepeat: "Antwort wiederholen",
  speechDiagnosticSourcePreview: "Vorschau der Stimme",
  speechDiagnosticSourceUnknown: "Anfrage",
  speechDiagnosticRouteLine: ({ requested, actual }) =>
    `Angefragt: ${requested} -> Tatsächlich: ${actual}`,
  speechDiagnosticStageLine: ({ stage }) => `Letzte Stufe: ${stage}`,
  speechDiagnosticLanguageLine: ({ languageLabel }) =>
    `Sprache: ${languageLabel}`,
  speechDiagnosticProviderLine: ({ provider }) => `Anbieter: ${provider}`,
  speechDiagnosticVoiceLine: ({ voice }) => `Stimme: ${voice}`,
  localTtsPackReady: "Auf diesem Gerät installiert.",
  localTtsPackBroken:
    "Heruntergeladen, aber es liegt ein Fehler vor. Lade erneut herunter oder wähle eine andere Stimme.",
  localTtsPackMissing:
    "Noch nicht installiert. Bis zum Download werden Cloud-TTS oder die Systemstimme genutzt.",
  localTtsUnsupportedLanguageFallback:
    "Für diese Sprache gibt es noch kein lokales Sprachpaket. Cloud-TTS oder die Systemstimme übernehmen.",
  downloadingLocalTtsPack: ({ progress }) =>
    `Lokales Paket wird geladen… ${progress} %`,
  download: "Download",
  downloadingShort: "Lädt …",
  voicePreviewText: "Text für Stimmvorschau",
  voicePreviewPlaceholder: "Gib einen Satz ein, um diese Stimme zu hören.",
  voicePreviewHint:
    "Verwendet das aktuell gewählte Sprach-Backend, ohne etwas an das Sprachmodell zu senden.",
  previewVoice: "Stimme testen",
  generatingPreview: "Vorschau wird erzeugt…",
  playingPreview: "Vorschau wird abgespielt…",
  systemVoice: "Systemstimme",
  spokenRepliesOff: "Nur Text",
  noTtsProvider: "Kein TTS-Anbieter",
  nothingToCopyYet: "Noch nichts zum Kopieren.",
  couldntCopyText: "Der Text konnte nicht kopiert werden.",
  nothingToShareYet: "Noch nichts zum Teilen.",
  couldntShareText: "Der Text konnte nicht geteilt werden.",
  couldntReplayReply: "Die Antwort konnte nicht erneut abgespielt werden.",
  replyFailed: "Antwort fehlgeschlagen",
  retryReply: "Antwort erneut versuchen",
  replyFailedHint:
    "Du kannst oben ein anderes Modell wählen, bevor du es erneut versuchst.",
  spokenReplyFailed:
    "Die Antwort wurde gespeichert, konnte aber nicht gesprochen werden.",
  retrySpeech: "Sprachausgabe erneut versuchen",
  openSpeakingSettings: "Sprachausgabe einstellen",
  messageCopied: "Nachricht kopiert.",
  noConversationToCopyYet: "Noch kein Gespräch zum Kopieren.",
  noConversationToShareYet: "Noch kein Gespräch zum Teilen.",
  noReplyToRepeatYet: "Noch keine Antwort zum Wiederholen.",
  threadCopied: "Gespräch kopiert.",
  threadRenamed: "Gespräch umbenannt.",
  threadPinned: "Gespräch angeheftet.",
  threadUnpinned: "Nicht mehr angeheftet.",
  addProviderKeyToUseProvider: ({ provider }) =>
    `Füge in den Einstellungen Zugangsdaten für ${provider} hinzu, bevor du diese Route nutzt.`,
  configureCredentialsBeforeVoiceSession:
    "Füge in den Einstellungen Zugangsdaten hinzu, bevor du eine Sprachsitzung startest.",
  endpointCredentialFormatInvalid: ({ provider }) =>
    `Gib für ${provider} die Basis-URL des Anbieters und den API-Schlüssel als https://dein-endpunkt.example.com|dein-api-schlüssel ein.`,
  speechRecognitionUnavailableOnDevice:
    "Spracherkennung ist auf diesem Gerät nicht verfügbar.",
  debugLogLabel: "LOG",
  debugLogCaptureStarted: "Debug-Logging gestartet.",
  debugLogCaptureStopped: ({ entryCount, fileName }) =>
    `Debug-Log als ${fileName} gespeichert und in die Zwischenablage kopiert (${entryCount} Einträge).`,
  debugLogCaptureStoppedNoClipboard: ({ entryCount, fileName }) =>
    `Debug-Log als ${fileName} gespeichert (${entryCount} Einträge).`,
  debugLogCaptureRecovered: ({ entryCount, fileName }) =>
    `Vorheriges Debug-Log ${fileName} wiederhergestellt und in die Zwischenablage kopiert (${entryCount} Einträge).`,
  debugLogCaptureRecoveredNoClipboard: ({ entryCount, fileName }) =>
    `Vorheriges Debug-Log ${fileName} wiederhergestellt (${entryCount} Einträge).`,
  debugLogCaptureFailed: "Das Debug-Log konnte nicht gespeichert werden.",
  chooseSttBeforeVoiceSession:
    "Wähle in den Einstellungen eine konfigurierte STT-Route, bevor du eine Sprachsitzung startest.",
  chooseTtsBeforeSpokenReplies:
    "Wähle in den Einstellungen eine konfigurierte TTS-Route, bevor du gesprochene Antworten nutzt.",
  stopSessionBeforeReplay:
    "Beende die laufende Sprachsitzung, bevor du die letzte Antwort erneut abspielst.",
  couldntCatchThatTryAgain:
    "Das wurde nicht richtig erkannt – versuch es noch einmal.",
  couldntStartVoiceInput: "Die Spracheingabe konnte nicht gestartet werden.",
  couldntProcessVoiceInput:
    "Die Spracheingabe konnte nicht verarbeitet werden.",
  maxRecordingLengthReached:
    "Maximale Aufnahmelänge erreicht – ich sende, was ich habe.",
  sttRecordingTooLarge: ({ provider, limit }) =>
    `Diese Aufnahme ist zu lang für die Spr-zu-Text-Funktion von ${provider} (max. ${limit}). Probier eine kürzere Nachricht oder stell Sprache-zu-Text auf Systemerkennung um.`,
  addProviderKeyToEnableProvider: ({ provider }) =>
    `Füge in den Einstellungen Zugangsdaten für ${provider} hinzu, bevor du diese Route nutzt.`,
  stopSessionBeforePreview:
    "Beende das laufende Gespräch, bevor du eine Stimme testest.",
  chooseTtsToPreviewVoices:
    "Wähle in den Einstellungen eine konfigurierte TTS-Route, um Stimmen zu testen.",
  downloadSelectedLocalVoiceFirst: ({ languageLabel }) =>
    `Lade zuerst die ausgewählte lokale Stimme für ${languageLabel} herunter.`,
  couldntPreviewVoice: "Die Stimmvorschau konnte nicht abgespielt werden.",
  spokenRepliesDisabled:
    "Gesprochene Antworten sind in den Einstellungen deaktiviert.",
  providerVoiceFallback:
    "Die konfigurierte Stimmroute ist ausgefallen. Diese Antwort nutzt jetzt eine Ersatzstimme.",
  localVoiceFallback:
    "Die lokale Stimme war nicht verfügbar. Diese Antwort nutzt jetzt eine Ersatzstimme.",
  localTtsPackInstalled: ({ languageLabel }) =>
    `Lokales Sprachpaket für ${languageLabel} installiert.`,
  localTtsPackInstallFailed:
    "Das lokale Sprachpaket konnte nicht installiert werden.",
  clear: "Leeren",
  voiceOutput: "Sprachausgabe",
  currentSetup: "Aktuelles Setup",
  listeningToYourVoice: "Ich höre dir zu",
  parsingYourVoiceInput: "Wandle deine Stimme in Text um",
  preparingRequest: "Bereite deine Anfrage vor",
  searchingTheWeb: "Suche im Web nach frischem Kontext",
  waitingForProvider: ({ provider }) => `Warte auf ${provider}`,
  preparingVoiceWithProvider: ({ provider }) =>
    `Bereite Stimme mit ${provider} vor`,
  deepThinkingReassurance: "Gute Antworten brauchen einen Moment …",
  thinkingElapsed: ({ detail, seconds }) => `${detail} · ${seconds}s`,
  speechEtaCountdown: "Geschätzte Wartezeit",
  speechEtaOvertime: "Über der Schätzung",
  phaseTimeRemaining: "Phase",
  totalTimeRemaining: "Gesamt",
  speakingBackToYou: "Antwortet dir",
  freshSession: "Neues Gespräch",
  messageCount: ({ count }) =>
    Number(count) === 1 ? "1 Nachricht" : `${count} Nachrichten`,
  speechInputRoute: ({ route }) => `Sprache rein: ${route}`,
  replyModelRoute: ({ route }) => `Antwortmodell: ${route}`,
  voiceOutputRoute: ({ route }) => `Stimme raus: ${route}`,
  fallbackVoiceOutputRoute: ({ route }) => `Fallback Stimme raus: ${route}`,
  conversation: "Gespräch",
  conversationActions: "Gesprächsaktionen",
  statusDetails: "Statusdetails",
  persistenceFailure:
    "Mr. Brokkoli konnte Daten auf diesem Gerät nicht speichern. Lass die App offen und versuch es erneut; Änderungen könnten nach einem Neustart verloren sein.",
  show: "Anzeigen",
  showTranscript: "Gespräch anzeigen",
  hide: "Ausblenden",
  copyThread: "Gespräch kopieren",
  shareThread: "Gespräch teilen",
  repeatReply: "Antwort wiederholen",
  renameThread: "Gespräch umbenennen",
  renameThreadHint:
    "Gib diesem Gespräch einen Titel, den du später schnell wiederfindest.",
  threadTitle: "Gesprächstitel",
  noTranscriptYet: "Noch kein Transkript",
  previewTranscriptEmptyDescription:
    "Beginne mit Sprache oder Text. Dein Gespräch erscheint hier.",
  noConversationYet: "Noch kein Gespräch",
  expandedTranscriptEmptyDescription:
    "Beginne mit Sprache oder Text. Schließe diesen Bildschirm, wenn du zur Hauptansicht zurückkehren willst.",
  transcriptSelectionHint:
    "Du kannst Text direkt markieren oder einzelne Nachrichten unten teilen und kopieren.",
  textMessagePlaceholder: "Nachricht schreiben",
  sendTextMessage: "Nachricht senden",
  showVoiceInput: "Spracheingabe anzeigen",
  showTextInput: "Texteingabe anzeigen",
  usageStatsHiddenDescription: "Blende Token-Schätzungen im Transkript aus.",
  usageStatsVisibleDescription:
    "Zeige geschätzte Token-Nutzung pro Antwort sowie für das gesamte Gespräch.",
  debugLogButton: "Debug-Log-Button",
  debugLogButtonHiddenDescription:
    "Blende den LOG-Button auf der Hauptseite aus, solange kein Mitschnitt läuft.",
  debugLogButtonVisibleDescription:
    "Zeige den LOG-Button auf der Hauptseite, um Debug-Mitschnitte zu starten und zu stoppen.",
  debugLogButtonUsageDescription:
    "So verwendest du den Button: Beim Einschalten beginnt die Log-Aufzeichnung. Beim Ausschalten endet sie und die aufgezeichneten Logs werden in die Zwischenablage kopiert.",
  estimatedUsageTitle: "Geschätzte Nutzung",
  estimatedUsageCounts: ({ replies, summaries }) =>
    `${replies} Antworten · ${summaries} Speicher-Updates`,
  estimatedUsageConversationScope:
    "Die Summen enthalten alle Routen und Modelle, die in diesem Gespräch verwendet wurden.",
  estimatedPromptTokens: ({ count }) => `Prompt: ${count}`,
  estimatedReplyTokens: ({ count }) => `Antwort: ${count}`,
  estimatedTotalTokens: ({ count }) => `Gesamt: ${count}`,
  estimatedUsageInline: ({ prompt, completion, total }) =>
    `Geschätzt: ${prompt} rein · ${completion} raus · ${total} gesamt`,
  searchQuery: "Suchanfrage",
  expandWebSearchDetails: "Details zur Websuche anzeigen",
  collapseWebSearchDetails: "Details zur Websuche ausblenden",
  webSearchSourceCount: ({ count }) =>
    `${count} ${Number(count) === 1 ? "Quelle" : "Quellen"}`,
  sources: "Quellen",
  openSourceLink: ({ source }) => `Quelle öffnen: ${source}`,
  turnReceipt: "Details zum Beitrag",
  expandTurnReceipt: "Details zum Beitrag anzeigen",
  collapseTurnReceipt: "Details zum Beitrag ausblenden",
  turnReceiptDirect: "Direkt",
  turnReceiptRequested: "Angeforderte Antwortroute",
  turnReceiptActual: "Tatsächliche Antwortroute",
  turnReceiptEffort: "Reasoning-Steuerung",
  turnReceiptProviderNative: "anbietereigen",
  turnReceiptInput: "Eingaberoute",
  turnReceiptSearch: "Websuche",
  turnReceiptVoice: "Sprachausgabe",
  turnReceiptContext: "Kontext",
  turnReceiptTiming: "Zeiten",
  turnReceiptFallback: "Grund für Rückfall",
  turnReceiptVoiceInput: "Sprache",
  turnReceiptTypedInput: "Getippt",
  turnReceiptSystemSpeech: "System-Spracherkennung",
  turnReceiptSystemVoice: "Systemstimme",
  turnReceiptSystemVoiceFallback: "Systemstimme · Ausweichroute",
  turnReceiptOff: "Aus",
  turnReceiptNotConfigured: "An · nicht konfiguriert",
  turnReceiptFallbackWithoutSearch: "Ohne aktuelle Websuche fortgesetzt",
  turnReceiptNotUsed: "Nicht verwendet",
  turnReceiptSummaryReused: "gespeicherte Zusammenfassung verwendet",
  turnReceiptSummaryUpdated: "Zusammenfassung aktualisiert",
  turnReceiptContextFallback: "Rückfall auf aktuelle Beiträge",
  turnReceiptGatewayCompression: ({ original, compressed }) =>
    `Gateway komprimierte ${original} auf ${compressed} Beiträge`,
  turnReceiptContextValue: ({ sent, total, summarized, state }) =>
    `${sent}/${total} frühere Beiträge gesendet · ${summarized} neu zusammengefasst${state}`,
  turnReceiptTimingStt: "STT",
  turnReceiptTimingContext: "Kontext",
  turnReceiptTimingSearch: "Suche",
  turnReceiptTimingModel: "Modell",
  turnReceiptTimingFirstSpeech: "erste Sprachausgabe",
  turnReceiptTimingTotal: "gesamt",
  estimatedRouteUsageTokensOnly: ({ tokens }) => `${tokens} Token`,
  unknownUsageRoute: "Unbekannte Route",
  setupGuideConnectProviderTitle: "Zugangsdaten konfigurieren",
  setupGuideConnectProviderDescription:
    "Füge Zugangsdaten in den Einstellungen hinzu und wähle danach die Routen aus, die du nutzen willst.",
  idle: "Bereit",
  yourConversationAppearsHere: "Hier entsteht dein Gespräch",
  defaultTranscriptEmptyDescription:
    "Beginne mit Sprache oder Text. Mr. Brokkoli behält den Verlauf und antwortet hier.",
  delete: "Löschen",
  deleteConversationConfirmationTitle: ({ title }) => `„${title}“ löschen?`,
  deleteConversationConfirmationMessage:
    "Dadurch werden das Gespräch und alle seine Nachrichten dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.",
  memory: "Speicher",
  conversations: "Gespräche",
  drawerSubtitle: "Wechsle zwischen Gesprächen oder beginne ein neues.",
  newSession: "Neue Sitzung",
  noSavedConversationsYet: "Noch keine gespeicherten Gespräche",
  drawerEmptyDescription:
    "Sprich in der Hauptansicht los. Mr. Brokkoli erstellt automatisch ein neues Gespräch.",
  setupGuideTitle: "App konfigurieren",
  setupGuideSubtitle:
    "Füge Zugangsdaten hinzu und wähle Routen in den Einstellungen.",
  fastestStartPreset: "Minimales Setup",
  fastestStartDescription:
    "Nutze Geräte-Sprache, wenn verfügbar, und konfiguriere nur die Antwortroute, die du brauchst.",
  fullVoicePreset: "Konfigurierte Stimme",
  fullVoiceDescription:
    "Nutze konfigurierte Dienste für Antworten, Transkription und Sprachausgabe, wenn du sie auswählst.",
  setupGuideNote:
    "Danach öffnen wir die Einstellungen, damit du Zugangsdaten einfügen und prüfen kannst.",
  useThisSetup: "Dieses Setup nutzen",
  notNow: "Jetzt nicht",
  setupGuideIntroTitle: "So funktioniert Mr. Brokkoli",
  setupGuideIntroBody:
    "Mr. Brokkoli startet leer. Füge Zugangsdaten für externe Dienste ein, die du bereits nutzt, und wähle danach aus, wie Antworten, Spracheingabe, Sprachausgabe und optionaler Web-Kontext geroutet werden.",
  setupGuideIntroNote:
    "Nach der Einrichtung startest und stoppst du Gespräche über die Sprachsteuerung auf der Hauptseite. Das aktuelle Gespräch bleibt dort sichtbar, und jede Route lässt sich später in den Einstellungen ändern.",
  setupGuideProviderTitle: "Zugangsdaten hinzufügen",
  setupGuideProviderBody:
    "Wähle den externen Dienst, den du konfigurieren willst, und füge Zugangsdaten mit Antwortzugriff ein.",
  setupGuideProviderPickerLabel: "Antwortdienst",
  setupGuideSelectProvider: "Anbieter auswählen",
  setupGuideSelectProviderFirst: "Wähle zuerst einen Anbieter aus.",
  setupGuideApiKeyLabel: "Zugangsdaten",
  setupGuideApiKeyPlaceholder: "Zugangsdaten einfügen",
  setupGuideContinue: "Weiter",
  setupGuideOpenSettings: "Einstellungen öffnen",
  setupGuideBack: "Zurück",
  setupGuideValidateKey: "Key prüfen",
  setupGuideApiKeyRequiredOrCancel:
    "Gib einen API-Key ein, um fortzufahren, oder brich den Einrichtungsassistenten ab.",
  setupGuideProviderAndApiKeyRequiredOrCancel:
    "Wähle einen Anbieter aus und gib einen API-Key ein, um fortzufahren, oder brich den Einrichtungsassistenten ab.",
  setupGuideProviderKeyNeedsLlmAccess: ({ provider }) =>
    `Diese Zugangsdaten für ${provider} erlauben keine Antwortanfragen.`,
  setupGuideKokoroTitle: "Natürliche Stimme auf dem Gerät",
  setupGuideKokoroBody: ({ size }) =>
    `Optional: Lade Kokoro (etwa ${size} MB) herunter, um deutlich natürlichere gesprochene Antworten ohne Sprachanbieter oder Nutzungskosten zu erhalten.`,
  setupGuideKokoroLanguageNote:
    "Dieses Modell spricht derzeit Englisch und vereinfachtes Chinesisch. Gewünschte Ausweichrouten kannst du später in den Sprachausgabe-Einstellungen konfigurieren.",
  setupGuideKokoroDownload: "Kokoro herunterladen",
  setupGuideUseKokoro: "Kokoro für gesprochene Antworten nutzen",
  setupGuideUseKokoroSummary:
    "Die Sprachsynthese bleibt auf dem Smartphone, sobald die Antwortsprache unterstützt wird.",
  setupGuideSkipKokoro: "Vorerst überspringen",
  setupGuideVoiceTestTitle: "Setup testen",
  setupGuideVoiceTestBody:
    "Sprich einen kurzen Satz. Mr. Brokkoli testet Mikrofonzugriff, Transkription, die konfigurierte Antwortroute und gesprochene Ausgabe, wenn eine brauchbare Sprachroute verfügbar ist.",
  setupGuideVoiceTestNoInputBody:
    "Spracheingabe ist mit diesem Setup nicht verfügbar. Fahr fort, um die erkannten Routen zu prüfen, und passe die Spracheinstellungen später bei Bedarf an.",
  setupGuideVoiceTestTextOnlyNote:
    "Dieser Test bleibt bei Text, weil derzeit keine brauchbare Sprachroute für gesprochene Antworten bereitsteht.",
  setupGuideVoiceTestStart: "Test starten",
  setupGuideVoiceTestStop: "Aufnahme stoppen",
  setupGuideVoiceTestRetry: "Erneut testen",
  setupGuideVoiceTestTranscribing: "Transkribiere…",
  setupGuideVoiceTestThinking: "Teste Antwort…",
  setupGuideVoiceTestSynthesizing: "Bereite Stimme vor…",
  setupGuideVoiceTestSpeaking: "Spiele Antwort ab…",
  setupGuideVoiceTestTranscript: "Transkript",
  setupGuideVoiceTestReply: "Antwort",
  setupGuideVoiceTestReset: "Dieses Ergebnis löschen",
  setupGuideVoiceInputUnavailable:
    "Spracheingabe ist für dieses Setup auf diesem Gerät nicht verfügbar.",
  setupGuideSummaryTitle: "Setup abgeschlossen",
  setupGuideSummaryBody:
    "Das ist die Route, die Mr. Brokkoli mit deiner aktuellen Konfiguration verwendet.",
  setupGuideSummaryLlm: "LLM",
  setupGuideSummaryStt: "Sprache zu Text",
  setupGuideSummaryTts: "Text zu Sprache",
  setupGuideSummaryWebSearch: "Websuche",
  setupGuideRouteProviderLlm: ({ provider }) => `Aktiv über ${provider}`,
  setupGuideRouteOnDeviceStt:
    "Aktiv über die Spracherkennung des Betriebssystems",
  setupGuideRouteProviderStt: ({ provider }) =>
    `Aktiv über ${provider}-Transkription`,
  setupGuideRouteProviderTts: ({ provider }) => `Aktiv über ${provider}-Stimme`,
  setupGuideRouteKokoroTts: "Aktiv über Kokoro auf dem Gerät",
  setupGuideRouteLocalTts: "Aktiv über lokales Sprachpaket",
  setupGuideRouteUnavailable: "Nicht verfügbar",
  setupGuideRouteOff: "Aus",
  setupGuideWebSearchAvailableOff: ({ provider }) =>
    `Über ${provider} verfügbar, derzeit aus`,
  setupGuideSummaryTextOnlyNote:
    "Gesprochene Antworten sind vorerst aus. Antworten bleiben als Text, bis du eine Anbieter- oder lokale Stimme aktivierst.",
  setupGuideFinish: "Fertig",
  searchConversationsPlaceholder:
    "Suche nach Titeln, Modellen und Nachrichtentext",
  noMatchingConversations: "Keine passenden Gespräche",
  noMatchingConversationsDescription:
    "Versuch es mit einem anderen Titel, einer anderen Route, einem Modell oder einem Satz aus dem Transkript.",
  memoryModalTitle: "Gesprächsspeicher",
  memoryModalDescription:
    "Das ist die kompakte Zusammenfassung, die Mr. Brokkoli weiterträgt, sobald ein Gespräch lang genug wird und ältere Beiträge zusammengefasst werden.",
  memorySummary: "Gespeicherte Zusammenfassung",
  memorySummaryEmpty:
    "Noch kein kompakter Speicher. Sobald dieses Gespräch länger wird, werden ältere Beiträge hier zusammengefasst.",
  summarizedTurnsCount: ({ count }) =>
    Number(count) === 1
      ? "1 zusammengefasster Beitrag"
      : `${count} zusammengefasste Beiträge`,
  copyMemory: "Speicher kopieren",
  forgetMemory: "Speicher vergessen",
  memoryCopied: "Speicher kopiert.",
  memoryCleared: "Speicher gelöscht.",
  noConversationToManageYet: "Noch kein Speicher verfügbar.",
  noProviderYet: "Noch kein Anbieter",
  noModelYet: "Noch kein Modell",
  startedAt: "Begonnen",
  endedAt: "Beendet",
  pinned: "Angeheftet",
  copy: "Kopieren",
  share: "Teilen",
  rename: "Umbenennen",
  pin: "Anheften",
  unpin: "Entheften",
  save: "Speichern",
  cancel: "Abbrechen",
  stop: "Stopp",
  pause: "Pause",
  resume: "Fortsetzen",
  paused: "Pausiert",
  listening: "Hört zu",
  parsing: "Transkribiere",
  webSearchAction: "Websuche",
  thinking: "Denkt nach",
  speaking: "Spricht",
  speechPaused: "Sprachausgabe ist pausiert",
  pausePlaybackUnavailable:
    "Diese Sprachroute kann nicht pausiert werden. Stoppe sie oder wechsle zur Anbieter-Sprachausgabe.",
  holdToSpeak: "Zum Sprechen gedrückt halten",
  tapToSpeak: "Zum Sprechen tippen",
  tapAgainToSend: "Zum Senden erneut tippen",
  waitingForReply: "Warte auf Antwort",
  parsingYourVoice: "Sprache wird verarbeitet",
  providerConfiguredInSettings: ({ provider }) =>
    `${provider} ist in den Einstellungen nicht konfiguriert.`,
  providerNetworkError: ({ provider, action }) =>
    `${provider} war für ${action} nicht erreichbar. Prüfe die Verbindung und versuch es erneut.`,
  providerAuthError: ({ provider, action }) =>
    `${provider} hat die Zugangsdaten für ${action} abgelehnt. Prüfe API-Schlüssel und Berechtigungen.`,
  providerRateLimitError: ({ provider, action }) =>
    `${provider} drosselt ${action} gerade. Versuch es gleich noch einmal.`,
  providerCreditsRequired: ({ provider, action }) =>
    `${provider} benötigt ausreichend API-Guthaben für ${action}. Prüfe den Kontostand und das Ausgabenlimit des Keys.`,
  providerTimeoutError: ({ provider, action }) =>
    `${provider} hat für ${action} zu lange gebraucht. Versuch es erneut.`,
  providerTemporaryError: ({ provider, action }) =>
    `${provider} hatte während ${action} ein vorübergehendes Problem. Versuch es in Kürze erneut.`,
  providerEmptyReplyError: ({ provider }) =>
    `${provider} hat beendet, ohne eine Antwort zurückzugeben. Versuch es erneut.`,
  providerIncompleteReplyError: ({ provider }) =>
    `${provider} hat die Antwort vorzeitig beendet. Versuch es erneut.`,
  providerContextTooLong: ({ provider }) =>
    `${provider} hat die Antwort abgelehnt, weil das Gespräch zu lang geworden ist. Starte ein neues Gespräch oder kürze die Anfrage.`,
  providerRequestRejected: ({ provider, action, detail }) =>
    detail
      ? `${provider} hat die Anfrage für ${action} abgelehnt: ${detail}`
      : `${provider} hat die Anfrage für ${action} abgelehnt.`,
  providerWebSearchNotRun: ({ provider }) =>
    `${provider} hat eine Antwort zurückgegeben, ohne die Websuche auszuführen.`,
  providerValidationSuccess: ({ provider }) => `${provider} ist einsatzbereit.`,
  providerCapabilityValidationSuccess: ({ provider, capability }) =>
    `${provider}: ${capability} funktioniert.`,
  providerValidationFailed: "Anbieter-Prüfung fehlgeschlagen.",
  webSearchFallback:
    "Die Websuche war nicht verfügbar. Die Antwort lief ohne frischen Web-Kontext weiter.",
  noBase64EncoderAvailable: "Kein Base64-Encoder verfügbar.",
  noBase64DecoderAvailable: "Kein Base64-Decoder verfügbar.",
  azureSpeechApiKeyFormat:
    "Microsoft Azure TTS benötigt Azure-Speech-Zugangsdaten im Format <Schlüssel>|<Region>, zum Beispiel abc123|westeurope, oder das kombinierte Azure-Format <Endpunkt>|<API-Schlüssel>|<Schlüssel>|<Region>.",
  googleCloudSpeechCredentialFormat: ({ provider }) =>
    `${provider} STT benötigt Google-Cloud-Speech-Zugangsdaten im Format <Projekt-ID>|<Access-Token>|<Location>, oder das kombinierte Gemini-Format <Gemini-API-Schlüssel>|<Projekt-ID>|<Access-Token>|<Location>.`,
  bytedanceSpeechCredentialFormat: ({ provider }) =>
    `${provider} STT benötigt Doubao-Speech-Zugangsdaten im Format <App-Key>|<Access-Key>, optional <App-Key>|<Access-Key>|<Resource-Id>, oder im kombinierten Format <Ark-API-Key>|<App-Key>|<Access-Key>|<Resource-Id>.`,
  nativeTtsDoesNotSynthesizeAudioFiles:
    "Native TTS erzeugt keine Audiodateien.",
  localTtsUnavailableForLanguage: ({ languageLabel }) =>
    `Für ${languageLabel} ist aktuell weder lokal noch in der Cloud eine Sprachroute bereit.`,
  chooseTextToSpeechProviderInSettings:
    "Wähle in den Einstellungen einen TTS-Anbieter.",
  ttsNotSupportedYet: ({ provider }) =>
    `TTS wird für ${provider} noch nicht unterstützt.`,
  ttsError: ({ provider, status, errorText }) =>
    `TTS-Fehler bei ${provider} (${status}): ${errorText}`,
  ttsReplyTooLong: ({ provider }) =>
    `${provider} hat die Sprachausgabe abgelehnt, weil die Antwort zu lang war.`,
  ttsTimeout: ({ provider }) =>
    `Die Sprachausgabe bei ${provider} hat zu lange gedauert.`,
  sttTimeout: ({ provider }) =>
    `Die Sprachtranskription bei ${provider} hat zu lange gedauert.`,
  sttFileSizeLimitExceeded: ({ provider, model, limit }) =>
    `${provider} ${model} akzeptiert nur Aufnahmen bis ${limit}. Nutze einen kürzeren Clip oder wechsle das STT-Modell.`,
  voiceInputCaptureIncomplete:
    "Die Spracheingabe konnte nicht sauber aufgenommen werden. Bitte versuch es noch einmal.",
  ttsDidNotReturnAudio: ({ provider }) =>
    `${provider} hat kein Audio zurückgegeben.`,
  nativeSttHandledInApp: "System-STT wird direkt in der App verarbeitet.",
  chooseSpeechToTextProviderInSettings:
    "Wähle in den Einstellungen einen STT-Anbieter.",
  sttNotSupportedYet: ({ provider }) =>
    `STT wird für ${provider} noch nicht unterstützt.`,
  providerNotWiredUpYet: ({ provider }) =>
    `${provider} ist noch nicht angebunden.`,
  you: "Du",
  assistant: "Assistent",
  untitledConversation: "Unbenanntes Gespräch",
  conversationExportHeader: ({ title }) => `Gespräch: ${title}`,
  speechRecognitionPermissionNotGranted:
    "Berechtigung für Spracherkennung wurde nicht erteilt.",
  speechRecognitionUnavailableForDeviceLanguage:
    "Spracherkennung ist für die aktuelle Gerätesprache nicht verfügbar.",
  nativeSpeechRecognitionNeedsNetwork:
    "Die native Spracherkennung benötigt gerade eine Netzwerkverbindung.",
  noSpeechDetected: "Es wurde keine Sprache erkannt.",
  nativeSpeechRecognitionFailed:
    "Die native Spracherkennung ist fehlgeschlagen.",
  couldntStartNativeSpeechRecognition:
    "Die native Spracherkennung konnte nicht gestartet werden.",
  microphonePermissionNotGranted:
    "Berechtigung für das Mikrofon wurde nicht erteilt",
};
