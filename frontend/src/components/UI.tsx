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
    <div className="section-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {description && <p className="section-description">{description}</p>}
      </div>
      {action}
    </div>
  );
}
export function CourseCards() {
  const { t } = useTranslation();
  return (
    <div className="course-grid">
      {courses.map((c, i) => {
        const Icon = courseIcons[i];
        return (
          <Reveal key={c.slug} className={`course-card course-${i}`}>
            <div className="course-card-top">
              <span className="course-icon">
                <Icon size={28} />
              </span>
              {i === 0 && <span className="tag">{t("flagship")}</span>}
              <span className="course-number">0{i + 1}</span>
            </div>
            <p className="course-category">{c.category}</p>
            <h3>{c.title}</h3>
            <p>{t(`courseDesc.${c.slug}`, { defaultValue: c.description })}</p>
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
          </Reveal>
        );
      })}
    </div>
  );
}
export function CTA() {
  const { t } = useTranslation();
  return (
    <section className="container">
      <div className="cta-panel">
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
        <Reveal key={title} className="benefit">
          <span className="benefit-icon">
            <Icon size={23} />
          </span>
          <h3>{t(`benefit.${i}.title`, { defaultValue: title })}</h3>
          <p>{t(`benefit.${i}.body`, { defaultValue: copy })}</p>
        </Reveal>
      ))}
    </div>
  );
}
export { default as Roadmap } from "./ScrollRoadmap";
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
          <ProjectPreview index={i} />
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
