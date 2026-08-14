import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";
import { AutoSetupPlanRow } from "./AutoSetupPlanRow";
import { InstallProgress } from "./InstallProgress";

/** English defaults. Pass `copy` to translate; every string is overridable. */
export const AUTO_SETUP_COPY = {
  title: "Automatic setup",
  body: "Mr Broccoli can measure what this phone is able to run, then pick one model to think with, one to hear you and one to speak back.",
  offerNote: "Nothing is downloaded until you have seen the list.",
  start: "Check this phone",

  scanning: "Measuring this phone",
  scanNote: "A few seconds. Nothing leaves the device.",

  proposalLabel: "Recommended for this phone",
  proposalNote: "You can change any of it later in Settings.",
  install: "Download and install",
  manual: "Choose manually instead",

  installingNote: "The download continues if you leave this screen.",
  continue: "Continue — this keeps going",
  downloading: "Downloading.",
  queued: "Waiting its turn.",
  installed: "Installed and selected.",

  doneTitle: "Ready",
  doneBody: "All three are installed and selected. Replies, speech input and voice output now work with no network connection.",
  finish: "Done",

  failedTitle: "Install did not finish",
  retry: "Try again",

  preparing: "Preparing",
  verifying: "Verifying",
  downloadPrefix: "Downloading ",
};

export const AUTO_SETUP_PLAN = [
  { role: "think", roleLabel: "Thinking", name: "Qwen 2.5 1.5B", size: "934 MB", evidence: "Measured", fit: "Viable", details: ["14.2 tok/s", "Headroom 2.4×"] },
  { role: "listen", roleLabel: "Listening", name: "Whisper Small", size: "466 MB", evidence: "Calibrated", fit: "Likely", details: ["0.42–0.58 RTF"] },
  { role: "speak", roleLabel: "Speaking", name: "Kokoro 82M", size: "312 MB", evidence: "Estimated", fit: "Close", details: ["0.71 RTF", "Headroom 1.1×"] },
];

export const AUTO_SETUP_FACTS = [
  { label: "Memory", value: "8 GB · 3.4 GB usable" },
  { label: "Accelerator", value: "Neural engine present" },
  { label: "Storage", value: "41 GB free" },
  { label: "Probe", value: "14.2 tok/s on a 1.5B model" },
];

const REVEAL_MS = [400, 950, 1500, 2050];
const SCAN_MS = 2700;
const DEMO_INSTALL_MS = 11000;

function totalSize(plan) {
  const mb = plan.reduce((sum, item) => {
    const value = parseFloat(item.size) || 0;
    return sum + (/GB/i.test(item.size || "") ? value * 1024 : value);
  }, 0);
  return mb >= 1024 ? (mb / 1024).toFixed(2) + " GB" : Math.round(mb) + " MB";
}

function durationLabel(seconds) {
  if (seconds >= 90) return "about " + Math.round(seconds / 60) + " min";
  if (seconds >= 40) return "about a minute";
  return "about " + Math.max(5, Math.round(seconds / 5) * 5) + " s";
}

function remainingLabel(fraction, seconds) {
  const left = Math.max(0, Math.round(seconds * (1 - fraction)));
  return left <= 5 ? "almost done" : durationLabel(left) + " left";
}

/**
 * The one place the install queue is turned into words, so the card and the
 * home-screen row can never disagree about which step is running.
 *
 * The queue is preparing, then one step per model, then verifying — the two
 * ends are real work (clearing space, checking hashes) and a user watching a
 * five-step queue that only ever names downloads would see it stall twice.
 */
export function AutoSetupStepReading({ plan = AUTO_SETUP_PLAN, fraction = 0, estimateSeconds = 240, copy } = {}) {
  const words = { ...AUTO_SETUP_COPY, ...copy };
  const labels = [words.preparing].concat(plan.map((item) => words.downloadPrefix + item.name)).concat([words.verifying]);
  const stepCount = labels.length;
  const index = Math.min(stepCount - 1, Math.max(0, Math.floor(fraction * stepCount)));
  return {
    index,
    step: index + 1,
    stepCount,
    label: labels[index],
    remaining: remainingLabel(fraction, estimateSeconds),
    percent: Math.round(Math.max(0, Math.min(1, fraction)) * 100),
  };
}

