"use client";

import { PageFrame } from "@/components/page-frame";
import { useDemo } from "@/components/demo-provider";

export function CallsPage() {
  const { erlcServer, emergencyCalls, modCalls, liveErlcState, refreshErlcData } = useDemo();

  return (
    <PageFrame
      title="911 and Moderator Calls"
      description="View live emergency calls and staff mod calls from the ER:LC PRC API when the server key is configured."
    >
      <section className="hero panel">
        <div>
          <div className="kicker">ER:LC server</div>
          <h3>{erlcServer.name}</h3>
          <p className="muted">
            {liveErlcState.configured
              ? "Live PRC API data is connected."
              : "Demo mode is active. Add the ER:LC server key to load real calls and players."}
          </p>
        </div>
        <div className="hero-badges">
          <span className="badge ok">
            Players {erlcServer.currentPlayers ?? "--"}/{erlcServer.maxPlayers ?? "--"}
          </span>
          <span className="badge warn">Queue {erlcServer.queue ?? "--"}</span>
          <button className="secondary" onClick={refreshErlcData} type="button">
            Refresh
          </button>
        </div>
      </section>

      {liveErlcState.error ? <div className="list-item notice-banner">{liveErlcState.error}</div> : null}

      <section className="grid cols-3">
        <article className="panel stat-card">
          <span className="kicker">Emergency calls</span>
          <strong>{emergencyCalls.length}</strong>
          <span className="muted">Pulled with EmergencyCalls=true.</span>
        </article>
        <article className="panel stat-card">
          <span className="kicker">Moderator calls</span>
          <strong>{modCalls.length}</strong>
          <span className="muted">Pulled with ModCalls=true.</span>
        </article>
        <article className="panel stat-card">
          <span className="kicker">Source</span>
          <strong>{liveErlcState.configured ? "Live" : "Demo"}</strong>
          <span className="muted">Uses PRC API v2 server data.</span>
        </article>
      </section>

      <section className="grid cols-2">
        <article className="panel stack">
          <div className="split">
            <h3>911 Call Board</h3>
            <span className="badge danger">Emergency</span>
          </div>
          <div className="list">
            {emergencyCalls.length ? (
              emergencyCalls.map((call) => (
                <div className="list-item" key={call.id}>
                  <div className="split">
                    <strong>
                      #{call.callNumber} | {call.team}
                    </strong>
                    <span className="muted">{call.startedAt}</span>
                  </div>
                  <div className="muted">
                    Caller: {call.caller} | Location: {call.positionDescriptor}
                  </div>
                  <div>{call.description}</div>
                </div>
              ))
            ) : (
              <div className="list-item">No emergency calls are currently available.</div>
            )}
          </div>
        </article>

        <article className="panel stack">
          <div className="split">
            <h3>Staff Mod Calls</h3>
            <span className="badge warn">Moderation</span>
          </div>
          <div className="list">
            {modCalls.length ? (
              modCalls.map((call) => (
                <div className="list-item" key={call.id}>
                  <div className="split">
                    <strong>{call.caller}</strong>
                    <span className="muted">{call.timestamp}</span>
                  </div>
                  <div className="muted">Moderator: {call.moderator}</div>
                </div>
              ))
            ) : (
              <div className="list-item">No moderator calls are currently available.</div>
            )}
          </div>
        </article>
      </section>
    </PageFrame>
  );
}
