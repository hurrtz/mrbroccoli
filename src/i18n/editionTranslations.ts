const en = {
  freeEdition: "Private Offline · Free",
  premiumPurchaseValue:
    "One-time purchase. No subscription and no token markup; provider usage is billed by your providers.",
  premiumFreeKeepsWorking:
    "Free remains usable: offline conversations, history, backups, and manual export stay available.",
  premiumBenefitProviders:
    "Use your cloud providers and their higher-quality models",
  premiumBenefitModes:
    "Switch response modes and run multi-model Uber deliberation",
  premiumBenefitTools: "Add web search, images, and cloud Drive sessions",
  premiumBenefitKnowledge:
    "Use past-session knowledge and the portable Markdown archive",
  freeOfflineLanguagesStep: "Choose your language",
  freeOfflineModelsStep: "Your best setup",
  freeOfflineStartStep: "3 · Start talking",
  freeOfflineSystemVoiceNote:
    "No single downloaded voice covers this language set, so replies use the phone’s language-aware system voice. Listening and thinking stay local.",
  freeOfflineStart: "Start",
  freeOfflinePremiumEscape: "Have provider API keys? Unlock Premium instead",
  settingsGroupConversation: "Conversation & tools",
  settingsGroupVoiceModels: "Voice & models",
  settingsGroupPrivacyApp: "Privacy & app",
};

type EditionTranslations = typeof en;
const define = (value: EditionTranslations) => value;

