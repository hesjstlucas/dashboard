"use client";

import { useMemo, useState } from "react";
import { PageFrame } from "@/components/page-frame";
import { useDemo } from "@/components/demo-provider";

export function StaffPage() {
  const { visibleStaff, currentUser } = useDemo();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return visibleStaff;
    }

    return visibleStaff.filter((member) =>
      [member.displayName, member.department, member.rankKey, member.discordTag]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [query, visibleStaff]);

  return (
    <PageFrame
      title="Staff Directory"
      description="Search the team and inspect rank, activity, grade, review history, and staff overview details."
    >
      <div className="panel stack">
        <div className="split">
          <div>
            <h3>Roster Search</h3>
            <p className="muted">Browse staff profiles, departments, reviews, and shift status from one searchable roster.</p>
          </div>
          <div className="badge ok">{currentUser.rankKey}</div>
        </div>
        <div className="toolbar">
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search staff, role, department, or Discord tag"
            value={query}
          />
        </div>
      </div>

      <section className="grid cols-2">
        {filtered.map((member) => (
          <article className="panel stack" key={member.id}>
            <div className="split">
              <div>
                <div className="kicker">{member.rankKey}</div>
                <h3>{member.displayName}</h3>
                <p className="muted">
                  {member.department} | {member.discordTag}
                </p>
              </div>
              <span className="badge ok">Activity {member.activity}/10</span>
            </div>
            <div className="grid cols-3 mini-grid">
              <div className="list-item">
                <strong>{member.grade}%</strong>
                <div className="muted">Grade</div>
              </div>
              <div className="list-item">
                <strong>{member.leaderboardPoints}</strong>
                <div className="muted">Points</div>
              </div>
              <div className="list-item">
                <strong>{member.staffOfWeek}</strong>
                <div className="muted">SOTW wins</div>
              </div>
            </div>
            <div className="list">
              <div className="list-item">Joined: {member.overview.joinedAt}</div>
              <div className="list-item">Last patrol: {member.overview.lastPatrol}</div>
              <div className="list-item">
                Patrol hours: {member.overview.patrolHours} | Mod actions: {member.overview.moderationActions} | Admin actions: {member.overview.adminActions}
              </div>
              {member.reviews.map((review, index) => (
                <div className="list-item" key={`${member.id}-${index}`}>
                  <strong>{review.author}</strong>
                  <div className="muted">{review.body}</div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </PageFrame>
  );
}
