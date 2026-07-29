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
    .padding(.horizontal, 4)
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
