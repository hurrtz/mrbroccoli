export function formatBytes(bytes: number) {
  const normalizedBytes = Math.max(0, bytes);
  return normalizedBytes >= 1024 ** 3
    ? `${(normalizedBytes / 1024 ** 3).toFixed(1)} GB`
    : `${Math.round(normalizedBytes / 1024 ** 2)} MB`;
}
