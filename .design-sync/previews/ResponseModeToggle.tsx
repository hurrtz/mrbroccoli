import React from "react";
import { ResponseModeToggle, View, darkColors } from "mrbroccoli";

// Real call site: src/screens/main/MainScreenRouteCard.tsx renders
// <ResponseModeToggle compact selected={activeResponseMode} modes={responseModes}
// readyModes={availableResponseModes} onSelect={...} /> inside the home-screen
// hero card. The component itself (src/components/ResponseModeToggle.tsx)
// picks the layout purely from `modes.length`:
//   1-2 modes -> ResponseModeCardList, detailed layout (wide cards)
//   3 modes   -> ResponseModeCardList, dense three-card row
//   4+ modes  -> ResponseModeOverflowSelector (a single pill that opens a sheet)
// That's the whole variant axis this component exists for, so each layout
// gets its own cell. Model ids are real, current catalogue entries from
// src/constants/providers/runtimeManifest.ts (chosen for their explicit
// namedModel() fallback label, so the display name is correct even if the
// broader provider catalogue doesn't resolve in this bundle) so
// getProviderModelName / getResponseModeRouteEffortLabel resolve exactly as
// they do in the app. The fourth, on-device mode mirrors the real local route
// shape built in OnDeviceSettingsPage.handleUse (runtime: "local",
// localModelId, model: model.name).

const anthropic = {
  provider: "anthropic" as const,
  model: "claude-sonnet-5", // "Claude Sonnet 5"
};
const openai = {
  provider: "openai" as const,
  model: "gpt-5.6-sol", // "GPT-5.6 Sol"
};
const gemini = {
  provider: "gemini" as const,
  model: "gemini-3.1-pro-preview", // "Gemini 3.1 Pro Preview"
};
const localQwen = {
  provider: "anthropic" as const, // ignored for local routes; real code leaves lastProvider here
  model: "Qwen3 1.7B",
  runtime: "local" as const,
  localModelId: "qwen3-1.7b-q8" as const,
};

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

// Single configured route: detailed layout, but the only card is
// non-interactive (there is nothing else to switch to).
export const OneRoute = () => (
  <Canvas>
    <ResponseModeToggle
      selected="mode-1"
      onSelect={() => {}}
      modes={[{ id: "mode-1", route: anthropic }]}
    />
  </Canvas>
);

// Two configured routes: still the detailed layout (family/name/effort each
// on their own line).
export const TwoRoutes = () => (
  <Canvas>
    <ResponseModeToggle
      selected="mode-1"
      onSelect={() => {}}
      modes={[
        { id: "mode-1", route: anthropic },
        { id: "mode-2", route: openai },
      ]}
    />
  </Canvas>
);

// Three configured routes: the dense three-card row, its own distinct layout.
export const ThreeRoutes = () => (
  <Canvas>
    <ResponseModeToggle
      selected="mode-2"
      onSelect={() => {}}
      modes={[
        { id: "mode-1", route: anthropic },
        { id: "mode-2", route: openai },
        { id: "mode-3", route: gemini },
      ]}
    />
  </Canvas>
);

// Same three-card row, but one route (Gemini) isn't ready yet -- e.g. no API
// key configured -- so it renders dimmed and disabled via `readyModes`.
export const UnavailableRoute = () => (
  <Canvas>
    <ResponseModeToggle
      selected="mode-1"
      onSelect={() => {}}
      modes={[
        { id: "mode-1", route: anthropic },
        { id: "mode-2", route: openai },
        { id: "mode-3", route: gemini },
      ]}
      readyModes={["mode-1", "mode-2"]}
    />
  </Canvas>
);

// Four or more configured routes collapse into a single selector pill that
// opens a bottom sheet on press; the selected mode here is the on-device
// route, showing the "cpu" icon + on-device label branch.
export const Overflow = () => (
  <Canvas>
    <ResponseModeToggle
      selected="mode-4"
      onSelect={() => {}}
      modes={[
        { id: "mode-1", route: anthropic },
        { id: "mode-2", route: openai },
        { id: "mode-3", route: gemini },
        { id: "mode-4", route: localQwen },
      ]}
    />
  </Canvas>
);
