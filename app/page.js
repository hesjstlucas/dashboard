import Link from "next/link";
import { DEPARTMENTS } from "@/lib/mock-data";

const standards = [
  "Realistic call handling with clear incident notes and roleplay-safe escalation.",
  "Player records attached to real player profiles added by staff.",
  "Separate dashboards for police, medical, DOT, and fire operations.",
  "Rank-gated controls for promotions, demotions, applications, records, and command tools."
];

const workflow = [
  {
    title: "Manual player intake",
    text: "Staff can add players directly to the searchable vault when a record or report needs to be created."
  },
  {
    title: "Department records",
    text: "Police, medical, DOT, and fire notes stay separate so a patient file never becomes a criminal file."
  },
  {
    title: "Command review",
    text: "Management and Directive ranks can promote, demote, approve applications, and review audit logs."
  }
];

export default function HomePage() {
  return (
    <div className="landing-page" id="top">
      <section className="home-hero">
        <div className="home-hero-copy">
          <div className="hero-kicker">Professional ER:LC roleplay operations</div>
          <h1>Paralix</h1>
          <p className="hero-description">
            A dark, realistic public website and operations portal for emergency roleplay departments,
            staff command, applications, manual 911 calls, player records, and rank-based dashboards.
          </p>
          <div className="hero-actions">
            <Link className="marketing-button marketing-button-primary" href="/portal">
              Open Portal
            </Link>
            <Link className="marketing-button marketing-button-secondary" href="/applications">
              Apply Now
            </Link>
          </div>
        </div>

        <div className="ops-snapshot" aria-label="Paralix operations snapshot">
          <div className="ops-snapshot-head">
            <span className="status-dot" />
            <strong>Command Snapshot</strong>
          </div>
          <div className="ops-row">
            <span>911 calls</span>
            <strong>Manual board</strong>
          </div>
          <div className="ops-row">
            <span>Player vault</span>
            <strong>Staff entered</strong>
          </div>
          <div className="ops-row">
            <span>Criminal records</span>
            <strong>Manual only</strong>
          </div>
          <div className="ops-row">
            <span>Rank controls</span>
            <strong>Management+</strong>
          </div>
        </div>
      </section>

      <section className="marketing-section" id="departments">
        <div className="section-heading">
          <span className="section-tag">Departments</span>
          <h2>Separate dashboards for every service line.</h2>
          <p>
            Each department has its own ranks, reports, member roster, and response view so your ER:LC
            community feels organized like a real agency.
          </p>
        </div>
        <div className="marketing-grid marketing-grid-four">
          {DEPARTMENTS.map((department) => (
            <article className="department-card" key={department.id} style={{ "--department-accent": department.accent }}>
              <div className="department-chip">{department.shortName}</div>
              <h3>{department.name}</h3>
              <p>{department.mission}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="marketing-section marketing-section-split" id="info">
        <div className="section-heading">
          <span className="section-tag">Info</span>
          <h2>Built around serious records, not random labels.</h2>
          <p>
            The police side never invents criminals. Criminal records only appear when an authorized
            staff member manually adds a report to a real player profile.
          </p>
        </div>
        <div className="rule-list">
          {standards.map((standard, index) => (
            <article className="rule-card" key={standard}>
              <span className="rule-number">0{index + 1}</span>
              <p>{standard}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="marketing-section" id="apply">
        <div className="section-heading">
          <span className="section-tag">Workflow</span>
          <h2>From public application to department command.</h2>
          <p>
            Applicants can submit department requests, command can review them, and accepted members
            can be managed through department rank tools.
          </p>
        </div>
        <div className="marketing-grid marketing-grid-three">
          {workflow.map((item) => (
            <article className="marketing-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
