export const STORE_PROMO_APP_ID =
  "com.tobiaswinkler.app.mrbroccoli.maestro";
export const STORE_PROMO_FLOW = ".maestro/flows/store-promos/ios.yaml";
export const STORE_PROMO_FLOWS = Object.freeze({
  android: Object.freeze([
    ".maestro/flows/store-promos/android-premium-home.yaml",
    ".maestro/flows/store-promos/android-free.yaml",
    ".maestro/flows/store-promos/android-premium-surfaces.yaml",
  ]),
  ios: Object.freeze([STORE_PROMO_FLOW]),
});
export const STORE_PROMO_ANDROID_FLOW_SCENES = Object.freeze([
  "premium",
  "free",
  "premium",
]);

export const STORE_PROMO_SCREENSHOT_NAMES = Object.freeze({
  android: Object.freeze([
    "01-premium-active-conversation",
    "02-free-conversation",
    "03-free-onboarding",
    "04-conversation-branches",
    "05-premium-settings",
    "06-premium-thinking",
    "07-automatic-setup",
    "08-conversation-settings",
  ]),
  ios: Object.freeze([
    "01-premium-active-conversation",
    "02-uber-mode-audit",
    "03-free-conversation",
    "04-free-onboarding",
    "05-conversation-branches",
    "06-premium-settings",
    "07-premium-thinking",
    "08-premium-speaking",
    "09-automatic-setup",
    "10-conversation-settings",
  ]),
});

export const STORE_PROMO_SCREENSHOT_COUNTS = Object.freeze({
  android: STORE_PROMO_SCREENSHOT_NAMES.android.length,
  ios: STORE_PROMO_SCREENSHOT_NAMES.ios.length,
});

export const STORE_PROMO_IOS_DISPLAYS = Object.freeze({
  "6.8": {
    appleDisplayClass: "6.9",
    deviceName: "iPhone 17 Pro Max",
    deviceType: "com.apple.CoreSimulator.SimDeviceType.iPhone-17-Pro-Max",
    acceptedPortraitDimensions: [
      [1260, 2736],
      [1290, 2796],
      [1320, 2868],
    ],
  },
  "6.5": {
    appleDisplayClass: "6.5",
    deviceName: "iPhone 11 Pro Max",
    deviceType: "com.apple.CoreSimulator.SimDeviceType.iPhone-11-Pro-Max",
    acceptedPortraitDimensions: [
      [1284, 2778],
      [1242, 2688],
    ],
  },
  "6.3": {
    appleDisplayClass: "6.3",
    deviceName: "iPhone 17 Pro",
    deviceType: "com.apple.CoreSimulator.SimDeviceType.iPhone-17-Pro",
    acceptedPortraitDimensions: [
      [1179, 2556],
      [1206, 2622],
    ],
  },
  "6.1": {
    appleDisplayClass: "6.1",
    deviceName: "iPhone 13 Pro",
    deviceType: "com.apple.CoreSimulator.SimDeviceType.iPhone-13-Pro",
    acceptedPortraitDimensions: [
      [1170, 2532],
      [1125, 2436],
      [1080, 2340],
    ],
  },
  "5.5": {
    appleDisplayClass: "5.5",
    deviceName: "iPhone 8 Plus",
    deviceType: "com.apple.CoreSimulator.SimDeviceType.iPhone-8-Plus",
    acceptedPortraitDimensions: [[1242, 2208]],
    runtimeNote:
      "Requires a compatible iOS 16 simulator runtime and may need an older Xcode installation.",
  },
  "4.7": {
    appleDisplayClass: "4.7",
    deviceName: "iPhone SE (3rd generation)",
    deviceType:
      "com.apple.CoreSimulator.SimDeviceType.iPhone-SE-3rd-generation",
    acceptedPortraitDimensions: [[750, 1334]],
  },
});

export const STORE_PROMO_ANDROID_DISPLAYS = Object.freeze({
  phone: {
    deviceName: "Pixel 7",
    acceptedPortraitDimensions: [[1080, 2400]],
  },
});
