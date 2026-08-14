import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";

/** The gold premium offer band — gradient badge, sweeping sheen, one Upgrade action. The one deliberately fancy surface. */
export function PremiumBand({ copy, actionLabel = "Upgrade", onPress }) {
  return (
    <div style={{ position: "relative", overflow: "hidden", display: "flex", alignItems: "center", gap: 12, minHeight: 64, padding: "12px 14px", background: "linear-gradient(120deg, rgba(200,160,40,.16), rgba(200,160,40,.05) 45%, rgba(200,160,40,.18))" }}>
      <span aria-hidden="true" style={{ position: "absolute", top: 0, left: "-30%", width: "32%", height: "100%", background: "linear-gradient(105deg, transparent, rgba(255,246,214,.5), transparent)", transform: "skewX(-18deg)", animation: "mb-sheen 3.2s ease-in-out infinite" }} />
      <style>{"@keyframes mb-sheen{0%,55%{left:-32%}85%,100%{left:130%}}"}</style>
      <span style={{ width: 36, height: 36, borderRadius: 18, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(150deg, #E3B84C, #A07C1F)", boxShadow: "0 2px 8px rgba(160,124,31,.4)" }}>
        <PhosphorIcon name="thunderbolt" size="compact" color="#FFF9E8" />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 14, letterSpacing: ".2px", color: "var(--mb-color-premium, #A07C1F)" }}>Premium</span>
        <span style={{ display: "block", fontFamily: "var(--mb-text-supporting-family)", fontSize: 12, lineHeight: "17px", color: "var(--mb-color-text-secondary)" }}>{copy}</span>
      </span>
      <span role="button" onClick={onPress} style={{ minHeight: 44, padding: "7px 15px", borderRadius: "var(--mb-radius-control)", cursor: "pointer", display: "inline-flex", alignItems: "center", flexShrink: 0, fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 13, background: "linear-gradient(150deg, #E3B84C, #A07C1F)", color: "#FFF9E8", boxShadow: "0 2px 10px rgba(160,124,31,.45)" }}>{actionLabel}</span>
    </div>
  );
}
