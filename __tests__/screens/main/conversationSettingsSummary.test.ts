import { getConversationSettingsSummary } from "../../../src/screens/main/conversationSettingsSummary";
import { en } from "../../../src/i18n/locales/en";

const t = ((key: keyof typeof en) => en[key]) as never;

describe("getConversationSettingsSummary", () => {
  it("states the conversation's settings as noun phrases joined by middots", () => {
    const summary = getConversationSettingsSummary({
      responseLength: "brief",
      responseTone: "casual",
      t,
      voiceLabel: "Heart",
    });

    expect(summary.split(" · ")).toHaveLength(3);
    expect(summary.endsWith("Heart")).toBe(true);
    // A sentence, not a list: no trailing stop.
    expect(summary.endsWith(".")).toBe(false);
  });

  it("says less rather than leaving a gap when something is not set", () => {
    // "Casual ·  · Heart" reads as a bug. A shorter sentence just says less.
    const summary = getConversationSettingsSummary({
      responseTone: "casual",
      t,
      voiceLabel: "Heart",
    });

    expect(summary).not.toContain("·  ·");
    expect(summary.split(" · ")).toHaveLength(2);
  });

  it("is empty when nothing has been chosen, so the row can hide itself", () => {
    expect(getConversationSettingsSummary({ t })).toBe("");
    expect(getConversationSettingsSummary({ t, voiceLabel: "   " })).toBe("");
  });
});
