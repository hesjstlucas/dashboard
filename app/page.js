import { TLRPMark } from "@/components/tlrp-mark";

const featureCards = [
  {
    title: "Scene-First Roleplay",
    description:
      "Every patrol is built around believable reactions, clear pacing, and staff who care more about quality than chaos."
  },
  {
    title: "Welcoming Onboarding",
    description:
      "New players get structure without feeling boxed in, which makes it easier to learn server expectations fast."
  },
  {
    title: "Organized Staff Flow",
    description:
      "Applications, announcements, and internal systems are laid out cleanly so members always know where to go next."
  },
  {
    title: "Flexible Department Design",
    description:
      "Law enforcement, fire, communications, and civilian paths all fit together instead of fighting each other."
  },
  {
    title: "Original TLRP Identity",
    description:
      "The page, wording, and branding are custom-built around TLRP so the site feels like your own project."
  },
  {
    title: "Built To Launch",
    description:
      "This layout is ready to be pushed to GitHub, customized further, and connected to your real Discord and rules."
  }
];

const standards = [
  {
    title: "Respect the scene",
    description: "Give other players room to contribute and keep interactions focused on collaborative storytelling."
  },
  {
    title: "Keep it believable",
    description: "Treat emergencies, pursuits, and investigations like they matter so scenes feel grounded and worth joining."
  },
  {
    title: "Follow direction quickly",
    description: "When staff step in, respond cleanly and move forward so the server stays smooth for everyone involved."
  }
];

const departments = [
  {
    name: "Law Enforcement",
    summary: "Structured patrols, clean traffic stops, and coordinated response standards."
  },
  {
    name: "Fire & Rescue",
    summary: "Medical calls, fire scenes, and teamwork-heavy moments that create variety across the city."
  },
  {
    name: "Civilian Operations",
    summary: "Business ideas, street-level stories, and creative scenes that help the world feel lived in."
  },
  {
    name: "Staff & Communications",
    summary: "Support, moderation, and dispatch-style structure that keeps the larger experience moving."
  }
];

const highlightStats = [
  { value: "Original", label: "brand direction" },
  { value: "4 lanes", label: "department focus" },
  { value: "Scene-led", label: "community style" }
];

export default function HomePage() {
  return (
    <div className="landing-page" id="top">
      <section className="hero-section">
        <div className="hero-copy">
          <div className="hero-kicker">Structured ER:LC roleplay</div>
          <h1>Build a TLRP homepage that feels polished, original, and ready to launch.</h1>
          <p className="hero-description">
            This design keeps the serious roleplay energy from your reference while changing the layout, wording, and
            brand treatment so it stands on its own as a custom TLRP site.
          </p>
          <div className="hero-actions">
            <a className="marketing-button marketing-button-primary" href="#discord">
              Join Discord
            </a>
            <a className="marketing-button marketing-button-secondary" href="#rules">
              Read Standards
            </a>
          </div>
          <div className="hero-stats">
            {highlightStats.map((stat) => (
              <div className="hero-stat" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-visual-glow hero-visual-glow-left" />
          <div className="hero-visual-glow hero-visual-glow-right" />
          <div className="hero-monogram">TLRP</div>
          <div className="hero-brand-card">
            <TLRPMark showText />
            <p>Custom identity for your server landing page.</p>
          </div>
          <div className="hero-note hero-note-top">
            <span className="note-label">Approach</span>
            <strong>Fresh copy, same energy</strong>
          </div>
          <div className="hero-note hero-note-bottom">
            <span className="note-label">Style</span>
            <strong>Dark, clean, and launch-ready</strong>
          </div>
        </div>
      </section>

      <section className="marketing-section" id="why">
        <div className="section-heading">
          <span className="section-tag">Why TLRP</span>
          <h2>A custom landing page that captures the vibe without copying the source.</h2>
          <p>
            The structure stays familiar and easy to navigate, but the wording, cards, brand mark, and composition are
            rewritten so the site feels like its own project.
          </p>
        </div>
        <div className="marketing-grid marketing-grid-three">
          {featureCards.map((card) => (
            <article className="marketing-card" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="marketing-section marketing-section-split" id="rules">
        <div className="section-heading">
          <span className="section-tag">Rules</span>
          <h2>Clear standards keep the roleplay strong.</h2>
          <p>
            Instead of filling the page with copied wording, this section gives you original baseline standards you can
            expand into your full rules later.
          </p>
        </div>
        <div className="rule-list">
          {standards.map((rule, index) => (
            <article className="rule-card" key={rule.title}>
              <span className="rule-number">0{index + 1}</span>
              <div>
                <h3>{rule.title}</h3>
                <p>{rule.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="marketing-section" id="departments">
        <div className="section-heading">
          <span className="section-tag">Departments</span>
          <h2>Shape the city around departments that actually support each other.</h2>
          <p>
            These blocks give you a starting point for your main divisions and can be swapped with your real department
            names at any time.
          </p>
        </div>
        <div className="marketing-grid marketing-grid-two">
          {departments.map((department) => (
            <article className="department-card" key={department.name}>
              <div className="department-chip">{department.name}</div>
              <p>{department.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="marketing-section" id="discord">
        <div className="discord-panel">
          <div className="discord-copy">
            <span className="section-tag">Discord</span>
            <h2>Hook this into your real invite and you are ready to publish.</h2>
            <p>
              The site is already wired with a clean call-to-action area. Swap the placeholder invite below with your
              real Discord link when you are ready to put it on GitHub and deploy it.
            </p>
          </div>
          <div className="discord-cta">
            <a className="marketing-button marketing-button-primary" href="https://discord.gg/yourinvite">
              discord.gg/yourinvite
            </a>
            <span className="discord-hint">Replace this placeholder with your actual server invite.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
