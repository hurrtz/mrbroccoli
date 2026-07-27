const fs = require("node:fs");
const path = require("node:path");
const {
  withAppDelegate,
  withDangerousMod,
} = require("@expo/config-plugins");

const BACKGROUND_HANDLER_MARKER =
  "MrBroccoliSetBackgroundDownloadCompletionHandler";
const LEGACY_BACKGROUND_HANDLER_CALL = `RNBackgroundDownloader.setCompletionHandlerWithIdentifier(
      identifier,
      completionHandler: completionHandler
    )`;
const BACKGROUND_HANDLER_CALL = `MrBroccoliSetBackgroundDownloadCompletionHandler(
      identifier,
      completionHandler
    )`;
const BACKGROUND_HANDLER = `

  public override func application(
    _ application: UIApplication,
    handleEventsForBackgroundURLSession identifier: String,
    completionHandler: @escaping () -> Void
  ) {
    ${BACKGROUND_HANDLER_CALL}
  }`;
const LEGACY_BRIDGING_IMPORT = "#import <RNBackgroundDownloader.h>";
const BRIDGING_DECLARATION = `FOUNDATION_EXPORT void MrBroccoliSetBackgroundDownloadCompletionHandler(
    NSString *identifier,
    void (^completionHandler)(void));`;

function addBackgroundHandler(contents) {
  if (contents.includes(LEGACY_BACKGROUND_HANDLER_CALL)) {
    return contents.replace(
      LEGACY_BACKGROUND_HANDLER_CALL,
      BACKGROUND_HANDLER_CALL,
    );
  }

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

function configureBridgingHeader(contents) {
  const withoutLegacyImport = contents
    .replace(`${LEGACY_BRIDGING_IMPORT}\n`, "")
    .replace(LEGACY_BRIDGING_IMPORT, "");
  if (withoutLegacyImport.includes(BACKGROUND_HANDLER_MARKER)) {
    return withoutLegacyImport;
  }

  const separator =
    withoutLegacyImport && !withoutLegacyImport.endsWith("\n") ? "\n" : "";
  return `${withoutLegacyImport}${separator}${BRIDGING_DECLARATION}\n`;
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
      const current = fs.existsSync(bridgingHeaderPath)
        ? fs.readFileSync(bridgingHeaderPath, "utf8")
        : "";
      const configured = configureBridgingHeader(current);

      if (configured !== current) {
        fs.writeFileSync(bridgingHeaderPath, configured);
      }

      return nextConfig;
    },
  ]);
}

module.exports = withKokoroBackgroundDownload;
module.exports.addBackgroundHandler = addBackgroundHandler;
module.exports.configureBridgingHeader = configureBridgingHeader;
