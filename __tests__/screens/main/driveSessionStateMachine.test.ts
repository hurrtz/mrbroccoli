import {
  createDriveSessionState,
  transitionDriveSessionState,
} from "../../../src/screens/main/voiceSession/driveSessionStateMachine";

describe("driveSessionStateMachine", () => {
  it("starts enabled only when Drive Session is selected", () => {
    expect(createDriveSessionState("drive-session")).toEqual({
      armRequested: false,
      autoContinueEnabled: true,
      engaged: false,
    });
    expect(createDriveSessionState("tap-to-record")).toEqual({
      armRequested: false,
      autoContinueEnabled: false,
      engaged: false,
    });
  });

  it("models the engage, arm, and consume lifecycle explicitly", () => {
    let state = createDriveSessionState("drive-session");

    state = transitionDriveSessionState(state, { type: "engage" });
    state = transitionDriveSessionState(state, { type: "arm-requested" });
    expect(state).toEqual({
      armRequested: true,
      autoContinueEnabled: true,
      engaged: true,
    });

    state = transitionDriveSessionState(state, { type: "arm-consumed" });
    expect(state.armRequested).toBe(false);
  });

  it("pauses without discarding engagement and resumes in an armed state", () => {
    const engaged = transitionDriveSessionState(
      createDriveSessionState("drive-session"),
      { type: "engage" },
    );
    const paused = transitionDriveSessionState(engaged, { type: "pause" });

    expect(paused).toEqual({
      armRequested: false,
      autoContinueEnabled: false,
      engaged: true,
    });
    expect(transitionDriveSessionState(paused, { type: "resume" })).toEqual({
      armRequested: true,
      autoContinueEnabled: true,
      engaged: true,
    });
  });

  it("separates temporary disengagement from a full suspension", () => {
    const armed = transitionDriveSessionState(
      createDriveSessionState("drive-session"),
      { type: "resume" },
    );

    expect(
      transitionDriveSessionState(armed, { type: "disengage" }),
    ).toEqual({ ...armed, engaged: false });
    expect(transitionDriveSessionState(armed, { type: "suspend" })).toEqual({
      ...armed,
      armRequested: false,
      engaged: false,
    });
  });

  it("resets stale state when Drive Session mode is entered", () => {
    expect(
      transitionDriveSessionState(
        {
          armRequested: true,
          autoContinueEnabled: false,
          engaged: true,
        },
        { type: "mode-entered" },
      ),
    ).toEqual({
      armRequested: false,
      autoContinueEnabled: true,
      engaged: false,
    });
  });
});
