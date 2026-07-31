# Debug logging

Mr Broccoli's user-triggered debug capture is designed for support cases where
the user may press **LOG** only after a problem has occurred. The capture adds a
bounded five-minute pre-roll, then writes an append-only JSONL journal until the
user stops it. An interrupted journal is recovered on the next launch and the
completed support log is written atomically before the UI reports success.

## Bounds and retention

- Active capture: at most 30 minutes, 5,000 entries, or 2 MiB.
- Pre-roll: at most 100 entries from the previous five minutes.
- Completed or recovered logs: the five newest files are retained.
- High-frequency waveform samples are counted rather than persisted.
- Streaming token chunks are aggregated into one periodic summary.

The final log includes sequence numbers, dropped-entry and truncation counts,
runtime/build/device/network context, and a validation summary. A capture that
cannot be written or atomically finalized is reported as failed and remains
recoverable instead of being presented as a successful export.

## Privacy contract

Provider credentials, authorization data, passphrases, tokens, conversation
content, prompts, transcripts, titles, search queries, and instructions must
never appear in a support log. Payload strings are private by default; only the
identifier and lifecycle fields explicitly allowlisted in
`src/services/debugLogSanitizer.ts` remain readable. Console strings and nested
console-object strings are always replaced with length and fingerprint
descriptors.

Errors retain only their type, safe code/failure kind/status, a message
fingerprint, and app-owned stack frames. The same sanitizer runs again when a
legacy or interrupted journal is recovered. New diagnostic fields must follow
this contract and must have an adversarial redaction test before being made
readable.

## Correlation and validation

Each text or voice turn has a `turnId`. Network requests have a `requestId`, TTS
requests retain the turn correlation, and settings pickers use a stable
`controlId`. The final validator reports:

- sequence gaps or capture truncation;
- network requests without a terminal event;
- picker-open requests without a native `onShow` presentation event;
- pipeline turns without a completion, failure, or abort terminal event.

Android API 30+ contributes the previous process-exit reason from
`ApplicationExitInfo`. iOS contributes privacy-minimized MetricKit counts. Both
are consumed into the pre-roll on the next launch; raw platform crash payloads
are not copied into the user-facing log.
