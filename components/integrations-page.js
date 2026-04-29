"use client";

import { PageFrame } from "@/components/page-frame";
import { useDemo } from "@/components/demo-provider";

export function IntegrationsPage() {
  const { integrations, liveErlcState, refreshErlcData } = useDemo();

  return (
    <PageFrame
      title="Integrations"
      description="Keep Discord, ER:LC API v2, records, and internal scoring systems visible in one configuration view."
    >
      <section className="panel stack">
        <div className="split">
          <div>
            <h3>ER:LC API Status</h3>
            <p className="muted">
              Add ERLC_API_KEY to load Players, JoinLogs, EmergencyCalls, ModCalls, Staff, Queue, CommandLogs, and Vehicles.
            </p>
          </div>
          <div className="inline-controls">
            <span className={`badge ${liveErlcState.configured ? "ok" : "warn"}`}>
              {liveErlcState.configured ? "Live" : "Demo"}
            </span>
            <button className="secondary" onClick={refreshErlcData} type="button">
              Test API
            </button>
          </div>
        </div>
        {liveErlcState.error ? <div className="list-item notice-banner">{liveErlcState.error}</div> : null}
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
