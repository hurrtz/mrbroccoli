// Regenerates .design-sync/tokens.css from the app's real theme source.
//
// Mr Broccoli's design tokens live as TypeScript objects (src/theme/colors.ts,
// src/theme/typography.ts) because React Native styles in JS, not CSS. The
// claude.ai/design agent styles its own layout glue in CSS, so it needs the
// same palette and type scale as custom properties. Generating them keeps the
// two from drifting: re-run this whenever the theme source changes.
//
//   node .design-sync/gen-tokens.mjs
//
// Depends on esbuild from the staged converter deps (.ds-sync/node_modules),
// so run `npm i` in .ds-sync/ first — see AGENTS.md / .design-sync/NOTES.md.

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");

const { build } = await import(
  pathToFileURL(join(ROOT, ".ds-sync/node_modules/esbuild/lib/main.js")).href
);

// react-native is not loadable under plain node. typography.ts only needs
// Platform.select, and colors.ts needs nothing — stub the whole module.
const stubReactNative = {
  name: "stub-react-native",
  setup(b) {
    b.onResolve({ filter: /^react-native$/ }, () => ({
      path: "react-native",
      namespace: "stub",
    }));
    b.onLoad({ filter: /.*/, namespace: "stub" }, () => ({
      contents: `export const Platform = { OS: "web", select: (o) => o.default ?? o.web ?? o.ios };`,
      loader: "js",
    }));
  },
};

const tmp = mkdtempSync(join(tmpdir(), "mb-tokens-"));
const outfile = join(tmp, "theme.mjs");
try {
  await build({
    entryPoints: [join(HERE, "theme-entry.ts")],
    outfile,
    bundle: true,
    format: "esm",
    platform: "neutral",
    plugins: [stubReactNative],
    logLevel: "warning",
  });
  const { lightColors, darkColors, fonts, textStyles } = await import(
    pathToFileURL(outfile).href
  );
  writeFileSync(
    join(HERE, "tokens.css"),
    renderCss({ lightColors, darkColors, fonts, textStyles }),
  );
  const names = Object.keys(lightColors).length;
  console.log(
    `tokens.css: ${names} colors x2 themes, ${Object.keys(textStyles).length} text roles, ${Object.keys(fonts).length} families`,
  );
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

// kebab-case a camelCase token name: surfaceRaisedBorder -> surface-raised-border
// (function declaration, not const — the top-level await above calls it.)
function kebab(s) {
  return s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

// Bridge correction, not a token. React Native's `flex: 0` means "inflexible,
// sized by content" — Yoga's equivalent of CSS `flex: 0 0 auto`. react-native-web
// passes the number straight through (see createReactDOMStyle.js: only `flex: -1`
// gets special handling), so the browser expands it to `flex: 0 1 0%` — a
// SHRINKABLE, ZERO-BASIS item that collapses to zero width.
//
// Observed: `cardHeaderExtra: { flex: 0 }` (src/features/settings/styles.ts)
// collapsed the wrapper around AntSettingsCard's 44x44 header info button to
// 0px, so the button overflowed and was clipped to a sliver by the card's
// `overflow: hidden`. That silently damaged eight preview cells across
// AntSettingsCard, AntDisclosureCard, AntRadioSection and AntPickerSection.
//
// The app is CORRECT on native; this is purely a bridge artifact, so it is
// fixed here rather than in src/. The selector is react-native-web's own
// deterministic atomic class for the declaration `flex: 0`, doubled to win on
// specificity against the stylesheet it injects at runtime. Only `flex: 0` is
// affected — for n >= 1, CSS `flex: n` (= n 1 0%) already matches Yoga.
//
// RE-SYNC RISK: the class name is a hash of the declaration and is stable for a
// given react-native-web version. Re-verify it after upgrading react-native-web
// by checking whether a `flex: 0` wrapper still computes to zero width.
function rnwFlexFix() {
  return `/* react-native-web bridge correction — see gen-tokens.mjs for the full rationale.
 * RN \`flex: 0\` is content-sized (0 0 auto); react-native-web emits CSS \`flex: 0\`,
 * which browsers expand to the shrinkable, zero-basis \`0 1 0%\`. */
.r-flex-1d9yedq.r-flex-1d9yedq {
  flex: 0 0 auto;
}
`;
}

function colorBlock(colors, prefix, indent = "  ") {
  return Object.entries(colors)
    .map(([k, v]) => `${indent}--mb-${prefix}${kebab(k)}: ${v};`)
    .join("\n");
}

function renderCss({ lightColors, darkColors, fonts, textStyles }) {
  const alias = Object.keys(lightColors)
    .map((k) => `  --mb-color-${kebab(k)}: var(--mb-light-${kebab(k)});`)
    .join("\n");
  const aliasDark = Object.keys(darkColors)
    .map((k) => `    --mb-color-${kebab(k)}: var(--mb-dark-${kebab(k)});`)
    .join("\n");

  const families = Object.entries(fonts)
    .map(([k, v]) => `  --mb-font-${kebab(k)}: ${v};`)
    .join("\n");

  const text = Object.entries(textStyles)
    .map(([role, style]) => {
      const r = kebab(role);
      const lines = [
        `  --mb-text-${r}-family: ${style.fontFamily};`,
        `  --mb-text-${r}-size: ${style.fontSize}px;`,
        `  --mb-text-${r}-line-height: ${style.lineHeight}px;`,
        `  --mb-text-${r}-weight: ${style.fontWeight};`,
      ];
      if (style.letterSpacing !== undefined) {
        lines.push(`  --mb-text-${r}-letter-spacing: ${style.letterSpacing}px;`);
      }
      if (style.textTransform !== undefined) {
        lines.push(`  --mb-text-${r}-transform: ${style.textTransform};`);
      }
      return lines.join("\n");
    })
    .join("\n\n");

  return `/* GENERATED by .design-sync/gen-tokens.mjs — do not edit by hand.
 * Source of truth: src/theme/colors.ts and src/theme/typography.ts.
 *
 * Mr Broccoli's components do NOT read these custom properties. They style in
 * JS: colors come from useTheme(), type from textStyles in typography.ts.
 * These variables mirror that same palette and scale so a design built with
 * this system can style its own layout glue in the app's real vocabulary
 * instead of inventing colors.
 *
 * --mb-light-* / --mb-dark-* are the two explicit palettes.
 * --mb-color-*  follows the viewer's color scheme (and [data-theme]).
 */

:root {
${colorBlock(lightColors, "light-")}

${colorBlock(darkColors, "dark-")}

${alias}

${families}

${text}
}

@media (prefers-color-scheme: dark) {
  :root {
${aliasDark}
  }
}

:root[data-theme="dark"] {
${aliasDark.replace(/^ {4}/gm, "  ")}
}

:root[data-theme="light"] {
${alias}
}

${rnwFlexFix()}`;
}
