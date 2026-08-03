import type { TranslationParams } from "./types";
import { editionTranslations } from "./editionTranslations";

const en = {
  ...editionTranslations.en,
  premium: "Premium",
  upgradeToPremium: "Unlock Premium",
  premiumDescription:
    "Use cloud providers, every response mode, web search, images, Drive mode, Uber mode, past-session knowledge, and all advanced settings.",
  premiumBuy: "Buy Premium",
  premiumBuyPrice: ({ price }: TranslationParams) => `Buy Premium · ${price}`,
  restorePurchase: "Restore purchase",
  premiumRestoreHint:
    "A permanent purchase is restored through the same App Store or Play Store account on this platform. No Mr Broccoli account is required.",
  premiumUnlocked: "Premium is unlocked",
  developmentEntitlement: "Development entitlement",
  developmentEntitlementHint:
    "Only available in .dev builds. Changes apply immediately and do not affect store purchases.",
  premiumErrorUnavailable:
    "The store is unavailable right now. Try again later.",
  premiumErrorFailed: "The purchase could not be completed.",
  premiumErrorPending: "The purchase is awaiting approval.",
  freeOfflineTitle: "Private on-device mode",
  freeOfflineIntro:
    "Choose your preferred speaking language. Mr Broccoli will automatically find one complete local listening, thinking, and speaking setup that fits this phone.",
  freeOfflineInternetDisclosure:
    "The model download needs internet access. After installation, Free conversations and sessions stay entirely on this device.",
  freeOfflineProfile: "Recommended local setup",
  freeOfflineDownloadSize: ({ size }: TranslationParams) => `${size} download`,
  freeOfflineDownloadAndTest: "Download and test",
  freeOfflinePreparing: ({ model, index, count }: TranslationParams) =>
    `${model} · ${index} of ${count}`,
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
      "Nutze Cloud-Anbieter, alle Antwortmodi, Websuche, Bilder, Drive-Modus, Uber-Modus, Wissen aus früheren Sitzungen und alle erweiterten Einstellungen.",
    premiumBuy: "Premium kaufen",
    premiumBuyPrice: ({ price }) => `Premium kaufen · ${price}`,
    restorePurchase: "Kauf wiederherstellen",
    premiumRestoreHint:
      "Ein dauerhafter Kauf wird über dasselbe App-Store- oder Play-Store-Konto auf dieser Plattform wiederhergestellt. Ein Mr Broccoli Konto ist nicht erforderlich.",
    premiumUnlocked: "Premium ist freigeschaltet",
    developmentEntitlement: "Entwicklungsberechtigung",
    developmentEntitlementHint:
      "Nur in .dev-Builds verfügbar. Änderungen gelten sofort und wirken sich nicht auf Store-Käufe aus.",
    premiumErrorUnavailable:
      "Der Store ist gerade nicht verfügbar. Versuche es später erneut.",
    premiumErrorFailed: "Der Kauf konnte nicht abgeschlossen werden.",
    premiumErrorPending: "Der Kauf wartet auf Bestätigung.",
    freeOfflineTitle: "Privater Modus auf dem Gerät",
    freeOfflineIntro:
      "Wähle deine bevorzugte Sprechsprache. Mr Broccoli findet automatisch eine vollständige lokale Kombination zum Hören, Denken und Sprechen, die zu diesem Smartphone passt.",
    freeOfflineInternetDisclosure:
      "Der Modell-Download benötigt Internet. Danach bleiben kostenlose Gespräche und Sitzungen vollständig auf diesem Gerät.",
    freeOfflineProfile: "Empfohlene lokale Kombination",
    freeOfflineDownloadSize: ({ size }) => `${size} Download`,
    freeOfflineDownloadAndTest: "Herunterladen und testen",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index} von ${count}`,
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
      "Використовуйте хмарних провайдерів, усі режими відповідей, вебпошук, зображення, режими Drive й Uber, знання з минулих сесій та всі розширені налаштування.",
    premiumBuy: "Купити Premium",
    premiumBuyPrice: ({ price }) => `Купити Premium · ${price}`,
    restorePurchase: "Відновити покупку",
    premiumRestoreHint:
      "Постійна покупка відновлюється через той самий обліковий запис App Store або Play Store на цій платформі. Обліковий запис Mr Broccoli не потрібен.",
    premiumUnlocked: "Premium розблоковано",
    developmentEntitlement: "Право доступу для розробки",
    developmentEntitlementHint:
      "Доступно лише у збірках .dev. Зміни застосовуються одразу й не впливають на покупки в магазині.",
    premiumErrorUnavailable: "Магазин зараз недоступний. Спробуйте пізніше.",
    premiumErrorFailed: "Не вдалося завершити покупку.",
    premiumErrorPending: "Покупка очікує підтвердження.",
    freeOfflineTitle: "Приватний режим на пристрої",
    freeOfflineIntro:
      "Виберіть бажану мову спілкування. Mr Broccoli автоматично знайде повний локальний набір для слухання, мислення й мовлення, який підходить цьому телефону.",
    freeOfflineInternetDisclosure:
      "Для завантаження моделей потрібен інтернет. Після встановлення безкоштовні розмови й сесії залишаються лише на цьому пристрої.",
    freeOfflineProfile: "Рекомендований локальний набір",
    freeOfflineDownloadSize: ({ size }) => `Завантаження ${size}`,
    freeOfflineDownloadAndTest: "Завантажити й перевірити",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index} з ${count}`,
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
      "क्लाउड प्रदाता, सभी उत्तर मोड, वेब खोज, चित्र, Drive और Uber मोड, पिछली सत्र जानकारी और सभी उन्नत सेटिंग्स उपयोग करें।",
    premiumBuy: "प्रीमियम खरीदें",
    premiumBuyPrice: ({ price }) => `प्रीमियम खरीदें · ${price}`,
    restorePurchase: "खरीद बहाल करें",
    premiumRestoreHint:
      "स्थायी खरीद इसी प्लेटफ़ॉर्म पर उसी App Store या Play Store खाते से बहाल होती है। Mr Broccoli खाते की जरूरत नहीं है।",
    premiumUnlocked: "प्रीमियम अनलॉक है",
    developmentEntitlement: "डेवलपमेंट अधिकार",
    developmentEntitlementHint:
      ".dev बिल्ड में ही उपलब्ध। बदलाव तुरंत लागू होते हैं और स्टोर खरीदारी को प्रभावित नहीं करते।",
    premiumErrorUnavailable:
      "स्टोर अभी उपलब्ध नहीं है। बाद में फिर कोशिश करें।",
    premiumErrorFailed: "खरीद पूरी नहीं हुई।",
    premiumErrorPending: "खरीद स्वीकृति की प्रतीक्षा में है।",
    freeOfflineTitle: "निजी ऑन-डिवाइस मोड",
    freeOfflineIntro:
      "अपनी पसंदीदा बोलने की भाषा चुनें। Mr Broccoli इस फ़ोन के लिए पूरा स्थानीय सुनने, सोचने और बोलने का सेट स्वतः खोजेगा।",
    freeOfflineInternetDisclosure:
      "मॉडल डाउनलोड के लिए इंटरनेट चाहिए। स्थापना के बाद मुफ़्त बातचीत और सत्र पूरी तरह इसी डिवाइस पर रहते हैं।",
    freeOfflineProfile: "सुझाया स्थानीय सेट",
    freeOfflineDownloadSize: ({ size }) => `${size} डाउनलोड`,
    freeOfflineDownloadAndTest: "डाउनलोड और जाँचें",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index} / ${count}`,
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
      "Usa proveedores en la nube, todos los modos de respuesta, búsqueda web, imágenes, modos Drive y Uber, conocimiento de sesiones anteriores y todos los ajustes avanzados.",
    premiumBuy: "Comprar Premium",
    premiumBuyPrice: ({ price }) => `Comprar Premium · ${price}`,
    restorePurchase: "Restaurar compra",
    premiumRestoreHint:
      "La compra permanente se restaura con la misma cuenta de App Store o Play Store en esta plataforma. No hace falta una cuenta de Mr Broccoli.",
    premiumUnlocked: "Premium está desbloqueado",
    developmentEntitlement: "Acceso de desarrollo",
    developmentEntitlementHint:
      "Solo disponible en compilaciones .dev. Los cambios se aplican de inmediato y no afectan a las compras de la tienda.",
    premiumErrorUnavailable:
      "La tienda no está disponible ahora. Inténtalo más tarde.",
    premiumErrorFailed: "No se pudo completar la compra.",
    premiumErrorPending: "La compra espera aprobación.",
    freeOfflineTitle: "Modo privado en el dispositivo",
    freeOfflineIntro:
      "Elige tu idioma hablado preferido. Mr Broccoli buscará automáticamente una configuración local completa para escuchar, pensar y hablar que funcione en este teléfono.",
    freeOfflineInternetDisclosure:
      "La descarga de modelos necesita internet. Después, las conversaciones y sesiones gratuitas permanecen íntegramente en este dispositivo.",
    freeOfflineProfile: "Configuración local recomendada",
    freeOfflineDownloadSize: ({ size }) => `${size} de descarga`,
    freeOfflineDownloadAndTest: "Descargar y probar",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index} de ${count}`,
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
      "Utilisez les fournisseurs cloud, tous les modes de réponse, la recherche web, les images, les modes Drive et Uber, les connaissances des sessions passées et tous les réglages avancés.",
    premiumBuy: "Acheter Premium",
    premiumBuyPrice: ({ price }) => `Acheter Premium · ${price}`,
    restorePurchase: "Restaurer l’achat",
    premiumRestoreHint:
      "L’achat permanent est restauré avec le même compte App Store ou Play Store sur cette plateforme. Aucun compte Mr Broccoli n’est requis.",
    premiumUnlocked: "Premium est débloqué",
    developmentEntitlement: "Accès de développement",
    developmentEntitlementHint:
      "Disponible uniquement dans les builds .dev. Les modifications s’appliquent immédiatement et n’affectent pas les achats du Store.",
    premiumErrorUnavailable:
      "La boutique est indisponible. Réessayez plus tard.",
    premiumErrorFailed: "L’achat n’a pas pu être finalisé.",
    premiumErrorPending: "L’achat attend une validation.",
    freeOfflineTitle: "Mode privé sur l’appareil",
    freeOfflineIntro:
      "Choisissez votre langue parlée préférée. Mr Broccoli trouvera automatiquement une configuration locale complète d’écoute, de réflexion et de parole adaptée à ce téléphone.",
    freeOfflineInternetDisclosure:
      "Le téléchargement des modèles nécessite internet. Ensuite, les conversations et sessions gratuites restent entièrement sur cet appareil.",
    freeOfflineProfile: "Configuration locale recommandée",
    freeOfflineDownloadSize: ({ size }) => `${size} à télécharger`,
    freeOfflineDownloadAndTest: "Télécharger et tester",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index} sur ${count}`,
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
      "Usa provider cloud, tutte le modalità di risposta, ricerca web, immagini, modalità Drive e Uber, conoscenza delle sessioni passate e tutte le impostazioni avanzate.",
    premiumBuy: "Acquista Premium",
    premiumBuyPrice: ({ price }) => `Acquista Premium · ${price}`,
    restorePurchase: "Ripristina acquisto",
    premiumRestoreHint:
      "L’acquisto permanente viene ripristinato con lo stesso account App Store o Play Store su questa piattaforma. Non serve un account Mr Broccoli.",
    premiumUnlocked: "Premium è sbloccato",
    developmentEntitlement: "Accesso di sviluppo",
    developmentEntitlementHint:
      "Disponibile solo nelle build .dev. Le modifiche si applicano subito e non influiscono sugli acquisti dello store.",
    premiumErrorUnavailable: "Lo store non è disponibile. Riprova più tardi.",
    premiumErrorFailed: "Impossibile completare l’acquisto.",
    premiumErrorPending: "L’acquisto è in attesa di approvazione.",
    freeOfflineTitle: "Modalità privata sul dispositivo",
    freeOfflineIntro:
      "Scegli la lingua parlata che preferisci. Mr Broccoli troverà automaticamente una configurazione locale completa per ascolto, ragionamento e voce adatta a questo telefono.",
    freeOfflineInternetDisclosure:
      "Il download dei modelli richiede internet. Dopo l’installazione, conversazioni e sessioni gratuite restano interamente sul dispositivo.",
    freeOfflineProfile: "Configurazione locale consigliata",
    freeOfflineDownloadSize: ({ size }) => `${size} da scaricare`,
    freeOfflineDownloadAndTest: "Scarica e testa",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index} di ${count}`,
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
      "Use fornecedores cloud, todos os modos de resposta, pesquisa web, imagens, modos Drive e Uber, conhecimento de sessões anteriores e todas as definições avançadas.",
    premiumBuy: "Comprar Premium",
    premiumBuyPrice: ({ price }) => `Comprar Premium · ${price}`,
    restorePurchase: "Restaurar compra",
    premiumRestoreHint:
      "A compra permanente é restaurada com a mesma conta da App Store ou Play Store nesta plataforma. Não é necessária uma conta Mr Broccoli.",
    premiumUnlocked: "Premium está desbloqueado",
    developmentEntitlement: "Acesso de desenvolvimento",
    developmentEntitlementHint:
      "Disponível apenas em compilações .dev. As alterações são aplicadas imediatamente e não afetam as compras na loja.",
    premiumErrorUnavailable: "A loja não está disponível. Tente mais tarde.",
    premiumErrorFailed: "Não foi possível concluir a compra.",
    premiumErrorPending: "A compra aguarda aprovação.",
    freeOfflineTitle: "Modo privado no dispositivo",
    freeOfflineIntro:
      "Escolha o idioma falado que prefere. Mr Broccoli encontrará automaticamente uma configuração local completa para ouvir, pensar e falar adequada a este telefone.",
    freeOfflineInternetDisclosure:
      "A transferência dos modelos necessita de internet. Depois, as conversas e sessões gratuitas ficam totalmente neste dispositivo.",
    freeOfflineProfile: "Configuração local recomendada",
    freeOfflineDownloadSize: ({ size }) => `${size} para transferir`,
    freeOfflineDownloadAndTest: "Transferir e testar",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index} de ${count}`,
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
      "Use provedores em nuvem, todos os modos de resposta, busca na web, imagens, modos Drive e Uber, conhecimento de sessões anteriores e todas as configurações avançadas.",
    premiumBuy: "Comprar Premium",
    premiumBuyPrice: ({ price }) => `Comprar Premium · ${price}`,
    restorePurchase: "Restaurar compra",
    premiumRestoreHint:
      "A compra permanente é restaurada com a mesma conta da App Store ou Play Store nesta plataforma. Não é necessária uma conta Mr Broccoli.",
    premiumUnlocked: "Premium está desbloqueado",
    developmentEntitlement: "Acesso de desenvolvimento",
    developmentEntitlementHint:
      "Disponível apenas em builds .dev. As alterações são aplicadas imediatamente e não afetam as compras na loja.",
    premiumErrorUnavailable: "A loja não está disponível. Tente mais tarde.",
    premiumErrorFailed: "Não foi possível concluir a compra.",
    premiumErrorPending: "A compra aguarda aprovação.",
    freeOfflineTitle: "Modo privado no dispositivo",
    freeOfflineIntro:
      "Escolha seu idioma falado preferido. Mr Broccoli encontrará automaticamente uma configuração local completa para ouvir, pensar e falar adequada a este celular.",
    freeOfflineInternetDisclosure:
      "O download dos modelos precisa de internet. Depois, as conversas e sessões gratuitas ficam totalmente neste dispositivo.",
    freeOfflineProfile: "Configuração local recomendada",
    freeOfflineDownloadSize: ({ size }) => `${size} de download`,
    freeOfflineDownloadAndTest: "Baixar e testar",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index} de ${count}`,
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
      "Используйте облачных провайдеров, все режимы ответа, веб-поиск, изображения, режимы Drive и Uber, знания прошлых сессий и расширенные настройки.",
    premiumBuy: "Купить Premium",
    premiumBuyPrice: ({ price }) => `Купить Premium · ${price}`,
    restorePurchase: "Восстановить покупку",
    premiumRestoreHint:
      "Постоянная покупка восстанавливается через ту же учётную запись App Store или Play Store на этой платформе. Учётная запись Mr Broccoli не нужна.",
    premiumUnlocked: "Premium разблокирован",
    developmentEntitlement: "Доступ для разработки",
    developmentEntitlementHint:
      "Доступно только в сборках .dev. Изменения применяются сразу и не влияют на покупки в магазине.",
    premiumErrorUnavailable: "Магазин сейчас недоступен. Повторите позже.",
    premiumErrorFailed: "Не удалось завершить покупку.",
    premiumErrorPending: "Покупка ожидает подтверждения.",
    freeOfflineTitle: "Приватный режим на устройстве",
    freeOfflineIntro:
      "Выберите предпочитаемый язык общения. Mr Broccoli автоматически найдёт полный локальный набор для распознавания, мышления и речи, подходящий телефону.",
    freeOfflineInternetDisclosure:
      "Для загрузки моделей нужен интернет. После установки бесплатные разговоры и сессии остаются только на устройстве.",
    freeOfflineProfile: "Рекомендуемый локальный набор",
    freeOfflineDownloadSize: ({ size }) => `Загрузка ${size}`,
    freeOfflineDownloadAndTest: "Скачать и проверить",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index} из ${count}`,
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
      "使用云端提供商、全部回答模式、网页搜索、图片、Drive 与 Uber 模式、历史会话知识和所有高级设置。",
    premiumBuy: "购买高级版",
    premiumBuyPrice: ({ price }) => `购买高级版 · ${price}`,
    restorePurchase: "恢复购买",
    premiumRestoreHint:
      "永久购买可通过本平台上相同的 App Store 或 Play Store 帐户恢复，无需 Mr Broccoli 帐户。",
    premiumUnlocked: "高级版已解锁",
    developmentEntitlement: "开发版权限",
    developmentEntitlementHint:
      "仅在 .dev 构建中可用。更改会立即生效，且不会影响商店购买。",
    premiumErrorUnavailable: "商店当前不可用，请稍后再试。",
    premiumErrorFailed: "无法完成购买。",
    premiumErrorPending: "购买正在等待批准。",
    freeOfflineTitle: "私密设备端模式",
    freeOfflineIntro:
      "请选择你偏好的口语。Mr Broccoli 会自动查找一套适合此手机的本地听、思考和语音组合。",
    freeOfflineInternetDisclosure:
      "下载模型需要联网。安装后，免费对话和会话完全保留在此设备上。",
    freeOfflineProfile: "推荐的本地组合",
    freeOfflineDownloadSize: ({ size }) => `下载 ${size}`,
    freeOfflineDownloadAndTest: "下载并测试",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index}/${count}`,
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
      "استخدم مزودي السحابة وكل أوضاع الإجابة وبحث الويب والصور ووضعي Drive وUber ومعرفة الجلسات السابقة وكل الإعدادات المتقدمة.",
    premiumBuy: "شراء Premium",
    premiumBuyPrice: ({ price }) => `شراء Premium · ${price}`,
    restorePurchase: "استعادة الشراء",
    premiumRestoreHint:
      "تُستعاد عملية الشراء الدائمة عبر حساب App Store أو Play Store نفسه على هذه المنصة، ولا يلزم حساب Mr Broccoli.",
    premiumUnlocked: "تم فتح Premium",
    developmentEntitlement: "استحقاق إصدار التطوير",
    developmentEntitlementHint:
      "متاح فقط في إصدارات .dev. تُطبَّق التغييرات فورًا ولا تؤثر في مشتريات المتجر.",
    premiumErrorUnavailable: "المتجر غير متاح الآن. حاول لاحقًا.",
    premiumErrorFailed: "تعذر إكمال الشراء.",
    premiumErrorPending: "الشراء بانتظار الموافقة.",
    freeOfflineTitle: "الوضع الخاص على الجهاز",
    freeOfflineIntro:
      "اختر لغة التحدث المفضلة. سيجد Mr Broccoli تلقائيًا إعدادًا محليًا كاملًا للاستماع والتفكير والنطق يناسب هذا الهاتف.",
    freeOfflineInternetDisclosure:
      "يتطلب تنزيل النماذج اتصالًا بالإنترنت. بعد التثبيت تبقى المحادثات والجلسات المجانية بالكامل على هذا الجهاز.",
    freeOfflineProfile: "الإعداد المحلي المقترح",
    freeOfflineDownloadSize: ({ size }) => `تنزيل ${size}`,
    freeOfflineDownloadAndTest: "تنزيل واختبار",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index} من ${count}`,
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
      "クラウドプロバイダー、すべての回答モード、ウェブ検索、画像、Drive・Uberモード、過去セッションの知識、詳細設定を利用できます。",
    premiumBuy: "Premiumを購入",
    premiumBuyPrice: ({ price }) => `Premiumを購入 · ${price}`,
    restorePurchase: "購入を復元",
    premiumRestoreHint:
      "永久購入は、このプラットフォームの同じApp StoreまたはPlay Storeアカウントで復元されます。Mr Broccoliアカウントは不要です。",
    premiumUnlocked: "Premiumが解除されました",
    developmentEntitlement: "開発用アクセス権",
    developmentEntitlementHint:
      ".dev ビルドでのみ利用できます。変更はすぐに適用され、ストアでの購入には影響しません。",
    premiumErrorUnavailable:
      "ストアを利用できません。後でもう一度お試しください。",
    premiumErrorFailed: "購入を完了できませんでした。",
    premiumErrorPending: "購入は承認待ちです。",
    freeOfflineTitle: "非公開オンデバイスモード",
    freeOfflineIntro:
      "希望する話し言葉を選んでください。Mr Broccoliが、この端末に適したローカルの聞き取り・思考・音声の完全な構成を自動で探します。",
    freeOfflineInternetDisclosure:
      "モデルのダウンロードにはインターネットが必要です。インストール後、無料の会話とセッションは完全にこの端末内に残ります。",
    freeOfflineProfile: "推奨ローカル構成",
    freeOfflineDownloadSize: ({ size }) => `${size}のダウンロード`,
    freeOfflineDownloadAndTest: "ダウンロードしてテスト",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index}/${count}`,
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
      "Használj felhőszolgáltatókat, minden válaszmódot, webes keresést, képeket, Drive és Uber módot, korábbi munkamenetek tudását és minden haladó beállítást.",
    premiumBuy: "Premium megvásárlása",
    premiumBuyPrice: ({ price }) => `Premium megvásárlása · ${price}`,
    restorePurchase: "Vásárlás visszaállítása",
    premiumRestoreHint:
      "A végleges vásárlás ezen a platformon ugyanazzal az App Store- vagy Play Store-fiókkal állítható vissza. Mr Broccoli-fiók nem szükséges.",
    premiumUnlocked: "Premium feloldva",
    developmentEntitlement: "Fejlesztői jogosultság",
    developmentEntitlementHint:
      "Csak .dev buildekben érhető el. A módosítások azonnal érvénybe lépnek, és nem érintik az áruházi vásárlásokat.",
    premiumErrorUnavailable: "Az áruház most nem érhető el. Próbáld később.",
    premiumErrorFailed: "A vásárlás nem fejezhető be.",
    premiumErrorPending: "A vásárlás jóváhagyásra vár.",
    freeOfflineTitle: "Privát eszközön futó mód",
    freeOfflineIntro:
      "Válaszd ki a kívánt beszélt nyelvet. Mr Broccoli automatikusan megkeresi a telefonhoz illő teljes helyi hallási, gondolkodási és beszédbeállítást.",
    freeOfflineInternetDisclosure:
      "A modellek letöltéséhez internet kell. Telepítés után az ingyenes beszélgetések és munkamenetek teljesen az eszközön maradnak.",
    freeOfflineProfile: "Ajánlott helyi beállítás",
    freeOfflineDownloadSize: ({ size }) => `${size} letöltés`,
    freeOfflineDownloadAndTest: "Letöltés és teszt",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index}/${count}`,
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
      "Používejte cloudové poskytovatele, všechny režimy odpovědí, webové hledání, obrázky, režimy Drive a Uber, znalosti z minulých relací a všechna pokročilá nastavení.",
    premiumBuy: "Koupit Premium",
    premiumBuyPrice: ({ price }) => `Koupit Premium · ${price}`,
    restorePurchase: "Obnovit nákup",
    premiumRestoreHint:
      "Trvalý nákup se obnoví přes stejný účet App Store nebo Play Store na této platformě. Účet Mr Broccoli není potřeba.",
    premiumUnlocked: "Premium je odemčeno",
    developmentEntitlement: "Vývojářské oprávnění",
    developmentEntitlementHint:
      "K dispozici pouze v sestaveních .dev. Změny se projeví okamžitě a neovlivní nákupy v obchodě.",
    premiumErrorUnavailable: "Obchod teď není dostupný. Zkuste to později.",
    premiumErrorFailed: "Nákup se nepodařilo dokončit.",
    premiumErrorPending: "Nákup čeká na schválení.",
    freeOfflineTitle: "Soukromý režim v zařízení",
    freeOfflineIntro:
      "Vyberte preferovaný jazyk mluvení. Mr Broccoli automaticky najde kompletní místní sestavu pro poslech, myšlení a řeč vhodnou pro tento telefon.",
    freeOfflineInternetDisclosure:
      "Stažení modelů vyžaduje internet. Po instalaci zůstávají bezplatné konverzace a relace zcela v zařízení.",
    freeOfflineProfile: "Doporučená místní sestava",
    freeOfflineDownloadSize: ({ size }) => `Stažení ${size}`,
    freeOfflineDownloadAndTest: "Stáhnout a otestovat",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index} z ${count}`,
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
      "Korzystaj z dostawców chmurowych, wszystkich trybów odpowiedzi, wyszukiwania w sieci, obrazów, trybów Drive i Uber, wiedzy z poprzednich sesji oraz wszystkich ustawień zaawansowanych.",
    premiumBuy: "Kup Premium",
    premiumBuyPrice: ({ price }) => `Kup Premium · ${price}`,
    restorePurchase: "Przywróć zakup",
    premiumRestoreHint:
      "Stały zakup jest przywracany przez to samo konto App Store lub Play Store na tej platformie. Konto Mr Broccoli nie jest wymagane.",
    premiumUnlocked: "Premium jest odblokowane",
    developmentEntitlement: "Uprawnienie deweloperskie",
    developmentEntitlementHint:
      "Dostępne tylko w kompilacjach .dev. Zmiany są stosowane natychmiast i nie wpływają na zakupy w sklepie.",
    premiumErrorUnavailable: "Sklep jest teraz niedostępny. Spróbuj później.",
    premiumErrorFailed: "Nie udało się dokończyć zakupu.",
    premiumErrorPending: "Zakup oczekuje na zatwierdzenie.",
    freeOfflineTitle: "Prywatny tryb na urządzeniu",
    freeOfflineIntro:
      "Wybierz preferowany język mówiony. Mr Broccoli automatycznie znajdzie pełny lokalny zestaw do słuchania, myślenia i mówienia odpowiedni dla telefonu.",
    freeOfflineInternetDisclosure:
      "Pobranie modeli wymaga internetu. Po instalacji bezpłatne rozmowy i sesje pozostają w całości na urządzeniu.",
    freeOfflineProfile: "Zalecany zestaw lokalny",
    freeOfflineDownloadSize: ({ size }) => `Pobieranie ${size}`,
    freeOfflineDownloadAndTest: "Pobierz i przetestuj",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index} z ${count}`,
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
      "Bulut sağlayıcılarını, tüm yanıt modlarını, web aramasını, görselleri, Drive ve Uber modlarını, geçmiş oturum bilgisini ve tüm gelişmiş ayarları kullanın.",
    premiumBuy: "Premium satın al",
    premiumBuyPrice: ({ price }) => `Premium satın al · ${price}`,
    restorePurchase: "Satın almayı geri yükle",
    premiumRestoreHint:
      "Kalıcı satın alma bu platformdaki aynı App Store veya Play Store hesabıyla geri yüklenir. Mr Broccoli hesabı gerekmez.",
    premiumUnlocked: "Premium açık",
    developmentEntitlement: "Geliştirme erişimi",
    developmentEntitlementHint:
      "Yalnızca .dev derlemelerinde kullanılabilir. Değişiklikler hemen uygulanır ve mağaza satın alımlarını etkilemez.",
    premiumErrorUnavailable:
      "Mağaza şu anda kullanılamıyor. Daha sonra deneyin.",
    premiumErrorFailed: "Satın alma tamamlanamadı.",
    premiumErrorPending: "Satın alma onay bekliyor.",
    freeOfflineTitle: "Özel cihaz içi mod",
    freeOfflineIntro:
      "Tercih ettiğiniz konuşma dilini seçin. Mr Broccoli bu telefona uygun eksiksiz yerel dinleme, düşünme ve konuşma kurulumunu otomatik bulur.",
    freeOfflineInternetDisclosure:
      "Model indirmek için internet gerekir. Kurulumdan sonra ücretsiz konuşmalar ve oturumlar tamamen bu cihazda kalır.",
    freeOfflineProfile: "Önerilen yerel kurulum",
    freeOfflineDownloadSize: ({ size }) => `${size} indirme`,
    freeOfflineDownloadAndTest: "İndir ve test et",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index}/${count}`,
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
      "Använd molnleverantörer, alla svarslägen, webbsökning, bilder, Drive- och Uber-läge, kunskap från tidigare sessioner och alla avancerade inställningar.",
    premiumBuy: "Köp Premium",
    premiumBuyPrice: ({ price }) => `Köp Premium · ${price}`,
    restorePurchase: "Återställ köp",
    premiumRestoreHint:
      "Det permanenta köpet återställs med samma App Store- eller Play Store-konto på denna plattform. Inget Mr Broccoli-konto krävs.",
    premiumUnlocked: "Premium är upplåst",
    developmentEntitlement: "Utvecklarbehörighet",
    developmentEntitlementHint:
      "Endast tillgängligt i .dev-byggen. Ändringar gäller direkt och påverkar inte köp i butiken.",
    premiumErrorUnavailable: "Butiken är inte tillgänglig nu. Försök senare.",
    premiumErrorFailed: "Köpet kunde inte slutföras.",
    premiumErrorPending: "Köpet väntar på godkännande.",
    freeOfflineTitle: "Privat läge på enheten",
    freeOfflineIntro:
      "Välj önskat talspråk. Mr Broccoli hittar automatiskt en komplett lokal uppsättning för lyssning, tänkande och tal som passar telefonen.",
    freeOfflineInternetDisclosure:
      "Modellhämtningen kräver internet. Efter installationen stannar gratis samtal och sessioner helt på enheten.",
    freeOfflineProfile: "Rekommenderad lokal uppsättning",
    freeOfflineDownloadSize: ({ size }) => `${size} hämtning`,
    freeOfflineDownloadAndTest: "Hämta och testa",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index} av ${count}`,
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
      "کلاؤڈ فراہم کنندگان، تمام جوابی موڈ، ویب تلاش، تصاویر، Drive اور Uber موڈ، سابقہ سیشن کا علم اور تمام جدید ترتیبات استعمال کریں۔",
    premiumBuy: "پریمیم خریدیں",
    premiumBuyPrice: ({ price }) => `پریمیم خریدیں · ${price}`,
    restorePurchase: "خریداری بحال کریں",
    premiumRestoreHint:
      "مستقل خریداری اسی پلیٹ فارم پر اسی App Store یا Play Store اکاؤنٹ سے بحال ہوتی ہے۔ Mr Broccoli اکاؤنٹ درکار نہیں۔",
    premiumUnlocked: "پریمیم کھل گیا",
    developmentEntitlement: "ڈیولپمنٹ استحقاق",
    developmentEntitlementHint:
      "صرف .dev بلڈز میں دستیاب ہے۔ تبدیلیاں فوراً لاگو ہوتی ہیں اور اسٹور کی خریداریوں پر اثر نہیں ڈالتیں۔",
    premiumErrorUnavailable:
      "اسٹور ابھی دستیاب نہیں۔ بعد میں دوبارہ کوشش کریں۔",
    premiumErrorFailed: "خریداری مکمل نہیں ہو سکی۔",
    premiumErrorPending: "خریداری منظوری کی منتظر ہے۔",
    freeOfflineTitle: "نجی آن ڈیوائس موڈ",
    freeOfflineIntro:
      "اپنی پسندیدہ بولنے کی زبان منتخب کریں۔ Mr Broccoli خودکار طور پر اس فون کے لیے مکمل مقامی سننے، سوچنے اور بولنے کا سیٹ تلاش کرے گا۔",
    freeOfflineInternetDisclosure:
      "ماڈل ڈاؤن لوڈ کے لیے انٹرنیٹ چاہیے۔ تنصیب کے بعد مفت گفتگو اور سیشن مکمل طور پر اسی ڈیوائس پر رہتے ہیں۔",
    freeOfflineProfile: "تجویز کردہ مقامی سیٹ",
    freeOfflineDownloadSize: ({ size }) => `${size} ڈاؤن لوڈ`,
    freeOfflineDownloadAndTest: "ڈاؤن لوڈ اور ٹیسٹ",
    freeOfflinePreparing: ({ model, index, count }) =>
      `${model} · ${index}/${count}`,
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

const localizedAppNames = {
  en: "Mr Broccoli",
  de: "Mr. Brokkoli",
  uk: "Пан Броколі",
  hi: "मिस्टर ब्रोकली",
  es: "Sr. Brócoli",
  fr: "M. Brocoli",
  it: "Sig. Broccoli",
  pt: "Sr. Brócolo",
  ptBR: "Sr. Brócolis",
  ru: "Мистер Брокколи",
  "zh-CN": "西兰花先生",
  ar: "السيد بروكلي",
  ja: "ミスター・ブロッコリー",
  hu: "Brokkoli úr",
  cs: "Pan Brokolice",
  pl: "Pan Brokuł",
  tr: "Bay Brokoli",
  sv: "Herr Broccoli",
  ur: "مسٹر بروکلی",
} as const satisfies Record<keyof typeof rawPremiumTranslations, string>;

function localizeAppName(
  value: PremiumTranslations,
  appName: string,
): PremiumTranslations {
  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [
      key,
      typeof entry === "string"
        ? entry.replaceAll("Mr Broccoli", appName)
        : entry,
    ]),
  ) as PremiumTranslations;
}

export const premiumTranslations = Object.fromEntries(
  Object.entries(rawPremiumTranslations).map(([language, value]) => [
    language,
    localizeAppName(
      value,
      localizedAppNames[language as keyof typeof localizedAppNames],
    ),
  ]),
) as {
  [Language in keyof typeof rawPremiumTranslations]: PremiumTranslations;
};
