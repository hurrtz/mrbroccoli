export const STORE_PROMO_APP_ID = "com.tobiaswinkler.app.mrbroccoli.maestro";
export const STORE_PROMO_FLOW = ".maestro/flows/store-promos/ios.yaml";
export const STORE_PROMO_FLOWS = Object.freeze({
  android: Object.freeze([
    ".maestro/flows/store-promos/android-premium-home.yaml",
    ".maestro/flows/store-promos/android-free.yaml",
    ".maestro/flows/store-promos/android-onboarding.yaml",
    ".maestro/flows/store-promos/android-onboarding-ready.yaml",
    ".maestro/flows/store-promos/android-premium-surfaces.yaml",
  ]),
  ios: Object.freeze([STORE_PROMO_FLOW]),
});
export const STORE_PROMO_ANDROID_FLOW_SCENES = Object.freeze([
  "premium",
  "free",
  "onboarding",
  "onboarding-ready",
  "premium",
]);

export const STORE_PROMO_SCREENSHOT_NAMES = Object.freeze({
  android: Object.freeze([
    "01-premium-active-conversation",
    "02-transcript-drawer",
    "03-free-conversation",
    "04-premium-price",
    "05-onboarding-welcome",
    "06-onboarding-setup",
    "07-onboarding-try",
    "08-conversation-branches",
    "09-premium-settings",
    "10-premium-thinking",
    "11-premium-speaking",
    "12-automatic-setup",
    "13-conversation-settings",
  ]),
  ios: Object.freeze([
    "01-premium-active-conversation",
    "02-transcript-drawer",
    "03-free-conversation",
    "04-premium-price",
    "05-onboarding-welcome",
    "06-onboarding-setup",
    "07-onboarding-try",
    "08-conversation-branches",
    "09-premium-settings",
    "10-premium-thinking",
    "11-premium-speaking",
    "12-automatic-setup",
    "13-conversation-settings",
  ]),
});

export const STORE_PROMO_SCREENSHOT_COUNTS = Object.freeze({
  android: STORE_PROMO_SCREENSHOT_NAMES.android.length,
  ios: STORE_PROMO_SCREENSHOT_NAMES.ios.length,
});

export const STORE_PROMO_IOS_DISPLAYS = Object.freeze({
  6.9: {
    appleDisplayClass: "6.9",
    deviceName: "iPhone 17 Pro Max",
    deviceType: "com.apple.CoreSimulator.SimDeviceType.iPhone-17-Pro-Max",
    acceptedPortraitDimensions: [
      [1260, 2736],
      [1290, 2796],
      [1320, 2868],
    ],
  },
  6.5: {
    appleDisplayClass: "6.5",
    deviceName: "iPhone 11 Pro Max",
    deviceType: "com.apple.CoreSimulator.SimDeviceType.iPhone-11-Pro-Max",
    acceptedPortraitDimensions: [
      [1284, 2778],
      [1242, 2688],
    ],
  },
  6.3: {
    appleDisplayClass: "6.3",
    deviceName: "iPhone 17 Pro",
    deviceType: "com.apple.CoreSimulator.SimDeviceType.iPhone-17-Pro",
    acceptedPortraitDimensions: [
      [1179, 2556],
      [1206, 2622],
    ],
  },
  6.1: {
    appleDisplayClass: "6.1",
    deviceName: "iPhone 13 Pro",
    deviceType: "com.apple.CoreSimulator.SimDeviceType.iPhone-13-Pro",
    acceptedPortraitDimensions: [
      [1170, 2532],
      [1125, 2436],
      [1080, 2340],
    ],
  },
  5.5: {
    appleDisplayClass: "5.5",
    deviceName: "iPhone 8 Plus",
    deviceType: "com.apple.CoreSimulator.SimDeviceType.iPhone-8-Plus",
    acceptedPortraitDimensions: [[1242, 2208]],
    maximumRuntimeMajor: 16,
    runtimeNote:
      "Requires a compatible iOS 16 simulator runtime and may need an older Xcode installation.",
  },
  4.7: {
    appleDisplayClass: "4.7",
    deviceName: "iPhone SE (3rd generation)",
    deviceType:
      "com.apple.CoreSimulator.SimDeviceType.iPhone-SE-3rd-generation",
    acceptedPortraitDimensions: [[750, 1334]],
  },
  ipad: {
    appleDisplayClass: "13-inch iPad",
    deviceClass: "ipad",
    deviceName: "iPad Pro 13-inch (M5) (12GB)",
    deviceType: "com.apple.CoreSimulator.SimDeviceType.iPad-Pro-13-inch-M5-12GB",
    acceptedPortraitDimensions: [[2064, 2752]],
  },
});

export const STORE_PROMO_ANDROID_DISPLAYS = Object.freeze({
  phone: {
    deviceClass: "phone",
    deviceName: "Pixel 7",
    acceptedPortraitDimensions: [[1080, 2400]],
  },
  tablet: {
    deviceClass: "tablet",
    deviceName: "Android 10-inch tablet",
    overrideDensity: 320,
    overrideSize: [1600, 2560],
    acceptedPortraitDimensions: [[1600, 2560]],
  },
});
