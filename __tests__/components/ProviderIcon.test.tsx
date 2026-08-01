import React from "react";
import { render } from "@testing-library/react-native";

import { ProviderIcon } from "../../src/components/ProviderIcon";

describe("ProviderIcon", () => {
  it("renders a bundled provider component with the requested color", () => {
    const screen = render(<ProviderIcon provider="xai" color="#123456" />);

    expect(screen.UNSAFE_getByProps({ testID: "provider-icon-xai" }).props).toEqual(
      expect.objectContaining({
        accessible: false,
        accessibilityElementsHidden: true,
        color: "#123456",
        fill: "#123456",
        focusable: false,
        height: 24,
        importantForAccessibility: "no-hide-descendants",
        width: 24,
      }),
    );
  });

  it("uses a readable fallback for providers without a bundled icon", () => {
    const screen = render(
      <ProviderIcon
        provider="future-provider"
        color="#123456"
        label="Future Provider"
      />,
    );

    expect(
      screen.UNSAFE_getByProps({ testID: "provider-icon-future-provider" }).props,
    ).toEqual(
      expect.objectContaining({
        accessible: false,
        accessibilityElementsHidden: true,
        importantForAccessibility: "no-hide-descendants",
      }),
    );
  });

  it("supports compact icon sizing without changing the source asset", () => {
    const screen = render(
      <ProviderIcon provider="xai" color="#123456" size="compact" />,
    );

    expect(screen.UNSAFE_getByProps({ testID: "provider-icon-xai" }).props).toEqual(
      expect.objectContaining({ height: 16, width: 16 }),
    );
  });
});
