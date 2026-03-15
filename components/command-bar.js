"use client";

import { useMemo, useState } from "react";
import { erlcCommandTemplates } from "@/lib/mock-data";
import { useDemo } from "@/components/demo-provider";

export function CommandBar() {
  const { abilities } = useDemo();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");

  const commands = useMemo(() => {
    const output = [];

    if (abilities.canRunModerationCommands) {
      output.push(...erlcCommandTemplates.moderation);
    }
    if (abilities.canRunAdminCommands) {
      output.push(...erlcCommandTemplates.administration);
    }

    return output;
  }, [abilities]);

  const suggestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return commands.slice(0, 5);
    }

    return commands
      .filter((entry) =>
        `${entry.label} ${entry.command}`.toLowerCase().includes(normalized)
      )
      .slice(0, 5);
  }, [commands, query]);

  async function submit(selectedCommand = query) {
    if (!selectedCommand.trim()) {
      return;
    }

    const response = await fetch("/api/erlc/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        command: selectedCommand,
        audience: abilities.canRunAdminCommands ? "admin" : "moderation"
      })
    });

    const data = await response.json();
    setResult(data.result || data.error || JSON.stringify(data));
    setQuery(selectedCommand);
  }

  return (
    <div className="panel command-bar">
      <div className="command-bar-head">
        <div>
          <div className="kicker">Command Bar</div>
          <strong>Type a command or pick a suggestion</strong>
        </div>
        <span className="badge ok">{commands.length ? `${commands.length} available` : "No access"}</span>
      </div>
      <div className="command-bar-body">
        <input
          disabled={!commands.length}
          list="command-suggestions"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              submit();
            }
          }}
          placeholder={commands.length ? "Search commands..." : "Log in with Discord to use commands"}
          value={query}
        />
        <datalist id="command-suggestions">
          {commands.map((entry) => (
            <option key={entry.label} value={entry.command}>
              {entry.label}
            </option>
          ))}
        </datalist>
        <button disabled={!commands.length || !query.trim()} onClick={() => submit()} type="button">
          Run
        </button>
      </div>
      <div className="command-suggestions">
        {suggestions.map((entry) => (
          <button
            className="command-suggestion"
            key={entry.label}
            onClick={() => submit(entry.command)}
            type="button"
          >
            <span>{entry.label}</span>
            <small>{entry.command}</small>
          </button>
        ))}
      </div>
      {result ? <div className="list-item">{result}</div> : null}
    </div>
  );
}
