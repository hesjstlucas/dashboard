import test from "node:test";
import assert from "node:assert/strict";
import {
  DISCORD_ROLE_GROUPS,
  resolveHighestRankFromRoleIds
} from "../lib/discord-role-groups.js";

test("highest matching Discord role group wins", () => {
  const moderationRoleId = DISCORD_ROLE_GROUPS.moderation[0];
  const managementRoleId = DISCORD_ROLE_GROUPS.management[0];

  assert.equal(
    resolveHighestRankFromRoleIds([moderationRoleId, managementRoleId]),
    "management"
  );
});

test("users without a configured role group fall back to guest", () => {
  assert.equal(resolveHighestRankFromRoleIds(["unknown-role-id"]), "guest");
});
