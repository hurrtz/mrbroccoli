import AVFoundation
import XCTest
@testable import MrBroccoli

final class MrBroccoliNativeLifecycleTests: XCTestCase {
  private typealias SherpaArchiveProgressBlock = @convention(block) (
    Int64,
    Int64,
    Double
  ) -> Void
  private typealias SherpaArchiveExtractFunction = @convention(c) (
    AnyObject,
    Selector,
    NSString,
    NSString,
    Bool,
    SherpaArchiveProgressBlock?
  ) -> Unmanaged<NSDictionary>
  private static let sherpaArchiveFixture =
    "QlpoOTFBWSZTWXnMkgQAAJJ/2vYQAMBAgf/iOn97oG/v3+ACAAQAGAAAgAEIMAEY2sGqho9Jk0NMEGEaDTJp6mQ00yaNGhtQNVPSe1MKD1DINDQAAA09QANABKJNGIEjaEHogPUAANAPUaB4ppPcNWLCgWZQVwiD1EDLVIBaNRErgIXZOPRIWKYwrFBjyddDrbW0+T8GTfBGRHoePM3LKIWFisBCc3xROnwaRDjHUNHimRnIRSC1z5+FT1iLudpFLMD1AuWCcFw+FIdMc4IINPWoIs210CUFrrSIsz+fU1u7YCySAzOVrOkwn+si2Y8hUjhaC5Q0OYQxCf2CCE8eLFZ0w8xGgjBMCAzacpzv0Wlp+JTpoqDwgEke5jhB4KjfDWBRF0Bh+X0kxtClFQrI8V+abqJTNB5Gbg01s9BQR0m628dA/jXIPHEl7TTKYYM1KJ/i7kinChIPOZJAgA=="

  func testWaveformPlaybackStateStartsAndStopsDeterministically() {
    let coordinator = MrBroccoliWaveformCoordinator.shared
    coordinator.clear(channel: .output)

    coordinator.startPlayback(
      channel: .output,
      itemId: "native-test",
      samples: [0.2, 0.8, 0.4, 1.0],
      durationMs: 1_000
    )

    XCTAssertTrue(coordinator.samples(for: .output).contains { $0 > 0 })
    coordinator.stopPlayback(channel: .output, itemId: "native-test")
    XCTAssertTrue(coordinator.samples(for: .output).allSatisfy { $0 == 0 })
  }

  func testInterruptionPolicyDistinguishesPauseResumeAndTerminalEnd() {
    XCTAssertEqual(
      MrBroccoliWaveformInterruptionPolicy.action(
        rawType: AVAudioSession.InterruptionType.began.rawValue,
        rawOptions: 0
      ),
      .began
    )
    XCTAssertEqual(
      MrBroccoliWaveformInterruptionPolicy.action(
        rawType: AVAudioSession.InterruptionType.ended.rawValue,
        rawOptions: AVAudioSession.InterruptionOptions.shouldResume.rawValue
      ),
      .resume
    )
    XCTAssertEqual(
      MrBroccoliWaveformInterruptionPolicy.action(
        rawType: AVAudioSession.InterruptionType.ended.rawValue,
        rawOptions: 0
      ),
      .ended
    )
  }

  func testBackgroundVoiceTurnSurvivesRapidActivationAndLifecycleRaces() {
    let turn = MrBroccoliBackgroundVoiceTurn()
    let center = NotificationCenter.default

    for _ in 0..<100 {
      turn.setTurnActive(true)
      center.post(name: UIApplication.didEnterBackgroundNotification, object: nil)
      turn.setTurnActive(false)
      center.post(name: UIApplication.willEnterForegroundNotification, object: nil)
    }

    turn.invalidate()
  }

  func testAudioQueueStopAndInvalidationAreIdempotent() throws {
    let coordinator = MrBroccoliAudioQueueCoordinator()

    for _ in 0..<100 {
      try coordinator.stop()
    }

    coordinator.invalidate()
    coordinator.invalidate()
  }

  func testSherpaArchiveWriterAcceptsLibarchiveZeroSuccessResult() throws {
    // A tiny tar.bz2 containing one non-empty payload. The bundled libarchive
    // 3.x disk writer returns zero for the successful data block; the former
    // size-equality guard rejected it before any Kokoro model file was written.
    let fileManager = FileManager.default
    let temporaryRoot = fileManager.temporaryDirectory.appendingPathComponent(
      "mrbroccoli-archive-writer-\(UUID().uuidString)",
      isDirectory: true
    )
    let archive = temporaryRoot.appendingPathComponent("fixture.tar.bz2")
    let target = temporaryRoot.appendingPathComponent(
      "extracted",
      isDirectory: true
    )
    try fileManager.createDirectory(
      at: temporaryRoot,
      withIntermediateDirectories: true
    )
    defer { try? fileManager.removeItem(at: temporaryRoot) }
    try writeSherpaArchiveFixture(to: archive)
    let result = try extractSherpaArchive(archive, to: target)

    XCTAssertEqual(
      result["success"] as? Bool,
      true,
      result["reason"] as? String ?? "Archive extraction failed"
    )
    guard result["success"] as? Bool == true else { return }
    let payload = try String(
      contentsOf: target.appendingPathComponent("payload.txt"),
      encoding: .utf8
    )
    XCTAssertEqual(payload, "Kokoro archive writer regression fixture.\n")
  }

  func testSherpaArchiveWriterResolvesSymlinkedContainerParent() throws {
    let fileManager = FileManager.default
    let temporaryRoot = fileManager.temporaryDirectory.appendingPathComponent(
      "mrbroccoli-archive-symlink-\(UUID().uuidString)",
      isDirectory: true
    )
    let archive = temporaryRoot.appendingPathComponent("fixture.tar.bz2")
    let realParent = temporaryRoot.appendingPathComponent(
      "real-parent",
      isDirectory: true
    )
    let aliasParent = temporaryRoot.appendingPathComponent(
      "alias-parent",
      isDirectory: true
    )
    let target = aliasParent.appendingPathComponent("extracted", isDirectory: true)
    try fileManager.createDirectory(
      at: realParent,
      withIntermediateDirectories: true
    )
    defer { try? fileManager.removeItem(at: temporaryRoot) }
    try fileManager.createSymbolicLink(
      at: aliasParent,
      withDestinationURL: realParent
    )
    try writeSherpaArchiveFixture(to: archive)

    let result = try extractSherpaArchive(archive, to: target)

    XCTAssertEqual(
      result["success"] as? Bool,
      true,
      result["reason"] as? String ?? "Archive extraction failed"
    )
  }

  private func writeSherpaArchiveFixture(to archive: URL) throws {
    try XCTUnwrap(
      Data(base64Encoded: Self.sherpaArchiveFixture)
    ).write(to: archive)
  }

  private func extractSherpaArchive(
    _ archive: URL,
    to target: URL
  ) throws -> NSDictionary {
    let helperType = try XCTUnwrap(
      NSClassFromString("SherpaOnnxArchiveHelper") as? NSObject.Type
    )
    let helper = helperType.init()
    let selector = NSSelectorFromString(
      "extractTarBz2:targetPath:force:progress:"
    )
    XCTAssertTrue(helper.responds(to: selector))
    let extract = unsafeBitCast(
      helper.method(for: selector),
      to: SherpaArchiveExtractFunction.self
    )
    return extract(
      helper,
      selector,
      archive.path as NSString,
      target.path as NSString,
      true,
      nil
    ).takeUnretainedValue()
  }
}
