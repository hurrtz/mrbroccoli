import path from "node:path";
import { spawnSync } from "node:child_process";

const PREP_FLOW = ".maestro/flows/accessibility/screen-reader-home.yaml";

export function wait(milliseconds) {
  const signal = new Int32Array(new SharedArrayBuffer(4));
  Atomics.wait(signal, 0, 0, milliseconds);
}

export function executeCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: "utf8",
    stdio: options.capture ? "pipe" : "inherit",
  });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0 && !options.allowFailure) {
    const detail = (result.stderr || result.stdout || "").trim();
    throw new Error(
      `${command} exited with status ${result.status}${detail ? `: ${detail}` : ""}`,
    );
  }

  return {
    status: result.status ?? 1,
    stderr: result.stderr ?? "",
    stdout: result.stdout ?? "",
  };
}

export function capture(
  execute,
  command,
  args,
  cwd,
  allowFailure = false,
) {
  return execute(command, args, {
    allowFailure,
    capture: true,
    cwd,
  });
}

export function runPrepFlow({ appId, cwd, execute, outputDirectory, udid }) {
  execute(
    "maestro",
    [
      "test",
      "--config",
      ".maestro/config.yaml",
      "-e",
      `APP_ID=${appId}`,
      "--udid",
      udid,
      "--test-output-dir",
      path.join(outputDirectory, "prep"),
      PREP_FLOW,
    ],
    { cwd },
  );
}

export function captureHierarchy(execute, cwd, udid) {
  const output = capture(
    execute,
    "maestro",
    ["--udid", udid, "hierarchy"],
    cwd,
  ).stdout;

  try {
    return JSON.parse(output);
  } catch {
    throw new Error(`Maestro returned invalid hierarchy JSON for ${udid}`);
  }
}
