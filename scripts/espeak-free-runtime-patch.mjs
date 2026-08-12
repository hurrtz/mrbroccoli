// The React Native Sherpa wrapper owns archive extraction in Objective-C++.
// Keep this source patch separate from the binary installer so it is small,
// deterministic, and regression-testable without depending on node_modules.

export const IOS_ARCHIVE_ROOT_ENTRY_GUARD = `    // libarchive may expose the archive root as an empty or dot entry. It has
    // no output path; skip it without weakening the canonical child-path guard.
    NSString *normalizedEntryPath = [entryPath stringByStandardizingPath];
    if (entryPath.length == 0 || [normalizedEntryPath isEqualToString:@"."]) {
      archive_read_data_skip(archive);
      continue;
    }
`;

const ENTRY_PATH_LINE =
  '    NSString *entryPath = currentPath ? [NSString stringWithUTF8String:currentPath] : @"";\n';
const FULL_PATH_LINE =
  "    NSString *fullPath = [[targetPath stringByAppendingPathComponent:entryPath] stringByStandardizingPath];\n";
const LEGACY_IOS_ARCHIVE_ROOT_ENTRY_GUARD = `    // libarchive may expose the archive root as an empty or dot entry. It has
    // no output path; skip it without weakening the canonical child-path guard.
    if (entryPath.length == 0 || [entryPath isEqualToString:@"."]) {
      archive_read_data_skip(archive);
      continue;
    }
`;
const PATCH_ANCHOR = `${ENTRY_PATH_LINE}${FULL_PATH_LINE}`;

export function hasIosArchiveRootEntryGuard(source) {
  return source.includes(IOS_ARCHIVE_ROOT_ENTRY_GUARD);
}

export function applyIosArchiveRootEntryPatch(source) {
  if (hasIosArchiveRootEntryGuard(source)) {
    return source;
  }
  if (source.includes(LEGACY_IOS_ARCHIVE_ROOT_ENTRY_GUARD)) {
    return source.replace(
      LEGACY_IOS_ARCHIVE_ROOT_ENTRY_GUARD,
      IOS_ARCHIVE_ROOT_ENTRY_GUARD,
    );
  }
  if (!source.includes(PATCH_ANCHOR)) {
    throw new Error(
      "Unsupported react-native-sherpa-onnx archive helper; expected the canonical target-path guard",
    );
  }
  return source.replace(
    PATCH_ANCHOR,
    `${ENTRY_PATH_LINE}${IOS_ARCHIVE_ROOT_ENTRY_GUARD}${FULL_PATH_LINE}`,
  );
}
