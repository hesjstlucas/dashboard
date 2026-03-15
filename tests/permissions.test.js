import test from "node:test";
import assert from "node:assert/strict";
import {
  canChangeGrades,
  canEditGuidelines,
  canGrantLeaderboardPoints,
  canIssuePunishment,
  canRunAdminCommands,
  canRunModerationCommands,
  outranks
} from "../lib/permissions.js";

test("rank order only allows higher roles to outrank lower roles", () => {
  assert.equal(outranks("directive", "management"), true);
  assert.equal(outranks("moderation", "ia"), false);
});

test("moderation and administration command access follows the rank ladder", () => {
  assert.equal(canRunModerationCommands("moderation"), true);
  assert.equal(canRunAdminCommands("administration"), true);
  assert.equal(canRunAdminCommands("moderation"), false);
});

test("IA and above can punish or edit grades for lower ranks", () => {
  assert.equal(canIssuePunishment("ia", "administration"), true);
  assert.equal(canChangeGrades("management", "ia"), true);
  assert.equal(canChangeGrades("administration", "moderation"), false);
});

test("management controls points and directive controls guidelines", () => {
  assert.equal(canGrantLeaderboardPoints("management", "ia"), true);
  assert.equal(canGrantLeaderboardPoints("ia", "moderation"), false);
  assert.equal(canEditGuidelines("directive"), true);
  assert.equal(canEditGuidelines("management"), false);
});
