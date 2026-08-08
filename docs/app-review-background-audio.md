# App Review: background audio (guideline 2.5.4)

Mr Broccoli declares `UIBackgroundModes: [audio]` because a spoken answer keeps
playing when the user leaves the app mid-turn. This is the feature App Review
could not locate, and this note records what it is, why it exists, and how to
demonstrate it, so the same rejection does not need re-deriving next time.

## What the capability is for

The app is voice-first: the user speaks a question and listens to the answer.
An answer can take a minute or more to synthesize and speak, and Drive Session
is explicitly a hands-free mode intended for use while driving, where the user
is not looking at the screen.

Background continuation exists **only** for an active, user-authorized voice
turn and ends on completion, cancellation, terminal failure, or expiry -- see
`ios/SPEC.md`. It is implemented in `MrBroccoliBackgroundVoiceTurn`, covered by
`testBackgroundVoiceTurnSurvivesRapidActivationAndLifecycleRaces` in
`ios/MrBroccoliTests/MrBroccoliNativeLifecycleTests.swift`, and surfaced to the
user through a Live Activity. Android carries the same capability through the
`MrBroccoliVoiceTurnService` foreground service.

The app never plays audio in the background without an active turn the user
started. It is not a media player, and it does not resume audio on its own.

## Why the reviewer could not find it

Background playback only begins once a turn is already running. Opening the app
and leaving it produces no audio, because there is nothing to speak. The
capability appears only in this order: start a turn, wait for the answer to
begin, then leave the app.

## Demonstrating it (recording steps)

Record on a physical device and attach to App Review Information → Notes.

1. Open Mr Broccoli with a configured response route and speech output enabled.
2. Tap the primary control and ask a question long enough to produce a
   multi-sentence answer, for example "explain how a heat pump works".
3. Wait until the answer begins playing aloud and the transcript starts filling.
4. **Press the Home gesture to return to the Home Screen while it is speaking.**
5. Keep recording for at least 15 more seconds: the answer continues aloud with
   the app in the background, and the Live Activity shows the turn in progress.
6. Reopen the app to show the completed answer in the transcript.

## If the capability is ever dropped

Set `enableBackgroundPlayback: false` on the `expo-audio` plugin entry in
`app.json`, regenerate the iOS project, and expect the answer to stop the
moment the app leaves the foreground. `scripts/verify-native-config-sync.mjs`
asserts the declaration and the plist agree, so the two cannot drift apart the
way they did before this note existed.
