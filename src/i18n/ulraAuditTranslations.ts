import type { TranslationParams } from "./types";

const en = {
  ulraAuditTitle: "Model Council audit",
  ulraAuditSummary: ({ failed, rounds, successful }: TranslationParams) =>
    `${successful} successful · ${failed} failed · ${rounds} review rounds`,
  ulraAuditConverged: "All active reviewers explicitly converged.",
  ulraAuditUnresolved:
    "Full convergence was not reached; material dissent may remain in the final answer.",
  ulraAuditCalls: ({ failed, retired, successful }: TranslationParams) =>
    `Calls: ${successful} successful · ${failed} failed · ${retired} participants retired`,
  ulraAuditReviews: ({ challenges, converged, unmarked }: TranslationParams) =>
    `Reviews: ${challenges} challenged · ${converged} converged · ${unmarked} unmarked`,
  ulraAuditHistory: ({ omitted, retained, tokens }: TranslationParams) =>
    `Synthesis history: ${retained} retained · ${omitted} omitted · ${tokens} intermediate tokens`,
  ulraAuditRoutes: "Participant routes",
  ulraAuditContract: ({ contract }: TranslationParams) =>
    `Synthesis contract: ${contract}`,
  expandUlraAudit: "Show Model Council audit",
  collapseUlraAudit: "Hide Model Council audit",
};

type UlraAuditTranslations = typeof en;
const define = (value: UlraAuditTranslations) => value;

