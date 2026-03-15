"use client";

import { PageFrame } from "@/components/page-frame";
import { useDemo } from "@/components/demo-provider";
import { toExternalUrl } from "@/lib/guidelines";
import { canEditGuidelines } from "@/lib/permissions";

export function GuidelinesPage() {
  const {
    guidelines,
    currentUser,
    updateGuideline,
    addGuidelineLink,
    updateGuidelineLink,
    removeGuidelineLink
  } = useDemo();
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
            <div className="stack">
              <div className="split">
                <div>
                  <div className="kicker">Website Buttons</div>
                  <div className="muted">Open linked resources directly from this guideline.</div>
                </div>
                {editable ? (
                  <button
                    className="secondary guideline-editor-action"
                    onClick={() => addGuidelineLink(entry.id)}
                    type="button"
                  >
                    Add website
                  </button>
                ) : null}
              </div>
              {entry.links.some((link) => link.url.trim() && link.url.trim() !== "https://") ? (
                <div className="chip-row">
                  {entry.links
                    .filter((link) => link.url.trim() && link.url.trim() !== "https://")
                    .map((link) => (
                    <a
                      className="button-link guideline-link-button"
                      href={toExternalUrl(link.url)}
                      key={link.id}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : (
                <div className="muted">No website buttons added yet.</div>
              )}
              {editable ? (
                <div className="stack">
                  {entry.links.map((link) => (
                    <div className="toolbar guideline-link-row" key={link.id}>
                      <input
                        onChange={(event) =>
                          updateGuidelineLink(entry.id, link.id, "label", event.target.value)
                        }
                        placeholder="Button label"
                        value={link.label}
                      />
                      <input
                        onChange={(event) =>
                          updateGuidelineLink(entry.id, link.id, "url", event.target.value)
                        }
                        placeholder="https://example.com"
                        value={link.url}
                      />
                      <button
                        className="secondary"
                        onClick={() => removeGuidelineLink(entry.id, link.id)}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </PageFrame>
  );
}
