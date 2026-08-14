import type { TranslationDictionary } from "../types";
import { dataBackupTranslations } from "../dataBackupTranslations";
import { conversationKnowledgeTranslations } from "../conversationKnowledgeTranslations";
import { conversationArtifactTranslations } from "../conversationArtifactTranslations";
import { interruptionTranslations } from "../interruptionTranslations";
import { ulraAuditTranslations } from "../ulraAuditTranslations";
import { imagePromptTranslations } from "../imagePromptTranslations";
import { onDeviceTranslations } from "../onDeviceTranslations";
import { onboardingTranslations } from "../onboardingTranslations";
import { introTranslations } from "../introTranslations";
import { premiumTranslations } from "../premiumTranslations";
import { transcriptEditTranslations } from "../transcriptEditTranslations";
import { autoSetupTranslations } from "../autoSetupTranslations";
import { workspaceTranslations } from "../workspaceTranslations";

export const pl = {
  ...conversationArtifactTranslations.pl,
  ...interruptionTranslations.pl,
  ...ulraAuditTranslations.pl,
  ...dataBackupTranslations.pl,
  ...conversationKnowledgeTranslations.pl,
  ...imagePromptTranslations.pl,
  ...onDeviceTranslations.pl,
  ...onboardingTranslations.pl,
  ...introTranslations.pl,
  ...premiumTranslations.pl,
  ...transcriptEditTranslations.pl,
  ...workspaceTranslations.pl,
  ...autoSetupTranslations.pl,
  appName: "Pan Brokuł",
  retry: "Spróbuj ponownie",
  dismiss: "Odrzuć",
  done: "Gotowe",
  aboutSetting: ({ setting }) => `Informacje o ${setting}`,
  unavailable: "Niedostępne",
  selection: "Wybór",
  chooseCompatibleProviderFirst: "Najpierw wybierz kompatybilnego dostawcę",
  settings: "Ustawienia",
  settingsReleaseVersion: ({ version }) => `Wersja ${version}`,
  all: "Wszystko",
  firstRun: "Pierwsze uruchomienie",
  instructions: "Instrukcje",
  providers: "Dostawcy",
  webSearch: "Wyszukiwanie w Internecie",
  stt: "STT",
  tts: "TTS",
  ui: "Interfejs użytkownika",
  settingsRuntimeReadiness: "Gotowość do działania",
  settingsReadinessThink: "Pomyśl",
  settingsReadinessListen: "Słuchaj",
  settingsReadinessSpeak: "Mów",
  settingsReadinessSearch: "Szukaj",
  settingsReadinessReady: "Gotowy",
  settingsReadinessNeedsAttention: "Uwaga",
  settingsReadinessBroken: "Niesprawne",
  settingsReadinessOff: "Wyłączone",
  settingsConnections: "Połączenia",
  settingsThinking: "Myślenie",
  settingsListening: "Słuchanie",
  settingsSpeaking: "Mówienie",
  settingsSearch: "Szukaj",
  settingsAppDiagnostics: "Aplikacja i diagnostyka",
  settingsGuidedSetup: "Konfiguracja z przewodnikiem",
  settingsGuidedSetupSummary:
    "Przejrzyj połączenia i przetestuj pełną trasę głosową.",
  setupGuideShowInSettings: "Pokaż konfigurację z przewodnikiem w Ustawieniach",
  setupGuideShowInSettingsSummary:
    "Pokaż lub ukryj skrót konfiguracji z przewodnikiem w przeglądzie ustawień.",
  settingsConnectionsSummary:
    "Klucze dostawcy, sprawdzanie poprawności i możliwości.",
  settingsThinkingSummary: "Karty główne, modele, wysiłek i monit systemowy.",
  settingsListeningSummary: "Tryb wprowadzania i routing mowy na tekst.",
  settingsSpeakingSummary: "Odpowiedzi głosowe, odtwarzanie, głosy i podglądy.",
  settingsSearchSummary:
    "Dostawca wyszukiwarki internetowej i kontrola jakości wyszukiwania.",
  settingsAppDiagnosticsSummary:
    "Motyw, język, użycie, dzienniki debugowania i ostatnia aktywność.",
  settingsBackToOverview: "Powrót do przeglądu",
  settingsOpenSection: ({ section }) => `Otwórz ${section}`,
  theme: "Motyw",
  language: "Język",
  recognitionLanguage: "Język rozpoznawania",
  recognitionLanguageHint:
    "Wybierz język, aby poprawić rozpoznawanie, lub pozostaw ustawienie automatyczne, aby wykrywaniem zajęło się urządzenie lub dostawca.",
  automaticLanguage: "Automatyczny",
  speechLanguageUnsupportedByProvider: ({ provider, language }) =>
    `${provider} oficjalnie nie obsługuje ${language} dla tej ścieżki mowy.`,
  usageStats: "Statystyki użytkowania",
  model: "Model",
  effort: "Wysiłek",
  effortValue: ({ effort }) => `Wysiłek: ${effort}`,
  modelEffortNone: "Brak",
  modelEffortMinimal: "Minimalny",
  modelEffortLow: "Niski",
  modelEffortMedium: "Średni",
  modelEffortHigh: "Wysoki",
  modelEffortExtraHigh: "Bardzo wysoki",
  modelEffortMax: "Maks",
  modelEffortDynamic: "Dynamiczny",
  modelEffortDisabled: "Wyłączone",
  modelEffortEnabled: "Włączone",
  fixed: "Stały",
  english: "Angielski",
  german: "Niemiecki",
  ukrainian: "Ukraiński",
  hindi: "Hindi",
  spanish: "Hiszpański",
  french: "Francuski",
  italian: "Włoski",
  portuguese: "Portugalski",
  portugueseBrazil: "Portugalski (Brazylia)",
  russian: "Rosyjski",
  simplifiedChinese: "Chiński uproszczony",
  arabic: "Arabski",
  japanese: "Japoński",
  hungarian: "Węgierski",
  czech: "Czeski",
  polish: "Polski",
  turkish: "Turecki",
  swedish: "Szwedzki",
  urdu: "Urdu",
  kokoroAmericanFemaleVoice: ({ name }) => `${name} · Amerykański głos żeński`,
  kokoroBritishFemaleVoice: ({ name }) => `${name} · Brytyjski głos żeński`,
  kokoroChineseFemaleVoice: ({ index }) => `Chiński głos żeński ${index}`,
  kokoroChineseMaleVoice: ({ index }) => `Chiński głos męski ${index}`,
  light: "Jasny",
  dark: "Ciemny",
  system: "System",
  languageCoverage: ({ note }) => `Zakres języków: ${note}`,
  recordingLimits: ({ note }) => `Limity nagrywania: ${note}`,
  catalogProviderPricingSummary: ({ summary }) => `Ceny: ${summary}`,
  replyGenerationAction: "generowanie odpowiedzi",
  speechTranscriptionAction: "transkrypcja mowy",
  speechSynthesisAction: "synteza mowy",
  instructionsTabDescription:
    "Kształtuj ukryte wskazówki, które kierują asystentem, zanim jakikolwiek dostawca zobaczy żądanie.",
  providersTabDescription:
    "Przechowuj poświadczenia usług zewnętrznych na urządzeniu i konfiguruj tryby odpowiedzi, których chcesz używać.",
  webSearchTabDescription:
    "Skonfiguruj opcjonalny kontekst internetowy na żywo przed odpowiedziami.",
  responseModes: "Wybór modelu",
  aboutModelSelection: "O wyborze modelu",
  modelSelectionInfo:
    "Każda karta modelu staje się wyborem na ekranie głównym. Skonfiguruj dostawcę, model i opcjonalny poziom wysiłku, a następnie zmień karty, aby wybrać, który model odpowie jako następny.",
  responseModeItemTitle: ({ index }) => `Model ${index}`,
  addResponseMode: "Dodaj model",
  removeResponseMode: "Usuń model",
  responseModesNoConfiguredProviders:
    "Najpierw dodaj dane uwierzytelniające. Elementy sterujące trasą pozostają ukryte do czasu skonfigurowania co najmniej jednej kompatybilnej usługi.",
  useResponseMode: ({ mode }) => `Użyj ${mode}`,
  chooseResponseModel: "Wybierz model",
  responseModelCount: ({ count }) => `Dostępnych modeli: ${count}`,
  ulraMode: "Supertryb",
  ulraModeHomeLabel: "Pokaż supertryb na ekranie głównym",
  ulraModeSettingsDescription:
    "Pozwala wielu modelom wspólnie rozważyć odpowiedź, gdy gotowe są co najmniej dwa modele z ekranu głównego.",
  ulraModeInfo:
    "Supertryb najpierw pyta osobno każdy gotowy model z ekranu głównego. W każdej rundzie modele krytycznie oceniają najnowsze stanowisko każdego uczestnika; pozostałe rundy są pomijane po wyraźnej jednomyślnej zgodzie. Wybrany model tworzy końcową syntezę z udanych rund, zawsze zachowując najnowsze stanowisko każdego modelu. Treść rozważań jest udostępniana wszystkim zaangażowanym dostawcom.",
  ulraModeRounds: "Rundy przeglądu",
  ulraModeCallEstimate: ({ count }) =>
    `Przy bieżącej konfiguracji maksymalnie ${count} wywołań modeli na wiadomość.`,
  ulraModeThresholdWarning:
    "Więcej niż 4 modele lub 3 rundy może trwać bardzo długo, zużyć wiele tokenów i osiągnąć limity kontekstu lub częstotliwości dostawców. To tylko ostrzeżenie.",
  ulraModeFirstUseTitle: "Włączyć supertryb?",
  ulraModeFirstUseMessage: ({ calls, models, rounds }) =>
    `Przy ${models} modelach i maksymalnie ${rounds} rundach przeglądu jedna wiadomość może wykonać do ${calls} wywołań modeli. Może to potrwać znacznie dłużej, kosztować dużo więcej i udostępnić rozważania wszystkim zaangażowanym dostawcom.`,
  ulraModeHighRiskTitle: "Duże uruchomienie supertrybu",
  ulraModeHighRiskMessage: ({ calls, models, rounds }) =>
    `${models} modeli i ${rounds} rund przeglądu może wykonać maksymalnie ${calls} wywołań modeli. Może to trwać bardzo długo, zużyć wiele tokenów i osiągnąć limity dostawców. Kontynuować mimo to?`,
  ulraModeEnableAction: "Włącz",
  ulraModeNeedsTwoModels:
    "Supertryb wymaga co najmniej dwóch gotowych modeli na ekranie głównym.",
  ulraModeAllModelsFailed:
    "Wszystkie modele supertrybu zawiodły, zanim udało się zsyntetyzować odpowiedź.",
  ulraModePartialFailureNotice: ({ failed, succeeded }) =>
    `${failed} wewnętrznych wywołań modeli nie powiodło się; odpowiedź końcowa wykorzystała ${succeeded} udanych wypowiedzi.`,
  sttTabDescription:
    "Kontroluj, w jaki sposób przechwytywana jest mowa i który backend zamienia dźwięk na tekst, zanim dotrze do modelu.",
  ttsTabDescription:
    "Kontroluj, kiedy odpowiedzi zaczynają być wypowiadane i który backend obsługuje komunikaty głosowe.",
  brief: "Krótkie",
  briefDescription:
    "Odpowiadaj zwięźle. Użyj minimalnej liczby zdań potrzebnych do pełnej odpowiedzi użytkownikowi.",
  normal: "Normalne",
  normalDescription:
    "Dąż do zrównoważonej długości odpowiedzi. Omów ważne punkty, nie przeciągając odpowiedzi.",
  thorough: "Dokładne",
  thoroughDescription:
    "Wejdź głęboko i bądź kompleksowy. Uwzględnij niuanse, szczegóły, kompromisy i uzasadnienie, które ma znaczenie.",
  professional: "Profesjonalny",
  professionalDescription:
    "Mów jak starszy konsultant przeprowadzający odprawę dla klienta. Precyzyjny język, bez slangu, wyważony i autorytatywny.",
  casual: "Swobodny",
  casualDescription:
    "Mów jak mądry przyjaciel w kawiarni. Swobodnie, naturalnie, rozmownie. Potoczne skróty są w porządku, dygresje też.",
  nerdy: "Nerdowski",
  nerdyDescription:
    "Mów jak entuzjastyczny ekspert, który uwielbia zagłębiać się w szczegóły. Swobodnie używaj terminologii technicznej, interesuj się szczegółami i zakładaj, że użytkownik może nadążyć.",
  concise: "Zwięzłe",
  conciseDescription:
    "Bądź tak krótki, jak to możliwe, a jednocześnie kompletny. Bez wstępu, bez wypełniaczy, po prostu odpowiedź. Pomyśl o stylu telegramu.",
  socratic: "Sokratejski",
  socraticDescription:
    "Podważaj myślenie użytkownika. Zadawaj kontrpytania, proponuj alternatywne punkty widzenia, nie tylko potwierdzaj to, co powiedział. Bądź partnerem do sparingu, a nie maszyną do przytakiwania.",
  eli5: "ELI5",
  eli5Description:
    "Wyjaśniaj wszystko tak prosto, jak to możliwe. Używaj analogii, języka potocznego, zero żargonu. Załóż, że odbiorca nie ma żadnej wcześniejszej wiedzy na żaden temat.",
  useProvider: ({ provider }) => `Użyj ${provider}`,
  createApiKey: "Poświadczenia",
  apiKey: "Klucz API",
  aboutThisProvider: "Informacje o tym dostawcy",
  openRouterOnboardingTitle: "Jeden klucz, wielu dostawców",
  openRouterOnboardingDescription:
    "Utwórz dedykowany klucz OpenRouter, wklej go poniżej i korzystaj z modeli opartych na migawkach od kilku dostawców bez konieczności wymiany bezpośredniego połączenia.",
  openRouterOnboardingRoute:
    "Ścieżka żądania: to urządzenie → OpenRouter → wybrany dostawca nadrzędny",
  openRouterKeys: "Klucze OpenRouter",
  providerStatusInvalid: "Nieprawidłowe",
  providerStatusTesting: "Testowanie",
  providerStatusConfigured: "Skonfigurowane",
  providerStatusWorking: "Działa",
  providerStatusNotTested: "Nie testowano",
  providerStatusNotSetup: "Nie skonfigurowano",
  expandProvider: ({ provider }) => `Rozwiń ${provider}`,
  collapseProvider: ({ provider }) => `Zwiń ${provider}`,
  testProviderKey: "Przetestuj klucz",
  testAllCapabilities: "Przetestuj wszystko",
  apiTest: "Test API",
  testProviderCapability: ({ capability }) => `Przetestuj ${capability}`,
  test: "Testuj",
  optional: "Opcjonalne",
  providerCapability_llm: "Odpowiedzi",
  providerCapability_stt: "Wejście mowy",
  providerCapability_tts: "Wyjście głosowe",
  providerCapability_search: "Wyszukiwanie w Internecie",
  providerCapability_voices: "Biblioteka głosowa",
  providerValidationUnavailable:
    "Weryfikacja na żywo nie jest jeszcze dostępna dla tego dostawcy. Zapisz tutaj klucz i zweryfikuj go podczas rzeczywistego użycia.",
  providerNeedsAttention: "potrzebuje uwagi",
  catalogProviderLimitsSummary: ({ summary }) => `Limity: ${summary}`,
  catalogProviderRegionSummary: ({ summary }) => `Region: ${summary}`,
  validatingKey: "Sprawdzanie poprawności...",
  showKey: "Pokaż klucz",
  hideKey: "Ukryj klucz",
  assistantInstructions: "Instrukcje Asystenta",
  systemPrompt: "Monit systemowy",
  aboutSystemPrompt: "Informacje na temat monitu systemowego",
  assistantInstructionsIntro:
    "Kształtuj ukryte wskazówki, które model otrzymuje przed każdą odpowiedzią.",
  baseInstructions: "Instrukcje bazowe",
  assistantInstructionsPlaceholder:
    "Określ, jak powinien zachowywać się asystent.",
  assistantInstructionsHint:
    "Jest to zawsze dodawane przed wybraną długością i tonem odpowiedzi.",
  adaptiveLength: "Długość adaptacyjna",
  responseTone: "Ton odpowiedzi",
  homeStyleChipLabel: ({ tone, length }) => `Styl — ${tone} · ${length}`,
  styleSheetTitle: "Ustawienia rozmowy",
  styleSheetSubtitle: "Kształtuj odpowiedzi i mowę tylko dla tej konwersacji.",
  openStyleSheet: "Otwórz ustawienia rozmowy",
  conversationThinkingInstructions: "Instrukcje myślenia",
  conversationThinkingInstructionsDescription:
    "Dodaj instrukcje po globalnym monicie systemowym dla tej rozmowy.",
  conversationThinkingInstructionsPlaceholder:
    "Na przykład: Podważ moje założenia i użyj konkretnych przykładów.",
  ttsInstructions: "Instrukcje dotyczące sposobu mówienia",
  ttsInstructionsDescription:
    "Kieruj tonem, tempem, akcentem i sposobem mówienia używanymi przez kompatybilne modele mowy.",
  conversationTtsInstructionsDescription:
    "Dodaj instrukcje dotyczące sposobu mówienia po globalnych instrukcjach mowy dla tej rozmowy.",
  ttsInstructionsPlaceholder:
    "Na przykład: Mów ciepło, wyraźnie i w spokojnym tempie.",
  ttsInstructionsUnsupported:
    "Bieżąca trasa mowy nie obsługuje instrukcji dotyczących sposobu mówienia.",
  conversationVoiceDescription: ({ route }) =>
    `Wybierz głos używany przez ${route} w tej rozmowie.`,
  scrollToLatest: "Przewiń do ostatniej wiadomości",
  conversationTitleGenerate: "Wygeneruj tytuł automatycznie",
  conversationTitleGenerating: "Generuję tytuł…",
  conversationTitleGenerated: "Zmieniono nazwę rozmowy.",
  conversationTitleNeedsContent:
    "Rozpocznij rozmowę przed wygenerowaniem tytułu.",
  conversationTitleNeedsProvider:
    "Skonfiguruj wybrany model przed wygenerowaniem tytułu.",
  conversationTitleGenerationFailed:
    "Nie udało się wygenerować tytułu rozmowy.",
  conversationTitleGenerationTimedOut:
    "Generowanie tytułu trwało zbyt długo. Spróbuj ponownie.",
  inputMode: "Tryb wprowadzania",
  voiceInput: "Wprowadzanie głosowe",
  pushToTalk: "Naciśnij i mów",
  pushToTalkDescription:
    "Przytrzymaj główny przycisk podczas mówienia, a następnie zwolnij, aby wysłać.",
  toggleToTalk: "Przełączaj, aby mówić",
  toggleToTalkDescription:
    "Stuknij raz, aby rozpocząć nagrywanie, a gdy skończysz, stuknij ponownie.",
  driveSession: "Sesja jazdy",
  driveSessionDescription:
    "Gdy włączona jest automatyczna kontynuacja, nagrywanie rozpoczyna się po każdej wypowiedzianej odpowiedzi. Po zakończeniu mówienia dotknij głównego przycisku.",
  stopDriveSession: "Wstrzymaj tryb auto",
  repeatDriveReply: "Powtórz ostatnią",
  continueDriveSession: "Wznów tryb auto",
  driveSendsIn: ({ seconds }) => `Wysyłka za ${seconds}…`,
  speechToText: "Mowa na tekst",
  appNative: "Rozpoznawanie systemowe",
  nativeSttDescription:
    "Użyj modułu rozpoznawania mowy systemu operacyjnego.",
  provider: "Dostawca",
  webSearchProvider: "Dostawca wyszukiwania internetowego",
  webSearchProviderMissingHint:
    "Skonfiguruj co najmniej jedną usługę z obsługą wyszukiwania w Poświadczeniach, aby włączyć tutaj kontekst z internetu.",
  webSearchModelHint: ({ model }) =>
    `Używa ${model} w tle do pobierania aktualnego kontekstu z internetu.`,
  webSearchHomeHint:
    "Użyj przełącznika na ekranie głównym, aby włączyć lub wyłączyć kontekst z internetu dla tego wątku.",
  settingsWebSearchCompactHint:
    "Opcjonalnie dodaj nowy kontekst sieciowy przed odpowiedziami głównego modelu.",
  webSearchAdvanced: "Zaawansowane sterowanie wyszukiwaniem",
  expandAdvancedSearch: "Rozwiń zaawansowane opcje wyszukiwania",
  collapseAdvancedSearch: "Zwiń zaawansowane opcje wyszukiwania",
  webSearchSetupNeeded:
    "Dodaj dane uwierzytelniające, aby korzystać z wyszukiwania internetowego na żywo.",
  webSearchEnabledDescription:
    "Przed odpowiedzią modelu dodawany jest świeży kontekst sieciowy.",
  webSearchDisabledDescription:
    "Jeśli aktualne fakty mają znaczenie, użyj aktywnego kontekstu sieciowego w tym wątku.",
  webSearchNobodyDescription:
    "Bez zapytań do sieci. Odpowiada z wiedzy modelu.",
  webSearchQualityControls: "Jakość wyszukiwania",
  webSearchSearchMode: "Tryb wyszukiwania",
  webSearchSearchModeQuick: "Szybki",
  webSearchSearchModeBalanced: "Zrównoważony",
  webSearchSearchModeDeep: "Głęboki",
  webSearchDepth: "Głębokość wyszukiwania",
  webSearchDepthStandard: "Standardowe",
  webSearchDepthDeep: "Głębokie",
  webSearchResultCount: "Liczba wyników",
  webSearchQualityHint: ({ provider }) =>
    `Te elementy sterujące regulują sposób, w jaki ${provider} zbiera nowy kontekst przed odpowiedzią.`,
  webSearchNoExtraControls: ({ provider }) =>
    `${provider} nie udostępnia jeszcze w tej aplikacji dodatkowych elementów sterujących jakością wyszukiwania.`,
  setWebSearchMode: ({ mode }) =>
    `Ustaw tryb wyszukiwania w Internecie na ${mode}`,
  openWebSearchSettings: "Otwórz ustawienia wyszukiwania internetowego",
  providerSttDescription:
    "Skorzystaj ze skonfigurowanej usługi zewnętrznej, aby dokonać transkrypcji głosu przed wysłaniem go do trasy odpowiedzi.",
  sttProvider: "Dostawca STT",
  sttProviderEnabledHint:
    "Tutaj pojawiają się tylko włączeni dostawcy obsługujący transkrypcję.",
  sttProviderMissingHint:
    "Dodaj dane uwierzytelniające dla usługi z obsługą STT, aby wybrać ją tutaj.",
  nativeSttHint:
    "Rozpoznawanie systemowe działa niezależnie od kluczy dostawcy i może być przetwarzane na urządzeniu lub przez usługę mowy systemu operacyjnego.",
  replyPlayback: "Odtwarzanie odpowiedzi",
  sentencesArrive: "Nadchodzą akapity",
  sentencesArriveDescription:
    "Zacznij mówić, gdy tylko cały akapit będzie gotowy.",
  fullReplyFirst: "Najpierw pełna odpowiedź",
  fullReplyFirstDescription:
    "Najpierw wygeneruj całą odpowiedź, a następnie odtwórz ją w jednym przebiegu.",
  textToSpeech: "Tekst na mowę",
  spokenReplies: "Odpowiedzi mówione",
  spokenRepliesEnabledDescription:
    "Czytaj na głos odpowiedzi asystenta, jeśli dostępna jest trasa głosowa.",
  spokenRepliesDisabledDescription:
    "Na razie odpowiedzi będą miały wyłącznie formę tekstową. Twoja preferowana trasa TTS pozostaje zapisana na później.",
  nativeTtsDescription:
    "Użyj aparatu mowy urządzenia do odpowiedzi głosowych i podglądu głosowego.",
  kokoroTtsDescription:
    "Używaj znacznie bardziej naturalnego głosu neuronowego działającego w całości na tym urządzeniu. Tekst odpowiedzi mówionej jest syntetyzowany lokalnie, bez klucza dostawcy mowy ani opłat za użytkowanie.",
  kokoroVoices: "Głosy Kokoro na urządzeniu",
  kokoroVoicesHint: ({ size, installedSize }) =>
    `Model wielojęzyczny pobiera około ${size} MB i zajmuje po instalacji około ${installedSize} MB.`,
  kokoroModel: "Model wielojęzyczny Kokoro",
  kokoroChecking: "Sprawdzam model na urządzeniu…",
  kokoroDownloading: ({ progress }) => `Pobieram… ${progress}%`,
  kokoroExtracting: ({ progress }) => `Instaluję… ${progress}%`,
  kokoroVerifying: "Weryfikuję silnik głosowy…",
  kokoroInstalled: "Zainstalowany i gotowy na tym urządzeniu.",
  kokoroNotInstalled:
    "Pobierz i zweryfikuj model, zanim wybierzesz lub użyjesz Kokoro. Nie jest wymagany żaden klucz dostawcy.",
  kokoroLanguageFallback:
    "Kokoro obecnie mówi tutaj w języku angielskim i chińskim uproszczonym. W przypadku innych wybranych języków odpowiedzi dodaj wyraźną trasę rezerwową, w przeciwnym razie mowa zostanie zatrzymana z powodu błędu.",
  kokoroRemoveTitle: "Usunąć model Kokoro?",
  kokoroRemoveBody: ({ installedSize }) =>
    `Zwalnia to około ${installedSize} MB. W każdej chwili możesz pobrać model ponownie.`,
  removeKokoroModel: "Usuń model Kokoro",
  downloadKokoroModel: "Pobierz model Kokoro",
  kokoroFallbackNeeded: ({ languages }) =>
    `Wyraźna trasa rezerwowa jest wymagana dla: ${languages}.`,
  kokoroNoSelectedLanguages:
    "Wybierz opcję Angielski lub Chiński uproszczony w obszarze Języki słuchania, aby skonfigurować głos Kokoro.",
  expandVoiceSettings: ({ language }) => `Rozwiń ustawienia głosu ${language}`,
  collapseVoiceSettings: ({ language }) => `Zwiń ustawienia głosu ${language}`,
  remove: "Usuń",
  voiceOutputDescription:
    "Wybierz silnik mowy, języki słuchania i podgląd głosu dla odpowiedzi głosowych.",
  localTts: "Lokalny",
  localTtsDescription:
    "Do odpowiedzi głosowych użyj pasującego, pobranego lokalnego głosu.",
  providerTtsDescription:
    "Użyj wybranej skonfigurowanej usługi do odpowiedzi głosowych.",
  ttsFallbackRoutes: "Trasy rezerwowe",
  ttsFallbackRoutesHint:
    "Opcjonalne. Dodaj tylko te trasy, które chcesz, w kolejności, w jakiej powinny być wypróbowane. Gdy trasa zacznie mówić, Mr Broccoli pozostanie na niej do końca odpowiedzi.",
  ttsFallbackNone:
    "Nie skonfigurowano żadnej trasy rezerwowej. Zamiast tego zostanie wyświetlony błąd głosu.",
  ttsFallbackPosition: ({ position, route }) => `${position}. ${route}`,
  addFallbackRoute: ({ route }) => `Dodaj trasę rezerwową ${route}`,
  removeFallbackRoute: ({ route }) => `Usuń trasę rezerwową ${route}`,
  moveFallbackEarlier: ({ route }) => `Przenieś ${route} wcześniej`,
  moveFallbackLater: ({ route }) => `Przenieś ${route} później`,
  ttsProvider: "Dostawca TTS",
  ttsProviderEnabledHint:
    "Tutaj pojawiają się tylko dostawcy z włączoną obsługą odpowiedzi głosowych.",
  ttsProviderMissingHint:
    "Dodaj dane uwierzytelniające dla usługi z obsługą TTS, aby wybrać ją tutaj.",
  localTtsOrderHint:
    "Próbowane są tylko jawnie skonfigurowane trasy rezerwowe.",
  providerTtsOrderHint:
    "Próbowane są tylko jawnie skonfigurowane trasy rezerwowe.",
  nativeTtsHint:
    "Natywny TTS wykorzystuje systemowy stos głosowy i nie wymaga klucza dostawcy.",
  localTtsLanguageCoverageHint:
    "Pakiety lokalne obejmują obecnie język angielski, niemiecki, chiński uproszczony, hiszpański, portugalski, hindi, francuski i włoski.",
  ttsVoice: "Głos TTS",
  refresh: "Odśwież",
  providerVoiceDirectory: ({ provider }) => `Biblioteka głosowa ${provider}`,
  refreshProviderVoices: ({ provider }) => `Odśwież głosy ${provider}`,
  providerVoicesAvailable: ({ count, provider }) =>
    `${provider}: dostępnych głosów: ${count}`,
  providerVoicesLoadFailed:
    "Nie udało się odświeżyć głosów. Twój obecny wybór pozostaje niezmieniony; nadal możesz ręcznie wprowadzić identyfikator głosu.",
  providerVoicesLoadFailedWithFallback:
    "Nie udało się wczytać głosów konta. Wbudowany głos pozostaje dostępny.",
  providerVoicesErrorDetail: ({ detail }) => `Powód: ${detail}`,
  elevenLabsVoicesReadPermissionHint:
    "W ElevenLabs edytuj ten klucz API i włącz Głosy → Czytaj, a następnie odśwież tutaj.",
  providerVoicesLoadingHint: ({ provider }) =>
    `Mr Broccoli automatycznie ładuje dostępne głosy z ${provider}.`,
  providerVoiceId: "Identyfikator głosu",
  providerVoiceIdPlaceholder: "Wprowadź identyfikator głosu",
  providerVoiceIdFallbackHint:
    "Wprowadzanie ręczne pozostaje dostępne, gdy nie można załadować biblioteki głosowej.",
  providerVoiceIdRequired: ({ provider }) =>
    `Odśwież bibliotekę głosową ${provider} lub wprowadź identyfikator głosu przed użyciem mowy.`,
  qwenSpeechUnavailableInUs:
    "Obecne trasy mowy Qwen w Mr Broccoli nie są dostępne w regionie USA. Dla mowy Qwen wybierz Singapur lub Pekin.",
  qwenApiRegion: "Region API Qwen",
  qwenRegionSingapore: "Singapur",
  qwenRegionUs: "USA (Wirginia)",
  qwenRegionBeijing: "Chiny (Pekin)",
  qwenRegionHint:
    "Wybrany region musi odpowiadać regionowi, w którym utworzono ten klucz API.",
  qwenRegionUsSpeechHint:
    "Klucze regionu USA obsługują tutaj czat i wyszukiwanie w Internecie. Obecne trasy Qwen STT i TTS w Mr Broccoli wymagają klucza z Singapuru lub Pekinu.",
  providerDefaultVoiceHint:
    "Ten dostawca używa obecnie domyślnego głosu do podglądu i odpowiedzi głosowych.",
  listenLanguages: "Języki słuchania",
  listenLanguagesHint:
    "Wybierz języki odpowiedzi, które mają dobrze brzmieć. Mr Broccoli wypróbowuje je w tej kolejności podczas kierowania wyjścia mowy.",
  listenLanguagesSelected: ({ count }) =>
    count === 1 ? "Wybrano 1 język" : `Wybrano języków: ${count}`,
  localVoicePacks: "Lokalne pakiety głosowe",
  localVoicePacksHint:
    "Każdy język zachowuje swój własny, lokalny głos. Wybierz żądany głos dla tego języka, a następnie pobierz tylko te pakiety, na których naprawdę Ci zależy.",
  localVoiceForLanguage: ({ languageLabel }) => `Głos dla ${languageLabel}`,
  providerVoicePreviews: "Podglądy głosu dostawcy",
  providerVoicePreviewsHint:
    "Przetestuj tutaj aktualnie wybraną trasę TTS z oddzielnym tekstem podglądu dla każdego języka odpowiedzi.",
  nativeVoicePreviewSection: "Podgląd głosu natywnego",
  nativeVoicePreviewSectionHint:
    "Mówi on bezpośrednio przez wbudowany syntezator mowy w telefonie, dzięki czemu można go porównać ze skonfigurowanymi głosami dostawców.",
  nativeVoiceUnavailable:
    "To urządzenie nie zgłosiło żadnych natywnych głosów systemowych do podglądu.",
  runtimeCompatibilityOverrides: "Zgodność w czasie działania",
  runtimeCompatibilityOverridesDescription: ({ count }) =>
    `${count} konfiguracji modeli lub ustawień, których niedostępność potwierdził dostawca, jest wyłączonych tylko na tym urządzeniu. Mr Broccoli automatycznie je omija.`,
  clearRuntimeCompatibilityOverrides: "Wyczyść zgodność w czasie działania",
  clearRuntimeCompatibilityOverridesConfirmationTitle:
    "Wyczyścić zgodność w czasie działania?",
  clearRuntimeCompatibilityOverridesConfirmationMessage:
    "Wcześniej wyłączone konfiguracje będzie można ponownie wypróbować. Dostawca może ponownie je odrzucić.",
  speechDiagnostics: "Ostatnia aktywność związana z mową",
  speechDiagnosticsHint:
    "Pokazuje najnowsze żądania mowy, trasę, o którą prosiły, trasę faktycznie użytą oraz ewentualny powód użycia trasy rezerwowej.",
  clearSpeechDiagnostics: "Wyczyść ostatnią aktywność związaną z mową",
  speechDiagnosticsEmpty:
    "Nie ma jeszcze żadnych żądań mowy. Odtwórz podgląd głosu lub odpowiedź, aby zobaczyć tutaj szczegóły routingu.",
  clearSpeechDiagnosticsConfirmationTitle:
    "Wyczyścić ostatnią aktywność związaną z mową?",
  clearSpeechDiagnosticsConfirmationMessage:
    "Spowoduje to usunięcie całej przechwyconej diagnostyki routingu mowy. Tej akcji nie można cofnąć.",
  speechDiagnosticSourceConversation: "Odpowiedź w rozmowie",
  speechDiagnosticSourceRepeat: "Powtórzenie odpowiedzi",
  speechDiagnosticSourcePreview: "Podgląd głosu",
  speechDiagnosticSourceUnknown: "Żądanie mowy",
  speechDiagnosticRouteLine: ({ requested, actual }) =>
    `Żądane: ${requested} -> Rzeczywiste: ${actual}`,
  speechDiagnosticStageLine: ({ stage }) => `Ostatni etap: ${stage}`,
  speechDiagnosticLanguageLine: ({ languageLabel }) =>
    `Język: ${languageLabel}`,
  speechDiagnosticProviderLine: ({ provider }) => `Dostawca: ${provider}`,
  speechDiagnosticVoiceLine: ({ voice }) => `Głos: ${voice}`,
  localTtsPackReady: "Zainstalowany na tym urządzeniu.",
  localTtsPackBroken:
    "Pobrano, ale ten głos nie przeszedł lokalnej weryfikacji na tym urządzeniu. Pobierz go ponownie lub wybierz inny głos.",
  localTtsPackMissing:
    "Jeszcze nie zainstalowany. Do momentu pobrania będzie używany Cloud TTS lub głos systemowy.",
  localTtsUnsupportedLanguageFallback:
    "Pakiet lokalny nie jest jeszcze dostępny dla tego języka. Obsłuży to Cloud TTS lub głos systemowy.",
  downloadingLocalTtsPack: ({ progress }) =>
    `Pobieram pakiet lokalny... ${progress}%`,
  download: "Pobierz",
  downloadingShort: "Ładowanie...",
  voicePreviewText: "Tekst podglądu głosowego",
  voicePreviewPlaceholder: "Wpisz frazę, aby usłyszeć ten głos.",
  voicePreviewHint:
    "Używa aktualnie wybranego backendu odpowiedzi głosowej bez wysyłania czegokolwiek do modelu językowego.",
  previewVoice: "Podgląd głosu",
  generatingPreview: "Generowanie podglądu...",
  playingPreview: "Odtwarzam podgląd...",
  systemVoice: "Głos systemowy",
  spokenRepliesOff: "Tylko tekst",
  noTtsProvider: "Brak dostawcy TTS",
  nothingToCopyYet: "Jeszcze nie ma nic do skopiowania.",
  couldntCopyText: "Nie udało się skopiować tego tekstu.",
  nothingToShareYet: "Jeszcze nie ma nic do udostępnienia.",
  couldntShareText: "Nie udało się udostępnić tego tekstu.",
  couldntReplayReply: "Nie udało się odtworzyć tej odpowiedzi.",
  replyFailed: "Odpowiedź nie powiodła się",
  retryReply: "Spróbuj odpowiedzieć ponownie",
  replyFailedHint: "Przed ponowną próbą możesz wybrać inny model powyżej.",
  spokenReplyFailed:
    "Odpowiedź została zapisana, ale nie można jej było wypowiedzieć.",
  retrySpeech: "Ponów mowę",
  openSpeakingSettings: "Ustawienia mówienia",
  messageCopied: "Wiadomość skopiowana.",
  noConversationToCopyYet: "Nie ma jeszcze rozmowy do skopiowania.",
  noConversationToShareYet: "Nie ma jeszcze żadnej rozmowy do udostępnienia.",
  noReplyToRepeatYet: "Nie ma jeszcze odpowiedzi na powtórkę.",
  threadCopied: "Wątek skopiowany.",
  threadRenamed: "Zmieniono nazwę wątku.",
  threadPinned: "Wątek przypięty.",
  threadUnpinned: "Wątek odpięty.",
  addProviderKeyToUseProvider: ({ provider }) =>
    `Przed użyciem tej trasy dodaj poświadczenia dla ${provider} w Ustawieniach.`,
  configureCredentialsBeforeVoiceSession:
    "Dodaj dane uwierzytelniające w Ustawieniach przed rozpoczęciem sesji głosowej.",
  endpointCredentialFormatInvalid: ({ provider }) =>
    `W przypadku ${provider} wprowadź podstawowy adres URL dostawcy i klucz API jako https://your-endpoint.example.com|your-api-key.`,
  speechRecognitionUnavailableOnDevice:
    "Rozpoznawanie mowy jest niedostępne na tym urządzeniu.",
  debugLogLabel: "LOG",
  debugLogCaptureStarted: "Rozpoczęto rejestrowanie debugowania.",
  debugLogCaptureStopped: ({ entryCount, fileName }) =>
    `Dziennik debugowania zapisany jako ${fileName} i skopiowany do schowka (wpisów: ${entryCount}).`,
  debugLogCaptureStoppedNoClipboard: ({ entryCount, fileName }) =>
    `Dziennik debugowania zapisany jako ${fileName} (wpisów: ${entryCount}).`,
  debugLogCaptureRecovered: ({ entryCount, fileName }) =>
    `Odzyskano poprzedni dziennik debugowania ${fileName} i skopiowano go do schowka (wpisów: ${entryCount}).`,
  debugLogCaptureRecoveredNoClipboard: ({ entryCount, fileName }) =>
    `Odzyskano poprzedni dziennik debugowania ${fileName} (wpisów: ${entryCount}).`,
  debugLogCaptureFailed: "Nie można zapisać dziennika debugowania.",
  chooseSttBeforeVoiceSession:
    "Przed rozpoczęciem sesji głosowej wybierz skonfigurowaną trasę STT w Ustawieniach.",
  chooseTtsBeforeSpokenReplies:
    "Przed użyciem odpowiedzi głosowych wybierz skonfigurowaną trasę TTS w Ustawieniach.",
  stopSessionBeforeReplay:
    "Zatrzymaj aktywną sesję głosową przed ponownym odtworzeniem ostatniej odpowiedzi.",
  couldntCatchThatTryAgain: "Nie udało się tego uchwycić. Spróbuj ponownie.",
  couldntStartVoiceInput: "Nie udało się rozpocząć wprowadzania głosowego.",
  couldntProcessVoiceInput: "Nie udało się przetworzyć wprowadzania głosowego.",
  maxRecordingLengthReached:
    "Osiągnięto maksymalną długość nagrania — wysyłam to, co mam.",
  sttRecordingTooLarge: ({ provider, limit }) =>
    `To nagranie jest za długie dla zamiany mowy na tekst ${provider} (maks. ${limit}). Wypróbuj krótszą wiadomość lub przełącz zamianę mowy na tekst na rozpoznawanie systemowe.`,
  addProviderKeyToEnableProvider: ({ provider }) =>
    `Przed użyciem tej trasy dodaj poświadczenia dla ${provider} w Ustawieniach.`,
  stopSessionBeforePreview:
    "Zatrzymaj aktywną sesję głosową przed wyświetleniem podglądu głosu.",
  chooseTtsToPreviewVoices:
    "Wybierz skonfigurowaną trasę TTS w Ustawieniach, aby wyświetlić podgląd głosów.",
  downloadSelectedLocalVoiceFirst: ({ languageLabel }) =>
    `Najpierw pobierz wybrany głos lokalny ${languageLabel}.`,
  couldntPreviewVoice: "Nie udało się wyświetlić podglądu głosu.",
  spokenRepliesDisabled: "Odpowiedzi głosowe są wyłączone w Ustawieniach.",
  providerVoiceFallback:
    "Skonfigurowana trasa głosowa nie powiodła się. Przełączono tę odpowiedź na głos rezerwowy.",
  localVoiceFallback:
    "Lokalny głos był niedostępny. Przełączono tę odpowiedź na głos rezerwowy.",
  localTtsPackInstalled: ({ languageLabel }) =>
    `Zainstalowano lokalny pakiet głosowy ${languageLabel}.`,
  localTtsPackInstallFailed:
    "Nie można zainstalować lokalnego pakietu głosowego.",
  clear: "Wyczyść",
  voiceOutput: "Wyjście głosowe",
  speechReplayCache: "Pamięć podręczna mowy",
  speechReplayCacheDescription:
    "Mowa wygenerowana przez dostawcę pozostaje na tym urządzeniu do 14 dni, więc ponowne odtworzenie odpowiedzi nie zużywa kolejnych kredytów głosowych.",
  clearSpeechReplayCache: "Wyczyść pamięć podręczną mowy",
  speechReplayCacheCleared: "Usunięto pliki z pamięci podręcznej mowy.",
  speechReplayCacheClearFailed:
    "Nie udało się wyczyścić pamięci podręcznej mowy.",
  listeningToYourVoice: "Słuchanie Twojego głosu",
  parsingYourVoiceInput: "Zamiana głosu na tekst",
  preparingRequest: "Przygotowanie Twojej prośby",
  searchingTheWeb: "Przeszukiwanie sieci w poszukiwaniu świeżego kontekstu",
  waitingForProvider: ({ provider }) => `Czekam na ${provider}`,
  preparingVoiceWithProvider: ({ provider }) =>
    `Przygotowanie głosu za pomocą ${provider}`,
  deepThinkingReassurance: "Dobre odpowiedzi wymagają chwili…",
  thinkingElapsed: ({ detail, seconds }) => `${detail} · ${seconds} s`,
  speakingBackToYou: "Mówię do Ciebie",
  freshSession: "Świeża sesja",
  messageCount: ({ count }) =>
    Number(count) === 1 ? "1 wiadomość" : `${count} wiadomości`,
  conversation: "Rozmowa",
  conversationActions: "Działania konwersacyjne",
  statusDetails: "Szczegóły statusu",
  persistenceFailure:
    "Mr Broccoli nie mógł zapisać danych na tym urządzeniu. Pozostaw aplikację otwartą i spróbuj ponownie; ostatnie zmiany mogą zostać utracone po ponownym uruchomieniu.",
  show: "Pokaż",
  showTranscript: "Pokaż transkrypcję",
  hide: "Ukryj",
  copyThread: "Skopiuj wątek",
  shareThread: "Udostępnij wątek",
  reportResponse: "Zgłoś tę odpowiedź",
  reportResponseIntro:
    "Zgłoszenie odpowiedzi AI z Mr Broccoli. Sprawdź poniższą treść, opisz problem i wyślij to zgłoszenie do dewelopera.",
  repeatReply: "Powtórz odpowiedź",
  renameThread: "Zmień nazwę wątku",
  renameThreadHint:
    "Nadaj tej rozmowie tytuł, który będziesz mógł szybko znaleźć później.",
  threadTitle: "Tytuł wątku",
  noTranscriptYet: "Nie ma jeszcze transkrypcji",
  previewTranscriptEmptyDescription:
    "Aby rozpocząć, użyj głosu lub tekstu. Twoja rozmowa pojawi się tutaj.",
  noConversationYet: "Nie ma jeszcze rozmowy",
  expandedTranscriptEmptyDescription:
    "Aby rozpocząć, użyj głosu lub tekstu. Zamknij ten ekran, jeśli chcesz wrócić do głównej sceny.",
  transcriptSelectionHint:
    "Wybierz bezpośrednio dowolny tekst wiadomości lub udostępnij i skopiuj poszczególne wiadomości poniżej.",
  textMessagePlaceholder: "Wpisz wiadomość",
  sendTextMessage: "Wyślij wiadomość",
  showVoiceInput: "Pokaż wprowadzanie głosowe",
  showTextInput: "Pokaż wprowadzanie tekstu",
  usageStatsHiddenDescription:
    "Trzymaj szacunki tokenów poza interfejsem transkrypcji.",
  usageStatsVisibleDescription:
    "Pokaż szacowane zużycie tokenów dla odpowiedzi oraz sumy dla całej rozmowy.",
  debugLogButton: "Przycisk dziennika debugowania",
  debugLogButtonHiddenDescription:
    "Ukryj przycisk LOG na ekranie głównym, chyba że przechwytywanie jest już uruchomione.",
  debugLogButtonVisibleDescription:
    "Wyświetl przycisk LOG na ekranie głównym, umożliwiający rozpoczynanie i zatrzymywanie przechwytywania debugowania.",
  debugLogButtonUsageDescription:
    "Sposób użycia przycisku: włączenie go spowoduje rozpoczęcie przechwytywania logów. Wyłączenie tej opcji spowoduje zatrzymanie przechwytywania logów i przeniesienie przechwyconych do schowka.",
  estimatedUsageTitle: "Szacowane użycie",
  estimatedUsageCounts: ({ replies, summaries }) =>
    `Odpowiedzi ${replies} · Aktualizacje pamięci ${summaries}`,
  estimatedUsageConversationScope:
    "Sumy obejmują każdą trasę i model użyte w tej rozmowie.",
  estimatedPromptTokens: ({ count }) => `Prompt: ${count}`,
  estimatedReplyTokens: ({ count }) => `Odpowiedź: ${count}`,
  estimatedTotalTokens: ({ count }) => `Razem: ${count}`,
  estimatedUsageInline: ({ prompt, completion, total }) =>
    `Szac. ${prompt} wejście · ${completion} wyjście · ${total} łącznie`,
  searchQuery: "Zapytanie wyszukiwania",
  expandWebSearchDetails: "Pokaż szczegóły wyszukiwania w Internecie",
  collapseWebSearchDetails: "Ukryj szczegóły wyszukiwania w Internecie",
  webSearchSourceCount: ({ count }) => `Źródła: ${count}`,
  sources: "Źródła",
  openSourceLink: ({ source }) => `Otwórz źródło: ${source}`,
  turnReceipt: "Szczegóły tury",
  expandTurnReceipt: "Pokaż szczegóły tury",
  collapseTurnReceipt: "Ukryj szczegóły tury",
  turnReceiptDirect: "Bezpośrednie",
  turnReceiptRequested: "Żądana trasa odpowiedzi",
  turnReceiptActual: "Rzeczywista trasa odpowiedzi",
  turnReceiptEffort: "Kontrola rozumowania",
  turnReceiptProviderNative: "natywne dla dostawcy",
  turnReceiptInput: "Trasa wejściowa",
  turnReceiptSearch: "Wyszukiwanie w Internecie",
  turnReceiptVoice: "Wyjście głosowe",
  turnReceiptContext: "Kontekst",
  turnReceiptTiming: "Czas",
  turnReceiptFallback: "Powód użycia trasy rezerwowej",
  turnReceiptVoiceInput: "Głos",
  turnReceiptTypedInput: "Wpisane",
  turnReceiptSystemSpeech: "Systemowe rozpoznawanie mowy",
  turnReceiptSystemVoice: "Głos systemowy",
  turnReceiptSystemVoiceFallback: "Głos systemowy · rezerwowy",
  turnReceiptOff: "Wyłączone",
  turnReceiptNotConfigured: "Włączone · nieskonfigurowane",
  turnReceiptFallbackWithoutSearch: "Kontynuacja bez wyszukiwania na żywo",
  turnReceiptNotUsed: "Nie używany",
  turnReceiptSummaryReused: "zapisane podsumowanie wykorzystane ponownie",
  turnReceiptSummaryUpdated: "podsumowanie zaktualizowane",
  turnReceiptContextFallback: "rezerwowo użyto ostatnich wiadomości",
  turnReceiptGatewayCompression: ({ original, compressed }) =>
    `brama skompresowała ${original} do ${compressed} wiadomości`,
  turnReceiptContextValue: ({ sent, total, summarized, state }) =>
    `Wysłano ${sent}/${total} wcześniejszych wiadomości · nowo podsumowano: ${summarized}${state}`,
  turnReceiptTimingStt: "STT",
  turnReceiptTimingContext: "kontekst",
  turnReceiptTimingSearch: "wyszukiwanie",
  turnReceiptTimingModel: "model",
  turnReceiptTimingFirstSpeech: "pierwsza mowa",
  turnReceiptTimingTotal: "łącznie",
  estimatedRouteUsageTokensOnly: ({ tokens }) => `Tokeny: ${tokens}`,
  unknownUsageRoute: "Nieznana trasa",
  setupGuideConnectProviderTitle: "Skonfiguruj poświadczenia",
  setupGuideConnectProviderDescription:
    "Dodaj dane uwierzytelniające w Ustawieniach, a następnie wybierz trasy, których chcesz użyć.",
  idle: "Bezczynny",
  yourConversationAppearsHere: "Twoja rozmowa pojawi się tutaj",
  defaultTranscriptEmptyDescription:
    "Aby rozpocząć, użyj głosu lub tekstu. Mr Broccoli zachowa wątek i odpowie tutaj.",
  delete: "Usuń",
  deleteConversationConfirmationTitle: ({ title }) => `Usunąć „${title}”?`,
  deleteConversationConfirmationMessage:
    "Spowoduje to trwałe usunięcie rozmowy i wszystkich zawartych w niej wiadomości. Tej akcji nie można cofnąć.",
  conversations: "Rozmowy",
  drawerSubtitle: "Przeskakuj między aktywnymi wątkami lub otwórz nowy pokój.",
  newSession: "Nowa sesja",
  noSavedConversationsYet: "Nie ma jeszcze zapisanych rozmów",
  drawerEmptyDescription:
    "Zacznij mówić w widoku głównym, a Mr Broccoli automatycznie zbuduje sesję.",
  setupGuideTitle: "Skonfiguruj aplikację",
  setupGuideSubtitle:
    "Dodaj dane uwierzytelniające i wybierz trasy w Ustawieniach.",
  fastestStartPreset: "Minimalna konfiguracja",
  fastestStartDescription:
    "Jeśli to możliwe, używaj mowy urządzenia i konfiguruj tylko tę trasę odpowiedzi, której potrzebujesz.",
  fullVoicePreset: "Skonfigurowany głos",
  fullVoiceDescription:
    "Korzystaj ze skonfigurowanych usług do odpowiadania, transkrypcji i komunikatów głosowych, jeśli je wybierzesz.",
  setupGuideNote:
    "Następnie otworzymy Ustawienia, abyś mógł wkleić i zweryfikować dane uwierzytelniające.",
  useThisSetup: "Użyj tej konfiguracji",
  notNow: "Nie teraz",
  setupGuideIntroTitle: "Jak działa Mr Broccoli",
  setupGuideIntroBody:
    "Mr Broccoli zaczyna z czystą kartą. Dodaj dane uwierzytelniające do usług zewnętrznych, z których już korzystasz, a następnie wybierz sposób kierowania odpowiedzi, wprowadzania mowy i komunikatów głosowych oraz opcjonalnego kontekstu internetowego.",
  setupGuideIntroNote:
    "Po konfiguracji użyj głównego sterowania głosowego, aby rozpocząć i zakończyć rozmowę. Bieżący zapis pozostaje dostępny na ekranie głównym, a każdą trasę można później zmienić w Ustawieniach.",
  setupGuideProviderTitle: "Dodaj dane uwierzytelniające",
  setupGuideProviderBody:
    "Wybierz usługę zewnętrzną, którą chcesz skonfigurować, a następnie wklej dane uwierzytelniające z dostępem do odpowiedzi.",
  setupGuideProviderPickerLabel: "Usługa odpowiedzi",
  setupGuideSelectProvider: "Wybierz dostawcę",
  setupGuideSelectProviderFirst: "Najpierw wybierz dostawcę.",
  setupGuideApiKeyLabel: "Klucz API",
  setupGuideApiKeyPlaceholder: "Wklej dane uwierzytelniające",
  setupGuideContinue: "Kontynuuj",
  setupGuideOpenSettings: "Otwórz Ustawienia",
  setupGuideBack: "Powrót",
  setupGuideValidateKey: "Zweryfikuj klucz",
  setupGuideApiKeyRequiredOrCancel:
    "Dodaj klucz API, aby kontynuować, lub anuluj przewodnik konfiguracji.",
  setupGuideProviderAndApiKeyRequiredOrCancel:
    "Wybierz dostawcę i dodaj klucz API, aby kontynuować, lub anuluj przewodnik konfiguracji.",
  setupGuideProviderKeyNeedsLlmAccess: ({ provider }) =>
    `Te poświadczenia ${provider} nie pozwalają na żądania odpowiedzi.`,
  setupGuideKokoroTitle: "Dodaj naturalny głos na urządzeniu",
  setupGuideKokoroBody: ({ size }) =>
    `Opcjonalnie: pobierz Kokoro (około ${size} MB), aby uzyskać znacznie bardziej naturalne odpowiedzi głosowe bez dostawcy mowy i opłat za użytkowanie.`,
  setupGuideKokoroLanguageNote:
    "Model ten obecnie posługuje się językiem angielskim i chińskim uproszczonym. Skonfiguruj później dowolne trasy rezerwowe w Ustawieniach mówienia.",
  setupGuideKokoroDownload: "Pobierz Kokoro",
  setupGuideUseKokoro: "Do odpowiedzi głosowych użyj Kokoro",
  setupGuideUseKokoroSummary:
    "Zachowaj syntezę w telefonie, jeśli obsługiwany jest język odpowiedzi.",
  setupGuideSkipKokoro: "Pomiń na razie",
  setupGuideVoiceTestTitle: "Przetestuj swoją konfigurację",
  setupGuideVoiceTestBody:
    "Powiedz krótkie zdanie. Mr Broccoli przetestuje dostęp do mikrofonu, transkrypcję, skonfigurowaną trasę odpowiedzi i dźwięk mówiony, gdy dostępna będzie akceptowalna trasa głosowa.",
  setupGuideVoiceTestNoInputBody:
    "Wprowadzanie głosowe nie jest dostępne w tej konfiguracji. Kontynuuj przeglądanie wykrytych tras, a następnie w razie potrzeby dostosuj ustawienia mowy później.",
  setupGuideVoiceTestTextOnlyNote:
    "Ten test będzie zawierał tylko tekst, ponieważ nie jest jeszcze gotowa żadna akceptowalna trasa głosowa.",
  setupGuideVoiceTestStart: "Rozpocznij test",
  setupGuideVoiceTestStop: "Zatrzymaj nagrywanie",
  setupGuideVoiceTestRetry: "Uruchom ponownie",
  setupGuideVoiceTestTranscribing: "Transkrybuję…",
  setupGuideVoiceTestThinking: "Testuję odpowiedź…",
  setupGuideVoiceTestSynthesizing: "Przygotowuję głos…",
  setupGuideVoiceTestSpeaking: "Odtwarzam odpowiedź…",
  setupGuideVoiceTestTranscript: "Transkrypcja",
  setupGuideVoiceTestReply: "Odpowiedź",
  setupGuideVoiceTestReset: "Wyczyść ten wynik",
  setupGuideVoiceInputUnavailable:
    "Wprowadzanie głosowe nie jest dostępne w przypadku tej konfiguracji na tym urządzeniu.",
  setupGuideSummaryTitle: "Konfiguracja ukończona",
  setupGuideSummaryBody:
    "Oto trasa, której Mr Broccoli użyje w Twojej bieżącej konfiguracji.",
  setupGuideSummaryLlm: "LLM",
  setupGuideSummaryStt: "Mowa na tekst",
  setupGuideSummaryTts: "Tekst na mowę",
  setupGuideSummaryWebSearch: "Wyszukiwanie w Internecie",
  setupGuideRouteProviderLlm: ({ provider }) => `Włączone poprzez ${provider}`,
  setupGuideRouteOnDeviceStt: "Włączone poprzez systemowe rozpoznawanie mowy",
  setupGuideRouteProviderStt: ({ provider }) =>
    `Włączone poprzez transkrypcję mowy ${provider}`,
  setupGuideRouteProviderTts: ({ provider }) =>
    `Włączone za pomocą głosu ${provider}`,
  setupGuideRouteKokoroTts: "Włączone poprzez głos Kokoro na urządzeniu",
  setupGuideRouteLocalTts: "Włączone poprzez lokalny pakiet głosowy",
  setupGuideRouteUnavailable: "Niedostępne",
  setupGuideRouteOff: "Wyłączone",
  setupGuideWebSearchAvailableOff: ({ provider }) =>
    `Dostępne poprzez ${provider}, obecnie wyłączone`,
  setupGuideSummaryTextOnlyNote:
    "Odpowiedzi głosowe są na razie wyłączone. Odpowiedzi pozostają w formie tekstowej, dopóki nie włączysz głosu dostawcy lub głosu lokalnego.",
  setupGuideFinish: "Gotowe",
  searchConversationsPlaceholder: "Wyszukaj tytuły, modele i tekst wiadomości",
  noMatchingConversations: "Brak pasujących rozmów",
  noMatchingConversationsDescription:
    "Wypróbuj inny tytuł, trasę, model lub frazę z transkrypcji.",
  noProviderYet: "Nie ma jeszcze dostawcy",
  noModelYet: "Jeszcze nie ma modelu",
  startedAt: "Rozpoczęto",
  endedAt: "Zakończono",
  pinned: "Przypięty",
  copy: "Kopiuj",
  share: "Udostępnij",
  rename: "Zmień nazwę",
  pin: "Przypnij",
  unpin: "Odepnij",
  save: "Zapisz",
  cancel: "Anuluj",
  stop: "Zatrzymaj",
  pause: "Pauza",
  resume: "Wznów",
  paused: "Wstrzymano",
  listening: "Słuchanie",
  parsing: "Transkrypcja",
  searching: "Wyszukiwanie",
  converting: "Konwersja",
  webSearchAction: "wyszukiwanie w Internecie",
  thinking: "Myślenie",
  speaking: "Mówienie",
  pleaseWait: "Proszę czekać",
  yourTurn: "Twoja kolej",
  keepPressing: "Naciskaj dalej",
  tapWhenDone: "Stuknij, gdy skończysz",
  speechPaused: "Mowa jest wstrzymana",
  pausePlaybackUnavailable:
    "Tej trasy głosowej nie można wstrzymać. Zatrzymaj to lub przełącz na wyjście głosowe dostawcy.",
  holdToSpeak: "Przytrzymaj, aby mówić",
  tapToSpeak: "Stuknij, aby mówić",
  tapAgainToSend: "Stuknij ponownie, aby wysłać",
  waitingForReply: "Czekam na odpowiedź",
  parsingYourVoice: "Analizuję Twój głos",
  providerConfiguredInSettings: ({ provider }) =>
    `${provider} nie jest skonfigurowany w Ustawieniach.`,
  providerNetworkError: ({ provider, action }) =>
    `Nie udało się połączyć z ${provider} (${action}). Sprawdź połączenie i spróbuj ponownie.`,
  providerAuthError: ({ provider, action }) =>
    `${provider} odrzucił poświadczenia (${action}). Sprawdź klucz API i uprawnienia.`,
  providerRateLimitError: ({ provider, action }) =>
    `${provider} ogranicza obecnie liczbę żądań (${action}). Spróbuj ponownie za chwilę.`,
  providerCreditsRequired: ({ provider, action }) =>
    `${provider} wymaga wystarczającego kredytu API (${action}). Sprawdź saldo konta i limit wydatków klucza.`,
  providerTimeoutError: ({ provider, action }) =>
    `${provider} odpowiadał zbyt długo (${action}). Spróbuj ponownie.`,
  providerTemporaryError: ({ provider, action }) =>
    `${provider} miał tymczasowy problem (${action}). Spróbuj ponownie wkrótce.`,
  providerEmptyReplyError: ({ provider }) =>
    `${provider} zakończył pracę bez odpowiedzi. Spróbuj ponownie.`,
  providerIncompleteReplyError: ({ provider }) =>
    `Odpowiedź ${provider} zakończyła się, zanim została ukończona. Spróbuj ponownie.`,
  providerContextTooLong: ({ provider }) =>
    `${provider} odrzucił odpowiedź, ponieważ rozmowa stała się zbyt długa. Załóż nowy wątek lub skróć zapytanie.`,
  providerRequestRejected: ({ provider, action, detail }) =>
    detail
      ? `${provider} odrzucił żądanie (${action}): ${detail}`
      : `${provider} odrzucił żądanie (${action}).`,
  providerWebSearchNotRun: ({ provider }) =>
    `${provider} zwrócił odpowiedź bez uruchamiania wyszukiwania internetowego.`,
  providerValidationSuccess: ({ provider }) =>
    `${provider} jest gotowy do użycia.`,
  providerCapabilityValidationSuccess: ({ provider, capability }) =>
    `${provider} ${capability} działa.`,
  providerValidationFailed: "Weryfikacja dostawcy nie powiodła się.",
  webSearchFallback:
    "Wyszukiwarka internetowa była niedostępna, więc odpowiedź była kontynuowana bez kontekstu internetowego na żywo.",
  noBase64EncoderAvailable: "Brak dostępnego kodera base64.",
  noBase64DecoderAvailable: "Brak dostępnego dekodera Base64.",
  azureSpeechApiKeyFormat:
    "Microsoft Azure TTS wymaga poświadczeń Azure Speech w formacie <key>|<region>, na przykład abc123|westeurope lub połączonego formatu Azure <endpoint>|<api-key>|<key>|<region>.",
  nativeTtsDoesNotSynthesizeAudioFiles:
    "Natywny TTS nie syntetyzuje plików audio.",
  localTtsUnavailableForLanguage: ({ languageLabel }) =>
    `Żadna lokalna ani chmurowa trasa głosowa nie jest gotowa dla ${languageLabel}.`,
  chooseTextToSpeechProviderInSettings:
    "Wybierz dostawcę zamiany tekstu na mowę w Ustawieniach.",
  ttsNotSupportedYet: ({ provider }) =>
    `${provider} TTS nie jest jeszcze obsługiwany.`,
  ttsError: ({ provider, status, errorText }) =>
    `Błąd TTS ${provider} (${status}): ${errorText}`,
  ttsReplyTooLong: ({ provider }) =>
    `Wyjście głosowe ${provider} odrzuciło odpowiedź, ponieważ była za długa.`,
  ttsTimeout: ({ provider }) =>
    `Generowanie mowy przez ${provider} trwało zbyt długo.`,
  sttTimeout: ({ provider }) =>
    `Transkrypcja mowy ${provider} trwała zbyt długo.`,
  sttFileSizeLimitExceeded: ({ provider, model, limit }) =>
    `${provider} ${model} akceptuje tylko nagrania do ${limit}. Użyj krótszego nagrania lub zmień model STT.`,
  voiceInputCaptureIncomplete:
    "Nie udało się poprawnie przechwycić wprowadzanego głosu. Spróbuj ponownie.",
  ttsDidNotReturnAudio: ({ provider }) =>
    `${provider} TTS nie zwrócił dźwięku.`,
  nativeSttHandledInApp:
    "Systemowe STT jest obsługiwane bezpośrednio w aplikacji.",
  chooseSpeechToTextProviderInSettings:
    "Wybierz dostawcę zamiany mowy na tekst w Ustawieniach.",
  sttNotSupportedYet: ({ provider }) =>
    `${provider} STT nie jest jeszcze obsługiwany.`,
  providerNotWiredUpYet: ({ provider }) =>
    `${provider} nie jest jeszcze podłączony.`,
  you: "Ty",
  assistant: "Asystent",
  untitledConversation: "Rozmowa bez tytułu",
  conversationExportHeader: ({ title }) => `Rozmowa: ${title}`,
  speechRecognitionPermissionNotGranted:
    "Nie przyznano pozwolenia na rozpoznawanie mowy.",
  speechRecognitionUnavailableForDeviceLanguage:
    "Rozpoznawanie mowy nie jest dostępne dla bieżącego języka urządzenia.",
  nativeSpeechRecognitionNeedsNetwork:
    "Natywne rozpoznawanie mowy wymaga teraz dostępu do sieci.",
  noSpeechDetected: "Nie wykryto mowy.",
  nativeSpeechRecognitionFailed: "Natywne rozpoznawanie mowy nie powiodło się.",
  couldntStartNativeSpeechRecognition:
    "Nie można uruchomić natywnego rozpoznawania mowy.",
  microphonePermissionNotGranted:
    "Nie przyznano pozwolenia na korzystanie z mikrofonu",
} satisfies TranslationDictionary;
