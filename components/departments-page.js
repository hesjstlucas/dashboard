"use client";

import { useMemo, useState } from "react";
import { PageFrame } from "@/components/page-frame";
import { useDemo } from "@/components/demo-provider";
import { DEPARTMENTS, getDepartmentRank } from "@/lib/mock-data";

const defaultReport = {
  title: "",
  category: "Incident",
  linkedPlayerId: "",
  status: "Open",
  summary: ""
};

export function DepartmentsPage() {
  const {
    abilities,
    players,
    visibleStaff,
    departmentMembers,
    departmentReports,
    emergencyCalls,
    addDepartmentReport,
    promoteDepartmentMember,
    demoteDepartmentMember
  } = useDemo();
  const [activeDepartmentId, setActiveDepartmentId] = useState("police");
  const [report, setReport] = useState(defaultReport);

  const activeDepartment = DEPARTMENTS.find((department) => department.id === activeDepartmentId) || DEPARTMENTS[0];
  const members = useMemo(
    () => departmentMembers.filter((member) => member.departmentId === activeDepartment.id),
    [activeDepartment.id, departmentMembers]
  );
  const reports = useMemo(
    () => departmentReports.filter((entry) => entry.departmentId === activeDepartment.id),
    [activeDepartment.id, departmentReports]
  );
  const calls = useMemo(
    () => emergencyCalls.filter((call) => call.team.toLowerCase().includes(activeDepartment.dispatchTeam.toLowerCase())),
    [activeDepartment.dispatchTeam, emergencyCalls]
  );

  function submitReport(event) {
    event.preventDefault();
    if (!report.title.trim()) {
      return;
    }

    addDepartmentReport(activeDepartment.id, report);
    setReport(defaultReport);
  }

  return (
    <PageFrame
      title="Department Dashboards"
      description="Police, medical, DOT, and fire each have their own command view, roster, reports, call queue, and rank controls."
    >
      <div className="department-tabs" role="tablist" aria-label="Department dashboards">
        {DEPARTMENTS.map((department) => (
          <button
            className={department.id === activeDepartment.id ? "department-tab active" : "department-tab"}
            key={department.id}
            onClick={() => setActiveDepartmentId(department.id)}
            type="button"
          >
            {department.shortName}
          </button>
        ))}
      </div>

      <section className="department-hero panel" style={{ "--department-accent": activeDepartment.accent }}>
        <div>
          <div className="kicker">{activeDepartment.shortName} dashboard</div>
          <h3>{activeDepartment.name}</h3>
          <p className="muted">{activeDepartment.mission}</p>
        </div>
        <div className="hero-badges">
          <span className="badge ok">{members.length} members</span>
          <span className="badge warn">{calls.length} calls</span>
          <span className="badge">{reports.length} reports</span>
        </div>
      </section>

      <section className="grid cols-3">
        <article className="panel stack">
          <h3>Expected Modules</h3>
          <div className="list">
            {activeDepartment.modules.map((module) => (
              <div className="list-item" key={module}>
                {module}
              </div>
            ))}
          </div>
        </article>

        <article className="panel stack">
          <h3>Call Queue</h3>
          <div className="list">
            {calls.length ? (
              calls.slice(0, 4).map((call) => (
                <div className="list-item" key={call.id}>
                  <strong>Call {call.callNumber}</strong>
                  <div className="muted">{call.positionDescriptor}</div>
                  <div>{call.description}</div>
                </div>
              ))
            ) : (
              <div className="list-item">No calls for this department right now.</div>
            )}
          </div>
        </article>

        <article className="panel stack">
          <h3>Access Rules</h3>
          <p className="muted">{activeDepartment.accessNote}</p>
          <div className="list">
            <div className="list-item">Dashboard view: {abilities.canViewDepartmentDashboards ? "Allowed" : "Locked"}</div>
            <div className="list-item">Rank changes: {abilities.canManageDepartmentRanks ? "Allowed" : "Management+ only"}</div>
            <div className="list-item">Application review: {abilities.canReviewApplications ? "Allowed" : "IA+ only"}</div>
          </div>
        </article>
      </section>

      <section className="grid cols-2">
        <article className="panel stack">
          <div className="split">
            <h3>Department Roster</h3>
            <span className="badge">{activeDepartment.ranks.length} ranks</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Unit</th>
                  <th>Rank</th>
                  <th>Status</th>
                  <th>Manage</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => {
                  const staff = visibleStaff.find((entry) => entry.id === member.staffId);
                  const player = players.find((entry) => entry.id === member.playerId);
                  return (
                    <tr key={member.id}>
                      <td>{staff?.displayName || player?.displayName || member.playerId}</td>
                      <td>{member.unit}</td>
                      <td>{getDepartmentRank(member)}</td>
                      <td>{member.status}</td>
                      <td>
                        {abilities.canManageDepartmentRanks ? (
                          <div className="inline-controls">
                            <button onClick={() => promoteDepartmentMember(member.id)} type="button">
                              Promote
                            </button>
                            <button className="secondary" onClick={() => demoteDepartmentMember(member.id)} type="button">
                              Demote
                            </button>
                          </div>
                        ) : (
                          <span className="muted">No access</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </article>

        <form className="panel stack" onSubmit={submitReport}>
          <div>
            <h3>Create Department Report</h3>
            <p className="muted">Attach a report to a player when possible so command has a real record trail.</p>
          </div>
          <div className="toolbar vertical">
            <input
              onChange={(event) => setReport((current) => ({ ...current, title: event.target.value }))}
              placeholder="Report title"
              value={report.title}
            />
            <select
              onChange={(event) => setReport((current) => ({ ...current, category: event.target.value }))}
              value={report.category}
            >
              <option>Incident</option>
              <option>Training</option>
              <option>Scene review</option>
              <option>Equipment</option>
            </select>
            <select
              onChange={(event) => setReport((current) => ({ ...current, linkedPlayerId: event.target.value }))}
              value={report.linkedPlayerId}
            >
              <option value="">No linked player</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.username}
                </option>
              ))}
            </select>
            <textarea
              onChange={(event) => setReport((current) => ({ ...current, summary: event.target.value }))}
              placeholder="Summary, action taken, next steps"
              value={report.summary}
            />
            <button disabled={!abilities.canViewDepartmentDashboards} type="submit">
              Save Report
            </button>
          </div>
        </form>
      </section>

      <section className="panel stack">
        <h3>Recent {activeDepartment.shortName} Reports</h3>
        <div className="list">
          {reports.length ? (
            reports.map((entry) => (
              <div className="list-item" key={entry.id}>
                <div className="split">
                  <strong>{entry.title}</strong>
                  <span className="muted">{entry.createdAt}</span>
                </div>
                <div className="muted">
                  {entry.category} | {entry.status} | {entry.author}
                </div>
                <div>{entry.summary}</div>
              </div>
            ))
          ) : (
            <div className="list-item">No reports have been saved for this department yet.</div>
          )}
        </div>
      </section>
    </PageFrame>
  );
}
