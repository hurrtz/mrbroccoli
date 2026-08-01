# Native control system

Mr Broccoli owns its common React Native controls. The former
`@ant-design/react-native` dependency was removed to keep the runtime graph
small, current, and independent of its obsolete `react-native-codegen`
dependency.

## Architecture

- `src/design-system/NativeControls.tsx` provides shared buttons, inputs,
  lists, dialogs, and tags.
- `src/features/settings/settings-primitives/` provides settings cards,
  disclosures, pickers, radio groups, switches, and fields.
- `src/features/settings/AntSettingsPrimitives.tsx` is a compatibility barrel.
  The historical `Ant` component prefixes remain temporarily to avoid a broad,
  behavior-neutral rename.
- `src/design-system/PhosphorIcon.tsx` is the only application glyph entry
  point. Provider marks remain dedicated brand assets.
- `src/design-system/AppFontProvider.tsx` loads Outfit and Unica One without a
  third-party component provider.

## Contract

- Interactive controls expose an accessibility role, state, and label where
  visible text is insufficient.
- Icon-only actions retain at least a 44-point touch target.
- Pickers use a native modal owned by the application so they cannot render
  behind the Settings surface on affected Android devices.
- Light and dark colors come only from `ThemeContext`.
- User-visible copy comes from the application localization dictionary.
- Standard controls use Outfit. Unica One remains limited to the wordmark and
  major screen titles.

## Verification

Run the focused component coverage after changing shared controls:

```sh
npx jest __tests__/components/SettingsModal.test.tsx \
  __tests__/components/AntSettingsPrimitives.test.tsx \
  __tests__/components/DataPrivacySettingsPage.test.tsx \
  __tests__/design-system/NativeControls.test.tsx \
  --runInBand --watchman=false
```

Also run `npm run static:verify` and `npm run typecheck` before committing.
