const en = {
  speechInputUnavailableHint:
    "No speech recognition is set up yet, so type your message instead.",
  onDeviceSpeech: "On-device speech",
  localModelStorage: "Storage",
};

type LocalSpeechTranslations = typeof en;
const define = (value: LocalSpeechTranslations) => value;

export const localSpeechTranslations = {
  en,
  ar: define({
    speechInputUnavailableHint:
      "لم يتم إعداد التعرّف على الكلام بعد، لذا اكتب رسالتك بدلًا من ذلك.",
    onDeviceSpeech: "الكلام على الجهاز",
    localModelStorage: "التخزين",
  }),
  cs: define({
    speechInputUnavailableHint:
      "Rozpoznávání řeči zatím není nastavené, takže zprávu napiš.",
    onDeviceSpeech: "Řeč v zařízení",
    localModelStorage: "Úložiště",
  }),
  de: define({
    speechInputUnavailableHint:
      "Es ist noch keine Spracherkennung eingerichtet — tippe deine Nachricht stattdessen.",
    onDeviceSpeech: "Sprache auf dem Gerät",
    localModelStorage: "Speicherplatz",
  }),
  es: define({
    speechInputUnavailableHint:
      "Todavía no hay reconocimiento de voz configurado, así que escribe tu mensaje.",
    onDeviceSpeech: "Voz en el dispositivo",
    localModelStorage: "Almacenamiento",
  }),
  fr: define({
    speechInputUnavailableHint:
      "Aucune reconnaissance vocale n'est encore configurée, écris ton message à la place.",
    onDeviceSpeech: "Voix sur l’appareil",
    localModelStorage: "Stockage",
  }),
  hi: define({
    speechInputUnavailableHint:
      "अभी कोई वाक् पहचान सेट नहीं है, इसलिए अपना संदेश टाइप करें।",
    onDeviceSpeech: "डिवाइस पर वाणी",
    localModelStorage: "स्टोरेज",
  }),
  hu: define({
    speechInputUnavailableHint:
      "Még nincs beszédfelismerés beállítva, ezért gépeld be az üzenetet.",
    onDeviceSpeech: "Helyi beszéd",
    localModelStorage: "Tárhely",
  }),
  it: define({
    speechInputUnavailableHint:
      "Non è ancora configurato il riconoscimento vocale, quindi scrivi il messaggio.",
    onDeviceSpeech: "Voce sul dispositivo",
    localModelStorage: "Archiviazione",
  }),
  ja: define({
    speechInputUnavailableHint:
      "音声認識がまだ設定されていないので、メッセージを入力してください。",
    onDeviceSpeech: "オンデバイス音声",
    localModelStorage: "ストレージ",
  }),
  pl: define({
    speechInputUnavailableHint:
      "Rozpoznawanie mowy nie jest jeszcze skonfigurowane, więc napisz wiadomość.",
    onDeviceSpeech: "Mowa na urządzeniu",
    localModelStorage: "Miejsce",
  }),
  pt: define({
    speechInputUnavailableHint:
      "Ainda não há reconhecimento de voz configurado, por isso escreve a tua mensagem.",
    onDeviceSpeech: "Voz no dispositivo",
    localModelStorage: "Armazenamento",
  }),
  ptBR: define({
    speechInputUnavailableHint:
      "Ainda não há reconhecimento de voz configurado, então digite sua mensagem.",
    onDeviceSpeech: "Voz no dispositivo",
    localModelStorage: "Armazenamento",
  }),
  ru: define({
    speechInputUnavailableHint:
      "Распознавание речи ещё не настроено, поэтому напечатай сообщение.",
    onDeviceSpeech: "Речь на устройстве",
    localModelStorage: "Хранилище",
  }),
  sv: define({
    speechInputUnavailableHint:
      "Ingen taligenkänning är inställd än, så skriv ditt meddelande i stället.",
    onDeviceSpeech: "Tal på enheten",
    localModelStorage: "Lagring",
  }),
  tr: define({
    speechInputUnavailableHint:
      "Henüz konuşma tanıma ayarlanmadı, bu yüzden mesajını yaz.",
    onDeviceSpeech: "Cihaz içi konuşma",
    localModelStorage: "Depolama",
  }),
  uk: define({
    speechInputUnavailableHint:
      "Розпізнавання мовлення ще не налаштовано, тож надрукуй повідомлення.",
    onDeviceSpeech: "Мовлення на пристрої",
    localModelStorage: "Сховище",
  }),
  ur: define({
    speechInputUnavailableHint:
      "ابھی تقریر کی شناخت ترتیب نہیں دی گئی، اس لیے اپنا پیغام لکھیں۔",
    onDeviceSpeech: "ڈیوائس پر آواز",
    localModelStorage: "اسٹوریج",
  }),
  "zh-CN": define({
    speechInputUnavailableHint: "还没有设置语音识别，请改用打字。",
    onDeviceSpeech: "设备端语音",
    localModelStorage: "存储",
  }),
} as const;
