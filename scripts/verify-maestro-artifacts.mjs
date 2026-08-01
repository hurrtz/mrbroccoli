import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import {
  MAESTRO_ACCESSIBILITY_FLOW,
  MAESTRO_LAYOUT_FLOW,
  MAESTRO_LOCALIZED_FLOW,
  MAESTRO_SMOKE_FLOW,
  countScreenshots,
  readAppLanguages,
} from "./verify-maestro-suite.mjs";

function findPngFiles(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".png"))
    .map((entry) => path.join(entry.parentPath, entry.name))
    .filter((filePath) =>
      filePath.split(path.sep).includes("takeScreenshot"),
    )
    .sort();
}

function sha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest(
    "hex",
  );
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function validateScreenReaderEvidence(releaseRoot, platform) {
  const evidencePath = path.join(
    releaseRoot,
    "screen-reader",
    platform,
    "evidence.json",
  );
  const hierarchyPath = path.join(
    releaseRoot,
    "screen-reader",
    platform,
    "hierarchy.json",
  );

  if (!fs.existsSync(evidencePath) || !fs.existsSync(hierarchyPath)) {
    return [`${platform} screen-reader evidence is missing`];
  }

  try {
    const evidence = JSON.parse(fs.readFileSync(evidencePath, "utf8"));
    const expectedReader = platform === "android" ? "TalkBack" : "VoiceOver";
    const controls = Array.isArray(evidence.controls) ? evidence.controls : [];

    return evidence.platform === platform &&
      evidence.reader === expectedReader &&
      evidence.readerActive === true &&
      controls.length >= 7
      ? []
      : [`${platform} screen-reader evidence is incomplete`];
  } catch {
    return [`${platform} screen-reader evidence is invalid JSON`];
  }
}

export function verifyMaestroArtifacts(cwd = process.cwd()) {
  const releaseRoot = path.join(cwd, "artifacts", "maestro", "release");
  const physicalRoot = path.join(
    cwd,
    "artifacts",
    "maestro",
    "release-physical",
  );
  const languages = readAppLanguages(cwd);
  const localizedCount = countScreenshots(
    fs.readFileSync(path.join(cwd, MAESTRO_LOCALIZED_FLOW), "utf8"),
  );
  const smokeCount = countScreenshots(
    fs.readFileSync(path.join(cwd, MAESTRO_SMOKE_FLOW), "utf8"),
  );
  const layoutCount = countScreenshots(
    fs.readFileSync(path.join(cwd, MAESTRO_LAYOUT_FLOW), "utf8"),
  );
  const accessibilityCount = countScreenshots(
    fs.readFileSync(path.join(cwd, MAESTRO_ACCESSIBILITY_FLOW), "utf8"),
  );
  const expectedPlatformCount =
    smokeCount +
    layoutCount +
    accessibilityCount +
    languages.length * localizedCount;
  const errors = [];

  for (const platform of ["android", "ios"]) {
    const platformRoot = path.join(releaseRoot, platform);
    const actualCount = findPngFiles(platformRoot).length;

    if (actualCount !== expectedPlatformCount) {
      errors.push(
        `${platform} release screenshots: expected ${expectedPlatformCount}, found ${actualCount}`,
      );
    }

    errors.push(...validateScreenReaderEvidence(releaseRoot, platform));

    for (const language of languages) {
      const localeRoot = path.join(platformRoot, "locales", language);
      const localeCount = findPngFiles(localeRoot).length;

      if (localeCount !== localizedCount) {
        errors.push(
          `${platform}/${language}: expected ${localizedCount} screenshots, found ${localeCount}`,
        );
      }
    }
  }

  const physicalScreenshots = findPngFiles(
    path.join(physicalRoot, "android", "smoke"),
  );

  if (physicalScreenshots.length !== smokeCount) {
    errors.push(
      `physical Android smoke screenshots: expected ${smokeCount}, found ${physicalScreenshots.length}`,
    );
  }

  if (errors.length > 0) {
    return { errors, expectedPlatformCount, files: [] };
  }

  const files = [
    ...findPngFiles(path.join(releaseRoot, "android")),
    ...findPngFiles(path.join(releaseRoot, "ios")),
    ...physicalScreenshots,
  ].map((filePath) => ({
    path: path.relative(releaseRoot, filePath),
    sha256: sha256(filePath),
  }));
  const manifest = {
    generatedAt: new Date().toISOString(),
    platformScreenshotCount: expectedPlatformCount,
    physicalScreenshotCount: smokeCount,
    totalScreenshotCount: files.length,
    files,
  };
  fs.mkdirSync(releaseRoot, { recursive: true });
  fs.writeFileSync(
    path.join(releaseRoot, "review-manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  const cards = files
    .map(
      (file) => `<figure>
  <img loading="lazy" src="${escapeHtml(file.path)}" alt="${escapeHtml(file.path)}">
  <figcaption>${escapeHtml(file.path)}</figcaption>
</figure>`,
    )
    .join("\n");
  fs.writeFileSync(
    path.join(releaseRoot, "review-gallery.html"),
    `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<title>Mr Broccoli Maestro release review</title>
<style>
body { background: #101417; color: #f7f8f8; font: 14px system-ui; margin: 24px; }
main { display: grid; gap: 24px; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
figure { margin: 0; min-width: 0; }
img { background: #fff; border-radius: 12px; display: block; height: 480px; object-fit: contain; width: 100%; }
figcaption { overflow-wrap: anywhere; padding-top: 8px; }
</style>
<h1>Mr Broccoli Maestro release review</h1>
<p>${files.length} screenshots. Review every card for clipping, overlap, untranslated copy, direction, and missing content.</p>
<main>${cards}</main>
</html>
`,
  );

  return { errors: [], expectedPlatformCount, files };
}

export function runMaestroArtifactVerification({
  cwd = process.cwd(),
  stdout = process.stdout,
  stderr = process.stderr,
} = {}) {
  const result = verifyMaestroArtifacts(cwd);

  if (result.errors.length > 0) {
    stderr.write(
      [
        "Maestro release artifact verification failed:",
        ...result.errors.map((error) => `- ${error}`),
        "",
      ].join("\n"),
    );
    return 1;
  }

  stdout.write(
    `Maestro release gallery contains ${result.files.length} verified screenshots (${result.expectedPlatformCount} per simulator platform).\n`,
  );
  return 0;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  process.exitCode = runMaestroArtifactVerification();
}