const rawUlraAuditTranslations = {
  en,
  de: define({
    ulraAuditTitle: "Modellrat-Prüfpfad",
    ulraAuditSummary: ({ failed, rounds, successful }) =>
      `${successful} erfolgreich · ${failed} fehlgeschlagen · ${rounds} Prüfrunden`,
    ulraAuditConverged: "Alle aktiven Prüfenden sind ausdrücklich konvergiert.",
    ulraAuditUnresolved:
      "Es wurde keine vollständige Konvergenz erreicht; wesentlicher Dissens kann in der endgültigen Antwort verbleiben.",
    ulraAuditCalls: ({ failed, retired, successful }) =>
      `Aufrufe: ${successful} erfolgreich · ${failed} fehlgeschlagen · ${retired} Teilnehmende ausgeschieden`,
    ulraAuditReviews: ({ challenges, converged, unmarked }) =>
      `Prüfungen: ${challenges} widersprochen · ${converged} konvergiert · ${unmarked} unmarkiert`,
    ulraAuditHistory: ({ omitted, retained, tokens }) =>
      `Syntheseverlauf: ${retained} behalten · ${omitted} ausgelassen · ${tokens} Zwischentokens`,
    ulraAuditRoutes: "Teilnehmerrouten",
    ulraAuditContract: ({ contract }) => `Synthesevertrag: ${contract}`,
    expandUlraAudit: "Modellrat-Prüfpfad anzeigen",
    collapseUlraAudit: "Modellrat-Prüfpfad ausblenden",
  }),
  uk: define({
    ulraAuditTitle: "Аудит Ради моделей",
    ulraAuditSummary: ({ failed, rounds, successful }) =>
      `${successful} успішно · ${failed} невдало · ${rounds} раундів перегляду`,
    ulraAuditConverged: "Усі активні рецензенти явно дійшли згоди.",
    ulraAuditUnresolved:
      "Повної згоди не досягнуто; у фінальній відповіді можуть залишатися суттєві розбіжності.",
    ulraAuditCalls: ({ failed, retired, successful }) =>
      `Виклики: ${successful} успішно · ${failed} невдало · ${retired} учасників вибуло`,
    ulraAuditReviews: ({ challenges, converged, unmarked }) =>
      `Перевірки: ${challenges} заперечень · ${converged} згод · ${unmarked} без позначки`,
    ulraAuditHistory: ({ omitted, retained, tokens }) =>
      `Історія синтезу: ${retained} збережено · ${omitted} пропущено · ${tokens} проміжних токенів`,
    ulraAuditRoutes: "Маршрути учасників",
    ulraAuditContract: ({ contract }) => `Контракт синтезу: ${contract}`,
    expandUlraAudit: "Показати аудит Ради моделей",
    collapseUlraAudit: "Сховати аудит Ради моделей",
  }),
  hi: define({
    ulraAuditTitle: "मॉडल परिषद ऑडिट",
    ulraAuditSummary: ({ failed, rounds, successful }) =>
      `${successful} सफल · ${failed} विफल · ${rounds} समीक्षा दौर`,
    ulraAuditConverged: "सभी सक्रिय समीक्षक स्पष्ट रूप से सहमत हुए।",
    ulraAuditUnresolved:
      "पूर्ण सहमति नहीं बनी; अंतिम उत्तर में महत्वपूर्ण असहमति रह सकती है।",
    ulraAuditCalls: ({ failed, retired, successful }) =>
      `कॉल: ${successful} सफल · ${failed} विफल · ${retired} प्रतिभागी हटे`,
    ulraAuditReviews: ({ challenges, converged, unmarked }) =>
      `समीक्षाएँ: ${challenges} चुनौती · ${converged} सहमत · ${unmarked} बिना चिह्न`,
    ulraAuditHistory: ({ omitted, retained, tokens }) =>
      `संश्लेषण इतिहास: ${retained} रखे · ${omitted} छोड़े · ${tokens} मध्यवर्ती टोकन`,
    ulraAuditRoutes: "प्रतिभागी रूट",
    ulraAuditContract: ({ contract }) => `संश्लेषण अनुबंध: ${contract}`,
    expandUlraAudit: "मॉडल परिषद ऑडिट दिखाएँ",
    collapseUlraAudit: "मॉडल परिषद ऑडिट छिपाएँ",
  }),
  es: define({
    ulraAuditTitle: "Auditoría del Consejo de modelos",
    ulraAuditSummary: ({ failed, rounds, successful }) =>
      `${successful} correctas · ${failed} fallidas · ${rounds} rondas de revisión`,
    ulraAuditConverged:
      "Todos los revisores activos convergieron explícitamente.",
    ulraAuditUnresolved:
      "No se alcanzó una convergencia total; puede quedar disenso importante en la respuesta final.",
    ulraAuditCalls: ({ failed, retired, successful }) =>
      `Llamadas: ${successful} correctas · ${failed} fallidas · ${retired} participantes retirados`,
    ulraAuditReviews: ({ challenges, converged, unmarked }) =>
      `Revisiones: ${challenges} objeciones · ${converged} convergentes · ${unmarked} sin marcar`,
    ulraAuditHistory: ({ omitted, retained, tokens }) =>
      `Historial de síntesis: ${retained} retenidas · ${omitted} omitidas · ${tokens} tokens intermedios`,
    ulraAuditRoutes: "Rutas participantes",
    ulraAuditContract: ({ contract }) => `Contrato de síntesis: ${contract}`,
    expandUlraAudit: "Mostrar auditoría del Consejo de modelos",
    collapseUlraAudit: "Ocultar auditoría del Consejo de modelos",
  }),
  fr: define({
    ulraAuditTitle: "Audit du Conseil des modèles",
    ulraAuditSummary: ({ failed, rounds, successful }) =>
      `${successful} réussis · ${failed} échoués · ${rounds} tours de révision`,
    ulraAuditConverged:
      "Tous les relecteurs actifs ont explicitement convergé.",
    ulraAuditUnresolved:
      "La convergence totale n’a pas été atteinte ; un désaccord important peut subsister dans la réponse finale.",
    ulraAuditCalls: ({ failed, retired, successful }) =>
      `Appels : ${successful} réussis · ${failed} échoués · ${retired} participants retirés`,
    ulraAuditReviews: ({ challenges, converged, unmarked }) =>
      `Revues : ${challenges} objections · ${converged} convergences · ${unmarked} sans marqueur`,
    ulraAuditHistory: ({ omitted, retained, tokens }) =>
      `Historique de synthèse : ${retained} retenues · ${omitted} omises · ${tokens} jetons intermédiaires`,
    ulraAuditRoutes: "Routes participantes",
    ulraAuditContract: ({ contract }) => `Contrat de synthèse : ${contract}`,
    expandUlraAudit: "Afficher l’audit du Conseil des modèles",
    collapseUlraAudit: "Masquer l’audit du Conseil des modèles",
  }),
  it: define({
    ulraAuditTitle: "Audit del Consiglio dei modelli",
    ulraAuditSummary: ({ failed, rounds, successful }) =>
      `${successful} riuscite · ${failed} fallite · ${rounds} round di revisione`,
    ulraAuditConverged:
      "Tutti i revisori attivi hanno raggiunto una convergenza esplicita.",
    ulraAuditUnresolved:
      "Non è stata raggiunta la piena convergenza; nella risposta finale può restare un dissenso rilevante.",
    ulraAuditCalls: ({ failed, retired, successful }) =>
      `Chiamate: ${successful} riuscite · ${failed} fallite · ${retired} partecipanti ritirati`,
    ulraAuditReviews: ({ challenges, converged, unmarked }) =>
      `Revisioni: ${challenges} obiezioni · ${converged} convergenti · ${unmarked} senza indicazione`,
    ulraAuditHistory: ({ omitted, retained, tokens }) =>
      `Cronologia sintesi: ${retained} mantenuti · ${omitted} omessi · ${tokens} token intermedi`,
    ulraAuditRoutes: "Percorsi dei partecipanti",
    ulraAuditContract: ({ contract }) => `Contratto di sintesi: ${contract}`,
    expandUlraAudit: "Mostra audit del Consiglio dei modelli",
    collapseUlraAudit: "Nascondi audit del Consiglio dei modelli",
  }),
  pt: define({
    ulraAuditTitle: "Auditoria do Conselho de Modelos",
    ulraAuditSummary: ({ failed, rounds, successful }) =>
      `${successful} bem-sucedidas · ${failed} falhadas · ${rounds} rondas de revisão`,
    ulraAuditConverged: "Todos os revisores ativos convergiram explicitamente.",
    ulraAuditUnresolved:
      "Não houve convergência total; pode persistir discordância relevante na resposta final.",
    ulraAuditCalls: ({ failed, retired, successful }) =>
      `Chamadas: ${successful} bem-sucedidas · ${failed} falhadas · ${retired} participantes retirados`,
    ulraAuditReviews: ({ challenges, converged, unmarked }) =>
      `Revisões: ${challenges} objeções · ${converged} convergentes · ${unmarked} sem marca`,
    ulraAuditHistory: ({ omitted, retained, tokens }) =>
      `Histórico de síntese: ${retained} mantidas · ${omitted} omitidas · ${tokens} tokens intermédios`,
    ulraAuditRoutes: "Rotas dos participantes",
    ulraAuditContract: ({ contract }) => `Contrato de síntese: ${contract}`,
    expandUlraAudit: "Mostrar auditoria do Conselho de Modelos",
    collapseUlraAudit: "Ocultar auditoria do Conselho de Modelos",
  }),
  ptBR: define({
    ulraAuditTitle: "Auditoria do Conselho de Modelos",
    ulraAuditSummary: ({ failed, rounds, successful }) =>
      `${successful} bem-sucedidas · ${failed} com falha · ${rounds} rodadas de revisão`,
    ulraAuditConverged: "Todos os revisores ativos convergiram explicitamente.",
    ulraAuditUnresolved:
      "Não houve convergência total; pode restar discordância relevante na resposta final.",
    ulraAuditCalls: ({ failed, retired, successful }) =>
      `Chamadas: ${successful} bem-sucedidas · ${failed} com falha · ${retired} participantes retirados`,
    ulraAuditReviews: ({ challenges, converged, unmarked }) =>
      `Revisões: ${challenges} objeções · ${converged} convergentes · ${unmarked} sem marca`,
    ulraAuditHistory: ({ omitted, retained, tokens }) =>
      `Histórico de síntese: ${retained} mantidas · ${omitted} omitidas · ${tokens} tokens intermediários`,
    ulraAuditRoutes: "Rotas dos participantes",
    ulraAuditContract: ({ contract }) => `Contrato de síntese: ${contract}`,
    expandUlraAudit: "Mostrar auditoria do Conselho de Modelos",
    collapseUlraAudit: "Ocultar auditoria do Conselho de Modelos",
  }),
  ru: define({
    ulraAuditTitle: "Аудит Совета моделей",
    ulraAuditSummary: ({ failed, rounds, successful }) =>
      `${successful} успешно · ${failed} неудачно · ${rounds} раундов проверки`,
    ulraAuditConverged: "Все активные рецензенты явно достигли согласия.",
    ulraAuditUnresolved:
      "Полное согласие не достигнуто; в итоговом ответе могут остаться существенные разногласия.",
    ulraAuditCalls: ({ failed, retired, successful }) =>
      `Вызовы: ${successful} успешно · ${failed} неудачно · ${retired} участников выбыло`,
    ulraAuditReviews: ({ challenges, converged, unmarked }) =>
      `Проверки: ${challenges} возражений · ${converged} согласий · ${unmarked} без отметки`,
    ulraAuditHistory: ({ omitted, retained, tokens }) =>
      `История синтеза: ${retained} сохранено · ${omitted} пропущено · ${tokens} промежуточных токенов`,
    ulraAuditRoutes: "Маршруты участников",
    ulraAuditContract: ({ contract }) => `Контракт синтеза: ${contract}`,
    expandUlraAudit: "Показать аудит Совета моделей",
    collapseUlraAudit: "Скрыть аудит Совета моделей",
  }),
  "zh-CN": define({
    ulraAuditTitle: "模型委员会审计",
    ulraAuditSummary: ({ failed, rounds, successful }) =>
      `${successful} 次成功 · ${failed} 次失败 · ${rounds} 轮复核`,
    ulraAuditConverged: "所有活跃审查者均明确达成一致。",
    ulraAuditUnresolved: "尚未完全达成一致；最终回答中可能仍保留重要分歧。",
    ulraAuditCalls: ({ failed, retired, successful }) =>
      `调用：${successful} 次成功 · ${failed} 次失败 · ${retired} 名参与者退出`,
    ulraAuditReviews: ({ challenges, converged, unmarked }) =>
      `复核：${challenges} 次质疑 · ${converged} 次一致 · ${unmarked} 次未标记`,
    ulraAuditHistory: ({ omitted, retained, tokens }) =>
      `综合历史：保留 ${retained} 条 · 省略 ${omitted} 条 · ${tokens} 个中间令牌`,
    ulraAuditRoutes: "参与者路由",
    ulraAuditContract: ({ contract }) => `综合规则：${contract}`,
    expandUlraAudit: "显示模型委员会审计",
    collapseUlraAudit: "隐藏模型委员会审计",
  }),
  ar: define({
    ulraAuditTitle: "تدقيق مجلس النماذج",
    ulraAuditSummary: ({ failed, rounds, successful }) =>
      `${successful} ناجحة · ${failed} فاشلة · ${rounds} جولات مراجعة`,
    ulraAuditConverged: "توصل جميع المراجعين النشطين إلى توافق صريح.",
    ulraAuditUnresolved:
      "لم يتحقق توافق كامل؛ وقد يبقى خلاف جوهري في الإجابة النهائية.",
    ulraAuditCalls: ({ failed, retired, successful }) =>
      `الاستدعاءات: ${successful} ناجحة · ${failed} فاشلة · ${retired} مشاركين مستبعدين`,
    ulraAuditReviews: ({ challenges, converged, unmarked }) =>
      `المراجعات: ${challenges} اعتراضات · ${converged} متوافقة · ${unmarked} بلا علامة`,
    ulraAuditHistory: ({ omitted, retained, tokens }) =>
      `سجل التوليف: ${retained} محفوظة · ${omitted} محذوفة · ${tokens} رموز وسيطة`,
    ulraAuditRoutes: "مسارات المشاركين",
    ulraAuditContract: ({ contract }) => `عقد التوليف: ${contract}`,
    expandUlraAudit: "إظهار تدقيق مجلس النماذج",
    collapseUlraAudit: "إخفاء تدقيق مجلس النماذج",
  }),
  ja: define({
    ulraAuditTitle: "モデル評議会 監査",
    ulraAuditSummary: ({ failed, rounds, successful }) =>
      `成功 ${successful} 件 · 失敗 ${failed} 件 · レビュー ${rounds} ラウンド`,
    ulraAuditConverged: "すべての有効なレビュアーが明示的に収束しました。",
    ulraAuditUnresolved:
      "完全な収束には至っておらず、最終回答に重要な異論が残る場合があります。",
    ulraAuditCalls: ({ failed, retired, successful }) =>
      `呼び出し：成功 ${successful} 件 · 失敗 ${failed} 件 · 離脱 ${retired} 件`,
    ulraAuditReviews: ({ challenges, converged, unmarked }) =>
      `レビュー：異論 ${challenges} 件 · 収束 ${converged} 件 · 未記録 ${unmarked} 件`,
    ulraAuditHistory: ({ omitted, retained, tokens }) =>
      `統合履歴：保持 ${retained} 件 · 省略 ${omitted} 件 · 中間トークン ${tokens}`,
    ulraAuditRoutes: "参加ルート",
    ulraAuditContract: ({ contract }) => `統合契約：${contract}`,
    expandUlraAudit: "モデル評議会 監査を表示",
    collapseUlraAudit: "モデル評議会 監査を非表示",
  }),
  hu: define({
    ulraAuditTitle: "Modelltanács-audit",
    ulraAuditSummary: ({ failed, rounds, successful }) =>
      `${successful} sikeres · ${failed} sikertelen · ${rounds} felülvizsgálati kör`,
    ulraAuditConverged: "Minden aktív ellenőrző kifejezetten egyetértett.",
    ulraAuditUnresolved:
      "Nem alakult ki teljes egyetértés; a végső válaszban lényeges eltérés maradhat.",
    ulraAuditCalls: ({ failed, retired, successful }) =>
      `Hívások: ${successful} sikeres · ${failed} sikertelen · ${retired} résztvevő kiesett`,
    ulraAuditReviews: ({ challenges, converged, unmarked }) =>
      `Ellenőrzések: ${challenges} kifogás · ${converged} egyezés · ${unmarked} jelöletlen`,
    ulraAuditHistory: ({ omitted, retained, tokens }) =>
      `Szintézistörténet: ${retained} megtartva · ${omitted} kihagyva · ${tokens} köztes token`,
    ulraAuditRoutes: "Résztvevői útvonalak",
    ulraAuditContract: ({ contract }) => `Szintézisszerződés: ${contract}`,
    expandUlraAudit: "Modelltanács-audit megjelenítése",
    collapseUlraAudit: "Modelltanács-audit elrejtése",
  }),
  cs: define({
    ulraAuditTitle: "Audit Rady modelů",
    ulraAuditSummary: ({ failed, rounds, successful }) =>
      `${successful} úspěšných · ${failed} neúspěšných · ${rounds} kol kontroly`,
    ulraAuditConverged:
      "Všichni aktivní hodnotitelé výslovně dospěli ke shodě.",
    ulraAuditUnresolved:
      "Úplné shody nebylo dosaženo; ve finální odpovědi může zůstat podstatný nesouhlas.",
    ulraAuditCalls: ({ failed, retired, successful }) =>
      `Volání: ${successful} úspěšných · ${failed} neúspěšných · ${retired} účastníků vyřazeno`,
    ulraAuditReviews: ({ challenges, converged, unmarked }) =>
      `Kontroly: ${challenges} námitek · ${converged} shod · ${unmarked} bez označení`,
    ulraAuditHistory: ({ omitted, retained, tokens }) =>
      `Historie syntézy: ${retained} zachováno · ${omitted} vynecháno · ${tokens} průběžných tokenů`,
    ulraAuditRoutes: "Trasy účastníků",
    ulraAuditContract: ({ contract }) => `Pravidla syntézy: ${contract}`,
    expandUlraAudit: "Zobrazit audit Rady modelů",
    collapseUlraAudit: "Skrýt audit Rady modelů",
  }),
  pl: define({
    ulraAuditTitle: "Audyt Rady modeli",
    ulraAuditSummary: ({ failed, rounds, successful }) =>
      `${successful} udanych · ${failed} nieudanych · ${rounds} rund przeglądu`,
    ulraAuditConverged:
      "Wszyscy aktywni recenzenci wyraźnie osiągnęli zgodność.",
    ulraAuditUnresolved:
      "Nie osiągnięto pełnej zgodności; w odpowiedzi końcowej może pozostać istotna rozbieżność.",
    ulraAuditCalls: ({ failed, retired, successful }) =>
      `Wywołania: ${successful} udanych · ${failed} nieudanych · ${retired} uczestników wycofano`,
    ulraAuditReviews: ({ challenges, converged, unmarked }) =>
      `Przeglądy: ${challenges} zastrzeżeń · ${converged} zgodnych · ${unmarked} bez oznaczenia`,
    ulraAuditHistory: ({ omitted, retained, tokens }) =>
      `Historia syntezy: ${retained} zachowano · ${omitted} pominięto · ${tokens} tokenów pośrednich`,
    ulraAuditRoutes: "Trasy uczestników",
    ulraAuditContract: ({ contract }) => `Kontrakt syntezy: ${contract}`,
    expandUlraAudit: "Pokaż audyt Rady modeli",
    collapseUlraAudit: "Ukryj audyt Rady modeli",
  }),
  tr: define({
    ulraAuditTitle: "Model Konseyi denetimi",
    ulraAuditSummary: ({ failed, rounds, successful }) =>
      `${successful} başarılı · ${failed} başarısız · ${rounds} inceleme turu`,
    ulraAuditConverged: "Tüm etkin inceleyiciler açıkça uzlaştı.",
    ulraAuditUnresolved:
      "Tam uzlaşma sağlanmadı; son yanıtta önemli görüş ayrılıkları kalabilir.",
    ulraAuditCalls: ({ failed, retired, successful }) =>
      `Çağrılar: ${successful} başarılı · ${failed} başarısız · ${retired} katılımcı çıkarıldı`,
    ulraAuditReviews: ({ challenges, converged, unmarked }) =>
      `İncelemeler: ${challenges} itiraz · ${converged} uzlaşma · ${unmarked} işaretsiz`,
    ulraAuditHistory: ({ omitted, retained, tokens }) =>
      `Sentez geçmişi: ${retained} tutuldu · ${omitted} atlandı · ${tokens} ara token`,
    ulraAuditRoutes: "Katılımcı rotaları",
    ulraAuditContract: ({ contract }) => `Sentez sözleşmesi: ${contract}`,
    expandUlraAudit: "Model Konseyi denetimini göster",
    collapseUlraAudit: "Model Konseyi denetimini gizle",
  }),
  sv: define({
    ulraAuditTitle: "Modellrådsgranskning",
    ulraAuditSummary: ({ failed, rounds, successful }) =>
      `${successful} lyckade · ${failed} misslyckade · ${rounds} granskningsomgångar`,
    ulraAuditConverged: "Alla aktiva granskare nådde uttrycklig samsyn.",
    ulraAuditUnresolved:
      "Full samsyn nåddes inte; väsentlig oenighet kan finnas kvar i slutsvaret.",
    ulraAuditCalls: ({ failed, retired, successful }) =>
      `Anrop: ${successful} lyckade · ${failed} misslyckade · ${retired} deltagare togs bort`,
    ulraAuditReviews: ({ challenges, converged, unmarked }) =>
      `Granskningar: ${challenges} invändningar · ${converged} samsyn · ${unmarked} omarkerade`,
    ulraAuditHistory: ({ omitted, retained, tokens }) =>
      `Synteshistorik: ${retained} behållna · ${omitted} utelämnade · ${tokens} mellanliggande token`,
    ulraAuditRoutes: "Deltagarrutter",
    ulraAuditContract: ({ contract }) => `Synteskontrakt: ${contract}`,
    expandUlraAudit: "Visa Modellrådsgranskning",
    collapseUlraAudit: "Dölj Modellrådsgranskning",
  }),
  ur: define({
    ulraAuditTitle: "ماڈل کونسل آڈٹ",
    ulraAuditSummary: ({ failed, rounds, successful }) =>
      `${successful} کامیاب · ${failed} ناکام · ${rounds} جائزہ ادوار`,
    ulraAuditConverged: "تمام فعال جائزہ کار واضح طور پر متفق ہوئے۔",
    ulraAuditUnresolved:
      "مکمل اتفاق نہیں ہوا؛ حتمی جواب میں اہم اختلاف باقی رہ سکتا ہے۔",
    ulraAuditCalls: ({ failed, retired, successful }) =>
      `کالز: ${successful} کامیاب · ${failed} ناکام · ${retired} شرکاء ہٹائے گئے`,
    ulraAuditReviews: ({ challenges, converged, unmarked }) =>
      `جائزے: ${challenges} اعتراض · ${converged} متفق · ${unmarked} بلا نشان`,
    ulraAuditHistory: ({ omitted, retained, tokens }) =>
      `ترکیبی تاریخ: ${retained} محفوظ · ${omitted} چھوڑے گئے · ${tokens} درمیانی ٹوکن`,
    ulraAuditRoutes: "شرکاء کے راستے",
    ulraAuditContract: ({ contract }) => `ترکیبی معاہدہ: ${contract}`,
    expandUlraAudit: "ماڈل کونسل آڈٹ دکھائیں",
    collapseUlraAudit: "ماڈل کونسل آڈٹ چھپائیں",
  }),
} as const;

