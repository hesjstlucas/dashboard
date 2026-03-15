"use client";

import { useEffect, useState } from "react";
import { PageFrame } from "@/components/page-frame";
import { useDemo } from "@/components/demo-provider";
import { canIssuePunishment } from "@/lib/permissions";

const defaultForm = {
  category: "Infraction",
  reason: "",
  status: "Active",
  duration: "Permanent"
};

export function PunishmentsPage() {
  const { staff, punishments, currentUser, issuePunishment } = useDemo();
  const [targetId, setTargetId] = useState("");
  const [form, setForm] = useState(defaultForm);

  const availableTargets = staff.filter((member) =>
    canIssuePunishment(currentUser.rankKey, member.rankKey)
  );

  useEffect(() => {
    setTargetId(availableTargets[0]?.id ?? "");
  }, [currentUser.id]);

  function submit(event) {
    event.preventDefault();
    if (!targetId) {
      return;
    }
    issuePunishment(targetId, form);
    setForm(defaultForm);
  }

  return (
    <PageFrame
      title="Punishments"
      description="Track infractions, demotions, suspensions, and strikes with rank-based staff controls."
    >
      <section className="grid cols-2">
        <div className="panel stack">
          <div>
            <h3>Issue punishment</h3>
            <p className="muted">
              You can only discipline staff members whose rank is lower than yours.
            </p>
          </div>
          <form className="toolbar" onSubmit={submit}>
            <select value={targetId} onChange={(event) => setTargetId(event.target.value)}>
              {availableTargets.length ? (
                availableTargets.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} - {member.rankTitle}
                  </option>
                ))
              ) : (
                <option value="">No eligible staff</option>
              )}
            </select>
            <select
              value={form.category}
              onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
            >
              <option>Infraction</option>
              <option>Strike</option>
              <option>Demotion</option>
              <option>Suspension</option>
            </select>
            <select
              value={form.status}
              onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
            >
              <option>Active</option>
              <option>Served</option>
              <option>Appealed</option>
            </select>
            <input
              value={form.duration}
              onChange={(event) => setForm((current) => ({ ...current, duration: event.target.value }))}
              placeholder="Duration"
            />
            <textarea
              value={form.reason}
              onChange={(event) => setForm((current) => ({ ...current, reason: event.target.value }))}
              placeholder="Reason for punishment"
            />
            <button disabled={!availableTargets.length} type="submit">
              Save punishment
            </button>
          </form>
        </div>

        <div className="panel">
          <h3>Discipline overview</h3>
          <div className="list">
            <div className="list-item">Infractions for first-time or low-severity issues.</div>
            <div className="list-item">Strikes for repeated misconduct or ignored guidance.</div>
            <div className="list-item">Demotions when leadership confidence or standards drop.</div>
            <div className="list-item">Suspensions for temporary removal from duties.</div>
          </div>
        </div>
      </section>

      <section className="panel">
        <h3>Discipline log</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Staff</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Issued by</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {punishments.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.category}</td>
                  <td>{entry.targetName}</td>
                  <td>{entry.reason}</td>
                  <td>{entry.status}</td>
                  <td>{entry.duration}</td>
                  <td>{entry.issuedBy}</td>
                  <td>{entry.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageFrame>
  );
}
