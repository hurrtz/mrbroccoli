export interface DriveSessionState {
  armRequested: boolean;
  autoContinueEnabled: boolean;
  engaged: boolean;
  remotePaused?: true;
}

export type DriveSessionEvent =
  | { type: "arm-consumed" }
  | { type: "arm-requested" }
  | { type: "disengage" }
  | { type: "engage" }
  | { type: "pause"; keepRemoteControls?: boolean }
  | { type: "resume" }
  | { type: "suspend" };

export function createDriveSessionState(): DriveSessionState {
  return {
    armRequested: false,
    autoContinueEnabled: false,
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
      return {
        armRequested: false,
        autoContinueEnabled: false,
        engaged: false,
      };
    case "engage":
      return {
        ...state,
        armRequested: state.autoContinueEnabled,
        engaged: state.autoContinueEnabled,
      };
    case "pause":
      return {
        ...createDriveSessionState(),
        ...(event.keepRemoteControls ? { remotePaused: true } : {}),
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
