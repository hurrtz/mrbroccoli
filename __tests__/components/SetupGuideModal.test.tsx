import React from "react";
import { StyleSheet } from "react-native";

import { fireEvent } from "@testing-library/react-native";

import { SetupGuideModal } from "../../src/components/SetupGuideModal";
import { renderWithProviders } from "../test-utils/renderWithProviders";

const mockUseWindowDimensions = jest.fn(() => ({
  width: 390,
  height: 844,
  scale: 3,
  fontScale: 1,
}));

jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => ({
    __esModule: true,
    default: () => mockUseWindowDimensions(),
  }),
);

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("@expo/vector-icons", () => ({
  Feather: ({ name }: { name: string }) => {
    const React = require("react");
    const { Text } = require("react-native");
    return React.createElement(Text, null, name);
  },
}));

const defaultProps = {
  visible: true,
  step: "provider" as const,
  providerOptions: [{ label: "OpenAI", value: "openai" as const }],
  selectedProvider: "openai" as const,
  selectedProviderApiKey: "",
  currentValidationState: { status: "idle" as const },
  resolvedRoutes: {
    llm: {
      enabled: false,
      provider: "openai" as const,
      model: "gpt-4.1-mini",
    },
    stt: {
      enabled: true,
      kind: "system" as const,
    },
    tts: {
      enabled: false,
      kind: "disabled" as const,
    },
    webSearch: {
      available: false,
      provider: null,
    },
  },
  voiceTest: {
    phase: "idle" as const,
    transcript: "",
    reply: "",
    errorMessage: null,
    isRecording: false,
    isBusy: false,
    hasCompleted: false,
  },
  kokoroModel: {
    installed: false,
    verified: false,
    busy: null,
    phase: null,
    progress: 0,
    error: null,
    download: jest.fn(async () => true),
    refresh: jest.fn(async () => undefined),
    remove: jest.fn(async () => true),
  },
  useKokoro: false,
  onSelectProvider: jest.fn(),
  onChangeProviderApiKey: jest.fn(),
  onDismiss: jest.fn(),
  onBack: jest.fn(),
  onContinueFromIntro: jest.fn(),
  onValidateProviderKey: jest.fn(),
  onContinueFromProvider: jest.fn(),
  onToggleKokoro: jest.fn(),
  onDownloadKokoro: jest.fn(),
  onContinueFromKokoro: jest.fn(),
  onVoiceTestAction: jest.fn(),
  onResetVoiceTest: jest.fn(),
  onContinueFromVoiceTest: jest.fn(),
  onFinish: jest.fn(),
  onOpenSettings: jest.fn(),
};

