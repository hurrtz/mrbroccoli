import React from "react";
import { StyleSheet } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";
import { List, Modal, Provider as AntProvider } from "@ant-design/react-native";

import {
  AntPickerRow,
  AntPickerRows,
  AntRadioSection,
  AntSwitchRow,
} from "../../src/features/settings-antd/AntSettingsPrimitives";
import { styles } from "../../src/features/settings-antd/styles";
import { LocalizationProvider } from "../../src/i18n";
import { ThemeProvider } from "../../src/theme/ThemeContext";

function renderPickerRow(optionCount: 1 | 2) {
  return render(
    <ThemeProvider mode="light">
      <AntPickerRow
        label="Provider"
        value="openai"
        options={[
          { value: "openai", label: "OpenAI" },
          ...(optionCount === 2 ? [{ value: "gemini", label: "Gemini" }] : []),
        ]}
        onChange={jest.fn()}
      />
    </ThemeProvider>,
  );
}

describe("AntPickerRow", () => {
  it("renders a sole option as a static value without a disclosure icon", () => {
    const screen = renderPickerRow(1);
    const itemStyle = StyleSheet.flatten(
      screen.UNSAFE_getByType(List.Item).props.style,
    );

    expect(screen.getByText("OpenAI")).toBeTruthy();
    expect(screen.queryByTestId("icon-chevron-down")).toBeNull();
    expect(itemStyle.borderWidth).toBeUndefined();
  });

  it("preserves the selected label when Ant Picker wraps the row", () => {
    const screen = renderPickerRow(2);

    expect(screen.getByText("OpenAI")).toBeTruthy();
    expect(screen.queryByText("请选择")).toBeNull();
    expect(screen.getByTestId("icon-chevron-down")).toBeTruthy();
  });

  it("renders dropdowns as bordered, padded form controls", () => {
    const screen = renderPickerRow(2);
    const item = screen.UNSAFE_getByType(List.Item);
    const itemStyle = StyleSheet.flatten(item.props.style);

    expect(itemStyle).toMatchObject({
      minHeight: 46,
      marginHorizontal: 16,
      borderWidth: 1,
      borderRadius: 10,
      overflow: "hidden",
    });
    expect(item.props.styles.Line).toMatchObject({
      minHeight: 46,
      paddingVertical: 10,
    });
  });

  it("renders an unlabeled picker as a compact value selector", () => {
    const screen = render(
      <ThemeProvider mode="light">
        <AntPickerRow
          value="singapore"
          options={[
            { value: "singapore", label: "Singapore" },
            { value: "us", label: "US (Virginia)" },
          ]}
          onChange={jest.fn()}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText("Singapore")).toBeTruthy();
    expect(screen.queryByText("Region")).toBeNull();
    expect(screen.getByTestId("icon-chevron-down")).toBeTruthy();
  });

  it("does not render an Ant list boundary below picker rows", () => {
    const screen = render(
      <ThemeProvider mode="light">
        <AntPickerRows>
          <AntPickerRow
            label="Region"
            value="us"
            options={[{ value: "us", label: "United States" }]}
            onChange={jest.fn()}
          />
        </AntPickerRows>
      </ThemeProvider>,
    );
    const list = screen.UNSAFE_getByType(List);

    expect(list.props.styles.BodyBottomLine).toEqual({
      height: 0,
      backgroundColor: "transparent",
    });
    expect(
      screen.UNSAFE_getByType(List.Item).props.styles.Line.borderBottomWidth,
    ).toBe(0);
  });
});

describe("AntRadioSection", () => {
  it("keeps explanatory option copy behind a working info action", () => {
    const screen = render(
      <LocalizationProvider language="en">
        <ThemeProvider mode="light">
          <AntProvider>
            <AntRadioSection
              label="Reply Playback"
              options={[
                {
                  value: "stream",
                  label: "Sentences Arrive",
                  description: "Start speaking as sentences are ready.",
                },
                {
                  value: "wait",
                  label: "Full Reply First",
                  description: "Wait for the complete answer.",
                },
              ]}
              value="stream"
              onChange={jest.fn()}
            />
          </AntProvider>
        </ThemeProvider>
      </LocalizationProvider>,
    );

    expect(
      screen.queryByText("Start speaking as sentences are ready."),
    ).toBeNull();
    fireEvent.press(screen.getByLabelText("About Reply Playback"));

    expect(screen.UNSAFE_getByType(Modal).props.title).toBe("Reply Playback");
    expect(
      screen.getByText("Start speaking as sentences are ready."),
    ).toBeTruthy();
    expect(screen.getByText("Wait for the complete answer.")).toBeTruthy();
  });
});

describe("AntSwitchRow", () => {
  it("associates the visible label with the native switch", () => {
    const screen = render(
      <ThemeProvider mode="light">
        <AntSwitchRow
          label="Spoken Replies"
          value
          onChange={jest.fn()}
        />
      </ThemeProvider>,
    );

    expect(screen.getByLabelText("Spoken Replies").props.value).toBe(true);
  });
});

describe("provider card layout roles", () => {
  it("lets a one-row footer size itself without changing wrapped footers", () => {
    expect(StyleSheet.flatten(styles.cardFooter).minHeight).toBeUndefined();
    expect(StyleSheet.flatten(styles.cardFooter).paddingVertical).toBe(8);
    expect(StyleSheet.flatten(styles.capabilityRow).flexWrap).toBe("wrap");
  });

  it("uses one heading size and one body size inside provider cards", () => {
    expect(StyleSheet.flatten(styles.connectionSectionTitle).fontSize).toBe(16);
    expect(StyleSheet.flatten(styles.connectionBodyText).fontSize).toBe(15);
    expect(StyleSheet.flatten(styles.connectionImprintText).fontSize).toBe(12);
  });
});
