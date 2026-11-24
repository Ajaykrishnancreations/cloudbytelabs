import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Check, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { RoadmapStep } from "../data/roadmaps";
import { track } from "../data/site";
import Celebration, { type CelebrationKind } from "./Celebration";
gsap.registerPlugin(ScrollTrigger, useGSAP);

const celebrations: Record<string, CelebrationKind> = {
  "Get Certified": "certificate",
  "Got the Job": "job",
};
const W = 600; // SVG coordinate width
const ROW = 118; // vertical distance between nodes
const TOP = 70; // first node's y
const R = 26; // corner radius
const CORNER = R * 1.1478; // length of a quadratic quarter-corner

/**
 * Builds an orthogonal route with rounded corners through every node and the
 * route length up to each node, so scroll progress can light nodes in turn.
 */
function buildRoute(xs: number[]) {
  const ys = xs.map((_, i) => TOP + i * ROW);
  let d = `M ${xs[0]} 0 L ${xs[0]} ${ys[0]}`;
  let length = ys[0];
  const at = [length];
  for (let i = 1; i < xs.length; i++) {
    const [x1, y1, x2, y2] = [xs[i - 1], ys[i - 1], xs[i], ys[i]];
    if (x1 === x2) {
      d += ` L ${x2} ${y2}`;
      length += y2 - y1;
    } else {
      const ym = (y1 + y2) / 2;
      const dir = x2 > x1 ? 1 : -1;
      const r = Math.min(R, Math.abs(x2 - x1) / 2, (y2 - y1) / 2);
      d += ` L ${x1} ${ym - r} Q ${x1} ${ym} ${x1 + dir * r} ${ym}`;
      d += ` L ${x2 - dir * r} ${ym} Q ${x2} ${ym} ${x2} ${ym + r} L ${x2} ${y2}`;
      length += ym - r - y1 + (r * CORNER) / R + Math.abs(x2 - x1) - 2 * r + (r * CORNER) / R + (y2 - (ym + r));
    }
    at.push(length);
  }
  const end = ys[ys.length - 1] + ROW * 0.6;
  d += ` L ${xs[xs.length - 1]} ${end}`;
  length += end - ys[ys.length - 1];
  return { d, ys, at: at.map((l) => l / length), height: end };
}

export default function FlowRoadmap({
  steps,
  eyebrow = "YOUR SALESFORCE JOURNEY",
}: {
  steps: RoadmapStep[];
  eyebrow?: string;
}) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const progressPath = useRef<SVGPathElement>(null);
  const [active, setActive] = useState(0);
  const [celebrating, setCelebrating] = useState<CelebrationKind | null>(null);
  const previous = useRef(0);
  const celebrated = useRef(new Set<number>());
  // Columns zig-zag: centre, left, right, centre, right, left, … (narrower on phones)
  const [narrow] = useState(() => matchMedia("(max-width: 860px)").matches);
  const xs = useMemo(() => {
    const pattern = narrow ? [300, 205, 395, 300, 395, 205] : [300, 120, 480, 300, 480, 120];
    return steps.map((_, i) => pattern[i % pattern.length]);
  }, [steps, narrow]);
  const route = useMemo(() => buildRoute(xs), [xs]);

  useGSAP(
    () => {
      const path = progressPath.current;
      if (!path) return;
      // pathLength=1 normalises dashing, so it stays exact when the SVG stretches.
      gsap.set(path, { strokeDasharray: 1, strokeDashoffset: reduced ? 0 : 1 });
      ScrollTrigger.create({
        trigger: ".flow-canvas",
        start: "top 65%",
        end: "bottom 65%",
        scrub: reduced ? false : 0.4,
        onUpdate: (self) => {
          const p = self.progress;
          if (!reduced) path.style.strokeDashoffset = String(1 - p);
          let next = 0;
          route.at.forEach((f, i) => {
            if (p + 0.002 >= f) next = i;
          });
          const prev = previous.current;
          if (next === prev) return;
          previous.current = next;
          setActive(next);
          // Celebrate only when moving forward step by step, once per milestone.
          if (!reduced && next > prev && next - prev <= 2)
            for (let i = prev + 1; i <= next; i++) {
              const kind = celebrations[steps[i].title];
              if (kind && !celebrated.current.has(i)) {
                celebrated.current.add(i);
                setCelebrating(kind);
                track("roadmap_celebration", { milestone: steps[i].title });
              }
            }
          if (next === steps.length - 1) track("roadmap_complete", { roadmap: steps[0]?.title ?? "" });
        },
      });
    },
    { scope: root, dependencies: [route, reduced] },
  );

  function go(i: number) {
    const canvas = root.current?.querySelector<HTMLElement>(".flow-canvas");
    if (!canvas) return;
    const top = canvas.getBoundingClientRect().top + scrollY;
    const span = canvas.offsetHeight;
    window.scrollTo({ top: top + span * route.at[i] - innerHeight * 0.65 + 2, behavior: reduced ? "auto" : "smooth" });
    setActive(i);
  }

  const step = steps[active];
  return (
    <div className="flow" ref={root}>
      <aside className="flow-panel">
        <p className="flow-eyebrow">{eyebrow}</p>
        <h3 className="flow-title">One milestone. One step closer.</h3>
        <div className="flow-count">
          <span>STEP {String(active + 1).padStart(2, "0")}</span>
          <span>/ {String(steps.length).padStart(2, "0")}</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={step.title}
            className="flow-detail"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            aria-live="polite"
          >
            <p className="flow-tag">{t(step.title)}</p>
            <h4>{step.heading}</h4>
            <p>{step.body}</p>
          </motion.div>
        </AnimatePresence>
        <div className="flow-meter" role="progressbar" aria-label="Roadmap progress" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={active + 1}>
          <span style={{ width: `${((active + 1) / steps.length) * 100}%` }} />
        </div>
      </aside>
      <div className="flow-canvas" style={{ height: route.height }}>
        <svg className="flow-svg" viewBox={`0 0 ${W} ${route.height}`} preserveAspectRatio="none" aria-hidden="true">
          <path d={route.d} className="flow-base" vectorEffect="non-scaling-stroke" />
          <path ref={progressPath} d={route.d} className="flow-progress" pathLength={1} vectorEffect="non-scaling-stroke" />
        </svg>
        <ol className="flow-nodes">
          {steps.map((s, i) => {
            const milestone = !!celebrations[s.title];
            const state = i < active ? "passed" : i === active ? "current" : "upcoming";
            return (
              <li
                key={s.title}
                className={`flow-node is-${state} ${milestone ? "is-milestone" : ""}`}
                style={{ left: `${(xs[i] / W) * 100}%`, top: route.ys[i] }}
              >
                <button type="button" onClick={() => go(i)} aria-current={i === active ? "step" : undefined}>
                  <span className="flow-status" aria-hidden="true">
                    {milestone ? <Star size={13} /> : i < active ? <Check size={13} /> : <i />}
                  </span>
                  <span className="flow-label">{t(s.title)}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      {celebrating && <Celebration key={celebrating} kind={celebrating} onDone={() => setCelebrating(null)} />}
    </div>
  );
}
