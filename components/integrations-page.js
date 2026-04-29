"use client";

import { PageFrame } from "@/components/page-frame";
import { useDemo } from "@/components/demo-provider";

export function IntegrationsPage() {
  const { integrations } = useDemo();

  return (
    <PageFrame
      title="Integrations"
      description="Keep Discord login, local records, and internal scoring systems visible in one configuration view."
    >
      <section className="panel stack">
        <div className="split">
          <div>
            <h3>Manual Portal Mode</h3>
            <p className="muted">Paralix now runs without any external server setup. Calls, players, records, reports, and command notes are all staff-entered.</p>
          </div>
          <span className="badge ok">No key required</span>
        </div>
      </section>
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
