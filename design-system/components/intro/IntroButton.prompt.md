An action inside an introduction step — install, connect, open settings, upgrade.

\`\`\`jsx
<IntroButton icon="download" label="Install on-device AI" onPress={install} />
<IntroButton label="Connect a provider" tone="premium" onPress={connect} />
<IntroButton label="Open speech settings" tone="secondary" onPress={openSpeaking} />
\`\`\`

Match the tone to where the button leads, not to how much you want it pressed: \`premium\` for anything that needs a purchase, \`secondary\` for a detour into settings, \`primary\` for the path the app can complete on its own.

It is 52pt tall and squared to the app's control radius, not a pill. Pills were an earlier version of this flow and read as a separate product.
