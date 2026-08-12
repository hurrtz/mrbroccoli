// The React Native Sherpa wrapper owns archive extraction in Objective-C++.
// Keep this source patch separate from the binary installer so it is small,
// deterministic, and regression-testable without depending on node_modules.

// A libphonemize build must not retain upstream VITS validation for eSpeak's
// four monolithic data files. Their presence proves the native archive predates
// the pack-only runtime contract even if its linked libraries are otherwise
// licence-clean.
export const LEGACY_VITS_DATA_VALIDATION_MARKER =
  "does not exist. Please check --vits-data-dir";

export function hasLegacyVitsDataValidation(artifact) {
  return artifact.includes(LEGACY_VITS_DATA_VALIDATION_MARKER);
}

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

// `archive_write_data_block` uses archive status semantics. The bundled
// libarchive returns `ARCHIVE_OK` (`0`) for a successful block, not the number
// of bytes requested by the caller.
export const IOS_ARCHIVE_DATA_WRITE_GUARD = `      if (writeResult != ARCHIVE_OK) {
`;

// React Native exposes iOS container paths through the `/var` system alias.
// Resolve the already-created destination before libarchive's secure symlink
// checks so that alias is not mistaken for an archive-controlled link.
export const IOS_ARCHIVE_REALPATH_INCLUDE = `#include <cstdlib>
`;
export const IOS_ARCHIVE_RESOLVED_TARGET = `  char *resolvedTarget = realpath([targetPath fileSystemRepresentation], nullptr);
  if (!resolvedTarget) {
    return @{ @"success": @NO, @"reason": @"Failed to resolve target directory" };
  }
  NSString *resolvedTargetPath = [NSString stringWithUTF8String:resolvedTarget];
  free(resolvedTarget);
  if (!resolvedTargetPath) {
    return @{ @"success": @NO, @"reason": @"Failed to decode resolved target directory" };
  }
`;
export const IOS_ARCHIVE_RESOLVED_FULL_PATH =
  "    NSString *fullPath = [resolvedTargetPath stringByAppendingPathComponent:entryPath];\n";

// `OfflineTts::Create` returns a wrapper object even when the underlying C
// handle is null. The upstream optional check therefore succeeds and the
// subsequent SampleRate call dereferences null on iOS. Keep the native module
// recoverable: surface the failed engine creation to JavaScript instead.
export const IOS_TTS_NULL_HANDLE_GUARD = `        if (!pImpl->tts.has_value() || pImpl->tts->Get() == nullptr) {
            result.error = "TTS: Failed to create OfflineTts instance (e.g. missing espeak-ng data or invalid model)";
            LOGE("%s", result.error.c_str());
            return result;
        }
`;

