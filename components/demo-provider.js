"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  buildLeaderboard,
  createActivityEntry,
  createApplicationRecord,
  createAuditEntry,
  createDepartmentReport,
  createManualPlayer,
  createPlayerRecord,
  createPunishmentRecord,
  getPublicStaffView,
  initialState,
  mergePlayers,
  normalizeErlcServerData
} from "@/lib/mock-data";
import { createGuidelineLink, normalizeGuidelines } from "@/lib/guidelines";
import {
  abilitySummary,
  canChangeGrades,
  canEditGuidelines,
  canGrantLeaderboardPoints,
  canIssuePunishment,
  canManageDepartmentRanks,
  canManageRecords,
  canReviewApplications,
  canViewIdentities,
  getRank
} from "@/lib/permissions";

const STORAGE_KEY = "paralix-operations-state-v1";
const DemoContext = createContext(null);
const ERLC_FULL_QUERY =
  "/api/erlc?Players=true&Staff=true&JoinLogs=true&Queue=true&KillLogs=true&CommandLogs=true&ModCalls=true&EmergencyCalls=true&Vehicles=true";

function hydrateState(savedState) {
  return {
    ...initialState,
    ...savedState,
    staff: Array.isArray(savedState?.staff) ? savedState.staff : initialState.staff,
    players: Array.isArray(savedState?.players) ? savedState.players : initialState.players,
    departmentMembers: Array.isArray(savedState?.departmentMembers)
      ? savedState.departmentMembers
      : initialState.departmentMembers,
    applications: Array.isArray(savedState?.applications) ? savedState.applications : initialState.applications,
    emergencyCalls: Array.isArray(savedState?.emergencyCalls) ? savedState.emergencyCalls : initialState.emergencyCalls,
    modCalls: Array.isArray(savedState?.modCalls) ? savedState.modCalls : initialState.modCalls,
    departmentReports: Array.isArray(savedState?.departmentReports)
      ? savedState.departmentReports
      : initialState.departmentReports,
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
  const [liveErlcState, setLiveErlcState] = useState({
    loaded: false,
    loading: false,
    configured: false,
    source: "demo",
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

  const refreshErlcData = useCallback(async () => {
    setLiveErlcState((current) => ({
      ...current,
      loading: true,
      error: null
    }));

    try {
      const response = await fetch(ERLC_FULL_QUERY, { cache: "no-store" });
      const data = await response.json();

      setLiveErlcState({
        loaded: true,
        loading: false,
        configured: Boolean(data.configured),
        source: data.source || "demo",
        error: data.error || null
      });

      if (data.configured && data.data) {
        const normalized = normalizeErlcServerData(data.data);
        setState((current) => ({
          ...current,
          players: mergePlayers(current.players, normalized.players),
          emergencyCalls: normalized.emergencyCalls,
          modCalls: normalized.modCalls,
          erlcServer: normalized.server,
          activityFeed: [
            createActivityEntry(
              "ER:LC API synced",
              `${normalized.players.length} player sightings, ${normalized.emergencyCalls.length} emergency calls, ${normalized.modCalls.length} mod calls`
            ),
            ...current.activityFeed
          ].slice(0, 40)
        }));
      }
    } catch (error) {
      setLiveErlcState({
        loaded: true,
        loading: false,
        configured: false,
        source: "demo",
        error: error.message
      });
    }
  }, []);

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
    refreshErlcData();
  }, [refreshErlcData]);

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

        if (Array.isArray(data.staff) && data.staff.length) {
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
    const localPreview = sessionState.loaded && !sessionState.configured && !sessionState.authenticated;
    const linkedStaff =
      state.staff.find(
        (member) =>
          member.id === sessionState.session?.linkedStaffId ||
          member.discordId === sessionState.session?.discordUser?.id
      ) || null;
    const sessionRankKey = sessionState.authenticated
      ? sessionState.session?.rankKey || "guest"
      : localPreview
        ? "directive"
        : "guest";
    const sessionRank = getRank(sessionRankKey);
    const currentUser = linkedStaff
      ? {
          ...linkedStaff,
          rankKey: sessionRankKey,
          department: linkedStaff.department || sessionRank.label
        }
      : {
          id: localPreview ? "local-director-preview" : sessionState.session?.discordUser?.id || "guest",
          rankKey: sessionRankKey,
          displayName: localPreview
            ? "Local Director Preview"
            : sessionState.session?.discordUser?.globalName || "Guest",
          codename: localPreview ? "PX-DIR-PREVIEW" : "PX-Guest",
          discordTag: sessionState.session?.discordUser?.username || "No Discord account linked",
          department: localPreview ? "Offline Preview" : sessionRank.label,
          grade: localPreview ? 100 : 0,
          leaderboardPoints: 0,
          staffOfWeek: 0,
          activity: localPreview ? 10 : 0,
          reviews: [],
          overview: {
            joinedAt: "-",
            lastPatrol: "-",
            patrolHours: 0,
            moderationActions: 0,
            adminActions: 0,
            shiftStatus: localPreview ? "Full local access" : "Not linked"
          }
        };

    const revealIdentity = canViewIdentities(sessionState.authenticated || localPreview);
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
      const target =
        current.staff.find((member) => member.id === targetId) ||
        current.players.find((player) => player.id === targetId) ||
        current.applications.find((application) => application.id === targetId);
      const targetName = target?.codename || target?.displayName || target?.username || target?.applicantName || targetId;
      return {
        ...current,
        auditLogs: [createAuditEntry(event, currentUser.codename, targetName, detail), ...current.auditLogs],
        activityFeed: [createActivityEntry(event, detail), ...current.activityFeed].slice(0, 40)
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
          staff: current.staff.map((member) => (member.id === targetId ? { ...member, grade: parsed } : member))
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
          message: `Paralix Notice: You received a ${payload.category}. Reason: ${payload.reason || "No reason provided."} Status: ${payload.status}. Duration: ${payload.duration}.`
        })
      });

      return { ok: true };
    }

    function addManualPlayer(payload) {
      const player = createManualPlayer(payload);
      setState((current) =>
        addAuditAndActivity(
          {
            ...current,
            players: mergePlayers(current.players, [player])
          },
          "Manual player added",
          player.id,
          `${player.username} was added to the player vault`
        )
      );
      return player.id;
    }

    function addPlayerRecord(playerId, recordType, payload) {
      if (!canManageRecords(currentUser.rankKey)) {
        return false;
      }

      const allowedTypes = ["medicalRecords", "criminalRecords", "dotRecords", "fireRecords"];
      if (!allowedTypes.includes(recordType)) {
        return false;
      }

      const record = createPlayerRecord(recordType, payload, currentUser.displayName);
      setState((current) => {
        const target = current.players.find((player) => player.id === playerId);
        if (!target) {
          return current;
        }

        const next = {
          ...current,
          players: current.players.map((player) =>
            player.id === playerId
              ? {
                  ...player,
                  [recordType]: [record, ...(player[recordType] || [])]
                }
              : player
          )
        };

        return addAuditAndActivity(
          next,
          recordType === "criminalRecords" ? "Criminal record manually added" : "Player record added",
          playerId,
          `${recordType.replace("Records", "")} record saved by ${currentUser.displayName}`
        );
      });

      return true;
    }

    function submitApplication(payload) {
      const application = createApplicationRecord(payload);
      setState((current) =>
        addAuditAndActivity(
          {
            ...current,
            applications: [application, ...current.applications]
          },
          "Application submitted",
          application.id,
          `${application.applicantName} applied for ${application.departmentId}`
        )
      );
      return application.id;
    }

    function reviewApplication(applicationId, status, reviewerNote = "") {
      if (!canReviewApplications(currentUser.rankKey)) {
        return false;
      }

      setState((current) => {
        const next = {
          ...current,
          applications: current.applications.map((application) =>
            application.id === applicationId
              ? {
                  ...application,
                  status,
                  reviewerNote,
                  reviewedBy: currentUser.displayName,
                  reviewedAt: new Date().toISOString().slice(0, 10)
                }
              : application
          )
        };

        return addAuditAndActivity(next, "Application reviewed", applicationId, `Status changed to ${status}`);
      });

      return true;
    }

    function promoteDepartmentMember(memberId) {
      if (!canManageDepartmentRanks(currentUser.rankKey)) {
        return false;
      }

      setState((current) => {
        const target = current.departmentMembers.find((member) => member.id === memberId);
        if (!target) {
          return current;
        }

        const next = {
          ...current,
          departmentMembers: current.departmentMembers.map((member) =>
            member.id === memberId ? { ...member, rankIndex: Math.min(member.rankIndex + 1, 6) } : member
          )
        };

        return addAuditAndActivity(next, "Department promotion", target.playerId, `${memberId} promoted one rank`);
      });

      return true;
    }

    function demoteDepartmentMember(memberId) {
      if (!canManageDepartmentRanks(currentUser.rankKey)) {
        return false;
      }

      setState((current) => {
        const target = current.departmentMembers.find((member) => member.id === memberId);
        if (!target) {
          return current;
        }

        const next = {
          ...current,
          departmentMembers: current.departmentMembers.map((member) =>
            member.id === memberId ? { ...member, rankIndex: Math.max(member.rankIndex - 1, 0) } : member
          )
        };

        return addAuditAndActivity(next, "Department demotion", target.playerId, `${memberId} demoted one rank`);
      });

      return true;
    }

    function addDepartmentReport(departmentId, payload) {
      if (!abilities.canViewDepartmentDashboards) {
        return false;
      }

      const report = createDepartmentReport(departmentId, payload, currentUser.displayName);
      setState((current) =>
        addAuditAndActivity(
          {
            ...current,
            departmentReports: [report, ...current.departmentReports]
          },
          "Department report created",
          payload.linkedPlayerId || departmentId,
          `${report.title} saved in ${departmentId}`
        )
      );
      return true;
    }

    function updateGuideline(id, content) {
      setState((current) => {
        if (!canEditGuidelines(currentUser.rankKey)) {
          return current;
        }

        const next = {
          ...current,
          guidelines: current.guidelines.map((entry) => (entry.id === id ? { ...entry, content } : entry))
        };

        return addAuditAndActivity(next, "Guideline updated", currentUser.id, "Directive edited handbook content");
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
            entry.id === guidelineId ? { ...entry, links: [...entry.links, createGuidelineLink()] } : entry
          )
        };

        return addAuditAndActivity(next, "Guideline website added", guidelineId, "Directive added a handbook website button");
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
                  links: entry.links.map((link) => (link.id === linkId ? { ...link, [field]: value } : link))
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
            entry.id === guidelineId ? { ...entry, links: entry.links.filter((link) => link.id !== linkId) } : entry
          )
        };

        return addAuditAndActivity(next, "Guideline website removed", guidelineId, "Directive removed a handbook website button");
      });
    }

    return {
      ...state,
      visibleStaff,
      currentUser,
      leaderboard,
      abilities,
      localPreview,
      liveStaffState,
      liveErlcState,
      sessionState,
      refreshSession,
      refreshErlcData,
      logout,
      updateGrade,
      issuePunishment,
      addLeaderboardPoints,
      addManualPlayer,
      addPlayerRecord,
      submitApplication,
      reviewApplication,
      promoteDepartmentMember,
      demoteDepartmentMember,
      addDepartmentReport,
      updateGuideline,
      addGuidelineLink,
      updateGuidelineLink,
      removeGuidelineLink
    };
  }, [state, sessionState, liveStaffState, liveErlcState, refreshErlcData]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error("useDemo must be used within DemoProvider.");
  }
  return context;
}
