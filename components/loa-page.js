"use client";

import { PageFrame } from "@/components/page-frame";
import { useDemo } from "@/components/demo-provider";

export function LoaPage() {
  const { loaRequests } = useDemo();

  return (
    <PageFrame
      title="Leave Of Absence"
      description="Review LOA requests and current time-away windows across the staff team."
    >
      <div className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Staff</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Date range</th>
              </tr>
            </thead>
            <tbody>
              {loaRequests.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.staff}</td>
                  <td>{entry.reason}</td>
                  <td>{entry.status}</td>
                  <td>{entry.range}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageFrame>
  );
}
