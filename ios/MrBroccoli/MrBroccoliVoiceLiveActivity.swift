import ActivityKit
import Foundation
import MediaPlayer
import React
import UIKit

@objc(MrBroccoliVoiceLiveActivity)
final class MrBroccoliVoiceLiveActivity: RCTEventEmitter {
  private static let actionEvent = "MrBroccoliVoiceRemoteAction"
  private static var pendingAction: String?
  private var hasEventListeners = false
  private var remoteCommandTargets: [(command: MPRemoteCommand, target: Any)] = []
  private var remoteControlMode = "inactive"

  @objc override static func requiresMainQueueSetup() -> Bool {
    true
  }

  override func supportedEvents() -> [String]! {
    [Self.actionEvent]
  }

  override func startObserving() {
    hasEventListeners = true
  }

  override func stopObserving() {
    hasEventListeners = false
  }

  @objc(setState:expectedSpeechAtMs:phaseLabel:statusLabel:resolver:rejecter:)
  func setState(
    _ phase: String,
    expectedSpeechAtMs: NSNumber?,
    phaseLabel: String,
    statusLabel: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    guard #available(iOS 16.2, *) else {
      resolve(false)
      return
    }

    Task { @MainActor in
      do {
        resolve(
          try await MrBroccoliVoiceLiveActivityStore.setState(
            phase: phase,
            expectedSpeechAtMs: expectedSpeechAtMs,
            phaseLabel: phaseLabel,
            statusLabel: statusLabel
          )
        )
      } catch {
        reject("voice_live_activity_error", error.localizedDescription, error)
      }
    }
  }

  @objc(endActivity:rejecter:)
  func endActivity(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    guard #available(iOS 16.2, *) else {
      resolve(false)
      return
    }

    Task { @MainActor in
      await MrBroccoliVoiceLiveActivityStore.endAll()
      resolve(true)
    }
  }

  @objc(setControls:canRepeat:phaseLabel:pauseLabel:continueLabel:stopLabel:repeatLabel:resolver:rejecter:)
  func setControls(
    _ mode: String,
    canRepeat: Bool,
    phaseLabel: String,
    pauseLabel: String,
    continueLabel: String,
    stopLabel: String,
    repeatLabel: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async {
      self.remoteControlMode = mode
      self.configureRemoteCommands(mode: mode, canRepeat: canRepeat)
      self.updateNowPlayingInfo(
        mode: mode,
        phaseLabel: phaseLabel,
        canRepeat: canRepeat
      )

      if #available(iOS 16.2, *) {
        Task { @MainActor in
          await MrBroccoliVoiceLiveActivityStore.setControls(
            mode: mode,
            canRepeat: canRepeat,
            pauseLabel: pauseLabel,
            continueLabel: continueLabel,
            stopLabel: stopLabel,
            repeatLabel: repeatLabel
          )
        }
      }
      resolve(true)
    }
  }

  @objc(clearControls:rejecter:)
  func clearControls(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async {
      self.remoteControlMode = "inactive"
      self.removeRemoteCommandTargets()
      let currentInfo = MPNowPlayingInfoCenter.default().nowPlayingInfo
      let owner = currentInfo?[
        MPNowPlayingInfoPropertyExternalContentIdentifier
      ] as? String
      if owner?.hasPrefix("mrbroccoli-voice") == true {
        MPNowPlayingInfoCenter.default().nowPlayingInfo = nil
      }
      if #available(iOS 16.2, *) {
        Task { @MainActor in
          await MrBroccoliVoiceLiveActivityStore.setControls(
            mode: "inactive",
            canRepeat: false,
            pauseLabel: "",
            continueLabel: "",
            stopLabel: "",
            repeatLabel: ""
          )
        }
      }
      resolve(true)
    }
  }

  @objc(consumePendingAction:rejecter:)
  func consumePendingAction(
    _ resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    let action = Self.pendingAction
    Self.pendingAction = nil
    resolve(action)
  }

  private func emitRemoteAction(_ action: String) {
    if hasEventListeners {
      sendEvent(
        withName: Self.actionEvent,
        body: ["action": action]
      )
    } else {
      Self.pendingAction = action
    }
  }

  private func addRemoteCommandTarget(
    _ command: MPRemoteCommand,
    handler: @escaping (MPRemoteCommandEvent) -> MPRemoteCommandHandlerStatus
  ) {
    let target = command.addTarget(handler: handler)
    remoteCommandTargets.append((command: command, target: target))
    command.isEnabled = true
  }

  private func removeRemoteCommandTargets() {
    remoteCommandTargets.forEach { entry in
      entry.command.removeTarget(entry.target)
    }
    remoteCommandTargets.removeAll()
  }

  private func configureRemoteCommands(mode: String, canRepeat: Bool) {
    removeRemoteCommandTargets()
    let commands = MPRemoteCommandCenter.shared()

    addRemoteCommandTarget(commands.playCommand) { [weak self] _ in
      guard let self else { return .commandFailed }
      self.emitRemoteAction(
        self.remoteControlMode == "recording" ? "stop" : "continue"
      )
      return .success
    }
    addRemoteCommandTarget(commands.pauseCommand) { [weak self] _ in
      guard let self else { return .commandFailed }
      self.emitRemoteAction(
        self.remoteControlMode == "recording" ? "stop" : "pause"
      )
      return .success
    }
    addRemoteCommandTarget(commands.togglePlayPauseCommand) { [weak self] _ in
      guard let self else { return .commandFailed }
      let action: String
      switch self.remoteControlMode {
      case "recording":
        action = "stop"
      case "drive-paused", "playback-paused":
        action = "continue"
      default:
        action = "pause"
      }
      self.emitRemoteAction(action)
      return .success
    }
    addRemoteCommandTarget(commands.stopCommand) { [weak self] _ in
      guard let self else { return .commandFailed }
      self.emitRemoteAction(
        self.remoteControlMode == "recording" ? "stop" : "pause"
      )
      return .success
    }

    if canRepeat {
      addRemoteCommandTarget(commands.nextTrackCommand) { [weak self] _ in
        guard let self else { return .commandFailed }
        self.emitRemoteAction("repeat")
        return .success
      }
    }
  }

  private func updateNowPlayingInfo(
    mode: String,
    phaseLabel: String,
    canRepeat: Bool
  ) {
    let isPaused = mode == "drive-paused" || mode == "playback-paused"
    MPNowPlayingInfoCenter.default().nowPlayingInfo = [
      MPMediaItemPropertyAlbumTitle: "Voice session",
      MPMediaItemPropertyArtist: "Mr Broccoli",
      MPMediaItemPropertyTitle: phaseLabel,
      MPNowPlayingInfoPropertyIsLiveStream: true,
      MPNowPlayingInfoPropertyMediaType: MPNowPlayingInfoMediaType.audio.rawValue,
      MPNowPlayingInfoPropertyPlaybackRate: isPaused ? 0.0 : 1.0,
      MPNowPlayingInfoPropertyExternalContentIdentifier:
        canRepeat ? "mrbroccoli-voice-repeat-ready" : "mrbroccoli-voice",
    ]
  }
}

