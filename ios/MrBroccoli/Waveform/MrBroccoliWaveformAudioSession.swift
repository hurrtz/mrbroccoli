import AVFoundation
import Foundation

enum MrBroccoliWaveformAudioSession {
  static func activateRecordingSession() throws {
    let session = AVAudioSession.sharedInstance()
    try session.setCategory(
      .playAndRecord,
      mode: .measurement,
      options: [.defaultToSpeaker, .allowBluetoothHFP]
    )
    try session.setActive(true)
  }

  static func deactivate() {
    try? AVAudioSession.sharedInstance().setActive(
      false,
      options: [.notifyOthersOnDeactivation]
    )
  }

  static func currentInputRouteLabel() -> String {
    switch AVAudioSession.sharedInstance().currentRoute.inputs.first?.portType {
    case .bluetoothHFP:
      return "bluetooth-hfp"
    case .bluetoothLE:
      return "bluetooth-le-headset"
    case .headsetMic:
      return "wired-headset"
    case .usbAudio:
      return "usb-headset"
    case .builtInMic:
      return "built-in"
    case .none:
      return "system-default"
    default:
      return "other"
    }
  }
}
