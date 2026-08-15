import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  MAESTRO_COLOR_SCHEMES,
  readAppLanguages,
} from "./verify-maestro-suite.mjs";
import { verifyMaestroArtifacts } from "./verify-maestro-artifacts.mjs";

function writePng(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, "fixture-png");
}

test("verifies every locale and emits a review manifest and gallery", () => {
  const cwd = fs.mkdtempSync(
    path.join(os.tmpdir(), "mrbroccoli-maestro-artifacts-"),
  );

  try {
    const registryTarget = path.join(cwd, "src", "i18n", "localeRegistry.ts");
    fs.mkdirSync(path.dirname(registryTarget), { recursive: true });
    fs.copyFileSync(
      path.join(process.cwd(), "src", "i18n", "localeRegistry.ts"),
      registryTarget,
    );
    const flowFiles = [
      [".maestro/templates/localized-coverage.yaml", "locale"],
      [".maestro/flows/smoke/home-and-settings.yaml", "smoke"],
      [".maestro/flows/visual/drive-three-routes-landscape.yaml", "layout"],
      [".maestro/flows/visual/accessibility-display.yaml", "accessibility"],
    ];

    for (const [relativePath, name] of flowFiles) {
      const filePath = path.join(cwd, relativePath);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(
        filePath,
        `- takeScreenshot:\n    path: ${name}\n`,
      );
    }

    const languages = readAppLanguages(cwd);
    const releaseRoot = path.join(cwd, "artifacts", "maestro", "release");

    for (const platform of ["android", "ios"]) {
      const screenReaderRoot = path.join(
        releaseRoot,
        "screen-reader",
        platform,
      );
      fs.mkdirSync(screenReaderRoot, { recursive: true });
      fs.writeFileSync(
        path.join(screenReaderRoot, "evidence.json"),
        JSON.stringify({
          controls: Array.from({ length: 7 }, (_, index) => ({ id: index })),
          platform,
          reader: platform === "android" ? "TalkBack" : "VoiceOver",
          readerActive: true,
        }),
      );
      fs.writeFileSync(
        path.join(screenReaderRoot, "hierarchy.json"),
        JSON.stringify({ attributes: {}, children: [] }),
      );
      for (const colorScheme of MAESTRO_COLOR_SCHEMES) {
        writePng(
          path.join(
            releaseRoot,
            platform,
            colorScheme,
            "smoke",
            "takeScreenshot",
            "smoke.png",
          ),
        );
        writePng(
          path.join(
            releaseRoot,
            platform,
            colorScheme,
            "layout",
            "takeScreenshot",
            "layout.png",
          ),
        );

        for (const language of languages) {
          writePng(
            path.join(
              releaseRoot,
              platform,
              colorScheme,
              "locales",
              language,
              "takeScreenshot",
              `${language}.png`,
            ),
          );
        }
      }
      writePng(
        path.join(
          releaseRoot,
          platform,
          "accessibility",
          "takeScreenshot",
          "accessibility.png",
        ),
      );
    }

    for (const colorScheme of MAESTRO_COLOR_SCHEMES) {
      writePng(
        path.join(
          cwd,
          "artifacts",
          "maestro",
          "release-physical",
          "android",
          colorScheme,
          "smoke",
          "takeScreenshot",
          "physical.png",
        ),
      );
    }

    const result = verifyMaestroArtifacts(cwd);

    assert.deepEqual(result.errors, []);
    const expectedPlatformCount = (languages.length + 2) * 2 + 1;
    assert.equal(result.expectedPlatformCount, expectedPlatformCount);
    assert.equal(result.files.length, expectedPlatformCount * 2 + 2);
    assert.ok(
      fs.existsSync(path.join(releaseRoot, "review-manifest.json")),
    );
    assert.ok(fs.existsSync(path.join(releaseRoot, "review-gallery.html")));
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
});
