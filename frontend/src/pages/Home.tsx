import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowUpRight,
  Check,
  Code2,
  Cloud,
  Terminal,
  PenTool,
  Play,
  Radio,
  GitPullRequest,
  Braces,
} from "lucide-react";
import {
  Reveal,
  Button,
  SectionHeading,
  CourseCards,
  Benefits,
  Roadmap,
  ProjectCards,
  CTA,
} from "../components/UI";
import { courses } from "../data/site";
import SalesforceDashboard from "../components/SalesforceDashboard";
export function CodeWindow() {
  const [tab, setTab] = useState("LWC");
  const samples: Record<string, string> = {
    LWC: "import { LightningElement } from 'lwc';\n\nexport default class YourNextChapter\n  extends LightningElement {\n  skills = ['build', 'test', 'grow'];\n\n  get readyForWhatIsNext() {\n    return this.skills.length > 0;\n  }\n}",
    React:
      "function YourNextChapter() {\n  const [skills, setSkills] = useState([]);\n\n  const keepBuilding = skill =>\n    setSkills(current => [...current, skill]);\n\n  return <LearningJourney skills={skills} />;\n}",
    Apex: "public with sharing class LearningPath {\n  public static List<Account> getCustomers() {\n    return [\n      SELECT Id, Name FROM Account\n      WITH USER_MODE\n      LIMIT 20\n    ];\n  }\n}",
    Node: "app.get('/api/journey', (req, res) => {\n  const nextChapter = {\n    learn: 'Something meaningful',\n    build: 'Something real',\n    become: 'Industry ready'\n  };\n\n  res.json(nextChapter);\n});",
    Python:
      "from dataclasses import dataclass\n\n@dataclass\nclass YourNextChapter:\n    learn: str = 'Python'\n    build: str = 'Real projects'\n\n    def start(self):\n        return f'Let’s build with {self.learn}'\n\njourney = YourNextChapter()",
  };
  return (
    <div className="code-window">
      <div className="code-header">
        <div className="window-dots">
          <i />
          <i />
          <i />
        </div>
        <span>
          your-next-chapter.
          {tab === "Python" ? "py" : tab === "Apex" ? "cls" : "js"}
        </span>
        <Code2 size={15} />
      </div>
      <div className="code-tabs" role="tablist" aria-label="Code examples">
        {Object.keys(samples).map((x) => (
          <button
            key={x}
            role="tab"
            aria-selected={tab === x}
            onClick={() => setTab(x)}
          >
            {x}
          </button>
        ))}
      </div>
      <pre role="tabpanel" aria-label={`${tab} example`}>
        {samples[tab].split("\n").map((line, i) => (
          <div className="code-line" key={i}>
            <span>{i + 1}</span>
            <code>
              {line
                .split(
                  /('.*?'|\b(?:import|from|export|default|class|extends|get|return|const|function|public|static|def|app|res)\b)/g,
                )
                .map((part, j) => (
                  <span
                    key={j}
                    className={
                      /^'/.test(part)
                        ? "code-string"
                        : /^(import|from|export|default|class|extends|get|return|const|function|public|static|def)$/.test(
                              part,
                            )
                          ? "code-keyword"
                          : ""
                    }
                  >
                    {part}
                  </span>
                ))}
            </code>
          </div>
        ))}
      </pre>
      <div className="code-footer">
        <span>
          <span className="small-dot" /> Learning by building
        </span>
        <span>UTF-8</span>
      </div>
    </div>
  );
}
export default function Home() {
  const { t } = useTranslation();
  const [audience, setAudience] = useState(0);
  return (
    <>
      <section className="hero">
        <div className="hero-grid container">
          <div className="hero-copy">
            <p className="hero-eyebrow">
              <span /> {t("eyebrow")}
            </p>
            <h1>
              {t("hero1")}
              <br />
              {t("hero2")}
              <br />
              <span>{t("hero3")}</span>
            </h1>
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
          </div>
          <SalesforceDashboard />
        </div>
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
      <section className="section container" id="courses">
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
        <CourseCards />
      </section>
      <section className="container">
        <Reveal className="salesforce-feature">
          <div>
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
            <Button to="/courses/salesforce">{t("sfAction")}</Button>
          </div>
          <div className="sf-visual">
            <span className="sf-cloud">
              <Cloud size={67} />
              <strong>salesforce</strong>
            </span>
            <div className="sf-steps">
              {[
                "Admin & Flow",
                "Apex & SOQL",
                "Lightning Web Components",
                "Testing & real projects",
              ].map((x, i) => (
                <div key={x}>
                  <span>0{i + 1}</span>
                  {x}
                  <Check size={15} />
                </div>
              ))}
            </div>
            <small>ONE CONNECTED LEARNING PATH</small>
          </div>
        </Reveal>
      </section>
      <section className="section container">
        <SectionHeading
          eyebrow={t("why")}
          title={t("whyTitle")}
          description={t("whyDescription")}
        />
        <Benefits />
      </section>
      <section className="learning-section">
        <div className="container learning-grid">
          <div className="learning-photo">
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
          </div>
          <div>
            <p className="eyebrow">{t("learning")}</p>
            <h2>{t("audienceTitle")}</h2>
            <div
              className="audience-tabs"
              role="tablist"
              aria-label="Your starting point"
            >
              {["student", "graduate", "professional"].map((k, i) => (
                <button
                  key={k}
                  role="tab"
                  aria-selected={audience === i}
                  onClick={() => setAudience(i)}
                >
                  {t(k)}
                </button>
              ))}
            </div>
            <div role="tabpanel">
              <h3>
                {t(
                  [
                    "Build skills before graduation.",
                    "Turn your degree into practical skills.",
                    "Upgrade without putting life on hold.",
                  ][audience],
                )}
              </h3>
              <p>{t("audienceDescription")}</p>
              <ul className="check-list">
                {[
                  [
                    "Start with the fundamentals",
                    "Build a GitHub portfolio",
                    "Prepare for your first interview",
                  ],
                  [
                    "Follow a structured learning path",
                    "Build a project you can show",
                    "Strengthen your resume and interviews",
                  ],
                  [
                    "Explore flexible batch timings",
                    "Learn professional workflows",
                    "Plan your career transition",
                  ],
                ][audience].map((x) => (
                  <li key={x}>
                    <Check size={17} />
                    {t(x)}
                  </li>
                ))}
              </ul>
              <Link className="text-link" to="/contact">
                {t("mentor")}
                <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="section container" id="salesforce-roadmap">
        <SectionHeading
          eyebrow="THE SALESFORCE ROADMAP"
          title="Your path from Admin to Apex to LWC."
        />
        <Roadmap items={courses[0].roadmap} />
      </section>
      <section className="projects-section">
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
          <ProjectCards limit={2} />
        </div>
      </section>
      <CTA />
    </>
  );
}
