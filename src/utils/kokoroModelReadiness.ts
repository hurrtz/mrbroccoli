import type { KokoroModelState } from "../hooks/useKokoroModel";

export function isKokoroModelReady(
  model: Pick<
    KokoroModelState,
    "busy" | "error" | "installed" | "verified"
  >,
) {
  return (
    model.installed &&
    model.busy === null &&
    (model.verified || model.error === null)
  );
}
