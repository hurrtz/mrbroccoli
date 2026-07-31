import React from "react";
import { render } from "@testing-library/react-native";

import { ProviderIcon } from "../../src/components/ProviderIcon";

describe("ProviderIcon", () => {
  it("renders a bundled provider component with the requested color", () => {
    const screen = render(<ProviderIcon provider="xai" color="#123456" />);

    expect(screen.getByTestId("provider-icon-xai").props).toEqual(
      expect.objectContaining({
        accessible: false,
        color: "#123456",
        fill: "#123456",
        height: 24,
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

    expect(screen.getByText("FP")).toBeTruthy();
  });

  it("supports compact icon sizing without changing the source asset", () => {
    const screen = render(
      <ProviderIcon provider="xai" color="#123456" size="compact" />,
    );

    expect(screen.getByTestId("provider-icon-xai").props).toEqual(
      expect.objectContaining({ height: 16, width: 16 }),
    );
  });
});
