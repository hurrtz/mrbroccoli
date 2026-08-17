The 44pt controls that live around the orb: the composing row beneath it (the images of the next question, and the two per-question switches), and the four transport verbs `OrbTransport` places around it.

```jsx
<OrbSatellite icon="image" label="Image" accessibilityLabel="Add image" onPress={openImages} />
<OrbSatellite icon="council" label="Council" kind="toggle" active={council} onPress={toggleCouncil} />
```

**The container describes location, never state.** A satellite has no fill and no border in either appearance — the orb is the only filled object on the stage. A `kind="toggle"` that is on says so by filling its glyph and taking the accent, label with it: weight and hue together, so the state never rides on colour alone. Nothing else in the product fills a glyph, so a filled glyph can only mean on. This needs the Phosphor **fill** stylesheet loaded alongside the regular one.

The only container a satellite ever shows is the momentary `accent-soft` press disc under the thumb. That is the whole pressability cue a borderless 44pt target gets, so do not remove it.

**The image deck.** `thumbnails` replaces the glyph with the pictures themselves: one tile for one image, two for two, three for three and up, each layer behind the front one a little smaller and a little fainter. The array's length is what says one, two or three-and-more; the exact number goes in `label` ("3 IMAGES") and there is no badge. It fits the existing 44pt well inside the existing 64pt column, so the row measures the same at nine images as at none. Attachments are content, not state — the glyph still never fills. Pair it with `AttachmentPopover`.

`tone` tints glyph and label together and is for the transport verbs only — Stop in danger, Resume in success. `iconOnly` drops the label for landscape.

The composing row is **permanent**: images, council, web, in place at every phase, resting at 38% while a turn runs. Transport verbs never appear in it — they orbit the orb (`OrbTransport`). See `guidelines/surfaces/workspace.md`.
