import test from "node:test";
import assert from "node:assert/strict";
import { canEditGrade, canIssuePunishment, outranks } from "../lib/permissions.js";

test("higher ranks outrank lower ranks", () => {
  assert.equal(outranks("director", "admin"), true);
  assert.equal(outranks("cadet", "director"), false);
});

test("grade editing requires senior moderator or above", () => {
  assert.equal(canEditGrade("senior_mod", "moderator"), true);
  assert.equal(canEditGrade("moderator", "junior_mod"), false);
  assert.equal(canEditGrade("admin", "admin"), false);
});

test("punishment permissions require moderator or above", () => {
  assert.equal(canIssuePunishment("moderator", "cadet"), true);
  assert.equal(canIssuePunishment("junior_mod", "cadet"), false);
  assert.equal(canIssuePunishment("director", "director"), false);
});
