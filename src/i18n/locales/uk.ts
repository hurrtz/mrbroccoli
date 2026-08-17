import type { TranslationDictionary } from "../types";
import { dataBackupTranslations } from "../dataBackupTranslations";
import { conversationKnowledgeTranslations } from "../conversationKnowledgeTranslations";
import { conversationArtifactTranslations } from "../conversationArtifactTranslations";
import { interruptionTranslations } from "../interruptionTranslations";
import { ulraAuditTranslations } from "../ulraAuditTranslations";
import { councilWorkspaceTranslations } from "../councilWorkspaceTranslations";
import { imagePromptTranslations } from "../imagePromptTranslations";
import { onDeviceTranslations } from "../onDeviceTranslations";
import { localSpeechTranslations } from "../localSpeechTranslations";
import { settingsTranslations } from "../settingsTranslations";
import { transcriptEditTranslations } from "../transcriptEditTranslations";
import { workspaceTranslations } from "../workspaceTranslations";
import { sessionLockTranslations } from "../sessionLockTranslations";

export const uk = {
  ...conversationArtifactTranslations.uk,
  ...interruptionTranslations.uk,
  ...ulraAuditTranslations.uk,
  ...councilWorkspaceTranslations.uk,
  ...dataBackupTranslations.uk,
  ...conversationKnowledgeTranslations.uk,
  ...imagePromptTranslations.uk,
  ...onDeviceTranslations.uk,
  ...localSpeechTranslations.uk,
  ...settingsTranslations.uk,
  ...transcriptEditTranslations.uk,
  ...workspaceTranslations.uk,
  ...sessionLockTranslations.uk,
  appName: "Пан Броколі",
  retry: "Повторити",
  dismiss: "Закрити",
  done: "Готово",
  aboutSetting: ({ setting }) => `Про параметр «${setting}»`,
  unavailable: "Недоступно",
  selection: "Вибір",
  chooseCompatibleProviderFirst: "Спочатку вибери сумісного провайдера",
  settings: "Налаштування",
  settingsReleaseVersion: ({ version }) => `Версія ${version}`,
  all: "Усі",
  instructions: "Інструкції",
  providers: "Провайдери",
  webSearch: "Вебпошук",
  stt: "STT",
  tts: "TTS",
  ui: "Інтерфейс",
  settingsRuntimeReadiness: "Готовність до роботи",
  settingsReadinessThink: "Міркування",
  settingsReadinessListen: "Слухання",
  settingsReadinessSpeak: "Озвучення",
  settingsReadinessSearch: "Пошук",
  settingsReadinessReady: "Готово",
  settingsReadinessNeedsAttention: "Потребує уваги",
  settingsReadinessBroken: "Не працює",
  settingsReadinessOff: "Вимкнено",
  settingsConnections: "Підключення",
  settingsThinking: "Міркування",
  settingsListening: "Слухання",
  settingsSpeaking: "Озвучення",
  settingsSearch: "Пошук",
  settingsAppDiagnostics: "Застосунок і діагностика",
  settingsGuidedSetup: "Майстер налаштування",
  settingsGuidedSetupSummary:
    "Перевірте підключення та весь голосовий маршрут.",
  setupGuideShowInSettings:
    "Показувати майстер налаштування в Налаштуваннях",
  setupGuideShowInSettingsSummary:
    "Показуй або приховуй ярлик майстра налаштування на головній сторінці Налаштувань.",
  settingsConnectionsSummary:
    "Ключі провайдерів, перевірка та можливості.",
  settingsThinkingSummary:
    "Картки на головному екрані, моделі, рівень міркування та системний запит.",
  settingsListeningSummary:
    "Режим введення та маршрутизація розпізнавання мовлення.",
  settingsSpeakingSummary:
    "Озвучені відповіді, відтворення, голоси та попереднє прослуховування.",
  settingsSearchSummary:
    "Провайдер вебпошуку та керування якістю пошуку.",
  settingsAppDiagnosticsSummary:
    "Тема, мова, використання, журнали налагодження та нещодавня активність.",
  settingsBackToOverview: "Назад до огляду",
  settingsOpenSection: ({ section }) => `Відкрити розділ «${section}»`,
  theme: "Тема",
  language: "Мова",
  recognitionLanguage: "Мова розпізнавання",
  recognitionLanguageHint:
    "Вибери мову для точнішого розпізнавання або залиште автоматичне визначення пристроєм чи провайдером.",
  automaticLanguage: "Автоматично",
  speechLanguageUnsupportedByProvider: ({ provider, language }) =>
    `${provider} офіційно не підтримує ${language} для цього голосового маршруту.`,
  usageStats: "Статистика використання",
  model: "Модель",
  effort: "Рівень міркування",
  effortValue: ({ effort }) => `Рівень: ${effort}`,
  modelEffortNone: "Немає",
  modelEffortMinimal: "Мінімальний",
  modelEffortLow: "Низький",
  modelEffortMedium: "Середній",
  modelEffortHigh: "Високий",
  modelEffortExtraHigh: "Дуже високий",
  modelEffortMax: "Максимальний",
  modelEffortDynamic: "Динамічний",
  modelEffortDisabled: "Вимкнено",
  modelEffortEnabled: "Увімкнено",
  fixed: "Фіксований",
  english: "Англійська",
  german: "Німецька",
  ukrainian: "Українська",
  hindi: "Гінді",
  spanish: "Іспанська",
  french: "Французька",
  italian: "Італійська",
  portuguese: "Португальська",
  portugueseBrazil: "Португальська (Бразилія)",
  russian: "Російська",
  simplifiedChinese: "Спрощена китайська",
  arabic: "Арабська",
  japanese: "Японська",
  hungarian: "Угорська",
  czech: "Чеська",
  polish: "Польська",
  turkish: "Турецька",
  swedish: "Шведська",
  urdu: "Урду",
  kokoroAmericanFemaleVoice: ({ name }) =>
    `${name} · американська англійська, жіночий голос`,
  kokoroBritishFemaleVoice: ({ name }) =>
    `${name} · британська англійська, жіночий голос`,
  kokoroChineseFemaleVoice: ({ index }) =>
    `Китайська, жіночий голос ${index}`,
  kokoroChineseMaleVoice: ({ index }) =>
    `Китайська, чоловічий голос ${index}`,
  light: "Світла",
  dark: "Темна",
  system: "Системна",
  languageCoverage: ({ note }) => `Підтримка мов: ${note}`,
  recordingLimits: ({ note }) => `Обмеження запису: ${note}`,
  catalogProviderPricingSummary: ({ summary }) => `Вартість: ${summary}`,
  replyGenerationAction: "створення відповіді",
  speechTranscriptionAction: "розпізнавання мовлення",
  speechSynthesisAction: "синтез мовлення",
  instructionsTabDescription:
    "Налаштуй приховані інструкції, які спрямовують асистента до того, як запит потрапить до провайдера.",
  providersTabDescription:
    "Зберігай облікові дані зовнішніх сервісів на пристрої та налаштовуй потрібні режими відповіді.",
  webSearchTabDescription:
    "Налаштуй додатковий актуальний вебконтекст перед відповідями.",
  responseModes: "Вибір моделі",
  aboutModelSelection: "Про вибір моделі",
  modelSelectionInfo:
    "Кожна картка моделі стає варіантом на головному екрані. Налаштуй провайдера, модель і, за потреби, рівень міркування, а потім перемикай картки, щоб вибрати модель для наступної відповіді.",
  responseModeItemTitle: ({ index }) => `Модель ${index}`,
  addResponseMode: "Додати модель",
  removeResponseMode: "Видалити модель",
  responseModesNoConfiguredProviders:
    "Спочатку додай облікові дані. Параметри маршрутів з’являться після налаштування хоча б одного сумісного сервісу.",
  useResponseMode: ({ mode }) => `Використати ${mode}`,
  chooseResponseModel: "Вибери модель",
  responseModelCount: ({ count }) => `Доступно моделей: ${count}`,
  ulraMode: "Рада моделей",
  ulraModeHomeLabel: "Показувати Раду моделей на головному екрані",
  ulraModeSettingsDescription:
    "Дозволяє спільне обговорення кількома моделями, коли готові щонайменше дві моделі головного екрана.",
  ulraModeInfo:
    "Рада моделей спочатку окремо опитує кожну готову модель із головного екрана. У кожному раунді моделі критично перевіряють останню позицію кожного учасника; решта раундів пропускається після явної одностайної згоди. Вибрана модель створює підсумкову відповідь з успішних раундів, завжди зберігаючи останню позицію кожної моделі. Матеріали обговорення передаються всім залученим провайдерам.",
  ulraModeRounds: "Раунди перегляду",
  ulraModeCallEstimate: ({ count }) =>
    `За поточних налаштувань до ${count} викликів моделей на повідомлення.`,
  ulraModeThresholdWarning:
    "Понад 4 моделі або 3 раунди можуть тривати дуже довго, використати багато токенів і досягти обмежень контексту чи частоти запитів провайдерів. Це лише попередження.",
  ulraModeFirstUseTitle: "Увімкнути Раду моделей?",
  ulraModeFirstUseMessage: ({ calls, models, rounds }) =>
    `За ${models} моделей і до ${rounds} раундів перегляду одне повідомлення може виконати до ${calls} викликів моделей. Це може тривати значно довше, коштувати набагато більше й передати обговорення всім залученим провайдерам.`,
  ulraModeHighRiskTitle: "Великий запуск Ради моделей",
  ulraModeHighRiskMessage: ({ calls, models, rounds }) =>
    `${models} моделей і ${rounds} раундів перегляду можуть виконати до ${calls} викликів моделей. Це може тривати дуже довго, використати багато токенів і досягти лімітів провайдерів. Усе одно продовжити?`,
  ulraModeEnableAction: "Увімкнути",
  ulraModeNeedsTwoModels:
    "Для Ради моделей потрібні щонайменше дві готові моделі на головному екрані.",
  ulraModeAllModelsFailed:
    "Усі моделі Ради моделей завершилися помилкою до того, як вдалося сформувати відповідь.",
  ulraModePartialFailureNotice: ({ failed, succeeded }) =>
    `${failed} внутрішніх викликів моделей завершилися помилкою; остаточна відповідь використала ${succeeded} успішних внесків.`,
  sttTabDescription:
    "Керуй записом мовлення та вибирай сервіс, який перетворює аудіо на текст перед передаванням моделі.",
  ttsTabDescription:
    "Керуй початком озвучення відповідей і вибирай сервіс для синтезу мовлення.",
  brief: "Коротко",
  briefDescription:
    "Відповідай стисло. Використовуй мінімальну кількість речень, потрібну для повної відповіді.",
  normal: "Звичайно",
  normalDescription:
    "Дотримуйтеся збалансованої довжини. Охоплюй важливе без зайвого розтягування відповіді.",
  thorough: "Докладно",
  thoroughDescription:
    "Розкривай тему глибоко й всебічно. Додавай нюанси, деталі, компроміси та важливі міркування.",
  professional: "Професійно",
  professionalDescription:
    "Говори як досвідчений консультант під час брифінгу клієнта: точно, без сленгу, виважено й авторитетно.",
  casual: "Невимушено",
  casualDescription:
    "Говори як розумний друг за кавою: спокійно, природно й розмовно. Допустимі відступи від теми.",
  nerdy: "Технічно",
  nerdyDescription:
    "Говори як захоплений експерт, який любить заглиблюватися в тему. Вільно використовуй технічні терміни й деталі.",
  concise: "Лаконічно",
  conciseDescription:
    "Будьте максимально стислими, але повними. Без вступів і зайвих слів — лише відповідь.",
  socratic: "Сократівськи",
  socraticDescription:
    "Ставте думки користувача під сумнів. Запитуй у відповідь, пропонуй інші погляди й не обмежуйтеся згодою.",
  eli5: "Пояснити просто",
  eli5Description:
    "Пояснюй все якомога простіше. Використовуй аналогії, повсякденну мову й уникай жаргону.",
  useProvider: ({ provider }) => `Використати ${provider}`,
  createApiKey: "Облікові дані",
  apiKey: "Ключ API",
  aboutThisProvider: "Про цього провайдера",
  openRouterGatewayTitle: "Один ключ, кілька провайдерів",
  openRouterGatewayDescription:
    "Створи окремий ключ OpenRouter, вставте його нижче та користуйтеся моделями зі стабільними версіями від кількох провайдерів, не замінюючи прямі підключення.",
  openRouterGatewayRoute:
    "Шлях запиту: цей пристрій → OpenRouter → вибраний кінцевий провайдер",
  openRouterKeys: "Ключі OpenRouter",
  providerStatusInvalid: "Недійсні дані",
  providerStatusTesting: "Перевірка",
  providerStatusConfigured: "Налаштовано",
  providerStatusWorking: "Працює",
  providerStatusNotTested: "Не перевірено",
  providerStatusNotSetup: "Не налаштовано",
  expandProvider: ({ provider }) => `Розгорнути ${provider}`,
  collapseProvider: ({ provider }) => `Згорнути ${provider}`,
  testProviderKey: "Перевірити ключ",
  testAllCapabilities: "Перевірити все",
  apiTest: "Перевірка API",
  testProviderCapability: ({ capability }) => `Перевірити: ${capability}`,
  test: "Перевірити",
  optional: "Необов’язково",
  providerCapability_llm: "Відповіді",
  providerCapability_stt: "Голосове введення",
  providerCapability_tts: "Озвучення",
  providerCapability_search: "Вебпошук",
  providerCapability_voices: "Бібліотека голосів",
  providerValidationUnavailable:
    "Перевірка в реальному часі для цього провайдера ще не підключена. Збережи ключ і перевірте його під час фактичного використання.",
  providerNeedsAttention: "потребує уваги",
  catalogProviderLimitsSummary: ({ summary }) => `Обмеження: ${summary}`,
  catalogProviderRegionSummary: ({ summary }) => `Регіон: ${summary}`,
  validatingKey: "Перевірка…",
  showKey: "Показати ключ",
  hideKey: "Приховати ключ",
  assistantInstructions: "Інструкції для асистента",
  systemPrompt: "Системний запит",
  aboutSystemPrompt: "Про системний запит",
  assistantInstructionsIntro:
    "Налаштуй приховані інструкції, які модель отримує перед кожною відповіддю.",
  baseInstructions: "Базові інструкції",
  assistantInstructionsPlaceholder: "Опиши, як має поводитися асистент.",
  assistantInstructionsHint:
    "Цей текст завжди додається перед вибраними параметрами довжини й тону відповіді.",
  adaptiveLength: "Адаптивна довжина",
  responseTone: "Тон відповіді",
  homeStyleChipLabel: ({ tone, length }) => `Стиль — ${tone} · ${length}`,
  styleSheetTitle: "Налаштування розмови",
  styleSheetSubtitle:
    "Налаштуй відповіді й мовлення лише для цієї розмови.",
  openStyleSheet: "Відкрити налаштування розмови",
  conversationThinkingInstructions: "Інструкції для міркування",
  conversationThinkingInstructionsDescription:
    "Додай інструкції після глобального системного запиту для цієї розмови.",
  conversationThinkingInstructionsPlaceholder:
    "Наприклад: став під сумнів мої припущення й наводь конкретні приклади.",
  ttsInstructions: "Інструкції з озвучення",
  ttsInstructionsDescription:
    "Визначте тон, темп, акцент або спосіб озвучення для сумісних мовних моделей.",
  conversationTtsInstructionsDescription:
    "Додай інструкції з озвучення після глобальних інструкцій для цієї розмови.",
  ttsInstructionsPlaceholder:
    "Наприклад: говори тепло, чітко й у спокійному темпі.",
  ttsInstructionsUnsupported:
    "Поточний голосовий маршрут не підтримує інструкції з озвучення.",
  conversationVoiceDescription: ({ route }) =>
    `Вибери голос, який ${route} використовуватиме в цій розмові.`,
  scrollToLatest: "Прокрутити до останнього повідомлення",
  conversationTitleGenerate: "Створити назву автоматично",
  conversationTitleGenerating: "Створення назви…",
  conversationTitleGenerated: "Розмову перейменовано.",
  conversationTitleNeedsContent:
    "Почни розмову, перш ніж створювати назву.",
  conversationTitleNeedsProvider:
    "Налаштуй вибрану модель, перш ніж створювати назву.",
  conversationTitleGenerationFailed: "Не вдалося створити назву розмови.",
  conversationTitleGenerationTimedOut:
    "Створення назви триває надто довго. Спробуй ще раз.",
  inputMode: "Режим введення",
  voiceInput: "Голосове введення",
  pushToTalk: "Утримувати для розмови",
  pushToTalkDescription:
    "Утримуй головну кнопку, поки говориш, а потім відпусти, щоб надіслати.",
  toggleToTalk: "Натиснути для розмови",
  toggleToTalkDescription:
    "Натисни один раз, щоб почати запис, і ще раз, коли завершиш.",
  driveSession: "Режим водіння",
  driveSessionDescription:
    "Коли автоматичне продовження ввімкнено, після кожної озвученої відповіді запис починається автоматично. Натисни головну кнопку, коли завершиш говорити.",
  stopDriveSession: "Призупинити автопродовження",
  repeatDriveReply: "Повторити останню",
  continueDriveSession: "Відновити автопродовження",
  driveSendsIn: ({ seconds }) => `Надсилання через ${seconds}…`,
  speechToText: "Розпізнавання мовлення",
  appNative: "Системне розпізнавання",
  nativeSttDescription:
    "Використовуй розпізнавання мовлення операційної системи.",
  provider: "Провайдер",
  webSearchProvider: "Провайдер вебпошуку",
  webSearchProviderMissingHint:
    "Налаштуй в Облікових даних хоча б один сервіс із підтримкою пошуку, щоб увімкнути вебконтекст.",
  webSearchModelHint: ({ model }) =>
    `Для актуального вебконтексту у фоновому режимі використовується ${model}.`,
  webSearchHomeHint:
    "Використовуй перемикач на головному екрані, щоб увімкнути або вимкнути вебконтекст для цієї розмови.",
  settingsWebSearchCompactHint:
    "За потреби додавай актуальний вебконтекст перед відповіддю основної моделі.",
  webSearchAdvanced: "Розширені параметри пошуку",
  expandAdvancedSearch: "Розгорнути розширені параметри пошуку",
  collapseAdvancedSearch: "Згорнути розширені параметри пошуку",
  webSearchSetupNeeded:
    "Додай облікові дані, щоб користуватися вебпошуком.",
  webSearchEnabledDescription:
    "Перед відповіддю моделі додається актуальний вебконтекст.",
  webSearchDisabledDescription:
    "Використовуй актуальний вебконтекст у цій розмові, коли важливі свіжі дані.",
  webSearchNobodyDescription:
    "Без вебзапитів. Відповідає з того, що знає модель.",
  webSearchQualityControls: "Якість пошуку",
  webSearchSearchMode: "Режим пошуку",
  webSearchSearchModeQuick: "Швидкий",
  webSearchSearchModeBalanced: "Збалансований",
  webSearchSearchModeDeep: "Глибокий",
  webSearchDepth: "Глибина пошуку",
  webSearchDepthStandard: "Стандартна",
  webSearchDepthDeep: "Глибока",
  webSearchResultCount: "Кількість результатів",
  webSearchQualityHint: ({ provider }) =>
    `Ці параметри визначають, як ${provider} збирає актуальний контекст перед відповіддю.`,
  webSearchNoExtraControls: ({ provider }) =>
    `${provider} поки не має додаткових параметрів якості пошуку в цьому застосунку.`,
  setWebSearchMode: ({ mode }) =>
    `Установити режим вебпошуку: ${mode}`,
  openWebSearchSettings: "Відкрити налаштування вебпошуку",
  providerSttDescription:
    "Використовуй налаштований зовнішній сервіс для розпізнавання голосу перед передаванням тексту моделі.",
  sttProvider: "Провайдер STT",
  sttProviderEnabledHint:
    "Тут відображаються лише ввімкнені провайдери з підтримкою розпізнавання мовлення.",
  sttProviderMissingHint:
    "Додай облікові дані сервісу з підтримкою STT, щоб вибрати його тут.",
  nativeSttHint:
    "Системне розпізнавання працює незалежно від ключів провайдерів і може виконуватися на пристрої або сервісом операційної системи.",
  replyPlayback: "Відтворення відповіді",
  sentencesArrive: "У міру готовності абзаців",
  sentencesArriveDescription:
    "Починай озвучення, щойно буде готовий повний абзац.",
  fullReplyFirst: "Спочатку повна відповідь",
  fullReplyFirstDescription:
    "Спочатку створи усю відповідь, а потім відтвори її повністю.",
  textToSpeech: "Синтез мовлення",
  spokenReplies: "Озвучені відповіді",
  spokenRepliesEnabledDescription:
    "Озвучуй відповіді асистента, коли доступний голосовий маршрут.",
  spokenRepliesDisabledDescription:
    "Поки що залишай відповіді лише текстовими. Вибраний маршрут TTS буде збережено.",
  nativeTtsDescription:
    "Використовуй мовний рушій пристрою для озвучення відповідей і попереднього прослуховування.",
  kokoroTtsDescription:
    "Використовуй значно природніший нейронний голос безпосередньо на цьому пристрої. Текст відповідей синтезується локально, без ключа мовного провайдера та плати за використання.",
  kokoroVoices: "Локальні голоси Kokoro",
  kokoroVoicesHint: ({ size, installedSize }) =>
    `Багатомовна модель завантажує близько ${size} МБ і після встановлення займає близько ${installedSize} МБ.`,
  kokoroModel: "Багатомовна модель Kokoro",
  kokoroChecking: "Перевірка локальної моделі…",
  kokoroDownloading: ({ progress }) => `Завантаження… ${progress}%`,
  kokoroExtracting: ({ progress }) => `Встановлення… ${progress}%`,
  kokoroVerifying: "Перевірка голосового рушія…",
  kokoroInstalled: "Встановлено й готово до роботи на цьому пристрої.",
  kokoroNotInstalled:
    "Завантажте й перевірте модель, перш ніж вибирати або використовувати Kokoro. Ключ провайдера не потрібен.",
  kokoroLanguageFallback:
    "Kokoro зараз підтримує тут англійську та спрощену китайську. Для інших вибраних мов відповіді додай явний резервний маршрут, інакше озвучення завершиться помилкою.",
  kokoroRemoveTitle: "Видалити модель Kokoro?",
  kokoroRemoveBody: ({ installedSize }) =>
    `Це звільнить близько ${installedSize} МБ. Модель можна знову завантажити будь-коли.`,
  removeKokoroModel: "Видалити модель Kokoro",
  downloadKokoroModel: "Завантажити модель Kokoro",
  kokoroFallbackNeeded: ({ languages }) =>
    `Явний резервний маршрут потрібен для: ${languages}.`,
  kokoroNoSelectedLanguages:
    "Вибери англійську або спрощену китайську в розділі «Мови озвучення», щоб налаштувати голос Kokoro.",
  expandVoiceSettings: ({ language }) =>
    `Розгорнути налаштування голосу для мови «${language}»`,
  collapseVoiceSettings: ({ language }) =>
    `Згорнути налаштування голосу для мови «${language}»`,
  remove: "Видалити",
  voiceOutputDescription:
    "Вибери мовний рушій, мови озвучення та голоси для попереднього прослуховування відповідей.",
  localTts: "Локально",
  localTtsDescription:
    "Використовуй відповідний завантажений локальний голос для озвучення відповідей.",
  providerTtsDescription:
    "Використовуй вибраний налаштований сервіс для озвучення відповідей.",
  ttsFallbackRoutes: "Резервні маршрути",
  ttsFallbackRoutesHint:
    "Необов’язково. Додавай лише потрібні маршрути в порядку їх перевірки. Щойно маршрут починає озвучення, я використовую його до кінця відповіді.",
  ttsFallbackNone:
    "Резервний маршрут не налаштовано. Натомість буде показано помилку голосу.",
  ttsFallbackPosition: ({ position, route }) => `${position}. ${route}`,
  addFallbackRoute: ({ route }) => `Додати резервний маршрут ${route}`,
  removeFallbackRoute: ({ route }) =>
    `Видалити резервний маршрут ${route}`,
  moveFallbackEarlier: ({ route }) => `Перемістити ${route} вище`,
  moveFallbackLater: ({ route }) => `Перемістити ${route} нижче`,
  ttsProvider: "Провайдер TTS",
  ttsProviderEnabledHint:
    "Тут відображаються лише ввімкнені провайдери з підтримкою озвучених відповідей.",
  ttsProviderMissingHint:
    "Додай облікові дані сервісу з підтримкою TTS, щоб вибрати його тут.",
  localTtsOrderHint:
    "Використовуються лише явно налаштовані резервні маршрути.",
  providerTtsOrderHint:
    "Використовуються лише явно налаштовані резервні маршрути.",
  nativeTtsHint:
    "Системний TTS використовує системні голоси й не потребує ключа провайдера.",
  localTtsLanguageCoverageHint:
    "Локальні пакети зараз підтримують англійську, німецьку, спрощену китайську, іспанську, португальську, гінді, французьку та італійську.",
  ttsVoice: "Голос TTS",
  refresh: "Оновити",
  providerVoiceDirectory: ({ provider }) =>
    `Бібліотека голосів ${provider}`,
  refreshProviderVoices: ({ provider }) => `Оновити голоси ${provider}`,
  providerVoicesAvailable: ({ count, provider }) =>
    `Доступно голосів від ${provider}: ${count}.`,
  providerVoicesLoadFailed:
    "Не вдалося оновити голоси. Поточний вибір не змінено; ідентифікатор голосу все ще можна ввести вручну.",
  providerVoicesLoadFailedWithFallback:
    "Не вдалося завантажити голоси облікового запису. Вбудований голос залишається доступним.",
  providerVoicesErrorDetail: ({ detail }) => `Причина: ${detail}`,
  elevenLabsVoicesReadPermissionHint:
    "В ElevenLabs відредагуй цей ключ API, увімкни Voices → Read, а потім онови список тут.",
  providerVoicesLoadingHint: ({ provider }) =>
    `Я автоматично завантажую доступні голоси з ${provider}.`,
  providerVoiceId: "Ідентифікатор голосу",
  providerVoiceIdPlaceholder: "Введи ідентифікатор голосу",
  providerVoiceIdFallbackHint:
    "Ручне введення залишається доступним, якщо бібліотеку голосів не вдається завантажити.",
  providerVoiceIdRequired: ({ provider }) =>
    `Онови бібліотеку голосів ${provider} або введи ідентифікатор голосу, перш ніж використовувати озвучення.`,
  qwenSpeechUnavailableInUs:
    "Мої поточні голосові маршрути Qwen недоступні в регіоні США. Для мовлення Qwen вибери Сінгапур або Пекін.",
  qwenApiRegion: "Регіон API Qwen",
  qwenRegionSingapore: "Сінгапур",
  qwenRegionUs: "США (Вірджинія)",
  qwenRegionBeijing: "Китай (Пекін)",
  qwenRegionHint:
    "Вибраний регіон має відповідати регіону, у якому створено цей ключ API.",
  qwenRegionUsSpeechHint:
    "Ключі регіону США підтримують тут чат і вебпошук. Мої поточні маршрути STT і TTS Qwen потребують ключа Сінгапуру або Пекіна.",
  providerDefaultVoiceHint:
    "Цей провайдер зараз використовує стандартний голос для попереднього прослуховування й озвучених відповідей.",
  listenLanguages: "Мови озвучення",
  listenLanguagesHint:
    "Вибери мови відповідей, які мають звучати добре. Я перевіряю їх у цьому порядку під час маршрутизації озвучення.",
  listenLanguagesSelected: ({ count }) =>
    `Вибрано мов: ${count}`,
  localVoicePacks: "Локальні голосові пакети",
  localVoicePacksHint:
    "Кожна мова має власний локальний голос. Вибери потрібний голос і завантажуй лише ті пакети, якими справді користуватиметеся.",
  localVoiceForLanguage: ({ languageLabel }) =>
    `Голос для мови «${languageLabel}»`,
  providerVoicePreviews: "Прослуховування голосів провайдера",
  providerVoicePreviewsHint:
    "Перевірте вибраний маршрут TTS з окремим текстом для кожної мови відповіді.",
  nativeVoicePreviewSection: "Прослуховування системного голосу",
  nativeVoicePreviewSectionHint:
    "Текст озвучується безпосередньо вбудованим синтезатором телефона, щоб його можна було порівняти з голосами провайдерів.",
  nativeVoiceUnavailable:
    "Пристрій не повідомив про доступні системні голоси для прослуховування.",
  runtimeCompatibilityOverrides: "Сумісність під час роботи",
  runtimeCompatibilityOverridesDescription: ({ count }) =>
    `${count} конфігурацій моделей або налаштувань, недоступність яких підтвердив провайдер, вимкнено лише на цьому пристрої. Я автоматично їх оминаю.`,
  clearRuntimeCompatibilityOverrides: "Очистити сумісність",
  clearRuntimeCompatibilityOverridesConfirmationTitle:
    "Очистити сумісність під час роботи?",
  clearRuntimeCompatibilityOverridesConfirmationMessage:
    "Раніше вимкнені конфігурації можна буде спробувати знову. Провайдер може повторно їх відхилити.",
  speechDiagnostics: "Нещодавня голосова активність",
  speechDiagnosticsHint:
    "Показує останні голосові запити, запитаний і фактично використаний маршрути та причину резервного переходу.",
  clearSpeechDiagnostics: "Очистити нещодавню голосову активність",
  speechDiagnosticsEmpty:
    "Голосових запитів ще немає. Прослухай голос або відтвори відповідь, щоб побачити тут дані маршрутизації.",
  clearSpeechDiagnosticsConfirmationTitle:
    "Очистити нещодавню голосову активність?",
  clearSpeechDiagnosticsConfirmationMessage:
    "Усі зібрані діагностичні дані голосової маршрутизації буде видалено. Цю дію неможливо скасувати.",
  speechDiagnosticSourceConversation: "Відповідь у розмові",
  speechDiagnosticSourceRepeat: "Повтор відповіді",
  speechDiagnosticSourcePreview: "Прослуховування голосу",
  speechDiagnosticSourceUnknown: "Голосовий запит",
  speechDiagnosticRouteLine: ({ requested, actual }) =>
    `Запитано: ${requested} → Фактично: ${actual}`,
  speechDiagnosticStageLine: ({ stage }) => `Останній етап: ${stage}`,
  speechDiagnosticLanguageLine: ({ languageLabel }) =>
    `Мова: ${languageLabel}`,
  speechDiagnosticProviderLine: ({ provider }) => `Провайдер: ${provider}`,
  speechDiagnosticVoiceLine: ({ voice }) => `Голос: ${voice}`,
  localTtsPackReady: "Встановлено на цьому пристрої.",
  localTtsPackBroken:
    "Пакет завантажено, але цей голос не пройшов локальну перевірку на пристрої. Завантажте його знову або вибери інший.",
  localTtsPackMissing:
    "Ще не встановлено. До завантаження використовуватиметься хмарний TTS або системний голос.",
  localTtsUnsupportedLanguageFallback:
    "Для цієї мови локальний пакет ще недоступний. Її обробить хмарний TTS або системний голос.",
  downloadingLocalTtsPack: ({ progress }) =>
    `Завантаження локального пакета… ${progress}%`,
  download: "Завантажити",
  downloadingShort: "Завантаження…",
  voicePreviewText: "Текст для прослуховування голосу",
  voicePreviewPlaceholder: "Введи фразу, щоб почути цей голос.",
  voicePreviewHint:
    "Використовується вибраний голосовий сервіс без надсилання тексту мовній моделі.",
  previewVoice: "Прослухати голос",
  generatingPreview: "Створення зразка…",
  playingPreview: "Відтворення зразка…",
  systemVoice: "Системний голос",
  spokenRepliesOff: "Лише текст",
  noTtsProvider: "Немає провайдера TTS",
  nothingToCopyYet: "Поки що немає чого копіювати.",
  couldntCopyText: "Не вдалося скопіювати текст.",
  nothingToShareYet: "Поки що немає чим ділитися.",
  couldntShareText: "Не вдалося поділитися текстом.",
  couldntReplayReply: "Не вдалося повторно відтворити відповідь.",
  replyFailed: "Не вдалося отримати відповідь",
  retryReply: "Повторити відповідь",
  replyFailedHint:
    "Перед повторною спробою можна вибрати іншу модель вище.",
  spokenReplyFailed:
    "Відповідь збережено, але її не вдалося озвучити.",
  retrySpeech: "Повторити озвучення",
  openSpeakingSettings: "Налаштування озвучення",
  messageCopied: "Повідомлення скопійовано.",
  noConversationToCopyYet: "Поки що немає розмови для копіювання.",
  noConversationToShareYet: "Поки що немає розмови, якою можна поділитися.",
  noReplyToRepeatYet: "Поки що немає відповіді для повтору.",
  threadCopied: "Розмову скопійовано.",
  threadRenamed: "Розмову перейменовано.",
  threadPinned: "Розмову закріплено.",
  threadUnpinned: "Розмову відкріплено.",
  addProviderKeyToUseProvider: ({ provider }) =>
    `Додай облікові дані ${provider} у Налаштуваннях, перш ніж використовувати цей маршрут.`,
  configureCredentialsBeforeVoiceSession:
    "Додай облікові дані в Налаштуваннях перед початком голосового сеансу.",
  endpointCredentialFormatInvalid: ({ provider }) =>
    `Для ${provider} введи базову URL-адресу провайдера та ключ API у форматі https://your-endpoint.example.com|your-api-key.`,
  speechRecognitionUnavailableOnDevice:
    "Розпізнавання мовлення недоступне на цьому пристрої.",
  debugLogLabel: "LOG",
  debugLogCaptureStarted: "Запис журналу налагодження розпочато.",
  debugLogCaptureStopped: ({ entryCount, fileName }) =>
    `Журнал налагодження збережено як ${fileName} і скопійовано в буфер обміну (${entryCount} записів).`,
  debugLogCaptureStoppedNoClipboard: ({ entryCount, fileName }) =>
    `Журнал налагодження збережено як ${fileName} (${entryCount} записів).`,
  debugLogCaptureRecovered: ({ entryCount, fileName }) =>
    `Попередній журнал ${fileName} відновлено й скопійовано в буфер обміну (${entryCount} записів).`,
  debugLogCaptureRecoveredNoClipboard: ({ entryCount, fileName }) =>
    `Попередній журнал ${fileName} відновлено (${entryCount} записів).`,
  debugLogCaptureFailed: "Не вдалося зберегти журнал налагодження.",
  chooseSttBeforeVoiceSession:
    "Перед початком голосового сеансу вибери налаштований маршрут STT у Налаштуваннях.",
  chooseTtsBeforeSpokenReplies:
    "Перед використанням озвучених відповідей вибери налаштований маршрут TTS у Налаштуваннях.",
  stopSessionBeforeReplay:
    "Зупини активний голосовий сеанс перед повторним відтворенням останньої відповіді.",
  couldntCatchThatTryAgain: "Не вдалося розпізнати. Спробуй ще раз.",
  couldntStartVoiceInput: "Не вдалося запустити голосове введення.",
  couldntProcessVoiceInput: "Не вдалося обробити голосове введення.",
  maxRecordingLengthReached:
    "Досягнуто максимальної тривалості запису — надсилаю записане.",
  sttRecordingTooLarge: ({ provider, limit }) =>
    `Запис надто довгий для розпізнавання мовлення ${provider} (максимум ${limit}). Спробуй коротше повідомлення або перемкни STT на системне розпізнавання.`,
  addProviderKeyToEnableProvider: ({ provider }) =>
    `Додай облікові дані ${provider} у Налаштуваннях, перш ніж використовувати цей маршрут.`,
  stopSessionBeforePreview:
    "Зупини активний голосовий сеанс перед прослуховуванням голосу.",
  chooseTtsToPreviewVoices:
    "Вибери налаштований маршрут TTS у Налаштуваннях, щоб прослуховувати голоси.",
  downloadSelectedLocalVoiceFirst: ({ languageLabel }) =>
    `Спочатку завантажте вибраний локальний голос для мови «${languageLabel}».`,
  couldntPreviewVoice: "Не вдалося прослухати голос.",
  spokenRepliesDisabled:
    "Озвучені відповіді вимкнено в Налаштуваннях.",
  providerVoiceFallback:
    "Налаштований голосовий маршрут не спрацював. Для цієї відповіді використано резервний голос.",
  localVoiceFallback:
    "Локальний голос був недоступний. Для цієї відповіді використано резервний голос.",
  localTtsPackInstalled: ({ languageLabel }) =>
    `Локальний голосовий пакет для мови «${languageLabel}» встановлено.`,
  localTtsPackInstallFailed:
    "Не вдалося встановити локальний голосовий пакет.",
  clear: "Очистити",
  voiceOutput: "Голосовий вихід",
  speechReplayCache: "Кеш повторного відтворення мовлення",
  speechReplayCacheDescription:
    "Створене провайдером мовлення зберігається на цьому пристрої до 14 днів, тому повтор відповіді не витрачає голосові кредити знову.",
  clearSpeechReplayCache: "Очистити кеш мовлення",
  speechReplayCacheCleared: "Збережені файли мовлення видалено.",
  speechReplayCacheClearFailed: "Не вдалося очистити кеш мовлення.",
  listeningToYourVoice: "Слухаю твій голос",
  parsingYourVoiceInput: "Перетворюю голос на текст",
  preparingRequest: "Готую запит",
  searchingTheWeb: "Шукаю актуальний контекст у вебі",
  waitingForProvider: ({ provider }) => `Очікую на ${provider}`,
  preparingVoiceWithProvider: ({ provider }) =>
    `Готую голос за допомогою ${provider}`,
  deepThinkingReassurance: "Для хорошої відповіді потрібен час…",
  thinkingElapsed: ({ detail, seconds }) => `${detail} · ${seconds} с`,
  speakingBackToYou: "Озвучую відповідь",
  freshSession: "Нова розмова",
  messageCount: ({ count }) => `Повідомлень: ${count}`,
  conversation: "Розмова",
  conversationActions: "Дії з розмовою",
  statusDetails: "Докладний стан",
  persistenceFailure:
    "Я не зміг зберегти дані на цьому пристрої. Не закривай застосунок і спробуй ще раз; після перезапуску останні зміни можуть зникнути.",
  show: "Показати",
  showTranscript: "Показати стенограму",
  hide: "Приховати",
  copyThread: "Копіювати розмову",
  shareThread: "Поділитися розмовою",
  reportResponse: "Поскаржитися на цю відповідь",
  reportResponseIntro: "Звіт про відповідь ШІ з Mr Broccoli. Переглянь вміст нижче, опиши проблему й надішли цей звіт розробнику.",
  repeatReply: "Повторити відповідь",
  renameThread: "Перейменувати розмову",
  renameThreadHint:
    "Дайте цій розмові назву, за якою її буде легко знайти згодом.",
  threadTitle: "Назва розмови",
  noTranscriptYet: "Стенограми ще немає",
  previewTranscriptEmptyDescription:
    "Почни із голосу або тексту. Тут з’явиться твоя розмова.",
  noConversationYet: "Розмови ще немає",
  expandedTranscriptEmptyDescription:
    "Почни із голосу або тексту. Закрий цей екран, щоб повернутися до головного.",
  transcriptSelectionHint:
    "Виділи текст будь-якого повідомлення або поділіться чи скопіюй окремі повідомлення нижче.",
  textMessagePlaceholder: "Введи повідомлення",
  sendTextMessage: "Надіслати повідомлення",
  showVoiceInput: "Показати голосове введення",
  showTextInput: "Показати текстове введення",
  usageStatsHiddenDescription:
    "Не показувати оцінки кількості токенів у стенограмі.",
  usageStatsVisibleDescription:
    "Показувати орієнтовне використання токенів для відповідей і всієї розмови.",
  debugLogButton: "Кнопка журналу налагодження",
  debugLogButtonHiddenDescription:
    "Приховувати кнопку LOG на головному екрані, якщо запис журналу не виконується.",
  debugLogButtonVisibleDescription:
    "Показувати кнопку LOG на головному екрані для запуску й зупинення запису журналу.",
  debugLogButtonUsageDescription:
    "Як користуватися кнопкою: увімкнення починає запис журналу. Вимкнення зупиняє запис і копіює зібрані дані в буфер обміну.",
  estimatedUsageTitle: "Орієнтовне використання",
  estimatedUsageCounts: ({ replies, summaries }) =>
    `Відповідей: ${replies} · оновлень пам’яті: ${summaries}`,
  estimatedUsageConversationScope:
    "Підсумки охоплюють усі маршрути й моделі, використані в цій розмові.",
  estimatedPromptTokens: ({ count }) => `Запит: ${count}`,
  estimatedReplyTokens: ({ count }) => `Відповідь: ${count}`,
  estimatedTotalTokens: ({ count }) => `Разом: ${count}`,
  estimatedUsageInline: ({ prompt, completion, total }) =>
    `Орієнт. вхід: ${prompt} · вихід: ${completion} · разом: ${total}`,
  searchQuery: "Пошуковий запит",
  expandWebSearchDetails: "Показати подробиці вебпошуку",
  collapseWebSearchDetails: "Приховати подробиці вебпошуку",
  webSearchSourceCount: ({ count }) => `Джерел: ${count}`,
  sources: "Джерела",
  openSourceLink: ({ source }) => `Відкрити джерело: ${source}`,
  turnReceipt: "Подробиці запиту",
  expandTurnReceipt: "Показати подробиці запиту",
  collapseTurnReceipt: "Приховати подробиці запиту",
  turnReceiptDirect: "Безпосередньо",
  turnReceiptRequested: "Запитаний маршрут відповіді",
  turnReceiptActual: "Фактичний маршрут відповіді",
  turnReceiptEffort: "Керування міркуванням",
  turnReceiptProviderNative: "власний маршрут провайдера",
  turnReceiptInput: "Маршрут введення",
  turnReceiptSearch: "Вебпошук",
  turnReceiptVoice: "Голосовий вихід",
  turnReceiptContext: "Контекст",
  turnReceiptTiming: "Час",
  turnReceiptFallback: "Причина резервного переходу",
  turnReceiptVoiceInput: "Голос",
  turnReceiptTypedInput: "Текст",
  turnReceiptSystemSpeech: "Системне розпізнавання мовлення",
  turnReceiptSystemVoice: "Системний голос",
  turnReceiptSystemVoiceFallback: "Системний голос · резервний",
  turnReceiptOff: "Вимкнено",
  turnReceiptNotConfigured: "Увімкнено · не налаштовано",
  turnReceiptFallbackWithoutSearch:
    "Продовжено без актуального вебпошуку",
  turnReceiptNotUsed: "Не використано",
  turnReceiptSummaryReused: "використано збережене резюме",
  turnReceiptSummaryUpdated: "резюме оновлено",
  turnReceiptContextFallback: "резерв із нещодавніх повідомлень",
  turnReceiptGatewayCompression: ({ original, compressed }) =>
    `шлюз стиснув ${original} повідомлень до ${compressed}`,
  turnReceiptContextValue: ({ sent, total, summarized, state }) =>
    `Надіслано попередніх повідомлень: ${sent}/${total} · щойно підсумовано: ${summarized}${state}`,
  turnReceiptTimingStt: "STT",
  turnReceiptTimingContext: "контекст",
  turnReceiptTimingSearch: "пошук",
  turnReceiptTimingModel: "модель",
  turnReceiptTimingFirstSpeech: "початок мовлення",
  turnReceiptTimingTotal: "загалом",
  estimatedRouteUsageTokensOnly: ({ tokens }) => `Токенів: ${tokens}`,
  unknownUsageRoute: "Невідомий маршрут",
  setupGuideConnectProviderTitle: "Налаштуй облікові дані",
  setupGuideConnectProviderDescription:
    "Додай облікові дані в Налаштуваннях, а потім вибери потрібні маршрути.",
  idle: "Очікування",
  yourConversationAppearsHere: "Тут з’явиться твоя розмова",
  defaultTranscriptEmptyDescription:
    "Почни із голосу або тексту. Я збережу розмову й відповім тут.",
  delete: "Видалити",
  deleteConversationConfirmationTitle: ({ title }) =>
    `Видалити «${title}»?`,
  deleteConversationConfirmationMessage:
    "Розмову та всі її повідомлення буде видалено назавжди. Цю дію неможливо скасувати.",
  conversations: "Розмови",
  drawerSubtitle:
    "Переходь між активними розмовами або починай нову.",
  newSession: "Нова розмова",
  noSavedConversationsYet: "Збережених розмов ще немає",
  drawerEmptyDescription:
    "Почни говорити на головному екрані, і я автоматично створю розмову.",
  setupGuideTitle: "Налаштуй застосунок",
  setupGuideSubtitle:
    "Додай облікові дані та вибери маршрути в Налаштуваннях.",
  fastestStartPreset: "Мінімальне налаштування",
  fastestStartDescription:
    "Використовуй системне мовлення, де воно доступне, і налаштуй лише потрібний маршрут відповіді.",
  fullVoicePreset: "Налаштований голос",
  fullVoiceDescription:
    "Використовуй вибрані сервіси для відповідей, розпізнавання й озвучення.",
  setupGuideNote:
    "Далі відкриються Налаштування, де можна вставити й перевірити облікові дані.",
  useThisSetup: "Використати це налаштування",
  notNow: "Не зараз",
  setupGuideIntroTitle: "Як я працюю",
  setupGuideIntroBody:
    "Я починаю з чистого аркуша. Додай облікові дані зовнішніх сервісів, якими вже користуєтеся, а потім вибери маршрути для відповідей, голосового введення, озвучення та додаткового вебконтексту.",
  setupGuideIntroNote:
    "Після налаштування використовуй головну голосову кнопку, щоб починати й зупиняти розмову. Поточна стенограма залишається на головному екрані, а всі маршрути можна згодом змінити в Налаштуваннях.",
  setupGuideProviderTitle: "Додай облікові дані",
  setupGuideProviderBody:
    "Вибери зовнішній сервіс для налаштування й вставте облікові дані з доступом до відповідей.",
  setupGuideProviderPickerLabel: "Сервіс відповідей",
  setupGuideSelectProvider: "Вибери провайдера",
  setupGuideSelectProviderFirst: "Спочатку вибери провайдера.",
  setupGuideApiKeyLabel: "Ключ API",
  setupGuideApiKeyPlaceholder: "Вставте облікові дані",
  setupGuideContinue: "Продовжити",
  setupGuideOpenSettings: "Відкрити Налаштування",
  setupGuideBack: "Назад",
  setupGuideValidateKey: "Перевірити ключ",
  setupGuideApiKeyRequiredOrCancel:
    "Додай ключ API, щоб продовжити, або скасуй майстер налаштування.",
  setupGuideProviderAndApiKeyRequiredOrCancel:
    "Вибери провайдера й додай ключ API, щоб продовжити, або скасуй майстер налаштування.",
  setupGuideProviderKeyNeedsLlmAccess: ({ provider }) =>
    `Ці облікові дані ${provider} не дозволяють надсилати запити на відповіді.`,
  setupGuideKokoroTitle: "Додай природний локальний голос",
  setupGuideKokoroBody: ({ size }) =>
    `Необов’язково: завантажте Kokoro (близько ${size} МБ) для значно природніших озвучених відповідей без мовного провайдера та плати за використання.`,
  setupGuideKokoroLanguageNote:
    "Ця модель зараз підтримує англійську та спрощену китайську. Потрібні резервні маршрути можна налаштувати пізніше в розділі Озвучення.",
  setupGuideKokoroDownload: "Завантажити Kokoro",
  setupGuideUseKokoro: "Використовувати Kokoro для озвучених відповідей",
  setupGuideUseKokoroSummary:
    "Синтезувати мовлення на телефоні, коли підтримується мова відповіді.",
  setupGuideSkipKokoro: "Поки пропустити",
  setupGuideVoiceTestTitle: "Перевірте налаштування",
  setupGuideVoiceTestBody:
    "Скажи коротке речення. Я перевірю доступ до мікрофона, розпізнавання, налаштований маршрут відповіді та озвучення, якщо доступний відповідний голосовий маршрут.",
  setupGuideVoiceTestNoInputBody:
    "Голосове введення недоступне з цим налаштуванням. Продовжте, щоб переглянути виявлені маршрути, а за потреби зміни параметри мовлення пізніше.",
  setupGuideVoiceTestTextOnlyNote:
    "Ця перевірка залишиться текстовою, оскільки відповідний маршрут озвучення ще не готовий.",
  setupGuideVoiceTestStart: "Почати перевірку",
  setupGuideVoiceTestStop: "Зупинити запис",
  setupGuideVoiceTestRetry: "Запустити знову",
  setupGuideVoiceTestTranscribing: "Розпізнавання…",
  setupGuideVoiceTestThinking: "Перевірка відповіді…",
  setupGuideVoiceTestSynthesizing: "Підготовка голосу…",
  setupGuideVoiceTestSpeaking: "Відтворення відповіді…",
  setupGuideVoiceTestTranscript: "Стенограма",
  setupGuideVoiceTestReply: "Відповідь",
  setupGuideVoiceTestReset: "Очистити результат",
  setupGuideVoiceInputUnavailable:
    "Голосове введення недоступне для цього налаштування на цьому пристрої.",
  setupGuideSummaryTitle: "Налаштування завершено",
  setupGuideSummaryBody:
    "Ось маршрут, який я використовуватиму з поточними налаштуваннями.",
  setupGuideSummaryLlm: "LLM",
  setupGuideSummaryStt: "Розпізнавання мовлення",
  setupGuideSummaryTts: "Синтез мовлення",
  setupGuideSummaryWebSearch: "Вебпошук",
  setupGuideRouteProviderLlm: ({ provider }) =>
    `Увімкнено через ${provider}`,
  setupGuideRouteOnDeviceStt:
    "Увімкнено через системне розпізнавання мовлення",
  setupGuideRouteProviderStt: ({ provider }) =>
    `Увімкнено через розпізнавання мовлення ${provider}`,
  setupGuideRouteProviderTts: ({ provider }) =>
    `Увімкнено через голос ${provider}`,
  setupGuideRouteKokoroTts: "Увімкнено через локальний голос Kokoro",
  setupGuideRouteLocalTts: "Увімкнено через локальний голосовий пакет",
  setupGuideRouteUnavailable: "Недоступно",
  setupGuideRouteOff: "Вимкнено",
  setupGuideWebSearchAvailableOff: ({ provider }) =>
    `Доступно через ${provider}, зараз вимкнено`,
  setupGuideSummaryTextOnlyNote:
    "Озвучені відповіді наразі вимкнено. Відповіді залишатимуться текстовими, доки ти не ввімкнеш провайдера або локальний голос.",
  setupGuideFinish: "Готово",
  searchConversationsPlaceholder:
    "Пошук за назвами, моделями й текстом повідомлень",
  noMatchingConversations: "Відповідних розмов не знайдено",
  noMatchingConversationsDescription:
    "Спробуй іншу назву, маршрут, модель або фразу зі стенограми.",
  noProviderYet: "Провайдера ще немає",
  noModelYet: "Моделі ще немає",
  startedAt: "Початок",
  endedAt: "Завершення",
  pinned: "Закріплено",
  copy: "Копіювати",
  share: "Поділитися",
  rename: "Перейменувати",
  pin: "Закріпити",
  unpin: "Відкріпити",
  save: "Зберегти",
  cancel: "Скасувати",
  stop: "Зупинити",
  pause: "Призупинити",
  resume: "Продовжити",
  paused: "Призупинено",
  listening: "Слухаю",
  parsing: "Розпізнавання",
  searching: "Пошук",
  converting: "Перетворення",
  webSearchAction: "вебпошук",
  thinking: "Міркую",
  speaking: "Озвучення",
  pleaseWait: "Зачекай",
  yourTurn: "Твоя черга",
  keepPressing: "Продовжуй утримувати",
  tapWhenDone: "Натисни, коли завершиш",
  speechPaused: "Озвучення призупинено",
  pausePlaybackUnavailable:
    "Цей голосовий маршрут не можна призупинити. Зупини його або перейди на озвучення провайдера.",
  holdToSpeak: "Утримуй, щоб говорити",
  tapToSpeak: "Натисни, щоб говорити",
  tapAgainToSend: "Натисни ще раз, щоб надіслати",
  waitingForReply: "Очікування відповіді",
  parsingYourVoice: "Розпізнавання голосу",
  providerConfiguredInSettings: ({ provider }) =>
    `${provider} не налаштовано в Налаштуваннях.`,
  providerNetworkError: ({ provider, action }) =>
    `Не вдалося зв’язатися з ${provider} для дії «${action}». Перевірте з’єднання й спробуй ще раз.`,
  providerAuthError: ({ provider, action }) =>
    `${provider} відхилив облікові дані для дії «${action}». Перевірте ключ API та дозволи.`,
  providerRateLimitError: ({ provider, action }) =>
    `${provider} зараз обмежує частоту запитів для дії «${action}». Спробуй трохи згодом.`,
  providerCreditsRequired: ({ provider, action }) =>
    `${provider} потребує достатнього балансу API для дії «${action}». Перевірте баланс облікового запису й ліміт витрат ключа.`,
  providerTimeoutError: ({ provider, action }) =>
    `${provider} надто довго виконував дію «${action}». Спробуй ще раз.`,
  providerTemporaryError: ({ provider, action }) =>
    `Під час дії «${action}» у ${provider} виникла тимчасова проблема. Спробуй трохи згодом.`,
  providerEmptyReplyError: ({ provider }) =>
    `${provider} завершив роботу, не повернувши відповіді. Спробуй ще раз.`,
  providerIncompleteReplyError: ({ provider }) =>
    `Відповідь ${provider} завершилася передчасно. Спробуй ще раз.`,
  providerContextTooLong: ({ provider }) =>
    `${provider} відхилив запит, оскільки розмова стала надто довгою. Почни нову розмову або скороти запит.`,
  providerRequestRejected: ({ provider, action, detail }) =>
    detail
      ? `${provider} відхилив запит на дію «${action}»: ${detail}`
      : `${provider} відхилив запит на дію «${action}».`,
  providerWebSearchNotRun: ({ provider }) =>
    `${provider} повернув відповідь без виконання вебпошуку.`,
  providerValidationSuccess: ({ provider }) =>
    `${provider} готовий до використання.`,
  providerCapabilityValidationSuccess: ({ provider, capability }) =>
    `${provider}: функція «${capability}» працює.`,
  providerValidationFailed: "Не вдалося перевірити провайдера.",
  webSearchFallback:
    "Вебпошук був недоступний, тому відповідь створено без актуального вебконтексту.",
  noBase64EncoderAvailable: "Кодувальник Base64 недоступний.",
  noBase64DecoderAvailable: "Декодувальник Base64 недоступний.",
  azureSpeechApiKeyFormat:
    "Для Microsoft Azure TTS потрібні облікові дані Azure Speech у форматі <key>|<region>, наприклад abc123|westeurope, або в об’єднаному форматі Azure <endpoint>|<api-key>|<key>|<region>.",
  nativeTtsDoesNotSynthesizeAudioFiles:
    "Системний TTS не створює аудіофайлів.",
  localTtsUnavailableForLanguage: ({ languageLabel }) =>
    `Для мови «${languageLabel}» не готовий жоден локальний або хмарний голосовий маршрут.`,
  chooseTextToSpeechProviderInSettings:
    "Вибери провайдера синтезу мовлення в Налаштуваннях.",
  ttsNotSupportedYet: ({ provider }) =>
    `${provider} поки не підтримує TTS.`,
  ttsError: ({ provider, status, errorText }) =>
    `Помилка TTS ${provider} (${status}): ${errorText}`,
  ttsReplyTooLong: ({ provider }) =>
    `${provider} відхилив озвучення, оскільки відповідь була надто довгою.`,
  ttsTimeout: ({ provider }) =>
    `${provider} надто довго створював озвучення.`,
  sttTimeout: ({ provider }) =>
    `${provider} надто довго розпізнавав мовлення.`,
  sttFileSizeLimitExceeded: ({ provider, model, limit }) =>
    `${provider} ${model} приймає записи розміром не більше ${limit}. Використай коротший запис або зміни модель STT.`,
  voiceInputCaptureIncomplete:
    "Не вдалося коректно записати голосове введення. Спробуй ще раз.",
  ttsDidNotReturnAudio: ({ provider }) =>
    `${provider} TTS не повернув аудіо.`,
  nativeSttHandledInApp:
    "Системне STT обробляється безпосередньо в застосунку.",
  chooseSpeechToTextProviderInSettings:
    "Вибери провайдера розпізнавання мовлення в Налаштуваннях.",
  sttNotSupportedYet: ({ provider }) =>
    `${provider} поки не підтримує STT.`,
  providerNotWiredUpYet: ({ provider }) =>
    `${provider} поки не підключено.`,
  you: "Ти",
  assistant: "Асистент",
  untitledConversation: "Розмова без назви",
  conversationExportHeader: ({ title }) => `Розмова: ${title}`,
  speechRecognitionPermissionNotGranted:
    "Дозвіл на розпізнавання мовлення не надано.",
  speechRecognitionUnavailableForDeviceLanguage:
    "Розпізнавання мовлення недоступне для поточної мови пристрою.",
  nativeSpeechRecognitionNeedsNetwork:
    "Системне розпізнавання мовлення зараз потребує доступу до мережі.",
  noSpeechDetected: "Мовлення не виявлено.",
  nativeSpeechRecognitionFailed:
    "Не вдалося виконати системне розпізнавання мовлення.",
  couldntStartNativeSpeechRecognition:
    "Не вдалося запустити системне розпізнавання мовлення.",
  microphonePermissionNotGranted: "Дозвіл на мікрофон не надано",
} satisfies TranslationDictionary;
