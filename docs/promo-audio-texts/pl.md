# Promo audio — Polski (`pl`)

Spoken examples for the intro sheet.

Each language ships one clip as a store-hosted asset pack — Background
Assets on iOS, Play Asset Delivery on Android — fetched only when a user
asks to hear it. See
[`src/services/introAssetPacks/SPEC.md`](../../src/services/introAssetPacks/SPEC.md).

The first five prompts were each answered by a different frontier model, so
the set demonstrates range rather than one vendor. The sixth is written for
the app and is the one that ships in the intro sheet.

Conventions that matter once this is spoken aloud:

- The product name is **Mr Broccoli**, never "Mr. Broccoli". The period
  creates an unwanted pause in speech.
- Text is written for the ear: no lists, no markup, nothing that reads oddly
  when read out.
- Recordings are generated from the approved text here. Audio is invisible to
  a diff, so a mistranslation inside a clip cannot be caught by reading one —
  this file is where the wording gets reviewed.
- Word counts are not comparable across languages. Turkish and the Slavic
  languages say the same thing in far fewer, longer words than English; Hindi
  and Urdu in more. Match the spoken **duration** of the other clips, not the
  count — and do not pad a text to hit a number.

---

## 1. Electricity

**Model:** OpenAI `gpt-5.6-sol`

**Prompt**

> Wyjaśnij mi, jak prąd naprawdę dociera z elektrowni aż do mojej kuchni.

**Answer**

_Not generated yet._

---

## 2. Unfinished projects

**Model:** Anthropic `claude-fable-5`

**Prompt**

> Ciągle zaczynam projekty i nigdy ich nie kończę. Z czego to wynika i co naprawdę pomaga?

**Answer**

_Not generated yet._

---

## 3. Job offer

**Model:** DeepSeek `deepseek-v4-pro`

**Prompt**

> Dostałem propozycję lepiej płatnej pracy, ale musiałbym się wyprowadzić daleko od przyjaciół. Pomóż mi to przemyśleć.

**Answer**

_Not generated yet._

---

## 4. Cooking

**Model:** Google `gemini-3.6-flash`

**Prompt**

> Dziś wieczorem gotuję dla sześciu osób, a jedna nie je nabiału. Pomyśl ze mną, co przygotować.

**Answer**

_Not generated yet._

---

## 5. Words for the same thing

**Model:** xAI `grok-4.5`

**Prompt**

> Dlaczego niektóre języki mają tyle słów na jedną i tę samą rzecz?

**Answer**

_Not generated yet._

---

## 6. How the app works

**Model:** written for this app, not model-generated

**Prompt**

> Jak właściwie działa ta aplikacja?

**Answer** (406 words)

Mówisz, a Mr Broccoli zamienia to, co powiedziałeś, na tekst, wysyła do modelu, który wybrałeś, i odczytuje ci odpowiedź na głos. To cała pętla. Różnica polega na tym, że to ty decydujesz, co siedzi pośrodku, i nic z tej decyzji nie jest przed tobą ukrywane.

Napędzić to można na trzy sposoby, i są to naprawdę różne kompromisy, a nie poziomy tego samego.

Pierwszy to użyć klucza od dostawcy, którego już masz: OpenAI, Anthropic, Google i kilku innych. Dostajesz ich najlepsze modele, dokładnie te same, które miałbyś w ich własnych aplikacjach, i płacisz bezpośrednio im za to, czego używasz. Mr Broccoli nigdy nie dotyka tych pieniędzy i nic do nich nie dolicza.

Drugi to pobrać modele, które działają w całości na tym telefonie. Za pierwszym razem trochę to trwa i zajmuje miejsce, ale potem nie kosztuje absolutnie nic i działa bez zasięgu: w samolocie, w metrze, gdziekolwiek. Te modele są mniejsze niż te w chmurze, więc słabiej radzą sobie z trudnym rozumowaniem. Aplikacja mówi ci to wprost, zamiast udawać, że jest inaczej.

Trzeci to po prostu głos, który twój telefon już ma, dostępny od chwili instalacji.

Możesz je mieszać. Czołowy model myśli, a głos twojego telefonu czyta. Albo model lokalny z naprawdę dobrym głosem. Myślenie i mówienie to osobne wybory.

Co do prywatności, oto wersja dokładna zamiast wygodnej. Twoje rozmowy są przechowywane na tym urządzeniu i nigdzie nie istnieje żaden serwer Mr Broccoli. Żadnego konta, żadnej synchronizacji, niczego, co mogłoby wyciec. Ale kiedy używasz modelu w chmurze, to, co mówisz, trafia do tego dostawcy, na jego warunkach, dokładnie tak samo jak w jego własnej aplikacji. Ta aplikacja gwarantuje, że trafia tam i nigdzie indziej, i że przy każdej pojedynczej wiadomości widzisz, która droga na nią odpowiedziała.

Ostatnia rzecz warta wiedzy: Mr Broccoli woli mieć rację niż być szybki. Większość asystentów głosowych po cichu przełącza cię na słabszy model, żeby odpowiedź przyszła wcześniej, a ty nigdy się o tym nie dowiadujesz. Ten tego nie robi. Jeśli poprosisz o przemyślaną odpowiedź, weźmie tyle czasu, ile przemyślana odpowiedź wymaga, i przez ten czas pokazuje ci, co robi: myśli, szuka, mówi. Zamiast zostawiać cię z ciszą i kręcącym się kółkiem. Przerwać możesz w każdej chwili. Możesz też zadać to samo pytanie jeszcze raz innemu modelowi i porównać obie odpowiedzi.

I nic z tego nie jest przypisane na stałe. Dostawcę, model albo głos możesz zmienić w dowolnym momencie, nawet w środku rozmowy, a rozmowa po prostu toczy się dalej z nowym wyborem.

---
