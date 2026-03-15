"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  buildLeaderboard,
  createActivityEntry,
  createAuditEntry,
  createPunishmentRecord,
  getPublicStaffView,
  initialState
} from "@/lib/mock-data";
import {
  abilitySummary,
  canChangeGrades,
  canEditGuidelines,
  canGrantLeaderboardPoints,
  canIssuePunishment
} from "@/lib/permissions";

const STORAGE_KEY = "tlrp-dashboard-state-v3";
const DemoContext = createContext(null);

export function DemoProvider({ children }) {
  const [state, setState] = useState(initialState);
  const [storageLoaded, setStorageLoaded] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setStorageLoaded(true);
  }, []);

  useEffect(() => {
    if (storageLoaded) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, storageLoaded]);

  const value = useMemo(() => {
    const currentUser =
      state.staff.find((member) => member.id === state.activeStaffId) || state.staff[0];
    const visibleStaff = state.staff.map((member) => getPublicStaffView(member));
    const leaderboard = buildLeaderboard(visibleStaff);
    const abilities = abilitySummary(currentUser.rankKey);

    function setActiveStaffId(activeStaffId) {
      setState((current) => ({ ...current, activeStaffId }));
    }

    function addAuditAndActivity(current, event, targetId, detail) {
      const target = current.staff.find((member) => member.id === targetId);
      return {
        ...current,
        auditLogs: [
          createAuditEntry(event, currentUser.codename, target?.codename || targetId, detail),
          ...current.auditLogs
        ],
        activityFeed: [
          createActivityEntry(event, detail),
          ...current.activityFeed
        ]
      };
    }

    function addLeaderboardPoints(targetId, amount) {
      setState((current) => {
        const target = current.staff.find((member) => member.id === targetId);
        if (!target || !canGrantLeaderboardPoints(currentUser.rankKey, target.rankKey)) {
          return current;
        }

        const next = {
          ...current,
          staff: current.staff.map((member) =>
            member.id === targetId
              ? { ...member, leaderboardPoints: Math.max(0, member.leaderboardPoints + amount) }
              : member
          )
        };

        return addAuditAndActivity(next, "Leaderboard points updated", targetId, `${amount >= 0 ? "+" : ""}${amount} points`);
      });
    }

    function updateGrade(targetId, nextGrade) {
      setState((current) => {
        const target = current.staff.find((member) => member.id === targetId);
        if (!target || !canChangeGrades(currentUser.rankKey, target.rankKey)) {
          return current;
        }

        const parsed = Math.max(0, Math.min(100, Number(nextGrade) || 0));
        const next = {
          ...current,
          staff: current.staff.map((member) =>
            member.id === targetId ? { ...member, grade: parsed } : member
          )
        };

        return addAuditAndActivity(next, "Grade updated", targetId, `Grade set to ${parsed}%`);
      });
    }

    async function issuePunishment(targetId, payload) {
      const target = state.staff.find((member) => member.id === targetId);
      if (!target || !canIssuePunishment(currentUser.rankKey, target.rankKey)) {
        return { ok: false };
      }

      const nextEntry = createPunishmentRecord({
        targetId,
        category: payload.category,
        reason: payload.reason,
        status: payload.status,
        duration: payload.duration,
        issuedById: currentUser.id
      });

      setState((current) => {
        const next = {
          ...current,
          punishments: [nextEntry, ...current.punishments]
        };

        return addAuditAndActivity(
          next,
          "Punishment issued",
          targetId,
          `${payload.category} • ${payload.reason || "No reason provided."}`
        );
      });

      await fetch("/api/discord/dm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discordId: target.discordId,
          message: `TLRP Notice: You received a ${payload.category}. Reason: ${payload.reason || "No reason provided."} Status: ${payload.status}. Duration: ${payload.duration}.`
        })
      });

      return { ok: true };
    }

    function updateGuideline(id, content) {
      setState((current) => {
        if (!canEditGuidelines(currentUser.rankKey)) {
          return current;
        }

        const next = {
          ...current,
          guidelines: current.guidelines.map((entry) =>
            entry.id === id ? { ...entry, content } : entry
          )
        };

        return addAuditAndActivity(next, "Guideline updated", currentUser.id, "Directive edited handbook content");
      });
    }

    return {
      ...state,
      visibleStaff,
      currentUser,
      leaderboard,
      abilities,
      setActiveStaffId,
      updateGrade,
      issuePunishment,
      addLeaderboardPoints,
      updateGuideline
    };
  }, [state]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error("useDemo must be used within DemoProvider.");
  }
  return context;
}
