One route in a stage page's unified "Who thinks/listens/speaks/searches" picker.

```jsx
<RouteOptionRow selected label="Kokoro 82M · on this device" meta="Installed · 312 MB · no audio leaves the phone"
  sub={<VoiceValueRow />} onSelect={pick} />
<RouteOptionRow disabled label="Moonshine Tiny · on this device" meta="Installed · not tested yet"
  action={<IconAction icon="egg" label="Test" onPress={test} />} />
<RouteOptionRow locked label="ElevenLabs" meta="Via provider · your key" />
```

The picker spans all three runtimes in one radio group: System, on this device, via provider. Rules: an on-device radio unlocks only after a viable test (testing is the egg; it cracks on failure); the row carries ONE state-driven action — Download → Cancel → Test → Update-when-available; removal is a swipe; provider routes appear only for providers connected under Connections; the free edition renders provider routes `locked` (ghosted, lock glyph) above a `PremiumBand`.
