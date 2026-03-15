"use client";

import { PageFrame } from "@/components/page-frame";
import { useDemo } from "@/components/demo-provider";

export function IntegrationsPage() {
  const { integrations } = useDemo();

  return (
    <PageFrame
      title="Integrations"
      description="Keep Discord, ER:LC, and internal scoring systems visible in one configuration view."
    >
      <div className="grid cols-3">
        {integrations.map((integration) => (
          <article className="panel stack" key={integration.id}>
            <div className="split">
              <h3>{integration.title}</h3>
              <span className="badge ok">{integration.status}</span>
            </div>
            <p className="muted">{integration.description}</p>
          </article>
        ))}
      </div>
    </PageFrame>
  );
}
