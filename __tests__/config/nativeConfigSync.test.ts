import { spawnSync } from "node:child_process";
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
        "Native configuration matches app.json across 19 checks.\n",
    });
  });
});
