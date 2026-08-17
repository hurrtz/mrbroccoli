The images attached to the next question, in a panel anchored to the Image satellite that holds them.

```jsx
<div style={{ position: "relative", display: "flex", gap: 20 }}>
  <OrbSatellite icon="image" label={count ? countLabel : "Image"} thumbnails={uris}
    accessibilityLabel={a11y} onPress={() => setOpen(true)} />
  {/* council, web */}
  <AttachmentPopover visible={open} attachments={attachments}
    onRemove={remove} onAdd={openDevicePicker} onClose={() => setOpen(false)}
    style={{ left: 0, bottom: "100%", marginBottom: 10 }} />
</div>
```

**The flow.** At rest the satellite is a plain `image` glyph captioned "Image". Tapping it opens this panel on its empty state — one line of copy and one way forward. The add action hands off to the **device's own picker** (camera or library, any number of pictures); when it returns with images the popup **closes itself** and the satellite becomes the deck, captioned with the count. Tapping the deck opens the panel again, now holding every image in a row that scrolls sideways, each with its own delete control, and the same add action underneath.

Geometry is fixed on purpose: 252 wide, one row of 64pt thumbs at 8pt gaps so three sit in the panel and the fourth shows as a sliver, and a height that does not change between three images and forty. Nothing about the count needs a rule, and nothing about the panel grows toward the top of the stage.

It follows `AnchoredMenu` — same width, radius, elevated surface, shadow, 6pt band before the action row, transparent click-away, no backdrop dim — so it reads as the same species as the session actions menu. Placement is the caller's: on the workspace it hangs 10pt above the composing row with its left edge on the satellite, which is what makes it open out of the thing you pressed.

While a turn runs or a drive session is open the whole composing row rests at 38%, deck included, and the panel is unreachable until it ends. See `guidelines/surfaces/workspace.md` → Images.
