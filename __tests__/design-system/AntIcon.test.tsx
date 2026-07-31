import fs from "node:fs";
import path from "node:path";

import React from "react";
import { StyleSheet } from "react-native";
import { render } from "@testing-library/react-native";

import {
  ANT_ICON_SIZE,
  AntIcon,
  MIN_ICON_TOUCH_TARGET,
} from "../../src/design-system/AntIcon";

const root = path.resolve(__dirname, "../..");

function sourceFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return sourceFiles(entryPath);
    }

    return /\.(ts|tsx)$/.test(entry.name) ? [entryPath] : [];
  });
}

describe("Ant icon system", () => {
  it("uses a deliberate visual scale and a 44-point minimum touch target", () => {
    expect(ANT_ICON_SIZE).toEqual({
      inline: 14,
      compact: 16,
      control: 20,
      navigation: 24,
      prominent: 28,
      feature: 32,
      hero: 40,
    });
    expect(MIN_ICON_TOUCH_TARGET).toBe(44);
  });

  it("renders decorative Ant glyphs with semantic sizing", () => {
    const screen = render(
      <AntIcon name="info-circle" size="navigation" color="#123456" />,
    );
    const icon = screen.getByTestId("ant-icon-info-circle");

    expect(icon.props.accessible).toBe(false);
    expect(StyleSheet.flatten(icon.props.style)).toEqual(
      expect.objectContaining({ color: "#123456", fontSize: 24 }),
    );
  });

  it("keeps application glyphs on the shared Ant wrapper", () => {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(root, "package.json"), "utf8"),
    ) as { dependencies?: Record<string, string> };
    const violations = sourceFiles(path.join(root, "src")).flatMap((file) => {
      const source = fs.readFileSync(file, "utf8");
      const relative = path.relative(root, file);
      const errors: string[] = [];

      if (source.includes("@expo/vector-icons") || /\bFeather\b/.test(source)) {
        errors.push(`${relative}: non-Ant icon dependency`);
      }
      if (
        relative !== "src/design-system/AntIcon.tsx" &&
        /import\s*\{[^}]*\bIcon\b[^}]*\}\s*from\s*["']@ant-design\/react-native["']/.test(
          source,
        )
      ) {
        errors.push(`${relative}: bypasses the shared Ant icon wrapper`);
      }

      return errors;
    });

    expect(violations).toEqual([]);
    expect(packageJson.dependencies?.["@expo/vector-icons"]).toBeUndefined();
  });
});
