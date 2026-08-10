import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";

/** The nineteen interface languages, in the order the locale registry lists them. */
export const INTRO_LANGUAGES = [
  "English", "Deutsch", "Українська", "हिन्दी", "Español", "Français", "Italiano",
  "Português", "Português (Brasil)", "Русский", "简体中文", "العربية", "日本語",
  "Magyar", "Čeština", "Polski", "Türkçe", "Svenska", "اردو",
];

/**
 * Language picker plus a play control for the bundled speech examples.
 *
 * This is the evidence behind the claim that speech is worth setting up:
 * rather than asserting the app sounds good, it lets someone hear it, in any
 * language, before committing to anything. Every clip ships with the app, so
 * it works offline and on first launch.
 *
 * A chosen option fills edge to edge in sand rather than being marked, which
 * is what makes the selection readable at a glance. Sand stays distinct from
 * the green accent: green means "the thing to press next", sand means "the
 * thing you picked".
 */
export function IntroVoicePicker({ languages = INTRO_LANGUAGES, value, onChange, playing = false, onTogglePlay, style }) {
  const [open, setOpen] = React.useState(false);
  const selected = value || languages[0];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button type="button" onClick={() => setOpen(true)} aria-label={selected}
          style={{
            flex: 1, minWidth: 0, minHeight: 52, padding: "0 18px", gap: 10, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            borderRadius: "var(--mb-radius-control)", border: "1px solid var(--mb-color-sand-border)",
            background: "var(--mb-color-sand-soft)",
          }}>
          <span style={{
            flex: 1, minWidth: 0, textAlign: "start", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 16, color: "var(--mb-color-text)",
          }}>{selected}</span>
          <PhosphorIcon name="down" size="compact" color="var(--mb-color-text-muted)" />
        </button>
        <button type="button" onClick={onTogglePlay} aria-label={playing ? "Stop" : "Play example"}
          style={{
            width: 52, height: 52, flexShrink: 0, borderRadius: 999, border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", background: "var(--mb-color-accent)",
          }}>
          <PhosphorIcon name={playing ? "pause" : "audio"} size="control" color="var(--mb-color-on-accent)" />
        </button>
      </div>

      {/* The sheet is centred over the whole introduction rather than anchored
         to the select: nineteen languages is a list to read, not a dropdown.
         Both layers position against the flow root, so nothing escapes it. */}
      {open ? (
        <React.Fragment>
          <span onClick={() => setOpen(false)}
            style={{ position: "absolute", inset: 0, background: "rgba(6,8,11,0.72)", zIndex: 20 }} />
          <div style={{
            position: "absolute", left: 24, right: 24, top: "50%", transform: "translateY(-50%)",
            zIndex: 21, maxHeight: "70%", overflow: "auto", display: "flex", flexDirection: "column",
            paddingTop: 18, paddingBottom: 10, borderRadius: "var(--mb-radius-panel)",
            border: "1px solid var(--mb-color-border)", background: "var(--mb-color-surface)",
            boxShadow: "var(--mb-shadow-dialog)",
          }}>
            <span style={{
              display: "block", padding: "0 18px", marginBottom: 8,
              fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 15, color: "var(--mb-color-text)",
            }}>Choose a language</span>
            <div style={{ padding: "0 8px", display: "flex", flexDirection: "column" }}>
              {languages.map((option) => {
                const isSelected = option === selected;
                return (
                  <button type="button" key={option} aria-pressed={isSelected}
                    onClick={() => { if (onChange) onChange(option); setOpen(false); }}
                    style={{
                      width: "100%", minHeight: 48, padding: "0 16px", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      borderRadius: "var(--mb-radius-control)",
                      border: "1px solid " + (isSelected ? "var(--mb-color-sand-border)" : "transparent"),
                      background: isSelected ? "var(--mb-color-sand-soft)" : "transparent",
                      fontFamily: isSelected ? "var(--mb-font-body-medium)" : "var(--mb-font-body)",
                      fontWeight: isSelected ? 500 : 400, fontSize: 16,
                      color: isSelected ? "var(--mb-color-sand)" : "var(--mb-color-text-secondary)",
                    }}>
                    {option}
                    {isSelected ? <PhosphorIcon name="check" size="compact" color="var(--mb-color-sand)" /> : null}
                  </button>
                );
              })}
            </div>
          </div>
        </React.Fragment>
      ) : null}
    </div>
  );
}
