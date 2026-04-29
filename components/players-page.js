"use client";

import { useMemo, useState } from "react";
import { PageFrame } from "@/components/page-frame";
import { useDemo } from "@/components/demo-provider";

const recordTabs = [
  { key: "medicalRecords", label: "Patient" },
  { key: "criminalRecords", label: "Police" },
  { key: "dotRecords", label: "DOT" },
  { key: "fireRecords", label: "Fire" }
];

const emptyRecord = {
  patientName: "",
  age: "",
  disabilities: "",
  allergies: "",
  treatment: "",
  unit: "",
  offense: "",
  evidence: "",
  caseNumber: "",
  vehicle: "",
  plate: "",
  serviceType: "",
  incidentType: "",
  hazards: "",
  damage: "",
  status: "Open",
  description: ""
};

const emptyPlayer = {
  username: "",
  displayName: "",
  robloxId: "",
  team: "",
  callsign: "",
  location: ""
};

function RecordList({ title, records, empty }) {
  return (
    <div className="record-stack">
      <h4>{title}</h4>
      <div className="list">
        {records.length ? (
          records.map((record) => (
            <div className="list-item" key={record.id}>
              <div className="split">
                <strong>{record.offense || record.incidentType || record.serviceType || record.patientName || record.type}</strong>
                <span className="muted">{record.createdAt}</span>
              </div>
              <div className="muted">
                {record.status} | {record.author}
              </div>
              <div>{record.description}</div>
            </div>
          ))
        ) : (
          <div className="list-item">{empty}</div>
        )}
      </div>
    </div>
  );
}

