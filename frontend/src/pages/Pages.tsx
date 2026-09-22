import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Search,
  ChevronRight,
  Check,
  Users,
  BookOpen,
  GitPullRequest,
  Briefcase,
} from "lucide-react";
import { courses, faqs, learningSteps, site, track } from "../data/site";
import {
  Button,
  SectionHeading,
  CourseCards,
  CTA,
  Benefits,
  Roadmap,
  ProjectCards,
  ProjectPreview,
} from "../components/UI";
import { CodeWindow } from "./Home";
function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="page-hero">
      <div className="container">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
    </section>
  );
}
export function FAQList({ short = false }: { short?: boolean }) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const items = (short ? faqs.slice(0, 5) : faqs).filter(
    (f) =>
      (category === "All" || f.category === category) &&
      `${t(f.q)} ${t(f.a)}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      {!short && (
        <div className="faq-tools">
          <label className="search-input">
            <Search size={18} />
            <input
              aria-label={t("faqSearch")}
              placeholder={t("faqSearch")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <select
            aria-label="FAQ category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {["All", ...new Set(faqs.map((f) => f.category))].map((c) => (
              <option key={c} value={c}>
                {c === "All" ? t("all") : t(c)}
              </option>
            ))}
          </select>
        </div>
      )}
      {items.map((f) => (
        <details className="accordion" key={f.q}>
          <summary>
            {t(f.q)}
            <Plus size={18} />
          </summary>
          <p>{t(f.a)}</p>
        </details>
      ))}
      {!items.length && <p className="empty-state">{t("noResults")}</p>}
    </>
  );
}
function Course({ slug }: { slug: string }) {
  const { t } = useTranslation();
  const c = courses.find((c) => c.slug === slug);
  useEffect(() => {
    if (c) track("course_view", { course: c.slug });
  }, [c]);
  if (!c) return <NotFound />;
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">{t("home")}</Link>
            <ChevronRight size={12} />
            <Link to="/courses">{t("courses")}</Link>
            <ChevronRight size={12} />
            <span>{c.title}</span>
          </div>
          <p className="eyebrow">
            {c.slug === "salesforce" ? t("flagship") : c.category}
          </p>
          <h1>{t(`courseHeadline.${c.slug}`, { defaultValue: c.headline })}</h1>
          <p>{t(`courseDesc.${c.slug}`, { defaultValue: c.description })}</p>
          <div className="tech-chips">
            {c.technologies.map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
          <a className="button" href="#curriculum">
            {t("curriculum")} ↓
          </a>
          <Button secondary to={`/contact?course=${c.slug}&source=${c.slug}`}>
            {t("mentor")}
          </Button>
        </div>
      </section>
      <section className="section container course-layout">
        <div>
          <SectionHeading
            eyebrow={c.title}
            title={t("curriculum")}
            description={t("courseCurriculumIntro", {
              defaultValue:
                "A connected path from the fundamentals to professional practice. Open each module to see what you will learn.",
            })}
          />
          <div id="curriculum" style={{ scrollMarginTop: 110 }}>
            {c.modules.map((m, i) => (
              <details
                className="accordion"
                key={m.title}
                open={i === 0 ? true : undefined}
              >
                <summary>
                  <span>
                    <span className="module-number">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {m.title}
                  </span>
                  <Plus size={18} />
                </summary>
                <ul className="topics">
                  {m.topics.map((topic, j) => (
                    <li key={`${topic}-${j}`}>{topic}</li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </div>
        <aside className="course-sidebar">
          <h3>{t("designedFor")}</h3>
          <ul className="check-list">
            {["student", "graduate", "professional", "switcher"].map((a) => (
              <li key={a}>
                <Check size={15} />
                {t(a)}
              </li>
            ))}
          </ul>
          <h3>{t("prerequisites")}</h3>
          {c.prerequisites.map((p) => (
            <p key={p}>{t(p)}</p>
          ))}
          <p>{t("fees")}</p>
          <Button to={`/contact?course=${c.slug}`}>{t("enquire")}</Button>
        </aside>
      </section>
      <section className="projects-section">
        <div className="section container">
          <SectionHeading
            eyebrow={c.title}
            title={t("projectTitle")}
            description={c.project.problem}
          />
          <div className="content-grid">
            <ProjectPreview index={courses.indexOf(c)} />
            <div>
              <p className="eyebrow">{t("sampleProject")}</p>
              <h3>{c.project.title}</h3>
              <ul className="check-list">
                {[
                  "Plan the requirements",
                  "Build and test the solution",
                  "Review, improve and present your work",
                ].map((x) => (
                  <li key={x}>
                    <Check size={17} />
                    {t(x)}
                  </li>
                ))}
              </ul>
              <Link className="text-link" to={`/projects?project=${c.slug}`}>
                {t("viewProject")} →
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="section container">
        <SectionHeading eyebrow={c.title} title={t("roadmap")} />
        <Roadmap items={c.roadmap} />
      </section>
      <section className="container">
        <SectionHeading title={t("faq")} />
        <FAQList short />
      </section>
      <CTA />
    </>
  );
}
function Projects() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const selected = courses.find((c) => c.slug === params.get("project"));
  return (
    <>
      <PageHero
        eyebrow={t("projects")}
        title={t("projectTitle")}
        description={t("projectDescription")}
      />
      <section className="section container">
        {selected && (
          <article className="project-detail">
            <p className="eyebrow">
              {t("projectBrief")} · {selected.title}
            </p>
            <h2>{selected.project.title}</h2>
            <p>{selected.project.problem}</p>
            <h3>{t("skills")}</h3>
            <div className="tech-chips">
              {selected.technologies.map((x) => (
                <span key={x}>{x}</span>
              ))}
            </div>
            <p>
              {t("projectProcess", {
                defaultValue:
                  "Start with a problem statement and user stories. Design the solution, build it in small increments, review your work with a mentor, test edge cases and present a documented portfolio project.",
              })}
            </p>
            <Button to={`/courses/${selected.slug}`}>{t("readMore")}</Button>
          </article>
        )}
        <ProjectCards />
        <p className="notice">
          {t("projectDisclosure", {
            defaultValue:
              "These are proposed curriculum projects and illustrative interface previews, not deployed customer applications or verified student work.",
          })}
        </p>
      </section>
      <CTA />
    </>
  );
}
function About() {
  const { t } = useTranslation();
  return (
    <>
      <PageHero
        eyebrow={t("about")}
        title={t("aboutHeadline", {
          defaultValue: "Learn from people who build real software.",
        })}
        description={t("footer")}
      />
      <section className="section container content-grid">
        <div className="prose">
          <h2>
            {t("aboutPurpose", {
              defaultValue: "Practical skills. A clearer direction.",
            })}
          </h2>
          <p>
            {t("aboutBody", {
              defaultValue:
                "CloudByteLabs is built around a simple idea: learning technology should prepare you to use it. Our programs connect fundamentals to the decisions, tools and workflows used in real development.",
            })}
          </p>
          <p>
            {t("aboutBody2", {
              defaultValue:
                "Whether you are studying, graduating or changing careers, the goal is meaningful progress: understand the concepts, practise them, build a project and learn from feedback.",
            })}
          </p>
          <Button to="/how-we-teach">{t("teaching")}</Button>
        </div>
        <img
          src="/images/learning.jpg"
          alt="Illustrative stock photograph of a team discussing a laptop project"
          width="1600"
          height="1068"
          loading="lazy"
        />
      </section>
      <section className="container">
        <Benefits />
      </section>
      <CTA />
    </>
  );
}
function Teaching() {
  const { t } = useTranslation();
  return (
    <>
      <PageHero
        eyebrow={t("teaching")}
        title={t("teachingHeadline", {
          defaultValue: "More than just online classes.",
        })}
        description={t("whyDescription")}
      />
      <section className="section container">
        <SectionHeading title={t("journeyTitle")} />
        <Roadmap items={learningSteps} />
      </section>
      <section className="projects-section">
        <div className="section container content-grid">
          <div>
            <p className="eyebrow">{t("why")}</p>
            <h2>
              {t("syntaxHeadline", {
                defaultValue: "We teach more than syntax.",
              })}
            </h2>
            <ul className="check-list">
              {[
                "Understand the problem before writing code",
                "Design and build a maintainable solution",
                "Debug, test and review your work",
                "Improve, document and deploy",
              ].map((x) => (
                <li key={x}>
                  <Check size={18} />
                  {t(x)}
                </li>
              ))}
            </ul>
            <Button to="/courses">{t("explore")}</Button>
          </div>
          <CodeWindow />
        </div>
      </section>
      <section className="section container">
        <Benefits />
      </section>
      <CTA />
    </>
  );
}
function Career() {
  const { t } = useTranslation();
  const icons = [BookOpen, GitPullRequest, Users, Briefcase];
  return (
    <>
      <PageHero
        eyebrow={t("career")}
        title={t("careerHeadline", {
          defaultValue: "Build the confidence to take your next step.",
        })}
        description={t("careerDescription", {
          defaultValue:
            "Practical training, a portfolio you can explain and thoughtful guidance for your career journey.",
        })}
      />
      <section className="section container">
        <div className="mentor-grid">
          {[
            "Resume & portfolio",
            "Project storytelling",
            "Mock interviews",
            "Career guidance",
          ].map((x, i) => {
            const Icon = icons[i];
            return (
              <div className="mentor-card" key={x}>
                <Icon />
                <h3>{t(x)}</h3>
                <p>
                  {t(
                    [
                      "Present your skills and projects clearly with a focused resume, GitHub profile or design portfolio.",
                      "Learn to explain your decisions, tradeoffs and contribution to a project.",
                      "Practise technical questions and communicate your thought process with mentor feedback.",
                      "Explore suitable roles, identify gaps and plan a practical next step.",
                    ][i],
                  )}
                </p>
              </div>
            );
          })}
        </div>
        <p className="notice">
          {t("careerDisclaimer", {
            defaultValue:
              "Career support prepares you for opportunities. We do not promise employment, placements, salary outcomes or guaranteed certification.",
          })}
        </p>
      </section>
      <CTA />
    </>
  );
}
function Trainers() {
  const { t } = useTranslation();
  return (
    <>
      <PageHero
        eyebrow={t("trainers")}
        title={t("trainerHeadline", {
          defaultValue: "A mentor, not just a lesson.",
        })}
        description={t("trainerDescription", {
          defaultValue:
            "Our teaching approach brings practical development, thoughtful reviews and real project context into every learning path.",
        })}
      />
      <section className="section container">
        <div className="mentor-grid">
          {courses.map((c) => (
            <article key={c.slug} className="mentor-card">
              <Users />
              <h3>{c.title} mentorship</h3>
              <p>{c.technologies.join(" · ")}</p>
              <p>
                {t("mentorFocus", {
                  defaultValue:
                    "Guided practice, project reviews and interview preparation tailored to your learning path.",
                })}
              </p>
              <Link to={`/contact?course=${c.slug}`} className="text-link">
                {t("mentor")} ↗
              </Link>
            </article>
          ))}
        </div>
        <p className="notice">
          {t("trainerDisclosure", {
            defaultValue:
              "Individual trainer names, photographs, experience and professional profile links will be published after approval. Talk to the team to meet the mentor for your program.",
          })}
        </p>
      </section>
      <CTA />
    </>
  );
}
function Testimonials() {
  const { t } = useTranslation();
  return (
    <>
      <PageHero
        eyebrow={t("testimonials")}
        title={t("storiesHeadline", {
          defaultValue: "Real work speaks for itself.",
        })}
        description={t("storiesDescription", {
          defaultValue:
            "Explore the work our learning paths are designed to help you build.",
        })}
      />
      <section className="section container">
        <p className="notice">
          {t("storiesDisclosure", {
            defaultValue:
              "Verified learner stories are being collected. We only publish testimonials with the learner’s permission and do not invent reviews or results.",
          })}
        </p>
        <ProjectCards limit={2} />
      </section>
      <CTA />
    </>
  );
}
function Legal({ terms = false }: { terms?: boolean }) {
  const { t } = useTranslation();
  return (
    <>
      <PageHero
        eyebrow="CloudByteLabs"
        title={t(terms ? "terms" : "privacy")}
        description={
          terms
            ? "How to use this website and enquire about training."
            : "What happens to the information you share with us."
        }
      />
      <section className="section container prose">
        {terms ? (
          <>
            <h2>Website and course information</h2>
            <p>
              This website describes intended learning paths. Confirm fees,
              availability, session schedules, trainers, delivery arrangements
              and enrollment terms with CloudByteLabs before making a payment.
              This site does not collect payments.
            </p>
            <h2>Career support</h2>
            <p>
              Learning and career preparation do not guarantee employment,
              salaries or certification. Third-party examinations and
              certification fees are separate unless expressly agreed in
              writing.
            </p>
            <h2>Use of content</h2>
            <p>
              Course descriptions and educational examples are provided for
              information. Do not misuse enquiry forms, interfere with the
              website or submit someone else’s personal information without
              permission.
            </p>
            <h2>Contact details</h2>
            <p>
              Email and address fields marked as demo data are temporary. For
              current information, call{" "}
              <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>.
            </p>
          </>
        ) : (
          <>
            <h2>Enquiries and contact information</h2>
            <p>
              When you request a callback, we receive your name, email, phone
              number, course interests, learning profile, preferred timing,
              message and consent. We use these details to respond to your
              enquiry. Please avoid submitting sensitive information.
            </p>
            <h2>Storage and retention</h2>
            <p>
              Enquiries are stored by the website operator. In the local
              development version, they are stored in a file on the development
              computer. A configured deployment can store them in MongoDB. The
              operator should restrict access and remove enquiries when they are
              no longer needed. Contact us to request access, correction or
              deletion.
            </p>
            <h2>Course assistant</h2>
            <p>
              Conversation history is kept only in the current page session and
              is not permanently saved by this website. If the AI service is
              configured, your message and recent conversation context are sent
              to that provider to generate a response. Avoid sharing personal or
              sensitive information in chat.
            </p>
            <h2>Preferences and analytics</h2>
            <p>
              Your language choice is saved in your browser. Optional Google
              Analytics runs only when it is configured and you accept
              analytics. Without consent, analytics events are not sent to
              Google. You can reset your analytics preference using the control
              below.
            </p>
            <button
              className="button secondary"
              onClick={() => {
                localStorage.removeItem("cloudbyte-analytics");
                window.location.reload();
              }}
            >
              Reset analytics preference
            </button>
            <h2>Third-party services</h2>
            <p>
              WhatsApp links open an external service governed by its own
              privacy policy. Calling uses your device’s telephone application.
              The site uses Google Fonts and may use a configured email service
              for enquiry notifications. No payment details are collected.
            </p>
            <h2>Contact</h2>
            <p>
              For a privacy request, call{" "}
              <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>. The demo
              email and address must be replaced before public launch.
            </p>
          </>
        )}
      </section>
    </>
  );
}
function NotFound() {
  const { t } = useTranslation();
  return (
    <section className="container not-found">
      <span>404</span>
      <h1>{t("notFound")}</h1>
      <p>{t("notFoundBody")}</p>
      <Button to="/">{t("back")}</Button>
    </section>
  );
}
export default function Pages() {
  const location = useLocation();
  const pathname = location.pathname.replace(/\/$/, "") || "/";
  const { t } = useTranslation();
  let page;
  if (/^\/courses\/[^/]+$/.test(pathname))
    page = <Course key={pathname} slug={pathname.split("/")[2]} />;
  else
    switch (pathname) {
      case "/courses":
        page = (
          <>
            <PageHero
              eyebrow={t("programs")}
              title={t("programTitle")}
              description={t("programDescription")}
            />
            <section className="section container">
              <CourseCards />
            </section>
            <CTA />
          </>
        );
        break;
      case "/projects":
        page = <Projects />;
        break;
      case "/about":
        page = <About />;
        break;
      case "/how-we-teach":
        page = <Teaching />;
        break;
      case "/career-support":
        page = <Career />;
        break;
      case "/trainers":
        page = <Trainers />;
        break;
      case "/testimonials":
        page = <Testimonials />;
        break;
      case "/faq":
        page = (
          <>
            <PageHero
              eyebrow={t("support")}
              title={t("faq")}
              description={t("ctaDescription")}
            />
            <section className="section container prose">
              <FAQList />
            </section>
            <CTA />
          </>
        );
        break;
      case "/privacy":
        page = <Legal />;
        break;
      case "/terms":
        page = <Legal terms />;
        break;
      default:
        page = <NotFound />;
    }
  return (
    <div className="page-enter" key={pathname}>
      {page}
    </div>
  );
}
