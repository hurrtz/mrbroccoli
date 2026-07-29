import AVFoundation
import Foundation

final class MrBroccoliWaveformRecorder {
  private static let inputTapBufferSize: AVAudioFrameCount = 512
  private static let meteringIntervalSeconds: TimeInterval = 0.15
  // Speech-grade recording target. STT models downsample to 16 kHz anyway, so
  // recording mono 16-bit PCM at 16 kHz keeps the uploaded WAV ~4-6x smaller
  // than the hardware-rate 32-bit float capture used previously.
  private static let recordingSampleRate: Double = 16_000
  private static let recordingChannelCount: AVAudioChannelCount = 1

  var onEvent: (([String: Any]) -> Void)?

  private let stateLock = NSLock()
  private var audioEngine: AVAudioEngine?
  private var audioFile: AVAudioFile?
  private var inputToFileConverter: AVAudioConverter?
  private var fileFormat: AVAudioFormat?
  private var activeSessionId: String?
  private var outputURL: URL?
  private var pendingRecordingErrorSessionId: String?
  private var lastMeteringEmissionAt: TimeInterval = 0
  private var routeChangeObserver: NSObjectProtocol?
  private var interruptionObserver: NSObjectProtocol?

  func startRecording(
    sessionId: String,
    outputURL: URL
  ) throws -> URL {
    guard activeSessionId == nil else {
      throw NSError(
        domain: "MrBroccoliNativeWaveform",
        code: 100,
        userInfo: [NSLocalizedDescriptionKey: "Another native waveform recording session is already active."]
      )
    }

    try FileManager.default.createDirectory(
      at: outputURL.deletingLastPathComponent(),
      withIntermediateDirectories: true
    )

    try MrBroccoliWaveformAudioSession.activateRecordingSession()

    let engine = AVAudioEngine()
    let inputNode = engine.inputNode
    let inputFormat = inputNode.inputFormat(forBus: 0)

    guard inputFormat.channelCount > 0 else {
      throw NSError(
        domain: "MrBroccoliNativeWaveform",
        code: 101,
        userInfo: [NSLocalizedDescriptionKey: "No microphone input channels are available."]
      )
    }

    // Write the uploaded recording as mono 16-bit PCM at 16 kHz. The live
    // waveform tap still reads the microphone's native input format; only the
    // persisted file is downsampled to keep STT uploads small.
    let fileSettings: [String: Any] = [
      AVFormatIDKey: kAudioFormatLinearPCM,
      AVSampleRateKey: Self.recordingSampleRate,
      AVNumberOfChannelsKey: Self.recordingChannelCount,
      AVLinearPCMBitDepthKey: 16,
      AVLinearPCMIsFloatKey: false,
      AVLinearPCMIsBigEndianKey: false,
      AVLinearPCMIsNonInterleaved: false,
    ]

    guard
      let fileFormat = AVAudioFormat(
        commonFormat: .pcmFormatInt16,
        sampleRate: Self.recordingSampleRate,
        channels: Self.recordingChannelCount,
        interleaved: true
      ),
      let converter = AVAudioConverter(from: inputFormat, to: fileFormat)
    else {
      throw NSError(
        domain: "MrBroccoliNativeWaveform",
        code: 102,
        userInfo: [
          NSLocalizedDescriptionKey:
            "Unable to prepare the speech recording format.",
        ]
      )
    }

    let file = try AVAudioFile(
      forWriting: outputURL,
      settings: fileSettings,
      commonFormat: .pcmFormatInt16,
      interleaved: true
    )

    inputNode.installTap(
      onBus: 0,
      bufferSize: Self.inputTapBufferSize,
      format: inputFormat
    ) { [weak self] buffer, _ in
      guard let self else {
        return
      }

      do {
        let converted = try self.convertToFileFormat(
          buffer,
          using: converter,
          fileFormat: fileFormat
        )
        if let converted {
          try file.write(from: converted)
        }
        self.emitMeteringIfNeeded(
          from: buffer,
          sessionId: sessionId
        )
      } catch {
        self.handleRecordingWriteError(
          sessionId: sessionId,
          message: error.localizedDescription
        )
        return
      }
    }

    engine.prepare()
    try engine.start()

    audioEngine = engine
    audioFile = file
    inputToFileConverter = converter
    self.fileFormat = fileFormat
    activeSessionId = sessionId
    self.outputURL = outputURL
    observeAudioSession(sessionId: sessionId)
    emitEvent([
      "type": "started",
      "sessionId": sessionId,
      "uri": outputURL.absoluteString,
      "audioRoute": MrBroccoliWaveformAudioSession.currentInputRouteLabel(),
    ])

    return outputURL
  }

