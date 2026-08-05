# Voice Session Hardware Retest

Use this checklist on physical devices before releasing the hands-free voice-session changes. Capture a debug log for every failure and note the device, OS version, headset, input mode, response mode, Model Council configuration, and battery-saving state.

## iPhone and AirPods

- [ ] Connect AirPods before starting the app. Confirm recording logs `native-recorder-route-selected` with a Bluetooth HFP input.
- [ ] Verify toggle-to-talk, push-to-talk, and Drive Session all record complete speech through the AirPods microphone.
- [ ] Verify start/stop cues and spoken replies play through the AirPods without switching unexpectedly to the phone speaker.
- [ ] Disconnect and reconnect the AirPods while idle, while recording, and while a reply is playing.
- [ ] Change between AirPods, wired audio, speaker, and receiver during a session. Confirm route-change diagnostics match the audible route.
- [ ] Interrupt recording and playback with Siri and a phone call. Confirm the session stops or resumes safely without duplicate submission or stuck UI.
- [ ] Manually lock the phone during recording. Confirm the capture stops/submits safely and does not lose an unexplained tail.

## Auto-Lock and Power Saving

- [ ] Set auto-lock to 30 seconds. Confirm the screen remains awake throughout toggle-to-talk and push-to-talk recording.
- [ ] Confirm the screen remains awake for the complete engaged Drive Session, including the silence countdown, processing, and spoken reply.
- [ ] Pause or stop Drive Session. Confirm normal auto-lock becomes available again.
- [ ] Exercise transcription failure, LLM failure, TTS failure, conversation reset, and app exit. Confirm no keep-awake lock remains.
- [ ] Repeat on an older, low-battery phone with Low Power Mode or Android Battery Saver enabled.

## ETA, Dynamic Island, and Lock Screen

- [ ] Confirm the CTA shows the current phase on the left and the written ETA on the right.
- [ ] Confirm the border begins exactly on the CTA outline and decreases around the complete outline without clipping or offset.
- [ ] Repeat in portrait and landscape.
- [ ] Confirm a normal turn and an Model Council turn initially show materially different estimates.
- [ ] Confirm Dynamic Island, lock screen, Android foreground notification, and CTA show the same phase and approximately the same remaining time.
- [ ] Let a turn exceed its estimate. Confirm every surface switches to `+ X s` and keeps increasing.
- [ ] Confirm no transcript, prompt, or reply content appears in Dynamic Island, lock-screen, or notification text.

## Drive Session Noise Rejection

- [ ] Test beside an open window with intermittent distant conversation or unintelligible pub chatter. Confirm rejected candidate diagnostics appear and the end-of-turn timer is not restarted.
- [ ] Test steady cabin, engine, road, ventilation, and rain noise. Confirm the ambient noise floor adapts without treating the noise as speech.
- [ ] Play speech, podcasts, or music from a distant loudspeaker. Confirm brief background phrases do not repeatedly restart the timer.
- [ ] Speak softly and normally near the phone after the ambient floor has adapted. Confirm real speech is accepted promptly and the timer resets.
- [ ] Test two people speaking, including an interruption near the phone.
- [ ] Test a quiet room to ensure the stricter gate has not made normal speech detection sluggish.

## Android Headsets

- [ ] Repeat recording and playback with Bluetooth HFP, wired headphones, and USB audio.
- [ ] Confirm recording uses the communication route and restores the previous audio mode after stop, failure, and app exit.
- [ ] Confirm the foreground notification remains present during the active voice turn and its countdown/overtime text updates.

## Pass Criteria

- No incomplete transcript caused by automatic screen sleep.
- No stuck recording, processing, playback, keep-awake, audio route, Live Activity, or notification state.
- Ambient chatter does not indefinitely postpone Drive Session submission.
- Nearby speech remains reliably detectable.
- ETA and overtime stay consistent across every visible surface.
