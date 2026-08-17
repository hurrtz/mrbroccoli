import {
  createDriveSessionState,
  transitionDriveSessionState,
} from "../../../src/screens/main/voiceSession/driveSessionStateMachine";

describe("driveSessionStateMachine", () => {
  it("starts disabled for every new app session", () => {
    expect(createDriveSessionState()).toEqual({
      armRequested: false,
      autoContinueEnabled: false,
      engaged: false,
    });
  });

  it("models the engage, arm, and consume lifecycle explicitly", () => {
    let state = transitionDriveSessionState(createDriveSessionState(), {
      type: "resume",
    });

    state = transitionDriveSessionState(state, { type: "arm-requested" });
    expect(state).toEqual({
      armRequested: true,
      autoContinueEnabled: true,
      engaged: true,
    });

    state = transitionDriveSessionState(state, { type: "arm-consumed" });
    expect(state.armRequested).toBe(false);
  });

  it("turns the switch fully off and resumes in an armed state", () => {
    const engaged = transitionDriveSessionState(createDriveSessionState(), {
      type: "resume",
    });
    const paused = transitionDriveSessionState(engaged, { type: "pause" });

    expect(paused).toEqual({
      armRequested: false,
      autoContinueEnabled: false,
      engaged: false,
    });
    expect(transitionDriveSessionState(paused, { type: "resume" })).toEqual({
      armRequested: true,
      autoContinueEnabled: true,
      engaged: true,
    });
  });

  it("separates temporary disengagement from a full suspension", () => {
    const armed = transitionDriveSessionState(createDriveSessionState(), {
      type: "resume",
    });

    expect(transitionDriveSessionState(armed, { type: "disengage" })).toEqual({
      armRequested: false,
      autoContinueEnabled: false,
      engaged: false,
    });
    expect(transitionDriveSessionState(armed, { type: "suspend" })).toEqual({
      ...armed,
      armRequested: false,
      engaged: false,
    });
  });

  it("re-engages an enabled switch after a temporary suspension", () => {
    const suspended = transitionDriveSessionState(
      transitionDriveSessionState(createDriveSessionState(), {
        type: "resume",
      }),
      { type: "suspend" },
    );
    expect(transitionDriveSessionState(suspended, { type: "engage" })).toEqual({
      armRequested: true,
      autoContinueEnabled: true,
      engaged: true,
    });
  });
});
