import React from "react";
import { fireEvent, waitFor } from "@testing-library/react-native";
import { AiSharingSettingsPage } from "../../src/features/settings/pages/AiSharingSettingsPage";
import {
  getAiSharingSnapshot,
  setAiSharingPermission,
  setSystemSpeechPermission,
} from "../../src/services/aiSharing";
import { DEFAULT_SETTINGS } from "../../src/types";
import { renderWithProviders } from "../test-utils/renderWithProviders";

jest.mock("expo-crypto", () => ({ randomUUID: () => "privacy-installation" }));
jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(async () => null),
  setItemAsync: jest.fn(async () => undefined),
}));

it("lists only used or configured recipients and edits and revokes individual purposes", async () => {
  await setAiSharingPermission("anthropic", "history", true);
  await setSystemSpeechPermission("apple", true);
  const screen = renderWithProviders(
    <AiSharingSettingsPage
      settings={{
        ...DEFAULT_SETTINGS,
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          openai: "fixture",
          elevenlabs: "fixture",
        },
      }}
    />,
  );
  expect(screen.getByTestId("ai-sharing-provider-openai")).toBeTruthy();
  expect(screen.getByTestId("ai-sharing-setting-openai-images").props.accessibilityLabel)
    .toContain("Not yet allowed");
  expect(screen.getByTestId("ai-sharing-provider-anthropic")).toBeTruthy();
  expect(screen.queryByTestId("ai-sharing-provider-xai")).toBeNull();
  expect(
    screen.queryByTestId("ai-sharing-setting-elevenlabs-history"),
  ).toBeNull();
  expect(screen.getByTestId("ai-sharing-system-apple")).toBeTruthy();
  fireEvent.press(screen.getByTestId("ai-sharing-setting-anthropic-history"));
  fireEvent.press(
    screen.getByTestId("ai-sharing-setting-anthropic-history-option-denied"),
  );
  await waitFor(() =>
    expect(getAiSharingSnapshot().permissions.anthropic?.history).toBe(
      "denied",
    ),
  );
  fireEvent.press(screen.getByTestId("ai-sharing-setting-openai-images"));
  fireEvent.press(
    screen.getByTestId("ai-sharing-setting-openai-images-option-allowed"),
  );
  await waitFor(() =>
    expect(getAiSharingSnapshot().permissions.openai?.images).toBe("allowed"),
  );
  fireEvent.press(screen.getByTestId("ai-sharing-setting-openai-images"));
  fireEvent.press(
    screen.getByTestId("ai-sharing-setting-openai-images-option-ask"),
  );
  await waitFor(() =>
    expect(getAiSharingSnapshot().permissions.openai?.images).toBeUndefined(),
  );
  expect(getAiSharingSnapshot().permissions.anthropic?.history).toBe("denied");
  fireEvent.press(screen.getByTestId("ai-sharing-system-apple"));
  fireEvent.press(screen.getByTestId("ai-sharing-system-apple-option-denied"));
  await waitFor(() =>
    expect(getAiSharingSnapshot().systemSpeech?.apple).toBe("denied"),
  );
});