export const editionTranslations = {
  en,
  de: define({
    freeEdition: "Privat & offline · Kostenlos",
    premiumPurchaseValue:
      "Einmaliger Kauf. Kein Abo und kein Token-Aufschlag; die Nutzung wird direkt von deinen Providern abgerechnet.",
    premiumFreeKeepsWorking:
      "Kostenlos bleibt nutzbar: Offline-Gespräche, Verlauf, Backups und manueller Export bleiben verfügbar.",
    premiumBenefitProviders:
      "Nutze deine Cloud-Provider und deren hochwertigere Modelle",
    premiumBenefitModes:
      "Wechsle Antwortmodi und starte eine Uber-Beratung mit mehreren Modellen",
    premiumBenefitTools:
      "Nutze Websuche, Bilder und Cloud-Sitzungen im Drive-Modus",
    premiumBenefitKnowledge:
      "Nutze Wissen aus früheren Sitzungen und das portable Markdown-Archiv",
    freeOfflineLanguagesStep: "Wähle deine Sprache",
    freeOfflineModelsStep: "Deine beste Einrichtung",
    freeOfflineStartStep: "3 · Gespräch starten",
    freeOfflineSystemVoiceNote:
      "Keine einzelne heruntergeladene Stimme deckt diese Sprachen ab. Antworten verwenden deshalb die sprachabhängige Systemstimme des Smartphones; Hören und Denken bleiben lokal.",
    freeOfflineStart: "Start",
    freeOfflinePremiumEscape: "Provider-API-Schlüssel vorhanden? Stattdessen Premium freischalten",
    settingsGroupConversation: "Gespräch & Werkzeuge",
    settingsGroupVoiceModels: "Stimme & Modelle",
    settingsGroupPrivacyApp: "Datenschutz & App",
  }),
  uk: define({
    freeEdition: "Приватно й офлайн · Безкоштовно",
    premiumPurchaseValue:
      "Одноразова покупка. Без підписки й націнки на токени; використання оплачують безпосередньо вашим провайдерам.",
    premiumFreeKeepsWorking:
      "Безкоштовна версія залишається корисною: офлайн-розмови, історія, резервні копії та ручний експорт доступні.",
    premiumBenefitProviders:
      "Використовуйте своїх хмарних провайдерів і їхні якісніші моделі",
    premiumBenefitModes:
      "Перемикайте режими відповідей і запускайте Uber-обговорення кількох моделей",
    premiumBenefitTools: "Додайте вебпошук, зображення та хмарні сесії Drive",
    premiumBenefitKnowledge:
      "Використовуйте знання минулих сесій і переносний Markdown-архів",
    freeOfflineLanguagesStep: "Виберіть свою мову",
    freeOfflineModelsStep: "Найкраще налаштування для вас",
    freeOfflineStartStep: "3 · Почніть розмову",
    freeOfflineSystemVoiceNote:
      "Жоден завантажений голос не охоплює всі ці мови, тому відповіді використовують системний голос телефону для відповідної мови. Слухання й мислення залишаються локальними.",
    freeOfflineStart: "Почати",
    freeOfflinePremiumEscape: "Маєте API-ключі провайдера? Розблокуйте Premium",
    settingsGroupConversation: "Розмова й інструменти",
    settingsGroupVoiceModels: "Голос і моделі",
    settingsGroupPrivacyApp: "Приватність і застосунок",
  }),
  hi: define({
    freeEdition: "निजी ऑफ़लाइन · मुफ़्त",
    premiumPurchaseValue:
      "एक बार की खरीद। कोई सदस्यता या टोकन पर अतिरिक्त शुल्क नहीं; प्रदाता उपयोग का बिल आपके प्रदाता देते हैं।",
    premiumFreeKeepsWorking:
      "मुफ़्त संस्करण उपयोगी रहता है: ऑफ़लाइन बातचीत, इतिहास, बैकअप और मैन्युअल निर्यात उपलब्ध रहते हैं।",
    premiumBenefitProviders:
      "अपने क्लाउड प्रदाता और उनके बेहतर मॉडल इस्तेमाल करें",
    premiumBenefitModes:
      "उत्तर मोड बदलें और कई मॉडलों वाला Uber विचार-विमर्श चलाएँ",
    premiumBenefitTools: "वेब खोज, चित्र और क्लाउड Drive सत्र जोड़ें",
    premiumBenefitKnowledge:
      "पिछले सत्रों की जानकारी और पोर्टेबल Markdown संग्रह इस्तेमाल करें",
    freeOfflineLanguagesStep: "अपनी भाषा चुनें",
    freeOfflineModelsStep: "आपके लिए सबसे अच्छा सेटअप",
    freeOfflineStartStep: "3 · बातचीत शुरू करें",
    freeOfflineSystemVoiceNote:
      "एक डाउनलोड की गई आवाज़ इन सभी भाषाओं को नहीं संभालती, इसलिए उत्तर फ़ोन की भाषा-अनुकूल सिस्टम आवाज़ इस्तेमाल करेंगे। सुनना और सोचना स्थानीय रहेगा।",
    freeOfflineStart: "शुरू करें",
    freeOfflinePremiumEscape: "प्रोवाइडर API कुंजियाँ हैं? इसके बजाय Premium अनलॉक करें",
    settingsGroupConversation: "बातचीत और टूल",
    settingsGroupVoiceModels: "आवाज़ और मॉडल",
    settingsGroupPrivacyApp: "गोपनीयता और ऐप",
  }),
  es: define({
    freeEdition: "Privado sin conexión · Gratis",
    premiumPurchaseValue:
      "Compra única. Sin suscripción ni recargo por tokens; tus proveedores facturan su uso directamente.",
    premiumFreeKeepsWorking:
      "La versión gratuita sigue siendo útil: conserva conversaciones sin conexión, historial, copias de seguridad y exportación manual.",
    premiumBenefitProviders:
      "Usa tus proveedores cloud y sus modelos de mayor calidad",
    premiumBenefitModes:
      "Cambia de modo de respuesta y ejecuta deliberaciones Uber con varios modelos",
    premiumBenefitTools:
      "Añade búsqueda web, imágenes y sesiones Drive en la nube",
    premiumBenefitKnowledge:
      "Usa conocimiento de sesiones anteriores y el archivo Markdown portátil",
    freeOfflineLanguagesStep: "Elige tu idioma",
    freeOfflineModelsStep: "Tu mejor configuración",
    freeOfflineStartStep: "3 · Empieza a hablar",
    freeOfflineSystemVoiceNote:
      "Ninguna voz descargada cubre todos estos idiomas, así que las respuestas usan la voz del sistema adecuada para cada idioma. La escucha y el razonamiento siguen siendo locales.",
    freeOfflineStart: "Empezar",
    freeOfflinePremiumEscape: "¿Tienes claves API de proveedor? Desbloquea Premium",
    settingsGroupConversation: "Conversación y herramientas",
    settingsGroupVoiceModels: "Voz y modelos",
    settingsGroupPrivacyApp: "Privacidad y app",
  }),
  fr: define({
    freeEdition: "Privé hors ligne · Gratuit",
    premiumPurchaseValue:
      "Achat unique. Sans abonnement ni marge sur les jetons ; l’usage est facturé directement par vos fournisseurs.",
    premiumFreeKeepsWorking:
      "La version gratuite reste utile : conversations hors ligne, historique, sauvegardes et export manuel restent disponibles.",
    premiumBenefitProviders:
      "Utilisez vos fournisseurs cloud et leurs modèles de meilleure qualité",
    premiumBenefitModes:
      "Changez de mode de réponse et lancez une délibération Uber multimodèle",
    premiumBenefitTools:
      "Ajoutez recherche web, images et sessions Drive dans le cloud",
    premiumBenefitKnowledge:
      "Utilisez les connaissances passées et l’archive Markdown portable",
    freeOfflineLanguagesStep: "Choisissez votre langue",
    freeOfflineModelsStep: "Votre meilleure configuration",
    freeOfflineStartStep: "3 · Commencez à parler",
    freeOfflineSystemVoiceNote:
      "Aucune voix téléchargée ne couvre toutes ces langues. Les réponses utilisent donc la voix système adaptée à chaque langue ; l’écoute et la réflexion restent locales.",
    freeOfflineStart: "Démarrer",
    freeOfflinePremiumEscape: "Des clés API fournisseur ? Débloquez plutôt Premium",
    settingsGroupConversation: "Conversation et outils",
    settingsGroupVoiceModels: "Voix et modèles",
    settingsGroupPrivacyApp: "Confidentialité et app",
  }),
  it: define({
    freeEdition: "Privato offline · Gratis",
    premiumPurchaseValue:
      "Acquisto una tantum. Nessun abbonamento o ricarico sui token; l’uso è fatturato direttamente dai tuoi provider.",
    premiumFreeKeepsWorking:
      "La versione gratuita resta utile: conversazioni offline, cronologia, backup ed esportazione manuale rimangono disponibili.",
    premiumBenefitProviders:
      "Usa i tuoi provider cloud e i loro modelli di qualità superiore",
    premiumBenefitModes:
      "Cambia modalità di risposta e avvia deliberazioni Uber multimodello",
    premiumBenefitTools:
      "Aggiungi ricerca web, immagini e sessioni Drive nel cloud",
    premiumBenefitKnowledge:
      "Usa la conoscenza delle sessioni passate e l’archivio Markdown portatile",
    freeOfflineLanguagesStep: "Scegli la tua lingua",
    freeOfflineModelsStep: "La configurazione migliore per te",
    freeOfflineStartStep: "3 · Inizia a parlare",
    freeOfflineSystemVoiceNote:
      "Nessuna voce scaricata copre tutte queste lingue, quindi le risposte usano la voce di sistema adatta alla lingua. Ascolto e ragionamento restano locali.",
    freeOfflineStart: "Inizia",
    freeOfflinePremiumEscape: "Hai chiavi API del provider? Sblocca Premium",
    settingsGroupConversation: "Conversazione e strumenti",
    settingsGroupVoiceModels: "Voce e modelli",
    settingsGroupPrivacyApp: "Privacy e app",
  }),
  pt: define({
    freeEdition: "Privado offline · Grátis",
    premiumPurchaseValue:
      "Compra única. Sem subscrição nem margem sobre tokens; a utilização é faturada diretamente pelos seus fornecedores.",
    premiumFreeKeepsWorking:
      "A versão gratuita continua útil: conversas offline, histórico, cópias de segurança e exportação manual permanecem disponíveis.",
    premiumBenefitProviders:
      "Use os seus fornecedores cloud e os respetivos modelos de maior qualidade",
    premiumBenefitModes:
      "Alterne modos de resposta e execute deliberações Uber com vários modelos",
    premiumBenefitTools:
      "Adicione pesquisa web, imagens e sessões Drive na cloud",
    premiumBenefitKnowledge:
      "Use conhecimento de sessões anteriores e o arquivo Markdown portátil",
    freeOfflineLanguagesStep: "Escolha o seu idioma",
    freeOfflineModelsStep: "A melhor configuração para si",
    freeOfflineStartStep: "3 · Comece a falar",
    freeOfflineSystemVoiceNote:
      "Nenhuma voz transferida abrange todos estes idiomas, por isso as respostas usam a voz do sistema adequada ao idioma. A audição e o raciocínio continuam locais.",
    freeOfflineStart: "Começar",
    freeOfflinePremiumEscape: "Tem chaves de API? Desbloqueie o Premium",
    settingsGroupConversation: "Conversa e ferramentas",
    settingsGroupVoiceModels: "Voz e modelos",
    settingsGroupPrivacyApp: "Privacidade e app",
  }),
  ptBR: define({
    freeEdition: "Privado offline · Grátis",
    premiumPurchaseValue:
      "Compra única. Sem assinatura nem acréscimo sobre tokens; o uso é cobrado diretamente pelos seus provedores.",
    premiumFreeKeepsWorking:
      "A versão grátis continua útil: conversas offline, histórico, backups e exportação manual permanecem disponíveis.",
    premiumBenefitProviders:
      "Use seus provedores em nuvem e os modelos de maior qualidade deles",
    premiumBenefitModes:
      "Alterne modos de resposta e execute deliberações Uber com vários modelos",
    premiumBenefitTools:
      "Adicione busca na web, imagens e sessões Drive na nuvem",
    premiumBenefitKnowledge:
      "Use conhecimento de sessões anteriores e o arquivo Markdown portátil",
    freeOfflineLanguagesStep: "Escolha seu idioma",
    freeOfflineModelsStep: "A melhor configuração para você",
    freeOfflineStartStep: "3 · Comece a falar",
    freeOfflineSystemVoiceNote:
      "Nenhuma voz baixada cobre todos esses idiomas, então as respostas usam a voz do sistema adequada ao idioma. A escuta e o raciocínio continuam locais.",
    freeOfflineStart: "Começar",
    freeOfflinePremiumEscape: "Tem chaves de API? Desbloqueie o Premium",
    settingsGroupConversation: "Conversa e ferramentas",
    settingsGroupVoiceModels: "Voz e modelos",
    settingsGroupPrivacyApp: "Privacidade e app",
  }),
  ru: define({
    freeEdition: "Приватно и офлайн · Бесплатно",
    premiumPurchaseValue:
      "Разовая покупка. Без подписки и наценки на токены; использование оплачивается напрямую вашим провайдерам.",
    premiumFreeKeepsWorking:
      "Бесплатная версия остаётся полезной: офлайн-разговоры, история, резервные копии и ручной экспорт доступны.",
    premiumBenefitProviders:
      "Используйте своих облачных провайдеров и их более качественные модели",
    premiumBenefitModes:
      "Переключайте режимы ответа и запускайте Uber-обсуждения нескольких моделей",
    premiumBenefitTools:
      "Добавьте веб-поиск, изображения и облачные сеансы Drive",
    premiumBenefitKnowledge:
      "Используйте знания прошлых сеансов и переносимый Markdown-архив",
    freeOfflineLanguagesStep: "Выберите свой язык",
    freeOfflineModelsStep: "Лучшая конфигурация для вас",
    freeOfflineStartStep: "3 · Начните разговор",
    freeOfflineSystemVoiceNote:
      "Ни один загруженный голос не охватывает все эти языки, поэтому ответы используют системный голос телефона для нужного языка. Прослушивание и мышление остаются локальными.",
    freeOfflineStart: "Начать",
    freeOfflinePremiumEscape: "Есть API-ключи провайдера? Разблокируйте Premium",
    settingsGroupConversation: "Разговор и инструменты",
    settingsGroupVoiceModels: "Голос и модели",
    settingsGroupPrivacyApp: "Конфиденциальность и приложение",
  }),
  "zh-CN": define({
    freeEdition: "私密离线 · 免费",
    premiumPurchaseValue:
      "一次购买，无订阅、无 Token 加价；提供商用量由提供商直接计费。",
    premiumFreeKeepsWorking:
      "免费版仍可完整使用：离线对话、历史记录、备份和手动导出均会保留。",
    premiumBenefitProviders: "使用你的云端提供商及其更高质量的模型",
    premiumBenefitModes: "切换回复模式并运行多模型 Uber 协商",
    premiumBenefitTools: "加入网页搜索、图片和云端 Drive 会话",
    premiumBenefitKnowledge: "使用过往会话知识和可携带的 Markdown 档案",
    freeOfflineLanguagesStep: "选择你的语言",
    freeOfflineModelsStep: "最适合你的配置",
    freeOfflineStartStep: "3 · 开始对话",
    freeOfflineSystemVoiceNote:
      "没有一个已下载语音覆盖全部所选语言，因此回复会使用手机对应语言的系统语音。聆听和思考仍在本地完成。",
    freeOfflineStart: "开始",
    freeOfflinePremiumEscape: "已有服务商 API 密钥？改为解锁 Premium",
    settingsGroupConversation: "对话与工具",
    settingsGroupVoiceModels: "语音与模型",
    settingsGroupPrivacyApp: "隐私与应用",
  }),
  ar: define({
    freeEdition: "خاص بلا اتصال · مجاني",
    premiumPurchaseValue:
      "شراء لمرة واحدة. بلا اشتراك أو هامش على الرموز؛ يحاسبك مزودوك مباشرة على الاستخدام.",
    premiumFreeKeepsWorking:
      "يبقى الإصدار المجاني مفيدًا: تظل المحادثات بلا اتصال والسجل والنسخ الاحتياطية والتصدير اليدوي متاحة.",
    premiumBenefitProviders: "استخدم مزودي السحابة لديك ونماذجهم الأعلى جودة",
    premiumBenefitModes: "بدّل أوضاع الرد وشغّل مداولات Uber بين عدة نماذج",
    premiumBenefitTools: "أضف بحث الويب والصور وجلسات Drive السحابية",
    premiumBenefitKnowledge:
      "استخدم معرفة الجلسات السابقة وأرشيف Markdown القابل للنقل",
    freeOfflineLanguagesStep: "اختر لغتك",
    freeOfflineModelsStep: "أفضل إعداد لك",
    freeOfflineStartStep: "3 · ابدأ الحديث",
    freeOfflineSystemVoiceNote:
      "لا يغطي صوت منزّل واحد كل هذه اللغات، لذا تستخدم الردود صوت النظام المناسب للغة على الهاتف. يبقى الاستماع والتفكير محليين.",
    freeOfflineStart: "ابدأ",
    freeOfflinePremiumEscape: "لديك مفاتيح API لمزوّد؟ افتح Premium بدلاً من ذلك",
    settingsGroupConversation: "المحادثة والأدوات",
    settingsGroupVoiceModels: "الصوت والنماذج",
    settingsGroupPrivacyApp: "الخصوصية والتطبيق",
  }),
  ja: define({
    freeEdition: "プライベート・オフライン · 無料",
    premiumPurchaseValue:
      "買い切りです。サブスクリプションやトークンへの上乗せはなく、利用料は各プロバイダーから直接請求されます。",
    premiumFreeKeepsWorking:
      "無料版も使い続けられます。オフライン会話、履歴、バックアップ、手動エクスポートは利用可能です。",
    premiumBenefitProviders: "お使いのクラウドプロバイダーと高品質モデルを利用",
    premiumBenefitModes: "応答モードを切り替え、複数モデルの Uber 検討を実行",
    premiumBenefitTools: "ウェブ検索、画像、クラウド Drive セッションを追加",
    premiumBenefitKnowledge:
      "過去セッションの知識と持ち運べる Markdown アーカイブを利用",
    freeOfflineLanguagesStep: "言語を選ぶ",
    freeOfflineModelsStep: "あなたに最適なセットアップ",
    freeOfflineStartStep: "3 · 会話を始める",
    freeOfflineSystemVoiceNote:
      "選択したすべての言語を扱える単一のダウンロード音声がないため、返信には言語対応のシステム音声を使います。聞き取りと思考はローカルのままです。",
    freeOfflineStart: "開始",
    freeOfflinePremiumEscape: "プロバイダーの API キーをお持ちですか？Premium を解除",
    settingsGroupConversation: "会話とツール",
    settingsGroupVoiceModels: "音声とモデル",
    settingsGroupPrivacyApp: "プライバシーとアプリ",
  }),
  hu: define({
    freeEdition: "Privát offline · Ingyenes",
    premiumPurchaseValue:
      "Egyszeri vásárlás. Nincs előfizetés vagy tokenfelár; a használatot közvetlenül a szolgáltatóid számlázzák.",
    premiumFreeKeepsWorking:
      "Az ingyenes változat használható marad: az offline beszélgetések, előzmények, mentések és kézi export elérhetők.",
    premiumBenefitProviders:
      "Használd saját felhőszolgáltatóidat és jobb minőségű modelljeiket",
    premiumBenefitModes:
      "Válts válaszmódot, és indíts többmodelles Uber-mérlegelést",
    premiumBenefitTools:
      "Adj hozzá webes keresést, képeket és felhős Drive-meneteket",
    premiumBenefitKnowledge:
      "Használd a korábbi menetek tudását és a hordozható Markdown-archívumot",
    freeOfflineLanguagesStep: "Válaszd ki a nyelved",
    freeOfflineModelsStep: "A legjobb beállítás neked",
    freeOfflineStartStep: "3 · Kezdj beszélgetni",
    freeOfflineSystemVoiceNote:
      "Egyetlen letöltött hang sem fedi le az összes nyelvet, ezért a válaszok a telefon nyelvhez illő rendszerhangját használják. A hallás és gondolkodás helyben marad.",
    freeOfflineStart: "Indítás",
    freeOfflinePremiumEscape: "Van szolgáltatói API-kulcsod? Oldd fel a Premiumot",
    settingsGroupConversation: "Beszélgetés és eszközök",
    settingsGroupVoiceModels: "Hang és modellek",
    settingsGroupPrivacyApp: "Adatvédelem és alkalmazás",
  }),
  cs: define({
    freeEdition: "Soukromě offline · Zdarma",
    premiumPurchaseValue:
      "Jednorázový nákup. Bez předplatného a přirážky za tokeny; využití účtují přímo vaši poskytovatelé.",
    premiumFreeKeepsWorking:
      "Bezplatná verze zůstává užitečná: offline konverzace, historie, zálohy a ruční export zůstávají dostupné.",
    premiumBenefitProviders:
      "Používejte své cloudové poskytovatele a jejich kvalitnější modely",
    premiumBenefitModes:
      "Přepínejte režimy odpovědí a spusťte Uber poradu více modelů",
    premiumBenefitTools:
      "Přidejte webové hledání, obrázky a cloudové relace Drive",
    premiumBenefitKnowledge:
      "Používejte znalosti minulých relací a přenosný archiv Markdown",
    freeOfflineLanguagesStep: "Vyberte svůj jazyk",
    freeOfflineModelsStep: "Nejlepší nastavení pro vás",
    freeOfflineStartStep: "3 · Začněte mluvit",
    freeOfflineSystemVoiceNote:
      "Jeden stažený hlas nepokrývá všechny tyto jazyky, proto odpovědi používají systémový hlas telefonu pro daný jazyk. Poslech a myšlení zůstávají místní.",
    freeOfflineStart: "Začít",
    freeOfflinePremiumEscape: "Máte API klíče poskytovatele? Odemkněte Premium",
    settingsGroupConversation: "Konverzace a nástroje",
    settingsGroupVoiceModels: "Hlas a modely",
    settingsGroupPrivacyApp: "Soukromí a aplikace",
  }),
  pl: define({
    freeEdition: "Prywatnie offline · Bezpłatnie",
    premiumPurchaseValue:
      "Jednorazowy zakup. Bez subskrypcji i narzutu na tokeny; użycie rozliczają bezpośrednio Twoi dostawcy.",
    premiumFreeKeepsWorking:
      "Wersja bezpłatna pozostaje użyteczna: rozmowy offline, historia, kopie zapasowe i ręczny eksport są nadal dostępne.",
    premiumBenefitProviders:
      "Korzystaj z własnych dostawców chmurowych i ich lepszych modeli",
    premiumBenefitModes:
      "Przełączaj tryby odpowiedzi i uruchamiaj narady Uber wielu modeli",
    premiumBenefitTools:
      "Dodaj wyszukiwanie w sieci, obrazy i chmurowe sesje Drive",
    premiumBenefitKnowledge:
      "Korzystaj z wiedzy z poprzednich sesji i przenośnego archiwum Markdown",
    freeOfflineLanguagesStep: "Wybierz swój język",
    freeOfflineModelsStep: "Najlepsza konfiguracja dla Ciebie",
    freeOfflineStartStep: "3 · Zacznij rozmawiać",
    freeOfflineSystemVoiceNote:
      "Żaden pobrany głos nie obsługuje wszystkich tych języków, więc odpowiedzi użyją odpowiedniego głosu systemowego telefonu. Słuchanie i myślenie pozostają lokalne.",
    freeOfflineStart: "Rozpocznij",
    freeOfflinePremiumEscape: "Masz klucze API dostawcy? Odblokuj Premium",
    settingsGroupConversation: "Rozmowa i narzędzia",
    settingsGroupVoiceModels: "Głos i modele",
    settingsGroupPrivacyApp: "Prywatność i aplikacja",
  }),
  tr: define({
    freeEdition: "Özel çevrimdışı · Ücretsiz",
    premiumPurchaseValue:
      "Tek seferlik satın alma. Abonelik veya token fiyatına ek ücret yoktur; kullanım doğrudan sağlayıcılarınızca faturalandırılır.",
    premiumFreeKeepsWorking:
      "Ücretsiz sürüm kullanılabilir kalır: çevrimdışı konuşmalar, geçmiş, yedekler ve elle dışa aktarma sunulur.",
    premiumBenefitProviders:
      "Kendi bulut sağlayıcılarınızı ve daha kaliteli modellerini kullanın",
    premiumBenefitModes:
      "Yanıt modlarını değiştirin ve çok modelli Uber değerlendirmesi çalıştırın",
    premiumBenefitTools:
      "Web araması, görseller ve bulut Drive oturumları ekleyin",
    premiumBenefitKnowledge:
      "Geçmiş oturum bilgisini ve taşınabilir Markdown arşivini kullanın",
    freeOfflineLanguagesStep: "Dilinizi seçin",
    freeOfflineModelsStep: "Sizin için en iyi kurulum",
    freeOfflineStartStep: "3 · Konuşmaya başlayın",
    freeOfflineSystemVoiceNote:
      "Tek bir indirilen ses bu dillerin tümünü kapsamıyor; bu nedenle yanıtlar telefonun dile uygun sistem sesini kullanır. Dinleme ve düşünme yerel kalır.",
    freeOfflineStart: "Başlat",
    freeOfflinePremiumEscape: "Sağlayıcı API anahtarın var mı? Bunun yerine Premium'un kilidini aç",
    settingsGroupConversation: "Konuşma ve araçlar",
    settingsGroupVoiceModels: "Ses ve modeller",
    settingsGroupPrivacyApp: "Gizlilik ve uygulama",
  }),
  sv: define({
    freeEdition: "Privat offline · Gratis",
    premiumPurchaseValue:
      "Engångsköp. Ingen prenumeration eller tokenpåslag; användningen faktureras direkt av dina leverantörer.",
    premiumFreeKeepsWorking:
      "Gratisversionen förblir användbar: offline-samtal, historik, säkerhetskopior och manuell export finns kvar.",
    premiumBenefitProviders:
      "Använd dina molnleverantörer och deras modeller av högre kvalitet",
    premiumBenefitModes:
      "Växla svarsläge och kör Uber-överläggning med flera modeller",
    premiumBenefitTools:
      "Lägg till webbsökning, bilder och Drive-sessioner i molnet",
    premiumBenefitKnowledge:
      "Använd kunskap från tidigare sessioner och det portabla Markdown-arkivet",
    freeOfflineLanguagesStep: "Välj ditt språk",
    freeOfflineModelsStep: "Den bästa konfigurationen för dig",
    freeOfflineStartStep: "3 · Börja prata",
    freeOfflineSystemVoiceNote:
      "Ingen enskild hämtad röst täcker alla språken, så svaren använder telefonens språkanpassade systemröst. Lyssnande och tänkande förblir lokalt.",
    freeOfflineStart: "Starta",
    freeOfflinePremiumEscape: "Har du API-nycklar? Lås upp Premium i stället",
    settingsGroupConversation: "Samtal och verktyg",
    settingsGroupVoiceModels: "Röst och modeller",
    settingsGroupPrivacyApp: "Integritet och app",
  }),
  ur: define({
    freeEdition: "نجی آف لائن · مفت",
    premiumPurchaseValue:
      "ایک بار کی خریداری۔ کوئی سبسکرپشن یا ٹوکن پر اضافی قیمت نہیں؛ استعمال کا بل آپ کے فراہم کنندگان براہ راست دیتے ہیں۔",
    premiumFreeKeepsWorking:
      "مفت ورژن کارآمد رہتا ہے: آف لائن گفتگو، تاریخ، بیک اپ اور دستی برآمد دستیاب رہتے ہیں۔",
    premiumBenefitProviders:
      "اپنے کلاؤڈ فراہم کنندگان اور ان کے بہتر معیار کے ماڈل استعمال کریں",
    premiumBenefitModes:
      "جوابی موڈ بدلیں اور متعدد ماڈلز کی Uber مشاورت چلائیں",
    premiumBenefitTools: "ویب تلاش، تصاویر اور کلاؤڈ Drive سیشن شامل کریں",
    premiumBenefitKnowledge:
      "پچھلے سیشن کا علم اور قابل منتقلی Markdown آرکائیو استعمال کریں",
    freeOfflineLanguagesStep: "اپنی زبان منتخب کریں",
    freeOfflineModelsStep: "آپ کے لیے بہترین سیٹ اپ",
    freeOfflineStartStep: "3 · گفتگو شروع کریں",
    freeOfflineSystemVoiceNote:
      "کوئی ایک ڈاؤن لوڈ شدہ آواز ان تمام زبانوں کا احاطہ نہیں کرتی، اس لیے جوابات فون کی زبان کے مطابق سسٹم آواز استعمال کرتے ہیں۔ سننا اور سوچنا مقامی رہتا ہے۔",
    freeOfflineStart: "شروع کریں",
    freeOfflinePremiumEscape: "پرووائیڈر API کلیدیں ہیں؟ اس کے بجائے Premium کھولیں",
    settingsGroupConversation: "گفتگو اور ٹولز",
    settingsGroupVoiceModels: "آواز اور ماڈلز",
    settingsGroupPrivacyApp: "رازداری اور ایپ",
  }),
} as const;
