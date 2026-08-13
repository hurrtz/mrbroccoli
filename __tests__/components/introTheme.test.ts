import { getIntroTheme } from "../../src/components/introFlow/introTheme";
import { darkColors, lightColors } from "../../src/theme/colors";

describe("getIntroTheme", () => {
  it("derives the premium family from the app theme instead of duplicating it", () => {
    const light = getIntroTheme(lightColors, false);
    expect(light.premium).toBe(lightColors.premium);
    expect(light.premiumSoft).toBe(lightColors.premiumSoft);
    expect(light.premiumBorder).toBe(lightColors.premiumBorder);
    expect(light.onPremium).toBe(lightColors.onPremium);

    const dark = getIntroTheme(darkColors, true);
    expect(dark.premium).toBe(darkColors.premium);
    expect(dark.premiumSoft).toBe(darkColors.premiumSoft);
    expect(dark.premiumBorder).toBe(darkColors.premiumBorder);
    expect(dark.onPremium).toBe(darkColors.onPremium);
  });
});
