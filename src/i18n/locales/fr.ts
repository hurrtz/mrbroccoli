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
import { sessionLockTranslations } from "../sessionLockTranslations";

export const fr = {
  ...conversationArtifactTranslations.fr,
  ...interruptionTranslations.fr,
  ...ulraAuditTranslations.fr,
  ...dataBackupTranslations.fr,
  ...conversationKnowledgeTranslations.fr,
  ...imagePromptTranslations.fr,
  ...onDeviceTranslations.fr,
  ...onboardingTranslations.fr,
  ...introTranslations.fr,
  ...premiumTranslations.fr,
  ...transcriptEditTranslations.fr,
  ...workspaceTranslations.fr,
  ...sessionLockTranslations.fr,
  ...autoSetupTranslations.fr,
  appName: "M. Brocoli",
  retry: "Réessayer",
  dismiss: "Fermer",
  done: "Terminé",
  aboutSetting: ({ setting }) => `À propos de ${setting}`,
  unavailable: "Indisponible",
  selection: "Sélection",
  chooseCompatibleProviderFirst: "Choisis d'abord un fournisseur compatible",
  settings: "Paramètres",
  settingsReleaseVersion: ({ version }) => `Version ${version}`,
  all: "Tous",
  firstRun: "Premier lancement",
  instructions: "Instructions",
  providers: "Fournisseurs",
  webSearch: "Recherche sur le Web",
  stt: "STT",
  tts: "TTS",
  ui: "UI",
  settingsRuntimeReadiness: "Préparation à l'exécution",
  settingsReadinessThink: "Penser",
  settingsReadinessListen: "Écouter",
  settingsReadinessSpeak: "Parler",
  settingsReadinessSearch: "Recherche",
  settingsReadinessReady: "Prêt",
  settingsReadinessNeedsAttention: "Attention",
  settingsReadinessBroken: "Cassé",
  settingsReadinessOff: "Désactivé",
  settingsConnections: "Connexions",
  settingsThinking: "Pensée",
  settingsListening: "Écoute",
  settingsSpeaking: "Parole",
  settingsSearch: "Recherche",
  settingsAppDiagnostics: "Application et diagnostic",
  settingsGuidedSetup: "Configuration guidée",
  settingsGuidedSetupSummary:
    "Vérifie les connexions et teste la route vocale complète.",
  setupGuideShowInSettings: "Afficher la configuration guidée dans Paramètres",
  setupGuideShowInSettingsSummary:
    "Affiche ou masque le raccourci de configuration guidée dans l'aperçu des paramètres.",
  settingsConnectionsSummary: "Clés, validation et fonctionnalités du fournisseur.",
  settingsThinkingSummary: "Cartes d'accueil, modèles, efforts et invite système.",
  settingsListeningSummary: "Mode de saisie et routage parole-texte.",
  settingsSpeakingSummary: "Réponses orales, lecture, voix et aperçus.",
  settingsSearchSummary: "Fournisseur de recherche Web et contrôles de qualité de la recherche.",
  settingsAppDiagnosticsSummary:
    "Thème, langue, utilisation, journaux de débogage et activité récente.",
  settingsBackToOverview: "Retour à l'aperçu",
  settingsOpenSection: ({ section }) => `Ouvrir ${section}`,
  theme: "Thème",
  language: "Langue",
  recognitionLanguage: "Langue de reconnaissance",
  recognitionLanguageHint:
    "Choisis une langue pour améliorer la reconnaissance, ou laisse l’appareil ou le fournisseur la détecter automatiquement.",
  automaticLanguage: "Automatique",
  speechLanguageUnsupportedByProvider: ({ provider, language }) =>
    `${provider} ne prend pas officiellement en charge ${language} pour cette route vocale.`,
  usageStats: "Statistiques d'utilisation",
  model: "Modèle",
  effort: "Effort",
  effortValue: ({ effort }) => `Effort : ${effort}`,
  modelEffortNone: "Aucun",
  modelEffortMinimal: "Minimal",
  modelEffortLow: "Faible",
  modelEffortMedium: "Moyen",
  modelEffortHigh: "Élevé",
  modelEffortExtraHigh: "Très élevé",
  modelEffortMax: "Maximum",
  modelEffortDynamic: "Dynamique",
  modelEffortDisabled: "Désactivé",
  modelEffortEnabled: "Activé",
  fixed: "Fixé",
  english: "Anglais",
  german: "Allemand",
  ukrainian: "Ukrainien",
  hindi: "Hindi",
  spanish: "Espagnol",
  french: "Français",
  italian: "Italien",
  portuguese: "Portugais",
  portugueseBrazil: "Portugais (Brésil)",
  russian: "Russe",
  simplifiedChinese: "Chinois simplifié",
  arabic: "Arabe",
  japanese: "Japonais",
  hungarian: "Hongrois",
  czech: "Tchèque",
  polish: "Polonais",
  turkish: "Turc",
  swedish: "Suédois",
  urdu: "Ourdou",
  kokoroAmericanFemaleVoice: ({ name }) =>
    `${name} · anglais américain, voix féminine`,
  kokoroBritishFemaleVoice: ({ name }) =>
    `${name} · anglais britannique, voix féminine`,
  kokoroChineseFemaleVoice: ({ index }) => `Chinois, voix féminine ${index}`,
  kokoroChineseMaleVoice: ({ index }) => `Chinois, voix masculine ${index}`,
  light: "Clair",
  dark: "Sombre",
  system: "Système",
  languageCoverage: ({ note }) => `Couverture linguistique : ${note}`,
  recordingLimits: ({ note }) => `Limites d'enregistrement : ${note}`,
  catalogProviderPricingSummary: ({ summary }) => `Tarification : ${summary}`,
  replyGenerationAction: "génération de réponse",
  speechTranscriptionAction: "transcription vocale",
  speechSynthesisAction: "synthèse vocale",
  instructionsTabDescription:
    "Façonne les conseils cachés qui orientent l’assistant avant qu’un fournisseur ne voie la demande.",
  providersTabDescription:
    "Stocke les informations d'identification du service externe sur l'appareil et configure les modes de réponse que tu souhaites utiliser.",
  webSearchTabDescription:
    "Configure le contexte Web en direct facultatif avant les réponses.",
  responseModes: "Sélection du modèle",
  aboutModelSelection: "À propos de la sélection du modèle",
  modelSelectionInfo:
    "Chaque carte modèle devient un choix sur l'écran d'accueil. Configure son fournisseur, son modèle et son niveau d'effort facultatif, puis change de carte pour choisir le modèle qui répond ensuite.",
  responseModeItemTitle: ({ index }) => `Modèle ${index}`,
  addResponseMode: "Ajouter un modèle",
  removeResponseMode: "Supprimer le modèle",
  responseModesNoConfiguredProviders:
    "Ajoute d’abord les informations d’identification. Les contrôles de route restent masqués jusqu'à ce qu'au moins un service compatible soit configuré.",
  useResponseMode: ({ mode }) => `Utilise ${mode}`,
  chooseResponseModel: "Choisis un modèle",
  responseModelCount: ({ count }) => `${count} modèles disponibles`,
  ulraMode: "Mode suprême",
  ulraModeHomeLabel: "Afficher le Mode suprême sur l’écran d’accueil",
  ulraModeSettingsDescription:
    "Autorise une délibération entre plusieurs modèles lorsque au moins deux modèles de l’accueil sont prêts.",
  ulraModeInfo:
    "Le Mode suprême interroge d’abord séparément chaque modèle prêt de l’écran d’accueil. À chaque tour, les modèles remettent en question la dernière position de chaque participant ; les tours restants sont évités après une convergence unanime explicite. Le modèle sélectionné synthétise les tours réussis en conservant toujours la dernière position de chaque modèle. La délibération est partagée avec tous les fournisseurs concernés.",
  ulraModeRounds: "Tours de révision",
  ulraModeCallEstimate: ({ count }) =>
    `Jusqu’à ${count} appels de modèles par message avec la configuration actuelle.`,
  ulraModeThresholdWarning:
    "Plus de 4 modèles ou 3 tours peuvent prendre beaucoup de temps, consommer de nombreux jetons et atteindre les limites de contexte ou de débit des fournisseurs. Ceci n’est qu’un avertissement.",
  ulraModeFirstUseTitle: "Activer le Mode suprême ?",
  ulraModeFirstUseMessage: ({ calls, models, rounds }) =>
    `Avec ${models} modèles et jusqu’à ${rounds} tours de révision, un message peut effectuer jusqu’à ${calls} appels de modèles. Cela peut prendre bien plus de temps, coûter nettement plus cher et partager la délibération avec tous les fournisseurs concernés.`,
  ulraModeHighRiskTitle: "Exécution volumineuse du Mode suprême",
  ulraModeHighRiskMessage: ({ calls, models, rounds }) =>
    `${models} modèles et ${rounds} tours de révision peuvent effectuer jusqu’à ${calls} appels de modèles. Cela peut être très long, consommer beaucoup de jetons et atteindre les limites des fournisseurs. Continuer quand même ?`,
  ulraModeEnableAction: "Activer",
  ulraModeNeedsTwoModels:
    "Le Mode suprême nécessite au moins deux modèles prêts sur l’écran d’accueil.",
  ulraModeAllModelsFailed:
    "Tous les modèles du Mode suprême ont échoué avant qu’une réponse puisse être synthétisée.",
  ulraModePartialFailureNotice: ({ failed, succeeded }) =>
    `${failed} appels internes ont échoué ; la réponse finale a utilisé ${succeeded} contributions réussies.`,
  sttTabDescription:
    "Contrôle la façon dont la parole est capturée et quel backend transforme l'audio en texte avant qu'il n'atteigne le modèle.",
  ttsTabDescription:
    "Contrôle quand les réponses commencent à parler et quel backend gère la sortie vocale.",
  brief: "Bref",
  briefDescription:
    "Garde la réponse serrée. Utilise le nombre minimum de phrases nécessaires pour répondre pleinement à l’utilisateur.",
  normal: "Normal",
  normalDescription:
    "Vise une longueur de réponse équilibrée. Couvre les points importants sans faire traîner la réponse.",
  thorough: "Complet",
  thoroughDescription:
    "Va en profondeur et sois complet. Inclus les nuances, les détails, les compromis et le raisonnement qui compte.",
  professional: "Professionnel",
  professionalDescription:
    "Parle comme un consultant senior briefant un client. Langage précis, sans argot, mesuré et faisant autorité.",
  casual: "Décontracté",
  casualDescription:
    "Parle comme un ami intelligent dans un café. Détendu, naturel, conversationnel. Les contractions sont acceptables, les digressions aussi.",
  nerdy: "Geek",
  nerdyDescription:
    "Parle comme un expert enthousiaste qui aime approfondir. Utilise librement la terminologie technique, passionne-toi pour les détails, suppose que l'utilisateur peut suivre le rythme.",
  concise: "Concis",
  conciseDescription:
    "Sois le plus bref possible tout en étant complet. Pas de préambule, pas de remplissage, juste la réponse. Pense au style télégramme.",
  socratic: "Socratique",
  socraticDescription:
    "Défie la réflexion de l'utilisateur. Pose des contre-questions, propose des perspectives alternatives, ne te contente pas de confirmer ce qu'il a dit. Sois un partenaire d'entraînement, pas une machine à oui.",
  eli5: "ELI5",
  eli5Description:
    "Explique tout le plus simplement possible. Utilise des analogies, un langage courant, zéro jargon. Ne suppose aucune connaissance préalable sur aucun sujet.",
  useProvider: ({ provider }) => `Utilise ${provider}`,
  createApiKey: "Informations d'identification",
  apiKey: "Clé API",
  aboutThisProvider: "À propos de ce fournisseur",
  openRouterOnboardingTitle: "Une clé, plusieurs fournisseurs",
  openRouterOnboardingDescription:
    "Crée une clé OpenRouter dédiée, colle-la ci-dessous et utilise des modèles basés sur des instantanés de plusieurs fournisseurs sans remplacer aucune connexion directe.",
  openRouterOnboardingRoute:
    "Chemin de requête : cet appareil → OpenRouter → fournisseur en amont sélectionné",
  openRouterKeys: "Clés OpenRouter",
  providerStatusInvalid: "Invalide",
  providerStatusTesting: "Test en cours",
  providerStatusConfigured: "Configuré",
  providerStatusWorking: "Fonctionnel",
  providerStatusNotTested: "Non testé",
  providerStatusNotSetup: "Non configuré",
  expandProvider: ({ provider }) => `Développer ${provider}`,
  collapseProvider: ({ provider }) => `Réduire ${provider}`,
  testProviderKey: "Tester la clé",
  testAllCapabilities: "Teste tout",
  apiTest: "Test API",
  testProviderCapability: ({ capability }) => `Tester ${capability}`,
  test: "Test",
  optional: "Facultatif",
  providerCapability_llm: "Réponses",
  providerCapability_stt: "Saisie vocale",
  providerCapability_tts: "Sortie vocale",
  providerCapability_search: "Recherche sur le Web",
  providerCapability_voices: "Bibliothèque vocale",
  providerValidationUnavailable:
    "La validation en direct n'est pas encore câblée pour ce fournisseur. Enregistre la clé ici et vérifie-la lors de son utilisation réelle.",
  providerNeedsAttention: "a besoin d'attention",
  catalogProviderLimitsSummary: ({ summary }) => `Limites : ${summary}`,
  catalogProviderRegionSummary: ({ summary }) => `Région : ${summary}`,
  validatingKey: "Validation...",
  showKey: "Afficher la clé",
  hideKey: "Masquer la clé",
  assistantInstructions: "Instructions pour l'assistant",
  systemPrompt: "Invite système",
  aboutSystemPrompt: "À propos de l'invite système",
  assistantInstructionsIntro:
    "Façonne les conseils cachés que le modèle reçoit avant chaque réponse.",
  baseInstructions: "Instructions de base",
  assistantInstructionsPlaceholder: "Définis le comportement de l'assistant.",
  assistantInstructionsHint:
    "Ceci est toujours ajouté avant la longueur de réponse et la tonalité sélectionnées.",
  adaptiveLength: "Longueur adaptative",
  responseTone: "Tonalité de réponse",
  homeStyleChipLabel: ({ tone, length }) => `Style — ${tone} · ${length}`,
  styleSheetTitle: "Paramètres de conversation",
  styleSheetSubtitle: "Façonne les réponses et le discours pour cette conversation uniquement.",
  openStyleSheet: "Ouvrir les paramètres de conversation",
  conversationThinkingInstructions: "Consignes de réflexion",
  conversationThinkingInstructionsDescription:
    "Ajoute des instructions après l'invite du système global pour cette conversation.",
  conversationThinkingInstructionsPlaceholder:
    "Par exemple : Remets en question mes hypothèses et utilise des exemples concrets.",
  ttsInstructions: "Instructions d'élocution",
  ttsInstructionsDescription:
    "Guide le ton, le rythme, l’accent ou la prestation utilisés par les modèles vocaux compatibles.",
  conversationTtsInstructionsDescription:
    "Ajoute des instructions d'élocution après les instructions vocales globales pour cette conversation.",
  ttsInstructionsPlaceholder:
    "Par exemple : Parle chaleureusement, clairement et à un rythme détendu.",
  ttsInstructionsUnsupported:
    "La route vocale actuelle ne prend pas en charge les instructions d'élocution.",
  conversationVoiceDescription: ({ route }) =>
    `Choisis la voix utilisée par ${route} dans cette conversation.`,
  scrollToLatest: "Faites défiler jusqu'au dernier message",
  conversationTitleGenerate: "Titre généré automatiquement",
  conversationTitleGenerating: "Génération du titre…",
  conversationTitleGenerated: "Conversation renommée.",
  conversationTitleNeedsContent:
    "Démarre une conversation avant de générer un titre.",
  conversationTitleNeedsProvider:
    "Configure le modèle sélectionné avant de générer un titre.",
  conversationTitleGenerationFailed: "Impossible de générer un titre de conversation.",
  conversationTitleGenerationTimedOut:
    "La génération du titre a pris trop de temps. Réessaie.",
  inputMode: "Mode d'entrée",
  voiceInput: "Entrée vocale",
  pushToTalk: "Pousser pour parler",
  pushToTalkDescription:
    "Maintiens le bouton principal enfoncé tout en parlant, puis relâche pour envoyer.",
  toggleToTalk: "Basculer pour parler",
  toggleToTalkDescription:
    "Appuie une fois pour démarrer l'enregistrement et appuie à nouveau lorsque tu as terminé.",
  driveSession: "Séance de conduite",
  driveSessionDescription:
    "Lorsque l'enchaînement automatique est activé, l'enregistrement démarre après chaque réponse vocale. Appuie sur le bouton principal lorsque tu as fini de parler.",
  stopDriveSession: "Suspendre le mode auto",
  repeatDriveReply: "Répéter la dernière réponse",
  continueDriveSession: "Reprendre le mode auto",
  driveSendsIn: ({ seconds }) => `Envoi dans ${seconds}…`,
  speechToText: "Parole en texte",
  appNative: "Reconnaissance du système",
  nativeSttDescription:
    "Utilise la reconnaissance vocale du système d'exploitation.",
  provider: "Fournisseur",
  webSearchProvider: "Fournisseur de recherche Web",
  webSearchProviderMissingHint:
    "Configure au moins un service compatible avec la recherche dans les informations d'identification pour activer l'ancrage Web ici.",
  webSearchModelHint: ({ model }) =>
    `Utilise ${model} en coulisses pour l'ancrage Web en direct.`,
  webSearchHomeHint:
    "Utilise le bouton de l'écran d'accueil pour activer ou désactiver l'ancrage Web pour ce fil de discussion.",
  settingsWebSearchCompactHint:
    "Ajoute éventuellement un nouveau contexte Web avant les réponses du modèle principal.",
  webSearchAdvanced: "Contrôles de recherche avancés",
  expandAdvancedSearch: "Développer les contrôles de recherche avancés",
  collapseAdvancedSearch: "Réduire les contrôles de recherche avancés",
  webSearchSetupNeeded: "Ajoute des informations d'identification pour utiliser la recherche Web en direct.",
  webSearchEnabledDescription:
    "Un nouveau contexte Web est ajouté avant que le modèle ne réponde.",
  webSearchDisabledDescription:
    "Utilise le contexte Web en direct pour ce fil de discussion lorsque les faits actuels comptent.",
  webSearchNobodyDescription:
    "Aucune requête web. Il répond avec ce que le modèle sait.",
  webSearchQualityControls: "Qualité de la recherche",
  webSearchSearchMode: "Mode de recherche",
  webSearchSearchModeQuick: "Rapide",
  webSearchSearchModeBalanced: "Équilibré",
  webSearchSearchModeDeep: "Profond",
  webSearchDepth: "Profondeur de recherche",
  webSearchDepthStandard: "Standard",
  webSearchDepthDeep: "Profond",
  webSearchResultCount: "Nombre de résultats",
  webSearchQualityHint: ({ provider }) =>
    `Ces contrôles ajustent la manière dont ${provider} rassemble un nouveau contexte avant la réponse.`,
  webSearchNoExtraControls: ({ provider }) =>
    `${provider} n'expose pas encore de contrôles supplémentaires de qualité de recherche dans cette application.`,
  setWebSearchMode: ({ mode }) => `Définir le mode de recherche Web sur ${mode}`,
  openWebSearchSettings: "Ouvrir les paramètres de recherche sur le Web",
  providerSttDescription:
    "Utilise un service externe configuré pour transcrire ta voix avant qu'elle ne soit envoyée à la route de réponse.",
  sttProvider: "Fournisseur STT",
  sttProviderEnabledHint:
    "Seuls les fournisseurs activés prenant en charge la transcription apparaissent ici.",
  sttProviderMissingHint:
    "Ajoute des informations d'identification pour un service prenant en charge STT pour le choisir ici.",
  nativeSttHint:
    "La reconnaissance du système fonctionne indépendamment des clés de ton fournisseur et peut être traitée sur l'appareil ou par le service vocal du système d'exploitation.",
  replyPlayback: "Lecture des réponses",
  sentencesArrive: "Les paragraphes arrivent",
  sentencesArriveDescription:
    "Commence à parler dès qu’un paragraphe complet est prêt.",
  fullReplyFirst: "Réponse complète en premier",
  fullReplyFirstDescription:
    "Génère d’abord la réponse complète, puis lis-la en une seule passe.",
  textToSpeech: "Synthèse vocale",
  spokenReplies: "Réponses parlées",
  spokenRepliesEnabledDescription:
    "Lire à voix haute les réponses de l'assistant lorsqu'une route vocale est disponible.",
  spokenRepliesDisabledDescription:
    "Pour le moment, conserve les réponses uniquement sous forme de texte. Ta route TTS préférée reste enregistrée pour plus tard.",
  nativeTtsDescription:
    "Utilise le moteur vocal de l'appareil pour les réponses vocales et l'aperçu vocal.",
  kokoroTtsDescription:
    "Utilise une voix neuronale beaucoup plus naturelle, entièrement sur cet appareil. Le texte des réponses orales est synthétisé localement, sans clé de fournisseur vocal ni frais d'utilisation.",
  kokoroVoices: "Voix Kokoro sur l'appareil",
  kokoroVoicesHint: ({ size, installedSize }) =>
    `Le modèle multilingue télécharge environ ${size} Mo et occupe environ ${installedSize} Mo après l'installation.`,
  kokoroModel: "Modèle multilingue Kokoro",
  kokoroChecking: "Vérification du modèle sur l'appareil…",
  kokoroDownloading: ({ progress }) => `Téléchargement… ${progress}%`,
  kokoroExtracting: ({ progress }) => `Installation… ${progress}%`,
  kokoroVerifying: "Vérification du moteur vocal…",
  kokoroInstalled: "Installé et prêt sur cet appareil.",
  kokoroNotInstalled: "Télécharge et vérifie le modèle avant de sélectionner ou d'utiliser Kokoro. Aucune clé de fournisseur requise.",
  kokoroLanguageFallback:
    "Kokoro parle actuellement anglais et chinois simplifié ici. Pour les autres langues de réponse sélectionnées, ajoute une route de secours explicite, sinon la parole s'arrêtera avec une erreur.",
  kokoroRemoveTitle: "Supprimer le modèle Kokoro ?",
  kokoroRemoveBody: ({ installedSize }) =>
    `Cela libère environ ${installedSize} Mo. Tu peux à tout moment télécharger à nouveau le modèle.`,
  removeKokoroModel: "Supprimer le modèle Kokoro",
  downloadKokoroModel: "Télécharge le modèle Kokoro",
  kokoroFallbackNeeded: ({ languages }) =>
    `Une route de secours explicite est requise pour : ${languages}.`,
  kokoroNoSelectedLanguages:
    "Sélectionne Anglais ou Chinois simplifié sous Langues d'écoute pour configurer une voix Kokoro.",
  expandVoiceSettings: ({ language }) => `Développer les paramètres vocaux ${language}`,
  collapseVoiceSettings: ({ language }) =>
    `Réduire les paramètres vocaux ${language}`,
  remove: "Retirer",
  voiceOutputDescription:
    "Choisis le moteur vocal, les langues d'écoute et les aperçus vocaux pour les réponses parlées.",
  localTts: "Locale",
  localTtsDescription:
    "Utilise une voix locale téléchargée correspondante pour les réponses parlées.",
  providerTtsDescription:
    "Utilise le service configuré sélectionné pour les réponses vocales.",
  ttsFallbackRoutes: "Routes de secours",
  ttsFallbackRoutesHint:
    "Facultatif. Ajoute uniquement les routes souhaitées, dans l’ordre dans lequel elles doivent être essayées. Une fois qu'une route commence à parler, j'y reste pour le reste de la réponse.",
  ttsFallbackNone:
    "Aucune route de secours n'est configurée. Un échec vocal sera affiché à la place.",
  ttsFallbackPosition: ({ position, route }) => `${position}. ${route}`,
  addFallbackRoute: ({ route }) => `Ajouter une route de secours ${route}`,
  removeFallbackRoute: ({ route }) => `Supprimer la route de secours ${route}`,
  moveFallbackEarlier: ({ route }) => `Déplacer ${route} plus tôt`,
  moveFallbackLater: ({ route }) => `Déplacer ${route} plus tard`,
  ttsProvider: "Fournisseur TTS",
  ttsProviderEnabledHint:
    "Seuls les fournisseurs activés avec prise en charge des réponses vocales apparaissent ici.",
  ttsProviderMissingHint:
    "Ajoute des informations d'identification pour un service prenant en charge TTS pour le choisir ici.",
  localTtsOrderHint:
    "Seules les routes de secours explicitement configurées sont tentées.",
  providerTtsOrderHint:
    "Seules les routes de secours explicitement configurées sont tentées.",
  nativeTtsHint:
    "Le TTS natif utilise la pile vocale du système et ne nécessite pas de clé de fournisseur.",
  localTtsLanguageCoverageHint:
    "Les packs locaux couvrent actuellement l'anglais, l'allemand, le chinois simplifié, l'espagnol, le portugais, l'hindi, le français et l'italien.",
  ttsVoice: "Voix TTS",
  refresh: "Rafraîchir",
  providerVoiceDirectory: ({ provider }) => `bibliothèque vocale ${provider}`,
  refreshProviderVoices: ({ provider }) => `Actualiser les voix de ${provider}`,
  providerVoicesAvailable: ({ count, provider }) =>
    `${count} voix ${Number(count) === 1 ? "disponible" : "disponibles"} auprès de ${provider}.`,
  providerVoicesLoadFailed:
    "Les voix n'ont pas pu être rafraîchies. Ta sélection actuelle reste inchangée ; tu peux toujours saisir manuellement un identifiant vocal.",
  providerVoicesLoadFailedWithFallback:
    "Les voix du compte n'ont pas pu être chargées. La voix intégrée reste disponible.",
  providerVoicesErrorDetail: ({ detail }) => `Raison : ${detail}`,
  elevenLabsVoicesReadPermissionHint:
    "Dans ElevenLabs, modifie cette clé API et active Voix → Lire, puis actualise ici.",
  providerVoicesLoadingHint: ({ provider }) =>
    `Je charge automatiquement les voix disponibles à partir de ${provider}.`,
  providerVoiceId: "Identifiant vocal",
  providerVoiceIdPlaceholder: "Entre un identifiant vocal",
  providerVoiceIdFallbackHint:
    "La saisie manuelle reste disponible lorsque la bibliothèque vocale ne peut pas être chargée.",
  providerVoiceIdRequired: ({ provider }) =>
    `Actualise la bibliothèque vocale ${provider} ou saisis un identifiant vocal avant d'utiliser la sortie vocale.`,
  qwenSpeechUnavailableInUs:
    "Mes routes vocales Qwen actuelles ne sont pas disponibles dans la région des États-Unis. Choisis Singapour ou Pékin pour la voix Qwen.",
  qwenApiRegion: "Région Qwen API",
  qwenRegionSingapore: "Singapour",
  qwenRegionUs: "États-Unis (Virginie)",
  qwenRegionBeijing: "Chine (Pékin)",
  qwenRegionHint:
    "La région sélectionnée doit correspondre à la région dans laquelle cette clé API a été créée.",
  qwenRegionUsSpeechHint:
    "Les clés de la région américaine prennent en charge le chat et la recherche sur le Web ici. Mes routes Qwen STT et TTS actuelles nécessitent une clé de Singapour ou de Pékin.",
  providerDefaultVoiceHint:
    "Ce fournisseur utilise actuellement sa voix par défaut pour l'aperçu et les réponses vocales.",
  listenLanguages: "Langues d'écoute",
  listenLanguagesHint:
    "Choisis les langues dans lesquelles je dois bien sonner. Je les essaie dans cet ordre lors du routage de la sortie vocale.",
  listenLanguagesSelected: ({ count }) =>
    count === 1 ? "1 langue sélectionnée" : `${count} langues sélectionnées`,
  localVoicePacks: "Packs vocaux locaux",
  localVoicePacksHint:
    "Chaque langue garde sa propre voix locale. Choisis la voix que tu souhaites pour cette langue, puis télécharge uniquement les packs qui t'intéressent réellement.",
  localVoiceForLanguage: ({ languageLabel }) => `Voix pour ${languageLabel}`,
  providerVoicePreviews: "Aperçus vocaux du fournisseur",
  providerVoicePreviewsHint:
    "Teste ici la route TTS actuellement sélectionnée avec un texte d'aperçu distinct pour chaque langue de réponse.",
  nativeVoicePreviewSection: "Aperçu vocal natif",
  nativeVoicePreviewSectionHint:
    "Celui-ci parle directement via le synthétiseur vocal intégré au téléphone afin que tu puisses le comparer avec les voix configurées du fournisseur.",
  nativeVoiceUnavailable:
    "Cet appareil n'a signalé aucune voix système native pour l'aperçu.",
  runtimeCompatibilityOverrides: "Compatibilité d’exécution",
  runtimeCompatibilityOverridesDescription: ({ count }) =>
    `${count} configurations de modèle ou de réglage confirmées indisponibles par le fournisseur sont désactivées uniquement sur cet appareil. Je les contourne automatiquement.`,
  clearRuntimeCompatibilityOverrides: "Effacer la compatibilité d’exécution",
  clearRuntimeCompatibilityOverridesConfirmationTitle:
    "Effacer la compatibilité d’exécution ?",
  clearRuntimeCompatibilityOverridesConfirmationMessage:
    "Les configurations précédemment désactivées pourront être réessayées. Le fournisseur peut les refuser à nouveau.",
  speechDiagnostics: "Activité vocale récente",
  speechDiagnosticsHint:
    "Affiche les dernières demandes vocales, la route demandée, la route réellement utilisée et toute raison de secours.",
  clearSpeechDiagnostics: "Effacer l'activité vocale récente",
  speechDiagnosticsEmpty:
    "Aucune demande de parole récente pour le moment. Prévisualise une voix ou écoute une réponse pour voir les détails du routage ici.",
  clearSpeechDiagnosticsConfirmationTitle: "Effacer l'activité vocale récente ?",
  clearSpeechDiagnosticsConfirmationMessage:
    "Cela supprime tous les diagnostics de routage vocal capturés. Cette action ne peut pas être annulée.",
  speechDiagnosticSourceConversation: "Réponse à la conversation",
  speechDiagnosticSourceRepeat: "Répéter la réponse",
  speechDiagnosticSourcePreview: "Aperçu vocal",
  speechDiagnosticSourceUnknown: "Demande de parole",
  speechDiagnosticRouteLine: ({ requested, actual }) =>
    `Demandé : ${requested} -> Réel : ${actual}`,
  speechDiagnosticStageLine: ({ stage }) => `Dernière étape : ${stage}`,
  speechDiagnosticLanguageLine: ({ languageLabel }) =>
    `Langue : ${languageLabel}`,
  speechDiagnosticProviderLine: ({ provider }) => `Fournisseur : ${provider}`,
  speechDiagnosticVoiceLine: ({ voice }) => `Voix : ${voice}`,
  localTtsPackReady: "Installé sur cet appareil.",
  localTtsPackBroken:
    "Téléchargée, mais cette voix a échoué à la vérification locale sur cet appareil. Télécharge-la à nouveau ou choisis une autre voix.",
  localTtsPackMissing:
    "Pas encore installé. Cloud TTS ou la voix du système sera utilisé jusqu'à ce que tu le télécharges.",
  localTtsUnsupportedLanguageFallback:
    "Un pack local n'est pas encore disponible pour cette langue. Cloud TTS ou la voix du système s'en chargera.",
  downloadingLocalTtsPack: ({ progress }) =>
    `Téléchargement du pack local... ${progress}%`,
  download: "Télécharger",
  downloadingShort: "Chargement...",
  voicePreviewText: "Texte d'aperçu vocal",
  voicePreviewPlaceholder: "Tape une phrase pour entendre cette voix.",
  voicePreviewHint:
    "Utilise le backend vocal de réponse actuellement sélectionné sans rien envoyer au modèle de langage.",
  previewVoice: "Aperçu de la voix",
  generatingPreview: "Génération d'un aperçu...",
  playingPreview: "Lecture de l'aperçu...",
  systemVoice: "Voix du système",
  spokenRepliesOff: "Texte uniquement",
  noTtsProvider: "Aucun fournisseur TTS",
  nothingToCopyYet: "Rien à copier pour l'instant.",
  couldntCopyText: "Impossible de copier ce texte.",
  nothingToShareYet: "Rien à partager pour l'instant.",
  couldntShareText: "Impossible de partager ce texte.",
  couldntReplayReply: "Impossible de rejouer cette réponse.",
  replyFailed: "Échec de la réponse",
  retryReply: "Réessayer la réponse",
  replyFailedHint: "Tu peux choisir un autre modèle ci-dessus avant de réessayer.",
  spokenReplyFailed: "La réponse a été enregistrée, mais elle n'a pas pu être prononcée.",
  retrySpeech: "Réessayer la lecture vocale",
  openSpeakingSettings: "Paramètres de parole",
  messageCopied: "Message copié.",
  noConversationToCopyYet: "Aucune conversation à copier pour l'instant.",
  noConversationToShareYet: "Aucune conversation à partager pour l'instant.",
  noReplyToRepeatYet: "Aucune réponse à rejouer pour l'instant.",
  threadCopied: "Fil copié.",
  threadRenamed: "Fil renommé.",
  threadPinned: "Fil épinglé.",
  threadUnpinned: "Fil désépinglé.",
  addProviderKeyToUseProvider: ({ provider }) =>
    `Ajoute les informations d'identification pour ${provider} dans les paramètres avant d'utiliser cette route.`,
  configureCredentialsBeforeVoiceSession:
    "Ajoute des informations d'identification dans Paramètres avant de démarrer une session vocale.",
  endpointCredentialFormatInvalid: ({ provider }) =>
    `Pour ${provider}, saisis l'URL de base du fournisseur et la clé API sous la forme https://your-endpoint.example.com|your-api-key.`,
  speechRecognitionUnavailableOnDevice:
    "La reconnaissance vocale n'est pas disponible sur cet appareil.",
  debugLogLabel: "LOG",
  debugLogCaptureStarted: "La journalisation du débogage a démarré.",
  debugLogCaptureStopped: ({ entryCount, fileName }) =>
    `Journal de débogage enregistré sous ${fileName} et copié dans le presse-papiers (${entryCount} entrées).`,
  debugLogCaptureStoppedNoClipboard: ({ entryCount, fileName }) =>
    `Journal de débogage enregistré sous ${fileName} (${entryCount} entrées).`,
  debugLogCaptureRecovered: ({ entryCount, fileName }) =>
    `Journal de débogage précédent ${fileName} récupéré et copié dans le presse-papiers (${entryCount} entrées).`,
  debugLogCaptureRecoveredNoClipboard: ({ entryCount, fileName }) =>
    `Journal de débogage précédent ${fileName} récupéré (${entryCount} entrées).`,
  debugLogCaptureFailed: "Impossible d'enregistrer le journal de débogage.",
  chooseSttBeforeVoiceSession:
    "Choisis une route STT configurée dans Paramètres avant de démarrer une session vocale.",
  chooseTtsBeforeSpokenReplies:
    "Choisis une route TTS configurée dans Paramètres avant d'utiliser les réponses vocales.",
  stopSessionBeforeReplay:
    "Arrête la session vocale active avant de relire la dernière réponse.",
  couldntCatchThatTryAgain: "Je n'ai pas réussi à comprendre, réessaie.",
  couldntStartVoiceInput: "Impossible de démarrer la saisie vocale.",
  couldntProcessVoiceInput: "Impossible de traiter la saisie vocale.",
  maxRecordingLengthReached:
    "Durée maximale d'enregistrement atteinte — envoi de ce que j'ai.",
  sttRecordingTooLarge: ({ provider, limit }) =>
    `Cet enregistrement est trop long pour la transcription vocale ${provider} (max ${limit}). Essaie un message plus court ou passe de la transcription vocale à la reconnaissance système.`,
  addProviderKeyToEnableProvider: ({ provider }) =>
    `Ajoute les informations d'identification pour ${provider} dans les paramètres avant d'utiliser cette route.`,
  stopSessionBeforePreview:
    "Arrête la session vocale active avant de prévisualiser une voix.",
  chooseTtsToPreviewVoices:
    "Choisis une route TTS configurée dans Paramètres pour prévisualiser les voix.",
  downloadSelectedLocalVoiceFirst: ({ languageLabel }) =>
    `Télécharge d'abord la voix locale ${languageLabel} sélectionnée.`,
  couldntPreviewVoice: "Impossible de prévisualiser la voix.",
  spokenRepliesDisabled: "Les réponses orales sont désactivées dans Paramètres.",
  providerVoiceFallback:
    "La route vocale configurée a échoué. Cette réponse est passée à une voix de secours.",
  localVoiceFallback:
    "La voix locale n'était pas disponible. Cette réponse est passée à une voix de secours.",
  localTtsPackInstalled: ({ languageLabel }) =>
    `Pack vocal local ${languageLabel} installé.`,
  localTtsPackInstallFailed: "Impossible d'installer le pack vocal local.",
  clear: "Effacer",
  voiceOutput: "Sortie vocale",
  speechReplayCache: "Cache de relecture vocale",
  speechReplayCacheDescription:
    "La voix générée par le fournisseur reste sur cet appareil jusqu’à 14 jours. Réécouter une réponse ne consomme donc pas de nouveaux crédits vocaux.",
  clearSpeechReplayCache: "Vider le cache vocal",
  speechReplayCacheCleared: "Les fichiers vocaux en cache ont été supprimés.",
  speechReplayCacheClearFailed: "Impossible de vider le cache vocal.",
  listeningToYourVoice: "Écoute de ta voix",
  parsingYourVoiceInput: "Transformer ta voix en texte",
  preparingRequest: "Préparer ta demande",
  searchingTheWeb: "Rechercher sur le Web un nouveau contexte",
  waitingForProvider: ({ provider }) => `En attente de ${provider}`,
  preparingVoiceWithProvider: ({ provider }) =>
    `Préparation de la voix avec ${provider}`,
  deepThinkingReassurance: "Les bonnes réponses prennent un moment…",
  thinkingElapsed: ({ detail, seconds }) => `${detail} · ${seconds}s`,
  speakingBackToYou: "Je te réponds",
  freshSession: "Nouvelle session",
  messageCount: ({ count }) =>
    Number(count) === 1 ? "1 message" : `${count} messages`,
  conversation: "Conversation",
  conversationActions: "Actions de conversation",
  statusDetails: "Détails du statut",
  persistenceFailure:
    "Je n'ai pas pu enregistrer les données sur cet appareil. Garde l'application ouverte et réessaie ; les modifications récentes peuvent être perdues après le redémarrage.",
  show: "Montrer",
  showTranscript: "Afficher la transcription",
  hide: "Cacher",
  copyThread: "Copier le fil de discussion",
  shareThread: "Partager le fil de discussion",
  reportResponse: "Signaler cette réponse",
  reportResponseIntro: "Signalement de réponse IA depuis Mr Broccoli. Vérifie le contenu ci-dessous, décris le problème et envoie ce signalement au développeur.",
  repeatReply: "Répéter la réponse",
  renameThread: "Renommer le fil de discussion",
  renameThreadHint:
    "Donne à cette conversation un titre que tu pourras retrouver rapidement plus tard.",
  threadTitle: "Titre du fil",
  noTranscriptYet: "Pas encore de transcription",
  previewTranscriptEmptyDescription:
    "Utilise la voix ou le texte pour commencer. Ta conversation apparaîtra ici.",
  noConversationYet: "Aucune conversation pour l'instant",
  expandedTranscriptEmptyDescription:
    "Utilise la voix ou le texte pour commencer. Ferme cet écran lorsque tu souhaites revenir à la scène principale.",
  transcriptSelectionHint:
    "Sélectionne directement le texte d’un message, ou partage et copie des messages individuels ci-dessous.",
  textMessagePlaceholder: "Tape un message",
  sendTextMessage: "Envoyer un message",
  showVoiceInput: "Afficher la saisie vocale",
  showTextInput: "Afficher la saisie de texte",
  usageStatsHiddenDescription: "Garde les estimations de jetons en dehors de la transcription UI.",
  usageStatsVisibleDescription:
    "Afficher l'utilisation estimée des jetons pour les réponses et les totaux des conversations.",
  debugLogButton: "Bouton du journal de débogage",
  debugLogButtonHiddenDescription:
    "Garde le bouton LOG de l’écran d’accueil masqué à moins qu’une capture ne soit déjà en cours.",
  debugLogButtonVisibleDescription:
    "Affiche le bouton LOG de l'écran d'accueil pour démarrer et arrêter les captures de débogage.",
  debugLogButtonUsageDescription:
    "Comment utiliser le bouton : l'activer lancera la capture des journaux. Le désactiver arrêtera la capture des journaux et déplacera ceux capturés dans le presse-papiers.",
  estimatedUsageTitle: "Utilisation estimée",
  estimatedUsageCounts: ({ replies, summaries }) =>
    `${replies} réponses · ${summaries} mises à jour de la mémoire`,
  estimatedUsageConversationScope:
    "Les totaux incluent chaque route et chaque modèle utilisés dans cette conversation.",
  estimatedPromptTokens: ({ count }) => `Invite : ${count}`,
  estimatedReplyTokens: ({ count }) => `Réponse : ${count}`,
  estimatedTotalTokens: ({ count }) => `Total : ${count}`,
  estimatedUsageInline: ({ prompt, completion, total }) =>
    `Env. ${prompt} en entrée · ${completion} en sortie · ${total} au total`,
  searchQuery: "Requête de recherche",
  expandWebSearchDetails: "Afficher les détails de la recherche sur le Web",
  collapseWebSearchDetails: "Masquer les détails de la recherche sur le Web",
  webSearchSourceCount: ({ count }) =>
    `${count} ${Number(count) === 1 ? "source" : "sources"}`,
  sources: "Sources",
  openSourceLink: ({ source }) => `Ouvrir la source : ${source}`,
  turnReceipt: "Détails du tour",
  expandTurnReceipt: "Afficher les détails du tour",
  collapseTurnReceipt: "Masquer les détails du tour",
  turnReceiptDirect: "Direct",
  turnReceiptRequested: "Route de réponse demandée",
  turnReceiptActual: "Route de réponse réelle",
  turnReceiptEffort: "Contrôle du raisonnement",
  turnReceiptProviderNative: "natif du fournisseur",
  turnReceiptInput: "Route d'entrée",
  turnReceiptSearch: "Recherche sur le Web",
  turnReceiptVoice: "Sortie vocale",
  turnReceiptContext: "Contexte",
  turnReceiptTiming: "Timing",
  turnReceiptFallback: "Raison de repli",
  turnReceiptVoiceInput: "Voix",
  turnReceiptTypedInput: "Tapé",
  turnReceiptSystemSpeech: "Reconnaissance vocale du système",
  turnReceiptSystemVoice: "Voix du système",
  turnReceiptSystemVoiceFallback: "Voix du système · route de secours",
  turnReceiptOff: "Désactivé",
  turnReceiptNotConfigured: "Activé · non configuré",
  turnReceiptFallbackWithoutSearch: "Suite sans recherche en direct",
  turnReceiptNotUsed: "Non utilisé",
  turnReceiptSummaryReused: "résumé enregistré réutilisé",
  turnReceiptSummaryUpdated: "résumé mis à jour",
  turnReceiptContextFallback: "solution de secours pour les messages récents",
  turnReceiptGatewayCompression: ({ original, compressed }) =>
    `passerelle : ${original} messages compressés en ${compressed}`,
  turnReceiptContextValue: ({ sent, total, summarized, state }) =>
    `${sent}/${total} messages précédents envoyés · ${summarized} nouvellement résumés${state}`,
  turnReceiptTimingStt: "STT",
  turnReceiptTimingContext: "contexte",
  turnReceiptTimingSearch: "recherche",
  turnReceiptTimingModel: "modèle",
  turnReceiptTimingFirstSpeech: "première parole",
  turnReceiptTimingTotal: "total",
  estimatedRouteUsageTokensOnly: ({ tokens }) => `${tokens} jetons`,
  unknownUsageRoute: "Route inconnue",
  setupGuideConnectProviderTitle: "Configurer les informations d'identification",
  setupGuideConnectProviderDescription:
    "Ajoute des informations d'identification dans Paramètres, puis choisis les routes que tu souhaites utiliser.",
  idle: "Inactif",
  yourConversationAppearsHere: "Ta conversation apparaît ici",
  defaultTranscriptEmptyDescription:
    "Utilise la voix ou le texte pour commencer. Je conserverai le fil de discussion et je répondrai ici.",
  delete: "Supprimer",
  deleteConversationConfirmationTitle: ({ title }) => `Supprimer « ${title} » ?`,
  deleteConversationConfirmationMessage:
    "Cela supprime définitivement la conversation et tous ses messages. Cette action ne peut pas être annulée.",
  conversations: "Conversations",
  drawerSubtitle: "Passe d’un fil de discussion à l’autre ou démarre une nouvelle salle.",
  newSession: "Nouvelle session",
  noSavedConversationsYet: "Aucune conversation enregistrée pour l'instant",
  drawerEmptyDescription:
    "Commence à parler à partir de la vue principale et je créerai automatiquement une session.",
  setupGuideTitle: "Configurer l'application",
  setupGuideSubtitle: "Ajoute des informations d'identification et choisis des routes dans Paramètres.",
  fastestStartPreset: "Configuration minimale",
  fastestStartDescription:
    "Utilise la parole de l'appareil lorsqu'elle est disponible et configure uniquement la route de réponse dont tu as besoin.",
  fullVoicePreset: "Voix configurée",
  fullVoiceDescription:
    "Utilise les services configurés pour les réponses, la transcription et la sortie vocale lorsque tu les choisis.",
  setupGuideNote:
    "Nous ouvrirons ensuite les paramètres afin que tu puisses coller et valider les informations d'identification.",
  useThisSetup: "Utilise cette configuration",
  notNow: "Pas maintenant",
  setupGuideIntroTitle: "Comment je fonctionne",
  setupGuideIntroBody:
    "Je pars de zéro. Ajoute des informations d'identification pour les services externes que tu utilises déjà, puis choisis la manière dont les réponses, la saisie vocale, la sortie vocale et le contexte Web facultatif sont acheminés.",
  setupGuideIntroNote:
    "Après la configuration, utilise la commande vocale principale pour démarrer et arrêter une conversation. La transcription actuelle reste disponible sur l'écran d'accueil et chaque route peut être modifiée ultérieurement dans Paramètres.",
  setupGuideProviderTitle: "Ajouter des informations d'identification",
  setupGuideProviderBody:
    "Choisis le service externe que tu souhaites configurer, puis colle les informations d'identification avec accès aux réponses.",
  setupGuideProviderPickerLabel: "Service de réponse",
  setupGuideSelectProvider: "Sélectionne un fournisseur",
  setupGuideSelectProviderFirst: "Sélectionne d'abord un fournisseur.",
  setupGuideApiKeyLabel: "Clé API",
  setupGuideApiKeyPlaceholder: "Coller les identifiants",
  setupGuideContinue: "Continuer",
  setupGuideOpenSettings: "Ouvrir les paramètres",
  setupGuideBack: "Retour",
  setupGuideValidateKey: "Valider la clé",
  setupGuideApiKeyRequiredOrCancel:
    "Ajoute une clé API pour continuer ou annule le guide de configuration.",
  setupGuideProviderAndApiKeyRequiredOrCancel:
    "Choisis un fournisseur et ajoute une clé API pour continuer ou annule le guide de configuration.",
  setupGuideProviderKeyNeedsLlmAccess: ({ provider }) =>
    `Ces informations d'identification ${provider} n'autorisent pas les demandes de réponse.`,
  setupGuideKokoroTitle: "Ajouter une voix naturelle sur l'appareil",
  setupGuideKokoroBody: ({ size }) =>
    `Facultatif : télécharge Kokoro (environ ${size} Mo) pour des réponses orales beaucoup plus naturelles, sans fournisseur vocal ni frais d'utilisation.`,
  setupGuideKokoroLanguageNote:
    "Ce modèle parle actuellement anglais et chinois simplifié. Configure ultérieurement les routes de secours souhaitées dans les paramètres de parole.",
  setupGuideKokoroDownload: "Télécharger Kokoro",
  setupGuideUseKokoro: "Utilise Kokoro pour les réponses vocales",
  setupGuideUseKokoroSummary:
    "Garde la synthèse sur le téléphone chaque fois que la langue de réponse est prise en charge.",
  setupGuideSkipKokoro: "Passer pour l'instant",
  setupGuideVoiceTestTitle: "Teste ta configuration",
  setupGuideVoiceTestBody:
    "Dites une courte phrase. Je testerai l'accès au microphone, la transcription, la route de réponse configurée et la sortie vocale lorsqu'une route vocale acceptable est disponible.",
  setupGuideVoiceTestNoInputBody:
    "La saisie vocale n'est pas disponible avec cette configuration. Continue à examiner les routes détectées, puis ajuste les paramètres vocaux plus tard si nécessaire.",
  setupGuideVoiceTestTextOnlyNote:
    "Ce test reste uniquement en texte car aucune route vocale acceptable n'est encore prête.",
  setupGuideVoiceTestStart: "Démarrer l'essai",
  setupGuideVoiceTestStop: "Arrêter l'enregistrement",
  setupGuideVoiceTestRetry: "Relancer le test",
  setupGuideVoiceTestTranscribing: "Transcription…",
  setupGuideVoiceTestThinking: "Test de la réponse…",
  setupGuideVoiceTestSynthesizing: "Préparation de la voix…",
  setupGuideVoiceTestSpeaking: "Lecture de la réponse…",
  setupGuideVoiceTestTranscript: "Transcription",
  setupGuideVoiceTestReply: "Réponse",
  setupGuideVoiceTestReset: "Effacer ce résultat",
  setupGuideVoiceInputUnavailable:
    "La saisie vocale n'est pas disponible pour cette configuration sur cet appareil.",
  setupGuideSummaryTitle: "Configuration terminée",
  setupGuideSummaryBody:
    "Voici la route que j'utiliserai avec ta configuration actuelle.",
  setupGuideSummaryLlm: "LLM",
  setupGuideSummaryStt: "Parole en texte",
  setupGuideSummaryTts: "Synthèse vocale",
  setupGuideSummaryWebSearch: "Recherche sur le Web",
  setupGuideRouteProviderLlm: ({ provider }) => `Activé via ${provider}`,
  setupGuideRouteOnDeviceStt: "Activé via la reconnaissance vocale du système",
  setupGuideRouteProviderStt: ({ provider }) =>
    `Activé via la transcription vocale ${provider}`,
  setupGuideRouteProviderTts: ({ provider }) => `Activé via la voix ${provider}`,
  setupGuideRouteKokoroTts: "Activé via la voix Kokoro sur l'appareil",
  setupGuideRouteLocalTts: "Activé via le pack vocal local",
  setupGuideRouteUnavailable: "Pas disponible",
  setupGuideRouteOff: "Désactivé",
  setupGuideWebSearchAvailableOff: ({ provider }) =>
    `Disponible via ${provider}, actuellement désactivé`,
  setupGuideSummaryTextOnlyNote:
    "Les réponses orales sont désactivées pour le moment. Les réponses restent sous forme de texte jusqu'à ce que tu actives un fournisseur ou une voix locale.",
  setupGuideFinish: "Terminé",
  searchConversationsPlaceholder: "Rechercher des titres, des modèles et le texte du message",
  noMatchingConversations: "Aucune conversation correspondante",
  noMatchingConversationsDescription:
    "Essaie un autre titre, une autre route, un autre modèle ou une autre phrase de la transcription.",
  noProviderYet: "Pas encore de fournisseur",
  noModelYet: "Pas de modèle pour l'instant",
  startedAt: "Commencé",
  endedAt: "Terminé",
  pinned: "Épinglé",
  copy: "Copier",
  share: "Partager",
  rename: "Renommer",
  pin: "Épingler",
  unpin: "Détacher",
  save: "Sauvegarder",
  cancel: "Annuler",
  stop: "Arrêter",
  pause: "Pause",
  resume: "Reprendre",
  paused: "En pause",
  listening: "Écoute",
  parsing: "Transcription",
  searching: "Recherche",
  converting: "Conversion",
  webSearchAction: "recherche sur le Web",
  thinking: "Pensée",
  speaking: "Parole",
  pleaseWait: "Patiente",
  yourTurn: "À toi",
  keepPressing: "Continue à appuyer",
  tapWhenDone: "Appuie lorsque tu as terminé",
  speechPaused: "La lecture vocale est en pause",
  pausePlaybackUnavailable:
    "Cette route vocale ne peut pas être suspendue. Arrête-la ou passe à la sortie vocale du fournisseur.",
  holdToSpeak: "Maintiens pour parler",
  tapToSpeak: "Appuie pour parler",
  tapAgainToSend: "Appuie à nouveau pour envoyer",
  waitingForReply: "En attente de réponse",
  parsingYourVoice: "Analyser ta voix",
  providerConfiguredInSettings: ({ provider }) =>
    `${provider} n'est pas configuré dans Paramètres.`,
  providerNetworkError: ({ provider, action }) =>
    `Impossible d'atteindre ${provider} pour ${action}. Vérifie la connexion et réessaie.`,
  providerAuthError: ({ provider, action }) =>
    `${provider} a rejeté les informations d'identification pour ${action}. Vérifie la clé et les autorisations API.`,
  providerRateLimitError: ({ provider, action }) =>
    `${provider} limite actuellement le débit de ${action}. Réessaie dans un instant.`,
  providerCreditsRequired: ({ provider, action }) =>
    `${provider} a besoin d'un crédit API suffisant pour ${action}. Vérifie le solde du compte et la limite de dépenses de la clé.`,
  providerTimeoutError: ({ provider, action }) =>
    `${provider} a pris trop de temps pendant ${action}. Réessaie.`,
  providerTemporaryError: ({ provider, action }) =>
    `${provider} a rencontré un problème temporaire pendant ${action}. Réessaie sous peu.`,
  providerEmptyReplyError: ({ provider }) =>
    `${provider} s'est terminé sans renvoyer de réponse. Réessaie.`,
  providerIncompleteReplyError: ({ provider }) =>
    `La réponse de ${provider} s'est interrompue avant d'être complète. Réessaie.`,
  providerContextTooLong: ({ provider }) =>
    `${provider} a rejeté la réponse car la conversation était trop longue. Démarre un nouveau fil de discussion ou raccourcis la demande.`,
  providerRequestRejected: ({ provider, action, detail }) =>
    detail
      ? `${provider} a rejeté la demande ${action} : ${detail}`
      : `${provider} a rejeté la demande ${action}.`,
  providerWebSearchNotRun: ({ provider }) =>
    `${provider} a renvoyé une réponse sans lancer de recherche sur le Web.`,
  providerValidationSuccess: ({ provider }) => `${provider} est prêt à être utilisé.`,
  providerCapabilityValidationSuccess: ({ provider, capability }) =>
    `${provider} ${capability} fonctionne.`,
  providerValidationFailed: "La validation du fournisseur a échoué.",
  webSearchFallback:
    "La recherche sur le Web n'était pas disponible, la réponse s'est donc poursuivie sans contexte Web en direct.",
  noBase64EncoderAvailable: "Aucun encodeur base64 disponible.",
  noBase64DecoderAvailable: "Aucun décodeur base64 disponible.",
  azureSpeechApiKeyFormat:
    "Microsoft Azure TTS nécessite des informations d'identification Azure Speech au format <key>|<region>, par exemple abc123|westeurope, ou au format Azure combiné <endpoint>|<api-key>|<key>|<region>.",
  nativeTtsDoesNotSynthesizeAudioFiles:
    "Le TTS natif ne synthétise pas les fichiers audio.",
  localTtsUnavailableForLanguage: ({ languageLabel }) =>
    `Aucune route vocale locale ou cloud n'est prête pour ${languageLabel}.`,
  chooseTextToSpeechProviderInSettings:
    "Choisis un fournisseur de synthèse vocale dans Paramètres.",
  ttsNotSupportedYet: ({ provider }) => `${provider} TTS n'est pas encore pris en charge.`,
  ttsError: ({ provider, status, errorText }) =>
    `Erreur TTS ${provider} (${status}) : ${errorText}`,
  ttsReplyTooLong: ({ provider }) =>
    `La sortie vocale ${provider} a rejeté la réponse car elle était trop longue.`,
  ttsTimeout: ({ provider }) => `La sortie vocale ${provider} a pris trop de temps.`,
  sttTimeout: ({ provider }) =>
    `La transcription vocale de ${provider} a pris trop de temps.`,
  sttFileSizeLimitExceeded: ({ provider, model, limit }) =>
    `${provider} ${model} n'accepte que les enregistrements jusqu'à ${limit}. Utilise un clip plus court ou change de modèle STT.`,
  voiceInputCaptureIncomplete:
    "La saisie vocale n'a pas pu être capturée proprement. Réessaie.",
  ttsDidNotReturnAudio: ({ provider }) =>
    `${provider} TTS n'a pas renvoyé le son.`,
  nativeSttHandledInApp: "Le système STT est géré directement dans l'application.",
  chooseSpeechToTextProviderInSettings:
    "Choisis un fournisseur de reconnaissance vocale dans Paramètres.",
  sttNotSupportedYet: ({ provider }) => `${provider} STT n'est pas encore pris en charge.`,
  providerNotWiredUpYet: ({ provider }) => `${provider} n'est pas encore câblé.`,
  you: "Toi",
  assistant: "Assistant",
  untitledConversation: "Conversation sans titre",
  conversationExportHeader: ({ title }) => `Conversation : ${title}`,
  speechRecognitionPermissionNotGranted:
    "Autorisation de reconnaissance vocale non accordée.",
  speechRecognitionUnavailableForDeviceLanguage:
    "La reconnaissance vocale n'est pas disponible pour la langue actuelle de l'appareil.",
  nativeSpeechRecognitionNeedsNetwork:
    "La reconnaissance vocale native nécessite actuellement un accès au réseau.",
  noSpeechDetected: "Aucune parole n'a été détectée.",
  nativeSpeechRecognitionFailed: "La reconnaissance vocale native a échoué.",
  couldntStartNativeSpeechRecognition:
    "Impossible de démarrer la reconnaissance vocale native.",
  microphonePermissionNotGranted: "Autorisation du microphone non accordée",
} satisfies TranslationDictionary;
