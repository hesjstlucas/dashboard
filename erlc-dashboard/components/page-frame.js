"use client";

import { useDemo } from "@/components/demo-provider";

export function PageFrame({ title, description, children }) {
  const { staff, activeUserId, setActiveUserId, currentRank } = useDemo();

  return (
    <div className="stack">
      <header className="page-header">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="panel">
          <div className="kicker">Signed in as</div>
          <div className="toolbar" style={{ marginTop: 10 }}>
            <select
              aria-label="Select active staff account"
              value={activeUserId}
              onChange={(event) => setActiveUserId(event.target.value)}
            >
              {staff.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} - {member.rankTitle}
                </option>
              ))}
            </select>
            <span className="badge ok">{currentRank.label}</span>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
