import type { TranslationDictionary } from "../types";
import { dataBackupTranslations } from "../dataBackupTranslations";
import { onDeviceTranslations } from "../onDeviceTranslations";

export const es = {
  ...dataBackupTranslations.es,
  ...onDeviceTranslations.es,
  appName: "Sr. Brócoli",
  retry: "Reintentar",
  dismiss: "Cerrar",
  done: "Hecho",
  aboutSetting: ({ setting }) => `Acerca de ${setting}`,
  unavailable: "Indisponible",
  selection: "Selección",
  chooseCompatibleProviderFirst: "Elija primero un proveedor compatible",
  settings: "Ajustes",
  settingsReleaseVersion: ({ version }) => `Versión ${version}`,
  all: "Todos",
  firstRun: "Primer inicio",
  instructions: "Instrucciones",
  providers: "Proveedores",
  webSearch: "Búsqueda web",
  stt: "STT",
  tts: "TTS",
  ui: "UI",
  settingsRuntimeReadiness: "Preparación del tiempo de ejecución",
  settingsReadinessThink: "Pensar",
  settingsReadinessListen: "Escuchar",
  settingsReadinessSpeak: "Hablar",
  settingsReadinessSearch: "Buscar",
  settingsReadinessReady: "Listo",
  settingsReadinessNeedsAttention: "Atención",
  settingsReadinessBroken: "Roto",
  settingsReadinessOff: "Apagado",
  settingsConnections: "Conexiones",
  settingsThinking: "Pensamiento",
  settingsListening: "Escuchando",
  settingsSpeaking: "Discurso",
  settingsSearch: "Buscar",
  settingsAppDiagnostics: "Aplicación y diagnóstico",
  settingsGuidedSetup: "Configuración guiada",
  settingsGuidedSetupSummary:
    "Revisa las conexiones y prueba la ruta de voz completa.",
  setupGuideShowInSettings: "Mostrar configuración guiada en Configuración",
  setupGuideShowInSettingsSummary:
    "Muestre u oculte el acceso directo de configuración guiada en la descripción general de Configuración.",
  settingsConnectionsSummary: "Claves, validación y capacidades del proveedor.",
  settingsThinkingSummary: "Tarjetas de inicio, modelos, esfuerzo y aviso del sistema.",
  settingsListeningSummary: "Modo de entrada y enrutamiento de voz a texto.",
  settingsSpeakingSummary: "Respuestas habladas, reproducción, voces y vistas previas.",
  settingsSearchSummary: "Proveedor de búsqueda web y controles de calidad de búsqueda.",
  settingsAppDiagnosticsSummary:
    "Tema, idioma, uso, registros de depuración y actividad reciente.",
  settingsBackToOverview: "Volver a la descripción general",
  settingsOpenSection: ({ section }) => `Abrir ${section}`,
  theme: "Tema",
  language: "Idioma",
  recognitionLanguage: "Idioma de reconocimiento",
  recognitionLanguageHint:
    "Elige un idioma para mejorar el reconocimiento o deja que el dispositivo o proveedor lo detecte automáticamente.",
  automaticLanguage: "Automático",
  speechLanguageUnsupportedByProvider: ({ provider, language }) =>
    `${provider} no admite oficialmente ${language} en esta ruta de voz.`,
  usageStats: "Estadísticas de uso",
  model: "Modelo",
  effort: "Esfuerzo",
  effortValue: ({ effort }) => `Esfuerzo: ${effort}`,
  modelEffortNone: "Ninguno",
  modelEffortMinimal: "Mínimo",
  modelEffortLow: "Bajo",
  modelEffortMedium: "Medio",
  modelEffortHigh: "Alto",
  modelEffortExtraHigh: "Muy alto",
  modelEffortMax: "Máximo",
  modelEffortDynamic: "Dinámico",
  modelEffortDisabled: "Desactivado",
  modelEffortEnabled: "Activado",
  fixed: "Fijado",
  english: "Inglés",
  german: "Alemán",
  ukrainian: "ucranio",
  hindi: "hindi",
  spanish: "Español",
  french: "Francés",
  italian: "Italiano",
  portuguese: "Portugués",
  portugueseBrazil: "Portugués (Brasil)",
  russian: "Ruso",
  simplifiedChinese: "Chino simplificado",
  arabic: "Árabe",
  japanese: "Japonés",
  hungarian: "Húngaro",
  czech: "Checo",
  polish: "Polaco",
  turkish: "Turco",
  swedish: "Sueco",
  urdu: "Urdu",
  kokoroAmericanFemaleVoice: ({ name }) =>
    `${name} · inglés estadounidense, voz femenina`,
  kokoroBritishFemaleVoice: ({ name }) =>
    `${name} · inglés británico, voz femenina`,
  kokoroChineseFemaleVoice: ({ index }) => `Chino, voz femenina ${index}`,
  kokoroChineseMaleVoice: ({ index }) => `Chino, voz masculina ${index}`,
  light: "Luz",
  dark: "Oscuro",
  system: "Sistema",
  languageCoverage: ({ note }) => `Cobertura de idiomas: ${note}`,
  recordingLimits: ({ note }) => `Límites de grabación: ${note}`,
  catalogProviderPricingSummary: ({ summary }) => `Precios: ${summary}`,
  replyGenerationAction: "generación de respuesta",
  speechTranscriptionAction: "transcripción de discurso",
  speechSynthesisAction: "síntesis de voz",
  instructionsTabDescription:
    "Dé forma a la guía oculta que dirige al asistente antes de que cualquier proveedor vea la solicitud.",
  providersTabDescription:
    "Almacene las credenciales de servicios externos en el dispositivo y configure los modos de respuesta que desea utilizar.",
  webSearchTabDescription:
    "Configure el contexto web en vivo opcional antes de las respuestas.",
  responseModes: "Selección de modelo",
  aboutModelSelection: "Acerca de la selección del modelo",
  modelSelectionInfo:
    "Cada tarjeta de modelo se convierte en una opción en la pantalla de inicio. Configure su proveedor, modelo y nivel de esfuerzo opcional, luego cambie de tarjeta para elegir qué modelo responde a continuación.",
  responseModeItemTitle: ({ index }) => `Modelo ${index}`,
  addResponseMode: "Agregar modelo",
  removeResponseMode: "Quitar modelo",
  responseModesNoConfiguredProviders:
    "Primero agregue las credenciales. Los controles de ruta permanecen ocultos hasta que se configura al menos un servicio compatible.",
  useResponseMode: ({ mode }) => `Utilice ${mode}`,
  chooseResponseModel: "Elige un modelo",
  responseModelCount: ({ count }) => `${count} modelos disponibles`,
  ulraMode: "Modo supremo",
  ulraModeHomeLabel: "Mostrar el modo supremo en la pantalla de inicio",
  ulraModeSettingsDescription:
    "Permite la deliberación entre varios modelos cuando hay al menos dos modelos de inicio listos.",
  ulraModeInfo:
    "El modo supremo consulta por separado a cada modelo listo de la pantalla de inicio. En cada ronda, los modelos cuestionan la última posición de cada participante; las rondas restantes se omiten tras una convergencia unánime y explícita. El modelo seleccionado sintetiza las rondas completadas correctamente, conservando siempre la última posición de cada modelo. La deliberación se comparte con todos los proveedores implicados.",
  ulraModeRounds: "Rondas de revisión",
  ulraModeCallEstimate: ({ count }) =>
    `Hasta ${count} llamadas a modelos por mensaje con la configuración actual.`,
  ulraModeThresholdWarning:
    "Más de 4 modelos o 3 rondas pueden tardar mucho, consumir muchos tokens y alcanzar los límites de contexto o de solicitudes del proveedor. Esto es solo una advertencia.",
  ulraModeFirstUseTitle: "¿Activar el modo supremo?",
  ulraModeFirstUseMessage: ({ calls, models, rounds }) =>
    `Con ${models} modelos y hasta ${rounds} rondas de revisión, un mensaje puede realizar hasta ${calls} llamadas a modelos. Puede tardar mucho más, costar bastante más y compartir la deliberación con todos los proveedores implicados.`,
  ulraModeHighRiskTitle: "Ejecución extensa del modo supremo",
  ulraModeHighRiskMessage: ({ calls, models, rounds }) =>
    `${models} modelos y ${rounds} rondas de revisión pueden realizar hasta ${calls} llamadas a modelos. Puede tardar mucho, usar muchos tokens y alcanzar límites del proveedor. ¿Continuar de todos modos?`,
  ulraModeEnableAction: "Activar",
  ulraModeNeedsTwoModels:
    "El modo supremo necesita al menos dos modelos listos en la pantalla de inicio.",
  ulraModeAllModelsFailed:
    "Todos los modelos del modo supremo fallaron antes de poder sintetizar una respuesta.",
  ulraModePartialFailureNotice: ({ failed, succeeded }) =>
    `Fallaron ${failed} llamadas internas a modelos; la respuesta final utilizó ${succeeded} contribuciones correctas.`,
  sttTabDescription:
    "Controle cómo se captura la voz y qué backend convierte el audio en texto antes de que llegue al modelo.",
  ttsTabDescription:
    "Controle cuándo comienzan a hablar las respuestas y qué backend maneja la salida hablada.",
  brief: "Breve",
  briefDescription:
    "Mantenga la respuesta estricta. Utilice el número mínimo de oraciones necesarias para responder completamente al usuario.",
  normal: "Normal",
  normalDescription:
    "Apunte a una duración de respuesta equilibrada. Cubre los puntos importantes sin alargar la respuesta.",
  thorough: "Exhaustivo",
  thoroughDescription:
    "Profundice y sea integral. Incluya matices, detalles, compensaciones y el razonamiento que importa.",
  professional: "Profesional",
  professionalDescription:
    "Hable como un consultor senior que informa a un cliente. Lenguaje preciso, sin jerga, mesurado y autoritario.",
  casual: "Casual",
  casualDescription:
    "Habla como un amigo inteligente en una cafetería. Relajado, natural, conversacional. Las contracciones están bien, las tangentes están bien.",
  nerdy: "nerd",
  nerdyDescription:
    "Habla como un experto entusiasta al que le encanta profundizar. Utilice terminología técnica libremente, conozca los detalles y asuma que el usuario puede mantenerse al día.",
  concise: "Conciso",
  conciseDescription:
    "Sea lo más breve posible sin dejar de ser completo. Sin preámbulo, sin relleno, sólo la respuesta. Piensa en el estilo telegrama.",
  socratic: "socrático",
  socraticDescription:
    "Desafía el pensamiento del usuario. Haga contrapreguntas, ofrezca perspectivas alternativas, no se limite a confirmar lo que dijeron. Sea un compañero de entrenamiento, no una máquina de decir sí.",
  eli5: "ELI5",
  eli5Description:
    "Explica todo de la forma más sencilla posible. Utilice analogías, lenguaje cotidiano, cero jerga. No asumir ningún conocimiento previo sobre ningún tema.",
  useProvider: ({ provider }) => `Utilice ${provider}`,
  createApiKey: "Cartas credenciales",
  apiKey: "Tecla API",
  aboutThisProvider: "Acerca de este proveedor",
  openRouterOnboardingTitle: "Una clave, múltiples proveedores",
  openRouterOnboardingDescription:
    "Cree una clave OpenRouter dedicada, péguela a continuación y utilice modelos respaldados por instantáneas de varios proveedores sin reemplazar ninguna conexión directa.",
  openRouterOnboardingRoute:
    "Ruta de solicitud: este dispositivo → OpenRouter → proveedor ascendente seleccionado",
  openRouterKeys: "Teclas OpenRouter",
  providerStatusInvalid: "Inválido",
  providerStatusTesting: "Pruebas",
  providerStatusConfigured: "Configurado",
  providerStatusWorking: "Laboral",
  providerStatusNotTested: "No probado",
  providerStatusNotSetup: "No configurado",
  expandProvider: ({ provider }) => `Expandir ${provider}`,
  collapseProvider: ({ provider }) => `Contraer ${provider}`,
  testProviderKey: "clave de prueba",
  testAllCapabilities: "Probar todo",
  apiTest: "Prueba API",
  testProviderCapability: ({ capability }) => `Prueba ${capability}`,
  test: "Prueba",
  optional: "Opcional",
  providerCapability_llm: "Respuestas",
  providerCapability_stt: "Entrada de voz",
  providerCapability_tts: "Salida de voz",
  providerCapability_search: "búsqueda web",
  providerCapability_voices: "Biblioteca de voz",
  providerValidationUnavailable:
    "La validación en vivo aún no está cableada para este proveedor. Guarde la clave aquí y verifíquela durante el uso real.",
  providerNeedsAttention: "necesita atencion",
  catalogProviderLimitsSummary: ({ summary }) => `Límites: ${summary}`,
  catalogProviderRegionSummary: ({ summary }) => `Región: ${summary}`,
  validatingKey: "Validando...",
  showKey: "Mostrar clave",
  hideKey: "Ocultar clave",
  assistantInstructions: "Instrucciones del asistente",
  systemPrompt: "Aviso del sistema",
  aboutSystemPrompt: "Acerca del mensaje del sistema",
  assistantInstructionsIntro:
    "Da forma a la guía oculta que recibe el modelo antes de cada respuesta.",
  baseInstructions: "Instrucciones básicas",
  assistantInstructionsPlaceholder: "Definir cómo debe comportarse el asistente.",
  assistantInstructionsHint:
    "Esto siempre se antepone antes de la duración y el tono de la respuesta seleccionada.",
  adaptiveLength: "Longitud adaptable",
  responseTone: "Tono de respuesta",
  homeStyleChipLabel: ({ tone, length }) => `Estilo — ${tone} · ${length}`,
  styleSheetTitle: "Configuración de conversación",
  styleSheetSubtitle: "Forma respuestas y discursos solo para esta conversación.",
  openStyleSheet: "Abrir configuración de conversación",
  conversationThinkingInstructions: "Instrucciones para pensar",
  conversationThinkingInstructionsDescription:
    "Agregue instrucciones después del mensaje del sistema global para esta conversación.",
  conversationThinkingInstructionsPlaceholder:
    "Por ejemplo: desafíe mis suposiciones y utilice ejemplos concretos.",
  ttsInstructions: "Instrucciones para pronunciar el discurso",
  ttsInstructionsDescription:
    "Guíe el tono, el ritmo, el acento o la expresión utilizados por los modelos de habla compatibles.",
  conversationTtsInstructionsDescription:
    "Agregue instrucciones de entrega después de las instrucciones de voz globales para esta conversación.",
  ttsInstructionsPlaceholder:
    "Por ejemplo: hable con calidez, claridad y ritmo relajado.",
  ttsInstructionsUnsupported:
    "La ruta de voz actual no admite instrucciones de entrega.",
  conversationVoiceDescription: ({ route }) =>
    `Elige la voz utilizada por ${route} en esta conversación.`,
  scrollToLatest: "Desplácese hasta el último mensaje",
  conversationTitleGenerate: "Título generado automáticamente",
  conversationTitleGenerating: "Generando título…",
  conversationTitleGenerated: "Conversación renombrada.",
  conversationTitleNeedsContent:
    "Inicie una conversación antes de generar un título.",
  conversationTitleNeedsProvider:
    "Configure el modelo seleccionado antes de generar un título.",
  conversationTitleGenerationFailed: "No se pudo generar un título de conversación.",
  conversationTitleGenerationTimedOut:
    "La generación de títulos tomó demasiado tiempo. Por favor inténtalo de nuevo.",
  inputMode: "Modo de entrada",
  voiceInput: "Entrada de voz",
  pushToTalk: "Empuje para hablar",
  pushToTalkDescription:
    "Mantenga presionado el botón principal mientras habla, luego suéltelo para enviar.",
  toggleToTalk: "Alternar para hablar",
  toggleToTalkDescription:
    "Toque una vez para comenzar a grabar y toque nuevamente cuando haya terminado.",
  driveSession: "Sesión de conducción",
  driveSessionDescription:
    "Cuando la continuación automática está activada, la grabación comienza después de cada respuesta hablada. Toque el botón principal cuando haya terminado de hablar.",
  stopDriveSession: "Pausa automática",
  repeatDriveReply: "Repita el último",
  continueDriveSession: "Reanudar automáticamente",
  speechToText: "Voz a texto",
  appNative: "Reconocimiento del sistema",
  nativeSttDescription:
    "Utilice el reconocedor de voz del sistema operativo. Dependiendo de la configuración del dispositivo, el reconocimiento puede ejecutarse en el dispositivo o a través del servicio del sistema. No se requiere ninguna clave de proveedor.",
  provider: "Proveedor",
  webSearchProvider: "Proveedor de búsqueda web",
  webSearchProviderMissingHint:
    "Configure al menos un servicio con capacidad de búsqueda en Credenciales para habilitar la conexión a tierra web aquí.",
  webSearchModelHint: ({ model }) =>
    `Utiliza ${model} detrás de escena para la conexión a tierra web en vivo.`,
  webSearchHomeHint:
    "Utilice el interruptor de la pantalla de inicio para activar o desactivar la conexión a tierra web para este hilo.",
  settingsWebSearchCompactHint:
    "Opcionalmente, anteponga un contexto web nuevo antes de que responda el modelo principal.",
  webSearchAdvanced: "Controles de búsqueda avanzada",
  expandAdvancedSearch: "Ampliar los controles de búsqueda avanzada",
  collapseAdvancedSearch: "Contraer controles de búsqueda avanzada",
  webSearchSetupNeeded: "Agregue credenciales para utilizar la búsqueda web en vivo.",
  webSearchEnabledDescription:
    "Se agrega contexto web nuevo antes de que el modelo responda.",
  webSearchDisabledDescription:
    "Utilice el contexto web en vivo para este hilo cuando los hechos actuales sean importantes.",
  webSearchQualityControls: "Calidad de búsqueda",
  webSearchSearchMode: "Modo de búsqueda",
  webSearchSearchModeQuick: "Rápido",
  webSearchSearchModeBalanced: "Equilibrado",
  webSearchSearchModeDeep: "Profundo",
  webSearchDepth: "Profundidad de búsqueda",
  webSearchDepthStandard: "Estándar",
  webSearchDepthDeep: "Profundo",
  webSearchResultCount: "Recuento de resultados",
  webSearchQualityHint: ({ provider }) =>
    `Estos controles ajustan cómo ${provider} recopila contexto nuevo antes de la respuesta.`,
  webSearchNoExtraControls: ({ provider }) =>
    `${provider} aún no expone controles adicionales de calidad de búsqueda en esta aplicación.`,
  setWebSearchMode: ({ mode }) => `Establecer el modo de búsqueda web en ${mode}`,
  openWebSearchSettings: "Abrir la configuración de búsqueda web",
  providerSttDescription:
    "Utilice un servicio externo configurado para transcribir su voz antes de enviarla a la ruta de respuesta.",
  sttProvider: "Proveedor STT",
  sttProviderEnabledHint:
    "Aquí solo aparecen los proveedores habilitados con soporte de transcripción.",
  sttProviderMissingHint:
    "Agregue credenciales para un servicio con soporte STT para elegirlo aquí.",
  nativeSttHint:
    "El reconocimiento del sistema funciona independientemente de las claves de su proveedor y puede procesarse en el dispositivo o mediante el servicio de voz del sistema operativo.",
  replyPlayback: "Reproducción de respuesta",
  sentencesArrive: "Llegan los párrafos",
  sentencesArriveDescription:
    "Empiece a hablar tan pronto como esté listo un párrafo completo.",
  fullReplyFirst: "Respuesta completa primero",
  fullReplyFirstDescription:
    "Primero genere la respuesta completa y luego reprodúzcala de una sola vez.",
  textToSpeech: "Texto a voz",
  spokenReplies: "Respuestas habladas",
  spokenRepliesEnabledDescription:
    "Lea las respuestas del asistente en voz alta cuando haya una ruta de voz disponible.",
  spokenRepliesDisabledDescription:
    "Mantenga las respuestas solo en texto por ahora. Su ruta TTS preferida permanece guardada para más adelante.",
  nativeTtsDescription:
    "Utilice el motor de voz del dispositivo para respuestas habladas y vista previa de voz.",
  kokoroTtsDescription:
    "Utilice una voz neuronal mucho más natural en este dispositivo. El texto de respuesta hablada se sintetiza localmente, sin clave de proveedor de voz ni cargo por uso.",
  kokoroVoices: "Kokoro Voces en el dispositivo",
  kokoroVoicesHint: ({ size, installedSize }) =>
    `El modelo multilingüe descarga aproximadamente ${size} MB y ocupa aproximadamente ${installedSize} MB después de la instalación.`,
  kokoroModel: "Modelo multilingüe Kokoro",
  kokoroChecking: "Comprobando el modelo del dispositivo...",
  kokoroDownloading: ({ progress }) => `Descargando… ${progress}%`,
  kokoroExtracting: ({ progress }) => `Instalando… ${progress}%`,
  kokoroVerifying: "Verificando el motor de voz...",
  kokoroInstalled: "Instalado y listo en este dispositivo.",
  kokoroNotInstalled: "Descarga opcional. No se requiere clave de proveedor.",
  kokoroLanguageFallback:
    "Actualmente, Kokoro habla inglés y chino simplificado aquí. Para otros idiomas de respuesta seleccionados, agregue una ruta alternativa explícita o la voz se detendrá con un error.",
  kokoroRemoveTitle: "¿Quitar el modelo Kokoro?",
  kokoroRemoveBody: ({ installedSize }) =>
    `Esto libera aproximadamente ${installedSize} MB. Puedes descargar el modelo nuevamente en cualquier momento.`,
  removeKokoroModel: "Retire el modelo Kokoro",
  downloadKokoroModel: "Descargue el modelo Kokoro",
  kokoroFallbackNeeded: ({ languages }) =>
    `Se requiere una ruta alternativa explícita para: ${languages}.`,
  kokoroNoSelectedLanguages:
    "Seleccione inglés o chino simplificado en Idiomas para escuchar para configurar una voz Kokoro.",
  expandVoiceSettings: ({ language }) => `Expandir ${language} configuración de voz`,
  collapseVoiceSettings: ({ language }) =>
    `Contraer ${language} configuración de voz`,
  remove: "Eliminar",
  voiceOutputDescription:
    "Elija el motor de voz, los idiomas de escucha y las vistas previas de voz para las respuestas habladas.",
  localTts: "Local",
  localTtsDescription:
    "Utilice una voz local descargada coincidente para respuestas habladas.",
  providerTtsDescription:
    "Utilice el servicio configurado seleccionado para respuestas habladas.",
  ttsFallbackRoutes: "Rutas alternativas",
  ttsFallbackRoutesHint:
    "Opcional. Agregue solo las rutas que desee, en el orden en que deben probarse. Una vez que una ruta comienza a hablar, Sr. Brócoli permanece en ella durante el resto de la respuesta.",
  ttsFallbackNone:
    "No se configura ningún respaldo. En su lugar, se mostrará un error de voz.",
  ttsFallbackPosition: ({ position, route }) => `${position}. ${route}`,
  addFallbackRoute: ({ route }) => `Agregar respaldo ${route}`,
  removeFallbackRoute: ({ route }) => `Eliminar el respaldo ${route}`,
  moveFallbackEarlier: ({ route }) => `Mover ${route} antes`,
  moveFallbackLater: ({ route }) => `Mover ${route} más tarde`,
  ttsProvider: "Proveedor TTS",
  ttsProviderEnabledHint:
    "Aquí solo aparecen los proveedores habilitados con soporte de respuesta hablada.",
  ttsProviderMissingHint:
    "Agregue credenciales para un servicio con soporte TTS para elegirlo aquí.",
  localTtsOrderHint:
    "Sólo se intentan rutas de reserva configuradas explícitamente.",
  providerTtsOrderHint:
    "Sólo se intentan rutas de reserva configuradas explícitamente.",
  nativeTtsHint:
    "El TTS nativo utiliza la pila de voz del sistema y no requiere una clave de proveedor.",
  localTtsLanguageCoverageHint:
    "Actualmente, los paquetes locales cubren inglés, alemán, chino simplificado, español, portugués, hindi, francés e italiano.",
  ttsVoice: "TTS Voz",
  refresh: "Refrescar",
  providerVoiceDirectory: ({ provider }) => `${provider} biblioteca de voz`,
  refreshProviderVoices: ({ provider }) => `Actualizar ${provider} voces`,
  providerVoicesAvailable: ({ count, provider }) =>
    `${count} ${Number(count) === 1 ? "voz" : "voces"} disponible a partir de ${provider}.`,
  providerVoicesLoadFailed:
    "No se pudieron actualizar las voces. Su selección actual no ha cambiado; aún puedes ingresar una ID de voz manualmente.",
  providerVoicesLoadFailedWithFallback:
    "No se pudieron cargar las voces de la cuenta. La voz incorporada permanece disponible.",
  providerVoicesErrorDetail: ({ detail }) => `Motivo: ${detail}`,
  elevenLabsVoicesReadPermissionHint:
    "En ElevenLabs, edite esta clave API y habilite Voces → Leer, luego actualice aquí.",
  providerVoicesLoadingHint: ({ provider }) =>
    `Sr. Brócoli carga las voces disponibles automáticamente desde ${provider}.`,
  providerVoiceId: "Identificación de voz",
  providerVoiceIdPlaceholder: "Ingrese una identificación de voz",
  providerVoiceIdFallbackHint:
    "La entrada manual permanece disponible cuando no se puede cargar la biblioteca de voz.",
  providerVoiceIdRequired: ({ provider }) =>
    `Actualice la biblioteca de voz ${provider} o ingrese una ID de voz antes de usar la salida de voz.`,
  qwenSpeechUnavailableInUs:
    "Las rutas de voz actuales Sr. Brócoli de Qwen no están disponibles en la región de EE. UU. Elija Singapur o Beijing para el discurso Qwen.",
  qwenApiRegion: "Qwen API Región",
  qwenRegionSingapore: "Singapur",
  qwenRegionUs: "Estados Unidos (Virginia)",
  qwenRegionBeijing: "China (Pekín)",
  qwenRegionHint:
    "La región seleccionada debe coincidir con la región en la que se creó esta clave API.",
  qwenRegionUsSpeechHint:
    "Las claves de la región de EE. UU. admiten chat y búsqueda web aquí. Las rutas actuales Sr. Brócoli Qwen STT y TTS requieren una clave de Singapur o Beijing.",
  providerDefaultVoiceHint:
    "Actualmente, este proveedor utiliza su voz predeterminada para obtener vistas previas y respuestas habladas.",
  listenLanguages: "Escuchar Idiomas",
  listenLanguagesHint:
    "Elija los idiomas de respuesta que desee que suenen bien. Sr. Brócoli los prueba en este orden al enrutar la salida de voz.",
  listenLanguagesSelected: ({ count }) =>
    count === 1 ? "1 idioma seleccionado" : `${count} idiomas seleccionados`,
  localVoicePacks: "Paquetes de voz locales",
  localVoicePacksHint:
    "Cada idioma mantiene su propia voz local. Elija la voz que desee para ese idioma y luego descargue solo los paquetes que realmente le interesen.",
  localVoiceForLanguage: ({ languageLabel }) => `Voz para ${languageLabel}`,
  providerVoicePreviews: "Vistas previas de voz del proveedor",
  providerVoicePreviewsHint:
    "Pruebe aquí la ruta TTS actualmente seleccionada con un texto de vista previa independiente para cada idioma de respuesta.",
  nativeVoicePreviewSection: "Vista previa de voz nativa",
  nativeVoicePreviewSectionHint:
    "Este habla directamente a través del sintetizador de voz incorporado en el teléfono para que pueda compararlo con las voces configuradas del proveedor.",
  nativeVoiceUnavailable:
    "Este dispositivo no informó ninguna voz nativa del sistema para la vista previa.",
  runtimeCompatibilityOverrides: "Compatibilidad en ejecución",
  runtimeCompatibilityOverridesDescription: ({ count }) =>
    `${count} configuraciones de modelo o ajuste que el proveedor confirmó como no disponibles están desactivadas solo en este dispositivo. Sr. Brócoli las evita automáticamente.`,
  clearRuntimeCompatibilityOverrides: "Borrar compatibilidad en ejecución",
  clearRuntimeCompatibilityOverridesConfirmationTitle:
    "¿Borrar la compatibilidad en ejecución?",
  clearRuntimeCompatibilityOverridesConfirmationMessage:
    "Las configuraciones desactivadas anteriormente podrán volver a probarse. El proveedor puede rechazarlas de nuevo.",
  speechDiagnostics: "Actividad de habla reciente",
  speechDiagnosticsHint:
    "Muestra las últimas solicitudes de voz, la ruta que solicitaron, la ruta que realmente utilizaron y cualquier motivo alternativo.",
  clearSpeechDiagnostics: "Borrar actividad de habla reciente",
  speechDiagnosticsEmpty:
    "Aún no hay solicitudes de discurso recientes. Obtenga una vista previa de una voz o reproduzca una respuesta para ver los detalles de la ruta aquí.",
  clearSpeechDiagnosticsConfirmationTitle: "¿Borrar actividad del habla reciente?",
  clearSpeechDiagnosticsConfirmationMessage:
    "Esto elimina todos los diagnósticos de enrutamiento de voz capturados. Esta acción no se puede deshacer.",
  speechDiagnosticSourceConversation: "Respuesta de conversación",
  speechDiagnosticSourceRepeat: "repetir respuesta",
  speechDiagnosticSourcePreview: "Vista previa de voz",
  speechDiagnosticSourceUnknown: "Solicitud de voz",
  speechDiagnosticRouteLine: ({ requested, actual }) =>
    `Solicitado: ${requested} -> Real: ${actual}`,
  speechDiagnosticStageLine: ({ stage }) => `Última etapa: ${stage}`,
  speechDiagnosticLanguageLine: ({ languageLabel }) =>
    `Idioma: ${languageLabel}`,
  speechDiagnosticProviderLine: ({ provider }) => `Proveedor: ${provider}`,
  speechDiagnosticVoiceLine: ({ voice }) => `Voz: ${voice}`,
  localTtsPackReady: "Instalado en este dispositivo.",
  localTtsPackBroken:
    "Descargado, pero esta voz falló en la verificación local en este dispositivo. Vuelve a descargarlo o elige otra voz.",
  localTtsPackMissing:
    "Aún no instalado. Se utilizará Cloud TTS o la voz del sistema hasta que lo descargue.",
  localTtsUnsupportedLanguageFallback:
    "Aún no hay un paquete local disponible para este idioma. Cloud TTS o la voz del sistema se encargarán de ello.",
  downloadingLocalTtsPack: ({ progress }) =>
    `Descargando paquete local... ${progress}%`,
  download: "Descargar",
  downloadingShort: "Cargando...",
  voicePreviewText: "Texto de vista previa de voz",
  voicePreviewPlaceholder: "Escribe una frase para escuchar esta voz.",
  voicePreviewHint:
    "Utiliza el backend de voz de respuesta seleccionado actualmente sin enviar nada al modelo de idioma.",
  previewVoice: "Vista previa de voz",
  generatingPreview: "Generando vista previa...",
  playingPreview: "Reproduciendo vista previa...",
  systemVoice: "voz del sistema",
  spokenRepliesOff: "Sólo texto",
  noTtsProvider: "Ningún proveedor TTS",
  nothingToCopyYet: "Nada que copiar todavía.",
  couldntCopyText: "No se pudo copiar ese texto.",
  nothingToShareYet: "Nada que compartir todavía.",
  couldntShareText: "No se pudo compartir ese texto.",
  couldntReplayReply: "No se pudo reproducir esa respuesta.",
  replyFailed: "Respuesta fallida",
  retryReply: "Reintentar respuesta",
  replyFailedHint: "Puedes elegir otro modelo arriba antes de volver a intentarlo.",
  spokenReplyFailed: "La respuesta se guardó, pero no se pudo pronunciar.",
  retrySpeech: "Reintentar discurso",
  openSpeakingSettings: "Configuraciones de habla",
  messageCopied: "Mensaje copiado.",
  noConversationToCopyYet: "Aún no hay ninguna conversación para copiar.",
  noConversationToShareYet: "Aún no hay ninguna conversación para compartir.",
  noReplyToRepeatYet: "Aún no hay respuesta a la repetición.",
  threadCopied: "Hilo copiado.",
  threadRenamed: "Hilo renombrado.",
  threadPinned: "Hilo fijado.",
  threadUnpinned: "Hilo desatado.",
  addProviderKeyToUseProvider: ({ provider }) =>
    `Agregue credenciales para ${provider} en Configuración antes de usar esta ruta.`,
  configureCredentialsBeforeVoiceSession:
    "Agregue credenciales en Configuración antes de iniciar una sesión de voz.",
  endpointCredentialFormatInvalid: ({ provider }) =>
    `Para ${provider}, ingrese la URL base del proveedor y la clave API como https://your-endpoint.example.com|your-api-key.`,
  speechRecognitionUnavailableOnDevice:
    "El reconocimiento de voz no está disponible en este dispositivo.",
  debugLogLabel: "REGISTRO",
  debugLogCaptureStarted: "Se inició el registro de depuración.",
  debugLogCaptureStopped: ({ entryCount, fileName }) =>
    `Registro de depuración guardado como ${fileName} y copiado en el portapapeles (entradas ${entryCount}).`,
  debugLogCaptureStoppedNoClipboard: ({ entryCount, fileName }) =>
    `Registro de depuración guardado como ${fileName} (entradas ${entryCount}).`,
  debugLogCaptureRecovered: ({ entryCount, fileName }) =>
    `Se recuperó el registro de depuración anterior ${fileName} y lo copió en el portapapeles (entradas ${entryCount}).`,
  debugLogCaptureRecoveredNoClipboard: ({ entryCount, fileName }) =>
    `Se recuperó el registro de depuración anterior ${fileName} (entradas ${entryCount}).`,
  debugLogCaptureFailed: "No se pudo guardar el registro de depuración.",
  chooseSttBeforeVoiceSession:
    "Elija una ruta STT configurada en Configuración antes de iniciar una sesión de voz.",
  chooseTtsBeforeSpokenReplies:
    "Elija una ruta TTS configurada en Configuración antes de usar respuestas habladas.",
  stopSessionBeforeReplay:
    "Detenga la sesión de voz activa antes de reproducir la última respuesta.",
  couldntCatchThatTryAgain: "No pude captar eso, inténtalo de nuevo.",
  couldntStartVoiceInput: "No se pudo iniciar la entrada de voz.",
  couldntProcessVoiceInput: "No se pudo procesar la entrada de voz.",
  maxRecordingLengthReached:
    "Se alcanzó la duración máxima de grabación: envío lo que tengo.",
  sttRecordingTooLarge: ({ provider, limit }) =>
    `Esa grabación es demasiado larga para ${provider} conversión de voz a texto (máx. ${limit}). Pruebe con un mensaje más corto o cambie de voz a texto a reconocimiento del sistema.`,
  addProviderKeyToEnableProvider: ({ provider }) =>
    `Agregue credenciales para ${provider} en Configuración antes de usar esta ruta.`,
  stopSessionBeforePreview:
    "Detenga la sesión de voz activa antes de obtener una vista previa de una voz.",
  chooseTtsToPreviewVoices:
    "Elija una ruta TTS configurada en Configuración para obtener una vista previa de las voces.",
  downloadSelectedLocalVoiceFirst: ({ languageLabel }) =>
    `Descargue primero la ${languageLabel} voz local seleccionada.`,
  couldntPreviewVoice: "No se pudo obtener una vista previa de la voz.",
  spokenRepliesDisabled: "Las respuestas habladas están desactivadas en Configuración.",
  providerVoiceFallback:
    "Error en la ruta de voz configurada. Se cambió esta respuesta a una voz alternativa.",
  localVoiceFallback:
    "La voz local no estaba disponible. Se cambió esta respuesta a una voz alternativa.",
  localTtsPackInstalled: ({ languageLabel }) =>
    `${languageLabel} paquete de voz local instalado.`,
  localTtsPackInstallFailed: "No se pudo instalar el paquete de voz local.",
  clear: "Claro",
  voiceOutput: "Salida de voz",
  speechReplayCache: "Caché de reproducción de voz",
  speechReplayCacheDescription:
    "La voz generada por el proveedor se guarda en este dispositivo hasta 14 días, por lo que repetir una respuesta no vuelve a gastar créditos de voz.",
  clearSpeechReplayCache: "Borrar caché de voz",
  speechReplayCacheCleared: "Se eliminaron los archivos de voz guardados.",
  speechReplayCacheClearFailed: "No se pudo borrar la caché de voz.",
  currentSetup: "Configuración actual",
  listeningToYourVoice: "Escuchando tu voz",
  parsingYourVoiceInput: "Convirtiendo tu voz en texto",
  preparingRequest: "Preparando tu solicitud",
  searchingTheWeb: "Buscando en la web un nuevo contexto",
  waitingForProvider: ({ provider }) => `Esperando ${provider}`,
  preparingVoiceWithProvider: ({ provider }) =>
    `Preparando voz con ${provider}`,
  deepThinkingReassurance: "Las buenas respuestas toman un momento...",
  thinkingElapsed: ({ detail, seconds }) => `${detail} · ${seconds}s`,
  speakingBackToYou: "hablándote de nuevo",
  freshSession: "nueva sesión",
  messageCount: ({ count }) =>
    Number(count) === 1 ? "1 mensaje" : `${count} mensajes`,
  speechInputRoute: ({ route }) => `Discurso en: ${route}`,
  replyModelRoute: ({ route }) => `Modelo de respuesta: ${route}`,
  voiceOutputRoute: ({ route }) => `Voz en voz alta: ${route}`,
  fallbackVoiceOutputRoute: ({ route }) => `Voz alternativa: ${route}`,
  conversation: "Conversación",
  conversationActions: "Acciones de conversación",
  statusDetails: "Detalles de estado",
  persistenceFailure:
    "Sr. Brócoli no pudo guardar datos en este dispositivo. Mantén la aplicación abierta y vuelve a intentarlo; Los cambios recientes pueden perderse después del reinicio.",
  show: "Espectáculo",
  showTranscript: "Mostrar transcripción",
  hide: "Esconder",
  copyThread: "Copiar hilo",
  shareThread: "Compartir hilo",
  repeatReply: "Repetir respuesta",
  renameThread: "Cambiar nombre del hilo",
  renameThreadHint:
    "Dale a esta conversación un título que puedas encontrar rápidamente más adelante.",
  threadTitle: "Título del hilo",
  noTranscriptYet: "Aún no hay transcripción",
  previewTranscriptEmptyDescription:
    "Utilice voz o texto para comenzar. Tu conversación aparecerá aquí.",
  noConversationYet: "Aún no hay conversación",
  expandedTranscriptEmptyDescription:
    "Utilice voz o texto para comenzar. Cierra esta pantalla cuando quieras volver al escenario principal.",
  transcriptSelectionHint:
    "Seleccione cualquier texto de mensaje directamente o comparta y copie mensajes individuales a continuación.",
  textMessagePlaceholder: "Escribe un mensaje",
  sendTextMessage: "enviar mensaje",
  showVoiceInput: "Mostrar entrada de voz",
  showTextInput: "Mostrar entrada de texto",
  usageStatsHiddenDescription: "Mantenga las estimaciones de tokens fuera de la transcripción UI.",
  usageStatsVisibleDescription:
    "Muestra el uso estimado de tokens para respuestas y totales de conversaciones.",
  debugLogButton: "Botón de registro de depuración",
  debugLogButtonHiddenDescription:
    "Mantenga oculto el botón LOG de la pantalla de inicio a menos que ya se esté ejecutando una captura.",
  debugLogButtonVisibleDescription:
    "Muestre el botón LOG de la pantalla de inicio para iniciar y detener capturas de depuración.",
  debugLogButtonUsageDescription:
    "Cómo utilizar el botón: al activarlo se comenzará a capturar registros. Al desactivarlo, se detendrá la captura de registros y se moverán los capturados al portapapeles.",
  estimatedUsageTitle: "Uso estimado",
  estimatedUsageCounts: ({ replies, summaries }) =>
    `${replies} responde · ${summaries} actualizaciones de memoria`,
  estimatedUsageConversationScope:
    "Los totales incluyen todas las rutas y modelos utilizados en esta conversación.",
  estimatedPromptTokens: ({ count }) => `Mensaje: ${count}`,
  estimatedReplyTokens: ({ count }) => `Respuesta: ${count}`,
  estimatedTotalTokens: ({ count }) => `Total: ${count}`,
  estimatedUsageInline: ({ prompt, completion, total }) =>
    `Est. ${prompt} entrada · ${completion} salida · ${total} total`,
  searchQuery: "Consulta de búsqueda",
  expandWebSearchDetails: "Mostrar detalles de búsqueda web",
  collapseWebSearchDetails: "Ocultar detalles de búsqueda web",
  webSearchSourceCount: ({ count }) =>
    `${count} ${Number(count) === 1 ? "fuente" : "fuentes"}`,
  sources: "Fuentes",
  openSourceLink: ({ source }) => `Código abierto: ${source}`,
  turnReceipt: "Detalles del giro",
  expandTurnReceipt: "Mostrar detalles del turno",
  collapseTurnReceipt: "Ocultar detalles del giro",
  turnReceiptDirect: "Directo",
  turnReceiptRequested: "Ruta de respuesta solicitada",
  turnReceiptActual: "Ruta de respuesta real",
  turnReceiptEffort: "control de razonamiento",
  turnReceiptProviderNative: "nativo del proveedor",
  turnReceiptInput: "Ruta de entrada",
  turnReceiptSearch: "búsqueda web",
  turnReceiptVoice: "Salida de voz",
  turnReceiptContext: "Contexto",
  turnReceiptTiming: "Momento",
  turnReceiptFallback: "Razón alternativa",
  turnReceiptVoiceInput: "Voz",
  turnReceiptTypedInput: "mecanografiado",
  turnReceiptSystemSpeech: "Sistema de reconocimiento de voz",
  turnReceiptSystemVoice: "voz del sistema",
  turnReceiptSystemVoiceFallback: "Voz del sistema · respaldo",
  turnReceiptOff: "Apagado",
  turnReceiptNotConfigured: "Encendido · no configurado",
  turnReceiptFallbackWithoutSearch: "Continuado sin búsqueda en vivo",
  turnReceiptNotUsed: "No usado",
  turnReceiptSummaryReused: "resumen guardado reutilizado",
  turnReceiptSummaryUpdated: "resumen actualizado",
  turnReceiptContextFallback: "respaldo de mensajes recientes",
  turnReceiptGatewayCompression: ({ original, compressed }) =>
    `puerta de enlace comprimió ${original} a ${compressed} mensajes`,
  turnReceiptContextValue: ({ sent, total, summarized, state }) =>
    `${sent}/${total} mensajes anteriores enviados · ${summarized} recién resumidos${state}`,
  turnReceiptTimingStt: "STT",
  turnReceiptTimingContext: "contexto",
  turnReceiptTimingSearch: "buscar",
  turnReceiptTimingModel: "modelo",
  turnReceiptTimingFirstSpeech: "primer discurso",
  turnReceiptTimingTotal: "total",
  estimatedRouteUsageTokensOnly: ({ tokens }) => `${tokens} tokens`,
  unknownUsageRoute: "Ruta desconocida",
  setupGuideConnectProviderTitle: "Configurar credenciales",
  setupGuideConnectProviderDescription:
    "Agregue credenciales en Configuración, luego elija las rutas que desea usar.",
  idle: "Inactivo",
  yourConversationAppearsHere: "Tu conversación aparece aquí.",
  defaultTranscriptEmptyDescription:
    "Utilice voz o texto para comenzar. Sr. Brócoli mantendrá el hilo y responderá aquí.",
  delete: "Borrar",
  deleteConversationConfirmationTitle: ({ title }) => `¿Eliminar “${title}”?`,
  deleteConversationConfirmationMessage:
    "Esto elimina permanentemente la conversación y todos sus mensajes. Esta acción no se puede deshacer.",
  memory: "Memoria",
  conversations: "Conversaciones",
  drawerSubtitle: "Salta entre hilos activos o comienza una nueva sala.",
  newSession: "Nueva sesión",
  noSavedConversationsYet: "Aún no hay conversaciones guardadas",
  drawerEmptyDescription:
    "Comience a hablar desde la vista principal y Sr. Brócoli creará una sesión automáticamente.",
  setupGuideTitle: "Configurar la aplicación",
  setupGuideSubtitle: "Agregue credenciales y elija rutas en Configuración.",
  fastestStartPreset: "Configuración mínima",
  fastestStartDescription:
    "Utilice la voz del dispositivo cuando esté disponible y configure solo la ruta de respuesta que necesite.",
  fullVoicePreset: "Voz configurada",
  fullVoiceDescription:
    "Utilice servicios configurados para respuestas, transcripción y salida hablada cuando los elija.",
  setupGuideNote:
    "A continuación abriremos Configuración para que pueda pegar y validar las credenciales.",
  useThisSetup: "Utilice esta configuración",
  notNow: "Ahora no",
  setupGuideIntroTitle: "Cómo funciona Sr. Brócoli",
  setupGuideIntroBody:
    "Sr. Brócoli comienza en blanco. Agregue credenciales para los servicios externos que ya utiliza y luego elija cómo se enrutan las respuestas, la entrada de voz, la salida hablada y el contexto web opcional.",
  setupGuideIntroNote:
    "Después de la configuración, use el control de voz principal para iniciar y detener una conversación. La transcripción actual permanece disponible en la pantalla de inicio y cada ruta se puede cambiar más tarde en Configuración.",
  setupGuideProviderTitle: "Agregar credenciales",
  setupGuideProviderBody:
    "Elija el servicio externo que desea configurar y luego pegue las credenciales con acceso de respuesta.",
  setupGuideProviderPickerLabel: "Servicio de respuesta",
  setupGuideSelectProvider: "Seleccione un proveedor",
  setupGuideSelectProviderFirst: "Seleccione un proveedor primero.",
  setupGuideApiKeyLabel: "Tecla API",
  setupGuideApiKeyPlaceholder: "Pegar credenciales",
  setupGuideContinue: "Continuar",
  setupGuideOpenSettings: "Abrir configuración",
  setupGuideBack: "Atrás",
  setupGuideValidateKey: "Validar clave",
  setupGuideApiKeyRequiredOrCancel:
    "Agregue una clave API para continuar o cancele la guía de configuración.",
  setupGuideProviderAndApiKeyRequiredOrCancel:
    "Elija un proveedor y agregue una clave API para continuar o cancelar la guía de configuración.",
  setupGuideProviderKeyNeedsLlmAccess: ({ provider }) =>
    `Estas credenciales ${provider} no permiten solicitudes de respuesta.`,
  setupGuideKokoroTitle: "Agregue una voz natural en el dispositivo",
  setupGuideKokoroBody: ({ size }) =>
    `Opcional: descargue Kokoro (aproximadamente ${size} MB) para obtener respuestas habladas mucho más naturales sin un proveedor de voz ni cargos por uso.`,
  setupGuideKokoroLanguageNote:
    "Este modelo actualmente habla inglés y chino simplificado. Configure las rutas alternativas que desee más adelante en la configuración de conversación.",
  setupGuideKokoroDownload: "Descargar Kokoro",
  setupGuideUseKokoro: "Utilice Kokoro para respuestas habladas",
  setupGuideUseKokoroSummary:
    "Mantenga la síntesis en el teléfono siempre que se admita el idioma de respuesta.",
  setupGuideSkipKokoro: "Saltar por ahora",
  setupGuideVoiceTestTitle: "Pruebe su configuración",
  setupGuideVoiceTestBody:
    "Di una frase corta. Sr. Brócoli probará el acceso al micrófono, la transcripción, la ruta de respuesta configurada y la salida hablada cuando esté disponible una ruta de voz aceptable.",
  setupGuideVoiceTestNoInputBody:
    "La entrada de voz no está disponible con esta configuración. Continúe revisando las rutas detectadas y luego ajuste la configuración de voz si es necesario.",
  setupGuideVoiceTestTextOnlyNote:
    "Esta prueba es de solo texto porque aún no hay ninguna ruta de voz hablada aceptable lista.",
  setupGuideVoiceTestStart: "Iniciar prueba",
  setupGuideVoiceTestStop: "dejar de grabar",
  setupGuideVoiceTestRetry: "Corre de nuevo",
  setupGuideVoiceTestTranscribing: "Transcribiendo…",
  setupGuideVoiceTestThinking: "Respuesta de prueba...",
  setupGuideVoiceTestSynthesizing: "Preparando voz...",
  setupGuideVoiceTestSpeaking: "Reproduciendo respuesta…",
  setupGuideVoiceTestTranscript: "Transcripción",
  setupGuideVoiceTestReply: "Responder",
  setupGuideVoiceTestReset: "Borrar este resultado",
  setupGuideVoiceInputUnavailable:
    "La entrada de voz no está disponible para esta configuración en este dispositivo.",
  setupGuideSummaryTitle: "Configuración completa",
  setupGuideSummaryBody:
    "Aquí está la ruta que utilizará Sr. Brócoli con su configuración actual.",
  setupGuideSummaryLlm: "LLM",
  setupGuideSummaryStt: "Discurso a texto",
  setupGuideSummaryTts: "Texto a voz",
  setupGuideSummaryWebSearch: "búsqueda web",
  setupGuideRouteProviderLlm: ({ provider }) => `Habilitado a través de ${provider}`,
  setupGuideRouteOnDeviceStt: "Habilitado a través del reconocimiento de voz del sistema.",
  setupGuideRouteProviderStt: ({ provider }) =>
    `Habilitado a través de ${provider} transcripción de voz`,
  setupGuideRouteProviderTts: ({ provider }) => `Habilitado a través de la voz ${provider}`,
  setupGuideRouteKokoroTts: "Habilitado a través de la voz Kokoro en el dispositivo",
  setupGuideRouteLocalTts: "Habilitado a través del paquete de voz local",
  setupGuideRouteUnavailable: "No disponible",
  setupGuideRouteOff: "Apagado",
  setupGuideWebSearchAvailableOff: ({ provider }) =>
    `Disponible a través de ${provider}, actualmente desactivado`,
  setupGuideSummaryTextOnlyNote:
    "Las respuestas habladas están desactivadas por ahora. Las respuestas permanecen en texto hasta que habilites un proveedor o voz local.",
  setupGuideFinish: "Hecho",
  searchConversationsPlaceholder: "Buscar títulos, modelos y texto de mensajes",
  noMatchingConversations: "No hay conversaciones coincidentes",
  noMatchingConversationsDescription:
    "Pruebe con un título, ruta, modelo o frase diferente de la transcripción.",
  memoryModalTitle: "Memoria de conversación",
  memoryModalDescription:
    "Este es el resumen compacto que Sr. Brócoli lleva adelante una vez que un hilo se vuelve lo suficientemente largo como para comprimir giros más antiguos.",
  memorySummary: "Resumen guardado",
  memorySummaryEmpty:
    "Aún no hay memoria compacta. Una vez que este hilo se alargue, los giros más antiguos se resumirán aquí.",
  summarizedTurnsCount: ({ count }) =>
    Number(count) === 1 ? "1 turno resumido" : `${count} giros resumidos`,
  copyMemory: "Copiar memoria",
  forgetMemory: "olvidar la memoria",
  memoryCopied: "Memoria copiada.",
  memoryCleared: "Se borró la memoria de la conversación.",
  noConversationToManageYet: "Aún no hay memoria de conversación disponible.",
  noProviderYet: "Ningún proveedor todavía",
  noModelYet: "Aún no hay modelo",
  startedAt: "Comenzó",
  endedAt: "Terminado",
  pinned: "Fijado",
  copy: "Copiar",
  share: "Compartir",
  rename: "Rebautizar",
  pin: "Alfiler",
  unpin: "Desprender",
  save: "Ahorrar",
  cancel: "Cancelar",
  stop: "Detener",
  pause: "Pausa",
  resume: "Reanudar",
  paused: "En pausa",
  listening: "Escuchando",
  parsing: "Transcribiendo",
  searching: "Búsqueda",
  converting: "Mudado",
  webSearchAction: "búsqueda web",
  thinking: "Pensamiento",
  speaking: "Discurso",
  pleaseWait: "Espere por favor",
  yourTurn: "tu turno",
  keepPressing: "Sigue presionando",
  tapWhenDone: "Toca cuando hayas terminado",
  speechPaused: "El discurso está en pausa.",
  pausePlaybackUnavailable:
    "Esta ruta de voz no se puede pausar. Deténgalo o cambie a la salida de voz del proveedor.",
  holdToSpeak: "Mantenga para hablar",
  tapToSpeak: "Toca para hablar",
  tapAgainToSend: "Toca de nuevo para enviar",
  waitingForReply: "Esperando respuesta",
  parsingYourVoice: "Analizando tu voz",
  providerConfiguredInSettings: ({ provider }) =>
    `${provider} no está configurado en Configuración.`,
  providerNetworkError: ({ provider, action }) =>
    `No se pudo comunicar con ${provider} para ${action}. Verifique la conexión y vuelva a intentarlo.`,
  providerAuthError: ({ provider, action }) =>
    `${provider} rechazó las credenciales de ${action}. Verifique la clave y los permisos API.`,
  providerRateLimitError: ({ provider, action }) =>
    `${provider} está limitando la tasa ${action} en este momento. Inténtalo de nuevo en un momento.`,
  providerCreditsRequired: ({ provider, action }) =>
    `${provider} necesita suficiente crédito API para ${action}. Consulta el saldo de la cuenta y el límite de gasto de la llave.`,
  providerTimeoutError: ({ provider, action }) =>
    `${provider} tardó demasiado durante ${action}. Intentar otra vez.`,
  providerTemporaryError: ({ provider, action }) =>
    `${provider} tuvo un problema temporal durante ${action}. Vuelve a intentarlo en breve.`,
  providerEmptyReplyError: ({ provider }) =>
    `${provider} finalizó sin devolver respuesta. Intentar otra vez.`,
  providerIncompleteReplyError: ({ provider }) =>
    `La respuesta de ${provider} finalizó antes de completarse. Intentar otra vez.`,
  providerContextTooLong: ({ provider }) =>
    `${provider} rechazó la respuesta porque la conversación se hizo demasiado larga. Inicie un hilo nuevo o acorte la solicitud.`,
  providerRequestRejected: ({ provider, action, detail }) =>
    detail
      ? `${provider} rechazó la solicitud ${action}: ${detail}`
      : `${provider} rechazó la solicitud ${action}.`,
  providerWebSearchNotRun: ({ provider }) =>
    `${provider} devolvió una respuesta sin ejecutar la búsqueda web.`,
  providerValidationSuccess: ({ provider }) => `${provider} está listo para usar.`,
  providerCapabilityValidationSuccess: ({ provider, capability }) =>
    `${provider} ${capability} está funcionando.`,
  providerValidationFailed: "La validación del proveedor falló.",
  webSearchFallback:
    "La búsqueda web no estaba disponible, por lo que la respuesta continuó sin contexto web activo.",
  noBase64EncoderAvailable: "No hay codificador base64 disponible.",
  noBase64DecoderAvailable: "No hay decodificador base64 disponible.",
  azureSpeechApiKeyFormat:
    "Microsoft Azure TTS necesita credenciales de Azure Speech en el formato <key>|<region>, por ejemplo abc123|westeurope, o el formato combinado de Azure <endpoint>|<api-key>|<key>|<region>.",
  nativeTtsDoesNotSynthesizeAudioFiles:
    "Native TTS no sintetiza archivos de audio.",
  localTtsUnavailableForLanguage: ({ languageLabel }) =>
    `No hay ninguna ruta de voz local o en la nube lista para ${languageLabel}.`,
  chooseTextToSpeechProviderInSettings:
    "Elija un proveedor de texto a voz en Configuración.",
  ttsNotSupportedYet: ({ provider }) => `${provider} TTS aún no es compatible.`,
  ttsError: ({ provider, status, errorText }) =>
    `${provider} Error TTS (${status}): ${errorText}`,
  ttsReplyTooLong: ({ provider }) =>
    `${provider} la salida de voz rechazó la respuesta porque era demasiado larga.`,
  ttsTimeout: ({ provider }) => `${provider} la salida de voz tardó demasiado.`,
  sttTimeout: ({ provider }) =>
    `${provider} la transcripción del discurso tomó demasiado tiempo.`,
  sttFileSizeLimitExceeded: ({ provider, model, limit }) =>
    `${provider} ${model} solo acepta grabaciones hasta ${limit}. Utilice un clip más corto o cambie los modelos STT.`,
  voiceInputCaptureIncomplete:
    "La entrada de voz no se pudo capturar limpiamente. Por favor inténtalo de nuevo.",
  ttsDidNotReturnAudio: ({ provider }) =>
    `${provider} TTS no devolvió audio.`,
  nativeSttHandledInApp: "El sistema STT se maneja directamente en la aplicación.",
  chooseSpeechToTextProviderInSettings:
    "Elija un proveedor de voz a texto en Configuración.",
  sttNotSupportedYet: ({ provider }) => `${provider} STT aún no es compatible.`,
  providerNotWiredUpYet: ({ provider }) => `${provider} aún no está conectado.`,
  you: "Tú",
  assistant: "Asistente",
  untitledConversation: "Conversación sin título",
  conversationExportHeader: ({ title }) => `Conversación: ${title}`,
  speechRecognitionPermissionNotGranted:
    "Permiso de reconocimiento de voz no concedido.",
  speechRecognitionUnavailableForDeviceLanguage:
    "El reconocimiento de voz no está disponible para el idioma actual del dispositivo.",
  nativeSpeechRecognitionNeedsNetwork:
    "El reconocimiento de voz nativo necesita acceso a la red ahora mismo.",
  noSpeechDetected: "No se detectó ninguna voz.",
  nativeSpeechRecognitionFailed: "Falló el reconocimiento de voz nativa.",
  couldntStartNativeSpeechRecognition:
    "No se pudo iniciar el reconocimiento de voz nativo.",
  microphonePermissionNotGranted: "Permiso de micrófono no concedido",
} satisfies TranslationDictionary;
