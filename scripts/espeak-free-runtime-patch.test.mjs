import assert from "node:assert/strict";
import test from "node:test";

import {
  IOS_ARCHIVE_DISK_OPTIONS,
  IOS_ARCHIVE_ENTRY_VALIDATION_GUARD,
  IOS_TTS_NULL_HANDLE_GUARD,
  applyIosArchiveEntryValidationPatch,
  applyIosTtsNullHandlePatch,
  hasIosArchiveEntryValidationGuard,
  hasIosTtsNullHandleGuard,
} from "./espeak-free-runtime-patch.mjs";

const UPSTREAM_HELPER_FRAGMENT = `  NSString *canonicalTarget = [[targetPath stringByStandardizingPath] stringByAppendingString:@"/"];
  archive_write_disk_set_options(disk, ARCHIVE_EXTRACT_TIME | ARCHIVE_EXTRACT_PERM | ARCHIVE_EXTRACT_ACL | ARCHIVE_EXTRACT_FFLAGS);
    const char *currentPath = archive_entry_pathname(entry);
    NSString *entryPath = currentPath ? [NSString stringWithUTF8String:currentPath] : @"";
    NSString *fullPath = [[targetPath stringByAppendingPathComponent:entryPath] stringByStandardizingPath];

    if (![fullPath hasPrefix:canonicalTarget]) {
      return @{ @"success": @NO, @"reason": @"Blocked path traversal" };
    }
    archive_entry_set_pathname(entry, [fullPath UTF8String]);
`;

const LEGACY_GUARD = `    // libarchive may expose the archive root as an empty or dot entry. It has
    // no output path; skip it without weakening the canonical child-path guard.
    if (entryPath.length == 0 || [entryPath isEqualToString:@"."]) {
      archive_read_data_skip(archive);
      continue;
    }
`;

test("iOS archive patch permits only safe relative archive entries", () => {
  const patched = applyIosArchiveEntryValidationPatch(UPSTREAM_HELPER_FRAGMENT);

  assert.equal(hasIosArchiveEntryValidationGuard(patched), true);
  assert.ok(
    patched.includes(
      'entryPath.length == 0 || [entryPath isEqualToString:@"."] ||',
    ),
  );
  assert.ok(patched.includes('[entryPath isEqualToString:@"./"]'));
  assert.ok(patched.includes("archive_read_data_skip(archive);"));
  assert.ok(
    patched.indexOf(IOS_ARCHIVE_ENTRY_VALIDATION_GUARD) <
      patched.indexOf("NSString *fullPath"),
  );
  assert.ok(
    patched.includes(
      '[entryPath.pathComponents containsObject:@".."]',
    ),
  );
  assert.ok(patched.includes('archive_entry_filetype(entry) != AE_IFREG'));
  assert.ok(patched.includes('archive_entry_filetype(entry) != AE_IFDIR'));
  assert.ok(patched.includes('archive_entry_symlink(entry) != nullptr'));
  assert.ok(patched.includes('archive_entry_hardlink(entry) != nullptr'));
  assert.ok(
    patched.includes(
      'return @{ @"success": @NO, @"reason": @"Blocked unsafe archive entry" };',
    ),
  );
  assert.equal(patched.includes("stringByStandardizingPath"), false);
  assert.equal(patched.includes("canonicalTarget"), false);
  assert.equal(patched.includes("[fullPath hasPrefix:"), false);
  assert.ok(patched.includes(IOS_ARCHIVE_DISK_OPTIONS));
  assert.equal(
    patched.includes("ARCHIVE_EXTRACT_SECURE_NOABSOLUTEPATHS"),
    false,
  );
  assert.equal(patched.includes("ARCHIVE_EXTRACT_SECURE_NODOTDOT"), false);
  assert.ok(
    patched.includes(
      "NSString *fullPath = [targetPath stringByAppendingPathComponent:entryPath];",
    ),
  );
});

