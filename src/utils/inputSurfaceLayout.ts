/** Keep the text field inside its clipped viewport when the orb's minimum
 * transport footprint is taller than the available stage. */
export function resolveTextComposerLayout(params: {
  orbSize: number;
  viewportHeight: number;
  orbCentreOffsetY: number;
}) {
  const height = Math.min(params.orbSize, params.viewportHeight);
  const maximumOffset = Math.max(0, (params.viewportHeight - height) / 2);
  return {
    height,
    centreOffsetY: Math.max(
      -maximumOffset,
      Math.min(maximumOffset, params.orbCentreOffsetY),
    ),
  };
}
