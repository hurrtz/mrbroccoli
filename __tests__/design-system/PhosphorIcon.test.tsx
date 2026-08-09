import fs from "node:fs";
import path from "node:path";

import React from "react";
import { render } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import {
  ICON_SIZE,
  MIN_ICON_TOUCH_TARGET,
  PhosphorIcon,
} from "../../src/design-system/PhosphorIcon";

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

describe("Phosphor icon system", () => {
  it("uses a deliberate visual scale and a 44-point minimum touch target", () => {
    expect(ICON_SIZE).toEqual({
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

  it("renders decorative Phosphor glyphs with semantic sizing", () => {
    const screen = render(
      <PhosphorIcon name="info-circle" size="navigation" color="#123456" />,
    );
    const icon = screen.UNSAFE_getByProps({
      testID: "phosphor-icon-info-circle",
    });

    expect(icon.props.accessible).toBe(false);
    expect(icon.props.accessibilityElementsHidden).toBe(true);
    expect(icon.props.focusable).toBe(false);
    expect(icon.props.importantForAccessibility).toBe("no-hide-descendants");
    expect(StyleSheet.flatten(icon.props.style).width).toBe(24);
    expect(StyleSheet.flatten(icon.props.style).height).toBe(24);
  });

  it.each(["brain", "council"] as const)(
    "renders the %s glyph through the shared wrapper",
    (name) => {
      const screen = render(
        <PhosphorIcon name={name} size="prominent" color="#123456" />,
      );
      const icon = screen.UNSAFE_getByProps({
        testID: `phosphor-icon-${name}`,
      });

      expect(icon.props.weight).toBe("regular");
      expect(StyleSheet.flatten(icon.props.style).width).toBe(
        ICON_SIZE.prominent,
      );
    },
  );

  it("never lets one glyph carry two meanings", () => {
    // The map is the app's semantic layer over Phosphor: a key is a meaning,
    // not a glyph name. Two keys on one glyph means two things look identical
    // on screen, so this freezes the one known collision and fails on any new
    // one.
    const wrapper = fs.readFileSync(
      path.join(root, "src/design-system/PhosphorIcon.tsx"),
      "utf8",
    );
    const body = wrapper.slice(
      wrapper.indexOf("const PHOSPHOR_ICONS = {"),
      wrapper.indexOf("} satisfies Record<string, Icon>"),
    );
    const glyphsByName = new Map<string, string[]>();

    for (const [, key, glyph] of body.matchAll(
      /^\s{2}"?([a-z-]+)"?:\s*([A-Za-z]+Icon),$/gm,
    )) {
      glyphsByName.set(glyph, [...(glyphsByName.get(glyph) ?? []), key]);
    }

    expect(glyphsByName.size).toBeGreaterThan(50);
    expect(glyphsByName.get("BrainIcon")).toEqual(["brain"]);
    expect(glyphsByName.get("UsersThreeIcon")).toEqual(["council"]);

    const collisions = [...glyphsByName.entries()]
      .filter(([, keys]) => keys.length > 1)
      .map(([glyph, keys]) => `${glyph}: ${keys.join(", ")}`);

    // Known and reported to the owner: "App & diagnostics" and "open style
    // sheet" draw the same sliders. Resolving it means changing one of the two
    // glyphs, which is a design decision rather than a migration one.
    expect(collisions).toEqual(["SlidersHorizontalIcon: control, sliders"]);
  });

  it("keeps every application glyph regular and on the shared wrapper", () => {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(root, "package.json"), "utf8"),
    ) as { dependencies?: Record<string, string> };
    const wrapper = fs.readFileSync(
      path.join(root, "src/design-system/PhosphorIcon.tsx"),
      "utf8",
    );
    const violations = sourceFiles(path.join(root, "src")).flatMap((file) => {
      const source = fs.readFileSync(file, "utf8");
      const relative = path.relative(root, file);
      const errors: string[] = [];

      if (source.includes("@expo/vector-icons") || /\bFeather\b/.test(source)) {
        errors.push(`${relative}: non-Phosphor icon dependency`);
      }
      if (
        relative !== "src/design-system/PhosphorIcon.tsx" &&
        source.includes("phosphor-react-native")
      ) {
        errors.push(`${relative}: bypasses the shared Phosphor icon wrapper`);
      }
      if (
        source.includes("@ant-design/react-native") ||
        source.includes("@ant-design/icons-react-native") ||
        /\bAntIcon(?:Button|Name|Size)?\b/.test(source) ||
        /import\s*\{[^}]*\b(?:Checkbox|Radio)\b[^}]*\}\s*from\s*["']@ant-design\/react-native["']/.test(
          source,
        )
      ) {
        errors.push(`${relative}: retains an Ant glyph path`);
      }

      return errors;
    });

    expect(wrapper).toContain('weight="regular"');
    expect(violations).toEqual([]);
    expect(packageJson.dependencies?.["phosphor-react-native"]).toBeDefined();
    expect(
      packageJson.dependencies?.["@ant-design/icons-react-native"],
    ).toBeUndefined();
    expect(
      packageJson.dependencies?.["@ant-design/react-native"],
    ).toBeUndefined();
    expect(packageJson.dependencies?.["@expo/vector-icons"]).toBeUndefined();
  });
});
