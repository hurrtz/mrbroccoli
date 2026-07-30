import ActivityKit
import SwiftUI
import WidgetKit

@main
struct MrBroccoliLiveActivityBundle: WidgetBundle {
  var body: some Widget {
    MrBroccoliVoiceLiveActivity()
  }
}

struct MrBroccoliVoiceLiveActivity: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: MrBroccoliVoiceActivityAttributes.self) { context in
      MrBroccoliLockScreenActivityView(context: context)
        .activityBackgroundTint(Color(red: 0.055, green: 0.063, blue: 0.082))
        .activitySystemActionForegroundColor(.white)
        .widgetURL(URL(string: "mrbroccoli://"))
    } dynamicIsland: { context in
      DynamicIsland {
        DynamicIslandExpandedRegion(.leading) {
          MrBroccoliActivityIcon(context: context, size: 20)
        }
        DynamicIslandExpandedRegion(.trailing) {
          MrBroccoliActivityTimer(context: context)
            .font(.system(.body, design: .rounded, weight: .semibold))
        }
        DynamicIslandExpandedRegion(.bottom) {
          VStack(spacing: 10) {
            HStack(spacing: 8) {
              Text(MrBroccoliActivityCopy.phaseLabel(for: context))
                .font(.subheadline.weight(.medium))
                .lineLimit(1)
              Spacer(minLength: 8)
              Text(MrBroccoliActivityCopy.statusLabel(for: context))
                .font(.caption)
                .foregroundStyle(.secondary)
                .lineLimit(1)
            }
            MrBroccoliActivityActions(context: context, compact: true)
          }
        }
      } compactLeading: {
        MrBroccoliActivityIcon(context: context, size: 15)
      } compactTrailing: {
        MrBroccoliActivityTimer(context: context)
          .font(.system(.caption, design: .rounded, weight: .semibold))
          .frame(minWidth: 36)
      } minimal: {
        MrBroccoliActivityIcon(context: context, size: 14)
      }
      .widgetURL(URL(string: "mrbroccoli://"))
      .keylineTint(.cyan)
    }
  }
}

private struct MrBroccoliLockScreenActivityView: View {
  let context: ActivityViewContext<MrBroccoliVoiceActivityAttributes>

  var body: some View {
    VStack(spacing: 12) {
      HStack(spacing: 12) {
        MrBroccoliActivityIcon(context: context, size: 22)

        VStack(alignment: .leading, spacing: 3) {
          Text("Mr Broccoli")
            .font(.headline)
          Text(MrBroccoliActivityCopy.phaseLabel(for: context))
            .font(.subheadline)
            .foregroundStyle(.secondary)
            .lineLimit(1)
        }

        Spacer(minLength: 12)

        VStack(alignment: .trailing, spacing: 3) {
          MrBroccoliActivityTimer(context: context)
            .font(.system(.headline, design: .rounded, weight: .semibold))
          Text(MrBroccoliActivityCopy.statusLabel(for: context))
            .font(.caption2)
            .foregroundStyle(.secondary)
            .lineLimit(1)
        }
      }
      MrBroccoliActivityActions(context: context, compact: false)
    }
    .padding(.horizontal, 4)
  }
}

private struct MrBroccoliActivityActions: View {
  let context: ActivityViewContext<MrBroccoliVoiceActivityAttributes>
  let compact: Bool

  var body: some View {
    if context.state.controlMode != "inactive" {
      HStack(spacing: compact ? 14 : 10) {
        Link(destination: primaryActionUrl) {
          actionLabel(primaryActionLabel, systemImage: primaryActionSymbol)
        }
        .buttonStyle(.bordered)
        .tint(.cyan)

        if context.state.canRepeat {
          Link(destination: actionUrl("repeat")) {
            actionLabel(context.state.repeatLabel, systemImage: "repeat")
          }
          .buttonStyle(.bordered)
        }
      }
      .font(.caption.weight(.semibold))
    }
  }

