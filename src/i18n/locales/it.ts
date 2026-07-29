import type { TranslationDictionary } from "../types";

export const it = {
  appName: "Sig. Broccoli",
  retry: "Riprova",
  dismiss: "Chiudi",
  done: "Fatto",
  aboutSetting: ({ setting }) => `Informazioni su ${setting}`,
  unavailable: "Non disponibile",
  selection: "Selezione",
  chooseCompatibleProviderFirst: "Scegli prima un fornitore compatibile",
  settings: "Impostazioni",
  all: "Tutti",
  firstRun: "Primo avvio",
  instructions: "Istruzioni",
  providers: "Fornitori",
  webSearch: "Ricerca sul Web",
  stt: "STT",
  tts: "TTS",
  ui: "UI",
  settingsRuntimeReadiness: "Disponibilità di runtime",
  settingsReadinessThink: "Pensare",
  settingsReadinessListen: "Ascoltare",
  settingsReadinessSpeak: "Parlare",
  settingsReadinessSearch: "Ricerca",
  settingsReadinessReady: "Pronto",
  settingsReadinessNeedsAttention: "Attenzione",
  settingsReadinessBroken: "Rotto",
  settingsReadinessOff: "Spento",
  settingsConnections: "Connessioni",
  settingsThinking: "Pensiero",
  settingsListening: "Ascolto",
  settingsSpeaking: "A proposito di",
  settingsSearch: "Ricerca",
  settingsAppDiagnostics: "App e diagnostica",
  settingsGuidedSetup: "Configurazione guidata",
  settingsGuidedSetupSummary:
    "Rivedi le connessioni e testa il percorso vocale completo.",
  setupGuideShowInSettings: "Mostra la configurazione guidata in Impostazioni",
  setupGuideShowInSettingsSummary:
    "Mostra o nascondi il collegamento alla configurazione guidata nella panoramica Impostazioni.",
  settingsConnectionsSummary: "Chiavi del provider, convalida e funzionalità.",
  settingsThinkingSummary: "Schede domestiche, modelli, impegno e prompt del sistema.",
  settingsListeningSummary: "Modalità di input e routing da voce a testo.",
  settingsSpeakingSummary: "Risposte parlate, riproduzione, voci e anteprime.",
  settingsSearchSummary: "Provider di ricerca Web e controlli di qualità della ricerca.",
  settingsAppDiagnosticsSummary:
    "Tema, lingua, utilizzo, log di debug e attività recente.",
  settingsBackToOverview: "Torna alla panoramica",
  settingsOpenSection: ({ section }) => `Apri ${section}`,
  theme: "Tema",
  language: "Lingua",
  recognitionLanguage: "Lingua di riconoscimento",
  recognitionLanguageHint:
    "Scegli una lingua per migliorare il riconoscimento oppure lascia che il dispositivo o il fornitore la rilevi automaticamente.",
  automaticLanguage: "Automatica",
  speechLanguageUnsupportedByProvider: ({ provider, language }) =>
    `${provider} non supporta ufficialmente ${language} per questo percorso vocale.`,
  usageStats: "Statistiche di utilizzo",
  model: "Modello",
  effort: "Sforzo",
  effortValue: ({ effort }) => `Sforzo: ${effort}`,
  modelEffortNone: "Nessuno",
  modelEffortMinimal: "Minimo",
  modelEffortLow: "Basso",
  modelEffortMedium: "Medio",
  modelEffortHigh: "Alto",
  modelEffortExtraHigh: "Molto alto",
  modelEffortMax: "Massimo",
  modelEffortDynamic: "Dinamico",
  modelEffortDisabled: "Disattivato",
  modelEffortEnabled: "Attivato",
  fixed: "Fisso",
  english: "Inglese",
  german: "tedesco",
  ukrainian: "ucraino",
  hindi: "hindi",
  spanish: "spagnolo",
  french: "francese",
  italian: "Italiano",
  portuguese: "Portoghese",
  portugueseBrazil: "Portoghese (Brasile)",
  russian: "Russo",
  simplifiedChinese: "Cinese semplificato",
  arabic: "Arabo",
  japanese: "Giapponese",
  hungarian: "Ungherese",
  czech: "Ceco",
  polish: "Polacco",
  turkish: "Turco",
  swedish: "Svedese",
  urdu: "Urdu",
  kokoroAmericanFemaleVoice: ({ name }) =>
    `${name} · inglese americano, voce femminile`,
  kokoroBritishFemaleVoice: ({ name }) =>
    `${name} · inglese britannico, voce femminile`,
  kokoroChineseFemaleVoice: ({ index }) => `Cinese, voce femminile ${index}`,
  kokoroChineseMaleVoice: ({ index }) => `Cinese, voce maschile ${index}`,
  light: "Chiaro",
  dark: "Scuro",
  system: "Sistema",
  languageCoverage: ({ note }) => `Copertura linguistica: ${note}`,
  recordingLimits: ({ note }) => `Limiti di registrazione: ${note}`,
  catalogProviderPricingSummary: ({ summary }) => `Prezzi: ${summary}`,
  replyGenerationAction: "generazione della risposta",
  speechTranscriptionAction: "trascrizione del discorso",
  instructionsTabDescription:
    "Dai forma alla guida nascosta che guida l'assistente prima che qualsiasi fornitore veda la richiesta.",
  providersTabDescription:
    "Archivia le credenziali del servizio esterno sul dispositivo e configura le modalità di risposta che desideri utilizzare.",
  webSearchTabDescription:
    "Configura il contesto web live opzionale prima delle risposte.",
  responseModes: "Selezione del modello",
  aboutModelSelection: "Informazioni sulla selezione del modello",
  modelSelectionInfo:
    "Ogni scheda modello diventa una scelta nella schermata iniziale. Configura il fornitore, il modello e il livello di impegno opzionale, quindi cambia le carte per scegliere quale modello risponderà successivamente.",
  responseModeItemTitle: ({ index }) => `Modello ${index}`,
  addResponseMode: "Aggiungi modello",
  removeResponseMode: "Rimuovi il modello",
  responseModesNoConfiguredProviders:
    "Aggiungi prima le credenziali. I controlli del percorso rimangono nascosti finché non viene configurato almeno un servizio compatibile.",
  useResponseMode: ({ mode }) => `Utilizzare ${mode}`,
  chooseResponseModel: "Scegli un modello",
  responseModelCount: ({ count }) => `Modelli ${count} disponibili`,
  sttTabDescription:
    "Controlla come viene catturato il parlato e quale backend trasforma l'audio in testo prima che raggiunga il modello.",
  ttsTabDescription:
    "Controlla quando le risposte iniziano a essere pronunciate e quale backend gestisce l'output parlato.",
  brief: "Breve",
  briefDescription:
    "Tieni la risposta stretta. Utilizza il numero minimo di frasi necessarie per rispondere in modo completo all'utente.",
  normal: "Normale",
  normalDescription:
    "Obiettivo per una lunghezza di risposta equilibrata. Copri i punti importanti senza trascinare fuori la risposta.",
  thorough: "Completo",
  thoroughDescription:
    "Vai in profondità e sii esaustivo. Includi sfumature, dettagli, compromessi e il ragionamento che conta.",
  professional: "Professionale",
  professionalDescription:
    "Parla come un consulente senior che informa un cliente. Linguaggio preciso, senza slang, misurato e autorevole.",
  casual: "Casuale",
  casualDescription:
    "Parla come un amico intelligente in un bar. Rilassato, naturale, colloquiale. Le contrazioni vanno bene, le tangenti vanno bene.",
  nerdy: "Nerd",
  nerdyDescription:
    "Parla come un esperto entusiasta che ama andare in profondità. Usa liberamente la terminologia tecnica, informati sui dettagli e presumi che l'utente possa tenere il passo.",
  concise: "Conciso",
  conciseDescription:
    "Sii il più breve possibile pur essendo completo. Nessun preambolo, nessun riempitivo, solo la risposta. Pensa allo stile telegramma.",
  socratic: "Socratico",
  socraticDescription:
    "Sfida il pensiero dell'utente. Fai contro-domande, offri prospettive alternative, non limitarti a confermare ciò che hanno detto. Sii uno sparring partner, non una macchina del sì.",
  eli5: "ELI5",
  eli5Description:
    "Spiega tutto nel modo più semplice possibile. Usa analogie, linguaggio quotidiano, zero gergo. Non presupporre alcuna conoscenza preliminare su alcun argomento.",
  useProvider: ({ provider }) => `Utilizzare ${provider}`,
  createApiKey: "Credenziali",
  apiKey: "Tasto API",
  aboutThisProvider: "Informazioni su questo fornitore",
  openRouterOnboardingTitle: "Una chiave, più fornitori",
  openRouterOnboardingDescription:
    "Crea una chiave OpenRouter dedicata, incollala di seguito e utilizza modelli supportati da snapshot di diversi provider senza sostituire alcuna connessione diretta.",
  openRouterOnboardingRoute:
    "Percorso richiesta: questo dispositivo → OpenRouter → provider upstream selezionato",
  openRouterKeys: "Tasti OpenRouter",
  providerStatusInvalid: "Non valido",
  providerStatusTesting: "Test",
  providerStatusConfigured: "Configurato",
  providerStatusWorking: "Lavorando",
  providerStatusNotTested: "Non testato",
  providerStatusNotSetup: "Non impostato",
  expandProvider: ({ provider }) => `Espandi ${provider}`,
  collapseProvider: ({ provider }) => `Comprimi ${provider}`,
  testProviderKey: "Chiave di prova",
  testAllCapabilities: "Prova tutto",
  apiTest: "Prova API",
  testProviderCapability: ({ capability }) => `Prova ${capability}`,
  test: "Test",
  optional: "Opzionale",
  providerCapability_llm: "Risposte",
  providerCapability_stt: "Ingresso vocale",
  providerCapability_tts: "Uscita vocale",
  providerCapability_search: "Ricerca sul Web",
  providerCapability_voices: "Libreria vocale",
  providerValidationUnavailable:
    "La convalida in tempo reale non è ancora stata cablata per questo provider. Salvare la chiave qui e verificarla durante l'uso effettivo.",
  providerNeedsAttention: "ha bisogno di attenzione",
  catalogProviderLimitsSummary: ({ summary }) => `Limiti: ${summary}`,
  catalogProviderRegionSummary: ({ summary }) => `Regione: ${summary}`,
  validatingKey: "Convalida...",
  showKey: "Mostra chiave",
  hideKey: "Nascondi chiave",
  assistantInstructions: "Istruzioni dell'assistente",
  systemPrompt: "Richiesta di sistema",
  aboutSystemPrompt: "Informazioni sul prompt del sistema",
  assistantInstructionsIntro:
    "Dai forma alla guida nascosta che il modello riceve prima di ogni risposta.",
  baseInstructions: "Istruzioni di base",
  assistantInstructionsPlaceholder: "Definire come dovrebbe comportarsi l'assistente.",
  assistantInstructionsHint:
    "Questo è sempre anteposto alla lunghezza e al tono della risposta selezionati.",
  adaptiveLength: "Lunghezza adattiva",
  responseTone: "Tono di risposta",
  homeStyleChipLabel: ({ tone, length }) => `Stile — ${tone} · ${length}`,
  styleSheetTitle: "Impostazioni di conversazione",
  styleSheetSubtitle: "Formula risposte e discorsi solo per questa conversazione.",
  openStyleSheet: "Apri le impostazioni della conversazione",
  conversationThinkingInstructions: "Istruzioni per pensare",
  conversationThinkingInstructionsDescription:
    "Aggiungi istruzioni dopo la richiesta del sistema globale per questa conversazione.",
  conversationThinkingInstructionsPlaceholder:
    "Ad esempio: sfida le mie supposizioni e utilizza esempi concreti.",
  ttsInstructions: "Istruzioni per la consegna del parlato",
  ttsInstructionsDescription:
    "Guida il tono, il ritmo, l'accento o la pronuncia utilizzati dai modelli vocali compatibili.",
  conversationTtsInstructionsDescription:
    "Aggiungi le istruzioni di consegna dopo le istruzioni vocali globali per questa conversazione.",
  ttsInstructionsPlaceholder:
    "Ad esempio: parla in modo caloroso, chiaro e ad un ritmo rilassato.",
  ttsInstructionsUnsupported:
    "Il percorso vocale corrente non supporta le istruzioni di consegna.",
  conversationVoiceDescription: ({ route }) =>
    `Scegli la voce utilizzata da ${route} in questa conversazione.`,
  scrollToLatest: "Scorri fino all'ultimo messaggio",
  conversationTitleGenerate: "Titolo generato automaticamente",
  conversationTitleGenerating: "Generazione titolo…",
  conversationTitleGenerated: "Conversazione rinominata.",
  conversationTitleNeedsContent:
    "Inizia una conversazione prima di generare un titolo.",
  conversationTitleNeedsProvider:
    "Configura il modello selezionato prima di generare un titolo.",
  conversationTitleGenerationFailed: "Impossibile generare un titolo di conversazione.",
  conversationTitleGenerationTimedOut:
    "La generazione del titolo ha richiesto troppo tempo. Per favore riprova.",
  inputMode: "Modalità di ingresso",
  voiceInput: "Ingresso vocale",
  pushToTalk: "Premi per parlare",
  pushToTalkDescription:
    "Tieni premuto il pulsante principale mentre parli, quindi rilascialo per inviare.",
  toggleToTalk: "Attiva/disattiva per parlare",
  toggleToTalkDescription:
    "Tocca una volta per avviare la registrazione e tocca di nuovo quando hai finito.",
  driveSession: "Sessione di guida",
  driveSessionDescription:
    "Quando la continuazione automatica è attiva, la registrazione inizia dopo ogni risposta parlata. Tocca il pulsante principale quando hai finito di parlare.",
  stopDriveSession: "Pausa automatica",
  repeatDriveReply: "Ripeti per ultimo",
  continueDriveSession: "Riprendi automatico",
  speechToText: "Discorso al testo",
  appNative: "Riconoscimento del sistema",
  nativeSttDescription:
    "Utilizzare il riconoscimento vocale del sistema operativo. A seconda delle impostazioni del dispositivo, il riconoscimento può essere eseguito sul dispositivo o tramite il servizio di sistema. Non è richiesta alcuna chiave del provider.",
  provider: "Fornitore",
  webSearchProvider: "Fornitore di ricerca Web",
  webSearchProviderMissingHint:
    "Configura almeno un servizio con funzionalità di ricerca in Credenziali per abilitare il web grounding qui.",
  webSearchModelHint: ({ model }) =>
    `Utilizza ${model} dietro le quinte per la messa a terra del web in tempo reale.`,
  webSearchHomeHint:
    "Utilizza l'interruttore della schermata iniziale per attivare o disattivare il web grounding per questo thread.",
  settingsWebSearchCompactHint:
    "Facoltativamente, anteponi un nuovo contesto web prima che il modello principale risponda.",
  webSearchAdvanced: "Controlli di ricerca avanzata",
  expandAdvancedSearch: "Espandi i controlli di ricerca avanzati",
  collapseAdvancedSearch: "Comprimi i controlli di ricerca avanzata",
  webSearchSetupNeeded: "Aggiungi credenziali per utilizzare la ricerca web in tempo reale.",
  webSearchEnabledDescription:
    "Un nuovo contesto web viene aggiunto prima che il modello risponda.",
  webSearchDisabledDescription:
    "Utilizza il contesto web live per questo thread quando i fatti attuali contano.",
  webSearchQualityControls: "Ricerca di qualità",
  webSearchSearchMode: "Modalità di ricerca",
  webSearchSearchModeQuick: "Presto",
  webSearchSearchModeBalanced: "Equilibrato",
  webSearchSearchModeDeep: "Profondo",
  webSearchDepth: "Profondità di ricerca",
  webSearchDepthStandard: "Standard",
  webSearchDepthDeep: "Profondo",
  webSearchResultCount: "Conteggio dei risultati",
  webSearchQualityHint: ({ provider }) =>
    `Questi controlli ottimizzano il modo in cui ${provider} raccoglie nuovo contesto prima della risposta.`,
  webSearchNoExtraControls: ({ provider }) =>
    `${provider} non espone ancora controlli aggiuntivi sulla qualità della ricerca in questa app.`,
  setWebSearchMode: ({ mode }) => `Imposta la modalità di ricerca web su ${mode}`,
  openWebSearchSettings: "Apri le impostazioni di ricerca web",
  providerSttDescription:
    "Utilizza un servizio esterno configurato per trascrivere la tua voce prima che venga inviata al percorso di risposta.",
  sttProvider: "Fornitore STT",
  sttProviderEnabledHint:
    "Qui vengono visualizzati solo i fornitori abilitati con supporto per la trascrizione.",
  sttProviderMissingHint:
    "Aggiungi le credenziali per un servizio con supporto STT per sceglierlo qui.",
  nativeSttHint:
    "Il riconoscimento del sistema funziona indipendentemente dalle chiavi del tuo provider e può essere elaborato sul dispositivo o dal servizio vocale del sistema operativo.",
  replyPlayback: "Riproduzione della risposta",
  sentencesArrive: "Arrivano i paragrafi",
  sentencesArriveDescription:
    "Inizia a parlare non appena è pronto un paragrafo completo.",
  fullReplyFirst: "Prima la risposta completa",
  fullReplyFirstDescription:
    "Genera prima l'intera risposta, quindi riproducila in un unico passaggio.",
  textToSpeech: "Sintesi vocale da testo",
  spokenReplies: "Risposte parlate",
  spokenRepliesEnabledDescription:
    "Leggi ad alta voce le risposte dell'assistente quando è disponibile un percorso vocale.",
  spokenRepliesDisabledDescription:
    "Per il momento mantieni le risposte solo tramite testo. Il tuo percorso TTS preferito rimane salvato per dopo.",
  nativeTtsDescription:
    "Utilizza il motore vocale del dispositivo per le risposte vocali e l'anteprima vocale.",
  kokoroTtsDescription:
    "Usa una voce neurale molto più naturale interamente su questo dispositivo. Il testo della risposta vocale viene sintetizzato localmente, senza chiave del fornitore di servizi vocali o costi di utilizzo.",
  kokoroVoices: "Kokoro Voci sul dispositivo",
  kokoroVoicesHint: ({ size, installedSize }) =>
    `Il modello multilingue scarica circa ${size} MB e occupa circa ${installedSize} MB dopo l'installazione.`,
  kokoroModel: "Modello multilingue Kokoro",
  kokoroChecking: "Verifica del modello sul dispositivo…",
  kokoroDownloading: ({ progress }) => `Download in corso… ${progress}%`,
  kokoroExtracting: ({ progress }) => `Installazione… ${progress}%`,
  kokoroVerifying: "Verifica del motore vocale…",
  kokoroInstalled: "Installato e pronto su questo dispositivo.",
  kokoroNotInstalled: "Download facoltativo. Nessuna chiave del provider richiesta.",
  kokoroLanguageFallback:
    "Kokoro attualmente parla inglese e cinese semplificato qui. Per le altre lingue di risposta selezionate, aggiungi un percorso di fallback esplicito altrimenti la sintesi vocale si interromperà con un errore.",
  kokoroRemoveTitle: "Rimuovere il modello Kokoro?",
  kokoroRemoveBody: ({ installedSize }) =>
    `Questo libera circa ${installedSize} MB. Puoi scaricare nuovamente il modello in qualsiasi momento.`,
  removeKokoroModel: "Rimuovere il modello Kokoro",
  downloadKokoroModel: "Scarica il modello Kokoro",
  kokoroFallbackNeeded: ({ languages }) =>
    `È richiesta una route di fallback esplicita per: ${languages}.`,
  kokoroNoSelectedLanguages:
    "Seleziona inglese o cinese semplificato in Ascolta lingue per configurare una voce Kokoro.",
  expandVoiceSettings: ({ language }) => `Espandi le impostazioni vocali ${language}`,
  collapseVoiceSettings: ({ language }) =>
    `Comprimi le impostazioni vocali ${language}`,
  remove: "Rimuovere",
  voiceOutputDescription:
    "Scegli il motore vocale, le lingue di ascolto e le anteprime vocali per le risposte vocali.",
  localTts: "Locale",
  localTtsDescription:
    "Utilizza una voce locale scaricata corrispondente per le risposte vocali.",
  providerTtsDescription:
    "Utilizza il servizio configurato selezionato per le risposte vocali.",
  ttsFallbackRoutes: "Percorsi di ripiego",
  ttsFallbackRoutesHint:
    "Opzionale. Aggiungi solo i percorsi che desideri, nell'ordine in cui dovrebbero essere provati. Una volta che un percorso inizia a parlare, Sig. Broccoli rimane su di esso per il resto della risposta.",
  ttsFallbackNone:
    "Non è configurato alcun fallback. Verrà invece mostrato un errore vocale.",
  ttsFallbackPosition: ({ position, route }) => `${position}. ${route}`,
  addFallbackRoute: ({ route }) => `Aggiungi il fallback ${route}`,
  removeFallbackRoute: ({ route }) => `Rimuovere il fallback ${route}`,
  moveFallbackEarlier: ({ route }) => `Sposta ${route} prima`,
  moveFallbackLater: ({ route }) => `Sposta ${route} più tardi`,
  ttsProvider: "Fornitore TTS",
  ttsProviderEnabledHint:
    "Qui vengono visualizzati solo i fornitori abilitati con il supporto della risposta vocale.",
  ttsProviderMissingHint:
    "Aggiungi le credenziali per un servizio con supporto TTS per sceglierlo qui.",
  localTtsOrderHint:
    "Vengono tentati solo i percorsi di fallback esplicitamente configurati.",
  providerTtsOrderHint:
    "Vengono tentati solo i percorsi di fallback esplicitamente configurati.",
  nativeTtsHint:
    "TTS nativo utilizza lo stack vocale del sistema e non richiede una chiave del provider.",
  localTtsLanguageCoverageHint:
    "I pacchetti locali attualmente coprono inglese, tedesco, cinese semplificato, spagnolo, portoghese, hindi, francese e italiano.",
  ttsVoice: "TTS Voce",
  refresh: "Aggiorna",
  providerVoiceDirectory: ({ provider }) => `Libreria vocale ${provider}`,
  refreshProviderVoices: ({ provider }) => `Aggiorna le voci ${provider}`,
  providerVoicesAvailable: ({ count, provider }) =>
    `${count} ${Number(count) === 1 ? "voce" : "voci"} disponibile da ${provider}.`,
  providerVoicesLoadFailed:
    "Impossibile aggiornare le voci. La tua selezione attuale è invariata; puoi comunque inserire manualmente un ID vocale.",
  providerVoicesLoadFailedWithFallback:
    "Impossibile caricare le voci dell'account. La voce integrata rimane disponibile.",
  providerVoicesErrorDetail: ({ detail }) => `Motivo: ${detail}`,
  elevenLabsVoicesReadPermissionHint:
    "In ElevenLabs, modifica questo tasto API e abilita Voci → Leggi, quindi aggiorna qui.",
  providerVoicesLoadingHint: ({ provider }) =>
    `Sig. Broccoli carica automaticamente le voci disponibili da ${provider}.`,
  providerVoiceId: "ID vocale",
  providerVoiceIdPlaceholder: "Inserisci un ID vocale",
  providerVoiceIdFallbackHint:
    "L'immissione manuale rimane disponibile quando non è possibile caricare la libreria vocale.",
  providerVoiceIdRequired: ({ provider }) =>
    `Aggiorna la libreria vocale ${provider} o inserisci un ID vocale prima di utilizzare l'output vocale.`,
  qwenSpeechUnavailableInUs:
    "Gli attuali percorsi vocali Qwen di Sig. Broccoli non sono disponibili nella regione degli Stati Uniti. Scegli Singapore o Pechino per il discorso Qwen.",
  qwenApiRegion: "Qwen API Regione",
  qwenRegionSingapore: "Singapore",
  qwenRegionUs: "Stati Uniti (Virginia)",
  qwenRegionBeijing: "Cina (Pechino)",
  qwenRegionHint:
    "La regione selezionata deve corrispondere alla regione in cui è stata creata questa chiave API.",
  qwenRegionUsSpeechHint:
    "Le chiavi per la regione degli Stati Uniti supportano la chat e la ricerca web qui. Le attuali rotte Sig. Broccoli Qwen STT e TTS richiedono una chiave Singapore o Pechino.",
  providerDefaultVoiceHint:
    "Questo fornitore attualmente utilizza la sua voce predefinita per l'anteprima e le risposte vocali.",
  listenLanguages: "Ascolta Lingue",
  listenLanguagesHint:
    "Scegli le lingue di risposta in cui vuoi che suoni bene. Sig. Broccoli li prova in questo ordine durante l'instradamento dell'output vocale.",
  listenLanguagesSelected: ({ count }) =>
    count === 1 ? "1 lingua selezionata" : `${count} lingue selezionate`,
  localVoicePacks: "Pacchetti vocali locali",
  localVoicePacksHint:
    "Ogni lingua mantiene la propria voce locale. Scegli la voce che desideri per quella lingua, quindi scarica solo i pacchetti che ti interessano davvero.",
  localVoiceForLanguage: ({ languageLabel }) => `Voce per ${languageLabel}`,
  providerVoicePreviews: "Anteprime vocali del fornitore",
  providerVoicePreviewsHint:
    "Testa qui il percorso TTS attualmente selezionato con un testo di anteprima separato per ciascuna lingua di risposta.",
  nativeVoicePreviewSection: "Anteprima della voce nativa",
  nativeVoicePreviewSectionHint:
    "Questo parla direttamente attraverso il sintetizzatore vocale integrato nel telefono in modo da poterlo confrontare con le voci del provider configurate.",
  nativeVoiceUnavailable:
    "Questo dispositivo non ha segnalato alcuna voce di sistema nativa per l'anteprima.",
  speechDiagnostics: "Attività vocale recente",
  speechDiagnosticsHint:
    "Mostra le ultime richieste vocali, il percorso richiesto, il percorso effettivamente utilizzato e qualsiasi motivo di fallback.",
  clearSpeechDiagnostics: "Cancella l'attività vocale recente",
  speechDiagnosticsEmpty:
    "Nessuna richiesta di intervento recente ancora. Visualizza l'anteprima di una voce o riproduci una risposta per vedere i dettagli del routing qui.",
  clearSpeechDiagnosticsConfirmationTitle: "Cancellare l'attività vocale recente?",
  clearSpeechDiagnosticsConfirmationMessage:
    "Questa operazione rimuove tutta la diagnostica di routing vocale acquisita. Questa azione non può essere annullata.",
  speechDiagnosticSourceConversation: "Risposta alla conversazione",
  speechDiagnosticSourceRepeat: "Ripeti la risposta",
  speechDiagnosticSourcePreview: "Anteprima vocale",
  speechDiagnosticSourceUnknown: "Richiesta di discorso",
  speechDiagnosticRouteLine: ({ requested, actual }) =>
    `Richiesto: ${requested} -> Effettivo: ${actual}`,
  speechDiagnosticStageLine: ({ stage }) => `Ultima fase: ${stage}`,
  speechDiagnosticLanguageLine: ({ languageLabel }) =>
    `Lingua: ${languageLabel}`,
  speechDiagnosticProviderLine: ({ provider }) => `Fornitore: ${provider}`,
  speechDiagnosticVoiceLine: ({ voice }) => `Voce: ${voice}`,
  localTtsPackReady: "Installato su questo dispositivo.",
  localTtsPackBroken:
    "Scaricato, ma questa voce non ha superato la verifica locale su questo dispositivo. Scaricalo nuovamente o scegli un'altra voce.",
  localTtsPackMissing:
    "Non ancora installato. Il cloud TTS o la voce del sistema verranno utilizzati finché non lo scarichi.",
  localTtsUnsupportedLanguageFallback:
    "Un pacchetto locale non è ancora disponibile per questa lingua. Cloud TTS o la voce del sistema lo gestiranno.",
  downloadingLocalTtsPack: ({ progress }) =>
    `Download del pacchetto locale in corso... ${progress}%`,
  download: "Scaricamento",
  downloadingShort: "Caricamento...",
  voicePreviewText: "Testo di anteprima vocale",
  voicePreviewPlaceholder: "Digita una frase per ascoltare questa voce.",
  voicePreviewHint:
    "Utilizza il backend vocale di risposta attualmente selezionato senza inviare nulla al modello linguistico.",
  previewVoice: "Anteprima della voce",
  generatingPreview: "Generazione dell'anteprima in corso...",
  playingPreview: "Riproduzione dell'anteprima...",
  systemVoice: "Voce di sistema",
  spokenRepliesOff: "Solo testo",
  noTtsProvider: "Nessun fornitore TTS",
  nothingToCopyYet: "Niente da copiare ancora.",
  couldntCopyText: "Impossibile copiare quel testo.",
  nothingToShareYet: "Niente da condividere ancora.",
  couldntShareText: "Impossibile condividere quel testo.",
  couldntReplayReply: "Impossibile riprodurre la risposta.",
  replyFailed: "Risposta fallita",
  retryReply: "Riprovare a rispondere",
  replyFailedHint: "Puoi scegliere un altro modello sopra prima di riprovare.",
  spokenReplyFailed: "La risposta è stata salvata, ma non è stato possibile pronunciarla.",
  retrySpeech: "Riprova il discorso",
  openSpeakingSettings: "Impostazioni di conversazione",
  messageCopied: "Messaggio copiato.",
  noConversationToCopyYet: "Nessuna conversazione da copiare ancora.",
  noConversationToShareYet: "Nessuna conversazione da condividere ancora.",
  noReplyToRepeatYet: "Nessuna risposta per la riproduzione ancora.",
  threadCopied: "Discussione copiata.",
  threadRenamed: "Discussione rinominata.",
  threadPinned: "Filo appuntato.",
  threadUnpinned: "Discussione sbloccata.",
  addProviderKeyToUseProvider: ({ provider }) =>
    `Aggiungi le credenziali per ${provider} in Impostazioni prima di utilizzare questo percorso.`,
  configureCredentialsBeforeVoiceSession:
    "Aggiungi le credenziali in Impostazioni prima di avviare una sessione vocale.",
  endpointCredentialFormatInvalid: ({ provider }) =>
    `Per ${provider}, inserisci l'URL di base del provider e la chiave API come https://your-endpoint.example.com|your-api-key.`,
  speechRecognitionUnavailableOnDevice:
    "Il riconoscimento vocale non è disponibile su questo dispositivo.",
  debugLogLabel: "TRONCO D'ALBERO",
  debugLogCaptureStarted: "Avviata la registrazione del debug.",
  debugLogCaptureStopped: ({ entryCount, fileName }) =>
    `Registro di debug salvato come ${fileName} e copiato negli appunti (voci ${entryCount}).`,
  debugLogCaptureStoppedNoClipboard: ({ entryCount, fileName }) =>
    `Registro di debug salvato come ${fileName} (voci ${entryCount}).`,
  debugLogCaptureRecovered: ({ entryCount, fileName }) =>
    `Recupera il registro di debug precedente ${fileName} e lo copia negli appunti (voci ${entryCount}).`,
  debugLogCaptureRecoveredNoClipboard: ({ entryCount, fileName }) =>
    `Recupera il registro di debug precedente ${fileName} (voci ${entryCount}).`,
  debugLogCaptureFailed: "Impossibile salvare il registro di debug.",
  chooseSttBeforeVoiceSession:
    "Scegli un percorso STT configurato in Impostazioni prima di avviare una sessione vocale.",
  chooseTtsBeforeSpokenReplies:
    "Scegli un percorso TTS configurato in Impostazioni prima di utilizzare le risposte vocali.",
  stopSessionBeforeReplay:
    "Interrompe la sessione vocale attiva prima di riprodurre l'ultima risposta.",
  couldntCatchThatTryAgain: "Impossibile capirlo, riprova.",
  couldntStartVoiceInput: "Impossibile avviare l'input vocale.",
  couldntProcessVoiceInput: "Impossibile elaborare l'input vocale.",
  maxRecordingLengthReached:
    "È stata raggiunta la durata massima della registrazione: invio ciò che ho.",
  sttRecordingTooLarge: ({ provider, limit }) =>
    `La registrazione è troppo lunga per la sintesi vocale ${provider} (max ${limit}). Prova un messaggio più breve o passa dalla sintesi vocale al riconoscimento del sistema.`,
  addProviderKeyToEnableProvider: ({ provider }) =>
    `Aggiungi le credenziali per ${provider} in Impostazioni prima di utilizzare questo percorso.`,
  stopSessionBeforePreview:
    "Interrompe la sessione vocale attiva prima di visualizzare in anteprima una voce.",
  chooseTtsToPreviewVoices:
    "Scegli un percorso TTS configurato in Impostazioni per visualizzare in anteprima le voci.",
  downloadSelectedLocalVoiceFirst: ({ languageLabel }) =>
    `Scarica prima la voce locale ${languageLabel} selezionata.`,
  couldntPreviewVoice: "Impossibile visualizzare l'anteprima della voce.",
  spokenRepliesDisabled: "Le risposte vocali sono disattivate nelle Impostazioni.",
  providerVoiceFallback:
    "L'instradamento vocale configurato non è riuscito. Ho cambiato questa risposta con una voce di riserva.",
  localVoiceFallback:
    "La voce locale non era disponibile. Ho cambiato questa risposta con una voce di riserva.",
  localTtsPackInstalled: ({ languageLabel }) =>
    `${languageLabel} pacchetto vocale locale installato.`,
  localTtsPackInstallFailed: "Impossibile installare il pacchetto vocale locale.",
  clear: "Chiaro",
  voiceOutput: "Uscita vocale",
  currentSetup: "Configurazione corrente",
  listeningToYourVoice: "Ascoltando la tua voce",
  parsingYourVoiceInput: "Trasformare la tua voce in testo",
  preparingRequest: "Preparazione della tua richiesta",
  searchingTheWeb: "Ricerca sul web per un nuovo contesto",
  waitingForProvider: ({ provider }) => `In attesa di ${provider}`,
  preparingVoiceWithProvider: ({ provider }) =>
    `Preparazione della voce con ${provider}`,
  deepThinkingReassurance: "Le buone risposte richiedono un momento...",
  thinkingElapsed: ({ detail, seconds }) => `${detail} · ${seconds}s`,
  speakingBackToYou: "Ti rispondo",
  freshSession: "Sessione fresca",
  messageCount: ({ count }) =>
    Number(count) === 1 ? "1 messaggio" : `Messaggi ${count}`,
  speechInputRoute: ({ route }) => `Discorso in: ${route}`,
  replyModelRoute: ({ route }) => `Modello di risposta: ${route}`,
  voiceOutputRoute: ({ route }) => `Voce in uscita: ${route}`,
  fallbackVoiceOutputRoute: ({ route }) => `Uscita vocale di riserva: ${route}`,
  conversation: "Conversazione",
  conversationActions: "Azioni di conversazione",
  statusDetails: "Dettagli sullo stato",
  persistenceFailure:
    "Sig. Broccoli non ha potuto salvare i dati su questo dispositivo. Tieni l'app aperta e riprova; le modifiche recenti potrebbero andare perse dopo il riavvio.",
  show: "Spettacolo",
  showTranscript: "Mostra la trascrizione",
  hide: "Nascondere",
  copyThread: "Copia discussione",
  shareThread: "Condividi discussione",
  repeatReply: "Ripeti la risposta",
  renameThread: "Rinomina discussione",
  renameThreadHint:
    "Dai a questa conversazione un titolo che potrai trovare velocemente più tardi.",
  threadTitle: "Titolo della discussione",
  noTranscriptYet: "Nessuna trascrizione ancora",
  previewTranscriptEmptyDescription:
    "Utilizza la voce o il testo per iniziare. La tua conversazione apparirà qui.",
  noConversationYet: "Nessuna conversazione ancora",
  expandedTranscriptEmptyDescription:
    "Utilizza la voce o il testo per iniziare. Chiudi questa schermata quando desideri tornare alla fase principale.",
  transcriptSelectionHint:
    "Seleziona direttamente il testo del messaggio oppure condividi e copia i singoli messaggi di seguito.",
  textMessagePlaceholder: "Digita un messaggio",
  sendTextMessage: "Invia messaggio",
  showVoiceInput: "Mostra input vocale",
  showTextInput: "Mostra l'inserimento del testo",
  usageStatsHiddenDescription: "Mantieni le stime dei token fuori dalla trascrizione UI.",
  usageStatsVisibleDescription:
    "Mostra l'utilizzo stimato dei token per le risposte e i totali delle conversazioni.",
  debugLogButton: "Pulsante registro debug",
  debugLogButtonHiddenDescription:
    "Mantieni nascosto il pulsante LOG della schermata iniziale a meno che non sia già in esecuzione un'acquisizione.",
  debugLogButtonVisibleDescription:
    "Mostra il pulsante LOG della schermata iniziale per avviare e interrompere le acquisizioni di debug.",
  debugLogButtonUsageDescription:
    "Come utilizzare il pulsante: attivandolo si avvierà l'acquisizione dei log. Disattivandolo si interromperà l'acquisizione dei registri e si sposteranno quelli catturati negli appunti.",
  estimatedUsageTitle: "Utilizzo stimato",
  estimatedUsageCounts: ({ replies, summaries }) =>
    `${replies} risponde · Aggiornamenti della memoria ${summaries}`,
  estimatedUsageConversationScope:
    "I totali includono ogni percorso e modello utilizzato all'interno di questa conversazione.",
  estimatedPromptTokens: ({ count }) => `Richiesta: ${count}`,
  estimatedReplyTokens: ({ count }) => `Risposta: ${count}`,
  estimatedTotalTokens: ({ count }) => `Totale: ${count}`,
  estimatedUsageInline: ({ prompt, completion, total }) =>
    `Est. ${prompt} ingresso · ${completion} uscita · ${total} totale`,
  searchQuery: "Domanda di ricerca",
  expandWebSearchDetails: "Mostra i dettagli della ricerca web",
  collapseWebSearchDetails: "Nascondi i dettagli della ricerca web",
  webSearchSourceCount: ({ count }) =>
    `${count} ${Number(count) === 1 ? "fonte" : "fonti"}`,
  sources: "Fonti",
  openSourceLink: ({ source }) => `Sorgente aperta: ${source}`,
  turnReceipt: "Dettagli della svolta",
  expandTurnReceipt: "Mostra i dettagli della svolta",
  collapseTurnReceipt: "Nascondi i dettagli della svolta",
  turnReceiptDirect: "Diretto",
  turnReceiptRequested: "Percorso di risposta richiesto",
  turnReceiptActual: "Percorso di risposta effettivo",
  turnReceiptEffort: "Controllo del ragionamento",
  turnReceiptProviderNative: "nativo del fornitore",
  turnReceiptInput: "Percorso di ingresso",
  turnReceiptSearch: "Ricerca sul Web",
  turnReceiptVoice: "Uscita vocale",
  turnReceiptContext: "Contesto",
  turnReceiptTiming: "Tempistica",
  turnReceiptFallback: "Motivo del fallback",
  turnReceiptVoiceInput: "Voce",
  turnReceiptTypedInput: "Digitato",
  turnReceiptSystemSpeech: "Riconoscimento vocale del sistema",
  turnReceiptSystemVoice: "Voce di sistema",
  turnReceiptSystemVoiceFallback: "Voce di sistema · fallback",
  turnReceiptOff: "Spento",
  turnReceiptNotConfigured: "Acceso · non configurato",
  turnReceiptFallbackWithoutSearch: "Continua senza ricerca dal vivo",
  turnReceiptNotUsed: "Non utilizzato",
  turnReceiptSummaryReused: "riepilogo salvato riutilizzato",
  turnReceiptSummaryUpdated: "riepilogo aggiornato",
  turnReceiptContextFallback: "fallback dei messaggi recenti",
  turnReceiptGatewayCompression: ({ original, compressed }) =>
    `gateway ha compresso i messaggi da ${original} a ${compressed}`,
  turnReceiptContextValue: ({ sent, total, summarized, state }) =>
    `${sent}/${total} messaggi precedenti inviati · ${summarized} nuovo riepilogo${state}`,
  turnReceiptTimingStt: "STT",
  turnReceiptTimingContext: "contesto",
  turnReceiptTimingSearch: "ricerca",
  turnReceiptTimingModel: "modello",
  turnReceiptTimingFirstSpeech: "primo discorso",
  turnReceiptTimingTotal: "totale",
  estimatedRouteUsageTokensOnly: ({ tokens }) => `Gettoni ${tokens}`,
  unknownUsageRoute: "Percorso sconosciuto",
  setupGuideConnectProviderTitle: "Configura le credenziali",
  setupGuideConnectProviderDescription:
    "Aggiungi le credenziali in Impostazioni, quindi scegli i percorsi che desideri utilizzare.",
  idle: "Oziare",
  yourConversationAppearsHere: "La tua conversazione appare qui",
  defaultTranscriptEmptyDescription:
    "Utilizza la voce o il testo per iniziare. Sig. Broccoli manterrà il thread e risponderà qui.",
  delete: "Eliminare",
  deleteConversationConfirmationTitle: ({ title }) => `Eliminare "${title}"?`,
  deleteConversationConfirmationMessage:
    "Ciò eliminerà permanentemente la conversazione e tutti i suoi messaggi. Questa azione non può essere annullata.",
  memory: "Memoria",
  conversations: "Conversazioni",
  drawerSubtitle: "Passa da un thread attivo all'altro o avvia una nuova stanza.",
  newSession: "Nuova sessione",
  noSavedConversationsYet: "Nessuna conversazione ancora salvata",
  drawerEmptyDescription:
    "Inizia a parlare dalla vista principale e Sig. Broccoli creerà automaticamente una sessione.",
  setupGuideTitle: "Configura l'applicazione",
  setupGuideSubtitle: "Aggiungi le credenziali e scegli i percorsi in Impostazioni.",
  fastestStartPreset: "Configurazione minima",
  fastestStartDescription:
    "Utilizza la sintesi vocale del dispositivo, ove disponibile, e configura solo il percorso di risposta di cui hai bisogno.",
  fullVoicePreset: "Voce configurata",
  fullVoiceDescription:
    "Utilizza i servizi configurati per risposte, trascrizione e output parlato quando li scegli.",
  setupGuideNote:
    "Successivamente apriremo le Impostazioni in modo da poter incollare e convalidare le credenziali.",
  useThisSetup: "Usa questa configurazione",
  notNow: "Non adesso",
  setupGuideIntroTitle: "Come funziona Sig. Broccoli",
  setupGuideIntroBody:
    "Sig. Broccoli inizia vuoto. Aggiungi le credenziali per i servizi esterni che già utilizzi, quindi scegli come instradare le risposte, l'input vocale, l'output vocale e il contesto web opzionale.",
  setupGuideIntroNote:
    "Dopo la configurazione, utilizza il controllo vocale principale per avviare e interrompere una conversazione. La trascrizione corrente rimane disponibile nella schermata principale e ogni percorso può essere modificato successivamente in Impostazioni.",
  setupGuideProviderTitle: "Aggiungi credenziali",
  setupGuideProviderBody:
    "Scegli il servizio esterno che desideri configurare, quindi incolla le credenziali con accesso alla risposta.",
  setupGuideProviderPickerLabel: "Servizio di risposta",
  setupGuideSelectProvider: "Seleziona un fornitore",
  setupGuideSelectProviderFirst: "Seleziona prima un fornitore.",
  setupGuideApiKeyLabel: "Tasto API",
  setupGuideApiKeyPlaceholder: "Incolla le credenziali",
  setupGuideContinue: "Continuare",
  setupGuideOpenSettings: "Apri Impostazioni",
  setupGuideBack: "Indietro",
  setupGuideValidateKey: "Convalida la chiave",
  setupGuideApiKeyRequiredOrCancel:
    "Aggiungi una chiave API per continuare o annulla la guida all'installazione.",
  setupGuideProviderAndApiKeyRequiredOrCancel:
    "Scegli un provider e aggiungi una chiave API per continuare o annulla la guida alla configurazione.",
  setupGuideProviderKeyNeedsLlmAccess: ({ provider }) =>
    `Queste credenziali ${provider} non consentono richieste di risposta.`,
  setupGuideKokoroTitle: "Aggiungi una voce naturale sul dispositivo",
  setupGuideKokoroBody: ({ size }) =>
    `Facoltativo: scarica Kokoro (circa ${size} MB) per risposte vocali molto più naturali senza fornitore di servizi vocali o costi di utilizzo.`,
  setupGuideKokoroLanguageNote:
    "Questo modello attualmente parla inglese e cinese semplificato. Configura eventuali percorsi di fallback desiderati in seguito nelle impostazioni di conversazione.",
  setupGuideKokoroDownload: "Scarica Kokoro",
  setupGuideUseKokoro: "Utilizza Kokoro per le risposte vocali",
  setupGuideUseKokoroSummary:
    "Mantieni la sintesi sul telefono ogni volta che la lingua di risposta è supportata.",
  setupGuideSkipKokoro: "Salta per ora",
  setupGuideVoiceTestTitle: "Metti alla prova la tua configurazione",
  setupGuideVoiceTestBody:
    "Pronuncia una breve frase. Sig. Broccoli testerà l'accesso al microfono, la trascrizione, il percorso di risposta configurato e l'output parlato quando è disponibile un percorso vocale accettabile.",
  setupGuideVoiceTestNoInputBody:
    "L'input vocale non è disponibile con questa configurazione. Continua a rivedere i percorsi rilevati, quindi modifica le impostazioni vocali in un secondo momento, se necessario.",
  setupGuideVoiceTestTextOnlyNote:
    "Questo test rimane di solo testo perché non è ancora pronto alcun percorso vocale parlato accettabile.",
  setupGuideVoiceTestStart: "Inizia la prova",
  setupGuideVoiceTestStop: "Interrompi la registrazione",
  setupGuideVoiceTestRetry: "Corri di nuovo",
  setupGuideVoiceTestTranscribing: "Trascrizione…",
  setupGuideVoiceTestThinking: "Test della risposta...",
  setupGuideVoiceTestSynthesizing: "Preparare la voce...",
  setupGuideVoiceTestSpeaking: "Riproduzione della risposta...",
  setupGuideVoiceTestTranscript: "Trascrizione",
  setupGuideVoiceTestReply: "Rispondere",
  setupGuideVoiceTestReset: "Cancella questo risultato",
  setupGuideVoiceInputUnavailable:
    "L'input vocale non è disponibile per questa configurazione su questo dispositivo.",
  setupGuideSummaryTitle: "Configurazione completata",
  setupGuideSummaryBody:
    "Ecco il percorso che Sig. Broccoli utilizzerà con la configurazione attuale.",
  setupGuideSummaryLlm: "LLM",
  setupGuideSummaryStt: "Discorso al testo",
  setupGuideSummaryTts: "Dal testo alla voce",
  setupGuideSummaryWebSearch: "Ricerca sul Web",
  setupGuideRouteProviderLlm: ({ provider }) => `Abilitato tramite ${provider}`,
  setupGuideRouteOnDeviceStt: "Abilitato tramite il riconoscimento vocale del sistema",
  setupGuideRouteProviderStt: ({ provider }) =>
    `Abilitato tramite trascrizione vocale ${provider}`,
  setupGuideRouteProviderTts: ({ provider }) => `Abilitato tramite voce ${provider}`,
  setupGuideRouteKokoroTts: "Abilitato tramite Kokoro voce sul dispositivo",
  setupGuideRouteLocalTts: "Abilitato tramite pacchetto vocale locale",
  setupGuideRouteUnavailable: "Non disponibile",
  setupGuideRouteOff: "Spento",
  setupGuideWebSearchAvailableOff: ({ provider }) =>
    `Disponibile tramite ${provider}, attualmente disattivato`,
  setupGuideSummaryTextOnlyNote:
    "Le risposte vocali per ora sono disattivate. Le risposte rimangono nel testo finché non abiliti un provider o una voce locale.",
  setupGuideFinish: "Fatto",
  searchConversationsPlaceholder: "Cerca titoli, modelli e testo del messaggio",
  noMatchingConversations: "Nessuna conversazione corrispondente",
  noMatchingConversationsDescription:
    "Prova un titolo, un percorso, un modello o una frase diversi dalla trascrizione.",
  memoryModalTitle: "Memoria di conversazione",
  memoryModalDescription:
    "Questo è il riepilogo compatto che Sig. Broccoli porta avanti quando un thread diventa abbastanza lungo da comprimere i turni più vecchi.",
  memorySummary: "Riepilogo salvato",
  memorySummaryEmpty:
    "Nessuna memoria compatta ancora. Una volta che questo thread diventa più lungo, i turni più vecchi verranno riepilogati qui.",
  summarizedTurnsCount: ({ count }) =>
    Number(count) === 1 ? "1 turno riassuntivo" : `${count} riepilogo delle virate`,
  copyMemory: "Copiare la memoria",
  forgetMemory: "Dimentica la memoria",
  memoryCopied: "Memoria copiata.",
  memoryCleared: "La memoria di conversazione è stata cancellata.",
  noConversationToManageYet: "Nessuna memoria di conversazione ancora disponibile.",
  noProviderYet: "Nessun fornitore ancora",
  noModelYet: "Nessun modello ancora",
  startedAt: "Iniziato",
  endedAt: "Finito",
  pinned: "Appuntato",
  copy: "Copia",
  share: "Condividere",
  rename: "Rinominare",
  pin: "Spillo",
  unpin: "Sblocca",
  save: "Salva",
  cancel: "Cancellare",
  stop: "Fermare",
  pause: "Pausa",
  resume: "Riprendere",
  paused: "In pausa",
  listening: "Ascolto",
  parsing: "Trascrizione",
  searching: "Ricerca",
  converting: "Conversione",
  webSearchAction: "ricerca sul web",
  thinking: "Pensiero",
  speaking: "A proposito di",
  pleaseWait: "attendere prego",
  yourTurn: "Il tuo turno",
  keepPressing: "Continua a premere",
  tapWhenDone: "Tocca al termine",
  speechPaused: "Il discorso è in pausa",
  pausePlaybackUnavailable:
    "Questa rotta vocale non può essere messa in pausa. Interrompilo o passa all'output vocale del provider.",
  holdToSpeak: "Aspetta a parlare",
  tapToSpeak: "Tocca per parlare",
  tapAgainToSend: "Tocca di nuovo per inviare",
  waitingForReply: "In attesa di risposta",
  parsingYourVoice: "Analizzare la tua voce",
  providerConfiguredInSettings: ({ provider }) =>
    `${provider} non è configurato in Impostazioni.`,
  providerNetworkError: ({ provider, action }) =>
    `Impossibile raggiungere ${provider} per ${action}. Controlla la connessione e riprova.`,
  providerAuthError: ({ provider, action }) =>
    `${provider} ha rifiutato le credenziali per ${action}. Controlla la chiave API e le autorizzazioni.`,
  providerRateLimitError: ({ provider, action }) =>
    `${provider} sta limitando la velocità ${action} in questo momento. Riprova tra un attimo.`,
  providerCreditsRequired: ({ provider, action }) =>
    `${provider} necessita di credito API sufficiente per ${action}. Controlla il saldo del conto e il limite di spesa della chiave.`,
  providerTimeoutError: ({ provider, action }) =>
    `${provider} ha impiegato troppo tempo durante ${action}. Riprova.`,
  providerTemporaryError: ({ provider, action }) =>
    `${provider} ha riscontrato un problema temporaneo durante ${action}. Riprova a breve.`,
  providerEmptyReplyError: ({ provider }) =>
    `${provider} ha terminato senza restituire una risposta. Riprova.`,
  providerIncompleteReplyError: ({ provider }) =>
    `La risposta di ${provider} è terminata prima di essere completata. Riprova.`,
  providerContextTooLong: ({ provider }) =>
    `${provider} ha rifiutato la risposta perché la conversazione è diventata troppo lunga. Inizia una nuova discussione o abbrevia la richiesta.`,
  providerRequestRejected: ({ provider, action, detail }) =>
    detail
      ? `${provider} ha rifiutato la richiesta ${action}: ${detail}`
      : `${provider} ha rifiutato la richiesta ${action}.`,
  providerWebSearchNotRun: ({ provider }) =>
    `${provider} ha restituito una risposta senza eseguire la ricerca sul Web.`,
  providerValidationSuccess: ({ provider }) => `${provider} è pronto per l'uso.`,
  providerCapabilityValidationSuccess: ({ provider, capability }) =>
    `${provider} ${capability} funziona.`,
  providerValidationFailed: "Convalida del fornitore non riuscita.",
  webSearchFallback:
    "La ricerca sul Web non era disponibile, quindi la risposta è continuata senza contesto Web attivo.",
  noBase64EncoderAvailable: "Nessun codificatore Base64 disponibile.",
  noBase64DecoderAvailable: "Nessun decoder base64 disponibile.",
  azureSpeechApiKeyFormat:
    "Microsoft Azure TTS necessita delle credenziali di riconoscimento vocale di Azure nel formato <key>|<region>, ad esempio abc123|westeurope o nel formato Azure combinato <endpoint>|<api-key>|<key>|<region>.",
  googleCloudSpeechCredentialFormat: ({ provider }) =>
    `${provider} STT necessita delle credenziali Google Cloud Speech nel formato <project-id>|<access-token>|<location> o nel formato combinato Gemini <Gemini API key>|<project-id>|<access-token>|<location>.`,
  bytedanceSpeechCredentialFormat: ({ provider }) =>
    `${provider} STT necessita di Doubao Credenziali vocali nel formato <app-key>|<access-key>, facoltativamente <app-key>|<access-key>|<resource-id> o nel formato combinato <ark-api-key>|<app-key>|<access-key>|<resource-id>.`,
  nativeTtsDoesNotSynthesizeAudioFiles:
    "TTS nativo non sintetizza i file audio.",
  localTtsUnavailableForLanguage: ({ languageLabel }) =>
    `Nessun percorso vocale locale o cloud è pronto per ${languageLabel}.`,
  chooseTextToSpeechProviderInSettings:
    "Scegli un provider di sintesi vocale in Impostazioni.",
  ttsNotSupportedYet: ({ provider }) => `${provider} TTS non è ancora supportato.`,
  ttsError: ({ provider, status, errorText }) =>
    `Errore ${provider} TTS (${status}): ${errorText}`,
  ttsReplyTooLong: ({ provider }) =>
    `L'output vocale ${provider} ha rifiutato la risposta perché troppo lunga.`,
  ttsTimeout: ({ provider }) => `L'output vocale ${provider} ha impiegato troppo tempo.`,
  sttTimeout: ({ provider }) =>
    `La trascrizione vocale ${provider} ha richiesto troppo tempo.`,
  sttFileSizeLimitExceeded: ({ provider, model, limit }) =>
    `${provider} ${model} accetta solo registrazioni fino a ${limit}. Utilizzare una clip più corta o cambiare modello STT.`,
  voiceInputCaptureIncomplete:
    "Non è stato possibile acquisire in modo pulito l'input vocale. Per favore riprova.",
  ttsDidNotReturnAudio: ({ provider }) =>
    `${provider} TTS non ha restituito l'audio.`,
  nativeSttHandledInApp: "Il sistema STT viene gestito direttamente nell'app.",
  chooseSpeechToTextProviderInSettings:
    "Scegli un provider di sintesi vocale in Impostazioni.",
  sttNotSupportedYet: ({ provider }) => `${provider} STT non è ancora supportato.`,
  providerNotWiredUpYet: ({ provider }) => `${provider} non è ancora cablato.`,
  you: "Voi",
  assistant: "Assistente",
  untitledConversation: "Conversazione senza titolo",
  conversationExportHeader: ({ title }) => `Conversazione: ${title}`,
  speechRecognitionPermissionNotGranted:
    "Autorizzazione al riconoscimento vocale non concessa.",
  speechRecognitionUnavailableForDeviceLanguage:
    "Il riconoscimento vocale non è disponibile per la lingua del dispositivo corrente.",
  nativeSpeechRecognitionNeedsNetwork:
    "Il riconoscimento vocale nativo necessita dell'accesso alla rete in questo momento.",
  noSpeechDetected: "Non è stato rilevato alcun parlato.",
  nativeSpeechRecognitionFailed: "Il riconoscimento vocale nativo non è riuscito.",
  couldntStartNativeSpeechRecognition:
    "Impossibile avviare il riconoscimento vocale nativo.",
  microphonePermissionNotGranted: "Autorizzazione microfono non concessa",
} satisfies TranslationDictionary;
