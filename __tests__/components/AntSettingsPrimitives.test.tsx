import React from "react";
import { Modal as NativeModal, StyleSheet } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";
import { List, Modal, Provider as AntProvider } from "@ant-design/react-native";

import {
  AntPickerRow,
  AntPickerRows,
  AntRadioSection,
  AntSwitchRow,
} from "../../src/features/settings/AntSettingsPrimitives";
import { styles } from "../../src/features/settings/styles";
import { LocalizationProvider } from "../../src/i18n";
import { ThemeProvider } from "../../src/theme/ThemeContext";

const AntModal = Modal as unknown as React.ComponentType<any>;

function renderPickerRow(optionCount: 1 | 2, onChange = jest.fn()) {
  return render(
    <LocalizationProvider language="en">
      <ThemeProvider mode="light">
        <AntPickerRow
          testID="provider-picker"
          label="Provider"
          value="openai"
          options={[
            { value: "openai", label: "OpenAI" },
            ...(optionCount === 2
              ? [{ value: "gemini", label: "Gemini" }]
              : []),
          ]}
          onChange={onChange}
        />
      </ThemeProvider>
    </LocalizationProvider>,
  );
}

function renderPicker(element: React.ReactElement) {
  return render(
    <LocalizationProvider language="en">
      <ThemeProvider mode="light">{element}</ThemeProvider>
    </LocalizationProvider>,
  );
}

describe("AntPickerRow", () => {
  it("renders a sole option as a static value without a disclosure icon", () => {
    const screen = renderPickerRow(1);
    const itemStyle = StyleSheet.flatten(
      screen.getByTestId("provider-picker").props.style,
    );

    expect(screen.getByText("OpenAI")).toBeTruthy();
    expect(screen.queryByTestId("phosphor-icon-down")).toBeNull();
    expect(itemStyle.borderWidth).toBeUndefined();
  });

  it("keeps an unlabeled sole option in the right-hand value column", () => {
    const screen = renderPicker(
      <AntPickerRow
        testID="single-provider"
        value="gemini"
        options={[{ value: "gemini", label: "Google" }]}
        onChange={jest.fn()}
      />,
    );

    expect(screen.getByTestId("single-provider-value").props.children).toBe(
      "Google",
    );
    expect(
      StyleSheet.flatten(
        screen.getByTestId("single-provider-value").props.style,
      ).textAlign,
    ).toBe("right");
  });

  it("opens an app-owned picker sheet and applies a selected option", () => {
    const onChange = jest.fn();
    const screen = renderPickerRow(2, onChange);

    expect(screen.getByText("OpenAI")).toBeTruthy();
    expect(screen.getByTestId("phosphor-icon-down")).toBeTruthy();

    fireEvent.press(screen.getByTestId("provider-picker"));

    expect(screen.getByTestId("provider-picker-modal")).toBeTruthy();
    expect(screen.getByText("Gemini")).toBeTruthy();
    expect(screen.UNSAFE_getByType(NativeModal).props.visible).toBe(true);

    fireEvent.press(screen.getByTestId("provider-picker-option-gemini"));

    expect(onChange).toHaveBeenCalledWith("gemini");
    expect(screen.UNSAFE_getByType(NativeModal).props.visible).toBe(false);
  });

  it("renders dropdowns as bordered, padded form controls", () => {
    const screen = renderPickerRow(2);
    const item = screen.getByTestId("provider-picker");
    const itemStyle = StyleSheet.flatten(item.props.style);

    expect(itemStyle).toMatchObject({
      minHeight: 46,
      marginHorizontal: 16,
      borderWidth: 1,
      borderRadius: 10,
      overflow: "hidden",
    });
    expect(
      StyleSheet.flatten(
        screen.getByTestId("provider-picker-content").props.style,
      ),
    ).toMatchObject({
      minHeight: 46,
      paddingVertical: 10,
    });
  });

  it("renders an unlabeled picker as a compact value selector", () => {
    const screen = renderPicker(
      <AntPickerRow
        value="singapore"
        options={[
          { value: "singapore", label: "Singapore" },
          { value: "us", label: "US (Virginia)" },
        ]}
        onChange={jest.fn()}
      />,
    );

    expect(screen.getByText("Singapore")).toBeTruthy();
    expect(screen.queryByText("Region")).toBeNull();
    expect(screen.getByTestId("phosphor-icon-down")).toBeTruthy();
  });

  it("lets a standalone dropdown align with surrounding cards", () => {
    const screen = renderPicker(
      <AntPickerRow
        testID="standalone-picker"
        standalone
        label="Language"
        value="en"
        options={[
          { value: "en", label: "English" },
          { value: "de", label: "German" },
        ]}
        onChange={jest.fn()}
      />,
    );

    expect(
      StyleSheet.flatten(screen.getByTestId("standalone-picker").props.style)
        .marginHorizontal,
    ).toBe(0);
  });

  it("does not render an Ant list boundary below picker rows", () => {
    const screen = renderPicker(
      <AntPickerRows>
        <AntPickerRow
          label="Region"
          value="us"
          options={[{ value: "us", label: "United States" }]}
          onChange={jest.fn()}
        />
      </AntPickerRows>,
    );
    const list = screen.UNSAFE_getByType(List);

    expect(list.props.styles.BodyBottomLine).toEqual({
      height: 0,
      backgroundColor: "transparent",
    });
    expect(screen.UNSAFE_queryAllByType(List.Item)).toHaveLength(0);
  });
});

