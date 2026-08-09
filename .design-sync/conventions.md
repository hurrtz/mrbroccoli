# Building with Mr Broccoli

Mr Broccoli is a voice-first mobile chat app. This library is its **React
Native** design system, compiled for the browser with react-native-web. That
one fact drives everything below: there are **no CSS classes and no
`className`**. Every component styles itself in JavaScript, and so must you.

## Wrap every design in the provider chain

All four providers are exported from the library. Two of them **throw** rather
than degrade, so a design without them renders nothing:

```jsx
const { ThemeProvider, LocalizationProvider, SafeAreaProvider,
        PremiumEntitlementProvider } = window.MrBroccoli;

<ThemeProvider mode="dark">                    {/* every control reads useTheme() */}
  <LocalizationProvider language="en">         {/* throws if missing */}
    <SafeAreaProvider>                         {/* Modal reads insets; throws if missing */}
      <PremiumEntitlementProvider>             {/* only PremiumUpgradeModal needs it */}
        {/* your screen */}
      </PremiumEntitlementProvider>
    </SafeAreaProvider>
  </LocalizationProvider>
</ThemeProvider>
```

`mode` is `"dark" | "light" | "system"`. **The app is dark-first** — build on
`darkColors.background` unless asked otherwise. On a light page, transparent
controls (a ghost `Button`) are nearly invisible without that canvas behind
them.

## Style with objects, not classes

Layout comes from the re-exported React Native primitives — `View`, `Text`,
`ScrollView`, `Pressable`, `Image`, `StyleSheet`. **All text must be inside
`<Text>`**; a bare string in a `View` is not styleable and may not render.

Colors and type come from the same source the components use, exported as
`darkColors`, `lightColors`, `fonts`, and `textStyles`:

| Token group | Real names |
| --- | --- |
| Surfaces | `background` `surface` `surfaceAlt` `surfaceElevated` `surfaceRaised` `surfaceRaisedBorder` |
| Text | `text` `textSecondary` `textMuted` |
| Accent / state | `accent` `accentSoft` `activeControl` `onActiveControl` `success` `danger` `dangerFill` `onAccent` `onDanger` |
| Lines | `border` `borderStrong` `inactiveControlBorder` `overlay` |
| Chat | `bubbleUser` `bubbleAssistant` |
| Type roles (`textStyles.*`) | `screenTitle` `sectionTitle` `subsectionTitle` `body` `supporting` `caption` `controlLabel` `controlValue` `action` `compactAction` `metadata` |
| Families (`fonts.*`) | `headline` `display` `displayHeavy` `body` `bodyMedium` `mono` |

Pick a **type role by meaning**, then add only layout locally — that is the
system's own rule, and `textStyles` already carries family, size, line height,
weight, and letter spacing:

```jsx
<Text style={{ ...textStyles.sectionTitle, color: darkColors.text }}>Speech</Text>
```

The same palette and scale are also published as CSS custom properties for any
plain-CSS glue you write: `--mb-color-*` (follows the viewer's scheme),
`--mb-light-*` / `--mb-dark-*` (explicit), `--mb-font-*`, and
`--mb-text-<role>-{family,size,line-height,weight}`. The components do **not**
read these — they are there so your own markup can match instead of guessing.

## Composition rules that are easy to get wrong

- **`Button` does not style its children.** Use `<AntButtonLabel color icon
  label />` inside it, or a bare `<PhosphorIcon>` for an icon-only action. Pick
  `color` to match the surface: `onActiveControl` on `type="primary"`, `accent`
  on `ghost`, `onDanger` on `warning`.
- **Icons are `PhosphorIcon` only**, with a `name` from its fixed set and a
  semantic `size` (`inline` `compact` `control` `navigation` `prominent`
  `feature` `hero`) — never a raw pixel number. The nine provider brand marks
  are the one exception, via `ProviderIcon`.
- **Containers need children.** `AntPickerRows`, `List`, and `ChatTranscript`
  render what you put in them and nothing on their own.
- **Compounds are namespaced**: `Input.TextArea`, `List.Item`,
  `List.Item.Brief`.
- **Keep touch targets at least 44×44 points**, and give every icon-only
  control an `accessibilityLabel`.

## Where the truth is

Read these before styling — they beat any summary here:

- `_ds/<folder>/styles.css` and its imports — the shipped tokens and fonts.
- `components/<group>/<Name>/<Name>.d.ts` — the real prop contract.
- `components/<group>/<Name>/<Name>.prompt.md` — per-component usage.
- `guidelines/product-experience-redesign.md` — the product's visual system.
- `guidelines/native-controls.md` — the control system's contract.

## A worked example

```jsx
const { View, Text, Button, AntButtonLabel, AntSettingsCard,
        darkColors, textStyles } = window.MrBroccoli;

<View style={{ backgroundColor: darkColors.background, padding: 16, gap: 12 }}>
  <Text style={{ ...textStyles.screenTitle, color: darkColors.text }}>
    Speech
  </Text>
  <AntSettingsCard title="Voice replies">
    <Text style={{ ...textStyles.supporting, color: darkColors.textSecondary }}>
      Mr Broccoli reads answers aloud in the languages you pick.
    </Text>
  </AntSettingsCard>
  <Button type="primary" onPress={() => {}}>
    <AntButtonLabel
      color={darkColors.onActiveControl}
      icon="sound"
      label="Preview voice"
    />
  </Button>
</View>
```
