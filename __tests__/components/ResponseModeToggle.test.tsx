import React from "react";
import { Modal, Pressable, StyleSheet } from "react-native";
import { fireEvent, waitFor } from "@testing-library/react-native";

import {
  getResponseModeCardModelLabels,
  ResponseModeToggle,
} from "../../src/components/ResponseModeToggle";
import { responseModeToggleStyles } from "../../src/components/responseModeToggle/styles";
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
  it("derives compact family and model labels without changing model identity", () => {
    expect(
      getResponseModeCardModelLabels("gemini", "Gemini 3.1 Pro Preview"),
    ).toEqual({
      family: "Gemini",
      name: "3.1 Pro Preview",
    });
    expect(
      getResponseModeCardModelLabels("openai", "GPT-5.6 Sol"),
    ).toEqual({
      family: "GPT",
      name: "5.6 Sol",
    });
    expect(
      getResponseModeCardModelLabels(
        "openrouter",
        "Google · Gemini 3.6 Flash",
      ),
    ).toEqual({
      family: "Gemini",
      name: "3.6 Flash",
    });
    expect(
      getResponseModeCardModelLabels(
        "alibaba-qwen-dashscope",
        "Qwen3.5-Plus",
      ),
    ).toEqual({
      family: "Qwen",
      name: "3.5 Plus",
    });
  });

  it("uses a three-row horizontal layout for two portrait cards", () => {
    const screen = renderWithProviders(
      <ResponseModeToggle
        selected="mode-1"
        onSelect={jest.fn()}
        modes={[
          {
            id: "mode-1",
            route: {
              provider: "gemini",
              model: "gemini-3.6-flash",
              effort: "medium",
            },
          },
          {
            id: "mode-2",
            route: {
              provider: "gemini",
              model: "gemini-3.1-pro-preview",
              effort: "high",
            },
          },
        ]}
      />,
    );

    expect(screen.getAllByText("Gemini")).toHaveLength(2);
    expect(screen.getByText("3.6 Flash")).toBeTruthy();
    expect(screen.getByText("3.1 Pro Preview")).toBeTruthy();
    expect(screen.getByText("Effort: Medium")).toBeTruthy();
    expect(screen.getByText("Effort: High")).toBeTruthy();
    expect(screen.queryByText("Gemini 3.6 Flash")).toBeNull();
    expect(screen.queryByText("Gemini 3.1 Pro Preview")).toBeNull();
    expect(screen.getAllByText("gemini:34")).toHaveLength(2);
    expect(
      StyleSheet.flatten(
        screen.getByTestId("response-mode-option-mode-1").props.style,
      ).minHeight,
    ).toBe(82);
    expect(
      StyleSheet.flatten(
        screen.getByTestId("response-mode-details-mode-1").props.style,
      ),
    ).toEqual(
      expect.objectContaining({
        alignItems: "flex-start",
        flex: 1,
      }),
    );
    expect(
      StyleSheet.flatten(
        screen.getByTestId("response-mode-model-mode-1").props.style,
      ).textAlign,
    ).toBe("left");
    expect(
      screen.getByTestId("response-mode-model-mode-1").props.numberOfLines,
    ).toBe(1);
    expect(
      screen.getByTestId("response-mode-family-mode-1").props.numberOfLines,
    ).toBe(1);
    expect(
      screen.getByTestId("response-mode-effort-mode-1").props.numberOfLines,
    ).toBe(1);
    expect(
      screen.getByTestId("response-mode-model-mode-1").props.ellipsizeMode,
    ).toBe("tail");
  });

  it("uses the same detail layout for one card and marks fixed effort", () => {
    const screen = renderWithProviders(
      <ResponseModeToggle
        selected="mode-1"
        onSelect={jest.fn()}
        modes={[
          {
            id: "mode-1",
            route: {
              provider: "mistral",
              model: "mistral-large-2512",
            },
          },
        ]}
      />,
    );

    expect(screen.getByText("Mistral")).toBeTruthy();
    expect(screen.getByText("Large 3")).toBeTruthy();
    expect(screen.getByText("Effort")).toBeTruthy();
    expect(screen.getByText("Fixed")).toBeTruthy();
    expect(screen.getByText("mistral:42")).toBeTruthy();
    expect(
      StyleSheet.flatten(
        screen.getByTestId("response-mode-option-content-mode-1").props.style,
      ).justifyContent,
    ).toBe("flex-start");
    expect(
      StyleSheet.flatten(
        screen.getByTestId("response-mode-details-mode-1").props.style,
      ),
    ).toEqual(
      expect.objectContaining({
        alignItems: "flex-start",
        flex: 1,
        flexShrink: 1,
        maxWidth: 240,
      }),
    );
    expect(
      StyleSheet.flatten(
        screen.getByTestId("response-mode-provider-mode-1").props.style,
      ),
    ).toEqual(
      expect.objectContaining({
        flexShrink: 0,
        minHeight: 42,
        width: 48,
      }),
    );
    expect(
      StyleSheet.flatten(
        screen.getByTestId("response-mode-model-mode-1").props.style,
      ),
    ).toEqual(
      expect.objectContaining({
        fontSize: 16,
        lineHeight: 21,
        textAlign: "left",
      }),
    );
    expect(
      StyleSheet.flatten(
        screen.getByTestId("response-mode-effort-slot-mode-1").props.style,
      ),
    ).toEqual(
      expect.objectContaining({
        alignSelf: "stretch",
        marginLeft: 6,
        marginRight: 3,
        width: 80,
      }),
    );
    expect(
      StyleSheet.flatten(
        screen.getByTestId("response-mode-effort-label-mode-1").props.style,
      ),
    ).toEqual(
      expect.objectContaining({
        fontSize: 9,
        opacity: 0.72,
      }),
    );
    expect(
      StyleSheet.flatten(
        screen.getByTestId("response-mode-effort-mode-1").props.style,
      ),
    ).toEqual(
      expect.objectContaining({
        fontSize: 11,
        opacity: 0.78,
      }),
    );
  });

  it("reuses the detailed one-card hierarchy in compact landscape", () => {
    const screen = renderWithProviders(
      <ResponseModeToggle
        compact
        selected="mode-1"
        onSelect={jest.fn()}
        modes={[
          {
            id: "mode-1",
            route: {
              provider: "mistral",
              model: "mistral-large-2512",
            },
          },
        ]}
      />,
    );

    expect(screen.getByText("Mistral")).toBeTruthy();
    expect(screen.getByText("Large 3")).toBeTruthy();
    expect(screen.getByText("Effort")).toBeTruthy();
    expect(screen.getByText("Fixed")).toBeTruthy();
    expect(screen.getByText("mistral:42")).toBeTruthy();
    expect(
      StyleSheet.flatten(
        screen.getByTestId("response-mode-details-mode-1").props.style,
      ).alignItems,
    ).toBe("flex-start");
  });

  it("reuses the detailed two-card hierarchy in compact landscape", () => {
    const screen = renderWithProviders(
      <ResponseModeToggle
        compact
        selected="mode-2"
        onSelect={jest.fn()}
        modes={[
          {
            id: "mode-1",
            route: {
              provider: "gemini",
              model: "gemini-3.6-flash",
              effort: "medium",
            },
          },
          {
            id: "mode-2",
            route: {
              provider: "gemini",
              model: "gemini-2.5-flash",
              effort: "high",
            },
          },
        ]}
      />,
    );

    expect(screen.getAllByText("Gemini")).toHaveLength(2);
    expect(screen.getByText("3.6 Flash")).toBeTruthy();
    expect(screen.getByText("2.5 Flash")).toBeTruthy();
    expect(screen.getByText("Effort: Medium")).toBeTruthy();
    expect(screen.getByText("Effort: High")).toBeTruthy();
    expect(screen.getAllByText("gemini:34")).toHaveLength(2);
  });

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
        screen.getByTestId("response-mode-option-mode-2").props.style,
      ).borderColor,
    ).toBe(lightColors.activeControl);
    expect(
      StyleSheet.flatten(responseModeToggleStyles.optionPressed).transform,
    ).toBeUndefined();
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
        screen.getByTestId("response-mode-model-mode-2").props.style,
      ).fontWeight,
    ).toBe("400");
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

  it("enlarges three portrait logos only after every model stays on one line", () => {
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
            route: { provider: "gemini", model: "gemini-3.5-flash" },
          },
          {
            id: "mode-3",
            route: { provider: "gemini", model: "gemini-2.5-flash" },
          },
        ]}
      />,
    );

    expect(screen.getAllByText("gemini:24")).toHaveLength(3);

    fireEvent(screen.getByTestId("response-mode-model-mode-1"), "textLayout", {
      nativeEvent: { lines: [{}] },
    });
    fireEvent(screen.getByTestId("response-mode-model-mode-2"), "textLayout", {
      nativeEvent: { lines: [{}] },
    });
    expect(screen.getAllByText("gemini:24")).toHaveLength(3);

    fireEvent(screen.getByTestId("response-mode-model-mode-3"), "textLayout", {
      nativeEvent: { lines: [{}] },
    });
    expect(screen.getAllByText("gemini:32")).toHaveLength(3);
    expect(
      StyleSheet.flatten(
        screen.getByTestId("response-mode-option-content-mode-1").props.style,
      ),
    ).toEqual(
      expect.objectContaining({
        gap: 0,
        justifyContent: "space-evenly",
      }),
    );
    expect(
      StyleSheet.flatten(
        screen.getByTestId("response-mode-option-inner-mode-1").props.style,
      ).paddingVertical,
    ).toBe(0);
    expect(
      StyleSheet.flatten(
        screen.getByTestId("response-mode-model-slot-mode-1").props.style,
      ),
    ).toEqual(
      expect.objectContaining({
        height: 15,
        transform: [{ translateY: -2 }],
      }),
    );
  });

  it("keeps three portrait logos at their normal size when one model wraps", () => {
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
            route: { provider: "gemini", model: "gemini-3.5-flash" },
          },
          {
            id: "mode-3",
            route: { provider: "gemini", model: "gemini-2.5-flash" },
          },
        ]}
      />,
    );

    fireEvent(screen.getByTestId("response-mode-model-mode-1"), "textLayout", {
      nativeEvent: { lines: [{}] },
    });
    fireEvent(screen.getByTestId("response-mode-model-mode-2"), "textLayout", {
      nativeEvent: { lines: [{}, {}] },
    });
    fireEvent(screen.getByTestId("response-mode-model-mode-3"), "textLayout", {
      nativeEvent: { lines: [{}] },
    });

    expect(screen.getAllByText("gemini:24")).toHaveLength(3);
  });

  it("preserves unchanged measurements when one three-card model changes", () => {
    function ModelSwitcher() {
      const [middleModel, setMiddleModel] =
        React.useState("gemini-3.5-flash");

      return (
        <>
          <Pressable
            testID="switch-middle-model"
            onPress={() => setMiddleModel("gemini-2.5-pro")}
          />
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
                route: { provider: "gemini", model: middleModel },
              },
              {
                id: "mode-3",
                route: { provider: "gemini", model: "gemini-2.5-flash" },
              },
            ]}
          />
        </>
      );
    }

    const screen = renderWithProviders(<ModelSwitcher />);

    for (const id of ["mode-1", "mode-2", "mode-3"]) {
      fireEvent(screen.getByTestId(`response-mode-model-${id}`), "textLayout", {
        nativeEvent: { lines: [{}] },
      });
    }
    expect(screen.getAllByText("gemini:32")).toHaveLength(3);

    fireEvent.press(screen.getByTestId("switch-middle-model"));
    expect(screen.getAllByText("gemini:24")).toHaveLength(3);

    fireEvent(screen.getByTestId("response-mode-model-mode-2"), "textLayout", {
      nativeEvent: { lines: [{}] },
    });
    expect(screen.getAllByText("gemini:32")).toHaveLength(3);
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

  it.each([false, true])(
    "collapses four modes into an interactive selector when compact is %s",
    async (compact) => {
      const onSelect = jest.fn();
      const modes = [
        {
          id: "mode-1",
          route: { provider: "openai" as const, model: "gpt-5.6-sol" },
        },
        {
          id: "mode-2",
          route: {
            provider: "gemini" as const,
            model: "gemini-3.5-flash",
          },
        },
        {
          id: "mode-3",
          route: { provider: "xai" as const, model: "grok-4.5" },
        },
        {
          id: "mode-4",
          route: {
            provider: "mistral" as const,
            model: "mistral-medium-3-5",
          },
        },
      ];

      const screen = renderWithProviders(
        <ResponseModeToggle
          compact={compact}
          selected="mode-4"
          onSelect={onSelect}
          modes={modes}
        />,
      );

      expect(screen.queryByTestId("response-mode-list")).toBeNull();
      expect(screen.queryByTestId("response-mode-option-mode-4")).toBeNull();
      expect(screen.getByTestId("response-mode-overflow-selector")).toBeTruthy();
      expect(screen.getByText(`mistral:${compact ? 36 : 42}`)).toBeTruthy();
      expect(screen.getByText("Medium 3.5")).toBeTruthy();

      fireEvent.press(screen.getByTestId("response-mode-overflow-selector"));

      expect(screen.UNSAFE_getByType(Modal).props.animationType).toBe("none");
      expect(
        screen.getByTestId("response-mode-overflow-backdrop-motion"),
      ).toBeTruthy();
      expect(
        screen.getByTestId("response-mode-overflow-sheet-motion"),
      ).toBeTruthy();
      expect(screen.getByTestId("response-mode-overflow-sheet")).toBeTruthy();
      expect(
        StyleSheet.flatten(
          screen.getByTestId("response-mode-overflow-sheet-motion").props.style,
        ).maxHeight,
      ).toBe(compact ? "88%" : "78%");
      expect(
        StyleSheet.flatten(
          screen.getByTestId("response-mode-overflow-sheet").props.style,
        ).maxHeight,
      ).toBeUndefined();
      expect(
        StyleSheet.flatten(
          screen.getByTestId("response-mode-overflow-list").props.style,
        ),
      ).toEqual(
        expect.objectContaining({
          flexGrow: 0,
          flexShrink: 1,
        }),
      );
      expect(screen.getByText("Choose a model")).toBeTruthy();
      expect(screen.getByText("4 models available")).toBeTruthy();
      expect(screen.getByText("GPT-5.6 Sol")).toBeTruthy();
      expect(screen.getByText("Gemini 3.5 Flash")).toBeTruthy();
      expect(screen.getByText("Grok 4.5")).toBeTruthy();
      expect(screen.getByText("Mistral Medium 3.5")).toBeTruthy();
      expect(
        screen.getByTestId("response-mode-overflow-option-mode-4").props
          .accessibilityState,
      ).toEqual({
        disabled: false,
        selected: true,
      });

      fireEvent.press(
        screen.getByTestId("response-mode-overflow-option-mode-2"),
      );

      expect(onSelect).toHaveBeenCalledWith("mode-2");
      await waitFor(() =>
        expect(
          screen.queryByTestId("response-mode-overflow-sheet"),
        ).toBeNull(),
      );
    },
  );

  it("keeps the full selector list available when more than four modes exist", () => {
    const screen = renderWithProviders(
      <ResponseModeToggle
        selected="mode-5"
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
          {
            id: "mode-5",
            route: {
              provider: "deepseek",
              model: "deepseek-v4-flash",
            },
          },
        ]}
      />,
    );

    fireEvent.press(screen.getByTestId("response-mode-overflow-selector"));

    expect(screen.getByText("5 models available")).toBeTruthy();
    expect(
      screen.getByTestId("response-mode-overflow-option-mode-5"),
    ).toBeTruthy();
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
    expect(screen.getByText("openai:32")).toBeTruthy();
    expect(
      StyleSheet.flatten(
        screen.getByTestId("response-mode-model-mode-1").props.style,
      ).fontWeight,
    ).toBe("400");
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
