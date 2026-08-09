// Copy for the orb composition on the home screen.
//
// Only the strings the workspace could not already say. The phase words
// (`listening`, `parsing`, `thinking`, `searching`, `speaking`), the satellite
// labels (`addImage`, `ulraMode`, `webSearch`) and `showTranscript` already
// exist and are reused rather than restated here.
//
// The orb's names say what tapping does, not what the machine is doing: the
// phase is already carried by the ring colour and stated in words by the status
// line beside it. A name that only described the machine would leave a
// screen-reader user with nothing to act on.
//
// Counted strings follow the app's existing convention of a colon form in
// languages with complex plural agreement, so no locale has to inflect a noun
// against a number.

import type { TranslationParams } from "./types";

const rawWorkspaceTranslations = {
  en: {
    voiceOrbRecordingLabel: "Listening. Tap to stop.",
    voiceOrbSpeakingLabel: "Speaking. Tap to stop.",
    transcriptHandleEmpty: "No messages yet",
    transcriptHandleEmptyLabel: "Show transcript. No messages yet.",
    transcriptHandleLabel: ({ count }: TranslationParams) =>
      `Show transcript. Messages: ${count}`,
    conversationSettingsLabel: "Conversation settings",
  },
  ar: {
    voiceOrbRecordingLabel: "يستمع. اضغط للإيقاف.",
    voiceOrbSpeakingLabel: "يتحدث. اضغط للإيقاف.",
    transcriptHandleEmpty: "لا رسائل بعد",
    transcriptHandleEmptyLabel: "إظهار النص. لا رسائل بعد.",
    transcriptHandleLabel: ({ count }: TranslationParams) =>
      `إظهار النص. الرسائل: ${count}`,
    conversationSettingsLabel: "إعدادات المحادثة",
  },
  cs: {
    voiceOrbRecordingLabel: "Poslouchám. Klepnutím zastavíte.",
    voiceOrbSpeakingLabel: "Mluvím. Klepnutím zastavíte.",
    transcriptHandleEmpty: "Zatím žádné zprávy",
    transcriptHandleEmptyLabel: "Zobrazit přepis. Zatím žádné zprávy.",
    transcriptHandleLabel: ({ count }: TranslationParams) =>
      `Zobrazit přepis. Zpráv: ${count}`,
    conversationSettingsLabel: "Nastavení konverzace",
  },
  de: {
    voiceOrbRecordingLabel: "Hört zu. Zum Beenden tippen.",
    voiceOrbSpeakingLabel: "Spricht. Zum Beenden tippen.",
    transcriptHandleEmpty: "Noch keine Nachrichten",
    transcriptHandleEmptyLabel:
      "Transkript anzeigen. Noch keine Nachrichten.",
    transcriptHandleLabel: ({ count }: TranslationParams) =>
      `Transkript anzeigen. Nachrichten: ${count}`,
    conversationSettingsLabel: "Einstellungen der Konversation",
  },
  es: {
    voiceOrbRecordingLabel: "Escuchando. Toca para detener.",
    voiceOrbSpeakingLabel: "Hablando. Toca para detener.",
    transcriptHandleEmpty: "Aún no hay mensajes",
    transcriptHandleEmptyLabel:
      "Mostrar la transcripción. Aún no hay mensajes.",
    transcriptHandleLabel: ({ count }: TranslationParams) =>
      `Mostrar la transcripción. Mensajes: ${count}`,
    conversationSettingsLabel: "Ajustes de la conversación",
  },
  fr: {
    voiceOrbRecordingLabel: "À l'écoute. Touchez pour arrêter.",
    voiceOrbSpeakingLabel: "Parle. Touchez pour arrêter.",
    transcriptHandleEmpty: "Aucun message pour l'instant",
    transcriptHandleEmptyLabel:
      "Afficher la transcription. Aucun message pour l'instant.",
    transcriptHandleLabel: ({ count }: TranslationParams) =>
      `Afficher la transcription. Messages : ${count}`,
    conversationSettingsLabel: "Réglages de la conversation",
  },
  hi: {
    voiceOrbRecordingLabel: "सुन रहा है. रोकने के लिए टैप करें.",
    voiceOrbSpeakingLabel: "बोल रहा है. रोकने के लिए टैप करें.",
    transcriptHandleEmpty: "अभी कोई संदेश नहीं",
    transcriptHandleEmptyLabel: "प्रतिलेख दिखाएँ. अभी कोई संदेश नहीं.",
    transcriptHandleLabel: ({ count }: TranslationParams) =>
      `प्रतिलेख दिखाएँ. संदेश: ${count}`,
    conversationSettingsLabel: "बातचीत की सेटिंग",
  },
  hu: {
    voiceOrbRecordingLabel: "Hallgat. Koppintson a leállításhoz.",
    voiceOrbSpeakingLabel: "Beszél. Koppintson a leállításhoz.",
    transcriptHandleEmpty: "Még nincs üzenet",
    transcriptHandleEmptyLabel: "Átirat megjelenítése. Még nincs üzenet.",
    transcriptHandleLabel: ({ count }: TranslationParams) =>
      `Átirat megjelenítése. Üzenetek: ${count}`,
    conversationSettingsLabel: "A beszélgetés beállításai",
  },
  it: {
    voiceOrbRecordingLabel: "In ascolto. Tocca per fermare.",
    voiceOrbSpeakingLabel: "Sta parlando. Tocca per fermare.",
    transcriptHandleEmpty: "Ancora nessun messaggio",
    transcriptHandleEmptyLabel:
      "Mostra la trascrizione. Ancora nessun messaggio.",
    transcriptHandleLabel: ({ count }: TranslationParams) =>
      `Mostra la trascrizione. Messaggi: ${count}`,
    conversationSettingsLabel: "Impostazioni della conversazione",
  },
  ja: {
    voiceOrbRecordingLabel: "聞いています。タップで停止します。",
    voiceOrbSpeakingLabel: "話しています。タップで停止します。",
    transcriptHandleEmpty: "メッセージはまだありません",
    transcriptHandleEmptyLabel:
      "記録を表示します。メッセージはまだありません。",
    transcriptHandleLabel: ({ count }: TranslationParams) =>
      `記録を表示します。メッセージ: ${count}`,
    conversationSettingsLabel: "会話の設定",
  },
  pl: {
    voiceOrbRecordingLabel: "Słucham. Dotknij, aby zatrzymać.",
    voiceOrbSpeakingLabel: "Mówię. Dotknij, aby zatrzymać.",
    transcriptHandleEmpty: "Brak wiadomości",
    transcriptHandleEmptyLabel: "Pokaż zapis. Brak wiadomości.",
    transcriptHandleLabel: ({ count }: TranslationParams) =>
      `Pokaż zapis. Wiadomości: ${count}`,
    conversationSettingsLabel: "Ustawienia rozmowy",
  },
  pt: {
    voiceOrbRecordingLabel: "A ouvir. Toque para parar.",
    voiceOrbSpeakingLabel: "A falar. Toque para parar.",
    transcriptHandleEmpty: "Ainda sem mensagens",
    transcriptHandleEmptyLabel: "Mostrar a transcrição. Ainda sem mensagens.",
    transcriptHandleLabel: ({ count }: TranslationParams) =>
      `Mostrar a transcrição. Mensagens: ${count}`,
    conversationSettingsLabel: "Definições da conversa",
  },
  ptBR: {
    voiceOrbRecordingLabel: "Ouvindo. Toque para parar.",
    voiceOrbSpeakingLabel: "Falando. Toque para parar.",
    transcriptHandleEmpty: "Ainda sem mensagens",
    transcriptHandleEmptyLabel: "Mostrar a transcrição. Ainda sem mensagens.",
    transcriptHandleLabel: ({ count }: TranslationParams) =>
      `Mostrar a transcrição. Mensagens: ${count}`,
    conversationSettingsLabel: "Configurações da conversa",
  },
  ru: {
    voiceOrbRecordingLabel: "Слушаю. Коснитесь, чтобы остановить.",
    voiceOrbSpeakingLabel: "Говорю. Коснитесь, чтобы остановить.",
    transcriptHandleEmpty: "Сообщений пока нет",
    transcriptHandleEmptyLabel: "Показать расшифровку. Сообщений пока нет.",
    transcriptHandleLabel: ({ count }: TranslationParams) =>
      `Показать расшифровку. Сообщений: ${count}`,
    conversationSettingsLabel: "Настройки разговора",
  },
  sv: {
    voiceOrbRecordingLabel: "Lyssnar. Tryck för att stoppa.",
    voiceOrbSpeakingLabel: "Talar. Tryck för att stoppa.",
    transcriptHandleEmpty: "Inga meddelanden än",
    transcriptHandleEmptyLabel: "Visa utskriften. Inga meddelanden än.",
    transcriptHandleLabel: ({ count }: TranslationParams) =>
      `Visa utskriften. Meddelanden: ${count}`,
    conversationSettingsLabel: "Inställningar för samtalet",
  },
  tr: {
    voiceOrbRecordingLabel: "Dinliyor. Durdurmak için dokunun.",
    voiceOrbSpeakingLabel: "Konuşuyor. Durdurmak için dokunun.",
    transcriptHandleEmpty: "Henüz mesaj yok",
    transcriptHandleEmptyLabel: "Dökümü göster. Henüz mesaj yok.",
    transcriptHandleLabel: ({ count }: TranslationParams) =>
      `Dökümü göster. Mesaj: ${count}`,
    conversationSettingsLabel: "Konuşma ayarları",
  },
  uk: {
    voiceOrbRecordingLabel: "Слухаю. Торкніться, щоб зупинити.",
    voiceOrbSpeakingLabel: "Говорю. Торкніться, щоб зупинити.",
    transcriptHandleEmpty: "Повідомлень ще немає",
    transcriptHandleEmptyLabel: "Показати розшифровку. Повідомлень ще немає.",
    transcriptHandleLabel: ({ count }: TranslationParams) =>
      `Показати розшифровку. Повідомлень: ${count}`,
    conversationSettingsLabel: "Налаштування розмови",
  },
  ur: {
    voiceOrbRecordingLabel: "سن رہا ہے۔ روکنے کے لیے ٹیپ کریں۔",
    voiceOrbSpeakingLabel: "بول رہا ہے۔ روکنے کے لیے ٹیپ کریں۔",
    transcriptHandleEmpty: "ابھی کوئی پیغام نہیں",
    transcriptHandleEmptyLabel: "نقل دکھائیں۔ ابھی کوئی پیغام نہیں۔",
    transcriptHandleLabel: ({ count }: TranslationParams) =>
      `نقل دکھائیں۔ پیغامات: ${count}`,
    conversationSettingsLabel: "گفتگو کی ترتیبات",
  },
  "zh-CN": {
    voiceOrbRecordingLabel: "正在聆听。点按即可停止。",
    voiceOrbSpeakingLabel: "正在朗读。点按即可停止。",
    transcriptHandleEmpty: "还没有消息",
    transcriptHandleEmptyLabel: "显示记录。还没有消息。",
    transcriptHandleLabel: ({ count }: TranslationParams) =>
      `显示记录。消息：${count}`,
    conversationSettingsLabel: "对话设置",
  },
} as const;

export const workspaceTranslations = rawWorkspaceTranslations;
