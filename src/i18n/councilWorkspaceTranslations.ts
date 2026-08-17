import type { TranslationParams } from "./types";

const en = {
  councilRounds: "Rounds",
  councilMinimumModels:
    "Council requires at least two models. Select one more model to turn it on.",
  councilCostSummary: ({ answers, models, rounds }: TranslationParams) =>
    `Every round asks every model. ${models} × ${rounds} = ${answers} answers, one after another — minutes, and each provider bills you.`,
  councilModelsDone: ({ completed, total }: TranslationParams) =>
    `${completed} of ${total} models done`,
  councilRoundProgress: ({ current, total }: TranslationParams) =>
    `Round ${current} of ${total}`,
  councilFailedProgress: ({ count }: TranslationParams) => `${count} failed`,
  councilSynthesizing: "Synthesizing final answer",
};

type CouncilWorkspaceTranslations = typeof en;
const define = (value: CouncilWorkspaceTranslations) => value;

export const councilWorkspaceTranslations = {
  en,
  de: define({
    councilRounds: "Runden",
    councilMinimumModels:
      "Der Council braucht mindestens zwei Modelle. Wähle noch ein Modell aus, um ihn einzuschalten.",
    councilCostSummary: ({ answers, models, rounds }) =>
      `In jeder Runde wird jedes Modell gefragt. ${models} × ${rounds} = ${answers} Antworten nacheinander — das dauert Minuten, und jeder Provider rechnet separat ab.`,
    councilModelsDone: ({ completed, total }) =>
      `${completed} von ${total} Modellen fertig`,
    councilRoundProgress: ({ current, total }) =>
      `Runde ${current} von ${total}`,
    councilFailedProgress: ({ count }) => `${count} fehlgeschlagen`,
    councilSynthesizing: "Endgültige Antwort wird erstellt",
  }),
  uk: define({
    councilRounds: "Раунди",
    councilMinimumModels:
      "Для Ради потрібно щонайменше дві моделі. Вибери ще одну модель, щоб увімкнути її.",
    councilCostSummary: ({ answers, models, rounds }) =>
      `У кожному раунді запитується кожна модель. ${models} × ${rounds} = ${answers} відповідей по черзі — це триватиме кілька хвилин, і кожен провайдер виставить рахунок.`,
    councilModelsDone: ({ completed, total }) =>
      `${completed} з ${total} моделей завершено`,
    councilRoundProgress: ({ current, total }) =>
      `Раунд ${current} з ${total}`,
    councilFailedProgress: ({ count }) => `${count} невдало`,
    councilSynthesizing: "Створення остаточної відповіді",
  }),
  hi: define({
    councilRounds: "दौर",
    councilMinimumModels:
      "परिषद के लिए कम से कम दो मॉडल चाहिए। इसे चालू करने के लिए एक और मॉडल चुनें।",
    councilCostSummary: ({ answers, models, rounds }) =>
      `हर दौर में हर मॉडल से पूछा जाता है। ${models} × ${rounds} = ${answers} जवाब, एक के बाद एक — इसमें कुछ मिनट लगेंगे और हर प्रदाता शुल्क लेगा।`,
    councilModelsDone: ({ completed, total }) =>
      `${total} में से ${completed} मॉडल पूरे`,
    councilRoundProgress: ({ current, total }) =>
      `${total} में से दौर ${current}`,
    councilFailedProgress: ({ count }) => `${count} विफल`,
    councilSynthesizing: "अंतिम जवाब तैयार हो रहा है",
  }),
  es: define({
    councilRounds: "Rondas",
    councilMinimumModels:
      "El Consejo necesita al menos dos modelos. Elige uno más para activarlo.",
    councilCostSummary: ({ answers, models, rounds }) =>
      `Cada ronda consulta a todos los modelos. ${models} × ${rounds} = ${answers} respuestas, una tras otra: tardará minutos y cada proveedor te cobrará.`,
    councilModelsDone: ({ completed, total }) =>
      `${completed} de ${total} modelos listos`,
    councilRoundProgress: ({ current, total }) =>
      `Ronda ${current} de ${total}`,
    councilFailedProgress: ({ count }) => `${count} fallidos`,
    councilSynthesizing: "Creando la respuesta final",
  }),
  fr: define({
    councilRounds: "Tours",
    councilMinimumModels:
      "Le Conseil nécessite au moins deux modèles. Choisis-en un autre pour l’activer.",
    councilCostSummary: ({ answers, models, rounds }) =>
      `Chaque tour interroge chaque modèle. ${models} × ${rounds} = ${answers} réponses, l’une après l’autre — plusieurs minutes, et chaque fournisseur te facture.`,
    councilModelsDone: ({ completed, total }) =>
      `${completed} modèles sur ${total} terminés`,
    councilRoundProgress: ({ current, total }) =>
      `Tour ${current} sur ${total}`,
    councilFailedProgress: ({ count }) => `${count} en échec`,
    councilSynthesizing: "Création de la réponse finale",
  }),
  it: define({
    councilRounds: "Round",
    councilMinimumModels:
      "Il Consiglio richiede almeno due modelli. Selezionane un altro per attivarlo.",
    councilCostSummary: ({ answers, models, rounds }) =>
      `Ogni round interroga ogni modello. ${models} × ${rounds} = ${answers} risposte, una dopo l’altra — servono minuti e ogni provider ti addebita il costo.`,
    councilModelsDone: ({ completed, total }) =>
      `${completed} modelli su ${total} completati`,
    councilRoundProgress: ({ current, total }) =>
      `Round ${current} di ${total}`,
    councilFailedProgress: ({ count }) => `${count} non riusciti`,
    councilSynthesizing: "Creazione della risposta finale",
  }),
  pt: define({
    councilRounds: "Rondas",
    councilMinimumModels:
      "O Conselho precisa de pelo menos dois modelos. Seleciona mais um para o ativar.",
    councilCostSummary: ({ answers, models, rounds }) =>
      `Cada ronda pergunta a cada modelo. ${models} × ${rounds} = ${answers} respostas, uma após outra — demora minutos e cada fornecedor cobra-te.`,
    councilModelsDone: ({ completed, total }) =>
      `${completed} de ${total} modelos concluídos`,
    councilRoundProgress: ({ current, total }) =>
      `Ronda ${current} de ${total}`,
    councilFailedProgress: ({ count }) => `${count} falharam`,
    councilSynthesizing: "A criar a resposta final",
  }),
  ptBR: define({
    councilRounds: "Rodadas",
    councilMinimumModels:
      "O Conselho precisa de pelo menos dois modelos. Selecione mais um para ativá-lo.",
    councilCostSummary: ({ answers, models, rounds }) =>
      `Cada rodada pergunta a cada modelo. ${models} × ${rounds} = ${answers} respostas, uma após outra — leva minutos e cada provedor cobra você.`,
    councilModelsDone: ({ completed, total }) =>
      `${completed} de ${total} modelos concluídos`,
    councilRoundProgress: ({ current, total }) =>
      `Rodada ${current} de ${total}`,
    councilFailedProgress: ({ count }) => `${count} falharam`,
    councilSynthesizing: "Criando a resposta final",
  }),
  ru: define({
    councilRounds: "Раунды",
    councilMinimumModels:
      "Для Совета нужны как минимум две модели. Выбери ещё одну модель, чтобы включить его.",
    councilCostSummary: ({ answers, models, rounds }) =>
      `В каждом раунде запрашивается каждая модель. ${models} × ${rounds} = ${answers} ответов по очереди — это займёт несколько минут, и каждый провайдер выставит счёт.`,
    councilModelsDone: ({ completed, total }) =>
      `${completed} из ${total} моделей завершено`,
    councilRoundProgress: ({ current, total }) =>
      `Раунд ${current} из ${total}`,
    councilFailedProgress: ({ count }) => `${count} неудачно`,
    councilSynthesizing: "Создание итогового ответа",
  }),
  "zh-CN": define({
    councilRounds: "轮数",
    councilMinimumModels:
      "评议会至少需要两个模型。请再选择一个模型以将其开启。",
    councilCostSummary: ({ answers, models, rounds }) =>
      `每轮都会询问每个模型。${models} × ${rounds} = ${answers} 个回答，依次进行——需要几分钟，每个提供商都会计费。`,
    councilModelsDone: ({ completed, total }) =>
      `${total} 个模型中已有 ${completed} 个完成`,
    councilRoundProgress: ({ current, total }) =>
      `第 ${current} 轮，共 ${total} 轮`,
    councilFailedProgress: ({ count }) => `${count} 个失败`,
    councilSynthesizing: "正在生成最终回答",
  }),
  ar: define({
    councilRounds: "الجولات",
    councilMinimumModels:
      "يتطلب المجلس نموذجين على الأقل. اختر نموذجًا آخر لتشغيله.",
    councilCostSummary: ({ answers, models, rounds }) =>
      `تسأل كل جولة كل نموذج. ${models} × ${rounds} = ${answers} إجابة بالتتابع — يستغرق ذلك دقائق، ويحاسبك كل مزود.`,
    councilModelsDone: ({ completed, total }) =>
      `اكتمل ${completed} من ${total} نماذج`,
    councilRoundProgress: ({ current, total }) =>
      `الجولة ${current} من ${total}`,
    councilFailedProgress: ({ count }) => `${count} فشلت`,
    councilSynthesizing: "جارٍ إنشاء الإجابة النهائية",
  }),
  ja: define({
    councilRounds: "ラウンド",
    councilMinimumModels:
      "評議会には少なくとも2つのモデルが必要です。有効にするには、もう1つ選択してください。",
    councilCostSummary: ({ answers, models, rounds }) =>
      `各ラウンドで全モデルに質問します。${models} × ${rounds} = ${answers} 件の回答を順番に処理します。数分かかり、各プロバイダーから請求されます。`,
    councilModelsDone: ({ completed, total }) =>
      `${total} モデル中 ${completed} 完了`,
    councilRoundProgress: ({ current, total }) =>
      `${total} ラウンド中 ${current}`,
    councilFailedProgress: ({ count }) => `${count} 件失敗`,
    councilSynthesizing: "最終回答を作成中",
  }),
  hu: define({
    councilRounds: "Körök",
    councilMinimumModels:
      "A Tanácshoz legalább két modell kell. A bekapcsolásához válassz még egyet.",
    councilCostSummary: ({ answers, models, rounds }) =>
      `Minden kör minden modellt megkérdez. ${models} × ${rounds} = ${answers} válasz egymás után — percekig tart, és minden szolgáltató számláz.`,
    councilModelsDone: ({ completed, total }) =>
      `${completed}/${total} modell kész`,
    councilRoundProgress: ({ current, total }) =>
      `${current}. kör / ${total}`,
    councilFailedProgress: ({ count }) => `${count} sikertelen`,
    councilSynthesizing: "A végső válasz összeállítása",
  }),
  cs: define({
    councilRounds: "Kola",
    councilMinimumModels:
      "Rada potřebuje alespoň dva modely. Vyber ještě jeden, aby se zapnula.",
    councilCostSummary: ({ answers, models, rounds }) =>
      `Každé kolo se zeptá každého modelu. ${models} × ${rounds} = ${answers} odpovědí za sebou — potrvá to několik minut a každý poskytovatel účtuje zvlášť.`,
    councilModelsDone: ({ completed, total }) =>
      `${completed} z ${total} modelů hotovo`,
    councilRoundProgress: ({ current, total }) =>
      `Kolo ${current} z ${total}`,
    councilFailedProgress: ({ count }) => `${count} selhalo`,
    councilSynthesizing: "Tvorba finální odpovědi",
  }),
  pl: define({
    councilRounds: "Rundy",
    councilMinimumModels:
      "Rada wymaga co najmniej dwóch modeli. Wybierz jeszcze jeden, aby ją włączyć.",
    councilCostSummary: ({ answers, models, rounds }) =>
      `Każda runda pyta każdy model. ${models} × ${rounds} = ${answers} odpowiedzi po kolei — potrwa to kilka minut, a każdy dostawca naliczy opłatę.`,
    councilModelsDone: ({ completed, total }) =>
      `${completed} z ${total} modeli gotowych`,
    councilRoundProgress: ({ current, total }) =>
      `Runda ${current} z ${total}`,
    councilFailedProgress: ({ count }) => `${count} nieudanych`,
    councilSynthesizing: "Tworzenie odpowiedzi końcowej",
  }),
  tr: define({
    councilRounds: "Turlar",
    councilMinimumModels:
      "Konsey için en az iki model gerekir. Açmak için bir model daha seç.",
    councilCostSummary: ({ answers, models, rounds }) =>
      `Her tur her modele sorar. ${models} × ${rounds} = ${answers} yanıt art arda — dakikalar sürer ve her sağlayıcı ücretlendirir.`,
    councilModelsDone: ({ completed, total }) =>
      `${total} modelden ${completed} tanesi tamamlandı`,
    councilRoundProgress: ({ current, total }) =>
      `${total} turdan ${current}. tur`,
    councilFailedProgress: ({ count }) => `${count} başarısız`,
    councilSynthesizing: "Son yanıt hazırlanıyor",
  }),
  sv: define({
    councilRounds: "Omgångar",
    councilMinimumModels:
      "Rådet kräver minst två modeller. Välj en modell till för att aktivera det.",
    councilCostSummary: ({ answers, models, rounds }) =>
      `Varje omgång frågar varje modell. ${models} × ${rounds} = ${answers} svar, ett efter ett — det tar minuter och varje leverantör debiterar dig.`,
    councilModelsDone: ({ completed, total }) =>
      `${completed} av ${total} modeller klara`,
    councilRoundProgress: ({ current, total }) =>
      `Omgång ${current} av ${total}`,
    councilFailedProgress: ({ count }) => `${count} misslyckades`,
    councilSynthesizing: "Skapar det slutliga svaret",
  }),
  ur: define({
    councilRounds: "ادوار",
    councilMinimumModels:
      "کونسل کے لیے کم از کم دو ماڈلز درکار ہیں۔ اسے فعال کرنے کے لیے ایک اور ماڈل منتخب کریں۔",
    councilCostSummary: ({ answers, models, rounds }) =>
      `ہر دور ہر ماڈل سے پوچھتا ہے۔ ${models} × ${rounds} = ${answers} جوابات یکے بعد دیگرے — اس میں چند منٹ لگیں گے اور ہر فراہم کنندہ چارج کرے گا`,
    councilModelsDone: ({ completed, total }) =>
      `${total} میں سے ${completed} ماڈلز مکمل`,
    councilRoundProgress: ({ current, total }) =>
      `${total} میں سے دور ${current}`,
    councilFailedProgress: ({ count }) => `${count} ناکام`,
    councilSynthesizing: "حتمی جواب تیار ہو رہا ہے",
  }),
} as const;
