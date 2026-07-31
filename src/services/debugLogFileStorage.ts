import { File, FileMode } from "expo-file-system";

export async function appendDebugLogFile(path: string, content: string) {
  const file = new File(path);
  const handle = file.open(FileMode.Append);
  try {
    handle.writeBytes(new TextEncoder().encode(content));
  } finally {
    handle.close();
  }
}
