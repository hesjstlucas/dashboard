"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PageFrame } from "@/components/page-frame";
import { useDemo } from "@/components/demo-provider";
import { DEPARTMENTS, erlcCommandTemplates } from "@/lib/mock-data";

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
                : "Demo mode until environment variables are configured."}
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
    setResult(data.result || data.error || data.data?.message || JSON.stringify(data));
  }

  return (
    <div className="panel stack">
      <div className="split">
        <div>
          <h3>ER:LC Command Center</h3>
          <p className="muted">Command templates are filtered by the current website rank.</p>
        </div>
        <span className="badge ok">{templates.length ? "Ready" : "Locked"}</span>
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
          Run
        </button>
      </div>
      {result ? <div className="list-item">{result}</div> : null}
    </div>
  );
}

export function DashboardOverview() {
  const {
    visibleStaff,
    players,
    applications,
    currentUser,
    activityFeed,
    emergencyCalls,
    modCalls,
    erlcServer,
    liveErlcState,
    departmentMembers
  } = useDemo();
  const pendingApplications = applications.filter((entry) => entry.status === "Pending").length;
  const criminalRecords = players.reduce((total, player) => total + player.criminalRecords.length, 0);

  return (
    <PageFrame
      title="Command Overview"
      description="A Paralix operations board for live ER:LC data, department dashboards, player records, applications, and rank-gated staff tools."
    >
      <section className="hero panel">
        <div>
          <div className="kicker">Current Account</div>
          <h3>{currentUser.displayName}</h3>
          <p className="muted">
            {liveErlcState.configured
              ? `${erlcServer.name} is connected through the PRC API.`
              : "Local director preview is active. Configure API and Discord env vars for production access."}
          </p>
        </div>
        <div className="hero-badges">
          <span className="badge ok">{currentUser.rankKey}</span>
          <span className="badge warn">{currentUser.department}</span>
        </div>
      </section>

      <section className="grid cols-4">
        <div className="panel stat-card">
          <span className="kicker">Seen players</span>
          <strong>{players.length}</strong>
          <span className="muted">Searchable player vault from API, join logs, and manual entries.</span>
        </div>
        <div className="panel stat-card">
          <span className="kicker">911 calls</span>
          <strong>{emergencyCalls.length}</strong>
          <span className="muted">EmergencyCalls data from the ER:LC API.</span>
        </div>
        <div className="panel stat-card">
          <span className="kicker">Mod calls</span>
          <strong>{modCalls.length}</strong>
          <span className="muted">ModCalls data for the staff team.</span>
        </div>
        <div className="panel stat-card">
          <span className="kicker">Applications</span>
          <strong>{pendingApplications}</strong>
          <span className="muted">Pending department applications.</span>
        </div>
      </section>

      <section className="grid cols-4">
        {DEPARTMENTS.map((department) => (
          <Link
            className="department-card compact"
            href="/departments"
            key={department.id}
            style={{ "--department-accent": department.accent }}
          >
            <div className="department-chip">{department.shortName}</div>
            <strong>{departmentMembers.filter((member) => member.departmentId === department.id).length} members</strong>
            <p>{department.modules.slice(0, 2).join(" | ")}</p>
          </Link>
        ))}
      </section>

      <section className="grid cols-2">
        <CommandConsole />
        <div className="panel stack">
          <h3>Operational Guardrails</h3>
          <div className="list">
            <div className="list-item">Criminal records are manual only: {criminalRecords} saved right now.</div>
            <div className="list-item">Players are merged from live Players and JoinLogs when the API key is configured.</div>
            <div className="list-item">Management+ can promote or demote department members.</div>
            <div className="list-item">IA+ can review applications and staff discipline.</div>
          </div>
        </div>
      </section>

      <section className="grid cols-2">
        <div className="panel stack">
          <h3>Recent Activity</h3>
          <div className="list">
            {activityFeed.length ? (
              activityFeed.slice(0, 5).map((item) => (
                <div className="list-item" key={item.id}>
                  <strong>{item.title}</strong>
                  <div className="muted">
                    {item.note} | {item.when}
                  </div>
                </div>
              ))
            ) : (
              <div className="list-item">No activity entries have been recorded yet.</div>
            )}
          </div>
        </div>
        <div className="panel stack">
          <h3>Quick Routes</h3>
          <div className="quick-route-grid">
            <Link className="list-item" href="/calls">
              911 and mod calls
            </Link>
            <Link className="list-item" href="/players">
              Player records
            </Link>
            <Link className="list-item" href="/applications">
              Applications
            </Link>
            <Link className="list-item" href="/ranks">
              Rank permissions
            </Link>
          </div>
        </div>
      </section>

      <section className="grid cols-2">
        <ConnectionCard endpoint={ERLC_FULL_QUERY} title="ER:LC API" />
        <ConnectionCard endpoint="/api/discord" title="Discord API" />
      </section>
    </PageFrame>
  );
}

const ERLC_FULL_QUERY =
  "/api/erlc?Players=true&Staff=true&JoinLogs=true&Queue=true&KillLogs=true&CommandLogs=true&ModCalls=true&EmergencyCalls=true&Vehicles=true";