  func stopRecording(sessionId: String) throws -> URL {
    let outputURL = try finishRecording(sessionId: sessionId, deleteOutput: false)
    emitEvent([
      "type": "stopped",
      "sessionId": sessionId,
      "uri": outputURL.absoluteString,
    ])
    return outputURL
  }

  func cancelRecording(sessionId: String) throws {
    _ = try finishRecording(sessionId: sessionId, deleteOutput: true)
    emitEvent([
      "type": "cancelled",
      "sessionId": sessionId,
    ])
  }

  func cleanup() {
    cleanupRecording(deleteOutput: false)
  }

  private func finishRecording(sessionId: String, deleteOutput: Bool) throws -> URL {
    guard activeSessionId == sessionId else {
      throw NSError(
        domain: "MrBroccoliNativeWaveform",
        code: 1,
        userInfo: [NSLocalizedDescriptionKey: "The native waveform recorder is not active for this session."]
      )
    }

    guard let outputURL else {
      throw NSError(
        domain: "MrBroccoliNativeWaveform",
        code: 2,
        userInfo: [NSLocalizedDescriptionKey: "The native waveform recorder has no output file."]
      )
    }

    cleanupRecording(deleteOutput: deleteOutput)
    return outputURL
  }

  private func cleanupRecording(deleteOutput: Bool) {
    stopObservingAudioSession()
    if let inputNode = audioEngine?.inputNode {
      inputNode.removeTap(onBus: 0)
    }

    audioEngine?.stop()
    audioEngine = nil
    audioFile = nil
    inputToFileConverter = nil
    fileFormat = nil
    activeSessionId = nil
    pendingRecordingErrorSessionId = nil
    stateLock.lock()
    lastMeteringEmissionAt = 0
    stateLock.unlock()

    let outputURL = self.outputURL
    self.outputURL = nil

    MrBroccoliWaveformAudioSession.deactivate()

    if deleteOutput, let outputURL {
      try? FileManager.default.removeItem(at: outputURL)
    }
  }

  private func observeAudioSession(sessionId: String) {
    stopObservingAudioSession()

    routeChangeObserver = NotificationCenter.default.addObserver(
      forName: AVAudioSession.routeChangeNotification,
      object: AVAudioSession.sharedInstance(),
      queue: .main
    ) { [weak self] notification in
      guard let self, self.activeSessionId == sessionId else {
        return
      }

      let rawReason = notification.userInfo?[
        AVAudioSessionRouteChangeReasonKey
      ] as? UInt
      self.emitEvent([
        "type": "routeChanged",
        "sessionId": sessionId,
        "audioRoute": MrBroccoliWaveformAudioSession.currentInputRouteLabel(),
        "reason": rawReason ?? 0,
      ])
    }

    interruptionObserver = NotificationCenter.default.addObserver(
      forName: AVAudioSession.interruptionNotification,
      object: AVAudioSession.sharedInstance(),
      queue: .main
    ) { [weak self] notification in
      guard let self, self.activeSessionId == sessionId else {
        return
      }

      let rawType = notification.userInfo?[
        AVAudioSessionInterruptionTypeKey
      ] as? UInt
      let interruptionType = rawType.flatMap(
        AVAudioSession.InterruptionType.init(rawValue:)
      )

      if interruptionType == .began {
        self.emitEvent([
          "type": "interruption",
          "sessionId": sessionId,
          "state": "began",
        ])
        return
      }

      let rawOptions = notification.userInfo?[
        AVAudioSessionInterruptionOptionKey
      ] as? UInt ?? 0
      let shouldResume = AVAudioSession.InterruptionOptions(
        rawValue: rawOptions
      ).contains(.shouldResume)
      var resumed = false

      if shouldResume, let engine = self.audioEngine {
        do {
          try AVAudioSession.sharedInstance().setActive(true)
          if !engine.isRunning {
            try engine.start()
          }
          resumed = engine.isRunning
        } catch {
          self.handleRecordingWriteError(
            sessionId: sessionId,
            message: error.localizedDescription
          )
        }
      }

      self.emitEvent([
        "type": "interruption",
        "sessionId": sessionId,
        "state": "ended",
        "resumed": resumed,
      ])
    }
  }

