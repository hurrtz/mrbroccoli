import type { AppLanguage } from "../../i18n/localeRegistry";

/**
 * Spoken scripts for the intro audio examples.
 *
 * These are content, not interface copy, so they live here rather than in the
 * locale dictionaries: a language gets a script when its clip is recorded, and
 * the structural parity the dictionaries enforce would otherwise demand
 * nineteen translations of a five-hundred-word text before the first recording
 * exists.
 *
 * Keeping them checked in is the point. Audio is invisible to a diff, so a
 * mistranslation baked into a recording cannot be caught by reading one. The
 * recording is generated from the approved text here, which means the wording
 * stays reviewable even though the audio is not.
 *
 * The product name is written "Mr Broccoli" throughout, never "Mr. Broccoli" --
 * the period creates an unwanted pause in spoken output, and these scripts
 * exist to be spoken.
 */
export const INTRO_SCRIPTS: Partial<Record<AppLanguage, string>> = {
  en: `When you speak, Mr Broccoli turns what you said into text, sends it to the model you picked, and reads the answer back to you. That is the whole loop. What makes it different is that you choose what sits in the middle, and nothing about that choice is hidden from you.

There are three ways to power it, and they are genuinely different trades rather than tiers of the same thing.

The first is to use a key from a provider you already have — OpenAI, Anthropic, Google, and several others. You get their best models, the same ones you would get in their own apps, and you pay them directly for what you use. Mr Broccoli never touches that money and never marks it up.

The second is to download models that run entirely on this phone. That takes a while the first time and some storage, but afterwards it costs nothing at all and works with no signal — on a plane, underground, anywhere at all. These models are smaller than the hosted ones, so they are less capable on hard reasoning. The app tells you that rather than pretending otherwise.

The third is simply the voice your phone already has, which works from the moment you install.

You can mix them. A frontier model doing the thinking, with your phone's own voice reading it out. Or a local model with a premium voice. Thinking and speaking are separate choices.

On privacy, here is the precise version rather than the comfortable one. Your conversations are stored on this device, and there is no Mr Broccoli server anywhere. No account, no sync, nothing to breach. But when you use a hosted model, what you say goes to that provider, under their terms, exactly as it would in their own app. What this app guarantees is that it goes there and nowhere else, and that you can see which route answered every single message.

The last thing worth knowing is that Mr Broccoli would rather be right than fast. Most voice assistants quietly switch you to a weaker model so the reply arrives quickly, and you never find out it happened. This one does not. If you ask for a considered answer, it takes the time a considered answer takes, and it shows you what it is doing while it does it — thinking, searching, speaking — instead of leaving you with silence and a spinner. You can interrupt whenever you want. You can also ask the same question again on a different model and compare the two side by side.

And none of it is locked in. You can change the provider, the model, or the voice at any time, even in the middle of a conversation, and the conversation simply carries on with the new one.`,
  de: `Wenn du sprichst, wandelt Mr Broccoli das Gesagte in Text um, schickt es an das Modell, das du ausgewählt hast, und liest dir die Antwort vor. Das ist der ganze Ablauf. Der Unterschied liegt darin, dass du bestimmst, was in der Mitte sitzt — und dass nichts an dieser Entscheidung vor dir verborgen bleibt.

Es gibt drei Möglichkeiten, das Ganze anzutreiben, und das sind wirklich unterschiedliche Kompromisse und nicht einfach Abstufungen derselben Sache.

Die erste ist ein Schlüssel von einem Anbieter, bei dem du ohnehin schon bist — OpenAI, Anthropic, Google und einige andere. Du bekommst deren beste Modelle, dieselben wie in deren eigenen Apps, und du zahlst direkt dort für das, was du nutzt. Mr Broccoli fasst dieses Geld nie an und schlägt nichts drauf.

Die zweite sind Modelle, die du herunterlädst und die vollständig auf diesem Telefon laufen. Das dauert beim ersten Mal eine Weile und braucht Speicherplatz, aber danach kostet es überhaupt nichts mehr und funktioniert ganz ohne Empfang — im Flugzeug, in der U-Bahn, einfach überall. Diese Modelle sind kleiner als die gehosteten und damit schwächer, wenn es wirklich ums Denken geht. Die App sagt dir das, statt so zu tun, als wäre es anders.

Die dritte ist schlicht die Stimme, die dein Telefon schon mitbringt. Die funktioniert ab dem Moment, in dem du die App installierst.

Du kannst das auch mischen. Ein Spitzenmodell übernimmt das Denken, und die Stimme deines Telefons liest vor. Oder ein lokales Modell mit einer hochwertigen Stimme. Denken und Sprechen sind getrennte Entscheidungen.

Zum Thema Datenschutz die genaue Antwort statt der bequemen. Deine Gespräche liegen auf diesem Gerät, und es gibt nirgendwo einen Server von Mr Broccoli. Kein Konto, keine Synchronisierung, nichts, das gehackt werden könnte. Wenn du aber ein gehostetes Modell nutzt, geht das Gesagte an diesen Anbieter, zu dessen Bedingungen, genau wie in dessen eigener App. Was diese App garantiert, ist: Es geht dorthin und sonst nirgendwohin, und du kannst bei jeder einzelnen Nachricht sehen, welcher Weg sie beantwortet hat.

Und noch etwas ist wichtig: Mr Broccoli ist lieber richtig als schnell. Die meisten Sprachassistenten schalten dich still und leise auf ein schwächeres Modell um, damit die Antwort schneller kommt, und du erfährst nie davon. Diese App macht das nicht. Wenn du eine durchdachte Antwort willst, nimmt sie sich die Zeit, die eine durchdachte Antwort braucht — und sie zeigt dir dabei, was gerade passiert: denken, suchen, sprechen. Statt Stille und einem Ladekreis. Du kannst jederzeit unterbrechen. Und du kannst dieselbe Frage noch einmal an ein anderes Modell stellen und beide Antworten nebeneinander vergleichen.

Festgelegt bist du auf nichts davon. Du kannst Anbieter, Modell oder Stimme jederzeit wechseln, auch mitten im Gespräch — und das Gespräch läuft mit der neuen Wahl einfach weiter.`,
};

export function getIntroScript(language: AppLanguage) {
  return INTRO_SCRIPTS[language] ?? null;
}
