import Foundation
import MetricKit
import React

@available(iOS 14.0, *)
private final class MrBroccoliMetricSubscriber: NSObject, MXMetricManagerSubscriber {
  static let shared = MrBroccoliMetricSubscriber()
  private let recordsKey = "mrbroccoli.metric-diagnostic-records"
  private var started = false

  func start() {
    guard !started else { return }
    started = true
    MXMetricManager.shared.add(self)
  }

  func didReceive(_ payloads: [MXMetricPayload]) {}

  func didReceive(_ payloads: [MXDiagnosticPayload]) {
    let records: [[String: Any]] = payloads.map { payload in
      var record: [String: Any] = [
        "source": "ios-metrickit",
        "beginTimestampMs": payload.timeStampBegin.timeIntervalSince1970 * 1000,
        "endTimestampMs": payload.timeStampEnd.timeIntervalSince1970 * 1000,
        "crashCount": payload.crashDiagnostics?.count ?? 0,
        "hangCount": payload.hangDiagnostics?.count ?? 0,
        "cpuExceptionCount": payload.cpuExceptionDiagnostics?.count ?? 0,
        "diskWriteExceptionCount": payload.diskWriteExceptionDiagnostics?.count ?? 0,
      ]
      if #available(iOS 16.0, *) {
        record["launchDiagnosticCount"] = payload.appLaunchDiagnostics?.count ?? 0
      }
      return record
    }
    let defaults = UserDefaults.standard
    let existing = defaults.array(forKey: recordsKey) as? [[String: Any]] ?? []
    defaults.set(Array((existing + records).suffix(8)), forKey: recordsKey)
  }

  func consume() -> [[String: Any]] {
    let defaults = UserDefaults.standard
    let records = defaults.array(forKey: recordsKey) as? [[String: Any]] ?? []
    defaults.removeObject(forKey: recordsKey)
    return records
  }
}

@objc(MrBroccoliDiagnostics)
final class MrBroccoliDiagnostics: NSObject {
  @objc static func requiresMainQueueSetup() -> Bool { false }

  override init() {
    super.init()
    if #available(iOS 14.0, *) {
      MrBroccoliMetricSubscriber.shared.start()
    }
  }

  @objc(consumePostmortemRecords:rejecter:)
  func consumePostmortemRecords(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    if #available(iOS 14.0, *) {
      resolve(MrBroccoliMetricSubscriber.shared.consume())
    } else {
      resolve([])
    }
  }
}
