"use client";

import { useState } from "react";
import { PageFrame } from "@/components/page-frame";
import { useDemo } from "@/components/demo-provider";
import { canChangeGrades, canGrantLeaderboardPoints } from "@/lib/permissions";

export function GradesPage() {
  const { visibleStaff, currentUser, updateGrade, addLeaderboardPoints } = useDemo();
  const [pointInputs, setPointInputs] = useState({});

  return (
    <PageFrame
      title="Grades"
      description="Track grades, adjust leaderboard points, and manage staff performance from a single command-grade table."
    >
      <div className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Staff</th>
                <th>Rank</th>
                <th>Grade</th>
                <th>Activity</th>
                <th>Points</th>
                <th>Adjust points</th>
              </tr>
            </thead>
            <tbody>
              {visibleStaff.map((member) => {
                const canEdit = canChangeGrades(currentUser.rankKey, member.rankKey);
                const canPoints = canGrantLeaderboardPoints(currentUser.rankKey, member.rankKey);

                return (
                  <tr key={member.id}>
                    <td>{member.displayName}</td>
                    <td>{member.rankKey}</td>
                    <td>
                      {canEdit ? (
                        <input
                          max="100"
                          min="0"
                          onChange={(event) => updateGrade(member.id, event.target.value)}
                          type="number"
                          value={member.grade}
                        />
                      ) : (
                        `${member.grade}%`
                      )}
                    </td>
                    <td>{member.activity}/10</td>
                    <td>{member.leaderboardPoints}</td>
                    <td>
                      {canPoints ? (
                        <div className="inline-controls">
                          <input
                            onChange={(event) =>
                              setPointInputs((current) => ({
                                ...current,
                                [member.id]: Number(event.target.value) || 0
                              }))
                            }
                            placeholder="10"
                            type="number"
                            value={pointInputs[member.id] ?? ""}
                          />
                          <button
                            onClick={() => addLeaderboardPoints(member.id, pointInputs[member.id] || 0)}
                            type="button"
                          >
                            Apply
                          </button>
                        </div>
                      ) : (
                        <span className="muted">No access</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </PageFrame>
  );
}
