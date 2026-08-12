import assert from "node:assert/strict";
import test from "node:test";

import {
  IOS_ARCHIVE_ROOT_ENTRY_GUARD,
  applyIosArchiveRootEntryPatch,
  hasIosArchiveRootEntryGuard,
} from "./espeak-free-runtime-patch.mjs";

const UPSTREAM_HELPER_FRAGMENT = `    const char *currentPath = archive_entry_pathname(entry);
    NSString *entryPath = currentPath ? [NSString stringWithUTF8String:currentPath] : @"";
    NSString *fullPath = [[targetPath stringByAppendingPathComponent:entryPath] stringByStandardizingPath];

    if (![fullPath hasPrefix:canonicalTarget]) {
      return @{ @"success": @NO, @"reason": @"Blocked path traversal" };
    }
`;

const LEGACY_GUARD = `    // libarchive may expose the archive root as an empty or dot entry. It has
    // no output path; skip it without weakening the canonical child-path guard.
    if (entryPath.length == 0 || [entryPath isEqualToString:@"."]) {
      archive_read_data_skip(archive);
      continue;
    }
`;

test("iOS archive patch skips only no-op archive-root entries before traversal validation", () => {
  const patched = applyIosArchiveRootEntryPatch(UPSTREAM_HELPER_FRAGMENT);

  assert.equal(hasIosArchiveRootEntryGuard(patched), true);
  assert.ok(
    patched.includes(
      'entryPath.length == 0 || [normalizedEntryPath isEqualToString:@"."]',
    ),
  );
  assert.ok(patched.includes("[entryPath stringByStandardizingPath]"));
  assert.ok(patched.includes("archive_read_data_skip(archive);"));
  assert.ok(
    patched.indexOf(IOS_ARCHIVE_ROOT_ENTRY_GUARD) <
      patched.indexOf("NSString *fullPath"),
  );
  assert.ok(
    patched.includes(
      'return @{ @"success": @NO, @"reason": @"Blocked path traversal" };',
    ),
  );
});

test("iOS archive patch is idempotent and rejects unsupported wrapper source", () => {
  const patched = applyIosArchiveRootEntryPatch(UPSTREAM_HELPER_FRAGMENT);

  assert.equal(applyIosArchiveRootEntryPatch(patched), patched);
  assert.throws(
    () => applyIosArchiveRootEntryPatch("unrelated native source"),
    /Unsupported react-native-sherpa-onnx archive helper/,
  );
});

test("iOS archive patch upgrades the prior exact-root guard", () => {
  const legacyPatched = UPSTREAM_HELPER_FRAGMENT.replace(
    "    NSString *fullPath = [[targetPath stringByAppendingPathComponent:entryPath] stringByStandardizingPath];\n",
    LEGACY_GUARD +
      "    NSString *fullPath = [[targetPath stringByAppendingPathComponent:entryPath] stringByStandardizingPath];\n",
  );

  const upgraded = applyIosArchiveRootEntryPatch(legacyPatched);
  assert.equal(hasIosArchiveRootEntryGuard(upgraded), true);
  assert.equal(upgraded.includes(LEGACY_GUARD), false);
});
