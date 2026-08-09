import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { RouteByline } from "../../src/components/RouteByline";
import { ThemeProvider } from "../../src/theme/ThemeContext";
import { lightColors } from "../../src/theme/colors";

function renderByline(
  props: Partial<React.ComponentProps<typeof RouteByline>> = {},
) {
  return render(
    <ThemeProvider mode="light">
      <RouteByline
        effort="Balanced"
        effortLevels={["Brief", "Balanced", "Thorough"]}
        modelName="GPT-5"
        provider="openai"
        {...props}
      />
    </ThemeProvider>,
  );
}

describe("RouteByline", () => {
  it("is one line whatever the route count", () => {
    // The switcher it replaces rendered four different layouts for one, two,
    // three and four-plus models. This is one treatment at every count.
    const one = renderByline({ switchable: false });
    const many = renderByline({ switchable: true });

    for (const screen of [one, many]) {
      expect(screen.getByText("GPT-5").props.numberOfLines).toBe(1);
    }
  });

  it("drops the caret and the press target for a single route", () => {
    const onPress = jest.fn();
    const screen = renderByline({ onPress, switchable: false });

    fireEvent.press(screen.getByTestId("route-byline"));

    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByTestId("route-byline").props.accessibilityRole).toBeUndefined();
  });

  it("opens the route sheet when more than one route is configured", () => {
    const onPress = jest.fn();
    const screen = renderByline({ onPress, switchable: true });

    fireEvent.press(screen.getByTestId("route-byline"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("names itself with the model and its effort", () => {
    expect(renderByline().getByLabelText("GPT-5. Balanced")).toBeTruthy();
    // A model with no effort control says only what it is.
    expect(
      renderByline({ effort: undefined, effortLevels: [] }).getByLabelText(
        "GPT-5",
      ),
    ).toBeTruthy();
  });

  it("fills the effort scale up to the current level", () => {
    const screen = renderByline();
    const dots = screen
      .UNSAFE_getAllByType("View" as never)
      .map((node) => StyleSheet.flatten(node.props.style))
      .filter((style) => style?.width === 5 && style?.height === 5);

    expect(dots).toHaveLength(3);
    expect(dots[0].backgroundColor).toBe(lightColors.accent);
    expect(dots[1].backgroundColor).toBe(lightColors.accent);
    expect(dots[2].backgroundColor).toBe(lightColors.borderStrong);
  });

  it("hides the scale when the model exposes fewer than two levels", () => {
    const screen = renderByline({ effortLevels: ["Balanced"] });
    const dots = screen
      .UNSAFE_getAllByType("View" as never)
      .map((node) => StyleSheet.flatten(node.props.style))
      .filter((style) => style?.width === 5);

    expect(dots).toHaveLength(0);
  });

  it("shows the cpu glyph for an on-device route instead of a brand mark", () => {
    const screen = renderByline({
      local: true,
      modelName: "On device · Qwen 2.5 1.5B",
      provider: undefined,
    });

    const hidden = { includeHiddenElements: true } as const;

    expect(screen.getByTestId("phosphor-icon-cpu", hidden)).toBeTruthy();
    expect(screen.queryByTestId("provider-icon-openai", hidden)).toBeNull();
  });

  it("carries no fill or border so it cannot read as the voice control", () => {
    const style = StyleSheet.flatten(
      renderByline().getByTestId("route-byline").props.style,
    );

    expect(style.backgroundColor).toBeUndefined();
    expect(style.borderWidth).toBeUndefined();
    // One closing hairline says the whole row is the target.
    expect(style.borderBottomWidth).toBe(1);
    expect(style.minHeight).toBe(48);
  });
});
