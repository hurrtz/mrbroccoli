const en = {
  correctTranscript: "Correct transcript",
  correctTranscriptTitle: "Correct transcript",
  correctTranscriptHint:
    "This updates saved history, search, archive, and future context. Replies that were already generated are not changed.",
  saveAndSend: "Save + send",
  transcriptEdited: "Edited",
  createForkTitle: "Create a fork?",
  createForkConfirmation: "Do you want to create a fork of this conversation?",
  createFork: "Create fork",
  branchFromHere: "Branch from here",
  branchReady: "New branch ready. Continue with your next message.",
  branchStartsHere: "Branch starts here",
  branchOfConversation: ({ title }: { title?: string | number }) =>
    `Branch of “${title}”`,
  branchContextKeptFrom: ({ title }: { title?: string | number }) =>
    `Context from “${title}” is included up to this fork. Tap to return to the fork point.`,
  branchContextKept:
    "All context from the parent conversation is included up to this fork. Tap to return to the fork point.",
  backToForkPoint: "Back to fork point",
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
    saveAndSend: "Speichern + senden",
    transcriptEdited: "Bearbeitet",
    createForkTitle: "Abzweigung erstellen?",
    createForkConfirmation:
      "Möchtest du eine Abzweigung dieses Gesprächs erstellen?",
    createFork: "Abzweigung erstellen",
    branchFromHere: "Ab hier verzweigen",
    branchReady:
      "Neuer Zweig bereit. Fahre mit deiner nächsten Nachricht fort.",
    branchStartsHere: "Zweig beginnt hier",
    branchOfConversation: ({ title }) => `Zweig von „${title}“`,
    branchContextKeptFrom: ({ title }) =>
      `Der Kontext aus „${title}“ wurde bis zu dieser Abzweigung übernommen. Tippe, um zur Abzweigungsstelle zurückzukehren.`,
    branchContextKept:
      "Der gesamte Kontext des übergeordneten Gesprächs wurde bis zu dieser Abzweigung übernommen. Tippe, um zur Abzweigungsstelle zurückzukehren.",
    backToForkPoint: "Zur Abzweigungsstelle",
    branchSourceUnavailable: "Ursprünglicher Zweig nicht verfügbar",
    branchCount: ({ count }) =>
      Number(count) === 1 ? "1 Zweig" : `${count} Zweige`,
    branchesFromMessage: "Zweige ab dieser Nachricht",
  }),
  uk: define({
    correctTranscript: "Виправити стенограму",
    correctTranscriptTitle: "Виправити стенограму",
    correctTranscriptHint:
      "Це оновить збережену історію, пошук, архів і майбутній контекст. Уже створені відповіді не зміняться.",
    saveAndSend: "Зберегти й надіслати",
    transcriptEdited: "Змінено",
    createForkTitle: "Створити відгалуження?",
    createForkConfirmation: "Створити відгалуження цієї розмови?",
    createFork: "Створити відгалуження",
    branchFromHere: "Відгалузити звідси",
    branchReady: "Нова гілка готова. Продовжуйте наступним повідомленням.",
    branchStartsHere: "Гілка починається тут",
    branchOfConversation: ({ title }) => `Відгалуження від «${title}»`,
    branchContextKeptFrom: ({ title }) =>
      `Контекст із «${title}» збережено до цього відгалуження. Торкніться, щоб повернутися до точки відгалуження.`,
    branchContextKept:
      "Увесь контекст батьківської розмови збережено до цього відгалуження. Торкніться, щоб повернутися до точки відгалуження.",
    backToForkPoint: "До точки відгалуження",
    branchSourceUnavailable: "Початкова гілка недоступна",
    branchCount: ({ count }) =>
      Number(count) === 1 ? "1 гілка" : `Гілок: ${count}`,
    branchesFromMessage: "Гілки від цього повідомлення",
  }),
  hi: define({
    correctTranscript: "प्रतिलेख सुधारें",
    correctTranscriptTitle: "प्रतिलेख सुधारें",
    correctTranscriptHint:
      "इससे सहेजा गया इतिहास, खोज, संग्रह और आगे का संदर्भ अपडेट होगा। पहले से बने उत्तर नहीं बदलेंगे।",
    saveAndSend: "सहेजें + भेजें",
    transcriptEdited: "संपादित",
    createForkTitle: "शाखा बनाएँ?",
    createForkConfirmation: "क्या आप इस बातचीत की एक शाखा बनाना चाहते हैं?",
    createFork: "शाखा बनाएँ",
    branchFromHere: "यहाँ से शाखा बनाएँ",
    branchReady: "नई शाखा तैयार है। अपने अगले संदेश से जारी रखें।",
    branchStartsHere: "शाखा यहाँ से शुरू होती है",
    branchOfConversation: ({ title }) => `“${title}” की शाखा`,
    branchContextKeptFrom: ({ title }) =>
      `“${title}” का संदर्भ इस शाखा तक शामिल है। शाखा-बिंदु पर लौटने के लिए टैप करें।`,
    branchContextKept:
      "मूल बातचीत का पूरा संदर्भ इस शाखा तक शामिल है। शाखा-बिंदु पर लौटने के लिए टैप करें।",
    backToForkPoint: "शाखा-बिंदु पर वापस जाएँ",
    branchSourceUnavailable: "मूल शाखा उपलब्ध नहीं है",
    branchCount: ({ count }) => `${count} शाखाएँ`,
    branchesFromMessage: "इस संदेश से बनी शाखाएँ",
  }),
  es: define({
    correctTranscript: "Corregir transcripción",
    correctTranscriptTitle: "Corregir transcripción",
    correctTranscriptHint:
      "Esto actualiza el historial guardado, la búsqueda, el archivo y el contexto futuro. Las respuestas ya generadas no cambian.",
    saveAndSend: "Guardar + enviar",
    transcriptEdited: "Editado",
    createForkTitle: "¿Crear una bifurcación?",
    createForkConfirmation:
      "¿Quieres crear una bifurcación de esta conversación?",
    createFork: "Crear bifurcación",
    branchFromHere: "Bifurcar desde aquí",
    branchReady: "Nueva rama lista. Continúa con tu próximo mensaje.",
    branchStartsHere: "La rama comienza aquí",
    branchOfConversation: ({ title }) => `Rama de «${title}»`,
    branchContextKeptFrom: ({ title }) =>
      `El contexto de «${title}» se incluye hasta esta bifurcación. Toca para volver al punto de bifurcación.`,
    branchContextKept:
      "Todo el contexto de la conversación principal se incluye hasta esta bifurcación. Toca para volver al punto de bifurcación.",
    backToForkPoint: "Volver al punto de bifurcación",
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
    saveAndSend: "Enregistrer + envoyer",
    transcriptEdited: "Modifié",
    createForkTitle: "Créer une branche ?",
    createForkConfirmation:
      "Voulez-vous créer une branche de cette conversation ?",
    createFork: "Créer la branche",
    branchFromHere: "Créer une branche ici",
    branchReady:
      "Nouvelle branche prête. Continuez avec votre prochain message.",
    branchStartsHere: "La branche commence ici",
    branchOfConversation: ({ title }) => `Branche de « ${title} »`,
    branchContextKeptFrom: ({ title }) =>
      `Le contexte de « ${title} » est inclus jusqu’à cette branche. Touchez pour revenir au point de branchement.`,
    branchContextKept:
      "Tout le contexte de la conversation parente est inclus jusqu’à cette branche. Touchez pour revenir au point de branchement.",
    backToForkPoint: "Retour au point de branchement",
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
    saveAndSend: "Salva + invia",
    transcriptEdited: "Modificato",
    createForkTitle: "Creare una diramazione?",
    createForkConfirmation:
      "Vuoi creare una diramazione di questa conversazione?",
    createFork: "Crea diramazione",
    branchFromHere: "Crea un ramo da qui",
    branchReady: "Nuovo ramo pronto. Continua con il prossimo messaggio.",
    branchStartsHere: "Il ramo inizia qui",
    branchOfConversation: ({ title }) => `Ramo di «${title}»`,
    branchContextKeptFrom: ({ title }) =>
      `Il contesto di «${title}» è incluso fino a questa diramazione. Tocca per tornare al punto di diramazione.`,
    branchContextKept:
      "Tutto il contesto della conversazione principale è incluso fino a questa diramazione. Tocca per tornare al punto di diramazione.",
    backToForkPoint: "Torna al punto di diramazione",
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
    saveAndSend: "Guardar + enviar",
    transcriptEdited: "Editado",
    createForkTitle: "Criar uma ramificação?",
    createForkConfirmation: "Queres criar uma ramificação desta conversa?",
    createFork: "Criar ramificação",
    branchFromHere: "Criar ramo a partir daqui",
    branchReady: "Novo ramo pronto. Continue com a próxima mensagem.",
    branchStartsHere: "O ramo começa aqui",
    branchOfConversation: ({ title }) => `Ramo de «${title}»`,
    branchContextKeptFrom: ({ title }) =>
      `O contexto de «${title}» está incluído até esta ramificação. Toca para voltar ao ponto de ramificação.`,
    branchContextKept:
      "Todo o contexto da conversa principal está incluído até esta ramificação. Toca para voltar ao ponto de ramificação.",
    backToForkPoint: "Voltar ao ponto de ramificação",
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
    saveAndSend: "Salvar + enviar",
    transcriptEdited: "Editado",
    createForkTitle: "Criar uma ramificação?",
    createForkConfirmation: "Você quer criar uma ramificação desta conversa?",
    createFork: "Criar ramificação",
    branchFromHere: "Criar ramificação daqui",
    branchReady: "Nova ramificação pronta. Continue com a próxima mensagem.",
    branchStartsHere: "A ramificação começa aqui",
    branchOfConversation: ({ title }) => `Ramificação de “${title}”`,
    branchContextKeptFrom: ({ title }) =>
      `O contexto de “${title}” está incluído até esta ramificação. Toque para voltar ao ponto de ramificação.`,
    branchContextKept:
      "Todo o contexto da conversa principal está incluído até esta ramificação. Toque para voltar ao ponto de ramificação.",
    backToForkPoint: "Voltar ao ponto de ramificação",
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
    saveAndSend: "Сохранить и отправить",
    transcriptEdited: "Изменено",
    createForkTitle: "Создать ветку?",
    createForkConfirmation: "Создать ветку этой беседы?",
    createFork: "Создать ветку",
    branchFromHere: "Создать ветку отсюда",
    branchReady: "Новая ветка готова. Продолжите следующим сообщением.",
    branchStartsHere: "Ветка начинается здесь",
    branchOfConversation: ({ title }) => `Ветка от «${title}»`,
    branchContextKeptFrom: ({ title }) =>
      `Контекст из «${title}» включён до этой ветки. Нажмите, чтобы вернуться к точке ветвления.`,
    branchContextKept:
      "Весь контекст родительской беседы включён до этой ветки. Нажмите, чтобы вернуться к точке ветвления.",
    backToForkPoint: "К точке ветвления",
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
    saveAndSend: "保存并发送",
    transcriptEdited: "已编辑",
    createForkTitle: "创建分支？",
    createForkConfirmation: "要为此对话创建一个分支吗？",
    createFork: "创建分支",
    branchFromHere: "从这里创建分支",
    branchReady: "新分支已准备好。请继续发送下一条消息。",
    branchStartsHere: "分支从这里开始",
    branchOfConversation: ({ title }) => `“${title}”的分支`,
    branchContextKeptFrom: ({ title }) =>
      `已保留“${title}”中截至此分支的上下文。点按可返回分支点。`,
    branchContextKept:
      "已保留父对话中截至此分支的全部上下文。点按可返回分支点。",
    backToForkPoint: "返回分支点",
    branchSourceUnavailable: "原始分支不可用",
    branchCount: ({ count }) => `${count} 个分支`,
    branchesFromMessage: "从此消息创建的分支",
  }),
  ar: define({
    correctTranscript: "تصحيح النص المنسوخ",
    correctTranscriptTitle: "تصحيح النص المنسوخ",
    correctTranscriptHint:
      "يحدّث هذا السجل المحفوظ والبحث والأرشيف والسياق المستقبلي. لن تتغير الردود التي تم إنشاؤها مسبقًا.",
    saveAndSend: "حفظ وإرسال",
    transcriptEdited: "تم التعديل",
    createForkTitle: "إنشاء فرع؟",
    createForkConfirmation: "هل تريد إنشاء فرع من هذه المحادثة؟",
    createFork: "إنشاء فرع",
    branchFromHere: "أنشئ فرعًا من هنا",
    branchReady: "الفرع الجديد جاهز. تابع برسالتك التالية.",
    branchStartsHere: "يبدأ الفرع هنا",
    branchOfConversation: ({ title }) => `فرع من «${title}»`,
    branchContextKeptFrom: ({ title }) =>
      `تم تضمين سياق «${title}» حتى هذا الفرع. اضغط للعودة إلى نقطة التفرع.`,
    branchContextKept:
      "تم تضمين سياق المحادثة الأصلية بالكامل حتى هذا الفرع. اضغط للعودة إلى نقطة التفرع.",
    backToForkPoint: "العودة إلى نقطة التفرع",
    branchSourceUnavailable: "الفرع الأصلي غير متاح",
    branchCount: ({ count }) => `${count} فروع`,
    branchesFromMessage: "الفروع من هذه الرسالة",
  }),
  ja: define({
    correctTranscript: "文字起こしを修正",
    correctTranscriptTitle: "文字起こしを修正",
    correctTranscriptHint:
      "保存済みの履歴、検索、アーカイブ、今後の文脈が更新されます。すでに生成された回答は変わりません。",
    saveAndSend: "保存して送信",
    transcriptEdited: "編集済み",
    createForkTitle: "分岐を作成しますか？",
    createForkConfirmation: "この会話の分岐を作成しますか？",
    createFork: "分岐を作成",
    branchFromHere: "ここから分岐",
    branchReady:
      "新しいブランチの準備ができました。次のメッセージを続けてください。",
    branchStartsHere: "ブランチはここから始まります",
    branchOfConversation: ({ title }) => `「${title}」からの分岐`,
    branchContextKeptFrom: ({ title }) =>
      `「${title}」のこの分岐までの文脈が含まれています。タップすると分岐点に戻ります。`,
    branchContextKept:
      "親の会話のこの分岐までの文脈がすべて含まれています。タップすると分岐点に戻ります。",
    backToForkPoint: "分岐点に戻る",
    branchSourceUnavailable: "元のブランチは利用できません",
    branchCount: ({ count }) => `${count} ブランチ`,
    branchesFromMessage: "このメッセージからのブランチ",
  }),
  hu: define({
    correctTranscript: "Átirat javítása",
    correctTranscriptTitle: "Átirat javítása",
    correctTranscriptHint:
      "Ez frissíti a mentett előzményeket, a keresést, az archívumot és a jövőbeli kontextust. A már létrehozott válaszok nem változnak.",
    saveAndSend: "Mentés + küldés",
    transcriptEdited: "Szerkesztve",
    createForkTitle: "Létrehozol egy elágazást?",
    createForkConfirmation:
      "Szeretnél elágazást létrehozni ebből a beszélgetésből?",
    createFork: "Elágazás létrehozása",
    branchFromHere: "Elágazás innen",
    branchReady: "Az új ág kész. Folytasd a következő üzeneteddel.",
    branchStartsHere: "Az ág itt kezdődik",
    branchOfConversation: ({ title }) => `A(z) „${title}” ága`,
    branchContextKeptFrom: ({ title }) =>
      `A(z) „${title}” kontextusa eddig az elágazásig megmaradt. Koppints az elágazási ponthoz való visszatéréshez.`,
    branchContextKept:
      "A szülőbeszélgetés teljes kontextusa eddig az elágazásig megmaradt. Koppints az elágazási ponthoz való visszatéréshez.",
    backToForkPoint: "Vissza az elágazási ponthoz",
    branchSourceUnavailable: "Az eredeti ág nem érhető el",
    branchCount: ({ count }) => `${count} ág`,
    branchesFromMessage: "Ágak ettől az üzenettől",
  }),
  cs: define({
    correctTranscript: "Opravit přepis",
    correctTranscriptTitle: "Opravit přepis",
    correctTranscriptHint:
      "Aktualizuje se uložená historie, vyhledávání, archiv a budoucí kontext. Již vytvořené odpovědi se nezmění.",
    saveAndSend: "Uložit a odeslat",
    transcriptEdited: "Upraveno",
    createForkTitle: "Vytvořit větev?",
    createForkConfirmation: "Chcete vytvořit větev této konverzace?",
    createFork: "Vytvořit větev",
    branchFromHere: "Vytvořit větev odsud",
    branchReady: "Nová větev je připravena. Pokračujte další zprávou.",
    branchStartsHere: "Větev začíná zde",
    branchOfConversation: ({ title }) => `Větev z „${title}“`,
    branchContextKeptFrom: ({ title }) =>
      `Kontext z „${title}“ je zahrnut až po tuto větev. Klepnutím se vrátíte k bodu větvení.`,
    branchContextKept:
      "Veškerý kontext nadřazené konverzace je zahrnut až po tuto větev. Klepnutím se vrátíte k bodu větvení.",
    backToForkPoint: "Zpět k bodu větvení",
    branchSourceUnavailable: "Původní větev není dostupná",
    branchCount: ({ count }) => `${count} větví`,
    branchesFromMessage: "Větve od této zprávy",
  }),
  pl: define({
    correctTranscript: "Popraw transkrypcję",
    correctTranscriptTitle: "Popraw transkrypcję",
    correctTranscriptHint:
      "Zaktualizuje to zapisaną historię, wyszukiwanie, archiwum i przyszły kontekst. Wygenerowane już odpowiedzi nie ulegną zmianie.",
    saveAndSend: "Zapisz i wyślij",
    transcriptEdited: "Edytowano",
    createForkTitle: "Utworzyć odgałęzienie?",
    createForkConfirmation: "Czy chcesz utworzyć odgałęzienie tej rozmowy?",
    createFork: "Utwórz odgałęzienie",
    branchFromHere: "Utwórz gałąź od tego miejsca",
    branchReady: "Nowa gałąź jest gotowa. Kontynuuj następną wiadomością.",
    branchStartsHere: "Gałąź zaczyna się tutaj",
    branchOfConversation: ({ title }) => `Gałąź rozmowy „${title}”`,
    branchContextKeptFrom: ({ title }) =>
      `Kontekst z „${title}” jest uwzględniony do tego odgałęzienia. Dotknij, aby wrócić do punktu rozgałęzienia.`,
    branchContextKept:
      "Cały kontekst rozmowy nadrzędnej jest uwzględniony do tego odgałęzienia. Dotknij, aby wrócić do punktu rozgałęzienia.",
    backToForkPoint: "Wróć do punktu rozgałęzienia",
    branchSourceUnavailable: "Oryginalna gałąź jest niedostępna",
    branchCount: ({ count }) => `${count} gałęzi`,
    branchesFromMessage: "Gałęzie od tej wiadomości",
  }),
  tr: define({
    correctTranscript: "Dökümü düzelt",
    correctTranscriptTitle: "Dökümü düzelt",
    correctTranscriptHint:
      "Bu işlem kaydedilen geçmişi, aramayı, arşivi ve gelecekteki bağlamı günceller. Daha önce oluşturulan yanıtlar değişmez.",
    saveAndSend: "Kaydet ve gönder",
    transcriptEdited: "Düzenlendi",
    createForkTitle: "Dal oluşturulsun mu?",
    createForkConfirmation:
      "Bu konuşmanın bir dalını oluşturmak istiyor musunuz?",
    createFork: "Dal oluştur",
    branchFromHere: "Buradan dal oluştur",
    branchReady: "Yeni dal hazır. Sonraki mesajınızla devam edin.",
    branchStartsHere: "Dal burada başlıyor",
    branchOfConversation: ({ title }) => `“${title}” dalı`,
    branchContextKeptFrom: ({ title }) =>
      `“${title}” bağlamı bu dala kadar dahil edildi. Dallanma noktasına dönmek için dokunun.`,
    branchContextKept:
      "Üst konuşmanın tüm bağlamı bu dala kadar dahil edildi. Dallanma noktasına dönmek için dokunun.",
    backToForkPoint: "Dallanma noktasına dön",
    branchSourceUnavailable: "Özgün dal kullanılamıyor",
    branchCount: ({ count }) => `${count} dal`,
    branchesFromMessage: "Bu mesajdan başlayan dallar",
  }),
  sv: define({
    correctTranscript: "Korrigera transkribering",
    correctTranscriptTitle: "Korrigera transkribering",
    correctTranscriptHint:
      "Detta uppdaterar sparad historik, sökning, arkiv och framtida sammanhang. Redan skapade svar ändras inte.",
    saveAndSend: "Spara och skicka",
    transcriptEdited: "Redigerad",
    createForkTitle: "Skapa en förgrening?",
    createForkConfirmation:
      "Vill du skapa en förgrening av den här konversationen?",
    createFork: "Skapa förgrening",
    branchFromHere: "Förgrena härifrån",
    branchReady: "Den nya grenen är klar. Fortsätt med nästa meddelande.",
    branchStartsHere: "Grenen börjar här",
    branchOfConversation: ({ title }) => `Gren av ”${title}”`,
    branchContextKeptFrom: ({ title }) =>
      `Sammanhanget från ”${title}” ingår fram till denna förgrening. Tryck för att återgå till förgreningspunkten.`,
    branchContextKept:
      "Hela sammanhanget från den överordnade konversationen ingår fram till denna förgrening. Tryck för att återgå till förgreningspunkten.",
    backToForkPoint: "Tillbaka till förgreningspunkten",
    branchSourceUnavailable: "Den ursprungliga grenen är inte tillgänglig",
    branchCount: ({ count }) => `${count} grenar`,
    branchesFromMessage: "Grenar från detta meddelande",
  }),
  ur: define({
    correctTranscript: "نقل درست کریں",
    correctTranscriptTitle: "نقل درست کریں",
    correctTranscriptHint:
      "اس سے محفوظ تاریخ، تلاش، آرکائیو اور آئندہ سیاق اپ ڈیٹ ہوگا۔ پہلے سے بنائے گئے جوابات تبدیل نہیں ہوں گے۔",
    saveAndSend: "محفوظ کریں اور بھیجیں",
    transcriptEdited: "ترمیم شدہ",
    createForkTitle: "شاخ بنائیں؟",
    createForkConfirmation: "کیا آپ اس گفتگو کی ایک شاخ بنانا چاہتے ہیں؟",
    createFork: "شاخ بنائیں",
    branchFromHere: "یہاں سے شاخ بنائیں",
    branchReady: "نئی شاخ تیار ہے۔ اپنے اگلے پیغام کے ساتھ جاری رکھیں۔",
    branchStartsHere: "شاخ یہاں سے شروع ہوتی ہے",
    branchOfConversation: ({ title }) => `”${title}“ کی شاخ`,
    branchContextKeptFrom: ({ title }) =>
      `”${title}“ کا سیاق اس شاخ تک شامل ہے۔ شاخ کے مقام پر واپس جانے کے لیے ٹیپ کریں۔`,
    branchContextKept:
      "اصل گفتگو کا پورا سیاق اس شاخ تک شامل ہے۔ شاخ کے مقام پر واپس جانے کے لیے ٹیپ کریں۔",
    backToForkPoint: "شاخ کے مقام پر واپس جائیں",
    branchSourceUnavailable: "اصل شاخ دستیاب نہیں ہے",
    branchCount: ({ count }) => `${count} شاخیں`,
    branchesFromMessage: "اس پیغام سے شاخیں",
  }),
} as const;
