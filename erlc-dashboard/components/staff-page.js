"use client";

import { PageFrame } from "@/components/page-frame";
import { useDemo } from "@/components/demo-provider";
import { canEditGrade } from "@/lib/permissions";

export function StaffPage() {
  const { staff, currentUser, updateGrade, resetDemo } = useDemo();

  return (
    <PageFrame
      title="Staff Grades"
      description="RenWeb-style grade tracking for patrol activity, professionalism, and overall standing."
    >
      <div className="panel stack">
        <div className="split">
          <div>
            <h3>Gradebook</h3>
            <p className="muted">
              Higher-ranked staff can edit the grades of staff beneath them.
            </p>
          </div>
          <button className="secondary" onClick={resetDemo} type="button">
            Reset demo data
          </button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Staff member</th>
                <th>Rank</th>
                <th>Discord</th>
                <th>ER:LC calls</th>
                <th>Patrol hours</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => {
                const editable = canEditGrade(currentUser.rankKey, member.rankKey);

                return (
                  <tr key={member.id}>
                    <td>{member.name}</td>
                    <td>{member.rankTitle}</td>
                    <td>{member.discordTag}</td>
                    <td>{member.erlcCalls}</td>
                    <td>{member.patrolHours}</td>
                    <td>
                      {editable ? (
                        <input
                          aria-label={`Grade for ${member.name}`}
                          type="number"
                          min="0"
                          max="100"
                          value={member.grade}
                          onChange={(event) => updateGrade(member.id, event.target.value)}
                          style={{ width: 90 }}
                        />
                      ) : (
                        <span>{member.grade}%</span>
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
