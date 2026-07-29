import AVFoundation
import Foundation

enum MrBroccoliWaveformAudioAnalysis {
  static func meteringDecibels(from buffer: AVAudioPCMBuffer) -> Double {
    let frameCount = Int(buffer.frameLength)
    let channelCount = Int(buffer.format.channelCount)

    guard frameCount > 0, channelCount > 0 else {
      return -160
    }

    var energySum: Double = 0
    var sampleCount = 0

    for frameIndex in 0..<frameCount {
      for channelIndex in 0..<channelCount {
        let sample = Double(
          sampleValue(
            in: buffer,
            channel: channelIndex,
            frame: frameIndex
          )
        )
        energySum += sample * sample
        sampleCount += 1
      }
    }

    guard sampleCount > 0 else {
      return -160
    }

    let rms = sqrt(energySum / Double(sampleCount))
    guard rms > 0.000_000_01 else {
      return -160
    }

    return min(0, max(-160, 20 * log10(rms)))
  }

  static func extractPeakSamples(
    from buffer: AVAudioPCMBuffer,
    targetCount: Int
  ) -> [Float] {
    let frameCount = Int(buffer.frameLength)
    guard frameCount > 0, targetCount > 0 else {
      return Array(repeating: 0, count: max(0, targetCount))
    }

    let channelCount = Int(buffer.format.channelCount)
    let chunkSize = max(1, frameCount / targetCount)

    return (0..<targetCount).map { index in
      let start = index * chunkSize
      let end =
        index == targetCount - 1
          ? frameCount
          : min(frameCount, start + chunkSize)

      var peakSample: Float = 0

      if start >= end {
        return peakSample
      }

      for frameIndex in start..<end {
        let sample =
          (0..<channelCount).reduce(Float.zero) { partialResult, channelIndex in
            partialResult + sampleValue(in: buffer, channel: channelIndex, frame: frameIndex)
          } / Float(max(1, channelCount))

        if abs(sample) > abs(peakSample) {
          peakSample = sample
        }
      }

      return clamp(sample: peakSample * 1.5)
    }
  }

  static func sampleValue(
    in buffer: AVAudioPCMBuffer,
    channel: Int,
    frame: Int
  ) -> Float {
    switch buffer.format.commonFormat {
    case .pcmFormatFloat32:
      return buffer.floatChannelData?[channel][frame] ?? 0
    case .pcmFormatFloat64:
      let audioBuffers = UnsafeMutableAudioBufferListPointer(buffer.mutableAudioBufferList)
      guard
        channel < audioBuffers.count,
        let data = audioBuffers[channel].mData?.assumingMemoryBound(to: Double.self)
      else {
        return 0
      }

      return Float(data[frame])
    case .pcmFormatInt16:
      return Float(buffer.int16ChannelData?[channel][frame] ?? 0) / Float(Int16.max)
    case .pcmFormatInt32:
      return Float(buffer.int32ChannelData?[channel][frame] ?? 0) / Float(Int32.max)
    default:
      return 0
    }
  }

  static func clamp(sample: Float) -> Float {
    min(1, max(-1, sample))
  }
}
