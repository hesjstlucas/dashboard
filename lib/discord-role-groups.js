export const DISCORD_ROLE_GROUPS = {
  moderation: [
    "1464766424043229477",
    "1482865661762867402"
  ],
  administration: [
    "1464766429265006905",
    "1482865682088460439"
  ],
  ia: [
    "1464766447988375716",
    "1482865713755717693"
  ],
  management: [
    "1464766450387521536",
    "1482865737038041159"
  ],
  directive: [
    "1464766456590762076",
    "1482865758617731154"
  ]
};

const ROLE_PRIORITY = [
  "directive",
  "management",
  "ia",
  "administration",
  "moderation"
];

export function resolveHighestRankFromRoleIds(roleIds = []) {
  for (const rankKey of ROLE_PRIORITY) {
    const configuredIds = DISCORD_ROLE_GROUPS[rankKey] || [];
    if (configuredIds.some((roleId) => roleIds.includes(roleId))) {
      return rankKey;
    }
  }

  return "guest";
}
