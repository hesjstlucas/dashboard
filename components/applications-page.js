"use client";

import { useState } from "react";
import { PageFrame } from "@/components/page-frame";
import { useDemo } from "@/components/demo-provider";
import { DEPARTMENTS, getDepartment } from "@/lib/mock-data";

const emptyApplication = {
  applicantName: "",
  discordTag: "",
  robloxId: "",
  age: "",
  departmentId: "police",
  experience: "",
  availability: "",
  motivation: ""
};

export function ApplicationsPage() {
  const { abilities, applications, submitApplication, reviewApplication } = useDemo();
  const [form, setForm] = useState(emptyApplication);
  const [reviewNotes, setReviewNotes] = useState({});

  function submit(event) {
    event.preventDefault();
    if (!form.applicantName.trim()) {
      return;
    }

    submitApplication(form);
    setForm(emptyApplication);
  }

  return (
    <PageFrame
      title="Applications"
      description="A public-style department application system with command review controls for accepted, denied, and hold decisions."
    >
      <section className="grid cols-2">
        <form className="panel stack" onSubmit={submit}>
          <div>
            <h3>Department Application</h3>
            <p className="muted">Applicants can apply for police, medical, DOT, or fire from inside the same portal.</p>
          </div>
          <div className="toolbar vertical">
            <input
              onChange={(event) => setForm((current) => ({ ...current, applicantName: event.target.value }))}
              placeholder="Roblox username"
              value={form.applicantName}
            />
            <input
              onChange={(event) => setForm((current) => ({ ...current, discordTag: event.target.value }))}
              placeholder="Discord username"
              value={form.discordTag}
            />
            <input
              onChange={(event) => setForm((current) => ({ ...current, robloxId: event.target.value }))}
              placeholder="Roblox user ID"
              value={form.robloxId}
            />
            <input
              onChange={(event) => setForm((current) => ({ ...current, age: event.target.value }))}
              placeholder="Age"
              value={form.age}
            />
            <select
              onChange={(event) => setForm((current) => ({ ...current, departmentId: event.target.value }))}
              value={form.departmentId}
            >
              {DEPARTMENTS.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
            <textarea
              onChange={(event) => setForm((current) => ({ ...current, experience: event.target.value }))}
              placeholder="Previous ER:LC or roleplay experience"
              value={form.experience}
            />
            <textarea
              onChange={(event) => setForm((current) => ({ ...current, motivation: event.target.value }))}
              placeholder="Why do you want this department?"
              value={form.motivation}
            />
            <input
              onChange={(event) => setForm((current) => ({ ...current, availability: event.target.value }))}
              placeholder="Availability"
              value={form.availability}
            />
            <button type="submit">Submit Application</button>
          </div>
        </form>

        <article className="panel stack">
          <h3>Review Standards</h3>
          <div className="list">
            <div className="list-item">Applications should show realistic scene judgment, not just activity time.</div>
            <div className="list-item">Department command should check maturity, availability, and training needs.</div>
            <div className="list-item">IA and higher can review applications inside this portal.</div>
            <div className="list-item">Accepted applicants can be added to department rosters by command staff.</div>
          </div>
        </article>
      </section>

      <section className="panel stack">
        <div className="split">
          <h3>Application Queue</h3>
          <span className="badge">{applications.length} total</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Department</th>
                <th>Status</th>
                <th>Experience</th>
                <th>Review</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application.id}>
                  <td>
                    <strong>{application.applicantName}</strong>
                    <div className="muted">
                      {application.discordTag || "No Discord"} | {application.robloxId || "No ID"} | age {application.age || "-"}
                    </div>
                  </td>
                  <td>{getDepartment(application.departmentId).shortName}</td>
                  <td>{application.status}</td>
                  <td>
                    <div>{application.experience || "No experience written."}</div>
                    <div className="muted">{application.availability}</div>
                  </td>
                  <td>
                    {abilities.canReviewApplications ? (
                      <div className="review-controls">
                        <input
                          onChange={(event) =>
                            setReviewNotes((current) => ({ ...current, [application.id]: event.target.value }))
                          }
                          placeholder="Reviewer note"
                          value={reviewNotes[application.id] || ""}
                        />
                        <div className="inline-controls">
                          <button
                            onClick={() => reviewApplication(application.id, "Accepted", reviewNotes[application.id] || "")}
                            type="button"
                          >
                            Accept
                          </button>
                          <button
                            className="secondary"
                            onClick={() => reviewApplication(application.id, "Hold", reviewNotes[application.id] || "")}
                            type="button"
                          >
                            Hold
                          </button>
                          <button
                            className="secondary danger-button"
                            onClick={() => reviewApplication(application.id, "Denied", reviewNotes[application.id] || "")}
                            type="button"
                          >
                            Deny
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span className="muted">IA+ review only</span>
                    )}
                    {application.reviewerNote ? <div className="muted">Note: {application.reviewerNote}</div> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageFrame>
  );
}
