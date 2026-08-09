import fs from "node:fs";
import path from "node:path";

const root = path.resolve(__dirname, "../..");

/** Everything the design system migration added or recomposed. */
const MIGRATED_FILES = [
  "src/design-system/VoiceOrb.tsx",
  "src/design-system/OrbSatellite.tsx",
  "src/design-system/WorkspaceStatusLine.tsx",
  "src/design-system/ConversationSettingsSummary.tsx",
  "src/design-system/TranscriptHandle.tsx",
  "src/components/RouteByline.tsx",
  "src/features/settings/settings-primitives/RuntimeReadiness.tsx",
];

function read(file: string) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

describe("migrated surfaces survive the sweep", () => {
  it.each(MIGRATED_FILES)("%s lays out without a hard side", (file) => {
    // React Native flips `row` and the logical properties for a right-to-left
    // locale, but never `paddingLeft` or `marginRight`. A hard side is the one
    // way a flex layout still comes out mirrored wrongly in Arabic or Urdu.
    const source = read(file);
    const offenders = [
      "paddingLeft",
      "paddingRight",
      "marginLeft",
      "marginRight",
      "borderLeftWidth",
      "borderRightWidth",
    ].filter((property) => source.includes(`${property}:`));

    expect(offenders).toEqual([]);
  });

  it.each(MIGRATED_FILES)("%s lets its text scale with the system", (file) => {
    // Largest-text is a supported setting, not an edge case, so nothing here
    // may opt out of Dynamic Type.
    expect(read(file)).not.toContain("allowFontScaling");
  });

  it.each(MIGRATED_FILES)("%s resolves every colour through the theme", (file) => {
    const source = read(file);
    // Hex literals in a component mean one appearance was drawn and the other
    // inherited by accident. `transparent` is not a colour in that sense.
    const literals = source.match(/["']#[0-9A-Fa-f]{3,8}["']/g) ?? [];

    expect(literals).toEqual([]);
  });

  it("keeps every interactive target at 44 points", () => {
    // The floor is stated once, in the icon boundary, so a component cannot
    // quietly disagree with it by writing its own number.
    const wrapper = read("src/design-system/PhosphorIcon.tsx");

    expect(wrapper).toContain("export const MIN_ICON_TOUCH_TARGET = 44");

    for (const file of [
      "src/design-system/OrbSatellite.tsx",
      "src/features/settings/settings-primitives/RuntimeReadiness.tsx",
    ]) {
      expect(read(file)).toContain("MIN_ICON_TOUCH_TARGET");
    }
  });
});
