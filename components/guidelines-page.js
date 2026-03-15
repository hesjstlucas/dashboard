"use client";

import { PageFrame } from "@/components/page-frame";
import { useDemo } from "@/components/demo-provider";
import { canEditGuidelines } from "@/lib/permissions";

export function GuidelinesPage() {
  const { guidelines, currentUser, updateGuideline } = useDemo();
  const editable = canEditGuidelines(currentUser.rankKey);

  return (
    <PageFrame
      title="Guidelines"
      description="All staff can read the handbook, but only Directive can edit it."
    >
      <div className="grid cols-2">
        {guidelines.map((entry) => (
          <article className="panel stack" key={entry.id}>
            <div>
              <div className="kicker">Staff guideline</div>
              <h3>{entry.title}</h3>
            </div>
            {editable ? (
              <textarea
                className="editor-area"
                onChange={(event) => updateGuideline(entry.id, event.target.value)}
                value={entry.content}
              />
            ) : (
              <div className="list-item">{entry.content}</div>
            )}
          </article>
        ))}
      </div>
    </PageFrame>
  );
}
