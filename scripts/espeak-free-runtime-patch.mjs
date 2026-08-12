// The React Native Sherpa wrapper owns archive extraction in Objective-C++.
// Keep this source patch separate from the binary installer so it is small,
// deterministic, and regression-testable without depending on node_modules.

export const IOS_ARCHIVE_ENTRY_VALIDATION_GUARD = `    // libarchive may expose the archive root as an empty or dot entry. It has
    // no output path; skip it. Every other entry must be a relative,
    // regular file or directory without parent traversal before libarchive writes it.
    if (entryPath.length == 0 || [entryPath isEqualToString:@"."] ||
        [entryPath isEqualToString:@"./"]) {
      archive_read_data_skip(archive);
      continue;
    }
    if ([entryPath hasPrefix:@"/"] ||
        [entryPath.pathComponents containsObject:@".."] ||
        (archive_entry_filetype(entry) != AE_IFREG &&
         archive_entry_filetype(entry) != AE_IFDIR) ||
        archive_entry_symlink(entry) != nullptr ||
        archive_entry_hardlink(entry) != nullptr) {
      archive_read_free(archive);
      archive_write_free(disk);
      close_reader();
      return @{ @"success": @NO, @"reason": @"Blocked unsafe archive entry" };
    }
`;

export const IOS_ARCHIVE_DISK_OPTIONS = `  archive_write_disk_set_options(
      disk,
      ARCHIVE_EXTRACT_TIME | ARCHIVE_EXTRACT_PERM | ARCHIVE_EXTRACT_ACL |
          ARCHIVE_EXTRACT_FFLAGS | ARCHIVE_EXTRACT_SECURE_SYMLINKS);
`;

const IOS_ARCHIVE_DISK_OPTIONS_WITH_NODOTDOT = `  archive_write_disk_set_options(
      disk,
      ARCHIVE_EXTRACT_TIME | ARCHIVE_EXTRACT_PERM | ARCHIVE_EXTRACT_ACL |
          ARCHIVE_EXTRACT_FFLAGS | ARCHIVE_EXTRACT_SECURE_NODOTDOT |
          ARCHIVE_EXTRACT_SECURE_SYMLINKS);
`;

const IOS_ARCHIVE_DISK_OPTIONS_WITH_NOABSOLUTEPATHS = `  archive_write_disk_set_options(
      disk,
      ARCHIVE_EXTRACT_TIME | ARCHIVE_EXTRACT_PERM | ARCHIVE_EXTRACT_ACL |
          ARCHIVE_EXTRACT_FFLAGS | ARCHIVE_EXTRACT_SECURE_SYMLINKS |
          ARCHIVE_EXTRACT_SECURE_NOABSOLUTEPATHS);
`;

const IOS_ARCHIVE_DISK_OPTIONS_WITH_NODOTDOT_AND_NOABSOLUTEPATHS = `  archive_write_disk_set_options(
      disk,
      ARCHIVE_EXTRACT_TIME | ARCHIVE_EXTRACT_PERM | ARCHIVE_EXTRACT_ACL |
          ARCHIVE_EXTRACT_FFLAGS | ARCHIVE_EXTRACT_SECURE_NODOTDOT |
          ARCHIVE_EXTRACT_SECURE_SYMLINKS |
          ARCHIVE_EXTRACT_SECURE_NOABSOLUTEPATHS);
`;

const ENTRY_PATH_LINE =
  '    NSString *entryPath = currentPath ? [NSString stringWithUTF8String:currentPath] : @"";\n';
const FULL_PATH_LINE =
  "    NSString *fullPath = [targetPath stringByAppendingPathComponent:entryPath];\n";
const OLD_FULL_PATH_LINE =
  "    NSString *fullPath = [[targetPath stringByAppendingPathComponent:entryPath] stringByStandardizingPath];\n";
const SET_PATHNAME_LINE =
  "    archive_entry_set_pathname(entry, [fullPath UTF8String]);\n";
const CANONICAL_TARGET_LINE =
  "  NSString *canonicalTarget = [[targetPath stringByStandardizingPath] stringByAppendingString:@\"/\"];\n";
const OLD_DISK_OPTIONS =
  "  archive_write_disk_set_options(disk, ARCHIVE_EXTRACT_TIME | ARCHIVE_EXTRACT_PERM | ARCHIVE_EXTRACT_ACL | ARCHIVE_EXTRACT_FFLAGS);\n";

export function hasIosArchiveEntryValidationGuard(source) {
  return (
    source.includes(IOS_ARCHIVE_ENTRY_VALIDATION_GUARD) &&
    source.includes(IOS_ARCHIVE_DISK_OPTIONS)
  );
}

export function applyIosArchiveEntryValidationPatch(source) {
  if (hasIosArchiveEntryValidationGuard(source)) {
    return source;
  }
  if (
    source.includes(IOS_ARCHIVE_ENTRY_VALIDATION_GUARD) &&
    (source.includes(
      IOS_ARCHIVE_DISK_OPTIONS_WITH_NODOTDOT_AND_NOABSOLUTEPATHS,
    ) ||
      source.includes(IOS_ARCHIVE_DISK_OPTIONS_WITH_NOABSOLUTEPATHS) ||
      source.includes(IOS_ARCHIVE_DISK_OPTIONS_WITH_NODOTDOT))
  ) {
    return source
      .replace(
        IOS_ARCHIVE_DISK_OPTIONS_WITH_NODOTDOT_AND_NOABSOLUTEPATHS,
        IOS_ARCHIVE_DISK_OPTIONS,
      )
      .replace(
        IOS_ARCHIVE_DISK_OPTIONS_WITH_NOABSOLUTEPATHS,
        IOS_ARCHIVE_DISK_OPTIONS,
      )
      .replace(
        IOS_ARCHIVE_DISK_OPTIONS_WITH_NODOTDOT,
        IOS_ARCHIVE_DISK_OPTIONS,
      );
  }
  const blockStart = source.indexOf(ENTRY_PATH_LINE);
  const blockEnd = source.indexOf(SET_PATHNAME_LINE, blockStart);
  if (
    blockStart === -1 ||
    blockEnd === -1 ||
    !source.slice(blockStart, blockEnd).includes(OLD_FULL_PATH_LINE)
  ) {
    throw new Error(
      "Unsupported react-native-sherpa-onnx archive helper; expected the canonical archive guard",
    );
  }
  let patched = `${source.slice(0, blockStart)}${ENTRY_PATH_LINE}${IOS_ARCHIVE_ENTRY_VALIDATION_GUARD}${FULL_PATH_LINE}${source.slice(blockEnd)}`;
  if (!patched.includes(CANONICAL_TARGET_LINE)) {
    throw new Error(
      "Unsupported react-native-sherpa-onnx archive helper; expected the canonical target declaration",
    );
  }
  patched = patched.replace(CANONICAL_TARGET_LINE, "");
  if (!patched.includes(OLD_DISK_OPTIONS)) {
    throw new Error(
      "Unsupported react-native-sherpa-onnx archive helper; expected the disk extraction options",
    );
  }
  return patched.replace(OLD_DISK_OPTIONS, IOS_ARCHIVE_DISK_OPTIONS);
}
