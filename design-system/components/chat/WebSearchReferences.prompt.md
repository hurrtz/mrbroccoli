The sources a searching turn used, as a disclosure under the reply.

```jsx
<WebSearchReferences countLabel="4 sources" query="ferry schedule Aegina saturday"
  summary="Timetables agree on six departures; two sources note weather cancellations."
  sources={[{ title: "ferries.gr", url: "https://…" }]} onOpenSource={open} />
```

Collapsed: glyph, "Web search", the source count in mono, a chevron — one 44pt line. Expanded: the query in body ink (it is the user's own words back at them), the summary in secondary, then source chips.

Chips carry the display title and an export glyph; they open the source, so they are links, not tags. Titles truncate — never wrap a URL.

Rail style: hairline-topped section of the message row, no filled container. Only renders when the turn actually searched; a turn that skipped search shows nothing rather than "0 sources".
