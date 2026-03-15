"use client";

import { PageFrame } from "@/components/page-frame";
import { useDemo } from "@/components/demo-provider";

export function AuditPage() {
  const { auditLogs } = useDemo();

  return (
    <PageFrame
      title="Audit Logs"
      description="See who changed grades, points, punishments, or handbook content inside the portal."
    >
      <div className="panel stack">
        <div className="list">
          {auditLogs.length ? (
            auditLogs.map((entry) => (
              <div className="list-item" key={entry.id}>
                <div className="split">
                  <strong>{entry.event}</strong>
                  <span className="muted">{entry.when}</span>
                </div>
                <div className="muted">
                  {entry.actor} {"->"} {entry.target}
                </div>
                <div>{entry.detail}</div>
              </div>
            ))
          ) : (
            <div className="list-item">No audit events have been recorded yet.</div>
          )}
        </div>
      </div>
    </PageFrame>
  );
}