type CouncilAuditTranslations = {
  councilAuditTitle: UlraAuditTranslations["ulraAuditTitle"];
  councilAuditSummary: UlraAuditTranslations["ulraAuditSummary"];
  councilAuditConverged: UlraAuditTranslations["ulraAuditConverged"];
  councilAuditUnresolved: UlraAuditTranslations["ulraAuditUnresolved"];
  councilAuditCalls: UlraAuditTranslations["ulraAuditCalls"];
  councilAuditReviews: UlraAuditTranslations["ulraAuditReviews"];
  councilAuditHistory: UlraAuditTranslations["ulraAuditHistory"];
  councilAuditRoutes: UlraAuditTranslations["ulraAuditRoutes"];
  councilAuditContract: UlraAuditTranslations["ulraAuditContract"];
  expandCouncilAudit: UlraAuditTranslations["expandUlraAudit"];
  collapseCouncilAudit: UlraAuditTranslations["collapseUlraAudit"];
};

const exposeCouncilAuditTranslations = (
  value: UlraAuditTranslations,
): CouncilAuditTranslations => ({
  councilAuditTitle: value.ulraAuditTitle,
  councilAuditSummary: value.ulraAuditSummary,
  councilAuditConverged: value.ulraAuditConverged,
  councilAuditUnresolved: value.ulraAuditUnresolved,
  councilAuditCalls: value.ulraAuditCalls,
  councilAuditReviews: value.ulraAuditReviews,
  councilAuditHistory: value.ulraAuditHistory,
  councilAuditRoutes: value.ulraAuditRoutes,
  councilAuditContract: value.ulraAuditContract,
  expandCouncilAudit: value.expandUlraAudit,
  collapseCouncilAudit: value.collapseUlraAudit,
});

export const ulraAuditTranslations = Object.fromEntries(
  Object.entries(rawUlraAuditTranslations).map(([locale, value]) => [
    locale,
    exposeCouncilAuditTranslations(value),
  ]),
) as {
  [Locale in keyof typeof rawUlraAuditTranslations]: CouncilAuditTranslations;
};
