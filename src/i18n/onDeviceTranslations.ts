import type { TranslationParams } from "./types";

const en = {
  settingsOnDevice: "On-device AI",
  settingsOnDeviceSummary:
    "Private local models, device checks, downloads, and tests.",
  onDeviceIntro:
    "Choose languages once, then Mr Broccoli only offers local listening, thinking, and speaking models that fit this phone.",
  onDeviceLanguages: "Conversation languages",
  onDeviceLanguagesHint:
    "Every selected local model must support all of these languages. This choice also updates listening and spoken-reply languages.",
  onDeviceTestDevice: "Test this device again",
  onDeviceTestingDevice: "Testing this device…",
  onDeviceDeviceReady: "Device check complete",
  onDeviceDeviceSummary: ({ memory, storage }: TranslationParams) =>
    `${memory} RAM · ${storage} free`,
  onDeviceNoCompatibleModels:
    "No local model in the curated catalogue supports every selected language and fits this device.",
  onDeviceThinkingModels: "Local responses",
  onDeviceListeningModels: "Local speech recognition",
  onDeviceSpeakingModels: "Local voices",
  onDeviceUse: "Use",
  onDeviceInUse: "In use",
  onDeviceViable: "Test passed",
  onDeviceBelowTarget: "Works, but slower than recommended",
  onDeviceTestFailed: "Test failed",
  onDeviceNotTested: "Not tested yet",
  chooseOnDeviceSttModel:
    "Choose an on-device speech recognition model in Settings.",
  chooseOnDeviceTtsModel: "Choose an on-device speech model in Settings.",
};

type OnDeviceTranslations = typeof en;
const define = (value: OnDeviceTranslations) => value;

