import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const LOCALE_PATTERN = /^## (.+?) \(`([^`]+)`\)$/;
const FIELD_PATTERN = /^### (.+)$/;

// Store-enforced limits. A field longer than its limit is rejected at upload,
// so this runs before anyone pastes the copy into a console.
export const LISTING_FILES = Object.freeze({
  "google-play-listing-translations.md": Object.freeze({
    "Short description": 80,
    "Full description": 4000,
  }),
  "app-store-listing-translations.md": Object.freeze({
    Subtitle: 30,
    "Promotional text": 170,
    Keywords: 100,
    Description: 4000,
  }),
});

// Copy that must never appear in a store listing: Google Play restricts price
// and promotional claims in listing assets, and the app makes no medical,
// legal or financial advice claim.
const FORBIDDEN = Object.freeze([
  { pattern: /(?:^|\s)(?:[€$£]\s?\d|\d+[.,]\d{2}\s?(?:€|EUR|USD))/i, label: "a price" },
  { pattern: /\b(?:#1|number one|best[- ]in[- ]class|award[- ]winning)\b/i, label: "a ranking or award claim" },
]);

export function parseListingDocument(text) {
  const entries = [];
  let locale = null;
  let field = null;
  let inFence = false;
  let buffer = [];

  const flush = () => {
    if (locale && field) {
      locale.fields.push({ name: field, value: buffer.join("\n").trim() });
    }
    field = null;
    buffer = [];
  };

  for (const line of text.split("\n")) {
    if (line.startsWith("```")) {
      if (inFence) {
        inFence = false;
        flush();
      } else if (field) {
        inFence = true;
        buffer = [];
      }
      continue;
    }
    if (inFence) {
      buffer.push(line);
      continue;
    }

    const localeMatch = LOCALE_PATTERN.exec(line);
    if (localeMatch) {
      locale = { name: localeMatch[1], tag: localeMatch[2], fields: [] };
      entries.push(locale);
      field = null;
      continue;
    }

    const fieldMatch = FIELD_PATTERN.exec(line);
    if (fieldMatch && locale) {
      field = fieldMatch[1];
    }
  }

  return entries;
}

export function validateListingDocument({ text, limits, fileName }) {
  const errors = [];
  const entries = parseListingDocument(text);

  if (entries.length === 0) {
    errors.push(`${fileName} contains no locale sections.`);
    return { entries, errors };
  }

  const tags = entries.map((entry) => entry.tag);
  const duplicates = tags.filter((tag, index) => tags.indexOf(tag) !== index);
  if (duplicates.length > 0) {
    errors.push(`${fileName} repeats locale ${[...new Set(duplicates)].join(", ")}.`);
  }

  const expected = Object.keys(limits);
  for (const entry of entries) {
    const present = entry.fields.map((entryField) => entryField.name);
    for (const name of expected) {
      if (!present.includes(name)) {
        errors.push(`${fileName} ${entry.tag} is missing "${name}".`);
      }
    }

    for (const { name, value } of entry.fields) {
      const limit = limits[name];
      if (limit === undefined) continue;
      if (value.length === 0) {
        errors.push(`${fileName} ${entry.tag} "${name}" is empty.`);
        continue;
      }
      if (value.length > limit) {
        errors.push(
          `${fileName} ${entry.tag} "${name}" is ${value.length} characters, over the ${limit} limit.`,
        );
      }
      for (const { pattern, label } of FORBIDDEN) {
        if (pattern.test(value)) {
          errors.push(`${fileName} ${entry.tag} "${name}" contains ${label}.`);
        }
      }
    }
  }

  return { entries, errors };
}

export function runListingVerification({
  docsDir = path.join(process.cwd(), "docs"),
  stdout = process.stdout,
  stderr = process.stderr,
} = {}) {
  const failures = [];
  const summaries = [];
  let referenceTags = null;

  for (const [fileName, limits] of Object.entries(LISTING_FILES)) {
    const filePath = path.join(docsDir, fileName);
    if (!fs.existsSync(filePath)) {
      failures.push(`${fileName} is missing.`);
      continue;
    }

    const { entries, errors } = validateListingDocument({
      text: fs.readFileSync(filePath, "utf8"),
      limits,
      fileName,
    });
    failures.push(...errors);

    const tags = entries.map((entry) => entry.name);
    if (referenceTags === null) {
      referenceTags = { fileName, tags };
    } else if (tags.join("|") !== referenceTags.tags.join("|")) {
      failures.push(
        `${fileName} does not list the same languages, in the same order, as ${referenceTags.fileName}.`,
      );
    }

    summaries.push(`${fileName}: ${entries.length} locales`);
  }

  if (failures.length > 0) {
    stderr.write(`Store listing verification failed:\n`);
    for (const failure of failures) stderr.write(`  - ${failure}\n`);
    return 1;
  }

  stdout.write(`${summaries.join(", ")}; every field within its store limit.\n`);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = runListingVerification();
}
