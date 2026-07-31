import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("native app configuration", () => {
  it("matches the app.json values that Expo cannot sync automatically", () => {
    const result = spawnSync(
      process.execPath,
      [resolve(process.cwd(), "scripts/verify-native-config-sync.mjs")],
      {
        cwd: process.cwd(),
        encoding: "utf8",
      },
    );

    expect({
      status: result.status,
      stderr: result.stderr,
      stdout: result.stdout,
    }).toEqual({
      status: 0,
      stderr: "",
      stdout:
        "Native configuration matches app.json across 43 checks.\n",
    });
  });

  it("increments both store build counters in a version bump", () => {
    const appConfig = require("../../app.json");
    const currentVersion = appConfig.expo.version as string;
    const [major, minor, patch] = currentVersion.split(".").map(Number);
    const targetVersion = `${major}.${minor}.${patch + 1}`;
    const androidBuild = readFileSync(
      resolve(process.cwd(), "android/app/build.gradle"),
      "utf8",
    );
    const iosInfo = readFileSync(
      resolve(process.cwd(), "ios/MrBroccoli/Info.plist"),
      "utf8",
    );
    const androidVersionCode = Number(
      androidBuild.match(/^\s*versionCode\s+(\d+)\s*$/m)?.[1],
    );
    const iosBuildNumber = Number(
      iosInfo.match(
        /<key>CFBundleVersion<\/key>\s*<string>(\d+)<\/string>/,
      )?.[1],
    );
    const result = spawnSync(
      process.execPath,
      [
        resolve(process.cwd(), "scripts/bump-version.mjs"),
        "--dry-run",
        targetVersion,
      ],
      {
        cwd: process.cwd(),
        encoding: "utf8",
      },
    );

    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain(
      `Would bump ${currentVersion} -> ${targetVersion}, Android versionCode ${androidVersionCode} -> ${androidVersionCode + 1}, and iOS build ${iosBuildNumber} -> ${iosBuildNumber + 1}.`,
    );
  });
});
