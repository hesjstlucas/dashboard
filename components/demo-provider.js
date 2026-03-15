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
import { createGuidelineLink, normalizeGuidelines } from "@/lib/guidelines";
import {
  abilitySummary,
  canChangeGrades,
  canEditGuidelines,
  canGrantLeaderboardPoints,
  canIssuePunishment,
  canViewIdentities,
  getRank
} from "@/lib/permissions";

const STORAGE_KEY = "tlrp-dashboard-state-v5";
const DemoContext = createContext(null);

function hydrateState(savedState) {
  return {
    ...initialState,
    ...savedState,
    guidelines: normalizeGuidelines(savedState?.guidelines ?? initialState.guidelines)
  };
}

function mergeStaffWithStoredValues(liveStaff, storedStaff) {
  const storedByDiscordId = new Map(storedStaff.map((member) => [member.discordId, member]));

  return liveStaff.map((member) => {
    const stored = storedByDiscordId.get(member.discordId);
    if (!stored) {
      return member;
    }

    return {
      ...member,
      grade: stored.grade ?? member.grade,
      leaderboardPoints: stored.leaderboardPoints ?? member.leaderboardPoints,
      staffOfWeek: stored.staffOfWeek ?? member.staffOfWeek,
      activity: stored.activity ?? member.activity,
      reviews: Array.isArray(stored.reviews) ? stored.reviews : member.reviews,
      overview: {
        ...member.overview,
        lastPatrol: stored.overview?.lastPatrol ?? member.overview.lastPatrol,
        patrolHours: stored.overview?.patrolHours ?? member.overview.patrolHours,
        moderationActions: stored.overview?.moderationActions ?? member.overview.moderationActions,
        adminActions: stored.overview?.adminActions ?? member.overview.adminActions
      }
    };
  });
}

export function DemoProvider({ children }) {
  const [state, setState] = useState(initialState);
  const [storageLoaded, setStorageLoaded] = useState(false);
  const [liveStaffState, setLiveStaffState] = useState({
    loaded: false,
    configured: false,
    error: null
  });
  const [sessionState, setSessionState] = useState({
    loaded: false,
    authenticated: false,
    configured: false,
    session: null
  });

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setState(hydrateState(JSON.parse(saved)));
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

  useEffect(() => {
    let mounted = true;

    fetch("/api/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (mounted) {
          setSessionState({ loaded: true, ...data });
        }
      })
      .catch(() => {
        if (mounted) {
          setSessionState({
            loaded: true,
            authenticated: false,
            configured: false,
            session: null
          });
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    fetch("/api/staff", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (!mounted) {
          return;
        }

        setLiveStaffState({
          loaded: true,
          configured: Boolean(data.configured),
          error: data.error || null
        });

        if (Array.isArray(data.staff)) {
          setState((current) => ({
            ...current,
            staff: mergeStaffWithStoredValues(data.staff, current.staff)
          }));
        }
      })
      .catch((error) => {
        if (mounted) {
          setLiveStaffState({
            loaded: true,
            configured: false,
            error: error.message
          });
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(() => {
    const linkedStaff =
      state.staff.find(
        (member) =>
          member.id === sessionState.session?.linkedStaffId ||
          member.discordId === sessionState.session?.discordUser?.id
      ) || null;
    const sessionRankKey = sessionState.session?.rankKey || "guest";
    const sessionRank = getRank(sessionRankKey);
    const currentUser = linkedStaff
      ? {
          ...linkedStaff,
          rankKey: sessionRankKey,
          department: sessionRank.label
        }
      : {
          id: sessionState.authenticated ? sessionState.session?.discordUser?.id || "discord-user" : "guest",
          rankKey: sessionRankKey,
          displayName: sessionState.session?.discordUser?.globalName || "Guest",
          codename: "TLRP-Guest",
          discordTag: sessionState.session?.discordUser?.username || "No Discord account linked",
          department: sessionRank.label,
          grade: 0,
          leaderboardPoints: 0,
          staffOfWeek: 0,
          activity: 0,
          reviews: [],
          overview: {
            joinedAt: "-",
            lastPatrol: "-",
            patrolHours: 0,
            moderationActions: 0,
            adminActions: 0,
            shiftStatus: sessionState.authenticated ? "Role-linked" : "Not linked"
          }
        };

    const revealIdentity = canViewIdentities(sessionState.authenticated);
    const visibleStaff = state.staff.map((member) => getPublicStaffView(member, revealIdentity));
    const leaderboard = buildLeaderboard(visibleStaff);
    const abilities = abilitySummary(currentUser.rankKey);

    async function refreshSession() {
      const response = await fetch("/api/session", { cache: "no-store" });
      const data = await response.json();
      setSessionState({ loaded: true, ...data });
    }

    async function logout() {
      await fetch("/api/auth/logout", { method: "POST" });
      await refreshSession();
    }

    function addAuditAndActivity(current, event, targetId, detail) {
      const target = current.staff.find((member) => member.id === targetId);
      return {
        ...current,
        auditLogs: [
          createAuditEntry(event, currentUser.codename, target?.codename || targetId, detail),
          ...current.auditLogs
        ],
        activityFeed: [createActivityEntry(event, detail), ...current.activityFeed]
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

        return addAuditAndActivity(
          next,
          "Leaderboard points updated",
          targetId,
          `${amount >= 0 ? "+" : ""}${amount} points`
        );
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
          `${payload.category} | ${payload.reason || "No reason provided."}`
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

        return addAuditAndActivity(
          next,
          "Guideline updated",
          currentUser.id,
          "Directive edited handbook content"
        );
      });
    }

    function addGuidelineLink(guidelineId) {
      setState((current) => {
        if (!canEditGuidelines(currentUser.rankKey)) {
          return current;
        }

        const next = {
          ...current,
          guidelines: current.guidelines.map((entry) =>
            entry.id === guidelineId
              ? { ...entry, links: [...entry.links, createGuidelineLink()] }
              : entry
          )
        };

        return addAuditAndActivity(
          next,
          "Guideline website added",
          guidelineId,
          "Directive added a handbook website button"
        );
      });
    }

    function updateGuidelineLink(guidelineId, linkId, field, value) {
      if (!["label", "url"].includes(field)) {
        return;
      }

      setState((current) => {
        if (!canEditGuidelines(currentUser.rankKey)) {
          return current;
        }

        return {
          ...current,
          guidelines: current.guidelines.map((entry) =>
            entry.id === guidelineId
              ? {
                  ...entry,
                  links: entry.links.map((link) =>
                    link.id === linkId ? { ...link, [field]: value } : link
                  )
                }
              : entry
          )
        };
      });
    }

    function removeGuidelineLink(guidelineId, linkId) {
      setState((current) => {
        if (!canEditGuidelines(currentUser.rankKey)) {
          return current;
        }

        const next = {
          ...current,
          guidelines: current.guidelines.map((entry) =>
            entry.id === guidelineId
              ? { ...entry, links: entry.links.filter((link) => link.id !== linkId) }
              : entry
          )
        };

        return addAuditAndActivity(
          next,
          "Guideline website removed",
          guidelineId,
          "Directive removed a handbook website button"
        );
      });
    }

    return {
      ...state,
      visibleStaff,
      currentUser,
      leaderboard,
      abilities,
      liveStaffState,
      sessionState,
      refreshSession,
      logout,
      updateGrade,
      issuePunishment,
      addLeaderboardPoints,
      updateGuideline,
      addGuidelineLink,
      updateGuidelineLink,
      removeGuidelineLink
    };
  }, [state, sessionState]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error("useDemo must be used within DemoProvider.");
  }
  return context;
}
