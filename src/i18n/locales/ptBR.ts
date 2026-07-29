import type { TranslationDictionary } from "../types";

export const ptBR = {
  appName: "Sr. Brócolis",
  retry: "Tentar novamente",
  dismiss: "Fechar",
  done: "Feito",
  aboutSetting: ({ setting }) => `Sobre ${setting}`,
  unavailable: "Indisponível",
  selection: "Seleção",
  chooseCompatibleProviderFirst: "Escolha primeiro um provedor compatível",
  settings: "Configurações",
  all: "Todos",
  firstRun: "Primeiro acesso",
  instructions: "Instruções",
  providers: "Provedores",
  webSearch: "Pesquisa na Web",
  stt: "STT",
  tts: "TTS",
  ui: "UI",
  settingsRuntimeReadiness: "Preparação para tempo de execução",
  settingsReadinessThink: "Pensar",
  settingsReadinessListen: "Ouvir",
  settingsReadinessSpeak: "Falar",
  settingsReadinessSearch: "Procurar",
  settingsReadinessReady: "Preparar",
  settingsReadinessNeedsAttention: "Atenção",
  settingsReadinessBroken: "Quebrado",
  settingsReadinessOff: "Desligado",
  settingsConnections: "Conexões",
  settingsThinking: "Pensamento",
  settingsListening: "Audição",
  settingsSpeaking: "Falando",
  settingsSearch: "Procurar",
  settingsAppDiagnostics: "Aplicativo e diagnóstico",
  settingsGuidedSetup: "Configuração guiada",
  settingsGuidedSetupSummary:
    "Revise as conexões e teste a rota de voz completa.",
  setupGuideShowInSettings: "Mostrar configuração guiada em Configurações",
  setupGuideShowInSettingsSummary:
    "Mostre ou oculte o atalho de configuração guiada na visão geral das configurações.",
  settingsConnectionsSummary: "Chaves, validação e recursos do provedor.",
  settingsThinkingSummary: "Cartões iniciais, modelos, esforço e prompt do sistema.",
  settingsListeningSummary: "Modo de entrada e roteamento de voz para texto.",
  settingsSpeakingSummary: "Respostas faladas, reprodução, vozes e visualizações.",
  settingsSearchSummary: "Provedor de pesquisa na Web e controles de qualidade de pesquisa.",
  settingsAppDiagnosticsSummary:
    "Tema, idioma, uso, logs de depuração e atividades recentes.",
  settingsBackToOverview: "Voltar à visão geral",
  settingsOpenSection: ({ section }) => `Abra ${section}`,
  theme: "Tema",
  language: "Linguagem",
  recognitionLanguage: "Idioma de reconhecimento",
  recognitionLanguageHint:
    "Escolha um idioma para melhorar o reconhecimento ou deixe o dispositivo ou provedor detectá-lo automaticamente.",
  automaticLanguage: "Automático",
  speechLanguageUnsupportedByProvider: ({ provider, language }) =>
    `${provider} não oferece suporte oficial a ${language} nesta rota de voz.`,
  usageStats: "Estatísticas de uso",
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
  ukrainian: "ucraniano",
  hindi: "hindi",
  spanish: "Espanhol",
  french: "Francês",
  italian: "italiano",
  portuguese: "Português",
  portugueseBrazil: "Português (Brasil)",
  russian: "Russo",
  simplifiedChinese: "Chinês simplificado",
  arabic: "Árabe",
  japanese: "Japonês",
  hungarian: "Húngaro",
  czech: "Tcheco",
  polish: "Polonês",
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
  languageCoverage: ({ note }) => `Cobertura de idioma: ${note}`,
  recordingLimits: ({ note }) => `Limites de gravação: ${note}`,
  catalogProviderPricingSummary: ({ summary }) => `Preços: ${summary}`,
  replyGenerationAction: "geração de resposta",
  speechTranscriptionAction: "transcrição de fala",
  instructionsTabDescription:
    "Molde a orientação oculta que orienta o assistente antes que qualquer provedor veja a solicitação.",
  providersTabDescription:
    "Armazene credenciais de serviço externo no dispositivo e configure os modos de resposta que deseja usar.",
  webSearchTabDescription:
    "Configure o contexto da web ao vivo opcional antes das respostas.",
  responseModes: "Seleção de modelo",
  aboutModelSelection: "Sobre a seleção do modelo",
  modelSelectionInfo:
    "Cada modelo de cartão se torna uma escolha na tela inicial. Configure seu provedor, modelo e nível de esforço opcional e, em seguida, troque de cartão para escolher qual modelo responderá em seguida.",
  responseModeItemTitle: ({ index }) => `Modelo ${index}`,
  addResponseMode: "Adicionar modelo",
  removeResponseMode: "Remover modelo",
  responseModesNoConfiguredProviders:
    "Adicione credenciais primeiro. Os controles de rota permanecem ocultos até que pelo menos um serviço compatível seja configurado.",
  useResponseMode: ({ mode }) => `Usar ${mode}`,
  chooseResponseModel: "Escolha um modelo",
  responseModelCount: ({ count }) => `Modelos ${count} disponíveis`,
  ulraMode: "Modo Ultra",
  ulraModeHomeLabel: "Mostrar o modo Ultra na tela inicial",
  ulraModeSettingsDescription:
    "Permite a deliberação entre vários modelos quando pelo menos dois modelos da tela inicial estão prontos.",
  ulraModeInfo:
    "O modo Ultra consulta separadamente cada modelo pronto na tela inicial. Em cada rodada, todos os modelos analisam todas as respostas anteriores. O modelo selecionado sintetiza a resposta final. A deliberação é compartilhada com todos os provedores envolvidos.",
  ulraModeRounds: "Rodadas de revisão",
  ulraModeCallEstimate: ({ count }) =>
    `Cerca de ${count} chamadas de modelo por mensagem com a configuração atual.`,
  ulraModeThresholdWarning:
    "Mais de 4 modelos ou 3 rodadas podem levar muito tempo, consumir muitos tokens e atingir limites de contexto ou taxa dos provedores. Isto é apenas um aviso.",
  ulraModeFirstUseTitle: "Ativar o modo Ultra?",
  ulraModeFirstUseMessage: ({ calls, models, rounds }) =>
    `Com ${models} modelos e ${rounds} rodadas de revisão, uma mensagem pode fazer cerca de ${calls} chamadas de modelo. Pode demorar muito mais, custar bem mais e compartilhar a deliberação com todos os provedores envolvidos.`,
  ulraModeHighRiskTitle: "Execução Ultra extensa",
  ulraModeHighRiskMessage: ({ calls, models, rounds }) =>
    `${models} modelos e ${rounds} rodadas de revisão podem fazer cerca de ${calls} chamadas de modelo. Isso pode levar muito tempo, usar muitos tokens e atingir limites dos provedores. Continuar mesmo assim?`,
  ulraModeEnableAction: "Ativar",
  ulraModeNeedsTwoModels:
    "O modo Ultra precisa de pelo menos dois modelos prontos na tela inicial.",
  ulraModeAllModelsFailed:
    "Todos os modelos do modo Ultra falharam antes que uma resposta pudesse ser sintetizada.",
  ulraModePartialFailureNotice: ({ failed, succeeded }) =>
    `${failed} chamadas internas de modelo falharam; a resposta final usou ${succeeded} contribuições bem-sucedidas.`,
  sttTabDescription:
    "Controle como a fala é capturada e qual back-end transforma o áudio em texto antes que ele chegue ao modelo.",
  ttsTabDescription:
    "Controle quando as respostas começam a ser faladas e qual back-end lida com a saída falada.",
  brief: "Apresentação",
  briefDescription:
    "Mantenha a resposta precisa. Use o número mínimo de frases necessárias para responder completamente ao usuário.",
  normal: "Normal",
  normalDescription:
    "Procure um comprimento de resposta equilibrado. Cubra os pontos importantes sem arrastar a resposta.",
  thorough: "Minucioso",
  thoroughDescription:
    "Vá fundo e seja abrangente. Inclua nuances, detalhes, compensações e o raciocínio que importa.",
  professional: "Profissional",
  professionalDescription:
    "Fale como um consultor sênior informando um cliente. Linguagem precisa, sem gírias, comedida e autoritária.",
  casual: "Casual",
  casualDescription:
    "Fale como um amigo inteligente em uma cafeteria. Descontraído, natural, conversador. As contrações estão bem, as tangentes estão bem.",
  nerdy: "Nerd",
  nerdyDescription:
    "Fale como um especialista entusiasmado que adora ir fundo. Use a terminologia técnica livremente, fique atento aos detalhes e presuma que o usuário consegue acompanhar.",
  concise: "Conciso",
  conciseDescription:
    "Seja o mais breve possível e ao mesmo tempo completo. Sem preâmbulo, sem preenchimento, apenas a resposta. Pense no estilo telegrama.",
  socratic: "Socrático",
  socraticDescription:
    "Desafie o pensamento do usuário. Faça contra-perguntas, ofereça perspectivas alternativas, não apenas confirme o que eles disseram. Seja um sparring, não uma máquina de sim.",
  eli5: "ELI5",
  eli5Description:
    "Explique tudo da forma mais simples possível. Use analogias, linguagem cotidiana, zero jargão. Não presuma nenhum conhecimento prévio sobre qualquer assunto.",
  useProvider: ({ provider }) => `Usar ${provider}`,
  createApiKey: "Credenciais",
  apiKey: "Chave API",
  aboutThisProvider: "Sobre este provedor",
  openRouterOnboardingTitle: "Uma chave, vários provedores",
  openRouterOnboardingDescription:
    "Crie uma chave OpenRouter dedicada, cole-a abaixo e use modelos baseados em snapshots de vários provedores sem substituir qualquer conexão direta.",
  openRouterOnboardingRoute:
    "Caminho da solicitação: este dispositivo → OpenRouter → provedor upstream selecionado",
  openRouterKeys: "Chaves OpenRouter",
  providerStatusInvalid: "Inválido",
  providerStatusTesting: "Teste",
  providerStatusConfigured: "Configurado",
  providerStatusWorking: "Trabalhando",
  providerStatusNotTested: "Não testado",
  providerStatusNotSetup: "Não configurado",
  expandProvider: ({ provider }) => `Expanda ${provider}`,
  collapseProvider: ({ provider }) => `Recolher ${provider}`,
  testProviderKey: "Chave de teste",
  testAllCapabilities: "Teste tudo",
  apiTest: "Teste API",
  testProviderCapability: ({ capability }) => `Teste ${capability}`,
  test: "Teste",
  optional: "Opcional",
  providerCapability_llm: "Respostas",
  providerCapability_stt: "Entrada de fala",
  providerCapability_tts: "Saída de voz",
  providerCapability_search: "Pesquisa na web",
  providerCapability_voices: "Biblioteca de voz",
  providerValidationUnavailable:
    "A validação ao vivo ainda não está conectada para este provedor. Salve a chave aqui e verifique-a durante o uso real.",
  providerNeedsAttention: "precisa de atenção",
  catalogProviderLimitsSummary: ({ summary }) => `Limites: ${summary}`,
  catalogProviderRegionSummary: ({ summary }) => `Região: ${summary}`,
  validatingKey: "Validando...",
  showKey: "Mostrar chave",
  hideKey: "Ocultar chave",
  assistantInstructions: "Instruções do assistente",
  systemPrompt: "Alerta do sistema",
  aboutSystemPrompt: "Sobre o prompt do sistema",
  assistantInstructionsIntro:
    "Molde a orientação oculta que o modelo recebe antes de cada resposta.",
  baseInstructions: "Instruções básicas",
  assistantInstructionsPlaceholder: "Defina como o assistente deve se comportar.",
  assistantInstructionsHint:
    "Isso é sempre acrescentado antes da duração e do tom da resposta selecionados.",
  adaptiveLength: "Comprimento adaptativo",
  responseTone: "Tom de resposta",
  homeStyleChipLabel: ({ tone, length }) => `Estilo — ${tone} · ${length}`,
  styleSheetTitle: "Configurações de conversa",
  styleSheetSubtitle: "Forme respostas e fala apenas para esta conversa.",
  openStyleSheet: "Abrir configurações de conversa",
  conversationThinkingInstructions: "Instruções de pensamento",
  conversationThinkingInstructionsDescription:
    "Adicione instruções após o prompt do sistema global para esta conversa.",
  conversationThinkingInstructionsPlaceholder:
    "Por exemplo: Desafie minhas suposições e use exemplos concretos.",
  ttsInstructions: "Instruções de entrega de discurso",
  ttsInstructionsDescription:
    "Oriente o tom, o ritmo, o sotaque ou a entrega usados ​​por modelos de fala compatíveis.",
  conversationTtsInstructionsDescription:
    "Adicione instruções de entrega após as instruções de fala globais para esta conversa.",
  ttsInstructionsPlaceholder:
    "Por exemplo: fale de forma calorosa, clara e em um ritmo descontraído.",
  ttsInstructionsUnsupported:
    "A rota de fala atual não oferece suporte a instruções de entrega.",
  conversationVoiceDescription: ({ route }) =>
    `Escolha a voz usada por ${route} nesta conversa.`,
  scrollToLatest: "Role até a última mensagem",
  conversationTitleGenerate: "Gerar título automaticamente",
  conversationTitleGenerating: "Gerando título…",
  conversationTitleGenerated: "Conversa renomeada.",
  conversationTitleNeedsContent:
    "Inicie uma conversa antes de gerar um título.",
  conversationTitleNeedsProvider:
    "Configure o modelo selecionado antes de gerar um título.",
  conversationTitleGenerationFailed: "Não foi possível gerar o título da conversa.",
  conversationTitleGenerationTimedOut:
    "A geração do título demorou muito. Por favor, tente novamente.",
  inputMode: "Modo de entrada",
  voiceInput: "Entrada de voz",
  pushToTalk: "Empurre para falar",
  pushToTalkDescription:
    "Segure o botão principal enquanto fala e solte para enviar.",
  toggleToTalk: "Alternar para falar",
  toggleToTalkDescription:
    "Toque uma vez para iniciar a gravação e toque novamente quando terminar.",
  driveSession: "Sessão do Drive",
  driveSessionDescription:
    "Quando a continuação automática está ativada, a gravação começa após cada resposta falada. Toque no botão principal quando terminar de falar.",
  stopDriveSession: "Pausar automaticamente",
  repeatDriveReply: "Repetir por último",
  continueDriveSession: "Retomar automático",
  speechToText: "Fala para Texto",
  appNative: "Reconhecimento do Sistema",
  nativeSttDescription:
    "Use o reconhecedor de fala do sistema operacional. Dependendo das configurações do dispositivo, o reconhecimento pode ser executado no dispositivo ou por meio do serviço do sistema. Nenhuma chave de provedor é necessária.",
  provider: "Provedor",
  webSearchProvider: "Provedor de pesquisa na Web",
  webSearchProviderMissingHint:
    "Configure pelo menos um serviço com capacidade de pesquisa em Credenciais para habilitar o web grounding aqui.",
  webSearchModelHint: ({ model }) =>
    `Usa ${model} nos bastidores para aterramento na web ao vivo.`,
  webSearchHomeHint:
    "Use o botão de alternância da tela inicial para ativar ou desativar o aterramento da web para este tópico.",
  settingsWebSearchCompactHint:
    "Opcionalmente, acrescente um novo contexto da web antes que o modelo principal responda.",
  webSearchAdvanced: "Controles de pesquisa avançada",
  expandAdvancedSearch: "Expanda os controles de pesquisa avançada",
  collapseAdvancedSearch: "Recolher controles de pesquisa avançada",
  webSearchSetupNeeded: "Adicione credenciais para usar a pesquisa na web ao vivo.",
  webSearchEnabledDescription:
    "Novo contexto da web é adicionado antes que o modelo responda.",
  webSearchDisabledDescription:
    "Use o contexto da web ao vivo para este tópico quando os fatos atuais forem importantes.",
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
    `Esses controles ajustam como ${provider} reúne novo contexto antes da resposta.`,
  webSearchNoExtraControls: ({ provider }) =>
    `${provider} ainda não expõe controles extras de qualidade de pesquisa neste aplicativo.`,
  setWebSearchMode: ({ mode }) => `Defina o modo de pesquisa na web como ${mode}`,
  openWebSearchSettings: "Abra as configurações de pesquisa na web",
  providerSttDescription:
    "Use um serviço externo configurado para transcrever sua voz antes que ela seja enviada para a rota de resposta.",
  sttProvider: "Provedor STT",
  sttProviderEnabledHint:
    "Somente provedores habilitados com suporte para transcrição aparecem aqui.",
  sttProviderMissingHint:
    "Adicione credenciais para um serviço com suporte STT para escolhê-lo aqui.",
  nativeSttHint:
    "O reconhecimento do sistema funciona independentemente das chaves do seu provedor e pode ser processado no dispositivo ou pelo serviço de fala do sistema operacional.",
  replyPlayback: "Responder reprodução",
  sentencesArrive: "Chegam os parágrafos",
  sentencesArriveDescription:
    "Comece a falar assim que um parágrafo completo estiver pronto.",
  fullReplyFirst: "Resposta completa primeiro",
  fullReplyFirstDescription:
    "Gere a resposta inteira primeiro e depois reproduza-a de uma só vez.",
  textToSpeech: "Texto para fala",
  spokenReplies: "Respostas faladas",
  spokenRepliesEnabledDescription:
    "Leia as respostas do assistente em voz alta quando uma rota de voz estiver disponível.",
  spokenRepliesDisabledDescription:
    "Mantenha as respostas apenas em texto por enquanto. Sua rota TTS preferida fica salva para mais tarde.",
  nativeTtsDescription:
    "Use o mecanismo de fala do dispositivo para respostas faladas e visualização de voz.",
  kokoroTtsDescription:
    "Use uma voz neural muito mais natural neste dispositivo. O texto de resposta falado é sintetizado localmente, sem chave do provedor de fala ou cobrança de uso.",
  kokoroVoices: "Kokoro Vozes no dispositivo",
  kokoroVoicesHint: ({ size, installedSize }) =>
    `O modelo multilíngue baixa cerca de ${size} MB e ocupa cerca de ${installedSize} MB após a instalação.`,
  kokoroModel: "Modelo multilíngue Kokoro",
  kokoroChecking: "Verificando o modelo do dispositivo…",
  kokoroDownloading: ({ progress }) => `Baixando… ${progress}%`,
  kokoroExtracting: ({ progress }) => `Instalando… ${progress}%`,
  kokoroVerifying: "Verificando o mecanismo de voz…",
  kokoroInstalled: "Instalado e pronto neste dispositivo.",
  kokoroNotInstalled: "Download opcional. Nenhuma chave de provedor é necessária.",
  kokoroLanguageFallback:
    "Kokoro atualmente fala inglês e chinês simplificado aqui. Para outros idiomas de resposta selecionados, adicione uma rota alternativa explícita ou a fala será interrompida com um erro.",
  kokoroRemoveTitle: "Remover o modelo Kokoro?",
  kokoroRemoveBody: ({ installedSize }) =>
    `Isso libera cerca de ${installedSize} MB. Você pode baixar o modelo novamente a qualquer momento.`,
  removeKokoroModel: "Remova o modelo Kokoro",
  downloadKokoroModel: "Baixe o modelo Kokoro",
  kokoroFallbackNeeded: ({ languages }) =>
    `Uma rota de fallback explícita é necessária para: ${languages}.`,
  kokoroNoSelectedLanguages:
    "Selecione Inglês ou Chinês Simplificado em Ouvir Idiomas para configurar uma voz Kokoro.",
  expandVoiceSettings: ({ language }) => `Expanda as configurações de voz ${language}`,
  collapseVoiceSettings: ({ language }) =>
    `Recolher configurações de voz ${language}`,
  remove: "Remover",
  voiceOutputDescription:
    "Escolha o mecanismo de fala, os idiomas de audição e as visualizações de voz para respostas faladas.",
  localTts: "Local",
  localTtsDescription:
    "Use uma voz local baixada correspondente para respostas faladas.",
  providerTtsDescription:
    "Use o serviço configurado selecionado para respostas faladas.",
  ttsFallbackRoutes: "Rotas alternativas",
  ttsFallbackRoutesHint:
    "Opcional. Adicione apenas as rotas desejadas, na ordem em que devem ser tentadas. Assim que uma rota começa a falar, Sr. Brócolis permanece nela pelo resto da resposta.",
  ttsFallbackNone:
    "Nenhum substituto está configurado. Uma falha de voz será mostrada em seu lugar.",
  ttsFallbackPosition: ({ position, route }) => `${position}. ${route}`,
  addFallbackRoute: ({ route }) => `Adicionar substituto ${route}`,
  removeFallbackRoute: ({ route }) => `Remover substituto ${route}`,
  moveFallbackEarlier: ({ route }) => `Mova ${route} mais cedo`,
  moveFallbackLater: ({ route }) => `Mover ${route} mais tarde`,
  ttsProvider: "Provedor TTS",
  ttsProviderEnabledHint:
    "Somente provedores habilitados com suporte para resposta falada aparecem aqui.",
  ttsProviderMissingHint:
    "Adicione credenciais para um serviço com suporte TTS para escolhê-lo aqui.",
  localTtsOrderHint:
    "Somente rotas de fallback explicitamente configuradas são tentadas.",
  providerTtsOrderHint:
    "Somente rotas de fallback explicitamente configuradas são tentadas.",
  nativeTtsHint:
    "O TTS nativo usa a pilha de voz do sistema e não requer uma chave de provedor.",
  localTtsLanguageCoverageHint:
    "Atualmente, os pacotes locais cobrem inglês, alemão, chinês simplificado, espanhol, português, hindi, francês e italiano.",
  ttsVoice: "Voz TTS",
  refresh: "Atualizar",
  providerVoiceDirectory: ({ provider }) => `Biblioteca de voz ${provider}`,
  refreshProviderVoices: ({ provider }) => `Atualizar vozes ${provider}`,
  providerVoicesAvailable: ({ count, provider }) =>
    `${count} ${Number(count) === 1 ? "voz" : "vozes"} disponível em ${provider}.`,
  providerVoicesLoadFailed:
    "Não foi possível atualizar as vozes. Sua seleção atual permanece inalterada; você ainda pode inserir um ID de voz manualmente.",
  providerVoicesLoadFailedWithFallback:
    "Não foi possível carregar as vozes da conta. A voz integrada permanece disponível.",
  providerVoicesErrorDetail: ({ detail }) => `Motivo: ${detail}`,
  elevenLabsVoicesReadPermissionHint:
    "Em ElevenLabs, edite esta chave API e ative Voices → Read e atualize aqui.",
  providerVoicesLoadingHint: ({ provider }) =>
    `Sr. Brócolis carrega vozes disponíveis automaticamente de ${provider}.`,
  providerVoiceId: "ID de voz",
  providerVoiceIdPlaceholder: "Insira um ID de voz",
  providerVoiceIdFallbackHint:
    "A entrada manual permanece disponível quando a biblioteca de voz não pode ser carregada.",
  providerVoiceIdRequired: ({ provider }) =>
    `Atualize a biblioteca de voz ${provider} ou insira um ID de voz antes de usar a saída de voz.`,
  qwenSpeechUnavailableInUs:
    "As rotas de fala Qwen atuais de Sr. Brócolis não estão disponíveis na região dos EUA. Escolha Singapura ou Pequim para o discurso Qwen.",
  qwenApiRegion: "Região Qwen API",
  qwenRegionSingapore: "Cingapura",
  qwenRegionUs: "EUA (Virgínia)",
  qwenRegionBeijing: "China (Pequim)",
  qwenRegionHint:
    "A região selecionada deve corresponder à região na qual esta chave API foi criada.",
  qwenRegionUsSpeechHint:
    "As chaves da região dos EUA suportam bate-papo e pesquisa na web aqui. As rotas Qwen STT e TTS atuais de Sr. Brócolis exigem uma chave de Cingapura ou Pequim.",
  providerDefaultVoiceHint:
    "Este provedor atualmente usa sua voz padrão para visualização e respostas faladas.",
  listenLanguages: "Ouvir idiomas",
  listenLanguagesHint:
    "Escolha os idiomas de resposta que você deseja que soem bem. Sr. Brócolis tenta-os nesta ordem ao rotear a saída de voz.",
  listenLanguagesSelected: ({ count }) =>
    count === 1 ? "1 idioma selecionado" : `Idiomas ${count} selecionados`,
  localVoicePacks: "Pacotes de voz locais",
  localVoicePacksHint:
    "Cada idioma mantém sua própria voz local. Escolha a voz desejada para esse idioma e baixe apenas os pacotes de seu interesse.",
  localVoiceForLanguage: ({ languageLabel }) => `Voz para ${languageLabel}`,
  providerVoicePreviews: "Visualizações de voz do provedor",
  providerVoicePreviewsHint:
    "Teste a rota TTS atualmente selecionada aqui com um texto de visualização separado para cada idioma de resposta.",
  nativeVoicePreviewSection: "Visualização de voz nativa",
  nativeVoicePreviewSectionHint:
    "Ele fala diretamente através do sintetizador de voz integrado do telefone para que você possa compará-lo com as vozes configuradas do provedor.",
  nativeVoiceUnavailable:
    "Este dispositivo não relatou nenhuma voz nativa do sistema para visualização.",
  speechDiagnostics: "Atividade de fala recente",
  speechDiagnosticsHint:
    "Mostra as últimas solicitações de fala, a rota solicitada, a rota realmente usada e qualquer motivo de fallback.",
  clearSpeechDiagnostics: "Limpar atividade de fala recente",
  speechDiagnosticsEmpty:
    "Ainda não há solicitações de discurso recentes. Visualize uma voz ou reproduza uma resposta para ver os detalhes do roteamento aqui.",
  clearSpeechDiagnosticsConfirmationTitle: "Limpar atividade de fala recente?",
  clearSpeechDiagnosticsConfirmationMessage:
    "Isso remove todos os diagnósticos de roteamento de fala capturados. Esta ação não pode ser desfeita.",
  speechDiagnosticSourceConversation: "Resposta à conversa",
  speechDiagnosticSourceRepeat: "Repetir resposta",
  speechDiagnosticSourcePreview: "Visualização de voz",
  speechDiagnosticSourceUnknown: "Solicitação de fala",
  speechDiagnosticRouteLine: ({ requested, actual }) =>
    `Solicitado: ${requested} -> Real: ${actual}`,
  speechDiagnosticStageLine: ({ stage }) => `Última etapa: ${stage}`,
  speechDiagnosticLanguageLine: ({ languageLabel }) =>
    `Idioma: ${languageLabel}`,
  speechDiagnosticProviderLine: ({ provider }) => `Provedor: ${provider}`,
  speechDiagnosticVoiceLine: ({ voice }) => `Voz: ${voice}`,
  localTtsPackReady: "Instalado neste dispositivo.",
  localTtsPackBroken:
    "Transferido, mas esta voz falhou na verificação local neste dispositivo. Baixe novamente ou escolha outra voz.",
  localTtsPackMissing:
    "Ainda não instalado. A nuvem TTS ou a voz do sistema serão usadas até você fazer o download.",
  localTtsUnsupportedLanguageFallback:
    "Um pacote local ainda não está disponível para este idioma. A nuvem TTS ou a voz do sistema cuidarão disso.",
  downloadingLocalTtsPack: ({ progress }) =>
    `Baixando pacote local... ${progress}%`,
  download: "Download",
  downloadingShort: "Carregando...",
  voicePreviewText: "Texto de visualização de voz",
  voicePreviewPlaceholder: "Digite uma frase para ouvir essa voz.",
  voicePreviewHint:
    "Usa o back-end de voz de resposta atualmente selecionado sem enviar nada ao modelo de idioma.",
  previewVoice: "Visualizar voz",
  generatingPreview: "Gerando visualização...",
  playingPreview: "Reproduzindo visualização...",
  systemVoice: "Voz do sistema",
  spokenRepliesOff: "Somente texto",
  noTtsProvider: "Nenhum provedor TTS",
  nothingToCopyYet: "Nada para copiar ainda.",
  couldntCopyText: "Não foi possível copiar esse texto.",
  nothingToShareYet: "Nada para compartilhar ainda.",
  couldntShareText: "Não foi possível compartilhar esse texto.",
  couldntReplayReply: "Não foi possível reproduzir essa resposta.",
  replyFailed: "Falha na resposta",
  retryReply: "Tentar responder novamente",
  replyFailedHint: "Você pode escolher outro modelo acima antes de tentar novamente.",
  spokenReplyFailed: "A resposta foi salva, mas não pôde ser falada.",
  retrySpeech: "Tentar novamente a fala",
  openSpeakingSettings: "Configurações de fala",
  messageCopied: "Mensagem copiada.",
  noConversationToCopyYet: "Nenhuma conversa para copiar ainda.",
  noConversationToShareYet: "Nenhuma conversa para compartilhar ainda.",
  noReplyToRepeatYet: "Nenhuma resposta para repetir ainda.",
  threadCopied: "Tópico copiado.",
  threadRenamed: "Tópico renomeado.",
  threadPinned: "Tópico fixado.",
  threadUnpinned: "Tópico solto.",
  addProviderKeyToUseProvider: ({ provider }) =>
    `Adicione credenciais para ${provider} em Configurações antes de usar esta rota.`,
  configureCredentialsBeforeVoiceSession:
    "Adicione credenciais em Configurações antes de iniciar uma sessão de voz.",
  endpointCredentialFormatInvalid: ({ provider }) =>
    `Para ${provider}, insira o URL base do provedor e a chave API como https://your-endpoint.example.com|your-api-key.`,
  speechRecognitionUnavailableOnDevice:
    "O reconhecimento de fala não está disponível neste dispositivo.",
  debugLogLabel: "REGISTRO",
  debugLogCaptureStarted: "O registro de depuração foi iniciado.",
  debugLogCaptureStopped: ({ entryCount, fileName }) =>
    `Log de depuração salvo como ${fileName} e copiado para a área de transferência (entradas ${entryCount}).`,
  debugLogCaptureStoppedNoClipboard: ({ entryCount, fileName }) =>
    `Log de depuração salvo como ${fileName} (entradas ${entryCount}).`,
  debugLogCaptureRecovered: ({ entryCount, fileName }) =>
    `Log de depuração anterior ${fileName} recuperado e copiado para a área de transferência (entradas ${entryCount}).`,
  debugLogCaptureRecoveredNoClipboard: ({ entryCount, fileName }) =>
    `Log de depuração anterior ${fileName} recuperado (entradas ${entryCount}).`,
  debugLogCaptureFailed: "Não foi possível salvar o log de depuração.",
  chooseSttBeforeVoiceSession:
    "Escolha uma rota STT configurada em Configurações antes de iniciar uma sessão de voz.",
  chooseTtsBeforeSpokenReplies:
    "Escolha uma rota TTS configurada em Configurações antes de usar respostas faladas.",
  stopSessionBeforeReplay:
    "Pare a sessão de voz ativa antes de reproduzir a última resposta.",
  couldntCatchThatTryAgain: "Não foi possível capturar isso, tente novamente.",
  couldntStartVoiceInput: "Não foi possível iniciar a entrada de voz.",
  couldntProcessVoiceInput: "Não foi possível processar a entrada de voz.",
  maxRecordingLengthReached:
    "Duração máxima de gravação atingida — enviando o que tenho.",
  sttRecordingTooLarge: ({ provider, limit }) =>
    `Essa gravação é muito longa para conversão de fala em texto ${provider} (máx. ${limit}). Experimente uma mensagem mais curta ou mude a conversão de fala em texto para reconhecimento do sistema.`,
  addProviderKeyToEnableProvider: ({ provider }) =>
    `Adicione credenciais para ${provider} em Configurações antes de usar esta rota.`,
  stopSessionBeforePreview:
    "Pare a sessão de voz ativa antes de visualizar uma voz.",
  chooseTtsToPreviewVoices:
    "Escolha uma rota TTS configurada em Configurações para visualizar vozes.",
  downloadSelectedLocalVoiceFirst: ({ languageLabel }) =>
    `Baixe primeiro a voz local ${languageLabel} selecionada.`,
  couldntPreviewVoice: "Não foi possível visualizar a voz.",
  spokenRepliesDisabled: "As respostas faladas estão desativadas nas configurações.",
  providerVoiceFallback:
    "Falha na rota de voz configurada. Mudou esta resposta para uma voz substituta.",
  localVoiceFallback:
    "A voz local não estava disponível. Mudou esta resposta para uma voz substituta.",
  localTtsPackInstalled: ({ languageLabel }) =>
    `Pacote de voz local ${languageLabel} instalado.`,
  localTtsPackInstallFailed: "Não foi possível instalar o pacote de voz local.",
  clear: "Claro",
  voiceOutput: "Saída de voz",
  currentSetup: "Configuração atual",
  listeningToYourVoice: "Ouvindo sua voz",
  parsingYourVoiceInput: "Transformando sua voz em texto",
  preparingRequest: "Preparando seu pedido",
  searchingTheWeb: "Pesquisando na web por um novo contexto",
  waitingForProvider: ({ provider }) => `Esperando por ${provider}`,
  preparingVoiceWithProvider: ({ provider }) =>
    `Preparando voz com ${provider}`,
  deepThinkingReassurance: "Boas respostas levam um momento…",
  thinkingElapsed: ({ detail, seconds }) => `${detail} · ${seconds}s`,
  speakingBackToYou: "Falando de volta para você",
  freshSession: "Nova sessão",
  messageCount: ({ count }) =>
    Number(count) === 1 ? "1 mensagem" : `Mensagens ${count}`,
  speechInputRoute: ({ route }) => `Discurso em: ${route}`,
  replyModelRoute: ({ route }) => `Modelo de resposta: ${route}`,
  voiceOutputRoute: ({ route }) => `Saída de voz: ${route}`,
  fallbackVoiceOutputRoute: ({ route }) => `Saída de voz substituta: ${route}`,
  conversation: "Conversa",
  conversationActions: "Ações de conversa",
  statusDetails: "Detalhes do status",
  persistenceFailure:
    "Sr. Brócolis não conseguiu salvar dados neste dispositivo. Mantenha o aplicativo aberto e tente novamente; alterações recentes podem ser perdidas após a reinicialização.",
  show: "Mostrar",
  showTranscript: "Mostrar transcrição",
  hide: "Esconder",
  copyThread: "Copiar Tópico",
  shareThread: "Compartilhar tópico",
  repeatReply: "Repetir resposta",
  renameThread: "Renomear tópico",
  renameThreadHint:
    "Dê a esta conversa um título que você possa encontrar rapidamente mais tarde.",
  threadTitle: "Título do tópico",
  noTranscriptYet: "Nenhuma transcrição ainda",
  previewTranscriptEmptyDescription:
    "Use voz ou texto para começar. Sua conversa aparecerá aqui.",
  noConversationYet: "Nenhuma conversa ainda",
  expandedTranscriptEmptyDescription:
    "Use voz ou texto para começar. Feche esta tela quando quiser retornar ao palco principal.",
  transcriptSelectionHint:
    "Selecione qualquer texto de mensagem diretamente ou compartilhe e copie mensagens individuais abaixo.",
  textMessagePlaceholder: "Digite uma mensagem",
  sendTextMessage: "Enviar mensagem",
  showVoiceInput: "Mostrar entrada de voz",
  showTextInput: "Mostrar entrada de texto",
  usageStatsHiddenDescription: "Mantenha as estimativas de token fora da transcrição UI.",
  usageStatsVisibleDescription:
    "Mostre o uso estimado de token para respostas e totais de conversas.",
  debugLogButton: "Botão Log de depuração",
  debugLogButtonHiddenDescription:
    "Mantenha o botão LOG da tela inicial oculto, a menos que uma captura já esteja em execução.",
  debugLogButtonVisibleDescription:
    "Mostre o botão LOG da tela inicial para iniciar e interromper capturas de depuração.",
  debugLogButtonUsageDescription:
    "Como usar o botão: ativá-lo iniciará a captura de logs. Desativá-lo interromperá a captura de registros e os moverá para a área de transferência.",
  estimatedUsageTitle: "Uso estimado",
  estimatedUsageCounts: ({ replies, summaries }) =>
    `Respostas ${replies} · Atualizações de memória ${summaries}`,
  estimatedUsageConversationScope:
    "Os totais incluem todas as rotas e modelos usados ​​nesta conversa.",
  estimatedPromptTokens: ({ count }) => `Alerta: ${count}`,
  estimatedReplyTokens: ({ count }) => `Resposta: ${count}`,
  estimatedTotalTokens: ({ count }) => `Total: ${count}`,
  estimatedUsageInline: ({ prompt, completion, total }) =>
    `Husa. ${prompt} entrada · ${completion} saída · ${total} total`,
  searchQuery: "Consulta de pesquisa",
  expandWebSearchDetails: "Mostrar detalhes da pesquisa na web",
  collapseWebSearchDetails: "Ocultar detalhes da pesquisa na web",
  webSearchSourceCount: ({ count }) =>
    `${count} ${Number(count) === 1 ? "fonte" : "fontes"}`,
  sources: "Fontes",
  openSourceLink: ({ source }) => `Código aberto: ${source}`,
  turnReceipt: "Detalhes da curva",
  expandTurnReceipt: "Mostrar detalhes da curva",
  collapseTurnReceipt: "Ocultar detalhes da curva",
  turnReceiptDirect: "Direto",
  turnReceiptRequested: "Rota de resposta solicitada",
  turnReceiptActual: "Rota de resposta real",
  turnReceiptEffort: "Controle de raciocínio",
  turnReceiptProviderNative: "nativo do provedor",
  turnReceiptInput: "Rota de entrada",
  turnReceiptSearch: "Pesquisa na web",
  turnReceiptVoice: "Saída de voz",
  turnReceiptContext: "Contexto",
  turnReceiptTiming: "Tempo",
  turnReceiptFallback: "Motivo alternativo",
  turnReceiptVoiceInput: "Voz",
  turnReceiptTypedInput: "Digitado",
  turnReceiptSystemSpeech: "Reconhecimento de fala do sistema",
  turnReceiptSystemVoice: "Voz do sistema",
  turnReceiptSystemVoiceFallback: "Voz do sistema · substituto",
  turnReceiptOff: "Desligado",
  turnReceiptNotConfigured: "Ligado · não configurado",
  turnReceiptFallbackWithoutSearch: "Continuação sem pesquisa ao vivo",
  turnReceiptNotUsed: "Não usado",
  turnReceiptSummaryReused: "resumo salvo reutilizado",
  turnReceiptSummaryUpdated: "resumo atualizado",
  turnReceiptContextFallback: "substituto de mensagem recente",
  turnReceiptGatewayCompression: ({ original, compressed }) =>
    `gateway compactado mensagens ${original} para ${compressed}`,
  turnReceiptContextValue: ({ sent, total, summarized, state }) =>
    `${sent}/${total} mensagens anteriores enviadas · ${summarized} recentemente resumidas${state}`,
  turnReceiptTimingStt: "STT",
  turnReceiptTimingContext: "contexto",
  turnReceiptTimingSearch: "procurar",
  turnReceiptTimingModel: "modelo",
  turnReceiptTimingFirstSpeech: "primeiro discurso",
  turnReceiptTimingTotal: "total",
  estimatedRouteUsageTokensOnly: ({ tokens }) => `Tokens ${tokens}`,
  unknownUsageRoute: "Rota desconhecida",
  setupGuideConnectProviderTitle: "Configurar credenciais",
  setupGuideConnectProviderDescription:
    "Adicione credenciais em Configurações e escolha as rotas que deseja usar.",
  idle: "Parado",
  yourConversationAppearsHere: "Sua conversa aparece aqui",
  defaultTranscriptEmptyDescription:
    "Use voz ou texto para começar. Sr. Brócolis manterá o tópico e responderá aqui.",
  delete: "Excluir",
  deleteConversationConfirmationTitle: ({ title }) => `Excluir “${title}”?`,
  deleteConversationConfirmationMessage:
    "Isso exclui permanentemente a conversa e todas as suas mensagens. Esta ação não pode ser desfeita.",
  memory: "Memória",
  conversations: "Conversas",
  drawerSubtitle: "Salte entre tópicos ao vivo ou comece uma nova sala.",
  newSession: "Nova sessão",
  noSavedConversationsYet: "Ainda não há conversas salvas",
  drawerEmptyDescription:
    "Comece a falar na visualização principal e Sr. Brócolis criará uma sessão automaticamente.",
  setupGuideTitle: "Configurar o aplicativo",
  setupGuideSubtitle: "Adicione credenciais e escolha rotas em Configurações.",
  fastestStartPreset: "Configuração mínima",
  fastestStartDescription:
    "Use a fala do dispositivo quando disponível e configure apenas a rota de resposta necessária.",
  fullVoicePreset: "Voz configurada",
  fullVoiceDescription:
    "Use serviços configurados para respostas, transcrição e saída falada quando você os escolher.",
  setupGuideNote:
    "A seguir abriremos as Configurações para que você possa colar e validar as credenciais.",
  useThisSetup: "Use esta configuração",
  notNow: "Agora não",
  setupGuideIntroTitle: "Como funciona Sr. Brócolis",
  setupGuideIntroBody:
    "Sr. Brócolis começa em branco. Adicione credenciais para serviços externos que você já usa e escolha como as respostas, a entrada de fala, a saída falada e o contexto da Web opcional serão roteados.",
  setupGuideIntroNote:
    "Após a configuração, use o controle de voz principal para iniciar e interromper uma conversa. A transcrição atual permanece disponível na tela inicial e cada rota pode ser alterada posteriormente nas Configurações.",
  setupGuideProviderTitle: "Adicionar credenciais",
  setupGuideProviderBody:
    "Escolha o serviço externo que deseja configurar e cole as credenciais com acesso de resposta.",
  setupGuideProviderPickerLabel: "Serviço de resposta",
  setupGuideSelectProvider: "Selecione um provedor",
  setupGuideSelectProviderFirst: "Selecione um provedor primeiro.",
  setupGuideApiKeyLabel: "Chave API",
  setupGuideApiKeyPlaceholder: "Colar credenciais",
  setupGuideContinue: "Continuar",
  setupGuideOpenSettings: "Abra Configurações",
  setupGuideBack: "Voltar",
  setupGuideValidateKey: "Validar chave",
  setupGuideApiKeyRequiredOrCancel:
    "Adicione uma chave API para continuar ou cancele o guia de configuração.",
  setupGuideProviderAndApiKeyRequiredOrCancel:
    "Escolha um provedor e adicione uma chave API para continuar ou cancele o guia de configuração.",
  setupGuideProviderKeyNeedsLlmAccess: ({ provider }) =>
    `Estas credenciais ${provider} não permitem solicitações de resposta.`,
  setupGuideKokoroTitle: "Adicione uma voz natural no dispositivo",
  setupGuideKokoroBody: ({ size }) =>
    `Opcional: baixe Kokoro (cerca de ${size} MB) para obter respostas faladas muito mais naturais, sem provedor de fala ou cobranças de uso.`,
  setupGuideKokoroLanguageNote:
    "Este modelo atualmente fala inglês e chinês simplificado. Configure quaisquer rotas alternativas desejadas posteriormente nas configurações de Fala.",
  setupGuideKokoroDownload: "Baixar Kokoro",
  setupGuideUseKokoro: "Use Kokoro para respostas faladas",
  setupGuideUseKokoroSummary:
    "Mantenha a síntese no telefone sempre que o idioma de resposta for compatível.",
  setupGuideSkipKokoro: "Pular por enquanto",
  setupGuideVoiceTestTitle: "Teste sua configuração",
  setupGuideVoiceTestBody:
    "Diga uma frase curta. Sr. Brócolis testará o acesso ao microfone, a transcrição, a rota de resposta configurada e a saída falada quando uma rota de voz aceitável estiver disponível.",
  setupGuideVoiceTestNoInputBody:
    "A entrada de voz não está disponível nesta configuração. Continue revisando as rotas detectadas e ajuste as configurações de fala mais tarde, se necessário.",
  setupGuideVoiceTestTextOnlyNote:
    "Este teste permanece somente texto porque nenhuma rota de voz falada aceitável está pronta ainda.",
  setupGuideVoiceTestStart: "Iniciar teste",
  setupGuideVoiceTestStop: "Pare de gravar",
  setupGuideVoiceTestRetry: "Corra novamente",
  setupGuideVoiceTestTranscribing: "Transcrevendo…",
  setupGuideVoiceTestThinking: "Testando resposta…",
  setupGuideVoiceTestSynthesizing: "Preparando voz…",
  setupGuideVoiceTestSpeaking: "Reproduzindo resposta…",
  setupGuideVoiceTestTranscript: "Transcrição",
  setupGuideVoiceTestReply: "Responder",
  setupGuideVoiceTestReset: "Limpar este resultado",
  setupGuideVoiceInputUnavailable:
    "A entrada de voz não está disponível para esta configuração neste dispositivo.",
  setupGuideSummaryTitle: "Configuração concluída",
  setupGuideSummaryBody:
    "Aqui está a rota que Sr. Brócolis usará com sua configuração atual.",
  setupGuideSummaryLlm: "LLM",
  setupGuideSummaryStt: "Fala para texto",
  setupGuideSummaryTts: "Texto para fala",
  setupGuideSummaryWebSearch: "Pesquisa na web",
  setupGuideRouteProviderLlm: ({ provider }) => `Habilitado via ${provider}`,
  setupGuideRouteOnDeviceStt: "Ativado através do reconhecimento de fala do sistema",
  setupGuideRouteProviderStt: ({ provider }) =>
    `Ativado via transcrição de fala ${provider}`,
  setupGuideRouteProviderTts: ({ provider }) => `Ativado via voz ${provider}`,
  setupGuideRouteKokoroTts: "Ativado via voz no dispositivo Kokoro",
  setupGuideRouteLocalTts: "Ativado via pacote de voz local",
  setupGuideRouteUnavailable: "Não disponível",
  setupGuideRouteOff: "Desligado",
  setupGuideWebSearchAvailableOff: ({ provider }) =>
    `Disponível via ${provider}, atualmente desativado`,
  setupGuideSummaryTextOnlyNote:
    "As respostas faladas estão desativadas por enquanto. As respostas permanecem em texto até você ativar um provedor ou voz local.",
  setupGuideFinish: "Feito",
  searchConversationsPlaceholder: "Pesquise títulos, modelos e texto de mensagem",
  noMatchingConversations: "Nenhuma conversa correspondente",
  noMatchingConversationsDescription:
    "Experimente um título, rota, modelo ou frase diferente da transcrição.",
  memoryModalTitle: "Memória de conversa",
  memoryModalDescription:
    "Este é o resumo compacto que Sr. Brócolis avança quando um thread fica longo o suficiente para compactar voltas mais antigas.",
  memorySummary: "Resumo salvo",
  memorySummaryEmpty:
    "Ainda não há memória compacta. Quando este tópico ficar mais longo, as curvas mais antigas serão resumidas aqui.",
  summarizedTurnsCount: ({ count }) =>
    Number(count) === 1 ? "1 turno resumido" : `${count} voltas resumidas`,
  copyMemory: "Copiar memória",
  forgetMemory: "Esqueça a memória",
  memoryCopied: "Memória copiada.",
  memoryCleared: "Memória de conversação apagada.",
  noConversationToManageYet: "Ainda não há memória de conversa disponível.",
  noProviderYet: "Nenhum provedor ainda",
  noModelYet: "Nenhum modelo ainda",
  startedAt: "Iniciado",
  endedAt: "Terminou",
  pinned: "Fixado",
  copy: "Cópia",
  share: "Compartilhar",
  rename: "Renomear",
  pin: "Alfinete",
  unpin: "Liberar",
  save: "Salvar",
  cancel: "Cancelar",
  stop: "Parar",
  pause: "Pausa",
  resume: "Retomar",
  paused: "Pausado",
  listening: "Audição",
  parsing: "Transcrever",
  searching: "Procurando",
  converting: "Convertendo",
  webSearchAction: "pesquisa na web",
  thinking: "Pensamento",
  speaking: "Falando",
  pleaseWait: "Por favor, aguarde",
  yourTurn: "Sua vez",
  keepPressing: "Continue pressionando",
  tapWhenDone: "Toque quando terminar",
  speechPaused: "A fala está pausada",
  pausePlaybackUnavailable:
    "Esta rota de voz não pode ser pausada. Pare ou mude para saída de voz do provedor.",
  holdToSpeak: "Segure para falar",
  tapToSpeak: "Toque para falar",
  tapAgainToSend: "Toque novamente para enviar",
  waitingForReply: "Aguardando resposta",
  parsingYourVoice: "Analisando sua voz",
  providerConfiguredInSettings: ({ provider }) =>
    `${provider} não está configurado em Configurações.`,
  providerNetworkError: ({ provider, action }) =>
    `Não foi possível acessar ${provider} para ${action}. Verifique a conexão e tente novamente.`,
  providerAuthError: ({ provider, action }) =>
    `${provider} rejeitou as credenciais para ${action}. Verifique a chave e as permissões API.`,
  providerRateLimitError: ({ provider, action }) =>
    `${provider} está limitando a taxa ${action} no momento. Tente novamente em alguns instantes.`,
  providerCreditsRequired: ({ provider, action }) =>
    `${provider} precisa de crédito API suficiente para ${action}. Verifique o saldo da conta e o limite de gastos da chave.`,
  providerTimeoutError: ({ provider, action }) =>
    `${provider} demorou muito durante ${action}. Tente novamente.`,
  providerTemporaryError: ({ provider, action }) =>
    `${provider} teve um problema temporário durante ${action}. Tente novamente em breve.`,
  providerEmptyReplyError: ({ provider }) =>
    `${provider} terminou sem retornar resposta. Tente novamente.`,
  providerIncompleteReplyError: ({ provider }) =>
    `A resposta de ${provider} terminou antes de ser concluída. Tente novamente.`,
  providerContextTooLong: ({ provider }) =>
    `${provider} rejeitou a resposta porque a conversa ficou muito longa. Inicie um novo tópico ou encurte a solicitação.`,
  providerRequestRejected: ({ provider, action, detail }) =>
    detail
      ? `${provider} rejeitou a solicitação ${action}: ${detail}`
      : `${provider} rejeitou a solicitação ${action}.`,
  providerWebSearchNotRun: ({ provider }) =>
    `${provider} retornou uma resposta sem executar a pesquisa na web.`,
  providerValidationSuccess: ({ provider }) => `${provider} está pronto para uso.`,
  providerCapabilityValidationSuccess: ({ provider, capability }) =>
    `${provider} ${capability} está funcionando.`,
  providerValidationFailed: "Falha na validação do provedor.",
  webSearchFallback:
    "A pesquisa na web não estava disponível, então a resposta continuou sem contexto da web ao vivo.",
  noBase64EncoderAvailable: "Nenhum codificador base64 disponível.",
  noBase64DecoderAvailable: "Nenhum decodificador base64 disponível.",
  azureSpeechApiKeyFormat:
    "Microsoft Azure TTS precisa de credenciais do Azure Speech no formato <key>|<region>, por exemplo, abc123|westeurope, ou o formato combinado do Azure <endpoint>|<api-key>|<key>|<region>.",
  googleCloudSpeechCredentialFormat: ({ provider }) =>
    `${provider} STT precisa de credenciais Google Cloud Speech no formato <project-id>|<access-token>|<location> ou no formato Gemini combinado <Gemini API key>|<project-id>|<access-token>|<location>.`,
  bytedanceSpeechCredentialFormat: ({ provider }) =>
    `${provider} STT precisa de credenciais de fala Doubao no formato <app-key>|<access-key>, opcionalmente <app-key>|<access-key>|<resource-id> ou no formato combinado <ark-api-key>|<app-key>|<access-key>|<resource-id>.`,
  nativeTtsDoesNotSynthesizeAudioFiles:
    "Native TTS não sintetiza arquivos de áudio.",
  localTtsUnavailableForLanguage: ({ languageLabel }) =>
    `Nenhuma rota de voz local ou na nuvem está pronta para ${languageLabel}.`,
  chooseTextToSpeechProviderInSettings:
    "Escolha um provedor de conversão de texto em voz em Configurações.",
  ttsNotSupportedYet: ({ provider }) => `${provider} TTS ainda não é compatível.`,
  ttsError: ({ provider, status, errorText }) =>
    `Erro ${provider} TTS (${status}): ${errorText}`,
  ttsReplyTooLong: ({ provider }) =>
    `A saída de voz ${provider} rejeitou a resposta porque era muito longa.`,
  ttsTimeout: ({ provider }) => `A saída de voz ${provider} demorou muito.`,
  sttTimeout: ({ provider }) =>
    `A transcrição da fala ${provider} demorou muito.`,
  sttFileSizeLimitExceeded: ({ provider, model, limit }) =>
    `${provider} ${model} aceita apenas gravações até ${limit}. Use um clipe mais curto ou troque os modelos STT.`,
  voiceInputCaptureIncomplete:
    "A entrada de voz não pôde ser capturada corretamente. Por favor, tente novamente.",
  ttsDidNotReturnAudio: ({ provider }) =>
    `${provider} TTS não retornou áudio.`,
  nativeSttHandledInApp: "O sistema STT é tratado diretamente no aplicativo.",
  chooseSpeechToTextProviderInSettings:
    "Escolha um provedor de voz para texto em Configurações.",
  sttNotSupportedYet: ({ provider }) => `${provider} STT ainda não é compatível.`,
  providerNotWiredUpYet: ({ provider }) => `${provider} ainda não está conectado.`,
  you: "Você",
  assistant: "Assistente",
  untitledConversation: "Conversa sem título",
  conversationExportHeader: ({ title }) => `Conversa: ${title}`,
  speechRecognitionPermissionNotGranted:
    "Permissão de reconhecimento de fala não concedida.",
  speechRecognitionUnavailableForDeviceLanguage:
    "O reconhecimento de fala não está disponível para o idioma atual do dispositivo.",
  nativeSpeechRecognitionNeedsNetwork:
    "O reconhecimento de fala nativa precisa de acesso à rede agora.",
  noSpeechDetected: "Nenhuma fala foi detectada.",
  nativeSpeechRecognitionFailed: "O reconhecimento de fala nativa falhou.",
  couldntStartNativeSpeechRecognition:
    "Não foi possível iniciar o reconhecimento de fala nativa.",
  microphonePermissionNotGranted: "Permissão de microfone não concedida",
} satisfies TranslationDictionary;
