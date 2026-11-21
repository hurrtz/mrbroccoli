import React from "react";
import {
  Modal as NativeModal,
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
} from "react-native";
import { fireEvent } from "@testing-library/react-native";
import { FullWindowOverlay } from "react-native-screens";

import { translate } from "../../../src/i18n";
import { AiSharingSheet } from "../../../src/screens/main/AiSharingSheet";
import {
  resolveAiSharing,
  type AiSharingPending,
  type AiSharingRequest,
} from "../../../src/services/aiSharing";
import { renderWithProviders } from "../../test-utils/renderWithProviders";

jest.mock("../../../src/services/aiSharing", () => ({
  ...jest.requireActual("../../../src/services/aiSharing"),
  resolveAiSharing: jest.fn(async () => undefined),
}));

jest.mock("react-native", () => {
  const native = jest.requireActual("react-native");
  const window = jest.fn(native.useWindowDimensions);
  return new Proxy(native, {
    get(target, key, receiver) {
      return key === "useWindowDimensions"
        ? window
        : Reflect.get(target, key, receiver);
    },
  });
});

const req: AiSharingRequest = {
  required: [
    { provider: "openrouter", purpose: "prompt" },
    { provider: "anthropic", purpose: "prompt" },
    { provider: "openrouter", purpose: "images" },
    { provider: "anthropic", purpose: "images" },
    { provider: "openrouter", purpose: "council" },
  ],
  optional: [{ provider: "anthropic", purpose: "history" }],
  imageCount: 1,
  council: {
    providers: ["anthropic", "openrouter"],
    synthesisProvider: "openrouter",
  },
  openRouterModels: ["openai/gpt-5.5"],
};
function sheet(request: AiSharingRequest) {
  const pending: AiSharingPending = {
    id: 7,
    request,
    missingRequired: request.required,
    optional: request.optional ?? [],
  };
  return <AiSharingSheet pending={pending} permissions={{}} />;
}

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});
it.each(["ios", "android"] as const)(
  "shows a named, actionable handoff over a native picker on %s",
  (os) => {
    jest.replaceProperty(Platform, "OS", os);
    const screen = renderWithProviders(
      <>
        <NativeModal visible>
          <Text>Voice picker</Text>
        </NativeModal>
        {sheet(req)}
      </>,
    );
    if (os === "ios") {
      expect(screen.UNSAFE_getByType(FullWindowOverlay)).toBeTruthy();
      expect(screen.UNSAFE_getAllByType(NativeModal)).toHaveLength(1);
    } else {
      expect(screen.UNSAFE_queryByType(FullWindowOverlay)).toBeNull();
      expect(screen.UNSAFE_getAllByType(NativeModal)).toHaveLength(2);
    }
    expect(
      screen.getByText("Drafts are shared with Anthropic, OpenRouter."),
    ).toBeTruthy();
    expect(
      screen.getByText(
        "OpenRouter receives the Council’s findings to write the final answer.",
      ),
    ).toBeTruthy();
    expect(
      screen.getByText(/OpenRouter forwards this request to OpenAI/),
    ).toBeTruthy();
    expect(
      screen.getByTestId("ai-sharing-optional-anthropic-history").props
        .accessibilityState.checked,
    ).toBe(false);
    expect(
      screen.getByTestId("ai-sharing-remember-images-openrouter").props
        .accessibilityState.checked,
    ).toBe(false);
    fireEvent.press(screen.getByText("Send once"));
    expect(resolveAiSharing).toHaveBeenCalledWith(7, {
      optional: [],
      rememberImages: [],
    });
  },
);
it("remembers photos and includes optional history only for the recipient chosen", () => {
  const screen = renderWithProviders(sheet(req));
  fireEvent.press(screen.getByTestId("ai-sharing-remember-images-anthropic"));
  fireEvent.press(screen.getByTestId("ai-sharing-optional-anthropic-history"));
  fireEvent.press(screen.getByText("Allow and continue"));
  expect(resolveAiSharing).toHaveBeenCalledWith(7, {
    optional: [{ provider: "anthropic", purpose: "history" }],
    rememberImages: ["anthropic"],
  });
});
it("drops a grouped request when Cancel is pressed", () => {
  const screen = renderWithProviders(sheet(req));
  fireEvent.press(screen.getByText("Cancel"));
  expect(resolveAiSharing).toHaveBeenCalledWith(7, null);
});
it("offers explicit refusal for the core chat permission", () => {
  const screen = renderWithProviders(
    sheet({ required: [{ provider: "openai", purpose: "prompt" }] }),
  );
  fireEvent.press(screen.getByText("Don’t allow"));
  expect(resolveAiSharing).toHaveBeenCalledWith(7, null);
});
it("discloses the system speech recipient before recognition starts", () => {
  const screen = renderWithProviders(
    sheet({ required: [], systemSpeech: "apple" }),
  );
  expect(screen.getByText("Voice recordings")).toBeTruthy();
  expect(screen.getByText(/Apple/)).toBeTruthy();
  fireEvent.press(screen.getByText("Allow and continue"));
  expect(resolveAiSharing).toHaveBeenCalledWith(7, {
    optional: [],
    rememberImages: [],
  });
});

it("wraps the large Arabic disclosure in a scrollable RTL sheet with labelled actions", () => {
  const dimensions = jest.mocked(useWindowDimensions);
  dimensions.mockReturnValue({
    width: 375,
    height: 780,
    scale: 2,
    fontScale: 2,
  });
  try {
    const screen = renderWithProviders(sheet(req), { language: "ar" });
    expect(
      StyleSheet.flatten(screen.getByTestId("native-dialog-card").props.style)
        .direction,
    ).toBe("rtl");
    const title = screen.getByText(translate("ar", "aiSharingRequestTitle"));
    expect(title.props.numberOfLines).toBeUndefined();
    expect(
      screen.getByText(translate("ar", "aiSharingHistoryDetail")).props
        .numberOfLines,
    ).toBe(0);
    expect(screen.getByTestId("ai-sharing-consent")).toBeTruthy();
    expect(
      screen.getByRole("button", {
        name: translate("ar", "aiSharingSendOnce"),
      }),
    ).toBeTruthy();
    expect(
      screen.getByTestId("ai-sharing-optional-anthropic-history").props
        .accessibilityLabel,
    ).toContain("Anthropic");
  } finally {
    dimensions.mockImplementation(
      jest.requireActual("react-native").useWindowDimensions,
    );
  }
});
