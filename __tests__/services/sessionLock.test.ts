import * as SecureStore from "expo-secure-store";

const mockSecureValues = new Map<string, string>();
let mockBiometricsAvailable = true;

jest.mock("expo-crypto", () => ({
  getRandomBytes: (length: number) =>
    Uint8Array.from({ length }, (_, index) => index + 1),
}));

jest.mock("expo-secure-store", () => ({
  canUseBiometricAuthentication: jest.fn(() => mockBiometricsAvailable),
  deleteItemAsync: jest.fn(async (key: string) => {
    mockSecureValues.delete(key);
  }),
  getItemAsync: jest.fn(
    async (key: string) => mockSecureValues.get(key) ?? null,
  ),
  setItemAsync: jest.fn(async (key: string, value: string) => {
    mockSecureValues.set(key, value);
  }),
}));

jest.mock("../../src/services/backupKeyDerivation", () => ({
  deriveBackupKeyBytes: jest.fn(
    async ({
      keyLength,
      passphrase,
      salt,
    }: {
      keyLength: number;
      passphrase: string;
      salt: Uint8Array;
    }) =>
      Uint8Array.from(
        { length: keyLength },
        (_, index) =>
          (passphrase.charCodeAt(index % passphrase.length) +
            salt[index % salt.length]) %
          256,
      ),
  ),
}));

import {
  canUnlockSessionWithDeviceAuth,
  clearSessionLock,
  createSessionLock,
  unlockSessionWithDeviceAuth,
  verifySessionPassword,
} from "../../src/services/sessionLock";

describe("sessionLock", () => {
  beforeEach(() => {
    mockSecureValues.clear();
    mockBiometricsAvailable = true;
    jest.clearAllMocks();
  });

  it("stores only a salted verifier and validates the password", async () => {
    await createSessionLock("conversation-1", "correct horse", "Authenticate");

    const passwordRecord = mockSecureValues.get(
      "mrbroccoli.session_lock.password.conversation-1",
    );
    expect(passwordRecord).not.toContain("correct horse");
    await expect(
      verifySessionPassword("conversation-1", "correct horse"),
    ).resolves.toBe(true);
    await expect(
      verifySessionPassword("conversation-1", "wrong password"),
    ).resolves.toBe(false);
  });

  it("rejects short passwords at the service boundary", async () => {
    await expect(
      createSessionLock("conversation-1", "short", "Authenticate"),
    ).rejects.toThrow("at least 6 characters");
    expect(mockSecureValues.size).toBe(0);
  });

  it("uses an authenticated SecureStore marker when biometrics are available", async () => {
    await expect(
      createSessionLock("conversation-1", "secret1", "Unlock session"),
    ).resolves.toEqual({ deviceAuthEnabled: true });

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      "mrbroccoli.session_lock.device_auth.conversation-1",
      "mrbroccoli-session-unlock-v1",
      {
        authenticationPrompt: "Unlock session",
        requireAuthentication: true,
      },
    );
    await expect(
      canUnlockSessionWithDeviceAuth("conversation-1"),
    ).resolves.toBe(true);
    await expect(
      unlockSessionWithDeviceAuth("conversation-1", "Unlock session"),
    ).resolves.toBe(true);
  });

  it("does not expose device authentication without a canonical lock record", async () => {
    mockSecureValues.set(
      "mrbroccoli.session_lock.device_auth.orphan",
      "mrbroccoli-session-unlock-v1",
    );

    await expect(
      unlockSessionWithDeviceAuth("orphan", "Unlock session"),
    ).resolves.toBe(false);
    expect(SecureStore.getItemAsync).not.toHaveBeenCalledWith(
      "mrbroccoli.session_lock.device_auth.orphan",
      expect.anything(),
    );
  });

  it("falls back to password-only access and clears both records", async () => {
    mockBiometricsAvailable = false;
    await expect(
      createSessionLock("conversation-1", "secret1", "Unlock session"),
    ).resolves.toEqual({ deviceAuthEnabled: false });
    await expect(
      canUnlockSessionWithDeviceAuth("conversation-1"),
    ).resolves.toBe(false);

    await clearSessionLock("conversation-1", "Unlock session");

    await expect(
      verifySessionPassword("conversation-1", "secret1"),
    ).resolves.toBe(false);
    expect(mockSecureValues.size).toBe(0);
  });
});
