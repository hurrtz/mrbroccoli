import {
  darkColors,
  lightColors,
} from "../../src/theme/colors";
import { createAntTheme } from "../../src/design-system/antTheme";

describe("createAntTheme", () => {
  it("maps the light palette to Ant semantic tokens", () => {
    expect(createAntTheme(lightColors)).toMatchObject({
      color_text_base: lightColors.text,
      color_text_base_inverse: lightColors.onActiveControl,
      fill_body: lightColors.background,
      fill_base: lightColors.surface,
      fill_mask: lightColors.overlay,
      brand_primary: lightColors.accent,
      brand_success: lightColors.success,
      brand_error: lightColors.danger,
      border_color_base: lightColors.border,
      primary_button_fill: lightColors.activeControl,
    });
  });

  it("maps the dark palette without falling back to Ant defaults", () => {
    expect(createAntTheme(darkColors)).toMatchObject({
      color_text_base: darkColors.text,
      color_text_base_inverse: darkColors.onActiveControl,
      fill_body: darkColors.background,
      fill_base: darkColors.surface,
      fill_mask: darkColors.overlay,
      brand_primary: darkColors.accent,
      brand_success: darkColors.success,
      brand_error: darkColors.danger,
      border_color_base: darkColors.border,
      primary_button_fill: darkColors.activeControl,
    });
  });
});
