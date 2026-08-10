The card that holds the facts of an introduction step. One per step.

\`\`\`jsx
<IntroPanel>
  <IntroPoint icon="cpu" title="A model that thinks" body="This is the only requirement." />
  <IntroPanelDivider />
  <IntroPoint icon="mic" title="Speaking to it — optional" tone="neutral" />
</IntroPanel>
\`\`\`

Use \`IntroPanelDivider\` to separate what is required from what is not — points that belong to the same group sit together with no rule between them. Everything inside the panel is left-aligned, in contrast to the centred heading above it.
