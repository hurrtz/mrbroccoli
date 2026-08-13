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

export const es = {
  ...conversationArtifactTranslations.es,
  ...interruptionTranslations.es,
  ...ulraAuditTranslations.es,
  ...dataBackupTranslations.es,
  ...conversationKnowledgeTranslations.es,
  ...conversationIntegrityTranslations.es,
  ...imagePromptTranslations.es,
  ...memoryEditTranslations.es,
  ...onDeviceTranslations.es,
  ...onboardingTranslations.es,
  ...introTranslations.es,
  ...premiumTranslations.es,
  ...transcriptEditTranslations.es,
  ...workspaceTranslations.es,
  ...autoSetupTranslations.es,
  appName: "Sr. Brócoli",
  retry: "Reintentar",
  dismiss: "Cerrar",
  done: "Hecho",
  aboutSetting: ({ setting }) => `Acerca de ${setting}`,
  unavailable: "No disponible",
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
  settingsRuntimeReadiness: "Estado de preparación",
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
  settingsListening: "Escucha",
  settingsSpeaking: "Habla",
  settingsSearch: "Buscar",
  settingsAppDiagnostics: "Aplicación y diagnóstico",
  settingsGuidedSetup: "Configuración guiada",
  settingsGuidedSetupSummary:
    "Revisa las conexiones y prueba la ruta de voz completa.",
  setupGuideShowInSettings: "Mostrar la configuración guiada en Ajustes",
  setupGuideShowInSettingsSummary:
    "Muestre u oculte el acceso directo de configuración guiada en la descripción general de Ajustes.",
  settingsConnectionsSummary: "Claves, validación y capacidades del proveedor.",
  settingsThinkingSummary:
    "Tarjetas de inicio, modelos, esfuerzo y aviso del sistema.",
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
  ukrainian: "Ucraniano",
  hindi: "Hindi",
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
  light: "Claro",
  dark: "Oscuro",
  system: "Sistema",
  languageCoverage: ({ note }) => `Cobertura de idiomas: ${note}`,
  recordingLimits: ({ note }) => `Límites de grabación: ${note}`,
  catalogProviderPricingSummary: ({ summary }) => `Precios: ${summary}`,
  replyGenerationAction: "generación de respuesta",
  speechTranscriptionAction: "transcripción de voz",
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
  ulraModeHomeLabel: "Mostrar el Modo supremo en la pantalla de inicio",
  ulraModeSettingsDescription:
    "Permite la deliberación entre varios modelos cuando hay al menos dos modelos de inicio listos.",
  ulraModeInfo:
    "El Modo supremo consulta por separado a cada modelo listo de la pantalla de inicio. En cada ronda, los modelos cuestionan la última posición de cada participante; las rondas restantes se omiten tras una convergencia unánime y explícita. El modelo seleccionado sintetiza las rondas completadas correctamente, conservando siempre la última posición de cada modelo. La deliberación se comparte con todos los proveedores implicados.",
  ulraModeRounds: "Rondas de revisión",
  ulraModeCallEstimate: ({ count }) =>
    `Hasta ${count} llamadas a modelos por mensaje con la configuración actual.`,
  ulraModeThresholdWarning:
    "Más de 4 modelos o 3 rondas pueden tardar mucho, consumir muchos tokens y alcanzar los límites de contexto o de solicitudes del proveedor. Esto es solo una advertencia.",
  ulraModeFirstUseTitle: "¿Activar el Modo supremo?",
  ulraModeFirstUseMessage: ({ calls, models, rounds }) =>
    `Con ${models} modelos y hasta ${rounds} rondas de revisión, un mensaje puede realizar hasta ${calls} llamadas a modelos. Puede tardar mucho más, costar bastante más y compartir la deliberación con todos los proveedores implicados.`,
  ulraModeHighRiskTitle: "Ejecución extensa del Modo supremo",
  ulraModeHighRiskMessage: ({ calls, models, rounds }) =>
    `${models} modelos y ${rounds} rondas de revisión pueden realizar hasta ${calls} llamadas a modelos. Puede tardar mucho, usar muchos tokens y alcanzar límites del proveedor. ¿Continuar de todos modos?`,
  ulraModeEnableAction: "Activar",
  ulraModeNeedsTwoModels:
    "El Modo supremo necesita al menos dos modelos listos en la pantalla de inicio.",
  ulraModeAllModelsFailed:
    "Todos los modelos del Modo supremo fallaron antes de poder sintetizar una respuesta.",
  ulraModePartialFailureNotice: ({ failed, succeeded }) =>
    `Fallaron ${failed} llamadas internas a modelos; la respuesta final utilizó ${succeeded} contribuciones correctas.`,
  sttTabDescription:
    "Controle cómo se captura la voz y qué backend convierte el audio en texto antes de que llegue al modelo.",
  ttsTabDescription:
    "Controle cuándo comienzan a hablar las respuestas y qué backend maneja la salida hablada.",
  brief: "Breve",
  briefDescription:
    "Mantén la respuesta concisa. Usa el número mínimo de oraciones necesario para responder por completo al usuario.",
  normal: "Normal",
  normalDescription:
    "Busca una longitud de respuesta equilibrada. Cubre los puntos importantes sin alargar la respuesta.",
  thorough: "Exhaustivo",
  thoroughDescription:
    "Profundiza y sé exhaustivo. Incluye matices, detalles, contrapartidas y el razonamiento que importa.",
  professional: "Profesional",
  professionalDescription:
    "Habla como un consultor sénior que informa a un cliente. Lenguaje preciso, sin jerga, mesurado y con autoridad.",
  casual: "Casual",
  casualDescription:
    "Habla como un amigo inteligente en una cafetería. Relajado, natural, conversacional. Las expresiones coloquiales están bien, las digresiones también.",
  nerdy: "Friki",
  nerdyDescription:
    "Habla como un experto entusiasta al que le encanta profundizar. Usa terminología técnica con libertad, recréate en los detalles y da por hecho que el usuario puede seguirte.",
  concise: "Conciso",
  conciseDescription:
    "Sé lo más breve posible sin dejar de ser completo. Sin preámbulos, sin relleno, solo la respuesta. Piensa en estilo telegrama.",
  socratic: "Socrático",
  socraticDescription:
    "Cuestiona el pensamiento del usuario. Haz contrapreguntas, ofrece perspectivas alternativas y no te limites a confirmar lo que dice. Sé un compañero de debate, no una máquina de decir que sí.",
  eli5: "ELI5",
  eli5Description:
    "Explica todo de la forma más sencilla posible. Usa analogías, lenguaje cotidiano y cero jerga. No des por sentado ningún conocimiento previo sobre ningún tema.",
  useProvider: ({ provider }) => `Utilice ${provider}`,
  createApiKey: "Credenciales",
  apiKey: "Clave API",
  aboutThisProvider: "Acerca de este proveedor",
  openRouterOnboardingTitle: "Una clave, múltiples proveedores",
  openRouterOnboardingDescription:
    "Cree una clave OpenRouter dedicada, péguela a continuación y utilice modelos respaldados por instantáneas de varios proveedores sin reemplazar ninguna conexión directa.",
  openRouterOnboardingRoute:
    "Ruta de solicitud: este dispositivo → OpenRouter → proveedor ascendente seleccionado",
  openRouterKeys: "Claves de OpenRouter",
  providerStatusInvalid: "Inválido",
  providerStatusTesting: "Pruebas",
  providerStatusConfigured: "Configurado",
  providerStatusWorking: "Funcionando",
  providerStatusNotTested: "No probado",
  providerStatusNotSetup: "No configurado",
  expandProvider: ({ provider }) => `Expandir ${provider}`,
  collapseProvider: ({ provider }) => `Contraer ${provider}`,
  testProviderKey: "Probar clave",
  testAllCapabilities: "Probar todo",
  apiTest: "Prueba de API",
  testProviderCapability: ({ capability }) => `Probar ${capability}`,
  test: "Prueba",
  optional: "Opcional",
  providerCapability_llm: "Respuestas",
  providerCapability_stt: "Entrada de voz",
  providerCapability_tts: "Salida de voz",
  providerCapability_search: "Búsqueda web",
  providerCapability_voices: "Biblioteca de voces",
  providerValidationUnavailable:
    "La validación en vivo aún no está disponible para este proveedor. Guarda la clave aquí y verifícala durante el uso real.",
  providerNeedsAttention: "necesita atención",
  catalogProviderLimitsSummary: ({ summary }) => `Límites: ${summary}`,
  catalogProviderRegionSummary: ({ summary }) => `Región: ${summary}`,
  validatingKey: "Validando...",
  showKey: "Mostrar clave",
  hideKey: "Ocultar clave",
  assistantInstructions: "Instrucciones del asistente",
  systemPrompt: "Aviso del sistema",
  aboutSystemPrompt: "Acerca del aviso del sistema",
  assistantInstructionsIntro:
    "Da forma a la guía oculta que recibe el modelo antes de cada respuesta.",
  baseInstructions: "Instrucciones básicas",
  assistantInstructionsPlaceholder: "Definir cómo debe comportarse el asistente.",
  assistantInstructionsHint:
    "Esto siempre se antepone antes de la duración y el tono de la respuesta seleccionada.",
  adaptiveLength: "Longitud adaptable",
  responseTone: "Tono de respuesta",
  homeStyleChipLabel: ({ tone, length }) => `Estilo — ${tone} · ${length}`,
  styleSheetTitle: "Ajustes de la conversación",
  styleSheetSubtitle:
    "Ajusta las respuestas y la voz solo para esta conversación.",
  openStyleSheet: "Abrir los ajustes de la conversación",
  conversationThinkingInstructions: "Instrucciones para pensar",
  conversationThinkingInstructionsDescription:
    "Agregue instrucciones después del aviso del sistema global para esta conversación.",
  conversationThinkingInstructionsPlaceholder:
    "Por ejemplo: desafíe mis suposiciones y utilice ejemplos concretos.",
  ttsInstructions: "Instrucciones de locución",
  ttsInstructionsDescription:
    "Guíe el tono, el ritmo, el acento o la expresión utilizados por los modelos de habla compatibles.",
  conversationTtsInstructionsDescription:
    "Agregue instrucciones de locución después de las instrucciones de voz globales para esta conversación.",
  ttsInstructionsPlaceholder:
    "Por ejemplo: hable con calidez, claridad y ritmo relajado.",
  ttsInstructionsUnsupported:
    "La ruta de voz actual no admite instrucciones de locución.",
  conversationVoiceDescription: ({ route }) =>
    `Elige la voz utilizada por ${route} en esta conversación.`,
  scrollToLatest: "Desplácese hasta el último mensaje",
  conversationTitleGenerate: "Generar título automáticamente",
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
  pushToTalk: "Pulsar para hablar",
  pushToTalkDescription:
    "Mantenga presionado el botón principal mientras habla, luego suéltelo para enviar.",
  toggleToTalk: "Alternar para hablar",
  toggleToTalkDescription:
    "Toque una vez para comenzar a grabar y toque nuevamente cuando haya terminado.",
  driveSession: "Sesión de conducción",
  driveSessionDescription:
    "Cuando la continuación automática está activada, la grabación comienza después de cada respuesta hablada. Toque el botón principal cuando haya terminado de hablar.",
  stopDriveSession: "Pausar continuación automática",
  repeatDriveReply: "Repetir la última",
  continueDriveSession: "Reanudar continuación automática",
  driveSendsIn: ({ seconds }) => `Se envía en ${seconds}…`,
  speechToText: "Voz a texto",
  appNative: "Reconocimiento del sistema",
  nativeSttDescription:
    "Utilice el reconocedor de voz del sistema operativo.",
  provider: "Proveedor",
  webSearchProvider: "Proveedor de búsqueda web",
  webSearchProviderMissingHint:
    "Configure al menos un servicio con capacidad de búsqueda en Credenciales para habilitar aquí el contexto web.",
  webSearchModelHint: ({ model }) =>
    `Utiliza ${model} internamente para obtener contexto web en vivo.`,
  webSearchHomeHint:
    "Utilice el interruptor de la pantalla de inicio para activar o desactivar el contexto web para este hilo.",
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
  webSearchNobodyDescription:
    "Sin solicitudes web. Responde con lo que el modelo sabe.",
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
  openWebSearchSettings: "Abrir los ajustes de búsqueda web",
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
  sentencesArrive: "Por párrafos",
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
  kokoroVoices: "Voces Kokoro en el dispositivo",
  kokoroVoicesHint: ({ size, installedSize }) =>
    `El modelo multilingüe descarga aproximadamente ${size} MB y ocupa aproximadamente ${installedSize} MB después de la instalación.`,
  kokoroModel: "Modelo multilingüe Kokoro",
  kokoroChecking: "Comprobando el modelo del dispositivo...",
  kokoroDownloading: ({ progress }) => `Descargando… ${progress}%`,
  kokoroExtracting: ({ progress }) => `Instalando… ${progress}%`,
  kokoroVerifying: "Verificando el motor de voz...",
  kokoroInstalled: "Instalado y listo en este dispositivo.",
  kokoroNotInstalled:
    "Descarga y verifica el modelo antes de seleccionar o usar Kokoro. No se requiere clave de proveedor.",
  kokoroLanguageFallback:
    "Actualmente, Kokoro habla inglés y chino simplificado aquí. Para otros idiomas de respuesta seleccionados, agregue una ruta alternativa explícita o la voz se detendrá con un error.",
  kokoroRemoveTitle: "¿Quitar el modelo Kokoro?",
  kokoroRemoveBody: ({ installedSize }) =>
    `Esto libera aproximadamente ${installedSize} MB. Puedes descargar el modelo nuevamente en cualquier momento.`,
  removeKokoroModel: "Quitar el modelo Kokoro",
  downloadKokoroModel: "Descargar el modelo Kokoro",
  kokoroFallbackNeeded: ({ languages }) =>
    `Se requiere una ruta alternativa explícita para: ${languages}.`,
  kokoroNoSelectedLanguages:
    "Selecciona inglés o chino simplificado en «Idiomas de escucha» para configurar una voz Kokoro.",
  expandVoiceSettings: ({ language }) =>
    `Expandir la configuración de voz de ${language}`,
  collapseVoiceSettings: ({ language }) =>
    `Contraer la configuración de voz de ${language}`,
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
    "Opcional. Agregue solo las rutas que desee, en el orden en que deben probarse. Una vez que una ruta comienza a hablar, Mr Broccoli permanece en ella durante el resto de la respuesta.",
  ttsFallbackNone:
    "No hay ninguna ruta alternativa configurada. Se mostrará un error de voz en su lugar.",
  ttsFallbackPosition: ({ position, route }) => `${position}. ${route}`,
  addFallbackRoute: ({ route }) => `Agregar ${route} como ruta alternativa`,
  removeFallbackRoute: ({ route }) => `Quitar ${route} de las rutas alternativas`,
  moveFallbackEarlier: ({ route }) => `Mover ${route} antes`,
  moveFallbackLater: ({ route }) => `Mover ${route} más tarde`,
  ttsProvider: "Proveedor TTS",
  ttsProviderEnabledHint:
    "Aquí solo aparecen los proveedores habilitados con soporte de respuesta hablada.",
  ttsProviderMissingHint:
    "Agregue credenciales para un servicio con soporte TTS para elegirlo aquí.",
  localTtsOrderHint:
    "Solo se intentan las rutas alternativas configuradas explícitamente.",
  providerTtsOrderHint:
    "Solo se intentan las rutas alternativas configuradas explícitamente.",
  nativeTtsHint:
    "El TTS nativo utiliza la pila de voz del sistema y no requiere una clave de proveedor.",
  localTtsLanguageCoverageHint:
    "Actualmente, los paquetes locales cubren inglés, alemán, chino simplificado, español, portugués, hindi, francés e italiano.",
  ttsVoice: "Voz TTS",
  refresh: "Actualizar",
  providerVoiceDirectory: ({ provider }) => `Biblioteca de voces de ${provider}`,
  refreshProviderVoices: ({ provider }) =>
    `Actualizar las voces de ${provider}`,
  providerVoicesAvailable: ({ count, provider }) =>
    `${count} ${Number(count) === 1 ? "voz disponible" : "voces disponibles"} de ${provider}.`,
  providerVoicesLoadFailed:
    "No se pudieron actualizar las voces. Tu selección actual no ha cambiado; aún puedes introducir un ID de voz manualmente.",
  providerVoicesLoadFailedWithFallback:
    "No se pudieron cargar las voces de la cuenta. La voz incorporada permanece disponible.",
  providerVoicesErrorDetail: ({ detail }) => `Motivo: ${detail}`,
  elevenLabsVoicesReadPermissionHint:
    "En ElevenLabs, edita esta clave API y habilita Voces → Leer; luego actualiza aquí.",
  providerVoicesLoadingHint: ({ provider }) =>
    `Mr Broccoli carga las voces disponibles automáticamente desde ${provider}.`,
  providerVoiceId: "ID de voz",
  providerVoiceIdPlaceholder: "Introduce un ID de voz",
  providerVoiceIdFallbackHint:
    "La entrada manual permanece disponible cuando no se puede cargar la biblioteca de voces.",
  providerVoiceIdRequired: ({ provider }) =>
    `Actualiza la biblioteca de voces de ${provider} o introduce un ID de voz antes de usar la salida de voz.`,
  qwenSpeechUnavailableInUs:
    "Las rutas de voz de Qwen que Mr Broccoli usa actualmente no están disponibles en la región de EE. UU. Elige Singapur o Pekín para la voz de Qwen.",
  qwenApiRegion: "Región de la API de Qwen",
  qwenRegionSingapore: "Singapur",
  qwenRegionUs: "Estados Unidos (Virginia)",
  qwenRegionBeijing: "China (Pekín)",
  qwenRegionHint:
    "La región seleccionada debe coincidir con la región en la que se creó esta clave API.",
  qwenRegionUsSpeechHint:
    "Las claves de la región de EE. UU. admiten chat y búsqueda web aquí. Las rutas actuales de STT y TTS de Qwen en Mr Broccoli requieren una clave de Singapur o Pekín.",
  providerDefaultVoiceHint:
    "Actualmente, este proveedor utiliza su voz predeterminada para obtener vistas previas y respuestas habladas.",
  listenLanguages: "Idiomas de escucha",
  listenLanguagesHint:
    "Elija los idiomas de respuesta que desee que suenen bien. Mr Broccoli los prueba en este orden al enrutar la salida de voz.",
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
    `${count} configuraciones de modelo o ajuste que el proveedor confirmó como no disponibles están desactivadas solo en este dispositivo. Mr Broccoli las evita automáticamente.`,
  clearRuntimeCompatibilityOverrides: "Borrar compatibilidad en ejecución",
  clearRuntimeCompatibilityOverridesConfirmationTitle:
    "¿Borrar la compatibilidad en ejecución?",
  clearRuntimeCompatibilityOverridesConfirmationMessage:
    "Las configuraciones desactivadas anteriormente podrán volver a probarse. El proveedor puede rechazarlas de nuevo.",
  speechDiagnostics: "Actividad de habla reciente",
  speechDiagnosticsHint:
    "Muestra las últimas solicitudes de voz, la ruta que solicitaron, la ruta que realmente utilizaron y el motivo del cambio de ruta, si lo hubo.",
  clearSpeechDiagnostics: "Borrar actividad de habla reciente",
  speechDiagnosticsEmpty:
    "Aún no hay solicitudes de voz recientes. Obtenga una vista previa de una voz o reproduzca una respuesta para ver los detalles de la ruta aquí.",
  clearSpeechDiagnosticsConfirmationTitle:
    "¿Borrar la actividad de habla reciente?",
  clearSpeechDiagnosticsConfirmationMessage:
    "Esto elimina todos los diagnósticos de enrutamiento de voz capturados. Esta acción no se puede deshacer.",
  speechDiagnosticSourceConversation: "Respuesta de conversación",
  speechDiagnosticSourceRepeat: "Repetición de respuesta",
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
    "Aún no instalado. Se utilizará el TTS en la nube o la voz del sistema hasta que lo descargues.",
  localTtsUnsupportedLanguageFallback:
    "Aún no hay un paquete local disponible para este idioma. Se encargarán el TTS en la nube o la voz del sistema.",
  downloadingLocalTtsPack: ({ progress }) =>
    `Descargando paquete local... ${progress}%`,
  download: "Descargar",
  downloadingShort: "Cargando...",
  voicePreviewText: "Texto de vista previa de voz",
  voicePreviewPlaceholder: "Escribe una frase para escuchar esta voz.",
  voicePreviewHint:
    "Utiliza el backend de voz de respuesta seleccionado actualmente sin enviar nada al modelo de lenguaje.",
  previewVoice: "Vista previa de voz",
  generatingPreview: "Generando vista previa...",
  playingPreview: "Reproduciendo vista previa...",
  systemVoice: "Voz del sistema",
  spokenRepliesOff: "Solo texto",
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
  retrySpeech: "Reintentar la voz",
  openSpeakingSettings: "Ajustes de voz",
  messageCopied: "Mensaje copiado.",
  noConversationToCopyYet: "Aún no hay ninguna conversación para copiar.",
  noConversationToShareYet: "Aún no hay ninguna conversación para compartir.",
  noReplyToRepeatYet: "Aún no hay ninguna respuesta para repetir.",
  threadCopied: "Hilo copiado.",
  threadRenamed: "Hilo renombrado.",
  threadPinned: "Hilo fijado.",
  threadUnpinned: "Hilo desfijado.",
  addProviderKeyToUseProvider: ({ provider }) =>
    `Agregue credenciales para ${provider} en Ajustes antes de usar esta ruta.`,
  configureCredentialsBeforeVoiceSession:
    "Agregue credenciales en Ajustes antes de iniciar una sesión de voz.",
  endpointCredentialFormatInvalid: ({ provider }) =>
    `Para ${provider}, ingrese la URL base del proveedor y la clave API como https://your-endpoint.example.com|your-api-key.`,
  speechRecognitionUnavailableOnDevice:
    "El reconocimiento de voz no está disponible en este dispositivo.",
  debugLogLabel: "LOG",
  debugLogCaptureStarted: "Se inició el registro de depuración.",
  debugLogCaptureStopped: ({ entryCount, fileName }) =>
    `Registro de depuración guardado como ${fileName} y copiado en el portapapeles (${entryCount} entradas).`,
  debugLogCaptureStoppedNoClipboard: ({ entryCount, fileName }) =>
    `Registro de depuración guardado como ${fileName} (${entryCount} entradas).`,
  debugLogCaptureRecovered: ({ entryCount, fileName }) =>
    `Se recuperó el registro de depuración anterior ${fileName} y se copió en el portapapeles (${entryCount} entradas).`,
  debugLogCaptureRecoveredNoClipboard: ({ entryCount, fileName }) =>
    `Se recuperó el registro de depuración anterior ${fileName} (${entryCount} entradas).`,
  debugLogCaptureFailed: "No se pudo guardar el registro de depuración.",
  chooseSttBeforeVoiceSession:
    "Elija una ruta STT configurada en Ajustes antes de iniciar una sesión de voz.",
  chooseTtsBeforeSpokenReplies:
    "Elija una ruta TTS configurada en Ajustes antes de usar respuestas habladas.",
  stopSessionBeforeReplay:
    "Detenga la sesión de voz activa antes de reproducir la última respuesta.",
  couldntCatchThatTryAgain: "No pude captar eso, inténtalo de nuevo.",
  couldntStartVoiceInput: "No se pudo iniciar la entrada de voz.",
  couldntProcessVoiceInput: "No se pudo procesar la entrada de voz.",
  maxRecordingLengthReached:
    "Se alcanzó la duración máxima de grabación: envío lo que tengo.",
  sttRecordingTooLarge: ({ provider, limit }) =>
    `Esa grabación es demasiado larga para la conversión de voz a texto de ${provider} (máx. ${limit}). Prueba con un mensaje más corto o cambia «Voz a texto» a «Reconocimiento del sistema».`,
  addProviderKeyToEnableProvider: ({ provider }) =>
    `Agregue credenciales para ${provider} en Ajustes antes de usar esta ruta.`,
  stopSessionBeforePreview:
    "Detenga la sesión de voz activa antes de obtener una vista previa de una voz.",
  chooseTtsToPreviewVoices:
    "Elija una ruta TTS configurada en Ajustes para obtener una vista previa de las voces.",
  downloadSelectedLocalVoiceFirst: ({ languageLabel }) =>
    `Descarga primero la voz local de ${languageLabel} seleccionada.`,
  couldntPreviewVoice: "No se pudo obtener una vista previa de la voz.",
  spokenRepliesDisabled: "Las respuestas habladas están desactivadas en Ajustes.",
  providerVoiceFallback:
    "Error en la ruta de voz configurada. Se cambió esta respuesta a una voz alternativa.",
  localVoiceFallback:
    "La voz local no estaba disponible. Se cambió esta respuesta a una voz alternativa.",
  localTtsPackInstalled: ({ languageLabel }) =>
    `Paquete de voz local de ${languageLabel} instalado.`,
  localTtsPackInstallFailed: "No se pudo instalar el paquete de voz local.",
  clear: "Borrar",
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
  speakingBackToYou: "Respondiéndote con voz",
  freshSession: "Sesión nueva",
  messageCount: ({ count }) =>
    Number(count) === 1 ? "1 mensaje" : `${count} mensajes`,
  speechInputRoute: ({ route }) => `Entrada de voz: ${route}`,
  replyModelRoute: ({ route }) => `Modelo de respuesta: ${route}`,
  voiceOutputRoute: ({ route }) => `Salida de voz: ${route}`,
  fallbackVoiceOutputRoute: ({ route }) => `Voz alternativa: ${route}`,
  conversation: "Conversación",
  conversationActions: "Acciones de conversación",
  statusDetails: "Detalles de estado",
  persistenceFailure:
    "Mr Broccoli no pudo guardar datos en este dispositivo. Mantén la aplicación abierta y vuelve a intentarlo; los cambios recientes pueden perderse tras el reinicio.",
  show: "Mostrar",
  showTranscript: "Mostrar transcripción",
  hide: "Ocultar",
  copyThread: "Copiar hilo",
  shareThread: "Compartir hilo",
  reportResponse: "Denunciar esta respuesta",
  reportResponseIntro: "Informe de respuesta de IA de Mr Broccoli. Revisa el contenido, describe el problema y envía este informe al desarrollador.",
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
  sendTextMessage: "Enviar mensaje",
  showVoiceInput: "Mostrar entrada de voz",
  showTextInput: "Mostrar entrada de texto",
  usageStatsHiddenDescription:
    "Mantén las estimaciones de tokens fuera de la interfaz de transcripción.",
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
    `${replies} respuestas · ${summaries} actualizaciones de memoria`,
  estimatedUsageConversationScope:
    "Los totales incluyen todas las rutas y modelos utilizados en esta conversación.",
  estimatedPromptTokens: ({ count }) => `Entrada: ${count}`,
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
  openSourceLink: ({ source }) => `Abrir fuente: ${source}`,
  turnReceipt: "Detalles del turno",
  expandTurnReceipt: "Mostrar detalles del turno",
  collapseTurnReceipt: "Ocultar detalles del turno",
  turnReceiptDirect: "Directo",
  turnReceiptRequested: "Ruta de respuesta solicitada",
  turnReceiptActual: "Ruta de respuesta real",
  turnReceiptEffort: "Control de razonamiento",
  turnReceiptProviderNative: "nativo del proveedor",
  turnReceiptInput: "Ruta de entrada",
  turnReceiptSearch: "Búsqueda web",
  turnReceiptVoice: "Salida de voz",
  turnReceiptContext: "Contexto",
  turnReceiptTiming: "Tiempos",
  turnReceiptFallback: "Motivo de la ruta alternativa",
  turnReceiptVoiceInput: "Voz",
  turnReceiptTypedInput: "Escrito",
  turnReceiptSystemSpeech: "Reconocimiento de voz del sistema",
  turnReceiptSystemVoice: "Voz del sistema",
  turnReceiptSystemVoiceFallback: "Voz del sistema · alternativa",
  turnReceiptOff: "Apagado",
  turnReceiptNotConfigured: "Encendido · no configurado",
  turnReceiptFallbackWithoutSearch: "Se continuó sin búsqueda en vivo",
  turnReceiptNotUsed: "No usado",
  turnReceiptSummaryReused: "resumen guardado reutilizado",
  turnReceiptSummaryUpdated: "resumen actualizado",
  turnReceiptContextFallback: "alternativa de mensajes recientes",
  turnReceiptGatewayCompression: ({ original, compressed }) =>
    `la puerta de enlace comprimió ${original} a ${compressed} mensajes`,
  turnReceiptContextValue: ({ sent, total, summarized, state }) =>
    `${sent}/${total} mensajes anteriores enviados · ${summarized} recién resumidos${state}`,
  turnReceiptTimingStt: "STT",
  turnReceiptTimingContext: "contexto",
  turnReceiptTimingSearch: "búsqueda",
  turnReceiptTimingModel: "modelo",
  turnReceiptTimingFirstSpeech: "primera voz",
  turnReceiptTimingTotal: "total",
  estimatedRouteUsageTokensOnly: ({ tokens }) => `${tokens} tokens`,
  unknownUsageRoute: "Ruta desconocida",
  setupGuideConnectProviderTitle: "Configurar credenciales",
  setupGuideConnectProviderDescription:
    "Agregue credenciales en Ajustes, luego elija las rutas que desea usar.",
  idle: "Inactivo",
  yourConversationAppearsHere: "Tu conversación aparece aquí.",
  defaultTranscriptEmptyDescription:
    "Utilice voz o texto para comenzar. Mr Broccoli mantendrá el hilo y responderá aquí.",
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
    "Comience a hablar desde la vista principal y Mr Broccoli creará una sesión automáticamente.",
  setupGuideTitle: "Configurar la aplicación",
  setupGuideSubtitle: "Agregue credenciales y elija rutas en Ajustes.",
  fastestStartPreset: "Configuración mínima",
  fastestStartDescription:
    "Utilice la voz del dispositivo cuando esté disponible y configure solo la ruta de respuesta que necesite.",
  fullVoicePreset: "Voz configurada",
  fullVoiceDescription:
    "Utilice servicios configurados para respuestas, transcripción y salida hablada cuando los elija.",
  setupGuideNote:
    "A continuación abriremos Ajustes para que pueda pegar y validar las credenciales.",
  useThisSetup: "Utilice esta configuración",
  notNow: "Ahora no",
  setupGuideIntroTitle: "Cómo funciona Mr Broccoli",
  setupGuideIntroBody:
    "Mr Broccoli comienza en blanco. Agregue credenciales para los servicios externos que ya utiliza y luego elija cómo se enrutan las respuestas, la entrada de voz, la salida hablada y el contexto web opcional.",
  setupGuideIntroNote:
    "Después de la configuración, use el control de voz principal para iniciar y detener una conversación. La transcripción actual permanece disponible en la pantalla de inicio y cada ruta se puede cambiar más tarde en Ajustes.",
  setupGuideProviderTitle: "Agregar credenciales",
  setupGuideProviderBody:
    "Elija el servicio externo que desea configurar y luego pegue las credenciales con acceso de respuesta.",
  setupGuideProviderPickerLabel: "Servicio de respuesta",
  setupGuideSelectProvider: "Seleccione un proveedor",
  setupGuideSelectProviderFirst: "Seleccione un proveedor primero.",
  setupGuideApiKeyLabel: "Clave API",
  setupGuideApiKeyPlaceholder: "Pegar credenciales",
  setupGuideContinue: "Continuar",
  setupGuideOpenSettings: "Abrir Ajustes",
  setupGuideBack: "Atrás",
  setupGuideValidateKey: "Validar clave",
  setupGuideApiKeyRequiredOrCancel:
    "Agregue una clave API para continuar o cancele la guía de configuración.",
  setupGuideProviderAndApiKeyRequiredOrCancel:
    "Elija un proveedor y agregue una clave API para continuar, o cancele la guía de configuración.",
  setupGuideProviderKeyNeedsLlmAccess: ({ provider }) =>
    `Estas credenciales de ${provider} no permiten solicitudes de respuesta.`,
  setupGuideKokoroTitle: "Agregue una voz natural en el dispositivo",
  setupGuideKokoroBody: ({ size }) =>
    `Opcional: descargue Kokoro (aproximadamente ${size} MB) para obtener respuestas habladas mucho más naturales sin un proveedor de voz ni cargos por uso.`,
  setupGuideKokoroLanguageNote:
    "Este modelo actualmente habla inglés y chino simplificado. Configure las rutas alternativas que desee más adelante en los ajustes de voz.",
  setupGuideKokoroDownload: "Descargar Kokoro",
  setupGuideUseKokoro: "Utilice Kokoro para respuestas habladas",
  setupGuideUseKokoroSummary:
    "Mantenga la síntesis en el teléfono siempre que se admita el idioma de respuesta.",
  setupGuideSkipKokoro: "Saltar por ahora",
  setupGuideVoiceTestTitle: "Pruebe su configuración",
  setupGuideVoiceTestBody:
    "Di una frase corta. Mr Broccoli probará el acceso al micrófono, la transcripción, la ruta de respuesta configurada y la salida hablada cuando esté disponible una ruta de voz aceptable.",
  setupGuideVoiceTestNoInputBody:
    "La entrada de voz no está disponible con esta configuración. Continúe revisando las rutas detectadas y luego ajuste la configuración de voz si es necesario.",
  setupGuideVoiceTestTextOnlyNote:
    "Esta prueba es de solo texto porque aún no hay ninguna ruta de voz hablada aceptable lista.",
  setupGuideVoiceTestStart: "Iniciar prueba",
  setupGuideVoiceTestStop: "Detener grabación",
  setupGuideVoiceTestRetry: "Repetir prueba",
  setupGuideVoiceTestTranscribing: "Transcribiendo…",
  setupGuideVoiceTestThinking: "Probando la respuesta…",
  setupGuideVoiceTestSynthesizing: "Preparando voz...",
  setupGuideVoiceTestSpeaking: "Reproduciendo respuesta…",
  setupGuideVoiceTestTranscript: "Transcripción",
  setupGuideVoiceTestReply: "Respuesta",
  setupGuideVoiceTestReset: "Borrar este resultado",
  setupGuideVoiceInputUnavailable:
    "La entrada de voz no está disponible para esta configuración en este dispositivo.",
  setupGuideSummaryTitle: "Configuración completa",
  setupGuideSummaryBody:
    "Aquí está la ruta que utilizará Mr Broccoli con su configuración actual.",
  setupGuideSummaryLlm: "LLM",
  setupGuideSummaryStt: "Voz a texto",
  setupGuideSummaryTts: "Texto a voz",
  setupGuideSummaryWebSearch: "Búsqueda web",
  setupGuideRouteProviderLlm: ({ provider }) =>
    `Habilitado mediante ${provider}`,
  setupGuideRouteOnDeviceStt:
    "Habilitado mediante el reconocimiento de voz del sistema",
  setupGuideRouteProviderStt: ({ provider }) =>
    `Habilitado mediante la transcripción de voz de ${provider}`,
  setupGuideRouteProviderTts: ({ provider }) =>
    `Habilitado mediante la voz de ${provider}`,
  setupGuideRouteKokoroTts: "Habilitado mediante la voz Kokoro en el dispositivo",
  setupGuideRouteLocalTts: "Habilitado mediante el paquete de voz local",
  setupGuideRouteUnavailable: "No disponible",
  setupGuideRouteOff: "Apagado",
  setupGuideWebSearchAvailableOff: ({ provider }) =>
    `Disponible mediante ${provider}, actualmente desactivado`,
  setupGuideSummaryTextOnlyNote:
    "Las respuestas habladas están desactivadas por ahora. Las respuestas permanecen en texto hasta que habilites un proveedor o voz local.",
  setupGuideFinish: "Hecho",
  searchConversationsPlaceholder: "Buscar títulos, modelos y texto de mensajes",
  noMatchingConversations: "No hay conversaciones coincidentes",
  noMatchingConversationsDescription:
    "Pruebe con un título, ruta, modelo o frase diferente de la transcripción.",
  memoryModalTitle: "Memoria de conversación",
  memoryModalDescription:
    "Este es el resumen compacto que Mr Broccoli conserva cuando un hilo se alarga lo suficiente como para comprimir los turnos más antiguos.",
  memorySummary: "Resumen guardado",
  memorySummaryEmpty:
    "Aún no hay memoria compacta. Una vez que este hilo se alargue, los turnos más antiguos se resumirán aquí.",
  summarizedTurnsCount: ({ count }) =>
    Number(count) === 1 ? "1 turno resumido" : `${count} turnos resumidos`,
  copyMemory: "Copiar memoria",
  forgetMemory: "Olvidar memoria",
  memoryCopied: "Memoria copiada.",
  memoryCleared: "Se borró la memoria de la conversación.",
  noConversationToManageYet: "Aún no hay memoria de conversación disponible.",
  noProviderYet: "Ningún proveedor todavía",
  noModelYet: "Aún no hay modelo",
  startedAt: "Inicio",
  endedAt: "Fin",
  pinned: "Fijado",
  copy: "Copiar",
  share: "Compartir",
  rename: "Cambiar nombre",
  pin: "Fijar",
  unpin: "Desfijar",
  save: "Guardar",
  cancel: "Cancelar",
  stop: "Detener",
  pause: "Pausa",
  resume: "Reanudar",
  paused: "En pausa",
  listening: "Escuchando",
  parsing: "Transcribiendo",
  searching: "Buscando",
  converting: "Convirtiendo",
  webSearchAction: "búsqueda web",
  thinking: "Pensando",
  speaking: "Hablando",
  pleaseWait: "Espera un momento",
  yourTurn: "Tu turno",
  keepPressing: "Sigue presionando",
  tapWhenDone: "Toca cuando hayas terminado",
  speechPaused: "La voz está en pausa",
  pausePlaybackUnavailable:
    "Esta ruta de voz no se puede pausar. Detenla o cambia a la salida de voz del proveedor.",
  holdToSpeak: "Mantén pulsado para hablar",
  tapToSpeak: "Toca para hablar",
  tapAgainToSend: "Toca de nuevo para enviar",
  waitingForReply: "Esperando respuesta",
  parsingYourVoice: "Analizando tu voz",
  providerConfiguredInSettings: ({ provider }) =>
    `${provider} no está configurado en Ajustes.`,
  providerNetworkError: ({ provider, action }) =>
    `No se pudo comunicar con ${provider} para ${action}. Verifique la conexión y vuelva a intentarlo.`,
  providerAuthError: ({ provider, action }) =>
    `${provider} rechazó las credenciales de ${action}. Verifica la clave API y los permisos.`,
  providerRateLimitError: ({ provider, action }) =>
    `${provider} está limitando las solicitudes de ${action} en este momento. Inténtalo de nuevo en un momento.`,
  providerCreditsRequired: ({ provider, action }) =>
    `${provider} necesita suficiente crédito API para ${action}. Consulta el saldo de la cuenta y el límite de gasto de la clave.`,
  providerTimeoutError: ({ provider, action }) =>
    `${provider} tardó demasiado durante ${action}. Inténtalo de nuevo.`,
  providerTemporaryError: ({ provider, action }) =>
    `${provider} tuvo un problema temporal durante ${action}. Vuelve a intentarlo en breve.`,
  providerEmptyReplyError: ({ provider }) =>
    `${provider} finalizó sin devolver respuesta. Inténtalo de nuevo.`,
  providerIncompleteReplyError: ({ provider }) =>
    `La respuesta de ${provider} finalizó antes de completarse. Inténtalo de nuevo.`,
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
    "El TTS nativo no sintetiza archivos de audio.",
  localTtsUnavailableForLanguage: ({ languageLabel }) =>
    `No hay ninguna ruta de voz local o en la nube lista para ${languageLabel}.`,
  chooseTextToSpeechProviderInSettings:
    "Elija un proveedor de texto a voz en Ajustes.",
  ttsNotSupportedYet: ({ provider }) => `${provider} TTS aún no es compatible.`,
  ttsError: ({ provider, status, errorText }) =>
    `Error de TTS de ${provider} (${status}): ${errorText}`,
  ttsReplyTooLong: ({ provider }) =>
    `La salida de voz de ${provider} rechazó la respuesta porque era demasiado larga.`,
  ttsTimeout: ({ provider }) =>
    `La salida de voz de ${provider} tardó demasiado.`,
  sttTimeout: ({ provider }) =>
    `La transcripción de voz de ${provider} tardó demasiado.`,
  sttFileSizeLimitExceeded: ({ provider, model, limit }) =>
    `${provider} ${model} solo acepta grabaciones de hasta ${limit}. Utiliza un clip más corto o cambia de modelo STT.`,
  voiceInputCaptureIncomplete:
    "La entrada de voz no se pudo capturar limpiamente. Por favor inténtalo de nuevo.",
  ttsDidNotReturnAudio: ({ provider }) =>
    `${provider} TTS no devolvió audio.`,
  nativeSttHandledInApp:
    "El STT del sistema se gestiona directamente en la aplicación.",
  chooseSpeechToTextProviderInSettings:
    "Elija un proveedor de voz a texto en Ajustes.",
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
  nativeSpeechRecognitionFailed: "Falló el reconocimiento de voz nativo.",
  couldntStartNativeSpeechRecognition:
    "No se pudo iniciar el reconocimiento de voz nativo.",
  microphonePermissionNotGranted: "Permiso de micrófono no concedido",
} satisfies TranslationDictionary;