@available(iOS 16.2, *)
@MainActor
private enum MrBroccoliVoiceLiveActivityStore {
  private struct ControlState {
    var canRepeat = false
    var continueLabel = ""
    var mode = "inactive"
    var pauseLabel = ""
    var repeatLabel = ""
    var stopLabel = ""
  }

  private static let freshnessWindow: TimeInterval = 12 * 60
  private static var currentActivity: Activity<MrBroccoliVoiceActivityAttributes>?
  private static var currentContentState:
    MrBroccoliVoiceActivityAttributes.ContentState?
  private static var controls = ControlState()

  static func setState(
    phase: String,
    expectedSpeechAtMs: NSNumber?,
    phaseLabel: String,
    statusLabel: String
  ) async throws -> Bool {
    guard ActivityAuthorizationInfo().areActivitiesEnabled else {
      return false
    }

    let expectedSpeechAt = expectedSpeechAtMs.map {
      Date(timeIntervalSince1970: $0.doubleValue / 1000)
    }
    let state = MrBroccoliVoiceActivityAttributes.ContentState(
      canRepeat: controls.canRepeat,
      continueLabel: controls.continueLabel,
      controlMode: controls.mode,
      phase: phase,
      expectedSpeechAt: expectedSpeechAt,
      phaseLabel: phaseLabel,
      pauseLabel: controls.pauseLabel,
      repeatLabel: controls.repeatLabel,
      statusLabel: statusLabel,
      stopLabel: controls.stopLabel
    )
    currentContentState = state
    let content = ActivityContent(
      state: state,
      staleDate: Date().addingTimeInterval(freshnessWindow),
      relevanceScore: 1
    )

    if let activity = activeActivity() {
      await activity.update(content)
      return true
    }

    // Apple only permits an app to start its own Live Activity while it is in
    // the foreground. Once started, local updates may continue during the
    // app's bounded background execution time.
    guard UIApplication.shared.applicationState != .background else {
      return false
    }

    currentActivity = try Activity.request(
      attributes: MrBroccoliVoiceActivityAttributes(startedAt: Date()),
      content: content,
      pushType: nil
    )
    return true
  }

  static func endAll() async {
    let activities = Activity<MrBroccoliVoiceActivityAttributes>.activities

    for activity in activities {
      await activity.end(nil, dismissalPolicy: .immediate)
    }

    currentActivity = nil
    currentContentState = nil
  }

  static func setControls(
    mode: String,
    canRepeat: Bool,
    pauseLabel: String,
    continueLabel: String,
    stopLabel: String,
    repeatLabel: String
  ) async {
    controls = ControlState(
      canRepeat: canRepeat,
      continueLabel: continueLabel,
      mode: mode,
      pauseLabel: pauseLabel,
      repeatLabel: repeatLabel,
      stopLabel: stopLabel
    )
    guard let activity = activeActivity(),
          let state = currentContentState else {
      return
    }

    let updatedState = MrBroccoliVoiceActivityAttributes.ContentState(
      canRepeat: canRepeat,
      continueLabel: continueLabel,
      controlMode: mode,
      phase: state.phase,
      expectedSpeechAt: state.expectedSpeechAt,
      phaseLabel: state.phaseLabel,
      pauseLabel: pauseLabel,
      repeatLabel: repeatLabel,
      statusLabel: state.statusLabel,
      stopLabel: stopLabel
    )
    currentContentState = updatedState
    await activity.update(
      ActivityContent(
        state: updatedState,
        staleDate: Date().addingTimeInterval(freshnessWindow),
        relevanceScore: 1
      )
    )
  }

  private static func activeActivity() -> Activity<MrBroccoliVoiceActivityAttributes>? {
    if let currentActivity,
       Activity<MrBroccoliVoiceActivityAttributes>.activities.contains(where: {
         $0.id == currentActivity.id
       }) {
      return currentActivity
    }

    currentActivity = Activity<MrBroccoliVoiceActivityAttributes>.activities.first
    return currentActivity
  }
}
