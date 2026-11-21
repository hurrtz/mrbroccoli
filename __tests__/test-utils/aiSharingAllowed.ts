import type {
  AiSharingNeed,
  AiSharingRequest,
} from "../../src/services/aiSharing/model";
import type { Message } from "../../src/types";

/** Existing non-consent tests represent an installation with approved recipients. */
export function createAllowedAiSharingMock() {
  const real = jest.requireActual<
    typeof import("../../src/services/aiSharing")
  >("../../src/services/aiSharing");
  const permits = (request: AiSharingRequest) => ({
    allows: (
      provider: AiSharingNeed["provider"],
      purpose: AiSharingNeed["purpose"],
    ) =>
      [...request.required, ...(request.optional ?? [])].some(
        (need) => need.provider === provider && need.purpose === purpose,
      ),
  });
  return {
    ...real,
    hydrateAiSharing: jest.fn(async () => {}),
    hasAiSharingPermission: jest.fn(() => true),
    loadAiSharingHistory: jest.fn(async () => {}),
    getAiSharingHistory: jest.fn((_id: string, messages: Message[]) =>
      messages.map(real.aiSharingTextMessage),
    ),
    getAiSharingFirstPrompt: jest.fn((_id: string, messages: Message[]) =>
      messages.find((message) => message.role === "user"),
    ),
    hasUnsharedAiHistory: jest.fn(() => false),
    recordAiSharingMessages: jest.fn(async () => {}),
    requestAiSharing: jest.fn(async (request: AiSharingRequest) =>
      permits(request),
    ),
    subscribeAiSharing: jest.fn(() => () => {}),
  };
}
