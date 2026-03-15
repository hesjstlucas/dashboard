"use client";

import { PageFrame } from "@/components/page-frame";
import { useDemo } from "@/components/demo-provider";

export function ShiftsPage() {
  const { shifts } = useDemo();

  return (
    <PageFrame
      title="Shifts"
      description="Keep patrol rotations, training sessions, and command coverage visible in one place."
    >
      <div className="grid cols-3">
        {shifts.length ? (
          shifts.map((shift) => (
            <article className="panel stack" key={shift.id}>
              <div className="split">
                <div>
                  <div className="kicker">{shift.status}</div>
                  <h3>{shift.name}</h3>
                </div>
                <span className="badge ok">{shift.seats}</span>
              </div>
              <div className="list">
                <div className="list-item">Lead: {shift.lead}</div>
                <div className="list-item">Window: {shift.window}</div>
              </div>
            </article>
          ))
        ) : (
          <div className="list-item">No live shift schedule is connected yet.</div>
        )}
      </div>
    </PageFrame>
  );
}
