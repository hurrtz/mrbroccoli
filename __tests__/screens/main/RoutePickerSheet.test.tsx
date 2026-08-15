import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import { RoutePickerSheet } from "../../../src/screens/main/RoutePickerSheet";
import { LocalizationProvider } from "../../../src/i18n";
import { ThemeProvider } from "../../../src/theme/ThemeContext";
import type { TranslateFn } from "../../../src/screens/main/shared";

jest.mock("../../../src/components/ProviderIcon", () => ({
  ProviderIcon: ({ provider }: { provider: string }) => {
    const React = require("react");
    const { Text } = require("react-native");
    return React.createElement(Text, null, `mark-${provider}`);
  },
}));

const t = ((key: string) => {
  const copy: Record<string, string> = {
    done: "Done",
    workspaceRoutePickerTitle: "Answer the next turn with",
  };
  return copy[key] ?? key;
}) as TranslateFn;

const modes = [
  {
    id: "mode-1",
    route: { provider: "xai" as const, model: "grok-4-1-fast-reasoning" },
  },
  {
    id: "mode-2",
    route: { provider: "anthropic" as const, model: "claude-sonnet-4-5" },
  },
];

function renderSheet(
  overrides: Partial<React.ComponentProps<typeof RoutePickerSheet>> = {},
) {
  const onClose = jest.fn();
  const onSelect = jest.fn();
  const screen = render(
    <ThemeProvider mode="light">
      <LocalizationProvider language="en">
        <RoutePickerSheet
          modes={modes}
          onClose={onClose}
          onSelect={onSelect}
          readyModes={["mode-1", "mode-2"]}
          selected="mode-1"
          t={t}
          visible
          {...overrides}
        />
      </LocalizationProvider>
    </ThemeProvider>,
  );
  return { onClose, onSelect, screen };
}

describe("RoutePickerSheet", () => {
  it("lists every configured route as a radio row", () => {
    const { screen } = renderSheet();

    expect(screen.getByText("Answer the next turn with")).toBeTruthy();
    const active = screen.getByTestId("route-picker-row-mode-1");
    expect(active.props.accessibilityRole).toBe("radio");
    expect(active.props.accessibilityState.checked).toBe(true);
    expect(
      screen.getByTestId("route-picker-row-mode-2").props.accessibilityState
        .checked,
    ).toBe(false);
  });

  it("switches who answers next and closes", () => {
    const { onClose, onSelect, screen } = renderSheet();

    fireEvent.press(screen.getByTestId("route-picker-row-mode-2"));

    expect(onSelect).toHaveBeenCalledWith("mode-2");
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Done")).toBeNull();
  });

  it("keeps unready routes visible but not selectable", () => {
    const { onSelect, screen } = renderSheet({ readyModes: ["mode-1"] });
    const unready = screen.getByTestId("route-picker-row-mode-2");

    expect(unready.props.accessibilityState.disabled).toBe(true);
    fireEvent.press(unready);
    expect(onSelect).not.toHaveBeenCalled();
  });
});
