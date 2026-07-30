import AVFoundation
import Foundation
import React

@objc(MrBroccoliNativeWaveform)
final class MrBroccoliNativeWaveform: RCTEventEmitter {
  private static let eventName = "MrBroccoliNativeWaveformEvent"
  private var hasListeners = false
  private var activeCuePlayers: [AVAudioPlayer] = []
  private lazy var recorder: MrBroccoliWaveformRecorder = {
    let recorder = MrBroccoliWaveformRecorder()
    recorder.onEvent = { [weak self] body in
      self?.emitEvent(body)
    }
    return recorder
  }()

  override static func requiresMainQueueSetup() -> Bool {
    true
  }

  override func supportedEvents() -> [String]! {
    [Self.eventName]
  }

  override func startObserving() {
    hasListeners = true
  }

  override func stopObserving() {
    hasListeners = false
  }

  @objc(startRecording:outputUri:resolver:rejecter:)
  func startRecording(
    _ sessionId: String,
    outputUri: String?,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async {
      guard !sessionId.isEmpty else {
        reject("native_waveform_record_error", "sessionId is required.", nil)
        return
      }

      do {
        let outputURL = try self.resolveOutputURL(from: outputUri)
        let recording = try self.recorder.startRecording(
          sessionId: sessionId,
          outputURL: outputURL
        )
        resolve(["uri": recording.absoluteString])
      } catch {
        self.recorder.cleanup()
        reject("native_waveform_record_error", error.localizedDescription, error)
      }
    }
  }

  @objc(stopRecording:resolver:rejecter:)
  func stopRecording(
    _ sessionId: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async {
      do {
        let outputURL = try self.recorder.stopRecording(sessionId: sessionId)
        resolve(["uri": outputURL.absoluteString])
      } catch {
        reject("native_waveform_record_error", error.localizedDescription, error)
      }
    }
  }

  @objc(cancelRecording:resolver:rejecter:)
  func cancelRecording(
    _ sessionId: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async {
      do {
        try self.recorder.cancelRecording(sessionId: sessionId)
        resolve(true)
      } catch {
        reject("native_waveform_record_error", error.localizedDescription, error)
      }
    }
  }

  @objc(startAmbientMonitoring:resolver:rejecter:)
  func startAmbientMonitoring(
    _ sessionId: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async {
      guard !sessionId.isEmpty else {
        reject(
          "native_waveform_monitor_error",
          "sessionId is required.",
          nil
        )
        return
      }

      do {
        let audioRoute = try self.recorder.startAmbientMonitoring(
          sessionId: sessionId
        )
        resolve(["audioRoute": audioRoute])
      } catch {
        self.recorder.cleanup()
        reject(
          "native_waveform_monitor_error",
          error.localizedDescription,
          error
        )
      }
    }
  }

  @objc(stopAmbientMonitoring:resolver:rejecter:)
  func stopAmbientMonitoring(
    _ sessionId: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async {
      do {
        try self.recorder.stopAmbientMonitoring(sessionId: sessionId)
        resolve(true)
      } catch {
        reject(
          "native_waveform_monitor_error",
          error.localizedDescription,
          error
        )
      }
    }
  }

  @objc(playRecordingCue:resolver:rejecter:)
  func playRecordingCue(
    _ uri: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async {
      do {
        guard let url = URL(string: uri), url.isFileURL else {
          throw NSError(
            domain: "MrBroccoliNativeWaveform",
            code: 200,
            userInfo: [
              NSLocalizedDescriptionKey: "The recording cue URI is invalid."
            ]
          )
        }

        let player = try AVAudioPlayer(contentsOf: url)
        player.volume = 1
        player.prepareToPlay()
        self.activeCuePlayers.append(player)
        player.play()

        let cleanupDelay = max(0.25, player.duration + 0.15)
        DispatchQueue.main.asyncAfter(deadline: .now() + cleanupDelay) {
          self.activeCuePlayers.removeAll { $0 === player }
        }
        resolve(true)
      } catch {
        reject("native_waveform_cue_error", error.localizedDescription, error)
      }
    }
  }

  override func invalidate() {
    super.invalidate()
    DispatchQueue.main.async {
      self.recorder.cleanup()
    }
  }

  private func emitEvent(_ body: [String: Any]) {
    DispatchQueue.main.async {
      guard self.hasListeners else {
        return
      }

      self.sendEvent(withName: Self.eventName, body: body)
    }
  }

  private func resolveOutputURL(from uri: String?) throws -> URL {
    if let uri, !uri.isEmpty {
      if let fileURL = URL(string: uri), fileURL.isFileURL {
        return fileURL
      }

      return URL(fileURLWithPath: uri)
    }

    let cachesDirectory = try FileManager.default.url(
      for: .cachesDirectory,
      in: .userDomainMask,
      appropriateFor: nil,
      create: true
    )

    return cachesDirectory.appendingPathComponent(
      "native-waveform-\(Date().timeIntervalSince1970).wav"
    )
  }
}
