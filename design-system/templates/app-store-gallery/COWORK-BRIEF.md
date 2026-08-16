# App Store / Play Store gallery — batch production brief

Hand this file to Claude Cowork together with your screenshot library. It is self-contained: every value below is a literal, so nothing needs to be resolved from the design system.

The approved layout lives beside this file in `AppStoreGallery.dc.html` (open it in a browser to see the strip). Use it as the visual reference; use the numbers here as the source of truth.

---

## The job

Produce one finished store image per panel, per language, per device profile, per colour scheme:

**7 panels × 19 languages × 8 device profiles × 2 colour schemes = 2,128 images.**

Each image is a full-bleed rectangle at that profile's exact pixel dimensions: a flat green background, one headline, and one device-framed screenshot. Nothing else.

---

## The seven panels

Fixed order. The headline text is final English copy — translate it, never rewrite it.

| # | Screenshot | Headline (English) |
|---|---|---|
| 1 | `01-premium-active-conversation` | Ask out loud. Hear an answer worth listening to. |
| 2 | `10-premium-thinking` | Use the AI models you already trust. |
| 3 | `06-onboarding-setup` | Or keep it private and on-device. |
| 4 | `13-conversation-settings` | Every conversation, tuned to you. |
| 5 | `11-premium-speaking` | Choose the voice—and how it speaks. |
| 6 | `02-transcript-drawer` | Listen now. Read and revisit it later. |
| 7 | `08-conversation-branches` | Explore another direction without losing the thread. |

**Deliberately excluded — do not add these, even though they exist in the library:**
`03-free-conversation` (too close to panel 1), `04-premium-price` (stores show price themselves; Google restricts price and promotional text inside screenshots), `05-onboarding-welcome` and `07-onboarding-try` (explain setup, not why to install), `09-premium-settings` (dense and generic), `12-automatic-setup` (panel 3 conveys this better).

Seven fits both stores (iOS allows 10, Android 8) and is the same story everywhere — do not lengthen one platform's set.

---

## Panel geometry

The reference panel is **306 × 665** and the 6.9" iPhone export is **1320 × 2868** — the same shape at **s = 4.3137**. Compute every value as `reference × s`, where `s = targetWidth / 306`.

| Element | Reference (306×665) | At 6.9" (×4.3137) |
|---|---|---|
| Panel | 306 × 665 | 1320 × 2868 |
| Background | `#44A055`, full bleed, **no rounded corners** | same |
| Top margin | 24 | 104 |
| Headline band | height 78, max width 248, centred | height 336, max width 1070 |
| Gap below headline | 16 | 69 |
| Device frame | 248 × 523, centred, `#0B0C0E`, radius 26, padding 7 | 1070 × 2256, radius 112, padding 30 |
| Frame shadow | `0 18px 36px rgba(0,0,0,0.35)` | `0 78px 155px rgba(0,0,0,0.35)` |
| Screenshot | 234 × 509, radius 21, fills the frame's inner box | 1009 × 2195, radius 91 |
| Bottom margin | 24 | 104 |

**Headline type:** Unica One, weight 400, size `19 × s` (82px at 6.9"), line-height 1.3, letter-spacing `-0.1 × s`, colour `#FFFFFF`, centred horizontally and vertically in its band, maximum 3 lines. Unica One is a Google Font; the family also sits in `assets/fonts/` of the design system.

Rounded corners on the strip and the grey surround in the reference file are preview chrome. **Exports are flat rectangles, edge to edge.**

---

## Adapting to the eight profiles

Set `s = targetWidth / 306` and scale the top margin, headline band, gap and bottom margin by `s`. The device frame takes the remaining height. Then size the screenshot to its **own native aspect ratio** — never stretch it:

- If the frame's height-derived width exceeds `targetWidth − 58×s`, the panel is width-constrained: fix the frame width at `248 × s` and let it be shorter than the remaining height, keeping it centred in that space.
- Otherwise the frame is height-constrained: fix its height and derive its width from the screenshot ratio.

Tablets are always width-constrained (roughly 3:4 screenshots), so their frames end up much shorter, leaving more green above and below. That is expected and correct — same story, same type, re-proportioned panel.

Profiles to produce (confirm each store's currently required dimensions before the run; they change):

| Profile | Notes |
|---|---|
| iOS 4.7" | 9:16 screenshots — noticeably taller frame ratio than the modern phones |
| iOS 6.1" | |
| iOS 6.3" | |
| iOS 6.5" | |
| iOS 6.9" | The reference profile: 1320 × 2868 |
| iPad | ~3:4, width-constrained |
| Android phone | |
| Android tablet | ~3:4, width-constrained |

---

## Inputs, outputs, naming

Source screenshots are already organised by profile, language and colour scheme; each panel maps to the numbered filenames in the table above.

Suggested output tree — one folder per store listing so uploads are drag-and-drop:

```
gallery/<profile>/<lang>/<scheme>/01..07-<slug>.png
```

Keep the numeric prefix as the panel order: store listings display in filename order.

---

## Pre-flight checks

1. **Status bar.** Every current screenshot shows a charging battery bolt — a simulator tell. Re-capture with a full battery and no bolt before batching; fixing it afterwards means redoing every file.
2. **Theme.** Light is the primary set. Dark is a complete parallel set for later experimentation — never mix themes inside one listing.
3. **Localisation.** Translate headlines idiomatically, 6–9 words, one line of meaning. German and Finnish will run long: they may take 3 lines at the same size — verify no headline overflows its band or clips, and never shrink the type on one language only.
4. **Text safety.** No price, discount, ranking or promotional claims in any headline (Google Play policy).
5. **Contrast.** White on `#44A055` measures ~3.3:1 — fine at 82px display type, but do not reuse this pairing for anything smaller.

---

## Prompt to paste into Cowork

> Read `COWORK-BRIEF.md` and `AppStoreGallery.dc.html` in this folder. Build a script that renders App Store and Play Store gallery images from my screenshot library, following the brief exactly.
>
> For each device profile, language and colour scheme, produce the seven panels in the given order: flat `#44A055` background at the profile's exact required pixel dimensions, the panel's headline in Unica One 400 white centred in its band, and that panel's screenshot inside the dark device frame — all geometry scaled from the 306×665 reference by `s = targetWidth / 306`, with the screenshot kept at its native aspect ratio and never stretched.
>
> Before the full run, render the complete seven-panel English set for iOS 6.9" light and show me those files. Do not process the remaining profiles until I confirm.
>
> Then report: total files written, any headline that needed 3 lines or came close to overflowing its band, and any screenshot whose aspect ratio did not match its profile's expected ratio.
