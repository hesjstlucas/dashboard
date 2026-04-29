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
                ? "Integration detected."
                : "Optional integration is not configured."}
          </p>
        </div>
        <span className={`badge ${state.data?.configured ? "ok" : "warn"}`}>
          {state.data?.configured ? "Ready" : "Optional"}
        </span>
      </div>
      <pre className="muted compact-pre">
        {state.error ? state.error : JSON.stringify(state.data?.data ?? {}, null, 2)}
      </pre>
    </div>
  );
}

function CommandConsole() {
  const { abilities, recordCommandAction } = useDemo();
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

  function runCommand() {
    setResult(recordCommandAction(command) || "No command note was saved.");
  }

  return (
    <div className="panel stack">
      <div className="split">
        <div>
          <h3>Command Notes</h3>
          <p className="muted">Save command-style notes for staff review without sending anything to the server.</p>
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
          placeholder="Enter a command note"
          value={command}
        />
        <button disabled={!command} onClick={runCommand} type="button">
          Save
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
    departmentMembers
  } = useDemo();
  const pendingApplications = applications.filter((entry) => entry.status === "Pending").length;
  const criminalRecords = players.reduce((total, player) => total + player.criminalRecords.length, 0);

  return (
    <PageFrame
      title="Command Overview"
      description="A Paralix operations board for manual calls, department dashboards, player records, applications, and rank-gated staff tools."
    >
      <section className="hero panel">
        <div>
          <div className="kicker">Current Account</div>
          <h3>{currentUser.displayName}</h3>
          <p className="muted">{erlcServer.name} is running in manual portal mode. No ER:LC key is required.</p>
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
          <span className="muted">Searchable player vault from staff-entered records.</span>
        </div>
        <div className="panel stat-card">
          <span className="kicker">911 calls</span>
          <strong>{emergencyCalls.length}</strong>
          <span className="muted">Manual emergency call board entries.</span>
        </div>
        <div className="panel stat-card">
          <span className="kicker">Mod calls</span>
          <strong>{modCalls.length}</strong>
          <span className="muted">Manual staff support requests.</span>
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
            <div className="list-item">Players are added by staff when they need records or department history.</div>
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
        <div className="panel stack">
          <h3>Manual Portal Mode</h3>
          <p className="muted">The website runs without external server access. Staff create calls, player entries, records, applications, and reports directly in the dashboard.</p>
        </div>
        <ConnectionCard endpoint="/api/discord" title="Discord Login" />
      </section>
    </PageFrame>
  );
}