describe("SetupGuideModal", () => {
  beforeEach(() => {
    mockUseWindowDimensions.mockReturnValue({
      width: 390,
      height: 844,
      scale: 3,
      fontScale: 1,
    });
  });

  it("keeps the landscape card inside the available safe height", () => {
    mockUseWindowDimensions.mockReturnValue({
      width: 800,
      height: 360,
      scale: 3,
      fontScale: 1,
    });

    const screen = renderWithProviders(
      <SetupGuideModal
        {...defaultProps}
        step="intro"
        showSettingsShortcutOption
      />,
    );
    const cardStyle = StyleSheet.flatten(
      screen.getByTestId("setup-guide-card").props.style,
    );

    expect(cardStyle).toMatchObject({
      maxWidth: 760,
      maxHeight: 312,
    });
  });

  it("uses an eye button to reveal and hide the API key", () => {
    const screen = renderWithProviders(
      <SetupGuideModal
        {...defaultProps}
        selectedProviderApiKey="sk-test-secret"
      />,
    );
    let input = screen.getByDisplayValue("sk-test-secret");

    expect(input.props.secureTextEntry).toBe(true);

    fireEvent(input, "focus");
    input = screen.getByDisplayValue("sk-test-secret");
    expect(input.props.secureTextEntry).toBe(true);

    fireEvent.press(screen.getByLabelText("Show key"));
    input = screen.getByDisplayValue("sk-test-secret");
    expect(input.props.secureTextEntry).toBe(false);
    expect(screen.getByLabelText("Hide key")).toBeTruthy();

    fireEvent.press(screen.getByLabelText("Hide key"));
    input = screen.getByDisplayValue("sk-test-secret");
    expect(input.props.secureTextEntry).toBe(true);
  });

  it("shows a separate Qwen region selector and keeps the key field clean", () => {
    const screen = renderWithProviders(
      <SetupGuideModal
        {...defaultProps}
        providerOptions={[
          {
            label: "Alibaba / Qwen",
            value: "alibaba-qwen-dashscope",
          },
        ]}
        selectedProvider="alibaba-qwen-dashscope"
        selectedProviderApiKey="sk-qwen-test|beijing"
      />,
    );

    expect(screen.getByDisplayValue("sk-qwen-test")).toBeTruthy();
    expect(screen.queryByDisplayValue("sk-qwen-test|beijing")).toBeNull();
    expect(screen.getByText("Qwen API Region")).toBeTruthy();
    expect(screen.getByText("China (Beijing)")).toBeTruthy();
  });

  it("does not show missing API key guidance before validation is attempted", () => {
    const screen = renderWithProviders(<SetupGuideModal {...defaultProps} />);

    expect(
      screen.queryByText(
        "Add an API key to continue, or cancel the setup guide.",
      ),
    ).toBeNull();
  });

  it("does not run validation without an API key", () => {
    const onValidateProviderKey = jest.fn();
    const screen = renderWithProviders(
      <SetupGuideModal
        {...defaultProps}
        onValidateProviderKey={onValidateProviderKey}
      />,
    );

    fireEvent.press(screen.getByText("Validate key"));

    expect(onValidateProviderKey).not.toHaveBeenCalled();
  });

  it("shows attempted missing API key guidance above the provider footer", () => {
    const screen = renderWithProviders(
      <SetupGuideModal
        {...defaultProps}
        currentValidationState={{
          status: "error",
          provider: "openai",
          apiKey: "",
          model: "gpt-4.1-mini",
          message: "Add an API key to continue, or cancel the setup guide.",
        }}
      />,
    );

    expect(
      screen.getByText(
        "Add an API key to continue, or cancel the setup guide.",
      ),
    ).toBeTruthy();
  });

  it("does not run validation without a provider", () => {
    const onValidateProviderKey = jest.fn();
    const screen = renderWithProviders(
      <SetupGuideModal
        {...defaultProps}
        selectedProvider={null}
        onValidateProviderKey={onValidateProviderKey}
      />,
    );

    fireEvent.press(screen.getByText("Validate key"));

    expect(onValidateProviderKey).not.toHaveBeenCalled();
  });

  it("can hide the Settings shortcut when opened from Settings", () => {
    const onChangeSettingsShortcutVisible = jest.fn();
    const screen = renderWithProviders(
      <SetupGuideModal
        {...defaultProps}
        step="intro"
        showSettingsShortcutOption
        settingsShortcutVisible
        onChangeSettingsShortcutVisible={onChangeSettingsShortcutVisible}
      />,
    );

    const shortcutSwitch = screen.getByLabelText(
      "Show guided setup in Settings",
    );
    expect(shortcutSwitch.props.value).toBe(true);

    fireEvent(shortcutSwitch, "valueChange", false);
    expect(onChangeSettingsShortcutVisible).toHaveBeenCalledWith(false);
  });

  it("offers Kokoro as an optional downloadable wizard step", () => {
    const onDownloadKokoro = jest.fn();
    const onContinueFromKokoro = jest.fn();
    const screen = renderWithProviders(
      <SetupGuideModal
        {...defaultProps}
        step="kokoro"
        onDownloadKokoro={onDownloadKokoro}
        onContinueFromKokoro={onContinueFromKokoro}
      />,
    );

    expect(screen.getByText("Add a Natural On-device Voice")).toBeTruthy();
    fireEvent.press(screen.getByText("Download Kokoro"));
    expect(onDownloadKokoro).toHaveBeenCalledTimes(1);
    fireEvent.press(screen.getByText("Skip for now"));
    expect(onContinueFromKokoro).toHaveBeenCalledTimes(1);
  });
});
