import type { TranslationParams } from "./types";
import { editionTranslations } from "./editionTranslations";

const en = {
  ...editionTranslations.en,
  premium: "Premium",
  upgradeToPremium: "Unlock Premium",
  premiumDescription:
    "Use cloud providers, every response mode, web search, images, Drive mode, Model Council, past-session knowledge, and all advanced settings.",
  premiumBuy: "Buy Premium",
  premiumBuyPrice: ({ price }: TranslationParams) => `Buy Premium · ${price}`,
  restorePurchase: "Restore purchase",
  premiumRestoreHint:
    "A permanent purchase is restored through the same App Store or Play Store account on this platform. No Mr Broccoli account is required.",
  premiumUnlocked: "Premium is unlocked",
  developmentEntitlement: "Development entitlement",
  developmentEntitlementHint:
    "Only available in .dev and .maestro builds. Changes apply immediately and do not affect store purchases.",
  premiumErrorUnavailable:
    "The store is unavailable right now. Try again later.",
  premiumErrorFailed: "The purchase could not be completed.",
  premiumErrorPending: "The purchase is awaiting approval.",
  freeOfflineTitle: "Private on-device mode",
  freeOfflineIntro:
    "Choose your language while Mr Broccoli checks this phone and recommends the best private listening, reasoning, and voice setup it can run reliably. Tap Start to download, install, and test everything before your first conversation.",
  freeOfflineInternetDisclosure:
    "The model download needs internet access. After installation, Free conversations and sessions stay entirely on this device.",
  freeOfflineProfile: "Best match for you and this phone",
  freeOfflineDownloadSize: ({ size }: TranslationParams) => `${size} download`,
  freeOfflineDownloadAndTest: "Start",
  freeOfflinePreparing: ({ model, index, count }: TranslationParams) =>
    `${model} · ${index} of ${count}`,
  freeOfflineCooling: "Letting the phone cool down before continuing…",
  freeOfflineReady: "Your private offline setup is ready.",
  freeOfflineUnavailableLanguage:
    "No complete local setup supports this language yet.",
  freeOfflineUnavailableDevice:
    "This phone cannot safely run a complete local setup for this language.",
  freeOfflineUnavailableStorage:
    "There is not enough free storage for the complete local setup.",
  freeOfflineUnavailableTemporary:
    "The phone is under temporary memory, power, or heat pressure. Try again later.",
};

type PremiumTranslations = typeof en;
const define = (value: PremiumTranslations) => value;

