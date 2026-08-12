One tap that measures the phone, proposes on-device models for thinking,
listening and speaking, and installs them. The same card appears in the
introduction and in App & diagnostics settings.

```jsx
// Self-driving: fine for a specimen or a single screen.
<AutoSetupCard onManual={() => openCatalogue()} />

// Host-driven: the install has to keep running after the user leaves.
<AutoSetupCard state={auto.state} fraction={auto.fraction} scanned={auto.scanned}
  onStart={auto.start} onInstall={auto.install} onRetry={auto.install}
  onContinue={closeIntro} onManual={openCatalogue} />
```

Six states: `offer`, `scanning`, `proposal`, `installing`, `done`, `failed`.

The measuring pause is about two and a half seconds and is deliberate. The check
itself is near-instant, but a verdict that lands before the user has finished
reading the offer reads as a canned answer. The facts revealed during the pause
are real readings, and they are what earn the recommendation.

Never install without the proposal step. The app has just said it can decide for
the user; spending 1.7 GB of their storage before they have seen the list is the
one thing that would make that untrustworthy.

Keep the same card in both places. A user who starts this in the walkthrough and
finds it again in settings should recognise it rather than re-read it.
