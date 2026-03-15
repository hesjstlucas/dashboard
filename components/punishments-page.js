"use client";

import { useMemo, useState } from "react";
import { PageFrame } from "@/components/page-frame";
import { useDemo } from "@/components/demo-provider";
import { canIssuePunishment } from "@/lib/permissions";

const defaultForm = {
  category: "Infraction",
  reason: "",
  status: "Active",
  duration: "14 days"
};

export function PunishmentsPage() {
  const { visibleStaff, punishments, currentUser, issuePunishment } = useDemo();
  const [form, setForm] = useState(defaultForm);
  const [targetId, setTargetId] = useState("");

  const eligibleTargets = useMemo(
    () => visibleStaff.filter((member) => canIssuePunishment(currentUser.rankKey, member.rankKey)),
    [currentUser.rankKey, visibleStaff]
  );

  async function submit(event) {
    event.preventDefault();
    if (!targetId) {
      return;
    }
    await issuePunishment(targetId, form);
    setForm(defaultForm);
  }

  return (
    <PageFrame
      title="Punishments"
      description="IA, Management, and Directive can issue infractions, strikes, demotions, and suspensions to lower-ranking staff, with Discord DMs sent automatically when configured."
    >
      <section className="grid cols-2">
        <form className="panel stack" onSubmit={submit}>
          <div>
            <h3>Issue staff action</h3>
            <p className="muted">Only lower-ranked targets appear here, based on the logged-in user.</p>
          </div>
          <div className="toolbar">
            <select onChange={(event) => setTargetId(event.target.value)} value={targetId}>
              <option value="">Select target</option>
              {eligibleTargets.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.displayName} • {member.rankKey}
                </option>
              ))}
            </select>
            <select
              onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
              value={form.category}
            >
              <option>Infraction</option>
              <option>Strike</option>
              <option>Demotion</option>
              <option>Suspension</option>
            </select>
            <select
              onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
              value={form.status}
            >
              <option>Active</option>
              <option>Served</option>
              <option>Appealed</option>
            </select>
            <input
              onChange={(event) => setForm((current) => ({ ...current, duration: event.target.value }))}
              placeholder="Duration"
              value={form.duration}
            />
            <textarea
              onChange={(event) => setForm((current) => ({ ...current, reason: event.target.value }))}
              placeholder="Reason"
              value={form.reason}
            />
            <button disabled={!eligibleTargets.length} type="submit">
              Save and DM
            </button>
          </div>
        </form>

        <div className="panel stack">
          <h3>Discipline ladder</h3>
          <div className="list">
            <div className="list-item">Infraction: low-severity or first-time issue.</div>
            <div className="list-item">Strike: repeated conduct or ignored guidance.</div>
            <div className="list-item">Demotion: trust or performance dropped below role expectations.</div>
            <div className="list-item">Suspension: temporary removal from active staff duties.</div>
          </div>
        </div>
      </section>

      <section className="panel">
        <h3>Punishment log</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Target</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {punishments.map((entry) => {
                const target = visibleStaff.find((member) => member.id === entry.targetId);
                return (
                  <tr key={entry.id}>
                    <td>{entry.category}</td>
                    <td>{target?.displayName || entry.targetId}</td>
                    <td>{entry.reason}</td>
                    <td>{entry.status}</td>
                    <td>{entry.duration}</td>
                    <td>{entry.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </PageFrame>
  );
}
