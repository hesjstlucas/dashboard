"use client";

import { PageFrame } from "@/components/page-frame";
import { useDemo } from "@/components/demo-provider";

export function LeaderboardPage() {
  const { leaderboard } = useDemo();

  return (
    <PageFrame
      title="Leaderboard"
      description="Compare grades, written staff reviews, Staff of the Week wins, activity scores, and leaderboard points across the TLRP team."
    >
      <div className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Grade</th>
                <th>Reviews</th>
                <th>Staff of the Week</th>
                <th>Activity</th>
                <th>Points</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {!leaderboard.length ? (
                <tr>
                  <td colSpan="7">No real leaderboard entries are available yet.</td>
                </tr>
              ) : null}
              {leaderboard.map((entry) => (
                <tr key={entry.id}>
                  <td>
                    <div>{entry.displayName}</div>
                    <div className="muted">{entry.rankKey}</div>
                  </td>
                  <td>{entry.grade === null ? "--" : `${entry.grade}%`}</td>
                  <td>
                    {entry.reviews.length ? (
                      entry.reviews.map((review, index) => (
                        <div className="muted" key={`${entry.id}-review-${index}`}>
                          {review.author}: {review.body}
                        </div>
                      ))
                    ) : (
                      <span className="muted">No reviews</span>
                    )}
                  </td>
                  <td>{entry.staffOfWeek ?? "--"}</td>
                  <td>{entry.activity === null ? "--" : `${entry.activity}/10`}</td>
                  <td>{entry.leaderboardPoints ?? "--"}</td>
                  <td className="value-positive">{entry.combinedScore || "--"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageFrame>
  );
}
