import test from "node:test";
import assert from "node:assert/strict";
import {
  createGuidelineLink,
  normalizeGuidelines,
  toExternalUrl
} from "../lib/guidelines.js";

test("normalizeGuidelines backfills missing website button arrays", () => {
  const [entry] = normalizeGuidelines([
    {
      id: "g1",
      title: "Example",
      content: "Body"
    }
  ]);

  assert.deepEqual(entry.links, []);
});

test("createGuidelineLink gives new buttons sane defaults", () => {
  const link = createGuidelineLink();

  assert.equal(link.label, "Website button");
  assert.equal(link.url, "https://");
  assert.match(link.id, /^gl/);
});

test("toExternalUrl keeps absolute urls and prefixes bare domains", () => {
  assert.equal(toExternalUrl("https://staff.tlrpx.com"), "https://staff.tlrpx.com");
  assert.equal(toExternalUrl("staff.tlrpx.com/guidelines"), "https://staff.tlrpx.com/guidelines");
});
