import { resolveTtsListenLanguage } from "../../src/utils/ttsRouting";

describe("resolveTtsListenLanguage", () => {
  it("uses the only selected language", () => {
    expect(
      resolveTtsListenLanguage({
        text: "Hello world",
        preferredLanguages: ["en"],
        appLanguage: "en",
      })
    ).toBe("en");
  });

  it("prefers German when German markers are present", () => {
    expect(
      resolveTtsListenLanguage({
        text: "Ich glaube, das ist die richtige Antwort.",
        preferredLanguages: ["en", "de"],
        appLanguage: "en",
      })
    ).toBe("de");
  });

  it("prefers Japanese when the text uses Japanese script", () => {
    expect(
      resolveTtsListenLanguage({
        text: "こんにちは、元気ですか",
        preferredLanguages: ["en", "ja"],
        appLanguage: "en",
      })
    ).toBe("ja");
  });

  it("prefers Simplified Chinese when Han script markers are present", () => {
    expect(
      resolveTtsListenLanguage({
        text: "你好，这是一个本地语音测试。",
        preferredLanguages: ["en", "zh-CN"],
        appLanguage: "en",
      })
    ).toBe("zh-CN");
  });

  it("prefers Hindi when Devanagari text is present", () => {
    expect(
      resolveTtsListenLanguage({
        text: "यह एक छोटा स्थानीय आवाज़ परीक्षण है।",
        preferredLanguages: ["en", "hi"],
        appLanguage: "en",
      })
    ).toBe("hi");
  });

  it("prefers Portuguese when Portuguese markers are present", () => {
    expect(
      resolveTtsListenLanguage({
        text: "Você não precisa responder agora, mas eu não concordo com isso.",
        preferredLanguages: ["es", "pt"],
        appLanguage: "en",
      })
    ).toBe("pt");
  });

  it("prefers Hungarian when distinctive markers are present", () => {
    expect(
      resolveTtsListenLanguage({
        text: "Nagyszerű ötlet, és örülök, hogy együtt dolgozunk rajta.",
        preferredLanguages: ["en", "hu"],
        appLanguage: "en",
      }),
    ).toBe("hu");
  });

  it("prefers Czech when distinctive markers are present", () => {
    expect(
      resolveTtsListenLanguage({
        text: "Příliš žluťoučký kůň úpěl ďábelské ódy.",
        preferredLanguages: ["en", "cs"],
        appLanguage: "en",
      }),
    ).toBe("cs");
  });

  it("prefers Polish when distinctive markers are present", () => {
    expect(
      resolveTtsListenLanguage({
        text: "Zażółć gęślą jaźń, ponieważ to świetny test.",
        preferredLanguages: ["en", "pl"],
        appLanguage: "en",
      }),
    ).toBe("pl");
  });

  it.each([
    ["es", "¿Dónde está la estación? No encuentro la entrada."],
    ["fr", "Je ne sais pas où est la bonne entrée."],
    ["it", "Perché non troviamo una soluzione insieme?"],
  ] as const)("recognizes %s from Latin-language markers", (language, text) => {
    expect(
      resolveTtsListenLanguage({
        text,
        preferredLanguages: ["en", "es", "fr", "it"],
        appLanguage: "en",
      })
    ).toBe(language);
  });
});
