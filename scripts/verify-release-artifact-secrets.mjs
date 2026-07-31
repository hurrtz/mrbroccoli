import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { pathToFileURL } from "node:url";

import { parseEnvText } from "./verify-prerelease-env.mjs";

const ARCHIVE_EXTENSIONS = new Set([".aab", ".apk", ".ipa", ".zip"]);
const MINIMUM_SECRET_LENGTH = 8;

function parseProperties(text) {
  const entries = new Map();

  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*([^#!][^=:\s]*)\s*[=:]\s*(.*)$/);

    if (match) {
      entries.set(match[1], match[2].trim());
    }
  }

  return entries;
}

export function collectReleaseSecrets(cwd = process.cwd()) {
  const localPath = path.join(cwd, ".env.local");

  if (!fs.existsSync(localPath)) {
    throw new Error(".env.local is required for release artifact verification");
  }

  const parsed = parseEnvText(fs.readFileSync(localPath, "utf8"), ".env.local");

  if (parsed.errors.length > 0) {
    throw new Error(parsed.errors.join("; "));
  }

  const secrets = [...parsed.entries]
    .filter(
      ([key, value]) =>
        key.endsWith("_API_KEY") && value.length >= MINIMUM_SECRET_LENGTH,
    )
    .map(([name, value]) => ({ name, value: Buffer.from(value) }));
  const propertiesPath = parsed.entries.get(
    "MR_BROCCOLI_ANDROID_KEYSTORE_PROPERTIES_FILE",
  );

  if (propertiesPath) {
    const resolvedPath = path.resolve(cwd, propertiesPath);

    if (fs.existsSync(resolvedPath)) {
      const properties = parseProperties(fs.readFileSync(resolvedPath, "utf8"));

      for (const property of ["storePassword", "keyPassword"]) {
        const value = properties.get(property) ?? "";

        if (value.length >= MINIMUM_SECRET_LENGTH) {
          secrets.push({
            name: `ANDROID_KEYSTORE_${property}`,
            value: Buffer.from(value),
          });
        }
      }
    }
  }

  if (secrets.length === 0) {
    throw new Error("No release secrets were available for artifact verification");
  }

  return secrets;
}

export function findSecretNames(buffer, secrets) {
  return secrets
    .filter(({ value }) => buffer.includes(value))
    .map(({ name }) => name);
}

function collectFiles(target) {
  const stat = fs.statSync(target);

  if (stat.isFile()) {
    return [target];
  }
  if (!stat.isDirectory()) {
    return [];
  }

  return fs
    .readdirSync(target, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(entry.parentPath, entry.name));
}

function createChunkScanner(secrets) {
  const hits = new Set();
  const maximumLength = Math.max(...secrets.map(({ value }) => value.length));
  let tail = Buffer.alloc(0);

  return {
    push(chunk) {
      const combined = Buffer.concat([tail, chunk]);

      for (const name of findSecretNames(combined, secrets)) {
        hits.add(name);
      }

      tail = combined.subarray(
        Math.max(0, combined.length - maximumLength + 1),
      );
    },
    result() {
      return [...hits].sort();
    },
  };
}

async function scanArchive(target, secrets) {
  const scanner = createChunkScanner(secrets);
  const child = spawn("unzip", ["-p", target], {
    stdio: ["ignore", "pipe", "pipe"],
  });
  let stderr = "";

  child.stdout.on("data", (chunk) => scanner.push(chunk));
  child.stderr.setEncoding("utf8");
  child.stderr.on("data", (chunk) => {
    stderr += chunk;
  });

  const exitCode = await new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("close", resolve);
  });

  if (exitCode !== 0) {
    throw new Error(
      `Could not inspect archive ${target}: ${stderr.trim() || `unzip exited ${exitCode}`}`,
    );
  }

  return scanner.result();
}

async function scanTarget(target, secrets) {
  const resolvedTarget = path.resolve(target);

  if (!fs.existsSync(resolvedTarget)) {
    throw new Error(`Release artifact does not exist: ${resolvedTarget}`);
  }

  if (
    fs.statSync(resolvedTarget).isFile() &&
    ARCHIVE_EXTENSIONS.has(path.extname(resolvedTarget).toLowerCase())
  ) {
    return scanArchive(resolvedTarget, secrets);
  }

  const hits = new Set();

  for (const file of collectFiles(resolvedTarget)) {
    for (const name of findSecretNames(fs.readFileSync(file), secrets)) {
      hits.add(name);
    }
  }

  return [...hits].sort();
}

export async function verifyReleaseArtifactSecrets({
  cwd = process.cwd(),
  targets,
  stdout = process.stdout,
  stderr = process.stderr,
}) {
  const secrets = collectReleaseSecrets(cwd);
  const failures = [];

  for (const target of targets) {
    const hits = await scanTarget(path.resolve(cwd, target), secrets);

    if (hits.length > 0) {
      failures.push(`${target}: ${hits.join(", ")}`);
    }
  }

  if (failures.length > 0) {
    stderr.write(
      [
        "Release artifact contains configured secret values:",
        ...failures.map((failure) => `- ${failure}`),
        "",
      ].join("\n"),
    );
    return 1;
  }

  stdout.write(
    `Release artifact secret scan passed for ${targets.length} target(s).\n`,
  );
  return 0;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const targets = process.argv.slice(2);

  if (targets.length === 0) {
    process.stderr.write(
      "Usage: node scripts/verify-release-artifact-secrets.mjs <artifact> [...]\n",
    );
    process.exitCode = 1;
  } else {
    try {
      process.exitCode = await verifyReleaseArtifactSecrets({ targets });
    } catch (error) {
      process.stderr.write(
        `Release artifact secret scan failed: ${
          error instanceof Error ? error.message : String(error)
        }\n`,
      );
      process.exitCode = 1;
    }
  }
}
