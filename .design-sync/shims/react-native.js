// The `react-native` module as design-sync's browser bundle sees it.
//
// react-native-web implements essentially all of the surface Mr Broccoli's
// components use — of the RN APIs reachable from the synced set, it provides
// every one except the two below, which exist only to reach native code:
//
//   TurboModuleRegistry     how a native module is looked up (@dr.pogodin/
//                           react-native-fs, react-native-sherpa-onnx)
//   requireNativeComponent  the legacy native view registry
//
// Both are stubbed rather than aliased away because the modules that call them
// are imported for their types and constants by components whose *visual*
// layer is pure React Native — LocalModelPerformanceSummary reaches the
// on-device model stack this way. The stubs must never throw at import time:
// these calls happen at module scope, so a throw would take down the whole
// bundle rather than the one feature that is meaningless in a browser anyway.
//
// Local declarations win over `export *` in ESM, so nothing here can shadow a
// real react-native-web implementation by accident.

export * from "react-native-web/dist/index.js";

import { Animated as RNWAnimated } from "react-native-web/dist/index.js";

// ── Animations settle instantly ──────────────────────────────────────────────
//
// react-native-web drives Animated from JS and measures progress with
// Date.now(). The preview capture pipeline calls Playwright's
// `page.clock.setFixedTime()`, which pins Date.now() while leaving
// requestAnimationFrame running — so every animation stalls at frame zero,
// forever. Components that fade or slide in on mount then never become
// visible: Toast mounts at opacity 0 and stayed there in every captured cell,
// producing four byte-identical blank PNGs.
//
// Rather than leave those components unpreviewable, animations here complete
// immediately: the value jumps to its target and the completion callback fires
// with `finished: true`. A static preview card should show the settled state
// anyway, and components that gate real logic on the completion callback (the
// DS `Modal`'s sheet unmount, for one) become deterministic instead of
// depending on a clock the harness has frozen.
//
// This affects only the design-sync bundle. The shipped app uses the real
// Animated with its real durations.

const settled = { finished: true };

function instant(value, config) {
  return {
    start(callback) {
      if (value && typeof value.setValue === "function") {
        value.setValue(config?.toValue);
      }
      callback?.(settled);
    },
    stop() {},
    reset() {},
  };
}

function group(animations) {
  return {
    start(callback) {
      for (const animation of animations ?? []) animation?.start?.();
      callback?.(settled);
    },
    stop() {
      for (const animation of animations ?? []) animation?.stop?.();
    },
    reset() {},
  };
}

export const Animated = Object.assign({}, RNWAnimated, {
  timing: instant,
  spring: instant,
  decay: instant,
  parallel: group,
  sequence: group,
  stagger: (_duration, animations) => group(animations),
  // A looping animation has no settled state to capture — run its inner
  // animation once so the value lands somewhere real, then stop.
  loop: (animation) => group([animation]),
  delay: () => group([]),
});

// Any property access returns a no-op function; any call returns undefined.
const nativeModuleStub = new Proxy(
  {},
  { get: () => () => undefined },
);

export const TurboModuleRegistry = {
  get: () => null,
  getEnforcing: () => nativeModuleStub,
};

export function requireNativeComponent(name) {
  const NativeComponentStub = () => null;
  NativeComponentStub.displayName = `NativeStub(${name})`;
  return NativeComponentStub;
}