/**
 * The card drives itself when no `state` is passed, so a specimen or a single
 * screen works with no wiring. A host that has to keep the install running
 * across screens passes `state` and `fraction` and owns the clock instead.
 */
function useDemoRun() {
  const [state, setState] = React.useState("offer");
  const [scanned, setScanned] = React.useState(0);
  const [fraction, setFraction] = React.useState(0);

  React.useEffect(() => {
    if (state !== "scanning") return undefined;
    const reveals = REVEAL_MS.map((ms, index) => setTimeout(() => setScanned(index + 1), ms));
    const settle = setTimeout(() => setState("proposal"), SCAN_MS);
    return () => { reveals.forEach(clearTimeout); clearTimeout(settle); };
  }, [state]);

  React.useEffect(() => {
    if (state !== "installing") return undefined;
    const started = Date.now();
    const tick = setInterval(() => {
      const next = Math.min(1, (Date.now() - started) / DEMO_INSTALL_MS);
      setFraction(next);
      if (next >= 1) setState("done");
    }, 100);
    return () => clearInterval(tick);
  }, [state]);

  return {
    state, scanned, fraction,
    start: () => { setScanned(0); setState("scanning"); },
    install: () => { setFraction(0); setState("installing"); },
  };
}

function Action({ label, icon, tone = "primary", onPress }) {
  const filled = tone === "primary";
  const ink = filled ? "var(--mb-color-on-accent)" : "var(--mb-color-text)";
  return (
    <button type="button" onClick={onPress} style={{
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      minHeight: 48, padding: "0 20px", cursor: "pointer", width: "100%",
      borderRadius: "var(--mb-radius-control)",
      border: "1px solid " + (filled ? "transparent" : "var(--mb-color-border-strong)"),
      background: filled ? "var(--mb-color-accent)" : "transparent", color: ink,
      fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 16,
    }}>
      {icon ? <PhosphorIcon name={icon} size="control" color={ink} /> : null}
      {label}
    </button>
  );
}

function TextAction({ label, onPress }) {
  return (
    <button type="button" onClick={onPress} style={{
      minHeight: 44, padding: 0, border: "none", background: "none", cursor: "pointer", textAlign: "center",
      fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 14, color: "var(--mb-color-text-secondary)",
    }}>{label}</button>
  );
}

function Verdict({ tone, title, body }) {
  const ink = tone === "danger" ? "var(--mb-color-danger)" : "var(--mb-color-success)";
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      <span style={{
        width: 30, height: 30, flexShrink: 0, borderRadius: 999, marginTop: 1,
        display: "flex", alignItems: "center", justifyContent: "center",
        border: "1px solid color-mix(in srgb, " + ink + " 35%, transparent)",
        background: "color-mix(in srgb, " + ink + " 10%, transparent)",
      }}>
        <PhosphorIcon name={tone === "danger" ? "warning" : "check"} size="compact" color={ink} />
      </span>
      <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 15, lineHeight: "21px", color: ink }}>{title}</span>
        <span style={{ fontFamily: "var(--mb-font-body)", fontSize: 14, lineHeight: "20px", textWrap: "pretty", color: "var(--mb-color-text-secondary)" }}>{body}</span>
      </span>
    </div>
  );
}

function Fact({ label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
      <PhosphorIcon name="check" size="inline" color="var(--mb-color-success)" style={{ marginTop: 3 }} />
      <span style={{ width: 88, flexShrink: 0, fontFamily: "var(--mb-font-mono)", fontSize: 11, lineHeight: "17px", letterSpacing: "0.75px", textTransform: "uppercase", color: "var(--mb-color-text-muted)" }}>{label}</span>
      <span style={{ flex: 1, minWidth: 0, fontFamily: "var(--mb-text-body-family)", fontSize: 13, lineHeight: "18px", color: "var(--mb-color-text)" }}>{value}</span>
    </div>
  );
}

