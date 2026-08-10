The seven-step introduction that `IntroBanner` opens — the app's only onboarding, and never a blocking wizard.

```jsx
<IntroBanner title="New here?" body="See what Mr Broccoli does and pick how to power it."
  action="Take a look" onOpen={() => setIntro(true)} />
<IntroFlow visible={intro} onClose={() => setIntro(false)} autoSetup={auto.cardProps}
  onInstallLocal={openOnDevice} onConnectProvider={openConnections} onOpenPremium={openPremium} />
```

Seven steps in this order: the greeting, the honest shape of setup, the offer to pick and install on-device models automatically, the one requirement, speech in, speech out, and what Premium adds. The order is the argument — it tells someone how little is actually required, offers to do that little for them, and only then mentions anything they could buy.

The automatic-setup step carries `AutoSetupCard` with its header hidden, since the step title already says what it is. Pass `autoSetup` when the install must survive the introduction closing; leave it out and the card drives itself.

It fills its container and follows the app's appearance rather than carrying its own. Every step is reachable in both directions, from the header stepper as well as the arrows; a one-way path made the last step a dead end.

Pass `copy` to translate. `onConnectProvider` and `onOpenPremium` receive the step they were invoked from, so a cancelled purchase can hand the reader back where they were instead of restarting.
