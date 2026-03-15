export const RANKS = [
  {
    key: "moderation",
    label: "Moderation",
    level: 1,
    description: "Can view their own overview and run ER:LC moderation commands."
  },
  {
    key: "administration",
    label: "Administration",
    level: 2,
    description: "Can run ER:LC administration commands."
  },
  {
    key: "ia",
    label: "Internal Affairs",
    level: 3,
    description: "Can punish and change grades for lower-ranking staff."
  },
  {
    key: "management",
    label: "Management",
    level: 4,
    description: "Can punish, change grades, and grant leaderboard points."
  },
  {
    key: "directive",
    label: "Directive",
    level: 5,
    description: "Full access, including guidelines editing and system-wide controls."
  }
];

export function getRank(rankKey) {
  return (
    RANKS.find((rank) => rank.key === rankKey) || {
      key: "guest",
      label: "Guest",
      level: 0,
      description: "Unauthenticated access."
    }
  );
}

export function isDirective(actorKey) {
  return getRank(actorKey).key === "directive";
}

export function outranks(actorKey, targetKey) {
  return getRank(actorKey).level > getRank(targetKey).level;
}

export function canViewIdentities(isAuthenticated) {
  return Boolean(isAuthenticated);
}

export function canRunModerationCommands(actorKey) {
  return getRank(actorKey).level >= 1;
}

export function canRunAdminCommands(actorKey) {
  return getRank(actorKey).level >= 2;
}

export function canChangeGrades(actorKey, targetKey) {
  return isDirective(actorKey) || (getRank(actorKey).level >= 3 && outranks(actorKey, targetKey));
}

export function canIssuePunishment(actorKey, targetKey) {
  return isDirective(actorKey) || (getRank(actorKey).level >= 3 && outranks(actorKey, targetKey));
}

export function canGrantLeaderboardPoints(actorKey, targetKey) {
  return isDirective(actorKey) || (getRank(actorKey).level >= 4 && outranks(actorKey, targetKey));
}

export function canEditGuidelines(actorKey) {
  return getRank(actorKey).level >= 5;
}

export function abilitySummary(actorKey) {
  const rank = getRank(actorKey);

  return {
    rank,
    canRunModerationCommands: canRunModerationCommands(actorKey),
    canRunAdminCommands: canRunAdminCommands(actorKey),
    canChangeGrades: rank.level >= 3,
    canIssuePunishment: rank.level >= 3,
    canGrantLeaderboardPoints: rank.level >= 4,
    canEditGuidelines: rank.level >= 5
  };
}