export const onDeviceTranslations = {
  en,
  de: define({
    settingsOnDevice: "KI auf dem Gerät",
    settingsOnDeviceSummary:
      "Private lokale Modelle, Geräteprüfung, Downloads und Tests.",
    onDeviceIntro:
      "Wähle Sprachen einmal aus. Mr. Brokkoli bietet danach nur lokale Modelle zum Hören, Denken und Sprechen an, die zu diesem Smartphone passen.",
    onDeviceLanguages: "Gesprächssprachen",
    onDeviceLanguagesHint:
      "Jedes lokale Modell muss alle ausgewählten Sprachen unterstützen. Die Auswahl aktualisiert auch Erkennung und Sprachausgabe.",
    onDeviceTestDevice: "Gerät erneut testen",
    onDeviceTestingDevice: "Gerät wird getestet…",
    onDeviceDeviceReady: "Geräteprüfung abgeschlossen",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} RAM · ${storage} frei`,
    onDeviceNoCompatibleModels:
      "Kein lokales Modell im geprüften Katalog unterstützt alle ausgewählten Sprachen und passt zu diesem Gerät.",
    onDeviceThinkingModels: "Lokale Antworten",
    onDeviceListeningModels: "Lokale Spracherkennung",
    onDeviceSpeakingModels: "Lokale Stimmen",
    onDeviceUse: "Verwenden",
    onDeviceInUse: "Wird verwendet",
    onDeviceViable: "Test bestanden",
    onDeviceBelowTarget: "Funktioniert, aber langsamer als empfohlen",
    onDeviceTestFailed: "Test fehlgeschlagen",
    onDeviceNotTested: "Noch nicht getestet",
    chooseOnDeviceSttModel:
      "Wähle in den Einstellungen ein Modell zur Spracherkennung auf dem Gerät aus.",
    chooseOnDeviceTtsModel:
      "Wähle in den Einstellungen ein Sprachmodell auf dem Gerät aus.",
  }),
  uk: define({
    settingsOnDevice: "ШІ на пристрої",
    settingsOnDeviceSummary:
      "Приватні локальні моделі, перевірка пристрою, завантаження й тести.",
    onDeviceIntro:
      "Виберіть мови один раз, і Пан Броколі запропонує лише локальні моделі для слухання, мислення та мовлення, які підходять цьому телефону.",
    onDeviceLanguages: "Мови розмови",
    onDeviceLanguagesHint:
      "Кожна локальна модель має підтримувати всі вибрані мови. Вибір також оновлює мови розпізнавання та озвучення.",
    onDeviceTestDevice: "Перевірити пристрій знову",
    onDeviceTestingDevice: "Перевірка пристрою…",
    onDeviceDeviceReady: "Перевірку пристрою завершено",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} ОЗП · ${storage} вільно`,
    onDeviceNoCompatibleModels:
      "У перевіреному каталозі немає локальної моделі, яка підтримує всі вибрані мови й підходить цьому пристрою.",
    onDeviceThinkingModels: "Локальні відповіді",
    onDeviceListeningModels: "Локальне розпізнавання мовлення",
    onDeviceSpeakingModels: "Локальні голоси",
    onDeviceUse: "Використовувати",
    onDeviceInUse: "Використовується",
    onDeviceViable: "Тест пройдено",
    onDeviceBelowTarget: "Працює, але повільніше за рекомендоване",
    onDeviceTestFailed: "Тест не пройдено",
    onDeviceNotTested: "Ще не перевірено",
    chooseOnDeviceSttModel:
      "Виберіть у налаштуваннях модель розпізнавання мовлення на пристрої.",
    chooseOnDeviceTtsModel:
      "Виберіть у налаштуваннях модель мовлення на пристрої.",
  }),
  hi: define({
    settingsOnDevice: "डिवाइस पर AI",
    settingsOnDeviceSummary:
      "निजी स्थानीय मॉडल, डिवाइस जाँच, डाउनलोड और परीक्षण।",
    onDeviceIntro:
      "भाषाएँ एक बार चुनें। फिर मिस्टर ब्रोकली केवल इसी फ़ोन पर चल सकने वाले स्थानीय सुनने, सोचने और बोलने के मॉडल दिखाएगा।",
    onDeviceLanguages: "बातचीत की भाषाएँ",
    onDeviceLanguagesHint:
      "हर स्थानीय मॉडल को चुनी हुई सभी भाषाओं का समर्थन करना होगा। यह चयन सुनने और बोले गए उत्तरों की भाषाएँ भी बदलता है।",
    onDeviceTestDevice: "इस डिवाइस को फिर जाँचें",
    onDeviceTestingDevice: "डिवाइस की जाँच हो रही है…",
    onDeviceDeviceReady: "डिवाइस जाँच पूरी हुई",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} RAM · ${storage} खाली`,
    onDeviceNoCompatibleModels:
      "चुनी हुई सभी भाषाओं और इस डिवाइस के लिए कोई उपयुक्त स्थानीय मॉडल नहीं है।",
    onDeviceThinkingModels: "स्थानीय उत्तर",
    onDeviceListeningModels: "स्थानीय वाक् पहचान",
    onDeviceSpeakingModels: "स्थानीय आवाज़ें",
    onDeviceUse: "उपयोग करें",
    onDeviceInUse: "उपयोग में",
    onDeviceViable: "परीक्षण सफल",
    onDeviceBelowTarget: "चलता है, लेकिन सुझाई गति से धीमा",
    onDeviceTestFailed: "परीक्षण विफल",
    onDeviceNotTested: "अभी परीक्षण नहीं हुआ",
    chooseOnDeviceSttModel:
      "सेटिंग्स में डिवाइस पर चलने वाला वाक् पहचान मॉडल चुनें।",
    chooseOnDeviceTtsModel: "सेटिंग्स में डिवाइस पर चलने वाला वाक् मॉडल चुनें।",
  }),
  es: define({
    settingsOnDevice: "IA en el dispositivo",
    settingsOnDeviceSummary:
      "Modelos locales privados, comprobación del dispositivo, descargas y pruebas.",
    onDeviceIntro:
      "Elige los idiomas una vez y Sr. Brócoli solo ofrecerá modelos locales de escucha, razonamiento y voz que funcionen en este teléfono.",
    onDeviceLanguages: "Idiomas de conversación",
    onDeviceLanguagesHint:
      "Cada modelo local debe admitir todos estos idiomas. La selección también actualiza los idiomas de reconocimiento y respuesta hablada.",
    onDeviceTestDevice: "Volver a probar el dispositivo",
    onDeviceTestingDevice: "Probando el dispositivo…",
    onDeviceDeviceReady: "Comprobación completada",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} RAM · ${storage} libres`,
    onDeviceNoCompatibleModels:
      "Ningún modelo local del catálogo verificado admite todos los idiomas elegidos y funciona en este dispositivo.",
    onDeviceThinkingModels: "Respuestas locales",
    onDeviceListeningModels: "Reconocimiento de voz local",
    onDeviceSpeakingModels: "Voces locales",
    onDeviceUse: "Usar",
    onDeviceInUse: "En uso",
    onDeviceViable: "Prueba superada",
    onDeviceBelowTarget: "Funciona, pero más lento de lo recomendado",
    onDeviceTestFailed: "Prueba fallida",
    onDeviceNotTested: "Aún sin probar",
    chooseOnDeviceSttModel:
      "Elige en Ajustes un modelo de reconocimiento de voz en el dispositivo.",
    chooseOnDeviceTtsModel:
      "Elige en Ajustes un modelo de voz en el dispositivo.",
  }),
  fr: define({
    settingsOnDevice: "IA sur l’appareil",
    settingsOnDeviceSummary:
      "Modèles locaux privés, contrôle de l’appareil, téléchargements et tests.",
    onDeviceIntro:
      "Choisissez les langues une fois. M. Brocoli ne proposera ensuite que les modèles locaux d’écoute, de réflexion et de voix adaptés à ce téléphone.",
    onDeviceLanguages: "Langues de conversation",
    onDeviceLanguagesHint:
      "Chaque modèle local doit prendre en charge toutes ces langues. Ce choix met aussi à jour les langues d’écoute et des réponses vocales.",
    onDeviceTestDevice: "Retester cet appareil",
    onDeviceTestingDevice: "Test de l’appareil…",
    onDeviceDeviceReady: "Contrôle de l’appareil terminé",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} RAM · ${storage} disponibles`,
    onDeviceNoCompatibleModels:
      "Aucun modèle local du catalogue vérifié ne prend en charge toutes les langues choisies sur cet appareil.",
    onDeviceThinkingModels: "Réponses locales",
    onDeviceListeningModels: "Reconnaissance vocale locale",
    onDeviceSpeakingModels: "Voix locales",
    onDeviceUse: "Utiliser",
    onDeviceInUse: "Utilisé",
    onDeviceViable: "Test réussi",
    onDeviceBelowTarget: "Fonctionne, mais plus lentement que recommandé",
    onDeviceTestFailed: "Échec du test",
    onDeviceNotTested: "Pas encore testé",
    chooseOnDeviceSttModel:
      "Choisissez dans les réglages un modèle de reconnaissance vocale sur l’appareil.",
    chooseOnDeviceTtsModel:
      "Choisissez dans les réglages un modèle vocal sur l’appareil.",
  }),
  it: define({
    settingsOnDevice: "IA sul dispositivo",
    settingsOnDeviceSummary:
      "Modelli locali privati, verifica del dispositivo, download e test.",
    onDeviceIntro:
      "Scegli le lingue una volta: Sig. Broccoli offrirà solo modelli locali di ascolto, ragionamento e voce adatti a questo telefono.",
    onDeviceLanguages: "Lingue della conversazione",
    onDeviceLanguagesHint:
      "Ogni modello locale deve supportare tutte le lingue selezionate. La scelta aggiorna anche le lingue di ascolto e risposta vocale.",
    onDeviceTestDevice: "Verifica di nuovo il dispositivo",
    onDeviceTestingDevice: "Verifica del dispositivo…",
    onDeviceDeviceReady: "Verifica del dispositivo completata",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} RAM · ${storage} liberi`,
    onDeviceNoCompatibleModels:
      "Nessun modello locale del catalogo verificato supporta tutte le lingue selezionate su questo dispositivo.",
    onDeviceThinkingModels: "Risposte locali",
    onDeviceListeningModels: "Riconoscimento vocale locale",
    onDeviceSpeakingModels: "Voci locali",
    onDeviceUse: "Usa",
    onDeviceInUse: "In uso",
    onDeviceViable: "Test superato",
    onDeviceBelowTarget: "Funziona, ma più lentamente del consigliato",
    onDeviceTestFailed: "Test non riuscito",
    onDeviceNotTested: "Non ancora testato",
    chooseOnDeviceSttModel:
      "Scegli nelle impostazioni un modello di riconoscimento vocale sul dispositivo.",
    chooseOnDeviceTtsModel:
      "Scegli nelle impostazioni un modello vocale sul dispositivo.",
  }),
  pt: define({
    settingsOnDevice: "IA no dispositivo",
    settingsOnDeviceSummary:
      "Modelos locais privados, verificação do dispositivo, transferências e testes.",
    onDeviceIntro:
      "Escolhe os idiomas uma vez. O Sr. Brócolo só mostrará modelos locais de escuta, raciocínio e voz adequados a este telemóvel.",
    onDeviceLanguages: "Idiomas da conversa",
    onDeviceLanguagesHint:
      "Cada modelo local tem de suportar todos os idiomas escolhidos. A seleção também atualiza os idiomas de escuta e resposta falada.",
    onDeviceTestDevice: "Testar novamente este dispositivo",
    onDeviceTestingDevice: "A testar o dispositivo…",
    onDeviceDeviceReady: "Verificação do dispositivo concluída",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} RAM · ${storage} livres`,
    onDeviceNoCompatibleModels:
      "Nenhum modelo local do catálogo verificado suporta todos os idiomas escolhidos neste dispositivo.",
    onDeviceThinkingModels: "Respostas locais",
    onDeviceListeningModels: "Reconhecimento de voz local",
    onDeviceSpeakingModels: "Vozes locais",
    onDeviceUse: "Usar",
    onDeviceInUse: "Em uso",
    onDeviceViable: "Teste aprovado",
    onDeviceBelowTarget: "Funciona, mas é mais lento do que o recomendado",
    onDeviceTestFailed: "Teste falhou",
    onDeviceNotTested: "Ainda não testado",
    chooseOnDeviceSttModel:
      "Escolhe nas definições um modelo de reconhecimento de voz no dispositivo.",
    chooseOnDeviceTtsModel:
      "Escolhe nas definições um modelo de voz no dispositivo.",
  }),
  ptBR: define({
    settingsOnDevice: "IA no dispositivo",
    settingsOnDeviceSummary:
      "Modelos locais privados, verificação do dispositivo, downloads e testes.",
    onDeviceIntro:
      "Escolha os idiomas uma vez. O Sr. Brócolis só mostrará modelos locais de escuta, raciocínio e voz adequados a este celular.",
    onDeviceLanguages: "Idiomas da conversa",
    onDeviceLanguagesHint:
      "Cada modelo local deve aceitar todos os idiomas escolhidos. A seleção também atualiza os idiomas de escuta e resposta falada.",
    onDeviceTestDevice: "Testar este dispositivo novamente",
    onDeviceTestingDevice: "Testando o dispositivo…",
    onDeviceDeviceReady: "Verificação do dispositivo concluída",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} RAM · ${storage} livres`,
    onDeviceNoCompatibleModels:
      "Nenhum modelo local do catálogo verificado aceita todos os idiomas escolhidos neste dispositivo.",
    onDeviceThinkingModels: "Respostas locais",
    onDeviceListeningModels: "Reconhecimento de voz local",
    onDeviceSpeakingModels: "Vozes locais",
    onDeviceUse: "Usar",
    onDeviceInUse: "Em uso",
    onDeviceViable: "Teste aprovado",
    onDeviceBelowTarget: "Funciona, mas é mais lento que o recomendado",
    onDeviceTestFailed: "Teste falhou",
    onDeviceNotTested: "Ainda não testado",
    chooseOnDeviceSttModel:
      "Escolha nas configurações um modelo de reconhecimento de voz no dispositivo.",
    chooseOnDeviceTtsModel:
      "Escolha nas configurações um modelo de voz no dispositivo.",
  }),
  ru: define({
    settingsOnDevice: "ИИ на устройстве",
    settingsOnDeviceSummary:
      "Приватные локальные модели, проверка устройства, загрузки и тесты.",
    onDeviceIntro:
      "Выберите языки один раз, и Мистер Брокколи предложит только подходящие этому телефону локальные модели для распознавания, ответов и озвучивания.",
    onDeviceLanguages: "Языки разговора",
    onDeviceLanguagesHint:
      "Каждая локальная модель должна поддерживать все выбранные языки. Выбор также обновляет языки распознавания и голосовых ответов.",
    onDeviceTestDevice: "Проверить устройство снова",
    onDeviceTestingDevice: "Проверка устройства…",
    onDeviceDeviceReady: "Проверка устройства завершена",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} ОЗУ · ${storage} свободно`,
    onDeviceNoCompatibleModels:
      "В проверенном каталоге нет локальной модели, которая поддерживает все выбранные языки и подходит этому устройству.",
    onDeviceThinkingModels: "Локальные ответы",
    onDeviceListeningModels: "Локальное распознавание речи",
    onDeviceSpeakingModels: "Локальные голоса",
    onDeviceUse: "Использовать",
    onDeviceInUse: "Используется",
    onDeviceViable: "Тест пройден",
    onDeviceBelowTarget: "Работает, но медленнее рекомендованного",
    onDeviceTestFailed: "Тест не пройден",
    onDeviceNotTested: "Ещё не проверено",
    chooseOnDeviceSttModel:
      "Выберите в настройках модель распознавания речи на устройстве.",
    chooseOnDeviceTtsModel:
      "Выберите в настройках модель озвучивания на устройстве.",
  }),
  "zh-CN": define({
    settingsOnDevice: "设备端 AI",
    settingsOnDeviceSummary: "私密本地模型、设备检测、下载与测试。",
    onDeviceIntro:
      "只需选择一次语言，西兰花先生就只会提供适合此手机的本地听写、推理和语音模型。",
    onDeviceLanguages: "对话语言",
    onDeviceLanguagesHint:
      "每个本地模型都必须支持所有所选语言。此选择也会更新听写和语音回复语言。",
    onDeviceTestDevice: "重新测试此设备",
    onDeviceTestingDevice: "正在测试设备…",
    onDeviceDeviceReady: "设备检测完成",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} 内存 · ${storage} 可用`,
    onDeviceNoCompatibleModels:
      "经审核的目录中没有同时支持所有所选语言且适合此设备的本地模型。",
    onDeviceThinkingModels: "本地回复",
    onDeviceListeningModels: "本地语音识别",
    onDeviceSpeakingModels: "本地语音",
    onDeviceUse: "使用",
    onDeviceInUse: "使用中",
    onDeviceViable: "测试通过",
    onDeviceBelowTarget: "可以运行，但速度低于建议值",
    onDeviceTestFailed: "测试失败",
    onDeviceNotTested: "尚未测试",
    chooseOnDeviceSttModel: "请在设置中选择设备端语音识别模型。",
    chooseOnDeviceTtsModel: "请在设置中选择设备端语音模型。",
  }),
  ar: define({
    settingsOnDevice: "ذكاء اصطناعي على الجهاز",
    settingsOnDeviceSummary:
      "نماذج محلية خاصة وفحص الجهاز والتنزيلات والاختبارات.",
    onDeviceIntro:
      "اختر اللغات مرة واحدة، وسيعرض السيد بروكلي فقط نماذج الاستماع والتفكير والصوت المحلية المناسبة لهذا الهاتف.",
    onDeviceLanguages: "لغات المحادثة",
    onDeviceLanguagesHint:
      "يجب أن يدعم كل نموذج محلي جميع اللغات المحددة. يحدّث هذا الاختيار أيضًا لغات الاستماع والردود المنطوقة.",
    onDeviceTestDevice: "اختبار هذا الجهاز مجددًا",
    onDeviceTestingDevice: "جارٍ اختبار الجهاز…",
    onDeviceDeviceReady: "اكتمل فحص الجهاز",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} ذاكرة · ${storage} متاحة`,
    onDeviceNoCompatibleModels:
      "لا يوجد نموذج محلي في الكتالوج المراجع يدعم كل اللغات المحددة ويناسب هذا الجهاز.",
    onDeviceThinkingModels: "ردود محلية",
    onDeviceListeningModels: "تعرّف محلي على الكلام",
    onDeviceSpeakingModels: "أصوات محلية",
    onDeviceUse: "استخدام",
    onDeviceInUse: "قيد الاستخدام",
    onDeviceViable: "نجح الاختبار",
    onDeviceBelowTarget: "يعمل، لكنه أبطأ من الموصى به",
    onDeviceTestFailed: "فشل الاختبار",
    onDeviceNotTested: "لم يُختبر بعد",
    chooseOnDeviceSttModel:
      "اختر نموذج تعرّف على الكلام يعمل على الجهاز من الإعدادات.",
    chooseOnDeviceTtsModel: "اختر نموذج كلام يعمل على الجهاز من الإعدادات.",
  }),
  ja: define({
    settingsOnDevice: "オンデバイス AI",
    settingsOnDeviceSummary:
      "プライベートなローカルモデル、端末チェック、ダウンロード、テスト。",
    onDeviceIntro:
      "言語を一度選ぶと、ミスター・ブロッコリーはこの端末に適したローカルの音声認識・推論・音声モデルだけを表示します。",
    onDeviceLanguages: "会話の言語",
    onDeviceLanguagesHint:
      "各ローカルモデルは選択したすべての言語に対応する必要があります。この選択は音声認識と読み上げの言語にも反映されます。",
    onDeviceTestDevice: "この端末を再テスト",
    onDeviceTestingDevice: "端末をテスト中…",
    onDeviceDeviceReady: "端末チェック完了",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} RAM・空き ${storage}`,
    onDeviceNoCompatibleModels:
      "選択したすべての言語に対応し、この端末で動作するローカルモデルは審査済みカタログにありません。",
    onDeviceThinkingModels: "ローカル応答",
    onDeviceListeningModels: "ローカル音声認識",
    onDeviceSpeakingModels: "ローカル音声",
    onDeviceUse: "使用",
    onDeviceInUse: "使用中",
    onDeviceViable: "テスト合格",
    onDeviceBelowTarget: "動作しますが、推奨速度を下回ります",
    onDeviceTestFailed: "テスト失敗",
    onDeviceNotTested: "未テスト",
    chooseOnDeviceSttModel:
      "設定でオンデバイス音声認識モデルを選択してください。",
    chooseOnDeviceTtsModel: "設定でオンデバイス音声モデルを選択してください。",
  }),
  hu: define({
    settingsOnDevice: "Eszközön futó MI",
    settingsOnDeviceSummary:
      "Privát helyi modellek, eszközellenőrzés, letöltések és tesztek.",
    onDeviceIntro:
      "Válaszd ki egyszer a nyelveket, és Brokkoli úr csak az ezen a telefonon futó helyi hallási, gondolkodási és beszédmodelleket kínálja fel.",
    onDeviceLanguages: "Beszélgetési nyelvek",
    onDeviceLanguagesHint:
      "Minden helyi modellnek támogatnia kell az összes kiválasztott nyelvet. Ez a felismerés és a felolvasás nyelveit is frissíti.",
    onDeviceTestDevice: "Eszköz újbóli tesztelése",
    onDeviceTestingDevice: "Eszköz tesztelése…",
    onDeviceDeviceReady: "Eszközellenőrzés kész",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} RAM · ${storage} szabad`,
    onDeviceNoCompatibleModels:
      "Az ellenőrzött katalógusban nincs minden kiválasztott nyelvet támogató, ezen az eszközön futó helyi modell.",
    onDeviceThinkingModels: "Helyi válaszok",
    onDeviceListeningModels: "Helyi beszédfelismerés",
    onDeviceSpeakingModels: "Helyi hangok",
    onDeviceUse: "Használat",
    onDeviceInUse: "Használatban",
    onDeviceViable: "Teszt sikeres",
    onDeviceBelowTarget: "Működik, de az ajánlottnál lassabb",
    onDeviceTestFailed: "Teszt sikertelen",
    onDeviceNotTested: "Még nincs tesztelve",
    chooseOnDeviceSttModel:
      "Válassz egy eszközön futó beszédfelismerési modellt a Beállításokban.",
    chooseOnDeviceTtsModel:
      "Válassz egy eszközön futó beszédmodellt a Beállításokban.",
  }),
  cs: define({
    settingsOnDevice: "AI v zařízení",
    settingsOnDeviceSummary:
      "Soukromé místní modely, kontrola zařízení, stahování a testy.",
    onDeviceIntro:
      "Vyberte jazyky jednou a Pan Brokolice nabídne jen místní modely poslechu, uvažování a hlasu vhodné pro tento telefon.",
    onDeviceLanguages: "Jazyky konverzace",
    onDeviceLanguagesHint:
      "Každý místní model musí podporovat všechny vybrané jazyky. Volba upraví také jazyky rozpoznávání a mluvených odpovědí.",
    onDeviceTestDevice: "Otestovat zařízení znovu",
    onDeviceTestingDevice: "Testování zařízení…",
    onDeviceDeviceReady: "Kontrola zařízení dokončena",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} RAM · ${storage} volné`,
    onDeviceNoCompatibleModels:
      "V prověřeném katalogu není místní model, který podporuje všechny vybrané jazyky a hodí se pro toto zařízení.",
    onDeviceThinkingModels: "Místní odpovědi",
    onDeviceListeningModels: "Místní rozpoznávání řeči",
    onDeviceSpeakingModels: "Místní hlasy",
    onDeviceUse: "Použít",
    onDeviceInUse: "Používá se",
    onDeviceViable: "Test úspěšný",
    onDeviceBelowTarget: "Funguje, ale pomaleji než doporučeno",
    onDeviceTestFailed: "Test selhal",
    onDeviceNotTested: "Zatím netestováno",
    chooseOnDeviceSttModel:
      "V nastavení vyberte model rozpoznávání řeči v zařízení.",
    chooseOnDeviceTtsModel: "V nastavení vyberte hlasový model v zařízení.",
  }),
  pl: define({
    settingsOnDevice: "AI na urządzeniu",
    settingsOnDeviceSummary:
      "Prywatne modele lokalne, kontrola urządzenia, pobieranie i testy.",
    onDeviceIntro:
      "Wybierz języki raz, a Pan Brokuł pokaże tylko lokalne modele słuchania, rozumowania i głosu odpowiednie dla tego telefonu.",
    onDeviceLanguages: "Języki rozmowy",
    onDeviceLanguagesHint:
      "Każdy model lokalny musi obsługiwać wszystkie wybrane języki. Wybór aktualizuje też języki rozpoznawania i odpowiedzi głosowych.",
    onDeviceTestDevice: "Przetestuj urządzenie ponownie",
    onDeviceTestingDevice: "Testowanie urządzenia…",
    onDeviceDeviceReady: "Kontrola urządzenia zakończona",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} RAM · ${storage} wolne`,
    onDeviceNoCompatibleModels:
      "W sprawdzonym katalogu nie ma lokalnego modelu obsługującego wszystkie wybrane języki i pasującego do tego urządzenia.",
    onDeviceThinkingModels: "Odpowiedzi lokalne",
    onDeviceListeningModels: "Lokalne rozpoznawanie mowy",
    onDeviceSpeakingModels: "Lokalne głosy",
    onDeviceUse: "Użyj",
    onDeviceInUse: "W użyciu",
    onDeviceViable: "Test zaliczony",
    onDeviceBelowTarget: "Działa, ale wolniej niż zalecane",
    onDeviceTestFailed: "Test nieudany",
    onDeviceNotTested: "Jeszcze nie testowano",
    chooseOnDeviceSttModel:
      "W Ustawieniach wybierz model rozpoznawania mowy na urządzeniu.",
    chooseOnDeviceTtsModel: "W Ustawieniach wybierz model mowy na urządzeniu.",
  }),
  tr: define({
    settingsOnDevice: "Cihaz içi yapay zekâ",
    settingsOnDeviceSummary:
      "Özel yerel modeller, cihaz kontrolü, indirmeler ve testler.",
    onDeviceIntro:
      "Dilleri bir kez seçin; Bay Brokoli yalnızca bu telefona uygun yerel dinleme, düşünme ve ses modellerini sunar.",
    onDeviceLanguages: "Konuşma dilleri",
    onDeviceLanguagesHint:
      "Her yerel model seçilen tüm dilleri desteklemelidir. Bu seçim dinleme ve sesli yanıt dillerini de günceller.",
    onDeviceTestDevice: "Bu cihazı yeniden test et",
    onDeviceTestingDevice: "Cihaz test ediliyor…",
    onDeviceDeviceReady: "Cihaz kontrolü tamamlandı",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} RAM · ${storage} boş`,
    onDeviceNoCompatibleModels:
      "İncelenmiş katalogda seçilen tüm dilleri destekleyen ve bu cihaza uygun yerel model yok.",
    onDeviceThinkingModels: "Yerel yanıtlar",
    onDeviceListeningModels: "Yerel konuşma tanıma",
    onDeviceSpeakingModels: "Yerel sesler",
    onDeviceUse: "Kullan",
    onDeviceInUse: "Kullanımda",
    onDeviceViable: "Test başarılı",
    onDeviceBelowTarget: "Çalışıyor, ancak önerilenden yavaş",
    onDeviceTestFailed: "Test başarısız",
    onDeviceNotTested: "Henüz test edilmedi",
    chooseOnDeviceSttModel:
      "Ayarlar’dan cihaz içi bir konuşma tanıma modeli seçin.",
    chooseOnDeviceTtsModel: "Ayarlar’dan cihaz içi bir konuşma modeli seçin.",
  }),
  sv: define({
    settingsOnDevice: "AI på enheten",
    settingsOnDeviceSummary:
      "Privata lokala modeller, enhetskontroll, hämtningar och tester.",
    onDeviceIntro:
      "Välj språk en gång. Herr Broccoli visar sedan bara lokala modeller för lyssning, resonemang och tal som passar den här telefonen.",
    onDeviceLanguages: "Samtalsspråk",
    onDeviceLanguagesHint:
      "Varje lokal modell måste stödja alla valda språk. Valet uppdaterar även språk för igenkänning och talade svar.",
    onDeviceTestDevice: "Testa enheten igen",
    onDeviceTestingDevice: "Testar enheten…",
    onDeviceDeviceReady: "Enhetskontrollen är klar",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} RAM · ${storage} ledigt`,
    onDeviceNoCompatibleModels:
      "Ingen lokal modell i den granskade katalogen stöder alla valda språk och passar den här enheten.",
    onDeviceThinkingModels: "Lokala svar",
    onDeviceListeningModels: "Lokal taligenkänning",
    onDeviceSpeakingModels: "Lokala röster",
    onDeviceUse: "Använd",
    onDeviceInUse: "Används",
    onDeviceViable: "Test godkänt",
    onDeviceBelowTarget: "Fungerar, men långsammare än rekommenderat",
    onDeviceTestFailed: "Testet misslyckades",
    onDeviceNotTested: "Inte testad än",
    chooseOnDeviceSttModel:
      "Välj en taligenkänningsmodell på enheten i Inställningar.",
    chooseOnDeviceTtsModel: "Välj en talmodell på enheten i Inställningar.",
  }),
  ur: define({
    settingsOnDevice: "ڈیوائس پر AI",
    settingsOnDeviceSummary: "نجی مقامی ماڈلز، ڈیوائس جانچ، ڈاؤن لوڈ اور ٹیسٹ۔",
    onDeviceIntro:
      "زبانیں ایک بار منتخب کریں، پھر مسٹر بروکلی صرف اسی فون کے لیے موزوں مقامی سننے، سوچنے اور بولنے کے ماڈلز دکھائے گا۔",
    onDeviceLanguages: "گفتگو کی زبانیں",
    onDeviceLanguagesHint:
      "ہر مقامی ماڈل کو منتخب تمام زبانوں کی معاونت کرنا ہوگی۔ یہ انتخاب سننے اور بولے گئے جواب کی زبانیں بھی بدلتا ہے۔",
    onDeviceTestDevice: "اس ڈیوائس کو دوبارہ جانچیں",
    onDeviceTestingDevice: "ڈیوائس کی جانچ جاری ہے…",
    onDeviceDeviceReady: "ڈیوائس کی جانچ مکمل",
    onDeviceDeviceSummary: ({ memory, storage }) =>
      `${memory} ریم · ${storage} خالی`,
    onDeviceNoCompatibleModels:
      "جائزہ شدہ فہرست میں کوئی مقامی ماڈل تمام منتخب زبانوں کی معاونت اور اس ڈیوائس پر چلنے کی صلاحیت نہیں رکھتا۔",
    onDeviceThinkingModels: "مقامی جوابات",
    onDeviceListeningModels: "مقامی آواز شناخت",
    onDeviceSpeakingModels: "مقامی آوازیں",
    onDeviceUse: "استعمال کریں",
    onDeviceInUse: "استعمال میں",
    onDeviceViable: "ٹیسٹ کامیاب",
    onDeviceBelowTarget: "چلتا ہے، مگر تجویز سے سست",
    onDeviceTestFailed: "ٹیسٹ ناکام",
    onDeviceNotTested: "ابھی جانچا نہیں گیا",
    chooseOnDeviceSttModel:
      "ترتیبات میں ڈیوائس پر چلنے والا تقریر شناخت ماڈل منتخب کریں۔",
    chooseOnDeviceTtsModel:
      "ترتیبات میں ڈیوائس پر چلنے والا تقریر ماڈل منتخب کریں۔",
  }),
} as const;
