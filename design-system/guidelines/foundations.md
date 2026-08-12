# Foundations

The visual rules everything else follows. Token values live in `tokens/`; the specimen cards beside this file render them; this document says what they mean.

## Two equal appearances

Light and dark are equal citizens, chosen by the user, defaulting to the OS. Neither is "the" design. Read `--mb-color-*` and let the active theme resolve it; the explicit `--mb-light-*` / `--mb-dark-*` ladders exist only for specimens that must show both at once. Set `data-theme="dark"` on any ancestor to flip that subtree.

Light is a warm off-white canvas `#FCFBF8` — never pure white. Dark is a warm near-black `#16181D` — never true black. In dark, surfaces step **up** in lightness (`#1D2025` → `#262B33`) because a shadow on a near-black canvas is invisible. Both appearances lean on hairline borders far more than on elevation.

**Contrast is checked against the surface a colour actually sits on**, in both appearances: 4.5:1 for text, 3:1 for meaning-carrying graphics. Every contrast failure found during this system's construction was in dark, and every one was a colour tuned against the canvas reused on a tinted surface.

## One accent

Green — `#44A055` light, `#5DC17D` dark — marks the active route, the primary action and confirmation. It is an accent, not a fill. **If a screen looks green, something is wrong.** Secondary text is a muted blue-grey (`#5D6B7A` / `#8B97A8`). Red is destructive and error only. Gold is Premium — one colour for paid capability everywhere.

Two deliberate exceptions:

1. **The voice pipeline.** Each phase owns a colour — recording, transcribing, thinking briefly, searching, thinking, synthesizing, speaking — so progress is legible without reading. The ramp is a palindrome ("bookends"): green at both ends because green means *you* — you are talking, then being talked to. Between them the machine travels one way through teal, blue and indigo to violet at the deepest thinking, then returns through teal as speech is prepared. The sequence is **authored twice**, not brightened for dark: denser and darker on the off-white, lighter and more luminous on the near-black. Take the hexes verbatim from `tokens/colors.css`. Recording also differs in **technique** per appearance — a dark wash in light, a solid darker green in dark. The surface behind a phase colour takes whichever of near-black or white measures higher contrast.
2. **The intro banner.** Violet `#5B21B6`, fixed in both appearances — see `surfaces/intro.md`.

## Type

Unica One carries headlines: `screenTitle` 26/32 at −0.25 tracking (the wordmark), `sectionTitle` 18/24 at −0.1. Outfit carries everything else at 400/500/600/700. Monospace is reserved for control labels and metadata — uppercase, letter-spaced 0.75, 11px — and for timestamps and token counts.

Choose a role by meaning first, then add layout: `screenTitle`, `sectionTitle`, `subsectionTitle`, `body`, `supporting`, `caption`, `controlLabel`, `controlValue`, `action`, `compactAction`, `metadata` — each already carries family, size, line-height, weight and tracking.

The two special faces never stack: where the wordmark sits directly above a card title, that title drops to Outfit.

Fonts are the real shipping binaries — Unica One 400, Outfit 400/500/600/700 — in `assets/fonts/`. Monospace resolves to Menlo on iOS, the platform monospace elsewhere, the system mono stack on web.

## Shape

Modest, never pill-shaped and never sharp. Messages 6, tags 8, controls and rows 10, cards and icon buttons 12, panels 14, dialogs 16, the voice stage 17, picker modals 18, sheets 20 on the top corners only, the style sheet 24. The few genuinely round shapes are round because the shape *is* the control: the 42pt phase-icon well, the 34pt caret well in `Picker`, the 22pt readiness circles. Pills (999) appear only on three small badges — the compact wordmark, the live pill, the "free edition" badge.

## Borders, elevation and shadow

Hairline borders do the separating: `--mb-color-border` default, `--mb-color-border-strong` for a selected or emphasised edge. Shadows are a whisper and never the thing that separates a surface: dialogs `0 8 24` at 8–24% of a near-transparent glow, sheets the same cast upward, toasts `0 18 18`. Cards on a page carry **no** shadow.

## Backgrounds

Flat colour. No gradients, imagery, patterns, textures, blur or translucency except the modal overlay (`rgba(13,15,18,0.46)` light, `rgba(0,0,0,0.72)` dark) and the recording fill. The only image in the product is the app icon, and it never appears inside the app.

## Motion

Short, functional, cancellable, skipped entirely under reduce motion. Sheets rise and fall symmetrically over 220ms on a cubic ease. Toasts fade and drop 20px over 200ms. The voice bar cross-fades its phase colour over 280ms. Progress arcs and recording fills run linear against a real deadline, never decoratively. Nothing bounces, springs or loops.

## Press and disabled

There is no hover — this is a touch product. Press dims: 0.72 on buttons and rows, 0.68 with a 0.985 scale on settings controls, 0.58 with 0.94 on small icon actions. Icon buttons swap to `surface-alt` while pressed. Disabled is 0.5, or 0.45 for icon-only controls. Selected state is never colour alone: a fill *and* a border, or a glyph change.

## Layout

16pt gutters portrait, 12pt landscape. Content caps at 760pt and centres. The drawer caps at 520pt, dialogs at 560pt. The top bar is 62pt with the wordmark absolutely centred. Landscape splits into two panes with a hairline divider.

## Accessibility

Every interactive target is at least 44×44pt, including icon-only buttons; a smaller glyph sits inside the target with a negative margin where the drawn size must stay (precedent: the intro header's 40pt circles). Icons never define the target. Every state must be distinguishable without colour. Modals isolate screen-reader focus, keep backdrop dismiss layers out of the accessibility tree, and keep a labelled close action. Footer actions never leave the screen — the dialog body shrinks and scrolls first.

## Iconography

**Phosphor, regular weight, semantic names, semantic sizes.** The app imports `phosphor-react-native` behind one boundary (`src/design-system/PhosphorIcon.tsx`) mapping ~60 semantic names — `mic`, `sound`, `robot`, `global`, `key`, `branch`, `radio-selected` — onto glyphs. Two glyphs are this system's additions: `brain` (the thinking phase) and `users-three`, keyed **`council`** (Model Council) — the key is not the glyph name; no glyph in the map may mean two things. Sizes: `inline` 14, `compact` 16, `control` 20, `navigation` 24, `prominent` 28, `feature` 32, `hero` 40. Raw numeric sizes and other icon families are not supported.

On the web this system loads the same family from the official CDN:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/regular/style.css">
```

**Implementers vendor this stylesheet before shipping** — install `@phosphor-icons/web`, copy `src/regular/style.css` and its font binaries into `assets/phosphor/`, change the one `<link>`. The app itself uses `phosphor-react-native`, already bundled.

**Provider brand marks are the one exception.** 47 official SVGs in `assets/providers/`; `ProviderIcon` masks them to the surface foreground so they inherit the theme. A provider with no mark falls back to two letters — never a drawn substitute.
