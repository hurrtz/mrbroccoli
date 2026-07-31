import AVFoundation

enum MrBroccoliWaveformInterruptionAction: Equatable {
  case began
  case ended
  case resume
}

enum MrBroccoliWaveformInterruptionPolicy {
  static func action(
    rawType: UInt?,
    rawOptions: UInt
  ) -> MrBroccoliWaveformInterruptionAction {
    if rawType.flatMap(AVAudioSession.InterruptionType.init(rawValue:)) == .began {
      return .began
    }

    let options = AVAudioSession.InterruptionOptions(rawValue: rawOptions)
    return options.contains(.shouldResume) ? .resume : .ended
  }
}
