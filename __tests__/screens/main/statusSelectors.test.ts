import { translate } from "../../../src/i18n";
import { getOrbActivity, getStatusDisplayData } from "../../../src/screens/main/statusSelectors";

describe("home activity captions", () => {
  type ActivityInput = Parameters<typeof getOrbActivity>[0];
  const states: {
    phase: ActivityInput["phase"];
    details?: Partial<Pick<ActivityInput, "paused" | "streaming" | "speechTransfer">>;
    actor?: ActivityInput["replyProvider"];
    de: string;
    en: string;
  }[] = [
    { phase: "idle", de: "bereit", en: "ready" },
    { phase: "recording", de: "höre zu", en: "listening" },
    { phase: "transcribing", actor: "elevenlabs", de: "transkribiert", en: "transcribes" },
    { phase: "thinking-briefly", actor: "anthropic", de: "empfängt", en: "receives" },
    { phase: "searching", actor: "gemini", de: "sucht online", en: "searches online" },
    { phase: "thinking", de: "empfange", en: "receive" },
    {
      phase: "thinking", details: { streaming: true }, actor: "anthropic",
      de: "antwortet", en: "responds",
    },
    { phase: "synthesizing", de: "bereite Sprache vor", en: "preparing speech" },
    {
      phase: "synthesizing", details: { speechTransfer: "sending-text" }, actor: "openai",
      de: "empfängt Text", en: "receives text",
    },
    {
      phase: "synthesizing", details: { speechTransfer: "receiving-audio" }, actor: "openai",
      de: "sendet Audio", en: "sends audio",
    },
    { phase: "speaking", de: "spiele ab", en: "playing" },
    { phase: "speaking", details: { paused: true }, de: "Pause", en: "pause" },
  ];

  it.each(states)('attributes "$en" to the active route in both languages', (state) => {
    for (const language of ["de", "en"] as const) {
      const activity = getOrbActivity({
        phase: state.phase,
        paused: false,
        streaming: false,
        speechInputProvider: "elevenlabs",
        replyProvider: "anthropic",
        searchProvider: "gemini",
        speechOutputProvider: "openai",
        ...state.details,
        t: (key) => translate(language, key),
      });
      expect(activity.label).toBe(state[language]);
      expect(activity.provider).toBe(state.actor);
    }
  });
});

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
        })[key] ?? key,
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
        })[key] ?? key,
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
        })[key] ?? key,
      ttsProviderLabel: "OpenAI",
      visualPhase: "recording",
    });

    expect(status.actionLabel).toBe("Tap again to send");
    expect(status.statusDetail).toBe("Listening to your voice");
  });

  it("tells push-to-talk users to keep pressing while recording", () => {
    const status = getStatusDisplayData({
      inputMode: "push-to-talk",
      messageCount: 0,
      pipelinePhase: "idle",
      providerLabel: "OpenAI",
      t: (key) =>
        ({
          keepPressing: "Keep pressing",
          listening: "Listening",
          listeningToYourVoice: "Listening to your voice",
        })[key] ?? key,
      ttsProviderLabel: "OpenAI",
      visualPhase: "recording",
    });

    expect(status.actionLabel).toBe("Keep pressing");
  });

  it("uses the same simple pause and send actions in tap-to-talk", () => {
    const t = (key: string) =>
      ({
        pause: "Pause",
        tapAgainToSend: "Tap again to send",
      })[key] ?? key;

    expect(
      getStatusDisplayData({
        inputMode: "toggle-to-talk",
        messageCount: 0,
        pipelinePhase: "speaking",
        providerLabel: "OpenAI",
        t,
        ttsProviderLabel: "OpenAI",
        visualPhase: "speaking",
      }).actionLabel,
    ).toBe("Pause");

    expect(
      getStatusDisplayData({
        inputMode: "toggle-to-talk",
        messageCount: 0,
        pipelinePhase: "idle",
        providerLabel: "OpenAI",
        t,
        ttsProviderLabel: "OpenAI",
        visualPhase: "recording",
      }).actionLabel,
    ).toBe("Tap again to send");
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
          stop: "Stop",
          preparingRequest: "Preparing your request",
          messageCount: "1 message",
        })[key] ?? key,
      ttsProviderLabel: "xAI",
      visualPhase: "thinking-briefly",
    });

    expect(status.actionLabel).toBe("Stop");
    expect(status.statusTitle).toBe("Thinking");
    expect(status.statusDetail).toBe("Preparing your request");
  });
});
