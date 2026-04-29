"use client";

import { useState } from "react";
import { PageFrame } from "@/components/page-frame";
import { useDemo } from "@/components/demo-provider";

const emptyEmergencyCall = {
  team: "Police",
  caller: "",
  callNumber: "",
  positionDescriptor: "",
  assignedUnit: "",
  status: "Open",
  description: ""
};

const emptyModCall = {
  caller: "",
  moderator: "",
  status: "Open",
  reason: ""
};

export function CallsPage() {
  const { erlcServer, emergencyCalls, modCalls, addEmergencyCall, addModCall } = useDemo();
  const [emergencyForm, setEmergencyForm] = useState(emptyEmergencyCall);
  const [modForm, setModForm] = useState(emptyModCall);

  function submitEmergencyCall(event) {
    event.preventDefault();
    if (!emergencyForm.description.trim()) {
      return;
    }

    addEmergencyCall(emergencyForm);
    setEmergencyForm(emptyEmergencyCall);
  }

  function submitModCall(event) {
    event.preventDefault();
    if (!modForm.reason.trim()) {
      return;
    }

    addModCall(modForm);
    setModForm(emptyModCall);
  }

  return (
    <PageFrame
      title="911 and Moderator Calls"
      description="Create and track emergency calls and staff requests manually, with no external server access required."
    >
      <section className="hero panel">
        <div>
          <div className="kicker">Manual call center</div>
          <h3>{erlcServer.name}</h3>
          <p className="muted">Staff can enter calls from in-game reports, Discord tickets, or radio traffic.</p>
        </div>
        <div className="hero-badges">
          <span className="badge ok">{emergencyCalls.length} emergency calls</span>
          <span className="badge warn">{modCalls.length} mod calls</span>
        </div>
      </section>

      <section className="grid cols-2">
        <form className="panel stack" onSubmit={submitEmergencyCall}>
          <div>
            <h3>Add 911 Call</h3>
            <p className="muted">Log caller, department, location, assigned unit, and scene description.</p>
          </div>
          <div className="toolbar vertical">
            <select
              onChange={(event) => setEmergencyForm((current) => ({ ...current, team: event.target.value }))}
              value={emergencyForm.team}
            >
              <option>Police</option>
              <option>EMS</option>
              <option>Fire</option>
              <option>DOT</option>
            </select>
            <input
              onChange={(event) => setEmergencyForm((current) => ({ ...current, caller: event.target.value }))}
              placeholder="Caller or reporting party"
              value={emergencyForm.caller}
            />
            <input
              onChange={(event) => setEmergencyForm((current) => ({ ...current, callNumber: event.target.value }))}
              placeholder="Call number"
              value={emergencyForm.callNumber}
            />
            <input
              onChange={(event) =>
                setEmergencyForm((current) => ({ ...current, positionDescriptor: event.target.value }))
              }
              placeholder="Location"
              value={emergencyForm.positionDescriptor}
            />
            <input
              onChange={(event) => setEmergencyForm((current) => ({ ...current, assignedUnit: event.target.value }))}
              placeholder="Assigned unit"
              value={emergencyForm.assignedUnit}
            />
            <select
              onChange={(event) => setEmergencyForm((current) => ({ ...current, status: event.target.value }))}
              value={emergencyForm.status}
            >
              <option>Open</option>
              <option>Assigned</option>
              <option>On scene</option>
              <option>Closed</option>
            </select>
            <textarea
              onChange={(event) => setEmergencyForm((current) => ({ ...current, description: event.target.value }))}
              placeholder="Call description"
              value={emergencyForm.description}
            />
            <button type="submit">Save 911 Call</button>
          </div>
        </form>

        <form className="panel stack" onSubmit={submitModCall}>
          <div>
            <h3>Add Staff Mod Call</h3>
            <p className="muted">Track who needs staff, which moderator took it, and why it was opened.</p>
          </div>
          <div className="toolbar vertical">
            <input
              onChange={(event) => setModForm((current) => ({ ...current, caller: event.target.value }))}
              placeholder="Caller"
              value={modForm.caller}
            />
            <input
              onChange={(event) => setModForm((current) => ({ ...current, moderator: event.target.value }))}
              placeholder="Moderator"
              value={modForm.moderator}
            />
            <select
              onChange={(event) => setModForm((current) => ({ ...current, status: event.target.value }))}
              value={modForm.status}
            >
              <option>Open</option>
              <option>Claimed</option>
              <option>Resolved</option>
              <option>Escalated</option>
            </select>
            <textarea
              onChange={(event) => setModForm((current) => ({ ...current, reason: event.target.value }))}
              placeholder="Reason for staff request"
              value={modForm.reason}
            />
            <button type="submit">Save Mod Call</button>
          </div>
        </form>
      </section>

      <section className="grid cols-2">
        <article className="panel stack">
          <div className="split">
            <h3>911 Call Board</h3>
            <span className="badge danger">Emergency</span>
          </div>
          <div className="list">
            {emergencyCalls.length ? (
              emergencyCalls.map((call) => (
                <div className="list-item" key={call.id}>
                  <div className="split">
                    <strong>
                      #{call.callNumber} | {call.team}
                    </strong>
                    <span className="muted">{call.startedAt}</span>
                  </div>
                  <div className="muted">
                    Caller: {call.caller} | Location: {call.positionDescriptor}
                  </div>
                  <div className="muted">
                    Unit: {call.assignedUnit || "Unassigned"} | Status: {call.status || "Open"}
                  </div>
                  <div>{call.description}</div>
                </div>
              ))
            ) : (
              <div className="list-item">No emergency calls are currently available.</div>
            )}
          </div>
        </article>

        <article className="panel stack">
          <div className="split">
            <h3>Staff Mod Calls</h3>
            <span className="badge warn">Moderation</span>
          </div>
          <div className="list">
            {modCalls.length ? (
              modCalls.map((call) => (
                <div className="list-item" key={call.id}>
                  <div className="split">
                    <strong>{call.caller}</strong>
                    <span className="muted">{call.timestamp}</span>
                  </div>
                  <div className="muted">
                    Moderator: {call.moderator} | Status: {call.status || "Open"}
                  </div>
                  <div>{call.reason}</div>
                </div>
              ))
            ) : (
              <div className="list-item">No moderator calls are currently available.</div>
            )}
          </div>
        </article>
      </section>
    </PageFrame>
  );
}
