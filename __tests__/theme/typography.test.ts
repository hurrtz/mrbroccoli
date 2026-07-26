import { fonts, textStyles } from "../../src/theme/typography";

describe("semantic typography", () => {
  it("keeps headings visually ordered", () => {
    expect(textStyles.screenTitle.fontSize).toBeGreaterThan(
      textStyles.sectionTitle.fontSize,
    );
    expect(textStyles.sectionTitle.fontSize).toBeGreaterThan(
      textStyles.subsectionTitle.fontSize,
    );
    expect(textStyles.screenTitle.fontFamily).toBe(fonts.headline);
    expect(textStyles.sectionTitle.fontFamily).toBe(fonts.headline);
    expect(Number(textStyles.subsectionTitle.fontWeight)).toBeGreaterThan(
      Number(textStyles.body.fontWeight),
    );
  });

  it("keeps reading text larger than supporting text", () => {
    expect(textStyles.body.fontSize).toBeGreaterThan(
      textStyles.supporting.fontSize,
    );
    expect(textStyles.supporting.fontSize).toBeGreaterThan(
      textStyles.caption.fontSize,
    );
    expect(textStyles.body.lineHeight).toBeGreaterThan(
      textStyles.body.fontSize,
    );
  });

  it("reserves uppercase monospace for compact control labels", () => {
    expect(textStyles.controlLabel.textTransform).toBe("uppercase");
    expect(textStyles.controlLabel.fontFamily).toBeDefined();
    expect(textStyles.subsectionTitle.textTransform).toBeUndefined();
  });
});
