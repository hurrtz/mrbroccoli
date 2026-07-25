import { getStatusDisplayData } from "../../../src/screens/main/statusSelectors";

describe("statusSelectors", () => {
  it("builds idle state labels from message count and input mode", () => {
    const status = getStatusDisplayData({
      inputMode: "push-to-talk",
      messageCount: 3,
      pipelinePhase: "idle",
      providerLabel: "OpenAI",
      t: (key, params) =>
        ({
          freshSession: "Fresh session",
          holdToSpeak: "Hold to speak",
          idle: "Idle",
          messageCount: `${params?.count} messages`,
        }[key] ?? key),
      ttsProviderLabel: "OpenAI",
      visualPhase: "idle",
    });

    expect(status).toEqual({
      actionLabel: "Hold to speak",
      messageCountLabel: "3 messages",
      statusDetail: "3 messages",
      statusTitle: "Idle",
    });
  });

  it("uses tap-to-speak wording for toggle mode", () => {
    const status = getStatusDisplayData({
      inputMode: "toggle-to-talk",
      messageCount: 0,
      pipelinePhase: "idle",
      providerLabel: "OpenAI",
      t: (key) =>
        ({
          freshSession: "Fresh session",
          tapToSpeak: "Tap to speak",
          idle: "Idle",
        }[key] ?? key),
      ttsProviderLabel: "OpenAI",
      visualPhase: "idle",
    });

    expect(status.actionLabel).toBe("Tap to speak");
  });

  it("tells toggle-mode users to tap again while recording", () => {
    const status = getStatusDisplayData({
      inputMode: "toggle-to-talk",
      messageCount: 0,
      pipelinePhase: "idle",
      providerLabel: "OpenAI",
      t: (key) =>
        ({
          listening: "Listening",
          listeningToYourVoice: "Listening to your voice",
          tapAgainToSend: "Tap again to send",
        }[key] ?? key),
      ttsProviderLabel: "OpenAI",
      visualPhase: "recording",
    });

    expect(status.actionLabel).toBe("Tap again to send");
    expect(status.statusDetail).toBe("Listening to your voice");
  });

  it("keeps listening wording while push-to-talk is held", () => {
    const status = getStatusDisplayData({
      inputMode: "push-to-talk",
      messageCount: 0,
      pipelinePhase: "idle",
      providerLabel: "OpenAI",
      t: (key) =>
        ({
          listening: "Listening",
          listeningToYourVoice: "Listening to your voice",
        }[key] ?? key),
      ttsProviderLabel: "OpenAI",
      visualPhase: "recording",
    });

    expect(status.actionLabel).toBe("Listening");
  });

  it("uses interrupt and send labels for an active Drive Session", () => {
    const t = (key: string) =>
      ({
        tapToInterruptDriveReply: "Tap to interrupt",
        tapToSendDriveTurn: "Tap to send",
      })[key] ?? key;

    expect(
      getStatusDisplayData({
        driveSessionActive: true,
        inputMode: "drive-session",
        messageCount: 0,
        pipelinePhase: "speaking",
        providerLabel: "OpenAI",
        t,
        ttsProviderLabel: "OpenAI",
        visualPhase: "speaking",
      }).actionLabel,
    ).toBe("Tap to interrupt");

    expect(
      getStatusDisplayData({
        driveSessionActive: true,
        inputMode: "drive-session",
        messageCount: 0,
        pipelinePhase: "idle",
        providerLabel: "OpenAI",
        t,
        ttsProviderLabel: "OpenAI",
        visualPhase: "recording",
      }).actionLabel,
    ).toBe("Tap to send");
  });

  it("distinguishes request preparation from provider thinking", () => {
    const status = getStatusDisplayData({
      inputMode: "toggle-to-talk",
      messageCount: 1,
      pipelinePhase: "thinking-briefly",
      providerLabel: "xAI",
      t: (key) =>
        ({
          thinking: "Thinking",
          preparingRequest: "Preparing your request",
          messageCount: "1 message",
        })[key] ?? key,
      ttsProviderLabel: "xAI",
      visualPhase: "thinking-briefly",
    });

    expect(status.actionLabel).toBe("Thinking");
    expect(status.statusTitle).toBe("Thinking");
    expect(status.statusDetail).toBe("Preparing your request");
  });

});
