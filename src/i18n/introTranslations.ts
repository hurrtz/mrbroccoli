// Copy for the first-run intro banner and its four-step sheet.
//
// The blocking setup wizards were removed, so this is what a new user meets
// instead: the real workspace, plus an offer to explain it. The wording sells
// outcomes rather than architecture -- someone who has never heard "STT" or
// "BYOK" has to be able to decide what to do next.
//
// The product name is written "Mr Broccoli" everywhere, never "Mr. Broccoli".
// The period creates an unwanted pause in spoken output, and step three is
// specifically about hearing the app speak.

import type { TranslationParams } from "./types";

const rawIntroTranslations = {
  en: {
    introBannerTitle: "New here?",
    introBannerBody: "See what Mr Broccoli does and pick how to power it.",
    introBannerAction: "Take a look",
    introBannerDismiss: "Dismiss introduction",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `Step ${step} of ${total}`,
    introWhatTitle: "Talk to the AI you choose",
    introWhatBody:
      "Speak naturally and hear a considered answer back. No account, and nothing is routed through a Mr Broccoli server — your conversations stay on this phone.",
    introHowTitle: "Three ways to power it",
    introHowProvider: "Your own provider key — frontier models, billed by them.",
    introHowLocal: "On-device models — private, offline, no usage cost.",
    introHowSystem: "Your phone's own voice — available right away.",
    introHearTitle: "Hear it for yourself",
    introHearBody:
      "A short example of the kind of answer this is built for.",
    introHearPlay: "Play example",
    introHearStop: "Stop",
    introHearTranscript: "Transcript",
    introHearDisclaimer:
      "Pre-recorded example. What you hear depends on the models and voices you choose.",
    introHearUnavailable:
      "No audio example for this language yet — the transcript is below.",
    introStartTitle: "How would you like to start?",
    introStartProvider: "Connect a provider",
    introStartProviderHint: "Paste an API key you already have.",
    introStartLocal: "Install on-device AI",
    introStartLocalHint: "One download, then it works offline.",
    introStartLater: "Look around first",
    introNext: "Next",
    introBack: "Back",
  },
  ar: {
    introBannerTitle: "هل أنت جديد هنا؟",
    introBannerBody: "اطّلع على ما يفعله Mr Broccoli واختر كيفية تشغيله.",
    introBannerAction: "ألقِ نظرة",
    introBannerDismiss: "إغلاق المقدمة",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `الخطوة ${step} من ${total}`,
    introWhatTitle: "تحدّث مع الذكاء الاصطناعي الذي تختاره",
    introWhatBody:
      "تحدّث بشكل طبيعي واستمع إلى إجابة مدروسة. بلا حساب، ولا يمر شيء عبر خادم لـ Mr Broccoli — تبقى محادثاتك على هذا الهاتف.",
    introHowTitle: "ثلاث طرق للتشغيل",
    introHowProvider: "مفتاح المزوّد الخاص بك — نماذج متقدمة، بفوترة منهم.",
    introHowLocal: "نماذج على الجهاز — خاصة، دون اتصال، وبلا تكلفة استخدام.",
    introHowSystem: "صوت هاتفك نفسه — متاح على الفور.",
    introHearTitle: "استمع بنفسك",
    introHearBody: "مثال قصير على نوع الإجابات التي صُمم لها هذا التطبيق.",
    introHearPlay: "تشغيل المثال",
    introHearStop: "إيقاف",
    introHearTranscript: "النص",
    introHearDisclaimer:
      "مثال مسجَّل مسبقًا. ما تسمعه يعتمد على النماذج والأصوات التي تختارها.",
    introHearUnavailable: "لا يوجد مثال صوتي بهذه اللغة بعد — النص أدناه.",
    introStartTitle: "كيف تريد أن تبدأ؟",
    introStartProvider: "اربط مزوّدًا",
    introStartProviderHint: "الصق مفتاح واجهة برمجة لديك بالفعل.",
    introStartLocal: "ثبّت الذكاء الاصطناعي على الجهاز",
    introStartLocalHint: "تنزيل واحد، ثم يعمل دون اتصال.",
    introStartLater: "تصفّح أولًا",
    introNext: "التالي",
    introBack: "رجوع",
  },
  cs: {
    introBannerTitle: "Jste tu nově?",
    introBannerBody: "Podívejte se, co Mr Broccoli umí, a vyberte pohon.",
    introBannerAction: "Podívat se",
    introBannerDismiss: "Zavřít úvod",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `Krok ${step} z ${total}`,
    introWhatTitle: "Mluvte s AI, kterou si vyberete",
    introWhatBody:
      "Mluvte přirozeně a poslechněte si promyšlenou odpověď. Bez účtu a nic neprochází serverem Mr Broccoli — konverzace zůstávají v tomto telefonu.",
    introHowTitle: "Tři způsoby pohonu",
    introHowProvider: "Vlastní klíč poskytovatele — špičkové modely, účtuje je on.",
    introHowLocal: "Modely v zařízení — soukromé, offline, bez nákladů za použití.",
    introHowSystem: "Hlas vašeho telefonu — dostupný hned.",
    introHearTitle: "Poslechněte si to",
    introHearBody: "Krátká ukázka odpovědi, pro kterou je aplikace stavěná.",
    introHearPlay: "Přehrát ukázku",
    introHearStop: "Zastavit",
    introHearTranscript: "Přepis",
    introHearDisclaimer:
      "Předem nahraná ukázka. To, co uslyšíte, závisí na zvolených modelech a hlasech.",
    introHearUnavailable: "Pro tento jazyk zatím ukázka není — přepis je níže.",
    introStartTitle: "Jak chcete začít?",
    introStartProvider: "Připojit poskytovatele",
    introStartProviderHint: "Vložte API klíč, který už máte.",
    introStartLocal: "Nainstalovat AI do zařízení",
    introStartLocalHint: "Jedno stažení a pak to funguje offline.",
    introStartLater: "Nejdřív se rozhlédnout",
    introNext: "Další",
    introBack: "Zpět",
  },
  de: {
    introBannerTitle: "Neu hier?",
    introBannerBody:
      "Sieh dir an, was Mr Broccoli kann, und wähle den Antrieb.",
    introBannerAction: "Ansehen",
    introBannerDismiss: "Einführung schließen",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `Schritt ${step} von ${total}`,
    introWhatTitle: "Sprich mit der KI deiner Wahl",
    introWhatBody:
      "Sprich natürlich und hör dir eine durchdachte Antwort an. Ohne Konto, und nichts läuft über einen Mr-Broccoli-Server — deine Gespräche bleiben auf diesem Telefon.",
    introHowTitle: "Drei Wege zum Antrieb",
    introHowProvider:
      "Dein eigener Anbieter-Schlüssel — Spitzenmodelle, von dort abgerechnet.",
    introHowLocal:
      "Modelle auf dem Gerät — privat, offline, ohne Nutzungskosten.",
    introHowSystem: "Die Stimme deines Telefons — sofort verfügbar.",
    introHearTitle: "Hör selbst",
    introHearBody:
      "Ein kurzes Beispiel für die Art von Antwort, für die das hier gebaut ist.",
    introHearPlay: "Beispiel abspielen",
    introHearStop: "Stopp",
    introHearTranscript: "Transkript",
    introHearDisclaimer:
      "Vorab aufgenommenes Beispiel. Was du hörst, hängt von den gewählten Modellen und Stimmen ab.",
    introHearUnavailable:
      "Für diese Sprache gibt es noch kein Hörbeispiel — das Transkript steht unten.",
    introStartTitle: "Wie möchtest du starten?",
    introStartProvider: "Anbieter verbinden",
    introStartProviderHint: "Füge einen API-Schlüssel ein, den du schon hast.",
    introStartLocal: "KI aufs Gerät laden",
    introStartLocalHint: "Ein Download, danach läuft es offline.",
    introStartLater: "Erst umsehen",
    introNext: "Weiter",
    introBack: "Zurück",
  },
  es: {
    introBannerTitle: "¿Es tu primera vez?",
    introBannerBody: "Mira qué hace Mr Broccoli y elige cómo alimentarlo.",
    introBannerAction: "Echar un vistazo",
    introBannerDismiss: "Cerrar la introducción",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `Paso ${step} de ${total}`,
    introWhatTitle: "Habla con la IA que elijas",
    introWhatBody:
      "Habla con naturalidad y escucha una respuesta meditada. Sin cuenta, y nada pasa por un servidor de Mr Broccoli: tus conversaciones se quedan en este teléfono.",
    introHowTitle: "Tres formas de alimentarlo",
    introHowProvider:
      "Tu propia clave de proveedor: modelos punteros, facturados por ellos.",
    introHowLocal:
      "Modelos en el dispositivo: privados, sin conexión y sin coste de uso.",
    introHowSystem: "La voz propia de tu teléfono: disponible al instante.",
    introHearTitle: "Escúchalo tú mismo",
    introHearBody:
      "Un ejemplo breve del tipo de respuesta para la que está hecho.",
    introHearPlay: "Reproducir ejemplo",
    introHearStop: "Detener",
    introHearTranscript: "Transcripción",
    introHearDisclaimer:
      "Ejemplo pregrabado. Lo que oigas depende de los modelos y las voces que elijas.",
    introHearUnavailable:
      "Todavía no hay ejemplo de audio en este idioma; la transcripción está abajo.",
    introStartTitle: "¿Cómo quieres empezar?",
    introStartProvider: "Conectar un proveedor",
    introStartProviderHint: "Pega una clave de API que ya tengas.",
    introStartLocal: "Instalar IA en el dispositivo",
    introStartLocalHint: "Una descarga y luego funciona sin conexión.",
    introStartLater: "Primero echar un ojo",
    introNext: "Siguiente",
    introBack: "Atrás",
  },
  fr: {
    introBannerTitle: "Vous débutez ?",
    introBannerBody:
      "Découvrez ce que fait Mr Broccoli et choisissez sa motorisation.",
    introBannerAction: "Jeter un œil",
    introBannerDismiss: "Fermer l'introduction",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `Étape ${step} sur ${total}`,
    introWhatTitle: "Parlez à l'IA de votre choix",
    introWhatBody:
      "Parlez naturellement et écoutez une réponse réfléchie. Sans compte, et rien ne transite par un serveur Mr Broccoli : vos conversations restent sur ce téléphone.",
    introHowTitle: "Trois façons de l'alimenter",
    introHowProvider:
      "Votre propre clé de fournisseur — modèles de pointe, facturés par lui.",
    introHowLocal:
      "Modèles sur l'appareil — privés, hors ligne, sans coût d'usage.",
    introHowSystem: "La voix de votre téléphone — disponible tout de suite.",
    introHearTitle: "Écoutez par vous-même",
    introHearBody:
      "Un court exemple du type de réponse pour lequel l'app est conçue.",
    introHearPlay: "Lire l'exemple",
    introHearStop: "Arrêter",
    introHearTranscript: "Transcription",
    introHearDisclaimer:
      "Exemple préenregistré. Ce que vous entendez dépend des modèles et des voix que vous choisissez.",
    introHearUnavailable:
      "Pas encore d'exemple audio dans cette langue — la transcription est ci-dessous.",
    introStartTitle: "Comment voulez-vous commencer ?",
    introStartProvider: "Connecter un fournisseur",
    introStartProviderHint: "Collez une clé d'API que vous avez déjà.",
    introStartLocal: "Installer l'IA sur l'appareil",
    introStartLocalHint: "Un téléchargement, puis ça marche hors ligne.",
    introStartLater: "Explorer d'abord",
    introNext: "Suivant",
    introBack: "Retour",
  },
  hi: {
    introBannerTitle: "यहाँ नए हैं?",
    introBannerBody:
      "देखें Mr Broccoli क्या करता है और चुनें कि इसे कैसे चलाना है।",
    introBannerAction: "एक नज़र डालें",
    introBannerDismiss: "परिचय बंद करें",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `चरण ${step} / ${total}`,
    introWhatTitle: "अपनी पसंद के AI से बात करें",
    introWhatBody:
      "स्वाभाविक रूप से बोलें और सोचा-समझा उत्तर सुनें। कोई खाता नहीं, और कुछ भी Mr Broccoli के सर्वर से होकर नहीं जाता — आपकी बातचीत इसी फ़ोन पर रहती है।",
    introHowTitle: "चलाने के तीन तरीके",
    introHowProvider:
      "आपकी अपनी प्रोवाइडर कुंजी — शीर्ष मॉडल, बिलिंग उन्हीं की।",
    introHowLocal:
      "डिवाइस पर मॉडल — निजी, ऑफ़लाइन, बिना उपयोग शुल्क।",
    introHowSystem: "आपके फ़ोन की अपनी आवाज़ — तुरंत उपलब्ध।",
    introHearTitle: "खुद सुनकर देखें",
    introHearBody: "जिस तरह के उत्तर के लिए यह बना है, उसका छोटा नमूना।",
    introHearPlay: "नमूना चलाएँ",
    introHearStop: "रोकें",
    introHearTranscript: "प्रतिलेख",
    introHearDisclaimer:
      "पहले से रिकॉर्ड किया गया नमूना। आप क्या सुनेंगे यह चुने गए मॉडल और आवाज़ों पर निर्भर करता है।",
    introHearUnavailable:
      "इस भाषा में अभी ऑडियो नमूना नहीं है — प्रतिलेख नीचे है।",
    introStartTitle: "आप कैसे शुरू करना चाहेंगे?",
    introStartProvider: "प्रोवाइडर जोड़ें",
    introStartProviderHint: "अपनी मौजूदा API कुंजी चिपकाएँ।",
    introStartLocal: "डिवाइस पर AI इंस्टॉल करें",
    introStartLocalHint: "एक डाउनलोड, फिर यह ऑफ़लाइन चलता है।",
    introStartLater: "पहले देख लें",
    introNext: "आगे",
    introBack: "पीछे",
  },
  hu: {
    introBannerTitle: "Most jársz itt először?",
    introBannerBody:
      "Nézd meg, mit tud a Mr Broccoli, és válaszd ki, mi hajtsa.",
    introBannerAction: "Megnézem",
    introBannerDismiss: "Bevezető bezárása",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `${step}. lépés a(z) ${total}-ból`,
    introWhatTitle: "Beszélj az általad választott MI-vel",
    introWhatBody:
      "Beszélj természetesen, és hallgass meg egy átgondolt választ. Fiók nélkül, és semmi nem megy át Mr Broccoli-kiszolgálón — a beszélgetéseid ezen a telefonon maradnak.",
    introHowTitle: "Három hajtás közül",
    introHowProvider:
      "Saját szolgáltatói kulcs — élvonalbeli modellek, náluk számlázva.",
    introHowLocal:
      "Eszközön futó modellek — privát, offline, használati díj nélkül.",
    introHowSystem: "A telefonod saját hangja — azonnal elérhető.",
    introHearTitle: "Hallgasd meg magad",
    introHearBody: "Rövid példa arra a válaszfajtára, amire ez készült.",
    introHearPlay: "Példa lejátszása",
    introHearStop: "Leállítás",
    introHearTranscript: "Átirat",
    introHearDisclaimer:
      "Előre felvett példa. Amit hallasz, a választott modellektől és hangoktól függ.",
    introHearUnavailable:
      "Ehhez a nyelvhez még nincs hangpélda — az átirat lent olvasható.",
    introStartTitle: "Hogyan kezdenéd?",
    introStartProvider: "Szolgáltató csatlakoztatása",
    introStartProviderHint: "Illeszd be a már meglévő API-kulcsodat.",
    introStartLocal: "MI telepítése az eszközre",
    introStartLocalHint: "Egy letöltés, utána offline is működik.",
    introStartLater: "Előbb körülnézek",
    introNext: "Tovább",
    introBack: "Vissza",
  },
  it: {
    introBannerTitle: "Sei nuovo qui?",
    introBannerBody: "Guarda cosa fa Mr Broccoli e scegli come alimentarlo.",
    introBannerAction: "Dai un'occhiata",
    introBannerDismiss: "Chiudi l'introduzione",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `Passo ${step} di ${total}`,
    introWhatTitle: "Parla con l'IA che scegli tu",
    introWhatBody:
      "Parla in modo naturale e ascolta una risposta ragionata. Nessun account, e nulla passa da un server Mr Broccoli: le tue conversazioni restano su questo telefono.",
    introHowTitle: "Tre modi per alimentarlo",
    introHowProvider:
      "La tua chiave del provider — modelli di punta, fatturati da loro.",
    introHowLocal:
      "Modelli sul dispositivo — privati, offline, senza costi d'uso.",
    introHowSystem: "La voce del tuo telefono — disponibile subito.",
    introHearTitle: "Ascolta di persona",
    introHearBody:
      "Un breve esempio del tipo di risposta per cui è stata pensata.",
    introHearPlay: "Riproduci esempio",
    introHearStop: "Ferma",
    introHearTranscript: "Trascrizione",
    introHearDisclaimer:
      "Esempio preregistrato. Ciò che senti dipende dai modelli e dalle voci che scegli.",
    introHearUnavailable:
      "Non c'è ancora un esempio audio in questa lingua: la trascrizione è qui sotto.",
    introStartTitle: "Come vuoi iniziare?",
    introStartProvider: "Collega un provider",
    introStartProviderHint: "Incolla una chiave API che hai già.",
    introStartLocal: "Installa l'IA sul dispositivo",
    introStartLocalHint: "Un download, poi funziona offline.",
    introStartLater: "Prima do un'occhiata",
    introNext: "Avanti",
    introBack: "Indietro",
  },
  ja: {
    introBannerTitle: "はじめてですか？",
    introBannerBody: "Mr Broccoli でできることを見て、動かし方を選びましょう。",
    introBannerAction: "見てみる",
    introBannerDismiss: "紹介を閉じる",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `ステップ ${step} / ${total}`,
    introWhatTitle: "選んだ AI と話す",
    introWhatBody:
      "自然に話しかけると、考え抜かれた答えが返ってきます。アカウントは不要で、Mr Broccoli のサーバーを経由するものは何もありません。会話はこの端末に残ります。",
    introHowTitle: "動かし方は 3 通り",
    introHowProvider:
      "自分のプロバイダーキー — 最前線のモデル、料金は各社から。",
    introHowLocal: "端末内のモデル — プライベート、オフライン、利用料なし。",
    introHowSystem: "端末そのものの音声 — すぐに使えます。",
    introHearTitle: "実際に聴いてみる",
    introHearBody: "このアプリが目指す答え方の短い例です。",
    introHearPlay: "例を再生",
    introHearStop: "停止",
    introHearTranscript: "書き起こし",
    introHearDisclaimer:
      "録音済みの例です。実際に聞こえる音は、選んだモデルと音声によって変わります。",
    introHearUnavailable:
      "この言語の音声例はまだありません。書き起こしは下にあります。",
    introStartTitle: "どこから始めますか？",
    introStartProvider: "プロバイダーを接続",
    introStartProviderHint: "すでにお持ちの API キーを貼り付けます。",
    introStartLocal: "端末に AI を導入",
    introStartLocalHint: "一度ダウンロードすれば、あとはオフラインで動きます。",
    introStartLater: "まず見てまわる",
    introNext: "次へ",
    introBack: "戻る",
  },
  pl: {
    introBannerTitle: "Pierwszy raz tutaj?",
    introBannerBody: "Zobacz, co potrafi Mr Broccoli, i wybierz napęd.",
    introBannerAction: "Rzuć okiem",
    introBannerDismiss: "Zamknij wprowadzenie",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `Krok ${step} z ${total}`,
    introWhatTitle: "Rozmawiaj z wybraną przez siebie SI",
    introWhatBody:
      "Mów naturalnie i słuchaj przemyślanej odpowiedzi. Bez konta i bez przechodzenia przez serwer Mr Broccoli — rozmowy zostają na tym telefonie.",
    introHowTitle: "Trzy sposoby zasilania",
    introHowProvider:
      "Własny klucz dostawcy — czołowe modele, rozliczane u niego.",
    introHowLocal:
      "Modele na urządzeniu — prywatne, offline, bez kosztów użycia.",
    introHowSystem: "Własny głos telefonu — dostępny od razu.",
    introHearTitle: "Posłuchaj sam",
    introHearBody: "Krótki przykład odpowiedzi, do jakich to zbudowano.",
    introHearPlay: "Odtwórz przykład",
    introHearStop: "Zatrzymaj",
    introHearTranscript: "Transkrypcja",
    introHearDisclaimer:
      "Przykład nagrany wcześniej. To, co usłyszysz, zależy od wybranych modeli i głosów.",
    introHearUnavailable:
      "Nie ma jeszcze przykładu audio w tym języku — transkrypcja poniżej.",
    introStartTitle: "Jak chcesz zacząć?",
    introStartProvider: "Podłącz dostawcę",
    introStartProviderHint: "Wklej klucz API, który już masz.",
    introStartLocal: "Zainstaluj SI na urządzeniu",
    introStartLocalHint: "Jedno pobranie i działa offline.",
    introStartLater: "Najpierw się rozejrzę",
    introNext: "Dalej",
    introBack: "Wstecz",
  },
  pt: {
    introBannerTitle: "É a primeira vez aqui?",
    introBannerBody: "Veja o que o Mr Broccoli faz e escolha como alimentá-lo.",
    introBannerAction: "Dar uma vista de olhos",
    introBannerDismiss: "Fechar a introdução",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `Passo ${step} de ${total}`,
    introWhatTitle: "Fale com a IA que escolher",
    introWhatBody:
      "Fale naturalmente e ouça uma resposta ponderada. Sem conta e sem passar por um servidor do Mr Broccoli — as suas conversas ficam neste telemóvel.",
    introHowTitle: "Três formas de o alimentar",
    introHowProvider:
      "A sua própria chave de fornecedor — modelos de topo, faturados por ele.",
    introHowLocal:
      "Modelos no dispositivo — privados, offline, sem custo de utilização.",
    introHowSystem: "A voz do próprio telemóvel — disponível de imediato.",
    introHearTitle: "Ouça por si",
    introHearBody: "Um exemplo curto do tipo de resposta para que foi feito.",
    introHearPlay: "Reproduzir exemplo",
    introHearStop: "Parar",
    introHearTranscript: "Transcrição",
    introHearDisclaimer:
      "Exemplo pré-gravado. O que ouvir depende dos modelos e das vozes que escolher.",
    introHearUnavailable:
      "Ainda não há exemplo de áudio neste idioma — a transcrição está abaixo.",
    introStartTitle: "Como quer começar?",
    introStartProvider: "Ligar um fornecedor",
    introStartProviderHint: "Cole uma chave de API que já tenha.",
    introStartLocal: "Instalar IA no dispositivo",
    introStartLocalHint: "Uma transferência e depois funciona offline.",
    introStartLater: "Ver primeiro",
    introNext: "Seguinte",
    introBack: "Voltar",
  },
  ptBR: {
    introBannerTitle: "É novo por aqui?",
    introBannerBody: "Veja o que o Mr Broccoli faz e escolha como alimentá-lo.",
    introBannerAction: "Dar uma olhada",
    introBannerDismiss: "Fechar a introdução",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `Etapa ${step} de ${total}`,
    introWhatTitle: "Converse com a IA que você escolher",
    introWhatBody:
      "Fale naturalmente e ouça uma resposta bem pensada. Sem conta e sem passar por um servidor do Mr Broccoli — suas conversas ficam neste celular.",
    introHowTitle: "Três formas de alimentar",
    introHowProvider:
      "Sua própria chave de provedor — modelos de ponta, cobrados por ele.",
    introHowLocal:
      "Modelos no aparelho — privados, offline, sem custo de uso.",
    introHowSystem: "A voz do próprio celular — disponível na hora.",
    introHearTitle: "Ouça você mesmo",
    introHearBody: "Um exemplo curto do tipo de resposta para o qual foi feito.",
    introHearPlay: "Tocar exemplo",
    introHearStop: "Parar",
    introHearTranscript: "Transcrição",
    introHearDisclaimer:
      "Exemplo pré-gravado. O que você ouve depende dos modelos e vozes escolhidos.",
    introHearUnavailable:
      "Ainda não há exemplo de áudio neste idioma — a transcrição está abaixo.",
    introStartTitle: "Como você quer começar?",
    introStartProvider: "Conectar um provedor",
    introStartProviderHint: "Cole uma chave de API que você já tem.",
    introStartLocal: "Instalar IA no aparelho",
    introStartLocalHint: "Um download e depois funciona offline.",
    introStartLater: "Primeiro dar uma olhada",
    introNext: "Avançar",
    introBack: "Voltar",
  },
  ru: {
    introBannerTitle: "Впервые здесь?",
    introBannerBody:
      "Посмотрите, что умеет Mr Broccoli, и выберите, на чём его запустить.",
    introBannerAction: "Посмотреть",
    introBannerDismiss: "Закрыть знакомство",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `Шаг ${step} из ${total}`,
    introWhatTitle: "Говорите с ИИ, который выбрали вы",
    introWhatBody:
      "Говорите естественно и слушайте продуманный ответ. Без аккаунта, и ничего не проходит через сервер Mr Broccoli — разговоры остаются на этом телефоне.",
    introHowTitle: "Три способа запуска",
    introHowProvider:
      "Собственный ключ провайдера — передовые модели, счёт выставляет он.",
    introHowLocal:
      "Модели на устройстве — приватно, офлайн, без платы за использование.",
    introHowSystem: "Собственный голос телефона — доступен сразу.",
    introHearTitle: "Послушайте сами",
    introHearBody: "Короткий пример ответа, ради которого это сделано.",
    introHearPlay: "Воспроизвести пример",
    introHearStop: "Стоп",
    introHearTranscript: "Расшифровка",
    introHearDisclaimer:
      "Заранее записанный пример. То, что вы услышите, зависит от выбранных моделей и голосов.",
    introHearUnavailable:
      "Звукового примера на этом языке пока нет — расшифровка ниже.",
    introStartTitle: "С чего начнём?",
    introStartProvider: "Подключить провайдера",
    introStartProviderHint: "Вставьте API-ключ, который у вас уже есть.",
    introStartLocal: "Установить ИИ на устройство",
    introStartLocalHint: "Одна загрузка — дальше работает офлайн.",
    introStartLater: "Сначала осмотреться",
    introNext: "Далее",
    introBack: "Назад",
  },
  sv: {
    introBannerTitle: "Ny här?",
    introBannerBody: "Se vad Mr Broccoli gör och välj vad som ska driva den.",
    introBannerAction: "Ta en titt",
    introBannerDismiss: "Stäng introduktionen",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `Steg ${step} av ${total}`,
    introWhatTitle: "Prata med den AI du väljer",
    introWhatBody:
      "Prata naturligt och lyssna på ett genomtänkt svar. Inget konto, och inget går via någon Mr Broccoli-server — dina samtal stannar i den här telefonen.",
    introHowTitle: "Tre sätt att driva den",
    introHowProvider:
      "Din egen leverantörsnyckel — toppmodeller, fakturerade av dem.",
    introHowLocal:
      "Modeller på enheten — privata, offline, utan användningskostnad.",
    introHowSystem: "Telefonens egen röst — tillgänglig direkt.",
    introHearTitle: "Hör själv",
    introHearBody: "Ett kort exempel på den sortens svar det här är byggt för.",
    introHearPlay: "Spela upp exempel",
    introHearStop: "Stoppa",
    introHearTranscript: "Transkription",
    introHearDisclaimer:
      "Förinspelat exempel. Vad du hör beror på vilka modeller och röster du väljer.",
    introHearUnavailable:
      "Inget ljudexempel på det här språket ännu — transkriptionen finns nedan.",
    introStartTitle: "Hur vill du börja?",
    introStartProvider: "Anslut en leverantör",
    introStartProviderHint: "Klistra in en API-nyckel du redan har.",
    introStartLocal: "Installera AI på enheten",
    introStartLocalHint: "En nedladdning, sedan fungerar det offline.",
    introStartLater: "Titta runt först",
    introNext: "Nästa",
    introBack: "Tillbaka",
  },
  tr: {
    introBannerTitle: "Burada yeni misiniz?",
    introBannerBody:
      "Mr Broccoli'nin ne yaptığını görün ve nasıl çalışacağını seçin.",
    introBannerAction: "Bir bakın",
    introBannerDismiss: "Tanıtımı kapat",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `Adım ${step} / ${total}`,
    introWhatTitle: "Seçtiğiniz yapay zekâyla konuşun",
    introWhatBody:
      "Doğal biçimde konuşun ve düşünülmüş bir yanıt dinleyin. Hesap yok ve hiçbir şey bir Mr Broccoli sunucusundan geçmiyor — konuşmalarınız bu telefonda kalıyor.",
    introHowTitle: "Çalıştırmanın üç yolu",
    introHowProvider:
      "Kendi sağlayıcı anahtarınız — en ileri modeller, faturası onlardan.",
    introHowLocal:
      "Cihazdaki modeller — özel, çevrimdışı, kullanım ücreti yok.",
    introHowSystem: "Telefonunuzun kendi sesi — hemen kullanılabilir.",
    introHearTitle: "Kendiniz dinleyin",
    introHearBody: "Bunun için tasarlandığı yanıt türünden kısa bir örnek.",
    introHearPlay: "Örneği oynat",
    introHearStop: "Durdur",
    introHearTranscript: "Metin",
    introHearDisclaimer:
      "Önceden kaydedilmiş örnek. Duyduğunuz şey seçtiğiniz modellere ve seslere bağlıdır.",
    introHearUnavailable:
      "Bu dilde henüz ses örneği yok — metin aşağıda.",
    introStartTitle: "Nasıl başlamak istersiniz?",
    introStartProvider: "Bir sağlayıcı bağlayın",
    introStartProviderHint: "Halihazırda sahip olduğunuz API anahtarını yapıştırın.",
    introStartLocal: "Cihaza yapay zekâ kurun",
    introStartLocalHint: "Tek indirme, sonrası çevrimdışı çalışır.",
    introStartLater: "Önce etrafa bakayım",
    introNext: "İleri",
    introBack: "Geri",
  },
  uk: {
    introBannerTitle: "Ви тут уперше?",
    introBannerBody:
      "Подивіться, що вміє Mr Broccoli, і оберіть, на чому його запустити.",
    introBannerAction: "Поглянути",
    introBannerDismiss: "Закрити знайомство",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `Крок ${step} з ${total}`,
    introWhatTitle: "Говоріть зі штучним інтелектом, який обрали ви",
    introWhatBody:
      "Говоріть природно й слухайте продуману відповідь. Без облікового запису, і ніщо не проходить через сервер Mr Broccoli — розмови залишаються на цьому телефоні.",
    introHowTitle: "Три способи запуску",
    introHowProvider:
      "Власний ключ провайдера — передові моделі, рахунок виставляє він.",
    introHowLocal:
      "Моделі на пристрої — приватно, офлайн, без плати за використання.",
    introHowSystem: "Власний голос телефона — доступний одразу.",
    introHearTitle: "Послухайте самі",
    introHearBody: "Короткий приклад відповіді, заради якої це створено.",
    introHearPlay: "Відтворити приклад",
    introHearStop: "Зупинити",
    introHearTranscript: "Розшифровка",
    introHearDisclaimer:
      "Заздалегідь записаний приклад. Те, що ви почуєте, залежить від обраних моделей і голосів.",
    introHearUnavailable:
      "Звукового прикладу цією мовою ще немає — розшифровка нижче.",
    introStartTitle: "З чого почнемо?",
    introStartProvider: "Підключити провайдера",
    introStartProviderHint: "Вставте API-ключ, який у вас уже є.",
    introStartLocal: "Встановити ШІ на пристрій",
    introStartLocalHint: "Одне завантаження — далі працює офлайн.",
    introStartLater: "Спершу роздивитися",
    introNext: "Далі",
    introBack: "Назад",
  },
  ur: {
    introBannerTitle: "یہاں نئے ہیں؟",
    introBannerBody:
      "دیکھیں Mr Broccoli کیا کرتا ہے اور منتخب کریں کہ اسے کیسے چلانا ہے۔",
    introBannerAction: "ایک نظر ڈالیں",
    introBannerDismiss: "تعارف بند کریں",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `مرحلہ ${step} از ${total}`,
    introWhatTitle: "اپنی پسند کے AI سے بات کریں",
    introWhatBody:
      "قدرتی انداز میں بولیں اور سوچا سمجھا جواب سنیں۔ کوئی اکاؤنٹ نہیں، اور کچھ بھی Mr Broccoli کے سرور سے ہو کر نہیں گزرتا — آپ کی گفتگو اسی فون پر رہتی ہے۔",
    introHowTitle: "چلانے کے تین طریقے",
    introHowProvider:
      "آپ کی اپنی پرووائیڈر کلید — بہترین ماڈل، بلنگ انہی کی۔",
    introHowLocal:
      "ڈیوائس پر ماڈل — نجی، آف لائن، بغیر استعمال کے خرچ کے۔",
    introHowSystem: "آپ کے فون کی اپنی آواز — فوراً دستیاب۔",
    introHearTitle: "خود سن کر دیکھیں",
    introHearBody: "جس قسم کے جواب کے لیے یہ بنایا گیا، اس کا مختصر نمونہ۔",
    introHearPlay: "نمونہ چلائیں",
    introHearStop: "روکیں",
    introHearTranscript: "متن",
    introHearDisclaimer:
      "پہلے سے ریکارڈ شدہ نمونہ۔ آپ کیا سنیں گے اس کا انحصار منتخب ماڈلز اور آوازوں پر ہے۔",
    introHearUnavailable:
      "اس زبان میں ابھی آڈیو نمونہ نہیں — متن نیچے ہے۔",
    introStartTitle: "آپ کیسے شروع کرنا چاہیں گے؟",
    introStartProvider: "پرووائیڈر جوڑیں",
    introStartProviderHint: "اپنی موجودہ API کلید چسپاں کریں۔",
    introStartLocal: "ڈیوائس پر AI انسٹال کریں",
    introStartLocalHint: "ایک ڈاؤن لوڈ، پھر یہ آف لائن چلتا ہے۔",
    introStartLater: "پہلے دیکھ لیں",
    introNext: "آگے",
    introBack: "پیچھے",
  },
  "zh-CN": {
    introBannerTitle: "第一次来？",
    introBannerBody: "看看 Mr Broccoli 能做什么，并选择用什么来驱动它。",
    introBannerAction: "看一看",
    introBannerDismiss: "关闭介绍",
    introStepOfTotal: ({ step, total }: TranslationParams) =>
      `第 ${step} 步，共 ${total} 步`,
    introWhatTitle: "与你选择的 AI 对话",
    introWhatBody:
      "自然地说话，听到一个经过思考的回答。无需账号，也不经过任何 Mr Broccoli 的服务器——你的对话留在这台手机上。",
    introHowTitle: "三种驱动方式",
    introHowProvider: "你自己的服务商密钥——前沿模型，由他们计费。",
    introHowLocal: "设备端模型——私密、离线、无使用费用。",
    introHowSystem: "手机自带的语音——立即可用。",
    introHearTitle: "亲耳听一听",
    introHearBody: "一个简短的示例，展示这款应用想要的回答方式。",
    introHearPlay: "播放示例",
    introHearStop: "停止",
    introHearTranscript: "文字稿",
    introHearDisclaimer:
      "预先录制的示例。实际听到的效果取决于你选择的模型和语音。",
    introHearUnavailable: "该语言暂时没有语音示例——文字稿见下方。",
    introStartTitle: "你想从哪里开始？",
    introStartProvider: "连接服务商",
    introStartProviderHint: "粘贴你已有的 API 密钥。",
    introStartLocal: "在设备上安装 AI",
    introStartLocalHint: "下载一次，之后即可离线使用。",
    introStartLater: "先看看",
    introNext: "下一步",
    introBack: "上一步",
  },
} as const;

export const introTranslations = rawIntroTranslations;
