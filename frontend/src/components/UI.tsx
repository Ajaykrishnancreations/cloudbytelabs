import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  Cloud,
  Code2,
  PenTool,
  Terminal,
  Check,
  Layers,
  GitPullRequest,
  Users,
  Clock3,
  Braces,
  GraduationCap,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Tilt from "../motion/Tilt";
import { Final3D } from "../three/Scenes";
import { courses, track } from "../data/site";
export const courseIcons = [Cloud, Code2, PenTool, Terminal];
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.07 }}
      transition={{ duration: 0.45 }}
    >
      {children}
    </motion.div>
  );
}
export function Button({
  to,
  children,
  secondary = false,
  className = "",
}: {
  to: string;
  children: ReactNode;
  secondary?: boolean;
  className?: string;
}) {
  return (
    <Link
      className={`button ${secondary ? "secondary" : ""} ${className}`}
      to={to}
    >
      {children}
      <ArrowUpRight size={17} />
    </Link>
  );
}
const rise = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] as const },
  },
};
export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <motion.div
      className="section-heading"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={{ show: { transition: { staggerChildren: 0.1 } } }}
    >
      <div>
        {eyebrow && (
          <motion.p className="eyebrow" variants={rise}>
            {eyebrow}
          </motion.p>
        )}
        <motion.h2 variants={rise}>{title}</motion.h2>
        {description && (
          <motion.p className="section-description" variants={rise}>
            {description}
          </motion.p>
        )}
      </div>
      {action && <motion.div variants={rise}>{action}</motion.div>}
    </motion.div>
  );
}
export function CourseCards({
  onHover,
}: {
  onHover?: (i: number | null) => void;
} = {}) {
  const { t } = useTranslation();
  return (
    <div className="course-grid">
      {courses.map((c, i) => {
        const Icon = courseIcons[i];
        return (
          <Reveal key={c.slug} className="course-reveal">
            <Tilt
              className={`course-card course-${i}`}
              max={7}
              onHover={(on) => onHover?.(on ? i : null)}
            >
              <div className="course-card-top">
                <span className="course-icon">
                  <Icon size={28} />
                </span>
                {i === 0 && <span className="tag">{t("flagship")}</span>}
                <span className="course-number">0{i + 1}</span>
              </div>
              <p className="course-category">{c.category}</p>
              <h3>{c.title}</h3>
              <p>
                {t(`courseDesc.${c.slug}`, { defaultValue: c.description })}
              </p>
              <div className="tech-chips">
                {c.technologies.slice(0, 4).map((x) => (
                  <span key={x}>{x}</span>
                ))}
              </div>
              <Link
                onClick={() => track("course_cta_click", { course: c.slug })}
                className="card-link"
                to={`/courses/${c.slug}`}
              >
                {t("readMore")}
                <ArrowUpRight size={18} />
              </Link>
            </Tilt>
          </Reveal>
        );
      })}
    </div>
  );
}
export function CTA({ scene = false }: { scene?: boolean }) {
  const { t } = useTranslation();
  return (
    <section className="container">
      <div className={`cta-panel cta-portal ${scene ? "has-scene" : ""}`}>
        {scene ? (
          <Final3D />
        ) : (
          <div className="portal-rings" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        )}
        <div>
          <p className="eyebrow">LET’S MAKE IT HAPPEN</p>
          <h2>{t("ctaTitle")}</h2>
          <p>{t("ctaDescription")}</p>
        </div>
        <Button to="/contact">{t("mentor")}</Button>
      </div>
    </section>
  );
}
export function Benefits() {
  const { t } = useTranslation();
  const items = [
    [
      "Industry professionals",
      "Learn with mentors who bring practical development workflows into the classroom.",
      Users,
    ],
    [
      "Real-world projects",
      "Turn requirements into applications you can explain and confidently demonstrate.",
      Layers,
    ],
    [
      "Practical coding",
      "Build, debug and test. Develop the habits that make you a stronger developer.",
      Braces,
    ],
    [
      "Thoughtful code reviews",
      "Understand the why behind cleaner, more maintainable code.",
      GitPullRequest,
    ],
    [
      "Flexible learning",
      "Find a learning rhythm around your studies or your work.",
      Clock3,
    ],
    [
      "Career guidance",
      "Prepare your portfolio, practise interviews and plan your next step.",
      GraduationCap,
    ],
  ] as const;
  return (
    <div className="benefit-grid">
      {items.map(([title, copy, Icon], i) => (
        <Reveal key={title} className="benefit-reveal">
          <Tilt className="benefit" max={8}>
            <span className="benefit-icon">
              <Icon size={23} />
            </span>
            <h3>{t(`benefit.${i}.title`, { defaultValue: title })}</h3>
            <p>{t(`benefit.${i}.body`, { defaultValue: copy })}</p>
          </Tilt>
        </Reveal>
      ))}
    </div>
  );
}
export { default as Roadmap } from "./FlowRoadmap";
export function ProjectPreview({ index = 0 }: { index?: number }) {
  return (
    <div className={`project-preview preview-${index}`} aria-hidden="true">
      <div className="mock-toolbar">
        <span />
        <span />
        <span />
        <div>
          cloudlight /{" "}
          {["service-hub", "storefront", "design-studio", "automate"][index]}
        </div>
      </div>
      <div className="mock-body">
        <div className="mock-sidebar">
          <Cloud size={18} />
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="mock-content">
          <strong>
            {
              [
                "Service workspace",
                "Built for everyday",
                "A little more focus.",
                "Make work flow.",
              ][index]
            }
          </strong>
          <div className="mock-stats">
            {["Overview", "Activity", "Progress"].map((x, i) => (
              <div key={x}>
                <small>{x}</small>
                <span className={`mock-bar bar-${i}`} />
              </div>
            ))}
          </div>
          <div className="mock-chart">
            {[35, 55, 43, 73, 60, 85, 75, 95, 83].map((x, i) => (
              <span key={i} style={{ height: `${x}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export function ProjectCards({ limit = 4 }: { limit?: number }) {
  const { t } = useTranslation();
  return (
    <div className="project-grid">
      {courses.slice(0, limit).map((c, i) => (
        <Reveal className="project-card" key={c.slug}>
          <Tilt className="project-tilt" max={6}>
            <ProjectPreview index={i} />
          </Tilt>
          <div className="project-copy">
            <p className="eyebrow">{c.title}</p>
            <h3>{c.project.title}</h3>
            <p>
              {t(`projectDesc.${c.slug}`, { defaultValue: c.project.problem })}
            </p>
            <Link className="text-link" to={`/projects?project=${c.slug}`}>
              {t("viewProject")}
              <ArrowRight size={17} />
            </Link>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
