import ActivityKit
import Foundation

@available(iOS 16.1, *)
struct MrBroccoliVoiceActivityAttributes: ActivityAttributes {
  struct ContentState: Codable, Hashable {
    var phase: String
    var expectedSpeechAt: Date?
    var phaseLabel: String
    var statusLabel: String
  }

  var startedAt: Date
}