const IOS_TTS_OPTIONAL_ONLY_GUARD = `        if (!pImpl->tts.has_value()) {
            result.error = "TTS: Failed to create OfflineTts instance (e.g. missing espeak-ng data or invalid model)";
            LOGE("%s", result.error.c_str());
            return result;
        }
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
const PREVIOUS_ARCHIVE_DATA_WRITE_GUARD =
  "      if (writeResult < 0 || static_cast<size_t>(writeResult) != size) {\n";
const PREVIOUS_ARCHIVE_RESOLVED_TARGET =
  "  NSString *resolvedTargetPath = [targetPath stringByResolvingSymlinksInPath];\n";
const FILE_ATTRIBUTES_LINE =
  "  NSDictionary *fileAttributes = [fileManager attributesOfItemAtPath:sourcePath error:nil];\n";
const CSTDIO_INCLUDE = "#include <cstdio>\n";

function applyIosArchiveDataWritePatch(source) {
  if (source.includes(IOS_ARCHIVE_DATA_WRITE_GUARD)) {
    return source;
  }
  if (source.includes(PREVIOUS_ARCHIVE_DATA_WRITE_GUARD)) {
    return source.replace(
      PREVIOUS_ARCHIVE_DATA_WRITE_GUARD,
      IOS_ARCHIVE_DATA_WRITE_GUARD,
    );
  }
  throw new Error(
    "Unsupported react-native-sherpa-onnx archive helper; expected the data write guard",
  );
}

function applyIosArchiveResolvedTargetPatch(source) {
  let patched = source;
  if (!patched.includes(IOS_ARCHIVE_REALPATH_INCLUDE)) {
    if (!patched.includes(CSTDIO_INCLUDE)) {
      throw new Error(
        "Unsupported react-native-sherpa-onnx archive helper; expected the C stdio include",
      );
    }
    patched = patched.replace(
      CSTDIO_INCLUDE,
      `${CSTDIO_INCLUDE}${IOS_ARCHIVE_REALPATH_INCLUDE}`,
    );
  }
  if (!patched.includes(IOS_ARCHIVE_RESOLVED_TARGET)) {
    if (patched.includes(PREVIOUS_ARCHIVE_RESOLVED_TARGET)) {
      patched = patched.replace(
        PREVIOUS_ARCHIVE_RESOLVED_TARGET,
        IOS_ARCHIVE_RESOLVED_TARGET,
      );
    } else if (!patched.includes(FILE_ATTRIBUTES_LINE)) {
      throw new Error(
        "Unsupported react-native-sherpa-onnx archive helper; expected the archive attributes lookup",
      );
    } else {
      patched = patched.replace(
        FILE_ATTRIBUTES_LINE,
        `${IOS_ARCHIVE_RESOLVED_TARGET}\n${FILE_ATTRIBUTES_LINE}`,
      );
    }
  }
  if (patched.includes(FULL_PATH_LINE)) {
    return patched.replace(FULL_PATH_LINE, IOS_ARCHIVE_RESOLVED_FULL_PATH);
  }
  if (patched.includes(IOS_ARCHIVE_RESOLVED_FULL_PATH)) {
    return patched;
  }
  throw new Error(
    "Unsupported react-native-sherpa-onnx archive helper; expected the archive output path",
  );
}

function applyIosArchiveCompatibilityPatches(source) {
  return applyIosArchiveResolvedTargetPatch(
    applyIosArchiveDataWritePatch(source),
  );
}

export function hasIosArchiveEntryValidationGuard(source) {
  return (
    source.includes(IOS_ARCHIVE_ENTRY_VALIDATION_GUARD) &&
    source.includes(IOS_ARCHIVE_DISK_OPTIONS) &&
    source.includes(IOS_ARCHIVE_DATA_WRITE_GUARD) &&
    source.includes(IOS_ARCHIVE_REALPATH_INCLUDE) &&
    source.includes(IOS_ARCHIVE_RESOLVED_TARGET) &&
    source.includes(IOS_ARCHIVE_RESOLVED_FULL_PATH)
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
    const upgraded = source
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
    return applyIosArchiveCompatibilityPatches(upgraded);
  }

  if (source.includes(IOS_ARCHIVE_ENTRY_VALIDATION_GUARD)) {
    if (!source.includes(IOS_ARCHIVE_DISK_OPTIONS)) {
      throw new Error(
        "Unsupported react-native-sherpa-onnx archive helper; expected the disk extraction options",
      );
    }
    return applyIosArchiveCompatibilityPatches(source);
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
  patched = patched.replace(OLD_DISK_OPTIONS, IOS_ARCHIVE_DISK_OPTIONS);
  return applyIosArchiveCompatibilityPatches(patched);
}

export function hasIosTtsNullHandleGuard(source) {
  return source.includes(IOS_TTS_NULL_HANDLE_GUARD);
}

export function applyIosTtsNullHandlePatch(source) {
  if (hasIosTtsNullHandleGuard(source)) {
    return source;
  }
  if (!source.includes(IOS_TTS_OPTIONAL_ONLY_GUARD)) {
    throw new Error(
      "Unsupported react-native-sherpa-onnx TTS wrapper; expected the OfflineTts optional guard",
    );
  }
  return source.replace(IOS_TTS_OPTIONAL_ONLY_GUARD, IOS_TTS_NULL_HANDLE_GUARD);
}
