export const GUIDELINES = [
  {
    title: "Attendance",
    items: [
      "Log patrol activity honestly and on time.",
      "Notify leadership before missing a scheduled shift.",
      "Keep gradebook evidence for every patrol session."
    ]
  },
  {
    title: "Moderation",
    items: [
      "Use clear, proportional punishments tied to policy.",
      "Escalate repeat incidents through the strike ladder.",
      "Document every moderation action with a reason."
    ]
  },
  {
    title: "Leadership",
    items: [
      "Review staff grades weekly and coach low performers.",
      "Use demotions only when retraining has failed or trust is broken.",
      "Keep Discord and ER:LC rosters aligned."
    ]
  },
  {
    title: "Professionalism",
    items: [
      "Stay respectful in-game and on Discord.",
      "Avoid public arguments about staff actions.",
      "Follow chain of command for appeals and disputes."
    ]
  }
];

export const seedStaff = [
  {
    id: "u1",
    name: "Avery Stone",
    discordTag: "avery#1001",
    rankKey: "director",
    rankTitle: "Director",
    grade: 99,
    erlcCalls: 61,
    patrolHours: 28
  },
  {
    id: "u2",
    name: "Jordan Cross",
    discordTag: "jcross#2210",
    rankKey: "admin",
    rankTitle: "Administrator",
    grade: 95,
    erlcCalls: 53,
    patrolHours: 24
  },
  {
    id: "u3",
    name: "Riley Brooks",
    discordTag: "riley#7711",
    rankKey: "senior_mod",
    rankTitle: "Senior Moderator",
    grade: 92,
    erlcCalls: 48,
    patrolHours: 21
  },
  {
    id: "u4",
    name: "Casey Lane",
    discordTag: "casey#3321",
    rankKey: "moderator",
    rankTitle: "Moderator",
    grade: 88,
    erlcCalls: 41,
    patrolHours: 17
  },
  {
    id: "u5",
    name: "Morgan Lee",
    discordTag: "mlee#4402",
    rankKey: "junior_mod",
    rankTitle: "Junior Moderator",
    grade: 84,
    erlcCalls: 29,
    patrolHours: 13
  },
  {
    id: "u6",
    name: "Taylor Reed",
    discordTag: "treed#1010",
    rankKey: "cadet",
    rankTitle: "Cadet",
    grade: 78,
    erlcCalls: 18,
    patrolHours: 8
  }
];

export const seedPunishments = [
  {
    id: "p1",
    category: "Strike",
    targetId: "u5",
    targetName: "Morgan Lee",
    reason: "Missed two patrol reports without notice.",
    status: "Active",
    duration: "14 days",
    issuedBy: "Jordan Cross",
    date: "2026-03-11"
  },
  {
    id: "p2",
    category: "Infraction",
    targetId: "u6",
    targetName: "Taylor Reed",
    reason: "Improper radio formatting during patrol.",
    status: "Served",
    duration: "Coaching only",
    issuedBy: "Riley Brooks",
    date: "2026-03-08"
  }
];

export const initialState = {
  activeUserId: "u2",
  staff: seedStaff,
  punishments: seedPunishments
};

export function buildLeaderboard(staff) {
  return [...staff]
    .map((member) => ({
      ...member,
      score: member.grade + member.erlcCalls + member.patrolHours * 2
    }))
    .sort((left, right) => right.score - left.score);
}

export function createPunishmentRecord({
  targetId,
  targetName,
  category,
  reason,
  status,
  duration,
  issuedBy
}) {
  return {
    id: `p${Date.now()}`,
    targetId,
    targetName,
    category,
    reason: reason || "No reason provided.",
    status,
    duration,
    issuedBy,
    date: new Date().toISOString().slice(0, 10)
  };
}

export function getErlcSummary() {
  return {
    serverName: "TLRP Main Server",
    activeUnits: 23,
    queueLength: 4,
    moderationAlerts: 2
  };
}

export function getDiscordSummary() {
  return {
    guildName: "TLRP Community",
    onlineMembers: 142,
    ticketBacklog: 5,
    staffChannelSync: "Healthy"
  };
}
