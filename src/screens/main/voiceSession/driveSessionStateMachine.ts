export interface DriveSessionState {
  armRequested: boolean;
  autoContinueEnabled: boolean;
  engaged: boolean;
}

export type DriveSessionEvent =
  | { type: "arm-consumed" }
  | { type: "arm-requested" }
  | { type: "disengage" }
  | { type: "engage" }
  | { type: "mode-entered" }
  | { type: "pause" }
  | { type: "resume" }
  | { type: "suspend" };

export function createDriveSessionState(
  inputMode: string,
): DriveSessionState {
  return {
    armRequested: false,
    autoContinueEnabled: inputMode === "drive-session",
    engaged: false,
  };
}

export function transitionDriveSessionState(
  state: DriveSessionState,
  event: DriveSessionEvent,
): DriveSessionState {
  switch (event.type) {
    case "arm-consumed":
      return { ...state, armRequested: false };
    case "arm-requested":
      return { ...state, armRequested: true };
    case "disengage":
      return { ...state, engaged: false };
    case "engage":
      return { ...state, engaged: true };
    case "mode-entered":
      return {
        armRequested: false,
        autoContinueEnabled: true,
        engaged: false,
      };
    case "pause":
      return {
        ...state,
        armRequested: false,
        autoContinueEnabled: false,
      };
    case "resume":
      return {
        armRequested: true,
        autoContinueEnabled: true,
        engaged: true,
      };
    case "suspend":
      return {
        ...state,
        armRequested: false,
        engaged: false,
      };
  }
}
