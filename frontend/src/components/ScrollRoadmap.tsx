import { useEffect, useId, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Award,
  BriefcaseBusiness,
  Check,
  Cloud,
  Flag,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { courses, track } from "../data/site";
import Celebration, { type CelebrationKind } from "./Celebration";
const celebrations: Record<string, CelebrationKind> = {
  "Get Certified": "certificate",
  "Got the Job": "job",
};
const descriptions: Record<string, [string, string]> = {
  Basics: [
    "Understand the Salesforce ecosystem",
    "Explore CRM, the Salesforce platform and your developer org. Get comfortable with the tools before building your first application.",
  ],
  Admin: [
    "Configure the way a business works",
    "Manage users, roles, profiles and permissions. Build a reliable foundation for the people using your application.",
  ],
  "Data Model": [
    "Turn business requirements into a data model",
    "Create objects, fields and relationships. Model realistic customer and service information.",
  ],
  Security: [
    "Give the right people the right access",
    "Practise sharing rules, field-level security and permissions. Design access deliberately, not as an afterthought.",
  ],
  Automation: [
    "Make everyday work flow",
    "Build and debug record-triggered flows, screen flows and reusable automation for real business processes.",
  ],
  JavaScript: [
    "Build your development foundation",
    "Learn modern JavaScript, functions, objects, modules and asynchronous programming before creating Lightning components.",
  ],
  Apex: [
    "Write business logic with confidence",
    "Work with Apex classes, collections, triggers and asynchronous jobs. Learn bulkification and governor-limit-aware code.",
  ],
  SOQL: [
    "Ask better questions of your data",
    "Query relationships, aggregate records and use SOQL and SOSL to retrieve the data your application needs.",
  ],
  LWC: [
    "Bring your Salesforce application to life",
    "Build Lightning Web Components with reactive data, component communication, Apex integration and accessible interfaces.",
  ],
  Testing: [
    "Prove that your solution works",
    "Write meaningful Apex tests and LWC Jest tests. Validate positive, negative, bulk and security scenarios.",
  ],
  Git: [
    "Work like a professional development team",
    "Use Git, branches and pull requests. Review code, validate quality and practise the deployment workflow.",
  ],
  "Real Project": [
    "Connect everything in one real project",
    "Build a customer service application with objects, security, Flow, Apex, LWC, reports and tests. Review and improve it with your mentor.",
  ],
  "Get Certified": [
    "Celebrate completing the program",
    "Wrap up your capstone, collect your course completion certificate and plan the Salesforce certification exam you want to take next. Vendor exams are booked separately.",
  ],
  "Interview Prep": [
    "Explain what you built and why",
    "Prepare your portfolio, practise technical interviews and learn to communicate your decisions. Career support, without unrealistic guarantees.",
  ],
  "Got the Job": [
    "Step into your first Salesforce role",
    "This is the goal every milestone builds toward. Walk into interviews with a real project, a portfolio and practised answers. We support your search; the offer is yours to win.",
  ],
};
export default function ScrollRoadmap({ items }: { items: string[] }) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const [compact, setCompact] = useState(
    () => matchMedia("(max-height:580px)").matches,
  );
  useEffect(() => {
    const mq = matchMedia("(max-height:580px)");
    const update = () => setCompact(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const id = useId().replace(/:/g, "");
  const section = useRef<HTMLDivElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const [mobile, setMobile] = useState(
    () => matchMedia("(max-width:767px)").matches,
  );
  const [width, setWidth] = useState(600);
  const [viewHeight, setViewHeight] = useState(300);
  const [active, setActive] = useState(0);
  const [celebrating, setCelebrating] = useState<CelebrationKind | null>(null);
  const previous = useRef(0);
  const celebrated = useRef(new Set<number>());
  const finished = useRef(false);
  useEffect(() => {
    const mq = matchMedia("(max-width:767px)");
    const update = () => setMobile(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!view.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
      setViewHeight((entry.target as HTMLElement).clientHeight);
    });
    observer.observe(view.current);
    return () => observer.disconnect();
  }, [reduced, compact]);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: [`start ${mobile ? 70 : 83}px`, "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.round(value * (items.length - 1));
    const prev = previous.current;
    previous.current = next;
    setActive(next);
    // Celebrate only when scrolling forward onto a milestone step by step,
    // not when jumping in from below or via "Skip roadmap".
    if (next > prev && next - prev <= 2) {
      for (let i = prev + 1; i <= next; i++) {
        const kind = celebrations[items[i]];
        if (kind && !celebrated.current.has(i)) {
          celebrated.current.add(i);
          setCelebrating(kind);
          track("roadmap_celebration", { milestone: items[i] });
        }
      }
    }
    if (value > 0.99 && !finished.current) {
      finished.current = true;
      track("roadmap_complete", { roadmap: items[0] || "learning" });
    }
  });
  const step = mobile ? 170 : 235;
  const points = items.map((_, i) => ({
    x: mobile ? (i % 2 ? 205 : 95) : 110 + i * step,
    y: mobile ? 80 + i * step : i % 2 ? 238 : 102,
  }));
  const path = points
    .map((p, i) => {
      if (!i) return `M ${p.x} ${p.y}`;
      const prev = points[i - 1];
      return mobile
        ? `C ${prev.x} ${prev.y + 85}, ${p.x} ${p.y - 85}, ${p.x} ${p.y}`
        : `C ${prev.x + 118} ${prev.y}, ${p.x - 118} ${p.y}, ${p.x} ${p.y}`;
    })
    .join(" ");
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    mobile
      ? [(width - 300) / 2, (width - 300) / 2]
      : [width / 2 - 110, width / 2 - points.at(-1)!.x],
  );
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    mobile
      ? [viewHeight * 0.46 - points[0].y, viewHeight * 0.46 - points.at(-1)!.y]
      : [0, 0],
  );
  const current = items[active];
  const known = descriptions[current];
  const module = courses
    .flatMap((c) => c.modules)
    .find((m) => m.title.toLowerCase().includes(current.toLowerCase()));
  const title = known?.[0] || t(current);
  const body =
    known?.[1] ||
    (module
      ? `Practise ${module.topics.slice(0, 5).join(", ")}. Apply the concepts through guided exercises and mentor feedback.`
      : "Take this step with guided practice, clear goals and feedback. Apply what you learn before continuing to the next milestone.");
  function go(index: number) {
    if (!section.current) return;
    const top = section.current.getBoundingClientRect().top + window.scrollY;
    const header = mobile ? 70 : 83;
    const distance = section.current.offsetHeight - window.innerHeight + header;
    window.scrollTo({
      top: top - header + (distance * index) / Math.max(1, items.length - 1),
      behavior: reduced ? "auto" : "smooth",
    });
  }
  if (reduced || compact)
    return (
      <div className="road-static" ref={section}>
        <p className="eyebrow">YOUR LEARNING ROADMAP</p>
        <ol>
          {items.map((item, i) => (
            <li key={item}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{t(item)}</h3>
                <p>
                  {descriptions[item]?.[1] ||
                    "Guided practice, hands-on assignments and mentor feedback."}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    );
  return (
    <>
      <div
        className="scroll-road"
        ref={section}
        style={{ height: `${100 + items.length * 55}svh` }}
      >
        <div className="road-pin">
          <header className="road-heading">
            <div>
              <p className="eyebrow">
                {items.includes("Apex")
                  ? "YOUR SALESFORCE JOURNEY"
                  : "YOUR LEARNING JOURNEY"}
              </p>
              <h2>One milestone. One step closer.</h2>
            </div>
            <a className="road-skip" href={`#road-end-${id}`}>
              Skip roadmap <ArrowDown size={14} />
            </a>
          </header>
          <div className="road-stage">
            <div
              className="road-view"
              ref={view}
              aria-label="Animated learning path"
            >
              <span className="road-start-label">
                <Cloud size={19} />{" "}
                {items.includes("Apex")
                  ? "Salesforce learning path"
                  : "Your learning path"}
              </span>
              <motion.svg
                className="road-svg"
                width={mobile ? 300 : points.at(-1)!.x + 120}
                height={mobile ? points.at(-1)!.y + 100 : 340}
                style={{ x, y }}
                aria-hidden="true"
              >
                <path d={path} className="road-shadow" />
                <path d={path} className="road-asphalt" />
                <path d={path} className="road-dashes" />
                <motion.path
                  d={path}
                  className="road-travelled"
                  style={{ pathLength: scrollYProgress }}
                />
                {points.map((point, i) => (
                  <g
                    key={items[i]}
                    transform={`translate(${point.x},${point.y})`}
                    className={`road-node ${i === active ? "current" : ""} ${i < active ? "passed" : ""} ${celebrations[items[i]] ? "goal" : ""}`}
                  >
                    <circle r={i === active ? 30 : 23} />
                    <text textAnchor="middle" dy="6">
                      {i < active ? "✓" : String(i + 1).padStart(2, "0")}
                    </text>
                    <text
                      className="road-node-label"
                      x={mobile ? 0 : 0}
                      y={mobile ? 52 : i % 2 ? 48 : -46}
                      textAnchor="middle"
                    >
                      {items[i]}
                    </text>
                  </g>
                ))}
              </motion.svg>
              <div className="road-scroll-hint">
                <ArrowDown size={15} /> Scroll to follow the journey
              </div>
            </div>
            <article
              className="road-story"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="road-step">
                <span>STEP {String(active + 1).padStart(2, "0")}</span>
                <span>{String(items.length).padStart(2, "0")} MILESTONES</span>
              </div>
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <span className="road-topic">
                  {celebrations[current] === "certificate" ? (
                    <Award size={20} />
                  ) : celebrations[current] === "job" ? (
                    <BriefcaseBusiness size={20} />
                  ) : active === items.length - 1 ? (
                    <Flag size={20} />
                  ) : (
                    <Cloud size={20} />
                  )}{" "}
                  {t(current)}
                </span>
                <h3>{title}</h3>
                <p>{body}</p>
                <div className="road-practice">
                  <Check size={16} /> Learn it. Practise it. Build with it.
                </div>
              </motion.div>
              <div className="road-controls">
                <button
                  onClick={() => go(Math.max(0, active - 1))}
                  disabled={active === 0}
                  aria-label="Previous roadmap milestone"
                >
                  <ArrowLeft size={17} />
                </button>
                <div
                  className="road-meter"
                  role="progressbar"
                  aria-label="Roadmap progress"
                  aria-valuemin={1}
                  aria-valuemax={items.length}
                  aria-valuenow={active + 1}
                >
                  <span
                    style={{ width: `${((active + 1) / items.length) * 100}%` }}
                  />
                </div>
                <button
                  onClick={() => go(Math.min(items.length - 1, active + 1))}
                  disabled={active === items.length - 1}
                  aria-label="Next roadmap milestone"
                >
                  <ArrowRight size={17} />
                </button>
              </div>
            </article>
          </div>
          <div className="road-footer">
            <span>FROM THE FIRST CONCEPT TO YOUR FIRST PROJECT</span>
            <span>
              {active === items.length - 1
                ? "Journey complete — keep scrolling to continue"
                : `${active + 1} / ${items.length}`}
            </span>
          </div>
        </div>
      </div>
      <div id={`road-end-${id}`} className="road-end" tabIndex={-1} />
      {celebrating && (
        <Celebration
          key={celebrating}
          kind={celebrating}
          onDone={() => setCelebrating(null)}
        />
      )}
    </>
  );
}
