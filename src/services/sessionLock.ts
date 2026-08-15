import { getRandomBytes } from "expo-crypto";
import * as SecureStore from "expo-secure-store";

import { deriveBackupKeyBytes } from "./backupKeyDerivation";

const PASSWORD_KEY_PREFIX = "mrbroccoli.session_lock.password.";
const DEVICE_AUTH_KEY_PREFIX = "mrbroccoli.session_lock.device_auth.";
const PASSWORD_ITERATIONS = 210_000;
const PASSWORD_KEY_BYTES = 32;
const PASSWORD_SALT_BYTES = 16;
const DEVICE_AUTH_MARKER = "mrbroccoli-session-unlock-v1";

interface SessionLockRecord {
  deviceAuthEnabled: boolean;
  iterations: typeof PASSWORD_ITERATIONS;
  salt: string;
  verifier: string;
  version: 1;
}

function passwordKey(conversationId: string) {
  return `${PASSWORD_KEY_PREFIX}${conversationId}`;
}

function deviceAuthKey(conversationId: string) {
  return `${DEVICE_AUTH_KEY_PREFIX}${conversationId}`;
}

function bytesToBase64(bytes: Uint8Array) {
  const BufferCtor = (globalThis as any).Buffer;
  if (BufferCtor) {
    return BufferCtor.from(bytes).toString("base64");
  }

  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  if (typeof btoa === "undefined") {
    throw new Error("Base64 encoding is unavailable.");
  }
  return btoa(binary);
}

function base64ToBytes(value: string) {
  const BufferCtor = (globalThis as any).Buffer;
  if (BufferCtor) {
    return new Uint8Array(BufferCtor.from(value, "base64"));
  }
  if (typeof atob === "undefined") {
    throw new Error("Base64 decoding is unavailable.");
  }
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function parseRecord(value: string | null): SessionLockRecord | null {
  if (!value) {
    return null;
  }
  try {
    const parsed = JSON.parse(value) as Partial<SessionLockRecord>;
    if (
      parsed.version !== 1 ||
      parsed.iterations !== PASSWORD_ITERATIONS ||
      typeof parsed.salt !== "string" ||
      typeof parsed.verifier !== "string" ||
      typeof parsed.deviceAuthEnabled !== "boolean"
    ) {
      return null;
    }
    return parsed as SessionLockRecord;
  } catch {
    return null;
  }
}

async function deriveVerifier(password: string, salt: Uint8Array) {
  return deriveBackupKeyBytes({
    iterations: PASSWORD_ITERATIONS,
    keyLength: PASSWORD_KEY_BYTES,
    passphrase: password,
    salt,
  });
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array) {
  if (left.length !== right.length) {
    return false;
  }
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left[index] ^ right[index];
  }
  return difference === 0;
}

function deviceAuthOptions(prompt?: string): SecureStore.SecureStoreOptions {
  return {
    ...(prompt ? { authenticationPrompt: prompt } : {}),
    requireAuthentication: true,
  };
}

export async function createSessionLock(
  conversationId: string,
  password: string,
  authenticationPrompt: string,
) {
  if (password.length < 6) {
    throw new Error("Session lock passwords require at least 6 characters.");
  }
  const salt = getRandomBytes(PASSWORD_SALT_BYTES);
  const verifier = await deriveVerifier(password, salt);
  const record: SessionLockRecord = {
    deviceAuthEnabled: false,
    iterations: PASSWORD_ITERATIONS,
    salt: bytesToBase64(salt),
    verifier: bytesToBase64(verifier),
    version: 1,
  };
  await SecureStore.setItemAsync(
    passwordKey(conversationId),
    JSON.stringify(record),
  );

  if (!SecureStore.canUseBiometricAuthentication()) {
    return { deviceAuthEnabled: false };
  }

  try {
    await SecureStore.setItemAsync(
      deviceAuthKey(conversationId),
      DEVICE_AUTH_MARKER,
      deviceAuthOptions(authenticationPrompt),
    );
    record.deviceAuthEnabled = true;
    await SecureStore.setItemAsync(
      passwordKey(conversationId),
      JSON.stringify(record),
    );
    return { deviceAuthEnabled: true };
  } catch {
    return { deviceAuthEnabled: false };
  }
}

export async function verifySessionPassword(
  conversationId: string,
  password: string,
) {
  const record = parseRecord(
    await SecureStore.getItemAsync(passwordKey(conversationId)),
  );
  if (!record) {
    return false;
  }
  const actual = await deriveVerifier(password, base64ToBytes(record.salt));
  return constantTimeEqual(actual, base64ToBytes(record.verifier));
}

export async function canUnlockSessionWithDeviceAuth(conversationId: string) {
  const record = parseRecord(
    await SecureStore.getItemAsync(passwordKey(conversationId)),
  );
  return Boolean(
    record?.deviceAuthEnabled && SecureStore.canUseBiometricAuthentication(),
  );
}

export async function unlockSessionWithDeviceAuth(
  conversationId: string,
  authenticationPrompt: string,
) {
  if (!(await canUnlockSessionWithDeviceAuth(conversationId))) {
    return false;
  }
  const marker = await SecureStore.getItemAsync(
    deviceAuthKey(conversationId),
    deviceAuthOptions(authenticationPrompt),
  );
  return marker === DEVICE_AUTH_MARKER;
}

export async function clearSessionLock(
  conversationId: string,
  authenticationPrompt?: string,
) {
  await SecureStore.deleteItemAsync(passwordKey(conversationId));
  try {
    await SecureStore.deleteItemAsync(
      deviceAuthKey(conversationId),
      deviceAuthOptions(authenticationPrompt),
    );
  } catch {
    // The canonical locked flag and password verifier are already gone. A
    // cancelled or invalidated device-auth marker is inert and never grants
    // access without that canonical record.
  }
}
