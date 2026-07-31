import AVFoundation
import XCTest
@testable import MrBroccoli

final class MrBroccoliNativeLifecycleTests: XCTestCase {
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
}