describe("AntRadioSection", () => {
  it("uses the full row to select an option and preserves disabled state", () => {
    const onChange = jest.fn();
    const screen = render(
      <LocalizationProvider language="en">
        <ThemeProvider mode="light">
          <AntRadioSection
            testID="reply-playback"
            label="Reply Playback"
            options={[
              { value: "stream", label: "Sentences Arrive" },
              { value: "wait", label: "Full Reply First" },
              { value: "disabled", label: "Unavailable", disabled: true },
            ]}
            value="stream"
            onChange={onChange}
          />
        </ThemeProvider>
      </LocalizationProvider>,
    );

    expect(
      screen.getByTestId("reply-playback-stream").props.accessibilityState,
    ).toEqual({ checked: true, disabled: false });
    expect(
      screen.getByTestId("reply-playback-wait").props.accessibilityState,
    ).toEqual({ checked: false, disabled: false });

    fireEvent.press(screen.getByTestId("reply-playback-wait"));
    fireEvent.press(screen.getByTestId("reply-playback-disabled"));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("wait");
  });

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

    expect(screen.UNSAFE_getByType(AntModal).props).toMatchObject({
      modalType: "modal",
      title: "Reply Playback",
      visible: true,
    });
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
        <AntSwitchRow label="Spoken Replies" value onChange={jest.fn()} />
      </ThemeProvider>,
    );

    expect(screen.getByLabelText("Spoken Replies").props.value).toBe(true);
  });
});

describe("provider card layout roles", () => {
  it("lets a one-row footer size itself without changing wrapped footers", () => {
    expect(
      (StyleSheet.flatten(styles.cardFooter) as { minHeight?: number }).minHeight,
    ).toBeUndefined();
    expect(StyleSheet.flatten(styles.cardFooter).paddingVertical).toBe(8);
    expect(StyleSheet.flatten(styles.capabilityRow).flexWrap).toBe("wrap");
  });

  it("uses one heading size and one body size inside provider cards", () => {
    expect(StyleSheet.flatten(styles.connectionSectionTitle).fontSize).toBe(16);
    expect(StyleSheet.flatten(styles.connectionBodyText).fontSize).toBe(15);
    expect(StyleSheet.flatten(styles.connectionImprintText).fontSize).toBe(12);
  });
});
