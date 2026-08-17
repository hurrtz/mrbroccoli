import assert from "node:assert/strict";
import test from "node:test";

import {
  ANDROID_NATIVE_NAMESPACE,
  APPLICATION_IDENTIFIERS,
  applicationIdentifierFor,
} from "./application-identifiers.mjs";

test("keeps the Android Play identity separate from the unchanged iOS identity", () => {
  assert.equal(
    applicationIdentifierFor("android"),
    "com.tobiaswinkler.app.android.mrbroccoli",
  );
  assert.equal(
    applicationIdentifierFor("ios"),
    "com.tobiaswinkler.app.mrbroccoli",
  );
  assert.notEqual(
    APPLICATION_IDENTIFIERS.android.production,
    APPLICATION_IDENTIFIERS.ios.production,
  );
  assert.equal(ANDROID_NATIVE_NAMESPACE, "com.tobiaswinkler.app.mrbroccoli");
});

test("derives isolated debug and Maestro identities for each platform", () => {
  for (const platform of ["android", "ios"]) {
    assert.equal(
      APPLICATION_IDENTIFIERS[platform].debug,
      `${APPLICATION_IDENTIFIERS[platform].production}.dev`,
    );
    assert.equal(
      APPLICATION_IDENTIFIERS[platform].maestro,
      `${APPLICATION_IDENTIFIERS[platform].production}.maestro`,
    );
  }
  assert.throws(
    () => applicationIdentifierFor("web"),
    /Unknown application identity/,
  );
});
