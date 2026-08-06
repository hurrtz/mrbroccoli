import type { TranslationParams } from "./types";

type ConversationIntegrityTranslation = {
  conversationIntegrity: string;
  reviewConversationIntegrity: string;
  conversationIntegrityDescription: string;
  conversationIntegrityChecking: string;
  conversationIntegrityCouldNotLoad: string;
  conversationIntegrityIssueCount: (params: TranslationParams) => string;
  conversationIntegrityRepairComplete: string;
  conversationIntegrityNoIssues: string;
  conversationIntegrityResponse: (params: TranslationParams) => string;
  conversationIntegrityOriginal: string;
  conversationIntegritySuggested: string;
  conversationIntegrityManualReview: string;
  conversationIntegrityExportOriginals: string;
  conversationIntegrityUndo: string;
  conversationIntegrityRepair: (params: TranslationParams) => string;
};

export const conversationIntegrityTranslations = {
  en: {
    conversationIntegrity: "Conversation integrity",
    reviewConversationIntegrity: "Review conversation integrity",
    conversationIntegrityDescription:
      "Check saved assistant responses for internal context that should never have appeared. Nothing changes until you approve a repair.",
    conversationIntegrityChecking: "Checking saved responses…",
    conversationIntegrityCouldNotLoad:
      "This conversation could not be checked. Try again later.",
    conversationIntegrityIssueCount: ({ count }) =>
      `${count} potentially damaged response${count === 1 ? "" : "s"} found.`,
    conversationIntegrityRepairComplete:
      "Repair complete. The original is stored locally for export or undo.",
    conversationIntegrityNoIssues: "No integrity issues were found.",
    conversationIntegrityResponse: ({ count }) => `Response ${count}`,
    conversationIntegrityOriginal: "Original saved response",
    conversationIntegritySuggested: "Suggested repaired response",
    conversationIntegrityManualReview:
      "No safe automatic repair is available. Export the original and review it manually.",
    conversationIntegrityExportOriginals: "Export original",
    conversationIntegrityUndo: "Undo repair",
    conversationIntegrityRepair: ({ count }) =>
      `Repair ${count} response${count === 1 ? "" : "s"}`,
  },
  de: {
    conversationIntegrity: "Gesprächsintegrität",
    reviewConversationIntegrity: "Gesprächsintegrität prüfen",
    conversationIntegrityDescription:
      "Prüft gespeicherte Assistentenantworten auf internen Kontext, der nie sichtbar sein sollte. Erst nach deiner Bestätigung wird etwas geändert.",
    conversationIntegrityChecking: "Gespeicherte Antworten werden geprüft…",
    conversationIntegrityCouldNotLoad:
      "Dieses Gespräch konnte nicht geprüft werden. Versuche es später erneut.",
    conversationIntegrityIssueCount: ({ count }) =>
      `${count} möglicherweise beschädigte Antwort${count === 1 ? "" : "en"} gefunden.`,
    conversationIntegrityRepairComplete:
      "Reparatur abgeschlossen. Das Original bleibt lokal für Export oder Rückgängig erhalten.",
    conversationIntegrityNoIssues: "Keine Integritätsprobleme gefunden.",
    conversationIntegrityResponse: ({ count }) => `Antwort ${count}`,
    conversationIntegrityOriginal: "Ursprünglich gespeicherte Antwort",
    conversationIntegritySuggested: "Vorgeschlagene reparierte Antwort",
    conversationIntegrityManualReview:
      "Eine sichere automatische Reparatur ist nicht möglich. Exportiere das Original und prüfe es manuell.",
    conversationIntegrityExportOriginals: "Original exportieren",
    conversationIntegrityUndo: "Reparatur rückgängig",
    conversationIntegrityRepair: ({ count }) =>
      `${count} Antwort${count === 1 ? "" : "en"} reparieren`,
  },
  uk: {
    conversationIntegrity: "Цілісність розмови",
    reviewConversationIntegrity: "Перевірити цілісність розмови",
    conversationIntegrityDescription:
      "Перевіряє збережені відповіді асистента на внутрішній контекст, який не мав з’явитися. Нічого не зміниться без вашого підтвердження.",
    conversationIntegrityChecking: "Перевірка збережених відповідей…",
    conversationIntegrityCouldNotLoad:
      "Не вдалося перевірити цю розмову. Спробуйте пізніше.",
    conversationIntegrityIssueCount: ({ count }) =>
      `Знайдено потенційно пошкоджених відповідей: ${count}.`,
    conversationIntegrityRepairComplete:
      "Виправлення завершено. Оригінал збережено локально для експорту або скасування.",
    conversationIntegrityNoIssues: "Проблем цілісності не знайдено.",
    conversationIntegrityResponse: ({ count }) => `Відповідь ${count}`,
    conversationIntegrityOriginal: "Початкова збережена відповідь",
    conversationIntegritySuggested: "Запропонована виправлена відповідь",
    conversationIntegrityManualReview:
      "Безпечне автоматичне виправлення неможливе. Експортуйте оригінал і перевірте його вручну.",
    conversationIntegrityExportOriginals: "Експортувати оригінал",
    conversationIntegrityUndo: "Скасувати виправлення",
    conversationIntegrityRepair: ({ count }) =>
      `Виправити відповідей: ${count}`,
  },
  hi: {
    conversationIntegrity: "बातचीत की अखंडता",
    reviewConversationIntegrity: "बातचीत की अखंडता जाँचें",
    conversationIntegrityDescription:
      "सहेजे गए सहायक उत्तरों में ऐसा आंतरिक संदर्भ जाँचें जो कभी दिखाई नहीं देना चाहिए था। आपकी मंज़ूरी तक कुछ नहीं बदलेगा।",
    conversationIntegrityChecking: "सहेजे गए उत्तर जाँचे जा रहे हैं…",
    conversationIntegrityCouldNotLoad:
      "इस बातचीत की जाँच नहीं हो सकी। बाद में फिर कोशिश करें।",
    conversationIntegrityIssueCount: ({ count }) =>
      `${count} संभावित रूप से खराब उत्तर मिले।`,
    conversationIntegrityRepairComplete:
      "सुधार पूरा हुआ। मूल उत्तर निर्यात या पूर्ववत करने के लिए डिवाइस पर सुरक्षित है।",
    conversationIntegrityNoIssues: "अखंडता की कोई समस्या नहीं मिली।",
    conversationIntegrityResponse: ({ count }) => `उत्तर ${count}`,
    conversationIntegrityOriginal: "मूल सहेजा गया उत्तर",
    conversationIntegritySuggested: "सुझाया गया सुधारा हुआ उत्तर",
    conversationIntegrityManualReview:
      "सुरक्षित स्वचालित सुधार उपलब्ध नहीं है। मूल उत्तर निर्यात करके स्वयं जाँचें।",
    conversationIntegrityExportOriginals: "मूल निर्यात करें",
    conversationIntegrityUndo: "सुधार पूर्ववत करें",
    conversationIntegrityRepair: ({ count }) => `${count} उत्तर सुधारें`,
  },
  es: {
    conversationIntegrity: "Integridad de la conversación",
    reviewConversationIntegrity: "Revisar integridad de la conversación",
    conversationIntegrityDescription:
      "Comprueba si las respuestas guardadas contienen contexto interno que nunca debió aparecer. Nada cambiará hasta que apruebes la reparación.",
    conversationIntegrityChecking: "Comprobando respuestas guardadas…",
    conversationIntegrityCouldNotLoad:
      "No se pudo comprobar esta conversación. Inténtalo más tarde.",
    conversationIntegrityIssueCount: ({ count }) =>
      `Se encontraron ${count} respuesta${count === 1 ? "" : "s"} posiblemente dañada${count === 1 ? "" : "s"}.`,
    conversationIntegrityRepairComplete:
      "Reparación completada. El original se guarda localmente para exportarlo o deshacer el cambio.",
    conversationIntegrityNoIssues: "No se encontraron problemas de integridad.",
    conversationIntegrityResponse: ({ count }) => `Respuesta ${count}`,
    conversationIntegrityOriginal: "Respuesta original guardada",
    conversationIntegritySuggested: "Respuesta reparada sugerida",
    conversationIntegrityManualReview:
      "No hay una reparación automática segura. Exporta el original y revísalo manualmente.",
    conversationIntegrityExportOriginals: "Exportar original",
    conversationIntegrityUndo: "Deshacer reparación",
    conversationIntegrityRepair: ({ count }) =>
      `Reparar ${count} respuesta${count === 1 ? "" : "s"}`,
  },
  fr: {
    conversationIntegrity: "Intégrité de la conversation",
    reviewConversationIntegrity: "Vérifier l'intégrité de la conversation",
    conversationIntegrityDescription:
      "Vérifie si les réponses enregistrées contiennent un contexte interne qui n'aurait jamais dû apparaître. Rien ne change sans votre accord.",
    conversationIntegrityChecking: "Vérification des réponses enregistrées…",
    conversationIntegrityCouldNotLoad:
      "Cette conversation n'a pas pu être vérifiée. Réessayez plus tard.",
    conversationIntegrityIssueCount: ({ count }) =>
      `${count} réponse${count === 1 ? "" : "s"} potentiellement endommagée${count === 1 ? "" : "s"} trouvée${count === 1 ? "" : "s"}.`,
    conversationIntegrityRepairComplete:
      "Réparation terminée. L'original reste stocké localement pour l'exporter ou annuler.",
    conversationIntegrityNoIssues: "Aucun problème d'intégrité détecté.",
    conversationIntegrityResponse: ({ count }) => `Réponse ${count}`,
    conversationIntegrityOriginal: "Réponse originale enregistrée",
    conversationIntegritySuggested: "Réponse réparée suggérée",
    conversationIntegrityManualReview:
      "Aucune réparation automatique sûre n'est disponible. Exportez l'original et vérifiez-le manuellement.",
    conversationIntegrityExportOriginals: "Exporter l'original",
    conversationIntegrityUndo: "Annuler la réparation",
    conversationIntegrityRepair: ({ count }) =>
      `Réparer ${count} réponse${count === 1 ? "" : "s"}`,
  },
  it: {
    conversationIntegrity: "Integrità della conversazione",
    reviewConversationIntegrity: "Verifica integrità della conversazione",
    conversationIntegrityDescription:
      "Controlla le risposte salvate per trovare contesto interno che non avrebbe mai dovuto apparire. Nulla cambia senza la tua approvazione.",
    conversationIntegrityChecking: "Controllo delle risposte salvate…",
    conversationIntegrityCouldNotLoad:
      "Impossibile controllare questa conversazione. Riprova più tardi.",
    conversationIntegrityIssueCount: ({ count }) =>
      `Trovate ${count} risposte potenzialmente danneggiate.`,
    conversationIntegrityRepairComplete:
      "Riparazione completata. L'originale resta salvato localmente per esportarlo o annullare.",
    conversationIntegrityNoIssues: "Nessun problema di integrità rilevato.",
    conversationIntegrityResponse: ({ count }) => `Risposta ${count}`,
    conversationIntegrityOriginal: "Risposta originale salvata",
    conversationIntegritySuggested: "Risposta riparata suggerita",
    conversationIntegrityManualReview:
      "Non è disponibile una riparazione automatica sicura. Esporta l'originale e controllalo manualmente.",
    conversationIntegrityExportOriginals: "Esporta originale",
    conversationIntegrityUndo: "Annulla riparazione",
    conversationIntegrityRepair: ({ count }) =>
      `Ripara ${count} rispost${count === 1 ? "a" : "e"}`,
  },
  pt: {
    conversationIntegrity: "Integridade da conversa",
    reviewConversationIntegrity: "Rever integridade da conversa",
    conversationIntegrityDescription:
      "Verifica as respostas guardadas para detetar contexto interno que nunca deveria ter aparecido. Nada muda sem a tua aprovação.",
    conversationIntegrityChecking: "A verificar respostas guardadas…",
    conversationIntegrityCouldNotLoad:
      "Não foi possível verificar esta conversa. Tenta novamente mais tarde.",
    conversationIntegrityIssueCount: ({ count }) =>
      `Foram encontradas ${count} respostas possivelmente danificadas.`,
    conversationIntegrityRepairComplete:
      "Reparação concluída. O original fica guardado localmente para exportar ou anular.",
    conversationIntegrityNoIssues: "Não foram encontrados problemas de integridade.",
    conversationIntegrityResponse: ({ count }) => `Resposta ${count}`,
    conversationIntegrityOriginal: "Resposta original guardada",
    conversationIntegritySuggested: "Resposta reparada sugerida",
    conversationIntegrityManualReview:
      "Não existe uma reparação automática segura. Exporta o original e revê-o manualmente.",
    conversationIntegrityExportOriginals: "Exportar original",
    conversationIntegrityUndo: "Anular reparação",
    conversationIntegrityRepair: ({ count }) =>
      `Reparar ${count} resposta${count === 1 ? "" : "s"}`,
  },
  ptBR: {
    conversationIntegrity: "Integridade da conversa",
    reviewConversationIntegrity: "Revisar integridade da conversa",
    conversationIntegrityDescription:
      "Verifica as respostas salvas para encontrar contexto interno que nunca deveria ter aparecido. Nada muda sem sua aprovação.",
    conversationIntegrityChecking: "Verificando respostas salvas…",
    conversationIntegrityCouldNotLoad:
      "Não foi possível verificar esta conversa. Tente novamente mais tarde.",
    conversationIntegrityIssueCount: ({ count }) =>
      `Foram encontradas ${count} respostas possivelmente danificadas.`,
    conversationIntegrityRepairComplete:
      "Reparo concluído. O original fica salvo localmente para exportar ou desfazer.",
    conversationIntegrityNoIssues: "Nenhum problema de integridade foi encontrado.",
    conversationIntegrityResponse: ({ count }) => `Resposta ${count}`,
    conversationIntegrityOriginal: "Resposta original salva",
    conversationIntegritySuggested: "Resposta reparada sugerida",
    conversationIntegrityManualReview:
      "Não há um reparo automático seguro. Exporte o original e revise manualmente.",
    conversationIntegrityExportOriginals: "Exportar original",
    conversationIntegrityUndo: "Desfazer reparo",
    conversationIntegrityRepair: ({ count }) =>
      `Reparar ${count} resposta${count === 1 ? "" : "s"}`,
  },
  ru: {
    conversationIntegrity: "Целостность разговора",
    reviewConversationIntegrity: "Проверить целостность разговора",
    conversationIntegrityDescription:
      "Проверяет сохранённые ответы ассистента на внутренний контекст, который не должен был появиться. Без вашего подтверждения ничего не изменится.",
    conversationIntegrityChecking: "Проверка сохранённых ответов…",
    conversationIntegrityCouldNotLoad:
      "Не удалось проверить этот разговор. Повторите попытку позже.",
    conversationIntegrityIssueCount: ({ count }) =>
      `Найдено потенциально повреждённых ответов: ${count}.`,
    conversationIntegrityRepairComplete:
      "Исправление завершено. Оригинал сохранён локально для экспорта или отмены.",
    conversationIntegrityNoIssues: "Проблем целостности не обнаружено.",
    conversationIntegrityResponse: ({ count }) => `Ответ ${count}`,
    conversationIntegrityOriginal: "Исходный сохранённый ответ",
    conversationIntegritySuggested: "Предлагаемый исправленный ответ",
    conversationIntegrityManualReview:
      "Безопасное автоматическое исправление невозможно. Экспортируйте оригинал и проверьте вручную.",
    conversationIntegrityExportOriginals: "Экспортировать оригинал",
    conversationIntegrityUndo: "Отменить исправление",
    conversationIntegrityRepair: ({ count }) => `Исправить ответов: ${count}`,
  },
  zhCN: {
    conversationIntegrity: "对话完整性",
    reviewConversationIntegrity: "检查对话完整性",
    conversationIntegrityDescription:
      "检查已保存的助手回复中是否出现了不应显示的内部上下文。未经你确认，不会更改任何内容。",
    conversationIntegrityChecking: "正在检查已保存的回复…",
    conversationIntegrityCouldNotLoad: "无法检查此对话，请稍后重试。",
    conversationIntegrityIssueCount: ({ count }) =>
      `发现 ${count} 条可能受损的回复。`,
    conversationIntegrityRepairComplete:
      "修复完成。原文保存在本地，可供导出或撤销。",
    conversationIntegrityNoIssues: "未发现完整性问题。",
    conversationIntegrityResponse: ({ count }) => `回复 ${count}`,
    conversationIntegrityOriginal: "原始已保存回复",
    conversationIntegritySuggested: "建议的修复回复",
    conversationIntegrityManualReview:
      "无法安全地自动修复。请导出原文并手动检查。",
    conversationIntegrityExportOriginals: "导出原文",
    conversationIntegrityUndo: "撤销修复",
    conversationIntegrityRepair: ({ count }) => `修复 ${count} 条回复`,
  },
  ar: {
    conversationIntegrity: "سلامة المحادثة",
    reviewConversationIntegrity: "مراجعة سلامة المحادثة",
    conversationIntegrityDescription:
      "يفحص ردود المساعد المحفوظة بحثاً عن سياق داخلي لم يكن ينبغي أن يظهر. لن يتغير شيء قبل موافقتك.",
    conversationIntegrityChecking: "جارٍ فحص الردود المحفوظة…",
    conversationIntegrityCouldNotLoad:
      "تعذر فحص هذه المحادثة. حاول مرة أخرى لاحقاً.",
    conversationIntegrityIssueCount: ({ count }) =>
      `تم العثور على ${count} من الردود التي قد تكون تالفة.`,
    conversationIntegrityRepairComplete:
      "اكتمل الإصلاح. الأصل محفوظ محلياً للتصدير أو التراجع.",
    conversationIntegrityNoIssues: "لم يتم العثور على مشكلات في السلامة.",
    conversationIntegrityResponse: ({ count }) => `الرد ${count}`,
    conversationIntegrityOriginal: "الرد الأصلي المحفوظ",
    conversationIntegritySuggested: "الرد المقترح بعد الإصلاح",
    conversationIntegrityManualReview:
      "لا يتوفر إصلاح تلقائي آمن. صدّر الأصل وراجعه يدوياً.",
    conversationIntegrityExportOriginals: "تصدير الأصل",
    conversationIntegrityUndo: "التراجع عن الإصلاح",
    conversationIntegrityRepair: ({ count }) => `إصلاح ${count} من الردود`,
  },
  ja: {
    conversationIntegrity: "会話の整合性",
    reviewConversationIntegrity: "会話の整合性を確認",
    conversationIntegrityDescription:
      "保存済みのアシスタント回答に、表示されるべきでなかった内部コンテキストが含まれていないか確認します。承認するまで変更されません。",
    conversationIntegrityChecking: "保存済みの回答を確認中…",
    conversationIntegrityCouldNotLoad:
      "この会話を確認できませんでした。後でもう一度お試しください。",
    conversationIntegrityIssueCount: ({ count }) =>
      `破損している可能性のある回答が ${count} 件見つかりました。`,
    conversationIntegrityRepairComplete:
      "修復が完了しました。元の内容は書き出しや取り消しのため端末内に保存されています。",
    conversationIntegrityNoIssues: "整合性の問題は見つかりませんでした。",
    conversationIntegrityResponse: ({ count }) => `回答 ${count}`,
    conversationIntegrityOriginal: "保存されていた元の回答",
    conversationIntegritySuggested: "修復後の回答案",
    conversationIntegrityManualReview:
      "安全な自動修復はできません。元の内容を書き出して手動で確認してください。",
    conversationIntegrityExportOriginals: "元の内容を書き出す",
    conversationIntegrityUndo: "修復を取り消す",
    conversationIntegrityRepair: ({ count }) => `${count} 件の回答を修復`,
  },
  hu: {
    conversationIntegrity: "Beszélgetés épsége",
    reviewConversationIntegrity: "Beszélgetés épségének ellenőrzése",
    conversationIntegrityDescription:
      "Ellenőrzi a mentett asszisztensi válaszokat olyan belső kontextus után, amelynek nem lett volna szabad megjelennie. Jóváhagyásig semmi sem változik.",
    conversationIntegrityChecking: "Mentett válaszok ellenőrzése…",
    conversationIntegrityCouldNotLoad:
      "A beszélgetést nem sikerült ellenőrizni. Próbáld újra később.",
    conversationIntegrityIssueCount: ({ count }) =>
      `${count} lehetséges sérült válasz található.`,
    conversationIntegrityRepairComplete:
      "A javítás kész. Az eredeti helyben marad exportáláshoz vagy visszavonáshoz.",
    conversationIntegrityNoIssues: "Nem található épségi probléma.",
    conversationIntegrityResponse: ({ count }) => `Válasz ${count}`,
    conversationIntegrityOriginal: "Eredeti mentett válasz",
    conversationIntegritySuggested: "Javasolt javított válasz",
    conversationIntegrityManualReview:
      "Nincs biztonságos automatikus javítás. Exportáld az eredetit, és ellenőrizd kézzel.",
    conversationIntegrityExportOriginals: "Eredeti exportálása",
    conversationIntegrityUndo: "Javítás visszavonása",
    conversationIntegrityRepair: ({ count }) => `${count} válasz javítása`,
  },
  cs: {
    conversationIntegrity: "Integrita konverzace",
    reviewConversationIntegrity: "Zkontrolovat integritu konverzace",
    conversationIntegrityDescription:
      "Zkontroluje uložené odpovědi asistenta kvůli internímu kontextu, který se neměl nikdy zobrazit. Bez vašeho schválení se nic nezmění.",
    conversationIntegrityChecking: "Kontrola uložených odpovědí…",
    conversationIntegrityCouldNotLoad:
      "Tuto konverzaci se nepodařilo zkontrolovat. Zkuste to později.",
    conversationIntegrityIssueCount: ({ count }) =>
      `Nalezen počet potenciálně poškozených odpovědí: ${count}.`,
    conversationIntegrityRepairComplete:
      "Oprava je dokončena. Originál je uložen místně pro export nebo vrácení změny.",
    conversationIntegrityNoIssues: "Nebyly nalezeny problémy s integritou.",
    conversationIntegrityResponse: ({ count }) => `Odpověď ${count}`,
    conversationIntegrityOriginal: "Původní uložená odpověď",
    conversationIntegritySuggested: "Navržená opravená odpověď",
    conversationIntegrityManualReview:
      "Bezpečná automatická oprava není dostupná. Exportujte originál a zkontrolujte jej ručně.",
    conversationIntegrityExportOriginals: "Exportovat originál",
    conversationIntegrityUndo: "Vrátit opravu",
    conversationIntegrityRepair: ({ count }) => `Opravit odpovědi: ${count}`,
  },
  pl: {
    conversationIntegrity: "Integralność rozmowy",
    reviewConversationIntegrity: "Sprawdź integralność rozmowy",
    conversationIntegrityDescription:
      "Sprawdza zapisane odpowiedzi asystenta pod kątem wewnętrznego kontekstu, który nie powinien się pojawić. Bez Twojej zgody nic się nie zmieni.",
    conversationIntegrityChecking: "Sprawdzanie zapisanych odpowiedzi…",
    conversationIntegrityCouldNotLoad:
      "Nie udało się sprawdzić tej rozmowy. Spróbuj ponownie później.",
    conversationIntegrityIssueCount: ({ count }) =>
      `Znaleziono potencjalnie uszkodzonych odpowiedzi: ${count}.`,
    conversationIntegrityRepairComplete:
      "Naprawa zakończona. Oryginał pozostaje lokalnie do eksportu lub cofnięcia.",
    conversationIntegrityNoIssues: "Nie znaleziono problemów z integralnością.",
    conversationIntegrityResponse: ({ count }) => `Odpowiedź ${count}`,
    conversationIntegrityOriginal: "Oryginalna zapisana odpowiedź",
    conversationIntegritySuggested: "Sugerowana naprawiona odpowiedź",
    conversationIntegrityManualReview:
      "Bezpieczna automatyczna naprawa nie jest dostępna. Wyeksportuj oryginał i sprawdź go ręcznie.",
    conversationIntegrityExportOriginals: "Eksportuj oryginał",
    conversationIntegrityUndo: "Cofnij naprawę",
    conversationIntegrityRepair: ({ count }) => `Napraw odpowiedzi: ${count}`,
  },
  sv: {
    conversationIntegrity: "Konversationsintegritet",
    reviewConversationIntegrity: "Granska konversationsintegritet",
    conversationIntegrityDescription:
      "Kontrollerar sparade assistentsvar efter intern kontext som aldrig borde ha visats. Inget ändras utan ditt godkännande.",
    conversationIntegrityChecking: "Kontrollerar sparade svar…",
    conversationIntegrityCouldNotLoad:
      "Konversationen kunde inte kontrolleras. Försök igen senare.",
    conversationIntegrityIssueCount: ({ count }) =>
      `${count} potentiellt skadade svar hittades.`,
    conversationIntegrityRepairComplete:
      "Reparationen är klar. Originalet sparas lokalt för export eller ångra.",
    conversationIntegrityNoIssues: "Inga integritetsproblem hittades.",
    conversationIntegrityResponse: ({ count }) => `Svar ${count}`,
    conversationIntegrityOriginal: "Ursprungligt sparat svar",
    conversationIntegritySuggested: "Föreslaget reparerat svar",
    conversationIntegrityManualReview:
      "Ingen säker automatisk reparation finns. Exportera originalet och granska det manuellt.",
    conversationIntegrityExportOriginals: "Exportera original",
    conversationIntegrityUndo: "Ångra reparation",
    conversationIntegrityRepair: ({ count }) => `Reparera ${count} svar`,
  },
  tr: {
    conversationIntegrity: "Konuşma bütünlüğü",
    reviewConversationIntegrity: "Konuşma bütünlüğünü incele",
    conversationIntegrityDescription:
      "Kaydedilen asistan yanıtlarında hiç görünmemesi gereken dahili bağlamı denetler. Siz onaylamadan hiçbir şey değişmez.",
    conversationIntegrityChecking: "Kaydedilen yanıtlar denetleniyor…",
    conversationIntegrityCouldNotLoad:
      "Bu konuşma denetlenemedi. Daha sonra tekrar deneyin.",
    conversationIntegrityIssueCount: ({ count }) =>
      `${count} olası hasarlı yanıt bulundu.`,
    conversationIntegrityRepairComplete:
      "Onarım tamamlandı. Orijinal, dışa aktarma veya geri alma için yerel olarak saklanıyor.",
    conversationIntegrityNoIssues: "Bütünlük sorunu bulunmadı.",
    conversationIntegrityResponse: ({ count }) => `Yanıt ${count}`,
    conversationIntegrityOriginal: "Kaydedilen orijinal yanıt",
    conversationIntegritySuggested: "Önerilen onarılmış yanıt",
    conversationIntegrityManualReview:
      "Güvenli otomatik onarım yok. Orijinali dışa aktarın ve elle inceleyin.",
    conversationIntegrityExportOriginals: "Orijinali dışa aktar",
    conversationIntegrityUndo: "Onarımı geri al",
    conversationIntegrityRepair: ({ count }) => `${count} yanıtı onar`,
  },
  ur: {
    conversationIntegrity: "گفتگو کی سالمیت",
    reviewConversationIntegrity: "گفتگو کی سالمیت کا جائزہ لیں",
    conversationIntegrityDescription:
      "محفوظ معاون جوابات میں ایسے اندرونی سیاق کو جانچتا ہے جو کبھی ظاہر نہیں ہونا چاہیے تھا۔ آپ کی منظوری تک کچھ نہیں بدلے گا۔",
    conversationIntegrityChecking: "محفوظ جوابات کی جانچ جاری ہے…",
    conversationIntegrityCouldNotLoad:
      "اس گفتگو کی جانچ نہیں ہو سکی۔ بعد میں دوبارہ کوشش کریں۔",
    conversationIntegrityIssueCount: ({ count }) =>
      `${count} ممکنہ خراب جوابات ملے۔`,
    conversationIntegrityRepairComplete:
      "مرمت مکمل ہو گئی۔ اصل جواب برآمد یا واپسی کے لیے مقامی طور پر محفوظ ہے۔",
    conversationIntegrityNoIssues: "سالمیت کا کوئی مسئلہ نہیں ملا۔",
    conversationIntegrityResponse: ({ count }) => `جواب ${count}`,
    conversationIntegrityOriginal: "اصل محفوظ جواب",
    conversationIntegritySuggested: "تجویز کردہ مرمت شدہ جواب",
    conversationIntegrityManualReview:
      "محفوظ خودکار مرمت دستیاب نہیں۔ اصل برآمد کریں اور دستی جائزہ لیں۔",
    conversationIntegrityExportOriginals: "اصل برآمد کریں",
    conversationIntegrityUndo: "مرمت واپس لیں",
    conversationIntegrityRepair: ({ count }) => `${count} جوابات کی مرمت`,
  },
} as const satisfies Record<string, ConversationIntegrityTranslation>;
