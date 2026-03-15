"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  GUIDELINES,
  initialState,
  buildLeaderboard,
  createPunishmentRecord
} from "@/lib/mock-data";
import {
  canEditGrade,
  canIssuePunishment,
  getRank
} from "@/lib/permissions";

const STORAGE_KEY = "tlrp-dashboard-demo-state";

const DemoContext = createContext(null);

export function DemoProvider({ children }) {
  const [state, setState] = useState(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [hydrated, state]);

  const value = useMemo(() => {
    const currentUser =
      state.staff.find((member) => member.id === state.activeUserId) || state.staff[0];
    const currentRank = getRank(currentUser.rankKey);
    const leaderboard = buildLeaderboard(state.staff);

    function setActiveUserId(activeUserId) {
      setState((current) => ({ ...current, activeUserId }));
    }

    function resetDemo() {
      setState(initialState);
    }

    function updateGrade(targetId, nextGrade) {
      setState((current) => {
        const target = current.staff.find((member) => member.id === targetId);
        if (!target || !canEditGrade(currentUser.rankKey, target.rankKey)) {
          return current;
        }

        return {
          ...current,
          staff: current.staff.map((member) =>
            member.id === targetId
              ? {
                  ...member,
                  grade: Math.max(0, Math.min(100, Number(nextGrade) || 0))
                }
              : member
          )
        };
      });
    }

    function issuePunishment(targetId, payload) {
      setState((current) => {
        const target = current.staff.find((member) => member.id === targetId);
        if (!target || !canIssuePunishment(currentUser.rankKey, target.rankKey)) {
          return current;
        }

        return {
          ...current,
          punishments: [
            createPunishmentRecord({
              ...payload,
              targetId,
              targetName: target.name,
              issuedBy: currentUser.name
            }),
            ...current.punishments
          ]
        };
      });
    }

    return {
      ...state,
      currentUser,
      currentRank,
      guidelines: GUIDELINES,
      leaderboard,
      setActiveUserId,
      updateGrade,
      issuePunishment,
      resetDemo
    };
  }, [state, hydrated]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error("useDemo must be used within DemoProvider.");
  }
  return context;
}
