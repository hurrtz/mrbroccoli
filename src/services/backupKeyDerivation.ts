import { pbkdf2Async } from "@noble/hashes/pbkdf2";
import { sha256 } from "@noble/hashes/sha256";
import { NativeModules } from "react-native";

interface BackupCryptoNativeModule {
  pbkdf2Sha256(
    passphrase: string,
    saltBase64: string,
    iterations: number,
    keyLength: number,
  ): Promise<string>;
}

const nativeModule = NativeModules.MrBroccoliBackupCrypto as
  | BackupCryptoNativeModule
  | undefined;

function bytesToBase64(bytes: Uint8Array) {
  const BufferCtor = (globalThis as any).Buffer;
  if (BufferCtor) {
    return BufferCtor.from(bytes).toString("base64");
  }

  let binary = "";
  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }

  if (typeof btoa === "undefined") {
    throw new Error("Base64 encoding is unavailable.");
  }
  return btoa(binary);
}

function base64ToBytes(base64: string) {
  const BufferCtor = (globalThis as any).Buffer;
  if (BufferCtor) {
    return new Uint8Array(BufferCtor.from(base64, "base64"));
  }

  if (typeof atob === "undefined") {
    throw new Error("Base64 decoding is unavailable.");
  }
  const binary = atob(base64);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

export async function deriveBackupKeyBytes(params: {
  iterations: number;
  keyLength: number;
  passphrase: string;
  salt: Uint8Array;
}) {
  const normalizedPassphrase = params.passphrase.normalize("NFKC");

  if (nativeModule?.pbkdf2Sha256) {
    const keyBase64 = await nativeModule.pbkdf2Sha256(
      normalizedPassphrase,
      bytesToBase64(params.salt),
      params.iterations,
      params.keyLength,
    );
    return base64ToBytes(keyBase64);
  }

  return pbkdf2Async(sha256, normalizedPassphrase, params.salt, {
    c: params.iterations,
    dkLen: params.keyLength,
    asyncTick: 10,
  });
}
