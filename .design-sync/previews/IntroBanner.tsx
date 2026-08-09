import React from "react";
import { IntroBanner, View, darkColors } from "mrbroccoli";

// Real wiring is src/screens/MainScreen.tsx (workspace.introBanner) and
// src/screens/main/MainScreenWorkspace.tsx, which renders it right above the
// route card. `showDismiss` is `runtimeSettings.introOpened` -- the X only
// appears once the user has actually opened the introduction once (see the
// comment on IntroBanner itself). `t` is passed down rather than read via
// context, so it is stubbed here with the component's real English copy from
// src/i18n/introTranslations.ts -- IntroBanner only ever asks for these four
// keys.
const introCopy: Record<string, string> = {
  introBannerTitle: "New here?",
  introBannerBody: "See what Mr Broccoli does and pick how to power it.",
  introBannerAction: "Take a look",
  introBannerDismiss: "Dismiss introduction",
};
const t = (key: string) => introCopy[key] ?? key;

// IntroBanner deliberately ignores the light/dark app theme (introBannerTheme
// in src/components/introFlow/introTheme.ts is a fixed violet palette), but
// it still sits on the workspace canvas in the real screen, so the card frame
// matches that context.
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

// First launch: the invitation alone, no dismiss target yet.
export const FirstLaunch = () => (
  <Canvas>
    <IntroBanner
      onDismiss={() => {}}
      onOpen={() => {}}
      showDismiss={false}
      t={t}
      visible
    />
  </Canvas>
);

// After the user has opened the introduction once: a dedicated dismiss
// target (top-right X) appears alongside the still-open invitation.
export const Returning = () => (
  <Canvas>
    <IntroBanner
      onDismiss={() => {}}
      onOpen={() => {}}
      showDismiss
      t={t}
      visible
    />
  </Canvas>
);
