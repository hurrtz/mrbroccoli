const { AUTO_SETUP_PLAN, AutoSetupStepReading } = window.MrBroccoliDesignSystem_62d510;

/**
 * The install clock, owned above every screen that shows it.
 *
 * The introduction, the App & diagnostics page and the home-screen row are three
 * views of one job, so the job cannot live in any of them. Real timings differ —
 * the check is milliseconds, the download is minutes — but the shape is the
 * same: measure, propose, install, and a failure that leaves the finished
 * models in place.
 */
const REVEAL_MS = [400, 950, 1500, 2050];
const SCAN_MS = 2700;
const INSTALL_MS = 14000;

const FAILURE = {
  title: "Install did not finish",
  detail: "Whisper Small stopped at 62%. The connection dropped. Qwen 2.5 1.5B finished and is ready to use; nothing was left half-installed.",
  role: "listen",
  note: "Stopped at 62%. Not installed.",
};

/** `failAt` fails the first attempt at that fraction, so the retry path is demonstrable. */
function useAutoSetupFlow({ failAt, onFinished, onFailed } = {}) {
  const [state, setState] = React.useState("offer");
  const [scanned, setScanned] = React.useState(0);
  const [fraction, setFraction] = React.useState(0);
  const [attempt, setAttempt] = React.useState(0);

  React.useEffect(() => {
    if (state !== "scanning") return undefined;
    const reveals = REVEAL_MS.map((ms, index) => setTimeout(() => setScanned(index + 1), ms));
    const settle = setTimeout(() => setState("proposal"), SCAN_MS);
    return () => { reveals.forEach(clearTimeout); clearTimeout(settle); };
  }, [state]);

  React.useEffect(() => {
    if (state !== "installing") return undefined;
    const started = Date.now() - fraction * INSTALL_MS;
    const stop = failAt != null && attempt === 0 ? failAt : 1;
    const tick = setInterval(() => {
      const next = Math.min(1, (Date.now() - started) / INSTALL_MS);
      if (stop < 1 && next >= stop) {
        clearInterval(tick);
        setFraction(stop);
        setState("failed");
        if (onFailed) onFailed();
        return;
      }
      setFraction(next);
      if (next >= 1) {
        clearInterval(tick);
        setState("done");
        if (onFinished) onFinished();
      }
    }, 120);
    return () => clearInterval(tick);
  }, [state, attempt]);

  const reading = AutoSetupStepReading({ plan: AUTO_SETUP_PLAN, fraction });
  const start = () => { setScanned(0); setState("scanning"); };
  const install = () => { setFraction(0); setState("installing"); };
  const retry = () => { setAttempt((n) => n + 1); setFraction(0); setState("installing"); };

  return {
    state, fraction, scanned, reading,
    installing: state === "installing",
    failed: state === "failed",
    start, install, retry,
    // Spread straight onto AutoSetupCard wherever it appears.
    cardProps: {
      state, fraction, scanned,
      error: state === "failed" ? FAILURE : undefined,
      onStart: start, onInstall: install, onRetry: retry,
    },
  };
}

Object.assign(window, { useAutoSetupFlow, MB_AUTO_FAILURE: FAILURE });
