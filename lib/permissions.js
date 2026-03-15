export const RANKS = [
  { key: "cadet", label: "Cadet", level: 1 },
  { key: "junior_mod", label: "Junior Moderator", level: 2 },
  { key: "moderator", label: "Moderator", level: 3 },
  { key: "senior_mod", label: "Senior Moderator", level: 4 },
  { key: "admin", label: "Administrator", level: 5 },
  { key: "director", label: "Director", level: 6 }
];

export function getRank(rankKey) {
  return RANKS.find((rank) => rank.key === rankKey) || RANKS[0];
}

export function outranks(actorKey, targetKey) {
  return getRank(actorKey).level > getRank(targetKey).level;
}

export function canEditGrade(actorKey, targetKey) {
  return getRank(actorKey).level >= 4 && outranks(actorKey, targetKey);
}

export function canIssuePunishment(actorKey, targetKey) {
  return getRank(actorKey).level >= 3 && outranks(actorKey, targetKey);
}
