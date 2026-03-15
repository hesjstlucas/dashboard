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

export const staffSeed = [
  {
    id: "s1",
    discordId: "10001",
    discordTag: "lucas#1001",
    avatar: "",
    displayName: "Lucas Hart",
    codename: "TLRP-001",
    rankKey: "directive",
    department: "Directive",
    grade: 98,
    leaderboardPoints: 220,
    staffOfWeek: 6,
    activity: 10,
    reviews: [
      { author: "Management", body: "Keeps direction clear and standards consistent." },
      { author: "IA", body: "Thorough follow-through on reports and escalations." }
    ],
    overview: {
      joinedAt: "2025-10-01",
      lastPatrol: "2026-03-14",
      patrolHours: 34,
      moderationActions: 28,
      adminActions: 16,
      shiftStatus: "On rotation"
    }
  },
  {
    id: "s2",
    discordId: "10002",
    discordTag: "nova#2012",
    avatar: "",
    displayName: "Nova Ellis",
    codename: "TLRP-002",
    rankKey: "management",
    department: "Operations",
    grade: 95,
    leaderboardPoints: 184,
    staffOfWeek: 4,
    activity: 9,
    reviews: [{ author: "Directive", body: "Reliable with events, reports, and staffing." }],
    overview: {
      joinedAt: "2025-11-11",
      lastPatrol: "2026-03-13",
      patrolHours: 29,
      moderationActions: 21,
      adminActions: 11,
      shiftStatus: "On duty"
    }
  },
  {
    id: "s3",
    discordId: "10003",
    discordTag: "asher#9988",
    avatar: "",
    displayName: "Asher Cole",
    codename: "TLRP-003",
    rankKey: "ia",
    department: "Internal Affairs",
    grade: 92,
    leaderboardPoints: 151,
    staffOfWeek: 3,
    activity: 8,
    reviews: [{ author: "Management", body: "Strong case notes and fair discipline." }],
    overview: {
      joinedAt: "2025-12-08",
      lastPatrol: "2026-03-12",
      patrolHours: 24,
      moderationActions: 17,
      adminActions: 4,
      shiftStatus: "Reviewing cases"
    }
  },
  {
    id: "s4",
    discordId: "10004",
    discordTag: "sage#4411",
    avatar: "",
    displayName: "Sage Carter",
    codename: "TLRP-004",
    rankKey: "administration",
    department: "Admin",
    grade: 88,
    leaderboardPoints: 118,
    staffOfWeek: 1,
    activity: 8,
    reviews: [{ author: "Directive", body: "Handles ER:LC admin commands confidently." }],
    overview: {
      joinedAt: "2026-01-02",
      lastPatrol: "2026-03-14",
      patrolHours: 20,
      moderationActions: 12,
      adminActions: 9,
      shiftStatus: "On duty"
    }
  },
  {
    id: "s5",
    discordId: "10005",
    discordTag: "milo#5500",
    avatar: "",
    displayName: "Milo Reid",
    codename: "TLRP-005",
    rankKey: "moderation",
    department: "Moderation",
    grade: 84,
    leaderboardPoints: 90,
    staffOfWeek: 1,
    activity: 7,
    reviews: [{ author: "Administration", body: "Good coverage; needs cleaner notes." }],
    overview: {
      joinedAt: "2026-01-19",
      lastPatrol: "2026-03-10",
      patrolHours: 15,
      moderationActions: 10,
      adminActions: 0,
      shiftStatus: "Off duty"
    }
  }
];

export const punishmentsSeed = [
  {
    id: "p1",
    targetId: "s5",
    category: "Strike",
    reason: "Skipped evidence logging after a moderation scene.",
    status: "Active",
    duration: "14 days",
    issuedById: "s3",
    issuedByRole: "Internal Affairs",
    date: "2026-03-09"
  }
];

export const activitySeed = [
  { id: "a1", title: "Night patrol review", note: "4 staff reviewed after city patrol.", when: "10m ago" },
  { id: "a2", title: "Leaderboard synced", note: "Weekly score refresh pushed to staff panel.", when: "35m ago" },
  { id: "a3", title: "Guideline updated", note: "Punishment escalation wording tightened.", when: "2h ago" }
];

export const shiftsSeed = [
  { id: "sh1", name: "North Patrol", lead: "Nova Ellis", status: "Active", window: "18:00 - 20:00", seats: "5/6" },
  { id: "sh2", name: "Training Patrol", lead: "Sage Carter", status: "Upcoming", window: "20:00 - 21:00", seats: "3/5" },
  { id: "sh3", name: "Weekend Command", lead: "Lucas Hart", status: "Planning", window: "Saturday 19:00", seats: "2/4" }
];

export const loaSeed = [
  { id: "l1", staff: "TLRP-004", reason: "School schedule", status: "Approved", range: "Mar 18 - Mar 24" },
  { id: "l2", staff: "TLRP-005", reason: "Family trip", status: "Pending", range: "Mar 21 - Mar 23" }
];

export const auditSeed = [
  { id: "log1", event: "Grade updated", actor: "TLRP-002", target: "TLRP-005", when: "Today 11:10", detail: "84 -> 86" },
  { id: "log2", event: "Punishment issued", actor: "TLRP-003", target: "TLRP-005", when: "Today 09:30", detail: "Strike created" },
  { id: "log3", event: "Leaderboard points added", actor: "TLRP-002", target: "TLRP-004", when: "Yesterday", detail: "+12 points" }
];

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
  activeStaffId: "s1",
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

export function getPublicStaffView(member) {
  return member;
}

export function resolveStaffByDiscordId(discordId) {
  return staffSeed.find((member) => member.discordId === discordId) || null;
}

export function buildLeaderboard(staff) {
  return [...staff]
    .map((member) => ({
      ...member,
      combinedScore:
        member.grade * 4 +
        member.leaderboardPoints +
        member.staffOfWeek * 12 +
        member.activity * 10 +
        member.reviews.length * 8
    }))
    .sort((left, right) => right.combinedScore - left.combinedScore);
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
    serverName: "TLRP City",
    activePlayers: 31,
    moderationQueue: 2,
    adminFlags: 1
  };
}

export function getDiscordSummary() {
  return {
    guildName: "TLRP Community",
    onlineMembers: 187,
    pendingTickets: 6,
    dmService: "Ready"
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