  private var primaryAction: String {
    switch context.state.controlMode {
    case "recording":
      return "stop"
    case "drive-paused", "playback-paused":
      return "continue"
    default:
      return "pause"
    }
  }

  private var primaryActionLabel: String {
    switch primaryAction {
    case "stop":
      return context.state.stopLabel
    case "continue":
      return context.state.continueLabel
    default:
      return context.state.pauseLabel
    }
  }

  private var primaryActionSymbol: String {
    switch primaryAction {
    case "stop":
      return "stop.fill"
    case "continue":
      return "play.fill"
    default:
      return "pause.fill"
    }
  }

  private var primaryActionUrl: URL {
    actionUrl(primaryAction)
  }

  private func actionUrl(_ action: String) -> URL {
    URL(string: "mrbroccoli://voice-action/\(action)")!
  }

  @ViewBuilder
  private func actionLabel(_ label: String, systemImage: String) -> some View {
    if compact {
      Image(systemName: systemImage)
        .accessibilityLabel(label)
    } else {
      Label(label, systemImage: systemImage)
        .frame(maxWidth: .infinity)
    }
  }
}

private struct MrBroccoliActivityIcon: View {
  let context: ActivityViewContext<MrBroccoliVoiceActivityAttributes>
  let size: CGFloat

  var body: some View {
    Image(systemName: MrBroccoliActivityCopy.symbolName(for: context))
      .font(.system(size: size, weight: .semibold))
      .foregroundStyle(context.isStale ? .orange : .cyan)
      .accessibilityHidden(true)
  }
}

private struct MrBroccoliActivityTimer: View {
  let context: ActivityViewContext<MrBroccoliVoiceActivityAttributes>

  var body: some View {
    if context.isStale {
      Image(systemName: "pause.fill")
        .foregroundStyle(.orange)
        .accessibilityLabel(context.state.statusLabel)
    } else if let expectedSpeechAt = context.state.expectedSpeechAt {
      TimelineView(.periodic(from: .now, by: 1)) { timeline in
        let timingLabel = MrBroccoliActivityCopy.timingLabel(
          expectedSpeechAt: expectedSpeechAt,
          now: timeline.date
        )
        Text(timingLabel)
          .monospacedDigit()
          .contentTransition(.numericText())
          .accessibilityLabel("\(context.state.statusLabel), \(timingLabel)")
      }
    } else {
      ProgressView()
        .tint(.cyan)
        .accessibilityLabel(context.state.statusLabel)
    }
  }
}

private enum MrBroccoliActivityCopy {
  static func phaseLabel(
    for context: ActivityViewContext<MrBroccoliVoiceActivityAttributes>
  ) -> String {
    return context.state.phaseLabel
  }

  static func statusLabel(
    for context: ActivityViewContext<MrBroccoliVoiceActivityAttributes>
  ) -> String {
    context.state.statusLabel
  }

  static func timingLabel(expectedSpeechAt: Date, now: Date) -> String {
    let remainingSeconds = expectedSpeechAt.timeIntervalSince(now)

    if remainingSeconds >= 0 {
      return formatDuration(Int(ceil(remainingSeconds)))
    }

    return "+ \(formatDuration(max(1, Int(floor(-remainingSeconds)))))"
  }

  private static func formatDuration(_ totalSeconds: Int) -> String {
    if totalSeconds < 60 {
      return "\(totalSeconds) s"
    }

    let minutes = totalSeconds / 60
    let seconds = totalSeconds % 60
    return String(format: "%d:%02d", minutes, seconds)
  }

  static func symbolName(
    for context: ActivityViewContext<MrBroccoliVoiceActivityAttributes>
  ) -> String {
    if context.isStale {
      return "exclamationmark.circle.fill"
    }

    switch context.state.phase {
    case "listening":
      return "microphone.fill"
    case "transcribing":
      return "waveform"
    case "searching":
      return "globe"
    case "synthesizing":
      return "speaker.wave.2.fill"
    default:
      return "sparkles"
    }
  }
}
