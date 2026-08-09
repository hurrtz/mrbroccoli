import React from "react";
import { AppWordmark, IconButton, View, darkColors } from "mrbroccoli";

// AppWordmark is the brand face (Unica One) rendered by MainScreenTopBar --
// see src/screens/main/MainScreenTopBar.tsx. It takes only `color` and
// `name`; the real call site always passes `colors.text` and `t("appName")`
// ("Mr Broccoli" in English, src/i18n/locales/en.ts).

// Cards render on a white page but the app is dark-themed; the wordmark is
// drawn in `colors.text`, so it needs the app canvas behind it.
const Canvas = ({ children }: { children: React.ReactNode }) => (
  <View
    style={{
      backgroundColor: darkColors.background,
      borderRadius: 12,
      padding: 16,
      width: "100%",
      maxWidth: 520,
    }}
  >
    {children}
  </View>
);

// Isolated, larger presentation so the Unica One face is easy to inspect on
// its own -- the whole point of this component is that face rendering.
export const Wordmark = () => (
  <Canvas>
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 28,
      }}
    >
      <AppWordmark color={darkColors.text} name="Mr Broccoli" />
    </View>
  </Canvas>
);

// Real composition from MainScreenTopBar.tsx: a menu button on the left, the
// wordmark centered over the row via an absolutely-positioned layer, and a
// settings button on the right. APP_HEADER_MIN_HEIGHT/PADDING are exported
// constants from src/components/AppWordmark.tsx (62 / 8 / 10) -- inlined here
// since only the component itself is exported to design-sync.
export const InTopBar = () => (
  <Canvas>
    <View
      style={{
        position: "relative",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 62,
        paddingTop: 8,
        paddingBottom: 10,
      }}
    >
      <IconButton
        icon="menu"
        accessibilityLabel="Conversations"
        onPress={() => {}}
      />
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AppWordmark color={darkColors.text} name="Mr Broccoli" />
      </View>
      <IconButton
        icon="setting"
        accessibilityLabel="Settings"
        onPress={() => {}}
      />
    </View>
  </Canvas>
);
