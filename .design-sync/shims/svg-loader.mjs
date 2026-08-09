// esbuild loader that turns a `.svg` import into a React component, the way
// Metro's react-native-svg-transformer does for the app.
//
// src/components/ProviderIcon.tsx imports the nine provider brand marks as
// components (`import AnthropicIcon from ".../anthropic.svg"` then
// `<AnthropicIcon width={24} />`). esbuild's built-in `.svg` loaders can only
// produce a string or a URL, so the import arrives as a data: URI and React
// tries to use it as a tag name:
//
//   InvalidCharacterError: The tag name provided
//   ('data:image/svg+xml,<svg …>') is not a valid name
//
// Rendering through react-native-svg's SvgXml keeps the real asset and the
// real renderer — the same component the app draws, not a lookalike.
//
// Imported by both .design-sync/overrides/bundle.mjs (the shipped bundle) and
// .design-sync/overrides/previews.mjs (the preview cards), because the two
// build their esbuild options separately.

import { readFileSync } from 'node:fs';
import { dirname } from 'node:path';

export const svgComponentPlugin = {
  name: 'svg-as-rn-component',
  setup(build) {
    build.onLoad({ filter: /\.svg$/ }, (args) => ({
      contents: `
import React from "react";
import { SvgXml } from "react-native-svg";
const xml = ${JSON.stringify(readFileSync(args.path, 'utf8'))};
export default function SvgAsset(props) {
  return React.createElement(SvgXml, { xml, ...props });
}
`,
      loader: 'jsx',
      // Resolve react-native-svg by walking up from the asset, so the plugin
      // works regardless of which build passes it through.
      resolveDir: dirname(args.path),
    }));
  },
};
