import ActivityKit
import Foundation
import React
import UIKit

@objc(MrBroccoliVoiceLiveActivity)
final class MrBroccoliVoiceLiveActivity: NSObject {
  @objc static func requiresMainQueueSetup() -> Bool {
    true
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
}

@available(iOS 16.2, *)
@MainActor
private enum MrBroccoliVoiceLiveActivityStore {
  private static let freshnessWindow: TimeInterval = 12 * 60
  private static var currentActivity: Activity<MrBroccoliVoiceActivityAttributes>?

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
      phase: phase,
      expectedSpeechAt: expectedSpeechAt,
      phaseLabel: phaseLabel,
      statusLabel: statusLabel
    )
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
