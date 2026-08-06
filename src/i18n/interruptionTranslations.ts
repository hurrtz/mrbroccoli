const en = {
  interruptedReply: "Interrupted response",
  replyInterruptedNotice:
    "You spoke before this response finished. The generated portion was kept, and your next turn continues from here.",
};

type InterruptionTranslations = typeof en;
const define = (value: InterruptionTranslations) => value;

export const interruptionTranslations = {
  en,
  de: define({
    interruptedReply: "Unterbrochene Antwort",
    replyInterruptedNotice:
      "Du hast gesprochen, bevor diese Antwort fertig war. Der erzeugte Teil wurde behalten und dein nächster Beitrag knüpft hier an.",
  }),
  uk: define({
    interruptedReply: "Перервана відповідь",
    replyInterruptedNotice:
      "Ви заговорили до завершення цієї відповіді. Створену частину збережено, а наступна репліка продовжиться звідси.",
  }),
  hi: define({
    interruptedReply: "बाधित उत्तर",
    replyInterruptedNotice:
      "आपने उत्तर पूरा होने से पहले बोलना शुरू किया। तैयार हुआ हिस्सा रखा गया है और आपकी अगली बात यहीं से आगे बढ़ेगी।",
  }),
  es: define({
    interruptedReply: "Respuesta interrumpida",
    replyInterruptedNotice:
      "Hablaste antes de que terminara la respuesta. Se conservó la parte generada y tu siguiente turno continúa desde aquí.",
  }),
  fr: define({
    interruptedReply: "Réponse interrompue",
    replyInterruptedNotice:
      "Vous avez parlé avant la fin de cette réponse. La partie générée a été conservée et votre prochain tour continue ici.",
  }),
  it: define({
    interruptedReply: "Risposta interrotta",
    replyInterruptedNotice:
      "Hai iniziato a parlare prima che la risposta finisse. La parte generata è stata conservata e il prossimo turno continua da qui.",
  }),
  pt: define({
    interruptedReply: "Resposta interrompida",
    replyInterruptedNotice:
      "Começou a falar antes de a resposta terminar. A parte gerada foi mantida e a próxima intervenção continua a partir daqui.",
  }),
  ptBR: define({
    interruptedReply: "Resposta interrompida",
    replyInterruptedNotice:
      "Você começou a falar antes do fim da resposta. A parte gerada foi mantida e seu próximo turno continua daqui.",
  }),
  ru: define({
    interruptedReply: "Прерванный ответ",
    replyInterruptedNotice:
      "Вы начали говорить до завершения ответа. Созданная часть сохранена, а следующая реплика продолжится отсюда.",
  }),
  "zh-CN": define({
    interruptedReply: "已打断的回复",
    replyInterruptedNotice:
      "你在回复结束前开始说话。已生成的部分已保留，下一轮将从这里继续。",
  }),
  ar: define({
    interruptedReply: "رد تمت مقاطعته",
    replyInterruptedNotice:
      "بدأت التحدث قبل اكتمال الرد. تم الاحتفاظ بالجزء الذي تم إنشاؤه، وستتابع مداخلتك التالية من هنا.",
  }),
  ja: define({
    interruptedReply: "中断された応答",
    replyInterruptedNotice:
      "応答が終わる前に話し始めました。生成済みの部分は保存され、次の発言はここから続きます。",
  }),
  hu: define({
    interruptedReply: "Megszakított válasz",
    replyInterruptedNotice:
      "A válasz befejezése előtt beszélni kezdett. A létrehozott rész megmaradt, a következő megszólalás innen folytatódik.",
  }),
  cs: define({
    interruptedReply: "Přerušená odpověď",
    replyInterruptedNotice:
      "Začali jste mluvit před dokončením odpovědi. Vygenerovaná část zůstala zachována a další vstup pokračuje odsud.",
  }),
  pl: define({
    interruptedReply: "Przerwana odpowiedź",
    replyInterruptedNotice:
      "Zaczęto mówić przed zakończeniem odpowiedzi. Wygenerowana część została zachowana, a następna wypowiedź będzie kontynuowana od tego miejsca.",
  }),
  tr: define({
    interruptedReply: "Kesilen yanıt",
    replyInterruptedNotice:
      "Yanıt bitmeden konuşmaya başladınız. Oluşturulan bölüm korundu ve sonraki sözünüz buradan devam edecek.",
  }),
  sv: define({
    interruptedReply: "Avbrutet svar",
    replyInterruptedNotice:
      "Du började prata innan svaret var klart. Den genererade delen behölls och nästa tur fortsätter härifrån.",
  }),
  ur: define({
    interruptedReply: "روکا گیا جواب",
    replyInterruptedNotice:
      "آپ نے جواب مکمل ہونے سے پہلے بولنا شروع کیا۔ تیار شدہ حصہ محفوظ رکھا گیا ہے اور آپ کی اگلی بات یہیں سے جاری ہوگی۔",
  }),
} as const;
