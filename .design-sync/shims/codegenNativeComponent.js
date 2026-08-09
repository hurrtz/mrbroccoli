// Browser stub for `react-native/Libraries/Utilities/codegenNativeComponent`.
//
// react-native-svg and react-native-safe-area-context declare their Fabric
// native components through this helper. On a real device those declarations
// resolve to platform views; in a browser the packages render through their
// `.web.js` variants instead (see .design-sync/tsconfig.designsync.json), so
// these declarations are only ever imported, never rendered.
//
// Without the stub esbuild follows the import into react-native's own Flow-
// typed source, which it cannot parse — `Expected "from" but found "{"`.

export default function codegenNativeComponent(name) {
  const NativeComponentStub = () => null;
  NativeComponentStub.displayName = `NativeStub(${name})`;
  return NativeComponentStub;
}
