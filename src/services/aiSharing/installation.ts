import {
  DocumentDirectoryPath,
  LibraryDirectoryPath,
  exists,
  mkdir,
  readFile,
  writeFile,
} from "@dr.pogodin/react-native-fs";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const DEVICE_KEY = "mrbroccoli.ai-sharing.installation.v1";
const OPTIONS = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

function markerDirectory() {
  return (
    (LibraryDirectoryPath || DocumentDirectoryPath) + "/MrBroccoliAISharing"
  );
}

export async function readInstallationBinding() {
  const id = await SecureStore.getItemAsync(DEVICE_KEY, OPTIONS);
  if (!id || Platform.OS !== "ios") return id;
  // Keychain can survive deletion and same-device restores. Keep an additional
  // installation marker outside backups in the app's own container.
  const marker = markerDirectory() + "/installation";
  if (!(await exists(marker))) return null;
  return (await readFile(marker, "utf8")) === id ? id : null;
}

export async function bindInstallation(id: string) {
  if (Platform.OS === "ios") {
    const directory = markerDirectory();
    await mkdir(directory, { NSURLIsExcludedFromBackupKey: true });
    await writeFile(directory + "/installation", id, "utf8");
  }
  await SecureStore.setItemAsync(DEVICE_KEY, id, OPTIONS);
}

export function invalidateInstallationBinding() {
  return SecureStore.deleteItemAsync(DEVICE_KEY, OPTIONS);
}
