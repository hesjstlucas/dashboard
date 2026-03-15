"use client";

import { PageFrame } from "@/components/page-frame";
import { useDemo } from "@/components/demo-provider";

export function SettingsPage() {
  const { settings } = useDemo();

  return (
    <PageFrame
      title="Settings"
      description="A control view for portal toggles, DM behavior, and recurring leaderboard configuration."
    >
      <div className="grid cols-2">
        {settings.map((setting) => (
          <article className="panel stack" key={setting.id}>
            <div className="split">
              <h3>{setting.name}</h3>
              <span className="badge warn">{setting.value}</span>
            </div>
            <p className="muted">{setting.note}</p>
          </article>
        ))}
      </div>
    </PageFrame>
  );
}
