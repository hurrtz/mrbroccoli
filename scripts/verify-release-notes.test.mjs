import assert from "node:assert/strict";
import test from "node:test";

import {
  parseReleaseNotes,
  validateReleaseNotes,
} from "./verify-release-notes.mjs";

const previous = `<en-US>
Previous English notes.
</en-US>

<de-DE>
Vorherige deutsche Hinweise.
</de-DE>`;

test("accepts the preceding locale contract within the store limit", () => {
  const current = `<en-US>
Current English notes.
</en-US>

<de-DE>
Aktuelle deutsche Hinweise.
</de-DE>`;
  const result = validateReleaseNotes({
    currentText: current,
    previousText: previous,
  });

  assert.deepEqual(result.errors, []);
  assert.deepEqual(
    parseReleaseNotes(current).map((entry) => entry.locale),
    ["en-US", "de-DE"],
  );
});

test("rejects missing locales and overlong summaries", () => {
  const current = `<en-US>
${"x".repeat(501)}
</en-US>`;
  const result = validateReleaseNotes({
    currentText: current,
    previousText: previous,
  });

  assert.ok(
    result.errors.includes(
      "Release note locale tags or ordering differ from the preceding release",
    ),
  );
  assert.ok(
    result.errors.some((error) => error.includes("maximum is 500")),
  );
});
