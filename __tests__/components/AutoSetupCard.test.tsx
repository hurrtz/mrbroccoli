import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import { AutoSetupCard } from "../../src/components/autoSetup/AutoSetupCard";
import { BackgroundTaskBar } from "../../src/design-system/BackgroundTaskBar";
import type { TranslateFn } from "../../src/screens/main/shared";
import { ThemeProvider } from "../../src/theme/ThemeContext";
import { createAutoSetupJob } from "../test-utils/autoSetupJobFixture";

const t = ((key: string, values?: Record<string, string | number>) =>
  values ? `${key}:${JSON.stringify(values)}` : key) as TranslateFn;

function renderCard(
  props: Partial<React.ComponentProps<typeof AutoSetupCard>> = {},
) {
  return render(
    <ThemeProvider mode="light">
      <AutoSetupCard job={createAutoSetupJob()} t={t} {...props} />
    </ThemeProvider>,
  );
}

describe("AutoSetupCard", () => {
  it("offers the check and promises nothing is downloaded yet", () => {
    const job = createAutoSetupJob();
    const screen = renderCard({ job });

    expect(screen.getByText("autoSetupOfferNote")).toBeTruthy();
    fireEvent.press(screen.getByText("autoSetupStart"));
    expect(job.start).toHaveBeenCalledTimes(1);
    // Nothing on the offer can install.
    expect(screen.queryByText("autoSetupInstallAction")).toBeNull();
  });

  it("reveals only the measured facts while scanning", () => {
    const screen = renderCard({
      job: createAutoSetupJob({
        state: "scanning",
        scanned: 2,
        facts: [
          { label: "MEMORY", value: "8 GB" },
          { label: "STORAGE", value: "40 GB" },
          { label: "PROCESSORS", value: "6" },
        ],
      }),
    });

    expect(screen.getByText("8 GB")).toBeTruthy();
    expect(screen.getByText("40 GB")).toBeTruthy();
    expect(screen.queryByText("6")).toBeNull();
    expect(screen.queryByText("autoSetupInstallAction")).toBeNull();
  });

  it("installs only from a seen proposal, with the manual route beside it", () => {
    const job = createAutoSetupJob({
      state: "proposal",
      totalSizeLabel: "1.2 GB",
      plan: [
        {
          role: "think",
          roleLabel: "THINKING",
          name: "Qwen3 0.6B",
          active: false,
          installed: false,
          failed: false,
        },
      ],
    });
    const onManual = jest.fn();
    const screen = renderCard({ job, onManual });

    expect(screen.getByText("Qwen3 0.6B")).toBeTruthy();
    expect(
      screen.getByText('autoSetupTotalSize:{"size":"1.2 GB"}'),
    ).toBeTruthy();
    fireEvent.press(screen.getByText("autoSetupInstallAction"));
    expect(job.install).toHaveBeenCalledTimes(1);
    fireEvent.press(screen.getByTestId("auto-setup-manual"));
    expect(onManual).toHaveBeenCalledTimes(1);
  });

  it("marks the failed row and keeps what finished in place", () => {
    const screen = renderCard({
      job: createAutoSetupJob({
        state: "failed",
        plan: [
          {
            role: "think",
            roleLabel: "THINKING",
            name: "Qwen3 0.6B",
            active: false,
            installed: true,
            failed: false,
          },
          {
            role: "listen",
            roleLabel: "LISTENING",
            name: "Whisper Tiny",
            active: false,
            installed: false,
            failed: true,
          },
          {
            role: "speak",
            roleLabel: "SPEAKING",
            name: "Kokoro",
            active: false,
            installed: false,
            failed: false,
          },
        ],
      }),
    });

    expect(
      screen.getByTestId("auto-setup-row-think-note").props.children,
    ).toBe("autoSetupInstalledNote");
    expect(
      screen.getByTestId("auto-setup-row-listen-note").props.children,
    ).toBe("autoSetupFailedRowNote");
    expect(
      screen.getByTestId("auto-setup-row-speak-note").props.children,
    ).toBe("autoSetupQueuedNote");
    expect(screen.getByText("autoSetupRetry")).toBeTruthy();
  });
});

describe("BackgroundTaskBar", () => {
  it("reports the running job with no dismiss control", () => {
    const onPress = jest.fn();
    const screen = render(
      <ThemeProvider mode="light">
        <BackgroundTaskBar
          accessibilityLabel="Installing on-device AI. Open on-device AI settings."
          detail="Step 2 of 4 · about 2 min left"
          fraction={0.4}
          onPress={onPress}
          title="Installing on-device AI"
        />
      </ThemeProvider>,
    );

    expect(screen.getByText("Step 2 of 4 · about 2 min left")).toBeTruthy();
    expect(screen.getByTestId("background-task-bar-fill")).toBeTruthy();
    // Deliberately no dismiss: the work continues either way, and the row is
    // the way back to it.
    expect(screen.queryByTestId("background-task-bar-dismiss")).toBeNull();
    fireEvent.press(screen.getByTestId("background-task-bar"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("drops the progress line when the job has failed", () => {
    const screen = render(
      <ThemeProvider mode="light">
        <BackgroundTaskBar
          accessibilityLabel="On-device install stopped."
          detail="Tap to see what failed"
          onPress={jest.fn()}
          title="On-device install stopped"
          tone="danger"
        />
      </ThemeProvider>,
    );

    expect(screen.queryByTestId("background-task-bar-fill")).toBeNull();
  });
});
