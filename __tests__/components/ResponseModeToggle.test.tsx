import React from "react";
import { StyleSheet } from "react-native";

import { ResponseModeToggle } from "../../src/components/ResponseModeToggle";
import { lightColors } from "../../src/theme/colors";
import { renderWithProviders } from "../test-utils/renderWithProviders";

jest.mock("../../src/components/ProviderIcon", () => ({
  ProviderIcon: ({ provider, size }: { provider: string; size: number }) => {
    const React = require("react");
    const { Text } = require("react-native");
    return React.createElement(Text, null, `${provider}:${size}`);
  },
}));

describe("ResponseModeToggle", () => {
  it("omits effort metadata, enlarges the provider logo, and centers the model", () => {
    const screen = renderWithProviders(
      <ResponseModeToggle
        selected="mode-2"
        onSelect={jest.fn()}
        modes={[
          {
            id: "mode-1",
            route: {
              provider: "gemini",
              model: "gemini-2.5-flash-lite",
            },
          },
          {
            id: "mode-2",
            route: {
              provider: "gemini",
              model: "gemini-3.5-flash",
              effort: "high",
            },
          },
          {
            id: "mode-3",
            route: {
              provider: "gemini",
              model: "gemini-3.1-pro-preview",
              effort: "high",
            },
          },
        ]}
        readyModes={["mode-1", "mode-2", "mode-3"]}
      />,
    );

    expect(screen.getByText("Gemini 3.5 Flash")).toBeTruthy();
    expect(screen.getAllByText("gemini:24")).toHaveLength(3);
    expect(
      StyleSheet.flatten(
        screen.getByTestId("response-mode-option-mode-2").props.style,
      ).backgroundColor,
    ).toBe(lightColors.activeControl);
    expect(
      StyleSheet.flatten(
        screen.getByTestId("response-mode-model-mode-2").props.style,
      ).color,
    ).toBe(lightColors.onActiveControl);
    expect(
      StyleSheet.flatten(
        screen.getByTestId("response-mode-option-mode-3").props.style,
      ).backgroundColor,
    ).toBe(lightColors.surfaceElevated);
    expect(
      StyleSheet.flatten(
        screen.getByTestId("response-mode-model-mode-3").props.style,
      ).color,
    ).toBe(lightColors.textSecondary);
    expect(
      screen.queryByTestId("response-mode-option-gradient-mode-2"),
    ).toBeNull();
    expect(
      screen.getByTestId("response-mode-model-mode-2").props.numberOfLines,
    ).toBe(2);
    expect(screen.queryByText("High")).toBeNull();
    expect(screen.queryByTestId("response-mode-effort-footer")).toBeNull();
    expect(screen.queryByText(/Effort:/)).toBeNull();
    expect(
      StyleSheet.flatten(
        screen.getByTestId("response-mode-model-mode-2").props.style,
      ).textAlign,
    ).toBe("center");
    expect(
      StyleSheet.flatten(
        screen.getByTestId("response-mode-model-slot-mode-2").props.style,
      ),
    ).toEqual(
      expect.objectContaining({
        height: 30,
        justifyContent: "flex-start",
      }),
    );
  });

  it("lays out model cards without a visible wrapper", () => {
    const screen = renderWithProviders(
      <ResponseModeToggle
        selected="mode-1"
        onSelect={jest.fn()}
        modes={[
          {
            id: "mode-1",
            route: { provider: "gemini", model: "gemini-2.5-flash" },
          },
        ]}
      />,
    );

    const wrapperStyle = StyleSheet.flatten(
      screen.getByTestId("response-mode-list").props.style,
    );

    expect(wrapperStyle.flexDirection).toBe("row");
    expect(wrapperStyle.backgroundColor).toBeUndefined();
    expect(wrapperStyle.borderWidth).toBeUndefined();
    expect(wrapperStyle.padding).toBeUndefined();
    expect(wrapperStyle.shadowOpacity).toBeUndefined();
    expect(wrapperStyle.elevation).toBeUndefined();
  });

  it("uses harmonious dark active content and a quiet inactive border", () => {
    const screen = renderWithProviders(
      <ResponseModeToggle
        selected="mode-1"
        onSelect={jest.fn()}
        modes={[
          {
            id: "mode-1",
            route: { provider: "gemini", model: "gemini-3.6-flash" },
          },
          {
            id: "mode-2",
            route: { provider: "gemini", model: "gemini-3.1-pro-preview" },
          },
        ]}
      />,
      { themeMode: "dark" },
    );

    expect(
      StyleSheet.flatten(
        screen.getByTestId("response-mode-model-mode-1").props.style,
      ).color,
    ).toBe("#16181D");
    expect(
      StyleSheet.flatten(
        screen.getByTestId("response-mode-option-mode-2").props.style,
      ).borderColor,
    ).toBe("#2A2F37");
  });

  it("keeps four portrait model cards visible in one non-scrolling row", () => {
    const screen = renderWithProviders(
      <ResponseModeToggle
        selected="mode-1"
        onSelect={jest.fn()}
        modes={[
          {
            id: "mode-1",
            route: { provider: "openai", model: "gpt-5.6-sol" },
          },
          {
            id: "mode-2",
            route: { provider: "gemini", model: "gemini-3.5-flash" },
          },
          {
            id: "mode-3",
            route: { provider: "xai", model: "grok-4.5" },
          },
          {
            id: "mode-4",
            route: { provider: "mistral", model: "mistral-medium-3-5" },
          },
        ]}
      />,
    );

    const listStyle = StyleSheet.flatten(
      screen.getByTestId("response-mode-list").props.style,
    );

    expect(listStyle.flexDirection).toBe("row");
    expect(listStyle.flexWrap).toBeUndefined();
    expect(
      StyleSheet.flatten(
        screen.getByTestId("response-mode-option-mode-1").props.style,
      ).flex,
    ).toBe(1);
    expect(
      StyleSheet.flatten(
        screen.getByTestId("response-mode-option-mode-1").props.style,
      ).minWidth,
    ).toBe(0);
  });

  it("stacks compact landscape cards one per row", () => {
    const screen = renderWithProviders(
      <ResponseModeToggle
        compact
        selected="mode-1"
        onSelect={jest.fn()}
        modes={[
          {
            id: "mode-1",
            route: { provider: "openai", model: "gpt-5.6-sol" },
          },
          {
            id: "mode-2",
            route: { provider: "gemini", model: "gemini-3.5-flash" },
          },
          {
            id: "mode-3",
            route: { provider: "xai", model: "grok-4.5" },
          },
        ]}
      />,
    );

    const listStyle = StyleSheet.flatten(
      screen.getByTestId("response-mode-list").props.style,
    );
    const optionStyle = StyleSheet.flatten(
      screen.getByTestId("response-mode-option-mode-1").props.style,
    );

    expect(listStyle.flexDirection).toBe("column");
    expect(listStyle.flexWrap).toBeUndefined();
    expect(optionStyle.width).toBe("100%");
    expect(optionStyle.flexShrink).toBe(0);
    expect(optionStyle.minHeight).toBe(54);
    expect(screen.getByText("openai:26")).toBeTruthy();
    expect(
      StyleSheet.flatten(
        screen.getByTestId("response-mode-model-slot-mode-1").props.style,
      ),
    ).toEqual(
      expect.objectContaining({
        flex: 1,
        height: 30,
        width: "auto",
      }),
    );
  });

  it("keeps all four compact landscape cards in the vertical stack", () => {
    const screen = renderWithProviders(
      <ResponseModeToggle
        compact
        selected="mode-1"
        onSelect={jest.fn()}
        modes={[
          {
            id: "mode-1",
            route: { provider: "openai", model: "gpt-5.6-sol" },
          },
          {
            id: "mode-2",
            route: { provider: "gemini", model: "gemini-3.5-flash" },
          },
          {
            id: "mode-3",
            route: { provider: "xai", model: "grok-4.5" },
          },
          {
            id: "mode-4",
            route: { provider: "mistral", model: "mistral-medium-3-5" },
          },
        ]}
      />,
    );

    const listStyle = StyleSheet.flatten(
      screen.getByTestId("response-mode-list").props.style,
    );
    const optionStyle = StyleSheet.flatten(
      screen.getByTestId("response-mode-option-mode-1").props.style,
    );

    expect(listStyle.flexDirection).toBe("column");
    expect(listStyle.flexWrap).toBeUndefined();
    expect(optionStyle.flex).toBeUndefined();
    expect(optionStyle.width).toBe("100%");
    expect(optionStyle.flexGrow).toBeUndefined();
    expect(optionStyle.flexShrink).toBe(0);
    expect(optionStyle.minHeight).toBe(46);
    expect(listStyle.gap).toBe(4);
    expect(screen.getByText("openai:22")).toBeTruthy();
    expect(
      StyleSheet.flatten(
        screen.getByTestId("response-mode-option-inner-mode-1").props.style,
      ),
    ).toEqual(
      expect.objectContaining({
        minHeight: 46,
        paddingHorizontal: 8,
        paddingVertical: 5,
      }),
    );
  });

  it("does not allow a response route that is not ready to be selected", () => {
    const onSelect = jest.fn();
    const screen = renderWithProviders(
      <ResponseModeToggle
        selected="mode-1"
        onSelect={onSelect}
        modes={[
          {
            id: "mode-1",
            route: { provider: "openai", model: "gpt-5.6-sol" },
          },
          {
            id: "mode-2",
            route: { provider: "gemini", model: "gemini-3.5-flash" },
          },
        ]}
        readyModes={["mode-1"]}
      />,
    );

    const unavailable = screen.getByTestId("response-mode-option-mode-2");
    expect(unavailable.props.onPress).toBeUndefined();
    expect(unavailable.props.accessibilityState.disabled).toBe(true);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it.each([
    { compact: false, minHeight: 80 },
    { compact: true, minHeight: 68 },
  ])(
    "shows one model as a neutral, shorter, one-line card when compact is $compact",
    ({ compact, minHeight }) => {
      const screen = renderWithProviders(
        <ResponseModeToggle
          compact={compact}
          selected="mode-1"
          onSelect={jest.fn()}
          modes={[
            {
              id: "mode-1",
              route: { provider: "gemini", model: "gemini-2.5-flash" },
            },
          ]}
        />,
      );

      const card = screen.getByTestId("response-mode-option-mode-1");
      const cardStyle = StyleSheet.flatten(card.props.style);
      const innerStyle = StyleSheet.flatten(
        screen.getByTestId("response-mode-option-inner-mode-1").props.style,
      );

      expect(card.props.onPress).toBeUndefined();
      expect(card.props.accessibilityState).toEqual({
        disabled: true,
        selected: true,
      });
      expect(cardStyle.backgroundColor).toBe(lightColors.surfaceElevated);
      expect(
        screen.queryByTestId("response-mode-option-gradient-mode-1"),
      ).toBeNull();
      expect(cardStyle.minHeight).toBe(minHeight);
      expect(innerStyle.minHeight).toBe(minHeight);
      expect(
        screen.getByTestId("response-mode-model-mode-1").props.numberOfLines,
      ).toBe(1);
    },
  );
});
