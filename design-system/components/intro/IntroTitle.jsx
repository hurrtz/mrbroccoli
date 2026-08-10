import React from "react";

/**
 * Step heading. The same headline face as the conversation drawer, so the
 * introduction reads as part of the app rather than a separate product.
 *
 * Centred: every step is a single column with nothing beside it, and a
 * left-aligned heading over centred content read as a form.
 */
export function IntroTitle({ children, style }) {
  return (
    <h2 style={{
      margin: 0, fontFamily: "var(--mb-font-headline)", fontWeight: 400,
      fontSize: 27, lineHeight: "33px", textAlign: "center",
      color: "var(--mb-color-text)", ...style,
    }}>{children}</h2>
  );
}
