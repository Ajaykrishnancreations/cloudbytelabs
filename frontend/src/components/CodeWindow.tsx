import { useState } from "react";
import { Code2 } from "lucide-react";
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
