const fs = require("node:fs");
const path = require("node:path");
const {
  withAppDelegate,
  withDangerousMod,
} = require("@expo/config-plugins");

const BACKGROUND_HANDLER_MARKER =
  "RNBackgroundDownloader.setCompletionHandlerWithIdentifier";
const BACKGROUND_HANDLER = `

  public override func application(
    _ application: UIApplication,
    handleEventsForBackgroundURLSession identifier: String,
    completionHandler: @escaping () -> Void
  ) {
    RNBackgroundDownloader.setCompletionHandlerWithIdentifier(
      identifier,
      completionHandler: completionHandler
    )
  }`;

function addBackgroundHandler(contents) {
  if (contents.includes(BACKGROUND_HANDLER_MARKER)) {
    return contents;
  }

  const delegateEnd = "\n}\n\nclass ReactNativeDelegate";
  if (!contents.includes(delegateEnd)) {
    throw new Error(
      "Could not locate the AppDelegate class while configuring Kokoro downloads.",
    );
  }

  return contents.replace(
    delegateEnd,
    `${BACKGROUND_HANDLER}${delegateEnd}`,
  );
}

function withKokoroBackgroundDownload(config) {
  config = withAppDelegate(config, (nextConfig) => {
    if (nextConfig.modResults.language !== "swift") {
      throw new Error("Kokoro background downloads require a Swift AppDelegate.");
    }

    nextConfig.modResults.contents = addBackgroundHandler(
      nextConfig.modResults.contents,
    );
    return nextConfig;
  });

  return withDangerousMod(config, [
    "ios",
    async (nextConfig) => {
      const projectName = nextConfig.modRequest.projectName;
      const bridgingHeaderPath = path.join(
        nextConfig.modRequest.platformProjectRoot,
        projectName,
        `${projectName}-Bridging-Header.h`,
      );
      const importLine = "#import <RNBackgroundDownloader.h>";
      const current = fs.existsSync(bridgingHeaderPath)
        ? fs.readFileSync(bridgingHeaderPath, "utf8")
        : "";

      if (!current.includes(importLine)) {
        const separator = current && !current.endsWith("\n") ? "\n" : "";
        fs.writeFileSync(
          bridgingHeaderPath,
          `${current}${separator}${importLine}\n`,
        );
      }

      return nextConfig;
    },
  ]);
}

module.exports = withKokoroBackgroundDownload;
module.exports.addBackgroundHandler = addBackgroundHandler;