test("iOS archive patch is idempotent and rejects unsupported wrapper source", () => {
  const patched = applyIosArchiveEntryValidationPatch(UPSTREAM_HELPER_FRAGMENT);

  assert.equal(applyIosArchiveEntryValidationPatch(patched), patched);
  assert.throws(
    () => applyIosArchiveEntryValidationPatch("unrelated native source"),
    /Unsupported react-native-sherpa-onnx archive helper/,
  );
});

test("iOS archive patch removes incompatible writer flags after direct validation", () => {
  const guardedWithNoAbsolutePaths = applyIosArchiveEntryValidationPatch(
    UPSTREAM_HELPER_FRAGMENT,
  ).replace(
    IOS_ARCHIVE_DISK_OPTIONS,
    IOS_ARCHIVE_DISK_OPTIONS.replace(
      "ARCHIVE_EXTRACT_SECURE_SYMLINKS);",
      "ARCHIVE_EXTRACT_SECURE_SYMLINKS |\n          ARCHIVE_EXTRACT_SECURE_NOABSOLUTEPATHS);",
    ),
  );

  const upgraded = applyIosArchiveEntryValidationPatch(
    guardedWithNoAbsolutePaths,
  );
  assert.equal(hasIosArchiveEntryValidationGuard(upgraded), true);
  assert.equal(
    upgraded.includes("ARCHIVE_EXTRACT_SECURE_NOABSOLUTEPATHS"),
    false,
  );
  assert.equal(upgraded.includes("ARCHIVE_EXTRACT_SECURE_NODOTDOT"), false);

  const guardedWithNoDotDot = guardedWithNoAbsolutePaths.replace(
    "ARCHIVE_EXTRACT_SECURE_SYMLINKS |\n          ARCHIVE_EXTRACT_SECURE_NOABSOLUTEPATHS",
    "ARCHIVE_EXTRACT_SECURE_NODOTDOT |\n          ARCHIVE_EXTRACT_SECURE_SYMLINKS",
  );
  const upgradedNoDotDot = applyIosArchiveEntryValidationPatch(
    guardedWithNoDotDot,
  );
  assert.equal(hasIosArchiveEntryValidationGuard(upgradedNoDotDot), true);
  assert.equal(
    upgradedNoDotDot.includes("ARCHIVE_EXTRACT_SECURE_NODOTDOT"),
    false,
  );
});

test("iOS archive patch upgrades the prior root-entry guard", () => {
  const legacyPatched = UPSTREAM_HELPER_FRAGMENT.replace(
    "    NSString *fullPath = [[targetPath stringByAppendingPathComponent:entryPath] stringByStandardizingPath];\n",
    LEGACY_GUARD +
      "    NSString *fullPath = [[targetPath stringByAppendingPathComponent:entryPath] stringByStandardizingPath];\n",
  );

  const upgraded = applyIosArchiveEntryValidationPatch(legacyPatched);
  assert.equal(hasIosArchiveEntryValidationGuard(upgraded), true);
  assert.equal(upgraded.includes(LEGACY_GUARD), false);
});

test("iOS TTS patch rejects a null OfflineTts handle before querying it", () => {
  const upstream = `        if (!pImpl->tts.has_value()) {
            result.error = "TTS: Failed to create OfflineTts instance (e.g. missing espeak-ng data or invalid model)";
            LOGE("%s", result.error.c_str());
            return result;
        }

        pImpl->initialized = true;
        LOGI("TTS: Sample rate: %d Hz", pImpl->tts.value().SampleRate());
`;
  const patched = applyIosTtsNullHandlePatch(upstream);

  assert.equal(hasIosTtsNullHandleGuard(patched), true);
  assert.ok(patched.includes(IOS_TTS_NULL_HANDLE_GUARD));
  assert.ok(
    patched.indexOf("pImpl->tts->Get() == nullptr") <
      patched.indexOf("SampleRate()"),
  );
  assert.equal(applyIosTtsNullHandlePatch(patched), patched);
  assert.throws(
    () => applyIosTtsNullHandlePatch("unrelated native source"),
    /Unsupported react-native-sherpa-onnx TTS wrapper/,
  );
});
