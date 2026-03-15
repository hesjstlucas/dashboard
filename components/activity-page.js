"use client";

import { PageFrame } from "@/components/page-frame";
import { useDemo } from "@/components/demo-provider";

export function ActivityPage() {
  const { activityFeed, visibleStaff } = useDemo();

  return (
    <PageFrame
      title="Activity"
      description="Track recent staff actions, portal updates, and high-level movement across the TLRP team."
    >
      <section className="grid cols-3">
        {visibleStaff.length ? (
          visibleStaff.map((member) => (
            <div className="panel stat-card" key={member.id}>
              <span className="kicker">{member.displayName}</span>
              <strong>{member.activity === null ? "--" : `${member.activity}/10`}</strong>
              <span className="muted">{member.overview.shiftStatus}</span>
            </div>
          ))
        ) : (
          <div className="list-item">No live staff activity data is available yet.</div>
        )}
      </section>
      <section className="panel stack">
        <h3>Recent feed</h3>
        <div className="list">
          {activityFeed.length ? (
            activityFeed.map((item) => (
              <div className="list-item" key={item.id}>
                <strong>{item.title}</strong>
                <div className="muted">
                  {item.note} | {item.when}
                </div>
              </div>
            ))
          ) : (
            <div className="list-item">No activity events have been recorded yet.</div>
          )}
        </div>
      </section>
    </PageFrame>
  );
}
