import React from "react";

const PROVIDER_ASSETS = {
  "alibaba-qwen-dashscope": "alibaba-qwen-dashscope", anthropic: "anthropic", deepseek: "deepseek",
  elevenlabs: "elevenlabs", gemini: "google-vertex-ai-studio", "google-vertex-ai-studio": "google-vertex-ai-studio",
  mistral: "mistral-ai", "mistral-ai": "mistral-ai", openai: "openai", openrouter: "openrouter", xai: "xai",
};

const ICON_SIZE = { inline: 14, compact: 16, control: 20, navigation: 24, prominent: 28, feature: 32, hero: 40 };

function fallbackGlyph(value) {
  const parts = String(value).split(/[^a-zA-Z0-9]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return String(value).replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 2) || "AI";
}

/**
 * The official provider brand marks — the one exception to the PhosphorIcon rule.
 * A provider without a shipped mark falls back to two letters, never a drawn glyph.
 */
const svgCache = {};

export function ProviderIcon({ provider, color = "currentColor", label, size = "navigation", assetBase = "assets/providers" }) {
  const px = ICON_SIZE[size] || ICON_SIZE.navigation;
  const asset = PROVIDER_ASSETS[provider];
  const href = asset ? assetBase + "/" + asset + ".svg" : null;
  const [markup, setMarkup] = React.useState(() => (href ? svgCache[href] || "" : ""));
  React.useEffect(() => {
    if (!href) return undefined;
    if (svgCache[href]) { setMarkup(svgCache[href]); return undefined; }
    let live = true;
    fetch(href).then((response) => response.text()).then((text) => {
      svgCache[href] = text;
      if (live) setMarkup(text);
    }).catch(() => {});
    return () => { live = false; };
  }, [href]);
  if (!asset) {
    return (
      <span aria-hidden="true" style={{ color, fontSize: Math.max(12, px / 2), fontWeight: 700, letterSpacing: "0.8px", fontFamily: "var(--mb-font-display)" }}>
        {fallbackGlyph(label || provider)}
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: markup }}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: px, height: px, flexShrink: 0, color, fill: color, fontSize: px,
      }}
    />
  );
}
