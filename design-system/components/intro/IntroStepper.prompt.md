Progress through the introduction, in the flow's header between the back and close controls.

\`\`\`jsx
<IntroStepper count={6} index={3} onSelect={goTo} />
\`\`\`

Visited steps carry the strong border colour, unvisited ones the plain one, and the current step widens to a 26pt dash. That difference is the point — it says what you have passed as well as where you are.

Always pass \`onSelect\`. Every marker is a 44pt target, and a flow that can only be walked forwards makes the last step a dead end.
