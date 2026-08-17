export const APPLICATION_IDENTIFIERS = Object.freeze({
  android: Object.freeze({
    production: "com.tobiaswinkler.app.android.mrbroccoli",
    debug: "com.tobiaswinkler.app.android.mrbroccoli.dev",
    maestro: "com.tobiaswinkler.app.android.mrbroccoli.maestro",
  }),
  ios: Object.freeze({
    production: "com.tobiaswinkler.app.mrbroccoli",
    debug: "com.tobiaswinkler.app.mrbroccoli.dev",
    maestro: "com.tobiaswinkler.app.mrbroccoli.maestro",
  }),
});

export const ANDROID_NATIVE_NAMESPACE = "com.tobiaswinkler.app.mrbroccoli";

export function applicationIdentifierFor(platform, variant = "production") {
  const identifier = APPLICATION_IDENTIFIERS[platform]?.[variant];
  if (!identifier) {
    throw new Error(`Unknown application identity: ${platform}/${variant}`);
  }
  return identifier;
}
