import ActivityKit
import Foundation

@available(iOS 16.1, *)
struct MrBroccoliVoiceActivityAttributes: ActivityAttributes {
  struct ContentState: Codable, Hashable {
    var canRepeat: Bool
    var continueLabel: String
    var controlMode: String
    var phase: String
    var expectedSpeechAt: Date?
    var phaseLabel: String
    var pauseLabel: String
    var repeatLabel: String
    var statusLabel: String
    var stopLabel: String
  }

  var startedAt: Date
}
