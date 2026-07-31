import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const RELEASE_NOTES_PATTERN = /^google-play-release-notes-(\d+\.\d+\.\d+)\.md$/;
const ENTRY_PATTERN = /<([A-Za-z]{2,3}(?:-[A-Za-z]{2})?)>\s*\n([\s\S]*?)\n<\/\1>/g;

function compareVersions(left, right) {
  const leftParts = left.split(".").map(Number);
  const rightParts = right.split(".").map(Number);

  for (let index = 0; index < 3; index += 1) {
    if (leftParts[index] !== rightParts[index]) {
      return leftParts[index] - rightParts[index];
    }
  }

  return 0;
}

export function parseReleaseNotes(text) {
  const entries = [];

  for (const match of text.matchAll(ENTRY_PATTERN)) {
    entries.push({
      locale: match[1],
      text: match[2].trim(),
    });
  }

  return entries;
}

export function validateReleaseNotes({
  currentText,
  previousText,
  maxCharacters = 500,
}) {
  const errors = [];
  const currentEntries = parseReleaseNotes(currentText);
  const previousEntries = parseReleaseNotes(previousText);
  const currentLocales = currentEntries.map((entry) => entry.locale);
  const previousLocales = previousEntries.map((entry) => entry.locale);

  if (new Set(currentLocales).size !== currentLocales.length) {
    errors.push("Release notes contain duplicate locale tags");
  }

  if (currentLocales.join("\n") !== previousLocales.join("\n")) {
    errors.push(
      "Release note locale tags or ordering differ from the preceding release",
    );
  }

  for (const entry of currentEntries) {
    const characterCount = [...entry.text].length;

    if (!entry.text) {
      errors.push(`${entry.locale} release notes are empty`);
    }
    if (characterCount > maxCharacters) {
      errors.push(
        `${entry.locale} release notes contain ${characterCount} characters; maximum is ${maxCharacters}`,
      );
    }
  }

  const normalized = currentText.trim();
  const parsedLength = currentEntries
    .map((entry) => `<${entry.locale}>\n${entry.text}\n</${entry.locale}>`)
    .join("\n\n").length;

  if (parsedLength !== normalized.length) {
    errors.push("Release notes contain text outside valid locale blocks");
  }

  return { entries: currentEntries, errors };
}

export function findLatestReleaseNoteFiles(cwd = process.cwd()) {
  const docsDirectory = path.join(cwd, "docs");
  const files = fs
    .readdirSync(docsDirectory)
    .flatMap((name) => {
      const match = name.match(RELEASE_NOTES_PATTERN);
      return match ? [{ name, version: match[1] }] : [];
    })
    .sort((left, right) => compareVersions(left.version, right.version));

  if (files.length < 2) {
    throw new Error("At least two localized release-note files are required");
  }

  return files.slice(-2).map((entry) => path.join(docsDirectory, entry.name));
}

export function runReleaseNotesVerification({
  cwd = process.cwd(),
  stdout = process.stdout,
  stderr = process.stderr,
} = {}) {
  try {
    const [previousPath, currentPath] = findLatestReleaseNoteFiles(cwd);
    const result = validateReleaseNotes({
      currentText: fs.readFileSync(currentPath, "utf8"),
      previousText: fs.readFileSync(previousPath, "utf8"),
    });

    if (result.errors.length > 0) {
      stderr.write(
        [
          `Localized release-note verification failed for ${path.basename(currentPath)}:`,
          ...result.errors.map((error) => `- ${error}`),
          "",
        ].join("\n"),
      );
      return 1;
    }

    stdout.write(
      `${path.basename(currentPath)} contains ${result.entries.length} complete locale blocks within 500 characters each.\n`,
    );
    return 0;
  } catch (error) {
    stderr.write(
      `Localized release-note verification failed: ${
        error instanceof Error ? error.message : String(error)
      }\n`,
    );
    return 1;
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  process.exitCode = runReleaseNotesVerification();
}
