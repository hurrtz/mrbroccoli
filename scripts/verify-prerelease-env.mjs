import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const PLACEHOLDER_VALUES = new Set([
  "changeme",
  "replace-me",
  "replace_me",
  "todo",
]);

function unquote(value) {
  if (
    value.length >= 2 &&
    ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'")))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

export function parseEnvText(text, sourceName) {
  const entries = new Map();
  const errors = [];

  text.split(/\r?\n/).forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const match = trimmed.match(/^([A-Z][A-Z0-9_]*)=(.*)$/);

    if (!match) {
      errors.push(`${sourceName}:${index + 1}: invalid environment entry`);
      return;
    }

    const [, key, rawValue] = match;

    if (entries.has(key)) {
      errors.push(`${sourceName}:${index + 1}: duplicate key ${key}`);
      return;
    }

    entries.set(key, unquote(rawValue.trim()));
  });

  return { entries, errors };
}

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {
      entries: new Map(),
      errors: [`${path.basename(filePath)} is missing`],
    };
  }

  return parseEnvText(fs.readFileSync(filePath, "utf8"), path.basename(filePath));
}

function isMissingValue(value) {
  const normalized = value?.trim().toLowerCase() ?? "";

  return (
    !normalized ||
    PLACEHOLDER_VALUES.has(normalized) ||
    /^<.+>$/.test(normalized)
  );
}

function validateKeystoreProperties(filePath) {
  if (!fs.existsSync(filePath)) {
    return [
      `MR_BROCCOLI_ANDROID_KEYSTORE_PROPERTIES_FILE does not exist: ${filePath}`,
    ];
  }

  const properties = new Map();

  fs.readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .forEach((line) => {
      const match = line.match(/^\s*([^#!][^=:\s]*)\s*[=:]\s*(.*)$/);

      if (match) {
        properties.set(match[1], match[2].trim());
      }
    });

  return ["storeFile", "storePassword", "keyAlias", "keyPassword"]
    .filter((key) => isMissingValue(properties.get(key)))
    .map((key) => `Android keystore property is missing: ${key}`);
}

export function validatePrereleaseEnvironment({
  contractPath,
  localPath,
  cwd = process.cwd(),
}) {
  const contract = parseEnvFile(contractPath);
  const local = parseEnvFile(localPath);
  const errors = [...contract.errors, ...local.errors];

  if (errors.length > 0) {
    return errors;
  }

  const contractKeys = new Set(contract.entries.keys());
  const localKeys = new Set(local.entries.keys());

  for (const key of contractKeys) {
    if (!localKeys.has(key)) {
      errors.push(`.env.local is missing key: ${key}`);
    }
  }

  for (const key of localKeys) {
    if (!contractKeys.has(key)) {
      errors.push(`.env.local contains an unknown key: ${key}`);
    }
  }

  const merged = new Map(contract.entries);

  for (const [key, value] of local.entries) {
    merged.set(key, value);
  }

  for (const key of contractKeys) {
    if (isMissingValue(merged.get(key))) {
      errors.push(`Required pre-release value is missing: ${key}`);
    }
  }

  const qwenRegion = merged.get("MR_BROCCOLI_QWEN_REGION");

  if (qwenRegion && !["singapore", "beijing"].includes(qwenRegion)) {
    errors.push(
      "MR_BROCCOLI_QWEN_REGION must be singapore or beijing so speech routes can be tested",
    );
  }

  const maxSpendValue = merged.get("MR_BROCCOLI_PRERELEASE_MAX_USD");
  const maxSpend = Number(maxSpendValue);

  if (
    !isMissingValue(maxSpendValue) &&
    (!Number.isFinite(maxSpend) || maxSpend <= 0)
  ) {
    errors.push("MR_BROCCOLI_PRERELEASE_MAX_USD must be a positive number");
  }

  const keystoreProperties = merged.get(
    "MR_BROCCOLI_ANDROID_KEYSTORE_PROPERTIES_FILE",
  );

  if (keystoreProperties) {
    errors.push(
      ...validateKeystoreProperties(path.resolve(cwd, keystoreProperties)),
    );
  }

  return errors;
}

export function runPrereleaseEnvironmentCheck({
  cwd = process.cwd(),
  stdout = process.stdout,
  stderr = process.stderr,
} = {}) {
  const errors = validatePrereleaseEnvironment({
    contractPath: path.join(cwd, ".env"),
    localPath: path.join(cwd, ".env.local"),
    cwd,
  });

  if (errors.length > 0) {
    stderr.write(
      [
        "Pre-release environment check failed before any provider request:",
        ...errors.map((error) => `- ${error}`),
        "",
      ].join("\n"),
    );
    return 1;
  }

  stdout.write(
    "Pre-release environment is complete; no provider request was made.\n",
  );
  return 0;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  process.exitCode = runPrereleaseEnvironmentCheck();
}