export function PlayersPage() {
  const { abilities, players, addManualPlayer, addPlayerRecord, liveErlcState, refreshErlcData } = useDemo();
  const [query, setQuery] = useState("");
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [recordType, setRecordType] = useState("medicalRecords");
  const [record, setRecord] = useState(emptyRecord);
  const [manualPlayer, setManualPlayer] = useState(emptyPlayer);

  const filteredPlayers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return players;
    }

    return players.filter((player) =>
      [player.username, player.displayName, player.robloxId, player.team, player.callsign, player.location]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [players, query]);

  const selectedPlayer =
    players.find((player) => player.id === selectedPlayerId) || filteredPlayers[0] || players[0] || null;

  function submitManualPlayer(event) {
    event.preventDefault();
    if (!manualPlayer.username.trim()) {
      return;
    }

    const id = addManualPlayer(manualPlayer);
    setSelectedPlayerId(id);
    setManualPlayer(emptyPlayer);
  }

  function submitRecord(event) {
    event.preventDefault();
    if (!selectedPlayer || !record.description.trim()) {
      return;
    }

    addPlayerRecord(selectedPlayer.id, recordType, record);
    setRecord(emptyRecord);
  }

  return (
    <PageFrame
      title="Player Search and Records"
      description="Search every player seen by the ER:LC API, add manual players when needed, and attach department records without auto-generating criminals."
    >
      <section className="grid cols-3">
        <article className="panel stat-card">
          <span className="kicker">Player vault</span>
          <strong>{players.length}</strong>
          <span className="muted">Merged from live players, join logs, staff profiles, and manual entries.</span>
        </article>
        <article className="panel stat-card">
          <span className="kicker">Criminal records</span>
          <strong>{players.reduce((total, player) => total + player.criminalRecords.length, 0)}</strong>
          <span className="muted">Manual police records only. No automatic criminal labels.</span>
        </article>
        <article className="panel stat-card">
          <span className="kicker">ER:LC sync</span>
          <strong>{liveErlcState.configured ? "Live" : "Demo"}</strong>
          <span className="muted">{liveErlcState.error || "Players and JoinLogs are pulled when the server key is set."}</span>
        </article>
      </section>

      <section className="grid cols-2">
        <div className="panel stack">
          <div className="split">
            <div>
              <h3>Player Search</h3>
              <p className="muted">Select a player before adding medical, police, DOT, or fire records.</p>
            </div>
            <button className="secondary" onClick={refreshErlcData} type="button">
              Refresh API
            </button>
          </div>
          <div className="toolbar">
            <input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search username, Roblox ID, team, callsign, or location"
              value={query}
            />
          </div>
          <div className="player-list">
            {filteredPlayers.map((player) => (
              <button
                className={selectedPlayer?.id === player.id ? "player-result active" : "player-result"}
                key={player.id}
                onClick={() => setSelectedPlayerId(player.id)}
                type="button"
              >
                <span>
                  <strong>{player.username}</strong>
                  <small>
                    {player.robloxId || "No Roblox ID"} | {player.team}
                  </small>
                </span>
                <span className="badge">{player.source}</span>
              </button>
            ))}
          </div>
        </div>

        <form className="panel stack" onSubmit={submitManualPlayer}>
          <div>
            <h3>Add Player Manually</h3>
            <p className="muted">Use this when a player needs records before the API has seen them.</p>
          </div>
          <div className="toolbar vertical">
            <input
              onChange={(event) => setManualPlayer((current) => ({ ...current, username: event.target.value }))}
              placeholder="Roblox username"
              value={manualPlayer.username}
            />
            <input
              onChange={(event) => setManualPlayer((current) => ({ ...current, displayName: event.target.value }))}
              placeholder="Display name"
              value={manualPlayer.displayName}
            />
            <input
              onChange={(event) => setManualPlayer((current) => ({ ...current, robloxId: event.target.value }))}
              placeholder="Roblox user ID"
              value={manualPlayer.robloxId}
            />
            <input
              onChange={(event) => setManualPlayer((current) => ({ ...current, team: event.target.value }))}
              placeholder="Team or department"
              value={manualPlayer.team}
            />
            <button type="submit">Add Player</button>
          </div>
        </form>
      </section>

      {selectedPlayer ? (
        <section className="grid cols-2">
          <article className="panel stack">
            <div className="split">
              <div>
                <div className="kicker">Selected player</div>
                <h3>{selectedPlayer.username}</h3>
                <p className="muted">
                  {selectedPlayer.robloxId || "No Roblox ID"} | {selectedPlayer.team} | {selectedPlayer.location}
                </p>
              </div>
              <span className={selectedPlayer.wantedStars > 0 ? "badge danger" : "badge ok"}>
                Wanted stars: {selectedPlayer.wantedStars}
              </span>
            </div>
            <div className="grid cols-2 mini-grid">
              <div className="list-item">First seen: {selectedPlayer.firstSeen || "Unknown"}</div>
              <div className="list-item">Last seen: {selectedPlayer.lastSeen || "Unknown"}</div>
              <div className="list-item">Permission: {selectedPlayer.permission}</div>
              <div className="list-item">Callsign: {selectedPlayer.callsign || "None"}</div>
            </div>
            <RecordList
              empty="No medical or patient records are on file."
              records={selectedPlayer.medicalRecords}
              title="Patient Records"
            />
            <RecordList
              empty="No criminal record on file. Paralix never creates one automatically."
              records={selectedPlayer.criminalRecords}
              title="Police Criminal Records"
            />
            <RecordList empty="No DOT service records are on file." records={selectedPlayer.dotRecords} title="DOT Records" />
            <RecordList empty="No fire incident records are on file." records={selectedPlayer.fireRecords} title="Fire Records" />
          </article>

          <form className="panel stack" onSubmit={submitRecord}>
            <div>
              <h3>Add Department Record</h3>
              <p className="muted">Records are attached only to the selected player. Criminal records require this manual save.</p>
            </div>
            <div className="record-tabs">
              {recordTabs.map((tab) => (
                <button
                  className={recordType === tab.key ? "record-tab active" : "record-tab"}
                  key={tab.key}
                  onClick={() => setRecordType(tab.key)}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="toolbar vertical">
              {recordType === "medicalRecords" ? (
                <>
                  <input
                    onChange={(event) => setRecord((current) => ({ ...current, patientName: event.target.value }))}
                    placeholder="Patient name"
                    value={record.patientName}
                  />
                  <input
                    onChange={(event) => setRecord((current) => ({ ...current, age: event.target.value }))}
                    placeholder="Age"
                    value={record.age}
                  />
                  <input
                    onChange={(event) => setRecord((current) => ({ ...current, disabilities: event.target.value }))}
                    placeholder="Disabilities or accessibility needs"
                    value={record.disabilities}
                  />
                  <input
                    onChange={(event) => setRecord((current) => ({ ...current, allergies: event.target.value }))}
                    placeholder="Allergies"
                    value={record.allergies}
                  />
                  <input
                    onChange={(event) => setRecord((current) => ({ ...current, treatment: event.target.value }))}
                    placeholder="Treatment given"
                    value={record.treatment}
                  />
                </>
              ) : null}

              {recordType === "criminalRecords" ? (
                <>
                  <input
                    onChange={(event) => setRecord((current) => ({ ...current, offense: event.target.value }))}
                    placeholder="Offense or charge"
                    value={record.offense}
                  />
                  <input
                    onChange={(event) => setRecord((current) => ({ ...current, caseNumber: event.target.value }))}
                    placeholder="Case number"
                    value={record.caseNumber}
                  />
                  <input
                    onChange={(event) => setRecord((current) => ({ ...current, evidence: event.target.value }))}
                    placeholder="Evidence reference"
                    value={record.evidence}
                  />
                </>
              ) : null}

              {recordType === "dotRecords" ? (
                <>
                  <input
                    onChange={(event) => setRecord((current) => ({ ...current, vehicle: event.target.value }))}
                    placeholder="Vehicle"
                    value={record.vehicle}
                  />
                  <input
                    onChange={(event) => setRecord((current) => ({ ...current, plate: event.target.value }))}
                    placeholder="Plate"
                    value={record.plate}
                  />
                  <input
                    onChange={(event) => setRecord((current) => ({ ...current, serviceType: event.target.value }))}
                    placeholder="Tow, repair, road closure, traffic control"
                    value={record.serviceType}
                  />
                </>
              ) : null}

              {recordType === "fireRecords" ? (
                <>
                  <input
                    onChange={(event) => setRecord((current) => ({ ...current, incidentType: event.target.value }))}
                    placeholder="Incident type"
                    value={record.incidentType}
                  />
                  <input
                    onChange={(event) => setRecord((current) => ({ ...current, hazards: event.target.value }))}
                    placeholder="Hazards"
                    value={record.hazards}
                  />
                  <input
                    onChange={(event) => setRecord((current) => ({ ...current, damage: event.target.value }))}
                    placeholder="Damage assessment"
                    value={record.damage}
                  />
                </>
              ) : null}

              <select
                onChange={(event) => setRecord((current) => ({ ...current, status: event.target.value }))}
                value={record.status}
              >
                <option>Open</option>
                <option>Active</option>
                <option>Resolved</option>
                <option>Archived</option>
              </select>
              <textarea
                onChange={(event) => setRecord((current) => ({ ...current, description: event.target.value }))}
                placeholder="Description, scene summary, action taken, next steps"
                value={record.description}
              />
              <button disabled={!abilities.canManageRecords} type="submit">
                Save Record
              </button>
            </div>
          </form>
        </section>
      ) : (
        <div className="list-item">No players are available yet. Add one manually or configure the ER:LC API key.</div>
      )}
    </PageFrame>
  );
}
