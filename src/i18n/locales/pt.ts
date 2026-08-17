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

export const pt = {
  ...conversationArtifactTranslations.pt,
  ...interruptionTranslations.pt,
  ...ulraAuditTranslations.pt,
  ...councilWorkspaceTranslations.pt,
  ...dataBackupTranslations.pt,
  ...conversationKnowledgeTranslations.pt,
  ...imagePromptTranslations.pt,
  ...onDeviceTranslations.pt,
  ...localSpeechTranslations.pt,
  ...settingsTranslations.pt,
  ...transcriptEditTranslations.pt,
  ...workspaceTranslations.pt,
  ...sessionLockTranslations.pt,
  appName: "Sr. Brócolo",
  retry: "Tentar novamente",
  dismiss: "Fechar",
  done: "Concluído",
  aboutSetting: ({ setting }) => `Sobre ${setting}`,
  unavailable: "Indisponível",
  selection: "Seleção",
  chooseCompatibleProviderFirst: "Escolhe primeiro um fornecedor compatível",
  settings: "Definições",
  settingsReleaseVersion: ({ version }) => `Versão ${version}`,
  all: "Todos",
  instructions: "Instruções",
  providers: "Fornecedores",
  webSearch: "Pesquisa na Web",
  stt: "STT",
  tts: "TTS",
  ui: "UI",
  settingsRuntimeReadiness: "Prontidão de execução",
  settingsReadinessThink: "Pensar",
  settingsReadinessListen: "Escutar",
  settingsReadinessSpeak: "Falar",
  settingsReadinessSearch: "Pesquisa",
  settingsReadinessReady: "Pronto",
  settingsReadinessNeedsAttention: "Atenção",
  settingsReadinessBroken: "Avariado",
  settingsReadinessOff: "Desligado",
  settingsConnections: "Ligações",
  settingsThinking: "Pensamento",
  settingsListening: "Escuta",
  settingsSpeaking: "Fala",
  settingsSearch: "Pesquisa",
  settingsAppDiagnostics: "Aplicação e diagnóstico",
  settingsGuidedSetup: "Configuração guiada",
  settingsGuidedSetupSummary:
    "Revê as ligações e testa a rota de voz completa.",
  setupGuideShowInSettings: "Mostrar configuração guiada em Definições",
  setupGuideShowInSettingsSummary:
    "Mostrar ou ocultar o atalho de configuração guiada na vista geral das definições.",
  settingsConnectionsSummary: "Chaves, validação e recursos do fornecedor.",
  settingsThinkingSummary: "Cartões iniciais, modelos, esforço e prompt do sistema.",
  settingsListeningSummary: "Modo de entrada e encaminhamento de voz para texto.",
  settingsSpeakingSummary: "Respostas faladas, reprodução, vozes e amostras.",
  settingsSearchSummary: "Fornecedor de pesquisa na Web e controlos de qualidade de pesquisa.",
  settingsAppDiagnosticsSummary:
    "Tema, idioma, utilização, registos de depuração e atividades recentes.",
  settingsBackToOverview: "Voltar à vista geral",
  settingsOpenSection: ({ section }) => `Abrir ${section}`,
  theme: "Tema",
  language: "Idioma",
  recognitionLanguage: "Idioma de reconhecimento",
  recognitionLanguageHint:
    "Escolhe um idioma para melhorar o reconhecimento ou deixa o dispositivo ou fornecedor detetá-lo automaticamente.",
  automaticLanguage: "Automático",
  speechLanguageUnsupportedByProvider: ({ provider, language }) =>
    `${provider} não suporta oficialmente ${language} nesta rota de voz.`,
  usageStats: "Estatísticas de utilização",
  model: "Modelo",
  effort: "Esforço",
  effortValue: ({ effort }) => `Esforço: ${effort}`,
  modelEffortNone: "Nenhum",
  modelEffortMinimal: "Mínimo",
  modelEffortLow: "Baixo",
  modelEffortMedium: "Médio",
  modelEffortHigh: "Alto",
  modelEffortExtraHigh: "Muito alto",
  modelEffortMax: "Máximo",
  modelEffortDynamic: "Dinâmico",
  modelEffortDisabled: "Desativado",
  modelEffortEnabled: "Ativado",
  fixed: "Fixo",
  english: "Inglês",
  german: "Alemão",
  ukrainian: "Ucraniano",
  hindi: "Hindi",
  spanish: "Espanhol",
  french: "Francês",
  italian: "Italiano",
  portuguese: "Português",
  portugueseBrazil: "Português (Brasil)",
  russian: "Russo",
  simplifiedChinese: "Chinês simplificado",
  arabic: "Árabe",
  japanese: "Japonês",
  hungarian: "Húngaro",
  czech: "Checo",
  polish: "Polaco",
  turkish: "Turco",
  swedish: "Sueco",
  urdu: "Urdu",
  kokoroAmericanFemaleVoice: ({ name }) =>
    `${name} · inglês americano, voz feminina`,
  kokoroBritishFemaleVoice: ({ name }) =>
    `${name} · inglês britânico, voz feminina`,
  kokoroChineseFemaleVoice: ({ index }) => `Chinês, voz feminina ${index}`,
  kokoroChineseMaleVoice: ({ index }) => `Chinês, voz masculina ${index}`,
  light: "Claro",
  dark: "Escuro",
  system: "Sistema",
  languageCoverage: ({ note }) => `Cobertura linguística: ${note}`,
  recordingLimits: ({ note }) => `Limites de gravação: ${note}`,
  catalogProviderPricingSummary: ({ summary }) => `Preços: ${summary}`,
  replyGenerationAction: "geração de resposta",
  speechTranscriptionAction: "transcrição de fala",
  speechSynthesisAction: "síntese de voz",
  instructionsTabDescription:
    "Molda a orientação oculta que orienta o assistente antes de qualquer fornecedor ver o pedido.",
  providersTabDescription:
    "Armazena as credenciais de serviço externo no dispositivo e configura os modos de resposta que pretendes utilizar.",
  webSearchTabDescription:
    "Configura o contexto web ao vivo opcional antes das respostas.",
  responseModes: "Seleção de modelo",
  aboutModelSelection: "Sobre a seleção do modelo",
  modelSelectionInfo:
    "Cada cartão de modelo torna-se uma escolha no ecrã inicial. Configura o teu fornecedor, modelo e nível de esforço opcional e, em seguida, muda de cartão para escolher que modelo responde a seguir.",
  responseModeItemTitle: ({ index }) => `Modelo ${index}`,
  addResponseMode: "Adicionar modelo",
  removeResponseMode: "Remover modelo",
  responseModesNoConfiguredProviders:
    "Adiciona as credenciais primeiro. Os controlos de rota permanecem ocultos até que pelo menos um serviço compatível seja configurado.",
  useResponseMode: ({ mode }) => `Utilizar ${mode}`,
  chooseResponseModel: "Escolhe um modelo",
  responseModelCount: ({ count }) => `${count} modelos disponíveis`,
  ulraMode: "Conselho de Modelos",
  ulraModeHomeLabel: "Mostrar o Conselho de Modelos no ecrã inicial",
  ulraModeSettingsDescription:
    "Permite a deliberação entre vários modelos quando pelo menos dois modelos do ecrã inicial estão prontos.",
  ulraModeInfo:
    "O Conselho de Modelos consulta separadamente cada modelo pronto no ecrã inicial. Em cada ronda, os modelos contestam a posição mais recente de cada participante; as rondas restantes são ignoradas após uma convergência unânime explícita. O modelo selecionado sintetiza as rondas concluídas com êxito, mantendo sempre a posição mais recente de cada modelo. A deliberação é partilhada com todos os fornecedores envolvidos.",
  ulraModeRounds: "Rondas de revisão",
  ulraModeCallEstimate: ({ count }) =>
    `Até ${count} chamadas a modelos por mensagem com a configuração atual.`,
  ulraModeThresholdWarning:
    "Mais de 4 modelos ou 3 rondas podem demorar muito, consumir muitos tokens e atingir limites de contexto ou de pedidos dos fornecedores. Isto é apenas um aviso.",
  ulraModeFirstUseTitle: "Ativar o Conselho de Modelos?",
  ulraModeFirstUseMessage: ({ calls, models, rounds }) =>
    `Com ${models} modelos e até ${rounds} rondas de revisão, uma mensagem pode fazer até ${calls} chamadas a modelos. Pode demorar muito mais, custar bastante mais e partilhar a deliberação com todos os fornecedores envolvidos.`,
  ulraModeHighRiskTitle: "Execução extensa do Conselho de Modelos",
  ulraModeHighRiskMessage: ({ calls, models, rounds }) =>
    `${models} modelos e ${rounds} rondas de revisão podem fazer até ${calls} chamadas a modelos. Isto pode demorar muito, usar muitos tokens e atingir limites dos fornecedores. Continuar mesmo assim?`,
  ulraModeEnableAction: "Ativar",
  ulraModeNeedsTwoModels:
    "O Conselho de Modelos precisa de pelo menos dois modelos prontos no ecrã inicial.",
  ulraModeAllModelsFailed:
    "Todos os modelos do Conselho de Modelos falharam antes de ser possível sintetizar uma resposta.",
  ulraModePartialFailureNotice: ({ failed, succeeded }) =>
    `${failed} chamadas internas a modelos falharam; a resposta final usou ${succeeded} contributos bem-sucedidos.`,
  sttTabDescription:
    "Controla a forma como a fala é capturada e qual o back-end que transforma o áudio em texto antes de este chegar ao modelo.",
  ttsTabDescription:
    "Controla quando as respostas começam a ser faladas e qual o back-end que lida com a saída falada.",
  brief: "Breve",
  briefDescription:
    "Mantém a resposta curta. Utiliza o número mínimo de frases necessárias para responder completamente ao utilizador.",
  normal: "Normal",
  normalDescription:
    "Procura um comprimento de resposta equilibrado. Cobre os pontos importantes sem arrastar a resposta.",
  thorough: "Minucioso",
  thoroughDescription:
    "Vai a fundo e sê abrangente. Inclui nuances, detalhes, compensações e o raciocínio que importa.",
  professional: "Profissional",
  professionalDescription:
    "Fala como um consultor sénior a apresentar um relatório a um cliente. Linguagem precisa, sem calão, comedida e com autoridade.",
  casual: "Casual",
  casualDescription:
    "Fala como um amigo inteligente numa cafetaria. Descontraído, natural, conversador. As contrações não são problema, as digressões também não.",
  nerdy: "Nerd",
  nerdyDescription:
    "Fala como um especialista entusiasta que adora ir a fundo. Utiliza a terminologia técnica livremente, entusiasma-se com os detalhes e presume que o utilizador consegue acompanhar.",
  concise: "Conciso",
  conciseDescription:
    "Sê o mais breve possível e ao mesmo tempo completo. Sem preâmbulo, sem preenchimento, apenas a resposta. Pensa no estilo telegrama.",
  socratic: "Socrático",
  socraticDescription:
    "Desafia o pensamento do utilizador. Faz contra-perguntas, oferece perspetivas alternativas, não se limite a confirmar o que disseram. Sê um sparring, não uma máquina de sim.",
  eli5: "ELI5",
  eli5Description:
    "Explica tudo da forma mais simples possível. Utiliza analogias, linguagem quotidiana, zero jargão. Não presume qualquer conhecimento prévio sobre qualquer assunto.",
  useProvider: ({ provider }) => `Utilizar ${provider}`,
  createApiKey: "Credenciais",
  apiKey: "Chave API",
  aboutThisProvider: "Sobre este fornecedor",
  openRouterGatewayTitle: "Uma chave, vários fornecedores",
  openRouterGatewayDescription:
    "Cria uma chave OpenRouter dedicada, cola-a abaixo e utiliza modelos baseados em snapshots de vários fornecedores sem substituir qualquer ligação direta.",
  openRouterGatewayRoute:
    "Caminho do pedido: este dispositivo → OpenRouter → fornecedor upstream selecionado",
  openRouterKeys: "Chaves OpenRouter",
  providerStatusInvalid: "Inválido",
  providerStatusTesting: "A testar",
  providerStatusConfigured: "Configurado",
  providerStatusWorking: "A funcionar",
  providerStatusNotTested: "Não testado",
  providerStatusNotSetup: "Não configurado",
  expandProvider: ({ provider }) => `Expandir ${provider}`,
  collapseProvider: ({ provider }) => `Recolher ${provider}`,
  testProviderKey: "Testar chave",
  testAllCapabilities: "Testar tudo",
  apiTest: "Teste API",
  testProviderCapability: ({ capability }) => `Testar ${capability}`,
  test: "Teste",
  optional: "Opcional",
  providerCapability_llm: "Respostas",
  providerCapability_stt: "Entrada de fala",
  providerCapability_tts: "Saída de voz",
  providerCapability_search: "Pesquisa na Web",
  providerCapability_voices: "Biblioteca de voz",
  providerValidationUnavailable:
    "A validação ao vivo ainda não está ligada para este fornecedor. Guarda a chave aqui e verifica-a durante a utilização real.",
  providerNeedsAttention: "precisa de atenção",
  catalogProviderLimitsSummary: ({ summary }) => `Limites: ${summary}`,
  catalogProviderRegionSummary: ({ summary }) => `Região: ${summary}`,
  validatingKey: "A validar...",
  showKey: "Mostrar chave",
  hideKey: "Ocultar chave",
  assistantInstructions: "Instruções do assistente",
  systemPrompt: "Prompt do sistema",
  aboutSystemPrompt: "Sobre o prompt do sistema",
  assistantInstructionsIntro:
    "Molda a orientação oculta que o modelo recebe antes de cada resposta.",
  baseInstructions: "Instruções base",
  assistantInstructionsPlaceholder: "Defina como o assistente se deve comportar.",
  assistantInstructionsHint:
    "Isto é sempre acrescentado antes do comprimento e do tom de resposta selecionados.",
  adaptiveLength: "Comprimento adaptativo",
  responseTone: "Tom de resposta",
  homeStyleChipLabel: ({ tone, length }) => `Estilo — ${tone} · ${length}`,
  styleSheetTitle: "Definições da conversa",
  styleSheetSubtitle: "Forme respostas e fala apenas para esta conversa.",
  openStyleSheet: "Abrir definições de conversa",
  conversationThinkingInstructions: "Instruções de pensamento",
  conversationThinkingInstructionsDescription:
    "Adiciona instruções após o prompt de sistema global para esta conversa.",
  conversationThinkingInstructionsPlaceholder:
    "Por exemplo: Desafia as minhas suposições e utiliza exemplos concretos.",
  ttsInstructions: "Instruções de entrega da fala",
  ttsInstructionsDescription:
    "Orienta o tom, o ritmo, o sotaque ou a apresentação utilizados pelos modelos de fala compatíveis.",
  conversationTtsInstructionsDescription:
    "Adiciona instruções de entrega após as instruções de fala globais para esta conversa.",
  ttsInstructionsPlaceholder:
    "Por exemplo: fale de forma calorosa, clara e a um ritmo descontraído.",
  ttsInstructionsUnsupported:
    "A rota de fala atual não suporta instruções de entrega.",
  conversationVoiceDescription: ({ route }) =>
    `Escolhe a voz utilizada por ${route} nesta conversa.`,
  scrollToLatest: "Deslocar até à última mensagem",
  conversationTitleGenerate: "Gerar título automaticamente",
  conversationTitleGenerating: "A gerar título…",
  conversationTitleGenerated: "Conversa renomeada.",
  conversationTitleNeedsContent:
    "Inicia uma conversa antes de gerar um título.",
  conversationTitleNeedsProvider:
    "Configura o modelo selecionado antes de gerar um título.",
  conversationTitleGenerationFailed: "Não foi possível gerar o título da conversa.",
  conversationTitleGenerationTimedOut:
    "A geração do título demorou muito tempo. Por favor, tenta novamente.",
  inputMode: "Modo de entrada",
  voiceInput: "Entrada de voz",
  pushToTalk: "Premir para falar",
  pushToTalkDescription:
    "Segura o botão principal enquanto fala e solta para enviar.",
  toggleToTalk: "Tocar para falar",
  toggleToTalkDescription:
    "Toca uma vez para iniciar a gravação e toca novamente quando terminar.",
  driveSession: "Sessão Drive",
  driveSessionDescription:
    "Quando a continuação automática está ativada, a gravação começa após cada resposta falada. Toca no botão principal quando terminar de falar.",
  stopDriveSession: "Pausar automático",
  repeatDriveReply: "Repetir última",
  continueDriveSession: "Retomar automático",
  driveSendsIn: ({ seconds }) => `Envia em ${seconds}…`,
  speechToText: "Fala para Texto",
  appNative: "Reconhecimento do Sistema",
  nativeSttDescription:
    "Utiliza o reconhecedor de fala do sistema operativo.",
  provider: "Fornecedor",
  webSearchProvider: "Fornecedor de pesquisa na Web",
  webSearchProviderMissingHint:
    "Configura pelo menos um serviço com capacidade de pesquisa em Credenciais para ativar aqui a fundamentação com contexto da web.",
  webSearchModelHint: ({ model }) =>
    `Utiliza ${model} nos bastidores para fundamentar as respostas com contexto atual da web.`,
  webSearchHomeHint:
    "Utiliza o botão de alternância do ecrã inicial para ativar ou desativar o contexto da web para este tópico.",
  settingsWebSearchCompactHint:
    "Opcionalmente, acrescenta um novo contexto web antes de o modelo principal responder.",
  webSearchAdvanced: "Controlos de pesquisa avançada",
  expandAdvancedSearch: "Expandir os controlos de pesquisa avançada",
  collapseAdvancedSearch: "Recolher controlos de pesquisa avançada",
  webSearchSetupNeeded: "Adiciona credenciais para utilizar a pesquisa na web ao vivo.",
  webSearchEnabledDescription:
    "Novo contexto web é adicionado antes de o modelo responder.",
  webSearchDisabledDescription:
    "Utiliza o contexto da web ao vivo para este tópico quando os factos atuais são importantes.",
  webSearchNobodyDescription:
    "Sem pedidos à web. Responde com o que o modelo sabe.",
  webSearchQualityControls: "Qualidade de pesquisa",
  webSearchSearchMode: "Modo de pesquisa",
  webSearchSearchModeQuick: "Rápido",
  webSearchSearchModeBalanced: "Equilibrado",
  webSearchSearchModeDeep: "Profundo",
  webSearchDepth: "Profundidade de pesquisa",
  webSearchDepthStandard: "Padrão",
  webSearchDepthDeep: "Profundo",
  webSearchResultCount: "Contagem de resultados",
  webSearchQualityHint: ({ provider }) =>
    `Estes controlos ajustam a forma como ${provider} reúne novo contexto antes da resposta.`,
  webSearchNoExtraControls: ({ provider }) =>
    `${provider} ainda não expõe controlos de qualidade de pesquisa extra nesta aplicação.`,
  setWebSearchMode: ({ mode }) => `Definir o modo de pesquisa na Web para ${mode}`,
  openWebSearchSettings: "Abrir as definições de pesquisa na Web",
  providerSttDescription:
    "Utiliza um serviço externo configurado para transcrever a tua voz antes de esta ser enviada para a rota de resposta.",
  sttProvider: "Fornecedor STT",
  sttProviderEnabledHint:
    "Apenas os fornecedores ativados com suporte para transcrição aparecem aqui.",
  sttProviderMissingHint:
    "Adiciona credenciais para um serviço com suporte STT para o escolher aqui.",
  nativeSttHint:
    "O reconhecimento do sistema funciona independentemente das chaves do teu fornecedor e pode ser processado no dispositivo ou pelo serviço de voz do sistema operativo.",
  replyPlayback: "Reprodução da resposta",
  sentencesArrive: "À chegada dos parágrafos",
  sentencesArriveDescription:
    "Começa a falar assim que um parágrafo completo estiver pronto.",
  fullReplyFirst: "Resposta completa primeiro",
  fullReplyFirstDescription:
    "Gera primeiro a resposta inteira e depois reproduz-a de uma só vez.",
  textToSpeech: "Texto para voz",
  spokenReplies: "Respostas faladas",
  spokenRepliesEnabledDescription:
    "Lê as respostas do assistente em voz alta quando estiver disponível uma via de voz.",
  spokenRepliesDisabledDescription:
    "Mantém as respostas apenas em texto por enquanto. A tua rota preferida TTS fica guardada para mais tarde.",
  nativeTtsDescription:
    "Utiliza o motor de fala do dispositivo para respostas faladas e amostras de voz.",
  kokoroTtsDescription:
    "Utiliza uma voz neural muito mais natural, totalmente neste dispositivo. O texto das respostas faladas é sintetizado localmente, sem chave de fornecedor de fala nem custos de utilização.",
  kokoroVoices: "Vozes Kokoro no dispositivo",
  kokoroVoicesHint: ({ size, installedSize }) =>
    `O modelo multilingue descarrega cerca de ${size} MB e ocupa cerca de ${installedSize} MB após a instalação.`,
  kokoroModel: "Modelo multilingue Kokoro",
  kokoroChecking: "A verificar o modelo no dispositivo…",
  kokoroDownloading: ({ progress }) => `A descarregar… ${progress}%`,
  kokoroExtracting: ({ progress }) => `A instalar… ${progress}%`,
  kokoroVerifying: "A verificar o motor de voz…",
  kokoroInstalled: "Instalado e pronto neste dispositivo.",
  kokoroNotInstalled:
    "Transfere e verifica o modelo antes de selecionar ou utilizar o Kokoro. Não é necessária nenhuma chave de fornecedor.",
  kokoroLanguageFallback:
    "Kokoro fala atualmente inglês e chinês simplificado aqui. Para outros idiomas de resposta selecionados, adiciona uma rota alternativa explícita ou a fala será interrompida com um erro.",
  kokoroRemoveTitle: "Remover o modelo Kokoro?",
  kokoroRemoveBody: ({ installedSize }) =>
    `Isto liberta cerca de ${installedSize} MB. Podes descarregar o modelo novamente a qualquer momento.`,
  removeKokoroModel: "Remover o modelo Kokoro",
  downloadKokoroModel: "Descarregar o modelo Kokoro",
  kokoroFallbackNeeded: ({ languages }) =>
    `É necessária uma rota alternativa explícita para: ${languages}.`,
  kokoroNoSelectedLanguages:
    "Seleciona Inglês ou Chinês Simplificado em Idiomas de escuta para configurar uma voz Kokoro.",
  expandVoiceSettings: ({ language }) => `Expandir as definições de voz ${language}`,
  collapseVoiceSettings: ({ language }) =>
    `Recolher as definições de voz ${language}`,
  remove: "Remover",
  voiceOutputDescription:
    "Escolhe o motor de fala, os idiomas de escuta e as amostras de voz para as respostas faladas.",
  localTts: "Local",
  localTtsDescription:
    "Utiliza uma voz local descarregada correspondente para as respostas faladas.",
  providerTtsDescription:
    "Utiliza o serviço configurado selecionado para respostas faladas.",
  ttsFallbackRoutes: "Rotas alternativas",
  ttsFallbackRoutesHint:
    "Opcional. Adiciona apenas as rotas pretendidas, pela ordem em que devem ser tentadas. Assim que uma rota começa a falar, permaneço nela durante o resto da resposta.",
  ttsFallbackNone:
    "Não está configurada nenhuma rota alternativa. Em vez disso, será apresentada uma falha de voz.",
  ttsFallbackPosition: ({ position, route }) => `${position}. ${route}`,
  addFallbackRoute: ({ route }) => `Adicionar ${route} como alternativa`,
  removeFallbackRoute: ({ route }) => `Remover ${route} das alternativas`,
  moveFallbackEarlier: ({ route }) => `Mover ${route} para antes`,
  moveFallbackLater: ({ route }) => `Mover ${route} para depois`,
  ttsProvider: "Fornecedor TTS",
  ttsProviderEnabledHint:
    "Apenas os fornecedores ativados com suporte para resposta falada aparecem aqui.",
  ttsProviderMissingHint:
    "Adiciona credenciais para um serviço com suporte TTS para o escolher aqui.",
  localTtsOrderHint:
    "Apenas são tentadas rotas alternativas explicitamente configuradas.",
  providerTtsOrderHint:
    "Apenas são tentadas rotas alternativas explicitamente configuradas.",
  nativeTtsHint:
    "O TTS nativo utiliza a pilha de voz do sistema e não requer uma chave de fornecedor.",
  localTtsLanguageCoverageHint:
    "Atualmente, os pacotes locais abrangem o inglês, o alemão, o chinês simplificado, o espanhol, o português, o hindi, o francês e o italiano.",
  ttsVoice: "Voz TTS",
  refresh: "Atualizar",
  providerVoiceDirectory: ({ provider }) => `Biblioteca de voz ${provider}`,
  refreshProviderVoices: ({ provider }) => `Atualizar vozes ${provider}`,
  providerVoicesAvailable: ({ count, provider }) =>
    `${count} ${Number(count) === 1 ? "voz disponível" : "vozes disponíveis"} de ${provider}.`,
  providerVoicesLoadFailed:
    "Não foi possível atualizar as vozes. A tua seleção atual permanece inalterada; podes ainda introduzir um ID de voz manualmente.",
  providerVoicesLoadFailedWithFallback:
    "Não foi possível carregar as vozes da conta. A voz integrada continua disponível.",
  providerVoicesErrorDetail: ({ detail }) => `Motivo: ${detail}`,
  elevenLabsVoicesReadPermissionHint:
    "Em ElevenLabs, edita esta chave API e ativa Voices → Read e atualiza aqui.",
  providerVoicesLoadingHint: ({ provider }) =>
    `Carrego as vozes disponíveis automaticamente a partir de ${provider}.`,
  providerVoiceId: "ID de voz",
  providerVoiceIdPlaceholder: "Introduza um ID de voz",
  providerVoiceIdFallbackHint:
    "A introdução manual permanece disponível quando a biblioteca de voz não pode ser carregada.",
  providerVoiceIdRequired: ({ provider }) =>
    `Atualiza a biblioteca de voz ${provider} ou introduz um ID de voz antes de utilizar a saída de voz.`,
  qwenSpeechUnavailableInUs:
    "As minhas rotas de voz Qwen atuais não estão disponíveis na região dos EUA. Escolhe Singapura ou Pequim para o discurso Qwen.",
  qwenApiRegion: "Região Qwen API",
  qwenRegionSingapore: "Singapura",
  qwenRegionUs: "EUA (Virgínia)",
  qwenRegionBeijing: "China (Pequim)",
  qwenRegionHint:
    "A região selecionada deve corresponder à região na qual esta chave API foi criada.",
  qwenRegionUsSpeechHint:
    "As chaves da região dos EUA suportam o chat e a pesquisa na web aqui. As minhas rotas Qwen STT e TTS atuais requerem uma chave de Singapura ou Pequim.",
  providerDefaultVoiceHint:
    "Este fornecedor utiliza atualmente a tua voz predefinida para as amostras e as respostas faladas.",
  listenLanguages: "Idiomas de escuta",
  listenLanguagesHint:
    "Escolhe os idiomas de resposta que pretendes que soem bem. Tento-os por esta ordem ao encaminhar a saída de voz.",
  listenLanguagesSelected: ({ count }) =>
    count === 1 ? "1 idioma selecionado" : `${count} idiomas selecionados`,
  localVoicePacks: "Pacotes de voz locais",
  localVoicePacksHint:
    "Cada língua mantém a sua própria voz local. Escolhe a voz pretendida para esse idioma e descarrega apenas os pacotes do teu interesse.",
  localVoiceForLanguage: ({ languageLabel }) => `Voz para ${languageLabel}`,
  providerVoicePreviews: "Amostras de voz do fornecedor",
  providerVoicePreviewsHint:
    "Testa aqui a rota TTS atualmente selecionada com um texto de amostra separado para cada idioma de resposta.",
  nativeVoicePreviewSection: "Amostra de voz nativa",
  nativeVoicePreviewSectionHint:
    "Fala diretamente através do sintetizador de voz integrado do telefone para que possa compará-lo com as vozes configuradas do fornecedor.",
  nativeVoiceUnavailable:
    "Este dispositivo não reportou nenhuma voz nativa do sistema para amostra.",
  runtimeCompatibilityOverrides: "Compatibilidade em tempo de execução",
  runtimeCompatibilityOverridesDescription: ({ count }) =>
    `${count} configurações de modelo ou definição confirmadas como indisponíveis pelo fornecedor estão desativadas apenas neste dispositivo. Contorno-as automaticamente.`,
  clearRuntimeCompatibilityOverrides:
    "Limpar compatibilidade em tempo de execução",
  clearRuntimeCompatibilityOverridesConfirmationTitle:
    "Limpar a compatibilidade em tempo de execução?",
  clearRuntimeCompatibilityOverridesConfirmationMessage:
    "As configurações anteriormente desativadas poderão ser tentadas novamente. O fornecedor poderá rejeitá-las de novo.",
  speechDiagnostics: "Atividade de fala recente",
  speechDiagnosticsHint:
    "Mostra os últimos pedidos de fala, a rota solicitada, a rota realmente utilizada e o motivo de qualquer mudança para uma alternativa.",
  clearSpeechDiagnostics: "Limpar atividade de fala recente",
  speechDiagnosticsEmpty:
    "Ainda não há pedidos de fala recentes. Ouve uma amostra de voz ou reproduz uma resposta para ver aqui os detalhes do encaminhamento.",
  clearSpeechDiagnosticsConfirmationTitle: "Limpar atividade de fala recente?",
  clearSpeechDiagnosticsConfirmationMessage:
    "Isto remove todos os diagnósticos de encaminhamento de fala capturados. Esta ação não pode ser anulada.",
  speechDiagnosticSourceConversation: "Resposta da conversa",
  speechDiagnosticSourceRepeat: "Repetir resposta",
  speechDiagnosticSourcePreview: "Amostra de voz",
  speechDiagnosticSourceUnknown: "Pedido de fala",
  speechDiagnosticRouteLine: ({ requested, actual }) =>
    `Solicitado: ${requested} -> Real: ${actual}`,
  speechDiagnosticStageLine: ({ stage }) => `Última etapa: ${stage}`,
  speechDiagnosticLanguageLine: ({ languageLabel }) =>
    `Idioma: ${languageLabel}`,
  speechDiagnosticProviderLine: ({ provider }) => `Fornecedor: ${provider}`,
  speechDiagnosticVoiceLine: ({ voice }) => `Voz: ${voice}`,
  localTtsPackReady: "Instalado neste dispositivo.",
  localTtsPackBroken:
    "Transferido, mas esta voz falhou a verificação local neste dispositivo. Transfere novamente ou escolhe outra voz.",
  localTtsPackMissing:
    "Ainda não instalado. O TTS na nuvem ou a voz do sistema será utilizado até fazer a transferência.",
  localTtsUnsupportedLanguageFallback:
    "Um pacote local ainda não está disponível para este idioma. O TTS na nuvem ou a voz do sistema encarregar-se-á disso.",
  downloadingLocalTtsPack: ({ progress }) =>
    `A descarregar pacote local... ${progress}%`,
  download: "Transferir",
  downloadingShort: "A carregar...",
  voicePreviewText: "Texto da amostra de voz",
  voicePreviewPlaceholder: "Introduza uma frase para ouvir essa voz.",
  voicePreviewHint:
    "Utiliza o back-end de voz de resposta atualmente selecionado sem enviar nada para o modelo de linguagem.",
  previewVoice: "Ouvir amostra",
  generatingPreview: "A gerar amostra...",
  playingPreview: "A reproduzir amostra...",
  systemVoice: "Voz do sistema",
  spokenRepliesOff: "Somente texto",
  noTtsProvider: "Nenhum fornecedor TTS",
  nothingToCopyYet: "Nada a copiar ainda.",
  couldntCopyText: "Não foi possível copiar este texto.",
  nothingToShareYet: "Nada para partilhar ainda.",
  couldntShareText: "Não foi possível partilhar este texto.",
  couldntReplayReply: "Não foi possível reproduzir esta resposta.",
  replyFailed: "Falha na resposta",
  retryReply: "Tentar responder novamente",
  replyFailedHint: "Podes escolher outro modelo acima antes de tentar novamente.",
  spokenReplyFailed: "A resposta foi guardada, mas não pôde ser falada.",
  retrySpeech: "Tentar novamente a fala",
  openSpeakingSettings: "Definições de fala",
  messageCopied: "Mensagem copiada.",
  noConversationToCopyYet: "Nenhuma conversa para copiar ainda.",
  noConversationToShareYet: "Nenhuma conversa para partilhar ainda.",
  noReplyToRepeatYet: "Ainda não há resposta para repetir.",
  threadCopied: "Tópico copiado.",
  threadRenamed: "Tópico renomeado.",
  threadPinned: "Tópico fixado.",
  threadUnpinned: "Tópico desafixado.",
  addProviderKeyToUseProvider: ({ provider }) =>
    `Adiciona as credenciais para ${provider} em Definições antes de utilizar esta rota.`,
  configureCredentialsBeforeVoiceSession:
    "Adiciona credenciais em Definições antes de iniciar uma sessão de voz.",
  endpointCredentialFormatInvalid: ({ provider }) =>
    `Para ${provider}, introduz o URL base do fornecedor e a chave API como https://your-endpoint.example.com|your-api-key.`,
  speechRecognitionUnavailableOnDevice:
    "O reconhecimento de voz não está disponível neste dispositivo.",
  debugLogLabel: "REGISTO",
  debugLogCaptureStarted: "O registo de depuração foi iniciado.",
  debugLogCaptureStopped: ({ entryCount, fileName }) =>
    `Registo de depuração guardado como ${fileName} e copiado para a área de transferência (${entryCount} entradas).`,
  debugLogCaptureStoppedNoClipboard: ({ entryCount, fileName }) =>
    `Registo de depuração guardado como ${fileName} (${entryCount} entradas).`,
  debugLogCaptureRecovered: ({ entryCount, fileName }) =>
    `Registo de depuração anterior ${fileName} recuperado e copiado para a área de transferência (${entryCount} entradas).`,
  debugLogCaptureRecoveredNoClipboard: ({ entryCount, fileName }) =>
    `Registo de depuração anterior ${fileName} recuperado (${entryCount} entradas).`,
  debugLogCaptureFailed: "Não foi possível guardar o registo de depuração.",
  chooseSttBeforeVoiceSession:
    "Escolhe uma rota STT configurada em Definições antes de iniciar uma sessão de voz.",
  chooseTtsBeforeSpokenReplies:
    "Escolhe uma rota TTS configurada em Definições antes de utilizar respostas faladas.",
  stopSessionBeforeReplay:
    "Interrompe a sessão de voz ativa antes de reproduzir a última resposta.",
  couldntCatchThatTryAgain: "Não foi possível capturar isto, tenta novamente.",
  couldntStartVoiceInput: "Não foi possível iniciar a entrada de voz.",
  couldntProcessVoiceInput: "Não foi possível processar a entrada de voz.",
  maxRecordingLengthReached:
    "Duração máxima de gravação atingida — envio o que tenho.",
  sttRecordingTooLarge: ({ provider, limit }) =>
    `Esta gravação é demasiado longa para a conversão de voz em texto ${provider} (máx. ${limit}). Experimenta uma mensagem mais curta ou altera a conversão de voz em texto para reconhecimento do sistema.`,
  addProviderKeyToEnableProvider: ({ provider }) =>
    `Adiciona as credenciais para ${provider} em Definições antes de utilizar esta rota.`,
  stopSessionBeforePreview:
    "Interrompe a sessão de voz ativa antes de ouvir uma amostra de voz.",
  chooseTtsToPreviewVoices:
    "Escolhe uma rota TTS configurada em Definições para ouvir amostras de voz.",
  downloadSelectedLocalVoiceFirst: ({ languageLabel }) =>
    `Transfere primeiro a voz local ${languageLabel} selecionada.`,
  couldntPreviewVoice: "Não foi possível reproduzir a amostra de voz.",
  spokenRepliesDisabled: "As respostas faladas estão desativadas nas definições.",
  providerVoiceFallback:
    "A rota de voz configurada falhou. Esta resposta passou para uma voz alternativa.",
  localVoiceFallback:
    "A voz local não estava disponível. Esta resposta passou para uma voz alternativa.",
  localTtsPackInstalled: ({ languageLabel }) =>
    `Pacote de voz local ${languageLabel} instalado.`,
  localTtsPackInstallFailed: "Não foi possível instalar o pacote de voz local.",
  clear: "Limpar",
  voiceOutput: "Saída de voz",
  speechReplayCache: "Cache de repetição de voz",
  speechReplayCacheDescription:
    "A voz gerada pelo fornecedor fica neste dispositivo até 14 dias, por isso repetir uma resposta não volta a gastar créditos de voz.",
  clearSpeechReplayCache: "Limpar cache de voz",
  speechReplayCacheCleared: "Os ficheiros de voz em cache foram removidos.",
  speechReplayCacheClearFailed: "Não foi possível limpar a cache de voz.",
  listeningToYourVoice: "A ouvir a tua voz",
  parsingYourVoiceInput: "A transformar a tua voz em texto",
  preparingRequest: "A preparar o teu pedido",
  searchingTheWeb: "A pesquisar na web contexto atualizado",
  waitingForProvider: ({ provider }) => `À espera de ${provider}`,
  preparingVoiceWithProvider: ({ provider }) =>
    `A preparar a voz com ${provider}`,
  deepThinkingReassurance: "Boas respostas demoram um momento…",
  thinkingElapsed: ({ detail, seconds }) => `${detail} · ${seconds}s`,
  speakingBackToYou: "A falar consigo",
  freshSession: "Nova sessão",
  messageCount: ({ count }) =>
    Number(count) === 1 ? "1 mensagem" : `${count} mensagens`,
  conversation: "Conversa",
  conversationActions: "Ações da conversa",
  statusDetails: "Detalhes do estado",
  persistenceFailure:
    "Não consegui guardar dados neste dispositivo. Mantém a aplicação aberta e tenta novamente; alterações recentes podem ser perdidas após a reinicialização.",
  show: "Mostrar",
  showTranscript: "Mostrar transcrição",
  hide: "Ocultar",
  copyThread: "Copiar Tópico",
  shareThread: "Partilhar tópico",
  reportResponse: "Denunciar esta resposta",
  reportResponseIntro: "Denúncia de resposta de IA do Mr Broccoli. Revê o conteúdo, descreve o problema e envia esta denúncia ao programador.",
  repeatReply: "Repetir resposta",
  renameThread: "Renomear tópico",
  renameThreadHint:
    "Dê a esta conversa um título que possa encontrar rapidamente mais tarde.",
  threadTitle: "Título do tópico",
  noTranscriptYet: "Nenhuma transcrição ainda",
  previewTranscriptEmptyDescription:
    "Usa voz ou texto para começar. A tua conversa aparecerá aqui.",
  noConversationYet: "Nenhuma conversa ainda",
  expandedTranscriptEmptyDescription:
    "Usa voz ou texto para começar. Fecha este ecrã quando quiser regressar ao palco principal.",
  transcriptSelectionHint:
    "Seleciona qualquer texto de mensagem diretamente ou partilha e copia mensagens individuais abaixo.",
  textMessagePlaceholder: "Introduza uma mensagem",
  sendTextMessage: "Enviar mensagem",
  showVoiceInput: "Mostrar entrada de voz",
  showTextInput: "Mostrar entrada de texto",
  usageStatsHiddenDescription:
    "Mantém as estimativas de tokens fora da interface da transcrição.",
  usageStatsVisibleDescription:
    "Mostrar a utilização estimada de tokens para as respostas e os totais da conversa.",
  debugLogButton: "Botão Registo de depuração",
  debugLogButtonHiddenDescription:
    "Mantém o botão REGISTO do ecrã inicial oculto, a menos que uma captura já esteja a ser executada.",
  debugLogButtonVisibleDescription:
    "Mostrar o botão REGISTO do ecrã inicial para iniciar e interromper capturas de depuração.",
  debugLogButtonUsageDescription:
    "Como utilizar o botão: ativá-lo iniciará a captura de registos. Desativá-lo interromperá a captura de registos e movê-los-á para a área de transferência.",
  estimatedUsageTitle: "Utilização estimada",
  estimatedUsageCounts: ({ replies, summaries }) =>
    `${replies} respostas · ${summaries} atualizações de memória`,
  estimatedUsageConversationScope:
    "Os totais incluem todas as rotas e modelos utilizados nesta conversa.",
  estimatedPromptTokens: ({ count }) => `Prompt: ${count}`,
  estimatedReplyTokens: ({ count }) => `Resposta: ${count}`,
  estimatedTotalTokens: ({ count }) => `Total: ${count}`,
  estimatedUsageInline: ({ prompt, completion, total }) =>
    `Est. ${prompt} entrada · ${completion} saída · ${total} total`,
  searchQuery: "Consulta de pesquisa",
  expandWebSearchDetails: "Mostrar detalhes da pesquisa na web",
  collapseWebSearchDetails: "Ocultar detalhes da pesquisa na Web",
  webSearchSourceCount: ({ count }) =>
    `${count} ${Number(count) === 1 ? "fonte" : "fontes"}`,
  sources: "Fontes",
  openSourceLink: ({ source }) => `Abrir fonte: ${source}`,
  turnReceipt: "Detalhes do turno",
  expandTurnReceipt: "Mostrar detalhes do turno",
  collapseTurnReceipt: "Ocultar os detalhes do turno",
  turnReceiptDirect: "Direto",
  turnReceiptRequested: "Rota de resposta solicitada",
  turnReceiptActual: "Rota de resposta real",
  turnReceiptEffort: "Controlo de raciocínio",
  turnReceiptProviderNative: "nativo do fornecedor",
  turnReceiptInput: "Rota de entrada",
  turnReceiptSearch: "Pesquisa na Web",
  turnReceiptVoice: "Saída de voz",
  turnReceiptContext: "Contexto",
  turnReceiptTiming: "Tempo",
  turnReceiptFallback: "Motivo da alternativa",
  turnReceiptVoiceInput: "Voz",
  turnReceiptTypedInput: "Escrito",
  turnReceiptSystemSpeech: "Reconhecimento de voz do sistema",
  turnReceiptSystemVoice: "Voz do sistema",
  turnReceiptSystemVoiceFallback: "Voz do sistema · alternativa",
  turnReceiptOff: "Desligado",
  turnReceiptNotConfigured: "Ligado · não configurado",
  turnReceiptFallbackWithoutSearch: "Continuação sem pesquisa ao vivo",
  turnReceiptNotUsed: "Não usado",
  turnReceiptSummaryReused: "resumo guardado reutilizado",
  turnReceiptSummaryUpdated: "resumo atualizado",
  turnReceiptContextFallback: "alternativa de mensagens recentes",
  turnReceiptGatewayCompression: ({ original, compressed }) =>
    `gateway comprimiu ${original} para ${compressed} mensagens`,
  turnReceiptContextValue: ({ sent, total, summarized, state }) =>
    `${sent}/${total} mensagens anteriores enviadas · ${summarized} recentemente resumidas${state}`,
  turnReceiptTimingStt: "STT",
  turnReceiptTimingContext: "contexto",
  turnReceiptTimingSearch: "pesquisa",
  turnReceiptTimingModel: "modelo",
  turnReceiptTimingFirstSpeech: "primeira fala",
  turnReceiptTimingTotal: "total",
  estimatedRouteUsageTokensOnly: ({ tokens }) => `${tokens} tokens`,
  unknownUsageRoute: "Rota desconhecida",
  setupGuideConnectProviderTitle: "Configurar credenciais",
  setupGuideConnectProviderDescription:
    "Adiciona credenciais em Definições e escolhe as rotas que pretendes utilizar.",
  idle: "Ocioso",
  yourConversationAppearsHere: "A tua conversa aparece aqui",
  defaultTranscriptEmptyDescription:
    "Usa voz ou texto para começar. Manterei o tópico e responderei aqui.",
  delete: "Eliminar",
  deleteConversationConfirmationTitle: ({ title }) => `Eliminar “${title}”?`,
  deleteConversationConfirmationMessage:
    "Isto elimina permanentemente a conversa e todas as suas mensagens. Esta ação não pode ser anulada.",
  conversations: "Conversas",
  drawerSubtitle: "Salte entre tópicos ao vivo ou começa uma nova sala.",
  newSession: "Nova sessão",
  noSavedConversationsYet: "Ainda não há conversas guardadas",
  drawerEmptyDescription:
    "Começa a falar na vista principal e criarei uma sessão automaticamente.",
  setupGuideTitle: "Configurar a aplicação",
  setupGuideSubtitle: "Adiciona credenciais e escolhe rotas em Definições.",
  fastestStartPreset: "Configuração mínima",
  fastestStartDescription:
    "Utiliza a fala do dispositivo quando disponível e configura apenas a rota de resposta necessária.",
  fullVoicePreset: "Voz configurada",
  fullVoiceDescription:
    "Utiliza serviços configurados para respostas, transcrição e saída falada quando os escolher.",
  setupGuideNote:
    "A seguir abriremos as Definições para que possa colar e validar as credenciais.",
  useThisSetup: "Utilizar esta configuração",
  notNow: "Agora não",
  setupGuideIntroTitle: "Como funciono",
  setupGuideIntroBody:
    "Começo do zero. Adiciona credenciais para serviços externos que já utiliza e escolhe como as respostas, a entrada de fala, a saída falada e o contexto Web opcional serão encaminhados.",
  setupGuideIntroNote:
    "Após a configuração, utiliza o controlo de voz principal para iniciar e interromper uma conversa. A transcrição atual permanece disponível no ecrã inicial e cada rota pode ser alterada posteriormente nas Definições.",
  setupGuideProviderTitle: "Adicionar credenciais",
  setupGuideProviderBody:
    "Escolhe o serviço externo que pretendes configurar e cola as credenciais com acesso de resposta.",
  setupGuideProviderPickerLabel: "Serviço de resposta",
  setupGuideSelectProvider: "Seleciona um fornecedor",
  setupGuideSelectProviderFirst: "Seleciona primeiro um fornecedor.",
  setupGuideApiKeyLabel: "Chave API",
  setupGuideApiKeyPlaceholder: "Colar credenciais",
  setupGuideContinue: "Continuar",
  setupGuideOpenSettings: "Abrir Definições",
  setupGuideBack: "Voltar",
  setupGuideValidateKey: "Validar chave",
  setupGuideApiKeyRequiredOrCancel:
    "Adiciona uma chave API para continuar ou cancela o guia de configuração.",
  setupGuideProviderAndApiKeyRequiredOrCancel:
    "Escolhe um fornecedor e adiciona uma chave API para continuar ou cancela o guia de configuração.",
  setupGuideProviderKeyNeedsLlmAccess: ({ provider }) =>
    `Estas credenciais ${provider} não permitem pedidos de resposta.`,
  setupGuideKokoroTitle: "Adiciona uma voz natural no dispositivo",
  setupGuideKokoroBody: ({ size }) =>
    `Opcional: descarrega Kokoro (cerca de ${size} MB) para obter respostas faladas muito mais naturais, sem fornecedor de voz ou encargos de utilização.`,
  setupGuideKokoroLanguageNote:
    "Este modelo fala atualmente inglês e chinês simplificado. Configura quaisquer rotas alternativas desejadas posteriormente nas definições de Fala.",
  setupGuideKokoroDownload: "Transferir o Kokoro",
  setupGuideUseKokoro: "Utilizar o Kokoro para respostas faladas",
  setupGuideUseKokoroSummary:
    "Mantém a síntese no telefone sempre que o idioma de resposta for compatível.",
  setupGuideSkipKokoro: "Saltar por enquanto",
  setupGuideVoiceTestTitle: "Testa a tua configuração",
  setupGuideVoiceTestBody:
    "Diz uma frase curta. Testarei o acesso ao microfone, a transcrição, a rota de resposta configurada e a saída falada quando uma rota de voz aceitável estiver disponível.",
  setupGuideVoiceTestNoInputBody:
    "A entrada de voz não está disponível nesta configuração. Continua a rever as rotas detetadas e ajusta as definições de fala mais tarde, se necessário.",
  setupGuideVoiceTestTextOnlyNote:
    "Este teste continua apenas em texto porque ainda não está pronta nenhuma rota de voz falada aceitável.",
  setupGuideVoiceTestStart: "Iniciar teste",
  setupGuideVoiceTestStop: "Parar a gravação",
  setupGuideVoiceTestRetry: "Repetir o teste",
  setupGuideVoiceTestTranscribing: "A transcrever…",
  setupGuideVoiceTestThinking: "A testar a resposta…",
  setupGuideVoiceTestSynthesizing: "A preparar a voz…",
  setupGuideVoiceTestSpeaking: "A reproduzir resposta…",
  setupGuideVoiceTestTranscript: "Transcrição",
  setupGuideVoiceTestReply: "Resposta",
  setupGuideVoiceTestReset: "Limpar este resultado",
  setupGuideVoiceInputUnavailable:
    "A entrada de voz não está disponível para esta configuração neste dispositivo.",
  setupGuideSummaryTitle: "Configuração concluída",
  setupGuideSummaryBody:
    "Aqui está a rota que irei utilizar com a tua configuração atual.",
  setupGuideSummaryLlm: "LLM",
  setupGuideSummaryStt: "Fala para texto",
  setupGuideSummaryTts: "Texto para voz",
  setupGuideSummaryWebSearch: "Pesquisa na Web",
  setupGuideRouteProviderLlm: ({ provider }) => `Ativado via ${provider}`,
  setupGuideRouteOnDeviceStt: "Ativado através do reconhecimento de voz do sistema",
  setupGuideRouteProviderStt: ({ provider }) =>
    `Ativado através da transcrição de fala ${provider}`,
  setupGuideRouteProviderTts: ({ provider }) => `Ativado via voz ${provider}`,
  setupGuideRouteKokoroTts: "Ativado através de voz no dispositivo Kokoro",
  setupGuideRouteLocalTts: "Ativado através de pacote de voz local",
  setupGuideRouteUnavailable: "Não disponível",
  setupGuideRouteOff: "Desligado",
  setupGuideWebSearchAvailableOff: ({ provider }) =>
    `Disponível via ${provider}, atualmente desativado`,
  setupGuideSummaryTextOnlyNote:
    "As respostas faladas estão desativadas por enquanto. As respostas permanecem em texto até ativar um fornecedor ou voz local.",
  setupGuideFinish: "Concluído",
  searchConversationsPlaceholder: "Pesquise títulos, modelos e texto de mensagens",
  noMatchingConversations: "Nenhuma conversa correspondente",
  noMatchingConversationsDescription:
    "Experimenta um título, rota, modelo ou frase diferente da transcrição.",
  noProviderYet: "Nenhum fornecedor ainda",
  noModelYet: "Nenhum modelo ainda",
  startedAt: "Iniciado",
  endedAt: "Terminado",
  pinned: "Fixado",
  copy: "Copiar",
  share: "Partilhar",
  rename: "Renomear",
  pin: "Fixar",
  unpin: "Desafixar",
  save: "Guardar",
  cancel: "Cancelar",
  stop: "Parar",
  pause: "Pausa",
  resume: "Retomar",
  paused: "Pausado",
  listening: "A escutar",
  parsing: "A transcrever",
  searching: "A pesquisar",
  converting: "A converter",
  webSearchAction: "pesquisa na web",
  thinking: "A pensar",
  speaking: "A falar",
  pleaseWait: "Por favor, aguarda",
  yourTurn: "A tua vez",
  keepPressing: "Continua a pressionar",
  tapWhenDone: "Toca quando terminar",
  speechPaused: "A fala está pausada",
  pausePlaybackUnavailable:
    "Esta rota de voz não pode ser colocada em pausa. Interrompe ou muda para a saída de voz do fornecedor.",
  holdToSpeak: "Segura para falar",
  tapToSpeak: "Toca para falar",
  tapAgainToSend: "Toca novamente para enviar",
  waitingForReply: "A aguardar resposta",
  parsingYourVoice: "A analisar a tua voz",
  providerConfiguredInSettings: ({ provider }) =>
    `${provider} não está configurado em Definições.`,
  providerNetworkError: ({ provider, action }) =>
    `Não foi possível aceder a ${provider} para ${action}. Verifica a ligação e tenta novamente.`,
  providerAuthError: ({ provider, action }) =>
    `${provider} rejeitou as credenciais para ${action}. Verifica a chave API e as permissões.`,
  providerRateLimitError: ({ provider, action }) =>
    `${provider} está a limitar os pedidos de ${action} neste momento. Tenta novamente dentro de alguns instantes.`,
  providerCreditsRequired: ({ provider, action }) =>
    `${provider} precisa de crédito API suficiente para ${action}. Verifica o saldo da conta e o limite de gastos da chave.`,
  providerTimeoutError: ({ provider, action }) =>
    `${provider} demorou muito tempo durante ${action}. Tenta novamente.`,
  providerTemporaryError: ({ provider, action }) =>
    `${provider} teve um problema temporário durante ${action}. Tenta novamente em breve.`,
  providerEmptyReplyError: ({ provider }) =>
    `${provider} terminou sem devolver resposta. Tenta novamente.`,
  providerIncompleteReplyError: ({ provider }) =>
    `A resposta de ${provider} terminou antes de estar concluída. Tenta novamente.`,
  providerContextTooLong: ({ provider }) =>
    `${provider} rejeitou a resposta porque a conversa se tornou demasiado longa. Inicia um novo tópico ou encurta o pedido.`,
  providerRequestRejected: ({ provider, action, detail }) =>
    detail
      ? `${provider} rejeitou o pedido de ${action}: ${detail}`
      : `${provider} rejeitou o pedido de ${action}.`,
  providerWebSearchNotRun: ({ provider }) =>
    `${provider} devolveu uma resposta sem executar a pesquisa na web.`,
  providerValidationSuccess: ({ provider }) => `${provider} está pronto a utilizar.`,
  providerCapabilityValidationSuccess: ({ provider, capability }) =>
    `${provider} ${capability} está a funcionar.`,
  providerValidationFailed: "Falha na validação do fornecedor.",
  webSearchFallback:
    "A pesquisa na web não estava disponível, pelo que a resposta continuou sem contexto web ao vivo.",
  noBase64EncoderAvailable: "Sem codificador base64 disponível.",
  noBase64DecoderAvailable: "Sem descodificador base64 disponível.",
  azureSpeechApiKeyFormat:
    "Microsoft Azure TTS necessita de credenciais Azure Speech no formato <key>|<region>, por exemplo, abc123|westeurope, ou o formato combinado Azure <endpoint>|<api-key>|<key>|<region>.",
  nativeTtsDoesNotSynthesizeAudioFiles:
    "O TTS nativo não sintetiza ficheiros de áudio.",
  localTtsUnavailableForLanguage: ({ languageLabel }) =>
    `Nenhuma rota de voz local ou na nuvem está pronta para ${languageLabel}.`,
  chooseTextToSpeechProviderInSettings:
    "Escolhe um fornecedor de conversão de texto em voz em Definições.",
  ttsNotSupportedYet: ({ provider }) => `${provider} TTS ainda não é compatível.`,
  ttsError: ({ provider, status, errorText }) =>
    `Erro ${provider} TTS (${status}): ${errorText}`,
  ttsReplyTooLong: ({ provider }) =>
    `A saída de voz ${provider} rejeitou a resposta por ser demasiado longa.`,
  ttsTimeout: ({ provider }) => `A saída de voz ${provider} demorou muito tempo.`,
  sttTimeout: ({ provider }) =>
    `A transcrição da fala ${provider} demorou muito tempo.`,
  sttFileSizeLimitExceeded: ({ provider, model, limit }) =>
    `${provider} ${model} apenas aceita gravações até ${limit}. Utiliza um clipe mais curto ou troca os modelos STT.`,
  voiceInputCaptureIncomplete:
    "A entrada de voz não pôde ser captada corretamente. Por favor, tenta novamente.",
  ttsDidNotReturnAudio: ({ provider }) =>
    `${provider} TTS não devolveu áudio.`,
  nativeSttHandledInApp: "O STT do sistema é tratado diretamente na aplicação.",
  chooseSpeechToTextProviderInSettings:
    "Escolhe um fornecedor de voz para texto em Definições.",
  sttNotSupportedYet: ({ provider }) => `${provider} STT ainda não é compatível.`,
  providerNotWiredUpYet: ({ provider }) => `${provider} ainda não está ligado.`,
  you: "Tu",
  assistant: "Assistente",
  untitledConversation: "Conversa sem título",
  conversationExportHeader: ({ title }) => `Conversa: ${title}`,
  speechRecognitionPermissionNotGranted:
    "Permissão de reconhecimento de voz não concedida.",
  speechRecognitionUnavailableForDeviceLanguage:
    "O reconhecimento de voz não está disponível para o idioma atual do dispositivo.",
  nativeSpeechRecognitionNeedsNetwork:
    "O reconhecimento de voz nativo precisa de acesso à rede agora.",
  noSpeechDetected: "Nenhuma fala foi detetada.",
  nativeSpeechRecognitionFailed: "O reconhecimento de voz nativo falhou.",
  couldntStartNativeSpeechRecognition:
    "Não foi possível iniciar o reconhecimento de fala nativo.",
  microphonePermissionNotGranted: "Permissão de microfone não concedida",
} satisfies TranslationDictionary;
