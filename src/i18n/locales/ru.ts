import type { TranslationDictionary } from "../types";

export const ru = {
  appName: "Мистер Брокколи",
  retry: "Повторить попытку",
  dismiss: "Закрыть",
  done: "Готово",
  aboutSetting: ({ setting }) => `О ${setting}`,
  unavailable: "Недоступно",
  selection: "Выбор",
  chooseCompatibleProviderFirst: "Сначала выберите совместимого провайдера",
  settings: "Настройки",
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
  settingsReadinessReady: "Готовый",
  settingsReadinessNeedsAttention: "Внимание",
  settingsReadinessBroken: "Сломанный",
  settingsReadinessOff: "Выключенный",
  settingsConnections: "Соединения",
  settingsThinking: "мышление",
  settingsListening: "Прослушивание",
  settingsSpeaking: "Говорящий",
  settingsSearch: "Поиск",
  settingsAppDiagnostics: "Приложение и диагностика",
  settingsGuidedSetup: "Пошаговая настройка",
  settingsGuidedSetupSummary:
    "Просмотрите соединения и протестируйте весь голосовой маршрут.",
  setupGuideShowInSettings: "Показывать управляемую настройку в настройках",
  setupGuideShowInSettingsSummary:
    "Показать или скрыть ярлык пошаговой настройки в обзоре настроек.",
  settingsConnectionsSummary: "Ключи поставщика, проверка и возможности.",
  settingsThinkingSummary: "Домашние карточки, модели, усилия и системные подсказки.",
  settingsListeningSummary: "Режим ввода и маршрутизация речи в текст.",
  settingsSpeakingSummary: "Разговорные ответы, воспроизведение, голоса и предварительный просмотр.",
  settingsSearchSummary: "Поставщик веб-поиска и контроль качества поиска.",
  settingsAppDiagnosticsSummary:
    "Тема, язык, использование, журналы отладки и недавние действия.",
  settingsBackToOverview: "Вернуться к обзору",
  settingsOpenSection: ({ section }) => `Открыть ${section}`,
  theme: "Тема",
  language: "Язык",
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
  fixed: "Зафиксированный",
  english: "Английский",
  german: "немецкий",
  ukrainian: "Украинский",
  hindi: "хинди",
  spanish: "испанский",
  french: "Французский",
  italian: "итальянский",
  portuguese: "португальский",
  portugueseBrazil: "Португальский (Бразилия)",
  russian: "Русский",
  simplifiedChinese: "Упрощённый китайский",
  arabic: "Арабский",
  japanese: "Японский",
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
  instructionsTabDescription:
    "Сформируйте скрытое руководство, которое будет управлять помощником до того, как какой-либо поставщик увидит запрос.",
  providersTabDescription:
    "Сохраните учетные данные внешней службы на устройстве и настройте режимы ответа, которые вы хотите использовать.",
  webSearchTabDescription:
    "Настройте дополнительный онлайн-контекст перед ответами.",
  responseModes: "Выбор модели",
  aboutModelSelection: "О выборе модели",
  modelSelectionInfo:
    "Каждая карточка модели становится выбором на главном экране. Настройте поставщика, модель и дополнительный уровень усилий, а затем поменяйте карты, чтобы выбрать, какая модель будет отвечать следующей.",
  responseModeItemTitle: ({ index }) => `Модель ${index}`,
  addResponseMode: "Добавить модель",
  removeResponseMode: "Удалить модель",
  responseModesNoConfiguredProviders:
    "Сначала добавьте учетные данные. Элементы управления маршрутом остаются скрытыми до тех пор, пока не будет настроена хотя бы одна совместимая служба.",
  useResponseMode: ({ mode }) => `Используйте ${mode}`,
  chooseResponseModel: "Выберите модель",
  responseModelCount: ({ count }) => `Доступны модели ${count}`,
  sttTabDescription:
    "Управляйте тем, как захватывается речь и какой сервер преобразует звук в текст до того, как он достигнет модели.",
  ttsTabDescription:
    "Контролируйте, когда ответы начинают произноситься и какой сервер обрабатывает голосовой вывод.",
  brief: "Краткий",
  briefDescription:
    "Держите ответ в тайне. Используйте минимальное количество предложений, необходимое для полного ответа пользователю.",
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
    "Говорите как умный друг в кафе. Расслабленный, естественный, разговорчивый. Схватки в порядке, касательные в порядке.",
  nerdy: "Всезнайка",
  nerdyDescription:
    "Говорите как эксперт-энтузиаст, который любит углубляться. Свободно используйте техническую терминологию, вникайте в детали, предполагайте, что пользователь сможет идти в ногу со временем.",
  concise: "Краткий",
  conciseDescription:
    "Будьте как можно более краткими, но при этом оставайтесь полными. Никакой преамбулы, никакого дополнения, только ответ. Подумайте о стиле Telegram.",
  socratic: "Сократический",
  socraticDescription:
    "Бросьте вызов мышлению пользователя. Задавайте встречные вопросы, предлагайте альтернативные точки зрения, а не просто подтверждайте сказанное. Будьте спарринг-партнером, а не машиной, которая соглашается.",
  eli5: "ЭЛИ5",
  eli5Description:
    "Объясните все как можно проще. Используйте аналогии, повседневный язык, отсутствие жаргона. Предположим, что у вас нет предварительных знаний по какой-либо теме.",
  useProvider: ({ provider }) => `Используйте ${provider}`,
  createApiKey: "Реквизиты для входа",
  apiKey: "Ключ API",
  aboutThisProvider: "Об этом провайдере",
  openRouterOnboardingTitle: "Один ключ, несколько поставщиков",
  openRouterOnboardingDescription:
    "Создайте выделенный ключ OpenRouter, вставьте его ниже и используйте модели с поддержкой моментальных снимков от нескольких поставщиков, не заменяя прямого соединения.",
  openRouterOnboardingRoute:
    "Путь запроса: это устройство → OpenRouter → выбранный вышестоящий поставщик",
  openRouterKeys: "Ключи OpenRouter",
  providerStatusInvalid: "Неверный",
  providerStatusTesting: "Тестирование",
  providerStatusConfigured: "Настроен",
  providerStatusWorking: "Работающий",
  providerStatusNotTested: "Не проверено",
  providerStatusNotSetup: "Не настроено",
  expandProvider: ({ provider }) => `Развернуть ${provider}`,
  collapseProvider: ({ provider }) => `Свернуть ${provider}`,
  testProviderKey: "Тестовый ключ",
  testAllCapabilities: "Протестировать все",
  apiTest: "API тест",
  testProviderCapability: ({ capability }) => `Тест ${capability}`,
  test: "Тест",
  optional: "Необязательный",
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
    "Он всегда добавляется перед выбранной длиной и тоном ответа.",
  adaptiveLength: "Адаптивная длина",
  responseTone: "Ответный тон",
  homeStyleChipLabel: ({ tone, length }) => `Стиль — ${tone} · ${length}`,
  styleSheetTitle: "Настройки разговора",
  styleSheetSubtitle: "Формируйте ответы и речь только для этого разговора.",
  openStyleSheet: "Открыть настройки беседы",
  conversationThinkingInstructions: "Инструкции по мышлению",
  conversationThinkingInstructionsDescription:
    "Добавьте инструкции после глобального системного запроса для этого разговора.",
  conversationThinkingInstructionsPlaceholder:
    "Например: оспорьте мои предположения и используйте конкретные примеры.",
  ttsInstructions: "Инструкции по подаче речи",
  ttsInstructionsDescription:
    "Управляйте тоном, темпом, акцентом или подачей, используемыми совместимыми речевыми моделями.",
  conversationTtsInstructionsDescription:
    "Добавьте инструкции по доставке после общих речевых инструкций для этого разговора.",
  ttsInstructionsPlaceholder:
    "Например: говорите тепло, четко и в спокойном темпе.",
  ttsInstructionsUnsupported:
    "Текущий маршрут речи не поддерживает инструкции по доставке.",
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
  conversationTitleGenerationFailed: "Не удалось создать заголовок беседы.",
  conversationTitleGenerationTimedOut:
    "Генерация названия заняла слишком много времени. Пожалуйста, попробуйте еще раз.",
  inputMode: "Режим ввода",
  voiceInput: "Голосовой ввод",
  pushToTalk: "Нажмите, чтобы поговорить",
  pushToTalkDescription:
    "Удерживайте главную кнопку во время разговора, затем отпустите, чтобы отправить.",
  toggleToTalk: "Переключиться на разговор",
  toggleToTalkDescription:
    "Нажмите один раз, чтобы начать запись, и нажмите еще раз, когда закончите.",
  driveSession: "Дисковый сеанс",
  driveSessionDescription:
    "Если автоматическое продолжение включено, запись начинается после каждого устного ответа. Нажмите главную кнопку, когда закончите говорить.",
  stopDriveSession: "Пауза авто",
  repeatDriveReply: "Повторить последний",
  continueDriveSession: "Возобновить авто",
  speechToText: "Речь в текст",
  appNative: "Распознавание системы",
  nativeSttDescription:
    "Используйте распознаватель речи операционной системы. В зависимости от настроек устройства распознавание может выполняться на устройстве или через системный сервис. Ключ поставщика не требуется.",
  provider: "Поставщик",
  webSearchProvider: "Поставщик веб-поиска",
  webSearchProviderMissingHint:
    "Настройте хотя бы одну службу с возможностью поиска в разделе «Учетные данные», чтобы включить веб-обоснование здесь.",
  webSearchModelHint: ({ model }) =>
    `Использует ${model} за кулисами для заземления в сети.`,
  webSearchHomeHint:
    "Используйте переключатель на главном экране, чтобы включить или выключить веб-заземление для этой темы.",
  settingsWebSearchCompactHint:
    "При необходимости добавьте свежий веб-контекст перед ответом основной модели.",
  webSearchAdvanced: "Расширенные элементы управления поиском",
  expandAdvancedSearch: "Расширьте элементы управления расширенным поиском",
  collapseAdvancedSearch: "Свернуть элементы управления расширенным поиском",
  webSearchSetupNeeded: "Добавьте учетные данные для использования интерактивного веб-поиска.",
  webSearchEnabledDescription:
    "Свежий веб-контекст добавляется перед ответом модели.",
  webSearchDisabledDescription:
    "Используйте живой веб-контекст для этой темы, когда текущие факты имеют значение.",
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
  sttProvider: "Поставщик STT",
  sttProviderEnabledHint:
    "Здесь отображаются только включенные поставщики с поддержкой транскрипции.",
  sttProviderMissingHint:
    "Добавьте учетные данные для службы с поддержкой STT, чтобы выбрать ее здесь.",
  nativeSttHint:
    "Распознавание системы работает независимо от ключей вашего провайдера и может обрабатываться на устройстве или с помощью речевой службы операционной системы.",
  replyPlayback: "Воспроизведение ответа",
  sentencesArrive: "Параграфы прибыли",
  sentencesArriveDescription:
    "Начинайте говорить, как только будет готов полный абзац.",
  fullReplyFirst: "Полный ответ сначала",
  fullReplyFirstDescription:
    "Сначала сгенерируйте весь ответ, а затем воспроизведите его за один проход.",
  textToSpeech: "Преобразование текста в речь",
  spokenReplies: "Разговорные ответы",
  spokenRepliesEnabledDescription:
    "Помощник по чтению отвечает вслух, когда доступен голосовой маршрут.",
  spokenRepliesDisabledDescription:
    "Оставьте ответы пока только текстовыми. Предпочитаемый маршрут TTS сохраняется на будущее.",
  nativeTtsDescription:
    "Используйте речевой движок устройства для голосовых ответов и предварительного просмотра голоса.",
  kokoroTtsDescription:
    "Используйте на этом устройстве гораздо более естественный нейронный голос. Текст голосового ответа синтезируется локально, без ключа речевого провайдера или платы за использование.",
  kokoroVoices: "Kokoro Голоса на устройстве",
  kokoroVoicesHint: ({ size, installedSize }) =>
    `Многоязычная модель загружает около ${size} МБ и занимает около ${installedSize} МБ после установки.`,
  kokoroModel: "Многоязычная модель Kokoro",
  kokoroChecking: "Проверка модели устройства…",
  kokoroDownloading: ({ progress }) => `Загрузка… ${progress}%`,
  kokoroExtracting: ({ progress }) => `Установка… ${progress}%`,
  kokoroVerifying: "Проверка голосового механизма…",
  kokoroInstalled: "Установлено и готово на этом устройстве.",
  kokoroNotInstalled: "Необязательная загрузка. Ключ провайдера не требуется.",
  kokoroLanguageFallback:
    "Kokoro в настоящее время говорит здесь на английском и упрощенном китайском языках. Для других выбранных языков ответа добавьте явный резервный маршрут, иначе речь прекратится из-за ошибки.",
  kokoroRemoveTitle: "Удалить модель Kokoro?",
  kokoroRemoveBody: ({ installedSize }) =>
    `Это освобождает около ${installedSize} МБ. Вы можете скачать модель снова в любое время.`,
  removeKokoroModel: "Удалите модель Kokoro.",
  downloadKokoroModel: "Загрузите модель Kokoro",
  kokoroFallbackNeeded: ({ languages }) =>
    `Для: ${languages} требуется явный резервный маршрут.`,
  kokoroNoSelectedLanguages:
    "Выберите английский или упрощенный китайский в разделе «Языки прослушивания», чтобы настроить голос Kokoro.",
  expandVoiceSettings: ({ language }) => `Разверните голосовые настройки ${language}`,
  collapseVoiceSettings: ({ language }) =>
    `Свернуть голосовые настройки ${language}`,
  remove: "Удалять",
  voiceOutputDescription:
    "Выберите речевой движок, языки прослушивания и голосовой предварительный просмотр для устных ответов.",
  localTts: "Местный",
  localTtsDescription:
    "Используйте соответствующий загруженный местный голос для голосовых ответов.",
  providerTtsDescription:
    "Используйте выбранную настроенную службу для голосовых ответов.",
  ttsFallbackRoutes: "Резервные маршруты",
  ttsFallbackRoutesHint:
    "Необязательный. Добавляйте только те маршруты, которые вам нужны, в том порядке, в котором их следует опробовать. Как только маршрут начинает говорить, Мистер Брокколи остается на нем до конца ответа.",
  ttsFallbackNone:
    "Резервный вариант не настроен. Вместо этого будет отображаться сбой голосовой связи.",
  ttsFallbackPosition: ({ position, route }) => `${position}. ${route}`,
  addFallbackRoute: ({ route }) => `Добавить резервный вариант ${route}`,
  removeFallbackRoute: ({ route }) => `Удалить резервный вариант ${route}`,
  moveFallbackEarlier: ({ route }) => `Переместить ${route} раньше`,
  moveFallbackLater: ({ route }) => `Переместить ${route} позже`,
  ttsProvider: "Поставщик TTS",
  ttsProviderEnabledHint:
    "Здесь отображаются только включенные поставщики с поддержкой голосового ответа.",
  ttsProviderMissingHint:
    "Добавьте учетные данные для службы с поддержкой TTS, чтобы выбрать ее здесь.",
  localTtsOrderHint:
    "Используются только явно настроенные резервные маршруты.",
  providerTtsOrderHint:
    "Используются только явно настроенные резервные маршруты.",
  nativeTtsHint:
    "Нативный TTS использует системный голосовой стек и не требует ключа провайдера.",
  localTtsLanguageCoverageHint:
    "В настоящее время локальные пакеты охватывают английский, немецкий, упрощенный китайский, испанский, португальский, хинди, французский и итальянский языки.",
  ttsVoice: "TTS Голос",
  refresh: "Обновить",
  providerVoiceDirectory: ({ provider }) => `Голосовая библиотека ${provider}`,
  refreshProviderVoices: ({ provider }) => `Обновить голоса ${provider}`,
  providerVoicesAvailable: ({ count, provider }) =>
    `${count} ${Number(count) === 1 ? "голос" : "голоса"} доступен на ${provider}.`,
  providerVoicesLoadFailed:
    "Голоса не удалось обновить. Ваш текущий выбор не изменился; вы по-прежнему можете ввести голосовой идентификатор вручную.",
  providerVoicesLoadFailedWithFallback:
    "Не удалось загрузить голоса аккаунта. Встроенный голос остается доступным.",
  providerVoicesErrorDetail: ({ detail }) => `Причина: ${detail}`,
  elevenLabsVoicesReadPermissionHint:
    "В ElevenLabs отредактируйте этот ключ API и включите «Голоса» → «Чтение», затем обновите здесь.",
  providerVoicesLoadingHint: ({ provider }) =>
    `Мистер Брокколи автоматически загружает доступные голоса из ${provider}.`,
  providerVoiceId: "Голосовой идентификатор",
  providerVoiceIdPlaceholder: "Введите голосовой идентификатор",
  providerVoiceIdFallbackHint:
    "Ручной ввод остается доступным, если голосовая библиотека не может быть загружена.",
  providerVoiceIdRequired: ({ provider }) =>
    `Обновите голосовую библиотеку ${provider} или введите голосовой идентификатор перед использованием речевого вывода.`,
  qwenSpeechUnavailableInUs:
    "Текущие речевые маршруты Мистер Брокколи Qwen недоступны в регионе США. Выберите Сингапур или Пекин для выступления Qwen.",
  qwenApiRegion: "Qwen API Регион",
  qwenRegionSingapore: "Сингапур",
  qwenRegionUs: "США (Вирджиния)",
  qwenRegionBeijing: "Китай (Пекин)",
  qwenRegionHint:
    "Выбранный регион должен соответствовать региону, в котором был создан этот ключ API.",
  qwenRegionUsSpeechHint:
    "Ключи региона США поддерживают чат и веб-поиск здесь. Для текущих маршрутов Мистер Брокколи Qwen STT и TTS требуется ключ Сингапура или Пекина.",
  providerDefaultVoiceHint:
    "В настоящее время этот провайдер использует голос по умолчанию для предварительного просмотра и устных ответов.",
  listenLanguages: "Слушайте языки",
  listenLanguagesHint:
    "Выберите языки ответов, на которых вы хотите, чтобы они звучали хорошо. Мистер Брокколи пробует их в этом порядке при маршрутизации речевого вывода.",
  listenLanguagesSelected: ({ count }) =>
    count === 1 ? "выбран 1 язык" : `${count} выбраны языки`,
  localVoicePacks: "Местные голосовые пакеты",
  localVoicePacksHint:
    "Каждый язык сохраняет свой местный голос. Выберите нужный голос для этого языка, а затем загружайте только те пакеты, которые вам действительно интересны.",
  localVoiceForLanguage: ({ languageLabel }) => `Голос для ${languageLabel}`,
  providerVoicePreviews: "Голосовые превью провайдера",
  providerVoicePreviewsHint:
    "Проверьте текущий выбранный маршрут TTS здесь с отдельным текстом предварительного просмотра для каждого языка ответа.",
  nativeVoicePreviewSection: "Предварительный просмотр встроенного голоса",
  nativeVoicePreviewSectionHint:
    "Он звучит напрямую через встроенный синтезатор речи телефона, поэтому вы можете сравнить его с настроенными голосами провайдера.",
  nativeVoiceUnavailable:
    "Это устройство не сообщило о каких-либо собственных системных голосах для предварительного просмотра.",
  speechDiagnostics: "Недавняя речевая активность",
  speechDiagnosticsHint:
    "Показывает последние речевые запросы, маршрут, который они запросили, маршрут, который они фактически использовали, а также любые резервные причины.",
  clearSpeechDiagnostics: "Очистить недавнюю речевую активность",
  speechDiagnosticsEmpty:
    "Недавних запросов на выступление пока нет. Предварительно прослушайте голос или воспроизведите ответ, чтобы просмотреть детали маршрутизации здесь.",
  clearSpeechDiagnosticsConfirmationTitle: "Очистить недавнюю речевую активность?",
  clearSpeechDiagnosticsConfirmationMessage:
    "При этом удаляются все захваченные данные диагностики маршрутизации речи. Это действие невозможно отменить.",
  speechDiagnosticSourceConversation: "Ответ на разговор",
  speechDiagnosticSourceRepeat: "Повторить ответ",
  speechDiagnosticSourcePreview: "Голосовой предварительный просмотр",
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
    "Еще не установлен. Облако TTS или системный голос будут использоваться до тех пор, пока вы его не загрузите.",
  localTtsUnsupportedLanguageFallback:
    "Локальный пакет для этого языка пока недоступен. Облако TTS или системный голос справятся с этим.",
  downloadingLocalTtsPack: ({ progress }) =>
    `Загрузка локального пакета... ${progress}%`,
  download: "Скачать",
  downloadingShort: "Загрузка...",
  voicePreviewText: "Текст голосового предварительного просмотра",
  voicePreviewPlaceholder: "Введите фразу, чтобы услышать этот голос.",
  voicePreviewHint:
    "Использует выбранный в данный момент голосовой механизм ответа, не отправляя ничего в языковую модель.",
  previewVoice: "Предварительный просмотр голоса",
  generatingPreview: "Создание предварительного просмотра...",
  playingPreview: "Воспроизведение предварительного просмотра...",
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
  threadPinned: "Нитка закреплена.",
  threadUnpinned: "Тема откреплена.",
  addProviderKeyToUseProvider: ({ provider }) =>
    `Прежде чем использовать этот маршрут, добавьте учетные данные для ${provider} в настройках.`,
  configureCredentialsBeforeVoiceSession:
    "Добавьте учетные данные в настройках перед началом голосового сеанса.",
  endpointCredentialFormatInvalid: ({ provider }) =>
    `Для ${provider} введите базовый URL-адрес поставщика и ключ API в виде https://your-endpoint.example.com|your-api-key.`,
  speechRecognitionUnavailableOnDevice:
    "Распознавание речи недоступно на этом устройстве.",
  debugLogLabel: "БРЕВНО",
  debugLogCaptureStarted: "Начато ведение журнала отладки.",
  debugLogCaptureStopped: ({ entryCount, fileName }) =>
    `Журнал отладки сохранен как ${fileName} и скопирован в буфер обмена (записи ${entryCount}).`,
  debugLogCaptureStoppedNoClipboard: ({ entryCount, fileName }) =>
    `Журнал отладки сохранен как ${fileName} (записи ${entryCount}).`,
  debugLogCaptureRecovered: ({ entryCount, fileName }) =>
    `Восстановил предыдущий журнал отладки ${fileName} и скопировал его в буфер обмена (записи ${entryCount}).`,
  debugLogCaptureRecoveredNoClipboard: ({ entryCount, fileName }) =>
    `Восстановлен предыдущий журнал отладки ${fileName} (записи ${entryCount}).`,
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
    `Эта запись слишком длинная для преобразования речи в текст ${provider} (максимум ${limit}). Попробуйте написать более короткое сообщение или переключите преобразование речи в текст на распознавание системы.`,
  addProviderKeyToEnableProvider: ({ provider }) =>
    `Прежде чем использовать этот маршрут, добавьте учетные данные для ${provider} в настройках.`,
  stopSessionBeforePreview:
    "Остановите активный голосовой сеанс перед прослушиванием голоса.",
  chooseTtsToPreviewVoices:
    "Выберите настроенный маршрут TTS в настройках, чтобы просмотреть голоса.",
  downloadSelectedLocalVoiceFirst: ({ languageLabel }) =>
    `Сначала загрузите выбранный местный голос ${languageLabel}.`,
  couldntPreviewVoice: "Не удалось просмотреть голос.",
  spokenRepliesDisabled: "Голосовые ответы отключены в настройках.",
  providerVoiceFallback:
    "Не удалось настроить голосовой маршрут. Этот ответ переключен на запасной голос.",
  localVoiceFallback:
    "Местная голосовая связь была недоступна. Этот ответ переключен на запасной голос.",
  localTtsPackInstalled: ({ languageLabel }) =>
    `Установлен локальный голосовой пакет ${languageLabel}.`,
  localTtsPackInstallFailed: "Не удалось установить локальный голосовой пакет.",
  clear: "Прозрачный",
  voiceOutput: "Голосовой вывод",
  currentSetup: "Текущая настройка",
  listeningToYourVoice: "Слушая свой голос",
  parsingYourVoiceInput: "Превратим ваш голос в текст",
  preparingRequest: "Подготовка вашего запроса",
  searchingTheWeb: "Поиск в Интернете свежего контекста",
  waitingForProvider: ({ provider }) => `Жду ${provider}`,
  preparingVoiceWithProvider: ({ provider }) =>
    `Подготовка голоса с помощью ${provider}`,
  deepThinkingReassurance: "Хорошие ответы требуют времени…",
  thinkingElapsed: ({ detail, seconds }) => `${detail} · ${seconds}s`,
  speakingBackToYou: "Говоря тебе в ответ",
  freshSession: "Свежая сессия",
  messageCount: ({ count }) =>
    Number(count) === 1 ? "1 сообщение" : `Сообщения ${count}`,
  speechInputRoute: ({ route }) => `Выступление в: ${route}`,
  replyModelRoute: ({ route }) => `Модель ответа: ${route}`,
  voiceOutputRoute: ({ route }) => `Голосовой вывод: ${route}`,
  fallbackVoiceOutputRoute: ({ route }) => `Резервный голосовой выход: ${route}`,
  conversation: "Беседа",
  conversationActions: "Действия в диалоге",
  statusDetails: "Детали статуса",
  persistenceFailure:
    "Мистер Брокколи не удалось сохранить данные на этом устройстве. Оставьте приложение открытым и повторите попытку; последние изменения могут быть потеряны после перезапуска.",
  show: "Показывать",
  showTranscript: "Показать стенограмму",
  hide: "Скрывать",
  copyThread: "Копировать тему",
  shareThread: "Поделиться темой",
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
    "Чтобы начать, используйте голос или текст. Закройте этот экран, если захотите вернуться на главную сцену.",
  transcriptSelectionHint:
    "Выберите любой текст сообщения напрямую или поделитесь и скопируйте отдельные сообщения ниже.",
  textMessagePlaceholder: "Введите сообщение",
  sendTextMessage: "Отправить сообщение",
  showVoiceInput: "Показать голосовой ввод",
  showTextInput: "Показать ввод текста",
  usageStatsHiddenDescription: "Не допускайте попадания оценок токенов в расшифровку UI.",
  usageStatsVisibleDescription:
    "Показывать предполагаемое использование токенов для ответов и общего количества разговоров.",
  debugLogButton: "Кнопка журнала отладки",
  debugLogButtonHiddenDescription:
    "Держите кнопку ЖУРНАЛ на главном экране скрытой, если захват еще не запущен.",
  debugLogButtonVisibleDescription:
    "Покажите кнопку LOG на главном экране для запуска и остановки записи отладки.",
  debugLogButtonUsageDescription:
    "Как использовать кнопку: при ее включении начнется запись журналов. Отключение этого параметра приведет к прекращению записи журналов и перемещению захваченных в буфер обмена.",
  estimatedUsageTitle: "Предполагаемое использование",
  estimatedUsageCounts: ({ replies, summaries }) =>
    `${replies} отвечает · ${summaries} обновления памяти`,
  estimatedUsageConversationScope:
    "Итоговые суммы включают все маршруты и модели, использованные в этом разговоре.",
  estimatedPromptTokens: ({ count }) => `Подсказка: ${count}`,
  estimatedReplyTokens: ({ count }) => `Ответ: ${count}`,
  estimatedTotalTokens: ({ count }) => `Итого: ${count}`,
  estimatedUsageInline: ({ prompt, completion, total }) =>
    `Стандартное восточное время. ${prompt} вход · ${completion} выход · ${total} всего`,
  searchQuery: "Поисковый запрос",
  expandWebSearchDetails: "Показать детали веб-поиска",
  collapseWebSearchDetails: "Скрыть детали веб-поиска",
  webSearchSourceCount: ({ count }) =>
    `${count} ${Number(count) === 1 ? "источник" : "источники"}`,
  sources: "Источники",
  openSourceLink: ({ source }) => `Открытый исходный код: ${source}.`,
  turnReceipt: "Детали поворота",
  expandTurnReceipt: "Показать детали поворота",
  collapseTurnReceipt: "Скрыть детали поворота",
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
  turnReceiptFallback: "Причина возврата",
  turnReceiptVoiceInput: "Голос",
  turnReceiptTypedInput: "Напечатано",
  turnReceiptSystemSpeech: "Система распознавания речи",
  turnReceiptSystemVoice: "Системный голос",
  turnReceiptSystemVoiceFallback: "Системный голос · запасной вариант",
  turnReceiptOff: "Выключенный",
  turnReceiptNotConfigured: "Включено · не настроено",
  turnReceiptFallbackWithoutSearch: "Продолжение без живого поиска",
  turnReceiptNotUsed: "Не используется",
  turnReceiptSummaryReused: "сохраненное резюме используется повторно",
  turnReceiptSummaryUpdated: "сводка обновлена",
  turnReceiptContextFallback: "резервный вариант недавних сообщений",
  turnReceiptGatewayCompression: ({ original, compressed }) =>
    `шлюз сжимает сообщения ${original} в ${compressed}`,
  turnReceiptContextValue: ({ sent, total, summarized, state }) =>
    `${sent}/${total} отправленные предыдущие сообщения · ${summarized} новые сводные данные${state}`,
  turnReceiptTimingStt: "STT",
  turnReceiptTimingContext: "контекст",
  turnReceiptTimingSearch: "поиск",
  turnReceiptTimingModel: "модель",
  turnReceiptTimingFirstSpeech: "первая речь",
  turnReceiptTimingTotal: "общий",
  estimatedRouteUsageTokensOnly: ({ tokens }) => `токены ${tokens}`,
  unknownUsageRoute: "Неизвестный маршрут",
  setupGuideConnectProviderTitle: "Настройка учетных данных",
  setupGuideConnectProviderDescription:
    "Добавьте учетные данные в настройках, затем выберите маршруты, которые хотите использовать.",
  idle: "Праздный",
  yourConversationAppearsHere: "Ваш разговор появится здесь",
  defaultTranscriptEmptyDescription:
    "Чтобы начать, используйте голос или текст. Мистер Брокколи сохранит эту тему и ответит здесь.",
  delete: "Удалить",
  deleteConversationConfirmationTitle: ({ title }) => `Удалить «${title}»?`,
  deleteConversationConfirmationMessage:
    "Это безвозвратно удалит беседу и все ее сообщения. Это действие невозможно отменить.",
  memory: "Память",
  conversations: "Разговоры",
  drawerSubtitle: "Переключайтесь между живыми обсуждениями или начните новую комнату.",
  newSession: "Новая сессия",
  noSavedConversationsYet: "Сохраненных разговоров пока нет.",
  drawerEmptyDescription:
    "Начните говорить с главного экрана, и Мистер Брокколи автоматически создаст сеанс.",
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
  useThisSetup: "Используйте эту настройку",
  notNow: "Не сейчас",
  setupGuideIntroTitle: "Как работает Мистер Брокколи",
  setupGuideIntroBody:
    "Мистер Брокколи начинается пустым. Добавьте учетные данные для внешних служб, которые вы уже используете, затем выберите способ маршрутизации ответов, речевого ввода, речевого вывода и дополнительного веб-контекста.",
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
  setupGuideContinue: "Продолжать",
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
    "В настоящее время эта модель говорит на английском и упрощенном китайском языках. Настройте резервные маршруты, которые вам нужны позже, в настройках разговорной речи.",
  setupGuideKokoroDownload: "Скачать Kokoro",
  setupGuideUseKokoro: "Используйте Kokoro для устных ответов.",
  setupGuideUseKokoroSummary:
    "Держите синтез на телефоне всякий раз, когда поддерживается язык ответа.",
  setupGuideSkipKokoro: "Пропустить сейчас",
  setupGuideVoiceTestTitle: "Проверьте свою настройку",
  setupGuideVoiceTestBody:
    "Скажите короткое предложение. Мистер Брокколи проверит доступ к микрофону, транскрипцию, настроенный маршрут ответа и голосовой вывод, если доступен приемлемый голосовой маршрут.",
  setupGuideVoiceTestNoInputBody:
    "Голосовой ввод недоступен при этой настройке. Продолжайте просматривать обнаруженные маршруты, а затем при необходимости измените настройки речи позже.",
  setupGuideVoiceTestTextOnlyNote:
    "Этот тест остается только текстовым, поскольку приемлемый голосовой маршрут еще не готов.",
  setupGuideVoiceTestStart: "Начать тест",
  setupGuideVoiceTestStop: "Остановить запись",
  setupGuideVoiceTestRetry: "Беги снова",
  setupGuideVoiceTestTranscribing: "Расшифровка…",
  setupGuideVoiceTestThinking: "Тестирование ответа…",
  setupGuideVoiceTestSynthesizing: "Подготовка голоса…",
  setupGuideVoiceTestSpeaking: "Воспроизведение ответа…",
  setupGuideVoiceTestTranscript: "Стенограмма",
  setupGuideVoiceTestReply: "Отвечать",
  setupGuideVoiceTestReset: "Очистить этот результат",
  setupGuideVoiceInputUnavailable:
    "Голосовой ввод недоступен для этой настройки на этом устройстве.",
  setupGuideSummaryTitle: "Настройка завершена",
  setupGuideSummaryBody:
    "Вот маршрут, который Мистер Брокколи будет использовать с вашей текущей конфигурацией.",
  setupGuideSummaryLlm: "LLM",
  setupGuideSummaryStt: "Речь в текст",
  setupGuideSummaryTts: "Преобразование текста в речь",
  setupGuideSummaryWebSearch: "Веб-поиск",
  setupGuideRouteProviderLlm: ({ provider }) => `Включено через ${provider}`,
  setupGuideRouteOnDeviceStt: "Включается через систему распознавания речи",
  setupGuideRouteProviderStt: ({ provider }) =>
    `Включено через транскрипцию речи ${provider}`,
  setupGuideRouteProviderTts: ({ provider }) => `Включается голосом ${provider}`,
  setupGuideRouteKokoroTts: "Включается с помощью голоса Kokoro на устройстве.",
  setupGuideRouteLocalTts: "Включено через локальный голосовой пакет",
  setupGuideRouteUnavailable: "Нет в наличии",
  setupGuideRouteOff: "Выключенный",
  setupGuideWebSearchAvailableOff: ({ provider }) =>
    `Доступно через ${provider}, в настоящее время отключено.`,
  setupGuideSummaryTextOnlyNote:
    "Голосовые ответы на данный момент отключены. Ответы остаются в текстовом виде, пока вы не включите провайдера или местную голосовую связь.",
  setupGuideFinish: "Сделанный",
  searchConversationsPlaceholder: "Поиск по названиям, моделям и тексту сообщений",
  noMatchingConversations: "Нет подходящих разговоров",
  noMatchingConversationsDescription:
    "Попробуйте использовать другое название, маршрут, модель или фразу из стенограммы.",
  memoryModalTitle: "Память разговоров",
  memoryModalDescription:
    "Это компактное описание, которое Мистер Брокколи переносит дальше, когда поток становится достаточно длинным, чтобы сжимать старые витки.",
  memorySummary: "Сохраненная сводка",
  memorySummaryEmpty:
    "Компактной памяти пока нет. Как только эта ветка станет длиннее, здесь будут суммироваться старые версии.",
  summarizedTurnsCount: ({ count }) =>
    Number(count) === 1 ? "1 суммарный ход" : `${count} суммированные ходы`,
  copyMemory: "Копирование памяти",
  forgetMemory: "Забудь память",
  memoryCopied: "Память скопирована.",
  memoryCleared: "Память разговоров очищена.",
  noConversationToManageYet: "Памяти для разговоров пока нет.",
  noProviderYet: "Пока нет провайдера",
  noModelYet: "Модели еще нет",
  startedAt: "Началось",
  endedAt: "Закончено",
  pinned: "Закреплено",
  copy: "Копировать",
  share: "Делиться",
  rename: "Переименовать",
  pin: "Приколоть",
  unpin: "Открепить",
  save: "Сохранять",
  cancel: "Отмена",
  stop: "Останавливаться",
  pause: "Пауза",
  resume: "Резюме",
  paused: "Приостановлено",
  listening: "Прослушивание",
  parsing: "Транскрипция",
  searching: "Идет поиск",
  converting: "Преобразование",
  webSearchAction: "веб-поиск",
  thinking: "мышление",
  speaking: "Говорящий",
  pleaseWait: "пожалуйста, подождите",
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
    `${provider} отклонил ответ, поскольку разговор затянулся. Создайте новую тему или сократите запрос.`,
  providerRequestRejected: ({ provider, action, detail }) =>
    detail
      ? `${provider} отклонил запрос ${action}: ${detail}`
      : `${provider} отклонил запрос ${action}.`,
  providerWebSearchNotRun: ({ provider }) =>
    `${provider} вернул ответ без запуска веб-поиска.`,
  providerValidationSuccess: ({ provider }) => `${provider} готов к использованию.`,
  providerCapabilityValidationSuccess: ({ provider, capability }) =>
    `${provider} ${capability} работает.`,
  providerValidationFailed: "Проверка поставщика не удалась.",
  webSearchFallback:
    "Веб-поиск был недоступен, поэтому ответ продолжился без живого веб-контекста.",
  noBase64EncoderAvailable: "Кодировщик Base64 недоступен.",
  noBase64DecoderAvailable: "Декодера base64 нет.",
  azureSpeechApiKeyFormat:
    "Microsoft Azure TTS требуются учетные данные Azure Speech в формате <key>|<region>, например abc123|westeurope, или комбинированный формат Azure <endpoint>|<api-key>|<key>|<region>.",
  googleCloudSpeechCredentialFormat: ({ provider }) =>
    `${provider} STT требуются учетные данные Google Cloud Speech в формате <project-id>|<access-token>|<location> или комбинированном формате Gemini. <Gemini API key>|<project-id>|<access-token>|<location>.`,
  bytedanceSpeechCredentialFormat: ({ provider }) =>
    `${provider} STT требуется Doubao Речевые учетные данные в формате <app-key>|<access-key>, дополнительно <app-key>|<access-key>|<resource-id> или комбинированном формате <ark-api-key>|<app-key>|<access-key>|<resource-id>.`,
  nativeTtsDoesNotSynthesizeAudioFiles:
    "Родной TTS не синтезирует аудиофайлы.",
  localTtsUnavailableForLanguage: ({ languageLabel }) =>
    `Для ${languageLabel} не готов локальный или облачный голосовой маршрут.`,
  chooseTextToSpeechProviderInSettings:
    "Выберите поставщика преобразования текста в речь в настройках.",
  ttsNotSupportedYet: ({ provider }) => `${provider} TTS пока не поддерживается.`,
  ttsError: ({ provider, status, errorText }) =>
    `Ошибка ${provider} TTS (${status}): ${errorText}`,
  ttsReplyTooLong: ({ provider }) =>
    `Речевой вывод ${provider} отклонил ответ, поскольку он был слишком длинным.`,
  ttsTimeout: ({ provider }) => `Вывод речи ${provider} занял слишком много времени.`,
  sttTimeout: ({ provider }) =>
    `Транскрипция речи ${provider} заняла слишком много времени.`,
  sttFileSizeLimitExceeded: ({ provider, model, limit }) =>
    `${provider} ${model} принимает записи только до ${limit}. Используйте более короткий зажим или замените модели STT.`,
  voiceInputCaptureIncomplete:
    "Голосовой ввод не удалось четко записать. Пожалуйста, попробуйте еще раз.",
  ttsDidNotReturnAudio: ({ provider }) =>
    `${provider} TTS не вернул звук.`,
  nativeSttHandledInApp: "Управление системой STT осуществляется непосредственно в приложении.",
  chooseSpeechToTextProviderInSettings:
    "Выберите провайдера преобразования речи в текст в настройках.",
  sttNotSupportedYet: ({ provider }) => `${provider} STT пока не поддерживается.`,
  providerNotWiredUpYet: ({ provider }) => `${provider} еще не подключен.`,
  you: "Ты",
  assistant: "Ассистент",
  untitledConversation: "Беседа без названия",
  conversationExportHeader: ({ title }) => `Разговор: ${title}`,
  speechRecognitionPermissionNotGranted:
    "Разрешение на распознавание речи не предоставлено.",
  speechRecognitionUnavailableForDeviceLanguage:
    "Распознавание речи недоступно для текущего языка устройства.",
  nativeSpeechRecognitionNeedsNetwork:
    "Для распознавания родной речи прямо сейчас требуется доступ к сети.",
  noSpeechDetected: "Речь не обнаружена.",
  nativeSpeechRecognitionFailed: "Распознавание родной речи не удалось.",
  couldntStartNativeSpeechRecognition:
    "Не удалось запустить распознавание родной речи.",
  microphonePermissionNotGranted: "Разрешение на использование микрофона не предоставлено",
} satisfies TranslationDictionary;
