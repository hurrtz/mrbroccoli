export const STORE_PROMO_APP_ID =
  "com.tobiaswinkler.app.mrbroccoli.maestro";
export const STORE_PROMO_FLOW = ".maestro/flows/store-promos/ios.yaml";
export const STORE_PROMO_FLOWS = Object.freeze({
  android: Object.freeze([
    ".maestro/flows/store-promos/android.yaml",
    ".maestro/flows/store-promos/android-active.yaml",
  ]),
  ios: Object.freeze([STORE_PROMO_FLOW]),
});
export const STORE_PROMO_SCREENSHOT_COUNT = 10;

export const STORE_PROMO_SCREENSHOT_NAMES = Object.freeze([
  "01-raw-home",
  "02-raw-conversation-drawer",
  "03-active-conversation",
  "04-active-uber-audit",
  "05-active-conversation-drawer",
  "06-active-conversation-branches",
  "07-premium-settings-overview",
  "08-thinking-and-uber-mode",
  "09-speaking-and-voices",
  "10-data-and-privacy",
]);

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
