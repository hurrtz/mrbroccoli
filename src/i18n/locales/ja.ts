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

export const ja = {
  ...conversationArtifactTranslations.ja,
  ...interruptionTranslations.ja,
  ...ulraAuditTranslations.ja,
  ...dataBackupTranslations.ja,
  ...conversationKnowledgeTranslations.ja,
  ...conversationIntegrityTranslations.ja,
  ...imagePromptTranslations.ja,
  ...memoryEditTranslations.ja,
  ...onDeviceTranslations.ja,
  ...onboardingTranslations.ja,
  ...premiumTranslations.ja,
  ...transcriptEditTranslations.ja,
  appName: "ミスター・ブロッコリー",
  retry: "再試行",
  dismiss: "閉じる",
  done: "完了",
  aboutSetting: ({ setting }) => `${setting} について`,
  unavailable: "利用不可",
  selection: "選択",
  chooseCompatibleProviderFirst:
    "まず互換性のあるプロバイダーを選択してください",
  settings: "設定",
  settingsReleaseVersion: ({ version }) => `バージョン ${version}`,
  all: "すべて",
  firstRun: "初回起動",
  instructions: "指示",
  providers: "プロバイダー",
  webSearch: "ウェブ検索",
  stt: "STT",
  tts: "TTS",
  ui: "UI",
  settingsRuntimeReadiness: "ランタイムの準備状況",
  settingsReadinessThink: "思考",
  settingsReadinessListen: "聞き取り",
  settingsReadinessSpeak: "音声出力",
  settingsReadinessSearch: "検索",
  settingsReadinessReady: "準備完了",
  settingsReadinessNeedsAttention: "注意",
  settingsReadinessBroken: "要修正",
  settingsReadinessOff: "オフ",
  settingsConnections: "接続",
  settingsThinking: "思考",
  settingsListening: "聞き取り",
  settingsSpeaking: "音声出力",
  settingsSearch: "検索",
  settingsAppDiagnostics: "アプリと診断",
  settingsGuidedSetup: "ガイド付きセットアップ",
  settingsGuidedSetupSummary: "接続を確認し、完全な音声ルートをテストします。",
  setupGuideShowInSettings: "設定でガイド付きセットアップを表示",
  setupGuideShowInSettingsSummary:
    "設定概要でガイド付きセットアップのショートカットを表示または非表示にします。",
  settingsConnectionsSummary: "プロバイダーのキー、検証、および機能。",
  settingsThinkingSummary:
    "ホームカード、モデル、推論レベル、システムプロンプト。",
  settingsListeningSummary: "入力モードと音声からテキストへのルーティング。",
  settingsSpeakingSummary: "読み上げ、再生方法、音声、プレビュー。",
  settingsSearchSummary: "Web 検索プロバイダーと検索品質管理。",
  settingsAppDiagnosticsSummary:
    "テーマ、言語、使用法、デバッグ ログ、および最近のアクティビティ。",
  settingsBackToOverview: "概要に戻る",
  settingsOpenSection: ({ section }) => `${section} を開く`,
  theme: "テーマ",
  language: "言語",
  recognitionLanguage: "認識言語",
  recognitionLanguageHint:
    "認識精度を高めるには言語を選択します。デバイスまたはプロバイダーに判定させる場合は「自動」のままにします。",
  automaticLanguage: "自動",
  speechLanguageUnsupportedByProvider: ({ provider, language }) =>
    `${provider} は、この音声ルートでは ${language} を正式にサポートしていません。`,
  usageStats: "使用状況統計",
  model: "モデル",
  effort: "推論レベル",
  effortValue: ({ effort }) => `推論レベル: ${effort}`,
  modelEffortNone: "なし",
  modelEffortMinimal: "最小限",
  modelEffortLow: "低",
  modelEffortMedium: "中",
  modelEffortHigh: "高",
  modelEffortExtraHigh: "最高",
  modelEffortMax: "最大",
  modelEffortDynamic: "動的",
  modelEffortDisabled: "無効",
  modelEffortEnabled: "有効",
  fixed: "固定",
  english: "英語",
  german: "ドイツ語",
  ukrainian: "ウクライナ語",
  hindi: "ヒンディー語",
  spanish: "スペイン語",
  french: "フランス語",
  italian: "イタリア語",
  portuguese: "ポルトガル語",
  portugueseBrazil: "ポルトガル語 (ブラジル)",
  russian: "ロシア語",
  simplifiedChinese: "簡体字中国語",
  arabic: "アラビア語",
  japanese: "日本語",
  hungarian: "ハンガリー語",
  czech: "チェコ語",
  polish: "ポーランド語",
  turkish: "トルコ語",
  swedish: "スウェーデン語",
  urdu: "ウルドゥー語",
  kokoroAmericanFemaleVoice: ({ name }) => `${name} · アメリカ英語・女性`,
  kokoroBritishFemaleVoice: ({ name }) => `${name} · イギリス英語・女性`,
  kokoroChineseFemaleVoice: ({ index }) => `中国語・女性 ${index}`,
  kokoroChineseMaleVoice: ({ index }) => `中国語・男性 ${index}`,
  light: "ライト",
  dark: "ダーク",
  system: "システム",
  languageCoverage: ({ note }) => `対応言語: ${note}`,
  recordingLimits: ({ note }) => `録音制限: ${note}`,
  catalogProviderPricingSummary: ({ summary }) => `価格: ${summary}`,
  replyGenerationAction: "応答の生成",
  speechTranscriptionAction: "音声文字起こし",
  speechSynthesisAction: "音声合成",
  instructionsTabDescription:
    "プロバイダーがリクエストを確認する前に、アシスタントを操作する隠れたガイダンスを作成します。",
  providersTabDescription:
    "外部サービスの認証情報をデバイスに保存し、使用する応答モードを構成します。",
  webSearchTabDescription:
    "返信前にオプションのライブ Web コンテキストを構成します。",
  responseModes: "モデルの選択",
  aboutModelSelection: "モデル選択について",
  modelSelectionInfo:
    "各モデルカードはホーム画面での選択肢になります。プロバイダー、モデル、およびオプションのエフォート レベルを設定し、カードを切り替えて次にどのモデルが応答するかを選択します。",
  responseModeItemTitle: ({ index }) => `モデル ${index}`,
  addResponseMode: "モデルを追加",
  removeResponseMode: "モデルを削除",
  responseModesNoConfiguredProviders:
    "最初に資格情報を追加します。少なくとも 1 つの互換性のあるサービスが設定されるまで、ルート コントロールは非表示のままになります。",
  useResponseMode: ({ mode }) => `${mode}を使用`,
  chooseResponseModel: "モデルを選択",
  responseModelCount: ({ count }) => `${count}件のモデルを利用できます`,
  ulraMode: "究極モード",
  ulraModeHomeLabel: "ホーム画面に究極モードを表示",
  ulraModeSettingsDescription:
    "ホーム画面のモデルが2件以上使用可能なときに、複数モデルによる検討を有効にします。",
  ulraModeInfo:
    "究極モードは、まずホーム画面で使用可能な各モデルに個別に回答を求めます。各レビューラウンドでは、全モデルが各参加者の最新の見解を批判的に検証し、明示的な全員一致に達すると残りのラウンドを省略します。選択中のモデルが各モデルの最新見解を必ず保持しながら、成功したラウンドから最終回答をまとめます。検討内容は関係するすべてのプロバイダーと共有されます。",
  ulraModeRounds: "レビューラウンド",
  ulraModeCallEstimate: ({ count }) =>
    `現在の設定では、1メッセージあたり最大${count}回のモデル呼び出しです。`,
  ulraModeThresholdWarning:
    "モデルが4件を超える場合、またはラウンドが3回を超える場合、非常に時間がかかり、多くのトークンを消費し、プロバイダーのコンテキストやレート制限に達する可能性があります。これは警告のみです。",
  ulraModeFirstUseTitle: "究極モードを有効にしますか？",
  ulraModeFirstUseMessage: ({ calls, models, rounds }) =>
    `${models}件のモデルと最大${rounds}回のレビューラウンドでは、1メッセージで最大${calls}回のモデル呼び出しが行われる可能性があります。大幅に時間と費用が増え、検討内容が関係するすべてのプロバイダーと共有されます。`,
  ulraModeHighRiskTitle: "大規模な究極モード実行",
  ulraModeHighRiskMessage: ({ calls, models, rounds }) =>
    `${models}件のモデルと${rounds}回のレビューラウンドでは、最大${calls}回のモデル呼び出しが行われる可能性があります。非常に時間がかかり、多くのトークンを使用し、プロバイダーの制限に達する場合があります。それでも続行しますか？`,
  ulraModeEnableAction: "有効にする",
  ulraModeNeedsTwoModels:
    "究極モードには、ホーム画面で使用可能なモデルが2つ以上必要です。",
  ulraModeAllModelsFailed:
    "回答を統合する前に、究極モードのすべてのモデルが失敗しました。",
  ulraModePartialFailureNotice: ({ failed, succeeded }) =>
    `${failed}件の内部モデル呼び出しが失敗しました。最終回答には${succeeded}件の成功した提案を使用しました。`,
  sttTabDescription:
    "音声をキャプチャする方法と、モデルに到達する前に音声をテキストに変換するバックエンドを制御します。",
  ttsTabDescription:
    "返信がいつ話し始めるか、およびどのバックエンドが音声出力を処理するかを制御します。",
  brief: "短め",
  briefDescription:
    "回答を簡潔にします。内容を十分に伝えるために必要な最小限の文だけを使います。",
  normal: "通常",
  normalDescription:
    "バランスの取れたレスポンスの長さを目指します。答えを引きずらずに重要なポイントを押さえてください。",
  thorough: "徹底",
  thoroughDescription:
    "深く掘り下げ、包括的になりましょう。ニュアンス、詳細、トレードオフ、重要な理由を含めます。",
  professional: "プロフェッショナル",
  professionalDescription:
    "クライアントに説明する上級コンサルタントのように話します。正確な言葉遣い、俗語のない、慎重で権威のある言葉。",
  casual: "カジュアル",
  casualDescription:
    "カフェで賢い友人と話すように、自然でリラックスした会話調にします。くだけた表現や少しの脱線も構いません。",
  nerdy: "オタク",
  nerdyDescription:
    "深く掘り下げるのが大好きな熱心な専門家のように話します。専門用語を自由に使用し、詳細に興味を持って、ユーザーがついていけると想定してください。",
  concise: "簡潔",
  conciseDescription:
    "完成した状態でできるだけ簡潔にします。前置きや補足はなく、答えだけです。電報のスタイルを考えてみましょう。",
  socratic: "ソクラテス",
  socraticDescription:
    "ユーザーの思考に挑戦します。彼らの言ったことをただ肯定するだけでなく、逆質問をし、別の視点を提供しましょう。イエスマシンではなく、スパーリングパートナーになりましょう。",
  eli5: "ELI5",
  eli5Description:
    "すべてをできるだけ簡単に説明してください。比喩を使用し、日常的な言葉を使用し、専門用語は使用しません。どのトピックについても予備知識がないことを前提としています。",
  useProvider: ({ provider }) => `${provider}を使用`,
  createApiKey: "資格情報",
  apiKey: "API キー",
  aboutThisProvider: "このプロバイダーについて",
  openRouterOnboardingTitle: "1 つのキー、複数のプロバイダー",
  openRouterOnboardingDescription:
    "専用の OpenRouter キーを作成して下に貼り付け、直接接続を置き換えることなく、いくつかのプロバイダーのスナップショットに基づくモデルを使用します。",
  openRouterOnboardingRoute:
    "リクエスト パス: このデバイス → OpenRouter → 選択した上流プロバイダー",
  openRouterKeys: "OpenRouter キー",
  providerStatusInvalid: "無効です",
  providerStatusTesting: "テスト",
  providerStatusConfigured: "設定済み",
  providerStatusWorking: "正常",
  providerStatusNotTested: "テストされていません",
  providerStatusNotSetup: "セットアップされていません",
  expandProvider: ({ provider }) => `${provider} を展開`,
  collapseProvider: ({ provider }) => `${provider}を折りたたむ`,
  testProviderKey: "テストキー",
  testAllCapabilities: "すべてをテスト",
  apiTest: "API テスト",
  testProviderCapability: ({ capability }) => `${capability}をテスト`,
  test: "テスト",
  optional: "オプション",
  providerCapability_llm: "返信",
  providerCapability_stt: "音声入力",
  providerCapability_tts: "音声出力",
  providerCapability_search: "ウェブ検索",
  providerCapability_voices: "音声ライブラリ",
  providerValidationUnavailable:
    "このプロバイダーにはライブ検証がまだ接続されていません。ここでキーを保存し、実際の使用時に検証します。",
  providerNeedsAttention: "注意が必要です",
  catalogProviderLimitsSummary: ({ summary }) => `制限: ${summary}`,
  catalogProviderRegionSummary: ({ summary }) => `地域: ${summary}`,
  validatingKey: "検証中...",
  showKey: "キーを表示",
  hideKey: "キーを非表示にする",
  assistantInstructions: "アシスタントの指示",
  systemPrompt: "システム プロンプト",
  aboutSystemPrompt: "システムプロンプトについて",
  assistantInstructionsIntro:
    "モデルが毎回の返信の前に受け取る隠れたガイダンスを形作ります。",
  baseInstructions: "基本的な指示",
  assistantInstructionsPlaceholder:
    "アシスタントがどのように動作するかを定義します。",
  assistantInstructionsHint:
    "これは常に、選択した応答の長さとトーンの前に追加されます。",
  adaptiveLength: "自動調整",
  responseTone: "応答のトーン",
  homeStyleChipLabel: ({ tone, length }) => `スタイル — ${tone} · ${length}`,
  styleSheetTitle: "会話設定",
  styleSheetSubtitle: "この会話のみの返信と音声を作成します。",
  openStyleSheet: "会話設定を開く",
  conversationThinkingInstructions: "思考の指示",
  conversationThinkingInstructionsDescription:
    "この会話のグローバル システム プロンプトの後に指示を追加します。",
  conversationThinkingInstructionsPlaceholder:
    "例: 私の仮定に異議を唱え、具体的な例を使用してください。",
  ttsInstructions: "話し方の指示",
  ttsInstructionsDescription:
    "互換性のある音声モデルで使用されるトーン、ペース、アクセント、または話し方をガイドします。",
  conversationTtsInstructionsDescription:
    "この会話のグローバル音声指示の後に配信指示を追加します。",
  ttsInstructionsPlaceholder:
    "例: 温かく、はっきりと、リラックスしたペースで話します。",
  ttsInstructionsUnsupported:
    "現在の音声ルートは話し方の指示に対応していません。",
  conversationVoiceDescription: ({ route }) =>
    `この会話で ${route} に使用する音声を選択します。`,
  scrollToLatest: "最新のメッセージまでスクロールします",
  conversationTitleGenerate: "タイトルを自動生成",
  conversationTitleGenerating: "タイトルを生成中…",
  conversationTitleGenerated: "会話の名前が変更されました。",
  conversationTitleNeedsContent:
    "タイトルを生成する前に会話を開始してください。",
  conversationTitleNeedsProvider:
    "タイトルを生成する前に、選択したモデルを設定します。",
  conversationTitleGenerationFailed: "会話のタイトルを生成できませんでした。",
  conversationTitleGenerationTimedOut:
    "タイトルの生成に時間がかかりすぎました。もう一度試してください。",
  inputMode: "入力モード",
  voiceInput: "音声入力",
  pushToTalk: "プッシュトゥトーク",
  pushToTalkDescription:
    "話している間メインボタンを押したままにし、放して送信します。",
  toggleToTalk: "タップして話す",
  toggleToTalkDescription:
    "一度タップして録音を開始し、完了したらもう一度タップします。",
  driveSession: "ドライブモード",
  driveSessionDescription:
    "自動継続がオンの場合、音声で応答するたびに録音が開始されます。話し終わったら、メインボタンをタップします。",
  stopDriveSession: "自動継続を停止",
  repeatDriveReply: "最後の回答を繰り返す",
  continueDriveSession: "自動継続を再開",
  speechToText: "音声からテキストへ",
  appNative: "システム認識",
  nativeSttDescription:
    "オペレーティング システムの音声認識機能を使用します。デバイスの設定に応じて、認識はデバイス上で実行される場合もあれば、システム サービスを通じて実行される場合もあります。プロバイダーキーは必要ありません。",
  provider: "プロバイダー",
  webSearchProvider: "Web 検索プロバイダー",
  webSearchProviderMissingHint:
    "ここで Web グラウンディングを有効にするには、資格情報で少なくとも 1 つの検索可能なサービスを構成します。",
  webSearchModelHint: ({ model }) =>
    `ライブ Web グラウンディングのために舞台裏で ${model} を使用します。`,
  webSearchHomeHint:
    "ホーム画面の切り替えを使用して、このスレッドの Web グラウンディングをオンまたはオフに切り替えます。",
  settingsWebSearchCompactHint:
    "必要に応じて、メイン モデルが応答する前に新しい Web コンテキストを先頭に追加します。",
  webSearchAdvanced: "高度な検索コントロール",
  expandAdvancedSearch: "高度な検索コントロールを拡張する",
  collapseAdvancedSearch: "高度な検索コントロールを折りたたむ",
  webSearchSetupNeeded: "ライブ Web 検索を使用するための資格情報を追加します。",
  webSearchEnabledDescription:
    "モデルが応答する前に、新しい Web コンテキストが追加されます。",
  webSearchDisabledDescription:
    "現在の事実が重要な場合は、このスレッドのライブ Web コンテキストを使用してください。",
  webSearchQualityControls: "検索品質",
  webSearchSearchMode: "検索モード",
  webSearchSearchModeQuick: "クイック",
  webSearchSearchModeBalanced: "バランスのとれた",
  webSearchSearchModeDeep: "深い",
  webSearchDepth: "検索深度",
  webSearchDepthStandard: "標準",
  webSearchDepthDeep: "深い",
  webSearchResultCount: "結果数",
  webSearchQualityHint: ({ provider }) =>
    `これらのコントロールは、${provider} が応答前に新しいコンテキストを収集する方法を調整します。`,
  webSearchNoExtraControls: ({ provider }) =>
    `${provider} は、このアプリで追加の検索品質コントロールをまだ公開していません。`,
  setWebSearchMode: ({ mode }) => `ウェブ検索モードを ${mode} に設定します`,
  openWebSearchSettings: "Web 検索設定を開く",
  providerSttDescription:
    "設定された外部サービスを使用して、応答ルートに送信される前に音声を文字に起こします。",
  sttProvider: "STT プロバイダー",
  sttProviderEnabledHint:
    "文字起こしサポートが有効なプロバイダーのみがここに表示されます。",
  sttProviderMissingHint:
    "STT サポートを備えたサービスの資格情報を追加して、ここで選択します。",
  nativeSttHint:
    "システム認識はプロバイダー キーとは独立して機能し、デバイス上またはオペレーティング システムの音声サービスによって処理される場合があります。",
  replyPlayback: "返信再生",
  sentencesArrive: "段落ごと",
  sentencesArriveDescription:
    "段落が完成した時点ですぐに読み上げを開始します。",
  fullReplyFirst: "全文を生成してから",
  fullReplyFirstDescription:
    "最初に答え全体を生成し、それを 1 パスで再生します。",
  textToSpeech: "テキスト読み上げ",
  spokenReplies: "音声による応答",
  spokenRepliesEnabledDescription:
    "音声ルートが利用できる場合、アシスタントの回答を読み上げます。",
  spokenRepliesDisabledDescription:
    "今のところ、返信はテキストのみにしておきます。優先した TTS ルートは、後で使用できるように保存されます。",
  nativeTtsDescription:
    "音声による応答と音声プレビューにデバイスの音声エンジンを使用します。",
  kokoroTtsDescription:
    "より自然なニューラル音声をこのデバイス上だけで使用します。回答はローカルで合成され、音声プロバイダーのキーや利用料金は不要です。",
  kokoroVoices: "ココロのデバイス上の音声",
  kokoroVoicesHint: ({ size, installedSize }) =>
    `多言語モデルは約 ${size} MB をダウンロードし、インストール後に約 ${installedSize} MB を占有します。`,
  kokoroModel: "ココロ多言語モデル",
  kokoroChecking: "デバイスのモデルを確認しています…",
  kokoroDownloading: ({ progress }) => `ダウンロード中… ${progress}%`,
  kokoroExtracting: ({ progress }) => `インストール中… ${progress}%`,
  kokoroVerifying: "音声エンジンを検証しています…",
  kokoroInstalled: "このデバイスにインストールされ、準備が完了しました。",
  kokoroNotInstalled:
    "オプションのダウンロード。プロバイダーキーは必要ありません。",
  kokoroLanguageFallback:
    "ココロは現在ここで英語と簡体字中国語を話します。他の選択した応答言語の場合は、明示的なフォールバック ルートを追加しないと、音声がエラーで停止します。",
  kokoroRemoveTitle: "ココロモデルを削除しますか?",
  kokoroRemoveBody: ({ installedSize }) =>
    `これにより、約 ${installedSize} MB が解放されます。モデルはいつでも再度ダウンロードできます。`,
  removeKokoroModel: "ココロモデルを削除",
  downloadKokoroModel: "ココロモデルをダウンロードする",
  kokoroFallbackNeeded: ({ languages }) =>
    `明示的なフォールバック ルートが ${languages} に必要です。`,
  kokoroNoSelectedLanguages:
    "「聞く言語」で「英語」または「簡体字中国語」を選択して、ココロの音声を設定します。",
  expandVoiceSettings: ({ language }) => `${language} 音声設定を展開します`,
  collapseVoiceSettings: ({ language }) => `${language} 音声設定を折りたたむ`,
  remove: "削除",
  voiceOutputDescription:
    "音声エンジン、リスニング言語、音声応答の音声プレビューを選択します。",
  localTts: "ローカル",
  localTtsDescription:
    "音声応答には、一致するダウンロードされたローカル音声を使用します。",
  providerTtsDescription: "選択した構成済みサービスを音声応答に使用します。",
  ttsFallbackRoutes: "フォールバック ルート",
  ttsFallbackRoutesHint:
    "オプション。必要なルートのみを、試行する順序で追加します。ルートが話し始めると、ミスター・ブロッコリーは残りの応答の間ルート上に留まります。",
  ttsFallbackNone:
    "フォールバックは設定されていません。音声ルートに失敗した場合はエラーを表示します。",
  ttsFallbackPosition: ({ position, route }) => `${position}。 ${route}`,
  addFallbackRoute: ({ route }) => `${route} フォールバックを追加`,
  removeFallbackRoute: ({ route }) => `${route} フォールバックを削除`,
  moveFallbackEarlier: ({ route }) => `${route}を前に移動`,
  moveFallbackLater: ({ route }) => `${route}を後で移動`,
  ttsProvider: "TTS プロバイダー",
  ttsProviderEnabledHint:
    "音声応答サポートが有効なプロバイダーのみがここに表示されます。",
  ttsProviderMissingHint:
    "TTS サポートを備えたサービスの資格情報を追加して、ここで選択します。",
  localTtsOrderHint:
    "明示的に設定されたフォールバック ルートのみが試行されます。",
  providerTtsOrderHint:
    "明示的に設定されたフォールバック ルートのみが試行されます。",
  nativeTtsHint:
    "ネイティブ TTS はシステム音声スタックを使用し、プロバイダー キーを必要としません。",
  localTtsLanguageCoverageHint:
    "ローカル パックは現在、英語、ドイツ語、簡体字中国語、スペイン語、ポルトガル語、ヒンディー語、フランス語、イタリア語をカバーしています。",
  ttsVoice: "TTS 音声",
  refresh: "リフレッシュ",
  providerVoiceDirectory: ({ provider }) => `${provider} 音声ライブラリ`,
  refreshProviderVoices: ({ provider }) => `${provider} の音声を更新`,
  providerVoicesAvailable: ({ count, provider }) =>
    `${provider}から${count}件の音声を利用できます。`,
  providerVoicesLoadFailed:
    "音声を更新できませんでした。現在の選択内容は変更されません。音声 ID を手動で入力することもできます。",
  providerVoicesLoadFailedWithFallback:
    "アカウントの音声を読み込めませんでした。内蔵音声は引き続き利用可能です。",
  providerVoicesErrorDetail: ({ detail }) => `理由: ${detail}`,
  elevenLabsVoicesReadPermissionHint:
    "ElevenLabsでこのAPIキーを編集し、「Voices → Read」を有効にしてから、ここで更新してください。",
  providerVoicesLoadingHint: ({ provider }) =>
    `ミスター・ブロッコリーは、${provider} から利用可能な音声を自動的にロードします。`,
  providerVoiceId: "音声ID",
  providerVoiceIdPlaceholder: "音声 ID を入力してください",
  providerVoiceIdFallbackHint:
    "音声ライブラリをロードできない場合でも、手動入力は利用可能です。",
  providerVoiceIdRequired: ({ provider }) =>
    `音声出力を使用する前に、${provider} 音声ライブラリを更新するか、音声 ID を入力してください。`,
  qwenSpeechUnavailableInUs:
    "ミスター・ブロッコリーの現在のQwen音声ルートは米国リージョンでは利用できません。Qwenの音声機能にはシンガポールまたは北京を選択してください。",
  qwenApiRegion: "Qwen API リージョン",
  qwenRegionSingapore: "シンガポール",
  qwenRegionUs: "米国 (バージニア)",
  qwenRegionBeijing: "中国 (北京)",
  qwenRegionHint:
    "選択したリージョンは、この API キーが作成されたリージョンと一致する必要があります。",
  qwenRegionUsSpeechHint:
    "米国地域キーは、ここでチャットと Web 検索をサポートします。ミスター・ブロッコリーの現在の Qwen STT および TTS ルートには、シンガポールまたは北京のキーが必要です。",
  providerDefaultVoiceHint:
    "このプロバイダーは現在、プレビューおよび音声応答にデフォルトの音声を使用しています。",
  listenLanguages: "読み上げ言語",
  listenLanguagesHint:
    "聞こえの良い返信言語を選択してください。ミスター・ブロッコリーは、音声出力をルーティングするときに、この順序でそれらを試行します。",
  listenLanguagesSelected: ({ count }) =>
    count === 1
      ? "1 つの言語が選択されました"
      : `${count} 言語が選択されました`,
  localVoicePacks: "ローカル音声パック",
  localVoicePacksHint:
    "言語ごとにローカル音声を選択できます。使用する音声パックだけをダウンロードしてください。",
  localVoiceForLanguage: ({ languageLabel }) => `${languageLabel} の声`,
  providerVoicePreviews: "プロバイダー音声プレビュー",
  providerVoicePreviewsHint:
    "現在選択されている TTS ルートを、応答言語ごとに個別のプレビュー テキストを使用してここでテストします。",
  nativeVoicePreviewSection: "ネイティブ音声プレビュー",
  nativeVoicePreviewSectionHint:
    "これは電話機の内蔵音声合成装置を介して直接話すため、設定されたプロバイダーの音声と比較できます。",
  nativeVoiceUnavailable:
    "このデバイスはプレビュー用のネイティブ システム音声を報告しませんでした。",
  runtimeCompatibilityOverrides: "実行時の互換性",
  runtimeCompatibilityOverridesDescription: ({ count }) =>
    `プロバイダーが利用不可と確認したモデルまたは設定の構成 ${count} 件を、この端末だけで無効にしています。ミスター・ブロッコリーが自動的に回避します。`,
  clearRuntimeCompatibilityOverrides: "実行時の互換性を消去",
  clearRuntimeCompatibilityOverridesConfirmationTitle:
    "実行時の互換性を消去しますか？",
  clearRuntimeCompatibilityOverridesConfirmationMessage:
    "以前無効にした構成を再試行できるようになります。プロバイダーが再び拒否する場合があります。",
  speechDiagnostics: "最近の音声処理",
  speechDiagnosticsHint:
    "最新の音声リクエスト、リクエストされたルート、実際に使用されたルート、およびフォールバック理由を表示します。",
  clearSpeechDiagnostics: "最近の音声処理を消去",
  speechDiagnosticsEmpty:
    "最近の音声リクエストはまだありません。ここで音声をプレビューするか、回答を再生してルーティングの詳細を確認できます。",
  clearSpeechDiagnosticsConfirmationTitle: "最近の音声処理を消去しますか？",
  clearSpeechDiagnosticsConfirmationMessage:
    "これにより、キャプチャされた音声ルーティング診断がすべて削除されます。この操作は元に戻すことができません。",
  speechDiagnosticSourceConversation: "会話の返信",
  speechDiagnosticSourceRepeat: "返信を繰り返す",
  speechDiagnosticSourcePreview: "音声プレビュー",
  speechDiagnosticSourceUnknown: "音声リクエスト",
  speechDiagnosticRouteLine: ({ requested, actual }) =>
    `要求: ${requested} -> 実際: ${actual}`,
  speechDiagnosticStageLine: ({ stage }) => `最新ステージ: ${stage}`,
  speechDiagnosticLanguageLine: ({ languageLabel }) => `言語: ${languageLabel}`,
  speechDiagnosticProviderLine: ({ provider }) => `プロバイダー: ${provider}`,
  speechDiagnosticVoiceLine: ({ voice }) => `声: ${voice}`,
  localTtsPackReady: "このデバイスにインストールされています。",
  localTtsPackBroken:
    "ダウンロードされましたが、この音声はこのデバイスでのローカル検証に失敗しました。再ダウンロードするか、別の音声を選択してください。",
  localTtsPackMissing:
    "まだインストールされていません。ダウンロードするまではクラウド TTS またはシステム音声が使用されます。",
  localTtsUnsupportedLanguageFallback:
    "この言語ではローカル パックがまだ利用できません。クラウド TTS またはシステム音声が処理します。",
  downloadingLocalTtsPack: ({ progress }) =>
    `ローカル パックをダウンロード中... ${progress}%`,
  download: "ダウンロード",
  downloadingShort: "読み込み中...",
  voicePreviewText: "音声プレビューテキスト",
  voicePreviewPlaceholder: "この音声を聞くにはフレーズを入力してください。",
  voicePreviewHint:
    "言語モデルには何も送信せずに、現在選択されている応答音声バックエンドを使用します。",
  previewVoice: "プレビュー音声",
  generatingPreview: "プレビューを生成中...",
  playingPreview: "プレビューを再生中...",
  systemVoice: "システム音声",
  spokenRepliesOff: "テキストのみ",
  noTtsProvider: "TTS プロバイダーがありません",
  nothingToCopyYet: "まだコピーするものがありません。",
  couldntCopyText: "そのテキストをコピーできませんでした。",
  nothingToShareYet: "まだ共有できるものはありません。",
  couldntShareText: "そのテキストを共有できませんでした。",
  couldntReplayReply: "その返信を再生できませんでした。",
  replyFailed: "応答に失敗しました",
  retryReply: "返信を再試行",
  replyFailedHint: "再試行する前に、上記の別のモデルを選択できます。",
  spokenReplyFailed: "返信は保存されましたが、話すことができませんでした。",
  retrySpeech: "読み上げを再試行",
  openSpeakingSettings: "音声出力設定を開く",
  messageCopied: "メッセージがコピーされました。",
  noConversationToCopyYet: "コピーする会話がまだありません。",
  noConversationToShareYet: "共有する会話はまだありません。",
  noReplyToRepeatYet: "繰り返せる回答はまだありません。",
  threadCopied: "スレッドがコピーされました。",
  threadRenamed: "スレッドの名前が変更されました。",
  threadPinned: "スレッドが固定されました。",
  threadUnpinned: "スレッドの固定が解除されました。",
  addProviderKeyToUseProvider: ({ provider }) =>
    `このルートを使用する前に、設定で ${provider} の資格情報を追加してください。`,
  configureCredentialsBeforeVoiceSession:
    "音声セッションを開始する前に、設定に資格情報を追加してください。",
  endpointCredentialFormatInvalid: ({ provider }) =>
    `${provider} には、プロバイダーのベース URL と API キーを https://your-endpoint.example.com|your-api-key として入力します。`,
  speechRecognitionUnavailableOnDevice:
    "このデバイスでは音声認識を利用できません。",
  debugLogLabel: "ログ",
  debugLogCaptureStarted: "デバッグログが開始されました。",
  debugLogCaptureStopped: ({ entryCount, fileName }) =>
    `デバッグ ログは ${fileName} として保存され、クリップボードにコピーされました (${entryCount} エントリ)。`,
  debugLogCaptureStoppedNoClipboard: ({ entryCount, fileName }) =>
    `デバッグ ログは ${fileName} (${entryCount} エントリ) として保存されました。`,
  debugLogCaptureRecovered: ({ entryCount, fileName }) =>
    `以前のデバッグ ログ ${fileName} を回復し、クリップボード (${entryCount} エントリ) にコピーしました。`,
  debugLogCaptureRecoveredNoClipboard: ({ entryCount, fileName }) =>
    `以前のデバッグ ログ ${fileName} (${entryCount} エントリ) を回復しました。`,
  debugLogCaptureFailed: "デバッグ ログを保存できませんでした。",
  chooseSttBeforeVoiceSession:
    "音声セッションを開始する前に、設定で構成された STT ルートを選択してください。",
  chooseTtsBeforeSpokenReplies:
    "音声応答を使用する前に、設定で構成された TTS ルートを選択してください。",
  stopSessionBeforeReplay:
    "最後の応答を再生する前に、アクティブな音声セッションを停止します。",
  couldntCatchThatTryAgain: "聞き取れませんでした。もう一度試してください。",
  couldntStartVoiceInput: "音声入力を開始できませんでした。",
  couldntProcessVoiceInput: "音声入力を処理できませんでした。",
  maxRecordingLengthReached:
    "録音時間の上限に達しました。録音した内容を送信します。",
  sttRecordingTooLarge: ({ provider, limit }) =>
    `その録音は ${provider} 音声テキスト変換 (最大 ${limit}) ​​には長すぎます。短いメッセージを試すか、Speech-to-Text をシステム認識に切り替えてください。`,
  addProviderKeyToEnableProvider: ({ provider }) =>
    `このルートを使用する前に、設定で ${provider} の資格情報を追加してください。`,
  stopSessionBeforePreview:
    "音声をプレビューする前に、アクティブな音声セッションを停止してください。",
  chooseTtsToPreviewVoices:
    "設定で構成された TTS ルートを選択して音声をプレビューします。",
  downloadSelectedLocalVoiceFirst: ({ languageLabel }) =>
    `先に選択した${languageLabel}のローカル音声をダウンロードしてください。`,
  couldntPreviewVoice: "音声をプレビューできませんでした。",
  spokenRepliesDisabled: "音声応答は設定でオフになっています。",
  providerVoiceFallback:
    "設定された音声ルートが失敗しました。この返信をフォールバック音声に切り替えました。",
  localVoiceFallback:
    "ローカル音声が利用できませんでした。この返信をフォールバック音声に切り替えました。",
  localTtsPackInstalled: ({ languageLabel }) =>
    `${languageLabel} ローカル音声パックがインストールされています。`,
  localTtsPackInstallFailed:
    "ローカル音声パックをインストールできませんでした。",
  clear: "クリア",
  voiceOutput: "音声出力",
  speechReplayCache: "音声再生キャッシュ",
  speechReplayCacheDescription:
    "プロバイダーが生成した音声はこの端末に最大14日間保存されるため、返答を再生しても音声クレジットを再度消費しません。",
  clearSpeechReplayCache: "音声キャッシュを消去",
  speechReplayCacheCleared: "キャッシュされた音声ファイルを削除しました。",
  speechReplayCacheClearFailed: "音声キャッシュを消去できませんでした。",
  currentSetup: "現在のセットアップ",
  listeningToYourVoice: "音声を聞き取っています",
  parsingYourVoiceInput: "音声をテキストに変換しています",
  preparingRequest: "リクエストを準備しています",
  searchingTheWeb: "最新情報をウェブで検索しています",
  waitingForProvider: ({ provider }) => `${provider}を待っています`,
  preparingVoiceWithProvider: ({ provider }) =>
    `${provider} で音声を準備しています`,
  deepThinkingReassurance: "良い答えを得るには少し時間がかかります…",
  thinkingElapsed: ({ detail, seconds }) => `${detail} · ${seconds}s`,
  speakingBackToYou: "回答を読み上げています",
  freshSession: "新しいセッション",
  messageCount: ({ count }) =>
    Number(count) === 1 ? "1 メッセージ" : `${count} メッセージ`,
  speechInputRoute: ({ route }) => `音声入力: ${route}`,
  replyModelRoute: ({ route }) => `返信モデル: ${route}`,
  voiceOutputRoute: ({ route }) => `音声出力: ${route}`,
  fallbackVoiceOutputRoute: ({ route }) => `フォールバック音声出力: ${route}`,
  conversation: "会話",
  conversationActions: "会話アクション",
  statusDetails: "ステータスの詳細",
  persistenceFailure:
    "ミスター・ブロッコリーはこのデバイスにデータを保存できませんでした。アプリを開いたままにして、もう一度試してください。最近の変更は再起動後に失われる可能性があります。",
  show: "表示",
  showTranscript: "トランスクリプトを表示",
  hide: "非表示",
  copyThread: "スレッドをコピー",
  shareThread: "スレッドを共有",
  repeatReply: "返信を繰り返す",
  renameThread: "スレッドの名前を変更",
  renameThreadHint:
    "この会話に後ですぐに見つけられるタイトルを付けてください。",
  threadTitle: "スレッドタイトル",
  noTranscriptYet: "トランスクリプトはまだありません",
  previewTranscriptEmptyDescription:
    "音声またはテキストを使用して始めてください。あなたの会話がここに表示されます。",
  noConversationYet: "まだ会話がありません",
  expandedTranscriptEmptyDescription:
    "音声またはテキストを使用して始めてください。メインステージに戻りたい場合はこの画面を閉じてください。",
  transcriptSelectionHint:
    "メッセージ テキストを直接選択するか、以下の個々のメッセージを共有してコピーします。",
  textMessagePlaceholder: "メッセージを入力してください",
  sendTextMessage: "メッセージを送信",
  showVoiceInput: "音声入力を表示",
  showTextInput: "テキスト入力を表示",
  usageStatsHiddenDescription:
    "トークン推定値をトランスクリプト UI に表示しないようにします。",
  usageStatsVisibleDescription:
    "返信および会話の合計に対する推定トークン使用量を表示します。",
  debugLogButton: "デバッグログボタン",
  debugLogButtonHiddenDescription:
    "キャプチャがすでに実行されている場合を除き、ホーム画面の LOG ボタンを非表示にしておきます。",
  debugLogButtonVisibleDescription:
    "デバッグ キャプチャを開始および停止するためのホーム画面の [LOG] ボタンを表示します。",
  debugLogButtonUsageDescription:
    "ボタンの使用方法: ボタンをオンにすると、ログのキャプチャが開始されます。これをオフに切り替えると、ログのキャプチャが停止され、キャプチャされたログがクリップボードに移動されます。",
  estimatedUsageTitle: "推定使用量",
  estimatedUsageCounts: ({ replies, summaries }) =>
    `${replies} 応答 · ${summaries} メモリ更新`,
  estimatedUsageConversationScope:
    "合計には、この会話内で使用されたすべてのルートとモデルが含まれます。",
  estimatedPromptTokens: ({ count }) => `プロンプト: ${count}`,
  estimatedReplyTokens: ({ count }) => `返信: ${count}`,
  estimatedTotalTokens: ({ count }) => `合計: ${count}`,
  estimatedUsageInline: ({ prompt, completion, total }) =>
    `推定値。 ${prompt} 入力 · ${completion} 出力 · ${total} 合計`,
  searchQuery: "検索クエリ",
  expandWebSearchDetails: "Web 検索の詳細を表示",
  collapseWebSearchDetails: "Web 検索の詳細を非表示にする",
  webSearchSourceCount: ({ count }) =>
    `${count} ${Number(count) === 1 ? "ソース" : "情報源"}`,
  sources: "情報源",
  openSourceLink: ({ source }) => `ソースを開く: ${source}`,
  turnReceipt: "ターンの詳細",
  expandTurnReceipt: "ターンの詳細を表示",
  collapseTurnReceipt: "ターンの詳細を非表示にする",
  turnReceiptDirect: "直接",
  turnReceiptRequested: "要求された応答ルート",
  turnReceiptActual: "実際の返信ルート",
  turnReceiptEffort: "推理制御",
  turnReceiptProviderNative: "プロバイダネイティブ",
  turnReceiptInput: "入力ルート",
  turnReceiptSearch: "ウェブ検索",
  turnReceiptVoice: "音声出力",
  turnReceiptContext: "コンテキスト",
  turnReceiptTiming: "タイミング",
  turnReceiptFallback: "フォールバック理由",
  turnReceiptVoiceInput: "音声",
  turnReceiptTypedInput: "入力済み",
  turnReceiptSystemSpeech: "システム音声認識",
  turnReceiptSystemVoice: "システム音声",
  turnReceiptSystemVoiceFallback: "システム音声・フォールバック",
  turnReceiptOff: "オフ",
  turnReceiptNotConfigured: "オン · 未設定",
  turnReceiptFallbackWithoutSearch: "ライブ検索なしで続行",
  turnReceiptNotUsed: "未使用",
  turnReceiptSummaryReused: "保存された概要が再利用される",
  turnReceiptSummaryUpdated: "概要を更新しました",
  turnReceiptContextFallback: "最近のメッセージのフォールバック",
  turnReceiptGatewayCompression: ({ original, compressed }) =>
    `ゲートウェイ圧縮 ${original} から ${compressed} メッセージ`,
  turnReceiptContextValue: ({ sent, total, summarized, state }) =>
    `${sent}/${total} 以前に送信されたメッセージ · ${summarized} 新しく要約された${state}`,
  turnReceiptTimingStt: "STT",
  turnReceiptTimingContext: "コンテキスト",
  turnReceiptTimingSearch: "検索",
  turnReceiptTimingModel: "モデル",
  turnReceiptTimingFirstSpeech: "最初の読み上げ",
  turnReceiptTimingTotal: "合計",
  estimatedRouteUsageTokensOnly: ({ tokens }) => `${tokens} トークン`,
  unknownUsageRoute: "不明なルート",
  setupGuideConnectProviderTitle: "資格情報を構成する",
  setupGuideConnectProviderDescription:
    "[設定] で資格情報を追加し、使用するルートを選択します。",
  idle: "アイドル",
  yourConversationAppearsHere: "あなたの会話がここに表示されます",
  defaultTranscriptEmptyDescription:
    "音声またはテキストを使用して始めます。ミスター・ブロッコリーはスレッドを維持し、ここで応答します。",
  delete: "削除",
  deleteConversationConfirmationTitle: ({ title }) =>
    `「${title}」を削除しますか？`,
  deleteConversationConfirmationMessage:
    "これにより、会話とそのすべてのメッセージが完全に削除されます。この操作は元に戻すことができません。",
  memory: "メモリ",
  conversations: "会話",
  drawerSubtitle:
    "ライブスレッド間をジャンプするか、新しいルームを開始します。",
  newSession: "新しいセッション",
  noSavedConversationsYet: "保存された会話はまだありません",
  drawerEmptyDescription:
    "メインビューから話し始めると、ミスター・ブロッコリーが自動的にセッションを構築します。",
  setupGuideTitle: "アプリを設定する",
  setupGuideSubtitle: "認証情報を追加し、設定でルートを選択します。",
  fastestStartPreset: "最小限のセットアップ",
  fastestStartDescription:
    "利用可能な場合はデバイス音声を使用し、必要な応答ルートのみを設定します。",
  fullVoicePreset: "設定された音声",
  fullVoiceDescription:
    "応答、文字起こし、音声出力に設定されたサービスを選択した場合は、それらのサービスを使用します。",
  setupGuideNote:
    "次に [設定] を開いて、認証情報を貼り付けて検証できるようにします。",
  useThisSetup: "この設定を使用",
  notNow: "今はしない",
  setupGuideIntroTitle: "ミスター・ブロッコリーの仕組み",
  setupGuideIntroBody:
    "ミスター・ブロッコリーは空白で始まります。すでに使用している外部サービスの資格情報を追加し、応答、音声入力、音声出力、およびオプションの Web コンテキストのルーティング方法を選択します。",
  setupGuideIntroNote:
    "セットアップ後、メインの音声コントロールを使用して会話を開始および停止します。現在のトランスクリプトはホーム画面で利用可能なままであり、すべてのルートは後から設定で変更できます。",
  setupGuideProviderTitle: "認証情報の追加",
  setupGuideProviderBody:
    "構成する外部サービスを選択し、応答アクセス権を持つ資格情報を貼り付けます。",
  setupGuideProviderPickerLabel: "返信サービス",
  setupGuideSelectProvider: "プロバイダーを選択してください",
  setupGuideSelectProviderFirst: "最初にプロバイダーを選択してください。",
  setupGuideApiKeyLabel: "API キー",
  setupGuideApiKeyPlaceholder: "資格情報を貼り付ける",
  setupGuideContinue: "続行",
  setupGuideOpenSettings: "設定を開く",
  setupGuideBack: "戻る",
  setupGuideValidateKey: "キーを検証する",
  setupGuideApiKeyRequiredOrCancel:
    "API キーを追加して続行するか、セットアップ ガイドをキャンセルしてください。",
  setupGuideProviderAndApiKeyRequiredOrCancel:
    "プロバイダーを選択して API キーを追加して続行するか、セットアップ ガイドをキャンセルしてください。",
  setupGuideProviderKeyNeedsLlmAccess: ({ provider }) =>
    `これらの ${provider} 資格情報では、応答リクエストは許可されません。`,
  setupGuideKokoroTitle: "自然なオンデバイス音声を追加する",
  setupGuideKokoroBody: ({ size }) =>
    `オプション: 音声プロバイダーや使用料金なしで、はるかに自然な音声応答を得るために、Kokoro (約 ${size} MB) をダウンロードしてください。`,
  setupGuideKokoroLanguageNote:
    "このモデルは現在、英語と簡体字中国語を話します。必要なフォールバック ルートは、後でスピーキング設定で構成します。",
  setupGuideKokoroDownload: "ココロをダウンロード",
  setupGuideUseKokoro: "音声応答にココロを使用する",
  setupGuideUseKokoroSummary:
    "応答言語がサポートされている場合は常に電話で合成を続けます。",
  setupGuideSkipKokoro: "今はスキップしてください",
  setupGuideVoiceTestTitle: "セットアップをテストする",
  setupGuideVoiceTestBody:
    "短い文を言ってください。ミスター・ブロッコリーは、マイクのアクセス、文字起こし、設定された応答ルート、および許容可能な音声ルートが利用可能な場合の音声出力をテストします。",
  setupGuideVoiceTestNoInputBody:
    "このセットアップでは音声入力は利用できません。引き続き検出されたルートを確認し、必要に応じて後で音声設定を調整します。",
  setupGuideVoiceTestTextOnlyNote:
    "受け入れられる音声ルートがまだ準備されていないため、このテストはテキストのみのままです。",
  setupGuideVoiceTestStart: "テストの開始",
  setupGuideVoiceTestStop: "録音を停止",
  setupGuideVoiceTestRetry: "もう一度実行する",
  setupGuideVoiceTestTranscribing: "文字起こし中…",
  setupGuideVoiceTestThinking: "返信をテスト中…",
  setupGuideVoiceTestSynthesizing: "音声を準備中…",
  setupGuideVoiceTestSpeaking: "返信を再生中…",
  setupGuideVoiceTestTranscript: "文字起こし",
  setupGuideVoiceTestReply: "返信",
  setupGuideVoiceTestReset: "この結果をクリア",
  setupGuideVoiceInputUnavailable:
    "このデバイスのこの設定では音声入力は利用できません。",
  setupGuideSummaryTitle: "セットアップ完了",
  setupGuideSummaryBody:
    "これは、ミスター・ブロッコリーが現在の構成で使用するルートです。",
  setupGuideSummaryLlm: "LLM",
  setupGuideSummaryStt: "音声をテキストに変換",
  setupGuideSummaryTts: "テキスト読み上げ",
  setupGuideSummaryWebSearch: "ウェブ検索",
  setupGuideRouteProviderLlm: ({ provider }) => `${provider} 経由で有効化`,
  setupGuideRouteOnDeviceStt: "システム音声認識により有効化",
  setupGuideRouteProviderStt: ({ provider }) =>
    `${provider} 音声文字起こしによって有効化`,
  setupGuideRouteProviderTts: ({ provider }) => `${provider} 音声経由で有効化`,
  setupGuideRouteKokoroTts: "ココロのデバイス上の音声経由で有効化",
  setupGuideRouteLocalTts: "ローカル音声パック経由で有効化",
  setupGuideRouteUnavailable: "利用できません",
  setupGuideRouteOff: "オフ",
  setupGuideWebSearchAvailableOff: ({ provider }) =>
    `${provider} 経由で利用可能、現在オフ`,
  setupGuideSummaryTextOnlyNote:
    "音声応答は現在オフになっています。プロバイダーまたはローカル音声を有効にするまで、応答はテキストのままになります。",
  setupGuideFinish: "完了",
  searchConversationsPlaceholder: "タイトル、モデル、メッセージ テキストを検索",
  noMatchingConversations: "一致する会話はありません",
  noMatchingConversationsDescription:
    "トランスクリプトとは異なるタイトル、ルート、モデル、またはフレーズを試してください。",
  memoryModalTitle: "会話記憶",
  memoryModalDescription:
    "これは、スレッドが古いターンを圧縮するのに十分な長さになると、ミスター・ブロッコリーが引き継ぐコンパクトな要約です。",
  memorySummary: "保存済みの要約",
  memorySummaryEmpty:
    "まだコンパクトなメモリがありません。このスレッドが長くなったら、古いターンはここにまとめられます。",
  summarizedTurnsCount: ({ count }) =>
    Number(count) === 1 ? "1 要約ターン" : `${count} 要約ターン`,
  copyMemory: "メモリのコピー",
  forgetMemory: "メモリを削除",
  memoryCopied: "メモリがコピーされました。",
  memoryCleared: "会話メモリがクリアされました。",
  noConversationToManageYet: "利用可能な会話メモリはまだありません。",
  noProviderYet: "まだプロバイダーがありません",
  noModelYet: "まだモデルがありません",
  startedAt: "開始",
  endedAt: "終了",
  pinned: "ピン留め",
  copy: "コピー",
  share: "シェア",
  rename: "名前を変更",
  pin: "ピン",
  unpin: "ピンを外す",
  save: "保存",
  cancel: "キャンセル",
  stop: "停止",
  pause: "一時停止",
  resume: "再開",
  paused: "一時停止",
  listening: "聞き取り中",
  parsing: "文字起こし",
  searching: "検索中",
  converting: "変換中",
  webSearchAction: "ウェブ検索",
  thinking: "思考中",
  speaking: "読み上げ中",
  pleaseWait: "お待ちください",
  yourTurn: "あなたの番です",
  keepPressing: "押し続ける",
  tapWhenDone: "完了したらタップしてください",
  speechPaused: "読み上げを一時停止しています",
  pausePlaybackUnavailable:
    "この音声ルートは一時停止できません。停止するか、プロバイダーの音声出力に切り替えてください。",
  holdToSpeak: "長押しして話す",
  tapToSpeak: "タップして話す",
  tapAgainToSend: "もう一度タップして送信します",
  waitingForReply: "返信を待っています",
  parsingYourVoice: "音声を解析中",
  providerConfiguredInSettings: ({ provider }) =>
    `${provider} は設定で構成されていません。`,
  providerNetworkError: ({ provider, action }) =>
    `${action}のために${provider}へ接続できませんでした。接続を確認して再試行してください。`,
  providerAuthError: ({ provider, action }) =>
    `${provider} が ${action} の認証情報を拒否しました。 APIキーと権限を確認してください。`,
  providerRateLimitError: ({ provider, action }) =>
    `${provider}は現在、${action}のリクエスト数を制限しています。しばらくしてから再試行してください。`,
  providerCreditsRequired: ({ provider, action }) =>
    `${provider} には、${action} に十分な API クレジットが必要です。アカウントの残高とキーの使用制限を確認してください。`,
  providerTimeoutError: ({ provider, action }) =>
    `${provider} が ${action} 中に時間がかかりすぎました。もう一度やり直してください。`,
  providerTemporaryError: ({ provider, action }) =>
    `${provider} は ${action} 中に一時的な問題が発生しました。しばらくしてからもう一度お試しください。`,
  providerEmptyReplyError: ({ provider }) =>
    `${provider}は回答を返さずに終了しました。もう一度お試しください。`,
  providerIncompleteReplyError: ({ provider }) =>
    `${provider}の回答が完了する前に終了しました。もう一度お試しください。`,
  providerContextTooLong: ({ provider }) =>
    `${provider} は会話が長すぎたので返信を拒否しました。新しいスレッドを開始するか、リクエストを短縮します。`,
  providerRequestRejected: ({ provider, action, detail }) =>
    detail
      ? `${provider} が ${action} リクエストを拒否しました: ${detail}`
      : `${provider} が ${action} リクエストを拒否しました。`,
  providerWebSearchNotRun: ({ provider }) =>
    `${provider} は Web 検索を実行せずに応答を返しました。`,
  providerValidationSuccess: ({ provider }) =>
    `${provider} を使用する準備ができました。`,
  providerCapabilityValidationSuccess: ({ provider, capability }) =>
    `${provider} ${capability} は動作しています。`,
  providerValidationFailed: "プロバイダーの検証に失敗しました。",
  webSearchFallback:
    "Web 検索が利用できなかったため、ライブ Web コンテキストなしで応答が続行されました。",
  noBase64EncoderAvailable: "利用可能なBase64エンコーダーがありません。",
  noBase64DecoderAvailable: "利用可能なBase64デコーダーがありません。",
  azureSpeechApiKeyFormat:
    "Microsoft Azure TTS には、<key>|<region> 形式 (abc123|westeurope など)、または結合された Azure 形式 <endpoint>|<api-key>|<key>|<region> の形式の Azure Speech 資格情報が必要です。",
  nativeTtsDoesNotSynthesizeAudioFiles:
    "ネイティブ TTS はオーディオ ファイルを合成しません。",
  localTtsUnavailableForLanguage: ({ languageLabel }) =>
    `${languageLabel} に対するローカルまたはクラウド音声ルートの準備ができていません。`,
  chooseTextToSpeechProviderInSettings:
    "設定で音声合成プロバイダーを選択します。",
  ttsNotSupportedYet: ({ provider }) =>
    `${provider} TTS はまだサポートされていません。`,
  ttsError: ({ provider, status, errorText }) =>
    `${provider} TTS エラー (${status}): ${errorText}`,
  ttsReplyTooLong: ({ provider }) =>
    `${provider}は回答が長すぎるため音声出力を拒否しました。`,
  ttsTimeout: ({ provider }) =>
    `${provider} 音声出力に時間がかかりすぎました。`,
  sttTimeout: ({ provider }) =>
    `${provider} 音声の文字起こしに時間がかかりすぎました。`,
  sttFileSizeLimitExceeded: ({ provider, model, limit }) =>
    `${provider} ${model} は${limit} までの録音のみを受け入れます。短いクリップを使用するか、STT モデルを切り替えてください。`,
  voiceInputCaptureIncomplete:
    "音声入力をきれいにキャプチャできませんでした。もう一度試してください。",
  ttsDidNotReturnAudio: ({ provider }) =>
    `${provider} TTS は音声を返しませんでした。`,
  nativeSttHandledInApp: "システム STT はアプリで直接処理されます。",
  chooseSpeechToTextProviderInSettings:
    "設定で音声テキスト変換プロバイダーを選択します。",
  sttNotSupportedYet: ({ provider }) =>
    `${provider} STT はまだサポートされていません。`,
  providerNotWiredUpYet: ({ provider }) =>
    `${provider} はまだ接続されていません。`,
  you: "あなた",
  assistant: "アシスタント",
  untitledConversation: "題名のない会話",
  conversationExportHeader: ({ title }) => `会話: ${title}`,
  speechRecognitionPermissionNotGranted: "音声認識が許可されていません。",
  speechRecognitionUnavailableForDeviceLanguage:
    "現在のデバイス言語では音声認識を利用できません。",
  nativeSpeechRecognitionNeedsNetwork:
    "ネイティブ音声認識には現在ネットワーク アクセスが必要です。",
  noSpeechDetected: "音声が検出されませんでした。",
  nativeSpeechRecognitionFailed: "ネイティブ音声認識に失敗しました。",
  couldntStartNativeSpeechRecognition:
    "ネイティブ音声認識を開始できませんでした。",
  microphonePermissionNotGranted: "マイクが許可されていません",
} satisfies TranslationDictionary;
