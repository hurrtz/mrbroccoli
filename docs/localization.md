# Localization

Mr Broccoli deliberately separates the app-interface language from speech and
content languages. Selecting Arabic, French, or another interface language
translates the UX; it must not silently change the language used for speech
recognition, synthesized replies, or assistant instructions.

## Add an app-interface locale

Adding a locale has two required code changes:

1. Copy `src/i18n/locales/en.ts`, translate every value, and keep all formatter
   parameters intact.
2. Register the dictionary once in `src/i18n/localeRegistry.ts`.

The registry entry owns:

- the persisted language ID;
- the self-written language name shown in the picker;
- the `Intl` locale;
- left-to-right or right-to-left direction;
- Ant Design modal, picker, and search copy;
- explicit defaults for content language, assistant instructions, and the TTS
  listen language.

Language persistence, validation, picker options, translation lookup, regional
formatting, root direction, and Ant Design locale data are all derived from
this registry. Do not add a second language allowlist or a chain of
`language === "..."` checks.

## Translation contract

English is the source dictionary and defines `TranslationKey`.
Every other dictionary must use:

```ts
export const example = {
  // ...
} satisfies TranslationDictionary;
```

TypeScript rejects:

- missing keys;
- extra or misspelled keys;
- replacing a formatter with a string or a string with a formatter.

Keep user-visible UI labels in the locale dictionaries. Do not introduce
`Record<AppLanguage, string>` label matrices in feature code. Use
`LocalizedResource<T>` only for dynamic or legacy provider/catalog material
where an intentional English fallback is acceptable.

## Translator checklist

- Translate the interface meaning, not provider or model identifiers.
- Preserve formatter parameter names exactly; the value-kind contract cannot
  detect a renamed destructured parameter.
- Keep copy concise enough for mobile controls.
- Use the language's own name in `nativeName`.
- Confirm the localized app name with a fluent speaker.
- Check mixed-direction content such as API keys, URLs, model IDs, prices, and
  provider names.
- For a right-to-left locale, set `direction: "rtl"` and visually inspect the
  home screen, every settings page, modal, picker, drawer, and navigation icon
  on both Android and iOS.

Root direction handles normal Yoga layout and text flow. It does not prove
that every deliberately positioned element or directional icon is correct;
RTL additions always require the visual audit above.

## Verification

Run the focused contract:

```sh
npm run i18n:verify
```

Before release, also run:

```sh
npm run config:verify
npm test -- --runInBand --watchman=false
```