const rawPremiumTranslations = {
  en,
  de: define({
    ...editionTranslations.de,
    premium: "Premium",
    upgradeToPremium: "Premium freischalten",
    premiumDescription:
      "Nutze Cloud-Anbieter, alle Antwortmodi, Websuche, Bilder, Drive-Modus, Übermodus, Wissen aus früheren Sitzungen und alle erweiterten Einstellungen.",
    premiumBuy: "Premium kaufen",
    premiumBuyPrice: ({ price }) => `Premium kaufen · ${price}`,
    restorePurchase: "Kauf wiederherstellen",
    premiumRestoreHint:
      "Ein dauerhafter Kauf wird über dasselbe App-Store- oder Play-Store-Konto auf dieser Plattform wiederhergestellt. Ein Mr Broccoli Konto ist nicht erforderlich.",
    premiumUnlocked: "Premium ist freigeschaltet",
    developmentEntitlement: "Entwicklungsberechtigung",
    developmentEntitlementHint:
      "Nur in .dev- und .maestro-Builds verfügbar. Änderungen gelten sofort und wirken sich nicht auf Store-Käufe aus.",
    premiumErrorUnavailable:
      "Der Store ist gerade nicht verfügbar. Versuche es später erneut.",
    premiumErrorFailed: "Der Kauf konnte nicht abgeschlossen werden.",
    premiumErrorPending: "Der Kauf wartet auf Bestätigung.",
    freeOfflineTitle: "Privater Modus auf dem Gerät",
    freeOfflineIntro:
      "Wähle deine Sprache, während Mr Broccoli dieses Smartphone prüft und die beste private Kombination zum Hören, Denken und Sprechen empfiehlt, die es zuverlässig ausführen kann. Mit Start wird vor deinem ersten Gespräch alles heruntergeladen, installiert und getestet.",
    freeOfflineInternetDisclosure:
      "Der Modell-Download benötigt Internet. Danach bleiben kostenlose Gespräche und Sitzungen vollständig auf diesem Gerät.",
    freeOfflineProfile: "Beste Wahl für dich und dieses Smartphone",
    freeOfflineDownloadSize: ({ size }) => `${size} Download`,
    freeOfflineDownloadAndTest: "Start",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index} von ${count}`,
    freeOfflineCooling: "Das Smartphone kühlt ab, bevor es weitergeht …",
    freeOfflineReady: "Deine private Offline-Kombination ist bereit.",
    freeOfflineUnavailableLanguage:
      "Noch unterstützt keine vollständige lokale Kombination diese Sprache.",
    freeOfflineUnavailableDevice:
      "Dieses Smartphone kann für diese Sprache keine vollständige lokale Kombination sicher ausführen.",
    freeOfflineUnavailableStorage:
      "Für die vollständige lokale Kombination ist nicht genug Speicher frei.",
    freeOfflineUnavailableTemporary:
      "Das Smartphone steht vorübergehend unter Speicher-, Strom- oder Hitzedruck. Versuche es später erneut.",
  }),
  uk: define({
    ...editionTranslations.uk,
    premium: "Premium",
    upgradeToPremium: "Розблокувати Premium",
    premiumDescription:
      "Використовуйте хмарних провайдерів, усі режими відповідей, вебпошук, зображення, режим Drive і Суперрежим, знання з минулих сесій та всі розширені налаштування.",
    premiumBuy: "Купити Premium",
    premiumBuyPrice: ({ price }) => `Купити Premium · ${price}`,
    restorePurchase: "Відновити покупку",
    premiumRestoreHint:
      "Постійна покупка відновлюється через той самий обліковий запис App Store або Play Store на цій платформі. Обліковий запис Mr Broccoli не потрібен.",
    premiumUnlocked: "Premium розблоковано",
    developmentEntitlement: "Право доступу для розробки",
    developmentEntitlementHint:
      "Доступно лише у збірках .dev та .maestro. Зміни застосовуються одразу й не впливають на покупки в магазині.",
    premiumErrorUnavailable: "Магазин зараз недоступний. Спробуйте пізніше.",
    premiumErrorFailed: "Не вдалося завершити покупку.",
    premiumErrorPending: "Покупка очікує підтвердження.",
    freeOfflineTitle: "Приватний режим на пристрої",
    freeOfflineIntro:
      "Виберіть свою мову, а Mr Broccoli перевірить цей телефон і запропонує найкращий приватний набір для розпізнавання, міркування та мовлення, який він може надійно запускати. Натисніть «Почати», щоб завантажити, установити й перевірити все до першої розмови.",
    freeOfflineInternetDisclosure:
      "Для завантаження моделей потрібен інтернет. Після встановлення безкоштовні розмови й сесії залишаються лише на цьому пристрої.",
    freeOfflineProfile: "Найкращий варіант для вас і цього телефона",
    freeOfflineDownloadSize: ({ size }) => `Завантаження ${size}`,
    freeOfflineDownloadAndTest: "Почати",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index} з ${count}`,
    freeOfflineCooling: "Телефон охолоджується перед продовженням…",
    freeOfflineReady: "Приватний офлайн-набір готовий.",
    freeOfflineUnavailableLanguage:
      "Повного локального набору для цієї мови ще немає.",
    freeOfflineUnavailableDevice:
      "Цей телефон не може безпечно запустити повний локальний набір для цієї мови.",
    freeOfflineUnavailableStorage:
      "Недостатньо вільного місця для повного локального набору.",
    freeOfflineUnavailableTemporary:
      "Телефон тимчасово обмежений пам’яттю, живленням або температурою. Спробуйте пізніше.",
  }),
  hi: define({
    ...editionTranslations.hi,
    premium: "प्रीमियम",
    upgradeToPremium: "प्रीमियम अनलॉक करें",
    premiumDescription:
      "क्लाउड प्रदाता, सभी उत्तर मोड, वेब खोज, चित्र, Drive मोड और सर्वोच्च मोड, पिछली सत्र जानकारी और सभी उन्नत सेटिंग्स उपयोग करें।",
    premiumBuy: "प्रीमियम खरीदें",
    premiumBuyPrice: ({ price }) => `प्रीमियम खरीदें · ${price}`,
    restorePurchase: "खरीद बहाल करें",
    premiumRestoreHint:
      "स्थायी खरीद इसी प्लेटफ़ॉर्म पर उसी App Store या Play Store खाते से बहाल होती है। Mr Broccoli खाते की जरूरत नहीं है।",
    premiumUnlocked: "प्रीमियम अनलॉक है",
    developmentEntitlement: "डेवलपमेंट अधिकार",
    developmentEntitlementHint:
      "केवल .dev और .maestro बिल्ड में उपलब्ध। बदलाव तुरंत लागू होते हैं और स्टोर खरीदारी को प्रभावित नहीं करते।",
    premiumErrorUnavailable:
      "स्टोर अभी उपलब्ध नहीं है। बाद में फिर कोशिश करें।",
    premiumErrorFailed: "खरीद पूरी नहीं हुई।",
    premiumErrorPending: "खरीद स्वीकृति की प्रतीक्षा में है।",
    freeOfflineTitle: "निजी ऑन-डिवाइस मोड",
    freeOfflineIntro:
      "अपनी भाषा चुनें। Mr Broccoli इस फ़ोन की जाँच करके ऐसा सबसे अच्छा निजी सुनने, तर्क करने और बोलने का सेटअप सुझाएगा जिसे यह भरोसेमंद ढंग से चला सके। पहली बातचीत से पहले सब कुछ डाउनलोड, इंस्टॉल और जाँचने के लिए शुरू करें दबाएँ।",
    freeOfflineInternetDisclosure:
      "मॉडल डाउनलोड के लिए इंटरनेट चाहिए। स्थापना के बाद मुफ़्त बातचीत और सत्र पूरी तरह इसी डिवाइस पर रहते हैं।",
    freeOfflineProfile: "आपके और इस फ़ोन के लिए सबसे उपयुक्त",
    freeOfflineDownloadSize: ({ size }) => `${size} डाउनलोड`,
    freeOfflineDownloadAndTest: "शुरू करें",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index} / ${count}`,
    freeOfflineCooling: "आगे बढ़ने से पहले फ़ोन को ठंडा होने दिया जा रहा है…",
    freeOfflineReady: "निजी ऑफ़लाइन सेट तैयार है।",
    freeOfflineUnavailableLanguage:
      "इस भाषा के लिए अभी पूरा स्थानीय सेट उपलब्ध नहीं है।",
    freeOfflineUnavailableDevice:
      "यह फ़ोन इस भाषा के लिए पूरा स्थानीय सेट सुरक्षित रूप से नहीं चला सकता।",
    freeOfflineUnavailableStorage:
      "पूरे स्थानीय सेट के लिए पर्याप्त खाली जगह नहीं है।",
    freeOfflineUnavailableTemporary:
      "फ़ोन पर अभी मेमोरी, ऊर्जा या गर्मी का दबाव है। बाद में कोशिश करें।",
  }),
  es: define({
    ...editionTranslations.es,
    premium: "Premium",
    upgradeToPremium: "Desbloquear Premium",
    premiumDescription:
      "Usa proveedores en la nube, todos los modos de respuesta, búsqueda web, imágenes, modo Drive y Modo supremo, conocimiento de sesiones anteriores y todos los ajustes avanzados.",
    premiumBuy: "Comprar Premium",
    premiumBuyPrice: ({ price }) => `Comprar Premium · ${price}`,
    restorePurchase: "Restaurar compra",
    premiumRestoreHint:
      "La compra permanente se restaura con la misma cuenta de App Store o Play Store en esta plataforma. No hace falta una cuenta de Mr Broccoli.",
    premiumUnlocked: "Premium está desbloqueado",
    developmentEntitlement: "Acceso de desarrollo",
    developmentEntitlementHint:
      "Solo disponible en compilaciones .dev y .maestro. Los cambios se aplican de inmediato y no afectan a las compras de la tienda.",
    premiumErrorUnavailable:
      "La tienda no está disponible ahora. Inténtalo más tarde.",
    premiumErrorFailed: "No se pudo completar la compra.",
    premiumErrorPending: "La compra espera aprobación.",
    freeOfflineTitle: "Modo privado en el dispositivo",
    freeOfflineIntro:
      "Elige tu idioma mientras Mr Broccoli analiza este teléfono y recomienda la mejor configuración privada de escucha, razonamiento y voz que pueda ejecutar de forma fiable. Pulsa Empezar para descargar, instalar y probarlo todo antes de la primera conversación.",
    freeOfflineInternetDisclosure:
      "La descarga de modelos necesita internet. Después, las conversaciones y sesiones gratuitas permanecen íntegramente en este dispositivo.",
    freeOfflineProfile: "La mejor opción para ti y este teléfono",
    freeOfflineDownloadSize: ({ size }) => `${size} de descarga`,
    freeOfflineDownloadAndTest: "Empezar",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index} de ${count}`,
    freeOfflineCooling: "Dejando que el teléfono se enfríe antes de continuar…",
    freeOfflineReady: "La configuración privada sin conexión está lista.",
    freeOfflineUnavailableLanguage:
      "Todavía no hay una configuración local completa para este idioma.",
    freeOfflineUnavailableDevice:
      "Este teléfono no puede ejecutar con seguridad una configuración local completa para este idioma.",
    freeOfflineUnavailableStorage:
      "No hay suficiente espacio libre para la configuración local completa.",
    freeOfflineUnavailableTemporary:
      "El teléfono tiene presión temporal de memoria, energía o temperatura. Inténtalo más tarde.",
  }),
  fr: define({
    ...editionTranslations.fr,
    premium: "Premium",
    upgradeToPremium: "Débloquer Premium",
    premiumDescription:
      "Utilisez les fournisseurs cloud, tous les modes de réponse, la recherche web, les images, le mode Drive et le Mode suprême, les connaissances des sessions passées et tous les réglages avancés.",
    premiumBuy: "Acheter Premium",
    premiumBuyPrice: ({ price }) => `Acheter Premium · ${price}`,
    restorePurchase: "Restaurer l’achat",
    premiumRestoreHint:
      "L’achat permanent est restauré avec le même compte App Store ou Play Store sur cette plateforme. Aucun compte Mr Broccoli n’est requis.",
    premiumUnlocked: "Premium est débloqué",
    developmentEntitlement: "Accès de développement",
    developmentEntitlementHint:
      "Disponible uniquement dans les builds .dev et .maestro. Les modifications s’appliquent immédiatement et n’affectent pas les achats du Store.",
    premiumErrorUnavailable:
      "La boutique est indisponible. Réessayez plus tard.",
    premiumErrorFailed: "L’achat n’a pas pu être finalisé.",
    premiumErrorPending: "L’achat attend une validation.",
    freeOfflineTitle: "Mode privé sur l’appareil",
    freeOfflineIntro:
      "Choisissez votre langue pendant que Mr Broccoli analyse ce téléphone et recommande la meilleure configuration privée d’écoute, de raisonnement et de voix qu’il peut exécuter de façon fiable. Touchez Démarrer pour tout télécharger, installer et tester avant votre première conversation.",
    freeOfflineInternetDisclosure:
      "Le téléchargement des modèles nécessite internet. Ensuite, les conversations et sessions gratuites restent entièrement sur cet appareil.",
    freeOfflineProfile: "Le meilleur choix pour vous et ce téléphone",
    freeOfflineDownloadSize: ({ size }) => `${size} à télécharger`,
    freeOfflineDownloadAndTest: "Démarrer",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index} sur ${count}`,
    freeOfflineCooling: "Le téléphone refroidit avant de continuer…",
    freeOfflineReady: "Votre configuration privée hors ligne est prête.",
    freeOfflineUnavailableLanguage:
      "Aucune configuration locale complète ne prend encore en charge cette langue.",
    freeOfflineUnavailableDevice:
      "Ce téléphone ne peut pas exécuter en toute sécurité une configuration locale complète pour cette langue.",
    freeOfflineUnavailableStorage:
      "L’espace libre est insuffisant pour la configuration locale complète.",
    freeOfflineUnavailableTemporary:
      "Le téléphone subit une contrainte temporaire de mémoire, d’énergie ou de température. Réessayez plus tard.",
  }),
  it: define({
    ...editionTranslations.it,
    premium: "Premium",
    upgradeToPremium: "Sblocca Premium",
    premiumDescription:
      "Usa provider cloud, tutte le modalità di risposta, ricerca web, immagini, modalità Drive e Modalità suprema, conoscenza delle sessioni passate e tutte le impostazioni avanzate.",
    premiumBuy: "Acquista Premium",
    premiumBuyPrice: ({ price }) => `Acquista Premium · ${price}`,
    restorePurchase: "Ripristina acquisto",
    premiumRestoreHint:
      "L’acquisto permanente viene ripristinato con lo stesso account App Store o Play Store su questa piattaforma. Non serve un account Mr Broccoli.",
    premiumUnlocked: "Premium è sbloccato",
    developmentEntitlement: "Accesso di sviluppo",
    developmentEntitlementHint:
      "Disponibile solo nelle build .dev e .maestro. Le modifiche si applicano subito e non influiscono sugli acquisti dello store.",
    premiumErrorUnavailable: "Lo store non è disponibile. Riprova più tardi.",
    premiumErrorFailed: "Impossibile completare l’acquisto.",
    premiumErrorPending: "L’acquisto è in attesa di approvazione.",
    freeOfflineTitle: "Modalità privata sul dispositivo",
    freeOfflineIntro:
      "Scegli la tua lingua mentre Mr Broccoli analizza questo telefono e consiglia la migliore configurazione privata di ascolto, ragionamento e voce che può eseguire in modo affidabile. Tocca Inizia per scaricare, installare e testare tutto prima della prima conversazione.",
    freeOfflineInternetDisclosure:
      "Il download dei modelli richiede internet. Dopo l’installazione, conversazioni e sessioni gratuite restano interamente sul dispositivo.",
    freeOfflineProfile: "La scelta migliore per te e questo telefono",
    freeOfflineDownloadSize: ({ size }) => `${size} da scaricare`,
    freeOfflineDownloadAndTest: "Inizia",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index} di ${count}`,
    freeOfflineCooling: "Il telefono si sta raffreddando prima di continuare…",
    freeOfflineReady: "La configurazione privata offline è pronta.",
    freeOfflineUnavailableLanguage:
      "Nessuna configurazione locale completa supporta ancora questa lingua.",
    freeOfflineUnavailableDevice:
      "Questo telefono non può eseguire in sicurezza una configurazione locale completa per questa lingua.",
    freeOfflineUnavailableStorage:
      "Spazio libero insufficiente per la configurazione locale completa.",
    freeOfflineUnavailableTemporary:
      "Il telefono è temporaneamente sotto pressione di memoria, energia o calore. Riprova più tardi.",
  }),
  pt: define({
    ...editionTranslations.pt,
    premium: "Premium",
    upgradeToPremium: "Desbloquear Premium",
    premiumDescription:
      "Use fornecedores cloud, todos os modos de resposta, pesquisa web, imagens, modo Drive e Modo Supremo, conhecimento de sessões anteriores e todas as definições avançadas.",
    premiumBuy: "Comprar Premium",
    premiumBuyPrice: ({ price }) => `Comprar Premium · ${price}`,
    restorePurchase: "Restaurar compra",
    premiumRestoreHint:
      "A compra permanente é restaurada com a mesma conta da App Store ou Play Store nesta plataforma. Não é necessária uma conta Mr Broccoli.",
    premiumUnlocked: "Premium está desbloqueado",
    developmentEntitlement: "Acesso de desenvolvimento",
    developmentEntitlementHint:
      "Disponível apenas em compilações .dev e .maestro. As alterações são aplicadas imediatamente e não afetam as compras na loja.",
    premiumErrorUnavailable: "A loja não está disponível. Tente mais tarde.",
    premiumErrorFailed: "Não foi possível concluir a compra.",
    premiumErrorPending: "A compra aguarda aprovação.",
    freeOfflineTitle: "Modo privado no dispositivo",
    freeOfflineIntro:
      "Escolha o seu idioma enquanto o Mr Broccoli analisa este telefone e recomenda a melhor configuração privada de audição, raciocínio e voz que consegue executar com fiabilidade. Toque em Começar para transferir, instalar e testar tudo antes da primeira conversa.",
    freeOfflineInternetDisclosure:
      "A transferência dos modelos necessita de internet. Depois, as conversas e sessões gratuitas ficam totalmente neste dispositivo.",
    freeOfflineProfile: "A melhor opção para si e para este telemóvel",
    freeOfflineDownloadSize: ({ size }) => `${size} para transferir`,
    freeOfflineDownloadAndTest: "Começar",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index} de ${count}`,
    freeOfflineCooling: "A deixar o telemóvel arrefecer antes de continuar…",
    freeOfflineReady: "A configuração privada offline está pronta.",
    freeOfflineUnavailableLanguage:
      "Ainda não existe uma configuração local completa para este idioma.",
    freeOfflineUnavailableDevice:
      "Este telefone não pode executar com segurança uma configuração local completa para este idioma.",
    freeOfflineUnavailableStorage:
      "Não há espaço livre suficiente para a configuração local completa.",
    freeOfflineUnavailableTemporary:
      "O telefone está temporariamente sob pressão de memória, energia ou calor. Tente mais tarde.",
  }),
  ptBR: define({
    ...editionTranslations.ptBR,
    premium: "Premium",
    upgradeToPremium: "Desbloquear Premium",
    premiumDescription:
      "Use provedores em nuvem, todos os modos de resposta, busca na web, imagens, modo Drive e Modo Supremo, conhecimento de sessões anteriores e todas as configurações avançadas.",
    premiumBuy: "Comprar Premium",
    premiumBuyPrice: ({ price }) => `Comprar Premium · ${price}`,
    restorePurchase: "Restaurar compra",
    premiumRestoreHint:
      "A compra permanente é restaurada com a mesma conta da App Store ou Play Store nesta plataforma. Não é necessária uma conta Mr Broccoli.",
    premiumUnlocked: "Premium está desbloqueado",
    developmentEntitlement: "Acesso de desenvolvimento",
    developmentEntitlementHint:
      "Disponível apenas em builds .dev e .maestro. As alterações são aplicadas imediatamente e não afetam as compras na loja.",
    premiumErrorUnavailable: "A loja não está disponível. Tente mais tarde.",
    premiumErrorFailed: "Não foi possível concluir a compra.",
    premiumErrorPending: "A compra aguarda aprovação.",
    freeOfflineTitle: "Modo privado no dispositivo",
    freeOfflineIntro:
      "Escolha seu idioma enquanto o Mr Broccoli analisa este celular e recomenda a melhor configuração privada de escuta, raciocínio e voz que ele consegue executar com segurança. Toque em Começar para baixar, instalar e testar tudo antes da primeira conversa.",
    freeOfflineInternetDisclosure:
      "O download dos modelos precisa de internet. Depois, as conversas e sessões gratuitas ficam totalmente neste dispositivo.",
    freeOfflineProfile: "A melhor opção para você e este celular",
    freeOfflineDownloadSize: ({ size }) => `${size} de download`,
    freeOfflineDownloadAndTest: "Começar",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index} de ${count}`,
    freeOfflineCooling: "Aguardando o celular esfriar antes de continuar…",
    freeOfflineReady: "A configuração privada offline está pronta.",
    freeOfflineUnavailableLanguage:
      "Ainda não existe uma configuração local completa para este idioma.",
    freeOfflineUnavailableDevice:
      "Este celular não pode executar com segurança uma configuração local completa para este idioma.",
    freeOfflineUnavailableStorage:
      "Não há espaço livre suficiente para a configuração local completa.",
    freeOfflineUnavailableTemporary:
      "O celular está temporariamente sob pressão de memória, energia ou calor. Tente mais tarde.",
  }),
  ru: define({
    ...editionTranslations.ru,
    premium: "Premium",
    upgradeToPremium: "Открыть Premium",
    premiumDescription:
      "Используйте облачных провайдеров, все режимы ответа, веб-поиск, изображения, режим Drive и Суперрежим, знания прошлых сессий и расширенные настройки.",
    premiumBuy: "Купить Premium",
    premiumBuyPrice: ({ price }) => `Купить Premium · ${price}`,
    restorePurchase: "Восстановить покупку",
    premiumRestoreHint:
      "Постоянная покупка восстанавливается через ту же учётную запись App Store или Play Store на этой платформе. Учётная запись Mr Broccoli не нужна.",
    premiumUnlocked: "Premium разблокирован",
    developmentEntitlement: "Доступ для разработки",
    developmentEntitlementHint:
      "Доступно только в сборках .dev и .maestro. Изменения применяются сразу и не влияют на покупки в магазине.",
    premiumErrorUnavailable: "Магазин сейчас недоступен. Повторите позже.",
    premiumErrorFailed: "Не удалось завершить покупку.",
    premiumErrorPending: "Покупка ожидает подтверждения.",
    freeOfflineTitle: "Приватный режим на устройстве",
    freeOfflineIntro:
      "Выберите свой язык, а Mr Broccoli проверит этот телефон и предложит лучший приватный набор для распознавания, рассуждения и речи, который он сможет надёжно запускать. Нажмите «Начать», чтобы скачать, установить и проверить всё до первого разговора.",
    freeOfflineInternetDisclosure:
      "Для загрузки моделей нужен интернет. После установки бесплатные разговоры и сессии остаются только на устройстве.",
    freeOfflineProfile: "Лучший вариант для вас и этого телефона",
    freeOfflineDownloadSize: ({ size }) => `Загрузка ${size}`,
    freeOfflineDownloadAndTest: "Начать",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index} из ${count}`,
    freeOfflineCooling: "Телефон остывает перед продолжением…",
    freeOfflineReady: "Приватный офлайн-набор готов.",
    freeOfflineUnavailableLanguage:
      "Полного локального набора для этого языка пока нет.",
    freeOfflineUnavailableDevice:
      "Этот телефон не может безопасно запустить полный локальный набор для этого языка.",
    freeOfflineUnavailableStorage:
      "Недостаточно свободного места для полного локального набора.",
    freeOfflineUnavailableTemporary:
      "Телефон временно ограничен памятью, питанием или температурой. Повторите позже.",
  }),
  "zh-CN": define({
    ...editionTranslations["zh-CN"],
    premium: "高级版",
    upgradeToPremium: "解锁高级版",
    premiumDescription:
      "使用云端提供商、全部回答模式、网页搜索、图片、Drive 模式与终极模式、历史会话知识和所有高级设置。",
    premiumBuy: "购买高级版",
    premiumBuyPrice: ({ price }) => `购买高级版 · ${price}`,
    restorePurchase: "恢复购买",
    premiumRestoreHint:
      "永久购买可通过本平台上相同的 App Store 或 Play Store 帐户恢复，无需 Mr Broccoli 帐户。",
    premiumUnlocked: "高级版已解锁",
    developmentEntitlement: "开发版权限",
    developmentEntitlementHint:
      "仅在 .dev 和 .maestro 构建中可用。更改会立即生效，且不会影响商店购买。",
    premiumErrorUnavailable: "商店当前不可用，请稍后再试。",
    premiumErrorFailed: "无法完成购买。",
    premiumErrorPending: "购买正在等待批准。",
    freeOfflineTitle: "私密设备端模式",
    freeOfflineIntro:
      "请选择你的语言。Mr Broccoli 会检查这部手机，并推荐它能够可靠运行的最佳私密听写、推理和语音组合。点击“开始”，即可在首次对话前下载、安装并测试全部内容。",
    freeOfflineInternetDisclosure:
      "下载模型需要联网。安装后，免费对话和会话完全保留在此设备上。",
    freeOfflineProfile: "最适合你和这部手机的组合",
    freeOfflineDownloadSize: ({ size }) => `下载 ${size}`,
    freeOfflineDownloadAndTest: "开始",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index}/${count}`,
    freeOfflineCooling: "正在等待手机降温后继续…",
    freeOfflineReady: "私密离线组合已准备就绪。",
    freeOfflineUnavailableLanguage: "目前没有完整的本地组合支持此语言。",
    freeOfflineUnavailableDevice:
      "此手机无法安全运行此语言所需的完整本地组合。",
    freeOfflineUnavailableStorage: "没有足够的可用空间安装完整本地组合。",
    freeOfflineUnavailableTemporary:
      "手机暂时受到内存、电量或温度压力，请稍后再试。",
  }),
  ar: define({
    ...editionTranslations.ar,
    premium: "Premium",
    upgradeToPremium: "فتح Premium",
    premiumDescription:
      "استخدم مزودي السحابة وكل أوضاع الإجابة وبحث الويب والصور ووضع Drive والوضع الفائق ومعرفة الجلسات السابقة وكل الإعدادات المتقدمة.",
    premiumBuy: "شراء Premium",
    premiumBuyPrice: ({ price }) => `شراء Premium · ${price}`,
    restorePurchase: "استعادة الشراء",
    premiumRestoreHint:
      "تُستعاد عملية الشراء الدائمة عبر حساب App Store أو Play Store نفسه على هذه المنصة، ولا يلزم حساب Mr Broccoli.",
    premiumUnlocked: "تم فتح Premium",
    developmentEntitlement: "استحقاق إصدار التطوير",
    developmentEntitlementHint:
      "متاح فقط في إصدارات .dev و.maestro. تُطبَّق التغييرات فورًا ولا تؤثر في مشتريات المتجر.",
    premiumErrorUnavailable: "المتجر غير متاح الآن. حاول لاحقًا.",
    premiumErrorFailed: "تعذر إكمال الشراء.",
    premiumErrorPending: "الشراء بانتظار الموافقة.",
    freeOfflineTitle: "الوضع الخاص على الجهاز",
    freeOfflineIntro:
      "اختر لغتك بينما يفحص Mr Broccoli هذا الهاتف ويوصي بأفضل إعداد خاص للاستماع والاستدلال والصوت يمكنه تشغيله بثبات. اضغط على ابدأ لتنزيل كل شيء وتثبيته واختباره قبل محادثتك الأولى.",
    freeOfflineInternetDisclosure:
      "يتطلب تنزيل النماذج اتصالًا بالإنترنت. بعد التثبيت تبقى المحادثات والجلسات المجانية بالكامل على هذا الجهاز.",
    freeOfflineProfile: "أفضل إعداد لك ولهذا الهاتف",
    freeOfflineDownloadSize: ({ size }) => `تنزيل ${size}`,
    freeOfflineDownloadAndTest: "ابدأ",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index} من ${count}`,
    freeOfflineCooling: "يتم تبريد الهاتف قبل المتابعة…",
    freeOfflineReady: "الإعداد الخاص دون اتصال جاهز.",
    freeOfflineUnavailableLanguage:
      "لا يوجد بعد إعداد محلي كامل يدعم هذه اللغة.",
    freeOfflineUnavailableDevice:
      "لا يستطيع هذا الهاتف تشغيل إعداد محلي كامل لهذه اللغة بأمان.",
    freeOfflineUnavailableStorage:
      "لا توجد مساحة حرة كافية للإعداد المحلي الكامل.",
    freeOfflineUnavailableTemporary:
      "يتعرض الهاتف مؤقتًا لضغط الذاكرة أو الطاقة أو الحرارة. حاول لاحقًا.",
  }),
  ja: define({
    ...editionTranslations.ja,
    premium: "Premium",
    upgradeToPremium: "Premiumを解除",
    premiumDescription:
      "クラウドプロバイダー、すべての回答モード、ウェブ検索、画像、Driveモード・究極モード、過去セッションの知識、詳細設定を利用できます。",
    premiumBuy: "Premiumを購入",
    premiumBuyPrice: ({ price }) => `Premiumを購入 · ${price}`,
    restorePurchase: "購入を復元",
    premiumRestoreHint:
      "永久購入は、このプラットフォームの同じApp StoreまたはPlay Storeアカウントで復元されます。Mr Broccoliアカウントは不要です。",
    premiumUnlocked: "Premiumが解除されました",
    developmentEntitlement: "開発用アクセス権",
    developmentEntitlementHint:
      ".dev および .maestro ビルドでのみ利用できます。変更はすぐに適用され、ストアでの購入には影響しません。",
    premiumErrorUnavailable:
      "ストアを利用できません。後でもう一度お試しください。",
    premiumErrorFailed: "購入を完了できませんでした。",
    premiumErrorPending: "購入は承認待ちです。",
    freeOfflineTitle: "非公開オンデバイスモード",
    freeOfflineIntro:
      "言語を選ぶと、Mr Broccoliがこのスマートフォンを分析し、安定して動作する最適なプライベート聞き取り・推論・音声構成を提案します。開始をタップすると、最初の会話の前にすべてをダウンロード、インストール、テストします。",
    freeOfflineInternetDisclosure:
      "モデルのダウンロードにはインターネットが必要です。インストール後、無料の会話とセッションは完全にこの端末内に残ります。",
    freeOfflineProfile: "あなたとこのスマートフォンに最適",
    freeOfflineDownloadSize: ({ size }) => `${size}のダウンロード`,
    freeOfflineDownloadAndTest: "開始",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index}/${count}`,
    freeOfflineCooling: "続行する前に端末の温度が下がるのを待っています…",
    freeOfflineReady: "非公開オフライン構成の準備ができました。",
    freeOfflineUnavailableLanguage:
      "この言語に対応する完全なローカル構成はまだありません。",
    freeOfflineUnavailableDevice:
      "この端末では、この言語の完全なローカル構成を安全に実行できません。",
    freeOfflineUnavailableStorage:
      "完全なローカル構成に必要な空き容量がありません。",
    freeOfflineUnavailableTemporary:
      "端末が一時的にメモリ、電力、熱の制約を受けています。後でもう一度お試しください。",
  }),
  hu: define({
    ...editionTranslations.hu,
    premium: "Premium",
    upgradeToPremium: "Premium feloldása",
    premiumDescription:
      "Használj felhőszolgáltatókat, minden válaszmódot, webes keresést, képeket, Drive módot és Szuper módot, korábbi munkamenetek tudását és minden haladó beállítást.",
    premiumBuy: "Premium megvásárlása",
    premiumBuyPrice: ({ price }) => `Premium megvásárlása · ${price}`,
    restorePurchase: "Vásárlás visszaállítása",
    premiumRestoreHint:
      "A végleges vásárlás ezen a platformon ugyanazzal az App Store- vagy Play Store-fiókkal állítható vissza. Mr Broccoli-fiók nem szükséges.",
    premiumUnlocked: "Premium feloldva",
    developmentEntitlement: "Fejlesztői jogosultság",
    developmentEntitlementHint:
      "Csak .dev és .maestro buildekben érhető el. A módosítások azonnal érvénybe lépnek, és nem érintik az áruházi vásárlásokat.",
    premiumErrorUnavailable: "Az áruház most nem érhető el. Próbáld később.",
    premiumErrorFailed: "A vásárlás nem fejezhető be.",
    premiumErrorPending: "A vásárlás jóváhagyásra vár.",
    freeOfflineTitle: "Privát eszközön futó mód",
    freeOfflineIntro:
      "Válaszd ki a nyelved, miközben Mr Broccoli felméri ezt a telefont, és a megbízhatóan futtatható legjobb privát hallási, következtetési és hangbeállítást ajánlja. Az első beszélgetés előtt az Indítás gombbal tölthetsz le, telepíthetsz és tesztelhetsz mindent.",
    freeOfflineInternetDisclosure:
      "A modellek letöltéséhez internet kell. Telepítés után az ingyenes beszélgetések és munkamenetek teljesen az eszközön maradnak.",
    freeOfflineProfile: "A legjobb választás neked és ennek a telefonnak",
    freeOfflineDownloadSize: ({ size }) => `${size} letöltés`,
    freeOfflineDownloadAndTest: "Indítás",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index}/${count}`,
    freeOfflineCooling: "A telefon lehűlésére várunk a folytatás előtt…",
    freeOfflineReady: "A privát offline beállítás kész.",
    freeOfflineUnavailableLanguage:
      "Ehhez a nyelvhez még nincs teljes helyi beállítás.",
    freeOfflineUnavailableDevice:
      "Ez a telefon nem tud biztonságosan teljes helyi beállítást futtatni ehhez a nyelvhez.",
    freeOfflineUnavailableStorage:
      "Nincs elég szabad hely a teljes helyi beállításhoz.",
    freeOfflineUnavailableTemporary:
      "A telefont átmenetileg memória-, energia- vagy hőterhelés éri. Próbáld később.",
  }),
  cs: define({
    ...editionTranslations.cs,
    premium: "Premium",
    upgradeToPremium: "Odemknout Premium",
    premiumDescription:
      "Používejte cloudové poskytovatele, všechny režimy odpovědí, webové hledání, obrázky, režim Drive a Superrežim, znalosti z minulých relací a všechna pokročilá nastavení.",
    premiumBuy: "Koupit Premium",
    premiumBuyPrice: ({ price }) => `Koupit Premium · ${price}`,
    restorePurchase: "Obnovit nákup",
    premiumRestoreHint:
      "Trvalý nákup se obnoví přes stejný účet App Store nebo Play Store na této platformě. Účet Mr Broccoli není potřeba.",
    premiumUnlocked: "Premium je odemčeno",
    developmentEntitlement: "Vývojářské oprávnění",
    developmentEntitlementHint:
      "K dispozici pouze v sestaveních .dev a .maestro. Změny se projeví okamžitě a neovlivní nákupy v obchodě.",
    premiumErrorUnavailable: "Obchod teď není dostupný. Zkuste to později.",
    premiumErrorFailed: "Nákup se nepodařilo dokončit.",
    premiumErrorPending: "Nákup čeká na schválení.",
    freeOfflineTitle: "Soukromý režim v zařízení",
    freeOfflineIntro:
      "Vyberte svůj jazyk. Mr Broccoli mezitím prověří tento telefon a doporučí nejlepší soukromou sestavu pro poslech, uvažování a hlas, kterou dokáže spolehlivě provozovat. Klepnutím na Začít vše stáhnete, nainstalujete a otestujete před první konverzací.",
    freeOfflineInternetDisclosure:
      "Stažení modelů vyžaduje internet. Po instalaci zůstávají bezplatné konverzace a relace zcela v zařízení.",
    freeOfflineProfile: "Nejlepší volba pro vás a tento telefon",
    freeOfflineDownloadSize: ({ size }) => `Stažení ${size}`,
    freeOfflineDownloadAndTest: "Začít",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index} z ${count}`,
    freeOfflineCooling: "Před pokračováním se telefon nechává vychladnout…",
    freeOfflineReady: "Soukromá offline sestava je připravena.",
    freeOfflineUnavailableLanguage:
      "Pro tento jazyk zatím není kompletní místní sestava.",
    freeOfflineUnavailableDevice:
      "Tento telefon nemůže bezpečně spustit kompletní místní sestavu pro tento jazyk.",
    freeOfflineUnavailableStorage:
      "Pro kompletní místní sestavu není dostatek volného místa.",
    freeOfflineUnavailableTemporary:
      "Telefon je dočasně zatížen pamětí, napájením nebo teplotou. Zkuste to později.",
  }),
  pl: define({
    ...editionTranslations.pl,
    premium: "Premium",
    upgradeToPremium: "Odblokuj Premium",
    premiumDescription:
      "Korzystaj z dostawców chmurowych, wszystkich trybów odpowiedzi, wyszukiwania w sieci, obrazów, trybu Drive i Supertrybu, wiedzy z poprzednich sesji oraz wszystkich ustawień zaawansowanych.",
    premiumBuy: "Kup Premium",
    premiumBuyPrice: ({ price }) => `Kup Premium · ${price}`,
    restorePurchase: "Przywróć zakup",
    premiumRestoreHint:
      "Stały zakup jest przywracany przez to samo konto App Store lub Play Store na tej platformie. Konto Mr Broccoli nie jest wymagane.",
    premiumUnlocked: "Premium jest odblokowane",
    developmentEntitlement: "Uprawnienie deweloperskie",
    developmentEntitlementHint:
      "Dostępne tylko w kompilacjach .dev i .maestro. Zmiany są stosowane natychmiast i nie wpływają na zakupy w sklepie.",
    premiumErrorUnavailable: "Sklep jest teraz niedostępny. Spróbuj później.",
    premiumErrorFailed: "Nie udało się dokończyć zakupu.",
    premiumErrorPending: "Zakup oczekuje na zatwierdzenie.",
    freeOfflineTitle: "Prywatny tryb na urządzeniu",
    freeOfflineIntro:
      "Wybierz swój język, a Mr Broccoli sprawdzi ten telefon i zaproponuje najlepszy prywatny zestaw do słuchania, rozumowania i mówienia, który może działać niezawodnie. Naciśnij Rozpocznij, aby pobrać, zainstalować i przetestować wszystko przed pierwszą rozmową.",
    freeOfflineInternetDisclosure:
      "Pobranie modeli wymaga internetu. Po instalacji bezpłatne rozmowy i sesje pozostają w całości na urządzeniu.",
    freeOfflineProfile: "Najlepszy wybór dla Ciebie i tego telefonu",
    freeOfflineDownloadSize: ({ size }) => `Pobieranie ${size}`,
    freeOfflineDownloadAndTest: "Rozpocznij",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index} z ${count}`,
    freeOfflineCooling: "Telefon schładza się przed kontynuowaniem…",
    freeOfflineReady: "Prywatny zestaw offline jest gotowy.",
    freeOfflineUnavailableLanguage:
      "Nie ma jeszcze pełnego zestawu lokalnego dla tego języka.",
    freeOfflineUnavailableDevice:
      "Ten telefon nie może bezpiecznie uruchomić pełnego zestawu lokalnego dla tego języka.",
    freeOfflineUnavailableStorage:
      "Za mało wolnego miejsca na pełny zestaw lokalny.",
    freeOfflineUnavailableTemporary:
      "Telefon jest tymczasowo obciążony pamięcią, zasilaniem lub temperaturą. Spróbuj później.",
  }),
  tr: define({
    ...editionTranslations.tr,
    premium: "Premium",
    upgradeToPremium: "Premium’u aç",
    premiumDescription:
      "Bulut sağlayıcılarını, tüm yanıt modlarını, web aramasını, görselleri, Drive modunu ve Süper Modu, geçmiş oturum bilgisini ve tüm gelişmiş ayarları kullanın.",
    premiumBuy: "Premium satın al",
    premiumBuyPrice: ({ price }) => `Premium satın al · ${price}`,
    restorePurchase: "Satın almayı geri yükle",
    premiumRestoreHint:
      "Kalıcı satın alma bu platformdaki aynı App Store veya Play Store hesabıyla geri yüklenir. Mr Broccoli hesabı gerekmez.",
    premiumUnlocked: "Premium açık",
    developmentEntitlement: "Geliştirme erişimi",
    developmentEntitlementHint:
      "Yalnızca .dev ve .maestro derlemelerinde kullanılabilir. Değişiklikler hemen uygulanır ve mağaza satın alımlarını etkilemez.",
    premiumErrorUnavailable:
      "Mağaza şu anda kullanılamıyor. Daha sonra deneyin.",
    premiumErrorFailed: "Satın alma tamamlanamadı.",
    premiumErrorPending: "Satın alma onay bekliyor.",
    freeOfflineTitle: "Özel cihaz içi mod",
    freeOfflineIntro:
      "Dilinizi seçin. Mr Broccoli bu telefonu inceler ve güvenilir biçimde çalıştırabileceği en iyi özel dinleme, akıl yürütme ve ses kurulumunu önerir. İlk konuşmanızdan önce her şeyi indirmek, kurmak ve test etmek için Başlat’a dokunun.",
    freeOfflineInternetDisclosure:
      "Model indirmek için internet gerekir. Kurulumdan sonra ücretsiz konuşmalar ve oturumlar tamamen bu cihazda kalır.",
    freeOfflineProfile: "Sizin ve bu telefon için en iyi seçenek",
    freeOfflineDownloadSize: ({ size }) => `${size} indirme`,
    freeOfflineDownloadAndTest: "Başlat",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index}/${count}`,
    freeOfflineCooling: "Devam etmeden önce telefonun soğuması bekleniyor…",
    freeOfflineReady: "Özel çevrimdışı kurulum hazır.",
    freeOfflineUnavailableLanguage:
      "Bu dili destekleyen eksiksiz yerel kurulum henüz yok.",
    freeOfflineUnavailableDevice:
      "Bu telefon bu dil için eksiksiz yerel kurulumu güvenle çalıştıramıyor.",
    freeOfflineUnavailableStorage:
      "Eksiksiz yerel kurulum için yeterli boş alan yok.",
    freeOfflineUnavailableTemporary:
      "Telefon geçici olarak bellek, güç veya ısı baskısı altında. Daha sonra deneyin.",
  }),
  sv: define({
    ...editionTranslations.sv,
    premium: "Premium",
    upgradeToPremium: "Lås upp Premium",
    premiumDescription:
      "Använd molnleverantörer, alla svarslägen, webbsökning, bilder, Drive-läge och Superläge, kunskap från tidigare sessioner och alla avancerade inställningar.",
    premiumBuy: "Köp Premium",
    premiumBuyPrice: ({ price }) => `Köp Premium · ${price}`,
    restorePurchase: "Återställ köp",
    premiumRestoreHint:
      "Det permanenta köpet återställs med samma App Store- eller Play Store-konto på denna plattform. Inget Mr Broccoli-konto krävs.",
    premiumUnlocked: "Premium är upplåst",
    developmentEntitlement: "Utvecklarbehörighet",
    developmentEntitlementHint:
      "Endast tillgängligt i .dev- och .maestro-byggen. Ändringar gäller direkt och påverkar inte köp i butiken.",
    premiumErrorUnavailable: "Butiken är inte tillgänglig nu. Försök senare.",
    premiumErrorFailed: "Köpet kunde inte slutföras.",
    premiumErrorPending: "Köpet väntar på godkännande.",
    freeOfflineTitle: "Privat läge på enheten",
    freeOfflineIntro:
      "Välj ditt språk medan Mr Broccoli analyserar telefonen och rekommenderar den bästa privata uppsättningen för lyssning, resonemang och röst som den kan köra tillförlitligt. Tryck på Starta för att hämta, installera och testa allt före ditt första samtal.",
    freeOfflineInternetDisclosure:
      "Modellhämtningen kräver internet. Efter installationen stannar gratis samtal och sessioner helt på enheten.",
    freeOfflineProfile: "Bästa valet för dig och den här telefonen",
    freeOfflineDownloadSize: ({ size }) => `${size} hämtning`,
    freeOfflineDownloadAndTest: "Starta",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index} av ${count}`,
    freeOfflineCooling: "Telefonen får svalna innan vi fortsätter…",
    freeOfflineReady: "Din privata offlineuppsättning är klar.",
    freeOfflineUnavailableLanguage:
      "Det finns ännu ingen komplett lokal uppsättning för det här språket.",
    freeOfflineUnavailableDevice:
      "Telefonen kan inte säkert köra en komplett lokal uppsättning för det här språket.",
    freeOfflineUnavailableStorage:
      "Det finns inte tillräckligt med ledigt utrymme för den kompletta lokala uppsättningen.",
    freeOfflineUnavailableTemporary:
      "Telefonen är tillfälligt belastad av minne, ström eller värme. Försök senare.",
  }),
  ur: define({
    ...editionTranslations.ur,
    premium: "پریمیم",
    upgradeToPremium: "پریمیم کھولیں",
    premiumDescription:
      "کلاؤڈ فراہم کنندگان، تمام جوابی موڈ، ویب تلاش، تصاویر، Drive موڈ اور اعلیٰ موڈ، سابقہ سیشن کا علم اور تمام جدید ترتیبات استعمال کریں۔",
    premiumBuy: "پریمیم خریدیں",
    premiumBuyPrice: ({ price }) => `پریمیم خریدیں · ${price}`,
    restorePurchase: "خریداری بحال کریں",
    premiumRestoreHint:
      "مستقل خریداری اسی پلیٹ فارم پر اسی App Store یا Play Store اکاؤنٹ سے بحال ہوتی ہے۔ Mr Broccoli اکاؤنٹ درکار نہیں۔",
    premiumUnlocked: "پریمیم کھل گیا",
    developmentEntitlement: "ڈیولپمنٹ استحقاق",
    developmentEntitlementHint:
      "صرف .dev اور .maestro بلڈز میں دستیاب ہے۔ تبدیلیاں فوراً لاگو ہوتی ہیں اور اسٹور کی خریداریوں پر اثر نہیں ڈالتیں۔",
    premiumErrorUnavailable:
      "اسٹور ابھی دستیاب نہیں۔ بعد میں دوبارہ کوشش کریں۔",
    premiumErrorFailed: "خریداری مکمل نہیں ہو سکی۔",
    premiumErrorPending: "خریداری منظوری کی منتظر ہے۔",
    freeOfflineTitle: "نجی آن ڈیوائس موڈ",
    freeOfflineIntro:
      "اپنی زبان منتخب کریں۔ Mr Broccoli اس فون کو جانچ کر سننے، استدلال اور آواز کا بہترین نجی سیٹ اپ تجویز کرے گا جسے یہ قابل اعتماد طریقے سے چلا سکے۔ پہلی گفتگو سے پہلے سب کچھ ڈاؤن لوڈ، انسٹال اور ٹیسٹ کرنے کے لیے شروع کریں دبائیں۔",
    freeOfflineInternetDisclosure:
      "ماڈل ڈاؤن لوڈ کے لیے انٹرنیٹ چاہیے۔ تنصیب کے بعد مفت گفتگو اور سیشن مکمل طور پر اسی ڈیوائس پر رہتے ہیں۔",
    freeOfflineProfile: "آپ اور اس فون کے لیے بہترین انتخاب",
    freeOfflineDownloadSize: ({ size }) => `${size} ڈاؤن لوڈ`,
    freeOfflineDownloadAndTest: "شروع کریں",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index}/${count}`,
    freeOfflineCooling: "آگے بڑھنے سے پہلے فون کو ٹھنڈا ہونے دیا جا رہا ہے…",
    freeOfflineReady: "نجی آف لائن سیٹ تیار ہے۔",
    freeOfflineUnavailableLanguage:
      "اس زبان کے لیے ابھی مکمل مقامی سیٹ دستیاب نہیں۔",
    freeOfflineUnavailableDevice:
      "یہ فون اس زبان کے لیے مکمل مقامی سیٹ محفوظ طریقے سے نہیں چلا سکتا۔",
    freeOfflineUnavailableStorage: "مکمل مقامی سیٹ کے لیے کافی خالی جگہ نہیں۔",
    freeOfflineUnavailableTemporary:
      "فون عارضی طور پر میموری، توانائی یا گرمی کے دباؤ میں ہے۔ بعد میں کوشش کریں۔",
  }),
} as const;

export const premiumTranslations = rawPremiumTranslations;