/**
 * One tap that measures the device, proposes a set of on-device models, and
 * installs them.
 *
 * Six states, one card, the same card in the introduction and in settings
 * (App & diagnostics) — a user who starts this in the walkthrough and finds it again in
 * settings should be looking at the thing they left, not a second design of it.
 *
 * The measuring pause is deliberate and about two and a half seconds long. The
 * check itself is near-instant, but a verdict that arrives before the user has
 * finished reading the question reads as a canned answer rather than a
 * measurement — and the facts revealed one at a time are what earn the
 * recommendation that follows. Each fact is a real reading, never a claim.
 *
 * The proposal is never installed on the user's behalf: the app has just told
 * the user it can decide for them, so the one thing it must not do is spend
 * their storage before they have seen the list.
 */
export function AutoSetupCard({
  state: controlledState,
  fraction: controlledFraction,
  scanned: controlledScanned,
  plan = AUTO_SETUP_PLAN,
  facts = AUTO_SETUP_FACTS,
  error,
  estimateSeconds = 240,
  showHeader = true,
  copy: overrides,
  onStart, onInstall, onRetry, onManual, onContinue, onFinish,
  style,
}) {
  const copy = React.useMemo(() => ({ ...AUTO_SETUP_COPY, ...overrides }), [overrides]);
  const run = useDemoRun();
  const controlled = controlledState != null;
  const state = controlled ? controlledState : run.state;
  const fraction = controlled ? (controlledFraction || 0) : run.fraction;
  const scanned = controlled ? (controlledScanned == null ? facts.length : controlledScanned) : run.scanned;

  const start = () => { if (!controlled) run.start(); if (onStart) onStart(); };
  const install = () => { if (!controlled) run.install(); if (onInstall) onInstall(); };
  const retry = () => { if (!controlled) run.install(); if (onRetry) onRetry(); };

  const reading = AutoSetupStepReading({ plan, fraction, estimateSeconds, copy });
  const stepIndex = reading.index;
  const failure = state === "failed" ? (error || { title: copy.failedTitle, detail: "The download stopped before it finished. Nothing was left half-installed.", role: plan[1] && plan[1].role }) : null;
  const failedAt = failure ? plan.findIndex((entry) => entry.role === failure.role) : -1;

  const rowState = (item, index) => {
    if (state === "done") return "done";
    if (failure) return index === failedAt ? "failed" : index < failedAt ? "done" : "skipped";
    if (state !== "installing") return "planned";
    if (stepIndex > index + 1) return "done";
    if (stepIndex === index + 1) return "active";
    return "planned";
  };

  const rowNote = (item, index) => {
    const current = rowState(item, index);
    if (current === "done") return copy.installed;
    if (current === "active") return copy.downloading;
    if (current === "failed") return failure && failure.note ? failure.note : "Stopped before it finished. Not installed.";
    if (current === "skipped") return copy.queued;
    return null;
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 14, padding: 18,
      borderRadius: "var(--mb-radius-panel)", border: "1px solid var(--mb-color-border)",
      background: "var(--mb-color-surface)", ...style,
    }}>
      <style>{"@keyframes mb-scan-spin{to{transform:rotate(360deg)}}"}</style>

      {showHeader ? (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <span style={{
            width: 34, height: 34, flexShrink: 0, borderRadius: 999,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1px solid color-mix(in srgb, var(--mb-color-accent) 30%, transparent)",
            background: "var(--mb-color-accent-soft)",
          }}>
            <PhosphorIcon name="cpu" size="control" color="var(--mb-color-accent)" />
          </span>
          <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontFamily: "var(--mb-font-headline)", fontSize: 18, lineHeight: "24px", letterSpacing: "-0.1px", color: "var(--mb-color-text)" }}>{copy.title}</span>
            <span style={{ fontFamily: "var(--mb-font-body)", fontSize: 14, lineHeight: "20px", textWrap: "pretty", color: "var(--mb-color-text-secondary)" }}>{copy.body}</span>
          </span>
        </div>
      ) : null}

      {state === "offer" ? (
        <React.Fragment>
          <span style={{ fontFamily: "var(--mb-text-supporting-family)", fontSize: 13, lineHeight: "19px", color: "var(--mb-color-text-muted)" }}>{copy.offerNote}</span>
          <Action label={copy.start} icon="thunderbolt" onPress={start} />
        </React.Fragment>
      ) : null}

      {state === "scanning" ? (
        <React.Fragment>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 16, height: 16, borderRadius: 8, flexShrink: 0, border: "2px solid var(--mb-color-accent)", borderTopColor: "transparent", animation: "mb-scan-spin 0.8s linear infinite" }} />
            <span style={{ flex: 1, minWidth: 0, fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 15, lineHeight: "21px", color: "var(--mb-color-text)" }}>{copy.scanning}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, minHeight: 76 }}>
            {facts.slice(0, scanned).map((fact) => <Fact key={fact.label} label={fact.label} value={fact.value} />)}
          </div>
          <span style={{ fontFamily: "var(--mb-text-supporting-family)", fontSize: 13, lineHeight: "19px", color: "var(--mb-color-text-muted)" }}>{copy.scanNote}</span>
        </React.Fragment>
      ) : null}

      {state === "proposal" ? (
        <React.Fragment>
          <span style={{ fontFamily: "var(--mb-font-mono)", fontSize: 11, lineHeight: "16px", letterSpacing: "0.75px", textTransform: "uppercase", color: "var(--mb-color-text-muted)" }}>{copy.proposalLabel}</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {plan.map((item) => <AutoSetupPlanRow key={item.role} {...item} />)}
          </div>
          <span style={{ height: 1, background: "var(--mb-color-border)" }} />
          <span style={{ fontFamily: "var(--mb-font-mono)", fontSize: 11, lineHeight: "16px", color: "var(--mb-color-text-secondary)" }}>
            {totalSize(plan) + " · " + durationLabel(estimateSeconds) + " on Wi-Fi"}
          </span>
          <span style={{ fontFamily: "var(--mb-text-supporting-family)", fontSize: 13, lineHeight: "19px", color: "var(--mb-color-text-muted)" }}>{copy.proposalNote}</span>
          <Action label={copy.install} icon="download" onPress={install} />
          {onManual ? <TextAction label={copy.manual} onPress={onManual} /> : null}
        </React.Fragment>
      ) : null}

      {state === "installing" ? (
        <React.Fragment>
          <InstallProgress label={reading.label} step={reading.step} stepCount={reading.stepCount}
            remaining={reading.remaining} fraction={fraction} />
          <span style={{ height: 1, background: "var(--mb-color-border)" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {plan.map((item, index) => (
              <AutoSetupPlanRow key={item.role} {...item} state={rowState(item, index)} note={rowNote(item, index)} />
            ))}
          </div>
          <span style={{ fontFamily: "var(--mb-text-supporting-family)", fontSize: 13, lineHeight: "19px", color: "var(--mb-color-text-muted)" }}>{copy.installingNote}</span>
          {onContinue ? <Action label={copy.continue} tone="secondary" onPress={onContinue} /> : null}
        </React.Fragment>
      ) : null}

      {state === "done" ? (
        <React.Fragment>
          <Verdict tone="success" title={copy.doneTitle} body={copy.doneBody} />
          <span style={{ height: 1, background: "var(--mb-color-border)" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {plan.map((item, index) => (
              <AutoSetupPlanRow key={item.role} {...item} state="done" note={rowNote(item, index)} />
            ))}
          </div>
          {onFinish ? <Action label={copy.finish} icon="check" onPress={onFinish} /> : null}
        </React.Fragment>
      ) : null}

      {failure ? (
        <React.Fragment>
          <Verdict tone="danger" title={failure.title || copy.failedTitle} body={failure.detail} />
          <span style={{ height: 1, background: "var(--mb-color-border)" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {plan.map((item, index) => (
              <AutoSetupPlanRow key={item.role} {...item} state={rowState(item, index)} note={rowNote(item, index)} />
            ))}
          </div>
          <Action label={copy.retry} icon="reload" onPress={retry} />
          {onManual ? <TextAction label={copy.manual} onPress={onManual} /> : null}
        </React.Fragment>
      ) : null}
    </div>
  );
}
