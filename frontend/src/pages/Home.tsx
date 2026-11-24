import { Fragment, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Check, Cloud, Play, Radio, Braces } from "lucide-react";
import {
  Reveal,
  Button,
  SectionHeading,
  Benefits,
  Roadmap,
  ProjectCards,
  CTA,
} from "../components/UI";
import Services from "../components/Services";
import BookShelf from "../components/BookShelf";
import { courses } from "../data/site";
import { roadmapSteps } from "../data/roadmaps";
import { Backdrop3D, Hero3D, World3D } from "../three/Scenes";
gsap.registerPlugin(ScrollTrigger, useGSAP);

function SplitWords({
  text,
  delay = 0,
  accent = false,
}: {
  text: string;
  delay?: number;
  accent?: boolean;
}) {
  return (
    <span className={`split-line ${accent ? "accent" : ""}`} aria-hidden="true">
      {text.split(" ").map((word, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span className="split-mask">
            <motion.span
              className="split-word"
              initial={{ y: "110%", rotate: 4 }}
              animate={{ y: "0%", rotate: 0 }}
              transition={{ duration: 0.9, delay: delay + i * 0.07, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {word}
            </motion.span>
          </span>
        </Fragment>
      ))}
    </span>
  );
}

/** Scene 01: the CloudLight universe. */
function Hero() {
  const { t } = useTranslation();
  const hero = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [ready, setReady] = useState(false);
  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: hero.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          progress.current = self.progress;
        },
      });
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(".hero-copy", {
          yPercent: -14,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: { trigger: hero.current, start: "top top", end: "bottom 20%", scrub: true },
        });
      });
    },
    { scope: hero },
  );
  // Copy waits for the 3D intro (cloud, bars, arrow) to assemble.
  const d = ready ? 1.1 : 0.2;
  return (
    <section className="hero hero-cinematic" ref={hero}>
      <Hero3D progress={progress} onReady={() => setReady(true)} />
      <div className="hero-veil" aria-hidden="true" />
      <div className="hero-grid container">
        <div className="hero-copy">
          <motion.p
            className="hero-eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: d }}
          >
            <span /> {t("eyebrow")}
          </motion.p>
          <h1 aria-label={`${t("hero1")} ${t("hero2")} ${t("hero3")}`}>
            <SplitWords text={t("hero1")} delay={d + 0.1} />
            <SplitWords text={t("hero2")} delay={d + 0.3} />
            <SplitWords text={t("hero3")} delay={d + 0.5} accent />
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: d + 0.8 }}
          >
            <p className="hero-description">{t("heroDescription")}</p>
            <div className="hero-buttons">
              <Button to="/courses/salesforce">{t("sfAction")}</Button>
              <Button secondary to="/contact?course=salesforce">
                {t("mentor")}
              </Button>
            </div>
            <div className="hero-points">
              <span>
                <Radio size={15} />
                {t("live")}
              </span>
              <span>
                <Braces size={15} />
                {t("handsOn")}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
      <a className="scroll-cue" href="#manifesto" aria-label="Scroll to explore">
        <span />
        Scroll
      </a>
      <div className="hero-bottom container sf-technology-strip">
        <span>
          ONE PLATFORM.
          <br />
          <strong>ENDLESS POSSIBILITIES.</strong>
        </span>
        <div>
          <Cloud />
          Salesforce
        </div>
        <div>Admin</div>
        <div>Flow</div>
        <div>Apex</div>
        <div>LWC</div>
        <div>SOQL</div>
      </div>
    </section>
  );
}

/** Scene 02: People. Technology. Growth together — pinned, word by word. */
function Manifesto() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        const words = gsap.utils.toArray<HTMLElement>(".manifesto-word");
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=180%",
            scrub: 0.6,
            pin: ".manifesto-stage",
          },
        });
        words.forEach((w, i) => {
          tl.fromTo(
            w,
            { opacity: 0, z: -600, rotateX: 35, filter: "blur(12px)" },
            { opacity: 1, z: 0, rotateX: 0, filter: "blur(0px)", duration: 1 },
            i * 1.1,
          );
          if (i < words.length - 1)
            tl.to(w, { opacity: 0.18, z: 200, scale: 0.9, duration: 0.8 }, i * 1.1 + 1);
        });
        tl.to(".manifesto-line", { scaleX: 1, duration: 1 }, ">-0.4");
        // Orbit rings turn and tilt with the scroll for depth.
        tl.fromTo(
          ".manifesto-orbits",
          { rotateX: 68, rotateZ: -20, scale: 0.85 },
          { rotateX: 58, rotateZ: 140, scale: 1.08, duration: tl.duration(), ease: "none" },
          0,
        );
      });
    },
    { scope: root },
  );
  return (
    <section className="manifesto" id="manifesto" ref={root} aria-label="People, technology, growth together">
      <div className="manifesto-stage">
        <Backdrop3D variant="manifesto" />
        <div className="manifesto-orbits" aria-hidden="true">
          <i />
          <i />
          <i />
          <b />
        </div>
        <div className="manifesto-words">
          <span className="manifesto-word">People</span>
          <span className="manifesto-word">Technology</span>
          <span className="manifesto-word gold">Growth together</span>
        </div>
        <span className="manifesto-line" aria-hidden="true" />
      </div>
    </section>
  );
}

