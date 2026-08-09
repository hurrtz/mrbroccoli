import React from "react";
import { MessageImageAttachments, View, darkColors } from "mrbroccoli";

// MessageImageAttachments takes `colors` and `t` as plain props (it reads no
// context itself — see src/components/MessageImageAttachments.tsx), so this
// preview supplies the real dark palette and a translate stub matching the
// two keys the component actually calls (src/i18n/imagePromptTranslations.ts
// has the real English copy). Remote image URLs do not load in the headless
// render, so the fixtures use small inline data: URIs (tiny real JPEGs) so
// the thumbnails actually render as photos rather than empty boxes.

const t = (key: string, params?: Record<string, string | number | undefined>) => {
  switch (key) {
    case "attachedImageLabel":
      return `Attached image ${params?.index} of ${params?.count}`;
    case "removeAttachedImage":
      return `Remove attached image ${params?.index}`;
    default:
      return key;
  }
};

// Small real JPEGs (96x72) so the thumbnails render as actual photo content,
// not blank/transparent boxes.
const LANDSCAPE_PHOTO_URI =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCABIAGADAREAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUI/8QAHRAAAgEEAwAAAAAAAAAAAAAAABQBEVFh8FJiof/EABkBAQEBAQEBAAAAAAAAAAAAAAADAQIHCP/EABYRAQEBAAAAAAAAAAAAAAAAAAASEf/aAAwDAQACEQMRAD8A0A3Fz54x7xI3FxhI3FxhI3FxhI3FxhI3FxhI3FxhI3FxhI3FxhI3FxhI3FxhI3FxhKS1PI3F5Gp5DCRqeQwkankMJGp5DCRqeQwkankMJGp5DCRqeQwkankMJGp5DCRqeQwlHam5q8jU3BI1NwSNTcEjU3BI1NwSNTcEjU3BI1NwSNTcEjU3BI1NwSkNbU3FcGtqMMGtqMMGtqMMGtqMMGtqMMGtqMMGtqMMGtqMMGtqMMGtqMMGtqMMSGcnS0jOQSM5BIzkEjOQSM5BIzkEjOQSM5BIzkEjOQSM5BKQ1tTpfBragwa2oMGtqDBragwa2oMGtqDBragwa2oMGtqDBragwa2oMSGshWRrIJGsgkayCRrIJGsgkayCRrIJGsgkayCRrIJGsglIb7enWLyN9vRhI329GEjfb0YSN9vRhI329GEjfb0YSN9vRhI329GEjfb0YSN9vRhI329GEpDc3NWkbm4JG5uCRubgkbm4JG5uCRubgkbm4JG5uCRubgkbm4JG5uCX/9k=";
const SKYLINE_PHOTO_URI =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCABIAGADAREAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAGhAAAgMBAQAAAAAAAAAAAAAAAAETFFFhYv/EABgBAQEBAQEAAAAAAAAAAAAAAAACAQMH/8QAFREBAQAAAAAAAAAAAAAAAAAAABH/2gAMAwEAAhEDEQA/AM5sM9TeHQsMELDBCwwQsMELDBCwwQsMELDBCwwQsMELDBE6wgqFhAhYQIWECFhAhYQIWECFhAhYQIWECFhAhYQImWEFwsIELCBCwgQsIELCBCwgQsIELCBCwgQsIELCBE6daZXQnWihOtFCdaKE60UJ1ooTrRQnWihOtFCdaKE60UJ1oomzrRXSE60UhOtFITrRSE60UhOtFITrRSE60UhOtFITrRSE60UhOtFInTdFXCbopCbopCbopCbopCbopCbopCbopCbopCbopCbopCbopE2f0SuE/oEJ/QIT+gQn9AhP6BCf0CE/oEJ/QIT+gQn9AhP6BE2d6bHWE70QhO9EITvRCE70QhO9EITvRCE70QhO9EITvRCE70QhO9EInWHpioWHoIWHoIWHoIWHoIWHoIWHoIWHoIWHoIWHoIWHoIWHoI//2Q==";

const attachment = (
  id: string,
  uri: string,
  overrides: Record<string, unknown> = {},
) => ({
  id,
  kind: "image" as const,
  uri,
  mimeType: "image/jpeg" as const,
  width: 1600,
  height: 1200,
  byteSize: 842_000,
  sharedWithProviders: ["anthropic"],
  ...overrides,
});

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

export const AttachedPhotos = () => (
  <Canvas>
    <MessageImageAttachments
      attachments={[
        attachment("a1", LANDSCAPE_PHOTO_URI),
        attachment("a2", SKYLINE_PHOTO_URI),
      ]}
      colors={darkColors}
      t={t}
      onRemove={() => {}}
    />
  </Canvas>
);

export const CompactInComposer = () => (
  <Canvas>
    <MessageImageAttachments
      attachments={[
        attachment("a3", LANDSCAPE_PHOTO_URI),
        attachment("a4", SKYLINE_PHOTO_URI),
      ]}
      colors={darkColors}
      t={t}
      compact
      onRemove={() => {}}
    />
  </Canvas>
);

export const SentInBubble = () => (
  <Canvas>
    <MessageImageAttachments
      attachments={[attachment("a5", SKYLINE_PHOTO_URI)]}
      colors={darkColors}
      t={t}
    />
  </Canvas>
);
