import React from "react";
import { StyleSheet } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";

jest.mock("react-native-reanimated", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: {
      View,
      createAnimatedComponent: (component: unknown) => component,
    },
    cancelAnimation: jest.fn(),
    Easing: { linear: jest.fn() },
    useAnimatedProps: (factory: () => unknown) => factory(),
    useSharedValue: (value: unknown) => ({ value }),
    withDelay: jest.fn(() => 0),
    withTiming: jest.fn((value: unknown) => value),
  };
});

import {
  getOrbTransportLayout,
  OrbTransport,
} from "../../src/design-system/OrbTransport";
import { ThemeProvider } from "../../src/theme/ThemeContext";

const labels = {
  back: "Back",
  forward: "Forward",
  restart: "Restart",
  stop: "Stop",
};

function renderTransport(
  phase: React.ComponentProps<typeof OrbTransport>["phase"],
) {
  const callbacks = {
    onBack: jest.fn(),
    onForward: jest.fn(),
    onRestart: jest.fn(),
    onStop: jest.fn(),
  };
  const screen = render(
    <ThemeProvider mode="light">
      <OrbTransport
        labels
        phase={phase}
        transportLabels={labels}
        voiceOrb={{ label: "Voice", size: 196 }}
        {...callbacks}
      />
    </ThemeProvider>,
  );
  return { callbacks, screen };
}

describe("OrbTransport", () => {
  it("keeps the approved 328 by 227 footprint at rest without showing keys", () => {
    const { screen } = renderTransport("idle");
    const layout = getOrbTransportLayout(196, true);

    expect(layout).toEqual(
      expect.objectContaining({ height: 227, width: 328 }),
    );
    expect(
      StyleSheet.flatten(screen.getByTestId("orb-transport").props.style),
    ).toEqual(expect.objectContaining({ height: 227, width: 328 }));
    expect(screen.queryByTestId("orb-transport-stop")).toBeNull();
  });

  it("shows only Stop as active while the response is being prepared", () => {
    const { callbacks, screen } = renderTransport("thinking");

    expect(
      screen.getByTestId("orb-transport-restart").props.accessibilityState,
    ).toEqual(expect.objectContaining({ disabled: true }));
    expect(
      screen.getByTestId("orb-transport-back").props.accessibilityState,
    ).toEqual(expect.objectContaining({ disabled: true }));
    expect(
      screen.getByTestId("orb-transport-forward").props.accessibilityState,
    ).toEqual(expect.objectContaining({ disabled: true }));
    expect(
      screen.getByTestId("orb-transport-stop").props.accessibilityState,
    ).toEqual(expect.objectContaining({ disabled: false }));

    fireEvent.press(screen.getByTestId("orb-transport-stop"));
    expect(callbacks.onStop).toHaveBeenCalledTimes(1);
  });

  it("activates all four orbit controls while speaking", () => {
    const { callbacks, screen } = renderTransport("speaking");

    for (const control of ["restart", "back", "forward", "stop"] as const) {
      const target = screen.getByTestId(`orb-transport-${control}`);
      expect(target.props.accessibilityState).toEqual(
        expect.objectContaining({ disabled: false }),
      );
      fireEvent.press(target);
    }
    expect(callbacks.onRestart).toHaveBeenCalledTimes(1);
    expect(callbacks.onBack).toHaveBeenCalledTimes(1);
    expect(callbacks.onForward).toHaveBeenCalledTimes(1);
    expect(callbacks.onStop).toHaveBeenCalledTimes(1);
  });
});