/** Scene 04: four course environments above the course cards. */
function LearningPaths() {
  const { t } = useTranslation();
  return (
    <section className="section container paths" id="courses">
      <SectionHeading
        eyebrow={t("programs")}
        title={t("programTitle")}
        description={t("programDescription")}
        action={
          <Link className="text-link" to="/courses">
            {t("allCourses")}
            <ArrowUpRight size={17} />
          </Link>
        }
      />
      <BookShelf />
    </section>
  );
}

/** Scene 07: tabs with their own visual treatment. */
const audiences = [
  {
    key: "student",
    tone: "tone-blue",
    title: "Build skills before graduation.",
    items: ["Start with the fundamentals", "Build a GitHub portfolio", "Prepare for your first interview"],
  },
  {
    key: "graduate",
    tone: "tone-gold",
    title: "Turn your degree into practical skills.",
    items: ["Follow a structured learning path", "Build a project you can show", "Strengthen your resume and interviews"],
  },
  {
    key: "professional",
    tone: "tone-cyan",
    title: "Upgrade without putting life on hold.",
    items: ["Explore flexible batch timings", "Learn professional workflows", "Plan your career transition"],
  },
];
function Audience() {
  const { t } = useTranslation();
  const [audience, setAudience] = useState(0);
  const a = audiences[audience];
  return (
    <section className="learning-section">
      <div className="container learning-grid">
        <Reveal className={`learning-photo ${a.tone}`}>
          <img
            src="/images/learning.jpg"
            alt="Stock photograph of professionals collaborating around a laptop"
            loading="lazy"
            width="1600"
            height="1068"
          />
          <div>
            <span>
              <Play size={16} />
            </span>
            <p>
              {t("live")}
              <strong>{t("handsOn")}</strong>
            </p>
          </div>
        </Reveal>
        <div>
          <p className="eyebrow">{t("learning")}</p>
          <h2>{t("audienceTitle")}</h2>
          <div className="audience-tabs" role="tablist" aria-label="Your starting point">
            {audiences.map((x, i) => (
              <button key={x.key} role="tab" aria-selected={audience === i} onClick={() => setAudience(i)}>
                {audience === i && <motion.span layoutId="audience-pill" className="audience-pill" />}
                <span>{t(x.key)}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={a.key}
              role="tabpanel"
              className={`audience-panel ${a.tone}`}
              initial={{ opacity: 0, y: 18, rotateX: -12 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <h3>{t(a.title)}</h3>
              <p>{t("audienceDescription")}</p>
              <ul className="check-list">
                {a.items.map((x, i) => (
                  <motion.li
                    key={x}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 + i * 0.08 }}
                  >
                    <Check size={17} />
                    {t(x)}
                  </motion.li>
                ))}
              </ul>
              <Link className="text-link" to="/contact">
                {t("mentor")}
                <ArrowUpRight size={17} />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { t } = useTranslation();
  return (
    <>
      <Hero />
      <Manifesto />
      <Services />
      <LearningPaths />
      {/* Scene 05: Salesforce flagship world */}
      <section className="container">
        <Reveal className="salesforce-feature sf-world">
          <World3D slug="salesforce" className="sf-world-scene" />
          <div className="sf-world-copy">
            <p className="eyebrow">{t("flagship")}</p>
            <h2>{t("sfTitle")}</h2>
            <p>{t("sfDescription")}</p>
            <div className="feature-points">
              <span>
                <Check />
                {t("handsOn")}
              </span>
              <span>
                <Check />
                Admin + Development + LWC
              </span>
            </div>
            <div className="sf-steps">
              {["Admin & Flow", "Apex & SOQL", "Lightning Web Components", "Testing & real projects"].map(
                (x, i) => (
                  <div key={x}>
                    <span>0{i + 1}</span>
                    {x}
                    <Check size={15} />
                  </div>
                ),
              )}
            </div>
            <small className="sf-world-note">ONE CONNECTED LEARNING PATH</small>
            <Button to="/courses/salesforce">{t("sfAction")}</Button>
          </div>
        </Reveal>
      </section>
      {/* Scene 06: the CloudLight difference */}
      <section className="section container difference">
        <SectionHeading eyebrow={t("why")} title={t("whyTitle")} description={t("whyDescription")} />
        <Benefits />
      </section>
      <Audience />
      {/* Scene 08: learning roadmap */}
      <section className="section container" id="salesforce-roadmap">
        <SectionHeading eyebrow="THE SALESFORCE ROADMAP" title="Your path from Admin to Apex to LWC." />
        <Roadmap steps={roadmapSteps(courses[0].slug, courses[0].roadmap)} />
      </section>
      {/* Scene 09: projects */}
      <section className="projects-section">
        <Backdrop3D variant="projects" />
        <div className="container section">
          <SectionHeading
            eyebrow="LESS THEORY. MORE ‘I MADE THIS.’"
            title={t("projectTitle")}
            description={t("projectDescription")}
            action={
              <Link className="text-link" to="/projects">
                {t("projects")}
                <ArrowUpRight size={17} />
              </Link>
            }
          />
          <ProjectCards limit={4} />
          <p className="illustrative-note">
            These are proposed curriculum projects and illustrative interface previews, not deployed customer
            applications or verified student work.
          </p>
        </div>
      </section>
      {/* Scene 10: final CTA */}
      <CTA scene />
    </>
  );
}
