export type QwenApiRegion = "singapore" | "us" | "beijing";

export const QWEN_DEFAULT_API_REGION: QwenApiRegion = "singapore";
export const QWEN_API_REGIONS: readonly QwenApiRegion[] = [
  "singapore",
  "us",
  "beijing",
];

const QWEN_API_HOSTS: Record<QwenApiRegion, string> = {
  singapore: "dashscope-intl.aliyuncs.com",
  us: "dashscope-us.aliyuncs.com",
  beijing: "dashscope.aliyuncs.com",
};

export function parseQwenApiCredential(value: string) {
  const [apiKeyPart = "", regionPart = ""] = value.split("|");
  const normalizedRegion = regionPart.trim().toLowerCase();
  const region: QwenApiRegion =
    normalizedRegion === "us" || normalizedRegion === "virginia"
      ? "us"
      : normalizedRegion === "beijing" || normalizedRegion === "china"
        ? "beijing"
        : QWEN_DEFAULT_API_REGION;

  return {
    apiKey: apiKeyPart.trim(),
    region,
  };
}

export function formatQwenApiCredential(
  apiKey: string,
  region: QwenApiRegion,
) {
  const normalizedApiKey = apiKey.trim();

  if (!normalizedApiKey) {
    return "";
  }

  return region === QWEN_DEFAULT_API_REGION
    ? normalizedApiKey
    : `${normalizedApiKey}|${region}`;
}

export function resolveQwenApiEndpoint(endpoint: string, credential: string) {
  const { region } = parseQwenApiCredential(credential);
  return endpoint.replace(
    /^https:\/\/[^/]+/,
    `https://${QWEN_API_HOSTS[region]}`,
  );
}
