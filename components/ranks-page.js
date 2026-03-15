"use client";

import { PageFrame } from "@/components/page-frame";
import { getRankCards } from "@/lib/mock-data";

export function RanksPage() {
  const ranks = getRankCards();

  return (
    <PageFrame
      title="Ranks"
      description="Reference the permission ladder for Moderation, Administration, IA, Management, and Directive."
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
              <div className="list-item">Grade changes: {rank.powers.grades ? "Lower ranks only" : "No"}</div>
              <div className="list-item">Punishments: {rank.powers.punishment ? "Lower ranks only" : "No"}</div>
              <div className="list-item">Leaderboard points: {rank.powers.leaderboard ? "Lower ranks only" : "No"}</div>
              <div className="list-item">Guideline editing: {rank.powers.guidelines ? "Yes" : "No"}</div>
            </div>
          </article>
        ))}
      </div>
    </PageFrame>
  );
}
