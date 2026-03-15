import { RANKS } from "@/lib/permissions";

export const GUIDELINES = [
  {
    id: "g1",
    title: "Patrol Standards",
    content:
      "Clock patrol sessions accurately, keep ER:LC calls professional, and document supervisor follow-up when incidents escalate."
  },
  {
    id: "g2",
    title: "Moderation Ladder",
    content:
      "Use warnings and informal coaching first, then apply infractions, strikes, demotions, or suspensions based on severity and repeat behavior."
  },
  {
    id: "g3",
    title: "Discord Conduct",
    content:
      "Keep staff channels clean, avoid public staff disputes, and move disciplinary discussion into logged internal channels."
  },
  {
    id: "g4",
    title: "Review Cycle",
    content:
      "Every staff member should receive regular written feedback covering activity, maturity, and command performance."
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
      { author: "Management", body: "Sets the direction and keeps systems moving." },
      { author: "IA", body: "Consistent documentation and strong follow-through." }
    ],
    overview: {
      joinedAt: "2025-10-01",
      lastPatrol: "2026-03-14",
      patrolHours: 34,
      moderationActions: 28,
      adminActions: 16
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
    reviews: [
      { author: "Directive", body: "Reliable with staff development and event support." }
    ],
    overview: {
      joinedAt: "2025-11-11",
      lastPatrol: "2026-03-13",
      patrolHours: 29,
      moderationActions: 21,
      adminActions: 11
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
    reviews: [
      { author: "Management", body: "Strong investigative notes and fair case handling." }
    ],
    overview: {
      joinedAt: "2025-12-08",
      lastPatrol: "2026-03-12",
      patrolHours: 24,
      moderationActions: 17,
      adminActions: 4
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
    reviews: [
      { author: "Directive", body: "Good ER:LC command handling and shift coverage." }
    ],
    overview: {
      joinedAt: "2026-01-02",
      lastPatrol: "2026-03-14",
      patrolHours: 20,
      moderationActions: 12,
      adminActions: 9
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
    reviews: [
      { author: "Administration", body: "Needs cleaner notes, but solid patrol coverage." }
    ],
    overview: {
      joinedAt: "2026-01-19",
      lastPatrol: "2026-03-10",
      patrolHours: 15,
      moderationActions: 10,
      adminActions: 0
    }
  }
];

export const punishmentsSeed = [
  {
    id: "p1",
    targetId: "s5",
    category: "Strike",
    reason: "Skipped evidence logging after a moderation incident.",
    status: "Active",
    duration: "14 days",
    issuedById: "s3",
    issuedByRole: "Internal Affairs",
    date: "2026-03-09"
  }
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
  guidelines: GUIDELINES
};

export function getPublicStaffView(member, revealIdentity) {
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

export function createReview(author, body) {
  return { author, body };
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
