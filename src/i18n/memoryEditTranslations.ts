const en = {
  memoryEditHint:
    "You can correct this compact memory before it is used in future turns.",
  memorySaved: "Memory updated.",
};

type MemoryEditTranslations = typeof en;
const define = (value: MemoryEditTranslations) => value;

export const memoryEditTranslations = {
  en,
  de: define({
    memoryEditHint:
      "Du kannst diesen kompakten Speicher korrigieren, bevor er in künftigen Beiträgen verwendet wird.",
    memorySaved: "Speicher aktualisiert.",
  }),
  uk: define({
    memoryEditHint:
      "Цю стислу пам’ять можна виправити до її використання в наступних репліках.",
    memorySaved: "Пам’ять оновлено.",
  }),
  hi: define({
    memoryEditHint:
      "भविष्य के संवाद में उपयोग होने से पहले आप इस संक्षिप्त स्मृति को सुधार सकते हैं।",
    memorySaved: "स्मृति अपडेट की गई।",
  }),
  es: define({
    memoryEditHint:
      "Puedes corregir esta memoria compacta antes de que se use en turnos futuros.",
    memorySaved: "Memoria actualizada.",
  }),
  fr: define({
    memoryEditHint:
      "Vous pouvez corriger cette mémoire compacte avant son utilisation dans les prochains échanges.",
    memorySaved: "Mémoire mise à jour.",
  }),
  it: define({
    memoryEditHint:
      "Puoi correggere questa memoria compatta prima che venga usata nei turni futuri.",
    memorySaved: "Memoria aggiornata.",
  }),
  pt: define({
    memoryEditHint:
      "Pode corrigir esta memória compacta antes de ser usada em interações futuras.",
    memorySaved: "Memória atualizada.",
  }),
  ptBR: define({
    memoryEditHint:
      "Você pode corrigir esta memória compacta antes que ela seja usada nas próximas interações.",
    memorySaved: "Memória atualizada.",
  }),
  ru: define({
    memoryEditHint:
      "Эту краткую память можно исправить до её использования в следующих репликах.",
    memorySaved: "Память обновлена.",
  }),
  "zh-CN": define({
    memoryEditHint: "你可以在后续对话使用这份精简记忆前进行更正。",
    memorySaved: "记忆已更新。",
  }),
  ar: define({
    memoryEditHint:
      "يمكنك تصحيح هذه الذاكرة الموجزة قبل استخدامها في المحادثات التالية.",
    memorySaved: "تم تحديث الذاكرة.",
  }),
  ja: define({
    memoryEditHint:
      "今後のやり取りで使われる前に、この簡潔なメモリを修正できます。",
    memorySaved: "メモリを更新しました。",
  }),
  hu: define({
    memoryEditHint:
      "Kijavíthatod ezt a tömör emléket, mielőtt a későbbi fordulókban használatba kerül.",
    memorySaved: "Memória frissítve.",
  }),
  cs: define({
    memoryEditHint:
      "Tuto stručnou paměť můžete opravit dříve, než se použije v dalších odpovědích.",
    memorySaved: "Paměť aktualizována.",
  }),
  pl: define({
    memoryEditHint:
      "Możesz poprawić tę skróconą pamięć, zanim zostanie użyta w kolejnych turach.",
    memorySaved: "Pamięć zaktualizowana.",
  }),
  tr: define({
    memoryEditHint:
      "Bu kısa belleği sonraki konuşmalarda kullanılmadan önce düzeltebilirsiniz.",
    memorySaved: "Bellek güncellendi.",
  }),
  sv: define({
    memoryEditHint:
      "Du kan korrigera detta kompakta minne innan det används i framtida turer.",
    memorySaved: "Minnet har uppdaterats.",
  }),
  ur: define({
    memoryEditHint:
      "آپ اس مختصر یادداشت کو آئندہ گفتگو میں استعمال ہونے سے پہلے درست کر سکتے ہیں۔",
    memorySaved: "یادداشت اپ ڈیٹ ہو گئی۔",
  }),
} as const;
