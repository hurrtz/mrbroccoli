jest.mock("@expo/config-plugins", () => ({
  withAppDelegate: jest.fn(),
  withDangerousMod: jest.fn(),
}));

const {
  addBackgroundHandler,
  configureBridgingHeader,
} = require("../../plugins/withKokoroBackgroundDownload");

describe("withKokoroBackgroundDownload", () => {
  it("keeps React Native headers out of the Swift bridging header", () => {
    const configured = configureBridgingHeader(
      "#import <Foundation/Foundation.h>\n#import <RNBackgroundDownloader.h>\n",
    );

    expect(configured).not.toContain("RNBackgroundDownloader.h");
    expect(configured).toContain(
      "MrBroccoliSetBackgroundDownloadCompletionHandler",
    );
    expect(configureBridgingHeader(configured)).toBe(configured);
  });

  it("migrates the legacy AppDelegate call to the narrow bridge", () => {
    const legacy = `class AppDelegate {
  public override func application(
    _ application: UIApplication,
    handleEventsForBackgroundURLSession identifier: String,
    completionHandler: @escaping () -> Void
  ) {
    RNBackgroundDownloader.setCompletionHandlerWithIdentifier(
      identifier,
      completionHandler: completionHandler
    )
  }
}

class ReactNativeDelegate {}`;

    const configured = addBackgroundHandler(legacy);

    expect(configured).not.toContain(
      "RNBackgroundDownloader.setCompletionHandlerWithIdentifier",
    );
    expect(configured).toContain(
      "MrBroccoliSetBackgroundDownloadCompletionHandler",
    );
  });

  it("adds the bridged handler to a fresh AppDelegate", () => {
    const configured = addBackgroundHandler(`class AppDelegate {
}

class ReactNativeDelegate {}`);

    expect(configured).toContain(
      "MrBroccoliSetBackgroundDownloadCompletionHandler",
    );
    expect(addBackgroundHandler(configured)).toBe(configured);
  });
});
