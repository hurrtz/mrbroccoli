/** OpenRouter model publishers and the first-party inference endpoints we disclose. */
const HOSTS = {
  openai: { label: "OpenAI", slugs: ["openai"] },
  anthropic: { label: "Anthropic", slugs: ["anthropic"] },
  google: { label: "Google", slugs: ["google-vertex", "google-ai-studio"] },
  qwen: { label: "Alibaba", slugs: ["alibaba"] },
  mistralai: { label: "Mistral AI", slugs: ["mistral"] },
  deepseek: { label: "DeepSeek", slugs: ["deepseek"] },
  moonshotai: { label: "Moonshot AI", slugs: ["moonshotai"] },
  "x-ai": { label: "xAI", slugs: ["xai"] },
} as const;

export function getOpenRouterHost(model?: string) {
  const publisher = model?.split("/")[0];
  return publisher && Object.hasOwn(HOSTS, publisher)
    ? HOSTS[publisher as keyof typeof HOSTS]
    : undefined;
}

export function getOpenRouterHosts(models?: string | readonly string[]) {
  const selected = typeof models === "string" ? [models] : (models ?? []);
  const hosts = selected.map(getOpenRouterHost);
  if (hosts.some((host) => !host)) return [];
  return [...new Set(hosts.filter((host) => !!host))];
}
