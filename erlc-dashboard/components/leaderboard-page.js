"use client";

import { PageFrame } from "@/components/page-frame";
import { useDemo } from "@/components/demo-provider";

export function LeaderboardPage() {
  const { leaderboard } = useDemo();

  return (
    <PageFrame
      title="Leaderboard"
      description="Rank staff by patrol output, ER:LC activity, and performance grades."
    >
      <div className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Staff member</th>
                <th>Role</th>
                <th>Grade</th>
                <th>Patrol hours</th>
                <th>ER:LC calls</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={entry.id}>
                  <td>#{index + 1}</td>
                  <td>{entry.name}</td>
                  <td>{entry.rankTitle}</td>
                  <td>{entry.grade}%</td>
                  <td>{entry.patrolHours}</td>
                  <td>{entry.erlcCalls}</td>
                  <td className="value-positive">{entry.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageFrame>
  );
}
