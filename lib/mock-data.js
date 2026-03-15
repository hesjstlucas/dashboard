import { RANKS } from "@/lib/permissions";

export const GUIDELINES = [
  {
    id: "g1",
    title: "Patrol Standards",
    content:
      "Clock patrol sessions accurately, keep ER:LC callouts clean, and escalate scenes with written notes when incidents turn administrative."
  },
  {
    id: "g2",
    title: "Staff Reviews",
    content:
      "Reviews should cover professionalism, activity, command usage, and reliability. Keep criticism specific and actionable."
  },
  {
    id: "g3",
    title: "Infractions Ladder",
    content:
      "Escalate proportionally: coaching, infraction, strike, demotion, suspension. Repeat conduct without improvement should always be documented."
  },
  {
    id: "g4",
    title: "Discord Communication",
    content:
      "Keep internal channels readable, avoid public staff disputes, and use DMs only for actionable follow-ups or disciplinary notifications."
  }
];

export const staffSeed = [];

export const punishmentsSeed = [];

export const activitySeed = [];

export const shiftsSeed = [];

export const loaSeed = [];

export const auditSeed = [];

export const integrationsSeed = [
  {
    id: "int1",
    title: "Discord",
    status: "Ready",
    description: "DM queue, staff role sync, and announcement webhooks."
  },
  {
    id: "int2",
    title: "ER:LC",
    status: "Demo",
    description: "Moderation and admin command launcher with endpoint fallback."
  },
  {
    id: "int3",
    title: "Reviews",
    status: "Synced",
    description: "Internal review snapshots feeding grades and leaderboard scoring."
  }
];

export const settingsSeed = [
  { id: "set1", name: "Anonymous roster mode", value: "Off", note: "Staff names are visible in the current preview." },
  { id: "set2", name: "Discord DM punishments", value: "On", note: "Uses the Discord DM route when configured." },
  { id: "set3", name: "Leaderboard weekly refresh", value: "Friday 20:00", note: "Management can still grant manual points." }
];

export const erlcCommandTemplates = {
  moderation: [
    { label: "Warn user", command: ":warn {user} Please follow server rules." },
    { label: "Kick user", command: ":kick {user} Rejoin when ready to comply." },
    { label: "Bring user", command: ":bring {user}" }
  ],
  administration: [
    { label: "Announce restart", command: ":announce Server restart in 5 minutes." },
    { label: "Set priority", command: ":priority set {status}" },
    { label: "Server message", command: ":m {message}" }
  ]
};

export const initialState = {
  staff: staffSeed,
  punishments: punishmentsSeed,
  guidelines: GUIDELINES,
  activityFeed: activitySeed,
  shifts: shiftsSeed,
  loaRequests: loaSeed,
  auditLogs: auditSeed,
  integrations: integrationsSeed,
  settings: settingsSeed
};

export function getPublicStaffView(member, revealIdentity = false) {
  return {
    ...member,
    displayName: revealIdentity ? member.displayName : member.codename,
    discordTag: revealIdentity ? member.discordTag : "Hidden until Discord login"
  };
}

export function resolveStaffByDiscordId(discordId) {
  return staffSeed.find((member) => member.discordId === discordId) || null;
}

export function buildLeaderboard(staff) {
  return [...staff]
    .map((member) => ({
      ...member,
      combinedScore:
        member.grade === null &&
        member.leaderboardPoints === null &&
        member.staffOfWeek === null &&
        member.activity === null &&
        member.reviews.length === 0
          ? null
          : (member.grade || 0) * 4 +
            (member.leaderboardPoints || 0) +
            (member.staffOfWeek || 0) * 12 +
            (member.activity || 0) * 10 +
            member.reviews.length * 8
    }))
    .sort((left, right) => (right.combinedScore || -1) - (left.combinedScore || -1));
}

export function createPunishmentRecord({ targetId, category, reason, status, duration, issuedById }) {
  return {
    id: `p${Date.now()}`,
    targetId,
    category,
    reason: reason || "No reason provided.",
    status,
    duration,
    issuedById,
    date: new Date().toISOString().slice(0, 10)
  };
}

export function createActivityEntry(title, note) {
  return {
    id: `a${Date.now()}`,
    title,
    note,
    when: "Just now"
  };
}

export function createAuditEntry(event, actor, target, detail) {
  return {
    id: `log${Date.now()}`,
    event,
    actor,
    target,
    when: "Just now",
    detail
  };
}

export function getErlcSummary() {
  return {
    serverName: "Not connected",
    activePlayers: null,
    moderationQueue: null,
    adminFlags: null
  };
}

export function getDiscordSummary() {
  return {
    guildName: "Not connected",
    onlineMembers: null,
    pendingTickets: null,
    dmService: "Unavailable"
  };
}

export function getRankCards() {
  return RANKS.map((rank) => ({
    ...rank,
    powers: {
      moderation: rank.level >= 1,
      admin: rank.level >= 2,
      grades: rank.level >= 3,
      punishment: rank.level >= 3,
      leaderboard: rank.level >= 4,
      guidelines: rank.level >= 5
    }
  }));
}
