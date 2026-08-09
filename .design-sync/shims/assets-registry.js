// Browser stub for `react-native/assets-registry` and its `/registry` entry.
//
// The native asset registry hands Metro-bundled image assets numeric ids. In
// the design-sync bundle images arrive as data URIs (esbuild's `.png`/`.svg`
// dataurl loaders), so nothing consults the registry — but the import edge
// still drags react-native's Flow-typed source into esbuild if left alone.

const assets = [];

export function registerAsset(asset) {
  return assets.push(asset);
}

export function getAssetByID(assetId) {
  return assets[assetId - 1];
}

export default { registerAsset, getAssetByID };
