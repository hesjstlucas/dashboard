import test from "node:test";
import assert from "node:assert/strict";
import { resolveHighestRankFromRoleIds } from "../lib/discord-role-groups.js";

test("highest matching Discord role group wins", () => {
  assert.equal(
    resolveHighestRankFromRoleIds([
      "test-moderation-role-id-1",
      "test-management-role-id-2"
    ]),
    "management"
  );
});

test("users without a configured role group fall back to guest", () => {
  assert.equal(resolveHighestRankFromRoleIds(["unknown-role-id"]), "guest");
});
