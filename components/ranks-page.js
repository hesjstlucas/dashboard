"use client";

import { PageFrame } from "@/components/page-frame";
import { DEPARTMENTS, getRankCards } from "@/lib/mock-data";

export function RanksPage() {
  const ranks = getRankCards();

  return (
    <PageFrame
      title="Ranks"
      description="Reference website permissions and department rank ladders for dashboards, records, applications, promotions, and demotions."
    >
      <div className="grid cols-2">
        {ranks.map((rank) => (
          <article className="panel stack" key={rank.key}>
            <div className="split">
              <div>
                <div className="kicker">Level {rank.level}</div>
                <h3>{rank.label}</h3>
              </div>
              <span className="badge ok">{rank.key}</span>
            </div>
            <p className="muted">{rank.description}</p>
            <div className="list">
              <div className="list-item">Moderation commands: {rank.powers.moderation ? "Yes" : "No"}</div>
              <div className="list-item">Administration commands: {rank.powers.admin ? "Yes" : "No"}</div>
              <div className="list-item">Player and department records: {rank.powers.records ? "Yes" : "No"}</div>
              <div className="list-item">Application review: {rank.powers.applications ? "Yes" : "No"}</div>
              <div className="list-item">Grade changes: {rank.powers.grades ? "Lower ranks only" : "No"}</div>
              <div className="list-item">Punishments: {rank.powers.punishment ? "Lower ranks only" : "No"}</div>
              <div className="list-item">Leaderboard points: {rank.powers.leaderboard ? "Lower ranks only" : "No"}</div>
              <div className="list-item">Department promotions: {rank.powers.departmentRanks ? "Yes" : "No"}</div>
              <div className="list-item">Guideline editing: {rank.powers.guidelines ? "Yes" : "No"}</div>
            </div>
          </article>
        ))}
      </div>
      <section className="panel stack">
        <h3>Department Rank Ladders</h3>
        <div className="grid cols-4">
          {DEPARTMENTS.map((department) => (
            <article className="list-item rank-ladder" key={department.id}>
              <strong>{department.shortName}</strong>
              {department.ranks.map((rank, index) => (
                <span key={rank}>
                  {index + 1}. {rank}
                </span>
              ))}
            </article>
          ))}
        </div>
      </section>
    </PageFrame>
  );
}
