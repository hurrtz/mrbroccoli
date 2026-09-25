import {
  formatQwenApiCredential,
  parseQwenApiCredential,
  resolveQwenApiEndpoint,
} from "../../src/utils/qwenRegion";
import { hasProviderCredentialForCapability } from "../../src/utils/providerCredentials";
import {
  getEnabledProviders,
  getEnabledSttProviders,
  getEnabledTtsProviders,
} from "../../src/utils/providerCapabilities";
import { DEFAULT_SETTINGS } from "../../src/types";

describe("Qwen regional credentials", () => {
  it("defaults plain credentials to Singapore", () => {
    expect(parseQwenApiCredential(" sk-test ")).toEqual({
      apiKey: "sk-test",
      region: "singapore",
    });
    expect(formatQwenApiCredential("sk-test", "singapore")).toBe("sk-test");
  });

  it("stores non-default regions alongside the secure credential", () => {
    expect(formatQwenApiCredential("sk-test", "us")).toBe("sk-test|us");
    expect(parseQwenApiCredential("sk-test|beijing")).toEqual({
      apiKey: "sk-test",
      region: "beijing",
    });
  });

  it("routes requests to the selected DashScope host", () => {
    const endpoint =
      "https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions";

    expect(resolveQwenApiEndpoint(endpoint, "sk-test|us")).toBe(
      "https://dashscope-us.aliyuncs.com/compatible-mode/v1/chat/completions",
    );
    expect(resolveQwenApiEndpoint(endpoint, "sk-test|beijing")).toBe(
      "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
    );
  });

  it("keeps every region for chat while offering no Qwen speech routes", () => {
    for (const credential of ["sk-test", "sk-test|us", "sk-test|beijing"]) {
      const settings = {
        ...DEFAULT_SETTINGS,
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          "alibaba-qwen-dashscope": credential,
        },
      };

      expect(
        hasProviderCredentialForCapability(
          "alibaba-qwen-dashscope",
          credential,
          "llm",
        ),
      ).toBe(true);
      expect(getEnabledProviders(settings)).toContain("alibaba-qwen-dashscope");
      expect(getEnabledSttProviders(settings)).not.toContain(
        "alibaba-qwen-dashscope",
      );
      expect(getEnabledTtsProviders(settings)).not.toContain(
        "alibaba-qwen-dashscope",
      );
    }
  });
});
