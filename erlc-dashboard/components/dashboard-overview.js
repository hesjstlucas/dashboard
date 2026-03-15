"use client";

import { useEffect, useState } from "react";
import { PageFrame } from "@/components/page-frame";
import { useDemo } from "@/components/demo-provider";

function ApiCard({ title, endpoint }) {
  const [result, setResult] = useState({ loading: true });

  useEffect(() => {
    let mounted = true;

    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        if (mounted) {
          setResult({ loading: false, data });
        }
      })
      .catch((error) => {
        if (mounted) {
          setResult({ loading: false, error: error.message });
        }
      });

    return () => {
      mounted = false;
    };
  }, [endpoint]);

  const badgeClass = result.error
    ? "danger"
    : result.data?.configured
      ? "ok"
      : "warn";

  return (
    <div className="panel stack">
      <div className="split">
        <div>
          <h3>{title}</h3>
          <p className="muted">
            {result.loading
              ? "Checking connection..."
              : result.data?.configured
                ? "Connected through environment variables."
                : "Using mock data until environment variables are set."}
          </p>
        </div>
        {!result.loading && (
          <span className={`badge ${badgeClass}`}>
            {result.error
              ? "Connection error"
              : result.data?.configured
                ? "Configured"
                : "Demo mode"}
          </span>
        )}
      </div>
      <pre
        className="muted"
        style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}
      >
        {result.error
          ? result.error
          : JSON.stringify(result.data?.data ?? {}, null, 2)}
      </pre>
    </div>
  );
}

export function DashboardOverview() {
  const { staff, punishments, leaderboard, currentUser } = useDemo();
  const activeStrikes = punishments.filter((entry) => entry.status === "Active").length;

  return (
    <PageFrame
      title="Command Dashboard"
      description="Track grades, discipline, leaderboard standings, and external platform connections for the TLRP ER:LC team."
    >
      <section className="grid cols-3">
        <div className="panel stat-card">
          <span className="kicker">Staff roster</span>
          <strong>{staff.length}</strong>
          <span className="muted">Total active staff in the dashboard.</span>
        </div>
        <div className="panel stat-card">
          <span className="kicker">Active discipline</span>
          <strong>{activeStrikes}</strong>
          <span className="muted">Open strikes, infractions, and demotions.</span>
        </div>
        <div className="panel stat-card">
          <span className="kicker">Current profile</span>
          <strong>{currentUser.grade}%</strong>
          <span className="muted">{currentUser.name} current performance grade.</span>
        </div>
      </section>

      <section className="grid cols-2">
        <div className="panel">
          <h3>Top Staff</h3>
          <div className="list">
            {leaderboard.slice(0, 5).map((entry, index) => (
              <div className="list-item split" key={entry.id}>
                <div>
                  <div>
                    #{index + 1} {entry.name}
                  </div>
                  <div className="muted">{entry.rankTitle}</div>
                </div>
                <strong>{entry.score}</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <h3>Command Notes</h3>
          <div className="list">
            <div className="list-item">
              Grades are editable only if your staff rank outranks the target.
            </div>
            <div className="list-item">
              Punishments include infractions, strikes, suspensions, and demotions.
            </div>
            <div className="list-item">
              ER:LC and Discord cards below switch to live data once credentials are configured.
            </div>
          </div>
        </div>
      </section>

      <section className="grid cols-2">
        <ApiCard title="ER:LC API" endpoint="/api/erlc" />
        <ApiCard title="Discord API" endpoint="/api/discord" />
      </section>
    </PageFrame>
  );
}
