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
  const { abilities } = useDemo();
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
          <p className="muted">Available command templates are filtered by your currently linked staff rank.</p>
        </div>
        <span className="badge ok">Ready</span>
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
  const { visibleStaff, punishments, currentUser, activityFeed, shifts, integrations, liveStaffState } = useDemo();
  const activeCases = punishments.filter((entry) => entry.status === "Active").length;
  const gradedStaff = visibleStaff.filter((member) => typeof member.grade === "number");
  const averageGrade = gradedStaff.length
    ? Math.round(gradedStaff.reduce((total, member) => total + member.grade, 0) / gradedStaff.length)
    : null;

  return (
    <PageFrame
      title="Staff Overview"
      description="A Melonly-style TLRP operations board with staff modules, ER:LC command tools, activity tracking, and rank-aware controls."
    >
      <section className="hero panel">
        <div>
          <div className="kicker">Current Account</div>
          <h3>{currentUser.displayName}</h3>
          <p className="muted">
            {liveStaffState.configured
              ? "Live Discord staff data is connected. Missing values stay empty until a real source updates them."
              : "Connect Discord guild data to load the live staff roster instead of demo placeholders."}
          </p>
        </div>
        <div className="hero-badges">
          <span className="badge ok">{currentUser.rankKey}</span>
          <span className="badge warn">{currentUser.department}</span>
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
          <strong>{averageGrade === null ? "--" : `${averageGrade}%`}</strong>
          <span className="muted">Overall staff grade average from real recorded grade values.</span>
        </div>
        <div className="panel stat-card">
          <span className="kicker">Active punishments</span>
          <strong>{activeCases}</strong>
          <span className="muted">Open strikes, suspensions, and infractions.</span>
        </div>
        <div className="panel stat-card">
          <span className="kicker">Operator activity</span>
          <strong>{typeof currentUser.activity === "number" ? `${currentUser.activity}/10` : "--"}</strong>
          <span className="muted">Current activity score for the active Discord-linked account.</span>
        </div>
      </section>

      {liveStaffState.error ? (
        <div className="list-item notice-banner">Live Discord roster failed to load: {liveStaffState.error}</div>
      ) : null}

      <section className="grid cols-2">
        <CommandConsole />
        <div className="panel stack">
          <h3>Portal Snapshot</h3>
          <div className="list">
            {shifts.slice(0, 2).map((shift) => (
              <div className="list-item" key={shift.id}>
                <strong>{shift.name}</strong>
                <div className="muted">
                  {shift.window} | {shift.status} | {shift.seats}
                </div>
              </div>
            ))}
            {integrations.slice(0, 2).map((integration) => (
              <div className="list-item" key={integration.id}>
                <strong>{integration.title}</strong>
                <div className="muted">
                  {integration.status} | {integration.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid cols-2">
        <div className="panel stack">
          <h3>Recent Activity</h3>
          <div className="list">
            {activityFeed.length ? (
              activityFeed.slice(0, 4).map((item) => (
                <div className="list-item" key={item.id}>
                  <strong>{item.title}</strong>
                  <div className="muted">
                    {item.note} | {item.when}
                  </div>
                </div>
              ))
            ) : (
              <div className="list-item">No real activity entries have been recorded yet.</div>
            )}
          </div>
        </div>
        <div className="panel stack">
          <h3>Quick Routes</h3>
          <div className="list">
            <div className="list-item">Staff, Grades, and Leaderboard keep your performance loop in one place.</div>
            <div className="list-item">Activity, Shifts, Audit Logs, and LOA fill out the Melonly-style portal structure.</div>
            <div className="list-item">Integrations and Settings keep Discord and ER:LC wiring visible.</div>
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
