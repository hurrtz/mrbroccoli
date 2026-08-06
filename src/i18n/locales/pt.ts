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
import { premiumTranslations } from "../premiumTranslations";
import { transcriptEditTranslations } from "../transcriptEditTranslations";

export const pt = {
  ...conversationArtifactTranslations.pt,
  ...interruptionTranslations.pt,
  ...ulraAuditTranslations.pt,
  ...dataBackupTranslations.pt,
  ...conversationKnowledgeTranslations.pt,
  ...conversationIntegrityTranslations.pt,
  ...imagePromptTranslations.pt,
  ...memoryEditTranslations.pt,
  ...onDeviceTranslations.pt,
  ...onboardingTranslations.pt,
  ...premiumTranslations.pt,
  ...transcriptEditTranslations.pt,
  appName: "Sr. Brócolo",
  retry: "Tentar novamente",
  dismiss: "Fechar",
  done: "Concluído",
  aboutSetting: ({ setting }) => `Sobre ${setting}`,
  unavailable: "Indisponível",
  selection: "Seleção",
  chooseCompatibleProviderFirst: "Escolha primeiro um fornecedor compatível",
  settings: "Definições",
  settingsReleaseVersion: ({ version }) => `Versão ${version}`,
  all: "Todos",
  firstRun: "Primeiro arranque",
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
    "Reveja as ligações e teste a rota de voz completa.",
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
    "Escolha um idioma para melhorar o reconhecimento ou deixe o dispositivo ou fornecedor detetá-lo automaticamente.",
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
    "Molde a orientação oculta que orienta o assistente antes de qualquer fornecedor ver o pedido.",
  providersTabDescription:
    "Armazene as credenciais de serviço externo no dispositivo e configure os modos de resposta que pretende utilizar.",
  webSearchTabDescription:
    "Configure o contexto web ao vivo opcional antes das respostas.",
  responseModes: "Seleção de modelo",
  aboutModelSelection: "Sobre a seleção do modelo",
  modelSelectionInfo:
    "Cada cartão de modelo torna-se uma escolha no ecrã inicial. Configure o seu fornecedor, modelo e nível de esforço opcional e, em seguida, mude de cartão para escolher que modelo responde a seguir.",
  responseModeItemTitle: ({ index }) => `Modelo ${index}`,
  addResponseMode: "Adicionar modelo",
  removeResponseMode: "Remover modelo",
  responseModesNoConfiguredProviders:
    "Adicione as credenciais primeiro. Os controlos de rota permanecem ocultos até que pelo menos um serviço compatível seja configurado.",
  useResponseMode: ({ mode }) => `Utilizar ${mode}`,
  chooseResponseModel: "Escolha um modelo",
  responseModelCount: ({ count }) => `${count} modelos disponíveis`,
  ulraMode: "Modo Supremo",
  ulraModeHomeLabel: "Mostrar o modo Supremo no ecrã inicial",
  ulraModeSettingsDescription:
    "Permite a deliberação entre vários modelos quando pelo menos dois modelos do ecrã inicial estão prontos.",
  ulraModeInfo:
    "O modo Supremo consulta separadamente cada modelo pronto no ecrã inicial. Em cada ronda, os modelos contestam a posição mais recente de cada participante; as rondas restantes são ignoradas após uma convergência unânime explícita. O modelo selecionado sintetiza as rondas concluídas com êxito, mantendo sempre a posição mais recente de cada modelo. A deliberação é partilhada com todos os fornecedores envolvidos.",
  ulraModeRounds: "Rondas de revisão",
  ulraModeCallEstimate: ({ count }) =>
    `Até ${count} chamadas a modelos por mensagem com a configuração atual.`,
  ulraModeThresholdWarning:
    "Mais de 4 modelos ou 3 rondas podem demorar muito, consumir muitos tokens e atingir limites de contexto ou de pedidos dos fornecedores. Isto é apenas um aviso.",
  ulraModeFirstUseTitle: "Ativar o modo Supremo?",
  ulraModeFirstUseMessage: ({ calls, models, rounds }) =>
    `Com ${models} modelos e até ${rounds} rondas de revisão, uma mensagem pode fazer até ${calls} chamadas a modelos. Pode demorar muito mais, custar bastante mais e partilhar a deliberação com todos os fornecedores envolvidos.`,
  ulraModeHighRiskTitle: "Execução extensa do modo Supremo",
  ulraModeHighRiskMessage: ({ calls, models, rounds }) =>
    `${models} modelos e ${rounds} rondas de revisão podem fazer até ${calls} chamadas a modelos. Isto pode demorar muito, usar muitos tokens e atingir limites dos fornecedores. Continuar mesmo assim?`,
  ulraModeEnableAction: "Ativar",
  ulraModeNeedsTwoModels:
    "O modo Supremo precisa de pelo menos dois modelos prontos no ecrã inicial.",
  ulraModeAllModelsFailed:
    "Todos os modelos do modo Supremo falharam antes de ser possível sintetizar uma resposta.",
  ulraModePartialFailureNotice: ({ failed, succeeded }) =>
    `${failed} chamadas internas a modelos falharam; a resposta final usou ${succeeded} contributos bem-sucedidos.`,
  sttTabDescription:
    "Controle a forma como a fala é capturada e qual o back-end que transforma o áudio em texto antes de este chegar ao modelo.",
  ttsTabDescription:
    "Controle quando as respostas começam a ser faladas e qual o back-end que lida com a saída falada.",
  brief: "Breve",
  briefDescription:
    "Mantenha a resposta curta. Utilize o número mínimo de frases necessárias para responder completamente ao utilizador.",
  normal: "Normal",
  normalDescription:
    "Procure um comprimento de resposta equilibrado. Cubra os pontos importantes sem arrastar a resposta.",
  thorough: "Minucioso",
  thoroughDescription:
    "Vá a fundo e seja abrangente. Inclua nuances, detalhes, compensações e o raciocínio que importa.",
  professional: "Profissional",
  professionalDescription:
    "Fale como um consultor sénior a apresentar um relatório a um cliente. Linguagem precisa, sem calão, comedida e com autoridade.",
  casual: "Casual",
  casualDescription:
    "Fale como um amigo inteligente numa cafetaria. Descontraído, natural, conversador. As contrações não são problema, as digressões também não.",
  nerdy: "Nerd",
  nerdyDescription:
    "Fale como um especialista entusiasta que adora ir a fundo. Utilize a terminologia técnica livremente, entusiasme-se com os detalhes e presuma que o utilizador consegue acompanhar.",
  concise: "Conciso",
  conciseDescription:
    "Seja o mais breve possível e ao mesmo tempo completo. Sem preâmbulo, sem preenchimento, apenas a resposta. Pense no estilo telegrama.",
  socratic: "Socrático",
  socraticDescription:
    "Desafie o pensamento do utilizador. Faça contra-perguntas, ofereça perspetivas alternativas, não se limite a confirmar o que disseram. Seja um sparring, não uma máquina de sim.",
  eli5: "ELI5",
  eli5Description:
    "Explique tudo da forma mais simples possível. Utilize analogias, linguagem quotidiana, zero jargão. Não presuma qualquer conhecimento prévio sobre qualquer assunto.",
  useProvider: ({ provider }) => `Utilizar ${provider}`,
  createApiKey: "Credenciais",
  apiKey: "Chave API",
  aboutThisProvider: "Sobre este fornecedor",
  openRouterOnboardingTitle: "Uma chave, vários fornecedores",
  openRouterOnboardingDescription:
    "Crie uma chave OpenRouter dedicada, cole-a abaixo e utilize modelos baseados em snapshots de vários fornecedores sem substituir qualquer ligação direta.",
  openRouterOnboardingRoute:
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
    "A validação ao vivo ainda não está ligada para este fornecedor. Guarde a chave aqui e verifique-a durante a utilização real.",
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
    "Molde a orientação oculta que o modelo recebe antes de cada resposta.",
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
    "Adicione instruções após o prompt de sistema global para esta conversa.",
  conversationThinkingInstructionsPlaceholder:
    "Por exemplo: Desafie as minhas suposições e utilize exemplos concretos.",
  ttsInstructions: "Instruções de entrega da fala",
  ttsInstructionsDescription:
    "Oriente o tom, o ritmo, o sotaque ou a apresentação utilizados pelos modelos de fala compatíveis.",
  conversationTtsInstructionsDescription:
    "Adicione instruções de entrega após as instruções de fala globais para esta conversa.",
  ttsInstructionsPlaceholder:
    "Por exemplo: fale de forma calorosa, clara e a um ritmo descontraído.",
  ttsInstructionsUnsupported:
    "A rota de fala atual não suporta instruções de entrega.",
  conversationVoiceDescription: ({ route }) =>
    `Escolha a voz utilizada por ${route} nesta conversa.`,
  scrollToLatest: "Deslocar até à última mensagem",
  conversationTitleGenerate: "Gerar título automaticamente",
  conversationTitleGenerating: "A gerar título…",
  conversationTitleGenerated: "Conversa renomeada.",
  conversationTitleNeedsContent:
    "Inicie uma conversa antes de gerar um título.",
  conversationTitleNeedsProvider:
    "Configure o modelo selecionado antes de gerar um título.",
  conversationTitleGenerationFailed: "Não foi possível gerar o título da conversa.",
  conversationTitleGenerationTimedOut:
    "A geração do título demorou muito tempo. Por favor, tente novamente.",
  inputMode: "Modo de entrada",
  voiceInput: "Entrada de voz",
  pushToTalk: "Premir para falar",
  pushToTalkDescription:
    "Segure o botão principal enquanto fala e solte para enviar.",
  toggleToTalk: "Tocar para falar",
  toggleToTalkDescription:
    "Toque uma vez para iniciar a gravação e toque novamente quando terminar.",
  driveSession: "Sessão Drive",
  driveSessionDescription:
    "Quando a continuação automática está ativada, a gravação começa após cada resposta falada. Toque no botão principal quando terminar de falar.",
  stopDriveSession: "Pausar automático",
  repeatDriveReply: "Repetir última",
  continueDriveSession: "Retomar automático",
  speechToText: "Fala para Texto",
  appNative: "Reconhecimento do Sistema",
  nativeSttDescription:
    "Utilize o reconhecedor de fala do sistema operativo. Dependendo das definições do dispositivo, o reconhecimento pode ser executado no dispositivo ou através do serviço do sistema. Nenhuma chave de fornecedor é necessária.",
  provider: "Fornecedor",
  webSearchProvider: "Fornecedor de pesquisa na Web",
  webSearchProviderMissingHint:
    "Configure pelo menos um serviço com capacidade de pesquisa em Credenciais para ativar aqui a fundamentação com contexto da web.",
  webSearchModelHint: ({ model }) =>
    `Utiliza ${model} nos bastidores para fundamentar as respostas com contexto atual da web.`,
  webSearchHomeHint:
    "Utilize o botão de alternância do ecrã inicial para ativar ou desativar o contexto da web para este tópico.",
  settingsWebSearchCompactHint:
    "Opcionalmente, acrescente um novo contexto web antes de o modelo principal responder.",
  webSearchAdvanced: "Controlos de pesquisa avançada",
  expandAdvancedSearch: "Expandir os controlos de pesquisa avançada",
  collapseAdvancedSearch: "Recolher controlos de pesquisa avançada",
  webSearchSetupNeeded: "Adicione credenciais para utilizar a pesquisa na web ao vivo.",
  webSearchEnabledDescription:
    "Novo contexto web é adicionado antes de o modelo responder.",
  webSearchDisabledDescription:
    "Utilize o contexto da web ao vivo para este tópico quando os factos atuais são importantes.",
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
    "Utilize um serviço externo configurado para transcrever a sua voz antes de esta ser enviada para a rota de resposta.",
  sttProvider: "Fornecedor STT",
  sttProviderEnabledHint:
    "Apenas os fornecedores ativados com suporte para transcrição aparecem aqui.",
  sttProviderMissingHint:
    "Adicione credenciais para um serviço com suporte STT para o escolher aqui.",
  nativeSttHint:
    "O reconhecimento do sistema funciona independentemente das chaves do seu fornecedor e pode ser processado no dispositivo ou pelo serviço de voz do sistema operativo.",
  replyPlayback: "Reprodução da resposta",
  sentencesArrive: "À chegada dos parágrafos",
  sentencesArriveDescription:
    "Comece a falar assim que um parágrafo completo estiver pronto.",
  fullReplyFirst: "Resposta completa primeiro",
  fullReplyFirstDescription:
    "Gere primeiro a resposta inteira e depois reproduza-a de uma só vez.",
  textToSpeech: "Texto para voz",
  spokenReplies: "Respostas faladas",
  spokenRepliesEnabledDescription:
    "Leia as respostas do assistente em voz alta quando estiver disponível uma via de voz.",
  spokenRepliesDisabledDescription:
    "Mantenha as respostas apenas em texto por enquanto. A sua rota preferida TTS fica guardada para mais tarde.",
  nativeTtsDescription:
    "Utilize o motor de fala do dispositivo para respostas faladas e amostras de voz.",
  kokoroTtsDescription:
    "Utilize uma voz neural muito mais natural, totalmente neste dispositivo. O texto das respostas faladas é sintetizado localmente, sem chave de fornecedor de fala nem custos de utilização.",
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
    "Transfira e verifique o modelo antes de selecionar ou utilizar o Kokoro. Não é necessária nenhuma chave de fornecedor.",
  kokoroLanguageFallback:
    "Kokoro fala atualmente inglês e chinês simplificado aqui. Para outros idiomas de resposta selecionados, adicione uma rota alternativa explícita ou a fala será interrompida com um erro.",
  kokoroRemoveTitle: "Remover o modelo Kokoro?",
  kokoroRemoveBody: ({ installedSize }) =>
    `Isto liberta cerca de ${installedSize} MB. Pode descarregar o modelo novamente a qualquer momento.`,
  removeKokoroModel: "Remover o modelo Kokoro",
  downloadKokoroModel: "Descarregar o modelo Kokoro",
  kokoroFallbackNeeded: ({ languages }) =>
    `É necessária uma rota alternativa explícita para: ${languages}.`,
  kokoroNoSelectedLanguages:
    "Selecione Inglês ou Chinês Simplificado em Idiomas de escuta para configurar uma voz Kokoro.",
  expandVoiceSettings: ({ language }) => `Expandir as definições de voz ${language}`,
  collapseVoiceSettings: ({ language }) =>
    `Recolher as definições de voz ${language}`,
  remove: "Remover",
  voiceOutputDescription:
    "Escolha o motor de fala, os idiomas de escuta e as amostras de voz para as respostas faladas.",
  localTts: "Local",
  localTtsDescription:
    "Utilize uma voz local descarregada correspondente para as respostas faladas.",
  providerTtsDescription:
    "Utilize o serviço configurado selecionado para respostas faladas.",
  ttsFallbackRoutes: "Rotas alternativas",
  ttsFallbackRoutesHint:
    "Opcional. Adicione apenas as rotas pretendidas, pela ordem em que devem ser tentadas. Assim que uma rota começa a falar, Mr Broccoli permanece nela durante o resto da resposta.",
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
    "Adicione credenciais para um serviço com suporte TTS para o escolher aqui.",
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
    "Não foi possível atualizar as vozes. A sua seleção atual permanece inalterada; pode ainda introduzir um ID de voz manualmente.",
  providerVoicesLoadFailedWithFallback:
    "Não foi possível carregar as vozes da conta. A voz integrada continua disponível.",
  providerVoicesErrorDetail: ({ detail }) => `Motivo: ${detail}`,
  elevenLabsVoicesReadPermissionHint:
    "Em ElevenLabs, edite esta chave API e ative Voices → Read e atualize aqui.",
  providerVoicesLoadingHint: ({ provider }) =>
    `Mr Broccoli carrega as vozes disponíveis automaticamente a partir de ${provider}.`,
  providerVoiceId: "ID de voz",
  providerVoiceIdPlaceholder: "Introduza um ID de voz",
  providerVoiceIdFallbackHint:
    "A introdução manual permanece disponível quando a biblioteca de voz não pode ser carregada.",
  providerVoiceIdRequired: ({ provider }) =>
    `Atualize a biblioteca de voz ${provider} ou introduza um ID de voz antes de utilizar a saída de voz.`,
  qwenSpeechUnavailableInUs:
    "As rotas de voz Qwen atuais de Mr Broccoli não estão disponíveis na região dos EUA. Escolha Singapura ou Pequim para o discurso Qwen.",
  qwenApiRegion: "Região Qwen API",
  qwenRegionSingapore: "Singapura",
  qwenRegionUs: "EUA (Virgínia)",
  qwenRegionBeijing: "China (Pequim)",
  qwenRegionHint:
    "A região selecionada deve corresponder à região na qual esta chave API foi criada.",
  qwenRegionUsSpeechHint:
    "As chaves da região dos EUA suportam o chat e a pesquisa na web aqui. As rotas Qwen STT e TTS atuais do Mr Broccoli requerem uma chave de Singapura ou Pequim.",
  providerDefaultVoiceHint:
    "Este fornecedor utiliza atualmente a sua voz predefinida para as amostras e as respostas faladas.",
  listenLanguages: "Idiomas de escuta",
  listenLanguagesHint:
    "Escolha os idiomas de resposta que pretende que soem bem. Mr Broccoli tenta-os por esta ordem ao encaminhar a saída de voz.",
  listenLanguagesSelected: ({ count }) =>
    count === 1 ? "1 idioma selecionado" : `${count} idiomas selecionados`,
  localVoicePacks: "Pacotes de voz locais",
  localVoicePacksHint:
    "Cada língua mantém a sua própria voz local. Escolha a voz pretendida para esse idioma e descarregue apenas os pacotes do seu interesse.",
  localVoiceForLanguage: ({ languageLabel }) => `Voz para ${languageLabel}`,
  providerVoicePreviews: "Amostras de voz do fornecedor",
  providerVoicePreviewsHint:
    "Teste aqui a rota TTS atualmente selecionada com um texto de amostra separado para cada idioma de resposta.",
  nativeVoicePreviewSection: "Amostra de voz nativa",
  nativeVoicePreviewSectionHint:
    "Fala diretamente através do sintetizador de voz integrado do telefone para que possa compará-lo com as vozes configuradas do fornecedor.",
  nativeVoiceUnavailable:
    "Este dispositivo não reportou nenhuma voz nativa do sistema para amostra.",
  runtimeCompatibilityOverrides: "Compatibilidade em tempo de execução",
  runtimeCompatibilityOverridesDescription: ({ count }) =>
    `${count} configurações de modelo ou definição confirmadas como indisponíveis pelo fornecedor estão desativadas apenas neste dispositivo. O Mr Broccoli contorna-as automaticamente.`,
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
    "Ainda não há pedidos de fala recentes. Ouça uma amostra de voz ou reproduza uma resposta para ver aqui os detalhes do encaminhamento.",
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
    "Transferido, mas esta voz falhou a verificação local neste dispositivo. Transfira novamente ou escolha outra voz.",
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
  replyFailedHint: "Pode escolher outro modelo acima antes de tentar novamente.",
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
    `Adicione as credenciais para ${provider} em Definições antes de utilizar esta rota.`,
  configureCredentialsBeforeVoiceSession:
    "Adicione credenciais em Definições antes de iniciar uma sessão de voz.",
  endpointCredentialFormatInvalid: ({ provider }) =>
    `Para ${provider}, introduza o URL base do fornecedor e a chave API como https://your-endpoint.example.com|your-api-key.`,
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
    "Escolha uma rota STT configurada em Definições antes de iniciar uma sessão de voz.",
  chooseTtsBeforeSpokenReplies:
    "Escolha uma rota TTS configurada em Definições antes de utilizar respostas faladas.",
  stopSessionBeforeReplay:
    "Pare a sessão de voz ativa antes de reproduzir a última resposta.",
  couldntCatchThatTryAgain: "Não foi possível capturar isto, tente novamente.",
  couldntStartVoiceInput: "Não foi possível iniciar a entrada de voz.",
  couldntProcessVoiceInput: "Não foi possível processar a entrada de voz.",
  maxRecordingLengthReached:
    "Duração máxima de gravação atingida — envio o que tenho.",
  sttRecordingTooLarge: ({ provider, limit }) =>
    `Esta gravação é demasiado longa para a conversão de voz em texto ${provider} (máx. ${limit}). Experimente uma mensagem mais curta ou altere a conversão de voz em texto para reconhecimento do sistema.`,
  addProviderKeyToEnableProvider: ({ provider }) =>
    `Adicione as credenciais para ${provider} em Definições antes de utilizar esta rota.`,
  stopSessionBeforePreview:
    "Pare a sessão de voz ativa antes de ouvir uma amostra de voz.",
  chooseTtsToPreviewVoices:
    "Escolha uma rota TTS configurada em Definições para ouvir amostras de voz.",
  downloadSelectedLocalVoiceFirst: ({ languageLabel }) =>
    `Transfira primeiro a voz local ${languageLabel} selecionada.`,
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
  currentSetup: "Configuração atual",
  listeningToYourVoice: "A ouvir a sua voz",
  parsingYourVoiceInput: "A transformar a sua voz em texto",
  preparingRequest: "A preparar o seu pedido",
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
  speechInputRoute: ({ route }) => `Entrada de fala: ${route}`,
  replyModelRoute: ({ route }) => `Modelo de resposta: ${route}`,
  voiceOutputRoute: ({ route }) => `Saída de voz: ${route}`,
  fallbackVoiceOutputRoute: ({ route }) => `Saída de voz alternativa: ${route}`,
  conversation: "Conversa",
  conversationActions: "Ações da conversa",
  statusDetails: "Detalhes do estado",
  persistenceFailure:
    "Mr Broccoli não conseguiu guardar dados neste dispositivo. Mantenha a aplicação aberta e tente novamente; alterações recentes podem ser perdidas após a reinicialização.",
  show: "Mostrar",
  showTranscript: "Mostrar transcrição",
  hide: "Ocultar",
  copyThread: "Copiar Tópico",
  shareThread: "Partilhar tópico",
  reportResponse: "Denunciar esta resposta",
  reportResponseIntro: "Denúncia de resposta de IA do Mr Broccoli. Reveja o conteúdo, descreva o problema e envie esta denúncia ao programador.",
  repeatReply: "Repetir resposta",
  renameThread: "Renomear tópico",
  renameThreadHint:
    "Dê a esta conversa um título que possa encontrar rapidamente mais tarde.",
  threadTitle: "Título do tópico",
  noTranscriptYet: "Nenhuma transcrição ainda",
  previewTranscriptEmptyDescription:
    "Use voz ou texto para começar. A sua conversa aparecerá aqui.",
  noConversationYet: "Nenhuma conversa ainda",
  expandedTranscriptEmptyDescription:
    "Use voz ou texto para começar. Feche este ecrã quando quiser regressar ao palco principal.",
  transcriptSelectionHint:
    "Selecione qualquer texto de mensagem diretamente ou partilhe e copie mensagens individuais abaixo.",
  textMessagePlaceholder: "Introduza uma mensagem",
  sendTextMessage: "Enviar mensagem",
  showVoiceInput: "Mostrar entrada de voz",
  showTextInput: "Mostrar entrada de texto",
  usageStatsHiddenDescription:
    "Mantenha as estimativas de tokens fora da interface da transcrição.",
  usageStatsVisibleDescription:
    "Mostrar a utilização estimada de tokens para as respostas e os totais da conversa.",
  debugLogButton: "Botão Registo de depuração",
  debugLogButtonHiddenDescription:
    "Mantenha o botão REGISTO do ecrã inicial oculto, a menos que uma captura já esteja a ser executada.",
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
    "Adicione credenciais em Definições e escolha as rotas que pretende utilizar.",
  idle: "Ocioso",
  yourConversationAppearsHere: "A sua conversa aparece aqui",
  defaultTranscriptEmptyDescription:
    "Use voz ou texto para começar. Mr Broccoli manterá o tópico e responderá aqui.",
  delete: "Eliminar",
  deleteConversationConfirmationTitle: ({ title }) => `Eliminar “${title}”?`,
  deleteConversationConfirmationMessage:
    "Isto elimina permanentemente a conversa e todas as suas mensagens. Esta ação não pode ser anulada.",
  memory: "Memória",
  conversations: "Conversas",
  drawerSubtitle: "Salte entre tópicos ao vivo ou comece uma nova sala.",
  newSession: "Nova sessão",
  noSavedConversationsYet: "Ainda não há conversas guardadas",
  drawerEmptyDescription:
    "Comece a falar na vista principal e Mr Broccoli criará uma sessão automaticamente.",
  setupGuideTitle: "Configurar a aplicação",
  setupGuideSubtitle: "Adicione credenciais e escolha rotas em Definições.",
  fastestStartPreset: "Configuração mínima",
  fastestStartDescription:
    "Utilize a fala do dispositivo quando disponível e configure apenas a rota de resposta necessária.",
  fullVoicePreset: "Voz configurada",
  fullVoiceDescription:
    "Utilize serviços configurados para respostas, transcrição e saída falada quando os escolher.",
  setupGuideNote:
    "A seguir abriremos as Definições para que possa colar e validar as credenciais.",
  useThisSetup: "Utilizar esta configuração",
  notNow: "Agora não",
  setupGuideIntroTitle: "Como funciona o Mr Broccoli",
  setupGuideIntroBody:
    "Mr Broccoli começa em branco. Adicione credenciais para serviços externos que já utiliza e escolha como as respostas, a entrada de fala, a saída falada e o contexto Web opcional serão encaminhados.",
  setupGuideIntroNote:
    "Após a configuração, utilize o controlo de voz principal para iniciar e interromper uma conversa. A transcrição atual permanece disponível no ecrã inicial e cada rota pode ser alterada posteriormente nas Definições.",
  setupGuideProviderTitle: "Adicionar credenciais",
  setupGuideProviderBody:
    "Escolha o serviço externo que pretende configurar e cole as credenciais com acesso de resposta.",
  setupGuideProviderPickerLabel: "Serviço de resposta",
  setupGuideSelectProvider: "Selecione um fornecedor",
  setupGuideSelectProviderFirst: "Selecione primeiro um fornecedor.",
  setupGuideApiKeyLabel: "Chave API",
  setupGuideApiKeyPlaceholder: "Colar credenciais",
  setupGuideContinue: "Continuar",
  setupGuideOpenSettings: "Abrir Definições",
  setupGuideBack: "Voltar",
  setupGuideValidateKey: "Validar chave",
  setupGuideApiKeyRequiredOrCancel:
    "Adicione uma chave API para continuar ou cancele o guia de configuração.",
  setupGuideProviderAndApiKeyRequiredOrCancel:
    "Escolha um fornecedor e adicione uma chave API para continuar ou cancele o guia de configuração.",
  setupGuideProviderKeyNeedsLlmAccess: ({ provider }) =>
    `Estas credenciais ${provider} não permitem pedidos de resposta.`,
  setupGuideKokoroTitle: "Adicione uma voz natural no dispositivo",
  setupGuideKokoroBody: ({ size }) =>
    `Opcional: descarregue Kokoro (cerca de ${size} MB) para obter respostas faladas muito mais naturais, sem fornecedor de voz ou encargos de utilização.`,
  setupGuideKokoroLanguageNote:
    "Este modelo fala atualmente inglês e chinês simplificado. Configure quaisquer rotas alternativas desejadas posteriormente nas definições de Fala.",
  setupGuideKokoroDownload: "Transferir o Kokoro",
  setupGuideUseKokoro: "Utilizar o Kokoro para respostas faladas",
  setupGuideUseKokoroSummary:
    "Mantenha a síntese no telefone sempre que o idioma de resposta for compatível.",
  setupGuideSkipKokoro: "Saltar por enquanto",
  setupGuideVoiceTestTitle: "Teste a sua configuração",
  setupGuideVoiceTestBody:
    "Diga uma frase curta. Mr Broccoli testará o acesso ao microfone, a transcrição, a rota de resposta configurada e a saída falada quando uma rota de voz aceitável estiver disponível.",
  setupGuideVoiceTestNoInputBody:
    "A entrada de voz não está disponível nesta configuração. Continue a rever as rotas detetadas e ajuste as definições de fala mais tarde, se necessário.",
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
    "Aqui está a rota que Mr Broccoli irá utilizar com a sua configuração atual.",
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
    "Experimente um título, rota, modelo ou frase diferente da transcrição.",
  memoryModalTitle: "Memória de conversa",
  memoryModalDescription:
    "Este é o resumo compacto que o Mr Broccoli transporta consigo quando um tópico fica suficientemente longo para comprimir os turnos mais antigos.",
  memorySummary: "Resumo guardado",
  memorySummaryEmpty:
    "Ainda não há memória compacta. Quando este tópico se tornar mais longo, os turnos mais antigos serão resumidos aqui.",
  summarizedTurnsCount: ({ count }) =>
    Number(count) === 1 ? "1 turno resumido" : `${count} turnos resumidos`,
  copyMemory: "Copiar memória",
  forgetMemory: "Esquecer memória",
  memoryCopied: "Memória copiada.",
  memoryCleared: "Memória da conversa apagada.",
  noConversationToManageYet: "Ainda não há memória da conversa disponível.",
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
  pleaseWait: "Por favor, aguarde",
  yourTurn: "A sua vez",
  keepPressing: "Continue a pressionar",
  tapWhenDone: "Toque quando terminar",
  speechPaused: "A fala está pausada",
  pausePlaybackUnavailable:
    "Esta rota de voz não pode ser colocada em pausa. Pare ou mude para a saída de voz do fornecedor.",
  holdToSpeak: "Segure para falar",
  tapToSpeak: "Toque para falar",
  tapAgainToSend: "Toque novamente para enviar",
  waitingForReply: "A aguardar resposta",
  parsingYourVoice: "A analisar a sua voz",
  providerConfiguredInSettings: ({ provider }) =>
    `${provider} não está configurado em Definições.`,
  providerNetworkError: ({ provider, action }) =>
    `Não foi possível aceder a ${provider} para ${action}. Verifique a ligação e tente novamente.`,
  providerAuthError: ({ provider, action }) =>
    `${provider} rejeitou as credenciais para ${action}. Verifique a chave API e as permissões.`,
  providerRateLimitError: ({ provider, action }) =>
    `${provider} está a limitar os pedidos de ${action} neste momento. Tente novamente dentro de alguns instantes.`,
  providerCreditsRequired: ({ provider, action }) =>
    `${provider} precisa de crédito API suficiente para ${action}. Verifique o saldo da conta e o limite de gastos da chave.`,
  providerTimeoutError: ({ provider, action }) =>
    `${provider} demorou muito tempo durante ${action}. Tente novamente.`,
  providerTemporaryError: ({ provider, action }) =>
    `${provider} teve um problema temporário durante ${action}. Tente novamente em breve.`,
  providerEmptyReplyError: ({ provider }) =>
    `${provider} terminou sem devolver resposta. Tente novamente.`,
  providerIncompleteReplyError: ({ provider }) =>
    `A resposta de ${provider} terminou antes de estar concluída. Tente novamente.`,
  providerContextTooLong: ({ provider }) =>
    `${provider} rejeitou a resposta porque a conversa se tornou demasiado longa. Inicie um novo tópico ou encurte o pedido.`,
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
    "Escolha um fornecedor de conversão de texto em voz em Definições.",
  ttsNotSupportedYet: ({ provider }) => `${provider} TTS ainda não é compatível.`,
  ttsError: ({ provider, status, errorText }) =>
    `Erro ${provider} TTS (${status}): ${errorText}`,
  ttsReplyTooLong: ({ provider }) =>
    `A saída de voz ${provider} rejeitou a resposta por ser demasiado longa.`,
  ttsTimeout: ({ provider }) => `A saída de voz ${provider} demorou muito tempo.`,
  sttTimeout: ({ provider }) =>
    `A transcrição da fala ${provider} demorou muito tempo.`,
  sttFileSizeLimitExceeded: ({ provider, model, limit }) =>
    `${provider} ${model} apenas aceita gravações até ${limit}. Utilize um clipe mais curto ou troque os modelos STT.`,
  voiceInputCaptureIncomplete:
    "A entrada de voz não pôde ser captada corretamente. Por favor, tente novamente.",
  ttsDidNotReturnAudio: ({ provider }) =>
    `${provider} TTS não devolveu áudio.`,
  nativeSttHandledInApp: "O STT do sistema é tratado diretamente na aplicação.",
  chooseSpeechToTextProviderInSettings:
    "Escolha um fornecedor de voz para texto em Definições.",
  sttNotSupportedYet: ({ provider }) => `${provider} STT ainda não é compatível.`,
  providerNotWiredUpYet: ({ provider }) => `${provider} ainda não está ligado.`,
  you: "Você",
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
