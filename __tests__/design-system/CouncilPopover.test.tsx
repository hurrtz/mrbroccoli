import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { CouncilPopover } from "../../src/design-system/CouncilPopover";
import { ThemeProvider } from "../../src/theme/ThemeContext";

const models = [
  { id: "one", label: "GPT-5", provider: "openai" as const, selected: true },
  {
    id: "two",
    label: "Claude",
    provider: "anthropic" as const,
    selected: false,
  },
];

function renderPopover() {
  const onChangeRounds = jest.fn();
  const onClose = jest.fn();
  const onToggleModel = jest.fn();
  const screen = render(
    <ThemeProvider mode="light">
      <CouncilPopover
        anchor={{ height: 64, width: 316, x: 40, y: 640 }}
        costSummary="Every round asks every model. 1 × 3 = 3 answers, one after another — minutes, and each provider bills you."
        models={models}
        onChangeRounds={onChangeRounds}
        onClose={onClose}
        onToggleModel={onToggleModel}
        rounds={3}
        roundsLabel="Rounds"
        visible
      />
    </ThemeProvider>,
  );
  return { onChangeRounds, onClose, onToggleModel, screen };
}

describe("CouncilPopover", () => {
  it("shows ready model tiles, the rounds slider, and permanent arithmetic", () => {
    const { screen } = renderPopover();

    expect(screen.getByTestId("council-model-list").props.horizontal).toBe(true);
    expect(screen.getByTestId("council-model-one").props.accessibilityState).toEqual(
      { checked: true },
    );
    expect(screen.getByTestId("council-model-two").props.accessibilityState).toEqual(
      { checked: false },
    );
    expect(screen.getByText(/1 × 3 = 3 answers/)).toBeTruthy();
    expect(screen.getByTestId("council-rounds-slider").props.accessibilityValue).toEqual(
      expect.objectContaining({ min: 1, max: 5, now: 3 }),
    );
  });

  it("changes membership and rounds without a blocking confirmation", () => {
    const { onChangeRounds, onToggleModel, screen } = renderPopover();

    fireEvent.press(screen.getByTestId("council-model-two"));
    fireEvent(
      screen.getByTestId("council-rounds-slider"),
      "accessibilityAction",
      { nativeEvent: { actionName: "increment" } },
    );

    expect(onToggleModel).toHaveBeenCalledWith("two");
    expect(onChangeRounds).toHaveBeenCalledWith(4);
  });

  it("dismisses through the transparent click-away layer", () => {
    const { onClose, screen } = renderPopover();

    fireEvent.press(
      screen.getByTestId("council-popover-dismiss", {
        includeHiddenElements: true,
      }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(
      StyleSheet.flatten(screen.getByTestId("council-popover-overlay").props.style),
    ).toEqual(expect.objectContaining({ flex: 1 }));
  });

  it("dismisses through the screen-reader escape gesture", () => {
    const { onClose, screen } = renderPopover();

    fireEvent(screen.getByTestId("council-popover"), "accessibilityEscape");

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
