"use client";

import { useEffect, useMemo, useState } from "react";
import { PageFrame } from "@/components/page-frame";
import { useDemo } from "@/components/demo-provider";
import { erlcCommandTemplates } from "@/lib/mock-data";

function ConnectionCard({ title, endpoint }) {
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    let mounted = true;
    fetch(endpoint, { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (mounted) {
          setState({ loading: false, data });
        }
      })
      .catch((error) => {
        if (mounted) {
          setState({ loading: false, error: error.message });
        }
      });
    return () => {
      mounted = false;
    };
  }, [endpoint]);

  return (
    <div className="panel stack">
      <div className="split">
        <div>
          <h3>{title}</h3>
          <p className="muted">
            {state.loading
              ? "Checking connection..."
              : state.data?.configured
                ? "Live integration detected."
                : "Demo response until environment variables are configured."}
          </p>
        </div>
        <span className={`badge ${state.data?.configured ? "ok" : "warn"}`}>
          {state.data?.configured ? "Live" : "Demo"}
        </span>
      </div>
      <pre className="muted compact-pre">
        {state.error ? state.error : JSON.stringify(state.data?.data ?? {}, null, 2)}
      </pre>
    </div>
  );
}

function CommandConsole() {
  const { currentUser, abilities } = useDemo();
  const [command, setCommand] = useState("");
  const [result, setResult] = useState("");

  const templates = useMemo(() => {
    const output = [];
    if (abilities.canRunModerationCommands) {
      output.push(...erlcCommandTemplates.moderation);
    }
    if (abilities.canRunAdminCommands) {
      output.push(...erlcCommandTemplates.administration);
    }
    return output;
  }, [abilities]);

  async function runCommand() {
    const response = await fetch("/api/erlc/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        command,
        audience: abilities.canRunAdminCommands ? "admin" : "moderation"
      })
    });
    const data = await response.json();
    setResult(data.result || data.error || JSON.stringify(data));
  }

  return (
    <div className="panel stack">
      <div className="split">
        <div>
          <h3>ER:LC Command Center</h3>
          <p className="muted">
            {currentUser.rankKey === "guest"
              ? "Sign in with Discord to unlock role-based command access."
              : "Available command templates are filtered by your TLRP rank."}
          </p>
        </div>
        <span className="badge ok">{currentUser.rankKey === "guest" ? "Locked" : "Ready"}</span>
      </div>
      <div className="chip-row">
        {templates.map((template) => (
          <button key={template.label} className="chip" onClick={() => setCommand(template.command)} type="button">
            {template.label}
          </button>
        ))}
      </div>
      <div className="toolbar">
        <input
          disabled={!templates.length}
          onChange={(event) => setCommand(event.target.value)}
          placeholder="Enter an ER:LC command"
          value={command}
        />
        <button disabled={!command} onClick={runCommand} type="button">
          Run command
        </button>
      </div>
      {result ? <div className="list-item">{result}</div> : null}
    </div>
  );
}

export function DashboardOverview() {
  const { visibleStaff, punishments, currentUser, sessionState } = useDemo();
  const linked = currentUser.id !== "guest";
  const activeCases = punishments.filter((entry) => entry.status === "Active").length;
  const averageGrade = Math.round(
    visibleStaff.reduce((total, member) => total + member.grade, 0) / visibleStaff.length
  );

  return (
    <PageFrame
      title="Staff Overview"
      description="A Melonly-inspired TLRP operations board with Discord-gated identities, ER:LC command tools, and rank-aware staff controls."
    >
      <section className="hero panel">
        <div>
          <div className="kicker">Linked Profile</div>
          <h3>{linked ? currentUser.displayName : "Sign in to reveal staff identities"}</h3>
          <p className="muted">
            {linked
              ? `Logged in with Discord as ${sessionState.session?.discordUser?.globalName || currentUser.displayName}.`
              : "Before Discord login, the portal keeps names hidden and only shows anonymous staff cards."}
          </p>
        </div>
        <div className="hero-badges">
          <span className="badge ok">{currentUser.rankKey === "guest" ? "Guest" : currentUser.rankKey}</span>
          <span className="badge warn">{linked ? "Roster linked" : "Roster hidden"}</span>
        </div>
      </section>

      <section className="grid cols-4">
        <div className="panel stat-card">
          <span className="kicker">Staff tracked</span>
          <strong>{visibleStaff.length}</strong>
          <span className="muted">Roster entries in the current dashboard state.</span>
        </div>
        <div className="panel stat-card">
          <span className="kicker">Average grade</span>
          <strong>{averageGrade}%</strong>
          <span className="muted">Overall staff gradebook average.</span>
        </div>
        <div className="panel stat-card">
          <span className="kicker">Active punishments</span>
          <strong>{activeCases}</strong>
          <span className="muted">Open strikes, suspensions, and infractions.</span>
        </div>
        <div className="panel stat-card">
          <span className="kicker">Your activity</span>
          <strong>{currentUser.activity}/10</strong>
          <span className="muted">Current activity score for the signed-in staff member.</span>
        </div>
      </section>

      <section className="grid cols-2">
        <CommandConsole />
        <div className="panel stack">
          <h3>Quick Access</h3>
          <div className="list">
            <div className="list-item">`/staff` for search and per-user overview cards.</div>
            <div className="list-item">`/grades` for score updates and leaderboard points.</div>
            <div className="list-item">`/punishments` for IA, Management, and Directive discipline actions plus Discord DMs.</div>
            <div className="list-item">`/guidelines` for Directive-only handbook editing.</div>
          </div>
        </div>
      </section>

      <section className="grid cols-2">
        <ConnectionCard endpoint="/api/erlc" title="ER:LC API" />
        <ConnectionCard endpoint="/api/discord" title="Discord API" />
      </section>
    </PageFrame>
  );
}
