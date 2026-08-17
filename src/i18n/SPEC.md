---
status: active
code_paths:
  - src/i18n/**
  - src/context/LocalizationContext.tsx
dependencies:
  - src/constants/speechLanguages.ts
validations:
  - npm run i18n:verify
  - npm test -- --runInBand --watchman=false
provenance:
  intent: source-backfilled
  validation: source-and-test-backed
last_validated_sha: 7db5c94
---

# Localization Specification

## Purpose

Every registered interface locale is a first-class product surface. The
localization layer owns interface copy, locale metadata, text direction,
formatting locale, default voice-assistant instructions, and initial speech
language defaults.

## Registry Contract

`localeRegistry.ts` is the only interface-locale registration point. It
currently registers:

`en`, `de`, `uk`, `hi`, `es`, `fr`, `it`, `pt`, `pt-BR`, `ru`, `zh-CN`, `ar`,
`ja`, `hu`, `cs`, `pl`, `tr`, `sv`, and `ur`.

Each registration provides a native display name, `Intl` locale, complete
translation dictionary, localized default assistant instruction, initial
spoken-reply language, and direction. Arabic and Urdu are RTL; all other
registered locales are LTR.

**Decision:** App language, listening language, and spoken-reply language are
independent persisted choices. Changing the interface locale may supply an
initial default, but must not permanently couple those settings.

## Dictionary Contract

- `TranslationDictionary` is structurally derived from English. Every locale
  must implement the same key and value shape.
- User-visible strings belong in translation dictionaries, not conditional
  language checks inside components.
- Large shared features may define a typed translation module and spread it
  into every locale. This keeps a feature's copy reviewable without weakening
  dictionary completeness.
- `workspaceTranslations.ts` owns the route header, orb satellite and
  transport labels, attachment-popover copy, and the conversation-settings
  sentence. That sentence prefixes the localized Hands free state only while
  the session loop is enabled; otherwise it remains Length / Tone / Voice.
- Interpolation placeholders and plural/select shapes must remain consistent
  across locales.
- Product spelling remains “Mr Broccoli” in every locale unless a deliberate
  transliteration decision is recorded.
- Mr Broccoli refers to himself in the first person, and each locale addresses
  the reader in its natural informal singular register. Prefer native idiom and
  script-specific punctuation over a literal rendering of English structure.
- Provider and model brand names are not translated unless the brand supplies
  a localized name.
- Runtime copy does not describe store purchasing. Paid-app pricing and
  ownership belong to App Store and Google Play metadata, not in-app strings.

## Direction and Layout

Text direction comes from the locale registry and is exposed by the
localization context. Components must use logical layout and alignment where
direction matters. RTL validation includes order, icons whose meaning depends
on direction, truncation, modal placement, and gesture behavior—not only text
alignment.

## Speech and Content Defaults

The localized default assistant instruction is part of the product's spoken
voice and must stay natural, concise, and formatting-free. The default content
language may differ from the UI locale only through an explicit registry rule.
Provider-specific supported-language checks remain in speech/provider
constants; the interface registry must not claim runtime capability by itself.

## Change Checklist

When adding or changing user-facing copy:

1. update every registered dictionary or its shared typed feature module;
2. preserve interpolation and value shape;
3. check Arabic and Urdu direction where layout is affected;
4. update listening/TTS metadata only when runtime support exists;
5. run `npm run i18n:verify`; and
6. include all locales in Maestro release and store-promo coverage where the
   surface is exercised.

See [`../../docs/localization.md`](../../docs/localization.md) for the focused
translation workflow and [`../constants/providers/SPEC.md`](../constants/providers/SPEC.md)
for provider language capability ownership.
