const en = {
  correctTranscript: "Correct transcript",
  correctTranscriptTitle: "Correct transcript",
  correctTranscriptHint:
    "This updates saved history, search, archive, and future context. Replies that were already generated are not changed.",
  transcriptEdited: "Edited",
  branchFromHere: "Branch from here",
  branchReady: "New branch ready. Continue with your next message.",
  branchStartsHere: "Branch starts here",
  branchSourceUnavailable: "Original branch unavailable",
  branchCount: ({ count }: { count?: string | number }) =>
    Number(count) === 1 ? "1 branch" : `${count} branches`,
  branchesFromMessage: "Branches from this message",
};

type TranscriptEditTranslations = typeof en;
const define = (value: TranscriptEditTranslations) => value;

export const transcriptEditTranslations = {
  en,
  de: define({
    correctTranscript: "Transkript korrigieren",
    correctTranscriptTitle: "Transkript korrigieren",
    correctTranscriptHint:
      "Dies aktualisiert den gespeicherten Verlauf, die Suche, das Archiv und den künftigen Kontext. Bereits erzeugte Antworten werden nicht geändert.",
    transcriptEdited: "Bearbeitet",
    branchFromHere: "Ab hier verzweigen",
    branchReady: "Neuer Zweig bereit. Fahre mit deiner nächsten Nachricht fort.",
    branchStartsHere: "Zweig beginnt hier",
    branchSourceUnavailable: "Ursprünglicher Zweig nicht verfügbar",
    branchCount: ({ count }) =>
      Number(count) === 1 ? "1 Zweig" : `${count} Zweige`,
    branchesFromMessage: "Zweige ab dieser Nachricht",
  }),
  uk: define({
    correctTranscript: "Виправити транскрипт",
    correctTranscriptTitle: "Виправити транскрипт",
    correctTranscriptHint:
      "Це оновить збережену історію, пошук, архів і майбутній контекст. Уже створені відповіді не зміняться.",
    transcriptEdited: "Змінено",
    branchFromHere: "Відгалузити звідси",
    branchReady: "Нова гілка готова. Продовжуйте наступним повідомленням.",
    branchStartsHere: "Гілка починається тут",
    branchSourceUnavailable: "Початкова гілка недоступна",
    branchCount: ({ count }) =>
      Number(count) === 1 ? "1 гілка" : `${count} гілок`,
    branchesFromMessage: "Гілки від цього повідомлення",
  }),
  hi: define({
    correctTranscript: "प्रतिलेख सुधारें",
    correctTranscriptTitle: "प्रतिलेख सुधारें",
    correctTranscriptHint:
      "इससे सहेजा गया इतिहास, खोज, संग्रह और आगे का संदर्भ अपडेट होगा। पहले से बने उत्तर नहीं बदलेंगे।",
    transcriptEdited: "संपादित",
    branchFromHere: "यहाँ से शाखा बनाएँ",
    branchReady: "नई शाखा तैयार है। अपने अगले संदेश से जारी रखें।",
    branchStartsHere: "शाखा यहाँ से शुरू होती है",
    branchSourceUnavailable: "मूल शाखा उपलब्ध नहीं है",
    branchCount: ({ count }) => `${count} शाखाएँ`,
    branchesFromMessage: "इस संदेश से बनी शाखाएँ",
  }),
  es: define({
    correctTranscript: "Corregir transcripción",
    correctTranscriptTitle: "Corregir transcripción",
    correctTranscriptHint:
      "Esto actualiza el historial guardado, la búsqueda, el archivo y el contexto futuro. Las respuestas ya generadas no cambian.",
    transcriptEdited: "Editado",
    branchFromHere: "Bifurcar desde aquí",
    branchReady: "Nueva rama lista. Continúa con tu próximo mensaje.",
    branchStartsHere: "La rama comienza aquí",
    branchSourceUnavailable: "Rama original no disponible",
    branchCount: ({ count }) =>
      Number(count) === 1 ? "1 rama" : `${count} ramas`,
    branchesFromMessage: "Ramas desde este mensaje",
  }),
  fr: define({
    correctTranscript: "Corriger la transcription",
    correctTranscriptTitle: "Corriger la transcription",
    correctTranscriptHint:
      "Cela met à jour l’historique enregistré, la recherche, l’archive et le contexte futur. Les réponses déjà générées ne changent pas.",
    transcriptEdited: "Modifié",
    branchFromHere: "Créer une branche ici",
    branchReady: "Nouvelle branche prête. Continuez avec votre prochain message.",
    branchStartsHere: "La branche commence ici",
    branchSourceUnavailable: "Branche d’origine indisponible",
    branchCount: ({ count }) =>
      Number(count) === 1 ? "1 branche" : `${count} branches`,
    branchesFromMessage: "Branches depuis ce message",
  }),
  it: define({
    correctTranscript: "Correggi trascrizione",
    correctTranscriptTitle: "Correggi trascrizione",
    correctTranscriptHint:
      "Questo aggiorna cronologia, ricerca, archivio e contesto futuro. Le risposte già generate non cambiano.",
    transcriptEdited: "Modificato",
    branchFromHere: "Crea un ramo da qui",
    branchReady: "Nuovo ramo pronto. Continua con il prossimo messaggio.",
    branchStartsHere: "Il ramo inizia qui",
    branchSourceUnavailable: "Ramo originale non disponibile",
    branchCount: ({ count }) =>
      Number(count) === 1 ? "1 ramo" : `${count} rami`,
    branchesFromMessage: "Rami da questo messaggio",
  }),
  pt: define({
    correctTranscript: "Corrigir transcrição",
    correctTranscriptTitle: "Corrigir transcrição",
    correctTranscriptHint:
      "Isto atualiza o histórico guardado, a pesquisa, o arquivo e o contexto futuro. As respostas já geradas não são alteradas.",
    transcriptEdited: "Editado",
    branchFromHere: "Criar ramo a partir daqui",
    branchReady: "Novo ramo pronto. Continue com a próxima mensagem.",
    branchStartsHere: "O ramo começa aqui",
    branchSourceUnavailable: "Ramo original indisponível",
    branchCount: ({ count }) =>
      Number(count) === 1 ? "1 ramo" : `${count} ramos`,
    branchesFromMessage: "Ramos a partir desta mensagem",
  }),
  ptBR: define({
    correctTranscript: "Corrigir transcrição",
    correctTranscriptTitle: "Corrigir transcrição",
    correctTranscriptHint:
      "Isso atualiza o histórico salvo, a busca, o arquivo e o contexto futuro. As respostas já geradas não são alteradas.",
    transcriptEdited: "Editado",
    branchFromHere: "Criar ramificação daqui",
    branchReady: "Nova ramificação pronta. Continue com a próxima mensagem.",
    branchStartsHere: "A ramificação começa aqui",
    branchSourceUnavailable: "Ramificação original indisponível",
    branchCount: ({ count }) =>
      Number(count) === 1 ? "1 ramificação" : `${count} ramificações`,
    branchesFromMessage: "Ramificações desta mensagem",
  }),
  ru: define({
    correctTranscript: "Исправить расшифровку",
    correctTranscriptTitle: "Исправить расшифровку",
    correctTranscriptHint:
      "Это обновит сохранённую историю, поиск, архив и будущий контекст. Уже созданные ответы не изменятся.",
    transcriptEdited: "Изменено",
    branchFromHere: "Создать ветку отсюда",
    branchReady: "Новая ветка готова. Продолжите следующим сообщением.",
    branchStartsHere: "Ветка начинается здесь",
    branchSourceUnavailable: "Исходная ветка недоступна",
    branchCount: ({ count }) =>
      Number(count) === 1 ? "1 ветка" : `${count} веток`,
    branchesFromMessage: "Ветки от этого сообщения",
  }),
  "zh-CN": define({
    correctTranscript: "更正转录",
    correctTranscriptTitle: "更正转录",
    correctTranscriptHint:
      "这会更新已保存的历史记录、搜索、归档和后续上下文。已经生成的回答不会改变。",
    transcriptEdited: "已编辑",
    branchFromHere: "从这里创建分支",
    branchReady: "新分支已准备好。请继续发送下一条消息。",
    branchStartsHere: "分支从这里开始",
    branchSourceUnavailable: "原始分支不可用",
    branchCount: ({ count }) => `${count} 个分支`,
    branchesFromMessage: "从此消息创建的分支",
  }),
  ar: define({
    correctTranscript: "تصحيح النص المنسوخ",
    correctTranscriptTitle: "تصحيح النص المنسوخ",
    correctTranscriptHint:
      "يحدّث هذا السجل المحفوظ والبحث والأرشيف والسياق المستقبلي. لن تتغير الردود التي تم إنشاؤها مسبقًا.",
    transcriptEdited: "تم التعديل",
    branchFromHere: "أنشئ فرعًا من هنا",
    branchReady: "الفرع الجديد جاهز. تابع برسالتك التالية.",
    branchStartsHere: "يبدأ الفرع هنا",
    branchSourceUnavailable: "الفرع الأصلي غير متاح",
    branchCount: ({ count }) => `${count} فروع`,
    branchesFromMessage: "الفروع من هذه الرسالة",
  }),
  ja: define({
    correctTranscript: "文字起こしを修正",
    correctTranscriptTitle: "文字起こしを修正",
    correctTranscriptHint:
      "保存済みの履歴、検索、アーカイブ、今後の文脈が更新されます。すでに生成された回答は変わりません。",
    transcriptEdited: "編集済み",
    branchFromHere: "ここから分岐",
    branchReady: "新しいブランチの準備ができました。次のメッセージを続けてください。",
    branchStartsHere: "ブランチはここから始まります",
    branchSourceUnavailable: "元のブランチは利用できません",
    branchCount: ({ count }) => `${count} ブランチ`,
    branchesFromMessage: "このメッセージからのブランチ",
  }),
  hu: define({
    correctTranscript: "Átirat javítása",
    correctTranscriptTitle: "Átirat javítása",
    correctTranscriptHint:
      "Ez frissíti a mentett előzményeket, a keresést, az archívumot és a jövőbeli kontextust. A már létrehozott válaszok nem változnak.",
    transcriptEdited: "Szerkesztve",
    branchFromHere: "Elágazás innen",
    branchReady: "Az új ág kész. Folytasd a következő üzeneteddel.",
    branchStartsHere: "Az ág itt kezdődik",
    branchSourceUnavailable: "Az eredeti ág nem érhető el",
    branchCount: ({ count }) => `${count} ág`,
    branchesFromMessage: "Ágak ettől az üzenettől",
  }),
  cs: define({
    correctTranscript: "Opravit přepis",
    correctTranscriptTitle: "Opravit přepis",
    correctTranscriptHint:
      "Aktualizuje se uložená historie, vyhledávání, archiv a budoucí kontext. Již vytvořené odpovědi se nezmění.",
    transcriptEdited: "Upraveno",
    branchFromHere: "Vytvořit větev odsud",
    branchReady: "Nová větev je připravena. Pokračujte další zprávou.",
    branchStartsHere: "Větev začíná zde",
    branchSourceUnavailable: "Původní větev není dostupná",
    branchCount: ({ count }) => `${count} větví`,
    branchesFromMessage: "Větve od této zprávy",
  }),
  pl: define({
    correctTranscript: "Popraw transkrypcję",
    correctTranscriptTitle: "Popraw transkrypcję",
    correctTranscriptHint:
      "Zaktualizuje to zapisaną historię, wyszukiwanie, archiwum i przyszły kontekst. Wygenerowane już odpowiedzi nie ulegną zmianie.",
    transcriptEdited: "Edytowano",
    branchFromHere: "Utwórz gałąź od tego miejsca",
    branchReady: "Nowa gałąź jest gotowa. Kontynuuj następną wiadomością.",
    branchStartsHere: "Gałąź zaczyna się tutaj",
    branchSourceUnavailable: "Oryginalna gałąź jest niedostępna",
    branchCount: ({ count }) => `${count} gałęzi`,
    branchesFromMessage: "Gałęzie od tej wiadomości",
  }),
  tr: define({
    correctTranscript: "Dökümü düzelt",
    correctTranscriptTitle: "Dökümü düzelt",
    correctTranscriptHint:
      "Bu işlem kaydedilen geçmişi, aramayı, arşivi ve gelecekteki bağlamı günceller. Daha önce oluşturulan yanıtlar değişmez.",
    transcriptEdited: "Düzenlendi",
    branchFromHere: "Buradan dal oluştur",
    branchReady: "Yeni dal hazır. Sonraki mesajınızla devam edin.",
    branchStartsHere: "Dal burada başlıyor",
    branchSourceUnavailable: "Özgün dal kullanılamıyor",
    branchCount: ({ count }) => `${count} dal`,
    branchesFromMessage: "Bu mesajdan başlayan dallar",
  }),
  sv: define({
    correctTranscript: "Korrigera transkribering",
    correctTranscriptTitle: "Korrigera transkribering",
    correctTranscriptHint:
      "Detta uppdaterar sparad historik, sökning, arkiv och framtida sammanhang. Redan skapade svar ändras inte.",
    transcriptEdited: "Redigerad",
    branchFromHere: "Förgrena härifrån",
    branchReady: "Den nya grenen är klar. Fortsätt med nästa meddelande.",
    branchStartsHere: "Grenen börjar här",
    branchSourceUnavailable: "Den ursprungliga grenen är inte tillgänglig",
    branchCount: ({ count }) => `${count} grenar`,
    branchesFromMessage: "Grenar från detta meddelande",
  }),
  ur: define({
    correctTranscript: "نقل درست کریں",
    correctTranscriptTitle: "نقل درست کریں",
    correctTranscriptHint:
      "اس سے محفوظ تاریخ، تلاش، آرکائیو اور آئندہ سیاق اپ ڈیٹ ہوگا۔ پہلے سے بنائے گئے جوابات تبدیل نہیں ہوں گے۔",
    transcriptEdited: "ترمیم شدہ",
    branchFromHere: "یہاں سے شاخ بنائیں",
    branchReady: "نئی شاخ تیار ہے۔ اپنے اگلے پیغام کے ساتھ جاری رکھیں۔",
    branchStartsHere: "شاخ یہاں سے شروع ہوتی ہے",
    branchSourceUnavailable: "اصل شاخ دستیاب نہیں ہے",
    branchCount: ({ count }) => `${count} شاخیں`,
    branchesFromMessage: "اس پیغام سے شاخیں",
  }),
} as const;