  private func stopObservingAudioSession() {
    if let routeChangeObserver {
      NotificationCenter.default.removeObserver(routeChangeObserver)
      self.routeChangeObserver = nil
    }
    if let interruptionObserver {
      NotificationCenter.default.removeObserver(interruptionObserver)
      self.interruptionObserver = nil
    }
  }

  private func emitMeteringIfNeeded(
    from buffer: AVAudioPCMBuffer,
    sessionId: String
  ) {
    let now = ProcessInfo.processInfo.systemUptime
    stateLock.lock()
    let shouldEmit =
      now - lastMeteringEmissionAt >= Self.meteringIntervalSeconds
    if shouldEmit {
      lastMeteringEmissionAt = now
    }
    stateLock.unlock()

    guard shouldEmit else {
      return
    }

    emitEvent([
      "type": "levels",
      "sessionId": sessionId,
      "metering": MrBroccoliWaveformAudioAnalysis.meteringDecibels(
        from: buffer
      ),
    ])
  }

  private func convertToFileFormat(
    _ buffer: AVAudioPCMBuffer,
    using converter: AVAudioConverter,
    fileFormat: AVAudioFormat
  ) throws -> AVAudioPCMBuffer? {
    let ratio = fileFormat.sampleRate / buffer.format.sampleRate
    let capacity = AVAudioFrameCount(
      (Double(buffer.frameLength) * ratio).rounded(.up)
    ) + 1

    guard
      capacity > 0,
      let output = AVAudioPCMBuffer(
        pcmFormat: fileFormat,
        frameCapacity: capacity
      )
    else {
      return nil
    }

    var fed = false
    var conversionError: NSError?
    let status = converter.convert(to: output, error: &conversionError) { _, inputStatus in
      if fed {
        inputStatus.pointee = .noDataNow
        return nil
      }
      fed = true
      inputStatus.pointee = .haveData
      return buffer
    }

    if let conversionError {
      throw conversionError
    }

    guard status != .error, output.frameLength > 0 else {
      return nil
    }

    return output
  }

  private func handleRecordingWriteError(sessionId: String, message: String) {
    stateLock.lock()
    let shouldHandleError =
      activeSessionId == sessionId &&
      pendingRecordingErrorSessionId != sessionId
    if shouldHandleError {
      pendingRecordingErrorSessionId = sessionId
    }
    stateLock.unlock()

    guard shouldHandleError else {
      return
    }

    DispatchQueue.main.async {
      guard self.activeSessionId == sessionId else {
        self.stateLock.lock()
        if self.pendingRecordingErrorSessionId == sessionId {
          self.pendingRecordingErrorSessionId = nil
        }
        self.stateLock.unlock()
        return
      }

      self.emitEvent([
        "type": "error",
        "sessionId": sessionId,
        "message": message,
      ])
      self.cleanupRecording(deleteOutput: true)
    }
  }

  private func emitEvent(_ body: [String: Any]) {
    onEvent?(body)
  }
}
