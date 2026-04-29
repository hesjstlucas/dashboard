"use client";

import { useMemo, useState } from "react";
import { erlcCommandTemplates } from "@/lib/mock-data";
import { useDemo } from "@/components/demo-provider";

export function CommandBar() {
  const { abilities, recordCommandAction } = useDemo();
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

    setResult(recordCommandAction(selectedCommand) || "No command note was saved.");
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
          placeholder={commands.length ? "Search command notes..." : "Link Discord or use local preview to save command notes"}
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
