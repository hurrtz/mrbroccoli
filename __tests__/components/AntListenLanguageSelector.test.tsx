import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import { AntListenLanguageSelector } from "../../src/features/settings/AntListenLanguageSelector";
import { LocalizationProvider } from "../../src/i18n";
import { ThemeProvider } from "../../src/theme/ThemeContext";

describe("AntListenLanguageSelector", () => {
  it("uses full checkbox rows and reports the selected language", () => {
    const onToggleLanguage = jest.fn();
    const screen = render(
      <LocalizationProvider language="en">
        <ThemeProvider mode="light">
          <AntListenLanguageSelector
              selectedLanguages={["en"]}
              onToggleLanguage={onToggleLanguage}
          />
        </ThemeProvider>
      </LocalizationProvider>,
    );

    fireEvent.press(screen.getByLabelText("Listen Languages"));

    const languageRows = screen.getAllByRole("checkbox");
    expect(languageRows[0].props.accessibilityState).toEqual({ checked: true });
    fireEvent.press(languageRows[1]);

    expect(onToggleLanguage).toHaveBeenCalledTimes(1);
    expect(onToggleLanguage).toHaveBeenCalledWith("de");
  });
});
