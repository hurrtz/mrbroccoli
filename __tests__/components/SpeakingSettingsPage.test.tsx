import React from "react";
import { fireEvent, waitFor } from "@testing-library/react-native";

const mockClearProviderTtsAudioCache = jest.fn(async () => undefined);

jest.mock("../../src/services/providerTtsAudioCache", () => ({
  clearProviderTtsAudioCache: () => mockClearProviderTtsAudioCache(),
}));

jest.mock(
  "../../src/features/settings/settings-primitives/LocalModelRouteGroup",
  () => ({
    LocalModelRouteGroup: () => null,
  }),
);

jest.mock(
  "../../src/features/settings/settings-primitives/VoicePickerSheet",
  () => ({
    VoicePickerSheet: () => null,
  }),
);

import { SpeakingSettingsPage } from "../../src/features/settings/pages/SpeakingSettingsPage";
import { DEFAULT_SETTINGS } from "../../src/types";
import { renderWithProviders } from "../test-utils/renderWithProviders";

function renderPage() {
  return renderWithProviders(
    <SpeakingSettingsPage
      activePreview={null}
      localModels={{ nativeVoiceOptions: [] } as never}
      onPreviewKokoroVoice={jest.fn(async () => undefined)}
      onPreviewNativeVoice={jest.fn(async () => undefined)}
      onPreviewProviderVoice={jest.fn(async () => undefined)}
      onTextInputFocus={jest.fn()}
      onUpdate={jest.fn()}
      onUpdateProviderTtsModel={jest.fn()}
      onUpdateProviderTtsVoice={jest.fn()}
      providerVoiceDirectories={{} as never}
      selectableTtsProviders={[]}
      settings={DEFAULT_SETTINGS}
    />,
  );
}

describe("SpeakingSettingsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockClearProviderTtsAudioCache.mockResolvedValue(undefined);
  });

  it("reports cache cleanup in its owning row", async () => {
    const screen = renderPage();

    fireEvent.press(screen.getByTestId("clear-speech-replay-cache"));

    await waitFor(() =>
      expect(
        screen.getByText("The cached speech files were removed."),
      ).toBeTruthy(),
    );
  });

  it("keeps cache cleanup failure in its owning row", async () => {
    mockClearProviderTtsAudioCache.mockRejectedValueOnce(new Error("nope"));
    const screen = renderPage();

    fireEvent.press(screen.getByTestId("clear-speech-replay-cache"));

    await waitFor(() =>
      expect(
        screen.getByText("The speech cache could not be cleared."),
      ).toBeTruthy(),
    );
  });
});
