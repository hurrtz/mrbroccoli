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

export const ru = {
  ...conversationArtifactTranslations.ru,
  ...interruptionTranslations.ru,
  ...ulraAuditTranslations.ru,
  ...dataBackupTranslations.ru,
  ...conversationKnowledgeTranslations.ru,
  ...imagePromptTranslations.ru,
  ...onDeviceTranslations.ru,
  ...onboardingTranslations.ru,
  ...introTranslations.ru,
  ...premiumTranslations.ru,
  ...transcriptEditTranslations.ru,
  ...workspaceTranslations.ru,
  ...autoSetupTranslations.ru,
  appName: "Мистер Брокколи",
  retry: "Повторить попытку",
  dismiss: "Закрыть",
  done: "Готово",
  aboutSetting: ({ setting }) => `О настройке «${setting}»`,
  unavailable: "Недоступно",
  selection: "Выбор",
  chooseCompatibleProviderFirst: "Сначала выберите совместимого провайдера",
  settings: "Настройки",
  settingsReleaseVersion: ({ version }) => `Версия ${version}`,
  all: "Все",
  firstRun: "Первый запуск",
  instructions: "Инструкции",
  providers: "Провайдеры",
  webSearch: "Веб-поиск",
  stt: "STT",
  tts: "TTS",
  ui: "UI",
  settingsRuntimeReadiness: "Готовность к выполнению",
  settingsReadinessThink: "Думать",
  settingsReadinessListen: "Слушать",
  settingsReadinessSpeak: "Говорить",
  settingsReadinessSearch: "Поиск",
  settingsReadinessReady: "Готово",
  settingsReadinessNeedsAttention: "Внимание",
  settingsReadinessBroken: "Неисправно",
  settingsReadinessOff: "Выключено",
  settingsConnections: "Соединения",
  settingsThinking: "Мышление",
  settingsListening: "Прослушивание",
  settingsSpeaking: "Речь",
  settingsSearch: "Поиск",
  settingsAppDiagnostics: "Приложение и диагностика",
  settingsGuidedSetup: "Пошаговая настройка",
  settingsGuidedSetupSummary:
    "Просмотрите соединения и протестируйте весь голосовой маршрут.",
  setupGuideShowInSettings: "Показывать пошаговую настройку в настройках",
  setupGuideShowInSettingsSummary:
    "Показать или скрыть ярлык пошаговой настройки в обзоре настроек.",
  settingsConnectionsSummary: "Ключи провайдеров, проверка и возможности.",
  settingsThinkingSummary: "Карточки главного экрана, модели, уровень усилий и системная подсказка.",
  settingsListeningSummary: "Режим ввода и маршрутизация речи в текст.",
  settingsSpeakingSummary: "Озвученные ответы, воспроизведение, голоса и прослушивание примеров.",
  settingsSearchSummary: "Провайдер веб-поиска и контроль качества поиска.",
  settingsAppDiagnosticsSummary:
    "Тема, язык, использование, журналы отладки и недавние действия.",
  settingsBackToOverview: "Вернуться к обзору",
  settingsOpenSection: ({ section }) => `Открыть ${section}`,
  theme: "Тема",
  language: "Язык",
  recognitionLanguage: "Язык распознавания",
  recognitionLanguageHint:
    "Выберите язык для более точного распознавания или оставьте автоматическое определение устройством либо провайдером.",
  automaticLanguage: "Автоматически",
  speechLanguageUnsupportedByProvider: ({ provider, language }) =>
    `${provider} официально не поддерживает ${language} для этого голосового маршрута.`,
  usageStats: "Статистика использования",
  model: "Модель",
  effort: "Усилие",
  effortValue: ({ effort }) => `Усилие: ${effort}`,
  modelEffortNone: "Нет",
  modelEffortMinimal: "Минимальный",
  modelEffortLow: "Низкий",
  modelEffortMedium: "Средний",
  modelEffortHigh: "Высокий",
  modelEffortExtraHigh: "Очень высокий",
  modelEffortMax: "Максимальный",
  modelEffortDynamic: "Динамический",
  modelEffortDisabled: "Выключено",
  modelEffortEnabled: "Включено",
  fixed: "Фиксированный",
  english: "Английский",
  german: "Немецкий",
  ukrainian: "Украинский",
  hindi: "Хинди",
  spanish: "Испанский",
  french: "Французский",
  italian: "Итальянский",
  portuguese: "Португальский",
  portugueseBrazil: "Португальский (Бразилия)",
  russian: "Русский",
  simplifiedChinese: "Упрощённый китайский",
  arabic: "Арабский",
  japanese: "Японский",
  hungarian: "Венгерский",
  czech: "Чешский",
  polish: "Польский",
  turkish: "Турецкий",
  swedish: "Шведский",
  urdu: "Урду",
  kokoroAmericanFemaleVoice: ({ name }) =>
    `${name} · американский английский, женский голос`,
  kokoroBritishFemaleVoice: ({ name }) =>
    `${name} · британский английский, женский голос`,
  kokoroChineseFemaleVoice: ({ index }) =>
    `Китайский, женский голос ${index}`,
  kokoroChineseMaleVoice: ({ index }) => `Китайский, мужской голос ${index}`,
  light: "Светлая",
  dark: "Тёмная",
  system: "Система",
  languageCoverage: ({ note }) => `Языковой охват: ${note}`,
  recordingLimits: ({ note }) => `Ограничения записи: ${note}`,
  catalogProviderPricingSummary: ({ summary }) => `Цены: ${summary}`,
  replyGenerationAction: "генерация ответа",
  speechTranscriptionAction: "транскрипция речи",
  speechSynthesisAction: "синтез речи",
  instructionsTabDescription:
    "Сформируйте скрытое руководство, которое будет управлять помощником до того, как какой-либо провайдер увидит запрос.",
  providersTabDescription:
    "Сохраните учетные данные внешней службы на устройстве и настройте режимы ответа, которые вы хотите использовать.",
  webSearchTabDescription:
    "Настройте дополнительный онлайн-контекст перед ответами.",
  responseModes: "Выбор модели",
  aboutModelSelection: "О выборе модели",
  modelSelectionInfo:
    "Каждая карточка модели становится вариантом выбора на главном экране. Настройте провайдера, модель и дополнительный уровень усилий, а затем переключайте карточки, чтобы выбрать, какая модель ответит следующей.",
  responseModeItemTitle: ({ index }) => `Модель ${index}`,
  addResponseMode: "Добавить модель",
  removeResponseMode: "Удалить модель",
  responseModesNoConfiguredProviders:
    "Сначала добавьте учетные данные. Элементы управления маршрутом остаются скрытыми до тех пор, пока не будет настроена хотя бы одна совместимая служба.",
  useResponseMode: ({ mode }) => `Использовать ${mode}`,
  chooseResponseModel: "Выберите модель",
  responseModelCount: ({ count }) => `Доступно моделей: ${count}`,
  ulraMode: "Суперрежим",
  ulraModeHomeLabel: "Показывать суперрежим на главном экране",
  ulraModeSettingsDescription:
    "Разрешает совместное обсуждение несколькими моделями, когда готовы как минимум две модели главного экрана.",
  ulraModeInfo:
    "Суперрежим сначала отдельно опрашивает каждую готовую модель с главного экрана. В каждом раунде модели критически проверяют последнюю позицию каждого участника; оставшиеся раунды пропускаются после явного единогласного согласия. Выбранная модель формирует итоговый ответ из успешных раундов, всегда сохраняя последнюю позицию каждой модели. Материалы обсуждения передаются всем задействованным провайдерам.",
  ulraModeRounds: "Раунды проверки",
  ulraModeCallEstimate: ({ count }) =>
    `При текущих настройках до ${count} вызовов моделей на сообщение.`,
  ulraModeThresholdWarning:
    "Более 4 моделей или 3 раундов могут занять много времени, израсходовать много токенов и достичь ограничений контекста или частоты запросов провайдеров. Это только предупреждение.",
  ulraModeFirstUseTitle: "Включить суперрежим?",
  ulraModeFirstUseMessage: ({ calls, models, rounds }) =>
    `При ${models} моделях и до ${rounds} раундов проверки одно сообщение может выполнить до ${calls} вызовов моделей. Это может занять намного больше времени, заметно увеличить стоимость и передать обсуждение всем задействованным провайдерам.`,
  ulraModeHighRiskTitle: "Большой запуск суперрежима",
  ulraModeHighRiskMessage: ({ calls, models, rounds }) =>
    `${models} моделей и ${rounds} раундов проверки могут выполнить до ${calls} вызовов моделей. Это может занять очень много времени, израсходовать много токенов и достичь лимитов провайдеров. Всё равно продолжить?`,
  ulraModeEnableAction: "Включить",
  ulraModeNeedsTwoModels:
    "Для суперрежима нужны как минимум две готовые модели на главном экране.",
  ulraModeAllModelsFailed:
    "Все модели суперрежима завершились с ошибкой до того, как удалось составить ответ.",
  ulraModePartialFailureNotice: ({ failed, succeeded }) =>
    `${failed} внутренних вызовов моделей завершились с ошибкой; итоговый ответ использовал ${succeeded} успешных вкладов.`,
  sttTabDescription:
    "Управляйте тем, как захватывается речь и какой сервер преобразует звук в текст до того, как он достигнет модели.",
  ttsTabDescription:
    "Контролируйте, когда ответы начинают произноситься и какой сервер обрабатывает голосовой вывод.",
  brief: "Краткий",
  briefDescription:
    "Отвечайте сжато. Используйте минимальное количество предложений, необходимое для полного ответа пользователю.",
  normal: "Нормальный",
  normalDescription:
    "Стремитесь к сбалансированной длине ответа. Осветите важные моменты, не затягивая ответ.",
  thorough: "Тщательный",
  thoroughDescription:
    "Идите глубже и будьте всеобъемлющими. Включите нюансы, детали, компромиссы и важные аргументы.",
  professional: "Профессиональный",
  professionalDescription:
    "Говорите как старший консультант, инструктирующий клиента. Точный язык, без сленга, размеренный и авторитетный.",
  casual: "Повседневный",
  casualDescription:
    "Говорите как умный друг в кафе. Расслабленно, естественно, непринуждённо. Разговорные сокращения уместны, отступления от темы тоже.",
  nerdy: "Всезнайка",
  nerdyDescription:
    "Говорите как эксперт-энтузиаст, который любит углубляться в тему. Свободно используйте техническую терминологию, увлечённо разбирайте детали, исходите из того, что пользователь за вами поспевает.",
  concise: "Краткий",
  conciseDescription:
    "Будьте максимально краткими, но не упускайте главного. Никаких предисловий, никакой воды — только ответ. В стиле телеграммы.",
  socratic: "Сократический",
  socraticDescription:
    "Бросьте вызов мышлению пользователя. Задавайте встречные вопросы, предлагайте альтернативные точки зрения, а не просто подтверждайте сказанное. Будьте спарринг-партнером, а не машиной, которая соглашается.",
  eli5: "Как пятилетнему",
  eli5Description:
    "Объясняйте всё максимально просто. Используйте аналогии и повседневный язык, без жаргона. Исходите из того, что у пользователя нет никаких предварительных знаний по теме.",
  useProvider: ({ provider }) => `Использовать ${provider}`,
  createApiKey: "Учетные данные",
  apiKey: "Ключ API",
  aboutThisProvider: "Об этом провайдере",
  openRouterOnboardingTitle: "Один ключ, несколько провайдеров",
  openRouterOnboardingDescription:
    "Создайте отдельный ключ OpenRouter, вставьте его ниже и используйте закреплённые снапшот-версии моделей от нескольких провайдеров, не заменяя прямые подключения.",
  openRouterOnboardingRoute:
    "Путь запроса: это устройство → OpenRouter → выбранный вышестоящий провайдер",
  openRouterKeys: "Ключи OpenRouter",
  providerStatusInvalid: "Неверный",
  providerStatusTesting: "Тестирование",
  providerStatusConfigured: "Настроен",
  providerStatusWorking: "Работает",
  providerStatusNotTested: "Не проверено",
  providerStatusNotSetup: "Не настроено",
  expandProvider: ({ provider }) => `Развернуть ${provider}`,
  collapseProvider: ({ provider }) => `Свернуть ${provider}`,
  testProviderKey: "Проверить ключ",
  testAllCapabilities: "Протестировать все",
  apiTest: "Тест API",
  testProviderCapability: ({ capability }) => `Проверить: ${capability}`,
  test: "Тест",
  optional: "Необязательно",
  providerCapability_llm: "Ответы",
  providerCapability_stt: "Речевой ввод",
  providerCapability_tts: "Голосовой вывод",
  providerCapability_search: "Веб-поиск",
  providerCapability_voices: "Голосовая библиотека",
  providerValidationUnavailable:
    "Живая проверка еще не подключена для этого провайдера. Сохраните ключ здесь и проверьте его во время фактического использования.",
  providerNeedsAttention: "требует внимания",
  catalogProviderLimitsSummary: ({ summary }) => `Пределы: ${summary}`,
  catalogProviderRegionSummary: ({ summary }) => `Регион: ${summary}`,
  validatingKey: "Проверка...",
  showKey: "Показать ключ",
  hideKey: "Скрыть ключ",
  assistantInstructions: "Инструкции помощника",
  systemPrompt: "Системная подсказка",
  aboutSystemPrompt: "О системной подсказке",
  assistantInstructionsIntro:
    "Формируйте скрытое руководство, которое модель получает перед каждым ответом.",
  baseInstructions: "Базовые инструкции",
  assistantInstructionsPlaceholder: "Определите, как должен вести себя помощник.",
  assistantInstructionsHint:
    "Этот текст всегда добавляется перед выбранными длиной и тоном ответа.",
  adaptiveLength: "Адаптивная длина",
  responseTone: "Тон ответа",
  homeStyleChipLabel: ({ tone, length }) => `Стиль — ${tone} · ${length}`,
  styleSheetTitle: "Настройки разговора",
  styleSheetSubtitle: "Формируйте ответы и речь только для этого разговора.",
  openStyleSheet: "Открыть настройки разговора",
  conversationThinkingInstructions: "Инструкции по мышлению",
  conversationThinkingInstructionsDescription:
    "Добавьте инструкции после глобального системного запроса для этого разговора.",
  conversationThinkingInstructionsPlaceholder:
    "Например: оспорьте мои предположения и используйте конкретные примеры.",
  ttsInstructions: "Инструкции по подаче речи",
  ttsInstructionsDescription:
    "Управляйте тоном, темпом, акцентом или подачей, используемыми совместимыми речевыми моделями.",
  conversationTtsInstructionsDescription:
    "Добавьте инструкции по подаче после общих речевых инструкций для этого разговора.",
  ttsInstructionsPlaceholder:
    "Например: говорите тепло, четко и в спокойном темпе.",
  ttsInstructionsUnsupported:
    "Текущий маршрут речи не поддерживает инструкции по подаче.",
  conversationVoiceDescription: ({ route }) =>
    `Выберите голос, который использует ${route} в этом разговоре.`,
  scrollToLatest: "Прокрутить до последнего сообщения",
  conversationTitleGenerate: "Автоматически сгенерировать заголовок",
  conversationTitleGenerating: "Создание заголовка…",
  conversationTitleGenerated: "Разговор переименован.",
  conversationTitleNeedsContent:
    "Начните разговор, прежде чем создавать заголовок.",
  conversationTitleNeedsProvider:
    "Настройте выбранную модель перед созданием заголовка.",
  conversationTitleGenerationFailed: "Не удалось создать заголовок разговора.",
  conversationTitleGenerationTimedOut:
    "Генерация названия заняла слишком много времени. Пожалуйста, попробуйте еще раз.",
  inputMode: "Режим ввода",
  voiceInput: "Голосовой ввод",
  pushToTalk: "Удерживать и говорить",
  pushToTalkDescription:
    "Удерживайте главную кнопку во время разговора, затем отпустите, чтобы отправить.",
  toggleToTalk: "Запись по нажатию",
  toggleToTalkDescription:
    "Нажмите один раз, чтобы начать запись, и нажмите еще раз, когда закончите.",
  driveSession: "Сеанс вождения",
  driveSessionDescription:
    "Если автоматическое продолжение включено, запись начинается после каждого устного ответа. Нажмите главную кнопку, когда закончите говорить.",
  stopDriveSession: "Пауза авто",
  repeatDriveReply: "Повторить последний",
  continueDriveSession: "Возобновить авто",
  driveSendsIn: ({ seconds }) => `Отправка через ${seconds}…`,
  speechToText: "Речь в текст",
  appNative: "Системное распознавание",
  nativeSttDescription:
    "Используйте распознаватель речи операционной системы.",
  provider: "Провайдер",
  webSearchProvider: "Провайдер веб-поиска",
  webSearchProviderMissingHint:
    "Настройте хотя бы одну службу с возможностью поиска в разделе «Учетные данные», чтобы использовать здесь свежий веб-контекст.",
  webSearchModelHint: ({ model }) =>
    `В фоне использует ${model}, чтобы подобрать свежий веб-контекст.`,
  webSearchHomeHint:
    "Используйте переключатель на главном экране, чтобы включить или выключить веб-контекст для этой темы.",
  settingsWebSearchCompactHint:
    "При необходимости добавьте свежий веб-контекст перед ответом основной модели.",
  webSearchAdvanced: "Расширенные настройки поиска",
  expandAdvancedSearch: "Развернуть расширенные настройки поиска",
  collapseAdvancedSearch: "Свернуть расширенные настройки поиска",
  webSearchSetupNeeded: "Добавьте учетные данные для использования интерактивного веб-поиска.",
  webSearchEnabledDescription:
    "Свежий веб-контекст добавляется перед ответом модели.",
  webSearchDisabledDescription:
    "Используйте живой веб-контекст для этой темы, когда текущие факты имеют значение.",
  webSearchNobodyDescription:
    "Без веб-запросов. Отвечает тем, что знает модель.",
  webSearchQualityControls: "Качество поиска",
  webSearchSearchMode: "Режим поиска",
  webSearchSearchModeQuick: "Быстрый",
  webSearchSearchModeBalanced: "Сбалансированный",
  webSearchSearchModeDeep: "Глубокий",
  webSearchDepth: "Глубина поиска",
  webSearchDepthStandard: "Стандартный",
  webSearchDepthDeep: "Глубокий",
  webSearchResultCount: "Количество результатов",
  webSearchQualityHint: ({ provider }) =>
    `Эти элементы управления настраивают то, как ${provider} собирает свежий контекст перед ответом.`,
  webSearchNoExtraControls: ({ provider }) =>
    `${provider} пока не предоставляет дополнительные элементы управления качеством поиска в этом приложении.`,
  setWebSearchMode: ({ mode }) => `Установите режим веб-поиска на ${mode}.`,
  openWebSearchSettings: "Открыть настройки веб-поиска",
  providerSttDescription:
    "Используйте настроенную внешнюю службу для расшифровки вашего голоса перед его отправкой по маршруту ответа.",
  sttProvider: "Провайдер STT",
  sttProviderEnabledHint:
    "Здесь отображаются только включённые провайдеры с поддержкой транскрипции.",
  sttProviderMissingHint:
    "Добавьте учетные данные для службы с поддержкой STT, чтобы выбрать ее здесь.",
  nativeSttHint:
    "Системное распознавание работает независимо от ваших ключей провайдеров и может обрабатываться на устройстве или речевой службой операционной системы.",
  replyPlayback: "Воспроизведение ответа",
  sentencesArrive: "По мере готовности абзацев",
  sentencesArriveDescription:
    "Начинайте говорить, как только будет готов полный абзац.",
  fullReplyFirst: "Полный ответ сначала",
  fullReplyFirstDescription:
    "Сначала сгенерируйте весь ответ, а затем воспроизведите его за один проход.",
  textToSpeech: "Преобразование текста в речь",
  spokenReplies: "Озвученные ответы",
  spokenRepliesEnabledDescription:
    "Читать ответы помощника вслух, когда доступен голосовой маршрут.",
  spokenRepliesDisabledDescription:
    "Оставьте ответы пока только текстовыми. Предпочитаемый маршрут TTS сохраняется на будущее.",
  nativeTtsDescription:
    "Используйте речевой движок устройства для голосовых ответов и предварительного просмотра голоса.",
  kokoroTtsDescription:
    "Используйте на этом устройстве гораздо более естественный нейронный голос. Текст голосового ответа синтезируется локально, без ключа речевого провайдера или платы за использование.",
  kokoroVoices: "Голоса Kokoro на устройстве",
  kokoroVoicesHint: ({ size, installedSize }) =>
    `Загрузка многоязычной модели — около ${size} МБ; после установки она занимает около ${installedSize} МБ.`,
  kokoroModel: "Многоязычная модель Kokoro",
  kokoroChecking: "Проверка модели на устройстве…",
  kokoroDownloading: ({ progress }) => `Загрузка… ${progress}%`,
  kokoroExtracting: ({ progress }) => `Установка… ${progress}%`,
  kokoroVerifying: "Проверка голосового механизма…",
  kokoroInstalled: "Установлено и готово на этом устройстве.",
  kokoroNotInstalled:
    "Загрузите и проверьте модель, прежде чем выбирать или использовать Kokoro. Ключ провайдера не требуется.",
  kokoroLanguageFallback:
    "Kokoro в настоящее время говорит здесь на английском и упрощенном китайском языках. Для других выбранных языков ответа добавьте явный резервный маршрут, иначе речь прекратится из-за ошибки.",
  kokoroRemoveTitle: "Удалить модель Kokoro?",
  kokoroRemoveBody: ({ installedSize }) =>
    `Это освобождает около ${installedSize} МБ. Вы можете скачать модель снова в любое время.`,
  removeKokoroModel: "Удалить модель Kokoro",
  downloadKokoroModel: "Загрузить модель Kokoro",
  kokoroFallbackNeeded: ({ languages }) =>
    `Явный резервный маршрут требуется для: ${languages}.`,
  kokoroNoSelectedLanguages:
    "Выберите английский или упрощенный китайский в разделе «Языки прослушивания», чтобы настроить голос Kokoro.",
  expandVoiceSettings: ({ language }) =>
    `Развернуть настройки голоса (${language})`,
  collapseVoiceSettings: ({ language }) =>
    `Свернуть настройки голоса (${language})`,
  remove: "Удалить",
  voiceOutputDescription:
    "Выберите речевой движок, языки прослушивания и примеры голосов для озвученных ответов.",
  localTts: "Локальный",
  localTtsDescription:
    "Используйте подходящий загруженный локальный голос для озвученных ответов.",
  providerTtsDescription:
    "Используйте выбранную настроенную службу для озвученных ответов.",
  ttsFallbackRoutes: "Резервные маршруты",
  ttsFallbackRoutesHint:
    "Необязательно. Добавляйте только те маршруты, которые вам нужны, в том порядке, в котором их следует пробовать. Как только маршрут начал озвучивать ответ, Mr Broccoli остаётся на нём до конца ответа.",
  ttsFallbackNone:
    "Резервный маршрут не настроен. Вместо этого будет показана ошибка озвучивания.",
  ttsFallbackPosition: ({ position, route }) => `${position}. ${route}`,
  addFallbackRoute: ({ route }) => `Добавить резервный вариант ${route}`,
  removeFallbackRoute: ({ route }) => `Удалить резервный вариант ${route}`,
  moveFallbackEarlier: ({ route }) => `Переместить ${route} раньше`,
  moveFallbackLater: ({ route }) => `Переместить ${route} позже`,
  ttsProvider: "Провайдер TTS",
  ttsProviderEnabledHint:
    "Здесь отображаются только включённые провайдеры с поддержкой озвучивания ответов.",
  ttsProviderMissingHint:
    "Добавьте учетные данные для службы с поддержкой TTS, чтобы выбрать ее здесь.",
  localTtsOrderHint:
    "Используются только явно настроенные резервные маршруты.",
  providerTtsOrderHint:
    "Используются только явно настроенные резервные маршруты.",
  nativeTtsHint:
    "Системный TTS использует голосовой стек операционной системы и не требует ключа провайдера.",
  localTtsLanguageCoverageHint:
    "В настоящее время локальные пакеты охватывают английский, немецкий, упрощенный китайский, испанский, португальский, хинди, французский и итальянский языки.",
  ttsVoice: "Голос TTS",
  refresh: "Обновить",
  providerVoiceDirectory: ({ provider }) => `Голосовая библиотека ${provider}`,
  refreshProviderVoices: ({ provider }) => `Обновить голоса ${provider}`,
  providerVoicesAvailable: ({ count, provider }) =>
    `Доступно голосов от ${provider}: ${count}.`,
  providerVoicesLoadFailed:
    "Не удалось обновить голоса. Ваш текущий выбор не изменился; вы по-прежнему можете ввести идентификатор голоса вручную.",
  providerVoicesLoadFailedWithFallback:
    "Не удалось загрузить голоса аккаунта. Встроенный голос остается доступным.",
  providerVoicesErrorDetail: ({ detail }) => `Причина: ${detail}`,
  elevenLabsVoicesReadPermissionHint:
    "В ElevenLabs отредактируйте этот ключ API и включите «Голоса» → «Чтение», затем обновите здесь.",
  providerVoicesLoadingHint: ({ provider }) =>
    `Mr Broccoli автоматически загружает доступные голоса из ${provider}.`,
  providerVoiceId: "Идентификатор голоса",
  providerVoiceIdPlaceholder: "Введите идентификатор голоса",
  providerVoiceIdFallbackHint:
    "Ручной ввод остаётся доступным, если голосовую библиотеку не удаётся загрузить.",
  providerVoiceIdRequired: ({ provider }) =>
    `Обновите голосовую библиотеку ${provider} или введите идентификатор голоса перед использованием речевого вывода.`,
  qwenSpeechUnavailableInUs:
    "Текущие речевые маршруты Qwen в Mr Broccoli недоступны в регионе США. Для речевых функций Qwen выберите Сингапур или Пекин.",
  qwenApiRegion: "Регион API Qwen",
  qwenRegionSingapore: "Сингапур",
  qwenRegionUs: "США (Вирджиния)",
  qwenRegionBeijing: "Китай (Пекин)",
  qwenRegionHint:
    "Выбранный регион должен соответствовать региону, в котором был создан этот ключ API.",
  qwenRegionUsSpeechHint:
    "Ключи региона США поддерживают здесь чат и веб-поиск. Для текущих маршрутов Qwen STT и TTS в Mr Broccoli нужен ключ Сингапура или Пекина.",
  providerDefaultVoiceHint:
    "В настоящее время этот провайдер использует голос по умолчанию для прослушивания примеров и озвученных ответов.",
  listenLanguages: "Языки прослушивания",
  listenLanguagesHint:
    "Выберите языки ответов, которые должны звучать хорошо. Mr Broccoli пробует их в этом порядке при выборе речевого вывода.",
  listenLanguagesSelected: ({ count }) =>
    count === 1 ? "выбран 1 язык" : `Выбрано языков: ${count}`,
  localVoicePacks: "Локальные голосовые пакеты",
  localVoicePacksHint:
    "Каждый язык сохраняет свой локальный голос. Выберите нужный голос для этого языка, а затем загружайте только те пакеты, которые вам действительно нужны.",
  localVoiceForLanguage: ({ languageLabel }) => `Голос для ${languageLabel}`,
  providerVoicePreviews: "Примеры голосов провайдера",
  providerVoicePreviewsHint:
    "Проверьте здесь выбранный маршрут TTS, задав отдельный текст примера для каждого языка ответа.",
  nativeVoicePreviewSection: "Пример системного голоса",
  nativeVoicePreviewSectionHint:
    "Воспроизведение идёт напрямую через встроенный синтезатор речи телефона, чтобы вы могли сравнить его с настроенными голосами провайдеров.",
  nativeVoiceUnavailable:
    "Это устройство не сообщило ни об одном системном голосе для прослушивания.",
  runtimeCompatibilityOverrides: "Совместимость во время работы",
  runtimeCompatibilityOverridesDescription: ({ count }) =>
    `${count} конфигураций моделей или настроек, недоступность которых подтвердил провайдер, отключены только на этом устройстве. Mr Broccoli автоматически их обходит.`,
  clearRuntimeCompatibilityOverrides: "Очистить совместимость",
  clearRuntimeCompatibilityOverridesConfirmationTitle:
    "Очистить совместимость во время работы?",
  clearRuntimeCompatibilityOverridesConfirmationMessage:
    "Ранее отключённые конфигурации можно будет попробовать снова. Провайдер может повторно их отклонить.",
  speechDiagnostics: "Недавняя речевая активность",
  speechDiagnosticsHint:
    "Показывает последние речевые запросы, маршрут, который они запросили, маршрут, который они фактически использовали, а также любые резервные причины.",
  clearSpeechDiagnostics: "Очистить недавнюю речевую активность",
  speechDiagnosticsEmpty:
    "Недавних речевых запросов пока нет. Прослушайте образец голоса или воспроизведите ответ, чтобы увидеть здесь детали маршрутизации.",
  clearSpeechDiagnosticsConfirmationTitle: "Очистить недавнюю речевую активность?",
  clearSpeechDiagnosticsConfirmationMessage:
    "При этом удаляются все захваченные данные диагностики маршрутизации речи. Это действие невозможно отменить.",
  speechDiagnosticSourceConversation: "Ответ в разговоре",
  speechDiagnosticSourceRepeat: "Повтор ответа",
  speechDiagnosticSourcePreview: "Прослушивание голоса",
  speechDiagnosticSourceUnknown: "Речевой запрос",
  speechDiagnosticRouteLine: ({ requested, actual }) =>
    `Запрошено: ${requested} -> Фактически: ${actual}`,
  speechDiagnosticStageLine: ({ stage }) => `Последний этап: ${stage}`,
  speechDiagnosticLanguageLine: ({ languageLabel }) =>
    `Язык: ${languageLabel}`,
  speechDiagnosticProviderLine: ({ provider }) => `Провайдер: ${provider}`,
  speechDiagnosticVoiceLine: ({ voice }) => `Голос: ${voice}`,
  localTtsPackReady: "Установлено на этом устройстве.",
  localTtsPackBroken:
    "Загружен, но этот голос не прошел локальную проверку на этом устройстве. Загрузите его заново или выберите другой голос.",
  localTtsPackMissing:
    "Ещё не установлен. Пока вы его не загрузите, будет использоваться облачный TTS или системный голос.",
  localTtsUnsupportedLanguageFallback:
    "Локальный пакет для этого языка пока недоступен. Его заменит облачный TTS или системный голос.",
  downloadingLocalTtsPack: ({ progress }) =>
    `Загрузка локального пакета... ${progress}%`,
  download: "Скачать",
  downloadingShort: "Загрузка...",
  voicePreviewText: "Текст для прослушивания голоса",
  voicePreviewPlaceholder: "Введите фразу, чтобы услышать этот голос.",
  voicePreviewHint:
    "Использует выбранный в данный момент голосовой движок ответа, не отправляя ничего в языковую модель.",
  previewVoice: "Прослушать голос",
  generatingPreview: "Подготовка примера...",
  playingPreview: "Воспроизведение примера...",
  systemVoice: "Системный голос",
  spokenRepliesOff: "Только текст",
  noTtsProvider: "Нет провайдера TTS",
  nothingToCopyYet: "Копировать пока нечего.",
  couldntCopyText: "Не удалось скопировать этот текст.",
  nothingToShareYet: "Пока нечем поделиться.",
  couldntShareText: "Не удалось поделиться этим текстом.",
  couldntReplayReply: "Не удалось воспроизвести этот ответ.",
  replyFailed: "Не удалось ответить",
  retryReply: "Повторить ответ",
  replyFailedHint: "Прежде чем повторить попытку, вы можете выбрать другую модель выше.",
  spokenReplyFailed: "Ответ сохранился, но произнести его не удалось.",
  retrySpeech: "Повторить речь",
  openSpeakingSettings: "Настройки речи",
  messageCopied: "Сообщение скопировано.",
  noConversationToCopyYet: "Пока нет разговора, который можно скопировать.",
  noConversationToShareYet: "Пока нет разговоров, которыми можно было бы поделиться.",
  noReplyToRepeatYet: "Ответа на повтор пока нет.",
  threadCopied: "Тема скопирована.",
  threadRenamed: "Тема переименована.",
  threadPinned: "Тема закреплена.",
  threadUnpinned: "Тема откреплена.",
  addProviderKeyToUseProvider: ({ provider }) =>
    `Прежде чем использовать этот маршрут, добавьте учетные данные для ${provider} в настройках.`,
  configureCredentialsBeforeVoiceSession:
    "Добавьте учетные данные в настройках перед началом голосового сеанса.",
  endpointCredentialFormatInvalid: ({ provider }) =>
    `Для ${provider} введите базовый URL-адрес провайдера и ключ API в виде https://your-endpoint.example.com|your-api-key.`,
  speechRecognitionUnavailableOnDevice:
    "Распознавание речи недоступно на этом устройстве.",
  debugLogLabel: "ЖУРНАЛ",
  debugLogCaptureStarted: "Начато ведение журнала отладки.",
  debugLogCaptureStopped: ({ entryCount, fileName }) =>
    `Журнал отладки сохранён как ${fileName} и скопирован в буфер обмена (записей: ${entryCount}).`,
  debugLogCaptureStoppedNoClipboard: ({ entryCount, fileName }) =>
    `Журнал отладки сохранён как ${fileName} (записей: ${entryCount}).`,
  debugLogCaptureRecovered: ({ entryCount, fileName }) =>
    `Восстановлен предыдущий журнал отладки ${fileName} и скопирован в буфер обмена (записей: ${entryCount}).`,
  debugLogCaptureRecoveredNoClipboard: ({ entryCount, fileName }) =>
    `Восстановлен предыдущий журнал отладки ${fileName} (записей: ${entryCount}).`,
  debugLogCaptureFailed: "Не удалось сохранить журнал отладки.",
  chooseSttBeforeVoiceSession:
    "Перед началом голосового сеанса выберите настроенный маршрут STT в настройках.",
  chooseTtsBeforeSpokenReplies:
    "Прежде чем использовать голосовые ответы, выберите настроенный маршрут TTS в настройках.",
  stopSessionBeforeReplay:
    "Остановите активный голосовой сеанс перед воспроизведением последнего ответа.",
  couldntCatchThatTryAgain: "Не удалось уловить это, попробуйте еще раз.",
  couldntStartVoiceInput: "Не удалось запустить голосовой ввод.",
  couldntProcessVoiceInput: "Не удалось обработать голосовой ввод.",
  maxRecordingLengthReached:
    "Достигнута максимальная длина записи — отправляю то, что есть.",
  sttRecordingTooLarge: ({ provider, limit }) =>
    `Эта запись слишком длинная для преобразования речи в текст ${provider} (максимум ${limit}). Попробуйте надиктовать более короткое сообщение или переключите преобразование речи в текст на системное распознавание.`,
  addProviderKeyToEnableProvider: ({ provider }) =>
    `Прежде чем использовать этот маршрут, добавьте учетные данные для ${provider} в настройках.`,
  stopSessionBeforePreview:
    "Остановите активный голосовой сеанс перед прослушиванием голоса.",
  chooseTtsToPreviewVoices:
    "Выберите настроенный маршрут TTS в настройках, чтобы прослушать голоса.",
  downloadSelectedLocalVoiceFirst: ({ languageLabel }) =>
    `Сначала загрузите выбранный локальный голос (${languageLabel}).`,
  couldntPreviewVoice: "Не удалось прослушать голос.",
  spokenRepliesDisabled: "Озвученные ответы отключены в настройках.",
  providerVoiceFallback:
    "Настроенный голосовой маршрут не сработал. Этот ответ озвучен резервным голосом.",
  localVoiceFallback:
    "Локальный голос был недоступен. Этот ответ озвучен резервным голосом.",
  localTtsPackInstalled: ({ languageLabel }) =>
    `Установлен локальный голосовой пакет ${languageLabel}.`,
  localTtsPackInstallFailed: "Не удалось установить локальный голосовой пакет.",
  clear: "Очистить",
  voiceOutput: "Голосовой вывод",
  speechReplayCache: "Кэш повторного воспроизведения",
  speechReplayCacheDescription:
    "Созданная провайдером речь хранится на устройстве до 14 дней, поэтому повтор ответа не расходует голосовые кредиты снова.",
  clearSpeechReplayCache: "Очистить кэш речи",
  speechReplayCacheCleared: "Сохранённые речевые файлы удалены.",
  speechReplayCacheClearFailed: "Не удалось очистить кэш речи.",
  currentSetup: "Текущая настройка",
  listeningToYourVoice: "Слушаю вас",
  parsingYourVoiceInput: "Преобразую ваш голос в текст",
  preparingRequest: "Подготовка вашего запроса",
  searchingTheWeb: "Поиск в Интернете свежего контекста",
  waitingForProvider: ({ provider }) => `Жду ${provider}`,
  preparingVoiceWithProvider: ({ provider }) =>
    `Подготовка голоса с помощью ${provider}`,
  deepThinkingReassurance: "Хорошие ответы требуют времени…",
  thinkingElapsed: ({ detail, seconds }) => `${detail} · ${seconds} с`,
  speakingBackToYou: "Озвучиваю ответ",
  freshSession: "Новая сессия",
  messageCount: ({ count }) =>
    Number(count) === 1 ? "1 сообщение" : `Сообщений: ${count}`,
  speechInputRoute: ({ route }) => `Речевой ввод: ${route}`,
  replyModelRoute: ({ route }) => `Модель ответа: ${route}`,
  voiceOutputRoute: ({ route }) => `Голосовой вывод: ${route}`,
  fallbackVoiceOutputRoute: ({ route }) => `Резервный голосовой выход: ${route}`,
  conversation: "Разговор",
  conversationActions: "Действия в разговоре",
  statusDetails: "Детали статуса",
  persistenceFailure:
    "Mr Broccoli не удалось сохранить данные на этом устройстве. Оставьте приложение открытым и повторите попытку; последние изменения могут быть потеряны после перезапуска.",
  show: "Показать",
  showTranscript: "Показать стенограмму",
  hide: "Скрыть",
  copyThread: "Копировать тему",
  shareThread: "Поделиться темой",
  reportResponse: "Пожаловаться на этот ответ",
  reportResponseIntro: "Жалоба на ответ ИИ из Mr Broccoli. Просмотрите содержимое ниже, опишите проблему и отправьте эту жалобу разработчику.",
  repeatReply: "Повторить ответ",
  renameThread: "Переименовать тему",
  renameThreadHint:
    "Дайте этому разговору название, которое вы сможете быстро найти позже.",
  threadTitle: "Название темы",
  noTranscriptYet: "Транскрипции пока нет",
  previewTranscriptEmptyDescription:
    "Чтобы начать, используйте голос или текст. Ваш разговор появится здесь.",
  noConversationYet: "Пока нет разговоров",
  expandedTranscriptEmptyDescription:
    "Чтобы начать, используйте голос или текст. Закройте этот экран, если захотите вернуться на главный экран.",
  transcriptSelectionHint:
    "Выберите любой текст сообщения напрямую или поделитесь и скопируйте отдельные сообщения ниже.",
  textMessagePlaceholder: "Введите сообщение",
  sendTextMessage: "Отправить сообщение",
  showVoiceInput: "Показать голосовой ввод",
  showTextInput: "Показать ввод текста",
  usageStatsHiddenDescription: "Не показывать оценки токенов в стенограмме.",
  usageStatsVisibleDescription:
    "Показывать предполагаемый расход токенов для ответов и итоги по разговору.",
  debugLogButton: "Кнопка журнала отладки",
  debugLogButtonHiddenDescription:
    "Держите кнопку ЖУРНАЛ на главном экране скрытой, если захват еще не запущен.",
  debugLogButtonVisibleDescription:
    "Показывать кнопку ЖУРНАЛ на главном экране для запуска и остановки записи отладки.",
  debugLogButtonUsageDescription:
    "Как использовать кнопку: при ее включении начнется запись журналов. Отключение этого параметра приведет к прекращению записи журналов и перемещению захваченных в буфер обмена.",
  estimatedUsageTitle: "Предполагаемое использование",
  estimatedUsageCounts: ({ replies, summaries }) =>
    `Ответов: ${replies} · обновлений памяти: ${summaries}`,
  estimatedUsageConversationScope:
    "Итоговые суммы включают все маршруты и модели, использованные в этом разговоре.",
  estimatedPromptTokens: ({ count }) => `Подсказка: ${count}`,
  estimatedReplyTokens: ({ count }) => `Ответ: ${count}`,
  estimatedTotalTokens: ({ count }) => `Итого: ${count}`,
  estimatedUsageInline: ({ prompt, completion, total }) =>
    `Прибл.: ${prompt} вход · ${completion} выход · ${total} всего`,
  searchQuery: "Поисковый запрос",
  expandWebSearchDetails: "Показать детали веб-поиска",
  collapseWebSearchDetails: "Скрыть детали веб-поиска",
  webSearchSourceCount: ({ count }) =>
    Number(count) === 1 ? "1 источник" : `Источников: ${count}`,
  sources: "Источники",
  openSourceLink: ({ source }) => `Открыть источник: ${source}`,
  turnReceipt: "Детали хода",
  expandTurnReceipt: "Показать детали хода",
  collapseTurnReceipt: "Скрыть детали хода",
  turnReceiptDirect: "Прямой",
  turnReceiptRequested: "Запрошенный маршрут ответа",
  turnReceiptActual: "Фактический маршрут ответа",
  turnReceiptEffort: "Контроль рассуждений",
  turnReceiptProviderNative: "родной для провайдера",
  turnReceiptInput: "Входной маршрут",
  turnReceiptSearch: "Веб-поиск",
  turnReceiptVoice: "Голосовой вывод",
  turnReceiptContext: "Контекст",
  turnReceiptTiming: "Тайминг",
  turnReceiptFallback: "Причина перехода на резерв",
  turnReceiptVoiceInput: "Голос",
  turnReceiptTypedInput: "Напечатано",
  turnReceiptSystemSpeech: "Системное распознавание речи",
  turnReceiptSystemVoice: "Системный голос",
  turnReceiptSystemVoiceFallback: "Системный голос · резервный вариант",
  turnReceiptOff: "Выключено",
  turnReceiptNotConfigured: "Включено · не настроено",
  turnReceiptFallbackWithoutSearch: "Продолжение без живого поиска",
  turnReceiptNotUsed: "Не используется",
  turnReceiptSummaryReused: "сохранённая сводка использована повторно",
  turnReceiptSummaryUpdated: "сводка обновлена",
  turnReceiptContextFallback: "резервный вариант недавних сообщений",
  turnReceiptGatewayCompression: ({ original, compressed }) =>
    `шлюз сжал ${original} сообщений до ${compressed}`,
  turnReceiptContextValue: ({ sent, total, summarized, state }) =>
    `отправлено предыдущих сообщений: ${sent}/${total} · заново обобщено: ${summarized}${state}`,
  turnReceiptTimingStt: "STT",
  turnReceiptTimingContext: "контекст",
  turnReceiptTimingSearch: "поиск",
  turnReceiptTimingModel: "модель",
  turnReceiptTimingFirstSpeech: "первая речь",
  turnReceiptTimingTotal: "общий",
  estimatedRouteUsageTokensOnly: ({ tokens }) => `${tokens} токенов`,
  unknownUsageRoute: "Неизвестный маршрут",
  setupGuideConnectProviderTitle: "Настройка учетных данных",
  setupGuideConnectProviderDescription:
    "Добавьте учетные данные в настройках, затем выберите маршруты, которые хотите использовать.",
  idle: "Ожидание",
  yourConversationAppearsHere: "Ваш разговор появится здесь",
  defaultTranscriptEmptyDescription:
    "Чтобы начать, используйте голос или текст. Mr Broccoli сохранит эту тему и ответит здесь.",
  delete: "Удалить",
  deleteConversationConfirmationTitle: ({ title }) => `Удалить «${title}»?`,
  deleteConversationConfirmationMessage:
    "Это безвозвратно удалит разговор и все его сообщения. Это действие невозможно отменить.",
  conversations: "Разговоры",
  drawerSubtitle:
    "Переключайтесь между активными обсуждениями или создайте новую комнату.",
  newSession: "Новая сессия",
  noSavedConversationsYet: "Сохраненных разговоров пока нет.",
  drawerEmptyDescription:
    "Начните говорить с главного экрана, и Mr Broccoli автоматически создаст сеанс.",
  setupGuideTitle: "Настройте приложение",
  setupGuideSubtitle: "Добавьте учетные данные и выберите маршруты в настройках.",
  fastestStartPreset: "Минимальная настройка",
  fastestStartDescription:
    "Используйте речь устройства, где это возможно, и настраивайте только тот маршрут ответа, который вам нужен.",
  fullVoicePreset: "Настроенный голос",
  fullVoiceDescription:
    "Используйте настроенные службы для ответов, транскрипции и голосового вывода, когда вы их выберете.",
  setupGuideNote:
    "Далее мы откроем настройки, чтобы вы могли вставить и проверить учетные данные.",
  useThisSetup: "Использовать эту настройку",
  notNow: "Не сейчас",
  setupGuideIntroTitle: "Как работает Mr Broccoli",
  setupGuideIntroBody:
    "Mr Broccoli начинается пустым. Добавьте учетные данные для внешних служб, которые вы уже используете, затем выберите способ маршрутизации ответов, речевого ввода, речевого вывода и дополнительного веб-контекста.",
  setupGuideIntroNote:
    "После настройки используйте основное голосовое управление, чтобы начать и остановить разговор. Текущая расшифровка остается доступной на главном экране, и каждый маршрут можно изменить позже в настройках.",
  setupGuideProviderTitle: "Добавить учетные данные",
  setupGuideProviderBody:
    "Выберите внешнюю службу, которую хотите настроить, затем вставьте учетные данные с возможностью ответа.",
  setupGuideProviderPickerLabel: "Служба ответов",
  setupGuideSelectProvider: "Выберите провайдера",
  setupGuideSelectProviderFirst: "Сначала выберите провайдера.",
  setupGuideApiKeyLabel: "Ключ API",
  setupGuideApiKeyPlaceholder: "Вставьте учетные данные",
  setupGuideContinue: "Продолжить",
  setupGuideOpenSettings: "Открыть настройки",
  setupGuideBack: "Назад",
  setupGuideValidateKey: "Подтвердить ключ",
  setupGuideApiKeyRequiredOrCancel:
    "Добавьте ключ API, чтобы продолжить, или отмените руководство по настройке.",
  setupGuideProviderAndApiKeyRequiredOrCancel:
    "Выберите провайдера и добавьте ключ API, чтобы продолжить, или отмените руководство по настройке.",
  setupGuideProviderKeyNeedsLlmAccess: ({ provider }) =>
    `Эти учетные данные ${provider} не позволяют запрашивать ответы.`,
  setupGuideKokoroTitle: "Добавьте естественный голос на устройстве",
  setupGuideKokoroBody: ({ size }) =>
    `Необязательно: загрузите Kokoro (около ${size} МБ) для гораздо более естественных устных ответов без использования голосового провайдера или платы за использование.`,
  setupGuideKokoroLanguageNote:
    "В настоящее время эта модель говорит на английском и упрощенном китайском языках. Нужные резервные маршруты можно настроить позже в настройках речи.",
  setupGuideKokoroDownload: "Скачать Kokoro",
  setupGuideUseKokoro: "Использовать Kokoro для озвученных ответов",
  setupGuideUseKokoroSummary:
    "Синтез остаётся на телефоне всякий раз, когда язык ответа поддерживается.",
  setupGuideSkipKokoro: "Пока пропустить",
  setupGuideVoiceTestTitle: "Проверьте свою настройку",
  setupGuideVoiceTestBody:
    "Скажите короткое предложение. Mr Broccoli проверит доступ к микрофону, транскрипцию, настроенный маршрут ответа и голосовой вывод, если доступен приемлемый голосовой маршрут.",
  setupGuideVoiceTestNoInputBody:
    "Голосовой ввод недоступен при этой настройке. Продолжайте просматривать обнаруженные маршруты, а затем при необходимости измените настройки речи позже.",
  setupGuideVoiceTestTextOnlyNote:
    "Этот тест остается только текстовым, поскольку приемлемый голосовой маршрут еще не готов.",
  setupGuideVoiceTestStart: "Начать тест",
  setupGuideVoiceTestStop: "Остановить запись",
  setupGuideVoiceTestRetry: "Запустить ещё раз",
  setupGuideVoiceTestTranscribing: "Расшифровка…",
  setupGuideVoiceTestThinking: "Тестирование ответа…",
  setupGuideVoiceTestSynthesizing: "Подготовка голоса…",
  setupGuideVoiceTestSpeaking: "Воспроизведение ответа…",
  setupGuideVoiceTestTranscript: "Стенограмма",
  setupGuideVoiceTestReply: "Ответ",
  setupGuideVoiceTestReset: "Очистить этот результат",
  setupGuideVoiceInputUnavailable:
    "Голосовой ввод недоступен для этой настройки на этом устройстве.",
  setupGuideSummaryTitle: "Настройка завершена",
  setupGuideSummaryBody:
    "Вот маршрут, который Mr Broccoli будет использовать с вашей текущей конфигурацией.",
  setupGuideSummaryLlm: "LLM",
  setupGuideSummaryStt: "Речь в текст",
  setupGuideSummaryTts: "Преобразование текста в речь",
  setupGuideSummaryWebSearch: "Веб-поиск",
  setupGuideRouteProviderLlm: ({ provider }) => `Включено через ${provider}`,
  setupGuideRouteOnDeviceStt: "Включено через системное распознавание речи",
  setupGuideRouteProviderStt: ({ provider }) =>
    `Включено через транскрипцию речи ${provider}`,
  setupGuideRouteProviderTts: ({ provider }) =>
    `Включено через голос ${provider}`,
  setupGuideRouteKokoroTts: "Включено через голос Kokoro на устройстве",
  setupGuideRouteLocalTts: "Включено через локальный голосовой пакет",
  setupGuideRouteUnavailable: "Недоступно",
  setupGuideRouteOff: "Выключено",
  setupGuideWebSearchAvailableOff: ({ provider }) =>
    `Доступно через ${provider}, сейчас отключено`,
  setupGuideSummaryTextOnlyNote:
    "Озвученные ответы пока отключены. Ответы остаются текстовыми, пока вы не включите провайдера или локальный голос.",
  setupGuideFinish: "Готово",
  searchConversationsPlaceholder: "Поиск по названиям, моделям и тексту сообщений",
  noMatchingConversations: "Нет подходящих разговоров",
  noMatchingConversationsDescription:
    "Попробуйте использовать другое название, маршрут, модель или фразу из стенограммы.",
  noProviderYet: "Пока нет провайдера",
  noModelYet: "Модели еще нет",
  startedAt: "Началось",
  endedAt: "Закончено",
  pinned: "Закреплено",
  copy: "Копировать",
  share: "Поделиться",
  rename: "Переименовать",
  pin: "Закрепить",
  unpin: "Открепить",
  save: "Сохранить",
  cancel: "Отмена",
  stop: "Остановить",
  pause: "Пауза",
  resume: "Возобновить",
  paused: "Приостановлено",
  listening: "Прослушивание",
  parsing: "Транскрипция",
  searching: "Идет поиск",
  converting: "Преобразование",
  webSearchAction: "веб-поиск",
  thinking: "Размышление",
  speaking: "Озвучивание",
  pleaseWait: "Пожалуйста, подождите",
  yourTurn: "Ваша очередь",
  keepPressing: "Продолжайте нажимать",
  tapWhenDone: "Нажмите, когда закончите",
  speechPaused: "Речь приостановлена",
  pausePlaybackUnavailable:
    "Этот голосовой маршрут нельзя приостановить. Остановите его или переключитесь на голосовой вывод провайдера.",
  holdToSpeak: "Удерживайте, чтобы говорить",
  tapToSpeak: "Нажмите, чтобы говорить",
  tapAgainToSend: "Нажмите еще раз, чтобы отправить",
  waitingForReply: "Ожидание ответа",
  parsingYourVoice: "Разбор вашего голоса",
  providerConfiguredInSettings: ({ provider }) =>
    `${provider} не настроен в настройках.`,
  providerNetworkError: ({ provider, action }) =>
    `Не удалось связаться с ${provider} для ${action}. Проверьте соединение и повторите попытку.`,
  providerAuthError: ({ provider, action }) =>
    `${provider} отклонил учетные данные для ${action}. Проверьте ключ и разрешения API.`,
  providerRateLimitError: ({ provider, action }) =>
    `${provider} сейчас ограничивает скорость ${action}. Повторите попытку через минуту.`,
  providerCreditsRequired: ({ provider, action }) =>
    `${provider} требуется достаточный кредит API для ${action}. Проверьте баланс счета и лимит расходов ключа.`,
  providerTimeoutError: ({ provider, action }) =>
    `${provider} занял слишком много времени во время ${action}. Попробуйте еще раз.`,
  providerTemporaryError: ({ provider, action }) =>
    `У ${provider} возникла временная проблема во время ${action}. Повторите попытку через некоторое время.`,
  providerEmptyReplyError: ({ provider }) =>
    `${provider} завершил работу, не ответив. Попробуйте еще раз.`,
  providerIncompleteReplyError: ({ provider }) =>
    `Ответ ${provider} закончился, не успев завершиться. Попробуйте еще раз.`,
  providerContextTooLong: ({ provider }) =>
    `${provider} отклонил ответ, поскольку разговор стал слишком длинным. Создайте новую тему или сократите запрос.`,
  providerRequestRejected: ({ provider, action, detail }) =>
    detail
      ? `${provider} отклонил запрос ${action}: ${detail}`
      : `${provider} отклонил запрос ${action}.`,
  providerWebSearchNotRun: ({ provider }) =>
    `${provider} вернул ответ без запуска веб-поиска.`,
  providerValidationSuccess: ({ provider }) => `${provider} готов к использованию.`,
  providerCapabilityValidationSuccess: ({ provider, capability }) =>
    `${provider} ${capability} работает.`,
  providerValidationFailed: "Проверка провайдера не удалась.",
  webSearchFallback:
    "Веб-поиск был недоступен, поэтому ответ продолжился без живого веб-контекста.",
  noBase64EncoderAvailable: "Кодировщик Base64 недоступен.",
  noBase64DecoderAvailable: "Декодера base64 нет.",
  azureSpeechApiKeyFormat:
    "Microsoft Azure TTS требуются учетные данные Azure Speech в формате <key>|<region>, например abc123|westeurope, или комбинированный формат Azure <endpoint>|<api-key>|<key>|<region>.",
  nativeTtsDoesNotSynthesizeAudioFiles:
    "Системный TTS не синтезирует аудиофайлы.",
  localTtsUnavailableForLanguage: ({ languageLabel }) =>
    `Для ${languageLabel} не готов локальный или облачный голосовой маршрут.`,
  chooseTextToSpeechProviderInSettings:
    "Выберите провайдера преобразования текста в речь в настройках.",
  ttsNotSupportedYet: ({ provider }) => `${provider} TTS пока не поддерживается.`,
  ttsError: ({ provider, status, errorText }) =>
    `Ошибка ${provider} TTS (${status}): ${errorText}`,
  ttsReplyTooLong: ({ provider }) =>
    `Речевой вывод ${provider} отклонил ответ, поскольку он был слишком длинным.`,
  ttsTimeout: ({ provider }) => `Вывод речи ${provider} занял слишком много времени.`,
  sttTimeout: ({ provider }) =>
    `Транскрипция речи ${provider} заняла слишком много времени.`,
  sttFileSizeLimitExceeded: ({ provider, model, limit }) =>
    `${provider} ${model} принимает записи только до ${limit}. Используйте более короткую запись или смените модель STT.`,
  voiceInputCaptureIncomplete:
    "Голосовой ввод не удалось четко записать. Пожалуйста, попробуйте еще раз.",
  ttsDidNotReturnAudio: ({ provider }) =>
    `${provider} TTS не вернул звук.`,
  nativeSttHandledInApp:
    "Системное распознавание речи обрабатывается прямо в приложении.",
  chooseSpeechToTextProviderInSettings:
    "Выберите провайдера преобразования речи в текст в настройках.",
  sttNotSupportedYet: ({ provider }) => `${provider} STT пока не поддерживается.`,
  providerNotWiredUpYet: ({ provider }) => `${provider} еще не подключен.`,
  you: "Вы",
  assistant: "Ассистент",
  untitledConversation: "Разговор без названия",
  conversationExportHeader: ({ title }) => `Разговор: ${title}`,
  speechRecognitionPermissionNotGranted:
    "Разрешение на распознавание речи не предоставлено.",
  speechRecognitionUnavailableForDeviceLanguage:
    "Распознавание речи недоступно для текущего языка устройства.",
  nativeSpeechRecognitionNeedsNetwork:
    "Системному распознаванию речи сейчас требуется доступ к сети.",
  noSpeechDetected: "Речь не обнаружена.",
  nativeSpeechRecognitionFailed: "Сбой системного распознавания речи.",
  couldntStartNativeSpeechRecognition:
    "Не удалось запустить системное распознавание речи.",
  microphonePermissionNotGranted: "Разрешение на использование микрофона не предоставлено",
} satisfies TranslationDictionary;
