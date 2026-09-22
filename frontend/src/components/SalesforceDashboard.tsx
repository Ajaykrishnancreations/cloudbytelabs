import { useState } from "react";
import {
  Cloud,
  LayoutDashboard,
  Users,
  Workflow,
  Search,
  Bell,
  ChevronDown,
  Check,
  ArrowUpRight,
  ShieldCheck,
  Code2,
} from "lucide-react";
const records = {
  Overview: [
    ["Acme Support", "New customer onboarding", "In progress"],
    ["Northstar Labs", "Account access request", "Resolved"],
    ["Summit Services", "Priority case review", "In progress"],
  ],
  Cases: [
    ["CS-1042", "Customer onboarding", "In progress"],
    ["CS-1041", "Permission update", "Resolved"],
    ["CS-1040", "Follow-up automation", "Resolved"],
  ],
  Automation: [
    ["Case routing", "Record-triggered Flow", "Active"],
    ["Follow-up reminders", "Scheduled Flow", "Active"],
    ["Customer welcome", "Screen Flow", "Active"],
  ],
};
export default function SalesforceDashboard() {
  const [tab, setTab] = useState<keyof typeof records>("Overview");
  return (
    <div className="sf-dashboard-scene">
      <div className="sf-cloud-label">
        <Cloud size={28} />
        <span>
          Salesforce<strong>Build on the cloud.</strong>
        </span>
      </div>
      <div className="sf-dashboard">
        <div className="sf-dash-top">
          <span className="sf-dash-brand">
            <Cloud size={23} /> Service workspace
          </span>
          <span className="sf-dash-tools">
            <Search size={15} />
            <Bell size={15} />
            <span>CB</span>
          </span>
        </div>
        <div className="sf-dash-app">
          <aside>
            <Cloud size={22} />
            <LayoutDashboard size={17} />
            <Users size={17} />
            <Workflow size={17} />
          </aside>
          <div className="sf-dash-main">
            <div className="sf-dash-title">
              <div>
                <span>YOUR FIRST SALESFORCE PROJECT</span>
                <h3>Customer success, connected.</h3>
              </div>
              <ShieldCheck size={22} />
            </div>
            <div
              className="sf-dash-tabs"
              role="tablist"
              aria-label="CRM dashboard preview"
            >
              {(Object.keys(records) as Array<keyof typeof records>).map(
                (x) => (
                  <button
                    key={x}
                    role="tab"
                    aria-selected={tab === x}
                    onClick={() => setTab(x)}
                  >
                    {x}
                  </button>
                ),
              )}
            </div>
            <div className="sf-dash-stats">
              <div>
                <span>Open cases</span>
                <strong>
                  24 <small>Demo</small>
                </strong>
              </div>
              <div>
                <span>Resolved</span>
                <strong>
                  86 <Check size={13} />
                </strong>
              </div>
              <div>
                <span>Active flows</span>
                <strong>
                  08 <Workflow size={14} />
                </strong>
              </div>
            </div>
            <div className="sf-dash-chart">
              <div>
                <strong>Service performance</strong>
                <span>
                  This week <ChevronDown size={10} />
                </span>
              </div>
              <div
                className="sf-bars"
                aria-label="Illustrative service performance chart"
              >
                {[42, 58, 48, 74, 65, 88, 79, 98, 89, 110, 94, 126].map(
                  (height, i) => (
                    <span key={i} style={{ height: `${height / 1.5}px` }} />
                  ),
                )}
              </div>
              <div className="sf-chart-days">
                <span>MON</span>
                <span>WED</span>
                <span>FRI</span>
                <span>SUN</span>
              </div>
            </div>
            <div
              className="sf-dash-records"
              role="tabpanel"
              aria-label={`${tab} preview`}
            >
              {records[tab].map(([name, detail, status]) => (
                <div key={name}>
                  <span className="sf-record-icon">
                    <Cloud size={13} />
                  </span>
                  <div>
                    <strong>{name}</strong>
                    <small>{detail}</small>
                  </div>
                  <span
                    className={`sf-record-status ${status === "In progress" ? "pending" : ""}`}
                  >
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="sf-dash-bottom">
          <span>
            <span className="small-dot" /> Illustrative training project ·
            sample data
          </span>
          <Code2 size={13} />
        </div>
      </div>
      <div className="sf-dash-badge sf-badge-flow">
        <Workflow size={19} />
        <div>
          <strong>Automate with Flow</strong>
          <span>From a task to a smarter workflow</span>
        </div>
      </div>
      <div className="sf-dash-badge sf-badge-lwc">
        <Code2 size={18} />
        <strong>Apex + LWC</strong>
        <ArrowUpRight size={15} />
      </div>
    </div>
  );
}
