import { Component, Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Home, Minus, Plus, RotateCcw, RotateCw, X } from "lucide-react";
import { courses } from "../../data/site";
import { hasWebGL } from "../LazyCanvas";
import type { CampusApi, School } from "./CampusScene";
const CampusScene = lazy(() => import("./CampusScene"));

/** If the 3D campus fails, hide it instead of taking down the whole page. */
class CampusBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const accents: Record<string, string> = {
  salesforce: "#00a1e0",
  "mern-stack": "#2fbf71",
  "ui-ux": "#a259ff",
  python: "#ffb020",
};
const positions: [number, number][] = [
  [-6, -5.3],
  [6, -5.3],
  [-6, 5.8],
  [6, 5.8],
];
const steps = ["Overview", "What you'll learn", "Learning path", "Real project", "Next step"];

function useDarkTheme() {
  const read = () => document.documentElement.dataset.theme === "dark";
  const [dark, setDark] = useState(read);
  useEffect(() => {
    const mo = new MutationObserver(() => setDark(read()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);
  return dark;
}
function useMobile() {
  const [mobile, setMobile] = useState(() => matchMedia("(max-width: 767px)").matches);
  useEffect(() => {
    const mq = matchMedia("(max-width: 767px)");
    const update = () => setMobile(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return mobile;
}

function StepBody({ slug, step }: { slug: string; step: number }) {
  const c = courses.find((x) => x.slug === slug)!;
  if (step === 0)
    return (
      <>
        <h4>{c.headline}</h4>
        <p>{c.description}</p>
        <div className="campus-chips">
          {c.technologies.map((x) => (
            <span key={x}>{x}</span>
          ))}
        </div>
      </>
    );
  if (step === 1)
    return (
      <>
        <h4>{c.modules.length} modules, built step by step</h4>
        <ol className="campus-list">
          {c.modules.slice(0, 6).map((m) => (
            <li key={m.title}>{m.title}</li>
          ))}
        </ol>
        {c.modules.length > 6 && <p className="campus-more">+ {c.modules.length - 6} more modules</p>}
      </>
    );
  if (step === 2)
    return (
      <>
        <h4>Your milestones</h4>
        <div className="campus-path">
          {c.roadmap.map((r, i) => (
            <span key={r}>
              <b>{String(i + 1).padStart(2, "0")}</b>
              {r}
            </span>
          ))}
        </div>
      </>
    );
  if (step === 3)
    return (
      <>
        <h4>{c.project.title}</h4>
        <p>{c.project.problem}</p>
        <p className="campus-note">Curriculum project • illustrative preview</p>
      </>
    );
  return (
    <>
      <h4>Ready to step inside?</h4>
      <p>See the full curriculum, prerequisites and project, or talk to a mentor about which path fits you.</p>
      <div className="campus-actions">
        <Link className="button" to={`/courses/${c.slug}`}>
          Explore full program <ArrowUpRight size={16} />
        </Link>
        <Link className="button secondary" to={`/contact?course=${c.slug}`}>
          Talk to a mentor
        </Link>
      </div>
    </>
  );
}

export default function CoursesCampus() {
  const [supported, setSupported] = useState(hasWebGL);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const api = useRef<CampusApi | null>(null);
  const labels = useRef<(HTMLElement | null)[]>([]);
  const dark = useDarkTheme();
  const mobile = useMobile();
  const schools = useMemo<School[]>(
    () =>
      courses.map((c, i) => ({
        slug: c.slug,
        title: c.title,
        accent: accents[c.slug] ?? "#2e62ed",
        position: positions[i % positions.length],
      })),
    [],
  );
  useEffect(() => setStep(0), [selected]);
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);
  if (!supported) return null;
  const school = selected !== null ? schools[selected] : null;
  const labelList = [
    { code: "HQ", title: "CloudLight Solutions", i: -1 },
    { code: "GATE", title: "Welcome", i: -1 },
    ...schools.map((s, i) => ({ code: `0${i + 1}`, title: s.title, i })),
  ];
  const panel = (
    <AnimatePresence>
      {school && (
        <motion.aside
          key={school.slug}
          className="campus-panel"
          style={{ "--accent": school.accent } as never}
          initial={{ opacity: 0, x: mobile ? 0 : 40, y: mobile ? 20 : 0, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: mobile ? 0 : 40, scale: 0.97 }}
          transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
          aria-live="polite"
        >
          <header>
            <span className="campus-code">0{selected! + 1}</span>
            <div>
              <small>School of</small>
              <strong>{school.title}</strong>
            </div>
            <button type="button" aria-label="Back to campus" onClick={() => setSelected(null)}>
              <X size={17} />
            </button>
          </header>
          <ol className="campus-steps" aria-label="Steps">
            {steps.map((label, i) => (
              <li key={label}>
                <button
                  type="button"
                  className={i === step ? "is-current" : i < step ? "is-done" : ""}
                  onClick={() => setStep(i)}
                  aria-current={i === step ? "step" : undefined}
                >
                  <span>{i + 1}</span>
                  <em>{label}</em>
                </button>
              </li>
            ))}
          </ol>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              className="campus-body"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <p className="campus-step-label">
                Step {step + 1} · {steps[step]}
              </p>
              <StepBody slug={school.slug} step={step} />
            </motion.div>
          </AnimatePresence>
          <footer>
            <button type="button" disabled={step === 0} onClick={() => setStep(step - 1)} aria-label="Previous step">
              <ArrowLeft size={16} />
            </button>
            <span className="campus-meter">
              <span style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
            </span>
            <button
              type="button"
              disabled={step === steps.length - 1}
              onClick={() => setStep(step + 1)}
              aria-label="Next step"
            >
              <ArrowRight size={16} />
            </button>
          </footer>
        </motion.aside>
      )}
    </AnimatePresence>
  );
  return (
    <section className={`campus ${ready ? "is-ready" : ""}`} aria-label="The CloudLight Campus">
      <div className="campus-head container">
        <p className="eyebrow">THE CLOUDLIGHT CAMPUS</p>
        <h2>Four schools. One place to grow.</h2>
        <p>Tap a school to step inside and see how you'll learn, step by step.</p>
      </div>
      <div className="campus-stage">
        <CampusBoundary onError={() => setSupported(false)}>
        <Suspense fallback={<div className="campus-loading">Building the campus…</div>}>
          <CampusScene
            schools={schools}
            selected={selected}
            onSelect={setSelected}
            api={api}
            dark={dark}
            onReady={() => setReady(true)}
            labels={labels}
          />
        </Suspense>
        </CampusBoundary>
        <div className="campus-labels">
          {labelList.map((l, k) => (
            <button
              key={l.code}
              ref={(el) => {
                labels.current[k] = el;
              }}
              type="button"
              className={`campus-pill ${l.i >= 0 && selected === l.i ? "is-active" : ""}`}
              tabIndex={l.i >= 0 ? 0 : -1}
              onClick={() => l.i >= 0 && setSelected(l.i)}
            >
              <b>{l.code}</b>
              {l.title}
            </button>
          ))}
        </div>
        <div className="campus-controls" role="toolbar" aria-label="Map controls">
          <button type="button" aria-label="Zoom in" onClick={() => api.current?.zoom(4)}>
            <Plus size={17} />
          </button>
          <button type="button" aria-label="Zoom out" onClick={() => api.current?.zoom(-4)}>
            <Minus size={17} />
          </button>
          <i />
          <button type="button" aria-label="Rotate left" onClick={() => api.current?.rotate(Math.PI / 6)}>
            <RotateCcw size={16} />
          </button>
          <button type="button" aria-label="Rotate right" onClick={() => api.current?.rotate(-Math.PI / 6)}>
            <RotateCw size={16} />
          </button>
          <i />
          <button
            type="button"
            aria-label="Back to campus view"
            onClick={() => (selected === null ? api.current?.home() : setSelected(null))}
          >
            <Home size={16} />
          </button>
        </div>
        <div className="campus-switch" role="tablist" aria-label="Schools">
          {schools.map((s, i) => (
            <button
              key={s.slug}
              role="tab"
              aria-selected={selected === i}
              onClick={() => setSelected(i)}
              style={{ "--accent": s.accent } as never}
            >
              <b>0{i + 1}</b> {s.title}
            </button>
          ))}
        </div>
        {!mobile && panel}
      </div>
      {mobile && panel}
    </section>
  );
}
